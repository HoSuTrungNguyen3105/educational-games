import { getCollection } from "../db.js";

export async function listTemplates() {
  const docs = await getCollection("templates").find({}).toArray();
  return docs.map(({ _id, ...rest }) => rest);
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