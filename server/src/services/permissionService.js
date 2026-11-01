import { getCollection } from "../db.js";
import {
  FEATURES,
  PERMISSION_CATALOG,
  ROLES,
  ROLES_SEED_VERSION,
  ROLE_KEYS,
  ALL_ACCESS_PERMISSIONS,
  getRoleIdentity as getStaticRoleIdentity,
  permissionsToMatrix,
  matrixToPermissions,
} from "../../../src/config/roles.js";

const COLLECTION = "roles";
const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// Ma trận cũ gộp nhiều trang vào một ô (content/settings). Khi đọc dữ liệu cũ,
// mở rộng sang các trang con để không mất quyền đã cấp trước đây.
const LEGACY_MATRIX_GROUPS = {
  content: ["questions", "question_bank", "subjects", "categories", "templates"],
  settings: ["coins", "daily_tasks", "reminders", "settings"],
};

// Built-in roles seeded into the `roles` collection — defined once in src/config/roles.js
export const BUILTIN_ROLES = Object.entries(ROLES).map(([key, role]) => ({
  id: `role-${key}`,
  key,
  label: role.label,
  description: role.description || "",
  isBuiltIn: true,
  dashboardAccess: !!role.dashboardAccess,
  matrix: permissionsToMatrix(role.permissions),
  // Quyền `_all` không có ô ma trận → lưu riêng, merge vào `permissions` khi đọc.
  extraPermissions: role.permissions.filter((p) => ALL_ACCESS_PERMISSIONS.includes(p)),
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
              extraPermissions: r.extraPermissions,
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

function permissionDetailsFromPermissions(permissions) {
  const granted = new Set(permissions);
  return PERMISSION_CATALOG
    .filter((permission) => granted.has(permission.slug))
    .map((permission) => ({ ...permission, granted: true }));
}

/** Gộp quyền ma trận + quyền `_all` (extraPermissions) của role, khử trùng lặp. */
function mergePermissions(matrixPerms, extra) {
  return [...new Set([...(matrixPerms || []), ...(Array.isArray(extra) ? extra : [])])];
}

/** Chỉ nhận các slug `_all` hợp lệ từ client (chống nhét quyền lạ qua API). */
function sanitizeExtraPermissions(list) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.filter((p) => ALL_ACCESS_PERMISSIONS.includes(p)))];
}

function roleIdentity(role) {
  const fallback = getStaticRoleIdentity(role.key) || {};
  return {
    slug: role.key,
    name_vi: role.label || fallback.name_vi || role.key,
    name_en: role.name_en || fallback.name_en || role.label || role.key,
  };
}

function toApi(role, counts = {}, { withPermissions = false } = {}) {
  const matrix = normalizeMatrix(role.matrix);
  const permissions = mergePermissions(matrixToPermissions(matrix), role.extraPermissions);
  const permissionDetails = permissionDetailsFromPermissions(permissions);

  return {
    id: role.id,
    key: role.key,
    ...roleIdentity(role),
    label: role.label,
    description: role.description || "",
    isBuiltIn: !!role.isBuiltIn,
    dashboardAccess: !!role.dashboardAccess,
    matrix,
    accountCount: counts[role.key] || 0,
    permission_count: permissionDetails.length,
    permission_total: PERMISSION_CATALOG.length,
    permissions,
    ...(withPermissions ? { permission_details: permissionDetails } : {}),
    created_at: role.createdAt || null,
    updated_at: role.updatedAt || null,
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
  return toApi(role, counts, { withPermissions: true });
}

/**
 * Định danh rút gọn của một vai trò — dùng cho response profile:
 * roles: [{ slug, name_vi, name_en }].
 * Không gọi ensureSeeded để tránh ghi DB mỗi lần GET /auth/me.
 */
export async function getRoleIdentity(roleKey) {
  const key = String(roleKey || "").trim();
  if (!key) return null;
  try {
    const doc = await getCollection(COLLECTION).findOne({ $or: [{ key }, { id: `role-${key}` }] });
    if (doc) return roleIdentity(doc);
  } catch {
    /* DB chưa sẵn sàng → dùng cấu hình tĩnh */
  }
  return getStaticRoleIdentity(key);
}

export async function createRole({ key, label, name_en, description, dashboardAccess = false, matrix, permissions, extraPermissions }) {
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
    name_en: String(name_en || name).trim(),
    description: String(description || "").trim(),
    isBuiltIn: false,
    dashboardAccess: !!dashboardAccess,
    matrix: buildMatrix({ matrix, permissions }),
    extraPermissions: sanitizeExtraPermissions(extraPermissions),
    createdAt: new Date().toISOString(),
  };
  await col.insertOne(doc);
  invalidateRolePermissions(k);
  const counts = await countByRole();
  return toApi(doc, counts, { withPermissions: true });
}

export async function updateRole(keyOrId, { label, name_en, description, dashboardAccess, matrix, permissions, extraPermissions }) {
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
  if (name_en != null) updates.name_en = String(name_en).trim();
  if (description != null) updates.description = String(description).trim();
  if (dashboardAccess != null) updates.dashboardAccess = !!dashboardAccess;
  if (matrix != null || permissions != null) {
    updates.matrix = buildMatrix({ matrix: matrix ?? role.matrix, permissions });
  }
  if (extraPermissions != null) updates.extraPermissions = sanitizeExtraPermissions(extraPermissions);
  updates.updatedAt = new Date().toISOString();

  await col.updateOne({ id: role.id }, { $set: updates });
  invalidateRolePermissions(role.key);
  const updated = await col.findOne({ id: role.id });
  const counts = await countByRole();
  return toApi(updated, counts, { withPermissions: true });
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
  invalidateRolePermissions(role.key);
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

  for (const [legacyKey, targets] of Object.entries(LEGACY_MATRIX_GROUPS)) {
    const legacy = matrix?.[legacyKey];
    if (!legacy) continue;
    for (const key of targets) {
      const cell = out[key];
      if (!cell) continue;
      if (legacy.view) cell.view = true;
      if (legacy.edit) cell.edit = true;
      if (legacy.delete) cell.delete = true;
    }
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

/**
 * Mảng quyền của MỘT vai trò, đủ để client tự biết mình làm được gì mà không
 * phải tải cả ma trận: ["games.view", "games.manage", "chat", ...].
 *
 * Đọc từ collection `roles` nên vai trò tùy chỉnh và những ô admin bật/tắt trong
 * trang Phân quyền được phản ánh ngay. Cố ý KHÔNG gọi ensureSeeded (kẻo mỗi lần
 * GET /auth/me là một lần ghi DB) — DB chưa seed thì rơi về cấu hình tĩnh.
 */
export async function getRolePermissions(roleKey) {
  const key = String(roleKey || "").trim();
  if (!key) return [];
  try {
    const col = getCollection(COLLECTION);
    const q = { $or: [{ key }, { id: `role-${key}` }] };
    let doc = await col.findOne(q);
    // Config vừa đổi (ROLES_SEED_VERSION tăng, vd. thêm quyền `_all`) mà built-in
    // role chưa seed lại → quyền thiếu. Seed ngay rồi đọc lại (chỉ 1 lần,
    // middleware có bản nhớ 30s phía trên).
    if (doc && doc.isBuiltIn && (doc.seedVersion ?? 0) !== ROLES_SEED_VERSION) {
      await ensureSeeded();
      doc = await col.findOne(q);
    }
    if (doc) return mergePermissions(matrixToPermissions(normalizeMatrix(doc.matrix)), doc.extraPermissions);
  } catch {
    /* DB lỗi/collections trống → dùng cấu hình tĩnh bên dưới */
  }
  return [...(ROLES[key]?.permissions || [])];
}

// ── Bản nhớ quyền theo vai trò ──────────────────────────────────────────
// Middleware quyền chạy trên MỖI request, nên không thể đọc `roles` mỗi lần.
// Quyền chỉ đổi khi admin sửa vai trò → gọi invalidateRolePermissions() ở các
// hàm ghi bên dưới, cộng thêm TTL để an toàn nếu có tiến trình khác sửa DB.
const PERM_TTL_MS = 30_000;
const permCache = new Map();

export function invalidateRolePermissions(roleKey = null) {
  if (roleKey === null) permCache.clear();
  else permCache.delete(String(roleKey || "").trim());
}

/** Như getRolePermissions nhưng có bản nhớ 30 giây (dùng cho middleware). */
export async function getRolePermissionsCached(roleKey) {
  const key = String(roleKey || "").trim();
  if (!key) return [];
  const hit = permCache.get(key);
  if (hit && hit.at + PERM_TTL_MS > Date.now()) return hit.perms;
  const perms = await getRolePermissions(key);
  permCache.set(key, { perms, at: Date.now() });
  return perms;
}

// ── API dạng HiWeb: danh sách vai trò & quyền hạn có phân trang ─────────
// GET /api/roles và GET /api/permissions trả bản ghi phẳng
//   role:       { id (số), slug, name_vi, name_en, created_at, updated_at, total_permissions }
//   permission: { id (số), slug, name_vi, name_en, module, created_at, updated_at }
// Quyền hạn được seed vào collection `permissions` từ PERMISSION_CATALOG
// (danh mục tĩnh trong src/config/roles.js) — id số tăng dần, timestamp lưu ISO,
// xuất ra định dạng "YYYY-MM-DD HH:mm:ss" giống response HiWeb.

const PERMISSIONS_COLLECTION = "permissions";

function fmtDateTime(value) {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Kẹp tham số phân trang/sort của client vào khoảng hợp lệ. */
function pagingFrom(query = {}, defaultPerPage = 10) {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage ?? query.per_page) || defaultPerPage));
  return { page, perPage, keyword: String(query.keyword || "").trim() };
}

/** Bộ lọc $or tìm theo keyword trên các field text chỉ định. */
function keywordFilter(keyword, fields) {
  if (!keyword) return null;
  const rx = new RegExp(escapeRegex(keyword), "i");
  return { $or: fields.map((f) => ({ [f]: rx })) };
}

/** from_date/to_date trên một cột ngày (lưu dạng ISO string → so sánh từ điển được). */
function dateRangeFilter(field, fromDate, toDate) {
  const from = String(fromDate || "").trim();
  const to = String(toDate || "").trim();
  if (!from && !to) return null;
  const range = {};
  if (from) range.$gte = new Date(`${from}T00:00:00`).toISOString();
  if (to) range.$lte = new Date(`${to}T23:59:59.999`).toISOString();
  return { [field]: range };
}

function mergeFilters(...filters) {
  const parts = filters.filter(Boolean);
  if (!parts.length) return {};
  if (parts.length === 1) return parts[0];
  return { $and: parts };
}

async function ensurePermissionsSeeded() {
  const col = getCollection(PERMISSIONS_COLLECTION);
  const existing = new Set((await col.find({}, { projection: { slug: 1 } }).toArray()).map((d) => d.slug));
  const missing = PERMISSION_CATALOG.filter((p) => !existing.has(p.slug));
  if (!missing.length) return col;
  const top = await col.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
  let seq = (top[0]?.id || 0) + 1;
  const now = new Date().toISOString();
  await col.bulkWrite(
    missing.map((p) => ({
      insertOne: {
        document: {
          id: seq++, slug: p.slug, name_vi: p.name_vi, name_en: p.name_en,
          module: p.module, createdAt: now, updatedAt: now,
        },
      },
    })),
    { ordered: false }
  );
  return col;
}

const PERMISSION_SORT_FIELDS = {
  id: "id", slug: "slug", name_vi: "name_vi", name_en: "name_en",
  module: "module", created_at: "createdAt", updated_at: "updatedAt",
};

export async function listPermissionsPaged(query = {}) {
  const col = await ensurePermissionsSeeded();
  const { page, perPage, keyword } = pagingFrom(query);
  const filter = mergeFilters(
    keywordFilter(keyword, ["slug", "name_vi", "name_en", "module"]),
    dateRangeFilter(
      query.date_col === "updated_at" ? "updatedAt" : "createdAt",
      query.from_date, query.to_date
    )
  );
  const sortField = PERMISSION_SORT_FIELDS[query.sort_by] || "id";
  const sortDir = String(query.sort_dir || "ASC").toUpperCase() === "DESC" ? -1 : 1;
  const total = await col.countDocuments(filter);
  const docs = await col
    .find(filter)
    .sort({ [sortField]: sortDir })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .toArray();
  const data = docs.map((d) => ({
    id: d.id, slug: d.slug, name_vi: d.name_vi, name_en: d.name_en, module: d.module,
    created_at: fmtDateTime(d.createdAt), updated_at: fmtDateTime(d.updatedAt || d.createdAt),
  }));
  return { data, total, page, perPage };
}

const ROLE_SORT_FIELDS = {
  id: "seq", slug: "key", name_vi: "label", name_en: "name_en",
  created_at: "createdAt", updated_at: "updatedAt",
};

export async function listRolesPaged(query = {}) {
  await ensureSeeded();
  const col = getCollection(COLLECTION);
  // id số kiểu HiWeb: gắn dần `seq` cho các vai trò chưa có (built-in + custom).
  const all = await col.find({}).toArray();
  let maxSeq = all.reduce((m, d) => Math.max(m, Number(d.seq) || 0), 0);
  for (const d of all) {
    if (!d.seq) {
      maxSeq += 1;
      await col.updateOne({ id: d.id }, { $set: { seq: maxSeq } });
      d.seq = maxSeq;
    }
  }
  const { page, perPage, keyword } = pagingFrom(query);
  const kw = keyword.toLowerCase();
  const dateField = query.date_col === "updated_at" ? "updatedAt" : "createdAt";
  const from = query.from_date ? new Date(`${String(query.from_date).trim()}T00:00:00`) : null;
  const to = query.to_date ? new Date(`${String(query.to_date).trim()}T23:59:59.999`) : null;
  const sortField = ROLE_SORT_FIELDS[query.sort_by] || "seq";
  const sortDir = String(query.sort_dir || "ASC").toUpperCase() === "DESC" ? -1 : 1;
  // Số vai trò nhỏ → lọc/sắp xếp trong bộ nhớ cho đơn giản (roles nằm ở collection `roles`).
  const rows = all.filter((d) => {
    if (kw && !["key", "label", "name_en", "description"].some((f) => String(d[f] || "").toLowerCase().includes(kw))) return false;
    if (from || to) {
      const t = new Date(d[dateField] || d.createdAt || 0).getTime();
      if (from && t < from.getTime()) return false;
      if (to && t > to.getTime()) return false;
    }
    return true;
  });
  // Sắp xếp + cắt trang ngay trên mảng đã tải (số vai trò nhỏ, tránh index phức tạp)
  rows.sort((a, b) => {
    const av = a[sortField] ?? 0;
    const bv = b[sortField] ?? 0;
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return cmp * sortDir;
  });
  const total = rows.length;
  const data = rows.slice((page - 1) * perPage, page * perPage).map((d) => ({
    id: d.seq,
    slug: d.key,
    name_vi: d.name_vi || d.label,
    name_en: d.name_en || d.label,
    created_at: fmtDateTime(d.createdAt),
    updated_at: fmtDateTime(d.updatedAt || d.createdAt),
    total_permissions: permissionDetailsFromPermissions(mergePermissions(matrixToPermissions(normalizeMatrix(d.matrix)), d.extraPermissions)).length,
  }));
  return { data, total, page, perPage };
}

/**
 * POST /api/permissions/all — tạo (seed) các quyền `_all` vào collection
 * `permissions` để API gọi ra đúng khi kiểm tra toàn quyền. Idempotent:
 * thiếu slug nào thì chèn slug đó, trả về danh sách đầy đủ dạng HiWeb.
 */
export async function seedAllAccessPermissions() {
  const col = await ensurePermissionsSeeded();
  const docs = await col.find({ slug: { $in: ALL_ACCESS_PERMISSIONS } }).sort({ id: 1 }).toArray();
  return {
    total: ALL_ACCESS_PERMISSIONS.length,
    seeded: docs.length,
    permissions: docs.map((d) => ({
      id: d.id, slug: d.slug, name_vi: d.name_vi, name_en: d.name_en, module: d.module,
      created_at: fmtDateTime(d.createdAt), updated_at: fmtDateTime(d.updatedAt || d.createdAt),
    })),
  };
}

export { FEATURES as PERMISSION_FEATURES, PERMISSION_CATALOG, matrixToPermissions };
