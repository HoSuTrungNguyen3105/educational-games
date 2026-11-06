var e=`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
    <meta charset="UTF-8" />\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />\r
    <title>🌀 Labyrinth - Cực Khó</title>\r
    <link rel="preconnect" href="https://fonts.googleapis.com">\r
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet">\r
    <style>\r
        /* ===== RESET & GLOBAL ===== */\r
        * {\r
            margin: 0;\r
            padding: 0;\r
            box-sizing: border-box;\r
            user-select: none;\r
        }\r
\r
        body {\r
            font-family: var(--body,"Be Vietnam Pro","Segoe UI",system-ui,sans-serif);\r
            background-color: var(--paper,#fff6e7);\r
            background-image: linear-gradient(var(--line,#e6dcc4) 1px, transparent 1px), linear-gradient(90deg, var(--line,#e6dcc4) 1px, transparent 1px);\r
            background-size: 28px 28px;\r
            display: flex;\r
            justify-content: center;\r
            align-items: center;\r
            min-height: 100vh;\r
            margin: 0;\r
            padding: 12px;\r
            transition: background 0.5s ease;\r
        }\r
\r
        .game-container {\r
            max-width: 960px;\r
            padding: 8px 10px 12px;\r
            border-radius: 24px;\r
            background: var(--card,#fffbf2);\r
            border: 3px solid var(--ink,#1d2e4a);\r
            box-shadow: 4px 4px 0 var(--ink,#1d2e4a);\r
        }\r
\r
        .header {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            flex-wrap: wrap;\r
            gap: 12px;\r
            margin-bottom: 18px;\r
        }\r
\r
        .title {\r
            font-size: 22px;\r
            font-weight: 800;\r
            font-family: var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
            color: var(--tomato,#e4572e);\r
            letter-spacing: 0.5px;\r
            display: flex;\r
            align-items: center;\r
            gap: 8px;\r
        }\r
\r
        .title span {\r
            font-size: 26px;\r
        }\r
\r
        .stats {\r
            display: flex;\r
            gap: 20px;\r
            align-items: center;\r
            font-size: 15px;\r
            font-weight: 500;\r
            color: var(--ink2,#16233a);\r
        }\r
\r
        .stats .stat-item {\r
            display: flex;\r
            align-items: center;\r
            gap: 6px;\r
            background: var(--bg,#fff3de);\r
            padding: 6px 14px;\r
            border-radius: 30px;\r
            border: 2.5px solid var(--ink,#1d2e4a);\r
            box-shadow: 2px 2px 0 var(--ink,#1d2e4a);\r
        }\r
\r
        .stats .stat-item .icon {\r
            font-size: 18px;\r
        }\r
\r
        .stats .stat-value {\r
            color: var(--tomato,#e4572e);\r
            font-weight: 700;\r
            min-width: 24px;\r
        }\r
\r
        .maze-wrapper {\r
            position: relative;\r
            width: 100%;\r
            padding-bottom: 100%;\r
            height: 0;\r
            background: #070b10;\r
            border-radius: 20px;\r
            overflow: hidden;\r
            border: 3px solid var(--ink,#1d2e4a);\r
            box-shadow: 4px 4px 0 var(--ink,#1d2e4a);\r
            touch-action: none;\r
        }\r
\r
        #mazeCanvas {\r
            position: absolute;\r
            top: 0;\r
            left: 0;\r
            width: 100%;\r
            height: 100%;\r
            display: block;\r
            background: #070b10;\r
            image-rendering: crisp-edges;\r
            touch-action: none;\r
        }\r
\r
        .overlay {\r
            position: absolute;\r
            inset: 0;\r
            display: flex;\r
            flex-direction: column;\r
            justify-content: center;\r
            align-items: center;\r
            background-color: rgba(255,246,231,0.97);\r
            background-image: linear-gradient(var(--line,#e6dcc4) 1px, transparent 1px), linear-gradient(90deg, var(--line,#e6dcc4) 1px, transparent 1px);\r
            background-size: 28px 28px;\r
            backdrop-filter: blur(10px);\r
            padding: 24px;\r
            text-align: center;\r
            opacity: 0;\r
            pointer-events: none;\r
            transition: opacity 0.4s ease, transform 0.3s ease;\r
            transform: scale(0.97);\r
            border-radius: 20px;\r
        }\r
\r
        .overlay.show {\r
            opacity: 1;\r
            pointer-events: auto;\r
            transform: scale(1);\r
        }\r
\r
        .overlay h2 {\r
            font-size: 28px;\r
            font-weight: 800;\r
            font-family: var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
            margin-bottom: 8px;\r
            color: var(--tomato,#e4572e);\r
        }\r
\r
        .overlay p {\r
            font-size: 16px;\r
            color: var(--ink2,#16233a);\r
            margin-bottom: 6px;\r
            max-width: 340px;\r
            line-height: 1.5;\r
        }\r
\r
        .overlay .highlight {\r
            color: var(--tomato,#e4572e);\r
            font-weight: 600;\r
        }\r
\r
        .btn {\r
            background: var(--card,#fffbf2);\r
            padding: 12px 32px;\r
            border-radius: 14px;\r
            font-size: 16px;\r
            font-weight: 800;\r
            font-family: var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
            color: var(--ink,#1d2e4a);\r
            cursor: pointer;\r
            transition: 0.2s;\r
            margin-top: 16px;\r
            border: 3px solid var(--ink,#1d2e4a);\r
            box-shadow: 3px 3px 0 var(--ink,#1d2e4a);\r
            display: inline-flex;\r
            align-items: center;\r
            gap: 10px;\r
        }\r
\r
        .btn-primary {\r
            background: var(--sun,#f4b942);\r
            color: var(--ink,#1d2e4a);\r
            border-color: var(--ink,#1d2e4a);\r
            box-shadow: 3px 3px 0 var(--ink,#1d2e4a);\r
        }\r
\r
        .btn-primary:hover {\r
            transform: translate(-1px, -1px);\r
            box-shadow: 5px 5px 0 var(--ink,#1d2e4a);\r
            background: var(--sun,#f4b942);\r
        }\r
\r
        .btn-primary:active {\r
            transform: translate(3px, 3px);\r
            box-shadow: 0 0 0 var(--ink,#1d2e4a);\r
        }\r
\r
        .btn-secondary {\r
            background: var(--card,#fffbf2);\r
            border-color: var(--ink,#1d2e4a);\r
        }\r
\r
        .btn-secondary:hover {\r
            background: var(--bg,#fff3de);\r
        }\r
\r
        .btn-group {\r
            display: flex;\r
            gap: 12px;\r
            flex-wrap: wrap;\r
            justify-content: center;\r
            margin-top: 8px;\r
        }\r
\r
        .controls {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            flex-wrap: wrap;\r
            gap: 12px;\r
            margin-top: 16px;\r
        }\r
\r
        .controls .hint {\r
            font-size: 13px;\r
            color: var(--ink2,#16233a);\r
            display: flex;\r
            align-items: center;\r
            gap: 12px;\r
        }\r
\r
        .controls .hint kbd {\r
            display: inline-block;\r
            background: var(--bg,#fff3de);\r
            padding: 4px 10px;\r
            border-radius: 6px;\r
            font-size: 12px;\r
            font-weight: 600;\r
            color: var(--ink,#1d2e4a);\r
            border: 2px solid var(--ink,#1d2e4a);\r
            font-family: inherit;\r
        }\r
\r
        .controls .hint .touch-hint {\r
            display: none;\r
        }\r
\r
        .btn-icon {\r
            background: var(--card,#fffbf2);\r
            color: var(--ink,#1d2e4a);\r
            width: 42px;\r
            height: 42px;\r
            border-radius: 14px;\r
            font-size: 18px;\r
            cursor: pointer;\r
            transition: 0.2s;\r
            border: 3px solid var(--ink,#1d2e4a);\r
            box-shadow: 3px 3px 0 var(--ink,#1d2e4a);\r
            display: inline-flex;\r
            align-items: center;\r
            justify-content: center;\r
        }\r
\r
        .btn-icon:hover {\r
            background: var(--bg,#fff3de);\r
            color: var(--ink,#1d2e4a);\r
        }\r
\r
        .level-selector {\r
            display: flex;\r
            align-items: center;\r
            gap: 8px;\r
        }\r
\r
        .difficulty-group {\r
            display: flex;\r
            background: var(--bg,#fff3de);\r
            border: 2.5px solid var(--ink,#1d2e4a);\r
            border-radius: 30px;\r
            padding: 3px;\r
            gap: 2px;\r
        }\r
\r
        .difficulty-group button {\r
            border: none;\r
            background: transparent;\r
            color: var(--ink2,#16233a);\r
            font-family: inherit;\r
            font-size: 13px;\r
            font-weight: 600;\r
            padding: 7px 16px;\r
            border-radius: 24px;\r
            cursor: pointer;\r
            transition: 0.2s;\r
        }\r
\r
        .difficulty-group button:hover {\r
            color: var(--ink,#1d2e4a);\r
        }\r
\r
        .difficulty-group button.active {\r
            background: var(--sun,#f4b942);\r
            color: var(--ink,#1d2e4a);\r
            box-shadow: 2px 2px 0 var(--ink,#1d2e4a);\r
        }\r
\r
        @media (max-width: 600px) {\r
            .game-container {\r
                padding: 16px 12px 16px;\r
                border-radius: 24px;\r
            }\r
\r
            .title {\r
                font-size: 18px;\r
            }\r
            .title span {\r
                font-size: 22px;\r
            }\r
\r
            .stats {\r
                font-size: 13px;\r
                gap: 10px;\r
            }\r
            .stats .stat-item {\r
                padding: 4px 10px;\r
            }\r
\r
            .overlay h2 {\r
                font-size: 22px;\r
            }\r
            .overlay p {\r
                font-size: 14px;\r
            }\r
\r
            .btn {\r
                padding: 10px 24px;\r
                font-size: 14px;\r
            }\r
\r
            .controls .hint .desktop-hint {\r
                display: none;\r
            }\r
            .controls .hint .touch-hint {\r
                display: inline;\r
            }\r
\r
            .difficulty-group button {\r
                font-size: 12px;\r
                padding: 6px 12px;\r
            }\r
            .btn-icon {\r
                width: 38px;\r
                height: 38px;\r
                font-size: 16px;\r
            }\r
        }\r
\r
        @media (max-width: 420px) {\r
            .header {\r
                flex-direction: column;\r
                align-items: stretch;\r
                gap: 8px;\r
            }\r
            .stats {\r
                justify-content: space-between;\r
            }\r
            .controls {\r
                flex-direction: column;\r
                align-items: stretch;\r
            }\r
            .controls .hint {\r
                justify-content: center;\r
            }\r
            .level-selector {\r
                justify-content: center;\r
            }\r
        }\r
\r
        @keyframes pulse {\r
            0%,\r
            100% {\r
                transform: scale(1);\r
            }\r
            50% {\r
                transform: scale(1.05);\r
            }\r
        }\r
\r
        .pulse {\r
            animation: pulse 1.2s ease-in-out infinite;\r
        }\r
\r
        @keyframes float {\r
            0%,\r
            100% {\r
                transform: translateY(0);\r
            }\r
            50% {\r
                transform: translateY(-6px);\r
            }\r
        }\r
\r
        .float {\r
            animation: float 2s ease-in-out infinite;\r
        }\r
    </style>\r
</head>\r
<body>\r
\r
    <div class="game-container" id="app">\r
        <!-- Header -->\r
        <div class="header">\r
            <div class="title">\r
                <span>🌀</span> Labyrinth\r
            </div>\r
            <div class="stats">\r
                <div class="stat-item">\r
                    <span class="icon">⏱️</span>\r
                    <span class="stat-value" id="timerDisplay">00</span>\r
                </div>\r
                <div class="stat-item">\r
                    <span class="icon">🏆</span>\r
                    <span class="stat-value" id="levelDisplay">1</span>\r
                </div>\r
                <div class="stat-item">\r
                    <span class="icon">⭐</span>\r
                    <span class="stat-value" id="scoreDisplay">0</span>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Maze -->\r
        <div class="maze-wrapper" id="mazeWrapper">\r
            <canvas id="mazeCanvas" width="600" height="600"></canvas>\r
\r
            <div class="overlay show" id="startOverlay">\r
                <h2>🌀 Labyrinth</h2>\r
                <p>Mê cung tối tăm — lối ra chìm trong bóng tối.<br />Hãy tìm đường thoát trước khi thời gian cạn.</p>\r
                <p style="font-size:14px; color:#5a6678; margin-top:4px;">\r
                    <kbd style="background:var(--bg,#fff3de); color:var(--ink,#1d2e4a); padding:2px 8px; border-radius:4px; border:2px solid var(--ink,#1d2e4a);">↑ ↓ ← →</kbd> hoặc kéo / chạm\r
                </p>\r
                <p id="saveInfo" style="display:none; font-size:14px;">💾 Đã lưu chiến dịch: <span class="highlight" id="saveInfoText"></span></p>\r
                <div class="btn-group">\r
                    <button class="btn btn-primary" id="startBtn">▶ BẮT ĐẦU</button>\r
                    <button class="btn btn-secondary" id="newGameBtn" style="display:none;">🔄 CHƠI MỚI</button>\r
                </div>\r
            </div>\r
\r
            <div class="overlay" id="winOverlay">\r
                <h2>🎉 TÌM RA LỐI!</h2>\r
                <p>Bạn đã vượt qua mê cung cấp <span class="highlight" id="winLevel">1</span></p>\r
                <p style="font-size:14px;">Thời gian: <span class="highlight" id="winTime">0</span>s</p>\r
                <div class="btn-group">\r
                    <button class="btn btn-primary" id="nextBtn">▶ CẤP TIẾP</button>\r
                    <button class="btn btn-secondary" id="retryBtn">🔄 LÀM LẠI</button>\r
                </div>\r
            </div>\r
\r
            <div class="overlay" id="gameOverOverlay">\r
                <h2>⏰ HẾT GIỜ!</h2>\r
                <p>Bạn đã không tìm ra lối ra kịp lúc.</p>\r
                <p style="font-size:14px;">Cấp độ <span class="highlight" id="goLevel">1</span></p>\r
                <div class="btn-group">\r
                    <button class="btn btn-primary" id="retryGoBtn">🔄 THỬ LẠI</button>\r
                    <button class="btn btn-secondary" id="resetGoBtn">🏠 VỀ ĐẦU</button>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Controls -->\r
        <div class="controls">\r
            <div class="hint">\r
                <span class="desktop-hint">\r
                    <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd>\r
                </span>\r
                <span class="touch-hint">🖱️ Kéo / vuốt để di chuyển</span>\r
            </div>\r
            <div class="level-selector">\r
                <div class="difficulty-group" id="difficultyGroup">\r
                    <button data-diff="easy">Dễ</button>\r
                    <button data-diff="normal" class="active">Bình thường</button>\r
                    <button data-diff="hard">Khó</button>\r
                </div>\r
                <button class="btn-icon" id="resetBtn" title="Tạo mê cung mới cùng cấp độ">⟳</button>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <script>\r
        (function() {\r
            'use strict';\r
\r
            // ===== DOM refs =====\r
            const canvas = document.getElementById('mazeCanvas');\r
            const ctx = canvas.getContext('2d');\r
            const wrapper = document.getElementById('mazeWrapper');\r
\r
            const timerDisplay = document.getElementById('timerDisplay');\r
            const levelDisplay = document.getElementById('levelDisplay');\r
            const scoreDisplay = document.getElementById('scoreDisplay');\r
\r
            const startOverlay = document.getElementById('startOverlay');\r
            const winOverlay = document.getElementById('winOverlay');\r
            const gameOverOverlay = document.getElementById('gameOverOverlay');\r
            const winLevel = document.getElementById('winLevel');\r
            const winTime = document.getElementById('winTime');\r
            const goLevel = document.getElementById('goLevel');\r
\r
            const startBtn = document.getElementById('startBtn');\r
            const newGameBtn = document.getElementById('newGameBtn');\r
            const saveInfo = document.getElementById('saveInfo');\r
            const saveInfoText = document.getElementById('saveInfoText');\r
            const nextBtn = document.getElementById('nextBtn');\r
            const retryBtn = document.getElementById('retryBtn');\r
            const retryGoBtn = document.getElementById('retryGoBtn');\r
            const resetGoBtn = document.getElementById('resetGoBtn');\r
            const resetBtn = document.getElementById('resetBtn');\r
            const difficultyGroup = document.getElementById('difficultyGroup');\r
            const difficultyButtons = difficultyGroup.querySelectorAll('button');\r
\r
            // ===== DIFFICULTY — CỰC KHÓ =====\r
            const DIFFICULTY = {\r
                easy: {\r
                    baseSize: 11,\r
                    sizeStep: 2,\r
                    maxSize: 23,\r
                    braid: 0.08,\r
                    maxTime: 70,\r
                    timeStep: 3,\r
                    minTime: 30\r
                },\r
                normal: {\r
                    baseSize: 17,\r
                    sizeStep: 2,\r
                    maxSize: 35,\r
                    braid: 0.32,\r
                    maxTime: 50,\r
                    timeStep: 4,\r
                    minTime: 16\r
                },\r
                hard: {\r
                    baseSize: 29,\r
                    sizeStep: 2,\r
                    maxSize: 55,\r
                    braid: 0.78,\r
                    maxTime: 28,\r
                    timeStep: 6,\r
                    minTime: 8\r
                },\r
            };\r
\r
            // ===== Game State =====\r
            const state = {\r
                running: false,\r
                level: 1,\r
                score: 0,\r
                timer: 0,\r
                maxTime: 60,\r
                timerInterval: null,\r
                difficulty: 'normal',\r
\r
                size: 13,\r
                grid: [],\r
                player: { row: 1, col: 1 },\r
                exit: { row: 0, col: 0 },\r
                visited: [],\r
\r
                cellSize: 0,\r
            };\r
\r
            // ===== Lưu chiến dịch (localStorage) =====\r
            // Key không thuộc tiền tố edu_/gq_/pwa- nên offlineGameSync của\r
            // app sẽ tự bắt mọi lần ghi và đồng bộ lên tài khoản (khi đã\r
            // đăng nhập), khôi phục khi mở game ở máy khác.\r
            const SAVE_KEY = 'labyrinthSaveV1';\r
            let savedCampaign = null;\r
\r
            function loadSave() {\r
                try {\r
                    const rawSave = localStorage.getItem(SAVE_KEY);\r
                    if (!rawSave) return null;\r
                    const data = JSON.parse(rawSave);\r
                    if (!data || typeof data !== 'object') return null;\r
                    const level = Math.floor(Number(data.level));\r
                    const score = Math.floor(Number(data.score));\r
                    if (!Number.isFinite(level) || level < 1) return null;\r
                    if (!Number.isFinite(score) || score < 0) return null;\r
                    if (!DIFFICULTY[data.difficulty]) return null;\r
                    return { level, score, difficulty: data.difficulty };\r
                } catch (e) {\r
                    return null; // JSON hỏng / localStorage bị chặn — bỏ qua\r
                }\r
            }\r
\r
            function persistSave(data) {\r
                savedCampaign = data;\r
                try {\r
                    localStorage.setItem(SAVE_KEY, JSON.stringify(data));\r
                } catch (e) { /* localStorage bị chặn — chơi tiếp bình thường */ }\r
            }\r
\r
            function clearSave() {\r
                savedCampaign = null;\r
                try {\r
                    localStorage.removeItem(SAVE_KEY);\r
                } catch (e) { /* bỏ qua */ }\r
            }\r
\r
            // Thông số cấp suy từ (độ khó, cấp) — cùng công thức nextLevel().\r
            function levelSize(cfg, level) {\r
                return Math.min(cfg.baseSize + cfg.sizeStep * (level - 1), cfg.maxSize);\r
            }\r
\r
            function levelMaxTime(cfg, level) {\r
                return Math.max(cfg.minTime, cfg.maxTime - cfg.timeStep * (level - 1));\r
            }\r
\r
            // ===== Canvas sizing =====\r
            function resizeCanvas() {\r
                const rect = wrapper.getBoundingClientRect();\r
                const w = rect.width || 600;\r
                canvas.width = w;\r
                canvas.height = w;\r
                canvas.style.width = w + 'px';\r
                canvas.style.height = w + 'px';\r
                state.cellSize = w / state.size;\r
                drawMaze();\r
            }\r
\r
            window.addEventListener('resize', resizeCanvas);\r
\r
            // ===== BFS =====\r
            function bfsDistances(grid, size, start) {\r
                const dist = [];\r
                for (let r = 0; r < size; r++) dist.push(new Array(size).fill(-1));\r
                const queue = [\r
                    [start.row, start.col]\r
                ];\r
                dist[start.row][start.col] = 0;\r
                let head = 0;\r
                const dirs = [\r
                    [1, 0],\r
                    [-1, 0],\r
                    [0, 1],\r
                    [0, -1]\r
                ];\r
                while (head < queue.length) {\r
                    const [r, c] = queue[head++];\r
                    for (const [dr, dc] of dirs) {\r
                        const nr = r + dr,\r
                            nc = c + dc;\r
                        if (nr >= 0 && nr < size && nc >= 0 && nc < size &&\r
                            grid[nr][nc] === 0 && dist[nr][nc] === -1) {\r
                            dist[nr][nc] = dist[r][c] + 1;\r
                            queue.push([nr, nc]);\r
                        }\r
                    }\r
                }\r
                return dist;\r
            }\r
\r
            // ===== Braiding =====\r
            function braidMaze(grid, size, braidFraction, protectedCells) {\r
                if (braidFraction <= 0) return;\r
\r
                const isProtected = (r, c) => protectedCells.some(p => p.row === r && p.col === c);\r
                const dirs = [\r
                    [1, 0],\r
                    [-1, 0],\r
                    [0, 1],\r
                    [0, -1]\r
                ];\r
\r
                function countPathNeighbors(r, c) {\r
                    let n = 0;\r
                    for (const [dr, dc] of dirs) {\r
                        const nr = r + dr,\r
                            nc = c + dc;\r
                        if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 0) n++;\r
                    }\r
                    return n;\r
                }\r
\r
                const deadEnds = [];\r
                for (let r = 1; r < size - 1; r++) {\r
                    for (let c = 1; c < size - 1; c++) {\r
                        if (grid[r][c] === 0 && countPathNeighbors(r, c) === 1 && !isProtected(r, c)) {\r
                            deadEnds.push({ row: r, col: c });\r
                        }\r
                    }\r
                }\r
\r
                for (let i = deadEnds.length - 1; i > 0; i--) {\r
                    const j = Math.floor(Math.random() * (i + 1));\r
                    [deadEnds[i], deadEnds[j]] = [deadEnds[j], deadEnds[i]];\r
                }\r
\r
                const targetCount = Math.floor(deadEnds.length * braidFraction);\r
                let opened = 0;\r
                for (const cell of deadEnds) {\r
                    if (opened >= targetCount) break;\r
                    if (countPathNeighbors(cell.row, cell.col) !== 1) continue;\r
\r
                    const candidates = [];\r
                    for (const [dr, dc] of dirs) {\r
                        const wr = cell.row + dr,\r
                            wc = cell.col + dc;\r
                        if (wr <= 0 || wr >= size - 1 || wc <= 0 || wc >= size - 1) continue;\r
                        if (grid[wr][wc] !== 1) continue;\r
                        let pathNeighborsOfWall = 0;\r
                        for (const [dr2, dc2] of dirs) {\r
                            const nr = wr + dr2,\r
                                nc = wc + dc2;\r
                            if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 0)\r
                            pathNeighborsOfWall++;\r
                        }\r
                        if (pathNeighborsOfWall >= 2) candidates.push({ r: wr, c: wc });\r
                    }\r
\r
                    if (candidates.length > 0) {\r
                        const pick = candidates[Math.floor(Math.random() * candidates.length)];\r
                        grid[pick.r][pick.c] = 0;\r
                        opened++;\r
                    }\r
                }\r
            }\r
\r
            // ===== Maze Generation =====\r
            function generateMaze(size, braidFraction) {\r
                const s = size % 2 === 0 ? size + 1 : size;\r
                state.size = s;\r
\r
                const grid = [];\r
                for (let r = 0; r < s; r++) {\r
                    grid[r] = new Array(s).fill(1);\r
                }\r
\r
                const stack = [\r
                    [1, 1]\r
                ];\r
                grid[1][1] = 0;\r
                while (stack.length) {\r
                    const [r, c] = stack[stack.length - 1];\r
                    const directions = [\r
                        [0, 2],\r
                        [0, -2],\r
                        [2, 0],\r
                        [-2, 0]\r
                    ];\r
                    for (let i = directions.length - 1; i > 0; i--) {\r
                        const j = Math.floor(Math.random() * (i + 1));\r
                        [directions[i], directions[j]] = [directions[j], directions[i]];\r
                    }\r
                    let carved = false;\r
                    for (const [dr, dc] of directions) {\r
                        const nr = r + dr,\r
                            nc = c + dc;\r
                        if (nr > 0 && nr < s && nc > 0 && nc < s && grid[nr][nc] === 1) {\r
                            grid[r + dr / 2][c + dc / 2] = 0;\r
                            grid[nr][nc] = 0;\r
                            stack.push([nr, nc]);\r
                            carved = true;\r
                            break;\r
                        }\r
                    }\r
                    if (!carved) stack.pop();\r
                }\r
\r
                const start = { row: 1, col: 1 };\r
                braidMaze(grid, s, braidFraction, [start]);\r
\r
                const dist = bfsDistances(grid, s, start);\r
\r
                const exits = [];\r
                for (let r = 1; r < s - 1; r += 1) {\r
                    if (grid[r][s - 2] === 0 && dist[r][s - 2] >= 0) exits.push({ row: r, col: s - 2 });\r
                    if (grid[r][1] === 0 && dist[r][1] >= 0) exits.push({ row: r, col: 1 });\r
                }\r
                for (let c = 1; c < s - 1; c += 1) {\r
                    if (grid[1][c] === 0 && dist[1][c] >= 0) exits.push({ row: 1, col: c });\r
                    if (grid[s - 2][c] === 0 && dist[s - 2][c] >= 0) exits.push({ row: s - 2, col: c });\r
                }\r
\r
                let exit;\r
                if (exits.length > 0) {\r
                    let bestDist = -1;\r
                    let bestCells = [];\r
                    for (const e of exits) {\r
                        const d = dist[e.row][e.col];\r
                        if (d > bestDist) {\r
                            bestDist = d;\r
                            bestCells = [e];\r
                        } else if (d === bestDist) {\r
                            bestCells.push(e);\r
                        }\r
                    }\r
                    exit = bestCells[Math.floor(Math.random() * bestCells.length)];\r
                } else {\r
                    exit = { row: s - 2, col: s - 2 };\r
                    grid[exit.row][exit.col] = 0;\r
                }\r
\r
                state.exit = exit;\r
                state.grid = grid;\r
                state.player.row = 1;\r
                state.player.col = 1;\r
                state.visited = [];\r
                for (let r = 0; r < s; r++) {\r
                    state.visited[r] = new Array(s).fill(false);\r
                }\r
                state.visited[1][1] = true;\r
\r
                resizeCanvas();\r
            }\r
\r
            // ===== DRAW — cực kỳ tối, khó nhìn =====\r
            function drawMaze() {\r
                const size = state.size;\r
                const cell = state.cellSize;\r
                const grid = state.grid;\r
                const player = state.player;\r
                const exit = state.exit;\r
\r
                ctx.clearRect(0, 0, canvas.width, canvas.height);\r
\r
                // Nền cực tối\r
                ctx.fillStyle = '#070b10';\r
                ctx.fillRect(0, 0, canvas.width, canvas.height);\r
\r
                // Vẽ lưới với màu cực kỳ tương phản thấp\r
                for (let r = 0; r < size; r++) {\r
                    for (let c = 0; c < size; c++) {\r
                        const x = c * cell;\r
                        const y = r * cell;\r
                        if (grid[r][c] === 1) {\r
                            // Tường — tối, gần như hòa với nền\r
                            ctx.fillStyle = '#0a0f16';\r
                            ctx.fillRect(x, y, cell, cell);\r
                            // Viền cực mờ\r
                            ctx.strokeStyle = 'rgba(20,30,44,0.15)';\r
                            ctx.lineWidth = 0.3;\r
                            ctx.strokeRect(x, y, cell, cell);\r
                        } else {\r
                            // Đường đi — sáng hơn tường một chút xíu\r
                            ctx.fillStyle = '#0e141d';\r
                            ctx.fillRect(x, y, cell, cell);\r
                            ctx.strokeStyle = 'rgba(20,30,44,0.05)';\r
                            ctx.lineWidth = 0.2;\r
                            ctx.strokeRect(x, y, cell, cell);\r
                        }\r
                    }\r
                }\r
\r
                // === LỐI RA — cực kỳ mờ ===\r
                const ex = exit.col * cell + cell / 2;\r
                const ey = exit.row * cell + cell / 2;\r
                const rad = cell * 0.18;\r
\r
                // Vòng tròn mờ cực nhẹ\r
                const grad = ctx.createRadialGradient(ex, ey, 1, ex, ey, cell * 0.5);\r
                grad.addColorStop(0, 'rgba(240, 192, 64, 0.25)');\r
                grad.addColorStop(1, 'rgba(240, 192, 64, 0)');\r
                ctx.fillStyle = grad;\r
                ctx.beginPath();\r
                ctx.arc(ex, ey, cell * 0.5, 0, Math.PI * 2);\r
                ctx.fill();\r
\r
                // Chấm nhỏ\r
                ctx.fillStyle = 'rgba(240, 192, 64, 0.5)';\r
                ctx.beginPath();\r
                ctx.arc(ex, ey, rad, 0, Math.PI * 2);\r
                ctx.fill();\r
\r
                // Biểu tượng 🚪 cực nhỏ\r
                ctx.fillStyle = 'rgba(240, 192, 64, 0.3)';\r
                ctx.font = \`\${cell * 0.3}px "Segoe UI", sans-serif\`;\r
                ctx.textAlign = 'center';\r
                ctx.textBaseline = 'middle';\r
                ctx.fillText('🚪', ex, ey + cell * 0.03);\r
\r
                // === NGƯỜI CHƠI — cực kỳ mờ ===\r
                const px = player.col * cell + cell / 2;\r
                const py = player.row * cell + cell / 2;\r
                const pr = cell * 0.16;\r
\r
                // Glow cực nhẹ\r
                const pGrad = ctx.createRadialGradient(px, py, 1, px, py, cell * 0.5);\r
                pGrad.addColorStop(0, 'rgba(88, 166, 255, 0.15)');\r
                pGrad.addColorStop(1, 'rgba(88, 166, 255, 0)');\r
                ctx.fillStyle = pGrad;\r
                ctx.beginPath();\r
                ctx.arc(px, py, cell * 0.5, 0, Math.PI * 2);\r
                ctx.fill();\r
\r
                // Chấm người chơi\r
                ctx.fillStyle = 'rgba(88, 166, 255, 0.5)';\r
                ctx.beginPath();\r
                ctx.arc(px, py, pr, 0, Math.PI * 2);\r
                ctx.fill();\r
\r
                // Mắt nhỏ\r
                ctx.fillStyle = 'rgba(7,11,16,0.5)';\r
                const eyeOff = pr * 0.4;\r
                const eyeSize = pr * 0.25;\r
                ctx.beginPath();\r
                ctx.arc(px - eyeOff, py - eyeOff * 0.3, eyeSize, 0, Math.PI * 2);\r
                ctx.fill();\r
                ctx.beginPath();\r
                ctx.arc(px + eyeOff, py - eyeOff * 0.3, eyeSize, 0, Math.PI * 2);\r
                ctx.fill();\r
\r
                // === VẾT ĐÃ ĐI — cực kỳ mờ ===\r
                for (let r = 0; r < size; r++) {\r
                    for (let c = 0; c < size; c++) {\r
                        if (state.visited[r][c] && !(r === player.row && c === player.col) && grid[r][c] === 0) {\r
                            ctx.fillStyle = 'rgba(88, 166, 255, 0.03)';\r
                            ctx.fillRect(c * cell + cell * 0.15, r * cell + cell * 0.15, cell * 0.7, cell * 0.7);\r
                        }\r
                    }\r
                }\r
\r
                // Lưới phụ — vạch kẻ mờ gây rối mắt\r
                ctx.strokeStyle = 'rgba(20,30,44,0.06)';\r
                ctx.lineWidth = 0.3;\r
                for (let r = 0; r <= size; r++) {\r
                    ctx.beginPath();\r
                    ctx.moveTo(0, r * cell);\r
                    ctx.lineTo(canvas.width, r * cell);\r
                    ctx.stroke();\r
                }\r
                for (let c = 0; c <= size; c++) {\r
                    ctx.beginPath();\r
                    ctx.moveTo(c * cell, 0);\r
                    ctx.lineTo(c * cell, canvas.height);\r
                    ctx.stroke();\r
                }\r
            }\r
\r
            // ===== Movement =====\r
            function movePlayer(drow, dcol) {\r
                if (!state.running) return;\r
                const r = state.player.row + drow;\r
                const c = state.player.col + dcol;\r
                if (r < 0 || r >= state.size || c < 0 || c >= state.size) return;\r
                if (state.grid[r][c] === 1) return;\r
\r
                state.player.row = r;\r
                state.player.col = c;\r
                state.visited[r][c] = true;\r
\r
                drawMaze();\r
\r
                if (r === state.exit.row && c === state.exit.col) {\r
                    state.running = false;\r
                    clearInterval(state.timerInterval);\r
                    winLevel.textContent = state.level;\r
                    winTime.textContent = state.timer;\r
                    winOverlay.classList.add('show');\r
                    const bonus = Math.max(0, state.maxTime - state.timer);\r
                    state.score += Math.floor(bonus / 2) + 10;\r
                    updateUI();\r
                    // Thắng cấp → lưu chiến dịch tại CẤP TIẾP THEO (cấp chưa\r
                    // qua) để lần mở sau "Chơi tiếp" vào đúng chỗ dở dang.\r
                    persistSave({\r
                        level: state.level + 1,\r
                        score: state.score,\r
                        difficulty: state.difficulty,\r
                    });\r
                }\r
            }\r
\r
            // ===== Timer =====\r
            function startTimer() {\r
                state.timer = 0;\r
                if (state.timerInterval) clearInterval(state.timerInterval);\r
                state.timerInterval = setInterval(() => {\r
                    state.timer++;\r
                    timerDisplay.textContent = String(state.timer).padStart(2, '0');\r
                    if (state.timer >= state.maxTime) {\r
                        state.running = false;\r
                        clearInterval(state.timerInterval);\r
                        goLevel.textContent = state.level;\r
                        gameOverOverlay.classList.add('show');\r
                        drawMaze();\r
                    }\r
                }, 1000);\r
            }\r
\r
            // ===== UI =====\r
            function updateUI() {\r
                levelDisplay.textContent = state.level;\r
                scoreDisplay.textContent = state.score;\r
                timerDisplay.textContent = String(state.timer).padStart(2, '0');\r
            }\r
\r
            function setActiveDifficultyButton() {\r
                difficultyButtons.forEach(btn => {\r
                    btn.classList.toggle('active', btn.dataset.diff === state.difficulty);\r
                });\r
            }\r
\r
            // ===== New Game / Level =====\r
            function startNewLevel(size) {\r
                if (state.timerInterval) clearInterval(state.timerInterval);\r
                state.running = true;\r
                winOverlay.classList.remove('show');\r
                gameOverOverlay.classList.remove('show');\r
                startOverlay.classList.remove('show');\r
\r
                const cfg = DIFFICULTY[state.difficulty];\r
                const s = size || state.size;\r
                generateMaze(s, cfg.braid);\r
                state.timer = 0;\r
                updateUI();\r
                drawMaze();\r
                startTimer();\r
            }\r
\r
            function resetCurrentLevel() {\r
                if (state.timerInterval) clearInterval(state.timerInterval);\r
                startNewLevel(state.size);\r
            }\r
\r
            function nextLevel() {\r
                const cfg = DIFFICULTY[state.difficulty];\r
                state.level++;\r
                state.maxTime = levelMaxTime(cfg, state.level);\r
                startNewLevel(levelSize(cfg, state.level));\r
            }\r
\r
            function resetGame() {\r
                clearSave(); // bắt đầu chiến dịch mới — bỏ bản lưu cũ\r
                // Game chạy trong iframe của app: iframe không tự có focus\r
                // bàn phím, mà keydown chỉ tới cửa sổ đang có focus — chưa\r
                // bấm chuột vào trong game thì phím mũi tên "chết" hoàn\r
                // toàn. Chủ động lấy focus khi bắt đầu ván.\r
                try { window.focus(); } catch (e) { /* bỏ qua */ }\r
                const cfg = DIFFICULTY[state.difficulty];\r
                state.level = 1;\r
                state.score = 0;\r
                state.maxTime = cfg.maxTime;\r
                if (state.timerInterval) clearInterval(state.timerInterval);\r
                startOverlay.classList.remove('show');\r
                winOverlay.classList.remove('show');\r
                gameOverOverlay.classList.remove('show');\r
                startNewLevel(cfg.baseSize);\r
                updateUI();\r
            }\r
\r
            // Chơi tiếp chiến dịch đã lưu (nút chính khi có save).\r
            function continueCampaign() {\r
                if (!savedCampaign) {\r
                    resetGame();\r
                    return;\r
                }\r
                try { window.focus(); } catch (e) { /* bỏ qua */ }\r
                const cfg = DIFFICULTY[savedCampaign.difficulty];\r
                state.difficulty = savedCampaign.difficulty;\r
                state.level = savedCampaign.level;\r
                state.score = savedCampaign.score;\r
                state.maxTime = levelMaxTime(cfg, state.level);\r
                setActiveDifficultyButton();\r
                startNewLevel(levelSize(cfg, state.level));\r
                updateUI();\r
            }\r
\r
            function refreshStartOverlay() {\r
                if (savedCampaign) {\r
                    startBtn.textContent = \`▶ CHƠI TIẾP — CẤP \${savedCampaign.level}\`;\r
                    saveInfoText.textContent = \`Cấp \${savedCampaign.level} · ⭐ \${savedCampaign.score} điểm\`;\r
                    saveInfo.style.display = '';\r
                    newGameBtn.style.display = '';\r
                } else {\r
                    startBtn.textContent = '▶ BẮT ĐẦU';\r
                    saveInfo.style.display = 'none';\r
                    newGameBtn.style.display = 'none';\r
                }\r
            }\r
\r
            // ===== Keyboard =====\r
            document.addEventListener('keydown', (e) => {\r
                const key = e.key;\r
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {\r
                    e.preventDefault();\r
                    switch (key) {\r
                        case 'ArrowUp':\r
                            movePlayer(-1, 0);\r
                            break;\r
                        case 'ArrowDown':\r
                            movePlayer(1, 0);\r
                            break;\r
                        case 'ArrowLeft':\r
                            movePlayer(0, -1);\r
                            break;\r
                        case 'ArrowRight':\r
                            movePlayer(0, 1);\r
                            break;\r
                    }\r
                }\r
            });\r
\r
            // ===== Touch / Drag =====\r
            let touchStart = null;\r
\r
            function handleTouchStart(e) {\r
                e.preventDefault();\r
                const rect = canvas.getBoundingClientRect();\r
                const touch = e.touches[0];\r
                touchStart = {\r
                    x: touch.clientX - rect.left,\r
                    y: touch.clientY - rect.top,\r
                    time: Date.now()\r
                };\r
            }\r
\r
            function handleTouchMove(e) {\r
                e.preventDefault();\r
                if (!touchStart || !state.running) return;\r
                const rect = canvas.getBoundingClientRect();\r
                const touch = e.touches[0];\r
                const dx = touch.clientX - rect.left - touchStart.x;\r
                const dy = touch.clientY - rect.top - touchStart.y;\r
                const threshold = 20;\r
                if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {\r
                    if (Math.abs(dx) > Math.abs(dy)) {\r
                        movePlayer(0, dx > 0 ? 1 : -1);\r
                    } else {\r
                        movePlayer(dy > 0 ? 1 : -1, 0);\r
                    }\r
                    touchStart = {\r
                        x: touch.clientX - rect.left,\r
                        y: touch.clientY - rect.top,\r
                        time: Date.now()\r
                    };\r
                }\r
            }\r
\r
            function handleTouchEnd(e) {\r
                e.preventDefault();\r
                touchStart = null;\r
            }\r
\r
            canvas.addEventListener('touchstart', handleTouchStart, { passive: false });\r
            canvas.addEventListener('touchmove', handleTouchMove, { passive: false });\r
            canvas.addEventListener('touchend', handleTouchEnd, { passive: false });\r
            canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });\r
\r
            // ===== Mouse drag =====\r
            let mouseDown = false;\r
            let mouseStart = null;\r
\r
            canvas.addEventListener('mousedown', (e) => {\r
                try { window.focus(); } catch (err) { /* bỏ qua */ }\r
                const rect = canvas.getBoundingClientRect();\r
                mouseDown = true;\r
                mouseStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };\r
            });\r
\r
            canvas.addEventListener('mousemove', (e) => {\r
                if (!mouseDown || !state.running) return;\r
                const rect = canvas.getBoundingClientRect();\r
                const dx = e.clientX - rect.left - mouseStart.x;\r
                const dy = e.clientY - rect.top - mouseStart.y;\r
                const threshold = 20;\r
                if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {\r
                    if (Math.abs(dx) > Math.abs(dy)) {\r
                        movePlayer(0, dx > 0 ? 1 : -1);\r
                    } else {\r
                        movePlayer(dy > 0 ? 1 : -1, 0);\r
                    }\r
                    mouseStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };\r
                }\r
            });\r
\r
            window.addEventListener('mouseup', () => {\r
                mouseDown = false;\r
            });\r
\r
            // ===== Buttons =====\r
            startBtn.addEventListener('click', () => {\r
                if (savedCampaign) continueCampaign();\r
                else resetGame();\r
            });\r
            newGameBtn.addEventListener('click', resetGame);\r
            nextBtn.addEventListener('click', nextLevel);\r
            retryBtn.addEventListener('click', resetCurrentLevel);\r
            retryGoBtn.addEventListener('click', resetCurrentLevel);\r
            resetGoBtn.addEventListener('click', () => {\r
                clearSave(); // về đầu = bỏ hẳn chiến dịch đang dở\r
                const cfg = DIFFICULTY[state.difficulty];\r
                state.level = 1;\r
                state.score = 0;\r
                state.maxTime = cfg.maxTime;\r
                startNewLevel(cfg.baseSize);\r
                updateUI();\r
            });\r
            resetBtn.addEventListener('click', resetCurrentLevel);\r
\r
            difficultyButtons.forEach(btn => {\r
                btn.addEventListener('click', () => {\r
                    const diff = btn.dataset.diff;\r
                    if (diff === state.difficulty) return;\r
\r
                    const applyChange = () => {\r
                        clearSave(); // đổi độ khó = chiến dịch mới\r
                        state.difficulty = diff;\r
                        setActiveDifficultyButton();\r
                        const cfg = DIFFICULTY[diff];\r
                        state.level = 1;\r
                        state.score = 0;\r
                        state.maxTime = cfg.maxTime;\r
                        startNewLevel(cfg.baseSize);\r
                        updateUI();\r
                    };\r
\r
                    if (state.running) {\r
                        if (confirm('Đổi độ khó sẽ bắt đầu lại ván mới. Tiếp tục?')) {\r
                            applyChange();\r
                        }\r
                    } else {\r
                        applyChange();\r
                    }\r
                });\r
            });\r
\r
            // ===== Init =====\r
            function init() {\r
                savedCampaign = loadSave();\r
                if (savedCampaign) {\r
                    // Header + mê cung nền theo đúng cấp/độ khó sẽ chơi tiếp.\r
                    state.difficulty = savedCampaign.difficulty;\r
                    state.level = savedCampaign.level;\r
                    state.score = savedCampaign.score;\r
                }\r
                const cfg = DIFFICULTY[state.difficulty];\r
                state.maxTime = levelMaxTime(cfg, state.level);\r
                setActiveDifficultyButton();\r
                generateMaze(levelSize(cfg, state.level), cfg.braid);\r
                state.running = false;\r
                updateUI();\r
                drawMaze();\r
                refreshStartOverlay();\r
                startOverlay.classList.add('show');\r
                winOverlay.classList.remove('show');\r
                gameOverOverlay.classList.remove('show');\r
                resizeCanvas();\r
            }\r
\r
            init();\r
\r
        })();\r
    <\/script>\r
\r
\r
<!-- Nút "Về trang chủ" — thêm bởi scripts/add-offline-back-button.mjs -->\r
<style>\r
  #homeBackBtn {\r
    position: fixed;\r
    z-index: 2147483000;\r
    top: calc(env(safe-area-inset-top, 0px) + 10px);\r
    left: calc(env(safe-area-inset-left, 0px) + 10px);\r
    width: 42px; height: 42px;\r
    border-radius: 14px;\r
    display: grid; place-items: center;\r
    cursor: pointer;\r
    font-family: inherit;\r
    font-size: 20px; font-weight: 800; line-height: 1;\r
    color: #1d2e4a;\r
    background: #fffbf2;\r
    border: 3px solid #1d2e4a;\r
    box-shadow: 0 4px 0 #1d2e4a, 0 8px 14px rgba(0, 0, 0, .22);\r
    transition: transform .12s, box-shadow .12s;\r
    -webkit-tap-highlight-color: transparent;\r
    user-select: none; -webkit-user-select: none;\r
  }\r
  #homeBackBtn:hover { filter: brightness(1.06); }\r
  #homeBackBtn:active {\r
    transform: translateY(3px);\r
    box-shadow: 0 1px 0 #1d2e4a, 0 3px 6px rgba(0, 0, 0, .22);\r
  }\r
  #homeBackBtn:focus-visible { outline: 3px solid var(--sky,#4b9dff); outline-offset: 2px; }\r
  @media (prefers-reduced-motion: reduce) { #homeBackBtn { transition: none; } }\r
</style>\r
<button id="homeBackBtn" type="button" aria-label="Về trang chủ" title="Về trang chủ">\r
  <span aria-hidden="true">&#8592;</span>\r
</button>\r
<script>\r
  // Nút dùng chung cho mọi game offline: báo ngược lên React (OfflineGamePage)\r
  // để quay về trang chủ. Mở file .html trực tiếp thì tự điều hướng.\r
  (function () {\r
    var btn = document.getElementById("homeBackBtn");\r
    if (!btn) return;\r
    btn.addEventListener("click", function () {\r
      try {\r
        if (window.parent && window.parent !== window) {\r
          window.parent.postMessage({ type: "quit", data: {} }, "*");\r
          return;\r
        }\r
      } catch (e) { /* rơi xuống cách tự điều hướng */ }\r
      try { window.location.href = "/"; } catch (e) { /* ignore */ }\r
    });\r
  })();\r
<\/script>\r
</body>\r
</html>`;export{e as default};