import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as convService from "../services/conversationService.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";
import { getCollection } from "../db.js";

const router = Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const conversations = await convService.listConversationsEnriched(userId);
    const pagination = buildPagination({ total: conversations.length });
    sendSuccess(res, conversations, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/dm", authenticate, async (req, res, next) => {
  try {
    const { targetUserId } = req.body || {};
    if (!targetUserId) return sendError(res, "Thiếu targetUserId", 400);
    const conv = await convService.getOrCreateDM(req.user.sub, targetUserId);
    sendSuccess(res, conv);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const conv = await convService.getById(req.params.id);
    if (!conv) return sendError(res, "Không tìm thấy conversation", 404);
    sendSuccess(res, conv);
  } catch (e) {
    next(e);
  }
});

router.get("/:id/members", authenticate, async (req, res, next) => {
  try {
    const members = await convService.listMembers(req.params.id);
    sendSuccess(res, members);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/members", authenticate, async (req, res, next) => {
  try {
    const { userId, displayName } = req.body || {};
    if (!userId) return sendError(res, "Thiếu userId", 400);
    await convService.addMember(req.params.id, userId, displayName || req.user.name);
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});

// Mark conversation as read (update lastReadMessageId to latest message)
router.post("/:id/read", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.sub;
    const convId = req.params.id;
    const lastMsg = await getCollection("messages")
      .find({ conversationId: convId })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    if (lastMsg.length > 0) {
      await getCollection("chatReadStates").updateOne(
        { conversationId: convId, playerId: userId },
        { $set: { lastReadMessageId: lastMsg[0].id, updatedAt: new Date().toISOString() } },
        { upsert: true },
      );
    }
    sendSuccess(res, { ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
