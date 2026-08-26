import { useEffect, useMemo, useState } from 'react'
import { gameService, coinService } from '../services/api.js'
import { getLevelProgress, getLevelEmoji } from '../lib/utils.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { PrimaryButton, Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'
import DailyTasksCard from '../components/DailyTasksCard.jsx'
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
  School,
  BadgeCheck,
} from 'lucide-react'

// Bảng màu theo môn học — mỗi môn luôn ra cùng 1 màu, giúp trẻ nhận diện nhanh
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

const NAV_ITEMS = (userAuth) => [
  { key: "home", icon: Home, label: "Trang chủ", path: "/", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user },
  { key: "friends", icon: Search, label: "Tìm bạn", path: "/find-friends", show: !!userAuth?.user },
  { key: "coins", icon: Coins, label: "Ví của tôi", path: "/my-coins", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Hồ sơ", path: "/profile", show: !!userAuth?.user },
];

// Lưới truy cập nhanh kiểu "mini app" cho mobile — mỗi ô 1 màu riêng để trẻ dễ nhận diện,
// giữ tinh thần vui nhộn của Lớp Học Vui thay vì tông xanh dương đơn sắc kiểu app cửa hàng.
const QUICK_MENU_ITEMS = (userAuth) => [
  { key: "code", icon: Ticket, label: "Nhập mã vé", action: "code", show: true, tint: "from-purple-400 to-fuchsia-400" },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", path: "/daily-tasks", show: !!userAuth?.user, tint: "from-violet-400 to-purple-400" },
  { key: "games", icon: Gamepad2, label: "Trò chơi", action: "scroll", show: true, tint: "from-orange-400 to-amber-400" },
  { key: "coins", icon: Coins, label: "Ví của tôi", path: "/my-coins", show: !!userAuth?.user, tint: "from-amber-400 to-yellow-400" },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", path: "/chat", show: !!userAuth?.user, tint: "from-cyan-400 to-blue-400" },
  { key: "friends", icon: Search, label: "Tìm bạn", path: "/find-friends", show: !!userAuth?.user, tint: "from-emerald-400 to-teal-400" },
  { key: "profile", icon: User, label: "Hồ sơ", path: "/profile", show: !!userAuth?.user, tint: "from-pink-400 to-rose-400" },
  { key: "teacher", icon: GraduationCap, label: "Giáo viên", path: "/admin", show: true, tint: "from-indigo-400 to-violet-400" },
  { key: "login", icon: KeyRound, label: "Đăng nhập", action: "login", show: !userAuth?.user, tint: "from-purple-400 to-pink-400" },
];

// Tab điều hướng ngang cho thanh trên cùng của bản desktop.
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

export default function HomeScreen({ onSelectGame, userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState("all");
  const [userCoins, setUserCoins] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const templates = useTemplates();

  const loadGames = async () => {
    setGames(null); setError(null);
    try {
      setGames(await gameService.list({ status: "published" }));
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => { loadGames(); }, []);

  useEffect(() => {
    if (userAuth?.user) {
      coinService.get().then(c => setUserCoins(c?.coins || 0)).catch(() => { });
    }
  }, [userAuth?.user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-purple-50/50 to-pink-50">

      {/* ═══════════════════════════ THANH TRÊN CÙNG (chỉ desktop) ═══════════════════════════ */}
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
              </>
            )}
            {userAuth?.user ? (
              <a onClick={() => navigate("/profile")} href="#/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-lg shadow-sm hover:shadow-md transition"><User className="w-5 h-5" /></a>
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

        {/* ═══════════════════════════ SIDEBAR (chỉ desktop) ═══════════════════════════ */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto px-5 py-6 gap-4">

          {userAuth?.user ? (
            <>
              <div className="bg-white rounded-3xl shadow-md border border-purple-50 p-5">
                <div className="flex flex-col items-center text-center mb-4">
                  <span className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm mb-2"><User className="w-7 h-7" /></span>
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
            <button onClick={() => goTo("/admin")} className="flex items-center gap-3 text-sm font-semibold text-gray-600 px-3 py-2.5 rounded-2xl hover:bg-purple-50 hover:text-purple-700 transition text-left">
              <GraduationCap className="w-5 h-5" /> Trang giáo viên
            </button>
            {userAuth?.user && (
              <button onClick={onUserLogout} className="flex items-center gap-3 text-sm font-semibold text-red-500 px-3 py-2.5 rounded-2xl hover:bg-red-50 transition text-left">
                <LogOut className="w-5 h-5" /> Đăng xuất
              </button>
            )}
          </nav>

          {/* <div className="mt-auto flex justify-center pb-2">
            <PartyPopper className="w-10 h-10 text-purple-300" />
          </div> */}
        </aside>

        {/* ───────── Cột nội dung chính ───────── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Thanh trên cùng — chỉ hiện trên mobile/tablet (giữ nguyên, không đổi) */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
            <div className="px-4 h-16 flex items-center justify-between gap-3">
              <a href="#/" onClick={() => navigate("/")} className="flex items-center gap-2 font-display text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                <PartyPopper className="w-5 h-5 text-purple-500" /> Lớp Học Vui
              </a>
              <div className="flex items-center gap-2">
                {userAuth?.user && (
                  <a onClick={() => navigate("/my-coins")} href="#/my-coins" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 bg-amber-50 rounded-full px-3 py-1.5">
                    <Coins className="w-4 h-4" /> {userCoins.toLocaleString()}
                  </a>
                )}
                {!userAuth?.user ? (
                  <button onClick={onUserLogin} className="inline-flex items-center gap-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-3 py-2 rounded-full">
                    <KeyRound className="w-4 h-4" /> Vào
                  </button>
                ) : (
                  <a onClick={() => navigate("/profile")} href="#/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-sm"><User className="w-4 h-4" /></a>
                )}
                <button
                  onClick={() => setMobileMenuOpen(v => !v)}
                  aria-label="Thêm tuỳ chọn"
                  aria-expanded={mobileMenuOpen}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-purple-600 text-lg hover:bg-purple-100 transition"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="border-t border-purple-100 px-3 py-2 flex flex-col gap-1">
                {NAV_ITEMS(userAuth).filter(i => i.show).map(item => {
                  const Icon = item.icon;
                  return (
                    <button key={item.key} onClick={() => goTo(item.path)} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                      <Icon className="w-5 h-5" /> {item.label}
                    </button>
                  );
                })}
                <button onClick={() => goTo("/admin")} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                  <GraduationCap className="w-5 h-5" /> Trang giáo viên
                </button>
                {userAuth?.user && (
                  <button onClick={() => { onUserLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-sm font-semibold text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left">
                    <LogOut className="w-5 h-5" /> Đăng xuất
                  </button>
                )}
              </div>
            )}
          </header>

          <main className="flex-1 w-full p-3 space-y-10">

            {/* ───────── Thẻ chào mừng + lưới truy cập nhanh — kiểu "mini app", chỉ hiện trên mobile (giữ nguyên) ───────── */}
            <section className="lg:hidden -mt-2">
              <div className="rounded-3xl bg-white shadow-md border border-purple-100 p-4">
                <div className="flex items-center gap-3 pb-4 mb-1">
                  <span className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-xl shadow-sm">
                    {userAuth?.user ? <User className="w-6 h-6" /> : <PartyPopper className="w-6 h-6" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">{userAuth?.user ? "Xin chào," : "Chào mừng bạn đến với"}</p>
                    <p className="font-display text-base text-gray-800 truncate">
                      {userAuth?.user ? userAuth.user.name : "Lớp Học Vui 🎈"}
                    </p>
                  </div>
                  {userAuth?.user && (
                    <div className="shrink-0 text-right">
                      <p className="text-[11px] font-bold text-amber-600 whitespace-nowrap">{getLevelEmoji(lv.level)} Cấp {lv.level}</p>
                      <div className="w-16 h-1.5 mt-1 rounded-full bg-amber-100 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ width: `${lv.percent ?? 0}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-y-4 gap-x-1 pt-3 border-t border-purple-50">
                  {QUICK_MENU_ITEMS(userAuth).filter(i => i.show).map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleQuickMenuClick(item)}
                        className="flex flex-col items-center gap-1.5 group"
                      >
                        <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.tint} text-white flex items-center justify-center text-lg shadow-sm group-active:scale-90 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </span>
                        <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight line-clamp-1">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Banner chào mừng (dùng chung, không đổi) */}
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

            {/* ═══════════════ DASHBOARD 2 CỘT: Chơi game / Học tập (Responsive) ═══════════════ */}
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

            {/* ═══════════════ DASHBOARD 3 CỘT: Nhiệm vụ / Sự kiện / Bảng xếp hạng (Responsive) ═══════════════ */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard icon={ClipboardList} title="Nhiệm vụ hàng ngày" gradient="from-violet-500 to-purple-500">
                <DailyTasksCard onClaimCoins={handleClaimCoins} />
                <button
                  onClick={() => navigate("/daily-tasks")}
                  className="w-full text-center text-[11px] font-semibold text-purple-500 hover:text-purple-700 transition mt-3"
                >
                  Xem tất cả →
                </button>
              </DashboardCard>

              <DashboardCard icon={Gift} title="Sự kiện nổi bật" gradient="from-yellow-500 to-rose-500">
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
              </DashboardCard>

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

            {/* Lưới môn học (dùng chung, không đổi) */}
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
                        badges={["🥇 TOP 1", "🥈 TOP 2", "🥉 TOP 3"]}
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

      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onSelectGame} />
    </div>
  );
}

// Thẻ khung cho các mục ở bảng điều khiển desktop (Chơi game / Học tập / Nhiệm vụ / Sự kiện / Bảng xếp hạng)
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

// Ô game thu nhỏ dùng trong DashboardCard "Chơi game"
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

// Ô môn học thu nhỏ dùng trong DashboardCard "Học tập"
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

// Thẻ trò chơi kiểu "app card" — ảnh/icon lớn phía trên, tên + nút "Chơi ngay" phía dưới
function GameCard({ game, template, onSelect, index, badge, badgeColor, isNew }) {
  const color = colorForSubject(game.subject);
  return (
    <button
      onClick={() => onSelect(game)}
      aria-label={`Chơi ${game.name}`}
      className="group relative bg-white rounded-2xl p-3 text-left shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-purple-200 overflow-hidden flex flex-col animate-fade-in-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {(badge || isNew) && (
        <div className={`absolute top-2 right-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 bg-gradient-to-r ${badge ? badgeColor : "from-emerald-400 to-teal-400"}`}>
          {badge || "MỚI"}
        </div>
      )}

      <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${color.grad} flex items-center justify-center mb-2.5`}>
        <StampToken icon={template ? template.icon : <Gamepad2 className="w-6 h-6" />} ring="#ffffff" size={48} fontSize={22} />
      </div>

      <h3 className="font-display text-sm text-gray-800 leading-tight mb-1.5 group-hover:text-purple-700 transition-colors line-clamp-2">
        {game.name}
      </h3>

      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono mb-2">
        <span className={`px-1.5 py-0.5 rounded ${color.chip}`}>{game.subject}</span>
        <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded"><BadgeCheck className="w-3 h-3 inline mr-0.5" />{game.questionsCount}</span>
      </div>

      <span className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full py-1.5 group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
        Chơi ngay <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}