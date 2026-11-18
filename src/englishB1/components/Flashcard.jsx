/**
 * Flashcard — thẻ lật 3D cho phần học/ôn từ vựng (English B1).
 *
 * Bấm vào thẻ (hoặc Enter/Space khi đang focus) gọi `onFlip()` để lật sang mặt
 * sau bằng animation rotateY. Thẻ giữ chiều cao ổn định (`min-h-[240px]`),
 * nội dung dài cuộn bên trong để không vỡ bố cục.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.front]  Nội dung mặt trước (hiện khi chưa lật).
 * @param {React.ReactNode} [props.back]   Nội dung mặt sau (hiện khi đã lật).
 * @param {boolean} [props.flipped]        true = đang hiển thị mặt sau.
 * @param {() => void} [props.onFlip]      Gọi khi người dùng bấm để lật thẻ.
 * @param {string} [props.className]       Lớp bổ sung cho khung thẻ.
 */
export function Flashcard({ front, back, flipped = false, onFlip, className = "" }) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? "Thẻ đang xem mặt sau, bấm để lật lại mặt trước"
          : "Thẻ đang xem mặt trước, bấm để lật sang mặt sau"
      }
      className={`relative block w-full min-h-[240px] cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-paper2 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal ${className}`}
      style={{ perspective: "1200px" }}
    >
      <span
        className="absolute inset-0 block transition-transform duration-500 ease-in-out"
        style={{ transformStyle: "preserve-3d", transform: `rotateY(${flipped ? 180 : 0}deg)` }}
      >
        {/* Mặt trước — ẩn khi thẻ đã lật (backface-visibility) */}
        <span
          aria-hidden={flipped}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto rounded-2xl p-5 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </span>
        {/* Mặt sau — quay 180° nên chỉ thấy khi thẻ đã lật */}
        <span
          aria-hidden={!flipped}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto rounded-2xl p-5 text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </span>
      </span>
    </button>
  );
}
