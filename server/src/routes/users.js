import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { createUser, listUsers, removeUser, removeUsersBulk, BULK_DELETE_MAX_IDS, resetPassword, updateUserRole, updateUser } from "../services/authService.js";
import { getCheckinStatus, performCheckin } from "../services/checkinService.js";
import * as petService from "../services/petService.js";
import * as petCatalog from "../services/petCatalog.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";
import { respondWithRange } from "../utils/rangeList.js";
import { record as audit, AUDIT } from "../services/auditService.js";

const router = Router();

router.use(authenticate);

// ── Điểm danh mỗi ngày (check-in nhận xu + chuỗi ngày liên tiếp) ────────
// Mọi tài khoản đã đăng nhập đều gọi được; giao diện chỉ hiện thẻ cho học
// sinh. Logic ở checkinService — KHÁC hệ điểm danh đi học của lớp
// (routes/attendance.js). Khai báo ở đầu để "/me/..." không lẫn với "/:id".
router.get("/me/check-in", async (req, res) => {
  try {
    sendSuccess(res, await getCheckinStatus(req.user.sub));
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.post("/me/check-in", async (req, res) => {
  try {
    const result = await performCheckin(req.user.sub);
    sendSuccess(res, result, result.alreadyCheckedIn ? "Hôm nay đã điểm danh rồi" : "Điểm danh thành công");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// ── Thú cưng của chính mình ─────────────────────────────────────────────
// Trước đây là router riêng /api/pet — đã GỘP vào đây theo chỉ đạo của
// Nguyên (pet là dữ liệu của hồ sơ người dùng, không cần API riêng).
// Logic giữ nguyên ở services/petService.js + services/petCatalog.js;
// trạng thái "nurture" (cấp/EXP/tâm tính) nằm ở collection `userPets`, còn
// `look` (bộ đồ DressUp app vẽ) đọc từ `users.pet` — petService.serialize
// trả kèm cả hai như endpoint cũ.
//
//   GET  /api/users/me/pet        pet hiện tại + `look` (tự tạo nếu chưa có)
//   PUT  /api/users/me/pet        đổi tên / loài / màu / trang phục legacy
//   POST /api/users/me/pet/exp    cộng EXP khi trả lời đúng (game gọi)
//   POST /api/users/me/pet/mood   đổi tâm tính
//   POST /api/users/me/pet/reset  đặt lại mặc định
router.get("/me/pet", async (req, res, next) => {
  try {
    const pet = await petService.getByUser(req.user.sub);
    // `look` = bộ đồ DressUp trong hồ sơ — diện mạo thật mà app vẽ.
    sendSuccess(res, petService.serialize(pet, await petService.getLook(req.user.sub)));
  } catch (e) {
    next(e);
  }
});

router.put("/me/pet", async (req, res, next) => {
  try {
    const result = await petService.updateLook(req.user.sub, req.body || {});
    if (!result.ok) {
      return sendError(res, result.errors?.join("; ") || "Dữ liệu không hợp lệ", 400);
    }
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

router.post("/me/pet/exp", async (req, res, next) => {
  try {
    const { amount, correct, wrong } = req.body || {};
    const result = await petService.addExp(
      req.user.sub,
      Number(amount) || 0,
      { correct: Number(correct) || 0, wrong: Number(wrong) || 0 }
    );
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
});

router.post("/me/pet/mood", async (req, res, next) => {
  try {
    const result = await petService.setMood(req.user.sub, req.body?.mood);
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "mood không hợp lệ", 400);
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

router.post("/me/pet/reset", async (req, res, next) => {
  try {
    const result = await petService.reset(req.user.sub);
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

// ── ADMIN: quản lý danh mục thú cưng (giáo viên + quản trị) ─────────────
// Trước đây là /api/pet/admin/* — gộp vào /api/users/admin/pet-catalog.
//   GET    /api/users/admin/pet-catalog              toàn bộ danh mục + số pet đang dùng
//   POST   /api/users/admin/pet-catalog/reset        khôi phục danh mục mặc định
//   POST   /api/users/admin/pet-catalog/:kind        thêm loài / màu / trang phục
//   PUT    /api/users/admin/pet-catalog/:kind/:id    sửa
//   DELETE /api/users/admin/pet-catalog/:kind/:id    xoá (tự dọn pet đang dùng)
const petCatalogAdmin = [requireRoles("teacher", "admin")];

/**
 * Toàn bộ danh mục cho trang admin, kèm `usage` = số pet đang dùng mỗi mục
 * để admin biết xoá đi sẽ ảnh hưởng bao nhiêu người trước khi bấm nút.
 */
router.get("/admin/pet-catalog", ...petCatalogAdmin, async (_req, res, next) => {
  try {
    await petCatalog.ensureLoaded();
    const [species, colors, outfits] = [
      petCatalog.listSpecies(),
      petCatalog.listColors(),
      petCatalog.listOutfits(),
    ];

    const usage = {};
    for (const s of species) usage[`species:${s.id}`] = await petCatalog.countPetsUsing("species", s.id);
    for (const c of colors) usage[`color:${c.id}`] = await petCatalog.countPetsUsing("color", c.id);
    for (const o of outfits) usage[`outfit:${o.id}`] = await petCatalog.countPetsUsing("outfit", o.id);

    sendSuccess(res, {
      species, colors, outfits,
      slots: petCatalog.SLOTS,
      slotLabels: petCatalog.SLOT_LABEL,
      moods: petCatalog.MOOD_LIST,
      usage,
    });
  } catch (e) { next(e); }
});

/** Khôi phục danh mục mặc định — xoá sạch collection rồi seed lại. */
// Đặt TRƯỚC `/:kind` để "reset" không bị nuốt vào :kind.
router.post("/admin/pet-catalog/reset", ...petCatalogAdmin, async (_req, res, next) => {
  try {
    const result = await petCatalog.resetToSeed();
    sendSuccess(res, result);
  } catch (e) { next(e); }
});

router.post("/admin/pet-catalog/:kind", ...petCatalogAdmin, async (req, res, next) => {
  try {
    const result = await petCatalog.createItem(req.params.kind, req.body || {});
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "Không tạo được", 400);
    sendSuccess(res, result.item);
  } catch (e) { next(e); }
});

router.put("/admin/pet-catalog/:kind/:id", ...petCatalogAdmin, async (req, res, next) => {
  try {
    const result = await petCatalog.updateItem(req.params.kind, req.params.id, req.body || {});
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "Không cập nhật được", 400);
    sendSuccess(res, result.item);
  } catch (e) { next(e); }
});

router.delete("/admin/pet-catalog/:kind/:id", ...petCatalogAdmin, async (req, res, next) => {
  try {
    const result = await petCatalog.deleteItem(req.params.kind, req.params.id);
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "Không xoá được", 400);
    sendSuccess(res, { deleted: req.params.id, affectedPets: result.affectedPets || 0 });
  } catch (e) { next(e); }
});

router.get("/", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const data = await listUsers();
    // ?from=&to= (phân đoạn bản ghi cho dashboard) — không có thì giữ nguyên.
    if (respondWithRange(req, res, data)) return;
    const pagination = buildPagination({ total: data.length });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (role === "admin" && req.user.role !== "admin") {
      return sendError(res, "Chỉ quản trị mới có thể tạo tài khoản quản trị", 403);
    }
    const user = await createUser(req.body || {});
    audit({ req, action: AUDIT.USER_CREATE, target: user?.username || req.params.id || "", message: `Tạo tài khoản ${user?.role || role || ""}` }).catch(() => {});
    sendCreated(res, user);
  } catch (e) {
    audit({ req, action: AUDIT.USER_CREATE, target: req.body?.username || "", result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/role", requireRoles("admin"), async (req, res, next) => {
  try {
    const { role } = req.body || {};
    if (!role) return sendError(res, "role là bắt buộc", 400);
    const user = await updateUserRole(req.params.id, role);
    audit({ req, action: AUDIT.USER_ROLE, target: user?.username || req.params.id, message: `Đổi vai trò thành ${role}` }).catch(() => {});
    sendSuccess(res, user, "Đã cập nhật vai trò");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.patch("/:id", requireRoles("admin"), async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body || {});
    // Chỉ ghi TÊN field thay đổi — body có thể chứa email/mật khẩu.
    audit({ req, action: AUDIT.USER_UPDATE, target: user?.username || req.params.id, meta: { fields: Object.keys(req.body || {}) } }).catch(() => {});
    sendSuccess(res, user, "Đã cập nhật người dùng");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

// Xóa HÀNG LOẠT tài khoản rác theo danh sách id — CHỈ admin (xóa đơn lẻ ở
// dưới vẫn cho teacher như cũ). PHẢI khai báo TRƯỚC "/:id" để "bulk" không
// bị nuốt thành một id. Body: { ids: string[] } (tối đa BULK_DELETE_MAX_IDS).
// Từng id độc lập: tự xóa mình / tài khoản admin / id không tồn tại chỉ vào
// danh sách `failed`, không làm hỏng cả batch. Ghi audit MỘT bản ghi/batch.
router.delete("/bulk", requireRoles("admin"), async (req, res, next) => {
  try {
    const { ids } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0 || ids.some((x) => typeof x !== "string" || !x.trim())) {
      return sendError(res, "ids phải là mảng chuỗi id không rỗng", 400);
    }
    if (ids.length > BULK_DELETE_MAX_IDS) {
      return sendError(res, `Tối đa ${BULK_DELETE_MAX_IDS} id mỗi lần xóa`, 400);
    }
    const { deleted, failed } = await removeUsersBulk(ids.map((x) => x.trim()), { selfId: req.user.sub });
    audit({
      req, action: AUDIT.USER_BULK_DELETE, target: "users/bulk",
      message: `Xóa hàng loạt: ${deleted.length} thành công, ${failed.length} thất bại`,
      meta: { deletedIds: deleted, deletedCount: deleted.length, failedCount: failed.length },
    }).catch(() => {});
    sendSuccess(res, { deleted, failed, deletedCount: deleted.length, failedCount: failed.length }, "Đã xử lý xóa hàng loạt");
  } catch (e) {
    sendError(res, e.message, 400);
  }
});

router.delete("/:id", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await removeUser(req.params.id);
    audit({ req, action: AUDIT.USER_DELETE, target: req.params.id, message: "Xóa tài khoản" }).catch(() => {});
    sendNoContent(res);
  } catch (e) {
    audit({ req, action: AUDIT.USER_DELETE, target: req.params.id, result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

router.patch("/:id/reset-password", requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const { newPassword } = req.body || {};
    if (!newPassword) return sendError(res, "newPassword là bắt buộc", 400);
    await resetPassword(req.params.id, newPassword);
    // Mật khẩu mới KHÔNG bao giờ được ghi vào nhật ký.
    audit({ req, action: AUDIT.USER_RESET_PASSWORD, target: req.params.id, message: "Đặt lại mật khẩu cho người dùng" }).catch(() => {});
    sendSuccess(res, { ok: true }, "Đã đổi mật khẩu thành công");
  } catch (e) {
    audit({ req, action: AUDIT.USER_RESET_PASSWORD, target: req.params.id, result: "fail", message: e.message }).catch(() => {});
    sendError(res, e.message, 400);
  }
});

export default router;
