export default function LevelBar({ level, lv, coins, stars }) {
  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Level badge */}
        <div className="text-center shrink-0">
          <div className="text-4xl sm:text-5xl mb-1">{level >= 10 ? "👑" : level >= 5 ? "⭐" : "🌱"}</div>
          <div className="font-display text-2xl sm:text-3xl text-ink">{lv.level}</div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Level {lv.level}</div>
        </div>

        {/* Progress + currency */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{lv.current} / {lv.next} XP</span>
            <span className="text-xs font-mono font-semibold" style={{ color: "var(--accent)" }}>{lv.percent}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: lv.percent + "%", background: "linear-gradient(90deg, var(--accent), var(--purple, #8b5cf6))" }}
            />
          </div>

          {/* Currency pills */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors" style={{ background: "var(--bg)" }}>
              <span className="text-base">💰</span>
              <span className="font-display text-sm font-bold text-ink">{(coins || 0).toLocaleString()}</span>
              <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Xu</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-colors" style={{ background: "var(--bg)" }}>
              <span className="text-base">⭐</span>
              <span className="font-display text-sm font-bold" style={{ color: "#d97706" }}>{(stars || 0).toLocaleString()}</span>
              <span className="text-[10px] font-mono" style={{ color: "var(--muted)" }}>Sao</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
