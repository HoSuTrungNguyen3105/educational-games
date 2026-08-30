const CARDS = [
  { key: "plays", icon: "🎮", label: "Lượt chơi", color: "var(--accent)" },
  { key: "games", icon: "📚", label: "Game đã chơi", color: "var(--purple, #8b5cf6)" },
  { key: "xp", icon: "✨", label: "Tổng XP", color: "#d97706" },
];

export default function StatsGrid({ stats }) {
  const values = {
    plays: stats.totalPlays,
    games: stats.gamesPlayed,
    xp: stats.totalXP,
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {CARDS.map((c) => (
        <div
          key={c.key}
          className="relative overflow-hidden rounded-2xl p-4 sm:p-5 text-center group hover:-translate-y-0.5 transition-transform duration-200"
          style={{ background: "var(--card)", border: "1px solid var(--line)" }}
        >
          <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" style={{ background: `linear-gradient(135deg, ${c.color}, transparent)` }} />
          <div className="relative">
            <div className="text-2xl sm:text-3xl mb-1">{c.icon}</div>
            <div className="font-display text-xl sm:text-2xl" style={{ color: c.color }}>{values[c.key]}</div>
            <div className="text-[10px] sm:text-xs font-mono mt-1" style={{ color: "var(--muted)" }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
