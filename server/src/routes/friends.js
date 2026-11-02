import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { getCollection } from "../db.js";
import * as friendService from "../services/friendService.js";
import * as notificationService from "../services/notificationService.js";

// ── Bạn bè: /api/friends ──────────────────────────────────────────────────
// Mọi thao tác đều lấy danh tính từ token (req.user.sub) — client không bao
// giờ tự khai "mình là ai". Thông báo kết bạn đi qua notificationService sẵn
// có, lỗi gửi thông báo không làm hỏng thao tác chính (giống routes/assignments).

const router = Router();
router.use(authenticate);

const FRIENDS_LINK = "educational-games/#/find-friends";

async function notifyFriendEvent(req, { toUserId, type, title, message }) {
  try {
    const me = await getCollection("users").findOne({ id: req.user.sub });
    await notificationService.createNotification({
      toUserId,
      fromUserId: req.user.sub,
      fromUsername: me?.username || "",
      fromName: me?.name || "",
      type,
      title,
      message,
      link: FRIENDS_LINK,
    });
  } catch (e) {
    console.error("[friends] Gửi thông báo thất bại:", e.message);
  }
}

// GET /api/friends — tổng quan: bạn bè + lời mời đến + lời mời đi.
router.get("/", async (req, res, next) => {
  try {
    sendSuccess(res, await friendService.getOverview(req.user.sub));
  } catch (e) {
    next(e);
  }
});

// GET /api/friends/relation/:userId — trạng thái quan hệ với một người.
router.get("/relation/:userId", async (req, res, next) => {
  try {
    sendSuccess(res, await friendService.getRelation(req.user.sub, req.params.userId));
  } catch (e) {
    next(e);
  }
});

// POST /api/friends/requests { userId } — gửi lời mời (hoặc đồng ý ngược lại
// nếu phía kia đã mời mình trước → auto-accept, xem friendService.sendRequest).
router.post("/requests", async (req, res) => {
  try {
    const { userId } = req.body || {};
    const result = await friendService.sendRequest(req.user.sub, userId ? String(userId) : "");
    if (result.status === "PENDING") {
      await notifyFriendEvent(req, {
        toUserId: String(userId),
        type: "FRIEND_REQUEST",
        title: "👋 Lời mời kết bạn",
        message: `${req.user.name || "Một người bạn"} đã gửi lời mời kết bạn cho bạn`,
      });
    } else if (result.autoAccepted) {
      await notifyFriendEvent(req, {
        toUserId: String(userId),
        type: "FRIEND_ACCEPT",
        title: "🎉 Có bạn mới",
        message: `${req.user.name || "Một người bạn"} đã chấp nhận lời mời kết bạn của bạn`,
      });
    }
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// POST /api/friends/requests/:userId/accept — chấp nhận lời mời TỪ userId.
router.post("/requests/:userId/accept", async (req, res) => {
  try {
    const result = await friendService.acceptRequest(req.user.sub, req.params.userId);
    await notifyFriendEvent(req, {
      toUserId: req.params.userId,
      type: "FRIEND_ACCEPT",
      title: "🎉 Có bạn mới",
      message: `${req.user.name || "Một người bạn"} đã chấp nhận lời mời kết bạn của bạn`,
    });
    sendSuccess(res, result);
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// POST /api/friends/requests/:userId/decline — từ chối lời mời TỪ userId.
router.post("/requests/:userId/decline", async (req, res) => {
  try {
    sendSuccess(res, await friendService.declineRequest(req.user.sub, req.params.userId));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// DELETE /api/friends/requests/:userId — thu hồi lời mời MÌNH đã gửi cho userId.
router.delete("/requests/:userId", async (req, res) => {
  try {
    sendSuccess(res, await friendService.cancelRequest(req.user.sub, req.params.userId));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// DELETE /api/friends/:userId — hủy kết bạn với userId.
router.delete("/:userId", async (req, res) => {
  try {
    sendSuccess(res, await friendService.unfriend(req.user.sub, req.params.userId));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

export default router;
