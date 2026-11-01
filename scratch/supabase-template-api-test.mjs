// scratch/supabase-template-api-test.mjs — chạy với cwd = server/
//   node ../scratch/supabase-template-api-test.mjs
// Kiểm thử 12 mục theo server/update_html_saveurl.md:
// Supabase Storage cho HTML + thumbnail, Mongo chỉ lưu URL, bỏ icon hoàn toàn.
import { signToken } from "../server/src/services/authService.js";
import { connect, getCollection, close } from "../server/src/db.js";
import { config } from "../server/src/config.js";
import { ObjectId } from "../server/node_modules/mongodb/lib/index.js";

const BASE = "http://localhost:5000";
const API = `${BASE}/api`;
const SB = config.supabase.url;
const BUCKET = config.supabase.bucket;
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  PASS ${name}${extra ? " | " + extra : ""}`); }
  else { fail++; console.log(`  FAIL ${name}${extra ? " | " + extra : ""}`); }
};

const token = signToken({ sub: "zz_sbtest_admin", username: "zz_sbtest", role: "admin", name: "SB Test" });
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

async function j(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method, headers: H,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

const htmlDoc = (tag) => `<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title></head><body><h1>${tag} ${Date.now()}</h1></body></html>`;
// PNG 2x2 đỏ (hợp lệ, ~60 bytes)
const THUMB_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR42mP8z8DwnwGBMRAmDgDw9w/qQQwSAAAAAABJRU5ErkJggg==";
// JPEG 1x1 (hợp lệ)
const THUMB_2 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==";

const isSbHtml = (u) => typeof u === "string" && u.startsWith(`${SB}/storage/v1/object/public/${BUCKET}/templates/`) && /\.html$/i.test(u);
const isSbThumb = (u) => typeof u === "string" && u.startsWith(`${SB}/storage/v1/object/public/${BUCKET}/thumbnails/`);
const head = async (u) => { try { const r = await fetch(u, { method: "GET" }); const t = await r.text(); return { status: r.status, len: t.length, text: t }; } catch { return { status: 0, len: 0, text: "" }; } };
const fileNameOf = (u) => String(u || "").split("/").pop();

// Supabase CDN có thể trả 200 vài phút sau khi object đã xóa → kiểm tra BẰNG
// danh sách object thật trong bucket (nguồn sự thật), không dựa vào GET.
const { createClient } = await import("../server/node_modules/@supabase/supabase-js/dist/index.mjs");
const sbClient = createClient(SB, config.supabase.key, { auth: { persistSession: false } });
const objectExists = async (url) => {
  const folder = url.includes("/thumbnails/") ? "thumbnails" : "templates";
  const name = fileNameOf(url);
  const { data, error } = await sbClient.storage.from(BUCKET).list(folder, { limit: 1000 });
  if (error) throw new Error(`list ${folder}: ${error.message}`);
  return (data || []).some((d) => d.name === name);
};

console.log("== 1–5. Tạo template có HTML + thumbnail ==");
const html1 = htmlDoc("ZZ-SB-A");
const c = await j("POST", "/templates", { name: "ZZ Supabase Test A", description: "t", type: "play-to-learn", category: "quiz", htmlUrl: html1, thumbnail: THUMB_1, status: "draft", playMode: "solo" });
ok("1. POST /templates trả về template", c.status === 201 || c.status === 200, `status=${c.status}`);
const tpl = c.json?.data || {};
const id = tpl._id;
ok("   response có htmlUrl + thumbnail", isSbHtml(tpl.htmlUrl) && isSbThumb(tpl.thumbnail), `${tpl.htmlUrl} · ${tpl.thumbnail}`);
ok("   envelope {status,code,msg,data}", c.json?.status === true && c.json?.code === 201 && c.json?.msg === "created" && c.json?.data?._id === id, `code=${c.json?.code} msg=${c.json?.msg}`);
const htmlObj = isSbHtml(tpl.htmlUrl) ? fileNameOf(tpl.htmlUrl) : null;
const thumbObj = isSbThumb(tpl.thumbnail) ? fileNameOf(tpl.thumbnail) : null;
ok("2. HTML nằm trong thư mục templates/ trên Supabase", Boolean(htmlObj) && htmlObj.endsWith(".html"), htmlObj);
ok("3. thumbnail nằm trong thư mục thumbnails/ trên Supabase", Boolean(thumbObj) && /\.(png|jpe?g|webp|gif)$/i.test(thumbObj), thumbObj);
const g1 = await head(tpl.htmlUrl);
const g2 = await head(tpl.thumbnail);
ok("   file HTML đọc công khai được", g1.status === 200 && g1.text.includes("ZZ-SB-A"), `GET ${g1.status}`);
ok("   file ảnh đọc công khai được", g2.status === 200 && g2.len > 0, `GET ${g2.status}, ${g2.len}B`);

await connect();
const coll = getCollection("templates");
const doc = await coll.findOne({ _id: new ObjectId(id) });
ok("4. MongoDB lưu URL, không chứa HTML thô/ảnh base64",
  doc?.htmlUrl === tpl.htmlUrl && doc?.thumbnail === tpl.thumbnail &&
  !String(doc?.htmlUrl || "").includes("<") && !String(doc?.thumbnail || "").startsWith("data:"),
  `htmlUrl=${String(doc?.htmlUrl).slice(0, 20)}…`);
ok("   Mongo không còn field icon/htmlTemplate", !("icon" in doc) && !("htmlTemplate" in doc), Object.keys(doc).join(","));

const listAll = await j("GET", "/templates");
const row = (listAll.json?.data || []).find(x => x._id === id);
ok("5. API danh sách trả htmlUrl + thumbnail", isSbHtml(row?.htmlUrl) && isSbThumb(row?.thumbnail));
const detail = await j("GET", `/templates/${id}`);
const dd = detail.json?.data || {};
ok("   API chi tiết trả htmlUrl + thumbnail", isSbHtml(dd.htmlUrl) && isSbThumb(dd.thumbnail));
ok("   response KHÔNG còn trường icon",
  !("icon" in dd) && !(listAll.json?.data || []).some(x => "icon" in x) &&
  !JSON.stringify(listAll.json?.data || []).includes('"icon"'));
ok("   response không lộ secret key", !JSON.stringify(listAll.json).includes("sb_secret") && !JSON.stringify(dd).includes("sb_secret"));

console.log("== 6–7. Sửa HTML riêng / sửa ảnh riêng (không làm mất field còn lại) ==");
const html2 = htmlDoc("ZZ-SB-B");
const u1 = await j("PUT", `/templates/${id}`, { htmlUrl: html2 });
const d1 = u1.json?.data || {};
ok("6. Đổi HTML → htmlUrl mới, thumbnail giữ nguyên", isSbHtml(d1.htmlUrl) && d1.htmlUrl !== tpl.htmlUrl && d1.thumbnail === tpl.thumbnail, `thumb=${d1.thumbnail ? "giữ" : "MẤT"}`);
const goneHtml = await objectExists(tpl.htmlUrl);
ok("   file HTML cũ bị xóa sau khi đổi", goneHtml === false, `objectExists=${goneHtml}`);
const u2 = await j("PUT", `/templates/${id}`, { thumbnail: THUMB_2 });
const d2 = u2.json?.data || {};
ok("7. Đổi thumbnail → ảnh mới, htmlUrl giữ nguyên", isSbThumb(d2.thumbnail) && d2.thumbnail !== tpl.thumbnail && d2.htmlUrl === d1.htmlUrl);
const goneThumb = await objectExists(tpl.thumbnail);
ok("   file ảnh cũ bị xóa sau khi đổi", goneThumb === false, `objectExists=${goneThumb}`);

// PUT chỉ đổi tên — không đụng HTML/ảnh
const u3 = await j("PUT", `/templates/${id}`, { name: "ZZ Supabase Test A2" });
ok("   PUT không gửi htmlUrl/thumbnail → giữ nguyên cả 2", u3.json?.data?.htmlUrl === d2.htmlUrl && u3.json?.data?.thumbnail === d2.thumbnail);

console.log("== 8–9. Template không có thumbnail vẫn hoạt động ==");
const html3 = htmlDoc("ZZ-SB-C");
const c2 = await j("POST", "/templates", { name: "ZZ Supabase Test B", htmlUrl: html3, status: "draft" });
const t2 = c2.json?.data || {};
ok("8. Tạo template không thumbnail được", Boolean(t2._id) && isSbHtml(t2.htmlUrl) && (t2.thumbnail === "" || t2.thumbnail === undefined), `thumbnail=${JSON.stringify(t2.thumbnail)}`);
const rowB = (await j("GET", "/templates")).json?.data?.find(x => x._id === t2._id) || {};
ok("9. Danh sách vẫn trả bản ghi không thumbnail (client hiển thị placeholder)", Boolean(rowB._id) && !rowB.thumbnail && !("icon" in rowB));

console.log("== 10–11. Legacy field + SPLIT (icon cũ) ==");
const html4 = htmlDoc("ZZ-SB-D");
const c3 = await j("POST", "/templates", { name: "ZZ Legacy Icon", icon: "🎲", htmlTemplate: html4, status: "draft" });
const t3 = c3.json?.data || {};
ok("10. Request còn mang icon/htmlTemplate (client cũ) → server bỏ icon, lưu htmlUrl",
  isSbHtml(t3.htmlUrl) && !("icon" in t3), `htmlUrl=${String(t3.htmlUrl).slice(0, 30)}…`);
const doc3 = await coll.findOne({ _id: new ObjectId(t3._id) });
ok("    Mongo không nhận field icon", !("icon" in (doc3 || {})));

console.log("== 12. Xóa template → xóa cả file HTML + thumbnail ==");
// tạo bản có đủ 2 file để test DELETE
const html5 = htmlDoc("ZZ-SB-E");
const c4 = await j("POST", "/templates", { name: "ZZ Supabase Test C", htmlUrl: html5, thumbnail: THUMB_1 });
const t4 = c4.json?.data || {};
const del = await j("DELETE", `/templates/${t4._id}`);
ok("    DELETE trả thành công", del.status === 200 || del.status === 204, `status=${del.status}`);
await new Promise(r => setTimeout(r, 500));
const delHtmlGone = await objectExists(t4.htmlUrl);
const delThumbGone = await objectExists(t4.thumbnail);
ok("11. File HTML trên Supabase đã bị xóa", delHtmlGone === false, `objectExists=${delHtmlGone}`);
ok("    File thumbnail trên Supabase đã bị xóa", delThumbGone === false, `objectExists=${delThumbGone}`);

// dọn các bản test còn lại
for (const tid of [id, t2._id, t3._id]) {
  const r = await coll.findOne({ _id: new ObjectId(tid) });
  if (r?.htmlUrl) await fetch(`${API}/templates/${tid}`, { method: "DELETE", headers: H }).catch(() => {});
}
const size = (await j("GET", "/templates")).json?.data;
console.log(`\n== Payload /api/templates: ${JSON.stringify(size || []).length.toLocaleString("vi-VN")} bytes cho ${(size || []).length} template ==`);

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
await close();
process.exit(fail ? 1 : 0);
