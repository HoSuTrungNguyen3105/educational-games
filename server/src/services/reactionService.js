import { getCollection } from "../db.js";
import { isBlockedBetween } from "./blockService.js";

// ── Cảm xúc (reactions) + sticker cho tin nhắn ─────────────────────────────
// Bộ biểu tượng dùng CHUNG với frontend (src/components/chat/emojiIcons.js);
// file ảnh nằm ở src/assets/img/icons/emoj-icon-0X.svg. Server chỉ lưu ĐỊNH
// DANH (id) — client tự ánh xạ id → ảnh và nhãn hiển thị.
export const REACTION_ICONS = [
  "emoj-icon-01", // Thích (ngón tay cái)
  "emoj-icon-02", // Yêu thích (trái tim)
  "emoj-icon-03", // Vui (cười ra nước mắt)
  "emoj-icon-04", // Ngạc nhiên (mặt wow)
  "emoj-icon-05", // Cảm ơn (chắp tay)
];

export function isReactionIcon(icon) {
  return REACTION_ICONS.includes(icon);
}

// Nội dung văn bản lưu kèm tin sticker — để danh sách cuộc trò chuyện và
// thông báo hiển thị mô tả thay vì mã icon.
export const STICKER_CONTENT = "Đã gửi một biểu tượng cảm xúc";

const MESSAGES = "messages";

/**
 * Đặt / gỡ / đổi reaction của `userId` trên một tin nhắn (toggle):
 *  - Chưa có reaction của mình → thêm mới.
 *  - Đã thả đúng icon đó → gỡ bỏ.
 *  - Đã thả icon khác → thay thế (mỗi người tối đa 1 reaction / tin nhắn).
 *
 * Chỉ người tham gia cuộc trò chuyện mới được react. Với DM 1-1, hai phía
 * đã chặn nhau thì không tương tác được nữa — cùng quy tắc và tinh thần lỗi
 * trung tính như gửi tin (xem chatService.sendMessage + blockService).
 *
 * @returns {{ message: object, reactions: Array<{userId, icon}>, myIcon: string|null }}
 *   myIcon = icon của mình SAU thao tác (null = vừa gỡ).
 */
export async function toggleReaction({ conversationId, messageId, userId, icon }) {
  if (!isReactionIcon(icon)) throw new Error("Biểu tượng cảm xúc không hợp lệ");
  if (!conversationId || !messageId || !userId) throw new Error("Thiếu thông tin thả cảm xúc");

  const col = getCollection(MESSAGES);
  const msg = await col.findOne({ id: messageId, conversationId });
  if (!msg) throw new Error("Không tìm thấy tin nhắn");

  if (conversationId.startsWith("dm:")) {
    const parts = conversationId.split(":");
    if (parts.length !== 3 || (parts[1] !== userId && parts[2] !== userId)) {
      throw new Error("Bạn không tham gia cuộc trò chuyện này");
    }
    const otherId = parts[1] === userId ? parts[2] : parts[1];
    if (await isBlockedBetween(userId, otherId)) {
      throw new Error("Không thể tương tác với tin nhắn này");
    }
  } else {
    const member = await getCollection("conversationMembers").findOne({ conversationId, userId });
    if (!member) throw new Error("Bạn không tham gia cuộc trò chuyện này");
  }

  const reactions = Array.isArray(msg.reactions)
    ? msg.reactions.map((r) => ({ userId: r.userId, icon: r.icon }))
    : [];
  const idx = reactions.findIndex((r) => r.userId === userId);
  let myIcon = icon;
  if (idx >= 0 && reactions[idx].icon === icon) {
    reactions.splice(idx, 1);
    myIcon = null;
  } else if (idx >= 0) {
    reactions[idx] = { userId, icon };
  } else {
    reactions.push({ userId, icon });
  }

  await col.updateOne({ id: messageId, conversationId }, { $set: { reactions } });
  return { message: { ...msg, reactions }, reactions, myIcon };
}
