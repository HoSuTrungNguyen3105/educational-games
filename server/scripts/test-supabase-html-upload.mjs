// Test hợp đồng upload HTML lên Supabase Storage (mock server bắt request):
//   node server/scripts/test-supabase-html-upload.mjs
// Không cần Mongo/mạng ngoài: dựng một HTTP server giả làm Supabase Storage,
// trỏ SUPABASE_URL vào đó TRƯỚC khi import service, rồi gọi saveHtmlToSupabase
// và kiểm tra request THẬT sự ra khỏi server:
//   • POST đúng đường /storage/v1/object/<bucket>/templates/<uuid>.html
//   • Header Content-Type mang text/html (nếu rơi về mặc định text/plain của
//     storage-js thì file .html sẽ bị phục vụ như văn bản thường)
//   • Body là nguyên văn HTML đã gửi; URL trả về là public URL đúng mẫu.
// Bối cảnh: lỗi "trang sinh nhật hiện mã nguồn" — phía upload phải giữ đúng
// content-type này; phía hiển thị không được phụ thuộc vào nó (xem
// BirthdayPage/loadTemplateHtml và route /api/pages/:slug/raw).
import { createServer } from "node:http";

const captured = [];
const fake = createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    captured.push({ method: req.method, url: req.url, headers: req.headers, body: Buffer.concat(chunks) });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ Id: "fake-id", Key: "edu-game-templates/templates/fake.html" }));
  });
});
await new Promise((resolve) => fake.listen(0, "127.0.0.1", resolve));

process.env.SUPABASE_URL = `http://127.0.0.1:${fake.address().port}`;
process.env.SUPABASE_SECRET_KEY = "test-secret-key";
process.env.SUPABASE_BUCKET = "edu-game-templates";

const svc = await import("../src/services/supabaseStorageService.js");

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

const HTML = "<!DOCTYPE html><html><head><title>BD</title></head><body>CHUC MUNG SINH NHAT</body></html>";
const out = await svc.saveHtmlToSupabase(HTML);

check("số request upload", captured.length, 1);
const req = captured[0] || {};
check("method", req.method, "POST");
checkTrue("đường object templates/<uuid>.html",
  /^\/storage\/v1\/object\/edu-game-templates\/templates\/[\w-]+\.html$/.test(req.url || ""), req.url);
checkTrue("Content-Type của request là text/html",
  String(req.headers?.["content-type"] || "").startsWith("text/html"),
  String(req.headers?.["content-type"]));
check("body là nguyên văn HTML", req.body?.toString("utf-8"), HTML);
checkTrue("URL trả về là public URL của đúng object đó",
  typeof out.url === "string" && out.url.endsWith(req.url.replace("/storage/v1/object/", "/storage/v1/object/public/")),
  out.url);
checkTrue("fileName là <uuid>.html", /^[\w-]+\.html$/.test(out.fileName || ""), out.fileName);

await new Promise((resolve) => fake.close(resolve));
console.log(failed === 0 ? "\nTẤT CẢ PASS" : `\n${failed} ca FAIL`);
process.exit(failed === 0 ? 0 : 1);
