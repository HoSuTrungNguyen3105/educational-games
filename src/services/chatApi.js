import { apiFetch } from "./api.js";

export const chatApi = {
  async listMessages(gameId, { before, limit = 30 } = {}) {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return apiFetch(`/chat/${gameId}/messages${qs ? `?${qs}` : ""}`);
  },

  async sendMessage(gameId, { content, senderId, playerName, clientMessageId }) {
    return apiFetch(`/chat/${gameId}/messages`, {
      method: "POST",
      body: { content, senderId, playerName, clientMessageId },
    });
  },

  async markRead(gameId, playerId, messageId) {
    return apiFetch(`/chat/${gameId}/read`, {
      method: "POST",
      body: { playerId, messageId },
    });
  },

  async getUnread(gameId, playerId) {
    return apiFetch(`/chat/${gameId}/unread?playerId=${encodeURIComponent(playerId)}`);
  },
};
