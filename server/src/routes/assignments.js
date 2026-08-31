import { Router } from "express";
import * as assignmentService from "../services/assignmentService.js";
import * as notificationService from "../services/notificationService.js";
import * as classService from "../services/classService.js";
import { verifyToken } from "../services/authService.js";
import { getCollection } from "../db.js";
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

// Create assignment (teacher) → notify all students in class
r.post("/", auth, requireTeacher, async (req, res) => {
  try {
    const { gameId, title, description, classId, isExam, examDuration, deadline, questionIds } = req.body;
    if (!title || !classId) {
      return sendError(res, "title, classId là bắt buộc", 400);
    }
    if (!questionIds?.length && !gameId) {
      return sendError(res, "Cần chọn ít nhất 1 câu hỏi hoặc chọn game", 400);
    }
    const assignment = await assignmentService.createAssignment({
      teacherId: req.user.sub, gameId, title, description, classId, isExam, examDuration, deadline, questionIds,
    });

    // Notify all students in class
    try {
      const students = await classService.getClassStudents(classId);
      const fromUser = await getCollection("users").findOne({ id: req.user.sub });
      const game = gameId ? await getCollection("games").findOne({ id: gameId }) : null;
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

    sendCreated(res, assignment);
  } catch (e) { sendError(res, e.message, 400); }
});

// List assignments
r.get("/", auth, async (req, res) => {
  try {
    const { classId, status } = req.query;
    if (req.user.role === "teacher" || req.user.role === "admin") {
      const assignments = await assignmentService.listAssignments({
        classId, teacherId: req.user.sub, status,
      });
      return sendSuccess(res, assignments);
    }
    // Student: get assignments from their class
    const cls = await classService.getStudentClass(req.user.sub);
    if (!cls) return sendSuccess(res, []);
    const assignments = await assignmentService.listAssignments({ classId: cls.id, status: "ACTIVE" });
    sendSuccess(res, assignments);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get assignment by id
r.get("/:id", auth, async (req, res) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    if (!assignment) return sendError(res, "Không tìm thấy bài giao", 404);
    sendSuccess(res, assignment);
  } catch (e) { sendError(res, e.message, 500); }
});

// Join assignment by code (student enters 6-digit code)
r.post("/join", auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return sendError(res, "code là bắt buộc", 400);
    const assignment = await assignmentService.getAssignmentByCode(code);
    if (!assignment) return sendError(res, "Mã bài tập không hợp lệ", 404);
    if (assignment.status !== "ACTIVE") return sendError(res, "Bài giao đã đóng", 400);
    sendSuccess(res, assignment);
  } catch (e) { sendError(res, e.message, 500); }
});

// Start submission (student) — also returns remainingTime for exams
r.post("/:id/start", auth, async (req, res) => {
  try {
    const submission = await assignmentService.startSubmission({
      assignmentId: req.params.id,
      studentId: req.user.sub,
    });
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    let remainingTime = null;
    if (assignment?.isExam && assignment?.examDuration && submission?.startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(submission.startedAt).getTime()) / 1000);
      remainingTime = Math.max(0, assignment.examDuration * 60 - elapsed);
    }
    sendSuccess(res, { ...submission, remainingTime });
  } catch (e) { sendError(res, e.message, 400); }
});

// Submit answers (student)
r.post("/:id/submit", auth, async (req, res) => {
  try {
    const { submissionId, answers } = req.body;
    if (!submissionId) return sendError(res, "submissionId là bắt buộc", 400);
    const result = await assignmentService.submitAnswers({
      submissionId,
      studentId: req.user.sub,
      answers: answers || [],
    });
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

// Get student result
r.get("/:id/result", auth, async (req, res) => {
  try {
    const result = await assignmentService.getAssignmentResult(req.params.id, req.user.sub);
    if (!result) return sendError(res, "Chưa có kết quả", 404);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get assignment stats (teacher)
r.get("/:id/stats", auth, requireTeacher, async (req, res) => {
  try {
    const stats = await assignmentService.getAssignmentStats(req.params.id);
    sendSuccess(res, stats);
  } catch (e) { sendError(res, e.message, 500); }
});

// List submissions for assignment (teacher)
r.get("/:id/submissions", auth, requireTeacher, async (req, res) => {
  try {
    const subs = await assignmentService.listSubmissions({ assignmentId: req.params.id });
    sendSuccess(res, subs);
  } catch (e) { sendError(res, e.message, 500); }
});

// Close assignment (teacher)
r.put("/:id/close", auth, requireTeacher, async (req, res) => {
  try {
    const updated = await assignmentService.closeAssignment(req.params.id);
    sendSuccess(res, updated);
  } catch (e) { sendError(res, e.message, 500); }
});

// Update assignment (teacher)
r.put("/:id", auth, requireTeacher, async (req, res) => {
  try {
    const existing = await assignmentService.getAssignmentById(req.params.id);
    if (!existing) return sendError(res, "Không tìm thấy bài giao", 404);
    if (existing.status !== "ACTIVE") return sendError(res, "Bài giao đã đóng, không thể chỉnh sửa", 400);

    const { title, description, classId, isExam, examDuration, deadline, questionIds, gameId } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (classId !== undefined) updateData.classId = classId;
    if (isExam !== undefined) updateData.isExam = isExam;
    if (examDuration !== undefined) updateData.examDuration = isExam ? (examDuration || 60) : null;
    if (deadline !== undefined) updateData.deadline = deadline || null;
    if (questionIds !== undefined) updateData.questionIds = questionIds;
    if (gameId !== undefined) updateData.gameId = gameId || null;

    const updated = await assignmentService.updateAssignment(req.params.id, updateData);
    sendSuccess(res, updated);
  } catch (e) { sendError(res, e.message, 400); }
});

// Delete assignment (teacher)
r.delete("/:id", auth, requireTeacher, async (req, res) => {
  try {
    await assignmentService.deleteAssignment(req.params.id);
    sendSuccess(res, { ok: true });
  } catch (e) { sendError(res, e.message, 500); }
});

export default r;
