// Test tích hợp: POST /api/v1/user/refresh (refresh token kiểu v1 — Nguyên yêu cầu).
// Chạy app Express THẬT trên Mongo in-memory (mẫu như test-checkin.mjs):
//   node server/scripts/test-refresh-v1.mjs
// Bao phủ: không cookie → 401 status:false; origin lạ → 403; cookie hợp lệ →
// 200 với ĐÚNG 4 field {status, code, msg, Authorization} như ảnh mẫu; cookie
// được set ở Path=/api (điều kiện để trình duyệt gửi cookie tới /api/v1);
// access token mới dùng được ở /api/auth/me; refresh tiếp bằng cookie ĐÃ xoay
// vòng vẫn 200; endpoint cũ /api/auth/refresh giữ nguyên shape tương thích
// (có cả Authorization lẫn data.token); cookie rác → 401.
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `refresh_v1_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-refresh-v1-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "refresh_v1_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { issueRefreshToken, REFRESH_COOKIE_NAME } = await import("../src/services/refreshTokenService.js");
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

const GOOD_ORIGIN = "https://hosutrungnguyen3105.github.io";

/** POST refresh; trả { status, body, setCookies } — setCookies là mảng chuỗi Set-Cookie thô. */
const postRefresh = async (p, { cookie, origin } = {}) => {
  const res = await fetch(`${base}${p}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: `${REFRESH_COOKIE_NAME}=${cookie}` } : {}),
      ...(origin ? { Origin: origin } : {}),
    },
    body: "{}",
  });
  return { status: res.status, body: await res.json().catch(() => null), setCookies: res.headers.getSetCookie() };
};

/** Lấy giá trị cookie refresh mới nhất từ các header Set-Cookie của một response. */
const cookieValueFrom = (setCookies) => {
  for (const sc of setCookies) {
    const m = new RegExp(`^${REFRESH_COOKIE_NAME}=([^;]+)`).exec(sc);
    if (m && m[1]) return decodeURIComponent(m[1]);
  }
  return null;
};

// ── Seed user + phát hành refresh token qua đúng service production ──────
const USER_ID = "user-refresh-v1";
await getCollection("users").insertOne({
  id: USER_ID,
  username: USER_ID,
  name: "HS Refresh",
  role: "student",
  passwordHash: "x",
  coins: 0,
  createdAt: new Date().toISOString(),
});
const raw0 = await issueRefreshToken({ id: USER_ID });

// ── 1. Không cookie → 401, status:false ──────────────────────────────────
const noCookie = await postRefresh("/api/v1/user/refresh", { origin: GOOD_ORIGIN });
check("v1 không cookie: 401", noCookie.status, 401);
check("v1 không cookie: status=false", noCookie.body?.status, false);
check("v1 không cookie: code=401", noCookie.body?.code, 401);

// ── 2. Origin lạ → 403 (kiểm tra origin dùng chung với luồng gốc) ────────
const badOrigin = await postRefresh("/api/v1/user/refresh", { cookie: raw0, origin: "https://evil.example.com" });
check("v1 origin lạ: 403", badOrigin.status, 403);
check("v1 origin lạ: status=false", badOrigin.body?.status, false);

// ── 3. Cookie hợp lệ → 200 + đúng 4 field như ảnh ────────────────────────
const ok1 = await postRefresh("/api/v1/user/refresh", { cookie: raw0, origin: GOOD_ORIGIN });
check("v1 refresh: 200", ok1.status, 200);
check("v1 refresh: đúng 4 field", Object.keys(ok1.body || {}).sort(), ["Authorization", "code", "msg", "status"]);
check("v1 refresh: status=true", ok1.body?.status, true);
check("v1 refresh: code=200", ok1.body?.code, 200);
check("v1 refresh: msg=refresh.success", ok1.body?.msg, "refresh.success");
check("v1 refresh: Authorization dạng Bearer", /^Bearer .+/.test(ok1.body?.Authorization || ""), true);

// Cookie mới phải được set ở Path=/api — hẹp hơn thì trình duyệt không gửi
// cookie tới /api/v1/user/refresh và endpoint này vô dụng ở trình duyệt thật.
const setCookieLine = ok1.setCookies.find((sc) => sc.startsWith(`${REFRESH_COOKIE_NAME}=`));
check("v1 refresh: có Set-Cookie refresh mới", !!setCookieLine, true);
check("v1 refresh: cookie ở Path=/api", /Path=\/api(;|$)/i.test(setCookieLine || ""), true);
const raw1 = cookieValueFrom(ok1.setCookies);
check("v1 refresh: cookie đã xoay vòng (khác cookie cũ)", !!raw1 && raw1 !== raw0, true);

// ── 4. Access token mới dùng được ở endpoint cần auth ────────────────────
const newAccess = String(ok1.body?.Authorization || "").replace(/^Bearer\s+/i, "");
const me = await fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${newAccess}` } });
const meBody = await me.json().catch(() => null);
check("token mới gọi /auth/me: 200", me.status, 200);
check("token mới gọi /auth/me: đúng user", meBody?.data?.id, USER_ID);

// ── 5. Refresh tiếp bằng cookie ĐÃ xoay vòng → vẫn 200 ───────────────────
const ok2 = await postRefresh("/api/v1/user/refresh", { cookie: raw1, origin: GOOD_ORIGIN });
check("v1 refresh lần 2 (cookie đã xoay): 200", ok2.status, 200);
check("v1 refresh lần 2: msg=refresh.success", ok2.body?.msg, "refresh.success");

// ── 6. Endpoint cũ /api/auth/refresh vẫn chạy, giữ shape tương thích ─────
const rawLegacy = await issueRefreshToken({ id: USER_ID });
const legacy = await postRefresh("/api/auth/refresh", { cookie: rawLegacy, origin: GOOD_ORIGIN });
check("auth/refresh cũ: 200", legacy.status, 200);
check("auth/refresh cũ: có Authorization", /^Bearer .+/.test(legacy.body?.Authorization || ""), true);
check("auth/refresh cũ: vẫn có data.token", typeof legacy.body?.data?.token, "string");

// ── 7. Cookie rác → 401 status:false ─────────────────────────────────────
const garbage = await postRefresh("/api/v1/user/refresh", { cookie: "khong-phai-token", origin: GOOD_ORIGIN });
check("v1 cookie rác: 401", garbage.status, 401);
check("v1 cookie rác: status=false", garbage.body?.status, false);

// ── Ca grace period (fix lỗi mobile bị đá về login oan) ─────────────────
// Bối cảnh: hai lượt refresh CHỒNG nhau dùng cùng một cookie (PWA + tab
// trình duyệt cùng vòng 20 giây, hoặc retry khi mất response). Thiết kế cũ
// coi token đã xoay bị trình lại là đánh cắp → thu hồi cả family, giết luôn
// token mới của phía thắng. Nay: trong cửa sổ grace 60s + family còn token
// active → cấp token "anh em"; ngoài grace → giữ nguyên hành vi bảo mật cũ.
const { createHash } = await import("node:crypto");
const seedUserWithToken = async (id) => {
  await getCollection("users").insertOne({
    id, username: id, name: id, role: "student", passwordHash: "x", coins: 0,
    createdAt: new Date().toISOString(),
  });
  return issueRefreshToken({ id });
};

// ── 8. Hai refresh ĐỒNG THỜI cùng một token: cả hai 200, family còn sống ─
const raceRaw = await seedUserWithToken("user-refresh-race");
const [raceA, raceB] = await Promise.all([
  postRefresh("/api/v1/user/refresh", { cookie: raceRaw, origin: GOOD_ORIGIN }),
  postRefresh("/api/v1/user/refresh", { cookie: raceRaw, origin: GOOD_ORIGIN }),
]);
check("race: phía A 200", raceA.status, 200);
check("race: phía B (thua cuộc đua) cũng 200 nhờ grace", raceB.status, 200);
const raceNextA = cookieValueFrom(raceA.setCookies);
const raceNextB = cookieValueFrom(raceB.setCookies);
check("race: hai phía nhận hai cookie khác nhau", !!raceNextA && !!raceNextB && raceNextA !== raceNextB, true);
const raceA2 = await postRefresh("/api/v1/user/refresh", { cookie: raceNextA, origin: GOOD_ORIGIN });
check("race: token kế tiếp phía A refresh tiếp 200", raceA2.status, 200);
const raceB2 = await postRefresh("/api/v1/user/refresh", { cookie: raceNextB, origin: GOOD_ORIGIN });
check("race: token kế tiếp phía B refresh tiếp 200 (family còn sống)", raceB2.status, 200);

// ── 9. Trình lại token cũ NGAY sau khi xoay (retry mất response) ─────────
const retryRaw0 = await seedUserWithToken("user-refresh-retry");
const win = await postRefresh("/api/v1/user/refresh", { cookie: retryRaw0, origin: GOOD_ORIGIN });
check("retry: lượt thắng 200", win.status, 200);
const winNext = cookieValueFrom(win.setCookies);
const retry = await postRefresh("/api/v1/user/refresh", { cookie: retryRaw0, origin: GOOD_ORIGIN });
check("retry: trình lại token cũ trong grace → 200", retry.status, 200);
const retryNext = cookieValueFrom(retry.setCookies);
check("retry: nhận cookie anh em (khác cookie phía thắng)", !!retryNext && retryNext !== winNext, true);
const win2 = await postRefresh("/api/v1/user/refresh", { cookie: winNext, origin: GOOD_ORIGIN });
check("retry: token phía thắng vẫn refresh tiếp 200 (không bị giết oan)", win2.status, 200);
const retry2 = await postRefresh("/api/v1/user/refresh", { cookie: retryNext, origin: GOOD_ORIGIN });
check("retry: token anh em refresh tiếp 200", retry2.status, 200);

// ── 10. Trình lại token cũ SAU grace → reuse_detected + family chết ──────
// Ca bảo mật bắt buộc giữ nguyên thiết kế cũ: backdate `updatedAt` của dòng
// đã rotated ra ngoài cửa sổ grace (61 giây) rồi trình lại — phải 401 và
// token kế tiếp của phía thắng cũng chết theo (family bị thu hồi sạch).
const staleRaw0 = await seedUserWithToken("user-refresh-stale");
const staleWin = await postRefresh("/api/v1/user/refresh", { cookie: staleRaw0, origin: GOOD_ORIGIN });
check("sau-grace: lượt đầu 200", staleWin.status, 200);
const staleNext = cookieValueFrom(staleWin.setCookies);
const staleHash = createHash("sha256").update(staleRaw0).digest("hex");
await getCollection("refresh_tokens").updateOne(
  { tokenHash: staleHash },
  { $set: { updatedAt: new Date(Date.now() - 61_000) } }
);
const staleReplay = await postRefresh("/api/v1/user/refresh", { cookie: staleRaw0, origin: GOOD_ORIGIN });
check("sau-grace: trình lại token cũ → 401", staleReplay.status, 401);
const staleNextTry = await postRefresh("/api/v1/user/refresh", { cookie: staleNext, origin: GOOD_ORIGIN });
check("sau-grace: token kế tiếp cũng 401 (family đã thu hồi)", staleNextTry.status, 401);
const staleFamRows = await getCollection("refresh_tokens").find({ userId: "user-refresh-stale" }).toArray();
check("sau-grace: family bị xoá sạch khỏi DB", staleFamRows.length, 0);

server.close();
if (mongod) await mongod.stop();
console.log(failed === 0 ? "\nALL PASS" : `\n${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
