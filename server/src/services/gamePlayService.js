import { getCollection } from "../db.js";
import { gradeAnswers } from "../lib/gradeAnswer.js";
import { addXp, addCoins, XP_PER_LEVEL } from "./authService.js";

/**
 * gamePlayService — chốt kết quả một ván chơi.
 *
 * Mục tiêu: khép kín luồng
 *   Game (HTML) → Question → Student → Result
 *
 * Nguyên tắc (xem updated_games.md §4-§5, §12):
 *   - KHÔNG đổi schema `games` / `templates` / `questions`, không đổi Question API.
 *   - Chỉ GHI thêm field mới vào `results` và `users`.
 *   - Điểm số do SERVER chấm từ `answers`, không tin `score` từ client.
 *     `clientScore` chỉ được dùng cho play-to-win (game không có câu hỏi).
 */

const COLLECTION = "results";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

/** Ngưỡng an toàn: play-to-win không có câu hỏi thì chặn score bất thường. */
const MAX_FREE_SCORE = 100000;

/** Số lần hoàn thành ván tối đa được cộng XP cho 1 game trong 1 ngày. */
const XP_DAILY_CAP_PER_GAME = 50;

/**
 * Công thức XP — server-side, không nhận XP từ client.
 *   trả lời đúng : 5 XP / câu
 *   hoàn thành   : 10 XP (chỉ khi có ít nhất 1 câu đúng — tránh spam game rác)
 *   tỷ lệ đúng   : bonus theo accuracy (tối đa 20 XP)
 */
export function calcXp({ correctCount = 0, totalQuestions = 0, score = 0, hasQuestions = true }) {
  if (!hasQuestions) {
    // play-to-win: thưởng theo điểm, chặn trần để không bị spam
    return Math.max(0, Math.min(50, Math.floor((Number(score) || 0) / 10)));
  }
  if (correctCount <= 0) return 0;
  const correctXp = correctCount * 5;
  const completeXp = 10;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const accuracyXp = Math.floor((accuracy / 100) * 20);
  return correctXp + completeXp + accuracyXp;
}

/** Lấy câu hỏi của ván chơi. Ưu tiên questionIds (bộ câu hẳn), fallback theo gameId. */
async function loadQuestions({ gameId, questionIds }) {
  const ids = Array.isArray(questionIds) ? questionIds.filter(Boolean) : [];
  if (ids.length > 0) {
    const docs = await getCollection("questions").find({ id: { $in: ids } }).toArray();
    // Giữ đúng thứ tự questionIds để client và server khớp index.
    const byId = new Map(docs.map((d) => [d.id, d]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
  }
  if (!gameId) return [];
  return getCollection("questions").find({ gameId }).sort({ id: 1 }).toArray();
}

/** Số lần đã hoàn thành game hôm nay (dùng để chặn spam XP). */
async function completedToday(userId, gameId) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  return getCollection(COLLECTION).countDocuments({
    userId,
    gameId,
    createdAt: { $gte: since.toISOString() },
  });
}

/**
 * Chốt ván chơi.
 *
 * @param {object} p
 * @param {string}  p.userId       bắt buộc — luôn lấy từ token, không tin body
 * @param {string}  p.playerName   tên hiển thị
 * @param {string}  p.gameId       game được chơi
 * @param {string}  [p.playId]     idempotency key từ client; gửi lại cùng playId
 *                                 trả về kết quả cũ, không cộng XP lần 2
 * @param {Array}   [p.answers]    [{ questionId, value, timeSpent? }]
 * @param {Array}   [p.questionIds] câu hỏi thực sự dùng trong ván
 * @param {number}  [p.clientScore] chỉ dùng cho play-to-win
 * @param {number}  [p.timeUsed]
 * @param {string}  [p.gameType]
 * @param {string}  [p.playMode]
 */
export async function completePlay(p) {
  const {
    userId, playerName, gameId, playId, answers,
    questionIds, clientScore, timeUsed, gameType, playMode,
  } = p;

  if (!userId) throw Object.assign(new Error("Cần đăng nhập"), { status: 401 });
  if (!gameId) throw Object.assign(new Error("gameId là bắt buộc"), { status: 400 });

  const coll = getCollection(COLLECTION);

  // Idempotency: cùng playId → trả lại kết quả đã lưu, không cộng XP/coin lần nữa.
  if (playId) {
    const existing = await coll.findOne({ userId, playId });
    if (existing) return { ...existing, replayed: true };
  }

  const questions = await loadQuestions({ gameId, questionIds });
  const hasQuestions = questions.length > 0;
  const answerList = Array.isArray(answers) ? answers : [];

  let graded;
  let score;
  let verified;
  if (answerList.length > 0 && hasQuestions) {
    // Đường chuẩn: game gửi từng câu trả lời → server chấm lại, bỏ qua clientScore.
    graded = gradeAnswers(questions, answerList, { totalTimeSec: timeUsed || 0 });
    score = graded.score;
    verified = true;
  } else {
    // Đường dự phòng cho game cũ (chưa dùng EG_ANSWER) hoặc play-to-win:
    // tạm dùng điểm client nhưng CHẶN TRẦN và đánh dấu unverified.
    // Unverified → không cộng XP, để không thể gian lận bằng cách khai điểm.
    score = Math.max(0, Math.min(MAX_FREE_SCORE, Math.floor(Number(clientScore) || 0)));
    graded = {
      score,
      correctCount: hasQuestions ? 0 : 0,
      wrongCount: 0,
      totalQuestions: hasQuestions ? questions.length : 0,
      answered: 0,
      accuracy: 0,
      breakdown: [],
    };
    verified = false;
  }

  const correctAnswers = graded.correctCount;
  const accuracy = graded.accuracy;
  const completionTime = Math.max(0, Math.round(Number(timeUsed) || 0));

  // --- XP: chỉ cấp cho ván đã được server chấm; chặn spam theo số ván/ngày ---
  const rawXp = verified
    ? calcXp({
        correctCount: correctAnswers,
        totalQuestions: graded.totalQuestions,
        score,
        hasQuestions,
      })
    : 0;
  let xpGained = 0;
  if (rawXp > 0) {
    const playedToday = await completedToday(userId, gameId);
    if (playedToday < XP_DAILY_CAP_PER_GAME) xpGained = rawXp;
  }

  const doc = {
    id: uid("result"),
    userId,
    playId: playId || null,
    gameId,
    playerId: userId,
    playerName: playerName || "",
    gameType: gameType || "play-to-learn",
    playMode: playMode || "solo",
    score,
    correctAnswers,
    totalQuestions: graded.totalQuestions,
    accuracy,
    completionTime,
    xpGained,
    coinGained: 0,
    verified,
    source: "html-game",
    createdAt: new Date().toISOString(),
  };

  await coll.insertOne(doc);

  // --- Cộng XP / Coin (chỉ sau khi đã lưu result) ---
  let profile = null;
  if (xpGained > 0) {
    try {
      profile = await addXp(userId, xpGained);
    } catch (e) {
      console.error("[gamePlay] addXp failed:", e.message);
    }
  }

  // games.playersCount: đếm theo userId (thay vì playerId ngẫu nhiên từ client)
  if (!playId) {
    await getCollection("games").updateOne({ id: gameId }, { $inc: { playersCount: 1 } });
  }

  return {
    ...doc,
    xpGained,
    profile: profile
      ? { xp: profile.xp, level: profile.level, xpIntoLevel: profile.xpIntoLevel, xpPerLevel: XP_PER_LEVEL, leveledUp: profile.leveledUp }
      : null,
    replayed: false,
  };
}

/**
 * Ghi nhận ván chơi của một bài giao (assignment).
 *
 * Bài giao đã được chấm ở `POST /assignments/:id/submit`, nên hàm này KHÔNG
 * chấm lại — chỉ đọc kết quả đã lưu để:
 *   1. ghi vào `results` (bảng xếp hạng / analytics theo game)
 *   2. cấp XP
 *
 * @param {object} p
 * @param {string} p.submissionId  submission đã SUBMITTED
 * @param {string} [p.playId]      idempotency key
 * @param {number} [p.gameScore]   điểm thô do game HTML báo (chỉ lưu để tham khảo)
 */
export async function recordAssignmentPlay(p) {
  const { userId, submissionId, playId, gameScore, timeUsed } = p;

  if (!userId) throw Object.assign(new Error("Cần đăng nhập"), { status: 401 });
  if (!submissionId) throw Object.assign(new Error("submissionId là bắt buộc"), { status: 400 });

  const coll = getCollection(COLLECTION);
  if (playId) {
    const existing = await coll.findOne({ userId, playId });
    if (existing) return { ...existing, replayed: true };
  }

  const sub = await getCollection("submissions").findOne({ id: submissionId });
  if (!sub) throw Object.assign(new Error("Bài nộp không tồn tại"), { status: 404 });
  if (sub.studentId !== userId) throw Object.assign(new Error("Không có quyền"), { status: 403 });
  if (sub.status !== "SUBMITTED") throw Object.assign(new Error("Bài nộp chưa được nộp"), { status: 400 });

  const assignment = await getCollection("assignments").findOne({ id: sub.assignmentId });
  const gameId = assignment?.gameId || null;

  const correctAnswers = sub.correctCount || 0;
  const totalQuestions = sub.totalQuestions || 0;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const rawXp = calcXp({
    correctCount: correctAnswers,
    totalQuestions,
    score: sub.score || 0,
    hasQuestions: totalQuestions > 0,
  });
  let xpGained = 0;
  if (rawXp > 0 && gameId) {
    const playedToday = await completedToday(userId, gameId);
    if (playedToday < XP_DAILY_CAP_PER_GAME) xpGained = rawXp;
  }

  const doc = {
    id: uid("result"),
    userId,
    playId: playId || null,
    gameId,
    playerId: userId,
    playerName: sub.playerName || "",
    gameType: "play-to-learn",
    playMode: "assignment",
    // score của assignment là phần trăm 0-100 → dùng làm score để bảng xếp hạng nhất quán
    score: Math.round(Number(sub.score) || 0),
    correctAnswers,
    totalQuestions,
    accuracy,
    completionTime: Math.max(0, Math.round(Number(timeUsed) || 0)),
    xpGained,
    coinGained: 0,
    // Bài giao luôn được chấm ở server (POST /assignments/:id/submit) → verified.
    verified: true,
    source: "assignment",
    assignmentId: sub.assignmentId,
    submissionId: sub.id,
    gameScore: Number.isFinite(Number(gameScore)) ? Number(gameScore) : null,
    createdAt: new Date().toISOString(),
  };

  await coll.insertOne(doc);

  let profile = null;
  if (xpGained > 0) {
    try {
      profile = await addXp(userId, xpGained);
    } catch (e) {
      console.error("[gamePlay] addXp failed:", e.message);
    }
  }

  if (gameId && !playId) {
    await getCollection("games").updateOne({ id: gameId }, { $inc: { playersCount: 1 } });
  }

  return {
    ...doc,
    profile: profile
      ? { xp: profile.xp, level: profile.level, xpIntoLevel: profile.xpIntoLevel, xpPerLevel: XP_PER_LEVEL, leveledUp: profile.leveledUp }
      : null,
    replayed: false,
  };
}

/**
 * Cộng coin sau khi ván đã chốt (game tự quyết định mức thưởng).
 *
 * Trần mỗi ngày được theo dõi bằng 2 field MỚI trên `users`:
 *   coinsEarnedOn    — ngày đang tính (YYYY-MM-DD, giờ server)
 *   coinsEarnedToday — tổng coin đã kiếm trong ngày đó
 * Nhờ vậy iframe không thể spam `add-coins` vô hạn.
 */
const COIN_DAILY_CAP = 500;

function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function rewardCoins(userId, amount) {
  const value = Math.floor(Number(amount) || 0);
  if (!userId || value <= 0) return { coins: 0, awarded: 0, capped: false };

  const users = getCollection("users");
  const user = await users.findOne({ id: userId });
  if (!user) throw Object.assign(new Error("Không tìm thấy người dùng"), { status: 404 });

  const today = dayKey();
  const granted = user.coinsEarnedOn === today ? Number(user.coinsEarnedToday) || 0 : 0;
  const capped = Math.min(value, Math.max(0, COIN_DAILY_CAP - granted));
  if (capped <= 0) return { coins: user.coins || 0, awarded: 0, capped: true };

  const coins = await addCoins(userId, capped);
  await users.updateOne(
    { id: userId },
    { $set: { coinsEarnedOn: today, coinsEarnedToday: granted + capped } }
  );
  return { coins, awarded: capped, capped: capped < value };
}