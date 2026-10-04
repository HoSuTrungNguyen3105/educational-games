// src/games/src/sumseq.js — Chuỗi Số (Toán)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

MC_MAKERS.sumseq = function sumseq(level) {
        const kind = rnd(4);
        const step = rnd(2, 6 + level);
        const start = rnd(1, 20);
        let seq, ans, exp;
        if (kind === 0) {                      // cộng đều
          seq = [start, start + step, start + step * 2, start + step * 3];
          ans = start + step * 4;
          exp = `Mỗi số cộng thêm ${step}.`;
        } else if (kind === 1) {               // giảm đều
          seq = [20 + step * 3, 20 + step * 2, 20 + step, 20];
          ans = Math.max(0, 20 - step);
          exp = `Mỗi số trừ ${step}.`;
        } else if (kind === 2) {               // chính phương
          const b = rnd(2, 3 + level);
          seq = [b * b, (b + 1) * (b + 1), (b + 2) * (b + 2), (b + 3) * (b + 3)];
          ans = (b + 4) * (b + 4);
          exp = `Là các số chính phương liên tiếp từ ${b}.`;
        } else {                               // nhân 2
          seq = [2, 4, 8, 16];
          ans = 32;
          exp = 'Mỗi số nhân đôi.';
        }
        const wrong = distractors([ans - 1, ans + 1, ans + step, ans - step, ans + 10, ans - 10, ans + 2], String(ans)).map(Number);
        const opts = shuffle([String(ans), ...wrong.slice(0, 3).map(String)]);
        return {
          html: `<div style="font-size:11px;opacity:.7">CHUỖI SỐ</div>
                 <div style="font-size:28px;font-weight:800;margin-top:8px">${seq.join('  ·  ')}  ·  ?</div>
                 <div style="font-size:12px;opacity:.6;margin-top:6px">Điền số tiếp theo</div>`,
          opts, ans: String(ans), exp,
        };
      },
startMcGame('sumseq', {
  name: 'Chuỗi Số',
  icon: '➕',
  badges: [

  ],
});
