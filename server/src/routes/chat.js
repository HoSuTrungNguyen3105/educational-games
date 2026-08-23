import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as chatService from "../services/chatService.js";
import * as convService from "../services/conversationService.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";

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
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    await ensureDmConversation(currentUserId, targetUserId);
    const msg = await chatService.sendMessage({
      conversationId: convId, senderId: currentUserId, playerName: userName, content, clientMessageId, type,
    });
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
