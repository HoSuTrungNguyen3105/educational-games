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

function optionalAuth(req, res, next) {
  const h = req.headers.authorization;
  if (h && h.startsWith("Bearer ")) {
    try { req.user = verifyToken(h.slice(7)); } catch { /* ignore invalid token */ }
  }
  next();
}

function requireTeacher(req, res, next) {
  if (!["teacher", "admin"].includes(req.user.role)) return sendError(res, "Teacher only", 403);
  next();
}

// Create assignment (teacher) → notify all students in class
r.post("/", auth, requireTeacher, async (req, res) => {
  try {
    const { gameId, title, description, classId, isExam, examDuration, deadline, questionIds, maxAttempts } = req.body;
    if (!title || !classId) {
      return sendError(res, "title, classId là bắt buộc", 400);
    }
    if (!questionIds?.length && !gameId) {
      return sendError(res, "Cần chọn ít nhất 1 câu hỏi hoặc chọn game", 400);
    }
    const assignment = await assignmentService.createAssignment({
      teacherId: req.user.sub, gameId, title, description, classId, isExam, examDuration, deadline, questionIds, maxAttempts,
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
          title: "📝 Bài tập mới",
          message: `Bạn có bài tập mới: ${title} từ ${fromUser?.name || "giáo viên"}${game ? ` - ${game.name}` : ""}`,
          link: `/assignment/${assignment.code}`,
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

// Get student's completed assignments
r.get("/my-completed", auth, async (req, res) => {
  try {
    const completed = await assignmentService.getStudentCompletedAssignments(req.user.sub);
    sendSuccess(res, completed);
  } catch (e) { sendError(res, e.message, 500); }
});

// Resolve assignment by code or ID (public — no auth required)
// Used when student opens a direct assignment URL like /assignment/ABC123
r.get("/resolve/:codeOrId", async (req, res) => {
  try {
    const { codeOrId } = req.params;
    let assignment = await assignmentService.getAssignmentByCode(codeOrId);
    if (!assignment) {
      assignment = await assignmentService.getAssignmentById(codeOrId);
    }
    if (!assignment) return sendError(res, "Không tìm thấy bài tập", 404);
    if (assignment.status !== "ACTIVE") return sendError(res, "Bài giao đã đóng", 400);
    if (assignment.deadline && new Date(assignment.deadline) < new Date()) {
      return sendError(res, "Đã hết hạn nộp bài", 400);
    }
    sendSuccess(res, {
      id: assignment.id,
      code: assignment.code,
      title: assignment.title,
      description: assignment.description,
      isExam: assignment.isExam,
      examDuration: assignment.examDuration,
      questionIds: assignment.questionIds || [],
      questionCount: assignment.questionIds?.length || 0,
      maxAttempts: assignment.maxAttempts ?? 1,
      status: assignment.status,
    });
  } catch (e) { sendError(res, e.message, 500); }
});

// Get assignment by id (auth required for full details, but also used by guest flow)
r.get("/:id", auth, async (req, res) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    if (!assignment) return sendError(res, "Không tìm thấy bài giao", 404);
    sendSuccess(res, assignment);
  } catch (e) { sendError(res, e.message, 500); }
});

// Get assignment by id — guest/public variant (minimal info for guest flow)
r.get("/:id/public", async (req, res) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    if (!assignment) return sendError(res, "Không tìm thấy bài giao", 404);
    if (assignment.status !== "ACTIVE") return sendError(res, "Bài giao đã đóng", 400);
    sendSuccess(res, {
      id: assignment.id,
      code: assignment.code,
      title: assignment.title,
      description: assignment.description,
      isExam: assignment.isExam,
      examDuration: assignment.examDuration,
      questionCount: assignment.questionIds?.length || 0,
      status: assignment.status,
    });
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

// Start submission (student/guest) — also returns remainingTime for exams
r.post("/:id/start", optionalAuth, async (req, res) => {
  try {
    const { guestName } = req.body || {};
    const studentId = req.user?.sub || (guestName ? `guest_${guestName}_${req.params.id}` : null);
    if (!studentId) return sendError(res, "Cần đăng nhập hoặc nhập tên để bắt đầu", 400);

    const submission = await assignmentService.startSubmission({
      assignmentId: req.params.id,
      studentId,
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

// Submit answers (student/guest)
r.post("/:id/submit", optionalAuth, async (req, res) => {
  try {
    const { submissionId, answers, guestName } = req.body;
    if (!submissionId) return sendError(res, "submissionId là bắt buộc", 400);
    const studentId = req.user?.sub || (guestName ? `guest_${guestName}_${req.params.id}` : null);
    if (!studentId) return sendError(res, "Cần đăng nhập hoặc nhập tên", 400);

    const result = await assignmentService.submitAnswers({
      submissionId,
      studentId,
      answers: answers || [],
    });
    sendSuccess(res, result);
  } catch (e) { sendError(res, e.message, 400); }
});

// Get student result (student/guest)
r.get("/:id/result", optionalAuth, async (req, res) => {
  try {
    const { guestName } = req.query;
    const studentId = req.user?.sub || (guestName ? `guest_${guestName}_${req.params.id}` : null);
    if (!studentId) return sendError(res, "Cần đăng nhập hoặc nhập tên", 400);

    const result = await assignmentService.getAssignmentResult(req.params.id, studentId);
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

    const { title, description, classId, isExam, examDuration, deadline, questionIds, gameId, maxAttempts } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (classId !== undefined) updateData.classId = classId;
    if (isExam !== undefined) updateData.isExam = isExam;
    if (examDuration !== undefined) updateData.examDuration = isExam ? (examDuration || 60) : null;
    if (deadline !== undefined) updateData.deadline = deadline || null;
    if (questionIds !== undefined) updateData.questionIds = questionIds;
    if (gameId !== undefined) updateData.gameId = gameId || null;
    if (maxAttempts !== undefined) updateData.maxAttempts = maxAttempts;

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
