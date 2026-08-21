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
 * Lấy danh sách conversation mà user tham gia.
 */
export async function listConversations(userId) {
  const memberDocs = await getCollection(MEMBERS)
    .find({ userId })
    .toArray();
  if (memberDocs.length === 0) return [];

  const convIds = memberDocs.map((m) => m.conversationId);
  const convs = await getCollection(CONVERSATIONS)
    .find({ id: { $in: convIds } })
    .sort({ createdAt: -1 })
    .toArray();

  return convs;
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
