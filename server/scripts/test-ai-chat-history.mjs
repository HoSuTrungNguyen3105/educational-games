// Test LỊCH SỬ HỎI AI (ai_chat_logs):
//  (a) chat học sinh thành công → đúng 1 bản ghi với question/answer/role/
//      grade/userId đúng, response chat không đổi format.
//  (b) lượt admin TRA CỨU (đợt #74) → bản ghi kind="admin_query" + queryType.
//  (c) GET /api/ai/chat-logs bằng admin: thấy cả 2 bản ghi, phân trang
//      limit=1 → 2 trang, lọc q trúng đúng bản ghi, lọc role đúng.
//  (d) student/teacher gọi GET + DELETE → 403; chưa đăng nhập → 401.
//  (e) DELETE không điều kiện → 400; DELETE theo khoảng ngày → xóa đúng số
//      lượng, bản ghi ngoài khoảng còn nguyên; có audit ai.chat_logs_delete.
//  (f) ghi log BỊ LỖI (collection ai_chat_logs bị thả) → chat vẫn 200.
// Cùng mẫu test-ai-role-grade: Mongo in-memory + stub Ollama ghi lại
// request. KHÔNG dùng key thật, KHÔNG gọi mạng ngoài.
//   node server/scripts/test-ai-chat-history.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-history-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_chat_history_test";

process.env.OLLAMA_BASE_URL = "https://ollama.com";
process.env["OLLAMA" + "_KEY"] = "stub-cloud-key";
process.env.OLLAMA_MODEL = "gpt-oss:20b";

const realFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  const u = String(url);
  if (u.startsWith("https://ollama.com/")) {
    const json = (obj) => new Response(JSON.stringify(obj), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
    if (u.endsWith("/api/tags")) return json({ models: [{ name: "gpt-oss:20b" }] });
    if (u.endsWith("/api/chat")) {
      return json({ message: { role: "assistant", content: "Câu trả lời mẫu từ stub." }, done: true });
    }
  }
  return realFetch(url, options);
};

const db = await import("../src/db.js");
await db.initDatabase();
// initDatabase chạy heavy-init ở BACKGROUND (seed users.json + tạo
// validator/index). Chờ user-002 (tài khoản seed cuối) xuất hiện để tránh
// đua với validator khi seed dữ liệu của test — cùng bài học test #77.
for (let i = 0; i < 120; i++) {
  if (await db.getCollection("users").findOne({ id: "user-002" })) break;
  await new Promise((r) => setTimeout(r, 250));
}
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { updateConfig } = await import("../src/services/systemConfigService.js");
const { recordChatLog } = await import("../src/services/aiChatLogService.js");

await updateConfig({ ai: { enabled: true } });

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const OLD = "2026-01-05T00:00:00.000Z";
const NOW = new Date().toISOString();
const mkUser = (id, role, ageCode) => ({
  id, username: id.replace("user-", ""), name: `Tên ${id}`, role, passwordHash: "x",
  ...(ageCode ? { ageCode } : {}),
  createdAt: OLD,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs1", "student", "kid-breeze"), // lớp 3
  mkUser("user-hs-new", "student", "kid-breeze"),
  mkUser("user-admin1", "admin"),
  mkUser("user-gv1", "teacher"),
]);
// Một học sinh đăng ký TRONG tháng này để ca admin tra cứu có kết quả thật.
await db.getCollection("users").updateOne({ id: "user-hs-new" }, { $set: { createdAt: NOW } });

const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const hsTok = tok("user-hs1", "student", "HS Một");
const adminTok = tok("user-admin1", "admin", "Admin Một");
const gvTok = tok("user-gv1", "teacher", "GV Một");

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

const chat = async (token, message, extra = {}) => {
  const res = await fetch(`${base}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ message, ...extra }),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};
const logsColl = () => db.getCollection("ai_chat_logs");
/** Chờ bản ghi log thứ n xuất hiện (ghi ngầm fire-and-forget). */
async function waitForLogs(n, tries = 40) {
  for (let i = 0; i < tries; i++) {
    const c = await logsColl().countDocuments();
    if (c >= n) return c;
    await new Promise((r) => setTimeout(r, 100));
  }
  return logsColl().countDocuments();
}
const api = async (method, pathQ, token) => {
  const res = await fetch(`${base}${pathQ}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

// ── (a) Chat học sinh → 1 bản ghi đúng nội dung ──
const ca = await chat(hsTok, "Phép nhân là gì hả bạn?", { conversationId: "conv-test-1" });
check("(a) chat HTTP", ca.status, 200);
check("(a) response vẫn có answer", typeof ca.body?.data?.answer, "string");
check("(a) response vẫn có conversationId echo", ca.body?.data?.conversationId, "conv-test-1");
await waitForLogs(1);
const allA = await logsColl().find({}).toArray();
check("(a) đúng 1 bản ghi sau 1 lượt chat", allA.length, 1);
const logA = allA[0];
check("(a) userId", logA?.userId, "user-hs1");
check("(a) username chụp lại", logA?.username, "hs1");
check("(a) role", logA?.role, "student");
check("(a) grade (kid-breeze → 3)", logA?.grade, 3);
check("(a) question nguyên văn", logA?.question, "Phép nhân là gì hả bạn?");
check("(a) answer toàn văn", logA?.answer, "Câu trả lời mẫu từ stub.");
check("(a) kind", logA?.kind, "chat");
check("(a) queryType null ở lượt thường", logA?.queryType ?? null, null);
check("(a) conversationId", logA?.conversationId, "conv-test-1");
check("(a) sources là mảng", Array.isArray(logA?.sources), true);
checkTrue("(a) createdAt là ISO string", typeof logA?.createdAt === "string" && !Number.isNaN(Date.parse(logA.createdAt)));

// ── (b) Admin tra cứu → kind=admin_query + queryType ──
const cb = await chat(adminTok, "Có bao nhiêu học sinh mới đăng ký trong tháng này?");
check("(b) chat admin HTTP", cb.status, 200);
await waitForLogs(2);
const logB = await logsColl().findOne({ userId: "user-admin1" });
check("(b) kind", logB?.kind, "admin_query");
check("(b) queryType", logB?.queryType, "new_students");
check("(b) role", logB?.role, "admin");

// ── (c) GET list bằng admin: đủ 2 bản ghi + phân trang + lọc ──
const list1 = await api("GET", "/api/ai/chat-logs", adminTok);
check("(c) GET HTTP", list1.status, 200);
check("(c) tổng số bản ghi", list1.body?.data?.total, 2);
check("(c) mới nhất trước (admin_query lên đầu)", list1.body?.data?.items?.[0]?.kind, "admin_query");
const page1 = await api("GET", "/api/ai/chat-logs?limit=1&page=1", adminTok);
const page2 = await api("GET", "/api/ai/chat-logs?limit=1&page=2", adminTok);
check("(c) limit=1 → totalPages=2", page1.body?.data?.totalPages, 2);
check("(c) trang 1 có 1 dòng", page1.body?.data?.items?.length, 1);
check("(c) trang 2 có 1 dòng khác trang 1",
  page2.body?.data?.items?.length === 1 && page2.body.data.items[0].id !== page1.body.data.items[0].id, true);
const byQ = await api("GET", `/api/ai/chat-logs?q=${encodeURIComponent("Phép nhân")}`, adminTok);
check("(c) lọc q 'Phép nhân' → đúng 1 bản ghi của học sinh", byQ.body?.data?.total, 1);
check("(c) lọc q trúng đúng userId", byQ.body?.data?.items?.[0]?.userId, "user-hs1");
const byRole = await api("GET", "/api/ai/chat-logs?role=admin", adminTok);
check("(c) lọc role=admin → đúng 1 bản ghi", byRole.body?.data?.total, 1);
const byUser = await api("GET", "/api/ai/chat-logs?username=hs1", adminTok);
check("(c) lọc username=hs1 → đúng 1 bản ghi", byUser.body?.data?.total, 1);

// ── (d) Phân quyền: student/teacher 403, ẩn danh 401 ──
check("(d) student GET → 403", (await api("GET", "/api/ai/chat-logs", hsTok)).status, 403);
check("(d) teacher GET → 403", (await api("GET", "/api/ai/chat-logs", gvTok)).status, 403);
check("(d) student DELETE → 403", (await api("DELETE", "/api/ai/chat-logs?from=2026-01-01", hsTok)).status, 403);
check("(d) teacher DELETE → 403", (await api("DELETE", "/api/ai/chat-logs?from=2026-01-01", gvTok)).status, 403);
check("(d) không token GET → 401", (await api("GET", "/api/ai/chat-logs", null)).status, 401);
check("(d) không token DELETE → 401", (await api("DELETE", "/api/ai/chat-logs?from=2026-01-01", null)).status, 401);

// ── (e) DELETE: không điều kiện → 400; theo khoảng ngày → đúng phạm vi ──
check("(e) DELETE không điều kiện → 400", (await api("DELETE", "/api/ai/chat-logs", adminTok)).status, 400);
check("(e) sau 400 vẫn còn nguyên 2 bản ghi", await logsColl().countDocuments(), 2);
// Bản ghi thứ ba với createdAt CŨ (ngoài khoảng sẽ xóa) ghi thẳng qua service.
const oldDoc = await recordChatLog({
  userId: "user-hs1", username: "hs1", role: "student", grade: 3,
  question: "Câu hỏi cũ từ tháng trước", answer: "Trả lời cũ",
});
checkTrue("(e) ghi được bản ghi cũ qua service", !!oldDoc);
await logsColl().updateOne({ id: oldDoc.id }, { $set: { createdAt: "2026-10-01T08:00:00.000Z" } });
check("(e) tổng trước khi xóa = 3", await logsColl().countDocuments(), 3);
const today = new Date().toISOString().slice(0, 10);
const del = await api("DELETE", `/api/ai/chat-logs?from=${today}&to=${today}`, adminTok);
check("(e) DELETE theo ngày HTTP", del.status, 200);
check("(e) xóa đúng 2 bản ghi hôm nay", del.body?.data?.deleted, 2);
const remaining = await logsColl().find({}).toArray();
check("(e) còn lại đúng 1 bản ghi", remaining.length, 1);
check("(e) bản ghi còn lại là bản ghi cũ", remaining[0]?.question, "Câu hỏi cũ từ tháng trước");
const audits = await db.getCollection("admin_logs").find({ action: "ai.chat_logs_delete" }).toArray();
check("(e) đúng 1 audit ai.chat_logs_delete", audits.length, 1);
check("(e) audit meta.deleted = 2", audits[0]?.meta?.deleted, 2);
check("(e) audit meta.from = hôm nay", audits[0]?.meta?.from, today);

// ── (f) Ghi log lỗi → chat vẫn 200 ──
await db.getDb().dropCollection("ai_chat_logs").catch(() => {});
const cf = await chat(hsTok, "2 cộng 3 bằng mấy hả bạn?");
check("(f) chat vẫn HTTP 200 khi ghi log lỗi", cf.status, 200);
check("(f) answer vẫn nguyên vẹn", cf.body?.data?.answer, "Câu trả lời mẫu từ stub.");
await new Promise((r) => setTimeout(r, 400)); // chờ lượt ghi ngầm kết thúc

server.close();
await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
process.exit(failed === 0 ? 0 : 1);
