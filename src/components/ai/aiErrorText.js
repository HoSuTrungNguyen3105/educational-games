// components/ai/aiErrorText.js
//
// Ánh xạ lỗi của AI Service sang thông điệp tiếng Việt.
//
// Tách riêng khỏi component để giữ đúng quy ước react-refresh (một file chỉ export
// component) và để mọi panel dùng chung một bảng tra cứu lỗi.

/**
 * @param {Error & { kind?: string }} e  lỗi từ aiApi.js
 * @returns {string} thông báo an toàn để hiển thị
 */
export function aiErrorText(e) {
  switch (e?.kind) {
    case "offline":
    case "timeout":
    case "auth":
    case "forbidden":
    case "rateLimit":
    case "badResponse":
    case "server":
    case "badRequest":
      // AI Service đã chuẩn hoá sẵn thông báo thân thiện theo mã HTTP.
      return e.message;
    default:
      return e?.message || "Không kết nối được trợ lý AI.";
  }
}

/** Gợi ý bổ sung cho trường hợp dịch vụ AI không sẵn sàng (hiển thị dạng chữ nhỏ). */
export function aiErrorHint(e) {
  if (e?.kind === "offline") {
    return "Kiểm tra kết nối máy chủ rồi thử lại. Nếu vẫn lỗi, hãy liên hệ quản trị viên.";
  }
  if (e?.kind === "server") {
    return "Dịch vụ AI có thể đang tạm thời không khả dụng. Bạn vẫn chơi game bình thường nhé.";
  }
  return null;
}