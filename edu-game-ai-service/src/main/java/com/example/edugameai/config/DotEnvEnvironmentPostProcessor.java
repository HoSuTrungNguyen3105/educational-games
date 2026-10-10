package com.example.edugameai.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

/**
 * Nạp file {@code .env} vào Spring Environment.
 *
 * <p>Spring Boot không tự đọc {@code .env}. Dự án này vốn dùng {@code .env} cho frontend
 * (Vite) và cho backend Node ({@code scripts/dev.mjs}), nên AI Service cũng cần đọc được
 * cùng một cơ chế để chạy nhất quán khi phát triển local.
 *
 * <p>Thứ tự ưu tiên (cao → thấp): biến môi trường của hệ điều hành / command-line args
 * → {@code application.yml} → {@code .env} → default trong code.
 * Nguồn {@code .env} được {@code addLast()} nên TUYỆT ĐỐI không ghi đè biến môi trường thật.
 *
 * <p>Chỉ nạp các khóa có tiền tố liên quan tới AI/core backend, tránh nhét thừa key của
 * frontend (Firebase, Cloudinary…) vào context của backend.
 *
 * <p>Không bao giờ log giá trị, chỉ log tên khóa.
 */
public class DotEnvEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final Log log = LogFactory.getLog(DotEnvEnvironmentPostProcessor.class);

    /** {@code KEY=value} hoặc {@code export KEY=value}; giá trị có thể trong ngoặc kép. */
    private static final Pattern LINE = Pattern.compile(
            "^\\s*(?:export\\s+)?([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(.*?)\\s*$");

    private static final List<String> ALLOWED_PREFIXES =
            List.of("OLLAMA_", "EDU_AI_", "EDU_CORE_", "CORE_API_");

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Path file = resolveEnvFile(environment);
        if (file == null) {
            return;
        }
        Map<String, Object> values = readDotEnv(file);
        if (values.isEmpty()) {
            return;
        }
        // addLast = độ ưu tiên thấp nhất: OS env và application.yml vẫn thắng.
        environment.getPropertySources().addLast(new MapPropertySource("dotEnv:" + file.getFileName(), values));
        log.info("Đã nạp " + values.size() + " biến từ " + file.getFileName()
                + " (biến môi trường hệ thống vẫn được ưu tiên cao hơn)");
    }

    /** Đường dẫn file cần nạp, hoặc {@code null} nếu bỏ qua. */
    private Path resolveEnvFile(ConfigurableEnvironment environment) {
        String configured = environment.getProperty("edu.ai.env-file");
        if (configured == null || configured.isBlank() || "-".equals(configured.trim())) {
            return null;
        }
        Path path = Path.of(configured.trim());
        if (!path.isAbsolute()) {
            path = Path.of(System.getProperty("user.dir")).resolve(path);
        }
        if (!Files.isRegularFile(path) || !Files.isReadable(path)) {
            log.info("Không tìm thấy " + path.getFileName()
                    + " — bỏ qua nạp .env, dùng biến môi trường hệ thống.");
            return null;
        }
        return path;
    }

    /** Đọc file, chỉ giữ khóa hợp lệ, bỏ qua dòng lỗi thay vì làm hỏng startup. */
    private Map<String, Object> readDotEnv(Path file) {
        Map<String, Object> out = new LinkedHashMap<>();
        try {
            for (String raw : Files.readAllLines(file, StandardCharsets.UTF_8)) {
                String line = raw.strip();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                Matcher m = LINE.matcher(line);
                if (!m.matches()) {
                    continue;
                }
                String key = m.group(1);
                if (ALLOWED_PREFIXES.stream().noneMatch(key::startsWith)) {
                    continue;
                }
                out.put(key, unquote(m.group(2)));
            }
        } catch (IOException e) {
            log.warn("Không đọc được " + file.getFileName() + ": " + e.getMessage());
        }
        return out;
    }

    private String unquote(String raw) {
        if (raw.length() >= 2) {
            char first = raw.charAt(0);
            char last = raw.charAt(raw.length() - 1);
            if ((first == '"' && last == '"') || (first == '\'' && last == '\'')) {
                return raw.substring(1, raw.length() - 1);
            }
        }
        // Bỏ comment inline kiểu `KEY=value   # ghi chú`
        int hash = raw.indexOf(" #");
        return hash >= 0 ? raw.substring(0, hash).strip() : raw;
    }

    @Override
    public int getOrder() {
        // addLast() nên thứ tự này không ảnh hưởng độ ưu tiên; nó chỉ đảm bảo property
        // source của .env tồn tại trước khi bất kỳ bean nào được bind.
        return Ordered.LOWEST_PRECEDENCE - 10;
    }
}