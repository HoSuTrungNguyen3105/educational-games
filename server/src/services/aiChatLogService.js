// services/aiChatLogService.js
//
// Lịch sử HỎI AI — collection `ai_chat_logs` (xem schema ở db.js).
//
// Mỗi lượt chat THÀNH CÔNG qua đường trực tiếp (aiDirectService.directChat —
// đường Groq/Ollama Cloud production đang chạy) được ghi thành MỘT bản ghi:
// câu hỏi + câu trả lời TOÀN VĂN + danh tính người hỏi lấy từ hồ sơ DB phía
// Backend (aiChatContext.identity: userId/role/grade/classId — KHÔNG tin
// client tự khai). Admin xem toàn bộ ở trang "Lịch sử hỏi AI"
// (GET /api/ai/chat-logs, chỉ role admin) và chủ động dọn theo điều kiện
// (DELETE /api/ai/chat-logs).
//
// Nguyên tắc ghi:
//  - Ghi NGẦM sau khi đã có câu trả lời: lỗi ghi bị NUỐT (chỉ console.warn),
//    không bao giờ làm chậm đáng kể hay làm hỏng response chat — cùng tinh
//    thần auditService.record.
//  - Lượt chat LỖI (không có answer) không được ghi: caller chỉ gọi hàm này
//    ở cuối directChat, sau khi answer đã hoàn thiện.
//  - Lượt tra cứu quản trị (đợt #74, context.adminData có mặt) ghi
//    kind="admin_query" kèm queryType; còn lại kind="chat".
//
// Dữ liệu này KHÔNG bị xóa theo khi admin xóa user (cleanupUserRelatedData
// ở authService cố ý không đụng tới): nó là lịch sử tra cứu của admin, và
// username đã được chụp lại ngay trong bản ghi nên vẫn đọc được sau khi
// tài khoản bị xóa. Admin dọn thủ công bằng DELETE /api/ai/chat-logs.

import { getCollection } from "../db.js";

const COLLECTION = "ai_chat_logs";
const uid = () => `ailog-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Trần độ dài câu hỏi khớp giới hạn ở tầng chat (normalizeChatMessage: 2000). */
const MAX_QUESTION_LENGTH = 2000;
/** Trần trang/kích thước trang cho API xem — tránh một request kéo cả bảng. */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

/** Quét ký tự regex đặc biệt (ReDoS) — cùng pattern auditService.list. */
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const strOrNull = (v, max) => {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s.slice(0, max);
};

/**
 * Chuẩn hoá khoảng ngày lọc theo NGÀY LỊCH (yyyy-MM-dd) về khoảng createdAt
 * ISO: from = đầu ngày, to = CUỐI ngày (để "to" bao trọn ngày đó, cùng cách
 * auditService.list xử lý ngày chỉ-gồm-ngày). Trả null cho vế không hợp lệ.
 */
function dayStartIso(value) {
  const v = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(v)) return null;
  const d = new Date(`${v.slice(0, 10)}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function dayEndIso(value) {
  const start = dayStartIso(value);
  if (!start) return null;
  return new Date(new Date(start).getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();
}
/** Biên dưới khoảng ngày: ISO đầy đủ (có "T") giữ nguyên mốc; chỉ-ngày → đầu ngày. */
function fromBound(value) {
  const v = String(value || "").trim();
  if (!v) return null;
  if (v.includes("T")) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return dayStartIso(v);
}
/** Biên trên khoảng ngày: ISO đầy đủ giữ nguyên mốc; chỉ-ngày → cuối ngày đó. */
function toBound(value) {
  const v = String(value || "").trim();
  if (!v) return null;
  if (v.includes("T")) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return dayEndIso(v);
}

/**
 * Dựng filter Mongo từ bộ lọc dùng chung của list/delete.
 * @param {{userId?: string, username?: string, role?: string, kind?: string,
 *          from?: string, to?: string, q?: string}} f
 * `from`/`to` nhận yyyy-MM-dd (ngày lịch) hoặc ISO đầy đủ (có "T" thì giữ
 * nguyên mốc thời gian đó).
 */
export function buildChatLogFilter(f = {}) {
  const filter = {};
  if (f.userId) filter.userId = String(f.userId).trim().slice(0, 80);
  if (f.username) {
    filter.username = { $regex: escapeRe(String(f.username).trim().slice(0, 60)), $options: "i" };
  }
  if (f.role === "student" || f.role === "teacher" || f.role === "admin") filter.role = f.role;
  if (f.kind === "chat" || f.kind === "admin_query") filter.kind = f.kind;
  if (f.q) {
    const kw = escapeRe(String(f.q).trim().slice(0, 120));
    if (kw) filter.question = { $regex: kw, $options: "i" };
  }
  const range = {};
  const fromIso = fromBound(f.from);
  const toIso = toBound(f.to);
  if (fromIso) range.$gte = fromIso;
  if (toIso) range.$lte = toIso;
  if (range.$gte || range.$lte) filter.createdAt = range;
  return filter;
}

/**
 * Ghi MỘT bản ghi lịch sử hỏi–đáp. Tự nuốt lỗi — hàm này KHÔNG bao giờ
 * throw, caller có thể gọi fire-and-forget.
 * @param {object} entry
 * @param {string} entry.userId     id người hỏi (từ identity DB / token)
 * @param {string|null} [entry.username]  username chụp lại để hiển thị
 * @param {string|null} [entry.role]
 * @param {number|null} [entry.grade]     khối lớp suy từ ageCode (chỉ học sinh)
 * @param {string|null} [entry.classId]
 * @param {string} entry.question   câu hỏi gốc (cắt ở 2000 ký tự)
 * @param {string} entry.answer     câu trả lời toàn văn như response trả
 * @param {Array<{title?: string}>|string[]} [entry.sources] nguồn bài học
 * @param {string|null} [entry.conversationId]
 * @param {"chat"|"admin_query"} [entry.kind]
 * @param {string|null} [entry.queryType] loại tra cứu khi kind=admin_query
 * @returns {Promise<object|null>} document đã ghi, hoặc null khi lỗi/thiếu dữ liệu
 */
export async function recordChatLog(entry = {}) {
  try {
    const question = String(entry.question ?? "").slice(0, MAX_QUESTION_LENGTH);
    const answer = String(entry.answer ?? "");
    if (!entry.userId || question.trim() === "" || answer.trim() === "") return null;
    const kind = entry.kind === "admin_query" ? "admin_query" : "chat";
    const sources = (Array.isArray(entry.sources) ? entry.sources : [])
      .map((s) => (typeof s === "string" ? s : s?.title))
      .filter((t) => typeof t === "string" && t.trim() !== "")
      .map((t) => t.slice(0, 200));
    const doc = {
      id: uid(),
      userId: String(entry.userId).slice(0, 80),
      username: strOrNull(entry.username, 80),
      role: strOrNull(entry.role, 24),
      grade: typeof entry.grade === "number" && Number.isFinite(entry.grade) ? entry.grade : null,
      classId: strOrNull(entry.classId, 80),
      question,
      answer,
      sources,
      conversationId: strOrNull(entry.conversationId, 64),
      kind,
      queryType: kind === "admin_query" ? strOrNull(entry.queryType, 40) : null,
      createdAt: new Date().toISOString(),
    };
    await getCollection(COLLECTION).insertOne(doc);
    return doc;
  } catch (e) {
    console.warn("[ai] Không ghi được lịch sử hỏi AI:", e?.message || e);
    return null;
  }
}

/**
 * Danh sách lịch sử hỏi AI có phân trang + lọc — mới nhất trước.
 * @param {{page?: number, limit?: number, userId?: string, username?: string,
 *          role?: string, kind?: string, from?: string, to?: string, q?: string}} q
 * @returns {Promise<{items: object[], total: number, page: number, limit: number, totalPages: number}>}
 */
export async function listChatLogs(q = {}) {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(q.limit) || DEFAULT_LIMIT));
  const filter = buildChatLogFilter(q);
  const coll = getCollection(COLLECTION);
  const [total, rows] = await Promise.all([
    coll.countDocuments(filter),
    coll.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
  ]);
  return {
    items: rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      username: r.username ?? null,
      role: r.role ?? null,
      grade: r.grade ?? null,
      classId: r.classId ?? null,
      question: r.question,
      answer: r.answer,
      sources: Array.isArray(r.sources) ? r.sources : [],
      conversationId: r.conversationId ?? null,
      kind: r.kind || "chat",
      queryType: r.queryType ?? null,
      createdAt: r.createdAt,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Xóa lịch sử theo điều kiện lọc (dùng chung buildChatLogFilter với list —
 * admin đang lọc thế nào thì xóa đúng phạm vi đó). Route tầng trên BẮT BUỘC
 * kiểm tra có ít nhất một điều kiện trước khi gọi hàm này.
 * @returns {Promise<number>} số bản ghi đã xóa
 */
export async function deleteChatLogs(f = {}) {
  const filter = buildChatLogFilter(f);
  const res = await getCollection(COLLECTION).deleteMany(filter);
  return res.deletedCount || 0;
}
