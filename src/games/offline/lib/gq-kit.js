/* gq-kit.js — Bộ nâng cấp dùng chung cho game dọc:
   · Màn chọn độ khó 4 mức (Dễ / Trung bình / Khó / Siêu khó) — cùng một giao diện cho mọi game
   · Độ khó thật: nhịp game (setTimeout/setInterval/rAF/performance.now/Date.now) co giãn theo mức,
     điểm & XP nhân hệ số (game dạng "single"), số mạng / giây mỗi câu / màn khởi đầu (mcengine)
   · Pháo hoa khi kết thúc ván, nút "Đổi độ khó", nhãn độ khó luôn hiện trên đầu màn hình
   MODE được build thay: 'single' (game sinh từ shell) hoặc 'standalone' (game viết tay). */
(() => {
  if (window.GQ) return;
  const MODE = '__MODE__';
  const TIERS = [
    { k: 'easy',   n: 'Dễ',         e: '🌱', c: '#22b573', s: .75, m: 1,   lives: 5, secs: 35, lvl0: 1, d: 'Chậm rãi, nhiều mạng — thoải mái làm quen' },
    { k: 'mid',    n: 'Trung bình', e: '🔥', c: '#f4b942', s: 1,   m: 1.5, lives: 3, secs: 25, lvl0: 1, d: 'Nhịp độ chuẩn, vừa sức chơi' },
    { k: 'hard',   n: 'Khó',        e: '⚡', c: '#e4572e', s: 1.3, m: 2,   lives: 3, secs: 18, lvl0: 2, d: 'Nhanh hơn, ít thời gian suy nghĩ' },
    { k: 'insane', n: 'Siêu khó',   e: '💀', c: '#8b5cf6', s: 1.7, m: 3,   lives: 2, secs: 12, lvl0: 3, d: 'Cực nhanh, ít sai sót — dành cho cao thủ' },
  ];
  const G = { t: TIERS[1], i: 1, locked: MODE === 'standalone', q: [] };

  /* ---- Co giãn thời gian theo độ khó ---- */
  const oT = window.setTimeout.bind(window), oC = window.clearTimeout.bind(window);
  const oR = window.requestAnimationFrame.bind(window), oP = performance.now.bind(performance), oD = Date.now;
  const cp = { o: 0 }, cd = { o: 0 };
  const sc = (raw, c) => raw * G.t.s + c.o;
  function setTier(i) {
    const r = oP(), d = oD(), a = sc(r, cp), b = sc(d, cd);
    G.i = i; G.t = TIERS[i];
    cp.o = a - r * G.t.s; cd.o = b - d * G.t.s;
  }
  performance.now = () => sc(oP(), cp);
  Date.now = () => sc(oD(), cd);
  window.requestAnimationFrame = cb => {
    if (G.locked) { G.q.push(cb); return 0; }
    return oR(ts => cb(sc(ts, cp)));
  };
  window.setTimeout = (f, ms, ...a) => typeof f === 'function' ? oT(f, (ms || 0) / G.t.s, ...a) : oT(f, ms);
  const IV = {}; let ivn = 1e9;
  window.setInterval = (f, ms, ...a) => {
    if (typeof f !== 'function') return 0;
    const id = ++ivn, run = () => { IV[id] = oT(() => { if (!(id in IV)) return; if (!G.locked) f(...a); if (id in IV) run(); }, Math.max(0, (ms || 0) / G.t.s)); };
    IV[id] = 0; run(); return id;
  };
  const oCI = window.clearInterval.bind(window);
  window.clearInterval = id => { if (id > 1e9) { oC(IV[id]); delete IV[id]; } else oCI(id); };

  window.GQ = {
    tiers: TIERS, set: setTier,
    get tier() { return G.t; }, get idx() { return G.i; },
    get s() { return G.t.s; }, get m() { return G.t.m; },
    get lives() { return G.t.lives; }, get secs() { return G.t.secs; }, get lvl0() { return G.t.lvl0; },
  };

  /* ---- Tiện ích ---- */
  const $el = (h) => { const d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstChild; };
  const KEY = 'gq_diff:' + (location.pathname.split('/').pop() || 'game');
  const quit = () => {
    try { if (window.parent && window.parent !== window) { window.parent.postMessage({ type: 'quit', data: {} }, '*'); return; } } catch (e) { /* ignore */ }
    try { location.href = '/'; } catch (e) { /* ignore */ }
  };
  let actx;
  const tone = (f) => { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; o.type = 'triangle'; g.gain.value = .06; o.connect(g); g.connect(actx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + .15); o.stop(actx.currentTime + .15); } catch (e) { /* ignore */ } };

  function pill() {
    let p = document.querySelector('.gq-tier');
    if (!p) { p = $el('<div class="gq-tier"></div>'); document.body.appendChild(p); }
    p.textContent = G.t.e + ' ' + G.t.n; p.style.setProperty('--c', G.t.c);
  }

  /* ---- Màn chọn độ khó (giống hệt nhau ở mọi game) ---- */
  function pick(meta, go) {
    let last = 1;
    try { const v = +localStorage.getItem(KEY); if (v >= 0 && v < 4) last = v; } catch (e) { /* ignore */ }
    const chip = t => MODE === 'single' ? `×${t.m} điểm` : `tốc độ ×${t.s}`;
    const box = $el(`<div id="gqp"><button class="gqp-x" aria-label="Thoát">←</button>
      <div class="gqp-box"><div class="gqp-ic">${meta.icon || '🎮'}</div><h1>${meta.name}</h1>
      <p>Chọn độ khó để bắt đầu</p>
      <div class="gqp-list">${TIERS.map((t, i) => `<button class="gqd${i === last ? ' last' : ''}" data-i="${i}" style="--c:${t.c}">
        <i>${t.e}</i><span><b>${t.n}</b><em>${t.d}</em></span><u>${chip(t)}</u></button>`).join('')}</div>
      <small>Độ khó càng cao, nhịp chơi càng gấp — thưởng càng lớn 🏆</small></div></div>`);
    box.querySelector('.gqp-x').onclick = quit;
    box.querySelector('.gqp-list').onclick = e => {
      const b = e.target.closest('.gqd'); if (!b) return;
      const i = +b.dataset.i; tone(380 + i * 120);
      try { localStorage.setItem(KEY, i); } catch (er) { /* ignore */ }
      setTier(i); box.remove(); pill();
      if (G.locked) { G.locked = false; G.q.splice(0).forEach(cb => window.requestAnimationFrame(cb)); }
      go && go();
    };
    document.body.appendChild(box);
    setTimeout(() => { try { box.querySelector('.last').focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 50);
  }

  /* ---- Pháo hoa ---- */
  function boom() {
    const em = ['🎉', '⭐', '✨', '🎊', '🍓', '💫'];
    for (let i = 0; i < 34; i++) {
      const s = $el(`<span class="gq-conf">${em[i % em.length]}</span>`);
      s.style.cssText = `left:${Math.random() * 100}vw;--dx:${(Math.random() * 160 - 80) | 0}px;animation-delay:${(Math.random() * .5).toFixed(2)}s;font-size:${16 + (Math.random() * 18 | 0)}px`;
      document.body.appendChild(s); oT(() => s.remove(), 2800);
    }
  }

  /* ---- Gắn vào game ---- */
  if (MODE === 'single') {
    const o = window.startSingleGame, f = window.finish;
    window.startSingleGame = cfg => {
      const go = () => { o(cfg); pill(); };
      if (document.body) pick({ name: cfg.name, icon: cfg.icon }, go);
      else document.addEventListener('DOMContentLoaded', () => pick({ name: cfg.name, icon: cfg.icon }, go));
    };
    window.finish = function (opt) {
      const t = G.t, m = t.m;
      const r = f.call(this, Object.assign({}, opt, {
        score: Math.round((opt.score || 0) * m), xp: Math.round((opt.xp || 0) * m),
        lines: [`${t.e} ${t.n} ×${m}`].concat(opt.lines || []),
      }));
      boom();
      const row = document.querySelector('#modal .row');
      if (row) { const b = $el('<button class="btn alt ghost" id="gq-chg">🎚️ Đổi độ khó</button>'); b.onclick = () => location.reload(); row.appendChild(b); }
      return r;
    };
  } else {
    const start = () => {
      const t = (document.title || 'Trò chơi').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
      const ic = (document.title.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u) || ['🎮'])[0];
      document.documentElement.classList.add('gq-sa');
      pick({ name: t, icon: ic });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  }
})();
