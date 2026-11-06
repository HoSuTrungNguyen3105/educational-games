var e=`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
<meta charset="UTF-8">\r
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\r
<title>Xe tải ra chợ</title>\r
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet">\r
<style>\r
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}\r
  html,body{margin:0;height:100%;overflow:hidden;background:#8fd3ff;\r
    font-family:var(--body,"Be Vietnam Pro","Segoe UI",Arial,sans-serif);color:var(--ink,#1d2e4a)}\r
  canvas{position:fixed;inset:0;width:100%;height:100%;display:block}\r
  .sq{position:fixed;top:14px;width:54px;height:54px;border-radius:16px;background:var(--card,#fffbf2);\r
      border:3px solid var(--ink,#1d2e4a);box-shadow:3px 3px 0 var(--ink,#1d2e4a);\r
      display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:transform .1s,box-shadow .1s}\r
  .sq:active{transform:translate(3px,3px);box-shadow:0 0 0 var(--ink,#1d2e4a)}\r
  .sq svg{width:26px;height:26px}\r
  #back{left:18px}#music{right:18px}\r
  #bar{position:fixed;top:32px;left:90px;right:100px;height:18px;border-radius:9px;background:var(--card,#fffbf2);\r
       border:3px solid var(--ink,#1d2e4a);box-shadow:2px 2px 0 rgba(29,46,74,.35);z-index:4}\r
  #fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:9px;background:var(--sun,#f4b942)}\r
  #knob{position:absolute;top:-9px;width:42px;height:30px;border-radius:15px;background:#ff6a5c;\r
        border:3px solid var(--ink,#1d2e4a);box-shadow:2px 2px 0 var(--ink,#1d2e4a);left:0;transform:translateX(-50%)}\r
  #home{position:fixed;top:24px;right:68px;font-size:30px;z-index:4;cursor:pointer;line-height:1;\r
        filter:drop-shadow(2px 2px 0 rgba(29,46,74,.5))}\r
  #slots{position:fixed;top:78px;left:50%;transform:translateX(-50%);background:var(--card,#fffbf2);\r
         border:3px solid var(--ink,#1d2e4a);border-radius:30px;padding:8px 16px;display:flex;gap:12px;\r
         box-shadow:3px 3px 0 var(--ink,#1d2e4a);z-index:4}\r
  .slot{width:30px;height:30px;border-radius:50%;border:2.5px solid var(--ink,#1d2e4a);background:var(--card,#fffbf2);font-size:20px;\r
        display:flex;align-items:center;justify-content:center;filter:grayscale(1);opacity:.35;transition:.25s}\r
  .slot.on{filter:none;opacity:1;border-color:var(--ok,#22b573);transform:scale(1.15)}\r
  #stars{position:fixed;top:78px;left:22px;background:var(--card,#fffbf2);border:2.5px solid var(--ink,#1d2e4a);border-radius:20px;padding:8px 14px;\r
         font-family:var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);font-weight:800;color:var(--ink,#1d2e4a);\r
         box-shadow:3px 3px 0 var(--ink,#1d2e4a);z-index:4;font-size:18px}\r
  .ctl{position:fixed;bottom:24px;width:120px;height:120px;border-radius:50%;border:4px solid var(--ink,#1d2e4a);color:#fff;\r
       z-index:5;display:flex;align-items:center;justify-content:center;touch-action:none;cursor:pointer;padding:0;\r
       transition:transform .08s,box-shadow .08s}\r
  .ctl svg{width:56px;height:56px}\r
  #left{left:22px;background:#4aa3f5;box-shadow:3px 6px 0 var(--ink,#1d2e4a)}\r
  #right{right:22px;background:#34c46a;box-shadow:3px 6px 0 var(--ink,#1d2e4a)}\r
  .ctl:active,.ctl.down{transform:translate(3px,6px);box-shadow:0 0 0 var(--ink,#1d2e4a)}\r
  #over{position:fixed;inset:0;background:rgba(29,46,74,.6);display:none;align-items:center;justify-content:center;z-index:10}\r
  #card{background:var(--card,#fffbf2);color:var(--ink,#1d2e4a);border:3px solid var(--ink,#1d2e4a);border-radius:22px;padding:30px 44px;\r
        text-align:center;box-shadow:4px 4px 0 var(--ink,#1d2e4a)}\r
  #card h1{margin:0 0 6px;font-family:var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);font-weight:800;\r
           color:var(--tomato,#e4572e);font-size:34px}\r
  #card p{margin:6px 0;font-size:20px;color:var(--ink2,#16233a)}\r
  #card button{margin-top:16px;border:3px solid var(--ink,#1d2e4a);border-radius:16px;padding:14px 34px;font-size:20px;font-weight:800;\r
               font-family:var(--head,"Baloo 2","Fredoka","Segoe UI",system-ui,sans-serif);\r
               color:var(--ink,#1d2e4a);background:var(--sun,#f4b942);box-shadow:3px 3px 0 var(--ink,#1d2e4a);cursor:pointer;\r
               transition:transform .1s,box-shadow .1s}\r
  #card button:active{transform:translate(3px,3px);box-shadow:0 0 0 var(--ink,#1d2e4a)}\r
  #hint{position:fixed;bottom:150px;left:50%;transform:translateX(-50%);background:var(--card,#fffbf2);\r
        border:2.5px solid var(--ink,#1d2e4a);box-shadow:3px 3px 0 var(--ink,#1d2e4a);\r
        padding:8px 18px;border-radius:20px;font-size:16px;color:var(--ink,#1d2e4a);z-index:4;transition:opacity .6s}\r
</style>\r
</head>\r
<body>\r
<canvas id="c"></canvas>\r
\r
<button class="sq" id="back" title="Chơi lại">\r
  <svg viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4 7 12l8 8"/></svg>\r
</button>\r
<div id="bar"><div id="fill"></div><div id="knob"></div></div>\r
<div id="home" title="Về đầu đường">🏠</div>\r
<button class="sq" id="music" title="Nhạc">\r
  <svg viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>\r
</button>\r
\r
<div id="stars">⭐ 0</div>\r
<div id="slots"><div class="slot">🍑</div><div class="slot">🥚</div><div class="slot">🍉</div><div class="slot">🥚</div></div>\r
<div id="hint">Giữ nút xanh (hoặc phím →) để chạy, nút xanh dương (←) để lùi</div>\r
\r
<button class="ctl" id="left"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4 7 12l8 8"/></svg></button>\r
<button class="ctl" id="right"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 4 8 8-8 8"/></svg></button>\r
\r
<div id="over"><div id="card">\r
  <h1>🎉 Đến chợ rồi!</h1>\r
  <p id="res"></p>\r
  <button id="again">Chơi lại</button>\r
</div></div>\r
\r
<script>\r
(()=>{\r
const cv=document.getElementById('c'),ctx=cv.getContext('2d');\r
let W,H,DPR;\r
function resize(){DPR=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;\r
  cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}\r
addEventListener('resize',resize);resize();\r
\r
/* ---------- Thế giới ---------- */\r
const L=6400;                 // chiều dài đường\r
const MARKET_X=L-380;\r
const MUD=[2100,2800];        // đoạn bùn\r
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));\r
function groundY(x){\r
  const amp=clamp((x-500)/400,0,1)*clamp((MARKET_X+250-x)/500,0,1);\r
  const mud=1-clamp(Math.min(x-(MUD[0]-250),(MUD[1]+250)-x)/250,0,1);\r
  const a=amp*mud;\r
  return H*0.70 - a*(Math.sin(x*0.0034)*H*0.085+Math.sin(x*0.0105)*H*0.022+H*0.06*(1-Math.cos(x*0.0016))*0.5);\r
}\r
const ITEMS=[\r
  {x:1000,t:0,e:'🍑'},{x:1900,t:1,e:'🥚'},{x:3600,t:2,e:'🍉'},{x:4700,t:3,e:'🥚'}\r
].map(o=>({...o,got:false,k:'item'}));\r
const STARS=[];\r
for(let x=700;x<L-900;x+=330+((x*7)%5)*40){\r
  if(ITEMS.some(i=>Math.abs(i.x-x)<150))continue;\r
  STARS.push({x,got:false,k:'star',ph:Math.random()*6});\r
}\r
const clouds=[...Array(14)].map((_,i)=>({x:i*520+Math.random()*200,y:60+Math.random()*H*0.28,s:.6+Math.random()*.7}));\r
\r
/* ---------- Xe ---------- */\r
let truck,cam,stars,got,won,keyL=false,keyR=false,btnL=false,btnR=false,time=0,particles=[];\r
function reset(){\r
  truck={x:200,v:0,ang:0,wheel:0,y:0,bump:0};\r
  cam=0;stars=0;got=0;won=false;particles=[];\r
  ITEMS.forEach(i=>i.got=false);STARS.forEach(s=>s.got=false);\r
  document.querySelectorAll('.slot').forEach(s=>s.classList.remove('on'));\r
  document.getElementById('stars').textContent='⭐ 0';\r
  document.getElementById('over').style.display='none';\r
}\r
reset();\r
\r
/* ---------- Lưu tiến độ ----------\r
 * App là SPA: rời trang chỉ phá iframe, pagehide của game không chạy.\r
 * __gqFlush / event "gq:flush" để app yêu cầu ghi trước khi thoát\r
 * (FLUSH_BRIDGE trong src/pages/OfflineGamePage.jsx). */\r
const RK='cargo-run-v1';\r
function saveRun(){\r
  if(won)return;\r
  try{localStorage.setItem(RK,JSON.stringify({v:1,at:Date.now(),x:truck.x,\r
    items:ITEMS.map(i=>i.got?1:0),st:STARS.map(s=>s.got?1:0),stars,got}))}catch(e){}\r
}\r
function loadRun(){\r
  try{const s=JSON.parse(localStorage.getItem(RK)||'null');return s&&s.v===1&&s.items?s:null}catch(e){return null}\r
}\r
function clearRun(){try{localStorage.removeItem(RK)}catch(e){}}\r
function applyRun(s){\r
  truck.x=clamp(s.x||200,60,MARKET_X-60);\r
  (s.items||[]).forEach((f,i)=>{if(ITEMS[i])ITEMS[i].got=!!f});\r
  (s.st||[]).forEach((f,i)=>{if(STARS[i])STARS[i].got=!!f});\r
  stars=s.stars|0;got=s.got|0;\r
  ITEMS.forEach(i=>{if(i.got)document.querySelectorAll('.slot')[i.t].classList.add('on')});\r
  document.getElementById('stars').textContent='⭐ '+stars;\r
  document.getElementById('knob').style.left=(clamp((truck.x-200)/(MARKET_X-260),0,1)*100)+'%';\r
}\r
const savedRun=loadRun();\r
if(savedRun)applyRun(savedRun);\r
window.__gqFlush=saveRun;\r
addEventListener('gq:flush',saveRun);\r
addEventListener('pagehide',saveRun);\r
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveRun()});\r
\r
/* ---------- Âm thanh ---------- */\r
let ac=null,musicOn=true,melTimer=null,noteI=0;\r
const MEL=[523,659,784,659,587,698,880,698,523,659,784,1047,988,784,659,587];\r
function audio(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}return ac;}\r
function tone(f,d=.15,type='sine',vol=.06){const a=audio();if(!a)return;\r
  const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=f;\r
  g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+d);\r
  o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d);}\r
function startMusic(){if(melTimer||!musicOn)return;\r
  melTimer=setInterval(()=>{tone(MEL[noteI++%MEL.length]/2,.35,'triangle',.035);},380);}\r
function stopMusic(){clearInterval(melTimer);melTimer=null;}\r
document.getElementById('music').onclick=()=>{audio();musicOn=!musicOn;\r
  document.getElementById('music').style.opacity=musicOn?1:.45;musicOn?startMusic():stopMusic();};\r
\r
/* ---------- Điều khiển ---------- */\r
function bind(id,set){const el=document.getElementById(id);\r
  const on=e=>{e.preventDefault();set(true);el.classList.add('down');audio();startMusic();hideHint();};\r
  const off=e=>{e.preventDefault();set(false);el.classList.remove('down');};\r
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);\r
  el.addEventListener('pointerleave',off);el.addEventListener('pointercancel',off);}\r
bind('left',v=>btnL=v);bind('right',v=>btnR=v);\r
addEventListener('keydown',e=>{\r
  if(e.key==='ArrowRight'||e.key==='d'){keyR=true;audio();startMusic();hideHint();}\r
  if(e.key==='ArrowLeft'||e.key==='a'){keyL=true;audio();startMusic();hideHint();}\r
  if(e.key.startsWith('Arrow'))e.preventDefault();});\r
addEventListener('keyup',e=>{\r
  if(e.key==='ArrowRight'||e.key==='d')keyR=false;\r
  if(e.key==='ArrowLeft'||e.key==='a')keyL=false;});\r
function hideHint(){document.getElementById('hint').style.opacity=0;}\r
const restartGame=()=>{clearRun();reset()};\r
document.getElementById('back').onclick=restartGame;\r
document.getElementById('home').onclick=restartGame;\r
document.getElementById('again').onclick=restartGame;\r
\r
/* ---------- Cập nhật ---------- */\r
function update(dt){\r
  time+=dt;\r
  const go=(keyR||btnR),rev=(keyL||btnL);\r
  const inMud=truck.x>MUD[0]&&truck.x<MUD[1];\r
  const maxF=inMud?110:300,maxB=inMud?60:150;\r
  if(!won){\r
    if(go)truck.v+=(inMud?150:260)*dt;\r
    else if(rev)truck.v-=(inMud?120:230)*dt;\r
    else truck.v*=Math.pow(.25,dt);\r
    // dốc ảnh hưởng nhẹ\r
    const slope=(groundY(truck.x+10)-groundY(truck.x-10))/20;\r
    truck.v-=slope*140*dt;\r
    truck.v=clamp(truck.v,-maxB,maxF);\r
  }else{truck.v*=Math.pow(.02,dt);}\r
  const dx=truck.v*dt;\r
  truck.x=clamp(truck.x+dx,60,MARKET_X-60);\r
  truck.wheel+=dx/24;\r
  if(truck.x>=MARKET_X-62&&!won){won=true;finish();}\r
\r
  const yb=groundY(truck.x-46)-24,yf=groundY(truck.x+46)-24;\r
  const target=Math.atan2(yf-yb,92);\r
  truck.ang+=(target-truck.ang)*Math.min(1,dt*10);\r
  truck.y=(yb+yf)/2;\r
  truck.bump=Math.sin(time*(8+Math.abs(truck.v)*.05))*Math.min(2.2,Math.abs(truck.v)*.01);\r
\r
  // khói / bùn\r
  if(Math.abs(truck.v)>20&&Math.random()<.5){\r
    particles.push({x:truck.x-90,y:truck.y+8,vx:-30-Math.random()*20,vy:-20-Math.random()*20,life:1,\r
                    c:inMud?'#6b3d1f':'#ffffff',r:6+Math.random()*5});\r
  }\r
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*1.4;p.r+=dt*8;});\r
  particles=particles.filter(p=>p.life>0);\r
\r
  // nhặt đồ\r
  const cx=truck.x,cy=truck.y-40;\r
  for(const o of [...ITEMS,...STARS]){\r
    if(o.got)continue;\r
    const oy=groundY(o.x)-(o.k==='item'?110:100+Math.sin(o.ph||0)*20);\r
    if(Math.hypot(o.x-cx,oy-cy)<62){\r
      o.got=true;\r
      if(o.k==='star'){stars++;document.getElementById('stars').textContent='⭐ '+stars;tone(988,.12,'square',.05);setTimeout(()=>tone(1319,.15,'square',.05),90);}\r
      else{got++;document.querySelectorAll('.slot')[o.t].classList.add('on');tone(659,.12,'triangle',.1);setTimeout(()=>tone(880,.2,'triangle',.1),110);}\r
      for(let i=0;i<8;i++)particles.push({x:o.x,y:oy,vx:(Math.random()-.5)*160,vy:(Math.random()-.5)*160,life:.8,c:'#ffd93b',r:4});\r
      saveRun();\r
    }\r
  }\r
  cam+=((truck.x-W*0.32)-cam)*Math.min(1,dt*6);\r
  cam=clamp(cam,0,MARKET_X+500-W);\r
\r
  // thanh tiến độ\r
  const pr=clamp((truck.x-200)/(MARKET_X-260),0,1);\r
  document.getElementById('knob').style.left=(pr*100)+'%';\r
}\r
function finish(){\r
  clearRun();\r
  tone(784,.2,'triangle',.12);setTimeout(()=>tone(988,.2,'triangle',.12),180);setTimeout(()=>tone(1319,.4,'triangle',.12),360);\r
  setTimeout(()=>{\r
    document.getElementById('res').innerHTML='Hàng hóa: '+got+'/4 &nbsp;|&nbsp; Số sao: ⭐ '+stars;\r
    document.getElementById('over').style.display='flex';\r
  },900);\r
}\r
\r
/* ---------- Vẽ ---------- */\r
function drawBg(){\r
  const g=ctx.createLinearGradient(0,0,0,H*0.8);g.addColorStop(0,'#8fd3ff');g.addColorStop(1,'#d8f0ff');\r
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);\r
  // mặt trời\r
  ctx.fillStyle='rgba(255,217,59,.25)';ctx.beginPath();ctx.arc(W*.82,H*.25,H*.1,0,7);ctx.fill();\r
  ctx.fillStyle='#ffd93b';ctx.beginPath();ctx.arc(W*.82,H*.25,H*.065,0,7);ctx.fill();\r
  // mây\r
  ctx.fillStyle='#fff';\r
  for(const c of clouds){\r
    let x=((c.x-cam*.15)%(W+400)+W+400)%(W+400)-200;\r
    const s=c.s*40;\r
    ctx.beginPath();ctx.arc(x,c.y,s*.7,0,7);ctx.arc(x+s*.8,c.y-s*.25,s*.9,0,7);ctx.arc(x+s*1.6,c.y,s*.7,0,7);ctx.fill();\r
    ctx.fillRect(x,c.y,s*1.6,s*.7);\r
  }\r
  // đồi xa (2 lớp)\r
  hills(.25,'#b9e3a8',H*.58,H*.07,.0042);\r
  hills(.5,'#98d681',H*.64,H*.06,.0065);\r
}\r
function hills(par,col,base,amp,fr){\r
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,H);\r
  for(let x=0;x<=W+10;x+=10){const wx=x+cam*par;ctx.lineTo(x,base-Math.sin(wx*fr)*amp-Math.sin(wx*fr*2.3)*amp*.4);}\r
  ctx.lineTo(W,H);ctx.fill();\r
}\r
function drawGround(){\r
  // phần đất\r
  ctx.beginPath();ctx.moveTo(0,H);\r
  for(let x=0;x<=W+8;x+=8)ctx.lineTo(x,groundY(x+cam));\r
  ctx.lineTo(W,H);ctx.closePath();\r
  ctx.fillStyle='#c98b5a';ctx.fill();\r
  // viền cỏ\r
  ctx.lineJoin='round';ctx.lineCap='round';\r
  ctx.beginPath();for(let x=0;x<=W+8;x+=8){const y=groundY(x+cam);x?ctx.lineTo(x,y):ctx.moveTo(x,y);}\r
  ctx.strokeStyle='#5cbf6b';ctx.lineWidth=18;ctx.stroke();\r
  ctx.strokeStyle='#8ee08a';ctx.lineWidth=7;ctx.translate(0,-3);ctx.stroke();ctx.translate(0,3);\r
  // đốm đất\r
  ctx.fillStyle='rgba(120,70,40,.35)';\r
  for(let i=0;i<60;i++){\r
    const wx=i*131+((i*53)%90);const x=wx-cam;\r
    if(x<-40||x>W+40)continue;\r
    const y=groundY(wx)+40+((i*37)%120);\r
    ctx.beginPath();ctx.ellipse(x,y,14+(i%4)*5,9+(i%3)*3,0,0,7);ctx.fill();\r
  }\r
  // bùn\r
  const x0=MUD[0]-cam,x1=MUD[1]-cam;\r
  if(x1>-50&&x0<W+50){\r
    ctx.beginPath();\r
    const a=Math.max(-20,x0),b=Math.min(W+20,x1);\r
    ctx.moveTo(a,groundY(a+cam)+26);\r
    for(let x=a;x<=b;x+=8)ctx.lineTo(x,groundY(x+cam)-4);\r
    ctx.lineTo(b,groundY(b+cam)+26);ctx.closePath();\r
    ctx.fillStyle='#6b3d1f';ctx.fill();\r
    ctx.fillStyle='#4e2b14';\r
    for(let wx=MUD[0]+60;wx<MUD[1];wx+=95){\r
      const x=wx-cam;ctx.beginPath();ctx.ellipse(x,groundY(wx)+8,22,6,0,0,7);ctx.fill();}\r
  }\r
}\r
function drawMarket(){\r
  const x=MARKET_X-cam;if(x<-300||x>W+300)return;\r
  const gy=groundY(MARKET_X);\r
  const w=330,h=100,top=gy-h-150;\r
  // cột\r
  ctx.fillStyle='#8b5a2b';ctx.fillRect(x-w/2+8,top+40,10,150+h-40);ctx.fillRect(x+w/2-18,top+40,10,150+h-40);\r
  // mái\r
  const n=10,sw=w/n;\r
  for(let i=0;i<n;i++){\r
    ctx.fillStyle=i%2?'#fff':'#ff5b4f';\r
    ctx.beginPath();ctx.moveTo(x-w/2+i*sw,top);ctx.lineTo(x-w/2+(i+1)*sw,top);\r
    ctx.lineTo(x-w/2+(i+1)*sw,top+32);ctx.arc(x-w/2+(i+.5)*sw,top+32,sw/2,0,Math.PI);ctx.closePath();ctx.fill();\r
    ctx.strokeStyle='#222';ctx.lineWidth=2;ctx.stroke();\r
  }\r
  // bảng\r
  ctx.fillStyle='#fff';ctx.strokeStyle='#222';ctx.lineWidth=3;\r
  roundRect(x-50,top-42,100,40,10);ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#222';ctx.font='bold 26px Segoe UI, Arial';ctx.textAlign='center';ctx.fillText('Chợ',x,top-14);\r
  // mũi tên nhấp nhô\r
  const by=Math.sin(time*5)*8;\r
  ctx.fillStyle='#ffd93b';ctx.strokeStyle='#222';ctx.lineWidth=4;\r
  ctx.beginPath();ctx.moveTo(x-12,top-130+by);ctx.lineTo(x+12,top-130+by);ctx.lineTo(x+12,top-98+by);\r
  ctx.lineTo(x+28,top-98+by);ctx.lineTo(x,top-68+by);ctx.lineTo(x-28,top-98+by);ctx.lineTo(x-12,top-98+by);ctx.closePath();ctx.fill();ctx.stroke();\r
  // quầy\r
  ctx.fillStyle='#e6b676';ctx.strokeStyle='#222';ctx.lineWidth=3;\r
  roundRect(x-w/2+10,gy-h+30,w-20,h-30,6);ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#d9a45f';ctx.fillRect(x-w/2+12,gy-h+52,w-24,2);\r
  // hàng hóa trên quầy\r
  ctx.font='36px serif';\r
  const em=['🍎','🥚','🍉','🥚'];\r
  em.forEach((e,i)=>{\r
    const ok=i<ITEMS.length&&ITEMS[i].got;\r
    ctx.globalAlpha=ok?1:.55;ctx.fillText(e,x-w/2+55+i*72,gy-h+32);});\r
  ctx.globalAlpha=1;\r
}\r
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);\r
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}\r
function drawStar(x,y,r,rot){\r
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();\r
  for(let i=0;i<10;i++){const rr=i%2?r*.45:r,a=i*Math.PI/5-Math.PI/2;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}\r
  ctx.closePath();ctx.fillStyle='#ffd93b';ctx.strokeStyle='#222';ctx.lineWidth=3;ctx.lineJoin='round';ctx.fill();ctx.stroke();ctx.restore();\r
}\r
function drawCollectibles(){\r
  for(const s of STARS){\r
    if(s.got)continue;const x=s.x-cam;if(x<-40||x>W+40)continue;\r
    const y=groundY(s.x)-100+Math.sin(time*3+s.ph)*8;drawStar(x,y,24,Math.sin(time*2+s.ph)*.15);\r
  }\r
  ctx.font='46px serif';ctx.textAlign='center';\r
  for(const o of ITEMS){\r
    if(o.got)continue;const x=o.x-cam;if(x<-40||x>W+40)continue;\r
    const y=groundY(o.x)-110+Math.sin(time*3+o.t)*8;\r
    ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(x,y-14,34,0,7);ctx.fill();\r
    ctx.fillStyle='#000';ctx.fillText(o.e,x,y);\r
  }\r
}\r
function wheel(x,y,rot){\r
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);\r
  ctx.fillStyle='#3a2314';ctx.strokeStyle='#1a0f08';ctx.lineWidth=3;\r
  ctx.beginPath();ctx.arc(0,0,25,0,7);ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#4b2e1a';\r
  for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.arc(Math.cos(a)*19,Math.sin(a)*19,5,0,7);ctx.fill();}\r
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,13,0,7);ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#ffd93b';ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.fill();\r
  ctx.fillStyle='#e8473a';ctx.fillRect(-1.5,-12,3,8);\r
  ctx.restore();\r
}\r
function drawTruck(){\r
  const x=truck.x-cam,y=truck.y+truck.bump;\r
  ctx.save();ctx.translate(x,y);ctx.rotate(truck.ang);\r
  ctx.lineJoin='round';ctx.strokeStyle='#222';ctx.lineWidth=3;\r
  // thùng xe\r
  ctx.fillStyle='#4a2c1a';roundRect(-88,-38,100,26,5);ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#3d9be0';ctx.fillRect(-84,-34,92,10);\r
  ctx.fillStyle='#ffd93b';ctx.fillRect(-84,-30,92,3);\r
  // hàng đã nhặt (hiện trên thùng)\r
  ctx.font='24px serif';ctx.textAlign='center';\r
  ITEMS.forEach((o,i)=>{if(o.got)ctx.fillText(o.e,-70+i*22,-42);});\r
  // cabin\r
  ctx.fillStyle='#ff6b5e';\r
  ctx.beginPath();ctx.moveTo(8,-12);ctx.lineTo(8,-66);ctx.lineTo(44,-68);ctx.lineTo(74,-34);ctx.lineTo(80,-34);ctx.lineTo(80,-12);ctx.closePath();ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#e5f4ff';ctx.beginPath();ctx.moveTo(16,-60);ctx.lineTo(42,-61);ctx.lineTo(60,-38);ctx.lineTo(16,-38);ctx.closePath();ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#ffd93b';ctx.beginPath();ctx.arc(76,-26,5,0,7);ctx.fill();ctx.stroke();\r
  ctx.fillStyle='#ddd';ctx.fillRect(-92,-18,8,8);\r
  // bùn bám\r
  ctx.fillStyle='#6b3d1f';\r
  [[ -60,-38,9],[-40,-40,11],[-20,-36,8],[40,-20,7],[60,-18,6]].forEach(m=>{ctx.beginPath();ctx.arc(m[0],m[1],m[2],0,7);ctx.fill();});\r
  // bánh\r
  wheel(-46,0,truck.wheel);wheel(46,0,truck.wheel);\r
  ctx.restore();\r
}\r
function drawParticles(){\r
  for(const p of particles){ctx.globalAlpha=Math.max(0,p.life)*.7;ctx.fillStyle=p.c;\r
    ctx.beginPath();ctx.arc(p.x-cam,p.y,p.r,0,7);ctx.fill();}\r
  ctx.globalAlpha=1;\r
}\r
function drawFlowers(){\r
  for(let i=0;i<40;i++){\r
    const wx=300+i*160+((i*47)%60);if(wx>MARKET_X)break;const x=wx-cam;if(x<-20||x>W+20)continue;\r
    const y=groundY(wx)-6;ctx.fillStyle='#ff8fb8';ctx.beginPath();ctx.arc(x,y,9,0,7);ctx.fill();\r
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,3.5,0,7);ctx.fill();\r
  }\r
}\r
\r
let last=performance.now(),lastSave=0;\r
function loop(now){\r
  const dt=Math.min(.05,(now-last)/1000);last=now;\r
  update(dt);\r
  if(now-lastSave>1500){lastSave=now;saveRun();}\r
  ctx.clearRect(0,0,W,H);\r
  drawBg();drawGround();drawFlowers();drawMarket();drawCollectibles();drawParticles();drawTruck();\r
  requestAnimationFrame(loop);\r
}\r
requestAnimationFrame(loop);\r
})();\r
<\/script>\r
</body>\r
</html>`;export{e as default};