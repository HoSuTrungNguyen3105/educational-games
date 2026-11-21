// heatmapService.js — Bản đồ nhiệt điểm mù (Knowledge Heatmap) cho giáo viên.
//
// Trực quan hoá lỗ hổng kiến thức của MỘT lớp từ dữ liệu làm bài THẬT:
//   1. `submissions` (bài tập được giao, status SUBMITTED): server lưu NGUYÊN
//      mảng `answers` [{ questionId, value, timeSpent? }] → chấm lại từng câu
//      bằng `isAnswerCorrect` dùng chung → tỷ lệ sai TỪNG CÂU + thời gian
//      từng câu (khi client có gửi timeSpent).
//   2. `results` (ván game): mỗi ván chỉ lưu TỔNG HỢP (correctAnswers /
//      totalQuestions / accuracy / completionTime cả ván) — đáp án từng câu
//      KHÔNG được lưu trước đợt này. Từ đợt này `completePlay` lưu thêm
//      `breakdown` [{ questionId, isCorrect, timeSpent? }] nên ván MỚI dần
//      có thống kê từng câu; ván cũ chỉ đóng góp ở mức game/chủ đề.
//      Bỏ qua result `verified === false` (điểm client tự khai, server không
//      chấm — gồm cả đường fallback của completePlay vốn ghi correctAnswers=0
//      dù học sinh không hề sai) và result `source === "assignment"` (đã tính
//      qua submissions, tránh đếm trùng).
//
// Trục "Chủ đề / Kỹ năng" lấy từ taxonomy THẬT, theo thứ tự ưu tiên:
//   category của câu ngân hàng → nhãn môn của câu ngân hàng →
//   topic của game → môn của game → tên game.
// Câu game nối sang ngân hàng qua `bankId`, nối game qua `gameId`.
//
// Mức màu (level) — định nghĩa cố định, chỉ dùng dữ liệu thật có được:
//   · answered = 0            → "none"         (chưa làm)
//   · 1 ≤ answered < 3        → "insufficient" (chưa đủ dữ liệu để kết luận)
//   · accuracy < 50%          → "red"          (điểm mù)
//   · 50% ≤ accuracy < 80%    → "yellow"       (cần lưu ý)
//   · accuracy ≥ 80% nhưng trả lời chậm rõ rệt so với lớp (thời gian TB/câu
//     ≥ 10 giây VÀ > 1,5 × trung bình của cả lớp ở cùng chủ đề) → "yellow"
//   · còn lại                 → "green"        (thành thạo)
// "Số lượt làm lại" (sessions) được TRẢ VỀ để giáo viên xem trong chi tiết ô
// nhưng KHÔNG dùng để tô màu: chơi lại game là hành vi bình thường của học
// sinh (cày XP/coin), lấy nó làm tín hiệu yếu sẽ oan cho học sinh chăm chơi.
// Chỉ số thời gian: avgResponseSec = null khi không có bất kỳ dữ liệu thời
// gian nào (giao diện hiện "—"), TUYỆT ĐỐI không suy diễn.
import { getCollection } from "../db.js";
import { isAnswerCorrect } from "../lib/gradeAnswer.js";
import { getClassStudents, isClassTeacher } from "./classService.js";
import { httpError } from "../utils/httpError.js";

export const MIN_ANSWERED_FOR_LEVEL = 3;
export const RED_BELOW = 50;
export const YELLOW_BELOW = 80;
export const SLOW_RATIO = 1.5;
export const SLOW_MIN_SEC = 10;
export const MAX_QUESTION_STATS = 20;
export const MAX_ALERTS = 5;

/** Nhãn môn của câu ngân hàng (khớp SK ở client questionBankMeta). */
const SUBJECT_LABELS = {
  viet: "Tiếng Việt",
  eng: "Tiếng Anh",
  sci: "Khoa học",
  geo: "Địa lí – Lịch sử",
  custom: "Thầy cô ra đề",
};
export function subjectLabelOf(subject) {
  const s = String(subject || "").trim();
  if (!s) return "";
  return SUBJECT_LABELS[s] || s;
}

/** Mức màu của một ô học sinh × chủ đề. Hàm thuần — test trực tiếp được. */
export function levelFor({ answered = 0, accuracy = 0, avgResponseSec = null, classAvgResponseSec = null } = {}) {
  if (!answered || answered <= 0) return "none";
  if (answered < MIN_ANSWERED_FOR_LEVEL) return "insufficient";
  if (accuracy < RED_BELOW) return "red";
  if (accuracy < YELLOW_BELOW) return "yellow";
  const slow =
    avgResponseSec != null &&
    classAvgResponseSec != null &&
    classAvgResponseSec > 0 &&
    avgResponseSec >= SLOW_MIN_SEC &&
    avgResponseSec > classAvgResponseSec * SLOW_RATIO;
  return slow ? "yellow" : "green";
}

const round1 = (n) => Math.round(n * 10) / 10;

export async function getClassHeatmap({ classId, requester }) {
  const cls = await getCollection("classes").findOne({ id: classId });
  if (!cls) throw httpError("Không tìm thấy lớp học", 404);

  const role = requester?.role;
  const requesterId = requester?.sub || requester?.id;
  if (role !== "admin") {
    if (role !== "teacher" || !requesterId || !(await isClassTeacher(requesterId, classId))) {
      throw httpError("Bạn không phụ trách lớp này", 403);
    }
  }

  const studentDocs = await getClassStudents(classId);
  const students = studentDocs.map((s) => ({ id: s.id, name: s.name || s.username || s.id, username: s.username || "" }));
  const studentIds = students.map((s) => s.id);
  const studentSet = new Set(studentIds);

  // ── Bộ nhớ tổng hợp ────────────────────────────────────────────────────
  const topics = new Map(); // label -> { key, label, answered }
  const cells = new Map(); // `${studentId}|${label}` -> cell thô
  const questionStats = new Map(); // questionId -> stat thô

  const ensureTopic = (label) => {
    if (!topics.has(label)) topics.set(label, { key: label, label, answered: 0 });
    return topics.get(label);
  };
  const cellFor = (studentId, label) => {
    const k = `${studentId}|${label}`;
    if (!cells.has(k)) {
      cells.set(k, { studentId, topicKey: label, answered: 0, correct: 0, sessions: 0, timeSum: 0, timeCount: 0 });
    }
    return cells.get(k);
  };
  const addTiming = (cell, sumSec, count) => {
    if (count > 0 && Number.isFinite(sumSec) && sumSec >= 0) {
      cell.timeSum += sumSec;
      cell.timeCount += count;
    }
  };
  const addQuestionStat = (questionId, content, topicLabel, isCorrect, timeSpent) => {
    if (!questionId) return;
    if (!questionStats.has(questionId)) {
      questionStats.set(questionId, {
        questionId,
        content: String(content || "").slice(0, 160),
        topicKey: topicLabel,
        attempts: 0,
        wrongCount: 0,
        timeSum: 0,
        timeCount: 0,
      });
    }
    const st = questionStats.get(questionId);
    st.attempts += 1;
    if (!isCorrect) st.wrongCount += 1;
    const t = Number(timeSpent);
    if (Number.isFinite(t) && t >= 0) {
      st.timeSum += t;
      st.timeCount += 1;
    }
  };

  // ── Nạp games (map theo cả `id` lẫn `_id` dạng chuỗi) ─────────────────
  const gameByAnyId = new Map();
  for (const g of await getCollection("games").find({}).toArray()) {
    if (g.id) gameByAnyId.set(String(g.id), g);
    if (g._id) gameByAnyId.set(String(g._id), g);
  }
  const gameTopicLabel = (g) => String(g?.topic || g?.subject || g?.name || "Trò chơi");

  // ── Nguồn 1: bài tập được giao (submissions đã nộp) ────────────────────
  const assignments = await getCollection("assignments").find({ classId }).toArray();
  const assignmentIds = assignments.map((a) => a.id);
  let submissions = [];
  if (assignmentIds.length && studentIds.length) {
    submissions = await getCollection("submissions")
      .find({ assignmentId: { $in: assignmentIds }, status: "SUBMITTED", studentId: { $in: studentIds } })
      .toArray();
  }

  // Câu hỏi của các bài giao: `questions` trước, `question_banks` cho phần
  // còn thiếu — đúng thứ tự loadAssignmentQuestions của assignmentService.
  const wantedQids = [...new Set(assignments.flatMap((a) => a.questionIds || []))];
  const qdocById = new Map();
  const bankById = new Map();
  if (wantedQids.length) {
    for (const q of await getCollection("questions").find({ id: { $in: wantedQids } }).toArray()) qdocById.set(q.id, q);
    const missing = wantedQids.filter((id) => !qdocById.has(id));
    if (missing.length) {
      for (const q of await getCollection("question_banks").find({ id: { $in: missing } }).toArray()) {
        qdocById.set(q.id, q);
        bankById.set(q.id, q);
      }
    }
    // Câu game có bankId → nạp bank để lấy category khi cần.
    const bankIds = [...new Set([...qdocById.values()].map((q) => q.bankId).filter(Boolean))]
      .filter((id) => !bankById.has(id));
    if (bankIds.length) {
      for (const q of await getCollection("question_banks").find({ id: { $in: bankIds } }).toArray()) bankById.set(q.id, q);
    }
  }

  const topicLabelForQuestion = (q) => {
    const bank = bankById.get(q?.id) || (q?.bankId ? bankById.get(q.bankId) : null);
    if (bank) {
      const cat = String(bank.category || "").trim();
      if (cat) return cat;
      return subjectLabelOf(bank.subject) || "Câu hỏi ngân hàng";
    }
    if (q?.gameId && gameByAnyId.has(String(q.gameId))) return gameTopicLabel(gameByAnyId.get(String(q.gameId)));
    return null;
  };

  for (const sub of submissions) {
    const touched = new Set();
    for (const ans of sub.answers || []) {
      const q = qdocById.get(ans?.questionId);
      if (!q) continue;
      const label = topicLabelForQuestion(q);
      if (!label) continue;
      ensureTopic(label);
      const correct = isAnswerCorrect(q, ans?.value);
      const cell = cellFor(sub.studentId, label);
      cell.answered += 1;
      if (correct) cell.correct += 1;
      touched.add(label);
      const t = Number(ans?.timeSpent);
      if (Number.isFinite(t) && t >= 0) addTiming(cell, t, 1);
      addQuestionStat(q.id, q.content, label, correct, ans?.timeSpent);
    }
    for (const label of touched) cellFor(sub.studentId, label).sessions += 1;
  }

  // ── Nguồn 2: ván game (results) ────────────────────────────────────────
  if (studentIds.length) {
    const results = await getCollection("results").find({ userId: { $in: studentIds } }).toArray();
    // Câu hỏi xuất hiện trong breakdown của các ván mới — nạp để thống kê.
    const breakdownQids = [...new Set(results.flatMap((r) => (Array.isArray(r.breakdown) ? r.breakdown.map((b) => b?.questionId) : [])))].filter(Boolean);
    const missingBreakdown = breakdownQids.filter((id) => !qdocById.has(id));
    if (missingBreakdown.length) {
      for (const q of await getCollection("questions").find({ id: { $in: missingBreakdown } }).toArray()) qdocById.set(q.id, q);
      const stillMissing = missingBreakdown.filter((id) => !qdocById.has(id));
      if (stillMissing.length) {
        for (const q of await getCollection("question_banks").find({ id: { $in: stillMissing } }).toArray()) qdocById.set(q.id, q);
      }
    }

    for (const r of results) {
      if (!studentSet.has(r.userId)) continue;
      if (r.source === "assignment") continue; // đã tính qua submissions
      if (r.verified === false) continue; // điểm client tự khai — không chấm thật
      if (!r.gameId) continue;
      const g = gameByAnyId.get(String(r.gameId));
      const label = g ? gameTopicLabel(g) : "Trò chơi";
      ensureTopic(label);
      const cell = cellFor(r.userId, label);
      const total = Number(r.totalQuestions) || 0;
      const correct = Number(r.correctAnswers) || 0;
      cell.answered += total;
      cell.correct += correct;
      cell.sessions += 1;
      if (Array.isArray(r.breakdown) && r.breakdown.length) {
        for (const b of r.breakdown) {
          const q = qdocById.get(b?.questionId);
          addQuestionStat(b?.questionId, q?.content || "", label, !!b?.isCorrect, b?.timeSpent);
          const t = Number(b?.timeSpent);
          if (Number.isFinite(t) && t >= 0) addTiming(cell, t, 1);
        }
      } else if (Number(r.completionTime) > 0 && total > 0) {
        // Ván cũ không có breakdown: chỉ có thời gian CẢ VÁN → quy về TB/câu.
        addTiming(cell, Number(r.completionTime), total);
      }
    }
  }

  // ── Hoàn thiện: accuracy, thời gian TB, mức màu ────────────────────────
  const topicTime = new Map(); // label -> { sum, count } toàn lớp
  for (const cell of cells.values()) {
    const t = topicTime.get(cell.topicKey) || { sum: 0, count: 0 };
    t.sum += cell.timeSum;
    t.count += cell.timeCount;
    topicTime.set(cell.topicKey, t);
    const topic = topics.get(cell.topicKey);
    if (topic) topic.answered += cell.answered;
  }

  const cellList = [...cells.values()].map((cell) => {
    const accuracy = cell.answered > 0 ? Math.round((cell.correct / cell.answered) * 100) : 0;
    const avgResponseSec = cell.timeCount > 0 ? round1(cell.timeSum / cell.timeCount) : null;
    const tt = topicTime.get(cell.topicKey);
    const classAvgResponseSec = tt && tt.count > 0 ? round1(tt.sum / tt.count) : null;
    return {
      studentId: cell.studentId,
      topicKey: cell.topicKey,
      answered: cell.answered,
      correct: cell.correct,
      accuracy,
      sessions: cell.sessions,
      avgResponseSec,
      level: levelFor({ answered: cell.answered, accuracy, avgResponseSec, classAvgResponseSec }),
    };
  });

  // ── Thẻ cảnh báo tổng hợp ──────────────────────────────────────────────
  const alerts = [];
  for (const topic of topics.values()) {
    let redCount = 0;
    let yellowCount = 0;
    for (const cell of cellList) {
      if (cell.topicKey !== topic.key) continue;
      if (cell.level === "red") redCount += 1;
      if (cell.level === "yellow") yellowCount += 1;
    }
    if (redCount > 0) {
      alerts.push({
        type: "red",
        topicKey: topic.key,
        label: topic.label,
        redCount,
        yellowCount,
        totalStudents: students.length,
        text: `Có ${redCount}/${students.length} học sinh đang gặp khó khăn ở kỹ năng ${topic.label}`,
      });
    } else if (yellowCount >= 2) {
      alerts.push({
        type: "yellow",
        topicKey: topic.key,
        label: topic.label,
        redCount,
        yellowCount,
        totalStudents: students.length,
        text: `Có ${yellowCount}/${students.length} học sinh cần lưu ý ở kỹ năng ${topic.label}`,
      });
    }
  }
  alerts.sort((a, b) => b.redCount - a.redCount || b.yellowCount - a.yellowCount);
  const topAlerts = alerts.slice(0, MAX_ALERTS);

  // ── Thống kê theo câu hỏi ──────────────────────────────────────────────
  const questionStatList = [...questionStats.values()]
    .map((st) => ({
      questionId: st.questionId,
      content: st.content,
      topicKey: st.topicKey,
      attempts: st.attempts,
      wrongCount: st.wrongCount,
      wrongRate: st.attempts > 0 ? Math.round((st.wrongCount / st.attempts) * 100) : 0,
      avgTimeSec: st.timeCount > 0 ? round1(st.timeSum / st.timeCount) : null,
    }))
    .sort((a, b) => b.wrongRate - a.wrongRate || b.attempts - a.attempts)
    .slice(0, MAX_QUESTION_STATS);

  const topicList = [...topics.values()].sort((a, b) => b.answered - a.answered);

  return {
    class: { id: cls.id, name: cls.name, code: cls.code || "" },
    students,
    topics: topicList,
    cells: cellList,
    alerts: topAlerts,
    questionStats: questionStatList,
    hasData: cellList.some((c) => c.answered > 0),
  };
}
