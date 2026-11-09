// Test SMOKE end-to-end đường OLLAMA TRỰC TIẾP qua routes Express THẬT:
// cờ system_config.ai.enabled BẬT + Mongo in-memory (mẫu test-lessons-progress)
// + Ollama Cloud được giả lập bằng cách chặn fetch tới https://ollama.com.
// KHÔNG dùng key thật (key giả "stub-cloud-key"), KHÔNG gọi mạng ra ngoài:
// mọi URL khác được uỷ quyền cho fetch thật (chỉ còn localhost của app test).
//   node server/scripts/test-ai-ollama-routes.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-ai-ollama-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_ollama_routes_test";

// Cấu hình đường cloud (env phải đặt TRƯỚC khi import app/config).
process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

// ── Chặn fetch tới Ollama Cloud bằng response mẫu ───────────────
const realFetch = globalThis.fetch;
const QUIZ_CONTENT = JSON.stringify({
  questions: [
    { content: "2 + 2 = ?", options: ["3", "4", "5", "6"], correctAnswer: "4", points: 100, timeLimit: 20 },
    { content: "5 - 3 = ?", options: ["1", "2", "3", "4"], correctAnswer: "2", points: 100, timeLimit: 20 },
  ],
});
const ANALYSIS_CONTENT = JSON.stringify({
  summary: "Học sinh tiến bộ rõ ở phép cộng.",
  strengths: ["Cộng nhanh"],
  areasToImprove: [],
  recommendations: ["Luyện thêm phép trừ"],
  encouragement: "Cố lên nhé!",
});
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (u.startsWith("https://ollama.com/")) {
    const json = (obj) => new Response(JSON.stringify(obj), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
    if (u.endsWith("/api/tags")) return json({ models: [{ name: "gpt-oss:20b" }] });
    if (u.endsWith("/api/chat")) {
      const body = JSON.parse(options.body || "{}");
      const userText = [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";
      let content = "Chào bạn! Mình là trợ lý học tập, bạn cần giúp gì?";
      if (body.format === "json" && userText.includes("Hãy sinh đúng")) content = QUIZ_CONTENT;
      else if (body.format === "json" && userText.includes("số liệu tổng hợp")) content = ANALYSIS_CONTENT;
      return json({ message: { role: "assistant", content }, done: true });
    }
  }
  return realFetch(url, options);
};

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");

// Bật cờ AI trong Cấu hình hệ thống.
await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacher = signToken({ id: "user-gv", username: "gvtest", role: "teacher", name: "Giáo Viên Test" });
const student = signToken({ id: "user-hs-a", username: "hsa", role: "student", name: "Học Sinh A" });

// Seed: 1 câu hỏi cho explain + 1 game & 2 lượt chơi cho learning-analysis.
await db.getCollection("questions").insertOne({
  id: "q-test-1", gameId: "g1", content: "2 + 3 = ?", subject: "Toán", topic: "Phép cộng",
  inputMode: "choice",
  options: [{ id: "a1", content: "4" }, { id: "a2", content: "5" }],
  correctAnswer: "a2", explanation: "2 + 3 = 5",
});
await db.getCollection("games").insertOne({
  id: "g1", code: "G1", name: "Game Cộng", subject: "Toán", topic: "Phép cộng", status: "published",
});
const now = new Date().toISOString();
await db.getCollection("results").insertMany([
  { id: "r1", userId: "user-hs-a", gameId: "g1", score: 80, correctAnswers: 4, totalQuestions: 5, accuracy: 80, completionTime: 60, xpGained: 10, verified: true, createdAt: now },
  { id: "r2", userId: "user-hs-a", gameId: "g1", score: 100, correctAnswers: 5, totalQuestions: 5, accuracy: 100, completionTime: 45, xpGained: 15, verified: true, createdAt: now },
]);

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

// ── 1. Health: cloud sẵn sàng, shape giữ nguyên ─────────────────
const health = await req("GET", "/api/ai/health");
check("health HTTP", health.status, 200);
check("health available", health.body?.data?.available, true);
check("health featureEnabled", health.body?.data?.featureEnabled, true);
check("health configured", health.body?.data?.configured, true);
check("health model", health.body?.data?.model, "gpt-oss:20b");
check("health provider", health.body?.data?.provider, "ollama-cloud");
checkTrue("health KHÔNG lộ key", !JSON.stringify(health.body).includes("stub-cloud-key"));

// ── 2. Sinh câu hỏi qua route (giáo viên) ───────────────────────
const quiz = await req("POST", "/api/ai/quizzes/generate", teacher,
  { subject: "Toán", grade: 3, topic: "Phép cộng", count: 2 });
check("quiz HTTP", quiz.status, 200);
check("quiz số câu", quiz.body?.data?.questions?.length, 2);
checkTrue("quiz correctAnswer thuộc options",
  (quiz.body?.data?.questions || []).every((q) => q.options.some((o) => o.id === q.correctAnswer)));

// ── 3. Chat qua route (học sinh) ────────────────────────────────
const chat = await req("POST", "/api/ai/chat", student, { message: "Chào bạn" });
check("chat HTTP", chat.status, 200);
checkTrue("chat có answer", typeof chat.body?.data?.answer === "string" && chat.body.data.answer.length > 0);

// ── 4. Explain qua route: không lộ đáp án đúng dạng text ────────
const explain = await req("POST", "/api/ai/explain", student, { questionId: "q-test-1", answer: "a1" });
check("explain HTTP", explain.status, 200);
checkTrue("explain có answer", typeof explain.body?.data?.answer === "string" && explain.body.data.answer.length > 0);
checkTrue("explain KHÔNG chứa correctAnswerText", !("correctAnswerText" in (explain.body?.data || {})));
check("explain isCorrect=false", explain.body?.data?.isCorrect, false);

// ── 5. Phân tích học tập qua route ──────────────────────────────
const analysis = await req("POST", "/api/ai/learning-analysis", student, {});
check("analysis HTTP", analysis.status, 200);
check("analysis totalPlays", analysis.body?.data?.metrics?.totalPlays, 2);
check("analysis summary từ model", analysis.body?.data?.summary, "Học sinh tiến bộ rõ ở phép cộng.");

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
