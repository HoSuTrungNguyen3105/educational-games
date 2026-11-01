// Throwaway e2e test: ticket route về GV chủ nhiệm / admin tổng + quyền _all.
// Chạy: node ../scratch/support-routing-test.mjs   (cwd = server/, server :5000 đang chạy)
const BASE = process.env.TEST_API || "http://localhost:5000/api";
const { signToken } = await import("../server/src/services/authService.js");
const { connect, getCollection, close } = await import("../server/src/db.js");
await connect();

const adminToken = signToken({ id: "test-admin-1", username: "apitest_admin", role: "admin", name: "API Test Admin" });
const teacherToken = signToken({ id: "zz_test_teacher", username: "zz_test_teacher", role: "teacher", name: "Test Teacher" });
const studentToken = signToken({ id: "zz_test_student", username: "zz_test_student", role: "student", name: "Test Student" });
const freeToken = signToken({ id: "zz_test_free", username: "zz_test_free", role: "student", name: "Test Free Student" });

// ── Dữ liệu tạm (xóa ở finally) ─────────────────────────────────────────
const now = new Date().toISOString();
await getCollection("users").insertMany([
  { id: "zz_test_teacher", username: "zz_test_teacher", role: "teacher", name: "Test Teacher", createdAt: now },
  { id: "zz_test_student", username: "zz_test_student", role: "student", name: "Test Student", classId: "zz_test_class", createdAt: now },
  { id: "zz_test_free", username: "zz_test_free", role: "student", name: "Test Free Student", createdAt: now },
]);
await getCollection("classes").insertOne({ id: "zz_test_class", code: "ZZTEST01", name: "Lớp test", createdAt: now });
await getCollection("teacher_classes").insertOne({ id: "zz_test_tc", teacherId: "zz_test_teacher", classId: "zz_test_class", createdAt: now });

const call = async (path, { method = "GET", token, body } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
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

const ticketIds = [];
try {
  // 1. Học sinh CÓ LỚP → ticket gán cho GV phụ trách lớp
  const t1 = await call("/support/tickets", { method: "POST", token: studentToken, body: { title: "Loi game A", content: "test routing co lop", priority: "high" } });
  check("POST ticket (HS có lớp) → 201", t1.status === 201, JSON.stringify(t1.json?.data?.code));
  const tk1 = t1.json?.data;
  if (tk1) ticketIds.push(tk1.id);
  check("→ gán cho GV chủ nhiệm", tk1?.assigneeType === "teacher" && tk1?.assigneeId === "zz_test_teacher" && tk1?.classId === "zz_test_class", JSON.stringify({ a: tk1?.assigneeType, b: tk1?.assigneeId }));

  // 2. Học sinh KHÔNG có lớp → về admin tổng
  const t2 = await call("/support/tickets", { method: "POST", token: freeToken, body: { title: "Loi game B", content: "test routing khong lop", priority: "medium" } });
  const tk2 = t2.json?.data;
  if (tk2) ticketIds.push(tk2.id);
  check("POST ticket (HS không lớp) → gán admin tổng", t2.status === 201 && tk2?.assigneeType === "admin" && tk2?.assigneeId === null);

  // 3. GV chỉ thấy ticket của mình
  const assigned = await call("/support/tickets/assigned", { token: teacherToken });
  const list = assigned.json?.data || [];
  check("GET /tickets/assigned (GV) → chỉ thấy ticket được gán", assigned.status === 200 && list.some((t) => t.id === tk1?.id) && !list.some((t) => t.id === tk2?.id), `n=${list.length}`);

  // 4. GV không vào được trang admin tổng
  const forb = await call("/support/admin/tickets", { token: teacherToken });
  check("GET /admin/tickets (GV, không support_all) → 403", forb.status === 403, forb.json?.msg);

  // 5. Admin tổng (support_all) thấy hết qua cả 2 endpoint
  const adminAssigned = await call("/support/tickets/assigned", { token: adminToken });
  check("GET /tickets/assigned (admin có support_all) → thấy cả 2 ticket",
    adminAssigned.status === 200 && [tk1?.id, tk2?.id].every((id) => (adminAssigned.json?.data || []).some((t) => t.id === id)));
  const adminAll = await call("/support/admin/tickets", { token: adminToken });
  check("GET /admin/tickets (admin) → 200", adminAll.status === 200);

  // 6. GV trả lời ticket được gán; ticket của admin tổng thì bị 403
  const patch1 = await call(`/support/tickets/assigned/${tk1?.id}`, { method: "PATCH", token: teacherToken, body: { status: "done", reply: "GV da xu ly" } });
  check("PATCH /tickets/assigned/:id (ticket của mình) → 200 + status done", patch1.status === 200 && patch1.json?.data?.status === "done");
  const patch2 = await call(`/support/tickets/assigned/${tk2?.id}`, { method: "PATCH", token: teacherToken, body: { status: "done" } });
  check("PATCH ticket KHÔNG được gán (GV) → 403", patch2.status === 403, patch2.json?.msg);

  // 7. POST /permissions/all — seed các quyền `_all`
  const seed = await call("/permissions/all", { method: "POST", token: adminToken });
  check("POST /permissions/all (admin) → seeded >= 26", seed.status === 200 && seed.json?.data?.seeded >= 26, JSON.stringify({ seeded: seed.json?.data?.seeded, total: seed.json?.data?.total }));
  const slugs = (seed.json?.data?.permissions || []).map((p) => p.slug);
  check("có support_all + roles_all trong danh sách", slugs.includes("support_all") && slugs.includes("roles_all"));
  const permList = await call("/permissions?keyword=support_all", { token: adminToken });
  check("GET /permissions?keyword=support_all → thấy bản ghi trong collection", (permList.json?.data || []).some((p) => p.slug === "support_all"));

  // 8. Teacher không được gọi POST /permissions/all
  const seedT = await call("/permissions/all", { method: "POST", token: teacherToken });
  check("POST /permissions/all (teacher) → 403", seedT.status === 403);

  // 9. Vai trò admin trong API mang các quyền `_all`
  const roles = await call("/permissions/roles", { token: adminToken });
  const adminRole = (roles.json?.data || []).find((r) => r.key === "admin");
  const teacherRole = (roles.json?.data || []).find((r) => r.key === "teacher");
  check("role admin có support_all", (adminRole?.permissions || []).includes("support_all"));
  check("role teacher KHÔNG có _all nhưng có support.view",
    !(teacherRole?.permissions || []).some((p) => p.endsWith("_all")) && (teacherRole?.permissions || []).includes("support.view"));
} finally {
  await getCollection("support_tickets").deleteMany({ id: { $in: ticketIds } });
  await getCollection("users").deleteMany({ id: { $in: ["zz_test_teacher", "zz_test_student", "zz_test_free"] } });
  await getCollection("classes").deleteMany({ id: "zz_test_class" });
  await getCollection("teacher_classes").deleteMany({ id: "zz_test_tc" });
  await close();
}

console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
