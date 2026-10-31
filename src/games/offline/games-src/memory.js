// src/games/offline/games-src/memory.js — Ghép Cặp Hình
//
// Bản cũ luôn 8 cặp và không có gì thay đổi giữa các lần chơi. Bản này:
//   · chọn nhịp độ quyết định số cặp (6 / 8 / 10) và số lượt gợi ý;
//   · có nút gợi ý (mất điểm) để trẻ không bị kẹt;
//   · tự lưu ván dở và mở lại đúng chỗ.

const MEMORY_ICONS = [
  '🐱', '🐶', '🐸', '🐼', '🦊', '🐵', '🐰', '🐻', '🍓', '🍋', '🍇', '🍉',
  '🚀', '🎈', '🎸', '🎧', '⚽', '🎲', '🌙', '⭐', '🌸', '🍀', '🐳', '🦋',
];

const MEMORY_PAIRS = [6, 8, 10];

function memoryGame(root) {
  const saved = loadOfflineRun('memory');
  if (memoryValid(saved)) {
    startMemory(root, GQ_MODES[saved.mode], saved.mode, saved);
    return;
  }
  gqIntro(root, {
    id: 'memory',
    icon: '🃏',
    name: 'Ghép Cặp Hình',
    desc: 'Lật hai thẻ mỗi lượt, tìm các cặp hình giống nhau. Ít lượt và ít thời gian hơn sẽ được điểm cao hơn.',
    steps: ['Chạm một thẻ để lật, chạm thẻ thứ hai để so cặp.', 'Đúng thì hai thẻ biến mất; sai thì úp lại.', 'Nút 💡 Gợi ý mở một cặp nhưng bị trừ điểm.'],
  }, (mode, i) => startMemory(root, mode, i));
}

function memoryValid(s) {
  return !!s && s.v === 2 && Number.isInteger(s.mode) && s.mode >= 0 && s.mode < 3 &&
    Array.isArray(s.pairs) && s.pairs.length === MEMORY_PAIRS[s.mode] &&
    Array.isArray(s.cards) && s.cards.length === s.pairs.length * 2 &&
    s.cards.every((c) => c && Number.isInteger(c.p) && typeof c.t === 'string') &&
    Array.isArray(s.open) && s.open.length <= 1 &&
    s.open.every((i) => Number.isInteger(i) && i >= 0 && i < s.cards.length) &&
    Array.isArray(s.matched) && Number.isFinite(s.moves) && Number.isFinite(s.secs);
}

function startMemory(root, mode, modeIndex, saved) {
  const id = 'memory';
  const pairCount = MEMORY_PAIRS[modeIndex];
  const pairs = saved ? saved.pairs : shuffle(MEMORY_ICONS).slice(0, pairCount);
  const cards = saved ? saved.cards : shuffle(pairs.flatMap((t, p) => [{ p, t }, { p, t }]));
  let open = saved ? saved.open.slice() : [];
  let moves = saved ? saved.moves : 0;
  let secs = saved ? saved.secs : 0;
  let hints = saved ? saved.hints || 0 : (modeIndex === 0 ? 2 : 1);
  let matchedPairs = new Set(saved ? saved.matched : []);
  let lock = false, ended = false;

  const save = () => saveOfflineRun(id, {
    v: 2, mode: modeIndex, pairs, cards, open, matched: [...matchedPairs], moves, secs, hints,
  });

  function paint() {
    root.innerHTML = `<div class="hud">
        <span>👣 <b id="mv">${moves}</b> lượt</span>
        <span>🧩 <b id="pr">${matchedPairs.size}</b>/${pairCount}</span>
        <span>⏱ <b id="tm">${secs}</b>s</span>
      </div>
      <div class="mem" id="mem" style="grid-template-columns:repeat(4,1fr)">${cards.map((c, i) => `
        <button class="mc" data-i="${i}" aria-label="Thẻ ${i + 1}">
          <div class="in"><div class="f">❓</div><div class="b">${c.t}</div></div>
        </button>`).join('')}</div>
      <div class="row">
        <button class="btn alt" data-hint="1" ${hints <= 0 ? 'disabled' : ''}>💡 Gợi ý · còn ${hints}</button>
      </div>
      <p class="hint">Lật hai thẻ để tìm các cặp hình giống nhau.</p>`;
    const els = [...root.querySelectorAll('.mc')];
    els.forEach((el, i) => {
      if (matchedPairs.has(cards[i].p)) el.classList.add('done');
      else if (open.includes(i)) el.classList.add('flip');
    });
  }

  function finishGame() {
    if (ended) return;
    ended = true;
    T.clear();
    clearOfflineRun(id);
    const base = Math.max(60, 900 - moves * 20 - secs * 2 - (2 - hints) * 10);
    finish({
      id,
      score: gqScore(mode, base),
      xp: Math.round(base / 6) + 8,
      lines: [`${moves} lượt lật`, `${secs} giây`, `Gợi ý dùng: ${2 - hints}`],
      replay: memoryGame,
      details: { moves, secs, pairs: pairCount },
    });
  }

  function showHint() {
    if (lock || ended || hints <= 0) return;
    const left = pairs.map((_, p) => p).filter((p) => !matchedPairs.has(p));
    if (!left.length) return;
    const p = left[rnd(0, left.length - 1)];
    const idx = cards.map((c, i) => (c.p === p ? i : -1)).filter((i) => i >= 0);
    const els = [...root.querySelectorAll('.mc')];
    hints--;
    sfx.tick();
    idx.forEach((i) => els[i].classList.add('lit'));
    lock = true;
    T.set(() => {
      idx.forEach((i) => els[i].classList.remove('lit'));
      lock = false;
      const btn = root.querySelector('[data-hint]');
      if (btn) { btn.textContent = `💡 Gợi ý · còn ${hints}`; btn.disabled = hints <= 0; }
      save();
    }, 850);
  }

  root.onclick = (e) => {
    if (e.target.closest('[data-hint]')) { showHint(); return; }
    const el = e.target.closest('.mc');
    if (!el || lock || ended) return;
    const i = Number(el.dataset.i);
    if (el.classList.contains('flip') || el.classList.contains('done')) return;
    el.classList.add('flip');
    sfx.tick();
    open.push(i);
    if (open.length === 1) { save(); return; }

    moves++;
    lock = true;
    const [a, b] = open;
    const els = [...root.querySelectorAll('.mc')];
    const mv = root.querySelector('#mv');
    if (mv) mv.textContent = moves;

    if (cards[a].p === cards[b].p) {
      T.set(() => {
        els[a].classList.add('done');
        els[b].classList.add('done');
        matchedPairs.add(cards[a].p);
        const pr = root.querySelector('#pr');
        if (pr) pr.textContent = matchedPairs.size;
        sfx.ok();
        open = [];
        lock = false;
        save();
        if (matchedPairs.size === pairCount) { T.set(finishGame, 350); }
      }, 420);
    } else {
      T.set(() => {
        els[a].classList.remove('flip');
        els[b].classList.remove('flip');
        open = [];
        lock = false;
        save();
      }, 850);
    }
  };

  paint();
  save();
  T.int(() => {
    if (ended) return;
    secs++;
    const tm = root.querySelector('#tm');
    if (tm) tm.textContent = secs;
    if (secs % 2 === 0) save();
  }, 1000);
}

startSingleGame({
  id: 'memory',
  name: 'Ghép Cặp Hình',
  icon: '🃏',
  storageKey: 'offline_memory',
  mount: memoryGame,
  badges: [
    { id: 'memGold', n: 'Lật thẻ vàng', i: '🟡', ok: () => !!S.flags.memGold },
  ],
});
