import { Router } from "express";
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ITEMS = "avatarItems";
const USERS = "users";
const TEMPLATE = "avatarTemplate";

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

const DEFAULT_TEMPLATE = {
  body:    { x: 0,   y: 0,   width: 245, height: 275, zIndex: 1 },
  skin:    { x: 0,   y: 0,   width: 245, height: 275, zIndex: 2 },
  face:    { x: 50,  y: 20,  width: 145, height: 120, zIndex: 3 },
  hair:    { x: 40,  y: -10, width: 165, height: 100, zIndex: 4 },
  shirt:   { x: 30,  y: 130, width: 185, height: 100, zIndex: 5 },
  pants:   { x: 40,  y: 220, width: 165, height: 80,  zIndex: 6 },
  shoes:   { x: 50,  y: 285, width: 145, height: 40,  zIndex: 7 },
  hat:     { x: 30,  y: -20, width: 185, height: 60,  zIndex: 8 },
  glasses: { x: 65,  y: 55,  width: 115, height: 35,  zIndex: 9 },
  accessory: { x: 180, y: 140, width: 60, height: 60, zIndex: 10 },
};

// ─── SEED DEFAULT ITEMS ─────────────────────────────────────────

const SEED_ITEMS = [
  {
    id: "body_01", category: "body", name: "Thân mặc định", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="122" cy="137" rx="75" ry="100" fill="#F5D6B8"/>
    </svg>`,
  },
  {
    id: "skin_01", category: "skin", name: "Da sáng", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="122" cy="137" rx="70" ry="95" fill="#FFE0C2"/>
    </svg>`,
  },
  {
    id: "face_01", category: "face", name: "Mặt mặc định", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <circle cx="95" cy="100" r="8" fill="#3D2B1F"/>
      <circle cx="150" cy="100" r="8" fill="#3D2B1F"/>
      <path d="M105 130 Q122 145 140 130" stroke="#C4756B" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
  },
  {
    id: "hair_01", category: "hair", name: "Tóc ngắn nâu", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 90 Q50 20 122 15 Q195 20 195 90 Q195 60 170 45 Q145 30 122 28 Q100 30 75 45 Q50 60 50 90Z" fill="#6B3A2A"/>
    </svg>`,
  },
  {
    id: "shirt_01", category: "shirt", name: "Áo thun trắng", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 145 L80 135 L122 140 L165 135 L205 145 L210 230 L35 230Z" fill="#FFFFFF" stroke="#DDD" stroke-width="1"/>
      <path d="M80 135 L65 115 L80 110" fill="#FFFFFF" stroke="#DDD" stroke-width="1"/>
      <path d="M165 135 L180 115 L165 110" fill="#FFFFFF" stroke="#DDD" stroke-width="1"/>
    </svg>`,
  },
  {
    id: "pants_01", category: "pants", name: "Quần jean", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <path d="M55 225 L50 310 L105 310 L122 240 L140 310 L195 310 L190 225Z" fill="#4A6FA5" stroke="#3D5A80" stroke-width="1"/>
      <line x1="122" y1="230" x2="122" y2="290" stroke="#3D5A80" stroke-width="1"/>
    </svg>`,
  },
  {
    id: "shoes_01", category: "shoes", name: "Giày sneaker", price: 0, default: true,
    html: `<svg viewBox="0 0 245 275" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="300" width="70" height="25" rx="8" fill="#333"/>
      <rect x="135" y="300" width="70" height="25" rx="8" fill="#333"/>
      <rect x="40" y="300" width="70" height="8" rx="4" fill="#FFF"/>
      <rect x="135" y="300" width="70" height="8" rx="4" fill="#FFF"/>
    </svg>`,
  },
];

async function ensureSeeded() {
  const count = await getCollection(ITEMS).countDocuments();
  if (count === 0 && SEED_ITEMS.length > 0) {
    await getCollection(ITEMS).insertMany(SEED_ITEMS.map(i => ({ ...i })));
  }
}

async function ensureTemplate() {
  const existing = await getCollection(TEMPLATE).findOne({ _id: "default" });
  if (!existing) {
    await getCollection(TEMPLATE).insertOne({ _id: "default", categories: DEFAULT_TEMPLATE });
  }
}

// ─── PUBLIC ──────────────────────────────────────────────────────

router.get("/categories", (_req, res) => {
  sendSuccess(res, { categories: CATEGORIES, layerOrder: LAYER_ORDER });
});

router.get("/items", async (_req, res, next) => {
  try {
    await ensureSeeded();
    await ensureTemplate();
    const items = await getCollection(ITEMS).find({}).sort({ category: 1, price: 1 }).toArray();
    const tmpl = await getCollection(TEMPLATE).findOne({ _id: "default" });
    sendSuccess(res, {
      items,
      categories: CATEGORIES,
      layerOrder: LAYER_ORDER,
      template: tmpl?.categories || DEFAULT_TEMPLATE,
    });
  } catch (e) { next(e); }
});

router.get("/template", async (_req, res, next) => {
  try {
    await ensureTemplate();
    const tmpl = await getCollection(TEMPLATE).findOne({ _id: "default" });
    sendSuccess(res, { template: tmpl?.categories || DEFAULT_TEMPLATE });
  } catch (e) { next(e); }
});

router.put("/template", authenticate, async (req, res, next) => {
  try {
    const { categories } = req.body || {};
    if (!categories || typeof categories !== "object") return sendError(res, "Thiếu categories", 400);
    await getCollection(TEMPLATE).updateOne(
      { _id: "default" },
      { $set: { categories } },
      { upsert: true }
    );
    sendSuccess(res, { template: categories });
  } catch (e) { next(e); }
});

router.get("/inventory", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { inventory: user.inventory || [] });
  } catch (e) { next(e); }
});

router.get("/loadout", authenticate, async (req, res, next) => {
  try {
    const user = await getCollection(USERS).findOne({ id: req.user.sub });
    if (!user) return sendError(res, "Không tìm thấy người dùng", 404);
    sendSuccess(res, { loadout: user.avatarLoadout || DEFAULT_LOADOUT });
  } catch (e) { next(e); }
});

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
    const { category, name, html, price, default: isDefault } = req.body || {};
    if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
    if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400);
    const item = {
      id: uid(), category, name: String(name).trim(), html: html || "",
      price: Math.max(0, Number(price) || 0), default: !!isDefault,
    };
    await getCollection(ITEMS).insertOne(item);
    sendCreated(res, item);
  } catch (e) { next(e); }
});

router.put("/admin/items/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await getCollection(ITEMS).findOne({ id });
    if (!existing) return sendError(res, "Item không tồn tại", 404);
    const { category, name, html, price, default: isDefault } = req.body || {};
    const updates = {};
    if (category !== undefined) { if (!CATEGORIES.find(c => c.id === category)) return sendError(res, "Category không hợp lệ", 400); updates.category = category; }
    if (name !== undefined) updates.name = String(name).trim();
    if (html !== undefined) updates.html = html;
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
      const { category, name, html, price, default: isDefault } = it || {};
      if (!category || !name) return sendError(res, "Thiếu category hoặc name", 400);
      if (!CATEGORIES.find(c => c.id === category)) return sendError(res, `Category không hợp lệ: ${category}`, 400);
      const item = {
        id: uid(), category, name: String(name).trim(), html: html || "",
        price: Math.max(0, Number(price) || 0), default: !!isDefault,
      };
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
