// Test đường OLLAMA TRỰC TIẾP (aiOllamaGateway + aiDirectService + luật chọn
// nhà cung cấp) bằng một Ollama STUB local ghi lại request. KHÔNG dùng key thật,
// KHÔNG gọi ollama.com: key ở đây là chuỗi giả "test-key-123", endpoint là
// 127.0.0.1. Vì stub ở localhost nên aiProviderKind() (theo luật) vẫn chọn
// "ai-service" — test này gọi thẳng gateway/direct (đúng lớp được đường cloud
// dùng) và kiểm luật chọn bằng hàm thuần aiProviderKindFrom.
//   node server/scripts/test-ai-ollama-direct.mjs
import { createServer } from "node:http";

// ───────────────────────── Stub Ollama ─────────────────────────
let mode = "ok";
let chatRequests = [];

const QUIZ_CONTENT = "```json\n" + JSON.stringify({
  questions: [
    { content: "1 + 1 = ?", options: ["1", "2", "3", "4"], correctAnswer: "2", points: 100, timeLimit: 20, explanation: "1 + 1 = 2" },
    { content: "Câu hỏng chỉ có 3 phương án", options: ["A", "B", "C"], correctAnswer: "A" },
    { content: "3 + 4 = ?", options: ["6", "7", "8", "9"], correctAnswer: "7" },
  ],
}) + "\n```";

function stubContent(body) {
  const userText = [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";
  if (body.format === "json") {
    if (userText.includes("Hãy sinh đúng")) return QUIZ_CONTENT;
    if (userText.includes("số liệu tổng hợp")) return "đây không phải JSON {{{";
    return "{}";
  }
  return "\"Chào bạn! Mình là trợ lý học tập.\"";
}

const stub = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => { raw += c; });
  req.on("end", () => {
    if (req.url === "/api/tags") {
      const models = mode === "tags-missing" ? [{ name: "llama3:latest" }] : [{ name: "gpt-oss:20b" }];
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ models }));
    }
    if (req.url === "/api/chat") {
      const body = JSON.parse(raw || "{}");
      chatRequests.push({ headers: req.headers, body });
      if (mode === "unauthorized") {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "unauthorized" }));
      }
      if (mode === "model404") {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "model not found" }));
      }
      if (mode === "think400" && "think" in body) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "think not supported" }));
      }
      const reply = () => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: { role: "assistant", content: stubContent(body) }, done: true }));
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

// Env PHẢI đặt trước khi import config/services (config đọc env lúc import).
process.env.OLLAMA_BASE_URL = `http://127.0.0.1:${stubPort}`;
process.env["OLLAMA" + "_KEY"] = "test-key-123";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

const { config } = await import("../src/config.js");
const backend = await import("../src/services/aiBackendService.js");
const gateway = await import("../src/services/aiOllamaGateway.js");
const direct = await import("../src/services/aiDirectService.js");

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
    checkTrue(name, pred(e), `${e?.name} ${e?.http_code} ${e?.kind} ${e?.message}`);
  }
};

const reqTeacher = { user: { sub: "user-gv", name: "Giáo Viên Test", username: "gvtest", role: "teacher" }, headers: {}, ip: "127.0.0.1" };
const reqStudent = { user: { sub: "user-hs-a", name: "Học Sinh A", username: "hsa", role: "student" }, headers: {}, ip: "127.0.0.1" };

// ── 1. Luật chọn nhà cung cấp (hàm thuần) ───────────────────────
check("key + ollama.com → cloud", backend.aiProviderKindFrom({ apiKey: "k", baseUrl: "https://ollama.com" }), "ollama-cloud");
check("key + localhost → ai-service", backend.aiProviderKindFrom({ apiKey: "k", baseUrl: "http://localhost:11434" }), "ai-service");
check("key + 127.0.0.1 → ai-service", backend.aiProviderKindFrom({ apiKey: "k", baseUrl: "http://127.0.0.1:11434" }), "ai-service");
check("thiếu key → ai-service", backend.aiProviderKindFrom({ apiKey: "", baseUrl: "https://ollama.com" }), "ai-service");
check("key + URL rỗng → ai-service", backend.aiProviderKindFrom({ apiKey: "k", baseUrl: "" }), "ai-service");
check("config hiện tại (stub localhost) → ai-service", backend.aiProviderKind(), "ai-service");

// ── 2. Chat: payload + bóc response ─────────────────────────────
chatRequests = [];
const chat = await direct.callAiDirect("/api/ai/chat", { message: "Giúp mình với", subject: "Toán", history: [] }, reqStudent);
check("chat bóc ngoặc kép ngoài", chat.answer, "Chào bạn! Mình là trợ lý học tập.");
const sent = chatRequests[0];
check("payload model", sent.body.model, "gpt-oss:20b");
check("payload think=false", sent.body.think, false);
checkTrue("chat không gửi format json", sent.body.format === undefined);
check("header Authorization", sent.headers.authorization, "Bearer test-key-123");
check("options.temperature mặc định", sent.body.options?.temperature, 0.4);
check("message đầu là system", sent.body.messages[0]?.role, "system");
checkTrue("system prompt có tên học sinh", String(sent.body.messages[0]?.content || "").includes("Học Sinh A"));

await expectThrow("chat message rỗng → 400",
  () => direct.callAiDirect("/api/ai/chat", { message: "   " }, reqStudent),
  (e) => e.http_code === 400 && e.message === "Vui lòng nhập câu hỏi.");

// ── 3. Sinh câu hỏi (endpoint mới + cũ dùng chung pipeline) ────
chatRequests = [];
const quiz = await direct.callAiDirect("/api/ai/quizzes/generate",
  { subject: "Toán", grade: 3, topic: "Phép cộng", difficulty: "easy", count: 2 }, reqTeacher);
check("quiz gửi format json", chatRequests[0].body.format, "json");
check("quiz generated", quiz.generated, 2);
check("quiz skipped (câu 3 phương án)", quiz.skipped, 1);
check("quiz needsManualAnswer", quiz.needsManualAnswer, 0);
const q0 = quiz.questions[0];
checkTrue("correctAnswer là id của một option", q0.options.some((o) => o.id === q0.correctAnswer));
check("option đúng là '2'", q0.options.find((o) => o.id === q0.correctAnswer)?.content, "2");
checkTrue("warnings có câu bản nháp", quiz.warnings.some((w) => w.includes("bản nháp")));

const legacy = await direct.callAiDirect("/api/ai/generate-question",
  { subject: "Toán", grade: 3, topic: "Phép cộng", quantity: 2 }, reqTeacher);
check("legacy options là text", legacy.questions[0].options, ["1", "2", "3", "4"]);
check("legacy correctAnswer là text", legacy.questions[0].correctAnswer, "2");

// ── 4. Retry bỏ think khi endpoint trả 400 ──────────────────────
mode = "think400";
chatRequests = [];
const chat2 = await direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent);
check("think400: vẫn trả lời được", chat2.answer, "Chào bạn! Mình là trợ lý học tập.");
check("think400: gọi đúng 2 lượt", chatRequests.length, 2);
checkTrue("think400: lượt 2 không còn field think", !("think" in chatRequests[1].body));
mode = "ok";

// ── 5. Map lỗi: 401 key sai / 404 model thiếu / timeout ─────────
mode = "unauthorized";
await expectThrow("401 → config 502 + nhắc OLLAMA_KEY",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 502 && e.kind === "config" && e.message.includes("OLLAMA_KEY"));
mode = "model404";
await expectThrow("404 → nêu tên model",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 502 && e.kind === "config" && e.message.includes("gpt-oss:20b"));
mode = "slow";
config.aiBackend.timeoutMs = 300;
await expectThrow("timeout → 504 kind timeout",
  () => direct.callAiDirect("/api/ai/chat", { message: "Xin chào" }, reqStudent),
  (e) => e.http_code === 504 && e.kind === "timeout");
config.aiBackend.timeoutMs = 120000;
mode = "ok";

// ── 6. Health qua /api/tags ─────────────────────────────────────
const h1 = await gateway.ollamaHealth();
check("health ok status", h1.status, true);
check("health ok model", h1.model, "gpt-oss:20b");
check("health ok provider", h1.provider, "ollama-cloud");
checkTrue("health ok detail sẵn sàng", h1.detail.includes("sẵn sàng"), h1.detail);
mode = "tags-missing";
const h2 = await gateway.ollamaHealth();
check("health thiếu model status", h2.status, false);
checkTrue("health thiếu model nêu tên model", h2.detail.includes("gpt-oss:20b") && h2.detail.includes("chưa có trên endpoint"), h2.detail);
mode = "ok";

// ── 7. Explain: shape khớp hợp đồng, không lộ đáp án ────────────
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
check("explain revealed=false khi reveal=false", explain.revealed, false);
checkTrue("explain KHÔNG chứa correctAnswerText", !("correctAnswerText" in explain));

// ── 8. Phân tích: JSON rác → fallback bằng quy tắc, số liệu thật ─
const now = new Date().toISOString();
const analysis = await direct.callAiDirect("/api/ai/learning-analysis", {
  results: [
    { id: "r1", userId: "user-hs-a", gameId: "g1", score: 80, correctAnswers: 4, totalQuestions: 5, accuracy: 80, completionTime: 60, xpGained: 10, verified: true, createdAt: now },
    { id: "r2", userId: "user-hs-a", gameId: "g1", score: 90, correctAnswers: 5, totalQuestions: 5, accuracy: 100, completionTime: 50, xpGained: 12, verified: true, createdAt: now },
    { id: "r3", userId: "user-khac", gameId: "g1", score: 10, correctAnswers: 1, totalQuestions: 5, accuracy: 20, completionTime: 30, xpGained: 1, verified: true, createdAt: now },
  ],
  games: [{ id: "g1", name: "Game Cộng", subject: "Toán", topic: "Phép cộng" }],
}, reqStudent);
check("analysis chỉ tính lượt của người gọi", analysis.metrics.totalPlays, 2);
checkTrue("analysis có summary (fallback)", typeof analysis.summary === "string" && analysis.summary.length > 0);
checkTrue("analysis có disclaimer chuẩn", analysis.disclaimer.includes("Số liệu do hệ thống tự tính"), analysis.disclaimer);

// ── 9. Rate limit quiz: 10 lần/phút (chạy cuối, user riêng) ────
const reqRate = { user: { sub: "rate-user", name: "Rate", username: "rate", role: "teacher" }, headers: {}, ip: "127.0.0.1" };
for (let i = 0; i < 10; i++) {
  await direct.callAiDirect("/api/ai/quizzes/generate", { subject: "Toán", grade: 3, topic: "Phép cộng", count: 1 }, reqRate);
}
await expectThrow("quiz lần 11 → 429",
  () => direct.callAiDirect("/api/ai/quizzes/generate", { subject: "Toán", grade: 3, topic: "Phép cộng", count: 1 }, reqRate),
  (e) => e.http_code === 429);

stub.close();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
