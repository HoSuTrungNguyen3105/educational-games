// ĐỊA CHỈ BACKEND — sau khi deploy lên Render, thay bằng URL thật của bạn, VD:
// const API_BASE = window.API_BASE_URL || "https://edu-games-api.onrender.com/api";
export const API_BASE = window.API_BASE_URL || "https://educational-games-lp4z.onrender.com/api";
export const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const AUTH_KEY = "edu_games_auth";
const USER_AUTH_KEY = "edu_games_user_auth";

function parseToken(auth) {
  if (!auth || !auth.token) return null;
  const parts = String(auth.token).split(".");
  if (parts.length !== 3) return auth;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload && typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
      return null;
    }
  } catch { /* invalid token */ }
  return auth;
}

export function loadAuth() {
  try {
    // Ưu tiên teacher auth, nếu không có thì dùng user auth
    const teacherAuth = parseToken(JSON.parse(localStorage.getItem(AUTH_KEY)));
    if (teacherAuth && teacherAuth.token) return teacherAuth;
    const userAuth = parseToken(JSON.parse(localStorage.getItem(USER_AUTH_KEY)));
    if (userAuth && userAuth.token) return userAuth;
    return null;
  } catch { return null; }
}

export function loadTeacherAuth() {
  try {
    return parseToken(JSON.parse(localStorage.getItem(AUTH_KEY)));
  } catch { return null; }
}

export function loadUserAuth() {
  try {
    return parseToken(JSON.parse(localStorage.getItem(USER_AUTH_KEY)));
  } catch { return null; }
}

export function saveAuth(auth) { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); }
export function saveUserAuth(auth) { localStorage.setItem(USER_AUTH_KEY, JSON.stringify(auth)); }
export function clearAuth() { localStorage.removeItem(AUTH_KEY); }
export function clearUserAuth() { localStorage.removeItem(USER_AUTH_KEY); }

// Lặp lại khi backend đang cold-start (503 / lỗi mạng), tránh request đầu tiên chết
async function fetchWithRetry(url, init, attempts = 5) {
  let res;
  for (let i = 0; i < attempts; i++) {
    try {
      res = await fetch(url, init);
      if (res.status !== 503 || i === attempts - 1) return res;
    } catch (e) {
      if (i === attempts - 1) throw e;
    }
    await new Promise((r) => setTimeout(r, Math.min(800 * 2 ** i, 5000)));
  }
  return res;
}

export async function apiFetch(path, options = {}) {
  const auth = options._token ? { token: options._token } : loadAuth();
  const url = `${API_BASE}${path}`;
  const init = {
    headers: {
      "Content-Type": "application/json",
      ...(auth && auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  delete init._token;
  delete init._withPagination;
  const withPagination = options._withPagination;
  const res = await fetchWithRetry(url, init);
  if (res.status === 401 && !path.startsWith("/auth/")) {
    clearAuth();
    window.dispatchEvent(new Event("edu-auth-expired"));
  }
  if (res.status === 404) return null;
  if (res.status === 204) return true;
  if (!res.ok) {
    let message = `Lỗi ${res.status}`;
    try {
      const err = await res.json();
      if (err && err.msg) message = err.msg;
      else if (err && err.message) message = err.message;
    } catch { /* ignore */ }
    throw new Error(message);
  }
  const json = await res.json();
  if (json && typeof json === "object" && "data" in json) {
    if (withPagination && json.pagination) {
      return { data: json.data, pagination: json.pagination };
    }
    return json.data;
  }
  return json;
}

export const gameService = {
  async list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.subject && filters.subject !== "all") params.set("subject", filters.subject);
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    const hasPaging = filters.from || filters.to;
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    const qs = params.toString();
    if (hasPaging) {
      const res = await apiFetch(`/games${qs ? `?${qs}` : ""}`, { _withPagination: true });
      return { items: res?.data || [], pagination: res?.pagination || null };
    }
    return (await apiFetch(`/games${qs ? `?${qs}` : ""}`)) || [];
  },
  async get(id) {
    return apiFetch(`/games/${id}`);
  },
  async getByCode(code) {
    return apiFetch(`/games/code/${encodeURIComponent(code.trim())}`);
  },
  async create(data) {
    return apiFetch("/games", { method: "POST", body: data });
  },
  async update(id, data) {
    return apiFetch(`/games/${id}`, { method: "PUT", body: data });
  },
  async remove(id) {
    return apiFetch(`/games/${id}`, { method: "DELETE" });
  },
  async removeAll() {
    return apiFetch("/games", { method: "DELETE" });
  },
  async duplicate(id) {
    return apiFetch(`/games/${id}/duplicate`, { method: "POST" });
  },
  async answer(questionId, answerId) {
    return apiFetch("/games/answer", { method: "POST", body: { questionId, answerId } });
  },
};

export const questionService = {
  async listByGame(gameId) {
    return apiFetch(`/questions/game/${gameId}`) || [];
  },
  async save(gameId, questions) {
    return apiFetch(`/questions/game/${gameId}`, { method: "PUT", body: questions });
  },
  async removeAll() {
    return apiFetch("/questions", { method: "DELETE" });
  },
};

export const resultService = {
  async listByGame(gameId) {
    return apiFetch(`/results/game/${gameId}`) || [];
  },
  async submit(result) {
    return apiFetch("/results", { method: "POST", body: result });
  },
};

export const authService = {
  async login(username, password) {
    return apiFetch("/auth/login", { method: "POST", body: { username, password } });
  },
  async register({ username, email, password, name }) {
    return apiFetch("/auth/register", { method: "POST", body: { username, email, password, name } });
  },
  async me() {
    return apiFetch("/auth/me");
  },
  logout() {
    clearAuth();
    window.dispatchEvent(new Event("edu-auth-expired"));
  },
};

export const userService = {
  async list() {
    return apiFetch("/users") || [];
  },
  async create(data) {
    return apiFetch("/users", { method: "POST", body: data });
  },
  async remove(id) {
    return apiFetch(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  async getById(id) {
    return apiFetch(`/users/${encodeURIComponent(id)}`);
  },
  async search(query) {
    return apiFetch(`/users/search?q=${encodeURIComponent(query)}`) || [];
  },
  async updateProfile(data) {
    return apiFetch("/auth/me", { method: "PUT", body: data });
  },
};

export const statsService = {
  async get() {
    return apiFetch("/stats");
  },
};

export const templateService = {
  async list() {
    return apiFetch("/templates") || [];
  },
  async get(id) {
    return apiFetch(`/templates/${encodeURIComponent(id)}`);
  },
  async getBySlug(slug) {
    return apiFetch(`/templates/slug/${encodeURIComponent(slug)}`);
  },
  async create(data) {
    return apiFetch("/templates", { method: "POST", body: data });
  },
  async update(id, data) {
    return apiFetch(`/templates/${encodeURIComponent(id)}`, { method: "PUT", body: data });
  },
  async remove(id) {
    return apiFetch(`/templates/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  async removeAll() {
    return apiFetch("/templates", { method: "DELETE" });
  },
};

export const seedService = {
  async seed() {
    return apiFetch("/seed", { method: "POST" });
  },
};

export const gameProgressService = {
  async listGames() {
    return apiFetch("/users/me/games") || [];
  },
  async getGame(gameId) {
    return apiFetch(`/users/me/games/${encodeURIComponent(gameId)}`);
  },
  async upsertGame(gameId, data) {
    return apiFetch(`/users/me/games/${encodeURIComponent(gameId)}`, { method: "PUT", body: data });
  },
  async addExperience(gameId, amount) {
    return apiFetch(`/users/me/games/${encodeURIComponent(gameId)}/experience`, { method: "POST", body: { amount } });
  },
  async incrementPlay(gameId) {
    return apiFetch(`/users/me/games/${encodeURIComponent(gameId)}/play`, { method: "POST" });
  },
  async addInventoryItem(gameId, itemId, quantity = 1) {
    return apiFetch(`/users/me/games/${encodeURIComponent(gameId)}/inventory`, { method: "POST", body: { itemId, quantity } });
  },
  async removeInventoryItem(gameId, itemId, quantity = 1) {
    return apiFetch(`/users/me/games/${encodeURIComponent(gameId)}/inventory/${encodeURIComponent(itemId)}?quantity=${quantity}`, { method: "DELETE" });
  },
};

export const adminGameProgressService = {
  async listAll() {
    return apiFetch("/users/game-progress") || [];
  },
  async updateProgress(id, data) {
    return apiFetch(`/users/game-progress/${encodeURIComponent(id)}`, { method: "PUT", body: data });
  },
  async removeProgress(id) {
    return apiFetch(`/users/game-progress/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

export const coinService = {
  async get() {
    return apiFetch("/auth/me/coins");
  },
  async add(amount) {
    return apiFetch("/auth/me/coins", { method: "POST", body: { amount } });
  },
};