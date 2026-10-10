package com.example.edugameai.client;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import com.example.edugameai.client.AiChatGateway.AiMessage;
import com.example.edugameai.exception.AiErrors;

/**
 * Gateway giả cho unit test: trả lập trình theo số lần gọi và ghi lại prompt để assert.
 */
public class StubAiChatGateway implements AiChatGateway {

    private final List<String> prompts = new ArrayList<>();
    private final List<AiMessage> lastSystemPrompt = new ArrayList<>();
    private RuntimeException error;
    private String defaultResponse = "";
    private Function<Integer, String> scripted;

    /** Mỗi lần gọi trả một phản hồi khác nhau. */
    public StubAiChatGateway responding(Function<Integer, String> scripted) {
        this.scripted = scripted;
        return this;
    }

    public StubAiChatGateway responding(String response) {
        this.defaultResponse = response;
        return this;
    }

    public StubAiChatGateway failingWith(RuntimeException error) {
        this.error = error;
        return this;
    }

    @Override
    public String complete(AiMessage system, List<AiMessage> messages) {
        lastSystemPrompt.clear();
        if (system != null) {
            lastSystemPrompt.add(system);
        }
        // Ghi lại TOÀN BỘ hội thoại để test có thể assert cả phần lịch sử.
        StringBuilder joined = new StringBuilder();
        for (AiMessage m : messages) {
            joined.append('[').append(m.role()).append("] ").append(m.content()).append('\n');
        }
        prompts.add(joined.toString());
        if (error != null) {
            throw error;
        }
        if (scripted != null) {
            return scripted.apply(prompts.size() - 1);
        }
        return defaultResponse;
    }

    @Override
    public String completeJson(AiMessage system, List<AiMessage> messages) {
        return complete(system, messages);
    }

    @Override
    public HealthStatus health() {
        return HealthStatus.ok("stub");
    }

    public List<String> prompts() {
        return prompts;
    }

    public int callCount() {
        return prompts.size();
    }

    public AiMessage lastSystemPrompt() {
        return lastSystemPrompt.isEmpty() ? null : lastSystemPrompt.get(0);
    }

    public static AiErrors.ProviderUnavailable unavailable() {
        return new AiErrors.ProviderUnavailable("Không kết nối được dịch vụ AI.");
    }
}