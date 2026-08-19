import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../data");

let client = null;
let db = null;

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

/**
 * Tạo CSDL: tạo các collection + index cần thiết rồi seed dữ liệu
 * nếu collection còn trống.
 *
 * @returns {{ dbName: string, created: string[], seeded: string[], indexes: string[] }}
 */
export async function initDatabase() {
  await connect();
  const database = getDb();
  const created = [];
  const seeded = [];

  const collectionDefs = {
    templates: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "name", "description", "category", "categoryLabel", "icon", "ring"],
      properties: {
        id: { bsonType: "string" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        category: { bsonType: "string" },
        categoryLabel: { bsonType: "string" },
        icon: { bsonType: "string" },
        ring: { bsonType: "string" },
      },
    } },
    games: { $jsonSchema: {
      bsonType: "object",
      required: ["id", "title", "description", "subject", "topic", "language", "template", "status", "questionsCount", "playersCount", "code"],
      properties: {
        id: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        subject: { bsonType: "string" },
        topic: { bsonType: "string" },
        language: { bsonType: "string" },
        template: { bsonType: "string" },
        status: { enum: ["published", "draft"] },
        questionsCount: { bsonType: "int" },
        playersCount: { bsonType: "int" },
        code: { bsonType: "string" },
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
      required: ["id", "name", "role"],
      properties: {
        id: { bsonType: "string" },
        name: { bsonType: "string" },
        role: { enum: ["teacher", "student", "admin"] },
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
      if (e.code !== 48) throw e; // 48 = NamespaceExists
    }
  }

  // Indexes — đảm bảo unique cho code, khóa chính logic id
  const indexDefs = [
    ["games", { code: 1 }, { unique: true }],
    ["games", { id: 1 }, { unique: true }],
    ["games", { template: 1 }],
    ["games", { status: 1 }],
    ["games", { updatedAt: -1 }],
    ["questions", { id: 1 }, { unique: true }],
    ["questions", { gameId: 1 }],
    ["questions", { gameId: 1, id: 1 }, { unique: true }],
    ["players", { name: 1 }],
    ["results", { id: 1 }, { unique: true }],
    ["results", { gameId: 1 }],
    ["results", { gameId: 1, score: -1 }],
    ["users", { id: 1 }, { unique: true }],
    ["users", { name: 1 }],
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
  const seedMap = {
    templates: seedData.templates,
    categories: seedData.categories,
    games: seedData.games,
    questions: seedData.questions,
    players: seedData.players,
    results: seedData.results,
    users: seedData.users,
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

  const subjects = seedData.subjects();
  await database.collection("subjects").deleteMany({});
  await database.collection("subjects").insertOne({ list: subjects });
  seeded.push("subjects");

  console.log("[db] Khởi tạo CSDL hoàn tất.");
  return {
    dbName: config.dbName,
    created,
    seeded,
    indexes: createdIndexes,
  };
}
