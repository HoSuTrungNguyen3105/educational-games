// Test tích hợp: GET /api/users/me/games — tên game đã bị xoá khỏi thư viện.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-dashboard-wave1.mjs):
//   node server/scripts/test-profile-game-names.mjs
// Bao phủ: tiến độ gắn game còn tồn tại → tên thật; tiến độ gắn game online
// đã xoá (gameId ObjectId 24-hex, không gameName) → "Trò chơi đã gỡ", KHÔNG
// bao giờ trả chuỗi hex thô; game offline có gameName → giữ gameName; game
// offline thiếu gameName → giữ slug như hành vi cũ; bản ghi sổ XP bị lọc.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ObjectId } from "mongodb";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `profile_game_names_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-profile-game-names-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "profile_game_names_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const studentTok = signToken({ id: "user-hs-names", username: "hsnames", role: "student", name: "HS Names" });

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

const now = new Date().toISOString();
const realOid = new ObjectId();
const goneOid = new ObjectId(); // game đã bị xoá — không có doc trong games

await getCollection("games").insertOne({
  _id: realOid, name: "Đường Đua Ốc Sên", code: "snail-race", status: "published", createdAt: now, updatedAt: now,
});
const prog = (gameId, extra = {}) => ({
  _id: `ugp-${Math.random().toString(36).slice(2, 9)}`,
  userId: "user-hs-names", gameId, level: 1, experience: 10, progress: 20,
  gamesPlayed: 2, questsCompleted: 0, inventory: [], lastPlayedAt: now,
  createdAt: now, updatedAt: now, ...extra,
});
await getCollection("userGameProgress").insertMany([
  prog(realOid.toString()),                                        // game còn tồn tại
  prog(goneOid.toString()),                                        // game online đã xoá
  prog("fruit-hunt", { gameName: "Săn Trái Cây" }),                // offline có gameName
  prog("snake"),                                                   // offline thiếu gameName
  prog("__xp_ledger__", { experience: 999 }),                      // sổ XP — phải bị lọc
]);

const res = await fetch(`${base}/api/users/me/games`, {
  headers: { Authorization: `Bearer ${studentTok}` },
});
check("GET /users/me/games: 200", res.status, 200);
const list = (await res.json())?.data || [];
check("Số mục hiển thị = 4 (sổ XP bị lọc)", list.length, 4);
const byId = Object.fromEntries(list.map((g) => [String(g.gameId), g.name]));
check("Game còn tồn tại → tên thật", byId[realOid.toString()], "Đường Đua Ốc Sên");
check("Game đã xoá → nhãn thân thiện", byId[goneOid.toString()], "Trò chơi đã gỡ");
check("Offline có gameName → giữ gameName", byId["fruit-hunt"], "Săn Trái Cây");
check("Offline thiếu gameName → giữ slug như cũ", byId["snake"], "snake");
checkTrue(
  "Không mục nào hiện chuỗi ObjectId 24-hex thô",
  list.every((g) => !/^[0-9a-f]{24}$/i.test(String(g.name || ""))),
  JSON.stringify(list.map((g) => g.name)),
);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
