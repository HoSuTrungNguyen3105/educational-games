/**
 * DonateModal.jsx — Ứng hộ cho web.
 *
 *   Bước 1  Giải câu đố phép tính (khó hơn) — sai thì báo và không qua được.
 *   Bước 2  Giải đúng hết → hiện mã QR + thông tin ngân hàng để chuyển khoản.
 *
 * Thông tin tài khoản nằm ở `src/config/donation.js` (sửa file đó cho thật).
 */

import { useEffect, useState } from "react";
import { Check, Copy, Heart, RefreshCw } from "lucide-react";
import { DONATION, donationPayload } from "../../config/donation.js";
import { useMathQuestions } from "../../lib/mathGate.js";

export default function DonateModal({ onClose }) {
  const questions = useMathQuestions(DONATION.questionCount);
  const [step, setStep] = useState("quiz"); // quiz | done
  const [answers, setAnswers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e) {
    e.preventDefault();
    const wrong = questions.map((q, i) => Number(answers[i]) !== q.a);
    setErrors(wrong);
    if (wrong.some(Boolean)) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    setStep("done");
  }

  async function copy(text, key) {
    try {
      await navigator.clipboard.writeText(text);
    } catch { /* trình duyệt chặn clipboard */ }
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  }

  return (
    <div className="gq-scrim items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden ${
          shaking ? "animate-[popIn_.35s_ease]" : ""
        }`}
      >
        {/* đầu */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(120deg,#ff6fb5,#ff9ec7)" }}>
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5" fill="currentColor" />
            <div>
              <p className="font-display font-extrabold leading-tight">Ứng hộ cho web</p>
              <p className="text-[11px] opacity-90">
                {step === "quiz" ? "Giải đúng để xem mã QR nhé bé!" : "Cảm ơn bé đã giúp!"}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng"
            className="text-white/90 hover:text-white text-xl leading-none">✕</button>
        </div>

        {step === "quiz" ? (
          <form onSubmit={submit} className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
            <p className="text-sm text-ink/70 leading-relaxed">
              Bé giải giúp các phép tính sau đây nhé. Sai thì làm lại nha!
            </p>

            {questions.map((q, i) => (
              <div key={i}>
                <label className="flex items-center gap-3">
                  <span className="flex-1 rounded-xl px-3 py-2.5 font-mono text-[15px] font-bold"
                    style={{ background: "var(--bg)" }}>
                    {i + 1}. {q.q} =
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={answers[i] ?? ""}
                    onChange={(e) => setAnswers((prev) => {
                      const next = [...prev];
                      next[i] = e.target.value;
                      return next;
                    })}
                    aria-invalid={errors[i] ? "true" : undefined}
                    className="w-24 rounded-xl border-2 px-3 py-2.5 text-center font-mono text-[15px] font-bold focus:outline-none"
                    style={{
                      borderColor: errors[i] ? "#e8443c" : "var(--line)",
                      background: errors[i] ? "#fff1f1" : "var(--card)",
                      color: "var(--ink)",
                    }}
                  />
                </label>
                {errors[i] && <p className="mt-1 text-xs font-semibold text-red-500">Chưa đúng, thử lại nha!</p>}
              </div>
            ))}

            <button type="submit"
              className="w-full rounded-2xl bg-gold text-white py-3 font-display font-extrabold shadow hover:brightness-105 active:scale-[.98] transition">
              Kiểm tra đáp án
            </button>
          </form>
        ) : (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* QR */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-56 h-56 rounded-2xl grid place-items-center p-3"
                style={{ background: "#fff", border: "2px solid var(--line)" }}>
                {DONATION.qrImage ? (
                  <img
                    src={DONATION.qrImage}
                    alt="Mã QR ủng hộ"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                ) : null}
                <QrFallback hidden={!!DONATION.qrImage} />
              </div>
              <p className="text-xs text-ink/50 text-center">
                Quét mã bằng ứng dụng ngân hàng, hoặc chuyển khoản thủ công bên dưới.
              </p>
            </div>

            {/* thông tin ngân hàng */}
            <dl className="rounded-2xl divide-y" style={{ background: "var(--bg)" }}>
              <Row label="Ngân hàng" value={DONATION.bank} onCopy={copy} copyKey="bank" copied={copied} />
              <Row label="Chủ tài khoản" value={DONATION.holder} onCopy={copy} copyKey="holder" copied={copied} />
              <Row label="Số tài khoản" value={DONATION.accountNo} onCopy={copy} copyKey="stk" copied={copied} />
            </dl>

            <button
              onClick={() => copy(donationPayload(), "qr")}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 py-2.5 text-sm font-extrabold transition hover:bg-ink/5"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              {copied === "qr" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === "qr" ? "Đã sao chép" : "Sao chép nội dung QR"}
            </button>

            <p className="text-xs text-ink/55 leading-relaxed">{DONATION.note}</p>

            <button onClick={onClose}
              className="w-full rounded-2xl bg-gold text-white py-3 font-display font-extrabold shadow hover:brightness-105 active:scale-[.98] transition">
              Đóng lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, onCopy, copyKey, copied }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <dt className="w-28 shrink-0 text-xs font-bold text-ink/50">{label}</dt>
      <dd className="flex-1 min-w-0 font-semibold text-ink break-all">{value}</dd>
      <button onClick={() => onCopy(value, copyKey)}
        aria-label={`Sao chép ${label}`}
        className="shrink-0 rounded-lg p-1.5 text-ink/40 hover:text-ink hover:bg-ink/5 transition">
        {copied === copyKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

/** Hiện khi không có (hoặc ảnh QR lỗi) — hướng dẫn chứ không chết trang. */
function QrFallback({ hidden }) {
  if (hidden) return null;
  return (
    <div className="text-center px-2">
      <p className="text-3xl mb-1">📷</p>
      <p className="text-xs font-bold text-ink/70">Chưa có ảnh QR</p>
      <p className="text-[11px] text-ink/45 mt-1 leading-snug">
        Đặt ảnh QR vào <code className="font-mono">public/donate-qr.png</code> rồi khai báo trong
        <code className="font-mono"> src/config/donation.js</code>.
      </p>
    </div>
  );
}

/** Nút làm lại câu đố — dùng khi bí (đã sai thì chỉ cần sửa số). */
export function RetryHint({ onRetry }) {
  return (
    <button onClick={onRetry}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-ink transition">
      <RefreshCw className="w-3.5 h-3.5" /> Đổi câu khác
    </button>
  );
}