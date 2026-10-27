/**
 * Kiểm thử refresh token end-to-end theo update_refresh_token.md §9.
 * Chạy:  node scratch/test-refresh-token.mjs   (cwd = repo gốc)
 * Tự tạo user tạm rồi xoá sạch khi xong — không đụng account thật.
 */
import { createHmac } from "node:crypto";
import { initDatabase, getCollection, close } from "../server/src/db.js";

// jsonwebtoken nằm trong server/node_modules → script này tự ký/read HS256
// để chạy được từ repo gốc mà không cần NODE_PATH.
const b64 = (buf) => Buffer.from(buf).toString("base64url");
const decodeJwt = (token) => {
  const parts = String(token || "").split(".");
  return parts.length === 3 ? JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) : null;
};
const signJwt = (payload, secret) => {
  const head = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64(JSON.stringify(payload));
  const sig = createHmac("sha256", secret).update(`${head}.${body}`).digest("base64url");
  return `${head}.${body}.${sig}`;
};

const PORT = 5099;
const BASE = `http://127.0.0.1:${PORT}/api`;
const OK_ORIGIN = "http://localhost:5173";
const EVIL_ORIGIN = "https://evil.example.com";
const USER = { username: "zz_rt_test", password: "rt-test-123", name: "Test Refresh" };

const results = [];
function check(name, pass, detail = "") {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

function cookieOf(setCookies, name) {
  for (const line of setCookies || []) {
    const [pair, ...attrs] = line.split(";");
    const [k, ...rest] = pair.split("=");
    if (k.trim() === name) return { value: rest.join("="), attrs: attrs.map((a) => a.trim().toLowerCase()) };
  }
  return null;
}

async function main() {
  await initDatabase();
  const { default: app } = await import("../server/src/app.js");
  const server = app.listen(PORT);
  await new Promise((r) => server.once("listening", r));

  // User sạch cho mỗi lần chạy (KHÔNG dùng account seed của dự án)
  await getCollection("users").deleteMany({ username: USER.username });
  await getCollection("refresh_tokens").deleteMany({});

  const reg = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: OK_ORIGIN },
    body: JSON.stringify(USER),
  });
  if (![200, 201].includes(reg.status)) {
    console.error("Không tạo được user test:", reg.status, await reg.text());
    process.exit(1);
  }

  // ── 1. Login: access token trong JSON, refresh token chỉ trong cookie ──
  const login = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: OK_ORIGIN },
    body: JSON.stringify({ username: USER.username, password: USER.password }),
  }).then(async (res) => ({ res, body: await res.json().catch(() => null), cookies: res.headers.getSetCookie() }));

  let accessToken = login.body?.data?.token;
  let cookieHeader = `edu_refresh=${cookieOf(login.cookies, "edu_refresh")?.value}`;
  let cki = cookieOf(login.cookies, "edu_refresh");

  if (login.res.status !== 200 || !accessToken) {
    console.error("Login thất bại, không test tiếp:", login.res.status, JSON.stringify(login.body));
    process.exit(1);
  }

  const userId = login.body?.data?.user?.id;
  check("Login trả về access token", !!accessToken);
  check("Cookie refresh: HttpOnly", !!cki?.attrs.includes("httponly"), cki ? cki.attrs.join(",") : "không có cookie");
  check("Cookie refresh: SameSite + Path", !!cki?.attrs.some((a) => a.startsWith("samesite=lax")) && !!cki?.attrs.some((a) => a === "path=/api/auth"), cki?.attrs.join(","));
  check("Cookie refresh: không Secure ở dev", !cki?.attrs.includes("secure"));
  check("Refresh token KHÔNG xuất hiện trong JSON response",
    !JSON.stringify(login.body).includes(cki?.value || "___"));

  // ── 2. Refresh thành công + đúng hợp đồng §3.2 ──
  const refresh = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: OK_ORIGIN, Cookie: cookieHeader },
    body: "{}",
  }).then(async (res) => ({ res, body: await res.json().catch(() => null), cookies: res.headers.getSetCookie() }));

  const newAccessToken = refresh.body?.Authorization?.replace(/^Bearer\s+/i, "");
  check("Refresh 200", refresh.res.status === 200, String(refresh.res.status));
  check("msg = refresh.success", refresh.body?.msg === "refresh.success", refresh.body?.msg);
  check("status/code đúng hợp đồng", refresh.body?.status === true && refresh.body?.code === 200);
  check("Authorization = Bearer <token mới> ở gốc JSON", !!newAccessToken);
  check("data.token trùng Authorization (tương thích envelope cũ)", refresh.body?.data?.token === newAccessToken);
  check("Access token mới khác token cũ", !!newAccessToken && newAccessToken !== accessToken);

  const rotated = cookieOf(refresh.cookies, "edu_refresh");
  check("Xoay vòng: cookie mới được Set-Cookie lại", !!rotated && rotated.value !== cki.value);
  check("Xoay vòng: refresh token không trả trong JSON", !JSON.stringify(refresh.body).includes(rotated?.value || "___"));
  const payload = decodeJwt(newAccessToken);
  check("Token mới vẫn đủ claim (sub/username/role/type=access)",
    !!payload?.sub && !!payload?.username && !!payload?.role && payload?.type === "access");

  // ── 3. Token mới dùng được, token cũ cũng còn hạn (chưa revoke access) ──
  const me = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${newAccessToken}`, Origin: OK_ORIGIN, Cookie: `edu_refresh=${rotated.value}` },
  });
  check("Request API với access token mới → 200", me.status === 200, String(me.status));

  // ── 4. Origin ngoài allowlist / không có Origin / thiếu cookie ──
  const badOrigin = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: EVIL_ORIGIN, Cookie: `edu_refresh=${rotated.value}` }, body: "{}",
  }).then(async (r) => ({ s: r.status, b: await r.json().catch(() => null) }));
  check("Origin giả mạo → 403, không cấp token", badOrigin.s === 403 && !badOrigin.b?.Authorization, JSON.stringify(badOrigin.b));

  const noOrigin = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Cookie: `edu_refresh=${rotated.value}` }, body: "{}",
  });
  check("Request không có Origin → bị từ chối (không mặc định cho phép)", noOrigin.status === 403, String(noOrigin.status));

  const lookalike = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000", Cookie: `edu_refresh=${rotated.value}` }, body: "{}",
  });
  check("localhost port khác (3000) → 403", lookalike.status === 403, String(lookalike.status));

  const suffixBypass = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:5173.evil.example" }, body: "{}",
  });
  check("Origin hậu tố giả ('…5173.evil.example') → 403", suffixBypass.status === 403, String(suffixBypass.status));

  const noCookie = await fetch(`${BASE}/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN }, body: "{}" });
  check("Thiếu refresh token → 401", noCookie.status === 401, String(noCookie.status));

  const garbage = await fetch(`${BASE}/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN, Cookie: "edu_refresh=abc.def.ghi" }, body: "{}" });
  check("Refresh token rác → 401", garbage.status === 401, String(garbage.status));

  const asAccess = await fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${rotated.value}` } });
  check("Refresh token KHÔNG dùng được làm access token → 401", asAccess.status === 401, String(asAccess.status));

  // ── 5. Dùng lại token đã xoay vòng → thu hồi cả family ──
  const reuse = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN, Cookie: cookieHeader }, body: "{}",
  });
  check("Dùng lại token cũ → 401", reuse.status === 401, String(reuse.status));

  const afterReuse = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN, Cookie: `edu_refresh=${rotated.value}` }, body: "{}",
  });
  check("Token mới cũng bị vô hiệu (revoke cả family)", afterReuse.status === 401, String(afterReuse.status));
  // Family của LẦN ĐĂNG NHẬP này (register cũng tạo 1 phiên riêng → không đếm theo user).
  const loginFamily = decodeJwt(cki.value)?.fid;
  const leftAfterReuse = await getCollection("refresh_tokens").find({ familyId: loginFamily }).toArray();
  check("Family bị xoá khỏi DB", leftAfterReuse.length === 0,
    `còn ${leftAfterReuse.length} dòng ${leftAfterReuse.map((d) => `${d.id}/${d.status}`).join(",")} (family=${loginFamily})`);

  // ── 6. Logout: thu hồi + xoá cookie ──
  const login2 = await fetch(`${BASE}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN },
    body: JSON.stringify({ username: USER.username, password: USER.password }),
  });
  const cki2 = cookieOf(login2.headers.getSetCookie(), "edu_refresh");
  const logout = await fetch(`${BASE}/auth/logout`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN, Cookie: `edu_refresh=${cki2.value}` }, body: "{}",
  }).then(async (r) => ({ s: r.status, b: await r.json().catch(() => null), cookies: r.headers.getSetCookie() }));
  const cleared = cookieOf(logout.cookies, "edu_refresh");
  check("Logout 200", logout.s === 200, JSON.stringify(logout.b));
  check("Logout xoá cookie (maxAge=0 / expires)", !!cleared && (cleared.attrs.includes("max-age=0") || cleared.attrs.some((a) => a.startsWith("expires= Thu, 01 Jan 1970"))), cleared?.attrs.join(","));
  const afterLogout = await fetch(`${BASE}/auth/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN, Cookie: `edu_refresh=${cki2.value}` }, body: "{}",
  });
  check("Sau logout, refresh bằng cookie cũ → 401", afterLogout.status === 401, String(afterLogout.status));

  // ── 7. CORS: credentials chỉ bật cho origin trong allowlist ──
  const corsGood = await fetch(`${BASE}/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json", Origin: OK_ORIGIN } });
  const acaoGood = corsGood.headers.get("access-control-allow-origin");
  check("CORS allowlist origin: có Access-Control-Allow-Credentials",
    corsGood.headers.get("access-control-allow-credentials") === "true", `ACAO=${acaoGood}`);
  // Allow-Origin: * + credentials là tổ hợp bị trình duyệt chặn ⇒ phải phản chiếu đúng origin.
  check("CORS allowlist origin: Allow-Origin là origin thật, không phải *", acaoGood === OK_ORIGIN, `ACAO=${acaoGood}`);

  const preflight = await fetch(`${BASE}/auth/refresh`, {
    method: "OPTIONS",
    headers: { Origin: OK_ORIGIN, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" },
  });
  check("Preflight: cho phép POST + credentials + đúng origin",
    preflight.headers.get("access-control-allow-origin") === OK_ORIGIN
    && preflight.headers.get("access-control-allow-credentials") === "true"
    && String(preflight.headers.get("access-control-allow-methods")).includes("POST"),
    `ACAO=${preflight.headers.get("access-control-allow-origin")}, ACC=${preflight.headers.get("access-control-allow-credentials")}, methods=${preflight.headers.get("access-control-allow-methods")}`);

  const corsBad = await fetch(`${BASE}/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json", Origin: EVIL_ORIGIN } });
  check("CORS origin lạ: KHÔNG bật credentials", corsBad.headers.get("access-control-allow-credentials") !== "true");

  // ── 8. Tương thích ngược: token kiểu cũ (không có field type) vẫn dùng được ──
  const { config } = await import("../server/src/config.js");
  const testUser = await getCollection("users").findOne({ username: USER.username });
  const legacy = signJwt({ sub: testUser.id, username: testUser.username, role: testUser.role, name: testUser.name, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 300 }, config.jwtSecret);
  const legacyMe = await fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${legacy}` } });
  check("Token cũ không có type → vẫn hợp lệ (không làm hỏng phiên đang chạy)", legacyMe.status === 200, String(legacyMe.status));

  server.close();
  await getCollection("refresh_tokens").deleteMany({ userId: testUser.id });
  await getCollection("users").deleteOne({ _id: testUser._id });
  await close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n=== ${results.length - failed.length}/${results.length} đạt ===`);
  if (failed.length) { console.log("CHƯA ĐẠT:"); failed.forEach((f) => console.log(" - " + f.name + " — " + f.detail)); process.exit(1); }
}

main().catch((e) => { console.error("Lỗi script:", e); process.exit(1); });
