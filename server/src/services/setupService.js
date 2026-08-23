import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

// Schema mới — chỉ các trường này được trả về cho frontend
const TEMPLATE_FIELDS = [
  "name", "description", "type", "category", "icon", "ring",
  "htmlTemplate", "thumbnail", "version", "status", "createdAt", "updatedAt",
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
    htmlTemplate: data.htmlTemplate || "",
    thumbnail: data.thumbnail || "",
    version: 1,
    status: ["published", "draft", "inactive"].includes(data.status) ? data.status : "draft",
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection("templates").insertOne(doc);
  return { _id: result.insertedId.toString(), ...doc };
}

export async function updateTemplate(id, data) {
  const { _id, ...rest } = data;
  rest.updatedAt = new Date().toISOString();
  if (rest.version !== undefined) rest.version = Number(rest.version);
  const result = await getCollection("templates").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: rest },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy template");
  return serialize(result);
}

export async function removeTemplate(id) {
  const oid = new ObjectId(id);
  const gamesUsing = await getCollection("games").countDocuments({ templateId: oid });
  if (gamesUsing > 0) {
    await getCollection("templates").updateOne({ _id: oid }, { $set: { status: "inactive" } });
    return { deactivated: true, gamesCount: gamesUsing };
  }
  const result = await getCollection("templates").deleteOne({ _id: oid });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy template");
  return { deleted: true };
}

// Xóa TẤT CẢ templates
export async function removeAllTemplates() {
  const coll = getCollection("templates");
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
  const doc = await getCollection("subjects").findOne({});
  return doc ? doc.list : [];
}

export async function addSubject(name) {
  const coll = getCollection("subjects");
  const doc = await coll.findOne({});
  if (!doc) {
    await coll.insertOne({ list: [name] });
    return [name];
  }
  if (doc.list.includes(name)) throw new Error("Môn học đã tồn tại");
  await coll.updateOne({ _id: doc._id }, { $set: { list: [...doc.list, name] } });
  return [...doc.list, name];
}

export async function removeSubject(name) {
  const coll = getCollection("subjects");
  const doc = await coll.findOne({});
  if (!doc || !doc.list.includes(name)) throw new Error("Không tìm thấy môn học");
  const updated = doc.list.filter(s => s !== name);
  await coll.updateOne({ _id: doc._id }, { $set: { list: updated } });
  return updated;
}

export async function updateSubject(oldName, newName) {
  const coll = getCollection("subjects");
  const doc = await coll.findOne({});
  if (!doc || !doc.list.includes(oldName)) throw new Error("Không tìm thấy môn học");
  if (oldName !== newName && doc.list.includes(newName)) throw new Error("Môn học mới đã tồn tại");
  const updated = doc.list.map(s => s === oldName ? newName : s);
  await coll.updateOne({ _id: doc._id }, { $set: { list: updated } });
  return updated;
}
