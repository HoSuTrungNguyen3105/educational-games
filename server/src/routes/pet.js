// routes/pet.js
//
// API thú cưng. Mọi route đều yêu cầu đăng nhập.
//
//   GET    /api/pet/catalog        danh mục loài / màu / trang phục (đã lọc theo cấp)
//   GET    /api/pet                 pet hiện tại + `look` (tự tạo nếu chưa có)
//   PUT    /api/pet                 đổi tên / loài / màu / trang phục legacy
//   POST   /api/pet/exp             cộng EXP khi trả lời đúng (game gọi)
//   POST   /api/pet/mood            đổi tâm tính
//   POST   /api/pet/reset           đặt lại mặc định
//
//   Diện mạo MÀ APP VẼ là `look` — bộ đồ DressUp lưu trong hồ sơ (`users.pet`),
//   cùng nguồn với modal "Tùy chỉnh Thú cưng" ở trang Profile và game
//   "Tiệm thay đồ thú cưng". Muốn đổi thì PUT /api/auth/me { pet }; GET /api/pet
//   chỉ việc đọc về kèm.
//
//   ── Admin (giáo viên + quản trị) ───────────────────────────────────────
//   GET    /api/pet/admin/catalog        toàn bộ danh mục + số pet đang dùng
//   POST   /api/pet/admin/:kind          thêm loài / màu / trang phục
//   PUT    /api/pet/admin/:kind/:id      sửa
//   DELETE /api/pet/admin/:kind/:id      xoá (tự dọn pet đang dùng)
//   POST   /api/pet/admin/reset-catalog  khôi phục danh mục mặc định

import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { sendSuccess, sendError } from "../utils/response.js";
import * as petService from "../services/petService.js";
import * as catalog from "../services/petCatalog.js";

const router = Router();

// GET /api/pet/catalog đã bị gỡ: danh mục pet (loài / màu / trang phục) nằm sẵn
// trong `CATALOG_FALLBACK` của `src/lib/petApi.js` nên app không cần gọi mạng.
// API chỉ còn phần "diện mạo của bé" (GET/PUT /api/pet).

router.use(authenticate);

// GET /api/pet
router.get("/", async (req, res, next) => {
  try {
    const pet = await petService.getByUser(req.user.sub);
    // `look` = bộ đồ DressUp trong hồ sơ — diện mạo thật mà app vẽ.
    sendSuccess(res, petService.serialize(pet, await petService.getLook(req.user.sub)));
  } catch (e) {
    next(e);
  }
});

// PUT /api/pet — cập nhật diện mạo
router.put("/", async (req, res, next) => {
  try {
    const result = await petService.updateLook(req.user.sub, req.body || {});
    if (!result.ok) {
      return sendError(res, result.errors?.join("; ") || "Dữ liệu không hợp lệ", 400);
    }
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/exp — game gọi sau mỗi câu trả lời
router.post("/exp", async (req, res, next) => {
  try {
    const { amount, correct, wrong } = req.body || {};
    const result = await petService.addExp(
      req.user.sub,
      Number(amount) || 0,
      { correct: Number(correct) || 0, wrong: Number(wrong) || 0 }
    );
    sendSuccess(res, result);
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/mood
router.post("/mood", async (req, res, next) => {
  try {
    const result = await petService.setMood(req.user.sub, req.body?.mood);
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "mood không hợp lệ", 400);
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/reset
router.post("/reset", async (req, res, next) => {
  try {
    const result = await petService.reset(req.user.sub);
    sendSuccess(res, result.pet);
  } catch (e) {
    next(e);
  }
});

// ─── ADMIN: quản lý danh mục ────────────────────────────────────────────

const adminOnly = [authenticate, requireRoles("teacher", "admin")];

/**
 * Toàn bộ danh mục cho trang admin, kèm `usage` = số pet đang dùng mỗi mục
 * để admin biết xoá đi sẽ ảnh hưởng bao nhiêu người trước khi bấm nút.
 */
router.get("/admin/catalog", ...adminOnly, async (_req, res, next) => {
  try {
    await catalog.ensureLoaded();
    const [species, colors, outfits] = [
      catalog.listSpecies(),
      catalog.listColors(),
      catalog.listOutfits(),
    ];

    const usage = {};
    for (const s of species) usage[`species:${s.id}`] = await catalog.countPetsUsing("species", s.id);
    for (const c of colors) usage[`color:${c.id}`] = await catalog.countPetsUsing("color", c.id);
    for (const o of outfits) usage[`outfit:${o.id}`] = await catalog.countPetsUsing("outfit", o.id);

    sendSuccess(res, {
      species, colors, outfits,
      slots: catalog.SLOTS,
      slotLabels: catalog.SLOT_LABEL,
      moods: catalog.MOOD_LIST,
      usage,
    });
  } catch (e) { next(e); }
});

/** Khôi phục danh mục mặc định — xoá sạch collection rồi seed lại. */
router.post("/admin/reset-catalog", ...adminOnly, async (_req, res, next) => {
  try {
    const result = await catalog.resetToSeed();
    sendSuccess(res, result);
  } catch (e) { next(e); }
});

// Đặt TRƯỚC `/:kind/:id` để "reset-catalog" không bị nuốt vào :kind.
router.post("/admin/:kind", ...adminOnly, async (req, res, next) => {
  try {
    const result = await catalog.createItem(req.params.kind, req.body || {});
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "Không tạo được", 400);
    sendSuccess(res, result.item);
  } catch (e) { next(e); }
});

router.put("/admin/:kind/:id", ...adminOnly, async (req, res, next) => {
  try {
    const result = await catalog.updateItem(req.params.kind, req.params.id, req.body || {});
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "Không cập nhật được", 400);
    sendSuccess(res, result.item);
  } catch (e) { next(e); }
});

router.delete("/admin/:kind/:id", ...adminOnly, async (req, res, next) => {
  try {
    const result = await catalog.deleteItem(req.params.kind, req.params.id);
    if (!result.ok) return sendError(res, result.errors?.join("; ") || "Không xoá được", 400);
    sendSuccess(res, { deleted: req.params.id, affectedPets: result.affectedPets || 0 });
  } catch (e) { next(e); }
});

export default router;
