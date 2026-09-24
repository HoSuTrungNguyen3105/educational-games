import { useCallback, useEffect, useState } from 'react'
import { gameService, statsService } from '../../services/api.js'
import { useSubjects, useCategories, useTemplates } from '../../lib/hooks.js'
import {
  PrimaryButton, GhostButton, Modal, TicketStub, Loader, ErrorState, EmptyState,
  ManagementHeader, StatusBadge, StampToken, IconButton,
} from '../../components/ui.jsx'
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'
import RangePagination from '../../components/RangePagination.jsx'
import { Gamepad2, Pencil, Trash2, Copy, Ticket, Play, Search, Layers, Rocket, FileEdit, TrendingUp } from 'lucide-react'

const PAGE_SIZE = 12;

function StatCard({ icon: Icon, label, value, tone = "ink" }) {
  const tones = {
    ink: "bg-ink text-paper border-ink",
    teal: "bg-teal/10 text-teal border-teal/30",
    gold: "bg-gold/15 text-[#8a6a10] border-gold/40",
    ticket: "bg-ticket/10 text-ticket border-ticket/30",
  };
  return (
    <div className={`note-card p-4 flex items-center gap-3 border ${tones[tone] || tones.ink}`}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/70 border border-current/20 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-mono uppercase text-[#8A7C63] truncate">{label}</p>
        <p className="font-display text-2xl text-ink leading-tight">{value}</p>
      </div>
    </div>
  );
}

function ManagementGameCard({ game, templates, onEdit, onResults, onDuplicate, onDelete, onShare, onLive }) {
  const tplId = game.templateId
    ? (typeof game.templateId === "string" ? game.templateId : game.templateId?.$oid || game.templateId)
    : null;
  const tpl = tplId
    ? templates.find(t => t._id === tplId)
    : templates.find(t => t.slug === game.template || t.id === game.template);

  return (
    <div className="note-card p-4 flex flex-col gap-3 anim-pop hover:-translate-y-0.5 transition shadow-[0_2px_0_rgba(0,0,0,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <StampToken icon={tpl ? tpl.icon : <Gamepad2 className="w-5 h-5" />} ring={tpl ? tpl.ring : "#1D2E4A"} size={44} fontSize={20} />
        <StatusBadge status={game.status} />
      </div>
      <div>
        <h3 className="font-display text-base sm:text-lg text-ink leading-snug clamp-2">{game.name}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-body font-semibold bg-teal/10 text-teal border border-teal/20">
            {game.subject || "Khác"}
          </span>
          <span className="text-[11px] font-mono text-[#8A7C63]">
            {game.questionsCount || 0} câu hỏi
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-[#8A7C63] font-mono">
        <Play className="w-3.5 h-3.5" />
        <span>{Number(game.playersCount) || 0} lượt chơi</span>
      </div>
      <hr className="dash-rule my-1" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <IconButton title="Chỉnh sửa" onClick={onEdit}><Pencil className="w-5 h-5" /></IconButton>
          <IconButton title="Nhân bản" onClick={onDuplicate}><Copy className="w-5 h-5" /></IconButton>
          {onShare && game.status === "published" && (
            <IconButton title="Chia sẻ" onClick={onShare}><Ticket className="w-5 h-5" /></IconButton>
          )}
          <IconButton title="Xóa" onClick={onDelete}><Trash2 className="w-5 h-5" /></IconButton>
        </div>
        <button onClick={onResults} className="text-xs sm:text-sm font-semibold text-ticket hover:underline whitespace-nowrap">
          Kết quả →
        </button>
      </div>
      {onLive && game.status === "published" && (
        <button onClick={onLive} className="text-xs font-semibold text-teal hover:underline self-start">
          Phát trực tiếp <Play className="w-3 h-3 inline ml-1" />
        </button>
      )}
    </div>
  );
}

export default function GameLibraryManagement({ onCreate, onEdit, onResults, onDesign, showToast, onChanged }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [subject, setSubject] = useState("all");
  const [category, setCategory] = useState("all");
  const [games, setGames] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shareGame, setShareGame] = useState(null);
  const [from, setFrom] = useState(1);
  const [total, setTotal] = useState(0);
  const subjects = useSubjects();
  const categories = useCategories();
  const templates = useTemplates();

  const to = from + PAGE_SIZE - 1;

  const onQueryChange = (v) => { setQuery(v); setFrom(1); };
  const onStatusChange = (v) => { setStatus(v); setFrom(1); };
  const onSubjectChange = (v) => { setSubject(v); setFrom(1); };
  const onCategoryChange = (v) => { setCategory(v); setFrom(1); };

  const loadStats = useCallback(() => {
    statsService.get().then(s => {
      if (!s?.totals) return;
      const weeklyPlays = Array.isArray(s.activity)
        ? s.activity.reduce((sum, a) => sum + (a.count || 0), 0)
        : 0;
      setStats({
        total: s.totals.games || 0,
        published: s.totals.published || 0,
        drafts: s.totals.drafts || 0,
        weeklyPlays,
      });
    }).catch(() => { /* stats optional */ });
  }, []);

  const load = useCallback(() => {
    setGames(null); setError(null);
    gameService.list({ query, status, subject, category, from, to }).then(res => {
      if (res && res.items) {
        setGames(res.items);
        setTotal(res.pagination?.total || 0);
      } else {
        setGames(res || []);
        setTotal(0);
      }
    }).catch(e => setError(e.message || "Lỗi tải dữ liệu"));
  }, [query, status, subject, category, from, to]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  useEffect(() => { loadStats(); }, [loadStats]);

  const handleDelete = async (id) => { await gameService.remove(id); showToast("Đã xóa trò chơi", "success"); setConfirmDelete(null); onChanged(); load(); loadStats(); };
  const handleDuplicate = async (id) => { await gameService.duplicate(id); showToast("Đã sao chép trò chơi vào Bản nháp", "success"); onChanged(); load(); loadStats(); };

  const handleLive = async (g) => {
    if (!socket.connected) {
      showToast("Chưa kết nối realtime. Kiểm tra VITE_SOCKET_URL hoặc backend Socket.IO.", "error");
      return;
    }
    const gid = g._id?.toString() || g.id;
    socket.emit(SOCKET_EVENTS.JOIN_CLASSROOM, { gameId: gid });
    socket.emit(SOCKET_EVENTS.START_GAME, { gameId: gid });
    showToast(`Đã phát trực tiếp "${g.name}" — học sinh nhập mã ${g.code}`, "success");
  };

  const handleRangeChange = (newFrom) => setFrom(newFrom);
  const handlePrev = () => setFrom(f => Math.max(1, f - PAGE_SIZE));
  const handleNext = () => setFrom(f => Math.min(f + PAGE_SIZE, total));

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <ManagementHeader subtitle="Quản lý nội dung" title="Trò chơi" />
        <PrimaryButton onClick={onCreate}>+ Tạo trò chơi</PrimaryButton>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Layers} label="Tổng số trò chơi" value={stats ? stats.total : "—"} tone="ink" />
        <StatCard icon={Rocket} label="Đã xuất bản" value={stats ? stats.published : "—"} tone="teal" />
        <StatCard icon={FileEdit} label="Bản nháp" value={stats ? stats.drafts : "—"} tone="gold" />
        <StatCard icon={TrendingUp} label="Lượt chơi / tuần" value={stats ? stats.weeklyPlays.toLocaleString("vi-VN") : "—"} tone="ticket" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B7A987]" />
          <input value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Tìm theo tên hoặc chủ đề..."
            className="w-full note-card pl-10 pr-4 py-2.5 text-sm placeholder:text-[#B7A987]" />
        </div>
        <select value={subject} onChange={e => onSubjectChange(e.target.value)} className="note-card px-4 py-2.5 text-sm">
          <option value="all">Tất cả môn học</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={status} onChange={e => onStatusChange(e.target.value)} className="note-card px-4 py-2.5 text-sm">
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Bản nháp</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c.id} onClick={() => onCategoryChange(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-body border transition ${category === c.id ? "bg-ink text-paper border-ink" : "border-ink/15 text-ink/70 hover:border-ink/35"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {error && <ErrorState subtitle="Không thể tải thư viện trò chơi." onRetry={load} />}
      {!error && !games && <Loader label="Đang tìm trò chơi..." />}
      {!error && games && games.length === 0 && (
        <EmptyState icon="🔍" title="Không tìm thấy trò chơi phù hợp" subtitle="Thử đổi từ khóa tìm kiếm hoặc bộ lọc, hoặc tạo một trò chơi mới."
          action={<PrimaryButton onClick={onCreate} className="mt-2">+ Tạo trò chơi</PrimaryButton>} />
      )}
      {!error && games && games.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map(g => {
              const gid = g._id?.toString() || g.id;
              return (
                <ManagementGameCard
                  key={gid}
                  game={g}
                  templates={templates}
                  onEdit={() => onEdit(gid)}
                  onResults={() => onResults(gid)}
                  onDesign={() => onDesign(gid)}
                  onDuplicate={() => handleDuplicate(gid)}
                  onDelete={() => setConfirmDelete(g)}
                  onShare={() => setShareGame(g)}
                  onLive={() => handleLive(g)}
                />
              );
            })}
          </div>
          {total > PAGE_SIZE && (
            <div className="flex justify-center pt-2">
              <RangePagination
                fromRecord={from}
                toRecord={Math.min(to, total)}
                totalItems={total}
                onRangeChange={handleRangeChange}
                onPrevPage={handlePrev}
                onNextPage={handleNext}
              />
            </div>
          )}
        </>
      )}

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <h3 className="font-display text-xl text-ink mb-2">Xóa "{confirmDelete.name}"?</h3>
          <p className="text-sm text-[#8A7C63] mb-6">Thao tác này không thể hoàn tác. Toàn bộ câu hỏi và kết quả liên quan sẽ bị xóa.</p>
          <div className="flex justify-end gap-3">
            <GhostButton onClick={() => setConfirmDelete(null)}>Hủy</GhostButton>
            <PrimaryButton onClick={() => handleDelete(confirmDelete._id?.toString() || confirmDelete.id)} className="!bg-ticket">Xóa trò chơi</PrimaryButton>
          </div>
        </Modal>
      )}
      {shareGame && (
        <Modal onClose={() => setShareGame(null)}>
          <h3 className="font-display text-xl text-ink mb-2">Vé mời "{shareGame.name}"</h3>
          <p className="text-sm text-[#8A7C63] mb-4">Học sinh nhập mã vé sau tại màn hình "Tham gia trò chơi":</p>
          <TicketStub icon="🎟️" code={shareGame.code} notchBg="#FFFBF2" />
          <div className="flex justify-end mt-6">
            <PrimaryButton onClick={() => setShareGame(null)}>Đã hiểu</PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
