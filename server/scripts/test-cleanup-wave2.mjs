// Test tích hợp đợt dọn dẹp 2 (quyết định của Nguyên 2026-11-22):
//   1. BỔ SUNG endpoint vé: GET/POST /api/auth/me/tickets +
//      POST /api/auth/me/tickets/:id/use (client ticketService đã gọi từ
//      lâu, server chưa từng có → 404). Vé lưu thật trên doc user.
//   2. BỔ SUNG POST /api/avatar/upload (trang UploadItems gọi, server
//      chưa từng có) — dùng Cloudinary STUB local như
//      test-images-owner-filter.mjs, KHÔNG gọi mạng ngoài.
//   3. XOÁ 3 endpoint 0 caller: GET /api/notifications/push-status,
//      GET /api/users/exam-results (bản admin), GET /api/players — phải
//      404; còn GET /api/users/me/exam-results (bản học sinh) phải sống.
// Chạy app Express THẬT trên Mongo in-memory:
//   node server/scripts/test-cleanup-wave2.mjs
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `cleanup_wave2_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-cleanup-wave2-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "cleanup_wave2_test";
}

// ───────────────────── Stub Cloudinary (chỉ cần upload) ─────────────────────
const readBody = (req) => new Promise((resolve) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => resolve(Buffer.concat(chunks)));
});
const stub = createServer(async (req, res) => {
  const url = new URL(req.url, "http://stub");
  const p = decodeURIComponent(url.pathname);
  const json = (obj, code = 200) => {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
  };
  if (req.method === "POST" && p === "/v1_1/testcloud/image/upload") {
    const body = (await readBody(req)).toString("latin1");
    const folder = /name="folder"\r\n\r\n([^\r\n]+)/.exec(body)?.[1] || "edu-game";
    const publicId = `${folder}/item1`;
    return json({
      public_id: publicId,
      secure_url: `https://res.testcloud/${publicId}.png`,
      width: 10, height: 10, format: "png", bytes: 68,
      created_at: "2026-11-22T00:00:00.000Z",
    });
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: { message: `stub: no route ${req.method} ${p}` } }));
});
await new Promise((resolve) => stub.listen(0, "127.0.0.1", resolve));

process.env.CLOUDINARY_CLOUD_NAME = "testcloud";
process.env.CLOUDINARY_API_KEY = "testkey";
process.env.CLOUDINARY_API_SECRET = "testsecret";
const require = createRequire(import.meta.url);
const cfgMod = require("cloudinary/lib/config.js");
const cfgFn = typeof cfgMod === "function" ? cfgMod : cfgMod.default;
cfgFn({
  cloud_name: "testcloud",
  api_key: "testkey",
  api_secret: "testsecret",
  upload_prefix: `http://127.0.0.1:${stub.address().port}`,
});

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const OLD = "2026-01-05T00:00:00.000Z";
const mkUser = (id, role) => ({
  id, username: id.replace("user-", ""), name: `Người dùng ${id}`, role,
  passwordHash: "x", email: `${id.replace("user-", "")}@test.local`, createdAt: OLD,
});
await getCollection("users").insertMany([
  mkUser("user-admin", "admin"),
  mkUser("user-gv", "teacher"),
  mkUser("user-hs", "student"),
  mkUser("user-hs2", "student"),
]);
const tok = (id, role) => signToken({ id, username: id.replace("user-", ""), role, name: `Người dùng ${id}` });
const ADMIN = tok("user-admin", "admin");
const TEACHER = tok("user-gv", "teacher");
const STUDENT = tok("user-hs", "student");
const STUDENT2 = tok("user-hs2", "student");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

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

const req = async (p, { token, method = "GET", body } = {}) => {
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

// ───────────────────── 1. Tickets ─────────────────────
{
  const noAuth = await req("/api/auth/me/tickets");
  check("tickets: chưa đăng nhập GET → 401", noAuth.status, 401);

  const empty = await req("/api/auth/me/tickets", { token: STUDENT });
  check("tickets: HS mới GET → 200", empty.status, 200);
  check("tickets: HS mới count = 0", empty.body?.data?.count, 0);
  check("tickets: HS mới tickets = []", empty.body?.data?.tickets, []);

  const added = await req("/api/auth/me/tickets", { token: STUDENT, method: "POST", body: { amount: 2 } });
  check("tickets: cộng 2 vé → 200", added.status, 200);
  check("tickets: sau cộng count = 2", added.body?.data?.count, 2);
  checkTrue("tickets: mỗi vé có id riêng",
    added.body?.data?.tickets?.length === 2 && added.body.data.tickets.every((t) => t.id) &&
    added.body.data.tickets[0].id !== added.body.data.tickets[1].id,
    JSON.stringify(added.body?.data));
  const ticketId = added.body.data.tickets[0].id;

  const zero = await req("/api/auth/me/tickets", { token: STUDENT, method: "POST", body: { amount: 0 } });
  check("tickets: cộng 0 vé → 400", zero.status, 400);
  const missing = await req("/api/auth/me/tickets", { token: STUDENT, method: "POST", body: {} });
  check("tickets: thiếu amount → 400", missing.status, 400);
  const tooMany = await req("/api/auth/me/tickets", { token: STUDENT, method: "POST", body: { amount: 21 } });
  check("tickets: cộng 21 vé (quá trần) → 400", tooMany.status, 400);

  const after = await req("/api/auth/me/tickets", { token: STUDENT });
  check("tickets: GET lại thấy 2 vé đã lưu thật", after.body?.data?.count, 2);

  const other = await req("/api/auth/me/tickets", { token: STUDENT2 });
  check("tickets: user khác không thấy vé của HS", other.body?.data?.count, 0);

  const used = await req(`/api/auth/me/tickets/${encodeURIComponent(ticketId)}/use`, { token: STUDENT, method: "POST" });
  check("tickets: dùng vé → 200", used.status, 200);
  check("tickets: sau dùng count = 1", used.body?.data?.count, 1);
  check("tickets: used.id khớp vé đã dùng", used.body?.data?.used?.id, ticketId);
  checkTrue("tickets: used.usedAt có dấu thời gian", !!used.body?.data?.used?.usedAt);

  const reuse = await req(`/api/auth/me/tickets/${encodeURIComponent(ticketId)}/use`, { token: STUDENT, method: "POST" });
  check("tickets: dùng lại vé đã dùng → 400", reuse.status, 400);
  const bogus = await req("/api/auth/me/tickets/ticket-khong-co/use", { token: STUDENT, method: "POST" });
  check("tickets: dùng vé không tồn tại → 404", bogus.status, 404);
  const steal = await req(`/api/auth/me/tickets/${encodeURIComponent(after.body.data.tickets[0].id)}/use`, { token: STUDENT2, method: "POST" });
  check("tickets: user khác dùng vé của HS → 404", steal.status, 404);
}

// ───────────────────── 2. Avatar upload ─────────────────────
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64",
);
async function uploadFile(token, blob, filename, type) {
  const form = new FormData();
  form.append("file", new Blob([blob], { type }), filename);
  const res = await fetch(`${base}/api/avatar/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  return { status: res.status, body: await res.json().catch(() => null) };
}
{
  const noAuth = await uploadFile(null, PNG, "a.png", "image/png");
  check("avatar/upload: chưa đăng nhập → 401", noAuth.status, 401);

  const student = await uploadFile(STUDENT, PNG, "a.png", "image/png");
  check("avatar/upload: học sinh → 403", student.status, 403);

  const teacher = await uploadFile(TEACHER, PNG, "item.png", "image/png");
  check("avatar/upload: giáo viên upload PNG → 200", teacher.status, 200);
  checkTrue("avatar/upload: data.url là URL ảnh của stub",
    typeof teacher.body?.data?.url === "string" && teacher.body.data.url.includes("avatar-items"),
    JSON.stringify(teacher.body));
  checkTrue("avatar/upload: data.publicId có mặt", !!teacher.body?.data?.publicId);

  const admin = await uploadFile(ADMIN, PNG, "item.png", "image/png");
  check("avatar/upload: admin upload PNG → 200", admin.status, 200);

  const noFile = await fetch(`${base}/api/avatar/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TEACHER}` },
    body: new FormData(),
  });
  check("avatar/upload: thiếu file → 400", noFile.status, 400);

  const notImage = await uploadFile(TEACHER, Buffer.from("xin chào"), "a.txt", "text/plain");
  checkTrue("avatar/upload: file không phải ảnh bị từ chối", notImage.status >= 400 && !notImage.body?.data?.url,
    `status=${notImage.status}`);
}

// ───────────────────── 3. Ba endpoint đã xoá + bản me còn sống ─────────────────────
{
  const push = await req("/api/notifications/push-status", { token: STUDENT });
  check("xoá: GET /notifications/push-status → 404", push.status, 404);

  const adminExam = await req("/api/users/exam-results", { token: ADMIN });
  check("xoá: GET /users/exam-results (admin) → 404", adminExam.status, 404);

  const players = await req("/api/players", { token: ADMIN });
  check("xoá: GET /players → 404", players.status, 404);

  const mine = await req("/api/users/me/exam-results", { token: STUDENT });
  check("giữ: GET /users/me/exam-results → 200", mine.status, 200);
  check("giữ: me/exam-results ban đầu rỗng", mine.body?.data, []);

  const save = await req("/api/users/me/exam-results", {
    token: STUDENT, method: "POST",
    body: { examId: "exam-test-1", examTitle: "Bài kiểm tra thử", score: 9, total: 10 },
  });
  check("giữ: POST /users/me/exam-results → 200", save.status, 200);
  const mineAfter = await req("/api/users/me/exam-results", { token: STUDENT });
  check("giữ: me/exam-results sau lưu có 1 bản ghi", mineAfter.body?.data?.length, 1);
}

server.close();
stub.close();
if (mongod) await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
