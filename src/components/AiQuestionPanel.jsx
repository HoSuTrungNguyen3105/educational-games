import { useState, useRef } from "react";
import { API_BASE } from "../services/api.js";
import { generateQuestions, DIFFICULTIES } from "../services/aiApi.js";
import { GhostButton } from "./ui";
import Field from "../pages/teacher/fields.jsx";
import { Input } from "./ui";
import { Checkbox } from "./ui";
import { Select } from "./ui";
import { ChevronDown, ChevronUp, Sparkles, TriangleAlert, X } from "lucide-react";

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** Thông báo tiếng Việt theo loại lỗi của aiApi. */
function errText(e) {
  switch (e?.kind) {
    case "offline":
    case "timeout":
    case "auth":
    case "forbidden":
    case "rateLimit":
    case "badResponse":
      return e.message;
    case "badRequest":
      return `AI Service không nhận yêu cầu: ${e.message}`;
    case "server":
      return `${e.message} Kiểm tra Ollama có đang chạy và OLLAMA_MODEL đã được tải chưa.`;
    default:
      return e?.message || "Không sinh được câu hỏi.";
  }
}

/**
 * Bảng sinh câu hỏi bằng AI.
 *
 * Luồng: giáo viên điền môn/lớp/chủ đề → gọi Java AI Service → xem trước →
 * chọn câu nào giữ → thêm vào danh sách. Luôn cho xem trước và sửa tay sau,
 * không tự động chèn thẳng vào game.
 */
export default function AiQuestionPanel({ form, onAdd, showToast }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(form?.subject || "");
  const [topic, setTopic] = useState(form?.topic || "");
  const [grade, setGrade] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [quantity, setQuantity] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);   // { questions, needsManualAnswer, skipped }
  const [picked, setPicked] = useState(() => ({}));   // id → true
  const abortRef = useRef(null);

  const total = result?.questions?.length || 0;
  const chosenIds = Object.keys(picked).filter((k) => picked[k]);

  async function run() {
    setError(null);
    setBusy(true);
    setResult(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await generateQuestions({
        subject: subject || form?.subject,
        grade,
        topic: topic || form?.topic,
        difficulty,
        count: quantity,
        signal: ctrl.signal,
      });
      setResult(res);
      // Mặc định tick tất cả, trừ câu thiếu đáp án đúng thì để giáo viên chọn tay
      const init = {};
      for (const q of res.questions) init[q.id] = !!q.correctAnswer;
      setPicked(init);
      if (!res.questions.length) {
        setError("AI không sinh được câu hỏi nào đúng cấu trúc. Thử đổi chủ đề hoặc độ khó.");
      } else if (showToast) {
        showToast(`AI đã sinh ${res.questions.length} câu`, "success");
      }
    } catch (e) {
      if (e?.kind !== "timeout" || !ctrl.signal.aborted) setError(errText(e));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function cancel() {
    abortRef.current?.abort();
    setBusy(false);
  }

  function addSelected() {
    const qs = (result?.questions || []).filter((q) => picked[q.id]);
    if (!qs.length) return;
    onAdd(qs);
    if (showToast) showToast(`Đã thêm ${qs.length} câu từ AI`, "success");
    setResult(null);
    setPicked({});
  }

  return (
    <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 min-h-[44px] text-left"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 shrink-0 text-violet-600" aria-hidden />
          <span className="font-display text-sm font-bold text-violet-900 truncate">
            Sinh câu hỏi bằng AI
          </span>
          <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-200/70 text-violet-800 shrink-0">
            {API_BASE.replace(/^https?:\/\//, "")}
          </span>
        </span>
        <span className="text-violet-400 shrink-0">{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-violet-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Field label="Môn học">
              <Input
                value={subject}
                onChange={setSubject}
                placeholder={form?.subject || "Toán"}
              />
            </Field>
            <Field label="Chủ đề">
              <Input
                value={topic}
                onChange={setTopic}
                placeholder={form?.topic || "Phân số"}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Lớp">
              <Select
                value={grade}
                onChange={(v) => setGrade(Number(v))}
                options={GRADES.map((g) => ({ value: g, label: String(g) }))}
              />
            </Field>
            <Field label="Độ khó">
              <Select
                value={difficulty}
                onChange={setDifficulty}
                options={DIFFICULTIES.map((d) => ({ value: d.id, label: d.label }))}
              />
            </Field>
            <div className="col-span-2 sm:col-span-1">
              <Field label="Số câu">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(v) => setQuantity(Math.max(1, Math.min(20, Number(v) || 1)))}
                />
              </Field>
            </div>
          </div>

          <div className="flex gap-2">
            {busy ? (
              <GhostButton onClick={cancel} className="flex-1"><X className="w-4 h-4 inline mr-1" /> Huỷ đang sinh…</GhostButton>
            ) : (
              <button
                type="button"
                onClick={run}
                className="flex-1 min-h-[44px] rounded-xl bg-violet-600 text-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-violet-700 transition active:scale-[.98] inline-flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Sinh câu hỏi
              </button>
            )}
          </div>

          {busy && (
            <p className="text-[11px] text-violet-600 leading-relaxed">
              Đang chờ AI (có thể mất 10–60 giây tuỳ model). Ollama cần tải model trước lần đầu.
            </p>
          )}

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
              <p className="text-xs text-rose-700 leading-relaxed">{error}</p>
            </div>
          )}

          {result && total > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-xs font-semibold text-violet-900">
                  AI sinh {total} câu
                  {result.skipped > 0 && <span className="text-rose-600"> · {result.skipped} câu lỗi đã bỏ</span>}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const all = {};
                      for (const q of result.questions) all[q.id] = true;
                      setPicked(all);
                    }}
                    className="text-[11px] font-semibold text-violet-700 hover:underline"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setPicked({})}
                    className="text-[11px] font-semibold text-slate-500 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>

              {result.needsManualAnswer > 0 && (
                <p className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 leading-relaxed">
                  <TriangleAlert className="mt-0.5 w-3.5 h-3.5 shrink-0" />
                  <span>{result.needsManualAnswer} câu AI không nêu rõ đáp án đúng — nhớ chọn đáp án sau khi thêm.</span>
                </p>
              )}

              <div className="space-y-1.5 max-h-72 sm:max-h-96 overflow-y-auto overscroll-contain pr-1">
                {result.questions.map((q) => (
                  <label
                    key={q.id}
                    className={`flex gap-2.5 rounded-xl border px-3 py-3 cursor-pointer transition ${
                      picked[q.id] ? "border-violet-300 bg-violet-50" : "border-ink/10 bg-white hover:border-ink/25"
                    }`}
                  >
                    <Checkbox
                      checked={!!picked[q.id]}
                      onChange={(checked) => setPicked((s) => ({ ...s, [q.id]: checked }))}
                      className="mt-1"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-ink leading-snug break-words">{q.content}</span>
                      <span className="mt-1.5 flex flex-wrap gap-1">
                        {q.options.map((o) => (
                          <span
                            key={o.id}
                            className={`text-[11px] px-1.5 py-1 rounded break-words ${
                              o.id === q.correctAnswer
                                ? "bg-emerald-100 text-emerald-700 font-semibold"
                                : "bg-ink/5 text-slate-600"
                            }`}
                          >
                            {o.content}
                          </span>
                        ))}
                      </span>
                      {!q.correctAnswer && (
                        <span className="mt-1 block text-[11px] font-semibold text-amber-700">
                          Chưa có đáp án đúng — chọn tay sau khi thêm
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={addSelected}
                  disabled={!chosenIds.length}
                  className="flex-1 min-h-[44px] rounded-xl bg-ink text-paper px-4 py-2 text-sm font-bold shadow-sm hover:opacity-90 transition disabled:opacity-35"
                >
                  + Thêm {chosenIds.length || ""} câu đã chọn
                </button>
                <button
                  type="button"
                  onClick={() => { setResult(null); setPicked({}); }}
                  className="min-h-[44px] rounded-xl border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 hover:bg-ink/5"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}