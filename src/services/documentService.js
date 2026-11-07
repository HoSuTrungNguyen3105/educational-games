import { apiFetch } from "./api.js";

// Tài liệu giáo viên — Teacher Document Studio (collection `documents`,
// API /api/documents). Chỉ giáo viên/admin và chỉ chủ sở hữu (server kiểm
// tra ownerId, admin ngoại lệ). Mỗi tài liệu lưu NGUYÊN mã nguồn hiện tại
// theo `mode` ("html" | "json") — xem server/src/services/documentService.js.
function qs(params = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") p.set(k, v);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const documentService = {
  /** Tài liệu của tôi (DTO metadata: không kèm source, có sourceBytes). */
  async listMine(params = {}) {
    return apiFetch(`/documents/mine${qs(params)}`, { _withPagination: true });
  },
  /** Bản đầy đủ gồm mã nguồn — chỉ chủ sở hữu/admin. */
  async get(id) {
    return apiFetch(`/documents/${encodeURIComponent(id)}`);
  },
  async create(data) {
    return apiFetch("/documents", { method: "POST", body: data });
  },
  /** Cập nhật một phần: name / docType / mode / source. */
  async update(id, data) {
    return apiFetch(`/documents/${encodeURIComponent(id)}`, { method: "PUT", body: data });
  },
  async remove(id) {
    return apiFetch(`/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};
