// Test tích hợp: REFACTOR ROLE & PERMISSION (REFACTOR_API_Roles.md)
//   · Permission Catalog: GET /api/permissions/catalog trả bản ghi PHẲNG
//     {id, slug, name_vi, name_en, module, created_at, updated_at}, có
//     phân trang from/to + page/perPage + keyword; KHÔNG còn object
//     {view, edit, delete}; GET /api/permissions/features → 404.
//   · Roles: GET /api/roles kèm total_permissions khớp số bản ghi
//     role_permissions thật của từng vai trò.
//   · Role Permissions: GET chỉ trả quyền của vai trò được hỏi (+ phân
//     trang page/per_page); POST gán thêm không trùng; PUT đồng bộ toàn
//     bộ (thêm + gỡ); DELETE thu hồi (quyền cơ bản không thu hồi được);
//     permission_id không tồn tại → 400 không ghi; role không có → 404.
//   · Thực thi đầu-cuối qua middleware: vai trò tuỳ chỉnh chưa có
//     question_bank.view → 403 ở GET /api/question-banks; gán qua API →
//     200; thu hồi → 403 lại. Đại diện rule khác: users (admin/teacher),
//     reports.view (heatmap), assignments.edit (remediation POST),
//     events.manage (events/admin), question_bank.delete (teacher 403).
//   · Migration idempotent: chạy lại không nhân đôi role_permissions;
//     role doc kiểu cũ (matrix, chưa có cờ migrate) được dựng đúng.
//   · Hồi quy xác thực: register/login/refresh token vẫn chạy.
// Chạy app Express THẬT trên Mongo in-memory (mẫu test-events.mjs):
//   node server/scripts/test-role-permissions.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `roles_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-roles-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "roles_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const permissionService = await import("../src/services/permissionService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const ADMIN = "user-rp-admin";
const TEACHER = "user-rp-teacher";
const STUDENT = "user-rp-student";
const tokAdmin = signToken({ id: ADMIN, username: "rpadmin", role: "admin", name: "Admin" });
const tokTeacher = signToken({ id: TEACHER, username: "rpteacher", role: "teacher", name: "GV" });
const tokStudent = signToken({ id: STUDENT, username: "rpstudent", role: "student", name: "HS" });

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

const req = async (p, token, { method = "GET", body, headers = {} } = {}) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const parsed = await res.json().catch(() => null);
  return { status: res.status, body: parsed };
};

// ── Chuẩn bị: users cho heatmap (giáo viên dạy 1 lớp có học sinh) ──────
await getCollection("users").insertMany([
  { id: ADMIN, username: "rpadmin", name: "Admin", role: "admin" },
  { id: TEACHER, username: "rpteacher", name: "GV", role: "teacher" },
  { id: STUDENT, username: "rpstudent", name: "HS", role: "student", classId: "cls-rp-1" },
]);
await getCollection("classes").insertOne({ id: "cls-rp-1", name: "Lớp RP", teacherId: TEACHER });
// Quan hệ giáo viên ↔ lớp nằm ở collection teacher_classes (như test-heatmap).
await getCollection("teacher_classes").insertOne({ id: "tc-rp-1", teacherId: TEACHER, classId: "cls-rp-1" });

// ═══ A. Permission Catalog ═══════════════════════════════════════════
const cat1 = await req("/api/permissions/catalog?page=1&perPage=10", tokAdmin);
check("catalog: HTTP 200", cat1.status, 200);
check("catalog: trang 1 có 10 bản ghi", cat1.body.data.length, 10);
checkTrue("catalog: tổng = 138 bản ghi", cat1.body.pagination.total === 138, `total=${cat1.body.pagination.total}`);
const rec = cat1.body.data[0];
checkTrue(
  "catalog: bản ghi phẳng đủ trường, không có object permissions/view/edit/delete",
  ["id", "slug", "name_vi", "name_en", "module", "created_at", "updated_at"].every((k) => k in rec)
    && !("permissions" in rec) && !("view" in rec) && !("edit" in rec) && !("delete" in rec),
  JSON.stringify(rec)
);
const catRange = await req("/api/permissions/catalog?from=1&to=5", tokAdmin);
check("catalog: from/to trả 5 bản ghi", catRange.body.data.length, 5);
check("catalog: pagination.from/to", [catRange.body.pagination.from, catRange.body.pagination.to], [1, 5]);
const catSearch = await req("/api/permissions/catalog?keyword=games.view", tokAdmin);
checkTrue("catalog: tìm kiếm keyword thấy games.view", catSearch.body.data.some((d) => d.slug === "games.view"), JSON.stringify(catSearch.body.data.map((d) => d.slug)));
for (const slug of ["games.play", "events.manage", "attendance.checkin", "support_all"]) {
  const r = await req(`/api/permissions/catalog?keyword=${encodeURIComponent(slug)}`, tokAdmin);
  checkTrue(`catalog: có bản ghi riêng cho ${slug}`, r.body.data.some((d) => d.slug === slug), `total=${r.body.pagination.total}`);
}
const featuresRes = await req("/api/permissions/features", tokAdmin);
check("features: endpoint cũ đã bị loại bỏ (404)", featuresRes.status, 404);

// ═══ B. Roles + total_permissions ════════════════════════════════════
const rolesRes = await req("/api/roles?from=1&to=10", tokAdmin);
check("roles: HTTP 200", rolesRes.status, 200);
const roleRows = rolesRes.body.data;
checkTrue("roles: đủ 4 vai trò hệ thống", ["admin", "teacher", "student", "parent"].every((s) => roleRows.some((r) => r.slug === s)), JSON.stringify(roleRows.map((r) => r.slug)));
const adminRow = roleRows.find((r) => r.slug === "admin");
check("roles: admin total_permissions = toàn bộ catalog", adminRow.total_permissions, 138);
const teacherRow = roleRows.find((r) => r.slug === "teacher");
const teacherRp = await req(`/api/rolePermissions?role_id=${teacherRow.id}&per_page=500`, tokAdmin);
check("roles: total_permissions của teacher khớp số bản ghi role_permissions", teacherRp.body.pagination.total, teacherRow.total_permissions);

// Tạo vai trò tuỳ chỉnh qua API cũ (giữ tương thích) để test gán quyền.
const created = await req("/api/permissions/roles", tokAdmin, { method: "POST", body: { key: "rp_tester", label: "Vai trò kiểm tra RP" } });
check("roles: tạo vai trò tuỳ chỉnh 201", created.status, 201);
const rolesRes2 = await req("/api/roles?from=1&to=10", tokAdmin);
const testerRow = rolesRes2.body.data.find((r) => r.slug === "rp_tester");
checkTrue("roles: vai trò tuỳ chỉnh xuất hiện trong GET /api/roles", !!testerRow, JSON.stringify(rolesRes2.body.data.map((r) => r.slug)));

// ═══ C. Role Permissions CRUD ════════════════════════════════════════
const rp0 = await req(`/api/rolePermissions?role_id=${testerRow.id}&per_page=500`, tokAdmin);
check("rolePermissions: vai trò mới chỉ có 6 quyền cơ bản", rp0.body.pagination.total, 6);
checkTrue(
  "rolePermissions: bản ghi kèm role_slug + permission_slug + module",
  rp0.body.data.every((r) => r.role_slug === "rp_tester" && r.permission_slug && "module" in r && r.permission_id >= 1),
  JSON.stringify(rp0.body.data[0])
);
const rpPage = await req(`/api/rolePermissions?role_id=${testerRow.id}&per_page=2&page=2`, tokAdmin);
check("rolePermissions: phân trang per_page=2&page=2 → 2 bản ghi, total 6", [rpPage.body.data.length, rpPage.body.pagination.total], [2, 6]);
const rpBySlug = await req(`/api/rolePermissions?role_id=rp_tester&per_page=500`, tokAdmin);
check("rolePermissions: resolve được bằng slug", rpBySlug.body.pagination.total, 6);

const catAll = await req("/api/permissions/catalog?from=1&to=200", tokAdmin);
const idOf = (slug) => catAll.body.data.find((d) => d.slug === slug)?.id;
const reportsViewId = idOf("reports.view");
const assignmentsEditId = idOf("assignments.edit");
const gamesViewId = idOf("games.view");
const profileId = idOf("profile");
const qbViewId = idOf("question_bank.view");

const grant1 = await req("/api/rolePermissions", tokAdmin, { method: "POST", body: { role_id: testerRow.id, permission_ids: [reportsViewId, assignmentsEditId] } });
check("rolePermissions POST: gán 2 quyền", grant1.body.data.added, 2);
const grant2 = await req("/api/rolePermissions", tokAdmin, { method: "POST", body: { role_id: testerRow.id, permission_ids: [reportsViewId, assignmentsEditId] } });
check("rolePermissions POST: gán lại không trùng (added 0)", grant2.body.data.added, 0);
const rpCount = await getCollection("role_permissions").countDocuments({ role_key: "rp_tester" });
check("rolePermissions: số dòng trong DB = 8 (6 cơ bản + 2)", rpCount, 8);

const grantBad = await req("/api/rolePermissions", tokAdmin, { method: "POST", body: { role_id: testerRow.id, permission_ids: [999999] } });
check("rolePermissions POST: permission_id không tồn tại → 400", grantBad.status, 400);
const rpCount2 = await getCollection("role_permissions").countDocuments({ role_key: "rp_tester" });
check("rolePermissions: 400 thì không ghi thêm dòng nào", rpCount2, 8);
const grantNoRole = await req("/api/rolePermissions", tokAdmin, { method: "POST", body: { role_id: 999999, permission_ids: [reportsViewId] } });
check("rolePermissions POST: role không tồn tại → 404", grantNoRole.status, 404);

const sync1 = await req(`/api/rolePermissions/${testerRow.id}`, tokAdmin, { method: "PUT", body: { permission_ids: [gamesViewId] } });
checkTrue("rolePermissions PUT: đồng bộ có cả thêm và gỡ", sync1.body.data.added >= 1 && sync1.body.data.removed >= 1, JSON.stringify(sync1.body.data));
const rpAfterSync = await req(`/api/rolePermissions?role_id=${testerRow.id}&per_page=500`, tokAdmin);
const slugsAfterSync = rpAfterSync.body.data.map((r) => r.permission_slug).sort();
checkTrue(
  "rolePermissions PUT: sau đồng bộ chỉ còn quyền cơ bản + games.view",
  slugsAfterSync.includes("games.view") && !slugsAfterSync.includes("reports.view") && !slugsAfterSync.includes("assignments.edit") && rpAfterSync.body.pagination.total === 7,
  JSON.stringify(slugsAfterSync)
);

const revoke1 = await req("/api/rolePermissions", tokAdmin, { method: "DELETE", body: { role_id: testerRow.id, permission_ids: [gamesViewId] } });
check("rolePermissions DELETE: thu hồi games.view", revoke1.body.data.removed, 1);
const revokeBase = await req("/api/rolePermissions", tokAdmin, { method: "DELETE", body: { role_id: testerRow.id, permission_ids: [profileId] } });
check("rolePermissions DELETE: quyền cơ bản không thu hồi được", [revokeBase.body.data.removed, revokeBase.body.data.skipped_base], [0, 1]);

const grantTeacher = await req("/api/rolePermissions", tokTeacher, { method: "POST", body: { role_id: testerRow.id, permission_ids: [gamesViewId] } });
check("rolePermissions POST: giáo viên bị chặn (403)", grantTeacher.status, 403);
const rpStudent = await req(`/api/rolePermissions?role_id=${testerRow.id}`, tokStudent);
check("rolePermissions GET: học sinh bị chặn (403)", rpStudent.status, 403);

// ═══ D. Thực thi quyền đầu-cuối qua middleware ═══════════════════════
// Người dùng thuộc vai trò tuỳ chỉnh — đăng nhập thật qua API.
const reg = await req("/api/auth/register", null, { method: "POST", body: { username: "rpuser1", password: "rp-pass-123", name: "RP User" } });
check("auth: register 201", reg.status, 201);
await getCollection("users").updateOne({ username: "rpuser1" }, { $set: { role: "rp_tester" } });
const login = await req("/api/auth/login", null, { method: "POST", body: { username: "rpuser1", password: "rp-pass-123" } });
check("auth: login 200 sau khi đổi vai trò", login.status, 200);
const tokRpUser = login.body.data.token;

const qbBefore = await req("/api/question-banks?from=1&to=5", tokRpUser);
check("middleware: chưa có question_bank.view → 403", qbBefore.status, 403);
await req("/api/rolePermissions", tokAdmin, { method: "POST", body: { role_id: testerRow.id, permission_ids: [qbViewId] } });
// Middleware có cache quyền 30s — gọi service invalidate qua một thao tác
// ghi của chính service đã invalidate sẵn; chờ cache hết hạn là phương án
// chắc chắn nhất cho test.
await new Promise((r) => setTimeout(r, 100));
permissionService.invalidateRolePermissions("rp_tester");
const qbAfter = await req("/api/question-banks?from=1&to=5", tokRpUser);
check("middleware: gán question_bank.view qua API → 200", qbAfter.status, 200);
await req("/api/rolePermissions", tokAdmin, { method: "DELETE", body: { role_id: testerRow.id, permission_ids: [qbViewId] } });
permissionService.invalidateRolePermissions("rp_tester");
const qbRevoked = await req("/api/question-banks?from=1&to=5", tokRpUser);
check("middleware: thu hồi → 403 lại", qbRevoked.status, 403);

// Đại diện các rule khác:
const usersTeacher = await req("/api/users?from=1&to=5", tokTeacher);
checkTrue("rule users: giáo viên (users.view) không bị 403", usersTeacher.status !== 403, `status=${usersTeacher.status}`);
const usersStudent = await req("/api/users?from=1&to=5", tokStudent);
check("rule users: học sinh → 403", usersStudent.status, 403);
const heatTeacher = await req("/api/heatmap/class/cls-rp-1", tokTeacher);
check("rule reports.view: giáo viên xem heatmap lớp mình → 200", heatTeacher.status, 200);
const heatStudent = await req("/api/heatmap/class/cls-rp-1", tokStudent);
check("rule reports.view: học sinh → 403", heatStudent.status, 403);
const remTeacher = await req("/api/remediation/packs", tokTeacher, { method: "POST", body: {} });
checkTrue("rule assignments.edit: giáo viên qua được cổng quyền (không phải 403 quyền)", remTeacher.status !== 403, `status=${remTeacher.status} ${JSON.stringify(remTeacher.body?.msg || "")}`);
const remStudent = await req("/api/remediation/packs", tokStudent, { method: "POST", body: {} });
check("rule assignments.edit: học sinh → 403", remStudent.status, 403);
const evAdmin = await req("/api/events/admin", tokAdmin);
check("rule events.manage: admin → 200", evAdmin.status, 200);
const evTeacher = await req("/api/events/admin", tokTeacher);
check("rule events.manage: giáo viên → 403", evTeacher.status, 403);
const qbDelTeacher = await req("/api/question-banks/qb-khong-ton-tai", tokTeacher, { method: "DELETE" });
check("rule question_bank.delete: giáo viên (thiếu quyền delete) → 403", qbDelTeacher.status, 403);
const qbDelAdmin = await req("/api/question-banks/qb-khong-ton-tai", tokAdmin, { method: "DELETE" });
checkTrue("rule question_bank.delete: admin qua cổng quyền (404 vì không có câu hỏi)", qbDelAdmin.status === 404, `status=${qbDelAdmin.status}`);

// ═══ E. Hồi quy xác thực: refresh token ══════════════════════════════
// Refresh endpoint có policy origin (chỉ domain frontend thật) — gửi kèm
// header Origin như trình duyệt production vẫn gửi.
const refresh = await req("/api/auth/refresh", null, { method: "POST", body: { refreshToken: login.body.data.refreshToken }, headers: { Origin: "https://hosutrungnguyen3105.github.io" } });
check("auth: refresh bằng refreshToken trong body → 200", refresh.status, 200);
const me = await req("/api/auth/me", tokRpUser);
check("auth: /me 200", me.status, 200);
checkTrue("auth: /me trả permissions có profile", Array.isArray(me.body.data.permissions) && me.body.data.permissions.includes("profile"), JSON.stringify(Object.keys(me.body.data || {})));

// ═══ F. Migration idempotent + role doc kiểu cũ ══════════════════════
const adminCountBefore = await getCollection("role_permissions").countDocuments({ role_key: "admin" });
await permissionService.ensureRolePermissionsMigrated();
await permissionService.ensureRolePermissionsMigrated();
const adminCountAfter = await getCollection("role_permissions").countDocuments({ role_key: "admin" });
check("migration: chạy lại 2 lần không nhân đôi (admin)", adminCountAfter, adminCountBefore);
check("migration: admin có đủ 138 dòng", adminCountAfter, 138);

// Role doc kiểu cũ: chỉ có matrix, chưa có cờ migrate → đọc quyền phải
// dựng role_permissions đúng từ matrix.
await getCollection("roles").insertOne({
  id: "role-legacy-x", key: "legacy_x", label: "Vai trò cũ", isBuiltIn: false,
  dashboardAccess: false, matrix: { games: { view: true, edit: false, delete: false } },
  extraPermissions: [], createdAt: new Date().toISOString(),
});
const legacyPerms = await permissionService.getRolePermissions("legacy_x");
checkTrue(
  "migration: role cũ được dựng từ matrix (games.view + cơ bản)",
  legacyPerms.includes("games.view") && legacyPerms.includes("profile") && !legacyPerms.includes("games.edit"),
  JSON.stringify(legacyPerms)
);
const legacyRows = await getCollection("role_permissions").countDocuments({ role_key: "legacy_x" });
checkTrue("migration: role cũ có dòng role_permissions sau khi đọc", legacyRows >= 7, `rows=${legacyRows}`);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
await mongod?.stop();
process.exit(failed === 0 ? 0 : 1);
