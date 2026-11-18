import { getCollection } from "../db.js";

const COLLECTION = "user_devices";

import { uid } from "../utils/id.js";

export async function registerDevice(userId, token, deviceType = "WEB") {
  const now = new Date().toISOString();
  const type = deviceType.toUpperCase();
  const coll = getCollection(COLLECTION);
  // Upsert NGUYÊN TỬ theo token (client gọi đăng ký từ nhiều nơi mỗi lần mở
  // app, find-then-insert kiểu cũ vừa đua vừa vỡ):
  // - Token đã có → rebind sang user HIỆN TẠI + bật lại isActive — nếu không,
  //   thiết bị dùng chung cứ nhận push của user đăng ký token đầu tiên.
  // - Token mới → chèn doc ĐẦY ĐỦ, gồm cả `id` (cùng giá trị với `_id`).
  //   Bản cũ THIẾU `id`: $jsonSchema bắt buộc field này và unique index
  //   { id: 1 } coi field thiếu là null → token mới đầu tiên chiếm null,
  //   MỌI token mới sau đó đụng null → E11000 → 500 ngay lần đầu truy cập.
  const deviceId = uid("dev");
  try {
    return await coll.findOneAndUpdate(
      { token },
      {
        $set: { userId, deviceType: type, isActive: true, updatedAt: now },
        $setOnInsert: { _id: deviceId, id: deviceId, token, createdAt: now },
      },
      { upsert: true, returnDocument: "after" }
    );
  } catch (e) {
    // Hai request đồng thời cùng chèn MỘT token mới: một request thắng,
    // request còn lại vẫn có thể đụng unique index ngay lúc chèn (E11000)
    // → rơi về đường cập nhật thường thay vì ném 500 cho client.
    if (e?.code !== 11000) throw e;
    await coll.updateOne(
      { token },
      { $set: { userId, deviceType: type, isActive: true, updatedAt: now } }
    );
    return coll.findOne({ token });
  }
}

export async function removeDevice(token) {
  const result = await getCollection(COLLECTION).deleteOne({ token });
  return result.deletedCount > 0;
}

export async function getDevicesByUser(userId) {
  return getCollection(COLLECTION).find({ userId, isActive: true }).toArray();
}

export async function getActiveTokensByUser(userId) {
  const devices = await getCollection(COLLECTION)
    .find({ userId, isActive: true })
    .toArray();
  return devices.map((d) => d.token);
}

export async function deactivateAllByUser(userId) {
  const now = new Date().toISOString();
  return getCollection(COLLECTION).updateMany(
    { userId },
    { $set: { isActive: false, updatedAt: now } }
  );
}
