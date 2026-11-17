// utils/httpError.js — Error gắn `status` để middleware lỗi trả đúng HTTP code.
// Trước đây reportService/parentService/scheduleService đều có bản sao local
// giống hệt nhau.

/** @param {string} message @param {number} status @returns {Error & { status: number }} */
export function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}
