package com.example.edugameai.controller;

import com.example.edugameai.dto.ApiResponse;
import com.example.edugameai.dto.analysis.AiLearningAnalysisRequest;
import com.example.edugameai.dto.analysis.AiLearningAnalysisResponse;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.AiLearningAnalysisService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** AI phân tích kết quả học tập của học sinh. */
@RestController
@RequestMapping("/api/ai")
public class AiLearningAnalysisController {

    private final AiLearningAnalysisService analysisService;

    public AiLearningAnalysisController(AiLearningAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/learning-analysis")
    public ResponseEntity<ApiResponse<AiLearningAnalysisResponse>> analyze(
            @Valid @RequestBody(required = false) AiLearningAnalysisRequest request,
            AuthenticatedUser user,
            HttpServletRequest httpRequest) {
        AiLearningAnalysisRequest body = request == null
                ? new AiLearningAnalysisRequest(null, null, null, null)
                : request;
        AiLearningAnalysisResponse response = analysisService.analyze(body, user, AiChatController.clientIp(httpRequest));
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}