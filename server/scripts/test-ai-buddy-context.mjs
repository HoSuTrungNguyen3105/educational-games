// Test đường chat "AI Bạn Học" SAU NÂNG CẤP (Nang_cap_AI_Ban_Hoc.md):
// system prompt do Backend quản lý (danh tính AI Bạn Học + model theo cấu
// hình, ngày giờ Việt Nam §5.6, quy tắc an toàn §9), ngữ cảnh học tập của
// CHÍNH user (§4/§5.7), truy xuất bài học đã xuất bản theo từ khoá (§5.5)
// và giới hạn lịch sử (§6). Cùng mẫu test-ai-ollama-routes: Mongo in-memory
// + chặn fetch tới https://ollama.com bằng stub ghi lại request. KHÔNG dùng
// key thật, KHÔNG gọi mạng ra ngoài.
//   node server/scripts/test-ai-buddy-context.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// dbPath riêng theo pid: dữ liệu seed không bị nhân đôi khi chạy lại test.
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-buddy-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_buddy_context_test";

process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

// ── Stub Ollama: ghi lại MỌI request /api/chat để kiểm prompt ──
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
      return json({ message: { role: "assistant", content: "Câu trả lời mẫu từ stub." }, done: true });
    }
  }
  return realFetch(url, options);
};

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");
const { vietnamNowText } = await import("../src/services/aiChatContext.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const studentA = signToken({ id: "user-hs-a", username: "hsa", role: "student", name: "Học Sinh A" });
const studentB = signToken({ id: "user-hs-b", username: "hsb", role: "student", name: "Học Sinh B" });
const studentC = signToken({ id: "user-hs-c", username: "hsc", role: "student", name: "Học Sinh C" });

// ── Seed: 2 game + kết quả của A (Phép cộng) và C (chủ đề riêng) ──
await db.getCollection("games").insertMany([
  { id: "g1", code: "G1", name: "Game Cộng", subject: "Toán", topic: "Phép cộng", status: "published" },
  { id: "g2", code: "G2", name: "Game Riêng", subject: "Văn", topic: "Chủ đề riêng của C", status: "published" },
]);
const now = new Date().toISOString();
const mkResult = (id, userId, gameId, correct, total) => ({
  id, userId, gameId, score: correct * 20, correctAnswers: correct, totalQuestions: total,
  accuracy: Math.round((correct / total) * 100), completionTime: 60, xpGained: 10,
  verified: true, createdAt: now,
});
await db.getCollection("results").insertMany([
  mkResult("ra1", "user-hs-a", "g1", 4, 5),
  mkResult("ra2", "user-hs-a", "g1", 5, 5),
  mkResult("rc1", "user-hs-c", "g2", 1, 5),
]);

// ── Seed bài học: 1 published về phân số, 1 published khác chủ đề, 1 DRAFT ──
const textEl = (text) => ({ id: "el-" + Math.random().toString(36).slice(2, 8), type: "text", x: 0, y: 0, w: 100, h: 50, props: { text } });
await db.getCollection("lessons").insertMany([
  {
    id: "ls-phan-so", ownerId: "user-gv", title: "Phân số cơ bản", subject: "Toán", grade: 4,
    description: "Làm quen với phân số", status: "published", publishedAt: now, createdAt: now, updatedAt: now,
    pages: [{ id: "p1", title: "Trang 1", elements: [textEl("Tử số là phần viết trên dấu gạch ngang, cho biết số phần được lấy ra. Mẫu số là phần viết dưới dấu gạch ngang.")] }],
  },
  {
    id: "ls-dia-ly", ownerId: "user-gv", title: "Địa lý Việt Nam", subject: "Địa lý", grade: 4,
    description: "", status: "published", publishedAt: now, createdAt: now, updatedAt: now,
    pages: [{ id: "p1", title: "Trang 1", elements: [textEl("Thủ đô của Việt Nam là Hà Nội, nằm ở miền Bắc.")] }],
  },
  {
    id: "ls-nhap", ownerId: "user-gv", title: "Bài nháp về tử số", subject: "Toán", grade: 4,
    description: "", status: "draft", publishedAt: null, createdAt: now, updatedAt: now,
    pages: [{ id: "p1", title: "Trang 1", elements: [textEl("NỘI DUNG NHÁP CHƯA XUẤT BẢN về tử số")] }],
  },
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
const lastSystem = () => {
  const body = chatRequests[chatRequests.length - 1];
  return body?.messages?.find((m) => m.role === "system")?.content || "";
};
const chat = (token, payload) => req("POST", "/api/ai/chat", token, payload);

// ── 1. Danh tính + ngày giờ VN + an toàn trong system prompt (§3, §5.6, §9) ──
const c1 = await chat(studentA, { message: "Chào bạn, bạn là ai?" });
check("chat A HTTP", c1.status, 200);
const sys1 = lastSystem();
checkTrue("prompt có danh tính AI Bạn Học", sys1.includes("Bạn là AI Bạn Học"));
checkTrue("prompt nói đúng model theo cấu hình", sys1.includes("gpt-oss:20b"));
checkTrue("prompt cấm tự nhận ChatGPT", sys1.includes("KHÔNG phải ChatGPT"));
checkTrue("prompt có ngày giờ Việt Nam hiện tại", sys1.includes(vietnamNowText()), "thiếu chuỗi giờ VN");
checkTrue("prompt có quy tắc chống gian lận", sys1.includes("Không hỗ trợ gian lận"));
checkTrue("prompt có quy tắc gia sư từng bước", sys1.includes("GIA SƯ TỪNG BƯỚC"));

// ── 2. Ngữ cảnh học tập: A có của A, không lẫn của C (§4, ca kiểm thử 8) ──
checkTrue("A thấy tóm tắt của chính mình", sys1.includes("đã chơi 2 lượt") && sys1.includes("Phép cộng"));
checkTrue("A KHÔNG thấy dữ liệu của C", !sys1.includes("Chủ đề riêng của C"));

// ── 3. User chưa có kết quả → không có khối tóm tắt ──
const c3 = await chat(studentB, { message: "Chào bạn" });
check("chat B HTTP", c3.status, 200);
checkTrue("B không có khối tóm tắt học tập", !lastSystem().includes("Tóm tắt học tập"));

// ── 4. C thấy đúng chủ đề của mình ──
await chat(studentC, { message: "Chào bạn" });
checkTrue("C thấy chủ đề của chính mình", lastSystem().includes("Chủ đề riêng của C"));

// ── 5. Truy xuất bài học đã xuất bản (§5.5, ca kiểm thử 7) ──
const c5 = await chat(studentA, { message: "Cho mình hỏi tử số là gì trong phân số?" });
check("chat hỏi phân số HTTP", c5.status, 200);
const sys5 = lastSystem();
checkTrue("có khối TÀI LIỆU BÀI HỌC", sys5.includes("TÀI LIỆU BÀI HỌC LIÊN QUAN"));
checkTrue("đoạn trích đúng nguyên văn bài đã xuất bản", sys5.includes("Tử số là phần viết trên dấu gạch ngang"));
checkTrue("KHÔNG lấy bài nháp", !sys5.includes("NỘI DUNG NHÁP CHƯA XUẤT BẢN"));
checkTrue("KHÔNG lẫn bài không liên quan", !sys5.includes("Hà Nội"));
check("sources trả về đúng 1 bài", c5.body?.data?.sources?.length, 1);
check("sources[0].title", c5.body?.data?.sources?.[0]?.title, "Phân số cơ bản");

// ── 6. Câu hỏi không liên quan bài học nào → không nguồn, không bịa ──
const c6 = await chat(studentA, { message: "Kể một câu chuyện cười đi" });
check("chat chuyện cười HTTP", c6.status, 200);
checkTrue("không có khối tài liệu", !lastSystem().includes("TÀI LIỆU BÀI HỌC LIÊN QUAN"));
checkTrue("không có sources trong response", !("sources" in (c6.body?.data || {})));

// ── 7. Lịch sử dài bị cắt ở 10 lượt gần nhất (§6, ca kiểm thử 10) ──
const history = [];
for (let i = 0; i < 15; i++) history.push({ role: i % 2 ? "assistant" : "user", content: `Lượt cũ số ${i}` });
await chat(studentA, { message: "Tiếp tục nhé", history });
const lastBody = chatRequests[chatRequests.length - 1];
check("tổng messages gửi model = system + 10 history + 1 mới", lastBody.messages.length, 12);
checkTrue("lượt cũ nhất đã bị cắt", !JSON.stringify(lastBody.messages).includes("Lượt cũ số 0"));

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
