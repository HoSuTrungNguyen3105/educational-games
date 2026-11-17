// Test Kiểm thử Gia sư AI ở AI Studio (POST /api/ai/playground/chat):
// chỉ teacher/admin gọi được; pipeline dùng lại chat thật (truy xuất bài
// học ĐÃ XUẤT BẢN theo từ khoá của aiChatContext + prompt chatSystem +
// gateway Ollama/Groq); cấu hình NHÁP của Tab 1 (systemPrompt có thay
// biến, temperature truyền xuống gateway, công tắc strictScope chốt ở
// backend — không có ngữ cảnh thì TỪ CHỐI mà KHÔNG gọi model); sources
// trả điểm khớp từ khoá THẬT; lượt thử ghi ai_chat_logs kind="playground".
// Cùng mẫu test-ai-buddy-context: Mongo in-memory + stub fetch tới
// https://ollama.com ghi lại request. KHÔNG dùng key thật, KHÔNG gọi
// mạng ra ngoài.
//   node server/scripts/test-ai-playground.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-playground-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_playground_test";

process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

// ── Stub Ollama: ghi lại MỌI request /api/chat để kiểm prompt + options ──
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

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const student = signToken({ id: "user-hs-pg", username: "hspg", role: "student", name: "Học Sinh PG" });
const teacher = signToken({ id: "user-gv-pg", username: "gvpg", role: "teacher", name: "Giáo Viên PG" });
const admin = signToken({ id: "user-ad-pg", username: "adpg", role: "admin", name: "Admin PG" });

// ── Seed bài học: 1 published khớp mạnh, 1 DRAFT chứa cùng từ khoá ──
const now = new Date().toISOString();
const textEl = (text) => ({ id: "el-" + Math.random().toString(36).slice(2, 8), type: "text", x: 0, y: 0, w: 100, h: 50, props: { text } });
await db.getCollection("lessons").insertMany([
  {
    id: "ls-phan-so", ownerId: "user-gv-pg", title: "Phân số cơ bản", subject: "Toán", grade: 4,
    description: "Làm quen với phân số", status: "published", publishedAt: now, createdAt: now, updatedAt: now,
    pages: [{ id: "p1", title: "Trang 1", elements: [textEl("Tử số là phần viết trên dấu gạch ngang, cho biết số phần được lấy ra. Mẫu số là phần viết dưới dấu gạch ngang.")] }],
  },
  {
    id: "ls-nhap", ownerId: "user-gv-pg", title: "Bài nháp về tử số mẫu số", subject: "Toán", grade: 4,
    description: "", status: "draft", publishedAt: null, createdAt: now, updatedAt: now,
    pages: [{ id: "p1", title: "Trang 1", elements: [textEl("NỘI DUNG NHÁP tử số mẫu số CHƯA XUẤT BẢN")] }],
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
const pg = (token, payload) => req("POST", "/api/ai/playground/chat", token, payload);
const MATCH_Q = "Tử số và mẫu số là gì?";

// ── 1. Phân quyền: chưa đăng nhập 401, học sinh 403 ──
const noAuth = await pg(null, { message: MATCH_Q });
check("chưa đăng nhập → 401", noAuth.status, 401);
const stu = await pg(student, { message: MATCH_Q });
check("học sinh → 403", stu.status, 403);
check("học sinh bị chặn trước khi gọi model", chatRequests.length, 0);

// ── 2. Teacher, không config: hành vi như chat thật + sources chi tiết ──
const r1 = await pg(teacher, { message: MATCH_Q });
check("teacher gọi được → 200", r1.status, 200);
check("answer từ model (stub)", r1.body?.data?.answer, "Câu trả lời mẫu từ stub.");
check("không bị refused", r1.body?.data?.refused, false);
const srcs = r1.body?.data?.sources || [];
check("đúng 1 nguồn (bài nháp không được truy xuất)", srcs.length, 1);
check("nguồn là bài đã xuất bản", srcs[0]?.title, "Phân số cơ bản");
// Điểm khớp THẬT theo matchScore: đoạn nội dung khớp 2 cụm ("tử số",
// "mẫu số" = 2×2) + 3 từ đơn (tử, số, mẫu = 3×1) = 7; tiêu đề/mô tả chỉ
// khớp "số" (1 điểm) nên bị lọc ở ngưỡng ≥2.
check("score của bài = tổng điểm khớp từ khoá", srcs[0]?.score, 7);
check("score của đoạn trích", srcs[0]?.excerpts?.[0]?.score, 7);
checkTrue("đoạn trích là nguyên văn bài học", String(srcs[0]?.excerpts?.[0]?.text || "").includes("Tử số là phần viết trên dấu gạch ngang"));
checkTrue("matchedKeywords có từ đã khớp", ["tử", "số", "mẫu"].every((k) => (srcs[0]?.matchedKeywords || []).includes(k)), JSON.stringify(srcs[0]?.matchedKeywords));
checkTrue("matchedPhrases có cụm đã khớp", ["tử số", "mẫu số"].every((p) => (srcs[0]?.matchedPhrases || []).includes(p)), JSON.stringify(srcs[0]?.matchedPhrases));
const sys1 = lastSystem();
checkTrue("system prompt chứa đoạn bài học đã truy xuất", sys1.includes("Tử số là phần viết trên dấu gạch ngang"));
checkTrue("system prompt là prompt gia sư chatSystem", sys1.includes("Bạn là AI Bạn Học"));
check("không truyền config → temperature mặc định của gateway", chatRequests[chatRequests.length - 1]?.options?.temperature, 0.4);

// ── 3. Admin cũng gọi được ──
const rAdmin = await pg(admin, { message: MATCH_Q });
check("admin gọi được → 200", rAdmin.status, 200);

// ── 4. strictScope + KHÔNG có ngữ cảnh → refusal, KHÔNG gọi model ──
const beforeRefusal = chatRequests.length;
const r2 = await pg(teacher, { message: "Kể về khủng long bạo chúa", config: { strictScope: true } });
check("strictScope không ngữ cảnh → vẫn 200", r2.status, 200);
check("refused = true", r2.body?.data?.refused, true);
check("refusalReason đúng mã", r2.body?.data?.refusalReason, "strict_scope_no_context");
check("sources rỗng khi refusal", r2.body?.data?.sources, []);
checkTrue("answer là thông điệp từ chối theo khuôn", String(r2.body?.data?.answer || "").includes("ngoài phạm vi"));
check("model KHÔNG bị gọi khi refusal", chatRequests.length, beforeRefusal);

// ── 5. strictScope + CÓ ngữ cảnh → gọi model bình thường ──
const r3 = await pg(teacher, { message: MATCH_Q, config: { strictScope: true } });
check("strictScope có ngữ cảnh → 200", r3.status, 200);
check("strictScope có ngữ cảnh → không refused", r3.body?.data?.refused, false);
checkTrue("model được gọi khi có ngữ cảnh", chatRequests.length > beforeRefusal);
checkTrue("prompt có chỉ thị công tắc phạm vi", lastSystem().includes("Chỉ trả lời trong phạm vi bài học hiện tại"));

// ── 6. Temperature nháp truyền xuống gateway ──
const r4 = await pg(teacher, { message: MATCH_Q, config: { temperature: 0.5 } });
check("temperature 0.5 → 200", r4.status, 200);
check("gateway nhận temperature nháp 0.5", chatRequests[chatRequests.length - 1]?.options?.temperature, 0.5);
const r5 = await pg(teacher, { message: MATCH_Q, config: { temperature: 0.9 } });
check("temperature vượt trần Tab 1 bị kẹp về 0.5", chatRequests[chatRequests.length - 1]?.options?.temperature, 0.5);
void r5;

// ── 7. systemPrompt nháp: thay biến + chèn thêm, ràng buộc cứng còn nguyên ──
const r6 = await pg(teacher, {
  message: MATCH_Q,
  config: {
    systemPrompt: "Hãy xưng là cô giáo thử nghiệm, dạy môn {ten_mon_hoc} cho học sinh {cap_hoc}, bài {ten_bai_hoc}.",
    subject: "Toán",
    level: "Tiểu học",
    requireCitation: true,
  },
});
check("systemPrompt nháp → 200", r6.status, 200);
const sys6 = lastSystem();
checkTrue("prompt chứa chỉ thị nháp", sys6.includes("cô giáo thử nghiệm"));
checkTrue("biến {ten_mon_hoc} đã thay bằng môn thật", sys6.includes("dạy môn Toán"));
checkTrue("biến {cap_hoc} đã thay bằng cấp thật", sys6.includes("học sinh Tiểu học"));
checkTrue("biến {ten_bai_hoc} đã thay bằng bài truy xuất đầu tiên", sys6.includes("bài Phân số cơ bản"));
checkTrue("ràng buộc cứng chống gian lận của chatSystem vẫn còn", sys6.includes("Không hỗ trợ gian lận"));
checkTrue("chỉ thị trích dẫn nguồn được chèn khi requireCitation bật", sys6.includes("Bắt buộc trích dẫn nguồn"));

// ── 8. Câu hỏi rỗng → 400 như chat thật ──
const r7 = await pg(teacher, { message: "   " });
check("message rỗng → 400", r7.status, 400);

// ── 9. Log: lượt kiểm thử ghi kind="playground", không lẫn kind="chat" ──
let logs = [];
for (let i = 0; i < 50; i++) {
  logs = await db.getCollection("ai_chat_logs").find({}).toArray();
  const pgSoFar = logs.filter((l) => l.kind === "playground");
  // Ghi log là fire-and-forget: chờ tới khi CẢ lượt thành công lẫn lượt
  // refusal đều đã landing thay vì dừng ở 2 bản ghi đầu tiên tới nơi.
  if (pgSoFar.length >= 2 && pgSoFar.some((l) => l.question === "Kể về khủng long bạo chúa")) break;
  await new Promise((r) => setTimeout(r, 100));
}
const pgLogs = logs.filter((l) => l.kind === "playground");
checkTrue("có bản ghi playground trong ai_chat_logs", pgLogs.length >= 2, `tìm thấy ${pgLogs.length}`);
checkTrue("log playground ghi đúng câu hỏi", pgLogs.some((l) => l.question === MATCH_Q));
checkTrue("log refusal cũng là playground", pgLogs.some((l) => l.question === "Kể về khủng long bạo chúa"));
check("không lượt kiểm thử nào bị ghi thành chat thường", logs.filter((l) => l.kind === "chat").length, 0);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
server.close();
await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
