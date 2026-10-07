// Định nghĩa bộ thành tựu của EduPlay.
// metric: nguồn số liệu dùng để tính tiến trình
//   - "coins": số xu hiện tại (coinService.get())
//   - "games": số trò chơi đã chơi (gameProgressService.listGames())
//   - "xp":    điểm kinh nghiệm (xpService.get())
//   - "tasks": số nhiệm vụ đã hoàn thành trong ngày (dailyTaskService.list() -> claimed)
export const ACHIEVEMENT_DEFS = [
  { id: "first-game",  icon: "🌱", title: "Bước chân đầu tiên",   desc: "Chơi 1 trò chơi bất kỳ",        metric: "games", target: 1,      reward: 50  },
  { id: "gamer-5",     icon: "🎮", title: "Game thủ",              desc: "Chơi 5 trò chơi khác nhau",      metric: "games", target: 5,      reward: 100 },
  { id: "gamer-15",    icon: "🕹️", title: "Bậc thầy trò chơi",      desc: "Chơi 15 trò chơi khác nhau",     metric: "games", target: 15,     reward: 200 },
  { id: "coins-1k",    icon: "🪙", title: "Tích cóp",              desc: "Sở hữu 1.000 xu",                metric: "coins", target: 1000,   reward: 50  },
  { id: "coins-50k",   icon: "💰", title: "Triệu phú nhí",         desc: "Sở hữu 50.000 xu",               metric: "coins", target: 50000,  reward: 150 },
  { id: "coins-500k",  icon: "👑", title: "Đại gia EduPlay",       desc: "Sở hữu 500.000 xu",              metric: "coins", target: 500000, reward: 300 },
  { id: "xp-500",      icon: "⭐", title: "Tích lũy kinh nghiệm",  desc: "Đạt 500 XP",                     metric: "xp",    target: 500,   reward: 100 },
  { id: "xp-5000",     icon: "🌟", title: "Ngôi sao tri thức",     desc: "Đạt 5.000 XP",                   metric: "xp",    target: 5000,  reward: 200 },
  { id: "tasks-3",     icon: "📋", title: "Chăm chỉ",              desc: "Hoàn thành 3 nhiệm vụ trong ngày", metric: "tasks", target: 3,    reward: 75  },
  { id: "tasks-8",     icon: "🏆", title: "Siêu sao nhiệm vụ",     desc: "Hoàn thành 8 nhiệm vụ trong ngày", metric: "tasks", target: 8,    reward: 150 },
];

// Tính tiến trình + trạng thái đạt/chưa đạt cho từng thành tựu.
// stats: { coins, games, xp, tasks }
export function evaluateAchievements(defs, stats) {
  return defs.map((d) => {
    const raw = Number(stats?.[d.metric]) || 0;
    return {
      ...d,
      progress: Math.min(raw, d.target),
      unlocked: raw >= d.target,
    };
  });
}
