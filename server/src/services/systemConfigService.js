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
      if (v && typeof v === "object" && !Array.isArray(v)) walk(v, p);
      else out.push(p);
    }
  };
  walk(DEFAULTS, "");
  return out;
})();

/** Ép kiểu theo giá trị mặc định — boolean/string, chuỗi bị cắt theo trần an toàn. */
function coerce(path, value) {
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

export async function getConfig() {
  if (cache && Date.now() - cacheAt < CACHE_TTL_MS) return clone(cache);
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
  cache = merged;
  cacheAt = Date.now();
  return clone(merged);
}

/** Giá trị của 1 khoá cấu hình (đường dẫn "a.b"). */
export async function get(path) {
  return pick(await getConfig(), path);
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
