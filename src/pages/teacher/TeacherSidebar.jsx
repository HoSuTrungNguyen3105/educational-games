import { useState } from 'react'
import { navigate } from '../../lib/router.js'

const MENU = [
  { id: "admin-dashboard", label: "Dashboard", icon: "📊", route: "/admin" },
  { id: "admin-library", label: "Thư viện", icon: "📚", route: "/admin/library" },
  { id: "admin-users", label: "Người dùng", icon: "👥", route: "/admin/users" },
  { id: "admin-templates", label: "Templates", icon: "🎨", route: "/admin/templates" },
];

const BOTTOM_MENU = [
  { id: "admin-create", label: "Tạo trò chơi", icon: "➕", route: "/admin/create" },
  { id: "home", label: "Về trang chủ", icon: "🏠", route: "/" },
];

export default function TeacherSidebar({ screen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = MENU.some(t => t.id === screen) ? screen : "admin-library";

  const renderNav = (isMobile) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <span className="text-2xl">🎪</span>
        <span className="font-display text-paper text-lg">Lớp Học Vui</span>
      </div>

      {/* Main menu */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {MENU.map(t => (
          <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition
              ${activeId === t.id ? "bg-gold/20 text-gold font-semibold" : "text-paper/70 hover:bg-white/5 hover:text-paper"}`}>
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
        {BOTTOM_MENU.map(t => (
          <button key={t.id} onClick={() => { navigate(t.route); if (isMobile) setMobileOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-paper/70 hover:bg-white/5 hover:text-paper transition">
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="sm:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-xl bg-ink shadow-lg flex items-center justify-center text-paper text-lg">
        ☰
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-0 left-0 w-60 h-full bg-ink z-50 shadow-2xl overflow-y-auto transition-transform duration-300 sm:hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <span className="font-display text-paper text-base">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-paper/60 hover:text-paper text-lg">✕</button>
            </div>
            {renderNav(true)}
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-[240px] min-h-screen bg-ink text-paper flex-shrink-0 overflow-y-auto sticky top-0 h-screen">
        {renderNav(false)}
      </aside>
    </>
  );
}
