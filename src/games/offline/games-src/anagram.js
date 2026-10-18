// src/games/src/anagram.js — Mê Cung Ký Tự

    function anagramGame(root) {
      const id = 'anagram';
      const words = ['kẹo', 'mèo', 'nhạc', 'mưa', 'kem', 'phim', 'vui', 'gấu', 'bánh', 'trà', 'sóng', 'mơ', 'chơi', 'cười', 'nắng', 'mây'];
      const saved = loadOfflineRun(id);
      const valid = saved && Array.isArray(saved.deck) && saved.deck.length === 8 &&
        saved.deck.every(word => words.includes(word)) && Number.isInteger(saved.round) &&
        saved.round >= 0 && saved.round < 8 && Number.isInteger(saved.score) &&
        Array.isArray(saved.tiles) && saved.tiles.every(tile => typeof tile === 'string') &&
        Array.isArray(saved.picked) && saved.picked.every(i => Number.isInteger(i) && i >= 0 && i < saved.tiles.length);
      let game = valid ? saved : fresh();
      let locked = false;

      function fresh() {
        clearOfflineRun(id);
        const deck = shuffle(words).slice(0, 8);
        return { deck, round: 0, score: 0, tiles: anagramShuffle(deck[0]), picked: [] };
      }
      function anagramShuffle(word) {
        const chars = [...word.toLocaleUpperCase('vi')];
        let result = shuffle(chars);
        if (result.join('') === chars.join('')) result = [...chars].reverse();
        return result;
      }
      function save() { saveOfflineRun(id, game); }
      function render() {
        const word = game.deck[game.round];
        root.innerHTML = `<div class="hud"><span>🗝️ <b>${game.round + 1}</b>/8</span><span>⭐ <b>${game.score}</b></span></div>
          <div class="qbox center"><div style="font-size:30px">🧩</div><div style="font-size:20px;margin-top:6px">Mê Cung Ký Tự</div><p class="hint">Ghép các mảnh chữ để mở rương.</p>
            <div style="font-size:14px;opacity:.7">${[...word].length} mảnh</div></div>
          <div class="slots" id="anagramSlots">${[...word].map((_, i) => {
            const tileIndex = game.picked[i];
            return `<button class="slot ${tileIndex === undefined ? '' : 'fill'}" data-slot="${i}">${tileIndex === undefined ? '' : game.tiles[tileIndex]}</button>`;
          }).join('')}</div>
          <div class="tiles">${game.tiles.map((tile, i) => `<button class="tl" data-tile="${i}" ${game.picked.includes(i) ? 'disabled' : ''}>${tile}</button>`).join('')}</div>
          <div class="row"><button class="btn alt" data-clear="1">↩️ Gỡ chữ</button><button class="btn alt" data-skip="1">⏭️ Bỏ qua</button><button class="btn alt" data-restart="1">🔄 Chơi lại</button></div>`;
        save();
      }
      function advanceRound(solved) {
        if (solved) game.score += 10;
        game.round++;
        if (game.round >= game.deck.length) {
          clearOfflineRun(id);
          finish({ id, score: game.score, lines: [`Đã mở ${game.deck.length} rương`, `${game.score} điểm`],
            replay: anagramGame, details: { rounds: game.deck.length, score: game.score } });
          return;
        }
        game.tiles = anagramShuffle(game.deck[game.round]);
        game.picked = [];
        locked = false;
        render();
      }
      root.onclick = e => {
        const restart = e.target.closest('[data-restart]');
        if (restart) { T.clear(); game = fresh(); locked = false; render(); return; }
        if (locked) return;
        if (e.target.closest('[data-clear]')) { game.picked = []; sfx.tick(); render(); return; }
        if (e.target.closest('[data-skip]')) { advanceRound(false); return; }
        const tile = e.target.closest('[data-tile]');
        if (!tile || game.picked.includes(+tile.dataset.tile)) return;
        game.picked.push(+tile.dataset.tile);
        sfx.tick();
        render();
        const word = game.deck[game.round].toLocaleUpperCase('vi');
        if (game.picked.length === [...word].length) {
          locked = true;
          const guess = game.picked.map(i => game.tiles[i]).join('');
          if (guess === word) {
            sfx.ok();
            advanceRound(true);
          } else {
            sfx.bad();
            game.picked = [];
            save();
            T.set(() => { game.picked = []; locked = false; render(); }, 500);
          }
        }
      };
      if (!valid && saved) clearOfflineRun(id);
      render();
    }

    startSingleGame({
      id: 'anagram',
      name: 'Mê Cung Ký Tự',
      icon: '🧩',
      storageKey: 'offline_anagram',
      mount: anagramGame,
    });
