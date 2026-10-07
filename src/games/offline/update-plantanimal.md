# Thêm cây bắn đạn: Đậu Hà Lan, Đậu Lửa, Đậu Bắn Tỉa

Gói này áp dụng lên đúng file HTML bạn vừa gửi (bản đã có Tam Thủ Súng và Liên Hồi). Logic cũ giữ nguyên, chỉ thêm các trường mới cho đạn.

| Cây | Giá | Đạn | Đặc điểm |
|---|---|---|---|
| 🫛 Đậu Hà Lan | 100 | hạt đậu tròn | Cây bắn cổ điển, bền hơn Súp Lơ (100 máu) |
| 🔥 Đậu Lửa | 225 | cầu lửa nhấp nháy | Sát thương 40, gấp đôi hạt thường |
| 🎯 Đậu Bắn Tỉa | 250 | tia đạn dài, bay rất nhanh | Sát thương 160, xuyên 3 quái, bắn mỗi 4 giây, có tia laser đỏ ngắm trước khi bắn và giật nhẹ màn hình |

Cả ba cây đều vẽ bằng SVG, quay mặt sang phải.

---

## A. CSS: tìm và thay

- Tìm: `#toast,#hint{border-radius:16px;box-shadow:0 6px 16px rgba(0,0,0,.4)}`
- Thay:
```css
#toast,#hint{border-radius:16px;box-shadow:0 6px 16px rgba(0,0,0,.4)}
  .packet .pe img{width:32px;height:32px;margin-top:1px;filter:drop-shadow(0 2px 1px rgba(0,0,0,.35))}
```

---

## B. Module: tìm `const SVG_IMAGES = {};` rồi thay bằng khối dưới (khối này nằm ngay trước dòng đó)

```js
/* ===== Cây bắn đạn: SVG (quay mặt phải) + sprite đạn dựng sẵn ===== */
const peaSvg = (head, extra = '', bl = 30) => svgWrap(`<ellipse cx="44" cy="94" rx="24" ry="4" fill="#000" opacity=".2"/>
<path d="M40 92V62" stroke="#2f7a2a" stroke-width="8" stroke-linecap="round"/>
<path d="M40 84q-24-2-30-22 18-2 30 22zM40 80q20 0 28-18-18-4-28 18z" fill="#4fb43a" stroke="#1f4d1a" stroke-width="3" stroke-linejoin="round"/>
<rect x="56" y="33" width="${bl}" height="18" rx="9" fill="${head}" stroke="#1f4d1a" stroke-width="3"/>
<ellipse cx="${56 + bl - 3}" cy="42" rx="4" ry="7" fill="#1f3d18" stroke="#1f4d1a" stroke-width="2"/>
<circle cx="38" cy="42" r="25" fill="${head}" stroke="#1f4d1a" stroke-width="3"/>
<path d="M20 34q6-12 18-12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>
<circle cx="44" cy="42" r="8" fill="#fff" stroke="#1f4d1a" stroke-width="2"/><circle cx="47" cy="42" r="4" fill="#1a1a1a"/>${extra}`);
Object.assign(SVG_SPRITES, {
  peashooter: peaSvg('#7fd45a'),
  firepea: peaSvg('#f0632a', '<path d="M24 22q-6-14 4-22 0 9 7 9 0-8 6-9 4 12-2 22z" fill="#ffd23a" stroke="#c4380f" stroke-width="2.5" stroke-linejoin="round"/>'),
  sniper: peaSvg('#4a7a3a', '<path d="M13 38q0-26 25-26t25 26z" fill="#5a6b3a" stroke="#2a1a10" stroke-width="3"/><path d="M16 30h44" stroke="#3a4a24" stroke-width="3"/><rect x="64" y="24" width="20" height="8" rx="3" fill="#2a2a2a" stroke="#000" stroke-width="2"/><circle cx="84" cy="28" r="4" fill="#ff3a3a" stroke="#000" stroke-width="1.5"/>', 40)
});
function plantImg(id, d) { const im = svgImage(id); return im ? `<img alt="" src="${im.src}">` : d.icon; }
const BX = (() => {
  const mk = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return c; };
  const pea = mk(20, 20, (g, w) => { const r = w / 2, gr = g.createRadialGradient(r - 3, r - 3, 1, r, r, r); gr.addColorStop(0, '#eaffc8'); gr.addColorStop(.55, '#78d24a'); gr.addColorStop(1, '#2f8a24'); g.fillStyle = gr; g.beginPath(); g.arc(r, r, r - 1, 0, 6.283); g.fill(); g.strokeStyle = '#1f5a18'; g.lineWidth = 1.5; g.stroke(); });
  const fire = mk(28, 28, (g, w) => { const r = w / 2, gr = g.createRadialGradient(r, r, 1, r, r, r); gr.addColorStop(0, '#fff6c0'); gr.addColorStop(.4, '#ffb030'); gr.addColorStop(.75, '#ff4a1a'); gr.addColorStop(1, 'rgba(255,60,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  const snipe = mk(64, 10, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,240,150,0)'); gr.addColorStop(.7, 'rgba(255,230,120,.85)'); gr.addColorStop(1, '#fff'); g.fillStyle = gr; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w - 8, h / 2 - 3); g.lineTo(w, h / 2); g.lineTo(w - 8, h / 2 + 3); g.closePath(); g.fill(); });
  return { pea, fire, snipe };
})();
const SVG_IMAGES = {};
```

---

## C. Tìm và thay

**C1. Icon dự phòng**
- Tìm: `threepeater: '🪻' };`
- Thay: `threepeater: '🪻', peashooter: '🫛', firepea: '🔥', sniper: '🎯' };`

**C2. Đạn có kiểu, tốc độ và khả năng xuyên (tìm trong khối `G.timers`)**
- Tìm: `style: d.slow ? 'ice' :`
- Thay: `pierce: d.pierce || 0, spd: d.bspeed || 5.5, style: d.bullet ? d.bullet : d.slow ? 'ice' :`

**C3. Quái có mã riêng để đạn xuyên không đánh trúng một con hai lần**
- Tìm: `G.monsters.push({ id, d, row, u:`
- Thay: `G.monsters.push({ uid: Math.random(), id, d, row, u:`

**C4. Tốc độ đạn, bỏ qua quái đã bị xuyên, và xử lý xuyên (3 chỗ trong vòng lặp đạn)**
- Tìm: `b.u += 5.5 * dt;`
- Thay: `b.u += (b.spd || 5.5) * dt;`
- Tìm: `if (m.row !== b.row || m.dying) continue;`
- Thay: `if (m.row !== b.row || m.dying || (b.hits && b.hits.includes(m.uid))) continue;`
- Tìm: `sfx.hit(); G.bullets.splice(i, 1); }`
- Thay: `sfx.hit(); if (b.pierce > 0) { b.pierce--; (b.hits = b.hits || []).push(tg.uid); } else G.bullets.splice(i, 1); }`

**C5. Giật màn hình và tia lửa nòng khi bắn tỉa**
- Tìm: `sfx.shoot();`
- Thay: `sfx.shoot(); if (d.bullet === 'snipe') { G.shake = Math.max(G.shake, 2.5); G.fx.push({ k: 'r', x: px(p.col + .95), y: py(p.row + .42), rad: cw * .35, life: .25, max: .25, c: '#ffe08a' }); }`

**C6. Vẽ cây bằng SVG và tia laser ngắm của Đậu Bắn Tỉa**
- Tìm: `emoji(d.icon, x, y + dy - s * .04, s, Object.assign({ rot, sx, sy }, o));`
- Thay:
```js
drawMonsterSprite(p.id, d.icon, x, y + dy - s * .04, s, Object.assign({ rot, sx, sy }, o));
  if (d.bullet === 'snipe' && p.cdT < 1 && G.monsters.some(m => m.row === p.row && !m.dying && m.u > p.col + .4 && m.u < COLS + .6)) {
    ctx.save(); ctx.strokeStyle = `rgba(255,50,50,${.35 + .4 * Math.abs(Math.sin(T * 18))})`; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(x + s * .42, y - ch * .12); ctx.lineTo(px(COLS + .5), y - ch * .12); ctx.stroke(); ctx.restore();
  }
```

**C7. Vẽ 3 loại đạn mới (Tam Thủ Súng cũng dùng hạt đậu mới)**
- Tìm: `} else if (b.style === 'spike') {`
- Thay:
```js
} else if (b.style === 'pea') { ctx.drawImage(BX.pea, x - 8, y - 8, 16, 16);
  } else if (b.style === 'fire') { const fs = 26 + Math.sin(T * 30 + b.u * 5) * 3; ctx.drawImage(BX.fire, x - fs / 2, y - fs / 2, fs, fs);
  } else if (b.style === 'snipe') { ctx.drawImage(BX.snipe, x - 50, y - 5, 64, 10);
  } else if (b.style === 'spike') {
```

**C8. Gói hạt và bóng cây hiện SVG**
- Tìm: `<span class="pe">${d.icon}</span>`
- Thay: `<span class="pe">${plantImg(id, d)}</span>`
- Tìm (thay **tất cả**, có 2 chỗ): `emoji(CFG.plants[G.sel].icon,`
- Thay: `drawMonsterSprite(G.sel, CFG.plants[G.sel].icon,`

---

## D. JSON cấu hình

**D1. Trong `"plants"`, thêm sau `"garlic"` (nhớ dấu phẩy):**
```json
"peashooter": {"name": "Đậu Hà Lan",    "kind": "shooter", "cost": 100, "hp": 100, "cooldown": 5,  "damage": 20,  "every": 1.5, "shots": 1, "bullet": "pea"},
"firepea":    {"name": "Đậu Lửa",       "kind": "shooter", "cost": 225, "hp": 80,  "cooldown": 8,  "damage": 40,  "every": 1.5, "shots": 1, "bullet": "fire"},
"sniper":     {"name": "Đậu Bắn Tỉa",   "kind": "shooter", "cost": 250, "hp": 80,  "cooldown": 10, "damage": 160, "every": 4,   "shots": 1, "bullet": "snipe", "bspeed": 18, "pierce": 2}
```

**D2. Đưa cây mới vào các màn**
- Tìm: `"plants": ["sunflower", "shooter"],`
- Thay: `"plants": ["sunflower", "shooter", "peashooter"],`
- Tìm (thay **tất cả**, màn 4 và 5): `"plants": ["sunflower", "shooter", "wall", "bomb", "ice", "mine", "repeater", "chili"],`
- Thay: `"plants": ["sunflower", "shooter", "wall", "bomb", "ice", "mine", "repeater", "chili", "peashooter", "sniper"],`
- Tìm (thay **tất cả**, màn 6, 7 và 8): `"gatling", "threepeater"]`
- Thay: `"gatling", "threepeater", "peashooter", "firepea", "sniper"]`

**Lưu ý:** Cấu hình đã lưu trong máy được ưu tiên hơn bản trong file, nên sau khi sửa hãy mở **⚙️ Cấu hình JSON → ↺ Mặc định → ✅ Áp dụng**.