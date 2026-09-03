import { apiFetch } from "./api.js";

export const notificationService = {
  async list(unreadOnly = false) {
    return apiFetch(`/notifications${unreadOnly ? "?unread=true" : ""}`);
  },

  async unreadCount() {
    return apiFetch("/notifications/unread-count");
  },

  async markRead(id) {
    return apiFetch(`/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
  },

  async markAllRead() {
    return apiFetch("/notifications/read-all", { method: "POST" });
  },

  async registerDevice(token, deviceType = "WEB") {
    return apiFetch("/notifications/device-token", {
      method: "POST",
      body: { token, deviceType },
    });
  },

  async removeDevice(token) {
    return apiFetch("/notifications/device-token", {
      method: "DELETE",
      body: { token },
    });
  },

  async listDevices() {
    return apiFetch("/notifications/devices");
  },

  async testPush() {
    return apiFetch("/notifications/test-push", { method: "POST" });
  },
};
