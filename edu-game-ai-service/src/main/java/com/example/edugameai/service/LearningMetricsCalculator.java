package com.example.edugameai.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
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
 * <p>Công thức bám theo {@code server/src/lib/gradeAnswer.js}:
 * {@code accuracy = round(correct / answered * 100)}, {@code answered = correct + wrong}.
 */
@Component
public class LearningMetricsCalculator {

    /** Số chủ đề gửi cho LLM — đủ để dạo được mà không nhồi prompt. */
    private static final int MAX_TOPICS_FOR_PROMPT = 10;

    /** Ngưỡng coi là "chưa đủ dữ liệu để kết luận" cho MỘT chủ đề. */
    private static final int MIN_ANSWERS_PER_TOPIC = 5;

    /**
     * @param results kết quả đã lọc theo người dùng/ngày/game và đã loại lượt không do server chấm
     * @param games   map gameId → game để đổi id thành tên/môn/chủ đề
     * @param from    ngày bắt đầu (hoặc null)
     * @param to      ngày kết thúc (hoặc null)
     */
    public Result compute(List<CoreResult> results, Map<String, CoreGame> games,
                          LocalDate from, LocalDate to) {
        if (results == null || results.isEmpty()) {
            return new Result(emptyMetrics(games, from, to), false,
                    "Chưa có dữ liệu lượt chơi nào trong khoảng thời gian này.");
        }

        List<CoreResult> sorted = new ArrayList<>(results);
        sorted.sort(Comparator.comparing(
                r -> parseInstant(r.createdAt()),
                Comparator.nullsLast(Comparator.naturalOrder())));

        int plays = sorted.size();
        int correct = 0;
        int wrong = 0;
        int answeredTotal = 0;
        int scoreSum = 0;
        int scoreSamples = 0;
        int timeSum = 0;
        int timeSamples = 0;
        double xpSum = 0;

        Map<String, TopicAccumulator> byGame = new LinkedHashMap<>();

        for (CoreResult r : sorted) {
            int correctCount = nonNegative(r.correctAnswers());
            int total = nonNegative(r.totalQuestions());
            // `answered` của backend = correct + wrong, trong đó wrong = answered - correct.
            int answered = Math.min(total, Math.max(correctCount, total - correctCount));
            if (total <= 0) {
                answered = correctCount;
            }

            correct += correctCount;
            wrong += Math.max(0, answered - correctCount);
            answeredTotal += answered;

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

            byGame.computeIfAbsent(key(r.gameId()), k -> new TopicAccumulator()).add(r, answered);
        }

        int accuracy = answeredTotal > 0 ? Math.round(correct * 100f / answeredTotal) : 0;
        double averageScore = scoreSamples > 0 ? (double) scoreSum / scoreSamples : 0;
        double averageTime = timeSamples > 0 ? (double) timeSum / timeSamples : 0;

        List<TopicMetric> topics = topics(byGame, games);
        TrendMetric trend = trend(sorted);

        String periodFrom = firstPeriodLabel(sorted, from);
        String periodTo = lastPeriodLabel(sorted, to);

        LearningMetrics metrics = new LearningMetrics(
                plays, answeredTotal, correct, wrong, accuracy,
                round1(averageScore), Math.round(xpSum), round1(averageTime),
                topics, trend, periodFrom, periodTo);

        boolean sufficient = answeredTotal >= 5 && plays >= 2;
        String note = sufficient
                ? null
                : "Dữ liệu còn ít (" + plays + " lượt chơi, " + answeredTotal
                  + " câu đã trả lời). Chưa nên kết luận về năng lực của học sinh.";
        return new Result(metrics, sufficient, note);
    }

    /** Danh sách chủ đề đủ dữ liệu để kết luận mạnh/yếu. */
    public List<TopicMetric> confidentTopics(List<TopicMetric> topics) {
        return topics.stream().filter(t -> t.questionsAnswered() >= MIN_ANSWERS_PER_TOPIC).toList();
    }

    private LearningMetrics emptyMetrics(Map<String, CoreGame> games, LocalDate from, LocalDate to) {
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
                    acc.answered,
                    acc.correct,
                    acc.answered > 0 ? Math.round(acc.correct * 100f / acc.answered) : 0));
        }
        out.sort(Comparator.comparingInt(TopicMetric::questionsAnswered).reversed()
                .thenComparing(TopicMetric::displayName));
        return out.size() > MAX_TOPICS_FOR_PROMPT ? out.subList(0, MAX_TOPICS_FOR_PROMPT) : out;
    }

    /**
     * So sánh nửa sau với nửa trước theo THỨ TỰ THỜI GIAN của các lượt chơi.
     * Cần ít nhất 4 lượt mới so sánh được; ngưỡng thay đổi 5 điểm %.
     */
    private TrendMetric trend(List<CoreResult> sorted) {
        if (sorted.size() < 4) {
            return TrendMetric.unknown();
        }
        int mid = sorted.size() / 2;
        Integer first = accuracy(sorted.subList(0, mid));
        Integer second = accuracy(sorted.subList(mid, sorted.size()));
        if (first == null || second == null) {
            return TrendMetric.unknown();
        }
        int delta = second - first;
        String direction;
        if (delta >= 5) {
            direction = "improving";
        } else if (delta <= -5) {
            direction = "declining";
        } else {
            direction = "stable";
        }
        return new TrendMetric(direction, delta, first, second);
    }

    /** Tỷ lệ đúng theo công thức backend: correct / (correct + wrong). */
    private Integer accuracy(List<CoreResult> subset) {
        int correct = 0;
        int answered = 0;
        for (CoreResult r : subset) {
            int correctCount = nonNegative(r.correctAnswers());
            int total = nonNegative(r.totalQuestions());
            int a = total <= 0 ? correctCount : Math.min(total, Math.max(correctCount, total - correctCount));
            correct += correctCount;
            answered += a;
        }
        return answered > 0 ? Math.round(correct * 100f / answered) : null;
    }

    private String firstPeriodLabel(List<CoreResult> sorted, LocalDate from) {
        Instant first = parseInstant(sorted.get(0).createdAt());
        return from != null ? from.toString() : (first == null ? null : first.toString());
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
            // Bỏ qua, xử lý bên dưới
        }
        try {
            return LocalDateTimeHolder.parse(createdAt);
        } catch (Exception ignored) {
            return null;
        }
    }

    /** Lọc kết quả theo khoảng ngày, dùng múi giờ mặc định của server. */
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
        if (from == null || to == null) {
            return;
        }
        if (to.isBefore(from)) {
            throw new AiErrors.InvalidRequest("Khoảng thời gian không hợp lệ: 'to' phải sau 'from'.");
        }
        LocalDate limit = LocalDate.now(ZoneId.systemDefault()).plusDays(1);
        if (from.isAfter(limit)) {
            throw new AiErrors.InvalidRequest("Ngày bắt đầu không được ở tương lai.");
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
        private int answered;
        private int correct;

        void add(CoreResult r, int answered) {
            this.gameKey = r.gameId() == null || r.gameId().isBlank() ? null : r.gameId();
            this.plays++;
            this.answered += answered;
            this.correct += r.correctAnswers() == null || r.correctAnswers() < 0 ? 0 : r.correctAnswers();
        }
    }

    /** Kết quả tính toán kèm cờ đủ dữ liệu. */
    public record Result(LearningMetrics metrics, boolean dataSufficient, String note) {
    }

    /** Parse {@code yyyy-MM-ddTHH:mm:ss} không có vùng giờ (một số bản ghi cũ). */
    private static final class LocalDateTimeHolder {
        static Instant parse(String value) {
            return java.time.LocalDateTime.parse(value).toInstant(java.time.ZoneOffset.UTC);
        }
    }
}