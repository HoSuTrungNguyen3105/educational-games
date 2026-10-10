package com.example.edugameai.exception;

import org.springframework.http.HttpStatus;

/**
 * Các loại lỗi cụ thể của AI Service.
 *
 * <p>Phân loại rõ ràng để frontend hiển thị đúng thông báo và để log kỹ thuật đủ để chẩn đoán
 * mà không rò rỉ chi tiết ra ngoài.
 */
public final class AiErrors {

    private AiErrors() {
    }

    /** Dữ liệu vào không hợp lệ (thiếu trường, quá dài, vượt giới hạn). → 400 */
    public static class InvalidRequest extends AiException {
        public InvalidRequest(String message) {
            super(HttpStatus.BAD_REQUEST, message);
        }
    }

    /** Thiếu token hoặc token không còn hợp lệ. → 401 */
    public static class Unauthenticated extends AiException {
        public Unauthenticated(String message) {
            super(HttpStatus.UNAUTHORIZED, message);
        }
    }

    /** Đã đăng nhập nhưng không đủ quyền. → 403 */
    public static class Forbidden extends AiException {
        public Forbidden(String message) {
            super(HttpStatus.FORBIDDEN, message);
        }
    }

    /** Vượt giới hạn tần suất. → 429 */
    public static class RateLimited extends AiException {
        public RateLimited(String message) {
            super(HttpStatus.TOO_MANY_REQUESTS, message);
        }
    }

    /**
     * Cấu hình sai: thiếu base-url/model, hoặc endpoint từ chối xác thực.
     * Đây là lỗi vận hành, không phải lỗi người dùng. → 500
     */
    public static class Configuration extends AiException {
        public Configuration(String message) {
            super(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }

        public Configuration(String message, Throwable cause) {
            super(HttpStatus.INTERNAL_SERVER_ERROR, message, cause);
        }
    }

    /** Không nối được tới Ollama / timeout / model không tồn tại. → 503 */
    public static class ProviderUnavailable extends AiException {
        public ProviderUnavailable(String message) {
            super(HttpStatus.SERVICE_UNAVAILABLE, message);
        }

        public ProviderUnavailable(String message, Throwable cause) {
            super(HttpStatus.SERVICE_UNAVAILABLE, message, cause);
        }
    }

    /** LLM trả về dữ liệu không đọc được / sai cấu trúc sau khi đã thử lại. → 502 */
    public static class InvalidModelResponse extends AiException {
        public InvalidModelResponse(String message) {
            super(HttpStatus.BAD_GATEWAY, message);
        }
    }

    /** Backend nghiệp vụ hiện tại không truy cập được. → 503 */
    public static class CoreBackendUnavailable extends AiException {
        public CoreBackendUnavailable(String message) {
            super(HttpStatus.SERVICE_UNAVAILABLE, message);
        }

        public CoreBackendUnavailable(String message, Throwable cause) {
            super(HttpStatus.SERVICE_UNAVAILABLE, message, cause);
        }
    }

    /** Không đủ dữ liệu để kết luận (không phải lỗi — vẫn trả 200 kèm cờ cảnh báo). */
    public static class InsufficientData extends AiException {
        public InsufficientData(String message) {
            super(HttpStatus.OK, message);
        }
    }
}