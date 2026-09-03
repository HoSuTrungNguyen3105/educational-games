import { useState, useEffect, lazy, Suspense } from "react";
import { useRoute, navigate } from "./lib/router.js";
import { useToast } from "./lib/hooks.js";
import { Loader } from "./components/ui.jsx";
import { useUserAuthStore } from "./stores/userAuth.store.js";
import { canAccessDashboard } from "./config/roles.js";
import { useSocketManager } from "./hooks/useSocketManager.js";
import { useGameLoader } from "./hooks/useGameLoader.js";
import RouteShell from "./components/RouteShell.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import PageLoading from "./components/PageLoading.jsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.jsx";

// Lazy-loaded Pages / Screens
const TeacherApp = lazy(() => import("./pages/teacher/TeacherApp.jsx"));
const StudentApp = lazy(() => import("./pages/student/StudentApp.jsx"));
const GardenPage = lazy(() => import("./pages/user/GardenPage.jsx"));
const ProfileScreen = lazy(() => import("./pages/user/ProfileScreen.jsx"));
const MyCoins = lazy(() => import("./pages/user/MyCoins.jsx"));
const FindFriendsScreen = lazy(() => import("./pages/user/FindFriendsScreen.jsx"));
const DailyTasksPage = lazy(() => import("./pages/user/DailyTasksPage.jsx"));
const SpinWheel = lazy(() => import("./pages/user/SpinWheel.jsx"));
const ConversationListScreen = lazy(() => import("./pages/user/ConversationListScreen.jsx"));
const AssignmentJoin = lazy(() => import("./pages/user/AssignmentJoin.jsx"));
const AssignmentTake = lazy(() => import("./pages/user/AssignmentTake.jsx"));
const LoginScreen = lazy(() => import("./pages/LoginScreen.jsx"));
const UserLoginScreen = lazy(() => import("./pages/user/UserLoginScreen.jsx"));
const UserRegisterScreen = lazy(() => import("./pages/user/UserRegisterScreen.jsx"));

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
      <Suspense fallback={<PageLoading />}>
        {renderScreen()}
      </Suspense>
      <PWAInstallPrompt />
    </>
  );
}

export default App;
