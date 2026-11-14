// Test LỌC THƯ VIỆN ẢNH THEO CHỦ SỞ HỮU + ĐỒNG BỘ ẢNH VÔ CHỦ
// (Nguyên chốt quy tắc 2026-11-14):
//   • Upload mới gắn chủ = user đang đăng nhập.
//   • User thường CHỈ thấy ảnh của mình; ảnh chưa có chủ (dữ liệu cũ)
//     CHỈ admin thấy; ảnh của người khác không lộ qua list/search/info,
//     không xoá được (kể cả admin cũng không xoá được ảnh đã có chủ
//     của người khác).
//   • POST /api/images/claim-unowned (chỉ admin): gán toàn bộ ảnh chưa
//     có chủ cho admin vừa bấm, trả số lượng đã gán.
// Cloudinary được MOCK bằng stub HTTP local đúng các endpoint SDK dùng
// (upload/list/detail/search/destroy/delete_resources) — KHÔNG dùng key
// thật, KHÔNG gọi mạng ngoài. SDK cloudinary chọn http/https theo
// `upload_prefix` ngay lúc nạp module nên phải cấu hình TRƯỚC khi import
// app (qua createRequire vào lib/config.js của chính SDK).
//   node server/scripts/test-images-owner-filter.mjs
import { MongoMemoryServer } from "mongodb-memory-server";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-images-owner-mongo-data-${process.pid}`);
mkdirSync(dbPath, { recursive: true });
const mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
process.env.MONGODB_URI = mongod.getUri();
process.env.MONGODB_DB = "images_owner_test";

// ───────────────────── Stub Cloudinary ─────────────────────
const store = new Map(); // publicId -> resource
let uploadSeq = 0;
function seedResource(publicId) {
  store.set(publicId, {
    public_id: publicId,
    secure_url: `https://res.testcloud/${publicId}.jpg`,
    width: 100, height: 80, format: "jpg", bytes: 1234,
    created_at: "2026-01-01T00:00:00.000Z",
  });
}
const readBody = (req) => new Promise((resolve) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => resolve(Buffer.concat(chunks)));
});

const stub = createServer(async (req, res) => {
  const url = new URL(req.url, "http://stub");
  // SDK mã hoá cả cụm "resources/search" và publicId trong path → giải mã
  // một lần ở đây rồi mới đối chiếu route.
  const p = decodeURIComponent(url.pathname);
  const json = (obj, code = 200) => {
    res.writeHead(code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(obj));
  };
  const LIST_PATH = "/v1_1/testcloud/resources/image/upload";

  if (req.method === "POST" && p === "/v1_1/testcloud/image/upload") {
    const body = (await readBody(req)).toString("latin1");
    const folder = /name="folder"\r\n\r\n([^\r\n]+)/.exec(body)?.[1] || "edu-game";
    const publicId = `${folder}/up${++uploadSeq}`;
    const resource = {
      public_id: publicId,
      secure_url: `https://res.testcloud/${publicId}.png`,
      width: 10, height: 10, format: "png", bytes: 68,
      created_at: "2026-11-14T00:00:00.000Z",
    };
    store.set(publicId, resource);
    return json(resource);
  }
  if (req.method === "GET" && p === LIST_PATH) {
    const prefix = url.searchParams.get("prefix") || "";
    const maxResults = Number(url.searchParams.get("max_results")) || 500;
    const offset = Number(url.searchParams.get("next_cursor")) || 0;
    const items = [...store.values()]
      .filter(r => r.public_id.startsWith(prefix))
      .sort((a, b) => a.public_id.localeCompare(b.public_id));
    const slice = items.slice(offset, offset + maxResults);
    const out = { resources: slice, total_count: items.length };
    if (offset + slice.length < items.length) out.next_cursor = String(offset + slice.length);
    return json(out);
  }
  if (req.method === "GET" && p.startsWith(LIST_PATH + "/")) {
    const publicId = p.slice(LIST_PATH.length + 1);
    const r = store.get(publicId);
    if (!r) return json({ error: { message: "Resource not found" } }, 404);
    return json(r);
  }
  if (req.method === "POST" && p === "/v1_1/testcloud/resources/search") {
    await readBody(req);
    const resources = [...store.values()];
    return json({ resources, total_count: resources.length });
  }
  if (req.method === "POST" && p === "/v1_1/testcloud/image/destroy") {
    // SDK gửi tham số dạng multipart HOẶC urlencoded tuỳ đường gọi — bắt cả hai.
    const raw = (await readBody(req)).toString("latin1");
    const publicId = new URLSearchParams(raw).get("public_id")
      || /name="public_id"\r\n\r\n([^\r\n]+)/.exec(raw)?.[1];
    if (publicId && store.delete(publicId)) return json({ result: "ok" });
    return json({ result: "not found" });
  }
  if (req.method === "DELETE" && p === LIST_PATH) {
    const raw = (await readBody(req)).toString("latin1");
    const ids = [];
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith("public_ids")) ids.push(value);
    }
    for (const [key, value] of new URLSearchParams(raw).entries()) {
      if (key.startsWith("public_ids")) ids.push(value);
    }
    for (const m of raw.matchAll(/name="public_ids(?:\[\])?"\r\n\r\n([^\r\n]+)/g)) ids.push(m[1]);
    const deleted = {};
    for (const id of ids) {
      store.delete(id);
      deleted[id] = "deleted";
    }
    return json({ deleted });
  }
  if (req.method === "GET" && p === "/v1_1/testcloud/folders") {
    return json({ folders: [{ name: "edu-game", path: "edu-game" }] });
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: { message: `stub: no route ${req.method} ${p}` } }));
});
await new Promise((resolve) => stub.listen(0, "127.0.0.1", resolve));

// Cấu hình SDK cloudinary về stub TRƯỚC khi app (và route images) nạp.
process.env.CLOUDINARY_CLOUD_NAME = "testcloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";
const require = createRequire(import.meta.url);
const cfgMod = require("cloudinary/lib/config.js");
const cfgFn = typeof cfgMod === "function" ? cfgMod : cfgMod.default;
cfgFn({
  cloud_name: "testcloud",
  api_key: "test-key",
  api_secret: "test-secret",
  upload_prefix: `http://127.0.0.1:${stub.address().port}`,
});

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");

const OLD = "2026-01-05T00:00:00.000Z";
const mkUser = (id, name, role) => ({
  id, username: id.replace("user-", ""), name, role, passwordHash: "x",
  email: `${id.replace("user-", "")}@test.local`, createdAt: OLD,
});
await db.getCollection("users").insertMany([
  mkUser("user-admin", "Quản Trị Viên", "admin"),
  mkUser("user-gv1", "Giáo Viên Một", "teacher"),
  mkUser("user-gv2", "Giáo Viên Hai", "teacher"),
]);
// Cấu hình tĩnh mặc định của vai teacher KHÔNG có quyền images.delete
// (middleware permissionFilter chặn DELETE trước khi vào route). Seed một
// role doc có images.delete để các ca xoá đi tới được logic chủ sở hữu
// trong route — đúng trạng thái khi admin bật quyền xoá ảnh cho giáo viên
// ở trang Phân quyền.
await db.getCollection("roles").insertOne({
  id: "role-teacher",
  key: "teacher",
  label: "Giáo viên (test)",
  isBuiltIn: false,
  matrix: { images: { view: true, edit: true, delete: true } },
  extraPermissions: ["games.play", "profile"],
  createdAt: OLD,
});
const tok = (id, role, name) => signToken({ id, username: id.replace("user-", ""), role, name });
const admin = tok("user-admin", "admin", "Quản Trị Viên");
const gvA = tok("user-gv1", "teacher", "Giáo Viên Một");
const gvB = tok("user-gv2", "teacher", "Giáo Viên Hai");

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

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

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64"
);
async function uploadOne(token) {
  const form = new FormData();
  form.append("file", new Blob([PNG], { type: "image/png" }), "a.png");
  form.append("folder", "edu-game");
  const r = await fetch(`${base}/api/images/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
async function uploadMany(token, n) {
  const form = new FormData();
  for (let i = 0; i < n; i++) form.append("files", new Blob([PNG], { type: "image/png" }), `f${i}.png`);
  form.append("folder", "edu-game");
  const r = await fetch(`${base}/api/images/upload-multiple`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
async function api(token, method, pathQ, body) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const r = await fetch(`${base}${pathQ}`, {
    method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, body: await r.json().catch(() => ({})) };
}
const listIds = async (token, qs = "folder=edu-game&perPage=100") => {
  const r = await api(token, "GET", `/api/images?${qs}`);
  return { ...r, ids: (r.body?.data?.images || []).map(i => i.publicId).sort() };
};
const ownerOf = async (publicId) =>
  db.getCollection("imageOwners").findOne({ publicId });

// ── Chưa đăng nhập → 401 ──
const anon = await api(null, "GET", "/api/images?folder=edu-game");
check("chưa đăng nhập → 401", anon.status, 401);

// ── Upload gắn chủ = user đang đăng nhập ──
const upA1 = await uploadOne(gvA);
check("GV A upload → 200", upA1.status, 200);
const aFirst = upA1.body?.data?.publicId;
checkTrue("upload trả publicId trong folder edu-game", typeof aFirst === "string" && aFirst.startsWith("edu-game/"), aFirst);
const recA = await ownerOf(aFirst);
check("bản ghi chủ của ảnh A: ownerId", recA?.ownerId, "user-gv1");
check("bản ghi chủ của ảnh A: source", recA?.source, "upload");

const upB1 = await uploadOne(gvB);
const bFirst = upB1.body?.data?.publicId;
check("bản ghi chủ của ảnh B: ownerId", (await ownerOf(bFirst))?.ownerId, "user-gv2");

const upA2 = await uploadMany(gvA, 2);
check("GV A upload-multiple → 200, count 2", [upA2.status, upA2.body?.data?.count], [200, 2]);
const aIds = [aFirst, ...(upA2.body?.data?.images || []).map(i => i.publicId)].sort();
checkTrue("cả 2 ảnh upload-multiple đều ghi chủ user-gv1",
  (await Promise.all(aIds.slice(1).map(ownerOf))).every(r => r?.ownerId === "user-gv1"));

// ── Ảnh cũ chưa có chủ (seed thẳng vào Cloudinary, không có bản ghi) ──
seedResource("edu-game/legacy1");
seedResource("edu-game/legacy2");

// ── Danh sách: mỗi user chỉ thấy ảnh của mình; admin chỉ thấy ảnh vô chủ ──
const listA = await listIds(gvA);
check("GV A: chỉ thấy 3 ảnh của mình", listA.ids, aIds);
check("GV A: totalCount = 3", listA.body?.data?.totalCount, 3);
checkTrue("GV A: mọi ảnh đều ownerId user-gv1",
  (listA.body?.data?.images || []).every(i => i.ownerId === "user-gv1"));

const listB = await listIds(gvB);
check("GV B: chỉ thấy 1 ảnh của mình", listB.ids, [bFirst]);

const listAdmin = await listIds(admin);
check("admin: chỉ thấy 2 ảnh chưa có chủ", listAdmin.ids, ["edu-game/legacy1", "edu-game/legacy2"]);
checkTrue("admin: ảnh vô chủ có ownerId null",
  (listAdmin.body?.data?.images || []).every(i => i.ownerId === null));

// ── Phân trang đúng khi kho lẫn nhiều chủ: A có 3 ảnh, perPage=2 ──
const page1 = await listIds(gvA, "folder=edu-game&perPage=2&page=1");
const page2 = await listIds(gvA, "folder=edu-game&perPage=2&page=2");
check("phân trang A: trang 1 có 2 ảnh", page1.ids.length, 2);
check("phân trang A: trang 2 có 1 ảnh", page2.ids.length, 1);
check("phân trang A: gộp 2 trang = đủ 3 ảnh của A", [...page1.ids, ...page2.ids].sort(), aIds);

// ── Search cũng lọc theo chủ ──
const searchB = await api(gvB, "GET", "/api/images/search?q=edu-game");
check("search GV B: chỉ ảnh của B",
  (searchB.body?.data?.images || []).map(i => i.publicId), [bFirst]);

// ── Xem chi tiết: ảnh người khác / ảnh vô chủ với user thường → 404 ──
check("GV B xem ảnh của A → 404",
  (await api(gvB, "GET", `/api/images/${encodeURIComponent(aFirst)}`)).status, 404);
check("GV B xem ảnh vô chủ → 404",
  (await api(gvB, "GET", "/api/images/edu-game%2Flegacy1")).status, 404);
const infoAdmin = await api(admin, "GET", "/api/images/edu-game%2Flegacy1");
check("admin xem ảnh vô chủ → 200, ownerId null",
  [infoAdmin.status, infoAdmin.body?.data?.ownerId], [200, null]);
check("GV A xem ảnh của mình → 200",
  (await api(gvA, "GET", `/api/images/${encodeURIComponent(aFirst)}`)).status, 200);

// ── Xoá đơn: chỉ chủ (hoặc admin với ảnh vô chủ) ──
check("GV B xoá ảnh của A → 403",
  (await api(gvB, "DELETE", `/api/images/${encodeURIComponent(aFirst)}`)).status, 403);
checkTrue("ảnh của A vẫn còn sau lần xoá trái quyền", store.has(aFirst));
check("GV B xoá ảnh vô chủ → 403",
  (await api(gvB, "DELETE", "/api/images/edu-game%2Flegacy1")).status, 403);
const delA = await api(gvA, "DELETE", `/api/images/${encodeURIComponent(aIds[2])}`);
check("GV A xoá ảnh của mình → 200", delA.status, 200);
checkTrue("ảnh đã xoá khỏi Cloudinary (stub)", !store.has(aIds[2]));
check("bản ghi chủ của ảnh đã xoá bị dọn", await ownerOf(aIds[2]), null);

// ── Xoá nhiều: admin xoá [ảnh của B, ảnh vô chủ] → chỉ ảnh vô chủ bị xoá ──
const bulk = await api(admin, "DELETE", "/api/images", { publicIds: [bFirst, "edu-game/legacy1"] });
check("admin xoá nhiều → 200", bulk.status, 200);
check("xoá nhiều: skippedCount = 1 (ảnh của B)", bulk.body?.data?.skippedCount, 1);
check("xoá nhiều: skippedPublicIds = [ảnh của B]", bulk.body?.data?.skippedPublicIds, [bFirst]);
checkTrue("ảnh của B vẫn còn", store.has(bFirst));
checkTrue("ảnh vô chủ legacy1 đã bị xoá", !store.has("edu-game/legacy1"));

// ── Đồng bộ: user thường bị 403; admin gán toàn bộ ảnh vô chủ cho mình ──
check("GV A gọi đồng bộ → 403",
  (await api(gvA, "POST", "/api/images/claim-unowned", { folder: "edu-game" })).status, 403);
const sync = await api(admin, "POST", "/api/images/claim-unowned", { folder: "edu-game" });
check("admin đồng bộ → 200", sync.status, 200);
check("đồng bộ: claimed = 1 (chỉ còn legacy2 vô chủ)", sync.body?.data?.claimed, 1);
check("đồng bộ: totalScanned = 4 ảnh trong folder", sync.body?.data?.totalScanned, 4);
const recLegacy2 = await ownerOf("edu-game/legacy2");
check("legacy2 sau đồng bộ: ownerId = admin", recLegacy2?.ownerId, "user-admin");
check("legacy2 sau đồng bộ: source = sync", recLegacy2?.source, "sync");

const listAdmin2 = await listIds(admin);
check("admin sau đồng bộ: thấy legacy2 (nay là của mình)", listAdmin2.ids, ["edu-game/legacy2"]);
check("admin sau đồng bộ: legacy2 có ownerId user-admin",
  listAdmin2.body?.data?.images?.[0]?.ownerId, "user-admin");
const listA2 = await listIds(gvA);
check("GV A sau đồng bộ: vẫn chỉ thấy ảnh của mình", listA2.ids, aIds.slice(0, 2));
const sync2 = await api(admin, "POST", "/api/images/claim-unowned", { folder: "edu-game" });
check("đồng bộ lần 2: claimed = 0 (không còn ảnh vô chủ)", sync2.body?.data?.claimed, 0);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} FAIL`);
server.close();
stub.close();
await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
