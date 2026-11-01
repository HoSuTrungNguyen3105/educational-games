import { useEffect, useState } from 'react'

// ─── Route Table ───────────────────────────────────────────────
// Thêm/sửa/xóa route ở đây — parseRoute tự động match.
// Pattern hỗ trợ: "/prefix", "/prefix/:param", "/prefix/:param1/:param2"
const ROUTES = [
  // ── Student ──
  { name: "student",       pattern: "/play/:gameId" },
  { name: "student-join",  pattern: "/play" },

  // ── Teacher / Admin ──
  { name: "admin-dashboard", pattern: "/dashboard" },
  { name: "admin-library",   pattern: "/dashboard/library" },
  { name: "admin-users",     pattern: "/dashboard/users" },
  { name: "admin-roles",     pattern: "/dashboard/roles" },
  { name: "admin-roles-matrix", pattern: "/dashboard/roles-matrix" },
  { name: "admin-permissions", pattern: "/dashboard/permissions" },
  { name: "admin-templates", pattern: "/dashboard/templates" },
  { name: "admin-game-config", pattern: "/dashboard/game-config" },
  // Cấu hình JSON riêng của game offline Vườn Thủ Hộ (plantvsanimal.html)
  { name: "admin-vth-config", pattern: "/dashboard/vth-config" },
  // Cài đặt khu quản trị: đổi mật khẩu thật qua API + dữ liệu cục bộ
  { name: "admin-settings", pattern: "/dashboard/settings" },
  // Ticket hỗ trợ người dùng (nút "Hỗ trợ" ở trang chủ gửi vào đây)
  { name: "admin-support", pattern: "/dashboard/support" },
  // Ticket được gán cho giáo viên phụ trách lớp (GET /api/support/tickets/assigned)
  { name: "admin-teacher-support", pattern: "/teacher-support" },
  { name: "admin-template-new", pattern: "/dashboard/templates/new" },
  { name: "admin-template-edit", pattern: "/dashboard/templates/:templateId" },
  { name: "admin-categories", pattern: "/dashboard/categories" },
  { name: "admin-subjects",  pattern: "/dashboard/subjects" },
  { name: "admin-questions", pattern: "/dashboard/questions" },
  { name: "admin-all-questions", pattern: "/dashboard/all-questions" }, // legacy redirect → /dashboard/questions
  { name: "admin-question-bank", pattern: "/dashboard/question-bank" },
  { name: "admin-create",    pattern: "/dashboard/create" },
  { name: "admin-edit",      pattern: "/dashboard/edit/:gameId" },
  { name: "admin-results",   pattern: "/dashboard/results/:gameId" },
  { name: "admin-coins",     pattern: "/dashboard/coins" },
  { name: "admin-daily-tasks", pattern: "/dashboard/daily-tasks" },
  { name: "admin-classes", pattern: "/dashboard/classes" },
  { name: "admin-class-students", pattern: "/dashboard/classes/:classId/students" },
  { name: "admin-assignments", pattern: "/dashboard/assignments" },
  { name: "admin-assignment-new", pattern: "/dashboard/assignments/new" },
  { name: "admin-assignment-edit", pattern: "/dashboard/assignments/:assignmentId/edit" },
  { name: "admin-assignment-detail", pattern: "/dashboard/assignments/:assignmentId" },
  { name: "admin-avatar-items", pattern: "/dashboard/avatar-items" },
  { name: "admin-avatar-template", pattern: "/dashboard/avatar-template" },
  { name: "admin-pet-catalog", pattern: "/dashboard/pet-catalog" },
  { name: "admin-plant-types", pattern: "/dashboard/plant-types" },
  { name: "admin-body-custom", pattern: "/dashboard/body-custom" },
  { name: "admin-images", pattern: "/dashboard/images" },
  { name: "admin-upload-items", pattern: "/dashboard/upload-items" },
  { name: "admin-chat", pattern: "/dashboard/chat" },
  { name: "admin-ai-analysis", pattern: "/dashboard/ai-analysis" },
  { name: "admin-reminders", pattern: "/dashboard/reminders" },
  { name: "admin-profile", pattern: "/dashboard/profile" },

  // ── User / Social ──
  { name: "chat",         pattern: "/chat" },
  { name: "profile",      pattern: "/profile" },
  { name: "pet",          pattern: "/pet" },
  { name: "pet-wardrobe", pattern: "/pet-wardrobe" },
  { name: "find-friends", pattern: "/find-friends" },
  { name: "my-coins",     pattern: "/my-coins" },
  { name: "daily-tasks",  pattern: "/daily-tasks" },
  { name: "spin-wheel",   pattern: "/spin-wheel" },
  { name: "inventory",    pattern: "/inventory" },
  { name: "store",        pattern: "/store" },
  { name: "leaderboard",  pattern: "/leaderboard" },
  { name: "achievements", pattern: "/achievements" },
  { name: "reminders",    pattern: "/reminders" },
  { name: "attendance",   pattern: "/attendance" },
  { name: "ai-learning",  pattern: "/ai-learning" },
  { name: "assignment-join", pattern: "/assignment" },
  { name: "assignment-take", pattern: "/assignment/:code" },
  { name: "math-adventure", pattern: "/math-adventure" },
  // Game nhập vai trường học (src/games/school_mission/School_mission.html)
  { name: "school-mission", pattern: "/school-mission" },
  // Game offline thư giãn, mỗi game 1 file HTML → /offline/<gameId>
  { name: "offline-game", pattern: "/offline/:gameId" },

  // ── Home (fallback) ──
  { name: "home", pattern: "/" },
];

// ─── Pattern Parser ────────────────────────────────────────────
// Biến "/play/:gameId" thành RegExp + danh sách param names
function compilePattern(pattern) {
  const paramNames = [];
  const regexStr = pattern
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    })
    .replace(/\/+$/, "");  // bỏ trailing slash

  return { regex: new RegExp(`^${regexStr}$`), paramNames };
}

// Compile một lần — không parse lại mỗi request
const COMPILED_ROUTES = ROUTES.map(({ name, pattern }) => ({
  name,
  ...compilePattern(pattern),
}));

// ─── Parse Route ───────────────────────────────────────────────
export function parseRoute() {
  const hash = (window.location.hash || "").replace(/^#/, "") || "/";
  const path = hash.split("?")[0].split("#")[0]; // bỏ query/hash nếu có

  // Đường dẫn cũ #/admin (nay là #/dashboard) — giữ cho link cũ không chết
  if (path === "/admin") {
    return { name: "admin-dashboard", params: {} };
  }

  for (const { name, regex, paramNames } of COMPILED_ROUTES) {
    const match = path.match(regex);
    if (match) {
      const params = {};
      paramNames.forEach((key, i) => { params[key] = match[i + 1]; });
      return { name, params };
    }
  }

  return { name: "home", params: {} };
}

// ─── Navigate ──────────────────────────────────────────────────
export function navigate(path) {
  const target = String(path).startsWith("#") ? String(path) : `#${String(path).replace(/^\/?/, "/")}`;
  if (window.location.hash !== target) window.location.hash = target;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ─── useRoute Hook ─────────────────────────────────────────────
// Trả về { name, params } — dùng route.name để match, route.params.gameId để lấy param
export function useRoute() {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);
  return route;
}
