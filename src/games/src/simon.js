// src/games/src/simon.js — Sound & Color

    function simonGame(root) {
      const PADS = [
        ['var(--sky)', '▲', 392],
        ['var(--coral)', '●', 494],
        ['var(--amber)', '■', 587],
        ['var(--lime)', '★', 698]
      ];
      const saved = loadOfflineRun('simon');
      let seq = saved && Array.isArray(saved.seq) && saved.seq.every(i => Number.isInteger(i) && i >= 0 && i < 4) ? saved.seq : [];
      let step = 0, phase = 'show', score = Number.isSafeInteger(saved && saved.score) ? saved.score : 0;

      root.innerHTML = `<div class="hud"><span>Vòng <b id="rd">1</b></span><span>⭐ <b id="sc">0</b></span></div>
    <div class="qbox" id="st" style="font-family:var(--head);font-size:24px;font-weight:800">Sẵn sàng!</div>
    <div class="simon">${PADS.map((p, i) => `<button class="pd" data-p="${i}" style="background:${p[0]}" aria-label="Nút ${i + 1}">${p[1]}</button>`).join('')}</div>
    <p class="hint">Nghe và nhìn dãy màu, sau đó lặp lại theo đúng thứ tự. Mỗi vòng sẽ thêm một âm thanh.</p>`;
      const pads = [...root.querySelectorAll('.pd')];
      const $rd = $('#rd'), $sc = $('#sc'), $st = $('#st');
      function saveRun() { saveOfflineRun('simon', { seq, step, score, phase }); }
      const flash = (i, ms) => {
        pads[i].classList.add('on');
        beep(PADS[i][2], ms / 1000, 'triangle', .09);
        T.set(() => pads[i].classList.remove('on'), ms);
      };
      function showRound(addStep) {
        if (addStep) seq.push(rnd(0, 3));
        step = 0; phase = 'show'; $rd.textContent = seq.length;
        $st.textContent = 'Hãy nghe và nhìn...'; saveRun();
        const gap = Math.max(230, 520 - seq.length * 22), on = Math.max(160, gap * .6);
        seq.forEach((p, k) => T.set(() => flash(p, on), 700 + k * gap));
        T.set(() => { phase = 'input'; $st.textContent = 'Đến lượt bạn!'; saveRun(); }, 700 + seq.length * gap);
      }
      function finishRun() {
        T.clear(); clearOfflineRun('simon');
        const rounds = Math.max(0, seq.length - 1);
        finish({ id: 'simon', score, lines: [`Đã chơi ${rounds} vòng`],
          replay: simonGame, details: { rounds } });
      }
      root.onclick = e => {
        const b = e.target.closest('[data-p]');
        if (!b || phase !== 'input') return;
        const i = +b.dataset.p; flash(i, 180);
        if (i !== seq[step]) {
          phase = 'over'; sfx.bad(); $st.textContent = 'Kết thúc ván!'; saveRun();
          T.set(finishRun, 900); return;
        }
        step++; saveRun();
        if (step === seq.length) {
          phase = 'wait'; score += seq.length * 10; $sc.textContent = score;
          $st.textContent = 'Hay lắm!'; T.set(sfx.ok, 200); saveRun();
          T.set(() => showRound(true), 1100);
        }
      };
      $sc.textContent = score;
      if (saved && saved.phase === 'over') finishRun();
      else if (seq.length) {
        if (saved && saved.phase === 'wait') T.set(() => showRound(true), 700);
        else if (saved && saved.phase === 'input') {
          phase = 'input';
          step = Math.min(Math.max(0, saved.step || 0), seq.length - 1);
          $rd.textContent = seq.length;
          $st.textContent = 'Đến lượt bạn!';
          saveRun();
        } else showRound(false);
      } else T.set(() => showRound(true), 700);
    }

    startSingleGame({
      id: 'simon',
      name: 'Giai Điệu Sắc Màu',
      icon: '🎵',
      storageKey: 'offline_simon',
      mount: simonGame,
    });
