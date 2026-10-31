// ===== SCENES: vẽ sân trường, tòa nhà, hành lang, lớp học =====

// 1. KHỞI TẠO CÁC MẢNG TRANG TRÍ (Cỏ, hoa dại, cây cối cho sân trường rộng 3200x2000)
const MAPW = 3200, MAPH = 2000;
const tufts = [], flw = [], trees = [];

// Tạo 760 bụi cỏ ngẫu nhiên
for (let i = 0; i < 760; i++) {
    tufts.push([Math.random() * MAPW, Math.random() * MAPH, Math.random()]);
}

// Tạo 340 bông hoa dại ngẫu nhiên
for (let i = 0; i < 340; i++) {
    flw.push([
        Math.random() * MAPW, 
        Math.random() * MAPH, 
        ["#fff", "#ffd23f", "#ff8fb1", "#b28dff", "#74b9ff"][i % 5]
    ]);
}

// Tạo 120 cây xanh bóng mát
for (let i = 0; i < 120; i++) {
    const x = Math.random() * MAPW, y = 60 + Math.random() * (MAPH - 60);
    if (
        !P.some(p => x > p.x - 90 && x < p.x + p.w + 90 && y > p.y - 90 && y < p.y + p.h + 110) &&
        !(y > 900 && y < 1120) &&            // đường ngang
        !(x > 1480 && x < 1720) &&           // đường dọc
        !(x > 1080 && x < 2120 && y < 490) &&// tòa nhà trường
        !(x > 280 && x < 760 && y > 400 && y < 720) && // hồ sen
        !(x > 2620 && x < 2940 && y > 600 && y < 920)  // đài phun nước
    ) {
        trees.push([x, y, 0.85 + Math.random() * 0.55]);
    }
}

// 2. CÁC HÀM VẼ CHI TIẾT
function tree(x, y, s) {
    // Vẽ bóng đổ
    g.fillStyle = "rgba(0,0,0,.18)";
    g.beginPath();
    g.ellipse(x + 8 * s, y + 16, 28 * s, 10 * s, 0, 0, 7);
    g.fill();
    
    // Vẽ thân cây
    rg(x - 5 * s, y - 12 * s, 10 * s, 28 * s, 3, "#8b5a2b");

    // Vẽ các tán lá (sử dụng gradient để tạo khối)
    [[0, -30, 26, "#2e9e4a"], [-14, -20, 18, "#38b155"], [14, -20, 18, "#38b155"], [-4, -40, 16, "#4cc866"]]
    .forEach(([a, b, r, c]) => {
        const q = g.createRadialGradient(x + a * s - 5, y + b * s - 5, 2, x + a * s, y + b * s, r * s);
        q.addColorStop(0, "#7ee08d");
        q.addColorStop(1, c);
        g.fillStyle = q;
        g.beginPath();
        g.arc(x + a * s, y + b * s, r * s, 0, 7);
        g.fill();
    });
}

function house(p) {
    const { x, y, w, h } = p;
    
    // Bóng đổ của nhà
    g.fillStyle = "rgba(0,0,0,.2)";
    g.beginPath();
    g.ellipse(x + w / 2 + 14, y + h - 2, w / 2 + 24, 15, 0, 0, 7);
    g.fill();

    // Thân nhà
    rg(x, y + 55, w, h - 65, 10, p.c);
    
    // Mái nhà
    g.fillStyle = p.r;
    g.beginPath();
    g.moveTo(x - 16, y + 66);
    g.lineTo(x + w / 2, y - 6);
    g.lineTo(x + w + 16, y + 66);
    g.closePath();
    g.fill();
    
    // Mái nhà (phần đổ bóng)
    g.fillStyle = "rgba(255,255,255,.18)";
    g.beginPath();
    g.moveTo(x - 16, y + 66);
    g.lineTo(x + w / 2, y - 6);
    g.lineTo(x + w / 2, y + 66);
    g.fill();

    // Cửa sổ (2 bên)
    for (let i = 0; i < 2; i++) {
        const wx = x + 22 + i * (w - 92);
        rr(wx - 4, y + 92, 66, 56, 8, "#fff");
        
        const q = g.createLinearGradient(0, y + 96, 0, y + 144);
        q.addColorStop(0, "#bfe9ff");
        q.addColorStop(1, "#6fb9ef");
        rr(wx, y + 96, 58, 48, 5, q);
        
        g.fillStyle = "#fff";
        g.fillRect(wx + 27, y + 96, 4, 48);
        g.fillRect(wx, y + 118, 58, 4);
    }

    // Cửa chính
    rr(x + w / 2 - 24, y + h - 80, 48, 70, 8, "#7a4a2a");
    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(x + w / 2 + 14, y + h - 44, 3, 0, 7);
    g.fill();

    // Mái hiên
    for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? "#fff" : p.r;
        g.fillRect(x + w / 2 - 40 + i * 10, y + h - 92, 10, 14);
    }
}

function school() {
    const x = 1120, y = 120, w = 960, cx = x + w / 2;

    // Bóng đổ của tòa nhà
    g.fillStyle = "rgba(0,0,0,.22)";
    g.beginPath();
    g.ellipse(cx, y + 320, w * 0.55, 24, 0, 0, 7);
    g.fill();

    // Tòa nhà chính
    rg(x, y + 120, w, 235, 6, "#b5503f");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 24; i++) {
        g.fillRect(x, y + 126 + i * 10, w, 2);
    }

    // Viền mái
    rr(x - 10, y + 110, w + 20, 16, 4, "#f1e7d3");
    rr(x - 10, y + 232, w + 20, 10, 3, "#f1e7d3");

    // Cửa sổ các phòng (2 cánh, mỗi cánh 5 cửa)
    for (let s = 0; s < 2; s++) {
        for (let r = 0; r < 2; r++) {
            for (let i = 0; i < 5; i++) {
                const wx = s ? x + w - 356 + i * 64 : x + 36 + i * 64;
                const wy = y + 140 + r * 110;
                rr(wx - 3, wy - 3, 52, 66, 6, "#f1e7d3");

                const q = g.createLinearGradient(0, wy, 0, wy + 60);
                q.addColorStop(0, "#cfeeff");
                q.addColorStop(1, "#6fb0e6");
                rr(wx, wy, 46, 60, 4, q);

                g.fillStyle = "#f1e7d3";
                g.fillRect(wx + 21, wy, 4, 60);
                g.fillRect(wx, wy + 28, 46, 4);
            }
        }
    }

    // Tòa tháp giữa
    rg(cx - 100, y - 10, 200, 365, 8, "#c25b49");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 34; i++) {
        g.fillRect(cx - 100, y - 4 + i * 10, 200, 2);
    }

    // Mái tháp
    g.fillStyle = "#6b3a2a";
    g.beginPath();
    g.moveTo(cx - 116, y + 8);
    g.lineTo(cx, y - 72);
    g.lineTo(cx + 116, y + 8);
    g.fill();

    g.fillStyle = "rgba(255,255,255,.15)";
    g.beginPath();
    g.moveTo(cx - 116, y + 8);
    g.lineTo(cx, y - 72);
    g.lineTo(cx, y + 8);
    g.fill();

    // Đồng hồ
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(cx, y + 34, 24, 0, 7);
    g.fill();
    g.strokeStyle = "#6b3a2a";
    g.lineWidth = 4;
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(cx, y + 34);
    g.lineTo(cx, y + 20);
    g.moveTo(cx, y + 34);
    g.lineTo(cx + 10, y + 38);
    g.stroke();

    // Biển hiệu
    rr(cx - 80, y + 76, 160, 30, 8, "#2c3e66");
    tx("TRƯỜNG VUI VẺ", cx, y + 97, 16, "#ffd23f");

    // Cửa ra vào
    rr(cx - 55, y + 150, 110, 60, 6, "#f1e7d3");
    rr(cx - 49, y + 156, 98, 48, 4, "#9fd8ff");
    rr(cx - 62, y + 262, 124, 93, 8, "#f1e7d3");
    rr(cx - 52, y + 270, 48, 85, 4, "#7a4a2a");
    rr(cx + 4, y + 270, 48, 85, 4, "#7a4a2a");

    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(cx - 12, y + 318, 3, 0, 7);
    g.arc(cx + 12, y + 318, 3, 0, 7);
    g.fill();

    // Bậc thềm
    rr(cx - 70, y + 355, 140, 10, 3, "#cfcfd6");
    rr(cx - 80, y + 362, 160, 8, 3, "#bbb");

    // Cột cờ hai bên
    g.fillStyle = "#999";
    g.fillRect(x + 40, y + 20, 3, 100);
    rr(x + 43, y + 22, 34, 22, 3, "#e74c3c");
    g.fillRect(x + w - 43, y + 20, 3, 100);
    rr(x + w - 40, y + 22, 34, 22, 3, "#3b82c4");
}

// 3. HÀM VẼ CÁC CẢNH
function drawOut() {
    const w = MAPW, h = MAPH;

    // Nền cỏ tươi tắn với gradient cao cấp
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#9ee68a");
    bg.addColorStop(.55, "#7fd06a");
    bg.addColorStop(1, "#63b955");
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);

    // Cỏ và hoa dại
    tufts.forEach(([x, y, r]) => {
        g.fillStyle = r > 0.5 ? "#5fb44e" : "#a8efa0";
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x - 3, y - 8);
        g.lineTo(x + 1, y - 4);
        g.lineTo(x + 4, y - 9);
        g.lineTo(x + 5, y);
        g.fill();
    });
    
    flw.forEach(([x, y, c]) => {
        g.fillStyle = c;
        g.beginPath();
        g.arc(x, y, 3.5, 0, 7);
        g.fill();
    });

    // Đường đi rộng rãi kết nối các khu vực
    g.fillStyle = "#b0b6c2";
    g.fillRect(0, 934, w, 152);
    g.fillRect(1514, 0, 152, h);
    
    g.fillStyle = "#dce0e6";
    g.fillRect(0, 940, w, 140);
    g.fillRect(1520, 0, 140, h);
    
    // Vạch kẻ sang đường cho người đi bộ
    g.fillStyle = "rgba(255,255,255,.9)";
    for (let x = 0; x < w; x += 90) g.fillRect(x, 1000, 46, 10);
    
    g.fillStyle = "#f5f5f5";
    g.fillRect(0, 936, w, 6);
    g.fillRect(0, 1078, w, 6);

    // Sân gạch lớn trước cổng trường
    g.fillStyle = "#d9c9a8";
    g.fillRect(1400, 430, 400, 120);
    g.strokeStyle = "rgba(255,255,255,.35)";
    g.lineWidth = 2;
    for (let x = 1400; x <= 1800; x += 50) {
        g.beginPath(); g.moveTo(x, 430); g.lineTo(x, 550); g.stroke();
    }
    for (let y = 430; y <= 550; y += 40) {
        g.beginPath(); g.moveTo(1400, y); g.lineTo(1800, y); g.stroke();
    }

    // Hồ sen sinh thái lớn
    const pondX = 520, pondY = 560;
    const pg = g.createRadialGradient(pondX, pondY, 15, pondX, pondY, 210);
    pg.addColorStop(0, "#a5e7ff");
    pg.addColorStop(1, "#42a5f5");
    
    g.fillStyle = "#e0d6b5";
    g.beginPath();
    g.ellipse(pondX, pondY, 190, 110, 0, 0, 7);
    g.fill();
    
    g.fillStyle = pg;
    g.beginPath();
    g.ellipse(pondX, pondY, 172, 95, 0, 0, 7);
    g.fill();
    
    g.strokeStyle = "rgba(255,255,255,.7)";
    g.lineWidth = 2.5;
    const rp = (tt * 20) % 40;
    g.beginPath();
    g.ellipse(pondX, pondY, 30 + rp, 15 + rp / 2, 0, 0, 7);
    g.stroke();
    
    g.font = "28px serif";
    g.fillText("🦆", pondX - 30 + Math.sin(tt) * 45, pondY + 5); // Vịt bơi
    g.fillText("🪷", pondX - 95, pondY - 25);
    g.fillText("🪷", pondX + 70, pondY + 20);
    g.fillText("🐸", pondX + 100, pondY - 40);

    // Cột cờ trung tâm sân trường cao lớn
    g.fillStyle = "#cfd8dc";
    g.beginPath();
    g.ellipse(1600, 800, 34, 13, 0, 0, 7);
    g.fill();
    g.fillStyle = "#90a4ae";
    g.fillRect(1598, 700, 4, 100);
    rr(1602, 704, 46, 28, 3, "#d32f2f");
    g.fillStyle = "#ffeb3b";
    g.font = "15px serif";
    g.fillText("⭐", 1618, 724);

    // Đài phun nước lớn góc phải sân trường
    {
        const fx = 2780, fy = 760;
        const fgrad = g.createRadialGradient(fx, fy, 10, fx, fy, 90);
        fgrad.addColorStop(0, "#81d4fa");
        fgrad.addColorStop(1, "#0288d1");
        
        g.fillStyle = "#cfd8dc";
        g.beginPath();
        g.ellipse(fx, fy, 94, 52, 0, 0, 7);
        g.fill();
        
        g.fillStyle = fgrad;
        g.beginPath();
        g.ellipse(fx, fy, 80, 42, 0, 0, 7);
        g.fill();
        
        g.fillStyle = "#fff";
        g.beginPath();
        g.ellipse(fx, fy, 18, 9, 0, 0, 7);
        g.fill();
        
        g.font = "28px serif";
        g.fillText("⛲", fx - 14, fy + 9);
    }

    // Ghế đá sân trường dưới bóng râm
    [[900, 900], [2200, 900], [1100, 1180], [2400, 1180], [320, 1160]].forEach(([bx, by]) => {
        rr(bx - 30, by, 60, 16, 5, "#b0bec5");
        rr(bx - 26, by + 14, 9, 7, 2, "#78909c");
        rr(bx + 17, by + 14, 9, 7, 2, "#78909c");
    });

    // Đèn sân trường
    [[1480, 700], [1720, 700], [1380, 1180], [1820, 1180]].forEach(([lx, ly]) => {
        g.fillStyle = "#78909c";
        g.fillRect(lx - 2, ly - 46, 4, 46);
        g.fillStyle = "rgba(255,241,118,.9)";
        g.beginPath();
        g.arc(lx, ly - 50, 7, 0, 7);
        g.fill();
    });

    // Vẽ trường học
    school();

    // Vẽ các địa điểm (nhà, vườn, sân thể thao...)
    P.forEach(p => {
        const lock = p.lv && S.lv < p.lv;
        if (p.b) {
            house(p);
            g.font = "34px serif";
            if (p.id == "can") {
                g.fillText("🍔", p.x + p.w - 56, p.y + 84);
                g.fillText("🥤", p.x + p.w - 102, p.y + 124);
            } else if (p.id == "shop") {
                g.fillText("🛍️", p.x + p.w - 52, p.y + 86);
            }
        } else {
            rr(p.x, p.y, p.w, p.h, 22, lock ? "#8fa0a0" : p.c);
            rr(p.x + 6, p.y + 6, p.w - 12, p.h - 12, 18, lock ? "#9fb0b0" : "rgba(255,255,255,.18)");
            g.strokeStyle = "rgba(255,255,255,.7)";
            g.lineWidth = 4;
            g.setLineDash([14, 10]);
            g.strokeRect(p.x + 10, p.y + 10, p.w - 20, p.h - 20);
            g.setLineDash([]);
            
            g.font = "28px serif";
            // Trang trí vườn hoa
            if (p.id == "garden" && !lock) {
                for (let i = 0; i < 18; i++) {
                    g.fillText(["🌷", "🌼", "🌻", "🌱"][i % 4], p.x + 40 + (i * 61) % (p.w - 70), p.y + 70 + Math.floor(i / 5) * 82 + (i % 2) * 14);
                }
            }
            // Trang trí Vườn thú cưng — hiện đúng thú cưng bé đang nuôi
            if (p.id == "pet" && !lock) {
                const pet = S.pet || defaultPetState();
                const sp = PET_SPECIES[pet.species] || PET_SPECIES.dog;
                g.font = "58px serif";
                g.fillText(sp.icon, p.x + p.w / 2 - 28, p.y + 180);
                g.font = "34px serif";
                g.fillText("🦴", p.x + 70, p.y + 250);
                g.fillText("🎾", p.x + p.w - 90, p.y + 230);
                g.fillText("🐾", p.x + 110, p.y + 120);
                g.font = "bold 15px system-ui";
                g.fillStyle = "#7a4a00";
                g.textAlign = "center";
                g.fillText(`${pet.name} · Lv ${pet.level}`, p.x + p.w / 2, p.y + 285);
            }
            // Trang trí sân thể thao
            if (p.id == "gym" && !lock) {
                g.font = "42px serif";
                g.fillText("⚽", p.x + 80, p.y + 150);
                g.fillText("🏀", p.x + 260, p.y + 120);
                g.fillText("🏃", p.x + 330, p.y + 250);
                g.fillText("🥇", p.x + 120, p.y + 280);
            }
        }

        // Bảng tên
        const lab = lock ? `🔒 Mở ở cấp ${p.lv}` : p.n;
        g.font = "bold 16px system-ui";
        g.textAlign = "center";
        const lw = g.measureText(lab).width + 22;
        rr(p.x + p.w / 2 - lw / 2, p.y - 34, lw, 28, 14, "rgba(255,255,255,.92)");
        tx(lab, p.x + p.w / 2, p.y - 14, 16, "#223");
    });

    // Vẽ cây cối
    trees.forEach(([x, y, s]) => tree(x, y, s));

    // Biển "VUI VẺ" ven đường
    {
        const bx = 2400;
        const by = 600 + Math.sin(tt) * 6;
        const q = g.createRadialGradient(bx - 15, by - 15, 5, bx, by, 60);
        q.addColorStop(0, "#ffe27a");
        q.addColorStop(1, "#f09a1d");
        
        g.fillStyle = q;
        g.beginPath();
        g.ellipse(bx, by + 330, 48, 58, 0, 0, 7);
        g.fill();
        
        g.fillStyle = "#3b82c4";
        g.fillRect(bx - 48, by + 316, 96, 18);
        tx("VUI VẺ", bx, by + 330, 11, "#fff");
        
        rr(bx - 14, by + 386, 28, 20, 4, "#8b5a2b");
        g.strokeStyle = "#8b5a2b";
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(bx - 30, by + 378);
        g.lineTo(bx - 14, by + 388);
        g.moveTo(bx + 30, by + 378);
        g.lineTo(bx + 14, by + 388);
        g.stroke();
    }

    // VẼ HOA HÁI ĐƯỢC (Minigame)
    flowers.forEach(f => {
        g.font = "28px serif";
        // Hiệu ứng hoa lơ lửng
        g.fillText("🌸", f.x, f.y + Math.sin(tt * 4 + f.x) * 3); 
    });

    // Mây trôi
    for (let i = 0; i < 6; i++) {
        g.fillStyle = "rgba(0,0,0,.06)";
        g.beginPath();
        g.ellipse((tt * 14 + i * 560) % (w + 500) - 250, 180 + i * 290, 150, 60, 0, 0, 7);
        g.fill();
    }
}

function drawHall(f = 1) {
    const w = 1700;

    // Sàn nhà
    const fl = g.createLinearGradient(0, 170, 0, 420);
    fl.addColorStop(0, "#ecdfc6");
    fl.addColorStop(1, "#d9c7a4");
    g.fillStyle = fl;
    g.fillRect(0, 170, w, 250);

    g.fillStyle = "rgba(0,0,0,.05)";
    for (let i = 0; i < 29; i++) {
        for (let j = 0; j < 5; j++) {
            if ((i + j) % 2) g.fillRect(i * 60, 170 + j * 60, 60, 60);
        }
    }

    // Trần nhà
    const wl = g.createLinearGradient(0, 0, 0, 170);
    wl.addColorStop(0, "#fff6e0");
    wl.addColorStop(1, "#f0e2c2");
    g.fillStyle = wl;
    g.fillRect(0, 0, w, 170);

    rr(0, 112, w, 58, 0, "#7fb2e5");
    g.fillStyle = "rgba(255,255,255,.3)";
    g.fillRect(0, 112, w, 5);
    g.fillStyle = "#8b6b4a";
    g.fillRect(0, 166, w, 8);

    // Tầng 2: cửa sổ lớn nhìn ra sân trường
    if (f == 2) {
        [140, 340, 1290, 1490].forEach(wx => {
            rr(wx, 36, 130, 72, 8, "#fff");
            rr(wx + 8, 44, 114, 56, 5, "#9fd8ff");
            g.fillStyle = "#fff";
            g.fillRect(wx + 61, 44, 4, 56);
            g.fillRect(wx + 8, 69, 114, 4);
            g.font = "18px serif";
            g.fillText("☁️", wx + 28 + ((wx / 100 | 0) % 2) * 46, 66);
        });
    }

    // Các cửa lớp học
    (f == 1 ? KS : KS2).forEach((k, i) => {
        const dx = DX[k], r = RM[k];

        // Cửa
        for (let j = 0; j < 3; j++) {
            rg(dx + 110 + j * 30, 80, 26, 88, 4, ["#e17055", "#fdcb6e", "#74b9ff"][(i + j) % 3]);
        }

        // Bảng hiệu lớp
        rr(dx - 56, 34, 112, 136, 8, "#fff");
        rg(dx - 46, 44, 92, 126, 5, "#9a6236");
        rr(dx - 24, 58, 48, 40, 5, "#bfe6ff");

        g.fillStyle = "#ffd23f";
        g.beginPath();
        g.arc(dx + 32, 118, 4, 0, 7);
        g.fill();

        rr(dx - 66, 4, 132, 26, 8, "#2c3e66");
        tx(r.e + " " + r.n, dx, 23, 14, "#fff");
    });

    tx(f == 1 ? "Chào mừng đến Trường Vui Vẻ 🎒" : "Góc Thư Viện — Tầng 2 📚", 850, 62, 22, f == 1 ? "#c0504d" : "#8e5a1e");

    // Chậu cây cảnh
    g.font = "40px serif";
    [170, 500, 820, 1180, 1500].forEach(x => g.fillText("🪴", x, 170));

    // Cầu thang ở cuối hành lang
    g.fillStyle = "rgba(0,0,0,.1)";
    g.fillRect(1560, 170, 140, 250);
    for (let i = 0; i < 6; i++) {
        rg(1566 + i * 9, 176 + i * 26, 128 - i * 18, 24, 4, i % 2 ? "#b98a55" : "#a5763f");
    }
    tx(f == 1 ? "▲ Lên Tầng 2" : "▼ Xuống Tầng 1", 1630, 152, 12, "#fff");

    // Cửa ra sân (chỉ tầng 1)
    if (f == 1) {
        rr(0, 200, 22, 190, 4, "#9fd8ff");
        g.fillStyle = "#fff8";
        g.fillRect(4, 200, 5, 190);
        tx("Ra sân", 50, 180, 12, "#223");
    }

    // Ánh sáng chiếu vào
    for (let i = 0; i < 7; i++) {
        g.fillStyle = "rgba(255,240,170,.35)";
        g.beginPath();
        g.ellipse(100 + i * 250, 300, 90, 30, 0, 0, 7);
        g.fill();
    }
}

function drawRoom() {
    const r = RM[rk];
    g.fillStyle = r.f;
    g.fillRect(0, 0, 1000, 600);
    
    // Sàn nhà
    g.fillStyle = "rgba(0,0,0,.06)";
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 12; j++) {
            if ((i + j) % 2) g.fillRect(i * 50, j * 50, 50, 50);
        }
    }

    // Tường
    const q = g.createLinearGradient(0, 0, 0, 140);
    q.addColorStop(0, "#fbf5e6");
    q.addColorStop(1, "#e4d8bf");
    g.fillStyle = q;
    g.fillRect(0, 0, 1000, 140);
    rr(0, 128, 1000, 14, 0, "#8b6b4a");

    // Bảng đen
    rr(236, 14, 528, 108, 10, "#7a5230");
    rr(248, 26, 504, 82, 6, "#2f5d4a");
    tx(r.b, 500, 78, 26, "#fff");
    rr(300, 112, 400, 8, 3, "#a97c50");

    // Đồng hồ treo tường
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(110, 64, 30, 0, 7);
    g.fill();
    g.strokeStyle = "#333";
    g.lineWidth = 4;
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(110, 64);
    g.lineTo(110, 46);
    g.moveTo(110, 64);
    g.lineTo(124, 70);
    g.stroke();

    // Cửa sổ
    rr(826, 20, 118, 92, 8, "#fff");
    rr(834, 28, 102, 76, 5, "#9fd8ff");
    g.fillStyle = "#fff";
    g.fillRect(883, 28, 4, 76);
    g.fillRect(834, 64, 102, 4);

    // Trang trí
    g.font = "46px serif";
    g.fillText(r.e, 50, 122);
    g.fillText(r.e, 950, 170);

    // Thảm
    const rug = g.createRadialGradient(500, 450, 20, 500, 450, 260);
    rug.addColorStop(0, "rgba(255,255,255,.35)");
    rug.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rug;
    g.fillRect(200, 300, 600, 300);

    // Bục giảng
    rr(420, 555, 160, 45, 8, "#7a4a2a");
    rr(432, 562, 60, 38, 4, "#9a6236");
    rr(508, 562, 60, 38, 4, "#9a6236");

    // Học sinh
    studs.forEach(s => {
        if (s.on) chr(s.x, s.y, s.c, "", s.n, tt * 2 + s.x, null, 0);
    });

    // Bàn ghế học sinh
    desks.forEach(d => {
        g.fillStyle = "rgba(0,0,0,.18)";
        g.beginPath();
        g.ellipse(d[0] + 48, d[1] + 54, 52, 8, 0, 0, 7);
        g.fill();
        
        rg(d[0], d[1] + 10, 90, 36, 6, "#c68b4e");
        rr(d[0] + 8, d[1] + 46, 6, 10, 2, "#7a5230");
        rr(d[0] + 76, d[1] + 46, 6, 10, 2, "#7a5230");
        rr(d[0] + 30, d[1] + 16, 28, 16, 3, "#fff");
    });

    // Kệ sách (trang trí Thư viện tầng 2)
    if (rk == "lib") {
        [70, 810].forEach(bx => {
            rr(bx, 150, 120, 140, 6, "#8b5a2b");
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 6; j++) {
                    rr(bx + 10 + j * 17, 160 + i * 62, 13, 44, 2,
                        ["#e17055", "#fdcb6e", "#74b9ff", "#55b36a", "#e07aa8", "#8f7ae0"][(i + j) % 6]);
                }
                rr(bx + 6, 212 + i * 62, 108, 8, 2, "#6d4520");
            }
        });
    }

    // Táo để bàn
    rg(430, 236, 140, 32, 6, "#9c6b3f");
    g.font = "22px serif";
    g.fillText("🍎", 450, 262);

    // Giáo viên
    const near_ = Math.hypot(me.x - 500, me.y - 225) < 150;
    chr(500, 226, r.c, "🎓", r.t, tt * 2, near_ ? "Chào em!" : null, 0);
}

/* ══════ NHÀ ĂN (nội thất) ══════ */
function drawCanteen() {
    const w = 1400, h = 800;

    // Sàn gạch ấm áp
    const fl = g.createLinearGradient(0, 0, 0, h);
    fl.addColorStop(0, "#fdf3dc");
    fl.addColorStop(1, "#efd9b4");
    g.fillStyle = fl;
    g.fillRect(0, 0, w, h);

    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 14; j++) {
            if ((i + j) % 2) {
                g.fillStyle = "rgba(214,170,110,.16)";
                g.fillRect(i * 60, 190 + j * 45, 60, 45);
            }
        }
    }

    // Tường phía bắc
    const wl = g.createLinearGradient(0, 0, 0, 195);
    wl.addColorStop(0, "#fff6e0");
    wl.addColorStop(1, "#f2ddb8");
    g.fillStyle = wl;
    g.fillRect(0, 0, w, 195);
    g.fillStyle = "#8b6b4a";
    g.fillRect(0, 190, w, 8);

    // Cửa sổ lớn
    [80, 1160].forEach(wx => {
        rr(wx, 28, 160, 96, 10, "#fff");
        rr(wx + 8, 36, 144, 80, 6, "#9fd8ff");
        g.fillStyle = "#fff";
        g.fillRect(wx + 78, 36, 4, 80);
        g.fillRect(wx + 8, 74, 144, 4);
        g.font = "20px serif";
        g.fillText("☁️", wx + 34, 66);
    });

    // Biển hiệu
    rr(500, 16, 400, 58, 16, "#2c3e66");
    tx("🍔 NHÀ ĂN VUI VẺ 🍜", 700, 54, 25, "#ffd23f");

    // Quầy thức ăn
    rg(320, 210, 760, 92, 14, "#d98b4a");
    rr(330, 198, 740, 22, 10, "#fff4d6");
    g.fillStyle = "rgba(255,255,255,.35)";
    g.fillRect(340, 210, 720, 8);
    g.font = "36px serif";
    g.textAlign = "center";
    ["🍱", "🍜", "🥪", "🍎", "🥛", "🍰"].forEach((e, i) => g.fillText(e, 400 + i * 120, 256));

    // Tủ kính + bảng menu
    rr(60, 220, 190, 150, 12, "#e3f2fd");
    g.fillStyle = "#90caf9";
    g.fillRect(70, 232, 170, 126);
    g.font = "34px serif";
    g.fillText("🥤", 120, 300);
    g.fillText("🧃", 190, 300);
    rr(1140, 214, 200, 160, 12, "#fffdf5");
    g.fillStyle = "#e65100";
    g.font = "bold 16px system-ui";
    g.fillText("THỰC ĐƠN", 1240, 242);
    g.fillStyle = "#5d4037";
    g.font = "bold 13px system-ui";
    ["🍜 Mì nóng", "🍱 Cơm hộp", "🥪 Bánh mì", "🥛 Sữa tươi"].forEach((t, i) => g.fillText(t, 1240, 270 + i * 24));

    // Đầu bếp
    g.font = "64px serif";
    g.fillText("👩‍🍳", 700, 178);
    const bubble = Math.sin(tt * 2) > .6;
    if (bubble) {
        rr(760, 108, 190, 46, 14, "#fff");
        tx("Mời bé dùng bữa! 😋", 855, 136, 13, "#c4502f");
    }

    // Bàn ăn + ghế
    const tables = [[360, 430], [760, 430], [1060, 430], [360, 620], [760, 620], [1060, 620]];
    tables.forEach(([tx0, ty0], i) => {
        g.fillStyle = "rgba(0,0,0,.14)";
        g.beginPath();
        g.ellipse(tx0 + 10, ty0 + 62, 86, 14, 0, 0, 7);
        g.fill();
        rr(tx0 - 64, ty0, 148, 22, 10, "#c98a4b");
        rr(tx0 - 60, ty0 + 4, 140, 8, 6, "#e3b07a");
        rr(tx0 - 52, ty0 + 22, 12, 40, 4, "#8b5a2b");
        rr(tx0 + 88, ty0 + 22, 12, 40, 4, "#8b5a2b");
        rr(tx0 - 96, ty0 - 6, 26, 12, 5, "#90a4ae");
        rr(tx0 + 118, ty0 - 6, 26, 12, 5, "#90a4ae");
        g.font = "26px serif";
        g.fillText(i % 2 ? "🍱" : "🍜", tx0 + 10, ty0 + 18);
    });

    // Cây cảnh
    g.font = "42px serif";
    [[120, 520], [1290, 520], [120, 700], [1290, 700]].forEach(([px, py]) => g.fillText("🪴", px, py));

    // Cửa ra sân
    rr(590, 700, 220, 100, 12, "#f1e7d3");
    rr(600, 708, 200, 92, 8, "#9fd8ff");
    g.fillStyle = "rgba(255,255,255,.6)";
    g.fillRect(690, 708, 6, 92);
    tx("🚪 Ra sân trường", 700, 682, 14, "#223");

    // Ánh sáng ấm
    for (let i = 0; i < 5; i++) {
        g.fillStyle = "rgba(255,235,150,.22)";
        g.beginPath();
        g.ellipse(160 + i * 280, 360, 100, 36, 0, 0, 7);
        g.fill();
    }
}