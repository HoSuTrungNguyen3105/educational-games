import { useEffect, useMemo, useState, useRef } from 'react'
import { gameService, coinService, notificationService, API_BASE } from '../services/api.js'
import { taskService } from '../services/taskService.js'
import { socket } from '../socket/socket.js'
import { SOCKET_EVENTS } from '../socket/socket.events.js'
import { getLevelProgress } from '../lib/utils.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import './home-theme.css'
import { Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'
import { AvatarPreviewSmall } from '../components/avatar/AvatarPreview.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'
import AiChatWidget from '../components/ai/AiChatWidget.jsx'
import { PetAvatar } from '../components/PetAvatar.jsx'
import { usePet, moodLabel } from '../lib/petApi.js'
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
  Menu,
  X,
  Star,
  ChevronRight,
  Gift,
  Users,
  Bell,
  ShipWheel,
  FileText,
  Sprout,
  PawPrint,
  Crown,
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

// Game tạo từ API có thể chưa điền môn học — gom về nhóm "Chung" để không bị lọc mất
// Game tạo từ API có thể chưa điền môn học — gom về nhóm "Chung" để không bị lọc mất
const NO_SUBJECT = "Chung";
const subjectLabel = (subject) => (subject && subject.trim()) || NO_SUBJECT;
const PREVIEW_GAMES = 8;

// Giá trị `activeSubject` đặc biệt: xem nhóm game offline thay vì môn học.
const OFFLINE_TAB = "__offline__";
const ALL_TAB = "all";

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
const SUBJECT_META = [
  { keys: ["toan", "math", "so"], icon: "🧮", grad: "from-amber-400 to-yellow-500", desc: "Rèn luyện tư duy và kỹ năng tính toán" },
  { keys: ["tieng viet", "ngu van", "van"], icon: "📖", grad: "from-sky-400 to-blue-500", desc: "Luyện đọc, viết và mở rộng vốn từ" },
  { keys: ["khoa hoc", "sinh", "hoa", "vat ly", "science"], icon: "🔬", grad: "from-emerald-400 to-green-600", desc: "Khám phá thế giới xung quanh" },
  { keys: ["lich su", "dia ly", "history", "geography"], icon: "🌍", grad: "from-violet-400 to-purple-600", desc: "Khám phá về hóa và các cùng miền" },
  { keys: ["tieng anh", "english"], icon: "🗣️", grad: "from-rose-400 to-pink-600", desc: "Luyện nói và từ vựng tiếng Anh" },
  { keys: ["tin hoc", "lap trinh", "computer"], icon: "💻", grad: "from-indigo-400 to-blue-600", desc: "Lập trình và tư duy máy tính" },
  { keys: ["the duc", "pe"], icon: "⚽", grad: "from-lime-400 to-emerald-600", desc: "Vận động và rèn luyện sức khoẻ" },
  { keys: ["am nhac", "music"], icon: "🎵", grad: "from-fuchsia-400 to-purple-600", desc: "Khám phá thế giới âm nhạc" },
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

// Card cuối cùng của hàng ngang — đại diện cho toàn bộ game offline.
const OFFLINE_RAIL_CARD = {
  key: OFFLINE_TAB,
  icon: "🎮",
  grad: "from-rose-500 to-red-600",
  desc: "Chơi vui mọi lúc, không cần mạng",
};


// Menu chính hiện ngang trên header (desktop).
// KHÔNG phải "tất cả mục" — chỉ những mục người dùng vào thường xuyên.
// Phần còn lại nằm trong menu "Thêm" (dropdown) để header không bị chật.
const HEADER_NAV = (userAuth) => ([
  { key: "home", icon: Home, label: "Trang chủ", type: "path", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Chơi game", type: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", type: "path", path: "/daily-tasks", show: !!userAuth?.user, badge: true },
  { key: "garden", icon: Sprout, label: "Khu vườn", type: "path", path: "/garden", show: !!userAuth?.user },
  { key: "achievements", icon: Trophy, label: "Thành tựu", type: "path", path: "/achievements", show: true },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", type: "path", path: "/chat", show: !!userAuth?.user },
]);

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

const QUICK_ACTIONS = [
  { key: "shop", icon: Gift, label: "Shop", sub: "Mua vật phẩm", path: "/my-coins", tint: "from-amber-400 to-yellow-500" },
  { key: "map", icon: Sprout, label: "Bản đồ", sub: "Khám phá", path: "/garden", tint: "from-emerald-400 to-green-600" },
  { key: "gift", icon: PartyPopper, label: "Hộp quà", sub: "Nhận thưởng", path: "/daily-tasks", tint: "from-pink-400 to-rose-500" },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", sub: "Quay quà", path: "/spin-wheel", tint: "from-indigo-400 to-violet-500" },
];

export default function HomeScreen({ onSelectGame, userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  // ─── STATE / LOGIC (giữ nguyên từ bản cũ) ───
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState(ALL_TAB);
  const [userCoins, setUserCoins] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const templates = useTemplates();
  const { dueReminder, dismissDue } = useReminderCheck(userAuth?.token);

  // Khi nhắc nhở tới giờ: rung + phát chuông theo đúng cấu hình của reminder đó.
  // (Trước đây modal hiện lên im lặng — đây chính là bug "cấu hình rung không có tác dụng".)
  useEffect(() => {
    if (!dueReminder) return;
    playVibration(dueReminder.vibratePattern, dueReminder.vibrate);
    if (dueReminder.sound !== false) playReminderSound();
    return () => stopVibrationLoop();
  }, [dueReminder]);

  const handleDismissDue = () => {
    stopVibrationLoop();
    dismissDue();
  };

  const [avatarLoadout, setAvatarLoadout] = useState({});
  const [avatarItems, setAvatarItems] = useState([]);
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

      // Load avatar
      Promise.all([
        fetch(`${API_BASE}/avatar/items`).then(r => r.json()),
        fetch(`${API_BASE}/avatar/loadout`, { headers: { Authorization: `Bearer ${userAuth.token}` } }).then(r => r.json()),
      ]).then(([itemsRes, loadoutRes]) => {
        if (itemsRes.status) setAvatarItems(itemsRes.data.items || []);
        if (loadoutRes.status) setAvatarLoadout(loadoutRes.data.loadout || {});
      }).catch(() => { });

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

  const subjects = useMemo(() => {
    if (!games) return [];
    return [...new Set(games.map(g => subjectLabel(g.subject)))];
  }, [games]);

  // Hàng card ngang: mọi môn học (kèm số game) + card Game Offline ở cuối.
  // Số game đếm trước để card tự biết mình còn bao nhiêu nội dung.
  const railItems = useMemo(() => {
    const count = {};
    for (const g of games || []) {
      const s = subjectLabel(g.subject);
      count[s] = (count[s] || 0) + 1;
    }
    return [
      ...subjects.map((s) => {
        const meta = metaForSubject(s);
        return { key: s, name: s, icon: meta.icon, grad: meta.grad, desc: meta.desc, count: count[s] || 0 };
      }),
      { ...OFFLINE_RAIL_CARD, name: "Game Offline", count: OFFLINE_GAMES.length },
    ];
  }, [subjects, games]);

  const visibleGames = useMemo(() => {
    if (!games) return [];
    if (activeSubject === ALL_TAB) return games;
    return games.filter(g => subjectLabel(g.subject) === activeSubject);
  }, [games, activeSubject]);

  const isOfflineTab = activeSubject === OFFLINE_TAB;

  // Game học tập: ghim game nổi bật rồi tới danh sách của môn đang chọn.
  // Offline: bấm card trên hàng ngang → nhảy thẳng vào game luôn, không cần
  // bước chọn trung gian (mỗi game là 1 file HTML riêng).
  const learningGames = useMemo(() => {
    const list = visibleGames.map((g, i) => ({ game: g, index: i, template: templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid)) }));
    return showAllGames ? list : list.slice(0, PREVIEW_GAMES);
  }, [visibleGames, templates, showAllGames]);

  const goTo = (path) => {
    navigate(path);
    setMoreOpen(false);
  };

  // Cuộn tới section trên trang chủ.
  // Dùng window.scrollTo với vị trí tuyệt đối thay vì scrollIntoView để tránh
  // silent-fail khi target render có điều kiện hoặc khi <html> bị height:100%.
  // Nếu không tìm thấy target, fallback về section Game đề xuất rồi về đầu trang.
  const scrollTo = (id) => {
    setMoreOpen(false);
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

  const showNotificationPanel = (next) => {
    setShowNotifications(next);
    if (next) loadNotifications();
  };

  const headerNav = HEADER_NAV(userAuth).filter(i => i.show);
  const moreItems = MORE_ITEMS(userAuth).filter(i => i.show);
  const navItems = SIDEBAR_ITEMS(userAuth).filter(i => i.show);

  const notificationDropdown = (posClass) => (
    <NotificationDropdown
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onDeleteAll={handleDeleteAll}
      onClose={() => setShowNotifications(false)}
      onSelectGame={onSelectGame}
      pushStatus={pushStatus}
      onEnablePush={handleEnablePush}
      onTestPush={handleTestPush}
      onResetDevices={handleResetDevices}
      testingPush={testingPush}
      pushMessage={pushMessage}
      posClass={posClass}
    />
  );

  return (
    <div className="nb-home min-h-screen text-ink">

      {dueReminder && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-amber-200 rounded-2xl shadow-2xl p-4 animate-[popIn_.3s_ease]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🔔</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-sm">Nhắc nhở!</p>
              <p className="font-semibold text-ink">{dueReminder.title}</p>
              {dueReminder.message && <p className="text-xs text-gray-500 mt-0.5">{dueReminder.message}</p>}
            </div>
            <button onClick={handleDismissDue} className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600 transition flex-shrink-0">
              OK
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ HEADER: logo · nav ngang · coin/lv/avatar ═══════════ */}
      {/* Không còn sidebar trái — toàn bộ menu nằm trên một thanh duy nhất. */}
      <header className="nb-topbar">
        <div className="flex items-center gap-3 min-w-0">
          <a href="#/" onClick={() => navigate("/")} className="flex items-center gap-2.5 shrink-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-[#F2B632] border-[3px] border-[#1D2E4A] text-lg leading-none">🎪</span>
            <span className="hidden sm:block leading-tight">
              <span className="block text-[17px] font-extrabold tracking-tight text-[#1D2E4A]">Lớp Học Vui</span>
              <span className="block text-[10px] font-bold text-[#F2B632] tracking-[0.22em]">EDUGAMES</span>
            </span>
          </a>
        </div>

        {/* Menu ngang — ẩn dưới lg vì màn hẹp thì nút "Thêm" + hamburger đủ dùng */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {headerNav.map((item) => {
            const Icon = item.icon;
            const active = item.type === "path" && item.path === "/";
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                aria-current={active ? "page" : undefined}
                className="nb-navitem"
              >
                <Icon className="w-[15px] h-[15px]" />
                {item.label}
                {item.badge && pendingTaskCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#E5533D] text-white text-[10px] font-extrabold flex items-center justify-center">
                    {pendingTaskCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {userAuth?.user && (
            <>
              {/* Ở màn hẹp chỉ giữ coin + cấp độ, các pill khác gộp vào menu "Thêm" */}
              <StatPill onClick={() => goTo("/my-coins")}>
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm">
                  <Star className="w-3 h-3" fill="currentColor" />
                </span>
                <span className="font-extrabold text-slate-700">{userCoins.toLocaleString()}</span>
              </StatPill>

              <StatPill onClick={() => goTo("/profile")}>
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center shadow-sm">
                  <Star className="w-3 h-3" fill="currentColor" />
                </span>
                <span className="font-extrabold text-slate-700 whitespace-nowrap">Lv {lv.level}</span>
                <span className="hidden xl:block w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <span className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all" style={{ width: `${lv.percent ?? 0}%` }} />
                </span>
              </StatPill>

              <div className="relative">
                <button
                  onClick={() => showNotificationPanel(!showNotifications)}
                  aria-label="Thông báo"
                  className="relative w-9 h-9 rounded-full bg-white shadow-sm hover:shadow transition text-slate-500 hover:text-sky-600 flex items-center justify-center"
                >
                  <Bell className="w-[18px] h-[18px]" />
                  {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
                </button>
                {/* Bắt buộc phải khai width: panel position:absolute bám vào
                    div.relative này — không khai thì panel bị bóp về 36px. */}
                {showNotifications && notificationDropdown("lg:absolute lg:top-12 lg:right-0 lg:w-[400px] lg:max-w-[calc(100vw-2rem)]")}
              </div>
            </>
          )}

          {/* Nút "Thêm" — luôn hiện, kể cả khách chưa đăng nhập.
              Mobile dùng nút này làm menu chính (nav ngang bị ẩn dưới lg). */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMoreOpen(v => !v)}
              aria-label="Thêm tuỳ chọn"
              aria-expanded={moreOpen}
              className="w-9 h-9 rounded-full bg-white shadow-sm hover:shadow transition text-slate-500 flex items-center justify-center"
            >
              {moreOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-11 z-50 w-60 bg-white rounded-2xl border-[3px] border-[#1D2E4A] shadow-[6px_6px_0_#1D2E4A] py-2 overflow-y-auto max-h-[70vh]">
                  {/* Mobile: nav ngang bị ẩn nên phải có đầy đủ ở đây */}
                  <div className="lg:hidden">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.key} onClick={() => handleNavClick(item)} className="nb-side__item w-auto rounded-none">
                          <span className="nb-side__ico"><Icon className="w-[15px] h-[15px]" /></span>
                          <span className="flex-1 truncate text-left">{item.label}</span>
                        </button>
                      );
                    })}
                    <div className="my-2 border-t-2 border-[#1D2E4A]/10" />
                  </div>
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.key} onClick={() => handleNavClick(item)} className="nb-side__item w-auto rounded-none">
                        <span className="nb-side__ico"><Icon className="w-[15px] h-[15px]" /></span>
                        <span className="flex-1 truncate text-left">{item.label}</span>
                      </button>
                    );
                  })}
                  {(userAuth?.user?.role === "admin" || userAuth?.user?.role === "teacher") && (
                    <button onClick={() => goTo("/admin")} className="nb-side__item w-auto rounded-none">
                      <span className="nb-side__ico"><GraduationCap className="w-[15px] h-[15px]" /></span>
                      <span className="flex-1 truncate text-left">Trang giáo viên</span>
                    </button>
                  )}
                  <div className="my-2 border-t-2 border-[#1D2E4A]/10" />
                  {userAuth?.user ? (
                    <button onClick={() => { onUserLogout(); setMoreOpen(false); }} className="nb-side__item w-auto rounded-none text-rose-500">
                      <span className="nb-side__ico"><LogOut className="w-[15px] h-[15px]" /></span>
                      <span className="flex-1 truncate text-left">Đăng xuất</span>
                    </button>
                  ) : (
                    <>
                      <button onClick={onUserLogin} className="nb-side__item w-auto rounded-none">
                        <span className="nb-side__ico"><KeyRound className="w-[15px] h-[15px]" /></span>
                        <span className="flex-1 truncate text-left">Đăng nhập</span>
                      </button>
                      <button onClick={onUserRegister} className="nb-side__item w-auto rounded-none">
                        <span className="nb-side__ico"><Sparkles className="w-[15px] h-[15px]" /></span>
                        <span className="flex-1 truncate text-left">Đăng ký</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {userAuth?.user ? (
            <button
              onClick={() => goTo("/profile")}
              aria-label="Hồ sơ"
              className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-sky-400 to-indigo-400 text-white flex items-center justify-center ring-2 ring-white shadow"
            >
              {avatarItems.length > 0
                ? <AvatarPreviewSmall loadout={avatarLoadout} items={avatarItems} size={32} />
                : <User className="w-[18px] h-[18px]" />}
            </button>
          ) : (
            <button onClick={onUserLogin} className="text-sm bg-gradient-to-r from-emerald-400 to-green-600 text-white font-bold px-4 py-2 rounded-full hover:from-emerald-500 hover:to-green-700 transition shadow-md shadow-emerald-200 shrink-0">
              Đăng nhập
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 min-w-0 flex flex-col">

        {/* ═══════════ HERO: banner tràn viền, bo cong đáy ═══════════ */}
        {/* Nằm NGOÀI .nb-page để ảnh tràn từ mép trang — nội dung chữ bên
            trong vẫn canh theo khung .nb-page để thẳng hàng với section dưới. */}
        <section className="nb-hero">
          <img
            src={`${import.meta.env.BASE_URL}banner.png`}
            alt="EduPlay — học chơi khám phá cùng EduPlay"
            className="nb-hero__img"
            draggable={false}
          />
          <div className="nb-hero__scrim" />

          <div className="nb-page nb-hero__body">
            <div className="nb-hero__copy">
              <p className="nb-hero__eyebrow">Chào {userAuth?.user?.name ? userAuth.user.name.split(" ")[0] : "bạn"} 👋</p>
              <h1 className="nb-hero__title">
                Biến giờ học thành<br />cuộc phiêu lưu!
              </h1>
              <p className="nb-hero__sub">Học mà chơi, chơi mà giỏi — tiến độ lưu ngay trên máy.</p>

              <div className="nb-hero__cta">
                <button onClick={() => scrollTo("games-section")} className="nb-hero__btn">
                  <span className="nb-hero__play"><ChevronRight className="w-4 h-4 rotate-90" strokeWidth={3} /></span>
                  Bắt đầu ngay
                </button>
                <button onClick={() => goTo("/garden")} className="nb-hero__ghost">
                  <Sprout className="w-[18px] h-[18px]" />
                  Khu vườn
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ NỘI DUNG ═══════════ */}
        <div className="nb-page">
          <main className="space-y-5 lg:space-y-7">

            {/* ─── DANH SÁCH GAME: card môn học xếp thành hàng ngang ─── */}
            <section id="games-section" className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Gamepad2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="nb-h2">Danh sách game</h2>
                    <p className="text-[11.5px] text-slate-400 -mt-0.5">Chơi không cần mạng · Tiến độ lưu ngay trên máy</p>
                  </div>
                </div>

                {/* Chuyển nhanh giữa game học tập và game offline */}
                <div className="nb-tabs" role="tablist">
                  <button
                    role="tab"
                    aria-selected={!isOfflineTab}
                    onClick={() => setActiveSubject(ALL_TAB)}
                    className={`nb-tab ${!isOfflineTab ? "nb-tab--on" : ""}`}
                  >
                    <BookOpen className="w-4 h-4" /> Game học tập
                  </button>
                  <button
                    role="tab"
                    aria-selected={isOfflineTab}
                    onClick={() => setActiveSubject(OFFLINE_TAB)}
                    className={`nb-tab ${isOfflineTab ? "nb-tab--on" : ""}`}
                  >
                    <Gamepad2 className="w-4 h-4" /> Game offline
                  </button>
                </div>
              </div>

              {/* Hàng card ngang: mọi môn học + Game Offline ở cuối.
                  Cuộn ngang trên màn hẹp, tràn viền phải trên desktop. */}
              <div id="subjects-section" className="nb-rail" role="tablist" aria-label="Môn học">
                {railItems.map((item) => {
                  const on = activeSubject === item.key;
                  return (
                    <button
                      key={item.key}
                      role="tab"
                      aria-selected={on}
                      onClick={() => {
                        setActiveSubject(item.key);
                        setShowAllGames(false);
                      }}
                      className={`nb-subj bg-gradient-to-br ${item.grad} ${on ? "nb-subj--on" : ""}`}
                    >
                      <span className="nb-subj__ic" aria-hidden="true">{item.icon}</span>
                      <span className="nb-subj__name">{item.name}</span>
                      <span className="nb-subj__desc">{item.desc}</span>
                      <span className="nb-subj__play">
                        {item.count} game <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ─── Lưới game chi tiết của nhóm đang chọn ─── */}
              {isOfflineTab ? (
                <div className="nbg-grid">
                  {OFFLINE_GAMES.map((g) => (
                    <OfflineGameCard key={g.key} game={g} />
                  ))}
                </div>
              ) : games === null ? (
                <Loader label="Đang tải trò chơi..." />
              ) : error ? (
                <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
              ) : visibleGames.length === 0 ? (
                <EmptyState icon={<PartyPopper className="w-10 h-10 text-gray-400" />} title="Chưa có trò chơi nào" subtitle="Thử chọn môn khác hoặc nhập mã vé từ thầy cô nhé!" />
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  {/* Game ghim */}
                  <FeaturedGameCard />
                  {learningGames.map(({ game, index, template }) => (
                    <GameCard key={game._id || game.id} game={game} index={index} template={template} onSelect={onSelectGame} />
                  ))}
                </div>
              )}

              {/* Nút "xem tất cả" chỉ có ý nghĩa với nhóm game học tập.
                  Khi bấm lần hai thì thu gọn về PREVIEW_GAMES. */}
              {!isOfflineTab && !error && visibleGames.length > PREVIEW_GAMES && (
                <div className="flex justify-center mt-4">
                  <button onClick={() => setShowAllGames(v => !v)} className="nb-chip">
                    {showAllGames ? "Thu gọn" : `Xem tất cả ${visibleGames.length} game`}
                  </button>
                </div>
              )}

              {/* Khi đang xem offline, nhảy thẳng vào game offline nổi bật */}
              {isOfflineTab && (
                <div className="flex justify-center mt-4">
                  <button onClick={() => navigate("/offline/trung-tam-game")} className="nb-chip">
                    Mở trung tâm game <ChevronRight className="w-3.5 h-3.5 inline" />
                  </button>
                </div>
              )}
            </section>

              {/* ─── NHẮC ĐĂNG NHẬP + SHORTCUT (chỉ khi chưa có tài khoản) ─── */}
              {!userAuth?.user && (
                <section className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white p-4 lg:p-5 flex items-center gap-3 shadow-lg">
                    <span className="text-4xl lg:text-5xl float-slow shrink-0">🎁</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base lg:text-lg leading-tight">Đăng nhập để lưu điểm, coin và nuôi pet nhé!</p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button onClick={onUserLogin} className="bg-white/95 text-sky-700 text-xs font-extrabold rounded-full px-4 py-2 shadow hover:bg-white transition active:scale-95">
                          <KeyRound className="w-3.5 h-3.5 inline mr-1" /> Đăng nhập
                        </button>
                        <button onClick={onUserRegister} className="bg-gradient-to-r from-amber-300 to-yellow-500 text-amber-900 text-xs font-extrabold rounded-full px-4 py-2 shadow hover:from-amber-400 hover:to-yellow-600 transition active:scale-95">
                          <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Đăng ký miễn phí
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="nb-card p-3 grid grid-cols-4 gap-2 content-start">
                    {QUICK_ACTIONS.map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.key} onClick={() => goTo(item.path)} className="flex flex-col items-center gap-1.5 group">
                          <span className={`w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br ${item.tint} text-white flex items-center justify-center shadow-md group-hover:-translate-y-0.5 group-active:scale-95 transition-all`}>
                            <Icon className="w-5 h-5" />
                          </span>
                          <span className="text-[10px] lg:text-[11px] font-bold text-slate-600 text-center leading-tight">{item.label}</span>
                          <span className="hidden lg:block text-[9px] text-slate-400 text-center leading-tight -mt-1">{item.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ─── PANEL: Nhiệm vụ · Thú cưng · Thành tựu ───
                  Không còn cột phải — ba panel nằm ngang dưới danh sách game. */}
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Nhiệm vụ hôm nay */}
              <PanelCard
                icon={<ClipboardList className="w-4 h-4" />}
                iconTint="from-amber-400 to-orange-500"
                title="Nhiệm vụ hôm nay"
                badge={pendingTaskCount}
                actionLabel="Xem tất cả ›"
                onAction={() => goTo("/daily-tasks")}
              >
                {dailyTasks === null ? (
                  <p className="text-xs text-slate-400 py-4 text-center animate-pulse">Đang tải nhiệm vụ...</p>
                ) : dailyTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Không có nhiệm vụ nào hôm nay</p>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {dailyTasks.slice(0, 4).map((t, i) => (
                      <QuestRow key={t.id} task={t} index={i} onClaim={handleClaimTask} />
                    ))}
                  </div>
                )}
              </PanelCard>

              {/* Thú cưng */}
              <PanelCard
                icon={<PawPrint className="w-4 h-4" />}
                iconTint="from-emerald-400 to-green-600"
                title="Thú cưng"
                actionLabel="Tùy chỉnh ›"
                onAction={() => goTo("/pet")}
              >
                <button onClick={() => goTo("/pet")} className="w-full flex items-center gap-3.5 text-left group">
                  <PetAvatar size={76} level={pet.level} className="group-hover:scale-105 transition" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-bold text-ink truncate">{pet.name}</p>
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        💗 {moodLabel(pet.mood)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span className="text-emerald-600">Lv {pet.level}</span>
                      <span>{pet.exp} / {pet.expNeeded}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all" style={{ width: `${Math.min(100, (pet.exp / pet.expNeeded) * 100)}%` }} />
                    </div>
                  </div>
                </button>
              </PanelCard>

              {/* Thành tích nổi bật */}
              <PanelCard
                icon={<Trophy className="w-4 h-4" />}
                iconTint="from-violet-400 to-purple-500"
                title="Thành tích nổi bật"
                id="achievements-section"
                actionLabel="Xem tất cả ›"
                onAction={() => goTo("/achievements")}
              >
                <div className="space-y-3">
                  {ACHIEVEMENTS.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${a.tint} text-white flex items-center justify-center text-base shadow-sm`}>
                        {a.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11.5px] font-bold text-slate-600 truncate">{a.title}</p>
                          <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-amber-600 whitespace-nowrap">
                            {a.type === "star" ? <Star className="w-3 h-3" fill="currentColor" /> : <span>🪙</span>} {a.reward}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500" style={{ width: `${Math.round((a.progress / a.target) * 100)}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{a.progress}/{a.target}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PanelCard>
            </section>
          </main>
        </div>
      </div>

      {/* ═══════════ BOTTOM NAV (mobile) ═══════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1D2E4A] border-t-[3px] border-black" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex justify-around items-center h-16">
          {BOTTOM_NAV(userAuth).filter(i => i.show).map(item => {
            const Icon = item.icon;
            const isActive = item.key === 'home';
            return (
              <button key={item.key} onClick={() => handleNavClick(item)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-sky-500'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onSelectGame} />

      {/* ═══════════ AI BẠN HỌC (nút nổi) ═══════════
          Nút nổi của AiChatWidget tự bố trí: `bottom-24` trên mobile để không bị
          chồng lên bottom nav, `lg:bottom-6` trên desktop. Không ảnh hưởng layout
          (fixed, ngoài luồng) nên hero full-width và danh sách game giữ nguyên. */}
      <AiChatWidget title="AI Bạn Học" />
    </div>
  );
}

// ═══════════════ COMPONENT PHỤ ═══════════════

function StatPill({ children, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 bg-white shadow-sm hover:shadow transition rounded-full px-2.5 py-1.5">
      {children}
    </button>
  );
}

function PanelCard({ icon, iconTint, title, badge, actionLabel, onAction, children, id }) {
  return (
    <section id={id} className="nb-card p-4 scroll-mt-24">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-display font-bold text-ink text-sm flex items-center gap-2">
          <span className={`w-7 h-7 rounded-xl bg-gradient-to-br ${iconTint} text-white flex items-center justify-center shadow-sm`}>
            {icon}
          </span>
          {title}
          {badge > 0 && (
            <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center">{badge}</span>
          )}
        </h3>
        {actionLabel && (
          <button onClick={onAction} className="text-[11px] font-bold text-sky-500 hover:text-sky-700 transition whitespace-nowrap">{actionLabel}</button>
        )}
      </div>
      {children}
    </section>
  );
}

function QuestRow({ task, index, onClaim }) {
  const tints = [
    "from-emerald-400 to-green-600",
    "from-sky-400 to-blue-500",
    "from-amber-400 to-orange-500",
    "from-violet-400 to-purple-500",
  ];
  const pct = task.target > 0 ? Math.min(100, Math.round((task.progress / task.target) * 100)) : 0;
  const isDone = task.completed && !task.claimed;
  return (
    <div className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
      <span className={`w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br ${tints[index % tints.length]} text-white flex items-center justify-center text-base shadow-sm relative`}>
        {task.completed ? "✓" : task.icon || "🎯"}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[12.5px] font-bold text-slate-600 truncate">{task.name}</p>
          <span className="flex items-center gap-0.5 text-[10.5px] font-extrabold text-amber-600 whitespace-nowrap">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-[8px]">★</span>
            +{task.rewardCoin || 0}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{task.progress}/{task.target}</span>
          {task.claimed ? (
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">✓</span>
          ) : isDone ? (
            <button onClick={() => onClaim(task.id)} className="text-[10px] font-extrabold text-white bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 rounded-full hover:from-amber-500 hover:to-orange-600 transition active:scale-95">
              Nhận
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FeaturedGameCard() {
  return (
    <button onClick={() => navigate(FEATURED_GAME.path)} style={{ "--tile-c": "#E5533D" }} className="nb-tile">
      <div className={`relative aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-br ${FEATURED_GAME.grad} flex items-center justify-center`}>
        <span className="text-5xl lg:text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">{FEATURED_GAME.icon}</span>
        <span className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 text-amber-500 flex items-center justify-center shadow">
          <Star className="w-4 h-4" fill="currentColor" />
        </span>
        <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow">MỚI</span>
      </div>
      <div className="px-1 pt-2 pb-0.5">
        <p className="font-display font-bold text-[13px] text-ink truncate">{FEATURED_GAME.name}</p>
        <p className="text-[10.5px] text-slate-400 truncate">{FEATURED_GAME.description}</p>
        <span className="mt-2 w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-400 to-green-600 text-white text-[11.5px] font-extrabold rounded-full py-1.5 shadow-sm group-hover:from-emerald-500 group-hover:to-green-700 transition">
          Chơi ngay <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
}


/**
 * Một ô game offline — DÙNG STYLE MỚI (lưới ô lớn).
 * Bám sát src/games/offline/trung-tam-game.html:
 *   nền gradient · emoji 44px · tiêu đề 22px · pill tag · thanh trạng thái bám đáy
 * Bấm vào → đi thẳng vào game (không có màn chọn trung gian).
 * Mỗi game là 1 file HTML riêng: src/games/offline/<id>.html
 *
 * KHÔNG hiện cờ "cần mạng": đây là game offline, hiển thị mạng ở đây chỉ gây
 * hiểu nhầm rằng phần lớn game phải cần Internet.
 */
function OfflineGameCard({ game }) {
  return (
    <button
      onClick={() => navigate(game.path)}
      aria-label={`Chơi ${game.name}`}
      title={game.name}
      style={{ background: game.color }}
      className="nbg-card"
    >
      <span className="nbg-card__ic" aria-hidden="true">{game.icon}</span>
      <h3 className="nbg-card__title">{game.name}</h3>
      <span className="nbg-card__tag">{game.tag}</span>
      <p className="nbg-card__desc">Chơi offline · không cần mạng</p>
      <span className="nbg-card__st">▶ Chơi ngay</span>
    </button>
  );
}


function GameCard({ game, template, onSelect, index = 0 }) {
  const color = colorForSubject(subjectLabel(game.subject));
  return (
    <button
      onClick={() => onSelect(game)}
      aria-label={`Chơi ${game.name}`}
      style={{ animationDelay: `${index * 0.06}s`, "--tile-c": "#2A9D8F" }} className="nb-tile animate-fade-in-up focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
    >
      <div className={`relative w-full aspect-[16/11] rounded-2xl bg-gradient-to-br ${color.grad} flex items-center justify-center overflow-hidden`}>
        <StampToken icon={template ? template.icon : <Gamepad2 className="w-7 h-7" />} ring="#ffffff" size={46} fontSize={20} />
        <span className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 text-amber-500 flex items-center justify-center shadow">
          <Star className="w-4 h-4" fill="currentColor" />
        </span>
        {game.playersCount > 0 && (
          <span className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Users className="w-2.5 h-2.5" /> {game.playersCount}
          </span>
        )}
      </div>
      <div className="px-1 pt-2 pb-0.5">
        <p className="font-display font-bold text-[13px] text-ink truncate">{game.name}</p>
        <p className="text-[10.5px] text-slate-400 truncate">
          {subjectLabel(game.subject)}{game.questionsCount ? ` · ${game.questionsCount} câu` : ""}
        </p>
        <span className="mt-2 w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-400 to-green-600 text-white text-[11.5px] font-extrabold rounded-full py-1.5 shadow-sm group-hover:from-emerald-500 group-hover:to-green-700 transition">
          Chơi ngay <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
}

function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteAll,
  onClose,
  onSelectGame,
  pushStatus,
  onEnablePush,
  onTestPush,
  onResetDevices,
  testingPush,
  pushMessage,
  posClass = "fixed right-2 top-14 w-[400px] max-w-[calc(100vw-1rem)]",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      <div
        ref={ref}
        onPointerDown={(e) => e.stopPropagation()}
        className={`${posClass} bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden z-50`}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-sky-50 bg-sky-50/70">
          <h3 className="font-bold text-ink">Thông báo</h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button onClick={onDeleteAll} className="text-[11px] text-rose-400 hover:text-rose-600 font-medium">
                Xóa tất cả
              </button>
            )}
            {unreadCount > 0 && (
              <button onClick={onMarkAllAsRead} className="text-xs text-sky-600 hover:text-sky-800 font-medium">
                Đánh dấu đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Push notification settings */}
        <div className="p-3.5 bg-gradient-to-r from-sky-50/80 to-emerald-50/80 border-b border-sky-100 text-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
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
              className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition text-center mb-1.5"
            >
              🔔 Cho phép thông báo trên điện thoại
            </button>
          ) : (
            <button
              disabled={testingPush}
              onClick={onTestPush}
              className="w-full py-1.5 px-3 bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold rounded-xl transition text-center disabled:opacity-50"
            >
              {testingPush ? "Đang gửi..." : "🧪 Gửi thử thông báo tới điện thoại"}
            </button>
          )}

          {pushStatus?.permission === "granted" && (
            <button
              onClick={onResetDevices}
              className="w-full mt-1.5 py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl transition text-center text-[11px]"
            >
              🔄 Reset device token (sau khi cài lại PWA)
            </button>
          )}

          {pushMessage && (
            <div className="mt-1.5 p-2 bg-white/90 rounded-lg text-[11px] text-gray-700 font-medium border border-sky-100 break-words">
              {pushMessage}
            </div>
          )}
        </div>

        {/* Notification list */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Không có thông báo nào
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => { if (!notif.read) onMarkAsRead(notif.id); }}
                className={`px-5 py-3.5 border-b border-sky-50/60 hover:bg-sky-50/40 cursor-pointer transition ${!notif.read ? 'bg-sky-50/20' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'chat_message'
                      ? <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-blue-500" /></div>
                      : <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center"><Gamepad2 className="w-4 h-4 text-emerald-500" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800 leading-snug">
                      <span className="font-semibold">{notif.fromName}</span>
                      {notif.type === 'chat_message' ? ' đã gửi một tin nhắn' : ` mời bạn chơi ${notif.gameName || 'trò chơi'}`}
                    </p>
                    {notif.gameCode && (
                      <p className="text-xs text-sky-600 mt-1 font-mono font-semibold">Mã phòng: {notif.gameCode}</p>
                    )}
                    {notif.message && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString('vi-VN')}</p>
                    {notif.type === 'game_invite' && notif.gameId && (
                      <button onClick={async (e) => {
                        e.stopPropagation();
                        onClose();
                        try {
                          const g = await gameService.get(notif.gameId);
                          if (g) {
                            const coopData = notif.data?.sessionId ? {
                              sessionId: notif.data.sessionId,
                              gameCode: notif.gameCode,
                              fromUserId: notif.fromUserId,
                              fromName: notif.fromName,
                            } : null;
                            onSelectGame(g, coopData);
                          } else navigate('/play');
                        } catch { navigate('/play'); }
                      }}
                        className="mt-2 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition">
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
                  {!notif.read && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1.5 ml-auto shrink-0" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
