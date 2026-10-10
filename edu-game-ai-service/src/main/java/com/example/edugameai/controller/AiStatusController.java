package com.example.edugameai.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.config.CoreApiProperties;
import com.example.edugameai.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Trạng thái AI Service — KHÔNG yêu cầu token, để frontend kiểm tra nhanh khi bật/tắt nút.
 *
 * <p>TUYỆT ĐỐI không trả về {@code apiKey} hay bất kỳ giá trị bí mật nào; chỉ có cờ
 * {@code hasApiKey} để chẩn đoán cấu hình.
 */
@RestController
@RequestMapping("/api/ai")
public class AiStatusController {

    private final AiChatGateway gateway;
    private final AiProperties aiProperties;
    private final CoreApiProperties coreProperties;

    public AiStatusController(AiChatGateway gateway, AiProperties aiProperties, CoreApiProperties coreProperties) {
        this.gateway = gateway;
        this.aiProperties = aiProperties;
        this.coreProperties = coreProperties;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        AiChatGateway.HealthStatus provider = gateway.health();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", provider.reachable());
        data.put("model", aiProperties.model());
        data.put("provider", "ollama");
        data.put("baseUrlConfigured", aiProperties.baseUrl() != null && !aiProperties.baseUrl().isBlank());
        data.put("hasApiKey", aiProperties.apiKey() != null && !aiProperties.apiKey().isBlank());
        data.put("authRequired", aiProperties.auth().required());
        data.put("coreBackendEnabled", coreProperties.enabled());
        data.put("detail", provider.detail());

        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}