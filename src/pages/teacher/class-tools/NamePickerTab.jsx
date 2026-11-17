import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Expand, History, Shrink, Sparkles } from "lucide-react";
import { Checkbox } from "../../../components/ui";
import { SERIES_COLORS } from "../../../components/charts/palette.js";
import RosterPanel from "./RosterPanel.jsx";
import DiceRoller from "./DiceRoller.jsx";
import CoinFlip from "./CoinFlip.jsx";
import NumberDraw from "./NumberDraw.jsx";
import { computeTargetRotation, pickOne, pickRandom } from "./randomUtils.js";
import { shortNameOf } from "./shared.js";

/**
 * NamePickerTab — tab "Gọi tên" của trang Công cụ lớp học.
 *
 * Bố cục như ảnh mẫu: trái là RosterPanel (danh sách lớp dùng chung),
 * phải là khu gọi tên, dưới là 3 tiện ích ngẫu nhiên (xúc xắc / đồng xu /
 * bốc số). Khu gọi tên có 2 chế độ:
 *  - "Vòng quay": vòng quay SVG tự vẽ; chọn người trúng NGẪU NHIÊN THẬT
 *    trước rồi tính góc quay để lát của người trúng dừng đúng kim.
 *  - "Bốc thăm": chạy tên nhanh ~700ms rồi chốt, hiện tên cỡ lớn.
 * Cả hai dùng chung: phạm vi (tất cả / chỉ đặc biệt), số lượng gọi 1–5
 * (không trùng trong một lượt), "Không gọi lại người đã gọi" + lịch sử
 * gọi của phiên (theo từng lớp). Phím tắt R để quay/bốc. Nút toàn màn
 * hình phóng to khu gọi tên khi trình chiếu.
 *
 * Học sinh được gọi KHÔNG tự cộng điểm — điểm chỉ sửa tay ở panel
 * danh sách (+1/−1), đúng như ảnh mẫu.
 */

const SPIN_MS = 4600;
const DRAW_MS = 700;

function polar(cx, cy, r, degFromTop) {
  const rad = (degFromTop * Math.PI) / 180;
  return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
}

function slicePath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const largeArc = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

const shortName = shortNameOf;

const DARK_TEXT_ON = new Set(["#F4B942", "#38BDF8"]);

function SpinWheel({ pool, rotation, spinning }) {
  const size = 320;
  const c = size / 2;
  const r = c - 4;
  const n = pool.length;
  const seg = 360 / n;
  const fontSize = n <= 10 ? 13 : n <= 16 ? 11 : n <= 24 ? 9.5 : 8;

  return (
    <div
      className="w-full h-full"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.08, 1)` : "none",
      }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full block">
        {n === 1 ? (
          <circle cx={c} cy={c} r={r} fill={SERIES_COLORS[0]} stroke="#fff" strokeWidth="2" />
        ) : (
          pool.map((s, i) => (
            <path key={s.id} d={slicePath(c, c, r, i * seg, (i + 1) * seg)}
              fill={SERIES_COLORS[i % SERIES_COLORS.length]} stroke="#fff" strokeWidth="2" />
          ))
        )}
        {pool.map((s, i) => {
          const mid = i * seg + seg / 2;
          const [tx, ty] = polar(c, c, r * 0.64, mid);
          const color = SERIES_COLORS[i % SERIES_COLORS.length];
          return (
            <text key={s.id} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${mid} ${tx} ${ty})`}
              fontSize={fontSize} fontWeight="700"
              fill={DARK_TEXT_ON.has(color) ? "#1D2E4A" : "#FFFFFF"}>
              {shortName(s.name)}
            </text>
          );
        })}
        <circle cx={c} cy={c} r="17" fill="#fff" stroke="rgba(29,46,74,0.15)" />
        <circle cx={c} cy={c} r="6" fill="#1D2E4A" />
      </svg>
    </div>
  );
}

export default function NamePickerTab({ roster, showToast }) {
  const { activeClass } = roster;
  const students = useMemo(() => activeClass?.students ?? [], [activeClass]);
  const starCount = useMemo(() => students.filter((s) => s.star).length, [students]);

  const [mode, setMode] = useState("wheel"); // "wheel" | "draw"
  const [scope, setScope] = useState("all"); // "all" | "star"
  const [count, setCount] = useState(1);
  const [noRepeat, setNoRepeat] = useState(false);
  const [calledByClass, setCalledByClass] = useState({}); // { classId: [studentId] }
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinPool, setSpinPool] = useState(null);
  const [winners, setWinners] = useState([]);
  const [drawDisplay, setDrawDisplay] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const zoneRef = useRef(null);
  const timersRef = useRef([]);

  const classId = activeClass?.id;
  const calledIds = useMemo(() => calledByClass[classId] || [], [calledByClass, classId]);
  const basePool = useMemo(
    () => (scope === "star" ? students.filter((s) => s.star) : students),
    [students, scope],
  );
  const eligiblePool = useMemo(
    () => (noRepeat ? basePool.filter((s) => !calledIds.includes(s.id)) : basePool),
    [basePool, noRepeat, calledIds],
  );
  const wheelPool = spinPool ?? eligiblePool;
  const allCalled = noRepeat && basePool.length > 0 && eligiblePool.length === 0;

  const later = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  // Đổi lớp / phạm vi / chế độ chống lặp → vòng quay vẽ lại theo pool mới
  // (chỉnh state ngay trong render theo pattern React khuyến nghị thay cho
  // effect, tránh render dây chuyền).
  const poolKey = `${classId}|${scope}|${noRepeat}`;
  const [lastPoolKey, setLastPoolKey] = useState(poolKey);
  if (poolKey !== lastPoolKey) {
    setLastPoolKey(poolKey);
    setSpinPool(null);
    setWinners([]);
  }

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const finalize = useCallback((picked) => {
    setWinners(picked);
    setSpinning(false);
    setDrawDisplay(null);
    if (classId && picked.length) {
      setCalledByClass((prev) => ({
        ...prev,
        [classId]: [...(prev[classId] || []), ...picked.map((s) => s.id)],
      }));
    }
  }, [classId]);

  const trigger = useCallback(() => {
    if (spinning || !eligiblePool.length) return;
    const picked = pickRandom(eligiblePool, Math.min(count, eligiblePool.length));
    setWinners([]);
    if (mode === "wheel") {
      const pool = eligiblePool;
      const winnerIdx = pool.indexOf(picked[0]);
      const seg = 360 / pool.length;
      const jitter = pool.length > 45 ? 0 : (Math.random() * 2 - 1) * seg * 0.3;
      setSpinPool(pool);
      setRotation((cur) => computeTargetRotation(cur, winnerIdx, pool.length, jitter));
      setSpinning(true);
      later(() => finalize(picked), SPIN_MS + 80);
    } else {
      setSpinning(true);
      const interval = setInterval(() => {
        const one = pickOne(eligiblePool);
        if (one) setDrawDisplay(one.name);
      }, 65);
      timersRef.current.push(interval);
      later(() => {
        clearInterval(interval);
        finalize(picked);
      }, DRAW_MS);
    }
  }, [spinning, eligiblePool, count, mode, finalize, later]);

  // Phím tắt R: quay/bốc khi không đang gõ trong ô nhập liệu.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "r" && e.key !== "R") return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      trigger();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trigger]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else zoneRef.current?.requestFullscreen?.();
  };

  const clearHistory = () => {
    if (!classId) return;
    setCalledByClass((prev) => ({ ...prev, [classId]: [] }));
    setWinners([]);
    setSpinPool(null);
  };

  const calledStudents = calledIds
    .map((id) => students.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div>
      <div className="grid gap-4 xl:grid-cols-[400px,1fr] items-start">
        <RosterPanel roster={roster} showToast={showToast} />

        <section ref={zoneRef}
          className={`bg-white rounded-3xl border border-ink/10 shadow-sm p-4 sm:p-5 flex flex-col gap-4 ${isFullscreen ? "overflow-y-auto !rounded-none" : ""}`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex rounded-xl bg-ink/5 p-1">
              {[
                { key: "wheel", label: "Vòng quay" },
                { key: "draw", label: "Bốc thăm" },
              ].map((t) => (
                <button key={t.key} type="button" disabled={spinning} onClick={() => setMode(t.key)}
                  className={`text-sm font-display font-semibold rounded-lg px-4 py-2 transition ${mode === t.key ? "bg-emerald-600 text-white shadow-sm" : "text-ink/55 hover:text-ink"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 text-xs font-display font-semibold rounded-xl px-3 py-2 border border-ink/15 text-ink/70 hover:bg-ink/5 transition">
              {isFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
              {isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            </button>
          </div>

          <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink/60">Phạm vi quay:</span>
              <div className="inline-flex rounded-full bg-ink/5 p-1">
                <button type="button" disabled={spinning} onClick={() => setScope("all")}
                  className={`text-xs font-display font-semibold rounded-full px-3 py-1.5 transition ${scope === "all" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}>
                  Tất cả ({students.length})
                </button>
                <button type="button" disabled={spinning || starCount === 0} onClick={() => setScope("star")}
                  title={starCount === 0 ? "Chưa có học sinh nào được đánh dấu sao đặc biệt" : ""}
                  className={`text-xs font-display font-semibold rounded-full px-3 py-1.5 transition disabled:opacity-40 ${scope === "star" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}>
                  Chỉ đặc biệt ({starCount})
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink/60">Số lượng gọi:</span>
              <div className="inline-flex items-center rounded-full bg-ink/5 p-1">
                <button type="button" disabled={spinning} onClick={() => setCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 grid place-items-center rounded-full font-bold text-ink/60 hover:bg-white disabled:opacity-40">−</button>
                <span className="w-7 text-center font-display font-bold text-ink">{count}</span>
                <button type="button" disabled={spinning} onClick={() => setCount((c) => Math.min(5, c + 1))}
                  className="w-7 h-7 grid place-items-center rounded-full font-bold text-ink/60 hover:bg-white disabled:opacity-40">+</button>
              </div>
            </div>
            <Checkbox checked={noRepeat} onChange={setNoRepeat} label="Không gọi lại người đã gọi" />
          </div>

          {students.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2/60 px-4 py-10 text-center">
              <p className="font-display font-bold text-ink">Chưa có danh sách để gọi tên</p>
              <p className="text-sm text-ink/55 mt-1">Nạp danh sách học sinh ở panel bên trái trước, rồi quay gọi tên tại đây.</p>
            </div>
          ) : allCalled ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-10 text-center">
              <p className="font-display font-bold text-ink">Đã gọi hết học sinh trong phạm vi này</p>
              <p className="text-sm text-ink/55 mt-1">Bỏ chọn “Không gọi lại người đã gọi” hoặc đặt lại lịch sử để gọi tiếp.</p>
              <button type="button" onClick={clearHistory}
                className="mt-3 font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition">
                Đặt lại lịch sử gọi
              </button>
            </div>
          ) : mode === "wheel" ? (
            wheelPool.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/20 bg-paper2/60 px-4 py-10 text-center">
                <p className="font-display font-bold text-ink">Phạm vi này chưa có học sinh nào</p>
                <p className="text-sm text-ink/55 mt-1">Đánh dấu sao “đặc biệt” cho học sinh ở panel danh sách, hoặc chuyển phạm vi về “Tất cả”.</p>
              </div>
            ) : (
            <div className="relative mx-auto w-full max-w-[440px] aspect-square">
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-10 pointer-events-none">
                <svg width="34" height="30" viewBox="0 0 34 30">
                  <polygon points="17,28 3,4 31,4" fill="#E4572E" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
              <SpinWheel pool={wheelPool} rotation={rotation} spinning={spinning} />
            </div>
            )
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 min-h-[300px] flex flex-col items-center justify-center px-4 py-10 text-center">
              {spinning && drawDisplay ? (
                <p className="font-display font-bold text-4xl sm:text-5xl text-white/90">{drawDisplay}</p>
              ) : winners.length ? (
                <>
                  <p className="text-emerald-100/80 text-sm font-semibold mb-2">Học sinh được bốc trúng</p>
                  <p className="font-display font-bold text-4xl sm:text-5xl text-white leading-tight">
                    {winners.map((w) => w.name).join("  •  ")}
                  </p>
                </>
              ) : (
                <p className="font-display font-bold text-3xl text-white/70">Bấm “BỐC THĂM NGAY” để bắt đầu</p>
              )}
            </div>
          )}

          {students.length > 0 && !allCalled && (
            <button type="button" onClick={trigger} disabled={spinning || !eligiblePool.length}
              className="mx-auto font-display font-bold text-base rounded-2xl px-8 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition disabled:opacity-40 shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              {spinning
                ? mode === "wheel" ? "Đang quay…" : "Đang bốc…"
                : mode === "wheel" ? "QUAY NGAY (Phím R)" : "BỐC THĂM NGAY (Phím R)"}
            </button>
          )}

          {winners.length > 0 && !spinning && mode === "wheel" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Học sinh được gọi
              </p>
              <p className="font-display font-bold text-2xl text-ink mt-1">
                {winners.map((w) => w.name).join("  •  ")}
              </p>
            </div>
          )}

          <div className="border-t border-ink/10 pt-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-ink/50 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Đã được gọi gần đây ({calledStudents.length}):
              </p>
              {calledStudents.length > 0 && (
                <button type="button" onClick={clearHistory}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600">Xoá lịch sử</button>
              )}
            </div>
            {calledStudents.length === 0 ? (
              <p className="text-xs text-ink/40 mt-1.5">Chưa ai được gọi trong phiên này.</p>
            ) : (
              <div className="flex gap-1.5 flex-wrap mt-2">
                {[...calledStudents].reverse().slice(0, 15).map((s, i) => (
                  <span key={`${s.id}-${i}`} className="text-xs font-semibold bg-paper2 border border-ink/10 text-ink/70 rounded-full px-2.5 py-1">
                    {s.name}
                  </span>
                ))}
                {calledStudents.length > 15 && (
                  <span className="text-xs text-ink/40 px-1 py-1">… và {calledStudents.length - 15} bạn nữa</span>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-4">
        <DiceRoller />
        <CoinFlip />
        <NumberDraw />
      </div>
    </div>
  );
}
