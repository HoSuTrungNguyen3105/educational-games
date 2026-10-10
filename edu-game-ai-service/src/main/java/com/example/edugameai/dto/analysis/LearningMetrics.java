package com.example.edugameai.dto.analysis;

import java.util.List;

/**
 * Các chỉ số học tập do JAVA tính toán — đây là nguồn sự thật, không phải LLM.
 *
 * <p>Công thức bám theo {@code server/src/lib/gradeAnswer.js} và
 * {@code server/src/services/gamePlayService.js}:
 * {@code accuracy = round(correct / answered * 100)} với {@code answered = correct + wrong}.
 */
public record LearningMetrics(

        int totalPlays,
        int totalQuestionsAnswered,
        int totalCorrectAnswers,
        int totalWrongAnswers,

        /** % trung bình có trọng số theo số câu đã trả lời — khớp công thức backend. */
        int accuracy,

        /** Điểm trung bình mỗi lượt chơi (đơn vị điểm của hệ thống, không phải %). */
        double averageScore,

        /** Tổng XP đã nhận. */
        long totalXp,

        /** Thời gian hoàn thành trung bình (giây). */
        double averageCompletionTimeSeconds,

        List<TopicMetric> topics,
        TrendMetric trend,
        String periodFrom,
        String periodTo) {

    /**
     * Kết quả theo từng game/chủ đề.
     *
     * @param gameName  tên game do backend chính cung cấp (không phải do AI bịa)
     * @param subject   môn học lấy từ bảng games
     * @param topic     chủ đề lấy từ bảng games; rỗng thì dùng tên game
     * @param accuracy  % đúng trong game này
     */
    public record TopicMetric(
            String gameId,
            String gameName,
            String subject,
            String topic,
            int plays,
            int questionsAnswered,
            int correctAnswers,
            int accuracy) {

        /** Nhãn dùng cho con người và cho LLM. */
        public String displayName() {
            if (topic != null && !topic.isBlank()) {
                return topic;
            }
            if (gameName != null && !gameName.isBlank()) {
                return gameName;
            }
            return "Chủ đề chưa xác định";
        }
    }

    /**
     * Xu hướng tiến bộ.
     *
     * @param direction           {@code improving} | {@code declining} | {@code stable} | {@code unknown}
     * @param accuracyDelta       chênh lệch điểm % giữa nửa sau và nửa trước (có thể âm)
     * @param firstHalfAccuracy   % đúng của nửa đầu chuỗi lượt chơi
     * @param secondHalfAccuracy  % đúng của nửa sau
     */
    public record TrendMetric(
            String direction,
            Integer accuracyDelta,
            Integer firstHalfAccuracy,
            Integer secondHalfAccuracy) {

        public static TrendMetric unknown() {
            return new TrendMetric("unknown", null, null, null);
        }
    }
}