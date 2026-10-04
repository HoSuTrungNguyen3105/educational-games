// src/games/src/scramble.js — Xếp Chữ (Tiếng Anh)
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


    function scrambleGame(root) {
      const words = shuffle(WORDS).slice(0, 8);
      let i = 0, score = 0, solved = 0, w, tiles, ans, hintsWord = 0, busy = false;
      function load() {
        w = words[i]; const L = [...w.en.toUpperCase()];
        let t; do { t = shuffle(L) } while (t.join('') === L.join(''));
        tiles = t.map(ch => ({ ch, used: false })); ans = []; hintsWord = 0; busy = false; render();
      }
      function render() {
        root.innerHTML = `<div class="hud"><span>Từ <b>${i + 1}/${words.length}</b></span><span>⭐ <b>${score}</b></span></div>
      <div class="qbox txt"><div>Nghĩa tiếng Việt<small></small><span style="font-family:var(--head);font-size:1.5em;font-weight:800">${w.vi}</span><small>${w.en.length} chữ cái. Sắp xếp thành từ tiếng Anh.</small></div></div>
      <div class="slots" id="slots">${[...w.en].map((_, k) => { const t = ans[k] !== undefined ? tiles[ans[k]].ch : ''; return `<button class="slot ${t ? 'fill' : ''}" data-s="${k}">${t}</button>` }).join('')}</div>
      <div class="tiles">${tiles.map((t, k) => `<button class="tl" data-t="${k}" ${t.used ? 'disabled' : ''}>${t.ch}</button>`).join('')}</div>
      <div class="row"><button class="btn alt" data-a="hint">💡 Gợi ý (−4 điểm)</button><button class="btn alt" data-a="skip">Bỏ qua</button></div>`;
      }
      function add(k) {
        if (busy || tiles[k].used || ans.length >= w.en.length) return;
        tiles[k].used = true; ans.push(k); sfx.tick(); render();
        if (ans.length === w.en.length) check();
      }
      function check() {
        const guess = ans.map(k => tiles[k].ch).join('').toLowerCase();
        busy = true;
        if (guess === w.en) {
          const pts = Math.max(5, 15 - hintsWord * 4); score += pts; solved++; sfx.ok(); speak(w.en);
          $('#slots').classList.add('win');
          T.set(() => { i++; i < words.length ? load() : end() }, 1100);
        } else {
          sfx.bad(); $('#slots').classList.add('err');
          T.set(() => { tiles.forEach(t => t.used = false); ans = []; busy = false; render() }, 450);
        }
      }
      function hint() {
        if (busy) return;
        const target = [...w.en.toUpperCase()];
        let ok = ans.every((k, n) => tiles[k].ch === target[n]);
        if (!ok) { tiles.forEach(t => t.used = false); ans = [] }
        const need = target[ans.length];
        const k = tiles.findIndex(t => !t.used && t.ch === need);
        if (k < 0) return;
        hintsWord++; score = Math.max(0, score - 4); add(k);
      }
      function end() {
        finish({
          id: 'scramble', score, xp: Math.round(score / 3) + solved,
          lines: [`Giải được ${solved}/${words.length} từ`],
          replay: scrambleGame,
          details: { solved }
        });
      }
      root.onclick = e => {
        const t = e.target.closest('[data-t]'), s = e.target.closest('[data-s]'), a = e.target.closest('[data-a]');
        if (t) add(+t.dataset.t);
        else if (s && !busy) { const k = +s.dataset.s; if (ans[k] !== undefined) { const idx = ans.splice(k, 1)[0]; tiles[idx].used = false; render() } }
        else if (a) {
          if (a.dataset.a === 'hint') hint();
          else if (!busy) { i++; i < words.length ? load() : end() }
        }
      };
      onKey = e => {
        if (busy) return;
        if (e.key === 'Backspace' && ans.length) { const idx = ans.pop(); tiles[idx].used = false; render(); return }
        if (/^[a-zA-Z]$/.test(e.key)) { const k = tiles.findIndex(t => !t.used && t.ch === e.key.toUpperCase()); if (k >= 0) add(k) }
      };
      load();
    }

    /* ============ GAME 4: ĐỐ VUI KHOA HỌC ============ */
startSingleGame({
  id: 'scramble',
  name: 'Xếp Chữ',
  icon: '🔤',
  storageKey: 'offline_scramble',
  mount: scrambleGame,
  badges: [
      { id: 'word10', n: 'Xếp 10 từ', i: '🔤', ok: () => !!S.flags.w10 },
  ],
});
