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

        @DefaultValue("llama3") String model,

        /** API key của endpoint Ollama. Rỗng = không xác thực (Ollama local). */
        @DefaultValue("") String apiKey,

        /** Ném lỗi ngay khi khởi động nếu baseUrl/model rỗng. */
        @DefaultValue("false") boolean failFast,

        @DefaultValue Duration connectTimeout,

        @DefaultValue Duration readTimeout,

        @DefaultValue Auth auth,

        @DefaultValue Limits limits,

        @DefaultValue RateLimit rateLimit,

        @DefaultValue Generation generation) {

    /** Ràng buộc xác thực/phân quyền cho các endpoint AI. */
    public record Auth(
            /**
             * {@code true} (mặc định): mọi endpoint /api/ai/** trừ health đều cần Bearer token
             * hợp lệ do backend chính xác thực. Đặt {@code false} chỉ để chạy thử local nhanh.
             */
            @DefaultValue("true") boolean required,

            /** Chỉ giáo viên/admin được sinh nội dung câu hỏi. */
            @DefaultValue("true") boolean quizRequiresStaff) {
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
            @DefaultValue("2") int minPlaysForConclusion) {
    }
}