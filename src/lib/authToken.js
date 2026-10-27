/**
 * authToken — nơi duy nhất giữ ACCESS TOKEN của trình duyệt.
 *
 * Quy ước (update_refresh_token.md §2):
 *   - Access token: nằm trong BỘ NHỚ module này, gửi qua header `Authorization`.
 *     Refresh token KHÔNG bao giờ xuất hiện ở đây — nó là cookie HttpOnly nên
 *     JavaScript không đọc (và không cần đọc) được.
 *   - localStorage `edu_games_auth` vẫn được ghi làm BỘ ĐỆM TƯƠNG THÍCH: hơn chục
 *     chỗ đang đọc trực tiếp key này (game iframe, offlineGameSync, coinWallet,
 *     UploadItems, ManageAvatarItems.html…), và web storage bị xoá khi tải lại
 *     trang nên nó cũng là bản ghi nhớ "user nào đang đăng nhập".
 *     Mỗi lần có access token mới, bộ đệm này được viết lại ⇒ các reader cũ luôn
 *     thấy token còn hạn. Muốn siết chặt (bỏ hẳn localStorage) thì phải sửa hết
 *     các reader đó trước — xem ghi chú trong báo cáo.
 *
 * Single-flight: nhiều request cùng hết hạn → chỉ MỘT lần gọi /auth/refresh,
 * các request khác chờ chung promise đó (§7.6).
 */
const AUTH_KEY = "edu_games_auth";

/** @type {{token: string|null, user: object|null} | null} */
let memory = null;
/** Promise đang refresh — null khi không có request nào. */
let inflight = null;
const listeners = new Set();

function storageAvailable() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readStorage() {
  if (!storageAvailable()) return null;
  try {
    const raw = JSON.parse(window.localStorage.getItem(AUTH_KEY) || "null");
    return raw && typeof raw === "object" ? raw : null;
  } catch {
    return null;
  }
}

function writeStorage(auth) {
  if (!storageAvailable()) return;
  try {
    if (auth) window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    else window.localStorage.removeItem(AUTH_KEY);
  } catch { /* Safari private mode: bộ nhớ vẫn đủ dùng */ }
}

/** Giải mã payload JWT (không verify — client chỉ cần `exp` để canh thời gian). */
export function tokenPayload(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

/** Thời điểm access token hết hạn (ms epoch) — null nếu token không phải JWT hợp lệ. */
export function tokenExpiresAt(token = memory?.token) {
  const payload = tokenPayload(token);
  return payload && typeof payload.exp === "number" ? payload.exp * 1000 : null;
}

export function isExpired(token = memory?.token) {
  const exp = tokenExpiresAt(token);
  return exp !== null && Date.now() >= exp;
}

/**
 * Còn hiệu lực và chưa sát mốc hết hạn?
 * `skewMs`: chủ động refresh trước khi hết hạn (mặc định 2 phút) để request đang
 * bay không kịp chết giữa chừng.
 */
export function isUsable(token = memory?.token, skewMs = 120_000) {
  if (!token) return false;
  const exp = tokenExpiresAt(token);
  if (exp === null) return true; // token opaque (không phải JWT) → coi như còn hạn
  return Date.now() < exp - skewMs;
}

function emit() {
  for (const cb of listeners) {
    try { cb(memory); } catch { /* listener lỗi không được làm gãy luồng auth */ }
  }
}

/**
 * Ghi trạng thái đăng nhập. `persist=false` dùng cho trường hợp chỉ nạp token
 * từ bộ nhớ ra lại (không cần viết xuống localStorage).
 */
export function setAuth(auth, { persist = true } = {}) {
  memory = auth && (auth.token || auth.user) ? { token: auth.token ?? null, user: auth.user ?? null } : null;
  if (persist) writeStorage(memory);
  emit();
  return memory;
}

/**
 * Đọc bản ghi đăng nhập. Ưu tiên BỘ NHỚ; nếu mất (tải lại trang) thì nhận từ
 * localStorage — tính năng, không phải cửa sau: token lấy từ đây sắp hết hạn là
 * bị đổi bằng silent refresh.
 */
export function getAuth() {
  if (memory) return memory;
  const stored = readStorage();
  if (stored?.token) memory = { token: stored.token, user: stored.user ?? null };
  return memory;
}

export function getToken() {
  getAuth();
  return memory?.token || null;
}

export function getUser() {
  return getAuth()?.user || null;
}

export function clearAuth() {
  memory = null;
  inflight = null;
  writeStorage(null);
  emit();
}

/** token/user mới nhất cho UI; callback chạy mỗi lần set/clear. */
export function subscribeAuth(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Đang có một request refresh chạy hay không (§8: không tạo vòng lặp retry). */
export function isRefreshing() {
  return !!inflight;
}

/**
 * Đổi access token qua cookie refresh.
 *
 * @param {(req: {path: string, init: RequestInit}) => Promise<Response>} transport
 *   hàm gọi fetch thật — tiêm vào để module này không phụ thuộc api.js (tránh
 *   import vòng). Trả về token mới hoặc null khi thất bại.
 */
export async function refreshOnce(transport) {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const json = await transport();
      const token = json?.Authorization
        ? String(json.Authorization).replace(/^Bearer\s+/i, "")
        : json?.data?.token || null;
      if (!token) return null;
      const user = memory?.user ?? readStorage()?.user ?? null;
      setAuth({ token, user });
      return token;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/**
 * §4: khi refresh thất bại (token hết hạn / bị thu hồi / mất mạng) thì KHÔNG
 * refresh tiếp nữa — phiên bị coi là kết thúc, ai đang giữ token phải xin lại.
 */
export function markSessionDead() {
  clearAuth();
}
