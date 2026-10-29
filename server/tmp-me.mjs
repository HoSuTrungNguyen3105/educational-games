/**
 * Test tạm GET /auth/me (chạy: cd server && node tmp-me.mjs) — tài khoản tự tạo,
 * token ký bằng signToken, không dùng mật khẩu seed. Xong việc xóa file này.
 */
import { getCollection, connect } from "./src/db.js";
import { signToken } from "./src/services/authService.js";
import { registerUser } from "./src/services/authService.js";
import { getRolePermissions } from "./src/services/permissionService.js";

await connect();
const users = getCollection("users");
const created = [];

async function makeUser(role) {
  const u = {
    id: `zz-me-${role}-${Date.now()}`,
    username: `zz_me_${role}`,
    name: "Test /me",
    role,
    passwordHash: "x",
    createdAt: new Date().toISOString(),
  };
  await users.insertOne(u);
  created.push(u.id);
  return u;
}

async function callMe(token) {
  const r = await fetch("http://localhost:5000/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
  const j = await r.json();
  return { status: r.status, d: j.data };
}

for (const role of ["teacher", "student", "admin"]) {
  const u = await makeUser(role);
  const { status, d } = await callMe(signToken(u));
  const keys = Object.keys(d || {});
  const perms = d?.permissions;
  console.log(`\n[${role}] status=${status}`);
  console.log("  có games?", "games" in (d || {}), "| có permissions?", Array.isArray(perms), "| số quyền:", Array.isArray(perms) ? perms.length : "-");
  console.log("  keys:", keys.join(", "));
  console.log("  sample:", JSON.stringify((perms || []).slice(0, 8)));
  console.log("  stats:", JSON.stringify(d?.stats));
  const direct = await getRolePermissions(role);
  console.log("  khớp getRolePermissions():", JSON.stringify(direct) === JSON.stringify(perms), `(${direct.length} quyền)`);
}

// Vai trò tùy chỉnh: tạo role trong collection `roles` rồi đọc /me của user mang role đó.
const roles = getCollection("roles");
const customKey = "zz_custom_test";
await roles.insertOne({
  id: `role-${customKey}`, key: customKey, label: "Test tùy chỉnh", isBuiltIn: false,
  dashboardAccess: true,
  matrix: { games: { view: true, edit: false, delete: false }, reports: { view: true, edit: true, delete: false } },
  createdAt: new Date().toISOString(),
});
const cu = await makeUser(customKey);
const { d: cd } = await callMe(signToken(cu));
console.log(`\n[role tùy chỉnh] permissions=${JSON.stringify(cd?.permissions)}`);

for (const id of created) await users.deleteOne({ id });
await users.deleteMany({ username: { $in: ["zz_me_teacher", "zz_me_student", "zz_me_admin", `zz_me_${customKey}`] } });
await roles.deleteOne({ key: customKey });
console.log("\ndọn:", await users.countDocuments({ id: { $in: created } }), "user test còn lại |", await roles.countDocuments({ key: customKey }), "role test còn lại");
await getCollection("userGameProgress").deleteMany({ userId: { $in: created } });
await connect().then(() => {});
process.exit(0);
