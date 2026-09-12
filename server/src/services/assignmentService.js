import { getCollection } from "../db.js";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── Assignment CRUD ──

export async function createAssignment({ teacherId, templateId, gameId, questionIds, title, description, classId, isExam, examDuration, deadline, maxAttempts }) {
  if (!teacherId || !title || !classId) {
    throw new Error("teacherId, title, classId là bắt buộc");
  }
  const now = new Date().toISOString();
  const doc = {
    _id: uid("asgn"),
    id: uid("asgn"),
    teacherId,
    templateId: templateId || null,
    gameId: gameId || null,
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
  return getCollection("assignments").findOne({ id });
}

export async function getAssignmentByCode(code) {
  return getCollection("assignments").findOne({ code: String(code) });
}

export async function listAssignments({ classId, teacherId, gameId, status } = {}) {
  const query = {};
  if (classId) query.classId = classId;
  if (teacherId) query.teacherId = teacherId;
  if (gameId) query.gameId = gameId;
  if (status) query.status = status;
  return getCollection("assignments").find(query).sort({ createdAt: -1 }).toArray();
}

export async function updateAssignment(id, data = {}) {
  const now = new Date().toISOString();
  await getCollection("assignments").updateOne({ id }, { $set: { ...data, updatedAt: now } });
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

export async function startSubmission({ assignmentId, studentId }) {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) throw new Error("Bài giao không tồn tại");
  if (assignment.status !== "ACTIVE") throw new Error("Bài giao đã đóng");
  if (assignment.deadline && new Date(assignment.deadline) < new Date()) {
    throw new Error("Đã hết hạn nộp bài");
  }

  // Count existing SUBMITTED submissions for this student+assignment
  const submittedCount = await getCollection("submissions").countDocuments({
    assignmentId, studentId, status: "SUBMITTED",
  });

  const maxAttempts = assignment.maxAttempts ?? 1;

  // Check if there's an IN_PROGRESS submission
  const inProgress = await getCollection("submissions").findOne({
    assignmentId, studentId, status: "IN_PROGRESS",
  });
  if (inProgress) return inProgress;

  // If maxAttempts is 0 (unlimited) or haven't reached limit, create new submission
  if (maxAttempts === 0 || submittedCount < maxAttempts) {
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

  // No attempts left
  throw new Error("Bạn đã hết số lần làm bài cho phép");
}

export async function submitAnswers({ submissionId, studentId, answers }) {
  const sub = await getCollection("submissions").findOne({ id: submissionId });
  if (!sub) throw new Error("Bài nộp không tồn tại");
  if (sub.studentId !== studentId) throw new Error("Không có quyền");
  if (sub.status !== "IN_PROGRESS") throw new Error("Bài nộp đã được nộp");

  const assignment = await getAssignmentById(sub.assignmentId);
  if (!assignment) throw new Error("Bài giao không tồn tại");

  // Fetch questions - use questionIds if available, otherwise fallback to gameId
  let questions = [];
  if (assignment.questionIds && assignment.questionIds.length > 0) {
    questions = await getCollection("questions").find({ id: { $in: assignment.questionIds } }).toArray();
  } else if (assignment.gameId) {
    questions = await getCollection("questions").find({ gameId: assignment.gameId }).toArray();
  }
  
  let correctCount = 0;
  let wrongCount = 0;
  const totalQuestions = questions.length;

  if (questions.length > 0) {
    const questionMap = {};
    for (const q of questions) questionMap[q.id] = q;

    for (const ans of (answers || [])) {
      const q = questionMap[ans.questionId];
      if (!q) { wrongCount++; continue; }
      
      // Check answer based on question type
      const questionType = q.questionType || q.type || "multiple_choice";
      
      if (questionType === "fill-in" || questionType === "text") {
        // Fill-in: case-insensitive comparison
        if (String(ans.value || "").trim().toLowerCase() === String(q.correctAnswer || q.answer || "").trim().toLowerCase()) {
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        // Multiple choice: compare option key (A, B, C, D)
        if (ans.value === q.correctAnswer || ans.value === q.answer) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    }
  }

  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const now = new Date().toISOString();

  await getCollection("submissions").updateOne(
    { id: submissionId },
    { $set: {
      answers,
      submittedAt: now,
      status: "SUBMITTED",
      score,
      correctCount,
      wrongCount,
      totalQuestions,
      updatedAt: now,
    } },
  );

  return { ...sub, score, correctCount, wrongCount, totalQuestions, status: "SUBMITTED" };
}

export async function getSubmissionById(id) {
  return getCollection("submissions").findOne({ id });
}

export async function getStudentSubmission(assignmentId, studentId) {
  return getCollection("submissions").findOne({ assignmentId, studentId, status: "IN_PROGRESS" }) ||
    getCollection("submissions").findOne({ assignmentId, studentId, status: "SUBMITTED" });
}

export async function listSubmissions({ assignmentId, studentId } = {}) {
  const query = {};
  if (assignmentId) query.assignmentId = assignmentId;
  if (studentId) query.studentId = studentId;
  return getCollection("submissions").find(query).sort({ submittedAt: -1 }).toArray();
}

export async function getAssignmentResult(assignmentId, studentId) {
  const sub = await getCollection("submissions").findOne({
    assignmentId, studentId, status: "SUBMITTED",
  }, { sort: { submittedAt: -1 } });
  if (!sub) return null;

  const assignment = await getAssignmentById(assignmentId);
  // Fetch questions - use questionIds if available, otherwise fallback to gameId
  let questions = [];
  if (assignment?.questionIds && assignment.questionIds.length > 0) {
    questions = await getCollection("questions").find({ id: { $in: assignment.questionIds } }).toArray();
  } else if (assignment?.gameId) {
    questions = await getCollection("questions").find({ gameId: assignment.gameId }).toArray();
  }

  // Build detail: each question + user's answer + correct answer
  const detail = questions.map((q) => {
    const userAns = (sub.answers || []).find(a => a.questionId === q.id);
    const questionType = q.questionType || q.type || "multiple_choice";
    const correctAns = q.correctAnswer || q.answer;
    
    return {
      questionId: q.id,
      question: q.question,
      correctAnswer: correctAns,
      userAnswer: userAns ? userAns.value : null,
      isCorrect: userAns
        ? (questionType === "fill-in" || questionType === "text"
          ? String(userAns.value || "").trim().toLowerCase() === String(correctAns || "").trim().toLowerCase()
          : userAns.value === correctAns)
        : false,
    };
  });

  // Get attempt stats
  const submittedCount = await getCollection("submissions").countDocuments({
    assignmentId, studentId, status: "SUBMITTED",
  });
  const maxAttempts = assignment?.maxAttempts ?? 1;

  return { submission: sub, assignment, detail, submittedCount, maxAttempts };
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
  for (const a of assignments) assignmentMap[a.id] = a;

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
  if (total === 0) return { total: 0, avgScore: 0, maxScore: 0, minScore: 0, submittedCount: 0 };

  const scores = subs.map(s => s.score || 0);
  return {
    total,
    submittedCount: total,
    avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / total),
    maxScore: Math.max(...scores),
    minScore: Math.min(...scores),
  };
}
