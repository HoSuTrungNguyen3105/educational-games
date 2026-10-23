import { useEffect, useState, useMemo, useCallback } from "react";
import { authService, classService, API_BASE, notificationService, userService } from "../../services/api.js";
import { getLevelProgress } from "../../lib/utils.js";
import { getRoleLabel, hasPermission } from "../../config/roles.js";
import { navigate } from "../../lib/router.js";
import {
  ArrowLeft, LogOut, GraduationCap, ChevronDown, ChevronUp, Copy, Check, Palette,
  Download, Smartphone, Monitor, Apple, Bell, BellRing, BellOff,
  CheckCircle2, XCircle, AlertTriangle, Send, Trash2, RefreshCw, Info, Share2, PlusSquare, MoreVertical, Calendar, UserCheck
} from "lucide-react";
import DressUpAvatar, { DressUpAvatarSmall } from "../../components/avatar/DressUpAvatar.jsx";
import DressUpCustomizer from "../../components/avatar/DressUpCustomizer.jsx";
import KidSettingsCard from "../../components/profile/KidSettingsCard.jsx";
import { resolveOutfit, outfitName, describeOutfit } from "../../lib/dressUpAvatar.js";
import { getPushSupportStatus, requestNotificationPermission, onForegroundMessage } from "../../firebase/messaging.js";
import { playVibration } from "../../lib/reminderUtils.js";

export default function ProfileScreen({ userAuth, onLogout, onBack }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showGames, setShowGames] = useState(false);
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
  const [isAndroid, setIsAndroid] = useState(false);
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
  const outfit = useMemo(() => {
    const base = resolveOutfit(profile?.avatar, profile?.pet);
    return { avatar: outfitPatch.avatar ?? base.avatar, pet: outfitPatch.pet ?? base.pet };
  }, [outfitPatch, profile?.avatar, profile?.pet]);

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
        setError(null);
      })
      .catch((e) => setError(e.message || "Lỗi tải profile"))
      .finally(() => setLoading(false));
  }, [userAuth]);

  // ── PWA detection giống hiweb_PROFILE ──
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
      || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && /Safari/.test(ua));
    const android = /Android/.test(ua);
    setIsIOS(iOS);
    setIsAndroid(android);
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
      localStorage.removeItem("pwa-installed");
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
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-3">👤</div>
          <h2 className="font-display text-lg text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-ink/50 mb-4">Bạn cần đăng nhập để xem profile</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-sm text-ink/40 animate-pulse">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button onClick={onBack} className="px-5 py-2 bg-gold text-white rounded-xl text-sm font-semibold">← Về trang chủ</button>
        </div>
      </div>
    );
  }

  const user = profile || {};
  const games = user.games || [];
  const stats = user.stats || { totalPlays: 0, totalXP: 0, gamesPlayed: 0 };
  const className = user.className || null;

  return (
    <div className="flex-1 px-4 py-4 w-full w-full space-y-4">
      {/* foreground toast */}
      {fgToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm rounded-2xl shadow-xl border bg-white p-4 animate-[popIn_.25s_ease]" style={{ borderColor: "var(--line)" }}>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0"><BellRing className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{fgToast.title}</p>
              <p className="text-xs text-ink/60 line-clamp-2">{fgToast.body}</p>
            </div>
            <button onClick={() => setFgToast(null)} className="text-ink/40 hover:text-ink"><XCircle className="w-5 h-5" /></button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition">
          <ArrowLeft className="w-4 h-4" /> Trang chủ
        </button>
        <button onClick={onLogout} className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition">
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      {/* Profile header spans full width */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="h-1.5" style={{ background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />
        <div className="p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <DressUpAvatarSmall
              kind="avatar"
              state={outfit.avatar.value}
              size={64}
              label={`Avatar ${outfitName("avatar", outfit.avatar.value)}`}
              style={{ boxShadow: "0 0 0 3px var(--card), 0 0 0 5px var(--accent-bg)" }}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm"
              style={{ background: "var(--card)", boxShadow: "0 0 0 2px var(--card)" }}>
              {lv.level >= 10 ? "👑" : lv.level >= 5 ? "⭐" : "🌱"}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="font-display text-lg text-ink truncate">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
                {getRoleLabel(user.role)}
              </span>
            </div>
            <p className="text-xs font-mono text-ink/40 mb-2">@{user.username}</p>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>Lv{lv.level}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                <div className="h-full rounded-full" style={{ width: lv.percent + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />
              </div>
              <span className="text-[10px] font-mono text-ink/40">{lv.current}/{lv.next}</span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "var(--bg)" }}>
                💰 {(user.coins || 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "var(--bg)", color: "#d97706" }}>
                ⭐ {(user.stars || 0).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: "var(--bg)" }}>
                🎮 {stats.totalPlays} lượt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout on lg+ screens: avatar on the left, class + games on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <span className="font-display text-sm text-ink">Avatar &amp; thú cưng</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { kind: "avatar", icon: "👕", title: "Nhân vật", btn: "Tùy chỉnh Avatar" },
              { kind: "pet", icon: "🐾", title: "Thú cưng", btn: "Tùy chỉnh Pet" },
            ].map(({ kind, icon, title, btn }) => {
              const state = outfit[kind].value;
              const parts = describeOutfit(kind, state);
              return (
                <div key={kind}
                  className="rounded-2xl p-3 flex flex-col items-center gap-1.5 transition hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(180deg, var(--stage) 0%, var(--bg) 100%)",
                    border: "1px solid var(--line)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.65), 0 2px 6px rgba(29,46,74,.05)",
                  }}>
                  <div className="w-full rounded-xl flex items-center justify-center py-2"
                    style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
                    <DressUpAvatar kind={kind} state={state} size={104}
                      label={`${outfitName(kind, state)} — ${title}`} />
                  </div>
                  <p className="font-display text-sm text-ink text-center leading-tight">
                    {icon} {outfitName(kind, state) || title}
                  </p>
                  <p className="text-[11px] text-ink/45 text-center leading-tight min-h-[28px] px-1">
                    {parts.length ? parts.join(" · ") : "Chưa mặc gì"}
                  </p>
                  <button
                    onClick={() => setCustomizer(kind)}
                    className="mt-1 w-full rounded-xl text-white py-2 text-xs font-body font-semibold transition active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, var(--accent), var(--purple, #8b5cf6))" }}
                  >
                    ✏️ {btn}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-ink/40 text-center mt-3 leading-snug">
            Bộ đồ lưu trong hồ sơ, dùng chung với game <b>Tiệm thời trang cho Bé</b> và <b>Tiệm thay đồ thú cưng</b>.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-gold" />
              <span className="font-display text-sm text-ink">Lớp học</span>
            </div>

            {className ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-100">
                <span className="text-lg">🏫</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700">{className}</p>
                  {user.classCode && (
                    <button onClick={() => copyCode(user.classCode)}
                      className="flex items-center gap-1 text-xs text-green-600 font-mono hover:text-green-700">
                      Mã: {user.classCode}
                      {copied === user.classCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleJoinClass} className="flex gap-2">
                <input value={joinCode} onChange={e => setJoinCode(e.target.value)}
                  placeholder="Nhập mã lớp..."
                  className="flex-1 px-3 py-2 rounded-xl bg-ink/5 border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30" />
                <button type="submit" disabled={joining || !joinCode.trim()}
                  className="px-4 py-2 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/80 transition disabled:opacity-50">
                  {joining ? "..." : "Vào lớp"}
                </button>
              </form>
            )}
            {joinError && <p className="text-xs text-red-500 mt-1.5">{joinError}</p>}
          </div>

          {/* Chấm công - chỉ hiện khi có quyền */}
          {hasPermission(user.role, 'attendance.view') && (
            <button
              onClick={() => navigate('/attendance')}
              className="w-full rounded-2xl p-4 flex items-center gap-3 hover:bg-ink/3 transition"
              style={{ background: "var(--card)", border: "1px solid var(--line)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #6C3BF5, #8b5cf6)" }}>
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-ink">Chấm công</span>
                  {hasPermission(user.role, 'attendance.checkin') && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                      Có quyền
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink/40">Xem lịch sử và chấm công đi học</p>
              </div>
              <Calendar className="w-5 h-5 text-ink/40" />
            </button>
          )}

          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
            <button onClick={() => setShowGames(!showGames)}
              className="w-full flex items-center justify-between p-4 hover:bg-ink/3 transition">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎮</span>
                <span className="font-display text-sm text-ink">Trò chơi</span>
                <span className="text-xs font-mono text-ink/40">({games.length})</span>
              </div>
              {showGames ? <ChevronUp className="w-4 h-4 text-ink/40" /> : <ChevronDown className="w-4 h-4 text-ink/40" />}
            </button>

            {showGames && (
              <div className="px-4 pb-4 space-y-2 max-h-80 overflow-y-auto">
                {games.length === 0 ? (
                  <p className="text-sm text-ink/40 text-center py-4">Chưa có game nào</p>
                ) : (
                  games.map(g => <GameRow key={g.gameId} game={g} />)
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────── CÀI ĐẶT DÀNH CHO PHỤ HUYNH ─────────── */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onBack} aria-label="Quay lại"
          className="w-10 h-10 rounded-full grid place-items-center shadow-sm shrink-0"
          style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-display text-lg font-extrabold text-ink leading-tight">Cài đặt</h2>
          <p className="text-xs text-ink/50">Dành cho phụ huynh</p>
        </div>
      </div>
      <KidSettingsCard />

      {/* ─── PWA Installation + Push Notifications ─── (chuẩn hiweb, cải thiện tone EduPlay) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PWA Install Card */}
        <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6C3BF5,#8b5cf6)" }}>
              <Download className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-sm text-ink">Cài đặt ứng dụng</h3>
              <p className="text-[11px] text-ink/40">Truy cập nhanh như app native</p>
            </div>
            {isInstalled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã cài
              </span>
            )}
          </div>

          {!isInstalled ? (
            <>
              <p className="text-xs text-ink/60 mb-3">Cài EduPlay về màn hình chính để mở nhanh, dùng offline và nhận thông báo đẩy.</p>

              {/* Platform Tabs — giữ nguyên ý tưởng hiweb */}
              <div className="flex gap-1.5 p-1 rounded-xl mb-3" style={{ background: "var(--bg)" }}>
                <button
                  onClick={() => setPlatformTab("android")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${platformTab === "android" ? "bg-white shadow text-ink border border-ink/10" : "text-ink/50 hover:text-ink"}`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Android
                </button>
                <button
                  onClick={() => setPlatformTab("ios")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${platformTab === "ios" ? "bg-white shadow text-ink border border-ink/10" : "text-ink/50 hover:text-ink"}`}
                >
                  <Apple className="w-3.5 h-3.5" /> iOS
                </button>
                <button
                  onClick={() => setPlatformTab("desktop")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${platformTab === "desktop" ? "bg-white shadow text-ink border border-ink/10" : "text-ink/50 hover:text-ink"}`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
              </div>

              {/* Steps */}
              <div className="rounded-xl p-3 mb-3" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
                {platformTab === "android" && (
                  <ol className="space-y-2 text-xs text-ink/70">
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>Nhấn menu <MoreVertical className="w-3 h-3 inline mx-0.5" /> góc trên phải trình duyệt</span></li>
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>Chọn “Thêm vào Màn hình chính” / “Cài đặt ứng dụng”</span></li>
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>Nhấn “Cài đặt” để xác nhận</span></li>
                  </ol>
                )}
                {platformTab === "ios" && (
                  <ol className="space-y-2 text-xs text-ink/70">
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>Nhấn nút Chia sẻ <Share2 className="w-3 h-3 inline mx-0.5 text-violet-600" /> ở thanh Safari</span></li>
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>Cuộn xuống → “Thêm vào Màn hình chính”</span></li>
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>Nhấn “Thêm” ở góc trên phải</span></li>
                  </ol>
                )}
                {platformTab === "desktop" && (
                  <ol className="space-y-2 text-xs text-ink/70">
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span><span>Tìm biểu tượng cài đặt <PlusSquare className="w-3 h-3 inline mx-0.5" /> trên thanh địa chỉ</span></li>
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span><span>Nhấn “Cài đặt” trong popup</span></li>
                    <li className="flex gap-2"><span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span><span>Hoặc: Menu ⋮ → “Cài đặt EduPlay…”</span></li>
                  </ol>
                )}
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white shadow hover:opacity-90 transition active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg,#6C3BF5,#a78bfa)" }}
              >
                <Download className="w-4 h-4" /> Cài đặt ứng dụng
              </button>
              {!deferredPrompt && platformTab !== "ios" && (
                <p className="text-[11px] text-ink/30 text-center mt-2">Mẹo: mở bằng Chrome/Edge để hiện nút cài đặt tự động</p>
              )}
            </>
          ) : (
            <div className="rounded-xl p-4 flex items-center gap-3 bg-green-50 border border-green-200">
              <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-700">Ứng dụng đã được cài đặt</p>
                <p className="text-xs text-green-600/80">Mở từ màn hình chính để có trải nghiệm tốt nhất.</p>
              </div>
            </div>
          )}
        </div>

        {/* Push Notification Card — cải thiện từ hiweb */}
        <div className="rounded-2xl p-4" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#F4B942,#f59e0b)" }}>
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-sm text-ink">Thông báo đẩy</h3>
              <p className="text-[11px] text-ink/40">Nhận tin tức, bài tập &amp; lời mời</p>
            </div>
            {pushSupport.permission === "granted" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">
                <BellRing className="w-3 h-3" /> Đã bật
              </span>
            ) : pushSupport.permission === "denied" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                <BellOff className="w-3 h-3" /> Bị chặn
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle className="w-3 h-3" /> Chưa bật
              </span>
            )}
          </div>

          {/* Trạng thái chi tiết */}
          <div className="rounded-xl p-3 mb-3 text-xs" style={{ background: "var(--bg)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Info className="w-3.5 h-3.5 text-ink/40" />
              <span className="font-semibold text-ink">Trạng thái</span>
              <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${pushSupport.supported ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {pushSupport.supported ? "Hỗ trợ" : "Không hỗ trợ"}
              </span>
            </div>
            {!pushSupport.supported ? (
              <p className="text-ink/60">{pushSupport.message}</p>
            ) : (
              <p className="text-ink/60">
                Quyền hiện tại: <b>{pushSupport.permission === "granted" ? "Đã cấp" : pushSupport.permission === "denied" ? "Bị từ chối" : "Chưa hỏi"}</b>
                {isIOS && !isInstalled && <span className="block mt-1 text-amber-600">iOS cần cài PWA vào Màn hình chính trước mới nhận được push.</span>}
              </p>
            )}
            {typeof Notification !== "undefined" && Notification.permission === "denied" && (
              <p className="mt-1.5 text-red-500 font-medium">Bạn đã chặn thông báo. Mở Cài đặt trình duyệt → Quyền → Thông báo → Cho phép.</p>
            )}
          </div>

          {/* Message box */}
          {pushMessage && (
            <div className="rounded-xl px-3 py-2 mb-3 text-xs font-medium border bg-amber-50 border-amber-200 text-amber-800">
              {pushMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleEnablePush}
              disabled={pushLoading || pushSupport.permission === "denied"}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white shadow disabled:opacity-50 transition active:scale-[0.98]"
              style={{ background: pushSupport.permission === "granted" ? "#10b981" : "linear-gradient(135deg,#6C3BF5,#8b5cf6)" }}
            >
              {pushLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BellRing className="w-3.5 h-3.5" />}
              {pushSupport.permission === "granted" ? "Đã bật" : "Bật thông báo"}
            </button>
            <button
              onClick={handleTestPush}
              disabled={testingPush || pushSupport.permission !== "granted"}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border bg-white hover:bg-ink/5 transition disabled:opacity-40 active:scale-[0.98]"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              {testingPush ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Gửi thử
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleResetDevices}
              disabled={pushLoading}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold text-ink/60 hover:text-ink hover:bg-ink/5 transition disabled:opacity-40"
            >
              <Trash2 className="w-3 h-3" /> Reset thiết bị
            </button>
            <button
              onClick={() => setPushSupport(getPushSupportStatus())}
              className="px-3 py-2 rounded-xl text-[11px] font-semibold text-ink/60 hover:text-ink hover:bg-ink/5 transition"
            >
              <RefreshCw className="w-3 h-3 inline mr-1" /> Làm mới
            </button>
          </div>
          <p className="text-[11px] text-ink/30 text-center mt-2">Thông báo chạy qua Firebase Cloud Messaging. Hoạt động cả khi app đóng (SW).</p>
        </div>
      </div>

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

function GameRow({ game }) {
  const lv = getLevelProgress(game.experience || 0);
  const progress = Math.min(100, game.progress || 0);

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink/3 transition">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: "var(--bg)" }}>
        🎯
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-ink truncate">{game.name}</h3>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--accent-bg, #dbeafe)", color: "var(--accent)" }}>
            Lv{lv.level}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div className="h-full rounded-full" style={{ width: progress + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }} />
          </div>
          <span className="text-[10px] font-mono text-ink/40">{progress}%</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs font-bold text-ink">{game.gamesPlayed || 0}</div>
        <div className="text-[9px] text-ink/40">lượt</div>
      </div>
    </div>
  );
}
