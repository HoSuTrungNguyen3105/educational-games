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
  IconAdd, IconBell, IconClose, IconFile, IconLogout, IconSettings, IconUser, IconUsers,
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

/* Route không có mục menu riêng (trang con) — dùng cho tiêu đề topbar. */
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
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <div className="mt-2 flex items-center gap-2.5 p-2.5 rounded-2xl bg-paper2 border border-ink/10">
      <div className="w-9 h-9 rounded-full bg-gold text-ink grid place-items-center font-display font-bold text-sm shrink-0 shadow-[0_2px_0_rgba(29,46,74,0.15)]">
        {initialsOf(user.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink truncate leading-tight">{user.name}</p>
        <p className="text-[10px] font-mono text-[#8A7C63] leading-tight">{getRoleLabel(role)}</p>
      </div>
    </div>
  ) : null;

  const renderNav = (isMobile) => (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <img
          src={`${import.meta.env.BASE_URL}eduplay-admin-logo2.png`}
          alt="EduPlay Admin"
          className="w-4/5 mx-auto h-auto object-contain"
          draggable={false}
        />
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
        {visibleSections.map(s => (
          <div key={s.id}>
            {s.label && (
              <p className="px-3 pt-4 pb-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[#A79A80]">{s.label}</p>
            )}
            <div className="space-y-0.5">
              {s.items.map(t => {
                const Icon = t.icon;
                const active = activeId === t.id;
                return (
                  <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body transition
                      ${active
                        ? "bg-ink text-paper font-semibold shadow-[0_2px_6px_rgba(29,46,74,0.25)]"
                        : "text-ink/70 hover:bg-ink/5 hover:text-ink"}`}>
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-gold" : ""}`} />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="shrink-0 px-3 pb-4 pt-3 border-t border-ink/10 space-y-0.5">
        <button onClick={() => { navigate("/"); if (isMobile) setMobileOpen(false); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-ink/70 hover:bg-ink/5 hover:text-ink transition">
          <House className="w-[18px] h-[18px]" />
          Về trang chủ
        </button>
        {user && (
          <>
            <button onClick={() => { navigate("/admin/profile"); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-ink/70 hover:bg-ink/5 hover:text-ink transition">
              <IconUser className="w-[18px] h-[18px]" />
              Hồ sơ
            </button>
            <button onClick={() => { onLogout?.(); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-red-500 hover:bg-red-500/10 transition">
              <IconLogout className="w-[18px] h-[18px]" />
              Đăng xuất
            </button>
          </>
        )}
        {userCard}
      </div>
    </div>
  );

  const leftMobile = visibleMobileMain.slice(0, 2);
  const rightMobile = visibleMobileMain.slice(2);

  return (
    <>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 w-60 h-full bg-[#F4EEE1] z-50 shadow-2xl overflow-hidden transition-transform duration-300 sm:hidden pwa-safe-top pwa-safe-top-h">
            {renderNav(true)}
          </aside>
        </>
      )}

      <aside className="hidden sm:flex flex-col w-[240px] h-screen sticky top-0 bg-[#F4EEE1] border-r border-ink/10 flex-shrink-0 overflow-hidden">
        {renderNav(false)}
      </aside>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-white/10" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-16 px-2">
          {leftMobile.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => navigate(t.route)}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition
                  ${activeId === t.id ? "text-gold" : "text-paper/60"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-body leading-tight">{t.label}</span>
              </button>
            );
          })}
          <div className="relative flex items-center justify-center">
            <button onClick={() => setMoreOpen(v => !v)} aria-label="Mở bảng quản lý"
              className={`w-14 h-14 -mt-5 rounded-full flex items-center justify-center text-2xl shadow-lg transition
                ${moreOpen ? "bg-ticket text-white rotate-45" : "bg-gold text-ink"}`}>
              <IconAdd className="w-7 h-7" />
            </button>
          </div>
          {rightMobile.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => navigate(t.route)}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition
                  ${t.id === "home" ? "text-paper/60" : activeId === t.id ? "text-gold" : "text-paper/60"}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-body leading-tight">{t.label}</span>
              </button>
            );
          })}
          {user && (
            <button onClick={onLogout}
              className="flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition text-red-400">
              <IconLogout className="w-5 h-5" />
              <span className="text-[10px] font-body leading-tight">Thoát</span>
            </button>
          )}
        </div>
      </nav>

      {/* Panel "+" mở full màn hình: các mục chia theo nhóm như sidebar desktop. */}
      {moreOpen && (
        <div
          className="sm:hidden fixed inset-0 z-[60] bg-paper flex flex-col anim-pop"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <header className="shrink-0 flex items-center gap-3 px-4 h-14 bg-ink text-paper">
            <button onClick={() => setMoreOpen(false)} aria-label="Đóng"
              className="w-9 h-9 rounded-full grid place-items-center bg-white/10 hover:bg-white/20 transition">
              <IconClose className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold leading-tight">Quản lý</p>
              <p className="text-[10px] text-paper/60 leading-tight">{visibleCount} mục</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-4">
            {visibleSections.map(s => (
              <section key={s.id}>
                {s.label && (
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8A7C63] px-1 pb-2">{s.label}</h4>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {s.items.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => { navigate(m.route); setMoreOpen(false); }}
                        className={`flex flex-col items-center justify-center gap-1 p-2 min-h-[74px] rounded-xl border transition active:scale-95
                          ${activeId === m.id
                            ? "border-ink bg-ink/5 text-ink"
                            : "border-ink/10 bg-paper2 text-ink hover:border-ink/25"}`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-[10px] font-body font-medium leading-tight text-center line-clamp-2">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
            <section>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => { navigate("/"); setMoreOpen(false); }}
                  className="flex flex-col items-center justify-center gap-1 p-2 min-h-[74px] rounded-xl border border-ink/10 bg-paper2 text-ink active:scale-95 transition">
                  <House className="w-5 h-5" />
                  <span className="text-[10px] font-body font-medium leading-tight text-center">Về trang chủ</span>
                </button>
                {user && (
                  <button onClick={() => { onLogout?.(); setMoreOpen(false); }}
                    className="flex flex-col items-center justify-center gap-1 p-2 min-h-[74px] rounded-xl border border-red-200 bg-red-50 text-red-500 active:scale-95 transition">
                    <IconLogout className="w-5 h-5" />
                    <span className="text-[10px] font-body font-medium leading-tight text-center">Đăng xuất</span>
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
