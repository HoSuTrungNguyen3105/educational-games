// Harness camera sau lưng cho 2 file thi 3D (raycaster tự viết).
// Trích đúng hàm camStep trong file game, chạy với map giả lập + solid() giống hệ thống,
// rồi kiểm: mắt không chui vào tường, mắt luôn ở SAU lưng, nhân vật hiện giữa màn hình.
import fs from 'node:fs';

const file = process.argv[2] || 'src/games/examination/thithap-3d.html';
const html = fs.readFileSync(file, 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n;\n');
const lines = script.replace(/\r/g, '').split('\n');
const from = (start, end) => { const a = lines.findIndex(start); if (a < 0) return null; const b = lines.findIndex((l, i) => i > a && end(l)); if (b < 0) return null; return lines.slice(a, b + 1).join('\n'); };
const camTxt = from(l => /^const CAMD\s*=/.test(l.trim()), l => l.trim() === '}');
const heroTxt = from(l => /^function heroBack\s*\(/.test(l.trim()), l => /^function heroUp\s*\(/.test(l.trim()));
if (!camTxt || !heroTxt) throw new Error('không trích được camStep/heroBack từ ' + file);
console.log('file:', file, '| khoảng lùi CAMD =', (camTxt.match(/const CAMD\s*=\s*([\d.]+)/) || [])[1],
  '| camStep', camTxt.split('\n').length, 'dòng · heroBack', heroTxt.split('\n').length, 'dòng');

// ---- map giả lập: phòng rộng + hành lang + tường (giống kiểu grid của game) ----
const N = 32, map = new Uint8Array(N * N);
for (let i = 0; i < N * N; i++) map[i] = 1;                       // đặc hết
const carve = (x0, y0, x1, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) map[y * N + x] = 0; };
carve(4, 4, 14, 14);        // phòng lớn
carve(14, 8, 24, 10);       // hành lang hẹp (3 ô)
carve(24, 4, 28, 14);       // phòng kia
carve(8, 14, 9, 26);        // hành lang dọc
const M = Math, TAU = Math.PI * 2;
const solid = (x, y) => x < 0 || y < 0 || x >= N || y >= N || map[(y | 0) * N + (x | 0)] > 0;
const aD = a => M.atan2(M.sin(a), M.cos(a));
// trình mô phỏng người chơi có va chạm (game thật cũng vậy): giữ P trong ô trống,
// nếu không thì "mắt trong tường" chỉ là lỗi của harness chứ không phải của camera.
const PAD = .3;
const step = (P, d) => { const nx = P.x + M.cos(P.a) * d, ny = P.y + M.sin(P.a) * d; if (!solid(nx + M.cos(P.a) * PAD, ny + M.sin(P.a) * PAD)) { P.x = nx; P.y = ny } };

// ---- nạp camStep thật + state P ----
const mk = new Function('M', 'aD', 'solid', 'clamp', 'P', 'TAU',
  camTxt + '\nreturn {camStep, get camA(){return camA}, get camD(){return camD}, get camSc(){return camSc}, get camX(){return camX}, get camY(){return camY}, CAMD};');
const PL = .72, RW = 390, RH = 845, f = (RW / 2) / PL;

function run(label, move) {
  const P = { x: 9.5, y: 10.4, a: -1.8, bt: 0, sw: 0, cast: 0, inv: 0 };
  const c = mk(M, aD, solid, (v, a, b) => v < a ? a : v > b ? b : v, P, TAU);
  let badWall = 0, front = 0, maxLag = 0, minD = 9, maxD = 0, hero = [], skipAl = 0, fb = 0;
  for (let i = 0; i < 1400; i++) {
    move(P, i);
    c.camStep(1 / 60);
    const ex = c.camX, ey = c.camY;
    if (solid(ex, ey)) badWall++;                       // mắt không được nằm trong khối
    const bx = P.x - ex, by = P.y - ey;                 // véc-tơ mắt -> nhân vật
    const d = M.hypot(bx, by);
    if (d < .2) fb++;                                   // góc cụt: rơi về góc nhìn thứ nhất (chấp nhận được)
    // nhân vật phải Ở PHÍA TRƯỚC mắt theo đúng hướng nhìn (dot < 0 = camera vượt lên trước)
    if (bx * M.cos(P.a) + by * M.sin(P.a) < -.05) front++;
    minD = M.min(minD, d); maxD = M.max(maxD, d);
    maxLag = M.max(maxLag, M.abs(aD(P.a - c.camA)));
    // chiếu nhân vật bằng đúng công thức spr(): ty < .2 là sprite bị bỏ vẽ (mất người)
    const dx = M.cos(P.a), dy = M.sin(P.a), plx = -dy * PL, ply = dx * PL;
    const CAM = { x: ex, y: ey, dx, dy, px: plx, py: ply, inv: -1 / PL, f, hor: RH / 2 };
    const sx = P.x - CAM.x, sy = P.y - CAM.y;
    const tx = CAM.inv * (CAM.dy * sx - CAM.dx * sy), ty = CAM.inv * (-CAM.py * sx + CAM.px * sy);
    // game vẽ nhân vật với sz = 1.12*camD*camSc/CAMD, al = clamp((camD*camSc-.18)/.4,0,1)
    const sz = 1.12 * c.camD * c.camSc / c.CAMD, al = M.max(0, M.min(1, (c.camD * c.camSc - .18) / .4));
    if (ty < .2) skipAl = M.max(skipAl, al);           // spr() bỏ vẽ: chỉ thật sự "nhấp nháy" nếu alpha còn cao
    else if (i % 100 === 0) {
      const sh = CAM.f / M.max(ty, .01) * sz, scr = RW / 2 * (1 + tx / ty);
      const bot = CAM.hor + .5 * CAM.f / M.max(ty, .01), top = bot - sh;
      hero.push({ h: +sh.toFixed(0), cx: +scr.toFixed(0), top: +top.toFixed(0), bot: +bot.toFixed(0), al: +al.toFixed(2) });
    }
  }
  const cx = hero.map(o => o.cx), tp = hero.map(o => o.top), bt = hero.map(o => o.bot), hh = hero.map(o => o.h);
  const off = hero.length ? M.max(...cx.map(v => M.abs(v - RW / 2))) : 0;
  const rng = a => a.length ? `${M.min(...a)}..${M.max(...a)}` : '—';
  console.log(`${label.padEnd(26)} tường:${badWall}  trước-lưng:${front}  alpha lúc spr bỏ vẽ:${skipAl.toFixed(2)}  (mờ vì bí:${fb})  lag:${maxLag.toFixed(2)}rad  khoảng:${minD.toFixed(2)}..${maxD.toFixed(2)}`);
  console.log(`  ${''.padEnd(26)} nhân vật: cx ${rng(cx)} (lệch max ${off.toFixed(0)}px) · cao ${rng(hh)}px · dọc ${rng(tp)}→${rng(bt)}/845 · mờ ${rng(hero.map(o => o.al))}`);
  return badWall + front + (skipAl > .1 ? 1 : 0) + (hero.length && off > 60 ? 1 : 0);
}

let err = 0;
err += run('đi thẳng trong phòng', (P) => { step(P, .03) });
err += run('đi hành lang hẹp', (P, i) => { P.a = 0; if (P.x < 27) step(P, .03); else { P.a = M.PI; step(P, .03) } });
err += run('quay gấp liên tục', (P, i) => { if (i % 20 === 0) P.a += 1.4; step(P, .02) });
err += run('đứng quay tại chỗ', (P, i) => { P.x = 9.5; P.y = 10.4; P.a = M.PI / 2 + i * .01 });
err += run('dọc hành lang sát tường', (P, i) => { P.a = M.PI / 2; if (P.y < 25) step(P, .02); else { P.a = -M.PI / 2; step(P, .02) } });
err += run('chạy vòng quanh góc', (P, i) => { P.a = i * .02; step(P, .03) });
// các trường hợp bí: sau lưng là tường sát ngay sau gáy
err += run('áp tường nhìn ra giữa', (P, i) => { P.x = 9.5; P.y = 4.3; P.a = M.PI / 2 });
err += run('hành lang 2 ô quay ngang', (P, i) => { P.x = 8.4; P.y = 20; P.a = M.PI });
err += run('kề góc tường', (P, i) => { P.x = 4.32; P.y = 13.68; P.a = -.9 + M.sin(i * .02) * .7 });
err += run('lùi sát tường', (P, i) => { P.a = 0; if (P.x < 27) step(P, .04); else { P.a = M.PI; step(P, .04) } });
console.log(err === 0 ? '==> KHÔNG có lỗi va tường / sai phía / mất nhân vật' : `==> CÓ ${err} khung hình lỗi`);

// ---- kiểm tra sprite hero dựng được: chạy heroBack thật với ctx giả ghi lệnh ----
let ops = 0, nan = 0;
const chk = (v) => { if (!Number.isFinite(v)) nan++; };
const rec = new Proxy({}, {
  get: (t, k) => {
    if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
    if (['fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'globalAlpha', 'font'].includes(k)) return '';
    return (...a) => { ops++; a.forEach(v => chk(v)); };
  },
  set: () => true,
});
const ell = (x, cx, cy, rx, ry, f2) => { chk(cx); chk(cy); chk(rx); chk(ry); x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, TAU); x.fill(); };
const shd = x => ell(x, 64, 122, 36, 6, 'rgba(0,0,0,.28)');
const poly = (x, p, f2) => { x.fillStyle = f2; x.beginPath(); p.forEach((q, i) => { chk(q[0]); chk(q[1]); i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); }); x.closePath(); x.fill(); };
try {
  const heroBack = new Function('M', 'TAU', 'ell', 'shd', 'poly', heroTxt + '\nreturn heroBack;')(M, TAU, ell, shd, poly);
  for (let i = 0; i < 9; i++) heroBack(rec, i / 8 * TAU, '#2f6fb3', i === 8 ? 1 : 0);
  console.log(`heroBack chạy OK · ${(ops / 9) | 0} lệnh vẽ mỗi khung · NaN=${nan}`);
  if (nan) err++;
} catch (e) { console.log('heroBack LỖI:', e.message); err++; }
process.exit(err ? 1 : 0);
