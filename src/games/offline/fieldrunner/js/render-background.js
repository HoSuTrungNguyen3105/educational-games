/* =====================================================
   render-background.js · nền cánh đồng, đường đi, cổng,
   ánh sáng môi trường (mây, phấn hoa, lá bay)
   ===================================================== */

/* ---------- Các hàm vẽ cơ bản dùng chung ---------- */

/** Hình chữ nhật bo góc */
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Gradient tuyến tính từ danh sách mốc màu */
function lg(x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(s => g.addColorStop(s[0], s[1]));
  return g;
}

/** Gradient tròn từ danh sách mốc màu */
function rg(x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  stops.forEach(s => g.addColorStop(s[0], s[1]));
  return g;
}

/** Đường zig-zag (dùng cho tia sét) */
function jag(x1, y1, x2, y2, amp) {
  const n = Math.max(3, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 14));

  ctx.beginPath();
  ctx.moveTo(x1, y1);

  for (let i = 1; i < n; i++) {
    const u = i / n;
    ctx.lineTo(
      x1 + (x2 - x1) * u + (Math.random() - 0.5) * amp,
      y1 + (y2 - y1) * u + (Math.random() - 0.5) * amp
    );
  }

  ctx.lineTo(x2, y2);
}

/* =====================================================
   NỀN TĨNH (vẽ một lần vào canvas phụ)
   ===================================================== */
let bg;          // nền cỏ
let lightLayer;  // lớp ánh sáng / bóng mờ phủ lên trên cùng

function makeBg() {
  bg = document.createElement('canvas');
  bg.width = CW;
  bg.height = CH;

  const g = bg.getContext('2d');
  const rand = seededRandom(12345);

  /** Ô địa hình (đá/nước/cây/nhà) — không rải cỏ dại, hoa, nấm lên trên */
  const onProp = (x, y) => {
    const c = (x / CS) | 0;
    const r = (y / CS) | 0;
    return !!(blocked && blocked[c] && blocked[c][r]);
  };

  /* ----- Ô cỏ caro nhẹ + đốm màu ----- */
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      g.fillStyle = (c + r) % 2 ? PAL.grass[0] : PAL.grass[1];
      g.fillRect(c * CS, r * CS, CS, CS);
    }
  }

  for (let i = 0; i < 90; i++) {
    const x = rand() * CW;
    const y = rand() * CH;
    const r = 18 + rand() * 40;

    g.fillStyle = rand() < 0.5 ? 'rgba(255,255,170,.07)' : 'rgba(30,90,30,.08)';
    g.beginPath();
    g.ellipse(x, y, r, r * 0.6, rand() * 3, 0, 7);
    g.fill();
  }

  /* ----- Cỏ dại ----- */
  for (let i = 0; i < 320; i++) {
    const x = rand() * CW;
    const y = rand() * CH;
    if (onProp(x, y)) continue;

    g.strokeStyle = rand() < 0.5 ? '#58a041' : '#8ed86c';
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x - 2, y - 5);
    g.moveTo(x, y);
    g.lineTo(x + 2, y - 6);
    g.moveTo(x, y);
    g.lineTo(x, y - 7);
    g.stroke();
  }

  /* ----- Hoa ----- */
  const colors = ['#ffffff', '#ffd93b', '#ff8fb3', '#b9a3ff'];

  for (let i = 0; i < 90; i++) {
    const x = rand() * CW;
    const y = rand() * CH;
    if (onProp(x, y)) continue;

    g.fillStyle = colors[(rand() * 4) | 0];
    for (let k = 0; k < 5; k++) {
      g.beginPath();
      g.arc(x + Math.cos(k * 1.256) * 2.4, y + Math.sin(k * 1.256) * 2.4, 1.7, 0, 7);
      g.fill();
    }

    g.fillStyle = '#ffb300';
    g.beginPath();
    g.arc(x, y, 1.3, 0, 7);
    g.fill();
  }

  /* ----- Đá nhỏ ----- */
  for (let i = 0; i < 34; i++) {
    const x = rand() * CW;
    const y = rand() * CH;
    if (onProp(x, y)) continue;

    g.fillStyle = 'rgba(0,0,0,.15)';
    g.beginPath();
    g.ellipse(x + 1, y + 2, 5, 2.5, 0, 0, 7);
    g.fill();

    g.fillStyle = lg2(g, x, y - 3, x, y + 3, '#c9cec6', '#9aa098');
    g.beginPath();
    g.ellipse(x, y, 4.5, 3, 0, 0, 7);
    g.fill();

    g.strokeStyle = 'rgba(0,0,0,.35)';
    g.lineWidth = 1;
    g.stroke();
  }

  /* ----- Bụi cây & nấm ----- */
  for (let i = 0; i < 26; i++) {
    const x = rand() * CW;
    const y = rand() * CH;
    if (!onProp(x, y)) drawBush(g, x, y, 7 + rand() * 6);
  }

  for (let i = 0; i < 16; i++) {
    const x = rand() * CW;
    const y = rand() * CH;
    if (!onProp(x, y)) drawMushroom(g, x, y);
  }

  /* ----- Địa hình của màn (cây, đá, ao, sông, rào, nhà kho) ----- */
  drawTerrain(g);

  /* ----- Hàng cây viền trên & dưới bản đồ ----- */
  for (let x = 14; x < CW; x += 38 + rand() * 26) {
    drawTree(g, x, 8 + rand() * 6, 0.9 + rand() * 0.4);
  }
  for (let x = 20; x < CW; x += 38 + rand() * 26) {
    drawTree(g, x, CH - 10 - rand() * 6, 0.9 + rand() * 0.4);
  }

  /* ----- Lớp ánh sáng phủ ----- */
  makeLightLayer();
}

/** Gradient tuyến tính trên ngữ cảnh g bất kỳ */
function lg2(g, x0, y0, x1, y1, a, b) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, a);
  gr.addColorStop(1, b);
  return gr;
}

function drawBush(g, x, y, r) {
  g.fillStyle = 'rgba(0,0,0,.16)';
  g.beginPath();
  g.ellipse(x + 2, y + r * 0.6, r * 1.3, r * 0.5, 0, 0, 7);
  g.fill();

  const cols = ['#3f9a3a', '#4fb046', '#5fc656'];
  for (let k = 0; k < 3; k++) {
    g.fillStyle = cols[k];
    g.beginPath();
    g.arc(x + (k - 1) * r * 0.7, y - k * 0.8, r * (0.85 - k * 0.1), 0, 7);
    g.fill();
  }

  g.strokeStyle = 'rgba(20,70,20,.55)';
  g.lineWidth = 1;
  g.beginPath();
  g.arc(x - r * 0.7, y, r * 0.85, 0.2, 5.8);
  g.stroke();
}

function drawMushroom(g, x, y) {
  g.fillStyle = '#f4ead2';
  g.fillRect(x - 1.2, y, 2.4, 4);

  g.fillStyle = '#e04a3a';
  g.beginPath();
  g.arc(x, y, 4, Math.PI, 0);
  g.closePath();
  g.fill();

  g.fillStyle = '#fff';
  g.beginPath();
  g.arc(x - 1.5, y - 1.6, 0.9, 0, 7);
  g.arc(x + 1.6, y - 2, 0.7, 0, 7);
  g.fill();
}

function drawTree(g, x, y, s) {
  g.fillStyle = 'rgba(0,0,0,.2)';
  g.beginPath();
  g.ellipse(x + 3, y + 12 * s, 17 * s, 6 * s, 0, 0, 7);
  g.fill();

  g.fillStyle = '#7a4f2a';
  g.fillRect(x - 3 * s, y, 6 * s, 14 * s);

  const tones = ['#2f8a3a', '#3fa047', '#58bf55'];
  const spots = [[-9, 0, 12], [9, 1, 12], [0, -9, 14]];

  spots.forEach((p, i) => {
    g.fillStyle = tones[i];
    g.beginPath();
    g.arc(x + p[0] * s, y + p[1] * s, p[2] * s, 0, 7);
    g.fill();
  });

  g.fillStyle = 'rgba(255,255,200,.22)';
  g.beginPath();
  g.arc(x - 3 * s, y - 13 * s, 6 * s, 0, 7);
  g.fill();
}

/** Lớp ánh sáng: nắng ấm từ trên-trái và tối dần ở rìa */
function makeLightLayer() {
  lightLayer = document.createElement('canvas');
  lightLayer.width = CW;
  lightLayer.height = CH;

  const g = lightLayer.getContext('2d');

  // Màu riêng của từng cánh đồng (hoàng hôn, mùa gặt…)
  if (PAL.wash) {
    g.fillStyle = PAL.wash;
    g.fillRect(0, 0, CW, CH);
  }

  const sun = g.createRadialGradient(CW * 0.2, -40, 20, CW * 0.2, -40, CW * 0.9);
  sun.addColorStop(0, 'rgba(255,240,170,.28)');
  sun.addColorStop(1, 'rgba(255,240,170,0)');
  g.fillStyle = sun;
  g.fillRect(0, 0, CW, CH);

  const vg = g.createRadialGradient(CW / 2, CH / 2, CH * 0.35, CW / 2, CH / 2, CH * 1.0);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(10,40,20,.34)');
  g.fillStyle = vg;
  g.fillRect(0, 0, CW, CH);
}

/* =====================================================
   ĐƯỜNG ĐI (vẽ mỗi khung vì người chơi xây mê cung)
   ===================================================== */
function strokePath() {
  ctx.beginPath();
  pathPts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
}

function drawPath() {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Bóng đổ
  strokePath();
  ctx.strokeStyle = 'rgba(40,25,5,.28)';
  ctx.lineWidth = 38;
  ctx.stroke();

  // Viền đất tối
  strokePath();
  ctx.strokeStyle = PAL.soil[0];
  ctx.lineWidth = 34;
  ctx.stroke();

  // Viền sáng
  strokePath();
  ctx.strokeStyle = PAL.soil[1];
  ctx.lineWidth = 30;
  ctx.stroke();

  // Mặt đường
  strokePath();
  ctx.strokeStyle = PAL.soil[2];
  ctx.lineWidth = 26;
  ctx.stroke();

  // Lòng đường sáng hơn
  strokePath();
  ctx.strokeStyle = PAL.soil[3];
  ctx.lineWidth = 16;
  ctx.stroke();

  // Sỏi nhỏ rải trên đường
  ctx.setLineDash([1, 11]);
  strokePath();
  ctx.strokeStyle = 'rgba(120,85,40,.55)';
  ctx.lineWidth = 9;
  ctx.stroke();

  ctx.lineDashOffset = -5;
  strokePath();
  ctx.strokeStyle = 'rgba(255,255,255,.4)';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.lineDashOffset = 0;
  ctx.setLineDash([]);

  // Mũi tên chỉ hướng chạy dọc đường
  ctx.fillStyle = 'rgba(255,255,255,.6)';

  const off = (gtime * 40) % 80;
  let acc = 0;

  for (let i = 1; i < pathPts.length; i++) {
    const a = pathPts[i - 1];
    const b = pathPts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);

    if (!l) continue;

    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);

    for (let s = (80 - ((acc + off) % 80)) % 80; s < l; s += 80) {
      const x = a[0] + Math.cos(ang) * s;
      const y = a[1] + Math.sin(ang) * s;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-3, -4);
      ctx.lineTo(-3, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    acc += l;
  }
}

/* =====================================================
   CỔNG VÀO / CỔNG RA
   ===================================================== */
function drawGates() {
  const pulse = 0.5 + 0.5 * Math.sin(gtime * 3);

  /* ----- Cổng vào (chuồng gỗ đỏ) ----- */
  ctx.save();
  ctx.translate(0, SR * CS);

  // Vầng sáng cảnh báo
  ctx.fillStyle = rg(CS / 2, CS / 2, 4, 44, [
    [0, 'rgba(255,90,70,' + (0.25 + pulse * 0.2) + ')'],
    [1, 'rgba(255,90,70,0)']
  ]);
  ctx.beginPath();
  ctx.arc(CS / 2, CS / 2, 44, 0, 7);
  ctx.fill();

  ctx.fillStyle = lg(0, 0, 0, CS, [[0, '#e8625a'], [1, '#a83a33']]);
  rr(-6, -4, CS - 2, CS + 8, 6);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Vạch gỗ
  ctx.strokeStyle = 'rgba(0,0,0,.25)';
  ctx.lineWidth = 1.5;
  for (let y = 6; y < CS + 4; y += 8) {
    ctx.beginPath();
    ctx.moveTo(-3, y - 4);
    ctx.lineTo(CS - 6, y - 4);
    ctx.stroke();
  }

  ctx.fillStyle = '#fff';
  ctx.font = '800 11px Baloo 2,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VÀO', CS / 2 - 6, CS / 2 + 4);
  ctx.restore();

  /* ----- Cổng ra (ruộng xanh) ----- */
  ctx.save();
  ctx.translate(GOALC * CS, GR * CS);

  ctx.fillStyle = rg(CS / 2, CS / 2, 4, 46, [
    [0, 'rgba(80,170,255,' + (0.25 + pulse * 0.2) + ')'],
    [1, 'rgba(80,170,255,0)']
  ]);
  ctx.beginPath();
  ctx.arc(CS / 2, CS / 2, 46, 0, 7);
  ctx.fill();

  ctx.fillStyle = lg(0, 0, 0, CS, [[0, '#5aaaff'], [1, '#2f6fd0']]);
  rr(4, -4, CS + 8, CS + 8, 6);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = '800 11px Baloo 2,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RA', CS / 2 + 4, CS / 2 + 4);
  ctx.restore();
}

/* =====================================================
   MÔI TRƯỜNG: bóng mây, phấn hoa, lá bay
   ===================================================== */
const ambient = [];

(function initAmbient() {
  const rand = seededRandom(777);

  for (let i = 0; i < 26; i++) {
    ambient.push({
      x: rand() * CW,
      y: rand() * CH,
      s: 1 + rand() * 2,
      sp: 8 + rand() * 14,
      ph: rand() * 6.28,
      leaf: rand() < 0.35
    });
  }
})();

const clouds = [
  { x: 120, y: 180, w: 190, h: 70, sp: 6 },
  { x: 560, y: 420, w: 240, h: 85, sp: 4 },
  { x: 820, y: 90,  w: 170, h: 60, sp: 8 }
];

/** Bóng mây trôi trên cánh đồng */
function drawClouds(dt) {
  ctx.fillStyle = 'rgba(20,50,30,.07)';

  for (const c of clouds) {
    c.x += c.sp * dt;
    if (c.x - c.w > CW) c.x = -c.w;

    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w, c.h, 0, 0, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.w * 0.5, c.y + c.h * 0.2, c.w * 0.6, c.h * 0.7, 0, 0, 7);
    ctx.fill();
  }
}

/** Phấn hoa / lá lơ lửng */
function drawAmbient(dt) {
  for (const a of ambient) {
    a.x += a.sp * dt;
    a.y += Math.sin(gtime * 1.4 + a.ph) * 6 * dt;

    if (a.x > CW + 10) a.x = -10;

    if (a.leaf) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(gtime * 1.5 + a.ph);
      ctx.fillStyle = 'rgba(120,200,70,.75)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.4, 1.6, 0, 0, 7);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(255,255,210,.7)';
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.s * 0.8, 0, 7);
      ctx.fill();
    }
  }
}
