import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as chatService from "../services/chatService.js";
import * as reactionService from "../services/reactionService.js";
import * as convService from "../services/conversationService.js";
import * as notificationService from "../services/notificationService.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";
import { getCollection } from "../db.js";

const router = Router();

// Injected from server.js after initSocket — realtime emit for DM messages
let chatIO = null;
export function setChatIO(io) { chatIO = io; }

const CHAT_MESSAGE_EVENT = "chat:message";
const CHAT_REACTION_EVENT = "chat:reaction";

// Emit DM message to both participants' user rooms (realtime)
function emitDmMessage(conversationId, msg) {
  if (!chatIO || !conversationId?.startsWith("dm:")) return;
  const parts = conversationId.split(":");
  if (parts.length !== 3) return;
  const [, userA, userB] = parts;
  try {
    chatIO.to(`user:${userA}`).to(`user:${userB}`).emit(CHAT_MESSAGE_EVENT, msg);
  } catch (e) {
    console.error("[chat] emitDmMessage failed:", e.message);
  }
}

// Emit reaction update to both participants' user rooms (realtime) —
// payload nhẹ { conversationId, messageId, reactions, userId, icon } để
// phía còn lại cập nhật chip cảm xúc ngay, không cần tải lại tin nhắn.
function emitDmReaction(conversationId, payload) {
  if (!chatIO || !conversationId?.startsWith("dm:")) return;
  const parts = conversationId.split(":");
  if (parts.length !== 3) return;
  const [, userA, userB] = parts;
  try {
    chatIO.to(`user:${userA}`).to(`user:${userB}`).emit(CHAT_REACTION_EVENT, payload);
  } catch (e) {
    console.error("[chat] emitDmReaction failed:", e.message);
  }
}

async function ensureDmConversation(userId1, userId2) {
  const conv = await convService.getOrCreateDM(userId1, userId2);
  await convService.addMember(conv.id, userId1);
  await convService.addMember(conv.id, userId2);
  return conv;
}

router.get("/dm/:targetUserId/messages", authenticate, async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const { limit, before } = req.query;
    const currentUserId = req.user.sub;
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    const result = await chatService.listMessages(convId, { before, limit: Number(limit) });
    sendSuccess(res, result.items || [], "success", buildPagination({ total: result.total || 0 }));
  } catch (e) {
    next(e);
  }
});

router.post("/dm/:targetUserId/messages", authenticate, async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const { content, clientMessageId, type, kind, sticker } = req.body;
    const currentUserId = req.user.sub;
    const userName = req.user.name || "Ẩn danh";
    const userUsername = req.user.username || "";
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    await ensureDmConversation(currentUserId, targetUserId);
    const msg = await chatService.sendMessage({
      conversationId: convId, senderId: currentUserId, playerName: userName, content, clientMessageId, type, kind, sticker,
    });
    // Realtime: push message to both participants (admin/student chat pages)
    emitDmMessage(convId, msg);
    notificationService.createNotification({
      fromUserId: currentUserId,
      fromUsername: userUsername,
      fromName: userName,
      toUserId: targetUserId,
      type: "chat_message",
      title: `💬 ${userName}`,
      // msg.content đã là nhãn mô tả khi gửi sticker (xem chatService).
      message: (msg.content || "").substring(0, 100),
      gameId: convId,
      data: { conversationId: convId },
    }).catch((e) => console.error("[chat] createNotification failed:", e));
    sendCreated(res, msg);
  } catch (e) {
    next(e);
  }
});

// Thả / gỡ / đổi cảm xúc cho một tin nhắn DM (toggle — xem reactionService).
// Trả về tin nhắn đã cập nhật; đồng thời bắn "chat:reaction" tới cả hai phía.
router.post("/dm/:targetUserId/messages/:messageId/reaction", authenticate, async (req, res, next) => {
  try {
    const { targetUserId, messageId } = req.params;
    const { icon } = req.body || {};
    const currentUserId = req.user.sub;
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    const result = await reactionService.toggleReaction({
      conversationId: convId, messageId, userId: currentUserId, icon,
    });
    emitDmReaction(convId, {
      conversationId: convId,
      messageId,
      reactions: result.reactions,
      userId: currentUserId,
      icon: result.myIcon,
    });
    sendSuccess(res, result.message);
  } catch (e) {
    next(e);
  }
});

router.get("/:conversationId/messages", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit, before } = req.query;
    const result = await chatService.listMessages(conversationId, { before, limit: Number(limit) });
    sendSuccess(res, result.items || [], "success", buildPagination({ total: result.total || 0 }));
  } catch (e) {
    next(e);
  }
});

router.post("/:conversationId/messages", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content, clientMessageId, playerName, senderId, type } = req.body;
    if (!senderId) return sendError(res, "Thiếu senderId", 400);
    const msg = await chatService.sendMessage({ conversationId, senderId, playerName, content, clientMessageId, type });
    emitDmMessage(conversationId, msg);

    // Create notification for DM conversations
    if (conversationId.startsWith("dm:")) {
      const parts = conversationId.split(":");
      if (parts.length === 3) {
        const recipientId = parts[1] === senderId ? parts[2] : parts[1];
        if (recipientId !== senderId) {
          const senderDoc = await getCollection("users").findOne({ id: senderId }).catch(() => null);
          const senderName = senderDoc?.name || playerName || "Ẩn danh";
          notificationService.createNotification({
            fromUserId: senderId,
            fromUsername: senderDoc?.username || "",
            fromName: senderName,
            toUserId: recipientId,
            type: "chat_message",
            title: `💬 ${senderName}`,
            message: content?.substring(0, 100) || "",
            gameId: conversationId,
            data: { conversationId },
          }).catch((e) => console.error("[chat] createNotification failed:", e));
        }
      }
    }

    sendCreated(res, msg);
  } catch (e) {
    next(e);
  }
});

router.post("/:conversationId/read", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { playerId, messageId } = req.body;
    if (!playerId || !messageId) return sendError(res, "Thiếu playerId hoặc messageId", 400);
    await chatService.markRead(conversationId, playerId, messageId);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});

router.get("/:conversationId/unread", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { playerId } = req.query;
    if (!playerId) return sendSuccess(res, { unread: 0 });
    const unread = await chatService.getUnreadCount(conversationId, playerId);
    sendSuccess(res, { unread });
  } catch (e) {
    next(e);
  }
});

export default router;
