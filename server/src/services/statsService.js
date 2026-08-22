import { getCollection } from "../db.js";

const DAYS = 7;

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function getStats() {
  const [games, results, users] = await Promise.all([
    getCollection("games").find({}).toArray(),
    getCollection("results").find({}).toArray(),
    getCollection("users").find({ role: "student" }).toArray(),
  ]);

  const totals = {
    games: games.length,
    published: games.filter((g) => g.status === "published").length,
    drafts: games.filter((g) => g.status === "draft").length,
    plays: results.length,
    students: users.length,
    players: new Set(results.map((r) => r.playerId)).size,
    avgScore: results.length ? Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length) : 0,
    avgAccuracy: results.length ? Math.round(results.reduce((s, r) => s + (r.accuracy || 0), 0) / results.length) : 0,
  };

  const now = new Date();
  const counts = new Map();
  for (let i = DAYS - 1; i >= 0; i--) {
    const key = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i));
    counts.set(key, 0);
  }
  results.forEach((r) => {
    if (!r.createdAt) return;
    const key = dayKey(new Date(r.createdAt));
    if (counts.has(key)) counts.set(key, counts.get(key) + 1);
  });
  const activity = [...counts.entries()].map(([date, count]) => ({ date, count }));

  const byPlayer = new Map();
  results.forEach((r) => {
    const key = r.playerId || r.playerName || "Ẩn danh";
    const name = r.playerName || "Ẩn danh";
    const p = byPlayer.get(key) || { name, games: 0, score: 0, correct: 0, total: 0 };
    p.name = name;
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

  const playedCount = new Map();
  results.forEach((r) => playedCount.set(r.gameId, (playedCount.get(r.gameId) || 0) + 1));
  const topGames = games
    .map((g) => ({ id: g._id?.toString() || g.id, name: g.name, code: g.code, status: g.status, playedCount: playedCount.get(g._id?.toString() || g.id) || 0 }))
    .sort((a, b) => b.playedCount - a.playedCount)
    .slice(0, 5);

  const bySubject = {};
  games.forEach((g) => {
    const s = g.subject || "Khác";
    bySubject[s] = (bySubject[s] || 0) + 1;
  });
  const subjects = Object.entries(bySubject)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const neverPlayed = games
    .filter((g) => g.status === "published" && (playedCount.get(g._id?.toString()) || 0) === 0)
    .map((g) => ({ id: g._id?.toString(), name: g.name, code: g.code }))
    .slice(0, 5);
  const drafts = games
    .filter((g) => g.status === "draft")
    .map((g) => ({ id: g._id?.toString(), name: g.name }))
    .slice(0, 5);

  return { totals, activity, topPlayers, topGames, subjects, attention: { drafts, neverPlayed } };
}
