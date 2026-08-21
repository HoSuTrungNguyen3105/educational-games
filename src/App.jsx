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
import UserLoginScreen from './pages/user/UserLoginScreen.jsx'
import UserRegisterScreen from './pages/user/UserRegisterScreen.jsx'
import ConversationListScreen from './pages/user/ConversationListScreen.jsx'
import ProfileScreen from './pages/user/ProfileScreen.jsx'
import FindFriendsScreen from './pages/user/FindFriendsScreen.jsx'
import { startWarmup } from './services/warmup.js'

const USER_AUTH_KEY = "edu_games_user_auth";
function loadUserAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(USER_AUTH_KEY));
    if (auth && auth.token) {
      const parts = String(auth.token).split(".");
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (payload && typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem(USER_AUTH_KEY);
            return null;
          }
        } catch (_) { /* invalid token */ }
      }
    }
    return auth || null;
  } catch (_) { return null; }
}

function App() {
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [playGame, setPlayGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [toast, showToast] = useToast();
  const pendingGameRef = useRef(null);

  // User auth state (for chat)
  const [userAuth, setUserAuth] = useState(() => loadUserAuth());
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegister, setShowUserRegister] = useState(false);

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
    if (route.name !== "student" || !route.params.gameId) return;
    let cancelled = false;
    const pending = pendingGameRef.current;
    if (pending && String(pending.id) === String(route.params.gameId)) {
      pendingGameRef.current = null;
      setPlayGame(pending);
      return () => { cancelled = true; };
    }
    setLoadingGame(true);
    gameService.get(route.params.gameId)
      .then((g) => { if (!cancelled) setPlayGame(g); })
      .catch(() => { if (!cancelled) setPlayGame(null); })
      .finally(() => { if (!cancelled) setLoadingGame(false); });
    return () => { cancelled = true; };
  }, [route.name, route.params.gameId]);

  const handleLogin = (u) => {
    const auth = loadAuth();
    setUser(u);
    if (auth && auth.token) connectSocket(auth.token);
  };

  const handleUserLogin = (userData, token) => {
    setUserAuth({ user: userData, token });
    setShowUserLogin(false);
  };

  const handleUserRegister = (userData, token) => {
    setUserAuth({ user: userData, token });
    setShowUserRegister(false);
  };

  const handleUserLogout = () => {
    localStorage.removeItem(USER_AUTH_KEY);
    setUserAuth(null);
  };

  // User login/register screens
  if (showUserLogin) {
    return (
      <>
        <UserLoginScreen
          onBack={() => { setShowUserLogin(false); }}
          onLogin={handleUserLogin}
          onGoRegister={() => { setShowUserLogin(false); setShowUserRegister(true); }}
          showToast={showToast}
        />
        <Toast toast={toast} />
      </>
    );
  }
  if (showUserRegister) {
    return (
      <>
        <UserRegisterScreen
          onBack={() => { setShowUserRegister(false); }}
          onRegistered={handleUserRegister}
          onGoLogin={() => { setShowUserRegister(false); setShowUserLogin(true); }}
          showToast={showToast}
        />
        <Toast toast={toast} />
      </>
    );
  }

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
    return <StudentApp initialGame={playGame} onExit={() => navigate("/")} showToast={showToast} toast={toast} userAuth={userAuth} onUserLogin={() => setShowUserLogin(true)} onUserLogout={handleUserLogout} />;
  }

  if (route.name === "chat") {
    return (
      <>
        <div className="min-h-screen bg-paper flex flex-col">
          <div className="flex items-center px-5 md:px-8 py-4">
            <button onClick={() => navigate("/")} className="text-sm text-[#8A7C63] hover:text-ink">← Về trang chủ</button>
          </div>
          <ConversationListScreen userAuth={userAuth} onSelectConversation={() => { /* TODO: open conversation chat */ }} onLogout={handleUserLogout} />
        </div>
        <Toast toast={toast} />
      </>
    );
  }

  if (route.name === "profile") {
    return (
      <>
        <div className="min-h-screen bg-paper flex flex-col">
          <ProfileScreen userAuth={userAuth} onLogout={handleUserLogout} onBack={() => navigate("/")} />
        </div>
        <Toast toast={toast} />
      </>
    );
  }

  if (route.name === "find-friends") {
    return (
      <>
        <div className="min-h-screen bg-paper flex flex-col">
          <div className="flex items-center px-5 md:px-8 py-4">
            <button onClick={() => navigate("/")} className="text-sm text-[#8A7C63] hover:text-ink">← Về trang chủ</button>
          </div>
          <FindFriendsScreen userAuth={userAuth} />
        </div>
        <Toast toast={toast} />
      </>
    );
  }

  return <HomeScreen onSelectGame={selectGame} userAuth={userAuth} onUserLogin={() => setShowUserLogin(true)} onUserRegister={() => setShowUserRegister(true)} onUserLogout={handleUserLogout} />;
}

export default App