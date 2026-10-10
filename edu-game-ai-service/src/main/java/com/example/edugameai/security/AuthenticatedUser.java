package com.example.edugameai.security;

import java.util.Optional;

/**
 * Người dùng đang gọi AI Service, đã được backend chính xác thực.
 *
 * <p>Không bao giờ tin {@code studentId} do client gửi kèm — mọi quyết định phân quyền
 * đều dựa trên {@link #id()} và {@link #role()} lấy từ token.
 */
public record AuthenticatedUser(String id, String username, String displayName, String role, boolean authenticated) {

    public static AuthenticatedUser anonymous() {
        return new AuthenticatedUser(null, null, null, "anonymous", false);
    }

    public boolean isStaff() {
        return "teacher".equals(role) || "admin".equals(role);
    }

    /** Khóa rate limit: ưu tiên id đã xác thực, không có thì dùng IP. */
    public String rateLimitKey(String remoteIp) {
        return authenticated && id != null ? "u:" + id : "ip:" + (remoteIp == null ? "unknown" : remoteIp);
    }

    /** Tên hiển thị an toàn dùng trong prompt (không gửi id hay email cho LLM). */
    public Optional<String> safeName() {
        if (displayName != null && !displayName.isBlank()) {
            return Optional.of(displayName.strip());
        }
        if (username != null && !username.isBlank()) {
            return Optional.of(username.strip());
        }
        return Optional.empty();
    }
}