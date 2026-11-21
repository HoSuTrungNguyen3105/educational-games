// Test: DANH TÍNH + THÔNG TIN HỆ THỐNG THEO VAI TRÒ cho chat AI Bạn Học
// (Nguyên chốt 2026-11-21) + vá 429 của luồng tra cứu admin.
//   · Học sinh/giáo viên hỏi "Bạn là ai?" → trả lời danh tính AI Bạn Học
//     theo khuôn của Backend (không gọi model), KHÔNG lộ model/provider,
//     KHÔNG rơi vào câu từ chối phạm vi bài học của cấu hình Gia sư đã
//     lưu (test này CỐ Ý lưu cấu hình scopeOnly+refuseOffTopic như
//     production để tái hiện đúng ca lỗi).
//   · Học sinh/giáo viên hỏi về hệ thống (model, quyền của tôi, số tài
//     khoản) → từ chối đúng ngữ cảnh "chỉ dành cho quản trị viên", không
//     lộ dữ kiện. Câu ngoài phạm vi THƯỜNG vẫn giữ hành vi gia sư cũ.
//   · Admin hỏi danh tính → vẫn qua prompt quản trị (prompt CÓ model) và
//     KHÔNG tốn lượt chọn công cụ. Admin hỏi "có mấy tài khoản admin" /
//     "user admin có mấy người" → tra cứu user_counts chạy thật, prompt
//     nhận đúng số đếm từ DB; my_permissions + content_new không hồi quy.
//   · 429: gateway tôn trọng Retry-After ngắn (thử lại 1 lần) nên lượt
//     tra cứu admin không chết oan; 429 dai dẳng vẫn báo AI_RATE_LIMITED;
//     bộ giới hạn nội bộ theo người dùng (20 tin/60s) giữ nguyên.
// Chạy app Express THẬT trên Mongo in-memory + Groq STUB local (shape
// OpenAI, ghi lại request). KHÔNG dùng key thật, KHÔNG gọi api.groq.com.
//   node server/scripts/test-ai-identity-admin-scope.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-identity-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_identity_test";

// ───────────────────────── Stub Groq (shape OpenAI) ─────────────────────────
const STUB_ANSWER = "Câu trả lời mẫu từ stub.";
const chatRequests = [];
const stubBehavior = { failNext: 0, always429: false };

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
      if (stubBehavior.always429 || stubBehavior.failNext > 0) {
        if (stubBehavior.failNext > 0) stubBehavior.failNext -= 1;
        res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "1" });
        return res.end(JSON.stringify({ error: { message: "Rate limit reached", type: "tokens", code: "rate_limit_exceeded" } }));
      }
      const json = (obj) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(obj));
      };
      const usage = { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 };
      if (Array.isArray(body.tools) && body.tools.length > 0) {
        // Lượt CHỌN CÔNG CỤ: đóng vai model — chọn công cụ theo từ khoá
        // trong câu hỏi như mô tả công cụ hướng dẫn.
        const userText = [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";
        let toolName = null;
        if (userText.includes("tài khoản")) toolName = "user_counts";
        else if (userText.includes("quyền")) toolName = "my_permissions";
        else if (userText.includes("gì mới")) toolName = "content_new";
        const message = { role: "assistant", content: "" };
        if (toolName) {
          message.tool_calls = [{ id: "call-1", type: "function", function: { name: toolName, arguments: "{}" } }];
        }
        return json({ id: "chatcmpl-stub", object: "chat.completion", choices: [{ index: 0, message, finish_reason: "stop" }], usage });
      }
      return json({
        id: "chatcmpl-stub", object: "chat.completion",
        choices: [{ index: 0, message: { role: "assistant", content: STUB_ANSWER }, finish_reason: "stop" }],
        usage,
      });
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
const ctx = await import("../src/services/aiChatContext.js");
const adminQuery = await import("../src/services/aiAdminQueryService.js");
const { chatSystem, adminSystemPrompt } = await import("../src/services/aiPromptFactory.js");

await updateConfig({ ai: { enabled: true } });
// Cấu hình Gia sư ĐÃ LƯU với công tắc phạm vi BẬT — đúng trạng thái
// production lúc xảy ra ca lỗi (câu ngoài bài học bị từ chối theo khuôn).
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
// 2 admin / 1 giáo viên / 3 học sinh / 1 phụ huynh → tổng 7 tài khoản.
await db.getCollection("users").insertMany([
  mkUser("user-admin1", "Quản Trị Một", "admin"),
  mkUser("user-admin2", "Quản Trị Hai", "admin"),
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-hs1", "HS Một", "student", { ageCode: "kid-breeze" }),
  mkUser("user-hs2", "HS Hai", "student", { ageCode: "kid-river" }),
  mkUser("user-hs3", "HS Ba", "student", { ageCode: "kid-breeze" }),
  mkUser("user-ph1", "Phụ Huynh Một", "parent"),
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
await db.getCollection("games").insertMany([
  { id: "game-1", code: "GAME-1", name: "Game Mẫu", description: "mô tả", subject: "Toán", status: "published", questionsCount: 3, playersCount: 0, createdAt: NOW, updatedAt: NOW },
]);

const tok = (id, username, role, name) => signToken({ id, username, role, name });
const TOKENS = {
  admin: tok("user-admin1", "admin1", "admin", "Quản Trị Một"),
  teacher: tok("user-gv1", "gv1", "teacher", "Giáo Viên Một"),
  student: tok("user-hs1", "hs1", "student", "HS Một"),
  student3: tok("user-hs3", "hs3", "student", "HS Ba"),
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chat = async (token, message) => {
  const res = await fetch(`${base}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message }),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
};
const answerOf = (r) => r.body?.data?.answer || "";
/** System prompt của lượt gọi TRẢ LỜI (không phải lượt chọn công cụ) gần nhất. */
const lastAnswerSystem = () => {
  const calls = chatRequests.filter((b) => !Array.isArray(b.tools) || b.tools.length === 0);
  return calls[calls.length - 1]?.messages?.[0]?.content || "";
};
const toolCallCount = () => chatRequests.filter((b) => Array.isArray(b.tools) && b.tools.length > 0).length;

// ── 0. Hàm thuần: nhận diện danh tính / hệ thống / intent quản trị ──
checkTrue("nhận diện: 'Bạn là ai?'", ctx.detectIdentityQuestion("Bạn là ai?"));
checkTrue("nhận diện: 'Bạn tên gì?'", ctx.detectIdentityQuestion("Bạn tên gì?"));
checkTrue("nhận diện: 'Who are you?'", ctx.detectIdentityQuestion("Who are you?"));
checkTrue("không bắt nhầm: 'Bạn An là ai?' (người thứ ba)", !ctx.detectIdentityQuestion("Bạn An là ai?"));
checkTrue("không bắt nhầm: câu hỏi bài học", !ctx.detectIdentityQuestion("Nước có những tính chất gì?"));
checkTrue("hệ thống: 'Bạn đang dùng model gì?'", ctx.detectSystemQuestion("Bạn đang dùng model gì?"));
checkTrue("hệ thống: 'Tôi có mấy quyền?'", ctx.detectSystemQuestion("Tôi có mấy quyền?"));
checkTrue("hệ thống: 'Hệ thống có mấy tài khoản admin?'", ctx.detectSystemQuestion("Hệ thống có mấy tài khoản admin?"));
checkTrue("không bắt nhầm GDCD: 'Quyền trẻ em là gì?'", !ctx.detectSystemQuestion("Quyền trẻ em là gì?"));
checkTrue("không bắt nhầm Khoa học: 'Hệ thống tiêu hoá gồm những bộ phận nào?'", !ctx.detectSystemQuestion("Hệ thống tiêu hoá gồm những bộ phận nào?"));
check("intent admin: 'Hệ thống có mấy tài khoản admin?' → user_counts",
  adminQuery.detectAdminQuery("Hệ thống có mấy tài khoản admin?")?.type, "user_counts");
check("intent admin: 'User admin có mấy người?' → user_counts",
  adminQuery.detectAdminQuery("User admin có mấy người?")?.type, "user_counts");
check("intent admin: 'Có bao nhiêu tài khoản giáo viên?' → user_counts",
  adminQuery.detectAdminQuery("Có bao nhiêu tài khoản giáo viên?")?.type, "user_counts");
check("intent admin: 'Tôi có những quyền gì?' → my_permissions (không hồi quy)",
  adminQuery.detectAdminQuery("Tôi có những quyền gì?")?.type, "my_permissions");
check("intent admin: 'Tổng quan hệ thống' → overview (không hồi quy)",
  adminQuery.detectAdminQuery("Cho tôi xem tổng quan hệ thống")?.type, "overview");
check("intent admin: 'Tháng này có bao nhiêu học sinh mới?' → overview như cũ (đường từ khoá)",
  adminQuery.detectAdminQuery("Tháng này có bao nhiêu học sinh mới?")?.type, "overview");
checkTrue("prompt học sinh/giáo viên KHÔNG chứa tên model dù ctx có modelName",
  !chatSystem("X", null, null, { modelName: "openai/gpt-oss-20b", modelProvider: "Groq" }).includes("gpt-oss-20b"));
checkTrue("prompt admin CÓ chứa tên model",
  adminSystemPrompt("X", null, null, { modelName: "openai/gpt-oss-20b", modelProvider: "Groq" }).includes("openai/gpt-oss-20b"));

// ── 1. Học sinh: danh tính + hệ thống bị chặn ở Backend ──
let before = chatRequests.length;
let r = await chat(TOKENS.student, "Bạn là ai?");
check("HS danh tính: HTTP 200", r.status, 200);
checkTrue("HS danh tính: trả lời là AI Bạn Học", answerOf(r).includes("AI Bạn Học"), answerOf(r));
checkTrue("HS danh tính: KHÔNG lộ model/provider",
  !/gpt-oss|groq|ollama/i.test(answerOf(r)), answerOf(r));
checkTrue("HS danh tính: KHÔNG rơi vào từ chối phạm vi bài học",
  !answerOf(r).includes("phạm vi các đoạn bài học"), answerOf(r));
check("HS danh tính: KHÔNG gọi model (trả theo khuôn)", chatRequests.length, before);

before = chatRequests.length;
r = await chat(TOKENS.student, "Bạn đang dùng model gì?");
check("HS model: HTTP 200", r.status, 200);
checkTrue("HS model: từ chối đúng ngữ cảnh admin-only",
  answerOf(r).includes("chỉ dành cho quản trị viên"), answerOf(r));
checkTrue("HS model: KHÔNG lộ tên model", !/gpt-oss/i.test(answerOf(r)), answerOf(r));
check("HS model: KHÔNG gọi model", chatRequests.length, before);

r = await chat(TOKENS.student, "Tôi có mấy quyền?");
checkTrue("HS quyền: từ chối admin-only, không liệt kê quyền",
  answerOf(r).includes("chỉ dành cho quản trị viên") && !answerOf(r).includes("Tổng số quyền"),
  answerOf(r));

r = await chat(TOKENS.student, "Hệ thống có mấy tài khoản admin?");
checkTrue("HS tài khoản: từ chối admin-only, không lộ số đếm",
  answerOf(r).includes("chỉ dành cho quản trị viên") && !answerOf(r).includes("tài khoản."),
  answerOf(r));

// ── 2. Học sinh: học tập bình thường giữ nguyên hành vi ──
r = await chat(TOKENS.student, "Nước có những tính chất gì?");
check("HS bài học: HTTP 200", r.status, 200);
check("HS bài học: model trả lời qua stub", answerOf(r), STUB_ANSWER);
checkTrue("HS bài học: có nguồn bài học kèm theo",
  Array.isArray(r.body?.data?.sources) && r.body.data.sources.length >= 1,
  JSON.stringify(r.body?.data));

r = await chat(TOKENS.student, "Kể cho con nghe về khủng long");
checkTrue("HS ngoài phạm vi thường: vẫn là từ chối phạm vi của cấu hình Gia sư (hành vi cũ)",
  answerOf(r).includes("phạm vi các đoạn bài học đã xuất bản"), answerOf(r));

// ── 3. Giáo viên: cùng ranh giới như học sinh ──
r = await chat(TOKENS.teacher, "Bạn là ai?");
checkTrue("GV danh tính: AI Bạn Học, không lộ model",
  answerOf(r).includes("AI Bạn Học") && !/gpt-oss|groq/i.test(answerOf(r)), answerOf(r));
r = await chat(TOKENS.teacher, "Tôi có mấy quyền?");
checkTrue("GV quyền: từ chối admin-only",
  answerOf(r).includes("chỉ dành cho quản trị viên"), answerOf(r));

// ── 4. Admin: danh tính có model + tra cứu thật ──
const toolsBefore = toolCallCount();
r = await chat(TOKENS.admin, "Bạn là ai?");
check("Admin danh tính: HTTP 200", r.status, 200);
check("Admin danh tính: model trả lời qua stub", answerOf(r), STUB_ANSWER);
check("Admin danh tính: KHÔNG tốn lượt chọn công cụ", toolCallCount(), toolsBefore);
checkTrue("Admin danh tính: prompt quản trị CÓ model đang chạy",
  lastAnswerSystem().includes("openai/gpt-oss-20b"), lastAnswerSystem().slice(0, 300));

r = await chat(TOKENS.admin, "Hệ thống có mấy tài khoản admin?");
check("Admin user_counts: HTTP 200", r.status, 200);
checkTrue("Admin user_counts: prompt nhận đúng số đếm thật (2 admin / tổng 7)",
  lastAnswerSystem().includes("Quản trị viên: 2 tài khoản")
  && lastAnswerSystem().includes("Tổng số tài khoản: 7 tài khoản"),
  lastAnswerSystem().slice(-800));

r = await chat(TOKENS.admin, "User admin có mấy người?");
checkTrue("Admin user_counts (biến thể): prompt vẫn nhận số đếm thật",
  lastAnswerSystem().includes("Quản trị viên: 2 tài khoản"), lastAnswerSystem().slice(-800));

r = await chat(TOKENS.admin, "Tôi có mấy quyền?");
checkTrue("Admin my_permissions: prompt nhận kết quả tra cứu quyền của chính admin",
  lastAnswerSystem().includes("quyền của chính người đang hỏi")
  && lastAnswerSystem().includes("Tổng số quyền đang có hiệu lực"),
  lastAnswerSystem().slice(-800));

r = await chat(TOKENS.admin, "Tháng này trường mình có gì mới không?");
checkTrue("Admin content_new: prompt nhận nội dung mới nhất (không hồi quy)",
  lastAnswerSystem().includes("nội dung mới nhất"), lastAnswerSystem().slice(-800));

await sleep(400);
const logs = await db.getCollection("ai_chat_logs")
  .find({ userId: "user-admin1" }).sort({ createdAt: -1 }).limit(6).toArray();
checkTrue("ai_chat_logs: lượt user_counts ghi kind=admin_query + queryType=user_counts",
  logs.some((l) => l.kind === "admin_query" && String(l.queryType || "").includes("user_counts")),
  JSON.stringify(logs.map((l) => [l.kind, l.queryType])));

// ── 5. Vá 429: Retry-After ngắn được tôn trọng, 429 dai dẳng vẫn báo ──
stubBehavior.failNext = 1; // lượt gọi provider đầu tiên của tin này trả 429 (chờ 1s)
const reqBeforeFlaky = chatRequests.length;
r = await chat(TOKENS.admin, "Hệ thống có mấy tài khoản admin?");
check("Admin tra cứu gặp 429 thoáng qua: vẫn HTTP 200 sau khi thử lại", r.status, 200);
checkTrue("Gateway đã thử lại sau 429 (số request tăng thêm ≥ 3: 429 + chọn công cụ + trả lời)",
  chatRequests.length - reqBeforeFlaky >= 3, String(chatRequests.length - reqBeforeFlaky));
checkTrue("Admin tra cứu sau thử lại: prompt vẫn nhận số đếm thật",
  lastAnswerSystem().includes("Quản trị viên: 2 tài khoản"), lastAnswerSystem().slice(-800));

stubBehavior.always429 = true;
r = await chat(TOKENS.teacher, "Giải thích cho tôi về tính chất của nước");
check("429 dai dẳng: HTTP 429", r.status, 429);
check("429 dai dẳng: errorCode AI_RATE_LIMITED giữ nguyên", r.body?.errorCode, "AI_RATE_LIMITED");
stubBehavior.always429 = false;

// ── 6. Bộ giới hạn nội bộ theo người dùng giữ nguyên (20 tin/60s) ──
let lastStatus = 0;
let lastMsg = "";
for (let i = 1; i <= 21; i++) {
  const rr = await chat(TOKENS.student3, `Câu hỏi học tập số ${i}`);
  lastStatus = rr.status;
  lastMsg = rr.body?.msg || "";
}
check("HS gửi tin thứ 21 trong 60s: HTTP 429 nội bộ", lastStatus, 429);
checkTrue("Thông điệp giới hạn nội bộ giữ nguyên", lastMsg.includes("hỏi AI quá nhiều"), lastMsg);

server.close();
stub.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
