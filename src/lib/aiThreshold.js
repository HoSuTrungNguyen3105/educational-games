/**
 * aiThreshold.js — chuẩn hoá "ngưỡng điểm thấp" (cấu hình `ai.lowScoreThreshold`)
 * phía client, dùng cho ô nhập trong thẻ Trợ lý AI ở Cài đặt quản trị.
 *
 * Quy tắc (khớp coerce phía server trong systemConfigService):
 *   - trống / null / không phải số  → null  (nghĩa là CHƯA cấu hình — khi đó
 *     Trợ lý AI sẽ hỏi lại admin ngưỡng mỗi lần được hỏi về điểm thấp)
 *   - số hợp lệ                     → số nguyên kẹp trong khoảng 0–100
 *
 * Server vẫn là nơi chốt thật (nó tự kẹp lại khi lưu); hàm này chỉ để giao
 * diện không bao giờ gửi một con số vô lý lên.
 */
export function clampLowScoreThreshold(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(100, Math.max(0, Math.round(n)));
}
