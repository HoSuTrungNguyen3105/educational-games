// Mô hình phân quyền trung tâm — dùng chung cho:
//  - Frontend: guard route, sidebar (hasPermission / canAccessDashboard)
//  - Backend API: seed collection `roles`, ma trận quyền /api/permissions/*
// Khi đổi quyền ở đây, bump ROLES_SEED_VERSION để API seed lại dữ liệu cũ.

// Cột của ma trận quyền trong API (GET /api/permissions/features).
// Mỗi trang quản trị có 3 ô riêng: xem / sửa / xóa.
export const FEATURES = [
  { key: "games", label: "Trò chơi", permissions: { view: "games.view", edit: "games.edit", delete: "games.delete" } },
  { key: "game_config", label: "Cấu hình game", permissions: { view: "game_config.view", edit: "game_config.edit", delete: "game_config.delete" } },
  { key: "questions", label: "Câu hỏi", permissions: { view: "questions.view", edit: "questions.edit", delete: "questions.delete" } },
  { key: "question_bank", label: "Ngân hàng câu hỏi", permissions: { view: "question_bank.view", edit: "question_bank.edit", delete: "question_bank.delete" } },
  { key: "subjects", label: "Môn học", permissions: { view: "subjects.view", edit: "subjects.edit", delete: "subjects.delete" } },
  { key: "categories", label: "Danh mục", permissions: { view: "categories.view", edit: "categories.edit", delete: "categories.delete" } },
  { key: "templates", label: "Templates", permissions: { view: "templates.view", edit: "templates.edit", delete: "templates.delete" } },
  { key: "users", label: "Người dùng", permissions: { view: "users.view", edit: "users.edit", delete: "users.delete" } },
  { key: "roles", label: "Phân quyền", permissions: { view: "roles.view", edit: "roles.edit", delete: "roles.delete" } },
  { key: "classes", label: "Lớp học", permissions: { view: "classes.view", edit: "classes.edit", delete: "classes.delete" } },
  { key: "assignments", label: "Bài tập", permissions: { view: "assignments.view", edit: "assignments.edit", delete: "assignments.delete" } },
  { key: "reports", label: "Báo cáo & thống kê", permissions: { view: "reports.view", edit: "reports.edit", delete: "reports.delete" } },
  { key: "coins", label: "Coin & Progress", permissions: { view: "coins.view", edit: "coins.edit", delete: "coins.delete" } },
  { key: "daily_tasks", label: "Nhiệm vụ ngày", permissions: { view: "daily_tasks.view", edit: "daily_tasks.edit", delete: "daily_tasks.delete" } },
  { key: "reminders", label: "Nhắc nhở", permissions: { view: "reminders.view", edit: "reminders.edit", delete: "reminders.delete" } },
  { key: "chat", label: "Tin nhắn", permissions: { view: "chat.view", edit: "chat.edit", delete: "chat.delete" } },
  { key: "attendance", label: "Chấm công", permissions: { view: "attendance.view", edit: "attendance.edit", delete: "attendance.delete" } },
  { key: "images", label: "Thư viện ảnh", permissions: { view: "images.view", edit: "images.edit", delete: "images.delete" } },
  { key: "upload_items", label: "Trích xuất Items", permissions: { view: "upload_items.view", edit: "upload_items.edit", delete: "upload_items.delete" } },
  { key: "avatar_items", label: "Avatar Items", permissions: { view: "avatar_items.view", edit: "avatar_items.edit", delete: "avatar_items.delete" } },
  { key: "avatar_templates", label: "Avatar Template", permissions: { view: "avatar_templates.view", edit: "avatar_templates.edit", delete: "avatar_templates.delete" } },
  { key: "pet_catalog", label: "Danh mục Pet", permissions: { view: "pet_catalog.view", edit: "pet_catalog.edit", delete: "pet_catalog.delete" } },
  { key: "body_custom", label: "Thân Avatar", permissions: { view: "body_custom.view", edit: "body_custom.edit", delete: "body_custom.delete" } },
  { key: "plant_types", label: "Loại cây (Garden)", permissions: { view: "plant_types.view", edit: "plant_types.edit", delete: "plant_types.delete" } },
  { key: "settings", label: "Cài đặt hệ thống", permissions: { view: "settings.view", edit: "settings.edit", delete: "settings.delete" } },
];

// Quyền kiểu cũ (sidebar / client cũ) map về ô của ma trận API.
// `*.manage` = sửa (edit) ô tương ứng — xoá (delete) là quyền riêng.
const LEGACY_CELLS = {
  "games.play": ["games", "view"],
  "games.manage": ["games", "edit"],
  "game-config.manage": ["game_config", "edit"],
  "questions.manage": ["questions", "edit"],
  "question-bank.manage": ["question_bank", "edit"],
  "subjects.manage": ["subjects", "edit"],
  "categories.manage": ["categories", "edit"],
  "templates.manage": ["templates", "edit"],
  "users.manage": ["users", "edit"],
  "roles.manage": ["roles", "edit"],
  "classes.manage": ["classes", "edit"],
  "assignments.manage": ["assignments", "edit"],
  "reports.manage": ["reports", "edit"],
  "coins.manage": ["coins", "edit"],
  "daily-tasks.manage": ["daily_tasks", "edit"],
  "daily-tasks": ["daily_tasks", "view"],
  "reminders.manage": ["reminders", "edit"],
  "chat": ["chat", "view"],
  "attendance.view": ["attendance", "view"],
  "attendance.checkin": ["attendance", "edit"],
  "images.manage": ["images", "edit"],
  "upload-items.manage": ["upload_items", "edit"],
  "avatar-items.manage": ["avatar_items", "edit"],
  "avatar-templates.manage": ["avatar_templates", "edit"],
  "pet-catalog.manage": ["pet_catalog", "edit"],
  "body-custom.manage": ["body_custom", "edit"],
  "plant-types.manage": ["plant_types", "edit"],
  "setup.manage": ["settings", "edit"],
};

// Quyền mặc định của mọi vai trò (chat, hồ sơ, chơi game...)
export const BASE_PERMISSIONS = ["chat", "profile", "friends", "coins.view", "daily-tasks", "attendance.view"];

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
export const ROLES_SEED_VERSION = 2;

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
      "game_config.view",
      "game_config.edit",
      // nội dung
      "questions.view",
      "questions.edit",
      "questions.manage",
      "question_bank.view",
      "question_bank.edit",
      "subjects.view",
      "subjects.edit",
      "subjects.manage",
      "categories.view",
      "categories.edit",
      "categories.manage",
      "templates.view",
      "templates.edit",
      "templates.manage",
      // người dùng / phân quyền (chỉ xem — admin thực hiện thay đổi)
      "users.view",
      "roles.view",
      // lớp học & bài tập
      "classes.view",
      "classes.edit",
      "assignments.view",
      "assignments.edit",
      // báo cáo
      "reports.view",
      // coin & nhiệm vụ ngày
      "coins.view",
      "coins.edit",
      "coins.manage",
      "daily_tasks.view",
      "daily_tasks.edit",
      "daily-tasks.manage",
      "daily-tasks",
      // nhắc nhở / chat
      "reminders.view",
      "reminders.edit",
      "chat",
      // chấm công
      "attendance.view",
      "attendance.checkin",
      // ảnh & avatar
      "images.view",
      "images.edit",
      "upload_items.view",
      "upload_items.edit",
      "avatar_items.view",
      "avatar_items.edit",
      "avatar_templates.view",
      "avatar_templates.edit",
      "pet_catalog.view",
      "pet_catalog.edit",
      "body_custom.view",
      "body_custom.edit",
      "plant_types.view",
      "plant_types.edit",
      // cài đặt
      "settings.view",
      "settings.edit",
      "setup.manage",
      // cơ bản
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
  if (matrix?.game_config?.edit) perms.push("game-config.manage");
  if (matrix?.questions?.edit) perms.push("questions.manage");
  if (matrix?.question_bank?.edit) perms.push("question-bank.manage");
  if (matrix?.subjects?.edit) perms.push("subjects.manage");
  if (matrix?.categories?.edit) perms.push("categories.manage");
  if (matrix?.templates?.edit) perms.push("templates.manage");
  if (matrix?.users?.edit) perms.push("users.manage");
  if (matrix?.roles?.edit) perms.push("roles.manage");
  if (matrix?.classes?.edit) perms.push("classes.manage");
  if (matrix?.assignments?.edit) perms.push("assignments.manage");
  if (matrix?.reports?.edit) perms.push("reports.manage");
  if (matrix?.coins?.edit) perms.push("coins.manage");
  if (matrix?.daily_tasks?.edit) perms.push("daily-tasks.manage");
  if (matrix?.daily_tasks?.view) perms.push("daily-tasks");
  if (matrix?.reminders?.edit) perms.push("reminders.manage");
  if (matrix?.attendance?.edit) perms.push("attendance.checkin");
  if (matrix?.images?.edit) perms.push("images.manage");
  if (matrix?.upload_items?.edit) perms.push("upload-items.manage");
  if (matrix?.avatar_items?.edit) perms.push("avatar-items.manage");
  if (matrix?.avatar_templates?.edit) perms.push("avatar-templates.manage");
  if (matrix?.pet_catalog?.edit) perms.push("pet-catalog.manage");
  if (matrix?.body_custom?.edit) perms.push("body-custom.manage");
  if (matrix?.plant_types?.edit) perms.push("plant-types.manage");
  if (matrix?.settings?.edit) perms.push("setup.manage");
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
