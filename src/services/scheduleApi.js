import { apiFetch } from "./api.js";

// Client cho API lịch học (/api/schedule) — đợt 3.
// Mỗi buổi học lặp theo tuần: weekday 1 (Thứ 2) … 7 (Chủ nhật), giờ "HH:MM".
// Backend trả kèm `className` + `canEdit` cho từng buổi.
export const scheduleApi = {
  async list() {
    return apiFetch("/schedule") || [];
  },
  async create(data) {
    return apiFetch("/schedule", { method: "POST", body: data });
  },
  async update(id, data) {
    return apiFetch(`/schedule/${id}`, { method: "PUT", body: data });
  },
  async remove(id) {
    return apiFetch(`/schedule/${id}`, { method: "DELETE" });
  },
};
