// SIDEBAR TRÁI của trang Bé (/kid-dashboard) — chỉ hiện trên desktop
// (≥1024px, khớp breakpoint ẩn/hiện của BottomNav nên hai thanh không
// bao giờ xuất hiện cùng lúc).
//
// Cấu trúc: thẻ danh tính bé (avatar + tên + lớp + số dư 🪙 ⭐) → nhóm
// panel (Hôm nay + các mục lấy từ trang Hồ sơ) → nhóm lối tắt ra trang
// riêng → Đăng xuất. Toàn bộ danh sách lấy từ kidNav.js để sidebar và
// hàng chip mobile không lệch nhau.
import { IconLogout } from "../../../components/ui/index.js";
import { navigate } from "../../../lib/router.js";
import { PANELS, SHORTCUTS, SHORTCUT_ICONS } from "../kid/kidNav.js";
import { AvatarWithBadge } from "./ProfileSections.jsx";

const GROUP_LABEL = "text-[11px] font-extrabold uppercase tracking-wide text-ink/35 px-2.5 mb-1";

export default function KidSidebar({ vm, kid, activeId, onSelect, onLogout }) {
  const { user, lv, coins, stars } = vm;
  const className = vm.className || (kid?.grade ? `Lớp ${kid.grade}` : "");

  return (
    <aside
      className="hidden lg:flex sticky top-4 h-fit w-[248px] shrink-0 flex-col gap-4 rounded-3xl p-4 shadow-lg"
      style={{ background: "var(--card)", border: "1px solid var(--line)" }}
      aria-label="Điều hướng trang bé"
    >
      {/* ── Danh tính bé ── */}
      <div className="flex flex-col items-center text-center">
        <AvatarWithBadge vm={vm} size={72} />
        <h2 className="mt-2 font-display text-base text-ink truncate max-w-full">
          {user.name || "Bé yêu"}
        </h2>
        <p className="text-[11px] text-ink/50 truncate max-w-full">
          {className}
          {kid?.gender ? ` • ${kid.gender === "female" ? "Bé gái" : "Bé trai"}` : ""}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-200">
            🪙 {coins.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 border border-sky-200">
            ⭐ {stars.toLocaleString()}
          </span>
        </div>
        {/* Thanh cấp độ — dùng chung LevelBar với trang Hồ sơ */}
        <div className="mt-2 w-full text-left">
          <LevelBarInline lv={lv} />
        </div>
      </div>

      {/* ── Panel trong trang ── */}
      <nav className="flex flex-col gap-0.5" aria-label="Khu vực trong trang">
        <p className={GROUP_LABEL}>Của bé</p>
        {PANELS.map(({ id, label, Icon }) => {
          const active = id === activeId;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              aria-current={active ? "page" : undefined}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition"
              style={active
                ? { background: "var(--accent-bg)", color: "var(--accent)" }
                : { color: "var(--ink, #1d2b52)" }}
            >
              <Icon className="w-5 h-5 shrink-0" style={{ color: active ? "var(--accent)" : "var(--ink, #1d2b52)" }} />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Lối tắt một chạm ra trang riêng ── */}
      <nav className="flex flex-col gap-0.5" aria-label="Lối tắt">
        <p className={GROUP_LABEL}>Khám phá nhanh</p>
        {SHORTCUTS.map(({ key, label, path }) => {
          const Icon = SHORTCUT_ICONS[key];
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-ink/70 transition hover:bg-ink/5 hover:text-ink"
            >
              <Icon className="w-5 h-5 shrink-0 text-ink/45" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Đăng xuất — cuối sidebar ── */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <IconLogout className="w-5 h-5 shrink-0" />
        <span className="truncate">Đăng xuất</span>
      </button>
    </aside>
  );
}

/** Thanh cấp độ tí hon cho sidebar — cùng dữ liệu LevelBar của ProfileSections. */
function LevelBarInline({ lv }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold shrink-0" style={{ color: "var(--accent)" }}>
        Lv{lv.level}
      </span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: lv.percent + "%", background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}
