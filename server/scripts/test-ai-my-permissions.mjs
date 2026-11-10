// Test ADMIN TỰ TRA CỨU QUYỀN CỦA CHÍNH MÌNH qua chat AI (intent mới
// `my_permissions`) + ranh giới bảo mật trong prompt admin đã viết lại
// (Nguyên yêu cầu 2026-11-10 sau sự cố admin hỏi "tôi có những quyền gì"
// thì AI từ chối): Backend tra mảng quyền hiệu lực THẬT của vai trò admin
// (đúng đường GET /auth/me dùng — permissionService.getRolePermissions)
// và trình bày bằng NHÃN TIẾNG VIỆT của FEATURES. Chỉ admin kích hoạt
// được; teacher/học sinh hỏi y hệt → không tra cứu, không dữ liệu quyền.
// PR này xếp chồng lên PR #80 (cổng admin-only).
// Cùng mẫu test-ai-admin-scope: Mongo in-memory + stub Ollama ghi lại
// request để kiểm system prompt. KHÔNG dùng key thật, KHÔNG gọi mạng ngoài.
//   node server/scripts/test-ai-my-permissions.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-my-permissions-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_my_permissions_test";

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
const { updateConfig } = await import("../src/services/systemConfigService.js");
const { detectAdminQuery, myPermissions } = await import("../src/services/aiAdminQueryService.js");
const { getRolePermissions } = await import("../src/services/permissionService.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const OLD = "2026-01-05T00:00:00.000Z";

// ── Seed người dùng tối thiểu: 1 admin / 1 giáo viên / 1 học sinh ──
const mkUser = (id, name, role, extra = {}) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  createdAt: OLD, ...extra,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs1", "HS Một", "student", { ageCode: "kid-breeze", classId: "cls-a" }),
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-admin", "Quản Trị Viên", "admin"),
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
// Số quyền thật mà hệ thống cấp cho role admin trong MÔI TRƯỜNG TEST này —
// đây là "seed" để đối chiếu: tra cứu của AI phải khớp đúng con số này.
const adminPermsSeed = await getRolePermissions("admin");

// ── 0. Nhận diện intent: khớp câu sở hữu, không nuốt câu phân quyền chung ──
check("intent my_permissions (câu gốc sự cố)", detectAdminQuery("Tôi có những quyền gì?")?.type, "my_permissions");
check("intent my_permissions (biến thể)", detectAdminQuery("Vai trò của tôi được phép làm gì trong hệ thống?")?.type, "my_permissions");
check("intent my_permissions (quyền hạn của tôi)", detectAdminQuery("Quyền hạn của tôi gồm những gì?")?.type, "my_permissions");
check("hỏi cách phân quyền cho giáo viên KHÔNG khớp my_permissions", detectAdminQuery("Phân quyền cho giáo viên thế nào?")?.type !== "my_permissions", true);
check("intent tổng quan của #80 không bị nuốt", detectAdminQuery("Hệ thống hiện có bao nhiêu học sinh?")?.type, "overview");

// ── 0b. Hàm tra cứu khớp đúng nguồn quyền của /auth/me ──
const mine = await myPermissions({ role: "admin" });
check("tra cứu: tổng số quyền khớp getRolePermissions(admin)", mine.total, adminPermsSeed.length);
checkTrue("tra cứu: ít nhất 20 mô-đun có quyền (admin toàn quyền)",
  mine.modules.length >= 20, `modules=${mine.modules.length}`);
checkTrue("tra cứu: vai trò hiển thị nhãn tiếng Việt", /Quản trị/.test(mine.roleLabel || ""), mine.roleLabel);

// ── A. Admin hỏi "Tôi có những quyền gì?" → có khối tra cứu thật ──
const a = await chat(admin, "Tôi có những quyền gì?");
check("A HTTP", a.status, 200);
const sysA = lastSystem();
checkTrue("A có khối kết quả quyền của chính người hỏi", sysA.includes("quyền của chính người đang hỏi"), sysA.slice(-2500));
checkTrue("A tổng số quyền khớp seed", sysA.includes(`Tổng số quyền đang có hiệu lực: ${adminPermsSeed.length} quyền`), sysA.slice(-2500));
checkTrue("A chứa nhãn mô-đun: Người dùng (xem, sửa, xóa)",
  sysA.includes("Người dùng: xem, sửa, xóa"), sysA.slice(-2500));
checkTrue("A chứa nhãn mô-đun: Báo cáo & thống kê",
  sysA.includes("Báo cáo & thống kê: xem, sửa, xóa"));
checkTrue("A chứa nhãn mô-đun: Phân quyền",
  sysA.includes("Phân quyền: xem, sửa, xóa"));
checkTrue("A admin có ghi nhận TOÀN QUYỀN mô-đun", sysA.includes("TOÀN QUYỀN mô-đun"));
checkTrue("A prompt admin cho phép trả lời quyền của chính người hỏi",
  sysA.includes("Quyền của CHÍNH người đang hỏi") && sysA.includes("ĐƯỢC PHÉP trả lời"));
checkTrue("A prompt vẫn cấm khoá API/secret/token",
  sysA.includes("CẤM TUYỆT ĐỐI") && sysA.includes("khoá API"));
checkTrue("A kết quả KHÔNG chứa secret/stub key nào",
  !sysA.includes("stub-cloud-key") && !/Bearer\s+\S+/.test(sysA));

// ── B. Admin hỏi biến thể → vẫn khớp intent ──
const b = await chat(admin, "Vai trò của tôi được phép làm gì trong hệ thống?");
check("B HTTP", b.status, 200);
checkTrue("B biến thể cũng có khối quyền của chính mình",
  lastSystem().includes("quyền của chính người đang hỏi"), lastSystem().slice(-1500));

// ── C1. Teacher hỏi y hệt → KHÔNG tra cứu, không dữ liệu quyền ──
const c1 = await chat(teacher, "Tôi có những quyền gì?");
check("C1 HTTP", c1.status, 200);
const sysC1 = lastSystem();
checkTrue("C1 teacher KHÔNG có khối kết quả tra cứu", !sysC1.includes("KẾT QUẢ TRA CỨU THẬT"));
checkTrue("C1 teacher KHÔNG có danh sách quyền nào",
  !sysC1.includes("Tổng số quyền đang có hiệu lực") && !sysC1.includes("Người dùng: xem, sửa, xóa"));

// ── C2. Học sinh hỏi y hệt → KHÔNG tra cứu, không dữ liệu quyền ──
const c2 = await chat(hs1, "Tôi có những quyền gì?");
check("C2 HTTP", c2.status, 200);
const sysC2 = lastSystem();
checkTrue("C2 học sinh KHÔNG có khối kết quả tra cứu", !sysC2.includes("KẾT QUẢ TRA CỨU THẬT"));
checkTrue("C2 học sinh KHÔNG có danh sách quyền nào",
  !sysC2.includes("Tổng số quyền đang có hiệu lực") && !sysC2.includes("Phân quyền: xem, sửa, xóa"));
checkTrue("C2 học sinh vẫn dùng prompt học sinh (chỉ thị dữ liệu của mình)",
  sysC2.includes("DỮ LIỆU CỦA NGƯỜI KHÁC") || sysC2.includes("chính mình") || sysC2.includes("chính con"));

// ── D1. Admin hỏi tra cứu cũ (tổng quan #80) → vẫn chạy đúng ──
const d1 = await chat(admin, "Hệ thống hiện có bao nhiêu học sinh, giáo viên và lớp học?");
check("D1 HTTP", d1.status, 200);
const sysD1 = lastSystem();
checkTrue("D1 tổng quan vẫn chạy", sysD1.includes("tổng quan hệ thống") && sysD1.includes("Học sinh: 1 tài khoản"), sysD1.slice(-1200));

// ── D2. Admin hỏi chat thường → không tra cứu thừa ──
const d2 = await chat(admin, "Giải thích giúp tôi phép nhân là gì để tôi soạn bài giảng");
check("D2 HTTP", d2.status, 200);
checkTrue("D2 chat thường KHÔNG có khối kết quả tra cứu", !lastSystem().includes("KẾT QUẢ TRA CỨU THẬT"));

// ── E. Audit + ai_chat_logs gắn đúng cho my_permissions ──
// recordChatLog ghi fire-and-forget sau response → chờ một nhịp rồi mới đọc.
await new Promise((r) => setTimeout(r, 600));
const auditLogs = await db.getCollection("admin_logs")
  .find({ action: "ai.admin_query", "meta.queryType": "my_permissions" }).toArray();
checkTrue("E audit có bản ghi queryType my_permissions", auditLogs.length >= 2, `count=${auditLogs.length}`);
checkTrue("E audit meta chỉ gồm queryType + resultCount",
  auditLogs.every((l) => l.meta && l.meta.queryType === "my_permissions" && typeof l.meta.resultCount === "number"));
checkTrue("E audit resultCount khớp tổng số quyền",
  auditLogs.every((l) => l.meta.resultCount === adminPermsSeed.length),
  JSON.stringify(auditLogs.map((l) => l.meta)));
const chatLogs = await db.getCollection("ai_chat_logs")
  .find({ kind: "admin_query", queryType: "my_permissions" }).toArray();
checkTrue("E ai_chat_logs gắn kind admin_query + queryType my_permissions",
  chatLogs.length >= 2 && chatLogs.every((l) => l.role === "admin"), `count=${chatLogs.length}`);
const teacherLogs = await db.getCollection("ai_chat_logs")
  .find({ queryType: "my_permissions", role: { $ne: "admin" } }).toArray();
check("E ai_chat_logs KHÔNG có my_permissions của vai trò khác", teacherLogs.length, 0);

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
