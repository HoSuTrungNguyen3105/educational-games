// Bản DESKTOP của trang Hồ sơ (≥768px) — khung theo trang account mẫu:
// breadcrumb trên cùng, dưới là lưới 2 cột gồm sidebar trái ~220px và
// vùng nội dung chính. Sidebar CHỈ là điều hướng (tiêu đề khu vực + menu
// dọc + đăng xuất ở cuối nhóm) — tóm tắt tài khoản/ví đã chuyển vào mục
// "Tổng quan". Menu chọn mục nào thì vùng nội dung CHỈ hiện section của
// mục đó (kiểu tab, mỗi mục một màn riêng như ảnh mẫu), không dồn mọi
// section vào một trang cuộn dài nữa.
//
// Giữ trạng thái khi chuyển mục: mọi panel luôn được render, panel
// không chọn chỉ bị ẩn (class `hidden`) chứ không unmount — trạng thái
// nội bộ của section (tab nền tảng ở Cài đặt ứng dụng, danh sách game
// đang mở, trạng thái trong KidSettingsCard...) không bị mất khi
// chuyển qua lại. Toàn bộ nội dung/dữ liệu lấy từ `vm` dùng chung với
// bản mobile — file này chỉ lo khung trình bày.
import { useState } from "react";
import { User, Wallet } from "lucide-react";
import { IconLogout } from "../../../components/ui/index.js";
import {
  IdentitySummary, LevelBar, WalletRows,
  OutfitSection, ClassSection, GamesSection, KidSettingsSection, AppSection,
} from "./ProfileSections.jsx";
import { DESKTOP_NAV } from "./profileNav.js";

const CARD_STYLE = { background: "var(--card)", border: "1px solid var(--line)" };

export default function ProfileDesktop({ vm }) {
  const { lv, wallet, onBack, onLogout } = vm;
  const [activeId, setActiveId] = useState("sec-overview");
  const activeItem = DESKTOP_NAV.find((i) => i.id === activeId) || DESKTOP_NAV[0];
  const panelCls = (id) => (activeId === id ? undefined : "hidden");

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
        {/* ── SIDEBAR: chỉ điều hướng + đăng xuất ── */}
        <aside className="sticky top-4 flex flex-col gap-4 min-w-0">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="font-display text-base text-ink">Hồ sơ</span>
          </div>

          <nav className="flex flex-col gap-0.5" aria-label="Mục trong hồ sơ">
            {DESKTOP_NAV.map(({ id, label, Icon }) => {
              const active = id === activeId;
              return (
                <button key={id} onClick={() => setActiveId(id)} aria-current={active || undefined}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                  style={active
                    ? { background: "var(--accent-bg)", color: "var(--accent)" }
                    : undefined}>
                  <Icon className="w-5 h-5 shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}

            {/* Đăng xuất — cuối nhóm menu, tách hẳn như mục riêng */}
            <button onClick={onLogout}
              className="mt-2 flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-red-500 hover:bg-red-50 transition"
              style={{ borderTop: "1px solid var(--line)" }}>
              <IconLogout className="w-5 h-5 shrink-0" />
              <span className="truncate">Đăng xuất</span>
            </button>
          </nav>
        </aside>

        {/* ── VÙNG NỘI DUNG: chỉ hiện section của mục đang chọn ── */}
        <div className="min-w-0">
          <h1 className="font-display text-xl text-ink mb-4">{activeItem.label}</h1>

          {/* Tổng quan — hai thẻ sóng đôi như ảnh mẫu: Thông tin cá nhân
              (danh tính + cấp độ) và Ví của bé (các hàng chỉ số ví). */}
          <div id="sec-overview" className={panelCls("sec-overview")}>
            <div className="grid gap-3 lg:grid-cols-2 items-start">
              <section className="rounded-xl p-3.5" style={CARD_STYLE}>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span className="font-display text-sm text-ink">Thông tin cá nhân</span>
                </div>
                <IdentitySummary vm={vm} />
                <div className="mt-3">
                  <LevelBar lv={lv} />
                </div>
              </section>

              <section className="rounded-xl p-3.5" style={CARD_STYLE}>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  <span className="font-display text-sm text-ink">Ví của bé</span>
                </div>
                <WalletRows wallet={wallet} />
              </section>
            </div>
          </div>

          <div className={panelCls("sec-outfit")}>
            <OutfitSection vm={vm} />
          </div>

          <div className={panelCls("sec-class")}>
            <ClassSection vm={vm} />
          </div>

          <div className={panelCls("sec-games")}>
            <GamesSection vm={vm} />
          </div>

          <div className={panelCls("sec-settings")}>
            <KidSettingsSection vm={vm} />
          </div>

          <div className={panelCls("sec-app")}>
            <AppSection vm={vm} />
          </div>
        </div>
      </div>
    </div>
  );
}
