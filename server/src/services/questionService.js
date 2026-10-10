import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";
import {
  correctKeyOf,
  isAnswerCorrect,
  isTextQuestion,
  normalizedOptions,
  resolveOptionText,
} from "../lib/gradeAnswer.js";

const COLLECTION = "questions";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export async function listByGame(gameId, { inputMode } = {}) {
  const filter = { gameId };
  if (inputMode) filter.inputMode = inputMode;
  return getCollection(COLLECTION).find(filter).sort({ id: 1 }).toArray();
}

export async function listAll({ limit = 500 } = {}) {
  return getCollection(COLLECTION).find({}).sort({ gameId: 1, id: 1 }).limit(limit).toArray();
}

export async function save(gameId, questions) {
  const coll = getCollection(COLLECTION);
  await coll.deleteMany({ gameId });

  const prepared = questions.map((q) => {
    const { _id, ...rest } = q;
    return { ...rest, id: q.id || uid("question"), gameId };
  });
  if (prepared.length > 0) await coll.insertMany(prepared);

  await getCollection("games").updateOne(
    { _id: new ObjectId(gameId) },
    { $set: { questionsCount: prepared.length, updatedAt: new Date().toISOString() } }
  );
  return prepared;
}

export async function add(gameId, question) {
  const doc = { ...question, id: question.id || uid("question"), gameId };
  await getCollection(COLLECTION).insertOne(doc);
  return doc;
}

export async function getById(questionId) {
  return getCollection(COLLECTION).findOne({ id: questionId });
}

/** Bỏ ký tự điều khiển trong text do giáo viên soạn, trước khi đưa sang dịch vụ AI. */
function safeText(value, max = 500) {
  if (value == null) return null;
  const s = String(value).replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  return s.length ? (s.length > max ? s.slice(0, max) : s) : null;
}

/**
 * Dựng ngữ cảnh giải thích cho MỘT câu hỏi mà học sinh vừa trả lời.
 *
 * Mục đích: học sinh KHÔNG được biết đáp án đúng trước khi trả lời (xem `routes/questions.js`
 * — `correctAnswer` bị strip khỏi mọi response cho non-staff). Endpoint này chỉ mở đáp án
 * đúng cho chính backend và cho dịch vụ AI, sau khi học sinh đã nộp câu trả lời.
 *
 * Chấm điểm dùng CHUNG `isAnswerCorrect` với `gradeAnswers` / `gamePlayService` — không nhân
 * bản logic chấm, không ảnh hưởng điểm/xu/thành tích.
 *
 * @returns {Promise<object|null>} `null` nếu không tìm thấy câu hỏi (hoặc sai game).
 */
export async function buildExplainContext({ gameId, questionId, answer } = {}) {
  if (!questionId) return null;
  const question = await getById(questionId);
  if (!question) return null;
  if (gameId && String(question.gameId ?? "") !== String(gameId)) return null;

  const answered = answer !== undefined && answer !== null && String(answer) !== "";
  const correctKey = correctKeyOf(question);
  const textMode = isTextQuestion(question);

  return {
    questionId: question.id,
    content: safeText(question.content ?? question.question, 500),
    subject: safeText(question.subject, 80),
    topic: safeText(question.topic, 120),
    inputMode: question.inputMode === "input" || textMode ? "input" : "choice",
    options: normalizedOptions(question),
    answered,
    selectedAnswerText: answered ? safeText(resolveOptionText(question, answer), 200) : null,
    isCorrect: answered && isAnswerCorrect(question, answer),
    correctAnswerText: safeText(resolveOptionText(question, correctKey), 200),
    explanation: safeText(question.explanation, 400),
  };
}

export async function removeAll() {
  const coll = getCollection(COLLECTION);
  const count = await coll.countDocuments();
  await coll.deleteMany({});
  return count;
}

export async function updateOne(gameId, questionId, data) {
  const coll = getCollection(COLLECTION);
  const { _id, id, gameId: _gid, ...fields } = data;
  const result = await coll.findOneAndUpdate(
    { id: questionId, gameId },
    { $set: fields },
    { returnDocument: "after" }
  );
  if (result) {
    const count = await coll.countDocuments({ gameId });
    await getCollection("games").updateOne(
      { _id: new ObjectId(gameId) },
      { $set: { questionsCount: count, updatedAt: new Date().toISOString() } }
    );
  }
  return result;
}

export async function removeOne(gameId, questionId) {
  const coll = getCollection(COLLECTION);
  const result = await coll.deleteOne({ id: questionId, gameId });
  if (result.deletedCount > 0) {
    const count = await coll.countDocuments({ gameId });
    await getCollection("games").updateOne(
      { _id: new ObjectId(gameId) },
      { $set: { questionsCount: count, updatedAt: new Date().toISOString() } }
    );
  }
  return result.deletedCount > 0;
}
