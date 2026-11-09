import { IconNotification } from '../../components/ui/index.js';
import { useEffect, useState, useMemo, useCallback } from "react";
import { authService, classService, API_BASE, notificationService, userService, gameProgressService, walletService } from "../../services/api.js";
import { getLevelProgress } from "../../lib/utils.js";

import { Apple, CircleX, Coins, Gamepad2, Share2, Sparkles, Star, User } from "lucide-react";
import DressUpCustomizer from "../../components/avatar/DressUpCustomizer.jsx";
import { resolveOutfit } from "../../lib/dressUpAvatar.js";
import { useMediaQuery } from "../../lib/hooks.js";
import ProfileDesktop from "./profile/ProfileDesktop.jsx";
import ProfileMobile from "./profile/ProfileMobile.jsx";
import { syncKidFromAccount } from "../../lib/ageCodes.js";
import { useKidSettings } from "../../lib/kidSettings.js";
import { getPushSupportStatus, requestNotificationPermission, onForegroundMessage } from "../../firebase/messaging.js";
import { playVibration } from "../../lib/reminderUtils.js";

export default function ProfileScreen({ userAuth, onLogout, onBack }) {
  const [profile, setProfile] = useState(null);
  const [walletStars, setWalletStars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Trên desktop danh sách trò chơi mở sẵn để cột phải không trống; mobile giữ kiểu thu gọn.
  const [showGames, setShowGames] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  // Tiến độ từng game không còn nằm trong /auth/me (endpoint chỉ trả stats +
  // permissions) → mục "Trò chơi" tự gọi GET /users/me/games.
  const [games, setGames] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(null);
  const [customizer, setCustomizer] = useState(null); // null | "avatar" | "pet"
  // Bản đang hiển thị — sửa tức thì khi modal lưu xong, không cần tải lại trang.
  const [outfitPatch, setOutfitPatch] = useState({});

  // ── PWA states (theo hiweb/ProfileView.jsx, chuẩn PWA 2026) ──
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true ||
        document.referrer.includes("android-app://");
      const wasInstalled = localStorage.getItem("pwa-installed") === "true";
      return !!(isStandalone || wasInstalled);
    } catch { return false; }
  });
  const [isIOS, setIsIOS] = useState(false);
  const [platformTab, setPlatformTab] = useState("android");
  const [showIosGuide, setShowIosGuide] = useState(false);

  // ── Push notification states (theo hiweb + HomeScreen) ──
  const [pushSupport, setPushSupport] = useState(() => getPushSupportStatus());
  const [pushLoading, setPushLoading] = useState(false);
  const [testingPush, setTestingPush] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const [fgToast, setFgToast] = useState(null);

  // Avatar + thú cưng lấy thẳng từ hồ sơ (/api/auth/me), dựng SVG bằng đúng
  // data mà 2 game "Tiệm thời trang cho Bé" / "Tiệm thay đồ thú cưng" dùng.
  // `outfitPatch` là bản vừa sửa ở modal — chỉ ghi đè phần tương ứng.
  // `kidGender` là phần DEP: hồ sơ chưa có bộ đồ nào thì avatar là bộ đồ mở
  // màn THEO GIỚI TÍNH, đổi giới tính trong Cài đặt phải thấy đổi ngay.
  const kidGender = useKidSettings().gender;
  const outfit = useMemo(() => {
    const base = resolveOutfit(profile?.avatar, profile?.pet);
    return { avatar: outfitPatch.avatar ?? base.avatar, pet: outfitPatch.pet ?? base.pet };
  }, [outfitPatch, profile?.avatar, profile?.pet, kidGender]);

  /** Modal tùy chỉnh gửi lên hồ sơ rồi cập nhật ngay phần hiển thị. */
  const handleSaveOutfit = useCallback(async (kind, value) => {
    const updated = await userService.updateProfile({ [kind]: value });
    setOutfitPatch((prev) => ({
      ...prev,
      [kind]: { value, updatedAt: updated?.[kind]?.updatedAt ?? new Date().toISOString() },
    }));
    setProfile((prev) => (prev ? { ...prev, [kind]: updated?.[kind] ?? value } : prev));
  }, []);

  useEffect(() => {
    if (!userAuth?.user) return;
    setLoading(true);
    authService.me()
      .then((userData) => {
        setProfile(userData);
        // Hồ sơ trên server quyết định lớp + giới tính của bé (ageCode là mã
        // opaque, tuổi thật chỉ client suy ra) → điền vào cài đặt máy này.
        syncKidFromAccount(userData);
        setError(null);
      })
      .catch((e) => setError(e.message || "Lỗi tải profile"))
      .finally(() => setLoading(false));
  }, [userAuth]);

  // Số sao PHẢI lấy từ ví (/auth/me/wallet) — cùng một nguồn sự thật với
  // header trang chủ và Cửa hàng sao. Response của /auth/me không trả field
  // "stars" nên trước đây trang này đọc user.stars → luôn hiện 0 sao dù ví
  // có sao thật. Chỉ fallback về user.stars khi ví tải lỗi.
  useEffect(() => {
    if (!userAuth?.user) return;
    let alive = true;
    walletService.get()
      .then((w) => { if (alive) setWalletStars(typeof w?.stars === "number" ? w.stars : null); })
      .catch(() => { if (alive) setWalletStars(null); });
    return () => { alive = false; };
  }, [userAuth]);

  // Danh sách game cho mục "Trò chơi" — tách khỏi /auth/me để hồ sơ nhẹ.
  useEffect(() => {
    if (!userAuth?.user) return;
    let alive = true;
    gameProgressService.listGames()
      .then((list) => { if (alive) setGames(Array.isArray(list) ? list : []); })
      .catch(() => { if (alive) setGames([]); });
    return () => { alive = false; };
  }, [userAuth]);

  // ── PWA detection giống hiweb_PROFILE ──
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && /Safari/.test(ua));
    const android = /Android/.test(ua);
    setIsIOS(iOS);
    // auto chọn tab theo platform thực
    if (iOS) setPlatformTab("ios");
    else if (android) setPlatformTab("android");
    else setPlatformTab("desktop");

    // getInstalledRelatedApps — chuẩn PWA mới
    if ("getInstalledRelatedApps" in navigator) {
      navigator.getInstalledRelatedApps()
        .then((apps) => {
          if (apps.length > 0) {
            setIsInstalled(true);
            localStorage.setItem("pwa-installed", "true");
          }
        })
        .catch(() => { });
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstalled(false);
      localStorage.removeItem("pwa-install-dismissed");
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem("pwa-installed", "true");
      localStorage.removeItem("pwa-install-dismissed");
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Push support refresh khi permission thay đổi
  useEffect(() => {
    setPushSupport(getPushSupportStatus());
  }, [pushMessage]);

  // Lắng nghe foreground message — giống hiweb ProfileView + HomeScreen (Swal + Notification)
  useEffect(() => {
    if (!userAuth?.token) return;
    const unsubscribe = onForegroundMessage((payload) => {
      const data = payload.data || {};
      const title = data.title || payload.notification?.title || "Thông báo";
      const body = data.body || payload.notification?.body || "";
      // show in-app toast 5s
      setFgToast({ title, body });
      setTimeout(() => setFgToast(null), 5000);
      // đồng thời bắn System Notification (nếu đã cấp quyền)
      try {
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon: `${window.location.origin}/educational-games/eduplay-icon-192x192.png`,
            requireInteraction: false,
            tag: data.type || "eduplay-fg",
          });
        }
      } catch { /* ignore */ }
      // vibration theo đúng pattern đã cấu hình (dùng chung logic với SW)
      if (data.vibrate !== "false") {
        playVibration(data.vibratePattern, true);
      }
    });
    return unsubscribe;
  }, [userAuth?.token]);

  const lv = useMemo(() => getLevelProgress(profile?.coins || 0), [profile?.coins]);

  // Tách hẳn bản desktop / mobile theo breakpoint md (768px) như trang
  // account mẫu. Chỉ render một bản tại một thời điểm để các id section
  // (sec-outfit, sec-class...) không bị trùng trong DOM.
  const isDesktop = useMediaQuery("(min-width: 768px)");

  async function handleJoinClass(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError("");
    try {
      const res = await classService.join(joinCode.trim());
      if (res && res.status === false) {
        setJoinError(res.msg || "Mã lớp không hợp lệ");
        setJoining(false);
        return;
      }
      const updated = await authService.me();
      setProfile(updated);
      setJoinCode("");
    } catch (err) {
      const apiMsg =
        err?.data?.msg ||
        err?.response?.data?.msg ||
        err?.msg ||
        err?.message;
      setJoinError(apiMsg || "Có lỗi xảy ra, vui lòng thử lại");
    }
    setJoining(false);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  /** Sidebar cuộn tới mục; danh sách game phải mở trước thì mới đúng vị trí. */
  function jumpTo(id) {
    if (id === "sec-games") setShowGames(true);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  // ── PWA install handler ──
  async function handleInstallClick() {
    if (platformTab === "ios" || isIOS) {
      setShowIosGuide(true);
      return;
    }
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setPushMessage("Đã cài đặt thành công!");
          setTimeout(() => setPushMessage(""), 2000);
        }
        setDeferredPrompt(null);
      } catch { /* ignore */ }
    } else {
      // Đã cài hoặc trình duyệt chưa fire beforeinstallprompt -> hướng dẫn thủ công
      if (isInstalled) {
        setPushMessage("Ứng dụng đã được cài đặt rồi");
        setTimeout(() => setPushMessage(""), 2000);
      } else {
        setPushMessage("Hãy dùng menu trình duyệt → Cài đặt ứng dụng / Thêm vào Màn hình chính");
        setTimeout(() => setPushMessage(""), 4000);
      }
    }
  }

  // ── Push handlers (chuẩn như hiweb) ──
  async function handleEnablePush() {
    setPushLoading(true);
    setPushMessage("Đang xin quyền thông báo...");
    try {
      const support = getPushSupportStatus();
      if (!support.supported) {
        setPushSupport(support);
        setPushMessage(support.message);
        setPushLoading(false);
        return;
      }
      const token = await requestNotificationPermission();
      setPushSupport(getPushSupportStatus());
      if (token) {
        await notificationService.registerDevice(token, "WEB");
        setPushMessage("Đã bật thông báo thành công!");
      } else {
        const perm = typeof Notification !== "undefined" ? Notification.permission : "unknown";
        if (perm === "denied") setPushMessage("Bạn đã chặn thông báo. Hãy mở Cài đặt trình duyệt → Quyền → Thông báo → Cho phép.");
        else setPushMessage("Chưa thể cấp quyền. Hãy thêm vào Màn hình chính (PWA) rồi thử lại.");
      }
    } catch (err) {
      setPushMessage("Lỗi: " + (err.message || "Không thể bật thông báo"));
    } finally {
      setPushLoading(false);
      setTimeout(() => setPushMessage(""), 5000);
    }
  }

  async function handleTestPush() {
    setTestingPush(true);
    setPushMessage("Đang gửi thông báo thử nghiệm...");
    try {
      const res = await notificationService.testPush();
      if (res?.sent > 0) setPushMessage(`Đã gửi tới ${res.sent} thiết bị! Kiểm tra thông báo.`);
      else if (res?.reason === "no_registered_devices") setPushMessage("Chưa có thiết bị nào. Hãy bật thông báo trước!");
      else if (res?.reason === "fcm_not_configured") setPushMessage("Backend chưa cấu hình FIREBASE_SERVICE_ACCOUNT.");
      else setPushMessage("Kết quả: " + JSON.stringify(res));
    } catch (err) {
      setPushMessage("Lỗi gửi: " + (err.message || "Thất bại"));
    } finally {
      setTestingPush(false);
      setTimeout(() => setPushMessage(""), 5000);
    }
  }

  async function handleResetDevices() {
    setPushLoading(true);
    setPushMessage("Đang reset thiết bị...");
    try {
      await fetch(`${API_BASE}/notifications/devices/reset`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userAuth.token}` },
      });
      const token = await requestNotificationPermission();
      if (token) {
        await notificationService.registerDevice(token, "WEB");
        setPushMessage("Đã reset và đăng ký lại thành công!");
      } else {
        setPushMessage("Đã xóa token cũ. Hãy bật lại thông báo.");
      }
      setPushSupport(getPushSupportStatus());
    } catch (err) {
      setPushMessage("Lỗi reset: " + (err.message || "Thất bại"));
    } finally {
      setPushLoading(false);
      setTimeout(() => setPushMessage(""), 5000);
    }
  }

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="text-center">
          <User className="w-12 h-12 mx-auto mb-3 text-ink/30" />
          <h2 className="font-display text-lg text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-ink/50 mb-4">Bạn cần đăng nhập để xem profile</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-3">
        <p className="text-sm text-ink/40 animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-3">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  const user = profile || {};
  const stats = user.stats || { totalPlays: 0, totalXP: 0, gamesPlayed: 0 };
  const className = user.className || null;

  const wallet = [
    { icon: <Coins className="w-3.5 h-3.5" />, label: "Xu", value: (user.coins || 0).toLocaleString() },
    { icon: <Star className="w-3.5 h-3.5" />, label: "Sao", value: (walletStars ?? user.stars ?? 0).toLocaleString() },
    { icon: <Gamepad2 className="w-3.5 h-3.5" />, label: "Lượt chơi", value: stats.totalPlays },
    { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Điểm kinh nghiệm", value: (stats.totalXP || 0).toLocaleString() },
  ];

  // View-model dùng chung cho cả hai bản trình bày (desktop/mobile):
  // mọi state/handler/dữ liệu của trang gói vào một chỗ, hai bản chỉ
  // khác khung — không lặp logic.
  const vm = {
    user, stats, className, wallet, lv, outfit, userAuth,
    games, showGames, setShowGames,
    joinCode, setJoinCode, joinError, joining, handleJoinClass, copied, copyCode,
    setCustomizer, jumpTo,
    isInstalled, platformTab, setPlatformTab, deferredPrompt, handleInstallClick, isIOS,
    pushSupport, setPushSupport, pushMessage, pushLoading, testingPush,
    handleEnablePush, handleTestPush, handleResetDevices,
    onBack, onLogout,
  };

  return (
    // Khung trang tách theo breakpoint: desktop = breadcrumb + sidebar
    // 220px + cột thẻ; mobile = header tint + thẻ xếp dọc (ProfileDesktop /
    // ProfileMobile). Logic và nội dung nằm ở container này và
    // ProfileSections dùng chung.
    <div className="flex-1 w-full px-3 py-3 lg:px-4 lg:py-4">
      {/* foreground toast */}
      {fgToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm rounded-2xl shadow-xl border bg-white p-4 animate-[popIn_.25s_ease]" style={{ borderColor: "var(--line)" }}>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0"><IconNotification className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{fgToast.title}</p>
              <p className="text-xs text-ink/60 line-clamp-2">{fgToast.body}</p>
            </div>
            <button onClick={() => setFgToast(null)} className="text-ink/40 hover:text-ink"><CircleX className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      {isDesktop ? <ProfileDesktop vm={vm} /> : <ProfileMobile vm={vm} />}

      {/* iOS Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setShowIosGuide(false)}>
          <div className="w-full max-w-sm rounded-2xl p-5 shadow-xl" style={{ background: "var(--card)", border: "1px solid var(--line)" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center"><Apple className="w-4 h-4" /></div>
              <h3 className="font-display text-sm font-bold text-ink">Hướng dẫn cài đặt trên iOS</h3>
            </div>
            <div className="space-y-3 text-sm text-ink/70">
              <p className="flex gap-2"><span className="font-bold text-ink">1.</span> Nhấn nút <Share2 className="w-4 h-4 inline text-violet-600" /> <b>Chia sẻ</b> ở thanh điều hướng Safari</p>
              <p className="flex gap-2"><span className="font-bold text-ink">2.</span> Cuộn xuống và chọn <b>“Thêm vào Màn hình chính”</b></p>
              <p className="flex gap-2"><span className="font-bold text-ink">3.</span> Nhấn <b>“Thêm”</b> ở góc trên phải để hoàn tất</p>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Sau khi cài, mở EduPlay từ màn hình chính rồi vào lại đây để bật thông báo đẩy.
            </div>
            <button onClick={() => setShowIosGuide(false)} className="w-full mt-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold hover:bg-ink/90 transition">Đã hiểu</button>
          </div>
        </div>
      )}

      {/* ─── Modal tùy chỉnh avatar / thú cưng ─── */}
      {customizer && (
        <DressUpCustomizer
          kind={customizer}
          initial={outfit[customizer].value}
          onSave={handleSaveOutfit}
          onClose={() => setCustomizer(null)}
        />
      )}
    </div>
  );
}
