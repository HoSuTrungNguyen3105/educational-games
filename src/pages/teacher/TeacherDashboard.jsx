import { useCallback, useEffect, useState } from 'react'
import { gameService, statsService } from '../../services/api.js'
import { useTemplates } from '../../lib/hooks.js'
import { StampToken, StatusBadge, IconButton, Loader, ErrorState, EmptyState, PrimaryButton, GhostButton, Modal, TicketStub } from '../../components/ui.jsx'
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'

/* eslint-disable react-hooks/set-state-in-effect */

export function GameCard({ game, onEdit, onResults, onDuplicate, onDelete, onShare, onLive, onDesign, onHtmlTemplate }) {
  const templates = useTemplates();
  const tpl = templates.find(t => t.id === game.template);
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
          {onHtmlTemplate && <IconButton title="Cập nhật HTML Template" onClick={onHtmlTemplate}>📝</IconButton>}
          {/* {onDuplicate && <IconButton title="Sao chép" onClick={onDuplicate}>📄</IconButton>} */}
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

export default function TeacherDashboard({ user, onOpenLibrary, onCreate, onEdit, onResults, onDesign, showToast }) {
  const [games, setGames] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [shareGame, setShareGame] = useState(null);

  const load = useCallback(() => {
    setGames(null); setStats(null); setError(null);
    Promise.all([statsService.get(), gameService.list()])
      .then(([s, g]) => { setStats(s); setGames(g); })
      .catch(e => setError(e.message || "Lỗi tải dữ liệu Dashboard"));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleLive = (g) => {
    if (!socket.connected) {
      showToast("Chưa kết nối realtime. Kiểm tra VITE_SOCKET_URL hoặc backend Socket.IO.", "error");
      return;
    }
    socket.emit(SOCKET_EVENTS.JOIN_CLASSROOM, { gameId: g.id });
    socket.emit(SOCKET_EVENTS.START_GAME, { gameId: g.id });
    showToast(`Đã phát trực tiếp "${g.title}" — học sinh nhập mã ${g.code}`, "success");
  };

  const t = stats || { totals: {}, activity: [], topPlayers: [], topGames: [], subjects: [], attention: { drafts: [], neverPlayed: [] } };
  const draftGames = (stats ? stats.attention.drafts : []).map(d => ({ ...d, raw: games?.find(g => g.id === d.id) }));
  const neverPlayedGames = (stats ? stats.attention.neverPlayed : []).map(n => ({ ...n, raw: games?.find(g => g.id === n.id) }));

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
              { label: "Tổng trò chơi", value: t.totals.games, icon: "🎟️", ring: "#1D2E4A" },
              { label: "Đã xuất bản", value: t.totals.published, icon: "✅", ring: "#1B998B" },
              { label: "Bản nháp", value: t.totals.drafts, icon: "✏️", ring: "#F4B942" },
              { label: "Lượt chơi đã chơi", value: t.totals.plays, icon: "🎮", ring: "#FF6F91" },
              { label: "Học sinh đã tham gia", value: t.totals.players, icon: "👥", ring: "#7C6FF1" },
              { label: "Học sinh trong hệ thống", value: t.totals.students, icon: "🏫", ring: "#38BDF8" },
              { label: "Điểm trung bình", value: t.totals.avgScore, icon: "🎯", ring: "#F4B942" },
              { label: "Độ chính xác TB", value: `${t.totals.avgAccuracy ?? 0}%`, icon: "📊", ring: "#10B981" },
            ].map(s => (
              <div key={s.label} className="note-card p-5">
                <StampToken icon={s.icon} ring={s.ring} size={40} fontSize={18} />
                <div className="font-display text-2xl text-ink mt-3">{s.value ?? 0}</div>
                <div className="text-xs text-[#8A7C63] font-mono uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {(draftGames.length > 0 || neverPlayedGames.length > 0) && (
            <section className="note-card p-5 bg-paper2 border-l-4 border-l-ticket">
              <h2 className="font-display text-lg text-ink mb-4">✅ Việc cần làm</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-mono text-[#8A7C63] uppercase mb-3">✏️ Bản nháp chưa xuất bản ({draftGames.length})</h4>
                  {draftGames.length === 0 ? (
                    <p className="text-sm text-[#8A7C63]">Không có bản nháp nào tồn đọng. 👏</p>
                  ) : (
                    <ul className="space-y-2">
                      {draftGames.map(d => (
                        <li key={d.id} className="flex items-center justify-between gap-3 bg-paper rounded-xl px-3 py-2">
                          <span className="text-sm font-body text-ink truncate">{d.title}</span>
                          <button onClick={() => onEdit(d.id)} className="text-xs font-semibold text-ticket hover:underline shrink-0">Chỉnh sửa →</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-mono text-[#8A7C63] uppercase mb-3">🚀 Đã xuất bản nhưng chưa có lượt chơi ({neverPlayedGames.length})</h4>
                  {neverPlayedGames.length === 0 ? (
                    <p className="text-sm text-[#8A7C63]">Tất cả đã có học sinh chơi. 🎉</p>
                  ) : (
                    <ul className="space-y-2">
                      {neverPlayedGames.map(n => (
                        <li key={n.id} className="flex items-center justify-between gap-3 bg-paper rounded-xl px-3 py-2">
                          <span className="text-sm font-body text-ink truncate">{n.title}</span>
                          <button onClick={() => handleLive(n.raw)} className="text-xs font-semibold text-teal hover:underline shrink-0">Phát trực tiếp ▶</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="grid lg:grid-cols-2 gap-5">
            <ActivityChart data={t.activity} />
            <TopPlayers data={t.topPlayers} />
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <TopGames data={t.topGames} onResults={onResults} onLive={handleLive} />
            <SubjectBreakdown data={t.subjects} onCreate={onCreate} />
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
                {games.slice(0, 3).map(g => <GameCard key={g.id} game={g} onEdit={() => onEdit(g.id)} onResults={() => onResults(g.id)} onDesign={() => onDesign(g.id)} onLive={() => handleLive(g)} onShare={() => setShareGame(g)} />)}
              </div>
            )}
          </div>
        </>
      )}

      {shareGame && (
        <Modal onClose={() => setShareGame(null)}>
          <h3 className="font-display text-xl text-ink mb-2">Vé mời "{shareGame.title}"</h3>
          <p className="text-sm text-[#8A7C63] mb-4">Học sinh nhập mã vé sau tại màn hình "Tham gia trò chơi":</p>
          <TicketStub icon="🎟️" code={shareGame.code} notchBg="#FFFBF2" />
          <div className="flex justify-end gap-3 mt-6">
            <GhostButton onClick={() => setShareGame(null)}>Đóng</GhostButton>
            <PrimaryButton onClick={() => { handleLive(shareGame); setShareGame(null); }}>Phát trực tiếp ▶</PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ActivityChart({ data }) {
  const max = Math.max(1, ...(data || []).map(d => d.count));
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  return (
    <section className="note-card p-5">
      <h2 className="font-display text-lg text-ink mb-4">📈 Hoạt động 7 ngày gần nhất</h2>
      {!data || data.every(d => d.count === 0) ? (
        <p className="text-sm text-[#8A7C63]">Chưa có lượt chơi nào trong tuần này. Học sinh chơi xong bạn sẽ thấy số liệu tại đây.</p>
      ) : (
        <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-40">
          {data.map(d => {
            const date = new Date(`${d.date}T00:00:00`);
            const label = days[date.getDay()];
            const h = d.count ? Math.max(10, Math.round((d.count / max) * 100)) : 4;
            return (
              <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[10px] font-mono text-[#8A7C63]">{d.count || ""}</span>
                <div className="w-full max-w-10 bg-gradient-to-t from-ticket to-orange-300 rounded-t-md transition-all duration-500 anim-pop"
                  style={{ height: `${h}px` }} title={d.date}></div>
                <span className="text-[10px] font-mono text-[#8A7C63]">{label}</span>
                <span className="text-[9px] font-mono text-[#B7A987] hidden sm:block">{d.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TopPlayers({ data }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <section className="note-card p-5">
      <h2 className="font-display text-lg text-ink mb-4">🏆 Học sinh xuất sắc</h2>
      {!data || data.length === 0 ? (
        <p className="text-sm text-[#8A7C63]">Chưa có lượt chơi nào để xếp hạng.</p>
      ) : (
        <div className="space-y-2">
          {data.map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink/5 transition">
              <span className="text-xl w-8 text-center shrink-0">{medals[i] || `${i + 1}.`}</span>
              <span className="flex-1 min-w-0 text-sm font-body text-ink truncate">{p.name}</span>
              <span className="text-xs text-[#8A7C63] font-mono">{p.games} trận · {p.accuracy}%</span>
              <span className="font-display text-ink font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TopGames({ data, onResults, onLive }) {
  return (
    <section className="note-card p-5">
      <h2 className="font-display text-lg text-ink mb-4">🎮 Trò chơi được chơi nhiều nhất</h2>
      {!data || data.length === 0 || data.every(g => g.playedCount === 0) ? (
        <p className="text-sm text-[#8A7C63]">Chưa có lượt chơi nào.</p>
      ) : (
        <div className="space-y-2">
          {data.filter(g => g.playedCount > 0).map((g, i) => (
            <div key={g.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink/5 transition">
              <span className="font-display text-lg text-[#B7A987] w-6 text-center shrink-0">{i + 1}</span>
              <span className="flex-1 min-w-0 text-sm font-body text-ink truncate">{g.title}</span>
              <span className="text-xs font-mono text-[#8A7C63] shrink-0">{g.playedCount} lượt</span>
              <button onClick={() => onResults(g.id)} className="text-xs text-ticket font-semibold hover:underline shrink-0">Kết quả</button>
              {g.status === "published" && <button onClick={() => onLive(g)} className="text-xs text-teal font-semibold hover:underline shrink-0">Phát ▶</button>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SubjectBreakdown({ data, onCreate }) {
  const max = Math.max(1, ...(data || []).map(s => s.count));
  return (
    <section className="note-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg text-ink">📚 Phân theo môn học</h2>
        <button onClick={onCreate} className="text-xs text-ticket font-semibold hover:underline">+ Tạo trò chơi</button>
      </div>
      {!data || data.length === 0 ? (
        <p className="text-sm text-[#8A7C63]">Chưa có trò chơi nào.</p>
      ) : (
        <div className="space-y-3">
          {data.map(s => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-body text-ink">{s.name}</span>
                <span className="font-mono text-[#8A7C63]">{s.count} trò chơi</span>
              </div>
              <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-ticket rounded-full transition-all duration-500"
                  style={{ width: `${(s.count / max) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}