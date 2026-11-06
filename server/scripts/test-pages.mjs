// Test tích hợp: TRANG HTML TĨNH (API /api/pages) — cơ chế lưu HTML như template.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-chat-reactions.mjs):
//   node server/scripts/test-pages.mjs
// Cần mongodb-memory-server (cài --no-save ở máy dev, không phải dep runtime).
// Biến môi trường TEST_MONGO_DBPATH: thư mục dữ liệu mongod tạm (mặc định cạnh script).
// Môi trường test không cấu hình Supabase/R2/Firebase → storage rơi về ĐĨA
// (server/uploads/html/<uuid>.html, phục vụ tĩnh tại /uploads) như bản dev local.
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync, rmSync, readFileSync, existsSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-pages-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "pages_test";
delete process.env.BASE_URL; // htmlUrl dạng tương đối /uploads/html/... để test fetch qua chính server này

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacherToken = signToken({ id: "user-gv", username: "gvtest", role: "teacher", name: "Giáo Viên Test" });
const studentToken = signToken({ id: "user-hs", username: "hstest", role: "student", name: "Học Sinh Test" });

const seedHtml = readFileSync(path.resolve(here, "../../public/chucmungsinhnhat.html"), "utf-8");
const createdFiles = new Set();
const trackFile = (htmlUrl) => {
  const m = String(htmlUrl || "").match(/uploads\/html\/([\w.-]+\.html?)/i);
  if (m) createdFiles.add(m[1]);
};

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

const getJson = async (p, token) => {
  const res = await fetch(`${base}${p}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return { status: res.status, body: await res.json().catch(() => null) };
};
const putJson = async (p, token, payload) => {
  const res = await fetch(`${base}${p}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};
const fetchStored = async (htmlUrl) => {
  const url = /^https?:\/\//i.test(htmlUrl) ? htmlUrl : `${base}${htmlUrl}`;
  const res = await fetch(url);
  return { status: res.status, text: await res.text() };
};

// ── 1. Đọc công khai lần đầu → tự seed từ public/chucmungsinhnhat.html ──
const first = await getJson("/api/pages/chuc-mung-sinh-nhat");
check("GET công khai (không token): status", first.status, 200);
check("seed: slug", first.body?.data?.slug, "chuc-mung-sinh-nhat");
check("seed: title", first.body?.data?.title, "Chúc mừng sinh nhật");
checkTrue("seed: htmlUrl là LINK (không phải HTML thô)",
  typeof first.body?.data?.htmlUrl === "string" && first.body.data.htmlUrl.length > 0 && !first.body.data.htmlUrl.includes("<html"),
  JSON.stringify(first.body?.data?.htmlUrl));
trackFile(first.body?.data?.htmlUrl);
const stored1 = await fetchStored(first.body.data.htmlUrl);
check("seed: nội dung file trên storage khớp file public/ đã upload", stored1.text, seedHtml);

// ── 2. Đường /raw mở trực tiếp được (redirect → nội dung trang) ──
const raw = await fetch(`${base}/api/pages/chuc-mung-sinh-nhat/raw`);
check("GET /raw: status sau redirect", raw.status, 200);
check("GET /raw: nội dung là trang sinh nhật gốc", await raw.text(), seedHtml);

// ── 3. Slug không tồn tại → 404 ──
const missing = await getJson("/api/pages/trang-khong-ton-tai");
check("GET slug lạ: status", missing.status, 404);

// ── 4. Ghi không token → 401; học sinh → 403 ──
const NEW_HTML = "<!DOCTYPE html><html><head><title>Test</title></head><body>NỘI DUNG MỚI 123</body></html>";
const putAnon = await putJson("/api/pages/chuc-mung-sinh-nhat", null, { html: NEW_HTML });
check("PUT không token: status", putAnon.status, 401);
const putStudent = await putJson("/api/pages/chuc-mung-sinh-nhat", studentToken, { html: NEW_HTML });
check("PUT bằng tài khoản học sinh: status", putStudent.status, 403);

// ── 5. Giáo viên ghi HTML mới → htmlUrl đổi, nội dung đọc lại đúng bản mới ──
const putTeacher = await putJson("/api/pages/chuc-mung-sinh-nhat", teacherToken, { html: NEW_HTML });
check("PUT bằng giáo viên: status", putTeacher.status, 200);
checkTrue("PUT: htmlUrl đổi sang file mới", putTeacher.body?.data?.htmlUrl !== first.body.data.htmlUrl,
  `cũ ${first.body.data.htmlUrl} / mới ${putTeacher.body?.data?.htmlUrl}`);
trackFile(putTeacher.body?.data?.htmlUrl);
const stored2 = await fetchStored(putTeacher.body.data.htmlUrl);
check("PUT: nội dung lưu trên storage là HTML mới", stored2.text, NEW_HTML);
const reread = await getJson("/api/pages/chuc-mung-sinh-nhat");
check("Đọc lại sau PUT: htmlUrl là bản mới", reread.body?.data?.htmlUrl, putTeacher.body.data.htmlUrl);

// ── 6. Gửi lại đúng link đang lưu → giữ nguyên, không tạo file thừa ──
const putSame = await putJson("/api/pages/chuc-mung-sinh-nhat", teacherToken, { htmlUrl: putTeacher.body.data.htmlUrl });
check("PUT gửi lại link cũ: status", putSame.status, 200);
check("PUT gửi lại link cũ: htmlUrl không đổi", putSame.body?.data?.htmlUrl, putTeacher.body.data.htmlUrl);

// ── 7. HTML không hợp lệ → bị từ chối, nội dung cũ còn nguyên ──
const putBad = await putJson("/api/pages/chuc-mung-sinh-nhat", teacherToken, { html: "đây không phải html" });
checkTrue("PUT HTML rác: bị từ chối (status >= 400)", putBad.status >= 400, `status ${putBad.status}`);
const afterBad = await getJson("/api/pages/chuc-mung-sinh-nhat");
check("Sau PUT rác: htmlUrl vẫn là bản hợp lệ trước đó", afterBad.body?.data?.htmlUrl, putTeacher.body.data.htmlUrl);

await new Promise((resolve) => server.close(resolve));
await db.close().catch(() => {});
await mongod.stop();
// Dọn file đĩa storage sinh ra trong lúc test (server/uploads/html)
const uploadDir = path.resolve(here, "../uploads/html");
for (const f of createdFiles) {
  const p = path.join(uploadDir, f);
  if (existsSync(p)) unlinkSync(p);
}
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
