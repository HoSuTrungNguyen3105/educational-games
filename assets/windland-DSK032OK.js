var e=`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
<meta charset="UTF-8">\r
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\r
<title>Vùng Đất Gió · Open World Demo</title>\r
<link rel="preconnect" href="https://fonts.googleapis.com">\r
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet">\r
<style>\r
:root{--gold:#f4b942;--ink:#1d2e4a;--panel:rgba(18,22,32,.5);color-scheme:dark}\r
*{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-user-select:none;touch-action:none;\r
  font-family:var(--body,"Be Vietnam Pro","Segoe UI",system-ui,sans-serif)}\r
html,body{height:100%;overflow:hidden;background:#000;color:#fff}\r
canvas#w{position:fixed;inset:0;width:100%;height:100%}\r
.vig{position:fixed;inset:0;pointer-events:none;z-index:4;background:radial-gradient(circle,transparent 55%,rgba(0,0,0,.4) 100%)}\r
.hud{position:fixed;z-index:5;text-shadow:0 1px 3px rgba(0,0,0,.85)}\r
\r
/* ---- Trái trên: minimap + nhiệm vụ ---- */\r
.ui-left{top:calc(env(safe-area-inset-top,0px) + 16px);left:calc(env(safe-area-inset-left,0px) + 16px)}\r
.mini{position:relative;width:112px;height:112px}\r
.mini canvas{width:112px;height:112px;border-radius:50%;border:3px solid var(--ink,#1d2e4a);\r
  box-shadow:3px 3px 0 var(--ink,#1d2e4a),inset 0 0 14px rgba(0,0,0,.3)}\r
.compass{position:absolute;top:-12px;left:50%;transform:translateX(-50%);width:24px;height:24px;border-radius:50%;\r
  background:var(--card,#fffbf2);border:2px solid var(--ink,#1d2e4a);color:var(--ink,#1d2e4a);display:grid;place-items:center;font-size:11px}\r
.lvbadge{position:absolute;left:-6px;top:-6px;background:var(--gold);color:var(--ink,#1d2e4a);font-size:11px;font-weight:700;\r
  border:2px solid var(--ink,#1d2e4a);border-radius:9px;padding:0 6px;text-shadow:none}\r
.clock{margin-top:6px;width:112px;text-align:center;font-size:12px;opacity:.9}\r
.quest{margin-top:12px;max-width:240px;background:var(--card,#fffbf2);border:2.5px solid var(--ink,#1d2e4a);border-left:5px solid var(--gold);border-radius:14px;box-shadow:3px 3px 0 var(--ink,#1d2e4a);color:var(--ink,#1d2e4a);text-shadow:none;padding:8px 12px 8px 10px}\r
.quest b{display:block;font-size:14px;font-weight:600;line-height:1.3;margin-bottom:3px}\r
.quest span{font-size:12px;color:var(--tomato,#e4572e)}\r
\r
/* ---- Phải: đội hình ---- */\r
.party{right:calc(env(safe-area-inset-right,0px) + 14px);top:22%;display:flex;flex-direction:column;gap:10px;align-items:flex-end}\r
.pm{position:relative;width:54px;height:54px;border-radius:50%;border:2px solid rgba(255,255,255,.55);display:grid;place-items:center;\r
  font-weight:700;font-size:18px;opacity:.75;cursor:pointer;transition:all .15s;overflow:hidden}\r
.pm.on{width:64px;height:64px;border-color:var(--gold);opacity:1;box-shadow:0 0 14px rgba(255,217,102,.55)}\r
.pm.dead{filter:grayscale(1) brightness(.5)}\r
.pm em{position:absolute;left:4px;top:2px;font-size:10px;font-style:normal;opacity:.9}\r
.pm i{position:absolute;left:0;bottom:0;height:5px;background:#9be84a;width:100%}\r
\r
/* ---- Dưới giữa: HP ---- */\r
.ui-bottom{left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 18px);\r
  display:flex;flex-direction:column;align-items:center;gap:4px}\r
.lvrow{font-size:13px;font-weight:600;display:flex;gap:8px}\r
.lvrow .ex{color:#8bd94a}\r
.hpbar{width:min(320px,52vw);height:10px;border-radius:8px;background:var(--card,#fffbf2);border:2px solid var(--ink,#1d2e4a);overflow:hidden}\r
.hpfill{height:100%;background:linear-gradient(90deg,#a6e93a,#76ff03);box-shadow:0 0 8px rgba(118,255,3,.7);transition:width .15s}\r
.charname{font-size:12px;opacity:.9}\r
\r
/* ---- Phải dưới: kỹ năng ---- */\r
.skills{right:calc(env(safe-area-inset-right,0px) + 18px);bottom:calc(env(safe-area-inset-bottom,0px) + 18px);display:flex;align-items:flex-end;gap:12px}\r
.sk{position:relative;width:54px;height:54px;border-radius:50%;background:rgba(20,22,30,.45);border:2px solid rgba(255,255,255,.6);\r
  display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(4px)}\r
.sk svg{width:26px;height:26px;fill:#fff;position:relative;z-index:1}\r
.sk.q::before{content:'';position:absolute;inset:5px;border-radius:50%;background:rgba(20,24,34,.88)}\r
.sk.big{width:76px;height:76px;border-color:#fff}.sk.big svg{width:34px;height:34px}\r
.sk.run{width:44px;height:44px;align-self:flex-start}.sk.run svg{width:20px;height:20px}\r
.sk .key{position:absolute;right:-2px;bottom:-4px;font-size:10px;background:var(--ink,#1d2e4a);border-radius:6px;padding:0 4px;z-index:2}\r
.sk .cd{position:absolute;inset:0;border-radius:50%;display:grid;place-items:center;font-size:16px;font-weight:700;z-index:2;pointer-events:none}\r
.sk.ready{animation:glow 1s infinite alternate}\r
@keyframes glow{to{box-shadow:0 0 16px 4px var(--gc,#fff)}}\r
.stam{position:fixed;z-index:5;right:calc(env(safe-area-inset-right,0px) + 20px);bottom:calc(env(safe-area-inset-bottom,0px) + 104px);\r
  width:96px;height:4px;border-radius:3px;background:var(--card,#fffbf2);border:1px solid var(--ink,#1d2e4a);overflow:hidden}\r
.stam div{height:100%;background:#ffe14d}\r
.uid{position:fixed;z-index:5;right:10px;bottom:3px;font-size:10px;opacity:.7}\r
\r
/* ---- Cần điều khiển cảm ứng ---- */\r
.joy{display:none;left:calc(env(safe-area-inset-left,0px) + 26px);bottom:calc(env(safe-area-inset-bottom,0px) + 30px);\r
  width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.12);border:2px solid rgba(255,255,255,.4)}\r
.joy i{position:absolute;left:35px;top:35px;width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,.55)}\r
@media (pointer:coarse){.joy{display:block}.ui-bottom{bottom:calc(env(safe-area-inset-bottom,0px) + 160px)}}\r
\r
/* ---- Thông báo ---- */\r
.toast{position:fixed;z-index:6;top:18%;left:50%;transform:translateX(-50%);text-align:center;pointer-events:none;opacity:0}\r
.toast.show{animation:toast 3s}\r
.toast b{display:block;font-size:clamp(20px,3.4vw,34px);letter-spacing:2px;font-weight:300;text-shadow:0 2px 10px #000}\r
.toast span{font-size:13px;color:var(--gold)}\r
.toast::after{content:'';display:block;width:min(320px,60vw);height:1px;margin:8px auto 0;background:linear-gradient(90deg,transparent,#fff,transparent)}\r
@keyframes toast{0%{opacity:0;transform:translate(-50%,10px)}12%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}\r
.pause{position:fixed;inset:0;z-index:9;display:none;place-items:center;background:rgba(29,46,74,.6);font-family:var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);font-size:26px;letter-spacing:3px}\r
.pause.on{display:grid}\r
.help{left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 10px);font-size:11px;white-space:nowrap;background:var(--card,#fffbf2);color:var(--ink,#1d2e4a);border:2px solid var(--ink,#1d2e4a);border-radius:99px;padding:3px 10px;box-shadow:2px 2px 0 var(--ink,#1d2e4a);text-shadow:none}\r
@media (max-width:720px){.help{display:none}}\r
</style>\r
</head>\r
<body>\r
<canvas id="w"></canvas>\r
<div class="vig"></div>\r
\r
<div class="hud ui-left">\r
  <div class="mini"><div class="compass">N</div><canvas id="mm" width="224" height="224"></canvas><div class="lvbadge" id="badge">Lv2</div></div>\r
  <div class="clock" id="clock">☀ 10:30</div>\r
  <div class="quest"><b id="qt"></b><span id="qd"></span></div>\r
</div>\r
\r
<div class="hud help">WASD di chuyển · Shift chạy · Chuột/J/Space chém · E kỹ năng · Q tuyệt kỹ · 1–4 đổi nhân vật · P tạm dừng</div>\r
\r
<div class="hud party" id="party"></div>\r
\r
<div class="hud ui-bottom">\r
  <div class="charname" id="cname"></div>\r
  <div class="lvrow"><span id="lv">Lv. 2</span><span class="ex" id="ex">327 / 987</span></div>\r
  <div class="hpbar"><div class="hpfill" id="hp"></div></div>\r
</div>\r
\r
<div class="stam"><div id="stam"></div></div>\r
<div class="hud skills">\r
  <div class="sk run" id="bRun"><svg viewBox="0 0 24 24"><path d="M13 2 6 14h5l-1 8 8-13h-5z"/></svg><span class="key">⇧</span></div>\r
  <div class="sk" id="bE"><svg viewBox="0 0 24 24"><path d="M12 2C7 6 4 10 4 14a8 8 0 0 0 16 0c0-4-3-8-8-12z"/></svg><div class="cd" id="cdE"></div><span class="key">E</span></div>\r
  <div class="sk q" id="bQ"><svg viewBox="0 0 24 24"><path d="m12 2 2.6 6.4L21 9l-5 4.4L17.5 20 12 16.6 6.5 20 8 13.4 3 9l6.4-.6z"/></svg><div class="cd" id="cdQ"></div><span class="key">Q</span></div>\r
  <div class="sk big" id="bA"><svg viewBox="0 0 24 24"><path d="M6 2l14 14-3 3L3 5l3-3zM14 14l6 6-2 2-6-6z"/></svg><span class="key">J</span></div>\r
</div>\r
<div class="hud joy" id="joy"><i id="knob"></i></div>\r
<div class="uid">UID: 000 128 457</div>\r
\r
<div class="toast" id="toast"><b></b><span></span></div>\r
<div class="pause" id="pause">TẠM DỪNG · nhấn P</div>\r
\r
<script>\r
/* ===================== TIỆN ÍCH ===================== */\r
const $=id=>document.getElementById(id);\r
const TAU=Math.PI*2, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rnd=(a,b)=>a+Math.random()*(b-a);\r
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};\r
const R=mulberry(2024);\r
const cv=$('w'),g=cv.getContext('2d'),mm=$('mm'),mg=mm.getContext('2d');\r
let W,H,Z=1;\r
function resize(){const d=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0);Z=clamp(H/620,.85,1.5)}\r
addEventListener('resize',resize);resize();\r
const ell=(x,y,rx,ry)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill()};\r
const circ=(x,y,r)=>{g.beginPath();g.arc(x,y,r,0,TAU);g.fill()};\r
const rr=(x,y,w,h,r)=>{g.beginPath();g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h);g.fill()};\r
\r
/* ===================== THẾ GIỚI ===================== */\r
const WORLD=2400;\r
const riverX=y=>1000+Math.sin(y*.0035)*170+Math.sin(y*.011)*40;\r
const isWater=(x,y)=>Math.abs(x-riverX(y))<38&&!(y>1250&&y<1350);\r
const TOWN={x:1780,y:520}, MILL={x:1940,y:400}, START={x:420,y:1800};\r
const houses=[{x:1640,y:400,w:110,h:70,r:'#c0503f'},{x:1640,y:610,w:110,h:70,r:'#3f78c0'},\r
  {x:1860,y:620,w:120,h:70,r:'#c0503f'},{x:1790,y:330,w:100,h:64,r:'#6a8f3a'},{x:2040,y:540,w:90,h:64,r:'#3f78c0'}];\r
const obs=[],trees=[],rocks=[];\r
houses.forEach(h=>{for(let x=h.x+16;x<h.x+h.w;x+=28)obs.push({x,y:h.y+h.h*.5,r:26})});\r
obs.push({x:TOWN.x,y:TOWN.y,r:34},{x:MILL.x,y:MILL.y+30,r:26});\r
let bg;\r
function buildBG(){\r
  bg=document.createElement('canvas');bg.width=bg.height=WORLD;const b=bg.getContext('2d');\r
  for(let y=0;y<WORLD;y+=30)for(let x=0;x<WORLD;x+=30){\r
    const v=Math.sin(x*.004+1)+Math.cos(y*.005)+Math.sin((x+y)*.0023);\r
    b.fillStyle=\`hsl(\${96+v*7},\${46+v*4}%,\${43+v*4}%)\`;b.fillRect(x,y,31,31);\r
  }\r
  for(let i=0;i<260;i++){\r
    const x=R()*WORLD,y=R()*WORLD,r=40+R()*90,c=R()<.5?'255,255,170':'30,90,40';\r
    const gr=b.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,\`rgba(\${c},.12)\`);gr.addColorStop(1,\`rgba(\${c},0)\`);\r
    b.fillStyle=gr;b.fillRect(x-r,y-r,r*2,r*2);\r
  }\r
  b.lineCap=b.lineJoin='round';\r
  const P=[[START.x,START.y],[700,1500],[riverX(1300),1300],[1300,950],[TOWN.x,TOWN.y]];\r
  [[56,'#a98f5c'],[46,'#d2c08e']].forEach(([w,c])=>{b.beginPath();P.forEach((p,i)=>i?b.lineTo(p[0],p[1]):b.moveTo(p[0],p[1]));b.lineWidth=w;b.strokeStyle=c;b.stroke()});\r
  const river=(w,c)=>{b.beginPath();for(let y=-20;y<=WORLD+20;y+=20)y<0?b.moveTo(riverX(y),y):b.lineTo(riverX(y),y);b.lineWidth=w;b.strokeStyle=c;b.stroke()};\r
  river(104,'#b9a46c');river(88,'#5fb6dc');river(60,'#7fcbe8');river(22,'rgba(255,255,255,.28)');\r
  const bx=riverX(1300);b.fillStyle='#8a5d33';b.fillRect(bx-62,1250,124,100);\r
  b.fillStyle='#b27c47';for(let y=1252;y<1350;y+=10)b.fillRect(bx-62,y,124,8);\r
  b.fillStyle='#5b3a1c';b.fillRect(bx-66,1246,6,108);b.fillRect(bx+60,1246,6,108);\r
  b.fillStyle='#d9d2bd';b.beginPath();b.arc(TOWN.x,TOWN.y,150,0,TAU);b.fill();\r
  b.strokeStyle='#bdb59c';b.lineWidth=6;for(let r=40;r<150;r+=36){b.beginPath();b.arc(TOWN.x,TOWN.y,r,0,TAU);b.stroke()}\r
  b.fillStyle='#a79f86';b.beginPath();b.arc(TOWN.x,TOWN.y,36,0,TAU);b.fill();\r
  b.fillStyle='#6fc5ea';b.beginPath();b.arc(TOWN.x,TOWN.y,28,0,TAU);b.fill();\r
  b.fillStyle='rgba(255,255,255,.5)';b.beginPath();b.arc(TOWN.x-8,TOWN.y-8,9,0,TAU);b.fill();\r
  houses.forEach(h=>{\r
    b.fillStyle='rgba(0,0,0,.2)';b.fillRect(h.x+6,h.y+h.h-4,h.w,12);\r
    b.fillStyle='#efe3c4';b.fillRect(h.x,h.y,h.w,h.h);\r
    b.fillStyle='#8a6a3a';b.fillRect(h.x+h.w/2-9,h.y+h.h-30,18,30);\r
    b.fillStyle='#9fd3ee';b.fillRect(h.x+10,h.y+16,18,16);b.fillRect(h.x+h.w-28,h.y+16,18,16);\r
    b.fillStyle=h.r;b.beginPath();b.moveTo(h.x-8,h.y+4);b.lineTo(h.x+h.w/2,h.y-h.h*.55);b.lineTo(h.x+h.w+8,h.y+4);b.closePath();b.fill();\r
    b.strokeStyle='rgba(0,0,0,.25)';b.lineWidth=2;b.stroke();\r
  });\r
  for(let i=0;i<1600;i++){\r
    const x=R()*WORLD,y=R()*WORLD;if(isWater(x,y))continue;\r
    b.fillStyle=['#fff','#ffd93b','#ff8fb3','#b9a3ff'][(R()*4)|0];\r
    b.beginPath();b.arc(x,y,1.8,0,TAU);b.fill();\r
    b.strokeStyle='rgba(40,110,40,.6)';b.lineWidth=1.3;b.beginPath();b.moveTo(x,y);b.lineTo(x-2,y+6);b.stroke();\r
  }\r
  for(let i=0;i<340;i++){\r
    const x=40+R()*(WORLD-80),y=40+R()*(WORLD-80);\r
    if(Math.abs(x-riverX(y))<70||Math.hypot(x-TOWN.x,y-TOWN.y)<250||Math.hypot(x-START.x,y-START.y)<110)continue;\r
    if(R()<.82){trees.push({x,y,s:.8+R()*.7});obs.push({x,y:y+4,r:11})}\r
    else{rocks.push({x,y,s:.8+R()*1.1});obs.push({x,y,r:11*(.8+R()*.3)})}\r
  }\r
}\r
function collide(e,r){\r
  for(const o of obs){\r
    const dx=e.x-o.x,dy=e.y-o.y,m=r+o.r,d2=dx*dx+dy*dy;\r
    if(d2<m*m&&d2>.01){const d=Math.sqrt(d2);e.x=o.x+dx/d*m;e.y=o.y+dy/d*m}\r
  }\r
}\r
\r
/* ===================== NHÂN VẬT (nhân vật gốc, không thuộc IP nào) ===================== */\r
const CH=[\r
  {n:'Lam · Phong',hair:'#35c6a6',cloth:'#f4f7f2',trim:'#2a9d8a',fx:'#8cf5d8',col:'#3fd0b0'},\r
  {n:'Vy · Hỏa',hair:'#ff6a3d',cloth:'#3a2c30',trim:'#e8503a',fx:'#ffb27a',col:'#ff7a4d'},\r
  {n:'Nguyệt · Thủy',hair:'#4a8bff',cloth:'#eaf2ff',trim:'#2f6fe0',fx:'#9fd0ff',col:'#4aa3ff'},\r
  {n:'Sương · Băng',hair:'#d7f1ff',cloth:'#5b6b92',trim:'#9ad8ff',fx:'#e3f6ff',col:'#bfe9ff'}\r
];\r
let lvl=2,exp=327,kills=0,cur=0,T=0,hour=10.5,shake=0,flash=0,paused=false;\r
const needExp=()=>lvl*300+387, maxHp=()=>900+lvl*100;\r
const p={x:START.x,y:START.y,ang:0,mv:false,inv:0,stam:100,exh:false,stamT:0,energy:30,cdE:0,cdQ:0,swing:0,atkCd:0,combo:0,comboT:0,swCd:0};\r
CH.forEach((c,i)=>c.hp=maxHp()*(i?1:.78));\r
let en=[],fx=[],parts=[],texts=[];\r
\r
/* ===================== HIỆU ỨNG ===================== */\r
function burst(x,y,c,n,sp=140){for(let i=0;i<n;i++){const a=rnd(0,TAU),v=sp*rnd(.3,1);\r
  parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:rnd(.3,.7),m:.7,c,s:rnd(1.5,3.5)})}}\r
function text(x,y,t,c='#fff',s=15){texts.push({x,y,t,c,s,l:.9})}\r
let toastT;\r
function toast(a,b=''){const e=$('toast');e.firstElementChild.textContent=a;e.lastElementChild.textContent=b;\r
  e.classList.remove('show');void e.offsetWidth;e.classList.add('show')}\r
\r
/* ===================== KẺ ĐỊCH: GELATIN ===================== */\r
function spawnEn(anywhere){\r
  for(let i=0;i<30;i++){\r
    const a=rnd(0,TAU),d=anywhere?rnd(300,1600):rnd(450,900);\r
    const x=anywhere?rnd(80,WORLD-80):p.x+Math.cos(a)*d, y=anywhere?rnd(80,WORLD-80):p.y+Math.sin(a)*d;\r
    if(x<60||y<60||x>WORLD-60||y>WORLD-60||isWater(x,y)||Math.hypot(x-TOWN.x,y-TOWN.y)<190||Math.hypot(x-p.x,y-p.y)<400)continue;\r
    const el=(Math.random()*4)|0;\r
    en.push({x,y,el,hp:50+lvl*18,max:50+lvl*18,r:15,hit:0,kx:0,ky:0,wob:rnd(0,6),atk:0,slow:0,burn:0,dir:rnd(0,TAU),dirT:rnd(1,3)});return;\r
  }\r
}\r
function hitEnemy(e,dmg,o={}){\r
  const crit=Math.random()<.15;if(crit)dmg*=1.8;dmg=Math.round(dmg);\r
  e.hp-=dmg;e.hit=.14;\r
  const a=Math.atan2(e.y-p.y,e.x-p.x),kb=o.kb||110;e.kx+=Math.cos(a)*kb;e.ky+=Math.sin(a)*kb;\r
  if(o.burn)e.burn=3;if(o.slow)e.slow=3;\r
  text(e.x,e.y-20,dmg,crit?'#ffd23b':CH[o.el!=null?o.el:cur].fx,crit?20:15);\r
  burst(e.x,e.y,CH[e.el].col,6,90);\r
  if(o.energy!==false)p.energy=Math.min(100,p.energy+4);\r
  if(e.hp<=0)killEnemy(e);\r
}\r
function killEnemy(e){\r
  if(e.dead)return;e.dead=true;kills++;\r
  burst(e.x,e.y,CH[e.el].col,22,170);\r
  const gain=40+lvl*5;text(e.x,e.y-34,'+'+gain+' EXP','#8bd94a',13);addExp(gain);\r
}\r
function addExp(n){\r
  exp+=n;\r
  while(exp>=needExp()){exp-=needExp();lvl++;CH.forEach(c=>c.hp=Math.min(maxHp(),c.hp+maxHp()*.3));\r
    toast('Lên cấp '+lvl,'Máu tối đa tăng, hồi phục 30% cho cả đội');fx.push({k:'ring',x:p.x,y:p.y,R:160,t:.8,m:.8,c:'#ffd966'})}\r
}\r
\r
/* ===================== HÀNH ĐỘNG CỦA NGƯỜI CHƠI ===================== */\r
function hurt(d){\r
  if(p.inv>0)return;const c=CH[cur];\r
  c.hp-=d;p.inv=.75;shake=Math.max(shake,7);text(p.x,p.y-34,Math.round(d),'#ff6a6a',17);burst(p.x,p.y,'#ff8a8a',8,100);\r
  if(c.hp<=0){c.hp=0;const nx=CH.findIndex(x=>x.hp>0);\r
    if(nx<0){toast('Toàn đội gục ngã','Hồi sinh tại điểm xuất phát');Object.assign(p,{x:START.x,y:START.y});CH.forEach(x=>x.hp=maxHp()*.5);cur=0}\r
    else{cur=nx;toast(CH[nx].n,'Tiếp quản đội hình')}}\r
}\r
function attack(){\r
  if(p.atkCd>0||CH[cur].hp<=0)return;\r
  p.combo=p.comboT>0?(p.combo+1)%3:0;p.comboT=.9;p.atkCd=.34;p.swing=1;\r
  const c=CH[cur];\r
  fx.push({k:'slash',x:p.x,y:p.y,a:p.ang,t:.22,m:.22,c:c.fx,w:p.combo==2?16:10});\r
  const base=(14+lvl*3)*(1+p.combo*.3);\r
  for(const e of en){\r
    const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>78+e.r)continue;\r
    let da=Math.abs(((Math.atan2(dy,dx)-p.ang+Math.PI*3)%TAU)-Math.PI);if(da>1.15)continue;\r
    hitEnemy(e,base*rnd(.9,1.1),{kb:p.combo==2?220:110});\r
  }\r
}\r
function skillE(){\r
  if(p.cdE>0||CH[cur].hp<=0)return;p.cdE=6;p.energy=Math.min(100,p.energy+12);\r
  const c=CH[cur],Rr=130;fx.push({k:'ring',x:p.x,y:p.y,R:Rr,t:.5,m:.5,c:c.fx});burst(p.x,p.y,c.fx,28,200);\r
  for(const e of en)if(Math.hypot(e.x-p.x,e.y-p.y)<Rr+e.r)\r
    hitEnemy(e,(26+lvl*4)*(cur==1?1.6:1),{kb:cur==0?330:130,burn:cur==1,slow:cur==3,energy:false});\r
  if(cur==2){c.hp=Math.min(maxHp(),c.hp+maxHp()*.1);text(p.x,p.y-40,'+Hồi máu','#9be84a',14)}\r
}\r
function skillQ(){\r
  if(p.cdQ>0||p.energy<70||CH[cur].hp<=0)return;p.cdQ=14;p.energy=0;shake=14;flash=.5;\r
  const c=CH[cur];\r
  fx.push({k:'ring',x:p.x,y:p.y,R:260,t:.8,m:.8,c:c.fx},{k:'ring',x:p.x,y:p.y,R:170,t:.6,m:.6,c:'#fff'});burst(p.x,p.y,c.fx,60,320);\r
  for(const e of en)if(Math.hypot(e.x-p.x,e.y-p.y)<240+e.r)hitEnemy(e,(100+lvl*10)*rnd(.95,1.05),{kb:300,energy:false,burn:cur==1,slow:cur==3});\r
  toast(c.n.split(' · ')[0]+' · Tuyệt kỹ','');\r
}\r
function switchTo(i){\r
  if(i===cur||CH[i].hp<=0||p.swCd>0)return;p.swCd=1;cur=i;\r
  fx.push({k:'ring',x:p.x,y:p.y,R:80,t:.4,m:.4,c:CH[i].fx});burst(p.x,p.y,CH[i].fx,20,160);\r
}\r
\r
/* ===================== NHIỆM VỤ ===================== */\r
let qi=0,qbase=0;\r
const near=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);\r
function nearestEn(){let b=null,bd=1e9;for(const e of en){const d=near(e,p);if(d<bd){bd=d;b=e}}return b}\r
const QUESTS=[\r
  {t:'Tiến về Thị trấn Gió Lặng',tgt:()=>TOWN,ok:()=>near(p,TOWN)<150},\r
  {t:'Hạ gục 6 Gelatin quanh thị trấn',tgt:nearestEn,ok:()=>kills-qbase>=6,prog:()=>Math.min(6,kills-qbase)+' / 6'},\r
  {t:'Leo lên cối xay gió phía đông',tgt:()=>MILL,ok:()=>near(p,MILL)<90},\r
  {t:'Tự do khám phá Vùng Đất Gió',tgt:()=>null,ok:()=>false}\r
];\r
function questTick(){\r
  const q=QUESTS[qi];\r
  if(q.ok()){addExp(150);toast('Hoàn thành nhiệm vụ',q.t);qi++;qbase=kills;saveRun()}\r
  const n=QUESTS[qi],t=n.tgt();$('qt').textContent=n.t;\r
  $('qd').textContent=n.prog?n.prog():(t?'◆ '+Math.round(near(p,t)/10)+' m':'');\r
}\r
\r
/* ===================== ĐIỀU KHIỂN ===================== */\r
const K={};let joy={x:0,y:0};\r
addEventListener('keydown',e=>{\r
  const k=e.key.toLowerCase();K[k]=true;\r
  if(k=='p'){paused=!paused;$('pause').classList.toggle('on',paused);saveRun()}\r
  if(paused)return;\r
  if(k=='e')skillE();if(k=='q')skillQ();if(k=='j'||k==' '){attack();e.preventDefault()}\r
  if(k>='1'&&k<='4')switchTo(+k-1);\r
});\r
addEventListener('keyup',e=>K[e.key.toLowerCase()]=false);\r
cv.addEventListener('pointerdown',e=>{\r
  if(e.pointerType!=='mouse'||paused)return;\r
  const wx=e.clientX/Z+cam.x,wy=e.clientY/Z+cam.y;p.ang=Math.atan2(wy-p.y,wx-p.x);attack();\r
});\r
const press=(id,fn)=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();if(!paused)fn()});\r
press('bA',attack);press('bE',skillE);press('bQ',skillQ);\r
$('bRun').addEventListener('pointerdown',e=>{e.preventDefault();K.shift=!K.shift});\r
const joyEl=$('joy'),knob=$('knob');let jid=null;\r
function joyMove(e){\r
  const r=joyEl.getBoundingClientRect(),dx=e.clientX-(r.left+60),dy=e.clientY-(r.top+60),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/50);\r
  joy={x:dx/d*k,y:dy/d*k};knob.style.transform=\`translate(\${joy.x*40}px,\${joy.y*40}px)\`;\r
}\r
joyEl.addEventListener('pointerdown',e=>{jid=e.pointerId;joyEl.setPointerCapture(jid);joyMove(e)});\r
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===jid)joyMove(e)});\r
const joyEnd=e=>{if(e.pointerId===jid){jid=null;joy={x:0,y:0};knob.style.transform=''}};\r
joyEl.addEventListener('pointerup',joyEnd);joyEl.addEventListener('pointercancel',joyEnd);\r
\r
/* ===================== CẬP NHẬT ===================== */\r
const cam={x:0,y:0};\r
function update(dt){\r
  T+=dt;hour=(hour+dt*2/60)%24;\r
  p.inv-=dt;p.cdE=Math.max(0,p.cdE-dt);p.cdQ=Math.max(0,p.cdQ-dt);p.atkCd-=dt;p.comboT-=dt;p.swing=Math.max(0,p.swing-dt*4);p.swCd-=dt;\r
  shake=Math.max(0,shake-dt*30);flash=Math.max(0,flash-dt);\r
\r
  let mx=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0)+joy.x, my=(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0)+joy.y;\r
  const len=Math.hypot(mx,my);if(len>1){mx/=len;my/=len}\r
  p.mv=len>.12;\r
  const run=K.shift&&p.mv&&p.stam>0&&!p.exh;\r
  if(run){p.stam=Math.max(0,p.stam-22*dt);p.stamT=.8;if(p.stam<=0)p.exh=true}\r
  else{p.stamT-=dt;if(p.stamT<=0)p.stam=Math.min(100,p.stam+28*dt);if(p.stam>30)p.exh=false}\r
  if(p.mv){\r
    const sp=190*(run?1.65:1)*(isWater(p.x,p.y)?.55:1)*(p.swing>.3?.55:1);\r
    p.x+=mx*sp*dt;p.y+=my*sp*dt;\r
    if(p.swing<=0)p.ang=Math.atan2(my,mx);\r
  }\r
  p.x=clamp(p.x,20,WORLD-20);p.y=clamp(p.y,20,WORLD-20);collide(p,9);\r
\r
  for(const e of en){\r
    e.wob+=dt*6;e.hit-=dt;e.atk-=dt;e.slow-=dt;\r
    if(e.burn>0){e.burn-=dt;e.hp-=8*dt;if(Math.random()<dt*8)parts.push({x:e.x,y:e.y-8,vx:0,vy:-30,t:.4,m:.4,c:'#ff9a3c',s:2.5});if(e.hp<=0)killEnemy(e)}\r
    const d=near(e,p),chase=d<290&&CH[cur].hp>0;\r
    e.dirT-=dt;if(e.dirT<=0){e.dir=rnd(0,TAU);e.dirT=rnd(1.5,3.5)}\r
    const a=chase?Math.atan2(p.y-e.y,p.x-e.x):e.dir,sp=(chase?80:28)*(e.slow>0?.4:1);\r
    const ox=e.x,oy=e.y;\r
    e.x+=Math.cos(a)*sp*dt+e.kx*dt;e.y+=Math.sin(a)*sp*dt+e.ky*dt;e.kx*=.9;e.ky*=.9;\r
    e.x=clamp(e.x,20,WORLD-20);e.y=clamp(e.y,20,WORLD-20);collide(e,e.r*.7);\r
    if(isWater(e.x,e.y)||Math.hypot(e.x-TOWN.x,e.y-TOWN.y)<150){e.x=ox;e.y=oy;e.dirT=0}\r
    if(d<e.r+14&&e.atk<=0){e.atk=1.1;hurt(40+lvl*8)}\r
  }\r
  en=en.filter(e=>!e.dead);\r
  if(en.length<16&&Math.random()<dt*1.2)spawnEn(false);\r
\r
  for(const f of fx)f.t-=dt;fx=fx.filter(f=>f.t>0);\r
  for(const q of parts){q.t-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.95;q.vy*=.95}parts=parts.filter(q=>q.t>0);\r
  for(const t of texts){t.l-=dt;t.y-=28*dt}texts=texts.filter(t=>t.l>0);\r
  if(p.mv&&Math.random()<dt*(run?18:7))parts.push({x:p.x+rnd(-4,4),y:p.y+14,vx:rnd(-10,10),vy:rnd(-12,0),t:.4,m:.4,c:'rgba(210,190,140,.7)',s:2.5});\r
\r
  const tx=clamp(p.x-W/Z/2,0,WORLD-W/Z),ty=clamp(p.y-H/Z/2,0,WORLD-H/Z);\r
  cam.x+=(tx-cam.x)*Math.min(1,dt*8);cam.y+=(ty-cam.y)*Math.min(1,dt*8);\r
  questTick();\r
}\r
\r
/* ===================== VẼ ===================== */\r
function drawTree(t){\r
  const sw=Math.sin(T*1.5+t.x)*1.6;g.save();g.translate(t.x,t.y);g.scale(t.s,t.s);\r
  g.fillStyle='rgba(0,0,0,.22)';ell(4,8,18,6);\r
  g.fillStyle='#6a4326';g.fillRect(-4,-12,8,20);\r
  [['#2f7a2e',-10,-20,16],['#2f7a2e',10,-20,16],['#3d9a3a',0,-32,19],['#58b84d',-4,-38,10]].forEach(([c,x,y,r])=>{g.fillStyle=c;circ(x+sw,y,r)});\r
  g.fillStyle='rgba(255,255,200,.2)';circ(-6+sw,-42,7);g.restore();\r
}\r
function drawRock(r){g.save();g.translate(r.x,r.y);g.scale(r.s,r.s);\r
  g.fillStyle='rgba(0,0,0,.22)';ell(2,5,14,5);g.fillStyle='#8f9690';ell(0,-3,13,10);g.fillStyle='#b4bbb4';ell(-3,-6,8,5);g.restore()}\r
function drawMill(){\r
  g.save();g.translate(MILL.x,MILL.y);\r
  g.fillStyle='rgba(0,0,0,.22)';ell(8,44,34,9);\r
  g.fillStyle='#e6dcc0';g.beginPath();g.moveTo(-22,44);g.lineTo(-14,-30);g.lineTo(14,-30);g.lineTo(22,44);g.closePath();g.fill();\r
  g.fillStyle='#b5493f';g.beginPath();g.moveTo(-18,-30);g.lineTo(0,-52);g.lineTo(18,-30);g.closePath();g.fill();\r
  g.translate(0,-28);g.rotate(T*.7);g.fillStyle='#f4efe0';\r
  for(let i=0;i<4;i++){g.rotate(TAU/4);g.fillRect(-3,0,6,58);g.fillStyle='#d9cfae';g.fillRect(3,6,16,40);g.fillStyle='#f4efe0'}\r
  g.fillStyle='#6a4a2a';circ(0,0,6);g.restore();\r
}\r
function drawEnemy(e){\r
  const s=1+Math.sin(e.wob)*.08,c=CH[e.el].col;\r
  g.save();g.translate(e.x,e.y);\r
  g.fillStyle='rgba(0,0,0,.25)';ell(0,10,e.r,5);g.scale(1/s,s);\r
  g.fillStyle=e.hit>0?'#fff':c;g.beginPath();g.arc(0,0,e.r,Math.PI,0);g.quadraticCurveTo(e.r+3,e.r,0,e.r*.8);g.quadraticCurveTo(-e.r-3,e.r,-e.r,0);g.fill();\r
  g.fillStyle='rgba(255,255,255,.45)';ell(-5,-7,5,3);\r
  g.fillStyle='#1b2030';circ(-4,-1,2.4);circ(5,-1,2.4);\r
  if(e.slow>0){g.strokeStyle='#bfe9ff';g.lineWidth=2;g.beginPath();g.arc(0,0,e.r+3,0,TAU);g.stroke()}\r
  g.restore();\r
  if(e.hp<e.max){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(e.x-16,e.y-e.r-12,32,5);g.fillStyle='#ff5a5a';g.fillRect(e.x-15,e.y-e.r-11,30*e.hp/e.max,3)}\r
}\r
function drawPlayer(){\r
  const c=CH[cur],f=Math.cos(p.ang)>=0?1:-1,bob=p.mv?Math.sin(T*14)*2:Math.sin(T*2)*.8,l=p.mv?Math.sin(T*14)*4:0;\r
  if(p.stam<100){g.strokeStyle=p.exh?'#ff6a5a':'#ffe14d';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y+8,22,-Math.PI/2,-Math.PI/2+TAU*p.stam/100);g.stroke()}\r
  g.save();g.translate(p.x,p.y);\r
  g.fillStyle='rgba(0,0,0,.28)';ell(0,15,13,5);\r
  if(p.inv>0&&((T*20)|0)%2)g.globalAlpha=.5;\r
  g.scale(f,1);\r
  g.fillStyle='#4a3a35';rr(-6+l*.3,4,5,12,2);rr(1-l*.3,4,5,12,2);\r
  g.fillStyle=c.trim;g.beginPath();g.moveTo(-8,-9+bob);g.lineTo(-17,14+bob+Math.sin(T*6)*1.5);g.lineTo(-3,11+bob);g.lineTo(3,-9+bob);g.fill();\r
  g.fillStyle=c.cloth;rr(-9,-10+bob,18,17,6);g.fillStyle=c.trim;g.fillRect(-9,1+bob,18,3);\r
  g.fillStyle=c.hair;circ(0,-18+bob,10.5);\r
  g.fillStyle='#f6dcc0';circ(2,-16+bob,7.5);\r
  g.fillStyle=c.hair;g.beginPath();g.arc(2,-17+bob,8,Math.PI*1.05,Math.PI*1.95);g.lineTo(2,-19+bob);g.fill();\r
  g.strokeStyle=c.hair;g.lineWidth=2;g.beginPath();g.moveTo(0,-28+bob);g.quadraticCurveTo(-3,-35+bob,3,-34+bob);g.stroke();\r
  g.fillStyle=c.trim;circ(5,-15+bob,1.6);circ(0,-15+bob,1.6);\r
  g.save();g.translate(10,-2+bob);g.rotate(-.5+p.swing*1.9);\r
  g.fillStyle='#cfd6e0';g.fillRect(0,-26,4,26);g.fillStyle=c.fx;g.fillRect(0,-26,2,26);g.fillStyle='#8a6a3a';g.fillRect(-3,-1,10,3);g.restore();\r
  g.restore();\r
}\r
function drawFx(){\r
  for(const f of fx){\r
    const u=1-f.t/f.m;\r
    if(f.k=='ring'){\r
      const r=f.R*(.2+.8*Math.sin(u*Math.PI/2));\r
      const gr=g.createRadialGradient(f.x,f.y,r*.5,f.x,f.y,r);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,f.c);\r
      g.globalAlpha=(1-u)*.55;g.fillStyle=gr;circ(f.x,f.y,r);\r
      g.globalAlpha=1-u;g.strokeStyle=f.c;g.lineWidth=4;g.beginPath();g.arc(f.x,f.y,r,0,TAU);g.stroke();g.globalAlpha=1;\r
    }else{\r
      g.save();g.translate(f.x,f.y);g.rotate(f.a);g.globalAlpha=1-u;\r
      g.strokeStyle=f.c;g.lineWidth=f.w*(1-u*.5);g.lineCap='round';g.beginPath();g.arc(0,0,58+u*14,-1.1+u*.5,1.1);g.stroke();\r
      g.strokeStyle='#fff';g.lineWidth=f.w*.35;g.beginPath();g.arc(0,0,58+u*14,-.9+u*.5,.9);g.stroke();g.restore();\r
    }\r
  }\r
}\r
const seeds=Array.from({length:36},()=>({x:Math.random(),y:Math.random(),s:rnd(1,2.4),v:rnd(10,26)}));\r
function render(){\r
  const vw=W/Z,vh=H/Z,ox=shake?rnd(-shake,shake)/Z:0,oy=shake?rnd(-shake,shake)/Z:0;\r
  g.drawImage(bg,cam.x,cam.y,vw,vh,0,0,W,H);\r
  g.save();g.scale(Z,Z);g.translate(-cam.x+ox,-cam.y+oy);\r
  const vis=(o,m=80)=>o.x>cam.x-m&&o.x<cam.x+vw+m&&o.y>cam.y-m&&o.y<cam.y+vh+m+60;\r
  const list=[];\r
  for(const t of trees)if(vis(t))list.push([t.y,()=>drawTree(t)]);\r
  for(const r of rocks)if(vis(r))list.push([r.y,()=>drawRock(r)]);\r
  for(const e of en)if(vis(e))list.push([e.y,()=>drawEnemy(e)]);\r
  list.push([MILL.y+44,drawMill],[p.y+14,drawPlayer]);\r
  list.sort((a,b)=>a[0]-b[0]).forEach(l=>l[1]());\r
  drawFx();\r
  for(const q of parts){g.globalAlpha=clamp(q.t/q.m,0,1);g.fillStyle=q.c;circ(q.x,q.y,q.s)}g.globalAlpha=1;\r
  g.textAlign='center';g.lineJoin='round';\r
  for(const t of texts){g.font=\`800 \${t.s}px Segoe UI,sans-serif\`;g.globalAlpha=Math.min(1,t.l*2);\r
    g.lineWidth=3.5;g.strokeStyle='rgba(20,20,30,.85)';g.strokeText(t.t,t.x,t.y);g.fillStyle=t.c;g.fillText(t.t,t.x,t.y)}\r
  g.globalAlpha=1;g.restore();\r
\r
  /* chu kỳ ngày đêm */\r
  const sun=Math.sin((hour-6)/24*TAU),dark=clamp(-sun*1.1+.05,0,.55),warm=Math.max(0,1-Math.abs(sun)*5)*.22;\r
  if(dark>0){g.fillStyle=\`rgba(14,22,70,\${dark})\`;g.fillRect(0,0,W,H)}\r
  if(warm>0){g.fillStyle=\`rgba(255,140,60,\${warm})\`;g.fillRect(0,0,W,H)}\r
  if(flash>0){g.fillStyle=\`rgba(255,255,255,\${flash*.6})\`;g.fillRect(0,0,W,H)}\r
  g.fillStyle='rgba(255,255,230,.65)';\r
  for(const s of seeds){s.x=(s.x+s.v/W*.016)%1;const y=(s.y*H+Math.sin(T+s.x*9)*10);circ(s.x*W,y,s.s*.8)}\r
}\r
function drawMini(){\r
  const S=540,k=224/S;\r
  mg.clearRect(0,0,224,224);mg.save();mg.beginPath();mg.arc(112,112,110,0,TAU);mg.clip();\r
  mg.drawImage(bg,p.x-S/2,p.y-S/2,S,S,0,0,224,224);\r
  mg.fillStyle='#ff5a5a';\r
  for(const e of en){const x=(e.x-p.x)*k+112,y=(e.y-p.y)*k+112;if(Math.hypot(x-112,y-112)<104){mg.beginPath();mg.arc(x,y,3.5,0,TAU);mg.fill()}}\r
  const t=QUESTS[qi].tgt();\r
  if(t){\r
    let dx=(t.x-p.x)*k,dy=(t.y-p.y)*k;const d=Math.hypot(dx,dy);if(d>94){dx*=94/d;dy*=94/d}\r
    mg.save();mg.translate(112+dx,112+dy);mg.rotate(Math.PI/4);mg.fillStyle='#ffd23b';mg.strokeStyle='#5c3d00';mg.lineWidth=2;mg.fillRect(-6,-6,12,12);mg.strokeRect(-6,-6,12,12);mg.restore();\r
  }\r
  mg.translate(112,112);mg.rotate(p.ang+Math.PI/2);mg.fillStyle='#ffe14d';mg.strokeStyle='#222';mg.lineWidth=2;\r
  mg.beginPath();mg.moveTo(0,-11);mg.lineTo(8,9);mg.lineTo(0,5);mg.lineTo(-8,9);mg.closePath();mg.fill();mg.stroke();\r
  mg.restore();\r
}\r
\r
/* ===================== GIAO DIỆN (HUD) ===================== */\r
const party=$('party');\r
CH.forEach((c,i)=>{\r
  const d=document.createElement('div');d.className='pm';\r
  d.style.background=\`radial-gradient(circle at 35% 30%,#fff 0,\${c.hair} 55%,\${c.trim} 100%)\`;\r
  d.innerHTML=\`<em>\${i+1}</em><span style="color:#12202a;text-shadow:none">\${c.n[0]}</span><i></i>\`;\r
  d.addEventListener('pointerdown',e=>{e.preventDefault();switchTo(i)});party.appendChild(d);\r
});\r
function cd(el,left,max){el.style.background=left>0?\`conic-gradient(rgba(0,0,0,.68) \${left/max*360}deg,transparent 0)\`:'none';el.textContent=left>0?Math.ceil(left):''}\r
function hud(){\r
  const c=CH[cur];\r
  $('hp').style.width=(c.hp/maxHp()*100)+'%';$('cname').textContent=c.n;\r
  $('lv').textContent='Lv. '+lvl;$('badge').textContent='Lv'+lvl;$('ex').textContent=Math.round(exp)+' / '+needExp();\r
  $('stam').style.width=p.stam+'%';$('stam').style.background=p.exh?'#ff6a5a':'#ffe14d';\r
  [...party.children].forEach((d,i)=>{d.classList.toggle('on',i===cur);d.classList.toggle('dead',CH[i].hp<=0);d.lastElementChild.style.width=(CH[i].hp/maxHp()*100)+'%'});\r
  cd($('cdE'),p.cdE,6);cd($('cdQ'),p.cdQ,14);\r
  const bq=$('bQ'),ready=p.energy>=70&&p.cdQ<=0;\r
  bq.style.background=\`conic-gradient(\${c.fx} \${p.energy*3.6}deg,rgba(20,22,30,.5) 0)\`;\r
  bq.style.setProperty('--gc',c.fx);bq.classList.toggle('ready',ready);$('bE').style.borderColor=p.cdE>0?'rgba(255,255,255,.4)':c.fx;\r
  const hh=Math.floor(hour),mi=Math.floor((hour%1)*60);\r
  $('clock').textContent=(hour>6&&hour<18?'☀ ':'☾ ')+String(hh).padStart(2,'0')+':'+String(mi).padStart(2,'0');\r
}\r
\r
/* ===================== LƯU TIẾN ĐỘ =====================\r
 * App là SPA: rời trang chỉ phá iframe, pagehide của game không chạy → phải có\r
 * __gqFlush / event "gq:flush" để app bảo ghi trước khi thoát\r
 * (FLUSH_BRIDGE trong src/pages/OfflineGamePage.jsx) + tick định kỳ khi đang chơi. */\r
const RK='vung-dat-gio-run-v1';\r
function saveRun(){\r
  try{localStorage.setItem(RK,JSON.stringify({v:1,at:Date.now(),lvl,exp,kills,cur,hour,qi,qbase,\r
    hp:CH.map(c=>Math.round(c.hp)),p:{x:p.x,y:p.y,ang:p.ang,stam:p.stam,energy:p.energy}}))}catch(e){}\r
}\r
function loadRun(){\r
  try{const s=JSON.parse(localStorage.getItem(RK)||'null');return s&&s.v===1&&s.hp&&s.p?s:null}catch(e){return null}\r
}\r
function applyRun(s){\r
  lvl=s.lvl;exp=s.exp;kills=s.kills;hour=s.hour;qi=clamp(s.qi,0,QUESTS.length-1);qbase=s.qbase;\r
  s.hp.forEach((h,i)=>{if(CH[i])CH[i].hp=Math.max(0,h)});\r
  cur=CH.findIndex(c=>c.hp>0);\r
  if(cur<0){CH.forEach(c=>c.hp=maxHp()*.5);cur=0}\r
  Object.assign(p,{x:s.p.x,y:s.p.y,ang:s.p.ang||0,stam:s.p.stam||100,energy:s.p.energy||0,inv:0,cdE:0,cdQ:0});\r
}\r
\r
/* ===================== KHỞI ĐỘNG ===================== */\r
const savedRun=loadRun();\r
if(savedRun)applyRun(savedRun);\r
buildBG();\r
for(let i=0;i<10;i++)spawnEn(true);\r
cam.x=clamp(p.x-W/Z/2,0,WORLD-W/Z);cam.y=clamp(p.y-H/Z/2,0,WORLD-H/Z);\r
toast(savedRun?'Tiếp tục ván cũ':'Thảo Nguyên Gió Lặng',savedRun?'Nhiệm vụ: '+QUESTS[qi].t:'Khu vực mới');\r
window.__gqFlush=saveRun;\r
addEventListener('gq:flush',saveRun);\r
addEventListener('pagehide',saveRun);\r
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveRun()});\r
let last=performance.now(),lastSave=last;\r
(function loop(now){\r
  const dt=Math.min(.05,(now-last)/1000);last=now;\r
  if(!paused){update(dt);if(now-lastSave>2000){lastSave=now;saveRun()}}\r
  render();drawMini();hud();requestAnimationFrame(loop);\r
})(last);\r
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