import { io } from "socket.io-client";
import { API_BASE } from "../services/api.js";

// URL mặc định: lấy origin từ API_BASE (backend đã deploy) nếu chưa cấu hình VITE_SOCKET_URL
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_BASE.replace(/\/api\/?$/, "");

// Một instance Socket.IO duy nhất dùng chung toàn frontend.
// Không gọi io() trong component; connect/disconnect do app điều khiển.
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
