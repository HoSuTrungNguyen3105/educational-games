// ExamNavigation.jsx — điều khiển làm bài thi (spec §10.3): chuyển câu,
// lưới đánh số có màu (đã trả lời / đã đánh dấu / câu hiện tại), đánh dấu
// câu cần xem lại, nút nộp bài.
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { GhostButton, PrimaryButton } from "../../components/ui";

function isAnswered(given) {
  if (given === undefined || given === null || given === "") return false;
  if (Array.isArray(given)) return given.length > 0 && given.every((x) => x !== -1 && x !== "");
  return true;
}

/**
 * @param {object} props
 * @param {number} props.index      câu hiện tại (0-based)
 * @param {number} props.total      tổng số câu
 * @param {Record<string,*>} props.answers  answers[qkey] → đã trả lời?
 * @param {string[]} props.keys     danh sách key theo thứ tự (qkey)
 * @param {Record<string,boolean>} [props.flagged] câu đã đánh dấu
 * @param {(i:number)=>void} props.onJump
 * @param {()=>void} [props.onPrev]
 * @param {()=>void} [props.onNext]
 * @param {()=>void} [props.onToggleFlag]
 * @param {()=>void} props.onSubmit
 * @param {string} [props.submitLabel]
 * @param {boolean} [props.canSubmit]
 */
export default function ExamNavigation({
  index, total, keys = [], answers = {}, flagged = {},
  onJump, onPrev, onNext, onToggleFlag, onSubmit, submitLabel = "Nộp bài", canSubmit = true,
}) {
  const answeredCount = keys.filter((k) => isAnswered(answers[k])).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const isCurrentFlagged = flagged[keys[index]];

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper2 p-3 sm:p-4 space-y-3">
      {/* Tiến độ */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#8A7C63]">
        <span>Đã trả lời <b className="text-ink">{answeredCount}</b>/{total}</span>
        {flaggedCount > 0 && <span className="text-gold">Đánh dấu {flaggedCount} câu</span>}
      </div>
      <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-teal transition-all"
          style={{ width: `${total ? (answeredCount / total) * 100 : 0}%` }}
        />
      </div>

      {/* Lưới số câu */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex flex-wrap gap-1.5 min-w-max justify-center sm:justify-start">
          {keys.map((k, i) => {
            const answered = isAnswered(answers[k]);
            const isFlagged = !!flagged[k];
            const isCurrent = i === index;
            return (
              <button
                key={k}
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Câu ${i + 1}${answered ? ", đã trả lời" : ", chưa trả lời"}${isFlagged ? ", đã đánh dấu" : ""}`}
                aria-current={isCurrent ? "true" : undefined}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-semibold border transition ${
                  isCurrent
                    ? "border-ink bg-ink text-paper"
                    : answered
                      ? "border-teal/40 bg-teal/15 text-teal"
                      : "border-ink/15 bg-paper text-[#8A7C63] hover:border-ink/40"
                } ${isFlagged ? "ring-2 ring-gold" : ""}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chú thích */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-body text-[#8A7C63]">
        <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-teal/40 inline-block" /> Đã trả lời</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-ink/10 border border-ink/15 inline-block" /> Chưa trả lời</span>
        <span className="inline-flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-gold/30 ring-1 ring-gold inline-block" /> Đánh dấu</span>
      </div>

      {/* Điều khiển */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <GhostButton onClick={onPrev} disabled={index <= 0}>
          <span className="inline-flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Trước</span>
        </GhostButton>

        <div className="flex items-center gap-2">
          <GhostButton onClick={onToggleFlag} disabled={!onToggleFlag}>
            <span className={`inline-flex items-center gap-1 ${isCurrentFlagged ? "text-gold" : ""}`}>
              <Flag className="w-4 h-4" />
              {isCurrentFlagged ? "Bỏ đánh dấu" : "Đánh dấu"}
            </span>
          </GhostButton>
          <PrimaryButton onClick={onSubmit} disabled={!canSubmit}>
            <span className="inline-flex items-center gap-1.5">
              <Send className="w-4 h-4" />
              {submitLabel}
            </span>
          </PrimaryButton>
        </div>

        <GhostButton onClick={onNext} disabled={index >= total - 1}>
          <span className="inline-flex items-center gap-1">Sau <ChevronRight className="w-4 h-4" /></span>
        </GhostButton>
      </div>
    </div>
  );
}
