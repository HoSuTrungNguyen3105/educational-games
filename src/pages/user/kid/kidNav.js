// Cấu hình điều hướng của trang Bé (/kid-dashboard).
//
// Tách riêng khỏi component để sidebar (desktop) và hàng chip (mobile) đọc
// đúng MỘT danh sách — không nhân bản label/icon ở hai nơi.
//
// - PANELS: các panel nằm NGAY trong trang (bấm là đổi nội dung bên phải,
//   không điều hướng, không mất trạng thái — giống kiểu tab).
// - SHORTCUTS: lối tắt ra trang riêng (Góc học tập, Khu vườn, Kho báu…).
import {
  BookOpen, ClipboardList, Gamepad2, GraduationCap, Home, LayoutDashboard,
  Medal, Palette, Settings, ShoppingBag, Smartphone, Sprout, Trophy,
} from "lucide-react";

/** Panel "Hôm nay" — luôn là mục đầu tiên và là mặc định khi mở trang. */
export const HOME_PANEL = { id: "home", label: "Hôm nay", Icon: Home };

/** Các panel nội dung lấy từ trang Hồ sơ cũ (/profile) — dùng chung khối
 *  ProfileSections nên logic/dữ liệu không đổi, chỉ đổi khung trình bày. */
export const PROFILE_PANELS = [
  { id: "sec-overview", label: "Tổng quan", Icon: LayoutDashboard },
  { id: "sec-outfit", label: "Avatar & thú cưng", Icon: Palette },
  { id: "sec-class", label: "Lớp học", Icon: GraduationCap },
  { id: "sec-games", label: "Trò chơi", Icon: Gamepad2 },
  { id: "sec-settings", label: "Cài đặt của bé", Icon: Settings },
  { id: "sec-app", label: "Ứng dụng & thông báo", Icon: Smartphone },
];

/** Toàn bộ panel của trang (sidebar + hàng chip mobile dùng chung). */
export const PANELS = [HOME_PANEL, ...PROFILE_PANELS];

/** Lối tắt một chạm — đúng 4 mục chuẩn Tiểu học trong đề bài
 *  (Góc Học Tập, Khu Vườn, Kho Báu Huy Hiệu, Bảng Vàng) + Nhiệm vụ, Cửa hàng. */
export const SHORTCUTS = [
  { key: "categories", icon: "📚", label: "Góc học tập", path: "/categories", tint: "from-sky-400 to-blue-500" },
  { key: "tasks", icon: "🎯", label: "Nhiệm vụ", path: "/daily-tasks", tint: "from-amber-400 to-orange-500" },
  { key: "garden", icon: "🌳", label: "Khu vườn", path: "/garden", tint: "from-emerald-400 to-teal-500" },
  { key: "achievements", icon: "🏆", label: "Kho báu", path: "/achievements", tint: "from-violet-400 to-purple-500" },
  { key: "leaderboard", icon: "🥇", label: "Bảng vàng", path: "/leaderboard", tint: "from-yellow-400 to-amber-500" },
  { key: "store", icon: "🛒", label: "Cửa hàng", path: "/store", tint: "from-pink-400 to-rose-500" },
];

/** Icon lucide cho nhóm lối tắt ở sidebar (emoji chỉ dùng cho thẻ lớn). */
export const SHORTCUT_ICONS = {
  categories: BookOpen,
  tasks: ClipboardList,
  garden: Sprout,
  achievements: Trophy,
  leaderboard: Medal,
  store: ShoppingBag,
};

/* ── Khám phá nhanh NHÚNG trong trang Bé ────────────────────────────────
 * Bấm lối tắt KHÔNG điều hướng ra route riêng nữa (mất sidebar trái) mà
 * mở trang đích ngay trong cột nội dung của trang Bé — sidebar + khung
 * trang giữ nguyên. Mỗi lối tắt thành một "panel mở rộng" có id dạng
 * `x-<key>` để dùng chung cơ chế chọn panel + đồng bộ ?panel= lên URL
 * với các panel thường (xem KidDashboard + hooks/useHashParam). */
export const EXPLORE_PREFIX = "x-";
export const exploreId = (key) => `${EXPLORE_PREFIX}${key}`;
export const shortcutByKey = (key) => SHORTCUTS.find((s) => s.key === key) || null;
export const exploreKeyOf = (panelId) =>
  typeof panelId === "string" && panelId.startsWith(EXPLORE_PREFIX)
    ? panelId.slice(EXPLORE_PREFIX.length)
    : null;
export const isExploreId = (panelId) => {
  const key = exploreKeyOf(panelId);
  return !!key && !!shortcutByKey(key);
};

/** Mọi giá trị ?panel= hợp lệ: panel thường + panel khám phá. */
export const PANEL_IDS = [
  ...PANELS.map((p) => p.id),
  ...SHORTCUTS.map((s) => exploreId(s.key)),
];
