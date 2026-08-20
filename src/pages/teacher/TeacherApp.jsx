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

  // Màn Game Builder hiển thị toàn màn hình (không có nav, canvas full width)
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
      <TeacherNav screen={page} onExit={onExit} onCreate={goCreate} user={user} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-8 py-8">
        {page === "admin-dashboard" && <TeacherDashboard key={refreshFlag} user={user} onOpenLibrary={goLibrary} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} />}
        {page === "admin-library" && <GameLibrary key={refreshFlag} onCreate={goCreate} onEdit={(id) => navigate(`/admin/edit/${id}`)} onResults={(id) => navigate(`/admin/results/${id}`)} onDesign={(id) => navigate(`/admin/builder/${id}`)} onOpenBuilder={() => navigate("/admin/builder")} showToast={showToast} onChanged={bump} />}
        {page === "admin-create" && <CreateGameFlow gameId={null} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
        {page === "admin-edit" && <CreateGameFlow key={route.gameId} gameId={route.gameId} showToast={showToast} onDone={() => { bump(); goLibrary(); }} onCancel={goLibrary} />}
        {page === "admin-results" && <TeacherResults gameId={route.gameId} onBack={goLibrary} />}
        {page === "admin-users" && <UserManagement user={user} showToast={showToast} />}
      </main>
    </div>
  );
}

function TeacherNav({ screen, onExit, onCreate, user }) {
  const tabs = [
    { id: "admin-dashboard", label: "Dashboard", route: "/admin" },
    { id: "admin-library", label: "Thư viện trò chơi", route: "/admin/library" },
    { id: "admin-users", label: "Quản lý người dùng", route: "/admin/users" },
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
        <nav className="hidden sm:flex items-center gap-1 bg-paper/10 rounded-full p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => navigate(t.route)}
              className={`px-4 py-2 rounded-full text-sm font-body transition ${activeTab === t.id ? "bg-gold text-ink font-semibold" : "text-paper/70 hover:text-paper"}`}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <PrimaryButton onClick={onCreate} className="!bg-ticket !text-white !shadow-none px-4 py-2 text-sm">+ Tạo trò chơi</PrimaryButton>
          <button onClick={onExit} className="flex items-center gap-2 text-paper/70 hover:text-paper text-sm">
            <span className="w-8 h-8 rounded-full bg-paper/15 flex items-center justify-center font-display">{(user ? user.name : "G")[0]}</span>
            <span className="hidden md:inline">Thoát</span>
          </button>
        </div>
      </div>
    </header>
  );
}