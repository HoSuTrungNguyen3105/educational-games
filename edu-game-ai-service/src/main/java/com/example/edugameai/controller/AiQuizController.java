package com.example.edugameai.controller;

import com.example.edugameai.dto.ApiResponse;
import com.example.edugameai.dto.quiz.AiQuizGenerateRequest;
import com.example.edugameai.dto.quiz.AiQuizGenerateResponse;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.AiQuizGenerationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Sinh câu hỏi trắc nghiệm bằng AI — endpoint MỚI.
 *
 * <p>Trả câu hỏi đúng schema {@code questions} mà backend chính đang dùng:
 * option có {@code id}, {@code correctAnswer} là id của option, kèm {@code timeLimit}
 * và {@code explanation}. Frontend nhận được là dùng được, không cần map lại.
 *
 * <p>Chỉ trả BẢN NHÁP — không ghi xuống database. Việc lưu đi qua API câu hỏi sẵn có
 * của backend chính sau khi giáo viên xem và sửa.
 *
 * <p>Endpoint cũ {@code POST /api/ai/generate-question} vẫn còn, xem {@link AiController}.
 */
@RestController
@RequestMapping("/api/ai")
public class AiQuizController {

    private final AiQuizGenerationService quizService;

    public AiQuizController(AiQuizGenerationService quizService) {
        this.quizService = quizService;
    }

    /**
     * Endpoint MỚI, trả câu hỏi đúng schema {@code questions} của hệ thống
     * (option có {@code id}, {@code correctAnswer} là id, kèm {@code timeLimit} và
     * {@code explanation}) — frontend dùng thẳng được, không cần map lại.
     */
    @PostMapping("/quizzes/generate")
    public ResponseEntity<ApiResponse<AiQuizGenerateResponse>> generate(
            @Valid @RequestBody AiQuizGenerateRequest request,
            AuthenticatedUser user,
            HttpServletRequest httpRequest) {
        AiQuizGenerateResponse response = quizService.generate(request, user, AiChatController.clientIp(httpRequest));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}