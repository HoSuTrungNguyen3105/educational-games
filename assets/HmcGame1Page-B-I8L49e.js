import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{U as r,bt as i}from"./index-pMGc089C.js";import a from"./HtmlGameLoader-DkoL27sZ.js";var o=e(t(),1),s=`<!DOCTYPE html>\r
<html lang="vi">\r
\r
<head>\r
  <meta charset="UTF-8">\r
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\r
  <title>Học Mà Chơi</title>\r
  <link rel="preconnect" href="https://fonts.googleapis.com">\r
  <link\r
    href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap"\r
    rel="stylesheet">\r
  <style>\r
    :root {\r
      --ink: #1c1b3a;\r
      --paper: #fbf8ef;\r
      --line: #e6e0cc;\r
      --sun: #ffc93c;\r
      --tomato: #ff6b57;\r
      --mint: #2fc9a5;\r
      --sky: #4b9dff;\r
      --lilac: #a184ff;\r
      --ok: #22b573;\r
      --bad: #f0483e;\r
      --shadow: 4px 4px 0 var(--ink);\r
      --head: 'Baloo 2', 'Nunito', 'Segoe UI', system-ui, sans-serif;\r
      --body: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;\r
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
      color: var(--ink);\r
      background-color: var(--paper);\r
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);\r
      background-size: 28px 28px;\r
      min-height: 100vh;\r
    }\r
\r
    #app {\r
      max-width: 980px;\r
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
      font-size: 30px;\r
      letter-spacing: -.5px;\r
      display: flex;\r
      align-items: center;\r
      gap: 8px\r
    }\r
\r
    .logo i {\r
      font-style: normal;\r
      display: grid;\r
      place-items: center;\r
      width: 42px;\r
      height: 42px;\r
      background: var(--sun);\r
      border: 3px solid var(--ink);\r
      border-radius: 12px;\r
      box-shadow: 3px 3px 0 var(--ink);\r
      transform: rotate(-6deg)\r
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
      background: var(--ink);\r
      color: #fff;\r
      border-radius: 999px;\r
      padding: 4px 14px;\r
      font-size: 17px\r
    }\r
\r
    .xp {\r
      width: 130px;\r
      height: 16px;\r
      border: 3px solid var(--ink);\r
      border-radius: 999px;\r
      background: #fff;\r
      overflow: hidden\r
    }\r
\r
    .xp i {\r
      display: block;\r
      height: 100%;\r
      width: 0;\r
      background: var(--mint);\r
      transition: width .6s cubic-bezier(.2, .9, .3, 1.2)\r
    }\r
\r
    .snd {\r
      width: 40px;\r
      height: 40px;\r
      border-radius: 12px;\r
      border: 3px solid var(--ink);\r
      background: #fff;\r
      font-size: 18px\r
    }\r
\r
    .hero {\r
      display: flex;\r
      gap: 18px;\r
      align-items: end;\r
      justify-content: space-between;\r
      flex-wrap: wrap;\r
      margin: 6px 0 20px\r
    }\r
\r
    .hero h2 {\r
      font-size: clamp(30px, 6vw, 52px);\r
      font-weight: 800;\r
      letter-spacing: -1px;\r
      max-width: 14ch\r
    }\r
\r
    .hero p {\r
      margin: 0;\r
      max-width: 34ch;\r
      font-size: 15px;\r
      line-height: 1.5;\r
      color: #4b4a6b\r
    }\r
\r
    .grid {\r
      display: grid;\r
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));\r
      gap: 18px\r
    }\r
\r
    .tile {\r
      text-align: left;\r
      border: 3px solid var(--ink);\r
      border-radius: 22px;\r
      padding: 18px;\r
      box-shadow: var(--shadow);\r
      display: flex;\r
      flex-direction: column;\r
      gap: 8px;\r
      min-height: 190px;\r
      position: relative;\r
      transition: transform .12s, box-shadow .12s;\r
      background: #fff\r
    }\r
\r
    .tile:hover {\r
      transform: translate(-2px, -2px);\r
      box-shadow: 7px 7px 0 var(--ink)\r
    }\r
\r
    .tile:active {\r
      transform: translate(3px, 3px);\r
      box-shadow: 1px 1px 0 var(--ink)\r
    }\r
\r
    .tile .ic {\r
      font-size: 44px;\r
      line-height: 1\r
    }\r
\r
    .tile h3 {\r
      font-size: 26px;\r
      font-weight: 800\r
    }\r
\r
    .tile p {\r
      margin: 0;\r
      font-size: 14px;\r
      line-height: 1.45\r
    }\r
\r
    .tile .meta {\r
      margin-top: auto;\r
      display: flex;\r
      justify-content: space-between;\r
      align-items: center;\r
      font-size: 13px;\r
      font-weight: 700\r
    }\r
\r
    .tag {\r
      background: var(--ink);\r
      color: #fff;\r
      border-radius: 999px;\r
      padding: 3px 11px;\r
      font-size: 12px;\r
      font-weight: 700\r
    }\r
\r
    .badges {\r
      display: flex;\r
      gap: 10px;\r
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
      border: 2.5px solid var(--ink);\r
      border-radius: 999px;\r
      padding: 5px 12px;\r
      font-size: 13px;\r
      font-weight: 700;\r
      background: #fff\r
    }\r
\r
    .bd.off {\r
      opacity: .38;\r
      filter: grayscale(1);\r
      border-style: dashed\r
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
      border: 3px solid var(--ink);\r
      background: #fff;\r
      border-radius: 14px;\r
      padding: 8px 14px;\r
      font-weight: 700;\r
      box-shadow: 3px 3px 0 var(--ink)\r
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
      background: #fff;\r
      border: 3px solid var(--ink);\r
      border-radius: 22px;\r
      padding: 20px;\r
      box-shadow: var(--shadow)\r
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
      border: 3px solid var(--ink);\r
      background: var(--sun);\r
      border-radius: 14px;\r
      padding: 12px 20px;\r
      font-weight: 700;\r
      font-size: 16px;\r
      box-shadow: 3px 3px 0 var(--ink);\r
      transition: transform .1s, box-shadow .1s\r
    }\r
\r
    .btn:active {\r
      transform: translate(3px, 3px);\r
      box-shadow: 0 0 0 var(--ink)\r
    }\r
\r
    .btn.alt,\r
    .btn.ghost {\r
      background: #fff\r
    }\r
\r
    .btn.sky {\r
      background: var(--sky);\r
      color: #fff\r
    }\r
\r
    .hud {\r
      display: flex;\r
      justify-content: space-between;\r
      gap: 8px;\r
      font-weight: 700;\r
      margin-bottom: 10px;\r
      font-size: 16px\r
    }\r
\r
    .hud span {\r
      background: #fff;\r
      border: 2.5px solid var(--ink);\r
      border-radius: 12px;\r
      padding: 5px 12px\r
    }\r
\r
    .timebar {\r
      height: 14px;\r
      border: 3px solid var(--ink);\r
      border-radius: 999px;\r
      background: #fff;\r
      overflow: hidden;\r
      margin-bottom: 14px\r
    }\r
\r
    .timebar i {\r
      display: block;\r
      height: 100%;\r
      width: 100%;\r
      background: var(--tomato);\r
      transition: width .1s linear\r
    }\r
\r
    .qbox {\r
      background: var(--ink);\r
      color: #fff;\r
      border-radius: 20px;\r
      padding: 22px 16px;\r
      text-align: center;\r
      font-family: var(--head);\r
      font-weight: 800;\r
      font-size: clamp(34px, 9vw, 56px);\r
      margin-bottom: 14px;\r
      min-height: 96px;\r
      display: grid;\r
      place-items: center\r
    }\r
\r
    .qbox.txt {\r
      font-size: clamp(20px, 4.6vw, 26px);\r
      font-weight: 600;\r
      line-height: 1.3;\r
      font-family: var(--body);\r
      text-align: left;\r
      place-items: center start;\r
      padding: 18px\r
    }\r
\r
    .qbox small {\r
      display: block;\r
      font-size: 14px;\r
      font-weight: 500;\r
      opacity: .75;\r
      margin-top: 4px;\r
      font-family: var(--body)\r
    }\r
\r
    .opts {\r
      display: grid;\r
      grid-template-columns: 1fr 1fr;\r
      gap: 12px\r
    }\r
\r
    .opts.one {\r
      grid-template-columns: 1fr\r
    }\r
\r
    .opt {\r
      border: 3px solid var(--ink);\r
      background: #fff;\r
      border-radius: 16px;\r
      padding: 16px 10px;\r
      font-family: var(--head);\r
      font-weight: 800;\r
      font-size: clamp(22px, 5vw, 30px);\r
      box-shadow: 3px 3px 0 var(--ink);\r
      transition: transform .1s, background .15s\r
    }\r
\r
    .opts.one .opt {\r
      font-family: var(--body);\r
      font-weight: 600;\r
      font-size: 17px;\r
      text-align: left;\r
      padding: 14px 16px\r
    }\r
\r
    .opt:active {\r
      transform: translate(3px, 3px)\r
    }\r
\r
    .opt.ok {\r
      background: var(--ok);\r
      color: #fff\r
    }\r
\r
    .opt.bad {\r
      background: var(--bad);\r
      color: #fff;\r
      animation: shake .3s\r
    }\r
\r
    .opt.gone {\r
      opacity: .25;\r
      pointer-events: none\r
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
    .explain {\r
      margin-top: 14px;\r
      background: #fff7d6;\r
      border: 3px solid var(--ink);\r
      border-radius: 16px;\r
      padding: 12px 14px;\r
      font-size: 15px;\r
      line-height: 1.5\r
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
        transform: scale(1.08)\r
      }\r
\r
      100% {\r
        transform: scale(1)\r
      }\r
    }\r
\r
    .mem {\r
      display: grid;\r
      grid-template-columns: repeat(4, 1fr);\r
      gap: 10px\r
    }\r
\r
    .mc {\r
      perspective: 700px;\r
      aspect-ratio: 1/1.05;\r
      border: 0;\r
      background: none;\r
      padding: 0\r
    }\r
\r
    .mc .in {\r
      position: relative;\r
      width: 100%;\r
      height: 100%;\r
      transform-style: preserve-3d;\r
      transition: transform .35s\r
    }\r
\r
    .mc.flip .in {\r
      transform: rotateY(180deg)\r
    }\r
\r
    .mc .f,\r
    .mc .b {\r
      position: absolute;\r
      inset: 0;\r
      backface-visibility: hidden;\r
      -webkit-backface-visibility: hidden;\r
      border: 3px solid var(--ink);\r
      border-radius: 14px;\r
      display: grid;\r
      place-items: center;\r
      padding: 4px;\r
      text-align: center\r
    }\r
\r
    .mc .f {\r
      background: var(--lilac);\r
      font-size: 28px;\r
      box-shadow: 3px 3px 0 var(--ink)\r
    }\r
\r
    .mc .b {\r
      transform: rotateY(180deg);\r
      font-family: var(--head);\r
      font-weight: 800;\r
      font-size: clamp(14px, 3.6vw, 20px);\r
      line-height: 1.1;\r
      word-break: break-word\r
    }\r
\r
    .mc .b.en {\r
      background: #cfe4ff\r
    }\r
\r
    .mc .b.vi {\r
      background: #c6f3e6\r
    }\r
\r
    .mc.done .b {\r
      background: var(--ok);\r
      color: #fff\r
    }\r
\r
    .slots {\r
      display: flex;\r
      gap: 8px;\r
      justify-content: center;\r
      flex-wrap: wrap;\r
      margin: 6px 0 18px\r
    }\r
\r
    .slot {\r
      width: 46px;\r
      height: 56px;\r
      border: 3px dashed var(--ink);\r
      border-radius: 12px;\r
      display: grid;\r
      place-items: center;\r
      font-family: var(--head);\r
      font-weight: 800;\r
      font-size: 28px;\r
      background: #fff;\r
      padding: 0\r
    }\r
\r
    .slot.fill {\r
      border-style: solid;\r
      background: var(--sun);\r
      box-shadow: 2px 2px 0 var(--ink)\r
    }\r
\r
    .slots.win .slot {\r
      background: var(--ok);\r
      color: #fff\r
    }\r
\r
    .slots.err {\r
      animation: shake .35s\r
    }\r
\r
    .tiles {\r
      display: flex;\r
      gap: 9px;\r
      justify-content: center;\r
      flex-wrap: wrap\r
    }\r
\r
    .tl {\r
      width: 52px;\r
      height: 58px;\r
      border: 3px solid var(--ink);\r
      border-radius: 12px;\r
      background: #fff;\r
      font-family: var(--head);\r
      font-weight: 800;\r
      font-size: 28px;\r
      box-shadow: 3px 3px 0 var(--ink)\r
    }\r
\r
    .tl:disabled {\r
      opacity: .2;\r
      box-shadow: none\r
    }\r
\r
    canvas {\r
      display: block;\r
      margin: 0 auto;\r
      border: 3px solid var(--ink);\r
      border-radius: 16px;\r
      touch-action: none;\r
      background: #fff;\r
      max-width: 100%\r
    }\r
\r
    .dpad {\r
      display: grid;\r
      grid-template-columns: repeat(3, 64px);\r
      grid-template-rows: repeat(2, 58px);\r
      gap: 8px;\r
      justify-content: center;\r
      margin-top: 14px\r
    }\r
\r
    .dpad button {\r
      border: 3px solid var(--ink);\r
      border-radius: 14px;\r
      background: #fff;\r
      font-size: 22px;\r
      box-shadow: 3px 3px 0 var(--ink)\r
    }\r
\r
    .dpad button:active {\r
      transform: translate(2px, 2px)\r
    }\r
\r
    .dpad .u {\r
      grid-column: 2\r
    }\r
\r
    .dpad .l {\r
      grid-row: 2;\r
      grid-column: 1\r
    }\r
\r
    .dpad .d {\r
      grid-row: 2;\r
      grid-column: 2\r
    }\r
\r
    .dpad .r {\r
      grid-row: 2;\r
      grid-column: 3\r
    }\r
\r
    .hint {\r
      text-align: center;\r
      font-size: 13px;\r
      color: #5b5a7a;\r
      margin: 10px 0 0\r
    }\r
\r
    #modal {\r
      position: fixed;\r
      inset: 0;\r
      background: rgba(28, 27, 58, .6);\r
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
      font-size: 64px;\r
      line-height: 1;\r
      margin: 8px 0\r
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
      background: var(--paper);\r
      border: 2.5px solid var(--ink);\r
      border-radius: 999px;\r
      padding: 4px 12px;\r
      font-weight: 700;\r
      font-size: 14px\r
    }\r
\r
    #toast {\r
      position: fixed;\r
      left: 50%;\r
      bottom: 24px;\r
      transform: translate(-50%, 120px);\r
      background: var(--ink);\r
      color: #fff;\r
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
    @media (prefers-reduced-motion:reduce) {\r
      * {\r
        animation: none !important;\r
        transition: none !important\r
      }\r
    }\r
\r
    button:focus-visible {\r
      outline: 4px solid var(--sky);\r
      outline-offset: 2px\r
    }\r
  </style>\r
</head>\r
\r
<body>\r
  <div id="app">\r
    <div class="top">\r
      <div class="logo"><i>🎓</i>Học Mà Chơi</div>\r
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
    /* ============ Hàm speak (chỉ game1 cần) ============ */\r
    function speak(t) {\r
      if (!soundOn || !('speechSynthesis' in window)) return;\r
      try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .85; speechSynthesis.speak(u) } catch (e) { }\r
    }\r
\r
    /* ============ Dữ liệu từ vựng & quiz ============ */\r
    const WORDS = [\r
      ['apple', 'quả táo'], ['book', 'quyển sách'], ['teacher', 'giáo viên'], ['school', 'trường học'], ['friend', 'bạn bè'],\r
      ['water', 'nước'], ['happy', 'vui vẻ'], ['family', 'gia đình'], ['house', 'ngôi nhà'], ['cat', 'con mèo'],\r
      ['dog', 'con chó'], ['sun', 'mặt trời'], ['moon', 'mặt trăng'], ['tree', 'cái cây'], ['flower', 'bông hoa'],\r
      ['river', 'dòng sông'], ['mountain', 'ngọn núi'], ['computer', 'máy tính'], ['bicycle', 'xe đạp'], ['breakfast', 'bữa sáng'],\r
      ['rainbow', 'cầu vồng'], ['elephant', 'con voi'], ['library', 'thư viện'], ['umbrella', 'cái ô'], ['window', 'cửa sổ'],\r
      ['chicken', 'con gà'], ['orange', 'quả cam'], ['yellow', 'màu vàng'], ['garden', 'khu vườn'], ['kitchen', 'nhà bếp'],\r
      ['pencil', 'bút chì'], ['bridge', 'cây cầu'], ['planet', 'hành tinh'], ['butterfly', 'con bướm'], ['holiday', 'kỳ nghỉ']\r
    ].map(([en, vi]) => ({ en, vi }));\r
\r
    const QUIZ = [\r
      { q: 'Hành tinh nào gần Mặt Trời nhất?', o: ['Sao Thủy', 'Sao Kim', 'Trái Đất', 'Sao Hỏa'], e: 'Sao Thủy cách Mặt Trời trung bình khoảng 58 triệu km.' },\r
      { q: 'Nước tinh khiết sôi ở bao nhiêu độ C (ở mực nước biển)?', o: ['100°C', '90°C', '80°C', '120°C'], e: 'Ở áp suất khí quyển bình thường, nước sôi ở 100°C.' },\r
      { q: 'Cơ quan nào bơm máu đi khắp cơ thể?', o: ['Tim', 'Phổi', 'Gan', 'Thận'], e: 'Tim co bóp liên tục để đẩy máu đến mọi bộ phận.' },\r
      { q: 'Khí nào cây xanh hấp thụ để quang hợp?', o: ['Khí cacbonic (CO₂)', 'Khí oxi (O₂)', 'Khí nitơ (N₂)', 'Khí hiđro (H₂)'], e: 'Cây dùng CO₂, nước và ánh sáng để tạo chất dinh dưỡng và thải ra oxi.' },\r
      { q: 'Đại dương nào lớn nhất thế giới?', o: ['Thái Bình Dương', 'Đại Tây Dương', 'Ấn Độ Dương', 'Bắc Băng Dương'], e: 'Thái Bình Dương chiếm khoảng một phần ba diện tích bề mặt Trái Đất.' },\r
      { q: 'Trái Đất quay quanh Mặt Trời một vòng mất khoảng bao lâu?', o: ['1 năm', '1 tháng', '1 tuần', '1 ngày'], e: 'Một vòng quanh Mặt Trời khoảng 365 ngày, tức là một năm.' },\r
      { q: 'Động vật nào sau đây là động vật có vú sống dưới nước?', o: ['Cá voi', 'Cá mập', 'Cá ngừ', 'Cá chép'], e: 'Cá voi thở bằng phổi và nuôi con bằng sữa nên là động vật có vú.' },\r
      { q: 'Đỉnh núi nào cao nhất Việt Nam?', o: ['Fansipan', 'Bà Nà', 'Tam Đảo', 'Yên Tử'], e: 'Fansipan cao khoảng 3.143 m, được gọi là "nóc nhà Đông Dương".' },\r
      { q: 'Kim loại nào ở thể lỏng ở nhiệt độ phòng?', o: ['Thủy ngân', 'Sắt', 'Đồng', 'Nhôm'], e: 'Thủy ngân nóng chảy ở khoảng -39°C nên luôn lỏng ở nhiệt độ thường.' },\r
      { q: 'Di sản thiên nhiên thế giới nào nằm ở tỉnh Quảng Ninh?', o: ['Vịnh Hạ Long', 'Phong Nha - Kẻ Bàng', 'Vịnh Nha Trang', 'Đảo Phú Quốc'], e: 'Vịnh Hạ Long nổi tiếng với hàng nghìn đảo đá vôi.' },\r
      { q: 'Số nguyên tố nhỏ nhất là số nào?', o: ['2', '1', '3', '0'], e: 'Số nguyên tố có đúng hai ước là 1 và chính nó. Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất.' },\r
      { q: 'Ánh sáng hay âm thanh truyền nhanh hơn?', o: ['Ánh sáng', 'Âm thanh', 'Bằng nhau', 'Tùy ngày'], e: 'Vì vậy ta thấy tia chớp trước rồi mới nghe tiếng sấm.' },\r
      { q: 'Bộ phận nào của cây hút nước và muối khoáng từ đất?', o: ['Rễ', 'Lá', 'Thân', 'Hoa'], e: 'Rễ có nhiều lông hút giúp cây hút nước và muối khoáng.' },\r
      { q: 'Công thức hóa học của nước là gì?', o: ['H₂O', 'CO₂', 'O₂', 'NaCl'], e: 'Mỗi phân tử nước gồm 2 nguyên tử hiđro và 1 nguyên tử oxi.' },\r
      { q: 'Hành tinh nào được gọi là "hành tinh đỏ"?', o: ['Sao Hỏa', 'Sao Mộc', 'Sao Thổ', 'Sao Thiên Vương'], e: 'Bề mặt Sao Hỏa chứa nhiều oxit sắt nên có màu đỏ gỉ.' },\r
      { q: 'Ai là tác giả của Truyện Kiều?', o: ['Nguyễn Du', 'Nguyễn Trãi', 'Hồ Xuân Hương', 'Nguyễn Đình Chiểu'], e: 'Nguyễn Du (1765-1820) là đại thi hào của dân tộc.' },\r
      { q: 'Xương nào dài nhất trong cơ thể người?', o: ['Xương đùi', 'Xương sườn', 'Xương cánh tay', 'Xương sống'], e: 'Xương đùi vừa dài vừa chắc, chịu sức nặng của cả cơ thể.' },\r
      { q: 'Loài chim nào không biết bay và sống ở vùng cực Nam?', o: ['Chim cánh cụt', 'Đà điểu', 'Chim én', 'Chim bồ câu'], e: 'Chim cánh cụt dùng đôi cánh như mái chèo để bơi rất giỏi.' },\r
      { q: 'Tổng ba góc trong một tam giác bằng bao nhiêu độ?', o: ['180°', '90°', '360°', '270°'], e: 'Với mọi tam giác, tổng ba góc luôn bằng 180°.' },\r
      { q: 'Cầu vồng thường được nói là có mấy màu?', o: ['7 màu', '5 màu', '6 màu', '9 màu'], e: 'Đỏ, cam, vàng, lục, lam, chàm, tím.' },\r
      { q: 'Đơn vị đo lực trong hệ SI là gì?', o: ['Niutơn (N)', 'Kilôgam (kg)', 'Mét (m)', 'Giây (s)'], e: 'Đơn vị được đặt theo tên nhà khoa học Isaac Newton.' },\r
      { q: 'Mặt Trăng là gì của Trái Đất?', o: ['Vệ tinh tự nhiên', 'Một ngôi sao', 'Một hành tinh', 'Một sao chổi'], e: 'Mặt Trăng quay quanh Trái Đất và phản chiếu ánh sáng Mặt Trời.' }\r
    ];\r
\r
    /* ============ GAME 1: ĐUA TOÁN ============ */\r
    function mathGame(root) {\r
      root.innerHTML = \`<div class="panel center"><h2>Chọn độ khó</h2>\r
    <p class="hint">60 giây. Đúng liên tiếp để nhân điểm và được cộng thêm giờ.</p>\r
    <div class="row" style="flex-direction:column">\r
      <button class="btn" data-l="0">Dễ · Cộng trừ trong 25</button>\r
      <button class="btn sky" data-l="1">Vừa · Nhân chia bảng cửu chương</button>\r
      <button class="btn" style="background:var(--tomato);color:#fff" data-l="2">Khó · Phép tính nhiều bước</button>\r
    </div></div>\`;\r
      root.onclick = e => { const b = e.target.closest('[data-l]'); if (b) run(+b.dataset.l) };\r
      function run(level) {\r
        root.onclick = null;\r
        let score = 0, combo = 0, maxCombo = 0, right = 0, total = 0, time = 60, q, lock = false;\r
        root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="cb">🔥 x1</span><span>⏱ <b id="tm">60</b>s</span></div>\r
      <div class="timebar"><i id="tb"></i></div><div class="qbox" id="q"></div><div class="opts" id="o"></div>\`;\r
        const next = () => {\r
          q = genMath(level); const opts = makeOpts(q.ans, 4);\r
          $('#q').textContent = q.text + ' = ?'; $('#q').classList.remove('pop'); void $('#q').offsetWidth; $('#q').classList.add('pop');\r
          $('#o').innerHTML = opts.map(v => \`<button class="opt" data-v="\${v}">\${v}</button>\`).join('');\r
          lock = false;\r
        };\r
        const mult = () => Math.min(4, 1 + Math.floor(combo / 5));\r
        const hud = () => { $('#sc').textContent = score; $('#cb').textContent = \`🔥 x\${mult()} (\${combo})\`; $('#tm').textContent = Math.ceil(time); $('#tb').style.width = Math.min(100, time / 60 * 100) + '%' };\r
        root.onclick = e => {\r
          const b = e.target.closest('.opt'); if (!b || lock) return; lock = true; total++;\r
          if (+b.dataset.v === q.ans) {\r
            right++; combo++; maxCombo = Math.max(maxCombo, combo); score += 10 * mult(); sfx.ok(); b.classList.add('ok');\r
            if (combo % 5 === 0) { time = Math.min(75, time + 2); toast('⏱ +2 giây! Chuỗi ' + combo) }\r
            if (combo >= 10) S.flags.combo10 = true;\r
          } else {\r
            combo = 0; time = Math.max(0, time - 2); sfx.bad(); b.classList.add('bad');\r
            [...root.querySelectorAll('.opt')].find(x => +x.dataset.v === q.ans).classList.add('ok');\r
          }\r
          hud(); T.set(next, combo ? 250 : 600);\r
        };\r
        T.int(() => {\r
          time -= .1; hud();\r
          if (time <= 0) {\r
            T.clear();\r
            finish({\r
              id: 'math', score, xp: Math.round(score / 8) + (right ? 5 : 0),\r
              lines: [\`Đúng \${right}/\${total} câu\`, \`Chuỗi dài nhất \${maxCombo}\`],\r
              replay: mathGame,\r
              details: { level, right, total, maxCombo }\r
            });\r
          }\r
        }, 100);\r
        next(); hud();\r
      }\r
    }\r
\r
    /* ============ GAME 2: LẬT THẺ ANH – VIỆT ============ */\r
    function memoryGame(root) {\r
      const pairs = shuffle(WORDS).slice(0, 8);\r
      const cards = shuffle(pairs.flatMap((w, i) => [{ p: i, t: w.en, l: 'en' }, { p: i, t: w.vi, l: 'vi' }]));\r
      let open = [], lock = false, moves = 0, matched = 0, secs = 0;\r
      root.innerHTML = \`<div class="hud"><span>👣 <b id="mv">0</b> lượt</span><span>🧩 <b id="pr">0</b>/8</span><span>⏱ <b id="tm">0</b>s</span></div>\r
    <div class="mem" id="mem">\${cards.map((c, i) => \`<button class="mc" data-i="\${i}" aria-label="Thẻ \${i + 1}"><div class="in"><div class="f">❓</div><div class="b \${c.l}">\${c.t}</div></div></button>\`).join('')}</div>\r
    <p class="hint">Tìm cặp từ tiếng Anh và nghĩa tiếng Việt. Chạm thẻ tiếng Anh để nghe phát âm.</p>\`;\r
      const els = [...root.querySelectorAll('.mc')];\r
      T.int(() => { secs++; $('#tm').textContent = secs }, 1000);\r
      root.onclick = e => {\r
        const el = e.target.closest('.mc'); if (!el || lock) return;\r
        const i = +el.dataset.i;\r
        if (el.classList.contains('flip') || el.classList.contains('done')) return;\r
        el.classList.add('flip'); sfx.tick();\r
        if (cards[i].l === 'en') speak(cards[i].t);\r
        open.push(i);\r
        if (open.length === 2) {\r
          moves++; $('#mv').textContent = moves; lock = true;\r
          const [a, b] = open;\r
          if (cards[a].p === cards[b].p && cards[a].l !== cards[b].l) {\r
            T.set(() => {\r
              els[a].classList.add('done'); els[b].classList.add('done'); matched++; $('#pr').textContent = matched; sfx.ok(); open = []; lock = false;\r
              if (matched === 8) {\r
                const score = Math.max(20, 300 - moves * 8 - secs);\r
                if (moves <= 11) S.flags.memGold = true;\r
                T.clear();\r
                finish({\r
                  id: 'memory', score, xp: Math.round(score / 5) + 10,\r
                  lines: [\`\${moves} lượt lật\`, \`\${secs} giây\`],\r
                  replay: memoryGame,\r
                  details: { moves, secs }\r
                });\r
              }\r
            }, 450);\r
          } else {\r
            T.set(() => { els[a].classList.remove('flip'); els[b].classList.remove('flip'); open = []; lock = false }, 900);\r
          }\r
        }\r
      };\r
    }\r
\r
    /* ============ GAME 3: XẾP CHỮ ============ */\r
    function scrambleGame(root) {\r
      const words = shuffle(WORDS).slice(0, 8);\r
      let i = 0, score = 0, solved = 0, w, tiles, ans, hintsWord = 0, busy = false;\r
      function load() {\r
        w = words[i]; const L = [...w.en.toUpperCase()];\r
        let t; do { t = shuffle(L) } while (t.join('') === L.join(''));\r
        tiles = t.map(ch => ({ ch, used: false })); ans = []; hintsWord = 0; busy = false; render();\r
      }\r
      function render() {\r
        root.innerHTML = \`<div class="hud"><span>Từ <b>\${i + 1}/\${words.length}</b></span><span>⭐ <b>\${score}</b></span></div>\r
      <div class="qbox txt"><div>Nghĩa tiếng Việt<small></small><span style="font-family:var(--head);font-size:1.5em;font-weight:800">\${w.vi}</span><small>\${w.en.length} chữ cái. Sắp xếp thành từ tiếng Anh.</small></div></div>\r
      <div class="slots" id="slots">\${[...w.en].map((_, k) => { const t = ans[k] !== undefined ? tiles[ans[k]].ch : ''; return \`<button class="slot \${t ? 'fill' : ''}" data-s="\${k}">\${t}</button>\` }).join('')}</div>\r
      <div class="tiles">\${tiles.map((t, k) => \`<button class="tl" data-t="\${k}" \${t.used ? 'disabled' : ''}>\${t.ch}</button>\`).join('')}</div>\r
      <div class="row"><button class="btn alt" data-a="hint">💡 Gợi ý (−4 điểm)</button><button class="btn alt" data-a="skip">Bỏ qua</button></div>\`;\r
      }\r
      function add(k) {\r
        if (busy || tiles[k].used || ans.length >= w.en.length) return;\r
        tiles[k].used = true; ans.push(k); sfx.tick(); render();\r
        if (ans.length === w.en.length) check();\r
      }\r
      function check() {\r
        const guess = ans.map(k => tiles[k].ch).join('').toLowerCase();\r
        busy = true;\r
        if (guess === w.en) {\r
          const pts = Math.max(5, 15 - hintsWord * 4); score += pts; solved++; sfx.ok(); speak(w.en);\r
          $('#slots').classList.add('win');\r
          T.set(() => { i++; i < words.length ? load() : end() }, 1100);\r
        } else {\r
          sfx.bad(); $('#slots').classList.add('err');\r
          T.set(() => { tiles.forEach(t => t.used = false); ans = []; busy = false; render() }, 450);\r
        }\r
      }\r
      function hint() {\r
        if (busy) return;\r
        const target = [...w.en.toUpperCase()];\r
        let ok = ans.every((k, n) => tiles[k].ch === target[n]);\r
        if (!ok) { tiles.forEach(t => t.used = false); ans = [] }\r
        const need = target[ans.length];\r
        const k = tiles.findIndex(t => !t.used && t.ch === need);\r
        if (k < 0) return;\r
        hintsWord++; score = Math.max(0, score - 4); add(k);\r
      }\r
      function end() {\r
        finish({\r
          id: 'scramble', score, xp: Math.round(score / 3) + solved,\r
          lines: [\`Giải được \${solved}/\${words.length} từ\`],\r
          replay: scrambleGame,\r
          details: { solved }\r
        });\r
      }\r
      root.onclick = e => {\r
        const t = e.target.closest('[data-t]'), s = e.target.closest('[data-s]'), a = e.target.closest('[data-a]');\r
        if (t) add(+t.dataset.t);\r
        else if (s && !busy) { const k = +s.dataset.s; if (ans[k] !== undefined) { const idx = ans.splice(k, 1)[0]; tiles[idx].used = false; render() } }\r
        else if (a) {\r
          if (a.dataset.a === 'hint') hint();\r
          else if (!busy) { i++; i < words.length ? load() : end() }\r
        }\r
      };\r
      onKey = e => {\r
        if (busy) return;\r
        if (e.key === 'Backspace' && ans.length) { const idx = ans.pop(); tiles[idx].used = false; render(); return }\r
        if (/^[a-zA-Z]$/.test(e.key)) { const k = tiles.findIndex(t => !t.used && t.ch === e.key.toUpperCase()); if (k >= 0) add(k) }\r
      };\r
      load();\r
    }\r
\r
    /* ============ GAME 4: ĐỐ VUI KHOA HỌC ============ */\r
    function quizGame(root) {\r
      const qs = shuffle(QUIZ).slice(0, 10).map(q => ({ ...q, opts: shuffle(q.o.map((t, k) => ({ t, c: k === 0 }))) }));\r
      let i = 0, score = 0, right = 0, streak = 0, fifty = true, time = 15, done = false;\r
      function show() {\r
        const q = qs[i]; done = false; time = 15;\r
        root.innerHTML = \`<div class="hud"><span>Câu <b>\${i + 1}/10</b></span><span>⭐ <b>\${score}</b></span><span>🔥 \${streak}</span></div>\r
      <div class="timebar"><i id="tb"></i></div>\r
      <div class="qbox txt">\${q.q}</div>\r
      <div class="opts one" id="o">\${q.opts.map((o, k) => \`<button class="opt" data-k="\${k}">\${o.t}</button>\`).join('')}</div>\r
      <div class="row" id="ll"><button class="btn alt" data-ll="1" \${fifty ? '' : 'disabled'}>✂️ 50:50</button></div>\r
      <div id="ex"></div>\`;\r
      }\r
      function answer(k) {\r
        if (done) return; done = true;\r
        const q = qs[i], btns = [...root.querySelectorAll('.opt')];\r
        btns.forEach(b => b.classList.remove('gone'));\r
        const ci = q.opts.findIndex(o => o.c);\r
        btns[ci].classList.add('ok');\r
        if (k === ci) { right++; streak++; score += 10 + Math.ceil(time) + (streak >= 3 ? 5 : 0); sfx.ok(); }\r
        else { streak = 0; sfx.bad(); if (k >= 0) btns[k].classList.add('bad'); }\r
        $('#ll').innerHTML = \`<button class="btn" data-next="1">\${i < 9 ? 'Câu tiếp theo' : 'Xem kết quả'}</button>\`;\r
        $('#ex').innerHTML = \`<div class="explain">💡 \${k === -1 ? 'Hết giờ! ' : ''}\${q.e}</div>\`;\r
      }\r
      root.onclick = e => {\r
        const o = e.target.closest('.opt'), l = e.target.closest('[data-ll]'), n = e.target.closest('[data-next]');\r
        if (o) answer(+o.dataset.k);\r
        else if (l && fifty && !done) {\r
          fifty = false; const q = qs[i];\r
          const wrong = shuffle(q.opts.map((x, k) => k).filter(k => !q.opts[k].c)).slice(0, 2);\r
          const btns = [...root.querySelectorAll('.opt')]; wrong.forEach(k => btns[k].classList.add('gone'));\r
          l.disabled = true;\r
        } else if (n) {\r
          i++;\r
          if (i < 10) show();\r
          else {\r
            if (right === 10) S.flags.perfect = true;\r
            T.clear();\r
            finish({\r
              id: 'quiz', score, xp: Math.round(score / 4),\r
              lines: [\`Đúng \${right}/10 câu\`],\r
              replay: quizGame,\r
              details: { right }\r
            });\r
          }\r
        }\r
      };\r
      T.int(() => {\r
        if (done) return;\r
        time -= .1; const tb = $('#tb'); if (tb) tb.style.width = Math.max(0, time / 15 * 100) + '%';\r
        if (time <= 0) answer(-1);\r
      }, 100);\r
      show();\r
    }\r
\r
    /* ============ GAME 5: RẮN SĂN ĐÁP ÁN ============ */\r
    function snakeGame(root) {\r
      const N = 15;\r
      root.innerHTML = \`<div class="hud"><span>⭐ <b id="sc">0</b></span><span id="lv">❤️❤️❤️</span><span>Dài <b id="ln">3</b></span></div>\r
    <div class="qbox" id="q" style="min-height:74px;font-size:clamp(28px,7vw,44px)"></div>\r
    <canvas id="cv"></canvas>\r
    <div class="dpad"><button class="u" data-d="u">▲</button><button class="l" data-d="l">◀</button><button class="d" data-d="d">▼</button><button class="r" data-d="r">▶</button></div>\r
    <p class="hint">Điều khiển rắn ăn đáp án đúng. Vuốt, dùng phím mũi tên hoặc bấm nút.</p>\`;\r
      const cv = $('#cv'), ctx = cv.getContext('2d');\r
      const size = Math.floor(Math.min(root.clientWidth - 8, 450) / N) * N;\r
      cv.width = cv.height = size; cv.style.width = cv.style.height = size + 'px';\r
      const cell = size / N;\r
      let snake, dir, queue, started, foods, q, score = 0, lives = 3, correct = 0, speed = 190;\r
      const level = () => correct < 6 ? 0 : 1;\r
      function reset() { snake = [{ x: 4, y: 7 }, { x: 3, y: 7 }, { x: 2, y: 7 }]; dir = { x: 1, y: 0 }; queue = []; started = false; placeFoods() }\r
      function free(x, y) { return !snake.some(s => s.x === x && s.y === y) && !(foods || []).some(f => f.x === x && f.y === y) }\r
      function newQ() {\r
        q = genMath(level());\r
        const opts = makeOpts(q.ans, 3);\r
        $('#q').textContent = q.text + ' = ?';\r
        return opts;\r
      }\r
      function placeFoods(opts) {\r
        if (!opts) { if (!q) opts = newQ(); else opts = foods ? foods.map(f => f.v) : newQ() }\r
        foods = [];\r
        opts.forEach(v => {\r
          let x, y, g = 0;\r
          do { x = rnd(0, N - 1); y = rnd(0, N - 1); g++ } while ((!free(x, y) || Math.abs(x - snake[0].x) + Math.abs(y - snake[0].y) < 4) && g < 300);\r
          foods.push({ x, y, v, c: v === q.ans });\r
        });\r
      }\r
      function setDir(dx, dy) {\r
        const last = queue.length ? queue[queue.length - 1] : dir;\r
        if ((last.x === -dx && last.y === -dy) || (last.x === dx && last.y === dy)) return;\r
        if (queue.length < 2) queue.push({ x: dx, y: dy });\r
        started = true;\r
      }\r
      const DIRS = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };\r
      root.onclick = e => { const b = e.target.closest('[data-d]'); if (b) setDir(...DIRS[b.dataset.d]) };\r
      onKey = e => {\r
        const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r', w: 'u', s: 'd', a: 'l', d: 'r' }[e.key];\r
        if (m) { e.preventDefault(); setDir(...DIRS[m]) }\r
      };\r
      let sx, sy;\r
      cv.ontouchstart = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY };\r
      cv.ontouchend = e => {\r
        const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;\r
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;\r
        if (Math.abs(dx) > Math.abs(dy)) setDir(dx > 0 ? 1 : -1, 0); else setDir(0, dy > 0 ? 1 : -1);\r
      };\r
      function loseLife() {\r
        lives--; sfx.bad(); $('#lv').textContent = lives > 0 ? '❤️'.repeat(lives) : '💔';\r
        if (lives <= 0) {\r
          T.clear();\r
          finish({\r
            id: 'snake', score, xp: Math.round(score / 6),\r
            lines: [\`Ăn đúng \${correct} đáp án\`, \`Rắn dài \${snake.length}\`],\r
            replay: snakeGame,\r
            details: { correct, length: snake.length }\r
          });\r
          return false;\r
        }\r
        return true;\r
      }\r
      function tick() {\r
        if (started) {\r
          if (queue.length) dir = queue.shift();\r
          const h = { x: (snake[0].x + dir.x + N) % N, y: (snake[0].y + dir.y + N) % N };\r
          if (snake.some(s => s.x === h.x && s.y === h.y)) { if (!loseLife()) return; reset(); }\r
          else {\r
            snake.unshift(h);\r
            const fi = foods.findIndex(f => f.x === h.x && f.y === h.y);\r
            if (fi >= 0) {\r
              if (foods[fi].c) { score += 15; correct++; sfx.ok(); speed = Math.max(95, speed - 6); placeFoods(newQ()); }\r
              else { foods.splice(fi, 1); snake.pop(); if (!loseLife()) return; }\r
            } else snake.pop();\r
          }\r
          $('#sc').textContent = score; $('#ln').textContent = snake.length;\r
        }\r
        draw(); T.set(tick, speed);\r
      }\r
      function draw() {\r
        for (let y = 0; y < N; y++)for (let x = 0; x < N; x++) { ctx.fillStyle = (x + y) % 2 ? '#fff6d9' : '#fffdf3'; ctx.fillRect(x * cell, y * cell, cell, cell) }\r
        foods.forEach((f, k) => {\r
          const cx = f.x * cell + cell / 2, cy = f.y * cell + cell / 2;\r
          ctx.fillStyle = ['#4b9dff', '#a184ff', '#ff6b57'][k % 3]; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2.5;\r
          ctx.beginPath(); ctx.arc(cx, cy, cell * .46, 0, 7); ctx.fill(); ctx.stroke();\r
          ctx.fillStyle = '#fff'; ctx.font = \`800 \${cell * (String(f.v).length > 2 ? .42 : .52)}px Baloo 2,system-ui,sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
          ctx.fillText(f.v, cx, cy + 1);\r
        });\r
        snake.forEach((s, k) => {\r
          const pad = k ? cell * .1 : cell * .04;\r
          ctx.fillStyle = k ? (k % 2 ? '#2fc9a5' : '#27b393') : '#1c1b3a'; ctx.strokeStyle = '#1c1b3a'; ctx.lineWidth = 2;\r
          ctx.beginPath(); ctx.roundRect(s.x * cell + pad, s.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * .28); ctx.fill(); if (k) ctx.stroke();\r
        });\r
        const h = snake[0]; ctx.fillStyle = '#fff';\r
        [[.3, .35], [.7, .35]].forEach(([ex, ey]) => { ctx.beginPath(); ctx.arc(h.x * cell + cell * ex, h.y * cell + cell * ey, cell * .12, 0, 7); ctx.fill() });\r
        if (!started) {\r
          ctx.fillStyle = 'rgba(28,27,58,.78)'; ctx.fillRect(0, size / 2 - 28, size, 56);\r
          ctx.fillStyle = '#fff'; ctx.font = \`700 \${Math.max(14, size / 24)}px Be Vietnam Pro,system-ui,sans-serif\`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';\r
          ctx.fillText('Vuốt hoặc bấm mũi tên để bắt đầu', size / 2, size / 2);\r
        }\r
      }\r
      reset(); draw(); T.set(tick, speed);\r
    }\r
\r
    /* ============ Khởi động ============ */\r
    const GAMES = [\r
      { id: 'math', name: 'Đua Toán', tag: 'Toán', color: 'var(--sun)', icon: '🚀', desc: '60 giây tính nhẩm. Chuỗi đúng liên tiếp nhân điểm và cộng thêm giờ.', fn: mathGame },\r
      { id: 'memory', name: 'Lật Thẻ Anh – Việt', tag: 'Tiếng Anh', color: '#bfe0ff', icon: '🃏', desc: 'Ghép từ tiếng Anh với nghĩa tiếng Việt, có phát âm khi lật thẻ.', fn: memoryGame },\r
      { id: 'scramble', name: 'Xếp Chữ', tag: 'Tiếng Anh', color: '#ffd0c9', icon: '🔤', desc: 'Sắp xếp các chữ cái bị xáo trộn thành từ đúng. Gõ bàn phím hoặc chạm.', fn: scrambleGame },\r
      { id: 'quiz', name: 'Đố Vui Khoa Học', tag: 'Khoa học', color: '#d6ccff', icon: '🔬', desc: '10 câu hỏi kiến thức, có 50:50 và lời giải thích sau mỗi câu.', fn: quizGame },\r
      { id: 'snake', name: 'Rắn Săn Đáp Án', tag: 'Toán · Phản xạ', color: '#c6f3e6', icon: '🐍', desc: 'Điều khiển rắn ăn đúng đáp án của phép tính. Ăn sai mất tim.', fn: snakeGame },\r
    ];\r
\r
    initCore({\r
      games: GAMES,\r
      storageKey: 'hmc_game1',\r
      hubTitle: 'Chơi một ván, học một điều.',\r
      hubDesc: 'Năm trò chơi ngắn về Toán, Tiếng Anh và Khoa học. Chơi để kiếm XP, lên cấp và mở huy hiệu.',\r
      badges: [\r
        { id: 'first', n: 'Khởi động', i: '🌱', ok: () => S.games >= 1 },\r
        { id: 'all', n: 'Thử đủ 5 game', i: '🧭', ok: () => S.played.size >= 5 },\r
        { id: 'combo', n: 'Chuỗi 10 câu', i: '🔥', ok: () => S.flags.combo10 },\r
        { id: 'mem', n: 'Trí nhớ vàng', i: '🧠', ok: () => S.flags.memGold },\r
        { id: 'perfect', n: 'Đúng 10/10', i: '💯', ok: () => S.flags.perfect },\r
        { id: 'lv3', n: 'Đạt cấp 3', i: '⭐', ok: () => lvl() >= 3 },\r
      ],\r
    });\r
  <\/script>\r
</body>\r
\r
</html>`,c=n(),l={id:`hmc-game1`,code:`hmc-game1`,name:`Học Mà Chơi`,title:`Học Mà Chơi - 5 Trò Chơi`,subject:`Nhiều môn`};function u(){let{user:e,token:t}=r(),n=e?{user:e,token:t}:null,[u,d]=(0,o.useState)(0),f=(0,o.useCallback)(()=>i(`/`),[]);return(0,c.jsx)(`div`,{className:`fixed inset-0 bg-paper`,children:(0,c.jsx)(a,{htmlContent:s,game:l,questions:[],playerName:e?.fullName||e?.username||`An Nhiên`,playMode:`solo`,userAuth:n,onFinish:()=>{},onQuit:f,onStateUpdate:()=>{}},`hmc-game1-${u}`)})}export{u as default};