package com.example.edugameai.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;

import com.example.edugameai.config.CoreApiProperties;
import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import com.example.edugameai.dto.core.CoreUser;
import com.example.edugameai.exception.AiErrors;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * Cầu nối tới backend nghiệp vụ hiện tại (Node/Express).
 *
 * <p>AI Service không có database riêng và không sở hữu nghiệp vụ nào — nó chỉ ĐỌC qua
 * các API đã có: xác thực token, lấy danh sách game và lấy kết quả học tập.
 * Nhờ vậy không phải nhân bản schema, không phải sửa API cũ, và nguồn sự thật vẫn là
 * backend chính.
 */
public class CoreBackendClient {

    private static final Logger log = LoggerFactory.getLogger(CoreBackendClient.class);

    /** Mỗi trang games trả về tối đa 50 bản ghi (xem {@code gameService.list}). */
    private static final int GAME_PAGE_SIZE = 50;

    private final RestClient restClient;
    private final CoreApiProperties properties;
    private final ObjectMapper objectMapper;

    /** Cache danh sách game: gần như tĩnh trong suốt một lần phân tích. */
    private volatile Map<String, CoreGame> gameIndex = Map.of();
    private final ReentrantLock gameIndexLock = new ReentrantLock();

    public CoreBackendClient(RestClient coreRestClient, CoreApiProperties properties, ObjectMapper objectMapper) {
        this.restClient = coreRestClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public CoreApiProperties properties() {
        return properties;
    }

    /**
     * Xác thực Bearer token bằng chính backend chính.
     *
     * @return thông tin người dùng, hoặc {@link Optional#empty()} nếu token không hợp lệ
     * @throws AiErrors.CoreBackendUnavailable nếu không gọi được backend (KHÁC hẳn token sai)
     */
    public Optional<CoreUser> authenticate(String bearerToken) {
        if (bearerToken == null || bearerToken.isBlank()) {
            return Optional.empty();
        }
        requireEnabled();
        JsonNode data = get("/auth/me", bearerToken);
        if (data == null || !data.isObject() || data.path("id").asText("").isBlank()) {
            return Optional.empty();
        }
        return Optional.of(new CoreUser(
                data.path("id").asText(null),
                data.path("username").asText(null),
                data.path("name").asText(null),
                data.path("role").asText("student")));
    }

    /**
     * Lấy toàn bộ kết quả học tập. Việc lọc theo người dùng / ngày / game thực hiện ở service
     * phía Java, SAU khi đã kiểm tra quyền truy cập.
     */
    public List<CoreResult> listResults() {
        requireEnabled();
        return getList("/results", new TypeReference<List<CoreResult>>() {
        });
    }

    /** Map {@code gameId} (có thể là {@code _id} hoặc {@code code}) → game. */
    public Map<String, CoreGame> gameIndex() {
        Map<String, CoreGame> cached = gameIndex;
        if (!cached.isEmpty()) {
            return cached;
        }
        gameIndexLock.lock();
        try {
            if (!gameIndex.isEmpty()) {
                return gameIndex;
            }
            List<CoreGame> games = new ArrayList<>();
            for (int page = 1; page <= Math.max(1, properties.maxGamePages()); page++) {
                int from = (page - 1) * GAME_PAGE_SIZE + 1;
                int to = from + GAME_PAGE_SIZE - 1;
                List<CoreGame> batch = getGamesPage(from, to);
                if (batch.isEmpty()) {
                    break;
                }
                games.addAll(batch);
                if (batch.size() < GAME_PAGE_SIZE) {
                    break;
                }
            }
            Map<String, CoreGame> index = new HashMap<>();
            for (CoreGame g : games) {
                put(index, g.mongoId(), g);
                put(index, g.id(), g);
                put(index, g.code(), g);
            }
            gameIndex = Map.copyOf(index);
            return gameIndex;
        } finally {
            gameIndexLock.unlock();
        }
    }

    private List<CoreGame> getGamesPage(int from, int to) {
        requireEnabled();
        try {
            String raw = restClient.get()
                    .uri("/games?from={from}&to={to}", from, to)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);
            JsonNode data = unwrapEnvelope(raw, "/games");
            if (data == null || !data.isArray()) {
                return List.of();
            }
            List<CoreGame> out = new ArrayList<>();
            for (JsonNode n : data) {
                out.add(new CoreGame(
                        text(n, "_id"), text(n, "id"), text(n, "code"),
                        text(n, "name"), text(n, "subject"), text(n, "topic")));
            }
            return out;
        } catch (RestClientResponseException e) {
            throw translate(e, "/games");
        } catch (ResourceAccessException e) {
            throw unavailable(e, "/games");
        }
    }

    private void put(Map<String, CoreGame> map, String key, CoreGame game) {
        if (key != null && !key.isBlank()) {
            map.put(key, game);
        }
    }

    private String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        return v == null || v.isNull() ? null : v.asText(null);
    }

    private JsonNode get(String path, String bearerToken) {
        requireEnabled();
        try {
            String raw = restClient.get()
                    .uri(path)
                    .headers(h -> applyBearer(h, bearerToken))
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);
            return unwrapEnvelope(raw, path);
        } catch (RestClientResponseException e) {
            throw translate(e, path);
        } catch (ResourceAccessException e) {
            throw unavailable(e, path);
        }
    }

    private <T> List<T> getList(String path, TypeReference<List<T>> type) {
        requireEnabled();
        try {
            String raw = restClient.get()
                    .uri(path)
                    .headers(h -> applyBearer(h, null))
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);
            JsonNode data = unwrapEnvelope(raw, path);
            if (data == null || !data.isArray()) {
                return List.of();
            }
            return objectMapper.convertValue(data, type);
        } catch (RestClientResponseException e) {
            throw translate(e, path);
        } catch (ResourceAccessException e) {
            throw unavailable(e, path);
        }
    }

    private void applyBearer(HttpHeaders headers, String bearerToken) {
        if (bearerToken != null && !bearerToken.isBlank()) {
            headers.setBearerAuth(bearerToken);
        }
    }

    private void requireEnabled() {
        if (!properties.enabled()) {
            throw new AiErrors.Configuration(
                    "AI Service chưa bật kết nối backend hệ thống (EDU_CORE_ENABLED=false).");
        }
    }

    /**
     * Bóc envelope {@code {status, code, msg, data}} của backend chính.
     *
     * @throws AiErrors.Unauthenticated nếu backend trả 401/403
     * @throws AiErrors.CoreBackendUnavailable nếu backend trả lỗi hoặc trả dữ liệu lạ
     */
    private JsonNode unwrapEnvelope(String raw, String path) {
        if (raw == null || raw.isBlank()) {
            throw new AiErrors.CoreBackendUnavailable("Hệ thống dữ liệu trả về phản hồi rỗng.");
        }
        JsonNode root;
        try {
            root = objectMapper.readTree(raw);
        } catch (Exception e) {
            log.warn("Không đọc được phản hồi từ backend chính tại {}: {}", path, e.getMessage());
            throw new AiErrors.CoreBackendUnavailable("Hệ thống dữ liệu trả về dữ liệu không đọc được.");
        }
        if (root.has("status") && !root.path("status").asBoolean(true)) {
            int code = root.path("code").asInt(500);
            log.warn("Backend chính trả lỗi tại {}: code={} msg={}", path, code, root.path("msg").asText(""));
            if (code == 401 || code == 403) {
                throw new AiErrors.Unauthenticated("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
            }
            throw new AiErrors.CoreBackendUnavailable("Hệ thống dữ liệu đang không khả dụng.");
        }
        return root.has("data") ? root.get("data") : root;
    }

    private AiErrors.CoreBackendUnavailable unavailable(ResourceAccessException e, String path) {
        log.warn("Không gọi được backend chính tại {} ({}). base-url={}", path, e.getMessage(), properties.baseUrl());
        return new AiErrors.CoreBackendUnavailable("Không kết nối được hệ thống dữ liệu. Vui lòng thử lại sau.", e);
    }

    private RuntimeException translate(RestClientResponseException e, String path) {
        int code = e.getStatusCode().value();
        log.warn("Backend chính trả HTTP {} tại {}", code, path);
        if (code == 401 || code == 403) {
            return new AiErrors.Unauthenticated("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
        }
        if (code == 503) {
            return new AiErrors.CoreBackendUnavailable("Hệ thống dữ liệu đang khởi động. Vui lòng thử lại sau.");
        }
        if (code == 404) {
            return new AiErrors.CoreBackendUnavailable("Hệ thống dữ liệu không có dữ liệu ở " + path + ".");
        }
        return new AiErrors.CoreBackendUnavailable("Hệ thống dữ liệu đang không khả dụng.");
    }
}