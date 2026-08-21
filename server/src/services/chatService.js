import { getCollection } from "../db.js";

const MESSAGES = "messages";
const MAX_MESSAGE_LENGTH = 500;
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tạo conversationId cho DM giữa 2 user (deterministic).
 */
export function getDmConversationId(userId1, userId2) {
  const sorted = [userId1, userId2].sort();
  return `dm:${sorted[0]}:${sorted[1]}`;
}

/**
 * Lấy tin nhắn theo conversation (gameId), cursor-based pagination.
 * @param {string} gameId
 * @param {{ before?: string, limit?: number }} opts
 */
export async function listMessages(gameId, { before, limit } = {}) {
  const n = Math.min(Math.max(1, Number(limit) || DEFAULT_LIMIT), MAX_LIMIT);
  const query = { conversationId: gameId };
  if (before) {
    // Cursor = message id → tìm createdAt của nó rồi query older
    const cursor = await getCollection(MESSAGES).findOne({ id: before });
    if (cursor) {
      query.$or = [
        { createdAt: { $lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, id: { $lt: cursor.id } },
      ];
    }
  }
  const items = await getCollection(MESSAGES)
    .find(query)
    .sort({ createdAt: -1, id: -1 })
    .limit(n + 1)
    .toArray();

  const hasMore = items.length > n;
  const sliced = hasMore ? items.slice(0, n) : items;
  const nextCursor = hasMore && sliced.length > 0 ? sliced[sliced.length - 1].id : null;

  return { items: sliced.reverse(), nextCursor, hasMore };
}

/**
 * Gửi tin nhắn mới. Hỗ trợ idempotency qua clientMessageId.
 */
export async function sendMessage({ conversationId, senderId, playerName, content, clientMessageId, type = "text" }) {
  // Validate
  const text = String(content || "").trim();
  if (!text) throw new Error("Nội dung tin nhắn không được để trống");
  if (text.length > MAX_MESSAGE_LENGTH) throw new Error(`Tin nhắn tối đa ${MAX_MESSAGE_LENGTH} ký tự`);
  if (!conversationId) throw new Error("Thiếu conversationId");
  if (!senderId) throw new Error("Thiếu senderId");

  // Idempotency: nếu clientMessageId đã tồn tại → trả về message cũ
  if (clientMessageId) {
    const existing = await getCollection(MESSAGES).findOne({ clientMessageId });
    if (existing) return existing;
  }

  const msg = {
    id: uid("msg"),
    conversationId,
    senderId,
    playerName: String(playerName || "Ẩn danh").slice(0, 24),
    clientMessageId: clientMessageId || null,
    type,
    content: text,
    createdAt: new Date().toISOString(),
  };

  await getCollection(MESSAGES).insertOne({ ...msg });
  return msg;
}

/**
 * Đánh dấu đã đọc: lưu lastReadMessageId cho player trong conversation.
 */
export async function markRead(gameId, playerId, messageId) {
  if (!gameId || !playerId || !messageId) return;
  const col = getCollection(MESSAGES);
  // Lưu vào collection readStates (nhẹ, riêng biệt)
  const readCol = getCollection("chatReadStates");
  await readCol.updateOne(
    { conversationId: gameId, playerId },
    { $set: { lastReadMessageId: messageId, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

/**
 * Lấy unread count cho một player trong conversation.
 * Đếm số message mới hơn lastReadMessageId.
 */
export async function getUnreadCount(gameId, playerId) {
  if (!gameId || !playerId) return 0;
  const readCol = getCollection("chatReadStates");
  const state = await readCol.findOne({ conversationId: gameId, playerId });
  if (!state?.lastReadMessageId) {
    // Chưa đọc gì → đếm tất cả
    return getCollection(MESSAGES).countDocuments({ conversationId: gameId });
  }
  const cursor = await getCollection(MESSAGES).findOne({ id: state.lastReadMessageId });
  if (!cursor) return 0;
  return getCollection(MESSAGES).countDocuments({
    conversationId: gameId,
    $or: [
      { createdAt: { $gt: cursor.createdAt } },
      { createdAt: cursor.createdAt, id: { $gt: cursor.id } },
    ],
  });
}
