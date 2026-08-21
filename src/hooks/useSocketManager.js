import { useEffect } from "react";
import { socket } from "../socket/socket.js";
import { registerSocketListeners } from "../socket/socket.listeners.js";
import { startWarmup } from "../services/warmup.js";

/**
 * Quản lý socket connection lifecycle.
 * - Register global listeners một lần
 * - Warmup backend một lần
 * - Connect socket khi teacherToken hoặc userToken có giá trị
 * - Disconnect khi cả hai đều null
 */
export function useSocketManager(teacherToken, userToken) {
  // Register global listeners + warmup (chỉ 1 lần)
  useEffect(() => {
    startWarmup();
    const cleanup = registerSocketListeners();
    return cleanup;
  }, []);

  // Manage socket connection based on available tokens
  useEffect(() => {
    const token = teacherToken || userToken;
    if (token) {
      socket.auth = { token };
      if (!socket.connected) socket.connect();
    }
    // Không disconnect ở đây — để component tự gọi logout khi cần
  }, [teacherToken, userToken]);
}
