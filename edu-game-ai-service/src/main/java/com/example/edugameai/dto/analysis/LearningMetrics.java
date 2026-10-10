package com.example.edugameai.dto.analysis;

import java.util.List;

/**
 * Các chỉ số học tập do JAVA tính toán — đây là nguồn sự thật, không phải LLM.
 *
 * <p><b>Vì sao không dùng "số câu đã trả lời"?</b> Bản ghi {@code results} của backend chỉ lưu
 * {@code correctAnswers}, {@code totalQuestions} và {@code accuracy}. Theo
 * {@code server/src/lib/gradeAnswer.js}, {@code totalQuestions} là <b>tổng số câu của game</b>
 * chứ không phải số câu học sinh thực sự trả lời, và biến {@code answered} KHÔNG được lưu.
 * Vì vậy mọi chỉ số ở đây đều dựa trên hai số chắc chắn có sẵn — không suy diễn, không bịa.
 *
 * <ul>
 *   <li>{@link #accuracy()} = {@code totalCorrectAnswers / totalQuestionsOffered} — tỷ lệ đúng
 *       trên tổng số câu được đưa ra.
 *   <li>{@link #averagePlayAccuracy()} = trung bình {@code accuracy} mà backend đã lưu sẵn cho
 *       từng lượt (theo công thức {@code correct/(correct+wrong)}).
 * </ul>
 */
public record LearningMetrics(

        int totalPlays,

        /** Tổng số câu hệ thống đã đưa ra trong các ván chơi được tính. */
        int totalQuestionsOffered,

        int totalCorrectAnswers,

        /** {@code totalCorrectAnswers / totalQuestionsOffered * 100}. */
        int accuracy,

        /** Trung bình {@code accuracy} từng lượt — đúng định nghĩa của backend. */
        int averagePlayAccuracy,

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
     * @param gameName tên game do backend chính cung cấp (không phải do AI bịa)
     * @param subject  môn học lấy từ bảng games
     * @param topic    chủ đề lấy từ bảng games; rỗng thì dùng tên game
     * @param accuracy {@code correctAnswers / questionsOffered * 100}
     */
    public record TopicMetric(
            String gameId,
            String gameName,
            String subject,
            String topic,
            int plays,
            int questionsOffered,
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
     * Xu hướng tiến bộ, so sánh nửa sau với nửa trước theo thứ tự thời gian.
     *
     * @param direction          {@code improving} | {@code declining} | {@code stable} | {@code unknown}
     * @param accuracyDelta       chênh lệch điểm % giữa nửa sau và nửa trước (có thể âm)
     * @param firstHalfAccuracy   trung bình {@code accuracy} của nửa đầu
     * @param secondHalfAccuracy  trung bình {@code accuracy} của nửa sau
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