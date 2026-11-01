// routes/system.js — API cho trang Cài đặt quản trị.
//
//   GET  /api/system/status         tình trạng API / MongoDB / Supabase / tải HTML
//   GET  /api/system/storage        thống kê số game, HTML, thumbnail, dung lượng
//   POST /api/system/scan           quét link htmlUrl + thumbnail của template (chỉ đọc)
//   GET  /api/system/config         cấu hình hệ thống (admin)
//   PUT  /api/system/config         lưu cấu hình (whitelist + audit log)
//   GET  /api/system/logs           nhật ký thao tác, có tìm kiếm/lọc/phân trang
//   GET  /api/system/public-config  banner bảo trì + tên site cho mọi client (không cần đăng nhập)
//
// Quyền: mọi đường dẫn /api/system/* bị middleware/permission.js gác bằng
// `settings.view` (đọc) / `settings.edit` (ghi) — kiểm tra ở SERVER, không chỉ ẩn nút.
// Response theo envelope chung: { status, code, msg, data }.

import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError, buildPagination } from "../utils/response.js";
import * as systemService from "../services/systemService.js";
import * as systemConfig from "../services/systemConfigService.js";
import * as auditService from "../services/auditService.js";
import { storeThumbnail } from "../services/templateStorageService.js";

const router = Router();
router.use(authenticate);

/** data-URL ảnh → upload Supabase, trả URL; link thường giữ nguyên; rỗng → "". */
async function resolveImageUrl(value) {
  const v = String(value || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (!/^data:image\//i.test(v)) throw new Error("Logo/favicon phải là ảnh (PNG/JPG/WebP) hoặc link http(s)");
  const saved = await storeThumbnail(v);
  return saved.url;
}

// ── A. Tình trạng hệ thống ────────────────────────────────────────────────
router.get("/status", async (req, res, next) => {
  try {
    const refresh = req.query.refresh === "1" || req.query.refresh === "true";
    sendSuccess(res, await systemService.getSystemStatus({ force: refresh }));
  } catch (e) { next(e); }
});

// ── B. Lưu trữ game ───────────────────────────────────────────────────────
router.get("/storage", async (_req, res, next) => {
  try {
    sendSuccess(res, await systemService.getStorageStats());
  } catch (e) { next(e); }
});

// ── C. Kiểm tra URL game ─────────────────────────────────────────────────
router.post("/scan", async (req, res, next) => {
  try {
    const { page, perPage, force } = req.body || {};
    const result = await systemService.scanTemplates({ page, perPage, force: force === true });
    await auditService.record({
      req,
      action: auditService.AUDIT.SCAN_RUN,
      target: `templates page=${result.page}/${result.totalPages}`,
      result: "success",
      message: result.cached ? "Kết quả cũ (trong thời gian chờ)" : `Quét ${result.checked}/${result.total} template`,
      meta: { summary: result.summary, cached: result.cached },
    });
    sendSuccess(res, result, result.cached ? "cached" : "success");
  } catch (e) {
    if (e.code === "scan_running") return sendError(res, e.message, 409);
    next(e);
  }
});

// ── F/G. Cấu hình chung + thông báo ──────────────────────────────────────
router.get("/config", async (_req, res, next) => {
  try {
    sendSuccess(res, await systemConfig.getConfig());
  } catch (e) { next(e); }
});

router.put("/config", async (req, res, next) => {
  try {
    const patch = req.body && typeof req.body === "object" ? req.body : {};
    const clean = JSON.parse(JSON.stringify(patch));

    // Logo/favicon gửi lên dạng ảnh (data-URL) → đổi thành link Supabase trước khi ghi DB.
    for (const key of ["logoUrl", "faviconUrl"]) {
      const v = clean?.site?.[key];
      if (typeof v === "string" && v.startsWith("data:")) {
        clean.site[key] = await resolveImageUrl(v);
      } else if (typeof v === "string") {
        clean.site[key] = v.trim();
      }
    }

    const result = await systemConfig.updateConfig(clean, req.user);
    await auditService.record({
      req,
      action: auditService.AUDIT.CONFIG_UPDATE,
      target: "system_config:global",
      result: "success",
      message: result.changed.length ? result.changed.join(", ") : "Không có thay đổi",
      // Chỉ ghi TÊN khoá thay đổi — không ghi giá trị (ảnh/logo có thể là URL dài).
      meta: { changed: result.changed, ignored: result.ignored },
    });
    sendSuccess(res, { config: result.config, changed: result.changed, ignored: result.ignored });
  } catch (e) {
    if (/phải là ảnh|link http/i.test(e.message)) return sendError(res, e.message, 400);
    next(e);
  }
});

// ── E. Nhật ký hoạt động ─────────────────────────────────────────────────
router.get("/logs", async (req, res, next) => {
  try {
    const q = req.query;
    const data = await auditService.list({
      page: q.page || q.current_page,
      perPage: q.perPage || q.per_page,
      keyword: q.keyword,
      action: q.action,
      actor: q.actor,
      result: q.result,
      from: q.from || q.from_date,
      to: q.to || q.to_date,
    });
    sendSuccess(res, data, "success", buildPagination({
      page: data.page, perPage: data.perPage, total: data.total,
      keyword: q.keyword || "", sortBy: "at", sortDir: "DESC",
      fromDate: q.from || "", toDate: q.to || "", dateCol: "at",
    }));
  } catch (e) { next(e); }
});

export default router;

/**
 * Cấu hình công khai — mount RIÊNG trong app.js ở /api/system/public-config và
 * /api/public-config trước lớp kiểm tra quyền, để app học sinh hiển thị được
 * banner bảo trì mà không cần đăng nhập.
 */
export const publicRouter = Router();
publicRouter.get("/", async (_req, res, next) => {
  try {
    sendSuccess(res, await systemConfig.getPublicConfig());
  } catch (e) { next(e); }
});
