import { useEffect, useRef, useState } from "react";
import { Dices } from "lucide-react";
import { randomInt } from "./randomUtils.js";

/**
 * DiceRoller — tung 1–3 viên xúc xắc, tự cộng TỔNG ĐIỂM.
 * Xúc xắc vẽ bằng SVG (mặt chấm), hiệu ứng lăn = đổi mặt liên tục trong
 * ~500ms rồi chốt. State nội bộ, không liên quan danh sách lớp.
 */

const PIP_LAYOUT = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[26, 26], [74, 26], [50, 50], [26, 74], [74, 74]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

function Die({ value, rolling }) {
  return (
    <svg viewBox="0 0 100 100" className={`w-16 h-16 sm:w-20 sm:h-20 drop-shadow ${rolling ? "animate-pulse" : ""}`} aria-label={`Xúc xắc ${value}`}>
      <rect x="4" y="4" width="92" height="92" rx="18" className="fill-white stroke-emerald-700" strokeWidth="3" />
      {(PIP_LAYOUT[value] || []).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" className="fill-emerald-700" />
      ))}
    </svg>
  );
}

export default function DiceRoller() {
  const [count, setCount] = useState(1);
  const [dice, setDice] = useState([5]);
  const [rolling, setRolling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const changeCount = (n) => {
    setCount(n);
    setDice((prev) => {
      const next = prev.slice(0, n);
      while (next.length < n) next.push(randomInt(1, 6));
      return next;
    });
  };

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    timerRef.current = setInterval(() => {
      setDice(Array.from({ length: count }, () => randomInt(1, 6)));
    }, 70);
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setDice(Array.from({ length: count }, () => randomInt(1, 6)));
      setRolling(false);
    }, 550);
  };

  const total = dice.reduce((a, b) => a + b, 0);

  return (
    <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-bold text-ink flex items-center gap-2">
            <span className="w-7 h-7 grid place-items-center rounded-lg bg-emerald-600 text-white"><Dices className="w-4 h-4" /></span>
            Tung xúc xắc ngẫu nhiên
          </h3>
          <p className="text-xs text-ink/50 mt-1">Chọn 1–3 viên, tự cộng tổng điểm</p>
        </div>
        <div className="inline-flex rounded-xl bg-ink/5 p-1 shrink-0">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" onClick={() => changeCount(n)}
              className={`w-7 h-7 text-xs font-bold rounded-lg transition ${count === n ? "bg-emerald-600 text-white shadow-sm" : "text-ink/50 hover:text-ink"}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 min-h-[120px] flex items-center justify-center gap-3 py-4">
        {dice.map((v, i) => <Die key={i} value={v} rolling={rolling} />)}
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink/60">
          TỔNG ĐIỂM <span className="font-display font-bold text-lg text-ink ml-1">{rolling ? "…" : total}</span>
        </p>
        <button type="button" onClick={roll} disabled={rolling}
          className="font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-40 shadow-[0_3px_0_rgba(0,0,0,0.18)]">
          {rolling ? "Đang tung…" : "Tung xúc xắc"}
        </button>
      </div>
    </section>
  );
}
