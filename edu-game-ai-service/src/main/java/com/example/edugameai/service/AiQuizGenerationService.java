package com.example.edugameai.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.client.AiChatGateway.AiMessage;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.dto.quiz.AiQuizGenerateRequest;
import com.example.edugameai.dto.quiz.GeneratedQuestion;
import com.example.edugameai.dto.quiz.AiQuizGenerateResponse;
import com.example.edugameai.exception.AiErrors;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.support.AiPromptFactory;
import com.example.edugameai.service.support.Ids;
import com.example.edugameai.service.support.JsonPayloads;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Sinh câu hỏi trắc nghiệm bằng AI rồi KIỂM TRA LẠI bằng Java trước khi trả về.
 *
 * <p>Luồng: validate yêu cầu → dựng prompt → gọi LLM (ép trả JSON) → parse →
 * validate từng câu → trả BẢN NHÁP.
 *
 * <p>Nguyên tắc: phản hồi của LLM là dữ liệu KHÔNG ĐÁNG TIN CẬY.
 * <ul>
 *   <li>Câu thiếu nội dung, thiếu phương án, phương án trùng nhau → loại và đếm vào {@code skipped}.
 *   <li>Không xác định được đáp án đúng → vẫn giữ câu nhưng để {@code correctAnswer = null}
 *       để giáo viên chọn tay. TUYỆT ĐỐI không đoán bừa đáp án.
 *   <li>Không bao giờ ghi xuống database — lưu là việc của frontend qua API câu hỏi sẵn có.
 * </ul>
 */
@Service
public class AiQuizGenerationService {

    private static final Logger log = LoggerFactory.getLogger(AiQuizGenerationService.class);

    private final AiChatGateway gateway;
    private final AiPromptFactory prompts;
    private final AiRateLimiter rateLimiter;
    private final AiProperties properties;
    private final ObjectMapper objectMapper;

    public AiQuizGenerationService(AiChatGateway gateway, AiPromptFactory prompts, AiRateLimiter rateLimiter,
                                   AiProperties properties, ObjectMapper objectMapper) {
        this.gateway = gateway;
        this.prompts = prompts;
        this.rateLimiter = rateLimiter;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public AiQuizGenerateResponse generate(AiQuizGenerateRequest request, AuthenticatedUser user, String remoteIp) {
        rateLimiter.check(user.rateLimitKey(remoteIp), AiRateLimiter.Bucket.QUIZ);

        if (properties.auth().quizRequiresStaff() && user.authenticated() && !user.isStaff()) {
            throw new AiErrors.Forbidden("Chỉ giáo viên hoặc quản trị mới được tạo câu hỏi bằng AI.");
        }

        int count = normalizeCount(request.count());
        String userPrompt = prompts.enforceLimit(prompts.quizUser(request, count));

        JsonNode root = null;
        for (int attempt = 0; attempt <= properties.generation().jsonRetryAttempts(); attempt++) {
            String raw = gateway.completeJson(AiMessage.system(prompts.quizSystem()),
                    List.of(AiMessage.user(userPrompt)));
            root = JsonPayloads.extract(objectMapper, raw);
            if (root != null && questionsNode(root) != null) {
                break;
            }
            log.warn("AI trả về JSON không đúng cấu trúc (lần {}/{})", attempt + 1,
                    properties.generation().jsonRetryAttempts() + 1);
        }

        JsonNode questionsNode = root == null ? null : questionsNode(root);
        if (questionsNode == null || !questionsNode.isArray() || questionsNode.isEmpty()) {
            throw new AiErrors.InvalidModelResponse(
                    "AI không sinh được câu hỏi nào đúng cấu trúc. Hãy thử đổi chủ đề hoặc giảm số câu.");
        }

        List<GeneratedQuestion> valid = new ArrayList<>();
        List<String> warnings = new ArrayList<>();
        int skipped = 0;
        int needsManualAnswer = 0;

        for (JsonNode node : questionsNode) {
            if (valid.size() >= count) {
                break;
            }
            ValidatedQuestion result = validate(node);
            if (result == null) {
                skipped++;
                continue;
            }
            if (result.question().correctAnswer() == null) {
                needsManualAnswer++;
            }
            valid.add(result.question());
        }

        if (valid.isEmpty()) {
            throw new AiErrors.InvalidModelResponse(
                    "AI không sinh được câu hỏi nào đúng cấu trúc. Hãy thử đổi chủ đề hoặc giảm số câu.");
        }
        if (needsManualAnswer > 0) {
            warnings.add(needsManualAnswer + " câu AI không nêu rõ đáp án đúng, cần giáo viên chọn tay.");
        }
        if (skipped > 0) {
            warnings.add(skipped + " câu bị loại vì thiếu nội dung hoặc phương án không hợp lệ.");
        }
        if (valid.size() < count) {
            warnings.add("Chỉ sinh được " + valid.size() + "/" + count + " câu hợp lệ.");
        }
        warnings.add("Đây là bản nháp — hãy xem lại và chỉnh sửa trước khi lưu vào trò chơi.");

        log.info("AI sinh {}/{} câu hợp lệ, bỏ {} câu, {} câu thiếu đáp án", valid.size(), count, skipped, needsManualAnswer);

        return AiQuizGenerateResponse.of(valid, count, skipped, needsManualAnswer, warnings);
    }

    /** Chấp nhận cả mảng gốc lẫn object {@code {"questions": [...]}}. */
    private JsonNode questionsNode(JsonNode root) {
        if (root == null || root.isNull()) {
            return null;
        }
        if (root.isArray()) {
            return root;
        }
        JsonNode nested = root.get("questions");
        return nested != null && nested.isArray() ? nested : null;
    }

    private int normalizeCount(Integer raw) {
        int max = properties.limits().maxQuestionsPerRequest();
        int count = raw == null ? 5 : raw;
        if (count < 1) {
            throw new AiErrors.InvalidRequest("Số câu phải từ 1 trở lên.");
        }
        if (count > max) {
            throw new AiErrors.InvalidRequest("Mỗi lần chỉ sinh tối đa " + max + " câu.");
        }
        return count;
    }

    /** @return null nếu câu hỏi hỏng về cấu trúc và phải loại. */
    private ValidatedQuestion validate(JsonNode node) {
        if (node == null || !node.isObject()) {
            return null;
        }
        var limits = properties.limits();

        String content = clean(JsonPayloads.text(node, "content"), limits.maxQuestionContentLength());
        if (content.isEmpty()) {
            return null;
        }

        JsonNode rawOptions = node.get("options");
        if (rawOptions == null || !rawOptions.isArray()) {
            return null;
        }

        List<String> options = new ArrayList<>();
        Set<String> seen = new LinkedHashSet<>();
        for (JsonNode o : rawOptions) {
            String text = clean(JsonPayloads.asText(o), limits.maxOptionContentLength());
            if (text.isEmpty()) {
                continue;
            }
            // Trùng lặp vô nghĩa (chỉ khác nhau ở khoảng trắng/hoa thường) → loại câu,
            // vì người học không thể phân biệt được.
            if (!seen.add(text.toLowerCase(Locale.ROOT).replaceAll("\\s+", " "))) {
                return null;
            }
            options.add(text);
            if (options.size() > limits.maxOptionsPerQuestion()) {
                break;
            }
        }
        if (options.size() < limits.minOptionsPerQuestion()) {
            return null;
        }

        // ID option do Java sinh, KHÔNG tin ID do LLM bịa ra.
        List<GeneratedQuestion.Option> typedOptions = new ArrayList<>(options.size());
        for (String text : options) {
            typedOptions.add(new GeneratedQuestion.Option(Ids.newAnswerId(), text));
        }

        String correctId = resolveCorrectOption(node, typedOptions);

        Integer points = clamp(JsonPayloads.integer(node, "points"), 1, 1000, 100);
        Integer timeLimit = clamp(JsonPayloads.integer(node, "timeLimit"), 5, 300, 20);
        String explanation = clean(JsonPayloads.text(node, "explanation"), 300);

        return new ValidatedQuestion(new GeneratedQuestion(
                Ids.newQuestionId(), content, "choice", typedOptions, correctId, timeLimit, points, explanation));
    }

    /**
     * Tìm option đúng theo nội dung. Thử khớp chính xác, không phân biệt hoa thường,
     * rồi bỏ khoảng trắng thừa. Không tìm được thì trả {@code null} để giáo viên tự chọn.
     */
    private String resolveCorrectOption(JsonNode node, List<GeneratedQuestion.Option> options) {
        String raw = JsonPayloads.text(node, "correctAnswer");
        if (raw == null) {
            return null;
        }
        String want = raw.strip();

        for (GeneratedQuestion.Option o : options) {
            if (o.content().equals(want)) {
                return o.id();
            }
        }
        String lower = want.toLowerCase(Locale.ROOT);
        for (GeneratedQuestion.Option o : options) {
            if (o.content().toLowerCase(Locale.ROOT).equals(lower)) {
                return o.id();
            }
        }
        String squeezed = squeeze(want);
        for (GeneratedQuestion.Option o : options) {
            if (squeeze(o.content()).equals(squeezed)) {
                return o.id();
            }
        }
        // Chỉ chấp nhận nếu khớp DUY NHẤT một option — tránh chọn nhầm khi AI mơ hồ.
        String matchId = null;
        for (GeneratedQuestion.Option o : options) {
            if (squeeze(o.content()).equals(squeezed)) {
                if (matchId != null) {
                    return null;
                }
                matchId = o.id();
            }
        }
        return matchId;
    }

    private String squeeze(String value) {
        return value.toLowerCase(Locale.ROOT).replaceAll("\\s+", " ").strip();
    }

    private String clean(String value, int max) {
        if (value == null) {
            return "";
        }
        String v = value.strip().replaceAll("[\\p{Cntrl}&&[^\\n]]", "");
        return v.length() <= max ? v : v.substring(0, max);
    }

    private Integer clamp(Integer value, int min, int max, int fallback) {
        if (value == null) {
            return fallback;
        }
        return Math.max(min, Math.min(max, value));
    }

    private record ValidatedQuestion(GeneratedQuestion question) {
    }
}