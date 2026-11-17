// Test tích hợp: GỘP API pet vào API hồ sơ/users + dọn endpoint thừa.
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-checkin.mjs):
//   node server/scripts/test-pet-merge.mjs
// Bao phủ:
//   • GET /api/users/me/pet: chưa đăng nhập 401; học sinh đọc được trạng
//     thái đầy đủ (loài/cấp/EXP/mood + field `look`).
//   • Hồ sơ trả pet ĐẦY ĐỦ: GET /api/auth/me và GET /api/users/me đều có
//     pet.species/level/exp/mood/look — không chỉ bộ đồ DressUp thô.
//   • POST /api/users/me/pet/exp cộng EXP + lên cấp; /mood đổi tâm tính
//     (mood sai → 400); PUT đổi tên; POST /reset đặt lại mặc định.
//   • Admin catalog qua đường mới: học sinh → 403; giáo viên đọc được
//     danh mục + tạo mới một mục.
//   • Đường cũ + endpoint đã dọn → 404: /api/pet, /api/game-sessions/:id,
//     /api/avatar/categories, /api/images/folders,
//     /api/notifications/devices. Endpoint avatar còn giữ vẫn chạy:
//     GET /api/avatar/items → 200.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `petmerge_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-petmerge-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "petmerge_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};

const req = async (method, p, token, body) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

async function seedUser(id, role = "student") {
  await getCollection("users").insertOne({
    id, username: id, name: `User ${id}`, role,
    passwordHash: "x", coins: 0, createdAt: new Date().toISOString(),
  });
  return signToken({ id, username: id, role, name: `User ${id}` });
}

const student = await seedUser("hs-pet-1", "student");
const teacher = await seedUser("gv-pet-1", "teacher");

// ── Chưa đăng nhập → 401 ─────────────────────────────────────────────────
const anon = await req("GET", "/api/users/me/pet");
check("GET /users/me/pet chưa đăng nhập: 401", anon.status, 401);

// ── Học sinh đọc pet qua đường mới ───────────────────────────────────────
const got = await req("GET", "/api/users/me/pet", student);
check("GET /users/me/pet: 200", got.status, 200);
check("pet mặc định là chó", got.body?.data?.species, "dog");
check("pet cấp 1", got.body?.data?.level, 1);
check("pet EXP 0", got.body?.data?.exp, 0);
check("pet mood happy", got.body?.data?.mood, "happy");
check("pet có field look", Object.prototype.hasOwnProperty.call(got.body?.data || {}, "look"), true);
check("pet không lộ userId", got.body?.data?.userId, undefined);

// ── Hồ sơ trả pet ĐẦY ĐỦ ─────────────────────────────────────────────────
const meAuth = await req("GET", "/api/auth/me", student);
check("GET /auth/me: 200", meAuth.status, 200);
check("/auth/me pet.species", meAuth.body?.data?.pet?.species, "dog");
check("/auth/me pet.level", meAuth.body?.data?.pet?.level, 1);
check("/auth/me pet có look", Object.prototype.hasOwnProperty.call(meAuth.body?.data?.pet || {}, "look"), true);

// LƯU Ý: GET /api/users/me (handler viết tay trong app.js) xưa nay học sinh
// bị 403 sẵn — adminRouter của gameProgress mount trước nó và chặn
// requireRoles("teacher","admin") (đã kiểm chứng trên base chưa sửa).
// Nên phần pet của /users/me được kiểm bằng token giáo viên; hồ sơ học
// sinh đi qua /api/auth/me (đã kiểm ở trên).
const meUsers = await req("GET", "/api/users/me", teacher);
check("GET /users/me (giáo viên): 200", meUsers.status, 200);
check("/users/me pet.species", meUsers.body?.data?.pet?.species, "dog");
check("/users/me pet.level", meUsers.body?.data?.pet?.level, 1);
check("/users/me pet có look", Object.prototype.hasOwnProperty.call(meUsers.body?.data?.pet || {}, "look"), true);

// ── Cộng EXP qua đường mới ───────────────────────────────────────────────
// expNeeded cấp 1 = 200 → cộng 250: lên cấp 2, còn 50 EXP.
const exp = await req("POST", "/api/users/me/pet/exp", student, { amount: 250, correct: 3, wrong: 1 });
check("POST /users/me/pet/exp: 200", exp.status, 200);
check("exp: lên cấp 2", exp.body?.data?.pet?.level, 2);
check("exp: còn 50 EXP", exp.body?.data?.pet?.exp, 50);
check("exp: levelUp = true", exp.body?.data?.levelUp, true);
check("exp: totalCorrect = 3", exp.body?.data?.pet?.totalCorrect, 3);

// ── Đổi mood / tên / reset ───────────────────────────────────────────────
const mood = await req("POST", "/api/users/me/pet/mood", student, { mood: "sleepy" });
check("POST /users/me/pet/mood: mood = sleepy", mood.body?.data?.mood, "sleepy");
const badMood = await req("POST", "/api/users/me/pet/mood", student, { mood: "khong-co" });
check("POST /users/me/pet/mood sai: 400", badMood.status, 400);

const renamed = await req("PUT", "/api/users/me/pet", student, { name: "Bé Cún" });
check("PUT /users/me/pet: đổi tên", renamed.body?.data?.name, "Bé Cún");

const reset = await req("POST", "/api/users/me/pet/reset", student, {});
check("POST /users/me/pet/reset: mood về happy", reset.body?.data?.mood, "happy");
check("POST /users/me/pet/reset: giữ tên", reset.body?.data?.name, "Bé Cún");

// ── Admin catalog qua đường mới ──────────────────────────────────────────
const stuAdmin = await req("GET", "/api/users/admin/pet-catalog", student);
check("Học sinh gọi admin pet-catalog: 403", stuAdmin.status, 403);

const teaAdmin = await req("GET", "/api/users/admin/pet-catalog", teacher);
check("Giáo viên đọc pet-catalog: 200", teaAdmin.status, 200);
check("catalog có species", Array.isArray(teaAdmin.body?.data?.species), true);
check("catalog có usage", typeof teaAdmin.body?.data?.usage, "object");

const created = await req("POST", "/api/users/admin/pet-catalog/species", teacher, {
  id: "test-fox", name: "Cáo Kiểm Tra", minLevel: 3,
});
check("Giáo viên tạo species mới: 200", created.status, 200);
check("species mới có id", created.body?.data?.id, "test-fox");

// ── Đường cũ + endpoint đã dọn → 404 ────────────────────────────────────
check("GET /api/pet (cũ): 404", (await req("GET", "/api/pet", student)).status, 404);
check("POST /api/pet/exp (cũ): 404", (await req("POST", "/api/pet/exp", student, { amount: 5 })).status, 404);
check("GET /api/pet/admin/catalog (cũ): 404", (await req("GET", "/api/pet/admin/catalog", teacher)).status, 404);
check("GET /api/game-sessions/abc: 404", (await req("GET", "/api/game-sessions/abc", student)).status, 404);
check("GET /api/avatar/categories (đã dọn): 404", (await req("GET", "/api/avatar/categories", student)).status, 404);
check("GET /api/avatar/inventory (đã dọn): 404", (await req("GET", "/api/avatar/inventory", student)).status, 404);
check("POST /api/avatar/buy (đã dọn): 404", (await req("POST", "/api/avatar/buy", student, { itemCode: "skin_02" })).status, 404);
check("GET /api/images/folders (đã dọn): 404", (await req("GET", "/api/images/folders", student)).status, 404);
check("GET /api/notifications/devices (đã dọn): 404", (await req("GET", "/api/notifications/devices", student)).status, 404);

// ── Endpoint còn giữ vẫn chạy ────────────────────────────────────────────
const avatarItems = await req("GET", "/api/avatar/items", student);
check("GET /api/avatar/items (còn giữ): 200", avatarItems.status, 200);
check("avatar items có dữ liệu seed", (avatarItems.body?.data?.items || []).length > 0, true);

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
server.close();
if (mongod) await mongod.stop();
process.exit(failed === 0 ? 0 : 1);
