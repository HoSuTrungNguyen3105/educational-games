import { useEffect, useMemo, useRef, useState } from 'react'
import { gameService, coinService, notificationService, API_BASE } from '../services/api.js'
import { getLevelProgress, getLevelEmoji } from '../lib/utils.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { PrimaryButton, Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'
import { AvatarPreviewSmall } from '../components/avatar/AvatarPreview.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'
import DailyTasksCard from '../components/DailyTasksCard.jsx'
import { requestNotificationPermission, onForegroundMessage, getPushSupportStatus } from '../firebase/messaging.js'
import {
  Home,
  ClipboardList,
  MessageCircle,
  Search,
  Coins,
  User,
  Ticket,
  Gamepad2,
  GraduationCap,
  BookOpen,
  Trophy,
  LogOut,
  KeyRound,
  Sparkles,
  PartyPopper,
  Menu,
  X,
  Star,
  Sun,
  Medal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Flame,
  Gift,
  Users,
  Bell,
  Crown,
  ListChecks,
  ShipWheel,
  FileText,
  Sprout,
  Settings,
} from 'lucide-react'

// Bảng màu theo môn học
const SUBJECT_PALETTE = [
  { grad: "from-purple-400 to-fuchsia-400", chip: "bg-purple-100 text-purple-700 border-purple-200", solid: "bg-purple-500", soft: "bg-purple-50", hover: "hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700" },
  { grad: "from-orange-400 to-amber-400", chip: "bg-amber-100 text-amber-700 border-amber-200", solid: "bg-amber-500", soft: "bg-amber-50", hover: "hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700" },
  { grad: "from-cyan-400 to-blue-400", chip: "bg-cyan-100 text-cyan-700 border-cyan-200", solid: "bg-cyan-500", soft: "bg-cyan-50", hover: "hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-700" },
  { grad: "from-emerald-400 to-teal-400", chip: "bg-emerald-100 text-emerald-700 border-emerald-200", solid: "bg-emerald-500", soft: "bg-emerald-50", hover: "hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700" },
  { grad: "from-pink-400 to-rose-400", chip: "bg-pink-100 text-pink-700 border-pink-200", solid: "bg-pink-500", soft: "bg-pink-50", hover: "hover:bg-pink-50 hover:border-pink-400 hover:text-pink-700" },
  { grad: "from-indigo-400 to-violet-400", chip: "bg-indigo-100 text-indigo-700 border-indigo-200", solid: "bg-indigo-500", soft: "bg-indigo-50", hover: "hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700" },
];

function colorForSubject(subject = "") {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash = (subject.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  return SUBJECT_PALETTE[Math.abs(hash) % SUBJECT_PALETTE.length];
}

// Nav chính — dùng chung cho sidebar desktop & menu mở rộng mobile
const NAV_ITEMS = (userAuth) => [
  { key: "home", icon: Home, label: "Trang chủ", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Game", action: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Cá nhân", path: "/profile", show: !!userAuth?.user },
];

// Truy cập nhanh — 8 ô tròn màu, dùng chung mobile + desktop
const QUICK_MENU_ITEMS = (userAuth) => [
  { key: "code", icon: Ticket, label: "Nhập mã vé", action: "code", show: true, color: "bg-pink-500" },
  { key: "garden", icon: Sprout, label: "Khu vườn", path: "/garden", show: !!userAuth?.user, color: "bg-emerald-500" },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user, color: "bg-violet-500" },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", path: "/spin-wheel", show: !!userAuth?.user, color: "bg-amber-500" },
  { key: "games", icon: Gamepad2, label: "Trò chơi", action: "scroll", show: true, color: "bg-rose-500" },
  { key: "coins", icon: Coins, label: "Ví của tôi", path: "/my-coins", show: !!userAuth?.user, color: "bg-yellow-500" },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user, color: "bg-sky-500" },
  { key: "friends", icon: Search, label: "Tìm bạn", path: "/find-friends", show: !!userAuth?.user, color: "bg-teal-500" },
  { key: "assignment", icon: FileText, label: "Bài tập", path: "/assignment", show: !!userAuth?.user, color: "bg-blue-500" },
  { key: "profile", icon: User, label: "Hồ sơ", path: "/profile", show: !!userAuth?.user, color: "bg-fuchsia-500" },
  { key: "teacher", icon: GraduationCap, label: "Giáo viên", path: "/admin", show: userAuth?.user?.role === 'admin' || userAuth?.user?.role === 'teacher', color: "bg-indigo-500" },
  { key: "login", icon: KeyRound, label: "Đăng nhập", action: "login", show: !userAuth?.user, color: "bg-purple-500" },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Minh Khang", score: 12560, medal: "gold" },
  { rank: 2, name: "Bảo An", score: 9870, medal: "silver" },
  { rank: 3, name: "Gia Hân", score: 8320, medal: "bronze" },
];

// Bottom navigation cho mobile
const BOTTOM_NAV = (userAuth) => [
  { key: "home", icon: Home, label: "Trang chủ", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Game", action: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Cá nhân", path: "/profile", show: !!userAuth?.user },
];

export default function HomeScreen({ onSelectGame, userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState("all");
  const [userCoins, setUserCoins] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const templates = useTemplates();

  const [searchQuery, setSearchQuery] = useState('');
  const [avatarLoadout, setAvatarLoadout] = useState({});
  const [avatarItems, setAvatarItems] = useState([]);

  const loadGames = async () => {
    setGames(null); setError(null);
    try {
      setGames(await gameService.list({ status: "published" }));
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => { loadGames(); }, []);

  const loadNotifications = async () => {
    if (!userAuth?.user) return;
    try {
      const all = await notificationService.list();
      setNotifications(all);
    } catch (e) { }
  };

  useEffect(() => {
    loadNotifications();
    if (userAuth?.user) {
      coinService.get().then(c => setUserCoins(c?.coins || 0)).catch(() => { });

      Promise.all([
        fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
        fetch(`${API_BASE}/avatar/loadout`, { headers: { Authorization: `Bearer ${userAuth.token}` } }).then(r => r.json()),
      ]).then(([itemsRes, loadoutRes]) => {
        if (itemsRes.status) setAvatarItems(itemsRes.data.items || []);
        if (loadoutRes.status) setAvatarLoadout(loadoutRes.data.loadout || {});
      }).catch(() => { });

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        requestNotificationPermission().then((token) => {
          if (token) notificationService.registerDevice(token, "WEB").catch(() => { });
        }).catch(() => { });
      }
    }
  }, [userAuth?.user]);

  const [pushStatus, setPushStatus] = useState(() => getPushSupportStatus());
  const [testingPush, setTestingPush] = useState(false);
  const [pushMessage, setPushMessage] = useState("");

  const handleEnablePush = async () => {
    try {
      setPushMessage("Đang xin quyền thông báo...");
      const token = await requestNotificationPermission();
      setPushStatus(getPushSupportStatus());
      if (token) {
        await notificationService.registerDevice(token, "WEB");
        setPushMessage("✅ Đã bật thông báo thành công!");
      } else {
        setPushMessage("⚠️ Chưa thể cấp quyền. Hãy kiểm tra cài đặt trình duyệt hoặc thêm vào Màn hình chính.");
      }
    } catch (err) {
      setPushMessage("❌ Lỗi: " + (err.message || "Không thể bật thông báo"));
    }
  };

  const handleTestPush = async () => {
    try {
      setTestingPush(true);
      setPushMessage("Đang gửi thông báo thử nghiệm...");
      const res = await notificationService.testPush();
      if (res?.sent > 0) {
        setPushMessage(`🎉 Đã gửi thông báo thành công tới ${res.sent} thiết bị!`);
      } else if (res?.reason === "no_registered_devices") {
        setPushMessage("⚠️ Chưa có thiết bị nào được đăng ký. Hãy nhấn 'Bật thông báo đẩy' trước!");
      } else if (res?.reason === "fcm_not_configured") {
        setPushMessage("⚠️ Backend Render chưa cấu hình FIREBASE_SERVICE_ACCOUNT.");
      } else {
        setPushMessage("⚠️ Kết quả: " + JSON.stringify(res));
      }
    } catch (err) {
      setPushMessage("❌ Lỗi gửi thông báo: " + (err.message || "Thất bại"));
    } finally {
      setTestingPush(false);
    }
  };

  useEffect(() => {
    if (!userAuth?.user) return;
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};
      setNotifications(prev => [{
        id: `fg-${Date.now()}`,
        title: title || "Thông báo",
        message: body || "",
        type: data.type || "SYSTEM",
        data,
        read: false,
        createdAt: new Date().toISOString(),
      }, ...prev]);
    });
    return unsubscribe;
  }, [userAuth?.user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      loadNotifications();
    } catch (e) { }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      loadNotifications();
    } catch (e) { }
  };

  const lv = getLevelProgress(userCoins);

  const handleClaimCoins = (newCoins) => {
    setUserCoins(newCoins);
  };

  const hotGames = games ? [...games].sort((a, b) => (b.playersCount || 0) - (a.playersCount || 0)).slice(0, 8) : [];
  const newGames = games ? [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6) : [];

  const subjects = useMemo(() => {
    if (!games) return [];
    return [...new Set(games.map(g => g.subject).filter(Boolean))];
  }, [games]);

  const visibleGames = useMemo(() => {
    if (!games) return [];
    if (activeSubject === "all") return games;
    return games.filter(g => g.subject === activeSubject);
  }, [games, activeSubject]);

  const filteredGames = useMemo(() => {
    if (!searchQuery.trim()) return visibleGames;
    return visibleGames.filter(g => g.name?.toLowerCase().includes(searchQuery.toLowerCase()) || g.subject?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [visibleGames, searchQuery]);

  const isFiltering = activeSubject !== "all";

  const goTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickMenuClick = (item) => {
    if (item.action === "code") return setShowCodeModal(true);
    if (item.action === "login") return onUserLogin();
    if (item.action === "scroll") return scrollTo('games-section');
    if (item.path) return goTo(item.path);
  };

  const handleNavClick = (item) => {
    if (item.action === "scroll") return scrollTo(item.target);
    if (item.path) return goTo(item.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-purple-50/50 to-pink-50 pb-20 lg:pb-0">

      {/* ═══════════════════════════ THANH TRÊN CÙNG (desktop) ═══════════════════════════ */}
      <header className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-6">
          <a href="#/" onClick={() => navigate("/")} className="shrink-0">
            <img src={`${import.meta.env.BASE_URL}eduplay-logo.png`} alt="EduPlay" className="h-14 w-auto object-contain" draggable={false} />
          </a>

          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Tìm kiếm game, nhiệm vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-transparent rounded-full pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-100"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {userAuth?.user ? (
              <>
                <a onClick={() => navigate("/my-coins")} href="#/my-coins" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full pl-2 pr-3 py-1.5 hover:bg-amber-100 transition">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs"><Coins className="w-3.5 h-3.5" /></span>
                  {userCoins.toLocaleString()}
                </a>
                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full hover:bg-purple-50 transition text-purple-600">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 text-[9px] leading-4 text-center bg-red-500 text-white rounded-full border-2 border-white font-bold">{unreadCount}</span>}
                  </button>
                  {showNotifications && (
                    <NotificationDropdown
                      notifications={notifications}
                      unreadCount={unreadCount}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onClose={() => setShowNotifications(false)}
                      onSelectGame={onSelectGame}
                      pushStatus={pushStatus}
                      onEnablePush={handleEnablePush}
                      onTestPush={handleTestPush}
                      testingPush={testingPush}
                      pushMessage={pushMessage}
                    />
                  )}
                </div>
                <a onClick={() => navigate("/profile")} href="#/profile" className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-purple-50 transition">
                  <span className="w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-white shrink-0">
                    {avatarItems.length > 0 ? (
                      <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={40} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-lg"><User className="w-5 h-5" /></div>
                    )}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </a>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={onUserRegister} className="text-sm font-semibold text-purple-600 px-4 py-2 rounded-full hover:bg-purple-50 transition">
                  Đăng ký
                </button>
                <button onClick={onUserLogin} className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition shadow-sm">
                  <KeyRound className="w-4 h-4 inline mr-1" /> Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="lg:flex w-full">

        {/* ═══════════════════════════ SIDEBAR (desktop) ═══════════════════════════ */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] px-4 py-6 gap-1">
          {NAV_ITEMS(userAuth).filter(i => i.show).map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 text-sm font-bold px-4 py-3 rounded-2xl text-left transition ${i === 0 ? "bg-purple-500 text-white shadow-md shadow-purple-200" : "text-gray-500 hover:bg-purple-50 hover:text-purple-700"
                  }`}
              >
                <Icon className="w-5 h-5" /> {item.label}
              </button>
            );
          })}
          {(userAuth?.user?.role === 'admin' || userAuth?.user?.role === 'teacher') && (
            <button onClick={() => goTo("/admin")} className="flex items-center gap-3 text-sm font-bold text-gray-500 px-4 py-3 rounded-2xl hover:bg-purple-50 hover:text-purple-700 transition text-left">
              <GraduationCap className="w-5 h-5" /> Trang giáo viên
            </button>
          )}
          <div className="flex-1" />
          {userAuth?.user && (
            <button onClick={onUserLogout} className="flex items-center gap-3 text-sm font-bold text-red-500 px-4 py-3 rounded-2xl hover:bg-red-50 transition text-left">
              <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
          )}
        </aside>

        {/* ───────── Cột nội dung chính ───────── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* ═══════════════════════════ MOBILE HEADER ═══════════════════════════ */}
          <header className="lg:hidden sticky top-[var(--sat)] z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
            <div className="px-4 h-14 flex items-center justify-between gap-3">
              <a href="#/" onClick={() => navigate("/")} className="shrink-0">
                <img src={`${import.meta.env.BASE_URL}eduplay-logo.png`} alt="EduPlay" className="h-8 w-auto object-contain" draggable={false} />
              </a>
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                {userAuth?.user && (
                  <>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-1">
                      <Coins className="w-3.5 h-3.5" /> {userCoins.toLocaleString()}
                    </span>
                    <div className="relative">
                      <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1.5 rounded-full hover:bg-purple-50 transition text-purple-600">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 text-[8px] leading-[14px] text-center bg-red-500 text-white rounded-full border-2 border-white font-bold">{unreadCount}</span>}
                      </button>
                      {showNotifications && (
                        <NotificationDropdown
                          notifications={notifications}
                          unreadCount={unreadCount}
                          onMarkAsRead={handleMarkAsRead}
                          onMarkAllAsRead={handleMarkAllAsRead}
                          onClose={() => setShowNotifications(false)}
                          onSelectGame={onSelectGame}
                          pushStatus={pushStatus}
                          onEnablePush={handleEnablePush}
                          onTestPush={handleTestPush}
                          testingPush={testingPush}
                          pushMessage={pushMessage}
                        />
                      )}
                    </div>
                  </>
                )}
                {userAuth?.user ? (
                  <button onClick={() => setMobileMenuOpen(v => !v)} className="flex items-center gap-0.5">
                    <span className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      {avatarItems.length > 0 ? (
                        <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={32} />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-sm"><User className="w-4 h-4" /></div>
                      )}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ) : (
                  <button onClick={onUserLogin} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Vào
                  </button>
                )}
              </div>
            </div>
            {mobileMenuOpen && (
              <div className="border-t border-purple-100 px-3 py-2 flex flex-col gap-1 bg-white">
                {NAV_ITEMS(userAuth).filter(i => i.show).map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.key} onClick={() => { handleNavClick(item); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                      <Icon className="w-5 h-5" /> {item.label}
                    </button>
                  );
                })}
                {(userAuth?.user?.role === 'admin' || userAuth?.user?.role === 'teacher') && (
                  <button onClick={() => goTo("/admin")} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                    <GraduationCap className="w-5 h-5" /> Trang giáo viên
                  </button>
                )}
                {userAuth?.user && (
                  <button onClick={() => { onUserLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm font-semibold text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left">
                    <LogOut className="w-5 h-5" /> Đăng xuất
                  </button>
                )}
              </div>
            )}
          </header>

          {/* ═══════════════════════════ MOBILE CONTENT ═══════════════════════════ */}
          <main className="flex-1 w-full px-3 space-y-3 py-3 lg:hidden">
            <HeroBanner userAuth={userAuth} lv={lv} onOpenCode={() => setShowCodeModal(true)} />

            <QuickMenuCard userAuth={userAuth} onItemClick={handleQuickMenuClick} />

            <TasksCard onClaimCoins={handleClaimCoins} onSeeAll={() => navigate('/daily-tasks')} />

            {games !== null && hotGames.length > 0 && (
              <HotGamesRow games={hotGames} templates={templates} onSelect={onSelectGame} onSeeAll={() => scrollTo('games-section')} />
            )}

            {subjects.length > 0 && (
              <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  <h3 className="font-display text-sm font-bold text-gray-800">Môn học</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  <button onClick={() => setActiveSubject('all')} className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all duration-200 ${activeSubject === 'all' ? 'bg-purple-500 text-white shadow-sm' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}>
                    Tất cả
                  </button>
                  {subjects.map(sub => (
                    <button key={sub} onClick={() => setActiveSubject(sub)} className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-all duration-200 ${activeSubject === sub ? 'bg-purple-500 text-white shadow-sm' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}`}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div id="games-section" className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </span>
                  Trò chơi
                </h2>
                <span className="text-xs text-gray-400 font-semibold">{filteredGames.length} trò</span>
              </div>
              {games === null ? (
                <Loader label="Đang tải..." />
              ) : error ? (
                <ErrorState title="Lỗi" subtitle={error} onRetry={loadGames} />
              ) : filteredGames.length === 0 ? (
                <EmptyState icon={Search} title="Không tìm thấy" subtitle="Thử từ khóa khác nhé!" />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredGames.map((g, idx) => {
                    const color = colorForSubject(g.subject);
                    const template = templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid));
                    return (
                      <button key={g._id || g.id} onClick={() => onSelectGame(g)} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start animate-fade-in-up focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center mb-2 relative`}>
                          <StampToken icon={template?.icon || <Gamepad2 className="w-6 h-6" />} ring="#fff" size={40} fontSize={18} />
                          {g.playersCount > 0 && (
                            <span className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Users className="w-2.5 h-2.5" /> {g.playersCount}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-display text-gray-800 line-clamp-1 text-left">{g.name}</h3>
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-500">
                          <span className={`px-1.5 py-0.5 rounded ${color.chip}`}>{g.subject}</span>
                          <span className="bg-gray-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <ListChecks className="w-2.5 h-2.5" /> {g.questionsCount}
                          </span>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          Chơi ngay <ChevronRight className="w-3 h-3" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <PromoBanner onExplore={() => scrollTo('games-section')} />
          </main>

          {/* ═══════════════════════════ DESKTOP CONTENT ═══════════════════════════ */}
          <main className="hidden lg:block flex-1 w-full p-6 space-y-6 max-w-6xl">
            <HeroBanner userAuth={userAuth} lv={lv} onOpenCode={() => setShowCodeModal(true)} desktop />

            <QuickMenuCard userAuth={userAuth} onItemClick={handleQuickMenuClick} desktop />

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <DashboardCard icon={ClipboardList} title="Nhiệm vụ hôm nay" gradient="from-violet-500 to-purple-500" onSeeAll={() => navigate('/daily-tasks')}>
                <DailyTasksCard onClaimCoins={handleClaimCoins} />
              </DashboardCard>

              <UserInfoCard userAuth={userAuth} lv={lv} userCoins={userCoins} avatarItems={avatarItems} avatarLoadout={avatarLoadout} />
            </section>

            {subjects.length > 0 && (
              <section id="subjects-section">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader icon={BookOpen} title="Môn học" gradient="from-cyan-500 to-blue-500" noMargin />
                  <button onClick={() => scrollTo('games-section')} className="text-xs font-semibold text-purple-500 hover:text-purple-700 transition shrink-0">Xem tất cả →</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  <SubjectTile
                    label="Tất cả"
                    icon={Sparkles}
                    active={activeSubject === "all"}
                    onClick={() => setActiveSubject("all")}
                    classes={{ solid: "bg-gray-400", soft: "bg-gray-50", chip: "text-gray-700 border-gray-200", hover: "hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700" }}
                  />
                  {subjects.map(subject => (
                    <SubjectTile
                      key={subject}
                      label={subject}
                      icon={BookOpen}
                      active={activeSubject === subject}
                      onClick={() => setActiveSubject(subject)}
                      classes={colorForSubject(subject)}
                    />
                  ))}
                </div>
              </section>
            )}

            {games !== null && !error && hotGames.length > 0 && (
              <GameCarousel games={hotGames} templates={templates} onSelect={onSelectGame} />
            )}

            <PromoBanner onExplore={() => scrollTo('games-section')} />

            <section id="games-section">
              {games === null ? (
                <Loader label="Đang tải danh sách trò chơi..." />
              ) : error ? (
                <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
              ) : games.length === 0 ? (
                <EmptyState icon={PartyPopper} title="Chưa có trò chơi nào" subtitle="Giáo viên chưa xuất bản trò chơi nào. Hãy thử nhập mã vé hoặc quay lại sau nhé!" />
              ) : isFiltering ? (
                <div>
                  <SectionHeader icon={Search} title={`Môn ${activeSubject}`} gradient="from-purple-500 to-indigo-500" />
                  {filteredGames.length === 0 ? (
                    <EmptyState icon={Search} title="Chưa có trò chơi cho môn này" subtitle="Thử chọn môn khác hoặc bấm 'Tất cả' để xem hết trò chơi nhé!" />
                  ) : (
                    <GameGrid games={filteredGames} templates={templates} onSelect={onSelectGame} />
                  )}
                </div>
              ) : (
                <div className="space-y-10">
                  {newGames.length > 0 && (
                    <div>
                      <SectionHeader icon={Sparkles} title="Trò chơi mới" gradient="from-emerald-500 to-teal-500" />
                      <GameGrid games={newGames} templates={templates} onSelect={onSelectGame} isNew />
                    </div>
                  )}

                  <div>
                    <SectionHeader icon={Trophy} title="Bảng xếp hạng" gradient="from-amber-500 to-yellow-500" />
                    <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-5 max-w-md">
                      {MOCK_LEADERBOARD.map(row => (
                        <div key={row.rank} className="flex items-center gap-3 py-1.5">
                          <Medal className={`w-5 h-5 ${row.medal === 'gold' ? 'text-amber-400' : row.medal === 'silver' ? 'text-gray-300' : 'text-orange-400'}`} />
                          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-xs shrink-0"><User className="w-4 h-4" /></span>
                          <span className="flex-1 text-sm font-semibold text-gray-700 truncate">{row.name}</span>
                          <span className="text-sm font-bold text-amber-600">{row.score.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <SectionHeader icon={Gamepad2} title="Tất cả trò chơi" gradient="from-purple-500 to-indigo-500" />
                    <GameGrid games={games} templates={templates} onSelect={onSelectGame} />
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* ═══════════════ BOTTOM NAVIGATION (chỉ mobile) ═══════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-purple-100 shadow-lg" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex justify-around items-center h-16">
          {BOTTOM_NAV(userAuth).filter(i => i.show).map(item => {
            const Icon = item.icon;
            const isActive = item.key === 'home' || (item.path && window.location.hash === `#${item.path}`);
            return (
              <button key={item.key} onClick={() => handleNavClick(item)} className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 ${isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-purple-500'}`}>
                <Icon className="w-5 h-5" />
                {item.key === 'chat' && unreadCount > 0 && (
                  <span className="absolute top-0.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onSelectGame} />
    </div>
  );
}

// ═══════════════ Banner chào mừng (cấp độ + tiến độ) ═══════════════
function HeroBanner({ userAuth, lv, onOpenCode, desktop }) {
  // Desktop: ảnh banner phủ toàn bộ nền, chữ + tiến độ đè lên trên.
  // Mobile: không dùng ảnh, chỉ nền gradient như bản gốc.
  if (desktop) {
    const bannerSrc = `${import.meta.env.BASE_URL}banner.png`;
    return (
      <section
        className="relative overflow-hidden rounded-3xl text-white shadow-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-cover bg-center min-h-[280px] flex items-center"
        style={{ backgroundImage: `url(${bannerSrc})` }}
      >
        {/* lớp phủ tối để chữ luôn đọc được trên ảnh */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" aria-hidden="true" />
        <div className="relative p-8 max-w-md">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 rounded-full px-3 py-1 mb-3">
            👋 {userAuth?.user ? `Chào mừng trở lại!` : "Chào mừng bạn đến với"}
          </p>
          <h1 className="font-display leading-tight mb-2 text-3xl">
            {userAuth?.user ? `Xin chào, ${userAuth.user.name}!` : "Học mà chơi, chơi mà giỏi!"}
          </h1>
          <p className="text-white/85 mb-4 text-sm max-w-sm">
            Cùng khám phá những thử thách thú vị và tích lũy điểm thưởng nhé!
          </p>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-2.5 max-w-xs">
            <span className="text-xs font-bold bg-white/20 rounded-full px-2.5 py-1 flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5" /> Cấp {lv.level}
            </span>
            <div className="flex-1 min-w-0">
              <div className="h-2 rounded-full bg-white/25 overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${lv.percent ?? 0}%` }} />
              </div>
            </div>
            <span className="text-[10px] font-mono shrink-0">{(lv.earned ?? 0).toLocaleString()}/{(lv.needed ?? 0).toLocaleString()}</span>
          </div>
          {!userAuth?.user && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={onOpenCode} className="text-xs font-bold bg-white text-purple-600 px-4 py-2 rounded-full shadow-sm hover:bg-white/90 transition">
                <KeyRound className="w-3.5 h-3.5 inline mr-1" /> Nhập mã vé
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onOpenCode}
          aria-label="Nhập mã vé"
          className="absolute right-4 bottom-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </section>
    );
  }

  // ── Mobile: giữ như bản hiện tại, không có ảnh banner ──
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 p-4 text-white shadow-lg">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" aria-hidden="true" />
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide opacity-80">Thành viên</p>
          <p className="font-display text-base">{userAuth?.user?.name || 'Khách'}</p>
        </div>
        <div className="bg-white/20 rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3" /> Cấp {lv.level}
        </div>
      </div>
      <div className="h-1.5 bg-white/30 rounded-full mb-3">
        <div className="h-full bg-white rounded-full" style={{ width: `${lv.percent || 0}%` }}></div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-90">{getLevelEmoji(lv.level)} {lv.earned}/{lv.needed} xu</span>
      </div>
    </section>
  );
}

// ═══════════════ Truy cập nhanh ═══════════════
function QuickMenuCard({ userAuth, onItemClick, desktop }) {
  const items = QUICK_MENU_ITEMS(userAuth).filter(i => i.show).slice(0, 8);
  return (
    <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
      {desktop && (
        <div className="mb-4">
          <h3 className="font-display text-sm font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-500" /> Truy cập nhanh
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Chọn chức năng bạn muốn sử dụng</p>
        </div>
      )}
      <div className={desktop ? "grid grid-cols-8 gap-3" : "grid grid-cols-5 gap-2"}>
        {items.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.key} onClick={() => onItemClick(item)} className="flex flex-col items-center gap-1.5 group focus:outline-none">
              <span className={`${desktop ? "w-14 h-14" : "w-12 h-12"} rounded-full ${item.color} text-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-90 group-focus-visible:ring-2 group-focus-visible:ring-purple-300 transition-all duration-200`}>
                <Icon className={desktop ? "w-6 h-6" : "w-5 h-5"} />
              </span>
              <span className={`${desktop ? "text-xs" : "text-[9px]"} font-semibold text-gray-600 text-center leading-tight line-clamp-1`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════ Nhiệm vụ hôm nay (mobile) ═══════════════
function TasksCard({ onClaimCoins, onSeeAll }) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-bold text-gray-800 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-violet-500" /> Nhiệm vụ hôm nay
        </h3>
        <span className="text-[10px] font-bold text-violet-600 bg-violet-50 rounded-full px-2.5 py-1">Hôm nay</span>
      </div>
      <DailyTasksCard compact onClaimCoins={onClaimCoins} />
      <button onClick={onSeeAll} className="w-full text-center text-xs font-semibold text-purple-500 mt-2">Xem tất cả →</button>
    </div>
  );
}

// ═══════════════ Thông tin người dùng (desktop) ═══════════════
function UserInfoCard({ userAuth, lv, userCoins, avatarItems, avatarLoadout }) {
  if (!userAuth?.user) {
    return (
      <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-5 flex flex-col items-center justify-center text-center">
        <PartyPopper className="w-8 h-8 text-purple-400 mb-2" />
        <p className="text-sm text-gray-600">Đăng nhập để lưu điểm & coin của bạn nhé!</p>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-500 text-white p-5 shadow-md flex flex-col">
      <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" aria-hidden="true" />
      <div className="relative flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-bold flex items-center gap-2">
          <User className="w-4 h-4" /> Thông tin người dùng
        </h3>
        <button onClick={() => navigate('/profile')} aria-label="Cài đặt hồ sơ" className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition">
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="relative flex items-center gap-3 mb-4">
        <span className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white/40">
          {avatarItems.length > 0 ? (
            <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={56} />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl"><User className="w-6 h-6" /></div>
          )}
        </span>
        <div className="min-w-0">
          <p className="font-display text-base truncate">{userAuth.user.name}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 rounded-full px-2 py-0.5 mt-1">
            {getLevelEmoji(lv.level)} Cấp {lv.level}
          </span>
        </div>
      </div>
      <div className="relative h-1.5 bg-white/25 rounded-full mb-1">
        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${lv.percent ?? 0}%` }} />
      </div>
      <p className="relative text-[11px] text-white/80 mb-4">{(lv.earned ?? 0).toLocaleString()}/{(lv.needed ?? 0).toLocaleString()} xu</p>
      <button onClick={() => navigate('/my-coins')} className="relative bg-white/15 hover:bg-white/25 rounded-2xl px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-bold transition mb-3">
        <Coins className="w-4 h-4" /> {userCoins.toLocaleString()} xu hiện có
      </button>
      <p className="relative text-xs text-white/75 italic mt-auto">"Mỗi ngày học thêm một chút, bạn sẽ tiến xa hơn!" ✨</p>
    </div>
  );
}

// ═══════════════ Game nổi bật — cuộn ngang (mobile) ═══════════════
function HotGamesRow({ games, templates, onSelect, onSeeAll }) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-display text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-purple-500" /> Game nổi bật
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Những trò chơi được nhiều bạn yêu thích nhất</p>
        </div>
        <button onClick={onSeeAll} className="text-xs font-semibold text-purple-500 shrink-0">Xem tất cả →</button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {games.slice(0, 6).map(g => {
          const color = colorForSubject(g.subject);
          const template = templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid));
          return (
            <button key={g._id || g.id} onClick={() => onSelect(g)} className="shrink-0 w-32 text-left">
              <div className={`w-32 h-24 rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center relative mb-1.5`}>
                <StampToken icon={template?.icon || <Gamepad2 className="w-6 h-6" />} ring="#fff" size={36} fontSize={16} />
                {g.playersCount > 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Users className="w-2 h-2" /> {g.playersCount}
                  </span>
                )}
              </div>
              <p className="text-xs font-display text-gray-800 line-clamp-1">{g.name}</p>
              <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 ${color.chip}`}>{g.subject}</span>
              <span className="mt-1.5 flex items-center justify-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                Chơi ngay <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════ Game nổi bật — carousel với mũi tên (desktop) ═══════════════
function GameCarousel({ games, templates, onSelect }) {
  const scrollerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollByCards = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = 260;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIdx(Math.min(idx, Math.ceil(games.length / 3) - 1));
  };

  const pageCount = Math.max(1, Math.ceil(games.length / 3));

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <SectionHeader icon={Flame} title="Game nổi bật" gradient="from-red-500 to-orange-500" noMargin />
          <p className="text-xs text-gray-400 mt-1 ml-1">Những trò chơi được nhiều bạn yêu thích nhất</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scrollByCards(-1)} aria-label="Trước" className="w-8 h-8 rounded-full bg-white border border-purple-100 shadow-sm flex items-center justify-center text-purple-500 hover:bg-purple-50 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scrollByCards(1)} aria-label="Tiếp" className="w-8 h-8 rounded-full bg-white border border-purple-100 shadow-sm flex items-center justify-center text-purple-500 hover:bg-purple-50 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollerRef} onScroll={handleScroll} className="flex gap-5 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
        {games.map(g => {
          const color = colorForSubject(g.subject);
          const template = templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid));
          return (
            <button key={g._id || g.id} onClick={() => onSelect(g)} className="shrink-0 w-60 bg-white rounded-2xl p-3 text-left shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-purple-200">
              <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center mb-2.5 relative`}>
                <StampToken icon={template?.icon || <Gamepad2 className="w-6 h-6" />} ring="#ffffff" size={48} fontSize={22} />
                {g.playersCount > 0 && (
                  <span className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Users className="w-2.5 h-2.5" /> {g.playersCount}
                  </span>
                )}
              </div>
              <h3 className="font-display text-sm text-gray-800 leading-tight mb-1.5 line-clamp-1">{g.name}</h3>
              <div className="flex items-center gap-1 text-[10px] font-mono mb-2">
                <span className={`px-1.5 py-0.5 rounded ${color.chip}`}>{g.subject}</span>
                <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-0.5"><ListChecks className="w-3 h-3" />{g.questionsCount}</span>
              </div>
              <span className="inline-flex items-center justify-center gap-1.5 w-full text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full py-1.5">
                Chơi ngay <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>
      {pageCount > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: pageCount }).map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === activeIdx ? "w-5 bg-purple-500" : "w-1.5 bg-purple-200"}`} />
          ))}
        </div>
      )}
    </section>
  );
}

// ═══════════════ Banner quảng bá cuối trang ═══════════════
function PromoBanner({ onExplore }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white p-5 flex items-center justify-between gap-4 shadow-md">
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-base sm:text-lg leading-tight mb-1">Cùng nhau chinh phục<br className="sm:hidden" /> những thử thách mới!</p>
        <p className="text-xs sm:text-sm text-white/80">Game mới đang chờ bạn khám phá!</p>
      </div>
      <button onClick={onExplore} className="relative shrink-0 bg-white text-indigo-600 text-xs sm:text-sm font-bold px-4 py-2 rounded-full hover:bg-white/90 transition">
        Khám phá ngay →
      </button>
    </section>
  );
}

// ═══════════════ Component phụ trợ dùng chung ═══════════════
function DashboardCard({ icon: IconComponent, title, gradient, onSeeAll, children, id }) {
  return (
    <div id={id} className="bg-white rounded-3xl shadow-md border border-purple-50 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-3 py-1.5 rounded-full shadow-sm`}>
          <IconComponent className="w-4 h-4" />
          <h2 className="font-display text-sm font-bold">{title}</h2>
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll} className="text-xs font-semibold text-purple-500 hover:text-purple-700 transition">
            Xem tất cả →
          </button>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SectionHeader({ icon: IconComponent, title, gradient, pulse, noMargin }) {
  return (
    <div className={`flex items-center gap-3 ${noMargin ? "" : "mb-4"}`}>
      <div className={`flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full shadow-md ${pulse ? "animate-pulse-glow" : ""}`}>
        <IconComponent className="w-5 h-5" />
        <h2 className="font-display text-base font-bold">{title}</h2>
      </div>
      {!noMargin && <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-200 to-transparent rounded-full"></div>}
    </div>
  );
}

function SubjectTile({ label, icon: IconComponent, active, onClick, classes }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-4 border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 ${active ? `${classes.soft} border-current ${classes.chip} shadow-md scale-[1.03]` : `bg-white border-gray-100 text-gray-600 ${classes.hover}`
        }`}
    >
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm ${classes.solid}`}><IconComponent className="w-5 h-5" /></span>
      <span className="text-xs font-bold text-center leading-tight line-clamp-1">{label}</span>
    </button>
  );
}

function GameGrid({ games, templates, onSelect, badges, badgeColors, isNew }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
      {games.map((g, index) => (
        <GameCard
          key={g._id?.toString() || g.id}
          game={g}
          template={templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid))}
          onSelect={onSelect}
          index={index}
          badge={badges ? badges[index] : null}
          badgeColor={badgeColors ? badgeColors[index] : null}
          isNew={isNew}
        />
      ))}
    </div>
  );
}

function GameCard({ game, template, onSelect, index, badge, badgeColor, isNew }) {
  const color = colorForSubject(game.subject);
  return (
    <button
      onClick={() => onSelect(game)}
      aria-label={`Chơi ${game.name}`}
      className="group relative bg-white rounded-2xl p-3 text-left shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-200 overflow-hidden flex flex-col animate-fade-in-up focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {(badge || isNew) && (
        <div className={`absolute top-2 right-2 flex items-center gap-1 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 bg-gradient-to-r ${badge ? badgeColor : "from-emerald-400 to-teal-400"}`}>
          {badge ? (
            index === 0 ? <Crown className="w-3 h-3" /> : <Medal className="w-3 h-3" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {badge || "MỚI"}
        </div>
      )}

      <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center mb-2.5 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
        <StampToken icon={template ? template.icon : <Gamepad2 className="w-6 h-6" />} ring="#ffffff" size={48} fontSize={22} />
        {game.playersCount > 0 && (
          <span className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Users className="w-2.5 h-2.5" /> {game.playersCount}
          </span>
        )}
      </div>

      <h3 className="font-display text-sm text-gray-800 leading-tight mb-1.5 group-hover:text-purple-700 transition-colors line-clamp-2">
        {game.name}
      </h3>

      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono mb-2">
        <span className={`px-1.5 py-0.5 rounded ${color.chip}`}>{game.subject}</span>
        <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-0.5"><ListChecks className="w-3 h-3" />{game.questionsCount}</span>
      </div>

      <span className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full py-1.5 group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
        Chơi ngay <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}

function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  onSelectGame,
  pushStatus,
  onEnablePush,
  onTestPush,
  testingPush,
  pushMessage,
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}></div>
      <div className="fixed right-0 top-14 w-84 max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-50 lg:absolute lg:top-auto lg:right-0 lg:mt-2 lg:z-50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50 bg-purple-50/60">
          <h3 className="font-bold text-gray-800 text-sm">Thông báo</h3>
          {unreadCount > 0 && (
            <button onClick={onMarkAllAsRead} className="text-xs text-purple-600 hover:text-purple-800 font-medium">
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        <div className="p-3 bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-b border-purple-100 text-xs">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-semibold text-gray-700 flex items-center gap-1">
              📱 Thông báo đẩy (Push)
            </span>
            {pushStatus?.permission === "granted" ? (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                ✓ Đã bật
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                Chưa bật
              </span>
            )}
          </div>

          {pushStatus?.reason === "ios_not_standalone" ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-2.5 text-[11px] leading-relaxed mb-2">
              💡 <strong>Dành cho iPhone/iPad:</strong> Safari chỉ cho phép thông báo khi cài đặt PWA:
              <br />Nhấn nút <strong>Chia sẻ (Share)</strong> ở thanh dưới Safari ➔ Chọn <strong>&quot;Thêm vào MH chính&quot;</strong> ➔ Mở lại từ màn hình chính.
            </div>
          ) : pushStatus?.permission !== "granted" ? (
            <button
              onClick={onEnablePush}
              className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition text-center mb-1.5"
            >
              🔔 Cho phép thông báo trên điện thoại
            </button>
          ) : (
            <button
              disabled={testingPush}
              onClick={onTestPush}
              className="w-full py-1.5 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold rounded-xl transition text-center disabled:opacity-50"
            >
              {testingPush ? "Đang gửi..." : "🧪 Gửi thử thông báo tới điện thoại"}
            </button>
          )}

          {pushMessage && (
            <div className="mt-1.5 p-2 bg-white/90 rounded-lg text-[11px] text-gray-700 font-medium border border-purple-100 break-words">
              {pushMessage}
            </div>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">Không có thông báo nào</div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} onClick={() => { if (!notif.read) onMarkAsRead(notif.id); }} className={`p-3 border-b border-purple-50 hover:bg-purple-50/50 cursor-pointer transition ${!notif.read ? 'bg-purple-50/20' : ''}`}>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {notif.type === 'chat_message' ? <MessageCircle className="w-5 h-5 text-blue-500" /> : <Gamepad2 className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{notif.fromName}</span>
                      {notif.type === 'chat_message' ? ' đã gửi một tin nhắn' : ` mời bạn chơi ${notif.gameName || 'trò chơi'}`}
                    </p>
                    {notif.gameCode && (
                      <p className="text-xs text-purple-600 mt-0.5 font-mono font-semibold">Mã phòng: {notif.gameCode}</p>
                    )}
                    {notif.content && <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{notif.content}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                    {notif.type === 'game_invite' && notif.gameId && (
                      <button onClick={async (e) => {
                        e.stopPropagation();
                        onClose();
                        try {
                          const g = await gameService.get(notif.gameId);
                          if (g) onSelectGame(g);
                          else navigate('/student');
                        } catch { navigate('/student'); }
                      }}
                        className="mt-2 px-3 py-1.5 bg-purple-500 text-white text-xs font-semibold rounded-lg hover:bg-purple-600 transition">
                        Vào chơi ngay →
                      </button>
                    )}
                    {notif.type === 'chat_message' && (
                      <button onClick={(e) => { e.stopPropagation(); onClose(); navigate('/chat'); }}
                        className="mt-2 px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition">
                        Xem tin nhắn →
                      </button>
                    )}
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 ml-auto shrink-0"></div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}