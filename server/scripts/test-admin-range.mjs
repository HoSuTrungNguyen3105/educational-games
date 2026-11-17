// Test tích hợp: phân đoạn danh sách quản trị bằng ?from=&to= (utils/rangeList).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-results-orphans.mjs):
//   node server/scripts/test-admin-range.mjs
// Bao phủ 3 endpoint đại diện cho 3 đường áp dụng:
//   • GET /api/users  — mảng toàn bộ trong bộ nhớ (respondWithRange)
//   • GET /api/games  — service tự cắt mặc định; from/to đi đường rangeAll
//   • GET /api/roles  — service phân trang page/perPage (respondWithPagedRange)
// Mỗi endpoint: không params → nguyên trạng; from=1&to=2 → đúng 2 phần tử +
// total đúng; from vượt total → data rỗng; params sai → 400.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ObjectId } from "mongodb";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `admin_range_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-admin-range-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "admin_range_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const admin = signToken({ id: "user-admin-range", username: "adminrange", role: "admin", name: "Admin Range" });

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
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

// ── Dữ liệu: 5 users (createdAt tăng dần), 5 games (updatedAt tăng dần),
//    4 roles ──────────────────────────────────────────────────────────────
const day = (d) => new Date(Date.UTC(2026, 0, d)).toISOString();
await getCollection("users").insertMany(
  [1, 2, 3, 4, 5].map((i) => ({
    _id: new ObjectId(),
    id: `user-range-${i}`,
    username: `rangeuser${i}`,
    name: `Range User ${i}`,
    role: "student",
    passwordHash: "x",
    createdAt: day(i),
    updatedAt: day(i),
  })),
);
await getCollection("games").insertMany(
  [1, 2, 3, 4, 5].map((i) => ({
    _id: new ObjectId(),
    name: `Range Game ${i}`,
    code: `range-game-${i}`,
    status: "published",
    type: "play-to-learn",
    createdAt: day(i),
    updatedAt: day(i),
  })),
);
await getCollection("roles").insertMany(
  [1, 2, 3, 4].map((i) => ({
    id: `role-range-${i}`,
    key: `rangerole${i}`,
    label: `Range Role ${i}`,
    name_en: `Range Role ${i}`,
    createdAt: day(i),
    updatedAt: day(i),
  })),
);

// ── GET /api/users ────────────────────────────────────────────────────────
const u0 = await req("/api/users", admin);
check("users không params: 200", u0.status, 200);
check("users không params: data đủ 5", u0.body?.data?.length, 5);
check("users không params: giữ shape cũ (pagination.total = 5, không có total ở cấp đầu)", [u0.body?.pagination?.total, u0.body?.total], [5, undefined]);

const u1 = await req("/api/users?from=1&to=2", admin);
check("users from=1&to=2: 200", u1.status, 200);
check("users from=1&to=2: đúng 2 phần tử", u1.body?.data?.length, 2);
check("users from=1&to=2: pagination.total/from/to", [u1.body?.pagination?.total, u1.body?.pagination?.from, u1.body?.pagination?.to], [5, 1, 2]);
check("users from=1&to=2: KHÔNG còn total/from/to ở cấp đầu", [u1.body?.total, u1.body?.from, u1.body?.to], [undefined, undefined, undefined]);
check("users from=1&to=2: đúng thứ tự createdAt tăng dần", u1.body?.data?.map((x) => x.username), ["rangeuser1", "rangeuser2"]);

const u2 = await req("/api/users?from=2", admin);
check("users chỉ from=2: to mặc định = from+9 = 11", [u2.body?.pagination?.from, u2.body?.pagination?.to], [2, 11]);
check("users chỉ from=2: còn 4 phần tử", u2.body?.data?.length, 4);

const u3 = await req("/api/users?from=99&to=100", admin);
check("users from vượt total: data rỗng, pagination.total vẫn 5", [u3.body?.data?.length, u3.body?.pagination?.total], [0, 5]);

for (const [label, qs] of [["from=0", "from=0"], ["from=abc", "from=abc"], ["to=0", "to=0"], ["from=3&to=2", "from=3&to=2"], ["from=1.5", "from=1.5"]]) {
  const bad = await req(`/api/users?${qs}`, admin);
  check(`users params sai (${label}): 400`, bad.status, 400);
}

// ── GET /api/games ────────────────────────────────────────────────────────
const g0 = await req("/api/games");
check("games không params: 200, đủ 5 game", [g0.status, g0.body?.data?.length, g0.body?.pagination?.total], [200, 5, 5]);

const g1 = await req("/api/games?from=1&to=2");
check("games from=1&to=2: đúng 2 phần tử + pagination.total/from/to", [g1.body?.data?.length, g1.body?.pagination?.total, g1.body?.pagination?.from, g1.body?.pagination?.to], [2, 5, 1, 2]);
check("games from=1&to=2: KHÔNG còn total/from/to ở cấp đầu", [g1.body?.total, g1.body?.from, g1.body?.to], [undefined, undefined, undefined]);
check("games from=1&to=2: thứ tự updatedAt giảm dần (mới nhất trước)", g1.body?.data?.map((x) => x.name), ["Range Game 5", "Range Game 4"]);

const g2 = await req("/api/games?from=4&to=99");
check("games from=4&to=99: còn 2 phần tử cuối", g2.body?.data?.map((x) => x.name), ["Range Game 2", "Range Game 1"]);

const g3 = await req("/api/games?from=42");
check("games from vượt total: data rỗng, pagination.total = 5", [g3.body?.data?.length, g3.body?.pagination?.total], [0, 5]);

const gBad = await req("/api/games?from=2&to=1");
check("games from=2&to=1 (to<from): 400", gBad.status, 400);

// ── GET /api/roles (service phân trang page/perPage) ─────────────────────
// LƯU Ý: listRolesPaged tự seed các vai trò built-in (admin/teacher/...)
// vào collection `roles` ở lần gọi đầu → tổng số vai trò = 4 built-in + 4
// bản test. Test không giả định total cứng: lấy total từ response gốc rồi
// đối chiếu các đoạn from/to theo đúng total đó.
const r0 = await req("/api/roles", admin);
const rolesTotal = r0.body?.pagination?.total;
check("roles không params: 200, có pagination.total", [r0.status, typeof rolesTotal], [200, "number"]);
check("roles không params: data là trang đầu (tối đa 10 bản ghi)", r0.body?.data?.length, Math.min(10, rolesTotal));

const r1 = await req("/api/roles?from=2&to=3", admin);
check("roles from=2&to=3: đúng 2 phần tử + pagination.total/from/to", [r1.body?.data?.length, r1.body?.pagination?.total, r1.body?.pagination?.from, r1.body?.pagination?.to], [2, rolesTotal, 2, 3]);
check("roles from=2&to=3: KHÔNG còn total/from/to ở cấp đầu", [r1.body?.total, r1.body?.from, r1.body?.to], [undefined, undefined, undefined]);
check("roles from=2&to=3: trùng vị trí 2-3 của danh sách gốc", r1.body?.data?.map((x) => x.slug), r0.body?.data?.slice(1, 3).map((x) => x.slug));

const r2 = await req(`/api/roles?from=${rolesTotal + 10}&to=${rolesTotal + 12}`, admin);
check("roles from vượt total: data rỗng, pagination.total giữ nguyên", [r2.body?.data?.length, r2.body?.pagination?.total], [0, rolesTotal]);

const rBad = await req("/api/roles?from=x", admin);
check("roles from=x: 400", rBad.status, 400);

// ── GET /api/permissions/roles (danh sách vai trò đầy đủ, mảng trong bộ nhớ)
const p0 = await req("/api/permissions/roles", admin);
check("permissions/roles không params: 200, data là mảng", [p0.status, Array.isArray(p0.body?.data)], [200, true]);
const p1 = await req("/api/permissions/roles?from=1&to=2", admin);
check("permissions/roles from=1&to=2: 2 phần tử + pagination.total khớp danh sách gốc", [p1.body?.data?.length, p1.body?.pagination?.total], [2, p0.body?.data?.length]);
check("permissions/roles from=1&to=2: KHÔNG còn total/from/to ở cấp đầu", [p1.body?.total, p1.body?.from, p1.body?.to], [undefined, undefined, undefined]);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
