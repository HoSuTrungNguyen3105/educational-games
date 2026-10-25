import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from "../db.js";
import { config } from "../config.js";
import { REDEEM_ACHIEVEMENTS, findRedeemAchievement } from "../config/redeemCatalog.js";
import { sanitizeAvatar, sanitizePet } from "../lib/outfitCatalog.js";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const COLLECTION = "users";

export async function findByUsername(username) {
  return getCollection(COLLECTION).findOne({ username: username.trim().toLowerCase() });
}

export async function findByEmail(email) {
  if (!email) return null;
  return getCollection(COLLECTION).findOne({ email: email.trim().toLowerCase() });
}

export async function verifyCredentials(identifier, password) {
  // Hỗ trợ đăng nhập bằng username hoặc email
  const user = await findByUsername(identifier) || await findByEmail(identifier);
  if (!user) return null;
  const ok = user.passwordHash && (await bcrypt.compare(password, user.passwordHash));
  return ok ? user : null;
}

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export function publicUser(user) {
  return {
    id: user.id, username: user.username, email: user.email || null,
    name: user.name, role: user.role, coins: user.coins || 0, stars: user.stars || 0,
    xp: user.xp || 0, level: levelFromXp(user.xp || 0),
    avatarLoadout: user.avatarLoadout || null, inventory: user.inventory || [],
    // Bộ đồ avatar + thú cưng chọn trong game "Tiệm thời trang cho Bé" /
    // "Tiệm thay đồ thú cưng". Client cũng cache bản này ở localStorage.
    avatar: user.avatar || null, pet: user.pet || null,
  };
}

function normalizeRole(role) {
  if (role === "admin" || role === "student") return role;
  return "teacher";
}

export async function createUser({ username, email, password, name, role, generatedPassword }) {
  const uname = String(username || "").trim().toLowerCase();
  const eml = String(email || "").trim().toLowerCase();
  const pwd = String(password || "");
  const displayName = String(name || "").trim();
  if (!uname || !pwd || !displayName) throw new Error("Thiếu tên đăng nhập, mật khẩu hoặc họ tên");
  if (pwd.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự");

  const exists = await findByUsername(uname);
  if (exists) throw new Error("Tên đăng nhập đã tồn tại");

  if (eml) {
    const emailExists = await findByEmail(eml);
    if (emailExists) throw new Error("Email đã được sử dụng");
  }

  const generated = String(generatedPassword || "").trim();

  const user = {
    id: uid("user"),
    username: uname,
    email: eml || null,
    name: displayName,
    role: normalizeRole(role),
    passwordHash: bcrypt.hashSync(pwd, 10),
    ...(generated && generated === pwd ? { generatedPassword: generated } : {}),
    createdAt: new Date().toISOString(),
  };
  await getCollection(COLLECTION).insertOne(user);
  return publicUser(user);
}

export async function registerUser({ username, email, password, name, generatedPassword }) {
  const user = await createUser({ username, email, password, name, role: "student", generatedPassword });
  // Auto-login: trả về token sau khi register
  const fullUser = await findByUsername(username);
  const token = signToken(fullUser);
  return { token, user };
}

export async function listUsers() {
  const docs = await getCollection(COLLECTION).find({}).sort({ createdAt: 1 }).toArray();
  const { getCollection: gc } = await import("../db.js");
  const classes = await gc("classes").find({}).toArray();
  const classMap = new Map(classes.map(c => [c.id, c]));
  return docs.map(({ _id, passwordHash, ...rest }) => {
    const cls = rest.classId ? classMap.get(rest.classId) : null;
    return {
      ...rest,
      generatedPassword: rest.generatedPassword || null,
      className: cls?.name || null,
      classCode: cls?.code || null,
    };
  });
}

export async function updateProfile(userId, { name, email, password, currentPassword, avatarLoadout, avatar, pet }) {
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");

  const updates = {};
  if (name) updates.name = String(name).trim();
  if (email) {
    const eml = String(email).trim().toLowerCase();
    if (eml !== (user.email || "")) {
      const emailExists = await findByEmail(eml);
      if (emailExists) throw new Error("Email đã được sử dụng");
    }
    updates.email = eml;
  }
  if (password) {
    if (password.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    if (!currentPassword) throw new Error("Vui lòng nhập mật khẩu hiện tại");
    const ok = user.passwordHash && (await bcrypt.compare(currentPassword, user.passwordHash));
    if (!ok) throw new Error("Mật khẩu hiện tại không đúng");
    updates.passwordHash = bcrypt.hashSync(password, 10);
    updates.generatedPassword = null;
  }
  if (avatarLoadout && typeof avatarLoadout === "object") {
    updates.avatarLoadout = avatarLoadout;
  }
  // Bộ đồ avatar / thú cưng: chỉ nhận id hợp lệ, `updatedAt` do server đóng dấu.
  const now = new Date().toISOString();
  const cleanAvatar = avatar === undefined ? undefined : sanitizeAvatar(avatar);
  const cleanPet = pet === undefined ? undefined : sanitizePet(pet);
  if (avatar !== undefined) {
    if (!cleanAvatar) throw new Error("Bộ đồ avatar không hợp lệ");
    updates.avatar = { ...cleanAvatar, updatedAt: now };
  }
  if (pet !== undefined) {
    if (!cleanPet) throw new Error("Bộ đồ thú cưng không hợp lệ");
    updates.pet = { ...cleanPet, updatedAt: now };
  }

  if (Object.keys(updates).length === 0) throw new Error("Không có gì để cập nhật");
  await getCollection(COLLECTION).updateOne({ id: userId }, { $set: updates });

  const updated = await getCollection(COLLECTION).findOne({ id: userId });
  return publicUser(updated);
}

export async function removeUser(id) {
  if (id === "user-001") throw new Error("Không thể xóa tài khoản quản trị mặc định");
  await getCollection(COLLECTION).deleteOne({ id });
  return true;
}

export async function resetPassword(userId, newPassword) {
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  const pwd = String(newPassword || "").trim();
  if (!pwd) throw new Error("Mật khẩu không được để trống");
  if (pwd.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
  await getCollection(COLLECTION).updateOne(
    { id: userId },
    { $set: { passwordHash: bcrypt.hashSync(pwd, 10), generatedPassword: null } }
  );
  return true;
}

export async function getCoins(userId) {
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  return user.coins || 0;
}

export async function addCoins(userId, amount) {
  if (typeof amount !== "number") throw new Error("amount must be a number");
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  const newCoins = Math.max(0, (user.coins || 0) + amount);
  await getCollection(COLLECTION).updateOne({ id: userId }, { $set: { coins: newCoins } });
  return newCoins;
}

export async function setCoins(userId, coins) {
  if (typeof coins !== "number" || coins < 0) throw new Error("coins must be a non-negative number");
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  await getCollection(COLLECTION).updateOne({ id: userId }, { $set: { coins } });
  return coins;
}

export async function updateUserRole(userId, newRole) {
  const role = normalizeRole(newRole);
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  if (user.id === "user-001") throw new Error("Không thể thay đổi vai trò tài khoản quản trị mặc định");
  await getCollection(COLLECTION).updateOne({ id: userId }, { $set: { role } });
  return publicUser({ ...user, role });
}

export async function updateUser(userId, { name, email, role }) {
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");

  const updates = {};
  if (name) updates.name = String(name).trim();
  if (email) {
    const eml = String(email).trim().toLowerCase();
    if (eml !== (user.email || "")) {
      const emailExists = await findByEmail(eml);
      if (emailExists) throw new Error("Email đã được sử dụng");
    }
    updates.email = eml;
  }
  if (role && user.id !== "user-001") {
    updates.role = normalizeRole(role);
  }

  if (Object.keys(updates).length === 0) throw new Error("Không có gì để cập nhật");
  await getCollection(COLLECTION).updateOne({ id: userId }, { $set: updates });

  const updated = await getCollection(COLLECTION).findOne({ id: userId });
  return publicUser(updated);
}

/** 1 sao = 20.000 coin (sao là đơn vị lớn hơn coin). */
export const STAR_TO_COIN_RATE = 20000;

// ── XP / Level ────────────────────────────────────────────────────────────
// Đồng nhất với XP_PER_LEVEL của miniGameService để hồ sơ không bị lệch.
export const XP_PER_LEVEL = 120;

/** Level = floor(xp / XP_PER_LEVEL) + 1 */
export function levelFromXp(xp) {
  return Math.floor(Math.max(0, Number(xp) || 0) / XP_PER_LEVEL) + 1;
}

/** XP cần để lên level tiếp theo (đã trừ phần XP của level hiện tại). */
export function xpIntoLevel(xp) {
  return Math.max(0, (Number(xp) || 0) % XP_PER_LEVEL);
}

export async function getXp(userId) {
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  const xp = user?.xp || 0;
  return { xp, level: levelFromXp(xp), xpIntoLevel: xpIntoLevel(xp), xpPerLevel: XP_PER_LEVEL };
}

/**
 * Cộng XP cho user và trả về mức tiến độ mới.
 * Trả về `awarded: 0` nếu amount không hợp lệ — XP chỉ được cấp ở server.
 */
export async function addXp(userId, amount) {
  const gained = Math.floor(Number(amount));
  if (!Number.isFinite(gained) || gained === 0) {
    return { awarded: 0, ...(await getXp(userId)) };
  }
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");

  const prevLevel = levelFromXp(user.xp || 0);
  const newXp = Math.max(0, (user.xp || 0) + gained);
  const newLevel = levelFromXp(newXp);

  await getCollection(COLLECTION).updateOne({ id: userId }, { $set: { xp: newXp } });

  return {
    awarded: gained,
    xp: newXp,
    level: newLevel,
    xpIntoLevel: xpIntoLevel(newXp),
    xpPerLevel: XP_PER_LEVEL,
    leveledUp: newLevel > prevLevel,
  };
}

/**
 * ── Wallet (coin + sao chung một API) ─────────────────────────────────────
 * Coin và sao trước đây nằm ở hai endpoint riêng (`/me/coins`, `/me/stars`);
 * gộp lại thành một vì mọi giao dịch (đổi sao ↔ coin, đổi thành tựu) đều chạm
 * cả hai loại tiền và cần được ghi trong một lần update.
 */
function walletFrom(user) {
  return { coins: user?.coins || 0, stars: user?.stars || 0 };
}

/**
 * @param {{coins?: number, stars?: number}} delta số cộng thêm (âm = trừ bớt)
 * @returns {Promise<{coins: number, stars: number}>} số dư mới
 */
export async function adjustWallet(userId, delta = {}) {
  const coins = Math.floor(Number(delta?.coins) || 0);
  const stars = Math.floor(Number(delta?.stars) || 0);
  if (coins === 0 && stars === 0) throw new Error("Thay đổi ví không hợp lệ");

  const col = getCollection(COLLECTION);
  const user = await col.findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  if (coins < 0 && (user.coins || 0) + coins < 0) throw new Error("Không đủ coin");
  if (stars < 0 && (user.stars || 0) + stars < 0) throw new Error("Không đủ sao");

  const inc = {};
  if (coins) inc.coins = coins;
  if (stars) inc.stars = stars;
  await col.updateOne({ id: userId }, { $inc: inc });
  return walletFrom(await col.findOne({ id: userId }));
}

/** amount bỏ trống = đổi toàn bộ số đang có. */
function clampAmount(raw, max) {
  if (raw === undefined || raw === null || raw === "") return max;
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : 0;
}

/**
 * Đổi qua lại giữa coin và sao theo tỷ giá STAR_TO_COIN_RATE.
 *coin → sao làm theo chẵn lần (coin lẻ giữ lại trong ví), sao → coin nhân thẳng.
 *
 * @param {"coinToStar"|"starToCoin"} direction
 * @returns {Promise<{coins:number, stars:number, spent:number, gained:number, kept:number}>}
 */
export async function exchangeWallet(userId, { direction, amount } = {}) {
  const col = getCollection(COLLECTION);
  const user = await col.findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");

  const toStar = direction === "coinToStar";
  const fromBalance = toStar ? user.coins || 0 : user.stars || 0;
  const wanted = clampAmount(amount, fromBalance);

  let spent;
  let gained;
  if (toStar) {
    if (wanted <= 0) throw new Error("Bạn không có coin để đổi");
    gained = Math.floor(wanted / STAR_TO_COIN_RATE);
    if (gained <= 0) {
      throw new Error(`Cần ${STAR_TO_COIN_RATE.toLocaleString("vi-VN")} coin để đổi được 1 sao`);
    }
    // Chỉ trừ đúng phần chẵn — coin lẻ vẫn nằm lại trong ví.
    spent = gained * STAR_TO_COIN_RATE;
  } else {
    if (wanted <= 0) throw new Error("Bạn không có sao để đổi");
    spent = wanted;
    gained = wanted * STAR_TO_COIN_RATE;
  }

  // Điều kiện $gte trên chính loại tiền đang trừ → two request song song
  // không thể cùng tiêu một số dư.
  const filter = { id: userId };
  filter[toStar ? "coins" : "stars"] = { $gte: spent };
  const inc = toStar
    ? { coins: -spent, stars: gained }
    : { stars: -spent, coins: gained };

  const res = await col.updateOne(filter, { $inc: inc });
  if (res.modifiedCount === 0) throw new Error("Số dư vừa thay đổi, vui lòng thử lại");

  const after = await col.findOne({ id: userId });
  return { ...walletFrom(after), spent, gained, kept: wanted - spent };
}

/**
 * Đổi sao lấy một thành tựu trong danh mục. Sao bị trừ vĩnh viễn, huy hiệu
 * lưu vào `user.achievements` (id + thời điểm đổi).
 */
export async function redeemAchievement(userId, achievementId) {
  const item = findRedeemAchievement(String(achievementId || ""));
  if (!item) throw new Error("Thành tựu không tồn tại");

  const col = getCollection(COLLECTION);
  const res = await col.updateOne(
    { id: userId, stars: { $gte: item.stars }, achievements: { $not: { $elemMatch: { id: item.id } } } },
    { $inc: { stars: -item.stars }, $push: { achievements: { id: item.id, at: new Date().toISOString() } } }
  );
  if (res.modifiedCount === 0) {
    const user = await col.findOne({ id: userId });
    if (!user) throw new Error("Không tìm thấy người dùng");
    if ((user.achievements || []).some((a) => a.id === item.id)) {
      throw new Error("Bạn đã sở hữu thành tựu này");
    }
    throw new Error(`Cần ${item.stars} sao để đổi "${item.title}"`);
  }

  const after = await col.findOne({ id: userId });
  return { ...walletFrom(after), achievement: item };
}

/** Đọc ví: số dư, tỷ giá, catalog + thành tựu đã đổi, trạng thái quà sao hôm nay. */
export async function getWallet(userId) {
  const user = await getCollection(COLLECTION).findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");
  const date = todayKey();
  return {
    ...walletFrom(user),
    rate: { starToCoin: STAR_TO_COIN_RATE },
    shop: REDEEM_ACHIEVEMENTS,
    achievements: (user.achievements || []).map((a) => ({ id: a.id, at: a.at })),
    dailyGift: { claimedToday: user.lastStarGiftOn === date, date },
  };
}

/** Quà ngày: ngẫu nhiên trong khoảng này (đổi ở đây nếu muốn cố định). */
export const DAILY_GIFT_MIN = 5;
export const DAILY_GIFT_MAX = 10;

/** Ngày UTC theo chuẩn YYYY-MM-DD — dùng làm mốc "đã nhận quà hôm nay". */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Tặng sao mỗi ngày, mỗi người 1 lần.
 *
 * Dùng `updateOne` có điều kiện `lastStarGiftOn != hôm nay` + `$inc` nên an toàn
 * kể cả khi gọi song song nhiều lần (chỉ 1 request nhận được quà).
 *
 * @returns {{claimed: boolean, alreadyClaimed?: boolean, amount?: number, stars: number, date: string}}
 */
export async function claimDailyStarGift(userId) {
  const col = getCollection(COLLECTION);
  const user = await col.findOne({ id: userId });
  if (!user) throw new Error("Không tìm thấy người dùng");

  const date = todayKey();
  if (user.lastStarGiftOn === date) {
    return { claimed: false, alreadyClaimed: true, stars: user.stars || 0, date };
  }

  const amount = DAILY_GIFT_MIN + Math.floor(Math.random() * (DAILY_GIFT_MAX - DAILY_GIFT_MIN + 1));
  const res = await col.updateOne(
    { id: userId, lastStarGiftOn: { $ne: date } },
    { $inc: { stars: amount }, $set: { lastStarGiftOn: date } }
  );

  if (res.modifiedCount === 0) {
    // Request song song đã " giành" quà trước → coi như đã nhận.
    const after = await col.findOne({ id: userId });
    return { claimed: false, alreadyClaimed: true, stars: after?.stars || 0, date };
  }

  const after = await col.findOne({ id: userId });
  return { claimed: true, amount, stars: after?.stars || 0, date };
}