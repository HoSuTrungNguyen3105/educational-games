import { getCollection } from "../db.js";

import { uid } from "../utils/id.js";

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

/**
 * Gắn thêm `studentCount` + `teacherName` vào doc lớp (chỉ THÊM field, giữ
 * nguyên shape cũ). Đã xác minh khoá join:
 *  - `users.classId` lưu `classes.id` (dạng "cls-..."), KHÔNG phải `_id` hay
 *    `code`: getClassStudents truy vấn users theo đúng classId route nhận
 *    (client truyền cls.id), route /join gọi setStudentClass(cls.id), và
 *    getStudentClass tra lớp bằng { id: user.classId }.
 *  - Sĩ số đếm đúng định nghĩa của getClassStudents: classId khớp + role
 *    "student".
 *  - `teacher_classes.classId` cũng lưu classes.id, `teacherId` lưu users.id.
 *    Lớp có thể có nhiều GV — lấy GV ĐẦU TIÊN theo thứ tự mapping và chỉ hiện
 *    tên người đó (teacherName = null khi lớp chưa có GV).
 */
async function enrichClasses(docs) {
  if (!docs || docs.length === 0) return docs;
  const classIds = docs.map((c) => c.id);

  const students = await getCollection("users")
    .find({ classId: { $in: classIds }, role: "student" })
    .project({ classId: 1 })
    .toArray();
  const countByClass = new Map();
  for (const s of students) {
    countByClass.set(s.classId, (countByClass.get(s.classId) || 0) + 1);
  }

  const mappings = await getCollection("teacher_classes")
    .find({ classId: { $in: classIds } })
    .toArray();
  const firstTeacherByClass = new Map();
  for (const m of mappings) {
    if (!firstTeacherByClass.has(m.classId)) firstTeacherByClass.set(m.classId, m.teacherId);
  }
  const teacherIds = [...new Set(mappings.map((m) => m.teacherId))];
  const nameByTeacherId = new Map();
  if (teacherIds.length > 0) {
    const teachers = await getCollection("users")
      .find({ id: { $in: teacherIds } })
      .project({ id: 1, name: 1 })
      .toArray();
    for (const t of teachers) nameByTeacherId.set(t.id, t.name);
  }

  return docs.map((c) => ({
    ...c,
    studentCount: countByClass.get(c.id) || 0,
    teacherName: nameByTeacherId.get(firstTeacherByClass.get(c.id)) || null,
  }));
}

export async function getClassById(id) {
  const doc = await getCollection("classes").findOne({ id });
  if (!doc) return doc;
  const [enriched] = await enrichClasses([doc]);
  return enriched;
}

export async function getClassByCode(code) {
  return getCollection("classes").findOne({ code });
}

export async function listClasses({ status, limit = 100 } = {}) {
  const query = {};
  if (status) query.status = status;
  const docs = await getCollection("classes").find(query).sort({ createdAt: -1 }).limit(limit).toArray();
  return enrichClasses(docs);
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

export async function getTeacherClasses(teacherId) {
  const mappings = await getCollection("teacher_classes").find({ teacherId }).toArray();
  if (mappings.length === 0) return [];
  const classIds = mappings.map(m => m.classId);
  const docs = await getCollection("classes").find({ id: { $in: classIds } }).toArray();
  // Cùng trang ClassManagement với nhánh admin (listClasses) — gắn cùng
  // studentCount/teacherName để GV xem lớp của mình cũng thấy sĩ số.
  return enrichClasses(docs);
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
