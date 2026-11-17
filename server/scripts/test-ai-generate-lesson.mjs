// Test Tạo bài học AI (POST /api/ai/generate-lesson — AI_LESSON_CREATOR.md):
// chỉ teacher/admin gọi được; model trả JSON theo schema ĐẦU RA CỦA ĐẶC TẢ
// (objectives là mảng, correct_answer là VĂN BẢN đáp án) → Backend validate
// + chuyển về đúng schema `lessons` THẬT (objectives là chuỗi, quiz dùng id
// đáp án) → trả BẢN NHÁP CHƯA LƯU. Endpoint không ghi DB; bản nháp phải đi
// qua được validator thật (createLesson + publishLesson) của lessonService.
// Cùng mẫu test-ai-playground: Mongo in-memory + stub fetch tới
// https://ollama.com, nội dung JSON của "model" đổi được theo từng ca.
// KHÔNG dùng key thật, KHÔNG gọi mạng ra ngoài.
//   node server/scripts/test-ai-generate-lesson.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-generate-lesson-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_generate_lesson_test";

process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

// ── Stub "model": trả nội dung do test đặt trong `stubContent` ──
const VALID_LESSON = {
  title: "Phân số: Tử số và mẫu số",
  grade_level: "Lớp 10", // AI echo SAI có chủ đích — Backend phải dùng lựa chọn của giáo viên
  subject: "Tin học", // AI echo SAI có chủ đích — như trên
  estimated_time: "45 phút",
  objectives: ["Nhận biết tử số và mẫu số", "Đọc và viết đúng phân số đơn giản"],
  sections: [
    {
      heading: "1. Phân số là gì?",
      content: "Phân số dùng để chỉ một phần của một đơn vị được chia thành các phần bằng nhau.",
      example: "Chia một chiếc bánh thành 4 phần bằng nhau, lấy 1 phần ta được 1/4 chiếc bánh.",
      key_takeaway: "Phân số gồm tử số và mẫu số, ngăn cách bởi dấu gạch ngang.",
    },
    {
      heading: "2. Tử số và mẫu số",
      content: "Mẫu số viết dưới dấu gạch ngang, cho biết đơn vị được chia thành bao nhiêu phần bằng nhau. Tử số viết trên dấu gạch ngang, cho biết số phần được lấy ra.",
      example: "Trong phân số 3/5, mẫu số là 5 và tử số là 3.",
      key_takeaway: "Mẫu số ở dưới, tử số ở trên.",
    },
  ],
  summary: "Phân số gồm tử số và mẫu số.\nMẫu số cho biết số phần bằng nhau của đơn vị.\nTử số cho biết số phần được lấy.",
  quick_quiz: [
    {
      question: "Trong phân số 3/5, số 5 là gì?",
      options: ["Tử số", "Mẫu số", "Tổng số", "Hiệu số"],
      correct_answer: "Mẫu số",
      explanation: "Số viết dưới dấu gạch ngang là mẫu số.",
    },
    {
      question: "Phân số nào chỉ phần đã tô màu: 1 phần trong 4 phần bằng nhau?",
      options: ["1/4", "4/1", "1/2", "3/4"],
      correct_answer: "1/4",
      explanation: "Lấy 1 phần trong 4 phần bằng nhau là 1/4.",
    },
    {
      // correct_answer KHÔNG khớp option nào → câu này phải bị loại.
      question: "Câu hỏi có đáp án đúng không khớp phương án?",
      options: ["Đáp án một", "Đáp án hai"],
      correct_answer: "Đáp án không tồn tại",
      explanation: "Câu này phải bị loại ở Backend.",
    },
  ],
};
let stubContent = JSON.stringify(VALID_LESSON);

const realFetch = globalThis.fetch;
const chatRequests = [];
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (u.startsWith("https://ollama.com/")) {
    const json = (obj) => new Response(JSON.stringify(obj), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
    if (u.endsWith("/api/tags")) return json({ models: [{ name: "gpt-oss:20b" }] });
    if (u.endsWith("/api/chat")) {
      const body = JSON.parse(options.body || "{}");
      chatRequests.push(body);
      return json({ message: { role: "assistant", content: stubContent }, done: true });
    }
  }
  return realFetch(url, options);
};

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");
const lessonService = await import("../src/services/lessonService.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const student = signToken({ id: "user-hs-gl", username: "hsgl", role: "student", name: "Học Sinh GL" });
const teacher = signToken({ id: "user-gv-gl", username: "gvgl", role: "teacher", name: "Giáo Viên GL" });

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
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};
const gen = (token, payload) => req("POST", "/api/ai/generate-lesson", token, payload);
const GOOD_INPUT = { prompt: "Soạn bài phân số cho học sinh mới làm quen, nhiều ví dụ bánh kẹo", subject: "Toán", gradeLevel: 4, length: "standard" };

// ── 1. Phân quyền: chưa đăng nhập 401, học sinh 403, không gọi model ──
const noAuth = await gen(null, GOOD_INPUT);
check("chưa đăng nhập → 401", noAuth.status, 401);
const stu = await gen(student, GOOD_INPUT);
check("học sinh → 403", stu.status, 403);
check("bị chặn trước khi gọi model", chatRequests.length, 0);

// ── 2. Validate input: prompt rỗng 400, thiếu môn 400, lớp ngoài 1–5 → 400 ──
const emptyPrompt = await gen(teacher, { ...GOOD_INPUT, prompt: "   " });
check("prompt rỗng → 400", emptyPrompt.status, 400);
const noSubject = await gen(teacher, { ...GOOD_INPUT, subject: "" });
check("thiếu môn học → 400", noSubject.status, 400);
const badGrade = await gen(teacher, { ...GOOD_INPUT, gradeLevel: 7 });
check("lớp 7 (ngoài 1–5) → 400", badGrade.status, 400);
check("input lỗi không gọi model", chatRequests.length, 0);

// ── 3. Teacher + JSON hợp lệ → bản nháp đúng schema THẬT ──
const r1 = await gen(teacher, GOOD_INPUT);
check("teacher gọi → 200", r1.status, 200);
const lesson = r1.body?.data?.lesson || {};
const meta = r1.body?.data?.meta || {};
check("title lấy từ AI", lesson.title, VALID_LESSON.title);
check("subject lấy từ REQUEST, không tin echo của AI", lesson.subject, "Toán");
check("grade lấy từ REQUEST dạng số", lesson.grade, 4);
check("status là draft", lesson.status, "draft");
check("estimated_time gộp vào description", lesson.description, "Thời lượng dự kiến: 45 phút");
checkTrue("objectives là CHUỖI (schema thật)", typeof lesson.objectives === "string", typeof lesson.objectives);
check("objectives nối mỗi mục tiêu một dòng", lesson.objectives, "Nhận biết tử số và mẫu số\nĐọc và viết đúng phân số đơn giản");
check("meta.length chuẩn hoá", meta.length, "standard");
check("meta.sections", meta.sections, 2);
check("meta: 2 câu quiz dùng được", meta.generatedQuestions, 2);
check("meta: 1 câu bị loại vì correct_answer không khớp", meta.droppedQuestions, 1);
check("meta: tổng câu AI trả", meta.quizReturned, 3);

// Cấu trúc trang: 2 trang section + 1 trang tổng kết + 1 trang quiz (2 câu).
check("tổng số trang", lesson.pages?.length, 4);
const [sec1, sec2, summaryPage, quizPage] = lesson.pages || [];
check("trang section 1: phần tử theo thứ tự title/text/text/note",
  (sec1?.elements || []).map((e) => e.type), ["title", "text", "text", "note"]);
check("heading → phần tử title", sec1?.elements?.[0]?.props?.text, "1. Phân số là gì?");
check("key_takeaway → phần tử note", sec1?.elements?.[3]?.props?.text, VALID_LESSON.sections[0].key_takeaway);
check("trang section 2 có đủ phần tử", (sec2?.elements || []).length, 4);
check("summary → trang riêng 'Tổng kết bài học'", summaryPage?.title, "Tổng kết bài học");
checkTrue("trang tổng kết chứa nội dung summary", String(summaryPage?.elements?.[1]?.props?.text || "").includes("Mẫu số cho biết"));
check("trang quiz có tiêu đề Kiểm tra nhanh", quizPage?.title, "Kiểm tra nhanh");

// Hình học: mọi phần tử nằm trọn trong canvas 1280×720, id duy nhất toàn bài.
const allElements = (lesson.pages || []).flatMap((p) => p.elements || []);
checkTrue("mọi phần tử nằm trong canvas 1280×720",
  allElements.every((e) => e.x >= 0 && e.y >= 0 && e.x + e.w <= 1280 && e.y + e.h <= 720),
  JSON.stringify(allElements.map((e) => [e.x, e.y, e.w, e.h])));
check("id phần tử duy nhất toàn bài", new Set(allElements.map((e) => e.id)).size, allElements.length);
checkTrue("id trang duy nhất", new Set((lesson.pages || []).map((p) => p.id)).size === lesson.pages.length);

// Câu hỏi: correct_answer (văn bản) → id của option khớp.
const questions = (quizPage?.elements || []).filter((e) => e.type === "question");
check("trang quiz chứa đúng 2 câu hợp lệ", questions.length, 2);
const q1 = questions[0]?.props || {};
check("qtype trắc nghiệm 1 đáp án", q1.qtype, "single");
check("options giữ nguyên 4 phương án", (q1.options || []).map((o) => o.content), VALID_LESSON.quick_quiz[0].options);
const correctOpt = (q1.options || []).find((o) => o.id === q1.correctAnswer);
check("correctAnswer là ID của option 'Mẫu số'", correctOpt?.content, "Mẫu số");
checkTrue("mọi option có id riêng", (q1.options || []).every((o) => typeof o.id === "string" && o.id.length > 0));
check("explanation đi vào props", q1.explanation, VALID_LESSON.quick_quiz[0].explanation);
check("points mặc định 10", q1.points, 10);

// Prompt gửi model: JSON mode + chứa môn/lớp/prompt của giáo viên.
const sentBody = chatRequests[chatRequests.length - 1] || {};
check("gateway được gọi ở JSON mode", sentBody.format, "json");
const sentUser = sentBody.messages?.find((m) => m.role === "user")?.content || "";
checkTrue("prompt chứa môn học thật", sentUser.includes("Toán"));
checkTrue("prompt chứa cấp học thật", sentUser.includes("Lớp 4"));
checkTrue("prompt chứa yêu cầu của giáo viên", sentUser.includes("nhiều ví dụ bánh kẹo"));
const sentSystem = sentBody.messages?.find((m) => m.role === "system")?.content || "";
checkTrue("system prompt theo đặc tả (chuyên gia thiết kế chương trình)", sentSystem.includes("chuyên gia thiết kế chương trình giáo dục"));

// ── 4. Endpoint KHÔNG tự lưu DB; bản nháp qua được validator THẬT ──
check("chưa có bài học nào trong DB sau generate", await db.getCollection("lessons").countDocuments({}), 0);
const created = await lessonService.createLesson("user-gv-gl", lesson);
checkTrue("createLesson nhận bản nháp (đủ required của schema thật)", typeof created?.id === "string" && created.id.length > 0);
check("bài đã lưu giữ nguyên số trang", created?.pages?.length, 4);
check("bài đã lưu objectives vẫn là chuỗi", typeof created?.objectives, "string");
const published = await lessonService.publishLesson(created.id, { id: "user-gv-gl", role: "teacher" });
check("publishLesson đạt (quiz hợp lệ để xuất bản)", published?.status, "published");

// ── 5. Độ dài: nhãn tiếng Việt "chuyên sâu" → enum deep ──
const rDeep = await gen(teacher, { ...GOOD_INPUT, length: "chuyên sâu" });
check("length 'chuyên sâu' → 200", rDeep.status, 200);
check("meta.length = deep", rDeep.body?.data?.meta?.length, "deep");

// ── 6. JSON hỏng ở cả 2 lượt → lỗi thân thiện 502, không tạo dữ liệu ──
const beforeBroken = await db.getCollection("lessons").countDocuments({});
const chatBeforeBroken = chatRequests.length;
stubContent = "đây không phải JSON {{{";
const rBroken = await gen(teacher, GOOD_INPUT);
check("JSON hỏng → 502", rBroken.status, 502);
checkTrue("thông điệp lỗi thân thiện về định dạng", String(rBroken.body?.msg || "").includes("định dạng bài học"), rBroken.body?.msg);
check("đã thử lại đúng 1 lượt (2 lần gọi model)", chatRequests.length - chatBeforeBroken, 2);
check("không tạo thêm dữ liệu trong DB", await db.getCollection("lessons").countDocuments({}), beforeBroken);
check("response lỗi không kèm bản nháp rác", rBroken.body?.data ?? null, null);

// ── 7. JSON thiếu trường bắt buộc (không có sections) → 502 thân thiện ──
stubContent = JSON.stringify({ title: "Bài thiếu nội dung", objectives: [], quick_quiz: [] });
const rNoSections = await gen(teacher, GOOD_INPUT);
check("thiếu sections → 502", rNoSections.status, 502);
checkTrue("thông điệp nói rõ thiếu cấu trúc", String(rNoSections.body?.msg || "").includes("cấu trúc"), rNoSections.body?.msg);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
server.close();
await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
