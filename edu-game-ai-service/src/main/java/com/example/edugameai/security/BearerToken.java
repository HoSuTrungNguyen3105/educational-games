package com.example.edugameai.security;

/**
 * Bearer token thô của request hiện tại, để chuyển tiếp nguyên vẹn sang backend chính.
 *
 * <p>Chỉ dùng khi AI Service cần backend chính xác thực lại đúng người gọi — ví dụ đọc
 * ngữ cảnh câu hỏi tại {@code POST /api/questions/explain-context}. Token KHÔNG được log,
 * KHÔNG đưa vào prompt và không quyết định quyền (quyền do {@link AuthenticatedUser} đảm nhiệm).
 */
public record BearerToken(String value) {

    public boolean present() {
        return value != null && !value.isBlank();
    }
}