// Test tích hợp: phân trang phía server + lọc ?q= cho các trang quản trị
// chuyển sang cụm RangePagination dùng chung (mẫu /dashboard/permissions):
//   GET /users?q= · GET /templates?q=&status=&sort= · GET /categories?q=
//   GET /subjects?q= · GET /classes?q= · GET /tasks/admin/stats?from&to&q=
//   GET /documents/mine?search= · GET /lessons/mine?search=
// Nguyên tắc (mẫu routes/reminders.js PR #149): lọc chỉ áp khi client GỬI
// tham số, chạy TRƯỚC khi cắt from/to → pagination.total là tổng ĐÃ lọc;
// không gửi → hành vi/shape cũ nguyên vẹn. Chạy app Express THẬT trên
// Mongo in-memory (mẫu test-reminders-range.mjs):
//   node server/scripts/test-pagination-filters.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `pagination_filters_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-pagination-filters-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "pagination_filters_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;
const { ObjectId } = await import("mongodb");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const ADMIN = "user-pf-admin";
const TEACHER = "user-pf-teacher";
const tokAdmin = signToken({ id: ADMIN, username: "pfadmin", role: "admin", name: "PF Admin" });
const tokTeacher = signToken({ id: TEACHER, username: "pfteacher", role: "teacher", name: "PF Teacher" });

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

const day = (d) => new Date(Date.UTC(2026, 0, d)).toISOString();
const oid = () => new ObjectId();

// ── USERS: 15 người — 5 tên "Nguyễn Văn …" (student), 3 teacher, 7 còn lại ──
await getCollection("classes").insertMany([
  { _id: oid(), id: "cls-pf-1", name: "Lớp Hoa Hồng", code: "PF0001", schoolYear: "2025-2026", status: "ACTIVE", createdAt: day(1), updatedAt: day(1) },
  ...Array.from({ length: 11 }, (_, i) => ({
    _id: oid(), id: `cls-pf-x${i + 2}`, name: `Lớp phụ ${i + 2}`, code: `PFX${i + 2}`, schoolYear: "2024-2025", status: "ACTIVE", createdAt: day(2), updatedAt: day(2),
  })),
]);
await getCollection("users").insertMany([
  ...[1, 2, 3, 4, 5].map((i) => ({
    _id: oid(), id: `user-pf-s${i}`, username: `hocsinh${i}`, email: `hs${i}@x.vn`,
    name: `Nguyễn Văn Học ${i}`, role: "student", passwordHash: "x",
    classId: i === 1 ? "cls-pf-1" : null, createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2, 3].map((i) => ({
    _id: oid(), id: `user-pf-t${i}`, username: `giaovien${i}`, email: `gv${i}@x.vn`,
    name: `Trần Thị Dạy ${i}`, role: "teacher", passwordHash: "x",
    classId: null, createdAt: day(5 + i), updatedAt: day(5 + i),
  })),
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => ({
    _id: oid(), id: `user-pf-o${i}`, username: `other${i}`, email: `ot${i}@x.vn`,
    name: `Phạm Văn Khác ${i}`, role: "student", passwordHash: "x",
    classId: null, createdAt: day(8 + i), updatedAt: day(8 + i),
  })),
]);

// ── TEMPLATES: 12 — 5 published, 4 draft, 3 inactive ──
await getCollection("templates").insertMany([
  ...[1, 2, 3, 4, 5].map((i) => ({
    _id: oid(), name: `Đố vui ${i}`, slug: `do-vui-${i}`, category: "quiz", type: "play-to-learn",
    status: "published", version: 1, createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2, 3, 4].map((i) => ({
    _id: oid(), name: `Ghép hình ${i}`, slug: `ghep-hinh-${i}`, category: "puzzle", type: "play-to-learn",
    status: "draft", version: 1, createdAt: day(6 + i), updatedAt: day(6 + i),
  })),
  ...[1, 2, 3].map((i) => ({
    _id: oid(), name: `Phiêu lưu ${i}`, slug: `phieu-luu-${i}`, category: "adventure", type: "play-to-win",
    status: "inactive", version: 1, createdAt: day(10 + i), updatedAt: day(10 + i),
  })),
]);

// ── CATEGORIES: 12 ──
await getCollection("categories").insertMany(
  ["Trắc nghiệm", "Ghép hình", "Phiêu lưu", "Đố vui", "Xếp chữ", "Tính nhẩm", "Nghe hiểu", "Đọc hiểu", "Vẽ tranh", "Âm nhạc", "Thể thao", "Khoa học"]
    .map((label, i) => ({ _id: oid(), id: `cat-pf-${String(i + 1).padStart(2, "0")}`, label })),
);

// ── SUBJECTS: 12 ──
await getCollection("subjects").insertMany(
  ["Toán", "Tiếng Việt", "Tiếng Anh", "Khoa học", "Lịch sử", "Địa lý", "Âm nhạc", "Mỹ thuật", "Thể dục", "Đạo đức", "Tin học", "Tự nhiên"]
    .map((name) => ({ _id: oid(), name })),
);

// ── TASKS: 15 active (5 GAME_PLAYED, 5 LOGIN, 5 GAME_WON) + 2 inactive ──
await getCollection("tasks").insertMany([
  ...[1, 2, 3, 4, 5].map((i) => ({
    _id: oid(), code: `PLAY_${i}`, name: `Chơi game lần ${i}`, description: "", type: "GAME_PLAYED",
    scope: "DAILY", target: i, rewardCoin: 10, rewardXp: 0, isActive: true, sortOrder: i,
    createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2, 3, 4, 5].map((i) => ({
    _id: oid(), code: `LOGIN_${i}`, name: `Đăng nhập ngày ${i}`, description: "", type: "LOGIN",
    scope: "DAILY", target: 1, rewardCoin: 5, rewardXp: 0, isActive: true, sortOrder: 10 + i,
    createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2, 3, 4, 5].map((i) => ({
    _id: oid(), code: `WIN_${i}`, name: `Thắng trận ${i}`, description: "", type: "GAME_WON",
    scope: "WEEKLY", target: 2, rewardCoin: 20, rewardXp: 0, isActive: true, sortOrder: 20 + i,
    createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2].map((i) => ({
    _id: oid(), code: `OFF_${i}`, name: `Nhiệm vụ tắt ${i}`, description: "", type: "LOGIN",
    scope: "DAILY", target: 1, rewardCoin: 5, rewardXp: 0, isActive: false, sortOrder: 30 + i,
    createdAt: day(i), updatedAt: day(i),
  })),
]);

// ── DOCUMENTS: 12 của TEACHER (8 word, 4 powerpoint) + 3 của người khác ──
await getCollection("documents").insertMany([
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    _id: oid(), id: `doc-pf-w${i}`, ownerId: TEACHER, name: `Phiếu bài tập ${i}`,
    docType: "word", mode: "html", source: "<p>x</p>", createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2, 3, 4].map((i) => ({
    _id: oid(), id: `doc-pf-p${i}`, ownerId: TEACHER, name: `Bài giảng điện tử ${i}`,
    docType: "powerpoint", mode: "json", source: "{}", createdAt: day(9 + i), updatedAt: day(9 + i),
  })),
  ...[1, 2, 3].map((i) => ({
    _id: oid(), id: `doc-pf-o${i}`, ownerId: "user-pf-other", name: `Tài liệu người khác ${i}`,
    docType: "word", mode: "html", source: "<p>y</p>", createdAt: day(i), updatedAt: day(i),
  })),
]);

// ── LESSONS: 12 của TEACHER (7 published, 5 draft) + 2 của người khác ──
await getCollection("lessons").insertMany([
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => ({
    _id: oid(), id: `les-pf-p${i}`, ownerId: TEACHER, title: `Bài học Toán ${i}`, subject: "Toán",
    grade: 3, status: "published", pages: [], createdAt: day(i), updatedAt: day(i),
  })),
  ...[1, 2, 3, 4, 5].map((i) => ({
    _id: oid(), id: `les-pf-d${i}`, ownerId: TEACHER, title: `Bài nháp Văn ${i}`, subject: "Tiếng Việt",
    grade: 4, status: "draft", pages: [], createdAt: day(8 + i), updatedAt: day(8 + i),
  })),
  ...[1, 2].map((i) => ({
    _id: oid(), id: `les-pf-o${i}`, ownerId: "user-pf-other", title: `Bài của người khác ${i}`, subject: "Toán",
    grade: 3, status: "published", pages: [], createdAt: day(i), updatedAt: day(i),
  })),
]);

// ═══ USERS ═══
{
  const all = await req("/api/users", tokAdmin);
  check("users: không params → đủ 15", all.body?.data?.length, 15);
  const page2 = await req("/api/users?from=11&to=20", tokAdmin);
  check("users: from=11&to=20 → 5 mục", page2.body?.data?.length, 5);
  check("users: pagination.total = 15", page2.body?.pagination?.total, 15);
  const q = await req("/api/users?q=nguyen%20van%20hoc", tokAdmin);
  check("users: q không dấu khớp tên có dấu → 5", q.body?.data?.length, 5);
  const qRole = await req("/api/users?q=gi%C3%A1o%20vi%C3%AAn", tokAdmin);
  check("users: q theo nhãn 'Giáo viên' → 3", qRole.body?.data?.length, 3);
  const qClass = await req("/api/users?q=hoa%20hong&from=1&to=10", tokAdmin);
  check("users: q theo tên lớp → total 1", qClass.body?.pagination?.total, 1);
  const qRange = await req("/api/users?q=hoc%20sinh&from=2&to=3", tokAdmin);
  checkTrue("users: q nhãn 'Học sinh' → total 12", qRange.body?.pagination?.total === 12, `total=${qRange.body?.pagination?.total}`);
  check("users: q + from=2&to=3 → 2 mục", qRange.body?.data?.length, 2);
}

// ═══ TEMPLATES ═══
{
  const all = await req("/api/templates");
  check("templates: không params → đủ 12", all.body?.data?.length, 12);
  const st = await req("/api/templates?status=draft&from=1&to=10", tokAdmin);
  check("templates: status=draft → total 4", st.body?.pagination?.total, 4);
  const q = await req("/api/templates?q=ghep%20hinh&from=1&to=10", tokAdmin);
  check("templates: q không dấu → total 4", q.body?.pagination?.total, 4);
  const qSt = await req("/api/templates?q=do%20vui&status=published&from=1&to=2", tokAdmin);
  check("templates: q + status → total 5", qSt.body?.pagination?.total, 5);
  check("templates: q + status + from=1&to=2 → 2 mục", qSt.body?.data?.length, 2);
  const sorted = await req("/api/templates?sort=updated&from=1&to=3", tokAdmin);
  check("templates: sort=updated → mục đầu là bản mới nhất", sorted.body?.data?.[0]?.name, "Phiêu lưu 3");
}

// ═══ CATEGORIES ═══
{
  const all = await req("/api/categories");
  check("categories: không params → đủ 12", all.body?.data?.length, 12);
  const q = await req("/api/categories?q=trac%20nghiem&from=1&to=10", tokAdmin);
  check("categories: q không dấu → total 1", q.body?.pagination?.total, 1);
  check("categories: q khớp đúng label", q.body?.data?.[0]?.label, "Trắc nghiệm");
  const page = await req("/api/categories?from=11&to=20", tokAdmin);
  check("categories: from=11&to=20 → 2 mục, total 12", [page.body?.data?.length, page.body?.pagination?.total], [2, 12]);
}

// ═══ SUBJECTS ═══
{
  const all = await req("/api/subjects");
  check("subjects: không params → đủ 12", all.body?.data?.length, 12);
  const q = await req("/api/subjects?q=tieng%20anh&from=1&to=10", tokAdmin);
  check("subjects: q không dấu → total 1", q.body?.pagination?.total, 1);
  check("subjects: q khớp đúng môn", q.body?.data?.[0]?.name, "Tiếng Anh");
}

// ═══ CLASSES (admin thấy tất cả) ═══
{
  const all = await req("/api/classes", tokAdmin);
  check("classes: không params → đủ 12", all.body?.data?.length, 12);
  const q = await req("/api/classes?q=hoa%20hong&from=1&to=10", tokAdmin);
  check("classes: q theo tên lớp → total 1", q.body?.pagination?.total, 1);
  const qYear = await req("/api/classes?q=2024-2025&from=1&to=5", tokAdmin);
  check("classes: q theo năm học → total 11", qYear.body?.pagination?.total, 11);
  check("classes: q năm học + from=1&to=5 → 5 mục", qYear.body?.data?.length, 5);
}

// ═══ TASKS ADMIN STATS ═══
{
  const plain = await req("/api/tasks/admin/stats", tokAdmin);
  check("tasks stats: không params → tasks đủ 15 active", plain.body?.data?.tasks?.length, 15);
  checkTrue("tasks stats: không params → KHÔNG có field pagination", plain.body?.data?.pagination === undefined);
  check("tasks stats: totalTasks = 15", plain.body?.data?.totalTasks, 15);
  const page = await req("/api/tasks/admin/stats?from=11&to=20", tokAdmin);
  check("tasks stats: from=11&to=20 → 5 tasks", page.body?.data?.tasks?.length, 5);
  check("tasks stats: pagination.total = 15", page.body?.data?.pagination?.total, 15);
  check("tasks stats: có range → totalTasks vẫn 15 (tổng toàn bộ)", page.body?.data?.totalTasks, 15);
  const q = await req("/api/tasks/admin/stats?q=choi%20game&from=1&to=10", tokAdmin);
  check("tasks stats: q theo nhãn loại 'Chơi game' → total 5", q.body?.data?.pagination?.total, 5);
  const qCode = await req("/api/tasks/admin/stats?q=login_&from=1&to=10", tokAdmin);
  check("tasks stats: q theo mã → total 5", qCode.body?.data?.pagination?.total, 5);
}

// ═══ DOCUMENTS MINE ═══
{
  const all = await req("/api/documents/mine", tokTeacher);
  check("documents: không params → 12 tài liệu của tôi", all.body?.data?.length, 12);
  const ranged = await req("/api/documents/mine?from=11&to=20", tokTeacher);
  check("documents: from=11&to=20 → 2 mục, total 12", [ranged.body?.data?.length, ranged.body?.pagination?.total], [2, 12]);
  const search = await req("/api/documents/mine?search=bai%20giang&from=1&to=10", tokTeacher);
  check("documents: search không dấu → total 4", search.body?.pagination?.total, 4);
  const type = await req("/api/documents/mine?docType=powerpoint&from=1&to=10", tokTeacher);
  check("documents: docType=powerpoint → total 4", type.body?.pagination?.total, 4);
}

// ═══ LESSONS MINE ═══
{
  const all = await req("/api/lessons/mine", tokTeacher);
  check("lessons: không params → 12 bài của tôi", all.body?.data?.length, 12);
  const ranged = await req("/api/lessons/mine?from=11&to=20", tokTeacher);
  check("lessons: from=11&to=20 → 2 mục, total 12", [ranged.body?.data?.length, ranged.body?.pagination?.total], [2, 12]);
  const search = await req("/api/lessons/mine?search=tieng%20viet&from=1&to=10", tokTeacher);
  check("lessons: search theo môn không dấu → total 5", search.body?.pagination?.total, 5);
  const st = await req("/api/lessons/mine?status=published&from=1&to=10", tokTeacher);
  check("lessons: status=published → total 7", st.body?.pagination?.total, 7);
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
await mongod?.stop().catch(() => {});
process.exit(failed === 0 ? 0 : 1);
