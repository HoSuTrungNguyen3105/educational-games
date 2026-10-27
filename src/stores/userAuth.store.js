import { create } from "zustand";
import { authService, notificationService, loadAuth, saveAuth, clearAuth, refreshAccessToken } from "../services/api.js";
import { getAuth, isExpired, subscribeAuth } from "../lib/authToken.js";
import { socket } from "../socket/socket.js";
import { requestNotificationPermission } from "../firebase/messaging.js";
import { syncKidFromAccount } from "../lib/ageCodes.js";

// Rebind this device's FCM token to the given (current) user.
// Safe no-op when notification permission isn't granted.
async function syncDeviceToken() {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const token = await requestNotificationPermission();
    if (token) await notificationService.registerDevice(token, "WEB");
  } catch { /* ignore — push is best-effort */ }
}

/** Bản "huỷ" của syncDeviceToken — chạy nền lúc đăng xuất, không chặn UI. */
async function removePushToken() {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const token = await requestNotificationPermission();
    if (token) await notificationService.removeDevice(token);
  } catch { /* ignore — push is best-effort */ }
}

/** Nối lại Socket.IO với access token mới nhất (§7.5). */
function bindSocket(token) {
  try {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
  } catch { /* socket chưa sẵn sàng — request HTTP vẫn chạy */ }
}

/**
 * §7.9 + listener `edu-auth-expired`: trước đây event này bắn ra mà không ai nghe,
 * nên sau 401 UI vẫn hiện tên người dùng dù phiên đã chết. Đăng ký MỘT lần cho
 * cả đời module (không tạo nhiều listener khi component render lại).
 */
let watchersBound = false;
function bindAuthWatchers(set, get) {
  if (watchersBound) return;
  watchersBound = true;

  window.addEventListener("edu-auth-expired", () => {
    clearAuth();
    try { socket.disconnect(); } catch { /* chưa kịp nối */ }
    set({ user: null, token: null, error: null });
  });

  // Token vừa đổi (silent refresh / retry 401) → state và socket phải theo kịp.
  subscribeAuth((auth) => {
    const token = auth?.token || null;
    if (!token) return;
    if (get().token !== token) set({ token, user: auth?.user ?? get().user });
    if (get().user) bindSocket(token);
  });
}

export const useUserAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  init: () => {
    bindAuthWatchers(set, get);

    const auth = loadAuth();
    if (auth && auth.token && auth.user) {
      set({ user: auth.user, token: auth.token });
      syncKidFromAccount(auth.user);
      bindSocket(auth.token);
      syncDeviceToken();
      return;
    }

    // Tải lại trang: access token trong bộ nhớ đã mất (hoặc vừa hết hạn) nhưng
    // còn bản ghi đăng nhập ⇒ âm thầm đổi token mới từ cookie HttpOnly.
    // Không còn cookie/refresh hết hạn ⇒ coi như chưa đăng nhập (§4, §9).
    const stored = getAuth();
    if (stored?.token && !get().user) {
      refreshAccessToken().then((token) => {
        if (!token) {
          // Refresh thất bại: xoá phiên rác để UI hiện đúng "chưa đăng nhập".
          if (!isExpired(stored.token)) return; // token còn hạn ⇒ lỗi mạng, giữ nguyên
          clearAuth();
          return;
        }
        const user = getAuth()?.user ?? stored.user ?? null;
        set({ user, token });
        if (user) {
          syncKidFromAccount(user);
          bindSocket(token);
          syncDeviceToken();
        }
      });
    }
  },

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login(identifier, password);
      saveAuth({ token, user });
      set({ user, token, isLoading: false });
      syncKidFromAccount(user);
      bindSocket(token);
      syncDeviceToken();
      return user;
    } catch (e) {
      set({ error: e.message || "Đăng nhập thất bại", isLoading: false });
      throw e;
    }
  },

  register: async ({ username, email, password, name, generatedPassword, ageCode, gender }) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.register({ username, email, password, name, generatedPassword, ageCode, gender });
      saveAuth({ token, user });
      set({ user, token, isLoading: false });
      syncKidFromAccount(user);
      bindSocket(token);
      syncDeviceToken();
      return user;
    } catch (e) {
      set({ error: e.message || "Đăng ký thất bại", isLoading: false });
      throw e;
    }
  },

  /** Điền vài trường vào hồ sơ đang cache (sau khi PUT /auth/me thành công). */
  patchUser: (patch) => {
    const { user } = get();
    if (!user) return;
    const next = { ...user, ...patch };
    set({ user: next });
    saveAuth({ token: get().token, user: next });
  },

  logout: async () => {
    /* Dọn token push là việc PHỤ: request cần JWT nên phải phát trước khi xoá,
     * nhưng tuyệt đối không chờ — `requestNotificationPermission()` await cả
     * `Notification.requestPermission()` lẫn `serviceWorker.ready`, mà hai cái
     * đó có thể treo vĩnh viễn → bấm "Đăng xuất" màn hình đứng yên, vẫn còn
     * tên người dùng. */
    removePushToken();

    // §7.8: backend phải thu hồi refresh token + xoá cookie, nếu không trình
     // duyệt vẫn còn một cookie đổi được access token mới sau khi "đăng xuất".
    // Không await: endpoint chết/mạng chậm thì UI vẫn phải đóng phiên ngay.
    const revoking = authService.logout();

    clearAuth();
    set({ user: null, token: null, error: null });
    try { socket.disconnect(); } catch { /* socket chưa kịp nối — coi như xong */ }
    await Promise.race([revoking, new Promise((r) => setTimeout(r, 3000))]).catch(() => {});
  },

  clearError: () => set({ error: null }),

  getSenderId: () => {
    const { user } = get();
    return user ? user.id : null;
  },

  getDisplayName: () => {
    const { user } = get();
    return user ? user.name : null;
  },
}));
