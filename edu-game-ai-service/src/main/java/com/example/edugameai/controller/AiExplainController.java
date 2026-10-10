package com.example.edugameai.controller;

import com.example.edugameai.dto.ApiResponse;
import com.example.edugameai.dto.explain.AiExplainRequest;
import com.example.edugameai.dto.explain.AiExplainResponse;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.security.BearerToken;
import com.example.edugameai.service.AiExplainService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * "AI Bạn Học" — giải thích câu hỏi học sinh vừa trả lời sai.
 *
 * <p>Cần đăng nhập vì AI Service chuyển tiếp token của học sinh xuống backend chính để
 * lấy ngữ cảnh câu hỏi; backend chính là nơi xác thực và chấm điểm.
 */
@RestController
@RequestMapping("/api/ai")
public class AiExplainController {

    private final AiExplainService aiExplainService;

    public AiExplainController(AiExplainService aiExplainService) {
        this.aiExplainService = aiExplainService;
    }

    @PostMapping("/explain")
    public ResponseEntity<ApiResponse<AiExplainResponse>> explain(
            @Valid @RequestBody AiExplainRequest request,
            AuthenticatedUser user,
            BearerToken token,
            HttpServletRequest httpRequest) {
        AiExplainResponse response = aiExplainService.explain(request, user, token.value(),
                AiChatController.clientIp(httpRequest));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}