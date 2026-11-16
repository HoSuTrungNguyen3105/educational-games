// Test tích hợp: ĐỢT DASHBOARD WAVE 1 (mục 3/4/5/6).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-game-template-link.mjs):
//   node server/scripts/test-dashboard-wave1.mjs
// Bao phủ: (a) GET /api/classes trả studentCount đúng (khoá join users.classId
// = classes.id — có doc "mồi" gắn classId theo _id và theo code để chứng minh
// không đếm nhầm) + teacherName qua teacher_classes, GET /:id cũng có, và
// PUT /:id sửa được name/status mà không đổi code;
// (b) reminder isActive: mặc định true khi tạo, isActive=false bị
// getDueReminders + processDueReminders bỏ qua, doc cũ không có field vẫn lọt;
// (c) POST /api/tasks/admin/seed khi tasks rỗng → nạp đủ bộ mẫu, gọi lần 2 →
// inserted=0, và role không phải admin bị 403;
// (d) GET /api/conversations trả lastMessage cho cuộc có tin, null cho cuộc
// chưa có tin, kèm partner.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// Mặc định dùng mongodb-memory-server; máy chưa cài package này có thể trỏ
// TEST_MONGODB_URI (+ TEST_MONGODB_DB) vào DB test riêng — script DROP DB
// đó ở cuối. Không truyền TEST_MONGODB_URI thì giữ nguyên hành vi cũ.
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `dashboard_wave1_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-dashboard-wave1-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "dashboard_wave1_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const reminderService = await import("../src/services/reminderService.js");
const { buildDefaultTasks } = await import("../src/services/taskDefaults.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const admin = signToken({ id: "user-admin-dash", username: "admindash", role: "admin", name: "Admin Dash" });
const teacherTok = signToken({ id: "user-gv-dash1", username: "gvdash1", role: "teacher", name: "Cô Lan Anh" });

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

const req = async (method, p, token, payload) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

const now = new Date().toISOString();

// ── (a) Lớp: studentCount + teacherName ──────────────────────────────────
// _id của lớp CỐ Ý khác id: users.classId/teacher_classes.classId join theo
// `id` (cls-...), nên doc mồi gắn theo _id hoặc theo code KHÔNG được đếm.
await getCollection("classes").insertMany([
  { _id: "cls-dash-a-objid", id: "cls-dash-a", name: "Lớp 3A Test", code: "DASH01", schoolYear: "2025-2026", status: "ACTIVE", createdAt: now, updatedAt: now },
  { _id: "cls-dash-b-objid", id: "cls-dash-b", name: "Lớp 3B Test", code: "DASH02", schoolYear: "2025-2026", status: "ACTIVE", createdAt: now, updatedAt: now },
]);
const mkUser = (id, username, name, role, extra = {}) => ({ id, username, name, role, passwordHash: "x", createdAt: now, ...extra });
await getCollection("users").insertMany([
  mkUser("user-gv-dash1", "gvdash1", "Cô Lan Anh", "teacher"),
  mkUser("user-hs-dash1", "hsdash1", "HS Một", "student", { classId: "cls-dash-a" }),
  mkUser("user-hs-dash2", "hsdash2", "HS Hai", "student", { classId: "cls-dash-a" }),
  mkUser("user-hs-dash3", "hsdash3", "HS Ba", "student", { classId: "cls-dash-a" }),
  // Mồi: classId = _id của lớp → không được tính.
  mkUser("user-hs-dash4", "hsdash4", "HS Bốn (mồi _id)", "student", { classId: "cls-dash-a-objid" }),
  // Mồi: classId = code của lớp → không được tính.
  mkUser("user-hs-dash5", "hsdash5", "HS Năm (mồi code)", "student", { classId: "DASH01" }),
  // Mồi: đúng classId nhưng role teacher → sĩ số chỉ đếm student.
  mkUser("user-gv-dash2", "gvdash2", "Thầy Phụ", "teacher", { classId: "cls-dash-a" }),
]);
await getCollection("teacher_classes").insertOne({ id: "tc-dash-1", teacherId: "user-gv-dash1", classId: "cls-dash-a", createdAt: now });

const listRes = await req("GET", "/api/classes", admin);
check("GET /classes: 200", listRes.status, 200);
const clsA = (listRes.body?.data || []).find((c) => c.id === "cls-dash-a");
const clsB = (listRes.body?.data || []).find((c) => c.id === "cls-dash-b");
check("List: studentCount lớp A = 3 (chỉ join theo id + role student)", clsA?.studentCount, 3);
check("List: teacherName lớp A", clsA?.teacherName, "Cô Lan Anh");
check("List: studentCount lớp B = 0", clsB?.studentCount, 0);
check("List: teacherName lớp B = null (chưa có GV)", clsB?.teacherName, null);
check("List: shape cũ còn nguyên (code)", clsA?.code, "DASH01");

const gotRes = await req("GET", "/api/classes/cls-dash-a", admin);
check("GET /classes/:id: studentCount = 3", gotRes.body?.data?.studentCount, 3);
check("GET /classes/:id: teacherName", gotRes.body?.data?.teacherName, "Cô Lan Anh");

const putRes = await req("PUT", "/api/classes/cls-dash-a", admin, { name: "Lớp 3A Đã Sửa", schoolYear: "2026-2027", status: "INACTIVE" });
check("PUT /classes/:id: 200", putRes.status, 200);
check("PUT: name đã đổi", putRes.body?.data?.name, "Lớp 3A Đã Sửa");
check("PUT: status đã đổi", putRes.body?.data?.status, "INACTIVE");
check("PUT: code không đổi", putRes.body?.data?.code, "DASH01");

// ── (b) Reminder isActive ─────────────────────────────────────────────────
const past = new Date(Date.now() - 60000).toISOString();
const rOn = await reminderService.createReminder({ userId: "user-gv-dash1", title: "Nhắc đang bật", remindAt: past });
check("createReminder: isActive mặc định = true", rOn.isActive, true);
const rOff = await reminderService.createReminder({ userId: "user-gv-dash1", title: "Nhắc sẽ tắt", remindAt: past });
const updatedOff = await reminderService.updateReminder(rOff.id, { isActive: false });
check("updateReminder: isActive=false lưu được", updatedOff?.isActive, false);
// Doc cũ chưa có field isActive (gắn thẳng DB) — phải vẫn được dispatch.
await getCollection("reminders").insertOne({
  id: "rmnd-legacy-dash", userId: "user-gv-dash1", title: "Nhắc cũ không có isActive", message: "",
  remindAt: past, repeat: "none", type: "CUSTOM", relatedId: "", triggered: false, createdAt: now,
});

const dueIds1 = (await reminderService.getDueReminders()).map((r) => r.id);
checkTrue("getDueReminders: chứa reminder đang bật", dueIds1.includes(rOn.id), dueIds1.join(","));
checkTrue("getDueReminders: chứa reminder cũ (không có isActive)", dueIds1.includes("rmnd-legacy-dash"), dueIds1.join(","));
checkTrue("getDueReminders: KHÔNG chứa reminder đã tắt", !dueIds1.includes(rOff.id), dueIds1.join(","));

await reminderService.processDueReminders();
const afterOn = await reminderService.getReminderById(rOn.id);
const afterOff = await reminderService.getReminderById(rOff.id);
check("processDueReminders: reminder bật đã triggered", afterOn?.triggered, true);
check("processDueReminders: reminder tắt KHÔNG bị triggered", afterOff?.triggered, false);

const reEnabled = await reminderService.updateReminder(rOff.id, { isActive: true });
check("updateReminder: bật lại isActive=true", reEnabled?.isActive, true);
const dueIds2 = (await reminderService.getDueReminders()).map((r) => r.id);
checkTrue("getDueReminders: reminder bật lại lọt trở lại", dueIds2.includes(rOff.id), dueIds2.join(","));

// ── (c) POST /api/tasks/admin/seed ────────────────────────────────────────
// initDatabase đã seed tasks lúc khởi tạo (collection rỗng) — xoá sạch để
// mô phỏng đúng tình huống "hệ nhiệm vụ rỗng" mà endpoint phục vụ.
await getCollection("tasks").deleteMany({});
const totalDefaults = buildDefaultTasks().length;

const forbidden = await req("POST", "/api/tasks/admin/seed", teacherTok);
check("POST /tasks/admin/seed bằng token teacher: 403", forbidden.status, 403);

const seed1 = await req("POST", "/api/tasks/admin/seed", admin);
check("POST /tasks/admin/seed lần 1: 200", seed1.status, 200);
check("Seed lần 1: inserted = toàn bộ bộ mẫu", seed1.body?.data?.inserted, totalDefaults);
check("Seed lần 1: skipped = 0", seed1.body?.data?.skipped, 0);
check("Seed lần 1: total = số nhiệm vụ mẫu", seed1.body?.data?.total, totalDefaults);
check("Seed lần 1: collection có đủ nhiệm vụ", await getCollection("tasks").countDocuments(), totalDefaults);

const seed2 = await req("POST", "/api/tasks/admin/seed", admin);
check("Seed lần 2: inserted = 0", seed2.body?.data?.inserted, 0);
check("Seed lần 2: skipped = toàn bộ", seed2.body?.data?.skipped, totalDefaults);

// Xoá 1 nhiệm vụ mẫu → seed lại chỉ nạp đúng nhiệm vụ thiếu đó.
await getCollection("tasks").deleteOne({ code: "PLAY_1" });
const seed3 = await req("POST", "/api/tasks/admin/seed", admin);
check("Seed lần 3 (thiếu PLAY_1): inserted = 1", seed3.body?.data?.inserted, 1);
check("Seed lần 3: PLAY_1 đã trở lại", !!(await getCollection("tasks").findOne({ code: "PLAY_1" })), true);

// ── (d) GET /api/conversations: lastMessage + partner ────────────────────
const convWithMsg = "dm:user-admin-dash:user-hs-dash1";
const convEmpty = "dm:user-admin-dash:user-hs-dash2";
await getCollection("conversations").insertMany([
  { id: convWithMsg, type: "dm", memberIds: ["user-admin-dash", "user-hs-dash1"], name: null, createdAt: now },
  { id: convEmpty, type: "dm", memberIds: ["user-admin-dash", "user-hs-dash2"], name: null, createdAt: now },
]);
await getCollection("conversationMembers").insertMany([
  { conversationId: convWithMsg, userId: "user-admin-dash", displayName: "Admin Dash", joinedAt: now },
  { conversationId: convEmpty, userId: "user-admin-dash", displayName: "Admin Dash", joinedAt: now },
]);
await getCollection("messages").insertOne({
  id: "msg-dash-1", conversationId: convWithMsg, senderId: "user-hs-dash1",
  playerName: "HS Một", content: "Chào cô, em nộp bài rồi ạ", createdAt: now,
});

const convRes = await req("GET", "/api/conversations", admin);
check("GET /conversations: 200", convRes.status, 200);
const convs = convRes.body?.data || [];
const cMsg = convs.find((c) => c.id === convWithMsg);
const cEmpty = convs.find((c) => c.id === convEmpty);
check("Conversations: lastMessage.content", cMsg?.lastMessage?.content, "Chào cô, em nộp bài rồi ạ");
check("Conversations: lastMessage.senderId", cMsg?.lastMessage?.senderId, "user-hs-dash1");
checkTrue("Conversations: lastMessage.createdAt có mặt", !!cMsg?.lastMessage?.createdAt, JSON.stringify(cMsg?.lastMessage));
check("Conversations: partner.username", cMsg?.partner?.username, "hsdash1");
check("Conversations: cuộc chưa có tin → lastMessage = null", cEmpty?.lastMessage, null);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
