package com.example.edugameai.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.example.edugameai.dto.analysis.LearningMetrics;
import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LearningMetricsCalculatorTest {

    private final LearningMetricsCalculator calculator = new LearningMetricsCalculator();

    private static CoreResult result(String userId, String gameId, int correct, int total,
                                     double score, int seconds, double xp, String createdAt) {
        return new CoreResult("result-1", userId, gameId, score, correct, total,
                total > 0 ? Math.round(correct * 100f / total) : 0,
                seconds, xp, true, createdAt);
    }

    @Test
    @DisplayName("accuracy tính theo đúng công thức backend: correct/(correct+wrong)*100")
    void accuracyFollowsBackendFormula() {
        // 8 đúng / 4 sai → answered = 12 → 66.67% → làm tròn 67
        List<CoreResult> results = List.of(
                result("u1", "g1", 8, 12, 100, 60, 50, "2026-01-01T10:00:00Z"));

        LearningMetrics metrics = calculator.compute(results, Map.of(), null, null).metrics();

        assertEquals(1, metrics.totalPlays());
        assertEquals(12, metrics.totalQuestionsAnswered());
        assertEquals(8, metrics.totalCorrectAnswers());
        assertEquals(4, metrics.totalWrongAnswers());
        assertEquals(67, metrics.accuracy());
    }

    @Test
    @DisplayName("dữ liệu rỗng trả metrics 0 và báo chưa đủ dữ liệu, không ném lỗi")
    void emptyDataIsNotAnError() {
        LearningMetricsCalculator.Result result = calculator.compute(List.of(), Map.of(), null, null);

        assertFalse(result.dataSufficient());
        assertEquals(0, result.metrics().totalPlays());
        assertEquals(0, result.metrics().accuracy());
        assertEquals("unknown", result.metrics().trend().direction());
    }

    @Test
    @DisplayName("tỷ lệ đúng được tính có trọng số theo số câu, không phải trung bình cộng")
    void accuracyIsWeightedByAnsweredCount() {
        // Lượt 1: 1/1 đúng (100%). Lượt 2: 1/9 đúng (11%). Trung bình cộng = 55,
        // nhưng công thức có trọng số = 2/10 = 20%.
        List<CoreResult> results = List.of(
                result("u1", "g1", 1, 1, 100, 10, 10, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 1, 9, 20, 60, 10, "2026-01-02T10:00:00Z"));

        LearningMetrics metrics = calculator.compute(results, Map.of(), null, null).metrics();

        assertEquals(20, metrics.accuracy());
    }

    @Test
    @DisplayName("gom chỉ số theo game và gắn tên/môn/chủ đề từ bảng games")
    void aggregatesByGameUsingGameIndex() {
        CoreGame game = new CoreGame("mongo-1", null, "TOAN101", "Đua Toán", "Toán", "Phân số");
        List<CoreResult> results = List.of(
                result("u1", "mongo-1", 4, 5, 100, 30, 20, "2026-01-01T10:00:00Z"),
                result("u1", "mongo-1", 2, 5, 60, 40, 10, "2026-01-02T10:00:00Z"));

        LearningMetrics metrics = calculator.compute(results, Map.of("mongo-1", game), null, null).metrics();

        assertEquals(1, metrics.topics().size());
        var topic = metrics.topics().get(0);
        assertEquals("Đua Toán", topic.gameName());
        assertEquals("Toán", topic.subject());
        assertEquals("Phân số", topic.displayName());
        assertEquals(2, topic.plays());
        assertEquals(60, topic.accuracy());
    }

    @Test
    @DisplayName("phát hiện xu hướng tăng/giảm khi đủ lượt chơi")
    void detectsTrendAcrossPlays() {
        List<CoreResult> improving = List.of(
                result("u1", "g1", 1, 10, 20, 30, 5, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 1, 10, 20, 30, 5, "2026-01-02T10:00:00Z"),
                result("u1", "g1", 9, 10, 90, 30, 25, "2026-01-03T10:00:00Z"),
                result("u1", "g1", 10, 10, 100, 30, 30, "2026-01-04T10:00:00Z"));

        var trend = calculator.compute(improving, Map.of(), null, null).metrics().trend();

        assertEquals("improving", trend.direction());
        assertEquals(90, trend.firstHalfAccuracy());
        assertEquals(95, trend.secondHalfAccuracy());
        assertEquals(5, trend.accuracyDelta());
    }

    @Test
    @DisplayName("chưa đủ lượt chơi thì không kết luận xu hướng")
    void trendUnknownWithTooFewPlays() {
        List<CoreResult> results = List.of(
                result("u1", "g1", 1, 10, 20, 30, 5, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 9, 10, 90, 30, 5, "2026-01-02T10:00:00Z"));

        assertEquals("unknown", calculator.compute(results, Map.of(), null, null).metrics().trend().direction());
    }

    @Test
    @DisplayName("lọc theo khoảng ngày trên createdAt dạng chuỗi ISO")
    void filtersByDateRange() {
        CoreResult inside = result("u1", "g1", 5, 5, 50, 30, 10, "2026-03-15T08:00:00Z");
        CoreResult before = result("u1", "g1", 5, 5, 50, 30, 10, "2026-01-15T08:00:00Z");
        CoreResult after = result("u1", "g1", 5, 5, 50, 30, 10, "2026-06-15T08:00:00Z");

        assertTrue(calculator.withinPeriod(inside, LocalDate.parse("2026-03-01"), LocalDate.parse("2026-03-31")));
        assertFalse(calculator.withinPeriod(before, LocalDate.parse("2026-03-01"), LocalDate.parse("2026-03-31")));
        assertFalse(calculator.withinPeriod(after, LocalDate.parse("2026-03-01"), LocalDate.parse("2026-03-31")));
    }

    @Test
    @DisplayName("chỉ tính lượt chơi đã được server chấm")
    void unverifiedResultsAreMarkedUntrusted() {
        CoreResult clientScored = new CoreResult("r", "u1", "g1", 9999.0, 10, 10, 100, 5, 999.0,
                false, "2026-01-01T10:00:00Z");
        assertFalse(clientScored.isServerGraded());

        CoreResult serverGraded = new CoreResult("r", "u1", "g1", 100.0, 10, 10, 100, 5, 50.0,
                true, "2026-01-01T10:00:00Z");
        assertTrue(serverGraded.isServerGraded());
    }

    @Test
    @DisplayName("bộ lọc từ chối khoảng thời gian đảo ngược")
    void rejectsInvertedPeriod() {
        try {
            LearningMetricsCalculator.validatePeriod(LocalDate.parse("2026-05-01"), LocalDate.parse("2026-04-01"));
            throw new AssertionError("Kỳ vọng ném lỗi khi 'to' trước 'from'");
        } catch (com.example.edugameai.exception.AiErrors.InvalidRequest expected) {
            assertTrue(expected.getMessage().contains("'to'"));
        }
    }
}