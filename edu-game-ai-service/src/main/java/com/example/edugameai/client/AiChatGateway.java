package com.example.edugameai.client;

import java.util.List;

/**
 * Cổng trừu tượng tới nhà cung cấp mô hình AI.
 *
 * <p>Toàn bộ service chỉ nói chuyện với interface này. Khi cần đổi provider
 * (Ollama local → Ollama Cloud → OpenAI-compatible gateway…) chỉ cần thêm một
 * implementation khác, không sửa nghiệp vụ.
 */
public interface AiChatGateway {

    /**
     * Gửi hội thoại và nhận về nội dung trả lời dạng văn bản thuần.
     *
     * @param system   system prompt (có thể null)
     * @param messages lịch sử hội thoại đã chuẩn hoá, phần tử cuối là câu hỏi của người dùng
     * @throws com.example.edugameai.exception.AiException khi không lấy được câu trả lời
     */
    String complete(AiMessage system, List<AiMessage> messages);

    /**
     * Gọi LLM và bắt buộc trả về JSON.
     * Mọi nội dung trả v��i đều là dữ liệu KHÔNG ĐÁNG TIN CẬY, caller phải validate.
     */
    default String completeJson(AiMessage system, List<AiMessage> messages) {
        return complete(system, messages);
    }

    /** Kiểm tra endpoint/model có dùng được không. Dùng cho {@code /api/ai/health}. */
    HealthStatus health();

    /** Một lượt trong hội thoại. */
    record AiMessage(String role, String content) {
        public static AiMessage system(String content) {
            return new AiMessage("system", content);
        }

        public static AiMessage user(String content) {
            return new AiMessage("user", content);
        }

        public static AiMessage assistant(String content) {
            return new AiMessage("assistant", content);
        }
    }

    /** Kết quả kiểm tra sức khoẻ của provider — không chứa secret. */
    record HealthStatus(boolean reachable, String detail) {
        public static HealthStatus ok(String detail) {
            return new HealthStatus(true, detail);
        }

        public static HealthStatus down(String detail) {
            return new HealthStatus(false, detail);
        }
    }
}