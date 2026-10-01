/**
 * Cấu hình trung tâm cho 16 mini-game "Học Mà Chơi"
 *
 * maxScore   : trần điểm hợp lệ (chống gian lận — rộng hơn mức đạt được thực tế)
 * minTime    : số giây tối thiểu hợp lệ cho một ván (chống gian lận tốc độ)
 * calcXp     : hàm tính XP phía server (nhận { score, details })
 * detailsSchema : mô tả trường details mong đợi từ client (tham khảo)
 *
 * Để thêm game mới: chỉ cần thêm entry vào MINI_GAME_CONFIG và cập nhật MINI_GAME_IDS.
 */

export const MINI_GAME_IDS = [
  "math", "memory", "scramble", "quiz", "snake",
  "ship", "word", "cannon", "race", "sudoku",
  "flap", "g2048", "chem", "clock", "pattern", "simon",
];

export const MINI_GAME_CONFIG = {
  // ── file: hoc-ma-choi.html ──────────────────────────────────────────────
  math: {
    name: "Đua Toán",
    maxScore: 2000,
    minTime: 20,   // giây
    calcXp({ score, details = {} }) {
      const right = Number(details.right) || 0;
      return Math.round(score / 8) + (right > 0 ? 5 : 0);
    },
    detailsSchema: ["level", "right", "total", "maxCombo"],
  },
  memory: {
    name: "Lật Thẻ Anh–Việt",
    maxScore: 300,
    minTime: 10,
    calcXp({ score }) {
      return Math.round(score / 5) + 10;
    },
    detailsSchema: ["moves", "secs"],
  },
  scramble: {
    name: "Xếp Chữ",
    maxScore: 120,
    minTime: 15,
    calcXp({ score, details = {} }) {
      const solved = Number(details.solved) || 0;
      return Math.round(score / 3) + solved;
    },
    detailsSchema: ["solved"],
  },
  quiz: {
    name: "Đố Vui Khoa Học",
    maxScore: 300,
    minTime: 20,
    calcXp({ score }) {
      return Math.round(score / 4);
    },
    detailsSchema: ["right"],
  },
  snake: {
    name: "Rắn Săn Đáp Án",
    maxScore: 1500,
    minTime: 15,
    calcXp({ score }) {
      return Math.round(score / 6);
    },
    detailsSchema: ["correct", "length"],
  },

  // ── file: hoc-ma-choi-pro.html ──────────────────────────────────────────
  ship: {
    name: "Phi Thuyền Phá Thiên Thạch",
    maxScore: 3000,
    minTime: 20,
    calcXp({ score }) {
      return Math.round(score / 6);
    },
    detailsSchema: ["mode", "solved", "bestCombo"],
  },
  word: {
    name: "Đoán Từ",
    maxScore: 300,
    minTime: 15,
    calcXp({ score, details = {} }) {
      const solved = Number(details.solved) || 0;
      return Math.round(score / 3) + solved * 3;
    },
    detailsSchema: ["solved"],
  },
  cannon: {
    name: "Pháo Thủ Vật Lý",
    maxScore: 250,
    minTime: 10,
    calcXp({ score }) {
      return Math.round(score / 3) + 5;
    },
    detailsSchema: ["planet", "hits"],
  },
  race: {
    name: "Đua Xe Gõ Chữ",
    maxScore: 800,
    minTime: 10,
    calcXp({ score }) {
      return Math.round(score / 4);
    },
    detailsSchema: ["rank", "wpm", "accuracy"],
  },
  sudoku: {
    name: "Sudoku Mini 6×6",
    maxScore: 450,
    minTime: 15,
    calcXp({ score }) {
      return Math.round(score / 4) + 10;
    },
    detailsSchema: ["secs", "mistakes", "hints"],
  },

  // ── file: hoc-ma-choi-lab.html ──────────────────────────────────────────
  flap: {
    name: "Chim Bay Qua Cổng",
    maxScore: 3000,
    minTime: 15,
    calcXp({ score }) {
      return Math.round(score / 6);
    },
    detailsSchema: ["gates", "bestCombo"],
  },
  g2048: {
    name: "2048 Lũy Thừa",
    maxScore: 100000,
    minTime: 20,
    calcXp({ score, details = {} }) {
      const maxTile = Number(details.maxTile) || 2;
      const tileLog = maxTile >= 2 ? Math.round(Math.log2(maxTile)) : 1;
      return Math.min(80, Math.round(score / 25)) + tileLog * 2;
    },
    detailsSchema: ["maxTile"],
  },
  chem: {
    name: "Nhà Hóa Học Nhí",
    maxScore: 200,
    minTime: 20,
    calcXp({ score, details = {} }) {
      const solved = Number(details.solved) || 0;
      return Math.round(score / 3) + solved * 2;
    },
    detailsSchema: ["solved", "totalWrong"],
  },
  clock: {
    name: "Đồng Hồ Thời Gian",
    maxScore: 350,
    minTime: 15,
    calcXp({ score }) {
      return Math.round(score / 4);
    },
    detailsSchema: ["right"],
  },
  pattern: {
    name: "Thám Tử Quy Luật",
    maxScore: 400,
    minTime: 15,
    calcXp({ score }) {
      return Math.round(score / 4);
    },
    detailsSchema: ["right"],
  },
  simon: {
    name: "Nhớ Dãy Màu",
    maxScore: 5000,
    minTime: 10,
    calcXp({ score, details = {} }) {
      const rounds = Number(details.rounds) || 0;
      return Math.round(score / 4) + rounds;
    },
    detailsSchema: ["rounds"],
  },
};

/**
 * Trả về config của một game, hoặc null nếu không hợp lệ.
 * @param {string} gameId
 * @returns {object|null}
 */
export function getGameConfig(gameId) {
  return MINI_GAME_CONFIG[gameId] ?? null;
}

/**
 * Tính XP server-side cho một ván chơi.
 * @param {string} gameId
 * @param {{ score: number, details?: object }} payload
 * @returns {number}
 */
export function calcXp(gameId, payload) {
  const cfg = getGameConfig(gameId);
  if (!cfg) return 0;
  return Math.max(0, cfg.calcXp(payload));
}

/**
 * Kiểm tra score có vượt trần không.
 * @returns {boolean} true = hợp lệ
 */
export function isScoreValid(gameId, score) {
  const cfg = getGameConfig(gameId);
  if (!cfg) return false;
  return Number.isFinite(score) && score >= 0 && score <= cfg.maxScore;
}

/**
 * Kiểm tra ván có đủ thời gian không (chống cheat tốc độ).
 * @param {string} gameId
 * @param {number} elapsedSec  — số giây từ startedAt đến now
 * @returns {boolean} true = hợp lệ (không bị nghi ngờ)
 */
export function isTimeValid(gameId, elapsedSec) {
  const cfg = getGameConfig(gameId);
  if (!cfg) return false;
  return elapsedSec >= cfg.minTime;
}

/** Danh sách huy hiệu và điều kiện mở (đánh giá server-side). */
export const BADGE_DEFINITIONS = [
  {
    id: "first",
    name: "Khởi động",
    icon: "🌱",
    /** @param {{ gamesPlayed: number }} progress */
    check: (progress) => progress.gamesPlayed >= 1,
  },
  {
    id: "all_basic",
    name: "Thử đủ 5 game cơ bản",
    icon: "🧭",
    check: (progress) => {
      const BASIC = ["math", "memory", "scramble", "quiz", "snake"];
      return BASIC.every((id) => (progress.played || []).includes(id));
    },
  },
  {
    id: "all_pro",
    name: "Thử đủ 5 game nâng cao",
    icon: "🚀",
    check: (progress) => {
      const PRO = ["ship", "word", "cannon", "race", "sudoku"];
      return PRO.every((id) => (progress.played || []).includes(id));
    },
  },
  {
    id: "all_lab",
    name: "Thử đủ 6 game Lab",
    icon: "🧪",
    check: (progress) => {
      const LAB = ["flap", "g2048", "chem", "clock", "pattern", "simon"];
      return LAB.every((id) => (progress.played || []).includes(id));
    },
  },
  {
    id: "flap",
    name: "Chim bay 10 cổng",
    icon: "🐦",
    /** @param {object} _ progress @param {object} details ván vừa chơi */
    check: (_, details) => details?.game === "flap" && (details?.gates ?? 0) >= 10,
  },
  {
    id: "t256",
    name: "Đạt ô 256",
    icon: "🔢",
    check: (_, details) => details?.game === "g2048" && (details?.maxTile ?? 0) >= 256,
  },
  {
    id: "chem",
    name: "Nhà hóa học",
    icon: "⚗️",
    check: (_, details) =>
      details?.game === "chem" &&
      (details?.solved ?? 0) === 8 &&
      (details?.totalWrong ?? 1) === 0,
  },
  {
    id: "clock",
    name: "Xem giờ 10/10",
    icon: "🕒",
    check: (_, details) => details?.game === "clock" && (details?.right ?? 0) === 10,
  },
  {
    id: "pat",
    name: "Thám tử quy luật",
    icon: "🕵️",
    check: (_, details) => details?.game === "pattern" && (details?.right ?? 0) === 10,
  },
  {
    id: "simon",
    name: "Nhớ 8 vòng",
    icon: "🧠",
    check: (_, details) => details?.game === "simon" && (details?.rounds ?? 0) >= 8,
  },
  {
    id: "ace",
    name: "Xạ thủ 10 liên tiếp",
    icon: "🎯",
    check: (_, details) => details?.game === "ship" && (details?.bestCombo ?? 0) >= 10,
  },
  {
    id: "wordle",
    name: "Đoán trong 3 lượt",
    icon: "💬",
    check: (_, details) =>
      details?.game === "word" && (details?.solved ?? 0) > 0 && (details?.minGuesses ?? 99) <= 3,
  },
  {
    id: "sniper",
    name: "Bắn trúng phát đầu",
    icon: "🎯",
    check: (_, details) => details?.game === "cannon" && details?.firstShotHit === true,
  },
  {
    id: "racer",
    name: "Về nhất đường đua",
    icon: "🏎️",
    check: (_, details) => details?.game === "race" && (details?.rank ?? 99) === 1,
  },
  {
    id: "sudoku_perfect",
    name: "Sudoku không sai",
    icon: "🔲",
    check: (_, details) =>
      details?.game === "sudoku" &&
      (details?.mistakes ?? 1) === 0 &&
      (details?.hints ?? 1) === 0,
  },
  {
    id: "lv3",
    name: "Đạt cấp 3",
    icon: "⭐",
    check: (progress) => progress.level >= 3,
  },
];
