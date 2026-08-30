import { useState, useEffect, useCallback, useRef } from "react";
import { coinService } from "../../services/api.js";
import { taskService } from "../../services/taskService.js";
import { Loader } from "../../components/ui.jsx";

const SEGMENTS = [
  { id: "coin_5", label: "+5 Xu", coins: 5, color: "#4ade80", icon: "🪙", weight: 25 },
  { id: "coin_10", label: "+10 Xu", coins: 10, color: "#38bdf8", icon: "💰", weight: 20 },
  { id: "coin_15", label: "+15 Xu", coins: 15, color: "#a78bfa", icon: "💎", weight: 15 },
  { id: "coin_20", label: "+20 Xu", coins: 20, color: "#f472b6", icon: "🎁", weight: 12 },
  { id: "coin_30", label: "+30 Xu", coins: 30, color: "#fbbf24", icon: "👑", weight: 8 },
  { id: "coin_50", label: "+50 Xu", coins: 50, color: "#f97316", icon: "🌟", weight: 5 },
  { id: "play_23", label: "THẮNG LỚN! 🎉", coins: 100, color: "#ef4444", icon: "🏆", weight: 1, jackpot: true },
  { id: "coin_0", label: "Chúc may mắn!", coins: 0, color: "#6b7280", icon: "🍀", weight: 14 },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

function getWeightedRandomIndex() {
  const totalWeight = SEGMENTS.reduce((s, seg) => s + seg.weight, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < SEGMENTS.length; i++) {
    r -= SEGMENTS[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

export default function SpinWheel({ userAuth, onBack, showToast }) {
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [spinsLeft, setSpinsLeft] = useState(0);
  const [loginClaimed, setLoginClaimed] = useState(false);
  const [coins, setCoins] = useState(0);
  const [tasks, setTasks] = useState([]);
  const wheelRef = useRef(null);

  const load = useCallback(async () => {
    if (!userAuth?.token) { setLoading(false); return; }
    try {
      const [taskData, coinData] = await Promise.all([
        taskService.getTasks("DAILY").catch(() => ({ tasks: [] })),
        coinService.get().catch(() => ({ coins: 0 })),
      ]);
      const taskList = taskData?.tasks || [];
      setTasks(taskList);
      setCoins(coinData?.coins || 0);

      const loginTask = taskList.find(t => t.code === "LOGIN_1");
      const claimed = loginTask?.claimedCount > 0 || loginTask?.completedCount >= loginTask?.target;
      setLoginClaimed(claimed);
      setSpinsLeft(claimed ? 1 : 0);
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

    // Calculate rotation: multiple full spins + land on segment
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

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto" style={{ background: "radial-gradient(120% 140% at 50% 0%, #2A1F52 0%, #17102F 55%, #120C24 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="w-full flex items-center gap-3 px-4 py-3" style={{ background: "rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={onBack} className="text-white/60 hover:text-white text-lg">←</button>
        <span className="text-lg" style={{ fontSize: 26 }}>🎰</span>
        <span className="font-bold text-sm" style={{ color: "#F4B942", fontFamily: "Poppins, sans-serif" }}>Vòng Quay May Mắn</span>
        <div className="ml-auto flex items-center gap-2 font-mono text-xs text-white/50">
          <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>🪙 {coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Wheel */}
      <div className="flex flex-col items-center py-6 gap-4">
        <div className="relative" style={{ width: wheelSize + 20, height: wheelSize + 20 }}>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 10px rgba(244,185,66,0.1), 0 0 60px rgba(244,185,66,0.25)" }} />

          {/* Pointer */}
          <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -2 }}>
            <div style={{ width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "24px solid #F4B942" }} />
          </div>

          {/* SVG Wheel */}
          <svg
            ref={wheelRef}
            width={wheelSize}
            height={wheelSize}
            viewBox={`0 0 ${wheelSize} ${wheelSize}`}
            className="absolute left-[10px] top-[10px]"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 4.5s cubic-bezier(0.12, 0.67, 0.1, 1)" : "none",
            }}
          >
            {SEGMENTS.map((seg, i) => {
              const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const x1 = cx + r * Math.cos(startAngle);
              const y1 = cy + r * Math.sin(startAngle);
              const x2 = cx + r * Math.cos(endAngle);
              const y2 = cy + r * Math.sin(endAngle);
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
              const midAngle = ((i + 0.5) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
              const textR = r * 0.62;
              const tx = cx + textR * Math.cos(midAngle);
              const ty = cy + textR * Math.sin(midAngle);

              return (
                <g key={seg.id}>
                  <path
                    d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={seg.color}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="1"
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i + 0.5) * SEGMENT_ANGLE}, ${tx}, ${ty})`}
                    fill="#fff"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Poppins, sans-serif"
                  >
                    {seg.icon}
                  </text>
                  <text
                    x={tx}
                    y={ty + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i + 0.5) * SEGMENT_ANGLE}, ${tx}, ${ty + 14})`}
                    fill="#fff"
                    fontSize="8"
                    fontWeight="600"
                    fontFamily="Poppins, sans-serif"
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx={cx} cy={cy} r={30} fill="#1D2E4A" stroke="#F4B942" strokeWidth="4" />
            <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#F4B942" fontSize="11" fontWeight="700" fontFamily="Fredoka, sans-serif">
              QUAY
            </text>
          </svg>
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={spinning || spinsLeft <= 0}
          className="font-bold text-base px-10 py-3 rounded-full text-white transition-all active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(180deg, #F4B942, #E4572E)",
            boxShadow: spinning || spinsLeft <= 0 ? "none" : "0 5px 0 rgba(0,0,0,0.35)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {spinning ? "Đang quay..." : spinsLeft > 0 ? "QUAY NGAY!" : "Không còn lượt"}
        </button>

        {/* Info */}
        <div className="text-center space-y-2 mt-2">
          {!loginClaimed ? (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
              👋 Hoàn thành nhiệm vụ "Đăng nhập hôm nay" (LOGIN_1) để nhận 1 lượt quay
            </div>
          ) : (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
              ✅ Bạn có {spinsLeft} lượt quay hôm nay!
            </div>
          )}
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            🏆 PLAY_23 — Thắng lớn +100 xu (cực hiếm!)
          </div>
        </div>

        {/* Result popup */}
        {result && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.6)" }}>
            <div className="rounded-2xl p-8 text-center max-w-sm mx-4 animate-[fadeIn_0.3s_ease]" style={{ background: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }}>
              <div className="text-5xl mb-3">{result.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#20283A", fontFamily: "Poppins, sans-serif" }}>
                {result.jackpot ? "🏆 THẮNG LỚN!" : result.coins > 0 ? "🎉 Chúc mừng!" : "🍀 Chúc may mắn!"}
              </h3>
              <p className="text-lg font-bold mb-1" style={{ color: result.color, fontFamily: "JetBrains Mono, monospace" }}>
                {result.label}
              </p>
              {result.coins > 0 && (
                <p className="text-sm mb-4" style={{ color: "#888" }}>+{result.coins} xu đã được cộng vào tài khoản</p>
              )}
              <button
                onClick={() => setResult(null)}
                className="px-6 py-2 rounded-xl text-white font-semibold text-sm"
                style={{ background: "#1B998B" }}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}