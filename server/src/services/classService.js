import { getCollection } from "../db.js";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ── Class CRUD ──

export async function createClass({ name, code, schoolYear }) {
  const existing = await getCollection("classes").findOne({ code });
  if (existing) throw new Error("Mã lớp đã tồn tại");
  const now = new Date().toISOString();
  const doc = {
    _id: uid("cls"),
    id: uid("cls"),
    name,
    code,
    schoolYear: schoolYear || null,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };
  await getCollection("classes").insertOne(doc);
  return doc;
}

export async function getClassById(id) {
  return getCollection("classes").findOne({ id });
}

export async function getClassByCode(code) {
  return getCollection("classes").findOne({ code });
}

export async function listClasses({ status, limit = 100 } = {}) {
  const query = {};
  if (status) query.status = status;
  return getCollection("classes").find(query).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function updateClass(id, data = {}) {
  const now = new Date().toISOString();
  const updates = { ...data, updatedAt: now };
  await getCollection("classes").updateOne({ id }, { $set: updates });
  return getClassById(id);
}

export async function deleteClass(id) {
  await getCollection("classes").deleteOne({ id });
  // Also remove teacher_class mappings
  await getCollection("teacher_classes").deleteMany({ classId: id });
  return true;
}

// ── TeacherClass ──

export async function assignTeacher(teacherId, classId) {
  const existing = await getCollection("teacher_classes").findOne({ teacherId, classId });
  if (existing) return existing;
  const now = new Date().toISOString();
  const doc = {
    _id: uid("tc"),
    id: uid("tc"),
    teacherId,
    classId,
    createdAt: now,
  };
  await getCollection("teacher_classes").insertOne(doc);
  return doc;
}

export async function removeTeacher(teacherId, classId) {
  await getCollection("teacher_classes").deleteOne({ teacherId, classId });
  return true;
}

export async function getTeacherClasses(teacherId) {
  const mappings = await getCollection("teacher_classes").find({ teacherId }).toArray();
  if (mappings.length === 0) return [];
  const classIds = mappings.map(m => m.classId);
  return getCollection("classes").find({ id: { $in: classIds } }).toArray();
}

export async function getClassTeachers(classId) {
  const mappings = await getCollection("teacher_classes").find({ classId }).toArray();
  if (mappings.length === 0) return [];
  const teacherIds = mappings.map(m => m.teacherId);
  return getCollection("users").find({ id: { $in: teacherIds } }).project({ passwordHash: 0 }).toArray();
}

// ── Students in class ──

export async function getClassStudents(classId) {
  return getCollection("users").find({ classId, role: "student" }).project({ passwordHash: 0 }).toArray();
}

export async function getStudentClass(studentId) {
  const user = await getCollection("users").findOne({ id: studentId });
  if (!user?.classId) return null;
  return getCollection("classes").findOne({ id: user.classId });
}

export async function setStudentClass(studentId, classId) {
  await getCollection("users").updateOne({ id: studentId }, { $set: { classId } });
  return true;
}

/** Giáo viên có phải giáo viên được phân vào lớp này không (teacher_classes). */
export async function isClassTeacher(teacherId, classId) {
  const mapping = await getCollection("teacher_classes").findOne({ teacherId, classId });
  return !!mapping;
}

/**
 * Gỡ học sinh khỏi lớp. Tư cách thành viên lớp chỉ nằm ở `users.classId`
 * (getClassStudents truy vấn theo field đó, không có collection roster riêng)
 * nên gỡ = đặt classId về null — đúng chiều ngược của setStudentClass.
 * An toàn dữ liệu: KHÔNG xoá tài khoản, KHÔNG đụng vào bài đã nộp
 * (submissions tra theo assignmentId/studentId, không phụ thuộc classId).
 */
export async function removeStudentFromClass(studentId, classId) {
  const user = await getCollection("users").findOne({ id: studentId });
  if (!user || user.role !== "student") throw new Error("Không tìm thấy học sinh");
  if (user.classId !== classId) throw new Error("Học sinh không thuộc lớp này");
  await getCollection("users").updateOne({ id: studentId }, { $set: { classId: null } });
  return true;
}
