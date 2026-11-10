// services/auditService.js
//
// Nhật ký thao tác quản trị — collection `admin_logs` trong MongoDB.
//
// Nguyên tắc bảo mật (theo update_admin_page.md §3.E):
//   • KHÔNG bao giờ ghi mật khẩu, token, cookie, secret key hay body nhạy cảm.
//     `sanitize()` loại bỏ mọi khoá trùng từ khoá dưới đây ở bất kỳ độ sâu nào.
//   • Chỉ ghi thông tin cần thiết để truy vết: ai, làm gì, lên đối tượng nào,
//     kết quả, lúc nào, từ IP/UA nào.
//   • Ghi theo kiểu "best-effort": lỗi log không được làm hỏng thao tác nghiệp vụ
//     (mọi hàm ở đây tự bắt lỗi và chỉ in cảnh báo ra console).
//
// Đọc log: GET /api/system/logs — quyền `settings.view` (xem middleware/permission.js).

import { getCollection } from "../db.js";

const COLLECTION = "admin_logs";
const uid = () => `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Khoá bị loại khỏi meta — chống rò rỉ credentials vào log. */
const SECRET_KEY_RE = /(password|passwd|pwd|secret|token|authorization|cookie|apikey|api_key|credential|refresh|sessionid|auth)/i;
/** Giá trị dài bất thường (base64 HTML/ảnh) không có chỗ trong log. */
const MAX_STRING = 240;
const MAX_DEPTH = 3;

/** Đệ quy loại khoá nhạy cảm + cắt chuỗi quá dài. */
export function sanitize(value, depth = 0) {
  if (value == null) return value;
  if (typeof value === "string") return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…(${value.length})` : value;
  if (typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return Array.isArray(value) ? `[${value.length}]` : "{…}";
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((v) => sanitize(v, depth + 1));
  }
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (SECRET_KEY_RE.test(k)) { out[k] = "[đã ẩn]"; continue; }
    out[k] = sanitize(v, depth + 1);
  }
  return out;
}

/** Danh sách hành động được ghi nhận — frontend dịch sang tiếng Việt. */
export const AUDIT = {
  LOGIN: "auth.login",
  LOGIN_FAIL: "auth.login_fail",
  LOGOUT: "auth.logout",
  REGISTER: "auth.register",
  PASSWORD_CHANGE: "auth.password_change",
  SESSIONS_REVOKE: "auth.sessions_revoke",
  TEMPLATE_CREATE: "template.create",
  TEMPLATE_UPDATE: "template.update",
  TEMPLATE_DELETE: "template.delete",
  TEMPLATE_DELETE_ALL: "template.delete_all",
  PAGE_UPDATE: "page.update",
  GAME_CREATE: "game.create",
  GAME_UPDATE: "game.update",
  GAME_DELETE: "game.delete",
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
  USER_ROLE: "user.role",
  USER_DELETE: "user.delete",
  // Xóa HÀNG LOẠT tài khoản rác theo danh sách id do admin gửi: MỘT bản ghi
  // cho cả batch, meta chỉ gồm danh sách id ĐÃ xóa + số đếm thành công/thất
  // bại — không ghi dữ liệu cá nhân nào khác của các tài khoản bị xóa.
  USER_BULK_DELETE: "user.bulk_delete",
  USER_RESET_PASSWORD: "user.reset_password",
  ROLE_CREATE: "role.create",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",
  PERMISSION_ALL: "role.all_permissions",
  CONFIG_UPDATE: "config.update",
  // Tra cứu dữ liệu quản trị qua chat AI (update_features.md §4): chỉ ghi
  // LOẠI truy vấn + số kết quả vào meta — không ghi nội dung câu hỏi đầy
  // đủ, không ghi dữ liệu cá nhân của học sinh.
  AI_ADMIN_QUERY: "ai.admin_query",
  // Admin xóa lịch sử hỏi AI theo điều kiện lọc: meta chỉ gồm điều kiện
  // (khoảng ngày/userId) + số bản ghi đã xóa — không ghi nội dung đã xóa.
  AI_CHAT_LOGS_DELETE: "ai.chat_logs_delete",
  SEED_RUN: "data.seed",
  SUPPORT_UPDATE: "support.update",
  GAME_CONFIG_WRITE: "game_config.write",
  GAME_CONFIG_DELETE: "game_config.delete",
  SCAN_RUN: "system.scan",
};

/**
 * Ghi một bản ghi nhật ký.
 * @param {object} entry
 * @param {import('express').Request} [req] — tự lấy actor/ip/ua từ request
 * @param {string} entry.action  một khoá của AUDIT
 * @param {string} [entry.target]  "template:Lật Thẻ" / "user:st-001"…
 * @param {"success"|"fail"} [entry.result]
 * @param {object} [entry.actor]  người thực hiện khi request CHƯA có token (lúc đăng nhập)
 */
export async function record({ req, action, target = "", result = "success", message = "", meta, actor }) {
  try {
    const u = actor || req?.user || null;
    const doc = {
      id: uid(),
      at: new Date(),
      action: String(action || "unknown").slice(0, 60),
      target: String(target || "").slice(0, 200),
      result: result === "fail" ? "fail" : "success",
      message: String(message || "").slice(0, 300),
      actorId: u?.sub || u?.id || u?.userId || null,
      actorName: u?.name || u?.username || null,
      actorRole: u?.role || null,
      ip: req?.ip ? String(req.ip).slice(0, 60) : null,
      userAgent: req?.headers?.user_agent ? String(req.headers.user_agent).slice(0, 180) : null,
    };
    const clean = sanitize(meta);
    if (clean && Object.keys(clean).length) doc.meta = clean;
    await getCollection(COLLECTION).insertOne(doc);
    return doc;
  } catch (e) {
    console.warn("[audit] Không ghi được nhật ký:", e.message);
    return null;
  }
}

/**
 * Quét ký tự không được phép có trong chuỗi tìm kiếm để tránh regex chết người
 * (ReDoS) khi ghép vào $regex.
 */
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Danh sách nhật ký có phân trang + lọc.
 * @param {{page?:number, perPage?:number, keyword?:string, action?:string,
 *          actor?:string, result?:string, from?:string, to?:string}} q
 */
export async function list(q = {}) {
  const page = Math.max(1, Number(q.page) || 1);
  const perPage = Math.min(100, Math.max(5, Number(q.perPage) || 20));
  const filter = {};

  if (q.action && q.action !== "all") filter.action = String(q.action).slice(0, 60);
  if (q.result === "success" || q.result === "fail") filter.result = q.result;
  if (q.actor) filter.actorName = { $regex: escapeRe(String(q.actor).trim().slice(0, 60)), $options: "i" };

  if (q.keyword) {
    const kw = escapeRe(String(q.keyword).trim().slice(0, 80));
    if (kw) {
      filter.$or = [
        { target: { $regex: kw, $options: "i" } },
        { message: { $regex: kw, $options: "i" } },
        { actorName: { $regex: kw, $options: "i" } },
        { action: { $regex: kw, $options: "i" } },
      ];
    }
  }

  const range = {};
  const from = q.from ? new Date(q.from) : null;
  const to = q.to ? new Date(q.to) : null;
  if (from && !Number.isNaN(from.getTime())) range.$gte = from;
  if (to && !Number.isNaN(to.getTime())) {
    const end = new Date(to);
    // "2026-11-01" (chỉ có ngày) → hết ngày đó, không phải 00:00.
    if (end.getHours() === 0 && end.getMinutes() === 0 && String(q.to).length <= 10) end.setHours(23, 59, 59, 999);
    range.$lte = end;
  }
  if (range.$gte || range.$lte) filter.at = { ...((filter.at) || {}), ...range };

  const coll = getCollection(COLLECTION);
  const [total, rows] = await Promise.all([
    coll.countDocuments(filter),
    coll.find(filter).sort({ at: -1 }).skip((page - 1) * perPage).limit(perPage).toArray(),
  ]);

  return {
    items: rows.map((r) => ({
      id: r.id,
      at: r.at instanceof Date ? r.at.toISOString() : r.at,
      action: r.action,
      target: r.target || "",
      result: r.result,
      message: r.message || "",
      actorName: r.actorName || "—",
      actorRole: r.actorRole || "",
      ip: r.ip || "",
      meta: r.meta || null,
    })),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage) || 1,
    actions: Object.values(AUDIT),
  };
}

/** Xoá nhật ký cũ hơn N ngày (admin chủ động gọi, không tự chạy nền). */
export async function purge(days = 90) {
  const d = Math.max(7, Number(days) || 90);
  const cut = new Date(Date.now() - d * 86_400_000);
  const res = await getCollection(COLLECTION).deleteMany({ at: { $lt: cut } });
  return { deleted: res.deletedCount || 0, olderThanDays: d };
}
