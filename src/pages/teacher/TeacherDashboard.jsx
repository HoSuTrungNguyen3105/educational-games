import { useCallback, useEffect, useState } from 'react'
import { gameService, statsService, templateService } from '../../services/api.js'
import { useTemplates } from '../../lib/hooks.js'
import { StampToken, StatusBadge, IconButton, Loader, ErrorState, EmptyState, PrimaryButton, GhostButton, Modal, TicketStub } from '../../components/ui.jsx'
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'

/* eslint-disable react-hooks/set-state-in-effect */

export function GameCard({ game, onEdit, onResults, onDuplicate, onDelete, onShare, onLive, onDesign, onHtmlTemplate }) {
  const templates = useTemplates();
  const tplId = game.templateId ? (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || game.templateId) : null;
  const tpl = tplId ? templates.find(t => t._id === tplId) : templates.find(t => t.slug === game.template || t.id === game.template);

  return (
    <div className="note-card p-4 sm:p-5 flex flex-col gap-3 anim-pop hover:-translate-y-0.5 transition shadow-[0_2px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between">
        <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#1D2E4A"} size={44} fontSize={20} />
        <StatusBadge status={game.status} />
      </div>
      <div>
        <h3 className="font-display text-base sm:text-lg text-ink leading-snug clamp-2">{game.name}</h3>
        <p className="text-sm text-[#8A7C63] mt-1 clamp-2">{game.description}</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#8A7C63] font-mono flex-wrap">
        <span>{game.subject}</span>
        <span>·</span>
        <span>{tpl ? tpl.category : ""}</span>
        <span>·</span>
        <span>{game.questionsCount} câu hỏi</span>
        <span>·</span>
        <span>{game.playersCount} lượt chơi</span>
      </div>
      <hr className="dash-rule my-1" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <IconButton title="Chỉnh sửa" onClick={onEdit}>✏️</IconButton>
          {/* {onDesign && <IconButton title="Thiết kế giao diện (Game Builder)" onClick={onDesign}>🎨</IconButton>} */}
          {onShare && game.status === "published" && <IconButton title="Chia sẻ" onClick={onShare}>🎟️</IconButton>}
          {onDelete && <IconButton title="Xóa" onClick={onDelete}>🗑️</IconButton>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onLive && game.status === "published" && (
            <button onClick={onLive} className="text-xs sm:text-sm font-semibold text-teal hover:underline whitespace-nowrap">
              Phát trực tiếp ▶
            </button>
          )}
          <button onClick={onResults} className="text-xs sm:text-sm font-semibold text-ticket hover:underline whitespace-nowrap">
            Kết quả →
          </button>
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
  const [confirmReset, setConfirmReset] = useState(null);
  const [resetting, setResetting] = useState(false);

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
    const gid = g._id?.toString() || g.id;
    socket.emit(SOCKET_EVENTS.JOIN_CLASSROOM, { gameId: gid });
    socket.emit(SOCKET_EVENTS.START_GAME, { gameId: gid });
    showToast(`Đã phát trực tiếp "${g.name}" — học sinh nhập mã ${g.code}`, "success");
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      if (confirmReset === "games") {
        const r = await gameService.removeAll();
        showToast(r?.message || "Đã xóa tất cả trò chơi", "success");
      } else if (confirmReset === "templates") {
        const r = await templateService.removeAll();
        showToast(r?.message || "Đã xóa tất cả template", "success");
      }
      setConfirmReset(null);
      load();
    } catch (e) {
      showToast(e.message || "Lỗi khi xóa dữ liệu", "error");
    } finally {
      setResetting(false);
    }
  };

  const t = stats || { totals: {}, activity: [], topPlayers: [], topGames: [], subjects: [], attention: { drafts: [], neverPlayed: [] } };
  const draftGames = (stats ? stats.attention.drafts : []).map(d => ({ ...d, raw: games?.find(g => (g._id?.toString() || g.id) === d.id) }));
  const neverPlayedGames = (stats ? stats.attention.neverPlayed : []).map(n => ({ ...n, raw: games?.find(g => (g._id?.toString() || g.id) === n.id) }));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <p className="text-[#8A7C63] text-xs sm:text-sm font-mono">Xin chào,</p>
        <h1 className="font-display text-2xl sm:text-3xl text-ink">{user ? user.name : "Giáo viên"} 👋</h1>
      </div>

      {error && <ErrorState subtitle="Không thể tải dữ liệu Dashboard." onRetry={load} />}
      {!error && !games && <Loader label="Đang tải dashboard..." />}

      {!error && games && (
        <div className="space-y-6 sm:space-y-8">
          {/* Thống kê */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
              <div key={s.label} className="note-card p-4 sm:p-5">
                <StampToken icon={s.icon} ring={s.ring} size={36} fontSize={16} />
                <div className="font-display text-xl sm:text-2xl text-ink mt-2 sm:mt-3">{s.value ?? 0}</div>
                <div className="text-[10px] sm:text-xs text-[#8A7C63] font-mono uppercase mt-0.5 sm:mt-1 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Việc cần làm */}
          {(draftGames.length > 0 || neverPlayedGames.length > 0) && (
            <section className="note-card p-4 sm:p-5 bg-paper2 border-l-4 border-l-ticket space-y-4 sm:space-y-5">
              <h2 className="font-display text-lg sm:text-xl text-ink">✅ Việc cần làm</h2>
              <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <h4 className="text-xs sm:text-sm font-mono text-[#8A7C63] uppercase mb-3">✏️ Bản nháp chưa xuất bản ({draftGames.length})</h4>
                  {draftGames.length === 0 ? (
                    <p className="text-sm text-[#8A7C63]">Không có bản nháp nào tồn đọng. 👏</p>
                  ) : (
                    <ul className="space-y-2">
                      {draftGames.map(d => (
                        <li key={d.id} className="flex items-center justify-between gap-3 bg-paper rounded-xl px-3 py-2">
                          <span className="text-sm font-body text-ink truncate">{d.name}</span>
                          <button onClick={() => onEdit(d.id)} className="text-xs font-semibold text-ticket hover:underline shrink-0">Chỉnh sửa →</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-mono text-[#8A7C63] uppercase mb-3">🚀 Đã xuất bản nhưng chưa có lượt chơi ({neverPlayedGames.length})</h4>
                  {neverPlayedGames.length === 0 ? (
                    <p className="text-sm text-[#8A7C63]">Tất cả đã có học sinh chơi. 🎉</p>
                  ) : (
                    <ul className="space-y-2">
                      {neverPlayedGames.map(n => (
                        <li key={n.id} className="flex items-center justify-between gap-3 bg-paper rounded-xl px-3 py-2">
                          <span className="text-sm font-body text-ink truncate">{n.name}</span>
                          <button onClick={() => handleLive(n.raw)} className="text-xs font-semibold text-teal hover:underline shrink-0">Phát trực tiếp ▶</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Biểu đồ + Bảng xếp hạng */}
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
            <ActivityChart data={t.activity} />
            <TopPlayers data={t.topPlayers} />
          </div>

          {/* Top games + Phân môn */}
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
            <TopGames data={t.topGames} onResults={onResults} onLive={handleLive} />
            <SubjectBreakdown data={t.subjects} onCreate={onCreate} />
          </div>

          {/* Trò chơi gần đây */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg sm:text-xl text-ink">Trò chơi gần đây</h2>
              <button onClick={onOpenLibrary} className="text-sm text-ticket font-semibold hover:underline">Xem tất cả →</button>
            </div>
            {games.length === 0 ? (
              <EmptyState icon="🎲" title="Chưa có trò chơi nào" subtitle="Tạo trò chơi đầu tiên để bắt đầu ôn tập cùng học sinh."
                action={<PrimaryButton onClick={onCreate} className="mt-2">+ Tạo trò chơi</PrimaryButton>} />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {games.slice(0, 3).map(g => {
                  const gid = g._id?.toString() || g.id;
                  return <GameCard key={gid} game={g} onEdit={() => onEdit(gid)} onResults={() => onResults(gid)} onDesign={() => onDesign(gid)} onLive={() => handleLive(g)} onShare={() => setShareGame(g)} />;
                })}
              </div>
            )}
          </div>

          {/* Vùng nguy hiểm */}
          <section className="note-card p-4 sm:p-5 border-l-4 border-l-red-400 space-y-3 sm:space-y-4">
            <h2 className="font-display text-lg sm:text-xl text-ink">⚠️ Vùng nguy hiểm</h2>
            <p className="text-sm text-[#8A7C63]">Xóa toàn bộ dữ liệu để tạo lại từ đầu. Thao tác không thể hoàn tác.</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setConfirmReset("games")}
                className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                🗑️ Xóa tất cả trò chơi
              </button>
              <button onClick={() => setConfirmReset("templates")}
                className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                🗑️ Xóa tất cả template
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Modal chia sẻ */}
      {shareGame && (
        <Modal onClose={() => setShareGame(null)}>
          <div className="space-y-4">
            <h3 className="font-display text-xl text-ink">Vé mời "{shareGame.name}"</h3>
            <p className="text-sm text-[#8A7C63]">Học sinh nhập mã vé sau tại màn hình "Tham gia trò chơi":</p>
            <TicketStub icon="🎟️" code={shareGame.code} notchBg="#FFFBF2" />
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <GhostButton onClick={() => setShareGame(null)}>Đóng</GhostButton>
              <PrimaryButton onClick={() => { handleLive(shareGame); setShareGame(null); }}>Phát trực tiếp ▶</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal xác nhận reset */}
      {confirmReset && (
        <Modal onClose={() => !resetting && setConfirmReset(null)}>
          <div className="space-y-4">
            <h3 className="font-display text-xl text-ink">
              Xác nhận xóa {confirmReset === "games" ? "tất cả trò chơi?" : "tất cả template?"}
            </h3>
            <p className="text-sm text-[#8A7C63]">
              {confirmReset === "games"
                ? "Sẽ xóa toàn bộ games kèm câu hỏi và kết quả liên quan."
                : "Sẽ xóa toàn bộ templates trong hệ thống."}
            </p>
            <p className="text-sm text-red-500 font-semibold">Hành động này không thể hoàn tác!</p>
            <div className="flex flex-wrap justify-end gap-3">
              <GhostButton onClick={() => setConfirmReset(null)} disabled={resetting}>Hủy</GhostButton>
              <PrimaryButton onClick={handleReset} disabled={resetting}>
                {resetting ? "Đang xóa..." : "Xóa hết"}
              </PrimaryButton>
            </div>
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
    <section className="note-card p-4 sm:p-5">
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 sm:mb-5">📈 Hoạt động 7 ngày gần nhất</h2>
      {!data || data.every(d => d.count === 0) ? (
        <p className="text-sm text-[#8A7C63]">Chưa có lượt chơi nào trong tuần này. Học sinh chơi xong bạn sẽ thấy số liệu tại đây.</p>
      ) : (
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-36 sm:h-40">
          {data.map(d => {
            const date = new Date(`${d.date}T00:00:00`);
            const label = days[date.getDay()];
            const h = d.count ? Math.max(8, Math.round((d.count / max) * 100)) : 4;
            return (
              <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#8A7C63]">{d.count || ""}</span>
                <div className="w-full max-w-8 sm:max-w-10 bg-gradient-to-t from-ticket to-orange-300 rounded-t-md transition-all duration-500 anim-pop"
                  style={{ height: `${h}px` }} title={d.date}></div>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#8A7C63]">{label}</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-[#B7A987] hidden sm:block">{d.date.slice(5)}</span>
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
    <section className="note-card p-4 sm:p-5">
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 sm:mb-5">🏆 Học sinh xuất sắc</h2>
      {!data || data.length === 0 ? (
        <p className="text-sm text-[#8A7C63]">Chưa có lượt chơi nào để xếp hạng.</p>
      ) : (
        <div className="space-y-2">
          {data.map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex items-center gap-2 sm:gap-3 p-2 rounded-xl hover:bg-ink/5 transition">
              <span className="text-lg sm:text-xl w-6 sm:w-8 text-center shrink-0">{medals[i] || `${i + 1}.`}</span>
              <span className="flex-1 min-w-0 text-sm sm:text-base font-body text-ink truncate">{p.name}</span>
              <span className="text-[10px] sm:text-xs text-[#8A7C63] font-mono whitespace-nowrap">{p.games} trận · {p.accuracy}%</span>
              <span className="font-display text-ink font-bold text-sm sm:text-base">{p.score}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TopGames({ data, onResults, onLive }) {
  return (
    <section className="note-card p-4 sm:p-5">
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 sm:mb-5">🎮 Trò chơi được chơi nhiều nhất</h2>
      {!data || data.length === 0 || data.every(g => g.playedCount === 0) ? (
        <p className="text-sm text-[#8A7C63]">Chưa có lượt chơi nào.</p>
      ) : (
        <div className="space-y-2">
          {data.filter(g => g.playedCount > 0).map((g, i) => (
            <div key={g.id} className="flex flex-wrap items-center gap-2 p-2 rounded-xl hover:bg-ink/5 transition">
              <span className="font-display text-base sm:text-lg text-[#B7A987] w-5 sm:w-6 text-center shrink-0">{i + 1}</span>
              <span className="flex-1 min-w-0 text-sm sm:text-base font-body text-ink truncate">{g.name}</span>
              <span className="text-[10px] sm:text-xs font-mono text-[#8A7C63] shrink-0">{g.playedCount} lượt</span>
              <div className="flex gap-2 ml-auto sm:ml-0">
                <button onClick={() => onResults(g.id)} className="text-xs sm:text-sm text-ticket font-semibold hover:underline shrink-0">Kết quả</button>
                {g.status === "published" && <button onClick={() => onLive(g)} className="text-xs sm:text-sm text-teal font-semibold hover:underline shrink-0">Phát ▶</button>}
              </div>
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
    <section className="note-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="font-display text-lg sm:text-xl text-ink">📚 Phân theo môn học</h2>
        <button onClick={onCreate} className="text-xs sm:text-sm text-ticket font-semibold hover:underline">+ Tạo trò chơi</button>
      </div>
      {!data || data.length === 0 ? (
        <p className="text-sm text-[#8A7C63]">Chưa có trò chơi nào.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {data.map(s => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
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