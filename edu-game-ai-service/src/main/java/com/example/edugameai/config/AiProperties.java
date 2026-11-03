package com.example.edugameai.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Cấu hình cho phần AI. Mọi giá trị nhạy cảm đến từ biến môi trường / file {@code .env},
 * không hardcode trong mã nguồn.
 *
 * <p>Điểm quan trọng: {@code apiKey} là TUỲ CHỌN. Ollama chạy local không cần key,
 * còn dịch vụ từ xa (ví dụ ollama.com) thì yêu cầu {@code Authorization: Bearer <key>}.
 * Nếu key rỗng, gateway sẽ không gắn header và không làm ứng dụng hỏng lúc khởi động.
 */
@ConfigurationProperties(prefix = "edu.ai")
public record AiProperties(

        @DefaultValue("http://localhost:11434") String baseUrl,

        /** Model mặc định của dự án: Qwen3 4B chạy local bằng Ollama (`ollama pull qwen3:4b`). */
        @DefaultValue("qwen3:4b") String model,

        /** API key của endpoint Ollama. Rỗng = không xác thực (Ollama local). */
        @DefaultValue("") String apiKey,

        /** Ném lỗi ngay khi khởi động nếu baseUrl/model rỗng. */
        @DefaultValue("false") boolean failFast,

        @DefaultValue Duration connectTimeout,

        @DefaultValue Duration readTimeout,

        @DefaultValue Auth auth,

        @DefaultValue Internal internal,

        @DefaultValue Limits limits,

        @DefaultValue RateLimit rateLimit,

        @DefaultValue Generation generation) {

    /** Ràng buộc xác thực/phân quyền cho các endpoint AI. */
    public record Auth(
            /**
             * Kiến trúc đích: Frontend → Backend chính (:5000) → AI Service (service token).
             *
             * <p>Trong kiến trúc này, {@code required} chỉ áp dụng cho chế độ legacy (xác thực
             * bằng Bearer token của người dùng), và được bật/tắt bằng
             * {@link Internal#legacyBearerAuthEnabled()}.
             */
            @DefaultValue("true") boolean required,

            /** Chỉ giáo viên/admin được sinh nội dung câu hỏi. */
            @DefaultValue("true") boolean quizRequiresStaff) {
    }

    /**
     * Xác thực service-to-service với Backend chính.
     *
     * <p>Backend chính đã xác thực người dùng, nên nó chuyển tiếp danh tính đã kiểm chứng
     * sang AI Service qua header {@code X-Ai-Internal-Token}. AI Service KHÔNG tự gọi lại
     * {@code /api/auth/me} trong luồng này — không còn request vòng về Backend chính.
     *
     * <p>Header danh tính ({@code X-Ai-User-Id}…) chỉ được tin khi service token khớp.
     * Không có token hoặc token sai → từ chối, không rơi về đường legacy.
     */
    public record Internal(
            /**
             * Shared secret dùng làm service token. Rỗng = TẮT chế độ internal (chỉ dùng được
             * legacy Bearer). TUYỆT ĐỐI lấy từ biến môi trường, không hard-code.
             */
            @DefaultValue("") String token,

            /** Cho phép xác thực bằng Bearer token của người dùng (chế độ cũ, chỉ để dev). */
            @DefaultValue("true") boolean legacyBearerAuthEnabled) {

        public boolean enabled() {
            return token != null && !token.isBlank();
        }
    }

    /** Giới hạn kích thước input/output — luôn chặn trước khi gọi LLM. */
    public record Limits(
            @DefaultValue("2000") int maxMessageLength,
            @DefaultValue("1000") int maxHistoryTurnLength,
            @DefaultValue("10") int maxHistoryTurns,
            @DefaultValue("2000") int maxSourceContentLength,
            @DefaultValue("20") int maxQuestionsPerRequest,
            @DefaultValue("4") int minOptionsPerQuestion,
            @DefaultValue("6") int maxOptionsPerQuestion,
            @DefaultValue("500") int maxQuestionContentLength,
            @DefaultValue("200") int maxOptionContentLength,
            @DefaultValue("400") int maxAnalysisItemLength,
            @DefaultValue("5") int maxAnalysisItems,
            @DefaultValue("4000") int maxPromptLength) {
    }

    /** Chống spam: cửa sổ trượt theo phút, tính theo user đã xác thực (hoặc IP nếu khách). */
    public record RateLimit(
            @DefaultValue("true") boolean enabled,
            @DefaultValue("20") int chatPerMinute,
            /** Giải thích câu sai — gọi LLM mỗi lần nên để dư đầu hơn hạn mức chat. */
            @DefaultValue("30") int explainPerMinute,
            @DefaultValue("10") int quizPerMinute,
            @DefaultValue("10") int analysisPerMinute) {
    }

    /** Tham số sinh nội dung. */
    public record Generation(
            @DefaultValue("0.4") double temperature,
            /** Số lần thử lại khi LLM trả JSON không hợp lệ (không lặp vô hạn). */
            @DefaultValue("1") int jsonRetryAttempts,
            /** Ngưỡng dưới đó coi như chưa đủ dữ liệu để kết luận. */
            @DefaultValue("5") int minQuestionsForConclusion,
            @DefaultValue("2") int minPlaysForConclusion,
            /**
             * Chế độ "thinking" của Ollama (field {@code think} trong /api/chat).
             *
             * <p>Qwen3 là model có suy nghĩ ẩn; nếu để model tự quyết, một câu chào đơn giản
             * cũng sinh ra hàng trăm token reasoning → trả lời rất chậm. Dự án mặc định tắt:
             * <ul>
             *   <li>{@code false} (mặc định) — gửi {@code think:false}, hạn chế suy nghĩ dài.
             *   <li>{@code true}  — gửi {@code think:true}, cho phép model trình bày cách làm
             *       (chức năng "AI giải thích" có thể bật nếu muốn).
             *   <li>{@code omit}  — KHÔNG gửi field này, dùng cho Ollama/model không hỗ trợ
             *       (Ollama cũ hơn 0.4 sẽ trả 400 với field lạ).
             * </ul>
             * Giá trị lấy từ {@code OLLAMA_THINK}, không hardcode trong mã nguồn.
             */
            @DefaultValue("false") String think) {

        /** true = gửi field {@code think} xuống Ollama. */
        public boolean sendThink() {
            String v = think == null ? "" : think.strip().toLowerCase();
            return !v.isBlank() && !v.equals("omit") && !v.equals("auto") && !v.equals("off");
        }

        /** Giá trị boolean của {@code think} khi {@link #sendThink()} là true. */
        public boolean thinkEnabled() {
            String v = think == null ? "" : think.strip().toLowerCase();
            return v.equals("true") || v.equals("1") || v.equals("enable") || v.equals("enabled");
        }
    }
}