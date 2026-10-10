package com.example.edugameai.dto.core;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Ngữ cảnh giải thích do backend chính dựng (POST /api/questions/explain-context).
 *
 * <p>Đây là nơi duy nhất trong hệ thống mà đáp án đúng tồn tại ngoài database: học sinh
 * KHÔNG bao giờ nhận được nó trước khi trả lời (xem {@code routes/questions.js} — correctAnswer
 * bị strip khỏi mọi response cho non-staff). AI Service chỉ dùng nó để LẠP PROMPT, không
 * chuyển tiếp {@code correctAnswerText} xuống trình duyệt.
 *
 * @param questionId         id câu hỏi
 * @param content            nội dung câu hỏi
 * @param subject            môn học (có thể null)
 * @param topic              chủ đề (có thể null)
 * @param inputMode          {@code choice} hoặc {@code input}
 * @param options            phương án, chỉ gồm {@code id} + {@code content}
 * @param answered           học sinh có thực sự chọn/trả lời không (false = hết giờ)
 * @param selectedAnswerText nội dung phương án học sinh đã chọn
 * @param isCorrect          KẾT QUẢ CHẤM Ở SERVER — không tin client
 * @param correctAnswerText  đáp án đúng (chỉ dùng trong prompt)
 * @param explanation        lời giải do giáo viên soạn sẵn, nếu có
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CoreExplainContext(
        String questionId,
        String content,
        String subject,
        String topic,
        String inputMode,
        List<CoreOption> options,
        Boolean answered,
        String selectedAnswerText,
        Boolean isCorrect,
        String correctAnswerText,
        String explanation) {

    /** Học sinh đã trả lời và trả lời sai — trường hợp chính của tính năng này. */
    public boolean wrongAnswer() {
        return Boolean.TRUE.equals(answered) && !Boolean.TRUE.equals(isCorrect);
    }

    public boolean hasCorrectAnswer() {
        return correctAnswerText != null && !correctAnswerText.isBlank();
    }

    public List<CoreOption> safeOptions() {
        return options == null ? List.of() : options;
    }
}