// Test tích hợp: AI STUDIO ĐỢT NÂNG CẤP — tiến độ học sinh theo bài cho
// giáo viên (GET /api/lessons/:id/progress), lưu bền "đã chơi game"
// (POST /api/lessons/published/:id/played → lessonProgress.playedGameIds)
// và ảnh bìa bài học (coverImage qua normalizeMeta/serializeMeta).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-lessons-submit.mjs):
//   node server/scripts/test-lessons-progress.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-lessons-progress-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "lessons_progress_test";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { ObjectId } = await import("mongodb");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacher = signToken({ id: "user-gv", username: "gvtest", role: "teacher", name: "Giáo Viên Test" });
const teacher2 = signToken({ id: "user-gv2", username: "gvtest2", role: "teacher", name: "Giáo Viên Khác" });
const studentA = signToken({ id: "user-hs-a", username: "hsa", role: "student", name: "Học Sinh A" });
const studentB = signToken({ id: "user-hs-b", username: "hsb", role: "student", name: "Học Sinh B" });

// User records để endpoint giáo viên tra TÊN học sinh (collection users).
await db.getCollection("users").insertMany([
  { id: "user-hs-a", username: "hsa", name: "Học Sinh A", role: "student" },
  { id: "user-hs-b", username: "hsb", name: "Học Sinh B", role: "student" },
]);

// Game online thật để bài học tham chiếu được (publish validate).
const gameObjectId = new ObjectId();
const gameId = gameObjectId.toString();
const nowIso = new Date().toISOString();
await db.getCollection("games").insertOne({
  _id: gameObjectId, name: "Game Test Tiến Độ", description: "", subject: "Toán",
  type: "play-to-learn", status: "published", playMode: "solo",
  questionsCount: 0, playersCount: 0, code: "TESTPROG",
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
const putJson = (p, token, payload) => req("PUT", p, token, payload ?? {});

const el = (over = {}) => ({ id: "el-1", type: "text", x: 40, y: 40, w: 600, h: 120, props: { text: "Xin chào" }, ...over });

// ── 1. Seed: bài published có 2 câu single + 1 game, kèm ảnh bìa ───────
const lesson = await postJson("/api/lessons", teacher, {
  title: "Bài theo dõi tiến độ", subject: "Toán", grade: 3,
  coverImage: "https://example.com/bia.jpg",
  pages: [{
    id: "page-1", title: "Luyện tập",
    elements: [
      el({
        id: "el-q1", type: "question", x: 40, y: 40, w: 700, h: 200,
        props: {
          prompt: "2 + 2 = ?", qtype: "single",
          options: [{ id: "a", content: "3" }, { id: "b", content: "4" }],
          correctAnswer: "b", points: 10,
        },
      }),
      el({
        id: "el-q2", type: "question", x: 40, y: 260, w: 700, h: 200,
        props: {
          prompt: "5 - 3 = ?", qtype: "single",
          options: [{ id: "a", content: "2" }, { id: "b", content: "8" }],
          correctAnswer: "a", points: 10,
        },
      }),
      el({ id: "el-g", type: "game", x: 800, y: 40, w: 400, h: 300, props: { gameId } }),
    ],
  }],
});
check("Tạo bài: status", lesson.status, 201);
const lessonId = lesson.body.data.id;
check("Tạo bài: coverImage được giữ ở bản đầy đủ", lesson.body.data.coverImage, "https://example.com/bia.jpg");
check("Publish: status", (await postJson(`/api/lessons/${lessonId}/publish`, teacher)).status, 200);

const mine = await getJson("/api/lessons/mine", teacher);
check("Danh sách của tôi: coverImage có trong DTO meta",
  mine.body.data.find((l) => l.id === lessonId)?.coverImage, "https://example.com/bia.jpg");
const publishedList = await getJson("/api/lessons/published", studentA);
check("Danh sách học sinh: coverImage có trong DTO meta",
  publishedList.body.data.find((l) => l.id === lessonId)?.coverImage, "https://example.com/bia.jpg");

// PUT đổi ảnh bìa (đường updateLesson + điều kiện meta có coverImage).
const upd = await putJson(`/api/lessons/${lessonId}`, teacher, { coverImage: "https://example.com/bia-2.jpg" });
check("PUT đổi bìa: status", upd.status, 200);
check("PUT đổi bìa: coverImage mới", upd.body.data.coverImage, "https://example.com/bia-2.jpg");
check("PUT đổi bìa: title không bị xoá", upd.body.data.title, "Bài theo dõi tiến độ");

// ── 2. Học sinh A: đúng 1/2 câu + chơi game. B: chỉ chơi game ──────────
const chk = await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q1", answer: "b" });
check("A check đúng q1: correct", chk.body?.data?.correct, true);
check("A check: progress chưa có playedGameIds nào", chk.body?.data?.progress?.playedGameIds, []);

const playedA = await postJson(`/api/lessons/published/${lessonId}/played`, studentA, { elementId: "el-g" });
check("A played game: status", playedA.status, 200);
check("A played game: playedGameIds", playedA.body?.data?.playedGameIds, ["el-g"]);
check("A played game: playedGameCount 1", playedA.body?.data?.playedGameCount, 1);
check("A played game: totalGames 1", playedA.body?.data?.totalGames, 1);

const playedA2 = await postJson(`/api/lessons/published/${lessonId}/played`, studentA, { elementId: "el-g" });
check("A played lại (idempotent): playedGameIds không trùng", playedA2.body?.data?.playedGameIds, ["el-g"]);

const playedB = await postJson(`/api/lessons/published/${lessonId}/played`, studentB, { elementId: "el-g" });
check("B played game: playedGameIds", playedB.body?.data?.playedGameIds, ["el-g"]);
check("B played game: attempts vẫn 0", playedB.body?.data?.attempts, 0);

// Tiến độ đọc lại của A giữ cả hai loại dữ kiện (khôi phục sau reload).
const progA = await getJson(`/api/lessons/published/${lessonId}/progress`, studentA);
check("Progress A đọc lại: playedGameIds bền", progA.body?.data?.playedGameIds, ["el-g"]);
check("Progress A đọc lại: correctElementIds", progA.body?.data?.correctElementIds, ["el-q1"]);

// ── 3. Played: lỗi validate ─────────────────────────────────────────────
check("Played phần tử question: 400",
  (await postJson(`/api/lessons/published/${lessonId}/played`, studentA, { elementId: "el-q1" })).status, 400);
check("Played elementId không tồn tại: 400",
  (await postJson(`/api/lessons/published/${lessonId}/played`, studentA, { elementId: "el-khong-co" })).status, 400);
check("Played không token: 401",
  (await postJson(`/api/lessons/published/${lessonId}/played`, null, { elementId: "el-g" })).status, 401);

const draft = await postJson("/api/lessons", teacher, {
  title: "Bài nháp tiến độ", pages: [{ id: "p1", title: "P1", elements: [
    el({ id: "el-gd", type: "game", props: { gameId } }),
  ] }],
});
check("Played bài draft: 404",
  (await postJson(`/api/lessons/published/${draft.body.data.id}/played`, studentA, { elementId: "el-gd" })).status, 404);

// ── 4. Endpoint tiến độ phía giáo viên ──────────────────────────────────
const tp = await getJson(`/api/lessons/${lessonId}/progress`, teacher);
check("Tiến độ GV: status", tp.status, 200);
check("Tiến độ GV: totalQuestions 2", tp.body?.data?.totalQuestions, 2);
check("Tiến độ GV: totalGames 1", tp.body?.data?.totalGames, 1);
check("Tiến độ GV: studentCount 2", tp.body?.data?.studentCount, 2);
check("Tiến độ GV: completedCount 0 (chưa ai đúng hết)", tp.body?.data?.completedCount, 0);
const rowA = tp.body?.data?.students?.find((s) => s.userId === "user-hs-a");
const rowB = tp.body?.data?.students?.find((s) => s.userId === "user-hs-b");
checkTrue("Tiến độ GV: có dòng của A và B", Boolean(rowA && rowB), JSON.stringify(tp.body?.data?.students));
check("Dòng A: tên học sinh tra từ users", rowA?.student?.name, "Học Sinh A");
check("Dòng A: username", rowA?.student?.username, "hsa");
check("Dòng A: correctCount 1", rowA?.correctCount, 1);
check("Dòng A: attempts 1", rowA?.attempts, 1);
check("Dòng A: playedGameCount 1", rowA?.playedGameCount, 1);
check("Dòng A: completed false", rowA?.completed, false);
check("Dòng B: correctCount 0", rowB?.correctCount, 0);
check("Dòng B: playedGameCount 1", rowB?.playedGameCount, 1);
checkTrue("Tiến độ GV: không lộ passwordHash", !JSON.stringify(tp.body).includes("passwordHash"));

// Quyền: giáo viên khác 403, học sinh bị requireRoles chặn 403, ẩn danh 401.
check("Tiến độ GV: giáo viên khác 403", (await getJson(`/api/lessons/${lessonId}/progress`, teacher2)).status, 403);
check("Tiến độ GV: học sinh 403", (await getJson(`/api/lessons/${lessonId}/progress`, studentA)).status, 403);
check("Tiến độ GV: không token 401", (await getJson(`/api/lessons/${lessonId}/progress`, null)).status, 401);
check("Tiến độ GV: bài không tồn tại 404", (await getJson("/api/lessons/lesson-khongco/progress", teacher)).status, 404);

// A trả lời đúng nốt câu còn lại → completedCount thành 1.
await postJson(`/api/lessons/published/${lessonId}/check`, studentA, { elementId: "el-q2", answer: "a" });
const tp2 = await getJson(`/api/lessons/${lessonId}/progress`, teacher);
check("Sau khi A đúng hết: completedCount 1", tp2.body?.data?.completedCount, 1);
check("Sau khi A đúng hết: dòng A completed true",
  tp2.body?.data?.students?.find((s) => s.userId === "user-hs-a")?.completed, true);

await new Promise((resolve) => server.close(resolve));
await db.close().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
