// services/systemConfigService.js
//
// Cấu hình CHUNG của hệ thống EduPlay — lưu ở MongoDB (collection `system_config`)
// để mọi thiết bị dùng chung, KHÔNG nằm trong localStorage của trình duyệt.
//
// Chỉ đúng những khoá nằm trong DEFAULTS mới được phép ghi (whitelist), để trang
// Cài đặt không thể nhét tuỳ tiện field lạ vào DB.
//
// Secret key / chuỗi kết nối (SUPABASE_SECRET_KEY, MONGODB_URI, JWT_SECRET…)
// cố ý KHÔNG nằm ở đây: chúng thuộc về biến môi trường của server và không bao
// giờ được đưa qua API ra frontend.

import { getCollection } from "../db.js";
import { config } from "../config.js";
// Chỉ import HÀM kiểm tra (không import GROQ_MODELS): aiModelConfig import
// ngược `get` từ file này, và DEFAULTS ở đây chạy lúc nạp module — nếu
// DEFAULTS tham chiếu trực tiếp GROQ_MODELS sẽ thành vòng lặp khởi tạo
// (TDZ). Danh sách model cho frontend đi qua hàm getGroqModelOptions().
import { getGroqModelOptions, isGroqModelAllowed } from "./aiModelConfig.js";

const COLLECTION = "system_config";
const DOC_KEY = "global";

/** Giá trị mặc định — cũng là danh sách khoá hợp lệ duy nhất. */
export const DEFAULTS = {
  site: {
    // Để trống nghĩa là "admin chưa cấu hình" → frontend giữ nguyên thương hiệu
    // đang có trong mã (title trong index.html, chữ "Lớp Học Vui" ở trang chủ).
    // Không đặt sẵn "EduPlay" vì app sẽ đổi tên tab/đầu trang ngay lần chạy đầu.
    name: "",
    logoUrl: "",
    faviconUrl: "",
    supportContact: "",
  },
  maintenance: {
    enabled: false,
    message: "",
    until: "",
  },
  // Mỗi cờ ở đây đều đang thật sự chặn một luồng thông báo (xem `isOn`):
  //  push               → gửi FCM trong notificationService.createNotification
  //  realtime           → emit socket `notification:new`
  //  assignments        → thông báo "bài tập mới" khi giáo viên giao bài
  //  deadlineReminders  → job nhắc hạn nộp chạy định kỳ trong app.js
  notifications: {
    push: true,
    realtime: true,
    assignments: true,
    deadlineReminders: true,
  },
  // Trợ lý AI — mặc định TẮT vì AI Service + Ollama đang được cấu hình và chỉ chạy
  // trên máy local (Render không có nơi chạy model).
  //   false → mọi endpoint /api/ai/* trả 503 kèm "đang được cấu hình, chưa sử dụng được",
  //           frontend hiển thị cùng một thông báo ở mọi tính năng AI, không gọi sang
  //           AI Service (kể cả khi nó đang bật).
  //   true  → routes/ai.js mới chuyển request xuống AI Service.
  // Đây là cờ nghiệp vụ, KHÔNG phải secret: secret (AI_BACKEND_TOKEN, OLLAMA_KEY)
  // vẫn chỉ nằm trong biến môi trường.
  ai: {
    enabled: false,
    // Model AI do ADMIN chọn ở trang Cài đặt (chỉ áp dụng đường Groq).
    // Rỗng = chưa chọn → backend dùng GROQ_MODEL của biến môi trường.
    // Chỉ nhận đúng các id trong GROQ_MODELS (xem aiModelConfig.js) — ép
    // kiểu ở coerce() bên dưới, giá trị lạ bị đưa về "".
    model: "",
  },
};

/** Đọc 1 khoá theo đường dẫn "a.b" từ object. */
function pick(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Ghi 1 khoá theo đường dẫn "a.b" vào bản sao object. */
function project(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof cur[keys[i]] !== "object" || cur[keys[i]] === null) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

const clone = (o) => JSON.parse(JSON.stringify(o));

/** Đường dẫn khoá hợp lệ = mọi lá của DEFAULTS. */
const LEAF_PATHS = (() => {
  const out = [];
  const walk = (obj, prefix) => {
    for (const [k, v] of Object.entries(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      // Mảng trong DEFAULTS (ai.modelOptions) là HẰNG SỐ hiển thị phía
      // server, KHÔNG phải khoá ghi được — loại khỏi danh sách lá để client
      // không ghi đè được qua API cấu hình.
      if (Array.isArray(v)) continue;
      if (v && typeof v === "object") walk(v, p);
      else out.push(p);
    }
  };
  walk(DEFAULTS, "");
  return out;
})();

/** Ép kiểu theo giá trị mặc định — boolean/string, chuỗi bị cắt theo trần an toàn. */
function coerce(path, value) {
  // Model AI: CHỈ nhận đúng id trong danh sách cấu hình sẵn (aiModelConfig)
  // hoặc rỗng (= dùng GROQ_MODEL của env). Giá trị lạ → "" để không ai nhét
  // được tên model tuỳ ý qua API cấu hình.
  if (path === "ai.model") {
    const s = value == null ? "" : String(value).trim();
    return s === "" || isGroqModelAllowed(s) ? s : "";
  }
  const def = pick(DEFAULTS, path);
  if (typeof def === "boolean") {
    if (value === true || value === "true" || value === 1) return true;
    if (value === false || value === "false" || value === 0 || value == null || value === "") return false;
    return Boolean(value);
  }
  if (typeof def === "string") {
    const s = value == null ? "" : String(value).trim();
    // Logo/favicon là link ảnh (data-URL đã đổi thành URL Supabase trước khi tới đây).
    const max = path.endsWith("Url") ? 500 : path === "maintenance.message" ? 300 : 120;
    return s.slice(0, max);
  }
  return value;
}

/**
 * Trộn patch của client vào cấu hình hiện hành.
 * Field không nằm trong whitelist bị bỏ qua (không ném lỗi để form cũ không chết).
 * @returns {{ next: object, changed: string[], ignored: string[] }}
 */
export function mergeConfig(current, patch = {}) {
  const next = clone(current);
  const changed = [];
  const ignored = [];
  for (const [group, values] of Object.entries(patch || {})) {
    if (values && typeof values === "object" && !Array.isArray(values)) {
      for (const [key, value] of Object.entries(values)) {
        const path = `${group}.${key}`;
        if (!LEAF_PATHS.includes(path)) { ignored.push(path); continue; }
        const v = coerce(path, value);
        if (pick(next, path) !== v) {
          project(next, path, v);
          changed.push(path);
        }
      }
    } else {
      // Cho phép ghi kiểu phẳng: { "maintenance.enabled": true }
      if (!LEAF_PATHS.includes(group)) { ignored.push(group); continue; }
      const v = coerce(group, values);
      if (pick(next, group) !== v) {
        project(next, group, v);
        changed.push(group);
      }
    }
  }
  return { next, changed, ignored };
}

// ── Cache in-memory ───────────────────────────────────────────────────────
// createNotification() gọi isOn() mỗi lần có thông báo → không được phép chạm
// DB liên tục. TTL ngắn nên đổi cấu hình có hiệu lực gần như ngay.
const CACHE_TTL_MS = 10_000;
let cache = null;       // { doc, at }
let cacheAt = 0;

export async function getConfig({ fresh = false } = {}) {
  if (!fresh && cache && Date.now() - cacheAt < CACHE_TTL_MS) return clone(cache);
  let doc = null;
  try {
    const found = await getCollection(COLLECTION).findOne({ key: DOC_KEY });
    if (found) doc = found;
  } catch (e) {
    // DB lỗi → dùng mặc định, trang Cài đặt vẫn mở được để báo tình trạng hệ thống.
    console.warn("[systemConfig] Không đọc được cấu hình:", e.message);
  }
  const merged = { ...clone(DEFAULTS), ...(doc || {}) };
  for (const p of LEAF_PATHS) {
    if (pick(merged, p) === undefined) project(merged, p, pick(DEFAULTS, p));
  }
  // Danh sách model AI là hằng số phía server (aiModelConfig.js) — gắn vào
  // bản trả về để trang Cài đặt hiển thị, KHÔNG lấy từ DB và KHÔNG ghi được
  // qua API (không nằm trong LEAF_PATHS, xem khai báo ở đầu file).
  merged.ai = { ...(merged.ai || {}), modelOptions: getGroqModelOptions() };
  cache = merged;
  cacheAt = Date.now();
  return clone(merged);
}

/**
 * Giá trị của 1 khoá cấu hình (đường dẫn "a.b").
 * `fresh: true` = bỏ qua bộ nhớ đệm, đọc thẳng DB — dùng cho các giá trị
 * phải có hiệu lực NGAY khi admin lưu (hiện tại: ai.model, xem
 * aiModelConfig.getEffectiveGroqModel).
 */
export async function get(path, { fresh = false } = {}) {
  return pick(await getConfig({ fresh }), path);
}

/** Cờ bật/tắt — dùng cho các luồng thông báo. */
export async function isOn(path) {
  return (await get(path)) === true;
}

/** Ghi cấu hình. Trả về cấu hình mới + danh sách khoá thay đổi. */
export async function updateConfig(patch, actor = null) {
  const current = await getConfig();
  const { next, changed, ignored } = mergeConfig(current, patch);
  if (!changed.length) return { config: next, changed, ignored, updated: false };

  const doc = {
    key: DOC_KEY,
    site: next.site,
    maintenance: next.maintenance,
    notifications: next.notifications,
    // Chỉ ghi các khoá ai THẬT xuống DB — modelOptions là hằng số hiển thị,
    // không phải dữ liệu cấu hình.
    ai: { enabled: next.ai.enabled, model: next.ai.model },
    updatedAt: new Date().toISOString(),
    updatedBy: actor ? { id: actor.sub || null, name: actor.name || null, role: actor.role || null } : null,
  };
  await getCollection(COLLECTION).updateOne(
    { key: DOC_KEY },
    { $set: doc, $setOnInsert: { createdAt: new Date().toISOString() } },
    { upsert: true },
  );
  cache = null; // mất hiệu lực cache để lần đọc kế tiếp thấy giá trị mới
  return { config: next, changed, ignored, updated: true };
}

/**
 * Cấu hình công khai cho client (trang chủ/APP nào cũng đọc được để hiện banner
 * bảo trì, tên site, favicon). KHÔNG chứa gì nhạy cảm — chỉ 4 nhóm đã whitelist.
 */
export async function getPublicConfig() {
  const c = await getConfig();
  return {
    site: { name: c.site.name, logoUrl: c.site.logoUrl, faviconUrl: c.site.faviconUrl },
    maintenance: c.maintenance,
  };
}

/** Nhãn nhà cung cấp lưu trữ đang dùng — an toàn để đưa ra frontend. */
export function storageProviderName() {
  return config.supabase?.url && config.supabase?.key ? `Supabase (${config.supabase.bucket})` : "Chưa cấu hình";
}

export const CONFIG_LEAF_PATHS = LEAF_PATHS;
