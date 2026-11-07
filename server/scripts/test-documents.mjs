// Test tích hợp: TÀI LIỆU GIÁO VIÊN — Teacher Document Studio (API /api/documents).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-lessons.mjs):
//   node server/scripts/test-documents.mjs
// Bao phủ: CRUD + quyền sở hữu (chỉ chủ sở hữu, admin ngoại lệ), validate
// docType/mode/source khi tạo + khi cập nhật, danh sách /mine (DTO không
// kèm source, lọc theo docType + tìm kiếm).
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, ".test-documents-mongo-data");
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "documents_test";

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacherA = signToken({ id: "user-gv-a", username: "gva", role: "teacher", name: "Giáo Viên A" });
const teacherB = signToken({ id: "user-gv-b", username: "gvb", role: "teacher", name: "Giáo Viên B" });
const admin = signToken({ id: "user-admin", username: "admin", role: "admin", name: "Admin" });
const student = signToken({ id: "user-hs", username: "hstest", role: "student", name: "Học Sinh Test" });

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
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(payload !== undefined ? { body: JSON.stringify(payload) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};
const getJson = (p, token) => req("GET", p, token);
const postJson = (p, token, payload) => req("POST", p, token, payload ?? {});
const putJson = (p, token, payload) => req("PUT", p, token, payload);

// ── 1. Chưa đăng nhập → 401; học sinh → 403 ─────────────────────────────
check("POST /documents không token: status", (await postJson("/api/documents", null, { name: "X" })).status, 401);
check("GET /documents/mine không token: status", (await getJson("/api/documents/mine", null)).status, 401);
check("POST /documents bằng học sinh: status", (await postJson("/api/documents", student, { name: "X" })).status, 403);
check("GET /documents/mine bằng học sinh: status", (await getJson("/api/documents/mine", student)).status, 403);

// ── 2. Tạo tài liệu hợp lệ (giáo viên A) ────────────────────────────────
const htmlSource = '<section class="lesson-slide"><h1>Bài 1</h1></section>';
const created = await postJson("/api/documents", teacherA, {
  name: "Giáo án phép cộng", docType: "word", mode: "html", source: htmlSource,
});
check("Tạo tài liệu: status", created.status, 201);
check("Tạo tài liệu: docType", created.body?.data?.docType, "word");
check("Tạo tài liệu: mode", created.body?.data?.mode, "html");
check("Tạo tài liệu: source giữ nguyên", created.body?.data?.source, htmlSource);
check("Tạo tài liệu: ownerId là giáo viên A", created.body?.data?.ownerId, "user-gv-a");
checkTrue("Tạo tài liệu: id có tiền tố doc-", String(created.body?.data?.id || "").startsWith("doc-"),
  String(created.body?.data?.id));
const docId = created.body.data.id;

const createdPpt = await postJson("/api/documents", teacherA, {
  name: "Slide phép cộng", docType: "powerpoint", mode: "json",
  source: JSON.stringify({ type: "presentation", title: "Bài 1", slides: [] }),
});
check("Tạo tài liệu ppt: status", createdPpt.status, 201);
const pptId = createdPpt.body.data.id;

// ── 3. Validate khi tạo ─────────────────────────────────────────────────
check("Tạo với docType sai: status",
  (await postJson("/api/documents", teacherA, { name: "X", docType: "excel" })).status, 400);
check("Tạo với mode sai: status",
  (await postJson("/api/documents", teacherA, { name: "X", mode: "xml" })).status, 400);
check("Tạo với source không phải chuỗi: status",
  (await postJson("/api/documents", teacherA, { name: "X", source: { a: 1 } })).status, 400);
check("Tạo với source quá 1MB: status",
  (await postJson("/api/documents", teacherA, { name: "X", source: "a".repeat(1024 * 1024 + 1) })).status, 400);
const bigMsg = await postJson("/api/documents", teacherA, { name: "X", docType: "excel" });
checkTrue("Lỗi validate có message rõ ràng", typeof bigMsg.body?.msg === "string" && bigMsg.body.msg.length > 0,
  JSON.stringify(bigMsg.body));

// ── 4. Danh sách /mine ──────────────────────────────────────────────────
const mineA = await getJson("/api/documents/mine?perPage=100", teacherA);
check("Danh sách A: status", mineA.status, 200);
check("Danh sách A: đủ 2 tài liệu", (mineA.body?.data || []).length, 2);
checkTrue("Danh sách A: DTO không kèm source",
  (mineA.body?.data || []).every((d) => !("source" in d) && typeof d.sourceBytes === "number"));
const mineB = await getJson("/api/documents/mine?perPage=100", teacherB);
check("Danh sách B: trống (không thấy của A)", (mineB.body?.data || []).length, 0);
const mineWord = await getJson("/api/documents/mine?docType=word", teacherA);
check("Lọc docType=word: chỉ còn 1", (mineWord.body?.data || []).length, 1);
check("Lọc docType=word: đúng tài liệu", mineWord.body?.data?.[0]?.id, docId);
const mineSearch = await getJson("/api/documents/mine?search=Slide", teacherA);
check("Tìm kiếm theo tên: chỉ còn 1", (mineSearch.body?.data || []).length, 1);
check("Tìm kiếm theo tên: đúng tài liệu", mineSearch.body?.data?.[0]?.id, pptId);

// ── 5. Đọc chi tiết + quyền sở hữu ──────────────────────────────────────
check("Chủ sở hữu đọc: status", (await getJson(`/api/documents/${docId}`, teacherA)).status, 200);
check("GV khác đọc: status", (await getJson(`/api/documents/${docId}`, teacherB)).status, 403);
check("Admin đọc: status", (await getJson(`/api/documents/${docId}`, admin)).status, 200);
check("Đọc tài liệu không tồn tại: status", (await getJson("/api/documents/doc-khong-co", teacherA)).status, 404);

// ── 6. Cập nhật ─────────────────────────────────────────────────────────
const updated = await putJson(`/api/documents/${docId}`, teacherA, {
  name: "Giáo án phép cộng (đã sửa)", mode: "json", source: '{"type":"document","title":"Bài 1","blocks":[]}',
});
check("Cập nhật: status", updated.status, 200);
check("Cập nhật: name mới", updated.body?.data?.name, "Giáo án phép cộng (đã sửa)");
check("Cập nhật: mode mới", updated.body?.data?.mode, "json");
check("Cập nhật: docType giữ nguyên", updated.body?.data?.docType, "word");
checkTrue("Cập nhật: updatedAt đổi", updated.body?.data?.updatedAt >= created.body.data.updatedAt,
  updated.body?.data?.updatedAt);
check("Cập nhật docType sai: status",
  (await putJson(`/api/documents/${docId}`, teacherA, { docType: "pdf" })).status, 400);
check("Cập nhật source quá lớn: status",
  (await putJson(`/api/documents/${docId}`, teacherA, { source: "b".repeat(1024 * 1024 + 1) })).status, 400);
check("GV khác cập nhật: status",
  (await putJson(`/api/documents/${docId}`, teacherB, { name: "Chiếm quyền" })).status, 403);
check("GV khác xoá: status", (await req("DELETE", `/api/documents/${docId}`, teacherB)).status, 403);

// ── 7. Xoá ──────────────────────────────────────────────────────────────
check("Chủ sở hữu xoá: status", (await req("DELETE", `/api/documents/${docId}`, teacherA)).status, 200);
check("Đọc lại tài liệu đã xoá: status", (await getJson(`/api/documents/${docId}`, teacherA)).status, 404);

await new Promise((resolve) => server.close(resolve));
await db.close().catch(() => {});
await mongod.stop();
rmSync(dbPath, { recursive: true, force: true });
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
