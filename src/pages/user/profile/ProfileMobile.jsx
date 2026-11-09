// Bản MOBILE của trang Hồ sơ (<768px) — khung theo cấu trúc trang account
// mẫu: không sidebar; đầu trang là khối header riêng trên nền tint nhẹ
// (avatar + tên + các pill thông tin nhanh), tiếp theo là thẻ ví nổi bật,
// thẻ nhóm chức năng dạng danh sách hàng chạm, rồi các thẻ nội dung xếp dọc
// một cột và nút đăng xuất full-width ở cuối. Nội dung/dữ liệu lấy từ `vm`
// dùng chung với bản desktop — file này chỉ lo khung trình bày.
import { ChevronRight } from "lucide-react";
import { IconBack, IconLogout } from "../../../components/ui/index.js";
import { getRoleLabel } from "../../../config/roles.js";
import {
  AvatarWithBadge, LevelBar,
  OutfitSection, ClassSection, GamesSection, KidSettingsSection, AppSection,
} from "./ProfileSections.jsx";
import { NAV } from "./profileNav.js";

export default function ProfileMobile({ vm }) {
  const { user, lv, wallet, className, onBack, onLogout, jumpTo } = vm;

  return (
    <div className="flex flex-col gap-3">
      {/* ── Hàng quay lại ── */}
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-ink/50 hover:text-ink transition">
          <IconBack className="w-4 h-4" /> Trang chủ
        </button>
      </div>

      {/* ── Header danh tính trên nền tint ── */}
      <section className="rounded-2xl p-4" style={{ background: "var(--accent-bg)" }}>
        <div className="flex items-center gap-3">
          <AvatarWithBadge vm={vm} size={58} />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg text-ink truncate">{user.name}</h1>
            <p className="text-[11px] font-mono text-ink/50 truncate">@{user.username}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80"
                style={{ color: "var(--accent)" }}>
                {getRoleLabel(user.role)}
              </span>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80"
                style={{ color: "var(--accent)" }}>
                Lv{lv.level}
              </span>
              {className && (
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80"
                  style={{ color: "var(--accent)" }}>
                  {className}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <LevelBar lv={lv} />
        </div>
      </section>

      {/* ── Thẻ ví nổi bật ── */}
      <section className="rounded-xl p-3.5 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="grid grid-cols-4 gap-2 text-center">
          {wallet.map((w) => (
            <div key={w.label} className="min-w-0">
              <div className="flex justify-center" style={{ color: "var(--accent)" }}>{w.icon}</div>
              <div className="mt-1 font-bold font-mono text-sm text-ink truncate">{w.value}</div>
              <div className="text-[10px] text-ink/50 leading-tight">{w.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Nhóm chức năng: danh sách hàng chạm tới từng khu vực ── */}
      <nav className="rounded-xl overflow-hidden shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }} aria-label="Mục trong hồ sơ">
        {NAV.map(({ id, label, Icon }, i) => (
          <button key={id} onClick={() => jumpTo(id)}
            className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition active:bg-ink/5"
            style={i ? { borderTop: "1px solid var(--line)" } : undefined}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--accent-bg)" }}>
              <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink">{label}</span>
            <ChevronRight className="w-4 h-4 text-ink/30 shrink-0" />
          </button>
        ))}
      </nav>

      {/* ── Các thẻ nội dung xếp dọc ── */}
      <OutfitSection vm={vm} />
      <ClassSection vm={vm} />
      <GamesSection vm={vm} />
      <KidSettingsSection vm={vm} />
      <AppSection vm={vm} />

      {/* ── Đăng xuất — nút full-width cuối trang ── */}
      <button onClick={onLogout}
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-red-500 shadow-sm transition active:bg-red-50"
        style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <IconLogout className="w-5 h-5" /> Đăng xuất
      </button>
    </div>
  );
}
