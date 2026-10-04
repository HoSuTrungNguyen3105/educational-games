// src/games/src/simon.js — Nhớ Dãy Màu (Trí nhớ)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function simonGame(root) {
      const PADS = [
        ['var(--sky)', '▲', 392],
        ['var(--coral)', '●', 494],
        ['var(--amber)', '■', 587],
        ['var(--lime)', '★', 698]
      ];
      let seq = [], step = 0, phase = 'show', score = 0;

      root.innerHTML = `<div class="hud"><span>Vòng <b id="rd">1</b></span><span>⭐ <b id="sc">0</b></span></div>
    <div class="qbox" id="st" style="font-family:var(--head);font-size:24px;font-weight:800">Sẵn sàng?</div>
    <div class="simon">${PADS.map((p, i) => `<button class="pd" data-p="${i}" style="background:${p[0]}" aria-label="Ô ${i + 1}">${p[1]}</button>`).join('')}</div>
    <p class="hint">Xem dãy sáng lên, rồi bấm lại đúng thứ tự. Mỗi vòng thêm một bước.</p>`;

      const pads = [...root.querySelectorAll('.pd')];
      const $rd = $('#rd'), $sc = $('#sc'), $st = $('#st');

      const flash = (i, ms) => {
        pads[i].classList.add('on');
        beep(PADS[i][2], ms / 1000, 'triangle', .09);
        T.set(() => pads[i].classList.remove('on'), ms);
      };

      function round() {
        seq.push(rnd(0, 3));
        step = 0; phase = 'show';
        $rd.textContent = seq.length;
        $st.textContent = 'Xem kỹ...';

        const gap = Math.max(230, 520 - seq.length * 22);
        const on = Math.max(160, gap * .6);
        seq.forEach((p, k) => T.set(() => flash(p, on), 700 + k * gap));
        T.set(() => { phase = 'input'; $st.textContent = 'Đến lượt bạn!'; }, 700 + seq.length * gap);
      }

      root.onclick = e => {
        const b = e.target.closest('[data-p]');
        if (!b || phase !== 'input') return;
        const i = +b.dataset.p;
        flash(i, 180);
        if (i !== seq[step]) {
          phase = 'over'; sfx.bad();
          $st.textContent = 'Sai rồi!';
          const rounds = seq.length - 1;
          if (rounds >= 8) S.flags.simon = true;
          T.set(() => finish({
            id: 'simon', score,
            xp: Math.round(score / 4) + rounds,
            lines: [`Nhớ được ${rounds} bước`],
            replay: simonGame, details: { rounds }
          }), 900);
          return;
        }
        step++;
        if (step === seq.length) {
          phase = 'wait';
          score += seq.length * 10;
          $sc.textContent = score;
          $st.textContent = 'Chính xác!';
          T.set(sfx.ok, 200);
          T.set(round, 1100);
        }
      };

      T.set(round, 700);
    }

    /* ============ Khởi động ============ */
startSingleGame({
  id: 'simon',
  name: 'Nhớ Dãy Màu',
  icon: '🎵',
  storageKey: 'offline_simon',
  mount: simonGame,
  badges: [
      { id: 'simon', n: 'Nhớ 8 vòng', i: '🧠', ok: () => !!S.flags.simon },
  ],
});
