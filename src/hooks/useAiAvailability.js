// hooks/useAiAvailability.js
//
// "AI có dùng được không?" — một nguồn sự thật duy nhất cho MỌI tính năng AI
// (trợ lý chat, giải thích câu sai, sinh câu hỏi, phân tích học tập, trang quản trị).
//
// Số liệu lấy từ `GET /api/ai/health` của Backend chính:
//   featureEnabled → quản trị đã bật `system_config.ai.enabled` chưa
//   available      → đã bật VÀ AI Service + model sẵn sàng
// Frontend không tự đoán, không hard-code trạng thái: server chưa bật là ở đây báo
// "đang cấu hình, chưa sử dụng được".
//
// Kết quả cache 30 giây và gộp request đang chờ: năm component cùng mount chỉ ping
// một lần, không dồn tải cho server mỗi lần mở game.

import { useCallback, useEffect, useState } from "react";
import { ping } from "../services/aiApi.js";

const TTL_MS = 30_000;

/** Câu chuẩn khi AI chưa bật — server trả `notice` thì dùng của server, đây là dự phòng. */
export const AI_CONFIG_NOTICE = "Trợ lý AI đang được cấu hình, chưa sử dụng được.";
const AI_OFFLINE_NOTICE = "Dịch vụ AI tạm thời không khả dụng. Bạn vẫn học và chơi game bình thường.";

let cache = null;     // { at, value }
let pending = null;   // Promise chung để các component không gọi trùng
// Tăng mỗi lần admin bật/tắt AI: kết quả ping cũ đang bay về sẽ bị bỏ, không ghi đè cache mới.
let generation = 0;

/** Chuẩn hoá phản hồi health thành trạng thái UI. Không ném lỗi với payload lạ. */
function normalize(h) {
  const online = h?.online === true;
  // Server cũ không có `available`/`featureEnabled`: coi như được bật để không chặn oan,
  // khi đó chỉ còn dựa vào `status` thật của AI Service.
  const featureEnabled = h?.featureEnabled !== false;
  const ready = h?.available === true || (featureEnabled && h?.status === true);

  const state = ready
    ? "ready"
    : h?.featureEnabled === false ? "configuring" : "unavailable";
  return {
    state,
    ready,
    online,
    featureEnabled,
    notice: ready
      ? null
      : h?.notice || (state === "configuring" ? AI_CONFIG_NOTICE : AI_OFFLINE_NOTICE),
    hint: ready
      ? null
      : h?.detail || (state === "configuring"
        ? "Quản trị viên sẽ bật khi máy chủ AI hoàn tất cấu hình."
        : "Hãy thử lại sau một lát."),
    model: h?.model ?? null,
    provider: h?.provider ?? null,
    checkedAt: Date.now(),
  };
}

const OFFLINE = normalize({ online: false });

/** Đọc trạng thái AI (có cache). `force = true` bỏ qua cache — dùng cho nút tải lại. */
export async function fetchAiAvailability(force = false) {
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.value;
  if (pending) return pending;

  pending = (async () => {
    const gen = generation;
    let value;
    try {
      value = normalize(await ping());
    } catch {
      // `ping()` đã tự bắt lỗi; đây chỉ là lưới an toàn cho lỗi bất ngờ.
      value = OFFLINE;
    }
    // Admin vừa bật/tắt công tắc khi request còn đang bay → bỏ kết quả cũ, đừng ghi nó
    // vào cache 30 giây; lần gọi kế tiếp sẽ đọc lại trạng thái mới.
    if (gen === generation) cache = { at: Date.now(), value };
    pending = null;
    return value;
  })();
  return pending;
}

/** Xóa cache — trang quản trị gọi sau khi bật/tắt công tắc AI để UI đổi ngay. */
export function invalidateAiAvailability() {
  cache = null;
  generation += 1;
}

/**
 * @param {boolean} [active]  mặc định true; truyền false để không ping (component đang ẩn)
 * @returns {{state:string, ready:boolean, notice:string|null, hint:string|null,
 *            showNotice:boolean, model:string|null, provider:string|null,
 *            loading:boolean, refresh:Function}}
 */
export function useAiAvailability(active = true) {
  const [value, setValue] = useState(() => cache?.value || OFFLINE);
  const [loading, setLoading] = useState(!cache);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    try {
      setValue(await fetchAiAvailability(force));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    let alive = true;
    (async () => {
      const next = await fetchAiAvailability();
      if (alive) { setValue(next); setLoading(false); }
    })();
    return () => { alive = false; };
  }, [active]);

  return {
    ...value,
    // Chi hiện lời nhắc khi ĐÃ có kết quả thật: đang ping thì để nguyên giao diện,
    // nếu không panel vừa mở đã loé "chưa sử dụng được" rồi lại biến mất.
    showNotice: !value.ready && !loading && (active || Boolean(cache)),
    loading,
    refresh: () => load(true),
  };
}
