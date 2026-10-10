package com.example.edugameai.dto.quiz;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu sinh câu hỏi trắc nghiệm.
 *
 * <p>{@code quantity} là alias cũ của {@code count} (frontend hiện tại đang gửi
 * {@code quantity} cho {@code POST /api/ai/generate-question}), giữ lại để không phá
 * hợp đồng cũ.
 */
public record AiQuizGenerateRequest(

        @NotBlank(message = "subject không được để trống")
        @Size(max = 80, message = "subject không được dài quá 80 ký tự")
        String subject,

        @Min(value = 1, message = "grade phải từ 1 trở lên")
        @Max(value = 12, message = "grade không được vượt quá 12")
        Integer grade,

        @NotBlank(message = "topic không được để trống")
        @Size(max = 120, message = "topic không được dài quá 120 ký tự")
        String topic,

        /** {@code easy} | {@code medium} | {@code hard}. Mặc định {@code medium}. */
        @Size(max = 16) String difficulty,

        @JsonAlias("quantity")
        @Min(value = 1, message = "count phải từ 1 trở lên")
        @Max(value = 20, message = "mỗi lần tối đa 20 câu")
        Integer count,

        /** Ngôn ngữ sinh câu hỏi. Mặc định {@code vi}. */
        @Size(max = 32) String language,

        /** Tài liệu/nội dung đầu vào để AI bám theo. Bị cắt còn tối đa 2000 ký tự. */
        @Size(max = 2000, message = "sourceContent không được dài quá 2000 ký tự")
        String sourceContent) {
}