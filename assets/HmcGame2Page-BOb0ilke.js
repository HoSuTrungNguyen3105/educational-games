import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{U as r,bt as i}from"./index-pMGc089C.js";import a from"./HtmlGameLoader-DkoL27sZ.js";var o=e(t(),1),s=`<!DOCTYPE html>\r
<html lang="vi">\r
\r
<head>\r
  <meta charset="UTF-8">\r
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\r
  <title>Học Mà Chơi Lab</title>\r
  <link rel="preconnect" href="https://fonts.googleapis.com">\r
  <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Lexend:wght@400;500;700&display=swap" rel="stylesheet">\r
  <style>\r
    :root {\r
      --bg: #0c2a30;\r
      --panel: #15434b;\r
      --panel2: #1c5964;\r
      --edge: #2f8792;\r
      --text: #f3fffb;\r
      --mute: #9fd0cd;\r
      --amber: #ffc233;\r
      --coral: #ff6f59;\r
      --sky: #6ec6ff;\r
      --lime: #b7e34a;\r
      --violet: #b18cff;\r
      --dark: #0b2227;\r
      --ok: #3ddc84;\r
      --bad: #ff5d6c;\r
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;\r
      --body: 'Lexend', 'Segoe UI', system-ui, sans-serif;\r
    }\r
\r
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent }\r
    html, body { margin: 0 }\r
\r
    body {\r
      font-family: var(--body);\r
      color: var(--text);\r
      min-height: 100vh;\r
      background-color: var(--bg);\r
      background-image: radial-gradient(circle at 1px 1px, rgba(159, 208, 205, .18) 1.2px, transparent 1.4px);\r
      background-size: 26px 26px;\r
    }\r
\r
    #app { max-width: 1000px; margin: 0 auto; padding: 14px 14px 60px }\r
\r
    button { font-family: inherit; color: inherit; cursor: pointer }\r
    h1, h2, h3 { font-family: var(--head); margin: 0; line-height: 1.1 }\r
\r
    .top { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 18px }\r
\r
    .logo {\r
      font-family: var(--head); font-weight: 800; font-size: 28px;\r
      display: flex; align-items: center; gap: 10px\r
    }\r
    .logo i {\r
      font-style: normal; display: grid; place-items: center;\r
      width: 44px; height: 44px; background: var(--lime);\r
      border-radius: 14px; box-shadow: 0 4px 0 #7a9a1f;\r
      font-size: 22px; transform: rotate(-6deg)\r
    }\r
    .logo small { font-size: 13px; background: var(--coral); color: #fff; border-radius: 8px; padding: 2px 8px }\r
\r
    .me { margin-left: auto; display: flex; align-items: center; gap: 10px }\r
    .lvl {\r
      font-family: var(--head); font-weight: 800; background: var(--amber);\r
      color: var(--dark); border-radius: 999px; padding: 4px 14px; font-size: 17px\r
    }\r
    .xp { width: 120px; height: 14px; border-radius: 999px; background: var(--panel); overflow: hidden; border: 2px solid var(--edge) }\r
    .xp i { display: block; height: 100%; width: 0; background: var(--lime); transition: width .6s }\r
    .snd { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--edge); background: var(--panel); font-size: 18px }\r
\r
    .hero { margin: 6px 0 22px }\r
    .hero h2 { font-size: clamp(30px, 6vw, 54px); font-weight: 800; letter-spacing: -1px; max-width: 16ch }\r
    .hero p { margin: 10px 0 0; max-width: 46ch; color: var(--mute); line-height: 1.55; font-size: 15px }\r
\r
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 16px }\r
\r
    .tile {\r
      text-align: left; background: var(--panel); border: 3px solid var(--edge);\r
      border-radius: 24px; padding: 18px; display: grid;\r
      grid-template-columns: 78px 1fr; gap: 6px 14px; align-items: start;\r
      transition: transform .12s, border-color .12s\r
    }\r
    .tile:hover { transform: translateY(-3px); border-color: var(--c) }\r
    .tile:active { transform: translateY(1px) }\r
\r
    .orb {\r
      width: 78px; height: 78px; border-radius: 24px; background: var(--c);\r
      display: grid; place-items: center; font-size: 38px;\r
      box-shadow: 0 5px 0 rgba(0, 0, 0, .35); grid-row: span 2\r
    }\r
    .tile h3 { font-size: 24px; font-weight: 800; align-self: end }\r
    .tile p { margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--mute); grid-column: 2 }\r
    .tile .meta {\r
      grid-column: 1/-1; display: flex; justify-content: space-between;\r
      align-items: center; font-size: 13px; margin-top: 8px; color: var(--mute)\r
    }\r
    .tag { background: var(--c); color: var(--dark); border-radius: 999px; padding: 3px 12px; font-weight: 700; font-size: 12px }\r
\r
    .badges { display: flex; gap: 9px; flex-wrap: wrap; margin-top: 26px; align-items: center }\r
    .badges b { font-family: var(--head); font-size: 20px; margin-right: 4px }\r
    .bd {\r
      display: flex; align-items: center; gap: 6px; border: 2px solid var(--amber);\r
      border-radius: 999px; padding: 5px 12px; font-size: 13px; background: var(--panel)\r
    }\r
    .bd.off { opacity: .35; filter: grayscale(1); border-style: dashed; border-color: var(--edge) }\r
\r
    .bar { display: flex; align-items: center; gap: 12px; margin-bottom: 14px }\r
    .back { border: 2px solid var(--edge); background: var(--panel); border-radius: 14px; padding: 8px 14px; font-weight: 500 }\r
    .bar h2 { font-size: 28px; font-weight: 800 }\r
\r
    .stage { max-width: 640px; margin: 0 auto }\r
    .panel { background: var(--panel); border: 3px solid var(--edge); border-radius: 22px; padding: 20px }\r
    .center { text-align: center }\r
    .row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 14px }\r
\r
    .btn {\r
      border: 0; background: var(--amber); color: var(--dark);\r
      border-radius: 16px; padding: 13px 22px; font-weight: 700; font-size: 16px;\r
      box-shadow: 0 5px 0 #b58610; transition: transform .08s, box-shadow .08s\r
    }\r
    .btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #b58610 }\r
    .btn.lime { background: var(--lime); box-shadow: 0 5px 0 #7a9a1f }\r
    .btn.lime:active { box-shadow: 0 1px 0 #7a9a1f }\r
    .btn.coral { background: var(--coral); box-shadow: 0 5px 0 #b03e2c }\r
    .btn.coral:active { box-shadow: 0 1px 0 #b03e2c }\r
    .btn.sky { background: var(--sky); box-shadow: 0 5px 0 #2f84b8 }\r
    .btn.sky:active { box-shadow: 0 1px 0 #2f84b8 }\r
    .btn.ghost { background: var(--panel2); color: var(--text); box-shadow: 0 5px 0 #0f3238 }\r
    .btn:disabled { opacity: .4; pointer-events: none }\r
\r
    .hud { display: flex; justify-content: space-between; gap: 8px; font-weight: 500; margin-bottom: 10px; font-size: 15px }\r
    .hud span { background: var(--panel); border: 2px solid var(--edge); border-radius: 12px; padding: 5px 12px }\r
\r
    .hint { text-align: center; font-size: 13px; color: var(--mute); margin: 10px 0 0; line-height: 1.5 }\r
\r
    canvas { display: block; margin: 0 auto; border: 3px solid var(--edge); border-radius: 18px; touch-action: none; max-width: 100% }\r
\r
    .qbox { background: var(--panel2); border: 3px solid var(--edge); border-radius: 18px; padding: 16px; text-align: center; margin-bottom: 12px }\r
    .pill { display: inline-block; background: var(--panel2); border: 2px solid var(--amber); border-radius: 999px; padding: 6px 16px; font-weight: 500; font-size: 14px }\r
\r
    .pop { animation: pop .35s }\r
    @keyframes pop { 0% { transform: scale(.8) } 60% { transform: scale(1.06) } 100% { transform: scale(1) } }\r
\r
    .shake { animation: shake .35s }\r
    @keyframes shake { 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }\r
\r
    .tbar { height: 14px; border-radius: 999px; background: var(--panel); border: 2px solid var(--edge); overflow: hidden; margin-bottom: 12px }\r
    .tbar i { display: block; height: 100%; width: 100%; background: var(--coral); transition: width .1s linear }\r
\r
    .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 12px }\r
    .opt {\r
      border: 0; background: var(--panel2); border-radius: 16px; padding: 16px 8px;\r
      font-family: var(--head); font-weight: 800; font-size: clamp(22px, 5.5vw, 30px);\r
      box-shadow: 0 5px 0 #0f3238; transition: transform .08s\r
    }\r
    .opt:active { transform: translateY(4px); box-shadow: 0 1px 0 #0f3238 }\r
    .opt.ok { background: var(--ok); color: #06331a }\r
    .opt.bad { background: var(--bad); color: #fff; animation: shake .3s }\r
\r
    .explain { margin-top: 14px; background: var(--panel); border: 2px solid var(--amber); border-radius: 16px; padding: 12px 14px; font-size: 14.5px; line-height: 1.55 }\r
\r
    .seq { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap }\r
    .chip {\r
      min-width: 50px; height: 58px; padding: 0 10px; border-radius: 14px;\r
      background: var(--panel); border: 3px solid var(--edge);\r
      display: grid; place-items: center; font-family: var(--head); font-weight: 800; font-size: 26px\r
    }\r
    .chip.q { background: var(--amber); color: var(--dark); border-color: var(--amber); animation: pop .5s infinite alternate }\r
\r
    .b48 {\r
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;\r
      width: min(100%, 420px); margin: 0 auto; padding: 8px;\r
      border-radius: 20px; background: #08191d; touch-action: none; user-select: none\r
    }\r
    .t48 {\r
      aspect-ratio: 1; border-radius: 12px; display: grid; place-items: center;\r
      font-family: var(--head); font-weight: 800; background: #123a41; position: relative; color: var(--dark)\r
    }\r
    .t48 small { position: absolute; bottom: 3px; font-size: 11px; font-family: var(--body); font-weight: 500; opacity: .7 }\r
    .t48.n { animation: pop .22s }\r
\r
    .flask {\r
      min-height: 130px; border: 4px solid var(--sky); border-top: 0;\r
      border-radius: 0 0 46px 46px; padding: 12px 14px;\r
      display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-content: flex-end;\r
      background: linear-gradient(transparent 15%, rgba(110, 198, 255, .22)); margin: 6px 14px 0\r
    }\r
    .atom {\r
      width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center;\r
      font-family: var(--head); font-weight: 800; font-size: 22px;\r
      border: 3px solid rgba(255, 255, 255, .75); padding: 0;\r
      box-shadow: 0 4px 0 rgba(0, 0, 0, .3)\r
    }\r
    .atom.big { width: 62px; height: 62px; font-size: 24px }\r
    .atom:active { transform: translateY(3px) }\r
\r
    .simon { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; width: min(100%, 360px); margin: 0 auto }\r
    .pd {\r
      aspect-ratio: 1; border: 0; border-radius: 30px; font-size: 48px;\r
      opacity: .5; color: rgba(0, 0, 0, .45);\r
      transition: opacity .1s, transform .1s, filter .1s;\r
      box-shadow: 0 7px 0 rgba(0, 0, 0, .35)\r
    }\r
    .pd.on { opacity: 1; transform: scale(1.05); filter: brightness(1.25) }\r
\r
    #modal { position: fixed; inset: 0; background: rgba(4, 20, 24, .8); display: none; place-items: center; padding: 18px; z-index: 20 }\r
    #modal.on { display: grid }\r
\r
    .result { max-width: 400px; width: 100%; text-align: center; animation: pop .4s }\r
    .result h2 { font-size: 34px; font-weight: 800 }\r
    .big { font-family: var(--head); font-weight: 800; font-size: 66px; line-height: 1; margin: 8px 0; color: var(--amber) }\r
    .stats { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin: 10px 0 }\r
    .stats span { background: var(--panel2); border-radius: 999px; padding: 4px 12px; font-size: 14px }\r
\r
    #toast {\r
      position: fixed; left: 50%; bottom: 24px; transform: translate(-50%, 120px);\r
      background: var(--amber); color: var(--dark); padding: 12px 20px;\r
      border-radius: 999px; font-weight: 700; z-index: 30;\r
      transition: transform .4s; max-width: 90vw; text-align: center\r
    }\r
    #toast.on { transform: translate(-50%, 0) }\r
\r
    button:focus-visible { outline: 4px solid var(--sky); outline-offset: 2px }\r
\r
    @media (prefers-reduced-motion:reduce) {\r
      * { animation: none !important; transition: none !important }\r
    }\r
  </style>\r
</head>\r
\r
<body>\r
  <div id="app">\r
    <div class="top">\r
      <div class="logo"><i>🧪</i>Học Mà Chơi<small>LAB</small></div>\r
      <div class="me">\r
        <span class="lvl" id="lvl">Cấp 1</span>\r
        <div class="xp" title="Kinh nghiệm"><i id="xpb"></i></div>\r
        <button class="snd" id="snd" aria-label="Bật tắt âm thanh">🔊</button>\r
      </div>\r
    </div>\r
    <div id="hub"></div>\r
    <div id="game" hidden>\r
      <div class="bar"><button class="back" id="back">← Về sảnh</button>\r
        <h2 id="gt"></h2>\r
      </div>\r
      <div class="stage" id="stage"></div>\r
    </div>\r
  </div>\r
  <div id="modal"></div>\r
  <div id="toast"></div>\r
\r
  <!-- ① Cấu hình API — đặt trước khi load api.js -->\r
  <script>\r
    window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';\r
    window.GAME_API_TOKEN_FN = () => localStorage.getItem('token');\r
  <\/script>\r
  <script src="api.js"><\/script>\r
  <script src="game-core.js"><\/script>\r
\r
  <script>\r
    /* ============ GAME 1: CHIM BAY QUA CỔNG ============ */\r
    function flapGame(root) {\r
      const W = Math.min(root.clientWidth, 420), H = Math.round(W * 1.4), s = H / 560;\r
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span id="cb">🔥 0</span></div><canvas id="cv"></canvas>\r
    <p class="hint">Chạm màn hình (hoặc phím cách) để vỗ cánh. Chỉ bay qua khe có đáp án đúng!</p>\`;\r
\r
      const cv = $('#cv'), ctx = fitCanvas(cv, W, H);\r
      const br = 15 * s, bx = W * .26, GY = H - 34 * s, TOP = 76 * s;\r
\r
      // Cache gradient nền + DOM ref (trước đây tạo mới mỗi frame / mỗi lần hud)\r
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);\r
      bgGrad.addColorStop(0, '#5ec2ff');\r
      bgGrad.addColorStop(1, '#d8f5ff');\r
\r
      const $sc = $('#sc'), $lv = $('#lv'), $cb = $('#cb');\r
\r
      let y = H / 2, vy = 0, ready = true, score = 0, lives = 3, combo = 0, best = 0, n = 0, q, wall, t = 0, flash = 0;\r
\r
      const clouds = Array.from({ length: 5 }, () => ({\r
        x: Math.random() * W,\r
        y: Math.random() * (H * .6) + 70 * s,\r
        r: 20 + Math.random() * 24,\r
        v: 8 + Math.random() * 14\r
      }));\r
\r
      const speed = () => (115 + Math.min(n, 15) * 4) * s;\r
\r
      function hud() {\r
        $sc.textContent = score;\r
        $lv.textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';\r
        $cb.textContent = '🔥 ' + combo;\r
      }\r
\r
      function newWall() {\r
        const m = genMath(n < 4 ? 0 : n < 10 ? 1 : 2);\r
        q = { text: m.text + ' = ?', ans: m.ans };\r
        const opts = makeOpts(m.ans, 3), zone = (GY - TOP) / 3, gh = Math.min(zone * .68, 120 * s);\r
        wall = {\r
          x: W + 20, w: 64 * s, done: false,\r
          gaps: opts.map((v, k) => {\r
            const cy = TOP + zone * k + zone / 2 + (Math.random() - .5) * zone * .16;\r
            return { v, top: cy - gh / 2, bot: cy + gh / 2, c: v === m.ans };\r
          })\r
        };\r
      }\r
\r
      function hurt() {\r
        lives--; combo = 0; sfx.bad(); flash = .3; hud();\r
        if (lives <= 0) {\r
          finish({\r
            id: 'flap', score, xp: Math.round(score / 6),\r
            lines: [\`Qua \${n} cổng đúng\`, \`Chuỗi tốt nhất \${best}\`],\r
            replay: flapGame, details: { gates: n, bestCombo: best }\r
          });\r
          return true;\r
        }\r
        ready = true; y = H / 2; vy = 0; newWall();\r
        return false;\r
      }\r
\r
      function flap() {\r
        if (ready) ready = false;\r
        vy = -430 * s;\r
        sfx.flap();\r
      }\r
\r
      cv.addEventListener('pointerdown', e => { e.preventDefault(); flap(); });\r
      onKey = e => {\r
        if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }\r
      };\r
\r
      newWall(); hud();\r
\r
      T.loop(dt => {\r
        t += dt;\r
        for (const c of clouds) { c.x -= c.v * dt; if (c.x < -60) c.x = W + 60; }\r
        if (flash > 0) flash -= dt;\r
\r
        if (ready) { y = H / 2 + Math.sin(t * 5) * 8 * s; draw(); return; }\r
\r
        vy += 1500 * s * dt; y += vy * dt;\r
        if (y < br) { y = br; vy = Math.max(vy, 0); }\r
        wall.x -= speed() * dt;\r
\r
        if (y + br > GY) { if (hurt()) return; draw(); return; }\r
\r
        if (bx + br > wall.x && bx - br < wall.x + wall.w) {\r
          if (!wall.gaps.find(g => y - br > g.top && y + br < g.bot)) {\r
            if (hurt()) return; draw(); return;\r
          }\r
        }\r
\r
        if (!wall.done && bx > wall.x + wall.w / 2) {\r
          wall.done = true;\r
          const g = wall.gaps.find(g => y > g.top && y < g.bot);\r
          if (g && g.c) {\r
            combo++; best = Math.max(best, combo); n++;\r
            score += 10 + Math.min(combo, 10) * 2;\r
            sfx.ok();\r
            if (n >= 10) S.flags.flap = true;\r
            hud();\r
          } else {\r
            if (hurt()) return; draw(); return;\r
          }\r
        }\r
\r
        if (wall.x + wall.w < -10) newWall();\r
        draw();\r
      });\r
\r
      function draw() {\r
        // nền (gradient đã cache)\r
        ctx.fillStyle = bgGrad;\r
        ctx.fillRect(0, 0, W, H);\r
\r
        // mây\r
        ctx.fillStyle = 'rgba(255,255,255,.85)';\r
        for (const c of clouds) {\r
          ctx.beginPath();\r
          ctx.arc(c.x, c.y, c.r, 0, 7);\r
          ctx.arc(c.x + c.r * .9, c.y + 4, c.r * .75, 0, 7);\r
          ctx.arc(c.x - c.r * .9, c.y + 6, c.r * .65, 0, 7);\r
          ctx.fill();\r
        }\r
\r
        // cổng\r
        const segs = [];\r
        let prev = 0;\r
        for (const g of wall.gaps) { segs.push([prev, g.top]); prev = g.bot; }\r
        segs.push([prev, GY]);\r
\r
        ctx.strokeStyle = '#14683b'; ctx.lineWidth = 3;\r
        for (const [a, b] of segs) {\r
          if (b - a <= 0) continue;\r
          ctx.fillStyle = '#2fbf71';\r
          ctx.beginPath(); ctx.roundRect(wall.x, a - 6, wall.w, b - a + 12, 8); ctx.fill(); ctx.stroke();\r
          ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(wall.x + 8, a, 7, b - a);\r
        }\r
\r
        for (const g of wall.gaps) {\r
          const cy = (g.top + g.bot) / 2;\r
          ctx.fillStyle = 'rgba(12,42,48,.78)';\r
          ctx.beginPath(); ctx.roundRect(wall.x + 2, cy - 16 * s, wall.w - 4, 32 * s, 10); ctx.fill();\r
          ctx.fillStyle = '#fff';\r
          ctx.font = \`800 \${Math.round(22 * s)}px Baloo 2,system-ui,sans-serif\`;\r
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
          ctx.fillText(g.v, wall.x + wall.w / 2, cy + 1);\r
        }\r
\r
        // đất\r
        ctx.fillStyle = '#d9a441'; ctx.fillRect(0, GY, W, H - GY);\r
        ctx.fillStyle = '#4caf50'; ctx.fillRect(0, GY, W, 8 * s);\r
\r
        // chim\r
        ctx.save();\r
        ctx.translate(bx, y);\r
        ctx.rotate(Math.max(-.5, Math.min(.9, vy / (700 * s))));\r
        ctx.fillStyle = '#ffc233'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 3;\r
        ctx.beginPath(); ctx.arc(0, 0, br, 0, 7); ctx.fill(); ctx.stroke();\r
        ctx.fillStyle = '#ff9a3c';\r
        ctx.beginPath(); ctx.ellipse(-br * .3, br * .15 + Math.sin(t * 25) * 3, br * .55, br * .32, -.3, 0, 7); ctx.fill();\r
        ctx.fillStyle = '#fff';\r
        ctx.beginPath(); ctx.arc(br * .35, -br * .3, br * .34, 0, 7); ctx.fill();\r
        ctx.fillStyle = '#0b2227';\r
        ctx.beginPath(); ctx.arc(br * .45, -br * .3, br * .15, 0, 7); ctx.fill();\r
        ctx.fillStyle = '#ff6f59';\r
        ctx.beginPath(); ctx.moveTo(br * .8, 0); ctx.lineTo(br * 1.5, br * .15); ctx.lineTo(br * .8, br * .4); ctx.fill();\r
        ctx.restore();\r
\r
        // câu hỏi\r
        ctx.fillStyle = 'rgba(12,42,48,.88)';\r
        ctx.beginPath(); ctx.roundRect(12, 10, W - 24, 54 * s + 6, 16); ctx.fill();\r
        ctx.fillStyle = '#fff';\r
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
        let fs = 34;\r
        do {\r
          ctx.font = \`800 \${fs}px Baloo 2,system-ui,sans-serif\`;\r
          fs--;\r
        } while (ctx.measureText(q.text).width > W - 60 && fs > 14);\r
        ctx.fillText(q.text, W / 2, 10 + (54 * s + 6) / 2);\r
\r
        if (ready) {\r
          ctx.fillStyle = 'rgba(12,42,48,.7)';\r
          ctx.beginPath(); ctx.roundRect(W / 2 - 100, H / 2 + 40 * s, 200, 40, 20); ctx.fill();\r
          ctx.fillStyle = '#ffc233';\r
          ctx.font = '700 16px Lexend,system-ui,sans-serif';\r
          ctx.fillText('Chạm để bay', W / 2, H / 2 + 40 * s + 21);\r
        }\r
        if (flash > 0) {\r
          ctx.fillStyle = \`rgba(255,93,108,\${flash * 1.3})\`;\r
          ctx.fillRect(0, 0, W, H);\r
        }\r
      }\r
    }\r
\r
    /* ============ GAME 2: 2048 LŨY THỪA ============ */\r
    function game2048(root) {\r
      let b = Array(16).fill(0), score = 0, over = false, newIdx = -1;\r
\r
      const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';\r
      const sup = k => String(k).split('').map(d => SUP[+d]).join('');\r
      const PAL = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#b5d8ff', '#8fb8ff', '#c3a6ff', '#ff9de2', '#ffd166', '#ffc233'];\r
\r
      function add() {\r
        const empty = [];\r
        for (let i = 0; i < 16; i++) if (!b[i]) empty.push(i);\r
        if (!empty.length) return;\r
        const p = empty[rnd(0, empty.length - 1)];\r
        b[p] = Math.random() < .9 ? 2 : 4;\r
        newIdx = p;\r
      }\r
\r
      function slide(line) {\r
        const a = [];\r
        for (const v of line) if (v) a.push(v);\r
        let gain = 0;\r
        for (let i = 0; i < a.length - 1; i++) {\r
          if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1); }\r
        }\r
        while (a.length < 4) a.push(0);\r
        return { a, gain };\r
      }\r
\r
      function canMove() {\r
        if (b.includes(0)) return true;\r
        for (let r = 0; r < 4; r++) {\r
          for (let c = 0; c < 4; c++) {\r
            const v = b[r * 4 + c];\r
            if ((c < 3 && b[r * 4 + c + 1] === v) || (r < 3 && b[(r + 1) * 4 + c] === v)) return true;\r
          }\r
        }\r
        return false;\r
      }\r
\r
      function move(dir) {\r
        if (over) return;\r
        let moved = false, gain = 0;\r
        const nb = b.slice();\r
        for (let k = 0; k < 4; k++) {\r
          const idx = [0, 1, 2, 3].map(j => dir < 2 ? k * 4 + j : j * 4 + k);\r
          if (dir % 2 === 1) idx.reverse();\r
          const { a, gain: g } = slide(idx.map(i => b[i]));\r
          idx.forEach((i, j) => { if (nb[i] !== a[j]) moved = true; nb[i] = a[j]; });\r
          gain += g;\r
        }\r
        if (!moved) return;\r
        b = nb; score += gain; add(); sfx.tick(); render();\r
        if (Math.max(...b) >= 256) S.flags.t256 = true;\r
        if (!canMove()) { over = true; T.set(end, 900); }\r
      }\r
\r
      function end() {\r
        const mx = Math.max(...b);\r
        finish({\r
          id: 'g2048', score,\r
          xp: Math.min(80, Math.round(score / 25)) + Math.round(Math.log2(mx)) * 2,\r
          lines: [\`Ô lớn nhất \${mx} = 2\${sup(Math.round(Math.log2(mx)))}\`],\r
          replay: game2048, details: { maxTile: mx }\r
        });\r
      }\r
\r
      function render() {\r
        $sc.textContent = score;\r
        let html = '';\r
        for (let i = 0; i < 16; i++) {\r
          const v = b[i];\r
          if (!v) { html += '<div class="t48"></div>'; continue; }\r
          const k = Math.round(Math.log2(v));\r
          const fs = v < 100 ? 34 : v < 1000 ? 28 : v < 10000 ? 22 : 18;\r
          html += \`<div class="t48 \${i === newIdx ? 'n' : ''}" style="background:\${PAL[Math.min(k - 1, PAL.length - 1)]};font-size:\${fs}px">\${v}<small>2\${sup(k)}</small></div>\`;\r
        }\r
        $bd.innerHTML = html;\r
        newIdx = -1;\r
      }\r
\r
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span>Gộp hai ô giống nhau</span></div>\r
    <div class="b48" id="bd"></div>\r
    <p class="hint">Vuốt hoặc dùng phím mũi tên. Mỗi ô ghi thêm dạng lũy thừa của 2 ở góc dưới.</p>\r
    <div class="row"><button class="btn ghost" id="stop">Kết thúc &amp; nhận XP</button></div>\`;\r
\r
      const $sc = $('#sc'), $bd = $('#bd');\r
      add(); add(); render();\r
\r
      onKey = e => {\r
        const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key];\r
        if (m !== undefined) { e.preventDefault(); move(m); }\r
      };\r
\r
      let sx, sy;\r
      $bd.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });\r
      $bd.addEventListener('touchend', e => {\r
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;\r
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;\r
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);\r
      });\r
\r
      let px, py;\r
      $bd.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; } });\r
      $bd.addEventListener('pointerup', e => {\r
        if (e.pointerType !== 'mouse' || px === undefined) return;\r
        const dx = e.clientX - px, dy = e.clientY - py; px = undefined;\r
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;\r
        if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);\r
      });\r
\r
      root.onclick = e => {\r
        if (e.target.closest('#stop') && !over) { over = true; end(); }\r
      };\r
    }\r
\r
    /* ============ GAME 3: NHÀ HÓA HỌC NHÍ ============ */\r
    function chemGame(root) {\r
      const ATOMS = [\r
        ['H', '#eaf0ff', '#0b2227'], ['O', '#ff6f59', '#0b2227'], ['C', '#3d4a55', '#ffffff'],\r
        ['N', '#6ec6ff', '#0b2227'], ['Na', '#b18cff', '#0b2227'], ['Cl', '#b7e34a', '#0b2227']\r
      ];\r
      const MOLS = [\r
        { name: 'Nước', f: { H: 2, O: 1 }, s: 'H₂O' },\r
        { name: 'Khí cacbonic', f: { C: 1, O: 2 }, s: 'CO₂' },\r
        { name: 'Khí metan (khí biogas)', f: { C: 1, H: 4 }, s: 'CH₄' },\r
        { name: 'Khí amoniac', f: { N: 1, H: 3 }, s: 'NH₃' },\r
        { name: 'Muối ăn', f: { Na: 1, Cl: 1 }, s: 'NaCl' },\r
        { name: 'Axit clohiđric', f: { H: 1, Cl: 1 }, s: 'HCl' },\r
        { name: 'Khí oxi', f: { O: 2 }, s: 'O₂' },\r
        { name: 'Khí hiđro', f: { H: 2 }, s: 'H₂' },\r
        { name: 'Hiđro peroxit (nước oxi già)', f: { H: 2, O: 2 }, s: 'H₂O₂' },\r
        { name: 'Khí nitơ', f: { N: 2 }, s: 'N₂' },\r
        { name: 'Khí cacbon monoxit', f: { C: 1, O: 1 }, s: 'CO' }\r
      ];\r
\r
      const list = shuffle(MOLS).slice(0, 8);\r
      const col = Object.fromEntries(ATOMS.map(a => [a[0], a]));\r
\r
      let i = 0, score = 0, solved = 0, wrong = 0, totalWrong = 0, flask = [], busy = false;\r
\r
      const total = m => Object.values(m.f).reduce((a, b) => a + b, 0);\r
      const chip = (a, k) => \`<button class="atom" data-r="\${k}" style="background:\${col[a][1]};color:\${col[a][2]}" aria-label="Bỏ \${a}">\${a}</button>\`;\r
\r
      function render(msg) {\r
        const m = list[i];\r
        root.innerHTML = \`<div class="hud"><span>Chất <b>\${i + 1}/8</b></span><span>⭐ <b>\${score}</b></span><span>\${wrong < 3 ? '❤️'.repeat(3 - wrong) : '💔'}</span></div>\r
      <div class="qbox"><small style="color:var(--mute)">Hãy tạo ra</small><br><b style="font-family:var(--head);font-size:28px">\${m.name}</b>\r
      \${wrong >= 1 ? \`<br><span class="pill" style="margin-top:8px">Gợi ý: có tất cả \${total(m)} nguyên tử</span>\` : ''}</div>\r
      <div class="flask" id="fl">\${flask.map(chip).join('') || '<span class="hint">Chạm nguyên tử bên dưới để thả vào bình</span>'}</div>\r
      <div class="row atoms">\${ATOMS.map(([s, bg, fg]) => \`<button class="atom big" data-a="\${s}" style="background:\${bg};color:\${fg}" aria-label="Nguyên tử \${s}">\${s}</button>\`).join('')}</div>\r
      \${msg || \`<div class="row"><button class="btn ghost" data-x="clear">Đổ đi</button><button class="btn" data-x="mix">🧪 Trộn!</button></div><p class="hint">Chạm nguyên tử trong bình để bỏ ra.</p>\`}\`;\r
      }\r
\r
      function next() {\r
        i++;\r
        if (i >= 8) {\r
          if (totalWrong === 0) S.flags.chem = true;\r
          finish({\r
            id: 'chem', score,\r
            xp: Math.round(score / 3) + solved * 2,\r
            lines: [\`Tạo đúng \${solved}/8 chất\`, \`\${totalWrong} lần sai\`],\r
            replay: chemGame, details: { solved, totalWrong }\r
          });\r
          return;\r
        }\r
        flask = []; wrong = 0; busy = false; render();\r
      }\r
\r
      function mix() {\r
        const m = list[i];\r
        const cnt = {};\r
        for (const a of flask) cnt[a] = (cnt[a] || 0) + 1;\r
        const keys = new Set([...Object.keys(cnt), ...Object.keys(m.f)]);\r
        let good = true;\r
        for (const k of keys) if ((cnt[k] || 0) !== (m.f[k] || 0)) { good = false; break; }\r
        busy = true;\r
\r
        if (good) {\r
          const pts = Math.max(8, 20 - wrong * 6);\r
          score += pts; solved++; sfx.ok();\r
          render(\`<div class="qbox pop" style="margin-top:14px"><b style="font-family:var(--head);font-size:30px;color:var(--lime)">\${m.s}</b><br>Chính xác! +\${pts} điểm</div>\`);\r
          T.set(next, 1600);\r
        } else {\r
          wrong++; totalWrong++; sfx.bad();\r
          if (wrong >= 3) {\r
            render(\`<div class="qbox" style="margin-top:14px">Công thức đúng là <b style="font-family:var(--head);font-size:28px;color:var(--amber)">\${m.s}</b></div>\`);\r
            T.set(next, 2200);\r
          } else {\r
            busy = false; render();\r
            $('#fl').classList.add('shake');\r
          }\r
        }\r
      }\r
\r
      root.onclick = e => {\r
        if (busy) return;\r
        const a = e.target.closest('[data-a]');\r
        const r = e.target.closest('[data-r]');\r
        const x = e.target.closest('[data-x]');\r
        if (a) {\r
          if (flask.length < 6) { flask.push(a.dataset.a); sfx.tick(); render(); }\r
        } else if (r) {\r
          flask.splice(+r.dataset.r, 1); render();\r
        } else if (x) {\r
          if (x.dataset.x === 'clear') { flask = []; render(); }\r
          else if (flask.length) mix();\r
          else toast('Hãy thả nguyên tử vào bình trước');\r
        }\r
      };\r
\r
      render();\r
    }\r
\r
    /* ============ GAME 4: ĐỒNG HỒ THỜI GIAN ============ */\r
    function clockGame(root) {\r
      const fmt = (h, m) => \`\${h}:\${String(m).padStart(2, '0')}\`;\r
      const qs = Array.from({ length: 10 }, (_, i) => {\r
        const h = rnd(1, 12);\r
        const m = i < 4 ? [0, 30][rnd(0, 1)] : i < 7 ? [0, 15, 30, 45][rnd(0, 3)] : rnd(0, 11) * 5;\r
        return { h, m };\r
      });\r
\r
      function options(h, m) {\r
        const set = new Set([fmt(h, m)]);\r
        const c = [\r
          fmt(h, (m + 30) % 60),\r
          fmt(h === 12 ? 1 : h + 1, m),\r
          fmt(h === 1 ? 12 : h - 1, m),\r
          fmt(h, (m + 5) % 60),\r
          fmt(h, (m + 55) % 60),\r
          fmt(h, (m + 15) % 60),\r
          fmt(m / 5 || 12, (h % 12) * 5)\r
        ];\r
        for (const x of shuffle(c)) { if (set.size < 4) set.add(x); }\r
        while (set.size < 4) set.add(fmt(rnd(1, 12), rnd(0, 11) * 5));\r
        return shuffle([...set]);\r
      }\r
\r
      function draw(cv, h, m) {\r
        const S_ = 240, ctx = fitCanvas(cv, S_, S_), c = S_ / 2, R = 108;\r
\r
        ctx.fillStyle = '#fff6df'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 8;\r
        ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill(); ctx.stroke();\r
\r
        for (let k = 0; k < 60; k++) {\r
          const a = k * 6 * Math.PI / 180, l = k % 5 ? 5 : 11;\r
          ctx.lineWidth = k % 5 ? 1.5 : 3;\r
          ctx.strokeStyle = '#0b2227';\r
          ctx.beginPath();\r
          ctx.moveTo(c + Math.sin(a) * (R - 6), c - Math.cos(a) * (R - 6));\r
          ctx.lineTo(c + Math.sin(a) * (R - 6 - l), c - Math.cos(a) * (R - 6 - l));\r
          ctx.stroke();\r
        }\r
\r
        ctx.fillStyle = '#0b2227';\r
        ctx.font = '800 22px Baloo 2,system-ui,sans-serif';\r
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
        for (let k = 1; k <= 12; k++) {\r
          const a = k * 30 * Math.PI / 180;\r
          ctx.fillText(k, c + Math.sin(a) * R * .74, c - Math.cos(a) * R * .74 + 1);\r
        }\r
\r
        const hand = (ang, len, w, colr) => {\r
          ctx.strokeStyle = colr; ctx.lineWidth = w; ctx.lineCap = 'round';\r
          ctx.beginPath(); ctx.moveTo(c, c);\r
          ctx.lineTo(c + Math.sin(ang) * len, c - Math.cos(ang) * len);\r
          ctx.stroke();\r
        };\r
        hand(((h % 12) + m / 60) * 30 * Math.PI / 180, R * .47, 9, '#15434b');\r
        hand(m * 6 * Math.PI / 180, R * .74, 5, '#ff6f59');\r
\r
        ctx.fillStyle = '#0b2227';\r
        ctx.beginPath(); ctx.arc(c, c, 7, 0, 7); ctx.fill();\r
      }\r
\r
      root.innerHTML = '';\r
      runMC(root, {\r
        id: 'clock', replay: clockGame, count: 10, secs: 15,\r
        make(i) {\r
          const { h, m } = qs[i], ans = fmt(h, m);\r
          return {\r
            html: \`<canvas id="ck"></canvas><div class="hint" style="margin-top:10px">Đồng hồ đang chỉ mấy giờ? (kim ngắn chỉ giờ, kim dài chỉ phút)</div>\`,\r
            after() { draw($('#ck'), h, m); },\r
            opts: options(h, m), ans,\r
            exp: m === 0\r
              ? \`Kim dài chỉ số 12 nên là \${h} giờ đúng: \${ans}.\`\r
              : \`Kim ngắn chỉ gần số \${h} nên là \${h} giờ. Kim dài chỉ số \${m / 5} nên là \${m} phút. Vậy là \${ans}.\`\r
          };\r
        },\r
        onEnd(r) { if (r === 10) S.flags.clock = true; },\r
        details(right) { return { right }; }\r
      });\r
    }\r
\r
    /* ============ GAME 5: QUY LUẬT SỐ ============ */\r
    function patternGame(root) {\r
      function genSeq(n) {\r
        const t = n < 3 ? rnd(0, 1) : n < 7 ? rnd(0, 4) : rnd(0, 6);\r
        let seq = [], rule = '';\r
\r
        if (t === 0) {\r
          const a = rnd(1, 20), d = rnd(2, 9);\r
          seq = [...Array(6)].map((_, i) => a + d * i);\r
          rule = \`Mỗi số bằng số đứng trước cộng \${d}.\`;\r
        } else if (t === 1) {\r
          const d = rnd(2, 8), a = rnd(40, 70);\r
          seq = [...Array(6)].map((_, i) => a - d * i);\r
          rule = \`Mỗi số bằng số đứng trước trừ \${d}.\`;\r
        } else if (t === 2) {\r
          const r = rnd(2, 3), a = rnd(1, 3);\r
          seq = [...Array(6)].map((_, i) => a * r ** i);\r
          rule = \`Mỗi số bằng số đứng trước nhân \${r}.\`;\r
        } else if (t === 3) {\r
          const o = rnd(0, 3);\r
          seq = [...Array(6)].map((_, i) => (i + 1) ** 2 + o);\r
          rule = o ? \`Đây là dãy số chính phương 1, 4, 9, 16, ... cộng thêm \${o}.\` : 'Đây là dãy số chính phương: 1², 2², 3², 4², ...';\r
        } else if (t === 4) {\r
          const a = rnd(1, 5), d0 = rnd(1, 3);\r
          let v = a; seq = [v];\r
          for (let i = 1; i < 6; i++) { v += d0 + i - 1; seq.push(v); }\r
          rule = \`Hiệu hai số liên tiếp tăng dần: +\${d0}, +\${d0 + 1}, +\${d0 + 2}, ...\`;\r
        } else if (t === 5) {\r
          const a = rnd(1, 4), b = rnd(2, 6);\r
          seq = [a, b];\r
          for (let i = 2; i < 6; i++) seq.push(seq[i - 1] + seq[i - 2]);\r
          rule = 'Mỗi số bằng tổng của hai số đứng ngay trước nó.';\r
        } else {\r
          const a = rnd(20, 30), p = rnd(4, 9), m = rnd(1, p - 2);\r
          seq = [a];\r
          for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 ? p : -m));\r
          rule = \`Luân phiên cộng \${p} rồi trừ \${m}.\`;\r
        }\r
        return { seq, h: rnd(2, 5), rule };\r
      }\r
\r
      root.innerHTML = '';\r
      runMC(root, {\r
        id: 'pattern', replay: patternGame, count: 10, secs: 20,\r
        make(i) {\r
          const { seq, h, rule } = genSeq(i);\r
          const ans = seq[h];\r
          return {\r
            html: \`<div class="hint" style="margin:0 0 12px">Tìm số còn thiếu theo quy luật</div>\r
          <div class="seq">\${seq.map((v, k) => \`<div class="chip \${k === h ? 'q' : ''}">\${k === h ? '?' : v}</div>\`).join('')}</div>\`,\r
            opts: makeOpts(ans, 4), ans,\r
            exp: \`\${rule} Số cần tìm là \${ans}.\`\r
          };\r
        },\r
        onEnd(r) { if (r === 10) S.flags.pat = true; },\r
        details(right) { return { right }; }\r
      });\r
    }\r
\r
    /* ============ GAME 6: NHỚ DÃY MÀU ============ */\r
    function simonGame(root) {\r
      const PADS = [\r
        ['var(--sky)', '▲', 392],\r
        ['var(--coral)', '●', 494],\r
        ['var(--amber)', '■', 587],\r
        ['var(--lime)', '★', 698]\r
      ];\r
      let seq = [], step = 0, phase = 'show', score = 0;\r
\r
      root.innerHTML = \`<div class="hud"><span>Vòng <b id="rd">1</b></span><span>⭐ <b id="sc">0</b></span></div>\r
    <div class="qbox" id="st" style="font-family:var(--head);font-size:24px;font-weight:800">Sẵn sàng?</div>\r
    <div class="simon">\${PADS.map((p, i) => \`<button class="pd" data-p="\${i}" style="background:\${p[0]}" aria-label="Ô \${i + 1}">\${p[1]}</button>\`).join('')}</div>\r
    <p class="hint">Xem dãy sáng lên, rồi bấm lại đúng thứ tự. Mỗi vòng thêm một bước.</p>\`;\r
\r
      const pads = [...root.querySelectorAll('.pd')];\r
      const $rd = $('#rd'), $sc = $('#sc'), $st = $('#st');\r
\r
      const flash = (i, ms) => {\r
        pads[i].classList.add('on');\r
        beep(PADS[i][2], ms / 1000, 'triangle', .09);\r
        T.set(() => pads[i].classList.remove('on'), ms);\r
      };\r
\r
      function round() {\r
        seq.push(rnd(0, 3));\r
        step = 0; phase = 'show';\r
        $rd.textContent = seq.length;\r
        $st.textContent = 'Xem kỹ...';\r
\r
        const gap = Math.max(230, 520 - seq.length * 22);\r
        const on = Math.max(160, gap * .6);\r
        seq.forEach((p, k) => T.set(() => flash(p, on), 700 + k * gap));\r
        T.set(() => { phase = 'input'; $st.textContent = 'Đến lượt bạn!'; }, 700 + seq.length * gap);\r
      }\r
\r
      root.onclick = e => {\r
        const b = e.target.closest('[data-p]');\r
        if (!b || phase !== 'input') return;\r
        const i = +b.dataset.p;\r
        flash(i, 180);\r
        if (i !== seq[step]) {\r
          phase = 'over'; sfx.bad();\r
          $st.textContent = 'Sai rồi!';\r
          const rounds = seq.length - 1;\r
          if (rounds >= 8) S.flags.simon = true;\r
          T.set(() => finish({\r
            id: 'simon', score,\r
            xp: Math.round(score / 4) + rounds,\r
            lines: [\`Nhớ được \${rounds} bước\`],\r
            replay: simonGame, details: { rounds }\r
          }), 900);\r
          return;\r
        }\r
        step++;\r
        if (step === seq.length) {\r
          phase = 'wait';\r
          score += seq.length * 10;\r
          $sc.textContent = score;\r
          $st.textContent = 'Chính xác!';\r
          T.set(sfx.ok, 200);\r
          T.set(round, 1100);\r
        }\r
      };\r
\r
      T.set(round, 700);\r
    }\r
\r
    /* ============ Khởi động ============ */\r
    const GAMES = [\r
      { id: 'flap', name: 'Chim Bay Qua Cổng', tag: 'Toán · Phản xạ', c: 'var(--amber)', icon: '🐦', desc: 'Vỗ cánh bay qua đúng khe có đáp án của phép tính. Chạm sai là mất tim.', fn: flapGame },\r
      { id: 'g2048', name: '2048 Lũy Thừa', tag: 'Logic · Lũy thừa', c: 'var(--violet)', icon: '🔢', desc: 'Gộp các ô giống nhau để đạt số lớn, mỗi ô hiện thêm dạng 2 mũ k.', fn: game2048 },\r
      { id: 'chem', name: 'Nhà Hóa Học Nhí', tag: 'Hóa học', c: 'var(--lime)', icon: '⚗️', desc: 'Ghép các nguyên tử H, O, C, N, Na, Cl thành đúng phân tử theo tên chất.', fn: chemGame },\r
      { id: 'clock', name: 'Đồng Hồ Thời Gian', tag: 'Toán · Xem giờ', c: 'var(--coral)', icon: '🕒', desc: 'Nhìn đồng hồ kim và chọn đúng giờ. Từ giờ chẵn đến từng 5 phút.', fn: clockGame },\r
      { id: 'pattern', name: 'Thám Tử Quy Luật', tag: 'Toán · Tư duy', c: 'var(--sky)', icon: '🕵️', desc: 'Tìm số còn thiếu trong dãy: cộng, nhân, chính phương, Fibonacci và hơn nữa.', fn: patternGame },\r
      { id: 'simon', name: 'Nhớ Dãy Màu', tag: 'Trí nhớ', c: '#ff9de2', icon: '🎵', desc: 'Ghi nhớ dãy ô sáng và âm thanh, rồi lặp lại đúng thứ tự. Mỗi vòng dài thêm.', fn: simonGame },\r
    ];\r
\r
    initCore({\r
      games: GAMES,\r
      storageKey: 'hmc_game2',\r
      hubTitle: 'Phòng thí nghiệm trò chơi.',\r
      hubDesc: 'Sáu thử thách mới: Toán, Hóa học, Logic và Trí nhớ. Chơi để kiếm XP, lên cấp và mở huy hiệu.',\r
      badges: [\r
        { id: 'first', n: 'Khởi động', i: '🌱', ok: () => S.games >= 1 },\r
        { id: 'all', n: 'Thử đủ 6 game', i: '🧭', ok: () => S.played.size >= 6 },\r
        { id: 'flap', n: 'Chim bay 10 cổng', i: '🐦', ok: () => S.flags.flap },\r
        { id: 't256', n: 'Đạt ô 256', i: '🔢', ok: () => S.flags.t256 },\r
        { id: 'chem', n: 'Nhà hóa học', i: '⚗️', ok: () => S.flags.chem },\r
        { id: 'clock', n: 'Xem giờ 10/10', i: '🕒', ok: () => S.flags.clock },\r
        { id: 'pat', n: 'Thám tử quy luật', i: '🕵️', ok: () => S.flags.pat },\r
        { id: 'simon', n: 'Nhớ 8 vòng', i: '🧠', ok: () => S.flags.simon },\r
        { id: 'lv3', n: 'Đạt cấp 3', i: '⭐', ok: () => lvl() >= 3 },\r
      ],\r
    });\r
  <\/script>\r
</body>\r
\r
</html>`,c=n(),l={id:`hmc-game2`,code:`hmc-game2`,name:`Học Mà Chơi LAB`,title:`Học Mà Chơi LAB`,subject:`Nhiều môn`};function u(){let{user:e,token:t}=r(),n=e?{user:e,token:t}:null,[u,d]=(0,o.useState)(0),f=(0,o.useCallback)(()=>i(`/`),[]);return(0,c.jsx)(`div`,{className:`fixed inset-0 bg-[#0c2a30]`,children:(0,c.jsx)(a,{htmlContent:s,game:l,questions:[],playerName:e?.fullName||e?.username||`An Nhiên`,playMode:`solo`,userAuth:n,onFinish:()=>{},onQuit:f,onStateUpdate:()=>{}},`hmc-game2-${u}`)})}export{u as default};