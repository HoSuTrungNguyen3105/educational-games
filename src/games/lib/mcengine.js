// lib/mcengine.js — engine chung cho các game dạng "trả lời câu hỏi theo màn".
//
// 6 game (đảo chữ, đuổi màu, chuỗi số, so sánh, đố vui, đếm nhanh) dùng chung
// engine này. Mỗi file game chỉ cần đăng ký đúng 1 maker:
//
//   MC_MAKERS.<id> = function (level) { return { html, opts, ans, exp, style }; };
//   startMcGame('<id>', { name, icon, badges });
//
// Engine đảm nhiệm: vòng lặp màn, điểm, mạng, thanh thời gian và —
// QUAN TRỌNG — ghi/nhận tiến độ vào localStorage sau TỪNG câu để đóng tab
// rồi mở lại vẫn chơi tiếp đúng chỗ (game offline, không có API để hỏi).

const MC_LEVEL_STEP = 3;    // số câu đúng để lên màn
const MC_RUN_SECS = 25;     // giây cho mỗi câu
const MC_START_LIVES = 3;
const MC_PROGRESS_TTL = 30 * 24 * 60 * 60 * 1000;

/** Registry maker, mỗi file game tự đăng ký 1 hàm. */
const MC_MAKERS = {};

/** Game đang chại + metadata, dùng để dựng khoá tiến độ. */
let MC_META = { id: "mc", name: "Game", icon: "🎮" };
let mcRun = null;

function mcProgressKey() { return `offline_${MC_META.id}_progress`; }

// ── Lớp tiến độ ─────────────────────────────────────────────────────────────
const MC_PROGRESS = {
  data: null,

  read() {
    try {
      const raw = localStorage.getItem(mcProgressKey());
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (!d || typeof d !== "object" || !d.game) return null;
      if (d.updatedAt && Date.now() - d.updatedAt > MC_PROGRESS_TTL) { this.clear(); return null; }
      return d;
    } catch { return null; }
  },

  refresh() { this.data = this.read(); return this.data; },

  write(d) {
    d.updatedAt = Date.now();
    this.data = d;
    try { localStorage.setItem(mcProgressKey(), JSON.stringify(d)); } catch (e) { /* private mode */ }
    return d;
  },

  save(patch) { return this.write({ ...(this.data || {}), ...patch }); },

  clear() {
    this.data = null;
    try { localStorage.removeItem(mcProgressKey()); } catch (e) { /* ignore */ }
  },

  ago() {
    if (!this.data?.updatedAt) return "";
    const m = Math.floor((Date.now() - this.data.updatedAt) / 60000);
    if (m < 1) return "vừa xong";
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
/** Chọn 1 phần tử ngẫu nhiên. */
function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

/** Lấy n phần tử ngẫu nhiên không trùng nhau. */
function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

/** Sinh n đáp án sai khác đáp án đúng. */
function distractors(pool, right, n = 3) {
  return sample([...new Set(pool.filter((x) => x !== right))], n);
}

/** Hiện số mạng: tối đa 5 tim, vượt quá thì ghi thêm số. */
function mcHearts(n) {
  const v = Math.max(0, Math.floor(n) || 0);
  return "❤️".repeat(Math.min(5, v)) + (v > 5 ? ` <b>+${v - 5}</b>` : "");
}

/** Ghi tiến độ ván hiện tại xuống localStorage. */
function mcPersist() {
  if (!mcRun) return;
  MC_PROGRESS.save({
    game: mcRun.id, name: MC_META.name, icon: MC_META.icon,
    level: mcRun.level, score: mcRun.score, correct: mcRun.correct,
    answered: mcRun.answered, lives: mcRun.lives,
  });
}

// ── Vòng lặp ván ────────────────────────────────────────────────────────────
function mcNextQuestion() {
  if (!mcRun) return;

  while (mcRun.correct >= MC_LEVEL_STEP) {
    mcRun.correct -= MC_LEVEL_STEP;
    mcRun.level += 1;
    mcRun.score += 25;
    sfx.win();
    toast(`🎉 Lên màn ${mcRun.level}!`);
  }
  if (mcRun.lives <= 0) { mcEndRun(); return; }

  mcRun.locked = false;
  mcRun.time = MC_RUN_SECS;
  mcRun.cur = MC_MAKERS[mcRun.id](mcRun.level);
  mcPersist();
  mcRender();
  mcStartTimer();
}

function mcStartTimer() {
  T.int(() => {
    if (!mcRun || mcRun.locked) return;
    mcRun.time -= 0.1;
    const bar = $("#tb");
    if (bar) bar.style.width = Math.max(0, (mcRun.time / MC_RUN_SECS) * 100) + "%";
    if (mcRun.time <= 0) mcAnswer(-1);       // hết giờ = trả lời sai
  }, 100);
}

function mcRender() {
  const c = mcRun.cur;
  const resumed = mcRun.justResumed;
  mcRun.justResumed = false;

  $("#stage").innerHTML = `
    <div class="hud">
      <span>Màn <b>${mcRun.level}</b></span>
      <span>⭐ <b>${mcRun.score}</b></span>
      <span>💗 ${mcHearts(mcRun.lives)}</span>
      <span>🔥 <b>${mcRun.correct}/${MC_LEVEL_STEP}</b></span>
    </div>
    <div class="tbar"><i id="tb" style="width:100%"></i></div>
    ${resumed ? `<div class="explain" style="border-left:3px solid var(--amber)">
        ▶ Đã khôi phục tiến độ từ localStorage — màn ${mcRun.level}, ${mcRun.score} ⭐</div>` : ""}
    <div class="qbox">${c.html}</div>
    <div class="opts" id="opts">
      ${c.opts.map((o, k) => `<button class="opt" data-k="${k}" ${c.style ? `style="${c.style[k]}"` : ""}>${o}</button>`).join("")}
    </div>
    <div id="ex"></div>
    <div class="row" id="nx"></div>`;

  $("#opts").onclick = (e) => {
    const b = e.target.closest(".opt");
    if (b) mcAnswer(+b.dataset.k);
  };
}

/** Trả lời. k = -1 nghĩa là hết giờ. */
function mcAnswer(k) {
  if (!mcRun || mcRun.locked) return;
  mcRun.locked = true;

  const c = mcRun.cur;
  const btns = [...document.querySelectorAll("#opts .opt")];
  const right = k >= 0 && String(c.opts[k]) === String(c.ans);
  const ci = c.opts.findIndex((o) => String(o) === String(c.ans));

  if (ci >= 0 && btns[ci]) btns[ci].classList.add("ok");
  if (right) {
    mcRun.correct++; mcRun.streak++;
    mcRun.score += 10 + Math.ceil(mcRun.time) + (mcRun.streak >= 3 ? 5 : 0);
    S.flags.mcRight = (S.flags.mcRight || 0) + 1;
    sfx.ok();
  } else {
    mcRun.streak = 0;
    mcRun.lives -= 1;
    S.flags.mcWrong = (S.flags.mcWrong || 0) + 1;
    sfx.bad();
    if (k >= 0 && btns[k]) btns[k].classList.add("bad");
  }
  mcRun.answered += 1;

  const ex = $("#ex"), nx = $("#nx");
  if (ex) ex.innerHTML = `<div class="explain">${right ? "✅ Chính xác!" : (k < 0 ? "⏰ Hết giờ!" : "❌ Chưa đúng.")} ${c.exp}</div>`;
  if (nx) {
    const over = mcRun.lives <= 0;
    nx.innerHTML = over
      ? `<button class="btn" data-next="1">Xem kết quả</button>`
      : `<button class="btn" data-next="1">${mcRun.correct >= MC_LEVEL_STEP ? "Lên màn! →" : "Câu tiếp theo →"}</button>`;
    nx.onclick = () => { if (mcRun) mcNextQuestion(); };
  }

  mcPersist();          // ← lưu sau MỖI câu
}

function mcEndRun() {
  if (!mcRun) return;
  const snap = mcRun;
  mcRun = null;
  MC_PROGRESS.clear();   // hết ván → không cần giữ tiến độ dang dở
  sfx.win();
  finish({
    id: snap.id,
    score: snap.score,
    xp: snap.answered * 5,
    lines: [`Màn cao nhất: ${snap.level}`, `Câu đúng: ${snap.correct}`, `Đã trả lời: ${snap.answered} câu`],
    replay: false,
    details: { level: snap.level, answered: snap.answered },
  });
}

/**
 * Khởi động game dạng MC.
 * @param {string} id     khoá trong MC_MAKERS
 * @param {object} meta   { name, icon, badges }
 */
function startMcGame(id, meta) {
  if (typeof MC_MAKERS[id] !== "function") {
    console.error(`[mcengine] chưa đăng ký maker cho "${id}"`);
    return;
  }
  MC_META = { id, name: meta.name, icon: meta.icon || "🎮" };

  // Đọc tiến độ TỪ ĐĨA — không tin biến trong bộ nhớ, để vào thẳng URL game
  // (F5, bookmark) vẫn khôi phục được.
  const saved = MC_PROGRESS.refresh();
  const keep = saved && saved.game === id;

  mcRun = {
    id,
    level: keep ? Math.max(1, saved.level || 1) : 1,
    score: keep ? (saved.score || 0) : 0,
    correct: keep ? (saved.correct || 0) : 0,
    answered: keep ? (saved.answered || 0) : 0,
    lives: keep && Number.isFinite(saved.lives) ? Math.max(1, saved.lives) : MC_START_LIVES,
    streak: 0, locked: false, cur: null, time: MC_RUN_SECS,
    justResumed: !!keep,
  };

  startSingleGame({
    id, name: meta.name, icon: meta.icon,
    storageKey: `offline_${id}`,
    mount: () => { mcPersist(); mcNextQuestion(); },
    badges: meta.badges || [],
  });
}

// Lưu nốt khi đóng tab / đổi trang
window.addEventListener("beforeunload", () => { if (mcRun) mcPersist(); });
window.addEventListener("pagehide", () => { if (mcRun) mcPersist(); });

/** Kiểm tra tiến độ trong console: MC_PROGRESS.refresh() */
if (typeof window !== "undefined") window.MC_PROGRESS = MC_PROGRESS;
