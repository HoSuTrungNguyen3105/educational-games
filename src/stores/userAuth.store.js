import { create } from "zustand";
import { authService, notificationService, loadAuth, saveAuth, clearAuth } from "../services/api.js";
import { socket } from "../socket/socket.js";
import { requestNotificationPermission } from "../firebase/messaging.js";

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

export const useUserAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  init: () => {
    const auth = loadAuth();
    if (auth && auth.token && auth.user) {
      set({ user: auth.user, token: auth.token });
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
      socket.auth = { token };
      if (!socket.connected) socket.connect();
      syncDeviceToken();
      return user;
    } catch (e) {
      set({ error: e.message || "Đăng nhập thất bại", isLoading: false });
      throw e;
    }
  },

  register: async ({ username, email, password, name }) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.register({ username, email, password, name });
      saveAuth({ token, user });
      set({ user, token, isLoading: false });
      socket.auth = { token };
      if (!socket.connected) socket.connect();
      syncDeviceToken();
      return user;
    } catch (e) {
      set({ error: e.message || "Đăng ký thất bại", isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    // Unregister this device's push token BEFORE clearing auth (API needs the JWT).
    try {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const token = await requestNotificationPermission();
        if (token) await notificationService.removeDevice(token);
      }
    } catch { /* best-effort */ }
    clearAuth();
    set({ user: null, token: null, error: null });
    socket.disconnect();
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
