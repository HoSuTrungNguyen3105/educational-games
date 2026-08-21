import { useState } from 'react'
import { navigate } from '../../lib/router.js'
import { PrimaryButton } from '../../components/ui.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import GameLibrary from './GameLibrary.jsx'
import CreateGameFlow from './CreateGameFlow.jsx'
import TeacherResults from './TeacherResults.jsx'
import UserManagement from './UserManagement.jsx'
import GameBuilder from '../../components/gameBuilder/GameBuilder.jsx'

export default function TeacherApp({ user, route, onExit, showToast }) {
  const [refreshFlag, setRefreshFlag] = useState(0);
  const bump = () => setRefreshFlag(f => f + 1);

  const goCreate = () => navigate("/admin/create");
  const goLibrary = () => navigate("/admin/library");

  if (route.name === "admin-builder") {
    return (
      <GameBuilder
        gameId={route.gameId}
        showToast={showToast}
        onDone={() => { bump(); goLibrary(); }}
        onCancel={goLibrary}
      />
    );
  }

  const page = route.name;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <TeacherNav screen={page} onExit={onExit} onCreate={goCreate} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-8 py-8">
        {page === "admin-dashboard" && <TeacherDashboard key={refreshFlag} user={user} onOpenLibrary={goLibrary} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} showToast={showToast} />}
        {page === "admin-library" && <GameLibrary key={refreshFlag} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} onOpenBuilder={() => navigate("/admin/builder")} showToast={showToast} onChanged={bump} />}
        {page === "admin-create" && <CreateGameFlow gameId={null} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
        {page === "admin-edit" && <CreateGameFlow key={route.gameId} gameId={route.gameId} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
        {page === "admin-results" && <TeacherResults gameId={route.gameId} onBack={goLibrary} />}
        {page === "admin-users" && <UserManagement user={user} showToast={showToast} />}
      </main>
    </div>
  );
}

function TeacherNav({ screen, onExit, onCreate }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const tabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: "📊", route: "/admin" },
    { id: "admin-library", label: "Thư viện", icon: "📚", route: "/admin/library" },
    { id: "admin-users", label: "Người dùng", icon: "👥", route: "/admin/users" },
  ];
  const activeTab = tabs.some(t => t.id === screen) ? screen : "admin-library";
  return (
    <header className="marquee-panel sticky top-0 z-20">
      <div className="marquee-lights w-full"></div>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-3 cursor-pointer">
          <span className="text-2xl">🎪</span>
          <span className="font-display text-paper text-lg">Lớp Học Vui</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 bg-paper/10 rounded-full p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => navigate(t.route)}
              className={`px-4 py-2 rounded-full text-sm font-body transition ${activeTab === t.id ? "bg-gold text-ink font-semibold" : "text-paper/70 hover:text-paper"}`}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <div className="sm:hidden relative">
          <button onClick={() => setMobileMenu(v => !v)} className="w-9 h-9 rounded-full bg-paper/15 flex items-center justify-center text-paper text-lg">
            {mobileMenu ? "✕" : "☰"}
          </button>
          {mobileMenu && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setMobileMenu(false)}></div>
              <div className="absolute right-0 top-12 w-56 bg-ink rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => { navigate(t.route); setMobileMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-left transition ${activeTab === t.id ? "bg-gold/20 text-gold" : "text-paper/80 hover:bg-white/5 hover:text-paper"}`}>
                    <span className="text-lg">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
                <div className="border-t border-white/10">
                  <button onClick={() => { navigate("/chat"); setMobileMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-paper/80 hover:bg-white/5 hover:text-paper">
                    <span className="text-lg">💬</span>
                    Tin nhắn
                  </button>
                  <button onClick={() => { navigate("/admin/create"); setMobileMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-paper/80 hover:bg-white/5 hover:text-paper">
                    <span className="text-lg">➕</span>
                    Tạo trò chơi
                  </button>
                  <button onClick={() => { onExit(); setMobileMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-paper/80 hover:bg-white/5 hover:text-paper">
                    <span className="text-lg">🏠</span>
                    Về trang chủ
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <PrimaryButton onClick={onCreate} className="!bg-ticket !text-white !shadow-none px-4 py-2 text-sm">+ Tạo trò chơi</PrimaryButton>
          <button onClick={onExit} className="flex items-center gap-2 text-paper/70 hover:text-paper text-sm" title="Quay về trang chủ">
            <span className="w-8 h-8 rounded-full bg-paper/15 flex items-center justify-center">🏠</span>
            <span className="hidden md:inline">Về trang chủ</span>
          </button>
        </div>
      </div>
    </header>
  );
}