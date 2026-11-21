// Test: generate-lesson CHUẨN HOÁ CHỊU LỖI đầu ra của model.
// Nguyên báo lỗi production: gọi POST /api/ai/generate-lesson nhận
// "AI trả về dữ liệu không đúng định dạng bài học…" dù model có trả nội
// dung — chỉ là JSON không hoàn hảo (cụt vì hết token, thừa dấu phẩy,
// chữ thừa quanh JSON, bọc trong {"lesson": …}, sai tên trường, đáp án
// đúng dạng số/chữ cái…). Đợt này: các ca đó phải SINH ĐƯỢC BÀI; chỉ ca
// thật sự không trích ra được nội dung bài nào mới báo lỗi (và báo đúng
// bản chất). Trần lượt gọi model giữ nguyên (tối đa 3/sinh bài), 429 vẫn
// ném ra ngay.
// Chạy app Express THẬT trên Mongo in-memory + Groq STUB local (shape
// OpenAI, nội dung trả về cấu hình theo từng ca). KHÔNG dùng key thật,
// KHÔNG gọi api.groq.com, KHÔNG tốn credit.
//   node server/scripts/test-generate-lesson-tolerant.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-generate-lesson-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "generate_lesson_tolerant_test";

// ───────────────────────── Stub Groq (shape OpenAI) ─────────────────────────
// responder(body) → { status?, content } — cấu hình lại theo từng ca kiểm.
const providerRequests = [];
let responder = () => ({ content: "{}" });

const stub = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => { raw += c; });
  req.on("end", () => {
    if (req.url === "/openai/v1/models") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ object: "list", data: [{ id: "openai/gpt-oss-20b", object: "model" }] }));
    }
    if (req.url === "/openai/v1/chat/completions") {
      const body = JSON.parse(raw || "{}");
      providerRequests.push(body);
      const out = responder(body) || {};
      if (out.status && out.status !== 200) {
        res.writeHead(out.status, {
          "Content-Type": "application/json",
          ...(out.retryAfter ? { "Retry-After": String(out.retryAfter) } : {}),
        });
        return res.end(JSON.stringify({ error: { message: out.message || "stub error", type: "stub", code: "stub_error" } }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        id: "chatcmpl-stub", object: "chat.completion",
        choices: [{ index: 0, message: { role: "assistant", content: out.content ?? "" }, finish_reason: "stop" }],
        usage: { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 },
      }));
    }
    res.writeHead(404);
    res.end();
  });
});
await new Promise((resolve) => stub.listen(0, "127.0.0.1", resolve));

// Env PHẢI đặt trước khi import config/services (config đọc env lúc import).
process.env.AI_PROVIDER = "groq";
process.env.GROQ_BASE_URL = `http://127.0.0.1:${stub.address().port}/openai/v1`;
process.env.GROQ_API_KEY = "test-groq-key";
process.env.GROQ_MODEL = "openai/gpt-oss-20b";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");

await updateConfig({ ai: { enabled: true } });

const OLD = "2026-01-05T00:00:00.000Z";
const mkUser = (id, name, role) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x", createdAt: OLD,
});
await db.getCollection("users").insertMany([
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-gv2", "Giáo Viên Hai", "teacher"),
  mkUser("user-gv3", "Giáo Viên Ba", "teacher"),
]);

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const tok = (id, username, name) => signToken({ id, username, role: "teacher", name });
const TEACHERS = [
  tok("user-gv1", "gv1", "Giáo Viên Một"),
  tok("user-gv2", "gv2", "Giáo Viên Hai"),
  tok("user-gv3", "gv3", "Giáo Viên Ba"),
];
// Bộ giới hạn nội bộ generate-lesson là 10 lượt/60s/người dùng — xoay
// vòng 3 giáo viên để các ca kiểm không chạm trần đó.
let teacherIdx = 0;
const nextTeacher = () => TEACHERS[(teacherIdx++) % TEACHERS.length];

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

const genLesson = async (token, payload) => {
  const res = await fetch(`${base}/api/ai/generate-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
};
const REQ = { prompt: "Soạn bài về tính chất của nước", subject: "Khoa học", gradeLevel: 4, length: "standard" };

/** Kiểm tra cấu trúc tối thiểu của một bài nháp trả về thành công. */
const checkLessonShape = (label, r, { minSections = 1 } = {}) => {
  check(`${label}: HTTP 200`, r.status, 200);
  const lesson = r.body?.data?.lesson;
  checkTrue(`${label}: có lesson.title là chuỗi khác rỗng`,
    typeof lesson?.title === "string" && lesson.title.trim() !== "", JSON.stringify(lesson?.title));
  check(`${label}: grade là SỐ nguyên từ request`, lesson?.grade, 4);
  checkTrue(`${label}: objectives là MỘT chuỗi (schema lessons)`,
    typeof lesson?.objectives === "string", typeof lesson?.objectives);
  checkTrue(`${label}: pages là mảng có trang`,
    Array.isArray(lesson?.pages) && lesson.pages.length >= 1, JSON.stringify(lesson?.pages?.length));
  checkTrue(`${label}: meta.sections >= ${minSections}`,
    (r.body?.data?.meta?.sections ?? 0) >= minSections, JSON.stringify(r.body?.data?.meta));
  const badElement = (lesson?.pages || []).flatMap((p) => p.elements || [])
    .find((el) => !el.id || !el.type || typeof el.x !== "number" || typeof el.y !== "number");
  checkTrue(`${label}: mọi phần tử có id/type/toạ độ số`, !badElement, JSON.stringify(badElement));
  return lesson;
};
const questionElements = (lesson) => (lesson?.pages || [])
  .flatMap((p) => p.elements || []).filter((el) => el.type === "question");

// ───────────────────────── Dữ liệu mẫu ─────────────────────────
const cleanLesson = {
  title: "Nước có những tính chất gì?",
  grade_level: "Lớp 4",
  subject: "Khoa học",
  estimated_time: "35 phút",
  objectives: ["Nhận biết được một số tính chất của nước", "Vận dụng tính chất của nước vào đời sống"],
  sections: [
    {
      heading: "1. Nước là chất lỏng đặc biệt",
      hook: "Đã bao giờ em rót nước từ chai sang ly chưa?",
      emoji: "💧",
      content: "Nước là chất lỏng không màu, không mùi, không vị. Nước không có hình dạng nhất định.",
      example: "Bước 1: Rót nước vào ly tròn, nước có hình của ly.\nBước 2: Đổ sang chai cao, nước đổi hình theo chai.\nVậy: nước không có hình dạng nhất định.",
      key_takeaway: "Nước là chất lỏng không màu, không mùi, không vị.",
    },
    {
      heading: "2. Nước chảy từ cao xuống thấp",
      hook: "Vì sao nước mưa chảy thành dòng trên mái nhà?",
      emoji: "🌧️",
      content: "Nước chảy từ nơi cao xuống nơi thấp và lan ra khắp mặt phẳng.",
      example: "Bước 1: Đổ nước lên đầu dốc của máng.\nBước 2: Nước tự chảy xuống cuối máng.\nVậy: nước chảy từ cao xuống thấp.",
      key_takeaway: "Nước chảy từ cao xuống thấp.",
    },
    {
      heading: "3. Nước hoà tan một số chất",
      hook: "Vì sao cho đường vào nước khuấy lên thì không thấy đường nữa?",
      emoji: "🥄",
      content: "Nước có thể hoà tan một số chất như muối, đường, nhưng không hoà tan được cát, sỏi.",
      example: "Bước 1: Cho một thìa đường vào cốc nước.\nBước 2: Khuấy đều, đường tan hết.\nVậy: nước hoà tan được đường.",
      key_takeaway: "Nước hoà tan được một số chất.",
    },
  ],
  summary: "Nước không màu, không mùi, không vị.\nNước chảy từ cao xuống thấp.\nNước hoà tan được một số chất.",
  quick_quiz: [
    {
      question: "Nước có màu, mùi, vị như thế nào?",
      options: ["Không màu, không mùi, không vị", "Có màu xanh, thơm", "Có vị ngọt", "Có màu trắng đục"],
      correct_answer: "Không màu, không mùi, không vị",
      explanation: "Nước tinh khiết không màu, không mùi, không vị.",
    },
    {
      question: "Nước chảy theo hướng nào?",
      options: ["Từ thấp lên cao", "Từ cao xuống thấp", "Chỉ chảy ngang", "Không chảy"],
      correct_answer: "Từ cao xuống thấp",
      explanation: "Nước luôn chảy từ nơi cao xuống nơi thấp.",
    },
  ],
};
const cleanJson = JSON.stringify(cleanLesson);

// ── (a) JSON sạch đúng schema ──
responder = () => ({ content: cleanJson });
let before = providerRequests.length;
let r = await genLesson(nextTeacher(), REQ);
const lessonA = checkLessonShape("(a) JSON sạch", r, { minSections: 3 });
check("(a) đúng 1 lượt gọi model", providerRequests.length - before, 1);
check("(a) số câu quiz giữ đủ", questionElements(lessonA).length, 2);

// ── (b) JSON bọc trong markdown fence ──
responder = () => ({ content: "```json\n" + cleanJson + "\n```" });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(b) markdown fence", r, { minSections: 3 });

// ── (c) JSON kèm câu chữ trước/sau ──
responder = () => ({ content: "Dưới đây là bài học tôi đã soạn cho bạn:\n" + cleanJson + "\nChúc bạn dạy tốt!" });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(c) chữ thừa quanh JSON", r, { minSections: 3 });

// ── (d) Thiếu trường phụ / section rỗng một phần ──
const partialLesson = JSON.parse(cleanJson);
delete partialLesson.objectives;
delete partialLesson.summary;
delete partialLesson.estimated_time;
delete partialLesson.sections[1].example;
delete partialLesson.sections[1].key_takeaway;
delete partialLesson.sections[1].hook;
partialLesson.sections.push({});
partialLesson.sections.push({ heading: "4. Phần chỉ có tiêu đề" });
responder = () => ({ content: JSON.stringify(partialLesson) });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(d) thiếu trường phụ", r, { minSections: 3 });

// ── (e) Sai kiểu nhẹ phía model + gradeLevel dạng chuỗi phía request ──
const quirkyLesson = JSON.parse(cleanJson);
quirkyLesson.objectives = [{ text: "Nhận biết tính chất của nước" }, { text: "Vận dụng vào đời sống" }];
quirkyLesson.quick_quiz = [
  { // đáp án đúng dạng SỐ (chỉ số 0-based) → phương án thứ hai
    question: "Nước chảy theo hướng nào?",
    options: ["Từ thấp lên cao", "Từ cao xuống thấp", "Chỉ chảy ngang", "Không chảy"],
    correct_answer: 1,
  },
  { // đáp án đúng dạng CHỮ CÁI → phương án B
    question: "Nước có màu, mùi, vị như thế nào?",
    options: ["Có màu xanh, thơm", "Không màu, không mùi, không vị", "Có vị ngọt", "Có màu trắng đục"],
    correct_answer: "B",
  },
  { // options dạng object {text}
    question: "Chất nào tan trong nước?",
    options: [{ text: "Đường" }, { text: "Cát" }, { text: "Sỏi" }, { text: "Đá" }],
    correct_answer: "Đường",
  },
  { // thiếu options → câu bị loại, bài vẫn sinh
    question: "Câu hỏng thiếu phương án",
    correct_answer: "Gì đó",
  },
];
responder = () => ({ content: JSON.stringify(quirkyLesson) });
r = await genLesson(nextTeacher(), { ...REQ, gradeLevel: "4" });
const lessonE = checkLessonShape("(e) sai kiểu nhẹ", r, { minSections: 3 });
const qsE = questionElements(lessonE);
check("(e) 3/4 câu quiz dùng được (1 câu thiếu options bị loại)", qsE.length, 3);
const correctTextOf = (q) => q?.props?.options?.find((o) => o.id === q.props.correctAnswer)?.content;
check("(e) đáp án dạng số → đúng phương án", correctTextOf(qsE[0]), "Từ cao xuống thấp");
check("(e) đáp án dạng chữ cái → đúng phương án", correctTextOf(qsE[1]), "Không màu, không mùi, không vị");
check("(e) options dạng object → đúng phương án", correctTextOf(qsE[2]), "Đường");

// ── (f1) Hỏng cú pháp nhẹ: thừa dấu phẩy cuối + xuống dòng THẬT trong chuỗi ──
const brokenSyntax = cleanJson
  .replace('"key_takeaway": "Nước là chất lỏng không màu, không mùi, không vị."',
    '"key_takeaway": "Nước là chất lỏng\nkhông màu, không mùi, không vị.",')
  .replace(/"quick_quiz": \[/, '"quick_quiz": [')
  .replace(/]\s*}$/, "],}");
responder = () => ({ content: brokenSyntax });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(f1) thừa phẩy + newline trong chuỗi", r, { minSections: 3 });

// ── (f2) JSON cụt giữa chừng (model hết token) ──
const cutAt = Math.floor(cleanJson.length * 0.62);
responder = () => ({ content: cleanJson.slice(0, cutAt) });
r = await genLesson(nextTeacher(), REQ);
const lessonF2 = checkLessonShape("(f2) JSON cụt", r, { minSections: 2 });

// ── (f3) Dấu nháy đơn + khoá không nháy ──
const singleQuoted = "{title: 'Bài học về nước', subject: 'Khoa học', "
  + "sections: [{heading: 'Phần 1: Nước quanh ta', content: 'Nước là chất lỏng trong suốt, có ở khắp nơi quanh ta.'}, "
  + "{heading: 'Phần 2: Tính chất của nước', content: 'Nước không màu, không mùi, không vị và chảy từ cao xuống thấp.'}], "
  + "quick_quiz: []}";
responder = () => ({ content: singleQuoted });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(f3) nháy đơn + khoá trần", r, { minSections: 2 });

// ── (f4) Bọc trong {"lesson": …} ──
responder = () => ({ content: JSON.stringify({ lesson: cleanLesson, ghi_chu: "bản nháp" }) });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(f4) bọc lesson", r, { minSections: 3 });

// ── (f5) Tên trường lệch: name/parts/title/body/quiz ──
const aliasLesson = {
  name: "Khám phá tính chất của nước",
  parts: [
    { title: "Phần một: Nước là gì?", body: "Nước là chất lỏng không màu, không mùi, không vị, có ở khắp nơi." },
    { title: "Phần hai: Nước chảy thế nào?", body: "Nước chảy từ nơi cao xuống nơi thấp và lan ra mọi phía." },
  ],
  quiz: [
    {
      question: "Nước chảy theo hướng nào?",
      options: ["Từ thấp lên cao", "Từ cao xuống thấp", "Chỉ chảy ngang", "Không chảy"],
      correct_answer: "Từ cao xuống thấp",
    },
  ],
};
responder = () => ({ content: JSON.stringify(aliasLesson) });
r = await genLesson(nextTeacher(), REQ);
const lessonF5 = checkLessonShape("(f5) tên trường lệch", r, { minSections: 2 });
check("(f5) tiêu đề lấy từ trường name", lessonF5?.title, "Khám phá tính chất của nước");
check("(f5) quiz lấy từ trường quiz", questionElements(lessonF5).length, 1);

// ── Hồi quy #133: JSON mode bị gateway bác (400) → fallback completion thường ──
responder = (body) => (body.response_format
  ? { status: 400, message: "json mode not supported" }
  : { content: "Đây là bài học:\n" + cleanJson });
r = await genLesson(nextTeacher(), REQ);
checkLessonShape("(hồi quy #133) JSON mode 400 → fallback", r, { minSections: 3 });

// ── Hồi quy prompt thật đã dùng: "Nước có những tính chất gì?" Khoa học lớp 4 ──
let lastUserPrompt = "";
responder = (body) => {
  lastUserPrompt = [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";
  return { content: cleanJson };
};
r = await genLesson(nextTeacher(), {
  prompt: "Nước có những tính chất gì?", subject: "Khoa học", gradeLevel: 4, length: "standard",
});
const lessonReg = checkLessonShape("(hồi quy) prompt thật lớp 4", r, { minSections: 3 });
checkTrue("(hồi quy) prompt của giáo viên tới được model",
  lastUserPrompt.includes("Nước có những tính chất gì?"), lastUserPrompt.slice(0, 200));
check("(hồi quy) tiêu đề bài giữ nguyên như bản sạch", lessonReg?.title, "Nước có những tính chất gì?");

// ── Lưu + đọc lại qua đường lessons THẬT (schema DB + validate của lessonService) ──
const saveAndRead = async (token, lesson, label) => {
  if (!lesson) {
    checkTrue(`${label}: có bài để lưu`, false, "lesson undefined — ca sinh bài trước đó đã lỗi");
    return;
  }
  const res = await fetch(`${base}/api/lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(lesson),
  });
  const body = await res.json().catch(() => null);
  checkTrue(`${label}: POST /api/lessons nhận bài (2xx)`, res.status >= 200 && res.status < 300,
    `status=${res.status} ${JSON.stringify(body?.msg || body).slice(0, 200)}`);
  const id = body?.data?.id;
  const got = await fetch(`${base}/api/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  const gotBody = await got.json().catch(() => null);
  check(`${label}: đọc lại đúng tiêu đề`, gotBody?.data?.title, lesson.title);
  check(`${label}: đọc lại đủ số trang`, gotBody?.data?.pages?.length, lesson.pages.length);
};
await saveAndRead(TEACHERS[0], lessonA, "(lưu) bản sạch (a)");
await saveAndRead(TEACHERS[0], lessonF2, "(lưu) bản cụt đã cứu (f2)");

// ── (g) Không phải JSON / không có nội dung bài → lỗi ĐÚNG bản chất, trần 3 lượt ──
responder = () => ({ content: "Xin lỗi, hiện tại tôi chưa soạn được bài này. Bạn hãy thử lại sau nhé!" });
before = providerRequests.length;
r = await genLesson(nextTeacher(), REQ);
check("(g) văn bản thường: HTTP 502", r.status, 502);
checkTrue("(g) thông báo nói đúng bản chất (không trích xuất được bài học)",
  String(r.body?.msg || "").includes("không trích xuất được bài học"), String(r.body?.msg));
check("(g) tổng lượt gọi model không vượt trần 3", providerRequests.length - before, 3);

// ── 429 của provider: ném ra ngay, không thử lại vô ích ──
responder = () => ({ status: 429, retryAfter: 120, message: "Rate limit reached" });
before = providerRequests.length;
r = await genLesson(nextTeacher(), REQ);
check("429: HTTP 429", r.status, 429);
check("429: errorCode AI_RATE_LIMITED", r.body?.errorCode, "AI_RATE_LIMITED");
check("429: chỉ tốn đúng 1 lượt gọi provider", providerRequests.length - before, 1);

server.close();
stub.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
