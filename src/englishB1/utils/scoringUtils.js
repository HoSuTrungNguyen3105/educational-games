// scoringUtils.js — nơi DUY NHẤT chấm điểm trong phân hệ English B1.
// Mọi dạng câu hỏi (README §4.7) đều đi qua gradeAnswer/gradeItems.
//
// Nguyên tắc minh bạch: điểm Writing/Speaking KHÔNG được bịa — evaluateEssay
// trả về isRuleBased: true để giao diện ghi rõ "chấm theo bộ quy tắc, chưa tích
// hợp AI"; Speaking không có câu trả lời tự động → để "Chưa được đánh giá".

import { percentOf } from "./learningUtils.js";

/** Các type chấm bằng index của options. */
const OPTION_TYPES = new Set([
  "multiple_choice", "mcq", "comprehension", "vocabulary_in_context",
  "true_false", "true_false_not_given",
]);
const MATCHING_TYPES = new Set(["matching", "matching_headings", "matching_information"]);
/** Các type trả lời bằng chuỗi (gõ). */
const TEXT_TYPES = new Set([
  "fill_blank", "gap_filling", "short_answer", "word_formation",
  "error_correction", "sentence_transformation",
]);

/**
 * Chuẩn hoá câu trả lời để so sánh: bỏ hoa/thường, gộp khoảng trắng,
 * bỏ dấu chấm/dấu phẩy cuối câu. Không đụng dấu tiếng Việt (nội dung học
// có thể là tiếng Việt trong dạng "chọn nghĩa đúng" dạng text).
 */
export function normalizeAnswer(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:"“”'’]+$/g, "")
    .replace(/^[.,!?;:"“”'’]+/g, "");
}

/** "holiday/vacation" → ["holiday","vacation"] (đáp án linh hoạt). */
function acceptedAnswers(answer) {
  const list = Array.isArray(answer) ? answer : [answer];
  return list
    .flatMap((a) => String(a ?? "").split("/"))
    .map((a) => normalizeAnswer(a))
    .filter(Boolean);
}

/** given có chứa cụm từ đáp án nguyên vẹn không (dùng cho error_correction). */
function containsPhrase(given, phrase) {
  if (!phrase) return false;
  const g = ` ${given} `;
  return g.includes(` ${phrase} `) || g.includes(` ${phrase}.`) || g.includes(` ${phrase},`);
}

/**
 * Chấm MỘT câu.
 * @param {object} item   câu hỏi theo README §4.7
 * @param {*} given       câu trả lời của người học:
 *   index (number) cho type có options · string cho type gõ ·
 *   number[] cho matching · string[] (thứ tự từ) cho sentence_ordering
 * @returns {boolean}
 */
export function gradeAnswer(item, given) {
  if (!item) return false;
  const type = item.type;

  if (OPTION_TYPES.has(type)) {
    if (given === undefined || given === null || given === "") return false;
    return Number(given) === Number(item.answer);
  }

  if (MATCHING_TYPES.has(type)) {
    const g = Array.isArray(given) ? given : [];
    const a = Array.isArray(item.answer) ? item.answer : [];
    if (!a.length || g.length !== a.length) return false;
    return a.every((v, i) => Number(g[i]) === Number(v));
  }

  if (type === "sentence_ordering") {
    const correct = String(item.answer ?? (item.words || []).join(" "));
    const g = Array.isArray(given) ? given.join(" ") : String(given ?? "");
    if (!g.trim()) return false;
    return normalizeAnswer(g) === normalizeAnswer(correct);
  }

  if (TEXT_TYPES.has(type)) {
    const g = normalizeAnswer(given);
    if (!g) return false;
    const accepted = acceptedAnswers(item.answer);
    if (!accepted.length) return false;
    if (accepted.some((a) => a === g)) return true;
    // error_correction: người học thường gõ cả câu đã sửa.
    if (type === "error_correction" && accepted.some((a) => containsPhrase(g, a))) return true;
    return false;
  }

  // Không nhận type lạ → coi như sai (dữ liệu phải đúng contract).
  return false;
}

/**
 * Chấm một bộ câu.
 * @param {Array} items
 * @param {Record<string,*>} answers  key = String(item.id)
 * @returns {{correct:number, wrong:number, skipped:number,
 *            details:Array<{id:*, ok:boolean, skipped:boolean, given:*, answer:*}>}}
 */
export function gradeItems(items, answers = {}) {
  const details = [];
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  for (const item of items || []) {
    const given = answers[String(item.id)];
    const isBlank = given === undefined || given === null
      || given === "" || (Array.isArray(given) && given.length === 0);
    if (isBlank) {
      skipped += 1;
      details.push({ id: item.id, ok: false, skipped: true, given, answer: item.answer });
      continue;
    }
    const ok = gradeAnswer(item, given);
    if (ok) correct += 1;
    else wrong += 1;
    details.push({ id: item.id, ok, skipped: false, given, answer: item.answer });
  }
  return { correct, wrong, skipped, details };
}

/** Điểm phần trăm 0–100 (làm tròn). */
export function scaleScore(correct, total) {
  return percentOf(correct, total);
}

/** Điểm thang 10 (làm tròn 1 chữ số thập phân). */
export function scaleTen(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 1000) / 100;
}

/** So sánh danh sách đáp án (dùng cho màn xem lại bài thi). */
export function isAnswerCorrect(item, given) {
  return gradeAnswer(item, given);
}

// ───────────────────────────────────────────────────────────────────────────
// VIẾT (Writing) — chấm theo bộ quy tắc, KHÔNG giả lập AI.
// ───────────────────────────────────────────────────────────────────────────

const CONNECTORS = [
  "however", "therefore", "moreover", "furthermore", "nevertheless",
  "in addition", "on the other hand", "as a result", "in conclusion",
  "first", "second", "finally", "although", "because", "while", "besides",
];
const OPENERS = ["dear", "hi ", "hello", "i am writing", "i would like", "in my opinion"];
const CLOSERS = ["yours sincerely", "yours faithfully", "best regards", "kind regards", "in conclusion", "to sum up"];
const ADVANCED = [
  "significant", "importantly", "particularly", "essential", "beneficial",
  "challenge", "opportunity", "environment", "suggest", "recommend",
  "increase", "decrease", "various", "relevant", "adequate", "efficient",
  "although", "despite", "although", "consequently", "significant",
];
const COMMON_TYPOS = [
  "teh", "recieve", "definately", "occured", "alot", "wich", "becuase",
  "seperate", "tommorow", "untill", "begining", "wierd", "thier", "freind",
];

function wordsOf(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean);
}

function clamp(n, max = 20) {
  return Math.max(0, Math.min(max, Math.round(n)));
}

/**
 * Chấm bài viết theo 5 tiêu chí (spec §8.3), mỗi tiêu chí 0–20, tổng 0–100.
 * MỌI điểm số đều suy ra từ quy tắc công khai trong hàm này — giao diện phải
 * hiển thị kèm câu "Đánh giá theo bộ quy tắc cơ bản (chưa tích hợp AI)".
 *
 * @param {string} text   bài viết của người học
 * @param {object} topic  chủ đề Writing (README §4.5) — lấy minWords/maxWords/vocabHints
 */
export function evaluateEssay(text, topic = {}) {
  const raw = String(text || "");
  const words = wordsOf(raw);
  const wordCount = words.length;
  const lower = ` ${raw.toLowerCase()} `;
  const minWords = topic.minWords || 80;
  const maxWords = topic.maxWords || 120;
  const sentences = raw.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3);
  const paragraphs = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const notes = [];
  const suggestions = [];

  // 1) Task Achievement — đạt số từ, có mở/kết, đủ câu.
  let task = 0;
  if (wordCount >= minWords) task += 12;
  else task += Math.round((wordCount / minWords) * 12);
  if (wordCount > maxWords * 1.6) task -= 4;
  const hasOpener = OPENERS.some((k) => lower.includes(k)) || paragraphs.length >= 2;
  const hasCloser = CLOSERS.some((k) => lower.includes(k)) || /\b(in conclusion|to sum up|finally|look forward)\b/.test(lower);
  if (hasOpener) task += 4;
  if (hasCloser) task += 4;
  if (sentences.length < 4) {
    notes.push("Bài còn ít câu (dưới 4 câu hoàn chỉnh).");
    suggestions.push("Viết thêm câu để phát triển ý — mỗi đoạn ít nhất 2–3 câu.");
  }
  if (wordCount < minWords) {
    notes.push(`Bài có ${wordCount} từ, chưa đạt yêu cầu ${minWords}–${maxWords} từ.`);
    suggestions.push(`Thêm khoảng ${Math.max(1, minWords - wordCount)} từ nữa để đạt yêu cầu tối thiểu.`);
  } else if (wordCount > maxWords) {
    notes.push(`Bài có ${wordCount} từ, vượt yêu cầu ${minWords}–${maxWords} từ.`);
    suggestions.push("Cắt bớt ý phụ để giữ bài trong độ dài cho phép.");
  }

  // 2) Organization — đoạn, liên kết, thứ tự.
  let org = 0;
  if (paragraphs.length >= 2) org += 8;
  else if (paragraphs.length === 1) org += 4;
  const foundConnectors = CONNECTORS.filter((c) => lower.includes(` ${c}`));
  org += Math.min(8, foundConnectors.length * 2);
  if (/\b(first|second|then|finally|lastly)\b/.test(lower)) org += 4;
  if (foundConnectors.length === 0) {
    notes.push("Chưa có từ nối (however, therefore, in addition…).");
    suggestions.push("Thêm 2–3 từ nối để đoạn văn liền mạch hơn.");
  }
  if (paragraphs.length < 2) {
    suggestions.push("Chia bài thành ít nhất 2 đoạn: mở đầu và phần kết luận.");
  }

  // 3) Vocabulary — độ đa dạng + từ vựng chủ đề.
  const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z'-]/g, "")));
  const variety = words.length ? unique.size / words.length : 0;
  let vocab = clamp(variety * 24, 8);
  const hints = (topic.vocabularyHints || []).map((h) => String(h.word || "").toLowerCase()).filter(Boolean);
  const usedHints = hints.filter((h) => lower.includes(h));
  vocab += Math.min(8, usedHints.length * 3);
  const advancedUsed = new Set(ADVANCED.filter((a) => lower.includes(` ${a}`)));
  vocab += Math.min(4, advancedUsed.size * 2);
  if (hints.length && usedHints.length === 0) {
    suggestions.push(`Hãy dùng vài từ gợi ý của đề: ${(topic.vocabularyHints || []).slice(0, 3).map((h) => h.word).join(", ")}.`);
  }
  if (variety < 0.55 && words.length > 40) {
    notes.push("Từ lặp lại nhiều, độ đa dạng từ vựng còn thấp.");
    suggestions.push("Thay một số từ lặp bằng đồng nghĩa.");
  }

  // 4) Grammar — cấu trúc câu, thì, lỗi cơ bản.
  let grammar = 0;
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avgLen = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  const varied = new Set(lengths).size;
  grammar += Math.min(6, varied * 2);
  const tenseHits = ["have", "has", "had", "will", "would", "could", "should", "was", "were", "-ing", "ed"].filter((t) => lower.includes(t.replace("-", " ")));
  grammar += Math.min(6, tenseHits.length * 2);
  const repeated = words.filter((w, i) => i > 2 && words[i - 1]?.toLowerCase() === w.toLowerCase() && words[i - 2]?.toLowerCase() === w.toLowerCase());
  grammar += repeated.length ? 0 : 4;
  const startsOk = sentences.every((s) => /^[A-Z"']/.test(s));
  grammar += startsOk ? 4 : 0;
  if (!startsOk) suggestions.push("Mỗi câu phải bắt đầu bằng chữ hoa.");
  if (repeated.length) {
    notes.push("Có từ bị lặp lại 3 lần liên tiếp.");
    suggestions.push("Tránh lặp cùng một từ ở 3 câu liên tiếp.");
  }

  // 5) Spelling & Punctuation — dấu câu, lỗi chính tả thường gặp.
  let spelling = 0;
  const allEnded = (raw.match(/[.!?]/g) || []).length >= Math.max(1, sentences.length - 1);
  spelling += allEnded ? 6 : 2;
  spelling += /\s{2,}/.test(raw) ? 0 : 4;
  const typos = COMMON_TYPOS.filter((t) => new RegExp(`\\b${t}\\b`).test(lower));
  spelling += typos.length ? Math.max(0, 6 - typos.length * 3) : 6;
  const avgWordLen = words.length ? words.join("").length / words.length : 0;
  spelling += avgWordLen >= 3.6 ? 4 : 2;
  if (typos.length) {
    notes.push(`Có thể gõ sai: ${typos.join(", ")}.`);
    suggestions.push("Đọc lại một lần để bắt lỗi chính tả.");
  }
  if (/\s{2,}/.test(raw)) suggestions.push("Bỏ khoảng trắng thừa giữa các từ.");
  if (!allEnded) suggestions.push("Kết thúc mỗi câu bằng dấu chấm/dấu chấm hỏi.");

  const criteria = [
    { key: "task", labelVi: "Task Achievement", score: clamp(task), max: 20, noteVi: `Đạt ${wordCount}/${minWords}–${maxWords} từ.` },
    { key: "organization", labelVi: "Organization", score: clamp(org), max: 20, noteVi: `${paragraphs.length} đoạn · ${foundConnectors.length} từ nối.` },
    { key: "vocabulary", labelVi: "Vocabulary", score: clamp(vocab), max: 20, noteVi: `Đa dạng từ ${Math.round(variety * 100)}% · dùng ${usedHints.length}/${hints.length} từ gợi ý.` },
    { key: "grammar", labelVi: "Grammar", score: clamp(grammar), max: 20, noteVi: `${sentences.length} câu · trung bình ${Math.round(avgLen)} từ/câu.` },
    { key: "spelling", labelVi: "Spelling and Punctuation", score: clamp(spelling), max: 20, noteVi: typos.length ? `Lỗi thường gặp: ${typos.join(", ")}.` : "Không thấy lỗi chính tả phổ biến." },
  ];
  const score = criteria.reduce((s, c) => s + c.score, 0);

  return {
    score,
    max: 100,
    wordCount,
    criteria,
    notesVi: notes,
    suggestionsVi: suggestions,
    isRuleBased: true,
    methodVi: "Đánh giá theo bộ quy tắc cơ bản — chưa tích hợp AI.",
  };
}

/** Nhãn mức điểm dùng chung (dashboard/kết quả). */
export function scoreBand(percent) {
  if (percent >= 80) return { label: "Tốt", tone: "teal" };
  if (percent >= 60) return { label: "Khá", tone: "gold" };
  if (percent >= 40) return { label: "Cần cải thiện", tone: "ticket" };
  return { label: "Yếu", tone: "ticket" };
}

/** Tên kỹ năng tiếng Việt. */
export function skillLabel(key) {
  const map = {
    vocabulary: "Từ vựng",
    grammar: "Ngữ pháp",
    listening: "Listening",
    reading: "Reading",
    writing: "Writing",
    speaking: "Speaking",
  };
  return map[key] || key;
}
