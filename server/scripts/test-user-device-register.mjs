// Test tích hợp: POST /api/notifications/device-token — đăng ký token FCM.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-pet-merge.mjs):
//   node server/scripts/test-user-device-register.mjs
// Bối cảnh lỗi production: registerDevice tạo doc THIẾU field `id` trong khi
// db.js khai unique index { id: 1 } (+ $jsonSchema bắt buộc `id`) → Mongo coi
// field thiếu là null → token mới đầu tiên chiếm null, MỌI token mới sau đó
// đụng null → E11000 → 500 ngay lần đầu truy cập bằng token mới.
// Bao phủ:
//   (a) đăng ký token A (user 1) → 200, doc có `id` (=== `_id`);
//   (b) đăng ký token B MỚI (user 2) → 200 (ca CHẾT trên code cũ);
//   (c) đăng ký lại token A bằng user khác → rebind đúng, vẫn 1 doc/token;
//   (d) 2 đăng ký ĐỒNG THỜI cùng một token mới → cả hai 200, chỉ 1 doc;
//   (e) DELETE device-token + DELETE devices/reset vẫn đúng ngữ nghĩa.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `user_devices_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-user-devices-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "user_devices_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

// initDatabase() dựng index ở tiến trình nền (không await được) → tạo lại
// ĐÚNG bộ index của user_devices trong db.js ngay tại đây cho tất định
// (createIndexes idempotent: trùng spec với bản của db.js thì là no-op).
await getCollection("user_devices").createIndexes([
  { key: { id: 1 }, unique: true },
  { key: { userId: 1 } },
  { key: { token: 1 }, unique: true },
  { key: { userId: 1, isActive: 1 } },
]);

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};

const req = async (method, p, token, body) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

async function seedUser(id, role = "student") {
  await getCollection("users").insertOne({
    id, username: id, name: `User ${id}`, role,
    passwordHash: "x", coins: 0, createdAt: new Date().toISOString(),
  });
  return signToken({ id, username: id, role, name: `User ${id}` });
}

const user1 = await seedUser("user-dev-1");
const user2 = await seedUser("user-dev-2");
const devices = () => getCollection("user_devices");
const byToken = (t) => devices().findOne({ token: t });

// ── (a) Đăng ký token A cho user 1 ────────────────────────────────────────
const a = await req("POST", "/api/notifications/device-token", user1, { token: "token-A", deviceType: "web" });
check("(a) POST token A: 200", a.status, 200);
check("(a) response có id dạng chuỗi khác rỗng", typeof a.body?.data?.id === "string" && a.body.data.id.length > 0, true);
check("(a) deviceType được chuẩn hoá thành WEB", a.body?.data?.deviceType, "WEB");
const docA = await byToken("token-A");
check("(a) doc trong DB: id === _id", docA?.id === docA?._id && typeof docA?.id === "string", true);
check("(a) doc trong DB: userId = user-dev-1, isActive = true", [docA?.userId, docA?.isActive], ["user-dev-1", true]);

// ── (b) Đăng ký token B MỚI cho user 2 — ca chết E11000 trên code cũ ─────
const b = await req("POST", "/api/notifications/device-token", user2, { token: "token-B" });
check("(b) POST token B mới: 200 (không còn 500 E11000)", b.status, 200);
check("(b) tổng số doc sau 2 token khác nhau = 2", await devices().countDocuments({}), 2);
const docB = await byToken("token-B");
check("(b) doc token B có id hợp lệ", typeof docB?.id === "string" && docB.id.length > 0, true);

// ── (c) Đăng ký lại token A bằng user 2 → rebind, vẫn đúng 1 doc ─────────
const c = await req("POST", "/api/notifications/device-token", user2, { token: "token-A", deviceType: "android" });
check("(c) POST lại token A (user 2): 200", c.status, 200);
check("(c) số doc mang token A vẫn = 1", await devices().countDocuments({ token: "token-A" }), 1);
const docA2 = await byToken("token-A");
check("(c) token A đã rebind sang user-dev-2", docA2?.userId, "user-dev-2");
check("(c) token A: deviceType = ANDROID, isActive = true", [docA2?.deviceType, docA2?.isActive], ["ANDROID", true]);
check("(c) token A giữ nguyên id ban đầu", docA2?.id, docA?.id);

// ── (d) Hai đăng ký đồng thời cùng một token mới ──────────────────────────
const [d1, d2] = await Promise.all([
  req("POST", "/api/notifications/device-token", user1, { token: "token-C" }),
  req("POST", "/api/notifications/device-token", user2, { token: "token-C" }),
]);
check("(d) 2 POST đồng thời token C: cả hai 200", [d1.status, d2.status], [200, 200]);
check("(d) số doc mang token C = 1", await devices().countDocuments({ token: "token-C" }), 1);
const docC = await byToken("token-C");
check("(d) doc token C có id hợp lệ", typeof docC?.id === "string" && docC.id.length > 0, true);

// ── (e) Gỡ token + reset toàn bộ thiết bị ────────────────────────────────
const e1 = await req("DELETE", "/api/notifications/device-token", user2, { token: "token-B" });
check("(e) DELETE token B: 200", e1.status, 200);
check("(e) doc token B đã biến mất", await devices().countDocuments({ token: "token-B" }), 0);
const e2 = await req("DELETE", "/api/notifications/devices/reset", user2);
check("(e) DELETE devices/reset (user 2): 200", e2.status, 200);
const activeOfUser2 = await devices().countDocuments({ userId: "user-dev-2", isActive: true });
check("(e) sau reset: user 2 không còn thiết bị active", activeOfUser2, 0);
const docA3 = await byToken("token-A");
check("(e) token A (đang thuộc user 2) bị deactivate nhưng KHÔNG bị xoá", [docA3?.isActive, !!docA3], [false, true]);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
