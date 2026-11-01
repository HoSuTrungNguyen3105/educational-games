// Throwaway test cho API /api/roles + /api/permissions (cwd = server/).
const BASE = process.env.TEST_API || "http://localhost:5000/api";
const { signToken } = await import("../server/src/services/authService.js");

const adminToken = signToken({ id: "test-admin-1", username: "apitest_admin", role: "admin", name: "API Test Admin" });
const studentToken = signToken({ id: "test-student-1", username: "apitest_student", role: "student", name: "API Test Student" });

const get = async (path, token) => {
  const res = await fetch(`${BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  let json = null;
  try { json = await res.json(); } catch { /* nope */ }
  return { status: res.status, json };
};

let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  → " + extra : ""}`);
  if (!ok) failed++;
};

// ── /api/roles ──
const roles = await get("/roles?page=1&perPage=10", adminToken);
check("GET /roles (admin) → 200", roles.status === 200);
const r = roles.json?.data?.[0];
check("role item đúng dạng HiWeb", r && "id" in r && r.slug && r.name_vi && r.name_en && r.created_at && r.updated_at && typeof r.total_permissions === "number", JSON.stringify(r));
const rp = roles.json?.pagination;
check("pagination roles đủ field", rp && rp.current_page === 1 && rp.per_page === 10 && typeof rp.total === "number" && typeof rp.total_pages === "number" && "keyword" in rp && "sort_by" in rp && rp.sort_dir && rp.date_col === "created_at", JSON.stringify(rp));
const rolesDesc = await get("/roles?sort_by=id&sort_dir=DESC&keyword=teacher", adminToken);
check("roles sort/keyword → 200", rolesDesc.status === 200 && rolesDesc.json?.pagination?.sort_by === "id" && rolesDesc.json?.pagination?.sort_dir === "DESC");

// ── /api/permissions ──
const perms = await get("/permissions?page=1&perPage=10", adminToken);
check("GET /permissions (admin) → 200", perms.status === 200);
const p = perms.json?.data?.[0];
check("permission item đúng dạng HiWeb", p && "id" in p && p.slug && p.name_vi && p.name_en && p.module && p.created_at && p.updated_at, JSON.stringify(p));
check("pagination permissions per_page=10", perms.json?.pagination?.per_page === 10 && perms.json?.pagination?.total >= perms.json?.data?.length);
const permsKw = await get("/permissions?keyword=coins&perPage=5", adminToken);
check("permissions keyword → lọc theo slug/module", permsKw.status === 200 && (permsKw.json?.data || []).every((x) => JSON.stringify(x).toLowerCase().includes("coin")), JSON.stringify(permsKw.json?.data?.map((x) => x.slug)));

// ── Phân quyền ──
check("GET /roles không token → 401", (await get("/roles")).status === 401);
check("GET /roles (student) → 403", (await get("/roles", studentToken)).status === 403);
check("GET /permissions (student) → 403", (await get("/permissions", studentToken)).status === 403);

// Route cũ không bị ảnh hưởng
check("GET /permissions/roles (cũ) vẫn 200", (await get("/permissions/roles", adminToken)).status === 200);

console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
