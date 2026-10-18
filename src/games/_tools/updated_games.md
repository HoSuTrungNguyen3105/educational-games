# Nâng cấp Vườn Thủ Hộ

Logic game giữ nguyên. Gói này gồm 4 phần dán vào file HTML hiện tại: **A** (CSS), **B** (module SVG), **C** (tìm-và-thay), **D** (JSON quái và màn mới).

Lưu ý : hãy sử dụng file json này F:\Clone\edu_game\educational-games\src\games\plantandanimal.json để cấu hình con nào có hp như nào và khi nào thì sẽ đi ra , cũng như công và thủ và xuất hiện cho tôi , v.v...

---

## A. CSS: dán ngay trước `</style>`

```css
/* ===== Nâng cấp giao diện ===== */
#top{background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 2px,transparent 2px 38px),linear-gradient(#7a4c2a,#3a2414);border-bottom:4px solid #e0b25f;box-shadow:0 6px 18px rgba(0,0,0,.55),inset 0 2px 0 rgba(255,255,255,.18)}
.packet{border-radius:12px;border:2px solid #b07a3c;background:linear-gradient(#fffdf0,#f1dba0 70%,#e2c27a);box-shadow:0 4px 0 #2a170a,inset 0 2px 0 #fff}
.packet:hover{transform:translateY(-2px)}
.packet .pc{background:linear-gradient(#ffe98a,#f2b634);color:#4a2a00;box-shadow:0 1px 0 rgba(0,0,0,.25)}
#sunBox{background:radial-gradient(circle at 30% 20%,#3a2410,#170b04);box-shadow:inset 0 2px 8px #000,0 0 14px rgba(255,200,60,.35)}
#progFill{background:linear-gradient(#d4ff8a,#58b43f 60%,#3c8c2c);box-shadow:0 0 10px rgba(150,240,90,.6)}
.btn{letter-spacing:.3px;border:2px solid rgba(255,255,255,.28);position:relative;overflow:hidden}
.btn::after{content:"";position:absolute;left:8%;right:8%;top:3px;height:38%;border-radius:99px;background:linear-gradient(rgba(255,255,255,.4),rgba(255,255,255,0))}
.card{border:3px solid #a06b30;border-radius:18px;background:linear-gradient(#fffdf0,#f0d9a2);transition:transform .15s,box-shadow .15s}
.card:hover{transform:translateY(-3px) rotate(-.4deg);box-shadow:0 7px 0 #3a2414,0 14px 18px rgba(0,0,0,.3)}
.card.grave .num{background:radial-gradient(circle at 35% 30%,#8fd0a0,#2d6a4a);border-color:#173a2a}
.card.castle .num{background:radial-gradient(circle at 35% 30%,#d070a0,#5a1f5a);border-color:#2e0f34}
.card .ci span img{width:22px;height:22px;margin-right:2px;vertical-align:middle;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4))}
.logo{animation:logoFloat 3.2s ease-in-out infinite}
@keyframes logoFloat{50%{transform:translateY(-6px) rotate(-1deg)}}
.panel{border:5px solid #b07a3c;border-radius:28px;background:linear-gradient(#fffbe6,#efd49a);box-shadow:0 0 0 4px #3a2414,0 18px 50px rgba(0,0,0,.6);animation:pop .35s cubic-bezier(.2,1.4,.4,1)}
@keyframes pop{from{transform:scale(.7);opacity:0}}
#banner{font-size:clamp(30px,7vw,54px);letter-spacing:1px}
#banner.warn{color:#ffd0c8;text-shadow:0 3px 0 #5a0f0f,0 0 28px rgba(255,40,40,.9),0 6px 14px rgba(0,0,0,.7)}
#toast,#hint{border-radius:16px;box-shadow:0 6px 16px rgba(0,0,0,.4)}
```

---

## B. Module SVG: dán ngay phía trên dòng `/* ================= Hiệu ứng ================= */`

Quái được vẽ bằng SVG (quay mặt sang trái), có hiệu ứng bước đi nhún nhảy. Nếu thiếu SVG cho một id, game tự dùng emoji dự phòng.

```js
/* ================= Quái vẽ bằng SVG ================= */
const SV = b => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${b}</svg>`;
const OL = '#2a1a10';
const EYE = (x, y, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${OL}" stroke-width="2"/><circle cx="${x - 1.5}" cy="${y + 1}" r="${r * .45}" fill="#1a1a1a"/>`;
const ZOMBIE = hat => SV(`<ellipse cx="50" cy="94" rx="26" ry="4" fill="rgba(0,0,0,.2)"/>
<path d="M44 70v20M58 70v20" stroke="#34456b" stroke-width="11" stroke-linecap="round"/><path d="M40 92h10M56 92h10" stroke="#2a1a10" stroke-width="7" stroke-linecap="round"/>
<path d="M34 46q16-6 30 0l4 28-8-4-6 6-6-6-6 6-6-6-6 4z" fill="#7a4fa0" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>
<path d="M38 52L10 56M40 62L14 68" stroke="#8fbf6a" stroke-width="9" stroke-linecap="round"/><circle cx="9" cy="56" r="5" fill="#9fd07a" stroke="${OL}" stroke-width="2"/><circle cx="13" cy="68" r="5" fill="#9fd07a" stroke="${OL}" stroke-width="2"/>
<circle cx="46" cy="30" r="18" fill="#a6d67f" stroke="${OL}" stroke-width="3"/><path d="M34 16l4 6 5-7 5 7 6-5" fill="#4a3320" stroke="${OL}" stroke-width="2"/>
${EYE(38, 30, 6.5)}${EYE(53, 29, 4.5)}<path d="M34 41l4-3 4 3 4-3 4 3 4-3" stroke="${OL}" stroke-width="2.5" fill="#5a1a1a"/><path d="M52 38l3 4" stroke="#d94a4a" stroke-width="2"/>${hat || ''}`);
const VAMP = lord => SV(`<ellipse cx="50" cy="94" rx="26" ry="4" fill="rgba(0,0,0,.22)"/>
<path d="M34 44L14 92h66L66 44z" fill="${lord ? '#7a0f2a' : '#1c1428'}" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>
<path d="M44 50l6 30 6-30z" fill="#e8dfe8"/><path d="M36 46l14 8-4-14zM64 46L50 54l4-14z" fill="#b0123a" stroke="${OL}" stroke-width="2"/>
<path d="M38 56L12 60" stroke="#1c1428" stroke-width="9" stroke-linecap="round"/><circle cx="11" cy="60" r="5" fill="#eadff0" stroke="${OL}" stroke-width="2"/><path d="M5 62l-5 6M9 65l-3 7" stroke="#eadff0" stroke-width="2"/>
<circle cx="48" cy="30" r="17" fill="#ece3f0" stroke="${OL}" stroke-width="3"/><path d="M31 28q2-18 18-17 14 0 16 14-8-8-18-8-8 0-16 11z" fill="#14101c" stroke="${OL}" stroke-width="2.5"/>
<ellipse cx="41" cy="30" rx="4.5" ry="5.5" fill="#ffefef" stroke="${OL}" stroke-width="2"/><circle cx="40" cy="31" r="2.6" fill="#d40f2e"/><ellipse cx="55" cy="29" rx="4" ry="5" fill="#ffefef" stroke="${OL}" stroke-width="2"/><circle cx="54" cy="30" r="2.4" fill="#d40f2e"/>
<path d="M37 40q8 5 16 0" stroke="${OL}" stroke-width="2.5" fill="#6a0f1f"/><path d="M40 40l2 6 2-5M49 41l2 6 2-6" fill="#fff" stroke="${OL}" stroke-width="1.5"/>
${lord ? '<path d="M32 16l4-10 7 7 6-10 6 10 7-7 3 10z" fill="#f5c542" stroke="#2a1a10" stroke-width="2.5" stroke-linejoin="round"/><circle cx="49" cy="10" r="2.5" fill="#d40f2e"/>' : ''}`);
const SPR = {
  worm: SV(`<ellipse cx="50" cy="90" rx="38" ry="4" fill="rgba(0,0,0,.2)"/><g stroke="#2b3a14" stroke-width="3"><circle cx="84" cy="70" r="11" fill="#7fbf34"/><circle cx="66" cy="66" r="13" fill="#92d142"/><circle cx="46" cy="66" r="14" fill="#7fbf34"/><circle cx="27" cy="58" r="19" fill="#b4e45a"/></g>${EYE(19, 52)}${EYE(34, 49, 5)}<path d="M13 68q8 6 16 0" stroke="#2b3a14" stroke-width="3" fill="none"/><path d="M20 39l-6-13M30 37l3-14" stroke="#2b3a14" stroke-width="3" stroke-linecap="round"/>`),
  beetle: SV(`<ellipse cx="52" cy="90" rx="36" ry="4" fill="rgba(0,0,0,.2)"/><path d="M30 80l-10 10M48 82l-2 10M68 80l10 10" stroke="${OL}" stroke-width="4" stroke-linecap="round"/><ellipse cx="56" cy="60" rx="34" ry="26" fill="#3f6fb5" stroke="${OL}" stroke-width="3"/><path d="M56 34v52" stroke="${OL}" stroke-width="3"/><path d="M40 42q-6 18 0 36M72 42q6 18 0 36" stroke="#9cc4ff" stroke-width="3" fill="none" opacity=".6"/><circle cx="22" cy="58" r="15" fill="#2c4f86" stroke="${OL}" stroke-width="3"/><path d="M14 46l-8-16 12 6z" fill="#c9a04a" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>${EYE(18, 56, 5)}`),
  locust: SV(`<ellipse cx="50" cy="90" rx="36" ry="3.5" fill="rgba(0,0,0,.2)"/><path d="M60 60L78 30l8 40M60 66l14 24" stroke="#4a8a2a" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M50 52q20-30 40-14-10 6-24 16z" fill="rgba(210,240,170,.75)" stroke="${OL}" stroke-width="2"/><ellipse cx="54" cy="62" rx="30" ry="13" fill="#8ccf45" stroke="${OL}" stroke-width="3"/><path d="M40 52v20M52 50v22M64 52v20" stroke="#4a8a2a" stroke-width="3"/><circle cx="22" cy="54" r="13" fill="#a4e056" stroke="${OL}" stroke-width="3"/>${EYE(17, 50, 5)}<path d="M18 42l-10-18M26 41l-4-20" stroke="${OL}" stroke-width="3" stroke-linecap="round"/><path d="M14 62q5 3 10 0" stroke="${OL}" stroke-width="2.5" fill="none"/>`),
  rat: SV(`<ellipse cx="50" cy="90" rx="36" ry="3.5" fill="rgba(0,0,0,.2)"/><path d="M80 74q16 2 14-16" stroke="#d99aa0" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="58" cy="66" rx="30" ry="20" fill="#9a9aa8" stroke="${OL}" stroke-width="3"/><ellipse cx="54" cy="72" rx="18" ry="11" fill="#c8c8d4"/><path d="M42 82l-4 8M70 84l3 7" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M12 62l22-14 8 22z" fill="#a8a8b8" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><circle cx="12" cy="62" r="4.5" fill="#f08aa0" stroke="${OL}" stroke-width="2"/><circle cx="40" cy="40" r="11" fill="#b4b4c4" stroke="${OL}" stroke-width="3"/><circle cx="40" cy="40" r="6" fill="#f2a0b0"/>${EYE(28, 56, 4.5)}<path d="M8 66l-8-2M8 68l-8 5" stroke="${OL}" stroke-width="2"/>`),
  snail: SV(`<ellipse cx="52" cy="90" rx="38" ry="4" fill="rgba(0,0,0,.2)"/><path d="M8 82q0-14 16-14h60q8 0 8 10t-12 10H18q-10 0-10-6z" fill="#e8c58a" stroke="${OL}" stroke-width="3"/><circle cx="62" cy="52" r="30" fill="#a9703a" stroke="${OL}" stroke-width="3"/><path d="M62 52m0-20a20 20 0 1 1-18 28M62 52m0-10a10 10 0 1 1-8 14" stroke="#6b3f1e" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M20 70q-6-20 2-34M30 68q0-22 6-30" stroke="#e8c58a" stroke-width="5" stroke-linecap="round" fill="none"/>${EYE(22, 34, 5)}${EYE(37, 36, 5)}<path d="M12 78q5 4 11 0" stroke="${OL}" stroke-width="2.5" fill="none"/>`),
  boss: SV(`<ellipse cx="50" cy="92" rx="42" ry="4" fill="rgba(0,0,0,.25)"/><path d="M92 70q8-40-16-46" stroke="#8a1a14" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M74 22l-4 14 12-6z" fill="#ffd34a" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/><path d="M30 80l-12 10M46 84l-4 8M62 84l4 8M76 80l12 10" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><ellipse cx="58" cy="66" rx="34" ry="20" fill="#c9302a" stroke="${OL}" stroke-width="3"/><path d="M40 52v28M58 48v36M76 54v24" stroke="#8a1a14" stroke-width="3"/><path d="M30 56L10 46q-8-12 6-14l10 6M30 62L8 66q-8 8 4 14l12-6" fill="#e0453a" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><circle cx="28" cy="60" r="14" fill="#d9382f" stroke="${OL}" stroke-width="3"/>${EYE(24, 56, 4.5)}${EYE(34, 55, 3.8)}<path d="M20 68l4 5 4-5 4 5" stroke="#fff" stroke-width="2" fill="none"/>`),
  zombie: ZOMBIE(''),
  zombieCone: ZOMBIE('<path d="M30 18L46 -4l16 22z" fill="#f08a2a" stroke="#2a1a10" stroke-width="3" stroke-linejoin="round"/><path d="M35 12h22M33 16h26" stroke="#fff" stroke-width="3"/><ellipse cx="46" cy="19" rx="19" ry="3.5" fill="#d46a14" stroke="#2a1a10" stroke-width="2.5"/>'),
  bat: SV(`<ellipse cx="50" cy="94" rx="20" ry="3" fill="rgba(0,0,0,.18)"/><path d="M50 52L22 28 4 40l10 6-6 14 14-4 8 10 8-6zM50 52l28-24 18 12-10 6 6 14-14-4-8 10-8-6z" fill="#5a3a8a" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M22 30l10 22M78 30L68 52" stroke="#8a62c0" stroke-width="2.5"/><ellipse cx="50" cy="56" rx="15" ry="17" fill="#3a2460" stroke="${OL}" stroke-width="3"/><path d="M38 44l-3-14 10 8M62 44l3-14-10 8" fill="#3a2460" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><circle cx="44" cy="52" r="4" fill="#ff3a4a"/><circle cx="56" cy="52" r="4" fill="#ff3a4a"/><path d="M44 62q6 5 12 0" stroke="${OL}" stroke-width="2.5" fill="#fff"/><path d="M46 63l1.5 5 1.5-4M52 64l1.5 4 1.5-5" fill="#fff" stroke="${OL}" stroke-width="1.2"/>`),
  vampire: VAMP(false),
  vampLord: VAMP(true)
};
const SP_IMG = {};
function spImg(id) {
  if (SP_IMG[id] !== undefined) return SP_IMG[id];
  if (!SPR[id]) return (SP_IMG[id] = null);
  const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SPR[id]); return (SP_IMG[id] = im);
}
Object.keys(SPR).forEach(spImg);
function monImg(id) {
  const im = spImg(id);
  return im ? `<img alt="" src="${im.src}">` : ((CFG.monsters[id] || {}).icon || '');
}
function sprite(id, icon, x, y, size, o = {}) {
  const im = spImg(id);
  if (!im || !im.complete || !im.naturalWidth) { emoji(icon, x, y, size, o); return; }
  const S = size * 1.3;
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(o.sx || 1, o.sy || 1);
  ctx.globalAlpha = o.alpha === undefined ? 1 : o.alpha;
  if (o.tint) {
    const n = Math.ceil(S * DPR); tc.width = tc.height = n; tx.setTransform(DPR, 0, 0, DPR, 0, 0); tx.clearRect(0, 0, S, S);
    tx.drawImage(im, 0, 0, S, S); tx.globalCompositeOperation = 'source-atop'; tx.globalAlpha = o.tintA || .5; tx.fillStyle = o.tint; tx.fillRect(0, 0, S, S);
    tx.globalAlpha = 1; tx.globalCompositeOperation = 'source-over'; ctx.drawImage(tc, -S / 2, -S / 2, S, S);
  } else ctx.drawImage(im, -S / 2, -S / 2, S, S);
  ctx.restore();
}
```

---

## C. Tìm và thay (mỗi mục chỉ xuất hiện một lần trong file)

**C1. Icon dự phòng cho quái và cây mới**
- Tìm: `boss: '🦂' };`
- Thay: `boss: '🦂', zombie: '🧟', zombieCone: '🧟', bat: '🦇', vampire: '🧛', vampLord: '🧛' };`
- Tìm: `chili: '🌶️' };`
- Thay: `chili: '🌶️', garlic: '🧄' };`

**C2. Hai chủ đề nền mới**
- Tìm: `const THEMES = {`
- Thay:
```js
const THEMES = {
  grave:  { c1: '#4a6b4a', c2: '#547a54', base: ['#2a3d33', '#16241d'], wall: '#6f7a74', tuft: 'rgba(10,40,25,.5)' },
  castle: { c1: '#4b3f5c', c2: '#564a6b', base: ['#2a1f3a', '#150e22'], wall: '#6a5a7a', tuft: 'rgba(20,10,40,.5)' },
```

**C3. Icon chủ đề trong menu**
- Tìm: `night: '🌙' };`
- Thay: `night: '🌙', grave: '🪦', castle: '🏰' };`

**C4. Menu hiện quái bằng SVG**
- Tìm: `(CFG.monsters[m] || {}).icon || ''`
- Thay: `monImg(m)`

**C5. Vẽ quái bằng SVG, có nhún khi bước đi**
- Tìm: `emoji(m.d.icon, x + xo, y, size, o);`
- Thay:
```js
if (m.dying <= 0 && !m.eat && m.state !== 'jump') { const w = Math.sin(m.ph * 2); o.sx = 1 + w * .04; o.sy = 1 - w * .04; }
  sprite(m.id, m.d.icon, x + xo, y, size, o);
```

**C6. Hiệu ứng vòng sóng khi trồng cây và khi quái chết**
- Tìm: `sfx.plant();`
- Thay: `sfx.plant(); G.fx.push({ k: 'r', x: px(col + .5), y: py(row + .85), rad: cw * .5, life: .4, max: .4, c: '#d9ffb0' });`
- Tìm: `m.dying = .7; m.hp = 0; G.killed++;`
- Thay: `m.dying = .7; m.hp = 0; G.killed++; G.fx.push({ k: 'r', x: px(m.u), y: py(m.row + .5), rad: cw * .6, life: .45, max: .45, c: '#fff3a0' });`
- Tìm: `} else if (f.k === 'c') { ctx.save();`
- Thay:
```js
} else if (f.k === 'r') { const k = 1 - f.life / f.max; ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.c; ctx.lineWidth = 1 + 4 * (1 - k); ctx.beginPath(); ctx.ellipse(f.x, f.y, f.rad * (.3 + k), f.rad * (.3 + k) * .45, 0, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
    } else if (f.k === 'c') { ctx.save();
```

**C7. Sương mù cho map nghĩa địa và lâu đài**
- Tìm: `} else if (th === 'dusk') { ctx.fillStyle = 'rgba(255,120,50,.12)'; ctx.fillRect(0, 0, W, H); }`
- Thay:
```js
} else if (th === 'dusk') { ctx.fillStyle = 'rgba(255,120,50,.12)'; ctx.fillRect(0, 0, W, H);
  } else if (th === 'grave' || th === 'castle') {
    const gv = th === 'grave';
    ctx.fillStyle = gv ? 'rgba(10,40,30,.34)' : 'rgba(40,10,50,.4)'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) { const x = ((T * .02 * (i + 1) + i * .27) % 1.5 - .25) * W, y = oy + (.15 + i * .24) * lh;
      const fg = ctx.createRadialGradient(x, y, 0, x, y, cw * 3); fg.addColorStop(0, gv ? 'rgba(190,230,210,.2)' : 'rgba(230,190,230,.17)'); fg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = fg; ctx.fillRect(x - cw * 3, y - cw * 3, cw * 6, cw * 6); }
    const mx = W - cw * .9, my = oy + ch * .6, mg = ctx.createRadialGradient(mx, my, 2, mx, my, cw * 1.4);
    mg.addColorStop(0, gv ? 'rgba(255,255,230,.9)' : 'rgba(255,170,190,.85)'); mg.addColorStop(.25, gv ? 'rgba(255,255,230,.35)' : 'rgba(255,120,160,.3)'); mg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, cw * 1.4, 0, 6.283); ctx.fill();
  }
```

---

## D. JSON cấu hình

**D1. Trong `"monsters"` của `cfgDefault`, thêm (nhớ dấu phẩy sau quái `boss`):**
```json
"zombie":     {"name": "Zombie",              "hp": 220,  "speed": 0.16, "dps": 22, "size": 1.1},
"zombieCone": {"name": "Zombie Nón Cối",      "hp": 520,  "speed": 0.15, "dps": 24, "size": 1.15},
"bat":        {"name": "Dơi Quỷ",             "hp": 70,   "speed": 0.55, "dps": 14, "size": 0.9},
"vampire":    {"name": "Ma Cà Rồng",          "hp": 480,  "speed": 0.20, "dps": 30, "size": 1.1, "jump": true},
"vampLord":   {"name": "Bá Tước Ma Cà Rồng",  "hp": 4500, "speed": 0.06, "dps": 90, "size": 1.75}
```

**D2. Trong `"plants"`, thêm:**
```json
"garlic": {"name": "Tỏi Xua Quỷ", "kind": "wall", "cost": 75, "hp": 1000, "cooldown": 16}
```

**D3. Trong `"levels"`, thêm 3 màn sau màn "Bọ Cạp Chúa":**
```json
{
  "name": "Nghĩa Địa Zombie", "theme": "grave", "rows": 5, "startSun": 250,
  "plants": ["sunflower", "shooter", "wall", "garlic", "bomb", "ice", "mine", "repeater", "chili"],
  "skySun": {"first": 10, "every": 12, "amount": 25},
  "timeline": [
    {"t": 15, "monster": "zombie", "row": "random"},
    {"t": 32, "monster": "zombie", "row": "random", "count": 2, "gap": 4},
    {"t": 52, "monster": "zombieCone", "row": "random"},
    {"t": 70, "monster": "zombie", "row": "random", "count": 3, "gap": 3},
    {"t": 90, "banner": "Zombie trỗi dậy từ mộ!", "flag": true, "spawn": [
      {"monster": "zombie", "row": "all"},
      {"monster": "zombieCone", "row": "random", "count": 2, "gap": 5, "delay": 4}
    ]},
    {"t": 120, "banner": "Đợt cuối: bầy zombie kéo đến!", "flag": true, "spawn": [
      {"monster": "zombie", "row": "all", "count": 2, "gap": 6},
      {"monster": "zombieCone", "row": "random", "count": 3, "gap": 4, "delay": 3},
      {"monster": "bat", "row": "random", "count": 4, "gap": 2, "delay": 8}
    ]}
  ]
},
{
  "name": "Lâu Đài Ma Cà Rồng", "theme": "castle", "rows": 5, "startSun": 300,
  "plants": ["sunflower", "shooter", "wall", "garlic", "bomb", "ice", "mine", "repeater", "chili"],
  "skySun": {"first": 12, "every": 14, "amount": 25},
  "timeline": [
    {"t": 15, "monster": "bat", "row": "random", "count": 3, "gap": 2},
    {"t": 35, "monster": "vampire", "row": "random"},
    {"t": 55, "monster": "zombieCone", "row": "random", "count": 2, "gap": 4},
    {"t": 75, "monster": "vampire", "row": "random", "count": 2, "gap": 5},
    {"t": 100, "banner": "Bầy dơi đang tràn vào lâu đài!", "flag": true, "spawn": [
      {"monster": "bat", "row": "all", "count": 2, "gap": 3},
      {"monster": "vampire", "row": "random", "count": 2, "gap": 6, "delay": 4}
    ]},
    {"t": 135, "banner": "Đợt cuối! Giữ vững hàng phòng thủ!", "flag": true, "spawn": [
      {"monster": "vampire", "row": "all", "count": 2, "gap": 7},
      {"monster": "zombieCone", "row": "random", "count": 3, "gap": 4, "delay": 3},
      {"monster": "bat", "row": "random", "count": 6, "gap": 1.5, "delay": 6}
    ]}
  ]
},
{
  "name": "Bá Tước Ma Cà Rồng", "theme": "castle", "rows": 5, "startSun": 350,
  "plants": ["sunflower", "shooter", "wall", "garlic", "bomb", "ice", "mine", "repeater", "chili"],
  "skySun": {"first": 10, "every": 12, "amount": 25},
  "timeline": [
    {"t": 15, "monster": "zombie", "row": "random", "count": 3, "gap": 3},
    {"t": 35, "monster": "vampire", "row": "random", "count": 2, "gap": 5},
    {"t": 60, "monster": "bat", "row": "random", "count": 5, "gap": 2},
    {"t": 85, "banner": "Một đợt quái lớn đang kéo tới!", "flag": true, "spawn": [
      {"monster": "zombieCone", "row": "all"},
      {"monster": "vampire", "row": "random", "count": 3, "gap": 5, "delay": 4}
    ]},
    {"t": 120, "banner": "BÁ TƯỚC MA CÀ RỒNG XUẤT HIỆN!", "flag": true, "spawn": [
      {"monster": "vampLord", "row": 3},
      {"monster": "bat", "row": "all", "delay": 6},
      {"monster": "zombie", "row": "random", "count": 6, "gap": 2, "delay": 10}
    ]}
  ]
}
```

**Lưu ý:** Màn chơi được đọc từ cấu hình đã lưu trong máy trước, nên sau khi sửa file hãy mở **⚙️ Cấu hình JSON → ↺ Mặc định → ✅ Áp dụng** để 3 màn mới hiện ra trong menu.