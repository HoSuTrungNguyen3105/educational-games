import { apiFetch } from "./api.js";

export const conversationApi = {
  async list() {
    return apiFetch("/conversations") || [];
  },

  async getDM(targetUserId) {
    return apiFetch("/conversations/dm", {
      method: "POST",
      body: { targetUserId },
    });
  },

  async get(id) {
    return apiFetch(`/conversations/${id}`);
  },

  async getMembers(id) {
    return apiFetch(`/conversations/${id}/members`) || [];
  },

  async addMember(id, userId, displayName) {
    return apiFetch(`/conversations/${id}/members`, {
      method: "POST",
      body: { userId, displayName },
    });
  },
};
