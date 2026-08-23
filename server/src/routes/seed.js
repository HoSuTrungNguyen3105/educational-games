import { Router } from "express";
import { getCollection, seedData } from "../db.js";
import { ObjectId } from "mongodb";
import { sendSuccess, sendError } from "../utils/response.js";
import { authenticate, requireRoles } from "../middleware/auth.js";

const router = Router();

router.post("/seed", authenticate, requireRoles("admin", "teacher"), async (req, res) => {
  try {
    const results = {};

    // 1. Templates — skip if name already exists
    const templatesColl = getCollection("templates");
    const rawTemplates = seedData.templates();
    let templatesAdded = 0;
    for (const t of rawTemplates) {
      const existing = await templatesColl.findOne({ name: t.name });
      if (!existing) {
        await templatesColl.insertOne(t);
        templatesAdded++;
      }
    }
    results.templates = { total: rawTemplates.length, added: templatesAdded };

    // 2. Categories — skip if id already exists
    const categoriesColl = getCollection("categories");
    const rawCategories = seedData.categories();
    let categoriesAdded = 0;
    for (const c of rawCategories) {
      const existing = await categoriesColl.findOne({ id: c.id });
      if (!existing) {
        await categoriesColl.insertOne(c);
        categoriesAdded++;
      }
    }
    results.categories = { total: rawCategories.length, added: categoriesAdded };

    // 3. Subjects — skip if name already exists (individual docs)
    const subjectsColl = getCollection("subjects");
    const rawSubjects = seedData.subjects();
    let subjectsAdded = 0;
    for (const name of rawSubjects) {
      const existing = await subjectsColl.findOne({ name });
      if (!existing) {
        await subjectsColl.insertOne({ name });
        subjectsAdded++;
      }
    }
    // Also migrate old { list: [...] } format
    const oldDoc = await subjectsColl.findOne({ list: { $exists: true } });
    if (oldDoc && Array.isArray(oldDoc.list)) {
      const names = oldDoc.list.filter(n => typeof n === "string" && n.trim());
      for (const name of names) {
        const existing = await subjectsColl.findOne({ name });
        if (!existing) await subjectsColl.insertOne({ name });
      }
      await subjectsColl.deleteOne({ _id: oldDoc._id });
    }
    results.subjects = { total: rawSubjects.length, added: subjectsAdded };

    // 4. Games — skip if code already exists
    const gamesColl = getCollection("games");
    const rawGames = seedData.games();
    const allTemplates = await templatesColl.find({}).toArray();
    const slugToId = {};
    for (const t of allTemplates) {
      if (t.slug) slugToId[t.slug] = t._id;
      if (t.id) slugToId[t.id] = t._id;
    }
    const now = new Date().toISOString();
    let gamesAdded = 0;
    for (const g of rawGames) {
      const existing = await gamesColl.findOne({ code: g.code });
      if (existing) continue;
      let tplId = null;
      if (g.templateId) {
        try { tplId = new ObjectId(g.templateId); } catch { tplId = null; }
      }
      if (!tplId && g.template) tplId = slugToId[g.template] || null;
      await gamesColl.insertOne({
        name: g.title || g.name || "Game",
        description: g.description || "",
        subject: g.subject || "",
        topic: g.topic || "",
        language: g.language || "vi",
        templateId: tplId,
        type: g.type || "play-to-learn",
        status: g.status || "draft",
        playMode: g.playMode || "solo",
        questionsCount: g.questionsCount || 0,
        playersCount: g.playersCount || 0,
        code: g.code || "",
        createdAt: g.createdAt || now,
        updatedAt: g.updatedAt || now,
      });
      gamesAdded++;
    }
    results.games = { total: rawGames.length, added: gamesAdded };

    // 5. Questions — skip if id already exists
    const questionsColl = getCollection("questions");
    const rawQuestions = seedData.questions();
    const allGames = await gamesColl.find({}, { code: 1 }).toArray();
    const codeToId = {};
    for (const g of allGames) {
      if (g.code) codeToId[g.code] = g._id;
    }
    let questionsAdded = 0;
    for (const q of rawQuestions) {
      const existing = await questionsColl.findOne({ id: q.id });
      if (existing) continue;
      const gameId = q.gameCode ? codeToId[q.gameCode] : null;
      if (!gameId) continue;
      const { gameCode, _id, ...rest } = q;
      await questionsColl.insertOne({ ...rest, gameId: gameId.toString() });
      questionsAdded++;
    }
    results.questions = { total: rawQuestions.length, added: questionsAdded };

    // 6. Users — upsert by id
    const bcrypt = (await import("bcryptjs")).default;
    const usersColl = getCollection("users");
    const rawUsers = seedData.users();
    let usersAdded = 0;
    for (const u of rawUsers) {
      const existing = await usersColl.findOne({ id: u.id });
      if (!existing || !existing.passwordHash) {
        const { password, ...rest } = u;
        await usersColl.updateOne(
          { id: u.id },
          { $set: { ...rest, passwordHash: bcrypt.hashSync(password || "123456", 10), createdAt: existing?.createdAt || now } },
          { upsert: true }
        );
        usersAdded++;
      }
    }
    results.users = { total: rawUsers.length, added: usersAdded };

    // 7. Players — skip if name already exists
    const playersColl = getCollection("players");
    const rawPlayers = seedData.players();
    let playersAdded = 0;
    for (const p of rawPlayers) {
      const existing = await playersColl.findOne({ name: p.name });
      if (!existing) {
        await playersColl.insertOne(p);
        playersAdded++;
      }
    }
    results.players = { total: rawPlayers.length, added: playersAdded };

    // 8. Results — skip if id already exists
    const resultsColl = getCollection("results");
    const rawResults = seedData.results();
    let resultsAdded = 0;
    for (const r of rawResults) {
      const existing = await resultsColl.findOne({ id: r.id });
      if (!existing) {
        await resultsColl.insertOne(r);
        resultsAdded++;
      }
    }
    results.results = { total: rawResults.length, added: resultsAdded };

    sendSuccess(res, { message: "Seed dữ liệu thành công", data: results });
  } catch (err) {
    console.error("[seed]", err);
    sendError(res, "Lỗi khi seed dữ liệu: " + err.message, 500);
  }
});

export default router;
