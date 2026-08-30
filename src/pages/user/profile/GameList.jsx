import GameCard from "./GameCard.jsx";

export default function GameList({ games }) {
  return (
    <div>
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 flex items-center gap-2">
        <span>🎮</span>
        <span>Trò chơi</span>
        <span className="text-sm font-mono font-normal" style={{ color: "var(--muted)" }}>({games.length})</span>
      </h2>

      {games.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {games.map((g) => (
            <GameCard key={g.gameId} game={g} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl p-10 text-center" style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
          <div className="text-5xl mb-3">🎲</div>
          <h3 className="font-display text-base text-ink mb-1">Chưa có game nào</h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Hãy bắt đầu chơi để tích lũy kinh nghiệm!</p>
        </div>
      )}
    </div>
  );
}
