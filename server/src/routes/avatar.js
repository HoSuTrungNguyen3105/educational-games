import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError, sendCreated } from "../utils/response.js";
import { getCollection } from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const router = Router();

console.log("[avatar] CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("[avatar] CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING");
console.log("[avatar] CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ITEMS = "avatarItems";
const USERS = "users";

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const LAYER_ORDER = ["body", "skin", "face", "hair", "shirt", "pants", "shoes", "hat", "glasses", "accessory"];

const ZINDEX_MAP = {
  body: 10, skin: 15, face: 20, hair: 30, shirt: 40,
  pants: 50, shoes: 60, hat: 70, glasses: 80, accessory: 90,
};

const DEFAULT_LOADOUT = {
  body: "body_01", skin: "skin_01", face: "face_01", hair: "hair_01",
  shirt: "shirt_01", pants: "pants_01", shoes: "shoes_01",
  hat: null, glasses: null, accessory: null,
};

// ─── FILE UPLOAD (Cloudinary) ────────────────────────────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Chỉ chấp nhận file ảnh"));
  },
});

function uploadToCloudinary(fileBuffer, folder = "avatar-items") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "png",
      },
      (error, result) => {
        if (error) {
          console.error("========== CLOUDINARY ERROR ==========");
          console.error("http_code:", error.http_code);
          console.error("message:", error.message);
          console.error("error:", error);
          console.error("======================================");

          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}

// POST /api/avatar/upload — upload 1 file ảnh lên Cloudinary
router.post("/upload", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, "Không có file", 400);
    console.log("[avatar/upload] file:", req.file.originalname, req.file.size, "bytes");
    const result = await uploadToCloudinary(req.file.buffer);
    console.log("[avatar/upload] success:", result.secure_url);
    sendCreated(res, { url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    console.error("[avatar/upload] Cloudinary error:", e.message, JSON.stringify(e));
    next(e);
  }
});

// POST /api/avatar/upload/batch — upload nhiều file
router.post("/upload/batch", authenticate, upload.array("files", 50), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return sendError(res, "Không có file", 400);
    const results = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
    const files = results.map(r => ({ url: r.secure_url, publicId: r.public_id }));
    sendCreated(res, { files, count: files.length });
  } catch (e) { next(e); }
});

// ─── SEED DEFAULT ITEMS (with placeholder images) ────────────────

const SEED_ITEMS = [
  { id: "body_01", category: "body", name: "Thân mặc định", image: "", price: 0, default: true, zIndex: ZINDEX_MAP.body },
  { id: "skin_01", category: "skin", name: "Da sáng", image: "", price: 0, default: true, zIndex: ZINDEX_MAP.skin },
  { id: "hair_01", category: "hair", name: "Tóc ngắn", image: "", price: 0, default: true, zIndex: ZINDEX_MAP.hair },
  { id: "shirt_01", category: "shirt", name: "Áo thun trắng", image: "", price: 0, default: true, zIndex: ZINDEX_MAP.shirt },
  { id: "pants_01", category: "pants", name: "Quần jean", image: "", price: 0, default: true, zIndex: ZINDEX_MAP.pants },
  { id: "shoes_01", category: "shoes", name: "Giày sneaker", image: "", price: 0, default: true, zIndex: ZINDEX_MAP.shoes },
];

async function ensureSeeded() {
  const count = await getCollection(ITEMS).countDocuments();
  if (count === 0 && SEED_ITEMS.length > 0) {
    await getCollection(ITEMS).insertMany(SEED_ITEMS.map(i => ({ ...i })));
  }
}

// ─── PUBLIC ──────────────────────────────────────────────────────

// GET /api/avatar/categories
router.get("/categories", (_req, res) => {
  sendSuccess(res, { categories: CATEGORIES, layerOrder: LAYER_ORDER });
});

// GET /api/avatar/items
router.get("/items", async (_req, res, next) => {
  try {
    await ensureSeeded();
    const items = await getCollection(ITEMS).find({}).sort({ category: 1, price: 1 }).toArray();
    // Backfill zIndex for old items missing it
    const bulkOps = [];
    for (const item of items) {
      if (item.zIndex === undefined || item.zIndex === null) {
        const z = ZINDEX_MAP[item.category] || 50;
        item.zIndex = z;
        bulkOps.push({ updateOne: { filter: { id: item.id }, update: { $set: { zIndex: z } } } });
      }
    }
    if (bulkOps.length > 0) await getCollection(ITEMS).bulkWrite(bulkOps);
    sendSuccess(res, { items, categories: CATEGORIES, layerOrder: LAYER_ORDER });
  } catch (e) { next(e); }
});

// GET /api/avatar/inventory
router.get("/inventory", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { inventory: user.inventory || [] });
  } catch (e) { next(e); }
});

// GET /api/avatar/loadout
router.get("/loadout", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { loadout: user.avatarLoadout || DEFAULT_LOADOUT });
  } catch (e) { next(e); }
});

// POST /api/avatar/buy
router.post("/buy", authenticate, async (req, res, next) => {
  try {
    const { itemId } = req.body || {};
    if (!itemId) return sendError(res, "Thiếu itemId", 400);
    await ensureSeeded();
    const item = await getCollection(ITEMS).findOne({ id: itemId });
    if (!item) return sendError(res, "Item không tồn tại", 404);
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    if (item.price === 0 || item.default) {
      return sendSuccess(res, { owned: true, inventory: user.inventory || [], coins: user.coins || 0 });
    }
    if ((user.inventory || []).includes(itemId)) {
      return sendSuccess(res, { owned: true, inventory: user.inventory, coins: user.coins || 0 });
    }
    const coins = user.coins || 0;
    if (coins < item.price) return sendError(res, `Không đủ coin. Cần ${item.price}, bạn có ${coins}`, 400);
    const newCoins = coins - item.price;
    const newInventory = [...(user.inventory || []), itemId];
    await getCollection(USERS).updateOne({ id: req.user.sub }, { $set: { coins: newCoins, inventory: newInventory } });
    sendSuccess(res, { owned: true, inventory: newInventory, coins: newCoins });
  } catch (e) { next(e); }
});

// POST /api/avatar/save
router.post("/save", authenticate, async (req, res, next) => {
  try {
    const { loadout } = req.body || {};
    if (!loadout || typeof loadout !== "object") return sendError(res, "Thiếu loadout", 400);
    await ensureSeeded();
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    const inventory = user.inventory || [];
    for (const [layer, itemId] of Object.entries(loadout)) {
      if (itemId === null) continue;
      if (!LAYER_ORDER.includes(layer)) return sendError(res, `Layer không hợp lệ: ${layer}`, 400);
      const item = await getCollection(ITEMS).findOne({ id: itemId });
      if (!item) return sendError(res, `Item không tồn tại: ${itemId}`, 400);
      if (item.category !== layer) return sendError(res, `Item ${itemId} không thuộc layer ${layer}`, 400);
      if (item.price > 0 && !item.default && !inventory.includes(itemId)) {
        return sendError(res, `Bạn chưa sở hữu item: ${item.name}`, 400);
      }
    }
    await getCollection(USERS).updateOne({ id: req.user.sub }, { $set: { avatarLoadout: loadout } });
    sendSuccess(res, { loadout });
  } catch (e) { next(e); }
});

// ─── ADMIN ITEMS CRUD ────────────────────────────────────────────

const uid = () => `av-${Math.random().toString(36).slice(2, 9)}`;

// POST /api/avatar/admin/items — create single item
router.post("/admin/items", authenticate, async (req, res, next) => {
  try {
    const { category, name, image, price, default: isDefault, zIndex } = req.body || {};
    if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
    if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
    const item = {
      id: uid(), category, name: String(name).trim(), image: image || "",
      price: Math.max(0, Number(price) || 0), default: !!isDefault,
      zIndex: Number(zIndex) || ZINDEX_MAP[category] || 50,
    };
    await getCollection(ITEMS).insertOne(item);
    sendCreated(res, item);
  } catch (e) { next(e); }
});

// PUT /api/avatar/admin/items/:id
router.put("/admin/items/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    const { category, name, image, price, default: isDefault, zIndex } = req.body || {};
    const updates = {};
    if (category !== undefined) { if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400); updates.category = category; }
    if (name !== undefined) updates.name = String(name).trim();
    if (image !== undefined) updates.image = image;
    if (price !== undefined) updates.price = Math.max(0, Number(price) || 0);
    if (isDefault !== undefined) updates.default = !!isDefault;
    if (zIndex !== undefined) updates.zIndex = Number(zIndex) || 50;
    if (Object.keys(updates).length === 0) return sendError(res, "Không có gì để cập nhật", 400);
    await getCollection(ITEMS).updateOne({ id }, { $set: updates });
    const updated = await getCollection(ITEMS).findOne({ id });
    sendSuccess(res, updated);
  } catch (e) { next(e); }
});

// POST /api/avatar/admin/items/batch — create many items
router.post("/admin/items/batch", authenticate, async (req, res, next) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return sendError(res, "Thiếu items array", 400);
    if (items.length > 100) return sendError(res, "Tối đa 100 item mỗi lần", 400);
    const created = [];
    for (const it of items) {
      const { category, name, image, price, default: isDefault, zIndex } = it || {};
      if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
      if (!CATEGORIES.find(c => c.id === category)) return sendError(res, `Category không hợp lệ: ${category}`, 400);
      const item = {
        id: uid(), category, name: String(name).trim(), image: image || "",
        price: Math.max(0, Number(price) || 0), default: !!isDefault,
        zIndex: Number(zIndex) || ZINDEX_MAP[category] || 50,
      };
      await getCollection(ITEMS).insertOne(item);
      created.push(item);
    }
    sendCreated(res, { items: created, count: created.length });
  } catch (e) { next(e); }
});

// DELETE /api/avatar/admin/items/:id
router.delete("/admin/items/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    if (existing.default) return sendError(res, "Không thể xóa item mặc định", 400);
    await getCollection(ITEMS).deleteOne({ id });
    sendSuccess(res, { deleted: id });
  } catch (e) { next(e); }
});

export default router;
