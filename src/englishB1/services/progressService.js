// progressService.js — kho tiến độ học tiếng Anh B1, lưu localStorage.
//
// Theo mẫu `src/lib/kidSettings.js`: module state + listeners +
// useSyncExternalStore → component re-render khi tiến độ đổi, không cần
// prop drilling, không đụng Backend (spec §15: LocalStorage, mở rộng API sau).
//
// Tiến độ là CỤC BỘ trên máy (không theo tài khoản) — giống các feature
// offline khác của app (kidSettings, coinWallet). Đổi/trang bị xoá thì mất,
// có nút resetProgress() trong trang Tiến độ.

import { useSyncExternalStore } from "react";
import { percentOf, todayKey, streakFromDates, dateKeyDaysAgo } from "../utils/learningUtils.js";

const KEY = "edu_english_b1_progress_v1";
const VERSION = 1;

/** Số ngày học liên tục tối đa lưu lại (tránh phình localStorage). */
const MAX_ACTIVE_DATES = 400;
/** Giới hạn lịch sử luyện tập. */
const MAX_ACTIVITY = 400;
/** Giới hạn lượt làm đề (giữ đề mới nhất). */
const MAX_EXAM_ATTEMPTS = 20;
/** Giới hạn bài nộp Writing. */
const MAX_WRITING_SUBMISSIONS = 20;
/** Kích thước bản ghi âm tối đa được lưu (base64) — quá to thì bỏ, giữ mốc đã ghi. */
const MAX_RECORDING_CHARS = 300000;

function freshDaily() {
  return { date: todayKey(), minutes: 0, questions: 0, correct: 0, words: 0 };
}

function defaults() {
  return {
    version: VERSION,
    startedAt: new Date().toISOString(),
    daily: freshDaily(),
    activeDates: [],
    vocabulary: {},
    grammar: {},
    listening: {},
    reading: {},
    writing: {},
    speaking: {},
    exams: {},
    activity: [],
    studySeconds: 0,
  };
}

/** Đọc từ localStorage, tự lấp field thiếu và reset bộ đếm ngày nếu sang ngày mới. */
function read() {
  const base = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return base;
    const merged = { ...base, ...parsed };
    // lấp các mục thiếu (phiên bản cũ thêm field mới)
    for (const k of ["vocabulary", "grammar", "listening", "reading", "writing", "speaking", "exams"]) {
      if (!merged[k] || typeof merged[k] !== "object") merged[k] = {};
    }
    if (!Array.isArray(merged.activity)) merged.activity = [];
    if (!Array.isArray(merged.activeDates)) merged.activeDates = [];
    if (!merged.daily || merged.daily.date !== todayKey()) merged.daily = freshDaily();
    if (!Number.isFinite(merged.studySeconds)) merged.studySeconds = 0;
    merged.version = VERSION;
    return merged;
  } catch {
    return base;
  }
}

let state = read();
let snapshot = state;
const listeners = new Set();

function commit() {
  snapshot = { ...state };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage đầy/bị chặn → vẫn giữ state trong phiên làm việc này.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

/** Snapshot hiện tại (đọc không mutate). */
export function getProgress() {
  return snapshot;
}

/** Hook reactive — component nào cần tiến độ thì gọi. */
export function useEnglishB1Progress() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Đánh dấu hôm nay có hoạt động (gọi ở mọi action). */
function touchToday() {
  const key = todayKey();
  if (!state.activeDates.includes(key)) {
    state.activeDates.push(key);
    if (state.activeDates.length > MAX_ACTIVE_DATES) {
      state.activeDates = state.activeDates.slice(-MAX_ACTIVE_DATES);
    }
  }
  if (state.daily.date !== key) state.daily = freshDaily();
}

function pushActivity(entry) {
  state.activity.unshift({ at: new Date().toISOString(), ...entry });
  if (state.activity.length > MAX_ACTIVITY) state.activity.length = MAX_ACTIVITY;
}

function lessonBucket(kind, refId) {
  if (!state[kind]) state[kind] = {};
  if (!state[kind][refId]) {
    state[kind][refId] = { attempts: 0, correct: 0, total: 0, best: 0, lastAt: null, done: false };
  }
  return state[kind][refId];
}

/**
 * Ghi kết quả 1 bài luyện (grammar | listening | reading).
 * @param {"grammar"|"listening"|"reading"} kind
 * @param {string} refId    id bài học
 * @param {{correct:number, total:number, label?:string}} result
 */
export function recordLessonResult(kind, refId, result = {}) {
  if (!["grammar", "listening", "reading"].includes(kind) || !refId) return;
  const correct = Number(result.correct) || 0;
  const total = Number(result.total) || 0;
  const bucket = lessonBucket(kind, refId);
  bucket.attempts += 1;
  bucket.correct += correct;
  bucket.total += total;
  const pct = percentOf(correct, total);
  bucket.best = Math.max(bucket.best || 0, pct);
  bucket.lastAt = new Date().toISOString();
  bucket.done = true;

  touchToday();
  state.daily.questions += total;
  state.daily.correct += correct;
  pushActivity({
    type: kind,
    refId,
    label: result.label || refId,
    score: pct,
  });
  commit();
}

/** Trạng thái 1 từ: new | learning | learned | review (SRS). */
export function getWordState(wordId) {
  return state.vocabulary[wordId] || null;
}

/**
 * Ghi 1 lần ôn từ (đúng/sai) → cập nhật level + thời điểm ôn lại (spaced
 * repetition). Sai không đá người học về "mới", chỉ hạ level.
 */
export function recordVocabularyReview(wordId, correct) {
  if (!wordId) return;
  const now = Date.now();
  const cur = state.vocabulary[wordId] || {
    status: "new", level: 0, correct: 0, wrong: 0, hard: false,
    lastReviewedAt: null, nextReviewAt: null,
  };
  cur.correct += correct ? 1 : 0;
  cur.wrong += correct ? 0 : 1;
  cur.level = Math.max(0, Math.min(6, (cur.level || 0) + (correct ? 1 : -1)));
  // level 0–1: đang học · 2–3: cần ôn tập · ≥4: đã nhớ · chưa học: level 0 & chưa ôn
  if (cur.level >= 4) cur.status = "learned";
  else if (cur.level >= 1) cur.status = cur.hard ? "review" : "learning";
  else cur.status = "learning";
  cur.lastReviewedAt = new Date().toISOString();
  cur.nextReviewAt = new Date(now + nextReviewDelayMs(cur.level, cur.hard)).toISOString();
  state.vocabulary[wordId] = cur;

  touchToday();
  state.daily.words += 1;
  state.daily.questions += 1;
  if (correct) state.daily.correct += 1;
  commit();
}

/** Khoảng cách ôn lại (ms) theo level — phương pháp lặp lại ngắt quãng. */
export function nextReviewDelayMs(level, hard) {
  const base = [5 * 60e3, 30 * 60e3, 6 * 3600e3, 24 * 3600e3, 3 * 86400e3, 7 * 86400e3, 14 * 86400e3];
  const idx = Math.max(0, Math.min(base.length - 1, level || 0));
  // Từ khó: luôn quay lại sớm hơn.
  return hard ? Math.round(base[idx] / 2) : base[idx];
}

/** Đánh dấu/bỏ đánh dấu "từ khó". */
export function setVocabularyHard(wordId, hard) {
  if (!wordId) return;
  const cur = state.vocabulary[wordId];
  if (!cur) {
    if (!hard) return;
    state.vocabulary[wordId] = {
      status: "review", level: 1, correct: 0, wrong: 0, hard: true,
      lastReviewedAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + nextReviewDelayMs(1, true)).toISOString(),
    };
  } else {
    cur.hard = !!hard;
    if (hard) cur.status = "review";
    else if (cur.status === "review") cur.status = cur.level >= 4 ? "learned" : "learning";
    cur.nextReviewAt = new Date(
      Date.now() + nextReviewDelayMs(cur.level || 0, cur.hard)
    ).toISOString();
  }
  commit();
}

/** Lưu bản nháp Writing (tự lưu khi gõ). */
export function saveWritingDraft(topicId, text) {
  if (!topicId) return;
  const cur = state.writing[topicId] || { draft: "", draftAt: null, submissions: [] };
  cur.draft = String(text || "");
  cur.draftAt = new Date().toISOString();
  state.writing[topicId] = cur;
  commit();
}

/** Nộp bài Writing (kèm kết quả chấm của scoringUtils.evaluateEssay). */
export function saveWritingSubmission(topicId, result) {
  if (!topicId || !result) return;
  const cur = state.writing[topicId] || { draft: "", draftAt: null, submissions: [] };
  cur.submissions = cur.submissions || [];
  cur.submissions.unshift({
    at: new Date().toISOString(),
    score: Number(result.score) || 0,
    text: String(result.text || "").slice(0, 20000),
    wordCount: result.wordCount || 0,
    criteria: result.criteria || [],
    suggestionsVi: result.suggestionsVi || [],
    isRuleBased: true,
  });
  if (cur.submissions.length > MAX_WRITING_SUBMISSIONS) cur.submissions.length = MAX_WRITING_SUBMISSIONS;
  cur.draft = "";
  cur.draftAt = null;
  state.writing[topicId] = cur;

  touchToday();
  pushActivity({
    type: "writing",
    refId: topicId,
    label: result.title || topicId,
    score: Number(result.score) || 0,
  });
  commit();
}

/**
 * Ghi 1 lượt luyện Speaking (ghi mic bằng MediaRecorder).
 * @param {string} topicId
 * @param {{recording?: string|null, durationSec?: number, label?: string}} payload
 *   `recording` là dataURL (base64) — quá lớn thì bỏ, vẫn lưu mốc đã luyện.
 */
export function recordSpeakingAttempt(topicId, payload = {}) {
  if (!topicId) return;
  const cur = state.speaking[topicId] || { attempts: 0, lastAt: null, done: false, recording: null };
  cur.attempts = (cur.attempts || 0) + 1;
  cur.lastAt = new Date().toISOString();
  cur.done = true;
  const rec = typeof payload.recording === "string" ? payload.recording : null;
  if (rec && rec.length <= MAX_RECORDING_CHARS) cur.recording = rec;
  else if (cur.recording && rec) cur.recording = null; // bản mới quá to → bỏ bản cũ
  if (Number.isFinite(payload.durationSec)) cur.durationSec = payload.durationSec;
  state.speaking[topicId] = cur;

  touchToday();
  pushActivity({
    type: "speaking",
    refId: topicId,
    label: payload.label || topicId,
    score: 0, // không có điểm chấm tự động → biểu đồ không vẽ điểm ảo
  });
  commit();
}

/**
 * Lưu 1 lượt làm đề thi.
 * @param {string} examId
 * @param {object} attempt  kết quả của examService.gradeExam + durationSec + answers
 */
export function saveExamAttempt(examId, attempt) {
  if (!examId || !attempt) return;
  const cur = state.exams[examId] || { attempts: [], best: 0 };
  cur.attempts = cur.attempts || [];
  cur.attempts.unshift({
    at: new Date().toISOString(),
    score: Number(attempt.score) || 0,
    scale: Number(attempt.scale) || 0,
    correct: Number(attempt.correct) || 0,
    wrong: Number(attempt.wrong) || 0,
    skipped: Number(attempt.skipped) || 0,
    durationSec: Number(attempt.durationSec) || 0,
    answers: attempt.answers || {},
    sections: attempt.sections || {},
  });
  if (cur.attempts.length > MAX_EXAM_ATTEMPTS) cur.attempts.length = MAX_EXAM_ATTEMPTS;
  cur.best = Math.max(cur.best || 0, Number(attempt.score) || 0);
  state.exams[examId] = cur;

  touchToday();
  pushActivity({
    type: "exam",
    refId: examId,
    label: attempt.label || examId,
    score: Number(attempt.score) || 0,
  });
  commit();
}

/** Ghi 1 mục lịch sử (dashboard hiển thị "Lịch sử luyện tập"). */
export function recordActivity(entry = {}) {
  if (!entry.type) return;
  touchToday();
  pushActivity(entry);
  commit();
}

/** Cộng thời gian học (trang nào có vòng đời học thì gọi khi unmount). */
export function addStudySeconds(sec) {
  const s = Math.max(0, Number(sec) || 0);
  if (!s) return;
  state.studySeconds += s;
  touchToday();
  state.daily.minutes = Math.round((state.studySeconds % 3600) / 60);
  commit();
}

/** Số ngày học liên tục. */
export function getStreakDays() {
  return streakFromDates(state.activeDates);
}

/** Danh sách ngày có hoạt động (dùng cho biểu đồ). */
export function getActiveDates() {
  return [...state.activeDates];
}

/** N ngày gần nhất có hoạt động (mới nhất trước). */
export function getRecentActiveDates(n = 14) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const key = dateKeyDaysAgo(i);
    if (state.activeDates.includes(key)) out.push(key);
  }
  return out;
}

/** Xoá toàn bộ tiến độ (nút trong trang Tiến độ, có xác nhận). */
export function resetProgress() {
  state = defaults();
  commit();
}

/** Test/dev: nạp lại từ localStorage (sau khi đổi tab khác ghi). */
export function reloadProgress() {
  state = read();
  commit();
}

// Đồng bộ giữa các tab cùng mở app (spec: dữ liệu không mất khi tải lại trang).
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    state = read();
    snapshot = { ...state };
    listeners.forEach((l) => l());
  });
}
