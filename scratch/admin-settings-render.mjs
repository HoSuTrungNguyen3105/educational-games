// scratch/admin-settings-render.mjs
//
// Render thử trang Cài đặt bằng react-dom/server (không cần trình duyệt) để bắt
// lỗi crash ở lần render đầu: thiếu import, truy cập object lúc chưa load, sai
// signature component… useEffect KHÔNG chạy trong SSR nên không gọi API thật.
//
// chạy (cwd = gốc repo, sau khi build SSR):
//   npx vite build --ssr scratch/ssr-entry.jsx --outDir scratch/ssr-out --emptyOutDir
//   node scratch/admin-settings-render.mjs

// --- stub môi trường trình duyệt tối thiểu cho các module tham chiếu window ---
const store = new Map();
const localStorageStub = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
  key: (i) => [...store.keys()][i] ?? null,
  get length() { return store.size },
};
globalThis.localStorage = localStorageStub;
globalThis.window = {
  localStorage: localStorageStub,
  location: { href: "http://localhost/", origin: "http://localhost", protocol: "http:", host: "localhost" },
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
  navigator: { onLine: true, userAgent: "node" },
  setTimeout, clearTimeout, fetch: globalThis.fetch,
};
globalThis.document = globalThis.document || {
  title: "Lớp Học Vui",
  getElementById: () => null,
  querySelector: () => null,
  createElement: () => ({ setAttribute() {}, style: {} }),
  head: { appendChild() {} },
  documentElement: { style: { setProperty() {} }, classList: { add() {}, remove() {} } },
  addEventListener() {}, removeEventListener() {},
};

const { render } = await import("../scratch/ssr-out/ssr-entry.js");

const PERMISSIONS = ["settings.view", "settings.edit", "settings.delete", "templates.view"];
let pass = 0, fail = 0;
const check = (name, cond, extra = "") => {
  if (cond) { pass++; console.log(`  PASS ${name}${extra ? ` | ${extra}` : ""}`); }
  else { fail++; console.log(`  FAIL ${name}${extra ? ` | ${extra}` : ""}`); }
};

/** Render và trả về HTML; ném lỗi kèm stack nếu trang crash. */
function draw(user, label) {
  try {
    const html = render({ user, showToast: () => {} });
    console.log(`\n── ${label}: render OK, ${html.length} ký tự`);
    return html;
  } catch (e) {
    console.log(`\n── ${label}: CRASH → ${e.message}\n${e.stack?.split("\n").slice(1, 5).join("\n")}`);
    fail++;
    return "";
  }
}

const admin = { id: "ad-1", username: "admin1", name: "Admin 1", role: "admin", email: "a@b.c", permissions: PERMISSIONS };
const student = { id: "st-1", username: "st1", name: "Học sinh", role: "student", permissions: [] };

const html = draw(admin, "admin có settings.view/edit");
check("admin render không crash", html.length > 2000, `${html.length} ký tự`);
check("có khu Tình trạng hệ thống", html.includes("Tình trạng hệ thống"));
check("có khu Lưu trữ game", html.includes("Lưu trữ game") || html.includes("Thống kê lưu trữ"));
check("có khu Kiểm tra game", html.includes("Kiểm tra"));
check("có khu Nhật ký hoạt động", html.includes("Nhật ký hoạt động"));
check("có khu Cấu hình chung", html.includes("Cấu hình chung"));
check("có nút Kiểm tra ngay", html.includes("Kiểm tra ngay"));
check("có form đổi mật khẩu", html.includes("Mật khẩu hiện tại") && html.includes("Đổi mật khẩu"));
check("cảnh báo đổi mật khẩu", html.includes("đăng xuất mọi thiết bị khác"));
check("không có giá trị undefined/NaN lộ ra UI", !/>undefined</.test(html) && !html.includes("NaN"),
  html.match(/>\s*(undefined|NaN)\s*</g)?.slice(0, 3)?.join(" ") || "");
check("không có chuỗi placeholder/mẫu", !/TODO|lorem|mock|sample/i.test(html));

const htmlStudent = draw(student, "student không có settings.view");
check("student vẫn thấy tài khoản + đổi mật khẩu", htmlStudent.includes("Đổi mật khẩu"));
check("student KHÔNG thấy khu hệ thống", !htmlStudent.includes("Tình trạng hệ thống"));

const htmlNoUser = draw(null, "user = null");
check("user null không crash", htmlNoUser.length > 0, `${htmlNoUser.length} ký tự`);

console.log(`\nKẾT QUẢ: ${pass} PASS / ${fail} FAIL`);
process.exit(fail ? 1 : 0);
