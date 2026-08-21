import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as convService from "../services/conversationService.js";

const router = Router();

// GET /api/conversations — danh sách conversation của user
router.get("/", authenticate, async (req, res, next) => {
  try {
    const conversations = await convService.listConversations(req.user.sub);
    res.json(conversations);
  } catch (e) {
    next(e);
  }
});

// POST /api/conversations/dm — tạo hoặc lấy DM với user khác
router.post("/dm", authenticate, async (req, res, next) => {
  try {
    const { targetUserId } = req.body || {};
    if (!targetUserId) return res.status(400).json({ message: "Thiếu targetUserId" });
    const conv = await convService.getOrCreateDM(req.user.sub, targetUserId);
    res.json(conv);
  } catch (e) {
    next(e);
  }
});

// GET /api/conversations/:id — lấy chi tiết conversation
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const conv = await convService.getById(req.params.id);
    if (!conv) return res.status(404).json({ message: "Không tìm thấy conversation" });
    res.json(conv);
  } catch (e) {
    next(e);
  }
});

// GET /api/conversations/:id/members — lấy danh sách members
router.get("/:id/members", authenticate, async (req, res, next) => {
  try {
    const members = await convService.listMembers(req.params.id);
    res.json(members);
  } catch (e) {
    next(e);
  }
});

// POST /api/conversations/:id/members — thêm member
router.post("/:id/members", authenticate, async (req, res, next) => {
  try {
    const { userId, displayName } = req.body || {};
    if (!userId) return res.status(400).json({ message: "Thiếu userId" });
    await convService.addMember(req.params.id, userId, displayName || req.user.name);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
