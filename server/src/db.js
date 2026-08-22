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
      required: ["name", "description", "type", "category", "icon", "ring", "htmlTemplate", "status"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        type: { enum: ["play-to-learn", "play-to-win"] },
        category: { bsonType: "string" },
        icon: { bsonType: "string" },
        ring: { bsonType: "string" },
        htmlTemplate: { bsonType: "string" },
        thumbnail: { bsonType: "string" },
        version: { bsonType: "int" },
        status: { enum: ["published", "draft", "inactive"] },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    games: { $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "subject", "topic", "language", "templateId", "type", "status", "questionsCount", "playersCount", "code"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        subject: { bsonType: "string" },
        topic: { bsonType: "string" },
        language: { bsonType: "string" },
        templateId: { bsonType: "objectId" },
        type: { enum: ["play-to-learn", "play-to-win"] },
        status: { enum: ["published", "draft"] },
        questionsCount: { bsonType: "int" },
        playersCount: { bsonType: "int" },
        code: { bsonType: "string" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    } },
    questions: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "gameId", "content", "options", "correctAnswer", "timeLimit", "points"],
      properties: {
        id: { bsonType: "string" },
        gameId: { bsonType: "string" },
        content: { bsonType: "string" },
        options: { bsonType: "array" },
        correctAnswer: { bsonType: "string" },
        timeLimit: { bsonType: "int" },
        points: { bsonType: "int" },
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
        score: { bsonType: "int" },
        correctAnswers: { bsonType: "int" },
        totalQuestions: { bsonType: "int" },
        accuracy: { bsonType: "int" },
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
  };

  for (const [name, validator] of Object.entries(collectionDefs)) {
    try {
      await database.createCollection(name, { validator });
      created.push(name);
    } catch (e) {
      if (e.code !== 48) throw e;
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
      const tplId = slugToId[g.template] || null;
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
  await database.collection("subjects").deleteMany({});
  await database.collection("subjects").insertOne({ list: subjects });
  seeded.push("subjects");

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
    // Set templateId from template slug
    if (!g.templateId && g.template && slugToId[g.template]) {
      update.templateId = slugToId[g.template];
    }
    // Rename title → name
    if (g.title && !g.name) {
      update.name = g.title;
    }
    // Add type if missing
    if (!g.type) {
      update.type = "play-to-learn";
    }
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
