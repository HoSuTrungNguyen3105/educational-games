// ===== SCENES: vẽ sân trường, tòa nhà, hành lang, lớp học =====

// 1. KHỞI TẠO CÁC MẢNG TRANG TRÍ (Cỏ, hoa dại, cây cối cho sân trường rộng 2400x1400)
const tufts = [], flw = [], trees = [];

// Tạo 450 bụi cỏ ngẫu nhiên
for (let i = 0; i < 450; i++) {
    tufts.push([Math.random() * 2400, Math.random() * 1400, Math.random()]);
}

// Tạo 200 bông hoa dại ngẫu nhiên
for (let i = 0; i < 200; i++) {
    flw.push([
        Math.random() * 2400, 
        Math.random() * 1400, 
        ["#fff", "#ffd23f", "#ff8fb1", "#b28dff", "#74b9ff"][i % 5]
    ]);
}

// Tạo 75 cây xanh bóng mát
for (let i = 0; i < 75; i++) {
    const x = Math.random() * 2400, y = 60 + Math.random() * 1340;
    if (
        !P.some(p => x > p.x - 70 && x < p.x + p.w + 70 && y > p.y - 70 && y < p.y + p.h + 90) &&
        !(y > 600 && y < 820) && 
        !(x > 1050 && x < 1350) && 
        !(x > 750 && x < 1650 && y < 450) && 
        !(x > 200 && x < 500 && y > 220 && y < 450)
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
    const x = 820, y = 90;
    
    g.fillStyle = "rgba(0,0,0,.22)";
    g.beginPath();
    g.ellipse(1200, 358, 420, 20, 0, 0, 7);
    g.fill();

    // Tòa nhà chính
    rg(x, y + 120, 760, 235, 6, "#b5503f");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 24; i++) {
        g.fillRect(x, y + 126 + i * 10, 760, 2);
    }
    
    // Viền mái
    rr(x - 10, y + 110, 780, 16, 4, "#f1e7d3");
    rr(x - 10, y + 232, 780, 10, 3, "#f1e7d3");

    // Cửa sổ các phòng
    for (let s = 0; s < 2; s++) {
        for (let r = 0; r < 2; r++) {
            for (let i = 0; i < 4; i++) {
                const wx = s ? 1300 + i * 62 : x + 40 + i * 62, wy = y + 140 + r * 110;
                rr(wx - 3, wy - 3, 50, 66, 6, "#f1e7d3");
                
                const q = g.createLinearGradient(0, wy, 0, wy + 60);
                q.addColorStop(0, "#cfeeff");
                q.addColorStop(1, "#6fb0e6");
                rr(wx, wy, 44, 60, 4, q);
                
                g.fillStyle = "#f1e7d3";
                g.fillRect(wx + 20, wy, 4, 60);
                g.fillRect(wx, wy + 28, 44, 4);
            }
        }
    }

    // Tòa tháp giữa
    rg(1110, y - 10, 180, 365, 8, "#c25b49");
    g.fillStyle = "rgba(0,0,0,.09)";
    for (let i = 0; i < 34; i++) {
        g.fillRect(1110, y - 4 + i * 10, 180, 2);
    }

    // Mái tháp
    g.fillStyle = "#6b3a2a";
    g.beginPath();
    g.moveTo(1096, y + 8);
    g.lineTo(1200, y - 62);
    g.lineTo(1304, y + 8);
    g.fill();
    
    g.fillStyle = "rgba(255,255,255,.15)";
    g.beginPath();
    g.moveTo(1096, y + 8);
    g.lineTo(1200, y - 62);
    g.lineTo(1200, y + 8);
    g.fill();

    // Đồng hồ
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(1200, y + 34, 24, 0, 7);
    g.fill();
    g.strokeStyle = "#6b3a2a";
    g.lineWidth = 4;
    g.stroke();
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(1200, y + 34);
    g.lineTo(1200, y + 20);
    g.moveTo(1200, y + 34);
    g.lineTo(1210, y + 38);
    g.stroke();

    // Biển hiệu
    rr(1126, y + 76, 148, 30, 8, "#2c3e66");
    tx("TRƯỜNG VUI VẺ", 1200, y + 97, 16, "#ffd23f");
    
    // Cửa ra vào
    rr(1150, y + 150, 100, 60, 6, "#f1e7d3");
    rr(1156, y + 156, 88, 48, 4, "#9fd8ff");
    rr(1142, y + 262, 116, 93, 8, "#f1e7d3");
    rr(1152, y + 270, 45, 85, 4, "#7a4a2a");
    rr(1203, y + 270, 45, 85, 4, "#7a4a2a");
    
    g.fillStyle = "#ffd23f";
    g.beginPath();
    g.arc(1190, y + 318, 3, 0, 7);
    g.arc(1210, y + 318, 3, 0, 7);
    g.fill();

    // Bậc thềm
    rr(1130, y + 355, 140, 10, 3, "#cfcfd6");
    rr(1120, y + 362, 160, 8, 3, "#bbb");

    // Cột cờ
    g.fillStyle = "#999";
    g.fillRect(860, y + 20, 3, 100);
    rr(863, y + 22, 34, 22, 3, "#e74c3c");
    g.fillRect(1536, y + 20, 3, 100);
    rr(1539, y + 22, 34, 22, 3, "#3b82c4");
}

// 3. HÀM VẼ CÁC CẢNH
function drawOut() {
    const w = 2400, h = 1400;
    
    // Nền cỏ tươi tắn với gradient cao cấp
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#98e482");
    bg.addColorStop(1, "#66bf54");
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
    g.fillRect(0, 644, w, 142);
    g.fillRect(1124, 0, 152, h);
    
    g.fillStyle = "#dce0e6";
    g.fillRect(0, 650, w, 130);
    g.fillRect(1130, 0, 140, h);
    
    // Vạch kẻ sang đường cho người đi bộ
    g.fillStyle = "rgba(255,255,255,.9)";
    for (let x = 0; x < w; x += 90) g.fillRect(x, 710, 46, 10);
    
    g.fillStyle = "#f5f5f5";
    g.fillRect(0, 646, w, 6);
    g.fillRect(0, 774, w, 6);
    g.fillStyle = "#c9a77c";
    g.fillRect(800, 350, 800, 16);

    // Hồ sen sinh thái lớn
    const pg = g.createRadialGradient(360, 360, 15, 360, 360, 140);
    pg.addColorStop(0, "#a5e7ff");
    pg.addColorStop(1, "#42a5f5");
    
    g.fillStyle = "#e0d6b5";
    g.beginPath();
    g.ellipse(360, 360, 148, 86, 0, 0, 7);
    g.fill();
    
    g.fillStyle = pg;
    g.beginPath();
    g.ellipse(360, 360, 132, 72, 0, 0, 7);
    g.fill();
    
    g.strokeStyle = "rgba(255,255,255,.7)";
    g.lineWidth = 2.5;
    const rp = (tt * 20) % 40;
    g.beginPath();
    g.ellipse(360, 360, 24 + rp, 12 + rp / 2, 0, 0, 7);
    g.stroke();
    
    g.font = "26px serif";
    g.fillText("🦆", 330 + Math.sin(tt) * 35, 365); // Vịt bơi
    g.fillText("🪷", 280, 345);
    g.fillText("🪷", 420, 375);

    // Cột cờ trung tâm sân trường cao lớn
    g.fillStyle = "#cfd8dc";
    g.beginPath();
    g.ellipse(1200, 570, 32, 12, 0, 0, 7);
    g.fill();
    g.fillStyle = "#90a4ae";
    g.fillRect(1198, 480, 4, 90);
    rr(1202, 484, 42, 26, 3, "#d32f2f");
    g.fillStyle = "#ffeb3b";
    g.font = "14px serif";
    g.fillText("⭐", 1216, 502);

    // Đài phun nước lớn góc phải sân trường
    {
        const fx = 2120, fy = 650;
        const fgrad = g.createRadialGradient(fx, fy, 10, fx, fy, 80);
        fgrad.addColorStop(0, "#81d4fa");
        fgrad.addColorStop(1, "#0288d1");
        
        g.fillStyle = "#cfd8dc";
        g.beginPath();
        g.ellipse(fx, fy, 84, 46, 0, 0, 7);
        g.fill();
        
        g.fillStyle = fgrad;
        g.beginPath();
        g.ellipse(fx, fy, 72, 38, 0, 0, 7);
        g.fill();
        
        g.fillStyle = "#fff";
        g.beginPath();
        g.ellipse(fx, fy, 16, 8, 0, 0, 7);
        g.fill();
        
        g.font = "26px serif";
        g.fillText("⛲", fx - 13, fy + 8);
    }

    // Ghế đá sân trường dưới bóng râm
    [[750, 610], [1500, 610], [920, 830], [1280, 830]].forEach(([bx, by]) => {
        rr(bx - 26, by, 52, 14, 4, "#b0bec5");
        rr(bx - 22, by + 12, 8, 6, 2, "#78909c");
        rr(bx + 14, by + 12, 8, 6, 2, "#78909c");
    });

    // Vẽ trường học
    school();

    // Vẽ các địa điểm (nhà, sân bóng, vườn...)
    P.forEach(p => {
        const lock = p.lv && S.lv < p.lv;
        if (p.b) {
            house(p);
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
                for (let i = 0; i < 16; i++) {
                    g.fillText(["🌷", "🌼", "🌻", "🌱"][i % 4], p.x + 40 + (i * 57) % (p.w - 70), p.y + 70 + Math.floor(i / 5) * 80 + (i % 2) * 14);
                }
            }
            // Trang trí Vườn thú cưng
            if ((p.id == "gym" || p.id == "pet") && !lock) {
                g.font = "40px serif";
                g.fillText("🐶", p.x + 80, p.y + 170);
                g.fillText("🐱", p.x + 290, p.y + 130);
                g.fillText("🐾", p.x + 190, p.y + 240);
                g.fillText("🦴", p.x + 200, p.y + 100);
            }
        }

        // Bảng tên
        const lab = lock ? `🔒 Mở ở cấp ${p.lv}` : p.n;
        g.font = "bold 16px system-ui";
        const lw = g.measureText(lab).width + 22;
        rr(p.x + p.w / 2 - lw / 2, p.y - 34, lw, 28, 14, "rgba(255,255,255,.92)");
        tx(lab, p.x + p.w / 2, p.y - 14, 16, "#223");
    });

    // Vẽ cây cối
    trees.forEach(([x, y, s]) => tree(x, y, s));

    // Vẽ Đài phun nước
    g.fillStyle = "#f5c542";
    const by = 480 + Math.sin(tt) * 6;
    rr(1600 + 0, by + 60, 0, 0, 0, "#000"); // (Dòng này dư thừa nhưng giữ nguyên theo code gốc)
    {
        const bx = 1620;
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
    for (let i = 0; i < 4; i++) {
        g.fillStyle = "rgba(0,0,0,.06)";
        g.beginPath();
        g.ellipse((tt * 14 + i * 520) % (w + 500) - 250, 200 + i * 260, 150, 60, 0, 0, 7);
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