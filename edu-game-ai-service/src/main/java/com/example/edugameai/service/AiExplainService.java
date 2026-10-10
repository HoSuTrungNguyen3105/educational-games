package com.example.edugameai.service;

import java.util.List;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.client.AiChatGateway.AiMessage;
import com.example.edugameai.client.CoreBackendClient;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.dto.core.CoreExplainContext;
import com.example.edugameai.dto.explain.AiExplainRequest;
import com.example.edugameai.dto.explain.AiExplainResponse;
import com.example.edugameai.exception.AiErrors;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.support.AiPromptFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * "AI Bạn Học" — giải thích câu hỏi học sinh vừa trả lời sai.
 *
 * <p>Nguyên tắc bất di bất dịch của tính năng này:
 * <ul>
 *   <li>AI KHÔNG BAO GIỜ tự chấm. {@code isCorrect} do Backend chính quyết định; client không
 *       gửi lên được đáp án đúng và cũng không tin được kết quả tự khai. Trong luồng chính,
 *       ngữ cảnh đã được Backend chính chấm sẵn và truyền xuống qua {@code request.context()}.
 *   <li>AI KHÔNG BAO GIỜ được cộng điểm, cộng xu, cấp thành tự hay mở khóa vật phẩm.
 *   <li>Mặc định CHƯA lộ đáp án đúng — chỉ gợi ý từng bước. Chỉ khi học sinh yêu cầu
 *       ({@code reveal = true}) mới nói thẳng, và luôn kèm giải thích từng bước.
 *   <li>Đáp án đúng chỉ tồn tại trong PROMPT, không bao giờ được trả về cho trình duyệt.
 * </ul>
 */
@Service
public class AiExplainService {

    private static final Logger log = LoggerFactory.getLogger(AiExplainService.class);

    /** Trần an toàn cho lời giải thích. */
    private static final int MAX_ANSWER_LENGTH = 4000;

    private final AiChatGateway gateway;
    private final AiPromptFactory prompts;
    private final AiRateLimiter rateLimiter;
    private final CoreBackendClient core;
    private final AiProperties properties;

    public AiExplainService(AiChatGateway gateway, AiPromptFactory prompts, AiRateLimiter rateLimiter,
                            CoreBackendClient core, AiProperties properties) {
        this.gateway = gateway;
        this.prompts = prompts;
        this.rateLimiter = rateLimiter;
        this.core = core;
        this.properties = properties;
    }

    public AiExplainResponse explain(AiExplainRequest request, AuthenticatedUser user,
                                     String bearerToken, String remoteIp) {
        rateLimiter.check(user.rateLimitKey(remoteIp), AiRateLimiter.Bucket.EXPLAIN);

        if (!user.authenticated()) {
            throw new AiErrors.Unauthenticated("Vui lòng đăng nhập để nhờ AI giải thích câu hỏi.");
        }
        String questionId = request.questionId() == null ? "" : request.questionId().strip();
        if (questionId.isEmpty()) {
            throw new AiErrors.InvalidRequest("Thiếu mã câu hỏi cần giải thích.");
        }

        // Backend chính chấm lại và dựng ngữ cảnh — AI Service không tự so đáp án.
        // `bearerToken` chỉ có ở chế độ legacy; ở luồng chính nó luôn null.
        CoreExplainContext ctx = request.hasInlineContext()
                ? request.context()
                : core.explainContext(bearerToken, request.gameId(), questionId, request.answer());
        if (ctx == null || ctx.content() == null || ctx.content().isBlank()) {
            throw new AiErrors.InvalidRequest("Không đọc được nội dung câu hỏi này.");
        }

        boolean reveal = request.wantsFullSolution();
        String followUp = normalizeFollowUp(request.followUp());

        List<AiMessage> messages = followUp == null
                ? List.of(AiMessage.user(prompts.explainUser(ctx, reveal)))
                : List.of(
                        AiMessage.user(prompts.explainUser(ctx, reveal)),
                        AiMessage.assistant("(Đã giải thích theo yêu cầu của học sinh.)"),
                        AiMessage.user(prompts.followUpMessage(followUp)));

        long started = System.currentTimeMillis();
        String answer = gateway.complete(prompts.explainSystem(), messages);
        long elapsed = System.currentTimeMillis() - started;

        String cleaned = answer == null ? "" : answer.strip();
        if (cleaned.isEmpty()) {
            throw new AiErrors.InvalidModelResponse("AI không trả lời được. Vui lòng thử lại.");
        }
        boolean truncated = cleaned.length() > MAX_ANSWER_LENGTH;
        if (truncated) {
            cleaned = cleaned.substring(0, MAX_ANSWER_LENGTH) + "\n\n(AI Service đã cắt nội dung vì quá dài.)";
        }

        // Chỉ log kỹ thuật. TUYỆT ĐỐI không log nội dung câu hỏi lẫn đáp án đúng.
        log.info("AI giải thích câu hỏi sau {}ms, {} ký tự, học sinh {} (đã yêu cầu lời giải đầy đủ: {})",
                elapsed, cleaned.length(), ctx.wrongAnswer() ? "sai" : "khác", reveal);

        return new AiExplainResponse(cleaned, ctx.questionId(), ctx.isCorrect(), ctx.answered(),
                reveal && ctx.hasCorrectAnswer(), ctx.subject(), truncated);
    }

    private String normalizeFollowUp(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String value = raw.strip().replaceAll("[\\p{Cntrl}&&[^\\n]]", "");
        if (value.isEmpty()) {
            return null;
        }
        int max = Math.min(properties.limits().maxHistoryTurnLength(), 500);
        return value.length() > max ? value.substring(0, max) : value;
    }
}