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
 * <p>Quy trình: lấy {@code Authorization: Bearer} → gọi {@code GET /api/auth/me} của backend
 * chính để xác thực thật → cache ngắn theo hash của token.
 *
 * <p>Không tự giải mã JWT vì AI Service không có (và không nên có) {@code JWT_SECRET}.
 * Nhờ vậy quy tắc xác thực chỉ nằm ở một chỗ duy nhất và không thể lệch với backend chính.
 */
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private static final Logger log = LoggerFactory.getLogger(CurrentUserArgumentResolver.class);

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
        return AuthenticatedUser.class.equals(parameter.getParameterType());
    }

    @Override
    public AuthenticatedUser resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                              NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        String token = extractBearer(webRequest.getHeader("Authorization"));

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