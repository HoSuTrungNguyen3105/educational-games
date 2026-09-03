import { useState, useEffect } from "react";
import { useRoute, navigate } from "./lib/router.js";
import { useToast } from "./lib/hooks.js";
import { Loader } from "./components/ui.jsx";
import { useUserAuthStore } from "./stores/userAuth.store.js";
import { canAccessDashboard } from "./config/roles.js";
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
import DailyTasksPage from "./pages/user/DailyTasksPage.jsx";
import SpinWheel from "./pages/user/SpinWheel.jsx";
import AssignmentJoin from "./pages/user/AssignmentJoin.jsx";
import AssignmentTake from "./pages/user/AssignmentTake.jsx";
import GardenPage from "./pages/user/GardenPage.jsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.jsx";

function App() {
  const route = useRoute();
  const [toast, showToast] = useToast();

  const { user, token, login, register, logout, init } = useUserAuthStore();
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegister, setShowUserRegister] = useState(false);

  useEffect(() => { init(); }, [init]);

  useSocketManager(token);

  const { playGame, loadingGame, selectGame } = useGameLoader(route);

  const handleLogin = async (identifier, password) => {
    const u = await login(identifier, password);
    setShowUserLogin(false);
    setShowUserRegister(false);
    return u;
  };

  const handleRegister = async (data) => {
    const u = await register(data);
    setShowUserLogin(false);
    setShowUserRegister(false);
    return u;
  };

  const handleLogout = () => {
    logout();
    setShowUserLogin(false);
    setShowUserRegister(false);
  };

  const userAuth = user ? { user, token } : null;

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
        onUserLogout={handleLogout}
      />
    );
  };

  const routeMap = {
    student: renderStudent,
    "student-join": renderStudent,
    chat: () => (
      <RouteShell toast={toast} fullHeight>
        <ConversationListScreen userAuth={userAuth} onLogout={handleLogout} />
      </RouteShell>
    ),
    profile: () => (
      <RouteShell toast={toast} showBack={false}>
        <ProfileScreen userAuth={userAuth} onLogout={handleLogout} onBack={() => navigate("/")} />
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
    "daily-tasks": () => (
      <RouteShell toast={toast} showBack={false}>
        <DailyTasksPage userAuth={userAuth} onBack={() => navigate("/")} />
      </RouteShell>
    ),
    "spin-wheel": () => (
      <RouteShell toast={toast} showBack={false}>
        <SpinWheel userAuth={userAuth} onBack={() => navigate("/")} showToast={showToast} />
      </RouteShell>
    ),
    garden: () => (
      <RouteShell toast={toast} showBack={false}>
        <GardenPage userAuth={userAuth} onBack={() => navigate("/")} />
      </RouteShell>
    ),
    "assignment-join": () => <AssignmentJoin />,
    "assignment-take": () => <AssignmentTake assignmentId={route.params?.assignmentId} />,
  };

  const renderScreen = () => {
    if (showUserLogin) {
      return (
        <UserLoginScreen
          onBack={() => setShowUserLogin(false)}
          onLogin={handleLogin}
          onGoRegister={() => { setShowUserLogin(false); setShowUserRegister(true); }}
          showToast={showToast}
        />
      );
    }

    if (showUserRegister) {
      return (
        <UserRegisterScreen
          onBack={() => setShowUserRegister(false)}
          onRegistered={handleRegister}
          onGoLogin={() => { setShowUserRegister(false); setShowUserLogin(true); }}
          showToast={showToast}
        />
      );
    }

    if (route.name.startsWith("admin-")) {
      if (!user) {
        return <LoginScreen onBack={() => navigate("/")} onLogin={handleLogin} showToast={showToast} />;
      }
      if (!canAccessDashboard(user.role)) {
        return (
          <HomeScreen
            onSelectGame={selectGame}
            userAuth={userAuth}
            onUserLogin={() => setShowUserLogin(true)}
            onUserRegister={() => setShowUserRegister(true)}
            onUserLogout={handleLogout}
          />
        );
      }
      return (
        <TeacherApp
          user={user}
          route={route}
          onExit={() => navigate("/")}
          onLogout={handleLogout}
          showToast={showToast}
        />
      );
    }

    const renderTarget = routeMap[route.name];
    if (renderTarget) {
      return renderTarget();
    }

    return (
      <HomeScreen
        onSelectGame={selectGame}
        userAuth={userAuth}
        onUserLogin={() => setShowUserLogin(true)}
        onUserRegister={() => setShowUserRegister(true)}
        onUserLogout={handleLogout}
      />
    );
  };

  return (
    <>
      {renderScreen()}
      <PWAInstallPrompt />
    </>
  );
}

export default App;
