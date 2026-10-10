package com.example.edugameai.dto.quiz;

import java.util.List;

/**
 * Kết quả sinh câu hỏi. {@code questions} là bản nháp — giáo viên xem và sửa trước khi lưu.
 *
 * @param requested          số câu client yêu cầu
 * @param generated          số câu hợp lệ sau khi kiểm tra
 * @param skipped            số câu AI sinh ra nhưng hỏng về cấu trúc và đã bị loại
 * @param needsManualAnswer  số câu giữ lại nhưng không xác định được đáp án đúng
 * @param warnings           ghi chú ngắn để hiển thị lên UI
 */
public record AiQuizGenerateResponse(
        List<GeneratedQuestion> questions,
        int requested,
        int generated,
        int skipped,
        int needsManualAnswer,
        List<String> warnings) {

    public static AiQuizGenerateResponse of(List<GeneratedQuestion> questions, int requested,
                                           int skipped, int needsManualAnswer, List<String> warnings) {
        return new AiQuizGenerateResponse(questions, requested, questions.size(), skipped,
                needsManualAnswer, warnings);
    }
}