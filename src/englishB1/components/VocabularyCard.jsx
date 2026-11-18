import { Bookmark } from "lucide-react";
import { IconButton, PrimaryButton } from "../../components/ui";

/**
 * Trạng thái từ → nhãn badge + màu token class (tự đổi theo dark mode).
 * new: xám · learning: gold · learned: teal · review: ticket.
 */
const STATUS_BADGE = {
  new: { label: "Mới", cls: "bg-ink/10 text-ink/70 border-ink/25" },
  learning: { label: "Đang học", cls: "bg-gold/15 text-[#8a6a10] border-gold/40" },
  learned: { label: "Đã học", cls: "bg-teal/15 text-teal border-teal/30" },
  review: { label: "Cần ôn", cls: "bg-ticket/15 text-ticket border-ticket/30" },
};

/**
 * VocabularyCard — một thẻ từ vựng trong danh sách/lưới học từ.
 * Chỉ hiển thị + bắn callback: `onOpen` (xem chi tiết/ôn từ),
 * `onToggleHard` (đánh dấu/bỏ cờ từ khó). Không tự lưu progress.
 *
 * @param {object} props
 * @param {object} props.word          Từ vựng (word, ipa, meaningVi, pos, example, exampleVi, difficulty…).
 * @param {"new"|"learning"|"learned"|"review"} [props.status] Trạng thái SRS của từ.
 * @param {boolean} [props.hard]       true = đang đánh dấu là từ khó.
 * @param {() => void} [props.onOpen]  Mở chi tiết / ôn từ.
 * @param {() => void} [props.onToggleHard] Bật/tắt cờ "từ khó".
 */
export function VocabularyCard({ word, status = "new", hard = false, onOpen, onToggleHard }) {
  const w = word || {};
  const badge = STATUS_BADGE[status] || STATUS_BADGE.new;

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-ink/10 bg-paper2 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="break-words font-display text-lg font-bold leading-snug text-ink">{w.word}</p>
          {w.ipa && <p className="mt-0.5 break-words font-mono text-sm text-[#8A7C63]">{w.ipa}</p>}
        </div>
        <IconButton
          title={hard ? "Bỏ cờ từ khó" : "Đánh dấu từ khó"}
          onClick={onToggleHard}
          className={hard ? "ring-2 ring-ticket/70" : ""}
        >
          <Bookmark className={`h-4 w-4 ${hard ? "fill-current text-ticket" : "text-ink/60"}`} />
        </IconButton>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {w.pos && (
          <span className="badge-status rounded-full border border-ink/15 bg-ink/5 px-2 py-0.5 text-[10px] uppercase text-ink/70">
            {w.pos}
          </span>
        )}
        <span className={`badge-status rounded-full border px-2.5 py-0.5 text-[11px] ${badge.cls}`}>{badge.label}</span>
      </div>

      <p className="break-words text-sm font-semibold leading-relaxed text-ink">{w.meaningVi}</p>

      {(w.example || w.exampleVi) && (
        <div className="rounded-xl border border-ink/10 bg-ink/5 px-3 py-2">
          {w.example && <p className="break-words text-sm italic leading-relaxed text-ink/85">{w.example}</p>}
          {w.exampleVi && (
            <p className="mt-1 break-words text-xs leading-relaxed text-[#8A7C63]">{w.exampleVi}</p>
          )}
        </div>
      )}

      <div className="mt-auto pt-1">
        <PrimaryButton onClick={onOpen} className="w-full">
          Xem chi tiết
        </PrimaryButton>
      </div>
    </article>
  );
}
