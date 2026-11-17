import { useEffect, useRef, useState } from "react";
import { Hash } from "lucide-react";
import { Checkbox, Input } from "../../../components/ui";
import { randomInt } from "./randomUtils.js";

/**
 * NumberDraw — bốc thăm số ngẫu nhiên trong khoảng Từ–Đến.
 * Tuỳ chọn "Không lặp lại": loại số đã bốc khỏi khoảng; hết số thì báo
 * và có nút Làm mới. State nội bộ.
 */
export default function NumberDraw() {
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(50);
  const [noRepeat, setNoRepeat] = useState(false);
  const [drawn, setDrawn] = useState([]);
  const [current, setCurrent] = useState(null);
  const [rolling, setRolling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const lo = Number.isFinite(Number(from)) && from !== "" ? Math.trunc(Number(from)) : null;
  const hi = Number.isFinite(Number(to)) && to !== "" ? Math.trunc(Number(to)) : null;
  const rangeValid = lo !== null && hi !== null && hi >= lo;
  const rangeSize = rangeValid ? hi - lo + 1 : 0;
  const exhausted = noRepeat && rangeValid && drawn.length >= rangeSize;

  const draw = () => {
    if (!rangeValid || rolling || exhausted) return;
    const used = noRepeat ? new Set(drawn) : null;
    const pick = () => {
      let n = randomInt(lo, hi);
      if (used) {
        let guard = 0;
        while (used.has(n) && guard < 500) { n = randomInt(lo, hi); guard += 1; }
        if (used.has(n)) { // khoảng nhỏ: duyệt tuyến tính cho chắc
          for (let v = lo; v <= hi; v += 1) if (!used.has(v)) { n = v; break; }
        }
      }
      return n;
    };
    const result = pick();
    setRolling(true);
    timerRef.current = setInterval(() => setCurrent(randomInt(lo, hi)), 60);
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrent(result);
      setDrawn((d) => [...d, result]);
      setRolling(false);
    }, 550);
  };

  const reset = () => {
    setDrawn([]);
    setCurrent(null);
  };

  return (
    <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
      <div>
        <h3 className="font-display font-bold text-ink flex items-center gap-2">
          <span className="w-7 h-7 grid place-items-center rounded-lg bg-rose-500 text-white"><Hash className="w-4 h-4" /></span>
          Bốc thăm số ngẫu nhiên
        </h3>
        <p className="text-xs text-ink/50 mt-1">Chọn khoảng số, có thể bỏ qua số đã bốc</p>
      </div>

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input type="number" label="Từ số" value={from} onChange={setFrom} />
        </div>
        <span className="pb-2.5 text-ink/40 font-bold">→</span>
        <div className="flex-1">
          <Input type="number" label="Đến số" value={to} onChange={setTo} />
        </div>
      </div>

      <div className="rounded-2xl bg-paper2/70 min-h-[86px] flex flex-col items-center justify-center py-3 px-3">
        {current === null ? (
          <span className="font-display font-bold text-4xl text-rose-300 tracking-widest">- -</span>
        ) : (
          <span className="font-display font-bold text-5xl text-rose-500">{current}</span>
        )}
        {drawn.length > 0 && (
          <p className="text-[11px] text-ink/50 mt-2 text-center">
            Đã bốc: {drawn.join(", ")}
          </p>
        )}
        {exhausted && (
          <p className="text-xs font-semibold text-rose-500 mt-1">Đã bốc hết các số trong khoảng — bấm “Làm mới” để bốc lại.</p>
        )}
        {!rangeValid && (
          <p className="text-xs font-semibold text-rose-500 mt-1">Khoảng số chưa hợp lệ (số cuối phải lớn hơn hoặc bằng số đầu).</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <Checkbox checked={noRepeat} onChange={setNoRepeat} label="Không lặp lại" />
          <button type="button" onClick={reset}
            className="text-xs font-semibold text-ink/45 underline hover:text-ink">Làm mới</button>
        </div>
        <button type="button" onClick={draw} disabled={!rangeValid || rolling || exhausted}
          className="font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] transition disabled:opacity-40 shadow-[0_3px_0_rgba(0,0,0,0.18)]">
          {rolling ? "Đang bốc…" : "Bốc số"}
        </button>
      </div>
    </section>
  );
}
