import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import {
  canAccessImage,
  claimUnownedImages,
  forgetImageOwners,
  getImageOwners,
  recordImageOwner,
} from "../services/imageOwnerService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Chỉ chấp nhận file ảnh"));
  },
});

const router = Router();

// ── Chủ sở hữu ảnh (Nguyên chốt 2026-11-14, chi tiết ở imageOwnerService):
// user thường chỉ thấy/xoá được ảnh của chính mình; ảnh chưa có chủ (dữ
// liệu cũ) chỉ admin thấy/xoá; ảnh của người khác không lộ qua bất kỳ
// endpoint nào dưới đây. DTO giữ nguyên các trường cũ, chỉ THÊM `ownerId`
// (null = chưa có chủ) để giao diện hiển thị trạng thái.

// Trần quét Cloudinary khi liệt kê/đồng bộ: đủ lớn cho thư viện hiện tại,
// tránh vòng lặp vô hạn nếu next_cursor lỗi.
const MAX_SCAN_RESOURCES = 5000;

/** Quét TOÀN BỘ ảnh trong folder (đi hết next_cursor) — lọc theo chủ phải
 * diễn ra trên toàn bộ danh sách rồi mới phân trang, nếu không một trang
 * lẫn ảnh của nhiều user sẽ rò rỉ hoặc hụt ảnh. */
async function listAllResources(folder) {
  const all = [];
  let cursor;
  while (all.length < MAX_SCAN_RESOURCES) {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/",
      max_results: 500,
      ...(cursor ? { next_cursor: cursor } : {}),
    });
    all.push(...(result.resources || []));
    cursor = result.next_cursor;
    if (!cursor) break;
  }
  return all;
}

function toImageDto(r, ownerId) {
  return {
    url: r.secure_url,
    publicId: r.public_id,
    width: r.width,
    height: r.height,
    format: r.format,
    bytes: r.bytes,
    createdAt: r.created_at,
    ownerId: ownerId ?? null,
  };
}

/** Lọc một lô resource Cloudinary theo quyền xem của user + gắn ownerId. */
async function filterVisible(resources, user) {
  const owners = await getImageOwners(resources.map(r => r.public_id));
  return resources
    .filter(r => canAccessImage(owners.get(r.public_id) ?? null, user))
    .map(r => toImageDto(r, owners.get(r.public_id) ?? null));
}

/** Ghi chủ sau upload — lỗi ghi sổ KHÔNG làm hỏng upload (ảnh đã lên
 * Cloudinary); ảnh thiếu bản ghi sẽ ở trạng thái "chưa có chủ" (chỉ admin
 * thấy) và admin nhận lại được bằng nút Đồng bộ. */
async function recordOwnerSafely(publicId, user) {
  try {
    await recordImageOwner(publicId, user);
  } catch (e) {
    console.error("[images] Không ghi được chủ sở hữu cho ảnh", publicId, e.message);
  }
}

// POST /api/images/upload — Upload 1 ảnh lên Cloudinary
router.post("/upload", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "Thiếu file", 400);
    const folder = req.body.folder || "edu-game";
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    await recordOwnerSafely(result.public_id, req.user);
    sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      folder,
    });
  } catch (e) { next(e); }
});

// POST /api/images/upload-multiple — Upload nhiều ảnh
router.post("/upload-multiple", authenticate, upload.array("files", 20), async (req, res, next) => {
  try {
    if (!req.files?.length) return sendError(res, "Thiếu file", 400);
    const folder = req.body.folder || "edu-game";
    const results = await Promise.all(
      req.files.map(file =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          stream.end(file.buffer);
        })
      )
    );
    for (const r of results) await recordOwnerSafely(r.public_id, req.user);
    sendSuccess(res, {
      images: results.map(r => ({
        url: r.secure_url,
        publicId: r.public_id,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
      })),
      count: results.length,
    });
  } catch (e) { next(e); }
});

// POST /api/images/claim-unowned — Đồng bộ: gán toàn bộ ảnh CHƯA có chủ
// trong folder cho chính admin vừa bấm (chỉ admin gọi được). Không xoá hay
// sửa bất kỳ ảnh nào — chỉ ghi thêm bản ghi chủ.
router.post("/claim-unowned", authenticate, requireRoles("admin"), async (req, res, next) => {
  try {
    const folder = req.body?.folder || "edu-game";
    const resources = await listAllResources(folder);
    const owners = await getImageOwners(resources.map(r => r.public_id));
    const unownedIds = resources.map(r => r.public_id).filter(id => !owners.has(id));
    const claimed = await claimUnownedImages(unownedIds, req.user);
    sendSuccess(res, { claimed, totalScanned: resources.length, folder });
  } catch (e) { next(e); }
});

// GET /api/images?folder=edu-game&page=1&perPage=20 — Liệt kê ảnh
// Chỉ trả ảnh user được xem (của mình; admin thêm ảnh chưa có chủ), lọc
// trên toàn bộ folder rồi mới cắt trang nên phân trang luôn đúng.
router.get("/", authenticate, async (req, res, next) => {
  try {
    const folder = req.query.folder || "edu-game";
    const page = Number(req.query.page) || 1;
    const perPage = Math.min(Number(req.query.perPage) || 20, 100);
    const resources = await listAllResources(folder);
    const visible = await filterVisible(resources, req.user);
    const start = (page - 1) * perPage;
    sendSuccess(res, {
      images: visible.slice(start, start + perPage),
      totalCount: visible.length,
      page,
      perPage,
    });
  } catch (e) { next(e); }
});

// GET /api/images/search?q=keyword — Tìm ảnh
// Kết quả tìm cũng lọc theo cùng quy tắc chủ sở hữu trước khi trả.
router.get("/search", authenticate, async (req, res, next) => {
  try {
    const expression = req.query.q;
    if (!expression) return sendError(res, "Thiếu từ khóa tìm kiếm", 400);
    const result = await cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();
    const visible = await filterVisible(result.resources || [], req.user);
    sendSuccess(res, {
      images: visible,
      totalCount: visible.length,
    });
  } catch (e) { next(e); }
});

// DELETE /api/images — Xóa nhiều ảnh
// PHẢI khai báo TRƯỚC route /:publicId(*) bên dưới: wildcard (*) khớp cả
// chuỗi rỗng nên DELETE /api/images (không có publicId) sẽ bị route đơn
// nuốt mất nếu để sau (lỗi có sẵn từ trước đợt này, tiện sửa luôn).
// Chỉ xoá những ảnh user có quyền (của mình / ảnh vô chủ nếu là admin);
// các ảnh còn lại bị bỏ qua và báo lại qua skippedPublicIds, không xoá lén.
router.delete("/", authenticate, async (req, res, next) => {
  try {
    const { publicIds } = req.body || {};
    if (!Array.isArray(publicIds) || publicIds.length === 0) return sendError(res, "Thiếu publicIds", 400);
    if (publicIds.length > 100) return sendError(res, "Tối đa 100 ảnh mỗi lần", 400);
    const owners = await getImageOwners(publicIds);
    const allowed = publicIds.filter(id => canAccessImage(owners.get(id) ?? null, req.user));
    const allowedSet = new Set(allowed);
    const skippedPublicIds = publicIds.filter(id => !allowedSet.has(id));
    if (!allowed.length) return sendError(res, "Bạn không có quyền xóa các ảnh này", 403);
    const result = await cloudinary.api.delete_resources(allowed, { resource_type: "image" });
    await forgetImageOwners(allowed);
    sendSuccess(res, { result, skippedCount: skippedPublicIds.length, skippedPublicIds });
  } catch (e) { next(e); }
});

// DELETE /api/images/:publicId — Xóa ảnh (publicId cần encode hoặc thay / -> %2F)
// Chỉ chủ của ảnh, hoặc admin đối với ảnh chưa có chủ.
router.delete("/:publicId(*)", authenticate, async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const owners = await getImageOwners([publicId]);
    if (!canAccessImage(owners.get(publicId) ?? null, req.user)) {
      return sendError(res, "Bạn không có quyền xóa ảnh này", 403);
    }
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    if (result?.result === "ok" || result?.result === "not found") {
      await forgetImageOwners([publicId]);
    }
    sendSuccess(res, { result, publicId });
  } catch (e) { next(e); }
});

// GET /api/images/folders — Liệt kê các folder
router.get("/folders", authenticate, async (req, res, next) => {
  try {
    const result = await cloudinary.api.root_folders();
    sendSuccess(res, { folders: result.folders });
  } catch (e) { next(e); }
});

// GET /api/images/:publicId — Lấy thông tin 1 ảnh
// Ảnh không được xem trả 404 (không lộ cả sự tồn tại của ảnh người khác).
router.get("/:publicId(*)", authenticate, async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const owners = await getImageOwners([publicId]);
    const ownerId = owners.get(publicId) ?? null;
    if (!canAccessImage(ownerId, req.user)) {
      return sendError(res, "Không tìm thấy ảnh", 404);
    }
    const result = await cloudinary.api.resource(publicId, { resource_type: "image" });
    sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
      metadata: result.metadata,
      ownerId,
    });
  } catch (e) { next(e); }
});

export default router;
