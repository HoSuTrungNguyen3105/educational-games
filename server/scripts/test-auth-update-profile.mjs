// Test tích hợp: PUT /api/auth/me — cập nhật hồ sơ (tên / email / lớp / giới tính).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-user-device-register.mjs):
//   node server/scripts/test-auth-update-profile.mjs
// Bối cảnh: form "Thông tin cá nhân" ở trang Hồ sơ dùng endpoint này. Server
// đã có sẵn check trùng email + validate ageCode/gender, đợt này bổ sung
// VALIDATE ĐỊNH DẠNG email (trước đây "abc@" vẫn lưu được) và check trùng
// loại trừ chính mình tường minh. Bao phủ:
//   (a) email mới hợp lệ → 200, email được trim + hạ thường ở response và DB;
//   (b) email sai định dạng → 400 "Email không đúng định dạng";
//   (c) email của user KHÁC → 400 "Email đã được sử dụng";
//   (d) giữ nguyên email của mình (khác hoa/thường) → 200, không báo trùng giả;
//   (e) ageCode hợp lệ → 200; ageCode lạ → 400; ageCode null → xoá về null;
//   (f) gender hợp lệ → 200; gender lạ → 400; đổi tên → 200.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `auth_profile_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-auth-profile-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "auth_profile_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
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

async function seedUser(id, email) {
  await getCollection("users").insertOne({
    id, username: id, name: `User ${id}`, role: "student", email,
    passwordHash: "x", coins: 0, createdAt: new Date().toISOString(),
  });
  return signToken({ id, username: id, role: "student", name: `User ${id}` });
}

const token1 = await seedUser("user-prof-1", "mot@example.com");
await seedUser("user-prof-2", "hai@example.com");
const dbUser = (id) => getCollection("users").findOne({ id });

// ── (a) Email mới hợp lệ → 200 + chuẩn hoá ───────────────────────────────
const a = await req("PUT", "/api/auth/me", token1, { email: "  Moi@Example.COM " });
check("(a) PUT email mới hợp lệ: 200", a.status, 200);
check("(a) response email đã trim + hạ thường", a.body?.data?.email, "moi@example.com");
check("(a) DB email đã cập nhật", (await dbUser("user-prof-1"))?.email, "moi@example.com");

// ── (b) Email sai định dạng → 400 ────────────────────────────────────────
const b = await req("PUT", "/api/auth/me", token1, { email: "abc@" });
check("(b) PUT email 'abc@': 400", b.status, 400);
check("(b) msg báo sai định dạng", b.body?.msg, "Email không đúng định dạng");
check("(b) DB giữ email cũ sau lỗi", (await dbUser("user-prof-1"))?.email, "moi@example.com");

// ── (c) Email của user khác → 400 trùng ──────────────────────────────────
const c = await req("PUT", "/api/auth/me", token1, { email: "hai@example.com" });
check("(c) PUT email của user khác: 400", c.status, 400);
check("(c) msg báo email đã dùng", c.body?.msg, "Email đã được sử dụng");

// ── (d) Giữ nguyên email của mình (khác hoa/thường) → 200 ───────────────
const d = await req("PUT", "/api/auth/me", token1, { email: "MOI@example.com", name: "Bé Một Mới" });
check("(d) PUT lại email của mình + đổi tên: 200", d.status, 200);
check("(d) tên đã đổi", d.body?.data?.name, "Bé Một Mới");
check("(d) email giữ nguyên dạng chuẩn", d.body?.data?.email, "moi@example.com");

// ── (e) ageCode: hợp lệ / lạ / null ──────────────────────────────────────
const e1 = await req("PUT", "/api/auth/me", token1, { ageCode: "kid-river" });
check("(e) PUT ageCode kid-river: 200 + đúng mã", [e1.status, e1.body?.data?.ageCode], [200, "kid-river"]);
const e2 = await req("PUT", "/api/auth/me", token1, { ageCode: "kid-xyz" });
check("(e) PUT ageCode lạ: 400", e2.status, 400);
check("(e) msg mã tuổi không hợp lệ", e2.body?.msg, "Mã tuổi không hợp lệ");
const e3 = await req("PUT", "/api/auth/me", token1, { ageCode: null });
check("(e) PUT ageCode null: 200 + về null", [e3.status, e3.body?.data?.ageCode], [200, null]);

// ── (f) gender: hợp lệ / lạ ──────────────────────────────────────────────
const f1 = await req("PUT", "/api/auth/me", token1, { gender: "girl" });
check("(f) PUT gender girl: 200 + đúng", [f1.status, f1.body?.data?.gender], [200, "girl"]);
const f2 = await req("PUT", "/api/auth/me", token1, { gender: "xyz" });
check("(f) PUT gender lạ: 400", f2.status, 400);
check("(f) msg giới tính không hợp lệ", f2.body?.msg, "Giới tính không hợp lệ");

server.close();
if (mongod) await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
