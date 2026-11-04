import { getCollection } from "../db.js";
import { isBlockedBetween } from "./blockService.js";

// ── Bạn bè ────────────────────────────────────────────────────────────────
// Một document trong `friendships` cho MỖI CẶP người dùng (không lưu 2 chiều):
//   { id, requesterId, addresseeId, status: "PENDING" | "ACCEPTED", createdAt, updatedAt }
// - Gửi lời mời  → tạo doc PENDING.
// - Chấp nhận    → chuyển doc sang ACCEPTED.
// - Từ chối / thu hồi lời mời / hủy kết bạn → XÓA doc (hai người có thể gửi lại
//   lời mời sau này; không giữ trạng thái DECLINED để tránh kẹt quan hệ vĩnh viễn).
// Mọi truy vấn theo cặp luôn xét cả hai chiều requester/addressee.

const COLLECTION = "friendships";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function pairQuery(a, b) {
  return {
    $or: [
      { requesterId: a, addresseeId: b },
      { requesterId: b, addresseeId: a },
    ],
  };
}

async function findPair(a, b) {
  return getCollection(COLLECTION).findOne(pairQuery(a, b));
}

/** Thông tin hiển thị tối thiểu của một người dùng — không lộ email/mật khẩu. */
export function friendSummary(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    avatarLoadout: user.avatarLoadout || null,
  };
}

async function summariesByIds(ids) {
  if (!ids.length) return new Map();
  const users = await getCollection("users").find({ id: { $in: ids } }).toArray();
  return new Map(users.map((u) => [u.id, friendSummary(u)]));
}

/**
 * Quan hệ giữa `meId` và `otherId`:
 *   "none" | "friends" | "pending_out" (tôi đã gửi) | "pending_in" (họ đã gửi)
 */
export async function getRelation(meId, otherId) {
  if (!otherId || meId === otherId) return { status: "none" };
  const doc = await findPair(meId, otherId);
  if (!doc) return { status: "none" };
  if (doc.status === "ACCEPTED") return { status: "friends", since: doc.updatedAt };
  return doc.requesterId === meId
    ? { status: "pending_out", since: doc.createdAt }
    : { status: "pending_in", since: doc.createdAt };
}

/**
 * Gửi lời mời kết bạn. Nếu phía bên kia ĐÃ gửi lời mời cho mình trước đó thì
 * lời mời này được hiểu là đồng ý → hai người thành bạn bè ngay (auto-accept),
 * tránh tình trạng hai lời mời chéo nhau kẹt ở PENDING mãi mãi.
 *
 * @returns {{ status: "PENDING" | "ACCEPTED", autoAccepted?: boolean }}
 */
export async function sendRequest(fromId, toId) {
  if (!toId) throw new Error("userId là bắt buộc");
  if (fromId === toId) throw new Error("Không thể kết bạn với chính mình");

  const target = await getCollection("users").findOne({ id: toId });
  if (!target) throw new Error("Người dùng không tồn tại");

  // Một trong hai phía đã chặn phía kia → không kết bạn lại được (thông báo
  // trung tính, không tiết lộ ai đã chặn ai — xem blockService).
  if (await isBlockedBetween(fromId, toId)) {
    throw new Error("Không thể gửi lời mời kết bạn cho người này");
  }

  const existing = await findPair(fromId, toId);
  if (existing) {
    if (existing.status === "ACCEPTED") throw new Error("Hai bạn đã là bạn bè");
    if (existing.requesterId === fromId) throw new Error("Bạn đã gửi lời mời cho người này rồi");
    // Lời mời ngược chiều đang chờ → chấp nhận luôn.
    const now = new Date().toISOString();
    await getCollection(COLLECTION).updateOne(
      { _id: existing._id },
      { $set: { status: "ACCEPTED", updatedAt: now } }
    );
    return { status: "ACCEPTED", autoAccepted: true };
  }

  const now = new Date().toISOString();
  const doc = {
    _id: uid("frd"),
    id: uid("frd"),
    requesterId: fromId,
    addresseeId: toId,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return { status: "PENDING" };
}

/** Chấp nhận lời mời mà `fromId` đã gửi cho `meId`. */
export async function acceptRequest(meId, fromId) {
  const doc = await getCollection(COLLECTION).findOne({
    requesterId: fromId, addresseeId: meId, status: "PENDING",
  });
  if (!doc) throw new Error("Không tìm thấy lời mời kết bạn");
  const now = new Date().toISOString();
  await getCollection(COLLECTION).updateOne(
    { _id: doc._id },
    { $set: { status: "ACCEPTED", updatedAt: now } }
  );
  return { status: "ACCEPTED" };
}

/** Từ chối lời mời mà `fromId` đã gửi cho `meId` (xóa doc). */
export async function declineRequest(meId, fromId) {
  const res = await getCollection(COLLECTION).deleteOne({
    requesterId: fromId, addresseeId: meId, status: "PENDING",
  });
  if (res.deletedCount === 0) throw new Error("Không tìm thấy lời mời kết bạn");
  return { status: "none" };
}

/** Thu hồi lời mời `meId` đã gửi cho `toId` (xóa doc). */
export async function cancelRequest(meId, toId) {
  const res = await getCollection(COLLECTION).deleteOne({
    requesterId: meId, addresseeId: toId, status: "PENDING",
  });
  if (res.deletedCount === 0) throw new Error("Không tìm thấy lời mời đã gửi");
  return { status: "none" };
}

/** Hủy kết bạn (xóa doc ACCEPTED của cặp, bất kể ai gửi trước). */
export async function unfriend(meId, otherId) {
  const res = await getCollection(COLLECTION).deleteOne({
    ...pairQuery(meId, otherId),
    status: "ACCEPTED",
  });
  if (res.deletedCount === 0) throw new Error("Hai bạn chưa phải là bạn bè");
  return { status: "none" };
}

// ── Danh sách ─────────────────────────────────────────────────────────────

async function listSide(meId, filter, pickOtherId) {
  const docs = await getCollection(COLLECTION)
    .find(filter)
    .sort({ updatedAt: -1 })
    .toArray();
  const others = await summariesByIds(docs.map(pickOtherId));
  return docs
    .map((d) => {
      const otherId = pickOtherId(d);
      const user = others.get(otherId);
      if (!user) return null;
      return { user, since: d.status === "ACCEPTED" ? d.updatedAt : d.createdAt };
    })
    .filter(Boolean);
}

/** Bạn bè đã kết nối (cả hai chiều). */
export function listFriends(meId) {
  return listSide(
    meId,
    { status: "ACCEPTED", $or: [{ requesterId: meId }, { addresseeId: meId }] },
    (d) => (d.requesterId === meId ? d.addresseeId : d.requesterId)
  );
}

/** Lời mời NGƯỜI KHÁC gửi cho mình, đang chờ. */
export function listIncoming(meId) {
  return listSide(meId, { addresseeId: meId, status: "PENDING" }, (d) => d.requesterId);
}

/** Lời mời MÌNH đã gửi, đang chờ phía kia trả lời. */
export function listOutgoing(meId) {
  return listSide(meId, { requesterId: meId, status: "PENDING" }, (d) => d.addresseeId);
}

/** Toàn bộ quan hệ của mình trong một lần gọi — trang Tìm bạn dùng để vẽ nút bấm. */
export async function getOverview(meId) {
  const [friends, incoming, outgoing] = await Promise.all([
    listFriends(meId),
    listIncoming(meId),
    listOutgoing(meId),
  ]);
  return { friends, incoming, outgoing };
}
