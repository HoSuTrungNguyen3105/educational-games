package com.example.edugameai.dto.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Một bản ghi {@code results} của backend chính — nguồn dữ liệu thật cho phân tích học tập.
 *
 * <p>Lưu ý: {@code createdAt} là CHUỖI ISO-8601 do {@code gamePlayService.js} ghi vào,
 * không phải kiểu ngày của MongoDB.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CoreResult(
        String id,
        String userId,
        String gameId,
        Double score,
        Integer correctAnswers,
        Integer totalQuestions,
        Integer accuracy,
        Integer completionTime,
        Double xpGained,
        Boolean verified,
        String createdAt) {

    /** Chỉ lấy lượt chơi đã được server chấm — lượt do client tự gửi điểm không đáng tin. */
    public boolean isServerGraded() {
        return Boolean.TRUE.equals(verified) && userId != null && !userId.isBlank();
    }
}