export function PlayHeader({ icon, title, accent, code, progressLabel, timeLeft, timeColor, score, onQuit, extra }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-3 bg-white border-b border-ink/10 flex-wrap">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <h1 className="font-display text-xl" style={{ color: accent }}>{title}</h1>
      </div>
      <div className="flex items-center gap-5 text-sm text-ink/70 font-body flex-wrap">
        {code && <span>Phòng: <b className="text-ink font-mono">{code}</b></span>}
        {progressLabel && <span>📋 {progressLabel}</span>}
        {timeLeft !== undefined && <span style={{ color: timeColor }}>⏱ {timeLeft}s</span>}
        {score !== undefined && <span>⭐ Điểm: {score}</span>}
        {extra}
      </div>
      <button onClick={onQuit} className="font-display text-sm border rounded-2xl px-4 py-2 hover:opacity-80 transition" style={{ color: accent, borderColor: accent + "66" }}>Thoát</button>
    </div>
  );
}

export function AnswerExplain({ q }) {
  if (!q || !q.explanation) return null;
  return (
    <div className="mt-4 text-sm text-ink/80 bg-gold/15 border border-gold/40 rounded-2xl px-4 py-3">
      <span className="font-semibold text-[#8a6a10]">💡 Giải thích:</span> {q.explanation}
    </div>
  );
}

export function timerColor(pct) {
  return pct > 50 ? "#4CAF7D" : pct > 20 ? "#F4B942" : "#E4572E";
}