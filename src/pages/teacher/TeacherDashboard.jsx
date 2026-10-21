import { useCallback, useEffect, useState } from 'react'
import { gameService, statsService, templateService, seedService } from '../../services/api.js'
import { useTemplates } from '../../lib/hooks.js'
import { StampToken, StatusBadge, IconButton, Loader, ErrorState, EmptyState, PrimaryButton, GhostButton, Modal, TicketStub } from '../../components/ui'
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'
import {
  Gamepad2,
  Pencil,
  Ticket,
  Trash2,
  Package,
  Loader2,
  CheckCircle2,
  Users,
  School,
  Target,
  BarChart3,
  TrendingUp,
  Trophy,
  Medal,
  BookOpen,
  AlertTriangle,
  Play,
  Plus,
  Library,
} from 'lucide-react'

/* eslint-disable react-hooks/set-state-in-effect */

export function GameCard({ game, onEdit, onResults, onDelete, onShare }) {
  const templates = useTemplates();
  const tplId = game.templateId ? (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || game.templateId) : null;
  const tpl = tplId ? templates.find(t => t._id === tplId) : templates.find(t => t.slug === game.template || t.id === game.template);

  return (
    <div className="note-card p-4 sm:p-5 flex flex-col gap-3 anim-pop hover:-translate-y-0.5 transition shadow-[0_2px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between">
        <StampToken icon={tpl ? tpl.icon : <Gamepad2 className="w-5 h-5" />} ring={tpl ? tpl.ring : "#1D2E4A"} size={44} fontSize={20} />
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
          <IconButton title="Chỉnh sửa" onClick={onEdit}><Pencil className="w-5 h-5" /></IconButton>
          {onShare && game.status === "published" && <IconButton title="Chia sẻ" onClick={onShare}><Ticket className="w-5 h-5" /></IconButton>}
          {onDelete && <IconButton title="Xóa" onClick={onDelete}><Trash2 className="w-5 h-5" /></IconButton>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={onResults} className="text-xs sm:text-sm font-semibold text-ticket hover:underline whitespace-nowrap">
            Kết quả →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard({ user, onOpenLibrary, onCreate, onEdit, onResults, showToast }) {
  const [games, setGames] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [shareGame, setShareGame] = useState(null);
  const [confirmReset, setConfirmReset] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [live, setLive] = useState(socket.connected);

  useEffect(() => {
    const on = () => setLive(true);
    const off = () => setLive(false);
    socket.on("connect", on);
    socket.on("disconnect", off);
    return () => { socket.off("connect", on); socket.off("disconnect", off); };
  }, []);

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

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const r = await seedService.seed();
      const msg = r?.message || "Đã inject dữ liệu";
      const details = r?.data;
      let summary = msg;
      if (details) {
        const parts = [];
        for (const [k, v] of Object.entries(details)) {
          if (v.added > 0) parts.push(`${k}: +${v.added}`);
        }
        if (parts.length > 0) summary += " (" + parts.join(", ") + ")";
      }
      showToast(summary, "success");
      load();
    } catch (e) {
      showToast(e.message || "Lỗi khi inject dữ liệu", "error");
    } finally {
      setSeeding(false);
    }
  };

  const t = stats || { totals: {}, activity: [], topPlayers: [], topGames: [], subjects: [], attention: { drafts: [], neverPlayed: [] } };
  const draftGames = (stats ? stats.attention.drafts : []).map(d => ({ ...d, raw: games?.find(g => (g._id?.toString() || g.id) === d.id) }));
  const neverPlayedGames = (stats ? stats.attention.neverPlayed : []).map(n => ({ ...n, raw: games?.find(g => (g._id?.toString() || g.id) === n.id) }));
  const todoCount = draftGames.length + neverPlayedGames.length;

  const statItems = [
    { label: "Tổng trò chơi", value: t.totals.games, Icon: Ticket, chip: "bg-[#1D2E4A]/10 text-[#1D2E4A]" },
    { label: "Đã xuất bản", value: t.totals.published, Icon: CheckCircle2, chip: "bg-teal/15 text-teal" },
    { label: "Bản nháp", value: t.totals.drafts, Icon: Pencil, chip: "bg-gold/20 text-[#B07D10]" },
    { label: "Lượt chơi", value: t.totals.plays, Icon: Gamepad2, chip: "bg-pink/15 text-pink" },
    { label: "Học sinh tham gia", value: t.totals.players, Icon: Users, chip: "bg-[#7C6FF1]/15 text-[#7C6FF1]" },
    { label: "HS trong hệ thống", value: t.totals.students, Icon: School, chip: "bg-[#38BDF8]/15 text-[#0284C7]" },
    { label: "Điểm trung bình", value: t.totals.avgScore, Icon: Target, chip: "bg-ticket/10 text-ticket" },
    { label: "Độ chính xác TB", value: `${t.totals.avgAccuracy ?? 0}%`, Icon: BarChart3, chip: "bg-[#10B981]/15 text-[#059669]" },
  ];

  return (
    <div>
      {error && <ErrorState subtitle="Không thể tải dữ liệu Dashboard." onRetry={load} />}
      {!error && !games && <Loader label="Đang tải dashboard..." />}

      {!error && games && (
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 items-start">
          {/* Cột chính */}
          <div className="flex-1 min-w-0 w-full space-y-4 sm:space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[#8A7C63] text-xs sm:text-sm font-mono">Xin chào,</p>
                <h2 className="font-display text-2xl sm:text-3xl text-ink">{user ? user.name : "Giáo viên"}</h2>
                <p className="text-xs sm:text-sm text-[#8A7C63] mt-1">Hôm nay lớp bạn có gì vui nào?</p>
              </div>
              <button onClick={handleSeed} disabled={seeding}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-ink/15 text-[#8A7C63] hover:bg-ink/5 transition disabled:opacity-50 shrink-0">
                {seeding ? <Loader2 className="w-4 h-4 inline animate-spin mr-1" /> : <Package className="w-4 h-4 inline mr-1" />}
                {seeding ? "Đang inject..." : "Inject dữ liệu"}
              </button>
            </div>

            {/* Thống kê */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statItems.map(({ label, value, Icon, chip }) => (
                <div key={label} className="note-card p-3.5 sm:p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${chip}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg sm:text-xl text-ink leading-tight">{value ?? 0}</div>
                    <div className="text-[9px] sm:text-[10px] text-[#8A7C63] font-mono uppercase leading-tight truncate">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Biểu đồ + Bảng xếp hạng */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
              <ActivityChart data={t.activity} />
              <TopPlayers data={t.topPlayers} />
            </div>

            {/* Top games + Phân môn */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
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
                <EmptyState icon={<Gamepad2 className="w-10 h-10 text-purple-400" />} title="Chưa có trò chơi nào" subtitle="Tạo trò chơi đầu tiên để bắt đầu ôn tập cùng học sinh."
                  action={<PrimaryButton onClick={onCreate} className="mt-2"><Plus className="w-4 h-4 inline mr-1" /> Tạo trò chơi</PrimaryButton>} />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {games.slice(0, 3).map(g => {
                    const gid = g._id?.toString() || g.id;
                    return <GameCard key={gid} game={g} onEdit={() => onEdit(gid)} onResults={() => onResults(gid)} onShare={() => setShareGame(g)} />;
                  })}
                </div>
              )}
            </div>

            {/* Vùng nguy hiểm */}
            <section className="note-card p-4 sm:p-5 border-l-4 border-l-red-400 space-y-3 sm:space-y-4">
              <h2 className="font-display text-lg sm:text-xl text-ink"><AlertTriangle className="w-5 h-5 inline mr-2 text-red-500" /> Vùng nguy hiểm</h2>
              <p className="text-sm text-[#8A7C63]">Xóa toàn bộ dữ liệu để tạo lại từ đầu. Thao tác không thể hoàn tác.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setConfirmReset("games")}
                  className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                  <Trash2 className="w-4 h-4 inline mr-1" /> Xóa tất cả trò chơi
                </button>
                <button onClick={() => setConfirmReset("templates")}
                  className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                  <Trash2 className="w-4 h-4 inline mr-1" /> Xóa tất cả template
                </button>
              </div>
            </section>
          </div>

          {/* Panel phải — trên mobile đưa lên đầu để thấy việc cần làm ngay */}
          <aside className="w-full xl:w-[300px] shrink-0 space-y-4 order-first xl:order-last xl:sticky xl:top-[72px]">
            {/* Việc cần làm */}
            <section className="note-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink"><CheckCircle2 className="w-4 h-4 inline mr-1.5 text-ticket" /> Việc cần làm</h3>
                {todoCount > 0 && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-ticket/10 text-ticket">{todoCount}</span>
                )}
              </div>
              {todoCount === 0 ? (
                <p className="text-sm text-[#8A7C63]">Mọi thứ đều sẵn sàng!</p>
              ) : (
                <>
                  {draftGames.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8A7C63] mb-2"><Pencil className="w-3 h-3 inline mr-1" /> Bản nháp ({draftGames.length})</h4>
                      <ul className="space-y-1.5">
                        {draftGames.slice(0, 4).map(d => (
                          <li key={d.id} className="flex items-center justify-between gap-2 bg-paper rounded-xl px-3 py-2">
                            <span className="text-sm font-body text-ink truncate">{d.name}</span>
                            <button onClick={() => onEdit(d.id)} className="text-xs font-semibold text-ticket hover:underline shrink-0">Sửa →</button>
                          </li>
                        ))}
                      </ul>
                      {draftGames.length > 4 && <p className="text-[10px] font-mono text-[#B7A987] mt-1.5">+{draftGames.length - 4} bản nháp khác</p>}
                    </div>
                  )}
                  {neverPlayedGames.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8A7C63] mb-2"><TrendingUp className="w-3 h-3 inline mr-1" /> Chưa ai chơi ({neverPlayedGames.length})</h4>
                      <ul className="space-y-1.5">
                        {neverPlayedGames.slice(0, 4).map(n => (
                          <li key={n.id} className="flex items-center justify-between gap-2 bg-paper rounded-xl px-3 py-2">
                            <span className="text-sm font-body text-ink truncate">{n.name}</span>
                            <button onClick={() => handleLive(n.raw)} className="text-xs font-semibold text-teal hover:underline shrink-0">Phát ▶</button>
                          </li>
                        ))}
                      </ul>
                      {neverPlayedGames.length > 4 && <p className="text-[10px] font-mono text-[#B7A987] mt-1.5">+{neverPlayedGames.length - 4} trò chơi khác</p>}
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Thao tác nhanh */}
            <section className="note-card p-4 space-y-2">
              <h3 className="font-display text-base text-ink mb-1"><Plus className="w-4 h-4 inline mr-1.5 text-ticket" /> Thao tác nhanh</h3>
              <PrimaryButton onClick={onCreate} className="w-full"><Plus className="w-4 h-4 inline mr-1" /> Tạo trò chơi</PrimaryButton>
              <GhostButton onClick={onOpenLibrary} className="w-full"><Library className="w-4 h-4 inline mr-1" /> Xem thư viện</GhostButton>
            </section>

            {/* Trạng thái hệ thống */}
            <section className="note-card p-4 space-y-2.5">
              <h3 className="font-display text-base text-ink"><BarChart3 className="w-4 h-4 inline mr-1.5 text-ticket" /> Trạng thái</h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A7C63] font-body">API dữ liệu</span>
                <span className="flex items-center gap-1.5 font-mono text-[#059669]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Đang hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A7C63] font-body">Realtime (Socket)</span>
                {live ? (
                  <span className="flex items-center gap-1.5 font-mono text-[#059669]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Đã kết nối
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 font-mono text-red-500">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> Chưa kết nối
                  </span>
                )}
              </div>
              <hr className="dash-rule" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A7C63] font-body">Tỉ lệ xuất bản</span>
                <span className="font-mono text-ink">{t.totals.published || 0}/{t.totals.games || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A7C63] font-body">Điểm trung bình</span>
                <span className="font-mono text-ink">{t.totals.avgScore ?? 0}</span>
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Modal chia sẻ */}
      {shareGame && (
        <Modal onClose={() => setShareGame(null)}>
          <div className="space-y-4">
            <h3 className="font-display text-xl text-ink">Vé mời "{shareGame.name}"</h3>
            <p className="text-sm text-[#8A7C63]">Học sinh nhập mã vé sau tại màn hình "Tham gia trò chơi":</p>
            <TicketStub icon={<Ticket className="w-5 h-5" />} code={shareGame.code} notchBg="#FFFBF2" />
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <GhostButton onClick={() => setShareGame(null)}>Đóng</GhostButton>
              <PrimaryButton onClick={() => { handleLive(shareGame); setShareGame(null); }}>Phát trực tiếp <Play className="w-4 h-4 inline ml-1" /></PrimaryButton>
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
            <p className="text-sm text-red-500 font-semibold"><AlertTriangle className="w-4 h-4 inline mr-1" /> Hành động này không thể hoàn tác!</p>
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
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 sm:mb-5"><TrendingUp className="w-5 h-5 inline mr-2 text-ticket" /> Hoạt động 7 ngày gần nhất</h2>
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
  const medals = [<Medal className="w-5 h-5 text-amber-400" />, <Medal className="w-5 h-5 text-gray-400" />, <Medal className="w-5 h-5 text-orange-400" />];
  return (
    <section className="note-card p-4 sm:p-5">
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 sm:mb-5"><Trophy className="w-5 h-5 inline mr-2 text-amber-500" /> Học sinh xuất sắc</h2>
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
      <h2 className="font-display text-lg sm:text-xl text-ink mb-4 sm:mb-5"><Gamepad2 className="w-5 h-5 inline mr-2 text-ticket" /> Trò chơi được chơi nhiều nhất</h2>
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
                {g.status === "published" && <button onClick={() => onLive(g)} className="text-xs sm:text-sm text-teal font-semibold hover:underline shrink-0">Phát <Play className="w-3 h-3 inline ml-1" /></button>}
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
        <h2 className="font-display text-lg sm:text-xl text-ink"><BookOpen className="w-5 h-5 inline mr-2 text-ticket" /> Phân theo môn học</h2>
        <button onClick={onCreate} className="text-xs sm:text-sm text-ticket font-semibold hover:underline"><Plus className="w-4 h-4 inline mr-1" /> Tạo trò chơi</button>
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
