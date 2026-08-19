import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCollection } from "../db.js";
import { uid } from "./gameService.js";
import { config } from "../config.js";

const COLLECTION = "users";

export async function findByUsername(username) {
  return getCollection(COLLECTION).findOne({ username: username.trim().toLowerCase() });
}

export async function verifyCredentials(username, password) {
  const user = await findByUsername(username);
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
  return { id: user.id, username: user.username, name: user.name, role: user.role };
}

function normalizeRole(role) {
  if (role === "admin" || role === "student") return role;
  return "teacher";
}

export async function createUser({ username, password, name, role }) {
  const uname = String(username || "").trim().toLowerCase();
  const pwd = String(password || "");
  const displayName = String(name || "").trim();
  if (!uname || !pwd || !displayName) throw new Error("Thiếu tên đăng nhập, mật khẩu hoặc họ tên");
  if (pwd.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự");

  const exists = await findByUsername(uname);
  if (exists) throw new Error("Tên đăng nhập đã tồn tại");

  const user = {
    id: uid("user"),
    username: uname,
    name: displayName,
    role: normalizeRole(role),
    passwordHash: bcrypt.hashSync(pwd, 10),
    createdAt: new Date().toISOString(),
  };
  await getCollection(COLLECTION).insertOne(user);
  return publicUser(user);
}

export async function listUsers() {
  const docs = await getCollection(COLLECTION).find({}).sort({ createdAt: 1 }).toArray();
  return docs.map(({ _id, passwordHash, ...rest }) => rest);
}

export async function removeUser(id) {
  if (id === "user-001") throw new Error("Không thể xóa tài khoản quản trị mặc định");
  await getCollection(COLLECTION).deleteOne({ id });
  return true;
}