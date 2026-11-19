// components/ai/AiGenerateQuestionsModal.jsx
//
// Modal "Tạo câu hỏi bằng AI" DÙNG CHUNG — phần trình bày của luồng
// sinh câu hỏi AI (hooks/useAiQuestionGenerator giữ phần logic):
//   ô yêu cầu (prompt) + môn/lớp/độ khó/số câu → Sinh → danh sách câu
//   AI trả về, đáp án đúng đánh dấu ✓, checkbox chọn từng câu → nút
//   "Thêm N câu đã chọn …" giao các câu đã chọn cho nơi gọi ghi vào
//   đúng nơi của nó (game / ngân hàng câu hỏi / bộ đề).
//
// Nơi gọi chỉ quyết định 3 thứ qua props:
//   · `description`     — câu mô tả ngữ cảnh dưới tiêu đề.
//   · `subjectField`    — trường Môn là ô nhập tự do (game) hay ô chọn
//                         theo danh mục (ngân hàng: { kind: "select",
//                         options: [{ value, label }] }).
//   · `onAdd(chosen, meta)` — ghi các câu đã chọn; lỗi ném ra được hiện
//                         ngay trong modal, thành công thì modal tự
//                         gọi `onAdded` rồi đóng.
// `children` là vùng tuỳ biến đặt ngay trên hàng nút hành động (vd ô
// chọn bộ đề đích ở tab Bộ đề) — state của nó do nơi gọi giữ và đọc
// lại trong onAdd.
//
// Trạng thái AI chưa sẵn sàng hiện bằng AiNotReadyNotice dùng chung —
// không có câu hỏi mẫu hay dữ liệu giả lập ở bất kỳ đường nào.

import { useState } from "react";
import { Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { GhostButton, Modal, PrimaryButton } from "../ui";
import { DIFFICULTIES } from "../../services/aiApi.js";
import { AiNotReadyNotice } from "./AiNotReadyNotice.jsx";
import { AI_QUESTION_COUNTS, useAiQuestionGenerator } from "../../hooks/useAiQuestionGenerator.js";

const label = "text-[11px] font-mono text-[#8A7C63] leading-tight block mb-1";
const box = "w-full rounded-lg border border-ink/15 px-2.5 py-1.5 bg-paper text-sm font-body focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60 transition";

export function AiGenerateQuestionsModal({
  description = null,
  subjectField = { kind: "text" },
  initialSubject = "",
  subjectText,
  initialGrade = 3,
  initialDifficulty = "medium",
  initialCount = 5,
  addLabel = (n) => `Thêm ${n} câu đã chọn`,
  onAdd,
  onAdded,
  onClose,
  children = null,
}) {
  const gen = useAiQuestionGenerator({
    subject: initialSubject, subjectText,
    grade: initialGrade, difficulty: initialDifficulty, count: initialCount,
  });
  const { ai, result, picked, chosen } = gen;
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState("");

  async function addChosen() {
    if (!chosen.length || adding || !onAdd) return;
    setAdding(true); setAddErr("");
    try {
      await onAdd(chosen, { subject: gen.subject, grade: gen.grade, difficulty: gen.difficulty });
      onAdded?.();
      onClose?.();
    } catch (e) {
      setAddErr(e?.message || "Không thêm được câu hỏi đã chọn.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <Modal open onClose={onClose} wide align="bottom" contentClassName="max-w-2xl !max-h-[92vh]">
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h2 className="font-display text-lg text-ink inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal" /> Tạo câu hỏi bằng AI
          </h2>
          {description && <p className="text-sm text-[#8A7C63] leading-snug">{description}</p>}
        </div>

        <div>
          <label className={label} htmlFor="ai-gen-prompt">Yêu cầu cho AI *</label>
          <textarea
            id="ai-gen-prompt"
            value={gen.prompt}
            onChange={(e) => gen.setPrompt(e.target.value)}
            className={box}
            rows={3}
            placeholder="VD: Tạo câu hỏi về phép nhân cho lớp 3, bám sát chương trình học kỳ 1…"
          />
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[130px]">
            <label className={label} htmlFor="ai-gen-subject">Môn học *</label>
            {subjectField.kind === "select" ? (
              <select id="ai-gen-subject" value={gen.subject} onChange={(e) => gen.setSubject(e.target.value)} className={box}>
                {(subjectField.options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input
                id="ai-gen-subject"
                value={gen.subject}
                onChange={(e) => gen.setSubject(e.target.value)}
                className={box}
                placeholder={subjectField.placeholder || "VD: Toán"}
              />
            )}
          </div>
          <div>
            <label className={label} htmlFor="ai-gen-grade">Lớp</label>
            <select id="ai-gen-grade" value={gen.grade} onChange={(e) => gen.setGrade(Number(e.target.value))} className={`${box} !w-auto`}>
              {[1, 2, 3, 4, 5].map((g) => <option key={g} value={g}>Lớp {g}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="ai-gen-difficulty">Độ khó</label>
            <select id="ai-gen-difficulty" value={gen.difficulty} onChange={(e) => gen.setDifficulty(e.target.value)} className={`${box} !w-auto`}>
              {DIFFICULTIES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <span className={label}>Số câu</span>
            <div className="flex gap-1">
              {AI_QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => gen.setCount(n)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-body transition ${gen.count === n ? "bg-ink text-paper border-ink font-semibold" : "bg-paper text-ink/70 border-ink/15 hover:border-ink/35"}`}
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
          {gen.busy ? (
            <>
              <PrimaryButton disabled className="!px-4 !py-2 text-sm rounded-lg">
                <Loader2 className="w-4 h-4 mr-1.5 inline-block -mt-0.5 animate-spin" /> Đang sinh câu hỏi…
              </PrimaryButton>
              <GhostButton onClick={gen.abort} className="!px-4 !py-2 text-sm rounded-lg">Huỷ</GhostButton>
            </>
          ) : (
            <PrimaryButton onClick={gen.run} disabled={ai.showNotice} className="!px-4 !py-2 text-sm rounded-lg">
              <Sparkles className="w-4 h-4 mr-1.5 inline-block -mt-0.5" /> Sinh câu hỏi
            </PrimaryButton>
          )}
          {gen.busy && <span className="text-xs text-[#8A7C63]">Đang chờ AI (có thể mất 10–60 giây tuỳ model).</span>}
        </div>

        {gen.error && (
          <div className="rounded-lg bg-[#FDECEC] border border-[#F2C1C1] px-3 py-2">
            <p className="text-sm text-[#7A1F1F] leading-relaxed">{gen.error}</p>
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
              <button type="button" onClick={gen.pickAll} className="text-xs font-semibold text-teal hover:underline">Chọn tất cả</button>
              <button type="button" onClick={gen.pickNone} className="text-xs text-red-600 hover:underline">Bỏ chọn</button>
            </div>

            {result.warnings.length > 0 && (
              <p className="flex items-start gap-1.5 text-xs text-[#B45309] bg-[#FFF7E6] border border-[#F2D8A0] rounded-lg px-2.5 py-2 leading-relaxed">
                <TriangleAlert className="mt-0.5 w-3.5 h-3.5 shrink-0" />
                <span>{result.warnings.join(" ")}</span>
              </p>
            )}

            <div className="max-h-80 overflow-y-auto border border-ink/10 rounded-lg divide-y divide-ink/10">
              {result.questions.map((q, idx) => (
                <label key={q.id} className={`flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition ${picked.has(q.id) ? "bg-teal/5" : "hover:bg-ink/5"}`}>
                  <input
                    type="checkbox"
                    checked={picked.has(q.id)}
                    onChange={() => gen.togglePick(q.id)}
                    className="accent-teal mt-0.5"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-ink leading-snug">{idx + 1}. {q.content}</span>
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {q.options.map((o) => (
                        <span
                          key={o.id}
                          className={`text-[11px] px-1.5 py-0.5 rounded ${o.id === q.correctAnswer ? "bg-teal/15 text-teal font-semibold" : "bg-ink/5 text-ink/60"}`}
                        >
                          {o.content}{o.id === q.correctAnswer ? " ✓" : ""}
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

        {children}

        {addErr && <p className="text-sm text-ticket">{addErr}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <GhostButton onClick={onClose} className="!px-4 !py-2 text-sm rounded-lg">Đóng</GhostButton>
          <PrimaryButton onClick={addChosen} disabled={adding || !chosen.length} className="!px-4 !py-2 text-sm rounded-lg">
            {adding ? "Đang thêm..." : addLabel(chosen.length)}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
}

export default AiGenerateQuestionsModal;
