// Test tích hợp: Bộ đề (combo) đóng gói từ ngân hàng câu hỏi —
// /api/question-banks/sets. Chạy app Express THẬT trên Mongo in-memory
// (mẫu như test-checkin.mjs):
//   node server/scripts/test-question-sets.mjs
// Bao phủ: CRUD bộ đề (tạo/list kèm questionCount đúng/chi tiết đúng thứ tự
// questionIds/lọc môn–lớp/xóa); học sinh bị chặn POST/PUT/DELETE (403);
// DTO học sinh không lộ correctAnswer ở cả list lẫn chi tiết; questionIds
// chứa id ma → khi lưu bị loại, câu bị xóa khỏi bank sau đó → count chỉ
// đếm câu còn tồn tại; endpoint chấm /check chấm đúng/sai ở server và chỉ
// trả đáp án sau khi trả lời.
import { createServer } from "node:http";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `qsets_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-qsets-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "qsets_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};

const req = async (method, p, token, body) => {
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

async function seedUser(id, role) {
  await getCollection("users").insertOne({
    id, username: id, name: `User ${id}`, role, passwordHash: "x",
    coins: 0, createdAt: new Date().toISOString(),
  });
  return signToken({ id, username: id, role, name: `User ${id}` });
}

const OPTS = [
  { id: "a", content: "Đáp án A" },
  { id: "b", content: "Đáp án B" },
  { id: "c", content: "Đáp án C" },
];
const bankQ = (id, subject, grade, correctAnswer = "a") => ({
  id, content: `Câu ${id}`, options: OPTS, correctAnswer,
  subject, grade, explanation: `Giải thích ${id}`,
});
await getCollection("question_banks").insertMany([
  bankQ("qbank-tv1", "viet", 3, "a"),
  bankQ("qbank-tv2", "viet", 3, "b"),
  bankQ("qbank-tv3", "viet", 3, "c"),
  bankQ("qbank-toan1", "toan", 3, "a"),
  bankQ("qbank-toan2", "toan", 3, "b"),
]);

const teacherTok = await seedUser("user-teacher-qsets", "teacher");
const adminTok = await seedUser("user-admin-qsets", "admin");
const studentTok = await seedUser("user-student-qsets", "student");

// ── Chưa đăng nhập → 401 ────────────────────────────────────────────────
const anon = await req("GET", "/api/question-banks/sets");
check("GET /sets chưa đăng nhập: 401", anon.status, 401);

// ── Tạo bộ: id ma bị loại khi lưu + khử trùng ───────────────────────────
const created = await req("POST", "/api/question-banks/sets", teacherTok, {
  name: "Tiếng Việt lớp 3", subject: "viet", grade: 3, description: "Bộ ôn tập",
  questionIds: ["qbank-tv2", "qbank-tv1", "qbank-ma-khong-co", "qbank-tv2", "qbank-tv3"],
});
check("POST tạo bộ: 200", created.status, 200);
const setId = created.body?.data?.id;
check("tạo bộ: questionIds đã khử trùng + bỏ id ma, giữ thứ tự", created.body?.data?.questionIds, ["qbank-tv2", "qbank-tv1", "qbank-tv3"]);
check("tạo bộ: questionCount=3", created.body?.data?.questionCount, 3);
check("tạo bộ: chi tiết questions đúng thứ tự questionIds",
  (created.body?.data?.questions || []).map((q) => q.id), ["qbank-tv2", "qbank-tv1", "qbank-tv3"]);
check("tạo bộ: ownerId = giáo viên tạo", created.body?.data?.ownerId, "user-teacher-qsets");

// Thiếu tên → lỗi
const noName = await req("POST", "/api/question-banks/sets", teacherTok, { questionIds: [] });
check("POST thiếu tên: bị từ chối (status>=400)", noName.status >= 400, true);

// ── List + lọc ───────────────────────────────────────────────────────────
const created2 = await req("POST", "/api/question-banks/sets", teacherTok, {
  name: "Toán lớp 3", subject: "toan", grade: 3, questionIds: ["qbank-toan1", "qbank-toan2"],
});
const set2Id = created2.body?.data?.id;

const listAll = await req("GET", "/api/question-banks/sets", studentTok);
check("GET /sets học sinh: 200", listAll.status, 200);
check("GET /sets: 2 bộ", listAll.body?.data?.length, 2);
const listSet1 = (listAll.body?.data || []).find((s) => s.id === setId);
check("GET /sets: bộ 1 questionCount=3", listSet1?.questionCount, 3);
check("GET /sets: list không kèm questions", "questions" in (listSet1 || {}), false);
check("GET /sets: list không lộ correctAnswer", JSON.stringify(listAll.body).includes("correctAnswer"), false);

const listViet = await req("GET", "/api/question-banks/sets?subject=viet", studentTok);
check("GET /sets?subject=viet: 1 bộ", listViet.body?.data?.length, 1);
check("GET /sets?subject=viet: đúng bộ Tiếng Việt", listViet.body?.data?.[0]?.id, setId);
const listGrade5 = await req("GET", "/api/question-banks/sets?grade=5", studentTok);
check("GET /sets?grade=5: 0 bộ", listGrade5.body?.data?.length, 0);

// ── Chi tiết: DTO học sinh strip đáp án, giáo viên thấy đủ ──────────────
const detailStudent = await req("GET", `/api/question-banks/sets/${setId}`, studentTok);
check("GET chi tiết (học sinh): 200", detailStudent.status, 200);
check("GET chi tiết (học sinh): 3 câu đúng thứ tự",
  (detailStudent.body?.data?.questions || []).map((q) => q.id), ["qbank-tv2", "qbank-tv1", "qbank-tv3"]);
check("GET chi tiết (học sinh): không câu nào có correctAnswer",
  (detailStudent.body?.data?.questions || []).every((q) => !("correctAnswer" in q)), true);
check("GET chi tiết (học sinh): vẫn có explanation để học sau khi trả lời? (không — chỉ qua /check)",
  (detailStudent.body?.data?.questions || [])[0]?.explanation, "Giải thích qbank-tv2");

const detailTeacher = await req("GET", `/api/question-banks/sets/${setId}`, teacherTok);
check("GET chi tiết (giáo viên): có correctAnswer",
  (detailTeacher.body?.data?.questions || []).every((q) => "correctAnswer" in q), true);

const detail404 = await req("GET", "/api/question-banks/sets/qset-khong-co", studentTok);
check("GET chi tiết bộ không tồn tại: 404", detail404.status, 404);

// ── Học sinh bị chặn ghi ─────────────────────────────────────────────────
const studentPost = await req("POST", "/api/question-banks/sets", studentTok, { name: "Bộ lậu", questionIds: [] });
check("POST /sets bằng học sinh: 403", studentPost.status, 403);
const studentPut = await req("PUT", `/api/question-banks/sets/${setId}`, studentTok, { name: "Đổi lậu" });
check("PUT /sets/:id bằng học sinh: 403", studentPut.status, 403);
const studentDel = await req("DELETE", `/api/question-banks/sets/${setId}`, studentTok);
check("DELETE /sets/:id bằng học sinh: 403", studentDel.status, 403);

// ── Chấm 1 câu qua /check ────────────────────────────────────────────────
const chkRight = await req("POST", `/api/question-banks/sets/${setId}/check`, studentTok, { questionId: "qbank-tv1", answer: "a" });
check("check đúng: 200", chkRight.status, 200);
check("check đúng: isCorrect=true", chkRight.body?.data?.isCorrect, true);
check("check đúng: trả correctAnswer sau khi trả lời", chkRight.body?.data?.correctAnswer, "a");
check("check đúng: kèm explanation", chkRight.body?.data?.explanation, "Giải thích qbank-tv1");
const chkWrong = await req("POST", `/api/question-banks/sets/${setId}/check`, studentTok, { questionId: "qbank-tv1", answer: "b" });
check("check sai: isCorrect=false", chkWrong.body?.data?.isCorrect, false);
const chkForeign = await req("POST", `/api/question-banks/sets/${setId}/check`, studentTok, { questionId: "qbank-toan1", answer: "a" });
check("check câu không thuộc bộ: 404", chkForeign.status, 404);

// ── Cập nhật bộ ──────────────────────────────────────────────────────────
const updated = await req("PUT", `/api/question-banks/sets/${set2Id}`, teacherTok, {
  name: "Toán lớp 3 — nâng cao", questionIds: ["qbank-toan2"],
});
check("PUT cập nhật: 200", updated.status, 200);
check("PUT cập nhật: tên mới", updated.body?.data?.name, "Toán lớp 3 — nâng cao");
check("PUT cập nhật: questionCount=1", updated.body?.data?.questionCount, 1);
check("PUT cập nhật: giữ subject cũ", updated.body?.data?.subject, "toan");

// ── Câu bị xóa khỏi bank → count chỉ đếm câu còn tồn tại ────────────────
await getCollection("question_banks").deleteOne({ id: "qbank-tv3" });
const listAfter = await req("GET", "/api/question-banks/sets", teacherTok);
const afterSet1 = (listAfter.body?.data || []).find((s) => s.id === setId);
check("sau khi xóa 1 câu khỏi bank: questionCount bộ 1 = 2", afterSet1?.questionCount, 2);
const detailAfter = await req("GET", `/api/question-banks/sets/${setId}`, teacherTok);
check("sau khi xóa câu: chi tiết còn 2 câu", detailAfter.body?.data?.questions?.length, 2);

// ── Xóa bộ: chỉ xóa bộ, câu hỏi bank còn nguyên ─────────────────────────
// Lưu ý tầng permission: role teacher mặc định KHÔNG có question_bank.delete
// (giống hệt xóa câu hỏi bank hiện nay) → giáo viên nhận 403, admin xóa được.
const teacherDel = await req("DELETE", `/api/question-banks/sets/${set2Id}`, teacherTok);
check("DELETE bộ bằng giáo viên (thiếu quyền .delete ở tầng permission): 403", teacherDel.status, 403);
const del = await req("DELETE", `/api/question-banks/sets/${set2Id}`, adminTok);
check("DELETE bộ bằng admin: 200", del.status, 200);
const delAgain = await req("DELETE", `/api/question-banks/sets/${set2Id}`, adminTok);
check("DELETE bộ lần 2: 404", delAgain.status, 404);
check("xóa bộ không xóa câu bank", await getCollection("question_banks").countDocuments(), 4);
const listFinal = await req("GET", "/api/question-banks/sets", adminTok);
check("sau xóa bộ: còn 1 bộ", listFinal.body?.data?.length, 1);

await db.close?.().catch(() => {});
server.close();
if (mongod) {
  await mongod.stop();
  rmSync(path.join(here, `.test-qsets-mongo-data-${process.pid}`), { recursive: true, force: true });
}
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
