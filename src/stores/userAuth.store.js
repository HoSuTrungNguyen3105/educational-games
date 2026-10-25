import { create } from "zustand";
import { authService, notificationService, loadAuth, saveAuth, clearAuth } from "../services/api.js";
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

export const useUserAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  init: () => {
    const auth = loadAuth();
    if (auth && auth.token && auth.user) {
      set({ user: auth.user, token: auth.token });
      syncKidFromAccount(auth.user);
      socket.auth = { token: auth.token };
      if (!socket.connected) socket.connect();
      syncDeviceToken();
    }
  },

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login(identifier, password);
      saveAuth({ token, user });
      set({ user, token, isLoading: false });
      syncKidFromAccount(user);
      socket.auth = { token };
      if (!socket.connected) socket.connect();
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
      socket.auth = { token };
      if (!socket.connected) socket.connect();
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
    clearAuth();
    set({ user: null, token: null, error: null });
    try { socket.disconnect(); } catch { /* socket chưa kịp nối — coi như xong */ }
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
