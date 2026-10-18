import { useEffect, useMemo, useState } from 'react'
import { gameService, coinService, notificationService, starService } from '../services/api.js'
import { taskService } from '../services/taskService.js'
import { socket } from '../socket/socket.js'
import { SOCKET_EVENTS } from '../socket/socket.events.js'
import { getLevelProgress } from '../lib/utils.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import './home-gq.css'
import { Loader, ErrorState, EmptyState } from '../components/ui.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'
import AiChatWidget from '../components/ai/AiChatWidget.jsx'
import { PetAvatar } from '../components/PetAvatar.jsx'
import { usePet, moodLabel } from '../lib/petApi.js'
import DailyGiftModal from '../components/home/DailyGiftModal.jsx'
import { requestNotificationPermission, onForegroundMessage, getPushSupportStatus } from '../firebase/messaging.js'
import useReminderCheck from '../hooks/useReminderCheck.js'
import { playVibration, playReminderSound, stopVibrationLoop } from '../lib/reminderUtils.js'
import {
  Home,
  ClipboardList,
  MessageCircle,
  Search,
  User,
  Gamepad2,
  GraduationCap,
  BookOpen,
  Trophy,
  LogOut,
  KeyRound,
  Sparkles,
  PartyPopper,
  Gift,
  Bell,
  ShipWheel,
  FileText,
  Sprout,
  PawPrint,
  Crown,
  Send,
  Trash2,
} from 'lucide-react'

// ── Nhóm tuổi dùng cho badge trên header và cho pill "2–8 tuổi" ở mỗi ô game.
// Đổi 3 hằng số này là đổi được cả nhóm tuổi của trang.
const CHILD_AGE = 7
const AGE_BAND = { label: 'Tiểu học', range: '6–8 tuổi' }

// Game nổi bật được ghim lên đầu (chơi ngay, không cần qua API)
const FEATURED_GAME = {
  key: "math-adventure",
  path: "/math-adventure",
  name: "Math Adventure",
  subject: "Toán học",
  description: "Giải bài tập, nhận thưởng!",
  icon: "🧮",
  grad: "from-emerald-400 to-green-600",
};


import { OFFLINE_GAME_MANIFEST } from "../games/src/manifest.js";


const NO_SUBJECT = "Chung";
const subjectLabel = (subject) => (subject && subject.trim()) || NO_SUBJECT;
const PREVIEW_GAMES = 8;

/* Bảng màu gradient cho ô tròn của mỗi game. Băm theo tên game nên màu giữ
   nguyên giữa các lần render và giữa các lần F5. */
const CARD_TINTS = [
  ["#8fd3f4", "#4aa8e0"], ["#ffc9a3", "#f78b4a"], ["#c2e9c8", "#4fae63"],
  ["#dcc7f5", "#8b5cd6"], ["#ffe08a", "#f0a500"], ["#bfe6f5", "#3d9fd0"],
  ["#f9bcd6", "#e05a9c"], ["#cfe0ff", "#5b7ce0"],
];
const tintFor = (key = "") => CARD_TINTS[hashString(key) % CARD_TINTS.length];

// Giá trị `activeSubject` đặc biệt: xem nhóm game offline thay vì môn học.
// Game offline. Nguon su that: src/games/src/manifest.js (sinh boi scripts/build-offline-games.mjs)
// Moi game la MOT file HTML rieng trong src/games/offline/<id>.html
// Màu rèm/nút cho từng game — khai tường minh để không phải đoán từ class gradient.
const TILE_COLORS = Object.fromEntries(
  OFFLINE_GAME_MANIFEST.map((g) => [
    g.id,
    ({
      "math": "#F2B632", "memory": "#3D6FD8", "scramble": "#EE7FA6", "quiz": "#7C5CE0", "snake": "#2A9D8F",
      "flap": "#F2B632", "g2048": "#7C5CE0", "chem": "#2A9D8F", "clock": "#E5533D", "pattern": "#3D6FD8",
      "simon": "#EE7FA6", "anagram": "#F2B632", "stroop": "#7C5CE0", "sumseq": "#3D6FD8", "compare": "#2A9D8F",
      "riddle": "#E5533D", "shapecount": "#EE7FA6",
      "chem-trai-cay": "#E5533D", "hu-trai-cay": "#F2B632", "xep-khoi": "#3D6FD8", "pha-gach": "#7C5CE0",
      "nhay-xoay": "#3D6FD8", "goc-thu-gian": "#2A9D8F", "trung-tam-game": "#7C8AA0",
      "dap-sau-bo": "#E5533D", "ghep-cap-vuon": "#EE7FA6", "sau-an-la": "#F2B632",
      "parkour": "#2A9D8F",
    })[g.id] || "#F2B632",
  ])
);

const OFFLINE_GAMES = OFFLINE_GAME_MANIFEST.map((g) => ({
  key: g.id,
  path: `/offline/${g.id}`,
  name: g.name,
  tag: g.tag,
  description: g.tag,
  icon: g.icon,
  grad: g.grad,
  color: TILE_COLORS[g.id] || "#F2B632",
}));

// ─── Card môn học trên hàng ngang ────────────────────────────────────
// Mỗi môn lấy từ API (`games[].subject`) nên tên tuỳ ý. Bảng dưới khớp
// theo từ khoá; môn không khớp thì nhận màu theo thứ tự băm, và câu mô
// tả luôn nhắc lại tên môn nên không bao giờ hiện sai nội dung.
// Bảng màu + nhóm tuổi gợi ý theo môn học.
// `kind` quyết định badge trên ô game (Học/Chơi); `age` là pill "2–8 tuổi".
const SUBJECT_META = [
  { keys: ["toan", "math", "so"], kind: "learn", age: "2–8 tuổi", icon: "🧮", desc: "Rèn luyện tư duy và kỹ năng tính toán" },
  { keys: ["tieng viet", "ngu van", "van"], kind: "learn", age: "3–7 tuổi", icon: "📖", desc: "Luyện đọc, viết và mở rộng vốn từ" },
  { keys: ["tieng anh", "english"], kind: "learn", age: "4–8 tuổi", icon: "🗣️", desc: "Luyện nói và từ vựng tiếng Anh" },
  { keys: ["khoa hoc", "sinh", "hoa", "vat ly", "science"], kind: "learn", age: "5–8 tuổi", icon: "🔬", desc: "Khám phá thế giới xung quanh" },
  { keys: ["lich su", "dia ly", "history", "geography"], kind: "learn", age: "6–8 tuổi", icon: "🌍", desc: "Khám phá về hóa và các cùng miền" },
  { keys: ["tin hoc", "lap trinh", "computer"], kind: "play", age: "6–8 tuổi", icon: "💻", desc: "Lập trình và tư duy máy tính" },
  { keys: ["the duc", "pe"], kind: "play", age: "5–8 tuổi", icon: "⚽", desc: "Vận động và rèn luyện sức khoẻ" },
  { keys: ["am nhac", "music"], kind: "play", age: "4–8 tuổi", icon: "🎵", desc: "Khám phá thế giới âm nhạc" },
];

// Băm chuỗi về số nguyên để màu ổn định giữa các lần render.
function hashString(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (s.charCodeAt(i) + ((h << 5) - h)) | 0;
  return Math.abs(h);
}

function metaForSubject(subject = "") {
  const slug = subject.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hit = SUBJECT_META.find((m) => m.keys.some((k) => slug.includes(k)));
  if (hit) return hit;
  return { ...SUBJECT_META[hashString(subject) % SUBJECT_META.length], desc: `Thử thách môn ${subject} với những câu hỏi thú vị` };
}

// Menu chính hiện ngang trên header (desktop).
// KHÔNG phải "tất cả mục" — chỉ những mục người dùng vào thường xuyên.
// Phần còn lại nằm trong menu "Thêm" (dropdown) để header không bị chật.

// Mọi mục còn lại + quản trị + tài khoản → nút "Thêm" trên header.
const MORE_ITEMS = (userAuth) => ([
  { key: "reminders", icon: Bell, label: "Nhắc nhở", type: "path", path: "/reminders", show: !!userAuth?.user },
  { key: "shop", icon: Gift, label: "Kho đồ", type: "path", path: "/inventory", show: !!userAuth?.user },
  { key: "leaderboard", icon: Crown, label: "Bảng xếp hạng", type: "path", path: "/leaderboard", show: !!userAuth?.user },
  { key: "friends", icon: Search, label: "Tìm bạn", type: "path", path: "/find-friends", show: !!userAuth?.user },
  { key: "assignment", icon: FileText, label: "Bài tập", type: "path", path: "/assignment", show: !!userAuth?.user },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", type: "path", path: "/spin-wheel", show: !!userAuth?.user },
  { key: "pet", icon: PawPrint, label: "Thú cưng", type: "path", path: "/pet", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Hồ sơ", type: "path", path: "/profile", show: !!userAuth?.user },
]);

// Menu đầy đủ (dùng cho dropdown "Thêm" + menu hamburger mobile)
const SIDEBAR_ITEMS = (userAuth) => ([
  { key: "home", icon: Home, label: "Trang chủ", type: "path", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Chơi game", type: "scroll", target: "games-section", show: true },
  { key: "subjects", icon: BookOpen, label: "Học tập", type: "scroll", target: "subjects-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", type: "path", path: "/daily-tasks", show: true, badge: true },
  { key: "reminders", icon: Bell, label: "Nhắc nhở", type: "path", path: "/reminders", show: !!userAuth?.user },
  { key: "garden", icon: Sprout, label: "Khu vườn", type: "path", path: "/garden", show: !!userAuth?.user },
  { key: "shop", icon: Gift, label: "Kho đồ", type: "path", path: "/inventory", show: !!userAuth?.user },
  { key: "achievements", icon: Trophy, label: "Thành tựu", type: "path", path: "/achievements", show: true },
  { key: "leaderboard", icon: Crown, label: "Bảng xếp hạng", type: "path", path: "/leaderboard", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Hồ sơ", type: "path", path: "/profile", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", type: "path", path: "/chat", show: !!userAuth?.user },
  { key: "friends", icon: Search, label: "Tìm bạn", type: "path", path: "/find-friends", show: !!userAuth?.user },
  { key: "assignment", icon: FileText, label: "Bài tập", type: "path", path: "/assignment", show: !!userAuth?.user },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", type: "path", path: "/spin-wheel", show: !!userAuth?.user },
]);

const BOTTOM_NAV = (userAuth) => [
  { key: "home", icon: Home, label: "Trang chủ", type: "path", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Game", type: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", type: "path", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", type: "path", path: "/chat", show: !!userAuth?.user },
  { key: "profile", icon: User, label: "Cá nhân", type: "path", path: "/profile", show: !!userAuth?.user },
];

// Thành tích nổi bật (mock — sẽ nối API sau)
const ACHIEVEMENTS = [
  { icon: "🏅", title: "Hoàn thành 100 câu hỏi", progress: 68, target: 100, reward: "+50", type: "coin", tint: "from-amber-400 to-orange-500" },
  { icon: "📅", title: "Đăng nhập 7 ngày liên tiếp", progress: 5, target: 7, reward: "+100", type: "star", tint: "from-sky-400 to-blue-500" },
  { icon: "🌳", title: "Trồng 50 cây", progress: 18, target: 50, reward: "+75", type: "coin", tint: "from-emerald-400 to-green-600" },
  { icon: "🐉", title: "Hạ gục Boss đầu tiên", progress: 0, target: 1, reward: "+200", type: "coin", tint: "from-rose-400 to-red-500" },
];

export default function HomeScreen({ onSelectGame, userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  // ─── STATE / LOGIC (giữ nguyên từ bản cũ) ───
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [userStars, setUserStars] = useState(0);
  const [gift, setGift] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('gq_sound') !== '0'; } catch { return true; }
  });
  const [pwaVisible, setPwaVisible] = useState(() => {
    try { return localStorage.getItem('gq_pwa_closed') !== '1'; } catch { return true; }
  });
  const [notifications, setNotifications] = useState([]);
  const templates = useTemplates();
  const { dueReminder, dismissDue } = useReminderCheck(userAuth?.token);

  const toggleSound = () => {
    setSoundOn((v) => {
      try { localStorage.setItem('gq_sound', v ? '0' : '1'); } catch { /* ignore */ }
      return !v;
    });
  };

  // Khi nhắc nhở tới giờ: rung + phát chuông theo đúng cấu hình của reminder đó.
  // (Trước đây modal hiện lên im lặng — đây chính là bug "cấu hình rung không có tác dụng".)
  useEffect(() => {
    if (!dueReminder) return;
    playVibration(dueReminder.vibratePattern, dueReminder.vibrate);
    // Nút 🔊 trên header tắt/bật chuông báo nhắc nhở.
    if (dueReminder.sound !== false && soundOn) playReminderSound();
    return () => stopVibrationLoop();
  }, [dueReminder, soundOn]);

  const handleDismissDue = () => {
    stopVibrationLoop();
    dismissDue();
  };

  const [dailyTasks, setDailyTasks] = useState(null);
  const [showAllGames, setShowAllGames] = useState(false);
  const pet = usePet();

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
    } catch { /* ignore */ }
  };

  const loadTasks = async () => {
    if (!userAuth?.user) { setDailyTasks([]); return; }
    try {
      const data = await taskService.getTasks("DAILY");
      setDailyTasks(data?.tasks || []);
    } catch { setDailyTasks([]); }
  };

  useEffect(() => {
    loadNotifications();
    loadTasks();
    if (userAuth?.user) {
      coinService.get().then(c => setUserCoins(c?.coins || 0)).catch(() => { });

      // Register FCM token if permission is already granted
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

  const handleResetDevices = async () => {
    try {
      setPushMessage("Đang reset device token...");
      await notificationService.resetDevices();
      const token = await requestNotificationPermission();
      if (token) {
        await notificationService.registerDevice(token, "WEB");
        setPushMessage("✅ Đã reset và đăng ký lại device thành công!");
      } else {
        setPushMessage("✅ Đã xóa token cũ. Hãy bật lại thông báo để đăng ký mới.");
      }
      setPushStatus(getPushSupportStatus());
    } catch (err) {
      setPushMessage("❌ Lỗi reset: " + (err.message || "Thất bại"));
    }
  };

  // Refresh notifications when receiving game invite or any new notification via socket (realtime)
  useEffect(() => {
    if (!userAuth?.user) return;
    const onInvite = () => loadNotifications();
    const onNotificationNew = () => loadNotifications();
    socket.on(SOCKET_EVENTS.GAME_INVITE_RECEIVED, onInvite);
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, onNotificationNew);
    return () => {
      socket.off(SOCKET_EVENTS.GAME_INVITE_RECEIVED, onInvite);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, onNotificationNew);
    };
  }, [userAuth?.user]);

  // Listen for foreground push messages
  useEffect(() => {
    if (!userAuth?.user) return;
    const unsubscribe = onForegroundMessage((payload) => {
      const data = payload.data || {};
      const title = data.title || payload.notification?.title || "Thông báo";
      const body = data.body || payload.notification?.body || "";
      setNotifications(prev => [{
        id: `fg-${Date.now()}`,
        title,
        message: body,
        type: data.type || "SYSTEM",
        data,
        read: false,
        createdAt: new Date().toISOString(),
      }, ...prev]);

      try {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          const notif = new Notification(title, {
            body,
            icon: "/educational-games/eduplay-icon-192x192.png",
            badge: "/educational-games/eduplay-icon-192x192.png",
            tag: data.type || "eduplay-fg",
          });
          notif.onclick = () => {
            window.focus();
            if (data.type === "chat_message" || data.type === "CHAT" || data.conversationId?.startsWith?.("dm:")) {
              navigate("/chat");
            } else if (data.link) {
              navigate(data.link);
            }
            notif.close();
          };
        }
      } catch { /* ignore */ }

      // Play sound for reminder notifications
      if (data.sound !== "false" && (data.type === "REMINDER" || data.type === "REMINDER_CREATED")) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
          osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
          osc.start(audioCtx.currentTime);
          osc.stop(audioCtx.currentTime + 0.5);
        } catch { /* ignore */ }
      }

      // Vibrate device with custom pattern
      if (data.vibrate !== "false" && navigator.vibrate) {
        function parseVibratePattern(str) {
          if (!str) return [200, 100, 200];
          if (str === "repeat") return "repeat";
          const nums = str.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 0);
          return nums.length > 0 ? nums : [200, 100, 200];
        }
        const vp = parseVibratePattern(data.vibratePattern);
        if (vp === "repeat") {
          function vibrateLoop() {
            navigator.vibrate([300, 100, 300, 100, 300]);
            window._fgVibrateInterval = setInterval(() => {
              navigator.vibrate([300, 100, 300, 100, 300]);
            }, 800);
          }
          vibrateLoop();
          setTimeout(() => { if (window._fgVibrateInterval) { clearInterval(window._fgVibrateInterval); window._fgVibrateInterval = null; } }, 30000);
        } else {
          navigator.vibrate(vp);
        }
      }
    });
    return unsubscribe;
  }, [userAuth?.user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      loadNotifications();
    } catch { /* ignore */ }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      loadNotifications();
    } catch { /* ignore */ }
  };

  const handleDeleteAll = async () => {
    try {
      await notificationService.deleteAll();
      setNotifications([]);
    } catch { /* ignore */ }
  };

  const lv = getLevelProgress(userCoins);

  const handleClaimTask = async (taskId) => {
    try {
      const res = await taskService.claimReward(taskId);
      if (res?.newCoins != null) setUserCoins(res.newCoins);
      await loadTasks();
    } catch { /* ignore */ }
  };

  const pendingTaskCount = (dailyTasks || []).filter(t => !t.claimed).length;

  const visibleGames = useMemo(() => games || [], [games]);

  // Game học tập: ghim game nổi bật rồi tới danh sách của môn đang chọn.
  // Offline: bấm card trên hàng ngang → nhảy thẳng vào game luôn, không cần
  // bước chọn trung gian (mỗi game là 1 file HTML riêng).
  const learningGames = useMemo(() => {
    const list = visibleGames.map((g, i) => ({ game: g, index: i, template: templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid)) }));
    return showAllGames ? list : list.slice(0, PREVIEW_GAMES);
  }, [visibleGames, templates, showAllGames]);

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Cuộn tới section trên trang chủ.
  // Dùng window.scrollTo với vị trí tuyệt đối thay vì scrollIntoView để tránh
  // silent-fail khi target render có điều kiện hoặc khi <html> bị height:100%.
  // Nếu không tìm thấy target, fallback về section Game đề xuất rồi về đầu trang.
  const scrollTo = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      let el = document.getElementById(id);
      if (!el && id === "subjects-section") el = document.getElementById("games-section");
      if (!el) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 60);
  };

  const handleNavClick = (item) => {
    if (item.type === "login") return onUserLogin();
    if (item.type === "scroll") return scrollTo(item.target);
    if (item.path) return goTo(item.path);
  };

const moreItems = MORE_ITEMS(userAuth).filter(i => i.show);
  const navItems = SIDEBAR_ITEMS(userAuth).filter(i => i.show);

  /* ══════════════════════════════════════════════════════════════════════
     GIAO DIỆN MỚI — theo bản mẫu: header nhẹ, banner PWA, hàng nút tròn +
     nút "Chơi ngẫu nhiên", rồi các dải game cuộn ngang theo chủ đề.
     Toàn bộ menu cũ + nhiệm vụ + thú cưng + thành tựu chuyển vào sheet ⚙️.
     ══════════════════════════════════════════════════════════════════════ */

  // ── sao + quà hằng ngày ──────────────────────────────────────────────
  // Server tự chặn nhận trùng trong ngày nên gọi mỗi lần vào cũng an toàn.
  useEffect(() => {
    if (!userAuth?.token) return;
    let cancelled = false;
    (async () => {
      try {
        const s = await starService.get();
        if (!cancelled) setUserStars(s?.stars || 0);
      } catch { /* ignore */ }
      try {
        const res = await starService.claimDailyGift();
        if (cancelled || !res?.claimed) return;
        setUserStars(res.stars || 0);
        setGift({ amount: res.amount, total: res.stars });
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [userAuth?.token]);

  // Bảo đảm dữ liệu nạp được ngay khi mở sheet (nếu chưa từng nạp).
  const openMenu = () => {
    setMenuOpen(true);
    if (!userAuth?.user) return;
    loadNotifications();
    loadTasks();
  };

  /* Bảng màu ô tròn trong dải card: băm theo tên để giữ ổn định giữa các lần
     render (không đổi màu mỗi lần F5). */

  /* "Hôm nay của bé": lấy tối đa 8 game, ưu tiên game mới nhất rồi tới game có
     nhiều người chơi — không phụ thuộc môn để mỗi ngày có chút đổi mới. */
  const todayGames = useMemo(() => {
    const list = (games || []).map((game, i) => {
      const t = templates.find((x) => x._id === (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid));
      const subject = subjectLabel(game.subject);
      const meta = metaForSubject(subject);
      return {
        key: String(game._id || game.id || i),
        name: game.name,
        icon: t?.icon || "🎮",
        grad: tintFor(game.name || String(i)),
        border: tintFor(game.name || String(i))[1],
        badge: meta.kind === "learn" ? "Học" : "Chơi",
        age: meta.age,
        play: () => onSelectGame(game),
      };
    });
    return [...list].sort((a, b) => hashString(b.key) - hashString(a.key)).slice(0, 8);
  }, [games, templates, onSelectGame]);

  const mathGames = useMemo(() => {
    return (games || [])
      .filter((g) => /toan|math|so\b/i.test(subjectLabel(g.subject)))
      .map((game, i) => {
        const t = templates.find((x) => x._id === (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid));
        const tint = tintFor(game.name || `m${i}`);
        return {
          key: String(game._id || game.id || i),
          name: game.name,
          icon: t?.icon || "🧮",
          grad: tint,
          border: tint[1],
          badge: "Học",
          age: metaForSubject(subjectLabel(game.subject)).age,
          play: () => onSelectGame(game),
        };
      });
  }, [games, templates, onSelectGame]);

  const offlineCards = useMemo(
    () => OFFLINE_GAMES.map((g) => ({
      key: g.key,
      name: g.name,
      icon: g.icon || "🎮",
      grad: tintFor(g.key),
      border: g.color || "#F2B632",
      badge: "Chơi",
      age: g.tag || "Mọi lứa tuổi",
      play: () => navigate(g.path),
    })),
    []
  );

  /* Nút "Chơi ngẫu nhiên" — bốc ngẫu nhiên trong toàn bộ game (API + offline). */
  const handleRandomPlay = () => {
    const pool = [
      ...(games || []).map((g) => ({ label: g.name, run: () => onSelectGame(g) })),
      ...OFFLINE_GAMES.map((g) => ({ label: g.name, run: () => navigate(g.path) })),
    ];
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    pick.run();
  };

  const closePwaBanner = () => {
    setPwaVisible(false);
    try { localStorage.setItem("gq_pwa_closed", "1"); } catch { /* ignore */ }
  };

  return (
    <div className="gq-home">
      <Confetti />

      {dueReminder && (
        <div className="gq-reminder">
          <div className="w-10 h-10 rounded-full bg-amber-100 grid place-items-center text-xl flex-shrink-0">🔔</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Nhắc nhở!</p>
            <p className="font-semibold text-sm">{dueReminder.title}</p>
            {dueReminder.message && <p className="text-xs text-slate-500 mt-0.5">{dueReminder.message}</p>}
          </div>
          <button onClick={handleDismissDue}
            className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600 transition flex-shrink-0">
            OK
          </button>
        </div>
      )}

      <div className="gq-page">
        {/* ─────────── HEADER ─────────── */}
        <header className="gq-top">
          <div className="gq-logo">
            <span className="gq-logo__mark" aria-hidden="true">🎪</span>
            <span>
              <span className="gq-logo__name">Lớp Học Vui</span>
              <span className="gq-logo__sub">EDUGAMES</span>
            </span>
          </div>

          <div className="gq-age" title={`Nhóm tuổi: ${AGE_BAND.label}`}>
            <span className="gq-age__num">{CHILD_AGE}</span>
            <span className="gq-age__txt">
              <span className="gq-age__lbl">Bé {CHILD_AGE} tuổi</span>
              <span className="gq-age__sub">{AGE_BAND.label} · {AGE_BAND.range}</span>
            </span>
          </div>

          <div className="gq-actions">
            <button className="gq-iconbtn" onClick={() => goTo("/my-coins")} aria-label={`Sao: ${userStars}`}>
              ⭐<span className="gq-iconbtn__n">{userStars}</span>
            </button>
            <button
              className={`gq-iconbtn ${soundOn ? "" : "gq-iconbtn--on"}`}
              onClick={toggleSound}
              aria-label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
              title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>
            <button className="gq-iconbtn" onClick={() => goTo("/profile")} aria-label="Hồ sơ của bé">
              ❤️
            </button>
            <button
              className="gq-iconbtn"
              onClick={openMenu}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              ⚙️
              {unreadCount > 0 && <span className="gq-iconbtn__n">{unreadCount}</span>}
            </button>
          </div>
        </header>

        {/* ─────────── BANNER CÀI APP ─────────── */}
        {pwaVisible && (
          <div className="gq-pwa">
            <button className="gq-pwa__x" onClick={closePwaBanner} aria-label="Đóng">✕</button>
            <p className="gq-pwa__t">Có app Lớp Học Vui cho điện thoại</p>
            <p className="gq-pwa__s">Tải về để bé chơi mượt hơn trên điện thoại và máy tính bảng.</p>
            <div className="gq-pwa__row">
              <button className="gq-store" onClick={() => setPushMessage("Trên iPhone: dùng Safari → Chia sẻ → Thêm vào Màn hình chính")}>
                <small>↓ Tải trên</small><b>App Store</b>
              </button>
              <button className="gq-store" onClick={() => setPushMessage("Trên Android: dùng Chrome → ⋮ → Thêm vào Màn hình chính")}>
                <small>↓ Tải trên</small><b>Google Play</b>
              </button>
            </div>
          </div>
        )}
        {pushMessage && (
          <p className="text-xs text-center bg-white rounded-2xl py-2 px-3 shadow mb-3">{pushMessage}</p>
        )}

        {/* ─────────── NÚT TRÒN + CHƠI NGẪU NHIÊN ─────────── */}
        <div className="gq-playbar">
          <button className="gq-mini" style={{ borderBottomColor: "#4fae63" }} onClick={() => goTo("/pet")}>
            <span className="gq-mini__ico" aria-hidden="true">🐔</span>
            <span className="gq-mini__lbl">Vườn thú</span>
            {pendingTaskCount > 0 && <span className="gq-mini__dot" aria-label={`${pendingTaskCount} nhiệm vụ`} />}
          </button>
          <button className="gq-mini" style={{ borderBottomColor: "#f0a500" }} onClick={() => goTo("/achievements")}>
            <span className="gq-mini__ico" aria-hidden="true">🏆</span>
            <span className="gq-mini__lbl">Cúp</span>
          </button>
          <button className="gq-random" onClick={handleRandomPlay}>
            <span className="gq-random__ico" aria-hidden="true">🎲</span>
            Chơi ngẫu nhiên
          </button>
        </div>

        {/* ─────────── HÔM NAY CỦA BÉ ─────────── */}
        <section className="gq-sect">
          <div className="gq-sect__head">
            <span className="gq-sect__ico" aria-hidden="true">⭐</span>
            <div>
              <h2 className="gq-sect__t">Hôm nay của bé</h2>
              <p className="gq-sect__s">Học xen chơi · đổi mới ngày</p>
            </div>
          </div>

          {games === null ? (
            <Loader label="Đang tải trò chơi..." />
          ) : error ? (
            <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
          ) : todayGames.length === 0 ? (
            <EmptyState icon={<PartyPopper className="w-10 h-10 text-gray-400" />} title="Chưa có trò chơi nào" subtitle="Thầy cô thêm game vào nhé!" />
          ) : (
            <div className="gq-rail">
              <GqGameCard
                name={FEATURED_GAME.name}
                icon={FEATURED_GAME.icon}
                grad={["#ffd45e", "#f0a500"]}
                border="#f0a500"
                badge="Mới"
                age="2–8 tuổi"
                play={() => navigate(FEATURED_GAME.path)}
              />
              {todayGames.slice(2).map((g) => (
                <GqGameCard key={g.key} {...g} />
              ))}
            </div>
          )}
        </section>

        {/* ─────────── SỐ & TOÁN (nền xanh lá) ─────────── */}
        {mathGames.length > 0 && (
          <section className="gq-sect gq-sect--green" id="subjects-section">
            <div className="gq-sect__head">
              <span className="gq-sect__ico" aria-hidden="true">💯</span>
              <div>
                <h2 className="gq-sect__t">Số &amp; toán <span className="gq-sect__n">{mathGames.length}</span></h2>
                <p className="gq-sect__s">Học số · tập đếm · so sánh · chia đều · đồng hồ · công trừ</p>
              </div>
            </div>
            <div className="gq-rail">
              {mathGames.map((g) => <GqGameCard key={g.key} {...g} />)}
            </div>
          </section>
        )}

        {/* ─────────── GAME OFFLINE ─────────── */}
        <section className="gq-sect">
          <div className="gq-sect__head">
            <span className="gq-sect__ico" aria-hidden="true">🎮</span>
            <div>
              <h2 className="gq-sect__t">Chơi không cần mạng</h2>
              <p className="gq-sect__s">Tiến độ lưu ngay trên máy</p>
            </div>
          </div>
          <div className="gq-rail">
            {offlineCards.map((g) => <GqGameCard key={g.key} {...g} />)}
          </div>
        </section>

        {/* ─────────── TẤT CẢ GAME ─────────── */}
        <section className="gq-sect" id="games-section">
          <div className="gq-sect__head">
            <span className="gq-sect__ico" aria-hidden="true">🕹️</span>
            <div>
              <h2 className="gq-sect__t">Tất cả trò chơi <span className="gq-sect__n">{visibleGames.length}</span></h2>
              <p className="gq-sect__s">{showAllGames ? "Đang xem tất cả" : `Xem trước ${PREVIEW_GAMES} game`}</p>
            </div>
          </div>

          <div className="gq-grid">
            {learningGames.map(({ game, index }) => {
              const t = templates.find((x) => x._id === (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid));
              const subject = subjectLabel(game.subject);
              const meta = metaForSubject(subject);
              const tint = tintFor(game.name || String(index));
              return (
                <GqGameCard
                  key={game._id || game.id || index}
                  name={game.name}
                  icon={t?.icon || "🎮"}
                  grad={tint}
                  border={tint[1]}
                  badge={meta.kind === "learn" ? "Học" : "Chơi"}
                  age={meta.age}
                  play={() => onSelectGame(game)}
                />
              );
            })}
          </div>

          {visibleGames.length > PREVIEW_GAMES && (
            <div className="flex justify-center mt-3">
              <button onClick={() => setShowAllGames((v) => !v)}
                className="rounded-full bg-white px-5 py-2 text-sm font-bold shadow">
                {showAllGames ? "Thu gọn" : `Xem tất cả ${visibleGames.length} game`}
              </button>
            </div>
          )}
        </section>

        {/* ─────────── NHẮC ĐĂNG NHẬP ─────────── */}
        {!userAuth?.user && (
          <div className="gq-login">
            <p>Đăng nhập để lưu điểm, sao và nhận quà mỗi ngày nhé!</p>
            <button onClick={onUserLogin}
              className="rounded-full bg-[#2f7fd6] text-white text-xs font-extrabold px-4 py-2 shadow hover:opacity-90 transition">
              🔑 Đăng nhập
            </button>
            <button onClick={onUserRegister}
              className="rounded-full bg-[#ffd45e] text-[#6b4a00] text-xs font-extrabold px-4 py-2 shadow hover:opacity-90 transition">
              ✨ Đăng ký miễn phí
            </button>
          </div>
        )}
      </div>

      {/* ─────────── BOTTOM NAV (mobile) ─────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_14px_rgba(29,43,82,.1)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Điều hướng chính"
      >
        <div className="flex justify-around items-center gap-1 px-2 h-16">
          {BOTTOM_NAV(userAuth).filter((i) => i.show).map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home";
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl"
                style={{ color: isActive ? "#ef7d18" : "#7d89ab" }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onSelectGame} />
      <AiChatWidget title="AI Bạn Học" />

      {/* ─────────── SHEET MENU ⚙️ ─────────── */}
      {menuOpen && (
        <div className="gq-scrim" onClick={() => setMenuOpen(false)}>
          <div className="gq-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="gq-sheet__head">
              <div>
                <span className="gq-sheet__t">Menu</span>
                {userAuth?.user && (
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {userAuth.user.name} · Lv {lv.level} · ⭐ {userStars}
                  </span>
                )}
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-xl text-slate-400 leading-none" aria-label="Đóng">✕</button>
            </div>
            <div className="gq-sheet__body">
              {/* Nhiệm vụ hôm nay */}
              {userAuth?.user && (
                <>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    Nhiệm vụ hôm nay{pendingTaskCount ? ` · ${pendingTaskCount}` : ""}
                  </p>
                  {dailyTasks === null ? (
                    <p className="px-3 py-2 text-xs text-slate-400 animate-pulse">Đang tải nhiệm vụ...</p>
                  ) : dailyTasks.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-slate-400">Không có nhiệm vụ hôm nay</p>
                  ) : (
                    dailyTasks.slice(0, 4).map((t) => (
                      <MiniQuestRow key={t.id} task={t} onClaim={handleClaimTask} />
                    ))
                  )}
                  <div className="gq-sheet__sep" />
                </>
              )}

              {/* Thú cưng */}
              {userAuth?.user && (
                <>
                  <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Thú cưng</p>
                  <button onClick={() => goTo("/pet")} className="gq-link">
                    <span className="gq-link__ico"><PetAvatar size={26} level={pet.level} /></span>
                    <span className="flex-1">
                      <span className="block">{pet.name}</span>
                      <span className="block text-[11px] font-semibold text-slate-400">
                        Cấp {pet.level} · {moodLabel(pet.mood)}
                      </span>
                    </span>
                  </button>
                  <div className="gq-sheet__sep" />
                </>
              )}

              {/* Thông báo */}
              {userAuth?.user && (
                <>
                  <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
                    Thông báo{unreadCount ? ` · ${unreadCount} chưa đọc` : ""}
                  </p>
                  {notifications.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-slate-400">Chưa có thông báo</p>
                  ) : (
                    <>
                      {notifications.slice(0, 5).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => { if (!n.read) handleMarkAsRead(n.id); }}
                          className="gq-link"
                          style={n.read ? { opacity: 0.55 } : undefined}
                        >
                          <span className="gq-link__ico">🔔</span>
                          <span className="flex-1 min-w-0">
                            <span className="block truncate">{n.title}</span>
                            <span className="block text-[11px] font-semibold text-slate-400 truncate">{n.body}</span>
                          </span>
                        </button>
                      ))}
                      <button onClick={handleMarkAllAsRead} className="gq-link text-xs text-slate-500">Đánh dấu đã đọc tất cả</button>
                      <button onClick={handleDeleteAll} className="gq-link text-xs text-rose-500">Xoá tất cả thông báo</button>
                    </>
                  )}
                  <div className="gq-sheet__sep" />
                </>
              )}

              <div className="gq-sheet__sep" />

              {/* Thành tựu nổi bật */}
              <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Thành tựu</p>
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} className="gq-link" style={{ cursor: "default" }}>
                  <span className="gq-link__ico">{a.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{a.title}</span>
                    <span className="mt-1 block h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-emerald-400"
                        style={{ width: `${Math.min(100, (a.progress / a.target) * 100)}%` }}
                      />
                    </span>
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-600">{a.progress}/{a.target}</span>
                </div>
              ))}
              <button onClick={() => goTo("/achievements")} className="gq-link text-xs text-slate-500">Xem tất cả thành tựu</button>

              {/* Điều hướng */}
              <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Điều hướng</p>
              {[...navItems, ...moreItems.filter((i) => !navItems.some((n) => n.key === i.key))]
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.key} onClick={() => handleNavClick(item)} className="gq-link">
                      <span className="gq-link__ico"><Icon className="w-4 h-4" /></span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && pendingTaskCount > 0 && (
                        <span className="gq-iconbtn__n" style={{ position: "static" }}>{pendingTaskCount}</span>
                      )}
                    </button>
                  );
                })}

              {(userAuth?.user?.role === "admin" || userAuth?.user?.role === "teacher") && (
                <button onClick={() => goTo("/admin")} className="gq-link">
                  <span className="gq-link__ico"><GraduationCap className="w-4 h-4" /></span>
                  <span className="flex-1">Trang giáo viên</span>
                </button>
              )}

              {/* Bật thông báo đẩy */}
              {userAuth?.user && (
                <>
                  <div className="gq-sheet__sep" />
                  <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Thông báo đẩy</p>
                  <button onClick={handleEnablePush} disabled={testingPush} className="gq-link">
                    <span className="gq-link__ico"><Bell className="w-4 h-4" /></span>
                    <span className="flex-1">
                      {testingPush ? "Đang bật..." : pushStatus.permission === "granted" ? "Đã bật thông báo" : "Bật thông báo"}
                    </span>
                  </button>
                  {pushStatus.permission === "granted" && (
                    <>
                      <button onClick={handleTestPush} disabled={testingPush} className="gq-link">
                        <span className="gq-link__ico"><Send className="w-4 h-4" /></span>
                        <span className="flex-1">{testingPush ? "Đang gửi..." : "Gửi thử"}</span>
                      </button>
                      <button onClick={handleResetDevices} disabled={testingPush} className="gq-link">
                        <span className="gq-link__ico"><Trash2 className="w-4 h-4" /></span>
                        <span className="flex-1">Reset thiết bị</span>
                      </button>
                    </>
                  )}
                  {pushMessage && <p className="px-3 pb-2 text-[11px] text-slate-500">{pushMessage}</p>}
                  <div className="gq-sheet__sep" />
                </>
              )}

              {/* Tài khoản */}
              {userAuth?.user ? (
                <button onClick={() => { onUserLogout(); setMenuOpen(false); }} className="gq-link gq-link--danger">
                  <span className="gq-link__ico"><LogOut className="w-4 h-4" /></span>
                  <span className="flex-1">Đăng xuất</span>
                </button>
              ) : (
                <>
                  <button onClick={onUserLogin} className="gq-link">
                    <span className="gq-link__ico"><KeyRound className="w-4 h-4" /></span>
                    <span className="flex-1">Đăng nhập</span>
                  </button>
                  <button onClick={onUserRegister} className="gq-link">
                    <span className="gq-link__ico"><Sparkles className="w-4 h-4" /></span>
                    <span className="flex-1">Đăng ký</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────── HỘP QUÀ ─────────── */}
      {gift && (
        <DailyGiftModal
          amount={gift.amount}
          totalStars={gift.total}
          onClose={() => setGift(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════ COMPONENT PHỤ ═══════════════════════ */

/** Ô game dùng chung cho cả dải ngang lẫn lưới. */
function GqGameCard({ icon, name, grad, border, badge, age, play }) {
  return (
    <button
      onClick={play}
      aria-label={`Chơi ${name}`}
      title={name}
      className="gq-card"
      style={{ borderBottomColor: border, position: "relative" }}
    >
      {badge && (
        <span className={`gq-card__badge gq-card__badge--${badge === "Mới" ? "new" : badge === "Học" ? "learn" : "play"}`}>
          {badge}
        </span>
      )}
      <span
        className="gq-card__ring"
        style={{ background: `linear-gradient(140deg, ${grad[0]}, ${grad[1]})` }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="gq-card__name">{name}</span>
      {age && <span className="gq-card__age">{age}</span>}
    </button>
  );
}

/** Một dòng nhiệm vụ gọn cho sheet menu. */
function MiniQuestRow({ task, onClaim }) {
  return (
    <div className="gq-link" style={{ cursor: "default" }}>
      <span className="gq-link__ico">{task.icon || "🎯"}</span>
      <span className="flex-1 min-w-0">
        <span className="block truncate">{task.title}</span>
        <span className="block text-[11px] font-semibold text-slate-400">
          {Math.min(task.progress || 0, task.target || 0)}/{task.target || 0}
        </span>
      </span>
      {task.claimed ? (
        <span className="text-xs font-bold text-emerald-500">✔ Đã nhận</span>
      ) : (
        <button
          onClick={() => onClaim(task.id)}
          className="rounded-full bg-emerald-500 text-white text-[11px] font-bold px-3 py-1"
        >
          Nhận
        </button>
      )}
    </div>
  );
}

/**
 * Confetti nền — danh sách vị trí cố định để không nhảy mỗi lần render.
 * Chỉ trang trí, pointer-events: none nên không chặn thao tác.
 */
function Confetti() {
  const bits = useMemo(() => {
    const marks = ["★", "♥", "●", "★", "♥", "★", "●", "♥"];
    const colors = ["#ffd45e", "#ff8a8a", "#7fd18a", "#8fb8ff", "#ffb3d1", "#c8a6ff"];
    return Array.from({ length: 46 }, (_, i) => {
      const n = hashString(`confetti-${i}`);
      return {
        left: `${(n % 970) / 10}%`,
        top: `${(n % 2400) / 10}%`,
        size: 9 + (n % 16),
        color: colors[n % colors.length],
        char: marks[n % marks.length],
        op: 0.35 + ((n % 5) / 10),
      };
    });
  }, []);

  return (
    <div className="gq-confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            fontSize: b.size,
            color: b.color,
            opacity: b.op,
            lineHeight: 1,
          }}
        >
          {b.char}
        </span>
      ))}
    </div>
  );
}
