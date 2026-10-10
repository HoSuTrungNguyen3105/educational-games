package com.example.edugameai.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Câu hỏi theo shape CŨ của {@code POST /api/ai/generate-question}.
 *
 * <p>Giữ nguyên để không phá hợp đồng cũ. Endpoint mới {@code /api/ai/quizzes/generate}
 * trả {@link com.example.edugameai.dto.quiz.GeneratedQuestion} — đúng schema mà backend
 * chính đang lưu.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private String content;
    private List<String> options;
    private String correctAnswer;
    private int points;
}