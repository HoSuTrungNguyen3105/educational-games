import { MongoClient, ObjectId } from "mongodb";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");

let client = null;
let db = null;
let ready = false;

export function isReady() {
  return ready;
}

function loadDataFile(name) {
  const raw = readFileSync(path.join(DATA_DIR, name), "utf8");
  return JSON.parse(raw);
}

export const seedData = {
  templates: () => loadDataFile("templates.json"),
  categories: () => loadDataFile("CATEGORIES.json"),
  games: () => loadDataFile("initialGames.json"),
  questions: () => loadDataFile("initialQuestions.json"),
  players: () => loadDataFile("players.json"),
  results: () => loadDataFile("initialResults.json"),
  users: () => {
    const u = loadDataFile("users.json");
    return Array.isArray(u) ? u : [u];
  },
  subjects: () => loadDataFile("SUBJECTS.json"),
};

export async function connect() {
  if (db) return db;
  client = new MongoClient(config.mongoUri);
  await client.connect();
  db = client.db(config.dbName);
  console.log(`[db] Kết nối MongoDB: ${config.mongoUri}/${config.dbName}`);
  return db;
}

export function getDb() {
  if (!db) throw new Error("Chưa kết nối database. Gọi connect() trước.");
  return db;
}

export function getCollection(name) {
  return getDb().collection(name);
}

export async function close() {
  if (client) await client.close();
  client = null;
  db = null;
}

export async function initDatabase() {
  await connect();
  const database = getDb();
  const created = [];
  const seeded = [];

  const collectionDefs = {
    templates: { $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "type", "category", "icon", "ring", "status"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        type: { enum: ["play-to-learn", "play-to-win"] },
        category: { bsonType: "string" },
        icon: { bsonType: "string" },
        ring: { bsonType: "string" },
        htmlTemplate: { bsonType: "string" },
        thumbnail: { bsonType: "string" },
        status: { enum: ["published", "draft", "inactive"] },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    games: { $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "status", "questionsCount", "playersCount", "code"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        subject: { bsonType: "string" },
        topic: { bsonType: "string" },
        language: { bsonType: "string" },
        templateId: { bsonType: "objectId" },
        type: { enum: ["play-to-learn", "play-to-win"] },
        status: { enum: ["published", "draft"] },
        code: { bsonType: "string" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    questions: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "gameId", "content", "options", "correctAnswer"],
      properties: {
        id: { bsonType: "string" },
        gameId: { bsonType: "string" },
        content: { bsonType: "string" },
        options: { bsonType: "array" },
        correctAnswer: { bsonType: "string" },
      },
    } },
    players: { $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: { name: { bsonType: "string" } },
    } },
    results: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "gameId", "playerId", "playerName", "score", "correctAnswers", "totalQuestions", "accuracy"],
      properties: {
        id: { bsonType: "string" },
        gameId: { bsonType: "string" },
        playerId: { bsonType: "string" },
        playerName: { bsonType: "string" },
      },
    } },
    users: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "username", "name", "role", "passwordHash"],
      properties: {
        id: { bsonType: "string" },
        username: { bsonType: "string" },
        name: { bsonType: "string" },
        role: { enum: ["teacher", "student", "admin"] },
        passwordHash: { bsonType: "string" },
        classId: { bsonType: "string" },
        avatarLoadout: { bsonType: "object" },
        inventory: { bsonType: "array" },
        createdAt: { bsonType: "string" },
      },
    } },
    categories: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "label"],
      properties: { id: { bsonType: "string" }, label: { bsonType: "string" } },
    } },
    subjects: { $jsonSchema: {
      bsonType: "object",
      required: ["list"],
      properties: { list: { bsonType: "array" } },
    } },
    notifications: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "toUserId", "type", "read", "createdAt"],
      properties: {
        id: { bsonType: "string" },
        fromUserId: { bsonType: "string" },
        fromUsername: { bsonType: "string" },
        fromName: { bsonType: "string" },
        toUserId: { bsonType: "string" },
        gameId: { bsonType: "string" },
        gameName: { bsonType: "string" },
        gameCode: { bsonType: "string" },
        type: { bsonType: "string" },
        title: { bsonType: "string" },
        message: { bsonType: "string" },
        data: { bsonType: "object" },
        read: { bsonType: "bool" },
        sentAt: { bsonType: "string" },
        createdAt: { bsonType: "string" },
      },
    } },
    user_devices: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "userId", "token", "deviceType", "isActive"],
      properties: {
        id: { bsonType: "string" },
        userId: { bsonType: "string" },
        token: { bsonType: "string" },
        deviceType: { bsonType: "string" },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    classes: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "name", "code", "status"],
      properties: {
        id: { bsonType: "string" },
        name: { bsonType: "string" },
        code: { bsonType: "string" },
        schoolYear: { bsonType: "string" },
        status: { enum: ["ACTIVE", "INACTIVE"] },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    teacher_classes: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "teacherId", "classId"],
      properties: {
        id: { bsonType: "string" },
        teacherId: { bsonType: "string" },
        classId: { bsonType: "string" },
        createdAt: { bsonType: "string" },
      },
    } },
    assignments: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "teacherId", "title", "classId", "code", "status"],
      properties: {
        id: { bsonType: "string" },
        teacherId: { bsonType: "string" },
        templateId: { bsonType: "string" },
        gameId: { bsonType: "string" },
        questionIds: { bsonType: "array" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        classId: { bsonType: "string" },
        code: { bsonType: "string" },
        isExam: { bsonType: "bool" },
        examDuration: { bsonType: "int" },
        deadline: { bsonType: "string" },
        status: { enum: ["ACTIVE", "CLOSED"] },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    submissions: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "assignmentId", "studentId", "status"],
      properties: {
        id: { bsonType: "string" },
        assignmentId: { bsonType: "string" },
        studentId: { bsonType: "string" },
        startedAt: { bsonType: "string" },
        submittedAt: { bsonType: "string" },
        status: { enum: ["IN_PROGRESS", "SUBMITTED"] },
        score: { bsonType: "double" },
        correctCount: { bsonType: "int" },
        wrongCount: { bsonType: "int" },
        totalQuestions: { bsonType: "int" },
        answers: { bsonType: "array" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    gardens: { $jsonSchema: {
      bsonType: "object",
      required: ["userId", "slots"],
      properties: {
        userId: { bsonType: "string" },
        slots: { bsonType: "array" },
        inventory: { bsonType: "object" },
        createdAt: { bsonType: "string" },
      },
    } },
    plantTypes: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "name"],
      properties: {
        id: { bsonType: "string" },
        name: { bsonType: "string" },
        icon: { bsonType: "string" },
        stages: { bsonType: "int" },
        growthTime: { bsonType: "int" },
        harvestCoin: { bsonType: "int" },
        seedPrice: { bsonType: "int" },
        rarity: { bsonType: "string" },
        palette: { bsonType: "object" },
      },
    } },
  };

  for (const name of Object.keys(collectionDefs)) {
    try {
      await database.createCollection(name);
      created.push(name);
    } catch (e) {
      if (e.code !== 48) throw e;
    }
  }

  // Drop stale indexes from old schema that conflict with new schema.
  // Old code had unique indexes on string 'id' fields. After migration
  // $unset removes 'id', all docs have id: null → unique index violation.
  const staleIndexes = [
    ["games", "id_1"],
    ["templates", "id_1"],
    ["templates", "slug_1"],
  ];
  for (const [col, idxName] of staleIndexes) {
    try {
      await database.collection(col).dropIndex(idxName);
    } catch (e) {
      // Index may not exist, ignore
    }
  }

  const indexDefs = [
    ["games", { code: 1 }, { unique: true }],
    ["games", { templateId: 1 }],
    ["games", { status: 1 }],
    ["games", { updatedAt: -1 }],
    ["templates", { name: 1 }],
    ["questions", { id: 1 }, { unique: true }],
    ["questions", { gameId: 1 }],
    ["questions", { gameId: 1, id: 1 }, { unique: true }],
    ["players", { name: 1 }],
    ["results", { id: 1 }, { unique: true }],
    ["results", { gameId: 1 }],
    ["results", { gameId: 1, score: -1 }],
    ["users", { id: 1 }, { unique: true }],
    ["users", { username: 1 }, { unique: true }],
    ["users", { name: 1 }],
    ["messages", { conversationId: 1, createdAt: -1, id: -1 }],
    ["messages", { clientMessageId: 1 }, { unique: true, sparse: true }],
    ["chatReadStates", { conversationId: 1, playerId: 1 }, { unique: true }],
    ["conversations", { id: 1 }, { unique: true }],
    ["conversations", { type: 1 }],
    ["conversations", { gameId: 1 }],
    ["conversationMembers", { conversationId: 1, userId: 1 }, { unique: true }],
    ["conversationMembers", { userId: 1 }],
    ["dailyTaskProgress", { userId: 1, date: 1 }, { unique: true }],
    // Task system v2 indexes
    ["tasks", { code: 1 }, { unique: true }],
    ["tasks", { type: 1 }],
    ["tasks", { isActive: 1 }],
    ["tasks", { scope: 1 }],
    ["tasks", { gameId: 1 }],
    ["user_task_progress", { userId: 1, taskId: 1, periodKey: 1 }, { unique: true }],
    ["user_task_progress", { userId: 1 }],
    ["user_task_progress", { periodKey: 1 }],
    ["task_events", { eventId: 1 }, { unique: true }],
    ["task_events", { userId: 1 }],
    // Notification system indexes
    ["notifications", { id: 1 }, { unique: true }],
    ["notifications", { toUserId: 1, read: 1 }],
    ["notifications", { toUserId: 1, createdAt: -1 }],
    // User device indexes
    ["user_devices", { id: 1 }, { unique: true }],
    ["user_devices", { userId: 1 }],
    ["user_devices", { token: 1 }, { unique: true }],
    ["user_devices", { userId: 1, isActive: 1 }],
    // Class system indexes
    ["classes", { id: 1 }, { unique: true }],
    ["classes", { code: 1 }, { unique: true }],
    ["classes", { status: 1 }],
    ["teacher_classes", { id: 1 }, { unique: true }],
    ["teacher_classes", { teacherId: 1 }],
    ["teacher_classes", { classId: 1 }],
    ["teacher_classes", { teacherId: 1, classId: 1 }, { unique: true }],
    // Assignment system indexes
    ["assignments", { id: 1 }, { unique: true }],
    ["assignments", { code: 1 }, { unique: true }],
    ["assignments", { classId: 1 }],
    ["assignments", { teacherId: 1 }],
    ["assignments", { gameId: 1 }],
    ["assignments", { status: 1 }],
    ["assignments", { deadline: 1 }],
    // Submission system indexes
    ["submissions", { id: 1 }, { unique: true }],
    ["submissions", { assignmentId: 1, studentId: 1 }, { unique: true }],
    ["submissions", { studentId: 1 }],
    ["submissions", { assignmentId: 1 }],
    // Garden system indexes
    ["gardens", { userId: 1 }, { unique: true }],
  ];

  const createdIndexes = [];
  for (const [col, keys, opts = {}] of indexDefs) {
    try {
      await database.collection(col).createIndex(keys, opts);
      createdIndexes.push(`${col}:${JSON.stringify(keys)}`);
    } catch (e) {
      console.error(`[db] Lỗi tạo index ${col}:`, e.message);
    }
  }

  // Clear any existing validators from PREVIOUS deployments BEFORE migrations
  const allCollections = Object.keys(collectionDefs);
  for (const name of allCollections) {
    try {
      await database.command({ collMod: name, validator: {} });
    } catch (e) {
      // Collection may not exist yet, ignore
    }
  }

  // Seed nếu collection rỗng
  const templatesColl = database.collection("templates");
  const templatesCount = await templatesColl.countDocuments();
  if (templatesCount === 0) {
    const docs = seedData.templates();
    await templatesColl.insertMany(docs, { ordered: false });
    seeded.push(`templates (${docs.length})`);
  }

  // Games seed — resolve templateId from template slug
  const gamesColl = database.collection("games");
  const gamesCount = await gamesColl.countDocuments();
  if (gamesCount === 0) {
    const rawGames = seedData.games();
    const allTemplates = await templatesColl.find({}).toArray();
    const slugToId = {};
    for (const t of allTemplates) {
      if (t.slug) slugToId[t.slug] = t._id;
      slugToId[t.id] = t._id;
    }
    const now = new Date().toISOString();
    const migrated = rawGames.map(g => {
      let tplId = null;
      if (g.templateId) {
        try { tplId = new ObjectId(g.templateId); } catch { tplId = null; }
      }
      if (!tplId && g.template) tplId = slugToId[g.template] || null;
      return {
        name: g.title || g.name || "Game",
        description: g.description || "",
        subject: g.subject || "",
        topic: g.topic || "",
        language: g.language || "vi",
        templateId: tplId,
        type: g.type || "play-to-learn",
        status: g.status || "draft",
        questionsCount: g.questionsCount || 0,
        playersCount: g.playersCount || 0,
        code: g.code || "",
        createdAt: g.createdAt || now,
        updatedAt: g.updatedAt || now,
      };
    });
    await gamesColl.insertMany(migrated, { ordered: false });
    seeded.push(`games (${migrated.length})`);
  }

  // Questions seed — resolve gameCode → gameId (ObjectId)
  const questionsColl = database.collection("questions");
  const questionsCount = await questionsColl.countDocuments();
  if (questionsCount === 0) {
    const rawQuestions = seedData.questions();
    const allGames = await gamesColl.find({}, { code: 1 }).toArray();
    const codeToId = {};
    for (const g of allGames) {
      if (g.code) codeToId[g.code] = g._id;
    }
    const prepared = rawQuestions
      .map((q) => {
        const gameId = q.gameCode ? codeToId[q.gameCode] : null;
        if (!gameId) return null;
        const { gameCode, _id, ...rest } = q;
        return { ...rest, gameId: gameId.toString() };
      })
      .filter(Boolean);
    if (prepared.length > 0) {
      await questionsColl.insertMany(prepared, { ordered: false });
      seeded.push(`questions (${prepared.length})`);
    }
  }

  // ── Task system v2: seed default tasks if empty ──
  const tasksColl = database.collection("tasks");
  const tasksCount = await tasksColl.countDocuments();
  if (tasksCount === 0) {
    const now = new Date().toISOString();
    const defaultTasks = [
      { code: "PLAY_1", name: "Chơi 1 trận", description: "Hoàn thành 1 trận game bất kỳ", icon: "🎮", type: "GAME_PLAYED", target: 1, rewardXp: 0, rewardCoin: 10, scope: "DAILY", gameId: null, isActive: true, sortOrder: 1, createdAt: now, updatedAt: now },
      { code: "PLAY_3", name: "Chơi 3 trận", description: "Hoàn thành 3 trận game", icon: "🏆", type: "GAME_PLAYED", target: 3, rewardXp: 0, rewardCoin: 30, scope: "DAILY", gameId: null, isActive: true, sortOrder: 2, createdAt: now, updatedAt: now },
      { code: "PLAY_10", name: "Chơi 10 trận", description: "Hoàn thành 10 trận game", icon: "🎯", type: "GAME_PLAYED", target: 10, rewardXp: 0, rewardCoin: 50, scope: "WEEKLY", gameId: null, isActive: true, sortOrder: 3, createdAt: now, updatedAt: now },
      { code: "WIN_1", name: "Thắng 1 trận", description: "Thắng 1 trận game", icon: "🎉", type: "GAME_WON", target: 1, rewardXp: 0, rewardCoin: 40, scope: "DAILY", gameId: null, isActive: true, sortOrder: 4, createdAt: now, updatedAt: now },
      { code: "WIN_5", name: "Thắng 5 trận", description: "Thắng 5 trận game", icon: "🏅", type: "GAME_WON", target: 5, rewardXp: 0, rewardCoin: 80, scope: "WEEKLY", gameId: null, isActive: true, sortOrder: 5, createdAt: now, updatedAt: now },
      { code: "ANSWER_5", name: "Trả lời 5 câu", description: "Trả lời 5 câu hỏi bất kỳ", icon: "📝", type: "QUESTION_ANSWERED", target: 5, rewardXp: 0, rewardCoin: 15, scope: "DAILY", gameId: null, isActive: true, sortOrder: 6, createdAt: now, updatedAt: now },
      { code: "ANSWER_10", name: "Trả lời 10 câu", description: "Trả lời 10 câu hỏi", icon: "📖", type: "QUESTION_ANSWERED", target: 10, rewardXp: 0, rewardCoin: 30, scope: "DAILY", gameId: null, isActive: true, sortOrder: 7, createdAt: now, updatedAt: now },
      { code: "CORRECT_5", name: "Trả lời đúng 5 câu", description: "Trả lời đúng 5 câu hỏi", icon: "✅", type: "ANSWER_CORRECT", target: 5, rewardXp: 0, rewardCoin: 25, scope: "DAILY", gameId: null, isActive: true, sortOrder: 8, createdAt: now, updatedAt: now },
      { code: "CORRECT_10", name: "Trả lời đúng 10 câu", description: "Trả lời đúng 10 câu hỏi", icon: "🧠", type: "ANSWER_CORRECT", target: 10, rewardXp: 0, rewardCoin: 50, scope: "DAILY", gameId: null, isActive: true, sortOrder: 9, createdAt: now, updatedAt: now },
      { code: "XP_100", name: "Kiếm 100 XP", description: "Tích lũy 100 XP", icon: "⭐", type: "XP_EARNED", target: 100, rewardXp: 0, rewardCoin: 20, scope: "DAILY", gameId: null, isActive: true, sortOrder: 10, createdAt: now, updatedAt: now },
      { code: "XP_500", name: "Kiếm 500 XP", description: "Tích lũy 500 XP", icon: "🌟", type: "XP_EARNED", target: 500, rewardXp: 0, rewardCoin: 80, scope: "DAILY", gameId: null, isActive: true, sortOrder: 11, createdAt: now, updatedAt: now },
      { code: "LOGIN_1", name: "Đăng nhập hôm nay", description: "Đăng nhập vào hệ thống", icon: "👋", type: "LOGIN", target: 1, rewardXp: 0, rewardCoin: 5, scope: "DAILY", gameId: null, isActive: true, sortOrder: 12, createdAt: now, updatedAt: now },
      { code: "SPIN_WHEEL", name: "Quay vòng may mắn", description: "Được quay vòng may mắn hàng ngày", icon: "🎰", type: "SPIN", target: 3, rewardXp: 0, rewardCoin: 0, scope: "DAILY", gameId: null, isActive: true, sortOrder: 14, createdAt: now, updatedAt: now },
      { code: "PLAY_100_TOTAL", name: "Chơi 100 trận", description: "Hoàn thành 100 trận game", icon: "🏅", type: "GAME_PLAYED", target: 100, rewardXp: 0, rewardCoin: 200, scope: "TOTAL", gameId: null, isActive: true, sortOrder: 13, createdAt: now, updatedAt: now },
    ];
    await tasksColl.insertMany(defaultTasks, { ordered: false });
    seeded.push(`tasks (${defaultTasks.length})`);
  }

  // Migrate existing games: add templateId from slug, rename title→name
  await migrateGames(database);

  // Migrate existing templates: add new fields, remove old
  await migrateTemplates(database);

  const seedMap = {
    categories: seedData.categories,
    players: seedData.players,
    results: seedData.results,
  };

  for (const [col, getter] of Object.entries(seedMap)) {
    const coll = database.collection(col);
    const count = await coll.countDocuments();
    if (count === 0) {
      const docs = getter();
      await coll.insertMany(docs, { ordered: false });
      seeded.push(`${col} (${docs.length})`);
    }
  }

  // Users
  const bcrypt = (await import("bcryptjs")).default;
  const usersColl = database.collection("users");
  await usersColl.deleteMany({ username: { $exists: false } });
  for (const u of seedData.users()) {
    const { password, ...rest } = u;
    const existing = await usersColl.findOne({ id: u.id });
    if (!existing || !existing.passwordHash) {
      await usersColl.updateOne(
        { id: u.id },
        { $set: { ...rest, passwordHash: bcrypt.hashSync(password || "123456", 10), createdAt: existing?.createdAt || new Date().toISOString() } },
        { upsert: true }
      );
      seeded.push(`users (${u.username})`);
    }
  }

  const subjects = seedData.subjects();
  const subjectsColl = database.collection("subjects");
  const subjectsCount = await subjectsColl.countDocuments();
  if (subjectsCount === 0 && subjects.length > 0) {
    const docs = subjects.map(name => ({ name }));
    await subjectsColl.insertMany(docs, { ordered: false });
    seeded.push(`subjects (${docs.length})`);
  }

  // Migrate old subjects format: { list: [...] } → individual { name } docs
  const oldDoc = await subjectsColl.findOne({ list: { $exists: true } });
  if (oldDoc && Array.isArray(oldDoc.list)) {
    const names = oldDoc.list.filter(n => typeof n === "string" && n.trim());
    const newDocs = names.map(name => ({ name }));
    if (newDocs.length > 0) {
      await subjectsColl.insertMany(newDocs, { ordered: false });
    }
    await subjectsColl.deleteOne({ _id: oldDoc._id });
  }

  ready = true;
  console.log("[db] Khởi tạo CSDL hoàn tất.");
  return {
    dbName: config.dbName,
    created,
    seeded,
    indexes: createdIndexes,
  };
}

async function migrateGames(database) {
  const gamesColl = database.collection("games");
  const templatesColl = database.collection("templates");

  // Build slug→_id map from templates
  const allTemplates = await templatesColl.find({}).toArray();
  const slugToId = {};
  for (const t of allTemplates) {
    if (t.slug) slugToId[t.slug] = t._id;
    if (t.id) slugToId[t.id] = t._id;
  }

  // Games with string 'template' field but no templateId → migrate
  const gamesToMigrate = await gamesColl.find({
    $or: [
      { templateId: { $exists: false } },
      { templateId: null },
      { template: { $exists: true } },
    ]
  }).toArray();

  for (const g of gamesToMigrate) {
    const update = {};
    if (!g.templateId && g.template && slugToId[g.template]) {
      update.templateId = slugToId[g.template];
    }
    if (g.title && !g.name) {
      update.name = g.title;
    }
    if (!g.name) update.name = "Game";
    if (!g.description) update.description = "";
    if (!g.type) update.type = "play-to-learn";
    if (Object.keys(update).length > 0) {
      await gamesColl.updateOne({ _id: g._id }, { $set: update });
    }
  }

  // Remove old fields from games
  await gamesColl.updateMany({}, {
    $unset: { id: "", slug: "", title: "", template: "", theme: "", htmlTemplate: "" }
  });
}

async function migrateTemplates(database) {
  const templatesColl = database.collection("templates");

  // Add new fields to templates that don't have them
  const now = new Date().toISOString();
  await templatesColl.updateMany(
    { type: { $exists: false } },
    { $set: { type: "play-to-learn", htmlTemplate: "", thumbnail: "", version: 1, status: "draft", createdAt: now, updatedAt: now } }
  );

  // Remove old fields
  await templatesColl.updateMany({}, {
    $unset: { id: "", slug: "", categoryLabel: "" }
  });
}
