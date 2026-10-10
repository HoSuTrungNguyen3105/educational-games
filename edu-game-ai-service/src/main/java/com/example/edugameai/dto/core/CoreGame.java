package com.example.edugameai.dto.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Một bản ghi {@code games} của backend chính, dùng để đổi {@code gameId} trong kết quả
 * thành tên game / môn / chủ đề để con người và LLM đọc được.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CoreGame(
        @JsonProperty("_id") String mongoId,
        String id,
        String code,
        String name,
        String subject,
        String topic) {
}