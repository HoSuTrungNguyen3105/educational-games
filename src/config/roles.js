// Mô hình phân quyền trung tâm — dùng chung cho:
//  - Frontend: guard route, sidebar (hasPermission / canAccessDashboard)
//  - Backend API: seed collection `roles`, ma trận quyền /api/permissions/*
// Khi đổi quyền ở đây, bump ROLES_SEED_VERSION để API seed lại dữ liệu cũ.

// Metadata các mô-đun (nhóm chức năng) của hệ thống phân quyền.
// CHỈ còn là metadata nhãn — KHÔNG còn object `permissions: {view, edit,
// delete}`: từ đợt refactor Role & Permission, mỗi quyền là MỘT bản ghi
// khai báo riêng trong PERMISSION_CATALOG (cấu trúc phẳng), và gán quyền
// cho vai trò đi qua collection `role_permissions` (xem permissionService).
export const FEATURES = [
  { key: "games", label: "Trò chơi", name_en: "Games" },
  { key: "game_config", label: "Cấu hình game", name_en: "Game config" },
  { key: "questions", label: "Câu hỏi", name_en: "Questions" },
  { key: "question_bank", label: "Ngân hàng câu hỏi", name_en: "Question bank" },
  { key: "subjects", label: "Môn học", name_en: "Subjects" },
  { key: "categories", label: "Danh mục", name_en: "Categories" },
  { key: "templates", label: "Templates", name_en: "Templates" },
  { key: "users", label: "Người dùng", name_en: "Users" },
  { key: "roles", label: "Phân quyền", name_en: "Roles" },
  { key: "classes", label: "Lớp học", name_en: "Classes" },
  { key: "assignments", label: "Bài tập", name_en: "Assignments" },
  { key: "reports", label: "Báo cáo & thống kê", name_en: "Reports & statistics" },
  { key: "coins", label: "Coin & Progress", name_en: "Coins & progress" },
  { key: "daily_tasks", label: "Nhiệm vụ ngày", name_en: "Daily tasks" },
  { key: "events", label: "Sự kiện theo mùa", name_en: "Seasonal events" },
  { key: "reminders", label: "Nhắc nhở", name_en: "Reminders" },
  { key: "chat", label: "Tin nhắn", name_en: "Messages" },
  { key: "attendance", label: "Chấm công", name_en: "Attendance" },
  { key: "images", label: "Thư viện ảnh", name_en: "Image library" },
  { key: "upload_items", label: "Trích xuất Items", name_en: "Item extraction" },
  { key: "avatar_items", label: "Avatar Items", name_en: "Avatar items" },
  { key: "avatar_templates", label: "Avatar Template", name_en: "Avatar templates" },
  { key: "pet_catalog", label: "Danh mục Pet", name_en: "Pet catalog" },
  { key: "body_custom", label: "Thân Avatar", name_en: "Avatar bodies" },
  { key: "plant_types", label: "Loại cây (Garden)", name_en: "Garden plant types" },
  { key: "support", label: "Hỗ trợ", name_en: "Support" },
  { key: "settings", label: "Cài đặt hệ thống", name_en: "System settings" },
];

/** Tra metadata mô-đun theo key: { key, label (VI), name_en }. */
export const MODULE_META = Object.fromEntries(FEATURES.map((f) => [f.key, f]));

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
  "events.manage": ["events", "edit"],
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

// Nhãn riêng cho các quyền NGOÀI bộ ba xem/sửa/xóa của mô-đun — các quyền
// kiểu cũ mà middleware/route vẫn kiểm tra trực tiếp (alias `*.manage`,
// `games.play`, `attendance.checkin`, `setup.manage`). Từ đợt refactor,
// mỗi quyền này cũng là MỘT bản ghi khai báo riêng trong catalog (trước
// đây chúng chỉ tồn tại ngầm trong mảng quyền hiệu lực, không có bản ghi).
export const LEGACY_PERMISSION_META = {
  "games.play": { name_vi: "Trò chơi - Chơi game", name_en: "Games - Play", module: "games" },
  "games.manage": { name_vi: "Trò chơi - Quản lý", name_en: "Games - Manage", module: "games" },
  "game-config.manage": { name_vi: "Cấu hình game - Quản lý", name_en: "Game config - Manage", module: "game_config" },
  "questions.manage": { name_vi: "Câu hỏi - Quản lý", name_en: "Questions - Manage", module: "questions" },
  "question-bank.manage": { name_vi: "Ngân hàng câu hỏi - Quản lý", name_en: "Question bank - Manage", module: "question_bank" },
  "subjects.manage": { name_vi: "Môn học - Quản lý", name_en: "Subjects - Manage", module: "subjects" },
  "categories.manage": { name_vi: "Danh mục - Quản lý", name_en: "Categories - Manage", module: "categories" },
  "templates.manage": { name_vi: "Templates - Quản lý", name_en: "Templates - Manage", module: "templates" },
  "users.manage": { name_vi: "Người dùng - Quản lý", name_en: "Users - Manage", module: "users" },
  "roles.manage": { name_vi: "Phân quyền - Quản lý", name_en: "Roles - Manage", module: "roles" },
  "classes.manage": { name_vi: "Lớp học - Quản lý", name_en: "Classes - Manage", module: "classes" },
  "assignments.manage": { name_vi: "Bài tập - Quản lý", name_en: "Assignments - Manage", module: "assignments" },
  "reports.manage": { name_vi: "Báo cáo & thống kê - Quản lý", name_en: "Reports & statistics - Manage", module: "reports" },
  "coins.manage": { name_vi: "Coin & Progress - Quản lý", name_en: "Coins & progress - Manage", module: "coins" },
  "daily-tasks.manage": { name_vi: "Nhiệm vụ ngày - Quản lý", name_en: "Daily tasks - Manage", module: "daily_tasks" },
  "events.manage": { name_vi: "Sự kiện theo mùa - Quản lý", name_en: "Seasonal events - Manage", module: "events" },
  "reminders.manage": { name_vi: "Nhắc nhở - Quản lý", name_en: "Reminders - Manage", module: "reminders" },
  "images.manage": { name_vi: "Thư viện ảnh - Quản lý", name_en: "Image library - Manage", module: "images" },
  "upload-items.manage": { name_vi: "Trích xuất Items - Quản lý", name_en: "Item extraction - Manage", module: "upload_items" },
  "avatar-items.manage": { name_vi: "Avatar Items - Quản lý", name_en: "Avatar items - Manage", module: "avatar_items" },
  "avatar-templates.manage": { name_vi: "Avatar Template - Quản lý", name_en: "Avatar templates - Manage", module: "avatar_templates" },
  "pet-catalog.manage": { name_vi: "Danh mục Pet - Quản lý", name_en: "Pet catalog - Manage", module: "pet_catalog" },
  "body-custom.manage": { name_vi: "Thân Avatar - Quản lý", name_en: "Avatar bodies - Manage", module: "body_custom" },
  "plant-types.manage": { name_vi: "Loại cây (Garden) - Quản lý", name_en: "Garden plant types - Manage", module: "plant_types" },
  "setup.manage": { name_vi: "Cài đặt hệ thống - Quản lý", name_en: "System settings - Manage", module: "settings" },
  "attendance.checkin": { name_vi: "Chấm công - Điểm danh", name_en: "Attendance - Check in", module: "attendance" },
};

// Danh mục phẳng để API / UI hiển thị đúng cấu trúc:
// quyền hạn · tên VI · tên EN · mô-đun. Mỗi quyền là một bản ghi riêng —
// bộ ba xem/sửa/xóa của một mô-đun là BA bản ghi độc lập (không còn
// object permissions {view, edit, delete} ở bất kỳ đâu).
export const PERMISSION_CATALOG = (() => {
  const items = [];
  for (const feature of FEATURES) {
    for (const action of ["view", "edit", "delete"]) {
      const slug = `${feature.key}.${action}`;
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

  // Quyền kiểu cũ (alias) — mỗi slug một bản ghi riêng như mọi quyền khác.
  for (const [slug, meta] of Object.entries(LEGACY_PERMISSION_META)) {
    if (items.some((item) => item.slug === slug)) continue;
    const feature = MODULE_META[meta.module];
    items.push({
      id: slug,
      slug,
      name_vi: meta.name_vi,
      name_en: meta.name_en,
      module: meta.module,
      module_vi: feature?.label || meta.name_vi,
      module_en: feature?.name_en || meta.name_en,
      feature_key: null,
      action: null,
      is_base: BASE_PERMISSIONS.includes(slug),
      is_alias: true,
    });
  }

  return items;
})();

/** Slug quyền của một ô (mô-đun, hành động) — tra trong catalog phẳng. */
export function featurePermissionSlug(featureKey, action) {
  return `${featureKey}.${action}`;
}

// permission string -> [featureKey, action]
const CELL_BY_PERMISSION = (() => {
  const map = {};
  for (const item of PERMISSION_CATALOG) {
    if (item.feature_key && item.action) map[item.slug] = [item.feature_key, item.action];
  }
  for (const [perm, cell] of Object.entries(LEGACY_CELLS)) map[perm] = cell;
  return map;
})();

// Danh sách toàn bộ quyền hợp lệ (dùng cho API validation / seed)
export const ALL_PERMISSIONS = [...new Set([...Object.keys(CELL_BY_PERMISSION), ...BASE_PERMISSIONS, ...ALL_ACCESS_PERMISSIONS])];

// Đổi khi muốn API seed lại built-in roles (xem ensureSeeded trong permissionService)
// v4: thêm vai trò `parent` (phụ huynh) cho đợt 3.
// v5: thêm feature `events` (Sự kiện theo mùa) — admin (toàn quyền) có
// sẵn events.*, giáo viên/học sinh mặc định không có ô nào của feature này.
export const ROLES_SEED_VERSION = 5;

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
    if (m.view) perms.push(featurePermissionSlug(f.key, "view"));
    if (m.edit) perms.push(featurePermissionSlug(f.key, "edit"));
    if (m.delete) perms.push(featurePermissionSlug(f.key, "delete"));
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
  if (matrix?.events?.edit) perms.push("events.manage");
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
