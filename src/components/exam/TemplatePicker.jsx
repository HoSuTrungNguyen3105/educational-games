import { EXAM_TEMPLATES } from "../../games/examination/templates.js";
import { ListChecks, Gamepad2 } from "lucide-react";

/**
 * TemplatePicker — chọn HÌNH THỨC LÀM BÀI cho một bài giao.
 *
 * "Danh sách câu hỏi" = templateId null → trang làm bài render form React.
 * Còn lại là mẫu đề thi HTML trong src/games/examination (đề thi chạy trong
 * iframe, câu hỏi do app đẩy xuống — xem ExamPlayer.jsx).
 */
const NONE = { id: null, name: "Danh sách câu hỏi", desc: "Form trắc nghiệm quen thuộc, lật từng câu và nộp bài.", style: "Cơ bản" };

export default function TemplatePicker({ value, onChange }) {
  const cards = [NONE, ...EXAM_TEMPLATES];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-body text-ink/60">Hình thức làm bài</label>
        <span className="text-[11px] font-mono text-ink/30">lưu vào bài giao: templateId</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => {
          const active = (value || null) === c.id;
          return (
            <button key={String(c.id)} type="button" onClick={() => onChange(c.id)}
              className={`text-left p-3 rounded-xl border transition ${active
                ? "border-gold bg-gold/5"
                : "border-ink/8 bg-white hover:border-ink/20"}`}>
              <div className="flex items-center gap-2">
                {c.id ? <Gamepad2 className={`w-4 h-4 shrink-0 ${active ? "text-gold" : "text-ink/30"}`} />
                      : <ListChecks className={`w-4 h-4 shrink-0 ${active ? "text-gold" : "text-ink/30"}`} />}
                <span className="text-sm font-body text-ink truncate">{c.name}</span>
              </div>
              <p className="text-xs font-body text-ink/45 mt-1.5 leading-relaxed">{c.desc}</p>
              <span className="inline-block mt-2 text-[10px] font-mono text-ink/35 border border-ink/10 rounded-md px-1.5 py-0.5">
                {c.style}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
