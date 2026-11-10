// Test MỞ RỘNG tra cứu quản trị cho chat AI + THU HẸP quyền chỉ ADMIN
// (Nguyên yêu cầu 2026-11-10): admin hỏi phần dữ liệu nào thì Backend tra
// cứu đúng phần đó (backend "gọi API nội bộ" lấy dữ liệu thật rồi đưa vào
// ngữ cảnh — model không tự gọi tool). Các nhóm MỚI: tổng quan hệ thống
// (overview), nội dung mới nhất (content_new), báo cáo & hỗ trợ đang chờ
// (support_backlog), hoạt động hỏi AI (ai_activity), trạng thái cấu hình
// AI an toàn (ai_config). Teacher hỏi Y HỆT → không tra cứu, không dữ
// liệu hệ thống nào trong prompt; học sinh → bị chặn như cũ; ngưỡng điểm
// thấp của #74 giữ nguyên; audit + ai_chat_logs vẫn gắn đúng.
// Cùng mẫu test-ai-role-grade: Mongo in-memory + stub Ollama ghi lại
// request để kiểm system prompt. KHÔNG dùng key thật, KHÔNG gọi mạng ngoài.
//   node server/scripts/test-ai-admin-scope.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-admin-scope-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_admin_scope_test";

process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

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
      chatRequests.push(JSON.parse(options.body || "{}"));
      return json({ message: { role: "assistant", content: "Câu trả lời mẫu từ stub." }, done: true });
    }
  }
  return realFetch(url, options);
};

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig, get: getCfg } = await import("../src/services/systemConfigService.js");
const { detectAdminQuery } = await import("../src/services/aiAdminQueryService.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const NOW = new Date().toISOString();
const OLD = "2026-01-05T00:00:00.000Z";

// ── Seed người dùng: 3 học sinh / 1 giáo viên / 1 admin ──
const mkUser = (id, name, role, extra = {}) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  createdAt: OLD, ...extra,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs1", "HS Một", "student", { ageCode: "kid-breeze", classId: "cls-a" }),
  mkUser("user-hs2", "HS Hai", "student", { ageCode: "kid-river", classId: "cls-a" }),
  mkUser("user-hs-low", "HS Điểm Thấp", "student", { ageCode: "kid-breeze", classId: "cls-a" }),
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-admin", "Quản Trị Viên", "admin"),
]);
await db.getCollection("classes").insertMany([
  { id: "cls-a", name: "Lớp 3A", code: "3A", status: "ACTIVE", createdAt: OLD, updatedAt: OLD },
  { id: "cls-b", name: "Lớp 4B", code: "4B", status: "ACTIVE", createdAt: OLD, updatedAt: OLD },
]);
await db.getCollection("teacher_classes").insertMany([
  { id: "tc-1", teacherId: "user-gv1", classId: "cls-a", createdAt: OLD },
]);

// ── Seed điểm thấp (cho ca ngưỡng #74) ──
await db.getCollection("assignments").insertMany([
  { id: "as-1", teacherId: "user-gv1", title: "Kiểm tra Toán giữa kỳ", classId: "cls-a", code: "KT-A1", status: "ACTIVE", deadline: "2099-01-01T00:00:00.000Z", createdAt: OLD, updatedAt: OLD },
]);
await db.getCollection("submissions").insertMany([
  { id: "sub-low", assignmentId: "as-1", studentId: "user-hs-low", status: "SUBMITTED", score: 35, submittedAt: NOW, createdAt: NOW, updatedAt: NOW },
]);

// ── Seed nội dung: 2 game (1 published mới, 1 draft cũ), 1 bài học ──
await db.getCollection("games").insertMany([
  { id: "game-1", code: "GAME-MOI", name: "Game Toán Mới Nhất", description: "mô tả", subject: "Toán", status: "published", questionsCount: 10, playersCount: 0, createdAt: NOW, updatedAt: NOW },
  { id: "game-2", code: "GAME-CU", name: "Game Văn Bản Nháp", description: "mô tả", subject: "Văn", status: "draft", questionsCount: 5, playersCount: 0, createdAt: OLD, updatedAt: OLD },
]);
await db.getCollection("lessons").insertMany([
  { id: "les-1", ownerId: "user-gv1", title: "Bài Học Mới Nhất", subject: "Toán", status: "published", pages: [], createdAt: NOW, updatedAt: NOW },
]);
await db.getCollection("question_banks").insertMany([
  { id: "qb-1", content: "1 + 1 = ?", options: ["1", "2"], correctAnswer: "2", subject: "Toán" },
  { id: "qb-2", content: "2 + 2 = ?", options: ["3", "4"], correctAnswer: "4", subject: "Toán" },
]);

// ── Seed báo cáo & hỗ trợ: 1 report mở + 1 đã xử lý; 1 ticket mở + 1 done ──
await db.getCollection("reports").insertMany([
  { id: "rep-1", reporterId: "user-hs1", reporterUsername: "hs1", reporterName: "HS Một", reportedId: "user-hs2", reportedUsername: "hs2", reportedName: "HS Bị Báo Cáo", reason: "bad_language", note: "", status: "open", createdAt: NOW, updatedAt: NOW },
  { id: "rep-2", reporterId: "user-hs1", reporterUsername: "hs1", reporterName: "HS Một", reportedId: "user-hs2", reportedUsername: "hs2", reportedName: "HS Bị Báo Cáo", reason: "other", note: "", status: "resolved", createdAt: OLD, updatedAt: OLD },
]);
await db.getCollection("support_tickets").insertMany([
  { id: "tick-1", code: "HT-001", title: "Không đăng nhập được", content: "nội dung", priority: "high", status: "open", reply: "", userId: "user-hs1", username: "hs1", userRole: "student", assigneeType: "admin", assigneeId: null, assigneeUsername: "", assigneeName: "", classId: null, createdAt: NOW, updatedAt: NOW },
  { id: "tick-2", code: "HT-002", title: "Ticket Đã Xong", content: "nội dung", priority: "low", status: "done", reply: "", userId: "user-hs1", username: "hs1", userRole: "student", assigneeType: "admin", assigneeId: null, assigneeUsername: "", assigneeName: "", classId: null, createdAt: OLD, updatedAt: OLD },
]);

// ── Seed lịch sử hỏi AI: 3 lượt (hs1 ×2 chat, admin ×1 admin_query), đều "hôm nay" ──
await db.getCollection("ai_chat_logs").insertMany([
  { id: "log-1", userId: "user-hs1", username: "hs1", role: "student", grade: 3, classId: "cls-a", question: "Câu hỏi đánh dấu alpha", answer: "trả lời", sources: [], conversationId: null, kind: "chat", queryType: null, createdAt: NOW },
  { id: "log-2", userId: "user-hs1", username: "hs1", role: "student", grade: 3, classId: "cls-a", question: "Câu hỏi đánh dấu beta", answer: "trả lời", sources: [], conversationId: null, kind: "chat", queryType: null, createdAt: NOW },
  { id: "log-3", userId: "user-admin", username: "admin", role: "admin", grade: null, classId: null, question: "Câu hỏi quản trị cũ", answer: "trả lời", sources: [], conversationId: null, kind: "admin_query", queryType: "new_students", createdAt: NOW },
]);

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const admin = tok("user-admin", "admin", "Quản Trị Viên");
const teacher = tok("user-gv1", "teacher", "Giáo Viên Một");
const hs1 = tok("user-hs1", "student", "HS Một");

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
const lastSystem = () => {
  const body = chatRequests[chatRequests.length - 1];
  return body?.messages?.find((m) => m.role === "system")?.content || "";
};

// ── 0. detectAdminQuery: bản đồ intent mới + không nuốt câu thường ──
check("intent overview", detectAdminQuery("Hệ thống hiện có bao nhiêu học sinh?")?.type, "overview");
check("intent content_new", detectAdminQuery("Bài học nào mới được tạo gần đây?")?.type, "content_new");
check("intent support (report)", detectAdminQuery("Có báo cáo người dùng nào chưa xử lý không?")?.type, "support_backlog");
check("intent support (ticket)", detectAdminQuery("Có ticket hỗ trợ nào đang mở không?")?.type, "support_backlog");
check("intent ai_activity", detectAdminQuery("Hôm nay có bao nhiêu lượt hỏi AI?")?.type, "ai_activity");
check("intent ai_config (model)", detectAdminQuery("AI đang dùng model gì?")?.type, "ai_config");
check("intent ai_config (ngưỡng)", detectAdminQuery("Ngưỡng điểm thấp đã đặt là bao nhiêu?")?.type, "ai_config");
check("intent điểm thấp vẫn là low_scores", detectAdminQuery("Danh sách học sinh có điểm kiểm tra thấp?")?.type, "low_scores");
check("intent học sinh mới vẫn là new_students", detectAdminQuery("Có bao nhiêu học sinh mới đăng ký tháng này?")?.type, "new_students");
check("câu thường không khớp intent nào", detectAdminQuery("Giải thích giúp tôi phép nhân là gì"), null);
check("câu hỏi về game trong bài học không khớp content_new", detectAdminQuery("Game là gì?"), null);

// ── A1 (chạy ĐẦU TIÊN). Admin hỏi hoạt động AI hôm nay → đúng 3 lượt seed ──
// Chạy trước mọi lượt chat khác để ai_chat_logs chưa bị cộng thêm bản ghi
// của chính các ca test phía sau (recordChatLog ghi sau mỗi lượt chat).
const a1 = await chat(admin, "Hôm nay có bao nhiêu lượt hỏi AI?");
check("A1 HTTP", a1.status, 200);
const sysA1 = lastSystem();
checkTrue("A1 tổng lượt hỏi AI = 3 (đúng seed)", sysA1.includes("Tổng số lượt hỏi AI: 3 lượt"), sysA1.slice(-1200));
checkTrue("A1 tách chat thường 2 / tra cứu quản trị 1", sysA1.includes("chat thường 2") && sysA1.includes("tra cứu quản trị 1"));
checkTrue("A1 người hỏi nhiều nhất là hs1 (2 lượt)", sysA1.includes("hs1: 2 lượt"));

// ── A2. Admin hỏi tổng quan hệ thống → số đếm khớp seed ──
const a2 = await chat(admin, "Hệ thống hiện có bao nhiêu học sinh, giáo viên và lớp học?");
check("A2 HTTP", a2.status, 200);
const sysA2 = lastSystem();
checkTrue("A2 có khối tổng quan hệ thống", sysA2.includes("tổng quan hệ thống"), sysA2.slice(-1200));
checkTrue("A2 học sinh: 3 / giáo viên: 1 / admin: 1",
  sysA2.includes("Học sinh: 3 tài khoản") && sysA2.includes("Giáo viên: 1 tài khoản") && sysA2.includes("Quản trị viên: 1 tài khoản"));
checkTrue("A2 lớp: 2, game 1/2 published, bài học 1/1, ngân hàng 2 câu",
  sysA2.includes("Lớp học: 2 lớp") && sysA2.includes("Trò chơi: 1/2 đã xuất bản")
  && sysA2.includes("Bài học: 1/1 đã xuất bản") && sysA2.includes("Ngân hàng câu hỏi: 2 câu hỏi"));

// ── A3. Admin hỏi nội dung mới nhất → tên thật, đúng thứ tự mới → cũ ──
const a3 = await chat(admin, "Game và bài học nào mới được tạo gần đây?");
check("A3 HTTP", a3.status, 200);
const sysA3 = lastSystem();
checkTrue("A3 có game mới nhất đứng trước game cũ",
  sysA3.includes("Game Toán Mới Nhất") && sysA3.indexOf("Game Toán Mới Nhất") < sysA3.indexOf("Game Văn Bản Nháp"), sysA3.slice(-1200));
checkTrue("A3 có bài học mới nhất + tổng câu hỏi ngân hàng", sysA3.includes("Bài Học Mới Nhất") && sysA3.includes("hiện có 2 câu hỏi"));

// ── A4. Admin hỏi báo cáo & hỗ trợ đang chờ → chỉ đếm phần chưa xử lý ──
const a4 = await chat(admin, "Có bao nhiêu báo cáo người dùng chưa xử lý và ticket hỗ trợ đang mở?");
check("A4 HTTP", a4.status, 200);
const sysA4 = lastSystem();
checkTrue("A4 báo cáo chưa xử lý = 1", sysA4.includes("Báo cáo người dùng chưa xử lý: 1 báo cáo"), sysA4.slice(-1200));
checkTrue("A4 nêu người bị báo cáo + lý do đã dịch nhãn", sysA4.includes("HS Bị Báo Cáo") && sysA4.includes("Ngôn từ xấu"));
checkTrue("A4 ticket đang chờ = 1 + tiêu đề ticket mở", sysA4.includes("đang chờ xử lý (chưa hoàn thành/đóng): 1 yêu cầu") && sysA4.includes("Không đăng nhập được"));
checkTrue("A4 KHÔNG nêu ticket đã xong", !sysA4.includes("Ticket Đã Xong"));

// ── A5. Admin hỏi trạng thái cấu hình AI → an toàn, không secret ──
const a5 = await chat(admin, "AI đang dùng model gì? Ngưỡng điểm thấp đã đặt chưa?");
check("A5 HTTP", a5.status, 200);
const sysA5 = lastSystem();
checkTrue("A5 trợ lý đang bật", sysA5.includes("Trợ lý AI: ĐANG BẬT"), sysA5.slice(-900));
checkTrue("A5 có model đang dùng (gpt-oss:20b của stub)", sysA5.includes("Model đang dùng: gpt-oss:20b"));
checkTrue("A5 ngưỡng chưa cấu hình", sysA5.includes("Ngưỡng điểm thấp: CHƯA ĐƯỢC CẤU HÌNH"));
checkTrue("A5 KHÔNG lộ bất kỳ khoá/secret nào", !sysA5.includes("stub-cloud-key") && !/api[_ ]?key/i.test(sysA5));

// ── B1. Teacher hỏi Y HỆT nhóm CŨ (điểm thấp) → không tra cứu ──
const b1 = await chat(teacher, "Danh sách học sinh có điểm kiểm tra thấp trong tháng này?");
check("B1 HTTP", b1.status, 200);
const sysB1 = lastSystem();
checkTrue("B1 teacher KHÔNG có khối kết quả tra cứu", !sysB1.includes("KẾT QUẢ TRA CỨU THẬT"));
checkTrue("B1 teacher KHÔNG thấy dữ liệu hệ thống nào", !sysB1.includes("HS Điểm Thấp") && !sysB1.includes("35 điểm"));
checkTrue("B1 teacher dùng prompt chat thường (không prompt quản trị, không khối lớp học sinh)",
  !sysB1.includes("QUẢN TRỊ VIÊN") && !/đang học lớp [1-5]/.test(sysB1));

// ── B2. Teacher hỏi Y HỆT nhóm MỚI (tổng quan) → không tra cứu ──
const b2 = await chat(teacher, "Hệ thống hiện có bao nhiêu học sinh, giáo viên và lớp học?");
check("B2 HTTP", b2.status, 200);
const sysB2 = lastSystem();
checkTrue("B2 teacher KHÔNG có số liệu tổng quan", !sysB2.includes("tổng quan hệ thống") && !sysB2.includes("Học sinh: 3 tài khoản"));

// ── C. Học sinh hỏi giống hệt → bị chặn như cũ ──
const cC = await chat(hs1, "Hệ thống hiện có bao nhiêu học sinh?");
check("C HTTP", cC.status, 200);
const sysC = lastSystem();
checkTrue("C học sinh KHÔNG có dữ liệu quản trị", !sysC.includes("KẾT QUẢ TRA CỨU THẬT") && !sysC.includes("Học sinh: 3 tài khoản"));
checkTrue("C học sinh vẫn có chỉ thị từ chối dữ liệu người khác", sysC.includes("TỪ CHỐI"));

// ── D. Admin hỏi câu chat thường → không chạy tra cứu thừa ──
const dD = await chat(admin, "Giải thích giúp tôi phép nhân là gì để tôi soạn bài giảng");
check("D HTTP", dD.status, 200);
checkTrue("D admin chat thường KHÔNG có khối kết quả tra cứu dữ liệu",
  !lastSystem().includes("KẾT QUẢ TRA CỨU THẬT"));

// ── F. Ngưỡng điểm thấp của #74 còn nguyên ──
const f1 = await chat(admin, "Danh sách học sinh có điểm kiểm tra thấp trong tháng này?");
check("F1 HTTP", f1.status, 200);
checkTrue("F1 chưa cấu hình → ngữ cảnh yêu cầu hỏi lại ngưỡng", lastSystem().includes("CHƯA ĐƯỢC CẤU HÌNH ngưỡng điểm thấp"), lastSystem().slice(-700));
await updateConfig({ ai: { lowScoreThreshold: 50 } });
check("F ngưỡng đã lưu 50", await getCfg("ai.lowScoreThreshold", { fresh: true }), 50);
const f2 = await chat(admin, "Danh sách học sinh có điểm kiểm tra thấp trong tháng này?");
check("F2 HTTP", f2.status, 200);
checkTrue("F2 có học sinh dưới ngưỡng (HS Điểm Thấp, 35 điểm)",
  lastSystem().includes("HS Điểm Thấp") && lastSystem().includes("35 điểm"), lastSystem().slice(-900));

// ── E. Audit + ai_chat_logs cho các queryType mới ──
// recordChatLog ghi fire-and-forget sau response → chờ một nhịp rồi mới đọc.
await new Promise((r) => setTimeout(r, 600));
const auditLogs = await db.getCollection("admin_logs").find({ action: "ai.admin_query" }).toArray();
const auditTypes = new Set(auditLogs.map((l) => l.meta?.queryType));
checkTrue("E audit có đủ 5 queryType MỚI",
  ["overview", "content_new", "support_backlog", "ai_activity", "ai_config"].every((t) => auditTypes.has(t)),
  [...auditTypes].join(","));
checkTrue("E audit vẫn có low_scores của #74", auditTypes.has("low_scores"));
checkTrue("E audit meta chỉ gồm queryType + resultCount",
  auditLogs.every((l) => l.meta && typeof l.meta.queryType === "string" && typeof l.meta.resultCount === "number"));
const chatLogs = await db.getCollection("ai_chat_logs").find({ kind: "admin_query" }).toArray();
const chatLogTypes = new Set(chatLogs.map((l) => l.queryType));
checkTrue("E ai_chat_logs gắn kind admin_query + queryType mới",
  ["overview", "ai_activity", "ai_config"].every((t) => chatLogTypes.has(t)), [...chatLogTypes].join(","));
checkTrue("E ai_chat_logs KHÔNG có bản ghi tra cứu nào của giáo viên",
  chatLogs.every((l) => l.role === "admin" || l.userId === "user-admin" || l.queryType === "new_students"));

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
