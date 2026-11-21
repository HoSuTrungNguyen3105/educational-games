// eventService.js — Sự kiện & Thử thách Theo Mùa (Seasonal Events,
// Đợt 3 của capnhattinhnang.md).
//
// Admin tạo chiến dịch giới hạn thời gian (vd "Tuần lễ Vui Toán") KHÔNG
// cần sửa code: tên, cửa sổ thời gian, phạm vi (toàn trường / theo khối
// lớp) và chuỗi CỘT MỐC nhiệm vụ kèm phần thưởng giới hạn.
//
// Loại nhiệm vụ — CHỈ những gì dữ liệu THẬT đo được, từ `results` với
// đúng bộ lọc trung thực của Bản đồ nhiệt (Đợt 1): bỏ result
// `verified === false` (điểm client tự khai) và `source === "assignment"`
// (đã tính qua submissions):
//   · "plays"       — số ván hoàn thành trong cửa sổ sự kiện.
//   · "topic_plays" — số ván thuộc một chủ đề; khoá chủ đề của ván lấy
//     theo ĐÚNG luật heatmap phía results: topic của game → môn của
//     game → tên game.
//   · "xp"          — tổng `xpGained` trong cửa sổ.
// Nhiệm vụ "tích lũy Sao/coin trong cửa sổ" KHÔNG tồn tại ở đây: sao là
// ví `users.stars` và hệ thống không ghi sổ sao/coin theo từng ván
// (result chốt ở server ghi coinGained = 0, coin đi đường add-coins có
// trần ngày chỉ lưu tổng ngày) → không đo được thì không đưa vào form.
//
// Phần thưởng giới hạn đi qua ĐÚNG hệ có sẵn, không dựng hệ song song:
//   · Huy hiệu: ghi vào collection `user_badges` (đã có unique index
//     (userId, badgeId)); badgeId = `event_<eventId>_<questId>`, tên +
//     icon tự chứa trong cột mốc, hiển thị ở trang sự kiện của học sinh.
//   · Hạt giống: +1 vào map `seeds` trên doc `gardens` của học sinh
//     (plantType do admin chọn từ catalog `plantTypes` thật); trồng cây
//     sẽ tiêu hạt này thay vì trừ xu (gardenService.plantTree).
//   · Khung avatar: KHÔNG có đợt này — catalog avatar không có category
//     "frame" và frontend không có đường render khung; gán vào category
//     khác là làm giả.
//
// Trao thưởng qua MỘT hàm `grantReward` dùng chung ở hai điểm:
//   1. Học sinh đọc tiến độ và đã đạt mốc chưa nhận → trao ngay
//      (grant-on-read).
//   2. `processEndedEvents()` (processor nền trong app.js, cùng pattern
//      setInterval của processDueReminders): sự kiện vừa kết thúc →
//      trao phần chưa nhận cho mọi học sinh trong phạm vi, snapshot
//      bảng xếp hạng vào `finalLeaderboard`, đặt `finalizedAt`.
// Chống trao trùng bằng sổ `event_rewards` + unique index
// (eventId, questId, userId): ghi sổ TRƯỚC, trao thật SAU; trao thật
// lỗi → xoá lại dòng sổ (để lần sau thử lại) và ghi log rõ ràng.
import { getCollection } from "../db.js";
import { gradeForAgeCode } from "../config/ageCodes.js";
import { httpError } from "../utils/httpError.js";
import { uid } from "../utils/id.js";

export const QUEST_TYPES = ["plays", "topic_plays", "xp"];
export const MAX_QUESTS_PER_EVENT = 20;
export const LEADERBOARD_LIMIT = 50;
export const ACTIVE_LEADERBOARD_LIMIT = 10;

const nowIso = () => new Date().toISOString();

/** Khoá chủ đề của một game — đúng luật heatmap phía results. */
export function gameTopicLabel(g) {
  return String(g?.topic || g?.subject || g?.name || "Trò chơi");
}

/** Danh sách khoá chủ đề THẬT suy từ games hiện có (cho form admin chọn). */
export async function listTopicKeys() {
  const games = await getCollection("games").find({}).toArray();
  const set = new Set(games.map((g) => gameTopicLabel(g)).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b, "vi"));
}

/** Học sinh có thuộc phạm vi sự kiện không (khối lớp qua ageCode). */
export function userInScope(event, user) {
  const scope = event?.scope || { type: "all" };
  if (scope.type !== "grades") return true;
  const grade = gradeForAgeCode(user?.ageCode);
  if (grade == null) return false; // chưa có mã tuổi → chỉ thuộc sự kiện toàn trường
  return Array.isArray(scope.grades) && scope.grades.includes(grade);
}

function parseDateField(value, label) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw httpError(`${label} không hợp lệ`, 400);
  return d.toISOString();
}

async function assertPlantTypeExists(plantTypeId) {
  const pt = await getCollection("plantTypes").findOne({ id: plantTypeId });
  if (!pt) throw httpError(`Loại cây "${plantTypeId}" không tồn tại trong danh mục cây`, 400);
  return pt;
}

/**
 * Chuẩn hoá + kiểm tra dữ liệu sự kiện từ admin. Ném httpError 400 với
 * message rõ ràng khi sai. Quest thiếu id được cấp id mới (id đã có được
 * giữ nguyên để sổ thưởng event_rewards không mồ côi khi sửa sự kiện).
 */
export async function validateEventInput(body = {}) {
  const name = String(body.name || "").trim();
  if (!name) throw httpError("Tên sự kiện là bắt buộc", 400);
  if (name.length > 120) throw httpError("Tên sự kiện tối đa 120 ký tự", 400);
  const description = body.description == null ? "" : String(body.description).trim();

  const startsAt = parseDateField(body.startsAt, "Thời gian bắt đầu");
  const endsAt = parseDateField(body.endsAt, "Thời gian kết thúc");
  if (endsAt <= startsAt) throw httpError("Thời gian kết thúc phải sau thời gian bắt đầu", 400);

  let scope;
  const rawScope = body.scope || { type: "all" };
  if (rawScope.type === "grades") {
    const grades = [...new Set((Array.isArray(rawScope.grades) ? rawScope.grades : []).map(Number))]
      .filter((g) => Number.isInteger(g) && g >= 1 && g <= 5)
      .sort((a, b) => a - b);
    if (!grades.length) throw httpError("Phạm vi theo khối lớp cần chọn ít nhất một khối (1–5)", 400);
    scope = { type: "grades", grades };
  } else if (rawScope.type == null || rawScope.type === "all") {
    scope = { type: "all", grades: [] };
  } else {
    throw httpError("Phạm vi sự kiện không hợp lệ (chỉ 'all' hoặc 'grades')", 400);
  }

  if (!Array.isArray(body.quests) || !body.quests.length) {
    throw httpError("Sự kiện cần ít nhất một cột mốc nhiệm vụ", 400);
  }
  if (body.quests.length > MAX_QUESTS_PER_EVENT) {
    throw httpError(`Tối đa ${MAX_QUESTS_PER_EVENT} cột mốc cho một sự kiện`, 400);
  }
  const quests = [];
  for (const [i, raw] of body.quests.entries()) {
    const at = `Cột mốc ${i + 1}`;
    const title = String(raw?.title || "").trim();
    if (!title) throw httpError(`${at}: thiếu tên cột mốc`, 400);
    const type = String(raw?.type || "");
    if (!QUEST_TYPES.includes(type)) {
      throw httpError(`${at}: loại nhiệm vụ không hợp lệ (chỉ ${QUEST_TYPES.join(" / ")})`, 400);
    }
    const target = Number(raw?.target);
    if (!Number.isInteger(target) || target <= 0) throw httpError(`${at}: chỉ tiêu phải là số nguyên > 0`, 400);
    let topicKey = null;
    if (type === "topic_plays") {
      topicKey = String(raw?.topicKey || "").trim();
      if (!topicKey) throw httpError(`${at}: nhiệm vụ theo chủ đề cần chọn chủ đề`, 400);
    }
    const rewardRaw = raw?.reward || {};
    let reward;
    if (rewardRaw.kind === "badge") {
      const badgeName = String(rewardRaw.name || "").trim();
      if (!badgeName) throw httpError(`${at}: huy hiệu cần có tên`, 400);
      reward = { kind: "badge", name: badgeName, icon: String(rewardRaw.icon || "🏅").trim() || "🏅" };
    } else if (rewardRaw.kind === "seed") {
      const plantTypeId = String(rewardRaw.plantTypeId || "").trim();
      if (!plantTypeId) throw httpError(`${at}: thưởng hạt giống cần chọn loại cây`, 400);
      await assertPlantTypeExists(plantTypeId);
      reward = { kind: "seed", plantTypeId };
    } else {
      throw httpError(`${at}: loại phần thưởng không hợp lệ (chỉ 'badge' hoặc 'seed')`, 400);
    }
    quests.push({
      id: raw?.id ? String(raw.id) : uid("quest"),
      title,
      type,
      target,
      ...(topicKey ? { topicKey } : {}),
      reward,
    });
  }

  return {
    name,
    description,
    startsAt,
    endsAt,
    scope,
    quests,
    enabled: body.enabled !== false,
  };
}

// ── CRUD phía admin ─────────────────────────────────────────────────────

export async function listEvents() {
  return getCollection("events").find({}).sort({ createdAt: -1 }).toArray();
}

export async function getEventOr404(eventId) {
  const ev = await getCollection("events").findOne({ id: eventId });
  if (!ev) throw httpError("Không tìm thấy sự kiện", 404);
  return ev;
}

export async function createEvent(body, createdBy) {
  const data = await validateEventInput(body);
  const now = nowIso();
  const doc = { id: uid("event"), ...data, finalizedAt: null, createdBy, createdAt: now, updatedAt: now };
  await getCollection("events").insertOne(doc);
  return doc;
}

export async function updateEvent(eventId, body) {
  const existing = await getEventOr404(eventId);
  const data = await validateEventInput(body);
  if (existing.finalizedAt) {
    // Đã tổng kết: snapshot + sổ thưởng đã chốt theo cấu hình cũ — chỉ
    // cho sửa tên/mô tả/bật-tắt, không cho đổi cửa sổ/phạm vi/cột mốc.
    const structuralChange =
      data.startsAt !== existing.startsAt ||
      data.endsAt !== existing.endsAt ||
      JSON.stringify(data.scope) !== JSON.stringify(existing.scope || { type: "all", grades: [] }) ||
      JSON.stringify(data.quests) !== JSON.stringify(existing.quests || []);
    if (structuralChange) {
      throw httpError("Sự kiện đã tổng kết — không sửa được thời gian, phạm vi hay cột mốc (chỉ sửa tên/mô tả/bật-tắt)", 400);
    }
  }
  const patch = { ...data, updatedAt: nowIso() };
  await getCollection("events").updateOne({ id: eventId }, { $set: patch });
  return { ...existing, ...patch };
}

export async function setEventEnabled(eventId, enabled) {
  await getEventOr404(eventId);
  await getCollection("events").updateOne(
    { id: eventId },
    { $set: { enabled: !!enabled, updatedAt: nowIso() } },
  );
  return getEventOr404(eventId);
}

export async function deleteEvent(eventId) {
  await getEventOr404(eventId);
  await getCollection("events").deleteOne({ id: eventId });
  await getCollection("event_rewards").deleteMany({ eventId });
  return { deleted: true, id: eventId };
}

// ── Tiến độ từ results thật ─────────────────────────────────────────────

async function loadGameByAnyId() {
  const map = new Map();
  for (const g of await getCollection("games").find({}).toArray()) {
    if (g.id) map.set(String(g.id), g);
    if (g._id) map.set(String(g._id), g);
  }
  return map;
}

/**
 * Thống kê hoạt động của MỘT học sinh trong cửa sổ sự kiện: số ván, XP,
 * số ván theo từng khoá chủ đề. Chỉ đếm ván trong [startsAt, endsAt]
 * (sau endsAt thì đóng băng ở endsAt), bỏ ván unverified / assignment.
 */
export async function computeUserStats(event, userId, gameByAnyId) {
  const endCap = new Date(event.endsAt).getTime() < Date.now() ? event.endsAt : nowIso();
  const results = await getCollection("results")
    .find({ userId, createdAt: { $gte: event.startsAt, $lte: endCap } })
    .toArray();
  const stats = { plays: 0, xp: 0, topicPlays: {} };
  for (const r of results) {
    if (r.source === "assignment") continue;
    if (r.verified === false) continue;
    if (!r.gameId) continue;
    stats.plays += 1;
    stats.xp += Number(r.xpGained) || 0;
    const label = gameTopicLabel(gameByAnyId.get(String(r.gameId)));
    stats.topicPlays[label] = (stats.topicPlays[label] || 0) + 1;
  }
  return stats;
}

export function questProgress(quest, stats) {
  if (quest.type === "plays") return stats.plays;
  if (quest.type === "xp") return stats.xp;
  if (quest.type === "topic_plays") return stats.topicPlays[quest.topicKey] || 0;
  return 0;
}

// ── Trao thưởng (một hàm dùng chung) ────────────────────────────────────

/**
 * Trao phần thưởng của một cột mốc cho một học sinh — idempotent nhờ sổ
 * event_rewards (unique index). Trả { granted } hoặc
 * { granted: false, alreadyGranted: true } khi đã trao trước đó;
 * { granted: false, error } khi trao thật lỗi (đã rollback dòng sổ +
 * ghi log, lần đọc/tổng kết sau sẽ thử lại).
 */
export async function grantReward(event, quest, userId) {
  const ledger = getCollection("event_rewards");
  const badgeId = `event_${event.id}_${quest.id}`;
  const refId = quest.reward.kind === "badge" ? badgeId : quest.reward.plantTypeId;
  const row = {
    id: uid("evr"),
    eventId: event.id,
    questId: quest.id,
    userId,
    kind: quest.reward.kind,
    refId,
    grantedAt: nowIso(),
  };
  try {
    await ledger.insertOne(row);
  } catch (e) {
    if (e && e.code === 11000) return { granted: false, alreadyGranted: true };
    throw e;
  }
  try {
    if (quest.reward.kind === "badge") {
      try {
        await getCollection("user_badges").insertOne({ userId, badgeId, earnedAt: row.grantedAt });
      } catch (e) {
        if (!e || e.code !== 11000) throw e; // huy hiệu đã có sẵn thì thôi — sổ là nguồn sự thật
      }
    } else {
      // Hạt giống: +1 vào kho hạt của vườn; tạo doc vườn (đúng shape
      // tối thiểu của schema gardens) nếu học sinh chưa từng mở vườn.
      const key = `seeds.${quest.reward.plantTypeId}`;
      await getCollection("gardens").updateOne(
        { userId },
        {
          $inc: { [key]: 1 },
          $setOnInsert: { userId, slots: [], inventory: {}, createdAt: row.grantedAt },
        },
        { upsert: true },
      );
    }
  } catch (e) {
    await ledger.deleteOne({ id: row.id }).catch(() => {});
    console.error(`[events] Trao thưởng lỗi (event=${event.id} quest=${quest.id} user=${userId}):`, e.message);
    return { granted: false, error: e.message };
  }
  return { granted: true, reward: row };
}

/** Các dòng sổ đã trao của một học sinh trong một sự kiện, theo questId. */
async function grantedByQuest(eventId, userId) {
  const rows = await getCollection("event_rewards").find({ eventId, userId }).toArray();
  const map = new Map();
  for (const r of rows) map.set(r.questId, r);
  return map;
}

// ── Bảng xếp hạng ───────────────────────────────────────────────────────

/**
 * Bảng xếp hạng sự kiện: học sinh trong phạm vi CÓ hoạt động trong cửa
 * sổ, xếp theo số cột mốc đã đạt → tổng XP sự kiện → số ván → tên.
 */
export async function computeLeaderboard(event, { limit = LEADERBOARD_LIMIT } = {}) {
  const students = await getCollection("users").find({ role: "student" }).toArray();
  const gameByAnyId = await loadGameByAnyId();
  const rows = [];
  for (const s of students) {
    if (!userInScope(event, s)) continue;
    const stats = await computeUserStats(event, s.id, gameByAnyId);
    if (stats.plays === 0 && stats.xp === 0) continue;
    const questsCompleted = (event.quests || []).filter((q) => questProgress(q, stats) >= q.target).length;
    rows.push({
      userId: s.id,
      name: s.name || s.username || s.id,
      username: s.username || "",
      questsCompleted,
      xp: stats.xp,
      plays: stats.plays,
    });
  }
  rows.sort(
    (a, b) =>
      b.questsCompleted - a.questsCompleted ||
      b.xp - a.xp ||
      b.plays - a.plays ||
      a.name.localeCompare(b.name, "vi"),
  );
  return rows.slice(0, limit).map((r, i) => ({ rank: i + 1, ...r }));
}

// ── Phía học sinh ───────────────────────────────────────────────────────

/** Dựng payload một sự kiện cho một học sinh: tiến độ + trao ngay khi đạt. */
async function buildStudentEventView(event, user, { leaderboardLimit = ACTIVE_LEADERBOARD_LIMIT } = {}) {
  const gameByAnyId = await loadGameByAnyId();
  const stats = await computeUserStats(event, user.id, gameByAnyId);
  const granted = await grantedByQuest(event.id, user.id);
  const newlyGranted = [];
  const quests = [];
  for (const q of event.quests || []) {
    const progress = questProgress(q, stats);
    const completed = progress >= q.target;
    let row = granted.get(q.id) || null;
    if (completed && !row) {
      const res = await grantReward(event, q, user.id);
      if (res.granted) {
        row = res.reward;
        newlyGranted.push(q.id);
      }
    }
    quests.push({
      id: q.id,
      title: q.title,
      type: q.type,
      target: q.target,
      ...(q.topicKey ? { topicKey: q.topicKey } : {}),
      reward: q.reward,
      progress,
      completed,
      granted: !!row,
      grantedAt: row?.grantedAt || null,
    });
  }

  let leaderboard;
  let myRank = null;
  if (event.finalizedAt && Array.isArray(event.finalLeaderboard)) {
    leaderboard = event.finalLeaderboard.slice(0, leaderboardLimit);
    const mine = event.finalLeaderboard.find((r) => r.userId === user.id);
    if (mine) myRank = mine;
  } else {
    const full = await computeLeaderboard(event, { limit: LEADERBOARD_LIMIT });
    leaderboard = full.slice(0, leaderboardLimit);
    myRank = full.find((r) => r.userId === user.id) || null;
  }

  return {
    id: event.id,
    name: event.name,
    description: event.description || "",
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    scope: event.scope,
    status: event.finalizedAt ? "finalized" : new Date(event.endsAt).getTime() < Date.now() ? "ended" : "running",
    finalizedAt: event.finalizedAt || null,
    quests,
    myStats: { plays: stats.plays, xp: stats.xp },
    leaderboard,
    myRank,
    newlyGranted,
  };
}

/**
 * Sự kiện ĐANG CHẠY thuộc phạm vi của học sinh (enabled, trong cửa sổ),
 * kèm tiến độ của chính học sinh. Không có sự kiện phù hợp → mảng rỗng
 * (client không hiện khối sự kiện — không dữ liệu mẫu).
 */
export async function getActiveEventsForStudent(userId) {
  const user = await getCollection("users").findOne({ id: userId });
  if (!user) throw httpError("Không tìm thấy người dùng", 404);
  const now = nowIso();
  const events = await getCollection("events")
    .find({ enabled: true, startsAt: { $lte: now }, endsAt: { $gte: now } })
    .sort({ endsAt: 1 })
    .toArray();
  const views = [];
  for (const ev of events) {
    if (!userInScope(ev, user)) continue;
    views.push(await buildStudentEventView(ev, user));
  }
  return views;
}

/** Chi tiết một sự kiện cho học sinh (phải thuộc phạm vi của mình). */
export async function getEventForStudent(eventId, userId) {
  const user = await getCollection("users").findOne({ id: userId });
  if (!user) throw httpError("Không tìm thấy người dùng", 404);
  const ev = await getCollection("events").findOne({ id: eventId });
  if (!ev || !ev.enabled || !userInScope(ev, user)) throw httpError("Không tìm thấy sự kiện", 404);
  return buildStudentEventView(ev, user, { leaderboardLimit: LEADERBOARD_LIMIT });
}

// ── Tổng kết cuối sự kiện ───────────────────────────────────────────────

/** Tổng kết MỘT sự kiện: trao phần chưa nhận + snapshot xếp hạng. */
export async function finalizeEvent(event) {
  const students = await getCollection("users").find({ role: "student" }).toArray();
  const gameByAnyId = await loadGameByAnyId();
  let grantedCount = 0;
  const warnings = [];
  for (const s of students) {
    if (!userInScope(event, s)) continue;
    const stats = await computeUserStats(event, s.id, gameByAnyId);
    const granted = await grantedByQuest(event.id, s.id);
    for (const q of event.quests || []) {
      if (questProgress(q, stats) < q.target) continue;
      if (granted.has(q.id)) continue;
      const res = await grantReward(event, q, s.id);
      if (res.granted) grantedCount += 1;
      else if (res.error) warnings.push(`Chưa trao được "${q.title}" cho học sinh ${s.id}: ${res.error}`);
    }
  }
  const finalLeaderboard = await computeLeaderboard(event, { limit: LEADERBOARD_LIMIT });
  const finalizedAt = nowIso();
  await getCollection("events").updateOne(
    { id: event.id },
    { $set: { finalizedAt, finalLeaderboard, updatedAt: finalizedAt } },
  );
  return { eventId: event.id, grantedCount, warnings, finalizedAt, leaderboardSize: finalLeaderboard.length };
}

/** Tổng kết tay từ trang admin — chỉ khi sự kiện đã kết thúc. */
export async function finalizeEventByAdmin(eventId) {
  const ev = await getEventOr404(eventId);
  if (ev.finalizedAt) throw httpError("Sự kiện đã được tổng kết rồi", 400);
  if (new Date(ev.endsAt).getTime() > Date.now()) {
    throw httpError("Sự kiện chưa kết thúc — chưa tổng kết được", 400);
  }
  return finalizeEvent(ev);
}

/**
 * Processor nền (app.js gọi định kỳ, cùng pattern processDueReminders):
 * quét sự kiện enabled đã qua endsAt mà chưa tổng kết → tổng kết.
 * Chạy lại an toàn: finalizedAt + unique index ở sổ thưởng chống trùng.
 */
export async function processEndedEvents() {
  const now = nowIso();
  const due = await getCollection("events")
    .find({
      enabled: true,
      endsAt: { $lte: now },
      $or: [{ finalizedAt: null }, { finalizedAt: { $exists: false } }],
    })
    .toArray();
  let grantedCount = 0;
  for (const ev of due) {
    try {
      const r = await finalizeEvent(ev);
      grantedCount += r.grantedCount;
      if (r.warnings.length) console.warn(`[events] Tổng kết ${ev.id} có cảnh báo:`, r.warnings.join(" | "));
    } catch (e) {
      console.error(`[events] Tổng kết sự kiện ${ev.id} lỗi:`, e.message);
    }
  }
  return { processed: due.length, grantedCount };
}
