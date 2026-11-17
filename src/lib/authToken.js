/**
 * authToken — nơi duy nhất giữ TOKEN của trình duyệt.
 *
 * Quy ước (update_refresh_token.md §2 + vá iOS):
 *   - Access token: nằm trong BỘ NHỚ module này, gửi qua header `Authorization`.
 *   - Refresh token có HAI đường:
 *       (a) cookie HttpOnly — đường chính, JS không đọc được, desktop/Android
 *           dùng đường này;
 *       (b) một bản giữ trong object phiên `edu_games_auth` (localStorage),
 *           gửi qua header `x-refresh-token` khi refresh — vì client
 *           (github.io) và API (onrender.com) khác site nên cookie là cookie
 *           BÊN THỨ BA và WebKit trên iOS chặn nó mặc định (ITP): trên iPhone
 *           cookie không được lưu/gửi, chỉ còn đường header này giữ được
 *           phiên. Token vẫn xoay vòng mỗi lần refresh (bản lưu PHẢI được cập
 *           nhật bằng token mới trong response, xem refreshOnce) và server
 *           vẫn chỉ lưu hash + reuse-detection thu hồi cả family khi token
 *           cũ bị trình lại ngoài cửa sổ grace.
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

/** @type {{token: string|null, user: object|null, refreshToken: string|null} | null} */
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
 *
 * `refreshToken`: caller truyền token MỚI (đăng nhập/đăng ký/refresh thành
 * công) thì thay bản đang giữ; KHÔNG truyền (vd patchUser chỉ đổi `user`)
 * thì GIỮ NGUYÊN bản hiện tại — tuyệt đối không để các lần ghi phụ làm mất
 * refresh token, trên iOS mất nó là mất phiên. Object phiên cũ (từ trước bản
 * này) không có field này → đọc bình thường, coi như null.
 */
export function setAuth(auth, { persist = true } = {}) {
  if (!auth || !(auth.token || auth.user)) {
    memory = null;
  } else {
    const prev = memory ?? readStorage();
    memory = {
      token: auth.token ?? null,
      user: auth.user ?? null,
      refreshToken: auth.refreshToken !== undefined ? auth.refreshToken : (prev?.refreshToken ?? null),
    };
  }
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
  if (stored?.token) {
    memory = { token: stored.token, user: stored.user ?? null, refreshToken: stored.refreshToken ?? null };
  }
  return memory;
}

export function getToken() {
  getAuth();
  return memory?.token || null;
}

/** Refresh token bản localStorage (đường header cho iOS); null nếu không có. */
export function getRefreshToken() {
  getAuth();
  return memory?.refreshToken || null;
}

/**
 * Thay riêng refresh token đang giữ (vd sau ĐỔI MẬT KHẨU: server thu hồi mọi
 * phiên cũ và cấp token mới trong body response — không nhận bản mới này thì
 * lần refresh sau trên iOS trình token đã chết). Chưa có phiên thì bỏ qua.
 */
export function setRefreshToken(raw) {
  const current = getAuth();
  if (!current || typeof raw !== "string" || !raw) return;
  setAuth({ ...current, refreshToken: raw });
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

/**
 * Đổi access token qua refresh token (cookie HttpOnly, hoặc bản localStorage
 * gửi qua header `x-refresh-token` trên iOS).
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
      // Refresh token XOAY VÒNG mỗi lần: response luôn kèm token mới (v1 ở
      // gốc JSON, endpoint cũ trong data) — PHẢI cập nhật bản lưu, không thì
      // lần refresh sau trình token đã rotated và chỉ còn grace cứu được.
      const nextRefresh = json?.refreshToken || json?.data?.refreshToken || null;
      const user = memory?.user ?? readStorage()?.user ?? null;
      setAuth({ token, user, ...(nextRefresh ? { refreshToken: nextRefresh } : {}) });
      return token;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
