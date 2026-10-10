package com.example.edugameai.service;

import java.util.ArrayList;
import java.util.List;

import com.example.edugameai.dto.QuestionRequest;
import com.example.edugameai.dto.QuestionResponse;
import com.example.edugameai.dto.quiz.AiQuizGenerateRequest;
import com.example.edugameai.dto.quiz.AiQuizGenerateResponse;
import com.example.edugameai.dto.quiz.GeneratedQuestion;
import com.example.edugameai.security.AuthenticatedUser;
import org.springframework.stereotype.Service;

/**
 * Bọc {@link AiQuizGenerationService} cho endpoint CŨ {@code /api/ai/generate-question}.
 *
 * <p>Trước đây service này tự dựng prompt và gọi thẳng model, không validate gì cả —
 * chính vì vậy đôi khi AI trả về JSON hỏng làm cả request lỗi 500. Nay nó chuyển tiếp
 * toàn bộ việc cho pipeline đã kiểm tra nghiêm ngặt rồi CHUYỂN ĐỔI kết quả về shape cũ,
 * nên hợp đồng API được giữ nguyên mà chất lượng ổn định hơn nhiều.
 */
@Service
public class AiQuestionService {

    private final AiQuizGenerationService quizGenerationService;

    public AiQuestionService(AiQuizGenerationService quizGenerationService) {
        this.quizGenerationService = quizGenerationService;
    }

    public QuestionResponse generateQuestions(QuestionRequest request, AuthenticatedUser user, String remoteIp) {
        AiQuizGenerateRequest modern = new AiQuizGenerateRequest(
                request.getSubject(), request.getGrade(), request.getTopic(),
                request.getDifficulty(), request.getQuantity(), null, null);

        AiQuizGenerateResponse generated = quizGenerationService.generate(modern, user, remoteIp);

        List<com.example.edugameai.dto.QuestionDto> questions = new ArrayList<>(generated.questions().size());
        for (GeneratedQuestion q : generated.questions()) {
            List<String> options = new ArrayList<>(q.options().size());
            String correctText = null;
            for (GeneratedQuestion.Option o : q.options()) {
                options.add(o.content());
                if (o.id().equals(q.correctAnswer())) {
                    correctText = o.content();
                }
            }
            questions.add(new com.example.edugameai.dto.QuestionDto(q.content(), options, correctText, q.points()));
        }
        return new QuestionResponse(questions);
    }
}