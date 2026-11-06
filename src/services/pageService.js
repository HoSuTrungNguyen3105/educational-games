import { apiFetch } from "./api.js";

// Trang HTML tĩnh phía server (collection `pages`, bám cơ chế template):
// Mongo chỉ giữ htmlUrl — nội dung HTML nằm ở file trên storage.
// Đọc công khai theo slug; ghi (PUT) chỉ giáo viên/admin (server chặn).
export const pageService = {
  async getPage(slug) {
    return apiFetch(`/pages/${encodeURIComponent(slug)}`);
  },
  async updatePage(slug, data) {
    return apiFetch(`/pages/${encodeURIComponent(slug)}`, { method: "PUT", body: data });
  },
};
