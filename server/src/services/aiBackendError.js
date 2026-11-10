// services/aiBackendError.js
//
// Kiểu lỗi CHUNG cho mọi đường gọi AI (AI Service Java và Ollama trực tiếp).
// Tách file riêng để các service AI import mà không tạo vòng phụ thuộc về
// aiBackendService.js (nơi điều phối/chọn nhà cung cấp).
//
// `http_code` là mã route sẽ gửi cho client (đã nằm trong khoảng an toàn 400–599).
// Thông điệp luôn là tiếng Việt đã lọc — không kèm stack trace, URL nội bộ hay key.

export class AiBackendError extends Error {
  constructor(message, { httpCode = 502, kind = "upstream", cause, code = null, providerStatus = null, retryAfterSeconds = null } = {}) {
    super(message);
    this.name = "AiBackendError";
    this.http_code = httpCode;
    this.kind = kind; // config | offline | timeout | upstream | badResponse | rateLimited
    // `code` là mã lỗi máy đọc được (vd "AI_RATE_LIMITED") để route đưa vào
    // envelope cho frontend phân biệt — khác với `kind` chỉ dùng nội bộ server.
    this.code = code;
    // Mã HTTP NGUYÊN BẢN của provider (vd 429 của Ollama) — chỉ để chẩn đoán
    // (health inference + log), không lộ ra ngoài qua thông điệp.
    this.providerStatus = providerStatus;
    // Số giây provider gợi ý chờ trước khi thử lại (header Retry-After), nếu có.
    this.retryAfterSeconds = retryAfterSeconds;
    if (cause) this.cause = cause;
  }
}
