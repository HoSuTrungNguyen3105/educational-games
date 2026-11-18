// englishB1Service.js — tổng hợp số liệu cho Dashboard & trang Tiến độ.
// Đọc progressService (tiến độ) + data/index.js (tổng số bài) → các con số
// trang Dashboard hiển thị. Không ghi state, chỉ tính toán.

import {
  VOCAB_TOPICS, GRAMMAR_LESSONS, READING_LESSONS, LISTENING_LESSONS,
  WRITING_TOPICS, SPEAKING_TOPICS, EXAMS,
} from "../data/index.js";
import { getProgress, getStreakDays, getActiveDates } from "./progressService.js";
import { percentOf, ACTIVITY_LABELS, dateKeyDaysAgo, todayKey, gradeLabel } from "../utils/learningUtils.js";
import { skillLabel } from "../utils/scoringUtils.js";
import { countLearned, getDueWords } from "./vocabularyService.js";

const ALL_VOCAB = (VOCAB_TOPICS || []).flatMap((t) => t.words || []);

/** Tổng số "bài" của khóa học (để tính % hoàn thành). */
export function getCourseTotals() {
  return {
    vocabulary: ALL_VOCAB.length,
    vocabularyTopics: (VOCAB_TOPICS || []).length,
    grammar: (GRAMMAR_LESSONS || []).length,
    reading: (READING_LESSONS || []).length,
    listening: (LISTENING_LESSONS || []).length,
    writing: (WRITING_TOPICS || []).length,
    speaking: (SPEAKING_TOPICS || []).length,
    exams: (EXAMS || []).length,
  };
}

function bucketDone(buckets) {
  return Object.values(buckets || {}).filter((b) => b && b.done).length;
}

function bucketAvgBest(buckets) {
  const done = Object.values(buckets || {}).filter((b) => b && b.done && b.best > 0);
  if (!done.length) return null;
  return Math.round(done.reduce((s, b) => s + b.best, 0) / done.length);
}

function bucketTotals(buckets) {
  return Object.values(buckets || {}).reduce(
    (acc, b) => ({
      correct: acc.correct + (b?.correct || 0),
      total: acc.total + (b?.total || 0),
    }),
    { correct: 0, total: 0 }
  );
}

/**
 * Phân tích điểm theo từng kỹ năng (spec §12 "Phân tích điểm yếu").
 * `scored: false` → kỹ năng chưa có cách chấm tự động (Speaking) → UI phải
 * hiện "Chưa có dữ liệu/Chưa được đánh giá", không được bịa phần trăm.
 */
export function getSkillBreakdown(progress = getProgress()) {
  const learnedWords = countLearned(progress, ALL_VOCAB);
  const dueWords = getDueWords(progress, ALL_VOCAB).length;
  const vocabPercent = percentOf(learnedWords, ALL_VOCAB.length);

  const grammarAvg = bucketAvgBest(progress.grammar);
  const listeningAvg = bucketAvgBest(progress.listening);
  const readingAvg = bucketAvgBest(progress.reading);

  const writingBuckets = Object.values(progress.writing || {}).filter((w) => (w.submissions || []).length);
  const writingAvg = writingBuckets.length
    ? Math.round(
        writingBuckets.reduce((s, w) => s + (w.submissions[0].score || 0), 0) / writingBuckets.length
      )
    : null;

  const speakingDone = Object.values(progress.speaking || {}).filter((s) => s.done).length;
  const speakingPercent = percentOf(speakingDone, (SPEAKING_TOPICS || []).length);

  return [
    {
      key: "vocabulary",
      label: skillLabel("vocabulary"),
      percent: vocabPercent,
      scored: true,
      detailVi: `${learnedWords}/${ALL_VOCAB.length} từ đã nhớ`,
      hintVi: dueWords ? `${dueWords} từ đến hạn ôn lại` : "Chưa có từ đến hạn ôn",
    },
    {
      key: "grammar",
      label: skillLabel("grammar"),
      percent: grammarAvg,
      scored: grammarAvg !== null,
      detailVi: grammarAvg === null ? "Chưa làm bài nào" : `Điểm trung bình ${grammarAvg}%`,
      hintVi: `${bucketDone(progress.grammar)}/${GRAMMAR_LESSONS.length} chuyên đề đã học`,
    },
    {
      key: "listening",
      label: skillLabel("listening"),
      percent: listeningAvg,
      scored: listeningAvg !== null,
      detailVi: listeningAvg === null ? "Chưa làm bài nào" : `Điểm trung bình ${listeningAvg}%`,
      hintVi: `${bucketDone(progress.listening)}/${LISTENING_LESSONS.length} bài đã luyện`,
    },
    {
      key: "reading",
      label: skillLabel("reading"),
      percent: readingAvg,
      scored: readingAvg !== null,
      detailVi: readingAvg === null ? "Chưa làm bài nào" : `Điểm trung bình ${readingAvg}%`,
      hintVi: `${bucketDone(progress.reading)}/${READING_LESSONS.length} bài đã đọc`,
    },
    {
      key: "writing",
      label: skillLabel("writing"),
      percent: writingAvg,
      scored: writingAvg !== null,
      detailVi: writingAvg === null ? "Chưa nộp bài" : `Trung bình ${writingAvg}/100 (chấm theo quy tắc)`,
      hintVi: `${writingBuckets.length}/${WRITING_TOPICS.length} chủ đề đã nộp`,
    },
    {
      key: "speaking",
      label: skillLabel("speaking"),
      percent: speakingPercent,
      scored: false, // không có chấm tự động → không được dùng làm "điểm"
      detailVi: speakingDone ? `Đã luyện ${speakingDone} chủ đề` : "Chưa luyện nói",
      hintVi: "Phần nói chưa có chấm phát âm — chỉ ghi nhận số lượt luyện",
    },
  ];
}

/** Kỹ năng mạnh nhất / cần cải thiện (chỉ tính kỹ năng CÓ điểm). */
export function getStrongWeakSkills(progress = getProgress()) {
  const scored = getSkillBreakdown(progress).filter((s) => s.scored && s.percent !== null);
  if (scored.length < 2) return { strongest: null, weakest: null };
  const sorted = [...scored].sort((a, b) => b.percent - a.percent);
  return { strongest: sorted[0], weakest: sorted[sorted.length - 1] };
}

/** Điểm trung bình toàn khóa (các kỹ năng có điểm). */
export function getAverageScore(progress = getProgress()) {
  const scored = getSkillBreakdown(progress).filter((s) => s.scored && s.percent !== null);
  if (!scored.length) return 0;
  return Math.round(scored.reduce((s, x) => s + x.percent, 0) / scored.length);
}

/** Số câu đã luyện = tổng câu trong mọi bài + câu thi + lượt ôn từ. */
export function getQuestionsPracticed(progress = getProgress()) {
  const lesson = ["grammar", "listening", "reading"]
    .map((k) => bucketTotals(progress[k]))
    .reduce((a, b) => ({ correct: a.correct + b.correct, total: a.total + b.total }), { correct: 0, total: 0 });

  const examQuestions = Object.values(progress.exams || {}).reduce(
    (sum, e) => sum + (e.attempts || []).reduce((s, a) => s + (a.correct || 0) + (a.wrong || 0) + (a.skipped || 0), 0),
    0
  );
  const vocabReviews = Object.values(progress.vocabulary || {}).reduce(
    (sum, w) => sum + (w.correct || 0) + (w.wrong || 0), 0
  );
  return {
    total: lesson.total + examQuestions + vocabReviews,
    correct: lesson.correct
      + Object.values(progress.exams || {}).reduce((s, e) => s + (e.attempts || []).reduce((x, a) => x + (a.correct || 0), 0), 0)
      + vocabReviews,
  };
}

/** Bài đã học (grammar + listening + reading + writing đã nộp + speaking đã luyện). */
export function getLessonsStudied(progress = getProgress()) {
  const writing = Object.values(progress.writing || {}).filter((w) => (w.submissions || []).length).length;
  const speaking = Object.values(progress.speaking || {}).filter((s) => s.done).length;
  return {
    lessons: bucketDone(progress.grammar) + bucketDone(progress.listening) + bucketDone(progress.reading),
    writing,
    speaking,
    exams: Object.values(progress.exams || {}).filter((e) => (e.attempts || []).length).length,
    total:
      bucketDone(progress.grammar) + bucketDone(progress.listening) + bucketDone(progress.reading)
      + writing + speaking,
  };
}

/** % hoàn thành khóa học. */
export function getCoursePercent(progress = getProgress()) {
  const totals = getCourseTotals();
  const studied = getLessonsStudied(progress);
  const all = totals.grammar + totals.listening + totals.reading + totals.writing + totals.speaking;
  return percentOf(studied.total, all);
}

/** Mục tiêu học trong ngày (spec 3.1) — 20 câu/ngày. */
export const DAILY_GOAL_TARGET = 20;

export function getDailyGoal(progress = getProgress()) {
  const daily = progress.daily || { questions: 0, correct: 0, minutes: 0 };
  return {
    done: daily.questions,
    target: DAILY_GOAL_TARGET,
    percent: percentOf(daily.questions, DAILY_GOAL_TARGET),
    correct: daily.correct,
    minutes: daily.minutes || 0,
    finished: daily.questions >= DAILY_GOAL_TARGET,
  };
}

/** "Tiếp tục bài học gần nhất" — mục tiêu đầu tiên của spec §3.1. */
export function getContinueLesson(progress = getProgress()) {
  const entry = (progress.activity || [])[0];
  if (!entry) return null;
  const href = hrefFor(entry.type, entry.refId);
  if (!href) return null;
  return {
    kind: entry.type,
    refId: entry.refId,
    title: entry.label || entry.refId,
    kindLabel: ACTIVITY_LABELS[entry.type] || entry.type,
    at: entry.at,
    href,
  };
}

/** Đường dẫn về trang tương ứng (dùng cho "tiếp tục" + "đề xuất"). */
export function hrefFor(kind, refId) {
  switch (kind) {
    case "grammar": return `/english-b1/grammar?item=${encodeURIComponent(refId || "")}`;
    case "listening": return `/english-b1/listening?item=${encodeURIComponent(refId || "")}`;
    case "reading": return `/english-b1/reading?item=${encodeURIComponent(refId || "")}`;
    case "writing": return `/english-b1/writing?item=${encodeURIComponent(refId || "")}`;
    case "speaking": return `/english-b1/speaking?item=${encodeURIComponent(refId || "")}`;
    case "vocabulary": return `/english-b1/vocabulary`;
    case "exam": return `/english-b1/exams/${encodeURIComponent(refId || "")}`;
    default: return `/english-b1`;
  }
}

/**
 * Bài học được đề xuất (spec §3.1) — dựa trên kỹ năng yếu + bài chưa làm.
 * @returns {Array<{kind, refId, title, href, reasonVi}>}
 */
export function getSuggestions(progress = getProgress(), limit = 4) {
  const out = [];
  const { weakest } = getStrongWeakSkills(progress);

  const due = getDueWords(progress, ALL_VOCAB).length;
  if (due > 0) {
    out.push({
      kind: "vocabulary", refId: "due", title: `Ôn ${due} từ đến hạn`,
      href: "/english-b1/vocabulary", reasonVi: "Spaced repetition nhắc bạn ôn đúng lúc.",
    });
  }

  const firstUnset = (list, kind) => (list || []).find((item) => !progress[kind]?.[item.id]?.done);

  const byWeakness = {
    grammar: () => {
      const l = firstUnset(GRAMMAR_LESSONS, "grammar");
      return l && { kind: "grammar", refId: l.id, title: l.title, href: hrefFor("grammar", l.id), reasonVi: "Ôn thêm chuyên đề ngữ pháp." };
    },
    listening: () => {
      const l = firstUnset(LISTENING_LESSONS, "listening");
      return l && { kind: "listening", refId: l.id, title: l.title, href: hrefFor("listening", l.id), reasonVi: "Kỹ năng nghe còn yếu — luyện thêm." };
    },
    reading: () => {
      const l = firstUnset(READING_LESSONS, "reading");
      return l && { kind: "reading", refId: l.id, title: l.title, href: hrefFor("reading", l.id), reasonVi: "Đọc hiểu cần luyện thêm." };
    },
    vocabulary: () => {
      const topic = VOCAB_TOPICS.find((t) => (t.words || []).some((w) => (progress.vocabulary?.[w.id]?.status || "new") !== "learned"));
      return topic && { kind: "vocabulary", refId: topic.id, title: `Chủ đề ${topic.titleVi}`, href: "/english-b1/vocabulary", reasonVi: "Còn từ chưa học trong chủ đề này." };
    },
    writing: () => {
      const t = firstUnset(WRITING_TOPICS, "writing");
      return t && !(progress.writing?.[t.id]?.submissions || []).length
        ? { kind: "writing", refId: t.id, title: t.title, href: hrefFor("writing", t.id), reasonVi: "Nộp một bài viết để nhận đánh giá." }
        : null;
    },
    speaking: null,
  };

  if (weakest && byWeakness[weakest.key]) {
    const item = byWeakness[weakest.key]();
    if (item) out.push(item);
  }

  const unfinishedExam = (EXAMS || []).find((e) => !(progress.exams?.[e.id]?.attempts || []).length);
  if (unfinishedExam) {
    out.push({
      kind: "exam", refId: unfinishedExam.id, title: unfinishedExam.name,
      href: `/english-b1/exams/${unfinishedExam.id}`,
      reasonVi: "Bạn chưa thử đề thi này.",
    });
  }

  for (const kind of ["grammar", "reading", "listening"]) {
    const list = kind === "grammar" ? GRAMMAR_LESSONS : kind === "reading" ? READING_LESSONS : LISTENING_LESSONS;
    const item = firstUnset(list, kind);
    if (item) out.push({ kind, refId: item.id, title: item.title, href: hrefFor(kind, item.id), reasonVi: "Bài chưa hoàn thành." });
    if (out.length >= limit) break;
  }

  // Bỏ trùng theo href, giữ thứ tự ưu tiên.
  const seen = new Set();
  return out.filter((x) => (seen.has(x.href) ? false : (seen.add(x.href), true))).slice(0, limit);
}

/** Lịch sử luyện tập 14 ngày gần nhất (điểm TB theo ngày) cho biểu đồ. */
export function getHistory(progress = getProgress(), days = 14) {
  const byDate = new Map();
  for (const entry of progress.activity || []) {
    const d = String(entry.at || "").slice(0, 10);
    if (!d) continue;
    const arr = byDate.get(d) || [];
    arr.push(entry);
    byDate.set(d, arr);
  }
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = dateKeyDaysAgo(i);
    const list = byDate.get(key) || [];
    const scored = list.filter((x) => typeof x.score === "number" && x.score > 0);
    out.push({
      date: key,
      label: key.slice(8) + "/" + key.slice(5, 7), // "18/11"
      score: scored.length ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : 0,
      count: list.length,
      empty: list.length === 0,
    });
  }
  return out;
}

/** Lịch sử gần nhất để hiển thị list "Lịch sử luyện tập". */
export function getRecentActivity(progress = getProgress(), limit = 12) {
  return (progress.activity || []).slice(0, limit).map((a) => ({
    ...a,
    kindLabel: ACTIVITY_LABELS[a.type] || a.type,
    dateLabel: new Date(a.at).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }),
    grade: typeof a.score === "number" && a.score > 0 ? gradeLabel(a.score) : null,
  }));
}

/** Bộ sưu tập số liệu cho Dashboard (spec §3.1). */
export function getDashboard(progress = getProgress()) {
  const studied = getLessonsStudied(progress);
  const questions = getQuestionsPracticed(progress);
  const { strongest, weakest } = getStrongWeakSkills(progress);
  const totals = getCourseTotals();

  return {
    level: "B1",
    lessonsStudied: studied.total,
    questionsPracticed: questions.total,
    correctAnswers: questions.correct,
    accuracyPercent: percentOf(questions.correct, questions.total),
    avgScore: getAverageScore(progress),
    streakDays: getStreakDays(),
    coursePercent: getCoursePercent(progress),
    totals,
    strongestSkill: strongest,
    weakestSkill: weakest,
    continueLesson: getContinueLesson(progress),
    suggestions: getSuggestions(progress),
    dailyGoal: getDailyGoal(progress),
    history: getHistory(progress, 14),
    studyMinutes: Math.round((progress.studySeconds || 0) / 60),
    examsDone: studied.exams,
    activeToday: getActiveDates().includes(todayKey()),
  };
}

/** Số liệu trang Tiến độ (spec §12). */
export function getProgressReport(progress = getProgress()) {
  const studied = getLessonsStudied(progress);
  const questions = getQuestionsPracticed(progress);
  const examAttempts = Object.values(progress.exams || {}).reduce((s, e) => s + (e.attempts || []).length, 0);
  const examBest = Math.max(0, ...Object.values(progress.exams || {}).map((e) => e.best || 0));
  const skills = getSkillBreakdown(progress);
  const { strongest, weakest } = getStrongWeakSkills(progress);

  // Tiến độ từng nhóm (bar).
  const totals = getCourseTotals();
  const progressBars = [
    { key: "vocabulary", label: "Từ vựng", done: countLearned(progress, ALL_VOCAB), total: totals.vocabulary },
    { key: "grammar", label: "Ngữ pháp", done: bucketDone(progress.grammar), total: totals.grammar },
    { key: "reading", label: "Reading", done: bucketDone(progress.reading), total: totals.reading },
    { key: "listening", label: "Listening", done: bucketDone(progress.listening), total: totals.listening },
    { key: "writing", label: "Writing", done: studied.writing, total: totals.writing },
    { key: "speaking", label: "Speaking", done: studied.speaking, total: totals.speaking },
  ].map((x) => ({ ...x, percent: percentOf(x.done, x.total) }));

  return {
    level: "B1",
    studyMinutes: Math.round((progress.studySeconds || 0) / 60),
    lessonsDone: studied.total,
    examsDone: studied.exams,
    examAttempts,
    examBest,
    avgScore: getAverageScore(progress),
    accuracyPercent: percentOf(questions.correct, questions.total),
    questionsTotal: questions.total,
    streakDays: getStreakDays(),
    coursePercent: getCoursePercent(progress),
    skills,
    strongest,
    weakest,
    progressBars,
    history: getHistory(progress, 30),
    suggestions: getSuggestions(progress, 3),
    dailyGoal: getDailyGoal(progress),
  };
}
