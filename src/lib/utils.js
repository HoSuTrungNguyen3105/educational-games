import { uid } from '../services/api.js';

export function shortName(full) {
  const parts = full.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(-2).join(" ") : full;
}

export function rankMedal(rank) {
  if (rank === 1) return { icon: "🥇", ring: "#F4B942" };
  if (rank === 2) return { icon: "🥈", ring: "#9CA3AF" };
  if (rank === 3) return { icon: "🥉", ring: "#B5651D" };
  return { icon: rank, ring: "#E7D9BE" };
}

export function emptyQuestion() {
  return {
    id: uid("question"), content: "",
    options: [{ id: uid("answer"), content: "" }, { id: uid("answer"), content: "" }, { id: uid("answer"), content: "" }],
    correctAnswer: null, timeLimit: 20, points: 100,
    inputMode: "choice",
  };
}

// Level system based on total coins
// Each level requires more coins: 0, 100, 300, 600, 1000, 1500, 2100, ...
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000];

export function getLevelFromCoins(coins) {
  const c = Math.max(0, coins || 0);
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (c >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getCoinsForNextLevel(level) {
  const idx = Math.min(level, LEVEL_THRESHOLDS.length - 1);
  return LEVEL_THRESHOLDS[idx] || 0;
}

export function getLevelProgress(coins) {
  const level = getLevelFromCoins(coins);
  const current = LEVEL_THRESHOLDS[level - 1] || 0;
  const next = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 2000;
  const needed = next - current;
  const earned = (coins || 0) - current;
  return { level, current, next, needed, earned, percent: needed > 0 ? Math.min(100, Math.round((earned / needed) * 100)) : 100 };
}

export function getLevelTitle(level) {
  if (level >= 20) return "Huyền thoại";
  if (level >= 15) return "Bá chủ";
  if (level >= 10) return "Chiến binh";
  if (level >= 7) return "Tay chơi";
  if (level >= 5) return "Học viên";
  if (level >= 3) return "Tân binh";
  return "Mới bắt đầu";
}

export function getLevelEmoji(level) {
  if (level >= 20) return "\u{1F451}";
  if (level >= 15) return "\u{2694}\uFE0F";
  if (level >= 10) return "\u{1F6E1}\uFE0F";
  if (level >= 7) return "\u{1F525}";
  if (level >= 5) return "\u{2B50}";
  if (level >= 3) return "\u{1F31F}";
  return "\u{1F331}";
}