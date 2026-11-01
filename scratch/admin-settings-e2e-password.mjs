// scratch/admin-settings-e2e-password.mjs
//
// §7: "Đổi mật khẩu vẫn hoạt động" + "Nhật ký ghi nhận thao tác thật".
// Tạo 1 tài khoản tạm (zz_pwtest), đăng nhập bằng /auth/login (THẬT — có cookie
// refresh nên luồng phiên hoạt động như người dùng), đổi mật khẩu qua endpoint
// mà trang Cài đặt gọi, đăng nhập lại bằng mật khẩu mới, kiểm tra danh sách phiên
// và nhật ký, rồi xoá tài khoản + phiên.
//
// chạy:  node scratch/admin-settings-e2e-password.mjs   (cwd = server/)

import { MongoClient } from "../server/node_modules/mongodb/lib/mongo_client.js";
import { config } from "../server/src/config.js";
import { hashPassword, verifyPassword } from "../server/src/services/authService.js";

const BASE = "http://localhost:5000/api";
const ID = "zz_pwtest";
const PW1 = "MatKhauCu@123";
const PW2 = "MatKhauMoi@456";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  PASS ${name}${extra ? ` | ${extra}` : ""}`); }
  else { fail++; console.log(`  FAIL ${name}${extra ? ` | ${extra}` : ""}`); }
};

async function call(path, { method = "GET", body, cookie = "" } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  const setCookie = res.headers.getSetCookie?.() || [];
  return { status: res.status, json, text, setCookie };
}

// --- 0. dọn dẹp lần chạy trước ----------------------------------------------
const mongo = new MongoClient(config.mongoUri);
await mongo.connect();
const db = mongo.db(config.dbName);
await db.collection("users").deleteMany({ id: ID });
await db.collection("refresh_tokens").deleteMany({ userId: ID });
await db.collection("admin_logs").deleteMany({ actorId: ID });

try {
  // --- 1. đăng ký qua API (luồng thật) ---------------------------------------
  const reg = await call("/auth/register", {
    method: "POST",
    body: { username: ID, password: PW1, name: "Pw Test", role: "student", ageCode: "kid" },
  });
  ok("đăng ký tài khoản tạm 201/200", reg.status === 200 || reg.status === 201, `status=${reg.status} msg=${reg.json?.msg}`);
  const token = reg.json?.data?.accessToken || reg.json?.data?.token;
  const cookie = (reg.setCookie.find((c) => c.startsWith("edu_refresh=")) || "").split(";")[0];
  ok("có access token", !!token);
  ok("có cookie edu_refresh (phiên thật)", !!cookie, cookie ? cookie.slice(0, 24) + "…" : "");
  if (!token || !cookie) throw new Error("không tạo được phiên, dừng test");

  const H = { authorization: `Bearer ${token}` };
  const authCall = (path, opts = {}) => call(path, { ...opts, cookie });

  // --- 2. đăng nhập lại (để có thêm 1 phiên) ---------------------------------
  const login = await call("/auth/login", { method: "POST", body: { identifier: ID, password: PW1 } });
  ok("đăng nhập bằng mật khẩu cũ ok", login.status === 200 && login.json?.data?.accessToken, `status=${login.status}`);

  // --- 3. danh sách phiên trước khi đổi mật khẩu ------------------------------
  const s0 = await authCall("/auth/sessions", { headers: H });
  ok("GET /auth/sessions 200", s0.status === 200, `total=${s0.json?.data?.total}`);
  ok("có >= 2 phiên (register + login)", (s0.json?.data?.total || 0) >= 2, `total=${s0.json?.data?.total}`);
  ok("phiên hiện tại được đánh dấu", (s0.json?.data?.items || []).some((x) => x.current === true),
    (s0.json?.data?.items || []).map((x) => `${x.current ? "*" : "-"}${x.status}`).join(","));
  ok("payload không chứa tokenHash", !JSON.stringify(s0.json).includes("tokenHash"));

  // --- 4. ĐỔI MẬT KHẨU (tính năng cũ phải còn chạy) --------------------------
  const wrong = await authCall("/auth/change-password", {
    method: "POST",
    headers: H,
    body: { currentPassword: "Sai@12345", newPassword: "Khac@123456" },
  });
  ok("mật khẩu_current_sai bị từ chối", wrong.status >= 400 && wrong.status !== 401, `status=${wrong.status} msg=${wrong.json?.msg}`);

  const change = await authCall("/auth/change-password", {
    method: "POST",
    headers: H,
    body: { currentPassword: PW1, newPassword: PW2 },
  });
  ok("đổi mật khẩu 200", change.status === 200, `status=${change.status} msg=${change.json?.msg}`);

  const oldLogin = await call("/auth/login", { method: "POST", body: { identifier: ID, password: PW1 } });
  ok("mật khẩu cũ KHÔNG còn dùng được", oldLogin.status >= 400, `status=${oldLogin.status}`);
  const newLogin = await call("/auth/login", { method: "POST", body: { identifier: ID, password: PW2 } });
  ok("đăng nhập được bằng mật khẩu mới", newLogin.status === 200 && !!newLogin.json?.data?.accessToken, `status=${newLogin.status}`);

  const doc = await db.collection("users").findOne({ id: ID });
  ok("hash trong DB đã đổi + không lưu mật khẩu thô",
    (await verifyPassword(PW2, doc.password)) && !JSON.stringify(doc).includes(PW2));

  // --- 5. thu hồi phiên các máy khác ------------------------------------------
  const s1 = await authCall("/auth/sessions", { headers: H });
  const before = s1.json?.data?.total || 0;
  ok("đọc lại phiên sau khi đổi mật khẩu", before >= 3, `total=${before}`);
  const rev = await authCall("/auth/sessions?others=true", { method: "DELETE", headers: H });
  ok("DELETE /auth/sessions?others=true 200", rev.status === 200, `revoked=${rev.json?.data?.revoked}`);
  const s2 = await authCall("/auth/sessions", { headers: H });
  ok("chỉ còn đúng 1 phiên (máy hiện tại)", s2.json?.data?.total === 1, `total=${s2.json?.data?.total}`);

  // --- 6. nhật ký ghi nhận thao tác thật --------------------------------------
  const lg = await authCall("/system/logs?actor=Pw%20Test&perPage=30", { headers: H });
  const items = lg.json?.data?.items || [];
  const has = (a) => items.filter((x) => x.action === a);
  ok("log auth.login", has("auth.login").length > 0, `${has("auth.login").length} bản ghi`);
  ok("log auth.register", has("auth.register").length > 0);
  ok("log auth.password_change", has("auth.password_change").length > 0, JSON.stringify(has("auth.password_change")[0]?.message));
  ok("log auth.password_change có cả lần thất bại", has("auth.password_change").some((x) => x.result === "fail"));
  ok("log auth.sessions_revoke", has("auth.sessions_revoke").length > 0);
  ok("log không chứa mật khẩu", !JSON.stringify(items).includes(PW1) && !JSON.stringify(items).includes(PW2));
  ok("log đăng nhập thất bại ghi đúng target",
    items.some((x) => x.action === "auth.login_fail" && x.result === "fail"),
    JSON.stringify(items.find((x) => x.action === "auth.login_fail") || null).slice(0, 120));

  // --- 7. đăng xuất qua API (phiên phải bị thu hồi) ---------------------------
  const out = await authCall("/auth/logout", { method: "POST", headers: H });
  ok("logout 200", out.status === 200, `status=${out.status}`);
  const left = await db.collection("refresh_tokens").countDocuments({ userId: ID });
  ok("refresh token của user đã xoá sạch", left === 0, `còn=${left}`);
} finally {
  await db.collection("users").deleteMany({ id: ID });
  await db.collection("refresh_tokens").deleteMany({ userId: ID });
  await db.collection("admin_logs").deleteMany({ actorId: ID });
  await mongo.close();
  console.log("  (đã dọn tài khoản tạm zz_pwtest + phiên + log của nó)");
}

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
