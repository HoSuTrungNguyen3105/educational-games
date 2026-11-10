// Test chat AI theo KHỐI LỚP + PHÂN QUYỀN VAI TRÒ (update_features.md mục 6):
// học sinh được cá nhân hoá theo khối lớp suy từ ageCode ở Backend (lớp 1/5,
// vượt lớp, không rõ lớp), học sinh bị chặn dữ liệu quản trị, admin tra cứu
// dữ liệu THẬT (đăng ký mới / điểm thấp theo ngưỡng cấu hình / chưa hoàn
// thành / thống kê / kết quả giảm), giáo viên bị chốt phạm vi lớp được
// phân công, và mọi lượt tra cứu đều ghi audit ai.admin_query.
// Cùng mẫu test-ai-buddy-context: Mongo in-memory + stub Ollama ghi lại
// request để kiểm system prompt. KHÔNG dùng key thật, KHÔNG gọi mạng ngoài.
//   node server/scripts/test-ai-role-grade.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-role-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_role_grade_test";

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
const { gradeForAgeCode } = await import("../src/config/ageCodes.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const NOW = new Date().toISOString();
const OLD = "2026-01-05T00:00:00.000Z";
const FUTURE = new Date(Date.now() + 7 * 86400_000).toISOString();

// ── Seed lớp + tài khoản (2 lớp, đủ vai trò, đủ trạng thái ageCode) ──
await db.getCollection("classes").insertMany([
  { id: "cls-a", name: "Lớp 3A", code: "3A", status: "ACTIVE", createdAt: OLD, updatedAt: OLD },
  { id: "cls-b", name: "Lớp 4B", code: "4B", status: "ACTIVE", createdAt: OLD, updatedAt: OLD },
]);
const mkUser = (id, name, role, ageCode, classId, createdAt) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  ...(ageCode !== undefined ? { ageCode } : {}),
  ...(classId ? { classId } : {}),
  createdAt,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs-l1", "HS Lớp Một", "student", "kid-sprout", "cls-a", OLD),
  mkUser("user-hs-l5", "HS Lớp Năm", "student", "kid-summit", "cls-a", OLD),
  mkUser("user-hs-null", "HS Không Lớp", "student", null, "cls-a", OLD),
  mkUser("user-hs-new1", "HS Mới Một", "student", "kid-breeze", "cls-a", NOW),
  mkUser("user-hs-new2", "HS Mới Hai", "student", "kid-breeze", "cls-b", NOW),
  mkUser("user-hs-lowa", "HS Điểm Thấp A", "student", "kid-breeze", "cls-a", OLD),
  mkUser("user-hs-lowb", "HS Điểm Thấp B", "student", "kid-river", "cls-b", OLD),
  mkUser("user-hs-high", "HS Điểm Cao", "student", "kid-breeze", "cls-a", OLD),
  mkUser("user-hs-dec", "HS Tụt Dốc", "student", "kid-breeze", "cls-a", OLD),
  mkUser("user-admin", "Quản Trị Viên", "admin", undefined, null, OLD),
  mkUser("user-gv1", "Giáo Viên Một", "teacher", undefined, null, OLD),
]);
await db.getCollection("teacher_classes").insertMany([
  { id: "tc-1", teacherId: "user-gv1", classId: "cls-a", createdAt: OLD },
]);

// ── Seed bài kiểm tra + bài nộp (điểm do "server chấm", thang 100) ──
await db.getCollection("assignments").insertMany([
  { id: "as-1", teacherId: "user-gv1", title: "Kiểm tra Toán giữa kỳ", classId: "cls-a", code: "KT-A1", status: "ACTIVE", deadline: FUTURE, createdAt: OLD, updatedAt: OLD },
  { id: "as-2", teacherId: "user-gv1", title: "Kiểm tra Văn cuối kỳ", classId: "cls-b", code: "KT-B1", status: "ACTIVE", deadline: FUTURE, createdAt: OLD, updatedAt: OLD },
]);
const mkSub = (id, assignmentId, studentId, score, submittedAt, status = "SUBMITTED") => ({
  id, assignmentId, studentId, status,
  ...(score != null ? { score } : {}),
  submittedAt, createdAt: submittedAt, updatedAt: submittedAt,
});
await db.getCollection("submissions").insertMany([
  mkSub("sub-lowa", "as-1", "user-hs-lowa", 35, NOW),
  mkSub("sub-lowb", "as-2", "user-hs-lowb", 42, NOW),
  mkSub("sub-high", "as-1", "user-hs-high", 90, NOW),
  mkSub("sub-dec1", "as-1", "user-hs-dec", 90, "2026-08-01T00:00:00.000Z"),
  mkSub("sub-dec2", "as-1", "user-hs-dec", 85, "2026-09-01T00:00:00.000Z"),
  mkSub("sub-dec3", "as-1", "user-hs-dec", 40, NOW),
  mkSub("sub-dec4", "as-1", "user-hs-dec", 35, NOW),
  mkSub("sub-prog", "as-1", "user-hs-new1", null, NOW, "IN_PROGRESS"),
]);

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const hsL1 = tok("user-hs-l1", "student", "HS Lớp Một");
const hsL5 = tok("user-hs-l5", "student", "HS Lớp Năm");
const hsNull = tok("user-hs-null", "student", "HS Không Lớp");
const admin = tok("user-admin", "admin", "Quản Trị Viên");
const teacher = tok("user-gv1", "teacher", "Giáo Viên Một");

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

// ── 0. Bảng khối lớp phía server khớp client ──
check("gradeForAgeCode kid-sprout", gradeForAgeCode("kid-sprout"), 1);
check("gradeForAgeCode kid-blossom", gradeForAgeCode("kid-blossom"), 2);
check("gradeForAgeCode kid-breeze", gradeForAgeCode("kid-breeze"), 3);
check("gradeForAgeCode kid-river", gradeForAgeCode("kid-river"), 4);
check("gradeForAgeCode kid-summit", gradeForAgeCode("kid-summit"), 5);
check("gradeForAgeCode null", gradeForAgeCode(null), null);
check("gradeForAgeCode lạ", gradeForAgeCode("kid-xyz"), null);

// ── 0b. Ngưỡng điểm thấp: coerce của cấu hình ──
await updateConfig({ ai: { lowScoreThreshold: "abc" } });
check("ngưỡng không phải số → null (chưa cấu hình)", await getCfg("ai.lowScoreThreshold", { fresh: true }), null);
await updateConfig({ ai: { lowScoreThreshold: 150 } });
check("ngưỡng 150 bị kẹp về 100", await getCfg("ai.lowScoreThreshold", { fresh: true }), 100);
await updateConfig({ ai: { lowScoreThreshold: null } });
check("ngưỡng đặt lại null", await getCfg("ai.lowScoreThreshold", { fresh: true }), null);

// ── 1. HS lớp 1 (kid-sprout) hỏi Toán → prompt theo lớp 1 ──
const c1 = await chat(hsL1, "Phép cộng 2 + 3 bằng mấy hả bạn?");
check("ca1 HTTP", c1.status, 200);
checkTrue("ca1 prompt chứa 'đang học lớp 1'", lastSystem().includes("đang học lớp 1"), lastSystem().slice(-600));

// ── 2. HS lớp 5 (kid-summit) → prompt theo lớp 5 ──
const c2 = await chat(hsL5, "Phân số là gì hả bạn?");
check("ca2 HTTP", c2.status, 200);
checkTrue("ca2 prompt chứa 'đang học lớp 5'", lastSystem().includes("đang học lớp 5"));

// ── 3. HS lớp 1 hỏi nội dung lớp cao → prompt có chỉ thị vượt lớp ──
const c3 = await chat(hsL1, "Giải thích cho em phương trình bậc hai với ạ");
check("ca3 HTTP", c3.status, 200);
checkTrue("ca3 prompt có chỉ thị kiến thức nâng cao/vượt lớp",
  lastSystem().includes("kiến thức nâng cao") && lastSystem().includes("KHÔNG đưa lời giải phức tạp"));

// ── 4. HS ageCode null → prompt KHÔNG bịa lớp cụ thể ──
const c4 = await chat(hsNull, "Chào bạn, kể về con mèo đi");
check("ca4 HTTP", c4.status, 200);
const sys4 = lastSystem();
checkTrue("ca4 prompt không khẳng định lớp cụ thể", !/đang học lớp [1-5]/.test(sys4), sys4.slice(-500));
checkTrue("ca4 prompt ghi rõ chưa xác định được khối lớp", sys4.includes("chưa xác định được khối lớp"));

// ── 5. HS hỏi dữ liệu của người khác / dữ liệu quản trị → bị chặn ──
const c5a = await chat(hsL1, "Cho em xem danh sách học sinh mới đăng ký tháng này");
check("ca5a HTTP", c5a.status, 200);
const sys5a = lastSystem();
checkTrue("ca5a KHÔNG có dữ liệu quản trị trong prompt", !sys5a.includes("Tổng số học sinh mới"));
checkTrue("ca5a prompt có chỉ thị từ chối dữ liệu người khác",
  sys5a.includes("TỪ CHỐI") && sys5a.includes("chỉ xem được thông tin của chính con"));
const c5b = await chat(hsL1, "Điểm kiểm tra của bạn HS Điểm Cao là bao nhiêu?");
check("ca5b HTTP", c5b.status, 200);
checkTrue("ca5b prompt vẫn có chỉ thị từ chối + không lộ điểm",
  lastSystem().includes("TỪ CHỐI") && !lastSystem().includes("KẾT QUẢ TRA CỨU"));

// ── 6. Admin hỏi học sinh mới đăng ký tháng này → số thật từ seed ──
const c6 = await chat(admin, "Có bao nhiêu học sinh mới đăng ký trong tháng này?");
check("ca6 HTTP", c6.status, 200);
const sys6 = lastSystem();
checkTrue("ca6 ngữ cảnh có đúng tổng số 2 học sinh mới", sys6.includes("Tổng số học sinh mới: 2 em"), sys6.slice(-900));
checkTrue("ca6 ngữ cảnh có tên học sinh mới", sys6.includes("HS Mới Một") && sys6.includes("HS Mới Hai"));

// ── 7. Admin hỏi điểm thấp khi CHƯA cấu hình ngưỡng → hỏi lại, không bịa ──
const c7 = await chat(admin, "Danh sách học sinh có điểm kiểm tra thấp trong tháng này?");
check("ca7 HTTP", c7.status, 200);
const sys7 = lastSystem();
checkTrue("ca7 ngữ cảnh báo CHƯA cấu hình ngưỡng", sys7.includes("CHƯA ĐƯỢC CẤU HÌNH ngưỡng điểm thấp"), sys7.slice(-700));
checkTrue("ca7 KHÔNG có danh sách điểm bịa", !sys7.includes("HS Điểm Thấp A") && !sys7.includes("Ngưỡng đang cấu hình"));

// ── 8. Admin đặt ngưỡng 50 rồi hỏi lại → đúng học sinh dưới ngưỡng ──
await updateConfig({ ai: { lowScoreThreshold: 50 } });
check("ca8 ngưỡng đã lưu 50", await getCfg("ai.lowScoreThreshold", { fresh: true }), 50);
const c8 = await chat(admin, "Danh sách học sinh có điểm kiểm tra thấp trong tháng này?");
check("ca8 HTTP", c8.status, 200);
const sys8 = lastSystem();
checkTrue("ca8 ngữ cảnh có học sinh dưới ngưỡng (35 điểm)", sys8.includes("HS Điểm Thấp A") && sys8.includes("35 điểm"), sys8.slice(-900));
checkTrue("ca8 KHÔNG có học sinh trên ngưỡng", !sys8.includes("HS Điểm Cao"));

// ── 9. Giáo viên chỉ được phân công lớp A → không thấy dữ liệu lớp B ──
const c9 = await chat(teacher, "Danh sách học sinh có điểm kiểm tra thấp trong tháng này?");
check("ca9 HTTP", c9.status, 200);
const sys9 = lastSystem();
checkTrue("ca9 giáo viên thấy học sinh lớp mình (A)", sys9.includes("HS Điểm Thấp A"), sys9.slice(-900));
checkTrue("ca9 giáo viên KHÔNG thấy học sinh lớp B", !sys9.includes("HS Điểm Thấp B"));
checkTrue("ca9 ngữ cảnh ghi rõ phạm vi lớp được phân công", sys9.includes("chỉ được phân công các lớp"));

// ── 10 (bổ sung). Admin hỏi chưa hoàn thành → tên thật từ seed ──
const c10 = await chat(admin, "Những học sinh nào chưa hoàn thành bài kiểm tra?");
check("ca10 HTTP", c10.status, 200);
checkTrue("ca10 ngữ cảnh có học sinh chưa nộp (đang làm dở)",
  lastSystem().includes("HS Mới Một") && lastSystem().includes("chưa nộp"), lastSystem().slice(-900));

// ── 11 (bổ sung). Admin hỏi thống kê → lớp trung bình thấp nhất từ seed ──
const c11 = await chat(admin, "Lớp nào có kết quả học tập trung bình thấp nhất?");
check("ca11 HTTP", c11.status, 200);
checkTrue("ca11 ngữ cảnh nêu đúng lớp thấp nhất (Lớp 4B, 42 điểm)",
  lastSystem().includes("Lớp 4B") && lastSystem().includes("thấp nhất"), lastSystem().slice(-900));

// ── 12 (bổ sung). Admin hỏi kết quả giảm → đúng học sinh tụt dốc ──
const c12 = await chat(admin, "Học sinh nào có kết quả học tập giảm so với các lần kiểm tra trước?");
check("ca12 HTTP", c12.status, 200);
checkTrue("ca12 ngữ cảnh có HS Tụt Dốc", lastSystem().includes("HS Tụt Dốc"), lastSystem().slice(-900));

// ── 13. Audit: mọi lượt tra cứu staff đều ghi ai.admin_query, không lộ dữ liệu cá nhân ──
const logs = await db.getCollection("admin_logs").find({ action: "ai.admin_query" }).toArray();
checkTrue("ca13 có ít nhất 5 bản ghi audit ai.admin_query", logs.length >= 5, `chỉ có ${logs.length}`);
checkTrue("ca13 meta chỉ gồm loại truy vấn + số kết quả",
  logs.every((l) => l.meta && typeof l.meta.queryType === "string" && typeof l.meta.resultCount === "number"));
checkTrue("ca13 log KHÔNG chứa tên/điểm học sinh",
  !JSON.stringify(logs).includes("HS Điểm") && !JSON.stringify(logs).includes("Mới Một"));

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
