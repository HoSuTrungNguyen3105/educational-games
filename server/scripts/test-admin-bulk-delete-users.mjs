// Test API ADMIN XÓA HÀNG LOẠT tài khoản theo danh sách id:
// DELETE /api/users/bulk { ids: [...] } — chỉ admin gọi được; xóa từng id
// độc lập qua ĐÚNG removeUser() của xóa đơn lẻ (kèm cleanupUserRelatedData);
// bảo vệ cứng: không tự xóa mình, không xóa tài khoản role admin, id lạ vào
// failed "not found"; payload sai → 400; MỘT bản ghi audit user.bulk_delete
// cho cả batch. Cùng mẫu test-ai-role-grade: Mongo in-memory, KHÔNG mạng
// ngoài, KHÔNG key thật.
//   node server/scripts/test-admin-bulk-delete-users.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-bulk-del-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "bulk_delete_test";

const db = await import("../src/db.js");
await db.initDatabase();
// Chờ heavy-init nền seed xong user-002 (xem ghi chú ở khối seed bên dưới).
for (let i = 0; i < 120; i++) {
  if (await db.getCollection("users").findOne({ id: "user-002" })) break;
  await new Promise((r) => setTimeout(r, 250));
}
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const NOW = new Date().toISOString();
const mkUser = (id, role) => ({
  id, username: id.replace("user-", ""), name: `Tên ${id}`, role, passwordHash: "x", createdAt: NOW,
});
// LƯU Ý seed nền: initDatabase() chạy heavy-init ở BACKGROUND (không await
// được) và sẽ seed 2 tài khoản trong server/data/users.json — user-001
// (username "teacher", role "teacher") và user-002 (username "admin", role
// "admin") — tại thời điểm KHÔNG xác định, đồng thời tạo $jsonSchema
// validator cho các collection. Test chờ user-002 xuất hiện (tối đa ~30s)
// rồi mới seed dữ liệu của mình để tránh đua với validator/seed nền.
await db.getCollection("users").insertMany([
  mkUser("user-admin1", "admin"),
  mkUser("user-gv1", "teacher"),
  mkUser("user-hs1", "student"),
  mkUser("user-hs2", "student"),
  mkUser("user-parent1", "student"),
]);
// Dữ liệu liên quan của hs1 (phải bị dọn cùng khi xoá) + của gv1.
await db.getCollection("refresh_tokens").insertOne({ id: "rt-1", userId: "user-hs1", familyId: "f1", tokenHash: "h", createdAt: NOW });
await db.getCollection("user_devices").insertOne({ id: "dev-1", userId: "user-hs1", token: "t", createdAt: NOW });
await db.getCollection("parentLinks").insertMany([
  { id: "pl-1", parentId: "user-parent1", studentId: "user-hs1", createdAt: NOW },
  { id: "pl-2", parentId: "user-hs1", studentId: "user-hs2", createdAt: NOW },
]);
await db.getCollection("friendships").insertOne({ id: "fr-1", requesterId: "user-hs1", addresseeId: "user-hs2", status: "ACCEPTED", gate: null, createdAt: NOW });
await db.getCollection("userBlocks").insertOne({ id: "bl-1", blockerId: "user-hs2", blockedId: "user-hs1", createdAt: NOW });
await db.getCollection("teacher_classes").insertOne({ id: "tc-1", teacherId: "user-gv1", classId: "cls-x", createdAt: NOW });
await db.getCollection("notifications").insertOne({ id: "nt-1", toUserId: "user-hs1", title: "x", createdAt: NOW });
// Dữ liệu LỊCH SỬ của hs1 — theo thiết kế KHÔNG bị xoá (báo cáo đã nêu rõ).
await db.getCollection("results").insertOne({ id: "rs-1", gameId: "g1", playerId: "user-hs1", playerName: "HS1", score: 10, correctAnswers: 1, totalQuestions: 2, accuracy: 50, createdAt: NOW });

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const adminTok = tok("user-admin1", "admin", "Admin Một");
const teacherTok = tok("user-gv1", "teacher", "Giáo Viên Một");
const studentTok = tok("user-hs2", "student", "HS Hai");

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

const bulk = async (token, body) => {
  const res = await fetch(`${base}/api/users/bulk`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body ?? {}),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json };
};
const userExists = async (id) => !!(await db.getCollection("users").findOne({ id }));
const count = async (col, filter) => db.getCollection(col).countDocuments(filter);

// (a) Quyền: chưa đăng nhập → 401; student → 403; teacher → 403.
check("(a) không token → 401", (await bulk(null, { ids: ["user-hs1"] })).status, 401);
check("(a) student → 403", (await bulk(studentTok, { ids: ["user-hs1"] })).status, 403);
check("(a) teacher → 403", (await bulk(teacherTok, { ids: ["user-hs1"] })).status, 403);
checkTrue("(a) hs1 vẫn còn sau các lần gọi bị chặn", await userExists("user-hs1"));

// (f) Payload sai → 400 (trước khi đụng dữ liệu).
check("(f) ids không phải mảng → 400", (await bulk(adminTok, { ids: "user-hs1" })).status, 400);
check("(f) mảng rỗng → 400", (await bulk(adminTok, { ids: [] })).status, 400);
check("(f) phần tử không phải chuỗi → 400", (await bulk(adminTok, { ids: [123] })).status, 400);
check("(f) quá 100 id → 400", (await bulk(adminTok, { ids: Array.from({ length: 101 }, (_, i) => `x-${i}`) })).status, 400);
check("(f) thiếu body ids → 400", (await bulk(adminTok, {})).status, 400);

// (b)+(c)+(d)+(e) Batch hỗn hợp trong MỘT lần gọi của admin1.
const auditsBefore = await count("admin_logs", { action: "user.bulk_delete", actorId: "user-admin1" });
const r = await bulk(adminTok, { ids: ["user-hs1", "user-gv1", "user-admin1", "user-002", "user-khong-co", "user-hs1"] });
check("batch HTTP 200", r.status, 200);
check("deleted chứa đúng hs1 + gv1 (id trùng chỉ tính 1 lần)", [...(r.json?.data?.deleted || [])].sort(), ["user-gv1", "user-hs1"]);
check("deletedCount = 2", r.json?.data?.deletedCount, 2);
check("failedCount = 3", r.json?.data?.failedCount, 3);
const failById = Object.fromEntries((r.json?.data?.failed || []).map((f) => [f.id, f.reason]));
check("(c) tự xoá mình → cannot delete self", failById["user-admin1"], "cannot delete self");
check("(d) admin khác (user-002) → admin accounts are protected", failById["user-002"], "admin accounts are protected");
check("(e) id không tồn tại → not found", failById["user-khong-co"], "not found");
checkTrue("(b) hs1 đã biến mất khỏi users", !(await userExists("user-hs1")));
checkTrue("(b) gv1 đã biến mất khỏi users", !(await userExists("user-gv1")));
checkTrue("(c) admin1 vẫn còn", await userExists("user-admin1"));
checkTrue("(d) user-002 (admin) vẫn còn", await userExists("user-002"));
check("dọn refresh_tokens của hs1", await count("refresh_tokens", { userId: "user-hs1" }), 0);
check("dọn user_devices của hs1", await count("user_devices", { userId: "user-hs1" }), 0);
check("dọn parentLinks cả 2 chiều của hs1", await count("parentLinks", { $or: [{ parentId: "user-hs1" }, { studentId: "user-hs1" }] }), 0);
check("dọn friendships của hs1", await count("friendships", { $or: [{ requesterId: "user-hs1" }, { addresseeId: "user-hs1" }] }), 0);
check("dọn userBlocks của hs1", await count("userBlocks", { $or: [{ blockerId: "user-hs1" }, { blockedId: "user-hs1" }] }), 0);
check("dọn notifications gửi tới hs1", await count("notifications", { toUserId: "user-hs1" }), 0);
check("dọn teacher_classes của gv1", await count("teacher_classes", { teacherId: "user-gv1" }), 0);
check("GIỮ results (lịch sử) của hs1 theo thiết kế", await count("results", { playerId: "user-hs1" }), 1);

// (g) Audit: đúng MỘT bản ghi mới cho batch, meta chỉ gồm danh sách id đã
// xoá + 2 số đếm. Route ghi audit bất đồng bộ (fire-and-forget như mọi route
// user khác) nên chờ tối đa ~2s cho bản ghi xuất hiện.
let log = null;
for (let i = 0; i < 40 && !log; i++) {
  log = await db.getCollection("admin_logs").findOne({ action: "user.bulk_delete", actorId: "user-admin1" });
  if (!log) await new Promise((r) => setTimeout(r, 50));
}
const auditsAfter = await count("admin_logs", { action: "user.bulk_delete", actorId: "user-admin1" });
check("(g) số bản ghi audit bulk_delete của admin1 tăng đúng 1", auditsAfter - auditsBefore, 1);
check("(g) meta.deletedIds = 2 id đã xoá", [...(log?.meta?.deletedIds || [])].sort(), ["user-gv1", "user-hs1"]);
check("(g) meta.deletedCount/failedCount", [log?.meta?.deletedCount, log?.meta?.failedCount], [2, 3]);

// Xoá đơn lẻ vẫn chạy như cũ sau khi thêm route /bulk — chứng minh "bulk"
// không bị nuốt thành id và route /:id không hồi quy. LƯU Ý có sẵn từ
// trước: permissionFilter (tầng 2) đòi quyền users.delete cho DELETE
// /users/* — role teacher mặc định KHÔNG có quyền này (chỉ users.view) nên
// teacher bị 403 ở tầng 2 dù route cho phép teacher; admin có đủ quyền.
const singleTeacher = await fetch(`${base}/api/users/user-hs2`, { method: "DELETE", headers: { Authorization: `Bearer ${teacherTok}` } });
check("xoá đơn lẻ bằng teacher → 403 ở permissionFilter (hành vi có sẵn)", singleTeacher.status, 403);
const single = await fetch(`${base}/api/users/user-hs2`, { method: "DELETE", headers: { Authorization: `Bearer ${adminTok}` } });
check("xoá đơn lẻ DELETE /users/:id (admin) → 204", single.status, 204);
checkTrue("hs2 đã bị xoá bởi đường đơn lẻ", !(await userExists("user-hs2")));

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
