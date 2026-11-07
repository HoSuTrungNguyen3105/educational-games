// services/documentService.js
//
// Tài liệu giáo viên — Teacher Document Studio (Đợt 1: tầng dữ liệu + API).
// Khác AI Studio (bài học tương tác cho học sinh), đây là công cụ giáo viên
// soạn TÀI LIỆU GIẢNG DẠY: giáo án/phiếu bài tập kiểu Word và slide bài
// giảng kiểu PowerPoint. Mỗi tài liệu lưu NGUYÊN mã nguồn giáo viên đang
// soạn theo một trong hai chế độ:
//   • mode "html": mã HTML/CSS đầy đủ (kèm <style>).
//   • mode "json": JSON có cấu trúc (word = document blocks, powerpoint =
//     presentation slides — schema validate phía client trong đợt này).
// Việc chuyển đổi HTML ↔ JSON, render xem trước và xuất .docx diễn ra
// phía client (mô hình tài liệu trung gian dùng chung); server chỉ là nơi
// lưu trữ theo chủ sở hữu — bám đúng mẫu owner-scope của lessonService:
// authenticate + requireRoles ở route, kiểm tra owner tại service, admin
// là ngoại lệ.
import { getCollection } from "../db.js";

export const DOCUMENTS_COLLECTION = "documents";

export const DOC_TYPES = ["word", "powerpoint"];
export const DOC_MODES = ["html", "json"];
// Trần kích thước mã nguồn: 1MB — thừa cho giáo án/slide soạn tay, dưới
// trần body 10mb của app và cùng tinh thần các trần sẵn có (htmlMaxMb,
// MAX_PAGES_JSON_BYTES của lessons).
export const MAX_SOURCE_BYTES = 1024 * 1024;
export const MAX_NAME_LENGTH = 200;

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

function fail(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}

const utf8Bytes = (s) => new TextEncoder().encode(s || "").length;

function serialize(doc) {
  if (!doc) return doc;
  const rest = { ...doc };
  delete rest._id;
  return rest;
}

// DTO danh sách: bỏ `source` (có thể tới 1MB) khỏi payload, thay bằng
// sourceBytes để client hiện độ lớn mà không tải nặng danh sách.
function serializeMeta(doc) {
  const rest = { ...doc };
  delete rest._id;
  const sourceBytes = utf8Bytes(rest.source);
  delete rest.source;
  return { ...rest, sourceBytes };
}

// ── Validate từng trường (dùng cho cả tạo mới lẫn cập nhật một phần) ────

function normName(v) {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string") throw fail(400, "Tên tài liệu phải là chuỗi văn bản");
  return v.trim().slice(0, MAX_NAME_LENGTH);
}

function normDocType(v, fallback) {
  if (v === undefined || v === null || v === "") return fallback;
  if (!DOC_TYPES.includes(v)) {
    throw fail(400, `Loại tài liệu không hợp lệ — chỉ nhận ${DOC_TYPES.join(" hoặc ")} (nhận "${String(v)}")`);
  }
  return v;
}

function normMode(v, fallback) {
  if (v === undefined || v === null || v === "") return fallback;
  if (!DOC_MODES.includes(v)) {
    throw fail(400, `Chế độ soạn không hợp lệ — chỉ nhận ${DOC_MODES.join(" hoặc ")} (nhận "${String(v)}")`);
  }
  return v;
}

function normSource(v) {
  if (v === undefined || v === null) return "";
  if (typeof v !== "string") throw fail(400, "Mã nguồn tài liệu phải là chuỗi văn bản");
  const bytes = utf8Bytes(v);
  if (bytes > MAX_SOURCE_BYTES) {
    throw fail(400, `Mã nguồn quá lớn (${bytes} byte) — tối đa ${MAX_SOURCE_BYTES} byte (1MB)`);
  }
  return v;
}

async function loadOwnedDocument(id, actor) {
  const doc = await getCollection(DOCUMENTS_COLLECTION).findOne({ id: String(id || "") });
  if (!doc) throw fail(404, "Không tìm thấy tài liệu");
  if (doc.ownerId !== actor?.id && actor?.role !== "admin") {
    throw fail(403, "Chỉ chủ sở hữu mới thao tác được tài liệu này");
  }
  return doc;
}

// ── CRUD ────────────────────────────────────────────────────────────────

export async function createDocument(ownerId, data = {}) {
  const now = new Date().toISOString();
  const doc = {
    id: uid("doc"),
    ownerId,
    name: normName(data.name) || "Tài liệu chưa đặt tên",
    docType: normDocType(data.docType, "word"),
    mode: normMode(data.mode, "html"),
    source: normSource(data.source),
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(DOCUMENTS_COLLECTION).insertOne(doc);
  return serialize(doc);
}

export async function listMyDocuments(ownerId, { search, docType, page = 1, perPage = 20 } = {}) {
  const coll = getCollection(DOCUMENTS_COLLECTION);
  const filter = { ownerId };
  if (docType) filter.docType = normDocType(docType, undefined);
  const s = String(search || "").trim();
  if (s) {
    const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.name = rx;
  }
  const p = Math.max(1, Number(page) || 1);
  const pp = Math.min(100, Math.max(1, Number(perPage) || 20));
  const total = await coll.countDocuments(filter);
  const docs = await coll.find(filter)
    .sort({ updatedAt: -1 })
    .skip((p - 1) * pp)
    .limit(pp)
    .toArray();
  return { items: docs.map(serializeMeta), total };
}

export async function getDocumentForOwner(id, actor) {
  return serialize(await loadOwnedDocument(id, actor));
}

// Cập nhật MỘT PHẦN: chỉ trường nào có trong payload mới đổi (kèm
// validate), các trường còn lại giữ nguyên — client khi lưu chỉ gửi phần
// cần thiết (tên/loại/chế độ/mã nguồn).
export async function updateDocument(id, actor, data = {}) {
  const coll = getCollection(DOCUMENTS_COLLECTION);
  const doc = await loadOwnedDocument(id, actor);
  const patch = {};
  if ("name" in data) patch.name = normName(data.name) || doc.name;
  if ("docType" in data) patch.docType = normDocType(data.docType, doc.docType);
  if ("mode" in data) patch.mode = normMode(data.mode, doc.mode);
  if ("source" in data) patch.source = normSource(data.source);
  patch.updatedAt = new Date().toISOString();
  await coll.updateOne({ id: doc.id }, { $set: patch });
  return serialize({ ...doc, ...patch });
}

export async function deleteDocument(id, actor) {
  const coll = getCollection(DOCUMENTS_COLLECTION);
  const doc = await loadOwnedDocument(id, actor);
  await coll.deleteOne({ id: doc.id });
  return { id: doc.id };
}
