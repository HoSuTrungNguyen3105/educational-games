import { apiFetch, hasRange, fetchRangedList } from "./api.js";

const cache = {};

function cachedGet(key, loader) {
  if (!(key in cache)) {
    cache[key] = loader().catch((e) => { delete cache[key]; throw e; });
  }
  return cache[key];
}

function clearCache(key) {
  delete cache[key];
}

// Có range { from, to } (trang quản lí) → bỏ qua cache dùng chung (cache giữ
// bản không-range cho dropdown/editor) và xin đúng khoảng từ server; server
// trả data là mảng đã cắt. Không range → hành vi cũ (cache + toàn bộ list).
async function rangedGet(path, range, key, loader) {
  if (hasRange(range)) {
    try {
      const list = await apiFetch(`${path}?from=${range.from}&to=${range.to}`);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }
  try {
    const list = await cachedGet(key, loader);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export const setupService = {
  async listTemplates(range) {
    return rangedGet("/templates", range, "templates", () => apiFetch("/templates"));
  },
  async listCategories(range) {
    return rangedGet("/categories", range, "categories", () => apiFetch("/categories"));
  },
  // Bản phân trang cho trang quản lý Categories: trả { items, total,
  // pagination } (rangedGet phía trên chỉ trả mảng đã cắt, mất tổng) và
  // nhận filters.q — server lọc trước khi cắt (xem routes/setup.js).
  async listCategoriesPaged(range, filters = {}) {
    const q = filters.q ? `?q=${encodeURIComponent(filters.q)}` : "";
    return fetchRangedList(`/categories${q}`, range);
  },
  async createCategory(data) {
    const result = await apiFetch("/categories", { method: "POST", body: data });
    clearCache("categories");
    return result;
  },
  async updateCategory(id, data) {
    const result = await apiFetch(`/categories/${id}`, { method: "PUT", body: data });
    clearCache("categories");
    return result;
  },
  async removeCategory(id) {
    await apiFetch(`/categories/${id}`, { method: "DELETE" });
    clearCache("categories");
  },
  async removeAllCategories() {
    const result = await apiFetch("/categories", { method: "DELETE" });
    clearCache("categories");
    return result;
  },
  async listSubjects(range) {
    return rangedGet("/subjects", range, "subjects", () => apiFetch("/subjects"));
  },
  // Bản phân trang cho trang quản lý Môn học — như listCategoriesPaged.
  async listSubjectsPaged(range, filters = {}) {
    const q = filters.q ? `?q=${encodeURIComponent(filters.q)}` : "";
    return fetchRangedList(`/subjects${q}`, range);
  },
  async addSubject(name) {
    const result = await apiFetch("/subjects", { method: "POST", body: { name } });
    clearCache("subjects");
    return result;
  },
  async updateSubject(oldName, newName) {
    const result = await apiFetch(`/subjects/${encodeURIComponent(oldName)}`, { method: "PUT", body: { name: newName } });
    clearCache("subjects");
    return result;
  },
  async removeSubject(name) {
    const result = await apiFetch(`/subjects/${encodeURIComponent(name)}`, { method: "DELETE" });
    clearCache("subjects");
    return result;
  },
};