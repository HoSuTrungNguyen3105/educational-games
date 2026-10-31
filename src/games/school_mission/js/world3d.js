// ===== WORLD3D: thế giới 3D + camera sau vai (three.js r128, giống Leo Tháp Mây) =====
/* Logic game vẫn chạy trên hệ toạ độ 2D cũ, chỉ thay lớp vẽ:
 *     X3 = (x2 - WW/2) / W3PX,  Z3 = (y2 - WH/2) / W3PX
 * nên blocked(), ZN(), thời khoá biểu, quiz, nhiệm vụ… không phải sửa.
 *
 * startW3() trả null khi không tải được three.js (mạng về chậm / máy chặn WebGL)
 * → js/render.js quay về lối vẽ 2D cũ, game vẫn chơi được. */

var W3 = null;
const W3PX = 45; // 45 pixel bản đồ = 1 mét
/* Mở School_mission.html?...&debug để kiểm tra tọa độ máy quay / nhân vật */
const DEBUG3D = typeof location !== "undefined" && /debug/.test(location.search || "");

function startW3() {
    if (!window.THREE) return null;
    const stage = $("gl");
    if (!stage) return null;
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch (e) {
        return null; // trình duyệt chặn WebGL
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, .1, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb9ccff, .95));
    const sun = new THREE.DirectionalLight(0xfff1d6, .7);
    sun.position.set(-12, 22, 14);
    scene.add(sun);

    const props = new THREE.Group(); scene.add(props);  // nhà, bàn ghế, cây…
    const marks = new THREE.Group(); scene.add(marks);  // biển tên vùng
    const kids = new THREE.Group(); scene.add(kids);    // nhân vật
    const flowerG = new THREE.Group(); scene.add(flowerG);

    /* ── tài nguyên dùng chung (không dispose khi đổi cảnh) ── */
    const boxG = new THREE.BoxGeometry(1, 1, 1);
    const sphG = new THREE.SphereGeometry(1, 12, 8);
    const cylG = new THREE.CylinderGeometry(1, 1, 1, 10);
    const coneG = new THREE.ConeGeometry(1, 1, 4);
    const shared = [boxG, sphG, cylG, coneG];
    const matCache = {};
    const matOf = (hex) => matCache[hex] || (matCache[hex] = new THREE.MeshLambertMaterial({ color: hex }));
    const hexOf = (css) => parseInt(String(css || "").replace("#", ""), 16) || 0xff9f43;

    /* ── bản đồ 2D (px) → sân 3D (mét) ── */
    let WW = D.out[0], WH = D.out[1];
    const xOf = (x) => (x - WW / 2) / W3PX;
    const zOf = (y) => (y - WH / 2) / W3PX;
    const uX = (x, S) => (x / WW) * S;
    const uY = (y, S) => (1 - y / WH) * S; // ảnh lật ngược nên trục đứng đảo lại

    function cube(w, h, d, hex, x, y, z, par) {
        const m = new THREE.Mesh(boxG, matOf(hex));
        m.scale.set(w, h, d); m.position.set(x, y, z);
        (par || props).add(m); return m;
    }
    function ball(r, hex, x, y, z, par) {
        const m = new THREE.Mesh(sphG, matOf(hex));
        m.scale.setScalar(r); m.position.set(x, y, z);
        (par || props).add(m); return m;
    }
    function tex(w, h, paint) {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        paint(c.getContext("2d"), w, h);
        return new THREE.CanvasTexture(c);
    }
    /* Biển chữ: sprite luôn quay về phía máy quay */
    function sign(text, hex, fontSize, w, h, size) {
        const t = tex(w, h, (cx) => {
            cx.font = "bold " + fontSize + "px system-ui";
            cx.textAlign = "center"; cx.textBaseline = "middle";
            cx.lineWidth = 7; cx.strokeStyle = "rgba(20,30,60,.65)";
            cx.strokeText(text, w / 2, h / 2);
            cx.fillStyle = hex; cx.fillText(text, w / 2, h / 2);
        });
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
        sp.scale.set(size * (w / h), size, 1);
        return sp;
    }
    function emojiSprite(text, size) {
        const t = tex(128, 128, (cx) => {
            cx.font = "96px serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
            cx.fillText(text, 64, 70);
        });
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
        sp.scale.set(size, size, 1);
        return sp;
    }
    /* Nền đất vẽ bằng canvas texture — lấy thẳng dữ liệu trang trí 2D (tufts/flw) */
    function ground(paint) {
        const S = 768;
        const t = tex(S, S, (cx) => paint(cx, S));
        const pg = new THREE.PlaneGeometry(WW / W3PX, WH / W3PX);
        const m = new THREE.Mesh(pg, new THREE.MeshLambertMaterial({ map: t }));
        m.rotation.x = -Math.PI / 2;
        props.add(m);
        return m;
    }
    /* Tô một hình chữ nhật của bản đồ 2D lên canvas nền */
    function wrect(cx, x, y, w, h, hex, S) {
        cx.fillStyle = hex;
        cx.fillRect(uX(x, S), uY(y + h, S), w / WW * S, h / WH * S);
    }

    /* Dọn sạch một nhóm khi đổi cảnh: geometry/vật liệu riêng của cảnh vừa rồi
       được giải phóng, chỉ giữ lại hình khối + vật liệu màu dùng chung. */
    function clearGroup(gr) {
        gr.traverse((o) => {
            if (o.isInstancedMesh) o.dispose();
            const m = o.material;
            if (m) {
                if (m.map) m.map.dispose();
                if (m.isSpriteMaterial || m.isMeshBasicMaterial || m.map) m.dispose();
            }
            if (o.geometry && shared.indexOf(o.geometry) < 0) o.geometry.dispose();
        });
        gr.clear();
    }

    /* ══════ CÂY ══════ */
    function buildTrees() {
        const n = trees.length || 1;
        const trunk = new THREE.InstancedMesh(cylG, matOf(0x8b5a2b), n);
        const leafA = new THREE.InstancedMesh(sphG, matOf(0x38b155), n);
        const leafB = new THREE.InstancedMesh(sphG, matOf(0x4cc866), n);
        const m = new THREE.Matrix4();
        trees.forEach((t, i) => {
            const x = xOf(t[0]), z = zOf(t[1]), s = t[2];
            m.makeScale(.17 * s, 1.25 * s, .17 * s).setPosition(x, .62 * s, z); trunk.setMatrixAt(i, m);
            m.makeScale(1.15 * s, 1 * s, 1.15 * s).setPosition(x, 1.8 * s, z); leafA.setMatrixAt(i, m);
            m.makeScale(.7 * s, .62 * s, .7 * s).setPosition(x - .18 * s, 2.45 * s, z); leafB.setMatrixAt(i, m);
        });
        trunk.instanceMatrix.needsUpdate = true;
        leafA.instanceMatrix.needsUpdate = true;
        leafB.instanceMatrix.needsUpdate = true;
        props.add(trunk, leafA, leafB);
    }

    /* ══════ SÂN TRƯỜNG ══════ */
    function buildOut() {
        scene.background = new THREE.Color(0x9fd8ff);
        scene.fog = new THREE.Fog(0x9fd8ff, 32, 130);

        ground((cx, S) => {
            const gr = cx.createLinearGradient(0, 0, 0, S);
            gr.addColorStop(0, "#8fdc78"); gr.addColorStop(1, "#6cc15a");
            cx.fillStyle = gr; cx.fillRect(0, 0, S, S);
            tufts.forEach(([x, y, r]) => {
                cx.fillStyle = r > .5 ? "#5fb44e" : "#9be58a";
                cx.fillRect(uX(x, S), uY(y, S), 3, 7);
            });
            // hồ nước (vẽ vào nền: 2D cũng không chặn đi lên hồ)
            cx.fillStyle = "#d7c9a8";
            cx.beginPath(); cx.ellipse(uX(360, S), uY(360, S), 160 / WW * S, 95 / WH * S, 0, 0, 7); cx.fill();
            cx.fillStyle = "#6cc4ef";
            cx.beginPath(); cx.ellipse(uX(360, S), uY(360, S), 145 / WW * S, 80 / WH * S, 0, 0, 7); cx.fill();
            // đường ngang + đường dọc (sân mới 2400 x 1400: trục ngang y=650 h=140, trục dọc x=1130 w=140)
            wrect(cx, 0, 644, WW, 152, "#b7bcc6", S);
            wrect(cx, 0, 650, WW, 140, "#d9dde3", S);
            wrect(cx, 1124, 0, 152, WH, "#b7bcc6", S);
            wrect(cx, 1130, 0, 140, WH, "#d9dde3", S);
            for (let x = 0; x < WW; x += 80) wrect(cx, x, 716, 40, 8, "rgba(255,255,255,.85)", S);
            wrect(cx, 800, 350, 800, 16, "#c9a77c", S);
            flw.forEach(f => {
                cx.fillStyle = f[2];
                cx.beginPath(); cx.arc(uX(f[0], S), uY(f[1], S), 3.4, 0, 7); cx.fill();
            });
        });

        // Dãy nhà trường: 2 khối ngang + tháp giữa (2D cấm đi vào 820..1580 × 90..352, tâm 1200)
        const hi = 6.2, dTop = 90, dBot = 352;
        const deep = (dBot - dTop) / W3PX;
        const zc = zOf((dTop + dBot) / 2), zS = zOf(dBot);
        const wing = (x0, x1) => {
            const w = (x1 - x0) / W3PX, x = xOf((x0 + x1) / 2);
            cube(w, hi, deep, 0xf7e6c2, x, hi / 2, zc);
            cube(w + .5, .5, deep + .5, 0xd1495b, x, hi + .25, zc);
            for (let i = 0; i < Math.max(1, Math.floor(w / 1.7)); i++) {
                const wx = x - w / 2 + 1 + i * 1.7;
                cube(1, 1.1, .12, 0x8fd0f0, wx, 2.1, zS - .1);
                cube(1, 1.1, .12, 0x8fd0f0, wx, 4.2, zS - .1);
            }
        };
        wing(820, 1120); wing(1280, 1580);

        const tw = (1280 - 1120) / W3PX, tx = xOf(1200);
        cube(tw, 9.4, deep, 0xc25b49, tx, 4.7, zc);
        const towerRoof = new THREE.Mesh(coneG, matOf(0x6b3a2a));
        towerRoof.rotation.y = Math.PI / 4;
        const rad = Math.hypot(tw, deep) / 1.25;
        towerRoof.scale.set(rad, 2.6, rad); towerRoof.position.set(tx, 10.7, zc); props.add(towerRoof);
        ball(.8, 0xffffff, tx, 7.4, zS - .1);
        cube(1.5, .35, .2, 0x2c3e66, tx, 5.6, zS - .05);
        const banner = sign("TRƯỜNG TIỂU HỌC VUI VẺ", "#ffd23f", 46, 512, 112, 1.5);
        banner.position.set(tx, 5.6, zS - .25); banner.userData.y = 5.6; marks.add(banner);
        cube(3.2, .3, 1, 0xcfcfd6, tx, .15, zS + .5);          // bậc thềm
        // Cột cờ trung tâm sân
        const m = new THREE.Mesh(cylG, matOf(0xdddddd));
        m.scale.set(.08, 5.5, .08); m.position.set(xOf(1200), 2.75, zOf(570)); props.add(m);
        cube(2.0, 1.3, .06, 0xe74c3c, xOf(1200) + 1.0, 4.8, zOf(570));

        buildTrees();

        // Đài phun nước lớn bên phải sân
        const basin = new THREE.Mesh(cylG, matOf(0x4fa3d1));
        basin.scale.set(1.6, .6, 1.6); basin.position.set(xOf(2120), .3, zOf(650)); props.add(basin);
        const jet = new THREE.Mesh(cylG, matOf(0x00d2ff));
        jet.scale.set(.35, 1.6, .35); jet.position.set(xOf(2120), 1.2, zOf(650)); props.add(jet);

        // Nhà / sân trong sân trường (P trong js/config.js)
        P.forEach((p) => {
            const lock = p.lv && S.lv < p.lv;
            const cx0 = xOf(p.x + p.w / 2);
            if (p.b) {
                const w = p.w / W3PX, bodyTop = p.y + 55, bodyH = p.h - 65;
                const d = bodyH / W3PX, zc2 = zOf(bodyTop + bodyH / 2);
                cube(w, bodyH / W3PX, d, hexOf(p.c), cx0, bodyH / W3PX / 2, zc2);
                const roof = new THREE.Mesh(coneG, matOf(hexOf(p.r || p.c)));
                roof.rotation.y = Math.PI / 4;
                const hr = Math.hypot(w, d) / 1.3;
                roof.scale.set(hr, 1.7, hr); roof.position.set(cx0, bodyH / W3PX + .8, zc2);
                props.add(roof);
                cube(1.1, 2, .18, 0x7a4a2a, cx0, 1, zOf(p.y + p.h - 12));
            } else {
                const w = p.w / W3PX, d = p.h / W3PX, zc2 = zOf(p.y + p.h / 2);
                cube(w, .14, d, lock ? 0x8fa0a0 : hexOf(p.c), cx0, .07, zc2);
                cube(w, .5, .12, 0xffffff, cx0, .25, zOf(p.y));
                cube(w, .5, .12, 0xffffff, cx0, .25, zOf(p.y + p.h));
                cube(.12, .5, d, 0xffffff, xOf(p.x), .25, zc2);
                cube(.12, .5, d, 0xffffff, xOf(p.x + p.w), .25, zc2);
                if (lock) {
                    const lk = sign("🔒 Mở ở cấp " + p.lv, "#ffffff", 40, 512, 96, 1);
                    lk.position.set(cx0, 1.3, zc2); lk.userData.y = 1.3; marks.add(lk);
                } else if (p.id === "garden") {
                    ["🌷", "🌼", "🌻"].forEach((e, i) => {
                        for (let j = 0; j < 5; j++) {
                            const s = emojiSprite(e, .6);
                            s.position.set(xOf(p.x + 50 + j * 66), .5, zOf(p.y + 80 + i * 80));
                            props.add(s);
                        }
                    });
                } else if (p.id === "gym" || p.id === "pet") {
                    [["🐶", 80, 170], ["🐱", 290, 120], ["🐾", 190, 250]].forEach(([e, ox, oy]) => {
                        const s = emojiSprite(e, 1.1);
                        s.position.set(xOf(p.x + ox), .7, zOf(p.y + oy)); props.add(s);
                    });
                }
            }
        });
    }

    /* ══════ HÀNH LANG ══════ */
    function buildHall(level) {
        scene.background = new THREE.Color(0xe9f1fb);
        scene.fog = null;
        const yWall = 195, hi = 3.4;
        const doors = level === 1
            ? KS.map(k => ({ x: DX[k] + 25, w: 160, hex: hexOf(RM[k].c) }))
            : [{ x: DX.lib + 25, w: 160, hex: hexOf(RM.lib.c) }];

        ground((cx, S) => {
            const gr = cx.createLinearGradient(0, uY(420, S), 0, uY(170, S));
            gr.addColorStop(0, "#d9c7a4"); gr.addColorStop(1, "#ecdfc6");
            cx.fillStyle = gr; cx.fillRect(0, 0, S, S);
            cx.fillStyle = "rgba(0,0,0,.05)";
            for (let i = 0; i < 29; i++) for (let j = 0; j < 5; j++) {
                if ((i + j) % 2) cx.fillRect(uX(i * 60, S), uY(170 + (j + 1) * 60, S), 60 / WW * S, 60 / WH * S);
            }
            wrect(cx, 0, 166, WW, 8, "#8b6b4a", S);
        });

        // khối tường lớp học phía bắc (2D cấm đi vào y < 195)
        cube(WW / W3PX, hi, yWall / W3PX, 0xf3d9b8, 0, hi / 2, zOf(yWall / 2));
        cube(.3, hi, (WH - yWall) / W3PX, 0xe7d3ac, xOf(WW - 6), hi / 2, zOf((WH + yWall) / 2));
        // lan can thấp phía nam để máy quay không bị che
        cube(WW / W3PX, .85, .12, 0xcfe0f5, 0, .42, zOf(WH - 8));

        // cửa lớp dọc tường phía bắc
        let cur = 0;
        doors.forEach((d) => {
            const a = d.x - d.w / 2, b = d.x + d.w / 2;
            if (a > cur) cube((a - cur) / W3PX, hi, .34, 0xf6e7c8, xOf((cur + a) / 2), hi / 2, zOf(yWall));
            const px = xOf(d.x), pz = zOf(yWall), half = d.w / W3PX / 2;
            cube(d.w / W3PX, hi - 2.4, .34, 0xf6e7c8, px, hi - (hi - 2.4) / 2, pz);
            cube(.22, 2.4, .42, d.hex, px - half, 1.2, pz);
            cube(.22, 2.4, .42, d.hex, px + half, 1.2, pz);
            cube(d.w / W3PX * .8, .12, .5, d.hex, px, .06, pz + .35);
            cur = b;
        });
        if (cur < WW) cube((WW - cur) / W3PX, hi, .34, 0xf6e7c8, xOf((cur + WW) / 2), hi / 2, zOf(yWall));

        if (level === 2) {
            // tường tầng 2 có cửa sổ lớn nhìn ra sân
            [140, 340, 1290, 1490].forEach(wx => {
                const w = 130 / W3PX, x = xOf(wx + 65);
                cube(w + .2, 2, .2, 0xffffff, x, 2.1, zOf(yWall) - .02);
                cube(w, 1.6, .3, 0x9fd8ff, x, 2.1, zOf(yWall) - .12);
            });
        } else {
            KS.forEach((k) => {
                const px = xOf(DX[k] + 130), pz = zOf(yWall);
                for (let j = 0; j < 3; j++)
                    cube(1.2, 1.3, .1, [0xe17055, 0xfdcb6e, 0x74b9ff][(KS.indexOf(k) + j) % 3], px + j * .8, 2.1, pz - .06);
            });
        }

        // chậu cây cảnh dọc tường
        [170, 500, 820, 1180, 1500].forEach(x => {
            const s = emojiSprite("🪴", .8);
            s.position.set(xOf(x), .45, zOf(208)); props.add(s);
        });

        // cầu thang bộ cuối hành lang (vùng 1560..1700 của ZN())
        const sx = xOf(1630), sz = zOf(300);
        for (let i = 0; i < 9; i++)
            cube(3, .26, .6, i % 2 ? 0xd9c49a : 0xe8d5ae, sx, .13 + i * .26, sz + 2 - i * .55);
        cube(3.2, 2.6, .3, 0xb99a6b, sx, 1.3, sz + 2.6);

        // cửa ra sân phía tây
        cube(.3, 2.6, 3, 0x9fd8ff, xOf(12), 1.3, zOf(300));
    }

    /* ══════ LỚP HỌC ══════ */
    function buildRoom(r) {
        const info = RM[r];
        scene.background = new THREE.Color(hexOf(info.f));
        scene.fog = null;
        const yTop = 280, xL = 60, xR = 940, hi = 3.4;

        ground((cx, S) => {
            cx.fillStyle = info.f; cx.fillRect(0, 0, S, S);
            cx.fillStyle = "rgba(0,0,0,.06)";
            for (let i = 0; i < 20; i++) for (let j = 0; j < 12; j++) {
                if ((i + j) % 2) cx.fillRect(uX(i * 50, S), uY((j + 1) * 50, S), 50 / WW * S, 50 / WH * S);
            }
            wrect(cx, 0, 128, WW, 14, "#8b6b4a", S);
        });

        // bục giảng: dải cấm đi vào y < 280 làm bệ thấp + tường hậu
        const stageW = (xR - xL) / W3PX, stageZ = zOf(yTop / 2);
        cube(stageW, .34, yTop / W3PX, 0xe6d3ae, xOf((xL + xR) / 2), .17, stageZ);
        cube(stageW, hi, 36 / W3PX, 0xf6efdd, xOf((xL + xR) / 2), hi / 2, zOf(18));

        const bx = xOf(500), bz = zOf(52);
        const boardTex = tex(1024, 320, (cx, w, h) => {
            cx.fillStyle = "#7a5230"; cx.fillRect(0, 0, w, h);
            cx.fillStyle = "#2f5d4a"; cx.fillRect(20, 18, w - 40, h - 36);
            cx.fillStyle = "#fff8e6"; cx.font = "bold 56px system-ui";
            cx.textAlign = "center"; cx.textBaseline = "middle";
            cx.fillText(info.e + "  " + info.b, w / 2, h / 2);
        });
        const pg = new THREE.PlaneGeometry(8, 2.4);
        const board = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ map: boardTex }));
        board.position.set(bx, 2.1, bz + .1); props.add(board);
        cube(6, 2.8, .2, 0x7a5230, bx, 2.1, bz - .05);
        const clock = ball(.55, 0xffffff, xOf(110), 2.4, zOf(60) + .2);
        clock.scale.set(.55, .55, .2);
        [xOf(50), xOf(950)].forEach(x => { const s = emojiSprite(info.e, 1); s.position.set(x, 1.8, zOf(170)); props.add(s); });
        const win = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ color: 0x9fd8ff }));
        win.position.set(xOf(885), 2.2, zOf(64) + .22); props.add(win);
        cube(2.7, 1.9, .12, 0xffffff, xOf(885), 2.2, zOf(64) + .12);

        cube(1.9, .95, 1.05, 0x9c6b3f, xOf(500), .82, zOf(250));       // bàn giáo viên
        const apple = emojiSprite("🍎", .4); apple.position.set(xOf(460), 1.5, zOf(250)); props.add(apple);
        cube(3.5, .3, 1.1, 0x7a4a2a, xOf(500), .15, zOf(577));          // bục dưới (như 2D)

        // tường bao tây/đông + lan can nam
        cube(.3, hi, (WH - yTop) / W3PX, 0xdfe6f0, xOf(xL), hi / 2, zOf((WH + yTop) / 2));
        cube(.3, hi, (WH - yTop) / W3PX, 0xdfe6f0, xOf(xR), hi / 2, zOf((WH + yTop) / 2));
        cube(stageW, .85, .12, 0xcfe0f5, xOf((xL + xR) / 2), .42, zOf(WH - 6));

        desks.forEach((d) => {
            const x = xOf(d[0] + 45), z = zOf(d[1] + 28);
            cube(2, .12, .85, 0xc68b4e, x, .74, z);
            [[-.85, -.3], [.85, -.3], [-.85, .3], [.85, .3]].forEach(([ox, oz]) =>
                cube(.12, .74, .12, 0x7a5230, x + ox, .37, z + oz));
            cube(.9, .1, .5, 0xffffff, x, .82, z - .1);                 // quyển vở
            cube(.55, .45, .55, 0xd9b382, x, .22, z + .8);               // ghế
        });

        if (r === "lib") {
            [70, 810].forEach(bx0 => {
                const x = xOf(bx0 + 60), z = zOf(220);
                cube(2.7, 3.1, .8, 0x8b5a2b, x, 1.55, z);
                for (let i = 0; i < 2; i++) for (let j = 0; j < 6; j++)
                    cube(.3, .9, .5, [0xe17055, 0xfdcb6e, 0x74b9ff, 0x55b36a, 0xe07aa8, 0x8f7ae0][(i + j) % 6],
                        x - 1.1 + j * .44, 1 + i * 1.2, z + .18);
            });
        }
    }

    /* ══════ biển vùng — cùng dữ liệu với ZN() ══════ */
    function zoneText(z) {
        if (z.id === "school") return "🏫 Vào trường";
        if (z.id === "out") return "🚪 Ra sân trường";
        if (z.id === "stairs") return "🪜 Lên tầng 2";
        if (z.id === "down") return "🪜 Xuống tầng 1";
        if (z.id.slice(0, 2) === "d_") return "🚪 " + RM[z.id.slice(2)].n;
        if (z.id === "teach") return rk === "lib" ? "📖 Đứng đây để đọc truyện" : "📚 Đứng đây để học";
        const p = P.find(x => x.id === z.id);
        return p ? (p.lv && S.lv < p.lv ? "🔒 Mở ở cấp " + p.lv : p.n) : "⭐ " + z.id;
    }
    function buildMarks() {
        ZN().forEach((z) => {
            const s = sign(zoneText(z), "#fff3c4", 36, 512, 92, .8);
            s.position.set(xOf(z.x + z.w / 2), 1.5, zOf(z.y + z.h / 2));
            s.userData.y = 1.5;
            marks.add(s);
        });
    }

    /* ══════ nhân vật ══════ */
    function limb(hex, w, h, d, x, y, z, par) {
        const p = new THREE.Group(); p.position.set(x, y, z); par.add(p);
        const b = new THREE.Mesh(boxG, matOf(hex));
        b.scale.set(w, h, d); b.position.set(0, -h / 2, 0); p.add(b);
        return p;
    }
    function makeKid(cssHex, hat, name) {
        const root = new THREE.Group();
        const body = new THREE.Group(); body.position.y = .62; root.add(body);
        const kid = { root, body, face: 0 };
        kid.legL = limb(0x3b4a7a, .17, .5, .19, -.11, .62, 0, root);
        kid.legR = limb(0x3b4a7a, .17, .5, .19, .11, .62, 0, root);
        cube(.2, .1, .3, 0xffffff, 0, -.5, -.05, kid.legL);
        cube(.2, .1, .3, 0xffffff, 0, -.5, -.05, kid.legR);
        cube(.54, .5, .34, cssHex, 0, .22, 0, body);
        kid.armL = limb(cssHex, .14, .42, .15, -.34, .44, 0, body);
        kid.armR = limb(cssHex, .14, .42, .15, .34, .44, 0, body);
        ball(.08, 0xffe0bd, 0, -.44, 0, kid.armL);
        ball(.08, 0xffe0bd, 0, -.44, 0, kid.armR);
        const head = new THREE.Group(); head.position.y = .7; body.add(head);
        ball(.22, 0xffe0bd, 0, 0, 0, head);
        ball(.23, 0x4a3426, 0, .09, .02, head);
        ball(.035, 0x222244, -.075, .01, -.2, head);
        ball(.035, 0x222244, .075, .01, -.2, head);
        if (hat) { const e = emojiSprite(hat, .5); e.position.set(0, .4, -.02); head.add(e); }
        if (name) {
            const n = sign(name, "#ffffff", 46, 256, 88, .62);
            n.position.set(0, 1.8, 0); root.add(n);
        }
        return kid;
    }
    function pose(kid, t, mv) {
        const a = Math.min(1, .2 + mv), s = Math.sin(t);
        kid.legL.rotation.x = s * a; kid.legR.rotation.x = -s * a;
        kid.armL.rotation.x = -s * a * .8; kid.armR.rotation.x = s * a * .8;
        kid.body.position.y = .62 + Math.abs(Math.cos(t)) * .04 * a;
    }
    function place(kid, x2, y2, face) {
        kid.root.position.set(xOf(x2), 0, zOf(y2));
        kid.root.rotation.y = face;
    }
    function putKid(o, maker) {
        if (!o._kid) o._kid = maker();
        if (!o._kid.added) { kids.add(o._kid.root); o._kid.added = true; }
        return o._kid;
    }
    function hideKid(o) {
        if (o && o._kid && o._kid.added) { kids.remove(o._kid.root); o._kid.added = false; }
    }

    let player = null, playerKey = "";
    const teacherObj = {};

    function syncKids(force) {
        const key = S.col + "|" + S.hat + "|" + playerName;
        if (!player || key !== playerKey) {
            if (player) kids.remove(player.root);
            player = makeKid(hexOf(S.col), S.hat, playerName);
            playerKey = key;
            kids.add(player.root);
        }
        if (!force) return;
        npcs.forEach(n => { n._kid = null; });
        studs.forEach(s => { s._kid = null; });
        teacherObj._kid = null;
    }

    function updateKids() {
        npcs.forEach((n) => {
            if (n.sc !== sc) return hideKid(n);
            const k = putKid(n, () => makeKid(hexOf(n.c), n.h, n.n));
            place(k, n.x, n.y, Math.atan2(-(n.tx - n.x), -(n.ty - n.y)));
            pose(k, tt * 9 + n.x * .1, n.mv);
        });
        if (sc === "room") {
            studs.forEach((s) => {
                if (!s.on) return hideKid(s);
                const k = putKid(s, () => makeKid(hexOf(s.c), "", s.n));
                place(k, s.x, s.y + 34, 0);                  // quay lên bảng
                k.legL.rotation.x = k.legR.rotation.x = 1.2; // ngồi
                k.armL.rotation.x = k.armR.rotation.x = .9;
            });
            const info = RM[rk];
            const t = putKid(teacherObj, () => makeKid(hexOf(info.c), "🎓", info.t));
            place(t, 500, 226, Math.PI);                     // giáo viên quay ra lớp
            t.root.position.y = .34;                         // đứng trên bục giảng
        } else {
            studs.forEach(hideKid);
            hideKid(teacherObj);
        }

        const vx = me.dx || 0, vy = me.dy || 0;
        const spd = Math.hypot(vx, vy);
        if (spd > .04) player.face = Math.atan2(-vx, -vy);
        place(player, me.x, me.y, player.face);
        pose(player, me.t * 1.4 + tt * 4, me.mv);

        // hoa nhiệm vụ 🌸 hiện ngoài sân
        if (sc === "out") {
            flowers.forEach((f) => {
                if (!f._s) { f._s = emojiSprite("🌸", .7); flowerG.add(f._s); }
                f._s.position.set(xOf(f.x), .55 + Math.sin(tt * 3 + f.x) * .08, zOf(f.y));
            });
            for (let i = flowerG.children.length - 1; i >= 0; i--) {
                const c = flowerG.children[i];
                if (flowers.some(f => f._s === c)) continue;
                if (c.material && c.material.map) c.material.map.dispose();
                flowerG.remove(c);
            }
        } else if (flowerG.children.length) {
            flowerG.children.forEach(c => { if (c.material && c.material.map) c.material.map.dispose(); });
            flowerG.clear();
        }
    }

    /* ══════ máy quay sau vai ══════ */
    let yaw = 0, yawT = 0, pit = .34, dist = 4.3, drag = 0, dragId = null, dragX = 0, settled = false;
    stage.addEventListener("pointerdown", (e) => {
        if (open_ || e.button) return;
        dragId = e.pointerId; dragX = e.clientX;
        try { stage.setPointerCapture(dragId); } catch (err) { }
    });
    stage.addEventListener("pointermove", (e) => {
        if (e.pointerId !== dragId) return;
        yawT -= (e.clientX - dragX) * .006; dragX = e.clientX; drag = 1.2;
    });
    const endDrag = (e) => { if (e.pointerId === dragId) dragId = null; };
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    function resize() {
        const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
        renderer.setSize(w, h);
        camera.aspect = w / h; camera.fov = w < h ? 68 : 58;
        camera.updateProjectionMatrix();
    }
    addEventListener("resize", resize);
    resize();

    /* ══════ đổi cảnh ══════ */
    function enter() {
        WW = D[sc][0]; WH = D[sc][1];
        clearGroup(props); clearGroup(marks); clearGroup(flowerG); clearGroup(kids);
        if (sc === "out") buildOut();
        else if (sc === "hall") buildHall(1);
        else if (sc === "hall2") buildHall(2);
        else buildRoom(rk);
        buildMarks();
        player = null; playerKey = "";
        npcs.forEach(n => { n._kid = null; });
        studs.forEach(s => { s._kid = null; });
        teacherObj._kid = null;
        flowers.forEach(f => { f._s = null; });
        settled = false; yawT = yaw;
        syncKids(true);
    }

    const camTarget = new THREE.Vector3();
    const camWant = new THREE.Vector3();
    function frame(dt) {
        syncKids(false);   // bé đổi áo/mũ trong Cửa hàng là tạo hình đổi theo
        updateKids();

        const spd = Math.hypot(me.dx || 0, me.dy || 0);
        if (spd > .08 && !dragId) yawT = Math.atan2(-(me.dx || 0), -(me.dy || 0));
        drag = Math.max(0, drag - dt);
        const ease = drag || dragId ? 10 : (spd > .08 ? 3.2 : 1.1);
        yaw += Math.atan2(Math.sin(yawT - yaw), Math.cos(yawT - yaw)) * Math.min(1, dt * ease);

        const px = xOf(me.x), pz = zOf(me.y);
        camTarget.set(px, 1.25, pz);
        const cp = Math.cos(pit) * dist;
        camWant.set(px + Math.sin(yaw) * cp, 1.25 + Math.sin(pit) * dist, pz + Math.cos(yaw) * cp);
        if (!settled) { camera.position.copy(camWant); settled = true; }
        else camera.position.lerp(camWant, Math.min(1, dt * 8));
        camera.lookAt(camTarget);

        marks.children.forEach((m, i) => {
            m.position.y = (m.userData.y || 1.5) + Math.sin(tt * 2 + i) * .06;
        });
        renderer.render(scene, camera);
    }

    /* ══════ lớp vẽ 2D phủ trên: chữ +x, đồng hồ hái hoa, tối màn ══════ */
    const pv = new THREE.Vector3();
    function project(x2, y2, up) {
        pv.set(xOf(x2), up || 0, zOf(y2));
        pv.project(camera);
        if (pv.z > 1) return null;
        return { x: (pv.x + 1) / 2 * W, y: (1 - pv.y) / 2 * H };
    }
    function overlay() {
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, W, H);
        ft.forEach((f) => {
            const p = project(f.x, f.y, 1.7);
            if (!p) return;
            g.globalAlpha = Math.min(1, f.t);
            tx(f.s, p.x, p.y - (1.4 - f.t) * 40, 18, "#ffd23f", "rgba(0,0,0,.7)");
            g.globalAlpha = 1;
        });
        if (ftime > 0) tx("⏱ " + Math.ceil(ftime) + "s  🌸 còn " + flowers.length, W / 2, 90, 20, "#fff", "rgba(0,0,0,.6)");
        const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.max(W, H) * .75);
        v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,30,.3)");
        g.fillStyle = v; g.fillRect(0, 0, W, H);
        if (fade > 0) { g.fillStyle = "rgba(0,0,0," + fade + ")"; g.fillRect(0, 0, W, H); }
    }

    enter();
    if (DEBUG3D) window.__w3 = {
        scene, camera, props, marks, kids, renderer,
        get player() { return player; }, get yaw() { return yaw; }, get pit() { return pit; },
        get dist() { return dist; }, get world() { return [WW, WH]; }, xOf, zOf,
    };
    return { yaw: () => yaw, frame, overlay, enter, get ok() { return true; } };
}
