import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import { getCollection } from "../db.js";
import * as parentService from "../services/parentService.js";
import * as notificationService from "../services/notificationService.js";
import {
  issueRefreshToken, setRefreshCookie,
} from "../services/refreshTokenService.js";

// ── Phụ huynh: /api/parents ───────────────────────────────────────────────
// Liên kết bằng mã 6 số của học sinh (xem parentService). Mọi endpoint báo
// cáo đều kiểm tra bản ghi liên kết Ở BACKEND theo từng request.

const router = Router();

function fail(res, e) {
  return sendError(res, e.message || "Thao tác thất bại", e.status || 400);
}

// ── Thông báo cho luồng duyệt kết bạn ────────────────────────────────────
// Lỗi gửi thông báo không làm hỏng thao tác chính (giống routes/friends).
const FRIENDS_LINK = "educational-games/#/find-friends";
const PARENT_LINK = "educational-games/#/parent";

async function userById(id) {
  return getCollection("users").findOne({ id });
}

async function safeNotify({ toUserId, fromUser, type, title, message, link }) {
  try {
    await notificationService.createNotification({
      toUserId,
      fromUserId: fromUser?.id || fromUser?.sub || "",
      fromUsername: fromUser?.username || "",
      fromName: fromUser?.name || "",
      type,
      title,
      message,
      link,
    });
  } catch (e) {
    console.error("[parents] Gửi thông báo thất bại:", e.message);
  }
}

/** Báo cho MỌI phụ huynh đã liên kết của học sinh là có lời mời chờ duyệt. */
async function notifyApprovalNeeded({ studentId, otherUserId, direction, actor }) {
  try {
    const [student, other, parents] = await Promise.all([
      userById(studentId),
      userById(otherUserId),
      parentService.listParentsOf(studentId),
    ]);
    const childName = student?.name || "Con bạn";
    const otherName = other?.name || "Một bạn học";
    const message = direction === "outgoing"
      ? `${childName} muốn kết bạn với ${otherName}. Lời mời đang chờ bạn duyệt.`
      : `${otherName} muốn kết bạn với ${childName}. Lời mời đang chờ bạn duyệt.`;
    for (const p of parents) {
      await safeNotify({
        toUserId: p.id,
        fromUser: actor,
        type: "FRIEND_APPROVAL",
        title: "🛡️ Duyệt lời mời kết bạn",
        message,
        link: PARENT_LINK,
      });
    }
  } catch (e) {
    console.error("[parents] Thông báo phụ huynh thất bại:", e.message);
  }
}

/**
 * Xử lý thông báo cho các lời mời vừa được THẢ/DUYỆT qua cổng
 * (friendService trả về [{ stage, request }]):
 * - stage "visible"  → lời mời đến hiện ra với học sinh nhận → báo học sinh.
 * - stage "receiver" → lời mời chuyển sang chờ phụ huynh PHÍA NHẬN duyệt.
 */
async function notifyReleased(actor, released) {
  for (const item of released || []) {
    const doc = item.request;
    if (!doc) continue;
    if (item.stage === "visible") {
      const requester = await userById(doc.requesterId);
      await safeNotify({
        toUserId: doc.addresseeId,
        fromUser: requester,
        type: "FRIEND_REQUEST",
        title: "👋 Lời mời kết bạn",
        message: `${requester?.name || "Một người bạn"} đã gửi lời mời kết bạn cho bạn`,
        link: FRIENDS_LINK,
      });
    } else if (item.stage === "receiver") {
      await notifyApprovalNeeded({
        studentId: doc.addresseeId,
        otherUserId: doc.requesterId,
        direction: "incoming",
        actor,
      });
    }
  }
}

// POST /api/parents/register — đăng ký tài khoản phụ huynh (công khai).
// Body: { username, email?, password, name, linkCode? } — có linkCode thì
// liên kết với con ngay khi tạo tài khoản. Refresh token qua cookie HttpOnly
// giống hệt luồng đăng ký thường.
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name, linkCode } = req.body || {};
    if (!username || !password || !name) {
      return sendError(res, "Vui lòng nhập đầy đủ thông tin", 400);
    }
    if (String(password).length < 6) {
      return sendError(res, "Mật khẩu phải có ít nhất 6 ký tự", 400);
    }
    const result = await parentService.registerParent({ username, email, password, name, linkCode });
    setRefreshCookie(res, await issueRefreshToken(result.user, {
      meta: { ua: req.headers["user-agent"] || "", ip: req.ip || "" },
    }));
    sendCreated(res, result);
  } catch (e) {
    if ((e.message || "").includes("tồn tại") || (e.message || "").includes("được sử dụng")) {
      return sendError(res, e.message, 409);
    }
    return fail(res, e);
  }
});

// ── Mã liên kết (phía học sinh / giáo viên) ──

// GET /api/parents/link-code — học sinh xem mã hiện tại của mình.
router.get("/link-code", authenticate, requireRoles("student"), async (req, res) => {
  try {
    sendSuccess(res, { code: await parentService.getLinkCode(req.user.sub) });
  } catch (e) {
    return fail(res, e);
  }
});

// POST /api/parents/link-code { studentId? } — tạo mã MỚI (mã cũ hết hiệu lực).
// Học sinh tự tạo cho mình; giáo viên/admin truyền studentId để tạo hộ học
// sinh trong lớp mình dạy (admin: bất kỳ học sinh nào).
router.post("/link-code", authenticate, requireRoles("student", "teacher", "admin"), async (req, res) => {
  try {
    const { studentId } = req.body || {};
    const targetId = studentId ? String(studentId) : req.user.sub;
    if (targetId !== req.user.sub) {
      const ok = await parentService.teacherCanManageStudent(req.user, targetId);
      if (!ok) return sendError(res, "Bạn không phụ trách học sinh này", 403);
    }
    sendSuccess(res, { code: await parentService.generateLinkCode(targetId), studentId: targetId });
  } catch (e) {
    return fail(res, e);
  }
});

// ── Phía học sinh: xem / gỡ phụ huynh đã liên kết ──

router.get("/my-parents", authenticate, requireRoles("student"), async (req, res, next) => {
  try {
    sendSuccess(res, await parentService.listParentsOf(req.user.sub));
  } catch (e) {
    next(e);
  }
});

router.delete("/my-parents/:parentId", authenticate, requireRoles("student"), async (req, res) => {
  try {
    // unlinkAndCleanup: con không còn phụ huynh nào → tự tắt cờ duyệt kết
    // bạn + thả lời mời đang giữ (tránh khoá vĩnh viễn không ai duyệt).
    const result = await parentService.unlinkAndCleanup(req.params.parentId, req.user.sub);
    await notifyReleased(req.user, result.released);
    sendSuccess(res, { ok: true });
  } catch (e) {
    return fail(res, e);
  }
});

// ── Phía phụ huynh ──

// POST /api/parents/link { code } — gắn thêm con bằng mã.
router.post("/link", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    const { code } = req.body || {};
    if (!code) return sendError(res, "code là bắt buộc", 400);
    sendSuccess(res, await parentService.linkByCode(req.user.sub, code));
  } catch (e) {
    return fail(res, e);
  }
});

// GET /api/parents/children — danh sách con đã liên kết.
router.get("/children", authenticate, requireRoles("parent"), async (req, res, next) => {
  try {
    sendSuccess(res, await parentService.listChildren(req.user.sub));
  } catch (e) {
    next(e);
  }
});

// DELETE /api/parents/children/:studentId — phụ huynh gỡ liên kết với một con.
router.delete("/children/:studentId", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    const result = await parentService.unlinkAndCleanup(req.user.sub, req.params.studentId);
    await notifyReleased(req.user, result.released);
    sendSuccess(res, { ok: true });
  } catch (e) {
    return fail(res, e);
  }
});

// POST /api/parents/children/:studentId/reset-password { password } —
// phụ huynh đặt lại mật khẩu cho con ĐÃ LIÊN KẾT (service kiểm tra liên
// kết → 403 nếu chưa liên kết; mật khẩu mới tối thiểu 6 ký tự như đăng ký).
router.post("/children/:studentId/reset-password", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) return sendError(res, "Mật khẩu mới là bắt buộc", 400);
    sendSuccess(res, await parentService.resetChildPassword(req.user.sub, req.params.studentId, password), "Đã đặt lại mật khẩu cho con");
  } catch (e) {
    return fail(res, e);
  }
});

// GET /api/parents/children/:studentId/report — báo cáo học tập của con.
// Service kiểm tra liên kết trước khi gom dữ liệu (403 nếu chưa liên kết).
router.get("/children/:studentId/report", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    sendSuccess(res, await parentService.getChildReport(req.user.sub, req.params.studentId));
  } catch (e) {
    return fail(res, e);
  }
});

// GET /api/parents/children/:studentId/blocked-users — danh sách người
// CON ĐÃ LIÊN KẾT đã chặn (chỉ đọc; service kiểm tra liên kết → 403 nếu
// chưa liên kết). Phụ huynh chỉ xem, không bỏ chặn hộ.
router.get("/children/:studentId/blocked-users", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    sendSuccess(res, await parentService.listChildBlockedUsers(req.user.sub, req.params.studentId));
  } catch (e) {
    return fail(res, e);
  }
});

// ── Duyệt kết bạn (đợt An toàn cho bé 2) ─────────────────────────────────
// Công tắc theo TỪNG CON, phụ huynh tự bật/tắt, mặc định TẮT. Mọi endpoint
// đều qua parentService.requireLinkedStudent (chưa liên kết → 403).

// PUT /api/parents/children/:studentId/friend-approval { enabled }
// Bật/tắt công tắc duyệt kết bạn cho con. TẮT → thả mọi lời mời đang giữ.
router.put("/children/:studentId/friend-approval", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    const { enabled } = req.body || {};
    const result = await parentService.setFriendApproval(
      req.user.sub, req.params.studentId, !!enabled
    );
    await notifyReleased(req.user, result.released);
    sendSuccess(res, { friendApprovalRequired: result.friendApprovalRequired });
  } catch (e) {
    return fail(res, e);
  }
});

// GET /api/parents/children/:studentId/friend-requests — lời mời đang chờ
// phụ huynh này duyệt cho con (cả con gửi đi lẫn gửi đến con).
router.get("/children/:studentId/friend-requests", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    sendSuccess(res, await parentService.listChildFriendRequests(req.user.sub, req.params.studentId));
  } catch (e) {
    return fail(res, e);
  }
});

// POST /api/parents/children/:studentId/friend-requests/:requestId/approve
// Duyệt → lời mời qua cổng hiện tại (có thể sang cổng phía bên kia nếu phía
// đó cũng bật cờ — service trả stage để route gửi đúng thông báo).
router.post("/children/:studentId/friend-requests/:requestId/approve", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    const result = await parentService.approveChildFriendRequest(
      req.user.sub, req.params.studentId, req.params.requestId
    );
    await notifyReleased(req.user, [result]);
    sendSuccess(res, { stage: result.stage });
  } catch (e) {
    return fail(res, e);
  }
});

// POST /api/parents/children/:studentId/friend-requests/:requestId/reject
// Từ chối → lời mời bị xoá lặng lẽ, không thông báo cho người gửi.
router.post("/children/:studentId/friend-requests/:requestId/reject", authenticate, requireRoles("parent"), async (req, res) => {
  try {
    sendSuccess(res, await parentService.rejectChildFriendRequest(
      req.user.sub, req.params.studentId, req.params.requestId
    ));
  } catch (e) {
    return fail(res, e);
  }
});

export default router;
