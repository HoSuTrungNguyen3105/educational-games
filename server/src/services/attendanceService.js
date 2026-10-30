/**
 * attendanceService.js — chấm công (collection `attendance`).
 *
 * Mỗi bản ghi là MỘT ngày của MỘT người dùng: { userId, date "YYYY-MM-DD",
 * status }. (userId, date) là duy nhất ⇒ chấm lại cùng ngày là cập nhật, không
 * tạo bản ghi thứ hai.
 *
 * status: "present" (đi học) | "absent" (nghỉ) | "late" (muộn) — đúng bộ mà
 * AttendanceCalendar.jsx trên client hiển thị.
 */
import { getCollection } from "../db.js";

const COLL = "attendance";
const uid = () => "att-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const ATTENDANCE_STATUSES = ["present", "absent", "late"];
/** Học sinh tự chấm chỉ được hai trạng thái này (không tự đánh dấu mình nghỉ). */
export const SELF_STATUSES = ["present", "late"];

/** Hôm nay theo giờ Việt Nam — server có thể chạy ở múi giờ khác. */
export function todayDate(now = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
  } catch {
    // Bản Node nhỏ không có dữ liệu múi giờ (small-icu) ⇒ cộng tay UTC+7.
    return new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
  }
}

/** "2026-10-30T09:12:00Z" / "2026/10/3" / Date → "YYYY-MM-DD"; sai → null. */
export function normalizeDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : todayDate(value);
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const m = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null; // 2026-02-30…
  return `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** "2026-10" / 2026 → "^2026-10" / "^2026" để lọc date bằng regex. */
function datePrefix({ month, year } = {}) {
  const m = normalizeMonth(month);
  if (m) return `^${m}`;
  const y = String(year ?? "").trim();
  if (/^\d{4}$/.test(y)) return `^${y}`;
  return null;
}

export function normalizeMonth(month) {
  const raw = String(month ?? "").trim();
  const m = raw.match(/^(\d{4})[-/](\d{1,2})$/);
  if (!m) return null;
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  return `${m[1]}-${String(mo).padStart(2, "0")}`;
}

const clean = (doc) => {
  if (!doc) return null;
  const rest = { ...doc };
  delete rest._id; // id của API là field `id`, không lộ ObjectId của Mongo
  return rest;
};

export async function getRecordById(id) {
  return clean(await getCollection(COLL).findOne({ id: String(id || "") }));
}

/**
 * Chấm công một ngày của một người dùng (upsert theo userId + date).
 * @returns {Promise<{record: Object, created: boolean}>}
 */
export async function saveRecord({ userId, date, status, notes, source, updatedBy }) {
  if (!userId) throw new Error("Thiếu học sinh cần chấm công");
  if (!ATTENDANCE_STATUSES.includes(status)) throw new Error("Trạng thái không hợp lệ");
  const d = normalizeDate(date);
  if (!d) throw new Error("Ngày chấm công không hợp lệ (YYYY-MM-DD)");

  const now = new Date().toISOString();
  const existing = await getCollection(COLL).findOne({ userId, date: d });
  const noteText = typeof notes === "string" ? notes.trim() : notes && Object.keys(notes).length ? notes : "";

  if (existing) {
    const patch = { status, notes: noteText, source, updatedBy, updatedAt: now };
    await getCollection(COLL).updateOne({ id: existing.id }, { $set: patch });
    return { record: clean({ ...existing, ...patch }), created: false };
  }

  const doc = {
    id: uid(),
    userId,
    date: d,
    status,
    notes: noteText,
    source,
    updatedBy: updatedBy || userId,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await getCollection(COLL).insertOne(doc);
  } catch (e) {
    // Index unique (userId, date) chặn: hai request chấm công cùng lúc → ghi lại
    // theo bản ghi vừa được tạo thay vì báo lỗi với người dùng.
    if (e?.code !== 11000) throw e;
    const patch = { status, notes: noteText, source, updatedBy, updatedAt: new Date().toISOString() };
    await getCollection(COLL).updateOne({ userId, date: d }, { $set: patch });
    return { record: clean({ ...doc, ...patch }), created: false };
  }
  return { record: clean(doc), created: true };
}

export async function listByUser(userId, { month, year } = {}) {
  const query = { userId };
  const prefix = datePrefix({ month, year });
  if (prefix) query.date = { $regex: prefix };
  const docs = await getCollection(COLL).find(query).sort({ date: -1 }).limit(1000).toArray();
  return docs.map(clean);
}

/** Lịch chấm công của cả lớp trong một tháng (kèm tên học sinh để UI hiển thị). */
export async function listByClass(classId, { month, year } = {}) {
  const students = await getCollection("users")
    .find({ classId, role: "student" })
    .project({ _id: 0, id: 1, name: 1, username: 1 })
    .toArray();
  if (students.length === 0) return [];
  const query = { userId: { $in: students.map((s) => s.id) } };
  const prefix = datePrefix({ month, year });
  if (prefix) query.date = { $regex: prefix };
  const docs = await getCollection(COLL).find(query).sort({ date: -1, userId: 1 }).limit(5000).toArray();
  const nameOf = new Map(students.map((s) => [s.id, s.name || s.username || s.id]));
  return docs.map((doc) => ({ ...clean(doc), userName: nameOf.get(doc.userId) || null }));
}

/** Thống kê một tháng: số ngày đi học/nghỉ/muộn + tỉ lệ chuyên cần. */
export async function getMonthlyStats(userId, month) {
  const m = normalizeMonth(month);
  const records = await listByUser(userId, m ? { month: m } : {});
  const count = (s) => records.filter((r) => r.status === s).length;
  const present = count("present");
  const late = count("late");
  const absent = count("absent");
  const total = records.length;
  return {
    userId,
    month: m || null,
    total,
    present,
    late,
    absent,
    rate: total ? Math.round(((present + late) / total) * 1000) / 10 : 0,
    records,
  };
}

const EDITABLE = ["status", "notes", "date"];

export async function updateRecord(id, data = {}, { updatedBy = null } = {}) {
  const existing = await getCollection(COLL).findOne({ id: String(id || "") });
  if (!existing) return null;
  const patch = {};
  for (const k of EDITABLE) {
    if (data[k] === undefined) continue;
    patch[k] = k === "date" ? normalizeDate(data[k]) : k === "status" ? String(data[k]).trim() : data[k];
  }
  if (patch.status && !ATTENDANCE_STATUSES.includes(patch.status)) throw new Error("Trạng thái không hợp lệ");
  if (data.date !== undefined && !patch.date) throw new Error("Ngày chấm công không hợp lệ (YYYY-MM-DD)");
  patch.updatedAt = new Date().toISOString();
  if (updatedBy) patch.updatedBy = updatedBy;
  await getCollection(COLL).updateOne({ id: existing.id }, { $set: patch });
  return clean({ ...existing, ...patch });
}

export async function deleteRecord(id) {
  const res = await getCollection(COLL).deleteOne({ id: String(id || "") });
  return res.deletedCount > 0;
}
