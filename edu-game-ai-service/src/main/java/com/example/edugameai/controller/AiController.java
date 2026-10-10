package com.example.edugameai.controller;

import com.example.edugameai.dto.ApiResponse;
import com.example.edugameai.dto.QuestionRequest;
import com.example.edugameai.dto.QuestionResponse;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.AiQuestionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint CŨ {@code POST /api/ai/generate-question} — GIỮ NGUYÊN để không phá client cũ.
 *
 * <p>Shape {@code data} không đổi: {@code {questions:[{content, options[], correctAnswer, points}]}}
 * với {@code correctAnswer} là NỘI DUNG đáp án. Thay đổi duy nhất là response được bọc
 * trong envelope chuẩn {@code {status, code, msg, data}} giống hệt backend chính —
 * frontend đã được cập nhật để bóc envelope.
 *
 * <p>Endpoint mới, trả đúng schema câu hỏi của hệ thống: {@code /api/ai/quizzes/generate}.
 */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiQuestionService aiQuestionService;

    public AiController(AiQuestionService aiQuestionService) {
        this.aiQuestionService = aiQuestionService;
    }

    @PostMapping("/generate-question")
    public ResponseEntity<ApiResponse<QuestionResponse>> generateQuestion(
            @RequestBody QuestionRequest request,
            AuthenticatedUser user,
            HttpServletRequest httpRequest) {
        QuestionResponse response = aiQuestionService.generateQuestions(request, user,
                AiChatController.clientIp(httpRequest));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}