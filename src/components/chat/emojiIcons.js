// Bộ biểu tượng cảm xúc DÙNG CHUNG cho chat (reaction + sticker) — dùng đúng
// các file sẵn có ở src/assets/img/icons/, không vẽ mới, không dùng emoji
// unicode thay thế. `id` là định danh lưu ở server (xem REACTION_ICONS trong
// server/src/services/reactionService.js — hai danh sách phải khớp nhau);
// nhãn tiếng Việt đặt theo đúng hình thật của từng file.
import icon01 from "../../assets/img/icons/emoj-icon-01.svg";
import icon02 from "../../assets/img/icons/emoj-icon-02.svg";
import icon03 from "../../assets/img/icons/emoj-icon-03.svg";
import icon04 from "../../assets/img/icons/emoj-icon-04.svg";
import icon05 from "../../assets/img/icons/emoj-icon-05.svg";

export const EMOJI_ICONS = [
  { id: "emoj-icon-01", label: "Thích", src: icon01 }, // ngón tay cái 👍
  { id: "emoj-icon-02", label: "Yêu thích", src: icon02 }, // trái tim đỏ
  { id: "emoj-icon-03", label: "Vui", src: icon03 }, // cười ra nước mắt
  { id: "emoj-icon-04", label: "Ngạc nhiên", src: icon04 }, // mặt wow
  { id: "emoj-icon-05", label: "Cảm ơn", src: icon05 }, // hai tay chắp
];

export function emojiIconById(id) {
  return EMOJI_ICONS.find((e) => e.id === id) || null;
}
