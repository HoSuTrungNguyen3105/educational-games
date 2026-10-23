import { getCollection } from "../db.js";

/**
 * statsService — số liệu cho Dashboard giáo viên.
 *
 * Nguồn số liệu được chọn theo "cái nào có mốc thời gian thật":
 *   · task_events        → có createdAt (GAME_PLAYED, ANSWER_CORRECT, ...) → chuỗi NGÀY
 *   · dailyTaskProgress  → có date (YYYY-MM-DD)  → học sinh hoạt động trong ngày
 *   · submissions        → có startedAt/submittedAt → tiến độ giao đề
 *   · results            → điểm/số câu đúng/độ chính xác, nhưng các bản dữ liệu cũ
 *                          KHÔNG có createdAt → chỉ dùng cho số liệu toàn thời gian,
 *                          không dựng biểu đồ ngày từ bảng này
 *
 * Vì vậy mọi chuỗi thời gian đều lấy từ task_events/dailyTaskProgress/submissions,
 * còn `totals.*` (điểm TB, độ chính xác TB) tính từ toàn bộ results. `meta.warnings`
 * nói rõ phần nào thiếu mốc thời gian để giao viên ( và cả ta ) không hiểu nhầm biểu đồ.
 */

const DEFAULT_DAYS = 14;
const MIN_DAYS = 7;
const MAX_DAYS = 180;
const LEGACY_DAYS = 7;

/** Lớp học ở Việt Nam: một "ngày" phải tính theo UTC+7 dù server chạy UTC. */
const TZ_OFFSET_MS = 7 * 60 * 60 * 1000;

const pad = (n) => String(n).padStart(2, "0");

/** "2026-10-22" cho một mốc thời gian (Date | ISO string | null) theo ngày VN. */
function dayKey(value) {
  if (!value) return null;
  const t = new Date(value instanceof Date ? value.getTime() : new Date(String(value)).getTime() + TZ_OFFSET_MS);
  if (Number.isNaN(t.getTime())) return null;
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Mốc "nửa đêm hôm nay theo ngày VN" rồi dịch thêm `offset` ngày. */
function localDay(offset = 0) {
  const now = new Date(Date.now() + TZ_OFFSET_MS);
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset));
}

/** Dãy ngày liên tiếp: [{date:'2026-10-09', label:'9/10', weekday:4, day:1, month:10}] */
function buildDays(startOffset, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = localDay(startOffset + i);
    const weekday = t.getUTCDay();
    out.push({
      date: t.toISOString().slice(0, 10),
      label: `${t.getUTCDate()}/${t.getUTCMonth() + 1}`,
      weekday,
      weekLabel: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][weekday],
      monthLabel: `${t.getUTCMonth() + 1}/${t.getUTCFullYear()}`,
    });
  }
  return out;
}

const indexByDate = (days) => new Map(days.map((d, i) => [d.date, i]));
const zeros = (n) => Array.from({ length: n }, () => 0);

/** Tỷ lệ thay đổi so với kỳ trước; kỳ trước = 0 → không bịa % tăng trưởng. */
function delta(cur, prev) {
  const diff = cur - prev;
  if (prev === 0) return { diff, pct: null, trend: cur > 0 ? "new" : "flat" };
  const pct = Math.round((diff / prev) * 1000) / 10;
  return { diff, pct, trend: pct > 0 ? "up" : pct < 0 ? "down" : "flat" };
}

const round1 = (n) => Math.round(n * 10) / 10;
const avg = (list) => (list.length ? list.reduce((s, n) => s + n, 0) / list.length : null);

/** Nhãn tiếng Việt của từng loại sự kiện — API dịch sẵn để UI không tự chế. */
const EVENT_LABELS = {
  GAME_PLAYED: "Chơi game",
  QUESTION_ANSWERED: "Trả lời câu hỏi",
  ANSWER_CORRECT: "Trả lời đúng",
  GAME_WON: "Thắng ván",
  XP_EARNED: "Nhận XP",
  LOGIN: "Đăng nhập",
  SPIN: "Quay bánh xe",
  SPIN_WHEEL: "Quay bánh xe",
  REMINDER_CREATED: "Tạo nhắc nhở",
  ASSIGNMENT: "Giao đề",
  DEADLINE_REMINDER: "Nhắc hạn nộp",
};
const eventLabel = (type) => EVENT_LABELS[type]
  || String(type).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * tra thông tin trò chơi theo nhiều kiểu id (_id ObjectId, id "game-001", code).
 *
 * `gameSessions`/`userGameProgress` được dùng làm nguồn tên bổ sung vì trò chơi
 * bị gỡ vẫn còn dấu vết trong hai bảng này — nếu không, biểu đồ "top trò chơi"
 * sẽ in ra một chuỗi ObjectId đen đặc mà giáo viên không đọc được gì.
 */
function gameResolver(games, sessions, progress) {
  const by = new Map();
  const put = (keys, info) => {
    for (const k of keys.filter(Boolean)) {
      const key = String(k);
      if (!by.has(key)) by.set(key, info);
    }
  };
  for (const g of games) put([g._id?.toString(), g.id, g.code], { id: String(g._id?.toString() || g.id), name: g.name, code: g.code || null, status: g.status || null, subject: g.subject || null });
  for (const s of sessions) if (s.gameName) put([s.gameId], { id: String(s.gameId), name: s.gameName, code: s.gameCode || null, status: null, subject: null });
  for (const p of progress) if (p.gameName) put([p.gameId], { id: String(p.gameId), name: p.gameName, code: null, status: null, subject: null });
  return (gameId) => {
    if (gameId == null) return null;
    return by.get(String(gameId)) || { id: String(gameId), name: `Trò chơi đã gỡ · ${String(gameId).slice(0, 8)}`, code: null, status: null, subject: null };
  };
}

export async function getStats({ days = DEFAULT_DAYS } = {}) {
  const span = Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(Number(days)) || DEFAULT_DAYS));

  const cur = buildDays(-(span - 1), span);
  const prev = buildDays(-(span * 2 - 1), span);
  const curIdx = indexByDate(cur);
  const prevIdx = indexByDate(prev);
  const since = prev[0].date;
  /** Mốc chặn phía dưới truy vấn sự kiện (trừ thừa 1 ngày để không rơi mất dữ liệu lệch múi giờ). */
  const sinceIso = localDay(-(span * 2)).toISOString();

  const [games, results, students, events, dailies, assignments, submissions, sessions, progress] = await Promise.all([
    getCollection("games").find({}).toArray(),
    getCollection("results").find({}).toArray(),
    getCollection("users").find({ role: "student" }).toArray(),
    getCollection("task_events").aggregate([
      // createdAt đang lưu dạng ISO string; so sánh $gte với string cũng ăn cả bản
      // lưu kiểu Date (Mongo xếp Date sau String), nên cửa sổ ngày lọc lại bằng JS.
      { $match: { createdAt: { $gte: sinceIso } } },
      { $project: { _id: 0, type: 1, userId: 1, gameId: 1, createdAt: 1 } },
      { $sort: { createdAt: 1 } },
      { $limit: 20000 },
    ]).toArray(),
    getCollection("dailyTaskProgress").aggregate([
      { $match: { date: { $gte: since } } },
      { $project: { _id: 0, date: 1, userId: 1 } },
    ]).toArray(),
    getCollection("assignments").find({}).toArray(),
    getCollection("submissions").find({}).toArray(),
    getCollection("gameSessions").aggregate([
      { $match: { gameName: { $exists: true, $ne: null } } },
      { $project: { _id: 0, gameId: 1, gameName: 1, gameCode: 1 } },
      { $limit: 500 },
    ]).toArray(),
    getCollection("userGameProgress").aggregate([
      { $match: { gameName: { $exists: true, $ne: null } } },
      { $project: { _id: 0, gameId: 1, gameName: 1 } },
      { $limit: 500 },
    ]).toArray(),
  ]);

  const resolveGame = gameResolver(games, sessions, progress);
  const eventsIn = events.filter((e) => dayKey(e.createdAt) !== null);

  // ── totals (giữ nguyên mặt bằng cũ để các trang khác không bị đổi số) ──
  const totals = {
    games: games.length,
    published: games.filter((g) => g.status === "published").length,
    drafts: games.filter((g) => g.status === "draft").length,
    archived: games.filter((g) => g.status !== "published" && g.status !== "draft").length,
    plays: results.length,
    playEvents: eventsIn.filter((e) => e.type === "GAME_PLAYED").length,
    students: students.length,
    players: new Set(results.map((r) => r.playerId)).size,
    avgScore: results.length ? Math.round(avg(results.map((r) => r.score || 0))) : 0,
    avgAccuracy: results.length ? Math.round(avg(results.map((r) => r.accuracy || 0))) : 0,
    avgTime: results.some((r) => r.completionTime) ? Math.round(avg(results.filter((r) => r.completionTime).map((r) => r.completionTime))) : 0,
    assignments: assignments.length,
  };

  // activity: 7 ngày theo results như bản cũ (trang Thư viện & Hồ sơ giáo viên vẫn đọc key này)
  const legacyDays = buildDays(-(LEGACY_DAYS - 1), LEGACY_DAYS);
  const legacyIdx = indexByDate(legacyDays);
  const legacyCounts = zeros(LEGACY_DAYS);
  results.forEach((r) => {
    const k = dayKey(r.createdAt);
    if (k && legacyIdx.has(k)) legacyCounts[legacyIdx.get(k)] += 1;
  });
  const activity = legacyDays.map((d, i) => ({ date: d.date, count: legacyCounts[i] }));

  // ── chuỗi theo ngày (nguồn có createdAt/date) ──
  const plays = zeros(span);
  const prevPlays = zeros(span);
  const byType = new Map();
  const perDayUsers = cur.map(() => new Set());
  const curUsers = new Set();
  const prevUsers = new Set();

  const typeBuckets = (type) => {
    if (!byType.has(type)) byType.set(type, { cur: zeros(span), prev: zeros(span) });
    return byType.get(type);
  };

  for (const e of eventsIn) {
    const k = dayKey(e.createdAt);
    if (!k || k < since) continue;
    const t = typeBuckets(e.type);
    if (curIdx.has(k)) {
      const i = curIdx.get(k);
      t.cur[i] += 1;
      if (e.type === "GAME_PLAYED") plays[i] += 1;
      if (e.userId) { perDayUsers[i].add(e.userId); curUsers.add(e.userId); }
    } else if (prevIdx.has(k)) {
      t.prev[prevIdx.get(k)] += 1;
      if (e.type === "GAME_PLAYED") prevPlays[prevIdx.get(k)] += 1;
      if (e.userId) prevUsers.add(e.userId);
    }
  }
  for (const d of dailies) {
    // Tiến độ nhiệm vụ ngày cũng là dấu vết "hôm đó em có vào lớp": tính vào
    // Học sinh hoạt động của cả hai cửa sổ, nếu không KPI và biểu đồ ngày sẽ
    // lệch nhau (KPI đếm riêng sự kiện, biểu đồ đếm cả nhiệm vụ).
    if (curIdx.has(d.date) && d.userId) {
      const i = curIdx.get(d.date);
      perDayUsers[i].add(d.userId);
      curUsers.add(d.userId);
    } else if (prevIdx.has(d.date) && d.userId) {
      prevUsers.add(d.userId);
    }
  }
  const activeStudents = perDayUsers.map((s) => s.size);

  const eventTypes = [...byType.entries()]
    .map(([type, v]) => ({ type, total: v.cur.reduce((s, n) => s + n, 0), cur: v.cur, prev: v.prev }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // ── giao đề: nộp / chấm trong cửa sổ ──
  const subWindow = submissions.filter((s) => {
    const k = dayKey(s.submittedAt || s.createdAt);
    return k && curIdx.has(k);
  });
  const recentAssignments = assignments
    .slice()
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 6);
  const assignmentSeries = recentAssignments.map((a) => {
    const subs = submissions.filter((s) => String(s.assignmentId) === String(a.id || a._id));
    const graded = subs.filter((s) => s.status === "GRADED" || s.score > 0);
    return {
      id: a.id || a._id,
      title: a.title || a.name || "Giao đề",
      submitted: subs.filter((s) => s.status !== "EXPIRED").length,
      graded: graded.length,
      avgScore: graded.length ? Math.round(avg(graded.map((s) => s.score || 0))) : 0,
    };
  });

  // ── theo môn (số trò chơi + lượt chơi + độ chính xác TB) ──
  const keyOf = (g) => String(g._id?.toString() || g.id);
  const playsByGame = new Map();
  const bump = (id) => playsByGame.set(id, (playsByGame.get(id) || 0) + 1);
  for (const r of results) bump(resolveGame(r.gameId).id);
  for (const e of eventsIn) { if (e.type === "GAME_PLAYED") bump(resolveGame(e.gameId).id); }

  const subjectAgg = new Map();
  for (const g of games) {
    const name = g.subject || "Chưa phân môn";
    const s = subjectAgg.get(name) || { name, games: 0, published: 0, plays: 0, acc: [], score: [] };
    s.games += 1;
    if (g.status === "published") s.published += 1;
    s.plays += playsByGame.get(keyOf(g)) || 0;
    subjectAgg.set(name, s);
  }
  // Phiếu kết quả của trò chơi đã gỡ → không biết thuộc môn nào, nên để trống
  // thay vì gán nhầm vào một môn; histogram độ chính xác vẫn tính đủ mọi phiếu.
  let unmatchedResults = 0;
  for (const r of results) {
    const s = subjectAgg.get(resolveGame(r.gameId).subject || "___none___");
    if (!s) { unmatchedResults += 1; continue; }
    if (typeof r.accuracy === "number") s.acc.push(r.accuracy);
    if (typeof r.score === "number") s.score.push(r.score);
  }
  const subjects = [...subjectAgg.values()]
    .map((s) => ({
      name: s.name,
      count: s.games,
      published: s.published,
      plays: s.plays,
      avgAccuracy: s.acc.length ? Math.round(avg(s.acc)) : null,
      avgScore: s.score.length ? Math.round(avg(s.score)) : null,
    }))
    .sort((a, b) => b.count - a.count || b.plays - a.plays);

  // ── phân bố độ chính xác ──
  const BANDS = [
    { label: "< 50%", test: (a) => a < 50 },
    { label: "50–69%", test: (a) => a >= 50 && a < 70 },
    { label: "70–84%", test: (a) => a >= 70 && a < 85 },
    { label: "85–99%", test: (a) => a >= 85 && a < 100 },
    { label: "100%", test: (a) => a >= 100 },
  ];
  const accuracyBands = BANDS.map((b) => ({ label: b.label, count: results.filter((r) => typeof r.accuracy === "number" && b.test(r.accuracy)).length }));

  // ── top trò chơi được chơi nhiều ──
  const topGames = [...playsByGame.entries()]
    .map(([key, count]) => ({ ...resolveGame(key), playedCount: count }))
    .filter((g) => g.playedCount > 0)
    .sort((a, b) => b.playedCount - a.playedCount);

  // ── nhịp trong tuần: ngày nào lớp cũng chơi, ngày nào im ắng ──
  const weekdayTotals = zeros(7);
  const weekdayDays = zeros(7);
  cur.forEach((d, i) => { weekdayDays[d.weekday] += 1; weekdayTotals[d.weekday] += plays[i]; });
  const weekday = [1, 2, 3, 4, 5, 6, 0].map((w) => ({
    weekday: w,
    label: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][w],
    avg: weekdayDays[w] ? round1(weekdayTotals[w] / weekdayDays[w]) : 0,
  }));

  const byPlayer = new Map();
  results.forEach((r) => {
    const key = r.playerId || r.playerName || "Ẩn danh";
    const p = byPlayer.get(key) || { name: r.playerName || "Ẩn danh", games: 0, score: 0, correct: 0, total: 0 };
    p.games += 1;
    p.score += r.score || 0;
    p.correct += r.correctAnswers || 0;
    p.total += r.totalQuestions || 0;
    byPlayer.set(key, p);
  });
  const topPlayers = [...byPlayer.values()]
    .map((p) => ({ ...p, accuracy: p.total ? Math.round((p.correct / p.total) * 100) : 0 }))
    .sort((a, b) => b.score - a.score || b.games - a.games)
    .slice(0, 5)
    .map(({ name, games, score, accuracy }) => ({ name, games, score, accuracy }));

  const neverPlayed = games
    .filter((g) => g.status === "published" && !playsByGame.has(keyOf(g)))
    .map((g) => ({ id: g._id?.toString(), name: g.name, code: g.code }))
    .slice(0, 5);
  const drafts = games.filter((g) => g.status === "draft").map((g) => ({ id: g._id?.toString(), name: g.name })).slice(0, 5);

  const curPlaysTotal = plays.reduce((s, n) => s + n, 0);
  const prevPlaysTotal = prevPlays.reduce((s, n) => s + n, 0);
  const subPrev = submissions.filter((s) => { const k = dayKey(s.submittedAt || s.createdAt); return k && prevIdx.has(k); });

  /**
   * So sánh chỉ theo cửa sổ ngày. Kết quả cũ thiếu createdAt → không so được,
   * thà trả `trend:'none'` (UI ẩn mũi tên) còn hơn vẽ % tăng trưởng bịa.
   */
  const accWindow = (idx) => {
    const list = results.filter((r) => { const k = dayKey(r.createdAt); return k && idx.has(k); });
    return { n: list.length, value: list.length ? Math.round(avg(list.map((r) => r.accuracy || 0))) : null };
  };
  const accCur = accWindow(curIdx);
  const accPrev = accWindow(prevIdx);
  const noChange = { diff: 0, pct: null, trend: "none" };

  const kpis = [
    { key: "plays", label: "Lượt chơi", value: curPlaysTotal, unit: "", change: delta(curPlaysTotal, prevPlaysTotal), hint: `${span} ngày · từ sự kiện chơi game` },
    { key: "activeStudents", label: "Học sinh hoạt động", value: curUsers.size, unit: "", change: delta(curUsers.size, prevUsers.size), hint: `nhiều nhất 1 ngày: ${Math.max(0, ...activeStudents)} bạn` },
    {
      key: "avgAccuracy",
      label: "Độ chính xác TB",
      value: accCur.n ? accCur.value : totals.avgAccuracy,
      unit: "%",
      change: accCur.n && accPrev.n ? delta(accCur.value, accPrev.value) : noChange,
      hint: accCur.n ? `${accCur.n} phiếu có mốc thời gian` : "toàn thời gian · phiếu cũ chưa có ngày",
    },
    { key: "published", label: "Trò chơi đã xuất bản", value: totals.published, unit: "", change: noChange, hint: `${totals.games} trò chơi trong thư viện` },
    { key: "submissions", label: "Bài đã nộp", value: subWindow.length, unit: "", change: delta(subWindow.length, subPrev.length), hint: "giao đề trong cửa sổ ngày" },
    { key: "avgTime", label: "Thời gian hoàn thành TB", value: totals.avgTime, unit: "s", change: noChange, hint: "toàn thời gian · từ phiếu kết quả" },
  ];

  const resultsUndated = results.filter((r) => !dayKey(r.createdAt)).length;
  const warnings = [];
  if (resultsUndated > 0) {
    warnings.push(`${resultsUndated}/${results.length} phiếu kết quả cũ chưa có mốc thời gian nên chỉ tính vào số trung bình, không lên biểu đồ ngày.`);
  }
  if (unmatchedResults > 0) {
    warnings.push(`${unmatchedResults} phiếu gắn với trò chơi không còn trong thư viện nên chưa phân được môn.`);
  }
  if (curPlaysTotal === 0) warnings.push("Chưa có sự kiện chơi game nào trong cửa sổ ngày đang xem.");

  return {
    meta: {
      days: span,
      window: { from: cur[0].date, to: cur[cur.length - 1].date },
      previousWindow: { from: prev[0].date, to: prev[prev.length - 1].date },
      generatedAt: new Date().toISOString(),
      sources: {
        games: games.length,
        results: results.length,
        resultsUndated,
        resultsUnmatched: unmatchedResults,
        taskEvents: eventsIn.length,
        dailyTaskProgress: dailies.length,
        submissions: submissions.length,
        assignments: assignments.length,
      },
      warnings,
    },
    totals,
    kpis,
    activity,
    series: {
      days: cur.map((d) => ({ date: d.date, label: d.label, weekLabel: d.weekLabel })),
      plays,
      activeStudents,
      events: eventTypes.map((t) => ({ type: t.type, label: eventLabel(t.type), total: t.total, values: t.cur, previous: t.prev })),
      weekday,
      subjects: {
        labels: subjects.map((s) => s.name),
        counts: subjects.map((s) => s.count),
        published: subjects.map((s) => s.published),
        plays: subjects.map((s) => s.plays),
        // null = môn này chưa có phiếu kết quả nào — biểu đồ bỏ trống cột chứ không vẽ cột 0%
        accuracies: subjects.map((s) => s.avgAccuracy),
      },
      status: {
        labels: ["Đã xuất bản", "Bản nháp", "Khác"],
        values: [totals.published, totals.drafts, totals.archived],
      },
      accuracyBands,
      topGames: {
        labels: topGames.slice(0, 8).map((g) => g.name),
        values: topGames.slice(0, 8).map((g) => g.playedCount),
        ids: topGames.slice(0, 8).map((g) => g.id),
      },
      assignments: {
        labels: assignmentSeries.map((a) => a.title),
        submitted: assignmentSeries.map((a) => a.submitted),
        graded: assignmentSeries.map((a) => a.graded),
        avgScores: assignmentSeries.map((a) => a.avgScore),
      },
    },
    topPlayers,
    topGames: topGames.slice(0, 5).map(({ id, name, code, status, playedCount }) => ({ id, name, code, status, playedCount })),
    subjects: subjects.map(({ name, count }) => ({ name, count })),
    attention: { drafts, neverPlayed },
  };
}
