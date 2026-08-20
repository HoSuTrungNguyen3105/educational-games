import { apiFetch } from "./api.js";

const FALLBACK_PLAYER_NAMES = [
  "Học sinh 1", "Học sinh 2", "Học sinh 3", "Học sinh 4",
  "Học sinh 5", "Học sinh 6", "Học sinh 7", "Học sinh 8",
];

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
  async listPlayers() {
    try {
      const list = await cachedGet("players", () => apiFetch("/players"));
      if (Array.isArray(list) && list.length) return list.map((p) => (p && p.name ? p.name : "Học sinh"));
      return FALLBACK_PLAYER_NAMES.slice();
    } catch {
      return FALLBACK_PLAYER_NAMES.slice();
    }
  },
};