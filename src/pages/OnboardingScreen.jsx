/**
 * OnboardingScreen.jsx — màn chào lần đầu cho khách CHƯA đăng nhập và chưa
 * đi qua màn này. Từ 2026-11-05 nó là TRANG RIÊNG toàn màn hình (App render
 * thay cho nội dung chính khi `needOnboarding`), bỏ dạng MODAL lớp phủ của
 * PR #19 — theo yêu cầu mới của Nguyên, mô phỏng app học ngôn ngữ anh gửi:
 *
 *   Giai đoạn 1 — carousel giới thiệu 3 slide (xem `SLIDES` bên dưới):
 *     minh hoạ pastel + tiêu đề/phụ đề + chấm phân trang, nút "Tiếp tục",
 *     nút "Đã có tài khoản" (mở lớp phủ đăng nhập của App) và "Bỏ qua".
 *
 *   Giai đoạn 2 — wizard 3 bước, mỗi màn một câu hỏi (xem `STEPS`):
 *     ① Bé đang học lớp mấy?  (Lớp 1 → Lớp 5, quyết định độ khó game)
 *     ② Bé là bé trai hay bé gái?
 *     ③ Tên của bé là gì?     → nút "Hoàn thành"
 *     Mỗi bước có mũi tên quay lại + thanh tiến độ; nút "Tiếp tục" chỉ sáng
 *     khi bước đó đã có lựa chọn.
 *
 * Dữ liệu/điều kiện KHÔNG đổi so với bản modal: hoàn thành → App
 * (`handleOnboardingComplete`) tự đăng ký tài khoản thật rồi gọi
 * `completeOnboarding(...)`; "Bỏ qua" (ở carousel, và ở wizard — kèm phần
 * đã chọn được tới lúc đó) gọi `skipOnboarding(...)`. Cả hai ở
 * `src/lib/kidSettings.js`. Nội dung chữ/slide/bước khai ở các hằng số
 * cấu hình ngay dưới đây để sửa chữ không phải đào code.
 */

import { useState } from "react";
import "./onboarding.css";
import {
  completeOnboarding,
  skipOnboarding,
  GRADE_MIN, GRADE_MAX, gradeLabel, ageForGrade,
} from "../lib/kidSettings.js";

/* ───────────────────────── CẤU HÌNH NỘI DUNG ───────────────────────── */

/** 3 slide giới thiệu. `bg` = cặp màu pastel (trên → dưới) của vùng minh
 *  hoạ; `decor` = emoji trang trí trôi nhẹ quanh emoji chính. */
const SLIDES = [
  {
    emoji: "🎮",
    title: "Vừa học vừa chơi",
    subtitle: "Hơn 40 trò chơi giúp bé học Toán, Tiếng Việt và Tiếng Anh thật vui.",
    bg: ["#FFE9B8", "#FFF1CF"],
    decor: [
      { e: "⭐", pos: "left-[10%] top-[12%]", size: 30, delay: "0s" },
      { e: "🧩", pos: "right-[11%] top-[24%]", size: 34, delay: "0.8s" },
      { e: "🎲", pos: "left-[16%] bottom-[10%]", size: 28, delay: "1.6s" },
    ],
  },
  {
    emoji: "📚",
    title: "Học theo lớp của bé",
    subtitle: "Câu hỏi và bài tập bám sát chương trình từ lớp 1 đến lớp 5.",
    bg: ["#D7E7FF", "#E9F1FF"],
    decor: [
      { e: "✏️", pos: "left-[11%] top-[16%]", size: 30, delay: "0.4s" },
      { e: "🔢", pos: "right-[12%] top-[12%]", size: 30, delay: "1.2s" },
      { e: "📖", pos: "right-[17%] bottom-[12%]", size: 32, delay: "0s" },
    ],
  },
  {
    emoji: "🛡️",
    title: "An toàn cho bé",
    subtitle: "Phụ huynh theo dõi được tiến độ, duyệt kết bạn và đặt lại mật khẩu cho con.",
    bg: ["#CFEFE6", "#E7F6F1"],
    decor: [
      { e: "❤️", pos: "left-[12%] top-[14%]", size: 28, delay: "1s" },
      { e: "🔒", pos: "right-[11%] top-[22%]", size: 30, delay: "0.2s" },
      { e: "👨‍👩‍👧", pos: "left-[15%] bottom-[10%]", size: 32, delay: "1.8s" },
    ],
  },
];

/** 3 bước wizard. `kicker` = nhãn in hoa nhỏ phía trên tiêu đề. */
const STEPS = [
  {
    kicker: "Hồ sơ của bé",
    title: "Bé đang học lớp mấy?",
    hint: "Lớp quyết định độ khó của trò chơi. Đổi được sau trong Cài đặt.",
  },
  {
    kicker: "Hồ sơ của bé",
    title: "Bé là bé trai hay bé gái?",
    hint: "Giúp Đô chọn đồ và mặt đẹp hơn cho bé.",
  },
  {
    kicker: "Hồ sơ của bé",
    title: "Tên của bé là gì?",
    hint: "Tên bé sẽ hiện ở trang chủ và trang hồ sơ.",
  },
];

/** Bộ lựa chọn giới tính (giữ nguyên từ bản modal). */
const GENDERS = [
  { id: "boy", label: "Bạn trai", face: "👦", tone: "#3d6fd8" },
  { id: "girl", label: "Bạn gái", face: "👧", tone: "#ee7fa6" },
];

/** Nhân vật của web (ảnh trong `public/`). BASE_URL để khớp base path deploy. */
const CHARACTER = `${import.meta.env.BASE_URL}edu_character.png`;

const INK = "#1d2e4a";

/** Class nút hành động chính (pill, full-width): sáng khi `enabled`, mờ khoá khi chưa. */
const ctaClass = (enabled) =>
  `w-full rounded-full py-4 font-display text-base font-bold transition active:scale-[0.99] ${
    enabled
      ? "bg-gold text-ink shadow-[0_8px_20px_rgba(244,185,66,.45)]"
      : "cursor-not-allowed bg-[#E7EBF0] text-[#9AA6BA]"
  }`;

export default function OnboardingScreen({ onComplete, onLogin }) {
  const [slide, setSlide] = useState(0);
  const [inWizard, setInWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState(null);
  const [gender, setGender] = useState(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const grades = Array.from({ length: GRADE_MAX - GRADE_MIN + 1 }, (_, i) => GRADE_MIN + i);
  const stepValid = [grade !== null, gender !== null, name.trim().length > 0][step];
  const ready = grade !== null && gender !== null && name.trim().length > 0;

  async function submit(e) {
    e.preventDefault();
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

  function nextSlide() {
    if (slide < SLIDES.length - 1) setSlide(slide + 1);
    else setInWizard(true);
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
    else setInWizard(false); // về slide cuối của carousel
  }

  /* ─────────────────── Giai đoạn 1: carousel giới thiệu ─────────────────── */
  if (!inWizard) {
    const s = SLIDES[slide];
    return (
      <div
        className="gq-onb min-h-dvh"
        style={{
          background: `linear-gradient(180deg, ${s.bg[0]} 0%, ${s.bg[1]} 46%, #FFFBF2 74%)`,
        }}
      >
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6 pt-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSkip}
              className="px-2 py-1 text-sm font-semibold text-[#5b6b85] underline-offset-2 hover:underline"
            >
              Bỏ qua
            </button>
          </div>

          <div key={slide} className="ob-fade">
            {/* Vùng minh hoạ: emoji lớn + trang trí trôi nhẹ */}
            <div className="relative flex h-[38dvh] min-h-[230px] items-center justify-center">
              {s.decor.map((d, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`ob-drift absolute select-none ${d.pos}`}
                  style={{ animationDelay: d.delay, fontSize: d.size }}
                >
                  {d.e}
                </span>
              ))}
              <span
                aria-hidden="true"
                className="ob-float select-none"
                style={{ fontSize: 118, lineHeight: 1, filter: "drop-shadow(0 14px 18px rgba(29,46,74,.18))" }}
              >
                {s.emoji}
              </span>
            </div>

            <h1 className="mt-1 text-center font-display text-[28px] font-bold leading-tight text-ink">
              {s.title}
            </h1>
            <p className="mx-auto mt-3 max-w-[330px] text-center text-[15px] leading-relaxed text-[#5b6b85]">
              {s.subtitle}
            </p>
          </div>

          <div className="mt-auto pt-8">
            {/* Chấm phân trang: chấm đang chọn kéo dài thành pill */}
            <div className="mb-6 flex items-center justify-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Giới thiệu ${i + 1}`}
                  aria-current={i === slide}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === slide ? "w-6 bg-gold" : "w-2 bg-ink/15"
                  }`}
                />
              ))}
            </div>

            <button type="button" onClick={nextSlide} className={ctaClass(true)}>
              Tiếp tục
            </button>
            {onLogin && (
              <button
                type="button"
                onClick={onLogin}
                className="mt-3 w-full rounded-full bg-[#EDF0F4] py-4 font-display text-base font-bold text-ink transition active:scale-[0.99]"
              >
                Đã có tài khoản
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────── Giai đoạn 2: wizard từng bước ─────────────────── */
  const meta = STEPS[step];
  return (
    <div className="gq-onb min-h-dvh bg-[#FFFBF2]">
      <form
        onSubmit={submit}
        className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6 pt-4"
      >
        {/* Hàng trên: quay lại + thanh tiến độ */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Quay lại"
            className="-ml-1 shrink-0 p-1 text-ink transition hover:opacity-70"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E4E9F0]">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div key={step} className="ob-fade">
          {/* Nhãn + tiêu đề + nhân vật Đô */}
          <div className="mt-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">
                {meta.kicker}
              </p>
              <h1 className="mt-1.5 font-display text-[26px] font-bold leading-snug text-ink">
                {meta.title}
              </h1>
              {meta.hint && (
                <p className="mt-1.5 text-sm leading-snug text-[#7c8aa0]">{meta.hint}</p>
              )}
            </div>
            <img
              src={CHARACTER}
              alt=""
              width={64}
              height={64}
              className="ob-float shrink-0 select-none"
              style={{ filter: "drop-shadow(0 4px 6px rgba(29,46,74,.18))" }}
            />
          </div>

          <div className="mt-6">
            {step === 0 && (
              <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Lớp của bé">
                {grades.map((g) => (
                  <OptionRow
                    key={g}
                    selected={grade === g}
                    onClick={() => setGrade(g)}
                    badge={g}
                    label={gradeLabel(g)}
                    sub={`${ageForGrade(g)} tuổi`}
                  />
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Giới tính của bé">
                {GENDERS.map((g) => {
                  const selected = gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setGender(g.id)}
                      className="flex flex-col items-center gap-2 rounded-3xl border-2 px-3 py-7 transition active:scale-[0.99]"
                      style={{
                        background: selected ? g.tone : "#F1F4F8",
                        borderColor: selected ? g.tone : "transparent",
                        color: selected ? "#fff" : INK,
                      }}
                    >
                      <span className="text-5xl leading-none" aria-hidden="true">{g.face}</span>
                      <span className="font-display text-base font-bold">{g.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên bé…"
                  aria-label="Họ tên bé"
                  maxLength={60}
                  autoFocus
                  className="w-full rounded-2xl border-2 border-[#D8DEE8] bg-white px-4 py-4 font-display text-base font-semibold text-ink outline-none transition placeholder:font-body placeholder:font-medium placeholder:text-[#9AA6BA] focus:border-gold"
                />
                <p className="mt-4 text-center text-[11px] leading-snug text-[#7c8aa0]">
                  Tài khoản của bé được tạo tự động khi điền đủ thông tin. Phụ huynh có thể đổi lại trong Cài đặt.
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl border-2 border-[#E5533D] bg-[#FDECEA] px-4 py-3 text-center font-display text-sm font-bold text-[#E5533D]"
          >
            {error}
          </p>
        )}

        <div className="mt-auto pt-8">
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!stepValid}
              onClick={() => setStep(step + 1)}
              className={ctaClass(stepValid)}
            >
              Tiếp tục
            </button>
          ) : (
            <button type="submit" disabled={!ready || submitting} className={ctaClass(ready && !submitting)}>
              {submitting ? "Đang tạo tài khoản cho bé..." : "Hoàn thành"}
            </button>
          )}
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="mt-2 w-full py-2 text-center text-sm font-semibold text-[#7c8aa0] underline-offset-2 hover:underline disabled:opacity-50"
          >
            Bỏ qua
          </button>
        </div>
      </form>
    </div>
  );
}

/** Thẻ lựa chọn dạng radio: huy hiệu số bên trái + nhãn + vòng tròn chọn bên phải. */
function OptionRow({ selected, onClick, badge, label, sub }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition active:scale-[0.99] ${
        selected ? "border-gold bg-[#FFF3D6]" : "border-transparent bg-[#F1F4F8] hover:bg-[#E9EDF3]"
      }`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white font-display text-lg font-bold text-ink shadow-sm">
        {badge}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold leading-tight text-ink">{label}</span>
        {sub && <span className="block text-xs font-medium text-[#7c8aa0]">{sub}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
          selected ? "border-gold bg-gold" : "border-[#C4CEDC] bg-white"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
      </span>
    </button>
  );
}
