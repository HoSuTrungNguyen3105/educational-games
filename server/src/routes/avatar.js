import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { sendSuccess, sendError, sendCreated } from "../utils/response.js";
import { getCollection } from "../db.js";

const router = Router();

const ITEMS = "avatarItems";
const USERS = "users";

const SEED_ITEMS = [
  { id: "body_01", category: "body", name: "Thân mặc định", x: 0, y: 0, width: 245, height: 275, price: 0, default: true },
  { id: "skin_01", category: "skin", name: "Da sáng", x: 250, y: 0, width: 120, height: 290, price: 0, default: true },
  { id: "skin_02", category: "skin", name: "Da trung bình", x: 370, y: 0, width: 120, height: 290, price: 0, default: false },
  { id: "skin_03", category: "skin", name: "Da đậm", x: 490, y: 0, width: 120, height: 290, price: 50, default: false },
  { id: "face_01", category: "face", name: "Mặt bình thường", x: 250, y: 0, width: 120, height: 290, price: 0, default: true },
  { id: "face_02", category: "face", name: "Mặt cười", x: 370, y: 0, width: 120, height: 290, price: 0, default: false },
  { id: "face_03", category: "face", name: "Mặt vui", x: 490, y: 0, width: 120, height: 290, price: 30, default: false },
  { id: "hair_01", category: "hair", name: "Tóc ngắn", x: 625, y: 0, width: 228, height: 310, price: 0, default: true },
  { id: "hair_02", category: "hair", name: "Tóc dài", x: 853, y: 0, width: 228, height: 310, price: 0, default: false },
  { id: "hair_03", category: "hair", name: "Tóc xoăn", x: 1081, y: 0, width: 228, height: 310, price: 100, default: false },
  { id: "hair_04", category: "hair", name: "Tóc mohawk", x: 1309, y: 0, width: 227, height: 310, price: 150, default: false },
  { id: "shirt_01", category: "shirt", name: "Áo thun trắng", x: 0, y: 270, width: 263, height: 305, price: 0, default: true },
  { id: "shirt_02", category: "shirt", name: "Áo thun đỏ", x: 263, y: 270, width: 263, height: 305, price: 0, default: false },
  { id: "shirt_03", category: "shirt", name: "Áo sơ mi xanh", x: 526, y: 270, width: 262, height: 305, price: 80, default: false },
  { id: "shirt_04", category: "shirt", name: "Áo hoodie", x: 788, y: 270, width: 262, height: 305, price: 200, default: false },
  { id: "pants_01", category: "pants", name: "Quần jean", x: 0, y: 540, width: 350, height: 270, price: 0, default: true },
  { id: "pants_02", category: "pants", name: "Quần short", x: 350, y: 540, width: 350, height: 270, price: 0, default: false },
  { id: "pants_03", category: "pants", name: "Quần kaki", x: 700, y: 540, width: 350, height: 270, price: 120, default: false },
  { id: "shoes_01", category: "shoes", name: "Giày sneaker", x: 0, y: 785, width: 350, height: 239, price: 0, default: true },
  { id: "shoes_02", category: "shoes", name: "Giày thể thao", x: 350, y: 785, width: 350, height: 239, price: 60, default: false },
  { id: "shoes_03", category: "shoes", name: "Giày boot", x: 700, y: 785, width: 350, height: 239, price: 180, default: false },
  { id: "hat_01", category: "hat", name: "Mũ lưỡi trai", x: 1040, y: 280, width: 248, height: 175, price: 70, default: false },
  { id: "hat_02", category: "hat", name: "Mũ beret", x: 1288, y: 280, width: 248, height: 175, price: 120, default: false },
  { id: "glasses_01", category: "glasses", name: "Kính tròn", x: 1160, y: 430, width: 188, height: 170, price: 90, default: false },
  { id: "glasses_02", category: "glasses", name: "Kính vuông", x: 1348, y: 430, width: 188, height: 170, price: 110, default: false },
  { id: "acc_01", category: "accessory", name: "Phụ kiện sao", x: 1040, y: 430, width: 248, height: 297, price: 250, default: false },
  { id: "acc_02", category: "accessory", name: "Phụ kiện tim", x: 1288, y: 430, width: 248, height: 297, price: 200, default: false },
];

const CATEGORIES = [
  { id: "body", label: "Thân" }, { id: "skin", label: "Da" }, { id: "face", label: "Mặt" },
  { id: "hair", label: "Tóc" }, { id: "shirt", label: "Áo" }, { id: "pants", label: "Quần" },
  { id: "shoes", label: "Giày" }, { id: "hat", label: "Mũ" }, { id: "glasses", label: "Kính" },
  { id: "accessory", label: "Phụ kiện" },
];

const LAYER_ORDER = ["body", "skin", "face", "hair", "shirt", "pants", "shoes", "hat", "glasses", "accessory"];

const DEFAULT_LOADOUT = {
  body: "body_01", skin: "skin_01", face: "face_01", hair: "hair_01",
  shirt: "shirt_01", pants: "pants_01", shoes: "shoes_01",
  hat: null, glasses: null, accessory: null,
};

const SPRITE_SHEET = "/avatar/avatar-sprite.png";
const SPRITE_W = 1536;
const SPRITE_H = 1024;
const CANVAS_SIZE = 512;

async function ensureSeeded() {
  const count = await getCollection(ITEMS).countDocuments();
  if (count === 0 && SEED_ITEMS.length > 0) {
    await getCollection(ITEMS).insertMany(SEED_ITEMS.map(i => ({ ...i })));
  }
}

// ─── PUBLIC ──────────────────────────────────────────────────────

// GET /api/avatar/sheet — sprite sheet metadata
router.get("/sheet", (_req, res) => {
  sendSuccess(res, { spriteSheet: SPRITE_SHEET, spriteWidth: SPRITE_W, spriteHeight: SPRITE_H, canvasSize: CANVAS_SIZE });
});

// GET /api/avatar/items
router.get("/items", async (_req, res, next) => {
  try {
    await ensureSeeded();
    const items = await getCollection(ITEMS).find({}).sort({ category: 1, price: 1 }).toArray();
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

router.post("/admin/items", authenticate, async (req, res, next) => {
  try {
    const { category, name, x, y, width, height, price, default: isDefault } = req.body || {};
    if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
    if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
    if (typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number") {
      return sendError(res, "Thiếu x, y, width, height (phải là number)", 400);
    }
    const item = { id: uid(), category, name: String(name).trim(), x, y, width, height, price: Math.max(0, Number(price) || 0), default: !!isDefault };
    await getCollection(ITEMS).insertOne(item);
    sendCreated(res, item);
  } catch (e) { next(e); }
});

router.put("/admin/items/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    const { category, name, x, y, width, height, price, default: isDefault } = req.body || {};
    const updates = {};
    if (category !== undefined) { if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400); updates.category = category; }
    if (name !== undefined) updates.name = String(name).trim();
    if (x !== undefined) updates.x = Number(x);
    if (y !== undefined) updates.y = Number(y);
    if (width !== undefined) updates.width = Number(width);
    if (height !== undefined) updates.height = Number(height);
    if (price !== undefined) updates.price = Math.max(0, Number(price) || 0);
    if (isDefault !== undefined) updates.default = !!isDefault;
    if (Object.keys(updates).length === 0) return sendError(res, "Không có gì để cập nhật", 400);
    await getCollection(ITEMS).updateOne({ id }, { $set: updates });
    const updated = await getCollection(ITEMS).findOne({ id });
    sendSuccess(res, updated);
  } catch (e) { next(e); }
});

router.post("/admin/items/batch", authenticate, async (req, res, next) => {
  try {
    const { items } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return sendError(res, "Thiếu items array", 400);
    if (items.length > 100) return sendError(res, "Tối đa 100 item mỗi lần", 400);
    const created = [];
    for (const it of items) {
      const { category, name, x, y, width, height, price, default: isDefault } = it || {};
      if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
      if (!CATEGORIES.find(c => c.id === category)) return sendError(res, `Category không hợp lệ: ${category}`, 400);
      if (typeof x !== "number" || typeof y !== "number" || typeof width !== "number" || typeof height !== "number") {
        return sendError(res, `Thiếu x,y,width,height cho item: ${name}`, 400);
      }
      const item = { id: uid(), category, name: String(name).trim(), x, y, width, height, price: Math.max(0, Number(price) || 0), default: !!isDefault };
      await getCollection(ITEMS).insertOne(item);
      created.push(item);
    }
    sendCreated(res, { items: created, count: created.length });
  } catch (e) { next(e); }
});

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
