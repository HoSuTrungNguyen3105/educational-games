/**
 * OnboardingScreen.jsx — màn chào lần đầu, hiện khi khách CHƯA đăng nhập và
 * chưa đi qua màn này. Bắt buộc điền đủ mới vào được trang chủ.
 *
 *   ① Bé học lớp mấy?  (Lớp 1 → Lớp 5, quyết định độ khó game)
 *   ② Bé là bạn trai hay bạn gái?
 *   ③ Bé tên gì?  (họ tên)
 *
 * Kết quả lưu ở `src/lib/kidSettings.js` (localStorage), không gọi API —
 * sau khi đăng ký/đăng nhập thì dùng tiếp cài đặt này.
 */

import { useState } from "react";
import Mascot from "../components/Mascot.jsx";
import {
  completeOnboarding,
  GRADE_MIN, GRADE_MAX, gradeLabel, ageForGrade,
} from "../lib/kidSettings.js";

const GENDERS = [
  { id: "boy", label: "Bạn trai", face: "👦" },
  { id: "girl", label: "Bạn gái", face: "👧" },
];

export default function OnboardingScreen() {
  const [grade, setGrade] = useState(null);
  const [gender, setGender] = useState(null);
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const grades = Array.from({ length: GRADE_MAX - GRADE_MIN + 1 }, (_, i) => GRADE_MIN + i);
  const ready = grade !== null && gender !== null && name.trim().length > 0;

  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!ready) return;
    completeOnboarding({ name, grade, gender });
  }

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{
        background: "linear-gradient(180deg,#FDF6E9 0%,#FAEEDA 40%,#F7E7CE 100%)",
        color: "var(--ink)",
      }}
    >
      <form onSubmit={submit} className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-6">

        {/* ─────────── Chào ─────────── */}
        <div className="flex items-center gap-4">
          <Mascot size={96} />
          <div className="flex-1 min-w-0 rounded-3xl bg-white px-5 py-4 shadow-sm">
            <p className="font-display text-lg font-extrabold leading-tight">Chào bạn! Mình là Gạo.</p>
            <p className="text-sm text-ink/60 mt-0.5">Cho Gạo làm quen với bé một chút nhé!</p>
          </div>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold">Bé của mình là ai nhỉ?</h1>

        {/* ─────────── ① Lớp ─────────── */}
        <Card n={1} title="Bé học lớp mấy?"
          hint="Lớp quyết định độ khó của trò chơi (trừ Thế học). Đổi được sau trong Cài đặt.">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {grades.map((g) => (
              <Option
                key={g}
                selected={grade === g}
                onClick={() => setGrade(g)}
                error={touched && grade === null}
                title={gradeLabel(g).replace("Lớp ", "")}
                sub={`${ageForGrade(g)} tuổi`}
              />
            ))}
          </div>
        </Card>

        {/* ─────────── ② Giới tính ─────────── */}
        <Card n={2} title="Bé là bạn trai hay bạn gái?"
          hint="Giúp Gạo chọn đồ và mặt mỹ hơn cho bé.">
          <div className="grid grid-cols-2 gap-3">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id)}
                aria-pressed={gender === g.id}
                className="rounded-2xl py-4 px-3 flex flex-col items-center gap-2 border-2 transition hover:brightness-[.98] active:scale-[.98]"
                style={{
                  background: gender === g.id ? "#FDF0D8" : "#FBF1E1",
                  borderColor: gender === g.id ? "#F2A93B" : "transparent",
                }}
              >
                <span className="text-5xl leading-none" aria-hidden="true">{g.face}</span>
                <span className="font-display font-extrabold text-ink">{g.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* ─────────── ③ Họ tên ─────────── */}
        <Card title="Bé tên gì?" hint="Tên bé sẽ hiện ở trang chủ và trang hồ sơ.">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên bé…"
            aria-label="Họ tên bé"
            maxLength={60}
            className="w-full rounded-2xl border-2 px-4 py-3 font-display font-bold text-base focus:outline-none"
            style={{
              borderColor: touched && !name.trim() ? "#e8443c" : "var(--line)",
              background: "#fff",
              color: "var(--ink)",
            }}
          />
          {touched && !name.trim() && (
            <p className="mt-1.5 text-xs font-semibold text-red-500">Bé chưa có tên nha!</p>
          )}
        </Card>

        {touched && !ready && (
          <p className="text-center text-sm font-semibold text-red-500">
            Bé chọn đủ lớp, giới tính và tên rồi mình chơi tiếp nha!
          </p>
        )}

        {/* ─────────── Nút ─────────── */}
        <button
          type="submit"
          disabled={!ready}
          className="w-full rounded-2xl py-4 font-display text-base font-extrabold transition active:scale-[.99] disabled:cursor-not-allowed"
          style={{
            background: ready ? "var(--ink)" : "#E6D9C4",
            color: ready ? "var(--paper)" : "#A99578",
            boxShadow: ready ? "0 5px 0 rgba(0,0,0,.18)" : "none",
          }}
        >
          {ready ? "Chọn xong rồi, vào chơi nào!" : "Chọn xong 3 câu nhé"}
        </button>
      </form>
    </div>
  );
}

/** Khung câu hỏi có số thứ tự (bỏ số nếu không truyền). */
function Card({ n, title, hint, children }) {
  return (
    <section className="rounded-3xl bg-white p-4 sm:p-5 shadow-sm"
      style={{ border: "1px solid var(--line)" }}>
      <div className="flex gap-3 mb-3">
        {n && (
          <span className="w-8 h-8 rounded-full grid place-items-center font-display font-extrabold text-sm shrink-0"
            style={{ background: "#FDF0D8", color: "#C9853B" }}>
            {n}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-base sm:text-lg font-extrabold leading-tight">{title}</h2>
          {hint && <p className="text-xs text-ink/50 mt-0.5 leading-relaxed">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/** Một ô lựa chọn kiểu lưới (dùng cho lớp). */
function Option({ selected, onClick, title, sub, error }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="rounded-2xl px-2 py-3.5 flex flex-col items-center gap-0.5 border-2 transition hover:brightness-[.98] active:scale-[.98]"
      style={{
        background: selected ? "#FDF0D8" : "#FBF1E1",
        borderColor: error ? "#e8443c" : selected ? "#F2A93B" : "transparent",
      }}
    >
      <span className="font-display text-xl font-extrabold text-ink">{title}</span>
      <span className="text-[11px] font-semibold text-ink/50">{sub}</span>
    </button>
  );
}