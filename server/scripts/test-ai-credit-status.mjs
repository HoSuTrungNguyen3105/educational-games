// Test "CREDIT AI CÒN LẠI" trong khung chat (Nguyên yêu cầu 2026-11-10):
// bộ đếm nội bộ theo ngày UTC ở aiGroqGateway → aiUsageService → endpoint
// GET /api/ai/credit-status. Groq được MOCK bằng stub local đúng shape
// OpenAI (có/không có `usage`, có/không có header x-ratelimit-* theo từng
// giai đoạn) — KHÔNG dùng key thật, KHÔNG gọi mạng ngoài.
//
// Bao phủ:
//  (e) lượt gọi KHÔNG có usage → chat vẫn 200, đếm +1 request, token +0,
//      callsMissingUsage = 1;
//  (a)+(b) vài lượt chat có usage 150 token/lượt → bộ đếm tăng đúng,
//      remaining = limit − used đúng số (cả token lẫn request);
//  (header) khi Groq trả x-ratelimit-remaining-requests → số request còn
//      lại ƯU TIÊN số của Groq (nguồn "provider"), không phải bộ đếm;
//  (config) admin ghi đè ai.dailyTokenLimit/dailyRequestLimit → trạng
//      thái dùng hạn mức mới ngay (sửa cấu hình, không sửa code);
//  (c) document của NGÀY UTC HÔM QUA không lọt vào số "hôm nay" — ngày
//      mới bắt đầu từ 0; resetsAtUtc = 00:00 UTC ngày mai;
//  (d) chưa đăng nhập → 401; học sinh/giáo viên đăng nhập → 200.
//   node server/scripts/test-ai-credit-status.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-credit-status-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_credit_status_test";

// ───────────────────── Stub Groq ─────────────────────
// mode "nousage": response KHÔNG có usage, KHÔNG header ratelimit.
// mode "ok": usage 150 token/lượt + header x-ratelimit-* (remaining-requests = 997).
let mode = "nousage";
const USAGE = { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 };

const stub = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => { raw += c; });
  req.on("end", () => {
    const json = (obj, headers = {}) => {
      res.writeHead(200, { "Content-Type": "application/json", ...headers });
      res.end(JSON.stringify(obj));
    };
    if (req.url === "/openai/v1/models") {
      return json({ object: "list", data: [{ id: "openai/gpt-oss-20b", object: "model" }] });
    }
    if (req.url === "/openai/v1/chat/completions") {
      const body = JSON.parse(raw || "{}");
      const isToolTurn = Array.isArray(body.tools) && body.tools.length > 0;
      const payload = {
        id: "chatcmpl-stub", object: "chat.completion",
        choices: [{
          index: 0,
          message: { role: "assistant", content: isToolTurn ? "Không cần công cụ." : "Câu trả lời mẫu từ stub." },
          finish_reason: "stop",
        }],
      };
      if (mode === "ok") {
        payload.usage = USAGE;
        return json(payload, {
          "x-ratelimit-limit-requests": "1000",
          "x-ratelimit-remaining-requests": "997",
          "x-ratelimit-limit-tokens": "8000",
          "x-ratelimit-remaining-tokens": "7000",
        });
      }
      return json(payload);
    }
    res.writeHead(404);
    res.end();
  });
});
await new Promise((resolve) => stub.listen(0, "127.0.0.1", resolve));

// Env PHẢI đặt trước khi import config/services (config đọc env lúc import).
process.env.AI_PROVIDER = "groq";
process.env.GROQ_BASE_URL = `http://127.0.0.1:${stub.address().port}/openai/v1`;
process.env.GROQ_API_KEY = ["test", "groq", "key"].join("-");
process.env.GROQ_MODEL = "openai/gpt-oss-20b";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");
const usageSvc = await import("../src/services/aiUsageService.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const OLD = "2026-01-05T00:00:00.000Z";
const mkUser = (id, name, role, extra = {}) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  email: `${id.replace("user-", "")}@test.local`, createdAt: OLD, ...extra,
});
await db.getCollection("users").insertMany([
  mkUser("user-admin", "Quản Trị Viên", "admin"),
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-hs1", "Học Sinh Một", "student", { ageCode: "kid-breeze", classId: "cls-a" }),
]);

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const admin = tok("user-admin", "admin", "Quản Trị Viên");
const teacher = tok("user-gv1", "teacher", "Giáo Viên Một");
const hs = tok("user-hs1", "student", "Học Sinh Một");

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

async function chat(token, message) {
  const r = await fetch(`${base}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message }),
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
async function credit(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const r = await fetch(`${base}/api/ai/credit-status`, { headers });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, data: j?.data || {} };
}
/** Ghi đếm là fire-and-forget → chờ tối đa ~4s cho tới khi bộ đếm khớp điều kiện. */
async function waitCredit(token, pred, label) {
  for (let i = 0; i < 40; i++) {
    const s = await credit(token);
    if (pred(s.data)) return s.data;
    await sleep(100);
  }
  const last = await credit(token);
  throw new Error(`Hết thời gian chờ bộ đếm (${label}): ${JSON.stringify(last.data)}`);
}

// ── (d) quyền xem: chưa đăng nhập 401; mọi role đã đăng nhập 200 ──
const anon = await credit(null);
check("(d) chưa đăng nhập → 401", anon.status, 401);
const t0 = await credit(teacher);
check("(d) giáo viên đăng nhập → 200", t0.status, 200);
check("(d) trạng thái ban đầu: supported", t0.data.supported, true);
check("(d) model hiệu lực", t0.data.model, "openai/gpt-oss-20b");
check("(d) mặc định free tier: limit token/ngày", t0.data.limitTokensPerDay, 200000);
check("(d) mặc định free tier: limit request/ngày", t0.data.limitRequestsPerDay, 1000);
check("(d) chưa dùng gì: used token = 0", t0.data.usedTokensToday, 0);
check("(d) estimate luôn true", t0.data.estimate, true);
checkTrue("(d) resetsAtUtc là 00:00 UTC ngày mai",
  t0.data.resetsAtUtc === usageSvc.nextUtcMidnightIso(), String(t0.data.resetsAtUtc));

// ── (e) lượt gọi KHÔNG usage: chat vẫn chạy, đếm request, token +0 ──
mode = "nousage";
const c1 = await chat(hs, "Chào bạn, mình học lớp 3.");
check("(e) chat không usage vẫn 200", c1.status, 200);
const s1 = await waitCredit(hs, (d) => d.usedRequestsToday === 1, "sau lượt nousage");
check("(e) used request = 1", s1.usedRequestsToday, 1);
check("(e) used token = 0 (không usage)", s1.usedTokensToday, 0);
check("(e) callsMissingUsage = 1", s1.callsMissingUsageToday, 1);
check("(e) remaining token vẫn nguyên hạn mức", s1.remainingTokensToday, 200000);
check("(e) remaining request theo bộ đếm = 999", s1.remainingRequestsToday, 999);
check("(e) nguồn số request = counter (chưa có header)", s1.requestsRemainingSource, "counter");

// ── (a)+(b)+(header) hai lượt có usage 150 + header Groq ──
mode = "ok";
const c2 = await chat(hs, "1 + 1 bằng mấy?");
check("(a) chat có usage → 200", c2.status, 200);
const c3 = await chat(hs, "2 + 2 bằng mấy?");
check("(a) chat có usage (2) → 200", c3.status, 200);
const s2 = await waitCredit(hs, (d) => d.usedTokensToday === 300, "sau 2 lượt có usage");
check("(a) used request tổng = 3", s2.usedRequestsToday, 3);
check("(a) used token = 2 × 150 = 300", s2.usedTokensToday, 300);
check("(b) remaining token = 200000 − 300", s2.remainingTokensToday, 199700);
check("(header) remaining request ƯU TIÊN số Groq trả = 997", s2.remainingRequestsToday, 997);
check("(header) nguồn số request = provider", s2.requestsRemainingSource, "provider");
check("(a) callsMissingUsage không tăng thêm", s2.callsMissingUsageToday, 1);

// ── (config) ghi đè hạn mức qua system_config → áp dụng ngay ──
await updateConfig({ ai: { dailyTokenLimit: 1000, dailyRequestLimit: 10 } });
const s3 = await credit(hs);
check("(config) limit token mới = 1000", s3.data.limitTokensPerDay, 1000);
check("(config) remaining token = 1000 − 300", s3.data.remainingTokensToday, 700);
check("(config) limit request mới = 10", s3.data.limitRequestsPerDay, 10);
check("(config) remaining request vẫn ưu tiên header Groq", s3.data.remainingRequestsToday, 997);
await updateConfig({ ai: { dailyTokenLimit: 200000, dailyRequestLimit: 1000 } });

// ── (c) document ngày UTC hôm qua KHÔNG lọt vào số hôm nay ──
const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
await db.getCollection("ai_usage_daily").insertOne({
  id: `openai/gpt-oss-20b__${yesterday}`,
  model: "openai/gpt-oss-20b",
  day: yesterday,
  requests: 500,
  tokens: 99999,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});
const s4 = await credit(hs);
check("(c) used token hôm nay không gồm hôm qua", s4.data.usedTokensToday, 300);
check("(c) used request hôm nay không gồm hôm qua", s4.data.usedRequestsToday, 3);
check("(c) dayUtc là hôm nay (UTC)", s4.data.dayUtc, usageSvc.utcDayKey());

// ── Khói: admin chat vẫn chạy bình thường sau mọi thay đổi ──
const c4 = await chat(admin, "Chào bạn.");
check("(smoke) admin chat → 200", c4.status, 200);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
stub.close();
await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
