// Test ĐƯỜNG A — AI TỰ CHỌN CÔNG CỤ (tool-use vòng kín) cho tra cứu quản
// trị (Nguyên chốt 2026-11-10): lượt chọn công cụ được MOCK ở tầng gateway
// bằng một Groq STUB local (đúng shape OpenAI chat/completions): khi
// request có `tools` (lượt chọn), stub đóng vai model và trả tool_calls;
// khi không có `tools` (lượt trả lời cuối), stub trả text mẫu và test đọc
// system prompt để xác minh khối dữ liệu thật đã được backend gắn vào.
// KHÔNG dùng key thật, KHÔNG gọi mạng ngoài.
//
// Cách stub "đóng vai model" (vá định tuyến 2026-11-10): ngoài các ca an
// toàn dùng kịch bản cứng (công cụ bịa, tham số hỏng...), việc CHỌN công
// cụ cho các câu hỏi thường do một bộ GIẢ LẬP quyết định dựa trên CHÍNH
// payload được gửi đi: nó trích các câu VÍ DỤ nằm trong mô tả của từng
// công cụ và chấm độ giống với câu hỏi (Dice trên token đã gấp dấu), chỉ
// chọn khi đạt ngưỡng tự tin. Đây là bản rút gọn có chủ đích của cách
// model thật bám mô tả/ví dụ — nếu mô tả thiếu ví dụ cho một cách diễn
// đạt, ca tương ứng sẽ trượt. Nhờ vậy mục R khoá được hai ca production
// đã fail thật (chọn nhầm overview cho câu học sinh mới; trượt hẳn câu
// "có gì mới") ở mức backend: mô tả/prompt sau vá phải đủ rõ để bộ giả
// lập chọn đúng. Độ chính xác của MODEL THẬT vẫn chỉ kết luận được bằng
// kiểm chứng production sau deploy.
//
// Bao phủ: (a) admin hỏi diễn đạt LẠ không khớp từ khoá cũ → model chọn
// đúng công cụ → dữ liệu thật; (b) model chọn công cụ không tồn tại → lùi
// chat thường, không lỗi; (c) tham số ngoài miền (period lạ, threshold do
// model tự bịa) → bị kẹp/loại an toàn, ngưỡng luôn từ cấu hình; (d)
// teacher hỏi câu quản trị → KHÔNG nhận danh mục công cụ, KHÔNG dữ liệu;
// (e) học sinh → không đổi; (f) fallback từ khoá vẫn chạy khi model không
// chọn công cụ; (g) model trả 3 tool_calls → chỉ thực thi tối đa 2;
// (R) hồi quy định tuyến: đúng 2 câu production đã fail + biến thể diễn
// đạt lạ — bộ giả lập phải chọn đúng công cụ qua mô tả/prompt mới.
//   node server/scripts/test-ai-tool-use.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-tool-use-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_tool_use_test";

// ───────────────────── Stub Groq đóng vai model ở lượt chọn công cụ ─────────────────────
const toolRequests = [];   // request CÓ tools (lượt chọn)
const answerRequests = []; // request KHÔNG tools (lượt trả lời cuối)

function toolCall(id, name, args) {
  return { id, type: "function", function: { name, arguments: typeof args === "string" ? args : JSON.stringify(args) } };
}
function completion(message) {
  return {
    id: "chatcmpl-stub", object: "chat.completion",
    choices: [{ index: 0, message: { role: "assistant", ...message }, finish_reason: "stop" }],
    usage: { prompt_tokens: 10, completion_tokens: 8, total_tokens: 18 },
  };
}
/** Gấp dấu tiếng Việt (bản rút gọn của foldText) để so token bền với cách gõ. */
function foldLite(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
function foldTokens(text) {
  return new Set(foldLite(text).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean));
}
/** Trích các cụm nằm trong dấu ngoặc kép của một mô tả công cụ (câu ví dụ + cụm nhấn mạnh). */
function quotedPhrases(description) {
  return [...String(description || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/** Ngưỡng tự tin của bộ giả lập: dưới mức này coi như model không chọn công cụ nào. */
const SIM_THRESHOLD = 0.7;
/**
 * "Model" giả lập: chọn công cụ từ CHÍNH payload request — chấm độ giống
 * (hệ số Dice trên tập token đã gấp dấu) giữa câu hỏi và từng cụm trích
 * từ MÔ TẢ của mỗi công cụ (chủ yếu là các câu ví dụ), lấy công cụ khớp
 * nhất khi đạt ngưỡng. Kỳ thời gian suy từ chính câu hỏi như model thật
 * sẽ điền tham số. Mô tả càng rõ/ví dụ càng sát, lựa chọn càng đúng —
 * đây là cơ chế mà mục R dùng để khoá hồi quy định tuyến.
 */
function simulatedToolCalls(body, userText) {
  const q = foldTokens(userText);
  if (q.size === 0) return [];
  let best = null;
  for (const t of body.tools || []) {
    for (const phrase of quotedPhrases(t.function?.description)) {
      const e = foldTokens(phrase);
      if (e.size === 0) continue;
      let inter = 0;
      for (const tok of q) if (e.has(tok)) inter++;
      const dice = (2 * inter) / (q.size + e.size);
      if (!best || dice > best.dice) best = { name: t.function?.name, dice };
    }
  }
  if (!best || best.dice < SIM_THRESHOLD) return [];
  const folded = foldLite(userText);
  const args = {};
  if (/hom nay/.test(folded)) args.period = "today";
  else if (/tuan nay/.test(folded)) args.period = "week";
  else if (/thang truoc/.test(folded)) args.period = "last_month";
  else if (/thang nay/.test(folded)) args.period = "month";
  return [toolCall("sim1", best.name, args)];
}

/**
 * Chọn tool_calls cho một lượt chọn của stub: các ca AN TOÀN dùng kịch
 * bản cứng theo cụm từ kích hoạt (model bịa công cụ / tham số ngoài
 * miền / JSON hỏng / trả thừa công cụ); mọi câu hỏi còn lại đi qua bộ
 * GIẢ LẬP bám mô tả ở trên.
 */
function scriptedToolCalls(body, userText) {
  if (userText.includes("công cụ lạ")) return [toolCall("c1", "xoa_nguoi_dung", {})];
  if (userText.includes("kỳ lạ")) return [toolCall("c1", "new_students", { period: "year" })];
  if (userText.includes("ngưỡng lạ")) return [toolCall("c1", "low_scores", { period: "month", threshold: 150 })];
  if (userText.includes("tham số hỏng")) return [toolCall("c1", "new_students", "hong-json{{{")];
  if (userText.includes("ba công cụ")) {
    return [toolCall("c1", "overview", {}), toolCall("c2", "content_new", {}), toolCall("c3", "ai_config", {})];
  }
  return simulatedToolCalls(body, userText);
}

const stub = createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => { raw += c; });
  req.on("end", () => {
    const json = (obj) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(obj));
    };
    if (req.url === "/openai/v1/models") {
      return json({ object: "list", data: [{ id: "openai/gpt-oss-20b", object: "model" }] });
    }
    if (req.url === "/openai/v1/chat/completions") {
      const body = JSON.parse(raw || "{}");
      if (Array.isArray(body.tools) && body.tools.length > 0) {
        toolRequests.push(body);
        const userText = [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";
        const calls = scriptedToolCalls(body, userText);
        return json(completion(calls.length > 0 ? { tool_calls: calls } : { content: "Không cần công cụ." }));
      }
      answerRequests.push(body);
      return json(completion({ content: "Câu trả lời mẫu từ stub." }));
    }
    res.writeHead(404);
    res.end();
  });
});
await new Promise((resolve) => stub.listen(0, "127.0.0.1", resolve));

// Env PHẢI đặt trước khi import config/services (config đọc env lúc import).
process.env.AI_PROVIDER = "groq";
process.env.GROQ_BASE_URL = `http://127.0.0.1:${stub.address().port}/openai/v1`;
process.env.GROQ_API_KEY = "<redacted>";
process.env.GROQ_MODEL = "openai/gpt-oss-20b";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");
const { detectAdminQuery } = await import("../src/services/aiAdminQueryService.js");
const { AI_TOOLS, toolDefinitionsForModel, validateToolArgs, isKnownTool } = await import("../src/services/aiToolCatalog.js");

await updateConfig({ ai: { enabled: true, lowScoreThreshold: 50 } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const OLD = "2026-01-05T00:00:00.000Z";
const NOW = new Date().toISOString();

// ── Seed: 1 admin / 1 giáo viên / 3 học sinh (1 mới tháng này, 2 cũ) ──
const mkUser = (id, name, role, extra = {}) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  createdAt: OLD, ...extra,
});
await db.getCollection("users").insertMany([
  mkUser("user-admin", "Quản Trị Viên", "admin"),
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-hsnew", "HS Mới Tháng Này", "student", { ageCode: "kid-breeze", classId: "cls-a", createdAt: NOW }),
  mkUser("user-hslow1", "HS Điểm Ba Mươi", "student", { ageCode: "kid-breeze", classId: "cls-a" }),
  mkUser("user-hslow2", "HS Điểm Tám Mươi", "student", { ageCode: "kid-breeze", classId: "cls-a" }),
]);
await db.getCollection("classes").insertMany([{ id: "cls-a", name: "3A" }]);
await db.getCollection("games").insertMany([
  { id: "game-moi", name: "Game Mới Ra Mắt", subject: "Toán", status: "published", createdAt: NOW },
]);
await db.getCollection("lessons").insertMany([
  { id: "lesson-moi", title: "Bài Học Mới Nhất", subject: "Toán", status: "published", createdAt: NOW, pages: [] },
]);
await db.getCollection("assignments").insertMany([
  { id: "as-1", title: "Kiểm tra Toán", classId: "cls-a", status: "OPEN", createdAt: OLD },
]);
await db.getCollection("submissions").insertMany([
  { id: "sub-1", assignmentId: "as-1", studentId: "user-hslow1", score: 30, status: "SUBMITTED", submittedAt: NOW },
  { id: "sub-2", assignmentId: "as-1", studentId: "user-hslow2", score: 80, status: "SUBMITTED", submittedAt: NOW },
]);

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const admin = tok("user-admin", "admin", "Quản Trị Viên");
const teacher = tok("user-gv1", "teacher", "Giáo Viên Một");
const hs1 = tok("user-hsnew", "student", "HS Mới Tháng Này");

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
const chat = async (token, message) => {
  const res = await fetch(`${base}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message }),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};
const lastAnswerSystem = () => {
  const body = answerRequests[answerRequests.length - 1];
  return body?.messages?.find((m) => m.role === "system")?.content || "";
};

// ── 0. Đơn vị: danh mục + validate tham số ──
check("catalog có đúng 11 công cụ", AI_TOOLS.length, 11);
check("catalog đủ 11 loại tra cứu hiện có",
  [...AI_TOOLS.map((t) => t.name)].sort(),
  ["ai_activity", "ai_config", "content_new", "declining", "low_scores", "my_permissions",
   "new_students", "overview", "stats", "support_backlog", "unfinished"].sort());
const defs = toolDefinitionsForModel();
checkTrue("định nghĩa gửi model đúng shape OpenAI (type function + name + parameters)",
  defs.every((d) => d.type === "function" && d.function?.name && d.function?.parameters?.type === "object"));
checkTrue("định nghĩa công cụ KHÔNG chứa URL/khoá/endpoint nào",
  !/https?:|api[_-]?key|bearer/i.test(JSON.stringify(defs)));
check("validate: công cụ lạ → null", validateToolArgs("xoa_nguoi_dung", {}), null);
check("validate: period ngoài miền → kẹp về null (kỳ mặc định)", validateToolArgs("new_students", { period: "year" }), { period: null });
check("validate: period hợp lệ được giữ", validateToolArgs("new_students", { period: "week" }), { period: "week" });
check("validate: threshold model tự thêm bị LOẠI BỎ", validateToolArgs("low_scores", { period: "month", threshold: 150 }), { period: "month" });
check("validate: arguments không phải JSON → null", validateToolArgs("new_students", "hong-json{{{"), null);
checkTrue("isKnownTool phân biệt được tên lạ", isKnownTool("overview") && !isKnownTool("xoa_nguoi_dung"));

// ── 0c. Cấu trúc mô tả sau vá định tuyến: PHẠM VI + VÍ DỤ + PHÂN BIỆT ──
checkTrue("mọi công cụ đều có câu VÍ DỤ trong mô tả",
  AI_TOOLS.every((t) => t.description.includes("Ví dụ câu hỏi:")));
checkTrue("mọi công cụ đều có quy tắc PHÂN BIỆT trong mô tả",
  AI_TOOLS.every((t) => t.description.includes("Phân biệt:")));
const overviewDesc = AI_TOOLS.find((t) => t.name === "overview")?.description || "";
checkTrue("mô tả overview KHÔNG còn câu kéo nhầm 'số lượng một loại đối tượng' (gốc lỗi ca production 1)",
  !overviewDesc.includes("số lượng một loại đối tượng"));
checkTrue("mô tả overview nêu rõ ranh giới: gắn kỳ hoặc 'mới' thì không thuộc overview",
  overviewDesc.includes("KHÔNG gắn kỳ") || overviewDesc.includes("không lọc theo kỳ"));
const contentNewDesc = AI_TOOLS.find((t) => t.name === "content_new")?.description || "";
checkTrue("mô tả content_new bao trùm đúng cách hỏi 'có gì mới'",
  contentNewDesc.includes("có gì mới") && contentNewDesc.includes("Tháng này trường mình có gì mới không?"));
const newStudentsDesc = AI_TOOLS.find((t) => t.name === "new_students")?.description || "";
checkTrue("mô tả new_students có ví dụ đếm số lượng học sinh mới theo kỳ",
  newStudentsDesc.includes("Tháng này có bao nhiêu học sinh mới?"));

// ── 0b. Tiền đề ca (a): hai câu diễn đạt lạ KHÔNG khớp đường từ khoá cũ ──
check("từ khoá cũ KHÔNG bắt được 'tháng này trường mình có gì mới không?'",
  detectAdminQuery("Tháng này trường mình có gì mới không?"), null);
check("từ khoá cũ KHÔNG bắt được 'cho xem tình hình hệ thống'",
  detectAdminQuery("Cho xem tình hình hệ thống"), null);

// ── A1. Admin hỏi lạ về nội dung mới → model chọn content_new → dữ liệu thật ──
const toolReqsBefore = toolRequests.length;
const a1 = await chat(admin, "Tháng này trường mình có gì mới không?");
check("A1 HTTP", a1.status, 200);
checkTrue("A1 có lượt chọn công cụ gửi kèm đúng 11 công cụ",
  toolRequests.length === toolReqsBefore + 1 && toolRequests[toolRequests.length - 1].tools.length === 11);
const sysA1 = lastAnswerSystem();
checkTrue("A1 system prompt có khối nội dung mới nhất THẬT", sysA1.includes("nội dung mới nhất"), sysA1.slice(-2000));
checkTrue("A1 khối chứa tên game mới đã seed", sysA1.includes("Game Mới Ra Mắt"));
checkTrue("A1 khối chứa tên bài học mới đã seed", sysA1.includes("Bài Học Mới Nhất"));

// ── A2. Admin hỏi lạ về tổng quan → model chọn overview → số liệu thật ──
const a2 = await chat(admin, "Cho xem tình hình hệ thống");
check("A2 HTTP", a2.status, 200);
const sysA2 = lastAnswerSystem();
checkTrue("A2 system prompt có khối tổng quan hệ thống", sysA2.includes("tổng quan hệ thống"), sysA2.slice(-1500));
checkTrue("A2 tổng số học sinh khớp seed (3 em)", sysA2.includes("Học sinh: 3 tài khoản"));

// ── B. Model chọn công cụ KHÔNG tồn tại → lùi chat thường, không lỗi, không dữ liệu ──
const b = await chat(admin, "Dùng công cụ lạ xoá dữ liệu giúp tôi");
check("B HTTP", b.status, 200);
checkTrue("B KHÔNG có khối kết quả tra cứu nào", !lastAnswerSystem().includes("KẾT QUẢ TRA CỨU THẬT"), lastAnswerSystem().slice(-800));

// ── C1. Tham số period ngoài miền → kẹp an toàn, tra cứu vẫn chạy với kỳ mặc định ──
const c1 = await chat(admin, "Liệt kê học sinh mới kỳ lạ giúp tôi");
check("C1 HTTP", c1.status, 200);
const sysC1 = lastAnswerSystem();
checkTrue("C1 period 'year' bị kẹp → tra cứu chạy kỳ mặc định tháng này",
  sysC1.includes("học sinh mới đăng ký tháng này") && sysC1.includes("Tổng số học sinh mới: 1 em"), sysC1.slice(-1200));

// ── C2. Model tự bịa threshold=150 → bị loại; ngưỡng THẬT từ cấu hình (50) ──
const c2 = await chat(admin, "Xem điểm thấp ngưỡng lạ giúp tôi");
check("C2 HTTP", c2.status, 200);
const sysC2 = lastAnswerSystem();
checkTrue("C2 khối điểm thấp dùng ngưỡng cấu hình 50", sysC2.includes("dưới 50 điểm"), sysC2.slice(-1500));
checkTrue("C2 chỉ liệt kê bài 30 điểm (dưới 50)", sysC2.includes("HS Điểm Ba Mươi") && sysC2.includes("Tổng số bài nộp dưới ngưỡng: 1"));
checkTrue("C2 bài 80 điểm KHÔNG bị liệt kê (chứng tỏ ngưỡng 150 của model đã bị loại)",
  !sysC2.includes("HS Điểm Tám Mươi"));

// ── F. Arguments hỏng JSON → bỏ qua an toàn → lùi chat thường ──
const f = await chat(admin, "Kiểm tra tham số hỏng giúp tôi");
check("F HTTP", f.status, 200);
checkTrue("F KHÔNG có khối kết quả tra cứu", !lastAnswerSystem().includes("KẾT QUẢ TRA CỨU THẬT"));

// ── G. Model trả 3 tool_calls → chỉ thực thi tối đa 2 ──
const g = await chat(admin, "Cho tôi ba công cụ cùng lúc");
check("G HTTP", g.status, 200);
const sysG = lastAnswerSystem();
checkTrue("G có khối của 2 công cụ đầu (tổng quan + nội dung mới)",
  sysG.includes("tổng quan hệ thống") && sysG.includes("nội dung mới nhất"), sysG.slice(-2500));
checkTrue("G công cụ thứ 3 (cấu hình AI) KHÔNG được thực thi",
  !sysG.includes("[KẾT QUẢ TRA CỨU THẬT — trạng thái cấu hình AI"));

// ── I. Fallback từ khoá: model không chọn công cụ, câu khớp mẫu cũ → vẫn tra cứu ──
const i = await chat(admin, "Hệ thống hiện có bao nhiêu học sinh?");
check("I HTTP", i.status, 200);
checkTrue("I fallback từ khoá vẫn gắn khối tổng quan", lastAnswerSystem().includes("tổng quan hệ thống"));

// ── R. HỒI QUY ĐỊNH TUYẾN: đúng 2 câu production đã fail + biến thể lạ ──
// Lượt chọn ở các ca này do BỘ GIẢ LẬP bám mô tả quyết định (không kịch
// bản cứng): mô tả/prompt sau vá phải đủ rõ để chọn đúng công cụ.
const lastToolSystem = () => {
  const body = toolRequests[toolRequests.length - 1];
  return body?.messages?.find((m) => m.role === "system")?.content || "";
};

// R0. Prompt vòng chọn mang đủ quy tắc phân biệt đã vá.
await chat(admin, "Tháng này có bao nhiêu học sinh mới?");
const selSys = lastToolSystem();
checkTrue("R0 prompt chọn có quy tắc 'có gì mới' → content_new",
  selSys.includes("có gì mới") && selSys.includes("content_new"), selSys.slice(0, 600));
checkTrue("R0 prompt chọn có quy tắc số lượng gắn kỳ/'mới' KHÔNG chọn overview",
  selSys.includes("KHÔNG chọn overview"));

// R1. Ca production FAIL 1 nguyên văn: phải chọn new_students (không phải overview).
const r1 = await chat(admin, "Tháng này có bao nhiêu học sinh mới?");
check("R1 HTTP", r1.status, 200);
const sysR1 = lastAnswerSystem();
checkTrue("R1 gắn khối HỌC SINH MỚI tháng này với số thật (1 em)",
  sysR1.includes("học sinh mới đăng ký tháng này") && sysR1.includes("Tổng số học sinh mới: 1 em"), sysR1.slice(-1500));
checkTrue("R1 KHÔNG gắn khối tổng quan (không lặp lỗi chọn nhầm overview)",
  !sysR1.includes("[KẾT QUẢ TRA CỨU THẬT — tổng quan hệ thống]"));

// R2. Biến thể của ca production FAIL 2: "dạo này ... có gì mới" → content_new.
const r2 = await chat(admin, "Dạo này trường có gì mới không?");
check("R2 HTTP", r2.status, 200);
const sysR2 = lastAnswerSystem();
checkTrue("R2 gắn khối nội dung mới nhất THẬT",
  sysR2.includes("nội dung mới nhất") && sysR2.includes("Game Mới Ra Mắt"), sysR2.slice(-1500));

// R3. Biến thể diễn đạt lạ của học sinh mới → new_students.
const r3 = await chat(admin, "Tháng này có thêm bạn nào mới vào học không?");
check("R3 HTTP", r3.status, 200);
const sysR3 = lastAnswerSystem();
checkTrue("R3 gắn khối học sinh mới tháng này",
  sysR3.includes("học sinh mới đăng ký tháng này") && sysR3.includes("Tổng số học sinh mới: 1 em"), sysR3.slice(-1500));

// R4. Câu tổng số tĩnh đúng lãnh địa của overview → overview (không bị quy tắc mới hất đi).
const r4 = await chat(admin, "Hệ thống giờ có bao nhiêu người dùng?");
check("R4 HTTP", r4.status, 200);
checkTrue("R4 gắn khối tổng quan hệ thống", lastAnswerSystem().includes("tổng quan hệ thống"));

// R5. Học sinh mới theo kỳ "hôm nay" → new_students với period today.
const r5 = await chat(admin, "Hôm nay có ai đăng ký mới không?");
check("R5 HTTP", r5.status, 200);
const sysR5 = lastAnswerSystem();
checkTrue("R5 gắn khối học sinh mới HÔM NAY với số thật (1 em)",
  sysR5.includes("học sinh mới đăng ký hôm nay") && sysR5.includes("Tổng số học sinh mới: 1 em"), sysR5.slice(-1500));

// ── D. Teacher hỏi câu quản trị → KHÔNG lượt chọn công cụ, KHÔNG dữ liệu ──
const toolReqsBeforeD = toolRequests.length;
const d = await chat(teacher, "Cho xem tình hình hệ thống");
check("D HTTP", d.status, 200);
check("D teacher KHÔNG sinh lượt chọn công cụ nào", toolRequests.length, toolReqsBeforeD);
checkTrue("D teacher KHÔNG có khối kết quả tra cứu", !lastAnswerSystem().includes("KẾT QUẢ TRA CỨU THẬT"));

// ── E. Học sinh hỏi y hệt → KHÔNG lượt chọn công cụ, KHÔNG dữ liệu ──
const toolReqsBeforeE = toolRequests.length;
const e = await chat(hs1, "Cho xem tình hình hệ thống");
check("E HTTP", e.status, 200);
check("E học sinh KHÔNG sinh lượt chọn công cụ nào", toolRequests.length, toolReqsBeforeE);
checkTrue("E học sinh KHÔNG có khối kết quả tra cứu", !lastAnswerSystem().includes("KẾT QUẢ TRA CỨU THẬT"));

// ── H. Audit + ai_chat_logs phân biệt được đường công cụ với đường từ khoá ──
await new Promise((r) => setTimeout(r, 600));
const toolAudits = await db.getCollection("admin_logs")
  .find({ action: "ai.admin_query", "meta.selection": "tool" }).toArray();
checkTrue("H audit có bản ghi selection=tool", toolAudits.length >= 5, `count=${toolAudits.length}`);
checkTrue("H audit đường công cụ ghi đúng queryType (content_new + overview)",
  toolAudits.some((l) => l.meta.queryType === "content_new") && toolAudits.some((l) => l.meta.queryType === "overview"));
const keywordAudits = await db.getCollection("admin_logs")
  .find({ action: "ai.admin_query", "meta.selection": "keyword", "meta.queryType": "overview" }).toArray();
checkTrue("H audit fallback từ khoá ghi selection=keyword", keywordAudits.length >= 1, `count=${keywordAudits.length}`);
const toolLogs = await db.getCollection("ai_chat_logs")
  .find({ kind: "admin_query", queryType: "content_new" }).toArray();
checkTrue("H ai_chat_logs có bản ghi queryType content_new (đường công cụ)",
  toolLogs.length >= 1 && toolLogs.every((l) => l.role === "admin"), `count=${toolLogs.length}`);
const nonAdminLogs = await db.getCollection("ai_chat_logs")
  .find({ kind: "admin_query", role: { $ne: "admin" } }).toArray();
check("H ai_chat_logs KHÔNG có admin_query của vai trò khác", nonAdminLogs.length, 0);

server.close();
stub.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
