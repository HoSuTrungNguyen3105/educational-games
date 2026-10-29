import { useEffect, useMemo, useRef, useState } from 'react'
import { gameService, walletService, notificationService, ticketService } from '../services/api.js'
import { taskService } from '../services/taskService.js'
import { socket } from '../socket/socket.js'
import { SOCKET_EVENTS } from '../socket/socket.events.js'
import { getLevelProgress } from '../lib/utils.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { canAccessDashboard } from '../config/roles.js'
import './home-gq.css'
import { EmptyState, ErrorState, IconChevronDown, IconFile, IconLogout, IconNotification, IconTrash, IconUser, Loader } from '../components/ui';
import TaskIcon from '../components/tasks/TaskIcon.jsx';
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'
import AiChatWidget from '../components/ai/AiChatWidget.jsx'
import { PetAvatar } from '../components/PetAvatar.jsx'
import { usePet, moodLabel } from '../lib/petApi.js'
import DailyGiftModal from '../components/home/DailyGiftModal.jsx'
import { useKidSettings, ageBandLabel, kidShortName } from '../lib/kidSettings.js'
import { requestNotificationPermission, onForegroundMessage, getPushSupportStatus } from '../firebase/messaging.js'
import useReminderCheck from '../hooks/useReminderCheck.js'
import { playVibration, playReminderSound, stopVibrationLoop } from '../lib/reminderUtils.js'
import {
  House,
  ClipboardList,
  MessageCircle,
  Search,
  Gamepad2,
  GraduationCap,
  BookOpen,
  Trophy,
  KeyRound,
  Sparkles,
  PartyPopper,
  Gift,
  ShipWheel,
  Sprout,
  Crown,
  Star,
  Send,
  RefreshCw,
  LayoutDashboard,
  Ellipsis,
} from 'lucide-react'


// Game nổi bật được ghim lên đầu (chơi ngay, không cần qua API)
const FEATURED_GAME = {
  key: "math-adventure",
  path: "/math-adventure",
  name: "Math Adventure",
  subject: "Toán học",
  description: "Giải bài tập, nhận thưởng!",
  icon: "🧮",
};


import { OFFLINE_GAME_MANIFEST } from "../games/offline/games-src/manifest.js";
import { gameThumbnail, thumbnailForGame } from "../lib/gameThumbnail.js";
import { subscribeWallet } from "../lib/coinWallet.js";


const NO_SUBJECT = "Chung";
const subjectLabel = (subject) => (subject && subject.trim()) || NO_SUBJECT;
const PREVIEW_GAMES = 8;

/* Badge trên header chỉ chứa vài chữ số nên số lớn phải rút gọn: 1200 → 1,2k. */
const shortCount = (n) => {
  const v = Number(n) || 0;
  if (v < 1000) return String(v);
  return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(".", ",")}k`;
};

/* Màu nền ô tròn của mỗi game. Băm theo tên game nên màu giữ nguyên giữa các
   lần render và giữa các lần F5. */
const CARD_TINTS = [
  "#8fd3f4", "#ffc9a3", "#c2e9c8", "#dcc7f5",
  "#ffe08a", "#bfe6f5", "#f9bcd6", "#cfe0ff",
];
const tintFor = (key = "") => CARD_TINTS[hashString(key) % CARD_TINTS.length];

// Giá trị `activeSubject` đặc biệt: xem nhóm game offline thay vì môn học.
// Game offline. Nguon su that: src/games/src/manifest.js (sinh boi scripts/build-offline-games.mjs)
// Moi game la MOT file HTML rieng trong src/games/offline/<id>.html
// Màu nhận diện cho từng game — khai tường minh để không phải đoán từ class gradient.
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
      "parkour-tri-thuc": "#2A9D8F", "plantvsanimal": "#7AC74F", "night-strike": "#C0392B",
      "vung-dat-gio": "#7C5CE0", "coi-phong-linh": "#4A72B8", "parkour-tri-thuc-3d": "#2AA8C8",
      "nong-trai-moi": "#7AC74F", "fieldrunner": "#8BC34A", "cargo": "#F2A03D", "bang-tinh": "#3FA97A",
    })[g.id] || "#F2B632",
  ])
);

// Game thư giãn offline (loại trừ nhập vai — nằm ở SCHOOL_RPG_GAME)
const OFFLINE_GAMES = OFFLINE_GAME_MANIFEST.map((g) => ({
  key: g.id,
  id: g.id,
  path: `/offline/${g.id}`,
  name: g.name,
  tag: g.tag,
  description: g.tag,
  icon: g.icon,
  tint: TILE_COLORS[g.id] || "#F2B632",
  thumb: thumbnailForGame(g),
}));

/* ───────── GIỮ VỊ TRÍ CUỘN KHI ĐI CHƠI GAME RỒI QUAY LẠI ─────────
 * Rời trang là unmount HomeScreen, và router.js luôn scrollTo(0) khi điều
 * hướng → mất cả cuộn dọc của trang lẫn cuộn ngang của từng hàng game.
 * Trên điện thoại mỗi hàng là một thanh cuộn ngang, nên chơi game ở cuối hàng
 * xong quay về là hàng bị kéo về đầu, phải vuốt lại — khối này ghi nhớ cả hai.
 * sessionStorage (chỉ sống trong tab hiện tại): mở app lần sau vẫn vào đầu trang. */
const SCROLL_MEMO_KEY = "gq:home:scroll:v1";

function readScrollMemo() {
  try {
    return JSON.parse(sessionStorage.getItem(SCROLL_MEMO_KEY) || "null");
  } catch {
    return null;
  }
}

function writeScrollMemo() {
  try {
    const rails = {};
    document.querySelectorAll("[data-rail]").forEach((el) => {
      rails[el.dataset.rail] = Math.round(el.scrollLeft);
    });
    sessionStorage.setItem(SCROLL_MEMO_KEY, JSON.stringify({ y: Math.round(window.scrollY), rails }));
  } catch {
    /* sessionStorage bị chặn (private mode…) — chỉ là tiện ích, không phá trang */
  }
}

/** Dạng 3: Game nhập vai trường học — file gốc src/games/school_mission/ */
const SCHOOL_RPG_GAME = {
  key: "school-mission",
  path: "/school-mission",
  name: "Trường Vui Vẻ",
  tag: "Nhập vai",
  description: "Khám phá trường học, học từng lớp, làm bài thi",
  icon: "🏫",
  tint: "#3FA97A",
};

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

// Mọi mục chưa nằm trong hàng tab → dồn vào popover "Thêm" trên header.
// (Thú cưng không ở đây: nó có chip riêng ngay đầu hàng tab.)
const MORE_ITEMS = (userAuth) => ([
  { key: "reminders", icon: IconNotification, label: "Nhắc nhở", type: "path", path: "/reminders", show: !!userAuth?.user },
  { key: "shop", icon: Gift, label: "Kho đồ", type: "path", path: "/inventory", show: !!userAuth?.user },
  { key: "store", icon: Star, label: "Cửa hàng sao", type: "path", path: "/store", show: !!userAuth?.user },
  { key: "leaderboard", icon: Crown, label: "Bảng xếp hạng", type: "path", path: "/leaderboard", show: !!userAuth?.user },
  { key: "friends", icon: Search, label: "Tìm bạn", type: "path", path: "/find-friends", show: !!userAuth?.user },
  { key: "assignment", icon: IconFile, label: "Bài tập", type: "path", path: "/assignment", show: !!userAuth?.user },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", type: "path", path: "/spin-wheel", show: !!userAuth?.user },
  { key: "profile", icon: IconUser, label: "Hồ sơ", type: "path", path: "/profile", show: !!userAuth?.user },
]);

// Menu đầy đủ (dùng cho dropdown "Thêm" + menu hamburger mobile)
const SIDEBAR_ITEMS = (userAuth) => ([
  { key: "home", icon: House, label: "Trang chủ", type: "path", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Game học tập", type: "scroll", target: "games-section", show: true },
  { key: "offline", icon: Sparkles, label: "Thư giãn", type: "scroll", target: "offline-section", show: true },
  { key: "rpg", icon: GraduationCap, label: "Nhập vai", type: "scroll", target: "rpg-section", show: true },
  { key: "subjects", icon: BookOpen, label: "Môn học", type: "scroll", target: "subjects-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", type: "path", path: "/daily-tasks", show: true, badge: true },
  { key: "reminders", icon: IconNotification, label: "Nhắc nhở", type: "path", path: "/reminders", show: !!userAuth?.user },
  { key: "garden", icon: Sprout, label: "Khu vườn", type: "path", path: "/garden", show: !!userAuth?.user },
  { key: "shop", icon: Gift, label: "Kho đồ", type: "path", path: "/inventory", show: !!userAuth?.user },
  { key: "store", icon: Star, label: "Cửa hàng sao", type: "path", path: "/store", show: !!userAuth?.user },
  { key: "achievements", icon: Trophy, label: "Thành tựu", type: "path", path: "/achievements", show: true },
  { key: "leaderboard", icon: Crown, label: "Bảng xếp hạng", type: "path", path: "/leaderboard", show: !!userAuth?.user },
  { key: "profile", icon: IconUser, label: "Hồ sơ", type: "path", path: "/profile", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", type: "path", path: "/chat", show: !!userAuth?.user },
  { key: "friends", icon: Search, label: "Tìm bạn", type: "path", path: "/find-friends", show: !!userAuth?.user },
  { key: "assignment", icon: IconFile, label: "Bài tập", type: "path", path: "/assignment", show: !!userAuth?.user },
  { key: "spin", icon: ShipWheel, label: "Vòng quay", type: "path", path: "/spin-wheel", show: !!userAuth?.user },
]);

// Số ô tối đa trên hàng điều hướng của header. Vượt quá thì các tab còn lại
// dồn vào ô "Thêm" (popover trỏ xuống) thay vì kéo dài hàng tab.
const MAX_HEADER_TABS = 5;

const BOTTOM_NAV = (userAuth) => [
  { key: "home", icon: House, label: "Trang chủ", type: "path", path: "/", show: true },
  { key: "games", icon: Gamepad2, label: "Game", type: "scroll", target: "games-section", show: true },
  { key: "tasks", icon: ClipboardList, label: "Nhiệm vụ", type: "path", path: "/daily-tasks", show: !!userAuth?.user },
  { key: "chat", icon: MessageCircle, label: "Tin nhắn", type: "path", path: "/chat", show: !!userAuth?.user },
  { key: "profile", icon: IconUser, label: "Cá nhân", type: "path", path: "/profile", show: !!userAuth?.user },
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
  // popover "Thêm" của hàng tab header: vị trí tính theo nút nên phải mở
  // bằng state riêng (không dùng CSS :hover).
  const [moreOpen, setMoreOpen] = useState(false);
  const [morePos, setMorePos] = useState(null);
  const moreBtnRef = useRef(null);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('gq_sound') !== '0'; } catch { return true; }
  });
  const [pwaVisible, setPwaVisible] = useState(() => {
    try { return localStorage.getItem('gq_pwa_closed') !== '1'; } catch { return true; }
  });
  // Tuổi/lớp do phụ huynh đặt ở trang hồ sơ → tự đồng bộ sang trang này.
  const kidSettings = useKidSettings();
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

  /* Khôi phục + ghi nhớ vị trí cuộn (bộ nhớ ở SCROLL_MEMO_KEY phía trên).
   * Gộp chung MỘT effect: tách làm hai thì effect ghi dễ chạy trước khi các hàng
   * ngang kịp nhận scrollLeft, xoá mất vị trí vừa khôi phục. */
  useEffect(() => {
    const saved = readScrollMemo();
    // Số hàng từng cuộn ngang (scrollLeft > 0) — phải khôi phục đủ mới xong.
    const targets = Object.entries(saved?.rails || {}).filter(([, x]) => x > 0);
    let restoring = targets.length > 0 || (saved?.y || 0) > 0;
    let finished = false;
    let timer = 0;
    let tries = 0;

    const finish = () => {
      if (finished) return;
      finished = true;
      restoring = false;
      writeScrollMemo();
    };

    const apply = () => {
      tries += 1;
      const present = new Set();
      let restored = 0;
      document.querySelectorAll("[data-rail]").forEach((el) => {
        const key = el.dataset.rail;
        present.add(key);
        const want = saved?.rails?.[key] || 0;
        if (want <= 0) return;
        // So sánh có dung sai: scrollLeft trả về số lẻ (12.4) trong khi bộ nhớ
        // đã làm tròn (12), so bằng tuyệt đối thì khôi phục không bao giờ "xong".
        if (Math.abs(el.scrollLeft - want) > 2) el.scrollLeft = want;
        if (Math.abs(el.scrollLeft - want) <= 2) restored += 1;
      });
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const wantY = Math.min(saved?.y || 0, maxY);
      if (wantY - window.scrollY > 2) window.scrollTo(0, wantY);
      // Hàng chưa kịp render (đang tải game/ảnh) thì còn chờ; sau ~1 giây thì
      // bỏ qua, kẻo khóa luôn việc ghi nhớ cuộn của lần kế tiếp.
      const waiting = targets.filter(([key]) => present.has(key) || tries < 7);
      const pending = restored < waiting.length || wantY - window.scrollY > 2;
      if (!pending || tries >= 20) {
        finish();
        return;
      }
      timer = window.setTimeout(apply, 150);
    };

    const remember = () => {
      // Không throttle: ghi trực tiếp ~100 byte mỗi lần scroll rẻ hơn để trễ,
      // và trễ (rAF/setTimeout) sẽ mất vị trí nếu người dùng cuộn rồi bấm ngay.
      if (restoring || Date.now() < leavingUntil) return;
      writeScrollMemo();
    };
    // router.js gọi scrollTo(0) NGAY khi đổi hash, lúc HomeScreen chưa unmount →
    // cú nhảy đó kích hoạt remember và ghi đè y=900 thành 0. Bấm/cúc phím nghĩa là
    // sắp rời trang: chốt vị trí tại đây rồi làm ngơ mọi scroll trong ~0,8 giây kế
    // (đủ cho React unmount, không đủ để người dùng kịp cuộn lại).
    let leavingUntil = 0;
    const onInput = () => {
      finish();
      leavingUntil = Date.now() + 800;
      writeScrollMemo();
    };
    const INPUT_EVENTS = ["pointerdown", "wheel", "keydown", "touchstart"];
    INPUT_EVENTS.forEach((ev) => window.addEventListener(ev, onInput, { capture: true, passive: true }));

    if (restoring) apply();
    else writeScrollMemo();
    window.addEventListener("scroll", remember, { passive: true });
    document.addEventListener("scroll", remember, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", remember);
      document.removeEventListener("scroll", remember, true);
      INPUT_EVENTS.forEach((ev) => window.removeEventListener(ev, onInput, { capture: true }));
    };
  }, []);

  const handleDismissDue = () => {
    stopVibrationLoop();
    dismissDue();
  };

  const [dailyTasks, setDailyTasks] = useState(null);
  const [showAllGames, setShowAllGames] = useState(false);
  const [resettingCache, setResettingCache] = useState(false);
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
      walletService.get().then(w => { setUserCoins(w?.coins || 0); setUserStars(w?.stars || 0); }).catch(() => { });

      // Register FCM token if permission is already granted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        requestNotificationPermission().then((token) => {
          if (token) notificationService.registerDevice(token, "WEB").catch(() => { });
        }).catch(() => { });
      }
    }
  }, [userAuth?.user]);

  // Số xu đổi khi chơi game offline (ví ở src/lib/coinWallet.js) → trang chủ
  // cập nhật luôn, không phải tải lại.
  useEffect(() => subscribeWallet((w) => setUserCoins(w.coins)), []);

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

  const handleResetCache = async () => {
    setResettingCache(true);
    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      }

      // Clear localStorage (optional - only specific keys)
      localStorage.removeItem('gq_pwa_closed');
      localStorage.removeItem('gq_sound');

      setPushMessage("✅ Đã xóa cache thành công! Trang sẽ tự reload...");

      // Reload after 1 second
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setPushMessage("❌ Lỗi xóa cache: " + (err.message || "Thất bại"));
    } finally {
      setResettingCache(false);
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
    setMoreOpen(false);
  };

  // Cuộn tới section trên trang chủ.
  // Dùng window.scrollTo với vị trí tuyệt đối thay vì scrollIntoView để tránh
  // silent-fail khi target render có điều kiện hoặc khi <html> bị height:100%.
  // Nếu không tìm thấy target, fallback về section Game đề xuất rồi về đầu trang.
  const scrollTo = (id) => {
    setMenuOpen(false);
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

  const moreItems = MORE_ITEMS(userAuth).filter(i => i.show);
  const navItems = SIDEBAR_ITEMS(userAuth).filter(i => i.show);

  /* Hàng tab header: menu đầy đủ + các mục "Thêm" cũ, bỏ trùng key, giữ nguyên
     thứ tự ưu tiên. Thú cưng có chip riêng nên không nằm trong danh sách. */
  const seenNavKeys = new Set();
  const headerNav = [...navItems, ...moreItems].filter((item) => {
    if (seenNavKeys.has(item.key)) return false;
    seenNavKeys.add(item.key);
    return true;
  });
  const navOverflows = headerNav.length > MAX_HEADER_TABS;
  const headerTabs = navOverflows ? headerNav.slice(0, MAX_HEADER_TABS - 1) : headerNav;
  const moreTabs = navOverflows ? headerNav.slice(MAX_HEADER_TABS - 1) : [];

  const toggleMoreNav = () => {
    if (moreOpen) { setMoreOpen(false); return; }
    const rect = moreBtnRef.current?.getBoundingClientRect();
    if (rect) {
      // `clientWidth` chứ không phải `innerWidth`: position:fixed tính từ
      // viewport đã trừ thanh cuộn dọc, dùng innerWidth là mũi tên lệch.
      const vw = document.documentElement.clientWidth;
      const width = Math.min(252, vw - 20);
      const center = rect.left + rect.width / 2;
      const left = Math.max(10, Math.min(center - width / 2, vw - width - 10));
      setMorePos({
        top: rect.bottom + 8,
        left,
        width,
        arrow: Math.max(16, Math.min(center - left - 6, width - 22)),
      });
    }
    setMoreOpen(true);
  };

  // Popover đặt theo toạ độ nút (position: fixed) nên đóng khi trang cuộn hoặc
  // đổi cỡ cửa sổ — nếu không nó sẽ lơ lửng lệch khỏi nút.
  useEffect(() => {
    if (!moreOpen) return;
    const close = () => setMoreOpen(false);
    const onPointerDown = (e) => { if (!e.target.closest('.gq-navmore')) close(); };
    const onKeyDown = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [moreOpen]);

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
        const res = await walletService.claimDailyGift();
        if (cancelled) return;
        // Nếu API trả về claimed = true, hiển thị modal quà
        if (res?.claimed) {
          setUserStars(res.stars || 0);
          // Random loại quà: sao, xu, hoặc vé
          const rewardTypes = ['stars', 'coins', 'tickets'];
          const randomType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
          const rewardAmounts = {
            stars: res.amount || 5,
            coins: Math.floor(Math.random() * 20) + 10, // 10-30 xu
            tickets: 1 // 1 vé
          };

          // Nếu random ra xu hoặc vé, gọi API để cộng thêm
          if (randomType === 'coins') {
            try {
              const w = await walletService.addCoins(rewardAmounts.coins);
              setUserCoins(w?.coins || 0);
            } catch (e) {
              console.error("[DailyGift] Failed to add coins:", e);
            }
          } else if (randomType === 'tickets') {
            try {
              await ticketService.add(rewardAmounts.tickets);
            } catch (e) {
              console.error("[DailyGift] Failed to add tickets:", e);
            }
          }

          setGift({
            type: randomType,
            amount: rewardAmounts[randomType],
            total: res.stars || 0
          });
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [userAuth?.token]);

  // Bảo đảm dữ liệu nạp được ngay khi mở sheet (nếu chưa từng nạp).
  const openMenu = () => {
    setMoreOpen(false);
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
        thumb: gameThumbnail(t?.slug || t?.id || t?._id, game.name),
        tint: tintFor(game.name || String(i)),
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
        return {
          key: String(game._id || game.id || i),
          name: game.name,
          icon: t?.icon || "🧮",
          thumb: gameThumbnail(t?.slug || t?.id || t?._id, game.name),
          tint: tintFor(game.name || `m${i}`),
          badge: "Học",
          age: metaForSubject(subjectLabel(game.subject)).age,
          play: () => onSelectGame(game),
        };
      });
  }, [games, templates, onSelectGame]);

  const offlineCards = useMemo(
    () => OFFLINE_GAMES.map((g) => ({
      key: g.id,
      name: g.name,
      icon: g.icon || "🎮",
      thumb: g.thumb,
      tint: g.tint,
      badge: "Offline",
      age: g.tag || "Mọi lứa tuổi",
      play: () => navigate(g.path),
    })),
    []
  );

  const schoolRpgCard = useMemo(
    () => ({
      name: SCHOOL_RPG_GAME.name,
      icon: SCHOOL_RPG_GAME.icon,
      thumb: gameThumbnail(SCHOOL_RPG_GAME.key, SCHOOL_RPG_GAME.name),
      tint: SCHOOL_RPG_GAME.tint,
      badge: "Nhập vai",
      age: SCHOOL_RPG_GAME.tag,
      play: () => navigate(SCHOOL_RPG_GAME.path),
    }),
    []
  );

  // Tổng số trò chơi đang chờ bé (học tập + thư giãn + nhập vai) cho câu chào.
  const gameCount = visibleGames.length + OFFLINE_GAMES.length + 1;

  /* Tên để gọi ở lời chào + chip hồ sơ.
   * kidSettings.name nằm trong localStorage của MÁY, không đổi theo tài khoản,
   * nên lấy tên người đang đăng nhập trước — nếu không thì đăng nhập tài khoản B
   * mà trang chủ vẫn gọi "Chào A". Chưa đăng nhập thì để trống, hero hiện lời
   * mời đăng nhập chứ không chào một em bé không có thật. */
  const heroName = userAuth?.user
    ? kidShortName(userAuth.user.name || userAuth.user.username || kidSettings.name)
    : "";

  /* Nút "Chơi ngẫu nhiên" — bốc trong 3 dạng: học tập + thư giãn + nhập vai. */
  const handleRandomPlay = () => {
    const pool = [
      ...(games || []).map((g) => ({ label: g.name, run: () => onSelectGame(g) })),
      ...OFFLINE_GAMES.map((g) => ({ label: g.name, run: () => navigate(g.path) })),
      { label: SCHOOL_RPG_GAME.name, run: () => navigate(SCHOOL_RPG_GAME.path) },
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
          <div className="gq-top__row">
            <div className="gq-logo">
              {/* <span className="gq-logo__mark" aria-hidden="true"></span> */}
              <img
                className="gq-logo__mark"
                src="/educational-games/eduplay-logo.png"
                alt="EduPlay Logo"
              />
              <span>
                <span className="gq-logo__name">Lớp Học Vui </span>
                <span className="gq-logo__sub">EDUGAMES</span>
              </span>
            </div>

            {/* <div className="gq-age" title={`${heroName || "Bé"} · ${kidSettings.age} tuổi · ${ageBandLabel(kidSettings.age)}`}>
              <span className="gq-age__num">{kidSettings.age}</span>
              <span className="gq-age__txt">
                <span className="gq-age__lbl">{heroName || "Bé"}</span>
                <span className="gq-age__sub">{kidSettings.age} tuổi · {ageBandLabel(kidSettings.age)}</span>
              </span>
            </div> */}

            <div className="gq-actions">
              {canAccessDashboard(userAuth?.user?.role) && (
                <button
                  className="gq-adminbtn"
                  onClick={() => goTo("/admin")}
                  aria-label="Admin Dashboard"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                  <span>Admin Dashboard</span>
                </button>
              )}
              <button className="gq-iconbtn" onClick={() => goTo("/my-coins")} aria-label={`Xu: ${userCoins}`} title="Xu của bé">
                🪙{userCoins > 0 && <span className="gq-iconbtn__n">{shortCount(userCoins)}</span>}
              </button>
              <button className="gq-iconbtn" onClick={() => goTo("/store")} aria-label={`Sao: ${userStars} — mở cửa hàng sao`} title="Cửa hàng sao — đổi coin ⇄ sao">
                ⭐{userStars > 0 && <span className="gq-iconbtn__n">{shortCount(userStars)}</span>}
              </button>
              <button
                className={`gq-iconbtn ${soundOn ? "" : "gq-iconbtn--on"}`}
                onClick={toggleSound}
                aria-label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
                title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
              {/* Hồ sơ — trước đây chỉ là.icon ❤️ nên không ai biết bấm đi đâu.
                  Màn hẹp ẩn vì BOTTOM_NAV đã có mục "Cá nhân". */}
              {userAuth?.user && (
                <button
                  className="gq-kidchip"
                  onClick={() => goTo("/profile")}
                  aria-label={`Hồ sơ của ${heroName}`}
                  title="Hồ sơ của bé"
                >
                  <span className="gq-kidchip__ava" aria-hidden="true"><IconUser className="w-4 h-4" /></span>
                  <span className="gq-kidchip__name">{heroName}</span>
                </button>
              )}
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
          </div>

          {/* Thú cưng + tab điều hướng — trước đây nằm trong sheet ⚙️ */}
          <nav className="gq-navrow" aria-label="Điều hướng">
            {userAuth?.user && (
              <button className="gq-petchip" onClick={() => goTo("/pet")} title={`${pet.name} · cấp ${pet.level}`}>
                <PetAvatar size={30} ring={false} />
                <span className="gq-petchip__txt">
                  <span className="gq-petchip__name">{pet.name}</span>
                  <span className="gq-petchip__sub">Cấp {pet.level} · {moodLabel(pet.mood)}</span>
                </span>
              </button>
            )}

            <div className="gq-navtabs" data-rail="navtabs">
              {headerTabs.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.key} className="gq-navtab" onClick={() => handleNavClick(item)}>
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.badge && pendingTaskCount > 0 && (
                      <span className="gq-navtab__n">{pendingTaskCount}</span>
                    )}
                  </button>
                );
              })}

              {navOverflows && (
                <div className="gq-navmore" data-open={moreOpen || undefined}>
                  <button
                    ref={moreBtnRef}
                    className="gq-navtab"
                    onClick={toggleMoreNav}
                    aria-haspopup="true"
                    aria-expanded={moreOpen}
                  >
                    <Ellipsis aria-hidden="true" />
                    <span>Thêm</span>
                    <IconChevronDown className="gq-navtab__chev" aria-hidden="true" />
                  </button>
                  {moreOpen && morePos && (
                    <div className="gq-navpop" style={{ top: morePos.top, left: morePos.left, width: morePos.width }}>
                      <span className="gq-navpop__arrow" style={{ left: morePos.arrow }} aria-hidden="true" />
                      <div className="gq-navpop__grid">
                        {moreTabs.map((item) => {
                          const Icon = item.icon;
                          return (
                            <button key={item.key} className="gq-navpop__item" onClick={() => handleNavClick(item)}>
                              <Icon aria-hidden="true" />
                              <span>{item.label}</span>
                              {item.badge && pendingTaskCount > 0 && (
                                <span className="gq-navpop__n">{pendingTaskCount}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* ─────────── HERO CHÀO BÉ ─────────── */}
        <section className="gq-hero" aria-label="Lời chào của Đô">
          <img src={`${import.meta.env.BASE_URL}edu_character.png`} alt="" aria-hidden="true" className="gq-hero__mascot" />
          <div className="gq-hero__bubble">
            <p className="gq-hero__hi">{userAuth?.user ? `Chào ${heroName}! 👋` : "Chào bạn! 👋"}</p>
            <p className="gq-hero__ask">
              {games === null
                ? "Đô đang mời trò chơi ra đây rồi…"
                : `Hôm nay có ${gameCount} trò chơi đang chờ ${userAuth?.user ? "bé đó" : "bạn"}!`}
            </p>
            {/* Chưa đăng nhập thì không chào ai cả — tên bé trong kidSettings là của
                máy này, có thể là của tài khoản khác dùng chung thiết bị. */}
            {!userAuth?.user && (
              <button className="gq-hero__login" onClick={onUserLogin}>Hãy đăng nhập</button>
            )}
          </div>
        </section>

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

        {/* ─────────── NÚT TẮT + CHƠI NGẪU NHIÊN ─────────── */}
        <div className="gq-playbar">
          <button className="gq-mini" onClick={() => goTo("/garden")}>
            <span className="gq-mini__ico" aria-hidden="true">🐔</span>
            <span className="gq-mini__lbl">Khu vườn của tôi</span>
            {pendingTaskCount > 0 && <span className="gq-mini__dot" aria-label={`${pendingTaskCount} nhiệm vụ`} />}
          </button>
          <button className="gq-mini" onClick={() => goTo("/achievements")}>
            <span className="gq-mini__ico" aria-hidden="true">🏆</span>
            <span className="gq-mini__lbl">Cúp</span>
          </button>
          <button className="gq-mini" onClick={() => setShowCodeModal(true)}>
            <span className="gq-mini__ico" aria-hidden="true">🎟️</span>
            <span className="gq-mini__lbl">Nhập mã</span>
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
            <div className="gq-rail gq-board" data-rail="today">
              <GqGameCard
                name={FEATURED_GAME.name}
                icon={FEATURED_GAME.icon}
                thumb={gameThumbnail(FEATURED_GAME.key, FEATURED_GAME.name)}
                tint="#ffd45e"
                badge="Mới"
                age="2–8 tuổi"
                play={() => navigate(FEATURED_GAME.path)}
              />
              {todayGames.slice(2).map(({ key, ...card }) => (
                <GqGameCard key={key} {...card} />
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
            <div className="gq-rail gq-board" data-rail="math">
              {mathGames.map(({ key, ...card }) => <GqGameCard key={key} {...card} />)}
            </div>
          </section>
        )}

        {/* ─────────── 2. GAME THƯ GIÃN (OFFLINE) ─────────── */}
        <section className="gq-sect" id="offline-section">
          <div className="gq-sect__head">
            <span className="gq-sect__ico" aria-hidden="true">🎮</span>
            <div>
              <h2 className="gq-sect__t">Game thư giãn <span className="gq-sect__n">{offlineCards.length}</span></h2>
              <p className="gq-sect__s">Chơi không cần mạng · tiến độ lưu trên máy</p>
            </div>
          </div>
          <div className="gq-rail gq-board" data-rail="offline">
            {offlineCards.map(({ key, ...card }) => <GqGameCard key={key} {...card} />)}
          </div>
        </section>

        {/* ─────────── 3. GAME NHẬP VAI TRƯỜNG HỌC ─────────── */}
        <section className="gq-sect gq-sect--green" id="rpg-section">
          <div className="gq-sect__head">
            <span className="gq-sect__ico" aria-hidden="true">🏫</span>
            <div>
              <h2 className="gq-sect__t">Game nhập vai trường học</h2>
              <p className="gq-sect__s">Khám phá trường · học từng lớp · làm bài thi</p>
            </div>
          </div>
          <div className="gq-rail gq-board" data-rail="school">
            <GqGameCard {...schoolRpgCard} />
          </div>
        </section>

        {/* ─────────── 1. GAME HỌC TẬP (API) ─────────── */}
        <section className="gq-sect" id="games-section">
          <div className="gq-sect__head">
            <span className="gq-sect__ico" aria-hidden="true">📚</span>
            <div>
              <h2 className="gq-sect__t">Game học tập <span className="gq-sect__n">{visibleGames.length}</span></h2>
              <p className="gq-sect__s">{showAllGames ? "Đồng bộ điểm & tiến trình khi có mạng" : `Xem trước ${PREVIEW_GAMES} game · lưu kết quả lên máy chủ`}</p>
            </div>
          </div>

          <div className="gq-grid gq-board">
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
                  thumb={gameThumbnail(t?.slug || t?.id || t?._id, game.name)}
                  tint={tint}
                  badge={meta.kind === "learn" ? "Học" : "Chơi"}
                  age={meta.age}
                  play={() => onSelectGame(game)}
                />
              );
            })}
          </div>

          {visibleGames.length > PREVIEW_GAMES && (
            <div className="flex justify-center mt-3">
              <button onClick={() => setShowAllGames((v) => !v)} className="gq-more">
                {showAllGames ? "Thu gọn ▲" : `Xem tất cả ${visibleGames.length} game ▼`}
              </button>
            </div>
          )}
        </section>

        {/* ─────────── NHẮC ĐĂNG NHẬP ─────────── */}
        {!userAuth?.user && (
          <div className="gq-login">
            <span className="gq-login__face" aria-hidden="true">🎁</span>
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
        <div className="flex justify-around items-center gap-1 px-2 h-[68px]">
          {BOTTOM_NAV(userAuth).filter((i) => i.show).map((item) => {
            const Icon = item.icon;
            const isActive = item.key === "home";
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item)}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl transition-colors"
                style={{
                  color: isActive ? "#ef7d18" : "#7d89ab",
                  background: isActive ? "rgba(247, 171, 46, 0.14)" : "transparent",
                }}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.6 : 2} />
                <span className="text-[11px] font-extrabold leading-none">{item.label}</span>
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

              {(userAuth?.user?.role === "admin" || userAuth?.user?.role === "teacher") && (
                <button onClick={() => goTo("/admin")} className="gq-link">
                  <span className="gq-link__ico"><GraduationCap className="w-4 h-4" /></span>
                  <span className="flex-1">Admin Dashboard</span>
                </button>
              )}

              {/* Bật thông báo đẩy */}
              {userAuth?.user && (
                <>
                  <div className="gq-sheet__sep" />
                  <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Thông báo đẩy</p>
                  <button onClick={handleEnablePush} disabled={testingPush} className="gq-link">
                    <span className="gq-link__ico"><IconNotification className="w-4 h-4" /></span>
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
                        <span className="gq-link__ico"><IconTrash className="w-4 h-4" /></span>
                        <span className="flex-1">Reset thiết bị</span>
                      </button>
                    </>
                  )}
                  {pushMessage && <p className="px-3 pb-2 text-[11px] text-slate-500">{pushMessage}</p>}
                  <div className="gq-sheet__sep" />
                </>
              )}

              {/* Cài đặt */}
              <div className="gq-sheet__sep" />
              <p className="px-3 pb-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">Cài đặt</p>
              <button onClick={handleResetCache} disabled={resettingCache} className="gq-link">
                <span className="gq-link__ico"><RefreshCw className={`w-4 h-4 ${resettingCache ? 'animate-spin' : ''}`} /></span>
                <span className="flex-1">{resettingCache ? "Đang xóa cache..." : "Xóa cache"}</span>
              </button>

              {/* Tài khoản */}
              {userAuth?.user ? (
                <button onClick={() => { onUserLogout(); setMenuOpen(false); }} className="gq-link gq-link--danger">
                  <span className="gq-link__ico"><IconLogout className="w-4 h-4" /></span>
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
          type={gift.type}
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
function GqGameCard({ icon, name, tint, badge, age, thumb, play }) {
  return (
    <button
      onClick={play}
      aria-label={`Chơi ${name}`}
      title={name}
      className="gq-card"
    >
      {badge && (
        <span className={`gq-card__badge gq-card__badge--${badge === "Mới" ? "new" : badge === "Học" ? "learn" : "play"}`}>
          {badge}
        </span>
      )}
      <span
        className="gq-card__ring"
        style={{ backgroundColor: tint }}
        aria-hidden="true"
      >
        {thumb ? <img src={thumb} alt="" loading="lazy" /> : icon}
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
      <span className="gq-link__ico"><TaskIcon code={task.code} type={task.type} className="w-4 h-4" /></span>
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
 * Confetti — dải hoạ tiết ôm lấy phần đầu trang (đằng sau header).
 *
 * Vị trí tính theo PIXEL trong khung cao cố định (xem `.gq-confetti`), không
 * tính theo % của chiều cao trang — nếu tính theo % thì trang bị kéo dài và
 * sinh thanh cuộn thứ hai. Danh sách vị trí cố định để không nhảy mỗi lần render.
 */
function Confetti() {
  const bits = useMemo(() => {
    const marks = ["★", "♥", "●", "★", "♥", "★", "●", "♥"];
    const colors = ["#ffd45e", "#ff8a8a", "#7fd18a", "#8fb8ff", "#ffb3d1", "#c8a6ff"];
    const H = 200; // khớp height của .gq-confetti
    return Array.from({ length: 34 }, (_, i) => {
      const n = hashString(`confetti-${i}`);
      return {
        left: `${(n % 970) / 10}%`,
        top: `${(n % (H - 24)) + 4}px`,
        size: 9 + (n % 15),
        color: colors[n % colors.length],
        char: marks[n % marks.length],
        op: 0.3 + ((n % 5) / 10),
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
