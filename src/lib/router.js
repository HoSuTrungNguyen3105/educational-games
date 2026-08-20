import { useEffect, useState } from 'react'

// Hash router đơn giản (an toàn cho GitHub Pages — không cần server rewrite).
// Các route:
//   #/                    → home
//   #/admin               → teacher dashboard
//   #/admin/library       → thư viện trò chơi
//   #/admin/users         → quản lý người dùng
//   #/admin/create        → tạo trò chơi mới
//   #/admin/edit/:id      → chỉnh sửa trò chơi
//   #/admin/builder/:id?  → Game Builder (id có thể rỗng = tạo mới)
//   #/admin/results/:id   → kết quả trò chơi
//   #/play                → học sinh chọn/join trò chơi
//   #/play/:id            → học sinh chơi trò chơi cụ thể

export function parseRoute() {
  const path = (window.location.pathname || "").toLowerCase().replace(/\/+$/, "");
  const hash = (window.location.hash || "").replace(/^#/, "") || "/";

  // Hỗ trợ đường dẫn cũ /admin (không hash)
  if (!hash || hash === "/") {
    if (path.endsWith("/admin")) return { name: "admin-dashboard", gameId: null };
  }

  const parts = hash.split("/").filter(Boolean);
  const first = parts[0] || "";
  const second = parts[1] || "";
  const third = parts[2] || null;

  if (first === "admin") {
    switch (second) {
      case "library": return { name: "admin-library", gameId: null };
      case "users": return { name: "admin-users", gameId: null };
      case "create": return { name: "admin-create", gameId: null };
      case "edit": return { name: "admin-edit", gameId: third };
      case "builder": return { name: "admin-builder", gameId: third };
      case "results": return { name: "admin-results", gameId: third };
      default: return { name: "admin-dashboard", gameId: null };
    }
  }

  if (first === "play") {
    // #/play/:id → id nằm ở parts[1] (khác với admin/action/:id lấy parts[2])
    const playId = second || null;
    return playId ? { name: "student", gameId: playId } : { name: "student-join", gameId: null };
  }

  return { name: "home", gameId: null };
}

export function navigate(path) {
  const target = String(path).startsWith("#") ? String(path) : `#${String(path).replace(/^\/?/, "/")}`;
  if (window.location.hash !== target) window.location.hash = target;
}

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