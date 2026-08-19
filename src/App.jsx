import { useEffect, useState } from 'react'
import { loadAuth } from './services/api.js'
import { authService } from './services/api.js'
import { getRoute, navigate } from './lib/utils.js'
import { useToast } from './lib/hooks.js'
import { Toast } from './components/ui.jsx'
import HomeScreen from './pages/HomeScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import TeacherApp from './pages/teacher/TeacherApp.jsx'
import StudentApp from './pages/student/StudentApp.jsx'

function App() {
  const [route, setRoute] = useState(getRoute);
  const [user, setUser] = useState(null);
  const [playGame, setPlayGame] = useState(null);
  const [toast, showToast] = useToast();

  useEffect(() => {
    const onRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", onRoute);
    window.addEventListener("popstate", onRoute);
    return () => {
      window.removeEventListener("hashchange", onRoute);
      window.removeEventListener("popstate", onRoute);
    };
  }, []);

  useEffect(() => {
    const auth = loadAuth();
    if (auth && auth.token && auth.user && (auth.user.role === "teacher" || auth.user.role === "admin")) {
      setUser(auth.user);
    }
    const onExpired = () => setUser(null);
    window.addEventListener("edu-auth-expired", onExpired);
    return () => window.removeEventListener("edu-auth-expired", onExpired);
  }, []);

  const handleLogin = (u) => setUser(u);
  const handleLogout = () => { authService.logout(); setUser(null); navigate("home"); };

  if (route === "admin") {
    if (!user) return <LoginScreen onBack={() => navigate("home")} onLogin={handleLogin} showToast={showToast} />;
    return (
      <>
        <TeacherApp user={user} onExit={handleLogout} showToast={showToast} />
        <Toast toast={toast} />
      </>
    );
  }

  if (playGame) {
    return <StudentApp initialGame={playGame} onExit={() => setPlayGame(null)} showToast={showToast} toast={toast} />;
  }

  return <HomeScreen onSelectGame={setPlayGame} />;
}

export default App