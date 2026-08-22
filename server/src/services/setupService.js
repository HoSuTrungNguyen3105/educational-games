import { getCollection } from "../db.js";

export async function listTemplates() {
  const docs = await getCollection("templates").find({}).sort({ id: 1 }).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function getTemplate(id) {
  const doc = await getCollection("templates").findOne({ id });
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

export async function createTemplate(data) {
  const coll = getCollection("templates");
  const existing = await coll.findOne({ id: data.id });
  if (existing) throw new Error(`Template "${data.id}" đã tồn tại`);
  const doc = { id: data.id, slug: data.slug || data.id, name: data.name, description: data.description || "", category: data.category || "quiz", categoryLabel: data.categoryLabel || "", icon: data.icon || "🎲", ring: data.ring || "#1D2E4A" };
  await coll.insertOne(doc);
  return doc;
}

export async function updateTemplate(id, data) {
  const { _id, ...rest } = data;
  const result = await getCollection("templates").findOneAndUpdate(
    { id },
    { $set: rest },
    { returnDocument: "after" }
  );
  if (!result) throw new Error("Không tìm thấy template");
  const { _id: _, ...clean } = result;
  return clean;
}

export async function removeTemplate(id) {
  const result = await getCollection("templates").deleteOne({ id });
  if (result.deletedCount === 0) throw new Error("Không tìm thấy template");
  return true;
}

export async function listCategories() {
  const docs = await getCollection("categories").find({}).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function listPlayers() {
  const docs = await getCollection("players").find({}).toArray();
  return docs.map(({ _id, ...rest }) => rest);
}

export async function listSubjects() {
  const doc = await getCollection("subjects").findOne({});
  return doc ? doc.list : [];
}