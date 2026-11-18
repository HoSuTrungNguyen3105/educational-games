// Test tích hợp: questionsCount trong GET /api/games PHẢI LÀ SỐ THẬT của
// collection `questions`, không phải số lưu sẵn trên bản ghi game.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-games-subject-id.mjs):
//   node server/scripts/test-games-question-counts.mjs
// Bao phủ: game lưu sẵn 5 câu nhưng thật 0 → trả 0; lưu sẵn 8 nhưng thật 3 →
// trả 3; lưu sẵn 0 nhưng thật 2 → trả 2; cả đường thường lẫn đường range
// (?from=&to= của dashboard); field lưu trong DB KHÔNG bị sửa (chỉ ghi đè
// ở response).
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `games_qcounts_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-games-qcounts-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "games_qcounts_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};

const req = async (method, p) => {
  const res = await fetch(`${base}${p}`, { method });
  return { status: res.status, body: await res.json().catch(() => null) };
};

// ── Dữ liệu nền: 3 game có số lưu sẵn LỆCH theo 3 kiểu ────────────────────
const now = new Date().toISOString();
const mkGame = async (name, code, storedCount) => {
  const r = await getCollection("games").insertOne({
    name, description: "Game test đếm câu hỏi", status: "published",
    questionsCount: storedCount, playersCount: 0, code, createdAt: now, updatedAt: now,
  });
  return r.insertedId.toString();
};
const mkQuestion = async (gameId, n) => {
  await getCollection("questions").insertOne({
    id: `question-test-${gameId.slice(-4)}-${n}`, gameId,
    content: `Câu hỏi ${n} của game ${gameId.slice(-4)}`,
    options: [{ id: "a1", content: "Đáp án A" }, { id: "a2", content: "Đáp án B" }],
    correctAnswer: "a1",
  });
};

// A: lưu sẵn 5, thật 0 (đúng ca production Nguyên gặp)
const gameA = await mkGame("Game A Lệch Cao", "TESTCNT1", 5);
// B: lưu sẵn 8, thật 3
const gameB = await mkGame("Game B Lệch Một Phần", "TESTCNT2", 8);
for (let i = 1; i <= 3; i++) await mkQuestion(gameB, i);
// C: lưu sẵn 0, thật 2 (lệch ngược)
const gameC = await mkGame("Game C Lệch Thấp", "TESTCNT3", 0);
for (let i = 1; i <= 2; i++) await mkQuestion(gameC, i);

// ── 1. Đường thường GET /api/games ────────────────────────────────────────
const list = await req("GET", "/api/games");
check("GET /api/games: 200", list.status, 200);
const byId = new Map((list.body?.data || []).map((g) => [g._id, g]));
check("Game A (lưu 5, thật 0): questionsCount = 0", byId.get(gameA)?.questionsCount, 0);
check("Game B (lưu 8, thật 3): questionsCount = 3", byId.get(gameB)?.questionsCount, 3);
check("Game C (lưu 0, thật 2): questionsCount = 2", byId.get(gameC)?.questionsCount, 2);

// ── 2. Đường range của dashboard GET /api/games?from=&to= ────────────────
const ranged = await req("GET", "/api/games?from=1&to=50");
check("GET /api/games?from=1&to=50: 200", ranged.status, 200);
const byIdRanged = new Map((ranged.body?.data || []).map((g) => [g._id, g]));
check("Range — Game A: questionsCount = 0", byIdRanged.get(gameA)?.questionsCount, 0);
check("Range — Game B: questionsCount = 3", byIdRanged.get(gameB)?.questionsCount, 3);
check("Range — Game C: questionsCount = 2", byIdRanged.get(gameC)?.questionsCount, 2);

// ── 3. Lọc theo status vẫn kèm số thật ────────────────────────────────────
const published = await req("GET", "/api/games?status=published");
const byIdPub = new Map((published.body?.data || []).map((g) => [g._id, g]));
check("Lọc published — Game B: questionsCount = 3", byIdPub.get(gameB)?.questionsCount, 3);

// ── 4. Field lưu trong DB KHÔNG bị đụng (chỉ ghi đè ở response) ─────────
const rawA = await getCollection("games").findOne({ code: "TESTCNT1" });
check("DB giữ nguyên questionsCount lưu sẵn của Game A (= 5)", rawA?.questionsCount, 5);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
