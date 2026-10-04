// src/games/src/clock.js — Đồng Hồ Thời Gian (Toán · Xem giờ)
// Sinh tự động từ game2.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game2.html.

    function clockGame(root) {
      const fmt = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
      const qs = Array.from({ length: 10 }, (_, i) => {
        const h = rnd(1, 12);
        const m = i < 4 ? [0, 30][rnd(0, 1)] : i < 7 ? [0, 15, 30, 45][rnd(0, 3)] : rnd(0, 11) * 5;
        return { h, m };
      });

      function options(h, m) {
        const set = new Set([fmt(h, m)]);
        const c = [
          fmt(h, (m + 30) % 60),
          fmt(h === 12 ? 1 : h + 1, m),
          fmt(h === 1 ? 12 : h - 1, m),
          fmt(h, (m + 5) % 60),
          fmt(h, (m + 55) % 60),
          fmt(h, (m + 15) % 60),
          fmt(m / 5 || 12, (h % 12) * 5)
        ];
        for (const x of shuffle(c)) { if (set.size < 4) set.add(x); }
        while (set.size < 4) set.add(fmt(rnd(1, 12), rnd(0, 11) * 5));
        return shuffle([...set]);
      }

      function draw(cv, h, m) {
        const S_ = 240, ctx = fitCanvas(cv, S_, S_), c = S_ / 2, R = 108;

        ctx.fillStyle = '#fff6df'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill(); ctx.stroke();

        for (let k = 0; k < 60; k++) {
          const a = k * 6 * Math.PI / 180, l = k % 5 ? 5 : 11;
          ctx.lineWidth = k % 5 ? 1.5 : 3;
          ctx.strokeStyle = '#0b2227';
          ctx.beginPath();
          ctx.moveTo(c + Math.sin(a) * (R - 6), c - Math.cos(a) * (R - 6));
          ctx.lineTo(c + Math.sin(a) * (R - 6 - l), c - Math.cos(a) * (R - 6 - l));
          ctx.stroke();
        }

        ctx.fillStyle = '#0b2227';
        ctx.font = '800 22px Baloo 2,system-ui,sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let k = 1; k <= 12; k++) {
          const a = k * 30 * Math.PI / 180;
          ctx.fillText(k, c + Math.sin(a) * R * .74, c - Math.cos(a) * R * .74 + 1);
        }

        const hand = (ang, len, w, colr) => {
          ctx.strokeStyle = colr; ctx.lineWidth = w; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(c, c);
          ctx.lineTo(c + Math.sin(ang) * len, c - Math.cos(ang) * len);
          ctx.stroke();
        };
        hand(((h % 12) + m / 60) * 30 * Math.PI / 180, R * .47, 9, '#15434b');
        hand(m * 6 * Math.PI / 180, R * .74, 5, '#ff6f59');

        ctx.fillStyle = '#0b2227';
        ctx.beginPath(); ctx.arc(c, c, 7, 0, 7); ctx.fill();
      }

      root.innerHTML = '';
      runMC(root, {
        id: 'clock', replay: clockGame, count: 10, secs: 15,
        make(i) {
          const { h, m } = qs[i], ans = fmt(h, m);
          return {
            html: `<canvas id="ck"></canvas><div class="hint" style="margin-top:10px">Đồng hồ đang chỉ mấy giờ? (kim ngắn chỉ giờ, kim dài chỉ phút)</div>`,
            after() { draw($('#ck'), h, m); },
            opts: options(h, m), ans,
            exp: m === 0
              ? `Kim dài chỉ số 12 nên là ${h} giờ đúng: ${ans}.`
              : `Kim ngắn chỉ gần số ${h} nên là ${h} giờ. Kim dài chỉ số ${m / 5} nên là ${m} phút. Vậy là ${ans}.`
          };
        },
        onEnd(r) { if (r === 10) S.flags.clock = true; },
        details(right) { return { right }; }
      });
    }

    /* ============ GAME 5: QUY LUẬT SỐ ============ */
startSingleGame({
  id: 'clock',
  name: 'Đồng Hồ Thời Gian',
  icon: '🕒',
  storageKey: 'offline_clock',
  mount: clockGame,
  badges: [
      { id: 'clock', n: 'Xem giờ 10/10', i: '🕒', ok: () => !!S.flags.clock },
  ],
});
