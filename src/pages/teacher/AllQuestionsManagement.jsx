import { useCallback, useEffect, useMemo, useState } from 'react'
import { gameService, questionService } from '../../services/api.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, Modal, PrimaryButton, GhostButton, EmptyState } from '../../components/ui.jsx'

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

export default function AllQuestionsManagement({ showToast }) {
  const [games, setGames] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterGame, setFilterGame] = useState('');
  const [form, setForm] = useState({ content: "", options: [{ id: "", content: "" }, { id: "", content: "" }], correctAnswer: "", timeLimit: 15, points: 100 });
  const [editingQ, setEditingQ] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const loadAll = useCallback(() => {
    setQuestions(null); setError(null);
    Promise.all([
      questionService.listAll(),
      gameService.list(),
    ]).then(([q, g]) => {
      setQuestions(q);
      setGames(g);
    }).catch(e => setError(e.message));
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  const gameMap = useMemo(() => {
    if (!games) return {};
    const m = {};
    for (const g of games) m[g._id] = g.name;
    return m;
  }, [games]);

  const filtered = useMemo(() => {
    if (!questions) return null;
    let list = questions;
    if (filterGame) list = list.filter(q => q.gameId === filterGame);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(q =>
        q.content?.toLowerCase().includes(s) ||
        q.options?.some(o => o.content?.toLowerCase().includes(s))
      );
    }
    return list;
  }, [questions, search, filterGame]);

  const openEdit = (q) => {
    setForm({
      content: q.content || "",
      options: (q.options || []).map(o => ({ id: o.id || uid("ans"), content: o.content || "" })),
      correctAnswer: q.correctAnswer || "",
      timeLimit: q.timeLimit || 15,
      points: q.points || 100,
    });
    setEditingQ(q); setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditingQ(null); setError(null); };

  const updateOption = (idx, key, val) => {
    setForm(f => {
      const opts = [...f.options];
      opts[idx] = { ...opts[idx], [key]: val };
      return { ...f, options: opts };
    });
    setError(null);
  };
  const addOption = () => setForm(f => ({ ...f, options: [...f.options, { id: uid("ans"), content: "" }] }));
  const removeOption = (idx) => setForm(f => {
    const opts = f.options.filter((_, i) => i !== idx);
    const correctAnswer = f.correctAnswer === f.options[idx]?.id ? "" : f.correctAnswer;
    return { ...f, options: opts, correctAnswer };
  });

  const submit = async () => {
    if (!form.content.trim()) { setError("Nhập nội dung câu hỏi"); return; }
    const validOpts = form.options.filter(o => o.content.trim());
    if (validOpts.length < 2) { setError("Cần ít nhất 2 đáp án"); return; }
    if (!form.correctAnswer) { setError("Chọn đáp án đúng"); return; }
    if (!editingQ) return;

    setSaving(true); setError(null);
    try {
      await questionService.updateOne(editingQ.gameId, editingQ.id, {
        content: form.content.trim(),
        options: validOpts,
        correctAnswer: form.correctAnswer,
        timeLimit: Number(form.timeLimit) || 15,
        points: Number(form.points) || 100,
      });
      showToast("Đã cập nhật câu hỏi");
      closeModal(); loadAll();
    } catch (err) {
      setError(err.message || "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (q) => setConfirm({ open: true, item: q });
  const doRemove = async () => {
    const q = confirm.item;
    if (!q) return;
    try {
      await questionService.removeOne(q.gameId, q.id);
      showToast("Đã xóa câu hỏi");
      setConfirm({ open: false, item: null }); loadAll();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  const totalByGame = useMemo(() => {
    if (!questions) return {};
    const m = {};
    for (const q of questions) {
      m[q.gameId] = (m[q.gameId] || 0) + 1;
    }
    return m;
  }, [questions]);

  return (
    <div>
      <ManagementHeader subtitle="Quản lý tất cả câu hỏi" title="All Questions" />

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="note-card p-3 bg-paper2 flex-1 min-w-[200px]">
          <label className="text-xs font-mono uppercase text-[#8A7C63]">Tìm kiếm</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm nội dung câu hỏi..."
            className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm"
          />
        </div>
        <div className="note-card p-3 bg-paper2 flex-1 min-w-[200px]">
          <label className="text-xs font-mono uppercase text-[#8A7C63]">Lọc theo game</label>
          <select
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm"
          >
            <option value="">-- Tất cả game --</option>
            {games?.map(g => (
              <option key={g._id} value={g._id}>{g.name} ({totalByGame[g._id] || 0})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="note-card p-3 bg-paper2 mb-4 flex items-center gap-4 text-xs text-[#8A7C63]">
        <span>Tổng: <strong>{filtered?.length || 0}</strong> câu hỏi</span>
        <span>|</span>
        <span>{Object.keys(totalByGame).length} game có câu hỏi</span>
      </div>

      <ManagementTable
        title="Tất cả câu hỏi"
        data={filtered}
        error={error && !questions ? error : null}
        onRetry={loadAll}
        emptyLabel="Không có câu hỏi nào."
        headers={["#", "Game", "Nội dung", "Đáp án đúng", "Thời gian", "Điểm", ""]}
        renderRow={(q, idx) => (
          <tr key={q.id || idx} className="border-b border-ink/5 last:border-0 hover:bg-ink/[.02]">
            <td className="px-4 py-2 text-sm text-[#8A7C63]">{idx + 1}</td>
            <td className="px-4 py-2 text-sm">
              <span className="inline-block px-2 py-0.5 rounded-full bg-teal/10 text-teal text-xs font-medium max-w-[140px] truncate">
                {gameMap[q.gameId] || "—"}
              </span>
            </td>
            <td className="px-4 py-2 text-sm max-w-xs truncate">{q.content}</td>
            <td className="px-4 py-2 text-sm">
              {q.options?.find(o => o.id === q.correctAnswer)?.content || "—"}
            </td>
            <td className="px-4 py-2 text-sm">{q.timeLimit}s</td>
            <td className="px-4 py-2 text-sm">{q.points}</td>
            <td className="px-4 py-2">
              <div className="flex items-center justify-end gap-1">
                <IconButton title="Chỉnh sửa" onClick={() => openEdit(q)}>✏️</IconButton>
                <IconButton title="Xóa" onClick={() => confirmRemove(q)}>🗑️</IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      {modalOpen && editingQ && (
        <Modal wide open={modalOpen} onClose={closeModal}>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Sửa câu hỏi</h2>
              <span className="text-xs text-[#8A7C63] bg-ink/5 px-2 py-1 rounded">
                Game: {gameMap[editingQ.gameId] || "—"}
              </span>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Nội dung câu hỏi *</label>
              <textarea
                value={form.content}
                onChange={(e) => { setForm(f => ({ ...f, content: e.target.value })); setError(null); }}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm"
                rows={2}
                placeholder="Nhập nội dung câu hỏi..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Đáp án ({form.options.length})</label>
              {form.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={form.correctAnswer === opt.id}
                    onChange={() => { setForm(f => ({ ...f, correctAnswer: opt.id })); setError(null); }}
                    className="accent-teal"
                    title="Đánh dấu là đáp án đúng"
                  />
                  <input
                    value={opt.content}
                    onChange={(e) => updateOption(i, "content", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm"
                    placeholder={`Đáp án ${i + 1}`}
                  />
                  {form.options.length > 2 && (
                    <IconButton title="Xóa đáp án" onClick={() => removeOption(i)}>✕</IconButton>
                  )}
                </div>
              ))}
              <button onClick={addOption} className="text-xs text-teal hover:underline">+ Thêm đáp án</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#8A7C63]">Thời gian (giây)</label>
                <input type="number" min={5} max={120}
                  value={form.timeLimit}
                  onChange={(e) => { setForm(f => ({ ...f, timeLimit: e.target.value })); setError(null); }}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-[#8A7C63]">Điểm</label>
                <input type="number" min={10} max={500} step={10}
                  value={form.points}
                  onChange={(e) => { setForm(f => ({ ...f, points: e.target.value })); setError(null); }}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm"
                />
              </div>
            </div>

            {error && <p className="text-ticket text-sm">{error}</p>}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/5">
              <GhostButton onClick={closeModal}>Hủy</GhostButton>
              <PrimaryButton onClick={submit} disabled={saving}>
                {saving ? "Đang lưu..." : "Cập nhật"}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal open={confirm.open}
        title="Xóa câu hỏi"
        message={`Xóa "${confirm.item?.content?.slice(0, 60)}..."?`}
        onConfirm={doRemove}
        onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}
