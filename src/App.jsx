import { useEffect, useState } from 'react'
import { loadAuth } from './services/api.js'
import { authService } from './services/api.js'
import { getRoute, navigate } from './lib/utils.js'
import { useToast } from './lib/hooks.js'
import { Toast } from './components/ui.jsx'
import { socket } from './socket/socket.js'
import { registerSocketListeners } from './socket/socket.listeners.js'
import HomeScreen from './pages/HomeScreen.jsx'
import LoginScreen from './pages/LoginScreen.jsx'
import TeacherApp from './pages/teacher/TeacherApp.jsx'
import StudentApp from './pages/student/StudentApp.jsx'

function App() {
  const [route, setRoute] = useState(getRoute);
  const [user, setUser] = useState(null);
  const [playGame, setPlayGame] = useState(null);
  const [toast, showToast] = useToast();

  const connectSocket = (token) => {
    socket.auth = { token };
    socket.connect();
  };

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

  const handleLogin = (u) => {
    const auth = loadAuth();
    setUser(u);
    if (auth && auth.token) connectSocket(auth.token);
  };
  const handleLogout = () => {
    authService.logout();
    socket.disconnect();
    setUser(null);
    navigate("home");
  };

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