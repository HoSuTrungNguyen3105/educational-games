// scratch/html-file-api-test.mjs — chạy với cwd = server/
// Kiểm thử CRUD templates: HTML → file, Mongo chỉ lưu link.
import { signToken } from "../server/src/services/authService.js";
import * as disk from "../server/src/services/htmlFileStorageService.js";

const BASE = "http://localhost:5000";
const API = `${BASE}/api`;
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  PASS ${name}${extra ? " | " + extra : ""}`); }
  else { fail++; console.log(`  FAIL ${name}${extra ? " | " + extra : ""}`); }
};

const token = signToken({ sub: "zz_htmltest_admin", username: "zz_htmltest", role: "admin", name: "HTML Test" });
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const HTML_A = `<!DOCTYPE html><html><body><h1>GAME A ${Date.now()}</h1></body></html>`;
const HTML_B = `<!DOCTYPE html><html><body><h1>GAME B ${Date.now()}</h1></body></html>`;

const absUrl = (u) => (/^https?:\/\//i.test(u) ? u : `${BASE}${u}`);

async function j(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method, headers: H,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

console.log("== 1. POST /templates — HTML phải thành file, Mongo chỉ nhận link ==");
const created = await j("POST", "/templates", { name: "ZZ HTML Test", description: "test", htmlTemplate: HTML_A, status: "draft" });
ok("POST trả 200/201", created.status === 201 || created.status === 200, `status=${created.status}`);
const tpl = created.json?.data || {};
const id = tpl._id;
ok("có _id", Boolean(id));
ok("htmlTemplate là link, KHÔNG phải HTML thô", Boolean(tpl.htmlTemplate) && tpl.htmlTemplate !== HTML_A && !tpl.htmlTemplate.includes("<h1>"), tpl.htmlTemplate);
ok("có fileName", Boolean(tpl.fileName), tpl.fileName);

console.log("== 2. GET link trực tiếp (mô phỏng trình duyệt) ==");
const fetchA = await fetch(absUrl(tpl.htmlTemplate));
const textA = await fetchA.text();
ok("URL mở trực tiếp trả 200", fetchA.status === 200, `status=${fetchA.status}`);
ok("Nội dung đúng = HTML_A", textA.includes("GAME A"));

console.log("== 3. GET /templates/:id ==");
const got = await j("GET", `/templates/${id}`);
ok("GET trả link", got.json?.data?.htmlTemplate === tpl.htmlTemplate);
ok("GET không trả HTML thô", !String(got.json?.data?.htmlTemplate || "").includes("<h1>"));

console.log("== 4. PUT không đụng htmlTemplate — giữ nguyên file ==");
const put1 = await j("PUT", `/templates/${id}`, { name: "ZZ HTML Test 2" });
ok("đổi tên OK", put1.json?.data?.name === "ZZ HTML Test 2");
ok("htmlTemplate giữ nguyên", put1.json?.data?.htmlTemplate === tpl.htmlTemplate);
ok("fileName giữ nguyên", put1.json?.data?.fileName === tpl.fileName);

console.log("== 5. PUT gửi lại đúng link (không sửa HTML) — không tạo file mới ==");
const put2 = await j("PUT", `/templates/${id}`, { htmlTemplate: tpl.htmlTemplate });
ok("link không đổi", put2.json?.data?.htmlTemplate === tpl.htmlTemplate);
ok("fileName không đổi", put2.json?.data?.fileName === tpl.fileName);

console.log("== 6. PUT HTML mới ==");
const put3 = await j("PUT", `/templates/${id}`, { htmlTemplate: HTML_B });
const newRef = put3.json?.data?.htmlTemplate;
ok("PUT HTML mới OK", Boolean(newRef) && !newRef.includes("<h1>"), newRef);
const fetchB = await fetch(absUrl(newRef));
const textB = await fetchB.text();
ok("URL mới chứa HTML_B", (await fetchB).ok && textB.includes("GAME B"));
if (disk.isDiskHtmlRef(tpl.htmlTemplate) && disk.isDiskHtmlRef(newRef) && tpl.htmlTemplate !== newRef) {
  const oldGone = await fetch(absUrl(tpl.htmlTemplate));
  ok("file cũ đã xóa (disk)", oldGone.status === 404, `status=${oldGone.status}`);
} else {
  console.log(`  (bỏ qua kiểm tra xóa file cũ — provider=${newRef.startsWith("/") ? "disk" : "cloud"}, ref giống/không phải đĩa)`);
}

console.log("== 7. Validation ==");
const bad = await j("PUT", `/templates/${id}`, { htmlTemplate: "hello world khong phai html" });
ok("từ chối nội dung không phải HTML", bad.status >= 400, `msg=${bad.json?.msg}`);
const keep = await j("GET", `/templates/${id}`);
ok("nội dung cũ không bị mất sau lỗi", keep.json?.data?.htmlTemplate === newRef);
const big = await j("PUT", `/templates/${id}`, { htmlTemplate: "<html>" + "x".repeat(5 * 1024 * 1024) + "</html>" });
ok("từ chối HTML vượt giới hạn dung lượng", big.status >= 400 || big.status === 413, `status=${big.status} msg=${big.json?.msg}`);

console.log("== 8. DELETE ==");
const del = await j("DELETE", `/templates/${id}`);
ok("DELETE 204", del.status === 204, `status=${del.status}`);
const after = await j("GET", `/templates/${id}`);
ok("GET sau xóa → 404", after.status === 404);

console.log("== 9. Danh sách /templates: không còn HTML thô (migration startup) ==");
const list = await j("GET", "/templates");
const items = list.json?.data || [];
const rawCount = items.filter((t) => t.htmlTemplate && !/^https?:\/\//i.test(t.htmlTemplate) && !/^\/[\w\-./%]*\.html?$/i.test(t.htmlTemplate) );
ok("0 bản ghi còn HTML thô", rawCount.length === 0, `total=${items.length}, thô=${rawCount.length}`);

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
