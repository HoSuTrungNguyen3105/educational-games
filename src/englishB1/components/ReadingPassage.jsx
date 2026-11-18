/**
 * ReadingPassage — khối đoạn văn bài đọc, đánh số từng đoạn.
 *
 * Đoạn tại `activeIndex` được tô sáng (bg-teal/10 + border-teal) để trang
 * "chỉ ra vị trí thông tin" khi chấm/review. Bấm đoạn gọi `onPick(index)`.
 * Dùng `div role="button"` thay vì `<button>` để text bên trong vẫn chọn
 * được bình thường (không chặn selection).
 *
 * @param {object} props
 * @param {string[]} props.paragraphs  Các đoạn văn (mỗi phần tử 1 đoạn).
 * @param {number} [props.activeIndex] Index đoạn đang được đánh dấu (-1 = không).
 * @param {(index: number) => void} [props.onPick] Gọi với index đoạn được bấm.
 * @param {string} [props.title]       Tiêu đề khối (mặc định "Đoạn văn").
 */
export function ReadingPassage({ paragraphs = [], activeIndex = -1, onPick, title }) {
  const pick = (index) => {
    if (onPick) onPick(index);
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-paper2">
      <header className="flex items-center justify-between gap-2 border-b border-ink/10 px-4 py-3">
        <h3 className="min-w-0 break-words font-display text-base font-semibold text-ink sm:text-lg">
          {title || "Đoạn văn"}
        </h3>
        <span className="shrink-0 font-mono text-[11px] text-[#8A7C63]">{paragraphs.length} đoạn</span>
      </header>

      <div className="max-h-[60vh] space-y-2 overflow-y-auto px-3 py-3">
        {paragraphs.map((text, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => pick(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  pick(index);
                }
              }}
              className={`cursor-pointer whitespace-pre-line rounded-xl border px-3 py-2.5 text-left text-sm leading-relaxed transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${
                isActive
                  ? "border-teal bg-teal/10 text-ink"
                  : "border-ink/10 text-ink/80 hover:border-ink/25 hover:bg-ink/5"
              }`}
            >
              <span
                className={`mr-1.5 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                  isActive ? "bg-teal text-paper" : "bg-ink/10 text-ink/60"
                }`}
              >
                ĐOẠN {index + 1}
              </span>
              {text}
            </div>
          );
        })}

        {paragraphs.length === 0 && (
          <p className="px-1 py-6 text-center text-sm text-[#8A7C63]">Bài đọc chưa có đoạn văn nào.</p>
        )}
      </div>
    </section>
  );
}
