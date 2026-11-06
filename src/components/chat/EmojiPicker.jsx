import { EMOJI_ICONS } from "./emojiIcons.js";

/**
 * Bảng chọn biểu tượng cảm xúc DÙNG CHUNG — một component cho cả hai việc:
 * thả cảm xúc (reaction) vào tin nhắn và gửi sticker khi soạn tin.
 * Component chỉ lo hiển thị + báo lựa chọn qua onSelect(iconId); việc
 * đóng/mở và vị trí đặt bảng do nơi dùng quyết định (panel trong luồng
 * nội dung nên không bao giờ tràn màn hình, kể cả khổ 390px).
 */
export default function EmojiPicker({ onSelect }) {
  return (
    <div
      className="flex items-center justify-center gap-1"
      role="menu"
      aria-label="Chọn biểu tượng cảm xúc"
    >
      {EMOJI_ICONS.map((e) => (
        <button
          key={e.id}
          type="button"
          onClick={() => onSelect?.(e.id)}
          aria-label={e.label}
          title={e.label}
          className="w-10 h-10 rounded-full hover:bg-gold/15 active:scale-110 transition flex items-center justify-center shrink-0"
        >
          <img
            src={e.src}
            alt={e.label}
            className="w-7 h-7 pointer-events-none select-none"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}
