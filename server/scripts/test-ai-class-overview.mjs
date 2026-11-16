// Test TỔNG QUAN LỚP (GET /api/ai/class-overview):
//  (a) teacher/admin đọc được: totalPlays/accuracy/averageScore tính đúng từ
//      results verified; bản ghi verified:false bị loại; studentsWithData
//      đếm đúng số học sinh có lượt chơi; weakTopics xếp đúng nhất lên đầu
//      và chỉ gồm chủ đề đủ >= 5 câu hỏi.
//  (b) student gọi → 403; chưa đăng nhập → 401.
// Cùng mẫu test-ai-chat-history: Mongo in-memory, KHÔNG gọi mạng ngoài,
// KHÔNG cần AI (endpoint là số liệu hệ thống thuần).
//   node server/scripts/test-ai-class-overview.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-overview-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_class_overview_test";

const db = await import("../src/db.js");
await db.initDatabase();
// Chờ heavy-init (seed users.json) xong để tránh đua validator — cùng bài học test #77.
for (let i = 0; i < 120; i++) {
  if (await db.getCollection("users").findOne({ id: "user-002" })) break;
  await new Promise((r) => setTimeout(r, 250));
}
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const OLD = "2026-01-05T00:00:00.000Z";
const mkUser = (id, role) => ({
  id, username: id.replace("user-", ""), name: `Tên ${id}`, role, passwordHash: "x", createdAt: OLD,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs1", "student"),
  mkUser("user-hs2", "student"),
  mkUser("user-hs3", "student"), // không có lượt chơi
  mkUser("user-gv1", "teacher"),
  mkUser("user-admin1", "admin"),
]);

await db.getCollection("games").insertMany([
  { id: "game-a", code: "game-a", name: "Cộng trừ vui", subject: "Toán", topic: "Phép cộng" },
  { id: "game-b", code: "game-b", name: "Đọc hiểu vui", subject: "Tiếng Việt", topic: "Đọc hiểu" },
]);

let resultSeq = 0;
const mkResult = (userId, gameId, correctAnswers, score, extra = {}) => ({
  id: `result-${++resultSeq}`,
  userId, gameId, score, correctAnswers, totalQuestions: 10,
  accuracy: correctAnswers * 10, completionTime: 60, xpGained: 10,
  verified: true, createdAt: OLD, ...extra,
});
await db.getCollection("results").insertMany([
  mkResult("user-hs1", "game-a", 9, 90),
  mkResult("user-hs1", "game-a", 8, 80),
  mkResult("user-hs2", "game-a", 7, 70),
  mkResult("user-hs2", "game-b", 2, 20),
  mkResult("user-hs1", "game-b", 3, 30),
  // Lượt chưa verified → phải bị loại khỏi mọi con số.
  mkResult("user-hs2", "game-a", 10, 100, { verified: false }),
]);

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const hsTok = tok("user-hs1", "student", "HS Một");
const gvTok = tok("user-gv1", "teacher", "GV Một");
const adminTok = tok("user-admin1", "admin", "Admin Một");

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

const get = async (token) => {
  const res = await fetch(`${base}/api/ai/class-overview`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

// (b) Phân quyền trước (không phụ thuộc dữ liệu).
const noAuth = await get(null);
check("chưa đăng nhập → 401", noAuth.status, 401);
const hs = await get(hsTok);
check("student → 403", hs.status, 403);

// (a) Số liệu: 5 lượt verified, 50 câu, đúng 29 → 58%; điểm TB (90+80+70+20+30)/5 = 58.
const gv = await get(gvTok);
check("teacher → 200", gv.status, 200);
const d = gv.body?.data || {};
check("totalPlays", d.totalPlays, 5);
check("totalQuestionsOffered", d.totalQuestionsOffered, 50);
check("accuracy", d.accuracy, 58);
check("averageScore", d.averageScore, 58);
check("studentsWithData", d.studentsWithData, 2);
checkTrue("totalStudents >= 3", typeof d.totalStudents === "number" && d.totalStudents >= 3, JSON.stringify(d.totalStudents));
check("weakTopics có 2 chủ đề", d.weakTopics?.length, 2);
check("weakTopics[0] là chủ đề yếu nhất", d.weakTopics?.[0]?.label, "Đọc hiểu");
check("weakTopics[0].accuracy", d.weakTopics?.[0]?.accuracy, 25);
check("weakTopics[1].accuracy", d.weakTopics?.[1]?.accuracy, 80);

const ad = await get(adminTok);
check("admin → 200", ad.status, 200);
check("admin thấy cùng totalPlays", ad.body?.data?.totalPlays, 5);

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
