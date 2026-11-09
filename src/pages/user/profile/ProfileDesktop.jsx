// Bản DESKTOP của trang Hồ sơ (≥768px) — khung theo cấu trúc trang account
// mẫu: breadcrumb trên cùng, dưới là lưới 2 cột gồm sidebar trái ~220px
// (tiêu đề khu vực + tóm tắt tài khoản + menu dọc + đăng xuất ở cuối nhóm)
// và cột nội dung chính chứa các thẻ. Toàn bộ nội dung/dữ liệu lấy từ `vm`
// dùng chung với bản mobile — file này chỉ lo khung trình bày.
import { User } from "lucide-react";
import { IconLogout } from "../../../components/ui/index.js";
import {
  IdentitySummary, LevelBar, WalletRows,
  OutfitSection, ClassSection, GamesSection, KidSettingsSection, AppSection,
} from "./ProfileSections.jsx";
import { NAV } from "./profileNav.js";

export default function ProfileDesktop({ vm }) {
  const { lv, wallet, onBack, onLogout, jumpTo } = vm;

  return (
    <div className="w-full">
      {/* ── Breadcrumb: Trang chủ / Hồ sơ ── */}
      <div className="mb-4 flex items-center text-sm text-ink/50">
        <button onClick={onBack} className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
          Trang chủ
        </button>
        <span className="mx-4 text-ink/30">/</span>
        <span>Hồ sơ</span>
      </div>

      <div className="grid grid-cols-[220px_minmax(0,1fr)] gap-8 items-start">
        {/* ── SIDEBAR: danh tính + cấp độ + ví + điều hướng ── */}
        <aside className="sticky top-4 flex flex-col gap-4 min-w-0">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="font-display text-base text-ink">Hồ sơ</span>
          </div>

          <IdentitySummary vm={vm} />

          <LevelBar lv={lv} />

          <WalletRows wallet={wallet} />

          <nav className="flex flex-col gap-0.5 pt-2" style={{ borderTop: "1px solid var(--line)" }} aria-label="Mục trong hồ sơ">
            {NAV.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => jumpTo(id)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-ink/60 hover:bg-ink/5 hover:text-ink transition">
                <Icon className="w-5 h-5 shrink-0" style={{ color: "var(--accent)" }} />
                <span className="truncate">{label}</span>
              </button>
            ))}

            {/* Đăng xuất — cuối nhóm menu, tách hẳn như mục riêng */}
            <button onClick={onLogout}
              className="mt-2 flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50 transition"
              style={{ borderTop: "1px solid var(--line)" }}>
              <IconLogout className="w-5 h-5 shrink-0" />
              <span className="truncate">Đăng xuất</span>
            </button>
          </nav>
        </aside>

        {/* ── CỘT NỘI DUNG ── */}
        <div className="space-y-4 min-w-0">
          <OutfitSection vm={vm} />
          <ClassSection vm={vm} />
          <GamesSection vm={vm} />
          <KidSettingsSection vm={vm} />
          <AppSection vm={vm} />
        </div>
      </div>
    </div>
  );
}
