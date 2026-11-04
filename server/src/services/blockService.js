import { getCollection } from "../db.js";
import * as friendService from "./friendService.js";

// ── Chặn người dùng (an toàn cho bé) ──────────────────────────────────────
// Một document trong `userBlocks` cho MỖI HÀNH ĐỘNG chặn MỘT CHIỀU:
//   { id, blockerId, blockedId, createdAt }
// Khác `friendships` (quan hệ hai chiều), chặn là quyết định của MỘT phía:
//   - A chặn B → quan hệ bạn bè/lời mời giữa hai người bị dọn sạch (qua
//     friendService), và TỪ ĐÓ cả hai chiều đều không nhắn tin / kết bạn
//     được nữa — kể cả B chủ động — cho tới khi A tự bỏ chặn.
//   - Người bị chặn KHÔNG nhận thông báo nào; phía bị từ chối chỉ thấy lỗi
//     trung tính ("Không thể gửi…") giống như thao tác không khả dụng.
// Bỏ chặn chỉ gỡ bản ghi chặn — KHÔNG tự khôi phục bạn bè như trước.

const COLLECTION = "userBlocks";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/** Có ai trong hai người đã chặn người kia không? (dùng cho chat + kết bạn) */
export async function isBlockedBetween(a, b) {
  if (!a || !b || a === b) return false;
  const doc = await getCollection(COLLECTION).findOne({
    $or: [
      { blockerId: a, blockedId: b },
      { blockerId: b, blockedId: a },
    ],
  });
  return !!doc;
}

/** Bản ghi chặn do CHÍNH meId tạo với otherId (null nếu chưa chặn). */
export async function getOwnBlock(meId, otherId) {
  if (!otherId || meId === otherId) return null;
  return getCollection(COLLECTION).findOne({ blockerId: meId, blockedId: otherId });
}

/**
 * Chặn `otherId`. Trước khi ghi bản ghi chặn, dọn quan hệ bạn bè hiện có
 * qua friendService (đang là bạn → hủy kết bạn; lời mời đang treo ở một
 * trong hai chiều → thu hồi/từ chối) để hai phía không còn "nửa quan hệ"
 * nào sót lại. Lỗi dọn quan hệ được bỏ qua (ghi log) — việc chặn là hành
 * động an toàn, không được phép thất bại chỉ vì dọn dẹp lỗi.
 */
export async function blockUser(meId, otherId) {
  if (!otherId) throw new Error("userId là bắt buộc");
  if (meId === otherId) throw new Error("Không thể tự chặn chính mình");

  const target = await getCollection("users").findOne({ id: otherId });
  if (!target) throw new Error("Người dùng không tồn tại");

  const existing = await getOwnBlock(meId, otherId);
  if (existing) return { blocked: true, alreadyBlocked: true };

  try {
    const relation = await friendService.getRelation(meId, otherId);
    if (relation.status === "friends") await friendService.unfriend(meId, otherId);
    else if (relation.status === "pending_out") await friendService.cancelRequest(meId, otherId);
    else if (relation.status === "pending_in") await friendService.declineRequest(meId, otherId);
  } catch (e) {
    console.error("[blocks] Dọn quan hệ bạn bè khi chặn thất bại:", e.message);
  }

  const doc = {
    _id: uid("blk"),
    id: uid("blk"),
    blockerId: meId,
    blockedId: otherId,
    createdAt: new Date().toISOString(),
  };
  await getCollection(COLLECTION).insertOne(doc);
  return { blocked: true };
}

/** Bỏ chặn — chỉ gỡ bản ghi của chính mình, không khôi phục bạn bè cũ. */
export async function unblockUser(meId, otherId) {
  const res = await getCollection(COLLECTION).deleteOne({ blockerId: meId, blockedId: otherId });
  if (res.deletedCount === 0) throw new Error("Bạn chưa chặn người này");
  return { blocked: false };
}

/** Danh sách người MÌNH đã chặn, kèm thông tin hiển thị tối thiểu. */
export async function listBlocked(meId) {
  const docs = await getCollection(COLLECTION)
    .find({ blockerId: meId })
    .sort({ createdAt: -1 })
    .toArray();
  if (!docs.length) return [];
  const users = await getCollection("users")
    .find({ id: { $in: docs.map((d) => d.blockedId) } })
    .toArray();
  const byId = new Map(users.map((u) => [u.id, friendService.friendSummary(u)]));
  return docs
    .map((d) => {
      const user = byId.get(d.blockedId);
      if (!user) return null;
      return { user, since: d.createdAt };
    })
    .filter(Boolean);
}
