// services/aiCorrectionService.js
//
// Đính chính kiến thức (Knowledge Override) — Tab 2 của trang AI Studio
// (REFACTOR_AI_STUDIO.md Bước 2): giáo viên/admin vá nhanh kiến thức sai
// trong giáo trình khi chưa kịp sửa tài liệu gốc. Bản ghi lưu ở
// collection `ai_corrections` và được TRUY XUẤT ƯU TIÊN CAO NHẤT trong
// pipeline Gia sư AI bằng đúng cơ chế khớp TỪ KHOÁ của hệ thống
// (aiChatContext.searchCorrections) — hệ thống KHÔNG có embedding hay
// Vector DB, service này cũng không giả vờ có: chỉ CRUD dữ liệu thật.
//
// Truy cập dữ liệu theo mẫu các service hiện hữu (getCollection + uid);
// validate nghiệp vụ ném AiBackendError 400 để route trả envelope chuẩn.

import { getCollection } from "../db.js";
import { uid } from "../utils/id.js";
import { AiBackendError } from "./aiBackendError.js";
import { TUTOR_LEVEL_KEYS } from "./aiTutorConfigService.js";

const COLLECTION = "ai_corrections";

const TOPIC_MAX = 300;
const CONTENT_MAX = 4000;
const SUBJECT_MAX = 80;

function badRequest(message) {
  return new AiBackendError(message, { httpCode: 400, kind: "upstream" });
}

function notFound() {
  return new AiBackendError("Không tìm thấy bản ghi đính chính.", { httpCode: 404, kind: "upstream" });
}

/** Bỏ _id của Mongo khỏi document trả ra API. */
function pub(doc) {
  if (!doc) return null;
  const out = { ...doc };
  delete out._id;
  return out;
}

function cleanSubject(value) {
  return typeof value === "string" ? value.trim().slice(0, SUBJECT_MAX) : "";
}

/** Cấp học của bản ghi: "" (mọi cấp) hoặc một mã cấp của Tab 1/Tab 2. */
function cleanLevel(value) {
  const v = typeof value === "string" ? value.trim() : "";
  if (v === "") return "";
  if (!TUTOR_LEVEL_KEYS.includes(v) || v === "default") {
    throw badRequest("Cấp học không hợp lệ.");
  }
  return v;
}

function cleanTopic(value, { required = true } = {}) {
  const v = typeof value === "string" ? value.trim().slice(0, TOPIC_MAX) : "";
  if (required && v === "") throw badRequest("Chủ đề cần đính chính không được để trống.");
  return v;
}

function cleanContent(value, { required = true } = {}) {
  const v = typeof value === "string" ? value.trim().slice(0, CONTENT_MAX) : "";
  if (required && v === "") throw badRequest("Nội dung kiến thức chuẩn xác không được để trống.");
  return v;
}

/** Danh sách toàn bộ bản ghi, MỚI NHẤT TRƯỚC (trang AI Studio hiển thị). */
export async function listCorrections() {
  const docs = await getCollection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();
  return docs.map(pub);
}

/** Tạo bản ghi đính chính mới (mặc định đang hoạt động). */
export async function createCorrection(body = {}, userId = null) {
  const now = new Date().toISOString();
  const doc = {
    id: uid("correction"),
    subject: cleanSubject(body.subject),
    level: cleanLevel(body.level),
    topic: cleanTopic(body.topic),
    content: cleanContent(body.content),
    createdBy: userId ? String(userId) : null,
    active: body.active === false ? false : true,
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return pub(doc);
}

/**
 * Sửa bản ghi: chỉ các field có mặt trong patch mới đổi (topic/content
 * nếu gửi thì không được rỗng); `active` nhận boolean để bật/tắt nhanh.
 * Không thấy bản ghi → 404.
 */
export async function updateCorrection(id, patch = {}) {
  const col = getCollection(COLLECTION);
  const existing = await col.findOne({ id: String(id) });
  if (!existing) throw notFound();
  const set = { updatedAt: new Date().toISOString() };
  if (patch.subject !== undefined) set.subject = cleanSubject(patch.subject);
  if (patch.level !== undefined) set.level = cleanLevel(patch.level);
  if (patch.topic !== undefined) set.topic = cleanTopic(patch.topic);
  if (patch.content !== undefined) set.content = cleanContent(patch.content);
  if (patch.active !== undefined) set.active = patch.active === true;
  await col.updateOne({ id: existing.id }, { $set: set });
  return pub({ ...existing, ...set });
}

/** Xoá bản ghi. Không thấy → 404. */
export async function deleteCorrection(id) {
  const col = getCollection(COLLECTION);
  const existing = await col.findOne({ id: String(id) });
  if (!existing) throw notFound();
  await col.deleteOne({ id: existing.id });
  return { id: existing.id };
}
