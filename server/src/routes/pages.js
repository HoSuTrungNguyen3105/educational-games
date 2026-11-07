import { Router } from "express";
import * as pageService from "../services/pageService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { record as audit, AUDIT } from "../services/auditService.js";

// Trang HTML tĩnh (collection `pages`) — bám mẫu /templates trong routes/setup.js:
// đọc công khai theo slug, ghi chỉ giáo viên/admin. Nội dung HTML nằm ở storage,
// Mongo chỉ lưu htmlUrl (xem services/pageService.js).
const router = Router();

// Mở/xem TRỰC TIẾP bằng URL — mở đường dẫn này trong trình duyệt là thấy
// trang hoàn chỉnh, không cần app:
//   • Link http(s) trên storage: server TỰ lấy nội dung về rồi phát lại với
//     Content-Type text/html. Không redirect thẳng tới file storage vì nơi
//     lưu trữ có thể phục vụ file .html KHÔNG phải text/html (thực tế đã gặp
//     trên Supabase: mở file chỉ thấy mã nguồn thay vì trang đã render).
//     Lấy nội dung lỗi (mạng/storage) → rơi xuống redirect như cũ.
//   • Đường dẫn nội bộ (/uploads/…): redirect — express.static trên chính
//     server này phục vụ .html đúng text/html theo đuôi file.
//   • Dữ liệu cũ (htmlUrl còn là HTML thô): trả thẳng.
router.get("/:slug/raw", async (req, res, next) => {
  try {
    const page = await pageService.getPageBySlug(req.params.slug);
    if (!page) return sendError(res, "Không tìm thấy trang", 404);
    const url = String(page.htmlUrl || "").trim();
    if (!url) return sendError(res, "Trang chưa có nội dung", 404);
    if (/^https?:\/\//i.test(url)) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 10000);
        const upstream = await fetch(url, { signal: ctrl.signal });
        clearTimeout(timer);
        if (upstream.ok) return res.type("html").send(await upstream.text());
      } catch { /* lấy nội dung lỗi → redirect dự phòng bên dưới */ }
      return res.redirect(302, url);
    }
    if (url.startsWith("/")) return res.redirect(302, url);
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
