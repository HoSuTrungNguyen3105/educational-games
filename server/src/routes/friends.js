import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { getCollection } from "../db.js";
import * as friendService from "../services/friendService.js";
import * as blockService from "../services/blockService.js";
import * as notificationService from "../services/notificationService.js";
import * as parentService from "../services/parentService.js";

// ── Bạn bè: /api/friends ──────────────────────────────────────────────────
// Mọi thao tác đều lấy danh tính từ token (req.user.sub) — client không bao
// giờ tự khai "mình là ai". Thông báo kết bạn đi qua notificationService sẵn
// có, lỗi gửi thông báo không làm hỏng thao tác chính (giống routes/assignments).

const router = Router();
router.use(authenticate);

const FRIENDS_LINK = "educational-games/#/find-friends";
const PARENT_LINK = "educational-games/#/parent";

/**
 * Báo cho MỌI phụ huynh đã liên kết của `studentId` khi một lời mời kết bạn
 * của con bị giữ ở cổng duyệt (gate "sender": con gửi đi; gate "receiver":
 * gửi đến con). Học sinh phía bên kia KHÔNG nhận thông báo gì ở bước này.
 */
async function notifyParentsOfApproval(req, { studentId, otherUserId, direction }) {
  try {
    const [student, other, parents] = await Promise.all([
      getCollection("users").findOne({ id: studentId }),
      getCollection("users").findOne({ id: otherUserId }),
      parentService.listParentsOf(studentId),
    ]);
    const childName = student?.name || "Con bạn";
    const otherName = other?.name || "Một bạn học";
    const message = direction === "outgoing"
      ? `${childName} muốn kết bạn với ${otherName}. Lời mời đang chờ bạn duyệt.`
      : `${otherName} muốn kết bạn với ${childName}. Lời mời đang chờ bạn duyệt.`;
    for (const p of parents) {
      await notificationService.createNotification({
        toUserId: p.id,
        fromUserId: req.user.sub,
        fromUsername: req.user.username || "",
        fromName: req.user.name || "",
        type: "FRIEND_APPROVAL",
        title: "🛡️ Duyệt lời mời kết bạn",
        message,
        link: PARENT_LINK,
      });
    }
  } catch (e) {
    console.error("[friends] Thông báo phụ huynh thất bại:", e.message);
  }
}

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
    if (result.heldForParent) {
      // Lời mời bị giữ ở cổng phụ huynh → chỉ báo cho phụ huynh của phía bị
      // giữ; học sinh nhận chưa thấy gì. alreadyHeld = lời mời của phía kia
      // đã bị giữ từ trước (phụ huynh đã được báo ở lần gửi đầu) → không
      // báo lại, không gửi thông báo thường.
      if (!result.alreadyHeld) {
        const senderGate = result.gate === "sender";
        await notifyParentsOfApproval(req, {
          studentId: senderGate ? req.user.sub : String(userId),
          otherUserId: senderGate ? String(userId) : req.user.sub,
          direction: senderGate ? "outgoing" : "incoming",
        });
      }
    } else if (result.status === "PENDING") {
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

// ── Chặn người dùng (an toàn cho bé) ─────────────────────────────────────
// Chặn KHÔNG gửi thông báo cho người bị chặn (xem blockService). Sau khi
// chặn: hủy kết bạn hai phía, hai chiều đều không nhắn tin/kết bạn lại được.

// GET /api/friends/blocks — danh sách người MÌNH đã chặn.
router.get("/blocks", async (req, res, next) => {
  try {
    sendSuccess(res, await blockService.listBlocked(req.user.sub));
  } catch (e) {
    next(e);
  }
});

// POST /api/friends/blocks { userId } — chặn một người.
router.post("/blocks", async (req, res) => {
  try {
    const { userId } = req.body || {};
    sendSuccess(res, await blockService.blockUser(req.user.sub, userId ? String(userId) : ""));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// DELETE /api/friends/blocks/:userId — bỏ chặn (không khôi phục bạn bè cũ).
router.delete("/blocks/:userId", async (req, res) => {
  try {
    sendSuccess(res, await blockService.unblockUser(req.user.sub, req.params.userId));
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
