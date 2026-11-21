// Test tích hợp: GÓI CAN THIỆP 1 CHẠM (Đợt 2) — /api/remediation
//   · GET /preview: đếm câu CƠ BẢN (difficulty "easy") cùng chủ đề theo
//     ĐÚNG luật khoá chủ đề của bản đồ nhiệt (category === chủ đề, hoặc
//     không có category thì nhãn môn của subject === chủ đề); gói lấy tối
//     đa 10 câu.
//   · POST /packs: tạo bài ĐÍCH DANH (targetStudentIds) qua createAssignment
//     dùng chung + thông báo cho từng học sinh + 2 nhắc lặp lại cách quãng
//     (+3/+7 ngày, 09:00) qua reminderService. Chủ đề không có câu cơ bản
//     → 400, KHÔNG tạo bài rỗng. Học sinh ngoài roster bị loại + báo lại.
//   · Bài đích danh: chỉ học sinh được giao mới thấy trong GET
//     /api/assignments và mới startSubmission được; bài cả lớp cũ không đổi.
//   · Phạm vi: giáo viên chỉ thao tác lớp mình phụ trách; học sinh 403.
// Chạy app Express THẬT trên Mongo in-memory (mẫu test-heatmap.mjs):
//   node server/scripts/test-remediation.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `remediation_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-remediation-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "remediation_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const T1 = "user-rm-teacher1";
const T2 = "user-rm-teacher2";
const S1 = "user-rm-s1";
const S2 = "user-rm-s2";
const S3 = "user-rm-s3";
const tokT1 = signToken({ id: T1, username: "rmteacher1", role: "teacher", name: "GV Một" });
const tokT2 = signToken({ id: T2, username: "rmteacher2", role: "teacher", name: "GV Hai" });
const tokS1 = signToken({ id: S1, username: "rms1", role: "student", name: "HS Một" });
const tokS3 = signToken({ id: S3, username: "rms3", role: "student", name: "HS Ba" });

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

const req = async (p, token, { method = "GET", body } = {}) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const parsed = await res.json().catch(() => null);
  return { status: res.status, body: parsed };
};

// ── Seed ────────────────────────────────────────────────────────────────
await getCollection("users").insertMany([
  { id: T1, username: "rmteacher1", name: "GV Một", role: "teacher", passwordHash: "x" },
  { id: T2, username: "rmteacher2", name: "GV Hai", role: "teacher", passwordHash: "x" },
  { id: S1, username: "rms1", name: "HS Một", role: "student", passwordHash: "x", classId: "cls-rm-1" },
  { id: S2, username: "rms2", name: "HS Hai", role: "student", passwordHash: "x", classId: "cls-rm-1" },
  { id: S3, username: "rms3", name: "HS Ba", role: "student", passwordHash: "x", classId: "cls-rm-1" },
  { id: "user-rm-s4", username: "rms4", name: "HS Bốn", role: "student", passwordHash: "x", classId: "cls-rm-2" },
]);
await getCollection("classes").insertMany([
  { id: "cls-rm-1", name: "Lớp 3A", code: "RM1", status: "ACTIVE" },
  { id: "cls-rm-2", name: "Lớp 3B", code: "RM2", status: "ACTIVE" },
]);
await getCollection("teacher_classes").insertOne({ id: "tc-rm-1", teacherId: T1, classId: "cls-rm-1" });

const opts = [{ id: "a", content: "Đáp án A" }, { id: "b", content: "Đáp án B" }];
const qb = (id, extra) => ({ id, content: `Câu ${id}`, options: opts, correctAnswer: "a", ...extra });
await getCollection("question_banks").insertMany([
  // Chủ đề "Phép chia có dư": 3 câu easy + 1 medium + 1 hard (chỉ easy được trích)
  qb("qb-rm-e1", { subject: "math", category: "Phép chia có dư", difficulty: "easy" }),
  qb("qb-rm-e2", { subject: "math", category: "Phép chia có dư", difficulty: "easy" }),
  qb("qb-rm-e3", { subject: "math", category: "Phép chia có dư", difficulty: "easy" }),
  qb("qb-rm-m1", { subject: "math", category: "Phép chia có dư", difficulty: "medium" }),
  qb("qb-rm-h1", { subject: "math", category: "Phép chia có dư", difficulty: "hard" }),
  // Không category → thuộc chủ đề theo nhãn môn: subject "eng" → "Tiếng Anh"
  qb("qb-rm-eng1", { subject: "eng", difficulty: "easy" }),
  // Chủ đề "Phép nhân": chỉ có câu medium → preview 0 câu, tạo gói bị từ chối
  qb("qb-rm-nhan-m1", { subject: "math", category: "Phép nhân", difficulty: "medium" }),
  // Chủ đề "Phép cộng": 12 câu easy → gói chỉ lấy tối đa 10
  ...Array.from({ length: 12 }, (_, i) => qb(`qb-rm-cong-${i + 1}`, { subject: "math", category: "Phép cộng", difficulty: "easy" })),
]);
// Bài cả lớp có sẵn (không targetStudentIds) — hành vi cũ phải giữ nguyên.
await getCollection("assignments").insertOne({
  id: "asg-rm-normal", teacherId: T1, title: "Bài cả lớp", classId: "cls-rm-1",
  code: "RMNORM", status: "ACTIVE", questionIds: ["qb-rm-e1"], maxAttempts: 1,
});

// ── Preview: đếm câu cơ bản cùng chủ đề ─────────────────────────────────
const pv = await req("/api/remediation/preview?classId=cls-rm-1&topic=" + encodeURIComponent("Phép chia có dư"), tokT1);
check("Preview GV phụ trách → 200", pv.status, 200);
check("Preview Chia có dư: totalFound 3 (chỉ easy)", pv.body?.data?.totalFound, 3);
check("Preview Chia có dư: willUse 3", pv.body?.data?.willUse, 3);
check("Preview Chia có dư: đúng 3 câu easy", (pv.body?.data?.questions || []).map((q) => q.id).sort(), ["qb-rm-e1", "qb-rm-e2", "qb-rm-e3"]);

const pvEng = await req("/api/remediation/preview?classId=cls-rm-1&topic=" + encodeURIComponent("Tiếng Anh"), tokT1);
check("Preview theo nhãn môn (không category): totalFound 1", pvEng.body?.data?.totalFound, 1);
check("Preview theo nhãn môn: đúng câu eng", pvEng.body?.data?.questions?.[0]?.id, "qb-rm-eng1");

const pvCong = await req("/api/remediation/preview?classId=cls-rm-1&topic=" + encodeURIComponent("Phép cộng"), tokT1);
check("Preview Phép cộng: totalFound 12", pvCong.body?.data?.totalFound, 12);
check("Preview Phép cộng: willUse capped 10", pvCong.body?.data?.willUse, 10);

const pvNhan = await req("/api/remediation/preview?classId=cls-rm-1&topic=" + encodeURIComponent("Phép nhân"), tokT1);
check("Preview Phép nhân (chỉ có medium): totalFound 0", pvNhan.body?.data?.totalFound, 0);

// ── Preview: phạm vi truy cập ───────────────────────────────────────────
const pvT2 = await req("/api/remediation/preview?classId=cls-rm-1&topic=" + encodeURIComponent("Phép chia có dư"), tokT2);
check("Preview GV không phụ trách → 403", pvT2.status, 403);
const pvStudent = await req("/api/remediation/preview?classId=cls-rm-1&topic=" + encodeURIComponent("Phép chia có dư"), tokS1);
check("Preview học sinh → 403", pvStudent.status, 403);
const pv404 = await req("/api/remediation/preview?classId=cls-khong-co&topic=x", tokT1);
check("Preview lớp không tồn tại → 404", pv404.status, 404);

// ── Tạo gói: chủ đề không có câu cơ bản → 400, không tạo gì ─────────────
const beforeCount = await getCollection("assignments").countDocuments({});
const pkEmpty = await req("/api/remediation/packs", tokT1, {
  method: "POST",
  body: { classId: "cls-rm-1", topic: "Phép nhân", studentIds: [S1] },
});
check("Tạo gói chủ đề 0 câu easy → 400", pkEmpty.status, 400);
check("Tạo gói 0 câu: KHÔNG tạo thêm bài nào", await getCollection("assignments").countDocuments({}), beforeCount);

// ── Tạo gói: giáo viên ngoài phạm vi → 403 ──────────────────────────────
const pkT2 = await req("/api/remediation/packs", tokT2, {
  method: "POST",
  body: { classId: "cls-rm-1", topic: "Phép chia có dư", studentIds: [S1] },
});
check("Tạo gói GV không phụ trách → 403", pkT2.status, 403);
const pkStudent = await req("/api/remediation/packs", tokS1, {
  method: "POST",
  body: { classId: "cls-rm-1", topic: "Phép chia có dư", studentIds: [S1] },
});
check("Tạo gói học sinh → 403", pkStudent.status, 403);

// ── Tạo gói: happy path (kèm 1 id học sinh lạ) ──────────────────────────
const pk = await req("/api/remediation/packs", tokT1, {
  method: "POST",
  body: { classId: "cls-rm-1", topic: "Phép chia có dư", studentIds: [S1, S2, "user-rm-la"] },
});
check("Tạo gói → 201", pk.status, 201);
const pack = pk.body?.data || {};
check("Gói: questionCount 3", pack.questionCount, 3);
check("Gói: studentCount 2", pack.studentCount, 2);
check("Gói: skippedStudentIds báo id lạ", pack.skippedStudentIds, ["user-rm-la"]);
check("Gói: remindersPerStudent 2", pack.remindersPerStudent, 2);
check("Gói: notificationsSent 2", pack.notificationsSent, 2);
check("Gói: remindersCreated 4 (2 HS × 2 mốc)", pack.remindersCreated, 4);
check("Gói: warnings rỗng", pack.warnings, []);

const expectedDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.getTime();
};
check("Gói: remindDates[0] = +3 ngày 09:00", new Date(pack.remindDates?.[0]).getTime(), expectedDate(3));
check("Gói: remindDates[1] = +7 ngày 09:00", new Date(pack.remindDates?.[1]).getTime(), expectedDate(7));

// Bài tập đã tạo trong DB
const asgDoc = await getCollection("assignments").findOne({ id: pack.assignmentId });
checkTrue("Bài gói tồn tại trong DB", !!asgDoc, JSON.stringify(pack));
check("Bài gói: title", asgDoc?.title, "Ôn tập bổ trợ: Phép chia có dư");
check("Bài gói: source remediation", asgDoc?.source, "remediation");
check("Bài gói: topicKey", asgDoc?.topicKey, "Phép chia có dư");
check("Bài gói: targetStudentIds đúng nhóm", [...(asgDoc?.targetStudentIds || [])].sort(), [S1, S2].sort());
check("Bài gói: questionIds đúng 3 câu easy", [...(asgDoc?.questionIds || [])].sort(), ["qb-rm-e1", "qb-rm-e2", "qb-rm-e3"]);
check("Bài gói: maxAttempts 0 (làm lại tự do)", asgDoc?.maxAttempts, 0);
check("Bài gói: code khớp response", asgDoc?.code, pack.code);

// Thông báo cho từng học sinh
const notifs = await getCollection("notifications").find({ toUserId: { $in: [S1, S2] }, type: "ASSIGNMENT" }).toArray();
check("Thông báo: 2 thông báo tới 2 học sinh", notifs.length, 2);
checkTrue("Thông báo: data.assignmentId trỏ đúng bài gói",
  notifs.every((n) => n.data?.assignmentId === pack.assignmentId), JSON.stringify(notifs.map((n) => n.data)));

// Nhắc lặp lại cách quãng trong DB
const rems = await getCollection("reminders").find({ type: "REMEDIATION", relatedId: pack.assignmentId }).toArray();
check("Nhắc: 4 bản ghi (2 HS × 2 mốc)", rems.length, 4);
check("Nhắc: đúng 2 học sinh đích", [...new Set(rems.map((r) => r.userId))].sort(), [S1, S2].sort());
check("Nhắc: đúng 2 mốc +3/+7 ngày 09:00",
  [...new Set(rems.map((r) => new Date(r.remindAt).getTime()))].sort((a, b) => a - b),
  [expectedDate(3), expectedDate(7)].sort((a, b) => a - b));

// ── Bài đích danh: hiển thị phía học sinh ────────────────────────────────
const listS1 = await req("/api/assignments", tokS1);
const idsS1 = (listS1.body?.data || []).map((a) => a.id);
checkTrue("HS được giao: thấy bài gói trong danh sách", idsS1.includes(pack.assignmentId), JSON.stringify(idsS1));
checkTrue("HS được giao: vẫn thấy bài cả lớp", idsS1.includes("asg-rm-normal"), JSON.stringify(idsS1));

const listS3 = await req("/api/assignments", tokS3);
const idsS3 = (listS3.body?.data || []).map((a) => a.id);
checkTrue("HS ngoài gói: KHÔNG thấy bài gói", !idsS3.includes(pack.assignmentId), JSON.stringify(idsS3));
checkTrue("HS ngoài gói: vẫn thấy bài cả lớp", idsS3.includes("asg-rm-normal"), JSON.stringify(idsS3));

// ── Bài đích danh: bắt đầu làm bài ──────────────────────────────────────
const startS3 = await req(`/api/assignments/${pack.assignmentId}/start`, tokS3, { method: "POST", body: {} });
check("HS ngoài gói start bài gói → bị từ chối 400", startS3.status, 400);
const startS1 = await req(`/api/assignments/${pack.assignmentId}/start`, tokS1, { method: "POST", body: {} });
check("HS được giao start bài gói → 200", startS1.status, 200);
check("Start: submission thuộc đúng học sinh", startS1.body?.data?.studentId, S1);

const startNormalS3 = await req("/api/assignments/asg-rm-normal/start", tokS3, { method: "POST", body: {} });
check("Bài cả lớp cũ: HS bất kỳ trong lớp vẫn start được → 200", startNormalS3.status, 200);

// ── Hồi quy nhẹ: heatmap vẫn chạy ───────────────────────────────────────
const hm = await req("/api/heatmap/class/cls-rm-1", tokT1);
check("Hồi quy: GET heatmap lớp → 200", hm.status, 200);

server.close();
if (mongod) await mongod.stop().catch(() => {});
console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
