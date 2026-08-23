import { useCallback, useEffect, useState } from 'react'
import { gameService } from '../../services/api.js'
import { useSubjects, useCategories } from '../../lib/hooks.js'
import { PrimaryButton, GhostButton, Modal, TicketStub, Loader, ErrorState, EmptyState } from '../../components/ui.jsx'
import { GameCard } from './TeacherDashboard.jsx'
import { socket } from '../../socket/socket.js'
import { SOCKET_EVENTS } from '../../socket/socket.events.js'
import RangePagination from '../../components/RangePagination.jsx'

const PAGE_SIZE = 12;

export default function GameLibraryManagement({ onCreate, onEdit, onResults, onDesign, onOpenBuilder, showToast, onChanged }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [subject, setSubject] = useState("all");
  const [category, setCategory] = useState("all");
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shareGame, setShareGame] = useState(null);
  const [from, setFrom] = useState(1);
  const [total, setTotal] = useState(0);
  const subjects = useSubjects();
  const categories = useCategories();

  const to = from + PAGE_SIZE - 1;

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

  useEffect(() => { setFrom(1); }, [query, status, subject, category]);

  const handleDelete = async (id) => { await gameService.remove(id); showToast("Đã xóa trò chơi", "success"); setConfirmDelete(null); onChanged(); load(); };
  const handleDuplicate = async (id) => { await gameService.duplicate(id); showToast("Đã sao chép trò chơi vào Bản nháp", "success"); onChanged(); load(); };

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

  const handleRangeChange = (newFrom, newTo) => {
    setFrom(newFrom);
  };

  const handlePrev = () => setFrom(f => Math.max(1, f - PAGE_SIZE));
  const handleNext = () => setFrom(f => Math.min(f + PAGE_SIZE, total));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Thư viện trò chơi</h1>
        <div className="flex gap-3">
          <GhostButton onClick={onOpenBuilder} className="!border-ticket/40 !text-ticket">🎨 Game Builder</GhostButton>
          <PrimaryButton onClick={onCreate}>+ Tạo trò chơi mới</PrimaryButton>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm theo tên hoặc chủ đề..."
          className="flex-1 note-card px-4 py-2.5 text-sm placeholder:text-[#B7A987]" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="note-card px-4 py-2.5 text-sm">
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã xuất bản</option>
          <option value="draft">Bản nháp</option>
        </select>
        <select value={subject} onChange={e => setSubject(e.target.value)} className="note-card px-4 py-2.5 text-sm">
          <option value="all">Tất cả môn học</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
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
                <GameCard key={gid} game={g} onEdit={() => onEdit(gid)} onResults={() => onResults(gid)}
                  onDesign={() => onDesign(gid)}
                  onDuplicate={() => handleDuplicate(gid)} onDelete={() => setConfirmDelete(g)} onShare={() => setShareGame(g)} onLive={() => handleLive(g)} />
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
