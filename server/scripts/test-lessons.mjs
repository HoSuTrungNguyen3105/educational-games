// Test tích hợp: BÀI HỌC AI STUDIO (API /api/lessons) — Đợt 1.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-pages.mjs):
//   node server/scripts/test-lessons.mjs
// Bao phủ: CRUD + quyền sở hữu, validate khi lưu, validate khi publish
// (§15 đặc tả), và — quan trọng nhất — DTO phía học sinh KHÔNG chứa
// correctAnswer ở bất kỳ cấp lồng nhau nào (§20 đặc tả).
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-lessons-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "lessons_test";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { ObjectId } = await import("mongodb");
const lessonService = await import("../src/services/lessonService.js");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacherA = signToken({ id: "user-gv-a", username: "gva", role: "teacher", name: "Giáo Viên A" });
const teacherB = signToken({ id: "user-gv-b", username: "gvb", role: "teacher", name: "Giáo Viên B" });
const admin = signToken({ id: "user-admin", username: "admin", role: "admin", name: "Admin" });
const student = signToken({ id: "user-hs", username: "hstest", role: "student", name: "Học Sinh Test" });

// Game online thật trong collection `games` để phần tử game trỏ vào.
const gameObjectId = new ObjectId();
const gameId = gameObjectId.toString();
const nowIso = new Date().toISOString();
await db.getCollection("games").insertOne({
  _id: gameObjectId, name: "Game Test Studio", description: "", subject: "Toán",
  type: "play-to-learn", status: "published", playMode: "solo",
  questionsCount: 0, playersCount: 0, code: "TESTSTUDIO",
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
const putJson = (p, token, payload) => req("PUT", p, token, payload);

const el = (over = {}) => ({ id: "el-1", type: "text", x: 40, y: 40, w: 600, h: 120, props: { text: "Xin chào" }, ...over });
const page = (over = {}) => ({ id: "page-1", title: "Trang 1", elements: [el()], ...over });
const validQuestionSingle = (propOver = {}) => el({
  id: "el-q1", type: "question", x: 40, y: 200, w: 700, h: 260,
  props: {
    prompt: "3 × 4 = ?", qtype: "single",
    options: [{ id: "a", content: "10" }, { id: "b", content: "12" }],
    correctAnswer: "b", explanation: "3 × 4 = 12", points: 10,
    feedbackCorrect: "Đúng rồi!", feedbackWrong: "Sai rồi, xem lại nhé",
    ...propOver,
  },
});

// ── 0. stripAnswers lọc đệ quy ở mọi cấp lồng nhau (unit) ───────────────
const nested = { a: { correctAnswer: "x", b: [{ correctAnswer: "y", c: 1 }, { d: { correctAnswer: "z" } }] }, correctAnswer: "top" };
checkTrue("stripAnswers: không còn khoá correctAnswer ở bất kỳ cấp nào",
  !JSON.stringify(lessonService.stripAnswers(nested)).includes("correctAnswer"),
  JSON.stringify(lessonService.stripAnswers(nested)));

// ── 1. Chưa đăng nhập → 401; học sinh ghi → 403 ──────────────────────────
check("POST /lessons không token: status", (await postJson("/api/lessons", null, { title: "X" })).status, 401);
check("GET /lessons/mine không token: status", (await getJson("/api/lessons/mine", null)).status, 401);
check("GET /lessons/published không token: status", (await getJson("/api/lessons/published", null)).status, 401);
check("POST /lessons bằng học sinh: status", (await postJson("/api/lessons", student, { title: "X" })).status, 403);

// ── 2. Tạo bài học hợp lệ (giáo viên A) ──────────────────────────────────
const created = await postJson("/api/lessons", teacherA, {
  title: "Bảng nhân 4", subject: "Toán", grade: 3, description: "Học bảng nhân 4",
  objectives: "Thuộc bảng nhân 4",
  pages: [page()],
});
check("Tạo bài: status", created.status, 201);
check("Tạo bài: status draft", created.body?.data?.status, "draft");
check("Tạo bài: ownerId là giáo viên A", created.body?.data?.ownerId, "user-gv-a");
checkTrue("Tạo bài: id có tiền tố lesson-", String(created.body?.data?.id || "").startsWith("lesson-"),
  String(created.body?.data?.id));
const lessonId = created.body.data.id;

// Phần tử chạm đúng biên canvas (x + w = 1280) → hợp lệ.
const edge = await postJson("/api/lessons", teacherA, {
  title: "Biên canvas", pages: [page({ elements: [el({ x: 1180, w: 100 })] })],
});
check("Phần tử chạm biên canvas: status", edge.status, 201);

// ── 3. Validate khi LƯU (draft) ──────────────────────────────────────────
check("Lưu: type phần tử lạ → 400",
  (await postJson("/api/lessons", teacherA, { title: "X", pages: [page({ elements: [el({ type: "video" })] })] })).status, 400);
check("Lưu: qtype lạ → 400",
  (await postJson("/api/lessons", teacherA, {
    title: "X",
    pages: [page({ elements: [el({ type: "question", props: { prompt: "?", qtype: "multi", correctAnswer: "" } })] })],
  })).status, 400);
check("Lưu: hình học ngoài biên (x + w > 1280) → 400",
  (await postJson("/api/lessons", teacherA, { title: "X", pages: [page({ elements: [el({ x: 1200, w: 200 })] })] })).status, 400);
check("Lưu: hình học âm → 400",
  (await postJson("/api/lessons", teacherA, { title: "X", pages: [page({ elements: [el({ y: -5 })] })] })).status, 400);
check("Lưu: trùng id phần tử giữa 2 trang → 400",
  (await postJson("/api/lessons", teacherA, {
    title: "X",
    pages: [page(), page({ id: "page-2", elements: [el()] })],
  })).status, 400);
check("Lưu: trùng id trang → 400",
  (await postJson("/api/lessons", teacherA, {
    title: "X",
    pages: [page(), page({ elements: [el({ id: "el-2" })] })],
  })).status, 400);
check("Lưu: game trỏ game không tồn tại → 400",
  (await postJson("/api/lessons", teacherA, {
    title: "X",
    pages: [page({ elements: [el({ type: "game", props: { gameId: "000000000000000000000000" } })] })],
  })).status, 400);

// ── 4. Quyền sở hữu: giáo viên B không đụng được bài của A; admin ngoại lệ ──
check("GV B đọc bản đầy đủ của A: status", (await getJson(`/api/lessons/${lessonId}`, teacherB)).status, 403);
check("GV B sửa bài của A: status", (await putJson(`/api/lessons/${lessonId}`, teacherB, { title: "Chiếm" })).status, 403);
check("GV B publish bài của A: status", (await postJson(`/api/lessons/${lessonId}/publish`, teacherB)).status, 403);
check("GV B xoá bài của A: status", (await req("DELETE", `/api/lessons/${lessonId}`, teacherB)).status, 403);
check("Admin đọc bản đầy đủ của A: status", (await getJson(`/api/lessons/${lessonId}`, admin)).status, 200);
check("Đọc bài không tồn tại: status", (await getJson("/api/lessons/lesson-khongco", teacherA)).status, 404);

// Danh sách của tôi: B không thấy bài của A.
const mineB = await getJson("/api/lessons/mine", teacherB);
checkTrue("Danh sách của B không chứa bài của A",
  !(mineB.body?.data || []).some((l) => l.id === lessonId), JSON.stringify(mineB.body?.data?.map((l) => l.id)));
const mineA = await getJson("/api/lessons/mine?search=Bảng nhân", teacherA);
checkTrue("Danh sách của A có bài + tìm kiếm theo tiêu đề chạy",
  (mineA.body?.data || []).some((l) => l.id === lessonId), JSON.stringify(mineA.body?.data?.map((l) => l.id)));
checkTrue("DTO danh sách giáo viên không kèm pages",
  (mineA.body?.data || []).every((l) => !("pages" in l)));

// ── 5. Bản đầy đủ của chủ sở hữu GỒM correctAnswer ──────────────────────
const withQ = await postJson("/api/lessons", teacherA, {
  title: "Bài có câu hỏi", pages: [page({ elements: [validQuestionSingle()] })],
});
check("Tạo bài có câu hỏi: status", withQ.status, 201);
const qLessonId = withQ.body.data.id;
const ownerView = await getJson(`/api/lessons/${qLessonId}`, teacherA);
checkTrue("Bản chủ sở hữu chứa correctAnswer",
  JSON.stringify(ownerView.body?.data).includes('"correctAnswer":"b"'),
  JSON.stringify(ownerView.body?.data?.pages?.[0]?.elements?.[0]?.props));

// ── 6. Publish VALIDATION — lỗi cụ thể, bài vẫn draft ────────────────────
const noTitle = await postJson("/api/lessons", teacherA, { title: "", pages: [page()] });
const pubNoTitle = await postJson(`/api/lessons/${noTitle.body.data.id}/publish`, teacherA);
check("Publish thiếu tiêu đề: status", pubNoTitle.status, 400);
checkTrue("Publish thiếu tiêu đề: errors có field title",
  (pubNoTitle.body?.data?.errors || []).some((e) => e.field === "title"),
  JSON.stringify(pubNoTitle.body?.data?.errors));
check("Sau publish lỗi, bài vẫn draft",
  (await getJson(`/api/lessons/${noTitle.body.data.id}`, teacherA)).body?.data?.status, "draft");

const noPages = await postJson("/api/lessons", teacherA, { title: "Không trang", pages: [] });
const pubNoPages = await postJson(`/api/lessons/${noPages.body.data.id}/publish`, teacherA);
checkTrue("Publish 0 trang: errors có field pages",
  (pubNoPages.body?.data?.errors || []).some((e) => e.field === "pages"),
  JSON.stringify(pubNoPages.body?.data?.errors));

const badAnswer = await postJson("/api/lessons", teacherA, {
  title: "Đáp án sai",
  pages: [page({ elements: [validQuestionSingle({ correctAnswer: "khong-co" })] })],
});
const pubBadAnswer = await postJson(`/api/lessons/${badAnswer.body.data.id}/publish`, teacherA);
check("Publish đáp án không thuộc options: status", pubBadAnswer.status, 400);
checkTrue("Publish đáp án sai: errors trỏ đúng trang/phần tử/field",
  (pubBadAnswer.body?.data?.errors || []).some(
    (e) => e.field === "correctAnswer" && e.pageId === "page-1" && e.elementId === "el-q1"),
  JSON.stringify(pubBadAnswer.body?.data?.errors));

const badFill = await postJson("/api/lessons", teacherA, {
  title: "Điền từ thiếu đáp án",
  pages: [page({ elements: [el({ id: "el-f1", type: "question", props: { prompt: "Điền số: 2 + 2 = ?", qtype: "fill", correctAnswer: "  " } })] })],
});
const pubBadFill = await postJson(`/api/lessons/${badFill.body.data.id}/publish`, teacherA);
checkTrue("Publish điền từ thiếu đáp án: errors có correctAnswer",
  (pubBadFill.body?.data?.errors || []).some((e) => e.field === "correctAnswer" && e.elementId === "el-f1"),
  JSON.stringify(pubBadFill.body?.data?.errors));

const noPrompt = await postJson("/api/lessons", teacherA, {
  title: "Thiếu nội dung câu hỏi",
  pages: [page({ elements: [validQuestionSingle({ prompt: " " })] })],
});
const pubNoPrompt = await postJson(`/api/lessons/${noPrompt.body.data.id}/publish`, teacherA);
checkTrue("Publish câu hỏi trống prompt: errors có field prompt",
  (pubNoPrompt.body?.data?.errors || []).some((e) => e.field === "prompt"),
  JSON.stringify(pubNoPrompt.body?.data?.errors));

// Game bị xoá SAU khi lưu → publish phải bắt lại (không tin dữ liệu cũ).
const withGame = await postJson("/api/lessons", teacherA, {
  title: "Bài có game",
  pages: [page({ elements: [el({ type: "game", props: { gameId } })] })],
});
check("Tạo bài có game tồn tại: status", withGame.status, 201);
await db.getCollection("games").deleteOne({ _id: gameObjectId });
const pubDeadGame = await postJson(`/api/lessons/${withGame.body.data.id}/publish`, teacherA);
checkTrue("Publish khi game đã bị xoá: errors có gameId",
  (pubDeadGame.body?.data?.errors || []).some((e) => e.field === "gameId"),
  JSON.stringify(pubDeadGame.body?.data?.errors));
// Gieo lại game cho các ca sau.
await db.getCollection("games").insertOne({
  _id: gameObjectId, name: "Game Test Studio", description: "", subject: "Toán",
  type: "play-to-learn", status: "published", playMode: "solo",
  questionsCount: 0, playersCount: 0, code: "TESTSTUDIO",
  createdAt: nowIso, updatedAt: nowIso,
});

// ── 7. Publish HỢP LỆ → học sinh đọc được, DTO sạch đáp án ──────────────
const full = await postJson("/api/lessons", teacherA, {
  title: "Bài học đầy đủ", subject: "Toán", grade: 3,
  pages: [
    page({
      title: "Học",
      elements: [
        el({ id: "el-t", type: "title", props: { text: "Bảng nhân 4", fontSize: 40 } }),
        validQuestionSingle(),
        el({ id: "el-f1", type: "question", x: 40, y: 480, props: { prompt: "4 × 5 = ?", qtype: "fill", correctAnswer: "20", points: 10 } }),
        el({ id: "el-g", type: "game", x: 800, y: 40, w: 400, h: 300, props: { gameId } }),
        el({ id: "el-i", type: "image", x: 800, y: 360, w: 300, h: 200, props: { imageUrl: "https://example.com/a.png", alt: "Minh hoạ" } }),
      ],
    }),
  ],
});
check("Tạo bài đầy đủ: status", full.status, 201);
const fullId = full.body.data.id;

check("Học sinh đọc bài DRAFT qua đường published: status",
  (await getJson(`/api/lessons/published/${fullId}`, student)).status, 404);

const published = await postJson(`/api/lessons/${fullId}/publish`, teacherA);
check("Publish hợp lệ: status", published.status, 200);
check("Publish hợp lệ: status published", published.body?.data?.status, "published");
checkTrue("Publish hợp lệ: có publishedAt", Boolean(published.body?.data?.publishedAt));

const studentList = await getJson("/api/lessons/published", student);
checkTrue("Danh sách học sinh thấy bài đã publish",
  (studentList.body?.data || []).some((l) => l.id === fullId),
  JSON.stringify(studentList.body?.data?.map((l) => l.id)));
checkTrue("Danh sách học sinh không kèm pages",
  (studentList.body?.data || []).every((l) => !("pages" in l)));

const studentView = await getJson(`/api/lessons/published/${fullId}`, student);
check("Học sinh đọc chi tiết: status", studentView.status, 200);
checkTrue("DTO học sinh KHÔNG chứa chuỗi correctAnswer ở bất cứ đâu",
  !JSON.stringify(studentView.body).includes("correctAnswer"),
  JSON.stringify(studentView.body).slice(0, 400));
checkTrue("DTO học sinh vẫn có prompt + options để làm bài",
  JSON.stringify(studentView.body).includes("3 × 4 = ?")
  && JSON.stringify(studentView.body).includes('"content":"12"'));
checkTrue("DTO học sinh vẫn có phần tử game kèm gameId",
  JSON.stringify(studentView.body).includes(gameId));
check("Giáo viên B (không phải chủ) cũng đọc được bản published qua đường học sinh",
  (await getJson(`/api/lessons/published/${fullId}`, teacherB)).status, 200);

// ── 8. Cập nhật + unpublish + xoá ────────────────────────────────────────
const updated = await putJson(`/api/lessons/${fullId}`, teacherA, {
  title: "Bài học đầy đủ (v2)",
  pages: [page({ elements: [el({ props: { text: "Nội dung v2" } })] })],
});
check("Chủ sở hữu cập nhật: status", updated.status, 200);
check("Cập nhật đổi tiêu đề", updated.body?.data?.title, "Bài học đầy đủ (v2)");

const unpub = await postJson(`/api/lessons/${fullId}/unpublish`, teacherA);
check("Unpublish: status", unpub.status, 200);
check("Unpublish: status về draft", unpub.body?.data?.status, "draft");
check("Sau unpublish, học sinh đọc → 404",
  (await getJson(`/api/lessons/published/${fullId}`, student)).status, 404);
const studentList2 = await getJson("/api/lessons/published", student);
checkTrue("Sau unpublish, danh sách học sinh không còn bài",
  !(studentList2.body?.data || []).some((l) => l.id === fullId));

const deleted = await req("DELETE", `/api/lessons/${fullId}`, teacherA);
check("Chủ sở hữu xoá: status", deleted.status, 200);
check("Đọc lại bài đã xoá: status", (await getJson(`/api/lessons/${fullId}`, teacherA)).status, 404);

await new Promise((resolve) => server.close(resolve));
await db.close().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
