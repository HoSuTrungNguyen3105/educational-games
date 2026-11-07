import { Router } from "express";
import * as documentService from "../services/documentService.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendCreated, sendError, buildPagination } from "../utils/response.js";

// Tài liệu giáo viên — Teacher Document Studio (collection `documents`).
// Chỉ có MỘT bề mặt: giáo viên/admin, chỉ chủ sở hữu (service kiểm tra
// ownerId, admin ngoại lệ) — tài liệu soạn thảo là dữ liệu riêng của
// giáo viên, không có phía học sinh như bài học AI Studio.
const router = Router();

const actorOf = (req) => ({ id: req.user.sub, role: req.user.role });

function handleError(res, e) {
  return sendError(res, e.message, e.status || 400);
}

router.get("/mine", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const { search, docType, page, perPage } = req.query;
    const { items, total } = await documentService.listMyDocuments(req.user.sub, { search, docType, page, perPage });
    sendSuccess(res, items, "success",
      buildPagination({ page, perPage, total, keyword: search || "" }));
  } catch (e) { handleError(res, e); }
});

router.post("/", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const doc = await documentService.createDocument(req.user.sub, req.body || {});
    sendCreated(res, doc, "Đã tạo tài liệu");
  } catch (e) { handleError(res, e); }
});

router.get("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const doc = await documentService.getDocumentForOwner(req.params.id, actorOf(req));
    sendSuccess(res, doc);
  } catch (e) { handleError(res, e); }
});

router.put("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const doc = await documentService.updateDocument(req.params.id, actorOf(req), req.body || {});
    sendSuccess(res, doc, "Đã cập nhật tài liệu");
  } catch (e) { handleError(res, e); }
});

router.delete("/:id", authenticate, requireRoles("teacher", "admin"), async (req, res) => {
  try {
    const out = await documentService.deleteDocument(req.params.id, actorOf(req));
    sendSuccess(res, out, "Đã xoá tài liệu");
  } catch (e) { handleError(res, e); }
});

export default router;
