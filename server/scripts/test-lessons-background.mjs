// Test tích hợp: NỀN TRANG (page.background) của BÀI HỌC AI STUDIO.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-lessons.mjs):
//   node server/scripts/test-lessons-background.mjs
// Bao phủ: nền màu + nền ảnh được GIỮ qua tạo/đọc/cập nhật (trước đây
// normalizePages phía server chỉ trả { id, title, elements } nên nền bị
// rơi khi lưu), nền sai dạng bị bỏ qua mà không chặn lưu, và DTO phía
// học sinh (đã publish) vẫn mang nền nhưng không lộ correctAnswer.
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-lessons-bg-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "lessons_bg_test";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacher = signToken({ id: "user-gv-bg", username: "gvbg", role: "teacher", name: "Giáo Viên Nền" });
const student = signToken({ id: "user-hs-bg", username: "hsbg", role: "student", name: "Học Sinh Nền" });

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

const el = (over = {}) => ({ id: "el-1", type: "text", x: 40, y: 40, w: 600, h: 120, props: { text: "Xin chào" }, ...over });
const page = (over = {}) => ({ id: "page-1", title: "Trang 1", elements: [el()], ...over });
const BG_COLOR = { type: "color", value: "#E3F2FD" };
const BG_IMAGE = { type: "image", value: "https://example.com/nen-lop-hoc.png" };

// ── 1. Tạo bài với nền MÀU ở trang 1 → tạo xong đọc lại còn nguyên ───────
const created = await req("POST", "/api/lessons", teacher, {
  title: "Bài có nền", subject: "Toán", grade: 3,
  pages: [page({ background: BG_COLOR })],
});
check("Tạo bài có nền màu: status", created.status, 201);
check("Tạo bài: response giữ background", created.body?.data?.pages?.[0]?.background, BG_COLOR);
const lessonId = created.body.data.id;

const got = await req("GET", `/api/lessons/${lessonId}`, teacher);
check("Đọc lại bài: background còn nguyên sau khi qua server", got.body?.data?.pages?.[0]?.background, BG_COLOR);

// ── 2. Cập nhật: trang 1 đổi sang nền ẢNH, trang 2 không nền ────────────
const updated = await req("PUT", `/api/lessons/${lessonId}`, teacher, {
  pages: [
    page({ background: BG_IMAGE }),
    { id: "page-2", title: "Trang 2", elements: [] },
  ],
});
check("Cập nhật nền ảnh: status", updated.status, 200);
const got2 = await req("GET", `/api/lessons/${lessonId}`, teacher);
check("Sau cập nhật: trang 1 nền ảnh", got2.body?.data?.pages?.[0]?.background, BG_IMAGE);
checkTrue("Sau cập nhật: trang 2 KHÔNG có khoá background",
  got2.body?.data?.pages?.[1] && !("background" in got2.body.data.pages[1]),
  JSON.stringify(got2.body?.data?.pages?.[1]));

// ── 3. Nền sai dạng → bị bỏ qua, lần lưu vẫn thành công ──────────────────
const bad = await req("PUT", `/api/lessons/${lessonId}`, teacher, {
  pages: [page({ background: { type: "gradient", value: "linear-gradient(red, blue)" } })],
});
check("Nền type lạ: lưu vẫn 200", bad.status, 200);
const got3 = await req("GET", `/api/lessons/${lessonId}`, teacher);
checkTrue("Nền type lạ: đã bị bỏ, trang không còn background",
  got3.body?.data?.pages?.[0] && !("background" in got3.body.data.pages[0]),
  JSON.stringify(got3.body?.data?.pages?.[0]));

const badColor = await req("PUT", `/api/lessons/${lessonId}`, teacher, {
  pages: [page({ background: { type: "color", value: "do-cam" } })],
});
check("Nền màu không phải hex: lưu vẫn 200", badColor.status, 200);
const got4 = await req("GET", `/api/lessons/${lessonId}`, teacher);
checkTrue("Nền màu không phải hex: đã bị bỏ",
  got4.body?.data?.pages?.[0] && !("background" in got4.body.data.pages[0]),
  JSON.stringify(got4.body?.data?.pages?.[0]));

// ── 4. Publish → DTO học sinh có nền, không lộ đáp án ────────────────────
await req("PUT", `/api/lessons/${lessonId}`, teacher, {
  pages: [page({
    background: BG_COLOR,
    elements: [el({
      id: "el-q1", type: "question", x: 40, y: 200, w: 700, h: 260,
      props: {
        prompt: "3 × 4 = ?", qtype: "single",
        options: [{ id: "a", content: "10" }, { id: "b", content: "12" }],
        correctAnswer: "b", points: 10,
      },
    })],
  })],
});
const pub = await req("POST", `/api/lessons/${lessonId}/publish`, teacher);
check("Publish bài có nền: status", pub.status, 200);
const studentView = await req("GET", `/api/lessons/published/${lessonId}`, student);
check("Học sinh đọc bài: status", studentView.status, 200);
check("DTO học sinh: vẫn có background của trang", studentView.body?.data?.pages?.[0]?.background, BG_COLOR);
checkTrue("DTO học sinh: không lộ correctAnswer",
  !JSON.stringify(studentView.body).includes("correctAnswer"),
  JSON.stringify(studentView.body).slice(0, 200));

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
