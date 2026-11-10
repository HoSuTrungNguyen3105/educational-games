// services/aiInferenceStatus.js
//
// Tín hiệu "lượt gọi MODEL thật gần nhất" cho health AI.
//
// Vấn đề nó giải quyết (sự cố 2026-11-10): health chỉ probe /api/tags (metadata)
// nên key Ollama hết quota vẫn báo "sẵn sàng" trong khi MỌI lượt gọi model đều
// bị provider từ chối 429. Module này ghi lại kết quả các lượt gọi model THẬT
// mà gateway đã phục vụ (trong bộ nhớ, chỉ kết quả + mã provider + thời điểm —
// KHÔNG lưu nội dung hội thoại), để `GET /api/ai/health` phản ánh đúng sức
// khoẻ suy luận mà KHÔNG tốn thêm lượt gọi/quota nào cho việc probe.
//
// Trạng thái suy ra:
//   "unknown"  chưa có lượt gọi model nào từ lúc server khởi động.
//   "ok"       lượt gọi gần nhất thành công.
//   "degraded" lượt gọi gần nhất thất bại (kèm lastErrorCode = mã HTTP provider).

let lastSuccessAt = null; // ISO string
let lastErrorAt = null; // ISO string
let lastErrorCode = null; // mã HTTP của provider ở lượt lỗi gần nhất (null nếu lỗi không có mã, vd timeout)

export function recordAiInferenceSuccess(at = new Date()) {
  lastSuccessAt = at.toISOString();
}

export function recordAiInferenceError({ providerStatus = null } = {}, at = new Date()) {
  lastErrorAt = at.toISOString();
  lastErrorCode = providerStatus;
}

/** Shape đưa vào health: { status, lastErrorCode, lastErrorAt, lastSuccessAt }. */
export function getAiInferenceStatus() {
  let status = "unknown";
  if (lastSuccessAt || lastErrorAt) {
    status = lastErrorAt && (!lastSuccessAt || lastErrorAt > lastSuccessAt) ? "degraded" : "ok";
  }
  return { status, lastErrorCode, lastErrorAt, lastSuccessAt };
}

/** Chỉ dùng cho test: đưa bộ nhớ về trạng thái mới khởi động. */
export function resetAiInferenceStatus() {
  lastSuccessAt = null;
  lastErrorAt = null;
  lastErrorCode = null;
}
