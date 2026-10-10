package com.example.edugameai.client;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.example.edugameai.config.AiProperties;
import com.example.edugameai.exception.AiErrors;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * Gọi Ollama qua API {@code /api/chat} (native, không phải OpenAI-compatible) bằng
 * {@link RestClient} của spring-web.
 *
 * <h2>Vì sao không dùng spring-ai-starter-model-ollama</h2>
 * Integration Ollama của Spring AI không gửi header {@code Authorization}. Trong khi đó
 * {@code OLLAMA_KEY} là bắt buộc với Ollama Cloud / gateway từ xa, và kế hoạch yêu cầu
 * đọc key này từ cấu hình backend. Vì vậy gateway tự dựng HTTP client để kiểm soát
 * đầy đủ: header xác thực, timeout, retry và ánh xạ lỗi.
 *
 * <h2>Quy tắc bảo mật</h2>
 * <ul>
 *   <li>Key chỉ đọc từ {@link AiProperties#apiKey()}; không bao giờ log giá trị.
 *   <li>Key rỗng ⇒ KHÔNG gắn header (Ollama local không cần xác thực) và ứng dụng vẫn khởi động bình thường.
 *   <li>Chỉ log mã lỗi HTTP, không log body lỗi (có thể chứa thông tin nội bộ của provider).
 * </ul>
 */
public class OllamaChatGateway implements AiChatGateway {

    private static final Logger log = LoggerFactory.getLogger(OllamaChatGateway.class);

    private final RestClient restClient;
    private final AiProperties properties;
    private final ObjectMapper objectMapper;

    public OllamaChatGateway(RestClient ollamaRestClient, AiProperties properties, ObjectMapper objectMapper) {
        this.restClient = ollamaRestClient;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public String complete(AiMessage system, List<AiMessage> messages) {
        return call(system, messages, false);
    }

    @Override
    public String completeJson(AiMessage system, List<AiMessage> messages) {
        return call(system, messages, true);
    }

    private String call(AiMessage system, List<AiMessage> messages, boolean jsonMode) {
        requireConfigured();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", properties.model());
        body.put("stream", false);
        body.put("messages", toWireMessages(system, messages));

        if (jsonMode) {
            // Ollama ép model trả về JSON hợp lệ — giảm tỉ lệ parse lỗi.
            body.put("format", "json");
        }

        Map<String, Object> options = new LinkedHashMap<>();
        options.put("temperature", properties.generation().temperature());
        body.put("options", options);

        try {
            String raw = restClient.post()
                    .uri("/api/chat")
                    .headers(h -> applyAuth(h))
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            return extractContent(raw);
        } catch (RestClientResponseException e) {
            throw translate(e);
        } catch (ResourceAccessException e) {
            log.warn("Không kết nối được Ollama tại {}: {}", properties.baseUrl(), e.getMessage());
            throw new AiErrors.ProviderUnavailable(
                    "Không kết nối được dịch vụ AI. Hãy kiểm tra Ollama có đang chạy không.", e);
        }
    }

    @Override
    public HealthStatus health() {
        if (properties.baseUrl().isBlank() || properties.model().isBlank()) {
            return HealthStatus.down("Chưa cấu hình OLLAMA_BASE_URL / OLLAMA_MODEL.");
        }
        try {
            String raw = restClient.get()
                    .uri("/api/tags")
                    .headers(h -> applyAuth(h))
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);
            JsonNode root = objectMapper.readTree(raw == null ? "{}" : raw);
            boolean modelPresent = false;
            for (JsonNode m : root.path("models")) {
                String name = m.path("name").asText("");
                if (name.equals(properties.model()) || name.startsWith(properties.model() + ":")) {
                    modelPresent = true;
                    break;
                }
            }
            if (!modelPresent) {
                return HealthStatus.down("Model '" + properties.model() + "' chưa có trên endpoint. Chạy: ollama pull "
                        + properties.model());
            }
            return HealthStatus.ok("Ollama sẵn sàng, model " + properties.model());
        } catch (Exception e) {
            return HealthStatus.down("Không gọi được Ollama (" + e.getClass().getSimpleName() + ").");
        }
    }

    /**
     * Chỉ gắn {@code Authorization} khi thực sự có key. Endpoint local không có key
     * vẫn chạy bình thường — đúng nguyên tắc "không giả định mọi endpoint đều cần key".
     */
    private void applyAuth(org.springframework.http.HttpHeaders headers) {
        String key = properties.apiKey();
        if (key != null && !key.isBlank()) {
            headers.setBearerAuth(key.strip());
        }
    }

    private void requireConfigured() {
        if (properties.baseUrl() == null || properties.baseUrl().isBlank()) {
            throw new AiErrors.Configuration(
                    "AI Service chưa cấu hình OLLAMA_BASE_URL. Hãy đặt biến môi trường này rồi khởi động lại.");
        }
        if (properties.model() == null || properties.model().isBlank()) {
            throw new AiErrors.Configuration(
                    "AI Service chưa cấu hình OLLAMA_MODEL. Hãy đặt biến môi trường này rồi khởi động lại.");
        }
    }

    private List<Map<String, String>> toWireMessages(AiMessage system, List<AiMessage> messages) {
        List<Map<String, String>> wire = new ArrayList<>();
        if (system != null && system.content() != null && !system.content().isBlank()) {
            wire.add(Map.of("role", "system", "content", system.content()));
        }
        for (AiMessage m : messages) {
            if (m == null || m.content() == null || m.content().isBlank()) {
                continue;
            }
            wire.add(Map.of("role", m.role(), "content", m.content()));
        }
        return wire;
    }

    /** Rút {@code message.content} từ response của Ollama. */
    private String extractContent(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new AiErrors.InvalidModelResponse("Dịch vụ AI trả về nội dung rỗng.");
        }
        try {
            JsonNode content = objectMapper.readTree(raw).path("message").path("content");
            String text = content.isMissingNode() || content.isNull() ? null : content.asText(null);
            if (text == null || text.isBlank()) {
                throw new AiErrors.InvalidModelResponse("Dịch vụ AI trả về nội dung rỗng.");
            }
            return text;
        } catch (AiErrors.InvalidModelResponse e) {
            throw e;
        } catch (Exception e) {
            log.warn("Không đọc được phản hồi của Ollama: {}", e.getMessage());
            throw new AiErrors.InvalidModelResponse("Dịch vụ AI trả về dữ liệu không đúng định dạng.");
        }
    }

    /** Dịch lỗi HTTP của provider thành lỗi nghiệp vụ rõ ràng, không lộ chi tiết ra ngoài. */
    private RuntimeException translate(RestClientResponseException e) {
        HttpStatusCode status = e.getStatusCode();
        int code = status.value();
        if (code == 401 || code == 403) {
            log.error("Ollama từ chối xác thực (HTTP {}). Kiểm tra OLLAMA_KEY.", code);
            return new AiErrors.Configuration(
                    "Dịch vụ AI từ chối xác thực. Hãy kiểm tra lại OLLAMA_KEY hoặc endpoint đang dùng.");
        }
        if (code == 404) {
            log.error("Ollama trả 404 — endpoint hoặc model không tồn tại (model={}).", properties.model());
            return new AiErrors.Configuration(
                    "Không tìm thấy model '" + properties.model()
                            + "' trên endpoint này. Kiểm tra OLLAMA_MODEL hoặc chạy 'ollama pull'.");
        }
        if (code == 400) {
            log.warn("Ollama trả 400 — request không hợp lệ với model này.");
            return new AiErrors.InvalidRequest("Yêu cầu không được model chấp nhận. Hãy thử lại với nội dung khác.");
        }
        log.warn("Ollama trả HTTP {} — loại lỗi: {}", code, status);
        return new AiErrors.ProviderUnavailable("Dịch vụ AI đang lỗi. Vui lòng thử lại sau.");
    }
}