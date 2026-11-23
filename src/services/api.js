// ĐỊA CHỈ BFF (Backend for Frontend) — cùng origin với frontend
//   1. window.BFF_BASE_URL (override lúc runtime)
//   2. VITE_BFF_BASE (đặt trong .env — `npm run dev` tự trỏ về http://localhost:3001/educational-games/bff)
//   3. Mặc định: cùng origin với base path (relative path)
export const BFF_BASE =
  window.BFF_BASE_URL ||
  import.meta.env.VITE_BFF_BASE ||
  "/educational-games/bff";

// Backward compatibility: old code uses API_BASE
export const API_BASE = BFF_BASE;

export const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ── Auth State ───────────────────────────────────────────────────────────────
// Với BFF, authentication state được quản lý bởi HttpOnly cookies.
// Frontend chỉ cần biết: có đăng nhập hay không (qua /bff/auth/me).
// Không lưu access token, refresh token ở frontend.

let currentUser = null;
let authListeners = new Set();
let authCheckPromise = null;

// Backward compatibility: old code uses loadAuth/saveAuth/clearAuth
// These now delegate to the new auth system

export function loadAuth() {
  const user = getCurrentUser();
  return user ? { token: "bff-managed", user, refreshToken: "bff-managed" } : null;
}

export function saveAuth(auth) {
  if (auth?.user) setCurrentUser(auth.user);
  return auth;
}

export function clearAuth() {
  clearCurrentUser();
}

function emitAuthChange() {
  for (const cb of authListeners) {
    try { cb(currentUser); } catch { /* ignore */ }
  }
}

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(user) {
  currentUser = user;
  emitAuthChange();
}

export function clearCurrentUser() {
  currentUser = null;
  emitAuthChange();
}

export function subscribeAuth(cb) {
  authListeners.add(cb);
  return () => authListeners.delete(cb);
}

// ── Fetch Helpers ────────────────────────────────────────────────────────────

async function fetchWithRetry(url, init, attempts = 3) {
  const total = Math.max(1, Number(attempts) || 1);
  let res;
  for (let i = 0; i < total; i++) {
    try {
      res = await fetch(url, init);
      if (res.status !== 503 || i === total - 1) return res;
    } catch (e) {
      if (i === total - 1) throw e;
    }
    await new Promise((r) => setTimeout(r, Math.min(800 * 2 ** i, 5000)));
  }
  return res;
}

function buildSignal(options) {
  const external = options.signal;
  const timeoutMs = options.timeoutMs;

  if (!timeoutMs) {
    return { signal: external, timer: null };
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  if (!external) {
    return { signal: ctrl.signal, timer };
  }

  if (typeof AbortSignal.any === "function") {
    return { signal: AbortSignal.any([external, ctrl.signal]), timer };
  }
  const onAbort = () => ctrl.abort();
  if (external.aborted) ctrl.abort();
  else external.addEventListener("abort", onAbort, { once: true });
  return { signal: ctrl.signal, timer, detach: () => external.removeEventListener("abort", onAbort) };
}

// ── Core API Fetch ───────────────────────────────────────────────────────────
// Tất cả request đi qua BFF với credentials: "include" để gửi HttpOnly cookies

export async function apiFetch(path, options = {}) {
  const url = `${BFF_BASE}${path}`;
  const method = (options.method || "GET").toUpperCase();
  
  const { signal, timer, detach } = buildSignal(options);
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  // CSRF token for mutating requests
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers["x-csrf-token"] = csrfToken;
    }
  }
  
  const init = {
    method,
    headers,
    credentials: "include", // Sempre gửi cookies HttpOnly
    signal,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  
  delete init._retries;
  delete init.timeoutMs;
  
  const retries = Math.max(0, Number(options._retries ?? 2) || 0);
  let res;
  
  try {
    res = await fetchWithRetry(url, init, retries + 1);
  } finally {
    if (timer) clearTimeout(timer);
    detach?.();
  }
  
  // Handle 401 - try to refresh via BFF
  if (res.status === 401 && !path.startsWith("/auth/")) {
    if (!options._retried401) {
      const refreshed = await refreshAuth();
      if (refreshed) {
        return apiFetch(path, { ...options, _retried401: true });
      }
    }
    // Refresh failed - clear user and notify
    clearCurrentUser();
    window.dispatchEvent(new Event("edu-auth-expired"));
  }
  
  if (res.status === 204) return true;
  
  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch { /* body not JSON / empty */ }
    
    if (res.status === 404 && method === "GET") return null;
    
    const message = payload?.msg || payload?.message || `Lỗi ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = payload;
    throw err;
  }
  
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json) {
    if (options._withPagination && json.pagination) {
      return { data: json.data, pagination: json.pagination };
    }
    return json.data;
  }
  return json;
}

// ── CSRF Token Management ────────────────────────────────────────────────────

function getCsrfToken() {
  // Read from cookie (double-submit cookie pattern)
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "bff_csrf") return decodeURIComponent(value);
  }
  return null;
}

// ── Auth Functions ───────────────────────────────────────────────────────────

/**
 * Check current auth status with BFF
 */
export async function checkAuth() {
  if (authCheckPromise) return authCheckPromise;
  
  authCheckPromise = (async () => {
    try {
      const res = await apiFetch("/auth/me", { _retries: 0 });
      if (res?.user) {
        setCurrentUser(res.user);
        return res.user;
      }
    } catch (e) {
      // Not authenticated
    }
    clearCurrentUser();
    return null;
  })();
  
  try {
    return await authCheckPromise;
  } finally {
    authCheckPromise = null;
  }
}

/**
 * Login via BFF
 */
export async function login(username, password) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: { username, password },
    _retries: 0,
  });
  if (res?.user) {
    setCurrentUser(res.user);
    // Store CSRF token from response
    if (res.csrfToken) {
      // CSRF token is set via HttpOnly cookie by BFF, but we also get it in response
      // for immediate use in subsequent requests
      document.cookie = `bff_csrf=${res.csrfToken}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    }
  }
  return res;
}

/**
 * Register via BFF
 */
export async function register(data) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: data,
    _retries: 0,
  });
  if (res?.user) {
    setCurrentUser(res.user);
    if (res.csrfToken) {
      document.cookie = `bff_csrf=${res.csrfToken}; path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    }
  }
  return res;
}

/**
 * Logout via BFF
 */
export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST", _retries: 0, timeoutMs: 8000 });
  } catch { /* ignore network errors */ }
  clearCurrentUser();
  // Clear CSRF cookie
  document.cookie = "bff_csrf=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.dispatchEvent(new Event("edu-auth-expired"));
}

/**
 * Refresh auth via BFF
 */
export async function refreshAuth() {
  try {
    const res = await apiFetch("/auth/refresh", { method: "POST", _retries: 0 });
    if (res?.user) {
      setCurrentUser(res.user);
      return true;
    }
  } catch { /* ignore */ }
  clearCurrentUser();
  return false;
}

/**
 * Get user sessions via BFF
 */
export async function getSessions() {
  return apiFetch("/auth/sessions");
}

/**
 * Revoke sessions via BFF
 */
export async function revokeSessions(others = true) {
  return apiFetch(`/auth/sessions?others=${others ? "true" : "false"}`, {
    method: "DELETE",
  });
}

/**
 * Change password via BFF
 */
export async function changePassword(currentPassword, newPassword) {
  return apiFetch("/auth/change-password", {
    method: "POST",
    body: { currentPassword, newPassword },
  });
}

/**
 * Get short-lived access token for game iframes
 */
export async function getGameToken() {
  return apiFetch("/auth/game-token", { method: "POST", _retries: 0 });
}

// ── Auth Service (compat) ────────────────────────────────────────────────────

export const authService = {
  async login(username, password) {
    return login(username, password);
  },
  async register(data) {
    return register(data);
  },
  async me() {
    return checkAuth();
  },
  async changePassword(currentPassword, newPassword) {
    return changePassword(currentPassword, newPassword);
  },
  async sessions() {
    return getSessions();
  },
  async revokeSessions(others = true) {
    return revokeSessions(others);
  },
  async refresh() {
    return refreshAuth();
  },
  async logout() {
    return logout();
  },
  async getGameToken() {
    return getGameToken();
  },
};

// ── Range Pagination Helpers ─────────────────────────────────────────────────

export function hasRange(range) {
  return range != null && range.from != null && range.to != null;
}

export function normalizeRangeResult(res) {
  if (res && !Array.isArray(res) && Array.isArray(res.data)) {
    return {
      items: res.data,
      total: typeof res.pagination?.total === "number" ? res.pagination.total : res.data.length,
      pagination: res.pagination || null,
    };
  }
  const items = Array.isArray(res) ? res : [];
  return { items, total: items.length, pagination: null };
}

export async function fetchRangedList(path, range) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await apiFetch(`${path}${sep}from=${range.from}&to=${range.to}`, { _withPagination: true });
  return normalizeRangeResult(res);
}

// ── Service Exports ──────────────────────────────────────────────────────────

export const gameService = {
  async seed() { return apiFetch("/api/seed", { method: "POST" }); },
  async list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.subject && filters.subject !== "all") params.set("subject", filters.subject);
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    if (filters.type && filters.type !== "all") params.set("type", filters.type);
    if (filters.playMode && filters.playMode !== "all") params.set("playMode", filters.playMode);
    if (filters.deliveryMode && filters.deliveryMode !== "all") params.set("deliveryMode", filters.deliveryMode);
    if (filters.templateId && filters.templateId !== "all") params.set("templateId", filters.templateId);
    const hasPaging = filters.from || filters.to;
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    const qs = params.toString();
    if (hasPaging) {
      const res = await apiFetch(`/api/games${qs ? `?${qs}` : ""}`, { _withPagination: true });
      return { items: res?.data || [], pagination: res?.pagination || null };
    }
    return (await apiFetch(`/api/games${qs ? `?${qs}` : ""}`)) || [];
  },
  async get(id) { return apiFetch(`/api/games/${id}`); },
  async getByCode(code) { return apiFetch(`/api/games/code/${encodeURIComponent(code.trim())}`); },
  async create(data) { return apiFetch("/api/games", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/api/games/${id}`, { method: "PUT", body: data }); },
  async setConfig(id, config) { return apiFetch(`/api/games/${id}/config`, { method: "PUT", body: { config } }); },
  async getConfig(id) { return apiFetch(`/api/games/${id}/config`); },
  async getConfigByKey(key, gameId) {
    const qs = gameId ? `?gameId=${encodeURIComponent(gameId)}` : "";
    return apiFetch(`/api/game-configs/${encodeURIComponent(key)}${qs}`);
  },
  async remove(id) { return apiFetch(`/api/games/${id}`, { method: "DELETE" }); },
  async bulkRemove(ids) { return apiFetch("/api/games/bulk", { method: "DELETE", body: { ids } }); },
  async removeAll() { return apiFetch("/api/games", { method: "DELETE" }); },
  async duplicate(id) { return apiFetch(`/api/games/${id}/duplicate`, { method: "POST" }); },
  async publish(id) { return apiFetch(`/api/games/${id}/publish`, { method: "POST" }); },
  async listVersions(id) { return apiFetch(`/api/games/${id}/versions`) || []; },
  async getVersionSnapshot(id, version) { return apiFetch(`/api/games/${id}/versions/${version}`); },
  async restoreVersion(id, version) { return apiFetch(`/api/games/${id}/versions/${version}/restore`, { method: "POST" }); },
  async answer(questionId, answerId) { return apiFetch("/api/games/answer", { method: "POST", body: { questionId, answerId } }); },
};

export const gameConfigStore = {
  async get(key) { return apiFetch(`/api/game-configs/${encodeURIComponent(key)}`); },
  async set(key, values) { return apiFetch(`/api/game-configs/${encodeURIComponent(key)}`, { method: "PUT", body: { values } }); },
  async list() { return apiFetch("/api/game-configs") || []; },
};

export const questionService = {
  async listAll(range) { if (hasRange(range)) return fetchRangedList("/api/questions", range); return apiFetch("/api/questions") || []; },
  async listByGame(gameId, { inputMode, from, to } = {}) {
    const params = new URLSearchParams();
    if (inputMode) params.set("inputMode", inputMode);
    const qs = params.toString();
    const path = `/api/questions/game/${gameId}${qs ? `?${qs}` : ""}`;
    if (from != null && to != null) return fetchRangedList(path, { from, to });
    return apiFetch(path) || [];
  },
  async save(gameId, questions) { return apiFetch(`/api/questions/game/${gameId}`, { method: "PUT", body: questions }); },
  async updateOne(gameId, questionId, data) { return apiFetch(`/api/questions/game/${gameId}/${questionId}`, { method: "PATCH", body: data }); },
  async removeOne(gameId, questionId) { return apiFetch(`/api/questions/game/${gameId}/${questionId}`, { method: "DELETE" }); },
  async bulkRemove(items) { return apiFetch("/api/questions/bulk", { method: "DELETE", body: { items } }); },
  async removeAll() { return apiFetch("/api/questions", { method: "DELETE" }); },
};

export const questionBankService = {
  async list(params = {}) { const qs = new URLSearchParams(params).toString(); return apiFetch(`/api/question-banks${qs ? `?${qs}` : ""}`) || []; },
  async listPaged(params = {}) {
    const { from, to, ...filters } = params || {};
    const qs = new URLSearchParams(filters).toString();
    return fetchRangedList(`/api/question-banks${qs ? `?${qs}` : ""}`, { from, to });
  },
  async get(id) { return apiFetch(`/api/question-banks/${encodeURIComponent(id)}`); },
  async stats() { return apiFetch("/api/question-banks/stats"); },
  async create(data) { return apiFetch("/api/question-banks", { method: "POST", body: data }); },
  async createMany(questions, mode = "merge") { return apiFetch("/api/question-banks/bulk", { method: "POST", body: { questions, mode } }); },
  async update(id, data) { return apiFetch(`/api/question-banks/${encodeURIComponent(id)}`, { method: "PUT", body: data }); },
  async remove(id) { return apiFetch(`/api/question-banks/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async removeAll() { return apiFetch("/api/question-banks", { method: "DELETE" }); },
  async listSets(params = {}) { const qs = new URLSearchParams(params).toString(); return apiFetch(`/api/question-banks/sets${qs ? `?${qs}` : ""}`) || []; },
  async listSetsPaged(params = {}) {
    const { from, to, ...filters } = params || {};
    const qs = new URLSearchParams(filters).toString();
    return fetchRangedList(`/api/question-banks/sets${qs ? `?${qs}` : ""}`, { from, to });
  },
  async getSet(id) { return apiFetch(`/api/question-banks/sets/${encodeURIComponent(id)}`); },
  async createSet(data) { return apiFetch("/api/question-banks/sets", { method: "POST", body: data }); },
  async updateSet(id, data) { return apiFetch(`/api/question-banks/sets/${encodeURIComponent(id)}`, { method: "PUT", body: data }); },
  async removeSet(id) { return apiFetch(`/api/question-banks/sets/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async checkSetAnswer(setId, questionId, answer) { return apiFetch(`/api/question-banks/sets/${encodeURIComponent(setId)}/check`, { method: "POST", body: { questionId, answer } }); },
  async linkToGame(bankId, gameId) { return apiFetch(`/api/question-banks/${encodeURIComponent(bankId)}/link/${encodeURIComponent(gameId)}`, { method: "POST" }); },
  async bulkLink(bankIds, gameId) { return apiFetch("/api/question-banks/bulk-link", { method: "POST", body: { bankIds, gameId } }); },
  async sync(id) { return apiFetch(`/api/question-banks/${encodeURIComponent(id)}/sync`, { method: "POST" }); },
};

export const resultService = {
  async listByGame(gameId, range) { if (hasRange(range)) return fetchRangedList(`/api/results/game/${gameId}`, range); return apiFetch(`/api/results/game/${gameId}`) || []; },
  async submit(result) { return apiFetch("/api/results", { method: "POST", body: result }); },
};

export const gamePlayService = {
  async complete(payload) { return apiFetch("/api/game-plays/complete", { method: "POST", body: payload }); },
  async recordAssignment(payload) { return apiFetch("/api/game-plays/assignment", { method: "POST", body: payload }); },
  async rewardCoins(amount) { return apiFetch("/api/game-plays/reward-coins", { method: "POST", body: { amount } }); },
};

export const xpService = {
  async get() { return apiFetch("/api/auth/me/xp"); },
};

export const userService = {
  async list(range, filters = {}) {
    if (hasRange(range)) {
      const q = filters.q ? `?q=${encodeURIComponent(filters.q)}` : "";
      return fetchRangedList(`/api/users${q}`, range);
    }
    return apiFetch("/api/users") || [];
  },
  async create(data) { return apiFetch("/api/users", { method: "POST", body: data }); },
  async remove(id) { return apiFetch(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async bulkRemove(ids) { return apiFetch("/api/users/bulk", { method: "DELETE", body: { ids } }); },
  async getById(id, opts) { return apiFetch(`/api/users/${encodeURIComponent(id)}`, typeof opts === "string" ? {} : (opts || {})); },
  async search(query, opts) { return apiFetch(`/api/users/search?q=${encodeURIComponent(query)}`, typeof opts === "string" ? {} : (opts || {})) || []; },
  async searchDirectory(query, opts) { return apiFetch(`/api/users/directory?q=${encodeURIComponent(query)}`, typeof opts === "string" ? {} : (opts || {})) || []; },
  async updateProfile(data) { return apiFetch("/api/auth/me", { method: "PUT", body: data }); },
  async resetPassword(id, newPassword) { return apiFetch(`/api/users/${encodeURIComponent(id)}/reset-password`, { method: "PATCH", body: { newPassword } }); },
  async updateRole(id, role) { return apiFetch(`/api/users/${encodeURIComponent(id)}/role`, { method: "PATCH", body: { role } }); },
  async update(id, data) { return apiFetch(`/api/users/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
};

export const leaderboardService = {
  async list() { return apiFetch("/api/leaderboard") || []; },
};

export const statsService = {
  async get(days) { const q = days ? `?days=${encodeURIComponent(days)}` : ""; return apiFetch(`/api/stats${q}`); },
};

export const templateService = {
  async list(range, filters = {}) {
    if (hasRange(range)) {
      const p = new URLSearchParams();
      if (filters.q) p.set("q", filters.q);
      if (filters.status && filters.status !== "all") p.set("status", filters.status);
      if (filters.sort) p.set("sort", filters.sort);
      const qs = p.toString();
      return fetchRangedList(`/api/templates${qs ? `?${qs}` : ""}`, range);
    }
    return apiFetch("/api/templates") || [];
  },
  async get(id) { return apiFetch(`/api/templates/${encodeURIComponent(id)}`); },
  async getBySlug(slug) { return apiFetch(`/api/templates/slug/${encodeURIComponent(slug)}`); },
  async create(data) { return apiFetch("/api/templates", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/api/templates/${encodeURIComponent(id)}`, { method: "PUT", body: data }); },
  async remove(id) { return apiFetch(`/api/templates/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async bulkRemove(ids) { return apiFetch("/api/templates/bulk", { method: "DELETE", body: { ids } }); },
  async removeAll() { return apiFetch("/api/templates", { method: "DELETE" }); },
};

export const seedService = {
  async seed() { return apiFetch("/api/seed", { method: "POST" }); },
};

export const systemService = {
  async status(refresh = false) { return apiFetch(`/api/system/status${refresh ? "?refresh=1" : ""}`, { _retries: 0, timeoutMs: 25000 }); },
  async storage() { return apiFetch("/api/system/storage", { _retries: 0, timeoutMs: 25000 }); },
  async scan({ page = 1, perPage = 50, force = false } = {}) { return apiFetch("/api/system/scan", { method: "POST", body: { page, perPage, force }, _retries: 0, timeoutMs: 180000 }); },
  async getConfig() { return apiFetch("/api/system/config"); },
  async saveConfig(patch) { return apiFetch("/api/system/config", { method: "PUT", body: patch }); },
  async logs(q = {}) { const p = new URLSearchParams(); for (const [k, v] of Object.entries(q)) if (v !== "" && v != null && v !== "all") p.set(k, v); return apiFetch(`/api/system/logs?${p}`, { _withPagination: true }); },
  async publicConfig() { return apiFetch("/api/public-config"); },
};

export const gameProgressService = {
  async listGames() { return apiFetch("/api/users/me/games") || []; },
  async getGame(gameId) { return apiFetch(`/api/users/me/games/${encodeURIComponent(gameId)}`); },
  async upsertGame(gameId, data) { return apiFetch(`/api/users/me/games/${encodeURIComponent(gameId)}`, { method: "PUT", body: data }); },
  async addExperience(gameId, amount) { return apiFetch(`/api/users/me/games/${encodeURIComponent(gameId)}/experience`, { method: "POST", body: { amount } }); },
  async incrementPlay(gameId) { return apiFetch(`/api/users/me/games/${encodeURIComponent(gameId)}/play`, { method: "POST" }); },
  async addInventoryItem(gameId, itemId, quantity = 1) { return apiFetch(`/api/users/me/games/${encodeURIComponent(gameId)}/inventory`, { method: "POST", body: { itemId, quantity } }); },
  async removeInventoryItem(gameId, itemId, quantity = 1) { return apiFetch(`/api/users/me/games/${encodeURIComponent(gameId)}/inventory/${encodeURIComponent(itemId)}?quantity=${quantity}`, { method: "DELETE" }); },
};

export const adminGameProgressService = {
  async listAll(range) { if (hasRange(range)) return fetchRangedList("/api/users/game-progress", range); return apiFetch("/api/users/game-progress") || []; },
  async updateProgress(id, data) { return apiFetch(`/api/users/game-progress/${encodeURIComponent(id)}`, { method: "PUT", body: data }); },
  async updateSaveState(id, gameState) { return apiFetch(`/api/users/game-progress/${encodeURIComponent(id)}/state`, { method: "PUT", body: { gameState } }); },
  async removeProgress(id) { return apiFetch(`/api/users/game-progress/${encodeURIComponent(id)}`, { method: "DELETE" }); },
};

export const examResultService = {
  async create(data) { return apiFetch("/api/users/me/exam-results", { method: "POST", body: data }); },
  async mine() { return apiFetch("/api/users/me/exam-results") || []; },
};

export const walletService = {
  async get() { return apiFetch("/api/auth/me/wallet"); },
  async addCoins(amount) { return apiFetch("/api/auth/me/wallet", { method: "POST", body: { coins: amount } }); },
  async addStars(amount) { return apiFetch("/api/auth/me/wallet", { method: "POST", body: { stars: amount } }); },
  async exchange(direction, amount) { return apiFetch("/api/auth/me/wallet/exchange", { method: "POST", body: { direction, amount } }); },
  async claimDailyGift() { return apiFetch("/api/auth/me/wallet/daily-gift", { method: "POST" }); },
  async redeem(achievementId) { return apiFetch("/api/auth/me/wallet/redeem", { method: "POST", body: { achievementId } }); },
};

export const ticketService = {
  async get() { return apiFetch("/api/auth/me/tickets"); },
  async add(amount) { return apiFetch("/api/auth/me/tickets", { method: "POST", body: { amount } }); },
  async use(ticketId) { return apiFetch(`/api/auth/me/tickets/${encodeURIComponent(ticketId)}/use`, { method: "POST" }); },
};

export const imageService = {
  async upload(file, folder = "edu-game") {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch(`${BFF_BASE}/api/images/upload`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json.status) throw new Error(json.msg || "Lỗi upload");
    return json.data;
  },
  async uploadMultiple(files, folder = "edu-game") {
    const form = new FormData();
    files.forEach(f => form.append("files", f));
    form.append("folder", folder);
    const res = await fetch(`${BFF_BASE}/api/images/upload-multiple`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json.status) throw new Error(json.msg || "Lỗi upload");
    return json.data;
  },
  async list({ folder, from, to } = {}) {
    const params = new URLSearchParams();
    if (folder) params.set("folder", folder);
    if (from != null && to != null) {
      params.set("from", from);
      params.set("to", to);
      const res = await apiFetch(`/api/images?${params.toString()}`, { _withPagination: true });
      const { items, total, pagination } = normalizeRangeResult(res);
      return { images: items, total, pagination };
    }
    const qs = params.toString();
    return apiFetch(`/api/images${qs ? `?${qs}` : ""}`);
  },
  async search(q) { return apiFetch(`/api/images/search?q=${encodeURIComponent(q)}`); },
  async remove(publicId) { return apiFetch(`/api/images/${encodeURIComponent(publicId)}`, { method: "DELETE" }); },
  async removeMany(publicIds) { return apiFetch("/api/images", { method: "DELETE", body: { publicIds } }); },
  async claimUnowned(folder = "edu-game") { return apiFetch("/api/images/claim-unowned", { method: "POST", body: { folder } }); },
};

export const gameEventService = {
  async send(eventData) { return apiFetch("/api/game-events", { method: "POST", body: eventData }); },
};

export const dailyTaskService = {
  async list() { return apiFetch("/api/daily-tasks") || []; },
};

export const notificationService = {
  async list(unreadOnly = false) { return apiFetch(`/api/notifications${unreadOnly ? "?unread=true" : ""}`) || []; },
  async unreadCount() { return apiFetch("/api/notifications/unread-count"); },
  async markRead(id) { return apiFetch(`/api/notifications/${id}/read`, { method: "POST" }); },
  async markAllRead() { return apiFetch("/api/notifications/read-all", { method: "POST" }); },
  async registerDevice(token, deviceType = "WEB") { return apiFetch("/api/notifications/device-token", { method: "POST", body: { token, deviceType } }); },
  async removeDevice(token) { return apiFetch("/api/notifications/device-token", { method: "DELETE", body: { token } }); },
  async testPush() { return apiFetch("/api/notifications/test-push", { method: "POST" }); },
  async deleteAll() { return apiFetch("/api/notifications/all", { method: "DELETE" }); },
  async resetDevices() { return apiFetch("/api/notifications/devices/reset", { method: "DELETE" }); },
};

export const classService = {
  async list(range, filters = {}) {
    if (hasRange(range)) {
      const q = filters.q ? `?q=${encodeURIComponent(filters.q)}` : "";
      return fetchRangedList(`/api/classes${q}`, range);
    }
    return apiFetch("/api/classes") || [];
  },
  async get(id) { return apiFetch(`/api/classes/${id}`); },
  async create(data) { return apiFetch("/api/classes", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/api/classes/${id}`, { method: "PUT", body: data }); },
  async delete_(id) { return apiFetch(`/api/classes/${id}`, { method: "DELETE" }); },
  async join(code) { return apiFetch("/api/classes/join", { method: "POST", body: { code } }); },
  async getStudents(id, range) { if (hasRange(range)) return fetchRangedList(`/api/classes/${id}/students`, range); return apiFetch(`/api/classes/${id}/students`) || []; },
  async removeStudent(classId, studentId) { return apiFetch(`/api/classes/${classId}/students/${studentId}`, { method: "DELETE" }); },
};

export const heatmapService = {
  async getClassHeatmap(classId) { return apiFetch(`/api/heatmap/class/${classId}`); },
};

export const remediationService = {
  async preview(classId, topic) { return apiFetch(`/api/remediation/preview?classId=${encodeURIComponent(classId)}&topic=${encodeURIComponent(topic)}`); },
  async createPack({ classId, topic, studentIds }) { return apiFetch("/api/remediation/packs", { method: "POST", body: { classId, topic, studentIds } }); },
};

export const eventService = {
  async listAdmin(range) { if (hasRange(range)) return fetchRangedList("/api/events/admin", range); return apiFetch("/api/events/admin") || []; },
  async topics() { return apiFetch("/api/events/admin/topics") || []; },
  async create(data) { return apiFetch("/api/events/admin", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/api/events/admin/${id}`, { method: "PUT", body: data }); },
  async setEnabled(id, enabled) { return apiFetch(`/api/events/admin/${id}/enabled`, { method: "PATCH", body: { enabled } }); },
  async remove(id) { return apiFetch(`/api/events/admin/${id}`, { method: "DELETE" }); },
  async leaderboard(id) { return apiFetch(`/api/events/admin/${id}/leaderboard`); },
  async finalize(id) { return apiFetch(`/api/events/admin/${id}/finalize`, { method: "POST", body: {} }); },
  async active() { return apiFetch("/api/events/active") || []; },
  async detail(id) { return apiFetch(`/api/events/${id}`); },
};

export const assignmentService = {
  async list(classId, range) { const path = classId ? `/api/assignments?classId=${classId}` : "/api/assignments"; if (hasRange(range)) return fetchRangedList(path, range); return apiFetch(path) || []; },
  async get(id) { return apiFetch(`/api/assignments/${id}`); },
  async create(data) { return apiFetch("/api/assignments", { method: "POST", body: data }); },
  async join(code) { return apiFetch("/api/assignments/join", { method: "POST", body: { code } }); },
  async resolve(codeOrId) { return apiFetch(`/api/assignments/resolve/${encodeURIComponent(codeOrId)}`); },
  async start(id, { guestName } = {}) { return apiFetch(`/api/assignments/${id}/start`, { method: "POST", body: { guestName } }); },
  async getMySubmission(id, { guestName } = {}) { const qs = guestName ? `?guestName=${encodeURIComponent(guestName)}` : ""; return apiFetch(`/api/assignments/${id}/my-submission${qs}`); },
  async submit(id, submissionId, answers, { guestName } = {}) { return apiFetch(`/api/assignments/${id}/submit`, { method: "POST", body: { submissionId, answers, guestName } }); },
  async getResult(id, { guestName, showCorrectAnswer } = {}) { const params = new URLSearchParams(); if (guestName) params.set("guestName", guestName); if (showCorrectAnswer) { params.set("final", "true"); params.set("correctShow", "true"); } const qs = params.toString() ? `?${params.toString()}` : ""; return apiFetch(`/api/assignments/${id}/result${qs}`); },
  async getStats(id) { return apiFetch(`/api/assignments/${id}/stats`); },
  async getSubmissions(id, range) { if (hasRange(range)) return fetchRangedList(`/api/assignments/${id}/submissions`, range); return apiFetch(`/api/assignments/${id}/submissions`) || []; },
  async getMyCompleted() { return apiFetch("/api/assignments/my-completed") || []; },
  async close(id) { return apiFetch(`/api/assignments/${id}/close`, { method: "PUT" }); },
  async update(id, data) { return apiFetch(`/api/assignments/${id}`, { method: "PUT", body: data }); },
  async delete_(id) { return apiFetch(`/api/assignments/${id}`, { method: "DELETE" }); },
  async bulkRemove(ids) { return apiFetch("/api/assignments/bulk", { method: "DELETE", body: { ids } }); },
};

export const gardenService = {
  async get() { return apiFetch("/api/garden"); },
  async getPlantTypes() { return apiFetch("/api/plant-types"); },
  async plant(slotIndex, plantType) { return apiFetch("/api/garden/plant", { method: "POST", body: { slotIndex, plantType } }); },
  async harvest(slotIndex) { return apiFetch("/api/garden/harvest", { method: "POST", body: { slotIndex } }); },
  async water(slotIndex) { return apiFetch("/api/garden/water", { method: "POST", body: { slotIndex } }); },
  async remove(slotIndex) { return apiFetch("/api/garden/remove", { method: "POST", body: { slotIndex } }); },
  async getInventory() { return apiFetch("/api/garden/inventory"); },
  async buyItem(itemId) { return apiFetch("/api/garden/buy-item", { method: "POST", body: { itemId } }); },
  async useItem(itemId) { return apiFetch("/api/garden/use-item", { method: "POST", body: { itemId } }); },
  async getWater() { return apiFetch("/api/garden/water"); },
  async syncWater(waterDrops) { return apiFetch("/api/garden/water/sync", { method: "POST", body: { waterDrops } }); },
};

export const reminderService = {
  async list(params) {
    if (hasRange(params)) {
      const qs = new URLSearchParams();
      if (params.triggered != null) qs.set("triggered", String(params.triggered));
      if (params.q) qs.set("q", params.q);
      const s = qs.toString();
      return fetchRangedList(`/api/reminders${s ? `?${s}` : ""}`, params);
    }
    return apiFetch("/api/reminders") || [];
  },
  async getDue() { return apiFetch("/api/reminders/due") || []; },
  async getUpcoming(minutes) { return apiFetch(`/api/reminders/upcoming?minutes=${minutes || 60}`) || []; },
};

export const supportService = {
  async create(data) { return apiFetch("/api/support/tickets", { method: "POST", body: data }); },
  async mine() { return apiFetch("/api/support/tickets/mine") || []; },
  async assigned(range) {
    if (hasRange(range)) return fetchRangedList("/api/support/tickets/assigned", range);
    return apiFetch("/api/support/tickets/assigned") || [];
  },
  async updateAssigned(id, data) { return apiFetch(`/api/support/tickets/assigned/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
  async list(range) {
    if (hasRange(range)) return fetchRangedList("/api/support/admin/tickets", range);
    return apiFetch("/api/support/admin/tickets") || [];
  },
  async update(id, data) { return apiFetch(`/api/support/admin/tickets/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
  async remove(id) { return apiFetch(`/api/support/admin/tickets/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async bulkRemoveTickets(ids) { return apiFetch("/api/support/admin/tickets/bulk", { method: "DELETE", body: { ids } }); },
  async createReport(data) { return apiFetch("/api/support/reports", { method: "POST", body: data }); },
  async listReports(range) {
    if (hasRange(range)) return fetchRangedList("/api/support/admin/reports", range);
    return apiFetch("/api/support/admin/reports") || [];
  },
  async updateReport(id, data) { return apiFetch(`/api/support/admin/reports/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
};

export const permissionService = {
  async catalog(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/permissions/catalog${qs ? `?${qs}` : ""}`, { _withPagination: true });
  },
  async catalogAll() {
    const res = await this.catalog({ from: 1, to: 1000 });
    return res?.data || [];
  },
  async listRolePermissions(roleRef, params = {}) {
    const qs = new URLSearchParams({ role_id: roleRef, per_page: 500, ...params }).toString();
    const res = await apiFetch(`/api/rolePermissions?${qs}`, { _withPagination: true });
    return res?.data || [];
  },
  async grantRolePermissions(roleRef, permissionIds) {
    return apiFetch("/api/rolePermissions", { method: "POST", body: { role_id: roleRef, permission_ids: permissionIds } });
  },
  async syncRolePermissions(roleRef, permissionIds) {
    return apiFetch(`/api/rolePermissions/${encodeURIComponent(roleRef)}`, { method: "PUT", body: { permission_ids: permissionIds } });
  },
  async revokeRolePermissions(roleRef, permissionIds) {
    return apiFetch("/api/rolePermissions", { method: "DELETE", body: { role_id: roleRef, permission_ids: permissionIds } });
  },
  async listRoles(range) {
    if (hasRange(range)) {
      const { items } = await fetchRangedList("/api/permissions/roles", range);
      return items;
    }
    return apiFetch("/api/permissions/roles") || [];
  },
  async getRole(key) { return apiFetch(`/api/permissions/roles/${encodeURIComponent(key)}`); },
  async rolesPaged(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/roles${qs ? `?${qs}` : ""}`, { _withPagination: true });
  },
  async permissionsPaged(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/permissions/catalog${qs ? `?${qs}` : ""}`, { _withPagination: true });
  },
  async createAllPermissions() {
    return apiFetch("/api/permissions/all", { method: "POST" });
  },
};