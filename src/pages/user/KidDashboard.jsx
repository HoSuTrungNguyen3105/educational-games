// TRANG BÉ (/kid-dashboard) — trang riêng của học sinh Tiểu học.
//
// Từ 2026-11-21 trang này là trang TỔNG HỢP: gộp toàn bộ tính năng của trang
// Hồ sơ cũ (/profile — giờ chuyển hướng về đây) vào một khung có SIDEBAR BÊN
// TRÁI trên desktop; mobile giữ BottomNav như cũ + hàng chip chọn mục.
//
// Phân cấp:
//   • useProfileVm (profile/useProfileVm.js) — nguồn dữ liệu/handler DUY NHẤT
//     (nạp /auth/me, ví, game, sửa hồ sơ, PWA, push…), các khối
//     ProfileSections nhận `vm` như cũ → không nhân bản logic.
//   • KidSidebar / hàng chip — điều hướng, danh sách từ kid/kidNav.js.
//   • Panel nội dung: KidHomePanel (Hôm nay) + các section của trang Hồ sơ.
//   • Mục đang mở đồng bộ lên URL qua ?panel=<id> (hooks/useHashParam) —
//     F5/dán link quay lại đúng mục. Khám phá nhanh (id "x-<key>") mở
//     trang đích NHÚNG trong cột nội dung, sidebar trái không biến mất.
//
// Breakpoint: ≥1024px (lg) hiện sidebar, ẩn BottomNav — khớp nhau tuyệt đối
// nên không bao giờ có hai thanh điều hướng cùng lúc.
import { useEffect } from "react";
import { Apple, ArrowLeft, CircleX, Share2, Wallet } from "lucide-react";
import { navigate } from "../../lib/router.js";
import { useKidSettings } from "../../lib/kidSettings.js";
import BottomNav from "../../components/BottomNav.jsx";
import useChatUnread from "../../hooks/useChatUnread.js";
import useHashParam from "../../hooks/useHashParam.js";
import DressUpCustomizer from "../../components/avatar/DressUpCustomizer.jsx";
import { IconNotification } from "../../components/ui/index.js";
import { speak } from "../../lib/speech.js";
import useProfileVm from "./profile/useProfileVm.jsx";
import KidSidebar from "./profile/KidSidebar.jsx";
import KidHomePanel from "./kid/KidHomePanel.jsx";
import {
  PANELS, PANEL_IDS, SHORTCUT_ICONS,
  exploreId, exploreKeyOf, shortcutByKey,
} from "./kid/kidNav.js";
import {
  PersonalInfoCard, WalletRows,
  OutfitSection, ClassSection, GamesSection, KidSettingsSection, AppSection,
} from "./profile/ProfileSections.jsx";
import CategoryPage from "../CategoryPage.jsx";
import DailyTasksPage from "./DailyTasksPage.jsx";
import GardenPage from "./GardenPage.jsx";
import AchievementsPage from "./AchievementsPage.jsx";
import LeaderboardPage from "./LeaderboardPage.jsx";
import StorePage from "./StorePage.jsx";

const CARD_STYLE = { background: "var(--card)", border: "1px solid var(--line)" };
const panelCls = (activeId, id) => (activeId === id ? undefined : "hidden");

export default function KidDashboard({ userAuth, onLogout, onUserLogin, showToast, onSelectGame }) {
  const kid = useKidSettings();
  const { chatUnread } = useChatUnread(userAuth);

  const {
    vm, profile, showLoading, error,
    fgToast, clearFgToast,
    showIosGuide, setShowIosGuide,
    customizer, setCustomizer, outfit, handleSaveOutfit,
  } = useProfileVm({ userAuth, showToast, onLogout, onBack: () => navigate("/") });

  // Panel đang chọn — mặc định "Hôm nay", ĐỒNG BỘ với ?panel= trên URL
  // (theo mẫu ?tab= của AvatarManagement): bấm mục ở sidebar/chip thì
  // URL mang theo ?panel=<id> bằng replaceState, tải lại trang (F5) hay
  // dán link là quay lại đúng mục đang mở; ?panel= lạ → về "home".
  // Đổi panel chỉ ẩn/hiện (giữ trạng thái trong section: danh sách game
  // đang mở, tab cài đặt push…).
  const [activeId, setActiveId] = useHashParam("panel", PANEL_IDS, "home");

  // Khám phá nhanh: id dạng "x-<key>" = trang đích mở NHÚNG trong cột
  // nội dung này (xem EXPLORE_VIEWS bên dưới) — sidebar trái không mất.
  const exploreKey = exploreKeyOf(activeId);
  const exploreMeta = exploreKey ? shortcutByKey(exploreKey) : null;
  const openExplore = (key) => setActiveId(exploreId(key));
  const backFromExplore = () => setActiveId("home");

  // Đọc lời chào một lần khi vào trang (chỉ khi bé đã đăng nhập).
  const userName = vm.user.name;
  useEffect(() => {
    if (!userName || showLoading) return;
    speak(`Chào ${userName}, hôm nay bé học gì nào?`);
  }, [userName, showLoading]);

  const activeItem = PANELS.find((p) => p.id === activeId) || PANELS[0];
  const HeaderIcon = exploreMeta ? SHORTCUT_ICONS[exploreMeta.key] : activeItem.Icon;
  const headerLabel = exploreMeta ? exploreMeta.label : activeItem.label;

  // ── Chưa đăng nhập ──
  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-lg">
          <div className="text-6xl">🦉</div>
          <h2 className="mt-3 font-display text-xl text-ink">Xin chào bé!</h2>
          <p className="mt-1 text-sm text-ink/50">
            Bé đăng nhập để nhận nhiệm vụ hôm nay, tích xu và nuôi khu vườn nhé.
          </p>
          <button
            onClick={onUserLogin}
            className="mt-5 w-full rounded-2xl bg-sky-500 py-3 font-extrabold text-white shadow active:scale-95 transition"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate("/")}
            className="mt-2 w-full rounded-2xl py-3 text-sm font-semibold text-ink/60 hover:text-ink transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // ── Đang tải hồ sơ lần đầu ──
  if (showLoading) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-sm text-ink/40 animate-pulse">Đang mở nhà của bé…</p>
      </div>
    );
  }

  // ── Lỗi tải + CHƯA có hồ sơ nào để hiện ──
  if (!profile && error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-3">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-gold px-5 py-2 text-sm font-semibold text-white"
          >
            ← Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-100 to-emerald-100 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* ── Foreground toast (tin push khi app đang mở) ── */}
        {fgToast && (
          <div
            className="fixed top-4 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-2xl border bg-white p-4 shadow-xl animate-[popIn_.25s_ease]"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
                <IconNotification className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{fgToast.title}</p>
                <p className="line-clamp-2 text-xs text-ink/60">{fgToast.body}</p>
              </div>
              <button onClick={clearFgToast} className="text-ink/40 hover:text-ink">
                <CircleX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex w-full gap-5">
          {/* ── SIDEBAR trái (desktop) ── */}
          <KidSidebar
            vm={vm}
            kid={kid}
            activeId={activeId}
            onSelect={setActiveId}
            onExplore={openExplore}
            onLogout={onLogout}
          />

          {/* ── Cột nội dung ── */}
          <main className="min-w-0 flex-1">
            {/* Tiêu đề panel — ẩn trên mobile vì chip đã ghi nhãn; desktop hiện
              tiêu đề lớn để bé biết mình đang ở mục nào. */}
            <div className="mb-3 hidden items-center gap-2 lg:flex">
              <HeaderIcon className="w-6 h-6" style={{ color: "var(--accent)" }} />
              <h1 className="font-display text-xl text-ink">{headerLabel}</h1>
            </div>

            {/* ── Hàng chip chọn mục (mobile, thay cho sidebar) ── */}
            <nav
              className="-mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:hidden"
              aria-label="Khu vực trong trang"
            >
              {PANELS.map(({ id, label, Icon }) => {
                const active = id === activeId;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveId(id)}
                    aria-current={active ? "page" : undefined}
                    className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition"
                    style={active
                      ? { background: "var(--accent)", color: "#fff" }
                      : { background: "var(--card)", color: "var(--ink, #1d2b52)", border: "1px solid var(--line)" }}
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                );
              })}
            </nav>

            {/* ── PANEL: Hôm nay ── */}
            <div id="home" className={panelCls(activeId, "home")}>
              <KidHomePanel
                vm={vm}
                kid={kid}
                onClaimed={() => vm.refreshProfile?.()}
                onExplore={openExplore}
              />
            </div>

            {/* ── KHÁM PHÁ NHANH (nhúng): trang đích render ngay tại đây
                nên sidebar trái + BottomNav của trang Bé vẫn còn nguyên.
                Chỉ mount trang đang mở (các trang tự nạp dữ liệu riêng);
                nút Quay lại của từng trang đích trỏ về panel Hôm nay.
                CategoryPage tắt BottomNav riêng (hideBottomNav) vì trang
                Bé đã có một thanh. ── */}
            {exploreKey === "categories" && (
              <div data-explore="categories">
                <CategoryPage onSelectGame={onSelectGame} userAuth={userAuth} hideBottomNav />
              </div>
            )}
            {exploreKey === "tasks" && (
              <div data-explore="tasks">
                <DailyTasksPage userAuth={userAuth} onBack={backFromExplore} />
              </div>
            )}
            {exploreKey === "garden" && (
              <div data-explore="garden">
                <GardenPage userAuth={userAuth} onBack={backFromExplore} showToast={showToast} />
              </div>
            )}
            {exploreKey === "achievements" && (
              <div data-explore="achievements">
                <AchievementsPage userAuth={userAuth} onBack={backFromExplore} />
              </div>
            )}
            {exploreKey === "leaderboard" && (
              <div data-explore="leaderboard">
                <LeaderboardPage userAuth={userAuth} onBack={backFromExplore} />
              </div>
            )}
            {exploreKey === "store" && (
              <div data-explore="store">
                <StorePage userAuth={userAuth} onBack={backFromExplore} showToast={showToast} />
              </div>
            )}
            {exploreMeta && (
              <button
                onClick={backFromExplore}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold text-ink/70 shadow-sm transition hover:text-ink active:scale-95"
                style={CARD_STYLE}
              >
                <ArrowLeft className="w-4 h-4" /> Về trang của bé
              </button>
            )}

            {/* ── PANEL: Tổng quan (Thông tin cá nhân + Ví của bé) ── */}
            <div id="sec-overview" className={panelCls(activeId, "sec-overview")}>
              <div className="grid items-start gap-4 lg:grid-cols-2">
                <PersonalInfoCard vm={vm} />
                <section className="rounded-2xl p-4 shadow-sm" style={CARD_STYLE}>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                      style={{ background: "var(--accent-bg)" }}
                    >
                      <Wallet className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    </span>
                    <span className="font-display text-sm text-ink">Ví của bé</span>
                  </div>
                  <WalletRows wallet={vm.wallet} />
                </section>
              </div>
            </div>

            {/* ── Các panel còn lại — dùng chung khối ProfileSections ── */}
            <div className={panelCls(activeId, "sec-outfit")}>
              <OutfitSection vm={vm} />
            </div>
            <div className={panelCls(activeId, "sec-class")}>
              <ClassSection vm={vm} />
            </div>
            <div className={panelCls(activeId, "sec-games")}>
              <GamesSection vm={vm} />
            </div>
            <div className={panelCls(activeId, "sec-settings")}>
              <KidSettingsSection vm={vm} />
            </div>
            <div className={panelCls(activeId, "sec-app")}>
              <AppSection vm={vm} />
            </div>
          </main>
        </div>

        {/* ── Thanh dưới cùng (mobile) — ẩn trên desktop vì có sidebar ── */}
        <BottomNav userAuth={userAuth} activeKey="kid-dashboard" chatUnread={chatUnread} />

        {/* ── Modal hướng dẫn cài PWA trên iOS ── */}
        {showIosGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            onClick={() => setShowIosGuide(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-5 shadow-xl"
              style={CARD_STYLE}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">
                  <Apple className="w-4 h-4" />
                </div>
                <h3 className="font-display text-sm font-bold text-ink">Hướng dẫn cài đặt trên iOS</h3>
              </div>
              <div className="space-y-3 text-sm text-ink/70">
                <p className="flex gap-2">
                  <span className="font-bold text-ink">1.</span>
                  Nhấn nút <Share2 className="inline h-4 w-4 text-violet-600" /> <b>Chia sẻ</b> ở thanh điều hướng Safari
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-ink">2.</span> Cuộn xuống và chọn <b>"Thêm vào Màn hình chính"</b>
                </p>
                <p className="flex gap-2">
                  <span className="font-bold text-ink">3.</span> Nhấn <b>"Thêm"</b> ở góc trên phải để hoàn tất
                </p>
              </div>
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                Sau khi cài, mở EduPlay từ màn hình chính rồi vào lại đây để bật thông báo đẩy.
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="mt-4 w-full rounded-xl bg-ink py-2.5 text-sm font-bold text-white transition hover:bg-ink/90"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        )}

        {/* ── Modal tùy chỉnh avatar / thú cưng ── */}
        {customizer && (
          <DressUpCustomizer
            kind={customizer}
            initial={outfit[customizer].value}
            onSave={handleSaveOutfit}
            onClose={() => setCustomizer(null)}
          />
        )}
      </div>
    </div>
  );
}
