import { useState } from "react";
import { useRoute, navigate } from "./lib/router.js";
import { useToast } from "./lib/hooks.js";
import { Loader } from "./components/ui.jsx";
import { useTeacherAuth } from "./hooks/useTeacherAuth.js";
import { useSocketManager } from "./hooks/useSocketManager.js";
import { useGameLoader } from "./hooks/useGameLoader.js";
import RouteShell from "./components/RouteShell.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";
import TeacherApp from "./pages/teacher/TeacherApp.jsx";
import StudentApp from "./pages/student/StudentApp.jsx";
import UserLoginScreen from "./pages/user/UserLoginScreen.jsx";
import UserRegisterScreen from "./pages/user/UserRegisterScreen.jsx";
import ConversationListScreen from "./pages/user/ConversationListScreen.jsx";
import ProfileScreen from "./pages/user/ProfileScreen.jsx";
import MyCoins from "./pages/user/MyCoins.jsx";
import FindFriendsScreen from "./pages/user/FindFriendsScreen.jsx";

const USER_AUTH_KEY = "edu_games_user_auth";

function loadUserAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(USER_AUTH_KEY));
    if (auth?.token) {
      const parts = String(auth.token).split(".");
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
          if (payload?.exp && Date.now() / 1000 > payload.exp) {
            localStorage.removeItem(USER_AUTH_KEY);
            return null;
          }
        } catch { /* invalid token */ }
      }
    }
    return auth || null;
  } catch { return null; }
}

function App() {
  const route = useRoute();
  const [toast, showToast] = useToast();

  // Teacher auth (admin dashboard)
  const teacher = useTeacherAuth();

  // User auth (chat, profile, friends)
  const [userAuth, setUserAuth] = useState(() => loadUserAuth());
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegister, setShowUserRegister] = useState(false);

  // Socket manager — connect when any token is available
  useSocketManager(teacher.token, userAuth?.token);

  // Game loader for /play/:gameId
  const { playGame, loadingGame, selectGame } = useGameLoader(route);

  // ── User auth handlers ──
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

  // ── Teacher login handler ──
  const handleTeacherLogin = (u) => {
    const auth = JSON.parse(localStorage.getItem("edu_games_auth"));
    if (auth?.token) teacher.login(u, auth.token);
  };

  // ── Student Screen Renderer ──
  const renderStudent = () => {
    if (loadingGame) {
      return (
        <div className="min-h-screen bg-paper flex items-center justify-center">
          <Loader label="Đang mở trò chơi..." />
        </div>
      );
    }
    return (
      <StudentApp
        initialGame={playGame}
        onExit={() => navigate("/")}
        showToast={showToast}
        toast={toast}
        userAuth={userAuth}
        onUserLogin={() => setShowUserLogin(true)}
        onUserLogout={handleUserLogout}
      />
    );
  };

  // ── Route Map (O(1) declarative lookup) ──
  const routeMap = {
    student: renderStudent,
    "student-join": renderStudent,
    chat: () => (
      <RouteShell toast={toast}>
        <ConversationListScreen userAuth={userAuth} onLogout={handleUserLogout} />
      </RouteShell>
    ),
    profile: () => (
      <RouteShell toast={toast} showBack={false}>
        <ProfileScreen userAuth={userAuth} onLogout={handleUserLogout} onBack={() => navigate("/")} />
      </RouteShell>
    ),
    "find-friends": () => (
      <RouteShell toast={toast}>
        <FindFriendsScreen userAuth={userAuth} />
      </RouteShell>
    ),
    "my-coins": () => (
      <RouteShell toast={toast} showBack={false}>
        <MyCoins userAuth={userAuth} onBack={() => navigate("/")} />
      </RouteShell>
    ),
  };

  // ── Render Screen ──
  const renderScreen = () => {
    // User login/register modals (override current route)
    if (showUserLogin) {
      return (
        <UserLoginScreen
          onBack={() => setShowUserLogin(false)}
          onLogin={handleUserLogin}
          onGoRegister={() => { setShowUserLogin(false); setShowUserRegister(true); }}
          showToast={showToast}
        />
      );
    }

    if (showUserRegister) {
      return (
        <UserRegisterScreen
          onBack={() => setShowUserRegister(false)}
          onRegistered={handleUserRegister}
          onGoLogin={() => { setShowUserRegister(false); setShowUserLogin(true); }}
          showToast={showToast}
        />
      );
    }

    // Admin/teacher routes
    if (route.name.startsWith("admin-")) {
      if (!teacher.user) {
        return <LoginScreen onBack={() => navigate("/")} onLogin={handleTeacherLogin} showToast={showToast} />;
      }
      return (
        <TeacherApp
          user={teacher.user}
          route={route}
          onExit={() => navigate("/")}
          onLogout={teacher.logout}
          showToast={showToast}
        />
      );
    }

    // Match route from routeMap
    const renderTarget = routeMap[route.name];
    if (renderTarget) {
      return renderTarget();
    }

    // Home (default fallback)
    return (
      <HomeScreen
        onSelectGame={selectGame}
        userAuth={userAuth}
        onUserLogin={() => setShowUserLogin(true)}
        onUserRegister={() => setShowUserRegister(true)}
        onUserLogout={handleUserLogout}
      />
    );
  };

  return renderScreen();
}

export default App;
