/**
 * OnboardingScreen.jsx — màn chào lần đầu, hiện khi khách CHƯA đăng nhập và
 * chưa đi qua màn này. Bắt buộc điền đủ mới vào được trang chủ.
 *
 *   ① Bé học lớp mấy?  (Lớp 1 → Lớp 5, quyết định độ khó game)
 *   ② Bé là bạn trai hay bạn gái?
 *   ③ Bé tên gì?  (họ tên)
 *
 * Dùng chung bộ màu + kiểu "dán nhãn" (viền navy, bóng cứng) với trang chủ:
 * xem biến `--nb-*` ở `src/pages/home-theme.css` và bảng màu Tailwind
 * trong `index.html` (ink / paper / gold / teal…).
 *
 * Kết quả lưu ở `src/lib/kidSettings.js` (localStorage), không gọi API —
 * sau khi đăng ký/đăng nhập thì dùng tiếp cài đặt này.
 */

import { useState } from "react";
import "./onboarding.css";
import {
  completeOnboarding,
  skipOnboarding,
  GRADE_MIN, GRADE_MAX, gradeLabel, ageForGrade,
} from "../lib/kidSettings.js";

const GENDERS = [
  { id: "boy", label: "Bạn trai", face: "👦", tone: "#3d6fd8" },
  { id: "girl", label: "Bạn gái", face: "👧", tone: "#ee7fa6" },
];

/** Nhân vật của web (ảnh trong `public/`). BASE_URL để khớp base path deploy. */
const CHARACTER = `${import.meta.env.BASE_URL}edu_character.png`;

/** Bảng màu rút từ trang chủ — đặt ở scope `.gq-home` cho gọn. */
const S = {
  ink: "#1d2e4a",
  paper: "#fbf5e6",
  gold: "#f2b632",
  blue: "#3d6fd8",
  red: "#e5533d",
  cream: "#fffdf6",
};

export default function OnboardingScreen({ onComplete }) {
  const [grade, setGrade] = useState(null);
  const [gender, setGender] = useState(null);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const grades = Array.from({ length: GRADE_MAX - GRADE_MIN + 1 }, (_, i) => GRADE_MIN + i);
  const ready = grade !== null && gender !== null && name.trim().length > 0;
  const missing = touched && !ready;

  async function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!ready || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = { name: name.trim(), grade, gender };
      if (onComplete) await onComplete(payload);
      else completeOnboarding(payload);
    } catch (err) {
      setError(err?.message || "Không thể tạo tài khoản. Bé thử lại hoặc bấm Bỏ qua nhé!");
      setSubmitting(false);
    }
  }

  function handleSkip() {
    if (submitting) return;
    skipOnboarding({
      name: name.trim() || undefined,
      grade: grade ?? undefined,
      gender: gender || undefined,
    });
  }

  return (
    <div
      className="gq-onb min-h-screen w-full overflow-y-auto"
      style={{
        "--nb-ink": S.ink,
        "--nb-paper": S.paper,
        "--nb-cream": "#fffdf6",
      }}
    >
      <form onSubmit={submit} className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">

        {/* ─────────── Nhân vật chào ─────────── */}
        <header className="flex items-center gap-4">
          <img
            src={CHARACTER}
            alt=""
            width={112}
            height={112}
            className="o-float shrink-0 select-none"
            style={{ filter: "drop-shadow(0 6px 10px rgba(29,46,74,.18))" }}
          />
          <div className="min-w-0 flex-1">
            <p
              className="font-display font-bold text-ink inline-block px-3.5 py-1.5 rounded-2xl text-white text-base sm:text-lg"
              style={{ background: S.blue, boxShadow: `4px 4px 0 ${S.ink}` }}
            >
              Chào bạn! Mình là ........
            </p>
            <p className="text-sm sm:text-base font-medium text-[#5b6b85] mt-2.5">
              Cho ........ làm quen bé một chút nha!
            </p>
          </div>
        </header>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink text-center">
          Bé của mình là ai nhỉ?
        </h1>

        {/* ─────────── ① Lớp ─────────── */}
        <Card n={1} title="Bé học lớp mấy?"
          hint="Lớp quyết định độ khó của trò chơi (trừ Thế học). Đổi được sau trong Cài đặt.">
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {grades.map((g) => (
              <GradeChip
                key={g}
                selected={grade === g}
                error={missing && grade === null}
                onClick={() => setGrade(g)}
                label={gradeLabel(g)}
                age={ageForGrade(g)}
              />
            ))}
          </div>
        </Card>

        {/* ─────────── ② Giới tính ─────────── */}
        <Card n={2} title="Bé là bạn trai hay bạn gái?"
          hint="Giúp ........ chọn đồ và mặt mỹ hơn cho bé.">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id)}
                aria-pressed={gender === g.id}
                className="o-chip group"
                style={{
                  background: gender === g.id ? g.tone : S.cream,
                  borderColor: S.ink,
                  color: gender === g.id ? "#fff" : S.ink,
                  boxShadow: gender === g.id ? `4px 4px 0 ${S.ink}` : `4px 4px 0 rgba(29,46,74,.18)`,
                }}
              >
                <span className="text-4xl sm:text-5xl leading-none" aria-hidden="true">{g.face}</span>
                <span className="font-display font-bold text-sm sm:text-base mt-1.5">{g.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* ─────────── ③ Họ tên ─────────── */}
        <Card n={3} title="Bé tên gì?" hint="Tên bé sẽ hiện ở trang chủ và trang hồ sơ.">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên bé…"
            aria-label="Họ tên bé"
            maxLength={60}
            className="o-input font-display font-semibold text-base sm:text-lg"
            style={{
              borderColor: missing && !name.trim() ? S.red : S.ink,
              background: S.cream,
              color: S.ink,
              boxShadow: missing && !name.trim() ? `4px 4px 0 ${S.red}` : `4px 4px 0 rgba(29,46,74,.18)`,
            }}
          />
          {missing && !name.trim() && (
            <p className="mt-2 text-sm font-semibold" style={{ color: S.red }}>Bé chưa có tên nha!</p>
          )}
        </Card>

        {missing && (
          <p
            className="o-banner font-display font-bold text-sm sm:text-base"
            style={{ background: "#fdecea", borderColor: S.red, color: S.red }}
          >
            Bé chọn đủ lớp, giới tính và tên rồi mình chơi tiếp nha!
          </p>
        )}

        {error && (
          <p
            className="o-banner font-display font-bold text-sm sm:text-base"
            style={{ background: "#fdecea", borderColor: S.red, color: S.red }}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* ─────────── Nút ─────────── */}
        <button
          type="submit"
          disabled={!ready || submitting}
          className="o-btn w-full font-display font-bold text-base sm:text-lg"
          style={{
            background: ready && !submitting ? S.gold : "#e4e8ef",
            color: ready && !submitting ? S.ink : "#9aa6ba",
            borderColor: S.ink,
            boxShadow: ready && !submitting ? `6px 6px 0 ${S.ink}` : `3px 3px 0 ${S.ink}`,
          }}
        >
          {submitting
            ? "Đang tạo tài khoản cho bé..."
            : ready
              ? "Chọn xong rồi, vào chơi nào!"
              : "Chọn xong 3 câu nhé"}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          disabled={submitting}
          className="o-btn w-full font-display font-bold text-sm sm:text-base"
          style={{
            background: S.cream,
            color: S.ink,
            borderColor: S.ink,
            boxShadow: `4px 4px 0 rgba(29,46,74,.18)`,
          }}
        >
          Bỏ qua
        </button>

        <p className="text-center text-xs text-[#7c8aa0] pb-2">
          Tài khoản của bé được tạo tự động khi điền đủ thông tin. Phụ huynh có thể đổi lại trong Cài đặt.
        </p>
      </form>
    </div>
  );
}

/** Khung câu hỏi: số thứ tự trong huy hiệu tròn + tiêu đề + gợi ý. */
function Card({ n, title, hint, children }) {
  return (
    <section
      className="o-card"
      style={{
        background: "var(--nb-cream, #fffdf6)",
        borderColor: S.ink,
        boxShadow: `5px 5px 0 ${S.ink}`,
      }}
    >
      <div className="flex gap-3 mb-3.5">
        <span
          className="w-8 h-8 shrink-0 grid place-items-center rounded-full font-display font-bold text-sm"
          style={{ background: S.gold, color: S.ink, border: `2px solid ${S.ink}` }}
        >
          {n}
        </span>
        <div className="min-w-0">
          <h2 className="font-display font-bold text-base sm:text-lg text-ink leading-tight">{title}</h2>
          {hint && <p className="text-xs sm:text-[13px] text-[#7c8aa0] mt-1 leading-relaxed">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/** Ô chọn lớp: "Lớp 1" + tuổi tương ứng. */
function GradeChip({ selected, onClick, label, age, error }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="o-chip px-1 py-2.5 sm:py-3"
      style={{
        background: selected ? S.gold : S.cream,
        borderColor: error ? S.red : S.ink,
        color: S.ink,
        boxShadow: selected ? `4px 4px 0 ${S.ink}` : `4px 4px 0 rgba(29,46,74,.15)`,
      }}
    >
      <span className="font-display font-bold text-[13px] sm:text-base leading-tight">{label}</span>
      <span className="text-[10px] sm:text-[11px] font-semibold opacity-65 mt-0.5 leading-tight">{age} tuổi</span>
    </button>
  );
}