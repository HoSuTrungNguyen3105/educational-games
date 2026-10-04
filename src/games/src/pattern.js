// src/games/src/pattern.js — Thám Tử Quy Luật (Toán · Tư duy)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function patternGame(root) {
      function genSeq(n) {
        const t = n < 3 ? rnd(0, 1) : n < 7 ? rnd(0, 4) : rnd(0, 6);
        let seq = [], rule = '';

        if (t === 0) {
          const a = rnd(1, 20), d = rnd(2, 9);
          seq = [...Array(6)].map((_, i) => a + d * i);
          rule = `Mỗi số bằng số đứng trước cộng ${d}.`;
        } else if (t === 1) {
          const d = rnd(2, 8), a = rnd(40, 70);
          seq = [...Array(6)].map((_, i) => a - d * i);
          rule = `Mỗi số bằng số đứng trước trừ ${d}.`;
        } else if (t === 2) {
          const r = rnd(2, 3), a = rnd(1, 3);
          seq = [...Array(6)].map((_, i) => a * r ** i);
          rule = `Mỗi số bằng số đứng trước nhân ${r}.`;
        } else if (t === 3) {
          const o = rnd(0, 3);
          seq = [...Array(6)].map((_, i) => (i + 1) ** 2 + o);
          rule = o ? `Đây là dãy số chính phương 1, 4, 9, 16, ... cộng thêm ${o}.` : 'Đây là dãy số chính phương: 1², 2², 3², 4², ...';
        } else if (t === 4) {
          const a = rnd(1, 5), d0 = rnd(1, 3);
          let v = a; seq = [v];
          for (let i = 1; i < 6; i++) { v += d0 + i - 1; seq.push(v); }
          rule = `Hiệu hai số liên tiếp tăng dần: +${d0}, +${d0 + 1}, +${d0 + 2}, ...`;
        } else if (t === 5) {
          const a = rnd(1, 4), b = rnd(2, 6);
          seq = [a, b];
          for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);
          rule = 'Mỗi số bằng tổng của hai số đứng ngay trước nó.';
        } else {
          const a = rnd(20, 30), p = rnd(4, 9), m = rnd(1, p - 2);
          seq = [a];
          for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 ? p : -m));
          rule = `Luân phiên cộng ${p} rồi trừ ${m}.`;
        }
        return { seq, h: rnd(2, 5), rule };
      }

      root.innerHTML = '';
      runMC(root, {
        id: 'pattern', replay: patternGame, count: 10, secs: 20,
        make(i) {
          const { seq, h, rule } = genSeq(i);
          const ans = seq[h];
          return {
            html: `<div class="hint" style="margin:0 0 12px">Tìm số còn thiếu theo quy luật</div>
          <div class="seq">${seq.map((v, k) => `<div class="chip ${k === h ? 'q' : ''}">${k === h ? '?' : v}</div>`).join('')}</div>`,
            opts: makeOpts(ans, 4), ans,
            exp: `${rule} Số cần tìm là ${ans}.`
          };
        },
        onEnd(r) { if (r === 10) S.flags.pat = true; },
        details(right) { return { right }; }
      });
    }

    /* ============ GAME 6: NHỚ DÃY MÀU ============ */
startSingleGame({
  id: 'pattern',
  name: 'Thám Tử Quy Luật',
  icon: '🕵️',
  storageKey: 'offline_pattern',
  mount: patternGame,
  badges: [
      { id: 'pat', n: 'Tìm ra quy luật', i: '🕵️', ok: () => !!S.flags.pat },
  ],
});
