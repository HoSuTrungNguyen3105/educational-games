import { useId } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

/** Nhóm chuyên đề trong data/grammar → nhãn tiếng Việt hiển thị. */
const CATEGORY_LABELS = {
  tenses: "Thì",
  passive: "Câu bị động",
  conditionals: "Câu điều kiện",
  modals: "Động từ khuyết",
  "reported-speech": "Câu gián tiếp",
  relative: "Mệnh đề quan hệ",
  comparison: "So sánh",
  "gerund-infinitive": "Gerund & Infinitive",
  articles: "Mạo từ",
  prepositions: "Giới từ",
  conjunctions: "Liên từ",
  quantifiers: "Từ chỉ số lượng",
  "question-tags": "Câu hỏi đuôi",
};

const DIFFICULTY_LABELS = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };

const HEADING_CLS = "mb-1.5 font-mono text-[11px] uppercase tracking-wider text-[#8A7C63]";

/**
 * GrammarLesson — chỉ phần LÝ THUYẾT của một chuyên đề ngữ pháp.
 * Tiêu đề + nút toggle (mũi tên); khi `expanded` mới render nội dung giải thích,
 * công thức, cách dùng, ví dụ EN/VI và lỗi thường gặp. Không có bài tập
 * (trang GrammarPage tự làm phần đó).
 *
 * @param {object} props
 * @param {object} props.lesson   Chuyên đề (title, category, level, difficulty, content{…}).
 * @param {boolean} [props.expanded] Đang mở phần lý thuyết hay không.
 * @param {() => void} [props.onToggle] Gọi khi bấm nút mở/đóng.
 */
export function GrammarLesson({ lesson, expanded = false, onToggle }) {
  const panelId = useId();
  const content = lesson?.content || {};
  const usage = content.usageVi || [];
  const examples = content.examples || [];
  const mistakes = content.mistakesVi || [];
  const category = lesson?.category
    ? CATEGORY_LABELS[lesson.category] || lesson.category
    : null;
  const difficulty = lesson?.difficulty
    ? DIFFICULTY_LABELS[lesson.difficulty] || lesson.difficulty
    : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-ink/10 bg-paper2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
      >
        <span className="min-w-0 flex-1">
          <span className="block break-words font-display text-base font-semibold text-ink sm:text-lg">
            {lesson?.title}
          </span>
          <span className="mt-1.5 flex flex-wrap gap-1.5">
            {category && (
              <span className="badge-status rounded-full border border-ink/15 bg-ink/5 px-2 py-0.5 text-[10px] uppercase text-ink/70">
                {category}
              </span>
            )}
            {lesson?.level && (
              <span className="badge-status rounded-full border border-teal/30 bg-teal/10 px-2 py-0.5 text-[10px] uppercase text-teal">
                {lesson.level}
              </span>
            )}
            {difficulty && (
              <span className="badge-status rounded-full border border-ink/15 bg-ink/5 px-2 py-0.5 text-[10px] uppercase text-ink/70">
                {difficulty}
              </span>
            )}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 text-ink/60 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div id={panelId} className="space-y-4 border-t border-ink/10 px-4 py-4">
          {content.explanationVi && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink/85">
              {content.explanationVi}
            </p>
          )}

          {content.formula && (
            <div className="rounded-xl border border-teal/30 bg-teal/10 px-4 py-3">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-teal">Công thức</p>
              <code className="block break-words font-mono text-sm leading-relaxed text-ink sm:text-base">
                {content.formula}
              </code>
            </div>
          )}

          {usage.length > 0 && (
            <div>
              <p className={HEADING_CLS}>Cách dùng</p>
              <ul className="space-y-1.5">
                {usage.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink/85">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {examples.length > 0 && (
            <div>
              <p className={HEADING_CLS}>Ví dụ</p>
              <div className="overflow-x-auto rounded-xl border border-ink/10">
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-ink/5">
                      <th className="px-3 py-2 text-left font-mono text-[11px] uppercase text-[#8A7C63]">
                        Tiếng Anh
                      </th>
                      <th className="px-3 py-2 text-left font-mono text-[11px] uppercase text-[#8A7C63]">
                        Tiếng Việt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {examples.map((ex, i) => (
                      <tr key={i} className="border-t border-ink/10 align-top">
                        <td className="px-3 py-2 leading-relaxed text-ink">{ex?.english}</td>
                        <td className="px-3 py-2 leading-relaxed text-[#8A7C63]">{ex?.vietnamese}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {mistakes.length > 0 && (
            <div>
              <p className={HEADING_CLS}>Lỗi thường gặp</p>
              <ul className="space-y-2">
                {mistakes.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-xl border border-ticket/20 bg-ticket/5 px-3 py-2 text-sm leading-relaxed text-ink/85"
                  >
                    <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ticket" />
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
