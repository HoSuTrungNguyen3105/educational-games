// Test tích hợp: Điểm danh mỗi ngày — GET/POST /api/users/me/check-in.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-results-orphans.mjs):
//   node server/scripts/test-checkin.mjs
// Bao phủ: chưa đăng nhập → 401; điểm danh lần đầu streak 1 + thưởng 20 xu;
// gọi lại cùng ngày KHÔNG cộng trùng; hôm qua đã điểm danh → streak tăng
// (3 → 4, thưởng 50); đứt chuỗi (bỏ 2 ngày) → streak về 1 và GET báo
// streak 0/rewardToday 20; mốc streak 7 → thưởng 200; hàng 7 ngày (week)
// dựng đúng từ lastDate + streak.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `checkin_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-checkin-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "checkin_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { todayDate } = await import("../src/services/attendanceService.js");
const { shiftDate } = await import("../src/services/checkinService.js");
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

const today = todayDate();
const yesterday = shiftDate(today, -1);

async function seedUser(id, { coins = 0, dailyCheckin } = {}) {
  const doc = {
    id,
    username: id,
    name: `HS ${id}`,
    role: "student",
    passwordHash: "x",
    coins,
    createdAt: new Date().toISOString(),
  };
  if (dailyCheckin) doc.dailyCheckin = dailyCheckin;
  await getCollection("users").insertOne(doc);
  return signToken({ id, username: id, role: "student", name: doc.name });
}

const coinsOf = async (id) => (await getCollection("users").findOne({ id }))?.coins;

// ── Chưa đăng nhập → 401 ─────────────────────────────────────────────────
const anonGet = await req("GET", "/api/users/me/check-in");
check("GET chưa đăng nhập: 401", anonGet.status, 401);
const anonPost = await req("POST", "/api/users/me/check-in");
check("POST chưa đăng nhập: 401", anonPost.status, 401);

// ── Học sinh A: điểm danh lần đầu ────────────────────────────────────────
const tokA = await seedUser("user-checkin-a", { coins: 100 });

const before = await req("GET", "/api/users/me/check-in", tokA);
check("A GET ban đầu: 200", before.status, 200);
check("A GET ban đầu: checkedInToday=false", before.body?.data?.checkedInToday, false);
check("A GET ban đầu: streak=0", before.body?.data?.streak, 0);
check("A GET ban đầu: rewardToday=20", before.body?.data?.rewardToday, 20);
check("A GET ban đầu: week có 7 ngày", before.body?.data?.week?.length, 7);
check("A GET ban đầu: week chưa ngày nào điểm danh", before.body?.data?.week?.every((d) => !d.checkedIn), true);
check("A GET ban đầu: week kết thúc ở hôm nay", before.body?.data?.week?.[6]?.date, today);
check("A GET ban đầu: week[6].isToday=true", before.body?.data?.week?.[6]?.isToday, true);

const post1 = await req("POST", "/api/users/me/check-in", tokA);
check("A POST lần đầu: 200", post1.status, 200);
check("A POST lần đầu: streak=1", post1.body?.data?.streak, 1);
check("A POST lần đầu: reward=20", post1.body?.data?.reward, 20);
check("A POST lần đầu: coins=120", post1.body?.data?.coins, 120);
check("A POST lần đầu: alreadyCheckedIn=false", post1.body?.data?.alreadyCheckedIn, false);
check("A DB: coins=120", await coinsOf("user-checkin-a"), 120);

const post2 = await req("POST", "/api/users/me/check-in", tokA);
check("A POST lần 2 cùng ngày: alreadyCheckedIn=true", post2.body?.data?.alreadyCheckedIn, true);
check("A POST lần 2 cùng ngày: reward=0", post2.body?.data?.reward, 0);
check("A POST lần 2 cùng ngày: streak vẫn 1", post2.body?.data?.streak, 1);
check("A DB sau POST lần 2: coins vẫn 120 (không cộng trùng)", await coinsOf("user-checkin-a"), 120);

const after = await req("GET", "/api/users/me/check-in", tokA);
check("A GET sau điểm danh: checkedInToday=true", after.body?.data?.checkedInToday, true);
check("A GET sau điểm danh: rewardToday=0", after.body?.data?.rewardToday, 0);
check("A GET sau điểm danh: totalCheckins=1", after.body?.data?.totalCheckins, 1);
check("A GET sau điểm danh: longestStreak=1", after.body?.data?.longestStreak, 1);
check("A GET sau điểm danh: week chỉ hôm nay đã điểm danh",
  after.body?.data?.week?.map((d) => d.checkedIn),
  [false, false, false, false, false, false, true]);

// ── Học sinh B: hôm qua đã điểm danh (streak 3) → streak tăng lên 4 ──────
const tokB = await seedUser("user-checkin-b", {
  coins: 0,
  dailyCheckin: { lastDate: yesterday, streak: 3, longestStreak: 3, totalCheckins: 3 },
});
const bGet = await req("GET", "/api/users/me/check-in", tokB);
check("B GET: streak còn sống = 3", bGet.body?.data?.streak, 3);
check("B GET: rewardToday=50 (streak 4 → 20+10×3)", bGet.body?.data?.rewardToday, 50);
check("B GET: week có 3 ngày của chuỗi cũ (kết thúc hôm qua)",
  bGet.body?.data?.week?.map((d) => d.checkedIn),
  [false, false, false, true, true, true, false]);

const bPost = await req("POST", "/api/users/me/check-in", tokB);
check("B POST: streak=4", bPost.body?.data?.streak, 4);
check("B POST: reward=50", bPost.body?.data?.reward, 50);
check("B POST: coins=50", bPost.body?.data?.coins, 50);
check("B POST: longestStreak=4", bPost.body?.data?.longestStreak, 4);
check("B POST: totalCheckins=4", bPost.body?.data?.totalCheckins, 4);
check("B POST: week có 4 ngày cuối đã điểm danh",
  bPost.body?.data?.week?.map((d) => d.checkedIn),
  [false, false, false, true, true, true, true]);

// ── Học sinh C: đứt chuỗi (lần cuối 3 ngày trước, streak 5) ─────────────
const tokC = await seedUser("user-checkin-c", {
  coins: 30,
  dailyCheckin: { lastDate: shiftDate(today, -3), streak: 5, longestStreak: 5, totalCheckins: 9 },
});
const cGet = await req("GET", "/api/users/me/check-in", tokC);
check("C GET: streak đã đứt = 0", cGet.body?.data?.streak, 0);
check("C GET: rewardToday=20 (điểm danh lại từ streak 1)", cGet.body?.data?.rewardToday, 20);
check("C GET: longestStreak vẫn 5", cGet.body?.data?.longestStreak, 5);
check("C GET: week còn vết 4 ngày của chuỗi cũ",
  cGet.body?.data?.week?.map((d) => d.checkedIn),
  [true, true, true, true, false, false, false]);

const cPost = await req("POST", "/api/users/me/check-in", tokC);
check("C POST: streak về 1", cPost.body?.data?.streak, 1);
check("C POST: reward=20", cPost.body?.data?.reward, 20);
check("C POST: coins=50", cPost.body?.data?.coins, 50);
check("C POST: longestStreak giữ 5", cPost.body?.data?.longestStreak, 5);
check("C POST: totalCheckins=10", cPost.body?.data?.totalCheckins, 10);

// ── Học sinh D: mốc 7 ngày → thưởng 200 ──────────────────────────────────
const tokD = await seedUser("user-checkin-d", {
  coins: 0,
  dailyCheckin: { lastDate: yesterday, streak: 6, longestStreak: 6, totalCheckins: 6 },
});
const dGet = await req("GET", "/api/users/me/check-in", tokD);
check("D GET: rewardToday=200 (mốc streak 7)", dGet.body?.data?.rewardToday, 200);
const dPost = await req("POST", "/api/users/me/check-in", tokD);
check("D POST: streak=7", dPost.body?.data?.streak, 7);
check("D POST: reward=200", dPost.body?.data?.reward, 200);
check("D POST: coins=200", dPost.body?.data?.coins, 200);
check("D POST: longestStreak=7", dPost.body?.data?.longestStreak, 7);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
