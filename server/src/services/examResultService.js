import { getCollection } from "../db.js";

const COLLECTION = "examResults";

function uid() {
  return `exam-${Math.random().toString(36).slice(2, 9)}`;
}

function clean(data = {}) {
  return {
    gameId: String(data.gameId || "school-mission"),
    examId: String(data.examId || ""),
    examTitle: String(data.examTitle || ""),
    subject: String(data.subject || ""),
    score: Number(data.score) || 0,
    passed: !!data.passed,
    correct: Number(data.correct) || 0,
    total: Number(data.total) || 0,
    durationSec: Number(data.durationSec) || 0,
    takenAt: data.takenAt || new Date().toISOString(),
  };
}

export async function create(userId, data = {}) {
  const now = new Date().toISOString();
  const doc = { _id: uid(), userId, ...clean(data), createdAt: now, updatedAt: now };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function listByUser(userId, { limit = 50 } = {}) {
  const lim = Math.min(200, Math.max(1, Number(limit) || 50));
  return getCollection(COLLECTION).find({ userId }).sort({ createdAt: -1 }).limit(lim).toArray();
}

export async function listAll({ limit = 200 } = {}) {
  const lim = Math.min(500, Math.max(1, Number(limit) || 200));
  return getCollection(COLLECTION).find({}).sort({ createdAt: -1 }).limit(lim).toArray();
}
