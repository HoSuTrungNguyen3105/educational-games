import { getCollection } from "../db.js";
import { addCoins } from "./authService.js";

const TASKS_COL = "tasks";
const PROGRESS_COL = "user_task_progress";
const EVENTS_COL = "task_events";

// ── Scope helpers ──

function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function weekKey() {
  const d = new Date();
  const jan1 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((d - jan1) / 86400000) + 1;
  const weekNum = Math.ceil(dayOfYear / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function getPeriodKey(scope) {
  switch (scope) {
    case "DAILY": return todayKey();
    case "WEEKLY": return weekKey();
    case "TOTAL": return "TOTAL";
    case "EVENT": return "TOTAL";
    default: return todayKey();
  }
}

// ── Task definitions ──

export async function getAllActiveTasks() {
  return getCollection(TASKS_COL)
    .find({ isActive: true })
    .sort({ sortOrder: 1 })
    .toArray();
}

export async function getTaskByCode(code) {
  return getCollection(TASKS_COL).findOne({ code });
}

export async function getTaskById(id) {
  const { ObjectId } = await import("mongodb");
  return getCollection(TASKS_COL).findOne({ _id: new ObjectId(id) });
}

// ── User progress ──

async function getOrCreateProgress(userId, taskId, periodKey) {
  const col = getCollection(PROGRESS_COL);
  let doc = await col.findOne({ userId, taskId, periodKey });
  if (!doc) {
    doc = {
      userId,
      taskId,
      progress: 0,
      target: 0,
      completed: false,
      claimed: false,
      completedAt: null,
      claimedAt: null,
      periodKey,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await col.insertOne(doc);
  }
  return doc;
}

export async function getUserTaskProgress(userId, scope = "DAILY") {
  const tasks = await getAllActiveTasks();
  const periodKey = getPeriodKey(scope);
  const scopedTasks = tasks.filter((t) => t.scope === scope);

  const col = getCollection(PROGRESS_COL);
  const progressDocs = await col
    .find({ userId, periodKey, taskId: { $in: scopedTasks.map((t) => t._id.toString()) } })
    .toArray();

  const progressMap = {};
  for (const doc of progressDocs) {
    progressMap[doc.taskId] = doc;
  }

  return scopedTasks.map((task) => {
    const taskId = task._id.toString();
    const p = progressMap[taskId] || { progress: 0, completed: false, claimed: false };
    return {
      id: taskId,
      code: task.code,
      name: task.name,
      description: task.description,
      icon: task.icon,
      type: task.type,
      target: task.target,
      scope: task.scope,
      gameId: task.gameId,
      rewardXp: task.rewardXp || 0,
      rewardCoin: task.rewardCoin || 0,
      progress: Math.min(p.progress, task.target),
      completed: p.completed,
      claimed: p.claimed,
      completedAt: p.completedAt,
      claimedAt: p.claimedAt,
    };
  });
}

export async function getUserAllTaskStatus(userId) {
  const tasks = await getAllActiveTasks();
  const col = getCollection(PROGRESS_COL);

  const results = [];
  for (const task of tasks) {
    const periodKey = getPeriodKey(task.scope);
    const p = await col.findOne({ userId, taskId: task._id.toString(), periodKey });
    results.push({
      id: task._id.toString(),
      code: task.code,
      name: task.name,
      description: task.description,
      icon: task.icon,
      type: task.type,
      target: task.target,
      scope: task.scope,
      gameId: task.gameId,
      rewardXp: task.rewardXp || 0,
      rewardCoin: task.rewardCoin || 0,
      progress: Math.min(p?.progress || 0, task.target),
      completed: p?.completed || false,
      claimed: p?.claimed || false,
      completedAt: p?.completedAt || null,
      claimedAt: p?.claimedAt || null,
    });
  }

  return results;
}

// ── Core: process event through task engine ──

export async function processTaskEvent(userId, { eventId, type, gameId, metadata = {} }) {
  if (!type) throw new Error("Event type is required");

  // 1. Dedup check
  if (eventId) {
    const exists = await getCollection(EVENTS_COL).findOne({ eventId });
    if (exists) return { processed: false, reason: "duplicate", eventId };
  }

  // 2. Save event
  if (eventId) {
    await getCollection(EVENTS_COL).insertOne({
      eventId,
      userId,
      type,
      gameId: gameId || null,
      metadata,
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Find matching tasks
  const allTasks = await getAllActiveTasks();
  const matchingTasks = allTasks.filter((task) => {
    if (task.type !== type) return false;
    // If task has gameId, it must match; if task has no gameId, it matches all
    if (task.gameId && gameId && task.gameId !== gameId) return false;
    return true;
  });

  if (!matchingTasks.length) return { processed: true, updated: 0 };

  // 4. Calculate event amount
  let amount = 1;
  if (metadata.amount && metadata.amount > 0) {
    amount = metadata.amount;
  }

  // 5. Update progress for each matching task
  let updated = 0;
  let completedTasks = [];

  for (const task of matchingTasks) {
    const periodKey = getPeriodKey(task.scope);
    const taskId = task._id.toString();
    const col = getCollection(PROGRESS_COL);

    // Upsert progress doc
    await col.updateOne(
      { userId, taskId, periodKey },
      {
        $setOnInsert: {
          target: task.target,
          claimed: false,
          completedAt: null,
          claimedAt: null,
          createdAt: new Date().toISOString(),
        },
        $set: { updatedAt: new Date().toISOString() },
      },
      { upsert: true }
    );

    const pDoc = await col.findOne({ userId, taskId, periodKey });
    if (pDoc.completed) continue; // Already completed, skip

    const newProgress = Math.min((pDoc.progress || 0) + amount, task.target);
    const isCompleted = newProgress >= task.target;

    const update = { progress: newProgress, updatedAt: new Date().toISOString() };
    if (isCompleted) {
      update.completed = true;
      update.completedAt = new Date().toISOString();
    }

    await col.updateOne({ userId, taskId, periodKey }, { $set: update });
    updated++;

    if (isCompleted) {
      completedTasks.push({ taskId, code: task.code, name: task.name });
    }
  }

  return { processed: true, updated, completedTasks };
}

// ── Claim reward ──

export async function claimTaskReward(userId, taskId) {
  const task = await getTaskById(taskId);
  if (!task) throw new Error("Nhiệm vụ không tồn tại");

  const periodKey = getPeriodKey(task.scope);
  const col = getCollection(PROGRESS_COL);
  const pDoc = await col.findOne({ userId, taskId, periodKey });

  if (!pDoc) throw new Error("Chưa có tiến độ nhiệm vụ");
  if (!pDoc.completed) throw new Error("Chưa hoàn thành nhiệm vụ");
  if (pDoc.claimed) throw new Error("Đã nhận thưởng rồi");

  // Transaction-like: mark claimed first
  await col.updateOne(
    { userId, taskId, periodKey, claimed: false },
    { $set: { claimed: true, claimedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }
  );

  // Add coins
  let newCoins = null;
  if (task.rewardCoin > 0) {
    newCoins = await addCoins(userId, task.rewardCoin);
  }

  return {
    taskId,
    code: task.code,
    name: task.name,
    rewardXp: task.rewardXp || 0,
    rewardCoin: task.rewardCoin || 0,
    newCoins,
  };
}

// ── Admin: CRUD tasks ──

export async function createTask({ code, name, description, icon, type, target, rewardXp, rewardCoin, scope, gameId, isActive, sortOrder }) {
  if (!code || !name || !type || !target) throw new Error("Thiếu trường bắt buộc (code, name, type, target)");

  const existing = await getCollection(TASKS_COL).findOne({ code });
  if (existing) throw new Error(`Mã nhiệm vụ "${code}" đã tồn tại`);

  const doc = {
    code,
    name,
    description: description || "",
    icon: icon || "📋",
    type,
    target: Number(target),
    rewardXp: Number(rewardXp || 0),
    rewardCoin: Number(rewardCoin || 0),
    scope: scope || "DAILY",
    gameId: gameId || null,
    isActive: isActive !== false,
    sortOrder: sortOrder || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await getCollection(TASKS_COL).insertOne(doc);
  return { id: result.insertedId.toString(), ...doc };
}

export async function updateTask(taskId, data) {
  const { ObjectId } = await import("mongodb");
  const col = getCollection(TASKS_COL);
  const update = {};
  const fields = ["code", "name", "description", "icon", "type", "target", "rewardXp", "rewardCoin", "scope", "gameId", "isActive", "sortOrder"];
  for (const f of fields) {
    if (data[f] !== undefined) {
      update[f] = f === "target" || f === "rewardXp" || f === "rewardCoin" || f === "sortOrder" ? Number(data[f]) : data[f];
    }
  }
  if (!Object.keys(update).length) return null;
  update.updatedAt = new Date().toISOString();
  await col.updateOne({ _id: new ObjectId(taskId) }, { $set: update });
  return { id: taskId, ...update };
}

export async function deleteTask(taskId) {
  const { ObjectId } = await import("mongodb");
  await getCollection(TASKS_COL).deleteOne({ _id: new ObjectId(taskId) });
}

// ── Admin: stats ──

export async function getTaskStats() {
  const tasks = await getAllActiveTasks();
  const col = getCollection(PROGRESS_COL);

  const results = [];
  for (const task of tasks) {
    const periodKey = getPeriodKey(task.scope);
    const progressDocs = await col.find({ taskId: task._id.toString(), periodKey }).toArray();
    const completedCount = progressDocs.filter((p) => p.completed).length;
    const claimedCount = progressDocs.filter((p) => p.claimed).length;
    results.push({
      ...task,
      _id: undefined,
      id: task._id.toString(),
      completedCount,
      claimedCount,
      totalCoinsAwarded: claimedCount * (task.rewardCoin || 0),
    });
  }

  const totalParticipants = await col.distinct("userId").then((ids) => ids.length);
  const allProgress = await col.find({}).toArray();
  const totalClaimed = allProgress.filter((p) => p.claimed).length;
  const totalCoinsAwarded = allProgress.reduce((sum, p) => {
    if (!p.claimed) return sum;
    const task = tasks.find((t) => t._id.toString() === p.taskId);
    return sum + (task?.rewardCoin || 0);
  }, 0);

  return {
    totalTasks: tasks.length,
    totalParticipants,
    totalClaimed,
    totalCoinsAwarded,
    tasks: results,
  };
}
