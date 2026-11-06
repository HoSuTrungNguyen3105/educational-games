import { Router } from "express";
import * as pageService from "../services/pageService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { record as audit, AUDIT } from "../services/auditService.js";

// Trang HTML tĩnh (collection `pages`) — bám mẫu /templates trong routes/setup.js:
// đọc công khai theo slug, ghi chỉ giáo viên/admin. Nội dung HTML nằm ở storage,
// Mongo chỉ lưu htmlUrl (xem services/pageService.js).
const router = Router();

// Mở/xem TRỰC TIẾP bằng URL: chuyển hướng (302) tới file HTML trên storage —
// mở đường dẫn này trong trình duyệt là thấy trang hoàn chỉnh, không cần app.
router.get("/:slug/raw", async (req, res, next) => {
  try {
    const page = await pageService.getPageBySlug(req.params.slug);
    if (!page) return sendError(res, "Không tìm thấy trang", 404);
    const url = String(page.htmlUrl || "").trim();
    if (!url) return sendError(res, "Trang chưa có nội dung", 404);
    if (/^https?:\/\//i.test(url) || url.startsWith("/")) return res.redirect(302, url);
    // Dữ liệu cũ: htmlUrl còn là HTML thô (chưa qua storage) → trả thẳng.
    return res.type("html").send(url);
  } catch (e) {
    next(e);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const page = await pageService.getPageBySlug(req.params.slug);
    if (!page) return sendError(res, "Không tìm thấy trang", 404);
    sendSuccess(res, page);
  } catch (e) {
    next(e);
  }
});

// Ghi/cập nhật nội dung: body { html } (HTML thô — server upload lên storage
// rồi chỉ lưu link) hoặc { htmlUrl } (link có sẵn), kèm { title } tuỳ chọn.
router.put("/:slug", authenticate, requireRoles("teacher", "admin"), async (req, res, next) => {
  try {
    const page = await pageService.updatePage(req.params.slug, req.body || {});
    audit({
      req, action: AUDIT.PAGE_UPDATE, target: page?.slug || req.params.slug,
      message: "Cập nhật trang HTML tĩnh",
      // KHÔNG ghi htmlUrl/HTML thô vào audit — chỉ field người dùng thao tác (như template).
      meta: { fields: Object.keys(req.body || {}) },
    }).catch(() => {});
    sendSuccess(res, page);
  } catch (e) {
    audit({ req, action: AUDIT.PAGE_UPDATE, target: req.params.slug, result: "fail", message: e.message }).catch(() => {});
    next(e);
  }
});

export default router;
