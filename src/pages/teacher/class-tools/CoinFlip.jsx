import { useEffect, useRef, useState } from "react";
import { Coins } from "lucide-react";

/**
 * CoinFlip — tung đồng xu SẤP / NGỬA với hiệu ứng lật 3D (CSS rotateY),
 * kèm thống kê số lần mỗi mặt và nút Đặt lại. State nội bộ.
 */

const FLIP_MS = 900;

export default function CoinFlip() {
  const [face, setFace] = useState("sap"); // "sap" | "ngua"
  const [flipping, setFlipping] = useState(false);
  const [pending, setPending] = useState(null); // mặt đích của lượt đang lật
  const [stats, setStats] = useState({ sap: 0, ngua: 0 });
  const [spinKey, setSpinKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const flip = () => {
    if (flipping) return;
    const result = Math.random() < 0.5 ? "sap" : "ngua";
    setPending(result);
    setFlipping(true);
    setSpinKey((k) => k + 1);
    timerRef.current = setTimeout(() => {
      setFace(result);
      setPending(null);
      setStats((s) => ({ ...s, [result]: s[result] + 1 }));
      setFlipping(false);
    }, FLIP_MS);
  };

  // Góc nghỉ của mặt hiện tại: sấp = 0°, ngửa = 180°. Trong lúc lật,
  // animation quay 3 vòng (1080°) cộng thêm 180° nếu mặt đích khác mặt
  // hiện tại — nên góc cuối của animation ≡ góc nghỉ của mặt đích,
  // chốt không bị giật hình.
  const restRotation = face === "sap" ? 0 : 180;
  const extraRotation = flipping && pending && pending !== face ? 180 : 0;

  return (
    <section className="bg-white rounded-3xl border border-ink/10 shadow-sm p-4 flex flex-col gap-3">
      <style>{`
        @keyframes ct-coin-spin {
          from { transform: rotateY(var(--ct-from, 0deg)); }
          to { transform: rotateY(calc(var(--ct-from, 0deg) + 1080deg + var(--ct-extra, 0deg))); }
        }
      `}</style>
      <div>
        <h3 className="font-display font-bold text-ink flex items-center gap-2">
          <span className="w-7 h-7 grid place-items-center rounded-lg bg-amber-500 text-white"><Coins className="w-4 h-4" /></span>
          Tung đồng xu (Sấp / Ngửa)
        </h3>
        <p className="text-xs text-ink/50 mt-1">Lật 3D, thống kê số lần ra mỗi mặt</p>
      </div>

      <div className="rounded-2xl bg-paper2/70 min-h-[120px] flex items-center justify-center py-4" style={{ perspective: "600px" }}>
        <div
          key={spinKey}
          className="relative w-20 h-20 sm:w-24 sm:h-24"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${restRotation}deg)`,
            animation: flipping ? `ct-coin-spin ${FLIP_MS}ms cubic-bezier(0.2, 0.7, 0.3, 1) forwards` : undefined,
            "--ct-from": `${restRotation}deg`,
            "--ct-extra": `${extraRotation}deg`,
          }}
        >
          {[
            { key: "sap", label: "SẤP", rotate: 0, cls: "from-amber-300 to-yellow-500 text-amber-900" },
            { key: "ngua", label: "NGỬA", rotate: 180, cls: "from-yellow-200 to-amber-400 text-amber-900" },
          ].map((side) => (
            <div
              key={side.key}
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${side.cls} border-4 border-amber-600/50 shadow-lg grid place-items-center font-display font-bold text-sm sm:text-base tracking-wide`}
              style={{ backfaceVisibility: "hidden", transform: `rotateY(${side.rotate}deg)` }}
            >
              {side.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-ink/60">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" /> Sấp <b className="text-ink">{stats.sap}</b>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 ml-3 mr-1" /> Ngửa <b className="text-ink">{stats.ngua}</b>
          <button type="button" onClick={() => setStats({ sap: 0, ngua: 0 })}
            className="ml-3 text-xs font-semibold text-ink/45 underline hover:text-ink">Đặt lại</button>
        </p>
        <button type="button" onClick={flip} disabled={flipping}
          className="font-display font-semibold text-sm rounded-2xl px-4 py-2.5 bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98] transition disabled:opacity-40 shadow-[0_3px_0_rgba(0,0,0,0.18)]">
          {flipping ? "Đang tung…" : "Tung đồng xu"}
        </button>
      </div>
    </section>
  );
}
