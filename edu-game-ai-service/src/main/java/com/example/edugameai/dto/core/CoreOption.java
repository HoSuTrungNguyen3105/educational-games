package com.example.edugameai.dto.core;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Một phương án của câu hỏi trắc nghiệm, đã bỏ mọi trường nội bộ.
 *
 * <p>Không mang cờ "đúng/sai" — đáp án đúng được backend chính so khớp và gửi riêng, nên
 * danh sách này có thể đưa thẳng vào prompt mà không làm lộ đáp án cho phía gọi.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CoreOption(String id, String content) {
}