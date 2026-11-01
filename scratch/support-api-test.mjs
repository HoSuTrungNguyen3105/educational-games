// Throwaway test cho API /api/support — chạy với cwd = server/ (dotenv đọc .env).
// node ../scratch/support-api-test.mjs  (sau khi PORT=5051 node src/server.js)
const BASE = process.env.TEST_API || "http://localhost:5051/api";
const { signToken } = await import("../server/src/services/authService.js");

const adminToken = signToken({ id: "test-admin-1", username: "apitest_admin", role: "admin", name: "API Test Admin" });
const studentToken = signToken({ id: "test-student-1", username: "apitest_student", role: "student", name: "API Test Student" });

const call = async (path, { method = "GET", token } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: method === "GET" || method === "DELETE" ? undefined : JSON.stringify(call.body),
  });
  let json = null;
  try { json = await res.json(); } catch { /* 204 */ }
  return { status: res.status, json };
};

let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  → " + extra : ""}`);
  if (!ok) failed++;
};

// 1. Student gửi ticket
call.body = { title: "Không vào được game Săn Trái Cây", content: "Màn hình tải mãi không vào", priority: "high" };
const created = await call("/support/tickets", { method: "POST", token: studentToken });
check("POST /support/tickets (student) → 201", created.status === 201, JSON.stringify(created.json?.data?.code));
const ticket = created.json?.data;

// 2. Không đăng nhập → 401
call.body = { title: "x", content: "y" };
const anon = await call("/support/tickets", { method: "POST" });
check("POST không token → 401", anon.status === 401);

// 3. Student không xem được danh sách admin
const forbidden = await call("/support/admin/tickets", { token: studentToken });
check("GET /support/admin/tickets (student) → 403", forbidden.status === 403);

// 4. Admin xem được
const list = await call("/support/admin/tickets", { token: adminToken });
check("GET /support/admin/tickets (admin) → 200", list.status === 200);
check("Danh sách chứa ticket vừa tạo", (list.json?.data || []).some((t) => t.id === ticket?.id));

// 5. Admin cập nhật trạng thái + phản hồi
call.body = { status: "done", priority: "medium", reply: "Đã sửa xong, bạn thử lại nhé" };
const patched = await call(`/support/admin/tickets/${ticket.id}`, { method: "PATCH", token: adminToken });
check("PATCH status/reply → 200", patched.status === 200 && patched.json?.data?.status === "done" && patched.json?.data?.reply?.includes("thử lại"));

// 6. Status sai bị chặn
call.body = { status: "bogus" };
const bad = await call(`/support/admin/tickets/${ticket.id}`, { method: "PATCH", token: adminToken });
check("PATCH status không hợp lệ → 400", bad.status === 400);

// 7. Student xem ticket của mình
const mine = await call("/support/tickets/mine", { token: studentToken });
check("GET /support/tickets/mine (student) thấy ticket", (mine.json?.data || []).some((t) => t.id === ticket?.id));

// 8. Xoá
const removed = await call(`/support/admin/tickets/${ticket.id}`, { method: "DELETE", token: adminToken });
check("DELETE (admin) → 200", removed.status === 200);
const list2 = await call("/support/admin/tickets", { token: adminToken });
check("Ticket đã xoá không còn trong danh sách", !(list2.json?.data || []).some((t) => t.id === ticket?.id));

console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
