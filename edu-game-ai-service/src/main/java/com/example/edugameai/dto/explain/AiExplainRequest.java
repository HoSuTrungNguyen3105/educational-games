package com.example.edugameai.dto.explain;

import com.example.edugameai.dto.core.CoreExplainContext;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu giải thích một câu hỏi học sinh vừa trả lời.
 *
 * <p>Kiến trúc đích: Backend chính đã xác thực người dùng và đã tự chấm câu hỏi, nên nó
 * truyền sẵn {@link #context()} xuống. AI Service không gọi vòng lại
 * {@code /questions/explain-context}.
 *
 * <p>Chế độ legacy (gọi trực tiếp trong lúc dev) bỏ trống {@code context} — lúc đó AI
 * Service tự gọi Backend chính qua {@code CoreBackendClient} như trước.
 *
 * <p>Client KHÔNG được gửi {@code isCorrect} hay đáp án đúng — backend chính tự chấm và
 * tự dựng ngữ cảnh. Client chỉ gửi "học sinh đã bấm chọn gì".
 *
 * @param questionId id câu hỏi (bắt buộc, dùng để ghi log và fallback legacy)
 * @param gameId     game chứa câu hỏi — dùng để chặn lấy nhầm câu của game khác
 * @param answer     giá trị học sinh đã chọn; bỏ trống nghĩa là hết giờ / không trả lời
 * @param reveal     {@code true} = học sinh yêu cầu lời giải đầy đủ;
 *                   {@code false} (mặc định) = chỉ gợi ý từng bước, chưa nói đáp án
 * @param followUp   câu hỏi bổ sung của học sinh về câu vừa rồi (tối đa 500 ký tự)
 * @param context    ngữ cảnh do Backend chính chấm sẵn (tuỳ chọn — xem javadoc lớp)
 */
public record AiExplainRequest(

        @NotBlank(message = "questionId không được để trống")
        @Size(max = 80, message = "questionId không được dài quá 80 ký tự")
        String questionId,

        @Size(max = 64, message = "gameId không được dài quá 64 ký tự")
        String gameId,

        @Size(max = 200, message = "answer không được dài quá 200 ký tự")
        String answer,

        Boolean reveal,

        @Size(max = 500, message = "followUp không được dài quá 500 ký tự")
        String followUp,

        @Valid
        CoreExplainContext context) {

    /** Học sinh có yêu cầu lời giải đầy đủ không. */
    public boolean wantsFullSolution() {
        return Boolean.TRUE.equals(reveal);
    }

    /** Backend chính đã truyền ngữ cảnh xuống → không cần gọi vòng lại. */
    public boolean hasInlineContext() {
        return context != null;
    }

    /**
     * Rút gọn: chưa có ngữ cảnh truyền vào (chế độ legacy — AI Service tự gọi Backend chính).
     * JSON contract không đổi — {@code context} là tuỳ chọn và mặc định là {@code null}.
     */
    public AiExplainRequest(String questionId, String gameId, String answer, Boolean reveal, String followUp) {
        this(questionId, gameId, answer, reveal, followUp, null);
    }
}