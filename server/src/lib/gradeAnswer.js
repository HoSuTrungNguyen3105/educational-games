/**
 * gradeAnswer.js — Chấm điểm câu trả lời ở phía server.
 *
 * Tách riêng thành lib để dùng chung cho:
 *   - routes/assignments.js  (nộp bài assignment)
 *   - services/gamePlayService.js (hoàn thành ván chơi)
 *
 * Không đổi hành vi so với logic cũ trong assignmentService.submitAnswers:
 *   - fill-in / text  : so sánh không phân biệt hoa thường, trim
 *   - multiple choice  : so sánh theo key của option
 */

const TEXT_TYPES = ["fill-in", "text", "fill_in"];

export function isTextQuestion(question) {
  const type = question?.questionType || question?.type || "multiple_choice";
  return TEXT_TYPES.includes(String(type).toLowerCase());
}

export function correctKeyOf(question) {
  return question?.correctAnswer ?? question?.answer ?? null;
}

/** Danh sách phương án của câu hỏi, đã chuẩn hoá về `{ id, content }`. */
export function normalizedOptions(question) {
  const raw = question?.options ?? question?.answers;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((opt) => {
      if (opt == null) return null;
      if (typeof opt === "string") return { id: opt, content: opt };
      const id = opt.id ?? opt.key ?? opt.value ?? null;
      const content = opt.content ?? opt.text ?? opt.label ?? opt.value ?? String(id ?? "");
      return id == null ? null : { id, content };
    })
    .filter(Boolean);
}

/**
 * Đổi key của phương án (id/key) thành nội dung hiển thị.
 * Trả về nguyên chuỗi đã gửi nếu không khớp phương án nào (câu tự điền).
 */
export function resolveOptionText(question, optionKey) {
  if (optionKey == null) return null;
  if (isTextQuestion(question)) return String(optionKey);
  const hit = normalizedOptions(question).find(
    (o) => o.id === optionKey || String(o.id).toLowerCase() === String(optionKey).toLowerCase()
  );
  return hit ? hit.content : String(optionKey);
}

/** So sánh 1 đáp án với đáp án đúng của câu hỏi. */
export function isAnswerCorrect(question, value) {
  const expected = correctKeyOf(question);
  if (isTextQuestion(question)) {
    return String(value ?? "").trim().toLowerCase() === String(expected ?? "").trim().toLowerCase();
  }
  if (value == null || expected == null) return false;
  if (value === expected) return true;
  // Cho phép so khớp khi client gửi chữ số thay vì key của option
  return String(value) === String(expected);
}

/** Điểm mặc định khi câu hỏi không khai báo `points`. */
export const DEFAULT_POINTS = 10;

/** Bonus theo tốc độ, tối đa 40 điểm — cùng công thức với socket.js. */
const TIME_BONUS_MAX = 40;

/**
 * Bonus tốc độ của 1 câu.
 * Câu hỏi không có `timeLimit` → 0.
 * Client không gửi `timeSpent` → coi như trả lời ngay → bonus tối đa.
 */
function timeBonus(question, timeSpent) {
  const limit = Number(question?.timeLimit);
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  const spent = Number(timeSpent);
  const remaining = Number.isFinite(spent) ? Math.max(0, limit - spent) : limit;
  return Math.round((Math.min(remaining, limit) / limit) * TIME_BONUS_MAX);
}

/**
 * Chấm cả bài.
 *
 * @param {Array} questions  danh sách câu hỏi (đã lấy từ DB, có correctAnswer)
 * @param {Array} answers    [{ questionId, value, timeSpent? }]
 * @param {object} [opts]
 * @param {number} [opts.totalTimeSec]  tổng thời gian ván chơi (chỉ để log/debug)
 * @returns {{score, correctCount, wrongCount, totalQuestions, answered, accuracy, breakdown}}
 */
export function gradeAnswers(questions, answers, { totalTimeSec = 0 } = {}) {
  const list = Array.isArray(questions) ? questions : [];
  const byId = new Map();
  for (const q of list) {
    if (q?.id) byId.set(q.id, q);
  }

  const totalQuestions = list.length;
  let correctCount = 0;
  let wrongCount = 0;
  let score = 0;
  const breakdown = [];

  for (const ans of Array.isArray(answers) ? answers : []) {
    const question = byId.get(ans?.questionId);
    if (!question) {
      wrongCount++;
      breakdown.push({ questionId: ans?.questionId ?? null, isCorrect: false, earned: 0 });
      continue;
    }

    const isCorrect = isAnswerCorrect(question, ans?.value);
    let earned = 0;
    if (isCorrect) {
      correctCount++;
      const base = Number.isFinite(Number(question.points)) ? Number(question.points) : DEFAULT_POINTS;
      earned = base + timeBonus(question, ans?.timeSpent);
      score += earned;
    } else {
      wrongCount++;
    }

    breakdown.push({
      questionId: question.id,
      isCorrect,
      earned,
      points: Number.isFinite(Number(question.points)) ? Number(question.points) : DEFAULT_POINTS,
    });
  }

  const answered = correctCount + wrongCount;
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;

  return {
    score,
    correctCount,
    wrongCount,
    totalQuestions,
    answered,
    accuracy,
    // totalTimeSec giữ lại để caller dùng (log/debug), không ảnh hưởng chấm điểm.
    totalTimeSec,
    breakdown,
  };
}