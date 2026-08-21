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

  // DM chat — luôn dùng user token (không dùng teacher token)
  async listDmMessages(targetUserId, { before, limit = 30, token } = {}) {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return apiFetch(`/chat/dm/${encodeURIComponent(targetUserId)}/messages${qs ? `?${qs}` : ""}`, {
      _token: token,
    });
  },

  async sendDmMessage(targetUserId, { content, clientMessageId, token }) {
    return apiFetch(`/chat/dm/${encodeURIComponent(targetUserId)}/messages`, {
      method: "POST",
      body: { content, clientMessageId },
      _token: token,
    });
  },
};
