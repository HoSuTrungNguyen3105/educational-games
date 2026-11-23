import { useEffect } from "react";
import { socket } from "../socket/socket.js";
import { registerSocketListeners } from "../socket/socket.listeners.js";
import { startWarmup } from "../services/warmup.js";
import { bindPresenceListeners } from "../stores/presence.store.js";

/**
 * Quản lý socket connection lifecycle.
 * - Register global listeners một lần (+ listener hiện diện online)
 * - Warmup backend một lần
 * - Connect socket khi user đăng nhập (auth qua HttpOnly cookie)
 * - Disconnect khi đăng xuất
 */
export function useSocketManager(isAuthenticated) {
  // Register global listeners + warmup (chỉ 1 lần)
  useEffect(() => {
    startWarmup();
    bindPresenceListeners();
    const cleanup = registerSocketListeners();
    return cleanup;
  }, []);

  // Manage socket connection based on auth state
  useEffect(() => {
    if (isAuthenticated) {
      // With BFF, auth is via HttpOnly cookie, no need to set socket.auth
      if (!socket.connected) socket.connect();
    } else if (socket.connected) {
      socket.disconnect();
    }
  }, [isAuthenticated]);
}