import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";
import { EVENTS } from "../socket.js";
import { sanitizeConfig } from "./gameService.js";

const COLLECTION = "game_versions";

const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

// ioRef pattern giống notificationService — server.js inject sau khi initSocket
let ioRef = null;
export function setGameVersionIO(io) {
  ioRef = io;
}

async function nextVersion(gameId) {
  const last = await getCollection(COLLECTION).findOne({ gameId }, { sort: { version: -1 } });
  return (last?.version || 0) + 1;
}

/** Dựng dữ liệu chơi được từ game + questions hiện tại (chưa publish). */
async function buildLiveData(game) {
  const questions = await getCollection("questions")
    .find({ gameId: String(game._id) })
    .sort({ id: 1 })
    .toArray();
  return {
    name: game.name ?? game.title ?? "Game",
    description: game.description || "",
    type: game.type || "play-to-learn",
    gameMode: game.gameMode || "quiz",
    playMode: game.playMode || "solo",
    deliveryMode: game.deliveryMode || "online",
    config: sanitizeConfig(game.config),
    questions,
  };
}

// Question lưu trong snapshot có correctAnswer (chỉ server dùng) —
// endpoint công khai phải strip trước khi trả client, như routes/questions.js
function stripAnswer(q) {
  if (!q) return q;
  const { gameId: _gameId, correctAnswer: _correctAnswer, ...rest } = q;
  return rest;
}

export async function getLatest(gameId) {
  return getCollection(COLLECTION).findOne({ gameId }, { sort: { version: -1 } });
}

/** GET /:id/version — thông tin phiên bản mới nhất. Chưa publish → version 0. */
export async function getInfo(gameId) {
  const latest = await getLatest(gameId);
  if (!latest) return { gameId, templateId: gameId, version: 0, publishedAt: null };
  return {
    gameId,
    templateId: gameId,
    version: latest.version,
    publishedAt: latest.publishedAt,
  };
}

/** GET /:id/data — dữ liệu chơi được (config + questions), ưu tiên bản đã publish. */
export async function getData(gameId) {
  let game = null;
  try {
    game = await getCollection("games").findOne({ _id: new ObjectId(gameId) });
  } catch {
    return null;
  }
  if (!game) return null;

  const latest = await getLatest(gameId);
  if (!latest) {
    const data = await buildLiveData(game);
    return {
      templateId: gameId,
      version: 0,
      publishedAt: null,
      ...data,
      questions: data.questions.map(stripAnswer),
    };
  }
  const d = latest.data || {};
  return {
    templateId: gameId,
    version: latest.version,
    publishedAt: latest.publishedAt,
    name: d.name,
    description: d.description,
    type: d.type,
    gameMode: d.gameMode,
    playMode: d.playMode,
    deliveryMode: d.deliveryMode || "online",
    config: d.config || null,
    questions: (d.questions || []).map(stripAnswer),
  };
}

/** POST /:id/publish — chốt bản hiện tại thành version mới + bắn socket event. */
export async function publish(gameId, user) {
  const game = await getCollection("games").findOne({ _id: new ObjectId(gameId) });
  if (!game) throw new Error("Không tìm thấy trò chơi");

  const version = await nextVersion(gameId);
  const data = await buildLiveData(game);
  const doc = {
    id: uid("gv"),
    gameId,
    version,
    questionsCount: data.questions.length,
    data,
    publishedAt: new Date().toISOString(),
    publishedBy: user ? { id: user.sub || "", name: user.name || "" } : null,
  };
  await getCollection(COLLECTION).insertOne(doc);

  // Payload khớp với src/services/gameVersionService.js handleWebSocketEvent
  ioRef?.emit(EVENTS.GAME_VERSION_UPDATED, {
    event: EVENTS.GAME_VERSION_UPDATED,
    templateId: gameId,
    gameId,
    version,
    publishedAt: doc.publishedAt,
  });

  return { gameId, templateId: gameId, version, questionsCount: doc.questionsCount, publishedAt: doc.publishedAt };
}

/** GET /:id/versions — danh sách phiên bản (bỏ questions/config cho nhẹ). */
export async function listVersions(gameId) {
  return getCollection(COLLECTION)
    .find({ gameId }, { projection: { "data.questions": 0, "data.config": 0 } })
    .sort({ version: -1 })
    .toArray();
}

export async function getVersion(gameId, version) {
  const num = Number(version);
  if (!Number.isInteger(num) || num < 1) return null;
  return getCollection(COLLECTION).findOne({ gameId, version: num });
}

/** POST /:id/versions/:version/restore — đưa snapshot cũ về live rồi publish thành version mới. */
export async function restore(gameId, version, user) {
  const snap = await getVersion(gameId, version);
  if (!snap) throw new Error("Không tìm thấy phiên bản");

  const d = snap.data || {};
  await getCollection("games").updateOne(
    { _id: new ObjectId(gameId) },
    {
      $set: {
        name: d.name || "Game",
        description: d.description || "",
        type: d.type || "play-to-learn",
        gameMode: d.gameMode || "quiz",
        playMode: d.playMode || "solo",
        deliveryMode: d.deliveryMode || "online",
        config: sanitizeConfig(d.config),
        updatedAt: new Date().toISOString(),
      },
    }
  );

  if (Array.isArray(d.questions)) {
    const coll = getCollection("questions");
    await coll.deleteMany({ gameId });
    if (d.questions.length > 0) {
      await coll.insertMany(d.questions.map(({ _id, ...rest }) => ({ ...rest, gameId })));
    }
    await getCollection("games").updateOne(
      { _id: new ObjectId(gameId) },
      { $set: { questionsCount: d.questions.length } }
    );
  }

  return publish(gameId, user);
}
