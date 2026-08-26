import { useState } from 'react'
import { navigate } from '../../lib/router.js'
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
  PartyPopper,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const MENU = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin" },
  { id: "admin-library", label: "Thư viện", icon: Library, route: "/admin/library" },
  { id: "admin-users", label: "Người dùng", icon: Users, route: "/admin/users" },
  { id: "admin-coins", label: "Coin & Progress", icon: Coins, route: "/admin/coins" },
  { id: "admin-daily-tasks", label: "Nhiệm vụ ngày", icon: ClipboardList, route: "/admin/daily-tasks" },
  { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates" },
  { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories" },
  { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects" },
  { id: "admin-questions", label: "Câu hỏi", icon: HelpCircle, route: "/admin/questions" },
];

const BOTTOM_MENU = [
  { id: "admin-create", label: "Tạo trò chơi", icon: Plus, route: "/admin/create" },
  { id: "home", label: "Về trang chủ", icon: Home, route: "/" },
];

const MOBILE_MAIN = [
  { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard, route: "/admin" },
  { id: "admin-library", label: "Thư viện", icon: Library, route: "/admin/library" },
  { id: "admin-create", label: "Tạo", icon: Plus, route: "/admin/create" },
  { id: "home", label: "Trang chủ", icon: Home, route: "/" },
  { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates" },
];

const MOBILE_MORE = [
  { id: "admin-users", label: "Người dùng", icon: Users, route: "/admin/users" },
  { id: "admin-coins", label: "Coins", icon: Coins, route: "/admin/coins" },
  { id: "admin-daily-tasks", label: "Nhiệm vụ", icon: ClipboardList, route: "/admin/daily-tasks" },
  { id: "admin-templates", label: "Templates", icon: Palette, route: "/admin/templates" },
  { id: "admin-categories", label: "Categories", icon: Tag, route: "/admin/categories" },
  { id: "admin-subjects", label: "Môn học", icon: BookOpen, route: "/admin/subjects" },
  { id: "admin-questions", label: "Câu hỏi", icon: HelpCircle, route: "/admin/questions" },
];

export default function TeacherSidebar({ screen, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const activeId = MENU.some(t => t.id === screen) ? screen : "admin-library";

  const renderNav = (isMobile) => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <PartyPopper className="w-6 h-6 text-gold" />
        <span className="font-display text-paper text-lg">Lớp Học Vui</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {MENU.map(t => {
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
        {BOTTOM_MENU.map(t => {
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
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm text-white font-bold shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-paper truncate">{user.name}</p>
                <p className="text-[10px] font-mono text-paper/50 capitalize">{user.role}</p>
              </div>
            </div>
            <button onClick={() => { onLogout?.(); if (isMobile) setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-body text-red-400 hover:bg-red-500/10 transition">
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
      {/* Mobile drawer (hamburger) */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 w-60 h-full bg-ink z-50 shadow-2xl overflow-y-auto transition-transform duration-300 sm:hidden">
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

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-[240px] min-h-screen bg-ink text-paper flex-shrink-0 overflow-y-auto sticky top-0 h-screen">
        {renderNav(false)}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_MAIN.map((t, i) => {
            if (i === 2) {
              return (
                <div key="center-group" className="relative flex items-center justify-center">
                  {moreOpen && (
                    <>
                      <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
                      <div className="fixed inset-x-4 bottom-20 z-50 note-card p-4 anim-pop shadow-2xl sm:hidden">
                        <p className="text-[10px] font-mono uppercase text-[#8A7C63] mb-3 text-center">Quản lý thêm</p>
                        <div className="grid grid-cols-2 gap-2">
                          {MOBILE_MORE.map(m => {
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
                      </div>
                    </>
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