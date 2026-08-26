import { getCollection } from "../db.js";
import { addCoins } from "./authService.js";
import { ObjectId } from "mongodb";

const TASKS_COL = "dailyTasks";
const PROGRESS_COL = "dailyTaskProgress";
const USERS_COL = "users";

const DEFAULT_TASKS = [
  { id: "play_1_game", name: "Chơi 1 trận", desc: "Hoàn thành 1 trận game bất kỳ", icon: "🎮", type: "play_game", target: 1, coinReward: 10, builtin: true, conditions: {} },
  { id: "play_3_games", name: "Chơi 3 trận", desc: "Hoàn thành 3 trận game", icon: "🏆", type: "play_game", target: 3, coinReward: 30, builtin: true, conditions: {} },
  { id: "answer_5_questions", name: "Trả lời 5 câu", desc: "Trả lời 5 câu hỏi bất kỳ", icon: "📝", type: "answer_question", target: 5, coinReward: 15, builtin: true, conditions: {} },
  { id: "answer_10_questions", name: "Trả lời 10 câu", desc: "Trả lời 10 câu hỏi", icon: "📖", type: "answer_question", target: 10, coinReward: 30, builtin: true, conditions: {} },
  { id: "answer_5_correct", name: "Trả lời đúng 5 câu", desc: "Trả lời đúng 5 câu hỏi", icon: "✅", type: "correct_answer", target: 5, coinReward: 25, builtin: true, conditions: {} },
  { id: "answer_10_correct", name: "Trả lời đúng 10 câu", desc: "Trả lời đúng 10 câu hỏi", icon: "🧠", type: "correct_answer", target: 10, coinReward: 50, builtin: true, conditions: {} },
  { id: "earn_100_xp", name: "Kiếm 100 XP", desc: "Tích lũy 100 XP trong ngày", icon: "⭐", type: "earn_xp", target: 100, coinReward: 20, builtin: true, conditions: {} },
  { id: "earn_500_xp", name: "Kiếm 500 XP", desc: "Tích lũy 500 XP trong ngày", icon: "🌟", type: "earn_xp", target: 500, coinReward: 80, builtin: true, conditions: {} },
  { id: "win_1_game", name: "Thắng 1 trận", desc: "Thắng 1 trận game", icon: "🎉", type: "win_game", target: 1, coinReward: 40, builtin: true, conditions: {} },
  { id: "login_today", name: "Đăng nhập hôm nay", desc: "Đăng nhập vào hệ thống", icon: "👋", type: "login", target: 1, coinReward: 5, builtin: true, conditions: {} },
];

function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function matchConditions(task, eventData) {
  const conds = task.conditions || {};
  if (!Object.keys(conds).length) return true;
  if (conds.gameType && eventData.gameType !== conds.gameType) return false;
  if (conds.gameId && eventData.gameId !== conds.gameId) return false;
  if (conds.minScore && (eventData.score || 0) < conds.minScore) return false;
  if (conds.category && eventData.category !== conds.category) return false;
  if (conds.difficulty && eventData.difficulty !== conds.difficulty) return false;
  return true;
}

async function getAllTasks() {
  const col = getCollection(TASKS_COL);
  const dbTasks = await col.find({}).sort({ createdAt: 1 }).toArray();
  return [
    ...DEFAULT_TASKS.map((t) => ({ ...t })),
    ...dbTasks.map((t) => ({
      id: t._id.toString(),
      name: t.name,
      desc: t.desc,
      icon: t.icon || "📋",
      type: t.type,
      target: t.target,
      coinReward: t.coinReward,
      conditions: t.conditions || {},
      builtin: false,
    })),
  ];
}

function findTaskById(tasks, id) {
  return tasks.find((t) => t.id === id) || null;
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

export async function getDailyTasks() {
  const tasks = await getAllTasks();
  return tasks.map((t) => ({
    id: t.id,
    name: t.name,
    desc: t.desc,
    icon: t.icon,
    type: t.type,
    target: t.target,
    coinReward: t.coinReward,
    conditions: t.conditions || {},
    builtin: !!t.builtin,
  }));
}

export async function getUserDailyStatus(userId) {
  const tasks = await getAllTasks();
  const progress = await getProgress(userId);
  return tasks.map((task) => {
    const p = progress.tasks[task.id] || { count: 0, claimed: false };
    return {
      id: task.id,
      name: task.name,
      desc: task.desc,
      icon: task.icon,
      target: task.target,
      coinReward: task.coinReward,
      builtin: !!task.builtin,
      current: Math.min(p.count, task.target),
      completed: p.count >= task.target,
      claimed: !!p.claimed,
    };
  });
}

export async function trackAction(userId, actionType, amount = 1, eventData = {}) {
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  await col.updateOne(
    { userId, date },
    { $setOnInsert: { createdAt: new Date().toISOString() } },
    { upsert: true }
  );

  const tasks = await getAllTasks();
  const relevant = tasks.filter((t) => t.type === actionType && matchConditions(t, eventData));
  if (!relevant.length) return;

  for (const task of relevant) {
    const pDoc = await col.findOne({ userId, date });
    const p = (pDoc?.tasks || {})[task.id] || { count: 0, claimed: false };
    if (p.count >= task.target) continue;

    const newCount = Math.min(p.count + amount, task.target);
    const update = { [`tasks.${task.id}.count`]: newCount };
    if (newCount >= task.target && !p.completedAt) {
      update[`tasks.${task.id}.completedAt`] = new Date().toISOString();
    }
    await col.updateOne({ userId, date }, { $set: update });
  }
}

export async function claimReward(userId, taskId) {
  const tasks = await getAllTasks();
  const task = findTaskById(tasks, taskId);
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

export async function createTask({ name, desc, icon, type, target, coinReward, conditions }) {
  if (!name || !type || !target || !coinReward) throw new Error("Thiếu trường bắt buộc");
  const col = getCollection(TASKS_COL);
  const doc = {
    name,
    desc: desc || "",
    icon: icon || "📋",
    type,
    target: Number(target),
    coinReward: Number(coinReward),
    conditions: conditions || {},
    createdAt: new Date().toISOString(),
  };
  const result = await col.insertOne(doc);
  return { id: result.insertedId.toString(), ...doc };
}

export async function updateTask(taskId, { name, desc, icon, type, target, coinReward, conditions }) {
  const col = getCollection(TASKS_COL);
  const oid = new ObjectId(taskId);
  const update = {};
  if (name !== undefined) update.name = name;
  if (desc !== undefined) update.desc = desc;
  if (icon !== undefined) update.icon = icon;
  if (type !== undefined) update.type = type;
  if (target !== undefined) update.target = Number(target);
  if (coinReward !== undefined) update.coinReward = Number(coinReward);
  if (conditions !== undefined) update.conditions = conditions;
  if (!Object.keys(update).length) return null;
  update.updatedAt = new Date().toISOString();
  await col.updateOne({ _id: oid }, { $set: update });
  return { id: taskId, ...update };
}

export async function deleteTask(taskId) {
  const col = getCollection(TASKS_COL);
  await col.deleteOne({ _id: new ObjectId(taskId) });
}

export async function getAdminStats() {
  const tasks = await getAllTasks();
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  const todayDocs = await col.find({ date }).toArray();

  const totalUsersToday = todayDocs.length;
  let totalClaimedToday = 0;
  let totalCoinsAwarded = 0;
  todayDocs.forEach((doc) => {
    const pt = doc.tasks || {};
    Object.entries(pt).forEach(([taskId, t]) => {
      if (t.claimed) {
        totalClaimedToday++;
        const def = findTaskById(tasks, taskId);
        if (def) totalCoinsAwarded += def.coinReward;
      }
    });
  });

  const taskStats = tasks.map((task) => {
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

  return { date, totalUsersToday, totalClaimedToday, totalCoinsAwarded, taskStats };
}

export async function getAllUsersProgress() {
  const tasks = await getAllTasks();
  const col = getCollection(PROGRESS_COL);
  const date = todayKey();
  const docs = await col.find({ date }).toArray();

  const userIds = [...new Set(docs.map((d) => d.userId))];
  let userMap = {};
  if (userIds.length) {
    const usersCol = getCollection(USERS_COL);
    const objectIds = userIds.map((id) => {
      try { return new ObjectId(id); } catch { return id; }
    });
    const users = await usersCol.find({ _id: { $in: objectIds } }).toArray();
    users.forEach((u) => { userMap[u._id?.toString()] = u.name || u.username || "Unknown"; });
  }

  return docs.map((doc) => {
    const pt = doc.tasks || {};
    const claimedCount = Object.values(pt).filter((t) => t.claimed).length;
    const totalReward = Object.entries(pt).reduce((s, [taskId, t]) => {
      if (!t.claimed) return s;
      const def = findTaskById(tasks, taskId);
      return s + (def ? def.coinReward : 0);
    }, 0);
    return {
      userId: doc.userId,
      userName: userMap[doc.userId] || "Unknown",
      date: doc.date,
      tasks: pt,
      claimedCount,
      totalReward,
    };
  });
}

export async function resetDailyProgress(userId) {
  const col = getCollection(PROGRESS_COL);
  await col.deleteOne({ userId, date: todayKey() });
}
