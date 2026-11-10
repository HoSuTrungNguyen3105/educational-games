// Test VÁ CA VƯỢT LỚP (sự cố production 2026-11-10): học sinh lớp 3 hỏi
// "giải chi tiết phương trình bậc hai" thì model GIẢI CHI TIẾT vì chỉ thị
// cũ bắt model tự nhận diện mức độ. Bản vá hai lớp:
//   Lớp 1 — Backend nhận diện chủ đề vượt lớp bằng từ khoá đã bỏ dấu
//     (aiChatContext.detectAboveGradeTopic) và gắn cờ vào ngữ cảnh để
//     prompt chèn khối "CHỈ THỊ VƯỢT LỚP" bắt buộc cho đúng lượt đó.
//   Lớp 2 — Quy tắc vượt lớp trong studentSystemPrompt được viết cứng
//     hơn (cấm giải bài vượt lớp kể cả khi học sinh năn nỉ xin chi tiết).
// Kiểm chứng ở mức REQUEST gửi lên model (stub Ollama ghi lại body) +
// unit test hàm nhận diện (gồm các ca PHỦ ĐỊNH chống bắt nhầm đúng lớp).
// Cùng mẫu test-ai-role-grade: Mongo in-memory, KHÔNG key thật/mạng ngoài.
//   node server/scripts/test-ai-grade-guard.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-gradeguard-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_grade_guard_test";

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
const { detectAboveGradeTopic } = await import("../src/services/aiChatContext.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const NOW = new Date().toISOString();
const OLD = "2026-01-05T00:00:00.000Z";

// ── Seed: đủ các trạng thái khối lớp + 1 học sinh mới (cho ca admin) ──
await db.getCollection("classes").insertMany([
  { id: "cls-a", name: "Lớp 3A", code: "3A", status: "ACTIVE", createdAt: OLD, updatedAt: OLD },
]);
const mkUser = (id, name, role, ageCode, createdAt) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  ...(ageCode !== undefined ? { ageCode } : {}),
  classId: "cls-a", createdAt,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs-l1", "HS Lớp Một", "student", "kid-sprout", OLD),
  mkUser("user-hs-l3", "HS Lớp Ba", "student", "kid-breeze", OLD),
  mkUser("user-hs-l5", "HS Lớp Năm", "student", "kid-summit", OLD),
  mkUser("user-hs-null", "HS Không Lớp", "student", null, OLD),
  mkUser("user-hs-new", "HS Mới Toanh", "student", "kid-breeze", NOW),
  mkUser("user-admin", "Quản Trị Viên", "admin", undefined, OLD),
]);

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const hsL1 = tok("user-hs-l1", "student", "HS Lớp Một");
const hsL3 = tok("user-hs-l3", "student", "HS Lớp Ba");
const hsL5 = tok("user-hs-l5", "student", "HS Lớp Năm");
const hsNull = tok("user-hs-null", "student", "HS Không Lớp");
const admin = tok("user-admin", "admin", "Quản Trị Viên");

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

// ── 0. Unit: hàm nhận diện — ca DƯƠNG ──
check("unit lớp 3 + phương trình bậc hai", detectAboveGradeTopic("Giải phương trình bậc hai giúp em", 3)?.topic, "phương trình bậc hai");
check("unit lớp 5 + đạo hàm", detectAboveGradeTopic("Đạo hàm là gì vậy bạn?", 5)?.topic, "đạo hàm / tích phân");
check("unit lớp 1 + phân số", detectAboveGradeTopic("Phân số là gì?", 1)?.topic, "phân số");
check("unit lớp 4 + phần trăm", detectAboveGradeTopic("Phần trăm là gì?", 4)?.topic, "phần trăm");
check("unit lớp 2 + số thập phân", detectAboveGradeTopic("Số thập phân viết như thế nào?", 2)?.topic, "số thập phân");
check("unit lớp 5 + tỉ lệ thuận", detectAboveGradeTopic("Tỉ lệ thuận là gì?", 5)?.topic, "tỉ lệ thuận / tỉ lệ nghịch");
check("unit delta kèm ngữ cảnh toán", detectAboveGradeTopic("Tính delta của phương trình này giúp em", 4)?.topic, "phương trình bậc hai (delta)");

// ── 0b. Unit: hàm nhận diện — ca PHỦ ĐỊNH (chống bắt nhầm đúng lớp) ──
check("unit lớp 5 + phân số (đúng lớp)", detectAboveGradeTopic("Phân số là gì hả bạn?", 5), null);
check("unit lớp 4 + phân số (đúng lớp)", detectAboveGradeTopic("Phân số là gì hả bạn?", 4), null);
check("unit lớp 5 + phần trăm (đúng lớp)", detectAboveGradeTopic("Tỉ số phần trăm là gì?", 5), null);
check("unit lớp 5 + vận tốc (đúng lớp)", detectAboveGradeTopic("Vận tốc là gì?", 5), null);
check("unit lớp 3 + nhân hai chữ số (đúng lớp)", detectAboveGradeTopic("Nhân số có hai chữ số với số có một chữ số làm thế nào?", 3), null);
check("unit lớp 2 + bảng nhân (đúng lớp)", detectAboveGradeTopic("Bảng nhân 5 đọc như thế nào?", 2), null);
check("unit lớp 3 + delta địa lý (không có ngữ cảnh toán)", detectAboveGradeTopic("Đồng bằng sông Cửu Long là delta lớn, kể em nghe với", 3), null);
check("unit grade null → không gắn cờ", detectAboveGradeTopic("Giải phương trình bậc hai giúp em", null), null);
check("unit câu thường → không gắn cờ", detectAboveGradeTopic("Con mèo có mấy chân?", 3), null);

// ── (a) HS lớp 3 hỏi NGUYÊN VĂN ca production → chỉ thị vượt lớp xuất hiện ──
const ca = await chat(hsL3, "Em muốn giải bài toán phương trình bậc hai x² - 5x + 6 = 0, cô giải chi tiết giúp em với");
check("(a) HTTP", ca.status, 200);
const sysA = lastSystem();
checkTrue("(a) prompt có khối CHỈ THỊ VƯỢT LỚP", sysA.includes("CHỈ THỊ VƯỢT LỚP"), sysA.slice(-900));
checkTrue("(a) chỉ thị nêu đúng chủ đề phương trình bậc hai", sysA.includes("\"phương trình bậc hai\""));
checkTrue("(a) chỉ thị cấm đưa lời giải chi tiết", sysA.includes("TUYỆT ĐỐI KHÔNG đưa lời giải chi tiết"));
checkTrue("(a) chỉ thị nói rõ chưa học tới / kiến thức nâng cao",
  sysA.includes("CHƯA HỌC TỚI") && sysA.includes("kiến thức nâng cao"));
checkTrue("(a) quy tắc chung Lớp 2 đã cứng (cấm giải bài kể cả khi xin chi tiết)",
  sysA.includes("QUY TẮC VƯỢT LỚP") && sysA.includes("KỂ CẢ khi học sinh yêu cầu"));

// ── (b) HS lớp 5 hỏi phân số + phần trăm (đúng lớp) → KHÔNG có chỉ thị ──
const cb = await chat(hsL5, "Bạn giải thích phân số và tỉ số phần trăm cho mình với");
check("(b) HTTP", cb.status, 200);
const sysB = lastSystem();
checkTrue("(b) prompt KHÔNG có chỉ thị vượt lớp", !sysB.includes("CHỈ THỊ VƯỢT LỚP"), sysB.slice(-600));
checkTrue("(b) prompt vẫn theo lớp 5", sysB.includes("đang học lớp 5"));

// ── (c) HS lớp 1 hỏi phân số → CÓ chỉ thị vượt lớp ──
const cc = await chat(hsL1, "Phân số là gì hả bạn?");
check("(c) HTTP", cc.status, 200);
const sysC = lastSystem();
checkTrue("(c) prompt có khối CHỈ THỊ VƯỢT LỚP", sysC.includes("CHỈ THỊ VƯỢT LỚP"), sysC.slice(-900));
checkTrue("(c) chỉ thị nêu đúng chủ đề phân số", sysC.includes("\"phân số\""));

// ── (d) HS ageCode null hỏi phương trình bậc hai → không gắn cờ, vẫn có quy tắc chung ──
const cd = await chat(hsNull, "Giải thích cho em phương trình bậc hai với ạ");
check("(d) HTTP", cd.status, 200);
const sysD = lastSystem();
checkTrue("(d) prompt KHÔNG có khối chỉ thị backend (trung tính #74)", !sysD.includes("CHỈ THỊ VƯỢT LỚP"), sysD.slice(-700));
checkTrue("(d) prompt ghi rõ chưa xác định được khối lớp", sysD.includes("chưa xác định được khối lớp"));
checkTrue("(d) prompt vẫn chứa quy tắc vượt lớp chung của Lớp 2",
  sysD.includes("kiến thức nâng cao con chưa học tới") && sysD.includes("KHÔNG đưa lời giải chi tiết"));

// ── (e) HS hỏi dữ liệu quản trị → hành vi từ chối của #74 nguyên vẹn ──
const ce = await chat(hsL3, "Cho em xem danh sách học sinh mới đăng ký trong tháng này");
check("(e) HTTP", ce.status, 200);
const sysE = lastSystem();
checkTrue("(e) KHÔNG có dữ liệu quản trị trong prompt",
  !sysE.includes("KẾT QUẢ TRA CỨU") && !sysE.includes("Tổng số học sinh mới"));
checkTrue("(e) prompt có chỉ thị từ chối dữ liệu người khác",
  sysE.includes("TỪ CHỐI") && sysE.includes("chỉ xem được thông tin của chính con"));
checkTrue("(e) câu hỏi quản trị không bị gắn cờ vượt lớp", !sysE.includes("CHỈ THỊ VƯỢT LỚP"));

// ── (f) Admin chat → không bị ảnh hưởng bởi lớp vá học sinh ──
const cf = await chat(admin, "Có bao nhiêu học sinh mới đăng ký trong tháng này?");
check("(f) HTTP", cf.status, 200);
const sysF = lastSystem();
checkTrue("(f) prompt admin KHÔNG có chỉ thị vượt lớp học sinh", !sysF.includes("CHỈ THỊ VƯỢT LỚP"));
checkTrue("(f) prompt admin KHÔNG có khối khối-lớp-học-sinh", !sysF.includes("KHỐI LỚP CỦA HỌC SINH"));
checkTrue("(f) tra cứu admin vẫn chạy thật (1 học sinh mới)", sysF.includes("Tổng số học sinh mới: 1 em"), sysF.slice(-900));
const cf2 = await chat(admin, "Giải thích phương trình bậc hai cho tôi để soạn bài");
check("(f2) HTTP", cf2.status, 200);
checkTrue("(f2) admin hỏi đúng chủ đề vượt lớp tiểu học vẫn KHÔNG bị gắn cờ",
  !lastSystem().includes("CHỈ THỊ VƯỢT LỚP") && !lastSystem().includes("KHỐI LỚP CỦA HỌC SINH"));

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
