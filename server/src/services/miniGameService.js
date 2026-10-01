/**
 * miniGameService.js
 * Business logic cho 16 mini-game "Học Mà Chơi":
 *   - Tạo / đóng session chống gian lận
 *   - Xác thực và lưu kết quả ván chơi (idempotent theo sessionId)
 *   - Tính XP server-side (không tin XP từ client)
 *   - Cập nhật tiến độ tổng hợp (totalXp, level, best, played)
 *   - Đánh giá và mở huy hiệu
 *   - Truy vấn hồ sơ & bảng xếp hạng
 */

import { randomUUID } from "crypto";
import { getCollection } from "../db.js";
import {
  MINI_GAME_IDS,
  BADGE_DEFINITIONS,
  calcXp,
  isScoreValid,
  isTimeValid,
  getGameConfig,
} from "../config/miniGameConfig.js";

// ── Hằng số ──────────────────────────────────────────────────────────────────

/** XP cần để lên mỗi cấp (khớp với client: level = floor(xp / 120) + 1) */
const XP_PER_LEVEL = 120;

/** Số ván tối đa mỗi giờ mỗi user (rate-limit chống lạm dụng) */
const MAX_GAMES_PER_HOUR = 60;

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcLevel(totalXp) {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

/** Trả về display name an toàn (chỉ biệt danh, không họ tên thật) */
async function resolveDisplayName(userId) {
  try {
    const user = await getCollection("users").findOne(
      { id: userId },
      { projection: { name: 1, username: 1 } }
    );
    if (!user) return "Ẩn danh";
    // Ưu tiên username (biệt danh), fallback về name
    return user.username || user.name || "Ẩn danh";
  } catch {
    return "Ẩn danh";
  }
}

// ── Session ───────────────────────────────────────────────────────────────────

/**
 * Tạo session mới khi người chơi bắt đầu một ván.
 * @param {string} userId
 * @param {string} game  — id game (math, flap, ...)
 * @returns {{ sessionId: string, startedAt: string }}
 */
export async function createSession(userId, game) {
  if (!MINI_GAME_IDS.includes(game)) {
    throw Object.assign(new Error("Game không hợp lệ"), { status: 400 });
  }

  // Rate limit: đếm số session được tạo trong 1 giờ qua
  const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
  const recentCount = await getCollection("mini_sessions").countDocuments({
    userId,
    startedAt: { $gte: oneHourAgo },
  });
  if (recentCount >= MAX_GAMES_PER_HOUR) {
    throw Object.assign(
      new Error("Quá nhiều ván trong một giờ. Hãy nghỉ ngơi một chút!"),
      { status: 429 }
    );
  }

  const sessionId = randomUUID();
  const startedAt = new Date().toISOString();

  await getCollection("mini_sessions").insertOne({
    sessionId,
    userId,
    game,
    startedAt,
    status: "open",
  });

  return { sessionId, startedAt };
}

// ── Submit result ─────────────────────────────────────────────────────────────

/**
 * Gửi kết quả ván chơi. Idempotent: gửi lại cùng sessionId trả về cùng kết quả.
 *
 * @param {string} userId
 * @param {{ sessionId: string, game: string, score: number, details?: object }} payload
 * @returns {object} kết quả bao gồm xpGained, totalXp, level, leveledUp, isBest, newBadges
 */
export async function submitResult(userId, payload) {
  const { sessionId, game, score, details = {} } = payload;

  // ── 1. Validate đầu vào cơ bản ──
  if (!sessionId) throw Object.assign(new Error("sessionId là bắt buộc"), { status: 400 });
  if (!MINI_GAME_IDS.includes(game)) {
    throw Object.assign(new Error("Game không hợp lệ"), { status: 400 });
  }
  if (!Number.isFinite(score) || score < 0) {
    throw Object.assign(new Error("score không hợp lệ"), { status: 400 });
  }
  if (!isScoreValid(game, score)) {
    const cfg = getGameConfig(game);
    throw Object.assign(
      new Error(`Điểm vượt ngưỡng cho phép (tối đa ${cfg.maxScore})`),
      { status: 400 }
    );
  }

  // ── 2. Kiểm tra sessionId idempotency (đã có result cho session này chưa?) ──
  const existingResult = await getCollection("mini_results").findOne({ sessionId });
  if (existingResult) {
    // Trả lại response giống hệt lần đầu (không cộng XP lần 2)
    const progress = await getOrCreateProgress(userId);
    return buildResponse(existingResult, progress, []);
  }

  // ── 3. Lấy và xác thực session ──
  const session = await getCollection("mini_sessions").findOne({ sessionId });

  if (!session) {
    // Session không tồn tại (ví dụ: offline, sessionId hết hạn)
    // Chấp nhận nhưng đánh dấu suspicious, không lên leaderboard
    return await _saveResult(userId, { sessionId, game, score, details, suspicious: true });
  }

  if (session.userId !== userId) {
    throw Object.assign(new Error("Session không thuộc về bạn"), { status: 403 });
  }
  if (session.game !== game) {
    throw Object.assign(new Error("Game không khớp với session"), { status: 400 });
  }
  if (session.status === "closed") {
    // Session đã đóng nhưng chưa có result → gửi lại an toàn
    const progress = await getOrCreateProgress(userId);
    // Tìm lại result (trường hợp race condition)
    const r2 = await getCollection("mini_results").findOne({ sessionId });
    if (r2) return buildResponse(r2, progress, []);
  }

  // ── 4. Kiểm tra thời lượng tối thiểu (chống cheat tốc độ) ──
  const elapsedSec = (Date.now() - new Date(session.startedAt).getTime()) / 1000;
  const suspicious = !isTimeValid(game, elapsedSec);

  // ── 5. Đóng session ──
  await getCollection("mini_sessions").updateOne(
    { sessionId },
    { $set: { status: "closed", closedAt: new Date().toISOString(), suspicious } }
  );

  return await _saveResult(userId, { sessionId, game, score, details, suspicious });
}

/**
 * Lưu kết quả, cập nhật progress, đánh giá huy hiệu.
 * @private
 */
async function _saveResult(userId, { sessionId, game, score, details, suspicious }) {
  // ── Tính XP (server-side) ──
  const xpGained = suspicious ? 0 : calcXp(game, { score, details });

  const now = new Date().toISOString();
  const resultDoc = {
    sessionId,
    userId,
    game,
    score: Math.round(score),
    xpGained,
    details,
    suspicious,
    createdAt: now,
  };

  await getCollection("mini_results").insertOne(resultDoc);

  // ── Cập nhật progress ──
  const { progress, leveledUp, isBest } = await _updateProgress(userId, game, score, xpGained);

  // ── Đánh giá huy hiệu mới ──
  const newBadges = suspicious ? [] : await _evaluateBadges(userId, progress, { game, ...details });

  return buildResponse(resultDoc, progress, newBadges);
}

/** Xây dựng response chuẩn trả về client */
function buildResponse(result, progress, newBadges) {
  return {
    xpGained:   result.xpGained,
    totalXp:    progress.totalXp,
    level:      progress.level,
    leveledUp:  progress._leveledUp ?? false,
    isBest:     progress._isBest ?? false,
    best:       progress.best[result.game] ?? result.score,
    newBadges,
    suspicious: result.suspicious ?? false,
  };
}

// ── Progress ──────────────────────────────────────────────────────────────────

/**
 * Lấy hoặc tạo mới document tiến độ của user.
 */
export async function getOrCreateProgress(userId) {
  const col = getCollection("user_mini_progress");
  let doc = await col.findOne({ userId });
  if (!doc) {
    const displayName = await resolveDisplayName(userId);
    const now = new Date().toISOString();
    doc = {
      userId,
      totalXp:     0,
      level:       1,
      gamesPlayed: 0,
      played:      [],
      best:        {},
      badges:      [],
      displayName,
      createdAt:   now,
      updatedAt:   now,
    };
    try {
      await col.insertOne(doc);
    } catch (e) {
      // Unique index violation: race condition — lấy lại
      if (e.code === 11000) doc = await col.findOne({ userId });
      else throw e;
    }
  }
  return doc;
}

/**
 * Cập nhật totalXp, level, gamesPlayed, played[], best{} sau một ván.
 * @returns {{ progress, leveledUp, isBest }}
 */
async function _updateProgress(userId, game, score, xpGained) {
  const col = getCollection("user_mini_progress");
  const doc = await getOrCreateProgress(userId);

  const prevLevel   = doc.level;
  const newTotalXp  = doc.totalXp + xpGained;
  const newLevel    = calcLevel(newTotalXp);
  const isBest      = score > (doc.best[game] ?? -1);
  const played      = doc.played.includes(game) ? doc.played : [...doc.played, game];
  const best        = isBest ? { ...doc.best, [game]: score } : doc.best;
  const now         = new Date().toISOString();

  await col.updateOne(
    { userId },
    {
      $set: {
        totalXp:     newTotalXp,
        level:       newLevel,
        played,
        best,
        updatedAt:   now,
      },
      $inc: { gamesPlayed: 1 },
    }
  );

  const updated = {
    ...doc,
    totalXp:     newTotalXp,
    level:       newLevel,
    gamesPlayed: doc.gamesPlayed + 1,
    played,
    best,
    _leveledUp:  newLevel > prevLevel,
    _isBest:     isBest,
  };

  return { progress: updated, leveledUp: newLevel > prevLevel, isBest };
}

// ── Badges ────────────────────────────────────────────────────────────────────

/**
 * Đánh giá toàn bộ BADGE_DEFINITIONS, trả về danh sách huy hiệu mới mở.
 */
async function _evaluateBadges(userId, progress, details) {
  const newBadges = [];

  for (const def of BADGE_DEFINITIONS) {
    // Đã có rồi thì bỏ qua
    if (progress.badges.includes(def.id)) continue;

    let earned = false;
    try {
      earned = def.check(progress, details);
    } catch {
      earned = false;
    }

    if (!earned) continue;

    const now = new Date().toISOString();
    try {
      // Ghi vào user_badges (unique index tự chống trùng)
      await getCollection("user_badges").insertOne({
        userId,
        badgeId:   def.id,
        earnedAt:  now,
        sessionId: details.sessionId ?? null,
      });

      // Cập nhật mảng badges trong progress
      await getCollection("user_mini_progress").updateOne(
        { userId },
        { $addToSet: { badges: def.id } }
      );

      newBadges.push({ id: def.id, name: def.name, icon: def.icon });
    } catch (e) {
      // Unique violation: badge đã có (race condition), bỏ qua
      if (e.code !== 11000) throw e;
    }
  }

  return newBadges;
}

// ── Profile (GET /api/mini/me) ────────────────────────────────────────────────

/**
 * Trả về hồ sơ mini-game của user hiện tại.
 */
export async function getProfile(userId) {
  const progress = await getOrCreateProgress(userId);

  // Lấy tên huy hiệu đầy đủ
  const badgeMap = Object.fromEntries(BADGE_DEFINITIONS.map((b) => [b.id, b]));
  const badges = progress.badges.map((id) =>
    badgeMap[id] ? { id, name: badgeMap[id].name, icon: badgeMap[id].icon } : { id, name: id, icon: "🏅" }
  );

  return {
    userId:      progress.userId,
    displayName: progress.displayName,
    xp:          progress.totalXp,
    level:       progress.level,
    gamesPlayed: progress.gamesPlayed,
    played:      progress.played,
    best:        progress.best,
    badges,
  };
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

/**
 * Bảng xếp hạng theo game cụ thể (top điểm cao nhất mỗi user).
 *
 * @param {string} game   — id game
 * @param {"all"|"week"} scope
 * @param {number} limit
 */
export async function getLeaderboardByGame(game, scope = "all", limit = 20) {
  if (!MINI_GAME_IDS.includes(game)) {
    throw Object.assign(new Error("Game không hợp lệ"), { status: 400 });
  }

  const match = { game, suspicious: { $ne: true } };
  if (scope === "week") {
    const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
    match.createdAt = { $gte: weekAgo };
  }

  // Aggregate: best score per user (không dùng index best field vì cần filter scope)
  const rows = await getCollection("mini_results")
    .aggregate([
      { $match: match },
      { $sort: { score: -1 } },
      {
        $group: {
          _id:       "$userId",
          best:      { $max: "$score" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { best: -1 } },
      { $limit: Math.min(limit, 100) },
      {
        $lookup: {
          from:         "user_mini_progress",
          localField:   "_id",
          foreignField: "userId",
          as:           "profile",
        },
      },
      { $unwind: { path: "$profile", preserveNullAndEmpty: true } },
      {
        $project: {
          _id:         0,
          userId:      "$_id",
          displayName: { $ifNull: ["$profile.displayName", "Ẩn danh"] },
          best:        1,
          createdAt:   1,
        },
      },
    ])
    .toArray();

  return rows.map((r, i) => ({
    rank:        i + 1,
    displayName: r.displayName,
    best:        r.best,
    updatedAt:   r.createdAt,
  }));
}

/**
 * Bảng xếp hạng XP tổng (top user theo tổng XP tích lũy).
 *
 * @param {number} limit
 */
export async function getLeaderboardXp(limit = 20) {
  const rows = await getCollection("user_mini_progress")
    .find({})
    .sort({ totalXp: -1 })
    .limit(Math.min(limit, 100))
    .toArray();

  return rows.map((r, i) => ({
    rank:        i + 1,
    displayName: r.displayName || "Ẩn danh",
    xp:          r.totalXp,
    level:       r.level,
  }));
}

// ── Lịch sử gần đây ───────────────────────────────────────────────────────────

/**
 * Trả về lịch sử ván chơi gần đây của user.
 * @param {string} userId
 * @param {number} limit
 */
export async function getRecentResults(userId, limit = 20) {
  const rows = await getCollection("mini_results")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 100))
    .toArray();

  const cfg = (game) => getGameConfig(game) ?? { name: game };

  return rows.map((r) => ({
    game:      r.game,
    gameName:  cfg(r.game).name,
    score:     r.score,
    xpGained:  r.xpGained,
    createdAt: r.createdAt,
  }));
}

// ── Xóa dữ liệu (GDPR / phụ huynh yêu cầu) ──────────────────────────────────

/**
 * Xóa toàn bộ dữ liệu mini-game của một user.
 * Chỉ dùng qua endpoint admin hoặc script xóa theo yêu cầu.
 * @param {string} userId
 */
export async function deleteUserData(userId) {
  await Promise.all([
    getCollection("mini_sessions").deleteMany({ userId }),
    getCollection("mini_results").deleteMany({ userId }),
    getCollection("user_mini_progress").deleteMany({ userId }),
    getCollection("user_badges").deleteMany({ userId }),
  ]);
  return { deleted: true, userId };
}
