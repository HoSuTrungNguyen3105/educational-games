import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{U as r,bt as i}from"./index-pMGc089C.js";import a from"./HtmlGameLoader-DkoL27sZ.js";var o=e(t(),1),s=`<!DOCTYPE html>\r
<html lang="vi">\r
\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\r
    <title>Học Mà Chơi Lab</title>\r
    <link rel="preconnect" href="https://fonts.googleapis.com">\r
    <link\r
        href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Lexend:wght@400;500;700&display=swap"\r
        rel="stylesheet">\r
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
        * {\r
            box-sizing: border-box;\r
            -webkit-tap-highlight-color: transparent\r
        }\r
\r
        html,\r
        body {\r
            margin: 0\r
        }\r
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
        #app {\r
            max-width: 1000px;\r
            margin: 0 auto;\r
            padding: 14px 14px 60px\r
        }\r
\r
        button {\r
            font-family: inherit;\r
            color: inherit;\r
            cursor: pointer\r
        }\r
\r
        h1,\r
        h2,\r
        h3 {\r
            font-family: var(--head);\r
            margin: 0;\r
            line-height: 1.1\r
        }\r
\r
        .top {\r
            display: flex;\r
            align-items: center;\r
            gap: 12px;\r
            flex-wrap: wrap;\r
            margin-bottom: 18px\r
        }\r
\r
        .logo {\r
            font-family: var(--head);\r
            font-weight: 800;\r
            font-size: 28px;\r
            display: flex;\r
            align-items: center;\r
            gap: 10px\r
        }\r
\r
        .logo i {\r
            font-style: normal;\r
            display: grid;\r
            place-items: center;\r
            width: 44px;\r
            height: 44px;\r
            background: var(--lime);\r
            border-radius: 14px;\r
            box-shadow: 0 4px 0 #7a9a1f;\r
            font-size: 22px;\r
            transform: rotate(-6deg)\r
        }\r
\r
        .logo small {\r
            font-size: 13px;\r
            background: var(--coral);\r
            color: #fff;\r
            border-radius: 8px;\r
            padding: 2px 8px\r
        }\r
\r
        .me {\r
            margin-left: auto;\r
            display: flex;\r
            align-items: center;\r
            gap: 10px\r
        }\r
\r
        .lvl {\r
            font-family: var(--head);\r
            font-weight: 800;\r
            background: var(--amber);\r
            color: var(--dark);\r
            border-radius: 999px;\r
            padding: 4px 14px;\r
            font-size: 17px\r
        }\r
\r
        .xp {\r
            width: 120px;\r
            height: 14px;\r
            border-radius: 999px;\r
            background: var(--panel);\r
            overflow: hidden;\r
            border: 2px solid var(--edge)\r
        }\r
\r
        .xp i {\r
            display: block;\r
            height: 100%;\r
            width: 0;\r
            background: var(--lime);\r
            transition: width .6s\r
        }\r
\r
        .snd {\r
            width: 40px;\r
            height: 40px;\r
            border-radius: 50%;\r
            border: 2px solid var(--edge);\r
            background: var(--panel);\r
            font-size: 18px\r
        }\r
\r
        .hero {\r
            margin: 6px 0 22px\r
        }\r
\r
        .hero h2 {\r
            font-size: clamp(30px, 6vw, 54px);\r
            font-weight: 800;\r
            letter-spacing: -1px;\r
            max-width: 16ch\r
        }\r
\r
        .hero p {\r
            margin: 10px 0 0;\r
            max-width: 46ch;\r
            color: var(--mute);\r
            line-height: 1.55;\r
            font-size: 15px\r
        }\r
\r
        .grid {\r
            display: grid;\r
            grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));\r
            gap: 16px\r
        }\r
\r
        .tile {\r
            text-align: left;\r
            background: var(--panel);\r
            border: 3px solid var(--edge);\r
            border-radius: 24px;\r
            padding: 18px;\r
            display: grid;\r
            grid-template-columns: 78px 1fr;\r
            gap: 6px 14px;\r
            align-items: start;\r
            transition: transform .12s, border-color .12s\r
        }\r
\r
        .tile:hover {\r
            transform: translateY(-3px);\r
            border-color: var(--c)\r
        }\r
\r
        .tile:active {\r
            transform: translateY(1px)\r
        }\r
\r
        .orb {\r
            width: 78px;\r
            height: 78px;\r
            border-radius: 24px;\r
            background: var(--c);\r
            display: grid;\r
            place-items: center;\r
            font-size: 38px;\r
            box-shadow: 0 5px 0 rgba(0, 0, 0, .35);\r
            grid-row: span 2\r
        }\r
\r
        .tile h3 {\r
            font-size: 24px;\r
            font-weight: 800;\r
            align-self: end\r
        }\r
\r
        .tile p {\r
            margin: 0;\r
            font-size: 13.5px;\r
            line-height: 1.5;\r
            color: var(--mute);\r
            grid-column: 2\r
        }\r
\r
        .tile .meta {\r
            grid-column: 1/-1;\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            font-size: 13px;\r
            margin-top: 8px;\r
            color: var(--mute)\r
        }\r
\r
        .tag {\r
            background: var(--c);\r
            color: var(--dark);\r
            border-radius: 999px;\r
            padding: 3px 12px;\r
            font-weight: 700;\r
            font-size: 12px\r
        }\r
\r
        .badges {\r
            display: flex;\r
            gap: 9px;\r
            flex-wrap: wrap;\r
            margin-top: 26px;\r
            align-items: center\r
        }\r
\r
        .badges b {\r
            font-family: var(--head);\r
            font-size: 20px;\r
            margin-right: 4px\r
        }\r
\r
        .bd {\r
            display: flex;\r
            align-items: center;\r
            gap: 6px;\r
            border: 2px solid var(--amber);\r
            border-radius: 999px;\r
            padding: 5px 12px;\r
            font-size: 13px;\r
            background: var(--panel)\r
        }\r
\r
        .bd.off {\r
            opacity: .35;\r
            filter: grayscale(1);\r
            border-style: dashed;\r
            border-color: var(--edge)\r
        }\r
\r
        .bar {\r
            display: flex;\r
            align-items: center;\r
            gap: 12px;\r
            margin-bottom: 14px\r
        }\r
\r
        .back {\r
            border: 2px solid var(--edge);\r
            background: var(--panel);\r
            border-radius: 14px;\r
            padding: 8px 14px;\r
            font-weight: 500\r
        }\r
\r
        .bar h2 {\r
            font-size: 28px;\r
            font-weight: 800\r
        }\r
\r
        .stage {\r
            max-width: 640px;\r
            margin: 0 auto\r
        }\r
\r
        .panel {\r
            background: var(--panel);\r
            border: 3px solid var(--edge);\r
            border-radius: 22px;\r
            padding: 20px\r
        }\r
\r
        .center {\r
            text-align: center\r
        }\r
\r
        .row {\r
            display: flex;\r
            gap: 10px;\r
            flex-wrap: wrap;\r
            justify-content: center;\r
            margin-top: 14px\r
        }\r
\r
        .btn {\r
            border: 0;\r
            background: var(--amber);\r
            color: var(--dark);\r
            border-radius: 16px;\r
            padding: 13px 22px;\r
            font-weight: 700;\r
            font-size: 16px;\r
            box-shadow: 0 5px 0 #b58610;\r
            transition: transform .08s, box-shadow .08s\r
        }\r
\r
        .btn:active {\r
            transform: translateY(4px);\r
            box-shadow: 0 1px 0 #b58610\r
        }\r
\r
        .btn.lime {\r
            background: var(--lime);\r
            box-shadow: 0 5px 0 #7a9a1f\r
        }\r
\r
        .btn.lime:active {\r
            box-shadow: 0 1px 0 #7a9a1f\r
        }\r
\r
        .btn.coral {\r
            background: var(--coral);\r
            box-shadow: 0 5px 0 #b03e2c\r
        }\r
\r
        .btn.coral:active {\r
            box-shadow: 0 1px 0 #b03e2c\r
        }\r
\r
        .btn.sky {\r
            background: var(--sky);\r
            box-shadow: 0 5px 0 #2f84b8\r
        }\r
\r
        .btn.sky:active {\r
            box-shadow: 0 1px 0 #2f84b8\r
        }\r
\r
        .btn.ghost {\r
            background: var(--panel2);\r
            color: var(--text);\r
            box-shadow: 0 5px 0 #0f3238\r
        }\r
\r
        .btn:disabled {\r
            opacity: .4;\r
            pointer-events: none\r
        }\r
\r
        .hud {\r
            display: flex;\r
            justify-content: space-between;\r
            gap: 8px;\r
            font-weight: 500;\r
            margin-bottom: 10px;\r
            font-size: 15px\r
        }\r
\r
        .hud span {\r
            background: var(--panel);\r
            border: 2px solid var(--edge);\r
            border-radius: 12px;\r
            padding: 5px 12px\r
        }\r
\r
        .hint {\r
            text-align: center;\r
            font-size: 13px;\r
            color: var(--mute);\r
            margin: 10px 0 0;\r
            line-height: 1.5\r
        }\r
\r
        canvas {\r
            display: block;\r
            margin: 0 auto;\r
            border: 3px solid var(--edge);\r
            border-radius: 18px;\r
            touch-action: none;\r
            max-width: 100%\r
        }\r
\r
        .qbox {\r
            background: var(--panel2);\r
            border: 3px solid var(--edge);\r
            border-radius: 18px;\r
            padding: 16px;\r
            text-align: center;\r
            margin-bottom: 12px\r
        }\r
\r
        .pill {\r
            display: inline-block;\r
            background: var(--panel2);\r
            border: 2px solid var(--amber);\r
            border-radius: 999px;\r
            padding: 6px 16px;\r
            font-weight: 500;\r
            font-size: 14px\r
        }\r
\r
        .pop {\r
            animation: pop .35s\r
        }\r
\r
        @keyframes pop {\r
            0% {\r
                transform: scale(.8)\r
            }\r
\r
            60% {\r
                transform: scale(1.06)\r
            }\r
\r
            100% {\r
                transform: scale(1)\r
            }\r
        }\r
\r
        .shake {\r
            animation: shake .35s\r
        }\r
\r
        @keyframes shake {\r
            25% {\r
                transform: translateX(-6px)\r
            }\r
\r
            75% {\r
                transform: translateX(6px)\r
            }\r
        }\r
\r
        /* trắc nghiệm chung */\r
        .tbar {\r
            height: 14px;\r
            border-radius: 999px;\r
            background: var(--panel);\r
            border: 2px solid var(--edge);\r
            overflow: hidden;\r
            margin-bottom: 12px\r
        }\r
\r
        .tbar i {\r
            display: block;\r
            height: 100%;\r
            width: 100%;\r
            background: var(--coral);\r
            transition: width .1s linear\r
        }\r
\r
        .opts {\r
            display: grid;\r
            grid-template-columns: 1fr 1fr;\r
            gap: 12px\r
        }\r
\r
        .opt {\r
            border: 0;\r
            background: var(--panel2);\r
            border-radius: 16px;\r
            padding: 16px 8px;\r
            font-family: var(--head);\r
            font-weight: 800;\r
            font-size: clamp(22px, 5.5vw, 30px);\r
            box-shadow: 0 5px 0 #0f3238;\r
            transition: transform .08s\r
        }\r
\r
        .opt:active {\r
            transform: translateY(4px);\r
            box-shadow: 0 1px 0 #0f3238\r
        }\r
\r
        .opt.ok {\r
            background: var(--ok);\r
            color: #06331a\r
        }\r
\r
        .opt.bad {\r
            background: var(--bad);\r
            color: #fff;\r
            animation: shake .3s\r
        }\r
\r
        .explain {\r
            margin-top: 14px;\r
            background: var(--panel);\r
            border: 2px solid var(--amber);\r
            border-radius: 16px;\r
            padding: 12px 14px;\r
            font-size: 14.5px;\r
            line-height: 1.55\r
        }\r
\r
        .seq {\r
            display: flex;\r
            gap: 8px;\r
            justify-content: center;\r
            flex-wrap: wrap\r
        }\r
\r
        .chip {\r
            min-width: 50px;\r
            height: 58px;\r
            padding: 0 10px;\r
            border-radius: 14px;\r
            background: var(--panel);\r
            border: 3px solid var(--edge);\r
            display: grid;\r
            place-items: center;\r
            font-family: var(--head);\r
            font-weight: 800;\r
            font-size: 26px\r
        }\r
\r
        .chip.q {\r
            background: var(--amber);\r
            color: var(--dark);\r
            border-color: var(--amber);\r
            animation: pop .5s infinite alternate\r
        }\r
\r
        /* 2048 */\r
        .b48 {\r
            display: grid;\r
            grid-template-columns: repeat(4, 1fr);\r
            gap: 8px;\r
            width: min(100%, 420px);\r
            margin: 0 auto;\r
            padding: 8px;\r
            border-radius: 20px;\r
            background: #08191d;\r
            touch-action: none;\r
            user-select: none\r
        }\r
\r
        .t48 {\r
            aspect-ratio: 1;\r
            border-radius: 12px;\r
            display: grid;\r
            place-items: center;\r
            font-family: var(--head);\r
            font-weight: 800;\r
            background: #123a41;\r
            position: relative;\r
            color: var(--dark)\r
        }\r
\r
        .t48 small {\r
            position: absolute;\r
            bottom: 3px;\r
            font-size: 11px;\r
            font-family: var(--body);\r
            font-weight: 500;\r
            opacity: .7\r
        }\r
\r
        .t48.n {\r
            animation: pop .22s\r
        }\r
\r
        /* hóa học */\r
        .flask {\r
            min-height: 130px;\r
            border: 4px solid var(--sky);\r
            border-top: 0;\r
            border-radius: 0 0 46px 46px;\r
            padding: 12px 14px;\r
            display: flex;\r
            flex-wrap: wrap;\r
            gap: 8px;\r
            justify-content: center;\r
            align-content: flex-end;\r
            background: linear-gradient(transparent 15%, rgba(110, 198, 255, .22));\r
            margin: 6px 14px 0\r
        }\r
\r
        .atom {\r
            width: 54px;\r
            height: 54px;\r
            border-radius: 50%;\r
            display: grid;\r
            place-items: center;\r
            font-family: var(--head);\r
            font-weight: 800;\r
            font-size: 22px;\r
            border: 3px solid rgba(255, 255, 255, .75);\r
            padding: 0;\r
            box-shadow: 0 4px 0 rgba(0, 0, 0, .3)\r
        }\r
\r
        .atom.big {\r
            width: 62px;\r
            height: 62px;\r
            font-size: 24px\r
        }\r
\r
        .atom:active {\r
            transform: translateY(3px)\r
        }\r
\r
        /* simon */\r
        .simon {\r
            display: grid;\r
            grid-template-columns: 1fr 1fr;\r
            gap: 14px;\r
            width: min(100%, 360px);\r
            margin: 0 auto\r
        }\r
\r
        .pd {\r
            aspect-ratio: 1;\r
            border: 0;\r
            border-radius: 30px;\r
            font-size: 48px;\r
            opacity: .5;\r
            color: rgba(0, 0, 0, .45);\r
            transition: opacity .1s, transform .1s, filter .1s;\r
            box-shadow: 0 7px 0 rgba(0, 0, 0, .35)\r
        }\r
\r
        .pd.on {\r
            opacity: 1;\r
            transform: scale(1.05);\r
            filter: brightness(1.25)\r
        }\r
\r
        #modal {\r
            position: fixed;\r
            inset: 0;\r
            background: rgba(4, 20, 24, .8);\r
            display: none;\r
            place-items: center;\r
            padding: 18px;\r
            z-index: 20\r
        }\r
\r
        #modal.on {\r
            display: grid\r
        }\r
\r
        .result {\r
            max-width: 400px;\r
            width: 100%;\r
            text-align: center;\r
            animation: pop .4s\r
        }\r
\r
        .result h2 {\r
            font-size: 34px;\r
            font-weight: 800\r
        }\r
\r
        .big {\r
            font-family: var(--head);\r
            font-weight: 800;\r
            font-size: 66px;\r
            line-height: 1;\r
            margin: 8px 0;\r
            color: var(--amber)\r
        }\r
\r
        .stats {\r
            display: flex;\r
            justify-content: center;\r
            gap: 8px;\r
            flex-wrap: wrap;\r
            margin: 10px 0\r
        }\r
\r
        .stats span {\r
            background: var(--panel2);\r
            border-radius: 999px;\r
            padding: 4px 12px;\r
            font-size: 14px\r
        }\r
\r
        #toast {\r
            position: fixed;\r
            left: 50%;\r
            bottom: 24px;\r
            transform: translate(-50%, 120px);\r
            background: var(--amber);\r
            color: var(--dark);\r
            padding: 12px 20px;\r
            border-radius: 999px;\r
            font-weight: 700;\r
            z-index: 30;\r
            transition: transform .4s;\r
            max-width: 90vw;\r
            text-align: center\r
        }\r
\r
        #toast.on {\r
            transform: translate(-50%, 0)\r
        }\r
\r
        button:focus-visible {\r
            outline: 4px solid var(--sky);\r
            outline-offset: 2px\r
        }\r
\r
        @media (prefers-reduced-motion:reduce) {\r
            * {\r
                animation: none !important;\r
                transition: none !important\r
            }\r
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
        window.GAME_API_BASE = 'https://educational-games-lp4z.onrender.com';          /* VD: 'https://api.example.com' */\r
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
            const cv = $('#cv'), ctx = fitCanvas(cv, W, H);\r
            const br = 15 * s, bx = W * .26, GY = H - 34 * s, TOP = 76 * s;\r
            let y = H / 2, vy = 0, ready = true, score = 0, lives = 3, combo = 0, best = 0, n = 0, q, wall, t = 0, flash = 0;\r
            const clouds = Array.from({ length: 5 }, () => ({ x: Math.random() * W, y: Math.random() * (H * .6) + 70 * s, r: 20 + Math.random() * 24, v: 8 + Math.random() * 14 }));\r
            const speed = () => (115 + Math.min(n, 15) * 4) * s;\r
            function hud() { $('#sc').textContent = score; $('#lv').textContent = lives > 0 ? '❤️'.repeat(lives) : '💔'; $('#cb').textContent = '🔥 ' + combo }\r
            function newWall() {\r
                const m = genMath(n < 4 ? 0 : n < 10 ? 1 : 2); q = { text: m.text + ' = ?', ans: m.ans };\r
                const opts = makeOpts(m.ans, 3), zone = (GY - TOP) / 3, gh = Math.min(zone * .68, 120 * s);\r
                wall = { x: W + 20, w: 64 * s, done: false, gaps: opts.map((v, k) => { const cy = TOP + zone * k + zone / 2 + (Math.random() - .5) * zone * .16; return { v, top: cy - gh / 2, bot: cy + gh / 2, c: v === m.ans } }) };\r
            }\r
            function hurt() {\r
                lives--; combo = 0; sfx.bad(); flash = .3; hud();\r
                if (lives <= 0) { finish({ id: 'flap', score, xp: Math.round(score / 6), lines: [\`Qua \${n} cổng đúng\`, \`Chuỗi tốt nhất \${best}\`], replay: flapGame, details: { gates: n, bestCombo: best } }); return true }\r
                ready = true; y = H / 2; vy = 0; newWall(); return false;\r
            }\r
            function flap() { if (ready) ready = false; vy = -430 * s; sfx.flap() }\r
            cv.addEventListener('pointerdown', e => { e.preventDefault(); flap() });\r
            onKey = e => { if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap() } };\r
            newWall(); hud();\r
            T.loop(dt => {\r
                t += dt; clouds.forEach(c => { c.x -= c.v * dt; if (c.x < -60) c.x = W + 60 });\r
                if (flash > 0) flash -= dt;\r
                if (ready) { y = H / 2 + Math.sin(t * 5) * 8 * s; draw(); return }\r
                vy += 1500 * s * dt; y += vy * dt; if (y < br) { y = br; vy = Math.max(vy, 0) }\r
                wall.x -= speed() * dt;\r
                if (y + br > GY) { if (hurt()) return; draw(); return }\r
                if (bx + br > wall.x && bx - br < wall.x + wall.w) {\r
                    if (!wall.gaps.find(g => y - br > g.top && y + br < g.bot)) { if (hurt()) return; draw(); return }\r
                }\r
                if (!wall.done && bx > wall.x + wall.w / 2) {\r
                    wall.done = true; const g = wall.gaps.find(g => y > g.top && y < g.bot);\r
                    if (g && g.c) { combo++; best = Math.max(best, combo); n++; score += 10 + Math.min(combo, 10) * 2; sfx.ok(); if (n >= 10) S.flags.flap = true; hud() }\r
                    else { if (hurt()) return; draw(); return }\r
                }\r
                if (wall.x + wall.w < -10) newWall();\r
                draw();\r
            });\r
            function draw() {\r
                const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5ec2ff'); g.addColorStop(1, '#d8f5ff');\r
                ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);\r
                ctx.fillStyle = 'rgba(255,255,255,.85)'; clouds.forEach(c => { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.arc(c.x + c.r * .9, c.y + 4, c.r * .75, 0, 7); ctx.arc(c.x - c.r * .9, c.y + 6, c.r * .65, 0, 7); ctx.fill() });\r
                const segs = []; let prev = 0;\r
                wall.gaps.forEach(g => { segs.push([prev, g.top]); prev = g.bot }); segs.push([prev, GY]);\r
                segs.forEach(([a, b]) => {\r
                    if (b - a <= 0) return;\r
                    ctx.fillStyle = '#2fbf71'; ctx.strokeStyle = '#14683b'; ctx.lineWidth = 3;\r
                    ctx.beginPath(); ctx.roundRect(wall.x, a - 6, wall.w, b - a + 12, 8); ctx.fill(); ctx.stroke();\r
                    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(wall.x + 8, a, 7, b - a);\r
                });\r
                wall.gaps.forEach(g => {\r
                    const cy = (g.top + g.bot) / 2;\r
                    ctx.fillStyle = 'rgba(12,42,48,.78)'; ctx.beginPath(); ctx.roundRect(wall.x + 2, cy - 16 * s, wall.w - 4, 32 * s, 10); ctx.fill();\r
                    ctx.fillStyle = '#fff'; ctx.font = \`800 \${Math.round(22 * s)}px Baloo 2,system-ui,sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
                    ctx.fillText(g.v, wall.x + wall.w / 2, cy + 1);\r
                });\r
                ctx.fillStyle = '#d9a441'; ctx.fillRect(0, GY, W, H - GY); ctx.fillStyle = '#4caf50'; ctx.fillRect(0, GY, W, 8 * s);\r
                ctx.save(); ctx.translate(bx, y); ctx.rotate(Math.max(-.5, Math.min(.9, vy / (700 * s))));\r
                ctx.fillStyle = '#ffc233'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, br, 0, 7); ctx.fill(); ctx.stroke();\r
                ctx.fillStyle = '#ff9a3c'; ctx.beginPath(); ctx.ellipse(-br * .3, br * .15 + Math.sin(t * 25) * 3, br * .55, br * .32, -.3, 0, 7); ctx.fill();\r
                ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(br * .35, -br * .3, br * .34, 0, 7); ctx.fill(); ctx.fillStyle = '#0b2227'; ctx.beginPath(); ctx.arc(br * .45, -br * .3, br * .15, 0, 7); ctx.fill();\r
                ctx.fillStyle = '#ff6f59'; ctx.beginPath(); ctx.moveTo(br * .8, 0); ctx.lineTo(br * 1.5, br * .15); ctx.lineTo(br * .8, br * .4); ctx.fill();\r
                ctx.restore();\r
                ctx.fillStyle = 'rgba(12,42,48,.88)'; ctx.beginPath(); ctx.roundRect(12, 10, W - 24, 54 * s + 6, 16); ctx.fill();\r
                ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
                let fs = 34; do { ctx.font = \`800 \${fs}px Baloo 2,system-ui,sans-serif\`; fs-- } while (ctx.measureText(q.text).width > W - 60 && fs > 14);\r
                ctx.fillText(q.text, W / 2, 10 + (54 * s + 6) / 2);\r
                if (ready) { ctx.fillStyle = 'rgba(12,42,48,.7)'; ctx.beginPath(); ctx.roundRect(W / 2 - 100, H / 2 + 40 * s, 200, 40, 20); ctx.fill(); ctx.fillStyle = '#ffc233'; ctx.font = '700 16px Lexend,system-ui,sans-serif'; ctx.fillText('Chạm để bay', W / 2, H / 2 + 40 * s + 21) }\r
                if (flash > 0) { ctx.fillStyle = \`rgba(255,93,108,\${flash * 1.3})\`; ctx.fillRect(0, 0, W, H) }\r
            }\r
        }\r
\r
        /* ============ GAME 2: 2048 LŨY THỪA ============ */\r
        function game2048(root) {\r
            let b = Array(16).fill(0), score = 0, over = false, newIdx = -1;\r
            const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';\r
            const sup = k => String(k).split('').map(d => SUP[+d]).join('');\r
            const PAL = ['#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#b5d8ff', '#8fb8ff', '#c3a6ff', '#ff9de2', '#ffd166', '#ffc233'];\r
            function add() { const e = b.map((v, i) => v ? -1 : i).filter(i => i >= 0); if (!e.length) return; const p = e[rnd(0, e.length - 1)]; b[p] = Math.random() < .9 ? 2 : 4; newIdx = p }\r
            function slide(line) {\r
                const a = line.filter(v => v); let gain = 0;\r
                for (let i = 0; i < a.length - 1; i++)if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1) }\r
                while (a.length < 4) a.push(0); return { a, gain };\r
            }\r
            function canMove() {\r
                if (b.includes(0)) return true;\r
                for (let r = 0; r < 4; r++)for (let c = 0; c < 4; c++) { const v = b[r * 4 + c]; if ((c < 3 && b[r * 4 + c + 1] === v) || (r < 3 && b[(r + 1) * 4 + c] === v)) return true }\r
                return false;\r
            }\r
            function move(dir) {\r
                if (over) return;\r
                let moved = false, gain = 0; const nb = [...b];\r
                for (let k = 0; k < 4; k++) {\r
                    const idx = [0, 1, 2, 3].map(j => dir < 2 ? k * 4 + j : j * 4 + k); if (dir % 2 === 1) idx.reverse();\r
                    const { a, gain: g } = slide(idx.map(i => b[i]));\r
                    idx.forEach((i, j) => { if (nb[i] !== a[j]) moved = true; nb[i] = a[j] }); gain += g;\r
                }\r
                if (!moved) return;\r
                b = nb; score += gain; add(); sfx.tick(); render();\r
                if (Math.max(...b) >= 256) S.flags.t256 = true;\r
                if (!canMove()) { over = true; T.set(end, 900) }\r
            }\r
            function end() {\r
                const mx = Math.max(...b);\r
                finish({ id: 'g2048', score, xp: Math.min(80, Math.round(score / 25)) + Math.round(Math.log2(mx)) * 2, lines: [\`Ô lớn nhất \${mx} = 2\${sup(Math.round(Math.log2(mx)))}\`], replay: game2048, details: { maxTile: mx } });\r
            }\r
            function render() {\r
                $('#sc').textContent = score;\r
                $('#bd').innerHTML = b.map((v, i) => {\r
                    if (!v) return '<div class="t48"></div>';\r
                    const k = Math.round(Math.log2(v)), fs = v < 100 ? 34 : v < 1000 ? 28 : v < 10000 ? 22 : 18;\r
                    return \`<div class="t48 \${i === newIdx ? 'n' : ''}" style="background:\${PAL[Math.min(k - 1, PAL.length - 1)]};font-size:\${fs}px">\${v}<small>2\${sup(k)}</small></div>\`;\r
                }).join('');\r
                newIdx = -1;\r
            }\r
            root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span>Gộp hai ô giống nhau</span></div>\r
    <div class="b48" id="bd"></div>\r
    <p class="hint">Vuốt hoặc dùng phím mũi tên. Mỗi ô ghi thêm dạng lũy thừa của 2 ở góc dưới.</p>\r
    <div class="row"><button class="btn ghost" id="stop">Kết thúc &amp; nhận XP</button></div>\`;\r
            add(); add(); render();\r
            onKey = e => { const m = { ArrowLeft: 0, ArrowRight: 1, ArrowUp: 2, ArrowDown: 3 }[e.key]; if (m !== undefined) { e.preventDefault(); move(m) } };\r
            const bd = $('#bd'); let sx, sy;\r
            bd.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }, { passive: true });\r
            bd.addEventListener('touchend', e => {\r
                const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;\r
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;\r
                if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);\r
            });\r
            let px, py;\r
            bd.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY } });\r
            bd.addEventListener('pointerup', e => {\r
                if (e.pointerType !== 'mouse' || px === undefined) return;\r
                const dx = e.clientX - px, dy = e.clientY - py; px = undefined;\r
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;\r
                if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 0); else move(dy > 0 ? 3 : 2);\r
            });\r
            root.onclick = e => { if (e.target.closest('#stop') && !over) { over = true; end() } };\r
        }\r
\r
        /* ============ GAME 3: NHÀ HÓA HỌC NHÍ ============ */\r
        function chemGame(root) {\r
            const ATOMS = [['H', '#eaf0ff', '#0b2227'], ['O', '#ff6f59', '#0b2227'], ['C', '#3d4a55', '#ffffff'], ['N', '#6ec6ff', '#0b2227'], ['Na', '#b18cff', '#0b2227'], ['Cl', '#b7e34a', '#0b2227']];\r
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
            const list = shuffle(MOLS).slice(0, 8), col = Object.fromEntries(ATOMS.map(a => [a[0], a]));\r
            let i = 0, score = 0, solved = 0, wrong = 0, totalWrong = 0, flask = [], busy = false;\r
            const total = m => Object.values(m.f).reduce((a, b) => a + b, 0);\r
            const chip = (a, k) => \`<button class="atom" data-r="\${k}" style="background:\${col[a][1]};color:\${col[a][2]}" aria-label="Bỏ \${a}">\${a}</button>\`;\r
            function render(msg) {\r
                const m = list[i];\r
                root.innerHTML = \`<div class="hud"><span>Chất <b>\${i + 1}/8</b></span><span>⭐ <b>\${score}</b></span><span>\${wrong < 3 ? '❤️'.repeat(3 - wrong) : '💔'}</span></div>\r
      <div class="qbox"><small style="color:var(--mute)">Hãy tạo ra</small><br><b style="font-family:var(--head);font-size:28px">\${m.name}</b>\r
      \${wrong >= 1 ? \`<br><span class="pill" style="margin-top:8px">Gợi ý: có tất cả \${total(m)} nguyên tử</span>\` : ''}</div>\r
      <div class="flask" id="fl">\${flask.map(chip).join('') || '<span class="hint">Chạm nguyên tử bên dưới để thả vào bình</span>'}</div>\r
      <div class="row atoms">\${ATOMS.map(([s, bg, fg]) => \`<button class="atom big" data-a="\${s}" style="background:\${bg};color:\${fg}" aria-label="Nguyên tử \${s}">\${s}</button>\`).join('')}</div>\r
      \${msg || \`<div class="row"><button class="btn ghost" data-x="clear">Đổ đi</button><button class="btn" data-x="mix">🧪 Trộn!</button></div><p class="hint">Chạm nguyên tử trong bình để bỏ ra.</p>\`}\`;\r
            }\r
            function next() {\r
                i++;\r
                if (i >= 8) {\r
                    if (totalWrong === 0) S.flags.chem = true;\r
                    finish({ id: 'chem', score, xp: Math.round(score / 3) + solved * 2, lines: [\`Tạo đúng \${solved}/8 chất\`, \`\${totalWrong} lần sai\`], replay: chemGame, details: { solved, totalWrong } }); return;\r
                }\r
                flask = []; wrong = 0; busy = false; render();\r
            }\r
            function mix() {\r
                const m = list[i], cnt = {}; flask.forEach(a => cnt[a] = (cnt[a] || 0) + 1);\r
                const keys = new Set([...Object.keys(cnt), ...Object.keys(m.f)]);\r
                const good = [...keys].every(k => (cnt[k] || 0) === (m.f[k] || 0));\r
                busy = true;\r
                if (good) {\r
                    const pts = Math.max(8, 20 - wrong * 6); score += pts; solved++; sfx.ok();\r
                    render(\`<div class="qbox pop" style="margin-top:14px"><b style="font-family:var(--head);font-size:30px;color:var(--lime)">\${m.s}</b><br>Chính xác! +\${pts} điểm</div>\`);\r
                    T.set(next, 1600);\r
                } else {\r
                    wrong++; totalWrong++; sfx.bad();\r
                    if (wrong >= 3) {\r
                        render(\`<div class="qbox" style="margin-top:14px">Công thức đúng là <b style="font-family:var(--head);font-size:28px;color:var(--amber)">\${m.s}</b></div>\`);\r
                        T.set(next, 2200);\r
                    } else { busy = false; render(); $('#fl').classList.add('shake'); }\r
                }\r
            }\r
            root.onclick = e => {\r
                if (busy) return;\r
                const a = e.target.closest('[data-a]'), r = e.target.closest('[data-r]'), x = e.target.closest('[data-x]');\r
                if (a) { if (flask.length < 6) { flask.push(a.dataset.a); sfx.tick(); render() } }\r
                else if (r) { flask.splice(+r.dataset.r, 1); render() }\r
                else if (x) { if (x.dataset.x === 'clear') { flask = []; render() } else if (flask.length) mix(); else toast('Hãy thả nguyên tử vào bình trước') }\r
            };\r
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
            function options(h, m) {\r
                const set = new Set([fmt(h, m)]), c = [];\r
                c.push(fmt(h, (m + 30) % 60), fmt(h === 12 ? 1 : h + 1, m), fmt(h === 1 ? 12 : h - 1, m), fmt(h, (m + 5) % 60), fmt(h, (m + 55) % 60), fmt(h, (m + 15) % 60));\r
                c.push(fmt(m / 5 || 12, (h % 12) * 5));\r
                shuffle(c).forEach(x => { if (set.size < 4) set.add(x) });\r
                while (set.size < 4) set.add(fmt(rnd(1, 12), rnd(0, 11) * 5));\r
                return shuffle([...set]);\r
            }\r
            function draw(cv, h, m) {\r
                const S_ = 240, ctx = fitCanvas(cv, S_, S_), c = S_ / 2, R = 108;\r
                ctx.fillStyle = '#fff6df'; ctx.strokeStyle = '#0b2227'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(c, c, R, 0, 7); ctx.fill(); ctx.stroke();\r
                for (let k = 0; k < 60; k++) { const a = k * 6 * Math.PI / 180, l = k % 5 ? 5 : 11; ctx.lineWidth = k % 5 ? 1.5 : 3; ctx.strokeStyle = '#0b2227'; ctx.beginPath(); ctx.moveTo(c + Math.sin(a) * (R - 6), c - Math.cos(a) * (R - 6)); ctx.lineTo(c + Math.sin(a) * (R - 6 - l), c - Math.cos(a) * (R - 6 - l)); ctx.stroke() }\r
                ctx.fillStyle = '#0b2227'; ctx.font = '800 22px Baloo 2,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
                for (let k = 1; k <= 12; k++) { const a = k * 30 * Math.PI / 180; ctx.fillText(k, c + Math.sin(a) * R * .74, c - Math.cos(a) * R * .74 + 1) }\r
                const hand = (ang, len, w, col) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c + Math.sin(ang) * len, c - Math.cos(ang) * len); ctx.stroke() };\r
                hand(((h % 12) + m / 60) * 30 * Math.PI / 180, R * .47, 9, '#15434b');\r
                hand(m * 6 * Math.PI / 180, R * .74, 5, '#ff6f59');\r
                ctx.fillStyle = '#0b2227'; ctx.beginPath(); ctx.arc(c, c, 7, 0, 7); ctx.fill();\r
            }\r
            root.innerHTML = '';\r
            runMC(root, {\r
                id: 'clock', replay: clockGame, count: 10, secs: 15,\r
                make(i) {\r
                    const { h, m } = qs[i], ans = fmt(h, m);\r
                    return {\r
                        html: \`<canvas id="ck"></canvas><div class="hint" style="margin-top:10px">Đồng hồ đang chỉ mấy giờ? (kim ngắn chỉ giờ, kim dài chỉ phút)</div>\`,\r
                        after() { draw($('#ck'), h, m) },\r
                        opts: options(h, m), ans,\r
                        exp: m === 0 ? \`Kim dài chỉ số 12 nên là \${h} giờ đúng: \${ans}.\` : \`Kim ngắn chỉ gần số \${h} nên là \${h} giờ. Kim dài chỉ số \${m / 5} nên là \${m} phút. Vậy là \${ans}.\`\r
                    };\r
                },\r
                onEnd(r) { if (r === 10) S.flags.clock = true }\r
            });\r
        }\r
\r
        /* ============ GAME 5: QUY LUẬT SỐ ============ */\r
        function patternGame(root) {\r
            function genSeq(n) {\r
                const t = n < 3 ? rnd(0, 1) : n < 7 ? rnd(0, 4) : rnd(0, 6);\r
                let seq = [], rule = '';\r
                if (t === 0) { const a = rnd(1, 20), d = rnd(2, 9); seq = [...Array(6)].map((_, i) => a + d * i); rule = \`Mỗi số bằng số đứng trước cộng \${d}.\` }\r
                else if (t === 1) { const d = rnd(2, 8), a = rnd(40, 70); seq = [...Array(6)].map((_, i) => a - d * i); rule = \`Mỗi số bằng số đứng trước trừ \${d}.\` }\r
                else if (t === 2) { const r = rnd(2, 3), a = rnd(1, 3); seq = [...Array(6)].map((_, i) => a * r ** i); rule = \`Mỗi số bằng số đứng trước nhân \${r}.\` }\r
                else if (t === 3) { const o = rnd(0, 3); seq = [...Array(6)].map((_, i) => (i + 1) ** 2 + o); rule = o ? \`Đây là dãy số chính phương 1, 4, 9, 16, ... cộng thêm \${o}.\` : 'Đây là dãy số chính phương: 1², 2², 3², 4², ...' }\r
                else if (t === 4) { const a = rnd(1, 5), d0 = rnd(1, 3); let v = a; seq = [v]; for (let i = 1; i < 6; i++) { v += d0 + i - 1; seq.push(v) } rule = \`Hiệu hai số liên tiếp tăng dần: +\${d0}, +\${d0 + 1}, +\${d0 + 2}, ...\` }\r
                else if (t === 5) { const a = rnd(1, 4), b = rnd(2, 6); seq = [a, b]; for (let i = 2; i < 6; i++)seq.push(seq[i - 1] + seq[i - 2]); rule = 'Mỗi số bằng tổng của hai số đứng ngay trước nó.' }\r
                else { const a = rnd(20, 30), p = rnd(4, 9), m = rnd(1, p - 2); seq = [a]; for (let i = 1; i < 6; i++)seq.push(seq[i - 1] + (i % 2 ? p : -m)); rule = \`Luân phiên cộng \${p} rồi trừ \${m}.\` }\r
                return { seq, h: rnd(2, 5), rule };\r
            }\r
            root.innerHTML = '';\r
            runMC(root, {\r
                id: 'pattern', replay: patternGame, count: 10, secs: 20,\r
                make(i) {\r
                    const { seq, h, rule } = genSeq(i), ans = seq[h];\r
                    return {\r
                        html: \`<div class="hint" style="margin:0 0 12px">Tìm số còn thiếu theo quy luật</div>\r
          <div class="seq">\${seq.map((v, k) => \`<div class="chip \${k === h ? 'q' : ''}">\${k === h ? '?' : v}</div>\`).join('')}</div>\`,\r
                        opts: makeOpts(ans, 4), ans,\r
                        exp: \`\${rule} Số cần tìm là \${ans}.\`\r
                    };\r
                },\r
                onEnd(r) { if (r === 10) S.flags.pat = true }\r
            });\r
        }\r
\r
        /* ============ GAME 6: NHỚ DÃY MÀU ============ */\r
        function simonGame(root) {\r
            const PADS = [['var(--sky)', '▲', 392], ['var(--coral)', '●', 494], ['var(--amber)', '■', 587], ['var(--lime)', '★', 698]];\r
            let seq = [], step = 0, phase = 'show', score = 0;\r
            root.innerHTML = \`<div class="hud"><span>Vòng <b id="rd">1</b></span><span>⭐ <b id="sc">0</b></span></div>\r
    <div class="qbox" id="st" style="font-family:var(--head);font-size:24px;font-weight:800">Sẵn sàng?</div>\r
    <div class="simon">\${PADS.map((p, i) => \`<button class="pd" data-p="\${i}" style="background:\${p[0]}" aria-label="Ô \${i + 1}">\${p[1]}</button>\`).join('')}</div>\r
    <p class="hint">Xem dãy sáng lên, rồi bấm lại đúng thứ tự. Mỗi vòng thêm một bước.</p>\`;\r
            const pads = [...root.querySelectorAll('.pd')];\r
            const flash = (i, ms) => { pads[i].classList.add('on'); beep(PADS[i][2], ms / 1000, 'triangle', .09); T.set(() => pads[i].classList.remove('on'), ms) };\r
            function round() {\r
                seq.push(rnd(0, 3)); step = 0; phase = 'show';\r
                $('#rd').textContent = seq.length; $('#st').textContent = 'Xem kỹ...';\r
                const gap = Math.max(230, 520 - seq.length * 22), on = Math.max(160, gap * .6);\r
                seq.forEach((p, k) => T.set(() => flash(p, on), 700 + k * gap));\r
                T.set(() => { phase = 'input'; $('#st').textContent = 'Đến lượt bạn!' }, 700 + seq.length * gap);\r
            }\r
            root.onclick = e => {\r
                const b = e.target.closest('[data-p]'); if (!b || phase !== 'input') return;\r
                const i = +b.dataset.p; flash(i, 180);\r
                if (i !== seq[step]) {\r
                    phase = 'over'; sfx.bad(); $('#st').textContent = 'Sai rồi!';\r
                    const rounds = seq.length - 1;\r
                    if (rounds >= 8) S.flags.simon = true;\r
                    T.set(() => finish({ id: 'simon', score, xp: Math.round(score / 4) + rounds, lines: [\`Nhớ được \${rounds} bước\`], replay: simonGame, details: { rounds } }), 900);\r
                    return;\r
                }\r
                step++;\r
                if (step === seq.length) {\r
                    phase = 'wait'; score += seq.length * 10; $('#sc').textContent = score; $('#st').textContent = 'Chính xác!';\r
                    T.set(sfx.ok, 200); T.set(round, 1100);\r
                }\r
            };\r
            T.set(round, 700);\r
        }\r
\r
        /* ============ Khởi động ============ */\r
        const GAMES = [\r
            { id: 'flap', name: 'Chim Bay Qua Cổng', tag: 'Toán · Phản xạ', c: 'var(--amber)', icon: '🐦', desc: 'Vỗ cánh bay qua đúng khe có đáp án của phép tính. Chạm sai là mất tim.', fn: flapGame },\r
            { id: 'g2048', name: '2048 Lũy Thừa', tag: 'Logic · Lũy thừa', c: 'var(--violet)', icon: '🔢', desc: 'Gộp các ô giống nhau để đạt số lớn, mỗi ô hiện thêm dạng 2 mũ k.', fn: game2048 },\r
            { id: 'chem', name: 'Nhà Hóa Học Nhí', tag: 'Hóa học', c: 'var(--lime)', icon: '⚗️', desc: 'Ghép các nguyên tử H, O, C, N, Na, Cl thành đúng phân tử theo tên chất.', fn: chemGame },\r
            { id: 'clock', name: 'Đồng Hồ Thời Gian', tag: 'Toán · Xem giờ', c: 'var(--coral)', icon: '🕒', desc: 'Nhìn đồng hồ kim và chọn đúng giờ. Từ giờ chẵn đến từng 5 phút.', fn: clockGame },\r
            { id: 'pattern', name: 'Thám Tử Quy Luật', tag: 'Toán · Tư duy', c: 'var(--sky)', icon: '🕵️', desc: 'Tìm số còn thiếu trong dãy: cộng, nhân, chính phương, Fibonacci...', fn: patternGame },\r
            { id: 'simon', name: 'Nhớ Dãy Màu', tag: 'Trí nhớ', c: '#ff9de2', icon: '🎵', desc: 'Ghi nhớ dãy ô sáng và âm thanh, rồi lặp lại đúng thứ tự. Mỗi vòng dài thêm.', fn: simonGame },\r
        ];\r
\r
        initCore({\r
            games: GAMES,\r
            storageKey: 'hmc_game3',\r
            hubTitle: 'Phòng thí nghiệm trò chơi.',\r
            hubDesc: 'Sáu thử thách: Toán, Hóa học, Logic và Trí nhớ. Chơi để kiếm XP, lên cấp và mở huy hiệu.',\r
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
</html>`,c=n(),l={id:`hmc-game3`,code:`hmc-game3`,name:`Học Mà Chơi LAB 2`,title:`Học Mà Chơi LAB 2`,subject:`Nhiều môn`};function u(){let{user:e,token:t}=r(),n=e?{user:e,token:t}:null,[u,d]=(0,o.useState)(0),f=(0,o.useCallback)(()=>i(`/`),[]);return(0,c.jsx)(`div`,{className:`fixed inset-0 bg-[#0c2a30]`,children:(0,c.jsx)(a,{htmlContent:s,game:l,questions:[],playerName:e?.fullName||e?.username||`An Nhiên`,playMode:`solo`,userAuth:n,onFinish:()=>{},onQuit:f,onStateUpdate:()=>{}},`hmc-game3-${u}`)})}export{u as default};