import { useCallback, useEffect, useMemo, useState } from 'react'
import { gameService } from '../../services/api.js'
import { mockGameTemplates } from '../../data/mockData.js'
import { StampToken, StatusBadge, IconButton, Loader, ErrorState, EmptyState, PrimaryButton } from '../../components/ui.jsx'

export function GameCard({ game, onEdit, onResults, onDuplicate, onDelete, onShare, onLive, onDesign }) {
  const tpl = mockGameTemplates.find(t => t.id === game.template);
  return (
    <div className="note-card p-5 flex flex-col gap-3 anim-pop hover:-translate-y-0.5 transition shadow-[0_2px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between">
        <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#1D2E4A"} size={44} fontSize={20} />
        <StatusBadge status={game.status} />
      </div>
      <div>
        <h3 className="font-display text-lg text-ink leading-snug clamp-2">{game.title}</h3>
        <p className="text-sm text-[#8A7C63] mt-1 clamp-2">{game.description}</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-[#8A7C63] font-mono flex-wrap">
        <span>{game.subject}</span><span>·</span><span>{tpl ? tpl.categoryLabel : ""}</span><span>·</span><span>{game.questionsCount} câu hỏi</span><span>·</span><span>{game.playersCount} lượt chơi</span>
      </div>
      <hr className="dash-rule my-1" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <IconButton title="Chỉnh sửa" onClick={onEdit}>✏️</IconButton>
          {onDesign && <IconButton title="Thiết kế giao diện (Game Builder)" onClick={onDesign}>🎨</IconButton>}
          {onDuplicate && <IconButton title="Sao chép" onClick={onDuplicate}>📄</IconButton>}
          {onShare && game.status === "published" && <IconButton title="Chia sẻ" onClick={onShare}>🎟️</IconButton>}
          {onDelete && <IconButton title="Xóa" onClick={onDelete}>🗑️</IconButton>}
        </div>
        <div className="flex items-center gap-2">
          {onLive && game.status === "published" && (
            <button onClick={onLive} className="text-sm font-semibold text-teal hover:underline" title="Phát trực tiếp cho học sinh">
              Phát trực tiếp ▶
            </button>
          )}
          <button onClick={onResults} className="text-sm font-semibold text-ticket hover:underline">Kết quả →</button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard({ user, onOpenLibrary, onCreate, onEdit, onResults, onDesign }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => { setGames(null); setError(null); gameService.list().then(setGames).catch(e => setError(e.message)); }, []);
  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    if (!games) return null;
    const published = games.filter(g => g.status === "published").length;
    const drafts = games.filter(g => g.status === "draft").length;
    const players = games.reduce((s, g) => s + g.playersCount, 0);
    return { total: games.length, published, drafts, players };
  }, [games]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#8A7C63] text-sm font-mono">Xin chào,</p>
        <h1 className="font-display text-3xl text-ink">{user ? user.name : "Giáo viên"} 👋</h1>
      </div>

      {error && <ErrorState subtitle="Không thể tải dữ liệu Dashboard." onRetry={load} />}
      {!error && !games && <Loader label="Đang tải dashboard..." />}

      {!error && games && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Tổng trò chơi", value: stats.total, icon: "🎟️", ring: "#1D2E4A" },
              { label: "Đã xuất bản", value: stats.published, icon: "✅", ring: "#1B998B" },
              { label: "Bản nháp", value: stats.drafts, icon: "✏️", ring: "#F4B942" },
              { label: "Lượt chơi", value: stats.players, icon: "🎮", ring: "#FF6F91" },
            ].map(s => (
              <div key={s.label} className="note-card p-5">
                <StampToken icon={s.icon} ring={s.ring} size={40} fontSize={18} />
                <div className="font-display text-2xl text-ink mt-3">{s.value}</div>
                <div className="text-xs text-[#8A7C63] font-mono uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-ink">Trò chơi gần đây</h2>
              <button onClick={onOpenLibrary} className="text-sm text-ticket font-semibold hover:underline">Xem tất cả →</button>
            </div>
            {games.length === 0 ? (
              <EmptyState icon="🎲" title="Chưa có trò chơi nào" subtitle="Tạo trò chơi đầu tiên để bắt đầu ôn tập cùng học sinh."
                action={<PrimaryButton onClick={onCreate} className="mt-2">+ Tạo trò chơi</PrimaryButton>} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {games.slice(0, 3).map(g => <GameCard key={g.id} game={g} onEdit={() => onEdit(g.id)} onResults={() => onResults(g.id)} onDesign={() => onDesign(g.id)} />)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}