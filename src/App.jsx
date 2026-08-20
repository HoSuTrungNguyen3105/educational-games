import { useEffect, useState } from 'react'
import { loadAuth } from './services/api.js'
import { authService } from './services/api.js'
import { gameService } from './services/api.js'
import { navigate, useRoute } from './lib/router.js'
import { useToast } from './lib/hooks.js'
import { Toast, Loader } from './components/ui.jsx'
import { socket } from './socket/socket.js'
import { registerSocketListeners } from './socket/socket.listeners.js'
import HomeScreen from './pages/HomeScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import TeacherApp from './pages/teacher/TeacherApp.jsx'
import StudentApp from './pages/student/StudentApp.jsx'

function App() {
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [playGame, setPlayGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [toast, showToast] = useToast();

  const connectSocket = (token) => {
    socket.auth = { token };
    socket.connect();
  };

  useEffect(() => {
    return registerSocketListeners();
  }, []);

  useEffect(() => {
    const auth = loadAuth();
    if (auth && auth.token && auth.user && (auth.user.role === "teacher" || auth.user.role === "admin")) {
      setUser(auth.user);
      connectSocket(auth.token);
    }
    const onExpired = () => { setUser(null); socket.disconnect(); };
    window.addEventListener("edu-auth-expired", onExpired);
    return () => window.removeEventListener("edu-auth-expired", onExpired);
  }, []);

  // Route học sinh #/play/:id → tải game theo id
  useEffect(() => {
    if (route.name !== "student" || !route.gameId) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingGame(true);
    gameService.get(route.gameId)
      .then((g) => { if (!cancelled) setPlayGame(g); })
      .catch(() => { if (!cancelled) setPlayGame(null); })
      .finally(() => { if (!cancelled) setLoadingGame(false); });
    return () => { cancelled = true; };
  }, [route.name, route.gameId]);

  const handleLogin = (u) => {
    const auth = loadAuth();
    setUser(u);
    if (auth && auth.token) connectSocket(auth.token);
  };
  const handleLogout = () => {
    authService.logout();
    socket.disconnect();
    setUser(null);
    navigate("/");
  };

  const isAdminRoute = route.name.startsWith("admin-");

  if (isAdminRoute) {
    if (!user) return <LoginScreen onBack={() => navigate("/")} onLogin={handleLogin} showToast={showToast} />;
    return (
      <>
        <TeacherApp user={user} route={route} onExit={handleLogout} showToast={showToast} />
        <Toast toast={toast} />
      </>
    );
  }

  if (route.name === "student" || route.name === "student-join") {
    if (loadingGame) return <div className="min-h-screen bg-paper flex items-center justify-center"><Loader label="Đang mở trò chơi..." /></div>;
    return <StudentApp initialGame={playGame} onExit={() => navigate("/")} showToast={showToast} toast={toast} />;
  }

  return <HomeScreen onSelectGame={(g) => navigate(`/play/${g.id}`)} />;
}

export default App