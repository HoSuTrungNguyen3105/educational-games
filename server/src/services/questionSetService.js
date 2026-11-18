import { getCollection } from "../db.js";
import { uid } from "../utils/id.js";
import { isAnswerCorrect } from "../lib/gradeAnswer.js";

const COLLECTION = "question_sets";
const BANK = "question_banks";

/**
 * Bộ đề (question sets) — đóng gói câu hỏi của `question_banks` thành COMBO
 * theo bài/bộ (vd "Tiếng Việt lớp 3" gồm N câu) để admin quản trị theo bộ và
 * học sinh luyện tập cả bộ thay vì thấy từng câu rời.
 *
 * Quy ước dữ liệu:
 *  · `questionIds` là mảng id tham chiếu `question_banks`; một câu được thuộc
 *    nhiều bộ. Khi LƯU, id không tồn tại trong bank bị LOẠI khỏi mảng và id
 *    trùng bị khử trùng (giữ thứ tự đầu tiên) — bộ luôn sạch ngay từ đầu.
 *  · Câu bị xóa khỏi bank SAU khi đã vào bộ: khi ĐỌC/ĐẾM chỉ tính câu còn
 *    tồn tại (`questionCount`, danh sách chi tiết) — không sửa ngược dữ liệu
 *    đã lưu, nên bộ tự "gầy" đi đúng thực tế của bank.
 *  · DTO cho học sinh KHÔNG chứa `correctAnswer` (cùng chuẩn strip của
 *    routes/questions.js và gameVersionService.stripAnswer). Đáp án đúng chỉ
 *    lộ qua `checkAnswer` — server chấm bằng `isAnswerCorrect` dùng chung rồi
 *    mới trả đáp án + giải thích SAU khi học sinh đã trả lời (mẫu
 *    POST /questions/explain-context).
 */

const GRADES = [1, 2, 3, 4, 5];

/** "" / null / số ngoài 1–5 → null (chưa phân lớp); số hợp lệ → number. */
function normGrade(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return GRADES.includes(n) ? n : null;
}

/** Chuẩn hoá mảng id câu hỏi: chỉ chuỗi không rỗng, khử trùng giữ thứ tự. */
function cleanIds(ids) {
  if (!Array.isArray(ids)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of ids) {
    const id = String(raw ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/** Lọc mảng id chỉ giữ câu còn tồn tại trong bank (dùng khi lưu). */
async function keepExisting(ids) {
  if (!ids.length) return [];
  const found = await getCollection(BANK).find({ id: { $in: ids } }).project({ id: 1 }).toArray();
  const alive = new Set(found.map((d) => d.id));
  return ids.filter((id) => alive.has(id));
}

/** Map id → document bank cho một danh sách id (chỉ câu còn tồn tại). */
async function bankMap(ids) {
  if (!ids.length) return new Map();
  const docs = await getCollection(BANK).find({ id: { $in: ids } }).toArray();
  return new Map(docs.map((d) => [d.id, d]));
}

/** Bản sao câu hỏi cho học sinh: bỏ `correctAnswer` (và `_id` nội bộ). */
export function stripBankQuestion(q) {
  if (!q) return q;
  const rest = { ...q };
  delete rest._id;
  delete rest.correctAnswer;
  return rest;
}

/** Bỏ `_id` nội bộ của Mongo khỏi một document trước khi trả client. */
function withoutMongoId(doc) {
  if (!doc) return doc;
  const rest = { ...doc };
  delete rest._id;
  return rest;
}

/** DTO danh sách: bộ + `questionCount` = số câu CÒN TỒN TẠI trong bank. */
function toListItem(set, aliveCount) {
  return { ...withoutMongoId(set), questionCount: aliveCount };
}

export async function listSets({ subject, grade } = {}) {
  const filter = {};
  if (subject && subject !== "all") filter.subject = subject;
  if (grade && grade !== "all" && GRADES.includes(Number(grade))) filter.grade = Number(grade);
  const sets = await getCollection(COLLECTION).find(filter).sort({ updatedAt: -1 }).toArray();
  // Một truy vấn bank duy nhất cho mọi bộ để đếm câu còn sống.
  const allIds = [...new Set(sets.flatMap((s) => s.questionIds || []))];
  const alive = new Set(
    (await getCollection(BANK).find({ id: { $in: allIds } }).project({ id: 1 }).toArray()).map((d) => d.id)
  );
  return sets.map((s) => toListItem(s, (s.questionIds || []).filter((id) => alive.has(id)).length));
}

export async function getSet(id) {
  const set = await getCollection(COLLECTION).findOne({ id });
  return set || null;
}

/**
 * Chi tiết bộ: thông tin bộ + `questions` đầy đủ theo ĐÚNG thứ tự
 * questionIds (câu đã bị xóa khỏi bank bị bỏ qua). `questionCount` đếm
 * theo danh sách câu thực tế này.
 */
export async function getSetWithQuestions(id) {
  const set = await getSet(id);
  if (!set) return null;
  const map = await bankMap(set.questionIds || []);
  const questions = (set.questionIds || [])
    .map((qid) => map.get(qid))
    .filter(Boolean)
    .map(withoutMongoId);
  return { ...withoutMongoId(set), questionCount: questions.length, questions };
}

function buildDoc(data, ownerId, now) {
  const name = String(data.name || "").trim();
  if (!name) throw new Error("Tên bộ đề là bắt buộc");
  if (data.questionIds !== undefined && !Array.isArray(data.questionIds)) {
    throw new Error("questionIds phải là mảng id câu hỏi");
  }
  return {
    name,
    subject: String(data.subject || "").trim(),
    grade: normGrade(data.grade),
    description: String(data.description || "").trim(),
    questionIds: cleanIds(data.questionIds),
    ...(ownerId ? { ownerId } : {}),
    updatedAt: now,
  };
}

export async function createSet(ownerId, data = {}) {
  const now = new Date().toISOString();
  const doc = { id: uid("qset"), createdAt: now, ...buildDoc(data, ownerId, now) };
  doc.questionIds = await keepExisting(doc.questionIds);
  await getCollection(COLLECTION).insertOne(doc);
  return getSetWithQuestions(doc.id);
}

export async function updateSet(id, data = {}) {
  const coll = getCollection(COLLECTION);
  const existing = await coll.findOne({ id });
  if (!existing) return null;
  // Chỉ nhận các field sửa được — id/ownerId/createdAt không bao giờ đổi qua PUT.
  const merged = { ...existing };
  for (const k of ["name", "subject", "grade", "description", "questionIds"]) {
    if (data[k] !== undefined) merged[k] = data[k];
  }
  const patch = buildDoc(merged, null, new Date().toISOString());
  delete patch.ownerId;
  patch.questionIds = data.questionIds !== undefined
    ? await keepExisting(patch.questionIds)
    : (existing.questionIds || []);
  await coll.updateOne({ id }, { $set: patch });
  return getSetWithQuestions(id);
}

export async function removeSet(id) {
  const res = await getCollection(COLLECTION).deleteOne({ id });
  return res.deletedCount > 0;
}

/**
 * Chấm MỘT câu trong bộ cho luồng tự luyện của học sinh. Chỉ chấm câu THUỘC
 * bộ; trả đáp án đúng + giải thích sau khi đã có câu trả lời (kể cả trả lời
 * rỗng/sai). Không ghi điểm/xu/kết quả ở đâu cả — tự luyện thuần client.
 */
export async function checkAnswer(setId, questionId, value) {
  const set = await getSet(setId);
  if (!set) return null;
  if (!(set.questionIds || []).includes(questionId)) return null;
  const q = await getCollection(BANK).findOne({ id: questionId });
  if (!q) return null;
  return {
    questionId,
    isCorrect: isAnswerCorrect(q, value),
    correctAnswer: q.correctAnswer ?? null,
    explanation: q.explanation || "",
  };
}
