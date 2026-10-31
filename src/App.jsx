import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useRoute, navigate } from "./lib/router.js";
import { useToast } from "./lib/hooks.js";
import { Loader } from "./components/ui";
import { useUserAuthStore } from "./stores/userAuth.store.js";
import { canAccessDashboard } from "./config/roles.js";
import { useSocketManager } from "./hooks/useSocketManager.js";
import { useGameLoader } from "./hooks/useGameLoader.js";
import RouteShell from "./components/RouteShell.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import OnboardingScreen from "./pages/OnboardingScreen.jsx";
import { useKidSettings, completeOnboarding } from "./lib/kidSettings.js";
import { ageCodeForGrade } from "./lib/ageCodes.js";
import { startKidProfileSync } from "./lib/kidProfileSync.js";
import PageLoading from "./components/PageLoading.jsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.jsx";
import { GameVersionProvider } from "./components/GameVersionProvider.jsx";

const USERNAME_SAFE = "abcdefghijklmnopqrstuvwxyz0123456789";
const PASSWORD_SAFE = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function randomString(length, alphabet) {
  const out = [];
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(length);
    crypto.getRandomValues(buf);
    for (let i = 0; i < length; i++) out.push(alphabet[buf[i] % alphabet.length]);
    return out.join("");
  }
  for (let i = 0; i < length; i++) out.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  return out.join("");
}

function usernameFromName(name) {
  const base = String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 14) || "hocsinh";
  return `${base}_${randomString(6, USERNAME_SAFE)}`;
}

function randomPassword() {
  return randomString(10, PASSWORD_SAFE);
}

// Lazy-loaded Pages / Screens
const TeacherApp = lazy(() => import("./pages/teacher/TeacherApp.jsx"));
const StudentApp = lazy(() => import("./pages/student/StudentApp.jsx"));
const InventoryPage = lazy(() => import("./pages/user/InventoryPage.jsx"));
const StorePage = lazy(() => import("./pages/user/StorePage.jsx"));
const LeaderboardPage = lazy(() => import("./pages/user/LeaderboardPage.jsx"));
const AchievementsPage = lazy(() => import("./pages/user/AchievementsPage.jsx"));
const RemindersPage = lazy(() => import("./pages/user/RemindersPage.jsx"));
const AiLearningAnalysisPage = lazy(() => import("./pages/user/AiLearningAnalysisPage.jsx"));
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
const MathAdventurePage = lazy(() => import("./pages/MathAdventurePage.jsx"));
const SchoolMissionPage = lazy(() => import("./pages/SchoolMissionPage.jsx"));
const OfflineGamePage = lazy(() => import("./pages/OfflineGamePage.jsx"));
const PetPage = lazy(() => import("./pages/PetPage.jsx"));
const PetWardrobePage = lazy(() => import("./pages/user/PetWardrobePage.jsx"));
const AttendancePage = lazy(() => import("./pages/AttendancePage.jsx"));

function App() {
  const route = useRoute();
  const [toast, showToast] = useToast();

  const { user, token, login, register, logout, init } = useUserAuthStore();
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegister, setShowUserRegister] = useState(false);
  const kidSettings = useKidSettings();

  useEffect(() => { init(); }, [init]);

  /* Lớp + giới tính đổi ở màn chào hay Cài đặt thì tự đẩy lên hồ sơ tài khoản. */
  useEffect(() => { startKidProfileSync(); }, []);

  useSocketManager(token);

  const { playGame, loadingGame, selectGame, coopSession } = useGameLoader(route);

  const handleLogin = async (identifier, password) => {
    const u = await login(identifier, password);
    setShowUserLogin(false);
    setShowUserRegister(false);
    return u;
  };

  const skipOnboarding =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("skipOnboarding");
  const needOnboarding = !user && !kidSettings.onboarded && !skipOnboarding;

  const handleRegister = async (data) => {
    const u = await register(data);
    setShowUserLogin(false);
    setShowUserRegister(false);
    return u;
  };

  const handleOnboardingComplete = async ({ name, grade, gender }) => {
    const displayName = String(name || "").trim();
    const password = randomPassword();
    let lastError = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const u = await register({
          username: usernameFromName(displayName),
          password,
          generatedPassword: password,
          name: displayName,
          // Server chỉ nhận mã tuổi + giới tính — avatar vẽ theo giới tính này
          // nên bé gái không còn bị mặc định thành bé trai.
          ageCode: ageCodeForGrade(grade),
          gender: gender || null,
        });
        completeOnboarding({ name: displayName, grade, gender });
        setShowUserLogin(false);
        setShowUserRegister(false);
        return u;
      } catch (err) {
        lastError = err;
        const message = err?.message || "";
        if (!/tồn tại|đã được sử dụng/i.test(message)) throw err;
      }
    }
    throw lastError;
  };

  const handleLogout = async () => {
    await logout();
    setShowUserLogin(false);
    setShowUserRegister(false);
    /* Đăng xuất là phải rời trang đang ở (profile/chat/admin) về trang chủ —
     * ở lại sẽ kẹt trên màn hình "chưa đăng nhập" vì dữ liệu đã bị xoá. */
    navigate("/");
  };

  /* `userAuth` phải là một object ÔN ĐỊNH. Nhiều trang (Profile, SpinWheel,
   * FindFriends, StudentApp, HtmlGameLoader) đặt nó làm dep của useEffect để
   * gọi `/auth/me`; nếu mỗi lần App render đều tạo object mới thì các hiệu ứng
   * đó chạy lại liên tục — một lần setKidSettings là đủ tạo vòng lặp
   * render → gọi /me → setKidSettings → … */
  const userAuth = useMemo(() => (user ? { user, token } : null), [user, token]);

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
        coopSession={coopSession}
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
    inventory: () => (
      <RouteShell toast={toast} showBack={false}>
        <InventoryPage userAuth={userAuth} onBack={() => navigate("/")} />
      </RouteShell>
    ),
    store: () => (
      <RouteShell toast={toast} showBack={false}>
        <StorePage userAuth={userAuth} onBack={() => navigate("/")} showToast={showToast} />
      </RouteShell>
    ),
    leaderboard: () => (
      <RouteShell toast={toast} showBack={false}>
        <LeaderboardPage userAuth={userAuth} onBack={() => navigate("/")} />
      </RouteShell>
    ),
    achievements: () => (
      <RouteShell toast={toast} showBack={false}>
        <AchievementsPage userAuth={userAuth} onBack={() => navigate("/")} />
      </RouteShell>
    ),
    reminders: () => (
      <RouteShell toast={toast} showBack={false}>
        <RemindersPage userAuth={userAuth} onBack={() => navigate("/")} showToast={showToast} />
      </RouteShell>
    ),
    // Trang phân tích học tập bằng AI — yêu cầu đăng nhập vì AI Service xác thực token.
    "ai-learning": () => {
      if (!userAuth) {
        return (
          <RouteShell toast={toast}>
            <LoginScreen onBack={() => navigate("/")} onLogin={handleLogin} showToast={showToast} />
          </RouteShell>
        );
      }
      return (
        <RouteShell toast={toast}>
          <AiLearningAnalysisPage />
        </RouteShell>
      );
    },
    "assignment-join": () => <AssignmentJoin />,
    "assignment-take": () => <AssignmentTake code={route.params?.code} />,
    "math-adventure": () => <MathAdventurePage />,
    "school-mission": () => <SchoolMissionPage />,
    pet: () => <PetPage />,
    "pet-wardrobe": () => <PetWardrobePage />,
    attendance: () => <AttendancePage userAuth={userAuth} />,
    // Game offline thư giãn — mỗi game 1 file HTML riêng
    "offline-game": () => <OfflineGamePage gameId={route.params?.gameId} />,
  };

  const renderScreen = () => {
    if (needOnboarding && !user) return <OnboardingScreen onComplete={handleOnboardingComplete} />;

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
    <GameVersionProvider>
      <Suspense fallback={<PageLoading />}>
        {renderScreen()}
      </Suspense>
      <PWAInstallPrompt />
    </GameVersionProvider>
  );
}

export default App;
