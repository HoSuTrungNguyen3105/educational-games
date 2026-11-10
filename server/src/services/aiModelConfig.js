// services/aiModelConfig.js
//
// Chọn MODEL AI từ trang Cài đặt quản trị (Nguyên yêu cầu 2026-11-10): danh
// sách model cấu hình sẵn, model đang dùng lưu ở system_config (khoá
// `ai.model`) — admin đổi ở dashboard là backend dùng ngay, KHÔNG cần sửa
// biến môi trường hay deploy lại (khác hẳn GROQ_MODEL vốn là giá trị khởi
// động).
//
// Nguyên tắc:
//  - Chỉ các model trong GROQ_MODELS mới được chọn/lưu (whitelist ở
//    systemConfigService ép kiểu về giá trị hợp lệ gần nhất).
//  - Model HIỆU LỰC = giá trị admin đã chọn trong DB; CHƯA chọn (rỗng) thì
//    dùng GROQ_MODEL của env như trước — hành vi mặc định không đổi.
//  - Chỉ áp dụng cho đường Groq: Ollama Cloud / AI Service vẫn dùng model
//    của env như cũ (trang Cài đặt ghi rõ điều này).

import { config } from "../config.js";
import { get as getConfigValue } from "./systemConfigService.js";

/**
 * Danh sách model cho admin chọn. Ba model đều thuộc gói miễn phí của Groq
 * (mỗi model một bể hạn mức riêng: 30 lượt/phút, 1.000 lượt/ngày, 200K
 * token/ngày) nên đổi model cũng là cách nới hạn mức trong ngày.
 * `limits` là số liệu free tier CÔNG KHAI tại console.groq.com/docs/rate-limits
 * (kiểm chứng 2026-11-10) — chỉ để hiển thị cho admin, không dùng để tính toán.
 */
export const GROQ_MODELS = [
  {
    id: "openai/gpt-oss-20b",
    label: "GPT-OSS 20B",
    note: "Đang dùng mặc định — nhanh, nhẹ, đủ cho chat và sinh câu hỏi.",
    limits: "30 lượt/phút · 1.000 lượt/ngày · 200K token/ngày",
  },
  {
    id: "openai/gpt-oss-120b",
    label: "GPT-OSS 120B",
    note: "Bản lớn hơn — trả lời sâu hơn, chậm hơn một chút.",
    limits: "30 lượt/phút · 1.000 lượt/ngày · 200K token/ngày",
  },
  {
    id: "qwen/qwen3.8-27b",
    label: "Qwen 3.8 27B",
    note: "Lựa chọn khác hãng — tiếng Việt tốt. (Model xem trước: Groq có thể ngừng không báo trước.)",
    limits: "30 lượt/phút · 1.000 lượt/ngày · 200K token/ngày",
  },
];

/** true nếu id nằm trong danh sách được phép chọn. */
export function isGroqModelAllowed(id) {
  return GROQ_MODELS.some((m) => m.id === id);
}

/** Bản sao danh sách model — dùng khi gắn vào cấu hình trả cho frontend. */
export function getGroqModelOptions() {
  return GROQ_MODELS.map((m) => ({ ...m }));
}

/**
 * Model Groq HIỆU LỰC cho lượt gọi sắp tới: ưu tiên lựa chọn của admin trong
 * DB; chưa chọn hoặc giá trị lạ thì quay về GROQ_MODEL (env). Đọc thẳng
 * system_config ở MỖI lượt gọi (bỏ qua bộ nhớ đệm 10 giây của cấu hình
 * chung) để admin bấm lưu là lượt gọi kế tiếp dùng model mới ngay.
 */
export async function getEffectiveGroqModel() {
  let chosen = "";
  try {
    chosen = String((await getConfigValue("ai.model", { fresh: true })) || "").trim();
  } catch {
    chosen = ""; // đọc cấu hình lỗi → dùng env, AI vẫn chạy
  }
  if (chosen && isGroqModelAllowed(chosen)) return chosen;
  return config.groq.model;
}
