import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as chatService from "../services/chatService.js";
import * as convService from "../services/conversationService.js";
import * as notificationService from "../services/notificationService.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";
import { getCollection } from "../db.js";

const router = Router();

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
    const { content, clientMessageId, type } = req.body;
    const currentUserId = req.user.sub;
    const userName = req.user.name || "Ẩn danh";
    const userUsername = req.user.username || "";
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    await ensureDmConversation(currentUserId, targetUserId);
    const msg = await chatService.sendMessage({
      conversationId: convId, senderId: currentUserId, playerName: userName, content, clientMessageId, type,
    });
    notificationService.createNotification({
      fromUserId: currentUserId,
      fromUsername: userUsername,
      fromName: userName,
      toUserId: targetUserId,
      type: "chat_message",
      title: `💬 ${userName}`,
      message: content?.substring(0, 100) || "",
      gameId: convId,
    }).catch(() => {});
    sendCreated(res, msg);
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
          }).catch(() => {});
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
