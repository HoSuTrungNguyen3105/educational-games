package com.example.edugameai.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import com.example.edugameai.client.AiChatGateway;
import com.example.edugameai.client.AiChatGateway.AiMessage;
import com.example.edugameai.client.CoreBackendClient;
import com.example.edugameai.config.AiProperties;
import com.example.edugameai.dto.analysis.AiLearningAnalysisRequest;
import com.example.edugameai.dto.analysis.AiLearningAnalysisResponse;
import com.example.edugameai.dto.analysis.LearningMetrics;
import com.example.edugameai.dto.analysis.LearningMetrics.TopicMetric;
import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import com.example.edugameai.exception.AiErrors;
import com.example.edugameai.security.AuthenticatedUser;
import com.example.edugameai.service.LearningMetricsCalculator.Result;
import com.example.edugameai.service.support.AiPromptFactory;
import com.example.edugameai.service.support.JsonPayloads;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Phân tích kết quả học tập.
 *
 * <p>Chia đôi trách nhiệm rõ ràng:
 * <ul>
 *   <li><b>Java + dữ liệu thật</b> tính mọi chỉ số. Đây là nguồn sự thật duy nhất.
 *   <li><b>LLM</b> chỉ diễn giải số liệu đã tính sẵn thành nhận xét dễ hiểu.
 * </ul>
 *
 * <p>LLM không bao giờ được ghi vào database, không được tính lại điểm và không được
 * suy luận quá mức. Nếu LLM lỗi hoặc trả JSON hỏng, phần trả lời vẫn được sinh bằng
 * quy tắc xác định bằng Java — endpoint không bao giờ sập vì lý do này.
 */
@Service
public class AiLearningAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AiLearningAnalysisService.class);

    private static final String DISCLAIMER =
            "Số liệu do hệ thống tự tính; phần nhận xét do AI diễn giải và có thể chưa chính xác. "
                    + "Kết quả chính thức vẫn là điểm số hệ thống ghi nhận.";

    private final CoreBackendClient coreBackendClient;
    private final AiChatGateway gateway;
    private final AiPromptFactory prompts;
    private final LearningMetricsCalculator calculator;
    private final AiRateLimiter rateLimiter;
    private final AiProperties properties;
    private final ObjectMapper objectMapper;

    public AiLearningAnalysisService(CoreBackendClient coreBackendClient, AiChatGateway gateway,
                                     AiPromptFactory prompts, LearningMetricsCalculator calculator,
                                     AiRateLimiter rateLimiter, AiProperties properties,
                                     ObjectMapper objectMapper) {
        this.coreBackendClient = coreBackendClient;
        this.gateway = gateway;
        this.prompts = prompts;
        this.calculator = calculator;
        this.rateLimiter = rateLimiter;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    public AiLearningAnalysisResponse analyze(AiLearningAnalysisRequest request, AuthenticatedUser user,
                                              String remoteIp) {
        rateLimiter.check(user.rateLimitKey(remoteIp), AiRateLimiter.Bucket.ANALYSIS);

        String targetUserId = resolveTargetUser(request, user);

        LocalDate from = request.fromDate();
        LocalDate to = request.toDate();
        LearningMetricsCalculator.validatePeriod(from, to);

        List<CoreResult> all = coreBackendClient.listResults();
        Map<String, CoreGame> games = coreBackendClient.gameIndex();

        List<CoreResult> scoped = new ArrayList<>();
        for (CoreResult r : all) {
            if (!r.isServerGraded()) {
                continue;
            }
            if (!targetUserId.equals(r.userId())) {
                continue;
            }
            if (request.gameId() != null && !request.gameId().isBlank()
                    && !request.gameId().equals(r.gameId())) {
                continue;
            }
            if (!calculator.withinPeriod(r, from, to)) {
                continue;
            }
            scoped.add(r);
        }

        Result computed = calculator.compute(scoped, games, from, to);
        LearningMetrics metrics = computed.metrics();

        log.info("Phân tích học tập: {} lượt chơi, {} câu đã trả lời, đủ dữ liệu={}",
                metrics.totalPlays(), metrics.totalQuestionsAnswered(), computed.dataSufficient());

        Narrative narrative = narrate(metrics, computed);
        return new AiLearningAnalysisResponse(
                metrics,
                narrative.summary(),
                narrative.strengths(),
                narrative.areasToImprove(),
                narrative.recommendations(),
                narrative.encouragement(),
                computed.dataSufficient(),
                computed.note() == null ? DISCLAIMER : computed.note() + " " + DISCLAIMER);
    }

    /**
     * Chốt ID người dùng cần phân tích.
     *
     * <p>QUY TẮC: học sinh chỉ xem được chính mình. Giáo viên/admin thì được xem người
     * khác nhưng mặc định xem chính mình. Không tin {@code studentId} do client gửi.
     */
    private String resolveTargetUser(AiLearningAnalysisRequest request, AuthenticatedUser user) {
        String requested = request.studentId() == null ? "" : request.studentId().strip();

        if (!user.authenticated()) {
            if (!requested.isEmpty()) {
                throw new AiErrors.Unauthenticated("Bạn cần đăng nhập để xem phân tích học tập.");
            }
            throw new AiErrors.Unauthenticated("Bạn cần đăng nhập để xem phân tích học tập.");
        }

        if (requested.isEmpty() || requested.equals(user.id())) {
            return user.id();
        }
        if (!user.isStaff()) {
            log.warn("User {} (role={}) cố xem phân tích của người khác — bị từ chối", user.id(), user.role());
            throw new AiErrors.Forbidden("Bạn không có quyền xem phân tích của học sinh khác.");
        }
        return requested;
    }

    /** Nhờ LLM diễn giải; nếu hỏng thì lùi về bản tổng hợp bằng quy tắc của Java. */
    private Narrative narrate(LearningMetrics metrics, Result computed) {
        if (metrics.totalPlays() == 0) {
            return Narrative.fallback(metrics, false);
        }
        String userPrompt = prompts.enforceLimit(prompts.analysisUser(metrics, computed.dataSufficient()));

        for (int attempt = 0; attempt <= properties.generation().jsonRetryAttempts(); attempt++) {
            try {
                String raw = gateway.completeJson(prompts.analysisSystem(), List.of(AiMessage.user(userPrompt)));
                JsonNode root = JsonPayloads.extract(objectMapper, raw);
                if (root != null && root.isObject()) {
                    Narrative n = fromModel(root, metrics, computed.dataSufficient());
                    if (n != null) {
                        return n;
                    }
                }
                log.warn("AI trả về JSON phân tích không đúng cấu trúc (lần {}/{})",
                        attempt + 1, properties.generation().jsonRetryAttempts() + 1);
            } catch (AiErrors.ProviderUnavailable | AiErrors.Configuration e) {
                // Hạ tầng lỗi thì không thử lại vô ích — trả bản tổng hợp bằng quy tắc.
                log.warn("Không lấy được diễn giải từ AI: {}", e.getMessage());
                return Narrative.fallback(metrics, computed.dataSufficient());
            }
        }
        return Narrative.fallback(metrics, computed.dataSufficient());
    }

    /** Đọc và GIỚI HẠN mọi trường do LLM trả về trước khi đưa ra ngoài. */
    private Narrative fromModel(JsonNode root, LearningMetrics metrics, boolean sufficient) {
        var limits = properties.limits().limits();

        String summary = clip(JsonPayloads.text(root, "summary"), limits.maxAnalysisItemLength() * 2);
        if (summary == null) {
            return null;
        }
        List<String> strengths = strings(root, "strengths", limits.maxAnalysisItems(), limits.maxAnalysisItemLength());
        List<String> areas = strings(root, "areasToImprove", limits.maxAnalysisItems(), limits.maxAnalysisItemLength());
        List<String> recommendations =
                strings(root, "recommendations", limits.maxAnalysisItems(), limits.maxAnalysisItemLength());
        String encouragement = clip(JsonPayloads.text(root, "encouragement"), limits.maxAnalysisItemLength());

        if (strengths.isEmpty() && areas.isEmpty() && recommendations.isEmpty()) {
            // Model trả rỗng hoàn toàn → dùng phần tính bằng quy tắc cho phần còn thiếu.
            Narrative base = Narrative.fallback(metrics, sufficient);
            if (strengths.isEmpty()) {
                strengths = base.strengths();
            }
            if (areas.isEmpty()) {
                areas = base.areasToImprove();
            }
            if (recommendations.isEmpty()) {
                recommendations = base.recommendations();
            }
            encouragement = encouragement == null ? base.encouragement() : encouragement;
        }
        return new Narrative(summary, strengths, areas, recommendations, encouragement);
    }

    private List<String> strings(JsonNode root, String field, int maxItems, int maxLength) {
        JsonNode arr = root.get(field);
        if (arr == null || !arr.isArray()) {
            return List.of();
        }
        List<String> out = new ArrayList<>();
        for (JsonNode n : arr) {
            String v = clip(JsonPayloads.asText(n), maxLength);
            if (v != null) {
                out.add(v);
            }
            if (out.size() >= maxItems) {
                break;
            }
        }
        return out;
    }

    private String clip(String value, int max) {
        if (value == null) {
            return null;
        }
        String v = value.strip().replaceAll("[\\p{Cntrl}&&[^\\n]]", "");
        if (v.isEmpty()) {
            return null;
        }
        return v.length() <= max ? v : v.substring(0, max);
    }

    /**
     * Bản tổng hợp bằng QUY TẮC, không qua LLM — dùng khi AI lỗi.
     * Chỉ mô tả đúng những gì số liệu chứng minh được, không kết luận vượt mức.
     */
    private record Narrative(String summary, List<String> strengths, List<String> areasToImprove,
                             List<String> recommendations, String encouragement) {

        static Narrative fallback(LearningMetrics metrics, boolean sufficient) {
            List<TopicMetric> topics = metrics.topics();
            List<String> strengths = new ArrayList<>();
            List<String> areas = new ArrayList<>();
            List<String> recommendations = new ArrayList<>();

            if (!sufficient) {
                String summary = metrics.totalPlays() == 0
                        ? "Chưa có dữ liệu lượt chơi để đánh giá."
                        : "Đã ghi nhận " + metrics.totalPlays() + " lượt chơi với "
                          + metrics.totalQuestionsAnswered() + " câu đã trả lời. "
                          + "Dữ liệu còn ít nên chưa đủ căn cứ để đánh giá năng lực theo chủ đề.";

                List<TopicMetric> weak = confidentTopics(topics).stream()
                        .sorted(Comparator.comparingInt(TopicMetric::accuracy))
                        .limit(2)
                        .toList();
                for (TopicMetric t : weak) {
                    areas.add("Cần luyện thêm ở chủ đề \"" + t.displayName() + "\" (tỷ lệ đúng "
                              + t.accuracy() + "% trên " + t.questionsAnswered() + " câu).");
                    recommendations.add("Làm thêm " + Math.max(5, t.questionsAnswered()) + " câu trắc nghiệm về \""
                                        + t.displayName() + "\" rồi xem lại phần sai.");
                }
                if (recommendations.isEmpty()) {
                    recommendations.add("Chơi thêm vài lượt ở các chủ đề đang học để hệ thống có đủ dữ liệu phân tích.");
                }
                return new Narrative(summary, strengths, areas, recommendations,
                        "Mỗi lượt chơi đều giúp hồ sơ học tập đầy đủ hơn. Cứ tiếp tục luyện tập nhé!");
            }

            List<TopicMetric> confident = confidentTopics(topics);
            List<TopicMetric> best = confident.stream()
                    .sorted(Comparator.comparingInt(TopicMetric::accuracy).reversed()).limit(2).toList();
            List<TopicMetric> worst = confident.stream()
                    .sorted(Comparator.comparingInt(TopicMetric::accuracy)).limit(2).toList();

            for (TopicMetric t : best) {
                strengths.add("Đạt tỷ lệ đúng " + t.accuracy() + "% ở chủ đề \"" + t.displayName() + "\".");
            }
            for (TopicMetric t : worst) {
                if (t.accuracy() < 70) {
                    areas.add("Tỷ lệ đúng ở \"" + t.displayName() + "\" mới đạt " + t.accuracy() + "%.");
                    recommendations.add("Ôn lại kiến thức nền của \"" + t.displayName() + "\" rồi luyện thêm câu khó hơn một chút.");
                }
            }
            if (metrics.trend().accuracyDelta() != null && metrics.trend().accuracyDelta() <= -5) {
                recommendations.add("Tỷ lệ đúng đang giảm so với trước; nên ôn lại các lượt chơi gần đây.");
            }
            if (recommendations.isEmpty()) {
                recommendations.add("Tiếp tục luyện đều đặn ở các chủ đề hiện tại để giữ vững tiến bộ.");
            }
            if (strengths.isEmpty()) {
                strengths.add("Đã hoàn thành " + metrics.totalPlays() + " lượt chơi với "
                              + metrics.totalQuestionsAnswered() + " câu đã trả lời.");
            }

            String summary = "Trong " + metrics.totalPlays() + " lượt chơi, học sinh trả lời đúng "
                             + metrics.totalCorrectAnswers() + "/" + metrics.totalQuestionsAnswered()
                             + " câu (tỷ lệ đúng " + metrics.accuracy() + "%).";
            return new Narrative(summary, strengths, areas, recommendations,
                    "Kết quả đang tích cực, hãy giữ nhịp luyện tập đều đặn nhé!");
        }

        /** Chủ đề đủ mẫu để dám kết luận. */
        static List<TopicMetric> confidentTopics(List<TopicMetric> topics) {
            return topics.stream().filter(t -> t.questionsAnswered() >= 5).toList();
        }
    }
}