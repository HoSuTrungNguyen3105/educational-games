import { apiFetch } from "./api.js";

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

export const setupService = {
  async listTemplates() {
    try {
      const list = await cachedGet("templates", () => apiFetch("/templates"));
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },
  async listCategories() {
    try {
      const list = await cachedGet("categories", () => apiFetch("/categories"));
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
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
  async listSubjects() {
    try {
      const list = await cachedGet("subjects", () => apiFetch("/subjects"));
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
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