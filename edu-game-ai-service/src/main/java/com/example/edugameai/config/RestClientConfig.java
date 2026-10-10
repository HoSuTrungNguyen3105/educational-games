package com.example.edugameai.config;

import java.time.Duration;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.client.CoreBackendClient;
import com.example.edugameai.client.OllamaChatGateway;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * Hai {@link RestClient} độc lập với timeout riêng, cộng một gateway AI:
 *
 * <ul>
 *   <li>{@code ollamaRestClient} — gọi LLM, cần read-timeout dài (model local rất chậm).
 *   <li>{@code coreRestClient} — gọi backend nghiệp vụ hiện tại, timeout ngắn để fail nhanh.
 * </ul>
 *
 * Dùng {@link RestClient} của spring-web sẵn có nên không phải thêm thư viện HTTP mới.
 */
@Configuration(proxyBeanMethods = false)
public class RestClientConfig {

    @Bean
    public RestClient ollamaRestClient(AiProperties properties) {
        return RestClient.builder()
                .baseUrl(trimTrailingSlash(properties.baseUrl()))
                .requestFactory(requestFactory(properties.connectTimeout(), properties.readTimeout()))
                .build();
    }

    @Bean
    public CoreBackendClient coreBackendClient(CoreApiProperties properties, ObjectMapper objectMapper) {
        RestClient client = RestClient.builder()
                .baseUrl(trimTrailingSlash(properties.baseUrl()))
                .requestFactory(requestFactory(properties.connectTimeout(), properties.readTimeout()))
                .build();
        return new CoreBackendClient(client, properties, objectMapper);
    }

    /**
     * Provider AI hiện tại. Đổi provider = đổi implementation của {@link AiChatGateway},
     * không phải sửa nghiệp vụ.
     */
    @Bean
    public AiChatGateway aiChatGateway(RestClient ollamaRestClient, AiProperties properties,
                                       ObjectMapper objectMapper) {
        return new OllamaChatGateway(ollamaRestClient, properties, objectMapper);
    }

    private ClientHttpRequestFactory requestFactory(Duration connect, Duration read) {
        return ClientHttpRequestFactoryBuilder.detect().build(ClientHttpRequestFactorySettings.DEFAULTS
                .withConnectTimeout(connect)
                .withReadTimeout(read));
    }

    private String trimTrailingSlash(String url) {
        if (url == null || url.isBlank()) {
            return "";
        }
        String v = url.strip();
        return v.endsWith("/") ? v.substring(0, v.length() - 1) : v;
    }
}