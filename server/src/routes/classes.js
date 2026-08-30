import { Router } from "express";
import * as classService from "../services/classService.js";
import { verifyToken } from "../services/authService.js";
import { sendSuccess, sendCreated, sendError } from "../utils/response.js";

const r = Router();

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return sendError(res, "Unauthorized", 401);
  try { req.user = verifyToken(h.slice(7)); next(); } catch { sendError(res, "Invalid token", 401); }
}

function requireTeacher(req, res, next) {
  if (!["teacher", "admin"].includes(req.user.role)) return sendError(res, "Teacher only", 403);
  next();
}

// Create class (teacher)
r.post("/", auth, requireTeacher, async (req, res) => {
  try {
    const { name, code, schoolYear } = req.body;
    if (!name || !code) return sendError(res, "name và code là bắt buộc", 400);
    const cls = await classService.createClass({ name, code, schoolYear });
    await classService.assignTeacher(req.user.sub, cls.id);
    sendCreated(res, cls);
  } catch (e) { sendError(res, e.message, 400); }
});

// List classes (teacher sees own, admin sees all)
r.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const classes = await classService.listClasses();
      return sendSuccess(res, classes);
    }
    if (req.user.role === "teacher") {
      const classes = await classService.getTeacherClasses(req.user.sub);
      return sendSuccess(res, classes);
    }
    // Student: return own class if any
    const cls = await classService.getStudentClass(req.user.sub);
    sendSuccess(res, cls ? [cls] : []);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get class detail
r.get("/:id", auth, async (req, res) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    if (!cls) return sendError(res, "Không tìm thấy lớp", 404);
    sendSuccess(res, cls);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get class students
r.get("/:id/students", auth, async (req, res) => {
  try {
    const students = await classService.getClassStudents(req.params.id);
    sendSuccess(res, students);
  } catch (e) { sendError(res, e.message, 500); }
});

// Join class by code (student)
r.post("/join", auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return sendError(res, "code là bắt buộc", 400);
    const cls = await classService.getClassByCode(code);
    if (!cls) return sendError(res, "Mã lớp không hợp lệ", 404);
    if (cls.status !== "ACTIVE") return sendError(res, "Lớp đã đóng", 400);
    await classService.setStudentClass(req.user.sub, cls.id);
    sendSuccess(res, { classId: cls.id, className: cls.name, classCode: cls.code });
  } catch (e) { sendError(res, e.message, 500); }
});

// Update class (teacher)
r.put("/:id", auth, requireTeacher, async (req, res) => {
  try {
    const updated = await classService.updateClass(req.params.id, req.body);
    sendSuccess(res, updated);
  } catch (e) { sendError(res, e.message, 500); }
});

// Delete class (teacher)
r.delete("/:id", auth, requireTeacher, async (req, res) => {
  try {
    await classService.deleteClass(req.params.id);
    sendSuccess(res, { ok: true });
  } catch (e) { sendError(res, e.message, 500); }
});

export default r;
