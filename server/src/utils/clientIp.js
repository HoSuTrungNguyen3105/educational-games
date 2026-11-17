// utils/clientIp.js — đọc IP thật của client từ X-Forwarded-For (nhãn đầu),
// fallback sang req.ip / socket.remoteAddress; cắt 64 ký tự. Dùng chung cho
// aiBackendService và aiDirectService (trước đây mỗi file có bản sao local).

/** @param {import("express").Request} req @returns {string} */
export function clientIp(req) {
  const fwd = req?.headers?.["x-forwarded-for"];
  const raw = (typeof fwd === "string" && fwd) ? fwd.split(",")[0].trim() : req?.ip || req?.socket?.remoteAddress;
  return raw ? String(raw).slice(0, 64) : "";
}
