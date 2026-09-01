import { useEffect, useMemo, useState } from 'react'
import { gameService, coinService, notificationService, API_BASE } from '../services/api.js'
import { getLevelProgress, getLevelEmoji } from '../lib/utils.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { PrimaryButton, Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'
import { AvatarPreviewSmall } from '../components/avatar/AvatarPreview.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'
import DailyTasksCard from '../components/DailyTasksCard.jsx'
import { requestNotificationPermission, onForegroundMessage } from '../firebase/messaging.js'
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
  Flame,
  Gift,
  Users,
  Bell,
  Crown,
  ListChecks,
  SplineIcon,
  ShipWheel,
  FileText,
} from 'lucide-react'

// Bảng màu theo môn học — giữ nguyên
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

// NAV_ITEMS giữ nguyên
const NAV_ITEMS = (userAuth) => [
  { key: "home", icon: Home, label: "Trang chủ", path: "/", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", path: "/spin-wheel", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user },
  { key: "friends", icon: Search, label: "Tìm bạn", path: "/find-friends", show: !!userAuth?.user },
  { key: "coins", icon: Coins, label: "Ví của tôi", path: "/my-coins", show: !!userAuth?.user },
  { key: "assignment", icon: FileText, label: "Bài tập", path: "/assignment", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Hồ sơ", path: "/profile", show: !!userAuth?.user },
];

// QUICK_MENU_ITEMS giữ nguyên
const QUICK_MENU_ITEMS = (userAuth) => [
  { key: "code", icon: Ticket, label: "Nhập mã vé", action: "code", show: true, tint: "from-purple-400 to-fuchsia-400" },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user, tint: "from-violet-400 to-purple-400" },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", path: "/spin-wheel", show: !!userAuth?.user, tint: "from-amber-400 to-yellow-500" },
  { key: "games", icon: Gamepad2, label: "Trò chơi", action: "scroll", show: true, tint: "from-orange-400 to-amber-400" },
  { key: "coins", icon: Coins, label: "Ví của tôi", path: "/my-coins", show: !!userAuth?.user, tint: "from-amber-400 to-yellow-400" },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user, tint: "from-cyan-400 to-blue-400" },
  { key: "friends", icon: Search, label: "Tìm bạn", path: "/find-friends", show: !!userAuth?.user, tint: "from-emerald-400 to-teal-400" },
  { key: "assignment", icon: FileText, label: "Bài tập", path: "/assignment", show: !!userAuth?.user, tint: "from-blue-400 to-indigo-400" },
  { key: "profile", icon: User, label: "Hồ sơ", path: "/profile", show: !!userAuth?.user, tint: "from-blue-400 to-rose-400" },
  { key: "teacher", icon: GraduationCap, label: "Giáo viên", path: "/admin", show: userAuth?.user?.role === 'admin', tint: "from-indigo-400 to-violet-400" },
  { key: "login", icon: KeyRound, label: "Đăng nhập", action: "login", show: !userAuth?.user, tint: "from-purple-400 to-pink-400" },
];

// DESKTOP_TABS giữ nguyên
const DESKTOP_TABS = [
  { key: "home", icon: Home, label: "Trang chủ", type: "path", path: "/" },
  { key: "games", icon: Gamepad2, label: "Chơi game", type: "scroll", target: "games-section" },
  { key: "subjects", icon: BookOpen, label: "Học tập", type: "scroll", target: "subjects-section" },
  { key: "board", icon: Trophy, label: "Bảng xếp hạng", type: "scroll", target: "leaderboard-section" },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Minh Khang", score: 12560, medal: "gold" },
  { rank: 2, name: "Bảo An", score: 9870, medal: "silver" },
  { rank: 3, name: "Gia Hân", score: 8320, medal: "bronze" },
];

// THÊM MỚI: Bottom navigation cho mobile
const BOTTOM_NAV = (userAuth) => [
  { key: "home", icon: Home, label: "Trang chủ", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Game", action: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Cá nhân", path: "/profile", show: !!userAuth?.user },
];

export default function HomeScreen({ onSelectGame, userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  // GIỮ NGUYÊN TOÀN BỘ STATE, LOGIC
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState("all");
  const [userCoins, setUserCoins] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const templates = useTemplates();

  // THÊM MỚI: state cho search (chỉ dùng cho mobile)
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

      // Load avatar
      Promise.all([
        fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
        fetch(`${API_BASE}/avatar/loadout`, { headers: { Authorization: `Bearer ${userAuth.token}` } }).then(r => r.json()),
      ]).then(([itemsRes, loadoutRes]) => {
        if (itemsRes.status) setAvatarItems(itemsRes.data.items || []);
        if (loadoutRes.status) setAvatarLoadout(loadoutRes.data.loadout || {});
      }).catch(() => {});

      // Register FCM token for push notifications
      requestNotificationPermission().then((token) => {
        if (token) notificationService.registerDevice(token, "WEB").catch(() => {});
      }).catch(() => {});
    }
  }, [userAuth?.user]);

  // Listen for foreground push messages
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

  const hotGames = games ? [...games].sort((a, b) => (b.playersCount || 0) - (a.playersCount || 0)).slice(0, 3) : [];
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

  // THÊM MỚI: filter theo search (chỉ áp dụng cho mobile)
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

  const handleDesktopTabClick = (tab) => {
    if (tab.type === "path") return goTo(tab.path);
    if (tab.type === "scroll") return scrollTo(tab.target);
  };

  const handleBottomNavClick = (item) => {
    if (item.action === "scroll") return scrollTo(item.target);
    if (item.path) return goTo(item.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-purple-50/50 to-pink-50 pb-20 lg:pb-0">

      {/* ═══════════════════════════ THANH TRÊN CÙNG (chỉ desktop) — GIỮ NGUYÊN ═══════════════════════════ */}
      <header className="hidden lg:block sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center gap-6">
          <a href="#/" onClick={() => navigate("/")} className="flex items-center gap-2 font-display text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 shrink-0">
            <PartyPopper className="w-7 h-7 text-purple-500" /> Lớp Học Vui
          </a>

          <nav className="flex items-center gap-1 bg-purple-50/70 rounded-full p-1 mx-auto">
            {DESKTOP_TABS.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleDesktopTabClick(tab)}
                  className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all ${i === 0
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-500 hover:text-purple-700 hover:bg-white/70"
                    }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {userAuth?.user && (
              <>
                <a onClick={() => navigate("/my-coins")} href="#/my-coins" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-100 rounded-full pl-2 pr-3 py-1.5 hover:bg-amber-100 transition">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs"><Coins className="w-3.5 h-3.5" /></span>
                  {userCoins.toLocaleString()}
                </a>
                <div className="relative">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-full hover:bg-purple-50 transition text-purple-600">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                  </button>
                  {showNotifications && (
                    <NotificationDropdown notifications={notifications} unreadCount={unreadCount} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onClose={() => setShowNotifications(false)} onSelectGame={onSelectGame} />
                  )}
                </div>
              </>
            )}
            {userAuth?.user ? (
              <a onClick={() => navigate("/profile")} href="#/profile" className="w-10 h-10 rounded-full overflow-hidden shadow-sm hover:shadow-md transition ring-2 ring-white">
                {avatarItems.length > 0 ? (
                  <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={40} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-lg"><User className="w-5 h-5" /></div>
                )}
              </a>
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

        {/* ═══════════════════════════ SIDEBAR (chỉ desktop) — GIỮ NGUYÊN ═══════════════════════════ */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto px-5 py-6 gap-4">
          {/* ... TOÀN BỘ NỘI DUNG SIDEBAR CŨ ... */}
          {userAuth?.user ? (
            <>
              <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-sm mb-2 ring-2 ring-purple-100">
                    {avatarItems.length > 0 ? (
                      <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={64} />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-2xl"><User className="w-7 h-7" /></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Xin chào,</p>
                  <p className="font-display text-base text-gray-800 truncate max-w-full">{userAuth.user.name}</p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-600 mb-1">
                  <span>{getLevelEmoji(lv.level)} Cấp {lv.level}</span>
                  <span className="text-[10px] font-mono">{lv.earned ?? 0}/{lv.needed ?? 0} xu</span>
                </div>
                <div className="h-2 rounded-full bg-amber-50 overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all" style={{ width: `${lv.percent ?? 0}%` }} />
                </div>
                <a
                  onClick={() => navigate("/my-coins")}
                  href="#/my-coins"
                  className="flex items-center justify-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 rounded-2xl px-3 py-2.5 hover:bg-amber-100 transition"
                >
                  <Coins className="w-4 h-4" /> {userCoins.toLocaleString()} coin
                </a>
              </div>

              <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-sm mb-3">
                  <ClipboardList className="w-4 h-4" />
                  <h3 className="font-display text-xs font-bold">Nhiệm vụ hôm nay</h3>
                </div>
                <DailyTasksCard
                  compact
                  onClaimCoins={handleClaimCoins}
                />
                <button
                  onClick={() => navigate("/daily-tasks")}
                  className="w-full text-center text-[11px] font-semibold text-purple-500 hover:text-purple-700 transition mt-2"
                >
                  Xem tất cả →
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-5 text-center">
              <PartyPopper className="w-8 h-8 mx-auto text-purple-400 mb-2" />
              <p className="text-sm text-gray-600 mb-3">Đăng nhập để lưu điểm & coin của bạn nhé!</p>
              <button onClick={onUserLogin} className="w-full text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition mb-2">
                <KeyRound className="w-4 h-4 inline mr-1" /> Đăng nhập
              </button>
              <button onClick={onUserRegister} className="w-full text-sm bg-white border border-purple-200 text-purple-600 font-semibold px-4 py-2 rounded-full hover:bg-purple-50 transition">
                <Sparkles className="w-4 h-4 inline mr-1" /> Đăng ký
              </button>
            </div>
          )}

          <nav className="bg-white rounded-3xl shadow-md border border-purple-50 p-3 flex flex-col gap-1">
            {NAV_ITEMS(userAuth).filter(i => i.show).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => goTo(item.path)}
                  className={`flex items-center gap-3 text-sm font-semibold px-3 py-2.5 rounded-2xl text-left transition ${item.key === "home" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              );
            })}
            {userAuth?.user?.role === 'admin' && (
              <button onClick={() => goTo("/admin")} className="flex items-center gap-3 text-sm font-semibold text-gray-600 px-3 py-2.5 rounded-2xl hover:bg-purple-50 hover:text-purple-700 transition text-left">
                <GraduationCap className="w-5 h-5" /> Trang giáo viên
              </button>
            )}
            {userAuth?.user && (
              <button onClick={onUserLogout} className="flex items-center gap-3 text-sm font-semibold text-red-500 px-3 py-2.5 rounded-2xl hover:bg-red-50 transition text-left">
                <LogOut className="w-5 h-5" /> Đăng xuất
              </button>
            )}
          </nav>
        </aside>

        {/* ───────── Cột nội dung chính ───────── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* ═══════════════════════════ MOBILE HEADER (Shopee style) — THAY ĐỔI ═══════════════════════════ */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
            <div className="px-4 h-14 flex items-center justify-between gap-3">
              {/* Logo */}
              <a href="#/" onClick={() => navigate("/")} className="flex items-center gap-1 shrink-0">
                <PartyPopper className="w-5 h-5 text-purple-500" />
                <span className="font-display text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Lớp Học Vui</span>
              </a>
              {/* Search bar */}
              <div className="flex-1 max-w-[170px] relative">
                <input
                  type="text"
                  placeholder="Tìm trò chơi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border border-transparent rounded-full px-3 py-1.5 pl-8 text-xs transition-all focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-100"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              {/* Coin + Notification + Avatar + Menu */}
              <div className="flex items-center gap-1.5 shrink-0">
                {userAuth?.user && (
                  <>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-full px-2 py-1">
                      <Coins className="w-3.5 h-3.5" /> {userCoins.toLocaleString()}
                    </span>
                    <div className="relative">
                      <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-1.5 rounded-full hover:bg-purple-50 transition text-purple-600">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                      </button>
                      {showNotifications && (
                        <NotificationDropdown notifications={notifications} unreadCount={unreadCount} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onClose={() => setShowNotifications(false)} onSelectGame={onSelectGame} />
                      )}
                    </div>
                  </>
                )}
                {userAuth?.user ? (
                  <a href="#/profile" onClick={() => navigate("/profile")} className="w-8 h-8 rounded-full overflow-hidden">
                    {avatarItems.length > 0 ? (
                      <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={32} />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-sm"><User className="w-4 h-4" /></div>
                    )}
                  </a>
                ) : (
                  <button onClick={onUserLogin} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Vào
                  </button>
                )}
                <button
                  onClick={() => setMobileMenuOpen(v => !v)}
                  aria-label="Thêm tuỳ chọn"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* Menu mở rộng khi bấm hamburger */}
            {mobileMenuOpen && (
              <div className="border-t border-purple-100 px-3 py-2 flex flex-col gap-1 bg-white">
                {NAV_ITEMS(userAuth).filter(i => i.show).map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.key} onClick={() => goTo(item.path)} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                      <Icon className="w-5 h-5" /> {item.label}
                    </button>
                  );
                })}
                {userAuth?.user?.role === 'admin' && (
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

          {/* ═══════════════════════════ MOBILE CONTENT (THAY ĐỔI HOÀN TOÀN) ═══════════════════════════ */}
          <main className="flex-1 w-full px-3 space-y-4 py-4 lg:hidden">
            {/* 1. Thẻ thành viên (kiểu trà sữa) */}
            <div className="relative rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 p-4 text-white overflow-hidden shadow-lg">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
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
                {/* <span className="text-xs font-bold bg-white/20 rounded-full px-2 py-0.5">Đổi quà</span> */}
              </div>
              {/* Barcode giả lập */}
              {/* <div className="mt-2 bg-white/80 text-gray-800 rounded-xl px-3 py-2 flex items-center gap-2">
                <div className="w-10 h-8 border-2 border-dashed border-purple-300 rounded"></div>
                <div className="flex-1 h-6 flex gap-0.5 items-stretch overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className={`w-1 ${i % 3 === 0 ? 'bg-purple-600' : i % 2 === 0 ? 'bg-pink-500' : 'bg-amber-400'}`}></div>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-purple-700">MÃ SỐ</span>
              </div> */}
            </div>

            {/* 2. Quick menu dạng tròn (Shopee style) */}
            <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-3">
              <div className="grid grid-cols-5 gap-2">
                {QUICK_MENU_ITEMS(userAuth).filter(i => i.show).slice(0, 8).map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.key} onClick={() => handleQuickMenuClick(item)} className="flex flex-col items-center gap-1 group focus:outline-none">
                      <span className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.tint} text-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-90 group-focus-visible:ring-2 group-focus-visible:ring-purple-300 transition-all duration-200`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-[9px] font-semibold text-gray-600 text-center leading-tight line-clamp-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Banner Flash Sale (Shopee style) */}
            {/* <div className="rounded-3xl overflow-hidden bg-white shadow-md border border-purple-50">
              <div className="bg-gradient-to-r from-red-500 to-orange-400 px-4 py-2 flex items-center justify-between">
                <span className="font-display text-white text-sm flex items-center gap-1"><Flame className="w-4 h-4" /> FLASH SALE</span>
                <span className="text-xs text-white bg-black/20 px-2 py-0.5 rounded-full">Kết thúc sau 02:45:30</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-3">
                {hotGames.slice(0, 2).map((game, idx) => (
                  <button key={game._id || game.id} onClick={() => onSelectGame(game)} className="relative bg-purple-50 rounded-xl p-2 text-left">
                    <span className={`absolute top-1 right-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ${idx === 0 ? 'bg-red-500' : 'bg-amber-500'}`}>
                      {idx === 0 ? '-30%' : 'MỚI'}
                    </span>
                    <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${colorForSubject(game.subject).grad} flex items-center justify-center`}>
                      <StampToken icon={templates.find(t => t._id === game.templateId)?.icon || <Gamepad2 className="w-6 h-6" />} ring="#fff" size={36} fontSize={18} />
                    </div>
                    <p className="text-xs font-bold text-gray-800 mt-1 line-clamp-1">{game.name}</p>
                    <span className="text-[10px] text-red-500 font-bold">{idx === 0 ? '999 xu' : '299 xu'}</span>
                  </button>
                ))}
              </div>
            </div> */}

            {/* 4. Nhiệm vụ hôm nay (card gọn) */}
            <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-4 h-4 text-violet-500" />
                <h3 className="font-display text-sm font-bold text-gray-800">Nhiệm vụ hôm nay</h3>
              </div>
              <DailyTasksCard compact onClaimCoins={handleClaimCoins} />
              <button onClick={() => navigate('/daily-tasks')} className="w-full text-center text-xs font-semibold text-purple-500 mt-2">Xem tất cả →</button>
            </div>

            {/* 5. Môn học - dạng chip ngang */}
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

            {/* 6. Danh sách trò chơi dạng thẻ sản phẩm 2 cột */}
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
          </main>

          {/* ═══════════════════════════ DESKTOP CONTENT (giữ nguyên) ═══════════════════════════ */}
          <main className="hidden lg:block flex-1 w-full p-3 space-y-10">
            {/* ... TOÀN BỘ PHẦN DESKTOP CŨ ... */}
            {/* Banner chào mừng */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 via-fuchsia-50 to-amber-50 border border-purple-100 p-3 text-center" style={{ marginTop: "9px" }}>
              <span className="absolute top-4 left-[6%] text-3xl animate-float" aria-hidden="true"><Star className="w-8 h-8 text-amber-400" /></span>
              <span className="absolute bottom-4 right-[8%] text-3xl animate-float" aria-hidden="true"><Sun className="w-8 h-8 text-orange-300" /></span>
              <span className="absolute top-6 right-[14%] text-2xl animate-float" aria-hidden="true"><Sparkles className="w-7 h-7 text-pink-400" /></span>

              <p className="text-sm font-bold text-purple-500 uppercase tracking-wide mb-1">
                {userAuth?.user ? `Chào mừng trở lại, ${userAuth.user.name}!` : "Chào mừng bạn đến với"}
              </p>
              <h1 className="font-display text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-3">
                Lớp Học Vui
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto mb-6">
                Học mà chơi, chơi mà học! Chọn một trò chơi bên dưới hoặc nhập mã vé từ thầy cô nhé <Ticket className="w-5 h-5 inline text-purple-400" />
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <PrimaryButton
                  onClick={() => setShowCodeModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  <KeyRound className="w-4 h-4 inline mr-1" /> Nhập mã vé
                </PrimaryButton>
                <PrimaryButton
                  onClick={() => scrollTo('games-section')}
                  className="bg-white text-purple-600 border-2 border-purple-200 px-6 py-3 rounded-2xl shadow-sm hover:bg-purple-50 transition-all"
                >
                  <Gamepad2 className="w-4 h-4 inline mr-1" /> Khám phá trò chơi
                </PrimaryButton>
              </div>
            </section>

            {/* Dashboard 2 cột */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardCard icon={Gamepad2} title="Chơi game" gradient="from-orange-500 to-amber-500" onSeeAll={() => scrollTo('games-section')}>
                {games === null ? (
                  <p className="text-sm text-gray-400 py-6 text-center">Đang tải...</p>
                ) : hotGames.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">Chưa có trò chơi nào</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {hotGames.concat(newGames).slice(0, 4).map(g => (
                      <MiniGameTile key={g._id?.toString() || g.id} game={g} onSelect={onSelectGame} />
                    ))}
                  </div>
                )}
              </DashboardCard>

              <DashboardCard icon={BookOpen} title="Học tập" gradient="from-cyan-500 to-blue-500" onSeeAll={() => scrollTo('subjects-section')}>
                {subjects.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">Chưa có môn học nào</p>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {subjects.slice(0, 4).map(subject => (
                      <MiniSubjectTile
                        key={subject}
                        label={subject}
                        classes={colorForSubject(subject)}
                        onClick={() => { setActiveSubject(subject); scrollTo('games-section'); }}
                      />
                    ))}
                  </div>
                )}
              </DashboardCard>
            </section>

            {/* Dashboard 3 cột */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <DashboardCard icon={ClipboardList} title="Nhiệm vụ hàng ngày" gradient="from-violet-500 to-purple-500">
                <DailyTasksCard onClaimCoins={handleClaimCoins} />
                <button
                  onClick={() => navigate("/daily-tasks")}
                  className="w-full text-center text-[11px] font-semibold text-purple-500 hover:text-purple-700 transition mt-3"
                >
                  Xem tất cả →
                </button>
              </DashboardCard>

              {/* <DashboardCard icon={Gift} title="Sự kiện nổi bật" gradient="from-yellow-500 to-rose-500">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white p-4 h-full flex flex-col justify-between min-h-[10rem]">
                  <span className="absolute -bottom-3 -right-3 text-6xl opacity-30" aria-hidden="true"><Sun className="w-16 h-16" /></span>
                  <div className="relative">
                    <p className="font-display text-lg leading-tight mb-1">Sự kiện hè<br />sôi động</p>
                    <p className="text-xs text-white/80">Chơi game — nhận quà cực ngầu!</p>
                  </div>
                  <button onClick={() => scrollTo('games-section')} className="relative self-start bg-amber-400 hover:bg-amber-300 text-amber-900 text-xs font-bold px-4 py-2 rounded-full transition">
                    Tham gia ngay
                  </button>
                </div>
              </DashboardCard> */}

              <DashboardCard icon={Trophy} title="Bảng xếp hạng" gradient="from-amber-500 to-yellow-500" id="leaderboard-section">
                <div className="flex flex-col gap-1">
                  {MOCK_LEADERBOARD.map(row => (
                    <div key={row.rank} className="flex items-center gap-3 py-1.5">
                      <Medal className={`w-5 h-5 ${row.medal === 'gold' ? 'text-amber-400' : row.medal === 'silver' ? 'text-gray-300' : 'text-orange-400'}`} />
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-xs shrink-0"><User className="w-4 h-4" /></span>
                      <span className="flex-1 text-sm font-semibold text-gray-700 truncate">{row.name}</span>
                      <span className="text-sm font-bold text-amber-600">{row.score.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </section>

            {/* Lưới môn học */}
            {subjects.length > 1 && (
              <section id="subjects-section">
                <SectionHeader icon={BookOpen} title="Môn học" gradient="from-cyan-500 to-blue-500" />
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

            {/* Games section */}
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
                  {visibleGames.length === 0 ? (
                    <EmptyState icon={Search} title="Chưa có trò chơi cho môn này" subtitle="Thử chọn môn khác hoặc bấm 'Tất cả' để xem hết trò chơi nhé!" />
                  ) : (
                    <GameGrid games={visibleGames} templates={templates} onSelect={onSelectGame} />
                  )}
                </div>
              ) : (
                <div className="space-y-10">
                  {hotGames.length > 0 && (
                    <div>
                      <SectionHeader icon={Flame} title="Trò chơi đang HOT" gradient="from-red-500 to-orange-500" pulse />
                      <GameGrid
                        games={hotGames}
                        templates={templates}
                        onSelect={onSelectGame}
                        badges={["TOP 1", "TOP 2", "TOP 3"]}
                        badgeColors={["from-yellow-400 to-amber-500", "from-gray-300 to-gray-400", "from-orange-400 to-orange-500"]}
                      />
                    </div>
                  )}

                  {newGames.length > 0 && (
                    <div>
                      <SectionHeader icon={Sparkles} title="Trò chơi mới" gradient="from-emerald-500 to-teal-500" />
                      <GameGrid games={newGames} templates={templates} onSelect={onSelectGame} isNew />
                    </div>
                  )}

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

      {/* ═══════════════ BOTTOM NAVIGATION (chỉ mobile) — THÊM MỚI ═══════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-purple-100 shadow-lg" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex justify-around items-center h-16">
          {BOTTOM_NAV(userAuth).filter(i => i.show).map(item => {
            const Icon = item.icon;
            const isActive = item.key === 'home' || (item.path && window.location.hash === `#${item.path}`);
            return (
              <button key={item.key} onClick={() => handleBottomNavClick(item)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 ${isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-400 hover:text-purple-500'}`}>
                <Icon className="w-5 h-5" />
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

// ═══════════════ GIỮ NGUYÊN CÁC COMPONENT PHỤ TRỢ ═══════════════
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

function MiniGameTile({ game, onSelect }) {
  const color = colorForSubject(game.subject);
  return (
    <button onClick={() => onSelect(game)} className="flex flex-col items-center gap-1.5 group">
      <span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.grad} text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform`}>
        <Gamepad2 className="w-6 h-6" />
      </span>
      <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight line-clamp-1">{game.name}</span>
    </button>
  );
}

function MiniSubjectTile({ label, classes, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <span className={`w-14 h-14 rounded-2xl ${classes.solid} text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform`}>
        <BookOpen className="w-6 h-6" />
      </span>
      <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight line-clamp-1">{label}</span>
    </button>
  );
}

function SectionHeader({ icon: IconComponent, title, gradient, pulse }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full shadow-md ${pulse ? "animate-pulse-glow" : ""}`}>
        <IconComponent className="w-5 h-5" />
        <h2 className="font-display text-base font-bold">{title}</h2>
      </div>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-200 to-transparent rounded-full"></div>
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

function NotificationDropdown({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onClose, onSelectGame }) {
  return (
    <>
      <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}></div>
      <div className="fixed right-0 top-14 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden z-50 lg:absolute lg:top-auto lg:right-0 lg:mt-2 lg:z-50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50 bg-purple-50/50">
          <h3 className="font-bold text-gray-800">Thông báo</h3>
          {unreadCount > 0 && (
            <button onClick={onMarkAllAsRead} className="text-xs text-purple-600 hover:text-purple-800 font-medium">
              Đánh dấu đã đọc
            </button>
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