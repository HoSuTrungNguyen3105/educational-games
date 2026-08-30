import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { coinService } from "../../services/api.js";
import { taskService, trackTaskEvent } from "../../services/taskService.js";
import { Loader } from "../../components/ui.jsx";
// Optional: nếu muốn confetti, cài đặt canvas-confetti và import
// import confetti from "canvas-confetti";

const SEGMENTS = [
  { id: "coin_5", label: "+5 Xu", coins: 5, color: "#4ade80", icon: "🪙", weight: 25 },
  { id: "coin_10", label: "+10 Xu", coins: 10, color: "#38bdf8", icon: "💰", weight: 20 },
  { id: "coin_15", label: "+15 Xu", coins: 15, color: "#a78bfa", icon: "💎", weight: 15 },
  { id: "coin_20", label: "+20 Xu", coins: 20, color: "#f472b6", icon: "🎁", weight: 12 },
  { id: "coin_30", label: "+30 Xu", coins: 30, color: "#fbbf24", icon: "👑", weight: 8 },
  { id: "coin_50", label: "+50 Xu", coins: 50, color: "#f97316", icon: "🌟", weight: 5 },
  { id: "play_23", label: "THẮNG LỚN!", coins: 100, color: "#ef4444", icon: "🏆", weight: 1, jackpot: true },
  { id: "coin_0", label: "May mắn!", coins: 0, color: "#6b7280", icon: "🍀", weight: 14 },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;
const RIM_LIGHT_COUNT = 16;

function getWeightedRandomIndex() {
  const totalWeight = SEGMENTS.reduce((s, seg) => s + seg.weight, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < SEGMENTS.length; i++) {
    r -= SEGMENTS[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

// Text on the lower half of a circle reads upside-down if it is simply
// rotated to the segment's angle. Flip those by 180° so every label on
// the wheel stays horizontal and equally readable, all at the same
// distance from the center.
function getReadableRotation(i) {
  const raw = (i + 0.5) * SEGMENT_ANGLE;
  const normalized = ((raw % 360) + 360) % 360;
  return normalized > 90 && normalized < 270 ? raw + 180 : raw;
}

// Keep every label visually the same weight: longer strings (like
// "THẮNG LỚN!") shrink slightly so no segment looks bigger or bolder
// than its neighbors.
function getLabelFontSize(label) {
  if (label.length > 10) return 7.5;
  if (label.length > 7) return 8.5;
  return 9.5;
}

export default function SpinWheel({ userAuth, onBack, showToast }) {
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [coins, setCoins] = useState(0);
  const wheelRef = useRef(null);

  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      w: (((i * 7 + 3) % 11) / 11) * 3 + 1,
      h: (((i * 13 + 5) % 11) / 11) * 3 + 1,
      top: ((i * 17 + 2) % 100),
      left: ((i * 23 + 7) % 100),
      opacity: (((i * 11 + 1) % 11) / 11) * 0.5 + 0.2,
      dur: (((i * 3 + 5) % 11) / 11) * 4 + 3,
      delay: (((i * 7 + 2) % 11) / 11) * 5,
    })), []
  );

  const load = useCallback(async () => {
    if (!userAuth?.token) { setLoading(false); return; }
    try {
      const [taskData, coinData] = await Promise.all([
        taskService.getTasks("DAILY").catch(() => ({ tasks: [] })),
        coinService.get().catch(() => ({ coins: 0 })),
      ]);
      const taskList = taskData?.tasks || [];
      setCoins(coinData?.coins || 0);

      const spinTask = taskList.find(t => t.code === "SPIN_WHEEL");
      if (spinTask) {
        setSpinsLeft(spinTask.spinsLeft ?? Math.max(0, spinTask.target - (spinTask.progress || 0)));
      } else {
        setSpinsLeft(0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userAuth]);

  useEffect(() => { load(); }, [load]);

  const handleSpin = async () => {
    if (spinning || spinsLeft <= 0) return;
    setSpinning(true);
    setResult(null);

    const winIndex = getWeightedRandomIndex();
    const seg = SEGMENTS[winIndex];

    const targetAngle = 360 - (winIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + fullSpins * 360 + targetAngle - (rotation % 360);

    setRotation(finalRotation);

    setTimeout(async () => {
      setSpinsLeft(0);
      setResult(seg);

      if (seg.coins > 0) {
        try {
          await coinService.add(seg.coins);
          setCoins(c => c + seg.coins);
          if (seg.jackpot) {
            showToast?.(`🏆 THẮNG LỚN! +${seg.coins} xu!`, "success");
          } else {
            showToast?.(`🎉 +${seg.coins} xu!`, "success");
          }
        } catch {
          showToast?.("Lỗi cập nhật xu", "error");
        }
      } else {
        showToast?.("Chúc bạn may mắn lần sau!", "info");
      }

      try {
        const res = await trackTaskEvent("SPIN", {});
        const spinTask = res?.completedTasks?.find(t => t.code === "SPIN_WHEEL");
        if (spinTask) {
          setSpinsLeft(spinTask.spinsLeft ?? Math.max(0, spinTask.target - (spinTask.progress || 0)));
        }
      } catch { /* ignore */ }

      setSpinning(false);
    }, 4500);
  };

  if (loading) return <Loader label="Đang tải..." />;

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎰</div>
          <p className="text-[#8A7C63] text-sm mb-4">Vui lòng đăng nhập để quay thưởng</p>
          <button onClick={onBack} className="px-6 py-2 rounded-xl bg-teal text-white font-semibold text-sm">← Quay lại</button>
        </div>
      </div>
    );
  }

  const wheelSize = 300;
  const cx = wheelSize / 2;
  const cy = wheelSize / 2;
  const r = wheelSize / 2 - 8;
  const outerSize = wheelSize + 40;

  return (
    <div
      className="flex-1 flex flex-col items-center overflow-y-auto relative"
      style={{
        background: "radial-gradient(circle at 30% 20%, #3A2A6A 0%, #1A0F3A 50%, #0B0620 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Hiệu ứng sao lấp lánh (tạo vài chấm nhỏ) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w + "px",
              height: s.h + "px",
              top: s.top + "%",
              left: s.left + "%",
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s infinite alternate`,
              animationDelay: s.delay + "s",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className="w-full flex items-center gap-3 px-4 py-3 relative z-10"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button onClick={onBack} className="text-white/60 hover:text-white text-lg transition">←</button>
        <span className="text-2xl">🎰</span>
        <span className="font-bold text-sm" style={{ color: "#F4B942", fontFamily: "Poppins, sans-serif" }}>
          Vòng Quay May Mắn
        </span>
        <div className="ml-auto flex items-center gap-2 font-mono text-xs">
          <span
            className="px-3 py-1 rounded-full flex items-center gap-1"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#F4B942",
              fontWeight: 600,
            }}
          >
            🪙 {coins.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Wheel */}
      <div className="flex flex-col items-center py-6 gap-4 relative z-10 w-full">
        <div className="relative" style={{ width: outerSize, height: outerSize }}>
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 40px rgba(244,185,66,0.3), 0 0 80px rgba(244,185,66,0.15)",
            }}
          />

          {/* Marquee rim lights - carnival bulbs chasing around the frame */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            {[...Array(RIM_LIGHT_COUNT)].map((_, i) => {
              const angle = (i / RIM_LIGHT_COUNT) * 360 - 90;
              const radius = outerSize / 2 - 5;
              const bx = outerSize / 2 + radius * Math.cos((angle * Math.PI) / 180);
              const by = outerSize / 2 + radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={`bulb-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    left: bx - 3,
                    top: by - 3,
                    background: i % 2 === 0 ? "#FFD700" : "#fff8dc",
                    boxShadow: "0 0 6px 2px rgba(255,215,0,0.65)",
                    animation: "bulbGlow 1.3s infinite",
                    animationDelay: `${(i % 8) * 0.16}s`,
                  }}
                />
              );
            })}
          </div>

          {/* Outer rim frame */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 12,
              border: "3px solid transparent",
              background:
                "linear-gradient(#1D2E4A, #1D2E4A) padding-box, linear-gradient(135deg, #F4B942, #E4572E) border-box",
              zIndex: 1,
            }}
          />

          {/* Pointer - đẹp hơn với bóng đổ */}
          <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -4 }}>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                borderTop: "30px solid #FFD700",
                filter: "drop-shadow(0 4px 8px rgba(255,215,0,0.6))",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 10,
                height: 10,
                left: "50%",
                top: -6,
                transform: "translateX(-50%)",
                background: "radial-gradient(circle at 35% 30%, #fff7d6, #FFD700 60%, #c98f00)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
              }}
            />
          </div>

          {/* SVG Wheel */}
          <svg
            ref={wheelRef}
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            className="absolute left-[20px] top-[20px]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4.5s cubic-bezier(0.12, 0.67, 0.1, 1)" : "none",
              filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))",
              zIndex: 2,
            }}
          >
            <defs>
              {SEGMENTS.map((seg, i) => (
                <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={seg.color} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={seg.color} stopOpacity="0.65" />
                </linearGradient>
              ))}
              <linearGradient id="centerStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4B942" />
                <stop offset="100%" stopColor="#E4572E" />
              </linearGradient>
              <radialGradient id="hubFill" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#33456b" />
                <stop offset="100%" stopColor="#1D2E4A" />
              </radialGradient>
            </defs>

            {/* Outer decorative ring */}
            <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="url(#centerStroke)" strokeWidth="2" opacity="0.8" />

            {SEGMENTS.map((seg, i) => {
              const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const x1 = cx + r * Math.cos(startAngle);
              const y1 = cy + r * Math.sin(startAngle);
              const x2 = cx + r * Math.cos(endAngle);
              const y2 = cy + r * Math.sin(endAngle);
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
              const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const iconR = r * 0.58;
              const textR = r * 0.78;
              const ix = cx + iconR * Math.cos(midAngle);
              const iy = cy + iconR * Math.sin(midAngle);
              const tx = cx + textR * Math.cos(midAngle);
              const ty = cy + textR * Math.sin(midAngle);
              const labelRotation = getReadableRotation(i);

              return (
                <g key={seg.id}>
                  <path
                    d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={`url(#grad-${i})`}
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="2"
                  />
                  <text
                    x={ix}
                    y={iy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${labelRotation}, ${ix}, ${iy})`}
                    fontSize="15"
                    style={{ textShadow: "0 2px 6px rgba(0,0,0,0.4)" }}
                  >
                    {seg.icon}
                  </text>
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${labelRotation}, ${tx}, ${ty})`}
                    fill="#fff"
                    fontSize={getLabelFontSize(seg.label)}
                    fontWeight="700"
                    fontFamily="Poppins, sans-serif"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.55)" }}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}

            {/* Glass sheen for depth */}
            <ellipse
              cx={cx - r * 0.18}
              cy={cy - r * 0.38}
              rx={r * 0.55}
              ry={r * 0.22}
              fill="rgba(255,255,255,0.12)"
            />

            {/* Center hub – đẹp hơn với gradient và bóng bóng */}
            <circle cx={cx} cy={cy} r={34} fill="url(#hubFill)" stroke="url(#centerStroke)" strokeWidth="5" />
            <circle cx={cx - 8} cy={cy - 10} r={10} fill="rgba(255,255,255,0.15)" />
            <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle" fill="#F4B942" fontSize="12" fontWeight="800" fontFamily="Poppins, sans-serif">
              QUAY
            </text>
          </svg>
        </div>

        {/* Spin button - có hiệu ứng pulse */}
        <button
          onClick={handleSpin}
          disabled={spinning || spinsLeft <= 0}
          className={`
            font-bold text-lg px-12 py-4 rounded-full text-white
            transition-all duration-200 active:scale-95
            ${spinning || spinsLeft <= 0 ? "opacity-40 cursor-not-allowed" : "animate-pulse-glow"}
          `}
          style={{
            background: "linear-gradient(135deg, #F4B942, #E4572E)",
            boxShadow: spinning || spinsLeft <= 0 ? "none" : "0 8px 20px rgba(228,87,46,0.4)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {spinning ? "🌀 Đang quay..." : spinsLeft > 0 ? "🎡 QUAY NGAY!" : "⛔ Hết lượt"}
        </button>

        {/* Info cards */}
        <div className="text-center space-y-3 mt-2 w-full max-w-xs px-4">
          {spinsLeft > 0 ? (
            <div
              className="px-5 py-3 rounded-2xl text-sm backdrop-blur-md"
              style={{
                background: "rgba(74,222,128,0.10)",
                border: "1px solid rgba(74,222,128,0.25)",
                color: "#4ade80",
                boxShadow: "0 4px 12px rgba(74,222,128,0.08)",
              }}
            >
              ✅ Bạn có <strong>{spinsLeft} lượt</strong> quay hôm nay!
            </div>
          ) : (
            <div
              className="px-5 py-3 rounded-2xl text-sm backdrop-blur-md"
              style={{
                background: "rgba(251,191,36,0.10)",
                border: "1px solid rgba(251,191,36,0.25)",
                color: "#fbbf24",
                boxShadow: "0 4px 12px rgba(251,191,36,0.08)",
              }}
            >
              ⛔ Hết lượt quay — quay lại ngày mai!
            </div>
          )}
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            🏆 PLAY_23 — Thắng lớn +100 xu (cực hiếm!)
          </div>
        </div>

        {/* Result popup - đẹp hơn với blur và hiệu ứng bật */}
        {result && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
            onClick={() => setResult(null)}
          >
            <div
              className="rounded-3xl p-8 text-center max-w-sm mx-4 transform transition-all duration-300 scale-100 opacity-100"
              style={{
                background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                animation: "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">{result.icon}</div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: "#20283A", fontFamily: "Poppins, sans-serif" }}
              >
                {result.jackpot ? "🏆 THẮNG LỚN!" : result.coins > 0 ? "🎉 Chúc mừng!" : "🍀 Chúc may mắn!"}
              </h3>
              <p
                className="text-xl font-bold mb-1"
                style={{ color: result.color, fontFamily: "JetBrains Mono, monospace" }}
              >
                {result.label}
              </p>
              {result.coins > 0 && (
                <p className="text-sm mb-5" style={{ color: "#888" }}>
                  +{result.coins} xu đã được cộng vào tài khoản
                </p>
              )}
              <button
                onClick={() => setResult(null)}
                className="px-8 py-3 rounded-full text-white font-semibold text-sm transition hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1B998B, #0F6E63)",
                  boxShadow: "0 4px 12px rgba(27,153,139,0.4)",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inject keyframe animations into document */}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(244,185,66,0.6); }
          70% { box-shadow: 0 0 0 15px rgba(244,185,66,0); }
          100% { box-shadow: 0 0 0 0 rgba(244,185,66,0); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s infinite;
        }
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bulbGlow {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}