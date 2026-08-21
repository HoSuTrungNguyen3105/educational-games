import { create } from "zustand";
import { authService } from "../services/api.js";
import { socket } from "../socket/socket.js";

const USER_AUTH_KEY = "edu_games_user_auth";

function loadUserAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(USER_AUTH_KEY));
    if (auth && auth.token) {
      const parts = String(auth.token).split(".");
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (payload && typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem(USER_AUTH_KEY);
            return null;
          }
        } catch { /* invalid token */ }
      }
    }
    return auth || null;
  } catch { return null; }
}

export const useUserAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  init: () => {
    const auth = loadUserAuth();
    if (auth && auth.token && auth.user) {
      set({ user: auth.user, token: auth.token });
      // Connect socket with user token
      socket.auth = { token: auth.token };
      if (!socket.connected) socket.connect();
    }
  },

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user } = await authService.login(identifier, password);
      // Chỉ lưu nếu là student (user auth)
      const userAuth = { token, user };
      localStorage.setItem(USER_AUTH_KEY, JSON.stringify(userAuth));
      set({ user, token, isLoading: false });
      socket.auth = { token };
      if (!socket.connected) socket.connect();
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
      const userAuth = { token, user };
      localStorage.setItem(USER_AUTH_KEY, JSON.stringify(userAuth));
      set({ user, token, isLoading: false });
      socket.auth = { token };
      if (!socket.connected) socket.connect();
      return user;
    } catch (e) {
      set({ error: e.message || "Đăng ký thất bại", isLoading: false });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem(USER_AUTH_KEY);
    set({ user: null, token: null, error: null });
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
