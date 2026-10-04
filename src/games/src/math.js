// src/games/src/math.js — Đua Toán (Toán)
// Sinh tự động từ game1.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game1.html.

    function speak(t) {
      if (!soundOn || !('speechSynthesis' in window)) return;
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; speechSynthesis.speak(u) } catch (e) { }
    }

    /* ============ Dữ liệu từ vựng & quiz ============ */

    function mathGame(root) {
      root.innerHTML = `<div class="panel center"><h2>Chọn độ khó</h2>
    <p class="hint">60 giây. Đúng liên tiếp để nhân điểm và được cộng thêm giờ.</p>
    <div class="row" style="flex-direction:column">
      <button class="btn" data-l="0">Dễ · Cộng trừ trong 25</button>
      <button class="btn sky" data-l="1">Vừa · Nhân chia bảng cửu chương</button>
      <button class="btn" style="background:var(--tomato);color:#fff" data-l="2">Khó · Phép tính nhiều bước</button>
    </div></div>`;
      root.onclick = e => { const b = e.target.closest('[data-l]'); if (b) run(+b.dataset.l) };
      function run(level) {
        root.onclick = null;
        let score = 0, combo = 0, maxCombo = 0, right = 0, total = 0, time = 60, q, lock = false;
        root.innerHTML = `<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="cb">🔥 x1</span><span>⏱ <b id="tm">60</b>s</span></div>
      <div class="timebar"><i id="tb"></i></div><div class="qbox" id="q"></div><div class="opts" id="o"></div>`;
        const next = () => {
          q = genMath(level); const opts = makeOpts(q.ans, 4);
          $('#q').textContent = q.text + ' = ?'; $('#q').classList.remove('pop'); void $('#q').offsetWidth; $('#q').classList.add('pop');
          $('#o').innerHTML = opts.map(v => `<button class="opt" data-v="${v}">${v}</button>`).join('');
          lock = false;
        };
        const mult = () => Math.min(4, 1 + Math.floor(combo / 5));
        const hud = () => { $('#sc').textContent = score; $('#cb').textContent = `🔥 x${mult()} (${combo})`; $('#tm').textContent = Math.ceil(time); $('#tb').style.width = Math.min(100, time / 60 * 100) + '%' };
        root.onclick = e => {
          const b = e.target.closest('.opt'); if (!b || lock) return; lock = true; total++;
          if (+b.dataset.v === q.ans) {
            right++; combo++; maxCombo = Math.max(maxCombo, combo); score += 10 * mult(); sfx.ok(); b.classList.add('ok');
            if (combo % 5 === 0) { time = Math.min(75, time + 2); toast('⏱ +2 giây! Chuỗi ' + combo) }
            if (combo >= 10) S.flags.combo10 = true;
          } else {
            combo = 0; time = Math.max(0, time - 2); sfx.bad(); b.classList.add('bad');
            [...root.querySelectorAll('.opt')].find(x => +x.dataset.v === q.ans).classList.add('ok');
          }
          hud(); T.set(next, combo ? 250 : 600);
        };
        T.int(() => {
          time -= .1; hud();
          if (time <= 0) {
            T.clear();
            finish({
              id: 'math', score, xp: Math.round(score / 8) + (right ? 5 : 0),
              lines: [`Đúng ${right}/${total} câu`, `Chuỗi dài nhất ${maxCombo}`],
              replay: mathGame,
              details: { level, right, total, maxCombo }
            });
          }
        }, 100);
        next(); hud();
      }
    }

    /* ============ GAME 2: LẬT THẺ ANH – VIỆT ============ */
startSingleGame({
  id: 'math',
  name: 'Đua Toán',
  icon: '➕',
  storageKey: 'offline_math',
  mount: mathGame,
  badges: [
      { id: 'f10', n: '10 câu đúng', i: '✅', ok: () => S.games >= 1 },
  ],
});
