/**
 * KidSettingsCard.jsx — khối "Cài đặt · Dành cho phụ huynh" trong trang hồ sơ.
 *
 *   · Thẻ hồ ợ Gạo (nút ứng hộ trong ngày)
 *   · Thanh chọn tuổi của bé (áp dụng từ màn chơi tiếp theo)
 *   · Bật/tắt chế độ Song ngữ Anh–Việt
 *
 * Mọi thay đổi lưu ở localStorage (`src/lib/kidSettings.js`) — không gọi API.
 */

import { useState } from "react";
import {
  useKidSettings, setKidSettings, ageBandLabel,
  AGE_RANGE, BILINGUAL_SAMPLES,
} from "../../lib/kidSettings.js";
import { navigate } from "../../lib/router.js";
import DonateModal from "./DonateModal.jsx";

/** Ô chủ đề dưới thanh tuổi — bấm để mở thẳng game tương ứng.
 *  `id` phải có trong src/games/src/manifest.js (route là /offline/:gameId). */
const TOPIC_SHORTCUTS = [
  { icon: "🔢", name: "Đếm 1–100", sub: "Tập đếm", gameId: "shapecount" },
  { icon: "🐱", name: "Con vật", sub: "Ghép chữ", gameId: "chem" },
  { icon: "➕", name: "Cộng trừ đến 100", sub: "Tính toán", gameId: "compare" },
];

export default function KidSettingsCard() {
  const s = useKidSettings();
  const age = s.age;
  const [showDonate, setShowDonate] = useState(false);

  return (
    <section className="space-y-4" aria-label="Cài đặt dành cho phụ huynh">
      {/* ─────────── Ứng hộ cho web ─────────── */}
      <div className="rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm"
        style={{ background: "linear-gradient(120deg,#ff6fb5,#ff9ec7)", color: "#fff" }}>
        <Mascot />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-extrabold leading-tight">Ứng hộ cho web</h3>
          <p className="text-sm opacity-95 mt-0.5">
            Mọi trò chơi đều miễn phí. Ứng hộ để web có thêm trò mới cho bé!
          </p>
        </div>
        <button
          onClick={() => setShowDonate(true)}
          className="shrink-0 rounded-full bg-white text-[#e8448f] px-5 py-3 font-display font-extrabold text-sm shadow hover:brightness-105 active:scale-95 transition"
        >
          ❤ Ứng hộ cho web
        </button>
      </div>

      {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}

      {/* ─────────── Tuổi của bé ─────────── */}
      <div className="rounded-3xl p-5 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🎂</span>
          <div>
            <h3 className="font-display text-base font-extrabold text-ink">Tuổi của bé</h3>
            <p className="text-xs text-ink/55">
              {s.name?.trim() ? `${s.name.trim()} · ` : ""}{age} tuổi · {ageBandLabel(age)} · áp dụng từ màn chơi tiếp theo
            </p>
          </div>
        </div>

        <AgeSlider age={age} />

        <div className="mt-4 rounded-2xl p-3 grid gap-2 sm:grid-cols-3"
          style={{ background: "var(--bg)" }}>
          {TOPIC_SHORTCUTS.map((t) => (
            <button
              key={t.name}
              onClick={() => navigate(`/offline/${t.gameId}`)}
              className="rounded-2xl px-3 py-3 text-center transition hover:brightness-[.98] active:scale-[.98]"
              style={{ background: "var(--card)", border: "1px solid var(--line)" }}
            >
              <span className="block text-lg leading-none mb-1" aria-hidden="true">{t.icon}</span>
              <span className="block text-sm font-extrabold text-ink">{t.name}</span>
              <span className="block text-[11px] text-ink/50">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─────────── Song ngữ Anh–Việt ─────────── */}
      <div className="rounded-3xl p-5 shadow-sm" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🈯</span>
          <div className="flex-1">
            <h3 className="font-display text-base font-extrabold text-ink">Song ngữ Anh-Việt</h3>
            <p className="text-xs text-ink/55">Chữ tiếng Anh hiện ngay dưới chữ Việt</p>
          </div>
          <Toggle
            on={s.bilingual}
            onChange={(v) => setKidSettings({ bilingual: v })}
            label="Song ngữ Anh-Việt"
          />
        </div>

        {s.bilingual && (
          <div className="mt-4 rounded-2xl p-3 flex flex-wrap items-center gap-3"
            style={{ background: "var(--bg)" }}>
            <button
              onClick={() => setKidSettings({ englishFirst: !s.englishFirst })}
              className="rounded-2xl px-5 py-3 text-center font-display font-extrabold leading-tight text-white shadow transition active:scale-95"
              style={{ background: "linear-gradient(120deg,#4aa8e0,#3d7bd1)", minWidth: 118 }}
            >
              <span className="block text-base uppercase">{s.englishFirst ? "cat" : "Con mèo"}</span>
              <span className="block text-xs font-bold opacity-90">{s.englishFirst ? "Con mèo" : "cat"}</span>
            </button>
            <div className="text-xs text-ink/60 leading-relaxed">
              Bấm thẻ xanh để đổi chỗ hiển thị tiếng Việt / tiếng Anh.
              <br />
              Ví dụ: {BILINGUAL_SAMPLES.map((b) => `${b.vi} (${b.en})`).join(" · ")}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Thanh chọn tuổi 6 → 10 (tương ứng Lớp 1 → Lớp 5): nút tròn, giá trị đang chọn viền vàng. */
function AgeSlider({ age }) {
  const years = AGE_RANGE;
  const min = years[0];
  const max = years[years.length - 1];
  return (
    <div className="mt-4">
      {/* đường ray */}
      <div className="relative h-1.5 rounded-full mx-[7%]"
        style={{ background: "#f0e4cf" }} aria-hidden="true">
        <div className="absolute h-full rounded-full"
          style={{
            background: "linear-gradient(90deg,#f7ab2e,#ef7d18)",
            left: 0,
            right: `${100 - ((age - min) / (max - min)) * 100}%`,
          }} />
      </div>

      <div className="relative flex justify-between mt-[-14px]">
        {years.map((y) => {
          const on = y === age;
          return (
            <button
              key={y}
              onClick={() => setKidSettings({ age: y })}
              aria-pressed={on}
              aria-label={`Chọn ${y} tuổi`}
              className="grid place-items-center w-7 h-7 rounded-full text-[11px] font-extrabold transition hover:scale-110 active:scale-95"
              style={{
                background: on ? "#fff" : "#fbe3bd",
                color: on ? "#ef7d18" : "#a97c33",
                border: on ? "3px solid #f7ab2e" : "0",
                boxShadow: "0 1px 3px rgba(0,0,0,.12)",
              }}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Nút công tắc xanh/trắng. */
function Toggle({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="shrink-0 w-[54px] h-[30px] rounded-full p-1 flex items-center transition"
      style={{ background: on ? "#3dbf8f" : "#d7dbe4", justifyContent: on ? "flex-end" : "flex-start" }}
    >
      <span className="w-6 h-6 rounded-full bg-white shadow transition-transform" />
    </button>
  );
}

/** Mặt Gạo — vẽ bằng SVG để không phụ thuộc file ảnh ngoài. */
function Mascot() {
  return (
    <svg viewBox="0 0 120 120" width="104" height="104" role="img" aria-label="Nhân vật Gạo"
      style={{ flexShrink: 0, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.18))" }}>
      <circle cx="60" cy="60" r="46" fill="#fff" />
      <ellipse cx="22" cy="52" rx="11" ry="14" fill="#fff" />
      <ellipse cx="98" cy="52" rx="11" ry="14" fill="#fff" />
      <ellipse cx="45" cy="50" rx="13" ry="16" fill="#1c2333" />
      <ellipse cx="75" cy="50" rx="13" ry="16" fill="#1c2333" />
      <circle cx="49" cy="45" r="5" fill="#fff" />
      <circle cx="79" cy="45" r="5" fill="#fff" />
      <ellipse cx="30" cy="68" rx="9" ry="5.5" fill="#ff8fb3" opacity=".65" />
      <ellipse cx="90" cy="68" rx="9" ry="5.5" fill="#ff8fb3" opacity=".65" />
      <path d="M44 72 Q60 92 76 72 Z" fill="#e8443c" />
      <path d="M52 74 Q60 84 68 74 Z" fill="#ff8a8a" />
    </svg>
  );
}