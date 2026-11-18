// vocabularyService.js — logic học/ôn từ vựng: trạng thái SRS, tiến độ theo
// chủ đề và dựng bộ câu hỏi luyện tập (dạng câu đúng README §4.7).
import { buildDistractors, shuffle, sample, percentOf } from "../utils/learningUtils.js";

/** Trạng thái 1 từ: "new" | "learning" | "learned" | "review". */
export function getWordStatus(progress, wordId) {
  const entry = progress?.vocabulary?.[wordId];
  if (!entry) return "new";
  return entry.status || "new";
}

/** Từ nào đến hạn ôn lại (nextReviewAt <= now). */
export function getDueWords(progress, words) {
  const now = Date.now();
  return (words || []).filter((w) => {
    const entry = progress?.vocabulary?.[w.id];
    if (!entry || !entry.nextReviewAt) return false;
    const t = Date.parse(entry.nextReviewAt);
    return Number.isFinite(t) && t <= now;
  });
}

/** Số từ đã nhớ / đang học / cần ôn trong một chủ đề. */
export function getTopicProgress(progress, topicWords) {
  const list = topicWords || [];
  const stat = { learned: 0, learning: 0, review: 0, new: 0, total: list.length, percent: 0 };
  for (const w of list) {
    const status = getWordStatus(progress, w.id);
    if (stat[status] !== undefined) stat[status] += 1;
    else stat.new += 1;
  }
  stat.percent = percentOf(stat.learned, stat.total);
  return stat;
}

/** Tổng số từ "đã nhớ" trên toàn bộ kho từ. */
export function countLearned(progress, allWords) {
  return (allWords || []).filter((w) => getWordStatus(progress, w.id) === "learned").length;
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Dựng bộ câu hỏi luyện tập.
 *
 * @param {Array} words   từ vựng của phiên (đã lọc chủ đề/đến hạn)
 * @param {"meaning"|"fill_blank"|"matching"|"listening"|"flashcard"} mode
 * @param {{rng?:() => number, count?:number}|(() => number)} [third]
 *        rng để câu hỏi ổn định khi ôn lại cùng phiên; count = số câu tối đa.
 * @returns {Array} item cho QuestionCard (README §4.7) hoặc chính `words`
 *                  khi mode = "flashcard" (trang tự dựng thẻ).
 */
export function buildPracticeItems(words, mode, third) {
  const opts = typeof third === "function" ? { rng: third } : (third || {});
  const rng = opts.rng || Math.random;
  const list = sample(words, opts.count || (mode === "flashcard" ? (words || []).length : 10), rng);
  const allMeanings = (words || []).map((w) => w.meaningVi);

  if (mode === "flashcard") return list;

  if (mode === "meaning") {
    return list.map((w, i) => {
      const distractors = buildDistractors(w.meaningVi, allMeanings, 3, [], rng);
      const options = shuffle([w.meaningVi, ...distractors], rng);
      return {
        id: `${w.id}-m${i}`,
        wordId: w.id,
        type: "multiple_choice",
        question: `Nghĩa của từ "${w.word}" là gì?`,
        options,
        answer: options.indexOf(w.meaningVi),
        explanationVi: `"${w.word}" ${w.ipa || ""} → ${w.meaningVi}. Ví dụ: ${w.example} (${w.exampleVi})`,
      };
    });
  }

  if (mode === "fill_blank") {
    return list.map((w, i) => {
      // Tìm đúng dạng từ trong câu (giữ nguyên đuôi/số) rồi bỏ trống chỗ đó.
      const re = new RegExp(`\\b${escapeRegExp(w.word)}\\b`, "i");
      const match = String(w.example || "").match(re);
      const answer = match ? match[0] : w.word;
      const blurred = String(w.example || "").replace(re, "______");
      return {
        id: `${w.id}-f${i}`,
        wordId: w.id,
        type: "fill_blank",
        question: `Điền từ còn thiếu: "${blurred}"`,
        answer,
        placeholder: "Nhập từ tiếng Anh…",
        explanationVi: `Đáp án "${answer}". ${w.exampleVi || ""}`.trim(),
      };
    });
  }

  if (mode === "matching") {
    const picked = list.slice(0, 5);
    const options = shuffle(picked.map((w) => w.meaningVi), rng);
    return [
      {
        id: `match-${Date.now().toString(36)}`,
        type: "matching",
        question: "Ghép từ với nghĩa tương ứng",
        items: picked.map((w) => w.word),
        options,
        answer: picked.map((w) => options.indexOf(w.meaningVi)),
        explanationVi: picked.map((w) => `${w.word} → ${w.meaningVi}`).join(" · "),
        wordIds: picked.map((w) => w.id),
      },
    ];
  }

  if (mode === "listening") {
    return list.map((w, i) => {
      const sentence = String(w.example || "");
      // Từ gây nhiễu không được xuất hiện trong câu (tránh 2 đáp án đúng).
      const pool = (words || [])
        .filter((x) => x.id !== w.id && !sentence.toLowerCase().includes(x.word.toLowerCase()))
        .map((x) => x.word);
      const distractors = buildDistractors(w.word, pool.length ? pool : (words || []).map((x) => x.word), 3, [], rng);
      const options = shuffle([w.word, ...distractors], rng);
      return {
        id: `${w.id}-l${i}`,
        wordId: w.id,
        type: "multiple_choice",
        question: "Nghe câu và chọn từ được nhắc đến:",
        options,
        answer: options.indexOf(w.word),
        audioText: sentence,   // AudioPlayer đọc câu này bằng TTS
        audioLabel: `Câu mẫu của từ "${w.word}"`,
        explanationVi: `Đáp án "${w.word}" — ${w.meaningVi}. ${w.exampleVi || ""}`.trim(),
      };
    });
  }

  return [];
}

/** Các chế độ học từ vựng (hiển thị trên trang). */
export const VOCAB_MODES = [
  { key: "meaning", label: "Chọn nghĩa đúng", icon: "ListChecks", desc: "Nghe/đọc từ, chọn nghĩa đúng" },
  { key: "fill_blank", label: "Điền từ còn thiếu", icon: "PenLine", desc: "Hoàn thành câu có từ bỏ trống" },
  { key: "matching", label: "Ghép từ với nghĩa", icon: "Link2", desc: "Nối từng từ với nghĩa của nó" },
  { key: "listening", label: "Nghe và chọn từ", icon: "Headphones", desc: "Nghe câu mẫu, chọn từ được nói" },
  { key: "flashcard", label: "Lật thẻ ghi nhớ", icon: "Layers", desc: "Lật thẻ: từ ↔ nghĩa + ví dụ" },
];
