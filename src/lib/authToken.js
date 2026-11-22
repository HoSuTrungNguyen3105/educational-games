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
 *
 * Đồng bộ LIÊN TAB (vá lỗi "refresh token không còn hiệu lực" khi mở nhiều
 * tab/PWA): localStorage là nguồn sự thật về THẾ HỆ token mới nhất — tab nào
 * refresh xong cũng ghi bản mới xuống đó, còn `memory` là bản riêng từng tab
 * nên tab chậm sẽ lệch thế hệ. Bốn cơ chế giữ mọi tab cùng một thế hệ:
 *   (1) sự kiện `storage`: tab khác ghi/xoá phiên → memory nhận theo ngay;
 *   (2) đường refresh luôn đọc lại localStorage trước khi trình token;
 *   (3) Web Locks API: chỉ MỘT tab được refresh tại một thời điểm;
 *   (4) CHẶN THẾ HỆ LÙI theo `iat` của access token (xem isOlderAuth): bản
 *       ghi trong storage CŨ hơn bản tab đang giữ thì KHÔNG nhận, và tab
 *       chậm cũng không được ghi bản cũ của mình đè lên storage.
 * Thiếu các cơ chế này, tab chậm trình refresh token đã xoay quá cửa sổ
 * grace → server coi là reuse → thu hồi CẢ family → mọi tab bị đá về đăng
 * nhập dù token mới nhất vẫn hợp lệ.
 *
 * Vì sao cần (4) dù đã có (1)–(3) — lỗi mất phiên khi mở tab thứ hai trên
 * production 2026-11-22, tái hiện xác định bằng harness 2 tab + độ trễ:
 * storage bị GHI LÙI về một thế hệ cũ (tab bị đóng băng/bfcache khôi phục
 * rồi ghi lại snapshot phiên cũ của nó — vd đường ghi phụ patchUser →
 * setAuth lấy refresh token từ memory cũ của chính tab đó; hoặc bản ghi cũ
 * được khôi phục đè lên). Các tab khác nhận bừa bản lùi qua (1)/(2), trình
 * refresh token đã xoay từ lâu → ngoài grace → server thu hồi cả family →
 * tab trình token lỗi dọn luôn storage dùng chung → MỌI tab mất phiên.
 * `iat` do server cấp trong access token, tăng đơn điệu theo mỗi vòng xoay
 * nên là mốc so thế hệ tin cậy được; hai thế hệ cấp cùng một giây có `iat`
 * bằng nhau → vẫn nhận như cũ, cửa sổ grace của server đủ che trường hợp đó.
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

/**
 * Bản ghi `candidate` có thuộc THẾ HỆ CŨ HƠN bản ghi `baseline` không — so
 * bằng `iat` (giây) trong access token, mốc do server cấp và tăng đơn điệu
 * theo mỗi vòng xoay token. Chỉ kết luận khi CẢ HAI token đều đọc được
 * `iat`; thiếu mốc (token opaque/không phải JWT) thì coi như không cũ hơn
 * và giữ hành vi cũ — thà nhận nhầm còn hơn chặn nhầm phiên hợp lệ.
 */
function isOlderAuth(candidate, baseline) {
  if (!candidate?.token || !baseline?.token) return false;
  const a = tokenPayload(candidate.token)?.iat;
  const b = tokenPayload(baseline.token)?.iat;
  return typeof a === "number" && typeof b === "number" && a < b;
}

/**
 * Nhận bản ghi trong localStorage làm bản ghi của tab này — KHÔNG ghi lại
 * (nó đã nằm trong storage rồi). Trả true nếu memory thật sự thay đổi.
 * Cơ sở của đồng bộ liên tab: localStorage luôn giữ thế hệ token MỚI NHẤT
 * vì mọi lần xoay token, ở bất kỳ tab nào, đều ghi xuống đó ngay; `memory`
 * của một tab chậm/ít mở có thể còn giữ thế hệ cũ.
 *
 * NGOẠI LỆ (cơ chế (4) ở đầu file): bản ghi trong storage CŨ hơn bản tab
 * đang giữ = storage vừa bị ghi lùi bởi một tab chậm — KHÔNG nhận. Nhận
 * vào là tab này sẽ trình refresh token đã xoay quá grace ở lần refresh
 * tới và tự tay kích reuse-detection giết cả family.
 */
function adoptStored(stored) {
  if (!stored?.token) return false;
  if (memory && isOlderAuth(stored, memory)) return false;
  const next = {
    token: stored.token ?? null,
    user: stored.user ?? null,
    refreshToken: stored.refreshToken ?? null,
  };
  const changed =
    !memory ||
    memory.token !== next.token ||
    memory.refreshToken !== next.refreshToken ||
    JSON.stringify(memory.user ?? null) !== JSON.stringify(next.user ?? null);
  if (!changed) return false;
  memory = next;
  emit();
  return true;
}

/**
 * Đồng bộ memory từ localStorage. Đường refresh PHẢI đi qua hàm này trước
 * khi trình refresh token (xem refreshOnce): trình bản cũ trong memory —
 * token đã rotated quá cửa sổ grace — là tự tay kích reuse-detection của
 * server và làm chết cả family.
 * Storage TRỐNG thì không tự xoá memory ở đây: trình duyệt chặn ghi storage
 * (private mode) cũng cho kết quả trống tương tự dù phiên còn sống. Tín
 * hiệu "tab khác đã đăng xuất" đi qua sự kiện `storage` bên dưới.
 */
function syncFromStorage() {
  const stored = readStorage();
  if (stored?.token) adoptStored(stored);
  return memory;
}

/**
 * Sự kiện `storage` chỉ bắn ở các tab KHÁC tab vừa ghi — đúng tín hiệu cần:
 *   - Tab khác xoay token / đăng nhập / sửa hồ sơ → nhận bản mới vào memory
 *     ngay, từ đây tab này không bao giờ trình refresh token cũ nữa.
 *   - Tab khác ĐĂNG XUẤT (xoá key) → dọn memory lặng lẽ + bắn
 *     `edu-auth-expired` để store/UI về trạng thái chưa đăng nhập, thay vì
 *     để vòng refresh 20 giây trình token đã bị thu hồi rồi mới chết.
 * Sự kiện key=null là localStorage.clear() ở tab khác — đọc lại storage là
 * bắt được cả hai trường hợp.
 */
function onStorageEvent(event) {
  if (event && event.key != null && event.key !== AUTH_KEY) return;
  const stored = readStorage();
  if (!stored?.token) {
    if (!memory) return;
    memory = null;
    inflight = null;
    emit();
    try { window.dispatchEvent(new Event("edu-auth-expired")); } catch { /* môi trường lạ — store còn đường dọn phiên khác */ }
    return;
  }
  adoptStored(stored);
}

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
  window.addEventListener("storage", onStorageEvent);
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
    if (persist) writeStorage(null);
    emit();
    return memory;
  }
  const prev = memory ?? readStorage();
  const next = {
    token: auth.token ?? null,
    user: auth.user ?? null,
    refreshToken: auth.refreshToken !== undefined ? auth.refreshToken : (prev?.refreshToken ?? null),
  };
  if (persist) {
    const stored = readStorage();
    if (stored?.token && isOlderAuth(next, stored)) {
      /* Storage đang giữ thế hệ MỚI hơn bản caller muốn ghi — tab này chậm
       * thế hệ (vd patchUser lấy token từ memory cũ của một tab bị đóng
       * băng lâu). Ghi đè là kéo mọi tab lùi về refresh token đã xoay, và
       * lần refresh kế tiếp của bất kỳ tab nào cũng có thể giết cả family
       * (xem cơ chế (4) ở đầu file). KHÔNG ghi; nhận bản trong storage
       * làm bản của tab này để tab tự lành theo thế hệ mới nhất. */
      memory = next;
      adoptStored(stored);
      emit();
      return memory;
    }
  }
  memory = next;
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

const REFRESH_LOCK_NAME = "edu-games-auth-refresh";

/**
 * Khoá LIÊN TAB cho thao tác refresh (Web Locks API): tại một thời điểm chỉ
 * MỘT tab được gọi endpoint refresh; tab khác chờ khoá, rồi đọc lại bản
 * token tab kia vừa ghi vào localStorage thay vì trình token của mình.
 * Trình duyệt không có Web Locks → chạy thẳng như trước (single-flight
 * trong tab vẫn giữ, và syncFromStorage vẫn cứu phần lớn trường hợp).
 * Khoá lỗi TRƯỚC khi fn chạy → chạy thẳng; fn đã chạy mà lỗi thì ném tiếp —
 * TUYỆT ĐỐI không chạy lại, chạy hai lần là tự thêm một vòng xoay token.
 */
async function withRefreshLock(fn) {
  const locks = typeof navigator !== "undefined" ? navigator.locks : null;
  if (!locks || typeof locks.request !== "function") return fn();
  let started = false;
  try {
    return await locks.request(REFRESH_LOCK_NAME, async () => {
      started = true;
      return fn();
    });
  } catch (err) {
    if (started) throw err;
    return fn();
  }
}

/**
 * Đổi access token qua refresh token (cookie HttpOnly, hoặc bản localStorage
 * gửi qua header `x-refresh-token` trên iOS).
 *
 * Toàn bộ thao tác nằm trong khoá liên tab + đồng bộ từ localStorage trước
 * khi gọi server (xem ghi chú đồng bộ liên tab ở đầu file): nếu trong lúc
 * chờ khoá, tab khác đã refresh xong và access token mới còn hạn thì dùng
 * luôn bản đó — không gọi server thêm một vòng xoay không cần thiết.
 *
 * @param {(req: {path: string, init: RequestInit}) => Promise<Response>} transport
 *   hàm gọi fetch thật — tiêm vào để module này không phụ thuộc api.js (tránh
 *   import vòng). Trả về token mới hoặc null khi thất bại.
 */
export async function refreshOnce(transport) {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      return await withRefreshLock(async () => {
        const beforeToken = memory?.token ?? null;
        syncFromStorage();
        if (memory?.token && memory.token !== beforeToken && isUsable(memory.token)) {
          return memory.token;
        }
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
      });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
