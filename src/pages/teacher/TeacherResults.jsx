import { useCallback, useEffect, useState } from 'react'
import { gameService, resultService } from '../../services/api.js'
import { StampToken, StatusBadge, Loader, ErrorState, EmptyState } from '../../components/ui.jsx'
import { rankMedal } from '../../lib/utils.js'

export default function TeacherResults({ gameId, onBack }) {
  const [game, setGame] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setResults(null); setError(null);
    Promise.all([gameService.get(gameId), resultService.listByGame(gameId)]).then(([g, r]) => { setGame(g); setResults(r); }).catch(e => setError(e.message || "Lỗi tải kết quả"));
  }, [gameId]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink">← Thư viện trò chơi</button>
      {error && <ErrorState onRetry={load} subtitle="Không thể tải kết quả trò chơi." />}
      {!error && !results && <Loader label="Đang tải kết quả..." />}
      {!error && results && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-display text-3xl text-ink">{game ? game.name : "Kết quả"}</h1>
            <StatusBadge status={game ? game.status : "draft"} />
          </div>
          {results.length === 0 ? (
            <EmptyState icon="📊" title="Chưa có lượt chơi nào" subtitle="Chia sẻ mã vé trò chơi để học sinh tham gia và bạn sẽ thấy kết quả tại đây." />
          ) : (
            <LeaderboardTable results={results} />
          )}
        </>
      )}
    </div>
  );
}

export function LeaderboardTable({ results }) {
  return (
    <div className="note-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[#8A7C63] font-mono text-xs uppercase border-b border-ink/10">
            <th className="px-5 py-3">Hạng</th><th className="px-5 py-3">Học sinh</th><th className="px-5 py-3">Điểm</th>
            <th className="px-5 py-3">Độ chính xác</th><th className="px-5 py-3 hidden sm:table-cell">Thời gian hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const medal = rankMedal(i + 1);
            return (
              <tr key={r.id} className="border-b border-ink/5 last:border-0">
                <td className="px-5 py-3"><StampToken icon={medal.icon} ring={medal.ring} size={34} fontSize={i < 3 ? 16 : 13} /></td>
                <td className="px-5 py-3 font-body text-ink">{r.playerName}</td>
                <td className="px-5 py-3 font-display text-ink">{r.score}</td>
                <td className="px-5 py-3 text-[#8A7C63]">{r.correctAnswers}/{r.totalQuestions} ({r.accuracy}%)</td>
                <td className="px-5 py-3 hidden sm:table-cell text-[#8A7C63] font-mono">{r.completionTime}s</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}