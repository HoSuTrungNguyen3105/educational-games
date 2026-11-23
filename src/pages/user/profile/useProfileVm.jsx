/**
 * useProfileVm (.jsx — chứa JSX trong mảng `wallet`) — Toàn bộ logic dữ liệu
 * + handler của trang Hồ sơ, tách từ ProfileScreen.jsx cũ (2026-11-21) để
 * TRANG BÉ (/kid-dashboard) dùng chung.
 *
 * Lý do tách: các khối ProfileSections nhận một object `vm`; trước đây chỉ
 * ProfileScreen mới dựng được vm (nạp /auth/me, ví, danh sách game, sửa hồ
 * sơ, PWA, push…). Nay `/profile` gộp vào KidDashboard nên đây là NGUỒN DUY
 * NHẤT cho `vm` — trang nào cũng gọi hook này, không nhân bản logic.
 *
 * Trả về:
 *   {
 *     vm,                    // object đưa vào mọi khối ProfileSections
 *     profile, showLoading, error,
 *     fgToast, clearFgToast, // toast tin nhắn push khi app đang mở
 *     showIosGuide, setShowIosGuide,
 *     customizer, setCustomizer, outfit, handleSaveOutfit,
 *     refreshProfile,        // nạp lại /auth/me (vd sau khi bé nhận thưởng)
 *   }
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  API_BASE, apiFetch, authService, classService, gameProgressService,
  notificationService, userService, walletService,
} from "../../../services/api.js";
import { useUserAuthStore } from "../../../stores/userAuth.store.js";
import { getLevelProgress } from "../../../lib/utils.js";
import { resolveOutfit } from "../../../lib/dressUpAvatar.js";
import { useKidSettings } from "../../../lib/kidSettings.js";
import { syncKidFromAccount } from "../../../lib/ageCodes.js";
import {
  getPushSupportStatus, onForegroundMessage, requestNotificationPermission,
} from "../../../firebase/messaging.js";
import { playVibration } from "../../../lib/reminderUtils.js";
import { Coins, Gamepad2, Sparkles, Star } from "lucide-react";

/** Lấy câu báo lỗi thân thiện nhất từ lỗi apiFetch (msg nằm ở .data.msg hoặc .message). */
export function apiErrorMessage(err) {
  return (
    err?.data?.msg ||
    err?.response?.data?.msg ||
    err?.msg ||
    err?.message ||
    "Có lỗi xảy ra, vui lòng thử lại"
  );
}

export default function useProfileVm({ userAuth, showToast, onBack, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [walletStars, setWalletStars] = useState(null);
  const [error, setError] = useState(null);
  const patchUser = useUserAuthStore((s) => s.patchUser);

  // Danh tính ỔN ĐỊNH của tài khoản đang xem. Các effect nạp dữ liệu bên
  // dưới dep theo `userId` này, KHÔNG dep theo cả object `userAuth`: vòng
  // refresh nền mỗi 20 giây xoay token mới → App tạo object userAuth mới
  // (memo theo [user, token]) dù vẫn là cùng một người. Dep theo object là
  // gốc vụ "cứ gọi refresh/me/wallet/games là trang load lại".
  const userId = userAuth?.user?.id ?? null;

  // Đổi tài khoản → xoá hồ sơ + lỗi của tài khoản cũ NGAY trong render
  // (mẫu React khuyến nghị cho "reset state khi prop đổi").
  const [prevUserId, setPrevUserId] = useState(userId);
  if (prevUserId !== userId) {
    setPrevUserId(userId);
    setProfile(null);
    setError(null);
  }

  // Loading toàn trang CHỈ suy ra, không có state riêng: chưa có hồ sơ và
  // chưa có lỗi = đang nạp lần đầu. Đã có hồ sơ thì mọi lần nạp lại chạy
  // nền lặng — nội dung đang xem giữ nguyên, không bao giờ che trang.
  const showLoading = !!userId && !profile && !error;

  // Trên desktop danh sách trò chơi mở sẵn để cột phải không trống.
  const [showGames, setShowGames] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  const [games, setGames] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(null);
  const [customizer, setCustomizer] = useState(null); // null | "avatar" | "pet"
  // Bản đang hiển thị — sửa tức thì khi modal lưu xong, không cần tải lại.
  const [outfitPatch, setOutfitPatch] = useState({});

  // ── PWA states (chuẩn PWA 2026) ──
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

  // ── Push notification states ──
  const [pushSupport, setPushSupport] = useState(() => getPushSupportStatus());
  const [pushLoading, setPushLoading] = useState(false);
  const [testingPush, setTestingPush] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const [fgToast, setFgToast] = useState(null);

  // Avatar + thú cưng lấy thẳng từ hồ sơ (/api/auth/me). `outfitPatch` là
  // bản vừa sửa ở modal — chỉ ghi đè phần tương ứng. `kidGender` là phần
  // DEP: hồ sơ chưa có bộ đồ nào thì avatar là bộ đồ mở màn THEO GIỚI TÍNH.
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

  /** Nạp lại hồ sơ (/auth/me) — ví dụ bé nhận thưởng nhiệm vụ thì số xu
   *  ở sidebar/greeting cập nhật ngay mà không cần tải lại trang. */
  const refreshProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const updated = await authService.me();
      setProfile(updated);
      syncKidFromAccount(updated);
    } catch { /* giữ bản cũ — số liệu phụ */ }
  }, [userId]);

  /**
   * Lưu form "Thông tin cá nhân" (tên / email / lớp / giới tính) qua
   * PUT /auth/me. Thành công: hồ sơ + auth store + cài đặt bé nhận giá trị
   * mới NGAY. Lỗi (email trùng, sai định dạng…) toast + ném lại lỗi để form
   * giữ nguyên nội dung đang sửa.
   */
  const handleUpdateProfile = useCallback(async (values) => {
    try {
      const updated = await userService.updateProfile(values);
      setProfile(updated);
      patchUser({
        name: updated.name,
        email: updated.email,
        ageCode: updated.ageCode,
        gender: updated.gender,
      });
      syncKidFromAccount(updated);
      showToast?.("Đã cập nhật thông tin cá nhân", "success");
      return updated;
    } catch (err) {
      showToast?.(apiErrorMessage(err), "error");
      throw err;
    }
  }, [patchUser, showToast]);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    authService.me()
      .then((userData) => {
        if (!alive) return;
        setProfile(userData);
        // Hồ sơ server quyết định lớp + giới tính của bé → điền vào cài đặt máy.
        syncKidFromAccount(userData);
        setError(null);
      })
      // Lỗi nạp: chỉ thành màn hình lỗi khi CHƯA có hồ sơ nào để hiện.
      .catch((e) => { if (alive) setError(e.message || "Lỗi tải profile"); });
    return () => { alive = false; };
  }, [userId]);

  // Số sao PHẢI lấy từ ví (/auth/me/wallet) — cùng nguồn sự thật với header
  // trang chủ và Cửa hàng sao. Chỉ fallback về user.stars khi ví tải lỗi.
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    walletService.get()
      .then((w) => { if (alive) setWalletStars(typeof w?.stars === "number" ? w.stars : null); })
      .catch(() => { if (alive) setWalletStars(null); });
    return () => { alive = false; };
  }, [userId]);

  // Danh sách game cho mục "Trò chơi" — tách khỏi /auth/me để hồ sơ nhẹ.
  useEffect(() => {
    if (!userId) return;
    let alive = true;
    gameProgressService.listGames()
      .then((list) => { if (alive) setGames(Array.isArray(list) ? list : []); })
      .catch(() => { if (alive) setGames([]); });
    return () => { alive = false; };
  }, [userId]);

  // ── PWA detection ──
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && /Safari/.test(ua));
    const android = /Android/.test(ua);
    setIsIOS(iOS);
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

  // Lắng nghe foreground message. Dep theo userId (không theo token): token
  // xoay mỗi 20 giây mà đăng ký lại listener thì churn vô ích.
  useEffect(() => {
    if (!userId) return;
    const unsubscribe = onForegroundMessage((payload) => {
      const data = payload.data || {};
      const title = data.title || payload.notification?.title || "Thông báo";
      const body = data.body || payload.notification?.body || "";
      setFgToast({ title, body });
      setTimeout(() => setFgToast(null), 5000);
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
  }, [userId]);

  const lv = useMemo(() => getLevelProgress(profile?.coins || 0), [profile?.coins]);

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
      setJoinError(apiErrorMessage(err));
    }
    setJoining(false);
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
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
      if (isInstalled) {
        setPushMessage("Ứng dụng đã được cài đặt rồi");
        setTimeout(() => setPushMessage(""), 2000);
      } else {
        setPushMessage("Hãy dùng menu trình duyệt → Cài đặt ứng dụng / Thêm vào Màn hình chính");
        setTimeout(() => setPushMessage(""), 4000);
      }
    }
  }

  // ── Push handlers ──
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
      await apiFetch("/notifications/devices/reset", { method: "DELETE" });
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

  const user = profile || {};
  const stats = user.stats || { totalPlays: 0, totalXP: 0, gamesPlayed: 0 };
  const className = user.className || null;
  // Số dư dạng SỐ cho trang bé (hiện badge 🪙 ⭐, so sánh được) — mảng
  // `wallet` bên dưới là bản đã format chuỗi cho các hàng của ProfileSections.
  const coins = user.coins || 0;
  const stars = walletStars ?? user.stars ?? 0;

  const wallet = [
    { icon: <Coins className="w-3.5 h-3.5" />, label: "Xu", value: coins.toLocaleString() },
    { icon: <Star className="w-3.5 h-3.5" />, label: "Sao", value: stars.toLocaleString() },
    { icon: <Gamepad2 className="w-3.5 h-3.5" />, label: "Lượt chơi", value: stats.totalPlays },
    { icon: <Sparkles className="w-3.5 h-3.5" />, label: "Điểm kinh nghiệm", value: (stats.totalXP || 0).toLocaleString() },
  ];

  // View-model dùng chung cho mọi khối ProfileSections: mọi state/handler/
  // dữ liệu của trang gói vào một chỗ, các khung trình bày chỉ lo markup.
  const vm = {
    user, stats, className, wallet, coins, stars, lv, outfit, userAuth,
    handleUpdateProfile, refreshProfile, apiErrorMessage,
    games, showGames, setShowGames,
    joinCode, setJoinCode, joinError, joining, handleJoinClass, copied, copyCode,
    setCustomizer,
    isInstalled, platformTab, setPlatformTab, deferredPrompt, handleInstallClick, isIOS,
    pushSupport, setPushSupport, pushMessage, pushLoading, testingPush,
    handleEnablePush, handleTestPush, handleResetDevices,
    onBack, onLogout,
  };

  return {
    vm, profile, showLoading, error,
    fgToast, clearFgToast: () => setFgToast(null),
    showIosGuide, setShowIosGuide,
    customizer, setCustomizer, outfit, handleSaveOutfit,
  };
}
