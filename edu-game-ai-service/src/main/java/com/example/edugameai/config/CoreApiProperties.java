package com.example.edugameai.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Cấu hình trỏ tới backend nghiệp vụ hiện tại (Node/Express + MongoDB).
 *
 * <p>AI Service KHÔNG tự kết nối database và KHÔNG sở hữu nghiệp vụ nào.
 * Nó chỉ đọc dữ liệu qua API sẵn có của backend chính để không phải nhân bản schema.
 */
@ConfigurationProperties(prefix = "edu.core")
public record CoreApiProperties(

        /** Gốc API, bao gồm hậu tố {@code /api}. */
        @DefaultValue("http://localhost:5000/api") String baseUrl,

        @DefaultValue Duration connectTimeout,

        @DefaultValue Duration readTimeout,

        /** Bật/tắt việc gọi backend chính (tiện cho unit test và chế độ chỉ-chat). */
        @DefaultValue("true") boolean enabled,

        /** Số trang games tối đa lấy khi cần map gameId → tên game. */
        @DefaultValue("20") int maxGamePages) {
}