import { apiFetch } from "./api.js";

/**
 * Điểm danh mỗi ngày của học sinh (server: checkinService).
 * GET  → { checkedInToday, streak, longestStreak, totalCheckins,
 *          rewardToday, week: [{ date, checkedIn, isToday }] }
 * POST → điểm danh hôm nay: { ...trạng thái mới, alreadyCheckedIn, reward, coins }
 */
export const checkinService = {
  async getStatus() {
    return apiFetch("/users/me/check-in");
  },

  async checkIn() {
    return apiFetch("/users/me/check-in", { method: "POST" });
  },
};
