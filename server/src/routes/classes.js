import { Router } from "express";
import * as classService from "../services/classService.js";
import { verifyToken } from "../services/authService.js";

const r = Router();

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try { req.user = verifyToken(h.slice(7)); next(); } catch { res.status(401).json({ error: "Invalid token" }); }
}

function requireTeacher(req, res, next) {
  if (!["teacher", "admin"].includes(req.user.role)) return res.status(403).json({ error: "Teacher only" });
  next();
}

// Create class (teacher)
r.post("/", auth, requireTeacher, async (req, res) => {
  try {
    const { name, code, schoolYear } = req.body;
    if (!name || !code) return res.status(400).json({ error: "name và code là bắt buộc" });
    const cls = await classService.createClass({ name, code, schoolYear });
    await classService.assignTeacher(req.user.id, cls.id);
    res.status(201).json(cls);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// List classes (teacher sees own, admin sees all)
r.get("/", auth, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const classes = await classService.listClasses();
      return res.json(classes);
    }
    if (req.user.role === "teacher") {
      const classes = await classService.getTeacherClasses(req.user.id);
      return res.json(classes);
    }
    // Student: return own class if any
    const cls = await classService.getStudentClass(req.user.id);
    res.json(cls ? [cls] : []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get class detail
r.get("/:id", auth, async (req, res) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    if (!cls) return res.status(404).json({ error: "Không tìm thấy lớp" });
    res.json(cls);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get class students
r.get("/:id/students", auth, async (req, res) => {
  try {
    const students = await classService.getClassStudents(req.params.id);
    res.json(students);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Join class by code (student)
r.post("/join", auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "code là bắt buộc" });
    const cls = await classService.getClassByCode(code);
    if (!cls) return res.status(404).json({ error: "Mã lớp không hợp lệ" });
    if (cls.status !== "ACTIVE") return res.status(400).json({ error: "Lớp đã đóng" });
    await classService.setStudentClass(req.user.id, cls.id);
    res.json(cls);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Update class (teacher)
r.put("/:id", auth, requireTeacher, async (req, res) => {
  try {
    const updated = await classService.updateClass(req.params.id, req.body);
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete class (teacher)
r.delete("/:id", auth, requireTeacher, async (req, res) => {
  try {
    await classService.deleteClass(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
