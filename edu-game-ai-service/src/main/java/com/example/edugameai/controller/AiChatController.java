package com.example.edugameai.controller;

import com.example.edugameai.dto.ApiResponse;
import com.example.edugameai.dto.chat.AiChatRequest;
import com.example.edugameai.dto.chat.AiChatResponse;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.AiChatService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Chatbot AI hỗ trợ học tập. */
@RestController
@RequestMapping("/api/ai")
public class AiChatController {

    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @Valid @RequestBody AiChatRequest request,
            AuthenticatedUser user,
            HttpServletRequest httpRequest) {
        AiChatResponse response = aiChatService.chat(request, user, clientIp(httpRequest));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /** IP thật để tính rate limit khi khách chưa đăng nhập. */
    static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].strip();
        }
        return request.getRemoteAddr();
    }
}