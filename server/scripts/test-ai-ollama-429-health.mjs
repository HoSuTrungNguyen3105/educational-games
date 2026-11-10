// Test đường OLLAMA TRỰC TIẾP: lỗi 429 của provider + health inference.
// Kịch bản sự cố 2026-11-10: key Ollama hết quota → mọi lượt gọi model trả 429
// trong ~1 giây nhưng health (chỉ probe /api/tags) vẫn xanh. Test này chốt:
//   1. Health lúc mới khởi động: inference.status = "unknown".
//   2. Provider trả 429 (+ Retry-After) → route chat trả HTTP 429 kèm
//      errorCode "AI_RATE_LIMITED", thông điệp thân thiện riêng và
//      retryAfterSeconds — KHÔNG còn câu 502 chung chung.
//   3. Sau lượt 429: health inference = "degraded", lastErrorCode = 429,
//      trong khi `available` (probe tags) vẫn true — đúng chữ ký sự cố.
//   4. Provider trở lại 200 → chat bình thường; health inference = "ok".
// Ollama Cloud được giả lập bằng cách chặn fetch tới https://ollama.com;
// KHÔNG dùng key thật, KHÔNG gọi mạng ra ngoài.
//   node server/scripts/test-ai-ollama-429-health.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-ai-429-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_ollama_429_test";

// Cấu hình đường cloud (env phải đặt TRƯỚC khi import app/config).
process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

// ── Chặn fetch tới Ollama Cloud: /api/chat đổi chế độ theo biến này ──
let chatMode = "ok"; // "ok" | "rateLimited"
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (u.startsWith("https://ollama.com/")) {
    const json = (obj, status = 200, headers = {}) => new Response(JSON.stringify(obj), {
      status, headers: { "Content-Type": "application/json", ...headers },
    });
    if (u.endsWith("/api/tags")) return json({ models: [{ name: "gpt-oss:20b" }] });
    if (u.endsWith("/api/chat")) {
      if (chatMode === "rateLimited") {
        return json({ error: "rate limit exceeded" }, 429, { "Retry-After": "42" });
      }
      return json({ message: { role: "assistant", content: "Chào bạn! Hôm nay là thứ Ba nhé." }, done: true });
    }
  }
  return realFetch(url, options);
};

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const student = signToken({ id: "user-hs-429", username: "hs429", role: "student", name: "Học Sinh 429" });

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
  return { status: res.status, headers: res.headers, body: await res.json().catch(() => null) };
};

// ── 1. Health trước mọi lượt gọi model: inference "unknown" ─────
const h0 = await req("GET", "/api/ai/health");
check("health HTTP", h0.status, 200);
check("health available (probe tags)", h0.body?.data?.available, true);
check("health provider", h0.body?.data?.provider, "ollama-cloud");
check("inference ban đầu: status", h0.body?.data?.inference?.status, "unknown");
check("inference ban đầu: lastErrorCode", h0.body?.data?.inference?.lastErrorCode, null);
check("inference ban đầu: lastErrorAt", h0.body?.data?.inference?.lastErrorAt, null);
check("inference ban đầu: lastSuccessAt", h0.body?.data?.inference?.lastSuccessAt, null);

// ── 2. Provider 429 → chat trả lỗi phân biệt được ───────────────
chatMode = "rateLimited";
const chat429 = await req("POST", "/api/ai/chat", student, { message: "Hôm nay là thứ mấy?" });
check("chat 429: HTTP", chat429.status, 429);
check("chat 429: status envelope", chat429.body?.status, false);
check("chat 429: errorCode", chat429.body?.errorCode, "AI_RATE_LIMITED");
check("chat 429: thông điệp riêng", chat429.body?.msg,
  "AI Bạn Học đang hết lượt dùng thử, bạn quay lại sau ít phút nhé.");
check("chat 429: retryAfterSeconds ở body", chat429.body?.retryAfterSeconds, 42);
check("chat 429: header Retry-After", chat429.headers.get("retry-after"), "42");
checkTrue("chat 429: KHÔNG còn câu 502 chung chung",
  !String(chat429.body?.msg || "").includes("Dịch vụ AI đang lỗi"));

// ── 3. Health sau lượt 429: inference degraded, available vẫn true ──
const h1 = await req("GET", "/api/ai/health");
check("sau 429: available vẫn true (tags OK)", h1.body?.data?.available, true);
check("sau 429: inference status", h1.body?.data?.inference?.status, "degraded");
check("sau 429: inference lastErrorCode", h1.body?.data?.inference?.lastErrorCode, 429);
checkTrue("sau 429: inference lastErrorAt có giá trị",
  typeof h1.body?.data?.inference?.lastErrorAt === "string" && h1.body.data.inference.lastErrorAt.length > 0);
check("sau 429: inference lastSuccessAt vẫn null", h1.body?.data?.inference?.lastSuccessAt, null);

// ── 4. Provider hồi phục → chat 200, inference "ok" ─────────────
chatMode = "ok";
const chatOk = await req("POST", "/api/ai/chat", student, { message: "Hôm nay là thứ mấy?" });
check("chat hồi phục: HTTP", chatOk.status, 200);
checkTrue("chat hồi phục: có answer",
  typeof chatOk.body?.data?.answer === "string" && chatOk.body.data.answer.length > 0);

const h2 = await req("GET", "/api/ai/health");
check("sau hồi phục: inference status", h2.body?.data?.inference?.status, "ok");
checkTrue("sau hồi phục: lastSuccessAt có giá trị",
  typeof h2.body?.data?.inference?.lastSuccessAt === "string" && h2.body.data.inference.lastSuccessAt.length > 0);
check("sau hồi phục: lastErrorCode giữ 429 (lịch sử)", h2.body?.data?.inference?.lastErrorCode, 429);

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
