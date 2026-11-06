// Test tích hợp: ĐỢT BỔ SUNG GIÁO VIÊN (G1 + G2 + G3).
//   G1 — listSubmissions gắn thông tin học sinh tối thiểu (tên thay vì mã ID).
//   G2 — getAssignmentStats trả thêm tiến độ lớp: Đã nộp X/Y + danh sách chưa nộp.
//   G3 — gỡ học sinh khỏi lớp: service removeStudentFromClass + route
//        DELETE /classes/:id/students/:studentId (chỉ GV của lớp hoặc admin).
// Chạy service + router THẬT của repo trên Mongo in-memory (mẫu test-chat-reactions):
//   node server/scripts/test-teacher-pack.mjs
// Cần mongodb-memory-server (cài --no-save ở máy dev, không phải dep runtime).
import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-mongo-data-teacherpack");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "teacher_pack_test";

const db = await import("../src/db.js");
await db.connect();
const { getCollection } = db;
const classService = await import("../src/services/classService.js");
const assignmentService = await import("../src/services/assignmentService.js");
const { signToken } = await import("../src/services/authService.js");

// ── Seed ──
const T1 = { id: "user-teacher1", username: "giaovien1", name: "Cô Giáo Một", role: "teacher" };
const T2 = { id: "user-teacher2", username: "giaovien2", name: "Thầy Giáo Hai", role: "teacher" };
const ADM = { id: "user-admin", username: "admin", name: "Quản Trị", role: "admin" };
const S1 = { id: "user-hs1", username: "hs_mot", name: "Nguyễn Văn An", role: "student", avatarLoadout: { body: "body_boy_01" } };
const S2 = { id: "user-hs2", username: "hs_hai", name: "Trần Thị Bình", role: "student" };
const S3 = { id: "user-hs3", username: "hs_ba", name: "Lê Văn Cường", role: "student" };
const S4 = { id: "user-hs4", username: "hs_bon", name: "Phạm Thị Dung", role: "student" };
await getCollection("users").insertMany([T1, T2, ADM, S1, S2, S3, S4].map((u) => ({ ...u })));

const C1 = await classService.createClass({ name: "Lớp 3A", code: "LOP3A-TEST" });
const C2 = await classService.createClass({ name: "Lớp 4B", code: "LOP4B-TEST" });
await classService.assignTeacher(T1.id, C1.id);
await classService.assignTeacher(T2.id, C2.id);
await classService.setStudentClass(S1.id, C1.id);
await classService.setStudentClass(S2.id, C1.id);
await classService.setStudentClass(S3.id, C1.id);
await classService.setStudentClass(S4.id, C2.id);

await getCollection("questions").insertOne({
  id: "q-test-1", content: "1 + 1 = ?", options: [{ id: "a", content: "2" }, { id: "b", content: "3" }],
  correctAnswer: "a", questionType: "multiple_choice",
});
const asgn = await assignmentService.createAssignment({
  teacherId: T1.id, title: "Bài kiểm tra thử", classId: C1.id, questionIds: ["q-test-1"], maxAttempts: 1,
});

// S1 nộp bài thật; S2 chỉ mới bắt đầu (IN_PROGRESS); thêm một bài nộp khách.
const started1 = await assignmentService.startSubmission({ assignmentId: asgn.id, studentId: S1.id });
await assignmentService.submitAnswers({ submissionId: started1.id, studentId: S1.id, answers: [{ questionId: "q-test-1", value: "a" }] });
await assignmentService.startSubmission({ assignmentId: asgn.id, studentId: S2.id });
await getCollection("submissions").insertOne({
  _id: "sub-guest", id: "sub-guest", assignmentId: asgn.id, studentId: `guest_Khach_${asgn.id}`,
  status: "SUBMITTED", score: 50, submittedAt: new Date().toISOString(), answers: [], attemptNumber: 1,
});

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};
const checkThrows = async (name, fn, msgPart) => {
  try {
    await fn();
    console.log(`FAIL  ${name}  → không ném lỗi`);
    failed++;
  } catch (e) {
    const ok = !msgPart || String(e.message).includes(msgPart);
    console.log(`${ok ? "PASS" : "FAIL"}  ${name}  → lỗi: ${e.message}`);
    if (!ok) failed++;
  }
};

// ── G1 (service): listSubmissions có tên học sinh ──
const subs = await assignmentService.listSubmissions({ assignmentId: asgn.id });
const subS1 = subs.find((s) => s.studentId === S1.id);
check("G1: bài nộp của S1 có student.name", subS1?.student?.name, S1.name);
check("G1: student.username", subS1?.student?.username, S1.username);
check("G1: student.avatarLoadout", subS1?.student?.avatarLoadout, S1.avatarLoadout);
check("G1: student KHÔNG lộ field thừa (email/passwordHash)", [subS1?.student?.email, subS1?.student?.passwordHash], [undefined, undefined]);
const subGuest = subs.find((s) => s.id === "sub-guest");
check("G1: bài nộp khách → student = null (client rơi về ID)", subGuest?.student, null);

// ── G2 (service): stats có tiến độ lớp + danh sách chưa nộp ──
let stats = await assignmentService.getAssignmentStats(asgn.id);
check("G2: classTotal = sĩ số lớp", stats.classTotal, 3);
check("G2: submittedStudents = số HS đã nộp", stats.submittedStudents, 1);
check("G2: notSubmitted = S2 (đang làm dở) + S3 (chưa bắt đầu)",
  (stats.notSubmitted || []).map((u) => u.id).sort(), [S2.id, S3.id].sort());
check("G2: notSubmitted có tên + username",
  (stats.notSubmitted || []).every((u) => u.name && u.username), true);
check("G2: giữ nguyên thống kê điểm cũ (total đếm cả bài khách)", stats.total, 2);

// ── HTTP: mount router thật, kiểm tra G1/G2 qua endpoint + phân quyền G3 ──
const express = (await import("express")).default;
const classesRouter = (await import("../src/routes/classes.js")).default;
const assignmentsRouter = (await import("../src/routes/assignments.js")).default;
const app = express();
app.use(express.json());
app.use("/api/classes", classesRouter);
app.use("/api/assignments", assignmentsRouter);
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const tok = (u) => signToken(u);
async function call(method, p, token) {
  const res = await fetch(base + p, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  let body = null;
  try { body = await res.json(); } catch { /* không có body JSON */ }
  return { status: res.status, body };
}

const httpSubs = await call("GET", `/api/assignments/${asgn.id}/submissions`, tok(T1));
check("HTTP G1: GET submissions 200", httpSubs.status, 200);
check("HTTP G1: submissions qua API có tên học sinh",
  httpSubs.body?.data?.find((s) => s.studentId === S1.id)?.student?.name, S1.name);
const httpStats = await call("GET", `/api/assignments/${asgn.id}/stats`, tok(T1));
check("HTTP G2: GET stats có notSubmitted", (httpStats.body?.data?.notSubmitted || []).length, 2);

// G3 — phân quyền: GV lớp khác và học sinh đều bị từ chối
const denyT2 = await call("DELETE", `/api/classes/${C1.id}/students/${S3.id}`, tok(T2));
check("HTTP G3: GV lớp khác gỡ → 403", denyT2.status, 403);
const denyStudent = await call("DELETE", `/api/classes/${C1.id}/students/${S3.id}`, tok(S1));
check("HTTP G3: học sinh gỡ → 403", denyStudent.status, 403);
check("HTTP G3: sau 2 lần bị từ chối, S3 vẫn còn trong lớp",
  (await classService.getClassStudents(C1.id)).map((u) => u.id).includes(S3.id), true);

// ── G3 (service): gỡ S3 khỏi C1 ──
await classService.removeStudentFromClass(S3.id, C1.id);
check("G3: roster C1 sau khi gỡ S3", (await classService.getClassStudents(C1.id)).map((u) => u.id).sort(), [S1.id, S2.id].sort());
const s3After = await getCollection("users").findOne({ id: S3.id });
check("G3: tài khoản S3 còn nguyên, classId = null", [!!s3After, s3After?.classId], [true, null]);
check("G3: bài đã nộp của S1 KHÔNG bị xoá", (await assignmentService.listSubmissions({ assignmentId: asgn.id })).length >= 2, true);
stats = await assignmentService.getAssignmentStats(asgn.id);
check("G3+G2: sau gỡ, S3 biến khỏi danh sách chưa nộp", (stats.notSubmitted || []).map((u) => u.id), [S2.id]);
check("G3+G2: classTotal giảm còn 2", stats.classTotal, 2);

// ── G3 (service): các ca lỗi ──
await checkThrows("G3: gỡ học sinh không thuộc lớp → lỗi", () => classService.removeStudentFromClass(S4.id, C1.id), "không thuộc lớp");
await checkThrows("G3: gỡ user không tồn tại → lỗi", () => classService.removeStudentFromClass("user-khong-co", C1.id), "Không tìm thấy học sinh");
await checkThrows("G3: gỡ S3 lần hai (đã rời lớp) → lỗi", () => classService.removeStudentFromClass(S3.id, C1.id), "không thuộc lớp");

// ── G3 (HTTP): GV chủ nhiệm gỡ được, admin gỡ được ──
const okT1 = await call("DELETE", `/api/classes/${C1.id}/students/${S2.id}`, tok(T1));
check("HTTP G3: GV của lớp gỡ S2 → 200", okT1.status, 200);
check("HTTP G3: roster còn S1", (await classService.getClassStudents(C1.id)).map((u) => u.id), [S1.id]);
const again = await call("DELETE", `/api/classes/${C1.id}/students/${S2.id}`, tok(T1));
check("HTTP G3: gỡ lại S2 → 400", again.status, 400);
const okAdmin = await call("DELETE", `/api/classes/${C1.id}/students/${S1.id}`, tok(ADM));
check("HTTP G3: admin gỡ S1 → 200", okAdmin.status, 200);
check("HTTP G3: lớp rỗng sau khi admin gỡ nốt", (await classService.getClassStudents(C1.id)).length, 0);
const noClass = await call("DELETE", `/api/classes/cls-khong-co/students/${S1.id}`, tok(ADM));
check("HTTP G3: lớp không tồn tại → 404", noClass.status, 404);

server.close();
await db.disconnect?.().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
