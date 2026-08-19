import { useCallback, useEffect, useState } from 'react'
import { gameService } from '../../services/api.js'
import { CATEGORIES, SUBJECTS } from '../../data/mockData.js'
import { PrimaryButton, GhostButton, Modal, TicketStub, Loader, ErrorState, EmptyState } from '../../components/ui.jsx'
import { GameCard } from './TeacherDashboard.jsx'

export default function GameLibrary({ onCreate, onEdit, onResults, showToast, onChanged }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [subject, setSubject] = useState("all");
  const [category, setCategory] = useState("all");
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [shareGame, setShareGame] = useState(null);

  const load = useCallback(() => {
    setGames(null); setError(null);
    gameService.list({ query, status, subject, category }).then(setGames).catch(e => setError(e.message || "Lỗi tải dữ liệu"));
  }, [query, status, subject, category]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const handleDelete = async (id) => { await gameService.remove(id); showToast("Đã xóa trò chơi", "success"); setConfirmDelete(null); onChanged(); load(); };
  const handleDuplicate = async (id) => { await gameService.duplicate(id); showToast("Đã sao chép trò chơi vào Bản nháp", "success"); onChanged(); load(); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Thư viện trò chơi</h1>
        <PrimaryButton onClick={onCreate}>+ Tạo trò chơi mới</PrimaryButton>
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
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map(g => (
            <GameCard key={g.id} game={g} onEdit={() => onEdit(g.id)} onResults={() => onResults(g.id)}
              onDuplicate={() => handleDuplicate(g.id)} onDelete={() => setConfirmDelete(g)} onShare={() => setShareGame(g)} />
          ))}
        </div>
      )}

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)}>
          <h3 className="font-display text-xl text-ink mb-2">Xóa "{confirmDelete.title}"?</h3>
          <p className="text-sm text-[#8A7C63] mb-6">Thao tác này không thể hoàn tác. Toàn bộ câu hỏi và kết quả liên quan sẽ bị xóa.</p>
          <div className="flex justify-end gap-3">
            <GhostButton onClick={() => setConfirmDelete(null)}>Hủy</GhostButton>
            <PrimaryButton onClick={() => handleDelete(confirmDelete.id)} className="!bg-ticket">Xóa trò chơi</PrimaryButton>
          </div>
        </Modal>
      )}
      {shareGame && (
        <Modal onClose={() => setShareGame(null)}>
          <h3 className="font-display text-xl text-ink mb-2">Vé mời "{shareGame.title}"</h3>
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