import { Router } from "express";
import * as chatService from "../services/chatService.js";

const router = Router();

// GET /api/chat/:gameId/messages?limit=30&before=<cursor>
router.get("/:gameId/messages", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { limit, before } = req.query;
    const result = await chatService.listMessages(gameId, { before, limit: Number(limit) });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// POST /api/chat/:gameId/messages
router.post("/:gameId/messages", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { content, clientMessageId, playerName, senderId, type } = req.body;
    if (!senderId) return res.status(400).json({ message: "Thiếu senderId" });
    const msg = await chatService.sendMessage({
      conversationId: gameId,
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

// POST /api/chat/:gameId/read
router.post("/:gameId/read", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { playerId, messageId } = req.body;
    if (!playerId || !messageId) return res.status(400).json({ message: "Thiếu playerId hoặc messageId" });
    await chatService.markRead(gameId, playerId, messageId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/chat/:gameId/unread?playerId=xxx
router.get("/:gameId/unread", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const { playerId } = req.query;
    if (!playerId) return res.json({ unread: 0 });
    const unread = await chatService.getUnreadCount(gameId, playerId);
    res.json({ unread });
  } catch (e) {
    next(e);
  }
});

export default router;