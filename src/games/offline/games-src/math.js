// src/games/offline/games-src/math.js — Săn Trái Cây
//
// Trước đây game chỉ yêu cầu tìm một emoji trùng với mẫu nên không có gì
// để học. Bản này biến nó thành trò "hái quả đúng đáp án": mỗi lượt có một
// phép tính, 9 quả mang số, chạm quả có kết quả đúng. Phép tính khó dần theo
// số câu đã giải, nên vừa luyện tính nhẩm vừa giữ được nhịp arcade.

const FRUIT_TRAY = ['🍓', '🍋', '🍇', '🍉', '🍒', '🍍', '🥝', '🍑', '🍊', '🍎'];

function mathQuestion(solved) {
  const lv = solved < 5 ? 1 : solved < 12 ? 2 : 3;
  let a, b, c, text, ans;
  if (lv === 1) {
    if (rnd(0, 1)) {
      a = rnd(2, 12); b = rnd(1, 8);
      text = `${a} + ${b}`; ans = a + b;
    } else {
      a = rnd(5, 18); b = rnd(1, a);
      text = `${a} − ${b}`; ans = a - b;
    }
  } else if (lv === 2) {
    const t = rnd(0, 2);
    if (t === 0) {
      a = rnd(12, 45); b = rnd(8, 38);
      text = `${a} + ${b}`; ans = a + b;
    } else if (t === 1) {
      a = rnd(30, 70); b = rnd(10, a - 1);
      text = `${a} − ${b}`; ans = a - b;
    } else {
      a = rnd(2, 6); b = rnd(2, 9);
      text = `${a} × ${b}`; ans = a * b;
    }
  } else {
    const t = rnd(0, 3);
    if (t === 0) {
      a = rnd(3, 9); b = rnd(3, 9);
      text = `${a} × ${b}`; ans = a * b;
    } else if (t === 1) {
      b = rnd(3, 9); ans = rnd(3, 10); a = b * ans;
      text = `${a} ÷ ${b}`;
    } else if (t === 2) {
      a = rnd(3, 9); b = rnd(2, 6); c = rnd(5, 30);
      text = `${a} × ${b} + ${c}`; ans = a * b + c;
    } else {
      a = rnd(40, 99); b = rnd(10, 39);
      text = `${a} − ${b}`; ans = a - b;
    }
  }
  return { text, ans };
}

function mathGame(root) {
  gqIntro(root, {
    id: 'math',
    icon: '🍓',
    name: 'Săn Trái Cây',
    desc: 'Giải phép tính rồi chạm thật nhanh vào quả mang kết quả đúng.',
    steps: ['Mỗi lượt có một phép tính ở giữa màn hình.', '9 quả mang số khác nhau — chỉ một quả đúng.', 'Chạm sai bị trừ 3 giây; chuỗi đúng càng dài điểm càng cao.'],
  }, (mode) => startMath(root, mode));
}

function startMath(root, mode) {
  const id = 'math';
  const FRUITS = FRUIT_TRAY;
  let score = 0, combo = 0, bestCombo = 0, solved = 0;
  let seconds = gqSecs(50, mode), lock = false, ended = false;
  let q = mathQuestion(solved);
  let opts = makeOpts(q.ans, 9);

  function deal() {
    q = mathQuestion(solved);
    // makeOpts trả đúng 9 số khác nhau, luôn có q.ans và đã xáo trộn.
    opts = makeOpts(q.ans, 9);
  }

  function paint() {
    root.innerHTML = `<div class="hud">
        <span>⭐ <b>${score}</b></span>
        <span>🔥 <b>${combo}</b></span>
        <span>⏱ <b id="tm">${seconds}</b>s</span>
      </div>
      <div class="qbox">${q.text} = ?</div>
      <div class="board" style="--n:3">${opts.map((n, i) => `<button class="cell" data-i="${i}">
        <span class="ic">${FRUITS[i % FRUITS.length]}</span><span class="num">${n}</span>
      </button>`).join('')}</div>
      <p class="hint">Chạm quả có kết quả đúng. Chuỗi đúng càng dài, điểm càng cao.</p>`;
  }

  function tick() {
    if (ended) return;
    seconds--;
    const tm = root.querySelector('#tm');
    if (tm) tm.textContent = Math.max(0, seconds);
    if (seconds <= 0) finishGame();
  }

  function finishGame() {
    if (ended) return;
    ended = true;
    T.clear();
    if (bestCombo >= 10) S.flags.f10 = true;
    finish({
      id,
      score: gqScore(mode, score),
      xp: Math.round(score / 4),
      lines: [`Đúng ${solved} phép tính`, `Chuỗi tốt nhất: ${bestCombo}`],
      replay: mathGame,
      details: { solved, bestCombo },
    });
  }

  root.onclick = (e) => {
    const btn = e.target.closest('[data-i]');
    if (!btn || lock || ended) return;
    const value = opts[Number(btn.dataset.i)];
    if (value === q.ans) {
      score += 10 + Math.min(combo, 10);
      combo++;
      bestCombo = Math.max(bestCombo, combo);
      solved++;
      sfx.ok();
      lock = true;
      btn.classList.add('ok');
      T.set(() => {
        lock = false;
        deal();
        paint();
      }, 120);
    } else {
      combo = 0;
      seconds = Math.max(0, seconds - 3);
      sfx.bad();
      btn.classList.add('bad');
      T.set(() => btn.classList.remove('bad'), 300);
      const tm = root.querySelector('#tm');
      if (tm) tm.textContent = seconds;
    }
  };

  deal();
  paint();
  T.int(tick, 1000);
}

startSingleGame({
  id: 'math',
  name: 'Săn Trái Cây',
  icon: '🍓',
  storageKey: 'offline_math',
  mount: mathGame,
  badges: [
    { id: 'f10', n: 'Chuỗi x10', i: '🫧', ok: () => !!S.flags.f10 },
  ],
});
