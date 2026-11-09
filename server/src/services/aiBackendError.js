// services/aiBackendError.js
//
// Kiểu lỗi CHUNG cho mọi đường gọi AI (AI Service Java và Ollama trực tiếp).
// Tách file riêng để các service AI import mà không tạo vòng phụ thuộc về
// aiBackendService.js (nơi điều phối/chọn nhà cung cấp).
//
// `http_code` là mã route sẽ gửi cho client (đã nằm trong khoảng an toàn 400–599).
// Thông điệp luôn là tiếng Việt đã lọc — không kèm stack trace, URL nội bộ hay key.

export class AiBackendError extends Error {
  constructor(message, { httpCode = 502, kind = "upstream", cause } = {}) {
    super(message);
    this.name = "AiBackendError";
    this.http_code = httpCode;
    this.kind = kind; // config | offline | timeout | upstream | badResponse
    if (cause) this.cause = cause;
  }
}
