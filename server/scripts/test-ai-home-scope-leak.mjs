// Test: KHOÁ PHẠM VI BÀI HỌC KHÔNG ĐƯỢC RÒ RA CHAT CHUNG (sửa 2026-11-23).
// Ca production: cấu hình Gia sư ĐÃ LƯU ở khoá dự phòng (default | mọi
// môn) bật scopeOnly + refuseOffTopic → học sinh mở AI Bạn Học ở TRANG
// CHỦ hỏi Toán ("12 + 8 bằng bao nhiêu?") bị từ chối theo khuôn "ngoài
// phạm vi bài học" vì truy xuất từ khoá không khớp bài Khoa học nào.
// Gốc lỗi: resolveEffectiveTutorConfig thắng theo chuỗi dự phòng cho
// MỌI lượt chat, còn cổng từ chối trong directChat không phân biệt
// lượt chat có ngữ cảnh bài học hay không.
// Hành vi ĐÚNG sau sửa:
//   · Chat CHUNG (client KHÔNG gửi subject/topic — AiChatWidget ở
//     trang chủ): KHÔNG khoá phạm vi — cả cổng từ chối ở Backend lẫn
//     hai chỉ thị phạm vi trong prompt đều tắt; model trả lời bình
//     thường. Phần còn lại của cấu hình đã lưu vẫn áp như cũ.
//   · Chat CÓ ngữ cảnh bài học rõ ràng (client gửi subject/topic):
//     khoá phạm vi giữ nguyên thiết kế #126 — hỏi ngoài bài mà không
//     truy xuất được ngữ cảnh → từ chối theo khuôn, KHÔNG gọi model;
//     hỏi trong bài → trả lời, prompt vẫn có chỉ thị phạm vi ĐANG BẬT.
//   · Danh tính "Bạn là ai?" (#159) không đổi: trả theo khuôn, không
//     gọi model, không lộ model.
// Chạy app Express THẬT trên Mongo in-memory + Groq STUB local (shape
// OpenAI, ghi lại request). KHÔNG dùng key thật, KHÔNG gọi api.groq.com.
//   node server/scripts/test-ai-home-scope-leak.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-home-scope-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_home_scope_test";

// ───────────────────────── Stub Groq (shape OpenAI) ─────────────────────────
const STUB_ANSWER = "Câu trả lời mẫu từ stub.";
const chatRequests = [];
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
      chatRequests.push(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        id: "chatcmpl-stub", object: "chat.completion",
        choices: [{ index: 0, message: { role: "assistant", content: STUB_ANSWER }, finish_reason: "stop" }],
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
const { saveTutorConfig } = await import("../src/services/aiTutorConfigService.js");

await updateConfig({ ai: { enabled: true } });
// Cấu hình Gia sư ĐÃ LƯU ở khoá dự phòng (default | mọi môn) với hai
// công tắc phạm vi BẬT — đúng trạng thái production lúc xảy ra ca lỗi.
await saveTutorConfig("default", "", {
  systemPrompt: "", temperature: 0.2, scopeOnly: true, requireCitation: false, refuseOffTopic: true,
});

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const OLD = "2026-01-05T00:00:00.000Z";
const NOW = new Date().toISOString();
const mkUser = (id, name, role, extra = {}) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x", createdAt: OLD, ...extra,
});
await db.getCollection("users").insertMany([
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-hs1", "HS Một", "student", { ageCode: "kid-breeze" }),
]);
await db.getCollection("lessons").insertMany([
  {
    id: "les-water", ownerId: "user-gv1", title: "Nước có những tính chất gì?", subject: "Khoa học",
    grade: 4, status: "published", publishedAt: NOW, createdAt: OLD, updatedAt: OLD,
    pages: [{
      id: "pg-1",
      elements: [{
        id: "el-1", type: "text",
        props: { text: "Nước là chất lỏng không màu, không mùi, không vị. Tính chất của nước: nước có thể hoà tan nhiều chất và chảy từ chỗ cao xuống chỗ thấp." },
      }],
    }],
  },
]);

const tok = (id, username, role, name) => signToken({ id, username, role, name });
const TOKENS = {
  teacher: tok("user-gv1", "gv1", "teacher", "Giáo Viên Một"),
  student: tok("user-hs1", "hs1", "student", "HS Một"),
};

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

const chat = async (token, payload) => {
  const res = await fetch(`${base}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
};
const answerOf = (r) => r.body?.data?.answer || "";
const SCOPE_REFUSAL_MARK = "phạm vi các đoạn bài học đã xuất bản";
const lastAnswerSystem = () => chatRequests[chatRequests.length - 1]?.messages?.[0]?.content || "";

// ── 1. Chat CHUNG (trang chủ, không subject/topic): hỏi Toán → trả lời ──
let before = chatRequests.length;
let r = await chat(TOKENS.student, { message: "12 + 8 bằng bao nhiêu?" });
check("HS chat chung hỏi Toán: HTTP 200", r.status, 200);
check("HS chat chung hỏi Toán: model trả lời (không bị khoá phạm vi)", answerOf(r), STUB_ANSWER);
checkTrue("HS chat chung hỏi Toán: KHÔNG chứa câu từ chối phạm vi",
  !answerOf(r).includes(SCOPE_REFUSAL_MARK), answerOf(r));
checkTrue("HS chat chung hỏi Toán: model ĐƯỢC gọi", chatRequests.length > before);

// ── 2. Chat CHUNG: hỏi Khoa học khớp bài → trả lời + nguồn, prompt KHÔNG có chỉ thị khoá phạm vi ──
r = await chat(TOKENS.student, { message: "Nước có những tính chất gì?" });
check("HS chat chung hỏi Khoa học: HTTP 200", r.status, 200);
check("HS chat chung hỏi Khoa học: model trả lời qua stub", answerOf(r), STUB_ANSWER);
checkTrue("HS chat chung hỏi Khoa học: có nguồn bài học kèm theo",
  Array.isArray(r.body?.data?.sources) && r.body.data.sources.length >= 1,
  JSON.stringify(r.body?.data));
checkTrue("HS chat chung: prompt KHÔNG chứa chỉ thị 'chỉ trả lời trong phạm vi bài' ĐANG BẬT",
  !lastAnswerSystem().includes("ĐANG BẬT: chỉ trả lời dựa trên"),
  lastAnswerSystem().slice(-600));

// ── 3. Chat CÓ ngữ cảnh bài học (subject) + hỏi NGOÀI bài → từ chối theo khuôn, không gọi model ──
before = chatRequests.length;
r = await chat(TOKENS.student, { message: "12 + 8 bằng bao nhiêu?", subject: "Khoa học" });
check("HS trong bài hỏi ngoài bài: HTTP 200", r.status, 200);
checkTrue("HS trong bài hỏi ngoài bài: từ chối phạm vi theo khuôn (thiết kế #126 giữ nguyên)",
  answerOf(r).includes(SCOPE_REFUSAL_MARK) && answerOf(r).includes("chỉ trả lời trong phạm vi bài học hiện tại"),
  answerOf(r));
check("HS trong bài hỏi ngoài bài: KHÔNG gọi model", chatRequests.length, before);

// ── 4. Chat CÓ ngữ cảnh bài học + hỏi TRONG bài → trả lời, prompt CÓ chỉ thị khoá phạm vi ──
r = await chat(TOKENS.student, { message: "Nước có những tính chất gì?", subject: "Khoa học" });
check("HS trong bài hỏi đúng bài: HTTP 200", r.status, 200);
check("HS trong bài hỏi đúng bài: model trả lời qua stub", answerOf(r), STUB_ANSWER);
checkTrue("HS trong bài: prompt CÓ chỉ thị 'chỉ trả lời trong phạm vi bài' ĐANG BẬT",
  lastAnswerSystem().includes("ĐANG BẬT: chỉ trả lời dựa trên"),
  lastAnswerSystem().slice(-600));

// ── 5. Danh tính (#159) không đổi: trả theo khuôn, không gọi model ──
before = chatRequests.length;
r = await chat(TOKENS.student, { message: "Bạn là ai?" });
checkTrue("HS danh tính: trả lời là AI Bạn Học, không lộ model",
  answerOf(r).includes("AI Bạn Học") && !/gpt-oss|groq|ollama/i.test(answerOf(r)), answerOf(r));
check("HS danh tính: KHÔNG gọi model", chatRequests.length, before);

// ── 6. Giáo viên chat chung cũng không bị khoá phạm vi ──
r = await chat(TOKENS.teacher, { message: "12 + 8 bằng bao nhiêu?" });
check("GV chat chung hỏi Toán: model trả lời (không bị khoá phạm vi)", answerOf(r), STUB_ANSWER);

server.close();
stub.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
