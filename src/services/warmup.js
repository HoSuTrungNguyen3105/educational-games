import { API_BASE } from "./api.js";

let started = false;

// Đánh thức backend (Render free-tier sẽ sleep sau ~15 phút không có request).
// Gọi 1 lần khi app mở + giữ ấm mỗi 8 phút khi tab đang hiển thị,
// để request thật của người dùng không phải chờ cold-start.
export function startWarmup() {
  if (started) return;
  started = true;

  const ping = () => {
    try {
      fetch(`${API_BASE}/health`, { cache: "no-store" }).catch(() => {});
    } catch { /* ignore */ }
  };

  ping();
  window.setInterval(() => {
    if (document.visibilityState === "visible") ping();
  }, 8 * 60 * 1000);
}