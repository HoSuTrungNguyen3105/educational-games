// ĐỊA CHỈ BACKEND — sau khi deploy lên Render, thay bằng URL thật của bạn, VD:
// const API_BASE = window.API_BASE_URL || "https://edu-games-api.onrender.com/api";
export const API_BASE = window.API_BASE_URL || "https://educational-games-lp4z.onrender.com/api";
export const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const AUTH_KEY = "edu_games_auth";
export function loadAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (auth && auth.token) {
      const parts = String(auth.token).split(".");
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (payload && typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem(AUTH_KEY);
            return null;
          }
        } catch (_) { /* token không decode được */ }
      }
    }
    return auth || null;
  } catch (_) { return null; }
}
export function saveAuth(auth) { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); }
export function clearAuth() { localStorage.removeItem(AUTH_KEY); }

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
  const auth = loadAuth();
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
      if (err && err.message) message = err.message;
    } catch (_) { /* ignore */ }
    throw new Error(message);
  }
  return res.json();
}

export const gameService = {
  async list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.subject && filters.subject !== "all") params.set("subject", filters.subject);
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    const qs = params.toString();
    return apiFetch(`/games${qs ? `?${qs}` : ""}`) || [];
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
  async duplicate(id) {
    return apiFetch(`/games/${id}/duplicate`, { method: "POST" });
  },
};

export const questionService = {
  async listByGame(gameId) {
    return apiFetch(`/questions/game/${gameId}`) || [];
  },
  async save(gameId, questions) {
    return apiFetch(`/questions/game/${gameId}`, { method: "PUT", body: questions });
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
    return apiFetch(`/users/${id}`, { method: "DELETE" });
  },
};

export const statsService = {
  async get() {
    return apiFetch("/stats");
  },
};