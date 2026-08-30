import { Router } from "express";
import * as assignmentService from "../services/assignmentService.js";
import * as notificationService from "../services/notificationService.js";
import * as classService from "../services/classService.js";
import { verifyToken } from "../services/authService.js";
import { getCollection } from "../db.js";

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

// Create assignment (teacher) → notify all students in class
r.post("/", auth, requireTeacher, async (req, res) => {
  try {
    const { gameId, title, description, classId, isExam, examDuration, deadline } = req.body;
    if (!gameId || !title || !classId) {
      return res.status(400).json({ error: "gameId, title, classId là bắt buộc" });
    }
    const assignment = await assignmentService.createAssignment({
      teacherId: req.user.sub, gameId, title, description, classId, isExam, examDuration, deadline,
    });

    // Notify all students in class
    try {
      const students = await classService.getClassStudents(classId);
      const fromUser = await getCollection("users").findOne({ id: req.user.sub });
      const game = await getCollection("games").findOne({ id: gameId });
      for (const student of students) {
        await notificationService.createNotification({
          toUserId: student.id,
          fromUserId: req.user.sub,
          fromUsername: fromUser?.username || "",
          fromName: fromUser?.name || "",
          type: "ASSIGNMENT",
          content: `Bạn có bài tập mới: ${title} từ ${fromUser?.name || "giáo viên"}${game ? ` - ${game.name}` : ""}`,
          link: `/assignment/${assignment.id}`,
        });
      }
    } catch (notifyErr) {
      console.error("Failed to send assignment notifications:", notifyErr);
    }

    res.status(201).json(assignment);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// List assignments
r.get("/", auth, async (req, res) => {
  try {
    const { classId, status } = req.query;
    if (req.user.role === "teacher" || req.user.role === "admin") {
      const assignments = await assignmentService.listAssignments({
        classId, teacherId: req.user.sub, status,
      });
      return res.json(assignments);
    }
    // Student: get assignments from their class
    const cls = await classService.getStudentClass(req.user.sub);
    if (!cls) return res.json([]);
    const assignments = await assignmentService.listAssignments({ classId: cls.id, status: "ACTIVE" });
    res.json(assignments);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get assignment by id
r.get("/:id", auth, async (req, res) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Không tìm thấy bài giao" });
    res.json(assignment);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Join assignment by code (student enters 6-digit code)
r.post("/join", auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "code là bắt buộc" });
    const assignment = await assignmentService.getAssignmentByCode(code);
    if (!assignment) return res.status(404).json({ error: "Mã bài tập không hợp lệ" });
    if (assignment.status !== "ACTIVE") return res.status(400).json({ error: "Bài giao đã đóng" });
    res.json(assignment);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Start submission (student)
r.post("/:id/start", auth, async (req, res) => {
  try {
    const submission = await assignmentService.startSubmission({
      assignmentId: req.params.id,
      studentId: req.user.sub,
    });
    res.json(submission);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Submit answers (student)
r.post("/:id/submit", auth, async (req, res) => {
  try {
    const { submissionId, answers } = req.body;
    if (!submissionId) return res.status(400).json({ error: "submissionId là bắt buộc" });
    const result = await assignmentService.submitAnswers({
      submissionId,
      studentId: req.user.sub,
      answers: answers || [],
    });
    res.json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Get student result
r.get("/:id/result", auth, async (req, res) => {
  try {
    const result = await assignmentService.getAssignmentResult(req.params.id, req.user.sub);
    if (!result) return res.status(404).json({ error: "Chưa có kết quả" });
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get assignment stats (teacher)
r.get("/:id/stats", auth, requireTeacher, async (req, res) => {
  try {
    const stats = await assignmentService.getAssignmentStats(req.params.id);
    res.json(stats);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List submissions for assignment (teacher)
r.get("/:id/submissions", auth, requireTeacher, async (req, res) => {
  try {
    const subs = await assignmentService.listSubmissions({ assignmentId: req.params.id });
    res.json(subs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Close assignment (teacher)
r.put("/:id/close", auth, requireTeacher, async (req, res) => {
  try {
    const updated = await assignmentService.closeAssignment(req.params.id);
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete assignment (teacher)
r.delete("/:id", auth, requireTeacher, async (req, res) => {
  try {
    await assignmentService.deleteAssignment(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default r;
