import { getCollection } from "../db.js";
import { isAnswerCorrect } from "../lib/gradeAnswer.js";
import { getClassStudents } from "./classService.js";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Bài giao chọn template, không còn gắn với game. Docs cũ vẫn còn field
 * `gameId` trong DB → bỏ khỏi mọi response để client chỉ thấy templateId.
 */
function withoutGame(doc) {
  if (!doc) return doc;
  const { gameId: _gameId, ...rest } = doc;
  return rest;
}

// ── Assignment CRUD ──

export async function createAssignment({ teacherId, templateId, questionIds, title, description, classId, isExam, examDuration, deadline, maxAttempts }) {
  if (!teacherId || !title || !classId) {
    throw new Error("teacherId, title, classId là bắt buộc");
  }
  const now = new Date().toISOString();
  const doc = {
    _id: uid("asgn"),
    id: uid("asgn"),
    teacherId,
    // Mẫu đề thi (thithap, thithap-3d…) — bài giao không còn gắn với game.
    templateId: templateId || null,
    questionIds: questionIds || [],
    title,
    description: description || null,
    classId,
    code: generateCode(),
    isExam: !!isExam,
    examDuration: isExam ? (examDuration || 60) : null,
    deadline: deadline || null,
    maxAttempts: maxAttempts != null ? maxAttempts : 1,
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
  };
  await getCollection("assignments").insertOne(doc);
  return doc;
}

export async function getAssignmentById(id) {
  return withoutGame(await getCollection("assignments").findOne({ id }));
}

export async function getAssignmentByCode(code) {
  return withoutGame(await getCollection("assignments").findOne({ code: String(code) }));
}

export async function listAssignments({ classId, teacherId, templateId, status } = {}) {
  const query = {};
  if (classId) query.classId = classId;
  if (teacherId) query.teacherId = teacherId;
  if (templateId) query.templateId = templateId;
  if (status) query.status = status;
  const docs = await getCollection("assignments").find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(withoutGame);
}

export async function updateAssignment(id, data = {}) {
  const now = new Date().toISOString();
  const update = { $set: { ...data, updatedAt: now } };
  // Sửa bài = chuyển sang dùng template → xóa hẳn field cũ của docs trước đây.
  if ("templateId" in data) update.$unset = { gameId: "" };
  await getCollection("assignments").updateOne({ id }, update);
  return getAssignmentById(id);
}

export async function closeAssignment(id) {
  return updateAssignment(id, { status: "CLOSED" });
}

export async function deleteAssignment(id) {
  await getCollection("assignments").deleteOne({ id });
  await getCollection("submissions").deleteMany({ assignmentId: id });
  return true;
}

// ── Submissions ──

/**
 * Câu hỏi của một bài giao — luôn lấy từ `questionIds` do giáo viên chọn.
 * Bài mới chọn từ Ngân hàng câu hỏi (collection `question_banks`); bài cũ
 * mang id câu hỏi theo game (collection `questions`). Tra `questions` trước,
 * id nào chưa thấy thì tra tiếp `question_banks`, và trả theo đúng thứ tự
 * trong `questionIds` (trước đây trả theo thứ tự tự nhiên của DB).
 */
async function loadAssignmentQuestions(assignment) {
  const ids = assignment?.questionIds || [];
  if (!ids.length) return [];
  const found = new Map();
  const gameQs = await getCollection("questions").find({ id: { $in: ids } }).toArray();
  for (const q of gameQs) found.set(q.id, q);
  const missing = ids.filter((id) => !found.has(id));
  if (missing.length) {
    const bankQs = await getCollection("question_banks").find({ id: { $in: missing } }).toArray();
    for (const q of bankQs) found.set(q.id, q);
  }
  return ids.map((id) => found.get(id)).filter(Boolean);
}

export async function startSubmission({ assignmentId, studentId }) {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) throw new Error("Bài giao không tồn tại");
  if (assignment.status !== "ACTIVE") throw new Error("Bài giao đã đóng");
  if (assignment.deadline && new Date(assignment.deadline) < new Date()) {
    throw new Error("Đã hết hạn nộp bài");
  }

  // Check if there's an IN_PROGRESS submission — return it
  const inProgress = await getCollection("submissions").findOne({
    assignmentId, studentId, status: "IN_PROGRESS",
  });
  if (inProgress) return inProgress;

  const maxAttempts = assignment.maxAttempts ?? 1;

  // Count existing SUBMITTED submissions for this student+assignment
  const submittedCount = await getCollection("submissions").countDocuments({
    assignmentId, studentId, status: "SUBMITTED",
  });

  // If maxAttempts is 0 (unlimited) or haven't reached limit, allow redo
  if (maxAttempts === 0 || submittedCount < maxAttempts) {
    // Create a NEW submission document for each attempt (keep all history)
    const now = new Date().toISOString();
    const doc = {
      _id: uid("sub"),
      id: uid("sub"),
      assignmentId,
      studentId,
      startedAt: now,
      submittedAt: null,
      status: "IN_PROGRESS",
      score: null,
      correctCount: 0,
      wrongCount: 0,
      totalQuestions: 0,
      answers: [],
      attemptNumber: submittedCount + 1,
      createdAt: now,
      updatedAt: now,
    };
    await getCollection("submissions").insertOne(doc);
    return doc;
  }

  // No attempts left — return the last SUBMITTED submission (read-only) so student can view result
  const lastSubmitted = await getCollection("submissions").findOne({
    assignmentId, studentId, status: "SUBMITTED",
  }, { sort: { submittedAt: -1 } });
  if (lastSubmitted) return lastSubmitted;

  throw new Error("Bạn đã hết số lần làm bài cho phép");
}

export async function submitAnswers({ submissionId, studentId, answers }) {
  const sub = await getCollection("submissions").findOne({ id: submissionId });
  if (!sub) throw new Error("Bài nộp không tồn tại");
  if (sub.studentId !== studentId) throw new Error("Không có quyền");
  if (sub.status !== "IN_PROGRESS") throw new Error("Bài nộp đã được nộp");

  const assignment = await getAssignmentById(sub.assignmentId);
  if (!assignment) throw new Error("Bài giao không tồn tại");

  const questions = await loadAssignmentQuestions(assignment);

  let correctCount = 0;
  let wrongCount = 0;
  const totalQuestions = questions.length;
  const answerList = Array.isArray(answers) ? answers : [];

  // Điểm luôn do server chấm từ từng câu trả lời — không nhận điểm tự khai.
  if (answerList.length > 0 && questions.length > 0) {
    const questionMap = {};
    for (const q of questions) questionMap[q.id] = q;

    for (const ans of answerList) {
      const q = questionMap[ans.questionId];
      if (!q) { wrongCount++; continue; }

      if (isAnswerCorrect(q, ans.value)) correctCount++;
      else wrongCount++;
    }
  }

  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const now = new Date().toISOString();

  // Thời gian làm bài: với BÀI THI (isExam) ghi thêm số giây quá giờ để giáo
  // viên thấy ở bảng điểm. KHÔNG chặn nộp khi quá giờ — học sinh có thể trễ vì
  // mạng/thiết bị, chặn cứng sẽ làm mất bài làm; việc "một lần, đúng giờ" được
  // giữ bằng maxAttempts + đồng hồ đếm ngược phía client + dấu quá giờ này.
  let timeUsedSec = null;
  let overtimeSec = 0;
  if (sub.startedAt) {
    timeUsedSec = Math.max(0, Math.round((Date.now() - new Date(sub.startedAt).getTime()) / 1000));
    if (assignment.isExam && assignment.examDuration) {
      overtimeSec = Math.max(0, timeUsedSec - assignment.examDuration * 60);
    }
  }

  await getCollection("submissions").updateOne(
    { id: submissionId },
    { $set: {
      answers: answerList,
      submittedAt: now,
      status: "SUBMITTED",
      score,
      correctCount,
      wrongCount,
      totalQuestions,
      timeUsedSec,
      overtimeSec,
      updatedAt: now,
    } },
  );

  return { ...sub, answers: answerList, score, correctCount, wrongCount, totalQuestions, status: "SUBMITTED", timeUsedSec, overtimeSec };
}

export async function getSubmissionById(id) {
  return getCollection("submissions").findOne({ id });
}

export async function getStudentSubmission(assignmentId, studentId) {
  return getCollection("submissions").findOne({ assignmentId, studentId, status: "IN_PROGRESS" }) ||
    getCollection("submissions").findOne({ assignmentId, studentId, status: "SUBMITTED" });
}

/**
 * CHỈ ĐỌC — xem trạng thái làm bài hiện tại của học sinh mà KHÔNG tạo
 * submission mới (khác startSubmission ở chỗ không có bất kỳ side-effect nào).
 * Client dùng để dựng màn hình giới thiệu trước khi học sinh bấm Bắt đầu:
 * chưa từng bắt đầu → null; đang làm dở → IN_PROGRESS + thời gian còn lại;
 * đã nộp → SUBMITTED. Đồng hồ bài thi chỉ được phép chạy sau start thật.
 */
export async function peekSubmission(assignmentId, studentId) {
  const subs = getCollection("submissions");
  const inProgress = await subs.findOne({ assignmentId, studentId, status: "IN_PROGRESS" });
  if (inProgress) {
    const assignment = await getAssignmentById(assignmentId);
    let remainingTime = null;
    if (assignment?.isExam && assignment?.examDuration && inProgress.startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(inProgress.startedAt).getTime()) / 1000);
      remainingTime = Math.max(0, assignment.examDuration * 60 - elapsed);
    }
    return { status: "IN_PROGRESS", startedAt: inProgress.startedAt, remainingTime };
  }
  const submitted = await subs.findOne(
    { assignmentId, studentId, status: "SUBMITTED" },
    { sort: { submittedAt: -1 } },
  );
  if (submitted) return { status: "SUBMITTED", startedAt: submitted.startedAt, remainingTime: null };
  return null;
}

export async function listSubmissions({ assignmentId, studentId } = {}) {
  const query = {};
  if (assignmentId) query.assignmentId = assignmentId;
  if (studentId) query.studentId = studentId;
  const subs = await getCollection("submissions").find(query).sort({ submittedAt: -1 }).toArray();
  return attachStudents(subs);
}

/**
 * Gắn thông tin học sinh TỐI THIỂU vào từng bài nộp (field `student`:
 * id/username/name/avatarLoadout — cùng mẫu chiếu tối thiểu ở leaderboard và
 * users/directory) để phía giáo viên hiện TÊN học sinh thay vì mã `user-…`.
 * Bài nộp không có bản ghi user tương ứng (học sinh đã bị xoá, hoặc bài nộp
 * khách với studentId dạng `guest_…`) → `student: null`, client rơi về ID.
 */
async function attachStudents(subs) {
  const ids = [...new Set(subs.map((s) => s.studentId).filter(Boolean))];
  if (ids.length === 0) return subs;
  const users = await getCollection("users")
    .find({ id: { $in: ids } })
    .project({ _id: 0, id: 1, username: 1, name: 1, avatarLoadout: 1 })
    .toArray();
  const byId = new Map(users.map((u) => [u.id, { ...u, avatarLoadout: u.avatarLoadout || null }]));
  return subs.map((s) => ({ ...s, student: byId.get(s.studentId) || null }));
}

export async function getAssignmentResult(assignmentId, studentId, { showCorrectAnswer = false } = {}) {
  // Get ALL submissions for this student+assignment (keep history)
  const allSubs = await getCollection("submissions").find({
    assignmentId, studentId, status: "SUBMITTED",
  }).sort({ submittedAt: -1 }).toArray();
  if (allSubs.length === 0) return null;

  const latestSub = allSubs[0];
  const assignment = await getAssignmentById(assignmentId);
  const questions = await loadAssignmentQuestions(assignment);

  const questionMap = {};
  for (const q of questions) questionMap[q.id] = q;

  // Helper: resolve an option key/id to its display text
  function resolveOptionText(q, optionKey) {
    if (!optionKey && optionKey !== 0) return null;
    const options = q.options || q.answers || [];
    for (const opt of options) {
      const key = opt.id || opt.key || opt;
      const text = opt.content || opt.text || opt.label || opt.value || String(key);
      if (key === optionKey || String(key).toLowerCase() === String(optionKey).toLowerCase()) {
        return text;
      }
    }
    return String(optionKey);
  }

  // Build detail for each submission
  function buildDetail(sub) {
    return questions.map((q) => {
      const userAns = (sub.answers || []).find(a => a.questionId === q.id);
      const questionType = q.questionType || q.type || "multiple_choice";
      const correctAnsKey = q.correctAnswer || q.answer;
      const userAnswerKey = userAns ? userAns.value : null;
      const userAnswerText = resolveOptionText(q, userAnswerKey);

      const detail = {
        questionId: q.id,
        question: q.content || q.question,
        userAnswer: userAnswerText,
        isCorrect: userAns
          ? (questionType === "fill-in" || questionType === "text"
            ? String(userAns.value || "").trim().toLowerCase() === String(correctAnsKey || "").trim().toLowerCase()
            : userAns.value === correctAnsKey)
          : false,
      };

      if (showCorrectAnswer) {
        detail.correctAnswer = resolveOptionText(q, correctAnsKey);
      }

      return detail;
    });
  }

  const maxAttempts = assignment?.maxAttempts ?? 1;

  // Build all submissions with details
  const submissions = allSubs.map(sub => ({
    submission: sub,
    detail: buildDetail(sub),
  }));

  return {
    submissions,
    submission: latestSub,
    detail: buildDetail(latestSub),
    assignment,
    submittedCount: allSubs.length,
    maxAttempts,
  };
}

// ── Student completed assignments ──

export async function getStudentCompletedAssignments(studentId) {
  // Get all SUBMITTED submissions for this student, grouped by assignmentId
  const submissions = await getCollection("submissions").find({
    studentId, status: "SUBMITTED",
  }).sort({ submittedAt: -1 }).toArray();

  // Get unique assignment IDs
  const assignmentIds = [...new Set(submissions.map(s => s.assignmentId))];
  if (assignmentIds.length === 0) return [];

  // Fetch assignment details
  const assignments = await getCollection("assignments").find({
    id: { $in: assignmentIds },
  }).toArray();

  const assignmentMap = {};
  for (const a of assignments) assignmentMap[a.id] = withoutGame(a);

  // Group submissions by assignment, keep best score per assignment
  const result = [];
  const seenAssignments = new Set();
  for (const sub of submissions) {
    if (seenAssignments.has(sub.assignmentId)) continue;
    seenAssignments.add(sub.assignmentId);
    const assignment = assignmentMap[sub.assignmentId];
    if (!assignment) continue;
    // Find best score for this assignment
    const bestSub = submissions
      .filter(s => s.assignmentId === sub.assignmentId)
      .sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    result.push({
      assignment,
      submission: bestSub,
      attemptCount: submissions.filter(s => s.assignmentId === sub.assignmentId).length,
      maxAttempts: assignment.maxAttempts ?? 1,
    });
  }
  return result;
}

// ── Statistics ──

export async function getAssignmentStats(assignmentId) {
  const subs = await getCollection("submissions").find({ assignmentId, status: "SUBMITTED" }).toArray();
  const total = subs.length;
  const scores = subs.map(s => s.score || 0);
  const base = total === 0
    ? { total: 0, avgScore: 0, maxScore: 0, minScore: 0, submittedCount: 0 }
    : {
        total,
        submittedCount: total,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / total),
        maxScore: Math.max(...scores),
        minScore: Math.min(...scores),
      };

  // ── Tiến độ nộp theo lớp ──
  // Sĩ số chỉ tính học sinh HIỆN CÒN trong lớp (roster sống); "đã nộp" ở đây
  // là SỐ HỌC SINH có ít nhất một bài SUBMITTED — khác `total` ở trên là số
  // BÀI nộp (một học sinh làm nhiều lần thì total đếm nhiều lần). Học sinh đã
  // nộp rồi rời lớp vẫn nằm trong `total` nhưng không vào mẫu số ở đây.
  // Bài đang IN_PROGRESS chưa tính là đã nộp.
  const assignment = await getAssignmentById(assignmentId);
  let classTotal = 0;
  let submittedStudents = 0;
  let notSubmitted = [];
  if (assignment?.classId) {
    const roster = await getClassStudents(assignment.classId);
    const submittedIds = new Set(subs.map((s) => s.studentId));
    classTotal = roster.length;
    submittedStudents = roster.filter((u) => submittedIds.has(u.id)).length;
    notSubmitted = roster
      .filter((u) => !submittedIds.has(u.id))
      .map((u) => ({ id: u.id, username: u.username, name: u.name, avatarLoadout: u.avatarLoadout || null }));
  }
  return { ...base, classTotal, submittedStudents, notSubmitted };
}
