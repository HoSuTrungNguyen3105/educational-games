// Mô hình phân quyền trung tâm — dùng chung cho:
//  - Frontend: guard route, sidebar (hasPermission / canAccessDashboard)
//  - Backend API: seed collection `roles`, ma trận quyền /api/permissions/*
// Khi đổi quyền ở đây, bump ROLES_SEED_VERSION để API seed lại dữ liệu cũ.

// Cột của ma trận quyền trong API (GET /api/permissions/features)
export const FEATURES = [
  { key: "games", label: "Trò chơi", permissions: { view: "games.view", edit: "games.edit", delete: "games.delete" } },
  { key: "content", label: "Môn học & câu hỏi", permissions: { view: "content.view", edit: "content.edit", delete: "content.delete" } },
  { key: "users", label: "Người dùng", permissions: { view: "users.view", edit: "users.edit", delete: "users.delete" } },
  { key: "reports", label: "Báo cáo & thống kê", permissions: { view: "reports.view", edit: "reports.edit", delete: "reports.delete" } },
  { key: "settings", label: "Cài đặt hệ thống", permissions: { view: "settings.view", edit: "settings.edit", delete: "settings.delete" } },
];

// Quyền kiểu cũ (sidebar / client cũ) map về ô của ma trận API.
// `*.manage` = sửa (edit) ô tương ứng — xoá (delete) là quyền riêng.
const LEGACY_CELLS = {
  "games.play": ["games", "view"],
  "games.manage": ["games", "edit"],
  "questions.manage": ["content", "edit"],
  "subjects.manage": ["content", "edit"],
  "categories.manage": ["content", "edit"],
  "templates.manage": ["content", "edit"],
  "users.manage": ["users", "edit"],
  "setup.manage": ["settings", "edit"],
  "coins.manage": ["settings", "edit"],
  "daily-tasks.manage": ["settings", "edit"],
};

// Quyền mặc định của mọi vai trò (chat, hồ sơ, chơi game...)
export const BASE_PERMISSIONS = ["chat", "profile", "friends", "coins.view", "daily-tasks"];

// permission string -> [featureKey, action]
const CELL_BY_PERMISSION = (() => {
  const map = {};
  for (const f of FEATURES) {
    for (const [action, perm] of Object.entries(f.permissions)) map[perm] = [f.key, action];
  }
  for (const [perm, cell] of Object.entries(LEGACY_CELLS)) map[perm] = cell;
  return map;
})();

// Danh sách toàn bộ quyền hợp lệ (dùng cho API validation / seed)
export const ALL_PERMISSIONS = [...new Set([...Object.keys(CELL_BY_PERMISSION), ...BASE_PERMISSIONS])];

// Đổi khi muốn API seed lại built-in roles (xem ensureSeeded trong permissionService)
export const ROLES_SEED_VERSION = 1;

export const ROLES = {
  admin: {
    label: "Quản trị",
    description: "Toàn quyền hệ thống",
    dashboardAccess: true,
    permissions: [...ALL_PERMISSIONS],
  },
  teacher: {
    label: "Giáo viên",
    description: "Quản lý nội dung, trò chơi & lớp học",
    dashboardAccess: true,
    permissions: [
      // trò chơi
      "games.view",
      "games.edit",
      "games.manage",
      "games.play",
      // nội dung
      "content.view",
      "content.edit",
      "questions.manage",
      "subjects.manage",
      "categories.manage",
      "templates.manage",
      // người dùng (chỉ xem — phân quyền do admin thực hiện)
      "users.view",
      // báo cáo
      "reports.view",
      // cài đặt: coin & nhiệm vụ ngày
      "settings.view",
      "settings.edit",
      "coins.manage",
      "daily-tasks.manage",
      "coins.view",
      "daily-tasks",
      // cơ bản
      "chat",
      "profile",
      "friends",
    ],
  },
  student: {
    label: "Học sinh",
    description: "Chơi game & học tập",
    dashboardAccess: false,
    permissions: ["games.play", "chat", "profile", "friends", "coins.view", "daily-tasks"],
  },
};

export const ROLE_KEYS = Object.keys(ROLES);

// Quyền -> ma trận API { feature: { view, edit, delete } }
export function permissionsToMatrix(permissions = []) {
  const matrix = {};
  for (const f of FEATURES) matrix[f.key] = { view: false, edit: false, delete: false };

  const list = permissions.includes("*") ? Object.keys(CELL_BY_PERMISSION) : permissions;
  for (const p of list) {
    const cell = CELL_BY_PERMISSION[p];
    if (cell) matrix[cell[0]][cell[1]] = true;
  }
  return matrix;
}

// Ma trận API -> mảng quyền (kèm alias kiểu cũ mà sidebar đang dùng)
export function matrixToPermissions(matrix = {}) {
  const perms = [];
  for (const f of FEATURES) {
    const m = matrix?.[f.key] || {};
    if (m.view) perms.push(f.permissions.view);
    if (m.edit) perms.push(f.permissions.edit);
    if (m.delete) perms.push(f.permissions.delete);
  }
  // Alias kiểu cũ (sidebar / client cũ)
  if (matrix?.games?.view || matrix?.games?.edit || matrix?.games?.delete) perms.push("games.play");
  if (matrix?.games?.edit) perms.push("games.manage");
  if (matrix?.content?.edit) {
    perms.push("questions.manage", "subjects.manage", "categories.manage", "templates.manage");
  }
  if (matrix?.users?.edit) perms.push("users.manage");
  if (matrix?.settings?.edit) perms.push("setup.manage", "coins.manage", "daily-tasks.manage");
  perms.push(...BASE_PERMISSIONS);
  return [...new Set(perms)];
}

export function hasPermission(role, permission) {
  const r = ROLES[role];
  if (!r) return false;
  if (r.permissions.includes("*")) return true;
  return r.permissions.includes(permission);
}

export function canAccessDashboard(role) {
  return ROLES[role]?.dashboardAccess ?? false;
}

export function getRoleLabel(role) {
  return ROLES[role]?.label ?? role;
}
