import { useEffect, useState } from 'react'

// ─── Route Table ───────────────────────────────────────────────
// Thêm/sửa/xóa route ở đây — parseRoute tự động match.
// Pattern hỗ trợ: "/prefix", "/prefix/:param", "/prefix/:param1/:param2"
const ROUTES = [
  // ── Student ──
  { name: "student",       pattern: "/play/:gameId" },
  { name: "student-join",  pattern: "/play" },

  // ── Teacher / Admin ──
  { name: "admin-dashboard", pattern: "/admin" },
  { name: "admin-library",   pattern: "/admin/library" },
  { name: "admin-users",     pattern: "/admin/users" },
  { name: "admin-templates", pattern: "/admin/templates" },
  { name: "admin-categories", pattern: "/admin/categories" },
  { name: "admin-subjects",  pattern: "/admin/subjects" },
  { name: "admin-create",    pattern: "/admin/create" },
  { name: "admin-edit",      pattern: "/admin/edit/:gameId" },
  { name: "admin-builder",   pattern: "/admin/builder/:gameId" },
  { name: "admin-results",   pattern: "/admin/results/:gameId" },

  // ── User / Social ──
  { name: "chat",         pattern: "/chat" },
  { name: "profile",      pattern: "/profile" },
  { name: "find-friends", pattern: "/find-friends" },

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

  // Hỗ trợ đường dẫn cũ /admin (không hash)
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
}

// ─── useRoute Hook ─────────────────────────────────────────────
// Trả về { name, params } — dùng route.name để match, route.params.gameId để lấy param
export function useRoute() {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const onChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);
  return route;
}
