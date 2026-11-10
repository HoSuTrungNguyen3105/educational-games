// services/aiChatContext.js
//
// Ngữ cảnh phụ trợ cho chat "AI Bạn Học" (nâng cấp theo Nang_cap_AI_Ban_Hoc.md):
//
//  - §5.6 Ngày giờ Việt Nam: lấy MỚI mỗi request bằng timezone Asia/Ho_Chi_Minh
//    tường minh — không dựa vào timezone mặc định của máy chủ (Render chạy UTC).
//  - §4 + §5.7 (get_my_learning_context / get_my_recent_results): tóm tắt học
//    tập TỐI THIỂU của CHÍNH người dùng đã xác thực, tính bằng cùng bộ tính
//    aiLearningMetrics của tính năng phân tích học tập. Đây là intent routing
//    ở tầng Backend: Backend quyết định dữ liệu nào được đưa vào ngữ cảnh,
//    model không tự gọi tool, không tự truy cập database.
//  - §5.5 + §5.7 (search_lesson_materials): truy xuất đoạn văn bản liên quan
//    trong các bài học ĐÃ XUẤT BẢN (mọi học sinh đều xem được ở #/lessons)
//    bằng khớp từ khoá/cụm từ trên DỮ LIỆU THẬT. Đây không phải RAG embedding:
//    không chunk/vector, không bịa đoạn trích — chỉ lấy nguyên văn các đoạn
//    khớp, kèm tên bài để frontend hiển thị nguồn. Bài nháp (draft) không bao
//    giờ được truy xuất.
//
// An toàn:
//  - Mọi truy vấn đều chốt theo userId lấy từ token đã xác thực (req.user.sub),
//    KHÔNG nhận userId từ client.
//  - Chỉ đưa số liệu TỔNG HỢP tối thiểu vào prompt — không tên, email, id.
//  - Mọi lỗi đọc dữ liệu phụ đều bị nuốt: thiếu ngữ cảnh thì chat vẫn chạy
//    bình thường, không để lỗi phụ làm sập tính năng chính (§7).

import { getCollection } from "../db.js";
import { computeLearningMetrics, topicDisplayName } from "./aiLearningMetrics.js";

// ─────────────────────── §5.6 Ngày giờ Việt Nam ───────────────────────

const VN_TIME_ZONE = "Asia/Ho_Chi_Minh";
const vnDateTimeFormat = new Intl.DateTimeFormat("vi-VN", {
  timeZone: VN_TIME_ZONE,
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Chuỗi ngày giờ hiện tại theo giờ Việt Nam, ví dụ "Thứ Ba, 10/11/2026, 08:43". */
export function vietnamNowText(now = new Date()) {
  return vnDateTimeFormat.format(now);
}

// ─────────────── §4/§5.7 Tóm tắt học tập của chính user ───────────────

const LEARNING_RESULTS_LIMIT = 200;

/**
 * Rút tóm tắt chat từ bộ chỉ số đầy đủ: chỉ giữ số tổng hợp + tối đa vài chủ
 * đề — đủ để AI cá nhân hoá cách giải thích, không phơi dữ liệu thô.
 * Hàm thuần để test.
 */
export function metricsToChatSummary(metrics) {
  if (!metrics || !metrics.totalPlays) return null;
  const topics = (metrics.topics || []).filter((t) => (t.questionsOffered || 0) > 0);
  const enough = topics.filter((t) => t.questionsOffered >= 5);
  const byAccuracyDesc = [...enough].sort((a, b) => b.accuracy - a.accuracy);
  return {
    totalPlays: metrics.totalPlays,
    totalQuestionsOffered: metrics.totalQuestionsOffered,
    accuracy: metrics.accuracy,
    recentTopics: topics.slice(0, 3).map((t) => topicDisplayName(t)),
    strongTopics: byAccuracyDesc.slice(0, 2)
      .map((t) => `${topicDisplayName(t)} (${t.accuracy}%)`),
    weakTopics: byAccuracyDesc.slice(-2).reverse()
      .filter((t) => !byAccuracyDesc.slice(0, 2).includes(t))
      .map((t) => `${topicDisplayName(t)} (${t.accuracy}%)`),
  };
}

/** Nạp + tính tóm tắt học tập của chính user. Trả null khi chưa có dữ liệu. */
export async function loadChatLearningSummary(userId) {
  if (!userId) return null;
  const uid = String(userId);
  const results = await getCollection("results")
    .find(
      { userId: uid, verified: true },
      {
        projection: {
          _id: 0, userId: 1, gameId: 1, score: 1, correctAnswers: 1,
          totalQuestions: 1, accuracy: 1, completionTime: 1, xpGained: 1,
          verified: 1, createdAt: 1,
        },
      },
    )
    .sort({ createdAt: -1 })
    .limit(LEARNING_RESULTS_LIMIT)
    .toArray();
  if (results.length === 0) return null;

  const gameIds = [...new Set(results.map((r) => r.gameId).filter(Boolean).map(String))];
  const gameIndex = new Map();
  if (gameIds.length > 0) {
    const games = await getCollection("games")
      .find(
        { $or: [{ id: { $in: gameIds } }, { code: { $in: gameIds } }] },
        { projection: { _id: 1, id: 1, code: 1, name: 1, subject: 1, topic: 1 } },
      )
      .toArray();
    for (const g of games) {
      const view = { name: g.name ?? null, subject: g.subject ?? null, topic: g.topic ?? null };
      for (const key of [g._id, g.id, g.code]) {
        if (key != null && String(key).trim() !== "") gameIndex.set(String(key), view);
      }
    }
  }

  const { metrics } = computeLearningMetrics(results, gameIndex, null, null);
  return metricsToChatSummary(metrics);
}

// ───────────── §5.5 Truy xuất bài học đã xuất bản theo từ khoá ─────────────

const PUBLISHED_LESSONS_SCAN_LIMIT = 50;
const MAX_MATERIAL_LESSONS = 2;
const MAX_EXCERPTS_PER_LESSON = 2;
const MAX_EXCERPT_CHARS = 600;

/** Từ nối/câu hỏi tiếng Việt — bỏ khi rút từ khoá để tránh khớp nhiễu. */
const STOPWORDS = new Set([
  "là", "gì", "có", "không", "của", "cho", "mình", "bạn", "em", "tôi",
  "hãy", "giải", "thích", "với", "và", "trong", "này", "đó", "được",
  "một", "các", "những", "như", "thế", "nào", "khi", "thì", "ạ", "nhé",
  "ơi", "về", "theo", "ở", "ra", "vào", "làm", "sao", "bao", "nhiêu",
  "muốn", "cần", "biết", "hỏi", "xin", "giúp", "vì", "nên", "hay",
]);

function tokensOf(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Từ khoá đơn (≥2 ký tự, không phải từ nối) — tối đa 8, giữ thứ tự xuất hiện. */
export function extractKeywords(text) {
  const seen = new Set();
  for (const w of tokensOf(text)) {
    if (w.length >= 2 && !STOPWORDS.has(w)) seen.add(w);
  }
  return [...seen].slice(0, 8);
}

/** Cụm 2 từ liên tiếp trong DÃY TỪ NỘI DUNG (đã bỏ từ nối) — khớp cụm chính xác hơn khớp từng từ rời. */
export function extractPhrases(text) {
  const content = tokensOf(text).filter((w) => w.length >= 2 && !STOPWORDS.has(w));
  const phrases = new Set();
  for (let i = 0; i + 1 < content.length; i++) phrases.add(content[i] + " " + content[i + 1]);
  return [...phrases].slice(0, 6);
}

/** Điểm khớp của một đoạn văn: cụm từ = 2 điểm, từ đơn = 1 điểm. Hàm thuần để test. */
export function matchScore(text, keywords, phrases) {
  const hay = String(text || "").toLowerCase();
  let score = 0;
  for (const p of phrases) if (hay.includes(p)) score += 2;
  for (const k of keywords) if (hay.includes(k)) score += 1;
  return score;
}

const TEXT_ELEMENT_TYPES = new Set(["title", "text", "note"]);

/**
 * Các đoạn văn bản THẬT của một bài học: tiêu đề/mô tả/mục tiêu + nội dung các
 * phần tử chữ của từng trang. Không lấy phần tử câu hỏi (prompt/đáp án) — đó
 * không phải tài liệu giảng dạy và tránh lộ đáp án vào ngữ cảnh chat.
 */
export function lessonTextChunks(lesson) {
  const chunks = [];
  if (lesson.title) chunks.push(String(lesson.title));
  if (lesson.description) chunks.push(String(lesson.description));
  if (lesson.objectives) chunks.push(String(lesson.objectives));
  for (const page of Array.isArray(lesson.pages) ? lesson.pages : []) {
    for (const el of Array.isArray(page?.elements) ? page.elements : []) {
      if (TEXT_ELEMENT_TYPES.has(el?.type) && typeof el?.props?.text === "string") {
        chunks.push(el.props.text);
      }
    }
  }
  return chunks;
}

function collapseWs(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

/**
 * Tìm tối đa 2 bài học đã xuất bản liên quan nhất tới câu hỏi.
 * @returns {Promise<Array<{title, subject, grade, excerpts: string[]}>>}
 */
export async function searchLessonMaterials(message) {
  const keywords = extractKeywords(message);
  const phrases = extractPhrases(message);
  if (keywords.length === 0 && phrases.length === 0) return [];

  const lessons = await getCollection("lessons")
    .find(
      { status: "published" },
      {
        projection: {
          _id: 0, id: 1, title: 1, subject: 1, grade: 1,
          description: 1, objectives: 1, pages: 1,
        },
      },
    )
    .sort({ publishedAt: -1 })
    .limit(PUBLISHED_LESSONS_SCAN_LIMIT)
    .toArray();

  const scored = [];
  for (const lesson of lessons) {
    const chunks = lessonTextChunks(lesson)
      .map((text) => ({ text, score: matchScore(text, keywords, phrases) }))
      .filter((c) => c.score >= 2)
      // Hoà điểm thì ưu tiên đoạn DÀI hơn: tiêu đề/mô tả ngắn không được
      // chiếm suất trích dẫn của đoạn nội dung thật.
      .sort((a, b) => b.score - a.score || b.text.length - a.text.length);
    if (chunks.length === 0) continue;
    scored.push({
      lesson,
      total: chunks.reduce((s, c) => s + c.score, 0),
      excerpts: chunks.slice(0, MAX_EXCERPTS_PER_LESSON)
        .map((c) => collapseWs(c.text).slice(0, MAX_EXCERPT_CHARS)),
    });
  }
  scored.sort((a, b) => b.total - a.total);
  return scored.slice(0, MAX_MATERIAL_LESSONS).map(({ lesson, excerpts }) => ({
    title: lesson.title,
    subject: lesson.subject ?? null,
    grade: lesson.grade ?? null,
    excerpts,
  }));
}

// ─────────────────────── Điểm vào dùng chung ───────────────────────

/**
 * Dựng toàn bộ ngữ cảnh cho MỘT lượt chat của người dùng đã xác thực.
 * Trả { dateTimeText, learning, materials } — phần nào lỗi/thiếu thì để
 * null/rỗng, KHÔNG ném lỗi ra ngoài.
 */
export async function buildChatContext(req, message) {
  const context = { dateTimeText: vietnamNowText(), learning: null, materials: [] };
  const userId = req?.user?.sub;
  if (!userId) return context;
  try {
    context.learning = await loadChatLearningSummary(userId);
  } catch (e) {
    console.warn(`[ai] Không nạp được tóm tắt học tập cho chat: ${e?.message || e}`);
  }
  try {
    context.materials = await searchLessonMaterials(message);
  } catch (e) {
    console.warn(`[ai] Không truy xuất được bài học cho chat: ${e?.message || e}`);
  }
  return context;
}
