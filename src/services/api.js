// ĐỊA CHỈ BACKEND — thứ tự ưu tiên:
//   1. window.API_BASE_URL (override lúc runtime)
//   2. VITE_API_BASE (đặt trong .env — `npm run dev` tự trỏ về http://localhost:5000/api)
//   3. API đã deploy trên Render (mặc định khi build/production)
export const API_BASE =
  window.API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  "https://educational-games-lp4z.onrender.com/api";
export const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ── Token ──────────────────────────────────────────────────────────────────
// Access token sống trong bộ nhớ (src/lib/authToken.js); refresh token có hai
// đường — cookie HttpOnly (desktop/Android) và bản localStorage gửi qua
// header `x-refresh-token` (iOS, nơi WebKit chặn cookie bên thứ ba). Chi tiết
// ở authToken.js. loadAuth/saveAuth/clearAuth giữ nguyên tên và hành vi cũ vì
// hơn chục module (offlineGameSync, coinWallet, game iframe…) đang import
// chúng — xem ghi chú tương thích ở đầu authToken.js.
import {
  getAuth, setAuth, clearAuth as clearTokenAuth, getToken, isExpired,
  isUsable, refreshOnce, subscribeAuth, getRefreshToken, setRefreshToken,
} from "../lib/authToken.js";

/** Header mang refresh token bản localStorage; rỗng khi không có (phiên cũ / desktop dùng cookie). */
function refreshTokenHeaders() {
  const raw = getRefreshToken();
  return raw ? { "x-refresh-token": raw } : {};
}

/** Bản ghi đăng nhập; `null` khi chưa đăng nhập HOẶC token đã hết hạn (như cũ). */
export function loadAuth() {
  const auth = getAuth();
  if (!auth?.token) return null;
  return isExpired(auth.token) ? null : auth;
}

export function saveAuth(auth) { return setAuth(auth); }
export function clearAuth() { stopSessionRefreshLoop(); clearTokenAuth(); }

/**
 * Một lần POST tới endpoint refresh. Không bao giờ ném lỗi: mất mạng / hết số
 * lần thử lại thì trả `{ status: 0, json: null }` (0 = không có response).
 */
async function postRefreshEndpoint(path) {
  try {
    const res = await fetchWithRetry(
      `${API_BASE}${path}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...refreshTokenHeaders() },
        body: "{}",
        // Cookie đi kèm khi fetch bật credentials (đường chính desktop/Android);
        // header x-refresh-token (nếu có) chạy SONG SONG cho iOS — server ưu
        // tiên header, không có header thì dùng cookie như cũ.
        credentials: "include",
      },
      // Cold start (503) thì chờ; 401 nghĩa là token bị thu hồi → retry cũng vô ích.
      2
    );
    let json = null;
    try { json = await res.json(); } catch { /* body rỗng / không phải JSON */ }
    return { status: res.status, json };
  } catch {
    return { status: 0, json: null };
  }
}

/** HTTP status của response CUỐI CÙNG trong chuỗi refresh gần nhất; 0 = không có response (mất mạng). */
let lastRefreshStatus = 0;

/**
 * Chuỗi refresh THỐNG NHẤT cho mọi đường (chủ động ensureFreshAccessToken,
 * reactive 401 trong apiFetch, vòng lặp 20 giây): thử endpoint v1 trước; v1
 * từ chối dứt khoát (401/403) thì fallback ĐÚNG MỘT LẦN sang endpoint cũ
 * /auth/refresh — tất cả nằm trong cùng một lượt single-flight.
 *
 * Vì sao cần fallback: các phiên đăng nhập TRƯỚC khi có endpoint v1 giữ
 * cookie refresh ở `Path=/api/auth`; trình duyệt chỉ gửi cookie đó tới
 * /api/auth/* nên /api/v1/user/refresh không nhận được cookie và trả 401
 * "Không có refresh token" dù phiên vẫn còn sống. Endpoint cũ khớp path
 * cookie cũ, và refresh thành công ở đó được server set lại cookie với
 * `Path=/api` ⇒ từ lần sau v1 chạy thẳng. Đây chỉ là bước chuyển đổi —
 * gỡ fallback được khi mọi phiên cũ đã hết hạn tự nhiên.
 */
async function refreshSession() {
  let r = await postRefreshEndpoint("/v1/user/refresh");
  if (r.status === 401 || r.status === 403) {
    r = await postRefreshEndpoint("/auth/refresh");
  }
  lastRefreshStatus = r.status;
  return r.json;
}

/**
 * Đổi access token mới nhờ cookie refresh. Chỉ MỘT request chạy tại một thời điểm
 * (single-flight trong authToken) và không bao giờ lặp lại vô hạn: thất bại là
 * trả `null`, caller tự quyết (thử lại 1 lần rồi coi như phiên đã kết thúc).
 */
export async function refreshAccessToken() {
  try {
    return await refreshOnce(refreshSession);
  } catch {
    return null; // mất mạng / backend chết — không ném để không phá luồng gọi
  }
}

/**
 * §4: chủ động refresh khi access token còn dưới 2 phút, thay vì chờ 401.
 * Không có token (chưa đăng nhập) → không làm gì, không gọi API vô ích.
 */
export async function ensureFreshAccessToken() {
  const token = getToken();
  if (!token) return null;
  if (isUsable(token)) return token;
  return (await refreshAccessToken()) || token;
}

// ── Refresh chủ động mỗi 20 giây qua endpoint v1 ───────────────────────────
// Yêu cầu của Nguyên (mẫu theo hệ thống trong ảnh chụp): khi đã đăng nhập,
// cứ 20 giây gọi POST /api/v1/user/refresh một lần để lấy access token mới —
// BÊN CẠNH cơ chế ensureFreshAccessToken ở trên, không thay thế nó.
//
// ĐÁNH ĐỔI (Nguyên đã chốt, ghi lại để khỏi bàn lại): mỗi người dùng đang mở
// app phát sinh ~3 request/phút kể cả khi không thao tác gì, và mỗi lần
// refresh đều xoay vòng refresh token (ghi 1 dòng refresh_tokens mới + set
// cookie mới) ⇒ tải server và ghi DB tăng tuyến tính theo số người online.
// Đổi lại access token trên máy người dùng luôn tươi.
//
// An toàn: vẫn qua single-flight `refreshOnce` của authToken nên interval
// không bao giờ chạy song song với một refresh khác trong cùng tab; token
// mới được refreshOnce tự ghi vào authToken (đọc từ field `Authorization` ở
// gốc JSON — đúng shape của endpoint v1). Tick dùng CHUNG refreshAccessToken()
// nên cũng được hưởng fallback /auth/refresh cho phiên cũ — xem refreshSession().
const SESSION_REFRESH_INTERVAL_MS = 20_000;
let sessionRefreshTimer = null;

async function sessionRefreshTick() {
  if (!getToken()) { stopSessionRefreshLoop(); return; }
  lastRefreshStatus = 0;
  const token = await refreshAccessToken();
  if (token) return;
  // Chỉ dọn phiên khi chuỗi refresh bị từ chối DỨT KHOÁT ở response cuối
  // (401 = cookie thiếu/hết hạn/bị thu hồi; 403 = origin không được phép) —
  // tức cả v1 lẫn fallback /auth/refresh đều đã từ chối. Cú 401 đầu tiên của
  // v1 với phiên cũ (cookie Path=/api/auth) KHÔNG tới được đây vì fallback
  // đã cứu và set lại cookie Path=/api. Mất mạng / 503 / 5xx thì KHÔNG đăng
  // xuất — giữ phiên và thử lại ở chu kỳ 20 giây sau, tránh đá người dùng
  // oan khi mạng chập chờn.
  if (lastRefreshStatus === 401 || lastRefreshStatus === 403) {
    stopSessionRefreshLoop();
    clearAuth();
    window.dispatchEvent(new Event("edu-auth-expired"));
  }
}

export function startSessionRefreshLoop() {
  if (sessionRefreshTimer !== null || typeof window === "undefined") return;
  sessionRefreshTimer = window.setInterval(() => {
    sessionRefreshTick().catch(() => {});
  }, SESSION_REFRESH_INTERVAL_MS);
}

export function stopSessionRefreshLoop() {
  if (sessionRefreshTimer === null || typeof window === "undefined") return;
  window.clearInterval(sessionRefreshTimer);
  sessionRefreshTimer = null;
}

// Vòng đời interval đi theo phiên: có token → chạy, mất token → dừng.
// subscribeAuth bắt được đăng nhập/đăng ký (setAuth), refresh thành công
// (refreshOnce tự setAuth) và đăng xuất/dọn phiên (clearAuth). Trường hợp
// tải lại trang — token khôi phục lặng lẽ từ bộ đệm localStorage, không qua
// setAuth — thì apiFetch tự bật lại interval ở lần gọi API đầu tiên.
subscribeAuth((auth) => {
  if (auth?.token) startSessionRefreshLoop();
  else stopSessionRefreshLoop();
});

// Lặp lại khi backend đang cold-start (503 / lỗi mạng), tránh request đầu tiên chết.
// `attempts` là TỔNG số lần thử (kể cả lần đầu) và luôn ≥ 1 — nếu để 0, vòng lặp
// không chạy lần nào và hàm trả `undefined`, khiến caller báo nhầm "không kết nối được".
async function fetchWithRetry(url, init, attempts = 5) {
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

/**
 * `signal` + `timeoutMs` + `_retries` là tuỳ chọn, mặc định giữ nguyên hành vi cũ.
 * - `_retries: 0`  : tắt retry (dùng cho gọi AI — 503 nghĩa là AI Service chưa sẵn sàng,
 *                    retry lại chỉ làm user chờ thêm mà không giúp ích).
 * - `timeoutMs`     : tự hủy sau N ms.
 * - `signal`        : cho phép huỷ từ bên ngoài (nút "Huỷ", đóng panel…).
 */
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

  // Gộp tín hiệu huỷ. `AbortSignal.any` chưa có ở trình duyệt cũ → tự nối tay.
  if (typeof AbortSignal.any === "function") {
    return { signal: AbortSignal.any([external, ctrl.signal]), timer };
  }
  const onAbort = () => ctrl.abort();
  if (external.aborted) ctrl.abort();
  else external.addEventListener("abort", onAbort, { once: true });
  return { signal: ctrl.signal, timer, detach: () => external.removeEventListener("abort", onAbort) };
}

export async function apiFetch(path, options = {}) {
  // Token sắp hết hạn → đổi trước khi gửi, để request không chết giữa chừng.
  if (!options._token && !path.startsWith("/auth/refresh")) await ensureFreshAccessToken();

  let auth;
  if (options._token) {
    auth = { token: options._token };
  } else {
    auth = loadAuth();
  }
  // Phiên còn sống mà interval refresh 20 giây chưa chạy (vd vừa tải lại
  // trang, token lấy từ bộ đệm nên subscribeAuth chưa bắt được) → bật lại.
  if (auth?.token) startSessionRefreshLoop();
  const url = `${API_BASE}${path}`;
  const method = (options.method || "GET").toUpperCase();
  const { signal, timer, detach } = buildSignal(options);
  // Headers hợp nhất TÁCH RIÊNG: `...options` ở dưới sẽ ghi đè key `headers`
  // bằng object thô của caller — caller truyền headers riêng (vd
  // `x-refresh-token` ở logout/sessions) mà không khôi phục dòng này thì
  // Content-Type + Authorization bị mất. Trước bản này không caller nào
  // truyền headers nên lỗi không lộ; giữ nguyên cho mọi caller cũ.
  const mergedHeaders = {
    "Content-Type": "application/json",
    ...(auth && auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    ...(options.headers || {}),
  };
  const init = {
    headers: mergedHeaders,
    // Chỉ các endpoint thực sự dùng cookie HttpOnly (refresh, logout, login, register)
    // mới cần bật credentials: "include". Các API nghiệp vụ (/auth/me, /auth/me/wallet...)
    // xác thực bằng header Authorization (Bearer token) nên để "omit" để tránh bị chặn CORS credentials vô lý.
    credentials: (path === "/auth/refresh" || path === "/auth/logout" || path === "/auth/login" || path === "/auth/register") ? "include" : "omit",
    ...options,
    signal,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };
  delete init._token;
  delete init._withPagination;
  delete init._retries;
  delete init._retried401;
  delete init.timeoutMs;
  init.headers = mergedHeaders; // khôi phục sau `...options` (xem ghi chú ở trên)
  const withPagination = options._withPagination;
  // `_retries` = SỐ LẦN THỬ LẠI (không tính lần đầu). Mặc định 4 → tổng 5 lần,
  // giữ đúng hành vi cũ. `_retries: 0` → thử đúng 1 lần rồi trả về.
  const retries = Math.max(0, Number(options._retries ?? 4) || 0);
  let res;
  try {
    res = await fetchWithRetry(url, init, retries + 1);
  } finally {
    if (timer) clearTimeout(timer);
    detach?.();
  }
  if (res.status === 401 && !path.startsWith("/auth/")) {
    // 401 thường là access token vừa kịp hết hạn: đổi một lần, thử lại đúng một lần.
    // `_retried401` chắn vòng lặp refresh ⇄ 401 vô hạn (§4, §8).
    if (!options._retried401) {
      const fresh = await refreshAccessToken();
      if (fresh) return apiFetch(path, { ...options, _token: fresh, _retried401: true });
    }
    clearAuth();
    window.dispatchEvent(new Event("edu-auth-expired"));
  }
  if (res.status === 204) return true;
  if (!res.ok) {
    // Try to read the JSON error body first — this is where { status:false, msg } lives.
    let payload = null;
    try {
      payload = await res.json();
    } catch { /* body not JSON / empty */ }

    // Keep the old "404 on a GET means not found -> null" convenience
    // (e.g. games/code/:code lookups), but ONLY for GET requests.
    // For POST/PUT/PATCH/DELETE (e.g. classes/join), a 404 is a real
    // error and must surface its msg instead of silently returning null.
    if (res.status === 404 && method === "GET") return null;

    const message = payload?.msg || payload?.message || `Lỗi ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = payload;
    throw err;
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

/**
 * Phân trang from/to dùng chung cho các API DANH SÁCH ở khu quản trị
 * (xem src/lib/rangePagination.js): caller truyền { from, to } thì service
 * gửi đúng hai tham số đó + đọc envelope của server, chuẩn hoá kết quả về
 * { items, total, pagination }. KHÔNG truyền range → giữ nguyên hành vi cũ
 * (trả mảng data) để các caller phía học sinh/dropdown không đổi.
 */
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

/** Gọi list có range: path đã gồm query lọc (nếu có), hàm tự nối from/to. */
export async function fetchRangedList(path, range) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await apiFetch(`${path}${sep}from=${range.from}&to=${range.to}`, { _withPagination: true });
  return normalizeRangeResult(res);
}

export const gameService = {
  /**
   * Nạp dữ liệu mẫu (templates / games / câu hỏi / môn học) từ server/data/*.json.
   * POST /api/seed — idempotent: bỏ qua bản ghi đã tồn tại nên chạy lại không tạo trùng.
   * Cần role admin hoặc teacher (xem server/src/routes/seed.js).
   */
  async seed() { return apiFetch("/seed", { method: "POST" }); },

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
  async setConfig(id, config) {
    return apiFetch(`/games/${id}/config`, { method: "PUT", body: { config } });
  },
  // Bước 2: /api/games chỉ trả key — gọi endpoint này để lấy values
  async getConfig(id) {
    return apiFetch(`/games/${id}/config`);
  },
  // Lấy cấu hình theo key (kèm gameId để đúng dữ liệu của game đang mở)
  async getConfigByKey(key, gameId) {
    const qs = gameId ? `?gameId=${encodeURIComponent(gameId)}` : "";
    return apiFetch(`/game-configs/${encodeURIComponent(key)}${qs}`);
  },
  async remove(id) {
    return apiFetch(`/games/${id}`, { method: "DELETE" });
  },
  // Xóa hàng loạt theo danh sách id (tối đa 200/lần) → { deleted, failed, counts }
  async bulkRemove(ids) {
    return apiFetch("/games/bulk", { method: "DELETE", body: { ids } });
  },
  async removeAll() {
    return apiFetch("/games", { method: "DELETE" });
  },
  async duplicate(id) {
    return apiFetch(`/games/${id}/duplicate`, { method: "POST" });
  },
  // Quản lý phiên bản (refactor_game.md GĐ2) — server/src/routes/games.js
  async publish(id) {
    return apiFetch(`/games/${id}/publish`, { method: "POST" });
  },
  async listVersions(id) {
    return apiFetch(`/games/${id}/versions`) || [];
  },
  async getVersionSnapshot(id, version) {
    return apiFetch(`/games/${id}/versions/${version}`);
  },
  async restoreVersion(id, version) {
    return apiFetch(`/games/${id}/versions/${version}/restore`, { method: "POST" });
  },
  async answer(questionId, answerId) {
    return apiFetch("/games/answer", { method: "POST", body: { questionId, answerId } });
  },
};

/**
 * Kho cấu hình JSON theo key (collection `game_configs`).
 *
 * Khác gameService.setConfig (ghi vào document của game trong `games`): kho này
 * dùng cho game OFFLINE — Vườn Thủ Hộ, Săn Trái Cây… — những game chỉ tồn tại
 * trong manifest của client, không có dòng nào trong `games` để gắn config vào.
 * Đọc (GET) thì public, ghi (PUT) cần teacher/admin.
 */
export const gameConfigStore = {
  /** `{ key, config: { key, values, updatedAt } | null }` */
  async get(key) {
    return apiFetch(`/game-configs/${encodeURIComponent(key)}`);
  },
  async set(key, values) {
    return apiFetch(`/game-configs/${encodeURIComponent(key)}`, { method: "PUT", body: { values } });
  },
  async list() {
    return apiFetch("/game-configs") || [];
  },
};

export const questionService = {
  async listAll(range) {
    if (hasRange(range)) return fetchRangedList("/questions", range);
    return apiFetch("/questions") || [];
  },
  async listByGame(gameId, { inputMode, from, to } = {}) {
    const params = new URLSearchParams();
    if (inputMode) params.set("inputMode", inputMode);
    const qs = params.toString();
    const path = `/questions/game/${gameId}${qs ? `?${qs}` : ""}`;
    if (from != null && to != null) return fetchRangedList(path, { from, to });
    return apiFetch(path) || [];
  },
  async save(gameId, questions) {
    return apiFetch(`/questions/game/${gameId}`, { method: "PUT", body: questions });
  },
  async updateOne(gameId, questionId, data) {
    return apiFetch(`/questions/game/${gameId}/${questionId}`, { method: "PATCH", body: data });
  },
  async removeOne(gameId, questionId) {
    return apiFetch(`/questions/game/${gameId}/${questionId}`, { method: "DELETE" });
  },
  // Xóa hàng loạt: items = [{ gameId, questionId }] (tối đa 200/lần)
  async bulkRemove(items) {
    return apiFetch("/questions/bulk", { method: "DELETE", body: { items } });
  },
  async removeAll() {
    return apiFetch("/questions", { method: "DELETE" });
  },
};

export const questionBankService = {
  async list(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/question-banks${qs ? `?${qs}` : ""}`) || [];
  },
  /**
   * Bản PHÂN TRANG PHÍA SERVER của list() cho tab Câu hỏi (trang Ngân
   * hàng): params gồm { from, to } + lọc tuỳ chọn { subject, grade,
   * search, bad, limit } — server lọc TRƯỚC khi cắt đoạn nên kết quả
   * chuẩn hoá { items, total, pagination } có total là tổng ĐÃ lọc.
   * list() thường giữ nguyên cho các caller cần toàn bộ bank.
   */
  async listPaged(params = {}) {
    const { from, to, ...filters } = params || {};
    const qs = new URLSearchParams(filters).toString();
    return fetchRangedList(`/question-banks${qs ? `?${qs}` : ""}`, { from, to });
  },
  async get(id) { return apiFetch(`/question-banks/${encodeURIComponent(id)}`); },
  async stats() { return apiFetch("/question-banks/stats"); },
  async create(data) { return apiFetch("/question-banks", { method: "POST", body: data }); },
  /** Nhập CSV/JSON hàng loạt. mode "merge" thêm + bỏ câu trùng, "replace" ghi đè cả bank. */
  async createMany(questions, mode = "merge") {
    return apiFetch("/question-banks/bulk", { method: "POST", body: { questions, mode } });
  },
  async update(id, data) { return apiFetch(`/question-banks/${encodeURIComponent(id)}`, { method: "PUT", body: data }); },
  async remove(id) { return apiFetch(`/question-banks/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async removeAll() { return apiFetch("/question-banks", { method: "DELETE" }); },
  // ── Bộ đề (combo đóng gói theo bài) — /question-banks/sets ──────────────
  // List trả kèm questionCount (chỉ đếm câu còn tồn tại trong bank). Chi tiết
  // cho học sinh đã bị server strip correctAnswer; đáp án chỉ lộ qua checkSetAnswer.
  async listSets(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/question-banks/sets${qs ? `?${qs}` : ""}`) || [];
  },
  /** Bản phân trang phía server của listSets() cho tab Bộ đề — xem listPaged. */
  async listSetsPaged(params = {}) {
    const { from, to, ...filters } = params || {};
    const qs = new URLSearchParams(filters).toString();
    return fetchRangedList(`/question-banks/sets${qs ? `?${qs}` : ""}`, { from, to });
  },
  async getSet(id) { return apiFetch(`/question-banks/sets/${encodeURIComponent(id)}`); },
  async createSet(data) { return apiFetch("/question-banks/sets", { method: "POST", body: data }); },
  async updateSet(id, data) { return apiFetch(`/question-banks/sets/${encodeURIComponent(id)}`, { method: "PUT", body: data }); },
  async removeSet(id) { return apiFetch(`/question-banks/sets/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  async checkSetAnswer(setId, questionId, answer) {
    return apiFetch(`/question-banks/sets/${encodeURIComponent(setId)}/check`, { method: "POST", body: { questionId, answer } });
  },
  async linkToGame(bankId, gameId) { return apiFetch(`/question-banks/${encodeURIComponent(bankId)}/link/${encodeURIComponent(gameId)}`, { method: "POST" }); },
  async bulkLink(bankIds, gameId) { return apiFetch("/question-banks/bulk-link", { method: "POST", body: { bankIds, gameId } }); },
  async sync(id) { return apiFetch(`/question-banks/${encodeURIComponent(id)}/sync`, { method: "POST" }); },
};

export const resultService = {
  async listByGame(gameId, range) {
    if (hasRange(range)) return fetchRangedList(`/results/game/${gameId}`, range);
    return apiFetch(`/results/game/${gameId}`) || [];
  },
  async submit(result) {
    return apiFetch("/results", { method: "POST", body: result });
  },
};

/**
 * Chốt kết quả ván chơi (có xác thực + chấm điểm ở server).
 * `playId` dùng làm khóa idempotency: gửi lại cùng playId sẽ không cộng XP 2 lần.
 */
export const gamePlayService = {
  async complete(payload) {
    return apiFetch("/game-plays/complete", { method: "POST", body: payload });
  },
  async recordAssignment(payload) {
    return apiFetch("/game-plays/assignment", { method: "POST", body: payload });
  },
  async rewardCoins(amount) {
    return apiFetch("/game-plays/reward-coins", { method: "POST", body: { amount } });
  },
};

export const xpService = {
  async get() {
    return apiFetch("/auth/me/xp");
  },
};

export const authService = {
  async login(username, password) {
    return apiFetch("/auth/login", { method: "POST", body: { username, password } });
  },
  async register({ username, email, password, name, generatedPassword, ageCode, gender }) {
    // `ageCode` là MÃ tuổi (kid-sprout … kid-summit) — tuổi thật không bao giờ
    // rời khỏi máy. `gender` = "boy" | "girl" để avatar vẽ đúng bé.
    return apiFetch("/auth/register", {
      method: "POST",
      body: { username, email, password, name, generatedPassword, ageCode, gender },
    });
  },
  async me() {
    return apiFetch("/auth/me");
  },
  /**
   * Đổi mật khẩu của chính tài khoản đang đăng nhập (trang Cài đặt trong khu
   * quản trị dùng thay cho "Mã PIN" của tool admin cũ — PIN đó chỉ là hash nằm
   * trong localStorage một trình duyệt).
   * Server thu hồi mọi phiên khác và cấp lại cookie cho phiên này.
   */
  async changePassword(currentPassword, newPassword) {
    const data = await apiFetch("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });
    // Server thu hồi MỌI phiên cũ rồi cấp refresh token mới trong body —
    // phải lưu ngay bản mới, không thì lần refresh sau (nhất là iOS không
    // cookie) trình token đã chết và bị đá về login.
    if (data?.refreshToken) setRefreshToken(data.refreshToken);
    return data;
  },
  /**
   * Danh sách phiên đang hoạt động của CHÍNH tài khoản này (collection
   * refresh_tokens). Phải bật credentials vì server cần cookie HttpOnly để biết
   * bản ghi nào là "máy đang dùng".
   */
  async sessions() {
    return apiFetch("/auth/sessions", { credentials: "include", headers: refreshTokenHeaders() });
  },
  /**
   * Thu hồi phiên. others=true → đá mọi thiết bị KHÁC, giữ máy đang dùng;
   * others=false → thu hồi hết (kể cả máy này, client phải đăng nhập lại).
   */
  async revokeSessions(others = true) {
    return apiFetch(`/auth/sessions?others=${others ? "true" : "false"}`, {
      method: "DELETE",
      credentials: "include",
      headers: refreshTokenHeaders(),
    });
  },
  /** Access token mới từ cookie refresh (single-flight). null khi phiên đã kết thúc. */
  async refresh() {
    return refreshAccessToken();
  },
  /**
   * Đăng xuất: xin server thu hồi refresh token + xoá cookie TRƯỚC khi xoá trạng
   * thái trên máy này. Server không reachable thì vẫn phải kết thúc phiên ở client.
   */
  async logout() {
    try {
      // Kèm header x-refresh-token để server thu hồi đúng family của phiên
      // này cả khi không có cookie (iOS) — thiếu nó thì token phía server
      // vẫn sống sau "đăng xuất".
      await apiFetch("/auth/logout", { method: "POST", _retries: 0, timeoutMs: 8000, headers: refreshTokenHeaders() });
    } catch { /* mất mạng — bỏ qua, dọn dẹp phía client vẫn chạy */ }
    clearAuth();
    window.dispatchEvent(new Event("edu-auth-expired"));
  },
};

export const userService = {
  // filters.q (tuỳ chọn): từ khoá tìm kiếm — server lọc TRƯỚC khi cắt
  // from/to (xem routes/users.js). Không truyền filters → như cũ.
  async list(range, filters = {}) {
    if (hasRange(range)) {
      const q = filters.q ? `?q=${encodeURIComponent(filters.q)}` : "";
      return fetchRangedList(`/users${q}`, range);
    }
    return apiFetch("/users") || [];
  },
  async create(data) {
    return apiFetch("/users", { method: "POST", body: data });
  },
  async remove(id) {
    return apiFetch(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  // Xóa hàng loạt tài khoản (CHỈ admin, tối đa 100/lần) → { deleted, failed, counts }
  async bulkRemove(ids) {
    return apiFetch("/users/bulk", { method: "DELETE", body: { ids } });
  },
  async getById(id, opts) {
    return apiFetch(`/users/${encodeURIComponent(id)}`, typeof opts === "string" ? {} : (opts || {}));
  },
  async search(query, opts) {
    return apiFetch(`/users/search?q=${encodeURIComponent(query)}`, typeof opts === "string" ? {} : (opts || {})) || [];
  },
  // Thư mục tối thiểu cho PHÍA NGƯỜI DÙNG (Tìm bạn, mời bạn chơi cùng):
  // endpoint riêng /users/directory — chỉ cần đăng nhập, KHÔNG cần quyền
  // users.view như search() (search trả cả email nên chỉ giáo viên/admin
  // dùng được; học sinh gọi search() bị 403). Chỉ trả id/username/name/
  // avatarLoadout, tối đa 10 kết quả.
  async searchDirectory(query, opts) {
    return apiFetch(`/users/directory?q=${encodeURIComponent(query)}`, typeof opts === "string" ? {} : (opts || {})) || [];
  },
  async updateProfile(data) {
    return apiFetch("/auth/me", { method: "PUT", body: data });
  },
  async resetPassword(id, newPassword) {
    return apiFetch(`/users/${encodeURIComponent(id)}/reset-password`, { method: "PATCH", body: { newPassword } });
  },
  async updateRole(id, role) {
    return apiFetch(`/users/${encodeURIComponent(id)}/role`, { method: "PATCH", body: { role } });
  },
  async update(id, data) {
    return apiFetch(`/users/${encodeURIComponent(id)}`, { method: "PATCH", body: data });
  },
};

export const leaderboardService = {
  // Bảng xếp hạng phía người dùng: endpoint riêng GET /leaderboard (chỉ học
  // sinh, top 50 theo xu, field tối thiểu) — KHÔNG dùng GET /users (chỉ
  // giáo viên/admin, học sinh gọi bị 403 users.view).
  async list() {
    return apiFetch("/leaderboard") || [];
  },
};

export const statsService = {
  /** days = cửa sổ ngày muốn xem (7/14/30/90) — server kẹp trong khoảng 7..180. */
  async get(days) {
    const q = days ? `?days=${encodeURIComponent(days)}` : "";
    return apiFetch(`/stats${q}`);
  },
};

export const templateService = {
  // filters (tuỳ chọn): { q, status, sort } — server lọc/sắp xếp TRƯỚC
  // khi cắt from/to (xem routes/setup.js). Không truyền → như cũ.
  async list(range, filters = {}) {
    if (hasRange(range)) {
      const p = new URLSearchParams();
      if (filters.q) p.set("q", filters.q);
      if (filters.status && filters.status !== "all") p.set("status", filters.status);
      if (filters.sort) p.set("sort", filters.sort);
      const qs = p.toString();
      return fetchRangedList(`/templates${qs ? `?${qs}` : ""}`, range);
    }
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
  // Xóa hàng loạt (tối đa 200/lần) → { deleted, deactivated, failed, counts };
  // template đang được game dùng chỉ chuyển inactive, nằm ở `deactivated`.
  async bulkRemove(ids) {
    return apiFetch("/templates/bulk", { method: "DELETE", body: { ids } });
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

/**
 * API của trang Cài đặt quản trị (update_admin_page.md) — /api/system/*.
 * Quyền ở server: settings.view (đọc) / settings.edit (ghi). Frontend ẩn khu
 * tương ứng theo quyền, nhưng server mới là nơi chặn thật.
 */
export const systemService = {
  /** Kiểm tra Backend / MongoDB / Supabase / tải HTML. refresh=true bỏ qua cache server. */
  async status(refresh = false) {
    return apiFetch(`/system/status${refresh ? "?refresh=1" : ""}`, { _retries: 0, timeoutMs: 25000 });
  },
  /** Số game, số file HTML/thumbnail + dung lượng thật từ Supabase. */
  async storage() {
    return apiFetch("/system/storage", { _retries: 0, timeoutMs: 25000 });
  },
  /** Quét link htmlUrl/thumbnail. Chỉ ĐỌC — không xoá, không sửa DB. */
  async scan({ page = 1, perPage = 50, force = false } = {}) {
    return apiFetch("/system/scan", { method: "POST", body: { page, perPage, force }, _retries: 0, timeoutMs: 180000 });
  },
  async getConfig() {
    return apiFetch("/system/config");
  },
  /** patch chỉ nhận các khoá whitelist (site / maintenance / notifications). */
  async saveConfig(patch) {
    return apiFetch("/system/config", { method: "PUT", body: patch });
  },
  /** Nhật ký thao tác: { page, perPage, keyword, action, actor, result, from, to }. */
  async logs(q = {}) {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) if (v !== "" && v != null && v !== "all") p.set(k, v);
    return apiFetch(`/system/logs?${p}`, { _withPagination: true });
  },
  /** Cấu hình công khai (tên site + banner bảo trì) — không cần đăng nhập. */
  async publicConfig() {
    return apiFetch("/public-config");
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
  async listAll(range) {
    if (hasRange(range)) return fetchRangedList("/users/game-progress", range);
    return apiFetch("/users/game-progress") || [];
  },
  async updateProgress(id, data) {
    return apiFetch(`/users/game-progress/${encodeURIComponent(id)}`, { method: "PUT", body: data });
  },
  /** Chỉ admin — thay toàn bộ JSON save (gameState) của bản ghi tiến trình. */
  async updateSaveState(id, gameState) {
    return apiFetch(`/users/game-progress/${encodeURIComponent(id)}/state`, { method: "PUT", body: { gameState } });
  },
  async removeProgress(id) {
    return apiFetch(`/users/game-progress/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
};

export const examResultService = {
  async create(data) {
    return apiFetch("/users/me/exam-results", { method: "POST", body: data });
  },
  async mine() {
    return apiFetch("/users/me/exam-results") || [];
  },
};

/**
 * Ví tiền — coin (đơn vị nhỏ) + sao (đơn vị lớn, 1 sao = 20.000 coin).
 * Trước đây hai loại này ở 2 service riêng (`coinService`, `starService`) vì
 * server có 2 endpoint; giờ gộp thành /auth/me/wallet.
 */
export const walletService = {
  /** { coins, stars, rate:{starToCoin}, shop:[...], achievements:[{id,at}], dailyGift:{claimedToday,date} } */
  async get() {
    return apiFetch("/auth/me/wallet");
  },
  /** Cộng/trừ coin: trả về { coins, stars } số dư mới. */
  async addCoins(amount) {
    return apiFetch("/auth/me/wallet", { method: "POST", body: { coins: amount } });
  },
  /** Cộng/trừ sao: trả về { coins, stars }. */
  async addStars(amount) {
    return apiFetch("/auth/me/wallet", { method: "POST", body: { stars: amount } });
  },
  /**
   * Đổi tiền tệ. `direction`: "coinToStar" | "starToCoin",
   * `amount` bỏ trống = đổi toàn bộ loại đang có.
   */
  async exchange(direction, amount) {
    return apiFetch("/auth/me/wallet/exchange", { method: "POST", body: { direction, amount } });
  },
  /** Quà sao hằng ngày — server tự chặn nhận trùng trong cùng 1 ngày. */
  async claimDailyGift() {
    return apiFetch("/auth/me/wallet/daily-gift", { method: "POST" });
  },
  /** Đổi sao lấy thành tựu (catalog trả về kèm trong `get()`). */
  async redeem(achievementId) {
    return apiFetch("/auth/me/wallet/redeem", { method: "POST", body: { achievementId } });
  },
};

export const ticketService = {
  async get() {
    return apiFetch("/auth/me/tickets");
  },
  async add(amount) {
    return apiFetch("/auth/me/tickets", { method: "POST", body: { amount } });
  },
  async use(ticketId) {
    return apiFetch(`/auth/me/tickets/${encodeURIComponent(ticketId)}/use`, { method: "POST" });
  },
};

export const imageService = {
  async upload(file, folder = "edu-game") {
    const auth = loadAuth();
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    const res = await fetch(`${API_BASE}/images/upload`, {
      method: "POST",
      headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json.status) throw new Error(json.msg || "Lỗi upload");
    return json.data;
  },
  async uploadMultiple(files, folder = "edu-game") {
    const auth = loadAuth();
    const form = new FormData();
    files.forEach(f => form.append("files", f));
    form.append("folder", folder);
    const res = await fetch(`${API_BASE}/images/upload-multiple`, {
      method: "POST",
      headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json.status) throw new Error(json.msg || "Lỗi upload");
    return json.data;
  },
  // Phân trang CHỈ bằng from/to (đồng bộ dashboard): có range thì server trả
  // data là MẢNG ảnh đã cắt — chuẩn hoá về { images, total, pagination } để
  // caller giữ nguyên cách đọc `.images`. Không range → giữ nguyên object
  // { images, totalCount, page, perPage } như cũ.
  async list({ folder, from, to } = {}) {
    const params = new URLSearchParams();
    if (folder) params.set("folder", folder);
    if (from != null && to != null) {
      params.set("from", from);
      params.set("to", to);
      const res = await apiFetch(`/images?${params.toString()}`, { _withPagination: true });
      const { items, total, pagination } = normalizeRangeResult(res);
      return { images: items, total, pagination };
    }
    const qs = params.toString();
    return apiFetch(`/images${qs ? `?${qs}` : ""}`);
  },
  async search(q) {
    return apiFetch(`/images/search?q=${encodeURIComponent(q)}`);
  },
  async remove(publicId) {
    return apiFetch(`/images/${encodeURIComponent(publicId)}`, { method: "DELETE" });
  },
  async removeMany(publicIds) {
    return apiFetch("/images", { method: "DELETE", body: { publicIds } });
  },
  // Đồng bộ (chỉ admin): gán toàn bộ ảnh chưa có chủ trong folder cho mình.
  async claimUnowned(folder = "edu-game") {
    return apiFetch("/images/claim-unowned", { method: "POST", body: { folder } });
  },
};

export const gameEventService = {
  async send(eventData) {
    return apiFetch("/game-events", { method: "POST", body: eventData });
  },
};

export const dailyTaskService = {
  async list() {
    return apiFetch("/daily-tasks") || [];
  },
};

export const notificationService = {
  async list(unreadOnly = false) {
    return apiFetch(`/notifications${unreadOnly ? "?unread=true" : ""}`) || [];
  },
  async unreadCount() {
    return apiFetch("/notifications/unread-count");
  },
  async markRead(id) {
    return apiFetch(`/notifications/${id}/read`, { method: "POST" });
  },
  async markAllRead() {
    return apiFetch("/notifications/read-all", { method: "POST" });
  },
  async registerDevice(token, deviceType = "WEB") {
    return apiFetch("/notifications/device-token", { method: "POST", body: { token, deviceType } });
  },
  async removeDevice(token) {
    return apiFetch("/notifications/device-token", { method: "DELETE", body: { token } });
  },
  async testPush() {
    return apiFetch("/notifications/test-push", { method: "POST" });
  },
  async deleteAll() {
    return apiFetch("/notifications/all", { method: "DELETE" });
  },
  async resetDevices() {
    return apiFetch("/notifications/devices/reset", { method: "DELETE" });
  },
};

export const classService = {
  // filters.q (tuỳ chọn): từ khoá tìm kiếm — server lọc TRƯỚC khi cắt
  // from/to (xem routes/classes.js). Không truyền filters → như cũ
  // (mọi caller không-range, vd Công cụ lớp học, giữ nguyên hành vi).
  async list(range, filters = {}) {
    if (hasRange(range)) {
      const q = filters.q ? `?q=${encodeURIComponent(filters.q)}` : "";
      return fetchRangedList(`/classes${q}`, range);
    }
    return apiFetch("/classes") || [];
  },
  async get(id) { return apiFetch(`/classes/${id}`); },
  async create(data) { return apiFetch("/classes", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/classes/${id}`, { method: "PUT", body: data }); },
  async delete_(id) { return apiFetch(`/classes/${id}`, { method: "DELETE" }); },
  async join(code) { return apiFetch("/classes/join", { method: "POST", body: { code } }); },
  async getStudents(id, range) {
    if (hasRange(range)) return fetchRangedList(`/classes/${id}/students`, range);
    return apiFetch(`/classes/${id}/students`) || [];
  },
  async removeStudent(classId, studentId) { return apiFetch(`/classes/${classId}/students/${studentId}`, { method: "DELETE" }); },
};

// Bản đồ nhiệt điểm mù: tổng hợp học sinh × chủ đề cho giáo viên
// (GET /api/heatmap/class/:classId — server tự chặn phạm vi lớp).
export const heatmapService = {
  async getClassHeatmap(classId) { return apiFetch(`/heatmap/class/${classId}`); },
};

// Gói can thiệp 1 chạm (Đợt 2): xem trước số câu cơ bản cùng chủ đề và
// tạo gói ôn tập đích danh từ Bản đồ nhiệt (server tự chặn phạm vi lớp).
export const remediationService = {
  async preview(classId, topic) {
    return apiFetch(`/remediation/preview?classId=${encodeURIComponent(classId)}&topic=${encodeURIComponent(topic)}`);
  },
  async createPack({ classId, topic, studentIds }) {
    return apiFetch("/remediation/packs", { method: "POST", body: { classId, topic, studentIds } });
  },
};

// Sự kiện & thử thách theo mùa (Đợt 3): admin CRUD qua /events/admin
// (chỉ admin — server đòi quyền events.manage); phía học sinh qua
// /events/active + /events/:id (tiến độ do server tính từ results thật,
// đạt mốc thì server trao thưởng ngay khi đọc).
export const eventService = {
  async listAdmin(range) {
    if (hasRange(range)) return fetchRangedList("/events/admin", range);
    return apiFetch("/events/admin") || [];
  },
  async topics() { return apiFetch("/events/admin/topics") || []; },
  async create(data) { return apiFetch("/events/admin", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/events/admin/${id}`, { method: "PUT", body: data }); },
  async setEnabled(id, enabled) { return apiFetch(`/events/admin/${id}/enabled`, { method: "PATCH", body: { enabled } }); },
  async remove(id) { return apiFetch(`/events/admin/${id}`, { method: "DELETE" }); },
  async leaderboard(id) { return apiFetch(`/events/admin/${id}/leaderboard`); },
  async finalize(id) { return apiFetch(`/events/admin/${id}/finalize`, { method: "POST", body: {} }); },
  async active() { return apiFetch("/events/active") || []; },
  async detail(id) { return apiFetch(`/events/${id}`); },
};

export const assignmentService = {
  async list(classId, range) {
    const path = classId ? `/assignments?classId=${classId}` : "/assignments";
    if (hasRange(range)) return fetchRangedList(path, range);
    return apiFetch(path) || [];
  },
  async get(id) { return apiFetch(`/assignments/${id}`); },
  async create(data) { return apiFetch("/assignments", { method: "POST", body: data }); },
  async join(code) { return apiFetch("/assignments/join", { method: "POST", body: { code } }); },
  async resolve(codeOrId) { return apiFetch(`/assignments/resolve/${encodeURIComponent(codeOrId)}`); },
  async start(id, { guestName } = {}) {
    return apiFetch(`/assignments/${id}/start`, { method: "POST", body: { guestName } });
  },
  // CHỈ ĐỌC: trạng thái làm bài hiện tại (chưa bắt đầu / đang làm / đã nộp) —
  // dùng cho màn hình giới thiệu, tuyệt đối không tạo submission.
  async getMySubmission(id, { guestName } = {}) {
    const qs = guestName ? `?guestName=${encodeURIComponent(guestName)}` : "";
    return apiFetch(`/assignments/${id}/my-submission${qs}`);
  },
  async submit(id, submissionId, answers, { guestName } = {}) {
    return apiFetch(`/assignments/${id}/submit`, { method: "POST", body: { submissionId, answers, guestName } });
  },
  async getResult(id, { guestName, showCorrectAnswer } = {}) {
    const params = new URLSearchParams();
    if (guestName) params.set("guestName", guestName);
    if (showCorrectAnswer) {
      params.set("final", "true");
      params.set("correctShow", "true");
    }
    const qs = params.toString() ? `?${params.toString()}` : "";
    return apiFetch(`/assignments/${id}/result${qs}`);
  },
  async getStats(id) { return apiFetch(`/assignments/${id}/stats`); },
  async getSubmissions(id, range) {
    if (hasRange(range)) return fetchRangedList(`/assignments/${id}/submissions`, range);
    return apiFetch(`/assignments/${id}/submissions`) || [];
  },
  async getMyCompleted() { return apiFetch("/assignments/my-completed") || []; },
  async close(id) { return apiFetch(`/assignments/${id}/close`, { method: "PUT" }); },
  async update(id, data) { return apiFetch(`/assignments/${id}`, { method: "PUT", body: data }); },
  async delete_(id) { return apiFetch(`/assignments/${id}`, { method: "DELETE" }); },
  // Xóa hàng loạt bài tập (tối đa 200/lần) → { deleted, failed, counts }
  async bulkRemove(ids) { return apiFetch("/assignments/bulk", { method: "DELETE", body: { ids } }); },
};

export const gardenService = {
  async get() { return apiFetch("/garden"); },
  async getPlantTypes() { return apiFetch("/plant-types"); },
  async plant(slotIndex, plantType) {
    return apiFetch("/garden/plant", { method: "POST", body: { slotIndex, plantType } });
  },
  async harvest(slotIndex) {
    return apiFetch("/garden/harvest", { method: "POST", body: { slotIndex } });
  },
  async water(slotIndex) {
    return apiFetch("/garden/water", { method: "POST", body: { slotIndex } });
  },
  async remove(slotIndex) {
    return apiFetch("/garden/remove", { method: "POST", body: { slotIndex } });
  },
  async getInventory() { return apiFetch("/garden/inventory"); },
  async buyItem(itemId) { return apiFetch("/garden/buy-item", { method: "POST", body: { itemId } }); },
  async useItem(itemId) { return apiFetch("/garden/use-item", { method: "POST", body: { itemId } }); },
  async getWater() { return apiFetch("/garden/water"); },
  async syncWater(waterDrops) { return apiFetch("/garden/water/sync", { method: "POST", body: { waterDrops } }); },
};

export const reminderService = {
  // params: { from, to } để phân trang from/to như mọi list quản trị; kèm
  // tuỳ chọn { triggered, q } — server lọc TRƯỚC khi cắt đoạn nên
  // pagination.total là tổng của tập đã lọc (trang /dashboard/reminders
  // phân trang riêng mục chưa/đã triggered + ô tìm kiếm). Không truyền
  // range → giữ nguyên hành vi cũ (mảng toàn bộ) cho các caller phía user.
  async list(params) {
    if (hasRange(params)) {
      const qs = new URLSearchParams();
      if (params.triggered != null) qs.set("triggered", String(params.triggered));
      if (params.q) qs.set("q", params.q);
      const s = qs.toString();
      return fetchRangedList(`/reminders${s ? `?${s}` : ""}`, params);
    }
    return apiFetch("/reminders") || [];
  },
  async getDue() { return apiFetch("/reminders/due") || []; },
  async getUpcoming(minutes) { return apiFetch(`/reminders/upcoming?minutes=${minutes || 60}`) || []; },
  async create(data) { return apiFetch("/reminders", { method: "POST", body: data }); },
  async update(id, data) { return apiFetch(`/reminders/${id}`, { method: "PUT", body: data }); },
  async trigger(id) { return apiFetch(`/reminders/${id}/trigger`, { method: "POST" }); },
  async delete_(id) { return apiFetch(`/reminders/${id}`, { method: "DELETE" }); },
};

/**
 * Ticket hỗ trợ — người dùng gửi từ trang chủ (nút "Hỗ trợ"), admin xử lý ở
 * /admin/support. Server: server/src/routes/support.js.
 * Lưu ý: `ticketService` ở trên là vé vào game, không liên quan chỗ này.
 */
export const supportService = {
  async create(data) { return apiFetch("/support/tickets", { method: "POST", body: data }); },
  async mine() { return apiFetch("/support/tickets/mine") || []; },
  // GV: chỉ ticket được gán cho mình (server lọc theo assigneeId);
  // tài khoản có `support_all` (admin tổng) gọi cùng endpoint này sẽ thấy hết.
  async assigned(range) {
    if (hasRange(range)) return fetchRangedList("/support/tickets/assigned", range);
    return apiFetch("/support/tickets/assigned") || [];
  },
  async updateAssigned(id, data) { return apiFetch(`/support/tickets/assigned/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
  async list(range) {
    if (hasRange(range)) return fetchRangedList("/support/admin/tickets", range);
    return apiFetch("/support/admin/tickets") || [];
  },
  async update(id, data) { return apiFetch(`/support/admin/tickets/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
  async remove(id) { return apiFetch(`/support/admin/tickets/${encodeURIComponent(id)}`, { method: "DELETE" }); },
  // Xóa hàng loạt ticket (admin, tối đa 200/lần) → { deleted, failed, counts }
  async bulkRemoveTickets(ids) { return apiFetch("/support/admin/tickets/bulk", { method: "DELETE", body: { ids } }); },
  // Báo cáo người dùng từ chat (collection `reports` riêng — xem reportService ở server):
  // người dùng gửi từ màn hình trò chuyện, chỉ admin xem/xử lý.
  async createReport(data) { return apiFetch("/support/reports", { method: "POST", body: data }); },
  async listReports(range) {
    if (hasRange(range)) return fetchRangedList("/support/admin/reports", range);
    return apiFetch("/support/admin/reports") || [];
  },
  async updateReport(id, data) { return apiFetch(`/support/admin/reports/${encodeURIComponent(id)}`, { method: "PATCH", body: data }); },
};

export const permissionService = {
  // Permission Catalog chuẩn hoá (refactor Role & Permission): bản ghi
  // PHẲNG từng quyền từ collection `permissions`, phân trang phía server.
  // (Endpoint /permissions/features cũ đã bị loại bỏ cùng đợt này.)
  async catalog(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/permissions/catalog${qs ? `?${qs}` : ""}`, { _withPagination: true });
  },
  /** Toàn bộ catalog một lần (danh mục ~140 bản ghi) cho modal gán quyền. */
  async catalogAll() {
    const res = await this.catalog({ from: 1, to: 1000 });
    return res?.data || [];
  },
  // ── Role Permissions: quyền đã gán cho từng vai trò ──────────────────
  /** Danh sách quyền của MỘT vai trò (role_id: id số / slug / id document). */
  async listRolePermissions(roleRef, params = {}) {
    const qs = new URLSearchParams({ role_id: roleRef, per_page: 500, ...params }).toString();
    const res = await apiFetch(`/rolePermissions?${qs}`, { _withPagination: true });
    return res?.data || [];
  },
  async grantRolePermissions(roleRef, permissionIds) {
    return apiFetch("/rolePermissions", { method: "POST", body: { role_id: roleRef, permission_ids: permissionIds } });
  },
  /** Đồng bộ toàn bộ tập quyền của vai trò theo danh sách id gửi lên. */
  async syncRolePermissions(roleRef, permissionIds) {
    return apiFetch(`/rolePermissions/${encodeURIComponent(roleRef)}`, { method: "PUT", body: { permission_ids: permissionIds } });
  },
  async revokeRolePermissions(roleRef, permissionIds) {
    return apiFetch("/rolePermissions", { method: "DELETE", body: { role_id: roleRef, permission_ids: permissionIds } });
  },
  async listRoles(range) {
    if (hasRange(range)) {
      const { items } = await fetchRangedList("/permissions/roles", range);
      return items;
    }
    return apiFetch("/permissions/roles") || [];
  },
  async getRole(key) { return apiFetch(`/permissions/roles/${encodeURIComponent(key)}`); },
  // API tách riêng dạng HiWeb (server/src/routes/roles.js, permissions.js GET "/"):
  // phân trang CHỈ bằng from/to (đồng bộ dashboard) — params: { from, to,
  // keyword, sort_by, sort_dir } (from_date/to_date/date_col chỉ dùng cho bộ
  // lọc ngày, không phải biến phân trang).
  async rolesPaged(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/roles${qs ? `?${qs}` : ""}`, { _withPagination: true });
  },
  async permissionsPaged(params = {}) {
    // Trang Quyền đọc từ Permission Catalog chuẩn hoá (cùng dữ liệu với
    // GET /api/permissions, vốn giữ lại làm alias tương thích).
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/permissions/catalog${qs ? `?${qs}` : ""}`, { _withPagination: true });
  },
  /** POST /api/permissions/all — seed các quyền `<module>_all` (chỉ admin). */
  async createAllPermissions() {
    return apiFetch("/permissions/all", { method: "POST" });
  },
  async counts() { return apiFetch("/permissions/counts") || {}; },
  async createRole(data) {
    return apiFetch("/permissions/roles", { method: "POST", body: data });
  },
  async updateRole(key, data) {
    return apiFetch(`/permissions/roles/${encodeURIComponent(key)}`, { method: "PUT", body: data });
  },
  async deleteRole(key) {
    return apiFetch(`/permissions/roles/${encodeURIComponent(key)}`, { method: "DELETE" });
  },
};