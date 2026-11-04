// hooks/useAiAvailability.js
//
// "AI có dùng được không?" — một nguồn sự thật duy nhất cho MỌI tính năng AI
// (trợ lý chat, giải thích câu sai, sinh câu hỏi, phân tích học tập, trang quản trị).
//
// QUAN TRỌNG: hook này KHÔNG TỰ gọi API.
//  - Không ping lúc mount, không polling. Trạng thái ban đầu là "chưa biết".
//  - Chỉ có hai đường để biết: (1) response thật của một request AI mà CHÍNH người dùng
//    bấm gửi, (2) `refreshAiAvailability()` khi ai đó bấm nút kiểm tra tường minh.
//  - Vì vậy Backend API (và xa hơn Ollama/model) chỉ nhận request khi người dùng thật sự
//    nhập và bấm gửi trên web.
//
// Nguồn dữ liệu khi có: `GET /api/ai/health` của Backend chính
//   featureEnabled → quản trị đã bật `system_config.ai.enabled` chưa
//   available      → đã bật VÀ AI Service + model sẵn sàng
// Server chưa bật thì ở đây báo "đang được cấu hình, chưa sử dụng được".

import { useSyncExternalStore } from "react";
import { ping } from "../services/aiApi.js";

/**
 * Câu chuẩn cho từng trạng thái. Server cũng có `notice`, nhưng ở đây dùng chuỗi nội bộ
 * để chắc chắn không chi tiết kỹ thuật nào (tên model, HTTP code, địa chỉ service) lọt vào
 * màn hình học sinh; bốn tính năng AI vì vậy hiện đúng một câu như nhau.
 */
export const AI_CONFIG_NOTICE = "Trợ lý AI đang được cấu hình, chưa sử dụng được.";
const AI_OFFLINE_NOTICE = "Dịch vụ AI tạm thời không khả dụng. Bạn vẫn học và chơi game bình thường.";
const CONFIG_HINT = "Quản trị viên sẽ bật khi máy chủ AI hoàn tất cấu hình.";
const OFFLINE_HINT = "Hãy thử lại sau một lát.";

/** "Chưa biết" = chưa từng có response nào. KHÔNG phải là "AI hỏng". */
const UNKNOWN = {
  known: false,
  state: "unknown",
  ready: false,
  online: true,
  featureEnabled: null,
  notice: null,
  hint: null,
  detail: null,
  model: null,
  provider: null,
  at: 0,
};

let snapshot = UNKNOWN;
const listeners = new Set();

function apply(next) {
  snapshot = { ...next, at: Date.now() };
  for (const l of listeners) l();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Đọc trạng thái hiện tại cho code ngoài React (component thường, không cần hook). */
export function getAiAvailability() {
  return snapshot;
}

/** Chuẩn hoá payload health / response thật thành trạng thái UI. Không ném lỗi với payload lạ. */
function fromHealth(h) {
  // Server cũ không có `available`/`featureEnabled`: coi như được bật để không chặn oan,
  // khi đó chỉ còn dựa vào `status` thật của AI Service.
  const featureEnabled = h?.featureEnabled !== false;
  const ready = h?.available === true || (featureEnabled && h?.status === true);
  const state = ready ? "ready" : featureEnabled === false ? "configuring" : "unavailable";
  apply({
    known: true,
    state,
    ready,
    online: h?.online === true,
    featureEnabled,
    notice: ready ? null : state === "configuring" ? AI_CONFIG_NOTICE : AI_OFFLINE_NOTICE,
    // `detail` của server là thông tin kỹ thuật, chỉ trang Cài đặt quản trị dùng —
    // không bao giờ đi vào thông báo học sinh thấy.
    hint: ready ? null : state === "configuring" ? CONFIG_HINT : OFFLINE_HINT,
    detail: h?.detail ?? null,
    model: h?.model ?? null,
    provider: h?.provider ?? null,
  });
  return snapshot;
}

/**
 * Một request AI vừa thành công → tính năng chắc chắn đang dùng được.
 * Đây là cách "khám phá" trạng thái ưu tiên: không cần gọi thêm endpoint nào.
 */
export function markAiReady({ model = null, provider = null } = {}) {
  if (snapshot.ready && (!model || snapshot.model === model)) return snapshot;
  apply({
    known: true, state: "ready", ready: true, online: true, featureEnabled: true,
    notice: null, hint: null, detail: null,
    model: model ?? snapshot.model, provider: provider ?? snapshot.provider,
  });
  return snapshot;
}

/**
 * Một request AI vừa thất bại vì cổng tính năng / dịch vụ chưa sẵn sàng.
 * Nhận đúng `AiServiceError` từ services/aiApi.js (có `status`) hoặc payload health.
 */
export function markAiFailed(errOrPayload) {
  const e = errOrPayload || {};
  const text = String(e.message || e.notice || e.detail || "");
  // Backend chặn bằng cờ system_config → 503 kèm "đang được cấu hình, chưa sử dụng được".
  const configuring = e.status === 503 && /đang được cấu hình|chưa sử dụng được/i.test(text);
  // 400/401/403/404/429 là quyền hạn, dữ liệu và tốc độ gọi — KHÔNG phải "AI chưa bật".
  // Timeout/huỷ request cũng vậy: model đang chạy chậm chứ tính năng vẫn bật, nếu đổi
  // trạng thái thì cả bốn panel sẽ hoá "không khả dụng" chỉ vì một câu trả lời lâu.
  if ([400, 401, 403, 404, 429].includes(e.status)) return snapshot;
  if (!configuring && (e.kind === "timeout" || e.name === "AbortError" || e.code === "ABORT_ERR")) {
    return snapshot;
  }
  apply({
    known: true,
    state: configuring ? "configuring" : "unavailable",
    ready: false,
    // Mất mạng thì backend không trả lời được: coi như offline, không đổ cho AI.
    online: e.kind !== "offline",
    featureEnabled: configuring ? false : snapshot.featureEnabled,
    notice: configuring ? AI_CONFIG_NOTICE : AI_OFFLINE_NOTICE,
    hint: configuring ? CONFIG_HINT : OFFLINE_HINT,
    detail: configuring ? null : text || null,
    model: snapshot.model,
    provider: snapshot.provider,
  });
  return snapshot;
}

/**
 * Hỏi Backend xem AI tới đâu. CHỈ gọi từ thao tác tường minh (nút Kiểm tra lại),
 * không gọi tự động — model chỉ nên được chạm tới khi người dùng thật sự cần.
 */
export async function refreshAiAvailability() {
  try {
    return fromHealth(await ping());
  } catch {
    // `ping()` đã tự bắt lỗi; lưới an toàn cho lỗi bất ngờ.
    apply({ ...UNKNOWN, known: true, state: "unavailable", online: false,
      notice: AI_OFFLINE_NOTICE, hint: OFFLINE_HINT });
    return snapshot;
  }
}

/**
 * Xoá trạng thái — trang quản trị gọi sau khi bật/tắt công tắc AI.
 * Các panel quay về "chưa biết": không hiện "đang được cấu hình" nữa, và cũng không
 * tự gọi API; trạng thái mới hiện ra ở thao tác tiếp theo của người dùng.
 */
export function invalidateAiAvailability() {
  snapshot = UNKNOWN;
  for (const l of listeners) l();
}

/**
 * Hook đọc trạng thái chia sẻ. Không gây ra request mạng nào.
 * @returns {{known:boolean, state:string, ready:boolean, notice:string|null,
 *            hint:string|null, detail:string|null, model:string|null,
 *            provider:string|null, showNotice:boolean, refresh:Function}}
 */
export function useAiAvailability() {
  const value = useSyncExternalStore(subscribe, getAiAvailability, getAiAvailability);
  return {
    ...value,
    // Chỉ hiện lời nhắc khi ĐÃ biết chắc (một request thật vừa trả lời). Chưa biết thì
    // để nguyên giao diện — panel vừa mở đã báo "chưa sử dụng được" là nói sai.
    showNotice: value.known && !value.ready,
    refresh: refreshAiAvailability,
  };
}
