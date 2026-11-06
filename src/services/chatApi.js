import { apiFetch } from "./api.js";

export const chatApi = {
  async listMessages(conversationId, { before, limit = 30 } = {}) {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return apiFetch(`/chat/${encodeURIComponent(conversationId)}/messages${qs ? `?${qs}` : ""}`);
  },

  async sendMessage(conversationId, { content, senderId, playerName, clientMessageId }) {
    return apiFetch(`/chat/${encodeURIComponent(conversationId)}/messages`, {
      method: "POST",
      body: { content, senderId, playerName, clientMessageId },
    });
  },

  async markRead(conversationId, playerId, messageId) {
    return apiFetch(`/chat/${encodeURIComponent(conversationId)}/read`, {
      method: "POST",
      body: { playerId, messageId },
    });
  },

  async getUnread(conversationId, playerId) {
    return apiFetch(`/chat/${encodeURIComponent(conversationId)}/unread?playerId=${encodeURIComponent(playerId)}`);
  },

  async listDmMessages(targetUserId, { before, limit = 30 } = {}) {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return apiFetch(`/chat/dm/${encodeURIComponent(targetUserId)}/messages${qs ? `?${qs}` : ""}`);
  },

  async sendDmMessage(targetUserId, { content, clientMessageId }) {
    return apiFetch(`/chat/dm/${encodeURIComponent(targetUserId)}/messages`, {
      method: "POST",
      body: { content, clientMessageId },
    });
  },

  // Gửi sticker: đi qua đúng luồng gửi tin DM (server tự kiểm tra chặn và
  // lưu kind: "sticker" + nhãn mô tả) — sticker là id trong bộ emojiIcons.
  async sendDmSticker(targetUserId, { sticker, clientMessageId }) {
    return apiFetch(`/chat/dm/${encodeURIComponent(targetUserId)}/messages`, {
      method: "POST",
      body: { kind: "sticker", sticker, clientMessageId },
    });
  },

  // Thả / gỡ / đổi cảm xúc cho một tin nhắn DM (toggle phía server).
  // Trả về tin nhắn đã cập nhật (kèm mảng reactions mới).
  async toggleDmReaction(targetUserId, messageId, icon) {
    return apiFetch(
      `/chat/dm/${encodeURIComponent(targetUserId)}/messages/${encodeURIComponent(messageId)}/reaction`,
      { method: "POST", body: { icon } }
    );
  },
};
