package com.example.edugameai.dto.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Người dùng theo {@code GET /api/auth/me} của backend chính.
 *
 * <p>AI Service KHÔNG tự giải mã JWT — nó đưa token lên backend chính để xác thực,
 * nhờ vậy không phải nhân bản {@code JWT_SECRET} và không có nguy cơ lệch logic xác thực.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CoreUser(
        String id,
        String username,
        String name,
        String role) {

    public boolean isStaff() {
        return "teacher".equals(role) || "admin".equals(role);
    }
}