import { getCollection } from "../db.js";
import { addCoins } from "./authService.js";

const PROGRESS_COL = "dailyTaskProgress";
const USERS_COL = "users";

const DAILY_TASKS = [
  {
    id: "play_1_game",
    name: "Chơi 1 trận",
    desc: "Hoàn thành 1 trận game bất kỳ",
    icon: "🎮",
    type: "play_game",
    target: 1,
    coinReward: 10,
  },
  {
    id: "play_3_games",
    name: "Chơi 3 trận",
    desc: "Hoàn thành 3 trận game",
    icon: "🏆",
    type: "play_game",
    target: 3,
    coinReward: 30,
  },
  {
    id: "answer_5_correct",
    name: "Trả lời đúng 5 câu",
    desc: "Trả lời đúng 5 câu hỏi",
    icon: "📖",
    type: "correct_answer",
    target: 5,
    coinReward: 25,
  },
  {
    id: "answer_10_correct",
    name: "Trả lời đúng 10 câu",
    desc: "Trả lời đúng 10 câu hỏi",
    icon: "🧠",
    type: "correct_answer",
    target: 10,
    coinReward: 50,
  },
  {
    id: "earn_100_xp",
    name: "Kiếm 100 XP",
    desc: "Tích lũy 100 XP trong ngày",
    icon: "⭐",
    type: "earn_xp",
    target: 100,
    coinReward: 20,
  },
  {
    id: "earn_500_xp",
    name: "Kiếm 500 XP",
    desc: "Tích lũy 500 XP trong ngày",
    icon: "🌟",
    type: "earn_xp",
    target: 500,
    coinReward: 80,
  },
  {
    id: "win_1_game",
    name: "Thắng 1 trận",
    desc: "Thắng 1 trận game",
    icon: "🎉",
    type: "win_game",
    target: 1,
    coinReward: 40,
  },
  {
    id: "login_today",
    name: "Đăng nhập hôm nay",
    desc: "Đăng nhập vào hệ thống",
    icon: "👋",
    type: "login",
    target: 1,
    coinReward: 5,
  },
];

function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

async function getProgress(userId) {
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  let doc = await col.findOne({ userId, date });
  if (!doc) {
    doc = { userId, date, tasks: {}, createdAt: new Date().toISOString() };
    await col.insertOne(doc);
  }
  return doc;
}

export function getDailyTasks() {
  return DAILY_TASKS.map((t) => ({
    id: t.id,
    name: t.name,
    desc: t.desc,
    icon: t.icon,
    type: t.type,
    target: t.target,
    coinReward: t.coinReward,
  }));
}

export async function getUserDailyStatus(userId) {
  const progress = await getProgress(userId);
  return DAILY_TASKS.map((task) => {
    const p = progress.tasks[task.id] || { count: 0, claimed: false };
    return {
      id: task.id,
      name: task.name,
      desc: task.desc,
      icon: task.icon,
      target: task.target,
      coinReward: task.coinReward,
      current: Math.min(p.count, task.target),
      completed: p.count >= task.target,
      claimed: !!p.claimed,
    };
  });
}

export async function trackAction(userId, actionType, amount = 1) {
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  await col.updateOne(
    { userId, date },
    { $setOnInsert: { createdAt: new Date().toISOString() } },
    { upsert: true }
  );

  const relevant = DAILY_TASKS.filter((t) => t.type === actionType);
  if (!relevant.length) return;

  for (const task of relevant) {
    const field = `tasks.${task.id}.count`;
    await col.updateOne(
      { userId, date },
      { $inc: { [field]: amount } }
    );
  }
}

export async function claimReward(userId, taskId) {
  const task = DAILY_TASKS.find((t) => t.id === taskId);
  if (!task) throw new Error("Nhiệm vụ không tồn tại");

  const progress = await getProgress(userId);
  const p = progress.tasks[taskId] || { count: 0, claimed: false };

  if (p.claimed) throw new Error("Đã nhận thưởng rồi");
  if (p.count < task.target) throw new Error("Chưa hoàn thành nhiệm vụ");

  const col = getCollection(PROGRESS_COL);
  await col.updateOne(
    { userId, date: todayKey() },
    { $set: { [`tasks.${taskId}.claimed`]: true } }
  );

  const newCoins = await addCoins(userId, task.coinReward);
  return { coinReward: task.coinReward, newCoins };
}

// ═══════════════════════════════ ADMIN ═══════════════════════════════

export async function getAdminStats() {
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  const todayDocs = await col.find({ date }).toArray();

  const totalUsersToday = todayDocs.length;
  const totalClaimedToday = todayDocs.reduce((sum, doc) => {
    const tasks = doc.tasks || {};
    return sum + Object.values(tasks).filter((t) => t.claimed).length;
  }, 0);
  const totalCoinsAwarded = todayDocs.reduce((sum, doc) => {
    const tasks = doc.tasks || {};
    return sum + Object.entries(tasks).reduce((s, [taskId, t]) => {
      if (!t.claimed) return s;
      const def = DAILY_TASKS.find((d) => d.id === taskId);
      return s + (def ? def.coinReward : 0);
    }, 0);
  }, 0);

  const taskStats = DAILY_TASKS.map((task) => {
    const completed = todayDocs.filter((doc) => {
      const t = (doc.tasks || {})[task.id];
      return t && t.count >= task.target;
    }).length;
    const claimed = todayDocs.filter((doc) => {
      const t = (doc.tasks || {})[task.id];
      return t && t.claimed;
    }).length;
    return {
      ...task,
      completed,
      claimed,
      totalCoinsAwarded: claimed * task.coinReward,
    };
  });

  return {
    date,
    totalUsersToday,
    totalClaimedToday,
    totalCoinsAwarded,
    taskStats,
  };
}

export async function getAllUsersProgress() {
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  const docs = await col.find({ date }).toArray();

  const userIds = [...new Set(docs.map((d) => d.userId))];
  let userMap = {};
  if (userIds.length) {
    const { ObjectId } = await import("mongodb");
    const usersCol = getCollection(USERS_COL);
    const objectIds = userIds.map((id) => {
      try { return new ObjectId(id); } catch { return id; }
    });
    const users = await usersCol.find({ _id: { $in: objectIds } }).toArray();
    users.forEach((u) => { userMap[u._id?.toString()] = u.name || u.username || "Unknown"; });
  }

  return docs.map((doc) => {
    const tasks = doc.tasks || {};
    const claimedCount = Object.values(tasks).filter((t) => t.claimed).length;
    const totalReward = Object.entries(tasks).reduce((s, [taskId, t]) => {
      if (!t.claimed) return s;
      const def = DAILY_TASKS.find((d) => d.id === taskId);
      return s + (def ? def.coinReward : 0);
    }, 0);
    return {
      userId: doc.userId,
      userName: userMap[doc.userId] || "Unknown",
      date: doc.date,
      tasks,
      claimedCount,
      totalReward,
    };
  });
}

export async function resetDailyProgress(userId) {
  const col = getCollection(PROGRESS_COL);
  await col.deleteOne({ userId, date: todayKey() });
}
