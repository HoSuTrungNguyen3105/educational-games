// src/games/src/g2048.js — Fruit Merge

    function game2048(root) {
      const COLORS = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#b5d8ff', '#8fb8ff', '#c3a6ff', '#ff9de2', '#ffd166', '#ffc233'];
      const FRUITS = ['🍒', '🍓', '🍊', '🍋', '🍇', '🍉', '🍍', '🥝', '🥭', '🍎', '🍐'];
      const saved = loadOfflineRun('g2048');
      let b = saved && Array.isArray(saved.board) && saved.board.length === 16 &&
        saved.board.every(v => Number.isSafeInteger(v) && v >= 0) ? saved.board : Array(16).fill(0);
      let score = Number.isSafeInteger(saved && saved.score) && saved.score >= 0 ? saved.score : 0;
      let over = !!(saved && saved.over), newIdx = -1;

      function add() {
        const empty = [];
        for (let i = 0; i < 16; i++) if (!b[i]) empty.push(i);
        if (!empty.length) return;
        const p = empty[rnd(0, empty.length - 1)];
        b[p] = Math.random() < .9 ? 2 : 4; newIdx = p;
      }
      function saveRun() { saveOfflineRun('g2048', { board: b, score, over }); }
      if (!saved || !Array.isArray(saved.board) || saved.board.length !== 16 ||
          !saved.board.every(v => Number.isSafeInteger(v) && v >= 0)) { add(); add(); }

      function slide(line) {
        const a = line.filter(Boolean);
        let gain = 0;
        for (let i = 0; i < a.length - 1; i++) {
          if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1); }
        }
        while (a.length < 4) a.push(0);
        return { a, gain };
      }
      function canMove() {
        if (b.includes(0)) return true;
        for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
          const v = b[r * 4 + c];
          if ((c < 3 && b[r * 4 + c + 1] === v) || (r < 3 && b[(r + 1) * 4 + c] === v)) return true;
        }
        return false;
      }
      function finishRun() {
        const mx = Math.max(...b);
        const fruitTier = Math.max(0, Math.round(Math.log2(mx)) - 1);
        clearOfflineRun('g2048');
        finish({ id: 'g2048', score, lines: [`Trái cây cao nhất: ${FRUITS[Math.min(fruitTier, FRUITS.length - 1)]}`, `${score} điểm`],
          replay: game2048, details: { fruitTier } });
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
        if (!canMove()) { over = true; render(); saveRun(); T.set(finishRun, 900); }
        else saveRun();
      }

      root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span>Ghép hai trái cây giống nhau</span></div>
    <div class="b48" id="bd"></div>
    <p class="hint">Vuốt hoặc dùng phím mũi tên để trượt các ô. Ghép trái cây giống nhau để tạo loại mới.</p>
    <div class="row"><button class="btn ghost" id="stop">Kết thúc ván</button></div>`;
      const $sc = $('#sc'), $bd = $('#bd');
      function render() {
        $sc.textContent = score;
        let html = '';
        for (let i = 0; i < 16; i++) {
          const v = b[i];
          if (!v) { html += '<div class="t48"></div>'; continue; }
          const k = Math.max(0, Math.round(Math.log2(v)) - 1);
          html += `<div class="t48 ${i === newIdx ? 'n' : ''}" style="background:${COLORS[Math.min(k, COLORS.length - 1)]};font-size:clamp(22px,7vw,40px)">${FRUITS[Math.min(k, FRUITS.length - 1)]}</div>`;
        }
        $bd.innerHTML = html; newIdx = -1;
      }
      render(); saveRun();
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
        if (e.target.closest('#stop') && !over) { over = true; finishRun(); }
      };
      if (over) T.set(finishRun, 900);
    }

    startSingleGame({
      id: 'g2048',
      name: 'Vườn Trái Cây',
      icon: '🍉',
      storageKey: 'offline_g2048',
      mount: game2048,
    });
