package com.example.edugameai.security;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Đăng ký {@link CurrentUserArgumentResolver} cho toàn bộ controller và mở CORS có kiểm soát.
 *
 * <p>Kiến trúc đích: chỉ Backend chính gọi AI Service, nên mặc định CORS chỉ mở cho
 * {@code http://localhost:5000} (và 127.0.0.1) — nơi Backend chính chạy khi dev.
 * Khai báo {@code EDU_AI_ALLOWED_ORIGINS=https://<domain-backend>,...} khi deploy.
 *
 * <p>Lưu ý: CORS KHÔNG phải cơ chế bảo vệ API giữa hai backend. Ràng buộc thật sự là
 * service token {@code X-Ai-Internal-Token}; production nên đặt AI Service trong mạng nội bộ.
 */
@Configuration(proxyBeanMethods = false)
public class AiWebConfig implements WebMvcConfigurer {

    private static final List<String> DEV_ORIGINS = List.of(
            // Backend chính — đường gọi chuẩn
            "http://localhost:5000", "http://127.0.0.1:5000",
            // Vite dev / preview — chỉ để chạy thử chế độ legacy
            "http://localhost:5173", "http://127.0.0.1:5173",
            "http://localhost:4173", "http://127.0.0.1:4173");

    private final CurrentUserArgumentResolver currentUserArgumentResolver;
    private final List<String> allowedOrigins;

    public AiWebConfig(CurrentUserArgumentResolver currentUserArgumentResolver,
                       @Value("${edu.ai.web.allowed-origins:}") String allowedOriginsCsv) {
        this.currentUserArgumentResolver = currentUserArgumentResolver;
        this.allowedOrigins = parse(allowedOriginsCsv);
    }

    private static List<String> parse(String csv) {
        if (csv == null || csv.isBlank()) {
            return DEV_ORIGINS;
        }
        List<String> list = Arrays.stream(csv.split(","))
                .map(String::strip)
                .filter(s -> !s.isEmpty())
                .toList();
        return list.isEmpty() ? DEV_ORIGINS : list;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserArgumentResolver);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/ai/**")
                .allowedOrigins(allowedOrigins.toArray(String[]::new))
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}