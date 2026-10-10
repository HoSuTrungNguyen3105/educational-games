package com.example.edugameai.dto.analysis;

import java.util.List;

/**
 * Báo cáo phân tích học tập.
 *
 * <p>{@code metrics} do Java tính và là duy nhất đáng tin. Các trường còn lại là phần
 * LLM DIỄN GIẢI, đã bị giới hạn độ dài và cắt bớt trước khi trả ra.
 *
 * @param dataSufficient có đủ dữ liệu để kết luận hay không
 * @param disclaimer     lưu ý bắt buộc cho người đọc
 */
public record AiLearningAnalysisResponse(
        LearningMetrics metrics,
        String summary,
        List<String> strengths,
        List<String> areasToImprove,
        List<String> recommendations,
        String encouragement,
        boolean dataSufficient,
        String disclaimer) {
}