// examService.js — đọc thư viện đề thi, chấm điểm và lưu lượt làm đề.
import { EXAMS } from "../data/exams/index.js";
import { gradeAnswer, scaleScore, scaleTen } from "../utils/scoringUtils.js";
import { getProgress, saveExamAttempt } from "./progressService.js";

/** Key của 1 câu trong bài thi: `listening:3` (trang làm bài dùng đúng key này). */
export function qkey(sectionId, questionId) {
  return `${sectionId}:${questionId}`;
}

/** Danh sách đề (kèm điểm cao nhất / số lượt từ tiến độ). */
export function listExams() {
  const progress = getProgress();
  return (EXAMS || []).map((exam) => {
    const saved = progress.exams?.[exam.id];
    return {
      id: exam.id,
      code: exam.code,
      name: exam.name,
      type: exam.type,
      level: exam.level,
      difficulty: exam.difficulty,
      durationMin: exam.durationMin,
      description: exam.description,
      questionCount: countObjectiveQuestions(exam),
      sections: exam.sections.map((s) => ({ id: s.id, skill: s.skill, title: s.title })),
      attempts: saved?.attempts?.length || 0,
      best: saved?.best || 0,
      lastAt: saved?.attempts?.[0]?.at || null,
      done: (saved?.attempts?.length || 0) > 0,
    };
  });
}

/** Lấy 1 đề thi (null nếu không có). */
export function getExam(examId) {
  return (EXAMS || []).find((e) => e.id === examId) || null;
}

/** Số câu chấm tự động (Listening + Reading). */
export function countObjectiveQuestions(exam) {
  return (exam?.sections || [])
    .filter((s) => Array.isArray(s.questions))
    .reduce((sum, s) => sum + s.questions.length, 0);
}

/** Số phần thi (Listening/Reading/Writing/Speaking). */
export function countSections(exam) {
  return exam?.sections?.length || 0;
}

/**
 * Chấm 1 lượt làm đề.
 * @param {object} exam   đề thi (data/exams)
 * @param {Record<string,*>} answers  key = qkey(sectionId, questionId)
 * @returns {{score:number, scale:number, correct:number, wrong:number,
 *            skipped:number, sections:object, details:Array}}
 */
export function gradeExam(exam, answers = {}) {
  const details = [];
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const sections = {};

  for (const section of exam?.sections || []) {
    if (!Array.isArray(section.questions)) {
      // Writing/Speaking: không có chấm tự động → ghi rõ "chưa được đánh giá".
      sections[section.id] = {
        skill: section.skill,
        title: section.title,
        graded: false,
        noteVi: "Chưa được đánh giá",
        reasonVi: section.skill === "writing"
          ? "Bài viết cần người/chấm AI chấm — hệ thống chưa tích hợp."
          : "Phần nói cần chấm phát âm/độ trôi chảy — hệ thống chưa tích hợp.",
      };
      continue;
    }
    let sCorrect = 0;
    let sWrong = 0;
    let sSkipped = 0;
    for (const q of section.questions) {
      const key = qkey(section.id, q.id);
      const given = answers[key];
      const isBlank = given === undefined || given === null || given === ""
        || (Array.isArray(given) && given.length === 0);
      const ok = !isBlank && gradeAnswer(q, given);
      if (isBlank) sSkipped += 1;
      else if (ok) sCorrect += 1;
      else sWrong += 1;
      details.push({
        key,
        sectionId: section.id,
        skill: section.skill,
        questionId: q.id,
        ok,
        skipped: isBlank,
        given,
        answer: q.answer,
        explanationVi: q.explanationVi || "",
        locationVi: q.locationVi || "",
        question: q.question,
      });
    }
    correct += sCorrect;
    wrong += sWrong;
    skipped += sSkipped;
    sections[section.id] = {
      skill: section.skill,
      title: section.title,
      graded: true,
      correct: sCorrect,
      wrong: sWrong,
      skipped: sSkipped,
      total: section.questions.length,
      score: scaleScore(sCorrect, section.questions.length),
    };
  }

  const totalObjective = correct + wrong + skipped;
  const score = scaleScore(correct, totalObjective);

  return {
    score,                       // 0–100 (Listening + Reading)
    scale: scaleTen(correct, totalObjective), // thang 10
    correct,
    wrong,
    skipped,
    total: totalObjective,
    sections,
    details,
  };
}

/** Lưu lượt làm đề vào tiến độ. */
export function saveAttempt(examId, attempt) {
  saveExamAttempt(examId, attempt);
}

export function getAttempts(examId) {
  return getProgress().exams?.[examId]?.attempts || [];
}

export function getBest(examId) {
  return getProgress().exams?.[examId]?.best || 0;
}

/** Lượt làm mới nhất (trang kết quả đọc cái này). */
export function getLatestAttempt(examId) {
  return getAttempts(examId)[0] || null;
}

/** Nhãn phân loại đề (spec §10.1). */
export const EXAM_TYPES = [
  { key: "basic", label: "Đề cơ bản" },
  { key: "intermediate", label: "Đề trung bình" },
  { key: "advanced", label: "Đề nâng cao" },
  { key: "comprehensive", label: "Đề tổng hợp" },
  { key: "mock", label: "Đề thi thử" },
];

export function examTypeLabel(type) {
  return EXAM_TYPES.find((t) => t.key === type)?.label || type;
}

export const DIFFICULTY_LABELS = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};
