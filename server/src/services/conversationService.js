import { getCollection } from "../db.js";

const CONVERSATIONS = "conversations";
const MEMBERS = "conversationMembers";
const MESSAGES = "messages";
const READ_STATES = "chatReadStates";

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Tạo hoặc lấy conversation DM giữa 2 user.
 * Dùng chung format "dm:userA:userB" với chatService.
 */
export async function getOrCreateDM(userId1, userId2) {
  const sorted = [userId1, userId2].sort();
  const convId = `dm:${sorted[0]}:${sorted[1]}`;

  const existing = await getCollection(CONVERSATIONS).findOne({ id: convId });
  if (existing) return existing;

  const conv = {
    id: convId,
    type: "dm",
    memberIds: sorted,
    name: null,
    createdAt: new Date().toISOString(),
  };
  await getCollection(CONVERSATIONS).updateOne(
    { id: convId },
    { $setOnInsert: conv },
    { upsert: true }
  );
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
    { $set: { conversationId, userId, displayName: displayName || null, joinedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

/**
 * Lấy danh sách conversation mà user tham gia.
 */
export async function listConversations(userId) {
  // 1) Tìm từ conversationMembers
  const memberDocs = await getCollection(MEMBERS)
    .find({ userId })
    .toArray();

  const memberConvIds = memberDocs.map((m) => m.conversationId);

  // 2) Nếu có memberConvIds → lấy conversations
  if (memberConvIds.length > 0) {
    const convs = await getCollection(CONVERSATIONS)
      .find({ id: { $in: memberConvIds } })
      .sort({ createdAt: -1 })
      .toArray();
    return convs;
  }

  // 3) Fallback: tìm từ messages collection (DM format)
  const regexA = new RegExp(`^dm:${escapeRegex(userId)}:[^:]+$`);
  const regexB = new RegExp(`^dm:[^:]+:${escapeRegex(userId)}$`);

  const dmMessages = await getCollection("messages")
    .find({
      $or: [
        { conversationId: { $regex: regexA } },
        { conversationId: { $regex: regexB } },
      ],
    })
    .project({ conversationId: 1, createdAt: 1 })
    .toArray();

  if (dmMessages.length === 0) return [];

  // Lấy unique conversationIds
  const convIdSet = new Set(dmMessages.map((m) => m.conversationId));
  const convIds = [...convIdSet];

  // Tìm conversations đã tồn tại
  const existingConvs = await getCollection(CONVERSATIONS)
    .find({ id: { $in: convIds } })
    .toArray();
  const existingMap = new Map(existingConvs.map((c) => [c.id, c]));

  const result = [];
  for (const convId of convIds) {
    const existing = existingMap.get(convId);
    if (existing) {
      result.push(existing);
    } else {
      // Tạo placeholder conversation
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
      result.push(placeholder);
    }
  }

  return result.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/**
 * Lấy danh sách conversation với last message + unread count.
 */
export async function listConversationsEnriched(userId) {
  const convs = await listConversations(userId);
  if (convs.length === 0) return [];

  const convIds = convs.map(c => c.id);

  // Get last message for each conversation
  const lastMessages = await getCollection(MESSAGES)
    .find({ conversationId: { $in: convIds } })
    .sort({ createdAt: -1 })
    .toArray();

  // Group by conversationId, keep only the latest
  const lastMsgMap = {};
  for (const msg of lastMessages) {
    if (!lastMsgMap[msg.conversationId]) {
      lastMsgMap[msg.conversationId] = msg;
    }
  }

  // Get unread counts
  const readStates = await getCollection(READ_STATES)
    .find({ conversationId: { $in: convIds }, playerId: userId })
    .toArray();
  const readStateMap = {};
  for (const rs of readStates) readStateMap[rs.conversationId] = rs;

  const enriched = [];
  for (const conv of convs) {
    const lastMsg = lastMsgMap[conv.id];
    const readState = readStateMap[conv.id];
    let unread = 0;

    if (lastMsg) {
      if (!readState?.lastReadMessageId) {
        // Chưa đọc gì → đếm tất cả message trong conv
        unread = await getCollection(MESSAGES).countDocuments({ conversationId: conv.id });
      } else {
        const readMsg = await getCollection(MESSAGES).findOne({ id: readState.lastReadMessageId });
        if (readMsg) {
          unread = await getCollection(MESSAGES).countDocuments({
            conversationId: conv.id,
            $or: [
              { createdAt: { $gt: readMsg.createdAt } },
              { createdAt: readMsg.createdAt, id: { $gt: readMsg.id } },
            ],
          });
        }
      }
    }

    enriched.push({
      ...conv,
      lastMessage: lastMsg ? {
        content: lastMsg.content,
        senderId: lastMsg.senderId,
        playerName: lastMsg.playerName,
        createdAt: lastMsg.createdAt,
      } : null,
      unread,
    });
  }

  // Sort by last message time (newest first), then by createdAt
  enriched.sort((a, b) => {
    const tA = a.lastMessage?.createdAt || a.createdAt || "";
    const tB = b.lastMessage?.createdAt || b.createdAt || "";
    return tB.localeCompare(tA);
  });

  return enriched;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
