package com.example.edugameai.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.MapPropertySource;
import org.springframework.mock.env.MockEnvironment;

class DotEnvEnvironmentPostProcessorTest {

    private final DotEnvEnvironmentPostProcessor processor = new DotEnvEnvironmentPostProcessor();

    @TempDir
    Path tempDir;

    private MockEnvironment environment(Path file) {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("edu.ai.env-file", file.toString());
        return env;
    }

    @Test
    @DisplayName("đọc key/value, bỏ comment, bóc dấu nháy")
    void readsDotEnvFile() throws Exception {
        Path file = tempDir.resolve(".env");
        Files.writeString(file, """
                # comment
                OLLAMA_BASE_URL=http://ollama.internal:11434
                OLLAMA_MODEL=qwen3:8b
                OLLAMA_KEY="abc-123"
                EDU_AI_AUTH_REQUIRED=false
                """);

        MockEnvironment env = environment(file);
        processor.postProcessEnvironment(env, new SpringApplication());

        MapPropertySource source = sourceFrom(env);
        assertEquals("http://ollama.internal:11434", source.getProperty("OLLAMA_BASE_URL"));
        assertEquals("qwen3:8b", source.getProperty("OLLAMA_MODEL"));
        assertEquals("abc-123", source.getProperty("OLLAMA_KEY"));
        assertEquals("false", source.getProperty("EDU_AI_AUTH_REQUIRED"));
    }

    @Test
    @DisplayName("chỉ nạp key liên quan tới AI/core, bỏ qua key của frontend")
    void ignoresUnrelatedKeys() throws Exception {
        Path file = tempDir.resolve(".env");
        Files.writeString(file, """
                OLLAMA_MODEL=llama3
                VITE_FIREBASE_API_KEY=should-not-be-loaded
                CLOUDINARY_API_SECRET=should-not-be-loaded
                """);

        MockEnvironment env = environment(file);
        processor.postProcessEnvironment(env, new SpringApplication());

        MapPropertySource source = sourceFrom(env);
        assertEquals("llama3", source.getProperty("OLLAMA_MODEL"));
        assertNull(source.getProperty("VITE_FIREBASE_API_KEY"));
        assertNull(source.getProperty("CLOUDINARY_API_SECRET"));
    }

    @Test
    @DisplayName("thiếu file thì không ném lỗi — ứng dụng vẫn khởi động bằng biến môi trường")
    void missingFileIsNotFatal() {
        MockEnvironment env = environment(tempDir.resolve("khong-ton-tai.env"));

        processor.postProcessEnvironment(env, new SpringApplication());

        assertNull(sourceFrom(env));
    }

    @Test
    @DisplayName("env-file rỗng hoặc '-' thì bỏ qua hoàn toàn")
    void disabledIsNoOp() {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("edu.ai.env-file", "-");

        processor.postProcessEnvironment(env, new SpringApplication());

        assertNull(sourceFrom(env));
    }

    @Test
    @DisplayName("nguồn .env có độ ưu tiên thấp hơn biến môi trường hệ thống")
    void dotEnvLosesAgainstExplicitProperty() throws Exception {
        Path file = tempDir.resolve(".env");
        Files.writeString(file, "OLLAMA_MODEL=from-dotenv");

        MockEnvironment env = environment(file);
        env.setProperty("OLLAMA_MODEL", "from-environment");
        processor.postProcessEnvironment(env, new SpringApplication());

        assertEquals("from-environment", env.getProperty("OLLAMA_MODEL"));
    }

    private static MapPropertySource sourceFrom(MockEnvironment env) {
        for (var source : env.getPropertySources()) {
            if (source instanceof MapPropertySource map && map.getName().startsWith("dotEnv:")) {
                return map;
            }
        }
        return null;
    }
}