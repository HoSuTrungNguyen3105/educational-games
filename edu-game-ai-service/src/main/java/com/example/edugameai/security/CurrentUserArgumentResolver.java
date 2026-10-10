package com.example.edugameai.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.example.edugameai.client.CoreBackendClient;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.dto.core.CoreUser;
import com.example.edugameai.exception.AiErrors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Cho phép controller nhận thẳng {@link AuthenticatedUser} mà không phải tự đọc header.
 *
 * <p>Hai đường xác thực, theo đúng thứ tự ưu tiên:
 * <ol>
 *   <li><b>Service-to-service (đích)</b> — Backend chính đã xác thực người dùng rồi chuyển
 *       tiếp danh tính kèm header {@code X-Ai-Internal-Token}. Không có request nào gọi vòng
 *       lại Backend chính trong luồng này. Danh tính chỉ được tin khi service token khớp.
 *   <li><b>Bearer token của người dùng (legacy)</b> — chỉ dùng để chạy thử local và cho các
 *       test cũ; tắt bằng {@code EDU_AI_LEGACY_BEARER_AUTH=false}. Đường này gọi
 *       {@code GET /api/auth/me} của Backend chính để xác thực thật, cache ngắn theo hash
 *       của token.
 * </ol>
 *
 * <p>Ngoài ra resolver này còn hỗ trợ {@link BearerToken} — trả về token thô để dùng cho
 * đường legacy. Ở đường internal, {@link BearerToken} luôn rỗng vì AI Service không được
 * phép dùng token người dùng làm service token.
 *
 * <p>Không tự giải mã JWT vì AI Service không có (và không nên có) {@code JWT_SECRET}.
 */
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private static final Logger log = LoggerFactory.getLogger(CurrentUserArgumentResolver.class);

    /** Header service token do Backend chính gửi kèm. */
    public static final String INTERNAL_TOKEN_HEADER = "X-Ai-Internal-Token";
    /** Header danh tính người dùng — CHỈ đọc khi service token khớp. */
    public static final String INTERNAL_USER_ID_HEADER = "X-Ai-User-Id";
    public static final String INTERNAL_USER_NAME_HEADER = "X-Ai-User-Name";
    public static final String INTERNAL_USER_ROLE_HEADER = "X-Ai-User-Role";
    /** Header IP thật để tính rate limit khi Backend chính làm trung gian. */
    public static final String INTERNAL_CLIENT_IP_HEADER = "X-Ai-Client-Ip";

    /** Cache tối đa 30s: đủ để một lượt chat nhiều lượt gọi không bị xác thực lặp lại. */
    private static final Duration CACHE_TTL = Duration.ofSeconds(30);
    private static final int MAX_CACHE_ENTRIES = 5_000;

    private final CoreBackendClient coreBackendClient;
    private final AiProperties properties;

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public CurrentUserArgumentResolver(CoreBackendClient coreBackendClient, AiProperties properties) {
        this.coreBackendClient = coreBackendClient;
        this.properties = properties;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        Class<?> type = parameter.getParameterType();
        return AuthenticatedUser.class.equals(type) || BearerToken.class.equals(type);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        String authorization = webRequest.getHeader("Authorization");
        String token = extractBearer(authorization);

        if (BearerToken.class.equals(parameter.getParameterType())) {
            // Chỉ trả token thô; KHÔNG xác thực ở đây. Ở đường internal token rỗng vì
            // AI Service không được phép dùng token người dùng làm service token.
            return new BearerToken(token);
        }

        AuthenticatedUser internal = resolveInternal(webRequest);
        if (internal != null) {
            return internal;
        }

        return resolveLegacy(token);
    }

    /**
     * Xác thực service-to-service.
     *
     * @return {@code null} khi không có internal token hoặc token sai — khi đó mới thử
     *         đường legacy (nếu còn bật). Token sai KHÔNG được rơi về legacy để tránh
     *         việc ai đó gửi token sai rồi lọt qua bằng Bearer.
     */
    private AuthenticatedUser resolveInternal(NativeWebRequest webRequest) {
        AiProperties.Internal internal = properties.internal();
        if (!internal.enabled()) {
            return null;
        }
        String presented = webRequest.getHeader(INTERNAL_TOKEN_HEADER);
        if (presented == null || presented.isBlank()) {
            return null;
        }
        if (!constantTimeEquals(internal.token(), presented)) {
            log.warn("Từ chối request có service token sai từ Backend chính.");
            throw new AiErrors.Unauthenticated("Service token không hợp lệ.");
        }

        String userId = trim(webRequest.getHeader(INTERNAL_USER_ID_HEADER));
        if (userId == null) {
            log.warn("Request nội bộ thiếu header {}", INTERNAL_USER_ID_HEADER);
            throw new AiErrors.Unauthenticated("Thiếu định danh người dùng trong request nội bộ.");
        }
        String name = trim(webRequest.getHeader(INTERNAL_USER_NAME_HEADER));
        String role = trim(webRequest.getHeader(INTERNAL_USER_ROLE_HEADER));
        if (role == null) {
            role = "student";
        }
        log.debug("Xác thực nội bộ cho user role={}", role);
        return new AuthenticatedUser(userId, null, name, role, true);
    }

    /** Đường legacy: Bearer token → xác thực thật qua Backend chính → cache ngắn. */
    private AuthenticatedUser resolveLegacy(String token) {
        AiProperties.Internal internal = properties.internal();
        if (internal.enabled() && !internal.legacyBearerAuthEnabled()) {
            throw new AiErrors.Unauthenticated(
                    "AI Service chỉ nhận request từ Backend chính qua service token.");
        }
        if (token.isBlank()) {
            if (properties.auth().required()) {
                throw new AiErrors.Unauthenticated("Bạn cần đăng nhập để dùng chức năng AI.");
            }
            return AuthenticatedUser.anonymous();
        }

        AuthenticatedUser cached = fromCache(token);
        if (cached != null) {
            return cached;
        }

        Optional<CoreUser> user = coreBackendClient.authenticate(token);
        if (user.isEmpty()) {
            throw new AiErrors.Unauthenticated("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
        }
        CoreUser u = user.get();
        AuthenticatedUser resolved = new AuthenticatedUser(u.id(), u.username(), u.name(), u.role(), true);
        putInCache(token, resolved);
        return resolved;
    }

    private String trim(String header) {
        if (header == null) {
            return null;
        }
        String v = header.strip();
        return v.isEmpty() ? null : cap(v, 120);
    }

    private String cap(String value, int max) {
        return value.length() <= max ? value : value.substring(0, max);
    }

    /** So sánh constant-time để không rò rỉ tiền tố của secret qua thời gian. */
    private boolean constantTimeEquals(String expected, String presented) {
        return java.security.MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8), presented.getBytes(StandardCharsets.UTF_8));
    }

    private String extractBearer(String header) {
        if (header == null) {
            return "";
        }
        String h = header.strip();
        if (!h.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return "";
        }
        return h.substring(7).strip();
    }

    private AuthenticatedUser fromCache(String token) {
        CacheEntry entry = cache.get(hash(token));
        if (entry == null) {
            return null;
        }
        if (entry.expiresAt().isBefore(Instant.now())) {
            cache.remove(hash(token));
            return null;
        }
        return entry.user();
    }

    private void putInCache(String token, AuthenticatedUser user) {
        if (cache.size() >= MAX_CACHE_ENTRIES) {
            evictExpired();
            if (cache.size() >= MAX_CACHE_ENTRIES) {
                return;
            }
        }
        cache.put(hash(token), new CacheEntry(user, Instant.now().plus(CACHE_TTL)));
    }

    private void evictExpired() {
        Instant now = Instant.now();
        cache.entrySet().removeIf(e -> e.getValue().expiresAt().isBefore(now));
        log.debug("Đã dọn cache phiên đăng nhập của AI Service, còn {} mục", cache.size());
    }

    /** Chỉ lưu hash của token trong bộ nhớ — không giữ bản token thô. */
    private String hash(String token) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            return Integer.toHexString(token.hashCode());
        }
    }

    private record CacheEntry(AuthenticatedUser user, Instant expiresAt) {
    }
}