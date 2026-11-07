import { apiFetch } from "./api.js";

// Bài học EduPlay AI Studio (collection `lessons`, API /api/lessons — đợt 1).
// Hai bề mặt tách bạch phía server:
//   • Giáo viên (teacher/admin): CRUD + publish, chỉ chủ sở hữu; bản chi
//     tiết GỒM correctAnswer để soạn/sửa.
//   • Học sinh: chỉ bài đã published, DTO đã lọc sạch correctAnswer.
// Lỗi publish 400 mang danh sách lỗi cụ thể trong body:
//   err.data.data.errors = [{ pageId, pageIndex, elementId, elementIndex,
//   field, message }] — StudioEditor dùng để nhảy tới đúng phần tử lỗi.
function qs(params = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, v);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const lessonService = {
  /** Bài của tôi (DTO metadata: pageCount/elementCount, không kèm pages). */
  async listMine(params = {}) {
    return apiFetch(`/lessons/mine${qs(params)}`, { _withPagination: true });
  },
  /** Bản đầy đủ cho chủ sở hữu — GỒM correctAnswer. */
  async get(id) {
    return apiFetch(`/lessons/${encodeURIComponent(id)}`);
  },
  async create(data) {
    return apiFetch("/lessons", { method: "POST", body: data });
  },
  async update(id, data) {
    return apiFetch(`/lessons/${encodeURIComponent(id)}`, { method: "PUT", body: data });
  },
  async remove(id) {
    return apiFetch(`/lessons/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  async publish(id) {
    return apiFetch(`/lessons/${encodeURIComponent(id)}/publish`, { method: "POST" });
  },
  async unpublish(id) {
    return apiFetch(`/lessons/${encodeURIComponent(id)}/unpublish`, { method: "POST" });
  },
  /** Danh sách bài đã xuất bản (phía học sinh). */
  async listPublished(params = {}) {
    return apiFetch(`/lessons/published${qs(params)}`, { _withPagination: true });
  },
  /** Chi tiết bài đã xuất bản — DTO đã lọc correctAnswer (404 → null). */
  async getPublished(id) {
    return apiFetch(`/lessons/published/${encodeURIComponent(id)}`);
  },
  // ── Đợt 3: tiến độ + chấm bài phía server (phía học sinh) ────────────
  /** Tiến độ của chính học sinh cho một bài (khôi phục khi tải lại trang). */
  async getProgress(id) {
    return apiFetch(`/lessons/published/${encodeURIComponent(id)}/progress`);
  },
  /** Toàn bộ tiến độ của học sinh (gắn badge trạng thái ở danh sách bài). */
  async listMyProgress() {
    return apiFetch("/lessons/progress/mine");
  },
  /**
   * Chấm MỘT câu trả lời phía server. Trả { correct, points, feedback,
   * explanation?, progress } — explanation chỉ có khi trả lời đúng.
   */
  async checkAnswer(id, elementId, answer) {
    return apiFetch(`/lessons/published/${encodeURIComponent(id)}/check`, {
      method: "POST", body: { elementId, answer },
    });
  },
  /** Ghi nhận hoàn thành bài không có câu hỏi (gọi khi mở tới trang cuối). */
  async complete(id) {
    return apiFetch(`/lessons/published/${encodeURIComponent(id)}/complete`, { method: "POST" });
  },
};

/** Trích danh sách lỗi publish cụ thể từ error của apiFetch (nếu có). */
export function publishErrorsOf(err) {
  const errors = err?.data?.data?.errors;
  return Array.isArray(errors) ? errors : null;
}
