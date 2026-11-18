import { useRef, useState } from 'react'
import { Loader2, Sparkles, TriangleAlert } from 'lucide-react'
import { GhostButton, Modal, PrimaryButton } from '../../components/ui'
import { questionService } from '../../services/api.js'
import { DIFFICULTIES, generateQuestions } from '../../services/aiApi.js'
import { markAiFailed, markAiReady, useAiAvailability } from '../../hooks/useAiAvailability.js'
import { AiNotReadyNotice } from '../../components/ai/AiNotReadyNotice.jsx'
import { aiErrorText } from '../../components/ai/aiErrorText.js'
import { isValidAiQuestion, toGameQuestion } from '../../lib/gameQuestionShape.js'

/*
 * Modal "Tạo câu hỏi bằng AI" — dùng ở tab Theo game (QuestionManagement)
 * để sinh câu hỏi trắc nghiệm cho game đang chọn rồi thêm vào game.
 *
 * Gắn vào endpoint AI THẬT POST /api/ai/quizzes/generate qua
 * services/aiApi.generateQuestions dùng chung — cùng đường với
 * StudioAiPanel ở AI Studio, KHÔNG có câu hỏi mẫu/giả lập: AI chưa sẵn
 * sàng (cờ system_config.ai.enabled / AI Service) thì hiện đúng
 * AiNotReadyNotice dùng chung; lỗi 429/quá tải hiện nguyên thông báo
 * thân thiện của aiApi.
 *
 * Luồng: nhập yêu cầu (prompt → trường `topic` của endpoint) + môn/lớp/
 * độ khó/số câu → AI sinh → giáo viên duyệt từng câu (checkbox, mặc định
 * chọn tất cả câu hợp lệ) → "Thêm vào game" ghi qua ĐÚNG cơ chế của
 * trang: questionService.save(gameId, [câu cũ…, câu mới đã chuẩn hoá
 * bằng lib/gameQuestionShape]) rồi trang tải lại danh sách.
 *
 * Câu AI trả về không hợp lệ (thiếu đáp án đúng, đáp án trùng nội dung,
 * thiếu nội dung/đáp án — aiApi đã lọc một phần và đếm vào `skipped`)
 * bị loại khỏi danh sách chọn và được báo số lượng rõ ràng; không bao
 * giờ thêm câu rác vào game.
 */

const label = 'text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1'
const box = 'w-full rounded-lg border border-ink/15 px-2.5 py-1.5 bg-paper text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition'
const COUNT_CHOICES = [3, 5, 10]

export default function AiQuestionGenerateModal({ gameId, gameName = '', gameSubject = '', existingQuestions = [], showToast, onClose, onAdded }) {
  const ai = useAiAvailability()
  const [prompt, setPrompt] = useState('')
  const [subject, setSubject] = useState(gameSubject || '')
  const [grade, setGrade] = useState(3)
  const [difficulty, setDifficulty] = useState('medium')
  const [count, setCount] = useState(5)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // { questions: câu HỢP LỆ (shape aiApi), dropped: tổng số câu bị loại, warnings }
  const [result, setResult] = useState(null)
  const [picked, setPicked] = useState(() => new Set())
  const [adding, setAdding] = useState(false)
  const [addErr, setAddErr] = useState('')
  const abortRef = useRef(null)

  const chosen = result ? result.questions.filter((q) => picked.has(q.id)) : []

  const togglePick = (id) => setPicked((s) => {
    const next = new Set(s)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })
  const pickAll = () => setPicked(new Set((result?.questions || []).map((q) => q.id)))
  const pickNone = () => setPicked(new Set())

  async function run() {
    if (busy || ai.showNotice) return
    const subj = subject.trim()
    const topic = prompt.trim()
    if (!subj) { setError('Hãy nhập môn học để AI sinh câu hỏi đúng chương trình.'); return }
    if (!topic) { setError('Hãy nhập yêu cầu cho AI (chủ đề cần sinh câu hỏi).'); return }
    setError(''); setAddErr(''); setBusy(true); setResult(null)
    const ctrl = new AbortController()
    abortRef.current = ctrl
    try {
      const res = await generateQuestions({ subject: subj, grade, topic, difficulty, count, signal: ctrl.signal })
      markAiReady()
      const valid = []
      let dropped = res.skipped || 0
      for (const q of res.questions) {
        if (isValidAiQuestion(q)) valid.push(q)
        else dropped += 1
      }
      setResult({ questions: valid, dropped, warnings: res.warnings || [] })
      setPicked(new Set(valid.map((q) => q.id)))
      if (!valid.length) {
        setError('AI không sinh được câu hỏi nào hợp lệ (câu trả về thiếu đáp án đúng hoặc đáp án trùng nhau). Hãy thử diễn đạt lại yêu cầu.')
      }
    } catch (e) {
      markAiFailed(e)
      // 503 "đang được cấu hình" đã có thẻ AiNotReadyNotice nói thay —
      // không lặp lại cùng một câu trong hộp lỗi bên dưới.
      const configuring = e?.status === 503 && /đang được cấu hình/i.test(e?.message || '')
      if (!ctrl.signal.aborted && !configuring) setError(aiErrorText(e))
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  async function addChosen() {
    if (!chosen.length || adding || !gameId) return
    setAdding(true); setAddErr('')
    try {
      const normalized = chosen.map((q) => toGameQuestion(q)).filter(Boolean)
      await questionService.save(gameId, [...(existingQuestions || []), ...normalized])
      showToast?.(`Đã thêm ${normalized.length} câu hỏi AI vào game`)
      onAdded?.()
      onClose?.()
    } catch (e) {
      setAddErr(e?.message || 'Không thêm được câu hỏi vào game.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Modal open onClose={onClose} wide align="bottom" contentClassName="max-w-2xl !max-h-[92vh]">
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h2 className="font-display text-lg text-ink inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal" /> Tạo câu hỏi bằng AI
          </h2>
          <p className="text-sm text-[#8A7C63] leading-snug">
            AI sinh câu hỏi trắc nghiệm cho game <strong className="text-ink">{gameName}</strong>.
            Bạn duyệt từng câu rồi mới thêm vào game — AI không tự thêm hay sửa câu hỏi sẵn có.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="ai-gen-prompt">Yêu cầu cho AI *</label>
          <textarea
            id="ai-gen-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={box}
            rows={3}
            placeholder="VD: Tạo câu hỏi về phép nhân cho lớp 3, bám sát chương trình học kỳ 1…"
          />
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[130px]">
            <label className={label} htmlFor="ai-gen-subject">Môn học *</label>
            <input
              id="ai-gen-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={box}
              placeholder="VD: Toán"
            />
          </div>
          <div>
            <label className={label} htmlFor="ai-gen-grade">Lớp</label>
            <select id="ai-gen-grade" value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={`${box} !w-auto`}>
              {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="ai-gen-difficulty">Độ khó</label>
            <select id="ai-gen-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={`${box} !w-auto`}>
              {DIFFICULTIES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <span className={label}>Số câu</span>
            <div className="flex gap-1">
              {COUNT_CHOICES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCount(n)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-body transition ${count === n ? 'bg-ink text-paper border-ink font-semibold' : 'bg-paper text-ink/70 border-ink/15 hover:border-ink/35'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {ai.showNotice && (
          <AiNotReadyNotice state={ai.state} notice={ai.notice} hint={ai.hint} onRetry={ai.refresh} />
        )}

        <div className="flex items-center gap-2">
          {busy ? (
            <>
              <PrimaryButton disabled className="!px-4 !py-2 text-sm rounded-lg">
                <Loader2 className="w-4 h-4 mr-1.5 inline-block -mt-0.5 animate-spin" /> Đang sinh câu hỏi…
              </PrimaryButton>
              <GhostButton onClick={() => abortRef.current?.abort()} className="!px-4 !py-2 text-sm rounded-lg">Huỷ</GhostButton>
            </>
          ) : (
            <PrimaryButton onClick={run} disabled={ai.showNotice} className="!px-4 !py-2 text-sm rounded-lg">
              <Sparkles className="w-4 h-4 mr-1.5 inline-block -mt-0.5" /> Sinh câu hỏi
            </PrimaryButton>
          )}
          {busy && <span className="text-xs text-[#8A7C63]">Đang chờ AI (có thể mất 10–60 giây tuỳ model).</span>}
        </div>

        {error && (
          <div className="rounded-lg bg-[#FDECEC] border border-[#F2C1C1] px-3 py-2">
            <p className="text-sm text-[#7A1F1F] leading-relaxed">{error}</p>
          </div>
        )}

        {result && result.questions.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">
                AI sinh {result.questions.length} câu hợp lệ
                {result.dropped > 0 && (
                  <span className="text-ticket font-body font-normal"> · {result.dropped} câu không hợp lệ đã bị loại (thiếu đáp án đúng hoặc đáp án trùng nhau)</span>
                )}
              </p>
              <span className="flex-1" />
              <button type="button" onClick={pickAll} className="text-xs font-semibold text-teal hover:underline">Chọn tất cả</button>
              <button type="button" onClick={pickNone} className="text-xs text-red-600 hover:underline">Bỏ chọn</button>
            </div>

            {result.warnings.length > 0 && (
              <p className="flex items-start gap-1.5 text-xs text-[#B45309] bg-[#FFF7E6] border border-[#F2D8A0] rounded-lg px-2.5 py-2 leading-relaxed">
                <TriangleAlert className="mt-0.5 w-3.5 h-3.5 shrink-0" />
                <span>{result.warnings.join(' ')}</span>
              </p>
            )}

            <div className="max-h-80 overflow-y-auto border border-ink/10 rounded-lg divide-y divide-ink/10">
              {result.questions.map((q, idx) => (
                <label key={q.id} className={`flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition ${picked.has(q.id) ? 'bg-teal/5' : 'hover:bg-ink/5'}`}>
                  <input
                    type="checkbox"
                    checked={picked.has(q.id)}
                    onChange={() => togglePick(q.id)}
                    className="accent-teal mt-0.5"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-ink leading-snug">{idx + 1}. {q.content}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {q.options.map((o) => (
                        <span
                          key={o.id}
                          className={`text-[11px] px-1.5 py-0.5 rounded ${o.id === q.correctAnswer ? 'bg-teal/15 text-teal font-semibold' : 'bg-ink/5 text-ink/60'}`}
                        >
                          {o.content}{o.id === q.correctAnswer ? ' ✓' : ''}
                        </span>
                      ))}
                    </span>
                    {q.explanation && (
                      <span className="mt-1 block text-xs text-[#8A7C63] leading-snug">Giải thích: {q.explanation}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {addErr && <p className="text-sm text-ticket">{addErr}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <GhostButton onClick={onClose} className="!px-4 !py-2 text-sm rounded-lg">Đóng</GhostButton>
          <PrimaryButton onClick={addChosen} disabled={adding || !chosen.length} className="!px-4 !py-2 text-sm rounded-lg">
            {adding ? 'Đang thêm...' : `Thêm ${chosen.length} câu đã chọn vào game`}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  )
}
