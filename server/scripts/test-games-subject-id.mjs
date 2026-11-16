// Test tích hợp: NỐI GAMES ↔ SUBJECTS BẰNG subjectId (thay vì chỉ tên).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-lessons-background.mjs):
//   node server/scripts/test-games-subject-id.mjs
// Bao phủ: game cũ chỉ có tên → đọc ra có subjectId suy từ tên; game lưu theo
// subjectId → subject luôn là tên HIỆN TẠI của môn (đổi tên môn là game tự
// theo); lọc list theo subjectId/tên khớp cả hai dạng lưu; tạo/cập nhật theo
// id hoặc theo tên đều lưu cả hai field; subjectId không tồn tại → bỏ qua
// (subjectId = null), không lỗi.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ObjectId } from "mongodb";

const here = path.dirname(fileURLToPath(import.meta.url));
// Mặc định dùng mongodb-memory-server; máy chưa cài package này có thể trỏ
// TEST_MONGODB_URI (+ TEST_MONGODB_DB) vào DB test riêng — script DROP DB
// đó ở cuối. Không truyền TEST_MONGODB_URI thì giữ nguyên hành vi cũ.
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `games_subject_id_test_${process.pid}`;
} else {
  // dbPath gắn PID như test-ai-credit-status.mjs: thư mục cố định sẽ sót
  // dữ liệu của lần chạy trước (môn trùng tên, đã đổi tên) làm sai kết quả.
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-games-subject-id-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "games_subject_id_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacher = signToken({ id: "user-gv-sid", username: "gvsid", role: "teacher", name: "Giáo Viên Subject" });

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

// ── Dữ liệu nền: 2 môn + 3 game ở 3 dạng lưu khác nhau ──────────────────
const now = new Date().toISOString();
const subjA = await getCollection("subjects").insertOne({ name: "Môn Test A" });
const subjB = await getCollection("subjects").insertOne({ name: "Môn Test B" });
const idA = subjA.insertedId.toString();
const idB = subjB.insertedId.toString();

const gLegacy = await getCollection("games").insertOne({
  name: "Game Legacy Tên", subject: "Môn Test A", status: "published",
  code: "TESTLEG1", createdAt: now, updatedAt: now,
});
const gById = await getCollection("games").insertOne({
  name: "Game Theo Id", subject: "Tên cũ đã đổi", subjectId: idA, status: "published",
  code: "TESTBID1", createdAt: now, updatedAt: now,
});
const gFree = await getCollection("games").insertOne({
  name: "Game Tự Do", subject: "Môn Không Có", status: "published",
  code: "TESTFRE1", createdAt: now, updatedAt: now,
});
const legacyId = gLegacy.insertedId.toString();
const byIdId = gById.insertedId.toString();
const freeId = gFree.insertedId.toString();

// ── 1. Đọc từng game: resolve subject/subjectId ──────────────────────────
const gotLegacy = await req("GET", `/api/games/${legacyId}`);
check("Game cũ (chỉ tên): subjectId suy từ tên", gotLegacy.body?.data?.subjectId, idA);
check("Game cũ (chỉ tên): subject giữ tên", gotLegacy.body?.data?.subject, "Môn Test A");

const gotById = await req("GET", `/api/games/${byIdId}`);
check("Game theo id: subject = tên HIỆN TẠI của môn (không phải tên đã lưu)", gotById.body?.data?.subject, "Môn Test A");
check("Game theo id: subjectId giữ nguyên", gotById.body?.data?.subjectId, idA);

const gotFree = await req("GET", `/api/games/${freeId}`);
check("Game tên không khớp môn nào: subjectId = null", gotFree.body?.data?.subjectId, null);
check("Game tên không khớp môn nào: subject giữ nguyên", gotFree.body?.data?.subject, "Môn Không Có");

const gotByCode = await req("GET", "/api/games/code/TESTBID1");
check("getByCode: subject đã resolve", gotByCode.body?.data?.subject, "Môn Test A");
check("getByCode: subjectId đã resolve", gotByCode.body?.data?.subjectId, idA);

// ── 2. Lọc danh sách theo subjectId và theo tên ──────────────────────────
const listById = await req("GET", `/api/games?subjectId=${idA}`);
const idsById = (listById.body?.data || []).map((g) => g._id);
checkTrue("Lọc ?subjectId: chứa game legacy (lưu theo tên)", idsById.includes(legacyId), JSON.stringify(idsById));
checkTrue("Lọc ?subjectId: chứa game lưu theo id", idsById.includes(byIdId), JSON.stringify(idsById));
checkTrue("Lọc ?subjectId: KHÔNG chứa game tự do", !idsById.includes(freeId), JSON.stringify(idsById));

const listByName = await req("GET", `/api/games?subject=${encodeURIComponent("Môn Test A")}`);
const idsByName = (listByName.body?.data || []).map((g) => g._id);
checkTrue("Lọc ?subject (tên): chứa game legacy", idsByName.includes(legacyId), JSON.stringify(idsByName));
checkTrue("Lọc ?subject (tên): chứa cả game lưu theo subjectId", idsByName.includes(byIdId), JSON.stringify(idsByName));
checkTrue("Lọc ?subject (tên): KHÔNG chứa game tự do", !idsByName.includes(freeId), JSON.stringify(idsByName));

// ── 3. Tạo game: theo id / theo tên / id không tồn tại ───────────────────
const createdById = await req("POST", "/api/games", teacher, {
  name: "Game Tạo Theo Id", subjectId: idB, status: "draft",
});
check("Tạo theo subjectId: status", createdById.status, 201);
check("Tạo theo subjectId: subject = tên resolve", createdById.body?.data?.subject, "Môn Test B");
check("Tạo theo subjectId: subjectId đã lưu", createdById.body?.data?.subjectId, idB);
const storedById = await getCollection("games").findOne({ _id: new ObjectId(createdById.body.data._id) });
check("Tạo theo subjectId: DB lưu cả subject", storedById?.subject, "Môn Test B");
check("Tạo theo subjectId: DB lưu cả subjectId", storedById?.subjectId, idB);

const createdByName = await req("POST", "/api/games", teacher, {
  name: "Game Tạo Theo Tên", subject: "Môn Test B", status: "draft",
});
check("Tạo theo tên: status", createdByName.status, 201);
check("Tạo theo tên: subjectId suy từ tên", createdByName.body?.data?.subjectId, idB);

const createdBogus = await req("POST", "/api/games", teacher, {
  name: "Game Id Ảo", subject: "Môn Không Có", subjectId: new ObjectId().toString(), status: "draft",
});
check("Tạo với subjectId không tồn tại: vẫn 201 (không throw)", createdBogus.status, 201);
check("Tạo với subjectId không tồn tại: subjectId = null", createdBogus.body?.data?.subjectId, null);
check("Tạo với subjectId không tồn tại: giữ subject theo input", createdBogus.body?.data?.subject, "Môn Không Có");

// ── 4. Cập nhật: chỉ gửi subjectId / chỉ gửi subject ─────────────────────
const updById = await req("PUT", `/api/games/${freeId}`, teacher, { subjectId: idA });
check("Update chỉ subjectId: subject resolve theo id", updById.body?.data?.subject, "Môn Test A");
check("Update chỉ subjectId: subjectId đã set", updById.body?.data?.subjectId, idA);

const updByName = await req("PUT", `/api/games/${freeId}`, teacher, { subject: "Môn Test B" });
check("Update chỉ subject (tên): subjectId suy từ tên", updByName.body?.data?.subjectId, idB);
check("Update chỉ subject (tên): subject giữ tên", updByName.body?.data?.subject, "Môn Test B");

// ── 5. Đổi tên môn → game tự theo tên mới ────────────────────────────────
await getCollection("subjects").updateOne({ _id: new ObjectId(idA) }, { $set: { name: "Môn Test A Đổi" } });
const gotRenamed = await req("GET", `/api/games/${byIdId}`);
check("Đổi tên môn: game theo id thấy tên mới", gotRenamed.body?.data?.subject, "Môn Test A Đổi");
const listRenamed = await req("GET", `/api/games?subject=${encodeURIComponent("Môn Test A Đổi")}`);
const idsRenamed = (listRenamed.body?.data || []).map((g) => g._id);
checkTrue("Đổi tên môn: lọc theo tên mới vẫn thấy game", idsRenamed.includes(byIdId), JSON.stringify(idsRenamed));

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
