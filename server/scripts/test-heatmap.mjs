// Test tích hợp: BẢN ĐỒ NHIỆT ĐIỂM MÙ — GET /api/heatmap/class/:classId
//   · Tổng hợp từ submissions (chấm lại từng câu từ answers đã lưu) +
//     results ván game (chỉ ván verified, bỏ source "assignment").
//   · Mức màu: <3 câu = insufficient; <50% đỏ; 50–80% vàng; ≥80% xanh,
//     trừ khi chậm rõ rệt so với lớp (levelFor có test đơn vị trong file này).
//   · completePlay từ đợt này lưu breakdown từng câu → ván mới có thống kê
//     theo câu hỏi trong heatmap.
//   · Phạm vi: giáo viên chỉ xem lớp mình phụ trách; học sinh bị 403.
// Chạy app Express THẬT trên Mongo in-memory (mẫu test-question-bank-pagination):
//   node server/scripts/test-heatmap.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `heatmap_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-heatmap-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "heatmap_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { levelFor } = await import("../src/services/heatmapService.js");
const gamePlay = await import("../src/services/gamePlayService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const T1 = "user-hm-teacher1";
const T2 = "user-hm-teacher2";
const S1 = "user-hm-s1";
const S2 = "user-hm-s2";
const S3 = "user-hm-s3";
const tokT1 = signToken({ id: T1, username: "hmteacher1", role: "teacher", name: "GV Một" });
const tokT2 = signToken({ id: T2, username: "hmteacher2", role: "teacher", name: "GV Hai" });
const tokAdmin = signToken({ id: "user-hm-admin", username: "hmadmin", role: "admin", name: "HM Admin" });
const tokS1 = signToken({ id: S1, username: "hms1", role: "student", name: "HS Một" });

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};
const checkTrue = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  → ${extra}`}`);
  if (!cond) failed++;
};

const req = async (p, token) => {
  const res = await fetch(`${base}${p}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
};

// ── Seed ────────────────────────────────────────────────────────────────
const now = new Date().toISOString();
await getCollection("users").insertMany([
  { id: T1, username: "hmteacher1", name: "GV Một", role: "teacher", passwordHash: "x" },
  { id: T2, username: "hmteacher2", name: "GV Hai", role: "teacher", passwordHash: "x" },
  { id: S1, username: "hms1", name: "HS Một", role: "student", passwordHash: "x", classId: "cls-hm-1" },
  { id: S2, username: "hms2", name: "HS Hai", role: "student", passwordHash: "x", classId: "cls-hm-1" },
  { id: S3, username: "hms3", name: "HS Ba", role: "student", passwordHash: "x", classId: "cls-hm-1" },
  { id: "user-hm-s4", username: "hms4", name: "HS Bốn", role: "student", passwordHash: "x", classId: "cls-hm-2" },
  { id: "user-hm-s5", username: "hms5", name: "HS Năm", role: "student", passwordHash: "x", classId: "cls-hm-3" },
]);
await getCollection("classes").insertMany([
  { id: "cls-hm-1", name: "Lớp 3A", code: "HM1", status: "ACTIVE" },
  { id: "cls-hm-2", name: "Lớp 3B", code: "HM2", status: "ACTIVE" },
  { id: "cls-hm-3", name: "Lớp 3C", code: "HM3", status: "ACTIVE" },
]);
await getCollection("teacher_classes").insertMany([
  { id: "tc-hm-1", teacherId: T1, classId: "cls-hm-1" },
  { id: "tc-hm-3", teacherId: T1, classId: "cls-hm-3" },
]);

const opts = [{ id: "a", content: "Đáp án A" }, { id: "b", content: "Đáp án B" }];
await getCollection("question_banks").insertMany([
  { id: "qb-hm-1", content: "10 chia 3 dư mấy?", options: opts, correctAnswer: "a", subject: "math", category: "Phép chia có dư" },
  { id: "qb-hm-2", content: "14 chia 4 dư mấy?", options: opts, correctAnswer: "a", subject: "math", category: "Phép chia có dư" },
  { id: "qb-hm-3", content: "17 chia 5 dư mấy?", options: opts, correctAnswer: "a", subject: "math", category: "Phép chia có dư" },
  { id: "qb-hm-4", content: "20 chia 6 dư mấy?", options: opts, correctAnswer: "a", subject: "math", category: "Phép chia có dư" },
]);
await getCollection("games").insertOne({
  id: "game-hm-1", name: "Game Nhân Nhanh", description: "x", status: "published",
  questionsCount: 2, playersCount: 0, code: "HMGM1", subject: "Toán", topic: "Phép nhân",
});
await getCollection("questions").insertMany([
  { id: "gq-hm-1", gameId: "game-hm-1", content: "2 x 2 = ?", options: opts, correctAnswer: "a" },
  { id: "gq-hm-2", gameId: "game-hm-1", content: "3 x 3 = ?", options: opts, correctAnswer: "a" },
]);
await getCollection("assignments").insertOne({
  id: "asg-hm-1", teacherId: T1, title: "Bài tập chia có dư", classId: "cls-hm-1",
  code: "HMASG1", status: "ACTIVE", questionIds: ["qb-hm-1", "qb-hm-2", "qb-hm-3", "qb-hm-4"],
});
const sub = (id, studentId, answers) => ({
  id, assignmentId: "asg-hm-1", studentId, status: "SUBMITTED",
  score: 0, correctCount: 0, wrongCount: 0, totalQuestions: 4, answers, submittedAt: now,
});
await getCollection("submissions").insertMany([
  // S1: đúng 1/4 (25%) → đỏ; làm chậm (TB 31,25s)
  sub("sub-hm-1", S1, [
    { questionId: "qb-hm-1", value: "a", timeSpent: 5 },
    { questionId: "qb-hm-2", value: "b", timeSpent: 40 },
    { questionId: "qb-hm-3", value: "b", timeSpent: 40 },
    { questionId: "qb-hm-4", value: "b", timeSpent: 40 },
  ]),
  // S2: đúng 4/4, nhanh → xanh
  sub("sub-hm-2", S2, [
    { questionId: "qb-hm-1", value: "a", timeSpent: 5 },
    { questionId: "qb-hm-2", value: "a", timeSpent: 5 },
    { questionId: "qb-hm-3", value: "a", timeSpent: 5 },
    { questionId: "qb-hm-4", value: "a", timeSpent: 5 },
  ]),
  // S3: đúng 2/4 (50%) → vàng
  sub("sub-hm-3", S3, [
    { questionId: "qb-hm-1", value: "a", timeSpent: 8 },
    { questionId: "qb-hm-2", value: "a", timeSpent: 8 },
    { questionId: "qb-hm-3", value: "b", timeSpent: 8 },
    { questionId: "qb-hm-4", value: "b", timeSpent: 8 },
  ]),
]);
const result = (id, userId, extra) => ({
  id, gameId: "game-hm-1", playerId: userId, playerName: "x", score: 0,
  correctAnswers: 0, totalQuestions: 0, accuracy: 0, userId, createdAt: now, ...extra,
});
await getCollection("results").insertMany([
  // S1 chơi game Phép nhân: 9/10 đúng, 100 giây → xanh
  result("res-hm-1", S1, { correctAnswers: 9, totalQuestions: 10, accuracy: 90, completionTime: 100, verified: true, source: "html-game" }),
  // S2: ván KHÔNG verified (client tự khai) → phải bị bỏ qua hoàn toàn
  result("res-hm-2", S2, { correctAnswers: 0, totalQuestions: 10, accuracy: 0, completionTime: 50, verified: false, source: "html-game" }),
  // S3: 2/10 đúng → đỏ ở Phép nhân
  result("res-hm-3", S3, { correctAnswers: 2, totalQuestions: 10, accuracy: 20, completionTime: 200, verified: true, source: "html-game" }),
  // S1: result của bài giao (source assignment) → bỏ qua, tránh đếm trùng submissions
  result("res-hm-4", S1, { gameId: null, correctAnswers: 1, totalQuestions: 4, accuracy: 25, verified: true, source: "assignment" }),
]);

// ── Test đơn vị levelFor ────────────────────────────────────────────────
check("levelFor: 0 câu → none", levelFor({ answered: 0 }), "none");
check("levelFor: 2 câu → insufficient", levelFor({ answered: 2, accuracy: 0 }), "insufficient");
check("levelFor: 49% → red", levelFor({ answered: 4, accuracy: 49 }), "red");
check("levelFor: 50% → yellow", levelFor({ answered: 4, accuracy: 50 }), "yellow");
check("levelFor: 79% → yellow", levelFor({ answered: 10, accuracy: 79 }), "yellow");
check("levelFor: 90% không có dữ liệu giờ → green", levelFor({ answered: 10, accuracy: 90 }), "green");
check("levelFor: 90% nhưng chậm >1,5× lớp → yellow",
  levelFor({ answered: 10, accuracy: 90, avgResponseSec: 31, classAvgResponseSec: 10 }), "yellow");
check("levelFor: 90% chậm nhẹ → green",
  levelFor({ answered: 10, accuracy: 90, avgResponseSec: 12, classAvgResponseSec: 10 }), "green");

// ── Endpoint: phạm vi truy cập ──────────────────────────────────────────
const rT2 = await req("/api/heatmap/class/cls-hm-1", tokT2);
check("GV không phụ trách lớp → 403", rT2.status, 403);
const rStudent = await req("/api/heatmap/class/cls-hm-1", tokS1);
check("Học sinh gọi → 403", rStudent.status, 403);
const r404 = await req("/api/heatmap/class/cls-khong-co", tokT1);
check("Lớp không tồn tại → 404", r404.status, 404);
const rAdmin = await req("/api/heatmap/class/cls-hm-1", tokAdmin);
check("Admin xem được mọi lớp → 200", rAdmin.status, 200);

// ── Endpoint: nội dung tổng hợp ─────────────────────────────────────────
const r = await req("/api/heatmap/class/cls-hm-1", tokT1);
check("GV phụ trách xem lớp mình → 200", r.status, 200);
const d = r.body?.data || {};
check("hasData = true", d.hasData, true);
check("Số học sinh của lớp = 3", d.students?.length, 3);
check("Chủ đề gồm Chia có dư + Phép nhân", (d.topics || []).map((t) => t.label).sort(), ["Phép chia có dư", "Phép nhân"]);

const cell = (sid, topic) => (d.cells || []).find((c) => c.studentId === sid && c.topicKey === topic);
const cS1Chia = cell(S1, "Phép chia có dư");
check("S1 × Chia có dư: answered 4", cS1Chia?.answered, 4);
check("S1 × Chia có dư: accuracy 25", cS1Chia?.accuracy, 25);
check("S1 × Chia có dư: level red", cS1Chia?.level, "red");
check("S1 × Chia có dư: avgResponseSec 31.3 (từ timeSpent bài nộp)", cS1Chia?.avgResponseSec, 31.3);
check("S2 × Chia có dư: level green", cell(S2, "Phép chia có dư")?.level, "green");
check("S3 × Chia có dư: level yellow (50%)", cell(S3, "Phép chia có dư")?.level, "yellow");
check("S1 × Phép nhân: accuracy 90, green", cell(S1, "Phép nhân")?.accuracy, 90);
check("S1 × Phép nhân: level green", cell(S1, "Phép nhân")?.level, "green");
check("S3 × Phép nhân: level red (20%)", cell(S3, "Phép nhân")?.level, "red");
checkTrue("S2 × Phép nhân: KHÔNG có ô (ván unverified bị bỏ qua)", !cell(S2, "Phép nhân"), JSON.stringify(d.cells));

const alertChia = (d.alerts || []).find((a) => a.topicKey === "Phép chia có dư");
check("Cảnh báo Chia có dư: đúng câu tổng hợp", alertChia?.text, "Có 1/3 học sinh đang gặp khó khăn ở kỹ năng Phép chia có dư");
check("Cảnh báo đầu tiên là chủ đề có nhiều đỏ nhất/đứng trước", d.alerts?.[0]?.type, "red");

const qs3 = (d.questionStats || []).find((q) => q.questionId === "qb-hm-3");
check("Câu qb-hm-3: attempts 3", qs3?.attempts, 3);
check("Câu qb-hm-3: wrongRate 67", qs3?.wrongRate, 67);
checkTrue("Câu qb-hm-3: avgTimeSec có từ timeSpent", typeof qs3?.avgTimeSec === "number", JSON.stringify(qs3));

// ── Lớp chưa có dữ liệu ─────────────────────────────────────────────────
const rEmpty = await req("/api/heatmap/class/cls-hm-3", tokT1);
check("Lớp chưa có dữ liệu → 200", rEmpty.status, 200);
check("Lớp chưa có dữ liệu: hasData false", rEmpty.body?.data?.hasData, false);
check("Lớp chưa có dữ liệu: topics rỗng", rEmpty.body?.data?.topics?.length, 0);

// ── completePlay lưu breakdown → ván mới có thống kê từng câu ───────────
const play = await gamePlay.completePlay({
  userId: S2, playerName: "HS Hai", gameId: "game-hm-1", playId: "play-hm-1",
  answers: [
    { questionId: "gq-hm-1", value: "a", timeSpent: 7 },
    { questionId: "gq-hm-2", value: "b", timeSpent: 9 },
  ],
  timeUsed: 16,
});
check("completePlay: breakdown có 2 câu", play.breakdown?.length, 2);
check("completePlay: breakdown giữ timeSpent", play.breakdown?.[0]?.timeSpent, 7);
check("completePlay: breakdown chấm đúng/sai", play.breakdown?.map((b) => b.isCorrect), [true, false]);

const r2 = await req("/api/heatmap/class/cls-hm-1", tokT1);
const d2 = r2.body?.data || {};
const gq1 = (d2.questionStats || []).find((q) => q.questionId === "gq-hm-1");
check("Sau ván mới: câu gq-hm-1 có trong questionStats", gq1?.attempts, 1);
check("Sau ván mới: gq-hm-1 wrongRate 0", gq1?.wrongRate, 0);
check("Sau ván mới: gq-hm-1 avgTimeSec 7", gq1?.avgTimeSec, 7);
const cS2Nhan = (d2.cells || []).find((c) => c.studentId === S2 && c.topicKey === "Phép nhân");
check("Sau ván mới: S2 × Phép nhân answered 2 → insufficient", cS2Nhan?.level, "insufficient");

server.close();
if (mongod) await mongod.stop().catch(() => {});
console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
