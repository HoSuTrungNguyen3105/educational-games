var e=`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
    <meta charset="UTF-8">\r
    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r
    <title>🏃 Temple Run - Góc nhìn thứ nhất 2D</title>\r
    <link rel="preconnect" href="https://fonts.googleapis.com">\r
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet">\r
    <style>\r
        * {\r
            margin: 0;\r
            padding: 0;\r
            box-sizing: border-box;\r
            user-select: none;\r
        }\r
        body {\r
            background-color: var(--paper,#fff6e7);\r
            background-image: linear-gradient(var(--line,#e6dcc4) 1px, transparent 1px), linear-gradient(90deg, var(--line,#e6dcc4) 1px, transparent 1px);\r
            background-size: 28px 28px;\r
            min-height: 100vh;\r
            display: flex;\r
            justify-content: center;\r
            align-items: center;\r
            font-family: var(--body,"Be Vietnam Pro","Segoe UI",system-ui,sans-serif);\r
            overflow: hidden;\r
        }\r
        .game-wrapper {\r
            background: var(--card,#fffbf2);\r
            padding: 15px;\r
            border-radius: 24px;\r
            box-shadow: 4px 4px 0 var(--ink,#1d2e4a);\r
            border: 3px solid var(--ink,#1d2e4a);\r
        }\r
        canvas {\r
            display: block;\r
            margin: 0 auto;\r
            border-radius: 16px;\r
            background: #0a0a1a;\r
            border: 3px solid var(--ink,#1d2e4a);\r
            box-shadow: inset 0 0 50px rgba(0,0,0,0.8);\r
            width: 960px;\r
            height: 540px;\r
            cursor: pointer;\r
        }\r
        .info-panel {\r
            display: flex;\r
            justify-content: space-between;\r
            align-items: center;\r
            margin-top: 14px;\r
            padding: 0 8px;\r
            color: var(--ink,#1d2e4a);\r
            font-weight: 600;\r
            flex-wrap: wrap;\r
            gap: 10px;\r
        }\r
        .score-box {\r
            background: var(--bg,#fff3de);\r
            padding: 8px 24px;\r
            border-radius: 40px;\r
            font-size: 24px;\r
            border: 2.5px solid var(--ink,#1d2e4a);\r
            box-shadow: 3px 3px 0 var(--ink,#1d2e4a);\r
            font-family: var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
            display: flex;\r
            align-items: center;\r
            gap: 12px;\r
        }\r
        .coin-box {\r
            background: var(--bg,#fff3de);\r
            padding: 8px 20px;\r
            border-radius: 40px;\r
            font-size: 20px;\r
            border: 2.5px solid var(--ink,#1d2e4a);\r
            box-shadow: 3px 3px 0 var(--ink,#1d2e4a);\r
            font-family: var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
            display: flex;\r
            align-items: center;\r
            gap: 8px;\r
        }\r
        .controls {\r
            display: flex;\r
            gap: 12px;\r
            align-items: center;\r
            flex-wrap: wrap;\r
        }\r
        .btn {\r
            background: var(--sun,#f4b942);\r
            color: var(--ink,#1d2e4a);\r
            font-family: var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
            font-weight: 800;\r
            font-size: 16px;\r
            padding: 7px 20px;\r
            border-radius: 14px;\r
            border: 3px solid var(--ink,#1d2e4a);\r
            transition: 0.08s linear;\r
            cursor: pointer;\r
            box-shadow: 3px 3px 0 var(--ink,#1d2e4a);\r
        }\r
        .btn:active {\r
            transform: translate(3px, 3px);\r
            box-shadow: 0 0 0 var(--ink,#1d2e4a);\r
        }\r
        .btn-restart {\r
            background: var(--tomato,#e4572e);\r
            color: #fff;\r
        }\r
        .key-hint {\r
            display: flex;\r
            gap: 10px;\r
            background: var(--card,#fffbf2);\r
            padding: 5px 14px;\r
            border-radius: 40px;\r
            border: 2.5px solid var(--ink,#1d2e4a);\r
            color: var(--ink,#1d2e4a);\r
            font-size: 14px;\r
        }\r
        .key-hint kbd {\r
            background: var(--bg,#fff3de);\r
            padding: 2px 10px;\r
            border-radius: 10px;\r
            color: var(--tomato,#e4572e);\r
            font-weight: bold;\r
            border: 2px solid var(--ink,#1d2e4a);\r
        }\r
        @media (max-width: 1000px) {\r
            canvas { width: 100%; height: auto; aspect-ratio: 960/540; }\r
            .game-wrapper { padding: 10px; }\r
            .info-panel { justify-content: center; }\r
        }\r
    </style>\r
</head>\r
<body>\r
<div class="game-wrapper">\r
    <canvas id="gameCanvas" width="960" height="540"></canvas>\r
    <div class="info-panel">\r
        <div style="display:flex; gap:12px; flex-wrap:wrap;">\r
            <div class="score-box">🏆 <span id="scoreDisplay">0</span></div>\r
            <div class="coin-box">🪙 <span id="coinDisplay">0</span></div>\r
            <div class="coin-box">🏆 Kỷ lục: <span id="bestDisplay">0</span></div>\r
        </div>\r
        <div class="controls">\r
            <div class="key-hint">\r
                <kbd>⬆️</kbd> <kbd>⬇️</kbd> <kbd>⬅️</kbd> <kbd>➡️</kbd>\r
            </div>\r
            <button class="btn btn-restart" id="restartBtn">🔄 Chạy lại</button>\r
        </div>\r
    </div>\r
</div>\r
<script>\r
    (function(){\r
        const canvas = document.getElementById('gameCanvas');\r
        const ctx = canvas.getContext('2d');\r
        const scoreSpan = document.getElementById('scoreDisplay');\r
        const coinSpan = document.getElementById('coinDisplay');\r
        const bestSpan = document.getElementById('bestDisplay');\r
\r
        const W = 960, H = 540;\r
        const GROUND_Y = 480;\r
        const PLAYER_W = 28, PLAYER_H = 44;\r
\r
        // === CẤU HÌNH GÓC NHÌN THỨ NHẤT (GIẢ 3D) ===\r
        // Điểm biến mất (vanishing point) ở trung tâm\r
        const VANISH_X = W / 2;\r
        const VANISH_Y = 200;\r
        const LANE_WIDTH = 70;\r
        const LANE_OFFSET = 0;\r
\r
        // 3 làn đường với hiệu ứng phối cảnh\r
        const LANES = [\r
            { x: VANISH_X - LANE_WIDTH, scale: 0.6 },\r
            { x: VANISH_X, scale: 0.9 },\r
            { x: VANISH_X + LANE_WIDTH, scale: 0.6 }\r
        ];\r
\r
        let gameOver = false;\r
        let score = 0;\r
        let coins = 0;\r
        let frame = 0;\r
        let speed = 4.0;\r
        const BASE_SPEED = 4.0;\r
\r
        // === KỶ LỤC (localStorage) ===\r
        // Key không thuộc tiền tố edu_/gq_/pwa- nên offlineGameSync của\r
        // app sẽ tự bắt mọi lần ghi và đồng bộ lên tài khoản (khi đã\r
        // đăng nhập), khôi phục khi mở game ở máy khác.\r
        const BEST_KEY = 'templeRunBestV1';\r
        let best = loadBest();\r
        let newBestRun = false;\r
\r
        function loadBest() {\r
            const empty = { bestScore: 0, bestCoins: 0 };\r
            try {\r
                const rawBest = localStorage.getItem(BEST_KEY);\r
                if (!rawBest) return empty;\r
                const data = JSON.parse(rawBest);\r
                if (!data || typeof data !== 'object') return empty;\r
                const s = Math.floor(Number(data.bestScore));\r
                const c = Math.floor(Number(data.bestCoins));\r
                return {\r
                    bestScore: Number.isFinite(s) && s > 0 ? s : 0,\r
                    bestCoins: Number.isFinite(c) && c > 0 ? c : 0,\r
                };\r
            } catch (e) {\r
                return empty; // JSON hỏng / localStorage bị chặn — bỏ qua\r
            }\r
        }\r
\r
        function updateBestDisplay() {\r
            bestSpan.textContent = best.bestScore;\r
        }\r
\r
        // Gọi đúng một lần tại thời điểm game over: bestScore/bestCoins là\r
        // hai kỷ lục độc lập (điểm cao nhất / xu nhiều nhất từng đạt).\r
        function saveBest() {\r
            const s = Math.floor(score);\r
            newBestRun = s > best.bestScore;\r
            let changed = false;\r
            if (newBestRun) { best.bestScore = s; changed = true; }\r
            if (coins > best.bestCoins) { best.bestCoins = coins; changed = true; }\r
            if (changed) {\r
                try {\r
                    localStorage.setItem(BEST_KEY, JSON.stringify(best));\r
                } catch (e) { /* localStorage bị chặn — bỏ qua */ }\r
                updateBestDisplay();\r
            }\r
        }\r
\r
        // Nhân vật (ở dưới cùng màn hình)\r
        const player = {\r
            lane: 1,        // 0: trái, 1: giữa, 2: phải\r
            targetX: VANISH_X,\r
            currentX: VANISH_X,\r
            y: GROUND_Y - PLAYER_H,\r
            w: PLAYER_W,\r
            h: PLAYER_H,\r
            vy: 0,\r
            gravity: 0.7,\r
            jumpPower: -13,\r
            isOnGround: true,\r
            sliding: false,\r
            slideTimer: 0,\r
            invincible: 0,\r
        };\r
\r
        // Các vật thể trên đường\r
        let obstacles = [];\r
        let coinItems = [];\r
        let particles = [];\r
        let roadMarkers = [];\r
\r
        // === KHỞI TẠO ===\r
        function resetGame() {\r
            gameOver = false;\r
            newBestRun = false;\r
            score = 0;\r
            coins = 0;\r
            frame = 0;\r
            speed = BASE_SPEED;\r
            obstacles = [];\r
            coinItems = [];\r
            particles = [];\r
            player.lane = 1;\r
            player.targetX = VANISH_X;\r
            player.currentX = VANISH_X;\r
            player.y = GROUND_Y - PLAYER_H;\r
            player.vy = 0;\r
            player.isOnGround = true;\r
            player.sliding = false;\r
            player.slideTimer = 0;\r
            player.invincible = 0;\r
            updateDisplay();\r
            updateBestDisplay();\r
            initRoadMarkers();\r
        }\r
\r
        function initRoadMarkers() {\r
            roadMarkers = [];\r
            for (let i = 0; i < 30; i++) {\r
                roadMarkers.push({\r
                    z: i * 30,\r
                    lane: i % 3,\r
                    offset: (i % 3 - 1) * 70,\r
                });\r
            }\r
        }\r
\r
        function updateDisplay() {\r
            scoreSpan.textContent = Math.floor(score);\r
            coinSpan.textContent = coins;\r
        }\r
\r
        // === TÍNH TOÁN PHỐI CẢNH ===\r
        function getProjectedPos(z, laneOffset) {\r
            // z: khoảng cách từ người chơi (0 = tại người chơi, càng lớn càng xa)\r
            const perspective = 1 / (1 + z / 1200);\r
            const x = VANISH_X + laneOffset * perspective;\r
            const y = VANISH_Y + (GROUND_Y - VANISH_Y) * perspective;\r
            const scale = perspective;\r
            return { x, y, scale };\r
        }\r
\r
        // === SPAWN OBSTACLE ===\r
        function spawnObstacle() {\r
            const type = Math.floor(Math.random() * 3);\r
            const lane = Math.floor(Math.random() * 3);\r
            const laneOffset = (lane - 1) * LANE_WIDTH;\r
            const z = 300 + Math.random() * 400;\r
            let w, h, color;\r
\r
            if (type === 0) { w = 30; h = 18; color = '#e67e22'; } // thấp - nhảy\r
            else if (type === 1) { w = 30; h = 32; color = '#8e44ad'; } // cao - trượt\r
            else { w = 18; h = 40; color = '#c0392b'; } // cột - né\r
\r
            obstacles.push({\r
                z: z,\r
                lane: lane,\r
                laneOffset: laneOffset,\r
                w: w,\r
                h: h,\r
                type: type,\r
                color: color,\r
                passed: false,\r
                active: true\r
            });\r
        }\r
\r
        // === SPAWN COINS ===\r
        function spawnCoins() {\r
            const count = 3 + Math.floor(Math.random() * 3);\r
            const lane = Math.floor(Math.random() * 3);\r
            const laneOffset = (lane - 1) * LANE_WIDTH;\r
            const startZ = 200 + Math.random() * 300;\r
            for (let i = 0; i < count; i++) {\r
                coinItems.push({\r
                    z: startZ + i * 35,\r
                    lane: lane,\r
                    laneOffset: laneOffset,\r
                    radius: 12,\r
                    collected: false,\r
                    bobOffset: Math.random() * Math.PI * 2\r
                });\r
            }\r
        }\r
\r
        // === HIỆU ỨNG ===\r
        function addParticles(x, y, color, count = 12) {\r
            for (let i = 0; i < count; i++) {\r
                const angle = Math.random() * Math.PI * 2;\r
                const vel = 2 + Math.random() * 4;\r
                particles.push({\r
                    x, y,\r
                    vx: Math.cos(angle) * vel,\r
                    vy: Math.sin(angle) * vel - 1,\r
                    life: 30 + Math.random() * 30,\r
                    maxLife: 60,\r
                    radius: 3 + Math.random() * 4,\r
                    color: color,\r
                });\r
            }\r
        }\r
\r
        // === ĐIỀU KHIỂN ===\r
        function playerJump() {\r
            if (gameOver) return;\r
            if (player.isOnGround && !player.sliding) {\r
                player.vy = player.jumpPower;\r
                player.isOnGround = false;\r
                addParticles(player.currentX, GROUND_Y, '#d4a017', 6);\r
            }\r
        }\r
\r
        function playerSlide() {\r
            if (gameOver) return;\r
            if (player.isOnGround && !player.sliding) {\r
                player.sliding = true;\r
                player.slideTimer = 18;\r
                player.h = PLAYER_H * 0.55;\r
                player.y = GROUND_Y - player.h;\r
            }\r
        }\r
\r
        function moveLeft() {\r
            if (gameOver) return;\r
            if (player.lane > 0) {\r
                player.lane--;\r
                player.targetX = VANISH_X + (player.lane - 1) * LANE_WIDTH;\r
            }\r
        }\r
\r
        function moveRight() {\r
            if (gameOver) return;\r
            if (player.lane < 2) {\r
                player.lane++;\r
                player.targetX = VANISH_X + (player.lane - 1) * LANE_WIDTH;\r
            }\r
        }\r
\r
        // === CẬP NHẬT ===\r
        function update() {\r
            if (gameOver) return;\r
\r
            frame++;\r
            speed = BASE_SPEED + Math.floor(score / 200) * 0.4;\r
            if (speed > 10) speed = 10;\r
\r
            // Di chuyển ngang mượt\r
            const diff = player.targetX - player.currentX;\r
            if (Math.abs(diff) > 0.3) {\r
                player.currentX += Math.sign(diff) * Math.min(Math.abs(diff), 3.0);\r
            } else {\r
                player.currentX = player.targetX;\r
            }\r
\r
            // Trọng lực\r
            if (!player.isOnGround) {\r
                player.vy += player.gravity;\r
                player.y += player.vy;\r
                if (player.y >= GROUND_Y - player.h) {\r
                    player.y = GROUND_Y - player.h;\r
                    player.vy = 0;\r
                    player.isOnGround = true;\r
                }\r
            }\r
\r
            // Trượt\r
            if (player.sliding) {\r
                player.slideTimer--;\r
                if (player.slideTimer <= 0) {\r
                    player.sliding = false;\r
                    player.h = PLAYER_H;\r
                    player.y = GROUND_Y - player.h;\r
                }\r
            }\r
\r
            if (player.invincible > 0) player.invincible--;\r
\r
            // Spawn\r
            const spawnRate = Math.max(50 - Math.floor(score / 80), 25);\r
            if (frame % spawnRate === 0) {\r
                spawnObstacle();\r
                if (Math.random() < 0.25) spawnObstacle();\r
            }\r
            if (frame % 30 === 0 && Math.random() < 0.4) {\r
                spawnCoins();\r
            }\r
\r
            // Cập nhật vật cản (dịch chuyển về phía người chơi)\r
            for (let i = obstacles.length - 1; i >= 0; i--) {\r
                const ob = obstacles[i];\r
                ob.z -= speed * 1.2;\r
\r
                if (ob.z < -50) {\r
                    obstacles.splice(i, 1);\r
                    continue;\r
                }\r
\r
                // Tính điểm\r
                if (!ob.passed && ob.z < 0) {\r
                    ob.passed = true;\r
                    score += 8;\r
                    updateDisplay();\r
                }\r
\r
                // Va chạm (chỉ khi vật ở gần người chơi)\r
                if (player.invincible === 0 && Math.abs(ob.z) < 40) {\r
                    const proj = getProjectedPos(ob.z, ob.laneOffset);\r
                    const px = player.currentX - player.w/2 + 4;\r
                    const py = player.y + 4;\r
                    const pw = player.w - 8;\r
                    const ph = player.h - 8;\r
\r
                    const ox = proj.x - ob.w/2 + 4;\r
                    const oy = proj.y - ob.h/2 + 4;\r
                    const ow = ob.w - 8;\r
                    const oh = ob.h - 8;\r
\r
                    // Kiểm tra va chạm với tỉ lệ scale\r
                    const scale = proj.scale;\r
                    if (px < ox + ow * scale && px + pw > ox &&\r
                        py < oy + oh * scale && py + ph > oy) {\r
                        gameOver = true;\r
                        saveBest();\r
                        addParticles(player.currentX, player.y + player.h/2, '#e74c3c', 30);\r
                        return;\r
                    }\r
                }\r
            }\r
\r
            // Cập nhật đồng xu\r
            for (let i = coinItems.length - 1; i >= 0; i--) {\r
                const coin = coinItems[i];\r
                coin.z -= speed * 1.2;\r
                coin.bobOffset += 0.05;\r
\r
                if (coin.z < -30) {\r
                    coinItems.splice(i, 1);\r
                    continue;\r
                }\r
\r
                if (!coin.collected && Math.abs(coin.z) < 30) {\r
                    const proj = getProjectedPos(coin.z, coin.laneOffset);\r
                    const dx = proj.x - player.currentX;\r
                    const dy = (proj.y + Math.sin(coin.bobOffset) * 4) - (player.y + player.h/2);\r
                    if (Math.abs(dx) < 35 && Math.abs(dy) < 35) {\r
                        coin.collected = true;\r
                        coins++;\r
                        updateDisplay();\r
                        addParticles(proj.x, proj.y, '#f1c40f', 15);\r
                        if (coins % 8 === 0) {\r
                            player.invincible = 100;\r
                            addParticles(player.currentX, player.y, '#00ff88', 25);\r
                        }\r
                        coinItems.splice(i, 1);\r
                    }\r
                }\r
            }\r
\r
            // Cập nhật hạt\r
            for (let i = particles.length - 1; i >= 0; i--) {\r
                const p = particles[i];\r
                p.x += p.vx;\r
                p.y += p.vy;\r
                p.vy += 0.08;\r
                p.life--;\r
                if (p.life <= 0) particles.splice(i, 1);\r
            }\r
\r
            // Điểm thời gian\r
            if (frame % 3 === 0) {\r
                score += 0.5;\r
                updateDisplay();\r
            }\r
        }\r
\r
        // === VẼ ===\r
        function draw() {\r
            ctx.clearRect(0, 0, W, H);\r
\r
            // === NỀN ===\r
            const grad = ctx.createLinearGradient(0, 0, 0, H);\r
            grad.addColorStop(0, '#0a0a2a');\r
            grad.addColorStop(0.4, '#1a2a5a');\r
            grad.addColorStop(0.7, '#2a3a6a');\r
            grad.addColorStop(1, '#1a1a3a');\r
            ctx.fillStyle = grad;\r
            ctx.fillRect(0, 0, W, H);\r
\r
            // === VẼ ĐƯỜNG (PHỐI CẢNH) ===\r
            // Đường chạy (dạng đường hầm)\r
            for (let z = 0; z < 800; z += 8) {\r
                const p = getProjectedPos(z, 0);\r
                const width = 200 * p.scale;\r
                const alpha = 0.1 + 0.4 * p.scale;\r
                ctx.fillStyle = \`rgba(60, 40, 30, \${alpha * 0.5})\`;\r
                ctx.fillRect(p.x - width/2, p.y, width, 4);\r
            }\r
\r
            // Vạch kẻ đường (3 làn)\r
            for (let lane = -1; lane <= 1; lane++) {\r
                for (let z = 0; z < 600; z += 40) {\r
                    const p = getProjectedPos(z, lane * LANE_WIDTH);\r
                    const width = 4 * p.scale;\r
                    const alpha = 0.3 + 0.5 * p.scale;\r
                    ctx.fillStyle = \`rgba(255, 255, 255, \${alpha * 0.3})\`;\r
                    ctx.fillRect(p.x - width/2, p.y, width, 6 * p.scale);\r
                }\r
            }\r
\r
            // Đường viền\r
            for (let side = -1; side <= 1; side += 2) {\r
                for (let z = 0; z < 500; z += 15) {\r
                    const p = getProjectedPos(z, side * 130);\r
                    const width = 3 * p.scale;\r
                    const alpha = 0.2 + 0.4 * p.scale;\r
                    ctx.fillStyle = \`rgba(200, 150, 100, \${alpha * 0.3})\`;\r
                    ctx.fillRect(p.x - width/2, p.y, width, 6 * p.scale);\r
                }\r
            }\r
\r
            // === VẼ ĐỒNG XU ===\r
            for (const coin of coinItems) {\r
                if (coin.collected) continue;\r
                const p = getProjectedPos(coin.z, coin.laneOffset);\r
                const r = coin.radius * p.scale;\r
                const y = p.y + Math.sin(coin.bobOffset) * 4 * p.scale;\r
                if (r < 2) continue;\r
\r
                const grad2 = ctx.createRadialGradient(p.x - 2, y - 2, 1, p.x, y, r + 3);\r
                grad2.addColorStop(0, '#f1c40f');\r
                grad2.addColorStop(0.6, '#f39c12');\r
                grad2.addColorStop(1, '#d4a017');\r
                ctx.shadowColor = '#f1c40f66';\r
                ctx.shadowBlur = 15 * p.scale;\r
                ctx.beginPath();\r
                ctx.arc(p.x, y, r, 0, Math.PI * 2);\r
                ctx.fillStyle = grad2;\r
                ctx.fill();\r
                ctx.shadowBlur = 0;\r
                ctx.fillStyle = '#b8860b';\r
                ctx.font = \`\${Math.max(8, r)}px Arial\`;\r
                ctx.textAlign = 'center';\r
                ctx.textBaseline = 'middle';\r
                ctx.fillText('¢', p.x, y + 1);\r
            }\r
\r
            // === VẼ VẬT CẢN ===\r
            for (const ob of obstacles) {\r
                const p = getProjectedPos(ob.z, ob.laneOffset);\r
                const scale = p.scale;\r
                if (scale < 0.05) continue;\r
\r
                const w = ob.w * scale;\r
                const h = ob.h * scale;\r
                const x = p.x - w/2;\r
                const y = p.y - h/2;\r
\r
                ctx.shadowColor = ob.color + '88';\r
                ctx.shadowBlur = 15 * scale;\r
                ctx.shadowOffsetY = 3 * scale;\r
                ctx.fillStyle = ob.color;\r
                ctx.beginPath();\r
                ctx.roundRect(x, y, w, h, 3 * scale);\r
                ctx.fill();\r
                ctx.shadowBlur = 0;\r
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';\r
                ctx.lineWidth = 1;\r
                ctx.strokeRect(x, y, w, h);\r
                ctx.fillStyle = 'rgba(255,255,255,0.08)';\r
                ctx.fillRect(x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.15);\r
            }\r
\r
            // === VẼ NHÂN VẬT (góc nhìn từ sau lưng) ===\r
            const px = player.currentX - player.w/2;\r
            const py = player.y;\r
\r
            // Bóng đổ\r
            ctx.shadowColor = 'rgba(0,0,0,0.5)';\r
            ctx.shadowBlur = 20;\r
            ctx.shadowOffsetY = 8;\r
            ctx.fillStyle = 'rgba(0,0,0,0.3)';\r
            ctx.beginPath();\r
            ctx.ellipse(player.currentX, GROUND_Y + 2, 18, 6, 0, 0, Math.PI * 2);\r
            ctx.fill();\r
\r
            // Hiệu ứng bất tử\r
            if (player.invincible > 0 && Math.floor(frame / 6) % 2 === 0) {\r
                ctx.shadowColor = '#00ff88';\r
                ctx.shadowBlur = 40;\r
            }\r
\r
            // Thân\r
            const grad3 = ctx.createLinearGradient(px, py, px + player.w, py + player.h);\r
            grad3.addColorStop(0, '#f39c12');\r
            grad3.addColorStop(0.5, '#e67e22');\r
            grad3.addColorStop(1, '#d35400');\r
            ctx.shadowColor = '#b85e0a88';\r
            ctx.shadowBlur = 16;\r
            ctx.shadowOffsetY = 4;\r
            ctx.fillStyle = grad3;\r
            ctx.beginPath();\r
            ctx.roundRect(px, py, player.w, player.h, 6);\r
            ctx.fill();\r
\r
            // Đầu (nhìn từ sau)\r
            ctx.shadowBlur = 10;\r
            ctx.fillStyle = '#f1c40f';\r
            ctx.beginPath();\r
            ctx.arc(px + player.w/2, py - 4, 13, 0, Math.PI * 2);\r
            ctx.fill();\r
\r
            // Tóc (mũ)\r
            ctx.fillStyle = '#d35400';\r
            ctx.beginPath();\r
            ctx.arc(px + player.w/2 - 2, py - 10, 8, 0, Math.PI * 2);\r
            ctx.fill();\r
            ctx.arc(px + player.w/2 + 2, py - 10, 8, 0, Math.PI * 2);\r
            ctx.fill();\r
\r
            // Khăn quàng bay\r
            ctx.shadowBlur = 4;\r
            ctx.fillStyle = '#e74c3c';\r
            const flutter = Math.sin(frame * 0.1) * 3;\r
            ctx.fillRect(px - 4 + flutter, py + 6, player.w + 8, 5);\r
            ctx.fillStyle = '#c0392b';\r
            ctx.fillRect(px - 6 + flutter * 1.5, py + 10, 6, 14);\r
\r
            // Chân\r
            if (player.isOnGround && !player.sliding) {\r
                ctx.shadowBlur = 2;\r
                ctx.fillStyle = '#2c3e50';\r
                const step = Math.floor(frame / 5) % 2;\r
                ctx.fillRect(px + 2 + (step * 8), py + player.h - 4, 8, 4);\r
                ctx.fillRect(px + player.w - 10 - (step * 8), py + player.h - 4, 8, 4);\r
            }\r
\r
            ctx.shadowBlur = 0;\r
\r
            // === HIỆU ỨNG HẠT ===\r
            for (const p of particles) {\r
                const alpha = p.life / p.maxLife;\r
                ctx.globalAlpha = alpha;\r
                ctx.fillStyle = p.color;\r
                ctx.beginPath();\r
                ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);\r
                ctx.fill();\r
            }\r
            ctx.globalAlpha = 1;\r
\r
            // === GAME OVER ===\r
            if (gameOver) {\r
                ctx.fillStyle = 'rgba(0,0,0,0.6)';\r
                ctx.fillRect(0, 0, W, H);\r
                ctx.shadowBlur = 40;\r
                ctx.shadowColor = '#e74c3c';\r
                ctx.font = 'bold 64px Arial';\r
                ctx.fillStyle = '#f1c40f';\r
                ctx.textAlign = 'center';\r
                ctx.textBaseline = 'middle';\r
                ctx.fillText('💀 GAME OVER', W/2, 190);\r
                ctx.shadowBlur = 0;\r
                ctx.font = '24px Arial';\r
                ctx.fillStyle = '#ecf0f1';\r
                ctx.fillText('Nhấn "Chạy lại" hoặc phím R', W/2, 260);\r
                ctx.font = '30px Arial';\r
                ctx.fillStyle = '#f1c40f';\r
                ctx.fillText(\`Điểm: \${Math.floor(score)}\`, W/2, 330);\r
                ctx.fillStyle = '#f39c12';\r
                ctx.fillText(\`🪙 \${coins}\`, W/2 + 200, 330);\r
                if (newBestRun) {\r
                    ctx.font = 'bold 24px Arial';\r
                    ctx.fillStyle = '#2ecc71';\r
                    ctx.fillText('🌟 KỶ LỤC MỚI!', W/2, 296);\r
                }\r
                ctx.font = '22px Arial';\r
                ctx.fillStyle = '#ecf0f1';\r
                ctx.fillText(\`🏆 Kỷ lục: \${best.bestScore} · 🪙 \${best.bestCoins}\`, W/2, 378);\r
            }\r
\r
            // === UI ===\r
            ctx.fillStyle = 'rgba(255,255,255,0.5)';\r
            ctx.font = '14px monospace';\r
            ctx.fillText(\`⚡ \${speed.toFixed(1)}\`, 16, 28);\r
            if (player.invincible > 0) {\r
                ctx.fillStyle = '#00ff88';\r
                ctx.font = 'bold 16px Arial';\r
                ctx.fillText('🛡️ BẤT TỬ', 16, 52);\r
            }\r
\r
            // Chỉ báo làn đường\r
            ctx.fillStyle = 'rgba(255,255,255,0.15)';\r
            for (let i = 0; i < 3; i++) {\r
                const x = 80 + i * 40;\r
                const y = H - 30;\r
                ctx.fillStyle = (i === player.lane) ? 'rgba(241, 196, 15, 0.4)' : 'rgba(255,255,255,0.1)';\r
                ctx.beginPath();\r
                ctx.arc(x, y, 10, 0, Math.PI * 2);\r
                ctx.fill();\r
                ctx.strokeStyle = (i === player.lane) ? '#f1c40f' : 'rgba(255,255,255,0.2)';\r
                ctx.lineWidth = 2;\r
                ctx.stroke();\r
            }\r
        }\r
\r
        // Polyfill\r
        if (!CanvasRenderingContext2D.prototype.roundRect) {\r
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {\r
                if (r > w/2) r = w/2;\r
                if (r > h/2) r = h/2;\r
                this.moveTo(x + r, y);\r
                this.lineTo(x + w - r, y);\r
                this.quadraticCurveTo(x + w, y, x + w, y + r);\r
                this.lineTo(x + w, y + h - r);\r
                this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);\r
                this.lineTo(x + r, y + h);\r
                this.quadraticCurveTo(x, y + h, x, y + h - r);\r
                this.lineTo(x, y + r);\r
                this.quadraticCurveTo(x, y, x + r, y);\r
                this.closePath();\r
                return this;\r
            };\r
        }\r
\r
        // === GAME LOOP ===\r
        function gameLoop() {\r
            update();\r
            draw();\r
            requestAnimationFrame(gameLoop);\r
        }\r
\r
        // === SỰ KIỆN ===\r
        document.addEventListener('keydown', (e) => {\r
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'r', 'R'].includes(e.key)) {\r
                e.preventDefault();\r
            }\r
            if (e.key === 'ArrowUp' || e.key === ' ') playerJump();\r
            else if (e.key === 'ArrowDown') playerSlide();\r
            else if (e.key === 'ArrowLeft') moveLeft();\r
            else if (e.key === 'ArrowRight') moveRight();\r
            else if (e.key === 'r' || e.key === 'R') resetGame();\r
        });\r
\r
        document.getElementById('restartBtn').addEventListener('click', resetGame);\r
\r
        canvas.addEventListener('click', (e) => {\r
            if (gameOver) { resetGame(); return; }\r
            const rect = canvas.getBoundingClientRect();\r
            const x = (e.clientX - rect.left) / rect.width * W;\r
            if (x < W/3) moveLeft();\r
            else if (x > W*2/3) moveRight();\r
            else playerJump();\r
        });\r
\r
        // Touch support\r
        let touchStartX = 0, touchStartY = 0;\r
        canvas.addEventListener('touchstart', (e) => {\r
            e.preventDefault();\r
            const touch = e.touches[0];\r
            const rect = canvas.getBoundingClientRect();\r
            touchStartX = (touch.clientX - rect.left) / rect.width * W;\r
            touchStartY = (touch.clientY - rect.top) / rect.height * H;\r
        });\r
\r
        canvas.addEventListener('touchmove', (e) => {\r
            e.preventDefault();\r
            if (gameOver) return;\r
            const touch = e.touches[0];\r
            const rect = canvas.getBoundingClientRect();\r
            const x = (touch.clientX - rect.left) / rect.width * W;\r
            const y = (touch.clientY - rect.top) / rect.height * H;\r
            const dx = x - touchStartX;\r
            const dy = y - touchStartY;\r
\r
            if (Math.abs(dx) > Math.abs(dy)) {\r
                if (dx > 30) moveRight();\r
                else if (dx < -30) moveLeft();\r
            } else {\r
                if (dy < -30) playerJump();\r
                else if (dy > 30) playerSlide();\r
            }\r
            touchStartX = x;\r
            touchStartY = y;\r
        });\r
\r
        // === BẮT ĐẦU ===\r
        resetGame();\r
        gameLoop();\r
        console.log('🏃 Temple Run - Góc nhìn thứ nhất 2D (giả 3D)');\r
        console.log('⬆️ Nhảy | ⬇️ Trượt | ⬅️➡️ Đổi làn | Thu thập xu để bất tử!');\r
    })();\r
<\/script>\r
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