import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { questionBankService } from '../../services/api.js'
import { GhostButton, Modal, PrimaryButton } from '../../components/ui'
import { GRADES, bankQuestionMatches, subjKey, subjLabel } from '../../lib/questionBankMeta.js'

/*
 * Modal "Lấy từ ngân hàng câu hỏi" — dùng ở tab Theo game khi một game
 * đang trống (hoặc giáo viên muốn bổ sung câu): chọn nhiều câu trong
 * collection `question_banks` rồi LIÊN KẾT vào game đang mở.
 *
 * Không chế endpoint mới: dùng đúng questionBankService.linkToGame /
 * bulkLink như nút "Vào game" của trang Ngân hàng (server tạo bản sao câu
 * vào collection `questions` kèm bankId và tự đồng bộ questionsCount).
 * Câu bank đã có trong game (bankId nằm trong linkedBankIds) bị khóa chọn
 * và ghi rõ "Đã có trong game" để giáo viên không chọn trùng.
 *
 * Bộ lọc (môn/lớp/tìm kiếm) dùng chung bankQuestionMatches +
 * questionBankMeta với trang Ngân hàng và mục Bộ đề — một nguồn sự thật.
 */

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-2.5 py-1.5 bg-paper text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'
const toolBtn = 'px-3 py-1.5 rounded-lg border text-sm font-body transition'
const PICK_LIMIT = 300

export default function BankQuestionPickerModal({ docs = [], subjects = [], gameId, gameName = '', linkedBankIds, showToast, onClose, onLinked }) {
  const [pSubj, setPSubj] = useState('all')
  const [pGrade, setPGrade] = useState(0)
  const [pSearch, setPSearch] = useState('')
  const [pickedIds, setPickedIds] = useState([])
  const [linking, setLinking] = useState(false)
  const [linkErr, setLinkErr] = useState('')

  const picked = useMemo(() => new Set(pickedIds), [pickedIds])
  const linked = useMemo(
    () => (linkedBankIds instanceof Set ? linkedBankIds : new Set(linkedBankIds || [])),
    [linkedBankIds],
  )

  const pickRows = useMemo(() => (docs || [])
    .filter((d) => bankQuestionMatches(d, subjKey(d), { subj: pSubj, grade: pGrade, search: pSearch })),
  [docs, pSubj, pGrade, pSearch])
  const pickShown = pickRows.slice(0, PICK_LIMIT)
  const selectableRows = useMemo(() => pickRows.filter((d) => !linked.has(d.id)), [pickRows, linked])

  const togglePick = (id) => setPickedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const pickAllFiltered = () => setPickedIds((s) => [...new Set([...s, ...selectableRows.map((d) => d.id)])])

  const doLink = async () => {
    if (!pickedIds.length || !gameId) return
    setLinking(true); setLinkErr('')
    try {
      const res = pickedIds.length > 1
        ? await questionBankService.bulkLink(pickedIds, gameId)
        : [await questionBankService.linkToGame(pickedIds[0], gameId)]
      const ok = res.filter((r) => r.success !== false).length
      const fail = res.length - ok
      if (ok > 0) {
        showToast?.(`Đã thêm ${ok} câu từ ngân hàng vào game${fail ? ` — ${fail} câu không thêm được (đã có hoặc lỗi)` : ''}`)
        onLinked?.()
        onClose?.()
      } else {
        setLinkErr('Không thêm được câu nào — các câu đã chọn có thể đã có trong game hoặc lỗi phía máy chủ.')
      }
    } catch {
      setLinkErr('Không thêm được câu nào — các câu đã chọn có thể đã có trong game hoặc lỗi phía máy chủ.')
    } finally {
      setLinking(false)
    }
  }

  return (
    <Modal open onClose={onClose} wide align="bottom" contentClassName="max-w-2xl !max-h-[92vh]">
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h2 className="font-display text-lg text-ink">Lấy từ ngân hàng câu hỏi</h2>
          <p className="text-sm text-[#8A7C63] leading-snug">
            Chọn câu trong ngân hàng để thêm vào game <strong className="text-ink">{gameName}</strong>.
            Câu được sao vào game kèm liên kết ngân hàng — sửa câu ở ngân hàng sau này vẫn đồng bộ sang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-gold/20 text-[#7A5B12] text-[11px] font-semibold">Đã chọn {pickedIds.length} câu</span>
          <span className="flex-1" />
          {pickedIds.length > 0 && (
            <button onClick={() => setPickedIds([])} className="text-[11px] text-red-600 hover:underline">Bỏ chọn tất cả</button>
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
          <button onClick={pickAllFiltered} disabled={!selectableRows.length}
            className={`${toolBtn} !py-1.5 !text-xs bg-paper border-ink/15 hover:border-ink/35 disabled:opacity-50`}>
            Chọn tất cả theo bộ lọc ({selectableRows.length})
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto border border-ink/10 rounded-lg divide-y divide-ink/10">
          {pickShown.map((d) => {
            const inGame = linked.has(d.id)
            return (
              <label key={d.id} className={`flex items-start gap-2.5 px-3 py-2 ${inGame ? 'opacity-60' : 'hover:bg-ink/5 cursor-pointer'}`}>
                <input type="checkbox" checked={inGame || picked.has(d.id)} disabled={inGame}
                  onChange={() => togglePick(d.id)} className="accent-teal mt-0.5" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-ink leading-snug">{d.content}</span>
                  <span className="block text-[11px] text-[#8A7C63]">{subjLabel(subjKey(d))} · Lớp {d.grade || 1}</span>
                </span>
                {inGame && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[11px] shrink-0">
                    <Check className="w-3 h-3" /> Đã có trong game
                  </span>
                )}
              </label>
            )
          })}
          {!pickShown.length && <p className="px-3 py-3 text-sm text-[#8A7C63]">Không có câu hỏi phù hợp bộ lọc.</p>}
          {pickRows.length > PICK_LIMIT && (
            <p className="px-3 py-2 text-[11px] text-[#8A7C63]">Đang hiện {PICK_LIMIT}/{pickRows.length} câu — thu hẹp bộ lọc để xem phần còn lại (nút “Chọn tất cả” vẫn tính đủ {selectableRows.length} câu chưa có trong game).</p>
          )}
        </div>

        <span className={label}>Câu đã chọn sẽ được thêm vào cuối danh sách câu hỏi của game.</span>
        {linkErr && <p className="text-sm text-ticket">{linkErr}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <GhostButton onClick={onClose} className="!px-4 !py-2 text-sm rounded-lg">Hủy</GhostButton>
          <PrimaryButton onClick={doLink} disabled={linking || !pickedIds.length} className="!px-4 !py-2 text-sm rounded-lg">
            {linking ? 'Đang thêm...' : `Thêm ${pickedIds.length} câu vào game`}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  )
}
