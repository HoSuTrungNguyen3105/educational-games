// Mô hình phân quyền trung tâm — dùng chung cho:
//  - Frontend: guard route, sidebar (hasPermission / canAccessDashboard)
//  - Backend API: seed collection `roles`, ma trận quyền /api/permissions/*
// Khi đổi quyền ở đây, bump ROLES_SEED_VERSION để API seed lại dữ liệu cũ.

// Cột của ma trận quyền trong API (GET /api/permissions/features).
// Mỗi trang quản trị có 3 ô riêng: xem / sửa / xóa.
export const FEATURES = [
  { key: "games", label: "Trò chơi", name_en: "Games", permissions: { view: "games.view", edit: "games.edit", delete: "games.delete" } },
  { key: "game_config", label: "Cấu hình game", name_en: "Game config", permissions: { view: "game_config.view", edit: "game_config.edit", delete: "game_config.delete" } },
  { key: "questions", label: "Câu hỏi", name_en: "Questions", permissions: { view: "questions.view", edit: "questions.edit", delete: "questions.delete" } },
  { key: "question_bank", label: "Ngân hàng câu hỏi", name_en: "Question bank", permissions: { view: "question_bank.view", edit: "question_bank.edit", delete: "question_bank.delete" } },
  { key: "subjects", label: "Môn học", name_en: "Subjects", permissions: { view: "subjects.view", edit: "subjects.edit", delete: "subjects.delete" } },
  { key: "categories", label: "Danh mục", name_en: "Categories", permissions: { view: "categories.view", edit: "categories.edit", delete: "categories.delete" } },
  { key: "templates", label: "Templates", name_en: "Templates", permissions: { view: "templates.view", edit: "templates.edit", delete: "templates.delete" } },
  { key: "users", label: "Người dùng", name_en: "Users", permissions: { view: "users.view", edit: "users.edit", delete: "users.delete" } },
  { key: "roles", label: "Phân quyền", name_en: "Roles", permissions: { view: "roles.view", edit: "roles.edit", delete: "roles.delete" } },
  { key: "classes", label: "Lớp học", name_en: "Classes", permissions: { view: "classes.view", edit: "classes.edit", delete: "classes.delete" } },
  { key: "assignments", label: "Bài tập", name_en: "Assignments", permissions: { view: "assignments.view", edit: "assignments.edit", delete: "assignments.delete" } },
  { key: "reports", label: "Báo cáo & thống kê", name_en: "Reports & statistics", permissions: { view: "reports.view", edit: "reports.edit", delete: "reports.delete" } },
  { key: "coins", label: "Coin & Progress", name_en: "Coins & progress", permissions: { view: "coins.view", edit: "coins.edit", delete: "coins.delete" } },
  { key: "daily_tasks", label: "Nhiệm vụ ngày", name_en: "Daily tasks", permissions: { view: "daily_tasks.view", edit: "daily_tasks.edit", delete: "daily_tasks.delete" } },
  { key: "reminders", label: "Nhắc nhở", name_en: "Reminders", permissions: { view: "reminders.view", edit: "reminders.edit", delete: "reminders.delete" } },
  { key: "chat", label: "Tin nhắn", name_en: "Messages", permissions: { view: "chat.view", edit: "chat.edit", delete: "chat.delete" } },
  { key: "attendance", label: "Chấm công", name_en: "Attendance", permissions: { view: "attendance.view", edit: "attendance.edit", delete: "attendance.delete" } },
  { key: "images", label: "Thư viện ảnh", name_en: "Image library", permissions: { view: "images.view", edit: "images.edit", delete: "images.delete" } },
  { key: "upload_items", label: "Trích xuất Items", name_en: "Item extraction", permissions: { view: "upload_items.view", edit: "upload_items.edit", delete: "upload_items.delete" } },
  { key: "avatar_items", label: "Avatar Items", name_en: "Avatar items", permissions: { view: "avatar_items.view", edit: "avatar_items.edit", delete: "avatar_items.delete" } },
  { key: "avatar_templates", label: "Avatar Template", name_en: "Avatar templates", permissions: { view: "avatar_templates.view", edit: "avatar_templates.edit", delete: "avatar_templates.delete" } },
  { key: "pet_catalog", label: "Danh mục Pet", name_en: "Pet catalog", permissions: { view: "pet_catalog.view", edit: "pet_catalog.edit", delete: "pet_catalog.delete" } },
  { key: "body_custom", label: "Thân Avatar", name_en: "Avatar bodies", permissions: { view: "body_custom.view", edit: "body_custom.edit", delete: "body_custom.delete" } },
  { key: "plant_types", label: "Loại cây (Garden)", name_en: "Garden plant types", permissions: { view: "plant_types.view", edit: "plant_types.edit", delete: "plant_types.delete" } },
  { key: "support", label: "Hỗ trợ", name_en: "Support", permissions: { view: "support.view", edit: "support.edit", delete: "support.delete" } },
  { key: "settings", label: "Cài đặt hệ thống", name_en: "System settings", permissions: { view: "settings.view", edit: "settings.edit", delete: "settings.delete" } },
];

// Quyền "_all" — TOÀN QUYỀN trên một mô-đun (xem hết của mọi người, không bị
// lọc theo lớp/người được gán). Chỉ admin tổng được seed sẵn; teacher KHÔNG có.
// Không nằm trong ma trận view/edit/delete nên role lưu ở field `extraPermissions`
// và API merge vào mảng `permissions` khi trả về (GET /auth/me, /api/permissions/*).
export const ALL_ACCESS_PERMISSIONS = FEATURES.map((f) => `${f.key}_all`);

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

export const PERMISSION_ACTIONS = {
  view: { name_vi: "Xem", name_en: "View" },
  edit: { name_vi: "Sửa", name_en: "Edit" },
  delete: { name_vi: "Xóa", name_en: "Delete" },
};

// Các quyền cơ bản không nằm trong ma trận FEATURES nhưng vẫn cần hiển thị
// trong danh sách quyền của vai trò.
export const BASE_PERMISSION_META = {
  chat: { name_vi: "Tin nhắn", name_en: "Messages", module: "chat", module_vi: "Tin nhắn", module_en: "Messages" },
  profile: { name_vi: "Hồ sơ cá nhân", name_en: "Profile", module: "profile", module_vi: "Hồ sơ", module_en: "Profile" },
  friends: { name_vi: "Bạn bè", name_en: "Friends", module: "friends", module_vi: "Bạn bè", module_en: "Friends" },
  "daily-tasks": { name_vi: "Nhiệm vụ ngày", name_en: "Daily tasks", module: "daily_tasks", module_vi: "Nhiệm vụ ngày", module_en: "Daily tasks" },
};

// Danh mục phẳng để API / UI hiển thị đúng cấu trúc:
// quyền hạn · tên VI · tên EN · mô-đun.
export const PERMISSION_CATALOG = (() => {
  const items = [];
  for (const feature of FEATURES) {
    for (const [action, slug] of Object.entries(feature.permissions)) {
      const actionMeta = PERMISSION_ACTIONS[action] || { name_vi: action, name_en: action };
      items.push({
        id: slug,
        slug,
        name_vi: `${feature.label} - ${actionMeta.name_vi}`,
        name_en: `${feature.name_en || feature.label} - ${actionMeta.name_en}`,
        module: feature.key,
        module_vi: feature.label,
        module_en: feature.name_en || feature.label,
        feature_key: feature.key,
        action,
        is_base: BASE_PERMISSIONS.includes(slug),
      });
    }
  }

  // Quyền `_all` cũng là một quyền thật (có trong GET /api/permissions) nhưng
  // không có ô ma trận — feature_key/action = null, UI lọc riêng khi lưu.
  for (const feature of FEATURES) {
    const slug = `${feature.key}_all`;
    items.push({
      id: slug,
      slug,
      name_vi: `${feature.label} - Toàn quyền`,
      name_en: `${feature.name_en || feature.label} - Full access`,
      module: feature.key,
      module_vi: feature.label,
      module_en: feature.name_en || feature.label,
      feature_key: null,
      action: null,
      is_base: false,
      is_all: true,
    });
  }

  for (const [slug, meta] of Object.entries(BASE_PERMISSION_META)) {
    if (items.some((item) => item.slug === slug)) continue;
    items.push({
      id: slug,
      slug,
      name_vi: meta.name_vi,
      name_en: meta.name_en,
      module: meta.module || slug,
      module_vi: meta.module_vi || meta.name_vi,
      module_en: meta.module_en || meta.name_en,
      feature_key: null,
      action: null,
      is_base: true,
    });
  }

  return items;
})();

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
export const ALL_PERMISSIONS = [...new Set([...Object.keys(CELL_BY_PERMISSION), ...BASE_PERMISSIONS, ...ALL_ACCESS_PERMISSIONS])];

// Đổi khi muốn API seed lại built-in roles (xem ensureSeeded trong permissionService)
// v4: thêm vai trò `parent` (phụ huynh) cho đợt 3.
export const ROLES_SEED_VERSION = 4;

export const ROLES = {
  admin: {
    label: "Quản trị",
    name_en: "Super Admin",
    description: "Toàn quyền hệ thống",
    dashboardAccess: true,
    permissions: [...ALL_PERMISSIONS],
  },
  teacher: {
    label: "Giáo viên",
    name_en: "Teacher",
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
      // hỗ trợ: GV chỉ xem/trả lời ticket được gán cho lớp mình — KHÔNG có support_all
      "support.view",
      "support.edit",
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
    name_en: "Student",
    description: "Chơi game & học tập",
    dashboardAccess: false,
    permissions: ["games.play", "chat", "profile", "friends", "coins.view", "daily-tasks"],
  },
  // Phụ huynh: KHÔNG vào dashboard, không chơi game — chỉ xem báo cáo học tập
  // của con đã liên kết bằng mã (xem /api/parents). Quyền tĩnh ở đây là phương án
  // dự phòng khi collection `roles` chưa seed; khi đã seed, quyền thực tế lấy từ
  // ma trận (mọi vai trò đều có BASE_PERMISSIONS như các vai trò khác).
  parent: {
    label: "Phụ huynh",
    name_en: "Parent",
    description: "Xem báo cáo học tập của con",
    dashboardAccess: false,
    permissions: ["profile", "chat"],
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

/**
 * Kiểm quyền của ĐÚNG tài khoản đang đăng nhập thay vì bảng tĩnh theo vai trò.
 *
 * GET /api/auth/me trả `permissions` đọc từ collection `roles`, nên ô admin
 * bật/tắt ở trang Phân quyền có hiệu lực ngay — đó cũng chính là mảng mà API
 * đối chiếu ở middleware quyền phía server. Tài khoản chưa tải profile (hoặc
 * response cũ không có field) thì rơi về bảng tĩnh `hasPermission(role, ...)`.
 */
export function hasUserPermission(user, permission) {
  if (!user) return false;
  if (Array.isArray(user.permissions)) {
    if (user.permissions.includes("*")) return true;
    return user.permissions.includes(permission);
  }
  return hasPermission(user.role, permission);
}

export function canAccessDashboard(role) {
  return ROLES[role]?.dashboardAccess ?? false;
}

export function getRoleLabel(role) {
  return ROLES[role]?.label ?? role;
}

/** Thông tin định danh vai trò theo cấu trúc API: slug · tên VI · tên EN. */
export function getRoleIdentity(role) {
  const key = String(role || "").trim();
  if (!key) return null;
  const info = ROLES[key];
  return {
    slug: key,
    name_vi: info?.label || key,
    name_en: info?.name_en || info?.label || key,
  };
}
