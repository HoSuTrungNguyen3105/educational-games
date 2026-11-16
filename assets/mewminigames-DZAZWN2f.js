var e=`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
<meta charset="utf-8">\r
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\r
<title>Mèo Mini Games</title>\r
<style>\r
:root{--bg:#fdf3ea;--card:#fffdf8;--line:#e6d9cb;--ink:#4a3328;--sub:#9a8272;--btn:#f0897a;--btnd:#c9564a;--frame:#e8d6c3;--off:#efe3d6;--ice:#dff1fb;\r
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\r
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#241b17;--card:#33271f;--line:#5a483b;--ink:#f6e8dc;--sub:#b9a190;--frame:#4a392d;--off:#4a392d;--ice:#2c4a5a}}\r
:root[data-theme="dark"]{--bg:#241b17;--card:#33271f;--line:#5a483b;--ink:#f6e8dc;--sub:#b9a190;--frame:#4a392d;--off:#4a392d;--ice:#2c4a5a}\r
html{scroll-padding-top:env(safe-area-inset-top,0px)}\r
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\r
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Nunito","Segoe UI",system-ui,sans-serif;min-height:100vh;display:flex;justify-content:center}\r
.app{width:100%;max-width:460px;padding:14px 16px 24px;display:flex;flex-direction:column;align-items:center;gap:10px}\r
.tabs{display:flex;gap:8px;width:100%;flex-wrap:wrap}\r
.tabs button{flex:1 1 40%;padding:10px 6px;border:0;border-radius:14px;background:var(--card);color:var(--ink);font:800 14px inherit;cursor:pointer;box-shadow:0 2px 0 var(--line)}\r
.tabs button.on{background:var(--btn);color:#fff;box-shadow:0 2px 0 var(--btnd)}\r
.top{display:flex;align-items:center;gap:10px}\r
h1{margin:0;font-size:20px}\r
.tag{padding:2px 12px;border-radius:99px;font-size:13px;font-weight:700;color:#fff;background:#f08a80}\r
img.cat{height:90px;width:auto;object-fit:contain;margin-bottom:-14px;position:relative;z-index:2}\r
.cat{font-size:56px;line-height:1;margin-bottom:-14px;position:relative;z-index:2}\r
.frame{background:var(--frame);padding:10px;border-radius:24px;width:100%}\r
.grid{display:grid;gap:6px;width:100%;aspect-ratio:1;background:var(--card);border-radius:16px;padding:8px;touch-action:none;user-select:none;-webkit-user-select:none}\r
.grid>*{border:0;border-radius:12px;font:800 clamp(14px,5vw,24px) inherit;color:var(--ink);padding:0;display:flex;align-items:center;justify-content:center}\r
.grid button{cursor:pointer;transition:all .15s}\r
.P{background:var(--off);box-shadow:inset 0 -3px 0 #0001}\r
.P.path{background:#8a5fd0;color:#fff}\r
.P.end{outline:3px dashed var(--btn)}\r
.P.next{outline:2px solid #8a5fd088}\r
.I{background:var(--ice);font-size:clamp(20px,7vw,34px)!important}\r
.A{background:var(--off)}\r
.A.on{background:var(--btn)}\r
#auxf{display:none;width:52%;padding:6px;border-radius:16px}\r
#aux{gap:3px;padding:4px;border-radius:10px}\r
.info{display:flex;justify-content:space-between;width:100%;font-weight:800;font-size:15px}\r
.msg{min-height:22px;font-size:14px;font-weight:700;text-align:center;color:var(--sub)}\r
.tools{display:flex;gap:10px;width:100%}\r
.tools button,.go{padding:10px;border:0;border-radius:16px;background:var(--card);color:var(--ink);font:700 15px inherit;cursor:pointer;box-shadow:0 2px 0 var(--line);flex:1}\r
.go{background:var(--btn);color:#fff;box-shadow:0 4px 0 var(--btnd);font-weight:800}\r
.help{font-size:12px;color:var(--sub);text-align:center;line-height:1.5}\r
.win{animation:pop .4s}\r
@keyframes pop{50%{transform:scale(1.03)}}\r
</style>\r
</head>\r
<body>\r
<div class="app">\r
  <div class="tabs"><button class="on">🧭 Đường Tổng</button><button>⚖️ Cân Số</button><button>🧊 Trượt Băng</button><button>🪞 Gương Thần</button></div>\r
  <img class="cat" src="edu_character.png" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'cat',textContent:'🐱'}))">\r
  <div class="top"><h1 id="title"></h1><span class="tag" id="lv"></span></div>\r
  <div class="info"><span id="i1"></span><span id="i2"></span></div>\r
  <div class="frame" id="auxf"><div class="grid" id="aux"></div></div>\r
  <div class="frame"><div class="grid" id="grid"></div></div>\r
  <div class="msg" id="msg"></div>\r
  <div class="tools" id="tools"></div>\r
  <div class="help" id="help"></div>\r
</div>\r
<script>\r
const $=id=>document.getElementById(id);\r
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1));\r
const store=(k,v)=>{try{if(v===undefined)return +localStorage.getItem(k)||1;localStorage.setItem(k,v)}catch(e){return 1}};\r
let cur=0,lv=[0,1,2,3].map(i=>store('g_l'+i)),S={},won=false;\r
const label=l=>l<=2?'Dễ':l<=5?'Vừa':l<=9?'Khó':'Siêu khó';\r
\r
// ---------- 0: Đường Tổng ----------\r
function newPath(){\r
  const l=lv[0],n=Math.min(7,3+Math.floor((l-1)/2)),mx=Math.min(9,5+Math.floor(l/2));\r
  const v=Array.from({length:n},()=>Array.from({length:n},()=>R(1,mx)));\r
  let r=0,c=0,sum=v[0][0];\r
  while(r<n-1||c<n-1){if(r===n-1)c++;else if(c===n-1)r++;else if(Math.random()<.5)r++;else c++;sum+=v[r][c]}\r
  S={n,v,target:sum,path:[[0,0]]};\r
  $('title').textContent='Đường Tổng';\r
  $('help').textContent='Đi từ ô trên-trái đến ô dưới-phải, chỉ được sang phải hoặc xuống dưới. Tổng các số trên đường đi phải đúng bằng mục tiêu. Chạm ô cuối để lùi một bước.';\r
  $('tools').innerHTML='<button id="ud">↶ Lùi</button><button id="rs">⟲ Làm lại</button>';\r
  $('ud').onclick=()=>{if(!won&&S.path.length>1){S.path.pop();$('msg').textContent='';draw()}};\r
  $('rs').onclick=()=>{if(!won){S.path=[[0,0]];$('msg').textContent='';draw()}};\r
}\r
const psum=()=>S.path.reduce((s,[r,c])=>s+S.v[r][c],0);\r
function drawPath(){\r
  const g=$('grid'),n=S.n;g.style.gridTemplateColumns=\`repeat(\${n},1fr)\`;g.innerHTML='';\r
  const [lr,lc]=S.path[S.path.length-1];\r
  S.v.forEach((row,r)=>row.forEach((x,c)=>{const e=document.createElement('button');\r
    const inP=S.path.some(p=>p[0]===r&&p[1]===c);\r
    e.className='P'+(inP?' path':'')+((r===n-1&&c===n-1)?' end':'')+(!inP&&((r===lr+1&&c===lc)||(r===lr&&c===lc+1))?' next':'');\r
    e.textContent=x;\r
    e.onclick=()=>{if(won)return;\r
      if(r===lr&&c===lc){if(S.path.length>1)S.path.pop()}\r
      else if((r===lr+1&&c===lc)||(r===lr&&c===lc+1))S.path.push([r,c]);\r
      else{$('msg').textContent='Chỉ đi sang phải hoặc xuống dưới ô hiện tại.';return}\r
      $('msg').textContent='';draw();\r
      const [a,b]=S.path[S.path.length-1];\r
      if(a===n-1&&b===n-1){if(psum()===S.target)win();else $('msg').textContent=\`Tổng là \${psum()}, cần \${S.target}. Thử đường khác!\`}\r
      else if(psum()>=S.target)$('msg').textContent='Tổng đã vượt mục tiêu, hãy lùi lại.';\r
    };g.appendChild(e)}));\r
  $('i1').textContent='Mục tiêu: '+S.target;$('i2').textContent='Hiện tại: '+psum();\r
}\r
\r
// ---------- 1: Cân Số ----------\r
function newBal(){\r
  const l=lv[1],n=Math.min(10,4+Math.floor(l/2)),mx=Math.min(40,6+l*3);\r
  const w=Array.from({length:n},()=>R(1,mx));\r
  const pick=[...w.keys()].sort(()=>Math.random()-.5).slice(0,R(2,Math.max(2,Math.ceil(n/2)+1)));\r
  S={w,sel:new Set(),target:pick.reduce((s,i)=>s+w[i],0)};\r
  $('title').textContent='Cân Số';\r
  $('help').textContent='Chọn một số quả cân sao cho tổng đúng bằng số cần cân. Chạm lại quả cân đã chọn để bỏ ra.';\r
  $('tools').innerHTML='<button id="rs">⟲ Bỏ chọn hết</button>';\r
  $('rs').onclick=()=>{if(!won){S.sel.clear();draw()}};\r
}\r
function drawBal(){\r
  const g=$('grid');g.style.aspectRatio='auto';g.style.gridAutoRows='70px';g.style.gridTemplateColumns='repeat(4,1fr)';g.innerHTML='';\r
  const sum=[...S.sel].reduce((s,i)=>s+S.w[i],0);\r
  S.w.forEach((x,i)=>{const e=document.createElement('button');e.className='P'+(S.sel.has(i)?' path':'');e.textContent='⚖️ '+x;\r
    e.onclick=()=>{if(won)return;S.sel.has(i)?S.sel.delete(i):S.sel.add(i);draw();\r
      if([...S.sel].reduce((a,j)=>a+S.w[j],0)===S.target)win()};g.appendChild(e)});\r
  $('i1').textContent='Cần cân: '+S.target;$('i2').textContent='Đang chọn: '+sum;\r
  if(!won)$('msg').textContent=sum===0?'':sum<S.target?\`Còn nhẹ, thiếu \${S.target-sum} ⬆️\`:\`Quá nặng, thừa \${sum-S.target} ⬇️\`;\r
}\r
\r
// ---------- 2: Trượt Băng ----------\r
const DIR={L:[0,-1],U:[-1,0],D:[1,0],R:[0,1]};\r
function slide(T,p,d){let [r,c]=p;const [dr,dc]=DIR[d];\r
  while(true){const nr=r+dr,nc=c+dc;if(nr<0||nc<0||nr>=T.n||nc>=T.n||T.rock.has(nr*T.n+nc))break;r=nr;c=nc;if(r===T.g[0]&&c===T.g[1])break}\r
  return [r,c]}\r
function solve(T){const q=[[T.s,0]],seen=new Set([T.s[0]*T.n+T.s[1]]);\r
  for(let i=0;i<q.length;i++){const [p,d]=q[i];if(p[0]===T.g[0]&&p[1]===T.g[1])return d;\r
    for(const k in DIR){const e=slide(T,p,k),key=e[0]*T.n+e[1];if(!seen.has(key)){seen.add(key);q.push([e,d+1])}}}\r
  return -1}\r
function newIce(){\r
  const l=lv[2],n=Math.min(8,4+Math.floor(l/3)),want=Math.min(2+Math.floor(l/2),9);let best=null;\r
  for(let t=0;t<400;t++){\r
    const rock=new Set(),k=Math.min(Math.floor(n*n*.35),3+l);\r
    while(rock.size<k)rock.add(R(0,n*n-1));\r
    const free=[...Array(n*n).keys()].filter(x=>!rock.has(x));\r
    const a=free[R(0,free.length-1)],b=free[R(0,free.length-1)];if(a===b)continue;\r
    const T={n,rock,s:[a/n|0,a%n],g:[b/n|0,b%n]},m=solve(T);\r
    if(m>=0&&(!best||m>best.m))best={...T,m};\r
    if(m>=want)break}\r
  S={...best,pos:[...best.s],moves:0,par:best.m};\r
  $('title').textContent='Trượt Băng';\r
  $('help').textContent='Mèo đứng trên băng nên cứ trượt thẳng cho đến khi đụng đá 🪨 hoặc tường mới dừng (gặp cá 🐟 thì dừng và ăn luôn). Vuốt hoặc bấm mũi tên để dẫn mèo đến cá với ít lượt nhất.';\r
  $('tools').innerHTML='<button data-k="L">←</button><button data-k="U">↑</button><button data-k="D">↓</button><button data-k="R">→</button><button id="rs">⟲</button>';\r
  $('tools').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>iceMove(b.dataset.k));\r
  $('rs').onclick=()=>{if(!won){S.pos=[...S.s];S.moves=0;$('msg').textContent='';draw()}};\r
}\r
function iceMove(k){\r
  if(won||cur!==2)return;\r
  const e=slide(S,S.pos,k);\r
  if(e[0]===S.pos[0]&&e[1]===S.pos[1]){$('msg').textContent='Bị chặn rồi, thử hướng khác!';return}\r
  S.pos=e;S.moves++;$('msg').textContent='';draw();\r
  if(e[0]===S.g[0]&&e[1]===S.g[1])win();\r
}\r
function drawIce(){\r
  const g=$('grid');g.style.gridTemplateColumns=\`repeat(\${S.n},1fr)\`;g.innerHTML='';\r
  for(let r=0;r<S.n;r++)for(let c=0;c<S.n;c++){const e=document.createElement('div');e.className='I';\r
    e.textContent=(r===S.pos[0]&&c===S.pos[1])?'🐱':S.rock.has(r*S.n+c)?'🪨':(r===S.g[0]&&c===S.g[1])?'🐟':'';\r
    g.appendChild(e)}\r
  $('i1').textContent='Lượt: '+S.moves;$('i2').textContent='Tối thiểu: '+S.par;\r
}\r
let sx,sy;\r
$('grid').addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});\r
$('grid').addEventListener('pointerup',e=>{if(cur!==2)return;const dx=e.clientX-sx,dy=e.clientY-sy;\r
  if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;\r
  iceMove(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))});\r
document.addEventListener('keydown',e=>{const m={ArrowLeft:'L',ArrowUp:'U',ArrowDown:'D',ArrowRight:'R'}[e.key];if(m&&cur===2){e.preventDefault();iceMove(m)}});\r
\r
// ---------- 3: Gương Thần ----------\r
function tf(m,n,g){const o=Array.from({length:n},()=>Array(n).fill(0));\r
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){const v=g[r][c];\r
    if(m===0)o[r][n-1-c]=v;else if(m===1)o[n-1-r][c]=v;else if(m===2)o[c][n-1-r]=v;else o[n-1-r][n-1-c]=v}\r
  return o}\r
const MN=['Lật trái ↔ phải','Lật trên ↕ dưới','Xoay 90° ↻','Xoay 180°'];\r
const MH=['Gương đặt dọc bên phải hình: ô bên trái sẽ thành bên phải.','Gương đặt ngang bên dưới hình: ô phía trên sẽ thành phía dưới.','Hình xoay 90° theo chiều kim đồng hồ quanh tâm.','Hình xoay nửa vòng (180°) quanh tâm.'];\r
function newMir(){\r
  const l=lv[3],n=Math.min(6,3+Math.floor((l-1)/3)),m=l<=3?0:l<=6?R(0,1):l<=9?R(0,2):R(0,3);\r
  let g;\r
  do{g=Array.from({length:n},()=>Array.from({length:n},()=>Math.random()<.4?1:0))}\r
  while(!g.flat().some(x=>x)||JSON.stringify(tf(m,n,g))===JSON.stringify(g));\r
  S={n,m,g,goal:tf(m,n,g),me:Array.from({length:n},()=>Array(n).fill(0))};\r
  $('title').textContent='Gương Thần';\r
  $('help').textContent='Hình nhỏ phía trên là hình gốc. '+MH[m]+' Hãy chạm vào lưới lớn để tô đúng hình sau khi biến đổi.';\r
  $('tools').innerHTML='<button id="rs">⟲ Xóa hết</button>';\r
  $('rs').onclick=()=>{if(!won){S.me=S.me.map(r=>r.map(()=>0));draw()}};\r
}\r
function drawMir(){\r
  $('auxf').style.display='block';\r
  const a=$('aux');a.style.gridTemplateColumns=\`repeat(\${S.n},1fr)\`;a.innerHTML='';\r
  S.g.forEach(row=>row.forEach(v=>{const e=document.createElement('div');e.className='A'+(v?' on':'');a.appendChild(e)}));\r
  const g=$('grid');g.style.gridTemplateColumns=\`repeat(\${S.n},1fr)\`;g.innerHTML='';\r
  S.me.forEach((row,r)=>row.forEach((v,c)=>{const e=document.createElement('button');e.className='P'+(v?' path':'');e.textContent=v?'🐾':'';\r
    e.onclick=()=>{if(won)return;S.me[r][c]=v?0:1;draw();if(JSON.stringify(S.me)===JSON.stringify(S.goal))win()};g.appendChild(e)}));\r
  $('i1').textContent='Biến đổi: '+MN[S.m];$('i2').textContent='';\r
}\r
\r
// ---------- common ----------\r
const NEW=[newPath,newBal,newIce,newMir],DRAW=[drawPath,drawBal,drawIce,drawMir];\r
function draw(){DRAW[cur]()}\r
function win(){\r
  won=true;lv[cur]++;store('g_l'+cur,lv[cur]);\r
  $('msg').innerHTML='🎉 Hoàn thành!<br><button class="go" id="nx" style="margin-top:8px;padding:10px 24px;flex:none">Level tiếp theo ▶</button>';\r
  $('nx').onclick=start;$('grid').classList.add('win');\r
}\r
function start(){\r
  won=false;const g=$('grid');g.classList.remove('win');$('msg').textContent='';\r
  g.style.aspectRatio='1';g.style.gridAutoRows='auto';$('auxf').style.display='none';\r
  $('lv').textContent='Level '+lv[cur]+' · '+label(lv[cur]);\r
  NEW[cur]();draw();\r
}\r
const TB=[...document.querySelectorAll('.tabs button')];\r
TB.forEach((b,i)=>b.onclick=()=>{cur=i;TB.forEach((x,j)=>x.classList.toggle('on',i===j));start()});\r
start();\r
<\/script>\r
</body>\r
</html>`;export{e as default};