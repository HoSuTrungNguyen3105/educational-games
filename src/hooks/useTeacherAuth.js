import { useEffect, useState, useCallback } from "react";
import { loadAuth, saveAuth, clearAuth } from "../services/api.js";
import { socket } from "../socket/socket.js";

const AUTH_KEY = "edu_games_auth";

/**
 * Quản lý auth cho teacher/admin.
 * - Tự load từ localStorage khi mount
 * - Lắng nghe edu-auth-expired event
 * - Cung cấp login/logout
 */
export function useTeacherAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const auth = loadAuth();
    if (auth?.token && auth.user && (auth.user.role === "teacher" || auth.user.role === "admin")) {
      setUser(auth.user);
      setToken(auth.token);
      socket.auth = { token: auth.token };
      if (!socket.connected) socket.connect();
    }

    const onExpired = () => {
      setUser(null);
      setToken(null);
      socket.disconnect();
    };
    window.addEventListener("edu-auth-expired", onExpired);
    return () => window.removeEventListener("edu-auth-expired", onExpired);
  }, []);

  const login = useCallback((userData, tokenStr) => {
    saveAuth({ token: tokenStr, user: userData });
    setUser(userData);
    setToken(tokenStr);
    socket.auth = { token: tokenStr };
    if (!socket.connected) socket.connect();
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setToken(null);
    socket.disconnect();
  }, []);

  return { user, token, login, logout };
}
