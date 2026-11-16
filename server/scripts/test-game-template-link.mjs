// Test tích hợp: QUAN HỆ GAME ↔ TEMPLATE theo templateId.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-games-subject-id.mjs):
//   node server/scripts/test-game-template-link.mjs
// Bao phủ: (a) GET /api/templates + /api/templates/:id trả gamesCount đúng;
// (b) POST /api/games chặn template draft/inactive, cho qua published /
// không templateId / templateId lạ không tồn tại; (c) PUT đổi sang template
// inactive bị chặn, PUT giữ nguyên template cũ (kể cả đã inactive) thì OK.
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
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `game_template_link_test_${process.pid}`;
} else {
  // dbPath gắn PID như test-games-subject-id.mjs: thư mục cố định sẽ sót
  // dữ liệu của lần chạy trước làm sai kết quả.
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-game-template-link-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "game_template_link_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const teacher = signToken({ id: "user-gv-tpl", username: "gvtpl", role: "teacher", name: "Giáo Viên Template" });

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

// ── Dữ liệu nền: 3 template (published/draft/inactive) + game gắn sẵn ────
const now = new Date().toISOString();
const tplPub = await getCollection("templates").insertOne({
  name: "Template Đã Xuất Bản", status: "published", version: 3, category: "quiz", type: "play-to-learn",
  createdAt: now, updatedAt: now,
});
const tplDraft = await getCollection("templates").insertOne({
  name: "Template Bản Nháp", status: "draft", version: 1, category: "quiz", type: "play-to-learn",
  createdAt: now, updatedAt: now,
});
const tplOff = await getCollection("templates").insertOne({
  name: "Template Đã Tắt", status: "inactive", version: 2, category: "quiz", type: "play-to-learn",
  createdAt: now, updatedAt: now,
});
const pubId = tplPub.insertedId.toString();
const draftId = tplDraft.insertedId.toString();
const offId = tplOff.insertedId.toString();

// 2 game dùng template published, 1 game dùng template draft (gắn thẳng DB,
// mô phỏng game cũ tạo từ trước khi template bị hạ trạng thái).
for (const [name, tpl] of [["Game Dùng Pub 1", pubId], ["Game Dùng Pub 2", pubId], ["Game Dùng Draft", draftId]]) {
  await getCollection("games").insertOne({
    name, templateId: new ObjectId(tpl), status: "published", code: `TPL${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    createdAt: now, updatedAt: now,
  });
}
const gameDraftTpl = await getCollection("games").findOne({ name: "Game Dùng Draft" });
const gameDraftTplId = gameDraftTpl._id.toString();

// ── (a) gamesCount ở list + get từng template ────────────────────────────
const listRes = await req("GET", "/api/templates");
const byId = Object.fromEntries((listRes.body?.data || []).map((t) => [t._id, t]));
check("List templates: gamesCount của published = 2", byId[pubId]?.gamesCount, 2);
check("List templates: gamesCount của draft = 1", byId[draftId]?.gamesCount, 1);
check("List templates: gamesCount của inactive = 0", byId[offId]?.gamesCount, 0);

const gotTpl = await req("GET", `/api/templates/${pubId}`);
check("Get 1 template: gamesCount = 2", gotTpl.body?.data?.gamesCount, 2);
check("Get 1 template: vẫn có version", gotTpl.body?.data?.version, 3);

// ── (b) POST /api/games: chặn template chưa published ────────────────────
const postInactive = await req("POST", "/api/games", teacher, { name: "Game Từ Inactive", templateId: offId, status: "draft" });
checkTrue("POST template inactive: bị chặn (không phải 201)", postInactive.status !== 201, `status=${postInactive.status}`);
checkTrue("POST template inactive: message nêu lý do", String(postInactive.body?.msg || "").includes("chưa xuất bản hoặc đã tắt"), JSON.stringify(postInactive.body));

const postDraft = await req("POST", "/api/games", teacher, { name: "Game Từ Draft", templateId: draftId, status: "draft" });
checkTrue("POST template draft: bị chặn (không phải 201)", postDraft.status !== 201, `status=${postDraft.status}`);

const postPub = await req("POST", "/api/games", teacher, { name: "Game Từ Published", templateId: pubId, status: "draft" });
check("POST template published: 201", postPub.status, 201);
check("POST template published: templateId khớp", postPub.body?.data?.templateId, pubId);

const postNone = await req("POST", "/api/games", teacher, { name: "Game Không Template", status: "draft" });
check("POST không templateId: 201", postNone.status, 201);

const postBogus = await req("POST", "/api/games", teacher, { name: "Game Template Lạ", templateId: new ObjectId().toString(), status: "draft" });
check("POST templateId lạ không tồn tại: vẫn 201 (không chặn)", postBogus.status, 201);

// gamesCount tăng sau khi tạo thêm game từ template published
const listAfter = await req("GET", "/api/templates");
const byIdAfter = Object.fromEntries((listAfter.body?.data || []).map((t) => [t._id, t]));
check("Sau POST: gamesCount của published = 3", byIdAfter[pubId]?.gamesCount, 3);

// ── (c) PUT: đổi template mới bị chặn, giữ template cũ thì không ─────────
const putToInactive = await req("PUT", `/api/games/${gameDraftTplId}`, teacher, { templateId: offId });
checkTrue("PUT đổi sang template inactive: bị chặn", putToInactive.status !== 200, `status=${putToInactive.status}`);
checkTrue("PUT đổi sang template inactive: message nêu lý do", String(putToInactive.body?.msg || "").includes("chưa xuất bản hoặc đã tắt"), JSON.stringify(putToInactive.body));

const putSameTpl = await req("PUT", `/api/games/${gameDraftTplId}`, teacher, { templateId: draftId, name: "Game Dùng Draft (đổi tên)" });
check("PUT giữ nguyên template draft cũ: 200", putSameTpl.status, 200);
check("PUT giữ nguyên template: tên đã đổi", putSameTpl.body?.data?.name, "Game Dùng Draft (đổi tên)");

const putOtherField = await req("PUT", `/api/games/${gameDraftTplId}`, teacher, { topic: "Chủ đề mới" });
check("PUT chỉ sửa field khác (không gửi templateId): 200", putOtherField.status, 200);
check("PUT chỉ sửa field khác: topic đã đổi", putOtherField.body?.data?.topic, "Chủ đề mới");

const putToPub = await req("PUT", `/api/games/${gameDraftTplId}`, teacher, { templateId: pubId });
check("PUT đổi sang template published: 200", putToPub.status, 200);
check("PUT đổi sang published: templateId đã đổi", putToPub.body?.data?.templateId, pubId);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
if (mongod) await mongod.stop();
else await db.getDb().dropDatabase();
process.exit(failed === 0 ? 0 : 1);
