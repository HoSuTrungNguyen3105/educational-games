// ===== RENDER: camera, sắp xếp lớp vẽ, hiệu ứng viền tối, chuyển cảnh =====
function draw() {
    // 1. Cài đặt tỷ lệ và kích thước màn hình
    const z = Math.max(0.8, Math.min(1.4, H / 560));
    const [WW, WH] = D[sc]; // Lấy kích thước thế giới hiện tại (World Width, World Height)
    
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#1d2540"; // Màu nền tối
    g.fillRect(0, 0, W, H);

    // 2. Tính toán Camera (Giới hạn camera không vượt quá bản đồ)
    const vw = W / z, vh = H / z;
    const cl = (v, a, b) => Math.max(a, Math.min(b, v)); // Hàm kẹp giá trị
    
    const cx = vw >= WW ? -(vw - WW) / 2 : cl(me.x - vw / 2, 0, WW - vw);
    const cy = vh >= WH ? -(vh - WH) / 2 : cl(me.y - vh / 2, 0, WH - vh);

    // 3. Bắt đầu vẽ thế giới (Áp dụng Camera)
    g.save();
    g.scale(z, z);
    g.translate(-cx, -cy);

    // Vẽ cảnh nền (Ngoài trời, Hành lang, hoặc Trong phòng)
    if (sc == "out") drawOut();
    else if (sc == "hall") drawHall();
    else drawRoom();

    // --- BẮT ĐẦU VẼ HOA (Tính năng hái hoa) ---
    if (typeof flowers !== 'undefined' && flowers.length > 0) {
        g.font = "24px Arial";
        g.textAlign = "center";
        g.textBaseline = "middle";
        flowers.forEach(f => {
            g.fillText("🌸", f.x, f.y);
        });
    }
    // --- KẾT THÚC VẼ HOA ---

    // 4. Vẽ NPC và Nhân vật (Sắp xếp theo trục Y để tạo chiều sâu)
    const L = npcs.filter(n => n.sc == sc).map(n => ({
        y: n.y,
        f: () => chr(
            n.x, n.y, n.c, n.h, n.n, tt * 8 + n.x,
            n.say > 0 ? ["Chào!", "Rất vui được gặp bạn!", "Học thôi nào!"][Math.floor(n.x) % 3] : null,
            n.mv
        )
    }));
    
    // Thêm nhân vật chính (Bạn) vào danh sách vẽ
    L.push({
        y: me.y,
        f: () => drawPlayer()
    });
    
    // Sắp xếp từ trên xuống dưới và vẽ
    L.sort((a, b) => a.y - b.y).forEach(o => o.f());

    // 5. Vẽ hiệu ứng chữ bay (Text Effects)
    ft.forEach(f => {
        g.globalAlpha = Math.min(1, f.t);
        tx(f.s, f.x, f.y - (1.4 - f.t) * 40, 18, "#ffd23f", "rgba(0,0,0,.7)");
        g.globalAlpha = 1;
    });

    g.restore(); // Kết thúc vẽ thế giới

    // 6. Vẽ Giao diện (UI) đè lên trên thế giới
    // Đồng hồ đếm ngược tính năng hái hoa
    if (typeof ftime !== 'undefined' && ftime > 0) {
        const t = "⏱ " + Math.ceil(ftime) + "s  🌸 còn " + flowers.length;
        tx(t, W / 2, 90, 20, "#fff", "rgba(0,0,0,.6)");
    }

    // 7. Hiệu ứng viền tối (Vignette)
    const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.45, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,30,.32)");
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);

    // 8. Hiệu ứng chuyển cảnh (Fade)
    if (fade > 0) {
        g.fillStyle = `rgba(0,0,0,${fade})`;
        g.fillRect(0, 0, W, H);
    }
}