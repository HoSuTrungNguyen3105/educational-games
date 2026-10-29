import { getCollection } from "../db.js";

const COLLECTION = "question_banks";
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * Question Bank: independent pool, not tied to a game.
 * When bank question is updated, all game questions with bankId === id are synced.
 */

// Bốn field dưới đây phục vụ đúng giao diện Ngân hàng câu hỏi trong khu quản
// trị (ma trận môn × lớp, thẻ câu hỏi có emoji + giọng đọc + giải thích như
// src/games/_tools/admin.html). Tất cả đều optional nên bank cũ không sửa gì
// vẫn hợp lệ.
const GRADES = [1, 2, 3, 4, 5];
const LANGS = ["vi-VN", "en-US"];

/** "" / null / số ngoài 1–5 → null (chưa phân lớp); số hợp lệ → number. */
function normGrade(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return GRADES.includes(n) ? n : null;
}

function normIcon(v) {
  return String(v || "").trim().slice(0, 8);
}

function normLang(v) {
  return LANGS.includes(v) ? v : "vi-VN";
}

export async function listAll({ search, subject, category, grade, limit = 500 } = {}) {
  const coll = getCollection(COLLECTION);
  const filter = {};
  if (subject && subject !== "all") filter.subject = subject;
  if (category && category !== "all") filter.category = category;
  if (grade && grade !== "all" && GRADES.includes(Number(grade))) filter.grade = Number(grade);
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

/**
 * Kiểm tra một câu hỏi theo đúng luật của trang Ngân hàng câu hỏi
 * (src/games/_tools/admin.html → qIssues): 2–4 đáp án khác rỗng, không trùng
 * nhau (không phân biệt hoa thường), phải chọn được đáp án đúng.
 */
function checkQuestion(doc) {
  if (!doc.content) throw new Error("Nội dung câu hỏi là bắt buộc");
  const opts = (doc.options || []).map(o => String(o?.content || "").trim());
  if (opts.length < 2 || opts.length > 4) throw new Error("Cần 2–4 đáp án");
  if (opts.some(t => !t)) throw new Error("Có đáp án đang để trống");
  const seen = new Set(opts.map(t => t.toLowerCase()));
  if (seen.size < opts.length) throw new Error("Có đáp án trùng nhau");
  const ids = (doc.options || []).map(o => o?.id);
  if (!doc.correctAnswer || !ids.includes(doc.correctAnswer)) {
    throw new Error("Phải chọn đáp án đúng trong các đáp án");
  }
}

/** Dựng document hoàn chỉnh từ dữ liệu client + đóng dấu thời gian. */
function buildDoc(data, now) {
  return {
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
    grade: normGrade(data.grade),
    icon: normIcon(data.icon),
    explanation: String(data.explanation || "").trim(),
    lang: normLang(data.lang),
    createdAt: now,
    updatedAt: now,
  };
}

export async function create(data) {
  const doc = buildDoc(data, new Date().toISOString());
  checkQuestion(doc);
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

/**
 * Nhập hàng loạt cho trang Ngân hàng câu hỏi (CSV/JSON).
 *  · mode "merge"  — giữ câu cũ, bỏ câu trùng (nội dung + đáp án đúng giống hệt).
 *  · mode "replace"— xóa trắng bank rồi ghi lại; mọi bản sao trong game mất link.
 * Câu sai luật bị bỏ qua và trả về trong `errors` (kèm dòng thứ mấy) thay vì
 * làm hỏng cả đợt nhập.
 */
export async function createMany(list, { mode = "merge" } = {}) {
  const items = Array.isArray(list) ? list : [];
  if (!items.length) throw new Error("Danh sách câu hỏi rỗng");
  if (items.length > 2000) throw new Error("Mỗi lần nhập tối đa 2000 câu");
  const coll = getCollection(COLLECTION);

  if (mode === "replace") {
    await coll.deleteMany({});
    await getCollection("questions").updateMany({}, { $unset: { bankId: "" } });
  }
  const current = await coll.find({}).toArray();
  const sig = (d) => `${String(d.content || "").trim().toLowerCase()}|${correctText(d)}`;
  const seen = new Set(current.map(sig));

  const now = new Date().toISOString();
  const docs = [];
  const errors = [];
  items.forEach((raw, i) => {
    try {
      const doc = buildDoc(raw, now);
      checkQuestion(doc);
      const key = sig(doc);
      if (seen.has(key)) { errors.push({ index: i, message: "Trùng câu đã có, bỏ qua" }); return; }
      seen.add(key);
      docs.push(doc);
    } catch (e) {
      errors.push({ index: i, message: e.message });
    }
  });
  if (docs.length) await coll.insertMany(docs, { ordered: false });
  return { created: docs.length, skipped: errors.length, errors, total: await coll.countDocuments() };
}

/** Đáp án đúng dưới dạng chữ, dùng để phát hiện câu trùng khi nhập. */
function correctText(doc) {
  const opts = Array.isArray(doc.options) ? doc.options : [];
  const hit = opts.find(o => o?.id === doc.correctAnswer);
  return String((hit?.content ?? "")).trim().toLowerCase();
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
  if (updateDoc.grade !== undefined) updateDoc.grade = normGrade(updateDoc.grade);
  if (updateDoc.icon !== undefined) updateDoc.icon = normIcon(updateDoc.icon);
  if (updateDoc.explanation !== undefined) updateDoc.explanation = String(updateDoc.explanation).trim();
  if (updateDoc.lang !== undefined) updateDoc.lang = normLang(updateDoc.lang);
  // Kiểm trên bản gộp (client chỉ gửi vài field cũng vẫn phải đủ 2–4 đáp án hợp lệ).
  checkQuestion({ ...existing, ...updateDoc });

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
    for (const k of ["content", "options", "correctAnswer", "timeLimit", "points", "subject", "category", "grade", "icon", "explanation", "lang"]) {
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
  // Same fields as the update() propagation above — grade/icon/explanation/lang
  // là phần giao diện Ngân hàng câu hỏi thêm vào, thiếu chúng thì bản sao trong
  // game tụt lại so với bank dù admin vừa bấm "Đồng bộ".
  for (const k of ["content", "options", "correctAnswer", "timeLimit", "points", "subject", "category", "difficulty", "grade", "icon", "explanation", "lang"]) {
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
