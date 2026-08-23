import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from "../db.js";
import { config } from "../config.js";

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
  return { id: user.id, username: user.username, email: user.email || null, name: user.name, role: user.role };
}

function normalizeRole(role) {
  if (role === "admin" || role === "student") return role;
  return "teacher";
}

export async function createUser({ username, email, password, name, role }) {
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

  const user = {
    id: uid("user"),
    username: uname,
    email: eml || null,
    name: displayName,
    role: normalizeRole(role),
    passwordHash: bcrypt.hashSync(pwd, 10),
    createdAt: new Date().toISOString(),
  };
  await getCollection(COLLECTION).insertOne(user);
  return publicUser(user);
}

export async function registerUser({ username, email, password, name }) {
  const user = await createUser({ username, email, password, name, role: "student" });
  // Auto-login: trả về token sau khi register
  const fullUser = await findByUsername(username);
  const token = signToken(fullUser);
  return { token, user };
}

export async function listUsers() {
  const docs = await getCollection(COLLECTION).find({}).sort({ createdAt: 1 }).toArray();
  return docs.map(({ _id, passwordHash, ...rest }) => rest);
}

export async function updateProfile(userId, { name, email, password, currentPassword }) {
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