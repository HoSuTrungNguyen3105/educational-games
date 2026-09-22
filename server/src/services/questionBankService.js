import { getCollection } from "../db.js";

const COLLECTION = "question_banks";
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * Question Bank: independent pool, not tied to a game.
 * When bank question is updated, all game questions with bankId === id are synced.
 */

export async function listAll({ search, subject, category, limit = 500 } = {}) {
  const coll = getCollection(COLLECTION);
  const filter = {};
  if (subject && subject !== "all") filter.subject = subject;
  if (category && category !== "all") filter.category = category;
  let cursor = coll.find(filter).sort({ updatedAt: -1 }).limit(limit);
  let docs = await cursor.toArray();
  if (search?.trim()) {
    const s = search.toLowerCase();
    docs = docs.filter(d =>
      d.content?.toLowerCase().includes(s) ||
      d.options?.some(o => o.content?.toLowerCase().includes(s)) ||
      d.subject?.toLowerCase().includes(s)
    );
  }
  return docs;
}

export async function getById(id) {
  return getCollection(COLLECTION).findOne({ id });
}

export async function create(data) {
  const now = new Date().toISOString();
  const doc = {
    id: data.id || uid("qbank"),
    content: (data.content || "").trim(),
    options: Array.isArray(data.options) ? data.options : [],
    correctAnswer: data.correctAnswer || "",
    timeLimit: Number(data.timeLimit) || 15,
    points: Number(data.points) || 100,
    subject: data.subject || "",
    category: data.category || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    difficulty: data.difficulty || "medium",
    createdAt: now,
    updatedAt: now,
  };
  if (!doc.content) throw new Error("Nội dung câu hỏi là bắt buộc");
  if (doc.options.length < 2) throw new Error("Cần ít nhất 2 đáp án");
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function update(id, data) {
  const coll = getCollection(COLLECTION);
  const existing = await coll.findOne({ id });
  if (!existing) throw new Error("Không tìm thấy câu hỏi trong bank");

  const { _id, id: _idField, createdAt, ...fields } = data;
  const updateDoc = {
    ...fields,
    updatedAt: new Date().toISOString(),
  };
  // normalize
  if (updateDoc.content !== undefined) updateDoc.content = String(updateDoc.content).trim();
  if (updateDoc.timeLimit !== undefined) updateDoc.timeLimit = Number(updateDoc.timeLimit) || 15;
  if (updateDoc.points !== undefined) updateDoc.points = Number(updateDoc.points) || 100;

  const result = await coll.findOneAndUpdate(
    { id },
    { $set: updateDoc },
    { returnDocument: "after" }
  );
  const updated = result;

  // ── Propagation: sync to all game questions that reference this bankId ──
  if (updated) {
    const syncFields = {};
    // only sync question-relevant fields
    for (const k of ["content", "options", "correctAnswer", "timeLimit", "points", "subject", "category"]) {
      if (updated[k] !== undefined) syncFields[k] = updated[k];
    }
    if (Object.keys(syncFields).length > 0) {
      await getCollection("questions").updateMany(
        { bankId: id },
        { $set: syncFields }
      );
      // also update games updatedAt for those affected games
      const affected = await getCollection("questions").distinct("gameId", { bankId: id });
      if (affected.length > 0) {
        const { ObjectId } = await import("mongodb");
        for (const gid of affected) {
          try {
            await getCollection("games").updateOne(
              { _id: new ObjectId(gid) },
              { $set: { updatedAt: new Date().toISOString() } }
            );
          } catch { /* ignore invalid ObjectId */ }
        }
      }
    }
  }
  return updated;
}

export async function remove(id) {
  const coll = getCollection(COLLECTION);
  const res = await coll.deleteOne({ id });
  // also optionally keep linked game questions but clear bankId reference? We clear bankId so they become independent
  if (res.deletedCount > 0) {
    await getCollection("questions").updateMany(
      { bankId: id },
      { $unset: { bankId: "" } }
    );
  }
  return res.deletedCount > 0;
}

export async function removeAll() {
  const coll = getCollection(COLLECTION);
  const count = await coll.countDocuments();
  await coll.deleteMany({});
  // clear bankId from all game questions
  await getCollection("questions").updateMany({}, { $unset: { bankId: "" } });
  return count;
}

/**
 * Clone/link a bank question into a specific game.
 * Creates a copy in questions collection with bankId reference.
 */
export async function linkToGame(bankId, gameId) {
  const bankQ = await getById(bankId);
  if (!bankQ) throw new Error("Không tìm thấy câu hỏi trong bank");
  const { _id, id, createdAt, updatedAt, ...rest } = bankQ;
  const coll = getCollection("questions");
  // check duplicate: same bankId already in this game?
  const exists = await coll.findOne({ gameId, bankId: bankId });
  if (exists) throw new Error("Câu hỏi này đã có trong game rồi");
  const doc = {
    ...rest,
    id: uid("question"),
    gameId,
    bankId: bankId,
  };
  await coll.insertOne(doc);
  // update questionsCount
  const count = await coll.countDocuments({ gameId });
  const { ObjectId } = await import("mongodb");
  try {
    await getCollection("games").updateOne(
      { _id: new ObjectId(gameId) },
      { $set: { questionsCount: count, updatedAt: new Date().toISOString() } }
    );
  } catch { }
  return doc;
}

export async function bulkLinkToGame(bankIds, gameId) {
  const results = [];
  for (const bid of bankIds) {
    try {
      const doc = await linkToGame(bid, gameId);
      results.push({ bankId: bid, success: true, questionId: doc.id });
    } catch (e) {
      results.push({ bankId: bid, success: false, error: e.message });
    }
  }
  return results;
}

export async function syncToGames(bankId) {
  const bankQ = await getById(bankId);
  if (!bankQ) throw new Error("Không tìm thấy câu hỏi trong bank");
  const syncFields = {};
  for (const k of ["content", "options", "correctAnswer", "timeLimit", "points", "subject", "category", "difficulty"]) {
    if (bankQ[k] !== undefined) syncFields[k] = bankQ[k];
  }
  const res = await getCollection("questions").updateMany(
    { bankId },
    { $set: syncFields }
  );
  return { matched: res.matchedCount, modified: res.modifiedCount };
}

export async function getStats() {
  const coll = getCollection(COLLECTION);
  const total = await coll.countDocuments();
  const bySubject = await coll.aggregate([
    { $group: { _id: "$subject", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray();
  const byDifficulty = await coll.aggregate([
    { $group: { _id: "$difficulty", count: { $sum: 1 } } }
  ]).toArray();
  const linkedCount = await getCollection("questions").countDocuments({ bankId: { $exists: true, $ne: null } });
  const distinctBankIds = await getCollection("questions").distinct("bankId", { bankId: { $exists: true } });
  return { total, bySubject, byDifficulty, linkedCount, linkedGames: distinctBankIds.length };
}
