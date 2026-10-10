package com.example.edugameai.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.example.edugameai.dto.analysis.LearningMetrics;
import com.example.edugameai.dto.analysis.LearningMetrics.TopicMetric;
import com.example.edugameai.dto.analysis.LearningMetrics.TrendMetric;
import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import com.example.edugameai.exception.AiErrors;
import org.springframework.stereotype.Component;

/**
 * Tính toán CHỈ SỐ HỌC TẬP bằng Java.
 *
 * <p>Đây là phần quan trọng nhất của tính năng phân tích: LLM KHÔNG BAO GIỜ tự tính điểm,
 * tự suy luận tỷ lệ đúng hay tự kết luận học sinh giỏi/yếu. Java chỉ gửi đi số liệu đã
 * kiểm chứng được rồi mới nhờ LLM diễn giải.
 *
 * <p>Chỉ dùng hai số chắc chắn có trong bản ghi {@code results}:
 * {@code correctAnswers} và {@code totalQuestions} (xem {@code gradeAnswer.js} — đây là
 * <b>tổng số câu của game</b>, không phải số câu đã trả lời), cộng {@code accuracy} mà
 * backend đã lưu sẵn. Không suy diễn số nào không có trong dữ liệu.
 */
@Component
public class LearningMetricsCalculator {

    /** Số chủ đề gửi cho LLM — đủ để dạo được mà không nhồi prompt. */
    private static final int MAX_TOPICS_FOR_PROMPT = 10;

    /** Ngưỡng dưới đó coi như chưa đủ dữ liệu để kết luận ở MỘT chủ đề. */
    public static final int MIN_QUESTIONS_PER_TOPIC = 5;

    /** Chênh lệch tối thiểu (điểm %) để gọi là đang tiến bộ hoặc tụt. */
    private static final int TREND_THRESHOLD = 5;

    /**
     * @param results kết quả đã lọc theo người dùng/ngày/game và đã loại lượt không do server chấm
     * @param games   map gameId → game để đổi id thành tên/môn/chủ đề
     * @param from    ngày bắt đầu (hoặc null)
     * @param to      ngày kết thúc (hoặc null)
     */
    public Result compute(List<CoreResult> results, Map<String, CoreGame> games,
                          LocalDate from, LocalDate to) {
        if (results == null || results.isEmpty()) {
            return new Result(emptyMetrics(from, to), false,
                    "Chưa có dữ liệu lượt chơi nào trong khoảng thời gian này.");
        }

        List<CoreResult> sorted = new ArrayList<>(results);
        sorted.sort(Comparator.comparing(r -> parseInstant(r.createdAt()),
                Comparator.nullsLast(Comparator.naturalOrder())));

        int plays = sorted.size();
        int offered = 0;
        int correct = 0;
        int playAccuracySum = 0;
        int playAccuracySamples = 0;
        int scoreSum = 0;
        int scoreSamples = 0;
        int timeSum = 0;
        int timeSamples = 0;
        double xpSum = 0;

        Map<String, TopicAccumulator> byGame = new LinkedHashMap<>();

        for (CoreResult r : sorted) {
            int correctCount = nonNegative(r.correctAnswers());
            int total = nonNegative(r.totalQuestions());

            offered += total;
            correct += Math.min(correctCount, total == 0 ? correctCount : total);

            if (r.accuracy() != null && r.accuracy() >= 0) {
                playAccuracySum += r.accuracy();
                playAccuracySamples++;
            }
            if (r.score() != null && r.score() >= 0) {
                scoreSum += (int) Math.round(r.score());
                scoreSamples++;
            }
            if (r.completionTime() != null && r.completionTime() > 0) {
                timeSum += r.completionTime();
                timeSamples++;
            }
            if (r.xpGained() != null && r.xpGained() > 0) {
                xpSum += r.xpGained();
            }

            byGame.computeIfAbsent(key(r.gameId()), k -> new TopicAccumulator()).add(r);
        }

        int accuracy = offered > 0 ? Math.round(correct * 100f / offered) : 0;
        int averagePlayAccuracy = playAccuracySamples > 0
                ? Math.round((float) playAccuracySum / playAccuracySamples) : 0;
        double averageScore = scoreSamples > 0 ? (double) scoreSum / scoreSamples : 0;
        double averageTime = timeSamples > 0 ? (double) timeSum / timeSamples : 0;

        LearningMetrics metrics = new LearningMetrics(
                plays, offered, correct, accuracy, averagePlayAccuracy,
                round1(averageScore), Math.round(xpSum), round1(averageTime),
                topics(byGame, games), trend(sorted),
                firstPeriodLabel(sorted, from), lastPeriodLabel(sorted, to));

        int minQuestions = minQuestionsForConclusion();
        int minPlays = minPlaysForConclusion();
        boolean sufficient = offered >= minQuestions && plays >= minPlays;

        String note = sufficient ? null
                : "Dữ liệu còn ít (" + plays + " lượt chơi, " + offered + " câu). "
                  + "Chưa nên kết luận về năng lực của học sinh.";
        return new Result(metrics, sufficient, note);
    }

    /** Các chủ đề đủ dữ liệu để dám kết luận mạnh/yếu. */
    public List<TopicMetric> confidentTopics(List<TopicMetric> topics) {
        return topics.stream()
                .filter(t -> t.questionsOffered() >= MIN_QUESTIONS_PER_TOPIC)
                .toList();
    }

    private int minQuestionsForConclusion() {
        return 5;
    }

    private int minPlaysForConclusion() {
        return 2;
    }

    private LearningMetrics emptyMetrics(LocalDate from, LocalDate to) {
        return new LearningMetrics(0, 0, 0, 0, 0, 0, 0, 0, List.of(), TrendMetric.unknown(),
                from == null ? null : from.toString(), to == null ? null : to.toString());
    }

    private List<TopicMetric> topics(Map<String, TopicAccumulator> byGame, Map<String, CoreGame> games) {
        List<TopicMetric> out = new ArrayList<>();
        for (Map.Entry<String, TopicAccumulator> e : byGame.entrySet()) {
            TopicAccumulator acc = e.getValue();
            CoreGame game = acc.gameKey == null ? null : games.get(acc.gameKey);
            out.add(new TopicMetric(
                    acc.gameKey,
                    game == null ? null : game.name(),
                    game == null ? null : game.subject(),
                    game == null ? null : game.topic(),
                    acc.plays,
                    acc.offered,
                    acc.correct,
                    acc.offered > 0 ? Math.round(acc.correct * 100f / acc.offered) : 0));
        }
        out.sort(Comparator.comparingInt(TopicMetric::questionsOffered).reversed()
                .thenComparing(TopicMetric::displayName));
        return out.size() > MAX_TOPICS_FOR_PROMPT ? out.subList(0, MAX_TOPICS_FOR_PROMPT) : out;
    }

    /**
     * So sánh nửa sau với nửa trước theo THỨ TỰ THỜI GIAN, dùng {@code accuracy} mà backend
     * đã lưu sẵn cho từng lượt. Cần ít nhất 4 lượt mới so sánh được.
     */
    private TrendMetric trend(List<CoreResult> sorted) {
        if (sorted.size() < 4) {
            return TrendMetric.unknown();
        }
        int mid = sorted.size() / 2;
        Integer first = meanPlayAccuracy(sorted.subList(0, mid));
        Integer second = meanPlayAccuracy(sorted.subList(mid, sorted.size()));
        if (first == null || second == null) {
            return TrendMetric.unknown();
        }
        int delta = second - first;
        String direction;
        if (delta >= TREND_THRESHOLD) {
            direction = "improving";
        } else if (delta <= -TREND_THRESHOLD) {
            direction = "declining";
        } else {
            direction = "stable";
        }
        return new TrendMetric(direction, delta, first, second);
    }

    private Integer meanPlayAccuracy(List<CoreResult> subset) {
        int sum = 0;
        int samples = 0;
        for (CoreResult r : subset) {
            if (r.accuracy() != null && r.accuracy() >= 0) {
                sum += r.accuracy();
                samples++;
            }
        }
        return samples > 0 ? Math.round((float) sum / samples) : null;
    }

    private String firstPeriodLabel(List<CoreResult> sorted, LocalDate from) {
        if (from != null) {
            return from.toString();
        }
        Instant first = parseInstant(sorted.get(0).createdAt());
        return first == null ? null : first.toString();
    }

    private String lastPeriodLabel(List<CoreResult> sorted, LocalDate to) {
        if (to != null) {
            return to.toString();
        }
        for (int i = sorted.size() - 1; i >= 0; i--) {
            Instant last = parseInstant(sorted.get(i).createdAt());
            if (last != null) {
                return last.toString();
            }
        }
        return null;
    }

    /**
     * {@code createdAt} của backend là CHUỖI ISO-8601 (xem {@code gamePlayService.js}),
     * không phải kiểu ngày của MongoDB — nên phải tự parse và chịu được dữ liệu cũ.
     */
    private Instant parseInstant(String createdAt) {
        if (createdAt == null || createdAt.isBlank()) {
            return null;
        }
        try {
            return Instant.parse(createdAt);
        } catch (DateTimeParseException ignored) {
            // Bản ghi cũ có thể không có vùng giờ — thử kiểu khác bên dưới.
        }
        try {
            return java.time.LocalDateTime.parse(createdAt).toInstant(java.time.ZoneOffset.UTC);
        } catch (Exception ignored) {
            return null;
        }
    }

    /** Lọc theo khoảng ngày, dùng múi giờ mặc định của server. */
    public boolean withinPeriod(CoreResult result, LocalDate from, LocalDate to) {
        Instant instant = parseInstant(result.createdAt());
        if (instant == null) {
            return from == null && to == null;
        }
        LocalDate day = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        if (from != null && day.isBefore(from)) {
            return false;
        }
        return to == null || !day.isAfter(to);
    }

    /** Kiểm tra ngày không hợp lệ và trả thông điệp thân thiện. */
    public static void validatePeriod(LocalDate from, LocalDate to) {
        if (from != null && to != null && to.isBefore(from)) {
            throw new AiErrors.InvalidRequest("Khoảng thời gian không hợp lệ: 'to' phải sau 'from'.");
        }
        if (from != null && from.isAfter(LocalDate.now(ZoneId.systemDefault()).plusDays(1))) {
            throw new AiErrors.InvalidRequest("Ngày bắt đầu không được ở tương lai.");
        }
        if (to != null && to.isAfter(LocalDate.now(ZoneId.systemDefault()).plusYears(5))) {
            throw new AiErrors.InvalidRequest("Ngày kết thúc không hợp lệ.");
        }
    }

    private int nonNegative(Integer value) {
        return value == null || value < 0 ? 0 : value;
    }

    private String key(String gameId) {
        return gameId == null || gameId.isBlank() ? null : gameId;
    }

    private double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    /** Bộ gom số liệu theo game. */
    private static final class TopicAccumulator {
        private String gameKey;
        private int plays;
        private int offered;
        private int correct;

        void add(CoreResult r) {
            this.gameKey = r.gameId() == null || r.gameId().isBlank() ? null : r.gameId();
            this.plays++;
            int total = r.totalQuestions() == null || r.totalQuestions() < 0 ? 0 : r.totalQuestions();
            int correctCount = r.correctAnswers() == null || r.correctAnswers() < 0 ? 0 : r.correctAnswers();
            this.offered += total;
            this.correct += Math.min(correctCount, total == 0 ? correctCount : total);
        }
    }

    /** Kết quả tính toán kèm cờ đủ dữ liệu. */
    public record Result(LearningMetrics metrics, boolean dataSufficient, String note) {
    }
}