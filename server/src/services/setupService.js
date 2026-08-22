import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

export async function listTemplates() {
  return getCollection("templates").find({}).sort({ name: 1 }).toArray();
}

export async function getTemplate(id) {
  try {
    return await getCollection("templates").findOne({ _id: new ObjectId(id) });
  } catch {
    return null;
  }
}

export async function getTemplateBySlug(slug) {
  return getCollection("templates").findOne({ slug });
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
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  const result = await getCollection("templates").insertOne(doc);
  return { _id: result.insertedId, ...doc };
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
  return result;
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
