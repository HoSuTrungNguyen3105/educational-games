package com.example.edugameai.service;

import java.util.ArrayList;
import java.util.List;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.client.AiChatGateway.AiMessage;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.dto.chat.AiChatRequest;
import com.example.edugameai.dto.chat.AiChatResponse;
import com.example.edugameai.exception.AiErrors;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.support.AiPromptFactory;
import com.example.edugameai.service.support.AiPromptFactory.AiChatRequestTurn;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Chatbot AI hỗ trợ học tập.
 *
 * <p>Không lưu lịch sử hội thoại xuống database: kế hoạch yêu cầu không tạo bảng mới khi
 * chưa khảo sát. Lịch sử do client gửi kèm và luôn được coi là dữ liệu không đáng tin cậy —
 * nó chỉ làm ngữ cảnh cho LLM, không bao giờ dùng để suy ra quyền truy cập. Vì vậy
 * {@code conversationId} chỉ được echo lại chứ không cấp quyền đọc hội thoại nào.
 */
@Service
public class AiChatService {

    private static final Logger log = LoggerFactory.getLogger(AiChatService.class);

    /** Trần an toàn cho câu trả lời, để model "trình bày" không trả về cả cuốn sách. */
    private static final int MAX_ANSWER_LENGTH = 6000;

    private final AiChatGateway gateway;
    private final AiPromptFactory prompts;
    private final AiRateLimiter rateLimiter;
    private final AiProperties properties;

    public AiChatService(AiChatGateway gateway, AiPromptFactory prompts, AiRateLimiter rateLimiter,
                         AiProperties properties) {
        this.gateway = gateway;
        this.prompts = prompts;
        this.rateLimiter = rateLimiter;
        this.properties = properties;
    }

    public AiChatResponse chat(AiChatRequest request, AuthenticatedUser user, String remoteIp) {
        rateLimiter.check(user.rateLimitKey(remoteIp), AiRateLimiter.Bucket.CHAT);

        String message = normalizeMessage(request.message());
        List<AiChatRequestTurn> history = normalizeHistory(request.history());

        AiMessage system = prompts.chatSystem(user, request.subject(), request.topic());
        List<AiMessage> messages = prompts.chatMessages(history, message);

        long started = System.currentTimeMillis();
        String answer = gateway.complete(system, messages);
        long elapsed = System.currentTimeMillis() - started;

        String cleaned = stripLeadingQuotes(answer.strip());
        boolean truncated = cleaned.length() > MAX_ANSWER_LENGTH;
        if (truncated) {
            cleaned = cleaned.substring(0, MAX_ANSWER_LENGTH) + "\n\n(AI Service đã cắt nội dung vì quá dài.)";
        }

        // Chỉ log kỹ thuật, KHÔNG log nội dung học sinh.
        log.info("AI chat hoàn tất sau {}ms, {} ký tự, lịch sử {} lượt", elapsed, cleaned.length(), history.size());

        return new AiChatResponse(cleaned, blankToNull(request.conversationId()), truncated);
    }

    private String normalizeMessage(String raw) {
        String message = raw == null ? "" : raw.strip().replaceAll("[\\p{Cntrl}&&[^\\n]]", "");
        if (message.isEmpty()) {
            throw new AiErrors.InvalidRequest("Vui lòng nhập câu hỏi.");
        }
        int max = properties.limits().maxMessageLength();
        if (message.length() > max) {
            throw new AiErrors.InvalidRequest("Câu hỏi quá dài (tối đa " + max + " ký tự).");
        }
        return message;
    }

    /**
     * Chuẩn hoá lịch sử: bỏ lượt rỗng, chỉ giữ vai trò hợp lệ, cắt theo hạn mức cấu hình,
     * và giữ lại N lượt gần nhất vì model chỉ nhớ được phần cuối.
     */
    private List<AiChatRequestTurn> normalizeHistory(List<AiChatRequest.ChatTurn> raw) {
        if (raw == null || raw.isEmpty()) {
            return List.of();
        }
        int maxTurns = properties.limits().maxHistoryTurns();
        int maxLength = properties.limits().maxHistoryTurnLength();
        if (raw.size() > maxTurns * 3) {
            throw new AiErrors.InvalidRequest("Lịch sử hội thoại quá dài.");
        }

        List<AiChatRequestTurn> out = new ArrayList<>();
        for (AiChatRequest.ChatTurn turn : raw) {
            if (turn == null || turn.content() == null || turn.content().isBlank()) {
                continue;
            }
            String role = turn.role() == null ? "" : turn.role().strip().toLowerCase();
            if (!role.equals("user") && !role.equals("assistant")) {
                continue;
            }
            String content = turn.content().strip();
            if (content.length() > maxLength) {
                content = content.substring(0, maxLength);
            }
            out.add(new AiChatRequestTurn(role, content));
        }
        return out.size() <= maxTurns ? out : out.subList(out.size() - maxTurns, out.size());
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.strip();
    }

    private String stripLeadingQuotes(String text) {
        if (text.length() >= 2 && ((text.startsWith("\"") && text.endsWith("\""))
                || (text.startsWith("“") && text.endsWith("”")))) {
            return text.substring(1, text.length() - 1);
        }
        return text;
    }
}