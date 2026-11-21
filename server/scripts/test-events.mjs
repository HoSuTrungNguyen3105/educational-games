// Test tích hợp: SỰ KIỆN & THỬ THÁCH THEO MÙA (Đợt 3) — /api/events
//   · Admin CRUD: chỉ admin (events.manage); giáo viên/học sinh → 403.
//     Validate: cửa sổ thời gian, loại nhiệm vụ đo được (plays /
//     topic_plays / xp — "stars" bị từ chối), topic_plays phải có
//     topicKey, thưởng hạt phải là plantType có thật.
//   · Phạm vi: scope grades khớp khối lớp suy từ ageCode; ageCode null
//     chỉ thuộc sự kiện scope "all".
//   · Tiến độ: tính từ results THẬT trong cửa sổ — ván ngoài cửa sổ,
//     verified=false và source "assignment" KHÔNG tính (đúng luật bản
//     đồ nhiệt Đợt 1).
//   · Trao thưởng: đạt mốc khi đọc tiến độ → trao ngay (huy hiệu vào
//     user_badges, hạt vào gardens.seeds), đọc lại KHÔNG trao trùng
//     (sổ event_rewards + unique index). plantTree tiêu hạt được tặng
//     thay vì trừ xu.
//   · Bật/tắt: enabled=false → học sinh không thấy sự kiện nữa.
//   · Tổng kết: finalize trao phần chưa nhận + finalizedAt +
//     finalLeaderboard; chạy lại processor không trao trùng; sửa cấu
//     trúc sự kiện đã tổng kết → 400.
// Chạy app Express THẬT trên Mongo in-memory (mẫu test-remediation.mjs):
//   node server/scripts/test-events.mjs
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
let mongod = null;
if (process.env.TEST_MONGODB_URI) {
  process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
  process.env.MONGODB_DB = process.env.TEST_MONGODB_DB || `events_test_${process.pid}`;
} else {
  const dbPath = process.env.TEST_MONGO_DBPATH || path.join(here, `.test-events-mongo-data-${process.pid}`);
  mkdirSync(dbPath, { recursive: true });
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongod = await MongoMemoryServer.create({ instance: { dbPath, storageEngine: "wiredTiger" } });
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = "events_test";
}

const db = await import("../src/db.js");
await db.initDatabase();
const { default: app } = await import("../src/app.js");
const { signToken } = await import("../src/services/authService.js");
const eventService = await import("../src/services/eventService.js");
const gardenService = await import("../src/services/gardenService.js");
const { getCollection } = db;

const server = createServer(app);
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const ADMIN = "user-ev-admin";
const TEACHER = "user-ev-teacher";
const S3 = "user-ev-s3"; // kid-breeze → khối 3
const S4 = "user-ev-s4"; // kid-river → khối 4
const SN = "user-ev-sn"; // ageCode null
const tokAdmin = signToken({ id: ADMIN, username: "evadmin", role: "admin", name: "Admin" });
const tokTeacher = signToken({ id: TEACHER, username: "evteacher", role: "teacher", name: "GV" });
const tokS3 = signToken({ id: S3, username: "evs3", role: "student", name: "HS Ba" });
const tokS4 = signToken({ id: S4, username: "evs4", role: "student", name: "HS Bốn" });
const tokSN = signToken({ id: SN, username: "evsn", role: "student", name: "HS Chưa mã tuổi" });

let failed = 0;
const check = (name, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  → nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`}`);
  if (!ok) failed++;
};
const checkTrue = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  → ${extra}`}`);
  if (!cond) failed++;
};

const req = async (p, token, { method = "GET", body } = {}) => {
  const res = await fetch(`${base}${p}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const parsed = await res.json().catch(() => null);
  return { status: res.status, body: parsed };
};

const H = 3600_000;
const now = Date.now();
const iso = (t) => new Date(t).toISOString();

// ── Seed ────────────────────────────────────────────────────────────────
await getCollection("users").insertMany([
  { id: ADMIN, username: "evadmin", name: "Admin", role: "admin", passwordHash: "x" },
  { id: TEACHER, username: "evteacher", name: "GV", role: "teacher", passwordHash: "x" },
  { id: S3, username: "evs3", name: "HS Ba", role: "student", passwordHash: "x", ageCode: "kid-breeze", coins: 0 },
  { id: S4, username: "evs4", name: "HS Bốn", role: "student", passwordHash: "x", ageCode: "kid-river", coins: 0 },
  { id: SN, username: "evsn", name: "HS Chưa mã tuổi", role: "student", passwordHash: "x", ageCode: null, coins: 0 },
]);
await getCollection("plantTypes").insertMany([
  { id: "pt-rare", name: "Cây Quý", icon: "🌳", stages: 3, growthTime: 300000, harvestCoin: 100, seedPrice: 500, rarity: "rare" },
  { id: "pt-common", name: "Cây Thường", icon: "🌱", stages: 3, growthTime: 300000, harvestCoin: 10, seedPrice: 20, rarity: "common" },
]);
await getCollection("games").insertMany([
  { id: "g-ev-nhan", name: "Nhân Nhanh", topic: "Phép nhân", code: "EVN1", status: "published" },
  { id: "g-ev-chia", name: "Chia Đều", topic: "Phép chia", code: "EVC1", status: "published" },
]);

const result = (id, userId, gameId, at, extra = {}) => ({
  id, gameId, playerId: userId, playerName: userId, userId,
  score: 100, correctAnswers: 5, totalQuestions: 5, accuracy: 100,
  verified: true, xpGained: 0, createdAt: iso(at), ...extra,
});
await getCollection("results").insertMany([
  // S3 trong cửa sổ sự kiện A/B (now-30p): 2 ván hợp lệ game Phép nhân, XP 60/ván
  result("r-ev-1", S3, "g-ev-nhan", now - 30 * 60000, { xpGained: 60 }),
  result("r-ev-2", S3, "g-ev-nhan", now - 20 * 60000, { xpGained: 60 }),
  // S3: các ván KHÔNG được tính — unverified, assignment, ngoài cửa sổ (trước A 2 giờ)
  result("r-ev-3", S3, "g-ev-nhan", now - 25 * 60000, { xpGained: 999, verified: false }),
  result("r-ev-4", S3, "g-ev-nhan", now - 25 * 60000, { xpGained: 999, source: "assignment" }),
  result("r-ev-5", S3, "g-ev-nhan", now - 2 * H, { xpGained: 999 }),
  // S4 trong cửa sổ: 2 ván hợp lệ, XP 10/ván (đủ "plays" nhưng thiếu XP cho sự kiện B)
  result("r-ev-6", S4, "g-ev-chia", now - 30 * 60000, { xpGained: 10 }),
  result("r-ev-7", S4, "g-ev-chia", now - 20 * 60000, { xpGained: 10 }),
  // SN trong cửa sổ: 1 ván XP 150 (đạt mốc XP của sự kiện B)
  result("r-ev-8", SN, "g-ev-chia", now - 15 * 60000, { xpGained: 150 }),
]);

// ── CRUD admin: quyền truy cập ──────────────────────────────────────────
const validBody = {
  name: "Tuần lễ Vui Toán",
  description: "Sự kiện test",
  startsAt: iso(now - H),
  endsAt: iso(now + H),
  scope: { type: "grades", grades: [3] },
  quests: [
    { title: "Chơi 2 ván bất kỳ", type: "plays", target: 2, reward: { kind: "badge", name: "Huy hiệu Siêng Năng", icon: "🏅" } },
    { title: "Chơi 1 ván Phép nhân", type: "topic_plays", target: 1, topicKey: "Phép nhân", reward: { kind: "seed", plantTypeId: "pt-rare" } },
  ],
};
check("GV tạo sự kiện → 403", (await req("/api/events/admin", tokTeacher, { method: "POST", body: validBody })).status, 403);
check("HS tạo sự kiện → 403", (await req("/api/events/admin", tokS3, { method: "POST", body: validBody })).status, 403);
check("HS xem danh sách admin → 403", (await req("/api/events/admin", tokS3)).status, 403);
check("GV xem danh sách admin → 403", (await req("/api/events/admin", tokTeacher)).status, 403);

// ── CRUD admin: validate ────────────────────────────────────────────────
check("Tạo: endsAt <= startsAt → 400", (await req("/api/events/admin", tokAdmin, { method: "POST", body: { ...validBody, endsAt: iso(now - 2 * H) } })).status, 400);
check("Tạo: loại nhiệm vụ 'stars' (không đo được) → 400", (await req("/api/events/admin", tokAdmin, { method: "POST", body: { ...validBody, quests: [{ title: "Kiếm sao", type: "stars", target: 5, reward: { kind: "badge", name: "B", icon: "⭐" } }] } })).status, 400);
check("Tạo: topic_plays thiếu topicKey → 400", (await req("/api/events/admin", tokAdmin, { method: "POST", body: { ...validBody, quests: [{ title: "Chơi theo chủ đề", type: "topic_plays", target: 1, reward: { kind: "badge", name: "B", icon: "⭐" } }] } })).status, 400);
check("Tạo: hạt của plantType không có thật → 400", (await req("/api/events/admin", tokAdmin, { method: "POST", body: { ...validBody, quests: [{ title: "Chơi 1 ván", type: "plays", target: 1, reward: { kind: "seed", plantTypeId: "pt-khong-co" } }] } })).status, 400);
check("Tạo: scope grades rỗng → 400", (await req("/api/events/admin", tokAdmin, { method: "POST", body: { ...validBody, scope: { type: "grades", grades: [] } } })).status, 400);
check("Tạo: không cột mốc nào → 400", (await req("/api/events/admin", tokAdmin, { method: "POST", body: { ...validBody, quests: [] } })).status, 400);

// ── Tạo sự kiện A (khối 3) + B (toàn trường) ────────────────────────────
const createdA = await req("/api/events/admin", tokAdmin, { method: "POST", body: validBody });
check("Admin tạo sự kiện A → 201", createdA.status, 201);
const evA = createdA.body?.data || {};
check("Sự kiện A: scope grades [3]", evA.scope, { type: "grades", grades: [3] });
check("Sự kiện A: 2 cột mốc có id", (evA.quests || []).every((q) => !!q.id), true);
const [qA1, qA2] = evA.quests || [];

const createdB = await req("/api/events/admin", tokAdmin, {
  method: "POST",
  body: {
    name: "Ngày hội XP",
    startsAt: iso(now - H),
    endsAt: iso(now + H),
    scope: { type: "all" },
    quests: [{ title: "Kiếm 100 XP", type: "xp", target: 100, reward: { kind: "badge", name: "Huy hiệu XP", icon: "⚡" } }],
  },
});
check("Admin tạo sự kiện B (toàn trường) → 201", createdB.status, 201);
const evB = createdB.body?.data || {};
const qB1 = (evB.quests || [])[0] || {};

// Danh sách admin + phân đoạn from/to dùng chung
const listAll = await req("/api/events/admin", tokAdmin);
check("Danh sách admin: 2 sự kiện", (listAll.body?.data || []).length, 2);
const listRange = await req("/api/events/admin?from=1&to=1", tokAdmin);
check("Danh sách from/to: data 1 bản ghi", (listRange.body?.data || []).length, 1);
check("Danh sách from/to: pagination.total 2", listRange.body?.pagination?.total, 2);

// Chủ đề thật cho form admin
const topics = await req("/api/events/admin/topics", tokAdmin);
check("Topics: có 'Phép nhân' và 'Phép chia'", topics.body?.data, ["Phép chia", "Phép nhân"]);

// ── Phía học sinh: phạm vi + tiến độ + trao ngay khi đạt ────────────────
const activeS3 = await req("/api/events/active", tokS3);
check("HS khối 3: /active → 200", activeS3.status, 200);
const activeIdsS3 = (activeS3.body?.data || []).map((e) => e.id).sort();
check("HS khối 3 thấy cả A và B", activeIdsS3, [evA.id, evB.id].sort());
const viewA = (activeS3.body?.data || []).find((e) => e.id === evA.id) || {};
const vq1 = (viewA.quests || []).find((q) => q.id === qA1.id) || {};
const vq2 = (viewA.quests || []).find((q) => q.id === qA2.id) || {};
check("A/q1 (plays): progress 2 — chỉ đếm 2 ván hợp lệ trong cửa sổ", vq1.progress, 2);
check("A/q1: completed", vq1.completed, true);
check("A/q1: đã trao huy hiệu ngay khi đọc", vq1.granted, true);
check("A/q2 (topic_plays Phép nhân): progress 2", vq2.progress, 2);
check("A/q2: đã trao hạt ngay khi đọc", vq2.granted, true);
check("A: newlyGranted có cả 2 cột mốc", [...(viewA.newlyGranted || [])].sort(), [qA1.id, qA2.id].sort());
check("A: myStats XP 120 (không tính ván unverified/assignment/ngoài cửa sổ)", viewA.myStats?.xp, 120);

// Phần thưởng đã vào đúng hệ thật
const badgeA = await getCollection("user_badges").findOne({ userId: S3, badgeId: `event_${evA.id}_${qA1.id}` });
checkTrue("Huy hiệu A/q1 đã ghi vào user_badges", !!badgeA, "không thấy bản ghi user_badges");
const gardenS3 = await getCollection("gardens").findOne({ userId: S3 });
check("Hạt A/q2 đã vào gardens.seeds[pt-rare] = 1", gardenS3?.seeds?.["pt-rare"], 1);
check("Sổ event_rewards của S3 ở A: 2 dòng", await getCollection("event_rewards").countDocuments({ eventId: evA.id, userId: S3 }), 2);

// Đọc lại: KHÔNG trao trùng
const activeS3b = await req("/api/events/active", tokS3);
const viewAb = (activeS3b.body?.data || []).find((e) => e.id === evA.id) || {};
check("Đọc lại A: newlyGranted rỗng", viewAb.newlyGranted, []);
check("Đọc lại A: sổ vẫn 2 dòng", await getCollection("event_rewards").countDocuments({ eventId: evA.id, userId: S3 }), 2);
check("Đọc lại A: hạt vẫn 1", (await getCollection("gardens").findOne({ userId: S3 }))?.seeds?.["pt-rare"], 1);
check("Đọc lại A: user_badges của S3 vẫn 1 huy hiệu A", await getCollection("user_badges").countDocuments({ userId: S3, badgeId: `event_${evA.id}_${qA1.id}` }), 1);

// HS khối 4: không thuộc A, thuộc B nhưng chưa đạt mốc XP
const activeS4 = await req("/api/events/active", tokS4);
check("HS khối 4 chỉ thấy B", (activeS4.body?.data || []).map((e) => e.id), [evB.id]);
const viewB4 = (activeS4.body?.data || [])[0] || {};
check("B/S4: progress XP 20", (viewB4.quests || [])[0]?.progress, 20);
check("B/S4: chưa completed", (viewB4.quests || [])[0]?.completed, false);
check("B/S4: chưa trao", (viewB4.quests || [])[0]?.granted, false);

// HS ageCode null: chỉ thấy sự kiện toàn trường, và ĐẠT mốc XP của B
const activeSN = await req("/api/events/active", tokSN);
check("HS ageCode null chỉ thấy B (toàn trường)", (activeSN.body?.data || []).map((e) => e.id), [evB.id]);
check("B/SN: progress XP 150 → completed + granted", (activeSN.body?.data || [])[0]?.quests?.[0]?.granted, true);
checkTrue("Huy hiệu B của SN đã vào user_badges", !!(await getCollection("user_badges").findOne({ userId: SN, badgeId: `event_${evB.id}_${qB1.id}` })));

// Chi tiết sự kiện: ngoài phạm vi → 404; trong phạm vi → có xếp hạng
check("HS khối 4 mở chi tiết A (ngoài phạm vi) → 404", (await req(`/api/events/${evA.id}`, tokS4)).status, 404);
const detailA = await req(`/api/events/${evA.id}`, tokS3);
check("HS khối 3 mở chi tiết A → 200", detailA.status, 200);
check("Chi tiết A: S3 hạng 1 (2 cột mốc đạt)", detailA.body?.data?.leaderboard?.[0]?.userId, S3);
check("Chi tiết A: myRank của S3 = 1", detailA.body?.data?.myRank?.rank, 1);

// ── plantTree tiêu hạt được tặng thay vì trừ xu ─────────────────────────
const coinsBefore = (await getCollection("users").findOne({ id: S3 }))?.coins;
const planted = await gardenService.plantTree(S3, 0, "pt-rare");
check("plantTree bằng hạt tặng: usedGiftedSeed true", planted.usedGiftedSeed, true);
check("plantTree bằng hạt tặng: hạt pt-rare về 0", (await getCollection("gardens").findOne({ userId: S3 }))?.seeds?.["pt-rare"], 0);
check("plantTree bằng hạt tặng: xu KHÔNG đổi", (await getCollection("users").findOne({ id: S3 }))?.coins, coinsBefore);
let plantErr = "";
try { await gardenService.plantTree(S3, 1, "pt-rare"); } catch (e) { plantErr = e.message; }
checkTrue("plantTree lần 2 (hết hạt, 0 xu): bị từ chối 'Không đủ xu'", /Không đủ xu/.test(plantErr), plantErr);

// ── Bật/tắt realtime ────────────────────────────────────────────────────
const off = await req(`/api/events/admin/${evA.id}/enabled`, tokAdmin, { method: "PATCH", body: { enabled: false } });
check("Tắt sự kiện A → 200, enabled false", off.body?.data?.enabled, false);
const activeOff = await req("/api/events/active", tokS3);
check("Đã tắt: HS khối 3 không còn thấy A", (activeOff.body?.data || []).map((e) => e.id), [evB.id]);
await req(`/api/events/admin/${evA.id}/enabled`, tokAdmin, { method: "PATCH", body: { enabled: true } });
const activeOn = await req("/api/events/active", tokS3);
checkTrue("Bật lại: HS khối 3 thấy lại A", (activeOn.body?.data || []).some((e) => e.id === evA.id));

// ── Tổng kết cuối sự kiện ───────────────────────────────────────────────
// Sự kiện C: đã kết thúc (cửa sổ [now-5h, now-4h] — tách hẳn khỏi các
// ván đã seed cho cửa sổ A/B); S4 có 1 ván hợp lệ trong cửa sổ đó nhưng
// CHƯA từng đọc tiến độ → chưa nhận thưởng.
await getCollection("results").insertOne(result("r-ev-9", S4, "g-ev-chia", now - 4.5 * H, { xpGained: 30 }));
const createdC = await req("/api/events/admin", tokAdmin, {
  method: "POST",
  body: {
    name: "Sự kiện đã qua",
    startsAt: iso(now - 5 * H),
    endsAt: iso(now - 4 * H),
    scope: { type: "all" },
    quests: [{ title: "Chơi 1 ván", type: "plays", target: 1, reward: { kind: "badge", name: "Huy hiệu C", icon: "🎖️" } }],
  },
});
check("Tạo sự kiện C (đã kết thúc) → 201", createdC.status, 201);
const evC = createdC.body?.data || {};
const qC1 = (evC.quests || [])[0] || {};
check("Trước tổng kết: S4 chưa có huy hiệu C", await getCollection("user_badges").countDocuments({ userId: S4, badgeId: `event_${evC.id}_${qC1.id}` }), 0);

// Tổng kết sự kiện đang chạy (A) → 400
check("Tổng kết tay sự kiện A chưa kết thúc → 400", (await req(`/api/events/admin/${evA.id}/finalize`, tokAdmin, { method: "POST", body: {} })).status, 400);

// Tổng kết tay C → trao cho S4 (và S3/SN nếu đạt trong cửa sổ C — chỉ S4 có ván)
const finC = await req(`/api/events/admin/${evC.id}/finalize`, tokAdmin, { method: "POST", body: {} });
check("Tổng kết tay C → 200", finC.status, 200);
check("Tổng kết C: grantedCount 1 (chỉ S4 đạt)", finC.body?.data?.grantedCount, 1);
checkTrue("Sau tổng kết: S4 có huy hiệu C", !!(await getCollection("user_badges").findOne({ userId: S4, badgeId: `event_${evC.id}_${qC1.id}` })));
const evCdoc = await getCollection("events").findOne({ id: evC.id });
checkTrue("Sau tổng kết: finalizedAt đã đặt", !!evCdoc?.finalizedAt, JSON.stringify(evCdoc?.finalizedAt));
check("Sau tổng kết: finalLeaderboard có S4 hạng 1", evCdoc?.finalLeaderboard?.[0]?.userId, S4);
check("Tổng kết lại C → 400", (await req(`/api/events/admin/${evC.id}/finalize`, tokAdmin, { method: "POST", body: {} })).status, 400);

// Sửa sự kiện đã tổng kết: đổi cột mốc → 400; chỉ đổi tên → 200
check("Sửa cột mốc của C đã tổng kết → 400", (await req(`/api/events/admin/${evC.id}`, tokAdmin, { method: "PUT", body: { name: "Sự kiện đã qua", startsAt: evC.startsAt, endsAt: evC.endsAt, scope: { type: "all" }, quests: [{ id: qC1.id, title: "Chơi 5 ván", type: "plays", target: 5, reward: { kind: "badge", name: "Huy hiệu C", icon: "🎖️" } }] } })).status, 400);
const renameC = await req(`/api/events/admin/${evC.id}`, tokAdmin, { method: "PUT", body: { name: "Sự kiện đã qua (đổi tên)", startsAt: evC.startsAt, endsAt: evC.endsAt, scope: { type: "all" }, quests: evC.quests, enabled: true } });
check("Đổi tên C đã tổng kết → 200", renameC.status, 200);

// Processor nền: sự kiện D đã kết thúc, chưa tổng kết → processor xử lý 1 lần duy nhất
const createdD = await req("/api/events/admin", tokAdmin, {
  method: "POST",
  body: {
    name: "Sự kiện chờ processor",
    startsAt: iso(now - 5 * H),
    endsAt: iso(now - 4 * H),
    scope: { type: "all" },
    quests: [{ title: "Chơi 1 ván", type: "plays", target: 1, reward: { kind: "badge", name: "Huy hiệu D", icon: "🎖️" } }],
  },
});
const evD = createdD.body?.data || {};
const proc1 = await eventService.processEndedEvents();
check("Processor lần 1: processed 1 (chỉ D; C đã tổng kết)", proc1.processed, 1);
checkTrue("Processor: D có finalizedAt", !!(await getCollection("events").findOne({ id: evD.id }))?.finalizedAt);
const rewardsD = await getCollection("event_rewards").countDocuments({ eventId: evD.id });
const proc2 = await eventService.processEndedEvents();
check("Processor lần 2: processed 0", proc2.processed, 0);
check("Processor lần 2: sổ thưởng D không đổi (không trao trùng)", await getCollection("event_rewards").countDocuments({ eventId: evD.id }), rewardsD);

// Xoá sự kiện D → sổ thưởng của nó cũng bị dọn
const del = await req(`/api/events/admin/${evD.id}`, tokAdmin, { method: "DELETE" });
check("Xoá sự kiện D → 200", del.status, 200);
check("Xoá D: sổ thưởng D = 0", await getCollection("event_rewards").countDocuments({ eventId: evD.id }), 0);

// Hồi quy nhẹ: vườn của S3 vẫn đọc được qua API, có field seeds
const gardenApi = await req("/api/garden", tokS3);
check("Hồi quy: GET /api/garden → 200", gardenApi.status, 200);
checkTrue("Hồi quy: garden trả field seeds", typeof gardenApi.body?.data?.seeds === "object" && gardenApi.body?.data?.seeds !== null, JSON.stringify(gardenApi.body?.data?.seeds));

server.close();
if (mongod) await mongod.stop().catch(() => {});
console.log(failed ? `\n${failed} FAIL` : "\nALL PASS");
process.exit(failed ? 1 : 0);
