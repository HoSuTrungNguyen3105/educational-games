import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";

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

// GET /api/images?folder=edu-game&page=1&perPage=20 — Liệt kê ảnh
router.get("/", authenticate, async (req, res, next) => {
  try {
    const folder = req.query.folder || "edu-game";
    const page = Number(req.query.page) || 1;
    const perPage = Math.min(Number(req.query.perPage) || 20, 100);
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/",
      max_results: perPage,
      page,
    });
    sendSuccess(res, {
      images: result.resources.map(r => ({
        url: r.secure_url,
        publicId: r.public_id,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
        createdAt: r.created_at,
      })),
      totalCount: result.rate_limit_remaining ?? null,
      page,
      perPage,
    });
  } catch (e) { next(e); }
});

// GET /api/images/search?q=keyword — Tìm ảnh
router.get("/search", authenticate, async (req, res, next) => {
  try {
    const expression = req.query.q;
    if (!expression) return sendError(res, "Thiếu từ khóa tìm kiếm", 400);
    const result = await cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(50)
      .execute();
    sendSuccess(res, {
      images: result.resources.map(r => ({
        url: r.secure_url,
        publicId: r.public_id,
        width: r.width,
        height: r.height,
        format: r.format,
        bytes: r.bytes,
        createdAt: r.created_at,
      })),
      totalCount: result.total_count,
    });
  } catch (e) { next(e); }
});

// DELETE /api/images/:publicId — Xóa ảnh (publicId cần encode hoặc thay / -> %2F)
router.delete("/:publicId(*)", authenticate, async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    sendSuccess(res, { result, publicId });
  } catch (e) { next(e); }
});

// DELETE /api/images — Xóa nhiều ảnh
router.delete("/", authenticate, async (req, res, next) => {
  try {
    const { publicIds } = req.body || {};
    if (!Array.isArray(publicIds) || publicIds.length === 0) return sendError(res, "Thiếu publicIds", 400);
    if (publicIds.length > 100) return sendError(res, "Tối đa 100 ảnh mỗi lần", 400);
    const result = await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });
    sendSuccess(res, { result });
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
router.get("/:publicId(*)", authenticate, async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
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
    });
  } catch (e) { next(e); }
});

export default router;
