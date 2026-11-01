// scratch/admin-settings-api-test.mjs — chạy với cwd = server/
// Kiểm thử các API mới của trang Cài đặt: status / storage / scan / config / logs / sessions.
import { signToken } from "../server/src/services/authService.js";

const BASE = "http://localhost:5000";
const API = `${BASE}/api`;
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  PASS ${name}${extra ? " | " + extra : ""}`); }
  else { fail++; console.log(`  FAIL ${name}${extra ? " | " + extra : ""}`); }
};

// signToken lấy `id` của user làm JWT `sub` — truyền đúng như authService thật.
const admin = signToken({ id: "zz_cfgtest_admin", username: "zz_cfgtest", role: "admin", name: "Cfg Test" });
const student = signToken({ id: "zz_cfgtest_st", username: "zz_cfgtest_st", role: "student", name: "Cfg Student" });
const HA = { Authorization: `Bearer ${admin}`, "Content-Type": "application/json" };
const HS = { Authorization: `Bearer ${student}`, "Content-Type": "application/json" };

async function j(method, path, { body, headers = HA } = {}) {
  const res = await fetch(`${API}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json, text: JSON.stringify(json || {}) };
}

console.log("== 1. GET /system/status ==");
const st = await j("GET", "/system/status?refresh=1");
ok("200 + envelope", st.status === 200 && st.json?.status === true, `status=${st.status}`);
const svc = st.json?.data?.services || {};
ok("có api/mongo/storage/html", Boolean(svc.api && svc.mongo && svc.storage && svc.html));
ok("mongo đã kết nối", svc.mongo?.state === "ok", `latency=${svc.mongo?.latencyMs}ms, collections=${svc.mongo?.collections}`);
ok("supabase ok", svc.storage?.state === "ok", `provider=${svc.storage?.provider}, objects=${svc.storage?.objects}`);
ok("tải HTML thật ok", svc.html?.state === "ok", `checked=${svc.html?.checked}, ${svc.html?.latencyMs}ms, err=${svc.html?.error}`);
ok("KHÔNG lộ secret key", !/sb_secret|SUPABASE_SECRET|mongodb:\/\//i.test(st.text), st.text.slice(0, 0));
ok("KHÔNG lộ bucket URL có credential", !/@:|password/i.test(st.text));
ok("có checkedAt", Boolean(st.json?.data?.checkedAt), st.json?.data?.checkedAt);

console.log("== 2. GET /system/storage ==");
const sp = await j("GET", "/system/storage");
const sd = sp.json?.data || {};
ok("200", sp.status === 200);
ok("đếm template thật", typeof sd.templates?.total === "number" && sd.templates.total > 0, `total=${sd.templates?.total}, withHtml=${sd.templates?.withHtml}, missingHtml=${sd.templates?.missingHtml}`);
ok("có số game + user", typeof sd.games === "number" && typeof sd.users === "number", `games=${sd.games}, users=${sd.users}`);
ok("dung lượng từ Supabase (số thật)", typeof sd.storage?.size === "number" && sd.storage.size > 0 && sd.storage.source === "supabase", `${sd.storage?.fileCount} file, ${sd.storage?.size} bytes`);
ok("không có key trong payload", !/sb_secret/i.test(sp.text));

console.log("== 3. POST /system/scan ==");
const sc = await j("POST", "/system/scan", { body: { page: 1, perPage: 10 } });
const scd = sc.json?.data || {};
ok("200 + có items", sc.status === 200 && Array.isArray(scd.items) && scd.items.length > 0, `checked=${scd.checked}/${scd.total}`);
const it = scd.items?.[0] || {};
ok("mỗi dòng có name/html/thumb", Boolean(it.name && it.html?.state && it.thumb?.state), `${it.name}: html=${it.html?.state} thumb=${it.thumb?.state}`);
ok("có summary phân loại", typeof scd.summary?.ok === "number", JSON.stringify(scd.summary));
const sc2 = await j("POST", "/system/scan", { body: { page: 1, perPage: 10 } });
ok("lần 2 trả kết quả cache (chống spam)", sc2.json?.data?.cached === true, `cooldown=${sc2.json?.data?.cooldownMs}ms`);

console.log("== 4. Config GET/PUT ==");
const c0 = await j("GET", "/system/config");
ok("GET config 200 + đủ 3 nhóm", c0.status === 200 && c0.json?.data?.site && c0.json?.data?.maintenance && c0.json?.data?.notifications, JSON.stringify(c0.json?.data?.notifications));
ok("mặc định site.name = '' (frontend giữ tên cũ trong mã)", c0.json?.data?.site?.name === "");
const c1 = await j("PUT", "/system/config", { body: { site: { name: "EduPlay Test", supportContact: "hotro@example.com" }, notifications: { assignments: false }, hack: { evil: 1 } } });
ok("PUT 200 + changed list", c1.status === 200 && Array.isArray(c1.json?.data?.changed) && c1.json.data.changed.length >= 3, JSON.stringify(c1.json?.data?.changed));
ok("field ngoài whitelist bị bỏ qua", (c1.json?.data?.ignored || []).includes("hack.evil"), JSON.stringify(c1.json?.data?.ignored));
const c2 = await j("GET", "/system/config");
ok("đọc lại thấy giá trị mới", c2.json?.data?.site?.name === "EduPlay Test" && c2.json?.data?.notifications?.assignments === false);
ok("maintenance không bị xoá mất", typeof c2.json?.data?.maintenance?.enabled === "boolean");
// khôi phục về mặc định (name rỗng = chưa cấu hình)
await j("PUT", "/system/config", { body: { site: { name: "", supportContact: "" }, notifications: { assignments: true } } });
const c3 = await j("GET", "/system/config");
ok("khôi phục cấu hình cũ", c3.json?.data?.site?.name === "" && c3.json?.data?.notifications?.assignments === true);

console.log("== 5. Public config (không cần token) ==");
const pub = await j("GET", "/public-config", { headers: {} });
ok("200 không cần đăng nhập", pub.status === 200, `status=${pub.status}`);
ok("chỉ có site + maintenance, không có notifications", pub.json?.data?.site && pub.json?.data?.maintenance && !pub.json?.data?.notifications, pub.text.slice(0, 160));

console.log("== 6. Nhật ký hoạt động ==");
const lg = await j("GET", "/system/logs?perPage=20");
const lgd = lg.json?.data || {};
ok("200 + items là mảng", lg.status === 200 && Array.isArray(lgd.items), `total=${lgd.total}`);
const find = (a) => (lgd.items || []).filter((x) => x.action === a);
ok("ghi nhận config.update", find("config.update").length > 0, JSON.stringify(find("config.update")[0] || null).slice(0, 160));
ok("ghi nhận system.scan", find("system.scan").length > 0);
ok("mỗi bản ghi có actor + thời gian", (lgd.items || []).every((x) => x.at && "actorName" in x));
// Chỉ soi NỘI DUNG bản ghi — danh sách `actions` có sẵn tên "auth.password_change"
// (tên hành động, không phải mật khẩu) nên không tính vào đây.
ok("không có mật khẩu/token trong bản ghi log", !/sb_secret|Bearer |password["'\s:=]|eyJ[A-Za-z0-9_-]{10,}/i.test(JSON.stringify(lgd.items)));
const lf = await j("GET", "/system/logs?action=config.update&keyword=site.name");
ok("lọc theo action + keyword", (lf.json?.data?.items || []).length > 0
  && (lf.json?.data?.items || []).every((x) => x.action === "config.update"), `khớp=${lf.json?.data?.total}`);
const lp = await j("GET", "/system/logs?page=1&perPage=5");
ok("phân trang perPage=5", (lp.json?.data?.items || []).length <= 5 && lp.json?.pagination?.per_page === 5, `per_page=${lp.json?.pagination?.per_page}, total_pages=${lp.json?.pagination?.total_pages}`);

console.log("== 7. Phân quyền ở backend ==");
const s1 = await j("GET", "/system/status", { headers: HS });
ok("student gọi /system/status → 403", s1.status === 403, `status=${s1.status}, msg=${s1.json?.msg}`);
const s2 = await j("PUT", "/system/config", { headers: HS, body: { site: { name: "hack" } } });
ok("student ghi config → 403", s2.status === 403);
const an = await j("GET", "/system/logs", { headers: {} });
ok("không token → 401", an.status === 401, `status=${an.status}`);

console.log("== 8. Phiên đăng nhập ==");
const se = await j("GET", "/auth/sessions");
ok("GET /auth/sessions 200", se.status === 200, `total=${se.json?.data?.total}`);
ok("có account + items", Boolean(se.json?.data?.account?.id) && Array.isArray(se.json?.data?.items));
ok("không trả tokenHash/token", !/tokenHash|"token"/i.test(se.text), se.text.slice(0, 0));
const del = await j("DELETE", "/auth/sessions?others=true");
ok("DELETE ?others=true 200", del.status === 200 && typeof del.json?.data?.revoked === "number", `revoked=${del.json?.data?.revoked}`);
const lg2 = await j("GET", "/system/logs?action=auth.sessions_revoke");
ok("thu hồi phiên được ghi nhật ký", (lg2.json?.data?.items || []).length > 0, JSON.stringify(lg2.json?.data?.items?.[0]?.message || null));

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
