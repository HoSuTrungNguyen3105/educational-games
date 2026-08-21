import { getCollection } from "../db.js";

const CONVERSATIONS = "conversations";
const MEMBERS = "conversationMembers";

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tạo hoặc lấy conversation trực tiếp (DM) giữa 2 user.
 */
export async function getOrCreateDM(userId1, userId2) {
  const sorted = [userId1, userId2].sort();
  const existing = await getCollection(CONVERSATIONS).findOne({
    type: "dm",
    memberIds: { $all: sorted, $size: 2 },
  });
  if (existing) return existing;

  const conv = {
    id: uid("conv"),
    type: "dm",
    memberIds: sorted,
    name: null,
    createdAt: new Date().toISOString(),
  };
  await getCollection(CONVERSATIONS).insertOne(conv);
  return conv;
}

/**
 * Tạo conversation cho game room.
 */
export async function createGameRoom(gameId, title) {
  const existing = await getCollection(CONVERSATIONS).findOne({ type: "game_room", gameId });
  if (existing) return existing;

  const conv = {
    id: uid("conv"),
    type: "game_room",
    gameId,
    memberIds: [],
    name: title || `Phòng ${gameId}`,
    createdAt: new Date().toISOString(),
  };
  await getCollection(CONVERSATIONS).insertOne(conv);
  return conv;
}

/**
 * Thêm member vào conversation.
 */
export async function addMember(conversationId, userId, displayName) {
  await getCollection(MEMBERS).updateOne(
    { conversationId, userId },
    { $set: { conversationId, userId, displayName, joinedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

/**
 * Lấy danh sách conversation mà user tham gia (bao gồm cả DM tìm từ messages).
 */
export async function listConversations(userId) {
  // 1) Tìm từ conversationMembers
  const memberDocs = await getCollection(MEMBERS)
    .find({ userId })
    .toArray();
  const memberConvIds = new Set(memberDocs.map((m) => m.conversationId));

  // 2) Tìm DM conversations từ messages collection (fallback cho tin nhắn cũ)
  const dmPattern = new RegExp(`^dm:.+:${userId}$|^dm:${userId}:.+$`);
  const dmMessages = await getCollection("messages")
    .find({ conversationId: dmPattern })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const msgConvIds = new Set(dmMessages.map((m) => m.conversationId));

  // Gộp tất cả conversationIds
  const allConvIds = new Set([...memberConvIds, ...msgConvIds]);
  if (allConvIds.size === 0) return [];

  const convs = await getCollection(CONVERSATIONS)
    .find({ id: { $in: [...allConvIds] } })
    .sort({ createdAt: -1 })
    .toArray();

  // 3) Nếu có conversationId từ messages nhưng chưa có trong conversations collection → tạo placeholder
  const existingIds = new Set(convs.map((c) => c.id));
  for (const convId of msgConvIds) {
    if (!existingIds.has(convId)) {
      const parts = convId.split(":");
      const memberIds = parts.length === 3 ? [parts[1], parts[2]].sort() : [];
      const placeholder = {
        id: convId,
        type: "dm",
        memberIds,
        name: null,
        createdAt: dmMessages.find((m) => m.conversationId === convId)?.createdAt || new Date().toISOString(),
      };
      await getCollection(CONVERSATIONS).updateOne(
        { id: convId },
        { $setOnInsert: placeholder },
        { upsert: true }
      );
      convs.push(placeholder);
    }
  }

  return convs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/**
 * Lấy danh sách members của conversation.
 */
export async function listMembers(conversationId) {
  return getCollection(MEMBERS)
    .find({ conversationId })
    .toArray();
}

/**
 * Lấy conversation theo id.
 */
export async function getById(id) {
  return getCollection(CONVERSATIONS).findOne({ id });
}

/**
 * Tìm DM conversation giữa 2 user hoặc tạo mới.
 */
export async function findDM(userId1, userId2) {
  return getOrCreateDM(userId1, userId2);
}
