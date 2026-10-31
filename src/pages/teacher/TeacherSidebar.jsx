import { useState } from 'react'
import { navigate } from '../../lib/router.js'
import { hasPermission, getRoleLabel } from '../../config/roles.js'
import {
  LayoutDashboard,
  Library,
  Coins,
  ClipboardList,
  Palette,
  Tag,
  BookOpen,
  CircleQuestionMark,
  Database,
  House,
  MessageCircle,
  GraduationCap,
  Shirt,
  Scissors,
  Move,
  Image,
  ShieldCheck,
  Sparkles,
  PawPrint,
  Sprout,
  Settings2,
} from 'lucide-react'
import {
  IconAdd, IconBell, IconClose, IconFile, IconLogout, IconSettings, IconUsers,
} from '../../components/ui/index.js'

/* Menu chia nhóm theo layout mới: nhóm đầu không header, các nhóm sau có tiêu đề nhỏ. */
const SECTIONS = [
  {
    id: "main",
    label: null,
    items: [
      { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin", permission: null },
      { id: "admin-library", label: "Trò chơi", icon: Library, route: "/admin/library", permission: "games.manage" },
      { id: "admin-create", label: "Tạo trò chơi", icon: IconAdd, route: "/admin/create", permission: "games.manage" },
    ],
  },
  {
    id: "manage",
    label: "Quản lý",
    items: [
      { id: "admin-users", label: "Người dùng", icon: IconUsers, route: "/admin/users", permission: "users.view" },
      { id: "admin-roles", label: "Phân quyền", icon: ShieldCheck, route: "/admin/roles", permission: "users.view" },
      { id: "admin-classes", label: "Lớp học", icon: GraduationCap, route: "/admin/classes", permission: null },
      { id: "admin-assignments", label: "Bài tập", icon: IconFile, route: "/admin/assignments", permission: null },
      { id: "admin-coins", label: "Coin & Progress", icon: Coins, route: "/admin/coins", permission: "coins.manage" },
      { id: "admin-daily-tasks", label: "Nhiệm vụ ngày", icon: ClipboardList, route: "/admin/daily-tasks", permission: "daily-tasks.manage" },
      { id: "admin-reminders", label: "Nhắc nhở", icon: IconBell, route: "/admin/reminders", permission: null },
      { id: "admin-chat", label: "Tin nhắn", icon: MessageCircle, route: "/admin/chat", permission: "chat" },
      { id: "admin-ai-analysis", label: "Phân tích AI", icon: Sparkles, route: "/admin/ai-analysis", permission: "reports.view" },
      { id: "admin-settings", label: "Cài đặt", icon: Settings2, route: "/admin/settings", permission: null },
    ],
  },
  {
    id: "content",
    label: "Nội dung",
    items: [
      { id: "admin-questions", label: "Câu hỏi", icon: CircleQuestionMark, route: "/admin/questions", permission: "questions.manage" },
      { id: "admin-question-bank", label: "Ngân hàng câu hỏi", icon: Database, route: "/admin/question-bank", permission: "questions.manage" },
      { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects", permission: "subjects.manage" },
      { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories", permission: "categories.manage" },
      { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates", permission: "templates.manage" },
      { id: "admin-game-config", label: "Cấu hình game", icon: IconSettings, route: "/admin/game-config", permission: "games.manage" },
      { id: "admin-vth-config", label: "Cấu hình Vườn Thủ Hộ", icon: Sprout, route: "/admin/vth-config", permission: "games.manage" },
      { id: "admin-images", label: "Thư viện ảnh", icon: Image, route: "/admin/images", permission: null },
      { id: "admin-upload-items", label: "Trích xuất Items", icon: Scissors, route: "/admin/upload-items", permission: null },
    ],
  },
  {
    id: "avatar",
    label: "Avatar & Pet",
    items: [
      { id: "admin-avatar-items", label: "Avatar Items", icon: Shirt, route: "/admin/avatar-items", permission: null },
      { id: "admin-avatar-template", label: "Avatar Template", icon: Move, route: "/admin/avatar-template", permission: null },
      { id: "admin-pet-catalog", label: "Danh mục Pet", icon: PawPrint, route: "/admin/pet-catalog", permission: null },
      { id: "admin-body-custom", label: "Thân Avatar", icon: Move, route: "/admin/body-custom", permission: null },
      { id: "admin-plant-types", label: "Loại cây (Garden)", icon: Move, route: "/admin/plant-types", permission: null },
    ],
  },
];

/* Route không có mục menu riêng (trang con) — dùng cho tiêu đề trang. */
const EXTRA_TITLES = {
  "admin-profile": "Hồ sơ",
  "admin-edit": "Chỉnh sửa trò chơi",
  "admin-results": "Kết quả trò chơi",
  "admin-template-new": "Template mới",
  "admin-template-edit": "Sửa template",
  "admin-class-students": "Học sinh lớp",
  "admin-assignment-new": "Tạo bài tập",
  "admin-assignment-edit": "Sửa bài tập",
  "admin-assignment-detail": "Chi tiết bài tập",
  "admin-all-questions": "Tất cả câu hỏi",
};

export function findPageTitle(screen) {
  for (const s of SECTIONS) {
    const item = s.items.find(i => i.id === screen);
    if (item) return item.label;
  }
  return EXTRA_TITLES[screen] || "Dashboard";
}

const MOBILE_MAIN = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin", permission: null },
  { id: "admin-library", label: "Trò chơi", icon: Library, route: "/admin/library", permission: "games.manage" },
  { id: "home", label: "Trang chủ", icon: House, route: "/", permission: null },
];

function initialsOf(name) {
  const parts = String(name || "?").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function TeacherSidebar({ screen, user, onLogout }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const role = user?.role;
  const canSee = (item) => !item.permission || hasPermission(role, item.permission);

  const visibleSections = SECTIONS
    .map(s => ({ ...s, items: s.items.filter(canSee) }))
    .filter(s => s.items.length > 0);
  const visibleMobileMain = MOBILE_MAIN.filter(canSee);
  const visibleCount = visibleSections.reduce((n, s) => n + s.items.length, 0);

  const allVisible = visibleSections.flatMap(s => s.items);
  const activeId = allVisible.some(i => i.id === screen) ? screen : null;

  const userCard = user ? (
    <div className="edu-side-user">
      <div className="edu-side-avatar">{initialsOf(user.name)}</div>
      <div className="min-w-0 flex-1">
        <p className="edu-side-name truncate">{user.name}</p>
        <p className="edu-side-role truncate">{getRoleLabel(role)}</p>
      </div>
    </div>
  ) : null;

  const renderNav = () => (
    <div className="flex flex-col h-full min-h-0">
      <nav className="edu-menu flex-1 min-h-0 overflow-y-auto">
        {visibleSections.map(s => (
          <div key={s.id} className="edu-menu-section">
            {s.label && <p className="edu-menu-label">{s.label}</p>}
            {s.items.map(t => {
              const Icon = t.icon;
              const active = activeId === t.id;
              return (
                <button key={t.id} onClick={() => navigate(t.route)}
                  className={`edu-menu-item ${active ? "is-active" : ""}`}>
                  <Icon />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      {userCard}
    </div>
  );

  const leftMobile = visibleMobileMain.slice(0, 2);
  const rightMobile = visibleMobileMain.slice(2);

  return (
    <>
      <aside className="edu-admin-sidebar">
        {renderNav()}
      </aside>

      <nav className="sm:hidden edu-mobile-nav">
        <div className="flex items-center justify-around h-16 px-2">
          {leftMobile.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => navigate(t.route)}
                className={`edu-mobile-nav-btn ${activeId === t.id ? "is-active" : ""}`}>
                <Icon />
                <span className="leading-tight">{t.label}</span>
              </button>
            );
          })}
          <div className="relative flex items-center justify-center">
            <button onClick={() => setMoreOpen(v => !v)} aria-label="Mở bảng quản lý"
              className={`edu-mobile-plus ${moreOpen ? "is-open" : ""}`}>
              <IconAdd />
            </button>
          </div>
          {rightMobile.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => navigate(t.route)}
                className={`edu-mobile-nav-btn ${activeId === t.id ? "is-active" : ""}`}>
                <Icon />
                <span className="leading-tight">{t.label}</span>
              </button>
            );
          })}
          {user && (
            <button onClick={onLogout} className="edu-mobile-nav-btn text-red-400">
              <IconLogout />
              <span className="leading-tight">Thoát</span>
            </button>
          )}
        </div>
      </nav>

      {/* Panel "+" mở full màn hình: các mục chia theo nhóm như sidebar desktop. */}
      {moreOpen && (
        <div
          className="sm:hidden fixed inset-0 z-[60] edu-more-panel flex flex-col anim-pop"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <header className="shrink-0 flex items-center gap-3 px-3 h-12 edu-more-head">
            <button onClick={() => setMoreOpen(false)} aria-label="Đóng"
              className="w-8 h-8 rounded grid place-items-center bg-white/10 hover:bg-white/20 transition">
              <IconClose className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="edu-more-title">Quản lý</p>
              <p className="edu-more-sub">{visibleCount} mục</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-4">
            {visibleSections.map(s => (
              <section key={s.id}>
                {s.label && <h4 className="edu-more-label">{s.label}</h4>}
                <div className="grid grid-cols-3 gap-2">
                  {s.items.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => { navigate(m.route); setMoreOpen(false); }}
                        className={`edu-more-tile ${activeId === m.id ? "is-active" : ""}`}>
                        <Icon />
                        <span className="leading-tight line-clamp-2">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
            <section>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => { navigate("/"); setMoreOpen(false); }} className="edu-more-tile">
                  <House />
                  <span className="leading-tight">Về trang chủ</span>
                </button>
                {user && (
                  <button onClick={() => { onLogout?.(); setMoreOpen(false); }}
                    className="edu-more-tile" style={{ color: "#d63638" }}>
                    <IconLogout />
                    <span className="leading-tight">Đăng xuất</span>
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
