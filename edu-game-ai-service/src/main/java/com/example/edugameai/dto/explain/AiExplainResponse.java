package com.example.edugameai.dto.explain;

/**
 * Kết quả giải thích từ AI.
 *
 * @param answer      lời giải thích của AI (văn bản thuần, không HTML)
 * @param questionId  câu hỏi đã giải thích
 * @param isCorrect   kết quả chấm ở server: học sinh đã trả lời đúng chưa
 * @param answered    học sinh có thực sự trả lời (false = hết giờ)
 * @param revealed    {@code true} = AI đã nói đáp án đúng (chỉ khi học sinh yêu cầu)
 * @param subject     môn học để frontend hiển thị ngữ cảnh, có thể null
 * @param truncated   {@code true} nếu câu trả lời bị cắt do quá dài
 */
public record AiExplainResponse(
        String answer,
        String questionId,
        Boolean isCorrect,
        Boolean answered,
        boolean revealed,
        String subject,
        boolean truncated) {

    /** Lời giải thích cộng thêm nhãn cho UI, không chứa đáp án đúng dưới dạng field. */
    public static AiExplainResponse of(String answer, Core core) {
        return new AiExplainResponse(answer, core.questionId(), core.isCorrect(), core.answered(),
                core.revealed(), core.subject(), core.truncated());
    }

    /** Thông tin tối thiểu AI Service đã biết chắc sau khi backend chính chấm. */
    public record Core(String questionId, Boolean isCorrect, Boolean answered, boolean revealed,
                       String subject, boolean truncated) {
    }
}