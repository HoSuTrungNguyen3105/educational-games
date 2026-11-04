/**
 * OnboardingScreen.jsx — màn chào lần đầu, hiện khi khách CHƯA đăng nhập và
 * chưa đi qua màn này. Từ 2026-11-04 nó render dạng MODAL lớp phủ (dùng chung
 * `Modal` ở components/ui) đè lên trang chủ đã mount phía sau, thay vì thay
 * thế toàn bộ màn hình như trước. Theo quyết định của Nguyên, modal này CHỈ
 * thoát được bằng nút "Bỏ qua" hoặc hoàn thành form — `dismissible={false}`:
 * không đóng bằng ESC, không đóng khi bấm ra ngoài nền, không nút X.
 *
 *   ① Bé học lớp mấy?  (Lớp 1 → Lớp 5, quyết định độ khó game)
 *   ② Bé là bạn trai hay bạn gái?
 *   ③ Bé tên gì?  (họ tên)
 *
 * Dùng chung bộ màu + kiểu "dán nhãn" (viền navy, bóng cứng) với trang chủ:
 * xem biến `--nb-*` ở `src/pages/home-theme.css` và bảng màu Tailwind
 * trong `index.html` (ink / paper / gold / teal…).
 *
 * Hoàn thành form: App (`handleOnboardingComplete`) tự đăng ký tài khoản
 * thật cho bé rồi gọi `completeOnboarding(...)`; "Bỏ qua" gọi
 * `skipOnboarding(...)` — cả hai đều lưu ở `src/lib/kidSettings.js`
 * (localStorage) và đánh dấu đã onboard để modal không hiện lại.
 */

import { useState } from "react";
import "./onboarding.css";
import { Modal } from "../components/ui";
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

/** Bảng màu rút từ trang chủ — đặt ở scope `.gq-onb` cho gọn. */
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
    <Modal
      dismissible={false}
      unstyled
      contentClassName="gq-onb o-modal-card w-full max-w-md max-h-[92dvh] overflow-y-auto"
      contentStyle={{
        "--nb-ink": S.ink,
        "--nb-paper": S.paper,
        "--nb-cream": "#fffdf6",
      }}
    >
      <form onSubmit={submit} className="p-4 sm:p-5 space-y-3">

        {/* ─────────── Nhân vật chào (gọn: avatar nhỏ + bong bóng chào) ─────────── */}
        <header className="flex items-center gap-3">
          <img
            src={CHARACTER}
            alt=""
            width={56}
            height={56}
            className="o-float shrink-0 select-none"
            style={{ filter: "drop-shadow(0 4px 6px rgba(29,46,74,.18))" }}
          />
          <div className="min-w-0 flex-1">
            <p
              className="font-display font-bold text-ink inline-block px-3 py-1 rounded-2xl text-white text-sm sm:text-base"
              style={{ background: S.blue, boxShadow: `3px 3px 0 ${S.ink}` }}
            >
              Chào bạn! Mình là Đô
            </p>
            <p className="text-xs sm:text-sm font-medium text-[#5b6b85] mt-1.5">
              Cho Đô làm quen bé một chút nha — bé là ai nhỉ?
            </p>
          </div>
        </header>

        {/* ─────────── ① Lớp ─────────── */}
        <Card n={1} title="Bé học lớp mấy?"
          hint="Lớp quyết định độ khó của trò chơi (trừ Thế học). Đổi được sau trong Cài đặt.">
          <div className="grid grid-cols-5 gap-1.5">
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
          hint="Giúp Đô chọn đồ và mặt mỹ hơn cho bé.">
          <div className="grid grid-cols-2 gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id)}
                aria-pressed={gender === g.id}
                className="o-chip group px-2 py-2"
                style={{
                  background: gender === g.id ? g.tone : S.cream,
                  borderColor: S.ink,
                  color: gender === g.id ? "#fff" : S.ink,
                  boxShadow: gender === g.id ? `4px 4px 0 ${S.ink}` : `4px 4px 0 rgba(29,46,74,.18)`,
                }}
              >
                <span className="text-3xl leading-none" aria-hidden="true">{g.face}</span>
                <span className="font-display font-bold text-sm mt-1">{g.label}</span>
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
            className="o-input font-display font-semibold text-base"
            style={{
              borderColor: missing && !name.trim() ? S.red : S.ink,
              background: S.cream,
              color: S.ink,
              boxShadow: missing && !name.trim() ? `4px 4px 0 ${S.red}` : `4px 4px 0 rgba(29,46,74,.18)`,
            }}
          />
          {missing && !name.trim() && (
            <p className="mt-1.5 text-sm font-semibold" style={{ color: S.red }}>Bé chưa có tên nha!</p>
          )}
        </Card>

        {missing && (
          <p
            className="o-banner font-display font-bold text-sm"
            style={{ background: "#fdecea", borderColor: S.red, color: S.red }}
          >
            Bé chọn đủ lớp, giới tính và tên rồi mình chơi tiếp nha!
          </p>
        )}

        {error && (
          <p
            className="o-banner font-display font-bold text-sm"
            style={{ background: "#fdecea", borderColor: S.red, color: S.red }}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* ─────────── Nút ─────────── */}
        <div className="o-actions">
          <button
            type="submit"
            disabled={!ready || submitting}
            className="o-btn w-full font-display font-bold text-base"
            style={{
              background: ready && !submitting ? S.gold : "#e4e8ef",
              color: ready && !submitting ? S.ink : "#9aa6ba",
              borderColor: S.ink,
              boxShadow: ready && !submitting ? `5px 5px 0 ${S.ink}` : `3px 3px 0 ${S.ink}`,
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
            className="o-btn w-full font-display font-bold text-sm"
            style={{
              background: S.cream,
              color: S.ink,
              borderColor: S.ink,
              boxShadow: `4px 4px 0 rgba(29,46,74,.18)`,
            }}
          >
            Bỏ qua
          </button>
        </div>

        <p className="text-center text-[11px] leading-snug text-[#7c8aa0]">
          Tài khoản của bé được tạo tự động khi điền đủ thông tin. Phụ huynh có thể đổi lại trong Cài đặt.
        </p>
      </form>
    </Modal>
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
        boxShadow: `4px 4px 0 ${S.ink}`,
      }}
    >
      <div className="flex gap-2.5 mb-2.5">
        <span
          className="w-7 h-7 shrink-0 grid place-items-center rounded-full font-display font-bold text-xs"
          style={{ background: S.gold, color: S.ink, border: `2px solid ${S.ink}` }}
        >
          {n}
        </span>
        <div className="min-w-0">
          <h2 className="font-display font-bold text-base text-ink leading-tight">{title}</h2>
          {hint && <p className="text-xs text-[#7c8aa0] mt-0.5 leading-snug">{hint}</p>}
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
      className="o-chip px-1 py-2"
      style={{
        background: selected ? S.gold : S.cream,
        borderColor: error ? S.red : S.ink,
        color: S.ink,
        boxShadow: selected ? `4px 4px 0 ${S.ink}` : `4px 4px 0 rgba(29,46,74,.15)`,
      }}
    >
      <span className="font-display font-bold text-[13px] leading-tight">{label}</span>
      <span className="text-[10px] font-semibold opacity-65 mt-0.5 leading-tight">{age} tuổi</span>
    </button>
  );
}
