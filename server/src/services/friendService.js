import { getCollection } from "../db.js";
import { isBlockedBetween } from "./blockService.js";

// ── Bạn bè ────────────────────────────────────────────────────────────────
// Một document trong `friendships` cho MỖI CẶP người dùng (không lưu 2 chiều):
//   { id, requesterId, addresseeId, status: "PENDING" | "ACCEPTED",
//     gate: null | "sender" | "receiver", createdAt, updatedAt }
// - Gửi lời mời  → tạo doc PENDING.
// - Chấp nhận    → chuyển doc sang ACCEPTED.
// - Từ chối / thu hồi lời mời / hủy kết bạn → XÓA doc (hai người có thể gửi lại
//   lời mời sau này; không giữ trạng thái DECLINED để tránh kẹt quan hệ vĩnh viễn).
// Mọi truy vấn theo cặp luôn xét cả hai chiều requester/addressee.
//
// ── Cổng duyệt phụ huynh (đợt An toàn cho bé 2) ────────────────────────────
// Học sinh có cờ `users.friendApprovalRequired` (phụ huynh liên kết bật/tắt,
// mặc định TẮT — tắt thì luồng kết bạn y như cũ, doc luôn có gate: null).
// Khi cờ BẬT, lời mời PENDING bị GIỮ ở một cổng qua trường `gate`:
//   gate "sender"   — chờ phụ huynh của NGƯỜI GỬI duyệt; người nhận chưa
//                     thấy gì (không hiện trong lời mời đến, không chấp
//                     nhận được, quan hệ phía người nhận vẫn là "none").
//   gate "receiver" — chờ phụ huynh của NGƯỜI NHẬN duyệt; người nhận chưa
//                     thấy lời mời đến. Duyệt xong gate → null, lời mời mới
//                     thành lời mời đến bình thường để học sinh tự quyết.
// Cả hai phía cùng bật cờ → duyệt tuần tự: cổng "sender" trước, qua được
// mới sang cổng "receiver". Phụ huynh từ chối → XÓA doc lặng lẽ (người gửi
// không nhận thông báo bị phụ huynh từ chối).

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

/** Học sinh này có bật "phụ huynh duyệt kết bạn" không? (mặc định TẮT). */
export async function approvalRequired(userId) {
  if (!userId) return false;
  const user = await getCollection("users").findOne({ id: userId });
  return !!user?.friendApprovalRequired;
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
 *   "none" | "friends"
 *   | "pending_out"    (tôi đã gửi, đang chờ phía kia trả lời)
 *   | "pending_in"     (họ đã gửi, đang chờ tôi trả lời)
 *   | "pending_parent" (tôi đã gửi nhưng đang bị giữ chờ phụ huynh TÔI duyệt)
 * Lời mời đang bị giữ ở cổng của phía BÊN KIA thì phía mình coi như không
 * tồn tại ("none") — học sinh không thấy lời mời chưa qua duyệt.
 */
export async function getRelation(meId, otherId) {
  if (!otherId || meId === otherId) return { status: "none" };
  const doc = await findPair(meId, otherId);
  if (!doc) return { status: "none" };
  if (doc.status === "ACCEPTED") return { status: "friends", since: doc.updatedAt };
  if (doc.requesterId === meId) {
    return doc.gate === "sender"
      ? { status: "pending_parent", since: doc.createdAt }
      : { status: "pending_out", since: doc.createdAt };
  }
  if (doc.gate) return { status: "none" };
  return { status: "pending_in", since: doc.createdAt };
}

/**
 * Gửi lời mời kết bạn. Nếu phía bên kia ĐÃ gửi lời mời cho mình trước đó thì
 * lời mời này được hiểu là đồng ý → hai người thành bạn bè ngay (auto-accept),
 * tránh tình trạng hai lời mời chéo nhau kẹt ở PENDING mãi mãi.
 *
 * Cổng phụ huynh: nếu NGƯỜI GỬI bật cờ duyệt → doc bị giữ ở gate "sender";
 * nếu không mà NGƯỜI NHẬN bật cờ → giữ ở gate "receiver". Lời mời đang bị
 * giữ của phía kia thì lần gửi ngược chiều này KHÔNG được tự chấp nhận vòng
 * qua cổng (và cũng không tạo doc thứ hai) — trả heldForParent để route
 * biết đường không gửi thông báo thường.
 *
 * @returns {{ status: "PENDING" | "ACCEPTED", autoAccepted?: boolean,
 *             heldForParent?: boolean, gate?: null | "sender" | "receiver",
 *             alreadyHeld?: boolean }}
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
    if (existing.gate) {
      // Lời mời của phía kia đang chờ phụ huynh duyệt — không làm gì thêm.
      return { status: "PENDING", heldForParent: true, gate: existing.gate, alreadyHeld: true };
    }
    // Lời mời ngược chiều đang chờ → chấp nhận luôn.
    const now = new Date().toISOString();
    await getCollection(COLLECTION).updateOne(
      { _id: existing._id },
      { $set: { status: "ACCEPTED", updatedAt: now } }
    );
    return { status: "ACCEPTED", autoAccepted: true };
  }

  const gate = (await approvalRequired(fromId))
    ? "sender"
    : (await approvalRequired(toId))
      ? "receiver"
      : null;

  const now = new Date().toISOString();
  const doc = {
    _id: uid("frd"),
    id: uid("frd"),
    requesterId: fromId,
    addresseeId: toId,
    status: "PENDING",
    gate,
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return { status: "PENDING", heldForParent: !!gate, gate };
}

/**
 * Chấp nhận lời mời mà `fromId` đã gửi cho `meId`.
 * Chỉ chấp nhận được lời mời ĐÃ QUA CỔNG (gate: null) — lời mời đang bị
 * giữ chờ phụ huynh duyệt thì phía học sinh coi như không tồn tại.
 */
export async function acceptRequest(meId, fromId) {
  const doc = await getCollection(COLLECTION).findOne({
    requesterId: fromId, addresseeId: meId, status: "PENDING", gate: null,
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
    requesterId: fromId, addresseeId: meId, status: "PENDING", gate: null,
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
      return {
        user,
        since: d.status === "ACCEPTED" ? d.updatedAt : d.createdAt,
        gate: d.gate || null,
      };
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

/**
 * Lời mời NGƯỜI KHÁC gửi cho mình, đang chờ — chỉ tính lời mời ĐÃ QUA CỔNG
 * phụ huynh (gate: null; truy vấn `gate: null` của Mongo cũng khớp các doc
 * cũ chưa có trường gate). Lời mời đang bị giữ thì mình chưa được thấy.
 */
export function listIncoming(meId) {
  return listSide(
    meId,
    { addresseeId: meId, status: "PENDING", gate: null },
    (d) => d.requesterId
  );
}

/** Lời mời MÌNH đã gửi, đang chờ phía kia trả lời (gồm cả lời mời bị giữ). */
export function listOutgoing(meId) {
  return listSide(meId, { requesterId: meId, status: "PENDING" }, (d) => d.addresseeId);
}

/**
 * Toàn bộ quan hệ của mình trong một lần gọi — trang Tìm bạn dùng để vẽ nút bấm.
 * `outgoing` chỉ gồm lời mời đã rời khỏi cổng của mình; các lời mời đang bị
 * giữ chờ phụ huynh MÌNH duyệt nằm riêng ở `heldOutgoing` để giao diện hiện
 * trạng thái "Chờ phụ huynh duyệt" thay vì "Đang chờ phản hồi".
 */
export async function getOverview(meId) {
  const [friends, incoming, outgoingAll] = await Promise.all([
    listFriends(meId),
    listIncoming(meId),
    listOutgoing(meId),
  ]);
  return {
    friends,
    incoming,
    outgoing: outgoingAll.filter((x) => x.gate !== "sender"),
    heldOutgoing: outgoingAll.filter((x) => x.gate === "sender"),
  };
}

// ── Phía phụ huynh: duyệt lời mời bị giữ của con ──────────────────────────

/**
 * Điều kiện "lời mời đang chờ phụ huynh của `studentId` duyệt":
 * - con GỬI đi và đang giữ ở cổng người gửi (requester = con, gate "sender")
 * - hoặc gửi ĐẾN con và đang giữ ở cổng người nhận (addressee = con, gate "receiver")
 */
function parentGateQuery(studentId) {
  return {
    status: "PENDING",
    $or: [
      { requesterId: studentId, gate: "sender" },
      { addresseeId: studentId, gate: "receiver" },
    ],
  };
}

/**
 * Cho lời mời qua cổng hiện tại sau khi phụ huynh duyệt (hoặc khi cổng được
 * THẢ vì phụ huynh tắt công tắc / con không còn phụ huynh liên kết):
 * - Qua cổng "sender": nếu người nhận CŨNG bật cờ → chuyển sang giữ ở cổng
 *   "receiver" (stage "receiver"); không thì gate → null, lời mời thành lời
 *   mời đến bình thường phía người nhận (stage "visible").
 * - Qua cổng "receiver": gate → null (stage "visible").
 * Route dùng `stage` để gửi đúng thông báo (cho học sinh nhận, hoặc cho phụ
 * huynh phía bên kia).
 *
 * @returns {{ stage: "visible" | "receiver", request: object }}
 */
async function advanceGate(doc) {
  const col = getCollection(COLLECTION);
  const now = new Date().toISOString();
  if (doc.gate === "sender" && (await approvalRequired(doc.addresseeId))) {
    await col.updateOne({ _id: doc._id }, { $set: { gate: "receiver", updatedAt: now } });
    return { stage: "receiver", request: { ...doc, gate: "receiver", updatedAt: now } };
  }
  await col.updateOne({ _id: doc._id }, { $set: { gate: null, updatedAt: now } });
  return { stage: "visible", request: { ...doc, gate: null, updatedAt: now } };
}

/** Danh sách lời mời đang chờ phụ huynh của `studentId` duyệt (cả 2 chiều). */
export async function listParentPending(studentId) {
  const docs = await getCollection(COLLECTION)
    .find(parentGateQuery(studentId))
    .sort({ createdAt: 1 })
    .toArray();
  const others = await summariesByIds(
    docs.map((d) => (d.requesterId === studentId ? d.addresseeId : d.requesterId))
  );
  return docs
    .map((d) => {
      const outgoing = d.requesterId === studentId;
      const user = others.get(outgoing ? d.addresseeId : d.requesterId);
      if (!user) return null;
      return {
        id: d.id,
        direction: outgoing ? "outgoing" : "incoming",
        user,
        createdAt: d.createdAt,
      };
    })
    .filter(Boolean);
}

/** Phụ huynh duyệt MỘT lời mời đang giữ của con → cho qua cổng hiện tại. */
export async function parentApproveRequest(studentId, requestId) {
  const doc = await getCollection(COLLECTION).findOne({
    ...parentGateQuery(studentId),
    id: requestId,
  });
  if (!doc) throw new Error("Không tìm thấy lời mời đang chờ duyệt");
  return advanceGate(doc);
}

/**
 * Phụ huynh từ chối MỘT lời mời đang giữ của con → XÓA doc lặng lẽ.
 * Người gửi không nhận thông báo bị phụ huynh từ chối (route không gửi gì).
 */
export async function parentRejectRequest(studentId, requestId) {
  const res = await getCollection(COLLECTION).deleteOne({
    ...parentGateQuery(studentId),
    id: requestId,
  });
  if (res.deletedCount === 0) throw new Error("Không tìm thấy lời mời đang chờ duyệt");
  return { status: "none" };
}

/**
 * THẢ mọi lời mời đang giữ ở cổng của `studentId` về luồng bình thường
 * (dùng khi phụ huynh TẮT công tắc, hoặc con không còn phụ huynh liên kết
 * nào để duyệt). Trả về kết quả advanceGate từng lời mời để route gửi
 * thông báo tương ứng.
 */
export async function releaseHeldForStudent(studentId) {
  const docs = await getCollection(COLLECTION)
    .find(parentGateQuery(studentId))
    .toArray();
  const out = [];
  for (const doc of docs) out.push(await advanceGate(doc));
  return out;
}
