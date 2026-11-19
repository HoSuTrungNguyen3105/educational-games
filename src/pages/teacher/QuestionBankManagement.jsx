import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, FileDown, FolderOpen, Link2, MessageSquare, RefreshCw, Rocket, Sparkles, Upload, Volume2 } from 'lucide-react'
import { questionBankService } from '../../services/api.js'
import { AiGenerateQuestionsModal } from '../../components/ai/AiGenerateQuestionsModal.jsx'
import { toBankQuestion } from '../../lib/bankQuestionShape.js'
import { BulkDeleteBar, ConfirmModal, GhostButton, Loader, ManagementHeader, Modal, PrimaryButton } from '../../components/ui'
import RangePagination from '../../components/RangePagination.jsx'
import { useRangePager } from '../../hooks/useRangePager.js'
import { bulkInChunks, useBulkSelection } from '../../lib/hooks.js'
import { GRADES, SK, SK_KEYS, subjKey, subjLabel } from '../../lib/questionBankMeta.js'
import QuestionSetsPanel from './QuestionSetsPanel.jsx'
import GameQuestionsPanel from './GameQuestionsPanel.jsx'

/*
 * Ngân hàng câu hỏi — bản React của mục "bank" trong src/games/_tools/admin.html.
 *
 * Khác biệt cốt lõi: tool cũ đọc/ghi localStorage của một trình duyệt, còn trang
 * này đọc/ghi collection `question_banks` qua API, nên dữ liệu dùng chung cho mọi
 * máy và "Áp dụng vào game" là link thật (bankId) thay vì ghi đè file lưu.
 *
 * Chuẩn dữ liệu giữ nguyên như tool cũ để tệp CSV/JSON cũ nhập được:
 *  · 2–4 đáp án khác rỗng, không trùng nhau (không tính hoa thường)
 *  · phải chọn được đáp án đúng
 *  · lớp 1–5, emoji tuỳ chọn, giải thích tuỳ chọn, giọng đọc vi-VN / en-US
 */

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`
const LANGS = { 'vi-VN': 'Tiếng Việt', 'en-US': 'Tiếng Anh' }
const LET = 'ABCD'

/* Cỡ trang lưới thẻ câu hỏi — như lưới ảnh ở trang Thư viện ảnh (PR #149). */
const PER_PAGE = 20

/* Cột CSV giống trang admin cũ — tệp xuất từ đó nhập sang đây không cần sửa. */
const CSVH = ['mon', 'lop', 'cau_hoi', 'dap_an_dung', 'sai_1', 'sai_2', 'sai_3', 'bieu_tuong', 'giai_thich', 'ngon_ngu']

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-2.5 py-1.5 bg-paper text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'
const toolBtn = 'px-3 py-1.5 rounded-lg border text-sm font-body transition'

/** Luật của tool cũ (qIssues) áp lên document trong DB. */
function qIssues(q) {
  const er = []
  if (!q?.content?.trim()) er.push('thiếu câu hỏi')
  const opts = (q?.options || []).map((o) => String(o?.content || '').trim())
  if (opts.length < 2 || opts.length > 4 || opts.some((t) => !t)) er.push('cần 2–4 đáp án không rỗng')
  else {
    const ci = opts.findIndex((_, i) => q.options[i]?.id === q.correctAnswer)
    if (ci < 0) er.push('đáp án đúng không hợp lệ')
    if (new Set(opts.map((t) => t.toLowerCase())).size < opts.length) er.push('có đáp án trùng nhau')
  }
  if (q?.grade != null && !GRADES.includes(Number(q.grade))) er.push('lớp phải từ 1 đến 5')
  return er
}
const correctText = (q) => String(q?.options?.find((o) => o.id === q.correctAnswer)?.content || '').trim()

/* ── CSV ─────────────────────────────────────────────────────────────────── */
const csvQ = (v) => (/[",\n]/.test(v) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v))

function toCSV(docs) {
  const rows = [CSVH.join(',')]
  docs.forEach((d) => {
    const right = correctText(d)
    const wr = (d.options || []).map((o) => String(o.content || '').trim()).filter((t) => t && t.toLowerCase() !== right.toLowerCase())
    rows.push([subjKey(d), d.grade || 1, d.content, right, wr[0] || '', wr[1] || '', wr[2] || '', d.icon || '', d.explanation || '', d.lang || 'vi-VN'].map(csvQ).join(','))
  })
  return '\ufeff' + rows.join('\r\n')
}

function parseCSV(t) {
  t = t.replace(/^\ufeff/, '')
  const rows = []
  let row = [], f = '', q = false
  for (let i = 0; i < t.length; i++) {
    const c = t[i]
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++ } else q = false } else f += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(f); f = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(f); f = ''; rows.push(row); row = [] }
    else f += c
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row) }
  return rows.filter((r) => r.some((x) => x.trim()))
}

/** CSV → mảng document DB. Dòng thiếu dữ liệu bị bỏ và báo lại theo số dòng. */
function fromCSV(text) {
  const rows = parseCSV(text)
  if (rows.length < 2) throw new Error('File CSV trống hoặc thiếu dòng dữ liệu.')
  const h = rows[0].map((x) => x.trim().toLowerCase())
  const idx = (n) => h.indexOf(n)
  if (idx('cau_hoi') < 0 || idx('dap_an_dung') < 0) throw new Error('Thiếu cột "cau_hoi" hoặc "dap_an_dung". Hãy dùng mẫu CSV.')
  const name2id = {}
  SK_KEYS.forEach((k) => { name2id[k] = k; name2id[SK[k].toLowerCase()] = k })
  const out = [], skipped = []
  rows.slice(1).forEach((r, n) => {
    const g = (nm) => (r[idx(nm)] ?? '').trim()
    const s = name2id[g('mon').toLowerCase()] || g('mon') || 'custom'
    const right = g('dap_an_dung')
    const wr = [g('sai_1'), g('sai_2'), g('sai_3')].filter(Boolean)
    if (!g('cau_hoi') || !right || wr.length < 1) { skipped.push(n + 2); return }
    const ids = [uid('ans'), ...wr.map(() => uid('ans'))]
    out.push({
      content: g('cau_hoi'),
      options: [right, ...wr].map((content, i) => ({ id: ids[i], content })),
      correctAnswer: ids[0],
      subject: s,
      grade: Math.min(5, Math.max(1, parseInt(g('lop'), 10) || 1)),
      icon: g('bieu_tuong'),
      explanation: g('giai_thich'),
      lang: g('ngon_ngu') === 'en-US' ? 'en-US' : 'vi-VN',
    })
  })
  return { out, skipped }
}

/**
 * JSON nhập được ở hai hình:
 *  · mảng document DB (hình trang này Xuất ra)
 *  · hình ngân hàng của tool cũ: { viet: [{ q, a, c, g, icon, e, lang }], ... }
 */
function fromJSON(text) {
  const v = JSON.parse(text)
  if (Array.isArray(v)) return { out: v.map(normaliseImport), skipped: [] }
  if (v && typeof v === 'object') {
    if (Array.isArray(v.questions)) return { out: v.questions.map(normaliseImport), skipped: [] }
    const out = []
    SK_KEYS.concat([...new Set(Object.keys(v).filter((k) => Array.isArray(v[k])))]).forEach((k) => {
      (v[k] || []).forEach((q) => {
        if (!q || typeof q.q !== 'string') return
        const ids = (q.a || []).map(() => uid('ans'))
        out.push({
          content: q.q.trim(),
          options: (q.a || []).map((content, i) => ({ id: ids[i], content: String(content) })),
          correctAnswer: ids[Number(q.c) || 0],
          subject: k,
          grade: GRADES.includes(Number(q.g)) ? Number(q.g) : 1,
          icon: q.icon || '', explanation: q.e || '', lang: q.lang === 'en-US' ? 'en-US' : 'vi-VN',
        })
      })
    })
    return { out, skipped: [] }
  }
  throw new Error('JSON phải là mảng câu hỏi hoặc object theo môn.')
}

function normaliseImport(d) {
  const opts = (d.options || []).map((o) => ({ id: o.id || uid('ans'), content: String(o.content ?? '').trim() })).filter((o) => o.content)
  return {
    content: String(d.content || '').trim(),
    options: opts,
    correctAnswer: d.correctAnswer || opts[0]?.id || '',
    subject: d.subject || '',
    grade: d.grade ?? null,
    icon: d.icon || '',
    explanation: d.explanation || '',
    lang: d.lang === 'en-US' ? 'en-US' : 'vi-VN',
    difficulty: d.difficulty || 'medium',
    timeLimit: Number(d.timeLimit) || 15,
    points: Number(d.points) || 100,
  }
}

const emptyForm = () => ({
  subject: 'viet', grade: 3, icon: '', lang: 'vi-VN', content: '',
  options: [0, 1, 2, 3].map(() => ({ id: uid('ans'), content: '' })),
  correctAnswer: '', difficulty: 'medium', timeLimit: 15, points: 100, explanation: '',
})

function download(name, text, type = 'application/json') {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([text], { type }))
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(a.href)
}

export default function QuestionBankManagement({ showToast }) {
  // Tab "sets" = mục Bộ đề (combo đóng gói theo bài) — panel riêng dùng
  // chung danh sách câu hỏi + helper lọc của trang này.
  // Tab "byGame" = câu hỏi theo game (collection `questions`) — phần thay
  // cho trang /dashboard/questions đã gỡ. Link cũ /dashboard/all-questions
  // được TeacherApp chuyển hướng sang đây kèm sessionStorage 'edu_qb_open':
  // có seed (mọi giá trị — kể cả 'all' do bản cũ ghi, từ khi góc nhìn
  // "Tất cả câu hỏi" đã gỡ) thì mở thẳng tab Theo game, vì đó là nơi link
  // cũ trỏ tới. Seed chỉ dùng một lần rồi xoá ngay khi trang mở.
  const [tab, setTab] = useState(() => {
    try { return sessionStorage.getItem('edu_qb_open') ? 'byGame' : 'questions' } catch { return 'questions' }
  })
  useEffect(() => {
    try { sessionStorage.removeItem('edu_qb_open') } catch { /* bỏ qua */ }
  }, [])
  const [docs, setDocs] = useState(null)
  const [games, setGames] = useState([])
  const [stats, setStats] = useState(null)
  const [loadErr, setLoadErr] = useState(null)

  const [fSubj, setFSubj] = useState('all')
  const [fGrade, setFGrade] = useState(0)
  const [fBad, setFBad] = useState(false)
  const [search, setSearch] = useState('')

  /* Danh sách câu hỏi hiển thị được PHÂN TRANG PHÍA SERVER (listPaged):
   * server lọc môn/lớp/tìm kiếm/câu-lỗi TRƯỚC khi cắt đoạn nên listTotal
   * là tổng đã lọc. `docs` (toàn bộ bank) vẫn nạp riêng cho ma trận môn ×
   * lớp, bộ đếm trùng/lỗi, xuất CSV/JSON và các panel con (bộ chọn câu
   * của Bộ đề, modal lấy câu của Theo game) — các phần đó cần toàn bộ
   * dữ liệu như trước. Tìm kiếm debounce 350ms như trang Nhắc nhở
   * (PR #149) để không gọi API theo từng phím gõ. */
  const [pageDocs, setPageDocs] = useState(null)
  const [listTotal, setListTotal] = useState(0)
  const [listTick, setListTick] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const pager = useRangePager(listTotal, PER_PAGE)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])
  useEffect(() => { pager.setPage(1) }, [debouncedSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formErr, setFormErr] = useState('')
  const [saving, setSaving] = useState(false)

  const sel = useBulkSelection()
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [linkFor, setLinkFor] = useState(null)   // { ids: [], title }
  const [linkGames, setLinkGames] = useState([])
  const [impOpen, setImpOpen] = useState(false)
  const [impMode, setImpMode] = useState('merge')
  const [impParsed, setImpParsed] = useState(null) // { out, skipped, err }
  const [impBusy, setImpBusy] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null) // { ids:[], label }
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  const load = useCallback(async () => {
    setLoadErr(null)
    try {
      const [qs, gs, st] = await Promise.all([
        // Toàn bộ bank (không from/to → shape cũ) cho ma trận/đếm/xuất
        // file/panel con; trần 5000 là trần route cho phép cho đúng
        // mục đích này. Danh sách hiển thị đi đường listPaged riêng.
        questionBankService.list({ limit: 5000 }).catch(() => []),
        // gameService.list().catch(() => []),
        questionBankService.stats().catch(() => null),
      ])
      setDocs(Array.isArray(qs) ? qs : [])
      setGames(Array.isArray(gs) ? gs : [])
      setStats(st)
    } catch (e) {
      setLoadErr(e.message || 'Không đọc được ngân hàng câu hỏi')
      setDocs([])
    }
  }, [])

  useEffect(() => { load() }, [load])

  /* Trang câu hỏi hiện tại từ server: chạy lại khi đổi trang, đổi bộ
   * lọc, hoặc listTick tăng (sau mọi thao tác ghi). Xoá vơi trang cuối
   * thì useRangePager kẹp trang về trang hợp lệ → range đổi → effect
   * này tự nạp lại trang trước (tự lùi trang như các trang mẫu). */
  const { from: rangeFrom, to: rangeTo } = pager.range
  useEffect(() => {
    let alive = true
    const params = { from: rangeFrom, to: rangeTo, limit: 5000 }
    if (fSubj !== 'all') params.subject = fSubj
    if (fGrade) params.grade = fGrade
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim()
    if (fBad) params.bad = 1
    questionBankService.listPaged(params)
      .then((r) => { if (!alive) return; setPageDocs(r.items); setListTotal(r.total) })
      .catch(() => { if (alive) { setPageDocs([]); setListTotal(0) } })
    return () => { alive = false }
  }, [rangeFrom, rangeTo, fSubj, fGrade, debouncedSearch, fBad, listTick])

  /* Nạp lại CẢ bank đầy đủ lẫn trang đang xem sau một thao tác ghi. */
  const reloadAll = useCallback(() => {
    load()
    setListTick((t) => t + 1)
  }, [load])

  const rows = useMemo(() => (docs || []).map((d) => ({ d, s: subjKey(d), bad: qIssues(d).length })), [docs])

  const subjects = useMemo(() => {
    const list = [...SK_KEYS]
    rows.forEach((r) => { if (!list.includes(r.s)) list.push(r.s) })
    return list
  }, [rows])

  const dupN = useMemo(() => {
    const m = new Map()
    rows.forEach((r) => { const k = (r.d.content || '').trim().toLowerCase(); m.set(k, (m.get(k) || 0) + 1) })
    return [...m.values()].filter((v) => v > 1).length
  }, [rows])
  const badN = useMemo(() => rows.filter((r) => r.bad.length).length, [rows])

  /* ── mở form ── */
  const openCreate = () => {
    setForm({ ...emptyForm(), subject: fSubj !== 'all' ? fSubj : 'viet', grade: fGrade || 3 })
    setEditing(null); setFormErr(''); setFormOpen(true)
  }
  const openEdit = (d) => {
    const opts = (d.options || []).slice(0, 4).map((o) => ({ id: o.id || uid('ans'), content: String(o.content || '') }))
    while (opts.length < 4) opts.push({ id: uid('ans'), content: '' })
    setForm({
      subject: subjKey(d), 
      grade: d.grade || 1, 
      icon: d.icon || '', 
      lang: d.lang === 'en-US' ? 'en-US' : 'vi-VN',
      content: d.content || '', 
      options: opts, 
      correctAnswer: d.correctAnswer || '',
      difficulty: d.difficulty || 'medium', 
      timeLimit: d.timeLimit || 15, 
      points: d.points || 100,
      explanation: d.explanation || '',
    })
    setEditing(d); setFormErr(''); setFormOpen(true)
  }

  const formIssues = useMemo(() => {
    const keep = form.options.map((o, i) => ({ ...o, i })).filter((o) => o.content.trim())
    const er = qIssues({ content: form.content, options: keep.map((o) => ({ id: o.id, content: o.content.trim() })), correctAnswer: form.correctAnswer, grade: form.grade })
    if (form.correctAnswer && !keep.some((o) => o.id === form.correctAnswer)) er.push('đáp án được chọn là đúng đang để trống')
    return er
  }, [form])

  const submit = async () => {
    if (formIssues.length) { setFormErr(formIssues.join(' · ')); return }
    const keep = form.options.filter((o) => o.content.trim()).map((o) => ({ id: o.id, content: o.content.trim() }))
    const payload = {
      content: form.content.trim(), options: keep, correctAnswer: form.correctAnswer,
      subject: form.subject, grade: Number(form.grade) || null, icon: form.icon.trim(),
      lang: form.lang, explanation: form.explanation.trim(),
      difficulty: form.difficulty, timeLimit: Number(form.timeLimit) || 15, points: Number(form.points) || 100,
    }
    setSaving(true); setFormErr('')
    try {
      if (editing) { await questionBankService.update(editing.id, payload); showToast?.('Đã cập nhật và đồng bộ tới các game liên kết') }
      else { await questionBankService.create(payload); showToast?.('Đã thêm câu hỏi vào ngân hàng') }
      setFormOpen(false); setEditing(null); reloadAll()
    } catch (e) { setFormErr(e.message || 'Không lưu được') } finally { setSaving(false) }
  }

  /* ── Tạo câu hỏi bằng AI → thêm vào ngân hàng ──
   * Modal dùng chung (components/ai) lo phần sinh + duyệt chọn; ở đây
   * chỉ map các câu đã chọn sang shape bank (lib/bankQuestionShape —
   * correctAnswer trỏ đúng id đáp án mới) rồi ghi bằng ĐÚNG đường nhập
   * hàng loạt của trang (createMany, mode merge): server tự bỏ câu
   * trùng với câu đã có và câu sai luật, trả về { created, skipped }. */
  const addAiToBank = async (chosen, meta) => {
    const payloads = chosen
      .map((q) => toBankQuestion(q, { subject: meta.subject, grade: meta.grade, difficulty: meta.difficulty }))
      .filter(Boolean)
    if (!payloads.length) throw new Error('Không có câu hỏi hợp lệ nào để thêm vào ngân hàng.')
    const r = await questionBankService.createMany(payloads, 'merge')
    if (r.created > 0) {
      showToast?.(`Đã thêm ${r.created} câu hỏi AI vào ngân hàng${r.skipped ? ` · bỏ qua ${r.skipped} câu trùng hoặc không hợp lệ` : ''}`)
    } else {
      showToast?.('Các câu đã chọn đều đã có trong ngân hàng (trùng) — không thêm câu mới', 'info')
    }
    reloadAll()
  }

  const duplicate = async (d) => {
    try {
      await questionBankService.create({ ...d, id: undefined, content: `${d.content} (bản sao)` })
      showToast?.('Đã nhân bản câu hỏi'); reloadAll()
    } catch (e) { showToast?.(e.message || 'Không nhân bản được', 'error') }
  }
  const removeOne = async (d) => {
    try { await questionBankService.remove(d.id); showToast?.('Đã xóa câu hỏi'); setConfirmDel(null); reloadAll() }
    catch (e) { showToast?.(e.message || 'Lỗi xóa', 'error') }
  }
  // Xoá hàng loạt theo bộ dùng chung (useBulkSelection + bulkInChunks +
  // BulkDeleteBar) như các trang quản lý khác. Server CHƯA có endpoint bulk
  // cho question-banks nên adapter dưới đây gọi remove từng câu TRONG lô —
  // khi server có endpoint bulk chỉ cần thay thân adapter này.
  const doBulkRemove = async () => {
    if (!sel.count) return
    const total = sel.count
    setBulkDeleting(true)
    try {
      const r = await bulkInChunks(sel.selected, async (ids) => {
        const deleted = [], failed = []
        for (const id of ids) {
          try { await questionBankService.remove(id); deleted.push(id) } catch { failed.push({ id }) }
        }
        return { deleted, failed }
      })
      if (r.failed.length) {
        showToast?.(`Đã xóa ${r.deleted.length}/${total} câu hỏi — ${r.failed.length} câu không xóa được`, r.deleted.length ? 'info' : 'error')
      } else {
        showToast?.(`Đã xóa ${r.deleted.length} câu hỏi`)
      }
      sel.clear(); reloadAll()
    } catch (e) { showToast?.(e.message || 'Lỗi xóa hàng loạt', 'error') }
    finally { setBulkDeleting(false) }
  }
  const syncOne = async (d) => {
    try { const r = await questionBankService.sync(d.id); showToast?.(`Đã đồng bộ ${r.modified} bản sao trong games`) }
    catch (e) { showToast?.(e.message || 'Lỗi đồng bộ', 'error') }
  }

  const doLink = async () => {
    if (!linkFor || !linkGames.length) return
    let ok = 0, fail = 0
    for (const gid of linkGames) {
      try {
        const res = linkFor.ids.length > 1 ? await questionBankService.bulkLink(linkFor.ids, gid) : [await questionBankService.linkToGame(linkFor.ids[0], gid)]
        ok += res.filter((r) => r.success !== false).length
        fail += res.filter((r) => r.success === false).length
      } catch { fail += linkFor.ids.length }
    }
    showToast?.(`Đã thêm ${ok} câu vào ${linkGames.length} game${fail ? ` — ${fail} thất bại (đã có hoặc lỗi)` : ''}`)
    setLinkFor(null); setLinkGames([]); sel.clear()
  }

  /* ── nhập / xuất ── */
  const doExportCSV = () => { download('ngan-hang-cau-hoi.csv', toCSV(docs || []), 'text/csv;charset=utf-8'); showToast?.('Đã xuất CSV') }
  const doExportJSON = () => { download('ngan-hang-cau-hoi.json', JSON.stringify(docs || [], null, 2)); showToast?.('Đã xuất JSON') }
  const downloadTemplate = () => download('mau-cau-hoi.csv',
    '\ufeff' + CSVH.join(',') + '\r\n' + ['viet', 2, 'Từ nào chỉ con vật?', 'mèo', 'bàn', 'sách', 'bút', '🐱', 'Mèo là con vật.', 'vi-VN'].map(csvQ).join(','), 'text/csv;charset=utf-8')

  const pickFile = () => {
    const i = document.createElement('input')
    i.type = 'file'
    i.accept = '.json,.csv,application/json,text/csv'
    i.onchange = () => {
      const f = i.files?.[0]
      if (!f) return
      const r = new FileReader()
      r.onload = () => {
        try {
          const out = /\.csv$/i.test(f.name) ? fromCSV(String(r.result)) : fromJSON(String(r.result))
          const bad = out.out.filter((d) => qIssues(normaliseImport(d)).length)
          setImpParsed({ ...out, count: out.out.length, bad: bad.length, err: '' })
        } catch (e) { setImpParsed({ count: 0, skipped: [], err: e.message || 'Tệp không đọc được' }) }
      }
      r.readAsText(f)
    }
    i.click()
  }

  const runImport = async () => {
    if (!impParsed?.out?.length) return
    setImpBusy(true)
    try {
      const list = impParsed.out.map(normaliseImport)
      const r = await questionBankService.createMany(list, impMode)
      showToast?.(`Đã nhập ${r.created} câu${r.skipped ? `, bỏ qua ${r.skipped}` : ''}`)
      setImpOpen(false); setImpParsed(null); setImpMode('merge'); reloadAll()
    } catch (e) { setImpParsed((p) => ({ ...p, err: e.message || 'Import thất bại' })) } finally { setImpBusy(false) }
  }

  if (!docs) {
    return (
      <div>
        <ManagementHeader title="Ngân hàng câu hỏi" subtitle="Câu hỏi dùng chung cho các game — Phiêu Lưu Học Giỏi, kiểm tra, đề thi" />
        <div className="py-16 flex justify-center"><Loader label="Đang đọc ngân hàng câu hỏi..." /></div>
      </div>
    )
  }

  // Một trang câu hỏi từ server, gắn thêm key môn + số lỗi để render thẻ
  // (số lỗi tính ở client bằng qIssues như trước — chỉ để hiện cảnh báo
  // trên thẻ; việc LỌC câu lỗi đã do server làm qua param bad).
  const shown = (pageDocs || []).map((d) => ({ d, s: subjKey(d), bad: qIssues(d).length }))

  return (
    <div className="space-y-3">
      <ManagementHeader
        title="Ngân hàng câu hỏi"
        subtitle="Chỉnh ở đây rồi liên kết vào game — sửa một câu, mọi bản sao đã liên kết tự cập nhật theo."
      />

      {/* Tab: Câu hỏi | Bộ đề (combo) | Theo game */}
      <div className="flex gap-1.5" role="tablist" aria-label="Ngân hàng câu hỏi">
        {[{ k: 'questions', t: 'Câu hỏi' }, { k: 'sets', t: 'Bộ đề' }, { k: 'byGame', t: 'Theo game' }].map(({ k, t }) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`px-4 py-1.5 rounded-full border text-sm font-body transition ${tab === k ? 'bg-ink text-paper border-ink font-semibold' : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/35'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'sets' ? (
        <QuestionSetsPanel docs={docs} subjects={subjects} showToast={showToast} onBankChanged={reloadAll} />
      ) : tab === 'byGame' ? (
        <GameQuestionsPanel showToast={showToast} bankDocs={docs} bankSubjects={subjects} />
      ) : (
      <>
      <div className="flex flex-wrap gap-2">
        <button onClick={openCreate} className={`${toolBtn} bg-ink text-paper border-ink font-semibold`}>+ Thêm câu</button>
        <button onClick={() => setAiOpen(true)} className={`${toolBtn} inline-flex items-center gap-1.5 bg-paper text-ink border-ink/15 hover:border-ink/35`}><Sparkles className="w-3.5 h-3.5" /> Tạo câu hỏi bằng AI</button>
        <button onClick={() => { setImpParsed(null); setImpOpen(true) }} className={`${toolBtn} inline-flex items-center gap-1.5 bg-paper text-ink border-ink/15 hover:border-ink/35`}><Upload className="w-3.5 h-3.5" /> Nhập CSV/JSON</button>
        <button onClick={doExportCSV} className={`${toolBtn} inline-flex items-center gap-1.5 bg-paper text-ink border-ink/15 hover:border-ink/35`}><FileDown className="w-3.5 h-3.5" /> Xuất CSV</button>
        <button onClick={doExportJSON} className={`${toolBtn} inline-flex items-center gap-1.5 bg-paper text-ink border-ink/15 hover:border-ink/35`}><FileDown className="w-3.5 h-3.5" /> Xuất JSON</button>
        <button onClick={reloadAll} className={`${toolBtn} bg-paper text-ink/70 border-ink/15 hover:border-ink/35 inline-flex items-center gap-1`}><RefreshCw className="w-3.5 h-3.5" /> Tải lại</button>
        {docs.length > 0 && (
          <button onClick={() => setConfirmWipe(true)} className={`${toolBtn} bg-paper text-red-600 border-red-200 hover:bg-red-50`}>Xóa tất cả</button>
        )}
      </div>

      {loadErr && <p className="note-card p-2.5 bg-red-50 border-red-200 text-sm text-red-700">{loadErr}</p>}

      {stats && (
        <p className="note-card p-2.5 text-xs text-[#8A7C63]">
          Tổng bank <strong className="text-ink">{stats.total}</strong>
          {' · '}đã liên kết <strong className="text-ink">{stats.linkedCount}</strong> bản sao trong games
          {' · '}<strong className="text-ink">{stats.linkedGames}</strong> câu đang được game dùng
        </p>
      )}
      {badN > 0 && (
        <p className="note-card p-2.5 bg-red-50 border-red-200 text-sm text-red-700 flex flex-wrap items-center gap-2">
          <span>{badN} câu có lỗi. Sửa hết lỗi rồi liên kết vào game.</span>
          <button onClick={() => { setFBad(true); pager.setPage(1) }} className={`${toolBtn} !py-1 !text-xs bg-paper border-red-200 text-red-700`}>Chỉ hiện câu lỗi</button>
        </p>
      )}
      {dupN > 0 && <p className="note-card p-2.5 bg-amber-50 border-amber-200 text-sm text-amber-800">{dupN} câu hỏi bị trùng nội dung.</p>}

      {/* Ma trận phủ chương trình: môn × lớp */}
      <div className="note-card p-3.5">
        <h2 className="font-display text-sm text-ink">Số câu theo môn và lớp <span className="text-[11px] font-body text-[#8A7C63]">(số 0 màu đỏ là còn thiếu)</span></h2>
        <div className="overflow-x-auto -mx-1 px-1 mt-2">
          <table className="w-full text-sm border-collapse min-w-[420px]">
            <thead>
              <tr className="text-[11px] font-mono text-[#8A7C63]">
                <th className="text-left font-medium py-1 pr-2">Môn</th>
                {GRADES.map((g) => <th key={g} className="font-medium py-1 px-1">Lớp {g}</th>)}
                <th className="font-medium py-1 pl-2">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => {
                const list = rows.filter((r) => r.s === s)
                return (
                  <tr key={s} className="border-t border-ink/10">
                    <td className="py-1.5 pr-2">
                      <button onClick={() => { setFSubj(fSubj === s ? 'all' : s); pager.setPage(1) }}
                        className={`text-left hover:underline ${fSubj === s ? 'font-semibold text-ink' : 'text-ink/80'}`}>{subjLabel(s)}</button>
                    </td>
                    {GRADES.map((g) => {
                      const n = list.filter((r) => (r.d.grade || 1) === g).length
                      return <td key={g} className={`text-center py-1.5 px-1 font-mono ${n ? 'text-ink/80' : 'text-red-500'}`}>{n}</td>
                    })}
                    <td className="text-center py-1.5 pl-2 font-mono font-semibold text-ink">{list.length}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {['all', ...subjects].map((s) => (
            <button key={s} onClick={() => { setFSubj(s); pager.setPage(1) }}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${fSubj === s ? 'bg-ink text-paper border-ink' : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/35'}`}>
              {s === 'all' ? 'Tất cả' : subjLabel(s)}
            </button>
          ))}
        </div>
        <select value={fGrade} onChange={(e) => { setFGrade(Number(e.target.value)); pager.setPage(1) }} className={`${box} !w-auto`}>
          <option value={0}>Mọi lớp</option>
          {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
        </select>
        <button onClick={() => { setFBad((v) => !v); pager.setPage(1) }}
          className={`px-3 py-1.5 rounded-full border text-sm transition ${fBad ? 'bg-red-500/10 border-red-300 text-red-700' : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/35'}`}>
          Chỉ câu lỗi
        </button>
        <input type="search" value={search} placeholder="Tìm câu hỏi..."
          onChange={(e) => setSearch(e.target.value)}
          className={`${box} flex-1 min-w-[160px] !w-auto`} />
        <span className="text-xs text-[#8A7C63] whitespace-nowrap">{listTotal} câu</span>
      </div>

      {sel.count > 0 && (
        <div className="space-y-2">
          <div className="note-card p-2.5 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-ink">Đã chọn {sel.count} câu</span>
            <button onClick={() => { setLinkFor({ ids: sel.selected, title: `${sel.count} câu hỏi` }); setLinkGames([]) }}
              className={`${toolBtn} inline-flex items-center gap-1 bg-ink text-paper border-ink`}><Rocket className="w-3.5 h-3.5" /> Áp dụng vào game</button>
          </div>
          <BulkDeleteBar count={sel.count} itemLabel="câu hỏi" deleting={bulkDeleting}
            onDeleteSelected={doBulkRemove} onClear={sel.clear} />
        </div>
      )}

      {/* Danh sách câu hỏi — một trang do server cắt, RangePagination
          dùng chung ở dưới lưới */}
      {pageDocs === null ? (
        <div className="py-10 flex justify-center"><Loader label="Đang đọc danh sách câu hỏi..." /></div>
      ) : shown.length === 0 ? (
        <div className="note-card p-6 text-center text-sm text-[#8A7C63]">
          {rows.length ? 'Không có câu hỏi phù hợp bộ lọc.' : 'Chưa có câu hỏi nào. Bấm “+ Thêm câu” hoặc “Nhập CSV/JSON”.'}
        </div>
      ) : (
        <div className="edu-grid">
          {shown.map(({ d, s, bad }) => (
            <article key={d.id} className={`note-card p-3 flex flex-col gap-2 ${bad.length ? '!border-red-300' : ''}`}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <input type="checkbox" checked={sel.isSelected(d.id)} onChange={() => sel.toggle(d.id)} className="accent-teal" aria-label={`Chọn ${d.content}`} />
                <span className="px-2 py-0.5 rounded-full bg-teal/10 text-teal text-[11px]">{subjLabel(s)}</span>
                <span className="px-2 py-0.5 rounded-full bg-ink/5 text-ink/70 text-[11px]">Lớp {d.grade || 1}</span>
                {d.icon && <span aria-hidden>{d.icon}</span>}
                {d.lang === 'en-US' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/20 text-[#7A5B12] text-[11px]"><Volume2 className="w-3 h-3" /> EN</span>}
                <span className="flex-1" />
                <span className="font-mono text-[10px] text-[#B7A987]">{d.points || 100}đ · {d.timeLimit || 15}s</span>
              </div>

              <p className="text-sm text-ink leading-snug">{d.content || <span className="text-red-500">(chưa nhập câu hỏi)</span>}</p>

              <ol className="space-y-0.5 text-[13px]">
                {(d.options || []).map((o, i) => {
                  const ok = o.id === d.correctAnswer
                  return (
                    <li key={o.id || i} className={ok ? 'text-teal font-medium' : 'text-ink/75'}>
                      <span className="inline-flex items-center gap-1">
                        {LET[i]}. {o.content}{ok ? <Check className="w-3 h-3" /> : ''}
                      </span>
                    </li>
                  )
                })}
              </ol>

              {d.explanation && <p className="text-[11px] text-[#8A7C63] inline-flex items-start gap-1"><MessageSquare className="w-3 h-3 shrink-0 mt-0.5" /> {d.explanation}</p>}
              {!!bad.length && <p className="text-[11px] text-red-600 inline-flex items-start gap-1"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" /> {bad.join('; ')}</p>}

              <div className="flex flex-wrap gap-1.5 mt-auto pt-1 border-t border-ink/10">
                <button onClick={() => openEdit(d)} className={`${toolBtn} !px-2.5 !py-1 !text-xs bg-paper border-ink/15 hover:border-ink/35`}>Sửa</button>
                <button onClick={() => duplicate(d)} className={`${toolBtn} !px-2.5 !py-1 !text-xs bg-paper border-ink/15 hover:border-ink/35`}>Nhân bản</button>
                <button onClick={() => { setLinkFor({ ids: [d.id], title: d.content }); setLinkGames([]) }}
                  className={`${toolBtn} inline-flex items-center gap-1 !px-2.5 !py-1 !text-xs bg-paper border-ink/15 hover:border-ink/35`}><Link2 className="w-3 h-3" /> Vào game</button>
                <button onClick={() => syncOne(d)} className={`${toolBtn} inline-flex items-center gap-1 !px-2.5 !py-1 !text-xs bg-paper border-ink/15 hover:border-ink/35`}><RefreshCw className="w-3 h-3" /> Đồng bộ</button>
                <button onClick={() => setConfirmDel({ ids: [d.id], label: d.content })}
                  className={`${toolBtn} !px-2.5 !py-1 !text-xs bg-paper text-red-600 border-red-200 hover:bg-red-50`}>Xóa</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {listTotal > 0 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-[#8A7C63]">{listTotal} câu theo bộ lọc</span>
          <RangePagination {...pager.props} />
        </div>
      )}

      {/* Form thêm / sửa */}
      {formOpen && (
        <Modal open={formOpen} onClose={() => setFormOpen(false)} wide align="bottom"
          contentClassName="max-w-2xl !max-h-[92vh]">
          <div className="p-4 sm:p-5 space-y-3.5">
            <h2 className="font-display text-lg text-ink">{editing ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</h2>
            <p className="text-[11px] text-[#8A7C63] leading-snug">
              Game tự xáo thứ tự đáp án khi chơi. Sửa câu đã liên kết thì mọi bản sao trong game cập nhật theo.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <label><span className={label}>Môn</span>
                <select className={box} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
                  {subjects.map((k) => <option key={k} value={k}>{subjLabel(k)}</option>)}
                </select>
              </label>
              <label><span className={label}>Lớp</span>
                <select className={box} value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: Number(e.target.value) }))}>
                  {GRADES.map((g) => <option key={g} value={g}>Lớp {g}</option>)}
                </select>
              </label>
              <label><span className={label}>Biểu tượng (emoji)</span>
                <input className={box} value={form.icon} maxLength={4} placeholder="🐱" onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
              </label>
              <label><span className={label}>Giọng đọc</span>
                <select className={box} value={form.lang} onChange={(e) => setForm((f) => ({ ...f, lang: e.target.value }))}>
                  {Object.entries(LANGS).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </label>
            </div>

            <label><span className={label}>Câu hỏi *</span>
              <textarea className={box} rows={2} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
            </label>

            <div className="space-y-1.5">
              <span className={label}>Đáp án — chọn nút tròn ở đáp án đúng</span>
              {form.options.map((o, i) => (
                <div key={o.id} className="flex items-center gap-2">
                  <input type="radio" name="qCorrect" checked={form.correctAnswer === o.id}
                    onChange={() => setForm((f) => ({ ...f, correctAnswer: o.id }))} className="accent-teal shrink-0"
                    aria-label={`${LET[i]} là đáp án đúng`} />
                  <span className="w-4 text-sm font-semibold text-ink/70 shrink-0">{LET[i]}</span>
                  <input className={box} value={o.content} placeholder={`Đáp án ${LET[i]}${i < 2 ? '' : ' (tuỳ chọn)'}`}
                    onChange={(e) => setForm((f) => ({ ...f, options: f.options.map((x, k) => (k === i ? { ...x, content: e.target.value } : x)) }))} />
                </div>
              ))}
            </div>

            <label><span className={label}>Giải thích (hiện sau khi trả lời, tuỳ chọn)</span>
              <input className={box} value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} />
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              <label><span className={label}>Độ khó</span>
                <select className={box} value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}>
                  <option value="easy">Dễ</option><option value="medium">Trung bình</option><option value="hard">Khó</option>
                </select>
              </label>
              <label><span className={label}>Thời gian (giây)</span>
                <input type="number" min={5} max={120} className={box} value={form.timeLimit} onChange={(e) => setForm((f) => ({ ...f, timeLimit: e.target.value }))} />
              </label>
              <label><span className={label}>Điểm</span>
                <input type="number" min={10} max={500} step={10} className={box} value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))} />
              </label>
            </div>

            {(formErr || formIssues.length) && (
              <p className="text-sm text-ticket">{formErr || formIssues.join(' · ')}</p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <GhostButton onClick={() => setFormOpen(false)} className="!px-4 !py-2 text-sm rounded-lg">Hủy</GhostButton>
              <PrimaryButton onClick={submit} disabled={saving || !!formIssues.length} className="!px-4 !py-2 text-sm rounded-lg">
                {saving ? 'Đang lưu...' : editing ? 'Cập nhật & Đồng bộ' : 'Thêm mới'}
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Liên kết vào game */}
      {linkFor && (
        <Modal open onClose={() => { setLinkFor(null); setLinkGames([]) }} align="bottom">
          <div className="p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-lg text-ink">Áp dụng vào game</h2>
            <p className="text-sm text-[#8A7C63] truncate">{linkFor.title}</p>
            <div className="max-h-60 overflow-y-auto border border-ink/10 rounded-lg divide-y divide-ink/10">
              {games.map((g) => (
                <label key={g._id || g.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-ink/5 cursor-pointer">
                  <input type="checkbox" checked={linkGames.includes(g._id || g.id)}
                    onChange={() => setLinkGames((s) => { const id = g._id || g.id; return s.includes(id) ? s.filter((x) => x !== id) : [...s, id] })}
                    className="accent-teal" />
                  <span className="text-sm flex-1 truncate">{g.name}</span>
                  <span className="text-[11px] font-mono text-[#8A7C63]">{g.questionsCount || 0} câu</span>
                </label>
              ))}
              {!games.length && <p className="px-3 py-3 text-sm text-[#8A7C63]">Chưa tải được danh sách game.</p>}
            </div>
            <div className="flex justify-end gap-2">
              <GhostButton onClick={() => { setLinkFor(null); setLinkGames([]) }} className="!px-4 !py-2 text-sm rounded-lg">Hủy</GhostButton>
              <PrimaryButton onClick={doLink} disabled={!linkGames.length} className="!px-4 !py-2 text-sm rounded-lg">
                Thêm vào {linkGames.length} game
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Nhập file */}
      {impOpen && (
        <Modal open onClose={() => setImpOpen(false)} align="bottom">
          <div className="p-4 sm:p-5 space-y-3">
            <h2 className="font-display text-lg text-ink">Nhập câu hỏi</h2>
            <p className="text-sm text-[#8A7C63] leading-snug">
              Chọn tệp <b>CSV</b> (cột: <span className="font-mono text-[11px]">{CSVH.join(', ')}</span>) hoặc <b>JSON</b> —
              mảng câu hỏi của trang này hay ngân hàng theo môn của tool cũ đều nhập được.
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadTemplate} className={`${toolBtn} inline-flex items-center gap-1.5 bg-paper text-ink border-ink/15 hover:border-ink/35`}><FileDown className="w-3.5 h-3.5" /> Tải mẫu CSV</button>
              <button onClick={pickFile} className={`${toolBtn} inline-flex items-center gap-1.5 bg-ink text-paper border-ink`}><FolderOpen className="w-3.5 h-3.5" /> Chọn tệp...</button>
            </div>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5"><input type="radio" name="impMode" checked={impMode === 'merge'} onChange={() => setImpMode('merge')} className="accent-teal" /> Thêm vào (giữ câu cũ)</label>
              <label className="flex items-center gap-1.5"><input type="radio" name="impMode" checked={impMode === 'replace'} onChange={() => setImpMode('replace')} className="accent-teal" /> Thay thế toàn bộ</label>
            </div>
            {impParsed?.err && <p className="note-card p-2.5 bg-red-50 border-red-200 text-sm text-red-700 whitespace-pre-wrap">{impParsed.err}</p>}
            {impParsed && !impParsed.err && (
              <div className="note-card p-2.5 text-sm space-y-2">
                <p className="text-teal">{impParsed.count} câu hợp lệ{impParsed.skipped?.length ? ` · bỏ qua ${impParsed.skipped.length} dòng thiếu dữ liệu (dòng ${impParsed.skipped.slice(0, 8).join(', ')})` : ''}{impParsed.bad ? ` · ${impParsed.bad} câu còn lỗi` : ''}</p>
                <PrimaryButton onClick={runImport} disabled={!impParsed.count || impBusy} className="!px-4 !py-2 text-sm rounded-lg">
                  {impBusy ? 'Đang nhập...' : `Nhập ${impParsed.count} câu (${impMode === 'replace' ? 'ghi đè' : 'thêm'})`}
                </PrimaryButton>
                {impMode === 'replace' && <p className="text-[11px] text-ticket">“Thay thế” xóa toàn bộ bank và cắt mọi liên kết bankId trong game.</p>}
              </div>
            )}
            <div className="flex justify-end">
              <GhostButton onClick={() => setImpOpen(false)} className="!px-4 !py-2 text-sm rounded-lg">Đóng</GhostButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Tạo câu hỏi bằng AI — modal dùng chung, ghi qua createMany */}
      {aiOpen && (
        <AiGenerateQuestionsModal
          description={(
            <>
              AI sinh câu hỏi trắc nghiệm rồi thêm vào <strong className="text-ink">ngân hàng câu hỏi</strong>.
              Bạn duyệt từng câu rồi mới thêm — câu trùng với câu đã có trong ngân hàng sẽ tự bị bỏ qua.
            </>
          )}
          subjectField={{ kind: 'select', options: subjects.map((k) => ({ value: k, label: subjLabel(k) })) }}
          subjectText={(key) => subjLabel(key)}
          initialSubject={fSubj !== 'all' ? fSubj : 'viet'}
          initialGrade={fGrade || 3}
          addLabel={(n) => `Thêm ${n} câu đã chọn vào ngân hàng`}
          onAdd={addAiToBank}
          onClose={() => setAiOpen(false)}
        />
      )}

      <ConfirmModal open={!!confirmDel} title="Xóa câu hỏi"
        message={confirmDel ? `Xóa ${confirmDel.label.length > 70 ? confirmDel.label.slice(0, 70) + '…' : confirmDel.label}? Bản sao đã liên kết trong game vẫn còn nhưng mất liên kết với bank.` : ''}
        onConfirm={() => removeOne(docs.find((d) => d.id === confirmDel.ids[0]))}
        onClose={() => setConfirmDel(null)} />

      <ConfirmModal open={confirmWipe} title="Xóa toàn bộ ngân hàng" confirmLabel="Xóa tất cả"
        message={`${docs.length} câu sẽ bị xóa khỏi máy chủ, mọi liên kết bankId trong game bị cắt. Không hoàn tác được — hãy “Xuất” trước.`}
        onConfirm={async () => {
          try { const r = await questionBankService.removeAll(); showToast?.(`Đã xóa ${r?.deleted ?? docs.length} câu hỏi`); sel.clear(); reloadAll() }
          catch (e) { showToast?.(e.message || 'Không xóa được', 'error') }
          setConfirmWipe(false)
        }}
        onClose={() => setConfirmWipe(false)} />
      </>
      )}
    </div>
  )
}
