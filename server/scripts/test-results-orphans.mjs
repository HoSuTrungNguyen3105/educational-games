// Test tích hợp: DELETE /api/results/orphans (dọn phiếu kết quả mồ côi).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-dashboard-wave1.mjs):
//   node server/scripts/test-results-orphans.mjs
// Bao phủ: tạo 1 game thật + results gắn game đó (theo _id và theo code) và
// results mồ côi (gameId seed "game-001", gameId rỗng, thiếu field gameId,
// ObjectId hex không tồn tại). Chưa đăng nhập → 401; học sinh → 403;
// admin → 200, deletedCount đúng số mồ côi, results thật còn nguyên;
// gọi lần 2 → deletedCount = 0.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ObjectId } from "mongodb";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `results_orphans_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-results-orphans-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "results_orphans_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const admin = signToken({ id: "user-admin-orph", username: "adminorph", role: "admin", name: "Admin Orph" });
const studentTok = signToken({ id: "user-hs-orph", username: "hsorph", role: "student", name: "HS Orph" });

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};

const req = async (method, p, token) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

const now = new Date().toISOString();

// ── Dữ liệu: 1 game thật + 2 results thật + 4 results mồ côi ─────────────
const gameOid = new ObjectId();
await getCollection("games").insertOne({
  _id: gameOid,
  name: "Game That De Don",
  code: "game-that-de-don",
  status: "published",
  createdAt: now,
  updatedAt: now,
});
const ghostOid = new ObjectId(); // gameId hex nhưng game không tồn tại
await getCollection("results").insertMany([
  // Thật — gắn theo _id của game đang tồn tại.
  { id: "result-real-by-id", gameId: gameOid.toString(), playerId: "user-hs-orph", score: 90, createdAt: now },
  // Thật — gắn theo code của game đang tồn tại (quy ước gameResolver).
  { id: "result-real-by-code", gameId: "game-that-de-don", playerId: "user-hs-orph", score: 80, createdAt: now },
  // Mồ côi — slug seed đời đầu.
  { id: "result-orph-seed", gameId: "game-001", score: 10 },
  // Mồ côi — gameId rỗng.
  { id: "result-orph-empty", gameId: "", score: 10 },
  // Mồ côi — thiếu hẳn field gameId.
  { id: "result-orph-missing", score: 10 },
  // Mồ côi — ObjectId hex của game đã bị xoá.
  { id: "result-orph-ghost", gameId: ghostOid.toString(), playerId: "user-hs-orph", score: 10, createdAt: now },
]);
check("Setup: tổng results = 6", await getCollection("results").countDocuments(), 6);

// ── Quyền truy cập ────────────────────────────────────────────────────────
const anon = await req("DELETE", "/api/results/orphans");
check("DELETE /results/orphans chưa đăng nhập: 401", anon.status, 401);

const stu = await req("DELETE", "/api/results/orphans", studentTok);
check("DELETE /results/orphans bằng học sinh: 403", stu.status, 403);
check("Sau 2 lần bị chặn: results còn nguyên 6", await getCollection("results").countDocuments(), 6);

// ── Admin xoá ─────────────────────────────────────────────────────────────
const del = await req("DELETE", "/api/results/orphans", admin);
check("DELETE /results/orphans bằng admin: 200", del.status, 200);
check("deletedCount = 4 (seed + rỗng + thiếu + game đã xoá)", del.body?.data?.deletedCount, 4);
check("scanned = 6", del.body?.data?.scanned, 6);
check("Còn lại đúng 2 results", await getCollection("results").countDocuments(), 2);

const remainingIds = (await getCollection("results").find({}).toArray()).map((r) => r.id).sort();
check("Results còn lại là 2 bản thật", remainingIds, ["result-real-by-code", "result-real-by-id"]);

const del2 = await req("DELETE", "/api/results/orphans", admin);
check("Gọi lần 2: 200, deletedCount = 0", del2.body?.data?.deletedCount, 0);
check("Sau lần 2: vẫn còn 2 results thật", await getCollection("results").countDocuments(), 2);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
