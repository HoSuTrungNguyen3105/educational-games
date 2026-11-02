import { getCollection } from "../db.js";
import { getClassById, getStudentClass, getTeacherClasses } from "./classService.js";

// ── Lịch học / thời khóa biểu ─────────────────────────────────────────────
// Collection `scheduleEntries`, mỗi bản ghi là một buổi học LẶP THEO TUẦN:
//   { id, ownerId, scope: "personal" | "class", classId,
//     title, subject, weekday (1=Thứ 2 … 7=Chủ nhật, chuẩn ISO),
//     startTime "HH:MM", endTime "HH:MM", note, createdAt, updatedAt }
// - Lịch CÁ NHÂN: ownerId = chính người tạo, chỉ mình họ thấy.
// - Lịch LỚP: giáo viên (của lớp đó) hoặc admin tạo; mọi học sinh trong lớp
//   thấy được, học sinh không sửa được lịch lớp.
// Quyền sửa/xóa được kiểm tra ở service theo từng bản ghi — không chỉ ẩn UI.

const COLLECTION = "scheduleEntries";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

function cleanEntry(data = {}) {
  const title = String(data.title || "").trim();
  if (!title) throw httpError("Tiêu đề buổi học là bắt buộc", 400);
  const weekday = Number(data.weekday);
  if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) {
    throw httpError("weekday phải từ 1 (Thứ 2) đến 7 (Chủ nhật)", 400);
  }
  const startTime = String(data.startTime || "").trim();
  const endTime = String(data.endTime || "").trim();
  if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
    throw httpError("Giờ học phải có dạng HH:MM", 400);
  }
  if (endTime <= startTime) throw httpError("Giờ kết thúc phải sau giờ bắt đầu", 400);
  return {
    title,
    subject: data.subject ? String(data.subject).trim() : null,
    weekday,
    startTime,
    endTime,
    note: data.note ? String(data.note).trim() : null,
  };
}

/** user có quyền sửa/xóa bản ghi này không (chủ sở hữu, giáo viên của lớp, admin). */
async function canEdit(user, entry, teacherClassIds) {
  if (user.role === "admin") return true;
  if (entry.scope === "personal") return entry.ownerId === user.sub;
  // Lịch lớp: giáo viên dạy lớp đó (kể cả không phải người tạo) hoặc người tạo.
  if (entry.ownerId === user.sub) return true;
  return teacherClassIds ? teacherClassIds.has(entry.classId) : false;
}

async function teacherClassIdSet(user) {
  if (user.role !== "teacher") return new Set();
  const classes = await getTeacherClasses(user.sub).catch(() => []);
  return new Set((classes || []).map((c) => c.id));
}

export async function createEntry(user, data = {}) {
  const fields = cleanEntry(data);
  const scope = data.classId ? "class" : "personal";

  let classId = null;
  if (scope === "class") {
    classId = String(data.classId);
    const cls = await getClassById(classId).catch(() => null);
    if (!cls) throw httpError("Không tìm thấy lớp học", 404);
    if (user.role !== "admin") {
      const mine = await teacherClassIdSet(user);
      if (!mine.has(classId)) throw httpError("Bạn không dạy lớp này", 403);
    }
  }

  const now = new Date().toISOString();
  const doc = {
    _id: uid("sch"),
    id: uid("sch"),
    ownerId: user.sub,
    scope,
    classId,
    ...fields,
    createdAt: now,
    updatedAt: now,
  };
  await getCollection(COLLECTION).insertOne(doc);
  return annotate(user, doc, null, new Set());
}

/** Gắn thêm className + canEdit để client vẽ đúng (không lộ dữ liệu thừa). */
async function annotate(user, entry, classNameMap, teacherIds) {
  let className = null;
  if (entry.classId) {
    if (classNameMap?.has(entry.classId)) className = classNameMap.get(entry.classId);
    else {
      const cls = await getClassById(entry.classId).catch(() => null);
      className = cls?.name || null;
    }
  }
  return { ...entry, className, canEdit: await canEdit(user, entry, teacherIds) };
}

/**
 * Lịch tuần của người đang đăng nhập: lịch cá nhân của mình + lịch lớp của
 * lớp mình học (học sinh) / các lớp mình dạy (giáo viên).
 */
export async function listForUser(user) {
  const col = getCollection(COLLECTION);
  const teacherIds = await teacherClassIdSet(user);
  const classIds = new Set(teacherIds);

  if (user.role === "student") {
    const myClass = await getStudentClass(user.sub).catch(() => null);
    if (myClass?.id) classIds.add(myClass.id);
  }

  const or = [{ ownerId: user.sub, scope: "personal" }];
  if (classIds.size) or.push({ scope: "class", classId: { $in: [...classIds] } });
  if (user.role === "admin") or.push({ scope: "class" });

  const docs = await col.find({ $or: or }).toArray();

  // Tên lớp dùng chung cho cả danh sách — tra một lần.
  const nameMap = new Map();
  const distinctClassIds = [...new Set(docs.map((d) => d.classId).filter(Boolean))];
  for (const cid of distinctClassIds) {
    const cls = await getClassById(cid).catch(() => null);
    if (cls) nameMap.set(cid, cls.name);
  }

  const out = [];
  for (const doc of docs) out.push(await annotate(user, doc, nameMap, teacherIds));
  out.sort((a, b) => a.weekday - b.weekday || (a.startTime < b.startTime ? -1 : 1));
  return out;
}

export async function updateEntry(user, id, data = {}) {
  const col = getCollection(COLLECTION);
  const entry = await col.findOne({ id });
  if (!entry) throw httpError("Không tìm thấy buổi học", 404);
  const teacherIds = await teacherClassIdSet(user);
  if (!(await canEdit(user, entry, teacherIds))) {
    throw httpError("Bạn không có quyền sửa buổi học này", 403);
  }
  const fields = cleanEntry({ ...entry, ...data });
  const now = new Date().toISOString();
  await col.updateOne({ id }, { $set: { ...fields, updatedAt: now } });
  const updated = await col.findOne({ id });
  return annotate(user, updated, null, teacherIds);
}

export async function deleteEntry(user, id) {
  const col = getCollection(COLLECTION);
  const entry = await col.findOne({ id });
  if (!entry) throw httpError("Không tìm thấy buổi học", 404);
  const teacherIds = await teacherClassIdSet(user);
  if (!(await canEdit(user, entry, teacherIds))) {
    throw httpError("Bạn không có quyền xóa buổi học này", 403);
  }
  await col.deleteOne({ id });
  return { ok: true };
}
