// Test tích hợp: bài giao chọn câu hỏi từ NGÂN HÀNG CÂU HỎI phải chấm được.
// Trang Tạo bài tập (dashboard/assignments/new) nay chỉ chọn câu từ
// `question_banks`; `loadAssignmentQuestions` (chấm điểm + chi tiết kết quả)
// phải tra được cả hai nguồn: `questions` (bài cũ theo game) và
// `question_banks` (bài mới), giữ đúng thứ tự questionIds.
// Chạy assignmentService THẬT trên Mongo in-memory (mẫu test-parent-blocked):
//   node server/scripts/test-assignment-bank-questions.mjs
// Cần mongodb-memory-server (cài --no-save ở máy dev, không phải dep runtime).
import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-mongo-data-asgnbank");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "assignment_bank_test";

const db = await import("../src/db.js");
await db.connect();
const { getCollection } = db;
const svc = await import("../src/services/assignmentService.js");

const OPTS = [
  { id: "a", content: "Đáp án A" },
  { id: "b", content: "Đáp án B" },
];

// 1 câu theo game (nguồn cũ) + 2 câu ngân hàng (nguồn mới)
await getCollection("questions").insertOne({
  id: "question-game1", gameId: "game-1", content: "Câu theo game",
  options: OPTS, correctAnswer: "a", points: 100,
});
await getCollection("question_banks").insertMany([
  { id: "qbank-1", content: "Câu bank 1", options: OPTS, correctAnswer: "b", points: 100, subject: "Toán", grade: 3 },
  { id: "qbank-2", content: "Câu bank 2", options: OPTS, correctAnswer: "a", points: 100, subject: "Toán", grade: 3 },
]);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};

const STUDENT = "user-student-1";

// ── Ca 1: bài TOÀN câu bank (đúng luồng trang Tạo bài mới) ──
const a1 = await svc.createAssignment({
  teacherId: "user-teacher", title: "Bài từ bank", classId: "cls-1",
  questionIds: ["qbank-1", "qbank-2"], isExam: true, examDuration: 10,
});
const s1 = await svc.startSubmission({ assignmentId: a1.id, studentId: STUDENT });
const r1 = await svc.submitAnswers({
  submissionId: s1.id, studentId: STUDENT,
  answers: [
    { questionId: "qbank-1", value: "b" }, // đúng
    { questionId: "qbank-2", value: "b" }, // sai (đáp án đúng: a)
  ],
});
check("bank-only: totalQuestions", r1.totalQuestions, 2);
check("bank-only: correctCount", r1.correctCount, 1);
check("bank-only: score", r1.score, 50);

// ── Ca 2: bài TRỘN bank + game, thứ tự questionIds phải được giữ ──
const a2 = await svc.createAssignment({
  teacherId: "user-teacher", title: "Bài trộn", classId: "cls-1",
  questionIds: ["qbank-2", "question-game1", "qbank-1"], isExam: true, examDuration: 10,
});
const s2 = await svc.startSubmission({ assignmentId: a2.id, studentId: STUDENT });
const r2 = await svc.submitAnswers({
  submissionId: s2.id, studentId: STUDENT,
  answers: [
    { questionId: "qbank-2", value: "a" },       // đúng
    { questionId: "question-game1", value: "a" }, // đúng
    { questionId: "qbank-1", value: "a" },        // sai (đáp án đúng: b)
  ],
});
check("mixed: totalQuestions", r2.totalQuestions, 3);
check("mixed: correctCount", r2.correctCount, 2);

const detail = await svc.getAssignmentResult(a2.id, STUDENT, { showCorrectAnswer: true });
const detailIds = (detail?.detail || []).map((d) => d.questionId);
check("mixed: chi tiết kết quả giữ thứ tự questionIds", detailIds, ["qbank-2", "question-game1", "qbank-1"]);
const detailContents = (detail?.detail || []).map((d) => d.question);
check("mixed: nội dung câu bank có trong chi tiết", detailContents.includes("Câu bank 1") && detailContents.includes("Câu bank 2"), true);

// ── Ca 3: bài chỉ câu game (hồi quy — luồng cũ không đổi) ──
const a3 = await svc.createAssignment({
  teacherId: "user-teacher", title: "Bài cũ", classId: "cls-1",
  questionIds: ["question-game1"], isExam: false,
});
const s3 = await svc.startSubmission({ assignmentId: a3.id, studentId: STUDENT });
const r3 = await svc.submitAnswers({
  submissionId: s3.id, studentId: STUDENT,
  answers: [{ questionId: "question-game1", value: "a" }],
});
check("game-only: totalQuestions", r3.totalQuestions, 1);
check("game-only: correctCount", r3.correctCount, 1);

await db.disconnect?.().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
