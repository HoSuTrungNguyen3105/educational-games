import { useEffect } from "react";
import { socket } from "../socket/socket.js";
import { registerSocketListeners } from "../socket/socket.listeners.js";
import { startWarmup } from "../services/warmup.js";
import { bindPresenceListeners } from "../stores/presence.store.js";

/**
 * Quản lý socket connection lifecycle.
 * - Register global listeners một lần (+ listener hiện diện online)
 * - Warmup backend một lần
 * - Connect socket khi teacherToken hoặc userToken có giá trị
 * - Disconnect khi cả hai đều null
 *
 * Vòng đời theo phiên đăng nhập được chia nhau giữa hook này và
 * userAuth.store (store gán socket.auth + connect ngay khi init/login/
 * register — gồm cả tài khoản tự tạo ở onboarding — và disconnect khi
 * logout/hết phiên). Hook này là lớp chốt ở tầng App: mất token (đăng
 * xuất) thì NGẮT socket tại đây luôn, để không phiên nào sống sót qua
 * đăng xuất chỉ vì đường đi không qua store.
 */
export function useSocketManager(teacherToken, userToken) {
  // Register global listeners + warmup (chỉ 1 lần)
  useEffect(() => {
    startWarmup();
    bindPresenceListeners();
    const cleanup = registerSocketListeners();
    return cleanup;
  }, []);

  // Manage socket connection based on available tokens
  useEffect(() => {
    const token = teacherToken || userToken;
    if (token) {
      socket.auth = { token };
      if (!socket.connected) socket.connect();
    } else if (socket.connected) {
      // Cả hai token đều mất (đăng xuất) → ngắt hẳn, đúng như header hứa.
      socket.disconnect();
    }
  }, [teacherToken, userToken]);
}
