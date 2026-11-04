import { apiFetch } from "./api.js";

// Client cho API phụ huynh (/api/parents) — đợt 3.
// Liên kết bằng mã 6 số của học sinh; báo cáo chỉ đọc được khi đã liên kết
// (backend kiểm tra bản ghi parentLinks ở từng request).
export const parentApi = {
  /** Đăng ký tài khoản phụ huynh; linkCode không bắt buộc. */
  async register(data) {
    return apiFetch("/parents/register", { method: "POST", body: data });
  },

  // ── Phía học sinh ──
  async myLinkCode() {
    return apiFetch("/parents/link-code");
  },
  async generateLinkCode() {
    return apiFetch("/parents/link-code", { method: "POST", body: {} });
  },
  async myParents() {
    return apiFetch("/parents/my-parents") || [];
  },
  async unlinkParent(parentId) {
    return apiFetch(`/parents/my-parents/${parentId}`, { method: "DELETE" });
  },

  // ── Phía phụ huynh ──
  async link(code) {
    return apiFetch("/parents/link", { method: "POST", body: { code } });
  },
  async children() {
    return apiFetch("/parents/children") || [];
  },
  async unlinkChild(studentId) {
    return apiFetch(`/parents/children/${studentId}`, { method: "DELETE" });
  },
  async report(studentId) {
    return apiFetch(`/parents/children/${studentId}/report`);
  },
  /** Đặt lại mật khẩu cho con đã liên kết (backend kiểm tra liên kết → 403 nếu chưa). */
  async resetChildPassword(studentId, password) {
    return apiFetch(`/parents/children/${studentId}/reset-password`, { method: "POST", body: { password } });
  },

  // ── Duyệt kết bạn (đợt An toàn cho bé 2) ──
  // Công tắc theo từng con (mặc định tắt) nằm ở `friendApprovalRequired`
  // trong danh sách children(). Bật thì lời mời của con bị giữ chờ duyệt.
  async setFriendApproval(studentId, enabled) {
    return apiFetch(`/parents/children/${studentId}/friend-approval`, {
      method: "PUT",
      body: { enabled },
    });
  },
  /** [{ id, direction: "outgoing"|"incoming", user, createdAt }] */
  async pendingFriendRequests(studentId) {
    return apiFetch(`/parents/children/${studentId}/friend-requests`) || [];
  },
  async approveFriendRequest(studentId, requestId) {
    return apiFetch(`/parents/children/${studentId}/friend-requests/${requestId}/approve`, { method: "POST" });
  },
  async rejectFriendRequest(studentId, requestId) {
    return apiFetch(`/parents/children/${studentId}/friend-requests/${requestId}/reject`, { method: "POST" });
  },
};
