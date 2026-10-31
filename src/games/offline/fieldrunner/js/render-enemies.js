/* =====================================================
   render-enemies.js · vẽ kẻ địch, hào quang tinh anh,
   thanh máu
   ===================================================== */

/* ---------- Bộ phận dùng lại cho nhiều kẻ địch ---------- */

/** Thân tròn có đổ bóng sáng */
function blob(r, col, hl = 0.4) {
  ctx.fillStyle = rg(-r * 0.3, -r * 0.35, r * 0.1, r * 1.1, [
    [0, lighten(col, hl)],
    [1, col]
  ]);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 7);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/** Cặp mắt */
function eyes(r, dx = 3, dy = -2, s = 3) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(dx, dy, s, 0, 7);
  ctx.arc(dx - s * 1.9, dy, s, 0, 7);
  ctx.fill();

  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(dx + 1, dy, s * 0.5, 0, 7);
  ctx.arc(dx - s * 1.9 + 1, dy, s * 0.5, 0, 7);
  ctx.fill();
}

/** Đôi chân bước */
function feet(r, bob, anim) {
  const s = Math.sin(anim * 10);

  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.ellipse(-r * 0.4 + s * 2, r * 0.85, r * 0.35, r * 0.2, 0, 0, 7);
  ctx.ellipse(r * 0.4 - s * 2, r * 0.85, r * 0.35, r * 0.2, 0, 0, 7);
  ctx.fill();
}

/* =====================================================
   HÌNH DÁNG TỪNG LOẠI KẺ ĐỊCH
   ===================================================== */
function drawEnemyBody(e, a, bob) {
  const d = e.def;
  const r = d.r;
  const t = e.type;

  switch (t) {

    case 'grunt':
      feet(r, bob, a);
      blob(r, d.col);

      ctx.fillStyle = '#4a7a2a';
      ctx.beginPath();
      ctx.arc(0, -r * 0.2, r, 3.4, 6.0);
      ctx.fill();

      eyes(r);
      break;

    case 'runner':
      // Vệt tốc độ
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-r - 4, i * 4);
        ctx.lineTo(-r - 14, i * 4);
        ctx.stroke();
      }

      ctx.strokeStyle = INK;
      feet(r, bob, a * 1.6);
      blob(r, d.col);

      // Băng đô
      ctx.fillStyle = '#e03a3a';
      ctx.fillRect(-r, -r * 0.5, r * 2, 3);
      ctx.fillRect(-r - 5, -r * 0.5 + 1, 6, 3);

      eyes(r, 3, 0, 2.6);
      break;

    case 'mini':
      feet(r, bob, a);
      blob(r, d.col);
      eyes(r, 2, -1, 2);
      break;

    case 'tank':
      // Xích
      ctx.fillStyle = '#2a2a30';
      rr(-r - 1, -r * 0.95, r * 2 + 2, r * 0.5, 3);
      ctx.fill();
      ctx.stroke();
      rr(-r - 1, r * 0.45, r * 2 + 2, r * 0.5, 3);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6a6a72';
      for (let i = -3; i <= 3; i++) {
        const o = (a * 6 + i * 5) % 5;
        ctx.fillRect(i * r * 0.28 - o * 0.3, -r * 0.8, 2, 3);
        ctx.fillRect(i * r * 0.28 - o * 0.3, r * 0.6, 2, 3);
      }

      // Thân xe
      ctx.fillStyle = lg(0, -r * 0.7, 0, r * 0.7, [[0, lighten(d.col, 0.35)], [1, d.col]]);
      rr(-r * 0.85, -r * 0.62, r * 1.7, r * 1.24, 5);
      ctx.fill();
      ctx.stroke();

      // Tháp pháo
      ctx.fillStyle = lg(0, -r * 0.4, 0, r * 0.4, [[0, '#a07a5a'], [1, '#6a4a30']]);
      ctx.beginPath();
      ctx.arc(-1, 0, r * 0.5, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#2a2a30';
      ctx.fillRect(0, -3, r + 4, 6);
      ctx.strokeRect(0, -3, r + 4, 6);
      break;

    case 'armored':
      feet(r, bob, a);
      blob(r, d.col);

      ctx.fillStyle = lg(0, -r, 0, 0, [[0, '#d5dde6'], [1, '#8c99a6']]);
      ctx.beginPath();
      ctx.arc(0, -r * 0.1, r * 1.02, 3.3, 6.12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-r * 0.5, -r * 0.55, 1.4, 0, 7);
      ctx.arc(r * 0.5, -r * 0.55, 1.4, 0, 7);
      ctx.fill();

      eyes(r, 3, 2, 2.6);
      break;

    case 'shielded':
      feet(r, bob, a);
      blob(r, d.col);
      eyes(r);

      ctx.fillStyle = '#e8f6ff';
      ctx.fillRect(-r * 0.9, -1, r * 0.3, r * 0.8);
      break;

    case 'healer':
      feet(r, bob, a);
      blob(r, d.col);

      // Chữ thập y tế
      ctx.fillStyle = '#fff';
      ctx.fillRect(-2, -1, 4, 10);
      ctx.fillRect(-5, 2, 10, 4);

      // Vầng sáng trên đầu
      ctx.strokeStyle = '#ffe27a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, -r - 3, r * 0.6, 3, 0, 0, 7);
      ctx.stroke();

      eyes(r, 3, -4, 2.4);
      break;

    case 'splitter':
      feet(r, bob, a);
      blob(r, d.col);

      ctx.fillStyle = lighten(d.col, 0.3);
      ctx.beginPath();
      ctx.arc(-r * 0.7, -r * 0.7, r * 0.35, 0, 7);
      ctx.arc(r * 0.7, -r * 0.7, r * 0.35, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#5a3010';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, r * 0.1);
      ctx.lineTo(0, r * 0.5);
      ctx.lineTo(r * 0.6, r * 0.1);
      ctx.moveTo(0, r * 0.5);
      ctx.lineTo(0, r * 0.95);
      ctx.stroke();

      eyes(r, 3, -3, 2.6);
      break;

    case 'berserk': {
      const fl = 0.5 + 0.5 * Math.sin(a * 14);

      ctx.fillStyle = 'rgba(255,120,40,' + (0.3 + 0.2 * fl) + ')';
      ctx.beginPath();
      ctx.arc(0, 0, r + 7, 0, 7);
      ctx.fill();

      feet(r, bob, a * 1.3);
      blob(r, d.col);

      // Sừng lửa
      ctx.fillStyle = '#ffe27a';
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.5);
      ctx.lineTo(-r - 5, -r - 7);
      ctx.lineTo(-r * 0.3, -r * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(r * 0.8, -r * 0.5);
      ctx.lineTo(r + 5, -r - 7);
      ctx.lineTo(r * 0.3, -r * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      eyes(r, 3, -1, 2.8);

      // Lông mày giận dữ
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-7, -6);
      ctx.lineTo(0, -3);
      ctx.moveTo(5, -6);
      ctx.lineTo(-1, -3);
      ctx.stroke();
      break;
    }

    case 'ghost':
      ctx.fillStyle = rg(0, -r * 0.4, 2, r * 1.3, [[0, '#ffffff'], [1, d.col]]);
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, 0);
      for (let i = 0; i < 4; i++) {
        const x = r - i * r * 0.5;
        ctx.quadraticCurveTo(x - r * 0.12, r * 1.15 + Math.sin(a * 8 + i) * 2, x - r * 0.5, r * 0.7);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.ellipse(-3, -2, 2, 3, 0, 0, 7);
      ctx.ellipse(4, -2, 2, 3, 0, 0, 7);
      ctx.fill();
      break;

    case 'ninja':
      // Khăn bay
      ctx.strokeStyle = '#d33';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.2);
      ctx.quadraticCurveTo(-r - 8, -r * 0.5 + Math.sin(a * 12) * 3, -r - 14, -r * 0.1 + Math.sin(a * 12 + 1) * 3);
      ctx.stroke();
      ctx.strokeStyle = INK;

      feet(r, bob, a * 1.5);
      blob(r, d.col, 0.3);

      ctx.fillStyle = '#f2d0a8';
      ctx.fillRect(-r * 0.8, -r * 0.45, r * 1.6, r * 0.45);

      ctx.fillStyle = '#d33';
      ctx.fillRect(-r, -r * 0.55, r * 2, 3);

      ctx.fillStyle = INK;
      ctx.fillRect(1, -r * 0.35, 2.5, 3);
      ctx.fillRect(-4, -r * 0.35, 2.5, 3);
      break;

    case 'knight':
      feet(r, bob, a);
      blob(r, d.col, 0.5);

      // Mũ giáp
      ctx.fillStyle = lg(0, -r, 0, 0, [[0, '#e0e6ee'], [1, '#8a94a2']]);
      ctx.beginPath();
      ctx.arc(0, -r * 0.15, r * 1.04, 3.2, 6.22);
      ctx.lineTo(r, r * 0.2);
      ctx.lineTo(-r, r * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = INK;
      ctx.fillRect(-r * 0.65, -r * 0.35, r * 1.3, 3);

      // Lông mũ đỏ
      ctx.fillStyle = '#e23a3a';
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.quadraticCurveTo(-8, -r - 10, -12, -r - 3 + Math.sin(a * 8) * 2);
      ctx.lineTo(-2, -r + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Khiên
      ctx.fillStyle = lg(0, 0, 0, r, [[0, '#4a7ab8'], [1, '#2a4a88']]);
      ctx.beginPath();
      ctx.moveTo(r * 0.3, -r * 0.2);
      ctx.lineTo(r * 1.2, -r * 0.2);
      ctx.lineTo(r * 1.2, r * 0.4);
      ctx.lineTo(r * 0.75, r * 0.9);
      ctx.lineTo(r * 0.3, r * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffd93b';
      ctx.fillRect(r * 0.7, -r * 0.1, 3, r * 0.7);
      break;

    case 'wizard':
      feet(r, bob, a);

      // Áo choàng
      ctx.fillStyle = lg(0, -r, 0, r, [[0, '#8a78f0'], [1, '#3f2fa8']]);
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.lineTo(r * 1.05, r * 0.9);
      ctx.lineTo(-r * 1.05, r * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mặt
      ctx.fillStyle = '#f2d0a8';
      ctx.beginPath();
      ctx.arc(0, -r * 0.5, r * 0.5, 0, 7);
      ctx.fill();
      ctx.stroke();
      eyes(r, 2, -r * 0.5, 1.8);

      // Nón
      ctx.fillStyle = '#3f2fa8';
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.7);
      ctx.lineTo(0, -r * 2);
      ctx.lineTo(r * 0.8, -r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffd93b';
      ctx.beginPath();
      ctx.arc(0, -r * 1.25, 1.8, 0, 7);
      ctx.fill();

      // Gậy phép
      ctx.strokeStyle = '#8a5a30';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(r * 0.9, r * 0.8);
      ctx.lineTo(r * 0.9, -r * 0.6);
      ctx.stroke();

      ctx.fillStyle = rg(r * 0.9, -r * 0.8, 1, 7, [
        [0, '#fff'],
        [0.5, '#77aaff'],
        [1, 'rgba(120,170,255,0)']
      ]);
      ctx.beginPath();
      ctx.arc(r * 0.9, -r * 0.8, 6 + Math.sin(a * 8), 0, 7);
      ctx.fill();

      // Vòng phép tăng tốc
      ctx.strokeStyle = 'rgba(120,170,255,.35)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, r + 10 + Math.sin(a * 6) * 2, 0, 7);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'summoner':
      feet(r, bob, a);

      ctx.fillStyle = lg(0, -r, 0, r, [[0, '#a0408a'], [1, '#401838']]);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 1.1, r);
      ctx.lineTo(-r * 1.1, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f0e8e0';
      ctx.beginPath();
      ctx.arc(0, -r * 0.55, r * 0.48, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-3, -r * 0.6, 2, 0, 7);
      ctx.arc(3, -r * 0.6, 2, 0, 7);
      ctx.fill();

      // Quả cầu ma quay quanh
      for (let i = 0; i < 3; i++) {
        const aa = a * 5 + i * 2.094;
        ctx.fillStyle = '#d65cc0';
        ctx.beginPath();
        ctx.arc(Math.cos(aa) * (r + 8), Math.sin(aa) * (r * 0.6) - 2, 3.4, 0, 7);
        ctx.fill();
        ctx.stroke();
      }
      break;

    case 'golem':
      ctx.fillStyle = lg(0, -r, 0, r, [[0, '#b4bac4'], [1, '#6a707a']]);

      rr(-r * 0.9, -r * 0.4, r * 1.8, r * 1.3, 6);
      ctx.fill();
      ctx.stroke();

      rr(-r * 0.6, -r, r * 1.2, r * 0.85, 5);
      ctx.fill();
      ctx.stroke();

      rr(-r * 1.25, -r * 0.3 + Math.sin(a * 8) * 2, r * 0.5, r * 0.9, 4);
      ctx.fill();
      ctx.stroke();

      rr(r * 0.75, -r * 0.3 - Math.sin(a * 8) * 2, r * 0.5, r * 0.9, 4);
      ctx.fill();
      ctx.stroke();

      // Rêu
      ctx.fillStyle = '#6aa84a';
      ctx.beginPath();
      ctx.arc(-r * 0.5, -r * 0.35, 3, 0, 7);
      ctx.arc(r * 0.4, r * 0.2, 3.5, 0, 7);
      ctx.fill();

      // Mắt cam
      ctx.fillStyle = '#ff9a3c';
      ctx.fillRect(-r * 0.4, -r * 0.7, 5, 4);
      ctx.fillRect(r * 0.1, -r * 0.7, 5, 4);

      // Vết nứt
      ctx.strokeStyle = 'rgba(0,0,0,.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.3, r * 0.2);
      ctx.lineTo(0, r * 0.5);
      ctx.lineTo(r * 0.3, r * 0.3);
      ctx.stroke();
      break;

    case 'boss':
      ctx.fillStyle = 'rgba(255,60,40,.25)';
      ctx.beginPath();
      ctx.arc(0, 0, r + 8 + Math.sin(a * 6) * 2, 0, 7);
      ctx.fill();

      feet(r, bob, a);
      blob(r, d.col);

      // Vương miện
      ctx.fillStyle = '#ffd93b';
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.75);
      ctx.lineTo(-r * 0.7, -r * 1.35);
      ctx.lineTo(-r * 0.3, -r * 1.0);
      ctx.lineTo(0, -r * 1.45);
      ctx.lineTo(r * 0.3, -r * 1.0);
      ctx.lineTo(r * 0.7, -r * 1.35);
      ctx.lineTo(r * 0.7, -r * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      eyes(r, 5, -1, 4);

      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, -8);
      ctx.lineTo(0, -3);
      ctx.moveTo(8, -8);
      ctx.lineTo(-1, -3);
      ctx.stroke();

      // Răng
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(-6, r * 0.5);
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(-6 + i * 4 + 2, r * 0.8);
        ctx.lineTo(-6 + i * 4 + 4, r * 0.5);
      }
      ctx.fill();
      break;

    case 'titan':
      ctx.fillStyle = 'rgba(160,60,255,.28)';
      ctx.beginPath();
      ctx.arc(0, 0, r + 10 + Math.sin(a * 5) * 3, 0, 7);
      ctx.fill();

      feet(r, bob, a);
      blob(r, d.col, 0.25);

      // Gai tinh thể
      ctx.fillStyle = '#b9a3ff';
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(i * r * 0.38 - 5, -r * 0.8);
        ctx.lineTo(i * r * 0.38, -r * 1.4 + Math.abs(i) * 5);
        ctx.lineTo(i * r * 0.38 + 5, -r * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Lõi năng lượng
      ctx.fillStyle = rg(0, r * 0.35, 1, 9, [
        [0, '#fff'],
        [0.5, '#c86bff'],
        [1, 'rgba(200,107,255,0)']
      ]);
      ctx.beginPath();
      ctx.arc(0, r * 0.35, 8 + Math.sin(a * 8) * 1.5, 0, 7);
      ctx.fill();

      ctx.fillStyle = '#ffdd55';
      ctx.fillRect(-9, -r * 0.3, 6, 4);
      ctx.fillRect(3, -r * 0.3, 6, 4);
      break;

    /* ----- MỚI ----- */

    case 'juggernaut':
      // Xích hạng nặng
      ctx.fillStyle = '#23252b';
      rr(-r - 2, -r * 0.95, r * 2 + 4, r * 0.55, 4);
      ctx.fill();
      ctx.stroke();
      rr(-r - 2, r * 0.4, r * 2 + 4, r * 0.55, 4);
      ctx.fill();
      ctx.stroke();

      // Thân thép nhiều lớp
      ctx.fillStyle = lg(0, -r * 0.8, 0, r * 0.8, [[0, '#8a93a2'], [1, '#3e4552']]);
      rr(-r * 0.95, -r * 0.7, r * 1.9, r * 1.4, 6);
      ctx.fill();
      ctx.stroke();

      // Tấm giáp phụ
      ctx.fillStyle = '#6a7384';
      rr(-r * 0.7, -r * 0.5, r * 1.1, r, 4);
      ctx.fill();
      ctx.stroke();

      // Đinh tán
      ctx.fillStyle = '#c9ced8';
      for (const [px, py] of [[-0.5, -0.35], [0.1, -0.35], [-0.5, 0.35], [0.1, 0.35]]) {
        ctx.beginPath();
        ctx.arc(r * px, r * py, 1.6, 0, 7);
        ctx.fill();
      }

      // Hai nòng pháo
      ctx.fillStyle = '#1f2228';
      ctx.fillRect(r * 0.3, -r * 0.35, r + 5, 5);
      ctx.strokeRect(r * 0.3, -r * 0.35, r + 5, 5);
      ctx.fillRect(r * 0.3, r * 0.1, r + 5, 5);
      ctx.strokeRect(r * 0.3, r * 0.1, r + 5, 5);

      // Đèn đỏ nhấp nháy
      ctx.fillStyle = (Math.sin(a * 10) > 0) ? '#ff4a3a' : '#7a1f18';
      ctx.beginPath();
      ctx.arc(-r * 0.6, 0, 2.4, 0, 7);
      ctx.fill();
      break;

    case 'phoenix': {
      const w = Math.sin(a * 9);

      // Đuôi lửa
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = ['#ff3a1a', '#ff9a2a', '#ffe07a'][i];
        ctx.lineWidth = 6 - i * 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.quadraticCurveTo(-24, (i - 1) * 7 + Math.sin(a * 6 + i) * 6, -42 - i * 3, (i - 1) * 10 + Math.sin(a * 5 + i) * 8);
        ctx.stroke();
      }
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;

      // Cánh
      ctx.fillStyle = lg(0, -26, 0, 0, [[0, '#ffb347'], [1, '#e8482a']]);
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(-4, -22 - w * 8, -22, -22 - w * 12);
      ctx.quadraticCurveTo(-14, -8, -10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(-4, 22 + w * 8, -22, 22 + w * 12);
      ctx.quadraticCurveTo(-14, 8, -10, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Thân
      ctx.fillStyle = rg(2, -3, 2, 16, [[0, '#fff2b0'], [1, '#ff7a2a']]);
      ctx.beginPath();
      ctx.ellipse(2, 0, 14, 8, 0, 0, 7);
      ctx.fill();
      ctx.stroke();

      // Đầu & mỏ
      ctx.fillStyle = '#ffd36a';
      ctx.beginPath();
      ctx.arc(14, -2, 6, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff6a1a';
      ctx.beginPath();
      ctx.moveTo(19, -3);
      ctx.lineTo(26, -1);
      ctx.lineTo(19, 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(15, -4, 1.4, 0, 7);
      ctx.fill();

      // Mào lửa
      ctx.fillStyle = '#ff4a1a';
      ctx.beginPath();
      ctx.moveTo(10, -7);
      ctx.lineTo(12, -14 + Math.sin(a * 12) * 2);
      ctx.lineTo(15, -7);
      ctx.fill();

      // Đã hồi sinh: tro tàn lấp lánh
      if (e.revived) {
        ctx.fillStyle = 'rgba(255,230,160,.8)';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(Math.cos(a * 4 + i * 1.6) * 20, Math.sin(a * 4 + i * 1.6) * 14, 1.6, 0, 7);
          ctx.fill();
        }
      }
      break;
    }

    case 'warlock':
      feet(r, bob, a);

      // Áo choàng tím đen
      ctx.fillStyle = lg(0, -r, 0, r, [[0, '#5a3fb8'], [1, '#1c1244']]);
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.7);
      ctx.lineTo(r * 1.15, r);
      ctx.lineTo(-r * 1.15, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mũ trùm
      ctx.fillStyle = '#241555';
      ctx.beginPath();
      ctx.arc(0, -r * 0.5, r * 0.62, Math.PI, 0);
      ctx.lineTo(r * 0.5, -r * 0.1);
      ctx.lineTo(-r * 0.5, -r * 0.1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Đôi mắt phát sáng trong bóng tối
      ctx.fillStyle = '#ff5af0';
      ctx.beginPath();
      ctx.arc(-3, -r * 0.35, 1.8, 0, 7);
      ctx.arc(3, -r * 0.35, 1.8, 0, 7);
      ctx.fill();

      // Quả cầu pha lê lơ lửng
      ctx.fillStyle = rg(r * 1.1, -r * 0.3 + Math.sin(a * 6) * 2, 1, 8, [
        [0, '#fff'],
        [0.5, '#b07bff'],
        [1, 'rgba(176,123,255,0)']
      ]);
      ctx.beginPath();
      ctx.arc(r * 1.1, -r * 0.3 + Math.sin(a * 6) * 2, 7, 0, 7);
      ctx.fill();

      // Vòng ma pháp
      ctx.strokeStyle = 'rgba(176,123,255,.45)';
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, r + 8 + Math.sin(a * 5) * 2, 0, 7);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'reaper':
      // Áo choàng rách tả tơi
      ctx.fillStyle = lg(0, -r, 0, r * 1.4, [[0, '#4a4a64'], [1, '#14141f']]);
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.9);
      ctx.lineTo(r * 1.1, r * 0.4);
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(r * 1.1 - i * r * 0.5, r * 1.1 + Math.sin(a * 9 + i) * 3);
        ctx.lineTo(r * 0.85 - i * r * 0.5, r * 0.6);
      }
      ctx.lineTo(-r * 1.1, r * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mặt sọ
      ctx.fillStyle = '#e8e4da';
      ctx.beginPath();
      ctx.arc(0, -r * 0.45, r * 0.5, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.ellipse(-3, -r * 0.5, 2, 2.6, 0, 0, 7);
      ctx.ellipse(3, -r * 0.5, 2, 2.6, 0, 0, 7);
      ctx.fill();

      // Lưỡi hái
      ctx.strokeStyle = '#6a4a2a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(r * 1.0, r * 1.0);
      ctx.lineTo(r * 1.0, -r * 1.1);
      ctx.stroke();

      ctx.strokeStyle = '#cfd6e0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(r * 0.5, -r * 1.1, r * 0.55, -0.2, 2.9);
      ctx.stroke();
      break;

    /* ----- Trên không ----- */

    case 'plane':
    case 'bomber':
      ctx.fillStyle = lg(0, -14, 0, 14, [[0, lighten(d.col, 0.3)], [1, d.col]]);
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(-4, -15);
      ctx.lineTo(-10, -13);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, 13);
      ctx.lineTo(-4, 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Buồng lái
      ctx.fillStyle = '#4aa8ff';
      ctx.beginPath();
      ctx.ellipse(6, 0, 4, 2.6, 0, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e03a3a';
      ctx.fillRect(-13, -3, 6, 6);

      if (t === 'bomber') {
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(-2, 7, 3.2, 0, 7);
        ctx.arc(-2, -7, 3.2, 0, 7);
        ctx.fill();
      }
      break;

    case 'bat': {
      const w = Math.sin(a * 14);

      ctx.fillStyle = d.col;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-6, -14 - w * 6, -16, -8 - w * 8);
      ctx.quadraticCurveTo(-9, -4, -6, 0);
      ctx.quadraticCurveTo(-9, 4, -16, 8 + w * 8);
      ctx.quadraticCurveTo(-6, 14 + w * 6, 0, 0);
      ctx.fill();
      ctx.stroke();

      blob(r * 0.8, '#8a62b0');

      ctx.fillStyle = '#ff5a5a';
      ctx.beginPath();
      ctx.arc(3, -1, 1.6, 0, 7);
      ctx.arc(-1, -1, 1.6, 0, 7);
      ctx.fill();

      // Tai nhọn
      ctx.fillStyle = '#8a62b0';
      ctx.beginPath();
      ctx.moveTo(-3, -r * 0.7);
      ctx.lineTo(-2, -r - 3);
      ctx.lineTo(0, -r * 0.7);
      ctx.moveTo(1, -r * 0.7);
      ctx.lineTo(3, -r - 3);
      ctx.lineTo(4, -r * 0.6);
      ctx.fill();
      break;
    }

    case 'dragon': {
      const w = Math.sin(a * 7);

      // Cánh
      ctx.fillStyle = '#a8302a';
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.quadraticCurveTo(-10, -30 - w * 10, -34, -24 - w * 14);
      ctx.quadraticCurveTo(-20, -10, -14, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.quadraticCurveTo(-10, 30 + w * 10, -34, 24 + w * 14);
      ctx.quadraticCurveTo(-20, 10, -14, -2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Đuôi
      ctx.strokeStyle = d.col;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.quadraticCurveTo(-26, Math.sin(a * 5) * 8, -40, Math.sin(a * 5 + 1) * 10);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;

      // Thân
      ctx.fillStyle = lg(0, -16, 0, 16, [[0, '#f06a58'], [1, '#a8302a']]);
      ctx.beginPath();
      ctx.ellipse(0, 0, 19, 11, 0, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffd9a0';
      ctx.beginPath();
      ctx.ellipse(1, 4, 14, 5, 0, 0, 7);
      ctx.fill();

      // Đầu
      ctx.fillStyle = d.col;
      ctx.beginPath();
      ctx.ellipse(20, -2, 9, 7, 0, 0, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffdd55';
      ctx.beginPath();
      ctx.moveTo(18, -8);
      ctx.lineTo(20, -15);
      ctx.lineTo(23, -8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(22, -4, 2.5, 0, 7);
      ctx.fill();

      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(23, -4, 1.2, 0, 7);
      ctx.fill();

      // Hơi lửa
      ctx.fillStyle = 'rgba(255,150,40,' + (0.5 + 0.3 * Math.sin(a * 12)) + ')';
      ctx.beginPath();
      ctx.moveTo(28, 0);
      ctx.lineTo(36, -3);
      ctx.lineTo(34, 2);
      ctx.fill();
      break;
    }

    default:
      blob(r, d.col);
      eyes(r);
  }
}

/* =====================================================
   HÀO QUANG TINH ANH (vẽ phía sau thân)
   ===================================================== */
function drawEliteAura(e) {
  const r = e.def.r;
  const pulse = 0.5 + 0.5 * Math.sin(e.anim * 4 + gtime * 3);

  ctx.fillStyle = rg(0, 0, r * 0.4, r + 16, [
    [0, 'rgba(255,215,70,' + (0.28 + pulse * 0.18) + ')'],
    [1, 'rgba(255,215,70,0)']
  ]);
  ctx.beginPath();
  ctx.arc(0, 0, r + 16, 0, 7);
  ctx.fill();

  // Vòng chấm vàng xoay quanh
  ctx.strokeStyle = 'rgba(255,205,50,.9)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 5]);
  ctx.lineDashOffset = -gtime * 20;
  ctx.beginPath();
  ctx.arc(0, 0, r + 8, 0, 7);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
}

/* =====================================================
   VẼ MỘT KẺ ĐỊCH HOÀN CHỈNH
   ===================================================== */
function drawEnemy(e) {
  const d = e.def;
  const r = d.r;
  const bob = Math.sin(e.anim * 10) * 1.5;

  ctx.save();
  ctx.translate(e.x, e.y);

  /* ----- Bóng đổ ----- */
  if (!d.air) {
    ctx.fillStyle = rg(0, r * 0.85, 1, r, [
      [0, 'rgba(0,0,0,.34)'],
      [1, 'rgba(0,0,0,0)']
    ]);
    ctx.beginPath();
    ctx.ellipse(0, r * 0.85, r * 1.05, r * 0.4, 0, 0, 7);
    ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(0,0,0,.2)';
    ctx.beginPath();
    ctx.ellipse(6, r + 16, r * 0.9, r * 0.3, 0, 0, 7);
    ctx.fill();
  }

  if (e.elite) drawEliteAura(e);

  if (d.stealth) ctx.globalAlpha = 0.55;
  if (e.hurt > 0) ctx.filter = 'brightness(1.7)';

  ctx.translate(0, d.air ? Math.sin(e.anim * 6) * 2 : bob * 0.6);
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;

  drawEnemyBody(e, e.anim, bob);

  ctx.filter = 'none';

  /* ----- Khiên năng lượng ----- */
  if (e.shieldMax && e.shield > 0) {
    ctx.strokeStyle = 'rgba(120,200,255,' + (0.35 + 0.5 * e.shield / e.shieldMax) + ')';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(120,200,255,.12)';
    ctx.beginPath();
    ctx.arc(0, 0, r + 6, 0, 7);
    ctx.fill();
    ctx.stroke();
  }

  /* ----- Vòng cháy / độc ----- */
  let ri = 0;
  for (const dot of e.dots) {
    ctx.strokeStyle = dot.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(0, 0, r + 4 + ri * 3, 0, 7);
    ctx.stroke();
    ri++;
  }
  ctx.globalAlpha = d.stealth ? 0.55 : 1;

  /* ----- Bị làm chậm ----- */
  if (e.slowT > 0) {
    ctx.strokeStyle = '#8be8f5';
    ctx.fillStyle = 'rgba(140,232,245,.22)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r + 3, 0, 7);
    ctx.fill();
    ctx.stroke();
  }

  /* ----- Được tăng tốc ----- */
  if (e.haste > 1) {
    ctx.strokeStyle = 'rgba(120,170,255,.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-r - 6, -4);
    ctx.lineTo(-r - 14, -4);
    ctx.moveTo(-r - 6, 4);
    ctx.lineTo(-r - 14, 4);
    ctx.stroke();
  }

  ctx.restore();

  drawEnemyBar(e);
}

/** Thanh máu (và khiên) phía trên đầu kẻ địch */
function drawEnemyBar(e) {
  const d = e.def;
  const r = d.r;

  const w = Math.max(18, r * 2 + 6);
  const x = e.x - w / 2;
  const y = e.y - r - (d.air ? 14 : 10);

  // Viền
  ctx.fillStyle = INK;
  rr(x - 1.5, y - 1.5, w + 3, 7, 3);
  ctx.fill();

  // Nền đỏ
  ctx.fillStyle = '#e04a4a';
  rr(x, y, w, 4, 2);
  ctx.fill();

  // Máu còn lại
  const pct = clamp(e.hp / e.max, 0, 1);
  ctx.fillStyle = pct > 0.5 ? '#4de04d' : pct > 0.25 ? '#ffd93b' : '#ff7a3a';
  if (pct > 0) {
    rr(x, y, Math.max(3, w * pct), 4, 2);
    ctx.fill();
  }

  // Khiên
  if (e.shieldMax && e.shield > 0) {
    ctx.fillStyle = '#0a2a4a';
    ctx.fillRect(x - 1, y + 6, w + 2, 4);
    ctx.fillStyle = '#4aa8ff';
    ctx.fillRect(x, y + 7, w * clamp(e.shield / e.shieldMax, 0, 1), 2);
  }

  // Ngôi sao tinh anh
  if (e.elite) {
    ctx.fillStyle = '#ffd93b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.font = '800 12px Baloo 2,Segoe UI,sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText('★', x + w / 2, y - 3);
    ctx.fillText('★', x + w / 2, y - 3);
  }
}
