import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Eye, Layers, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { questionBankService } from '../../services/api.js'
import { ConfirmModal, GhostButton, Loader, Modal, PrimaryButton } from '../../components/ui'
import { GRADES, bankQuestionMatches, subjKey, subjLabel } from '../../lib/questionBankMeta.js'

/*
 * Mục BỘ ĐỀ trong trang Ngân hàng câu hỏi: đóng gói câu hỏi của bank thành
 * COMBO theo bài (vd "Tiếng Việt lớp 3" gồm N câu) — admin quản trị theo bộ,
 * học sinh thấy cả bộ như một thẻ luyện tập ở /question-sets.
 *
 * Panel này KHÔNG nạp lại câu hỏi: dùng chung `docs` + helper lọc
 * (bankQuestionMatches) của trang Ngân hàng để bộ chọn câu hỏi lọc đúng y
 * hệt danh sách câu hỏi. Xóa bộ chỉ xóa bộ — câu hỏi trong bank còn nguyên.
 */

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-2.5 py-1.5 bg-paper text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'
const toolBtn = 'px-3 py-1.5 rounded-lg border text-sm font-body transition'
const LET = 'ABCD'
const PICK_LIMIT = 300

const emptySetForm = () => ({ name: '', subject: 'viet', grade: '', description: '', questionIds: [] })

export default function QuestionSetsPanel({ docs = [], subjects = [], showToast }) {
  const [sets, setSets] = useState(null)
  const [loadErr, setLoadErr] = useState('')

  const [form, setForm] = useState(emptySetForm)
  const [editing, setEditing] = useState(null) // null = đóng; 'new' = tạo; object = bộ đang sửa
  const [formErr, setFormErr] = useState('')
  const [saving, setSaving] = useState(false)
  const [pSubj, setPSubj] = useState('all')
  const [pGrade, setPGrade] = useState(0)
  const [pSearch, setPSearch] = useState('')

  const [viewSet, setViewSet] = useState(null) // chi tiết bộ (kèm questions) đang xem
  const [viewBusy, setViewBusy] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)

  const load = useCallback(async () => {
    setLoadErr('')
    try {
      const list = await questionBankService.listSets()
      setSets(Array.isArray(list) ? list : [])
    } catch (e) {
      setLoadErr(e.message || 'Không đọc được danh sách bộ đề')
      setSets([])
    }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  const picked = useMemo(() => new Set(form.questionIds), [form.questionIds])

  const pickRows = useMemo(() => (docs || [])
    .filter((d) => bankQuestionMatches(d, subjKey(d), { subj: pSubj, grade: pGrade, search: pSearch })),
  [docs, pSubj, pGrade, pSearch])
  const pickShown = pickRows.slice(0, PICK_LIMIT)

  const togglePick = (id) => setForm((f) => ({
    ...f,
    questionIds: f.questionIds.includes(id) ? f.questionIds.filter((x) => x !== id) : [...f.questionIds, id],
  }))
  const pickAllFiltered = () => setForm((f) => ({
    ...f,
    questionIds: [...new Set([...f.questionIds, ...pickRows.map((d) => d.id)])],
  }))

  const openCreate = () => {
    setForm(emptySetForm()); setEditing('new'); setFormErr('')
    setPSubj('all'); setPGrade(0); setPSearch('')
  }
  const openEdit = async (s) => {
    setFormErr('')
    try {
      const detail = await questionBankService.getSet(s.id)
      setForm({
        name: detail.name || '', subject: subjKey(detail), grade: detail.grade ?? '',
        description: detail.description || '', questionIds: detail.questionIds || [],
      })
      setEditing(detail)
      setPSubj(detail.subject ? subjKey(detail) : 'all'); setPGrade(detail.grade || 0); setPSearch('')
    } catch (e) { showToast?.(e.message || 'Không đọc được bộ đề', 'error') }
  }

  const submit = async () => {
    if (!form.name.trim()) { setFormErr('Tên bộ đề là bắt buộc'); return }
    const payload = {
      name: form.name.trim(), subject: form.subject,
      grade: form.grade === '' ? null : Number(form.grade),
      description: form.description.trim(), questionIds: form.questionIds,
    }
    setSaving(true); setFormErr('')
    try {
      if (editing === 'new') { await questionBankService.createSet(payload); showToast?.('Đã tạo bộ đề') }
      else { await questionBankService.updateSet(editing.id, payload); showToast?.('Đã cập nhật bộ đề') }
      setEditing(null); load()
    } catch (e) { setFormErr(e.message || 'Không lưu được bộ đề') } finally { setSaving(false) }
  }

  const openView = async (s) => {
    setViewBusy(true)
    try { setViewSet(await questionBankService.getSet(s.id)) }
    catch (e) { showToast?.(e.message || 'Không đọc được bộ đề', 'error') }
    finally { setViewBusy(false) }
  }

  const removeSet = async () => {
    if (!confirmDel) return
    try {
      await questionBankService.removeSet(confirmDel.id)
      showToast?.('Đã xóa bộ đề — câu hỏi trong ngân hàng vẫn còn nguyên')
      setConfirmDel(null); load()
    } catch (e) { showToast?.(e.message || 'Không xóa được bộ đề', 'error') }
  }

  if (!sets) {
    return <div className="py-16 flex justify-center"><Loader label="Đang đọc danh sách bộ đề..." /></div>
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button onClick={openCreate} className={`${toolBtn} bg-ink text-paper border-ink font-semibold`}>+ Tạo bộ đề</button>
        <button onClick={load} className={`${toolBtn} bg-paper text-ink/70 border-ink/15 hover:border-ink/35 inline-flex items-center gap-1`}><RefreshCw className="w-3.5 h-3.5" /> Tải lại</button>
      </div>

      {loadErr && <p className="note-card p-2.5 bg-red-50 border-red-200 text-sm text-red-700">{loadErr}</p>}

      <p className="note-card p-2.5 text-xs text-[#8A7C63]">
        Bộ đề đóng gói nhiều câu của ngân hàng thành <strong className="text-ink">một combo</strong> — học sinh mở mục
        “Bộ đề luyện tập” sẽ thấy cả bộ (tên, môn, lớp, tổng số câu) và làm lần lượt hết các câu trong bộ.
      </p>

      {sets.length === 0 ? (
        <div className="note-card p-6 text-center text-sm text-[#8A7C63]">
          Chưa có bộ đề nào. Bấm “+ Tạo bộ đề” để đóng gói câu hỏi theo bài.
        </div>
      ) : (
        <div className="edu-grid">
          {sets.map((s) => (
            <article key={s.id} className="note-card p-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[11px] inline-flex items-center gap-1"><Layers className="w-3 h-3" /> Bộ đề</span>
                <span className="px-2 py-0.5 rounded-full bg-ink/5 text-ink/70 text-[11px]">{subjLabel(subjKey(s))}</span>
                <span className="px-2 py-0.5 rounded-full bg-ink/5 text-ink/70 text-[11px]">{s.grade ? `Lớp ${s.grade}` : 'Chưa phân lớp'}</span>
                <span className="flex-1" />
                {s.questionCount > 0
                  ? <span className="px-2 py-0.5 rounded-full bg-gold/20 text-[#7A5B12] text-[11px] font-semibold">{s.questionCount} câu</span>
                  : <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold">Bộ trống — 0 câu</span>}
              </div>

              <h3 className="font-display text-base text-ink leading-snug">{s.name}</h3>
              {s.description && <p className="text-[13px] text-ink/70 leading-snug">{s.description}</p>}

              <div className="flex flex-wrap gap-1.5 mt-auto pt-1 border-t border-ink/10">
                <button onClick={() => openView(s)} disabled={viewBusy}
                  className={`${toolBtn} inline-flex items-center gap-1 !px-2.5 !py-1 !text-xs bg-paper border-ink/15 hover:border-ink/35`}><Eye className="w-3 h-3" /> Xem câu trong bộ</button>
                <button onClick={() => openEdit(s)}
                  className={`${toolBtn} inline-flex items-center gap-1 !px-2.5 !py-1 !text-xs bg-paper border-ink/15 hover:border-ink/35`}><Pencil className="w-3 h-3" /> Sửa</button>
                <button onClick={() => setConfirmDel(s)}
                  className={`${toolBtn} inline-flex items-center gap-1 !px-2.5 !py-1 !text-xs bg-paper text-red-600 border-red-200 hover:bg-red-50`}><Trash2 className="w-3 h-3" /> Xóa</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Form tạo / sửa bộ */}
      {editing && (
        <Modal open onClose={() => setEditing(null)} wide align="bottom" contentClassName="max-w-2xl !max-h-[92vh]">
          <div className="p-4 sm:p-5 space-y-3.5">
            <h2 className="font-display text-lg text-ink">{editing === 'new' ? 'Tạo bộ đề' : 'Sửa bộ đề'}</h2>

            <label><span className={label}>Tên bộ đề *</span>
              <input className={box} value={form.name} placeholder="VD: Tiếng Việt lớp 3 — Ôn tập tuần 5"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <label><span className={label}>Môn</span>
                <select className={box} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
                  {subjects.map((k) => <option key={k} value={k}>{subjLabel(k)}</option>)}
                </select>
              </label>
              <label><span className={label}>Lớp</span>
                <select className={box} value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}>
                  <option value="">Chưa phân lớp</option>
                  {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
                </select>
              </label>
            </div>

            <label><span className={label}>Mô tả (tuỳ chọn)</span>
              <input className={box} value={form.description} placeholder="VD: Luyện từ và câu — chủ điểm gia đình"
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </label>

            {/* Bộ chọn câu hỏi — lọc giống hệt trang Ngân hàng */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={label + ' !mb-0'}>Câu hỏi trong bộ</span>
                <span className="px-2 py-0.5 rounded-full bg-gold/20 text-[#7A5B12] text-[11px] font-semibold">Đã chọn {form.questionIds.length} câu</span>
                <span className="flex-1" />
                {form.questionIds.length > 0 && (
                  <button onClick={() => setForm((f) => ({ ...f, questionIds: [] }))}
                    className="text-[11px] text-red-600 hover:underline">Bỏ chọn tất cả</button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select value={pSubj} onChange={(e) => setPSubj(e.target.value)} className={`${box} !w-auto`} aria-label="Lọc theo môn">
                  <option value="all">Tất cả môn</option>
                  {subjects.map((k) => <option key={k} value={k}>{subjLabel(k)}</option>)}
                </select>
                <select value={pGrade} onChange={(e) => setPGrade(Number(e.target.value))} className={`${box} !w-auto`} aria-label="Lọc theo lớp">
                  <option value={0}>Mọi lớp</option>
                  {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
                </select>
                <input type="search" value={pSearch} placeholder="Tìm câu hỏi..." onChange={(e) => setPSearch(e.target.value)}
                  className={`${box} flex-1 min-w-[140px] !w-auto`} />
                <button onClick={pickAllFiltered} disabled={!pickRows.length}
                  className={`${toolBtn} !py-1.5 !text-xs bg-paper border-ink/15 hover:border-ink/35 disabled:opacity-50`}>
                  Chọn tất cả theo bộ lọc ({pickRows.length})
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto border border-ink/10 rounded-lg divide-y divide-ink/10">
                {pickShown.map((d) => (
                  <label key={d.id} className="flex items-start gap-2.5 px-3 py-2 hover:bg-ink/5 cursor-pointer">
                    <input type="checkbox" checked={picked.has(d.id)} onChange={() => togglePick(d.id)} className="accent-teal mt-0.5" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-ink leading-snug">{d.content}</span>
                      <span className="block text-[11px] text-[#8A7C63]">{subjLabel(subjKey(d))} · Lớp {d.grade || 1}</span>
                    </span>
                  </label>
                ))}
                {!pickShown.length && <p className="px-3 py-3 text-sm text-[#8A7C63]">Không có câu hỏi phù hợp bộ lọc.</p>}
                {pickRows.length > PICK_LIMIT && (
                  <p className="px-3 py-2 text-[11px] text-[#8A7C63]">Đang hiện {PICK_LIMIT}/{pickRows.length} câu — thu hẹp bộ lọc để xem phần còn lại (nút “Chọn tất cả” vẫn tính đủ {pickRows.length} câu).</p>
                )}
              </div>
            </div>

            {formErr && <p className="text-sm text-ticket">{formErr}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <GhostButton onClick={() => setEditing(null)} className="!px-4 !py-2 text-sm rounded-lg">Hủy</GhostButton>
              <PrimaryButton onClick={submit} disabled={saving || !form.name.trim()} className="!px-4 !py-2 text-sm rounded-lg">
                {saving ? 'Đang lưu...' : editing === 'new' ? 'Tạo bộ đề' : 'Cập nhật bộ đề'}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Xem câu trong bộ */}
      {viewSet && (
        <Modal open onClose={() => setViewSet(null)} wide align="bottom" contentClassName="max-w-2xl !max-h-[92vh]">
          <div className="p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-lg text-ink">{viewSet.name}</h2>
            <p className="text-xs text-[#8A7C63]">
              {subjLabel(subjKey(viewSet))} · {viewSet.grade ? `Lớp ${viewSet.grade}` : 'Chưa phân lớp'} · {(viewSet.questions || []).length} câu
            </p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {(viewSet.questions || []).map((q, i) => (
                <div key={q.id} className="note-card p-3 space-y-1.5">
                  <p className="text-sm text-ink leading-snug"><strong>Câu {i + 1}.</strong> {q.content}</p>
                  <ol className="space-y-0.5 text-[13px]">
                    {(q.options || []).map((o, oi) => {
                      const ok = o.id === q.correctAnswer
                      return (
                        <li key={o.id || oi} className={ok ? 'text-teal font-medium' : 'text-ink/75'}>
                          <span className="inline-flex items-center gap-1">{LET[oi]}. {o.content}{ok ? <Check className="w-3 h-3" /> : ''}</span>
                        </li>
                      )
                    })}
                  </ol>
                  {q.explanation && <p className="text-[11px] text-[#8A7C63]">{q.explanation}</p>}
                </div>
              ))}
              {!(viewSet.questions || []).length && (
                <p className="text-sm text-[#8A7C63]">Bộ này đang trống — chưa có câu hỏi nào còn tồn tại trong ngân hàng.</p>
              )}
            </div>
            <div className="flex justify-end">
              <GhostButton onClick={() => setViewSet(null)} className="!px-4 !py-2 text-sm rounded-lg">Đóng</GhostButton>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal open={!!confirmDel} title="Xóa bộ đề"
        message={confirmDel ? `Xóa bộ “${confirmDel.name}”? Chỉ xóa bộ đề — các câu hỏi trong ngân hàng vẫn còn nguyên.` : ''}
        onConfirm={removeSet}
        onClose={() => setConfirmDel(null)} />
    </div>
  )
}
