// scratch/admin-settings-e2e-password.mjs
//
// §7: "Đổi mật khẩu vẫn hoạt động" + "Nhật ký ghi nhận thao tác thật" + phiên.
// Dùng luồng THẬT: đăng ký → đăng nhập → xem danh sách phiên → đổi mật khẩu
// (sai rồi đúng) → đăng nhập lại bằng mật khẩu mới → thu hồi máy khác → đọc nhật
// ký → đăng xuất. Cuối script xoá sạch tài khoản tạm, phiên và log của nó.
//
// chạy:  node scratch/admin-settings-e2e-password.mjs   (cwd = server/)

import { MongoClient } from "../server/node_modules/mongodb/lib/mongo_client.js";
import { config } from "../server/src/config.js";
import bcrypt from "../server/node_modules/bcryptjs/index.js";

const BASE = "http://localhost:5000/api";
const UNAME = "zz_pwtest";
const PW1 = "MatKhauCu@123";
const PW2 = "MatKhauMoi@456";

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  PASS ${name}${extra ? ` | ${extra}` : ""}`); }
  else { fail++; console.log(`  FAIL ${name}${extra ? ` | ${extra}` : ""}`); }
};

async function call(path, { method = "GET", body, cookie = "", headers = {} } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* body không phải JSON */ }
  const setCookie = res.headers.getSetCookie?.() || [];
  // Chỉ lấy mỗi giá trị edu_refresh — đủ để giữ phiên giữa các lần gọi.
  const fresh = setCookie.find((c) => c.startsWith("edu_refresh="));
  return { status: res.status, json, text, cookie: fresh ? fresh.split(";")[0] : "" };
}

const mongo = new MongoClient(config.mongoUri);
await mongo.connect();
const db = mongo.db(config.dbName);

let userId = null;
const cleanup = async () => {
  // Chỉ xoá đúng dữ liệu của tài khoản tạm. KHÔNG dùng {actorId: null} vì sẽ quét
  // cả những bản ghi đăng nhập thất bại của người khác (actorId trống theo thiết kế).
  const logFilter = { $or: [{ actorName: "Pw Test" }, { target: UNAME }] };
  if (userId) {
    logFilter.$or.push({ actorId: userId });
    await db.collection("refresh_tokens").deleteMany({ userId });
  }
  await db.collection("users").deleteMany({ username: UNAME });
  await db.collection("admin_logs").deleteMany(logFilter);
};
await cleanup(); // dọn lần chạy trước

try {
  // --- 1. đăng ký + phiên thật ------------------------------------------------
  const reg = await call("/auth/register", {
    method: "POST",
    body: { username: UNAME, password: PW1, name: "Pw Test", ageCode: "8-10" },
  });
  ok("đăng ký tài khoản tạm", reg.status === 201, `status=${reg.status} msg=${reg.json?.msg}`);
  let token = reg.json?.data?.token;
  userId = reg.json?.data?.user?.id || null;
  let cookie = reg.cookie;
  ok("có access token + userId", !!token && !!userId, `userId=${userId}`);
  ok("có cookie edu_refresh", !!cookie, cookie ? cookie.slice(0, 20) + "…" : "(không có)");
  if (!token || !cookie) throw new Error("không tạo được phiên — dừng test");

  const authCall = (path, opts = {}) => call(path, { ...opts, cookie });

  // --- 2. thêm một phiên thứ hai (đăng nhập trên "máy khác") ------------------
  const login = await call("/auth/login", { method: "POST", body: { identifier: UNAME, password: PW1 } });
  ok("đăng nhập bằng mật khẩu cũ", login.status === 200 && !!login.json?.data?.token, `status=${login.status}`);

  // --- 3. danh sách phiên ------------------------------------------------------
  const s0 = await authCall("/auth/sessions", { headers: { authorization: `Bearer ${token}` } });
  ok("GET /auth/sessions 200", s0.status === 200, `total=${s0.json?.data?.total}`);
  ok("có >= 2 phiên", (s0.json?.data?.total || 0) >= 2, `total=${s0.json?.data?.total}`);
  ok("phiên hiện tại được đánh dấu current", (s0.json?.data?.items || []).some((x) => x.current === true));
  ok("payload không lộ token/hash", !/tokenHash|eyJ/.test(JSON.stringify(s0.json)));

  // --- 4. ĐỔI MẬT KHẨU (tính năng cũ phải còn chạy) ---------------------------
  const bad = await authCall("/auth/change-password", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: { currentPassword: "Sai@12345", newPassword: "Khac@123456" },
  });
  ok("mật khẩu_current_sai bị từ chối", bad.status === 400, `status=${bad.status} msg=${bad.json?.msg}`);

  const change = await authCall("/auth/change-password", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: { currentPassword: PW1, newPassword: PW2 },
  });
  ok("đổi mật khẩu 200", change.status === 200, `status=${change.status} msg=${change.json?.msg}`);
  if (change.cookie) cookie = change.cookie; // server cấp lại cookie cho phiên đang dùng

  const oldLogin = await call("/auth/login", { method: "POST", body: { identifier: UNAME, password: PW1 } });
  ok("mật khẩu cũ không còn dùng được", oldLogin.status === 401, `status=${oldLogin.status}`);
  const newLogin = await call("/auth/login", { method: "POST", body: { identifier: UNAME, password: PW2 } });
  ok("đăng nhập được bằng mật khẩu mới", newLogin.status === 200 && !!newLogin.json?.data?.token, `status=${newLogin.status}`);

  const doc = await db.collection("users").findOne({ username: UNAME });
  ok("DB lưu bcrypt hash, không lưu mật khẩu thô",
    bcrypt.compareSync(PW2, doc.passwordHash) && !JSON.stringify(doc).includes(PW2),
    doc.passwordHash.slice(0, 7) + "…");

  // --- 5. thu hồi máy khác -----------------------------------------------------
  const s1 = await authCall("/auth/sessions", { headers: { authorization: `Bearer ${token}` } });
  ok("đọc phiên sau đổi mật khẩu", (s1.json?.data?.total || 0) >= 1, `total=${s1.json?.data?.total}`);
  const rev = await authCall("/auth/sessions?others=true", {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  });
  ok("DELETE /auth/sessions?others=true", rev.status === 200, `revoked=${rev.json?.data?.revoked}`);
  const s2 = await authCall("/auth/sessions", { headers: { authorization: `Bearer ${token}` } });
  ok("chỉ còn 1 phiên hiện tại", s2.json?.data?.total === 1, `total=${s2.json?.data?.total}`);

  // --- 6. nhật ký thao tác thật ------------------------------------------------
  // Tài khoản tạm là student nên API nhật ký phải TỪ CHỐI (đúng quyền) — vì vậy
  // kiểm tra nội dung log bằng cách đọc thẳng collection, không qua HTTP.
  const denied = await authCall("/system/logs?perPage=5", {
    headers: { authorization: `Bearer ${token}` },
  });
  ok("student bị chặn GET /system/logs (403)", denied.status === 403, `status=${denied.status}`);

  const items = await db.collection("admin_logs")
    .find({ actorId: userId })
    .sort({ at: -1 })
    .limit(60)
    .toArray();
  const has = (a) => items.filter((x) => x.action === a);
  ok("có bản ghi nhật ký cho các thao tác trên", items.length >= 6, `${items.length} bản ghi`);
  ok("log auth.login", has("auth.login").length > 0, `${has("auth.login").length} bản ghi`);
  ok("log auth.register", has("auth.register").length > 0);
  ok("log auth.password_change thành công", has("auth.password_change").some((x) => x.result === "success"));
  ok("log auth.password_change thất bại (mật khẩu sai)", has("auth.password_change").some((x) => x.result === "fail"));
  ok("log auth.sessions_revoke", has("auth.sessions_revoke").length > 0);
  // Đăng nhập THẤT BẠI thì chưa có req.user → bản ghi chỉ có `target` (tên đăng
  // nhập thử), actorId trống. Tìm riêng theo target.
  const fails = await db.collection("admin_logs")
    .find({ action: "auth.login_fail", target: UNAME })
    .sort({ at: -1 })
    .limit(5)
    .toArray();
  ok("log auth.login_fail (mật khẩu cũ sau khi đổi)", fails.length > 0,
    `${fails.length} bản ghi, result=${fails[0]?.result}, msg=${fails[0]?.message}`);
  ok("mỗi bản ghi có actor + target + result + thời gian",
    items.every((x) => x.at && x.action && x.actorId && "result" in x));
  ok("log không chứa mật khẩu", !JSON.stringify(items).includes(PW1) && !JSON.stringify(items).includes(PW2));

  // --- 7. đăng xuất ------------------------------------------------------------
  const out = await authCall("/auth/logout", { method: "POST", headers: { authorization: `Bearer ${token}` } });
  ok("logout 200", out.status === 200, `status=${out.status}`);
  const left = await db.collection("refresh_tokens").countDocuments({ userId });
  ok("refresh token bị xoá hết sau đăng xuất", left === 0, `còn=${left}`);
} finally {
  await cleanup();
  await mongo.close();
  console.log("  (đã xoá tài khoản tạm zz_pwtest + phiên + nhật ký của nó)");
}

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
