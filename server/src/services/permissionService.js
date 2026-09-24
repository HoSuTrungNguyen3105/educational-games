import { getCollection } from "../db.js";

const COLLECTION = "roles";
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// Permission features shown in admin matrix (matches UI columns: Xem / Sửa / Xóa)
export const FEATURES = [
  { key: "games", label: "Trò chơi", permissions: { view: "games.view", edit: "games.edit", delete: "games.delete" } },
  { key: "content", label: "Môn học & câu hỏi", permissions: { view: "content.view", edit: "content.edit", delete: "content.delete" } },
  { key: "users", label: "Người dùng", permissions: { view: "users.view", edit: "users.edit", delete: "users.delete" } },
  { key: "reports", label: "Báo cáo & thống kê", permissions: { view: "reports.view", edit: "reports.edit", delete: "reports.delete" } },
  { key: "settings", label: "Cài đặt hệ thống", permissions: { view: "settings.view", edit: "settings.edit", delete: "settings.delete" } },
];

const all = (on = true) => {
  const m = {};
  for (const f of FEATURES) {
    m[f.key] = { view: on, edit: on, delete: on };
  }
  return m;
};

const none = () => all(false);

// Built-in role defaults (seeded into `roles` collection)
export const BUILTIN_ROLES = [
  {
    id: "role-admin",
    key: "admin",
    label: "Admin",
    description: "Toàn quyền hệ thống",
    isBuiltIn: true,
    dashboardAccess: true,
    matrix: all(true),
  },
  {
    id: "role-teacher",
    key: "teacher",
    label: "Giáo viên",
    description: "Quản lý nội dung & lớp học",
    isBuiltIn: true,
    dashboardAccess: true,
    matrix: {
      games: { view: true, edit: true, delete: false },
      content: { view: true, edit: true, delete: false },
      users: { view: true, edit: false, delete: false },
      reports: { view: true, edit: false, delete: false },
      settings: { view: false, edit: false, delete: false },
    },
  },
  {
    id: "role-student",
    key: "student",
    label: "Học sinh",
    description: "Chơi game & học tập",
    isBuiltIn: true,
    dashboardAccess: false,
    matrix: none(),
  },
];

function matrixToPermissions(matrix) {
  const perms = [];
  for (const f of FEATURES) {
    const m = matrix?.[f.key] || {};
    if (m.view) perms.push(f.permissions.view);
    if (m.edit) perms.push(f.permissions.edit);
    if (m.delete) perms.push(f.permissions.delete);
  }
  // Legacy aliases used by sidebar / existing UI
  if (matrix?.games?.edit) {
    perms.push("games.manage", "games.play");
  }
  if (matrix?.content?.edit) {
    perms.push("questions.manage", "subjects.manage", "categories.manage", "templates.manage");
  }
  if (matrix?.users?.view) perms.push("users.view");
  if (matrix?.users?.edit) perms.push("users.manage");
  if (matrix?.settings?.edit) perms.push("setup.manage", "coins.manage", "daily-tasks.manage");
  // Common non-admin permissions
  perms.push("chat", "profile", "friends", "coins.view", "daily-tasks");
  if (matrix?.games?.view || matrix?.games?.edit) perms.push("games.play");
  return [...new Set(perms)];
}

async function ensureSeeded() {
  const col = getCollection(COLLECTION);
  const count = await col.countDocuments({});
  if (count === 0) {
    for (const r of BUILTIN_ROLES) {
      await col.updateOne(
        { key: r.key },
        { $setOnInsert: { ...r, createdAt: new Date().toISOString() } },
        { upsert: true },
      );
    }
  } else {
    // Ensure built-ins exist even if collection was partially seeded
    for (const r of BUILTIN_ROLES) {
      const exists = await col.findOne({ key: r.key });
      if (!exists) {
        await col.insertOne({ ...r, createdAt: new Date().toISOString() });
      }
    }
  }
}

async function countByRole() {
  const rows = await getCollection("users")
    .aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])
    .toArray();
  const map = {};
  for (const row of rows) map[row._id || ""] = row.count;
  return map;
}

function toApi(role, counts = {}) {
  return {
    id: role.id,
    key: role.key,
    label: role.label,
    description: role.description || "",
    isBuiltIn: !!role.isBuiltIn,
    dashboardAccess: !!role.dashboardAccess,
    matrix: role.matrix || none(),
    accountCount: counts[role.key] || 0,
    permissions: matrixToPermissions(role.matrix),
  };
}

export async function listRoles() {
  await ensureSeeded();
  const counts = await countByRole();
  const roles = await getCollection(COLLECTION).find({}).sort({ isBuiltIn: -1, label: 1 }).toArray();
  return roles.map((r) => toApi(r, counts));
}

export async function getRole(keyOrId) {
  await ensureSeeded();
  const col = getCollection(COLLECTION);
  const role = await col.findOne({ $or: [{ key: keyOrId }, { id: keyOrId }] });
  if (!role) return null;
  const counts = await countByRole();
  return toApi(role, counts);
}

export async function createRole({ key, label, description, dashboardAccess = false, matrix }) {
  await ensureSeeded();
  const k = String(key || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const name = String(label || "").trim();
  if (!k) throw new Error("key là bắt buộc (a-z, 0-9, - , _)");
  if (!name) throw new Error("label là bắt buộc");
  if (["admin", "teacher", "student"].includes(k)) {
    throw new Error("Không thể tạo trùng vai trò hệ thống");
  }
  const col = getCollection(COLLECTION);
  const exists = await col.findOne({ key: k });
  if (exists) throw new Error("key đã tồn tại");

  const doc = {
    id: uid("role"),
    key: k,
    label: name,
    description: String(description || "").trim(),
    isBuiltIn: false,
    dashboardAccess: !!dashboardAccess,
    matrix: normalizeMatrix(matrix),
    createdAt: new Date().toISOString(),
  };
  await col.insertOne(doc);
  const counts = await countByRole();
  return toApi(doc, counts);
}

export async function updateRole(keyOrId, { label, description, dashboardAccess, matrix }) {
  await ensureSeeded();
  const col = getCollection(COLLECTION);
  const role = await col.findOne({ $or: [{ key: keyOrId }, { id: keyOrId }] });
  if (!role) throw new Error("Không tìm thấy vai trò");

  const updates = {};
  if (label != null) {
    const name = String(label).trim();
    if (!name) throw new Error("label không được rỗng");
    updates.label = name;
  }
  if (description != null) updates.description = String(description).trim();
  if (dashboardAccess != null) updates.dashboardAccess = !!dashboardAccess;
  if (matrix != null) updates.matrix = normalizeMatrix(matrix);
  updates.updatedAt = new Date().toISOString();

  await col.updateOne({ id: role.id }, { $set: updates });
  const updated = await col.findOne({ id: role.id });
  const counts = await countByRole();
  return toApi(updated, counts);
}

export async function deleteRole(keyOrId) {
  await ensureSeeded();
  const col = getCollection(COLLECTION);
  const role = await col.findOne({ $or: [{ key: keyOrId }, { id: keyOrId }] });
  if (!role) throw new Error("Không tìm thấy vai trò");
  if (role.isBuiltIn) throw new Error("Không thể xóa vai trò hệ thống");

  const inUse = await getCollection("users").countDocuments({ role: role.key });
  if (inUse > 0) {
    throw new Error(`Còn ${inUse} tài khoản đang dùng vai trò này — hãy chuyển họ sang vai trò khác trước`);
  }
  await col.deleteOne({ id: role.id });
  return { ok: true, key: role.key };
}

function normalizeMatrix(matrix) {
  const out = {};
  for (const f of FEATURES) {
    const m = matrix?.[f.key] || {};
    out[f.key] = {
      view: !!m.view,
      edit: !!m.edit,
      delete: !!m.delete,
    };
  }
  return out;
}

export async function getUserCounts() {
  return countByRole();
}

export { FEATURES as PERMISSION_FEATURES, matrixToPermissions };
