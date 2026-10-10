package com.example.edugameai;

import java.time.Duration;

import com.example.edugameai.config.AiProperties;

/** Tạo cấu hình thật cho unit test, không cần dựng Spring context. */
public final class TestFixtures {

    private TestFixtures() {
    }

    public static AiProperties aiProperties() {
        return new AiProperties(
                "http://localhost:11434",
                "llama3",
                "",
                false,
                Duration.ofSeconds(5),
                Duration.ofSeconds(30),
                new AiProperties.Auth(true, true),
                new AiProperties.Limits(
                        2000, 1000, 10, 2000, 20,
                        4, 6, 500, 200, 400, 5, 8000),
                new AiProperties.RateLimit(false, 20, 10, 10),
                new AiProperties.Generation(0.4, 1, 5, 2));
    }

    /** Cấu hình cho phép mọi vai trò và tắt rate limit — thuận tiện khi test service. */
    public static AiProperties aiPropertiesPermissive() {
        AiProperties base = aiProperties();
        return new AiProperties(
                base.baseUrl(), base.model(), base.apiKey(), base.failFast(),
                base.connectTimeout(), base.readTimeout(),
                new AiProperties.Auth(true, false),
                base.limits(),
                new AiProperties.RateLimit(false, 0, 0, 0),
                base.generation());
    }
}