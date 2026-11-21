import { getCollection } from "../db.js";
import {
  FEATURES,
  PERMISSION_CATALOG,
  ROLES,
  ROLES_SEED_VERSION,
  ROLE_KEYS,
  ALL_ACCESS_PERMISSIONS,
  BASE_PERMISSIONS,
  getRoleIdentity as getStaticRoleIdentity,
  permissionsToMatrix,
  matrixToPermissions,
} from "../../../src/config/roles.js";

const COLLECTION = "roles";
import { uid } from "../utils/id.js";

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

/**
 * Tập quyền hiệu lực của một role doc theo cách lưu CŨ (matrix + extra).
 * Chỉ còn dùng cho migration sang `role_permissions` và cho các đường ghi
 * kiểu cũ (updateRole nhận matrix/permissions) — nguồn sự thật sau
 * migration là collection `role_permissions`.
 */
function legacyEffectivePermissions(role) {
  return mergePermissions(matrixToPermissions(normalizeMatrix(role.matrix)), role.extraPermissions);
}

function toApi(role, counts = {}, { withPermissions = false, slugs = null } = {}) {
  // Sau migration, quyền đọc từ role_permissions (slugs truyền vào); chưa có
  // thì suy từ cách lưu cũ để response không bao giờ rỗng oan.
  const permissions = slugs ?? legacyEffectivePermissions(role);
  const permissionDetails = permissionDetailsFromPermissions(permissions);
  // Matrix trong response là BẢN SUY RA từ tập quyền thật (chỉ để tương
  // thích client cũ) — không còn là nơi lưu trữ.
  const matrix = permissionsToMatrix(permissions);

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
  await ensureRolePermissionsMigrated();
  const counts = await countByRole();
  const roles = await getCollection(COLLECTION).find({}).toArray();
  const slugMap = await loadRolePermissionSlugs(roles);
  // Built-in roles follow the config order (admin -> teacher -> student), custom ones after
  const rank = (r) => {
    const i = r.isBuiltIn ? ROLE_KEYS.indexOf(r.key) : -1;
    return i >= 0 ? i : ROLE_KEYS.length;
  };
  roles.sort((a, b) => rank(a) - rank(b) || String(a.label).localeCompare(String(b.label), "vi"));
  return roles.map((r) => toApi(r, counts, { slugs: slugMap.get(r.id) ?? [] }));
}

export async function getRole(keyOrId) {
  await ensureRolePermissionsMigrated();
  const col = getCollection(COLLECTION);
  const role = await col.findOne({ $or: [{ key: keyOrId }, { id: keyOrId }] });
  if (!role) return null;
  const counts = await countByRole();
  const slugMap = await loadRolePermissionSlugs([role]);
  return toApi(role, counts, { withPermissions: true, slugs: slugMap.get(role.id) ?? [] });
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
    rpMigrated: true,
    createdAt: new Date().toISOString(),
  };
  await col.insertOne(doc);
  const slugs = await setRolePermissions(doc, legacyEffectivePermissions(doc));
  invalidateRolePermissions(k);
  const counts = await countByRole();
  return toApi(doc, counts, { withPermissions: true, slugs });
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
  // Đường ghi kiểu cũ (matrix / permissions / extraPermissions): chuyển
  // thành tập slug đích rồi đồng bộ vào `role_permissions` — nguồn sự thật.
  let targetSlugs = null;
  if (permissions != null) {
    targetSlugs = [...permissions];
    // Không gửi extraPermissions → giữ nguyên các quyền `_all` hiện có
    // (đúng hành vi cũ: field nào không gửi thì không đổi).
    const currentAll = extraPermissions != null
      ? sanitizeExtraPermissions(extraPermissions)
      : (role.extraPermissions || []).filter((s) => ALL_ACCESS_PERMISSIONS.includes(s));
    targetSlugs = mergePermissions(targetSlugs, currentAll);
  } else if (matrix != null) {
    targetSlugs = mergePermissions(
      matrixToPermissions(buildMatrix({ matrix })),
      sanitizeExtraPermissions(extraPermissions ?? role.extraPermissions)
    );
  } else if (extraPermissions != null) {
    const current = await loadRolePermissionSlugs([role]);
    const kept = (current.get(role.id) || []).filter((s) => !ALL_ACCESS_PERMISSIONS.includes(s));
    targetSlugs = mergePermissions(kept, sanitizeExtraPermissions(extraPermissions));
  }
  if (targetSlugs) {
    updates.matrix = permissionsToMatrix(targetSlugs);
    updates.extraPermissions = targetSlugs.filter((s) => ALL_ACCESS_PERMISSIONS.includes(s));
  }
  updates.updatedAt = new Date().toISOString();

  await col.updateOne({ id: role.id }, { $set: updates });
  const updated = await col.findOne({ id: role.id });
  let slugs;
  if (targetSlugs) slugs = await setRolePermissions(updated, targetSlugs);
  else {
    const map = await loadRolePermissionSlugs([updated]);
    slugs = map.get(updated.id) ?? [];
  }
  invalidateRolePermissions(role.key);
  const counts = await countByRole();
  return toApi(updated, counts, { withPermissions: true, slugs });
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
  await getCollection(ROLE_PERMISSIONS_COLLECTION).deleteMany({ role_id: role.id });
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
    if (doc) {
      // Nguồn sự thật: collection `role_permissions`. Vai trò chưa qua
      // migration thì migrate ngay từ matrix/extra cũ (idempotent).
      if (!isRoleMigrated(doc)) await migrateRolePermissions(doc);
      const rows = await getCollection(ROLE_PERMISSIONS_COLLECTION)
        .find({ role_id: doc.id }, { projection: { permission_slug: 1 } })
        .toArray();
      return [...new Set(rows.map((r) => r.permission_slug).filter(Boolean))];
    }
  } catch {
    /* DB lỗi/collections trống → dùng cấu hình tĩnh bên dưới */
  }
  return [...(ROLES[key]?.permissions || [])];
}

// ── role_permissions: bảng gán quyền cho từng vai trò ──────────────────
// Từ đợt refactor Role & Permission, đây là NGUỒN SỰ THẬT duy nhất về
// "vai trò X có quyền gì": mỗi bản ghi là một cặp (role_id, permission_id)
// — role_id là `id` (chuỗi) của document vai trò, permission_id là id số
// của catalog `permissions`; role_key/permission_slug được ghi kèm
// (denormalized) để middleware đọc thẳng slug mà không cần join mỗi
// request. Cặp (role_id, permission_id) có unique index chống trùng.
const ROLE_PERMISSIONS_COLLECTION = "role_permissions";

/** Vai trò đã qua migration sang role_permissions chưa? */
function isRoleMigrated(role) {
  if (!role) return false;
  return role.isBuiltIn ? role.rpSeedVersion === ROLES_SEED_VERSION : role.rpMigrated === true;
}

/** Map role_id → mảng slug quyền đã gán (một query cho nhiều vai trò). */
export async function loadRolePermissionSlugs(roleDocs) {
  const map = new Map();
  const ids = (roleDocs || []).map((r) => r.id).filter(Boolean);
  if (!ids.length) return map;
  const rows = await getCollection(ROLE_PERMISSIONS_COLLECTION)
    .find({ role_id: { $in: ids } }, { projection: { role_id: 1, permission_slug: 1 } })
    .toArray();
  for (const row of rows) {
    if (!row.permission_slug) continue;
    if (!map.has(row.role_id)) map.set(row.role_id, []);
    map.get(row.role_id).push(row.permission_slug);
  }
  for (const [k, v] of map) map.set(k, [...new Set(v)]);
  return map;
}

/**
 * Đồng bộ role_permissions của MỘT vai trò về đúng tập slug đích (thêm
 * phần thiếu, gỡ phần thừa). Quyền cơ bản (BASE_PERMISSIONS) luôn được
 * giữ — đúng bất biến cũ của matrixToPermissions (mọi vai trò đều có
 * chat/hồ sơ/bạn bè…). Slug không có trong catalog thì bỏ qua. Trả về
 * tập slug thực tế sau đồng bộ.
 */
export async function setRolePermissions(roleDoc, slugs) {
  await ensurePermissionsSeeded();
  const wanted = [...new Set([...(Array.isArray(slugs) ? slugs : []), ...BASE_PERMISSIONS])];
  const catDocs = await getCollection(PERMISSIONS_COLLECTION)
    .find({ slug: { $in: wanted } }, { projection: { id: 1, slug: 1 } })
    .toArray();
  const target = new Map(catDocs.map((d) => [d.id, d.slug]));
  const rpCol = getCollection(ROLE_PERMISSIONS_COLLECTION);
  const existing = await rpCol.find({ role_id: roleDoc.id }, { projection: { id: 1, permission_id: 1 } }).toArray();
  const existingIds = new Set(existing.map((r) => r.permission_id));
  const now = new Date().toISOString();
  const ops = [];
  for (const [pid, slug] of target) {
    if (!existingIds.has(pid)) {
      ops.push({
        insertOne: {
          document: {
            id: uid("rp"), role_id: roleDoc.id, permission_id: pid,
            role_key: roleDoc.key, permission_slug: slug, createdAt: now,
          },
        },
      });
    }
  }
  for (const r of existing) {
    if (!target.has(r.permission_id)) ops.push({ deleteOne: { filter: { id: r.id } } });
  }
  if (ops.length) {
    try {
      await rpCol.bulkWrite(ops, { ordered: false });
    } catch (e) {
      // Hai tiến trình migrate/gán đồng thời có thể đụng unique index — phần
      // ghi còn lại vẫn đúng, lần đọc sau sẽ khớp. Chỉ nuốt lỗi trùng khóa.
      if (e?.code !== 11000 && !/duplicate key/i.test(String(e?.message || ""))) throw e;
    }
  }
  invalidateRolePermissions(roleDoc.key);
  return [...target.values()];
}

/** Migrate MỘT vai trò: dựng role_permissions từ matrix/extra cũ + đặt cờ. */
async function migrateRolePermissions(roleDoc) {
  const slugs = await setRolePermissions(roleDoc, legacyEffectivePermissions(roleDoc));
  await getCollection(COLLECTION).updateOne(
    { id: roleDoc.id },
    { $set: roleDoc.isBuiltIn ? { rpSeedVersion: ROLES_SEED_VERSION, rpMigrated: true } : { rpMigrated: true } }
  );
  return slugs;
}

/**
 * Migration idempotent toàn cục: seed roles + catalog, rồi vai trò nào
 * chưa chuyển thì dựng role_permissions từ dữ liệu gán hiện tại của nó.
 * Chạy lại không nhân đôi (unique index + diff theo tập slug), không hồi
 * sinh quyền admin đã thu hồi sau migration (cờ rpMigrated/rpSeedVersion
 * đã đặt thì bỏ qua).
 */
export async function ensureRolePermissionsMigrated() {
  await ensureSeeded();
  await ensurePermissionsSeeded();
  const roles = await getCollection(COLLECTION).find({}).toArray();
  for (const role of roles) {
    if (!isRoleMigrated(role)) await migrateRolePermissions(role);
  }
}

/**
 * Resolve tham chiếu vai trò từ API: chấp nhận id số (seq như GET
 * /api/roles), `id` document, hoặc slug/key. Không thấy → null.
 */
export async function resolveRoleRef(ref) {
  await ensureSeeded();
  const col = getCollection(COLLECTION);
  const raw = String(ref ?? "").trim();
  if (!raw) return null;
  let role = await col.findOne({ $or: [{ key: raw }, { id: raw }] });
  if (role) return role;
  if (/^\d+$/.test(raw)) {
    // seq được gán lười trong listRolesPaged — gọi một lần để bảo đảm có.
    await listRolesPaged({});
    role = await col.findOne({ seq: Number(raw) });
  }
  return role || null;
}

function httpError(message, statusCode) {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
}

/** Chuẩn hoá + validate danh sách permission_ids theo catalog thật. */
async function validatePermissionIds(permissionIds) {
  if (!Array.isArray(permissionIds)) throw httpError("permission_ids phải là một mảng", 400);
  const ids = [...new Set(permissionIds.map((v) => Number(v)).filter((n) => Number.isSafeInteger(n) && n >= 1))];
  if (ids.length !== new Set(permissionIds.map((v) => Number(v))).size && permissionIds.some((v) => !Number.isSafeInteger(Number(v)) || Number(v) < 1)) {
    throw httpError("permission_ids chứa giá trị không hợp lệ", 400);
  }
  await ensurePermissionsSeeded();
  const docs = await getCollection(PERMISSIONS_COLLECTION).find({ id: { $in: ids } }).toArray();
  if (docs.length !== ids.length) {
    const found = new Set(docs.map((d) => d.id));
    const missing = ids.filter((id) => !found.has(id));
    throw httpError(`permission_ids không tồn tại trong catalog: ${missing.join(", ")}`, 400);
  }
  return docs;
}

function rolePermissionRow(role, rpRow, permDoc) {
  const identity = roleIdentity(role);
  return {
    id: rpRow.id,
    role_id: role.seq ?? null,
    permission_id: rpRow.permission_id,
    role_slug: role.key,
    role_name_vi: identity.name_vi,
    role_name_en: identity.name_en,
    permission_slug: permDoc?.slug || rpRow.permission_slug,
    permission_name_vi: permDoc?.name_vi || rpRow.permission_slug,
    permission_name_en: permDoc?.name_en || rpRow.permission_slug,
    module: permDoc?.module || null,
  };
}

/**
 * GET /api/rolePermissions — chỉ quyền của đúng vai trò được hỏi, kèm
 * thông tin vai trò + quyền + module, phân trang page/per_page.
 */
export async function listRolePermissions(ref, query = {}) {
  const role = await resolveRoleRef(ref);
  if (!role) throw httpError("Không tìm thấy vai trò", 404);
  if (!isRoleMigrated(role)) await migrateRolePermissions(role);
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(500, Math.max(1, Number(query.per_page ?? query.perPage) || 50));
  const rpCol = getCollection(ROLE_PERMISSIONS_COLLECTION);
  const total = await rpCol.countDocuments({ role_id: role.id });
  const rows = await rpCol
    .find({ role_id: role.id })
    .sort({ permission_id: 1 })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .toArray();
  const permDocs = await getCollection(PERMISSIONS_COLLECTION)
    .find({ id: { $in: rows.map((r) => r.permission_id) } })
    .toArray();
  const byId = new Map(permDocs.map((d) => [d.id, d]));
  return {
    role: { id: role.seq ?? null, slug: role.key, ...roleIdentity(role) },
    data: rows.map((r) => rolePermissionRow(role, r, byId.get(r.permission_id))),
    total,
    page,
    perPage,
  };
}

/** POST /api/rolePermissions — gán thêm quyền (đã có thì bỏ qua, không trùng). */
export async function grantRolePermissions(ref, permissionIds) {
  const role = await resolveRoleRef(ref);
  if (!role) throw httpError("Không tìm thấy vai trò", 404);
  const docs = await validatePermissionIds(permissionIds);
  if (!isRoleMigrated(role)) await migrateRolePermissions(role);
  const rpCol = getCollection(ROLE_PERMISSIONS_COLLECTION);
  const existing = new Set(
    (await rpCol.find({ role_id: role.id }, { projection: { permission_id: 1 } }).toArray()).map((r) => r.permission_id)
  );
  const now = new Date().toISOString();
  const toAdd = docs.filter((d) => !existing.has(d.id));
  if (toAdd.length) {
    try {
      await rpCol.insertMany(toAdd.map((d) => ({
        id: uid("rp"), role_id: role.id, permission_id: d.id,
        role_key: role.key, permission_slug: d.slug, createdAt: now,
      })), { ordered: false });
    } catch (e) {
      if (e?.code !== 11000 && !/duplicate key/i.test(String(e?.message || ""))) throw e;
    }
  }
  invalidateRolePermissions(role.key);
  const total = await rpCol.countDocuments({ role_id: role.id });
  return { role_id: role.seq ?? null, role_slug: role.key, added: toAdd.length, total_permissions: total };
}

/** PUT /api/rolePermissions/:roleId — đồng bộ TOÀN BỘ tập quyền của vai trò. */
export async function syncRolePermissions(ref, permissionIds) {
  const role = await resolveRoleRef(ref);
  if (!role) throw httpError("Không tìm thấy vai trò", 404);
  const docs = await validatePermissionIds(permissionIds);
  const before = new Set(
    (await getCollection(ROLE_PERMISSIONS_COLLECTION)
      .find({ role_id: role.id }, { projection: { permission_id: 1 } }).toArray()).map((r) => r.permission_id)
  );
  const slugs = await setRolePermissions(role, docs.map((d) => d.slug));
  const after = new Set(
    (await getCollection(ROLE_PERMISSIONS_COLLECTION)
      .find({ role_id: role.id }, { projection: { permission_id: 1 } }).toArray()).map((r) => r.permission_id)
  );
  const added = [...after].filter((id) => !before.has(id)).length;
  const removed = [...before].filter((id) => !after.has(id)).length;
  return { role_id: role.seq ?? null, role_slug: role.key, added, removed, total_permissions: slugs.length };
}

/**
 * DELETE /api/rolePermissions — thu hồi quyền. Quyền cơ bản
 * (BASE_PERMISSIONS) không thu hồi được (mọi vai trò đều phải có, đúng
 * bất biến cũ) — chúng bị bỏ qua và báo ở `skipped_base`.
 */
export async function revokeRolePermissions(ref, permissionIds) {
  const role = await resolveRoleRef(ref);
  if (!role) throw httpError("Không tìm thấy vai trò", 404);
  const docs = await validatePermissionIds(permissionIds);
  const baseIds = new Set(
    (await getCollection(PERMISSIONS_COLLECTION)
      .find({ slug: { $in: BASE_PERMISSIONS } }, { projection: { id: 1 } }).toArray()).map((d) => d.id)
  );
  const revocable = docs.filter((d) => !baseIds.has(d.id));
  const skippedBase = docs.length - revocable.length;
  let removed = 0;
  if (revocable.length) {
    const r = await getCollection(ROLE_PERMISSIONS_COLLECTION).deleteMany({
      role_id: role.id,
      permission_id: { $in: revocable.map((d) => d.id) },
    });
    removed = r.deletedCount || 0;
  }
  invalidateRolePermissions(role.key);
  const total = await getCollection(ROLE_PERMISSIONS_COLLECTION).countDocuments({ role_id: role.id });
  return { role_id: role.seq ?? null, role_slug: role.key, removed, skipped_base: skippedBase, total_permissions: total };
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

/** Meta tĩnh theo slug (nhãn mô-đun, cờ quyền cơ bản) để bổ sung vào bản ghi catalog đọc từ DB. */
const CATALOG_META_BY_SLUG = new Map(PERMISSION_CATALOG.map((p) => [p.slug, p]));

function fmtDateTime(value) {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

import { escapeRegex } from "../utils/escapeRegex.js";

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
  const data = docs.map((d) => {
    const meta = CATALOG_META_BY_SLUG.get(d.slug) || {};
    return {
      id: d.id, slug: d.slug, name_vi: d.name_vi, name_en: d.name_en, module: d.module,
      // Field phụ cho UI (nhãn mô-đun + cờ quyền cơ bản) — lấy từ khai báo
      // catalog tĩnh, không đổi shape phẳng cốt lõi của bản ghi.
      module_vi: meta.module_vi || d.module,
      module_en: meta.module_en || d.module,
      is_base: !!meta.is_base,
      created_at: fmtDateTime(d.createdAt), updated_at: fmtDateTime(d.updatedAt || d.createdAt),
    };
  });
  return { data, total, page, perPage };
}

const ROLE_SORT_FIELDS = {
  id: "seq", slug: "key", name_vi: "label", name_en: "name_en",
  created_at: "createdAt", updated_at: "updatedAt",
};

export async function listRolesPaged(query = {}) {
  await ensureRolePermissionsMigrated();
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
  const slugMap = await loadRolePermissionSlugs(rows);
  const data = rows.slice((page - 1) * perPage, page * perPage).map((d) => ({
    id: d.seq,
    slug: d.key,
    name_vi: d.name_vi || d.label,
    name_en: d.name_en || d.label,
    created_at: fmtDateTime(d.createdAt),
    updated_at: fmtDateTime(d.updatedAt || d.createdAt),
    // Số quyền thật = số bản ghi role_permissions của vai trò.
    total_permissions: (slugMap.get(d.id) || []).length,
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

export { PERMISSION_CATALOG, matrixToPermissions };
