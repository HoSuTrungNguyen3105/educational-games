import { apiFetch } from "./api.js";

export const conversationApi = {
  async list(token) {
    return apiFetch("/conversations", { _token: token }) || [];
  },

  async getDM(targetUserId, token) {
    return apiFetch("/conversations/dm", {
      method: "POST",
      body: { targetUserId },
      _token: token,
    });
  },

  async get(id, token) {
    return apiFetch(`/conversations/${id}`, { _token: token });
  },

  async getMembers(id, token) {
    return apiFetch(`/conversations/${id}/members`, { _token: token }) || [];
  },

  async addMember(id, userId, displayName, token) {
    return apiFetch(`/conversations/${id}/members`, {
      method: "POST",
      body: { userId, displayName },
      _token: token,
    });
  },
};
