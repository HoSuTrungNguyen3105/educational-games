import { useEffect, useRef, useState } from 'react'
import { loadAuth } from './services/api.js'
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
import { startWarmup } from './services/warmup.js'

function App() {
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [playGame, setPlayGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [toast, showToast] = useToast();
  const pendingGameRef = useRef(null);

  // Chọn game trên Home → chuyển thẳng vào màn nhập tên, không fetch lại lần nữa
  const selectGame = (g) => {
    pendingGameRef.current = g;
    navigate(`/play/${g.id}`);
  };

  const connectSocket = (token) => {
    socket.auth = { token };
    socket.connect();
  };

  useEffect(() => {
    return registerSocketListeners();
  }, []);

  // Đánh thức backend ngay khi mở app để tránh chờ cold-start
  useEffect(() => {
    startWarmup();
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

  // Route học sinh #/play/:id → dùng game đã chọn ngay nếu có, nếu không thì tải theo id
  useEffect(() => {
    if (route.name !== "student" || !route.gameId) return;
    let cancelled = false;
    const pending = pendingGameRef.current;
    if (pending && String(pending.id) === String(route.gameId)) {
      pendingGameRef.current = null;
      setPlayGame(pending);
      return () => { cancelled = true; };
    }
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

  const isAdminRoute = route.name.startsWith("admin-");
  if (isAdminRoute) {
    if (!user) return <LoginScreen onBack={() => navigate("/")} onLogin={handleLogin} showToast={showToast} />;
    return (
      <>
        <TeacherApp user={user} route={route} onExit={() => navigate("/")} showToast={showToast} />
        <Toast toast={toast} />
      </>
    );
  }

  if (route.name === "student" || route.name === "student-join") {
    if (loadingGame) return <div className="min-h-screen bg-paper flex items-center justify-center"><Loader label="Đang mở trò chơi..." /></div>;
    return <StudentApp initialGame={playGame} onExit={() => navigate("/")} showToast={showToast} toast={toast} />;
  }

  return <HomeScreen onSelectGame={selectGame} />;
}

export default App