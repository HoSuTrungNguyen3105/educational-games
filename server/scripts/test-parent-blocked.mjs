// Test tích hợp: phụ huynh xem danh sách người CON ĐÃ CHẶN (chỉ đọc).
// Chạy parentService THẬT + router /api/parents THẬT trên Mongo in-memory
// (mẫu như test-chat-reactions.mjs):
//   node server/scripts/test-parent-blocked.mjs
// Cần mongodb-memory-server (cài --no-save ở máy dev, không phải dep runtime).
// Biến môi trường TEST_MONGO_DBPATH: thư mục dữ liệu mongod tạm (mặc định
// cạnh script) — /tmp của một số máy là tmpfs nhỏ, mongod sẽ báo hết đĩa.
import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-mongo-data-parent");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "parent_blocked_test";

const db = await import("../src/db.js");
await db.connect();
const { getCollection } = db;
const parentService = await import("../src/services/parentService.js");
const { signToken } = await import("../src/services/authService.js");

// ── Dữ liệu mẫu ──────────────────────────────────────────────────────────
// P_LINKED: phụ huynh đã liên kết với S. P_OTHER: phụ huynh liên kết với
// S2 (không liên quan tới S). S đã chặn B1, B2; chiều ngược B1 chặn S —
// KHÔNG được tính là "người S đã chặn".
const P_LINKED = "user-parent-linked";
const P_OTHER = "user-parent-other";
const S = "user-student";
const S2 = "user-student-2";
const B1 = "user-blocked-1";
const B2 = "user-blocked-2";

await getCollection("users").insertMany([
  { id: P_LINKED, username: "phuhuynh1", name: "Phụ Huynh Một", role: "parent" },
  { id: P_OTHER, username: "phuhuynh2", name: "Phụ Huynh Hai", role: "parent" },
  { id: S, username: "hocsinh1", name: "Học Sinh Một", role: "student" },
  { id: S2, username: "hocsinh2", name: "Học Sinh Hai", role: "student" },
  { id: B1, username: "banmot", name: "Bạn Một", role: "student" },
  { id: B2, username: "banhai", name: "Bạn Hai", role: "student" },
]);
await getCollection("parentLinks").insertMany([
  { id: "plink-1", parentId: P_LINKED, studentId: S, createdAt: "2026-11-01T00:00:00.000Z" },
  { id: "plink-2", parentId: P_OTHER, studentId: S2, createdAt: "2026-11-01T00:00:00.000Z" },
]);
await getCollection("userBlocks").insertMany([
  { id: "blk-1", blockerId: S, blockedId: B1, createdAt: "2026-11-02T00:00:00.000Z" },
  { id: "blk-2", blockerId: S, blockedId: B2, createdAt: "2026-11-03T00:00:00.000Z" },
  { id: "blk-3", blockerId: B1, blockedId: S, createdAt: "2026-11-04T00:00:00.000Z" },
]);

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};
const checkThrows403 = async (name, fn) => {
  try {
    await fn();
    console.log(`FAIL  ${name}  → không ném lỗi`);
    failed++;
  } catch (e) {
    const ok = e.status === 403;
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}  → lỗi: [${e.status}] ${e.message}`);
    if (!ok) failed++;
  }
};

// ── 1. Service: phụ huynh đã liên kết xem được danh sách chặn của con ──
const list = await parentService.listChildBlockedUsers(P_LINKED, S);
check("đã liên kết: số người con đã chặn", list.length, 2);
check(
  "đã liên kết: đúng 2 người (không tính chiều ngược B1 chặn S)",
  list.map((b) => b.user.id).sort(),
  [B1, B2].sort()
);
check(
  "đã liên kết: chiếu tối thiểu chỉ id/username/name",
  list.map((b) => Object.keys(b.user).sort()),
  [["id", "name", "username"], ["id", "name", "username"]]
);
check(
  "đã liên kết: kèm thời điểm chặn (since)",
  list.every((b) => typeof b.since === "string" && b.since.length > 0),
  true
);

// ── 2. Service: phụ huynh liên kết với con KHÁC → 403 khi xem con này ──
await checkThrows403("chưa liên kết với con này: 403", () =>
  parentService.listChildBlockedUsers(P_OTHER, S)
);

// ── 3. Service: con không có ai bị chặn → mảng rỗng (không lỗi) ──
const empty = await parentService.listChildBlockedUsers(P_OTHER, S2);
check("con chưa chặn ai: trả []", empty, []);

// ── 4. HTTP qua router thật: phân quyền ở tầng route ──
const express = (await import("express")).default;
const parentsRouter = (await import("../src/routes/parents.js")).default;
const app = express();
app.use(express.json());
app.use("/api/parents", parentsRouter);
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const tokenOf = (id, username, role, name) =>
  signToken({ id, username, role, name });
const get = async (pathName, token) => {
  const res = await fetch(`${base}${pathName}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

const okRes = await get(
  `/api/parents/children/${S}/blocked-users`,
  tokenOf(P_LINKED, "phuhuynh1", "parent", "Phụ Huynh Một")
);
check("HTTP phụ huynh đã liên kết: 200", okRes.status, 200);
check("HTTP phụ huynh đã liên kết: data có 2 mục", okRes.body?.data?.length, 2);

const unlinkedRes = await get(
  `/api/parents/children/${S}/blocked-users`,
  tokenOf(P_OTHER, "phuhuynh2", "parent", "Phụ Huynh Hai")
);
check("HTTP phụ huynh chưa liên kết với con này: 403", unlinkedRes.status, 403);

const studentRes = await get(
  `/api/parents/children/${S}/blocked-users`,
  tokenOf(S, "hocsinh1", "student", "Học Sinh Một")
);
check("HTTP học sinh tự gọi endpoint phụ huynh: 403", studentRes.status, 403);

const anonRes = await get(`/api/parents/children/${S}/blocked-users`, null);
check("HTTP chưa đăng nhập: 401", anonRes.status, 401);

server.close();
await db.disconnect?.().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
