import { useCallback, useEffect, useState } from 'react'
import { gameService, questionService } from '../../services/api.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, Modal, PrimaryButton, GhostButton, Loader, EmptyState } from '../../components/ui.jsx'

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

const EMPTY_Q = { content: "", options: [{ id: "", content: "" }, { id: "", content: "" }, { id: "", content: "" }], correctAnswer: "", timeLimit: 15, points: 100 };

export default function QuestionManagement({ showToast }) {
  const [games, setGames] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_Q, options: EMPTY_Q.options.map(o => ({ ...o })) });
  const [editingIdx, setEditingIdx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, item: null });

  const loadGames = useCallback(() => {
    setGames(null); setError(null);
    gameService.list().then(setGames).catch(e => setError(e.message));
  }, []);
  useEffect(() => { loadGames(); }, [loadGames]);

  const loadQuestions = useCallback(() => {
    if (!selectedGame) { setQuestions(null); return; }
    setQuestions(null); setError(null);
    questionService.listByGame(selectedGame).then(setQuestions).catch(e => setError(e.message));
  }, [selectedGame]);
  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const selectGame = (gameId) => {
    setSelectedGame(gameId || null);
    setQuestions(null);
    setModalOpen(false);
    setEditingIdx(null);
  };

  const openCreate = () => {
    setForm({ content: "", options: [{ id: uid("ans"), content: "" }, { id: uid("ans"), content: "" }, { id: uid("ans"), content: "" }], correctAnswer: "", timeLimit: 15, points: 100 });
    setEditingIdx(null); setError(null); setModalOpen(true);
  };
  const openEdit = (q, idx) => {
    setForm({
      content: q.content || "",
      options: (q.options || []).map(o => ({ id: o.id || uid("ans"), content: o.content || "" })),
      correctAnswer: q.correctAnswer || "",
      timeLimit: q.timeLimit || 15,
      points: q.points || 100,
    });
    setEditingIdx(idx); setError(null); setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setError(null); };

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

    setSaving(true); setError(null);
    try {
      const q = {
        content: form.content.trim(),
        options: validOpts,
        correctAnswer: form.correctAnswer,
        timeLimit: Number(form.timeLimit) || 15,
        points: Number(form.points) || 100,
      };
      let updated;
      if (editingIdx !== null) {
        updated = [...questions];
        updated[editingIdx] = { ...updated[editingIdx], ...q };
        showToast("Đã cập nhật câu hỏi");
      } else {
        updated = [...(questions || []), { id: uid("question"), ...q }];
        showToast("Đã thêm câu hỏi mới");
      }
      await questionService.save(selectedGame, updated);
      closeModal(); loadQuestions();
    } catch (err) {
      setError(err.message || "Lỗi lưu");
    } finally {
      setSaving(false);
    }
  };

  const confirmRemove = (q, idx) => setConfirm({ open: true, item: { q, idx } });
  const doRemove = async () => {
    try {
      const updated = questions.filter((_, i) => i !== confirm.item.idx);
      await questionService.save(selectedGame, updated);
      showToast("Đã xóa câu hỏi");
      setConfirm({ open: false, item: null }); loadQuestions();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  const confirmRemoveAll = () => setConfirm({ open: true, item: { _all: true } });
  const doRemoveAll = async () => {
    try {
      await questionService.removeAll();
      showToast("Đã xóa tất cả câu hỏi");
      setConfirm({ open: false, item: null }); loadQuestions();
    } catch (err) { showToast(err.message || "Lỗi xóa", "error"); }
  };

  const selectedGameObj = games?.find(g => g._id === selectedGame);

  return (
    <div className="space-y-6">
      <ManagementHeader subtitle="Quản lý câu hỏi" title="Questions" />

      <div className="note-card p-4 bg-paper2">
        <label className="text-xs font-mono uppercase text-[#8A7C63]">Chọn trò chơi</label>
        <select
          value={selectedGame || ""}
          onChange={(e) => selectGame(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm"
        >
          <option value="">-- Chọn game --</option>
          {games?.map(g => (
            <option key={g._id} value={g._id}>{g.name} ({g.questionsCount || 0} câu)</option>
          ))}
        </select>
      </div>

      {!selectedGame && games && (
        <EmptyState icon="📝" title="Chọn trò chơi" subtitle="Chọn một trò chơi để quản lý câu hỏi" />
      )}

      {selectedGame && (
        <ManagementTable
          title={`Câu hỏi — ${selectedGameObj?.name || ""}`}
          data={questions}
          error={error && !questions ? error : null}
          onRetry={loadQuestions}
          emptyLabel="Chưa có câu hỏi nào."
          onCreate={openCreate}
          onRemoveAll={questions && questions.length > 0 ? confirmRemoveAll : null}
          headers={["#", "Nội dung", "Đáp án đúng", "Thời gian", "Điểm", ""]}
          renderRow={(q, idx) => (
            <tr key={q.id || idx} className="border-b border-ink/5 last:border-0">
              <td className="px-4 py-2 text-sm text-[#8A7C63]">{idx + 1}</td>
              <td className="px-4 py-2 text-sm max-w-xs truncate">{q.content}</td>
              <td className="px-4 py-2 text-sm">
                {q.options?.find(o => o.id === q.correctAnswer)?.content || "—"}
              </td>
              <td className="px-4 py-2 text-sm">{q.timeLimit}s</td>
              <td className="px-4 py-2 text-sm">{q.points}</td>
              <td className="px-4 py-2">
                <div className="flex items-center justify-end gap-1">
                  <IconButton title="Chỉnh sửa" onClick={() => openEdit(q, idx)}>✏️</IconButton>
                  <IconButton title="Xóa" onClick={() => confirmRemove(q, idx)}>🗑️</IconButton>
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {modalOpen && (
        <Modal wide open={modalOpen} onClose={closeModal}>
          <div className="p-6 space-y-4">
            <h2 className="font-display text-lg text-ink">{editingIdx !== null ? "Sửa câu hỏi" : "Thêm câu hỏi"}</h2>

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
                {saving ? "Đang lưu..." : editingIdx !== null ? "Cập nhật" : "Thêm mới"}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal open={confirm.open}
        title={confirm.item?._all ? "Xóa tất cả câu hỏi" : "Xóa câu hỏi"}
        message={confirm.item?._all
          ? "Xóa TẤT CẢ câu hỏi trên toàn hệ thống?"
          : `Xóa "${confirm.item?.q?.content?.slice(0, 60)}..."?`}
        onConfirm={confirm.item?._all ? doRemoveAll : doRemove}
        onClose={() => setConfirm({ open: false, item: null })} />
    </div>
  );
}
