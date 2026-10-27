import { useCallback, useEffect, useState } from 'react'
import { gameService, statsService, templateService, seedService } from '../../services/api.js'
import { useTemplates } from '../../lib/hooks.js'
import { EmptyState, ErrorState, GhostButton, IconAdd, IconButton, IconCheckCircle, IconEdit, IconTrash, IconUsers, Loader, Modal, PrimaryButton, StampToken, StatusBadge, TicketStub, IconChart, IconCast } from '../../components/ui';
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'
import {
  Gamepad2,
  Ticket,
  Package,
  LoaderCircle,
  Target,
    TrendingUp,
  Trophy,
  Medal,
  BookOpen,
  TriangleAlert,
  Library,
  Activity,
  ChartPie,
  CalendarCheck,
  Clock,
  Layers,
} from 'lucide-react'
import { ChartCard, TrendChart, BarsChart, DonutChart, ChartLegend, seriesColor } from '../../components/charts'

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
          <IconButton title="Chỉnh sửa" onClick={onEdit}><IconEdit className="w-5 h-5" /></IconButton>
          {onShare && game.status === "published" && <IconButton title="Chia sẻ" onClick={onShare}><Ticket className="w-5 h-5" /></IconButton>}
          {onDelete && <IconButton title="Xóa" onClick={onDelete}><IconTrash className="w-5 h-5" /></IconButton>}
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
  const [days, setDays] = useState(14);
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
    Promise.all([statsService.get(days), gameService.list()])
      .then(([s, g]) => { setStats(s); setGames(g); })
      .catch(e => setError(e.message || "Lỗi tải dữ liệu Dashboard"));
  }, [days]);
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
                {seeding ? <LoaderCircle className="w-4 h-4 inline animate-spin mr-1" /> : <Package className="w-4 h-4 inline mr-1" />}
                {seeding ? "Đang inject..." : "Inject dữ liệu"}
              </button>
            </div>

            {/* Phân tích lớp học */}
            <TeacherAnalytics stats={stats} days={days} onDays={setDays} onResults={onResults} onLive={handleLive} />

            {/* Bảng xếp hạng học sinh */}
            <TopPlayers data={t.topPlayers} />

            {/* Trò chơi gần đây */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg sm:text-xl text-ink">Trò chơi gần đây</h2>
                <button onClick={onOpenLibrary} className="text-sm text-ticket font-semibold hover:underline">Xem tất cả →</button>
              </div>
              {games.length === 0 ? (
                <EmptyState icon={<Gamepad2 className="w-10 h-10 text-purple-400" />} title="Chưa có trò chơi nào" subtitle="Tạo trò chơi đầu tiên để bắt đầu ôn tập cùng học sinh."
                  action={<PrimaryButton onClick={onCreate} className="mt-2"><IconAdd className="w-4 h-4 inline mr-1" /> Tạo trò chơi</PrimaryButton>} />
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
              <h2 className="font-display text-lg sm:text-xl text-ink"><TriangleAlert className="w-5 h-5 inline mr-2 text-red-500" /> Vùng nguy hiểm</h2>
              <p className="text-sm text-[#8A7C63]">Xóa toàn bộ dữ liệu để tạo lại từ đầu. Thao tác không thể hoàn tác.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setConfirmReset("games")}
                  className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                  <IconTrash className="w-4 h-4 inline mr-1" /> Xóa tất cả trò chơi
                </button>
                <button onClick={() => setConfirmReset("templates")}
                  className="px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition">
                  <IconTrash className="w-4 h-4 inline mr-1" /> Xóa tất cả template
                </button>
              </div>
            </section>
          </div>

          {/* Panel phải — trên mobile đưa lên đầu để thấy việc cần làm ngay */}
          <aside className="w-full xl:w-[300px] shrink-0 space-y-4 order-first xl:order-last xl:sticky xl:top-[72px]">
            {/* Việc cần làm */}
            <section className="note-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-ink"><IconCheckCircle className="w-4 h-4 inline mr-1.5 text-ticket" /> Việc cần làm</h3>
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
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8A7C63] mb-2"><IconEdit className="w-3 h-3 inline mr-1" /> Bản nháp ({draftGames.length})</h4>
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
              <h3 className="font-display text-base text-ink mb-1"><IconAdd className="w-4 h-4 inline mr-1.5 text-ticket" /> Thao tác nhanh</h3>
              <PrimaryButton onClick={onCreate} className="w-full"><IconAdd className="w-4 h-4 inline mr-1" /> Tạo trò chơi</PrimaryButton>
              <GhostButton onClick={onOpenLibrary} className="w-full"><Library className="w-4 h-4 inline mr-1" /> Xem thư viện</GhostButton>
            </section>

            {/* Trạng thái hệ thống */}
            <section className="note-card p-4 space-y-2.5">
              <h3 className="font-display text-base text-ink"><IconChart className="w-4 h-4 inline mr-1.5 text-ticket" /> Trạng thái</h3>
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
              <PrimaryButton onClick={() => { handleLive(shareGame); setShareGame(null); }}>Phát trực tiếp <IconCast className="w-4 h-4 inline ml-1" /></PrimaryButton>
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
            <p className="text-sm text-red-500 font-semibold"><TriangleAlert className="w-4 h-4 inline mr-1" /> Hành động này không thể hoàn tác!</p>
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

/* ── Phân tích lớp học (biểu đồ Chartist) ─────────────────────── */

const RANGES = [
  { days: 7, label: "7 ngày" },
  { days: 14, label: "14 ngày" },
  { days: 30, label: "30 ngày" },
  { days: 90, label: "90 ngày" },
];

const KPI_ICONS = {
  plays: Gamepad2,
  activeStudents: IconUsers,
  avgAccuracy: Target,
  published: IconCheckCircle,
  submissions: CalendarCheck,
  avgTime: Clock,
};

/** "2026-10-09" → "9/10" để ghi chú cửa sổ ngày gọn. */
const dmy = (iso) => {
  const parts = String(iso || "").split("-");
  return parts.length === 3 ? `${+parts[2]}/${+parts[1]}` : String(iso || "");
};

function TrendChip({ change }) {
  const c = change || {};
  if (!c.trend || c.trend === "none") {
    return <span className="text-[9px] sm:text-[10px] font-mono text-[#B7A987]">chưa so sánh được</span>;
  }
  const up = c.trend === "up" || c.trend === "new";
  const flat = c.trend === "flat";
  const cls = flat ? "text-[#8A7C63] bg-ink/5" : up ? "text-[#059669] bg-[#10B981]/10" : "text-red-600 bg-red-500/10";
  const icon = flat
    ? <span className="w-3 text-center leading-none">–</span>
    : <TrendingUp className={`w-3 h-3 ${up ? "" : "rotate-180"}`} />;
  const text = c.pct === null
    ? (up ? "kỳ trước bằng 0" : "bằng 0")
    : `${c.pct > 0 ? "+" : ""}${c.pct.toLocaleString("vi-VN")}%`;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold ${cls}`}>
      {icon}{text}
    </span>
  );
}

function KpiCard({ kpi }) {
  const Icon = KPI_ICONS[kpi.key] || IconChart;
  return (
    <div className="note-card p-3 sm:p-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-[#8A7C63] truncate">{kpi.label}</span>
        <Icon className="w-4 h-4 shrink-0 text-ticket" />
      </div>
      <div className="flex items-end gap-1">
        <span className="font-display text-xl sm:text-2xl text-ink leading-none">{kpi.value ?? 0}</span>
        {kpi.unit && <span className="text-[10px] sm:text-xs font-mono text-[#8A7C63] mb-0.5">{kpi.unit}</span>}
      </div>
      <TrendChip change={kpi.change} />
      {kpi.hint && <p className="text-[9px] sm:text-[10px] font-mono text-[#B7A987] leading-tight">{kpi.hint}</p>}
    </div>
  );
}

function RangePicker({ days, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-ink/10 bg-paper p-0.5">
      {RANGES.map((r) => (
        <button key={r.days} onClick={() => onChange(r.days)}
          className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition ${days === r.days ? "bg-ink text-paper font-semibold" : "text-[#8A7C63] hover:bg-ink/5"}`}>
          {r.label}
        </button>
      ))}
    </div>
  );
}

function TeacherAnalytics({ stats, days, onDays, onResults, onLive }) {
  const s = stats?.series;
  if (!s) return null;

  const labels = s.days.map((d) => d.label);
  const windowNote = `${dmy(stats.meta?.window.from)} – ${dmy(stats.meta?.window.to)}`;
  const eventSeries = s.events.slice(0, 4).map((e) => ({ name: e.label, values: e.values }));
  const statusSlices = s.status.labels
    .map((name, i) => ({ name, value: s.status.values[i] }))
    .filter((x) => x.value > 0);
  const accuracySubjects = s.subjects.accuracies.map((v) => (v === null ? null : v));

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Dải chỉ số chính */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {(stats.kpis || []).map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}
      </div>

      {stats.meta?.warnings?.length > 0 && (
        <div className="note-card p-3 sm:p-4 border-l-4 border-l-gold bg-gold/5">
          <p className="text-[11px] sm:text-xs font-semibold text-[#B07D10] mb-1">
            <TriangleAlert className="w-3.5 h-3.5 inline mr-1" /> Lưu ý về nguồn số liệu
          </p>
          <ul className="space-y-0.5 text-[10px] sm:text-[11px] font-mono text-[#8A7C63] leading-relaxed list-disc pl-4">
            {stats.meta.warnings.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
      )}

      {/* Xu hướng + cơ cấu thư viện */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
        <ChartCard
          className="lg:col-span-2"
          title="Nhịp chơi của lớp"
          icon={<Activity className="w-5 h-5" />}
          actions={<RangePicker days={days} onChange={onDays} />}
          footer={<ChartLegend items={[
            { label: "Lượt chơi", value: s.plays.reduce((a, b) => a + b, 0), color: seriesColor(0) },
            { label: "Học sinh hoạt động", value: `cao nhất ${Math.max(0, ...s.activeStudents)} bạn`, color: seriesColor(1) },
          ]} />}
          caption={`Cửa sổ ${windowNote} · tính từ sự kiện chơi game và tiến độ nhiệm vụ ngày, không tính phiếu kết quả cũ thiếu mốc thời gian.`}
        >
          <TrendChart
            labels={labels}
            series={[
              { name: "Lượt chơi", values: s.plays },
              { name: "Học sinh hoạt động", values: s.activeStudents },
            ]}
            format={(v) => `${v} lượt`}
            empty="Chưa có lượt chơi nào trong khoảng ngày này."
            ariaLabel="Lượt chơi và số học sinh hoạt động theo ngày"
          />
        </ChartCard>

        <ChartCard
          title="Thư viện trò chơi"
          icon={<ChartPie className="w-5 h-5" />}
          footer={<ChartLegend items={statusSlices.map((x, i) => ({ label: x.name, value: x.value, color: seriesColor(i) }))} />}
          caption={`${stats.totals.games} trò chơi · ${stats.totals.students} học sinh trong hệ thống · ${stats.totals.players} bạn từng chơi.`}
        >
          <DonutChart
            slices={statusSlices}
            height={188}
            centerValue={stats.totals.games}
            centerLabel="trò chơi"
            empty="Thư viện chưa có trò chơi nào."
            ariaLabel="Cơ cấu trạng thái trò chơi"
          />
        </ChartCard>
      </div>

      {/* Loại hoạt động + trò chơi hot */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard
          title="Hoạt động theo loại"
          icon={<Layers className="w-5 h-5" />}
          footer={<ChartLegend items={eventSeries.map((e, i) => ({ label: e.name, value: e.values.reduce((a, b) => a + b, 0), color: seriesColor(i) }))} />}
          caption={`Cột chồng cho ${eventSeries.length} loại sự kiện hay xảy ra nhất trong ${windowNote} · rê chuột vào từng đoạn để xem số của ngày đó.`}
        >
          <BarsChart
            labels={labels}
            series={eventSeries}
            stack
            height={220}
            format={(v) => `${v} sự kiện`}
            empty="Chưa ghi nhận sự kiện nào trong khoảng ngày này."
            ariaLabel="Số sự kiện mỗi ngày theo loại"
          />
        </ChartCard>

        <ChartCard
          title="Trò chơi được chơi nhiều nhất"
          icon={<Gamepad2 className="w-5 h-5" />}
          footer={<TopGameActions games={stats.topGames} onResults={onResults} onLive={onLive} />}
          caption="Toàn thời gian · tính cả phiếu kết quả lẫn sự kiện chơi game."
        >
          <BarsChart
            labels={s.topGames.labels}
            series={[{ name: "Lượt chơi", values: s.topGames.values }]}
            horizontal
            height={Math.max(160, s.topGames.labels.length * 30)}
            format={(v) => `${v} lượt`}
            empty="Chưa có trò chơi nào được chơi."
            ariaLabel="Xếp hạng trò chơi theo lượt chơi"
          />
        </ChartCard>
      </div>

      {/* Môn học + chất lượng */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard
          title="Thư viện theo môn"
          icon={<BookOpen className="w-5 h-5" />}
          footer={<ChartLegend items={[{ label: "Tổng trò chơi" }, { label: "Đã xuất bản" }]} />}
          caption="Mỗi môn hai cột: tổng số và số đã xuất bản."
        >
          <BarsChart
            labels={s.subjects.labels}
            series={[
              { name: "Tổng trò chơi", values: s.subjects.counts },
              { name: "Đã xuất bản", values: s.subjects.published },
            ]}
            height={210}
            format={(v) => `${v} trò chơi`}
            empty="Chưa có trò chơi nào để phân môn."
            ariaLabel="Số trò chơi theo môn học"
          />
        </ChartCard>

        <ChartCard
          title="Độ chính xác theo môn"
          icon={<Target className="w-5 h-5" />}
          caption="Chỉ tính phiếu kết quả khớp được với trò chơi trong thư viện; môn trống cột là chưa có dữ liệu."
        >
          <BarsChart
            labels={s.subjects.labels}
            series={[{ name: "Độ chính xác TB", values: accuracySubjects }]}
            height={210}
            format={(v) => `${v}%`}
            tickFormat={(v) => `${v}%`}
            empty="Chưa có phiếu kết quả nào gắn với môn học."
            ariaLabel="Độ chính xác trung bình theo môn"
          />
        </ChartCard>
      </div>

      {/* Chất lượng phân bố + nhịp tuần */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard
          title="Phân bố độ chính xác"
          icon={<IconChart className="w-5 h-5" />}
          caption={`${stats.meta?.sources?.results ?? 0} phiếu kết quả · cột dồn về phía phải nghĩa là lớp làm chắc bài hơn.`}
        >
          <BarsChart
            labels={s.accuracyBands.map((b) => b.label)}
            series={[{ name: "Số phiếu", values: s.accuracyBands.map((b) => b.count) }]}
            height={200}
            format={(v) => `${v} phiếu`}
            empty="Chưa có phiếu kết quả nào."
            ariaLabel="Số phiếu kết quả chia theo dải độ chính xác"
          />
        </ChartCard>

        <ChartCard
          title="Ngày nào lớp năng nổ"
          icon={<CalendarCheck className="w-5 h-5" />}
          caption={`Trung bình lượt chơi mỗi thứ trong ${windowNote}.`}
        >
          <BarsChart
            labels={s.weekday.map((w) => w.label)}
            series={[{ name: "Lượt chơi TB/ngày", values: s.weekday.map((w) => w.avg) }]}
            height={200}
            format={(v) => `${v} lượt/ngày`}
            empty="Chưa đủ dữ liệu ngày để tính nhịp trong tuần."
            ariaLabel="Lượt chơi trung bình theo thứ trong tuần"
          />
        </ChartCard>
      </div>

      {/* Giao đề */}
      {s.assignments.labels.length > 0 && (
        <ChartCard
          title="Tiến độ giao đề"
          icon={<Ticket className="w-5 h-5" />}
          footer={<ChartLegend items={[{ label: "Đã nộp" }, { label: "Đã chấm" }]} />}
          caption="6 giao đề gần đây nhất · điểm TB của phần đã chấm hiển thị trong tooltip từng cột."
        >
          <BarsChart
            labels={s.assignments.labels}
            series={[
              { name: "Đã nộp", values: s.assignments.submitted },
              { name: "Đã chấm", values: s.assignments.graded },
            ]}
            height={210}
            format={(v, i) => `${v} bài · điểm TB ${s.assignments.avgScores[i] ?? 0}`}
            empty="Chưa có giao đề nào."
            ariaLabel="Số bài đã nộp và đã chấm theo giao đề"
          />
        </ChartCard>
      )}
    </div>
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

/**
 * Bảng thao tác nhanh dưới biểu đồ "Trò chơi được chơi nhiều nhất":
 * mở kết quả hoặc phát trực tiếp ngay tại chỗ, khỏi phải vào thư viện.
 */
function TopGameActions({ games, onResults, onLive }) {
  const list = (games || []).filter((g) => g.playedCount > 0).slice(0, 3);
  if (list.length === 0) return null;
  return (
    <div className="mt-1 space-y-1.5">
      {list.map((g) => (
        <div key={g.id} className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="flex-1 min-w-0 font-body text-ink truncate">{g.name}</span>
          <span className="font-mono text-[10px] sm:text-xs text-[#8A7C63] shrink-0">{g.playedCount} lượt</span>
          <button onClick={() => onResults(g.id)} className="text-ticket font-semibold hover:underline shrink-0">Kết quả</button>
          {g.status === "published" && (
            <button onClick={() => onLive(g)} className="text-teal font-semibold hover:underline shrink-0">Phát <IconCast className="w-3 h-3 inline ml-0.5" /></button>
          )}
        </div>
      ))}
    </div>
  );
}
