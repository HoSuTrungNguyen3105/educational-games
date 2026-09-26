import { getCollection } from "../db.js";
import {
  FEATURES,
  ROLES,
  ROLES_SEED_VERSION,
  ROLE_KEYS,
  permissionsToMatrix,
  matrixToPermissions,
} from "../../../src/config/roles.js";

const COLLECTION = "roles";
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const none = () => permissionsToMatrix([]);

// Built-in roles seeded into the `roles` collection — defined once in src/config/roles.js
export const BUILTIN_ROLES = Object.entries(ROLES).map(([key, role]) => ({
  id: `role-${key}`,
  key,
  label: role.label,
  description: role.description || "",
  isBuiltIn: true,
  dashboardAccess: !!role.dashboardAccess,
  matrix: permissionsToMatrix(role.permissions),
  seedVersion: ROLES_SEED_VERSION,
}));

async function ensureSeeded() {
  const col = getCollection(COLLECTION);
  const keys = BUILTIN_ROLES.map((r) => r.key);
  const existing = await col.find({ key: { $in: keys } }).toArray();
  const byKey = new Map(existing.map((d) => [d.key, d]));
  const now = new Date().toISOString();

  const ops = [];
  for (const r of BUILTIN_ROLES) {
    const doc = byKey.get(r.key);
    if (!doc) {
      ops.push({ insertOne: { document: { ...r, createdAt: now } } });
    } else if ((doc.seedVersion ?? 0) !== r.seedVersion) {
      // Config changed (or first run on an older DB) -> refresh built-in defaults.
      // Custom roles and admin edits made after seeding are kept until the next bump.
      ops.push({
        updateOne: {
          filter: { key: r.key },
          update: {
            $set: {
              id: r.id,
              label: r.label,
              description: r.description,
              isBuiltIn: true,
              dashboardAccess: r.dashboardAccess,
              matrix: r.matrix,
              seedVersion: r.seedVersion,
              updatedAt: now,
            },
          },
        },
      });
    }
  }
  if (ops.length) await col.bulkWrite(ops, { ordered: false });
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
  const roles = await getCollection(COLLECTION).find({}).toArray();
  // Built-in roles follow the config order (admin -> teacher -> student), custom ones after
  const rank = (r) => {
    const i = r.isBuiltIn ? ROLE_KEYS.indexOf(r.key) : -1;
    return i >= 0 ? i : ROLE_KEYS.length;
  };
  roles.sort((a, b) => rank(a) - rank(b) || String(a.label).localeCompare(String(b.label), "vi"));
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

export async function createRole({ key, label, description, dashboardAccess = false, matrix, permissions }) {
  await ensureSeeded();
  const k = String(key || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const name = String(label || "").trim();
  if (!k) throw new Error("key là bắt buộc (a-z, 0-9, - , _)");
  if (!name) throw new Error("label là bắt buộc");
  if (ROLE_KEYS.includes(k)) {
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
    matrix: buildMatrix({ matrix, permissions }),
    createdAt: new Date().toISOString(),
  };
  await col.insertOne(doc);
  const counts = await countByRole();
  return toApi(doc, counts);
}

export async function updateRole(keyOrId, { label, description, dashboardAccess, matrix, permissions }) {
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
  if (matrix != null || permissions != null) {
    updates.matrix = buildMatrix({ matrix: matrix ?? role.matrix, permissions });
  }
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

// Accepts either `permissions` (array, wins) or `matrix` (UI format) — both normalized
function buildMatrix({ matrix, permissions }) {
  return Array.isArray(permissions) ? permissionsToMatrix(permissions) : normalizeMatrix(matrix);
}

export async function getUserCounts() {
  return countByRole();
}

export { FEATURES as PERMISSION_FEATURES, matrixToPermissions };
