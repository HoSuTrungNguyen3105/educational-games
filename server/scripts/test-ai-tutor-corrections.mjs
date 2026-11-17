// Test AI Studio Tab 1 (Cấu hình Gia sư) + Tab 2 (Đính chính kiến thức)
// nối backend thật:
//   • GET/PUT /api/ai/tutor-config — lưu ở system_config theo khoá
//     (cấp × môn), phân quyền teacher/admin, validate + kẹp temperature;
//     chat THẬT áp cấu hình đã lưu (chỉ thị bổ sung sau thay biến +
//     temperature + guardrail phạm vi chốt ở backend, KHÔNG gọi model
//     khi từ chối); CHƯA có cấu hình → hành vi chat giữ nguyên 100%;
//     thứ tự tra hiệu lực: (cấp HS, môn) → (cấp HS, "") → (default, môn)
//     → (default, "").
//   • CRUD /api/ai/corrections — collection ai_corrections; truy xuất
//     bằng khớp TỪ KHOÁ (topic nhân đôi điểm + cộng điểm khớp môn, lọc
//     môn/cấp khác) với ƯU TIÊN CAO NHẤT: chèn TRƯỚC tài liệu bài học
//     trong prompt của cả chat thật lẫn playground; playground sources
//     có mục type="correction"; bản ghi active=false không được dùng.
// Cùng mẫu test-ai-playground: Mongo in-memory + stub fetch tới
// https://ollama.com ghi lại request. KHÔNG dùng key thật.
//   node server/scripts/test-ai-tutor-corrections.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-ai-tutor-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "ai_tutor_corrections_test";

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

// ── Seed users: học sinh lớp 4 (ageCode kid-river → cấp "tieu-hoc") ──
const now = new Date().toISOString();
const mkUser = (id, name, role, extra = {}) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  createdAt: now, ...extra,
});
await db.getCollection("users").insertMany([
  mkUser("user-hs-tc", "Học Sinh TC", "student", { ageCode: "kid-river" }),
  mkUser("user-gv-tc", "Giáo Viên TC", "teacher"),
]);
const student = signToken({ id: "user-hs-tc", username: "hstc", role: "student", name: "Học Sinh TC" });
const teacher = signToken({ id: "user-gv-tc", username: "gvtc", role: "teacher", name: "Giáo Viên TC" });

// ── Seed bài học published có kiến thức SAI (năm 1953) để đính chính vá ──
const textEl = (text) => ({ id: "el-" + Math.random().toString(36).slice(2, 8), type: "text", x: 0, y: 0, w: 100, h: 50, props: { text } });
await db.getCollection("lessons").insertMany([
  {
    id: "ls-dbp", ownerId: "user-gv-tc", title: "Chiến thắng Điện Biên Phủ", subject: "Lịch sử", grade: 4,
    description: "Tìm hiểu chiến thắng Điện Biên Phủ.", status: "published", publishedAt: now, createdAt: now, updatedAt: now,
    pages: [{ id: "p1", title: "Trang 1", elements: [textEl("Chiến thắng Điện Biên Phủ diễn ra vào năm 1953, là chiến thắng lớn của quân đội ta.")] }],
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
const lastTemp = () => chatRequests[chatRequests.length - 1]?.options?.temperature;
const chat = (token, message) => req("POST", "/api/ai/chat", token, { message });
const Q = "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?";

// ══ 1. Chat thật KHI CHƯA CÓ cấu hình nào: hành vi giữ nguyên 100% ══
const c0 = await chat(student, Q);
check("chưa cấu hình: chat → 200", c0.status, 200);
check("chưa cấu hình: answer từ model", c0.body?.data?.answer, "Câu trả lời mẫu từ stub.");
const sys0 = lastSystem();
checkTrue("chưa cấu hình: prompt có tài liệu bài học", sys0.includes("TÀI LIỆU BÀI HỌC"));
checkTrue("chưa cấu hình: prompt KHÔNG có khối cấu hình đã lưu", !sys0.includes("CẤU HÌNH GIA SƯ AI ĐÃ LƯU"));
checkTrue("chưa cấu hình: prompt KHÔNG có khối đính chính", !sys0.includes("ĐÍNH CHÍNH KIẾN THỨC"));
check("chưa cấu hình: temperature mặc định của gateway", lastTemp(), 0.4);

// ══ 2. tutor-config: phân quyền + round-trip + validate ══
const putStu = await req("PUT", "/api/ai/tutor-config", student, {
  level: "tieu-hoc", subject: "", systemPrompt: "x", temperature: 0.2,
});
check("học sinh PUT tutor-config → 403", putStu.status, 403);
const getStu = await req("GET", "/api/ai/tutor-config?level=tieu-hoc&subject=", student);
check("học sinh GET tutor-config → 403", getStu.status, 403);

const CFG_PROMPT = "Hãy xưng hô là cô giáo {ten_mon_hoc} lớp {cap_hoc} và khen em một lời khi em hỏi đúng trọng tâm.";
const put1 = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "tieu-hoc", subject: "", systemPrompt: CFG_PROMPT,
  temperature: 0.35, scopeOnly: false, requireCitation: true, refuseOffTopic: false,
});
check("teacher PUT (tieu-hoc|) → 200", put1.status, 200);
check("PUT trả đúng khoá", [put1.body?.data?.level, put1.body?.data?.subject], ["tieu-hoc", ""]);
check("PUT trả cấu hình vừa lưu", put1.body?.data?.config?.systemPrompt, CFG_PROMPT);
checkTrue("bản đã lưu có updatedAt", typeof put1.body?.data?.config?.updatedAt === "string");

const get1 = await req("GET", "/api/ai/tutor-config?level=tieu-hoc&subject=", teacher);
check("GET round-trip systemPrompt", get1.body?.data?.config?.systemPrompt, CFG_PROMPT);
check("GET round-trip temperature", get1.body?.data?.config?.temperature, 0.35);
check("GET round-trip requireCitation", get1.body?.data?.config?.requireCitation, true);
check("GET round-trip scopeOnly", get1.body?.data?.config?.scopeOnly, false);

const getNull = await req("GET", "/api/ai/tutor-config?level=thcs&subject=", teacher);
check("GET khoá chưa lưu → config null", getNull.body?.data?.config, null);

const putBadTemp = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "thcs", subject: "", systemPrompt: "x", temperature: "abc",
});
check("temperature không phải số → 400", putBadTemp.status, 400);
const putBadLevel = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "cap-3", subject: "", systemPrompt: "x", temperature: 0.2,
});
check("level lạ → 400", putBadLevel.status, 400);

const putClamp = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "default", subject: "Địa lý", systemPrompt: "Cấu hình môn Địa lý.", temperature: 0.9,
});
check("PUT temperature 0.9 → 200", putClamp.status, 200);
const getClamp = await req("GET", "/api/ai/tutor-config?level=default&subject=%C4%90%E1%BB%8Ba%20l%C3%BD", teacher);
check("temperature bị kẹp về trần 0.5", getClamp.body?.data?.config?.temperature, 0.5);

// Cấu hình mặc định toàn hệ thống (default|"") — dùng kiểm tra fallback.
const putDefault = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "default", subject: "", systemPrompt: "Chỉ thị mặc định toàn hệ thống MARKER_DEFAULT.",
  temperature: 0.3, scopeOnly: false, requireCitation: false, refuseOffTopic: false,
});
check("teacher PUT (default|) → 200", putDefault.status, 200);

// ══ 3. Chat thật áp cấu hình (tieu-hoc|"") — thắng (default|"") ══
const c1 = await chat(student, Q);
check("có cấu hình: chat → 200", c1.status, 200);
const sys1 = lastSystem();
checkTrue("prompt có khối cấu hình đã lưu", sys1.includes("CẤU HÌNH GIA SƯ AI ĐÃ LƯU"));
checkTrue("biến {ten_mon_hoc}/{cap_hoc} đã thay bằng môn/cấp thật",
  sys1.includes("cô giáo Lịch sử lớp Tiểu học"), sys1.slice(0, 400));
checkTrue("requireCitation → chỉ thị trích dẫn nguồn theo tên bài", sys1.includes("Bắt buộc trích dẫn nguồn"));
checkTrue("cấu hình theo cấp THẮNG cấu hình mặc định", !sys1.includes("MARKER_DEFAULT"));
check("temperature lấy từ cấu hình đã lưu", lastTemp(), 0.35);

// ══ 4. Giáo viên (không có cấp) → fallback (default|"") ══
const c2 = await chat(teacher, Q);
check("giáo viên chat → 200", c2.status, 200);
const sys2 = lastSystem();
checkTrue("giáo viên dùng cấu hình mặc định toàn hệ thống", sys2.includes("MARKER_DEFAULT"));
check("temperature fallback từ (default|)", lastTemp(), 0.3);

// ══ 5. scopeOnly bật + không ngữ cảnh → refusal, KHÔNG gọi model ══
const putScope = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "tieu-hoc", subject: "", systemPrompt: CFG_PROMPT,
  temperature: 0.35, scopeOnly: true, requireCitation: true, refuseOffTopic: false,
});
check("bật scopeOnly → 200", putScope.status, 200);
const beforeRefusal = chatRequests.length;
const c3 = await chat(student, "Khủng long bạo chúa sống ở đâu?");
check("scopeOnly + ngoài bài học → vẫn 200", c3.status, 200);
checkTrue("answer là bản từ chối theo khuôn",
  String(c3.body?.data?.answer || "").includes("chỉ trả lời trong phạm vi bài học hiện tại")
  && String(c3.body?.data?.answer || "").includes("Con hãy thử hỏi nội dung thuộc bài học"),
  String(c3.body?.data?.answer || ""));
check("model KHÔNG bị gọi khi refusal", chatRequests.length, beforeRefusal);
const putScopeOff = await req("PUT", "/api/ai/tutor-config", teacher, {
  level: "tieu-hoc", subject: "", systemPrompt: CFG_PROMPT,
  temperature: 0.35, scopeOnly: false, requireCitation: true, refuseOffTopic: false,
});
check("tắt scopeOnly lại → 200", putScopeOff.status, 200);

// ══ 6. Corrections: phân quyền + CRUD đủ vòng ══
const postStu = await req("POST", "/api/ai/corrections", student, {
  subject: "", level: "", topic: "Chủ đề", content: "Nội dung",
});
check("học sinh POST corrections → 403", postStu.status, 403);
const listStu = await req("GET", "/api/ai/corrections", student);
check("học sinh GET corrections → 403", listStu.status, 403);

const postEmpty = await req("POST", "/api/ai/corrections", teacher, {
  subject: "", level: "", topic: "  ", content: "Nội dung",
});
check("topic rỗng → 400", postEmpty.status, 400);

const post1 = await req("POST", "/api/ai/corrections", teacher, {
  subject: "Lịch sử", level: "tieu-hoc",
  topic: "Chiến thắng Điện Biên Phủ diễn ra năm nào",
  content: "Chiến thắng Điện Biên Phủ diễn ra vào năm 1954, kết thúc ngày 7 tháng 5 năm 1954.",
});
check("teacher POST correction → 201", post1.status, 201);
const corrId = post1.body?.data?.id;
checkTrue("bản ghi có id", typeof corrId === "string" && corrId.length > 0);
check("bản ghi mặc định active=true", post1.body?.data?.active, true);
check("bản ghi ghi createdBy = giáo viên", post1.body?.data?.createdBy, "user-gv-tc");

// Bản ghi môn Toán cùng chủ đề — phải bị LỌC khỏi ngữ cảnh Lịch sử.
const postToan = await req("POST", "/api/ai/corrections", teacher, {
  subject: "Toán", level: "",
  topic: "Chiến thắng Điện Biên Phủ diễn ra năm nào",
  content: "NOI_DUNG_TOAN_KHONG_DUOC_DUNG cho câu hỏi này.",
});
check("POST correction môn Toán → 201", postToan.status, 201);
const toanId = postToan.body?.data?.id;

const list1 = await req("GET", "/api/ai/corrections", teacher);
check("GET list → 200", list1.status, 200);
checkTrue("list chứa cả 2 bản ghi", (list1.body?.data?.items || []).length >= 2);
check("list mới nhất trước (bản Toán tạo sau nằm trước)",
  list1.body?.data?.items?.[0]?.id, toanId);

const putCorr = await req("PUT", `/api/ai/corrections/${corrId}`, teacher, {
  content: "Chiến thắng Điện Biên Phủ diễn ra vào năm 1954 (bản đã sửa), kết thúc ngày 7/5/1954.",
});
check("PUT sửa content → 200", putCorr.status, 200);
checkTrue("content đã sửa", String(putCorr.body?.data?.content || "").includes("bản đã sửa"));
const put404 = await req("PUT", "/api/ai/corrections/correction_khong_ton_tai", teacher, { content: "x" });
check("PUT id không tồn tại → 404", put404.status, 404);

// ══ 7. Chat thật: đính chính chèn TRƯỚC tài liệu bài học ══
const c4 = await chat(student, Q);
check("chat có đính chính → 200", c4.status, 200);
const sys4 = lastSystem();
const idxCorr = sys4.indexOf("ĐÍNH CHÍNH KIẾN THỨC");
const idxMat = sys4.indexOf("TÀI LIỆU BÀI HỌC");
checkTrue("prompt có khối đính chính ưu tiên cao nhất", idxCorr >= 0);
checkTrue("khối đính chính đứng TRƯỚC tài liệu bài học", idxCorr >= 0 && idxMat > idxCorr);
checkTrue("prompt chứa nội dung đính chính đã sửa (1954)", sys4.includes("năm 1954 (bản đã sửa)"));
checkTrue("đính chính môn Toán bị lọc khỏi ngữ cảnh Lịch sử", !sys4.includes("NOI_DUNG_TOAN_KHONG_DUOC_DUNG"));

// ══ 8. Playground: sources có mục correction đứng đầu + prompt đúng thứ tự ══
const pgRes = await req("POST", "/api/ai/playground/chat", teacher, {
  message: Q,
  config: {
    systemPrompt: "", temperature: 0.2, strictScope: false,
    requireCitation: false, refuseOffTopic: false, subject: "Lịch sử", level: "Tiểu học",
  },
});
check("playground → 200", pgRes.status, 200);
const pgSources = pgRes.body?.data?.sources || [];
checkTrue("playground sources có mục correction", pgSources.some((s) => s.type === "correction"));
check("nguồn đầu tiên là đính chính (ưu tiên cao nhất)", pgSources[0]?.type, "correction");
checkTrue("nguồn correction có điểm khớp từ khoá > 0",
  typeof pgSources[0]?.score === "number" && pgSources[0].score > 0,
  JSON.stringify(pgSources[0]));
checkTrue("playground sources vẫn có nguồn bài học", pgSources.some((s) => s.type === "lesson"));
const sysPg = lastSystem();
checkTrue("prompt playground: đính chính trước tài liệu",
  sysPg.indexOf("ĐÍNH CHÍNH KIẾN THỨC") >= 0
  && sysPg.indexOf("TÀI LIỆU BÀI HỌC") > sysPg.indexOf("ĐÍNH CHÍNH KIẾN THỨC"));

// ══ 9. active=false → không còn được truy xuất ══
const putOff = await req("PUT", `/api/ai/corrections/${corrId}`, teacher, { active: false });
check("tắt active → 200", putOff.status, 200);
check("active đã tắt", putOff.body?.data?.active, false);
const c5 = await chat(student, Q);
check("chat sau khi tắt đính chính → 200", c5.status, 200);
checkTrue("prompt KHÔNG còn khối đính chính", !lastSystem().includes("ĐÍNH CHÍNH KIẾN THỨC"));
const pgRes2 = await req("POST", "/api/ai/playground/chat", teacher, {
  message: Q,
  config: { systemPrompt: "", temperature: 0.2, strictScope: false, subject: "Lịch sử", level: "Tiểu học" },
});
checkTrue("playground sources không còn correction",
  !(pgRes2.body?.data?.sources || []).some((s) => s.type === "correction"));

// ══ 10. Xoá bản ghi ══
const del1 = await req("DELETE", `/api/ai/corrections/${corrId}`, teacher);
check("DELETE → 200", del1.status, 200);
const list2 = await req("GET", "/api/ai/corrections", teacher);
checkTrue("list không còn bản ghi đã xoá",
  !(list2.body?.data?.items || []).some((r) => r.id === corrId));
const del404 = await req("DELETE", `/api/ai/corrections/${corrId}`, teacher);
check("DELETE lại → 404", del404.status, 404);
await req("DELETE", `/api/ai/corrections/${toanId}`, teacher);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
server.close();
await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
