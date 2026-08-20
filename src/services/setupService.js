import { apiFetch } from "./api.js";

const cache = {};

function cachedGet(key, loader) {
  if (!(key in cache)) {
    cache[key] = loader().catch((e) => { delete cache[key]; throw e; });
  }
  return cache[key];
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
  async listSubjects() {
    try {
      const list = await cachedGet("subjects", () => apiFetch("/subjects"));
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },
};