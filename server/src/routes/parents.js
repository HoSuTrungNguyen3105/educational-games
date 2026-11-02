import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";
import * as parentService from "../services/parentService.js";
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
    sendSuccess(res, await parentService.unlink(req.params.parentId, req.user.sub));
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
    sendSuccess(res, await parentService.unlink(req.user.sub, req.params.studentId));
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

export default router;
