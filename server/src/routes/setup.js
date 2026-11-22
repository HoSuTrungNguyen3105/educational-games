import { Router } from "express";
import * as setupService from "../services/setupService.js";
import * as gameService from "../services/gameService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendNoContent, sendError, buildPagination } from "../utils/response.js";
import { respondWithRange } from "../utils/rangeList.js";
import { matchesFolded } from "../utils/textFold.js";
import { parseBulkIds, runBulkDelete, bulkResultPayload } from "../utils/bulkDelete.js";
import { record as audit, AUDIT } from "../services/auditService.js";

const router = Router();

router.get("/templates", async (req, res, next) => {
  try {
    let data = await setupService.listTemplates();
    // Lọc/sắp xếp tuỳ chọn (chỉ áp khi client GỬI, không gửi → hành vi cũ
    // nguyên vẹn): trang /dashboard/templates đã chuyển phân trang xuống
    // server nên tìm kiếm + lọc trạng thái + sắp xếp cũng phải chạy ở
    // server TRƯỚC khi cắt from/to — đúng các tiêu chí trang vẫn áp ở
    // client trước đây (tìm theo tên/thể loại/loại/trạng thái, gập dấu
    // qua utils/textFold.js; sắp xếp name|games|updated, mặc định giữ
    // thứ tự name A–Z của service).
    if (req.query.q !== undefined) {
      data = data.filter((t) => matchesFolded(req.query.q, t.name, t.category, t.type, t.status));
    }
    if (req.query.status) {
      data = data.filter((t) => t.status === req.query.status);
    }
    if (req.query.sort === "games") {
      data = [...data].sort((a, b) => (b.gamesCount || 0) - (a.gamesCount || 0));
    } else if (req.query.sort === "updated") {
      data = [...data].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    } else if (req.query.sort === "name") {
      data = [...data].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi"));
    }
    if (respondWithRange(req, res, data)) return;
    const pagination = buildPagination({ total: data.length, keyword: req.query.keyword || "" });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.get("/templates/slug/:slug", async (req, res, next) => {
  try {
    const tpl = await setupService.getTemplateBySlug(req.params.slug);
    if (!tpl) return sendError(res, "Không tìm thấy template", 404);
    sendSuccess(res, tpl);
  } catch (e) {
    next(e);
  }
});

router.get("/templates/:id", async (req, res, next) => {
  try {
    const tpl = await setupService.getTemplate(req.params.id);
    if (!tpl) return sendError(res, "Không tìm thấy template", 404);
    sendSuccess(res, tpl);
  } catch (e) {
    next(e);
  }
});

router.post("/templates", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const tpl = await setupService.createTemplate(req.body);
    audit({
      req, action: AUDIT.TEMPLATE_CREATE, target: tpl?.name || req.params.id || "",
      message: `Tạo game (${tpl?.type || ""})`,
      // KHÔNG ghi htmlUrl/HTML thô — chỉ những field người dùng thao tác.
      meta: { id: tpl?._id || null, fields: Object.keys(req.body || {}) },
    }).catch(() => {});
    sendCreated(res, tpl);
  } catch (e) {
    audit({ req, action: AUDIT.TEMPLATE_CREATE, target: req.body?.name || "", result: "fail", message: e.message }).catch(() => {});
    next(e);
  }
});

router.delete("/templates", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const result = await setupService.removeAllTemplates();
    audit({ req, action: AUDIT.TEMPLATE_DELETE_ALL, target: "toàn bộ template", message: `Đã xóa ${result.deleted} game` }).catch(() => {});
    sendSuccess(res, result, `Đã xóa ${result.deleted} template`);
  } catch (e) {
    next(e);
  }
});

router.put("/templates/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const tpl = await setupService.updateTemplate(req.params.id, req.body);
    audit({
      req, action: AUDIT.TEMPLATE_UPDATE, target: tpl?.name || req.params.id,
      message: `Cập nhật game`,
      meta: { fields: Object.keys(req.body || {}), htmlThayDoi: Boolean(req.body?.htmlUrl || req.body?.htmlTemplate) },
    }).catch(() => {});
    sendSuccess(res, tpl);
  } catch (e) {
    audit({ req, action: AUDIT.TEMPLATE_UPDATE, target: req.params.id, result: "fail", message: e.message }).catch(() => {});
    next(e);
  }
});

// Xóa HÀNG LOẠT template theo danh sách id — PHẢI khai báo TRƯỚC
// "/templates/:id" để "bulk" không bị nuốt thành một id. Body: { ids }.
// Template đang được game dùng KHÔNG xóa cứng: removeTemplate trả
// { deactivated } → tách riêng trong kết quả. Audit MỘT bản ghi/batch.
router.delete("/templates/bulk", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const parsed = parseBulkIds(req.body);
    if (parsed.error) return sendError(res, parsed.error, 400);
    const result = await runBulkDelete(parsed.ids, (id) => setupService.removeTemplate(id));
    audit({
      req, action: AUDIT.TEMPLATE_BULK_DELETE, target: "templates/bulk",
      message: `Xóa hàng loạt template: ${result.deleted.length} đã xóa, ${result.deactivated.length} chuyển inactive, ${result.failed.length} thất bại`,
      meta: { deletedIds: result.deleted, deletedCount: result.deleted.length, deactivatedCount: result.deactivated.length, failedCount: result.failed.length },
    }).catch(() => {});
    sendSuccess(res, bulkResultPayload(result), "Đã xử lý xóa hàng loạt");
  } catch (e) {
    next(e);
  }
});

router.delete("/templates/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const result = await setupService.removeTemplate(req.params.id);
    if (result.deactivated) {
      audit({ req, action: AUDIT.TEMPLATE_DELETE, target: req.params.id, message: `Còn ${result.gamesCount} game dùng → chuyển inactive` }).catch(() => {});
      return sendSuccess(res, result, `Template đang được ${result.gamesCount} game sử dụng, đã chuyển sang inactive`);
    }
    audit({ req, action: AUDIT.TEMPLATE_DELETE, target: req.params.id, message: "Xóa game" }).catch(() => {});
    sendNoContent(res);
  } catch (e) {
    audit({ req, action: AUDIT.TEMPLATE_DELETE, target: req.params.id, result: "fail", message: e.message }).catch(() => {});
    next(e);
  }
});

router.get("/categories", async (req, res, next) => {
  try {
    let data = await setupService.listCategories();
    // Lọc tuỳ chọn ?q= (chỉ áp khi client GỬI): trang /dashboard/categories
    // phân trang phía server — tìm theo tên hiển thị/ID, gập dấu, chạy
    // TRƯỚC khi cắt from/to (mẫu routes/reminders.js).
    if (req.query.q !== undefined) {
      data = data.filter((c) => matchesFolded(req.query.q, c.label, c.id));
    }
    if (respondWithRange(req, res, data)) return;
    const pagination = buildPagination({ total: data.length, keyword: req.query.keyword || "" });
    sendSuccess(res, data, "success", pagination);
  } catch (e) {
    next(e);
  }
});

router.post("/categories", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const cat = await setupService.createCategory(req.body);
    sendCreated(res, cat);
  } catch (e) {
    next(e);
  }
});

router.put("/categories/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const cat = await setupService.updateCategory(req.params.id, req.body);
    sendSuccess(res, cat);
  } catch (e) {
    next(e);
  }
});

router.delete("/categories/:id", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    await setupService.removeCategory(req.params.id);
    sendNoContent(res);
  } catch (e) {
    next(e);
  }
});

router.delete("/categories", authenticate, requireRoles("teacher", "admin"), async (_req, res, next) => {
  try {
    const result = await setupService.removeAllCategories();
    sendSuccess(res, result, `Đã xóa ${result.deleted} category`);
  } catch (e) {
    next(e);
  }
});

router.get("/games/:gameId/players", async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await gameService.get(gameId);
    if (!game) return sendError(res, "Game not found", 404);
    sendSuccess(res, {
      _id: game._id,
      name: game.name,
      playersCount: game.playersCount || 0,
      type: game.type,
      templateId: game.templateId,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/subjects", async (req, res, next) => {
  try {
    let data = await setupService.listSubjects();
    // Lọc tuỳ chọn ?q= (chỉ áp khi client GỬI): trang /dashboard/subjects
    // phân trang phía server — tìm theo tên môn, gập dấu, chạy TRƯỚC khi
    // cắt from/to (mẫu routes/reminders.js).
    if (req.query.q !== undefined) {
      data = data.filter((s) => matchesFolded(req.query.q, s.name));
    }
    if (respondWithRange(req, res, data)) return;
    sendSuccess(res, data);
  } catch (e) {
    next(e);
  }
});

router.post("/subjects", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const list = await setupService.addSubject(req.body.name);
    sendCreated(res, list);
  } catch (e) {
    next(e);
  }
});

router.put("/subjects/:name", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const list = await setupService.updateSubject(decodeURIComponent(req.params.name), req.body.name);
    sendSuccess(res, list);
  } catch (e) {
    next(e);
  }
});

router.delete("/subjects/:name", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const list = await setupService.removeSubject(decodeURIComponent(req.params.name));
    sendSuccess(res, list);
  } catch (e) {
    next(e);
  }
});

export default router;
