// src/games/src/chem.js — Nhà Hóa Học Nhí (Hóa học)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function chemGame(root) {
      const ATOMS = [
        ['H', '#eaf0ff', '#0b2227'], ['O', '#ff6f59', '#0b2227'], ['C', '#3d4a55', '#ffffff'],
        ['N', '#6ec6ff', '#0b2227'], ['Na', '#b18cff', '#0b2227'], ['Cl', '#b7e34a', '#0b2227']
      ];
      const MOLS = [
        { name: 'Nước', f: { H: 2, O: 1 }, s: 'H₂O' },
        { name: 'Khí cacbonic', f: { C: 1, O: 2 }, s: 'CO₂' },
        { name: 'Khí metan (khí biogas)', f: { C: 1, H: 4 }, s: 'CH₄' },
        { name: 'Khí amoniac', f: { N: 1, H: 3 }, s: 'NH₃' },
        { name: 'Muối ăn', f: { Na: 1, Cl: 1 }, s: 'NaCl' },
        { name: 'Axit clohiđric', f: { H: 1, Cl: 1 }, s: 'HCl' },
        { name: 'Khí oxi', f: { O: 2 }, s: 'O₂' },
        { name: 'Khí hiđro', f: { H: 2 }, s: 'H₂' },
        { name: 'Hiđro peroxit (nước oxi già)', f: { H: 2, O: 2 }, s: 'H₂O₂' },
        { name: 'Khí nitơ', f: { N: 2 }, s: 'N₂' },
        { name: 'Khí cacbon monoxit', f: { C: 1, O: 1 }, s: 'CO' }
      ];

      const list = shuffle(MOLS).slice(0, 8);
      const col = Object.fromEntries(ATOMS.map(a => [a[0], a]));

      let i = 0, score = 0, solved = 0, wrong = 0, totalWrong = 0, flask = [], busy = false;

      const total = m => Object.values(m.f).reduce((a, b) => a + b, 0);
      const chip = (a, k) => `<button class="atom" data-r="${k}" style="background:${col[a][1]};color:${col[a][2]}" aria-label="Bỏ ${a}">${a}</button>`;

      function render(msg) {
        const m = list[i];
        root.innerHTML = `<div class="hud"><span>Chất <b>${i + 1}/8</b></span><span>⭐ <b>${score}</b></span><span>${wrong < 3 ? '❤️'.repeat(3 - wrong) : '💔'}</span></div>
      <div class="qbox"><small style="color:var(--mute)">Hãy tạo ra</small><br><b style="font-family:var(--head);font-size:28px">${m.name}</b>
      ${wrong >= 1 ? `<br><span class="pill" style="margin-top:8px">Gợi ý: có tất cả ${total(m)} nguyên tử</span>` : ''}</div>
      <div class="flask" id="fl">${flask.map(chip).join('') || '<span class="hint">Chạm nguyên tử bên dưới để thả vào bình</span>'}</div>
      <div class="row atoms">${ATOMS.map(([s, bg, fg]) => `<button class="atom big" data-a="${s}" style="background:${bg};color:${fg}" aria-label="Nguyên tử ${s}">${s}</button>`).join('')}</div>
      ${msg || `<div class="row"><button class="btn ghost" data-x="clear">Đổ đi</button><button class="btn" data-x="mix">🧪 Trộn!</button></div><p class="hint">Chạm nguyên tử trong bình để bỏ ra.</p>`}`;
      }

      function next() {
        i++;
        if (i >= 8) {
          if (totalWrong === 0) S.flags.chem = true;
          finish({
            id: 'chem', score,
            xp: Math.round(score / 3) + solved * 2,
            lines: [`Tạo đúng ${solved}/8 chất`, `${totalWrong} lần sai`],
            replay: chemGame, details: { solved, totalWrong }
          });
          return;
        }
        flask = []; wrong = 0; busy = false; render();
      }

      function mix() {
        const m = list[i];
        const cnt = {};
        for (const a of flask) cnt[a] = (cnt[a] || 0) + 1;
        const keys = new Set([...Object.keys(cnt), ...Object.keys(m.f)]);
        let good = true;
        for (const k of keys) if ((cnt[k] || 0) !== (m.f[k] || 0)) { good = false; break; }
        busy = true;

        if (good) {
          const pts = Math.max(8, 20 - wrong * 6);
          score += pts; solved++; sfx.ok();
          render(`<div class="qbox pop" style="margin-top:14px"><b style="font-family:var(--head);font-size:30px;color:var(--lime)">${m.s}</b><br>Chính xác! +${pts} điểm</div>`);
          T.set(next, 1600);
        } else {
          wrong++; totalWrong++; sfx.bad();
          if (wrong >= 3) {
            render(`<div class="qbox" style="margin-top:14px">Công thức đúng là <b style="font-family:var(--head);font-size:28px;color:var(--amber)">${m.s}</b></div>`);
            T.set(next, 2200);
          } else {
            busy = false; render();
            $('#fl').classList.add('shake');
          }
        }
      }

      root.onclick = e => {
        if (busy) return;
        const a = e.target.closest('[data-a]');
        const r = e.target.closest('[data-r]');
        const x = e.target.closest('[data-x]');
        if (a) {
          if (flask.length < 6) { flask.push(a.dataset.a); sfx.tick(); render(); }
        } else if (r) {
          flask.splice(+r.dataset.r, 1); render();
        } else if (x) {
          if (x.dataset.x === 'clear') { flask = []; render(); }
          else if (flask.length) mix();
          else toast('Hãy thả nguyên tử vào bình trước');
        }
      };

      render();
    }

    /* ============ GAME 4: ĐỒNG HỒ THỜI GIAN ============ */
startSingleGame({
  id: 'chem',
  name: 'Nhà Hóa Học Nhí',
  icon: '⚗️',
  storageKey: 'offline_chem',
  mount: chemGame,
  badges: [
      { id: 'chem', n: 'Nhà hóa học', i: '⚗️', ok: () => !!S.flags.chem },
  ],
});
