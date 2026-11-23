import { create } from "zustand";
import { authService, notificationService, checkAuth } from "../services/api.js";
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

/**
 * So sánh nông các field định danh/nội dung chính của user.
 * Giữ nguyên tham chiếu cũ khi nội dung không đổi; field nào khác thật (tên,
 * email, lớp, xu, bộ đồ…) thì mới thay.
 */
const USER_IDENTITY_FIELDS = [
  "id", "username", "name", "email", "role", "ageCode", "gender",
  "coins", "stars", "avatarLoadout", "avatar", "pet",
];
function sameUserIdentity(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  return USER_IDENTITY_FIELDS.every((f) => a[f] === b[f]);
}

/** Nối lại Socket.IO — với BFF, token nằm trong HttpOnly cookie, không cần truyền. */
function bindSocket() {
  try {
    if (!socket.connected) socket.connect();
  } catch { /* socket chưa sẵn sàng — request HTTP vẫn chạy */ }
}

let watchersBound = false;
function bindAuthWatchers(set, get) {
  if (watchersBound) return;
  watchersBound = true;

  // Listen for auth expiration event (dispatched by api.js on 401/refresh failure)
  window.addEventListener("edu-auth-expired", () => {
    set({ user: null, error: null });
    try { socket.disconnect(); } catch { /* ignore */ }
  });
}

export const useUserAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  init: async () => {
    bindAuthWatchers(set, get);

    // Check auth with BFF
    const user = await checkAuth();
    if (user) {
      set({ user });
      syncKidFromAccount(user);
      bindSocket();
      syncDeviceToken();
    }
  },

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.login(identifier, password);
      if (result?.user) {
        const user = result.user;
        set({ user, isLoading: false });
        syncKidFromAccount(user);
        bindSocket();
        syncDeviceToken();
        return user;
      }
      throw new Error("Đăng nhập thất bại");
    } catch (e) {
      set({ error: e.message || "Đăng nhập thất bại", isLoading: false });
      throw e;
    }
  },

  register: async ({ username, email, password, name, generatedPassword, ageCode, gender }) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.register({ username, email, password, name, generatedPassword, ageCode, gender });
      if (result?.user) {
        const user = result.user;
        set({ user, isLoading: false });
        syncKidFromAccount(user);
        bindSocket();
        syncDeviceToken();
        return user;
      }
      throw new Error("Đăng ký thất bại");
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
  },

  logout: async () => {
    // Dọn token push là việc PHỤ: request cần JWT nên phải phát trước khi xoá,
    // nhưng tuyệt đối không chờ — requestNotificationPermission() await cả
    // Notification.requestPermission() lẫn serviceWorker.ready, mà hai cái
    // đó có thể treo vĩnh viễn → bấm "Đăng xuất" màn hình đứng yên, vẫn còn
    // tên người dùng.
    removePushToken();

    // Backend BFF thu hồi session + xoá cookie
    const revoking = authService.logout();

    set({ user: null, error: null });
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