// QuestionCard.jsx — bộ hiển thị + trả lời MỘT câu hỏi, dùng cho mọi trang
// (từ vựng, ngữ pháp, reading, listening, bài thi). Điều khiển hoàn toàn từ
// ngoài: `given` + `onChange`, trang là nơi chấm điểm qua scoringUtils.
//
// Hỗ trợ mọi type trong README §4.7:
//   trắc nghiệm (options) · điền từ/gõ chữ · ghép cặp · sắp xếp câu.
import { useMemo } from "react";
import { Input, PrimaryButton, GhostButton } from "../../components/ui";
import { CheckCircle2, XCircle, Lightbulb, MapPin, RotateCcw } from "lucide-react";
import AudioPlayer from "./AudioPlayer.jsx";
import { shuffle, makeRng } from "../utils/learningUtils.js";

const TYPE_LABELS = {
  multiple_choice: "Trắc nghiệm",
  mcq: "Trắc nghiệm",
  comprehension: "Đọc hiểu",
  vocabulary_in_context: "Từ vựng trong ngữ cảnh",
  true_false: "Đúng / Sai",
  true_false_not_given: "Đúng / Sai / Không nêu",
  fill_blank: "Điền từ",
  gap_filling: "Điền khoảng trống",
  short_answer: "Trả lời ngắn",
  matching: "Ghép cặp",
  matching_headings: "Ghép tiêu đề",
  matching_information: "Ghép thông tin",
  error_correction: "Tìm lỗi sai",
  sentence_transformation: "Chuyển đổi câu",
  sentence_ordering: "Sắp xếp câu",
  word_formation: "Từ loại / đuôi từ",
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Trạng thái có options. */
function hasOptions(item) {
  if (Array.isArray(item.options) && item.options.length) return true;
  if (item.type === "true_false") return true;
  if (item.type === "true_false_not_given") return true;
  return false;
}

function optionsOf(item) {
  if (Array.isArray(item.options) && item.options.length) return item.options;
  if (item.type === "true_false") return ["True", "False"];
  if (item.type === "true_false_not_given") return ["True", "False", "Not Given"];
  return [];
}

/** type gõ chữ. */
function isTextType(item) {
  return ["fill_blank", "gap_filling", "short_answer", "word_formation",
    "error_correction", "sentence_transformation"].includes(item.type);
}

function isMatchingType(item) {
  return ["matching", "matching_headings", "matching_information"].includes(item.type);
}

/** Dòng đúng (dùng cho sentence_ordering). */
function correctOrder(item) {
  if (Array.isArray(item.words) && item.words.length) return item.words;
  return String(item.answer || "").split(/\s+/).filter(Boolean);
}

/** Chuỗi hash ổn định để trộn từ không nhảy giữa các lần render. */
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0;
  return h || 1;
}

/**
 * @param {object} props
 * @param {object} props.item      câu hỏi (README §4.7)
 * @param {number} [props.index]   thứ tự 0-based (hiện "Câu n")
 * @param {number} [props.total]   tổng số câu
 * @param {*} props.given          câu trả lời hiện tại
 * @param {(given:any)=>void} props.onChange
 * @param {boolean} props.revealed true → hiện đáp án đúng + giải thích
 * @param {boolean} [props.correct]   true/false — kết quả do TRANG chấm (scoringUtils),
 *                                    hiển thị badge "Đúng/Chưa đúng". Không truyền thì bỏ qua.
 * @param {boolean} [props.disabled]
 * @param {() => void} [props.onReveal] nút "Hiện đáp án" (chỉ hiện khi truyền)
 * @param {boolean} [props.compact]     kiểu gọn (dùng trong danh sách câu hỏi)
 */
export default function QuestionCard({
  item, index, total, given, onChange, revealed, correct, disabled = false, onReveal, compact = false,
}) {
  const options = useMemo(() => (hasOptions(item) ? optionsOf(item) : []), [item]);
  const shuffledWords = useMemo(() => {
    if (item.type !== "sentence_ordering") return [];
    return shuffle(correctOrder(item), makeRng(hashSeed(String(item.id))));
  }, [item]);

  if (!item) return null;

  const typeLabel = TYPE_LABELS[item.type] || item.type;
  const placed = Array.isArray(given) && item.type === "sentence_ordering" ? given : [];
  const available = shuffledWords.filter((w) => !placed.includes(w));

  const setOption = (i) => {
    if (disabled || revealed) return;
    onChange(i);
  };
  const setText = (value) => {
    if (disabled || revealed) return;
    onChange(value);
  };
  const setMatchingValue = (rowIndex, optionIndex) => {
    if (disabled || revealed) return;
    const arr = Array.isArray(given) && given.length === (item.items || []).length
      ? [...given]
      : (item.items || []).map(() => -1);
    arr[rowIndex] = optionIndex;
    onChange(arr);
  };
  const placeWord = (word) => {
    if (disabled || revealed) return;
    onChange([...placed, word]);
  };
  const removeWord = (word) => {
    if (disabled || revealed) return;
    const i = placed.indexOf(word);
    if (i < 0) return;
    onChange(placed.filter((_, idx) => idx !== i));
  };

  return (
    <div className="bg-paper2 border border-ink/10 rounded-2xl p-4 sm:p-5">
      {/* Đầu câu */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          {typeof index === "number" && (
            <p className="font-mono text-[11px] uppercase text-[#8A7C63]">
              Câu {index + 1}{typeof total === "number" ? ` / ${total}` : ""}
            </p>
          )}
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-ink/5 text-[10px] font-mono uppercase text-[#8A7C63]">
            {typeLabel}
          </span>
        </div>
        {revealed && typeof correct === "boolean" && (
          <span
            className={`inline-flex items-center gap-1 shrink-0 text-xs font-semibold font-body px-2 py-1 rounded-lg ${
              correct ? "bg-teal/10 text-teal" : "bg-ticket/10 text-ticket"
            }`}
            aria-live="polite"
          >
            {correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {correct ? "Đúng" : "Chưa đúng"}
          </span>
        )}
      </div>

      {/* Câu hỏi */}
      <div className="text-ink font-body text-[15px] leading-relaxed whitespace-pre-line">
        {item.sentence && !item.question ? item.sentence : item.question}
      </div>

      {item.sentence && item.question && (
        <p className="mt-1 text-sm text-ink/70 font-body whitespace-pre-line">{item.sentence}</p>
      )}

      {item.hint && (
        <p className="mt-1 text-xs text-[#8A7C63] font-body">Gợi ý: {item.hint}</p>
      )}

      {/* Âm thanh (TTS / file thật nếu có) */}
      {(item.audioText || item.audioUrl) && (
        <div className="mt-3">
          <AudioPlayer
            text={item.audioText}
            audioUrl={item.audioUrl}
            audioStatus={item.audioUrl ? "ready" : "missing"}
            label={item.audioLabel}
          />
        </div>
      )}

      {/* ── Vùng trả lời ── */}
      <div className="mt-4">
        {/* Trắc nghiệm / Đúng–Sai */}
        {hasOptions(item) && (
          <ul className="space-y-2">
            {options.map((opt, i) => {
              const isChosen = Number(given) === i;
              const isCorrect = revealed && Number(item.answer) === i;
              const isWrongChosen = revealed && isChosen && !isCorrect;
              return (
                <li key={`${item.id}-opt-${i}`}>
                  <button
                    type="button"
                    onClick={() => setOption(i)}
                    disabled={disabled || revealed}
                    aria-pressed={isChosen}
                    className={`w-full flex items-start gap-3 text-left rounded-xl border px-3 py-2.5 transition ${
                      isCorrect
                        ? "border-teal bg-teal/10"
                        : isWrongChosen
                          ? "border-ticket bg-ticket/10"
                          : isChosen
                            ? "border-ink bg-ink/5"
                            : "border-ink/10 bg-paper hover:border-ink/30 hover:bg-ink/[0.03]"
                    } ${disabled || revealed ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span
                      className={`shrink-0 w-6 h-6 rounded-lg inline-flex items-center justify-center text-[11px] font-mono font-bold ${
                        isCorrect
                          ? "bg-teal text-paper"
                          : isWrongChosen
                            ? "bg-ticket text-paper"
                            : isChosen
                              ? "bg-ink text-paper"
                              : "bg-ink/10 text-[#8A7C63]"
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : LETTERS[i]}
                    </span>
                    <span className="text-sm font-body text-ink">{opt}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Ghép cặp */}
        {isMatchingType(item) && (
          <div className="space-y-2">
            {(item.items || []).map((left, i) => {
              const chosen = Array.isArray(given) ? given[i] : -1;
              const ok = revealed && Number(chosen) === Number(item.answer?.[i]);
              return (
                <div
                  key={`${item.id}-m-${i}`}
                  className={`flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border px-3 py-2 ${
                    revealed ? (ok ? "border-teal bg-teal/5" : "border-ticket bg-ticket/5") : "border-ink/10 bg-paper"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:w-1/2 min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-lg bg-ink/10 text-[11px] font-mono font-bold inline-flex items-center justify-center text-[#8A7C63]">
                      {i + 1}
                    </span>
                    <span className="text-sm font-body text-ink">{left}</span>
                  </div>
                  <select
                    className="flex-1 min-w-0 rounded-lg border border-ink/15 bg-paper px-2.5 py-2 text-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-teal/40 disabled:opacity-60"
                    value={chosen >= 0 ? String(chosen) : ""}
                    disabled={disabled || revealed}
                    onChange={(e) => setMatchingValue(i, e.target.value === "" ? -1 : Number(e.target.value))}
                    aria-label={`Ghép cho "${left}"`}
                  >
                    <option value="">— Chọn đáp án —</option>
                    {options.map((opt, oi) => (
                      <option key={`${item.id}-o-${oi}`} value={oi}>{oi + 1}. {opt}</option>
                    ))}
                  </select>
                </div>
              );
            })}
            {revealed && (
              <p className="text-xs font-mono text-[#8A7C63]">
                Đáp án: {(item.answer || []).map((a, i) => `${i + 1}→${Number(a) + 1}`).join("  ")}
              </p>
            )}
          </div>
        )}

        {/* Sắp xếp câu */}
        {item.type === "sentence_ordering" && (
          <div className="space-y-3">
            <div className="min-h-[52px] rounded-xl border border-dashed border-ink/20 bg-paper p-2.5 flex flex-wrap gap-2 items-center">
              {placed.length === 0 && (
                <span className="text-xs text-[#8A7C63] font-body">Bấm các từ bên dưới để lắp câu…</span>
              )}
              {placed.map((w, i) => (
                <button
                  key={`p-${w}-${i}`}
                  type="button"
                  disabled={disabled || revealed}
                  onClick={() => removeWord(w)}
                  className="px-2.5 py-1.5 rounded-lg bg-ink text-paper text-sm font-body disabled:opacity-70"
                  title="Bấm để lấy lại từ"
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {available.map((w, i) => (
                <button
                  key={`a-${w}-${i}`}
                  type="button"
                  disabled={disabled || revealed}
                  onClick={() => placeWord(w)}
                  className="px-2.5 py-1.5 rounded-lg border border-ink/15 bg-paper2 text-sm font-body text-ink hover:border-ink/40 disabled:opacity-60"
                >
                  {w}
                </button>
              ))}
              {available.length === 0 && <span className="text-xs text-[#8A7C63] font-body">Đã dùng hết từ.</span>}
            </div>
            {revealed && (
              <p className="text-sm font-body text-teal">Đáp án: {correctOrder(item).join(" ")}</p>
            )}
          </div>
        )}

        {/* Gõ chữ (điền từ, tìm lỗi, chuyển đổi câu…) */}
        {isTextType(item) && (
          <div className="max-w-xl">
            <Input
              type="text"
              value={typeof given === "string" ? given : ""}
              onChange={(value) => setText(value)}
              placeholder={item.placeholder || "Nhập câu trả lời…"}
              disabled={disabled || revealed}
              aria-label="Câu trả lời"
            />
            {revealed && (
              <p className="mt-2 text-sm font-body text-teal">
                Đáp án đúng: <span className="font-mono">{Array.isArray(item.answer) ? item.answer.join(" / ") : item.answer}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Sau khi trả lời ── */}
      {revealed && (
        <div className="mt-4 rounded-xl border border-ink/10 bg-paper p-3 space-y-2">
          <p className="flex items-start gap-2 text-sm font-body text-ink">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
            <span>{item.explanationVi}</span>
          </p>
          {item.locationVi && (
            <p className="flex items-start gap-2 text-xs font-body text-[#8A7C63]">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal" />
              <span>Vị trí trong bài: {item.locationVi}</span>
            </p>
          )}
        </div>
      )}

      {/* Nút hiện đáp án (chế độ luyện tập) */}
      {!revealed && onReveal && (
        <div className="mt-4 flex justify-end">
          <GhostButton onClick={onReveal} disabled={disabled}>
            <span className="inline-flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4" />
              Hiện đáp án
            </span>
          </GhostButton>
        </div>
      )}

      {compact && <div className="sr-only">{typeLabel}</div>}
    </div>
  );
}

/** Nút "Kiểm tra" dùng chung cho các trang luyện tập. */
export function CheckAnswerButton({ revealed, disabled, onReveal, children = "Kiểm tra đáp án" }) {
  if (revealed) return null;
  return (
    <PrimaryButton onClick={onReveal} disabled={disabled}>
      {children}
    </PrimaryButton>
  );
}
