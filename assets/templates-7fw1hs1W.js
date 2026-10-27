var e=[{id:`thithap`,name:`🐲 Đại Chiến Boss Tri Thức`,html:`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
<meta charset="UTF-8">\r
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\r
<title>Đại Chiến Boss Tri Thức</title>\r
<style>\r
:root{--bg1:#120f2e;--bg2:#241a55;--card:rgba(255,255,255,.09);--line:rgba(255,255,255,.2);--ink:#f5f0ff;--mut:#b9b0dc;--gold:#ffd166;--ok:#6ee7a8;--bad:#ff6b81;--acc:#8b7bff}\r
*{box-sizing:border-box;margin:0;-webkit-tap-highlight-color:transparent}\r
html,body{min-height:100%}\r
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:radial-gradient(1200px 600px at 50% -10%,var(--bg2),var(--bg1));min-height:100vh;display:flex;justify-content:center;padding:12px calc(12px + env(safe-area-inset-right)) calc(20px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left));user-select:none;-webkit-user-select:none}\r
#app{width:100%;max-width:640px;display:flex;flex-direction:column;gap:12px}\r
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;backdrop-filter:blur(6px)}\r
h1{font-size:26px;line-height:1.2}\r
.sub{color:var(--mut);font-size:14px;line-height:1.5;margin-top:6px}\r
.btn{font:inherit;font-weight:800;border:0;border-radius:14px;padding:14px 22px;background:var(--acc);color:#fff;cursor:pointer;width:100%;font-size:16px;transition:transform .08s,opacity .2s;letter-spacing:.02em}\r
.btn:active{transform:scale(.97)}.btn[disabled]{opacity:.45;cursor:not-allowed}\r
.btn.gold{background:linear-gradient(135deg,#ffd166,#ff8a3d);color:#3a1d00;box-shadow:0 4px 18px rgba(255,150,60,.35)}\r
.btn.ghost{background:transparent;border:1.5px solid var(--line);color:var(--ink)}\r
input[type=text]{font:inherit;width:100%;padding:13px 14px;border-radius:12px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font-size:16px;user-select:text;-webkit-user-select:text}\r
input[type=text]:focus{outline:2px solid var(--acc);border-color:transparent}\r
.hide{display:none!important}\r
.stats{display:flex;gap:10px;margin:14px 0}\r
.stat{flex:1;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px;text-align:center}\r
.stat b{display:block;font-size:22px;color:var(--gold)}.stat span{font-size:12px;color:var(--mut)}\r
.rules{margin:12px 0;padding-left:20px;color:var(--mut);font-size:14px;line-height:1.7}\r
/* sân khấu */\r
#stage{position:relative;border-radius:18px;overflow:hidden;border:1px solid var(--line);box-shadow:0 8px 30px rgba(0,0,0,.4)}\r
#cv{display:block;width:100%;height:210px}\r
#hud{position:absolute;left:10px;right:10px;top:8px;display:flex;justify-content:space-between;align-items:flex-start;gap:10px;pointer-events:none;font-size:12px;font-weight:700;text-shadow:0 1px 3px #000}\r
.pill{background:rgba(0,0,0,.45);border-radius:999px;padding:4px 10px;border:1px solid rgba(255,255,255,.2)}\r
#en{width:110px;height:8px;border-radius:4px;background:rgba(0,0,0,.5);margin-top:4px;overflow:hidden;border:1px solid #fff4}\r
#enf{height:100%;width:0;background:linear-gradient(90deg,#7aa2ff,#c68bff,#ffd166);transition:width .4s}\r
#bossHud{position:absolute;left:50%;transform:translateX(-50%);top:8px;width:56%;text-align:center;font-size:12px;font-weight:800;text-shadow:0 1px 3px #000;pointer-events:none}\r
#bossBar{height:12px;border-radius:7px;background:rgba(0,0,0,.55);margin-top:4px;overflow:hidden;border:1.5px solid #fff6}\r
#bossFill{height:100%;width:100%;background:linear-gradient(90deg,#ff5d6c,#ff9f43);transition:width .35s}\r
#banner{position:absolute;left:0;right:0;top:46%;transform:translateY(-50%) scale(.6);text-align:center;font-size:30px;font-weight:900;color:#fff;text-shadow:0 3px 0 #000,0 0 18px var(--gold);opacity:0;pointer-events:none;transition:all .35s cubic-bezier(.2,1.6,.4,1)}\r
#banner.on{opacity:1;transform:translateY(-50%) scale(1)}\r
#mute{position:absolute;right:8px;bottom:8px;width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(255,255,255,.4);background:rgba(0,0,0,.45);color:#fff;font-size:16px;cursor:pointer}\r
/* câu hỏi */\r
#tower{display:flex;gap:5px}\r
.fl{flex:1;height:8px;border-radius:5px;background:var(--line);transition:background .3s}\r
.fl.done{background:var(--ok)}.fl.skip{background:var(--bad)}.fl.cur{background:var(--gold);box-shadow:0 0 10px var(--gold)}\r
.top{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13px;color:var(--mut);margin-top:8px}\r
.pts{color:var(--gold);font-weight:800}\r
.qwrap{display:flex;gap:14px;align-items:center}\r
#ring{position:relative;width:70px;height:70px;flex:none}\r
#ring svg{transform:rotate(-90deg)}\r
#ring circle{fill:none;stroke-width:8}\r
#rbg{stroke:var(--line)}#rfg{stroke:var(--ok);stroke-linecap:round}\r
#rnum{position:absolute;inset:0;display:grid;place-items:center;font-weight:900;font-size:21px}\r
#ring.warn #rfg{stroke:var(--gold)}#ring.danger #rfg{stroke:var(--bad)}#ring.danger #rnum{color:var(--bad);animation:pulse .5s infinite}\r
@keyframes pulse{50%{transform:scale(1.18)}}\r
#qtext{font-size:19px;line-height:1.4;font-weight:800}\r
#opts{display:flex;flex-direction:column;gap:9px;margin-top:12px}\r
.opt{display:flex;align-items:center;gap:12px;text-align:left;font:inherit;font-size:17px;color:var(--ink);background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:13px 15px;cursor:pointer;width:100%;transition:transform .08s,border-color .15s,background .15s;animation:pop .3s both}\r
.opt:nth-child(2){animation-delay:.05s}.opt:nth-child(3){animation-delay:.1s}.opt:nth-child(4){animation-delay:.15s}\r
@keyframes pop{from{opacity:0;transform:translateX(-14px)}}\r
.opt:hover{border-color:var(--acc)}.opt:active{transform:scale(.99)}\r
.opt .k{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--line);font-weight:800;font-size:14px}\r
.opt.sel{border-color:var(--gold);background:rgba(255,209,102,.18);box-shadow:0 0 14px rgba(255,209,102,.3)}.opt.sel .k{background:var(--gold);color:#3a2300}\r
.opt.multi .k{border-radius:8px}\r
.warnbox{background:rgba(255,107,129,.16);border:1px solid var(--bad);border-radius:12px;padding:10px 12px;font-size:13px}\r
.rv{display:flex;justify-content:space-between;gap:12px;padding:11px 0;border-bottom:1px solid var(--line);font-size:14px}\r
.rv:last-child{border:0}.rv .a{color:var(--gold);font-weight:800;text-align:right}.rv .a.none{color:var(--bad)}\r
.big{font-size:62px;font-weight:900;color:var(--gold);text-align:center;line-height:1;text-shadow:0 0 24px rgba(255,209,102,.5)}\r
.rank{width:84px;height:84px;margin:12px auto 0;border-radius:50%;display:grid;place-items:center;font-size:44px;font-weight:900;border:4px solid var(--gold);color:var(--gold);animation:stamp .6s cubic-bezier(.2,1.8,.4,1) both}\r
@keyframes stamp{from{transform:scale(3) rotate(-25deg);opacity:0}}\r
.mid{text-align:center;color:var(--mut);margin-top:6px}\r
pre{white-space:pre-wrap;word-break:break-word;font-size:12px;background:var(--card);padding:10px;border-radius:10px;max-height:180px;overflow:auto;user-select:text}\r
.err{color:var(--bad);font-size:14px;margin-top:8px}\r
.badge{display:inline-block;font-size:12px;padding:3px 10px;border-radius:999px;background:rgba(255,209,102,.18);color:var(--gold);border:1px solid var(--gold)}\r
</style>\r
</head>\r
<body>\r
<div id="app">\r
\r
<div id="stage">\r
  <canvas id="cv"></canvas>\r
  <div id="hud"><div><div class="pill" id="hFloor">⚔️ Sẵn sàng</div></div><div style="text-align:right"><div class="pill">⚡ Năng lượng</div><div id="en"><div id="enf"></div></div></div></div>\r
  <div id="bossHud" class="hide"><div>🐲 BOSS TRI THỨC</div><div id="bossBar"><div id="bossFill"></div></div></div>\r
  <div id="banner"></div>\r
  <button id="mute" aria-label="Âm thanh">🔊</button>\r
</div>\r
\r
<section id="s-start" class="card">\r
  <h1>🐲 Đại Chiến Boss Tri Thức</h1>\r
  <p class="sub" id="examTitle"></p>\r
  <p class="sub">Mỗi câu hỏi là một con quái chặn đường. Chốt đáp án để tung phép, hết giờ quái sẽ đánh bạn. Vượt hết quái để gặp <b>Boss rồng</b>. Nộp bài xong, điểm thật quyết định boss mất bao nhiêu máu.</p>\r
  <div class="stats">\r
    <div class="stat"><b id="stQ">–</b><span>quái</span></div>\r
    <div class="stat"><b id="stP">–</b><span>điểm tối đa</span></div>\r
    <div class="stat"><b id="stT">–</b><span>giây tổng</span></div>\r
  </div>\r
  <ul class="rules">\r
    <li>Không quay lại được câu đã qua.</li>\r
    <li>Đáp án đúng chỉ lộ sau khi nộp. Hiệu ứng tung phép chỉ để chơi cho vui, điểm do server chấm.</li>\r
    <li>Rời khỏi tab thi sẽ bị ghi nhận.</li>\r
  </ul>\r
  <input type="text" id="name" placeholder="Tên chiến binh của bạn" maxlength="60" autocomplete="name">\r
  <div id="loadErr" class="err hide"></div>\r
  <button class="btn gold" id="btnStart" style="margin-top:14px" disabled>Đang tải câu hỏi…</button>\r
</section>\r
\r
<section id="s-quiz" class="hide" style="display:flex;flex-direction:column;gap:12px">\r
  <div class="card" style="padding:14px 16px">\r
    <div id="tower"></div>\r
    <div class="top"><span id="qIdx"></span><span class="pts" id="qPts"></span></div>\r
  </div>\r
  <div class="card">\r
    <div class="qwrap">\r
      <div id="ring"><svg width="70" height="70" viewBox="0 0 76 76"><circle id="rbg" cx="38" cy="38" r="32"/><circle id="rfg" cx="38" cy="38" r="32" stroke-dasharray="201.06" stroke-dashoffset="0"/></svg><div id="rnum">0</div></div>\r
      <div id="qtext"></div>\r
    </div>\r
    <div id="opts"></div>\r
    <div id="txtWrap" class="hide" style="margin-top:12px"><input type="text" id="txtIn" placeholder="Nhập câu trả lời…" autocomplete="off"></div>\r
  </div>\r
  <div id="cheat" class="warnbox hide"></div>\r
  <button class="btn gold" id="btnNext">🔥 Tung phép!</button>\r
</section>\r
\r
<section id="s-review" class="card hide">\r
  <h1>🛡️ Chuẩn bị đòn quyết định</h1>\r
  <p class="sub">Boss rồng đang chờ. Kiểm tra lại bài rồi nộp. Đã nộp là không sửa được.</p>\r
  <div id="rvList" style="margin:12px 0"></div>\r
  <div id="subErr" class="err hide"></div>\r
  <button class="btn gold" id="btnSubmit">⚡ NỘP BÀI VÀ ĐÁNH BOSS</button>\r
</section>\r
\r
<section id="s-result" class="card hide">\r
  <div id="resBody"></div>\r
  <button class="btn ghost" id="btnAgain" style="margin-top:16px">Xem kết quả chi tiết</button>\r
</section>\r
\r
</div>\r
<script>\r
'use strict';\r
const $=s=>document.querySelector(s);\r
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));\r
const R=Math.random,clamp=(v,a,b)=>v<a?a:v>b?b:v;\r
\r
/* ============ CẦU NỐI VỚI APP ============\r
   File này KHÔNG gọi API. Frame cha (React) đẩy câu hỏi xuống và nhận đáp án\r
   ngược lên qua postMessage:\r
     cha → con: {type:'init', data:{questions, playerName, title, timeLeft}}\r
     cha → con: {type:'graded', data:{score, max}}   (server đã chấm xong)\r
     con → cha: 'ready' / 'answer-recorded' / 'game-over' / 'exam-done'\r
   Bridge EG_ANSWER do app tiêm vào trước khi nạp iframe (injectAnswerBridge.js). */\r
function bridge(){return window.EG_ANSWER||null}\r
function askReady(){bridge()?bridge().markReady():setTimeout(askReady,60)}\r
// Giá trị 1 câu gửi lên server: text hoặc key phương án (nhiều key nối bằng dấu phẩy).\r
const valueOf=a=>a.text?a.text:a.answerIds.join(',');\r
function reportAnswer(a){bridge()&&bridge().answer(a.questionId,a.answered?valueOf(a):null,a.timeSpent)}\r
function submitToHost(timeout){\r
  if(submitted||submitting||!Q.length)return;\r
  submitting=true;\r
  const b=$('#btnSubmit');b.disabled=true;b.textContent=timeout?'Hết giờ — đang gửi bài…':'Đang gửi bài…';\r
  $('#subErr').classList.add('hide');\r
  bridge()&&bridge().finish({\r
    answers:A.map(a=>({questionId:a.questionId,value:a.answered?valueOf(a):null,timeSpent:a.timeSpent})),\r
    totalQuestions:Q.length,\r
    timeUsed:Math.round((Date.now()-startedAt)/1000)\r
  });\r
}\r
addEventListener('message',e=>{\r
  const m=e.data;if(!m||typeof m!=='object')return;\r
  if(m.type==='init'){\r
    const d=m.data||{};\r
    if(d.playerName)$('#name').value=d.playerName;\r
    if(d.title)$('#examTitle').textContent='📋 '+d.title;\r
    applyQuestions(d.questions||[]);\r
  }\r
  else if(m.type==='graded')reveal(m.data||{});\r
  else if(m.type==='time-up')submitToHost(true);\r
});\r
\r
/* ================= ÂM THANH ================= */\r
let AC=null,mute=false;\r
function ac(){if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}AC&&AC.state==='suspended'&&AC.resume()}\r
function bp(f,d,ty,v,f2){if(!AC||mute)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,f2||f),t+d);g.gain.setValueAtTime(v||.12,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}\r
const SFX={cast(){bp(300,.25,'sawtooth',.1,1100)},hit(){bp(160,.18,'square',.12,60)},hurt(){bp(120,.35,'sawtooth',.18,40)},tick(){bp(900,.05,'square',.04)},win(){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>bp(f,.25,'triangle',.14),i*110))},boom(){bp(140,.6,'sawtooth',.2,30)},click(){bp(600,.06,'triangle',.08)}};\r
$('#mute').onclick=()=>{mute=!mute;$('#mute').textContent=mute?'🔇':'🔊'};\r
\r
/* ================= SÂN KHẤU ================= */\r
const cv=$('#cv'),cx=cv.getContext('2d');let W=0,H=0,DPR=1;\r
function fit(){DPR=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR}\r
addEventListener('resize',fit);\r
const MON=['👹','🧟','🦇','🐺','👻','🕷️','🐍','🦂','🦖','🤖'];\r
const PAL=[['#6dc4ff','#cdeeff','#3f8f4a','#2b6b36'],['#ff9d6b','#ffd9a8','#7a5a3a','#4e3a24'],['#2b2559','#6a4aa8','#3a3566','#252047'],['#1a1a2e','#7a2a4a','#4a2a3a','#2a1822'],['#0e2a3f','#2a7a8a','#2a5a5a','#1a3a3a']];\r
const SC={floor:0,mon:'👹',monA:1,monState:'idle',monX:0,hurt:0,flash:0,shake:0,projs:[],parts:[],texts:[],boss:false,bossHP:1,bossDead:false,hit:0,energy:0,casting:0,t:0,charge:0,heroHurt:0,heroDown:false};\r
const hero='🧙',BOSS='🐲';\r
function say(x,y,s,c,sz){SC.texts.push({x,y,s,c:c||'#fff',l:1,sz:sz||18})}\r
function burst(x,y,n,cols,spd,emoji){for(let i=0;i<n;i++){const a=R()*6.283,v=(.3+R())*(spd||5);SC.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,l:1,c:cols[(R()*cols.length)|0],s:3+R()*4,e:emoji})}}\r
const heroXY=()=>[W*.2,H*.74],monXY=()=>[W*.78+(1-SC.monA)*60,H*.72];\r
function fire(from,to,col,big,cb){SC.projs.push({x:from[0],y:from[1]-30,tx:to[0],ty:to[1]-35,p:0,col,big:big||1,cb})}\r
function loopScene(ts){\r
  const dt=Math.min(.05,(ts-(loopScene.l||ts))/1000);loopScene.l=ts;SC.t+=dt;\r
  if(W){const dprt=DPR;cx.setTransform(dprt,0,0,dprt,0,0);drawScene(dt)}\r
  requestAnimationFrame(loopScene)\r
}\r
function drawScene(dt){\r
  const pal=PAL[SC.boss?3:SC.floor%PAL.length];\r
  let ox=0,oy=0;if(SC.shake>0){SC.shake-=dt;ox=(R()-.5)*SC.shake*40;oy=(R()-.5)*SC.shake*40}\r
  cx.save();cx.translate(ox,oy);\r
  const g=cx.createLinearGradient(0,0,0,H*.75);g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);cx.fillStyle=g;cx.fillRect(-10,-10,W+20,H);\r
  if(SC.floor%PAL.length>=2||SC.boss){cx.fillStyle='#fff';for(let i=0;i<30;i++){const sx=(i*97.3)%W,sy=(i*53.7)%(H*.5);cx.globalAlpha=.4+.4*Math.sin(SC.t*2+i);cx.fillRect(sx,sy,2,2)}cx.globalAlpha=1}\r
  else{cx.fillStyle='rgba(255,255,255,.75)';for(let i=0;i<4;i++){const c=((SC.t*8+i*W/3.2)%(W+120))-60,y=24+i*16;cx.beginPath();cx.ellipse(c,y,34,11,0,0,6.283);cx.ellipse(c+20,y+3,24,9,0,0,6.283);cx.fill()}}\r
  cx.fillStyle=pal[3]+'aa';cx.beginPath();cx.moveTo(0,H*.7);for(let x=0;x<=W;x+=20)cx.lineTo(x,H*.55+Math.sin(x*.02+SC.floor)*14+Math.sin(x*.05)*6);cx.lineTo(W,H*.7);cx.fill();\r
  cx.fillStyle=pal[2];cx.fillRect(-10,H*.74,W+20,H);cx.fillStyle=pal[3];cx.fillRect(-10,H*.74,W+20,5);\r
  if(SC.boss){const lg=cx.createRadialGradient(W*.78,H*.7,10,W*.78,H*.7,W*.5);lg.addColorStop(0,'rgba(255,90,40,.35)');lg.addColorStop(1,'rgba(255,90,40,0)');cx.fillStyle=lg;cx.fillRect(0,0,W,H)}\r
  cx.textAlign='center';cx.textBaseline='alphabetic';\r
  /* anh hùng */\r
  const [hx,hy]=heroXY();const hb=Math.sin(SC.t*3)*3;\r
  cx.fillStyle='rgba(0,0,0,.28)';cx.beginPath();cx.ellipse(hx,hy+4,24,6,0,0,6.283);cx.fill();\r
  cx.save();cx.translate(hx+(SC.casting>0?10:0)+(SC.heroHurt>0?-8*SC.heroHurt:0),hy+hb);if(SC.heroDown)cx.rotate(-1.2);\r
  cx.font='54px serif';cx.globalAlpha=SC.heroHurt>0&&Math.floor(SC.t*30)%2?.35:1;cx.fillText(hero,0,0);cx.restore();cx.globalAlpha=1;\r
  if(SC.casting>0){SC.casting-=dt;const gg=cx.createRadialGradient(hx+30,hy-40,2,hx+30,hy-40,26);gg.addColorStop(0,'rgba(255,240,180,.9)');gg.addColorStop(1,'rgba(255,170,60,0)');cx.fillStyle=gg;cx.fillRect(hx,hy-70,70,60)}\r
  if(SC.heroHurt>0)SC.heroHurt-=dt;\r
  /* quái / boss */\r
  const [mx0,my0]=monXY();const big=SC.boss?1.9:1;const mb=Math.sin(SC.t*2.4)*4;\r
  if(SC.monState!=='gone'){\r
    let a=SC.monA,sc=1,mx=mx0,my=my0+mb;\r
    if(SC.monState==='enter'){SC.monA=Math.min(1,SC.monA+dt*2.2);a=SC.monA;if(SC.monA>=1)SC.monState='idle'}\r
    if(SC.monState==='dying'){SC.monA-=dt*2.2;a=Math.max(0,SC.monA);sc=1+(1-a)*.4;my-=(1-a)*30;if(SC.monA<=0)SC.monState='gone'}\r
    if(SC.flash>0){SC.flash-=dt;mx+=(R()-.5)*10}\r
    cx.fillStyle='rgba(0,0,0,.3)';cx.beginPath();cx.ellipse(mx0,my0+4,30*big,7*big,0,0,6.283);cx.fill();\r
    cx.save();cx.translate(mx,my);cx.scale(-sc*big,sc*big);cx.globalAlpha=clamp(a,0,1);cx.font='56px serif';cx.fillText(SC.mon,0,0);\r
    if(SC.flash>0){cx.globalCompositeOperation='source-atop';cx.fillStyle='rgba(255,255,255,.7)';cx.fillText(SC.mon,0,0)}cx.restore();cx.globalAlpha=1;\r
    if(SC.charge>0&&SC.monState==='idle'&&!SC.boss){const r=6+SC.charge*18;const og=cx.createRadialGradient(mx0-30,my0-50,1,mx0-30,my0-50,r);og.addColorStop(0,'rgba(255,255,255,.95)');og.addColorStop(.4,SC.charge>.8?'rgba(255,60,60,.8)':'rgba(255,170,60,.7)');og.addColorStop(1,'rgba(255,60,60,0)');cx.fillStyle=og;cx.fillRect(mx0-30-r,my0-50-r,r*2,r*2)}\r
  }\r
  /* đạn */\r
  for(let i=SC.projs.length-1;i>=0;i--){const p=SC.projs[i];p.p+=dt*2.6;const k=Math.min(1,p.p),x=p.x+(p.tx-p.x)*k,y=p.y+(p.ty-p.y)*k-Math.sin(k*3.14)*26;\r
    const r=11*p.big,pg=cx.createRadialGradient(x,y,1,x,y,r);pg.addColorStop(0,'#fff');pg.addColorStop(.4,p.col);pg.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=pg;cx.fillRect(x-r,y-r,r*2,r*2);\r
    if(R()<.7)SC.parts.push({x,y,vx:(R()-.5)*1.5,vy:(R()-.5)*1.5,l:.5,c:p.col,s:2.5});\r
    if(p.p>=1){SC.projs.splice(i,1);p.cb&&p.cb(p)}}\r
  /* hạt */\r
  for(let i=SC.parts.length-1;i>=0;i--){const p=SC.parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.l-=dt*1.4;if(p.l<=0){SC.parts.splice(i,1);continue}cx.globalAlpha=clamp(p.l,0,1);if(p.e){cx.font=p.s*4+'px serif';cx.fillText(p.e,p.x,p.y)}else{cx.fillStyle=p.c;cx.fillRect(p.x,p.y,p.s,p.s)}}cx.globalAlpha=1;\r
  for(let i=SC.texts.length-1;i>=0;i--){const t=SC.texts[i];t.y-=dt*34;t.l-=dt*.9;if(t.l<=0){SC.texts.splice(i,1);continue}cx.globalAlpha=clamp(t.l*1.6,0,1);cx.font=\`900 \${t.sz}px system-ui\`;cx.lineWidth=4;cx.strokeStyle='#000';cx.strokeText(t.s,t.x,t.y);cx.fillStyle=t.c;cx.fillText(t.s,t.x,t.y)}cx.globalAlpha=1;\r
  cx.restore();\r
}\r
function banner(t,ms){const b=$('#banner');b.textContent=t;b.classList.add('on');clearTimeout(banner.t);banner.t=setTimeout(()=>b.classList.remove('on'),ms||1200)}\r
function setEnergy(v){SC.energy=clamp(v,0,100);$('#enf').style.width=SC.energy+'%'}\r
function newMonster(i){SC.floor=i;SC.boss=false;SC.mon=MON[i%MON.length];SC.monState='enter';SC.monA=0;SC.charge=0;SC.heroDown=false}\r
function spawnBoss(){SC.boss=true;SC.mon=BOSS;SC.monState='enter';SC.monA=0;SC.bossHP=1;SC.bossDead=false;$('#bossHud').classList.remove('hide');$('#bossFill').style.width='100%';SC.shake=.5;SFX.boom()}\r
function monsterHit(cb){SC.casting=.25;SFX.cast();const pw=1+SC.energy/80;fire(heroXY(),monXY(),'#ffd166',pw,()=>{SC.flash=.25;SC.shake=.12;SFX.hit();const[mx,my]=monXY();burst(mx,my-30,18,['#ffd166','#fff','#ff9f43'],5);burst(mx,my-30,5,['#ffd166'],4,'🪙');cb&&cb()})}\r
function heroGetsHit(){const[mx,my]=monXY();fire([mx,my],heroXY(),'#ff4d5e',1.2,()=>{SC.heroHurt=.5;SC.shake=.35;SFX.hurt();const[hx,hy]=heroXY();burst(hx,hy-30,16,['#ff4d5e','#ff9aa5'],5);say(hx,hy-70,'Bị đánh!','#ff6b81',20)})}\r
\r
/* ================= LUỒNG THI ================= */\r
let Q=[],cur=0,A=[],t0=0,tick=null,locked=false,tabOut=0,startedAt=0,submitting=false,submitted=false,lastBeep=99;\r
const show=id=>{['start','quiz','review','result'].forEach(x=>$('#s-'+x).classList.toggle('hide',x!==id));$('#s-quiz').style.display=id==='quiz'?'flex':'';scrollTo(0,0)};\r
\r
/* Câu hỏi do frame cha đẩy xuống — mở file trực tiếp thì không có nguồn nào cả. */\r
function applyQuestions(list){\r
  Q=(Array.isArray(list)?list:[]).filter(q=>q&&q.id&&q.content);\r
  const b=$('#btnStart');\r
  if(!Q.length){\r
    b.disabled=true;b.textContent='Chờ câu hỏi từ ứng dụng…';\r
    const er=$('#loadErr');er.classList.remove('hide');\r
    er.textContent='Mẫu đề thi này không tự tải câu hỏi. Mở bài thi trong ứng dụng (đường dẫn /assignment/…) để nhận câu hỏi từ giáo viên đã chọn.';\r
    return;\r
  }\r
  $('#loadErr').classList.add('hide');\r
  $('#stQ').textContent=Q.length;\r
  $('#stP').textContent=Q.reduce((s,q)=>s+(q.points||0),0);\r
  $('#stT').textContent=Q.reduce((s,q)=>s+(q.timeLimit||30),0);\r
  b.disabled=false;b.textContent='⚔️ Vào trận';\r
  newMonster(0);SC.monA=1;SC.monState='idle';\r
}\r
function resetRun(){cur=0;A=Q.map(q=>({questionId:q.id,answerIds:[],text:'',timeSpent:0,answered:false}));tabOut=0;submitting=false;submitted=false;startedAt=Date.now();setEnergy(0);$('#cheat').classList.add('hide');$('#bossHud').classList.add('hide');SC.boss=false;SC.bossHP=1;SC.bossDead=false}\r
const tower=()=>{$('#tower').innerHTML=Q.map((q,i)=>\`<div class="fl \${i<cur?(A[i].answered?'done':'skip'):i===cur?'cur':''}"></div>\`).join('')};\r
const isTextMode=q=>q.inputMode==='text'||q.inputMode==='input'||q.inputMode==='essay'||!q.options||!q.options.length;\r
const isMulti=q=>q.inputMode==='multiple'||q.inputMode==='multi'||q.inputMode==='checkbox';\r
function renderQ(){\r
  const q=Q[cur];locked=false;tower();lastBeep=99;\r
  $('#qIdx').textContent=\`Quái \${cur+1} / \${Q.length}\`;$('#hFloor').textContent=\`⚔️ Màn \${cur+1}/\${Q.length}\`;\r
  $('#qPts').textContent='⭐ '+(q.points||0)+' điểm';$('#qtext').textContent=q.content;\r
  const o=$('#opts'),tw=$('#txtWrap');\r
  if(isTextMode(q)){o.innerHTML='';tw.classList.remove('hide');$('#txtIn').value='';setTimeout(()=>$('#txtIn').focus(),50)}\r
  else{tw.classList.add('hide');o.innerHTML=q.options.map((x,i)=>\`<button class="opt \${isMulti(q)?'multi':''}" data-id="\${esc(x.id)}"><span class="k">\${String.fromCharCode(65+i)}</span><span>\${esc(x.content)}</span></button>\`).join('')}\r
  $('#btnNext').textContent=cur===Q.length-1?'🔥 Tung phép cuối!':'🔥 Tung phép!';\r
  newMonster(cur);t0=Date.now();drawTimer(q.timeLimit||30,q.timeLimit||30);\r
  clearInterval(tick);tick=setInterval(()=>{\r
    const lim=q.timeLimit||30,el=(Date.now()-t0)/1000,rem=Math.max(0,lim-el);drawTimer(rem,lim);SC.charge=1-rem/lim;\r
    if(rem<=5&&Math.ceil(rem)!==lastBeep){lastBeep=Math.ceil(rem);if(rem>0)SFX.tick()}\r
    if(rem<=0){clearInterval(tick);finishQ(true)}\r
  },100);\r
}\r
function drawTimer(rem,total){\r
  const r=$('#ring');$('#rnum').textContent=Math.ceil(rem);$('#rfg').style.strokeDashoffset=201.06*(1-rem/total);\r
  r.classList.toggle('warn',rem/total<=.5&&rem/total>.2);r.classList.toggle('danger',rem/total<=.2);\r
}\r
$('#opts').addEventListener('click',e=>{\r
  if(locked)return;const b=e.target.closest('.opt');if(!b)return;ac();SFX.click();const q=Q[cur];\r
  if(isMulti(q))b.classList.toggle('sel');else document.querySelectorAll('.opt').forEach(x=>x.classList.toggle('sel',x===b));\r
});\r
function collect(){\r
  const q=Q[cur],a=A[cur];a.timeSpent=Math.min(q.timeLimit||30,Math.round((Date.now()-t0)/100)/10);\r
  if(isTextMode(q)){a.text=$('#txtIn').value.trim();a.answerIds=[];a.answered=!!a.text}\r
  else{a.answerIds=[...document.querySelectorAll('.opt.sel')].map(x=>x.dataset.id);a.answered=a.answerIds.length>0}\r
}\r
function finishQ(timeout){\r
  if(locked)return;locked=true;clearInterval(tick);collect();reportAnswer(A[cur]);ac();\r
  const a=A[cur],q=Q[cur],lim=q.timeLimit||30,[mx,my]=monXY(),[hx,hy]=heroXY();SC.charge=0;\r
  const next=()=>{cur++;if(cur>=Q.length)openReview();else renderQ()};\r
  if(timeout&&!a.answered){say(hx,hy-80,'Hết giờ!','#ff6b81',22);heroGetsHit();setTimeout(next,1000);return}\r
  if(!a.answered){say(mx,my-80,'Bỏ qua','#b9b0dc',18);SC.monState='dying';setTimeout(next,600);return}\r
  setEnergy(SC.energy+(100/Q.length)*(.6+.4*(1-A[cur].timeSpent/lim)));\r
  say(mx,my-85,'Đã ghi nhận ✓','#ffd166',20);\r
  monsterHit(()=>{SC.monState='dying';});\r
  setTimeout(next,950);\r
}\r
$('#btnNext').onclick=()=>finishQ(false);\r
$('#txtIn').addEventListener('keydown',e=>{if(e.key==='Enter')finishQ(false)});\r
addEventListener('keydown',e=>{\r
  if($('#s-quiz').classList.contains('hide')||locked)return;\r
  const q=Q[cur];if(!q||isTextMode(q)||document.activeElement===$('#txtIn'))return;\r
  const i=e.key.toUpperCase().charCodeAt(0)-65;\r
  if(e.key.length===1&&i>=0&&i<q.options.length)document.querySelectorAll('.opt')[i].click();else if(e.key==='Enter')finishQ(false);\r
});\r
document.addEventListener('visibilitychange',()=>{\r
  if(document.hidden&&!$('#s-quiz').classList.contains('hide')&&!locked){tabOut++;const c=$('#cheat');c.classList.remove('hide');c.textContent=\`⚠️ Bạn đã rời khỏi trang thi \${tabOut} lần. Việc này được ghi nhận.\`}\r
});\r
$('#btnStart').onclick=()=>{\r
  const n=$('#name').value.trim();\r
  if(!n){$('#name').focus();$('#name').style.outline='2px solid var(--bad)';return}\r
  ac();resetRun();show('quiz');banner('VÀO TRẬN!',900);SFX.cast();renderQ();\r
};\r
\r
function openReview(){\r
  tower();\r
  $('#rvList').innerHTML=Q.map((q,i)=>{\r
    const a=A[i];let t='Chưa trả lời';\r
    if(a.answered)t=a.text?esc(a.text):a.answerIds.map(id=>esc((q.options.find(o=>o.id===id)||{}).content||id)).join(', ');\r
    return\`<div class="rv"><span>\${i+1}. \${esc(q.content)}</span><span class="a \${a.answered?'':'none'}">\${t}</span></div>\`}).join('');\r
  $('#subErr').classList.add('hide');$('#btnSubmit').disabled=false;$('#btnSubmit').textContent='⚡ NỘP BÀI VÀ ĐÁNH BOSS';\r
  $('#hFloor').textContent='🐲 Trận cuối';spawnBoss();banner('BOSS XUẤT HIỆN!',1500);show('review');\r
}\r
$('#btnSubmit').onclick=()=>{\r
  if(submitting||submitted)return;ac();\r
  SC.casting=1.5;SC.charge=0;\r
  submitToHost(false);\r
};\r
/* màn tiết lộ điểm: boss mất máu theo điểm thật do server chấm */\r
function reveal(res){\r
  submitted=true;submitting=false;\r
  show('result');\r
  const max=res&&res.max!=null?res.max:Q.reduce((s,q)=>s+(q.points||0),0);\r
  const score=res&&typeof res.score==='number'?res.score:0;\r
  const body=$('#resBody');\r
  const ratio=clamp(score/(max||1),0,1);\r
  body.innerHTML=\`<h1 style="text-align:center">⚔️ Đang giáng đòn…</h1><div class="big" id="cnt">0</div><div class="mid">trên \${max} điểm</div><div id="rk"></div><div id="fin"></div>\`;\r
  const volleys=6,total=ratio;let fired=0;const pw=1.6+SC.energy/60;\r
  const tellApp=()=>{try{window.parent.postMessage({type:'exam-done'},'*')}catch(_){}};\r
  const shoot=()=>{\r
    if(fired>=volleys||ratio<=0){end();return}\r
    fired++;const frac=total/volleys;SC.casting=.3;SFX.cast();\r
    fire(heroXY(),monXY(),'#ffd166',pw,()=>{SC.flash=.25;SC.shake=.2;SFX.hit();SC.bossHP=Math.max(0,1-frac*fired);$('#bossFill').style.width=SC.bossHP*100+'%';const[mx,my]=monXY();burst(mx,my-50,16,['#ffd166','#fff','#ff6b3d'],6);say(mx,my-110,'-'+Math.round(score/volleys),'#fff',24);$('#cnt').textContent=Math.round(score*fired/volleys);\r
      if(fired===volleys)setTimeout(end,350)});\r
    if(fired<volleys)setTimeout(shoot,420);\r
  };\r
  const end=()=>{\r
    if(end.done)return;end.done=true;$('#cnt').textContent=score;\r
    const rk=ratio>=.9?'S':ratio>=.75?'A':ratio>=.5?'B':'C';\r
    if(ratio>=.999){SC.monState='dying';SC.bossDead=true;SFX.boom();SFX.win();const[mx,my]=monXY();burst(mx,my-50,60,['#ffd166','#ff6b3d','#fff','#8b7bff'],9);burst(mx,my-50,10,['#ffd166'],7,'🪙');banner('BOSS ĐÃ GỤC!',2200);$('#fin').innerHTML='<div class="mid" style="color:var(--gold);font-weight:800;margin-top:8px">Điểm tuyệt đối! Bạn hạ gục boss.</div>'}\r
    else if(ratio>0){banner('BOSS CÒN '+Math.round((1-ratio)*100)+'% MÁU',2200);SFX.win();$('#fin').innerHTML=\`<div class="mid" style="margin-top:8px">Boss còn \${Math.round((1-ratio)*100)}% máu. Xem bảng kết quả để biết câu nào chưa đúng!</div>\`}\r
    else{banner('BOSS CƯỜI NHẠO…',2200);heroGetsHit();$('#fin').innerHTML='<div class="mid" style="margin-top:8px">Chưa có điểm nào. Luyện tập rồi quay lại nhé!</div>'}\r
    $('#rk').innerHTML=\`<div class="rank">\${rk}</div>\`;\r
    document.querySelector('#resBody h1').textContent=ratio>=.999?'🏆 CHIẾN THẮNG!':ratio>0?'⚔️ Trận đấu kết thúc':'💀 Thất bại';\r
    setTimeout(tellApp,900);\r
  };\r
  setTimeout(shoot,500);\r
}\r
$('#btnAgain').onclick=()=>{try{window.parent.postMessage({type:'exam-done'},'*')}catch(_){}};\r
addEventListener('beforeunload',e=>{if(!$('#s-quiz').classList.contains('hide')||(!$('#s-review').classList.contains('hide')&&!submitted)){e.preventDefault();e.returnValue=''}});\r
fit();requestAnimationFrame(loopScene);askReady();\r
<\/script>\r
</body>\r
</html>`,desc:`Leo tháp, mỗi câu hỏi là một con quái. Điểm server chấm quyết định boss mất bao nhiêu máu.`,style:`2D`},{id:`thithap-3d`,name:`🗡️ Đấu Trường Phong Linh 3D`,html:`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
<meta charset="UTF-8">\r
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">\r
<title>Đấu Trường Phong Linh</title>\r
<style>\r
:root{--panel:rgba(46,50,70,.74);--ink:#f4ecd8;--acc:#e8c872;--ring:rgba(244,236,216,.78);--sat:env(safe-area-inset-top,0px);--sab:env(safe-area-inset-bottom,0px);--sal:env(safe-area-inset-left,0px);--sar:env(safe-area-inset-right,0px)}\r
*{box-sizing:border-box;margin:0;-webkit-tap-highlight-color:transparent;touch-action:none;user-select:none;-webkit-user-select:none}\r
html,body{height:100%;overflow:hidden;background:#9cc8ee;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink)}\r
canvas{position:fixed;inset:0;width:100%;height:100%}\r
#fx{pointer-events:none}\r
.h{position:fixed;background:var(--panel);border-radius:12px;padding:6px 10px;font-size:13px;pointer-events:none;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}\r
.ui{pointer-events:auto}\r
#mini{top:calc(var(--sat) + 8px);left:calc(var(--sal) + 8px);width:120px;height:120px;padding:0;border-radius:50%;border:3px solid var(--ring);box-shadow:0 0 0 2px #0005,0 4px 10px #0006;background:#24303a}\r
#pl{top:calc(var(--sat) + 16px);left:calc(var(--sal) + 136px);display:flex;gap:10px;align-items:center;border-radius:999px;padding:5px 12px;font-weight:700}\r
#zn{top:calc(var(--sat) + 136px);left:calc(var(--sal) + 8px);font-size:12px;font-weight:700;padding:3px 12px;border-radius:999px;max-width:160px}\r
#q{top:calc(var(--sat) + 168px);left:calc(var(--sal) + 8px);max-width:min(54vw,240px);background:linear-gradient(90deg,rgba(46,50,70,.82) 70%,rgba(46,50,70,0));border-radius:6px;padding:6px 30px 6px 10px;backdrop-filter:none}\r
#q small{display:block;color:var(--acc);font-size:10px;font-weight:700;letter-spacing:.06em}\r
#qt{font-weight:700;font-size:13px;line-height:1.3}\r
#cp{display:flex;align-items:center;gap:6px;margin-top:3px;font-size:12px;opacity:.9}\r
#ar{display:inline-block;font-size:15px;color:#ffd54f;transition:transform .1s}\r
#ico{position:fixed;top:calc(var(--sat) + 8px);right:calc(var(--sar) + 8px);display:flex;gap:8px}\r
.ib{width:40px;height:40px;border-radius:50%;border:2px solid var(--ring);background:var(--panel);color:var(--ink);font-size:18px;display:grid;place-items:center;padding:0;box-shadow:0 2px 6px #0006}\r
#slots{position:fixed;top:calc(var(--sat) + 58px);right:calc(var(--sar) + 8px);display:flex;flex-direction:row-reverse;gap:10px;pointer-events:none}\r
.sl{position:relative;width:46px;height:46px;border-radius:50%;border:2px solid var(--ring);background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.22),transparent 58%),var(--panel);display:grid;place-items:center;font-size:20px;color:var(--ink);font-family:inherit;padding:0;box-shadow:0 2px 6px #0006}\r
.sl.on{border-color:var(--acc);box-shadow:0 0 10px #e8c872aa}\r
.sl i{position:absolute;right:-5px;bottom:-5px;min-width:19px;height:19px;border-radius:10px;background:#f4ecd8;color:#2a2f45;font:700 11px/19px system-ui;text-align:center;padding:0 4px;font-style:normal}\r
#sp::before{content:attr(data-k);position:absolute;left:-5px;top:-5px;width:17px;height:17px;border-radius:50%;background:var(--acc);color:#3a2e12;font:700 10px/17px system-ui;text-align:center}\r
#boss{top:calc(var(--sat) + 8px);left:50%;transform:translateX(-50%);width:210px;display:none;text-align:center;font-size:12px;font-weight:700}\r
.bar{height:8px;border-radius:5px;background:rgba(0,0,0,.45);margin-top:3px;overflow:hidden;border:1px solid #fff4}.bar i{display:block;height:100%;width:100%}\r
#hp{background:linear-gradient(#b8f08a,#6cc24a)}#en{background:linear-gradient(#ffd98a,#f0a020)}#bb{background:linear-gradient(#c9a0f0,#8a5cd0)}\r
#hpw{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--sab) + 4px);width:min(56vw,320px);pointer-events:none}\r
#hpn{text-align:center;font-size:11px;font-weight:700;text-shadow:0 1px 3px #000,0 0 4px #000}\r
.b{position:fixed;border-radius:50%;border:3px solid var(--ring);background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.26),transparent 58%),var(--panel);color:var(--ink);display:grid;place-items:center;box-shadow:0 3px 8px #0007;padding:0;font-size:24px}\r
.b.cdn{background:conic-gradient(rgba(0,0,0,.62) var(--p,0deg),transparent 0),radial-gradient(circle at 35% 28%,rgba(255,255,255,.26),transparent 58%),var(--panel)}\r
.b.rdy{border-color:#ffd54f;box-shadow:0 0 16px #ffd54fcc,0 3px 8px #0007}\r
.b[data-k]::after{content:attr(data-k);position:absolute;right:-5px;bottom:-5px;width:20px;height:20px;border-radius:50%;background:#f4ecd8;color:#2a2f45;font:700 11px/20px system-ui;text-align:center}\r
.b:active{transform:scale(.94)}\r
#bA{right:calc(var(--sar) + 16px);bottom:calc(var(--sab) + 22px);width:88px;height:88px;font-size:38px}\r
#bS{right:calc(var(--sar) + 114px);bottom:calc(var(--sab) + 22px);width:62px;height:62px}\r
#bU{right:calc(var(--sar) + 100px);bottom:calc(var(--sab) + 92px);width:62px;height:62px}\r
#bD{right:calc(var(--sar) + 22px);bottom:calc(var(--sab) + 120px);width:58px;height:58px}\r
#bT{position:fixed;left:57%;top:50%;display:none;align-items:center;gap:8px;padding:6px 16px 6px 7px;border-radius:10px;background:rgba(46,50,70,.9);border:2px solid var(--ring);color:var(--ink);font:700 16px system-ui;box-shadow:0 3px 8px #0007}\r
#bT .kk{width:26px;height:26px;border-radius:50%;background:#f4ecd8;color:#2a2f45;display:grid;place-items:center;font-size:13px}\r
.cd{position:absolute;top:-5px;right:-5px;background:#e8453c;color:#fff;border-radius:9px;font-size:11px;min-width:18px;text-align:center;display:none;z-index:1}\r
#jz{position:fixed;left:0;bottom:0;width:42%;height:60%}\r
#jb,#jk{position:fixed;border-radius:50%;display:none;pointer-events:none}\r
#jb{width:110px;height:110px;background:#fff3;border:2px solid #fff7}#jk{width:50px;height:50px;background:#fffb}\r
#dlg{position:fixed;left:50%;transform:translateX(-50%);width:min(92vw,560px);bottom:calc(var(--sab) + 26px);background:rgba(36,38,56,.93);border:1px solid rgba(232,200,114,.55);border-radius:10px;color:#f4ecd8;padding:14px 18px;display:none;box-shadow:0 6px 18px #0008;z-index:4}\r
#dn{font-weight:700;color:var(--acc);margin-bottom:6px;font-size:15px}#dt{font-size:16px;line-height:1.5}#dg{text-align:right;font-size:12px;color:var(--acc);opacity:.8;margin-top:6px}\r
#ts{position:fixed;left:50%;top:calc(var(--sat) + 74px);transform:translateX(-50%);background:var(--panel);padding:8px 16px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .3s;pointer-events:none;max-width:90vw;text-align:center;z-index:9;border:1px solid rgba(232,200,114,.4)}\r
#shop{position:fixed;inset:0;background:#0008;display:none;place-items:center;padding:12px;z-index:6}\r
#sh,#sh *{touch-action:pan-y}\r
#sh{background:rgba(40,44,64,.96);border:1px solid rgba(232,200,114,.55);border-radius:14px;padding:16px;width:min(94vw,480px);max-height:92vh;overflow:auto;box-shadow:0 8px 24px #000a}\r
#sh h2{font-size:20px;margin-bottom:6px;color:var(--acc)}\r
#si{font-size:13px;line-height:1.7;margin-bottom:10px;opacity:.95}\r
.it{display:flex;flex-direction:column;align-items:flex-start;gap:2px;width:100%;text-align:left;font:inherit;color:var(--ink);background:rgba(255,255,255,.1);border:1px solid rgba(232,200,114,.45);border-radius:10px;padding:8px 12px;margin-bottom:8px;pointer-events:auto}\r
.it b{font-size:15px}.it small{opacity:.8;font-size:12px}\r
.it:disabled{opacity:.4}\r
.it:not(:disabled):active{transform:translateY(2px)}\r
#sx{font:inherit;font-weight:700;width:100%;background:var(--acc);color:#3a2e12;border:0;border-radius:10px;padding:11px;margin-top:2px;pointer-events:auto}\r
#intro{position:fixed;inset:0;background:linear-gradient(#8fd0ff,#cfe9c4);display:grid;place-items:center;text-align:center;padding:20px;overflow:auto;z-index:8}\r
#intro>div{background:rgba(40,44,64,.9);border:1px solid rgba(232,200,114,.55);border-radius:16px;padding:22px;max-width:460px}\r
#intro h1{font-size:26px;margin-bottom:8px;color:var(--acc)}#intro p{font-size:14px;line-height:1.6;margin-bottom:12px}\r
.sw{display:inline-block;width:38px;height:38px;border-radius:50%;border:3px solid transparent;margin:3px;padding:0;pointer-events:auto}.sw.on{border-color:var(--ink)}\r
#go{font:inherit;font-size:18px;font-weight:700;background:var(--acc);color:#3a2e12;border:0;border-radius:12px;padding:12px 28px;margin-top:6px;pointer-events:auto}\r
#saved{font-size:12px;opacity:.75;margin-top:10px;min-height:1em}\r
#intro #ih{font-size:15px;font-weight:700;color:var(--acc);margin-bottom:6px}\r
#rs{font:inherit;font-size:13px;font-weight:700;background:none;border:0;color:var(--acc);text-decoration:underline;margin-top:8px;padding:0;pointer-events:auto}\r
\r
.hide{display:none!important}\r
#qp{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--sab) + 6px);width:min(97vw,780px);max-height:66vh;overflow:auto;background:rgba(26,24,50,.94);border:1px solid rgba(232,200,114,.6);border-radius:14px;padding:10px 12px;z-index:5;display:none;box-shadow:0 6px 22px #000a;touch-action:pan-y}\r
#qh{display:flex;gap:10px;align-items:center}\r
#qtn{flex:none;width:44px;height:44px;border-radius:50%;border:3px solid #6ee7a8;display:grid;place-items:center;font-weight:900;font-size:18px}\r
#qtn.warn{border-color:#ffd166}#qtn.danger{border-color:#ff6b81;color:#ff6b81;animation:pulse .5s infinite}\r
@keyframes pulse{50%{transform:scale(1.15)}}\r
#qtt{flex:1;font-size:16px;font-weight:800;line-height:1.35}\r
#qpt{flex:none;font-size:12px;color:var(--acc);font-weight:800;text-align:right}\r
#qbar{height:5px;border-radius:3px;background:rgba(255,255,255,.18);margin:8px 0;overflow:hidden}#qbf{display:block;height:100%;background:#6ee7a8;width:100%}\r
#qo{display:grid;grid-template-columns:1fr 1fr;gap:8px}\r
@media (max-width:480px){#qo{grid-template-columns:1fr}}\r
.qo{display:flex;align-items:center;gap:9px;text-align:left;font:inherit;font-size:15px;color:var(--ink);background:rgba(255,255,255,.09);border:1.5px solid rgba(255,255,255,.22);border-radius:11px;padding:9px 11px;cursor:pointer}\r
.qo .k{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.2);font-weight:800;font-size:13px}\r
.qo.multi .k{border-radius:7px}\r
.qo.sel{border-color:var(--acc);background:rgba(232,200,114,.2)}.qo.sel .k{background:var(--acc);color:#3a2e12}\r
#qin{font:inherit;width:100%;padding:11px 12px;border-radius:10px;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:var(--ink);font-size:16px;user-select:text;-webkit-user-select:text}\r
#qgo,#btnSubmit{font:inherit;font-weight:800;width:100%;border:0;border-radius:11px;padding:11px;margin-top:9px;background:linear-gradient(135deg,#ffd166,#ff8a3d);color:#3a1d00;font-size:15px;cursor:pointer}\r
#btnSubmit{margin-bottom:8px;margin-top:4px}\r
.rv{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.15);font-size:13px}\r
.rv:last-child{border:0}.rv .a{color:var(--acc);font-weight:800;text-align:right}.rv .a.none{color:#ff6b81}\r
.err{color:#ff6b81;font-size:13px;margin:6px 0}\r
.big{font-size:56px;font-weight:900;color:var(--acc);text-align:center;line-height:1.1}\r
.rank{width:76px;height:76px;margin:10px auto;border-radius:50%;display:grid;place-items:center;font-size:40px;font-weight:900;border:4px solid var(--acc);color:var(--acc)}\r
.mid{text-align:center;opacity:.85;font-size:14px;line-height:1.5;margin-top:4px}\r
#name{font:inherit;width:100%;padding:12px;border-radius:12px;border:1.5px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:var(--ink);font-size:16px;margin:8px 0;user-select:text;-webkit-user-select:text;pointer-events:auto}\r
#go[disabled]{opacity:.5}\r
</style>\r
</head>\r
<body>\r
<canvas id="view"></canvas><canvas id="fx"></canvas>\r
<canvas class="h" id="mini" width="240" height="240"></canvas>\r
<div class="h" id="pl"><span id="lv"></span><span id="mo"></span></div>\r
<div class="h" id="zn"></div>\r
<div class="h" id="q"><small>◆ NHIỆM VỤ</small><div id="qt"></div><div id="cp"><span id="ar">▲</span><span id="qd"></span></div></div>\r
<div id="ico"><button class="ib ui" id="isnd" aria-label="Âm thanh">🔊</button></div>\r
<div class="h" id="boss"><div id="bn"></div><div class="bar"><i id="bb"></i></div></div>\r
<div id="hpw"><div id="hpn"></div><div class="bar"><i id="hp"></i></div><div class="bar" style="height:4px"><i id="en"></i></div></div>\r
<div id="jz"></div><div id="jb"></div><div id="jk"></div>\r
<button class="b" id="bA" aria-label="Chém">⚔️</button>\r
<button class="b" id="bD" data-k="⇧" aria-label="Lướt">💨</button>\r
<button class="ui" id="bT"><span class="kk">F</span><span id="btx"></span></button>\r
<div id="dlg"><div id="dn"></div><div id="dt"></div><div id="dg">chạm để tiếp ▶</div></div>\r
<div id="qp"><div id="qh"><div id="qtn">0</div><div id="qtt"></div><div id="qpt"></div></div><div id="qbar"><i id="qbf"></i></div><div id="qo"></div><div id="qtw" class="hide"><input type="text" id="qin" placeholder="Nhập câu trả lời…" autocomplete="off"></div><button id="qgo">🔥 Tung phép</button></div>\r
<div id="shop"><div id="sh"><h2 id="shopT"></h2><div id="si"></div><div id="sl"></div><div id="subErr" class="err hide"></div><button id="btnSubmit" class="hide">⚡ Nộp bài và đánh Thạch Giáp</button><button id="sx"></button></div></div>\r
<div id="ts"></div>\r
<div id="intro"><div><h1>🗡️ Đấu Trường Phong Linh</h1><p id="ih"></p>\r
<p>Bài thi nằm giữa thế giới 3D. Mỗi câu hỏi do một <b>thủ vệ</b> canh giữ, đứng dọc đường từ làng, qua cầu, vào thành rồi xuống hang. Tìm thủ vệ, bấm <b>F</b> để thách đấu và trả lời trong thời gian giới hạn. Hết giờ là bị bỏ qua. Vượt hết thủ vệ để đánh thức <b>Thạch Giáp</b>, nộp bài và xem điểm quyết định số máu boss mất.<br><b>Kéo trái:</b> di chuyển · <b>kéo phải:</b> nhìn quanh · ⚔️ chém cây · 💨 lướt<br><small>PC: WASD, chuột nhìn quanh, F = tương tác, Shift = lướt. Đáp án đúng chỉ hiện sau khi nộp bài.</small></p>\r
<input type="text" id="name" placeholder="Tên chiến binh của bạn" maxlength="60" autocomplete="name">\r
<div>Chọn màu áo của bạn:</div><div id="sws"></div><button id="go" disabled>Chờ câu hỏi từ ứng dụng…</button><div id="saved"></div></div></div>\r
<script>\r
'use strict';\r
const $=s=>document.querySelector(s),M=Math,R=M.random,rnd=(a,b)=>a+R()*(b-a),ri=(a,b)=>M.floor(rnd(a,b+1)),clamp=(v,a,b)=>v<a?a:v>b?b:v,TAU=M.PI*2,pick=a=>a[ri(0,a.length-1)];\r
const view=$('#view'),vc=view.getContext('2d'),fxc=$('#fx'),fx=fxc.getContext('2d'),mini=$('#mini'),mc=mini.getContext('2d');\r
let RW,RH,u,img,buf,zb;const PL=.72,CAM={};\r
function rs(){RW=M.min(420,innerWidth);RH=M.round(RW*innerHeight/innerWidth);view.width=RW;view.height=RH;const D=M.min(devicePixelRatio||1,2);fxc.width=innerWidth*D;fxc.height=innerHeight*D;u=M.min(fxc.width,fxc.height)/360;img=vc.createImageData(RW,RH);buf=new Uint32Array(img.data.buffer);zb=new Float32Array(RW)}\r
addEventListener('resize',rs);rs();\r
/* ---- âm thanh ---- */\r
let mute=0,AC=null;function ac(){if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}AC&&AC.state==='suspended'&&AC.resume()}\r
function bp(f,d,ty,v,f2){if(!AC||mute)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(M.max(30,f2||f),t+d);g.gain.setValueAtTime(v||.14,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02)}\r
/*MAPSTART*/\r
/* ---- bản đồ 72x72 ----\r
 * map: tường (0 trống, 1 đá, 2 nhà làng, 3 phế tích, 4 gỗ, 5 bụi, 6 đá hang, 7 nhà thành, 8 tinh thạch, 9 đài phun nước, 10 tường thành)\r
 * FM : nền (0 cỏ, 1 đường đất, 2 nước suối, 3 cầu gỗ, 4 nền hang, 5 lát đá thành) */\r
const N=72,map=new Uint8Array(N*N),FM=new Uint8Array(N*N);\r
const st=(x,y,t)=>{if(x>=0&&y>=0&&x<N&&y<N)map[y*N+x]=t},sf=(x,y,t)=>{if(x>=0&&y>=0&&x<N&&y<N)FM[y*N+x]=t};\r
const box=(x0,y0,x1,y1,t)=>{for(let x=x0;x<=x1;x++){st(x,y0,t);st(x,y1,t)}for(let y=y0;y<=y1;y++){st(x0,y,t);st(x1,y,t)}};\r
const fillF=(x0,y0,x1,y1,t)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)sf(x,y,t)};\r
const carve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){st(x,y,0);sf(x,y,4)}};\r
box(0,0,N-1,N-1,1);\r
let sd=11;const sr=()=>(sd=sd*16807%2147483647)/2147483647;\r
/* suối bạc chảy từ bắc xuống nam */\r
const rvC=y=>37+4*M.sin(y*.13+1);\r
for(let y=0;y<N;y++){const c=rvC(y+.5);for(let x=0;x<N;x++)if(M.abs(x+.5-c)<1.8)sf(x,y,2)}\r
const bridge=y=>{const c=rvC(y+.5);for(let yy=y;yy<=y+1;yy++)for(let x=M.floor(c-3);x<=M.ceil(c+3);x++)sf(x,yy,3)};\r
bridge(19);bridge(46);\r
/* đường đất */\r
const path=pts=>{for(let i=0;i<pts.length-1;i++){const ax=pts[i][0],ay=pts[i][1],bx=pts[i+1][0],by=pts[i+1][1],n=M.ceil(M.hypot(bx-ax,by-ay)*2);for(let k=0;k<=n;k++){const px=(ax+(bx-ax)*k/n)|0,py=(ay+(by-ay)*k/n)|0;for(let oy=0;oy<2;oy++)for(let ox=0;ox<2;ox++){const tx=px+ox,ty=py+oy;if(tx>=0&&ty>=0&&tx<N&&ty<N&&FM[ty*N+tx]===0)FM[ty*N+tx]=1}}}};\r
path([[10,10],[18,13],[26,17],[32,19.7],[39,19.7],[44,19.7],[47,15],[48,14]]);\r
path([[10,10],[10,18],[12,28],[14,38],[14,41]]);\r
path([[19,45],[26,46],[32,46.7],[40,46.7],[43,47.5]]);\r
path([[44,19.7],[43.5,30],[43.5,40],[43.5,50]]);\r
fillF(2,6,16,12,1);\r
/* làng Phong Linh */\r
box(3,2,7,5,2);st(5,5,0);box(11,2,15,5,2);st(13,5,0);box(3,13,7,16,2);st(5,13,0);box(11,13,15,16,2);st(13,13,0);\r
/* thành Kim Long */\r
box(48,2,70,26,10);st(48,13,0);st(48,14,0);st(59,26,0);st(60,26,0);\r
fillF(49,3,69,25,5);sf(48,13,5);sf(48,14,5);sf(59,26,5);sf(60,26,5);\r
box(52,5,58,9,7);st(55,9,0);box(62,5,67,9,7);st(64,9,0);box(52,17,57,22,7);st(54,17,0);box(62,17,67,22,7);st(64,17,0);\r
[[59,12],[60,12],[59,13],[60,13]].forEach(p=>st(p[0],p[1],9));\r
/* trại goblin */\r
box(9,40,19,50,4);st(14,40,0);st(15,40,0);st(9,45,0);st(19,45,0);fillF(10,41,18,49,1);\r
/* hang Hắc Thạch */\r
for(let y=38;y<=70;y++)for(let x=45;x<=70;x++)st(x,y,sr()<.06?8:6);\r
[[45,51,49,53],[50,48,59,57],[54,43,56,47],[49,39,59,42],[53,58,55,62],[46,63,60,68],[61,64,63,66],[64,59,69,69],[60,50,65,51],[66,46,69,54]].forEach(r=>carve(r[0],r[1],r[2],r[3]));\r
[[53,51],[56,54],[52,55],[50,65],[54,66],[57,64],[65,61],[68,61],[65,68],[68,68],[67,48],[67,52]].forEach(p=>st(p[0],p[1],6));\r
for(let y=38;y<=70;y++)for(let x=45;x<=70;x++){if(map[y*N+x]!==6)continue;if((x>0&&FM[y*N+x-1]===4)||(x<N-1&&FM[y*N+x+1]===4)||(y>0&&FM[(y-1)*N+x]===4)||(y<N-1&&FM[(y+1)*N+x]===4)){if(sr()<.16)st(x,y,8)}}\r
/* điểm đặc biệt */\r
const CHESTS=[[20.5,14.5],[6.5,28.5],[26.5,36.5],[30.5,5.5],[12.5,60.5],[28.5,66.5],[46.5,30.5],[62.5,33.5],[17.2,47.8],[67.5,49.5],[68.5,52.5],[57.5,66.5]];\r
const GEMS=[[50.5,40.5],[54.5,41.5],[57.5,40.5],[51.5,53.5],[48.5,66.5],[68.5,47.5],[66.5,68.5]];\r
const RES=[[9.5,10.4],[8.6,8],[11.8,9.8],[6.2,10.6],[55.5,11.2],[64.5,15.2],[50.3,12.3],[56.5,15.3],[14.5,45.5]].concat(CHESTS);\r
const inVillage=(x,y)=>x<20&&y<20,inCity=(x,y)=>x>=46&&y<=28,inCamp=(x,y)=>x>=7&&x<=21&&y>=38&&y<=52,inCave=(x,y)=>x>=44&&y>=36;\r
const okSpot=(x,y,r)=>{const i=(y|0)*N+(x|0);return !map[i]&&FM[i]===0&&!inVillage(x,y)&&!inCity(x,y)&&!inCave(x,y)&&!RES.some(p=>M.hypot(p[0]-x,p[1]-y)<r)};\r
/* đá, bụi cây */\r
for(let i=0,c=0;i<3000&&c<130;i++){const x=2+(sr()*(N-4)|0),y=2+(sr()*(N-4)|0);if(okSpot(x+.5,y+.5,1.6)&&!inCamp(x,y)){st(x,y,sr()<.5?1:5);c++}}\r
/* cây cối (chặt được) */\r
const TR=[];for(let i=0;i<3500&&TR.length<360;i++){const x=1.5+sr()*(N-3),y=1.5+sr()*(N-3);if(!okSpot(x,y,1.3)||inCamp(x,y))continue;TR.push({x,y,v:(sr()*3)|0,hp:3,cut:0,rt:0,sh:0})}\r
/* vật trang trí: đuốc hang + lửa trại */\r
const DEC=[];\r
[[46.5,51.3],[46.5,52.8],[50.5,48.5],[58.5,48.5],[50.5,56.5],[58.5,56.5],[49.5,39.5],[58.5,39.5],[46.5,63.5],[59.5,63.5],[46.5,67.5],[59.5,67.5],[64.5,60],[69.4,60],[64.5,68.5],[69.4,68.5],[66.5,46.5],[69.4,46.5],[54.5,60.5]].forEach(p=>{DEC.push({x:p[0],y:p[1],k:'torch',sz:.7});DEC.push({x:p[0],y:p[1],k:'fire',z:.4,sz:1.1,add:1,f:1})});\r
DEC.push({x:14.5,y:45.5,k:'camp',sz:.7});DEC.push({x:14.5,y:45.5,k:'fire',z:.15,sz:1.5,add:1,f:1});\r
for(let i=0,nt=0,nf=0;i<12000&&(nt<560||nf<220);i++){const x=1.5+sr()*(N-3),y=1.5+sr()*(N-3),ix=(y|0)*N+(x|0);if(map[ix]||FM[ix]!==0||inCity(x,y)||inCave(x,y))continue;if(sr()<.72){if(nt<560){nt++;DEC.push({x,y,k:'tuft',sz:.3+sr()*.25,r:15})}}else if(nf<220){nf++;DEC.push({x,y,k:'fl'+((sr()*3)|0),sz:.3,r:13})}}\r
/*MAPEND*/\r
const solid=(x,y)=>x<0||y<0||x>=N||y>=N||map[(y|0)*N+(x|0)]>0;\r
const fm=(x,y)=>(x>=0&&y>=0&&x<N&&y<N)?FM[(y|0)*N+(x|0)]:0;\r
const hb=(x,y,r)=>solid(x-r,y-r)||solid(x+r,y-r)||solid(x-r,y+r)||solid(x+r,y+r);\r
function mv(e,dx,dy,r){if(!hb(e.x+dx,e.y,r))e.x+=dx;if(!hb(e.x,e.y+dy,r))e.y+=dy}\r
/* ---- texture ---- */\r
function noi(c,a){const x=c.getContext('2d'),d=x.getImageData(0,0,64,64),p=d.data;for(let i=0;i<p.length;i+=4){const n=(R()-.5)*a;p[i]+=n;p[i+1]+=n;p[i+2]+=n}x.putImageData(d,0,0)}\r
function mk(fn,n){const c=document.createElement('canvas');c.width=c.height=64;fn(c.getContext('2d'));noi(c,n||18);return c}\r
const tx32=(fn,n)=>{const c=mk(fn,n);return new Uint32Array(c.getContext('2d').getImageData(0,0,64,64).data.buffer)};\r
const rockBlobs=(x,base,h,l0)=>{x.fillStyle=base;x.fillRect(0,0,64,64);for(let i=0;i<16;i++){x.fillStyle=\`hsl(\${h},10%,\${l0+R()*20}%)\`;x.beginPath();x.ellipse(R()*64,R()*64,5+R()*10,4+R()*8,R()*3,0,TAU);x.fill()}x.strokeStyle='#17141f';x.lineWidth=2;for(let i=0;i<7;i++){x.beginPath();x.moveTo(R()*64,R()*64);x.lineTo(R()*64,R()*64);x.stroke()}};\r
const WT=[null,\r
 mk(x=>{x.fillStyle='#8a8478';x.fillRect(0,0,64,64);for(let i=0;i<14;i++){x.fillStyle=\`hsl(40,8%,\${40+R()*28}%)\`;x.beginPath();x.ellipse(R()*64,R()*64,6+R()*10,4+R()*7,R()*3,0,TAU);x.fill()}x.strokeStyle='#4a463e';for(let i=0;i<6;i++){x.beginPath();x.moveTo(R()*64,R()*64);x.lineTo(R()*64,R()*64);x.stroke()}}),\r
 mk(x=>{x.fillStyle='#f3e0b8';x.fillRect(0,0,64,64);x.fillStyle='#a89683';x.fillRect(0,46,64,18);x.fillStyle='#8a5a30';[0,59].forEach(y=>x.fillRect(0,y,64,5));[0,59,29].forEach(a=>x.fillRect(a,0,5,64));x.fillStyle='#8fc8e8';x.fillRect(8,12,18,22);x.fillRect(38,12,18,22);x.fillStyle='#8a5a30';x.fillRect(16,12,2,22);x.fillRect(46,12,2,22)}),\r
 mk(x=>{x.fillStyle='#4a4a40';x.fillRect(0,0,64,64);for(let j=0;j<4;j++)for(let i=-1;i<3;i++){x.fillStyle=\`hsl(40,14%,\${55+R()*14}%)\`;x.fillRect(i*32+(j%2)*16+1,j*16+1,30,14)}for(let k=0;k<26;k++){x.fillStyle=\`rgba(60,130,60,\${.3+R()*.4})\`;x.beginPath();x.arc(R()*64,R()*64,2+R()*6,0,TAU);x.fill()}}),\r
 mk(x=>{for(let i=0;i<8;i++){x.fillStyle=\`hsl(28,45%,\${28+R()*14}%)\`;x.fillRect(i*8,0,8,64);x.fillStyle='#2a1a0c';x.fillRect(i*8,0,1,64)}x.fillStyle='#3a2410';x.fillRect(0,18,64,5);x.fillRect(0,44,64,5)}),\r
 mk(x=>{x.fillStyle='#2f7a3a';x.fillRect(0,0,64,64);for(let i=0;i<70;i++){x.fillStyle=\`hsl(\${100+R()*30},55%,\${25+R()*30}%)\`;x.beginPath();x.arc(R()*64,R()*64,3+R()*5,0,TAU);x.fill()}for(let i=0;i<7;i++){x.fillStyle=pick(['#fff','#ffd54f','#f48fb1']);x.fillRect(R()*64,R()*64,3,3)}}),\r
 /* 6 đá hang */\r
 mk(x=>rockBlobs(x,'#3b3748',255,18)),\r
 /* 7 nhà trong thành */\r
 mk(x=>{x.fillStyle='#efe3c8';x.fillRect(0,0,64,64);x.fillStyle='#b5452f';x.fillRect(0,0,64,16);x.fillStyle='#8f3322';for(let i=0;i<4;i++)x.fillRect(i*16+2,10,12,4);x.fillStyle='#6a4426';x.fillRect(0,16,64,4);x.fillRect(0,58,64,6);x.fillRect(0,16,4,48);x.fillRect(60,16,4,48);x.fillRect(30,16,4,48);x.fillStyle='#7fb8e0';x.fillRect(8,28,17,18);x.fillRect(38,28,17,18);x.fillStyle='#3f7a52';x.fillRect(5,28,3,18);x.fillRect(25,28,3,18);x.fillRect(35,28,3,18);x.fillRect(55,28,3,18);x.fillStyle='#6a4426';x.fillRect(8,36,17,2);x.fillRect(38,36,17,2)},10),\r
 /* 8 tinh thạch hang */\r
 mk(x=>{rockBlobs(x,'#3b3748',255,18);[[14,24],[40,16],[52,44],[24,50],[34,34]].forEach(p=>{poly(x,[[p[0],p[1]-14],[p[0]+7,p[1]+6],[p[0]-7,p[1]+6]],'#6fd6ff');poly(x,[[p[0],p[1]-14],[p[0]+7,p[1]+6],[p[0],p[1]+6]],'#c8f2ff')})},12),\r
 /* 9 đài phun nước */\r
 mk(x=>{x.fillStyle='#8aa6c8';x.fillRect(0,0,64,64);x.fillStyle='#e3edf8';x.fillRect(0,0,64,10);x.fillRect(0,54,64,10);x.fillStyle='#4a9ae0';for(let i=0;i<5;i++)x.fillRect(0,14+i*8,64,4);x.fillStyle='#bfe4ff';for(let i=0;i<10;i++)x.fillRect(R()*60,14+R()*34,6,2)},10),\r
 /* 10 tường thành */\r
 mk(x=>{x.fillStyle='#6d695f';x.fillRect(0,0,64,64);for(let j=0;j<4;j++)for(let i=-1;i<3;i++){x.fillStyle=\`hsl(40,8%,\${52+R()*16}%)\`;x.fillRect(i*32+(j%2)*16+1,j*16+1,30,14)}x.fillStyle='#4a463e';x.fillRect(0,0,64,3)},12)];\r
const ft=(base,cols)=>tx32(x=>{x.fillStyle=base;x.fillRect(0,0,64,64);for(let i=0;i<160;i++){x.fillStyle=pick(cols);x.fillRect(R()*64,R()*64,2,3)}},14);\r
const FG=ft('#5aa84a',['#4a9a3c','#6bbd58','#4f9f43']),FD=ft('#c9b07a',['#b89c66','#d8c28e','#bfa56e']),FF=ft('#5aa84a',['#ffd54f','#fff','#f48fb1','#4a9a3c']);\r
const FW=tx32(x=>{x.fillStyle='#2f86c8';x.fillRect(0,0,64,64);for(let j=0;j<8;j++){x.strokeStyle=\`rgba(\${180+j*8},225,255,\${.25+R()*.3})\`;x.lineWidth=2;x.beginPath();for(let i=0;i<=64;i+=4){const y=j*8+4+M.sin(i/64*TAU*2+j)*3;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()}},10);\r
const FB=tx32(x=>{x.fillStyle='#8a5a30';x.fillRect(0,0,64,64);for(let i=0;i<8;i++){x.fillStyle=\`hsl(28,45%,\${30+R()*14}%)\`;x.fillRect(i*8+1,0,6,64)}x.fillStyle='#2a1a0c';for(let i=0;i<8;i++)x.fillRect(i*8,0,1,64);x.fillStyle='#4a3018';x.fillRect(0,8,64,3);x.fillRect(0,40,64,3)},12);\r
const FC=tx32(x=>{x.fillStyle='#4c4860';x.fillRect(0,0,64,64);for(let i=0;i<22;i++){x.fillStyle=\`hsl(255,10%,\${22+R()*22}%)\`;x.beginPath();x.ellipse(R()*64,R()*64,3+R()*7,2+R()*5,R()*3,0,TAU);x.fill()}},16);\r
const FS=tx32(x=>{x.fillStyle='#8a8478';x.fillRect(0,0,64,64);for(let j=0;j<4;j++)for(let i=-1;i<4;i++){x.fillStyle=\`hsl(38,10%,\${58+R()*16}%)\`;x.fillRect(i*16+(j%2)*8+1,j*16+1,14,14)}},12);\r
const FX=[null,FD,FW,FB,FC,FS];\r
/* ---- sprite ---- */\r
function poly(x,p,f){x.fillStyle=f;x.beginPath();p.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.closePath();x.fill()}\r
const sp=(fn,w=128,h=128)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'));return c};\r
const ell=(x,cx,cy,rx,ry,f)=>{x.fillStyle=f;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,TAU);x.fill()};\r
const shd=x=>ell(x,64,122,36,6,'rgba(0,0,0,.28)');\r
const slimeS=(c1,c2)=>sp(x=>{shd(x);const g=x.createRadialGradient(54,70,6,64,90,50);g.addColorStop(0,c1);g.addColorStop(1,c2);x.fillStyle=g;x.beginPath();x.moveTo(18,118);x.bezierCurveTo(10,70,34,36,64,36);x.bezierCurveTo(94,36,118,70,110,118);x.quadraticCurveTo(64,128,18,118);x.fill();ell(x,46,58,12,7,'rgba(255,255,255,.45)');ell(x,50,86,7,10,'#fff');ell(x,78,86,7,10,'#fff');ell(x,51,89,3.5,5,'#222');ell(x,79,89,3.5,5,'#222');ell(x,36,100,6,3.5,'rgba(255,120,150,.5)');ell(x,92,100,6,3.5,'rgba(255,120,150,.5)');x.strokeStyle='#223';x.lineWidth=2.5;x.beginPath();x.arc(64,99,6,.2,M.PI-.2);x.stroke()});\r
const gobS=(skin,cloth,wp)=>sp(x=>{shd(x);\r
 x.fillStyle='#4a7a30';x.fillRect(48,88,12,30);x.fillRect(68,88,12,30);x.fillStyle='#3a2a20';x.fillRect(45,114,18,7);x.fillRect(65,114,18,7);\r
 poly(x,[[44,56],[84,56],[88,96],[40,96]],cloth);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(40,90,48,6);\r
 x.strokeStyle=skin;x.lineWidth=10;x.lineCap='round';x.beginPath();x.moveTo(44,62);x.lineTo(30,92);x.moveTo(84,62);x.lineTo(98,86);x.stroke();\r
 if(wp==='club'){x.strokeStyle='#6b4a2e';x.lineWidth=8;x.beginPath();x.moveTo(98,90);x.lineTo(106,40);x.stroke();ell(x,107,32,12,16,'#7a5632');x.fillStyle='#ccc';x.fillRect(100,28,4,4);x.fillRect(110,36,4,4)}\r
 else{x.strokeStyle='#8a5a30';x.lineWidth=4;x.beginPath();x.arc(104,70,28,-1.2,1.2);x.stroke();x.strokeStyle='#ddd';x.lineWidth=1.5;x.beginPath();x.moveTo(104+28*M.cos(-1.2),70+28*M.sin(-1.2));x.lineTo(104+28*M.cos(1.2),70+28*M.sin(1.2));x.stroke()}\r
 poly(x,[[46,34],[12,22],[44,50]],skin);poly(x,[[82,34],[116,22],[84,50]],skin);ell(x,64,38,22,22,skin);\r
 ell(x,55,36,5,5,'#fff1a8');ell(x,73,36,5,5,'#fff1a8');ell(x,55,37,2.4,3.4,'#c00');ell(x,73,37,2.4,3.4,'#c00');\r
 poly(x,[[62,40],[66,40],[64,49]],'#4f8a34');x.strokeStyle='#2a1a12';x.lineWidth=2.5;x.beginPath();x.moveTo(53,54);x.lineTo(75,54);x.stroke();\r
 poly(x,[[57,54],[61,54],[59,61]],'#fff');poly(x,[[67,54],[71,54],[69,61]],'#fff');\r
 x.strokeStyle='#2a4a1a';x.lineWidth=3;x.beginPath();x.moveTo(48,28);x.lineTo(60,33);x.moveTo(80,28);x.lineTo(68,33);x.stroke();\r
 if(wp!=='club')poly(x,[[42,28],[64,6],[86,28],[78,36],[50,36]],'#5a3a24')});\r
const batS=sp(x=>{ell(x,64,122,22,4,'rgba(0,0,0,.2)');poly(x,[[62,60],[16,34],[8,66],[24,58],[30,78],[42,64],[52,82]],'#4a2e6a');poly(x,[[66,60],[112,34],[120,66],[104,58],[98,78],[86,64],[76,82]],'#4a2e6a');ell(x,64,70,14,20,'#5a3a7a');ell(x,64,48,14,13,'#6a4a8a');poly(x,[[52,44],[48,22],[60,38]],'#6a4a8a');poly(x,[[76,44],[80,22],[68,38]],'#6a4a8a');ell(x,58,48,3.5,4,'#ff5050');ell(x,70,48,3.5,4,'#ff5050');poly(x,[[59,56],[62,63],[65,56]],'#fff');poly(x,[[63,56],[66,63],[69,56]],'#fff')});\r
const golemS=sp(x=>{shd(x);[[[34,110],[28,60],[52,50],[60,110]],[[68,110],[72,50],[98,58],[96,110]],[[40,64],[48,28],[82,26],[90,64]]].forEach((p,i)=>poly(x,p,['#7d7a72','#6d6a62','#8d8a80'][i]));poly(x,[[50,60],[76,60],[72,100],[54,100]],'#9a978c');const g=x.createRadialGradient(64,76,2,64,76,16);g.addColorStop(0,'#fff6c0');g.addColorStop(.5,'#ffa030');g.addColorStop(1,'rgba(255,80,0,0)');x.fillStyle=g;x.fillRect(40,52,48,48);ell(x,58,40,5,4,'#ffa030');ell(x,74,40,5,4,'#ffa030');x.strokeStyle='#3a382f';x.lineWidth=2;x.beginPath();x.moveTo(40,70);x.lineTo(34,90);x.moveTo(86,40);x.lineTo(92,60);x.stroke()});\r
const treeS=(a,b)=>sp(x=>{shd(x);x.fillStyle='#6b4a2e';x.fillRect(58,70,14,52);[[64,50,34],[40,68,24],[90,68,24],[64,28,26]].forEach(([cx,cy,r])=>{const g=x.createRadialGradient(cx-8,cy-8,3,cx,cy,r);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill()})});\r
const pineS=sp(x=>{shd(x);x.fillStyle='#5a3a24';x.fillRect(59,84,12,38);[['#245e34',[[64,6],[96,52],[32,52]]],['#2c7040',[[64,26],[104,80],[24,80]]],['#35804a',[[64,48],[110,108],[18,108]]]].forEach(a=>poly(x,a[1],a[0]));poly(x,[[64,6],[74,30],[54,30]],'#4a9a5a')});\r
const stumpS=sp(x=>{shd(x);x.fillStyle='#7a5632';x.fillRect(40,92,48,26);ell(x,64,118,24,6,'#6a4826');ell(x,64,92,24,9,'#d2ab70');ell(x,64,92,15,5,'#b88e52');ell(x,64,92,6,2.4,'#d2ab70')});\r
const torchS=sp(x=>{ell(x,64,122,14,4,'rgba(0,0,0,.3)');x.fillStyle='#6b4a2e';x.fillRect(60,62,8,60);x.fillStyle='#3a2410';x.fillRect(56,60,16,6);ell(x,64,48,12,19,'#ff9a2e');ell(x,64,53,7,12,'#ffe27a')});\r
const campS=sp(x=>{ell(x,64,116,40,10,'#5a564e');ell(x,64,114,32,7,'#2a2622');x.strokeStyle='#6b4a2e';x.lineWidth=9;x.lineCap='round';x.beginPath();x.moveTo(40,116);x.lineTo(88,104);x.moveTo(88,116);x.lineTo(40,104);x.stroke();for(let i=0;i<8;i++)ell(x,22+i*12+(i%2)*3,116+(i%2)*3,7,5,'#7d7a72')});\r
const chestS=sp(x=>{shd(x);x.fillStyle='#8a5a30';x.fillRect(26,70,76,44);x.beginPath();x.ellipse(64,70,38,20,0,M.PI,0);x.fill();x.fillStyle='#f2c744';x.fillRect(26,84,76,6);x.fillRect(58,66,12,28);x.fillStyle='#fff6c0';x.fillRect(61,76,6,8)});\r
const crysS=(gl,ge,a,b,c)=>sp(x=>{const g=x.createRadialGradient(64,68,4,64,68,50);g.addColorStop(0,gl);g.addColorStop(1,ge);x.fillStyle=g;x.fillRect(0,0,128,128);poly(x,[[64,28],[88,66],[64,108],[40,66]],a);poly(x,[[64,28],[88,66],[64,66]],b);poly(x,[[64,66],[88,66],[64,108]],c)});\r
const heartS=sp(x=>{x.fillStyle='#ef5350';x.beginPath();x.moveTo(64,100);x.bezierCurveTo(20,66,40,28,64,50);x.bezierCurveTo(88,28,108,66,64,100);x.fill();ell(x,50,52,7,5,'rgba(255,255,255,.6)')});\r
const glow=(c)=>sp(x=>{const g=x.createRadialGradient(64,64,2,64,64,62);g.addColorStop(0,'#fff');g.addColorStop(.25,c);g.addColorStop(1,'rgba(255,80,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128)});\r
const arrowS=sp(x=>{const g=x.createRadialGradient(64,64,2,64,64,34);g.addColorStop(0,'#fff');g.addColorStop(.4,'#ffd060');g.addColorStop(1,'rgba(255,120,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);x.strokeStyle='#5a3a24';x.lineWidth=5;x.beginPath();x.moveTo(30,64);x.lineTo(98,64);x.stroke();poly(x,[[98,54],[116,64],[98,74]],'#ccc')});\r
const tuftS=sp(x=>{for(let i=0;i<10;i++){const bx=34+i*6+R()*4,hh=34+R()*40;x.strokeStyle=['#3f9a3a','#5cbb4a','#79d062'][i%3];x.lineWidth=4;x.lineCap='round';x.beginPath();x.moveTo(bx,122);x.quadraticCurveTo(bx+(R()-.5)*20,122-hh*.6,bx+(R()-.5)*34,122-hh);x.stroke()}});\r
const flwS=c=>sp(x=>{x.strokeStyle='#3f9a3a';x.lineWidth=3;x.beginPath();x.moveTo(64,122);x.lineTo(64,84);x.stroke();for(let i=0;i<5;i++){const a=i/5*TAU;x.fillStyle=c;x.beginPath();x.arc(64+M.cos(a)*9,78+M.sin(a)*9,7,0,TAU);x.fill()}ell(x,64,78,5,5,'#ffd54f')});\r
const mark=(t,c)=>sp(x=>{x.fillStyle=c;x.font='bold 110px system-ui';x.textAlign='center';x.fillText(t,64,104);x.strokeStyle='#fff';x.lineWidth=5;x.strokeText(t,64,104);x.fillText(t,64,104)});\r
const npcS=o=>sp(x=>{shd(x);x.fillStyle=o.pants;x.fillRect(46,84,14,34);x.fillRect(68,84,14,34);x.fillStyle='#3a2a20';x.fillRect(44,114,18,7);x.fillRect(66,114,18,7);poly(x,[[42,50],[86,50],[90,90],[38,90]],o.top);x.fillStyle=o.top2;x.fillRect(38,84,52,8);x.fillRect(60,50,8,36);x.strokeStyle=o.top;x.lineWidth=11;x.lineCap='round';x.beginPath();x.moveTo(42,56);x.lineTo(32,86);x.moveTo(86,56);x.lineTo(96,86);x.stroke();ell(x,31,90,6,6,o.skin);ell(x,97,90,6,6,o.skin);ell(x,64,34,20,22,o.skin);x.fillStyle=o.hair;x.beginPath();x.arc(64,30,21,M.PI,0);x.fill();x.fillRect(43,28,6,16);ell(x,55,36,3,4,'#222');ell(x,73,36,3,4,'#222');x.strokeStyle='#7a3b2a';x.lineWidth=2;x.beginPath();x.arc(64,44,5,.3,M.PI-.3);x.stroke();if(o.beard)poly(x,[[46,42],[82,42],[64,70]],o.beard);if(o.hat){ell(x,64,16,30,6,o.hat);poly(x,[[46,16],[52,0],[76,0],[82,16]],o.hat)}if(o.gl){x.strokeStyle='#222';x.lineWidth=2;x.beginPath();x.arc(55,36,7,0,TAU);x.moveTo(69,36);x.arc(73,36,7,0,TAU);x.stroke()}if(o.helm){poly(x,[[42,30],[46,10],[82,10],[86,30],[78,26],[50,26]],o.helm);x.fillStyle='#d94a3a';x.fillRect(60,2,8,12)}});\r
const SPR={sl:[slimeS('#ffb0a0','#e0442c'),slimeS('#a8e0ff','#2a7ad8'),slimeS('#c8f0a0','#4aa83a')],gob:gobS('#6fae45','#7a4a2a','club'),arch:gobS('#8ac04f','#3f5a2a','bow'),bat:batS,boss:golemS,t:[treeS('#7fd070','#2f8a3c'),treeS('#a8d85a','#4a8f2a'),pineS],stump:stumpS,chest:chestS,cry:crysS('rgba(160,230,255,.9)','rgba(80,160,255,0)','#6fd6ff','#c8f2ff','#3aa0e0'),gem:crysS('rgba(255,200,120,.9)','rgba(255,120,40,0)','#ff9a3a','#ffd9a0','#d9601a'),heart:heartS,fire:glow('rgba(255,170,40,.95)'),expl:glow('rgba(255,120,30,.9)'),ex:mark('!','#ffcc33'),qm:mark('?','#ffcc33'),torch:torchS,camp:campS,arrow:arrowS,tuft:tuftS,fl0:flwS('#ffffff'),fl1:flwS('#ffd54f'),fl2:flwS('#f48fb1')};\r
const NP=[\r
 {n:'Trưởng làng Mộc',x:8.6,y:8.0,spr:npcS({skin:'#f3d6b8',hair:'#d8d8d8',beard:'#e6e6e6',top:'#8a5a30',top2:'#e8d8b0',pants:'#4a6a4a',hat:'#d9b45a'}),s:['Thủ vệ đứng dọc theo đường đất, dấu ❗ trên đầu chúng là câu hỏi đang chờ.','Cứ nhìn mũi tên và bản đồ nhỏ, đường đi sẽ dẫn ngươi tới thủ vệ tiếp theo.']},\r
 {n:'Học giả Lam',x:6.2,y:10.6,spr:npcS({skin:'#f3d6b8',hair:'#2a3a6a',top:'#3f6fc4',top2:'#fff',pants:'#f2ede0',gl:1}),s:['Đáp án đúng sẽ chỉ hiện sau khi ngươi nộp bài ở chỗ Thạch Giáp.','Hết giờ thì thủ vệ tung đòn đánh ngươi, nhớ đọc kỹ trước khi chốt!']},\r
 {n:'Đội trưởng Vệ',x:64.5,y:15.2,spr:npcS({skin:'#e8c09a',hair:'#3a2418',top:'#8a8f9a',top2:'#d94a3a',pants:'#3a3f4a',helm:'#6a707c',beard:'#3a2418'}),s:['Thạch Giáp ngủ ở buồng sâu nhất của hang Hắc Thạch, phía đông nam.','Vượt hết thủ vệ thì nó mới thức dậy.']},\r
 {n:'Lính gác cổng',x:50.3,y:12.3,spr:npcS({skin:'#f3d6b8',hair:'#6a4a2a',top:'#8a8f9a',top2:'#4a72b8',pants:'#3a3f4a',helm:'#6a707c'}),s:['Chào mừng đến Thành Kim Long!','Đường xuống hang nằm ở phía nam thành, men theo bờ suối.']}];\r
/* ---- bản đồ nhỏ (vẽ sẵn) ---- */\r
const col=['','#6a6458','#d9b57a','#8a8a70','#7a5030','#2f7a3a','#2a2638','#e8dcc0','#4aa8d8','#5a8ac8','#a09a90'],fcol=['#3d7a46','#c9b07a','#3a8ad0','#8a5a30','#3a3650','#b8b0a0'];\r
const MMS=4,MM=document.createElement('canvas');MM.width=MM.height=N*MMS;\r
(function(){const c=MM.getContext('2d'),k=MMS;c.fillStyle='#3d7a46';c.fillRect(0,0,N*k,N*k);for(let i=0;i<N*N;i++){const x=(i%N)*k,y=((i/N)|0)*k;if(FM[i]){c.fillStyle=fcol[FM[i]];c.fillRect(x,y,k+.5,k+.5)}if(map[i]){c.fillStyle=col[map[i]];c.fillRect(x,y,k+.5,k+.5)}}c.fillStyle='#1f5a2a';for(const t of TR){c.beginPath();c.arc(t.x*k,t.y*k,1.8,0,TAU);c.fill()}})();\r
/* ---- trạng thái ---- */\r
/* ============ CẦU NỐI VỚI APP ============\r
   File này KHÔNG gọi API. Frame cha (React) đẩy câu hỏi xuống và nhận đáp án\r
   ngược lên qua postMessage:\r
     cha → con: {type:'init', data:{questions, playerName, title}}\r
     cha → con: {type:'graded', data:{score, max}}   (server đã chấm xong)\r
     con → cha: 'ready' / 'answer-recorded' / 'game-over' / 'exam-done'\r
   Bridge EG_ANSWER do app tiêm vào trước khi nạp iframe (injectAnswerBridge.js). */\r
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));\r
// Tên "bridge" đã dùng cho cầu gỗ trên bản đồ ở trên → ở đây gọi là appBridge.\r
function appBridge(){return window.EG_ANSWER||null}\r
function askReady(){appBridge()?appBridge().markReady():setTimeout(askReady,60)}\r
// Giá trị 1 câu gửi lên server: text hoặc key phương án (nhiều key nối bằng dấu phẩy).\r
const valueOf=a=>a.text?a.text:a.answerIds.join(',');\r
function reportAnswer(a){appBridge()&&appBridge().answer(a.questionId,a.answered?valueOf(a):null,a.timeSpent)}\r
function tellApp(t){try{window.parent.postMessage({type:t},'*')}catch(_){}}\r
function submitToHost(timeout){\r
  if(submitted||submitting||!Q.length)return;\r
  submitting=1;ac();\r
  const b=$('#btnSubmit');b.disabled=true;b.textContent=timeout?'Hết giờ — đang gửi bài…':'Đang gửi bài…';\r
  $('#subErr').classList.add('hide');\r
  appBridge()&&appBridge().finish({\r
    answers:A.map(a=>({questionId:a.questionId,value:a.answered?valueOf(a):null,timeSpent:a.timeSpent})),\r
    totalQuestions:Q.length,\r
    timeUsed:M.round((Date.now()-startedAt)/1000)\r
  });\r
}\r
addEventListener('message',e=>{\r
  const m=e.data;if(!m||typeof m!=='object')return;\r
  if(m.type==='init'){\r
    const d=m.data||{};\r
    if(d.playerName)$('#name').value=d.playerName;\r
    if(d.title)$('#ih')&&($('#ih').textContent='📋 '+d.title);\r
    applyQuestions(d.questions||[]);\r
  }\r
  else if(m.type==='graded')reveal(m.data||{});\r
  else if(m.type==='time-up')submitToHost(true);\r
});\r
\r
const P={x:9.5,y:10.4,a:-1.8,pt:0,hp:100,mx:100,ac:0,sw:0,cmb:0,cast:0,dd:0,da:0,inv:0,hurt:0,bt:0,dead:0,wpn:0,cdD:0};\r
let E=[],IT=[],PR=[],EP=[],XP=[],FT=[],T=0,dl=null,started=0,shake=0,flash=0,sleeve='#2f6fb3',env=0,curZone='';\r
const ED={slime:{n:'Slime',r:.3,sz:.62},gob:{n:'Goblin',r:.3,sz:.95},arch:{n:'Goblin xạ thủ',r:.3,sz:.95},bat:{n:'Dơi hang',r:.25,sz:.55},boss:{n:'Thạch Giáp',r:.65,sz:2.3}};\r
let Q=[],A=[],GD=[],boss=null,qOpen=-1,qT0=0,qLim=30,qBeep=99,tabOut=0,startedAt=0,submitting=0,submitted=0,revealing=0,shopOpen=0,doneN=0,pName='';\r
const aD=a=>M.atan2(M.sin(a),M.cos(a));\r
function toast(m){const t=$('#ts');t.textContent=m;t.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.opacity=0,2600)}\r
function fl(x,y,z,s,c){FT.push({x,y,z,s:String(s),c,t:.9})}\r
const fmtT=s=>{s=M.max(0,M.floor(s));return (s/60|0)+':'+String(s%60).padStart(2,'0')};\r
\r
/* ---- đặt thủ vệ dọc tuyến đường: làng → rừng → cầu → thành → hang ---- */\r
const ROUTE=[[19.5,14.3],[26.5,17.6],[32.5,19.6],[44.5,19.6],[46.5,13.8],[53.5,13.5],[59.5,20.5],[59.5,24.5],[57.5,31.5],[47.5,35.5],[43.8,43.5],[43.8,49.5],[47.5,52],[54.5,52.5],[55.5,45],[54,40.8],[54.5,60.5],[52.5,66.5],[62.5,65]];\r
const guardOK=(x,y)=>!hb(x,y,.35)&&fm(x,y)!==2&&!NP.some(n=>M.hypot(n.x-x,n.y-y)<1.6)&&!GD.some(g=>M.hypot(g.x-x,g.y-y)<2.2);\r
function snap(x,y){if(guardOK(x,y))return[x,y];for(let r=.5;r<6;r+=.5)for(let k=0;k<16;k++){const a=k/16*TAU,nx=x+M.cos(a)*r,ny=y+M.sin(a)*r;if(guardOK(nx,ny))return[nx,ny]}return[x,y]}\r
function routePts(n){\r
 if(n<=ROUTE.length){const o=[];for(let i=0;i<n;i++)o.push(ROUTE[n===1?9:M.round(i*(ROUTE.length-1)/(n-1))]);return o}\r
 const seg=[];let L=0;for(let i=0;i<ROUTE.length-1;i++){const d=M.hypot(ROUTE[i+1][0]-ROUTE[i][0],ROUTE[i+1][1]-ROUTE[i][1]);seg.push(d);L+=d}\r
 const o=[];for(let k=0;k<n;k++){let s=L*k/(n-1),i=0;while(i<seg.length-1&&s>seg[i]){s-=seg[i];i++}const f=seg[i]?s/seg[i]:0;o.push([ROUTE[i][0]+(ROUTE[i+1][0]-ROUTE[i][0])*f,ROUTE[i][1]+(ROUTE[i+1][1]-ROUTE[i][1])*f])}\r
 return o}\r
function placeGuards(n){\r
 GD=[];E=[];boss=null;\r
 routePts(n).forEach((p,i)=>{const[x,y]=snap(p[0],p[1]),cave=x>44&&y>36,ty=cave?['bat','gob','arch']:['slime','gob','slime','arch'],t=ty[i%ty.length],d=ED[t];\r
  const e={t,x,y,hp:1,mx:1,r:d.r,sz:d.sz,i:i%3,aw:0,fl:0,wa:R()*6,gi:i};E.push(e);GD.push({gi:i,x,y,e,done:false})});\r
 boss={t:'boss',x:67,y:64.5,hp:1000,mx:1000,r:.65,sz:2.3,i:0,aw:0,fl:0,wa:0};E.push(boss)}\r
\r
/* ---- hội thoại NPC ---- */\r
function say(L,cb){dl={L,i:0,cb};showDl()}\r
function showDl(){const l=dl.L[dl.i];$('#dn').textContent=l[0];$('#dt').textContent=l[1];$('#dlg').style.display='block';$('#bT').style.display='none'}\r
function nextDl(){if(!dl)return;dl.i++;if(dl.i>=dl.L.length){const cb=dl.cb;dl=null;$('#dlg').style.display='none';cb&&cb()}else showDl()}\r
\r
/* ---- tương tác ---- */\r
function nearInter(){\r
 if(qOpen>=0||revealing||submitted)return null;let r=null,bd=4.2;\r
 for(const g of GD)if(!g.done){const d=M.hypot(g.x-P.x,g.y-P.y);if(d<2.4&&d<bd){bd=d;r={k:'g',g,n:'Thách đấu thủ vệ #'+(g.gi+1)}}}\r
 if(boss&&E.includes(boss)){const d=M.hypot(boss.x-P.x,boss.y-P.y);if(d<4.2&&d<bd){bd=d;r={k:'b',n:doneN>=Q.length?'Đối đầu Thạch Giáp':'🔒 Còn '+(Q.length-doneN)+' thủ vệ'}}}\r
 NP.forEach((n,i)=>{const d=M.hypot(n.x-P.x,n.y-P.y);if(d<1.9&&d<bd){bd=d;r={k:'n',i,n:n.n}}});\r
 return r}\r
function interact(){\r
 if(shopOpen||qOpen>=0||revealing)return;if(dl){nextDl();return}\r
 const r=nearInter();if(!r)return;\r
 if(r.k==='g')openQ(r.g);\r
 else if(r.k==='n')say([[NP[r.i].n,pick(NP[r.i].s)]]);\r
 else if(doneN>=Q.length)openReview();else toast('🔒 Thạch Giáp chưa thức dậy, hãy đánh bại hết thủ vệ trước.')}\r
\r
/* ---- câu hỏi ---- */\r
const isTextMode=q=>q.inputMode==='text'||q.inputMode==='input'||q.inputMode==='essay'||!q.options||!q.options.length;\r
const isMulti=q=>q.inputMode==='multiple'||q.inputMode==='multi'||q.inputMode==='checkbox';\r
function openQ(g){\r
 const q=Q[g.gi];qOpen=g.gi;qT0=Date.now();qLim=q.timeLimit||30;qBeep=99;\r
 for(const k in K)K[k]=0;IN.mx=IN.my=0;IN.sid=IN.lid=null;jb.style.display=jk.style.display='none';\r
 try{document.exitPointerLock&&document.exitPointerLock()}catch(_){}\r
 $('#bT').style.display='none';\r
 $('#qtt').textContent=q.content;$('#qpt').textContent='⭐ '+(q.points||0)+' điểm · câu '+(g.gi+1)+'/'+Q.length;\r
 if(isTextMode(q)){$('#qo').innerHTML='';$('#qtw').classList.remove('hide');$('#qin').value='';setTimeout(()=>$('#qin').focus(),80)}\r
 else{$('#qtw').classList.add('hide');$('#qo').innerHTML=q.options.map((x,i)=>\`<button class="qo \${isMulti(q)?'multi':''}" data-id="\${esc(x.id)}"><span class="k">\${String.fromCharCode(65+i)}</span><span>\${esc(x.content)}</span></button>\`).join('')}\r
 $('#qp').style.display='block';qTick();bp(500,.15,'triangle',.1,900)}\r
$('#qo').addEventListener('click',e=>{if(qOpen<0)return;const b=e.target.closest('.qo');if(!b)return;ac();bp(600,.06,'triangle',.08);\r
 if(isMulti(Q[qOpen]))b.classList.toggle('sel');else document.querySelectorAll('.qo').forEach(x=>x.classList.toggle('sel',x===b))});\r
function qTick(){\r
 if(qOpen<0)return;const el=(Date.now()-qT0)/1000,rem=M.max(0,qLim-el),r=rem/qLim;\r
 $('#qtn').textContent=M.ceil(rem);$('#qbf').style.width=100*r+'%';$('#qbf').style.background=r<=.2?'#ff6b81':r<=.5?'#ffd166':'#6ee7a8';\r
 $('#qtn').classList.toggle('warn',r<=.5&&r>.2);$('#qtn').classList.toggle('danger',r<=.2);\r
 if(rem<=5&&M.ceil(rem)!==qBeep){qBeep=M.ceil(rem);if(rem>0)bp(900,.05,'square',.04)}\r
 if(rem<=0)finishQ(true)}\r
function finishQ(timeout){\r
 if(qOpen<0)return;const gi=qOpen,q=Q[gi],g=GD[gi],a=A[gi];qOpen=-1;\r
 a.timeSpent=M.min(qLim,M.round((Date.now()-qT0)/100)/10);\r
 if(isTextMode(q)){a.text=$('#qin').value.trim();a.answerIds=[];a.answered=!!a.text}\r
 else{a.answerIds=[...document.querySelectorAll('.qo.sel')].map(x=>x.dataset.id);a.answered=a.answerIds.length>0}\r
 $('#qp').style.display='none';g.done=true;doneN++;ac();\r
 if(a.answered){\r
  P.cast=.45;bp(300,.25,'sawtooth',.1,1100);fl(g.x,g.y,g.e.sz+.4,'Đã ghi nhận ✓','#ffd166');\r
  PR.push({x:P.x+M.cos(P.a)*.5,y:P.y+M.sin(P.a)*.5,tg:g.e,v:10,l:2.5,cb:()=>kill(g)})}\r
 else{\r
  fl(P.x,P.y,.6,timeout?'Hết giờ!':'Bỏ qua','#ff6b81');\r
  if(timeout){const an=M.atan2(P.y-g.y,P.x-g.x);EP.push({x:g.x,y:g.y,vx:M.cos(an)*7,vy:M.sin(an)*7,l:2.5,d:18});bp(700,.1,'triangle',.08,300)}\r
  setTimeout(()=>kill(g),900)}\r
 reportAnswer(a);\r
 if(doneN>=Q.length)setTimeout(()=>{if(boss){boss.aw=0;XP.push({x:boss.x,y:boss.y,t:0,R:4});shake=.4}toast('🐲 Thạch Giáp đã thức tỉnh! Đến buồng sâu trong hang để nộp bài.');bp(100,.6,'sawtooth',.2,40)},1000)\r
 else toast('✔ Đã chốt câu '+(gi+1)+'. Còn '+(Q.length-doneN)+' thủ vệ.')}\r
function kill(g){if(!E.includes(g.e))return;E=E.filter(x=>x!==g.e);XP.push({x:g.x,y:g.y,t:0,R:1.6});bp(160,.2,'square',.12,60)}\r
$('#qgo').addEventListener('click',()=>{ac();finishQ(false)});\r
function qKey(e){\r
 if(e.target&&e.target.id==='qin'){if(e.key==='Enter')finishQ(false);return}\r
 const k=e.key.toUpperCase();let i=k.charCodeAt(0)-65;if(/^[1-9]$/.test(e.key))i=+e.key-1;\r
 const bs=document.querySelectorAll('.qo');\r
 if(e.key.length===1&&i>=0&&i<bs.length)bs[i].click();else if(e.key==='Enter')finishQ(false)}\r
\r
/* ---- xem lại, nộp bài ---- */\r
function openReview(){\r
 shopOpen=1;for(const k in K)K[k]=0;try{document.exitPointerLock&&document.exitPointerLock()}catch(_){}\r
 $('#bT').style.display='none';$('#shopT').textContent='🐲 Trận cuối với Thạch Giáp';\r
 $('#si').textContent='Kiểm tra lại bài làm. Đã nộp là không sửa được. Điểm thật quyết định boss mất bao nhiêu máu.';\r
 $('#sl').innerHTML=Q.map((q,i)=>{const a=A[i];let t='Chưa trả lời';if(a.answered)t=a.text?esc(a.text):a.answerIds.map(id=>esc((q.options.find(o=>o.id===id)||{}).content||id)).join(', ');return\`<div class="rv"><span>\${i+1}. \${esc(q.content)}</span><span class="a \${a.answered?'':'none'}">\${t}</span></div>\`}).join('');\r
 $('#subErr').classList.add('hide');$('#btnSubmit').classList.remove('hide');$('#btnSubmit').disabled=false;$('#btnSubmit').textContent='⚡ Nộp bài và đánh Thạch Giáp';\r
 $('#sx').textContent='← Chưa nộp, quay lại';$('#sx').onclick=closeShop;$('#shop').style.display='grid'}\r
function closeShop(){shopOpen=0;$('#shop').style.display='none'}\r
$('#btnSubmit').onclick=()=>{if(submitting||submitted)return;submitToHost(false)};\r
/* tiết lộ điểm: Thạch Giáp mất máu theo điểm thật do server chấm, frame cha gửi về */\r
function reveal(res){\r
 revealing=1;submitted=1;submitting=0;closeShop();\r
 const max=res&&res.max!=null?res.max:Q.reduce((s,q)=>s+(q.points||0),0);\r
 const score=res&&typeof res.score==='number'?res.score:0;\r
 const ratio=clamp(score/(max||1),0,1),V=6;let fired=0,done=0;\r
 const finish=()=>{if(done)return;done=1;\r
  if(ratio>=.999){E=E.filter(x=>x!==boss);for(let i=0;i<6;i++)XP.push({x:boss.x+rnd(-1,1),y:boss.y+rnd(-1,1),t:-i*.12,R:3.5});shake=.8;bp(80,.9,'sawtooth',.22,25);[523,659,784,1046].forEach((f,i)=>setTimeout(()=>bp(f,.25,'triangle',.14),i*110));toast('🏆 Thạch Giáp đã gục!')}\r
  else if(ratio>0)toast('Thạch Giáp còn '+M.round((1-ratio)*100)+'% máu!');\r
  else if(ratio===0){hurt(25);toast('Thạch Giáp cười nhạo…')}\r
  setTimeout(()=>{showResult(score,max,ratio);setTimeout(()=>tellApp('exam-done'),900)},1300)};\r
 const shoot=()=>{\r
  if(ratio<=0){setTimeout(finish,600);return}\r
  fired++;P.cast=.4;bp(300,.25,'sawtooth',.1,1100);\r
  PR.push({x:P.x+M.cos(P.a)*.5,y:P.y+M.sin(P.a)*.5,tg:boss,v:11,l:3,cb:()=>{boss.fl=.2;shake=.3;XP.push({x:boss.x,y:boss.y,t:0,R:2.6});bp(140,.3,'sawtooth',.16,50);boss.hp=M.max(0,1000*(1-ratio*fired/V));fl(boss.x,boss.y,2.7,'-'+M.round(score/V),'#fff');if(fired>=V)setTimeout(finish,500)}});\r
  if(fired<V)setTimeout(shoot,450)};\r
 setTimeout(shoot,700)}\r
function showResult(score,max,ratio){\r
 shopOpen=1;$('#btnSubmit').classList.add('hide');$('#subErr').classList.add('hide');\r
 const rk=ratio>=.9?'S':ratio>=.75?'A':ratio>=.5?'B':'C';\r
 $('#shopT').textContent=ratio>=.999?'🏆 CHIẾN THẮNG!':ratio>0?'⚔️ Trận đấu kết thúc':'💀 Thất bại';\r
 $('#si').innerHTML=\`<div class="big">\${score}</div><div class="mid">trên \${max} điểm</div><div class="rank">\${rk}</div><div class="mid">\${ratio>=.999?'Điểm tuyệt đối, bạn hạ gục Thạch Giáp!':ratio>0?'Thạch Giáp còn '+M.round((1-ratio)*100)+'% máu. Xem bảng kết quả để biết câu nào chưa đúng!':'Chưa có điểm nào. Luyện tập rồi quay lại nhé!'}</div>\`;\r
 $('#sl').innerHTML='';\r
 $('#sx').textContent='Xem kết quả chi tiết';$('#sx').onclick=()=>tellApp('exam-done');$('#shop').style.display='grid'}\r
\r
/* ---- hành động ---- */\r
function swing(){if(dl||shopOpen||qOpen>=0||revealing||P.ac>0||P.dead>0)return;P.ac=.36;P.sw=1;P.cmb=(P.cmb+1)%3;bp(300,.12,'sawtooth',.08,150);\r
 let bt=null,bd=1e9;for(const t of TR){if(t.cut)continue;const dx=t.x-P.x,dy=t.y-P.y,d=M.hypot(dx,dy);if(d<2.2&&d<bd&&M.abs(aD(M.atan2(dy,dx)-P.a))<.8){bd=d;bt=t}}\r
 if(bt){bt.hp-=P.cmb===2?2:1;bt.sh=.18;bp(150,.09,'square',.1,100);if(bt.hp<=0){bt.cut=1;bt.rt=75;fl(bt.x,bt.y,1.2,'🪵','#ffd9a0');bp(220,.2,'triangle',.14,330)}}}\r
function dash(){if(dl||shopOpen||qOpen>=0||revealing||P.dd>0||P.dead>0||P.cdD>0)return;P.dd=.22;P.cdD=.9;P.inv=.3;P.da=(IN.mx||IN.my)?P.a+M.atan2(IN.mx,-IN.my):(K.d||K.a||K.w||K.s)?P.a+M.atan2((K.d?1:0)-(K.a?1:0),(K.w?1:0)-(K.s?1:0)):P.a;bp(500,.15,'sine',.08,200)}\r
function hurt(d){if(P.inv>0||P.dead>0)return;P.hp-=d;P.inv=.5;P.hurt=.5;shake=.3;bp(140,.2,'sawtooth',.2,60);if(P.hp<=0){P.hp=0;P.dead=2.4;toast('💀 Bạn kiệt sức, đang hồi phục…')}}\r
function toggleSnd(){mute=!mute;$('#isnd').textContent=mute?'🔇':'🔊'}\r
/* ---- điều khiển ---- */\r
const IN={mx:0,my:0,sid:null,lid:null,ox:0,oy:0,lx:0,ly:0},K={};const tz=$('#jz'),jb=$('#jb'),jk=$('#jk');\r
function look(dx,dy,m){P.a+=dx*(m?.0026:.0055);P.pt=clamp(P.pt-dy*(m?.0022:.003),-.3,.3)}\r
function ptr(){document.body.addEventListener('pointerdown',e=>{if(!started||shopOpen||qOpen>=0||revealing)return;if(e.target.closest('.b,.ui,#dlg,#shop,#qp'))return;e.preventDefault();ac();\r
 if(dl){nextDl();return}\r
 if(e.pointerType==='mouse'){try{document.body.requestPointerLock()}catch(_){}if(e.button===0)swing();return}\r
 if(e.clientX<innerWidth*.42&&IN.sid===null){IN.sid=e.pointerId;IN.ox=e.clientX;IN.oy=e.clientY;jb.style.cssText=\`display:block;left:\${IN.ox-55}px;top:\${IN.oy-55}px\`;jk.style.cssText=\`display:block;left:\${IN.ox-25}px;top:\${IN.oy-25}px\`}\r
 else if(IN.lid===null){IN.lid=e.pointerId;IN.lx=e.clientX;IN.ly=e.clientY}\r
 try{document.body.setPointerCapture(e.pointerId)}catch(_){}});\r
 document.body.addEventListener('pointermove',e=>{if(!started||dl||shopOpen||qOpen>=0||revealing)return;if(e.pointerType==='mouse'){if(document.pointerLockElement)look(e.movementX,e.movementY,1);return}\r
  if(e.pointerId===IN.sid){let dx=e.clientX-IN.ox,dy=e.clientY-IN.oy;const d=M.hypot(dx,dy);if(d>45){dx*=45/d;dy*=45/d}jk.style.left=IN.ox+dx-25+'px';jk.style.top=IN.oy+dy-25+'px';IN.mx=dx/45;IN.my=dy/45;if(M.hypot(IN.mx,IN.my)<.2)IN.mx=IN.my=0}\r
  else if(e.pointerId===IN.lid){look(e.clientX-IN.lx,e.clientY-IN.ly,0);IN.lx=e.clientX;IN.ly=e.clientY}});\r
 const up=e=>{if(e.pointerId===IN.sid){IN.sid=null;IN.mx=IN.my=0;jb.style.display=jk.style.display='none'}if(e.pointerId===IN.lid)IN.lid=null};\r
 document.body.addEventListener('pointerup',up);document.body.addEventListener('pointercancel',up);document.body.addEventListener('contextmenu',e=>e.preventDefault())}\r
ptr();\r
$('#dlg').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();ac();nextDl()});\r
[['#bA',swing],['#bD',dash],['#isnd',toggleSnd],['#bT',interact]].forEach(([id,f])=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();ac();f()}));\r
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!started)return;if(qOpen>=0){qKey(e);return}if(e.target&&e.target.tagName==='INPUT')return;K[k]=1;if(shopOpen||revealing)return;if(dl){if([' ','f','enter'].includes(k))nextDl();return}if(k==='shift')dash();else if(k==='f')interact();else if(k===' ')swing()});\r
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);\r
/* ---- khu vực ---- */\r
function zoneAt(x,y){const t=fm(x,y);if(t===4)return'Hang Hắc Thạch';if(x>=48&&x<=70&&y<=26)return'Thành Kim Long';if(inVillage(x,y)&&x<19&&y<19)return'Làng Phong Linh';if(inCamp(x,y))return'Trại Goblin';if(t===2)return'Suối Bạc';if(t===3)return'Cầu gỗ';return x>45?'Đồng cỏ phía đông':'Rừng Thì Thầm'}\r
/* ---- cập nhật ---- */\r
function update(dt){\r
 T+=dt;\r
 for(const k of['ac','cast','inv','hurt','cdD'])if(P[k]>0)P[k]-=dt;P.sw=M.max(0,P.sw-dt/.32);flash=M.max(0,flash-dt);shake=M.max(0,shake-dt);\r
 env+=((fm(P.x,P.y)===4?1:0)-env)*M.min(1,dt*3);\r
 for(const e of E)if(e.fl>0)e.fl-=dt;\r
 qTick();\r
 if(P.dead>0){P.dead-=dt;if(P.dead<=0){P.hp=P.mx;toast('Bạn đã hồi phục')}}\r
 else{\r
  const tgE=qOpen>=0?GD[qOpen].e:revealing?boss:null;\r
  if(tgE){P.a+=aD(M.atan2(tgE.y-P.y,tgE.x-P.x)-P.a)*M.min(1,dt*6);P.pt+=((qOpen>=0?-.28:0)-P.pt)*M.min(1,dt*5)}\r
  else if(!dl&&!shopOpen){\r
   let f=-IN.my,s=IN.mx;if(K.w||K.arrowup)f+=1;if(K.s||K.arrowdown)f-=1;if(K.d)s+=1;if(K.a)s-=1;if(K.arrowleft)P.a-=2*dt;if(K.arrowright)P.a+=2*dt;\r
   const m=M.hypot(f,s);if(m>1){f/=m;s/=m}\r
   let vx,vy;if(P.dd>0){P.dd-=dt;vx=M.cos(P.da)*9*dt;vy=M.sin(P.da)*9*dt}else{const sp=3.4*(P.ac>0?.6:1)*(fm(P.x,P.y)===2?.55:1),c=M.cos(P.a),sn=M.sin(P.a);vx=(c*f-sn*s)*sp*dt;vy=(sn*f+c*s)*sp*dt;P.bt+=dt*9*m}\r
   mv(P,vx,vy,.22);\r
   if(!IN.lid&&!K.w)P.pt*=M.max(0,1-dt*.8)}\r
  if(P.hp<P.mx&&P.hurt<=0)P.hp=M.min(P.mx,P.hp+4*dt)}\r
 for(const t of TR){if(t.sh>0)t.sh-=dt;if(t.cut){t.rt-=dt;if(t.rt<=0){t.cut=0;t.hp=3}continue}const dx=P.x-t.x,dy=P.y-t.y,d=M.hypot(dx,dy);if(d<.4&&d>0){P.x=t.x+dx/d*.4;P.y=t.y+dy/d*.4}}\r
 const zn=zoneAt(P.x,P.y);if(zn!==curZone){curZone=zn;$('#zn').textContent='📍 '+zn;toast('📍 '+zn)}\r
 for(let i=PR.length-1;i>=0;i--){const p=PR[i],t=p.tg;if(!t){PR.splice(i,1);continue}const dx=t.x-p.x,dy=t.y-p.y,d=M.hypot(dx,dy)||1;p.x+=dx/d*p.v*dt;p.y+=dy/d*p.v*dt;p.l-=dt;if(d<(t.r||.3)+.4||p.l<=0){PR.splice(i,1);p.cb&&p.cb(p)}}\r
 for(let i=EP.length-1;i>=0;i--){const p=EP[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;if(p.l<=0||solid(p.x,p.y)){EP.splice(i,1);continue}if(P.dead<=0&&M.hypot(P.x-p.x,P.y-p.y)<.5){hurt(p.d);EP.splice(i,1)}}\r
 XP=XP.filter(x=>(x.t+=dt)<.5);FT=FT.filter(f=>(f.t-=dt)>0);\r
 const r=nearInter(),bt=$('#bT');if(r&&!dl&&!shopOpen){bt.style.display='flex';$('#btx').textContent=(r.k==='g'?'⚔️ ':r.k==='b'?'🐲 ':r.k==='n'?'💬 ':'')+r.n}else bt.style.display='none';\r
}\r
/* ---- vẽ ---- */\r
const CLD=Array.from({length:9},()=>({a:R()*TAU,h:R()*.16,w:.1+R()*.1}));\r
function render(){\r
 const hor=RH/2+P.pt*RH*.6,hr=hor|0,f=(RW/2)/PL;let sa=P.a;if(shake>0)sa+=(R()-.5)*shake*.06;\r
 const dx=M.cos(sa),dy=M.sin(sa),plx=-dy*PL,ply=dx*PL;Object.assign(CAM,{x:P.x,y:P.y,dx,dy,px:plx,py:ply,inv:-1/PL,f,hor});\r
 const e1=1-env,FDm=22-11*env,fcr=(190*e1+20*env)|0,fcg=(215*e1+22*env)|0,fcb=(240*e1+36*env)|0,fogA=\`rgb(\${fcr},\${fcg},\${fcb})\`,fogB=\`rgb(\${(70*e1+12*env)|0},\${(80*e1+13*env)|0},\${(120*e1+24*env)|0})\`;\r
 for(let y=0;y<M.min(hr,RH);y++){const t=y/M.max(1,hr);const r=((90+t*100)*e1+(26+t*20)*env)|0,g=((150+t*65)*e1+(24+t*18)*env)|0,b=((235+t*5)*e1+(40+t*26)*env)|0;buf.fill(0xff000000|(b<<16)|(g<<8)|r,y*RW,(y+1)*RW)}\r
 const rx0=dx-plx,ry0=dy-ply,rx1=dx+plx,ry1=dy+ply,wo=(T*14)|0,wo2=(T*9)|0;\r
 for(let y=M.max(0,hr+1);y<RH;y++){const rd=.5*f/(y-hor),fo=clamp(rd/FDm,0,.85),ia=((1-fo)*256)|0,ib=(fo*256)|0,sx=rd*(rx1-rx0)/RW,sy=rd*(ry1-ry0)/RW;let fx_=P.x+rd*rx0,fy_=P.y+rd*ry0;const o=y*RW;\r
  for(let x=0;x<RW;x++){const mx=fx_|0,my=fy_|0,ti=(mx>=0&&my>=0&&mx<N&&my<N)?FM[my*N+mx]:0,tu=((fx_-mx)*64)&63,tv=((fy_-my)*64)&63;let c;\r
   if(ti===0)c=((mx*7+my*13)%9===0?FF:FG)[tv*64+tu];else if(ti===2)c=FW[((tv+wo)&63)*64+((tu+wo2)&63)];else c=FX[ti][tv*64+tu];\r
   buf[o+x]=0xff000000|((((c>>16&255)*ia+fcb*ib)>>8)<<16)|((((c>>8&255)*ia+fcg*ib)>>8)<<8)|(((c&255)*ia+fcr*ib)>>8);fx_+=sx;fy_+=sy}}\r
 vc.putImageData(img,0,0);\r
 if(env<.3){vc.globalAlpha=.6*(1-env/.3);vc.fillStyle='#fff';for(const c of CLD){const df=aD(c.a-sa);if(M.abs(df)>1.3)continue;const cx=RW/2*(1+M.tan(df)/PL),cy=hor-RH*(.12+c.h),w=c.w*RW;for(let j=0;j<4;j++){vc.beginPath();vc.ellipse(cx+(j-1.5)*w*.35,cy+(j%2)*w*.06,w*.4,w*.17,0,0,TAU);vc.fill()}}vc.globalAlpha=1}\r
 const sdf=aD(-.9-sa);if(env<.3&&M.abs(sdf)<1.2){const sxp=RW/2*(1+M.tan(sdf)/PL),g=vc.createRadialGradient(sxp,hor-RH*.28,2,sxp,hor-RH*.28,RH*.2);g.addColorStop(0,'rgba(255,250,210,1)');g.addColorStop(.25,'rgba(255,240,180,.6)');g.addColorStop(1,'rgba(255,240,180,0)');vc.fillStyle=g;vc.fillRect(sxp-RH*.2,hor-RH*.48,RH*.4,RH*.4)}\r
 for(let x=0;x<RW;x++){const cam=2*x/RW-1;let rdx=dx+plx*cam,rdy=dy+ply*cam;if(M.abs(rdx)<1e-9)rdx=1e-9;if(M.abs(rdy)<1e-9)rdy=1e-9;\r
  let mx=P.x|0,my=P.y|0;const ddx=M.abs(1/rdx),ddy=M.abs(1/rdy);let sx,sy,sdx,sdy,side=0,h=0;\r
  if(rdx<0){sx=-1;sdx=(P.x-mx)*ddx}else{sx=1;sdx=(mx+1-P.x)*ddx}if(rdy<0){sy=-1;sdy=(P.y-my)*ddy}else{sy=1;sdy=(my+1-P.y)*ddy}\r
  for(let i=0;i<130;i++){if(sdx<sdy){sdx+=ddx;mx+=sx;side=0}else{sdy+=ddy;my+=sy;side=1}if(mx<0||my<0||mx>=N||my>=N){h=1;break}h=map[my*N+mx];if(h>0)break}\r
  let pp=side?sdy-ddy:sdx-ddx;if(pp<.02)pp=.02;zb[x]=pp;const lh=f/pp,top=hor-lh/2;let wx=side?P.x+pp*rdx:P.y+pp*rdy;wx-=M.floor(wx);let tx=(wx*64)|0;if(!side&&rdx>0)tx=63-tx;if(side&&rdy<0)tx=63-tx;\r
  vc.drawImage(WT[h]||WT[1],tx,0,1,64,x,top,1,lh);const fa=clamp(pp/FDm,0,.85);vc.fillStyle=side?fogB:fogA;vc.globalAlpha=side?clamp(fa+.2,0,.88):fa;vc.fillRect(x,top,1,lh);vc.globalAlpha=1}\r
 const L=[];const add=o=>{o.d=(o.x-P.x)**2+(o.y-P.y)**2;if(o.d<650)L.push(o)};const cl=(a,b)=>M.abs(a.x-P.x)>26||M.abs(a.y-P.y)>26;\r
 for(const t of TR){if(cl(t))continue;add(t.cut?{x:t.x,y:t.y,c:SPR.stump,sz:.5}:{x:t.x,y:t.y,c:SPR.t[t.v],sz:1.9*(t.sh>0?1.05:1)})}\r
 for(const d of DEC){if(cl(d)||(d.r&&(d.x-P.x)**2+(d.y-P.y)**2>d.r*d.r))continue;add({x:d.x,y:d.y,z:d.z||0,c:SPR[d.k],sz:d.sz,add:d.add,al:d.f?.55+.3*M.sin(T*9+d.x*3):1})}\r
 NP.forEach(n=>add({x:n.x,y:n.y,c:n.spr,sz:1.05}));for(const g of GD)if(!g.done)add({x:g.x,y:g.y,z:g.e.sz+.3+M.sin(T*4+g.gi)*.05,c:SPR.ex,sz:.3});if(boss&&doneN>=Q.length&&Q.length&&E.includes(boss))add({x:boss.x,y:boss.y,z:2.9+M.sin(T*4)*.05,c:SPR.ex,sz:.45});\r
 for(const e of E){if(cl(e))continue;add({x:e.x,y:e.y,z:e.t==='bat'?.28+.12*M.sin(T*6+e.wa):0,c:e.t==='slime'?SPR.sl[e.i]:SPR[e.t],sz:e.sz*(e.aw>0&&e.t==='boss'?1.08:1),al:e.fl>0?.55:1})}\r
 for(const it of IT)add({x:it.x,y:it.y,z:it.k==='x'?0:.12+M.sin(T*3+it.x)*.05,c:it.k==='x'?SPR.chest:it.k==='c'?SPR.cry:it.k==='g'?SPR.gem:SPR.heart,sz:it.k==='x'?.5:.4,al:it.o?.5:1});\r
 for(const p of PR)add({x:p.x,y:p.y,z:.4,c:SPR.fire,sz:.5,add:1});\r
 for(const p of EP)add({x:p.x,y:p.y,z:.35,c:SPR.arrow,sz:.35,add:1});\r
 for(const x of XP)add({x:x.x,y:x.y,z:.3,c:SPR.expl,sz:x.R*(.6+x.t*1.6),al:1-x.t/.5,add:1});\r
 L.sort((a,b)=>b.d-a.d);for(const o of L)spr(o,FDm);\r
}\r
function spr(o,FDm){const sx=o.x-CAM.x,sy=o.y-CAM.y,tx=CAM.inv*(CAM.dy*sx-CAM.dx*sy),ty=CAM.inv*(-CAM.py*sx+CAM.px*sy);if(ty<.2)return;\r
 const sh=CAM.f/ty*o.sz,scr=RW/2*(1+tx/ty),bot=CAM.hor+(.5-(o.z||0))*CAM.f/ty,top=bot-sh,x0=M.max(0,(scr-sh/2)|0),x1=M.min(RW-1,(scr+sh/2)|0);if(x1<x0)return;\r
 const a=(o.al||1)*clamp((FDm+2-ty)/8,0,1);if(a<=0)return;vc.globalAlpha=a;if(o.add)vc.globalCompositeOperation='lighter';const l=scr-sh/2,cw=o.c.width;\r
 for(let x=x0;x<=x1;x++){if(ty>=zb[x])continue;vc.drawImage(o.c,((x-l)/sh*cw)|0,0,1,o.c.height,x,top,1,sh)}\r
 vc.globalAlpha=1;vc.globalCompositeOperation='source-over'}\r
function proj(x,y,z){const sx=x-CAM.x,sy=y-CAM.y,tx=CAM.inv*(CAM.dy*sx-CAM.dx*sy),ty=CAM.inv*(-CAM.py*sx+CAM.px*sy);if(ty<.3)return null;const k=fxc.width/RW;return{x:RW/2*(1+tx/ty)*k,y:(CAM.hor+(.5-z)*CAM.f/ty)*k,d:ty}}\r
function drawFx(){\r
 const w=fxc.width,h=fxc.height;fx.setTransform(1,0,0,1,0,0);fx.clearRect(0,0,w,h);if(!started)return;\r
 const bob=M.sin(P.bt)*5*u,bob2=M.abs(M.cos(P.bt))*4*u;let hx=w*.76+bob,hy=h*1.0+bob2,ang=-.3;const t=1-P.sw,e=1-(1-t)*(1-t);let tr=0;\r
 if(P.sw>0){if(P.cmb===0)ang=1.1-2.3*e;else if(P.cmb===1)ang=-1.2+2.4*e;else{ang=-.15;hx-=w*.2*M.sin(t*M.PI);hy-=h*.18*M.sin(t*M.PI)}tr=P.cmb===2?0:1}\r
 if(P.dead>0)hy+=h*.4;\r
 if(tr){fx.strokeStyle=\`rgba(255,255,255,\${.55*P.sw})\`;fx.lineWidth=16*u;fx.lineCap='round';const a0=P.cmb===0?1.1:-1.2,a1=ang;fx.beginPath();fx.arc(hx,hy,170*u,-M.PI/2+a0,-M.PI/2+a1,a1<a0);fx.stroke()}\r
 fx.save();fx.translate(hx,hy);fx.rotate(ang);fx.scale(u*1.05,u*1.05);\r
 fx.fillStyle=sleeve;fx.beginPath();fx.moveTo(-30,8);fx.lineTo(30,8);fx.lineTo(96,260);fx.lineTo(-70,260);fx.fill();fx.fillStyle='rgba(0,0,0,.2)';fx.fillRect(-32,0,64,16);\r
 const g=fx.createLinearGradient(-14,0,14,0);g.addColorStop(0,P.wpn?'#9fd2ff':'#c8d4e4');g.addColorStop(.5,'#fff');g.addColorStop(1,P.wpn?'#5a86b8':'#8a9ab0');fx.fillStyle=g;fx.beginPath();fx.moveTo(-13,-34);fx.lineTo(0,-250);fx.lineTo(13,-34);fx.fill();\r
 fx.fillStyle='#e8b830';fx.fillRect(-36,-42,72,13);fx.fillStyle='#5a3a24';fx.fillRect(-7,-30,14,40);fx.fillStyle='#f3d6b8';fx.beginPath();fx.ellipse(0,-2,24,20,0,0,TAU);fx.fill();fx.strokeStyle='#d8b898';fx.lineWidth=2;for(let i=-1;i<=1;i++){fx.beginPath();fx.moveTo(i*9,-14);fx.lineTo(i*9,2);fx.stroke()}\r
 fx.restore();\r
 if(P.cast>0){const k=M.min(1,P.cast*2),lx=w*.2,ly=h*(1.02-.2*k);const gg=fx.createRadialGradient(lx,ly-40*u,2,lx,ly-40*u,90*u);gg.addColorStop(0,'rgba(255,240,180,.95)');gg.addColorStop(.4,'rgba(255,140,30,.7)');gg.addColorStop(1,'rgba(255,60,0,0)');fx.fillStyle=gg;fx.fillRect(lx-100*u,ly-140*u,200*u,200*u);fx.fillStyle=sleeve;fx.beginPath();fx.moveTo(lx-30*u,ly+10*u);fx.lineTo(lx+30*u,ly+10*u);fx.lineTo(lx+60*u,h);fx.lineTo(lx-60*u,h);fx.fill();fx.fillStyle='#f3d6b8';fx.beginPath();fx.ellipse(lx,ly,24*u,20*u,0,0,TAU);fx.fill()}\r
 const tgt=E.find(e=>M.hypot(e.x-P.x,e.y-P.y)<2.3&&M.abs(aD(M.atan2(e.y-P.y,e.x-P.x)-P.a))<.5)||TR.find(t=>!t.cut&&M.hypot(t.x-P.x,t.y-P.y)<2.2&&M.abs(aD(M.atan2(t.y-P.y,t.x-P.x)-P.a))<.4);\r
 fx.fillStyle=tgt?(tgt.hp!==undefined&&tgt.mx===undefined?'#ffb74d':'#ff5252'):'rgba(255,255,255,.9)';fx.beginPath();fx.arc(w/2,h/2,3*u,0,TAU);fx.fill();\r
 fx.font=\`800 \${14*u}px system-ui\`;fx.textAlign='center';fx.lineWidth=3*u;fx.strokeStyle='rgba(0,0,0,.55)';\r
 for(const f of FT){const p=proj(f.x,f.y,f.z+(.9-f.t)*.6);if(!p)continue;fx.fillStyle=f.c;fx.globalAlpha=clamp(f.t*2,0,1);fx.strokeText(f.s,p.x,p.y);fx.fillText(f.s,p.x,p.y)}fx.globalAlpha=1;\r
 fx.font=\`700 \${13*u}px system-ui\`;fx.lineWidth=3.5*u;fx.strokeStyle='rgba(0,0,0,.6)';const kx=fxc.width/RW;\r
 for(const n of NP){if(M.hypot(n.x-P.x,n.y-P.y)>14)continue;const p=proj(n.x,n.y,1.22);if(!p||p.d>=zb[clamp((p.x/kx)|0,0,RW-1)])continue;fx.fillStyle=n.shop?'#ffd98a':'#fff';const t=(n.shop?'🏪 ':'')+n.n;fx.strokeText(t,p.x,p.y);fx.fillText(t,p.x,p.y)}\r
 for(const g of GD){if(g.done||M.hypot(g.x-P.x,g.y-P.y)>16)continue;const p=proj(g.x,g.y,g.e.sz+.6);if(!p||p.d>=zb[clamp((p.x/kx)|0,0,RW-1)])continue;fx.fillStyle='#ffd98a';const t='Thủ vệ #'+(g.gi+1);fx.strokeText(t,p.x,p.y);fx.fillText(t,p.x,p.y)}\r
 for(const e of E){if(e.hp<e.mx&&M.hypot(e.x-P.x,e.y-P.y)<10){const p=proj(e.x,e.y,e.sz+.08);if(p){const bw=40*u;fx.fillStyle='rgba(0,0,0,.55)';fx.fillRect(p.x-bw/2,p.y,bw,5*u);fx.fillStyle='#ef5350';fx.fillRect(p.x-bw/2,p.y,bw*e.hp/e.mx,5*u);fx.font=\`700 \${11*u}px system-ui\`;fx.fillStyle='#fff';fx.strokeText(ED[e.t].n,p.x,p.y-4*u);fx.fillText(ED[e.t].n,p.x,p.y-4*u)}}if(e.t==='boss'&&e.aw>0){fx.fillStyle='rgba(255,40,40,.9)';fx.font=\`900 \${20*u}px system-ui\`;fx.fillText('⚠ NÉ ĐÒN ĐẬP!',w/2,h*.3)}else if(e.t==='arch'&&e.aw>0&&M.hypot(e.x-P.x,e.y-P.y)<11){fx.fillStyle='rgba(255,170,40,.95)';fx.font=\`900 \${16*u}px system-ui\`;fx.fillText('🏹 XẠ THỦ NGẮM BẮN!',w/2,h*.3)}}\r
 if(P.hurt>0){const g2=fx.createRadialGradient(w/2,h/2,M.min(w,h)*.3,w/2,h/2,M.max(w,h)*.7);g2.addColorStop(0,'rgba(200,0,20,0)');g2.addColorStop(1,\`rgba(200,0,20,\${P.hurt})\`);fx.fillStyle=g2;fx.fillRect(0,0,w,h)}\r
 if(flash>0){fx.fillStyle=\`rgba(255,170,60,\${flash*.6})\`;fx.fillRect(0,0,w,h)}\r
 if(fm(P.x,P.y)===2){fx.fillStyle='rgba(60,140,220,.12)';fx.fillRect(0,h*.78,w,h*.22)}\r
 const vg=fx.createRadialGradient(w/2,h/2,M.min(w,h)*.35,w/2,h/2,M.max(w,h)*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,\`rgba(10,10,30,\${.1+.3*env})\`);fx.fillStyle=vg;fx.fillRect(0,0,w,h);\r
 if(env<.5){const wg=fx.createLinearGradient(0,0,w,h);wg.addColorStop(0,\`rgba(255,236,190,\${.13*(1-env*2)})\`);wg.addColorStop(1,'rgba(255,200,150,0)');fx.fillStyle=wg;fx.fillRect(0,0,w,h)}\r
 if(P.dead>0){fx.fillStyle='rgba(0,0,0,.5)';fx.fillRect(0,0,w,h)}\r
}\r
function hud(){\r
 const left=Q.length-doneN;\r
 $('#lv').textContent='📜 '+doneN+'/'+Q.length;$('#mo').textContent='⏱ '+fmtT(started?(Date.now()-startedAt)/1000:0);\r
 $('#hp').style.width=100*P.hp/P.mx+'%';$('#en').style.width=(Q.length?100*doneN/Q.length:0)+'%';$('#hpn').textContent=\`❤ \${M.ceil(P.hp)} / \${P.mx}\`;\r
 let tg=null,msg;\r
 if(submitted)msg='Đã nộp bài';\r
 else if(left>0){tg=GD.find(g=>!g.done)||null;msg='Đánh bại thủ vệ để trả lời câu hỏi (còn '+left+')'}\r
 else{tg=boss;msg='Thạch Giáp đã thức tỉnh! Đến hang sâu để nộp bài'}\r
 $('#qt').textContent=msg;\r
 if(tg){const da=aD(M.atan2(tg.y-P.y,tg.x-P.x)-P.a);$('#ar').style.transform=\`rotate(\${da}rad)\`;$('#qd').textContent=M.round(M.hypot(tg.x-P.x,tg.y-P.y))+' m'}else{$('#qd').textContent='';$('#ar').style.transform='none'}\r
 const bb=boss&&E.includes(boss)&&M.hypot(boss.x-P.x,boss.y-P.y)<18;$('#boss').style.display=bb?'block':'none';if(bb){$('#bn').textContent='🗿 Thạch Giáp';$('#bb').style.width=100*boss.hp/boss.mx+'%'}\r
 const Z=3.2,MS=120,ctr=MS/2,rot=-P.a-M.PI/2,cr=M.cos(rot),sn=M.sin(rot);\r
 mc.setTransform(2,0,0,2,0,0);mc.clearRect(0,0,MS,MS);mc.save();mc.beginPath();mc.arc(ctr,ctr,ctr,0,TAU);mc.clip();mc.fillStyle='#24303a';mc.fillRect(0,0,MS,MS);\r
 mc.translate(ctr,ctr);mc.rotate(rot);mc.scale(Z/MMS,Z/MMS);mc.translate(-P.x*MMS,-P.y*MMS);mc.drawImage(MM,0,0);mc.restore();\r
 const mp=(x,y)=>{const dx=x-P.x,dy=y-P.y;return[ctr+(dx*cr-dy*sn)*Z,ctr+(dx*sn+dy*cr)*Z]};\r
 const dot=(x,y,c,r)=>{const p=mp(x,y);if(M.hypot(p[0]-ctr,p[1]-ctr)>ctr-3)return;mc.fillStyle=c;mc.beginPath();mc.arc(p[0],p[1],r,0,TAU);mc.fill()};\r
 NP.forEach(n=>dot(n.x,n.y,'#ffd54f',3));for(const g of GD)if(!g.done)dot(g.x,g.y,'#ff4040',2.6);if(boss&&E.includes(boss))dot(boss.x,boss.y,'#c0f',4);\r
 mc.fillStyle='rgba(255,255,255,.18)';mc.beginPath();mc.moveTo(ctr,ctr);mc.arc(ctr,ctr,34,-M.PI/2-.55,-M.PI/2+.55);mc.closePath();mc.fill();\r
 if(tg){let p=mp(tg.x,tg.y);const dx=p[0]-ctr,dy=p[1]-ctr,dd=M.hypot(dx,dy),lim=ctr-9;if(dd>lim)p=[ctr+dx/dd*lim,ctr+dy/dd*lim];mc.save();mc.translate(p[0],p[1]);mc.rotate(M.PI/4);mc.fillStyle='#ffd54f';mc.strokeStyle='#fff';mc.lineWidth=1.5;mc.fillRect(-4,-4,8,8);mc.strokeRect(-4,-4,8,8);mc.restore()}\r
 mc.fillStyle='#fff';mc.strokeStyle='#2a2f45';mc.lineWidth=1;mc.beginPath();mc.moveTo(ctr,ctr-7);mc.lineTo(ctr-5,ctr+5);mc.lineTo(ctr,ctr+2);mc.lineTo(ctr+5,ctr+5);mc.closePath();mc.fill();mc.stroke();\r
 mc.font='700 10px system-ui';mc.textAlign='center';mc.textBaseline='middle';mc.fillStyle='#fff';mc.fillText('N',ctr+sn*(ctr-7),ctr-cr*(ctr-7));\r
}\r
let last=0;function loop(t){const dt=M.min((t-last)/1000||0,.05);last=t;if(started){update(dt);render();drawFx();hud()}else{T+=dt;P.a+=dt*.2;render()}requestAnimationFrame(loop)}\r
const SC=['#2f6fb3','#b3392f','#2f9a5a','#7a4fc2','#e0a020'];\r
$('#sws').innerHTML=SC.map((c,i)=>\`<button class="sw\${i?'':' on'}" data-c="\${c}" style="background:\${c}" aria-label="Màu áo \${i+1}"></button>\`).join('');\r
$('#sws').onclick=e=>{const b=e.target.closest('.sw');if(!b)return;sleeve=b.dataset.c;document.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',s===b))};\r
\r
/* Câu hỏi do frame cha đẩy xuống — mở file trực tiếp thì không có nguồn nào cả. */\r
function applyQuestions(list){\r
 Q=(Array.isArray(list)?list:[]).filter(q=>q&&q.id&&q.content);\r
 const b=$('#go'),sv=$('#saved');\r
 if(!Q.length){\r
  b.disabled=true;b.textContent='Chờ câu hỏi từ ứng dụng…';\r
  sv.textContent='Mẫu đề thi này không tự tải câu hỏi. Mở bài thi trong ứng dụng (đường dẫn /assignment/…) để nhận câu hỏi từ giáo viên đã chọn.';\r
  return}\r
 const pts=Q.reduce((s,q)=>s+(q.points||0),0),sec=Q.reduce((s,q)=>s+(q.timeLimit||30),0);\r
 sv.textContent=Q.length+' thủ vệ · '+pts+' điểm tối đa · '+sec+' giây trả lời.';\r
 b.disabled=false;b.textContent='Vào trận';\r
}\r
function enter(){\r
 const n=$('#name').value.trim();if(!n){$('#name').focus();$('#name').style.outline='2px solid #ff6b81';return}\r
 pName=n;ac();\r
 A=Q.map(q=>({questionId:q.id,answerIds:[],text:'',timeSpent:0,answered:false}));doneN=0;tabOut=0;submitting=0;submitted=0;revealing=0;\r
 placeGuards(Q.length);\r
 Object.assign(P,{x:9.5,y:10.4,a:-1.8,pt:0,hp:100,mx:100,dead:0});\r
 started=1;startedAt=Date.now();env=0;curZone=zoneAt(P.x,P.y);$('#zn').textContent='📍 '+curZone;$('#intro').style.display='none';\r
 toast('Tìm thủ vệ có dấu ❗, bấm F để thách đấu. Mũi tên chỉ đường.');\r
}\r
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!submitted&&qOpen>=0){tabOut++;toast('⚠️ Bạn đã rời khỏi trang thi '+tabOut+' lần. Việc này được ghi nhận.')}});\r
addEventListener('beforeunload',e=>{if(started&&!submitted){e.preventDefault();e.returnValue=''}});\r
$('#go').onclick=enter;\r
askReady();requestAnimationFrame(loop);\r
<\/script>\r
</body>\r
</html>`,desc:`Đi lại trong thế giới 3D, tìm thủ vệ để thách đấu từng câu, cuối trận đánh Thạch Giáp.`,style:`3D`}],t=Object.fromEntries(e.map(e=>[e.id,e]));function n(e){return t[String(e||``)]||null}function r(e){return n(e)?.name||null}export{r as n,n as r,e as t};