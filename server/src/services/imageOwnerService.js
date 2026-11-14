// Chủ sở hữu của ảnh thư viện (routes/images.js) — Nguyên chốt quy tắc
// ngày 2026-11-14 sau khi phát hiện GET /api/images trả MỌI ảnh cho MỌI
// user, kể cả ảnh không phải của họ.
//
// File ảnh thật nằm trên Cloudinary và được liệt kê thẳng từ Cloudinary
// (không có collection ảnh riêng), nên chủ sở hữu được ghi ở collection
// `imageOwners` dưới dạng ánh xạ publicId → user:
//   • Upload mới: route ghi chủ = user đang đăng nhập (source "upload").
//   • Ảnh KHÔNG có bản ghi = "chưa có chủ" — dữ liệu cũ từ trước cơ chế
//     này. Không bao giờ xoá/sửa ảnh vì thiếu bản ghi; chỉ khác quyền xem.
//   • Nút Đồng bộ (trang quản lý thư viện ảnh, chỉ admin): gán toàn bộ
//     ảnh chưa có chủ cho chính admin vừa bấm (source "sync").
//
// Quy tắc xem/xoá dùng chung một hàm canAccessImage:
//   • Ảnh đã có chủ → CHỈ chủ xem/xoá được (kể cả admin cũng không, trừ
//     khi admin chính là chủ).
//   • Ảnh chưa có chủ → CHỈ admin xem/xoá được.
import { getCollection } from "../db.js";

const COLLECTION = "imageOwners";

/** Id của user từ JWT payload (sub) — đồng nhất cách các route khác lấy. */
export function imageUserId(user) {
  return user?.sub || user?.id || null;
}

export function isImageAdmin(user) {
  return user?.role === "admin";
}

/**
 * User có được xem (và xoá) ảnh này không?
 * @param {string|null|undefined} ownerId chủ đã ghi, null/undefined = vô chủ
 */
export function canAccessImage(ownerId, user) {
  if (!ownerId) return isImageAdmin(user);
  return ownerId === imageUserId(user);
}

/** Map publicId → ownerId cho một lô publicId (chỉ gồm ảnh ĐÃ có chủ). */
export async function getImageOwners(publicIds) {
  const map = new Map();
  const ids = [...new Set((publicIds || []).filter(Boolean))];
  if (!ids.length) return map;
  const docs = await getCollection(COLLECTION)
    .find({ publicId: { $in: ids } })
    .project({ publicId: 1, ownerId: 1 })
    .toArray();
  for (const d of docs) map.set(d.publicId, d.ownerId);
  return map;
}

function ownerDoc(publicId, user, source, now) {
  return {
    id: publicId,
    publicId,
    ownerId: imageUserId(user),
    ownerUsername: user?.username || null,
    source,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Ghi chủ cho các ảnh CHƯA có chủ (không bao giờ ghi đè chủ hiện có —
 * $setOnInsert). Trả về số bản ghi thật sự được tạo.
 */
export async function claimImageOwners(publicIds, user, source = "upload") {
  const ids = [...new Set((publicIds || []).filter(Boolean))];
  if (!ids.length || !imageUserId(user)) return 0;
  const now = new Date().toISOString();
  const col = getCollection(COLLECTION);
  const result = await col.bulkWrite(
    ids.map((publicId) => ({
      updateOne: {
        filter: { publicId },
        update: { $setOnInsert: ownerDoc(publicId, user, source, now) },
        upsert: true,
      },
    })),
    { ordered: false }
  );
  return result.upsertedCount || 0;
}

/** Ghi chủ cho 1 ảnh vừa upload thành công. */
export async function recordImageOwner(publicId, user) {
  return claimImageOwners([publicId], user, "upload");
}

/** Gán toàn bộ ảnh chưa có chủ (trong lô publicId đã quét) cho admin bấm Đồng bộ. */
export async function claimUnownedImages(publicIds, user) {
  return claimImageOwners(publicIds, user, "sync");
}

/** Xoá bản ghi chủ sau khi ảnh đã bị xoá thật trên Cloudinary. */
export async function forgetImageOwners(publicIds) {
  const ids = [...new Set((publicIds || []).filter(Boolean))];
  if (!ids.length) return 0;
  const result = await getCollection(COLLECTION).deleteMany({ publicId: { $in: ids } });
  return result.deletedCount || 0;
}
