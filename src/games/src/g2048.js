// src/games/src/g2048.js — 2048 Lũy Thừa (Logic)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function game2048(root) {
      let b = Array(16).fill(0), score = 0, over = false, newIdx = -1;

      const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
      const sup = k => String(k).split('').map(d => SUP[+d]).join('');
      const PAL = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#b5d8ff', '#8fb8ff', '#c3a6ff', '#ff9de2', '#ffd166', '#ffc233'];

      function add() {
        const empty = [];
        for (let i = 0; i < 16; i++) if (!b[i]) empty.push(i);
        if (!empty.length) return;
        const p = empty[rnd(0, empty.length - 1)];
        b[p] = Math.random() < .9 ? 2 : 4;
        newIdx = p;
      }

      function slide(line) {
        const a = [];
        for (const v of line) if (v) a.push(v);
        let gain = 0;
        for (let i = 0; i < a.length - 1; i++) {
          if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1); }
        }
        while (a.length < 4) a.push(0);
        return { a, gain };
      }

      function canMove() {
        if (b.includes(0)) return true;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const v = b[r * 4 + c];
            if ((c < 3 && b[r * 4 + c + 1] === v) || (r < 3 && b[(r + 1) * 4 + c] === v)) return true;
          }
        }
        return false;
      }

      function move(dir) {
        if (over) return;
        let moved = false, gain = 0;
        const nb = b.slice();
        for (let k = 0; k < 4; k++) {
          const idx = [0, 1, 2, 3].map(j => dir < 2 ? k * 4 + j : j * 4 + k);
          if (dir % 2 === 1) idx.reverse();
          const { a, gain: g } = slide(idx.map(i => b[i]));
          idx.forEach((i, j) => { if (nb[i] !== a[j]) moved = true; nb[i] = a[j]; });
          gain += g;
        }
        if (!moved) return;
        b = nb; score += gain; add(); sfx.tick(); render();
        if (Math.max(...b) >= 256) S.flags.t256 = true;
        if (!canMove()) { over = true; T.set(end, 900); }
      }

      function end() {
        const mx = Math.max(...b);
        finish({
          id: 'g2048', score,
          xp: Math.min(80, Math.round(score / 25)) + Math.round(Math.log2(mx)) * 2,
          lines: [`Ô lớn nhất ${mx} = 2${sup(Math.round(Math.log2(mx)))}`],
          replay: game2048, details: { maxTile: mx }
        });
      }

      function render() {
        $sc.textContent = score;
        let html = '';
        for (let i = 0; i < 16; i++) {
          const v = b[i];
          if (!v) { html += '<div class="t48"></div>'; continue; }
          const k = Math.round(Math.log2(v));
          const fs = v < 100 ? 34 : v < 1000 ? 28 : v < 10000 ? 22 : 18;
          html += `<div class="t48 ${i === newIdx ? 'n' : ''}" style="background:${PAL[Math.min(k - 1, PAL.length - 1)]};font-size:${fs}px">${v}<small>2${sup(k)}</small></div>`;
        }
        $bd.innerHTML = html;
        newIdx = -1;
      }

      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span>Gộp hai ô giống nhau</span></div>
    <div class="b48" id="bd"></div>
    <p class="hint">Vuốt hoặc dùng phím mũi tên. Mỗi ô ghi thêm dạng lũy thừa của 2 ở góc dưới.</p>
    <div class="row"><button class="btn ghost" id="stop">Kết thúc &amp; nhận XP</button></div>`;

      const $sc = $('#sc'), $bd = $('#bd');
      add(); add(); render();

      onKey = e => {
        const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key];
        if (m !== undefined) { e.preventDefault(); move(m); }
      };

      let sx, sy;
      $bd.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      $bd.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);
      });

      let px, py;
      $bd.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; } });
      $bd.addEventListener('pointerup', e => {
        if (e.pointerType !== 'mouse' || px === undefined) return;
        const dx = e.clientX - px, dy = e.clientY - py; px = undefined;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);
      });

      root.onclick = e => {
        if (e.target.closest('#stop') && !over) { over = true; end(); }
      };
    }

    /* ============ GAME 3: NHÀ HÓA HỌC NHÍ ============ */
startSingleGame({
  id: 'g2048',
  name: '2048 Lũy Thừa',
  icon: '🔢',
  storageKey: 'offline_g2048',
  mount: game2048,
  badges: [
      { id: 't256', n: 'Đạt ô 256', i: '🔢', ok: () => !!S.flags.t256 },
  ],
});
