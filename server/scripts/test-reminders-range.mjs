// Test tích hợp: phân trang from/to cho GET /api/reminders — trang
// /dashboard/reminders phân trang RIÊNG hai mục "Sắp tới" (triggered=false)
// và "Đã nhắc" (triggered=true) + ô tìm kiếm, nên endpoint lọc theo
// ?triggered= và ?q= TRƯỚC khi cắt đoạn (pagination.total = tổng đã lọc).
// Không params → giữ nguyên shape cũ (mảng toàn bộ). Chạy app Express THẬT
// trên Mongo in-memory (mẫu test-admin-range.mjs):
//   node server/scripts/test-reminders-range.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `reminders_range_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-reminders-range-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "reminders_range_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const USER = "user-rem-range";
const OTHER = "user-rem-other";
const tok = signToken({ id: USER, username: "remrange", role: "teacher", name: "Rem Range" });
const tokOther = signToken({ id: OTHER, username: "remother", role: "teacher", name: "Rem Other" });

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
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

// ── Dữ liệu: user chính có 15 nhắc sắp tới + 12 đã nhắc; user khác có 3 ──
const T0 = Date.parse("2026-12-01T08:00:00.000Z");
const mk = (id, userId, title, i, triggered, message = "") => ({
  id,
  userId,
  title,
  message,
  remindAt: new Date(T0 + i * 3600_000).toISOString(),
  repeat: "none",
  type: "CUSTOM",
  relatedId: null,
  vibrate: true,
  sound: true,
  vibratePattern: "",
  isActive: true,
  triggered,
  createdAt: new Date(T0).toISOString(),
  updatedAt: new Date(T0).toISOString(),
});
const docs = [];
for (let i = 1; i <= 15; i++) {
  const title = i === 1 ? "Kiểm tra bài tập lớp 3" : `Nhắc sắp tới ${String(i).padStart(2, "0")}`;
  const message = i === 2 ? "Họp phụ huynh cuối tuần" : "";
  docs.push(mk(`rm-a${String(i).padStart(2, "0")}`, USER, title, i, false, message));
}
for (let i = 1; i <= 12; i++) {
  docs.push(mk(`rm-b${String(i).padStart(2, "0")}`, USER, `Đã nhắc ${String(i).padStart(2, "0")}`, 100 + i, true));
}
for (let i = 1; i <= 3; i++) {
  docs.push(mk(`rm-o${i}`, OTHER, `Nhắc của người khác ${i}`, 200 + i, false));
}
await getCollection("reminders").insertMany(docs);

// ── Không params → shape cũ: mảng toàn bộ của chính user, không pagination ──
const all = await req("/api/reminders", tok);
check("không params: 200", all.status, 200);
checkTrue("không params: data là mảng 27 nhắc của user", Array.isArray(all.body?.data) && all.body.data.length === 27);
check("không params: không có field pagination", all.body?.pagination ?? null, null);

// ── from/to trên toàn bộ danh sách ──
const p1 = await req("/api/reminders?from=1&to=10", tok);
check("from=1&to=10: 10 bản ghi", p1.body?.data?.length, 10);
check("from=1&to=10: pagination.total = 27", p1.body?.pagination?.total, 27);
check("from=1&to=10: pagination.from/to", [p1.body?.pagination?.from, p1.body?.pagination?.to], [1, 10]);
const p3 = await req("/api/reminders?from=21&to=30", tok);
check("from=21&to=30: 7 bản ghi cuối", p3.body?.data?.length, 7);
const pOver = await req("/api/reminders?from=28&to=30", tok);
check("from vượt total: data rỗng, total vẫn 27", [pOver.body?.data?.length, pOver.body?.pagination?.total], [0, 27]);

// ── Lọc triggered: mỗi mục phân trang độc lập, total là tổng của mục ──
const act1 = await req("/api/reminders?triggered=false&from=1&to=10", tok);
check("mục Sắp tới trang 1: 10 bản ghi", act1.body?.data?.length, 10);
check("mục Sắp tới: pagination.total = 15", act1.body?.pagination?.total, 15);
checkTrue("mục Sắp tới: mọi bản ghi đều triggered=false", (act1.body?.data || []).every((x) => x.triggered === false));
const act2 = await req("/api/reminders?triggered=false&from=11&to=20", tok);
check("mục Sắp tới trang 2: 5 bản ghi", act2.body?.data?.length, 5);
check("mục Sắp tới: 2 trang không trùng id",
  new Set([...(act1.body?.data || []), ...(act2.body?.data || [])].map((x) => x.id)).size, 15);
const past1 = await req("/api/reminders?triggered=true&from=1&to=10", tok);
check("mục Đã nhắc: pagination.total = 12", past1.body?.pagination?.total, 12);
checkTrue("mục Đã nhắc: mọi bản ghi đều triggered=true", (past1.body?.data || []).every((x) => x.triggered === true));

// ── Tìm kiếm q: không dấu/không hoa thường, khớp cả title lẫn message ──
// (q KHÔNG kèm from/to → vẫn shape cũ: mảng ĐÃ lọc, không có pagination —
// client trang quản lý luôn gửi q kèm from/to nên luôn nhận pagination.)
const qTitle = await req(`/api/reminders?triggered=false&q=${encodeURIComponent("kiem tra bai tap")}`, tok);
check("q không dấu khớp title có dấu: 1 bản ghi", qTitle.body?.data?.length, 1);
check("q title: đúng bản ghi", qTitle.body?.data?.[0]?.title, "Kiểm tra bài tập lớp 3");
const qMsg = await req(`/api/reminders?q=${encodeURIComponent("hop phu huynh")}`, tok);
check("q khớp message: 1 bản ghi", qMsg.body?.data?.length, 1);
const qTitleRanged = await req(`/api/reminders?triggered=false&q=${encodeURIComponent("kiem tra bai tap")}&from=1&to=10`, tok);
check("q + range: pagination.total = 1 (tổng đã lọc)", qTitleRanged.body?.pagination?.total, 1);
const qMany = await req(`/api/reminders?triggered=false&q=${encodeURIComponent("nhac sap toi")}&from=1&to=10`, tok);
check("q 'nhac sap toi': total = 14 (trừ bản ghi tiêu đề riêng)", qMany.body?.pagination?.total, 14);
check("q 'nhac sap toi': trang 1 có 10", qMany.body?.data?.length, 10);
const qNone = await req(`/api/reminders?q=${encodeURIComponent("khong ton tai xyz")}&from=1&to=10`, tok);
check("q không khớp: total = 0, data rỗng", [qNone.body?.pagination?.total, qNone.body?.data?.length], [0, 0]);

// ── Cô lập theo user + params sai ──
const other = await req("/api/reminders?from=1&to=10", tokOther);
check("user khác: total = 3 (chỉ nhắc của mình)", other.body?.pagination?.total, 3);
check("from=0 → 400", (await req("/api/reminders?from=0&to=5", tok)).status, 400);
check("from=abc → 400", (await req("/api/reminders?from=abc&to=5", tok)).status, 400);
check("to < from → 400", (await req("/api/reminders?from=5&to=2", tok)).status, 400);
check("chưa đăng nhập → 401", (await req("/api/reminders?from=1&to=5", null)).status, 401);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
