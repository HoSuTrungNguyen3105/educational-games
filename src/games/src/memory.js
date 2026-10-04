// src/games/src/memory.js — Lật Thẻ Anh – Việt (Tiếng Anh)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function speak(t) {
      if (!soundOn || !('speechSynthesis' in window)) return;
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; speechSynthesis.speak(u) } catch (e) { }
    }

    /* ============ Dữ liệu từ vựng & quiz ============ */

    const WORDS = [
      ['apple', 'quả táo'], ['book', 'quyển sách'], ['teacher', 'giáo viên'], ['school', 'trường học'], ['friend', 'bạn bè'],
      ['water', 'nước'], ['happy', 'vui vẻ'], ['family', 'gia đình'], ['house', 'ngôi nhà'], ['cat', 'con mèo'],
      ['dog', 'con chó'], ['sun', 'mặt trời'], ['moon', 'mặt trăng'], ['tree', 'cái cây'], ['flower', 'bông hoa'],
      ['river', 'dòng sông'], ['mountain', 'ngọn núi'], ['computer', 'máy tính'], ['bicycle', 'xe đạp'], ['breakfast', 'bữa sáng'],
      ['rainbow', 'cầu vồng'], ['elephant', 'con voi'], ['library', 'thư viện'], ['umbrella', 'cái ô'], ['window', 'cửa sổ'],
      ['chicken', 'con gà'], ['orange', 'quả cam'], ['yellow', 'màu vàng'], ['garden', 'khu vườn'], ['kitchen', 'nhà bếp'],
      ['pencil', 'bút chì'], ['bridge', 'cây cầu'], ['planet', 'hành tinh'], ['butterfly', 'con bướm'], ['holiday', 'kỳ nghỉ']
    ].map(([en, vi]) => ({ en, vi }));


    function memoryGame(root) {
      const pairs = shuffle(WORDS).slice(0, 8);
      const cards = shuffle(pairs.flatMap((w, i) => [{ p: i, t: w.en, l: 'en' }, { p: i, t: w.vi, l: 'vi' }]));
      let open = [], lock = false, moves = 0, matched = 0, secs = 0;
      root.innerHTML = `<div class="hud"><span>👣 <b id="mv">0</b> lượt</span><span>🧩 <b id="pr">0</b>/8</span><span>⏱ <b id="tm">0</b>s</span></div>
    <div class="mem" id="mem">${cards.map((c, i) => `<button class="mc" data-i="${i}" aria-label="Thẻ ${i + 1}"><div class="in"><div class="f">❓</div><div class="b ${c.l}">${c.t}</div></div></button>`).join('')}</div>
    <p class="hint">Tìm cặp từ tiếng Anh và nghĩa tiếng Việt. Chạm thẻ tiếng Anh để nghe phát âm.</p>`;
      const els = [...root.querySelectorAll('.mc')];
      T.int(() => { secs++; $('#tm').textContent = secs }, 1000);
      root.onclick = e => {
        const el = e.target.closest('.mc'); if (!el || lock) return;
        const i = +el.dataset.i;
        if (el.classList.contains('flip') || el.classList.contains('done')) return;
        el.classList.add('flip'); sfx.tick();
        if (cards[i].l === 'en') speak(cards[i].t);
        open.push(i);
        if (open.length === 2) {
          moves++; $('#mv').textContent = moves; lock = true;
          const [a, b] = open;
          if (cards[a].p === cards[b].p && cards[a].l !== cards[b].l) {
            T.set(() => {
              els[a].classList.add('done'); els[b].classList.add('done'); matched++; $('#pr').textContent = matched; sfx.ok(); open = []; lock = false;
              if (matched === 8) {
                const score = Math.max(20, 300 - moves * 8 - secs);
                if (moves <= 11) S.flags.memGold = true;
                T.clear();
                finish({
                  id: 'memory', score, xp: Math.round(score / 5) + 10,
                  lines: [`${moves} lượt lật`, `${secs} giây`],
                  replay: memoryGame,
                  details: { moves, secs }
                });
              }
            }, 450);
          } else {
            T.set(() => { els[a].classList.remove('flip'); els[b].classList.remove('flip'); open = []; lock = false }, 900);
          }
        }
      };
    }

    /* ============ GAME 3: XẾP CHỮ ============ */
startSingleGame({
  id: 'memory',
  name: 'Lật Thẻ Anh – Việt',
  icon: '🃏',
  storageKey: 'offline_memory',
  mount: memoryGame,
  badges: [
      { id: 'memGold', n: 'Lật thẻ vàng', i: '🟡', ok: () => !!S.flags.memGold },
  ],
});
