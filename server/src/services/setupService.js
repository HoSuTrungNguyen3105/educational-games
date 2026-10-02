import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";
import * as firebaseStorage from "./firebaseStorageService.js";

// Schema mới — chỉ các trường này được trả về cho frontend
const TEMPLATE_FIELDS = [
  "name", "description", "type", "category", "icon", "ring",
  "htmlTemplate", "thumbnail", "version", "status", "playMode", "createdAt", "updatedAt",
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
  const doc = {
    name: data.name || "Template mới",
    description: data.description || "",
    type: data.type || "play-to-learn",
    category: data.category || "quiz",
    icon: data.icon || "🎲",
    ring: data.ring || "#1D2E4A",
    // htmlTemplate: HTML game → link Firebase Storage (xem saveTemplateHtml)
    htmlTemplate: data.htmlTemplate || "",
    thumbnail: data.thumbnail || "",
    version: 1,
    status: ["published", "draft", "inactive"].includes(data.status) ? data.status : "draft",
    playMode: ["solo", "classroom"].includes(data.playMode) ? data.playMode : "solo",
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection("templates").insertOne(doc);
  const id = result.insertedId.toString();

  // Đổi HTML thành link Firebase trước khi trả về (và ghi lại vào DB).
  const saved = await saveTemplateHtml(id, doc.htmlTemplate);
  if (saved !== null) {
    await getCollection("templates").updateOne(
      { _id: result.insertedId },
      { $set: { htmlTemplate: saved } }
    );
    doc.htmlTemplate = saved;
  }

  return { _id: id, ...doc };
}

export async function updateTemplate(id, data) {
  const { _id, ...rest } = data;
  rest.updatedAt = new Date().toISOString();
  if (rest.version !== undefined) rest.version = Number(rest.version);

  // Nếu body có gửi htmlTemplate → upload Firebase và thay bằng link.
  if (Object.prototype.hasOwnProperty.call(rest, "htmlTemplate")) {
    const saved = await saveTemplateHtml(id, rest.htmlTemplate || "");
    rest.htmlTemplate = saved === null ? (rest.htmlTemplate || "") : saved;
  }

  const result = await getCollection("templates").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: rest },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy template");
  return serialize(result);
}

/**
 * Đưa HTML game lên Firebase Storage và trả về link.
 *
 * @param {string} id       templateId
 * @param {string} html     HTML game (rỗng = xoá file trên Firebase)
 * @returns {Promise<string|null>} link Firebase, hoặc null nếu upload lỗi
 *                                   (khi đó caller giữ nguyên HTML trong Mongo)
 */
async function saveTemplateHtml(id, html) {
  if (!String(html || "").trim()) {
    await firebaseStorage.deleteHtmlTemplate(id);
    return "";
  }
  const url = await firebaseStorage.saveHtmlTemplate(id, html);
  if (!url) {
    // Firebase lỗi → giữ HTML thô trong Mongo để game vẫn chạy được
    console.warn("[setupService] Firebase lỗi — tạm giữ HTML thô trong Mongo");
    return null;
  }
  return url;
}

export async function removeTemplate(id) {
  const oid = new ObjectId(id);
  const gamesUsing = await getCollection("games").countDocuments({ templateId: oid });
  if (gamesUsing > 0) {
    await getCollection("templates").updateOne({ _id: oid }, { $set: { status: "inactive" } });
    return { deactivated: true, gamesCount: gamesUsing };
  }
  await firebaseStorage.deleteHtmlTemplate(id);
  const result = await getCollection("templates").deleteOne({ _id: oid });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy template");
  return { deleted: true };
}

// Xóa TẤT CẢ templates
export async function removeAllTemplates() {
  const coll = getCollection("templates");
  const docs = await coll.find({ htmlTemplate: /firebasestorage|storage\.googleapis\.com/ }).toArray();
  for (const d of docs) {
    const m = String(d.htmlTemplate || "").match(/\/o\/([^?]+)\?/);
    if (m) await firebaseStorage.deleteHtmlPath(decodeURIComponent(m[1]));
  }
  const count = await coll.countDocuments();
  await coll.deleteMany({});
  return { deleted: count };
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
