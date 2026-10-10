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
 * <p>Mặc định chỉ cho phép localhost (các cổng Vite/AI Service thường dùng khi dev).
 * Khi deploy, khai báo {@code EDU_AI_ALLOWED_ORIGINS=https://<domain-frontend>,...}.
 */
@Configuration(proxyBeanMethods = false)
public class AiWebConfig implements WebMvcConfigurer {

    private static final List<String> DEV_ORIGINS = List.of(
            "http://localhost:5173", "http://127.0.0.1:5173",
            "http://localhost:4173", "http://127.0.0.1:4173",
            "http://localhost:8081", "http://127.0.0.1:8081");

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