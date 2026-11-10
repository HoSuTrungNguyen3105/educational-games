// Test đường GROQ TRỰC TIẾP + CHỌN MODEL TỪ CÀI ĐẶT (aiModelConfig):
// bản sao của test-ai-groq-direct cộng mục 7 — admin ghi ai.model qua
// updateConfig (đúng đường trang Cài đặt dùng) thì lượt gọi kế tiếp phải
// dùng model mới ngay, health phải báo model hiệu lực. Gốc: test đường
// GROQ TRỰC TIẾP (aiGroqGateway + aiDirectService dùng chung
// nghiệp vụ + luật chọn nhà cung cấp) bằng một Groq STUB local ghi lại
// request theo đúng shape OpenAI. KHÔNG dùng key thật, KHÔNG gọi
// api.groq.com: key ở đây là chuỗi giả "test-groq-key", endpoint là
// 127.0.0.1. Vì chọn Groq là TƯỜNG MINH qua AI_PROVIDER=groq nên stub
// localhost vẫn kích hoạt đúng đường này (khác luật Ollama vốn chặn
// localhost đi cloud).
//   node server/scripts/test-ai-groq-direct.mjs
import { createServer } from "node:http";
import { MongoMemoryServer } from "mongodb-memory-server";

// ───────────────────────── Stub Groq (shape OpenAI) ─────────────────────────
let mode = "ok";
let chatRequests = [];
let modelsList = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "llama-3.3-70b-versatile"];

const QUIZ_CONTENT = JSON.stringify({
  questions: [
    { content: "1 + 1 = ?", options: ["1", "2", "3", "4"], correctAnswer: "2", points: 100, timeLimit: 20, explanation: "1 + 1 = 2" },
    { content: "Câu hỏng chỉ có 3 phương án", options: ["A", "B", "C"], correctAnswer: "A" },
    { content: "3 + 4 = ?", options: ["6", "7", "8", "9"], correctAnswer: "7" },
  ],
});

function stubContent(body) {
  const userText = [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";
  if (body.response_format?.type === "json_object") {
    if (userText.includes("Hãy sinh đúng")) return QUIZ_CONTENT;
    if (userText.includes("số liệu tổng hợp")) return "đây không phải JSON {{{";
    return "{}";
  }
  return "Chào bạn! Mình là AI Bạn Học.";
}

const stub = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => { raw += c; });
  req.on("end", () => {
    if (req.url === "/openai/v1/models") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ object: "list", data: modelsList.map((id) => ({ id, object: "model" })) }));
    }
    if (req.url === "/openai/v1/chat/completions") {
      const body = JSON.parse(raw || "{}");
      chatRequests.push({ headers: req.headers, body });
      if (mode === "unauthorized") {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: { message: "Invalid API Key", type: "invalid_request_error", code: "invalid_api_key" } }));
      }
      if (mode === "model404") {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: { message: "model not found", type: "invalid_request_error", code: "model_not_found" } }));
      }
      if (mode === "rateLimited") {
        res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "42" });
        return res.end(JSON.stringify({ error: { message: "Rate limit reached", type: "tokens", code: "rate_limit_exceeded" } }));
      }
      const reply = () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          id: "chatcmpl-stub",
          object: "chat.completion",
          choices: [{ index: 0, message: { role: "assistant", content: stubContent(body) }, finish_reason: "stop" }],
          usage: { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 },
        }));
      };
      if (mode === "slow") return setTimeout(reply, 1500);
      return reply();
    }
    res.writeHead(404);
    res.end();
  });
});
await new Promise((resolve) => stub.listen(0, "127.0.0.1", resolve));
const stubPort = stub.address().port;

// Mongo in-memory cho system_config — updateConfig/getEffectiveGroqModel đọc
// ghi DB thật của test này (không mock): admin chọn model = updateConfig.
const mongod = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_model_switch_test";

// Env PHẢI đặt trước khi import config/services (config đọc env lúc import).
process.env.AI_PROVIDER = "groq";
process.env.GROQ_BASE_URL = `http://127.0.0.1:${stubPort}/openai/v1`;
process.env.GROQ_API_KEY = "test-groq-key";
process.env.GROQ_MODEL = "openai/gpt-oss-20b";
// Bộ OLLAMA_* cố ý đặt kiểu cloud đang sống: chứng minh AI_PROVIDER=groq
// THẮNG luật cũ — không cần xoá key Ollama để chuyển đường.
process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-ollama-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

const db = await import("../src/db.js");
await db.initDatabase();
const { config } = await import("../src/config.js");
const syscfg = await import("../src/services/systemConfigService.js");
const modelCfg = await import("../src/services/aiModelConfig.js");
const backend = await import("../src/services/aiBackendService.js");
const gateway = await import("../src/services/aiGroqGateway.js");
const direct = await import("../src/services/aiDirectService.js");
const { getAiInferenceStatus, resetAiInferenceStatus } = await import("../src/services/aiInferenceStatus.js");

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
const expectThrow = async (name, fn, pred) => {
  try {
    await fn();
    checkTrue(name, false, "không ném lỗi");
  } catch (e) {
    checkTrue(name, pred(e), `${e?.name} ${e?.http_code} ${e?.kind} ${e?.code} ${e?.message}`);
  }
};

const reqTeacher = { user: { sub: "user-gv-groq", name: "Giáo Viên Test", username: "gvgroq", role: "teacher" }, headers: {}, ip: "127.0.0.1" };
const reqStudent = { user: { sub: "user-hs-groq", name: "Học Sinh Groq", username: "hsgroq", role: "student" }, headers: {}, ip: "127.0.0.1" };

// ── 1. Luật chọn nhà cung cấp ───────────────────────────────────
check("AI_PROVIDER=groq thắng bộ Ollama cloud đang sống", backend.aiProviderKind(), "groq");
check("hàm thuần: provider groq → groq", backend.aiProviderKindFrom({ provider: "groq", apiKey: "k", baseUrl: "https://ollama.com" }), "groq");
check("hàm thuần: provider rỗng + Ollama cloud → ollama-cloud", backend.aiProviderKindFrom({ provider: "", apiKey: "k", baseUrl: "https://ollama.com" }), "ollama-cloud");
check("hàm thuần: provider lạ → rơi về luật cũ", backend.aiProviderKindFrom({ provider: "xyz", apiKey: "", baseUrl: "" }), "ai-service");
check("groq configured khi có key + model", backend.aiProviderConfigured(), true);

// ── 2. Điều phối qua aiBackendService: health + chat đi đường Groq ──
const health = await backend.aiBackendHealth({});
check("health provider", health.provider, "groq");
check("health model", health.model, "openai/gpt-oss-20b");
check("health status (stub có model)", health.status, true);
checkTrue("health detail sẵn sàng", String(health.detail).includes("sẵn sàng"), health.detail);
check("health hasApiKey", health.hasApiKey, true);
check("health configured", health.configured, true);
check("health inference lúc đầu", health.inference.status, "unknown");

chatRequests = [];
const chat = await backend.callAiBackend("/api/ai/chat", { message: "Giúp mình với", subject: "Toán", history: [] }, reqStudent);
check("chat qua điều phối trả answer", chat.answer, "Chào bạn! Mình là AI Bạn Học.");
const sent = chatRequests[0];
check("payload model Groq", sent.body.model, "openai/gpt-oss-20b");
check("header Authorization Groq", sent.headers.authorization, "Bearer test-groq-key");
checkTrue("chat KHÔNG gửi response_format", sent.body.response_format === undefined);
checkTrue("payload KHÔNG có field think của Ollama", !("think" in sent.body));
check("message đầu là system", sent.body.messages[0]?.role, "system");
checkTrue("system prompt khai model Groq (không phải OllAMA_MODEL)",
  String(sent.body.messages[0]?.content || "").includes("openai/gpt-oss-20b")
  && !String(sent.body.messages[0]?.content || "").includes("gpt-oss:20b\"")
  && !/model (là )?gpt-oss:20b/.test(String(sent.body.messages[0]?.content || "")),
  String(sent.body.messages[0]?.content || "").slice(0, 400));
check("inference sau chat ok", getAiInferenceStatus().status, "ok");

// ── 3. Sinh câu hỏi: response_format json_object + validate dùng chung ──
chatRequests = [];
const quiz = await direct.callAiDirect("/api/ai/quizzes/generate",
  { subject: "Toán", grade: 3, topic: "Phép cộng", difficulty: "easy", count: 2 }, reqTeacher);
check("quiz gửi response_format json_object", chatRequests[0].body.response_format?.type, "json_object");
check("quiz generated", quiz.generated, 2);
check("quiz skipped (câu 3 phương án)", quiz.skipped, 1);
check("quiz needsManualAnswer", quiz.needsManualAnswer, 0);
check("option đúng là '2'", quiz.questions[0].options.find((o) => o.id === quiz.questions[0].correctAnswer)?.content, "2");

const legacy = await direct.callAiDirect("/api/ai/generate-question",
  { subject: "Toán", grade: 3, topic: "Phép cộng", quantity: 2 }, reqTeacher);
check("legacy correctAnswer là text", legacy.questions[0].correctAnswer, "2");

// ── 4. Map lỗi: 401 / 404 / 429 / timeout ───────────────────────
mode = "unauthorized";
await expectThrow("401 → config 502 + nhắc GROQ_API_KEY",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 502 && e.kind === "config" && e.message.includes("GROQ_API_KEY"));
mode = "model404";
await expectThrow("404 → nêu tên model Groq",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 502 && e.kind === "config" && e.message.includes("openai/gpt-oss-20b"));
mode = "rateLimited";
resetAiInferenceStatus();
await expectThrow("429 → AI_RATE_LIMITED + Retry-After 42",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 429 && e.kind === "rateLimited" && e.code === "AI_RATE_LIMITED" && e.retryAfterSeconds === 42);
const inf = getAiInferenceStatus();
check("inference sau 429 = degraded", inf.status, "degraded");
check("inference lastErrorCode = 429", inf.lastErrorCode, 429);
mode = "slow";
config.aiBackend.timeoutMs = 300;
await expectThrow("timeout → 504 kind timeout",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 504 && e.kind === "timeout");
config.aiBackend.timeoutMs = 120000;
mode = "ok";

// ── 5. Health Groq: model bị gỡ khỏi catalog ────────────────────
modelsList = ["llama-3.3-70b-versatile"];
const h2 = await gateway.groqHealth();
check("health thiếu model status", h2.status, false);
checkTrue("health thiếu model nêu tên model", h2.detail.includes("openai/gpt-oss-20b") && h2.detail.includes("chưa có trên Groq"), h2.detail);
modelsList = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "llama-3.3-70b-versatile"];

// ── 6. Explain + phân tích (fallback quy tắc khi JSON rác) ──────
const explain = await direct.callAiDirect("/api/ai/explain", {
  questionId: "q1",
  reveal: false,
  context: {
    questionId: "q1", content: "2 + 3 = ?", subject: "Toán", topic: "Phép cộng",
    inputMode: "choice", options: [{ id: "a1", content: "4" }, { id: "a2", content: "5" }],
    answered: true, selectedAnswerText: "4", isCorrect: false, correctAnswerText: "5", explanation: "",
  },
}, reqStudent);
checkTrue("explain có answer", typeof explain.answer === "string" && explain.answer.length > 0);
check("explain isCorrect", explain.isCorrect, false);

const now = new Date().toISOString();
const analysis = await direct.callAiDirect("/api/ai/learning-analysis", {
  results: [
    { id: "r1", userId: "user-hs-groq", gameId: "g1", score: 80, correctAnswers: 4, totalQuestions: 5, accuracy: 80, completionTime: 60, xpGained: 10, verified: true, createdAt: now },
    { id: "r2", userId: "user-hs-groq", gameId: "g1", score: 90, correctAnswers: 5, totalQuestions: 5, accuracy: 100, completionTime: 50, xpGained: 12, verified: true, createdAt: now },
    { id: "r3", userId: "user-khac", gameId: "g1", score: 10, correctAnswers: 1, totalQuestions: 5, accuracy: 20, completionTime: 30, xpGained: 1, verified: true, createdAt: now },
  ],
  games: [{ id: "g1", name: "Game Cộng", subject: "Toán", topic: "Phép cộng" }],
}, reqStudent);
check("analysis chỉ tính lượt của người gọi", analysis.metrics.totalPlays, 2);
checkTrue("analysis có summary (fallback)", typeof analysis.summary === "string" && analysis.summary.length > 0);

// ── 7. Admin chọn model ở Cài đặt -> lượt gọi dùng model mới NGAY ──
check("chưa chọn: model hiệu lực = GROQ_MODEL env", await modelCfg.getEffectiveGroqModel(), "openai/gpt-oss-20b");
await syscfg.updateConfig({ ai: { model: "llama-3.3-70b-versatile" } });
check("đã chọn llama: model hiệu lực đổi ngay", await modelCfg.getEffectiveGroqModel(), "llama-3.3-70b-versatile");
chatRequests = [];
const chatSwitched = await backend.callAiBackend("/api/ai/chat", { message: "Giúp mình với", history: [] }, reqStudent);
check("chat sau khi đổi vẫn trả answer", chatSwitched.answer, "Chào bạn! Mình là AI Bạn Học.");
check("payload dùng model admin vừa chọn", chatRequests[0].body.model, "llama-3.3-70b-versatile");
checkTrue("prompt khai đúng model mới", String(chatRequests[0].body.messages[0]?.content || "").includes("llama-3.3-70b-versatile"),
  String(chatRequests[0].body.messages[0]?.content || "").slice(0, 300));
const healthSwitched = await backend.aiBackendHealth({});
check("health báo model hiệu lực mới", healthSwitched.model, "llama-3.3-70b-versatile");
check("health kèm modelOptions (3 id)", JSON.stringify(healthSwitched.modelOptions),
  JSON.stringify(["openai/gpt-oss-20b", "openai/gpt-oss-120b", "llama-3.3-70b-versatile"]));
check("cấu hình trả modelOptions cho trang Cài đặt", (await syscfg.getConfig()).ai.modelOptions.length, 3);
await syscfg.updateConfig({ ai: { model: "" } });
check("xoá lựa chọn: quay về GROQ_MODEL env", await modelCfg.getEffectiveGroqModel(), "openai/gpt-oss-20b");
chatRequests = [];
await backend.callAiBackend("/api/ai/chat", { message: "Giúp mình với", history: [] }, reqStudent);
check("payload quay về model env", chatRequests[0].body.model, "openai/gpt-oss-20b");

await mongod.stop();
stub.close();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
