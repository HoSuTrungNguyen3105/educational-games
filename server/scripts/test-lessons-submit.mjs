// Test tích hợp: AI STUDIO ĐỢT 3 — chấm bài phía server + tiến độ học
// sinh (API /api/lessons/published/:id/check|progress|complete, collection
// lessonProgress). Chạy app Express THẬT trên Mongo in-memory (mẫu như
// test-lessons.mjs):
//   node server/scripts/test-lessons-submit.mjs
// Bao phủ: chấm single/fill bằng gradeAnswer phía server (fill không phân
// biệt hoa/thường + trim), sai KHÔNG trả explanation, đúng có explanation
// + điểm; draft → 404; elementId sai/không-phải-question → 400; tiến độ
// tích luỹ (attempts tăng, correctElementIds không trùng, completedAt
// chỉ khi MỌI câu đúng); tiến độ của học sinh khác không lộ; bài không
// có câu hỏi hoàn thành qua /complete.
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-lessons-submit-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "lessons_submit_test";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { ObjectId } = await import("mongodb");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacher = signToken({ id: "user-gv", username: "gvtest", role: "teacher", name: "Giáo Viên Test" });
const studentA = signToken({ id: "user-hs-a", username: "hsa", role: "student", name: "Học Sinh A" });
const studentB = signToken({ id: "user-hs-b", username: "hsb", role: "student", name: "Học Sinh B" });

// Game online thật để bài học tham chiếu được (publish validate).
const gameObjectId = new ObjectId();
const gameId = gameObjectId.toString();
const nowIso = new Date().toISOString();
await db.getCollection("games").insertOne({
  _id: gameObjectId, name: "Game Test Studio", description: "", subject: "Toán",
  type: "play-to-learn", status: "published", playMode: "solo",
  questionsCount: 0, playersCount: 0, code: "TESTSTUDIO3",
  createdAt: nowIso, updatedAt: nowIso,
});

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
const getJson = (p, token) => req("GET", p, token);
const postJson = (p, token, payload) => req("POST", p, token, payload ?? {});

const el = (over = {}) => ({ id: "el-1", type: "text", x: 40, y: 40, w: 600, h: 120, props: { text: "Xin chào" }, ...over });

// ── 1. Seed: bài có 1 câu single + 1 câu fill + 1 game (published),
//        một bài DRAFT, và một bài published KHÔNG có câu hỏi. ──────────
const lesson = await postJson("/api/lessons", teacher, {
  title: "Bảng nhân 4 — chấm bài", subject: "Toán", grade: 3,
  pages: [{
    id: "page-1", title: "Luyện tập",
    elements: [
      el({ id: "el-t", type: "title", props: { text: "Luyện tập", fontSize: 40 } }),
      el({
        id: "el-q-single", type: "question", x: 40, y: 160, w: 700, h: 260,
        props: {
          prompt: "3 × 4 = ?", qtype: "single",
          options: [{ id: "a", content: "10" }, { id: "b", content: "12" }],
          correctAnswer: "b", explanation: "3 × 4 = 12", points: 15,
          feedbackCorrect: "Giỏi lắm!", feedbackWrong: "Chưa đúng đâu",
        },
      }),
      el({
        id: "el-q-fill", type: "question", x: 40, y: 440, w: 700, h: 200,
        props: {
          prompt: "Con vật nào kêu 'meo meo'?", qtype: "fill",
          correctAnswer: "Con Mèo", explanation: "Đó là con mèo", points: 5,
          feedbackCorrect: "Đúng rồi!", feedbackWrong: "Thử lại nhé",
        },
      }),
      el({ id: "el-g", type: "game", x: 800, y: 40, w: 400, h: 300, props: { gameId } }),
    ],
  }],
});
check("Tạo bài chấm: status", lesson.status, 201);
const lessonId = lesson.body.data.id;
check("Publish bài chấm: status", (await postJson(`/api/lessons/${lessonId}/publish`, teacher)).status, 200);

const draft = await postJson("/api/lessons", teacher, {
  title: "Bài nháp", pages: [{ id: "p1", title: "P1", elements: [
    el({ id: "el-qd", type: "question", props: { prompt: "?", qtype: "fill", correctAnswer: "x" } }),
  ] }],
});
const draftId = draft.body.data.id;

const noQuestion = await postJson("/api/lessons", teacher, {
  title: "Bài đọc không câu hỏi",
  pages: [
    { id: "p1", title: "Trang 1", elements: [el({ id: "el-r1", props: { text: "Đọc đoạn này" } })] },
    { id: "p2", title: "Trang 2", elements: [el({ id: "el-r2", props: { text: "Hết bài" } })] },
  ],
});
const noQuestionId = noQuestion.body.data.id;
check("Publish bài không câu hỏi: status", (await postJson(`/api/lessons/${noQuestionId}/publish`, teacher)).status, 200);

// ── 2. DTO học sinh: không correctAnswer, không explanation/feedback ────
const dto = await getJson(`/api/lessons/published/${lessonId}`, studentA);
check("Đọc DTO: status", dto.status, 200);
checkTrue("DTO không chứa correctAnswer", !JSON.stringify(dto.body).includes("correctAnswer"));
checkTrue("DTO không chứa explanation (chỉ trả qua /check khi đúng)",
  !JSON.stringify(dto.body).includes("explanation"), JSON.stringify(dto.body).slice(0, 300));
checkTrue("DTO không chứa feedbackCorrect/feedbackWrong",
  !JSON.stringify(dto.body).includes("feedbackCorrect") && !JSON.stringify(dto.body).includes("feedbackWrong"));

// ── 3. Chưa đăng nhập → 401; draft → 404 ở cả 3 endpoint ────────────────
check("Check không token: 401", (await postJson(`/api/lessons/published/${lessonId}/check`, null, { elementId: "el-q-single", answer: "b" })).status, 401);
check("Check bài draft: 404", (await postJson(`/api/lessons/published/${draftId}/check`, studentA, { elementId: "el-qd", answer: "x" })).status, 404);
check("Progress bài draft: 404", (await getJson(`/api/lessons/published/${draftId}/progress`, studentA)).status, 404);
check("Complete bài draft: 404", (await postJson(`/api/lessons/published/${draftId}/complete`, studentA)).status, 404);
check("Check bài không tồn tại: 404", (await postJson(`/api/lessons/published/lesson-khongco/check`, studentA, { elementId: "x", answer: "y" })).status, 404);

// ── 4. elementId sai / không phải question → 400 ────────────────────────
const badEl = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-khong-co", answer: "b" });
check("Check elementId không tồn tại: 400", badEl.status, 400);
const notQuestion = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-t", answer: "b" });
check("Check phần tử title (không phải question): 400", notQuestion.status, 400);
const gameEl = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-g", answer: "b" });
check("Check phần tử game: 400", gameEl.status, 400);

// ── 5. Tiến độ ban đầu: rỗng, chưa hoàn thành ───────────────────────────
const prog0 = await getJson(`/api/lessons/published/${lessonId}/progress`, studentA);
check("Progress ban đầu: status", prog0.status, 200);
check("Progress ban đầu: correctElementIds rỗng", prog0.body?.data?.correctElementIds, []);
check("Progress ban đầu: attempts 0", prog0.body?.data?.attempts, 0);
check("Progress ban đầu: totalQuestions 2", prog0.body?.data?.totalQuestions, 2);
check("Progress ban đầu: completed false", prog0.body?.data?.completed, false);

// ── 6. Trả lời SAI câu single: correct=false, 0 điểm, feedback sai,
//        KHÔNG có explanation, attempts tăng, chưa hoàn thành ───────────
const wrong = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q-single", answer: "a" });
check("Check sai: status", wrong.status, 200);
check("Check sai: correct false", wrong.body?.data?.correct, false);
check("Check sai: points 0", wrong.body?.data?.points, 0);
check("Check sai: feedback là feedbackWrong", wrong.body?.data?.feedback, "Chưa đúng đâu");
checkTrue("Check sai: KHÔNG trả explanation", !("explanation" in (wrong.body?.data || {})),
  JSON.stringify(wrong.body?.data));
check("Check sai: attempts tiến độ = 1", wrong.body?.data?.progress?.attempts, 1);
check("Check sai: correctElementIds vẫn rỗng", wrong.body?.data?.progress?.correctElementIds, []);
check("Check sai: completed false", wrong.body?.data?.progress?.completed, false);

// ── 7. Trả lời ĐÚNG câu single: điểm theo points của câu, có
//        explanation + feedback đúng; vẫn chưa hoàn thành (còn câu fill)
const right = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q-single", answer: "b" });
check("Check đúng single: correct true", right.body?.data?.correct, true);
check("Check đúng single: points 15 (theo khai báo)", right.body?.data?.points, 15);
check("Check đúng single: explanation được trả", right.body?.data?.explanation, "3 × 4 = 12");
check("Check đúng single: feedback là feedbackCorrect", right.body?.data?.feedback, "Giỏi lắm!");
check("Check đúng single: correctElementIds có el-q-single", right.body?.data?.progress?.correctElementIds, ["el-q-single"]);
check("Check đúng single: completed vẫn false (còn câu fill)", right.body?.data?.progress?.completed, false);
check("Check đúng single: completedAt vẫn null", right.body?.data?.progress?.completedAt, null);

// Trả lời đúng LẠI câu single: không trùng correctElementIds, attempts vẫn tăng
const rightAgain = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q-single", answer: "b" });
check("Check đúng lại: correctElementIds không trùng", rightAgain.body?.data?.progress?.correctElementIds, ["el-q-single"]);
check("Check đúng lại: attempts = 3", rightAgain.body?.data?.progress?.attempts, 3);

// ── 8. Câu fill: sai hoa/thường + thừa khoảng trắng vẫn ĐÚNG ───────────
const fillWrong = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q-fill", answer: "con chó" });
check("Check fill sai: correct false", fillWrong.body?.data?.correct, false);
checkTrue("Check fill sai: không explanation", !("explanation" in (fillWrong.body?.data || {})));
const fillRight = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q-fill", answer: "  con mèo  " });
check("Check fill đúng (khác hoa/thường + khoảng trắng): correct true", fillRight.body?.data?.correct, true);
check("Check fill đúng: points 5", fillRight.body?.data?.points, 5);
check("Check fill đúng: explanation được trả", fillRight.body?.data?.explanation, "Đó là con mèo");
check("Đủ 2 câu đúng: completed true", fillRight.body?.data?.progress?.completed, true);
checkTrue("Đủ 2 câu đúng: completedAt được đặt", Boolean(fillRight.body?.data?.progress?.completedAt));
check("Đủ 2 câu đúng: correctCount 2", fillRight.body?.data?.progress?.correctCount, 2);

// ── 9. Progress đọc lại khớp; học sinh B không thấy tiến độ của A ──────
const progA = await getJson(`/api/lessons/published/${lessonId}/progress`, studentA);
check("Progress A đọc lại: attempts 5", progA.body?.data?.attempts, 5);
check("Progress A đọc lại: completed true", progA.body?.data?.completed, true);
const progB = await getJson(`/api/lessons/published/${lessonId}/progress`, studentB);
check("Progress B: correctElementIds rỗng (không lộ của A)", progB.body?.data?.correctElementIds, []);
check("Progress B: attempts 0", progB.body?.data?.attempts, 0);
check("Progress B: completed false", progB.body?.data?.completed, false);
const mineB = await getJson("/api/lessons/progress/mine", studentB);
check("Danh sách tiến độ của B: rỗng", mineB.body?.data, []);
const mineA = await getJson("/api/lessons/progress/mine", studentA);
checkTrue("Danh sách tiến độ của A: có đúng bài này, đã hoàn thành",
  Array.isArray(mineA.body?.data) && mineA.body.data.length === 1
  && mineA.body.data[0].lessonId === lessonId && mineA.body.data[0].completed === true,
  JSON.stringify(mineA.body?.data));

// ── 10. Bài có câu hỏi: /complete KHÔNG tự hoàn thành khi chưa đúng ────
const studentC = signToken({ id: "user-hs-c", username: "hsc", role: "student", name: "Học Sinh C" });
const completeEarly = await postJson(`/api/lessons/published/${lessonId}/complete`, studentC);
check("Complete bài có câu hỏi khi chưa trả lời: completed false", completeEarly.body?.data?.completed, false);

// ── 11. Bài KHÔNG có câu hỏi: hoàn thành qua /complete ─────────────────
const progNQ0 = await getJson(`/api/lessons/published/${noQuestionId}/progress`, studentA);
check("Bài không câu hỏi: totalQuestions 0", progNQ0.body?.data?.totalQuestions, 0);
check("Bài không câu hỏi: completed false ban đầu", progNQ0.body?.data?.completed, false);
const completeNQ = await postJson(`/api/lessons/published/${noQuestionId}/complete`, studentA);
check("Complete bài không câu hỏi: completed true", completeNQ.body?.data?.completed, true);
checkTrue("Complete bài không câu hỏi: completedAt được đặt", Boolean(completeNQ.body?.data?.completedAt));
const completeNQ2 = await postJson(`/api/lessons/published/${noQuestionId}/complete`, studentA);
check("Complete lần 2 (idempotent): completedAt giữ nguyên",
  completeNQ2.body?.data?.completedAt, completeNQ.body?.data?.completedAt);

await new Promise((resolve) => server.close(resolve));
await db.close().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
