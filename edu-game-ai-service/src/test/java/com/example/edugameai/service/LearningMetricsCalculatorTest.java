package com.example.edugameai.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.example.edugameai.dto.analysis.LearningMetrics;
import com.example.edugameai.dto.core.CoreGame;
import com.example.edugameai.dto.core.CoreResult;
import com.example.edugameai.exception.AiErrors;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LearningMetricsCalculatorTest {

    private final LearningMetricsCalculator calculator = new LearningMetricsCalculator();

    /**
     * Một lượt chơi đã được server chấm. {@code accuracy} được tính sẵn ở backend theo
     * công thức {@code correct/(correct+wrong)} — Java chỉ đọc lại, không tự tính lại.
     */
    private static CoreResult result(String userId, String gameId, int correct, int totalQuestions,
                                     double score, int seconds, double xp, String createdAt) {
        return new CoreResult("result-1", userId, gameId, score, correct, totalQuestions,
                totalQuestions > 0 ? Math.round(correct * 100f / totalQuestions) : 0,
                seconds, xp, true, createdAt);
    }

    @Test
    @DisplayName("tỷ lệ đúng tính từ correct/totalQuestions, không suy diễn 'số câu đã trả lời'")
    void accuracyComesFromStoredFields() {
        List<CoreResult> results = List.of(
                result("u1", "g1", 8, 12, 100, 60, 50, "2026-01-01T10:00:00Z"));

        LearningMetrics metrics = calculator.compute(results, Map.of(), null, null).metrics();

        assertEquals(1, metrics.totalPlays());
        assertEquals(12, metrics.totalQuestionsOffered());
        assertEquals(8, metrics.totalCorrectAnswers());
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
    @DisplayName("tổng hợp cộng dồn nhiều lượt chơi")
    void aggregatesAcrossPlays() {
        List<CoreResult> results = List.of(
                result("u1", "g1", 3, 5, 100, 30, 20, "2026-01-01T10:00:00Z"),
                result("u1", "g2", 2, 5, 60, 50, 15, "2026-01-02T10:00:00Z"));

        LearningMetrics metrics = calculator.compute(results, Map.of(), null, null).metrics();

        assertEquals(2, metrics.totalPlays());
        assertEquals(10, metrics.totalQuestionsOffered());
        assertEquals(5, metrics.totalCorrectAnswers());
        assertEquals(50, metrics.accuracy());
        assertEquals(80.0, metrics.averageScore());
        assertEquals(35L, metrics.totalXp());
        assertEquals(40.0, metrics.averageCompletionTimeSeconds());
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
        assertEquals(10, topic.questionsOffered());
        assertEquals(60, topic.accuracy());
    }

    @Test
    @DisplayName("chủ đề không có trong bảng games vẫn hiển thị được, không làm hỏng cả báo cáo")
    void unknownGameFallsBackGracefully() {
        List<CoreResult> results = List.of(result("u1", "game-bi-xoa", 3, 5, 100, 30, 20, "2026-01-01T10:00:00Z"));

        var topic = calculator.compute(results, Map.of(), null, null).metrics().topics().get(0);

        assertEquals("Chủ đề chưa xác định", topic.displayName());
        assertEquals(60, topic.accuracy());
    }

    @Test
    @DisplayName("phát hiện xu hướng tăng khi nửa sau tốt hơn nửa trước")
    void detectsImprovingTrend() {
        List<CoreResult> improving = List.of(
                result("u1", "g1", 1, 10, 20, 30, 5, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 1, 10, 20, 30, 5, "2026-01-02T10:00:00Z"),
                result("u1", "g1", 9, 10, 90, 30, 25, "2026-01-03T10:00:00Z"),
                result("u1", "g1", 10, 10, 100, 30, 30, "2026-01-04T10:00:00Z"));

        var trend = calculator.compute(improving, Map.of(), null, null).metrics().trend();

        assertEquals("improving", trend.direction());
        assertEquals(10, trend.firstHalfAccuracy());
        assertEquals(95, trend.secondHalfAccuracy());
        assertEquals(85, trend.accuracyDelta());
    }

    @Test
    @DisplayName("phát hiện xu hướng giảm")
    void detectsDecliningTrend() {
        List<CoreResult> declining = List.of(
                result("u1", "g1", 10, 10, 100, 30, 30, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 10, 10, 100, 30, 30, "2026-01-02T10:00:00Z"),
                result("u1", "g1", 2, 10, 20, 30, 5, "2026-01-03T10:00:00Z"),
                result("u1", "g1", 1, 10, 20, 30, 5, "2026-01-04T10:00:00Z"));

        assertEquals("declining", calculator.compute(declining, Map.of(), null, null).metrics().trend().direction());
    }

    @Test
    @DisplayName("chênh lệch dưới ngưỡng thì kết luận 'ổn định', không phóng đại")
    void smallDeltaIsStable() {
        List<CoreResult> stable = List.of(
                result("u1", "g1", 50, 100, 500, 300, 20, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 50, 100, 500, 300, 20, "2026-01-02T10:00:00Z"),
                result("u1", "g1", 52, 100, 520, 300, 20, "2026-01-03T10:00:00Z"),
                result("u1", "g1", 52, 100, 520, 300, 20, "2026-01-04T10:00:00Z"));

        var trend = calculator.compute(stable, Map.of(), null, null).metrics().trend();

        assertEquals("stable", trend.direction());
        assertEquals(2, trend.accuracyDelta());
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
    @DisplayName("ít dữ liệu thì báo chưa đủ để kết luận")
    void insufficientDataIsFlagged() {
        List<CoreResult> results = List.of(result("u1", "g1", 1, 2, 20, 30, 5, "2026-01-01T10:00:00Z"));

        var result = calculator.compute(results, Map.of(), null, null);

        assertFalse(result.dataSufficient());
        assertTrue(result.note().contains("còn ít"));
    }

    @Test
    @DisplayName("đủ dữ liệu thì không kèm cảnh báo")
    void sufficientDataHasNoNote() {
        List<CoreResult> results = List.of(
                result("u1", "g1", 4, 5, 100, 30, 20, "2026-01-01T10:00:00Z"),
                result("u1", "g1", 4, 5, 100, 30, 20, "2026-01-02T10:00:00Z"));

        var result = calculator.compute(results, Map.of(), null, null);

        assertTrue(result.dataSufficient());
        assertNull(result.note());
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
        AiErrors.InvalidRequest error = assertThrows(AiErrors.InvalidRequest.class,
                () -> LearningMetricsCalculator.validatePeriod(
                        LocalDate.parse("2026-05-01"), LocalDate.parse("2026-04-01")));

        assertTrue(error.getMessage().contains("'to'"));
    }

    @Test
    @DisplayName("bộ lọc từ chối ngày bắt đầu ở tương lai")
    void rejectsFutureStartDate() {
        assertThrows(AiErrors.InvalidRequest.class, () -> LearningMetricsCalculator.validatePeriod(
                LocalDate.now().plusYears(1), null));
    }

    @Test
    @DisplayName("dữ liệu rác không làm sập bộ tính toán")
    void toleratesGarbageValues() {
        List<CoreResult> results = List.of(
                new CoreResult(null, "u1", null, null, null, null, null, null, null, true, null),
                new CoreResult(null, "u1", "g1", -5.0, -3, -1, -10, 0, -2.0, true, "không-phải-ngày"));

        var metrics = calculator.compute(results, Map.of(), null, null).metrics();

        assertEquals(2, metrics.totalPlays());
        assertTrue(metrics.accuracy() >= 0);
        assertTrue(metrics.averageScore() >= 0);
    }
}