import { useCallback, useEffect, useMemo, useState } from 'react'
import { gameService, questionBankService } from '../../services/api.js'
import { IconButton, ManagementHeader, ManagementTable, ConfirmModal, Modal, PrimaryButton, GhostButton } from '../../components/ui.jsx'

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`
const EMPTY_Q = { content: "", options: [{ id: uid("ans"), content: "" }, { id: uid("ans"), content: "" }], correctAnswer: "", timeLimit: 15, points: 100, subject: "", category: "", difficulty: "medium", tags: [] }

export default function QuestionBankManagement({ showToast }) {
  const [questions, setQuestions] = useState(null)
  const [games, setGames] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('')
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_Q, options: EMPTY_Q.options.map(o => ({ ...o })) })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirm, setConfirm] = useState({ open: false, item: null, type: 'single' })
  const [linkModal, setLinkModal] = useState({ open: false, q: null, selectedGames: [] })
  const [bulkLink, setBulkLink] = useState([]) // selected bankIds for bulk link

  const load = useCallback(async () => {
    setQuestions(null); setError(null)
    try {
      const [qs, gs, st] = await Promise.all([
        questionBankService.list().catch(() => []),
        gameService.list().catch(() => []),
        questionBankService.stats().catch(() => null),
      ])
      setQuestions(Array.isArray(qs) ? qs : [])
      setGames(Array.isArray(gs) ? gs : [])
      setStats(st)
    } catch (e) { setError(e.message) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    if (!questions) return null
    let list = questions
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(q => q.content?.toLowerCase().includes(s) || q.options?.some(o => o.content?.toLowerCase().includes(s)))
    }
    if (filterSubject) list = list.filter(q => q.subject === filterSubject)
    if (filterDifficulty) list = list.filter(q => q.difficulty === filterDifficulty)
    return list
  }, [questions, search, filterSubject, filterDifficulty])

  const subjects = useMemo(() => [...new Set((questions || []).map(q => q.subject).filter(Boolean))], [questions])

  const openCreate = () => {
    setForm({ content: "", options: [{ id: uid("ans"), content: "" }, { id: uid("ans"), content: "" }], correctAnswer: "", timeLimit: 15, points: 100, subject: "", category: "", difficulty: "medium", tags: [] })
    setEditing(null); setError(null); setModalOpen(true)
  }
  const openEdit = (q) => {
    setForm({
      content: q.content || "",
      options: (q.options || []).map(o => ({ id: o.id || uid("ans"), content: o.content || "" })),
      correctAnswer: q.correctAnswer || "",
      timeLimit: q.timeLimit || 15,
      points: q.points || 100,
      subject: q.subject || "",
      category: q.category || "",
      difficulty: q.difficulty || "medium",
      tags: q.tags || [],
    })
    setEditing(q); setError(null); setModalOpen(true)
  }
  const closeModal = () => { setModalOpen(false); setEditing(null); setError(null) }

  const updateOption = (idx, val) => {
    setForm(f => {
      const opts = [...f.options]
      opts[idx] = { ...opts[idx], content: val }
      return { ...f, options: opts }
    })
  }
  const addOption = () => setForm(f => ({ ...f, options: [...f.options, { id: uid("ans"), content: "" }] }))
  const removeOption = (idx) => setForm(f => {
    const opts = f.options.filter((_, i) => i !== idx)
    const correctAnswer = f.correctAnswer === f.options[idx]?.id ? "" : f.correctAnswer
    return { ...f, options: opts, correctAnswer }
  })

  const submit = async () => {
    if (!form.content.trim()) { setError("Nhập nội dung câu hỏi"); return }
    const validOpts = form.options.filter(o => o.content.trim())
    if (validOpts.length < 2) { setError("Cần ít nhất 2 đáp án"); return }
    if (!form.correctAnswer) { setError("Chọn đáp án đúng"); return }
    setSaving(true); setError(null)
    try {
      if (editing) {
        const updated = await questionBankService.update(editing.id, {
          content: form.content.trim(),
          options: validOpts,
          correctAnswer: form.correctAnswer,
          timeLimit: Number(form.timeLimit) || 15,
          points: Number(form.points) || 100,
          subject: form.subject,
          category: form.category,
          difficulty: form.difficulty,
          tags: form.tags,
        })
        showToast?.(`Đã cập nhật & đồng bộ tới games (${updated?.id ? 'ok' : ''})`)
      } else {
        await questionBankService.create({
          content: form.content.trim(),
          options: validOpts,
          correctAnswer: form.correctAnswer,
          timeLimit: Number(form.timeLimit) || 15,
          points: Number(form.points) || 100,
          subject: form.subject,
          category: form.category,
          difficulty: form.difficulty,
          tags: form.tags,
        })
        showToast?.("Đã thêm câu hỏi vào bank")
      }
      closeModal(); load()
    } catch (err) { setError(err.message || "Lỗi lưu") }
    finally { setSaving(false) }
  }

  const confirmRemove = (q) => setConfirm({ open: true, item: q, type: 'single' })
  const confirmRemoveAll = () => setConfirm({ open: true, item: null, type: 'all' })
  const doRemove = async () => {
    try {
      if (confirm.type === 'all') {
        await questionBankService.removeAll()
        showToast?.("Đã xóa toàn bộ bank")
      } else {
        await questionBankService.remove(confirm.item.id)
        showToast?.("Đã xóa câu hỏi")
      }
      setConfirm({ open: false, item: null, type: 'single' }); load()
    } catch (err) { showToast?.(err.message || "Lỗi xóa", "error") }
  }

  const doSync = async (q) => {
    try {
      const r = await questionBankService.sync(q.id)
      showToast?.(`Đã đồng bộ ${r.modified} bản sao trong games`)
    } catch (err) { showToast?.(err.message || "Lỗi sync", "error") }
  }

  const openLink = (q) => setLinkModal({ open: true, q, selectedGames: [] })
  const toggleGameSelect = (gid) => setLinkModal(m => ({ ...m, selectedGames: m.selectedGames.includes(gid) ? m.selectedGames.filter(x => x !== gid) : [...m.selectedGames, gid] }))
  const doLink = async () => {
    if (!linkModal.q || linkModal.selectedGames.length === 0) return
    try {
      let success = 0
      for (const gid of linkModal.selectedGames) {
        try { await questionBankService.linkToGame(linkModal.q.id, gid); success++ } catch (e) { showToast?.(`${e.message}`, "error") }
      }
      showToast?.(`Đã thêm vào ${success}/${linkModal.selectedGames.length} game`)
      setLinkModal({ open: false, q: null, selectedGames: [] })
    } catch (e) { showToast?.(e.message || "Lỗi link", "error") }
  }

  const toggleBulk = (id) => setBulkLink(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  const doBulkLink = async () => {
    if (bulkLink.length === 0) { showToast?.("Chọn ít nhất 1 câu hỏi", "error"); return }
    // reuse linkModal selectedGames
    if (!linkModal.selectedGames.length) { showToast?.("Chọn game để thêm", "error"); return }
    for (const gid of linkModal.selectedGames) {
      const res = await questionBankService.bulkLink(bulkLink, gid)
      const ok = res.filter(r => r.success).length
      showToast?.(`Game ${games.find(g => g._id === gid)?.name || gid}: ${ok}/${bulkLink.length} ok`)
    }
    setBulkLink([])
    setLinkModal({ open: false, q: null, selectedGames: [] })
  }

  return (
    <div>
      <ManagementHeader subtitle="Ngân hàng câu hỏi độc lập — chỉnh ở đây sẽ tự đồng bộ tới các game đã liên kết (qua bankId)" title="Question Bank" />

      {stats && (
        <div className="note-card p-3 bg-paper2 mb-4 flex flex-wrap gap-4 text-xs text-[#8A7C63]">
          <span>Tổng bank: <strong>{stats.total}</strong></span>
          <span>|</span>
          <span>Đã liên kết: <strong>{stats.linkedCount}</strong> bản sao trong games</span>
          <span>|</span>
          <span>Số bankId đã dùng: <strong>{stats.linkedGames}</strong></span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="note-card p-3 bg-paper2 flex-1 min-w-[180px]">
          <label className="text-xs font-mono uppercase text-[#8A7C63]">Tìm kiếm</label>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nội dung câu hỏi..." className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm" />
        </div>
        <div className="note-card p-3 bg-paper2 min-w-[160px]">
          <label className="text-xs font-mono uppercase text-[#8A7C63]">Môn học</label>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm">
            <option value="">-- Tất cả --</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="note-card p-3 bg-paper2 min-w-[150px]">
          <label className="text-xs font-mono uppercase text-[#8A7C63]">Độ khó</label>
          <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm">
            <option value="">-- Tất cả --</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
        </div>
      </div>

      <ManagementTable
        title="Ngân hàng câu hỏi"
        data={filtered}
        error={error && !questions ? error : null}
        onRetry={load}
        emptyLabel="Chưa có câu hỏi nào trong bank."
        onCreate={openCreate}
        onRemoveAll={filtered && filtered.length > 0 ? confirmRemoveAll : null}
        headers={["", "#", "Nội dung", "Môn", "Đáp án đúng", "Điểm", "Khó", ""]}
        renderRow={(q, idx) => (
          <tr key={q.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[.02]">
            <td className="px-2 py-2"><input type="checkbox" checked={bulkLink.includes(q.id)} onChange={() => toggleBulk(q.id)} /></td>
            <td className="px-2 py-2 text-sm text-[#8A7C63]">{idx + 1}</td>
            <td className="px-4 py-2 text-sm max-w-xs truncate">{q.content}</td>
            <td className="px-4 py-2 text-xs"><span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal">{q.subject || "—"}</span></td>
            <td className="px-4 py-2 text-sm">{q.options?.find(o => o.id === q.correctAnswer)?.content || "—"}</td>
            <td className="px-4 py-2 text-sm">{q.points}</td>
            <td className="px-4 py-2 text-xs">{q.difficulty}</td>
            <td className="px-4 py-2">
              <div className="flex items-center justify-end gap-1">
                <IconButton title="Thêm vào game" onClick={() => openLink(q)}>🔗</IconButton>
                <IconButton title="Đồng bộ tới games" onClick={() => doSync(q)}>🔄</IconButton>
                <IconButton title="Sửa" onClick={() => openEdit(q)}>✏️</IconButton>
                <IconButton title="Xóa" onClick={() => confirmRemove(q)}>🗑️</IconButton>
              </div>
            </td>
          </tr>
        )}
      />

      {bulkLink.length > 0 && (
        <div className="note-card p-3 bg-amber-50 border border-amber-200 mt-3 flex items-center gap-3">
          <span className="text-sm font-semibold text-amber-700">Đã chọn {bulkLink.length} câu hỏi</span>
          <button onClick={() => setLinkModal({ open: true, q: { id: '__bulk__', content: `${bulkLink.length} câu hỏi` }, selectedGames: [] })} className="ml-auto px-3 py-1.5 bg-teal text-white rounded-lg text-xs font-semibold">Thêm vào game...</button>
          <button onClick={() => setBulkLink([])} className="px-3 py-1.5 bg-white border border-ink/10 rounded-lg text-xs">Bỏ chọn</button>
        </div>
      )}

      {modalOpen && (
        <Modal wide open={modalOpen} onClose={closeModal}>
          <div className="p-6 space-y-4">
            <h2 className="font-display text-lg text-ink">{editing ? "Sửa câu hỏi Bank" : "Thêm câu hỏi vào Bank"}</h2>
            <p className="text-xs text-[#8A7C63]">Lưu ý: khi cập nhật, mọi game đã liên kết qua <code>bankId</code> sẽ tự động đồng bộ nội dung.</p>
            <div>
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Nội dung *</label>
              <textarea value={form.content} onChange={e => { setForm(f => ({ ...f, content: e.target.value })); setError(null) }} className="w-full mt-1 px-3 py-2 rounded-lg border border-ink/10 bg-white text-sm" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-mono uppercase text-[#8A7C63]">Môn học</label><input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm" placeholder="Toán, Văn..." /></div>
              <div><label className="text-xs font-mono uppercase text-[#8A7C63]">Độ khó</label>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm">
                  <option value="easy">Dễ</option><option value="medium">Trung bình</option><option value="hard">Khó</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#8A7C63]">Đáp án ({form.options.length})</label>
              {form.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input type="radio" name="correctAnswer" checked={form.correctAnswer === opt.id} onChange={() => { setForm(f => ({ ...f, correctAnswer: opt.id })); setError(null) }} className="accent-teal" />
                  <input value={opt.content} onChange={e => updateOption(i, e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm" placeholder={`Đáp án ${i + 1}`} />
                  {form.options.length > 2 && <IconButton title="Xóa" onClick={() => removeOption(i)}>✕</IconButton>}
                </div>
              ))}
              <button onClick={addOption} className="text-xs text-teal hover:underline">+ Thêm đáp án</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-mono uppercase text-[#8A7C63]">Thời gian (giây)</label><input type="number" min={5} max={120} value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: e.target.value }))} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm" /></div>
              <div><label className="text-xs font-mono uppercase text-[#8A7C63]">Điểm</label><input type="number" min={10} max={500} step={10} value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} className="w-full mt-1 px-3 py-1.5 rounded-lg border border-ink/10 bg-white text-sm" /></div>
            </div>
            {error && <p className="text-ticket text-sm">{error}</p>}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/5">
              <GhostButton onClick={closeModal}>Hủy</GhostButton>
              <PrimaryButton onClick={submit} disabled={saving}>{saving ? "Đang lưu..." : editing ? "Cập nhật & Đồng bộ" : "Thêm mới"}</PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {linkModal.open && (
        <Modal open={linkModal.open} onClose={() => setLinkModal({ open: false, q: null, selectedGames: [] })}>
          <div className="p-6 space-y-4">
            <h3 className="font-display text-lg text-ink">Thêm vào game</h3>
            <p className="text-sm text-[#8A7C63] truncate">{linkModal.q?.content}</p>
            <div className="max-h-64 overflow-y-auto border border-ink/10 rounded-lg divide-y">
              {games?.map(g => (
                <label key={g._id} className="flex items-center gap-3 px-3 py-2 hover:bg-ink/5 cursor-pointer">
                  <input type="checkbox" checked={linkModal.selectedGames.includes(g._id)} onChange={() => toggleGameSelect(g._id)} />
                  <span className="text-sm flex-1">{g.name}</span>
                  <span className="text-xs text-[#8A7C63]">{g.questionsCount || 0} câu</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <GhostButton onClick={() => setLinkModal({ open: false, q: null, selectedGames: [] })}>Hủy</GhostButton>
              <PrimaryButton onClick={linkModal.q?.id === '__bulk__' ? doBulkLink : doLink} disabled={linkModal.selectedGames.length === 0}>
                Thêm ({linkModal.selectedGames.length} game)
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal open={confirm.open} title={confirm.type === 'all' ? "Xóa toàn bộ Bank" : "Xóa câu hỏi Bank"} message={confirm.type === 'all' ? "Xóa tất cả câu hỏi trong bank? Các bản sao trong games sẽ mất liên kết bankId." : `Xóa "${confirm.item?.content?.slice(0, 60)}..."?`} onConfirm={doRemove} onClose={() => setConfirm({ open: false, item: null, type: 'single' })} />
    </div>
  )
}
