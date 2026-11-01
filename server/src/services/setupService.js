import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";
import * as storage from "./templateStorageService.js";

// Schema mới — chỉ các trường này được trả về cho frontend
// (htmlTemplate LUÔN là link/đường dẫn file — HTML thô không bao giờ nằm trong Mongo)
const TEMPLATE_FIELDS = [
  "name", "description", "type", "category", "icon", "ring",
  "htmlTemplate", "fileName", "version", "status", "playMode", "createdAt", "updatedAt",
];

// Chuẩn hóa về schema mới: bỏ trường cũ (id/slug/categoryLabel)
function serialize(doc) {
  if (!doc) return doc;
  const out = { _id: doc._id.toString() };
  for (const key of TEMPLATE_FIELDS) {
    let value = doc[key];
    if (value === undefined) value = "";
    out[key] = value;
  }
  if (!out.type) out.type = "play-to-learn";
  if (!out.status) out.status = "draft";
  if (!out.playMode) out.playMode = "solo";
  out.version = Number(out.version) || 1;
  return out;
}

export async function listTemplates() {
  const docs = await getCollection("templates").find({}).sort({ name: 1 }).toArray();
  return docs.map(serialize);
}

export async function getTemplate(id) {
  try {
    const doc = await getCollection("templates").findOne({ _id: new ObjectId(id) });
    return serialize(doc);
  } catch {
    return null;
  }
}

export async function getTemplateBySlug(slug) {
  const doc = await getCollection("templates").findOne({ slug });
  return serialize(doc);
}

export async function createTemplate(data) {
  const now = new Date().toISOString();
  const html = String(data.htmlTemplate || "");
  storage.validateHtml(html); // kiểu dữ liệu + giới hạn dung lượng — chặn trước khi ghi DB

  const doc = {
    name: data.name || "Template mới",
    description: data.description || "",
    type: data.type || "play-to-learn",
    category: data.category || "quiz",
    icon: data.icon || "🎲",
    ring: data.ring || "#1D2E4A",
    // htmlTemplate: LUÔN là link tới file HTML (uploads/html hoặc R2/Firebase).
    // MongoDB không chứa HTML thô.
    htmlTemplate: "",
    fileName: "",
    version: 1,
    status: ["published", "draft", "inactive"].includes(data.status) ? data.status : "draft",
    playMode: ["solo", "classroom"].includes(data.playMode) ? data.playMode : "solo",
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection("templates").insertOne(doc);
  const id = result.insertedId.toString();

  if (html.trim()) {
    let saved = null;
    try {
      saved = await storage.storeHtmlTemplate(id, html);
      if (!saved) throw new Error("Không lưu được file HTML — kiểm tra dung lượng/ổ cứng server");
      await getCollection("templates").updateOne(
        { _id: result.insertedId },
        { $set: { htmlTemplate: saved.url, fileName: saved.fileName } }
      );
      doc.htmlTemplate = saved.url;
      doc.fileName = saved.fileName;
    } catch (e) {
      // Rollback: dọn file vừa ghi (nếu có) + bản ghi vừa chèn — không để file rác
      if (saved) await storage.deleteHtmlByUrl(saved.url).catch(() => {});
      await getCollection("templates").deleteOne({ _id: result.insertedId }).catch(() => {});
      throw e;
    }
  }

  return { _id: id, ...doc };
}

export async function updateTemplate(id, data) {
  const { _id, ...rest } = data;
  rest.updatedAt = new Date().toISOString();
  if (rest.version !== undefined) rest.version = Number(rest.version);

  const coll = getCollection("templates");
  const oid = new ObjectId(id);

  // Xử lý htmlTemplate: ghi FILE mới rồi đổi link — Mongo không bao giờ nhận HTML thô.
  let oldRef = "";
  let fresh = null; // file mới đã ghi, cần dọn nếu DB lỗi
  if (Object.prototype.hasOwnProperty.call(rest, "htmlTemplate")) {
    const current = await coll.findOne({ _id: oid });
    if (!current) throw new Error("Không tìm thấy template");
    oldRef = String(current.htmlTemplate || "").trim();
    const incoming = String(rest.htmlTemplate || "").trim();

    if (incoming && incoming === oldRef) {
      // Client gửi lại đúng link (không sửa HTML) → giữ file + URL cũ, không tạo file mới
      delete rest.htmlTemplate;
      delete rest.fileName;
    } else if (!incoming) {
      // Xóa HTML → URL rỗng; file cũ xóa ở bước dọn bên dưới
      rest.htmlTemplate = "";
      rest.fileName = "";
    } else if (storage.isHtmlRef(incoming)) {
      // Gửi lên sẵn là link/đường dẫn (vd /games/x.html) → ghi trực tiếp, không tạo file
      rest.htmlTemplate = incoming;
    } else {
      fresh = await storage.storeHtmlTemplate(id, incoming); // validate + ghi file
      if (!fresh) throw new Error("Không lưu được file HTML — kiểm tra dung lượng/ổ cứng server");
      rest.htmlTemplate = fresh.url;
      rest.fileName = fresh.fileName;
    }
  }

  let updated;
  try {
    updated = await coll.findOneAndUpdate({ _id: oid }, { $set: rest }, { returnDocument: "after" });
  } catch (e) {
    if (fresh) await storage.deleteHtmlByUrl(fresh.url).catch(() => {}); // rollback file rác
    throw e;                                                            // HTML/file cũ vẫn nguyên
  }
  if (!updated) {
    if (fresh) await storage.deleteHtmlByUrl(fresh.url).catch(() => {});
    throw new Error("Không tìm thấy template");
  }

  // DB thành công → xóa file cũ, nhưng chỉ khi không còn bản ghi nào khác dùng chung link
  if (oldRef && oldRef !== String(updated.htmlTemplate || "").trim()) {
    const stillUsed = await coll.countDocuments({ htmlTemplate: oldRef, _id: { $ne: oid } });
    if (stillUsed === 0) await storage.deleteHtmlByUrl(oldRef).catch(() => {});
  }
  return serialize(updated);
}

export async function removeTemplate(id) {
  const oid = new ObjectId(id);
  const coll = getCollection("templates");
  const doc = await coll.findOne({ _id: oid });
  if (!doc) throw new Error("Không tìm thấy template");

  const gamesUsing = await getCollection("games").countDocuments({ templateId: oid });
  if (gamesUsing > 0) {
    // Game vẫn cần chơi → giữ nguyên file HTML, chỉ chuyển template sang inactive
    await coll.updateOne({ _id: oid }, { $set: { status: "inactive" } });
    return { deactivated: true, gamesCount: gamesUsing };
  }

  const result = await coll.deleteOne({ _id: oid });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy template");

  // File chỉ bị xóa khi không còn bản ghi nào khác dùng chung link (chống xóa nhầm)
  const ref = String(doc.htmlTemplate || "").trim();
  if (ref && storage.isHtmlRef(ref)) {
    const stillUsed = await coll.countDocuments({ htmlTemplate: ref });
    if (stillUsed === 0) await storage.deleteHtmlByUrl(ref).catch(() => {});
  }
  return { deleted: true };
}

// Xóa TẤT CẢ templates + file HTML tương ứng
export async function removeAllTemplates() {
  const coll = getCollection("templates");
  const docs = await coll.find({}).toArray();
  for (const d of docs) {
    const ref = String(d.htmlTemplate || "").trim();
    if (ref && storage.isHtmlRef(ref)) await storage.deleteHtmlByUrl(ref).catch(() => {});
  }
  const count = docs.length;
  await coll.deleteMany({});
  return { deleted: count };
}

/**
 * Migration một lần / idempotent: bản ghi cũ còn chứa HTML THÔ trong
 * templates.htmlTemplate → ghi thành file và thay bằng link.
 * Chạy lúc server khởi động (sau initDatabase) và sau POST /api/seed.
 * File lỗi thì giữ nguyên HTML thô (không bao giờ mất dữ liệu) và log cảnh báo.
 */
export async function migrateRawHtmlTemplates() {
  const coll = getCollection("templates");
  const docs = await coll.find({ htmlTemplate: { $exists: true, $ne: "" } }).toArray();
  let moved = 0;
  let failed = 0;
  for (const d of docs) {
    const v = String(d.htmlTemplate || "").trim();
    if (!v || storage.isHtmlRef(v)) continue; // đã là link → bỏ qua
    try {
      const saved = await storage.storeHtmlTemplate(d._id.toString(), v);
      if (!saved) throw new Error("storage trả null");
      await coll.updateOne(
        { _id: d._id },
        { $set: { htmlTemplate: saved.url, fileName: saved.fileName } }
      );
      moved++;
    } catch (e) {
      failed++;
      console.warn(`[migrate] template "${d.name}" (${d._id}): ${e.message} — giữ HTML thô trong Mongo, chưa mất dữ liệu`);
    }
  }
  if (moved || failed) console.log(`[migrate] HTML templates → file: ${moved} chuyển, ${failed} lỗi`);
  return { moved, failed, scanned: docs.length };
}

export async function listCategories() {
  const docs = await getCollection("categories").find({}).sort({ id: 1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function createCategory(data) {
  const coll = getCollection("categories");
  const id = data.id || `cat_${Date.now()}`;
  const label = data.label || "";
  const existing = await coll.findOne({ id });
  if (existing) throw new Error("Category ID đã tồn tại");
  await coll.insertOne({ id, label });
  return { id, label };
}

export async function updateCategory(id, data) {
  const coll = getCollection("categories");
  const result = await coll.findOneAndUpdate(
    { id },
    { $set: { label: data.label || "" } },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy category");
  const { _id, ...rest } = result;
  return rest;
}

export async function removeCategory(id) {
  const result = await getCollection("categories").deleteOne({ id });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy category");
  return { deleted: true };
}

export async function removeAllCategories() {
  const coll = getCollection("categories");
  const count = await coll.countDocuments();
  await coll.deleteMany({});
  return { deleted: count };
}

export async function listPlayers() {
  const docs = await getCollection("players").find({}).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function listSubjects() {
  const docs = await getCollection("subjects").find({}).sort({ name: 1 }).toArray();
  return docs.map(d => ({ _id: d._id.toString(), name: d.name }));
}

export async function addSubject(name) {
  const coll = getCollection("subjects");
  const existing = await coll.findOne({ name });
  if (existing) throw new Error("Môn học đã tồn tại");
  await coll.insertOne({ name });
  return listSubjects();
}

export async function removeSubject(name) {
  const coll = getCollection("subjects");
  const result = await coll.deleteOne({ name });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy môn học");
  return listSubjects();
}

export async function updateSubject(oldName, newName) {
  const coll = getCollection("subjects");
  const existing = await coll.findOne({ name: oldName });
  if (!existing) throw new Error("Không tìm thấy môn học");
  if (oldName !== newName) {
    const dup = await coll.findOne({ name: newName });
    if (dup) throw new Error("Môn học mới đã tồn tại");
  }
  await coll.updateOne({ _id: existing._id }, { $set: { name: newName } });
  return listSubjects();
}
