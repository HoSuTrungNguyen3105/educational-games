/**
 * KidSettingsCard.jsx — khối "Cài đặt · Dành cho phụ huynh" trong trang hồ sơ.
 *
 *   · Thẻ Ủng hộ cho web (mở modal mã QR)
 *   · Thanh chọn tuổi của bé (áp dụng từ màn chơi tiếp theo) + chủ đề NÊN HỌC
 *     ở tuổi đó, lấy từ `src/config/ageCurriculum.js`
 *   · Giới tính của bé — avatar vẽ theo đây
 *   · Bật/tắt chế độ Song ngữ Anh–Việt
 *
 * Lưu ở localStorage (`src/lib/kidSettings.js`); lớp + giới tính còn được đẩy
 * lên hồ sơ tài khoản theo dạng MÃ tuổi (`ageCode`) — xem `src/lib/kidProfileSync.js`.
 */

import { useState } from "react";
import {
  useKidSettings, setKidSettings, ageBandLabel, gradeLabel,
  AGE_RANGE, BILINGUAL_SAMPLES,
} from "../../lib/kidSettings.js";
import {
  curriculumFor, curriculumSummary, CURRICULUM_GRADES,
} from "../../config/ageCurriculum.js";
import { navigate } from "../../lib/router.js";
import DonateModal from "./DonateModal.jsx";
import { ToggleSwitch } from "../ui";

/** Giống bảng giới tính ở màn chào (`OnboardingScreen.jsx`). */
const GENDERS = [
  { id: "boy", label: "Bạn trai", face: "👦", tone: "#3d6fd8" },
  { id: "girl", label: "Bạn gái", face: "👧", tone: "#ee7fa6" },
];

export default function KidSettingsCard() {
  const s = useKidSettings();
  const age = s.age;
  const course = curriculumFor(s.grade);
  const [showDonate, setShowDonate] = useState(false);
  const [showAllGrades, setShowAllGrades] = useState(false);

  return (
    <section className="space-y-3" aria-label="Cài đặt dành cho phụ huynh">
      {/* ─────────── Ủng hộ cho web ─────────── */}
      <div className="rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3"
        style={{ background: "#FF6F91", color: "#fff" }}>
        <img src="/educational-games/edu_character.png" width="92" height="92"
          alt="Nhân vật Gạo" loading="lazy" decoding="async"
          className="shrink-0 w-[92px] h-[92px] object-contain rounded-lg bg-white/95 p-1" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-extrabold leading-tight">Ủng hộ cho web</h3>
          <p className="text-sm opacity-95 mt-0.5">
            Mọi trò chơi đều miễn phí. Ủng hộ để web có thêm trò mới cho bé!
          </p>
        </div>
        <button
          onClick={() => setShowDonate(true)}
          className="shrink-0 rounded-full bg-white text-[#e8448f] px-5 py-2.5 font-display font-extrabold text-sm shadow hover:brightness-105 active:scale-95 transition"
        >
          ❤ Ủng hộ cho web
        </button>
      </div>

      {showDonate && <DonateModal onClose={() => setShowDonate(false)} />}

      {/* ─────────── Tuổi của bé + chương trình theo tuổi ─────────── */}
      <div className="rounded-xl p-3.5" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
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

        <div className="mt-3.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-2">
            <h4 className="font-display text-sm font-extrabold text-ink">
              Nên học gì ở {gradeLabel(course.grade)}?
            </h4>
            <p className="text-[11px] text-ink/50">{course.focus}</p>
          </div>

          <div className="rounded-lg p-2.5 grid gap-2 sm:grid-cols-3"
            style={{ background: "var(--bg)" }}>
            {course.topics.map((t) => (
              <button
                key={`${course.grade}-${t.name}`}
                onClick={() => navigate(`/offline/${t.gameId}`)}
                className="rounded-lg px-2.5 py-2.5 text-center transition hover:brightness-[.98] active:scale-[.98]"
                style={{ background: "var(--card)", border: "1px solid var(--line)" }}
              >
                <span className="block text-lg leading-none mb-1" aria-hidden="true">{t.icon}</span>
                <span className="block text-sm font-extrabold text-ink">{t.name}</span>
                <span className="block text-[11px] text-ink/50">{t.sub}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAllGrades((v) => !v)}
            aria-expanded={showAllGrades}
            className="mt-2 text-[11px] font-bold underline decoration-ink/25 underline-offset-2 text-ink/55 hover:text-ink transition"
          >
            {showAllGrades ? "Ẩn chương trình các lớp" : "Xem chương trình các lớp khác"}
          </button>

          {showAllGrades && (
            <dl className="mt-1 rounded-lg px-2.5" style={{ background: "var(--bg)" }}>
              {CURRICULUM_GRADES.map((g, i) => (
                <div key={g} className="flex items-baseline gap-2 py-1.5 text-[11px]"
                  style={i ? { borderTop: "1px solid var(--line)" } : undefined}>
                  <dt className="font-bold shrink-0" style={{ color: g === course.grade ? "var(--accent)" : "var(--ink, #1d2e4a)", opacity: g === course.grade ? 1 : .65 }}>
                    {gradeLabel(g)}
                  </dt>
                  <dd className="text-ink/55 leading-snug">{curriculumSummary(g)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* ─────────── Giới tính của bé ─────────── */}
      <div className="rounded-xl p-3.5" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl" aria-hidden="true">🧒</span>
          <div>
            <h3 className="font-display text-base font-extrabold text-ink">Giới tính của bé</h3>
            <p className="text-xs text-ink/55">Avatar mở màn vẽ theo đây — bé gái không bị mặc định thành bé trai</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {GENDERS.map((g) => {
            const on = s.gender === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => setKidSettings({ gender: g.id })}
                aria-pressed={on}
                className="rounded-lg px-3 py-2.5 flex items-center justify-center gap-2 font-display font-extrabold text-sm transition active:scale-95"
                style={{
                  background: on ? g.tone : "var(--bg)",
                  color: on ? "#fff" : "var(--ink, #1d2e4a)",
                  border: "1px solid var(--line)",
                }}
              >
                <span className="text-xl leading-none" aria-hidden="true">{g.face}</span>
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────── Song ngữ Anh–Việt ─────────── */}
      <div className="rounded-xl p-3.5" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🈯</span>
          <div className="flex-1">
            <h3 className="font-display text-base font-extrabold text-ink">Song ngữ Anh-Việt</h3>
            <p className="text-xs text-ink/55">Chữ tiếng Anh hiện ngay dưới chữ Việt</p>
          </div>
          <ToggleSwitch
            checked={s.bilingual}
            onChange={(v) => setKidSettings({ bilingual: v })}
            label="Song ngữ Anh-Việt"
          />
        </div>

        {s.bilingual && (
          <div className="mt-3 rounded-lg p-2.5 flex flex-wrap items-center gap-3"
            style={{ background: "var(--bg)" }}>
            <button
              onClick={() => setKidSettings({ englishFirst: !s.englishFirst })}
              className="rounded-lg px-5 py-2.5 text-center font-display font-extrabold leading-tight text-white transition active:scale-95"
              style={{ background: "#3d7bd1", minWidth: 118 }}
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
            background: "#f7ab2e",
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
