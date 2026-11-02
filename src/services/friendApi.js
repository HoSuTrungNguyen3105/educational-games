import { apiFetch } from "./api.js";

// Client cho API bạn bè (/api/friends) — đợt 3.
// Backend lưu MỘT bản ghi cho mỗi cặp (friendships): gửi/chấp nhận/từ chối/
// thu hồi/hủy kết bạn. GET /friends trả cả 3 danh sách trong một lần gọi để
// trang Tìm bạn vẽ đúng trạng thái nút bấm (Kết bạn / Đã gửi / Chấp nhận).
export const friendApi = {
  /** { friends: [{user, since}], incoming: [...], outgoing: [...] } */
  async overview() {
    return apiFetch("/friends") || { friends: [], incoming: [], outgoing: [] };
  },

  /** Gửi lời mời; nếu phía kia đã mời mình trước → server tự chấp nhận (status ACCEPTED). */
  async sendRequest(userId) {
    return apiFetch("/friends/requests", { method: "POST", body: { userId } });
  },

  async accept(userId) {
    return apiFetch(`/friends/requests/${userId}/accept`, { method: "POST" });
  },

  async decline(userId) {
    return apiFetch(`/friends/requests/${userId}/decline`, { method: "POST" });
  },

  /** Thu hồi lời mời mình đã gửi. */
  async cancel(userId) {
    return apiFetch(`/friends/requests/${userId}`, { method: "DELETE" });
  },

  async unfriend(userId) {
    return apiFetch(`/friends/${userId}`, { method: "DELETE" });
  },
};
