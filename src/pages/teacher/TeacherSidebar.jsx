import { useState } from 'react'
import { navigate } from '../../lib/router.js'

const MENU = [
  { id: "admin-dashboard", label: "Dashboard", icon: "📊", route: "/admin" },
  { id: "admin-library", label: "Thư viện", icon: "📚", route: "/admin/library" },
  { id: "admin-users", label: "Người dùng", icon: "👥", route: "/admin/users" },
  { id: "admin-templates", label: "Templates", icon: "🎨", route: "/admin/templates" },
  { id: "admin-categories", label: "Categories", icon: "🏷️", route: "/admin/categories" },
  { id: "admin-subjects", label: "Môn học", icon: "📖", route: "/admin/subjects" },
  { id: "admin-questions", label: "Câu hỏi", icon: "❓", route: "/admin/questions" },
];

const BOTTOM_MENU = [
  { id: "admin-create", label: "Tạo trò chơi", icon: "➕", route: "/admin/create" },
  { id: "home", label: "Về trang chủ", icon: "🏠", route: "/" },
];

const MOBILE_MAIN = [
  { id: "admin-dashboard", label: "Dashboard", icon: "📊", route: "/admin" },
  { id: "admin-library", label: "Thư viện", icon: "📚", route: "/admin/library" },
  { id: "admin-create", label: "Tạo", icon: "➕", route: "/admin/create" },
  { id: "home", label: "Trang chủ", icon: "🏠", route: "/" },
  { id: "home", label: "Templates", icon: "🎨", route: "/admin/templates" },
];

const MOBILE_MORE = [
  { id: "admin-users", label: "Người dùng", icon: "👥", route: "/admin/users" },
  { id: "admin-templates", label: "Templates", icon: "🎨", route: "/admin/templates" },
  { id: "admin-categories", label: "Categories", icon: "🏷️", route: "/admin/categories" },
  { id: "admin-subjects", label: "Môn học", icon: "📖", route: "/admin/subjects" },
  { id: "admin-questions", label: "Câu hỏi", icon: "❓", route: "/admin/questions" },
];

export default function TeacherSidebar({ screen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const activeId = MENU.some(t => t.id === screen) ? screen : "admin-library";

  const renderNav = (isMobile) => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <span className="text-2xl">🎪</span>
        <span className="font-display text-paper text-lg">Lớp Học Vui</span>
      </div>
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
      {/* Mobile drawer (hamburger) */}
      {/* <button onClick={() => setMobileOpen(true)}
        className="sm:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-xl bg-ink shadow-lg flex items-center justify-center text-paper text-lg">
        ☰
      </button> */}
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
                          {MOBILE_MORE.map(m => (
                            <button key={m.id} onClick={() => { navigate(m.route); setMoreOpen(false); }}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition
                                ${activeId === m.id ? "border-gold bg-gold/10 text-gold" : "border-ink/10 bg-paper2 text-ink hover:border-ink/25"}`}>
                              <span className="text-2xl">{m.icon}</span>
                              <span className="text-xs font-body font-medium">{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <button onClick={() => setMoreOpen(v => !v)}
                    className={`w-14 h-14 -mt-5 rounded-full flex items-center justify-center text-2xl shadow-lg transition
                      ${moreOpen ? "bg-ticket text-white rotate-45" : "bg-ink text-paper"}`}>
                    +
                  </button>
                </div>
              );
            }
            return (
              <button key={t.id} onClick={() => navigate(t.route)}
                className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-xl transition
                  ${activeId === t.id ? "text-gold" : "text-paper/60"}`}>
                <span className="text-xl">{t.icon}</span>
                <span className="text-[10px] font-body leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
