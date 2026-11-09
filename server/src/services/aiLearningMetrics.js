// services/aiLearningMetrics.js
//
// Port từ LearningMetricsCalculator.java + Narrative.fallback của
// AiLearningAnalysisService.java — phần TÍNH SỐ LIỆU học tập cho đường Ollama
// trực tiếp. Nguyên tắc giữ nguyên: LLM KHÔNG BAO GIỜ tự tính điểm hay kết luận;
// mọi chỉ số ở đây đều tính xác định từ bản ghi `results` do backend truyền xuống,
// chỉ dùng hai số chắc chắn có: correctAnswers và totalQuestions, cộng accuracy
// backend đã lưu sẵn.

import { AiBackendError } from "./aiBackendError.js";

/** Làm tròn 1 chữ số thập phân như Java Math.round(v * 10) / 10. */
export function round1(v) {
  return Math.round(v * 10) / 10;
}

/** Số chủ đề tối đa giữ lại (đủ để diễn giải mà không nhồi prompt). */
const MAX_TOPICS = 10;
/** Ngưỡng dưới đó coi như chưa đủ dữ liệu để kết luận ở MỘT chủ đề. */
export const MIN_QUESTIONS_PER_TOPIC = 5;
/** Chênh lệch tối thiểu (điểm %) để gọi là đang tiến bộ hoặc tụt. */
const TREND_THRESHOLD = 5;

const MIN_QUESTIONS_FOR_CONCLUSION = 5;
const MIN_PLAYS_FOR_CONCLUSION = 2;

export const ANALYSIS_DISCLAIMER =
  "Số liệu do hệ thống tự tính; phần nhận xét do AI diễn giải và có thể chưa chính xác. "
  + "Kết quả chính thức vẫn là điểm số hệ thống ghi nhận.";

/** Nhãn hiển thị của một chủ đề: topic → tên game → mặc định. */
export function topicDisplayName(t) {
  if (t?.topic != null && String(t.topic).trim() !== "") return t.topic;
  if (t?.gameName != null && String(t.gameName).trim() !== "") return t.gameName;
  return "Chủ đề chưa xác định";
}

/**
 * Parse chuỗi ISO-8601 của backend thành epoch ms.
 * Chuỗi không có múi giờ (bản ghi cũ) được hiểu là UTC như fallback của Java.
 */
export function parseInstant(createdAt) {
  if (createdAt == null || String(createdAt).trim() === "") return null;
  const s = String(createdAt).trim();
  if (/([zZ]|[+-]\d{2}:?\d{2})$/.test(s)) {
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : t;
  }
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(s)) {
    const t = Date.parse(s + "Z");
    return Number.isNaN(t) ? null : t;
  }
  return null;
}

function nonNegative(v) {
  return v == null || v < 0 ? 0 : v;
}

function gameKey(gameId) {
  return gameId == null || String(gameId).trim() === "" ? null : gameId;
}

/**
 * Tính chỉ số từ danh sách lượt chơi ĐÃ lọc.
 * @param {Array} results  bản ghi results (shape CoreResult của AI Service)
 * @param {Map} games      map khoá (mongoId/id/code) → {name, subject, topic}
 * @param {string|null} from  yyyy-MM-dd hoặc null
 * @param {string|null} to    yyyy-MM-dd hoặc null
 * @returns {{metrics:object, dataSufficient:boolean, note:string|null}}
 */
export function computeLearningMetrics(results, games, from, to) {
  if (!results || results.length === 0) {
    return {
      metrics: emptyMetrics(from, to),
      dataSufficient: false,
      note: "Chưa có dữ liệu lượt chơi nào trong khoảng thời gian này.",
    };
  }

  const sorted = [...results].sort((a, b) => {
    const ia = parseInstant(a.createdAt);
    const ib = parseInstant(b.createdAt);
    if (ia == null && ib == null) return 0;
    if (ia == null) return 1; // nullsLast như Java
    if (ib == null) return -1;
    return ia - ib;
  });

  let offered = 0;
  let correct = 0;
  let playAccuracySum = 0;
  let playAccuracySamples = 0;
  let scoreSum = 0;
  let scoreSamples = 0;
  let timeSum = 0;
  let timeSamples = 0;
  let xpSum = 0;

  const byGame = new Map();
  for (const r of sorted) {
    const correctCount = nonNegative(r.correctAnswers);
    const total = nonNegative(r.totalQuestions);
    offered += total;
    correct += Math.min(correctCount, total === 0 ? correctCount : total);

    if (r.accuracy != null && r.accuracy >= 0) {
      playAccuracySum += r.accuracy;
      playAccuracySamples++;
    }
    if (r.score != null && r.score >= 0) {
      scoreSum += Math.round(r.score);
      scoreSamples++;
    }
    if (r.completionTime != null && r.completionTime > 0) {
      timeSum += r.completionTime;
      timeSamples++;
    }
    if (r.xpGained != null && r.xpGained > 0) {
      xpSum += r.xpGained;
    }

    const key = gameKey(r.gameId);
    if (!byGame.has(key)) byGame.set(key, { gameKey: null, plays: 0, offered: 0, correct: 0 });
    const acc = byGame.get(key);
    acc.gameKey = key;
    acc.plays++;
    acc.offered += total;
    acc.correct += Math.min(correctCount, total === 0 ? correctCount : total);
  }

  const plays = sorted.length;
  const accuracy = offered > 0 ? Math.round((correct * 100) / offered) : 0;
  const averagePlayAccuracy = playAccuracySamples > 0
    ? Math.round(playAccuracySum / playAccuracySamples) : 0;
  const averageScore = scoreSamples > 0 ? scoreSum / scoreSamples : 0;
  const averageTime = timeSamples > 0 ? timeSum / timeSamples : 0;

  const metrics = {
    totalPlays: plays,
    totalQuestionsOffered: offered,
    totalCorrectAnswers: correct,
    accuracy,
    averagePlayAccuracy,
    averageScore: round1(averageScore),
    totalXp: Math.round(xpSum),
    averageCompletionTimeSeconds: round1(averageTime),
    topics: buildTopics(byGame, games),
    trend: buildTrend(sorted),
    periodFrom: firstPeriodLabel(sorted, from),
    periodTo: lastPeriodLabel(sorted, to),
  };

  const sufficient = offered >= MIN_QUESTIONS_FOR_CONCLUSION && plays >= MIN_PLAYS_FOR_CONCLUSION;
  const note = sufficient ? null
    : "Dữ liệu còn ít (" + plays + " lượt chơi, " + offered + " câu). "
      + "Chưa nên kết luận về năng lực của học sinh.";
  return { metrics, dataSufficient: sufficient, note };
}

function emptyMetrics(from, to) {
  return {
    totalPlays: 0,
    totalQuestionsOffered: 0,
    totalCorrectAnswers: 0,
    accuracy: 0,
    averagePlayAccuracy: 0,
    averageScore: 0,
    totalXp: 0,
    averageCompletionTimeSeconds: 0,
    topics: [],
    trend: { direction: "unknown", accuracyDelta: null, firstHalfAccuracy: null, secondHalfAccuracy: null },
    periodFrom: from ?? null,
    periodTo: to ?? null,
  };
}

function buildTopics(byGame, games) {
  const out = [];
  for (const acc of byGame.values()) {
    const game = acc.gameKey == null ? null : games.get(acc.gameKey) ?? null;
    out.push({
      gameId: acc.gameKey,
      gameName: game?.name ?? null,
      subject: game?.subject ?? null,
      topic: game?.topic ?? null,
      plays: acc.plays,
      questionsOffered: acc.offered,
      correctAnswers: acc.correct,
      accuracy: acc.offered > 0 ? Math.round((acc.correct * 100) / acc.offered) : 0,
    });
  }
  out.sort((a, b) => {
    if (b.questionsOffered !== a.questionsOffered) return b.questionsOffered - a.questionsOffered;
    const da = topicDisplayName(a);
    const db = topicDisplayName(b);
    return da < db ? -1 : da > db ? 1 : 0;
  });
  return out.length > MAX_TOPICS ? out.slice(0, MAX_TOPICS) : out;
}

/** So sánh nửa sau với nửa trước theo thời gian; cần ít nhất 4 lượt. */
function buildTrend(sorted) {
  const unknown = { direction: "unknown", accuracyDelta: null, firstHalfAccuracy: null, secondHalfAccuracy: null };
  if (sorted.length < 4) return unknown;
  const mid = Math.floor(sorted.length / 2);
  const first = meanPlayAccuracy(sorted.slice(0, mid));
  const second = meanPlayAccuracy(sorted.slice(mid));
  if (first == null || second == null) return unknown;
  const delta = second - first;
  const direction = delta >= TREND_THRESHOLD ? "improving" : delta <= -TREND_THRESHOLD ? "declining" : "stable";
  return { direction, accuracyDelta: delta, firstHalfAccuracy: first, secondHalfAccuracy: second };
}

function meanPlayAccuracy(subset) {
  let sum = 0;
  let samples = 0;
  for (const r of subset) {
    if (r.accuracy != null && r.accuracy >= 0) {
      sum += r.accuracy;
      samples++;
    }
  }
  return samples > 0 ? Math.round(sum / samples) : null;
}

function firstPeriodLabel(sorted, from) {
  if (from != null) return from;
  const first = parseInstant(sorted[0]?.createdAt);
  return first == null ? null : new Date(first).toISOString();
}

function lastPeriodLabel(sorted, to) {
  if (to != null) return to;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const last = parseInstant(sorted[i].createdAt);
    if (last != null) return new Date(last).toISOString();
  }
  return null;
}

/** Lọc theo khoảng ngày theo ngày địa phương của server (như ZoneId.systemDefault của Java). */
export function withinPeriod(result, from, to) {
  const instant = parseInstant(result?.createdAt);
  if (instant == null) return from == null && to == null;
  const d = new Date(instant);
  const day = [
    String(d.getFullYear()).padStart(4, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
  if (from != null && day < from) return false;
  return to == null || day <= to;
}

/** Kiểm tra ngày vô lý phía nghiệp vụ (route đã kiểm tra định dạng + thứ tự). */
export function validatePeriod(from, to) {
  const today = new Date();
  const todayStr = [
    String(today.getFullYear()).padStart(4, "0"),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowStr = [
    String(tomorrow.getFullYear()).padStart(4, "0"),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");
  void todayStr;
  if (from != null && from > tomorrowStr) {
    throw new AiBackendError("Ngày bắt đầu không được ở tương lai.", { httpCode: 400, kind: "upstream" });
  }
  if (to != null) {
    const fiveYears = new Date(today.getTime());
    fiveYears.setFullYear(fiveYears.getFullYear() + 5);
    const fiveStr = [
      String(fiveYears.getFullYear()).padStart(4, "0"),
      String(fiveYears.getMonth() + 1).padStart(2, "0"),
      String(fiveYears.getDate()).padStart(2, "0"),
    ].join("-");
    if (to > fiveStr) {
      throw new AiBackendError("Ngày kết thúc không hợp lệ.", { httpCode: 400, kind: "upstream" });
    }
  }
}

/** Các chủ đề đủ dữ liệu để dám kết luận mạnh/yếu. */
export function confidentTopics(topics) {
  return (topics || []).filter((t) => t.questionsOffered >= MIN_QUESTIONS_PER_TOPIC);
}

function weakestTopics(topics, limit) {
  return [...(topics || [])]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

/**
 * Bản tổng hợp bằng QUY TẮC, không qua LLM — dùng khi AI lỗi hoặc chưa có dữ liệu.
 * Port từ Narrative.fallback phía Java: chỉ mô tả đúng những gì số liệu chứng minh được.
 */
export function fallbackNarrative(metrics, sufficient) {
  const strengths = [];
  const areas = [];
  const recommendations = [];

  if (!sufficient) {
    const summary = metrics.totalPlays === 0
      ? "Chưa có dữ liệu lượt chơi để đánh giá."
      : "Đã ghi nhận " + metrics.totalPlays + " lượt chơi với "
        + metrics.totalQuestionsOffered + " câu (đúng "
        + metrics.totalCorrectAnswers + " câu, tỷ lệ đúng " + metrics.accuracy
        + "%). Dữ liệu còn ít nên chưa đủ căn cứ để đánh giá năng lực theo chủ đề.";

    for (const t of weakestTopics(metrics.topics, 2)) {
      areas.push("Cần luyện thêm ở chủ đề \"" + topicDisplayName(t) + "\" (tỷ lệ đúng "
        + t.accuracy + "% trên " + t.questionsOffered + " câu).");
      recommendations.push("Làm thêm " + Math.max(5, t.questionsOffered)
        + " câu trắc nghiệm về \"" + topicDisplayName(t)
        + "\" rồi xem lại các câu sai.");
    }
    if (recommendations.length === 0) {
      recommendations.push("Chơi thêm vài lượt ở các chủ đề đang học "
        + "để hệ thống có đủ dữ liệu phân tích.");
    }
    return {
      summary,
      strengths,
      areasToImprove: areas,
      recommendations,
      encouragement: "Mỗi lượt chơi đều giúp hồ sơ học tập đầy đủ hơn. Cứ tiếp tục luyện tập nhé!",
    };
  }

  const confident = confidentTopics(metrics.topics);
  const byAccuracyDesc = [...confident].sort((a, b) => b.accuracy - a.accuracy);
  for (const t of byAccuracyDesc.slice(0, 2)) {
    strengths.push("Đạt tỷ lệ đúng " + t.accuracy + "% ở chủ đề \"" + topicDisplayName(t) + "\".");
  }
  for (const t of weakestTopics(confident, 2)) {
    if (t.accuracy < 70) {
      areas.push("Tỷ lệ đúng ở \"" + topicDisplayName(t) + "\" mới đạt " + t.accuracy + "%.");
      recommendations.push("Ôn lại kiến thức nền của \"" + topicDisplayName(t)
        + "\" rồi luyện thêm câu khó hơn một chút.");
    }
  }
  if (metrics.trend.accuracyDelta != null && metrics.trend.accuracyDelta <= -5) {
    recommendations.push("Tỷ lệ đúng đang giảm so với trước; nên xem lại các lượt chơi gần đây.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Tiếp tục luyện đều đặn ở các chủ đề hiện tại để giữ vững tiến bộ.");
  }
  if (strengths.length === 0) {
    strengths.push("Đã hoàn thành " + metrics.totalPlays + " lượt chơi với "
      + metrics.totalQuestionsOffered + " câu (đúng "
      + metrics.totalCorrectAnswers + " câu).");
  }

  const summary = "Trong " + metrics.totalPlays + " lượt chơi, học sinh trả lời đúng "
    + metrics.totalCorrectAnswers + "/" + metrics.totalQuestionsOffered
    + " câu (tỷ lệ đúng " + metrics.accuracy + "%).";
  return {
    summary,
    strengths,
    areasToImprove: areas,
    recommendations,
    encouragement: "Kết quả đang tích cực, hãy giữ nhịp luyện tập đều đặn nhé!",
  };
}
