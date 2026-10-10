package com.example.edugameai.dto.chat;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu hỏi chatbot AI.
 *
 * <p>Lịch sử do client gửi kèm được coi là DỮ LIỆU KHÔNG ĐÁNG TIN CẬY: nó chỉ được dùng
 * làm ngữ cảnh cho LLM, không bao giờ dùng để suy ra quyền hay truy cập dữ liệu nào.
 */
public record AiChatRequest(

        @NotBlank(message = "message không được để trống")
        @Size(max = 2000, message = "message không được dài quá 2000 ký tự")
        String message,

        @Size(max = 80, message = "subject không được dài quá 80 ký tự")
        String subject,

        @Size(max = 120, message = "topic không được dài quá 120 ký tự")
        String topic,

        /** Chỉ dùng để gom nhóm hội thoại phía client — server không lưu, không cấp quyền. */
        @Size(max = 64, message = "conversationId không được dài quá 64 ký tự")
        String conversationId,

        @Valid
        @Size(max = 10, message = "history chỉ nhận tối đa 10 lượt")
        List<ChatTurn> history) {

    /**
     * @param role    {@code user} hoặc {@code assistant}; mọi giá trị khác bị bỏ qua khi chuẩn hoá
     * @param content nội dung lượt trước, tối đa 1000 ký tự
     */
    public record ChatTurn(
            @Size(max = 16) String role,
            @Size(max = 1000, message = "mỗi lượt trong lịch sử tối đa 1000 ký tự") String content) {
    }
}