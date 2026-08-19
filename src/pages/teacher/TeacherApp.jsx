import { useState } from 'react'
import { PrimaryButton } from '../../components/ui.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import GameLibrary from './GameLibrary.jsx'
import CreateGameFlow from './CreateGameFlow.jsx'
import TeacherResults from './TeacherResults.jsx'
import UserManagement from './UserManagement.jsx'

export default function TeacherApp({ user, onExit, showToast }) {
  const [screen, setScreen] = useState("dashboard");
  const [activeGameId, setActiveGameId] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const bump = () => setRefreshFlag(f => f + 1);

  const goResults = (id) => { setActiveGameId(id); setScreen("results"); };
  const goEdit = (id) => { setActiveGameId(id); setScreen("create"); };
  const goCreateNew = () => { setActiveGameId(null); setScreen("create"); };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <TeacherNav screen={screen} setScreen={setScreen} onExit={onExit} onCreate={goCreateNew} user={user} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-8 py-8">
        {screen === "dashboard" && <TeacherDashboard key={refreshFlag} user={user} onOpenLibrary={() => setScreen("library")} onCreate={goCreateNew} onEdit={goEdit} onResults={goResults} />}
        {screen === "library" && <GameLibrary key={refreshFlag} onCreate={goCreateNew} onEdit={goEdit} onResults={goResults} showToast={showToast} onChanged={bump} />}
        {screen === "create" && <CreateGameFlow gameId={activeGameId} showToast={showToast} onDone={() => { bump(); setScreen("library"); }} onCancel={() => setScreen("library")} />}
        {screen === "results" && <TeacherResults gameId={activeGameId} onBack={() => setScreen("library")} />}
        {screen === "users" && <UserManagement user={user} showToast={showToast} />}
      </main>
    </div>
  );
}

function TeacherNav({ screen, setScreen, onExit, onCreate, user }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "library", label: "Thư viện trò chơi" },
    { id: "users", label: "Quản lý người dùng" },
  ];
  return (
    <header className="marquee-panel sticky top-0 z-20">
      <div className="marquee-lights w-full"></div>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎪</span>
          <span className="font-display text-paper text-lg">Lớp Học Vui</span>
        </div>
        <nav className="hidden sm:flex items-center gap-1 bg-paper/10 rounded-full p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setScreen(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-body transition ${screen === t.id ? "bg-gold text-ink font-semibold" : "text-paper/70 hover:text-paper"}`}>
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