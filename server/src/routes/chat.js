import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as chatService from "../services/chatService.js";

const router = Router();

// GET /api/chat/:conversationId/messages?limit=30&before=<cursor>
router.get("/:conversationId/messages", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { limit, before } = req.query;
    const result = await chatService.listMessages(conversationId, { before, limit: Number(limit) });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// POST /api/chat/:conversationId/messages
router.post("/:conversationId/messages", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content, clientMessageId, playerName, senderId, type } = req.body;
    if (!senderId) return res.status(400).json({ message: "Thiếu senderId" });
    const msg = await chatService.sendMessage({
      conversationId,
      senderId,
      playerName,
      content,
      clientMessageId,
      type,
    });
    res.status(201).json(msg);
  } catch (e) {
    next(e);
  }
});

// POST /api/chat/:conversationId/read
router.post("/:conversationId/read", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { playerId, messageId } = req.body;
    if (!playerId || !messageId) return res.status(400).json({ message: "Thiếu playerId hoặc messageId" });
    await chatService.markRead(conversationId, playerId, messageId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/chat/:conversationId/unread?playerId=xxx
router.get("/:conversationId/unread", async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { playerId } = req.query;
    if (!playerId) return res.json({ unread: 0 });
    const unread = await chatService.getUnreadCount(conversationId, playerId);
    res.json({ unread });
  } catch (e) {
    next(e);
  }
});

// GET /api/chat/dm/:targetUserId/messages — DM chat với user khác (cần đăng nhập)
router.get("/dm/:targetUserId/messages", authenticate, async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const { limit, before } = req.query;
    const currentUserId = req.user.sub;
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    const result = await chatService.listMessages(convId, { before, limit: Number(limit) });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// POST /api/chat/dm/:targetUserId/messages — gửi tin nhắn DM (cần đăng nhập)
router.post("/dm/:targetUserId/messages", authenticate, async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const { content, clientMessageId, type } = req.body;
    const currentUserId = req.user.sub;
    const userName = req.user.name || "Ẩn danh";
    const convId = chatService.getDmConversationId(currentUserId, targetUserId);
    const msg = await chatService.sendMessage({
      conversationId: convId,
      senderId: currentUserId,
      playerName: userName,
      content,
      clientMessageId,
      type,
    });
    res.status(201).json(msg);
  } catch (e) {
    next(e);
  }
});

export default router;