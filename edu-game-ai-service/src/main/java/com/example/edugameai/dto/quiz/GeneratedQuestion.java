package com.example.edugameai.dto.quiz;

import java.util.List;

/**
 * Câu hỏi đã được Java sinh id và kiểm tra lại, đúng với schema {@code questions}
 * mà backend chính đang dùng (xem {@code server/data/initialQuestions.json}):
 *
 * <pre>
 * { id, content, inputMode:"choice", options:[{id, content}], timeLimit, points, correctAnswer }
 * </pre>
 *
 * {@code correctAnswer} là ID của option đúng — khớp với cách
 * {@code gradeAnswer.js} và {@code socket.js} chấm điểm. Nếu AI không nêu rõ đáp án đúng
 * thì để {@code null} để giáo viên chọn tay, KHÔNG đoán bừa.
 *
 * <p>Kết quả luôn là BẢN NHÁP: endpoint này không ghi gì xuống database.
 */
public record GeneratedQuestion(
        String id,
        String content,
        String inputMode,
        List<Option> options,
        String correctAnswer,
        Integer timeLimit,
        Integer points,
        String explanation) {

    /** Một phương án trắc nghiệm. */
    public record Option(String id, String content) {
    }
}