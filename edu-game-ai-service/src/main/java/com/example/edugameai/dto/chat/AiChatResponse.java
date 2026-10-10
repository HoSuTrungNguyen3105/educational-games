package com.example.edugameai.dto.chat;

/**
 * Câu trả lời của chatbot.
 *
 * @param answer          nội dung trả lời đã cắt ngắn ở độ dài an toàn
 * @param conversationId  mã hội thoại do client quản lý, được echo lại nguyên vẹn
 * @param truncated       {@code true} nếu câu trả lời bị cắt do quá dài
 */
public record AiChatResponse(String answer, String conversationId, boolean truncated) {
}