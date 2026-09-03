import { useState } from 'react'
import { navigate } from '../../lib/router.js'
import { hasPermission } from '../../config/roles.js'
import { Modal } from '../../components/ui.jsx'
import {
  LayoutDashboard,
  Library,
  Users,
  Coins,
  ClipboardList,
  Palette,
  Tag,
  BookOpen,
  HelpCircle,
  Plus,
  Home,
  LogOut,
  X,
  MessageCircle,
  User,
  GraduationCap,
  FileText,
  Shirt,
  Scissors,
  Move,
} from 'lucide-react'

const MENU = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin", permission: null },
  { id: "admin-library", label: "Thư viện", icon: Library, route: "/admin/library", permission: "games.manage" },
  { id: "admin-users", label: "Người dùng", icon: Users, route: "/admin/users", permission: "users.view" },
  { id: "admin-coins", label: "Coin & Progress", icon: Coins, route: "/admin/coins", permission: "coins.manage" },
  { id: "admin-daily-tasks", label: "Nhiệm vụ ngày", icon: ClipboardList, route: "/admin/daily-tasks", permission: "daily-tasks.manage" },
  { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates", permission: "templates.manage" },
  { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories", permission: "categories.manage" },
  { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects", permission: "subjects.manage" },
  { id: "admin-questions", label: "Câu hỏi", icon: HelpCircle, route: "/admin/questions", permission: "questions.manage" },
  { id: "admin-chat", label: "Tin nhắn", icon: MessageCircle, route: "/admin/chat", permission: "chat" },
  { id: "admin-classes", label: "Lớp học", icon: GraduationCap, route: "/admin/classes", permission: null },
  { id: "admin-assignments", label: "Bài tập", icon: FileText, route: "/admin/assignments", permission: null },
  { id: "admin-avatar-items", label: "Avatar Items", icon: Shirt, route: "/admin/avatar-items", permission: null },
  { id: "admin-avatar-template", label: "Avatar Template", icon: Move, route: "/admin/avatar-template", permission: null },
  { id: "admin-plant-types", label: "Loại cây (Garden)", icon: Move, route: "/admin/plant-types", permission: null },
  // { id: "admin-upload-items", label: "Trích xuất Items", icon: Scissors, route: "/admin/upload-items", permission: null },
];

const BOTTOM_MENU = [
  { id: "admin-create", label: "Tạo trò chơi", icon: Plus, route: "/admin/create", permission: "games.manage" },
  { id: "home", label: "Về trang chủ", icon: Home, route: "/", permission: null },
];

const MOBILE_MAIN = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin", permission: null },
  { id: "admin-library", label: "Thư viện", icon: Library, route: "/admin/library", permission: "games.manage" },
  { id: "admin-create", label: "Tạo", icon: Plus, route: "/admin/create", permission: "games.manage" },
  { id: "home", label: "Trang chủ", icon: Home, route: "/", permission: null },
  // { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates", permission: "templates.manage" },
];

const MOBILE_MORE = [
  { id: "admin-users", label: "Người dùng", icon: Users, route: "/admin/users", permission: "users.view" },
  { id: "admin-coins", label: "Coins", icon: Coins, route: "/admin/coins", permission: "coins.manage" },
  { id: "admin-daily-tasks", label: "Nhiệm vụ", icon: ClipboardList, route: "/admin/daily-tasks", permission: "daily-tasks.manage" },
  { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories", permission: "categories.manage" },
  { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects", permission: "subjects.manage" },
  { id: "admin-questions", label: "Câu hỏi", icon: HelpCircle, route: "/admin/questions", permission: "questions.manage" },
  { id: "admin-chat", label: "Tin nhắn", icon: MessageCircle, route: "/admin/chat", permission: "chat" },
  { id: "admin-classes", label: "Lớp học", icon: GraduationCap, route: "/admin/classes", permission: null },
  { id: "admin-assignments", label: "Bài tập", icon: FileText, route: "/admin/assignments", permission: null },
  { id: "admin-avatar-items", label: "Avatar Items", icon: Shirt, route: "/admin/avatar-items", permission: null },
  { id: "admin-avatar-template", label: "Avatar Template", icon: Move, route: "/admin/avatar-template", permission: null },
  { id: "admin-upload-items", label: "Trích xuất", icon: Scissors, route: "/admin/upload-items", permission: null },
];

export default function TeacherSidebar({ screen, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const role = user?.role;
  const canSee = (item) => !item.permission || hasPermission(role, item.permission);

  const visibleMenu = MENU.filter(canSee);
  const visibleBottom = BOTTOM_MENU.filter(canSee);
  const visibleMobileMain = MOBILE_MAIN.filter(canSee);
  const visibleMobileMore = MOBILE_MORE.filter(canSee);

  const activeId = visibleMenu.some(t => t.id === screen) ? screen : "admin-library";

  const renderNav = (isMobile) => (
    <div className="flex flex-col h-full">
      <div className="px-3 pt-3 pb-2">
        <img
          src={`${import.meta.env.BASE_URL}eduplay-admin-logo2.png`}
          alt="EduPlay Admin"
          className="w-4/5 mx-auto h-auto object-contain"
          draggable={false}
        />
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {visibleMenu.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition
                ${activeId === t.id ? "bg-gold/20 text-gold font-semibold" : "text-paper/70 hover:bg-white/5 hover:text-paper"}`}>
              <Icon className="w-5 h-5" />
              {t.label}
            </button>
          );
        })}
      </nav>
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        {visibleBottom.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-paper/70 hover:bg-white/5 hover:text-paper transition">
              <Icon className="w-5 h-5" />
              {t.label}
            </button>
          );
        })}
        {user && (
          <div className="mt-2 pt-3 border-t border-white/10">
            <button onClick={() => { navigate("/admin/profile"); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-paper/70 hover:bg-white/5 hover:text-paper transition">
              <User className="w-5 h-5" />
              Hồ sơ
            </button>
            <button onClick={() => { onLogout?.(); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-red-400 hover:bg-red-500/10 transition">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 w-60 h-full bg-ink z-50 shadow-2xl overflow-y-auto transition-transform duration-300 sm:hidden pwa-safe-top pwa-safe-top-h">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <span className="font-display text-paper text-base">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-paper/60 hover:text-paper">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderNav(true)}
          </aside>
        </>
      )}

      <aside className="hidden sm:flex flex-col w-[240px] min-h-screen bg-ink text-paper flex-shrink-0 overflow-y-auto sticky top-0 h-screen">
        {renderNav(false)}
      </aside>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-white/10" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-16 px-2">
          {visibleMobileMain.map((t, i) => {
            if (i === 2) {
              return (
                <div key="center-group" className="relative flex items-center justify-center">
                  {moreOpen && (
                    <Modal
                      onClose={() => setMoreOpen(false)}
                      align="bottom"
                      unstyled
                      overlayClassName="bg-ink/40 backdrop-blur-sm pb-20 px-4 sm:hidden"
                      contentClassName="note-card p-4 anim-pop shadow-2xl w-full max-w-md"
                    >
                      <p className="text-[10px] font-mono uppercase text-[#8A7C63] mb-3 text-center">Quản lý thêm</p>
                      <div className="grid grid-cols-2 gap-2">
                        {visibleMobileMore.map(m => {
                          const Icon = m.icon;
                          return (
                            <button key={m.id} onClick={() => { navigate(m.route); setMoreOpen(false); }}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition
                                ${activeId === m.id ? "border-gold bg-gold/10 text-gold" : "border-ink/10 bg-paper2 text-ink hover:border-ink/25"}`}>
                              <Icon className="w-6 h-6" />
                              <span className="text-xs font-body font-medium">{m.label}</span>
                            </button>
                          );
                        })}
                        <button onClick={() => { onLogout?.(); setMoreOpen(false); }}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition">
                          <LogOut className="w-6 h-6" />
                          <span className="text-xs font-body font-medium">Đăng xuất</span>
                        </button>
                      </div>
                    </Modal>
                  )}
                  <button onClick={() => setMoreOpen(v => !v)}
                    className={`w-14 h-14 -mt-5 rounded-full flex items-center justify-center text-2xl shadow-lg transition
                      ${moreOpen ? "bg-ticket text-white rotate-45" : "bg-ink text-paper"}`}>
                    <Plus className="w-7 h-7" />
                  </button>
                </div>
              );
            }
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
          {user && (
            <button onClick={onLogout}
              className="flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition text-red-400">
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-body leading-tight">Thoát</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
