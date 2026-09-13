import { useEffect, useMemo, useState, useRef } from 'react'
import { gameService, coinService, notificationService, assignmentService, API_BASE } from '../services/api.js'
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
  Flame,
  Gift,
  Users,
  Bell,
  Crown,
  ListChecks,
  SplineIcon,
  ShipWheel,
  FileText,
  Sprout,
  Repeat,
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
  { key: "garden", icon: Sprout, label: "Khu vườn", path: "/garden", show: !!userAuth?.user },
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
  { key: "code", icon: Ticket, label: "Nhập mã vé", action: "code", show: true, tint: "from-yellow-800 to-fuchsia-400" },
  { key: "garden", icon: Sprout, label: "Khu vườn", path: "/garden", show: !!userAuth?.user, tint: "from-green-400 to-emerald-400" },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user, tint: "from-violet-400 to-purple-400" },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", path: "/spin-wheel", show: !!userAuth?.user, tint: "from-amber-400 to-yellow-500" },
  { key: "games", icon: Gamepad2, label: "Trò chơi", action: "scroll", show: true, tint: "from-orange-400 to-amber-400" },
  { key: "coins", icon: Coins, label: "Ví của tôi", path: "/my-coins", show: !!userAuth?.user, tint: "from-amber-400 to-yellow-400" },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user, tint: "from-cyan-400 to-blue-400" },
  { key: "friends", icon: Search, label: "Tìm bạn", path: "/find-friends", show: !!userAuth?.user, tint: "from-emerald-400 to-red-400" },
  { key: "assignment", icon: FileText, label: "Bài tập", path: "/assignment", show: !!userAuth?.user, tint: "from-blue-400 to-yellow-400" },
  { key: "profile", icon: User, label: "Hồ sơ", path: "/profile", show: !!userAuth?.user, tint: "from-blue-400 to-rose-400" },
  { key: "teacher", icon: GraduationCap, label: "Giáo viên", path: "/admin", show: userAuth?.user?.role === 'admin' || 'teacher', tint: "from-indigo-400 to-violet-400" },
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
  const [completedAssignments, setCompletedAssignments] = useState([]);

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
        if (loadoutRes.status) {
          const raw = loadoutRes.data.loadout || {};
          const VALID_LAYERS = ['body', 'skin', 'face', 'hair', 'shirt', 'pants', 'shoes', 'hat', 'glasses', 'accessory'];
          const codes = {};
          for (const k of VALID_LAYERS) {
            const v = raw[k];
            if (v && typeof v === 'object' && v.code) codes[k] = v.code;
            else if (typeof v === 'string') codes[k] = v;
            else codes[k] = null;
          }
          setAvatarLoadout(codes);
        }
      }).catch(() => { });

      // Register FCM token if permission is already granted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        requestNotificationPermission().then((token) => {
          if (token) notificationService.registerDevice(token, "WEB").catch(() => { });
        }).catch(() => { });
      }

      // Load completed assignments
      assignmentService.getMyCompleted().then(list => {
        setCompletedAssignments(Array.isArray(list) ? list : []);
      }).catch(() => { });
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

  // Listen for foreground push messages
  useEffect(() => {
    if (!userAuth?.user) return;
    const unsubscribe = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};
      // Add to in-app notification list (skip if already exists from API)
      setNotifications(prev => {
        const now = Date.now();
        const isDuplicate = prev.some(n => {
          if (n.id.startsWith('fg-')) return false;
          if (n.title !== (title || "Thông báo")) return false;
          if ((n.message || n.content || "") !== (body || "")) return false;
          const diff = now - new Date(n.createdAt).getTime();
          return diff < 5000;
        });
        if (isDuplicate) return prev;
        return [{
          id: `fg-${Date.now()}`,
          title: title || "Thông báo",
          message: body || "",
          type: data.type || "SYSTEM",
          data,
          read: false,
          createdAt: new Date().toISOString(),
        }, ...prev];
      });
      // Show browser notification when app is in foreground
      if ("Notification" in window && Notification.permission === "granted") {
        const n = new Notification(title || "EduGames", {
          body: body || "",
          icon: "/educational-games/eduplay-icon-192x192.png",
          tag: data.type || "general",
        });
        n.onclick = () => {
          window.focus();
          if (data?.link) navigate(data.link);
          else if (data?.type === "ASSIGNMENT") navigate(data.link || "/");
          else if (data?.type === "chat_message") navigate("/chat");
          n.close();
        };
      }
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
          <a href="#/" onClick={() => navigate("/")} className="shrink-0">
            <img src={`${import.meta.env.BASE_URL}eduplay-logo.png`} alt="EduPlay" className="h-14 w-auto object-contain" draggable={false} />
          </a>

          <div className="flex-1 max-w-xl relative mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm game, nhiệm vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-transparent rounded-full px-4 py-2.5 pl-10 text-sm transition-all focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-100"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

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

        {/* ═══════════════════════════ SIDEBAR ═══════════════════════════ */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto px-4 py-6">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS(userAuth).filter(i => i.show).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => goTo(item.path)}
                  className={`flex items-center gap-3 text-sm font-semibold px-4 py-3 rounded-xl text-left transition ${item.key === "home" ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"}`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                  {item.key === "chat" && unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
              );
            })}
            {(userAuth?.user?.role === 'admin' || userAuth?.user?.role === 'teacher') && (
              <button onClick={() => goTo("/admin")} className="flex items-center gap-3 text-sm font-semibold text-gray-600 px-4 py-3 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition text-left">
                <GraduationCap className="w-5 h-5" /> Trang giáo viên
              </button>
            )}
            {userAuth?.user && (
              <button onClick={onUserLogout} className="flex items-center gap-3 text-sm font-semibold text-red-500 px-4 py-3 rounded-xl hover:bg-red-50 transition text-left mt-auto">
                <LogOut className="w-5 h-5" /> Đăng xuất
              </button>
            )}
          </nav>
        </aside>

        {/* ───────── Cột nội dung chính ───────── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* ═══════════════════════════ MOBILE HEADER (Shopee style) — THAY ĐỔI ═══════════════════════════ */}
          <header className="lg:hidden sticky top-[var(--sat)] z-30 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm">
            <div className="px-4 h-14 flex items-center justify-between gap-3">
              {/* Logo */}
              <a href="#/" onClick={() => navigate("/")} className="shrink-0">
                <img src={`${import.meta.env.BASE_URL}eduplay-logo.png`} alt="EduPlay" className="h-8 w-auto object-contain" draggable={false} />
              </a>
              {/* Search bar */}
              {/* <div className="flex-1 max-w-[170px] relative">
                <input
                  type="text"
                  placeholder="Tìm trò chơi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border border-transparent rounded-full px-3 py-1.5 pl-8 text-xs transition-all focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-2 focus:ring-purple-100"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div> */}
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

          {/* ═══════════════════════════ MOBILE CONTENT (THAY ĐỔI HOÀN TOÀN) ═══════════════════════════ */}
          <main className="flex-1 w-full px-2 space-y-2 py-3 lg:hidden">

            {/* ═══════════ BANNER SCROLL NGANG ═══════════ */}
            <div className="overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-3 rounded-3xl">

              {/* Banner 1: Banner hình ảnh */}
              <div className="snap-center shrink-0 w-[calc(100vw-1rem)] rounded-3xl overflow-hidden shadow-lg relative">
                <img
                  src={`${import.meta.env.BASE_URL}banner.png`}
                  alt="Banner"
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                  <div>
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider mb-0.5">✨ Chúc mừng tốt nghiệp</p>
                    <h2 className="font-display text-lg text-white leading-tight">
                      Xin chào, {userAuth?.user?.name || 'bạn'}! 👋
                    </h2>
                    <p className="text-xs text-white/80">Học mà chơi, chơi mà giỏi!</p>
                  </div>
                </div>
              </div>

              {/* Banner 2: Khung thông tin hiện tại */}
              <div className="snap-center shrink-0 w-[calc(100vw-1rem)] relative rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 p-4 text-white overflow-hidden shadow-lg">
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
                  <span className="text-xs opacity-90">
                    {getLevelEmoji(lv.level)} {lv.earned}/{lv.needed} xu
                  </span>
                  <span className="text-xs font-bold bg-white/20 rounded-full px-2 py-0.5">
                    {userCoins.toLocaleString()} xu
                  </span>
                </div>
              </div>

            </div>
            {/* ═══════════ HẾT BANNER SCROLL NGANG ═══════════ */}

            {/* 2. Quick menu dạng tròn (Shopee style) — GIỮ NGUYÊN */}
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

            {/* 4. Nhiệm vụ hôm nay (card gọn) — GIỮ NGUYÊN */}
            <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-4 h-4 text-violet-500" />
                <h3 className="font-display text-sm font-bold text-gray-800">Nhiệm vụ hôm nay</h3>
              </div>
              <DailyTasksCard compact onClaimCoins={handleClaimCoins} />
              <button onClick={() => navigate('/daily-tasks')} className="w-full text-center text-xs font-semibold text-purple-500 mt-2">Xem tất cả →</button>
            </div>

            {/* 4.5. Bài đã làm */}
            {completedAssignments.length > 0 && (
              <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <h3 className="font-display text-sm font-bold text-gray-800">Bài đã làm</h3>
                  </div>
                  <button onClick={() => navigate('/assignment')} className="text-xs font-semibold text-blue-500">Vào bài →</button>
                </div>
                <div className="space-y-2">
                  {completedAssignments.slice(0, 3).map((item, idx) => (
                    <button key={item.assignment.id} onClick={() => navigate(`/assignment/${item.assignment.id}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition text-left">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.assignment.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-bold text-blue-600">{item.submission?.score ?? 0}%</span>
                          <span>•</span>
                          <span>{item.attemptCount}/{item.maxAttempts === 0 ? '∞' : item.maxAttempts} lần</span>
                        </div>
                      </div>
                      <Repeat className="w-4 h-4 text-gray-400 shrink-0" />
                    </button>
                  ))}
                </div>
                {completedAssignments.length > 3 && (
                  <button onClick={() => navigate('/assignment')} className="w-full text-center text-xs font-semibold text-blue-500 mt-2">
                    Xem thêm {completedAssignments.length - 3} bài →
                  </button>
                )}
              </div>
            )}

            {/* 5. Môn học - dạng chip ngang — GIỮ NGUYÊN */}
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

            {/* 6. Danh sách trò chơi dạng thẻ sản phẩm 2 cột — GIỮ NGUYÊN */}
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

          {/* ═══════════════════════════ DESKTOP CONTENT ═══════════════════════════ */}
          <main className="hidden lg:block flex-1 w-full px-6 py-6 space-y-6">
            {/* Banner chào mừng */}
            <section className="relative rounded-3xl overflow-hidden min-h-[360px] flex items-center">
              <img src={`${import.meta.env.BASE_URL}banner.png`} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-10 flex items-center justify-between w-full p-10">
                <div>
                  <p className="text-xs font-bold text-black/70 uppercase tracking-wider mb-1">✨ Chúc mừng tốt nghiệp</p>
                  <h1 className="font-display text-4xl text-black mb-1">
                    Xin chào, {userAuth?.user?.name || 'bạn'}! 👋
                  </h1>
                  <p className="text-sm text-black/70 mb-4">Học mà chơi, chơi mà giỏi!</p>
                  <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm rounded-full px-4 py-2 mb-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-bold text-black">Cấp {lv.level}</span>
                  </div>
                  <p className="text-xs text-black/60">{(lv.earned ?? 0).toLocaleString()} / {(lv.needed ?? 0).toLocaleString()} xp</p>
                </div>
              </div>
            </section>

            {/* Truy cập nhanh */}
            <section className="bg-white rounded-3xl shadow-sm border border-purple-50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-gray-800">Truy cập nhanh</h2>
                <button className="text-xs font-semibold text-gray-400 hover:text-purple-600 transition">Xem tất cả →</button>
              </div>
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
                {QUICK_MENU_ITEMS(userAuth).filter(i => i.show).slice(0, 8).map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.key} onClick={() => handleQuickMenuClick(item)} className="flex flex-col items-center gap-2 group">
                      <span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.tint} text-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all`}>
                        <Icon className="w-6 h-6" />
                      </span>
                      <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Nhiệm vụ + Thông tin người dùng */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nhiệm vụ hôm nay */}
              <div className="bg-white rounded-3xl shadow-sm border border-purple-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4" />
                    </span>
                    Nhiệm vụ hôm nay
                  </h2>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">8/30 hoàn thành</span>
                </div>
                <DailyTasksCard compact onClaimCoins={handleClaimCoins} />
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Hoàn thành 7 phần thưởng còn lại...</p>
                  <button onClick={() => navigate('/daily-tasks')} className="text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-full transition">Xem tất cả →</button>
                </div>
              </div>

              {/* Thông tin người dùng */}
              <div className="bg-white rounded-3xl shadow-sm border border-purple-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </span>
                    Thông tin người dùng
                  </h2>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-purple-100">
                    {avatarItems.length > 0 ? (
                      <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={64} />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-2xl"><User className="w-7 h-7" /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-gray-800">{userAuth?.user?.name}</p>
                    <div className="flex items-center gap-1 text-sm text-amber-600 font-semibold">
                      <Star className="w-4 h-4" /> Cấp {lv.level}
                    </div>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-amber-50 overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all" style={{ width: `${lv.percent || 0}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-amber-50 rounded-xl">
                    <p className="text-lg font-bold text-amber-600">{userCoins.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500">Xu tích lũy</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <p className="text-lg font-bold text-purple-600">12</p>
                    <p className="text-[10px] text-gray-500">Nhiệm vụ</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-lg font-bold text-blue-600">5</p>
                    <p className="text-[10px] text-gray-500">Bạn bè</p>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="text-xs text-gray-600 italic">"Mỗi ngày học thêm một chút, bạn đã thành công rồi!" 😊</p>
                </div>
              </div>
            </section>

            {/* Bài đã làm */}
            {completedAssignments.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </span>
                    Bài đã làm
                  </h2>
                  <button onClick={() => navigate('/assignment')} className="text-xs font-semibold text-gray-400 hover:text-blue-600 transition">Vào bài tập →</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedAssignments.slice(0, 6).map((item) => (
                    <button key={item.assignment.id} onClick={() => navigate(`/assignment/${item.assignment.id}`)}
                      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left border border-blue-50">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-sm font-bold text-gray-800 line-clamp-1">{item.assignment.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-lg font-bold text-blue-600">{item.submission?.score ?? 0}%</span>
                            <span className="text-xs text-gray-500">
                              {item.assignment.questionIds?.length || 0} câu • {item.assignment.isExam ? `${item.assignment.examDuration} phút` : 'Bài tập'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                            <Repeat className="w-3 h-3" />
                            <span>{item.attemptCount}/{item.maxAttempts === 0 ? '∞' : item.maxAttempts} lần làm bài</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Môn học */}
            {subjects.length > 0 && (
              <section id="subjects-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    Môn học
                  </h2>
                  <button className="text-xs font-semibold text-gray-400 hover:text-purple-600 transition">Xem tất cả →</button>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  <button onClick={() => setActiveSubject('all')} className={`px-5 py-2.5 rounded-full text-sm font-bold shrink-0 transition-all ${activeSubject === 'all' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'}`}>
                    Tất cả
                  </button>
                  {subjects.map(sub => (
                    <button key={sub} onClick={() => setActiveSubject(sub)} className={`px-5 py-2.5 rounded-full text-sm font-bold shrink-0 transition-all ${activeSubject === sub ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'}`}>
                      {sub}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Game nổi bật */}
            <section id="games-section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </span>
                  Game nổi bật
                </h2>
                <button className="text-xs font-semibold text-gray-400 hover:text-purple-600 transition">Xem tất cả →</button>
              </div>
              {games === null ? (
                <Loader label="Đang tải..." />
              ) : error ? (
                <ErrorState title="Lỗi" subtitle={error} onRetry={loadGames} />
              ) : visibleGames.length === 0 ? (
                <EmptyState icon={Search} title="Không tìm thấy" subtitle="Thử từ khóa khác nhé!" />
              ) : (
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {visibleGames.slice(0, 6).map((g) => {
                    const color = colorForSubject(g.subject);
                    const template = templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid));
                    return (
                      <button key={g._id || g.id} onClick={() => onSelectGame(g)} className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-purple-50 overflow-hidden text-left group">
                        <div className={`w-full h-36 bg-gradient-to-br ${color.grad} flex items-center justify-center relative`}>
                          <StampToken icon={template?.icon || <Gamepad2 className="w-6 h-6" />} ring="#fff" size={48} fontSize={22} />
                          {g.playersCount > 0 && (
                            <span className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Users className="w-3 h-3" /> {g.playersCount}
                            </span>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-display text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-purple-700 transition">{g.name}</h3>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                            <span className={`px-2 py-0.5 rounded-full ${color.chip}`}>{g.subject}</span>
                            <span className="text-gray-400 flex items-center gap-0.5"><ListChecks className="w-3 h-3" /> {g.questionsCount}</span>
                          </div>
                          <span className="mt-2.5 inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                            Chơi ngay <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Bottom CTA Banner */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-8 text-center text-white">
              <h2 className="font-display text-2xl font-bold mb-2">Cùng nhau chinh phục<br />những thử thách mới!</h2>
              <p className="text-sm text-white/80 mb-4">Game mới đóng cửa bạn nhận thử</p>
              <button onClick={() => scrollTo('games-section')} className="bg-white text-purple-600 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gray-100 transition shadow-lg">
                Khám phá ngay →
              </button>
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
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={ref} onPointerDown={(e) => e.stopPropagation()} className="fixed right-2 top-14 w-96 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden z-50 lg:absolute lg:top-auto lg:right-0 lg:mt-2 lg:z-50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-purple-50 bg-purple-50/60">
          <h3 className="font-bold text-gray-800 text-sm">Thông báo</h3>
          {unreadCount > 0 && (
            <button onClick={onMarkAllAsRead} className="text-xs text-purple-600 hover:text-purple-800 font-medium">
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* ── Bật thông báo & Test Push trên điện thoại/web ── */}
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
  );
}