// ===== SCENES: vẽ sân trường, tòa nhà, hành lang, lớp học =====
const tufts=[],flw=[],trees=[];
for(let i=0;i<260;i++)tufts.push([Math.random()*1800,Math.random()*1100,Math.random()]);
for(let i=0;i<110;i++)flw.push([Math.random()*1800,Math.random()*1100,["#fff","#ffd23f","#ff8fb1","#b28dff"][i%4]]);
for(let i=0;i<46;i++){const x=Math.random()*1800,y=60+Math.random()*1040;if(!P.some(p=>x>p.x-70&&x<p.x+p.w+70&&y>p.y-70&&y<p.y+p.h+90)&&!(y>470&&y<650)&&!(x>800&&x<1000)&&!(x>480&&x<1320&&y<420)&&!(x>120&&x<330&&y>230&&y<350))trees.push([x,y,.8+Math.random()*.5])}
function tree(x,y,s){g.fillStyle="rgba(0,0,0,.18)";g.beginPath();g.ellipse(x+8*s,y+16,28*s,10*s,0,0,7);g.fill();rg(x-5*s,y-12*s,10*s,28*s,3,"#8b5a2b");
 [[0,-30,26,"#2e9e4a"],[-14,-20,18,"#38b155"],[14,-20,18,"#38b155"],[-4,-40,16,"#4cc866"]].forEach(([a,b,r,c])=>{const q=g.createRadialGradient(x+a*s-5,y+b*s-5,2,x+a*s,y+b*s,r*s);q.addColorStop(0,"#7ee08d");q.addColorStop(1,c);g.fillStyle=q;g.beginPath();g.arc(x+a*s,y+b*s,r*s,0,7);g.fill()})}
function house(p){const{x,y,w,h}=p;g.fillStyle="rgba(0,0,0,.2)";g.beginPath();g.ellipse(x+w/2+14,y+h-2,w/2+24,15,0,0,7);g.fill();
 rg(x,y+55,w,h-65,10,p.c);g.fillStyle=p.r;g.beginPath();g.moveTo(x-16,y+66);g.lineTo(x+w/2,y-6);g.lineTo(x+w+16,y+66);g.closePath();g.fill();g.fillStyle="rgba(255,255,255,.18)";g.beginPath();g.moveTo(x-16,y+66);g.lineTo(x+w/2,y-6);g.lineTo(x+w/2,y+66);g.fill();
 for(let i=0;i<2;i++){const wx=x+22+i*(w-92);rr(wx-4,y+92,66,56,8,"#fff");const q=g.createLinearGradient(0,y+96,0,y+144);q.addColorStop(0,"#bfe9ff");q.addColorStop(1,"#6fb9ef");rr(wx,y+96,58,48,5,q);g.fillStyle="#fff";g.fillRect(wx+27,y+96,4,48);g.fillRect(wx,y+118,58,4)}
 rr(x+w/2-24,y+h-80,48,70,8,"#7a4a2a");g.fillStyle="#ffd23f";g.beginPath();g.arc(x+w/2+14,y+h-44,3,0,7);g.fill();
 for(let i=0;i<8;i++){g.fillStyle=i%2?"#fff":p.r;g.fillRect(x+w/2-40+i*10,y+h-92,10,14)}}
function school(){const x=520,y=90;g.fillStyle="rgba(0,0,0,.22)";g.beginPath();g.ellipse(900,358,420,20,0,0,7);g.fill();
 rg(x,y+120,760,235,6,"#b5503f");g.fillStyle="rgba(0,0,0,.09)";for(let i=0;i<24;i++)g.fillRect(x,y+126+i*10,760,2);
 rr(x-10,y+110,780,16,4,"#f1e7d3");rr(x-10,y+232,780,10,3,"#f1e7d3");
 for(let s=0;s<2;s++)for(let r=0;r<2;r++)for(let i=0;i<4;i++){const wx=s?1000+i*62:x+40+i*62,wy=y+140+r*110;rr(wx-3,wy-3,50,66,6,"#f1e7d3");const q=g.createLinearGradient(0,wy,0,wy+60);q.addColorStop(0,"#cfeeff");q.addColorStop(1,"#6fb0e6");rr(wx,wy,44,60,4,q);g.fillStyle="#f1e7d3";g.fillRect(wx+20,wy,4,60);g.fillRect(wx,wy+28,44,4)}
 rg(810,y-10,180,365,8,"#c25b49");g.fillStyle="rgba(0,0,0,.09)";for(let i=0;i<34;i++)g.fillRect(810,y-4+i*10,180,2);
 g.fillStyle="#6b3a2a";g.beginPath();g.moveTo(796,y+8);g.lineTo(900,y-62);g.lineTo(1004,y+8);g.fill();g.fillStyle="rgba(255,255,255,.15)";g.beginPath();g.moveTo(796,y+8);g.lineTo(900,y-62);g.lineTo(900,y+8);g.fill();
 g.fillStyle="#fff";g.beginPath();g.arc(900,y+34,24,0,7);g.fill();g.strokeStyle="#6b3a2a";g.lineWidth=4;g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(900,y+34);g.lineTo(900,y+20);g.moveTo(900,y+34);g.lineTo(910,y+38);g.stroke();
 rr(826,y+76,148,30,8,"#2c3e66");tx("TRƯỜNG VUI VẺ",900,y+97,16,"#ffd23f");
 rr(850,y+150,100,60,6,"#f1e7d3");rr(856,y+156,88,48,4,"#9fd8ff");
 rr(842,y+262,116,93,8,"#f1e7d3");rr(852,y+270,45,85,4,"#7a4a2a");rr(903,y+270,45,85,4,"#7a4a2a");g.fillStyle="#ffd23f";g.beginPath();g.arc(890,y+318,3,0,7);g.arc(910,y+318,3,0,7);g.fill();
 rr(830,y+355,140,10,3,"#cfcfd6");rr(820,y+362,160,8,3,"#bbb");
 g.fillStyle="#999";g.fillRect(560,y+20,3,100);rr(563,y+22,34,22,3,"#e74c3c");g.fillRect(1236,y+20,3,100);rr(1239,y+22,34,22,3,"#3b82c4")}
function drawOut(){const w=1800,h=1100;
 const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#8fdc78");bg.addColorStop(1,"#6cc15a");g.fillStyle=bg;g.fillRect(0,0,w,h);
 tufts.forEach(([x,y,r])=>{g.fillStyle=r>.5?"#5fb44e":"#9be58a";g.beginPath();g.moveTo(x,y);g.lineTo(x-3,y-8);g.lineTo(x+1,y-4);g.lineTo(x+4,y-9);g.lineTo(x+5,y);g.fill()});
 flw.forEach(([x,y,c])=>{g.fillStyle=c;g.beginPath();g.arc(x,y,3,0,7);g.fill()});
 g.fillStyle="#b7bcc6";g.fillRect(0,494,w,132);g.fillRect(824,0,152,h);g.fillStyle="#d9dde3";g.fillRect(0,500,w,120);g.fillRect(830,0,140,h);
 g.fillStyle="rgba(255,255,255,.85)";for(let x=0;x<w;x+=80)g.fillRect(x,556,40,8);
 g.fillStyle="#f2f2f2";g.fillRect(0,496,w,6);g.fillRect(0,618,w,6);
 g.fillStyle="#c9a77c";g.fillRect(500,350,800,16);
 const pg=g.createRadialGradient(230,300,10,230,300,110);pg.addColorStop(0,"#9be1ff");pg.addColorStop(1,"#4fa8e0");g.fillStyle="#d7c9a8";g.beginPath();g.ellipse(230,300,118,66,0,0,7);g.fill();g.fillStyle=pg;g.beginPath();g.ellipse(230,300,104,54,0,0,7);g.fill();g.strokeStyle="rgba(255,255,255,.6)";g.lineWidth=2;const rp=(tt*20)%40;g.beginPath();g.ellipse(230,300,20+rp,10+rp/2,0,0,7);g.stroke();g.font="22px serif";g.fillText("🦆",200+Math.sin(tt)*30,305);
 school();
 P.forEach(p=>{const lock=p.lv&&S.lv<p.lv;
  if(p.b)house(p);else{rr(p.x,p.y,p.w,p.h,22,lock?"#8fa0a0":p.c);rr(p.x+6,p.y+6,p.w-12,p.h-12,18,lock?"#9fb0b0":"rgba(255,255,255,.18)");g.strokeStyle="rgba(255,255,255,.7)";g.lineWidth=4;g.setLineDash([14,10]);g.strokeRect(p.x+10,p.y+10,p.w-20,p.h-20);g.setLineDash([]);
   g.font="28px serif";if(p.id=="garden"&&!lock)for(let i=0;i<16;i++)g.fillText(["🌷","🌼","🌻","🌱"][i%4],p.x+40+(i*57)%(p.w-70),p.y+70+Math.floor(i/5)*80+(i%2)*14);
   if(p.id=="gym"&&!lock){g.font="44px serif";g.fillText("⚽",p.x+80,p.y+170);g.fillText("🏀",p.x+290,p.y+120);g.fillText("🥅",p.x+190,p.y+250)}}
  const lab=lock?`🔒 Mở ở cấp ${p.lv}`:p.n;g.font="bold 16px system-ui";const lw=g.measureText(lab).width+22;rr(p.x+p.w/2-lw/2,p.y-34,lw,28,14,"rgba(255,255,255,.92)");tx(lab,p.x+p.w/2,p.y-14,16,"#223")});
 trees.forEach(([x,y,s])=>tree(x,y,s));
 g.fillStyle="#f5c542";const by=480+Math.sin(tt)*6;rr(1600+0,by+60,0,0,0,"#000");
 {const bx=1620,q=g.createRadialGradient(bx-15,by-15,5,bx,by,60);q.addColorStop(0,"#ffe27a");q.addColorStop(1,"#f09a1d");g.fillStyle=q;g.beginPath();g.ellipse(bx,by+330,48,58,0,0,7);g.fill();g.fillStyle="#3b82c4";g.fillRect(bx-48,by+316,96,18);tx("VUI VẺ",bx,by+330,11,"#fff");rr(bx-14,by+386,28,20,4,"#8b5a2b");g.strokeStyle="#8b5a2b";g.lineWidth=2;g.beginPath();g.moveTo(bx-30,by+378);g.lineTo(bx-14,by+388);g.moveTo(bx+30,by+378);g.lineTo(bx+14,by+388);g.stroke()}
 flowers.forEach(f=>{g.font="28px serif";g.fillText("🌸",f.x,f.y+Math.sin(tt*4+f.x)*3)});
 for(let i=0;i<4;i++){g.fillStyle="rgba(0,0,0,.06)";g.beginPath();g.ellipse((tt*14+i*520)%(w+500)-250,200+i*260,150,60,0,0,7);g.fill()}}
function drawHall(){const w=1700;
 const fl=g.createLinearGradient(0,170,0,420);fl.addColorStop(0,"#ecdfc6");fl.addColorStop(1,"#d9c7a4");g.fillStyle=fl;g.fillRect(0,170,w,250);
 g.fillStyle="rgba(0,0,0,.05)";for(let i=0;i<29;i++)for(let j=0;j<5;j++)if((i+j)%2)g.fillRect(i*60,170+j*60,60,60);
 const wl=g.createLinearGradient(0,0,0,170);wl.addColorStop(0,"#fff6e0");wl.addColorStop(1,"#f0e2c2");g.fillStyle=wl;g.fillRect(0,0,w,170);rr(0,112,w,58,0,"#7fb2e5");g.fillStyle="rgba(255,255,255,.3)";g.fillRect(0,112,w,5);g.fillStyle="#8b6b4a";g.fillRect(0,166,w,8);
 KS.forEach((k,i)=>{const dx=DX[k],r=RM[k];
  for(let j=0;j<3;j++)rg(dx+110+j*30,80,26,88,4,["#e17055","#fdcb6e","#74b9ff"][(i+j)%3]);
  rr(dx-56,34,112,136,8,"#fff");rg(dx-46,44,92,126,5,"#9a6236");rr(dx-24,58,48,40,5,"#bfe6ff");g.fillStyle="#ffd23f";g.beginPath();g.arc(dx+32,118,4,0,7);g.fill();
  rr(dx-66,4,132,26,8,"#2c3e66");tx(r.e+" "+r.n,dx,23,14,"#fff")});
 tx("Chào mừng đến Trường Vui Vẻ 🎒",850,62,22,"#c0504d");
 g.font="40px serif";[170,500,820,1180,1500].forEach(x=>g.fillText("🪴",x,170));
 rr(0,200,22,190,4,"#9fd8ff");g.fillStyle="#fff8";g.fillRect(4,200,5,190);tx("Ra sân",50,180,12,"#223");
 for(let i=0;i<7;i++){g.fillStyle="rgba(255,240,170,.35)";g.beginPath();g.ellipse(100+i*250,300,90,30,0,0,7);g.fill()}}
function drawRoom(){const r=RM[rk];g.fillStyle=r.f;g.fillRect(0,0,1000,600);
 g.fillStyle="rgba(0,0,0,.06)";for(let i=0;i<20;i++)for(let j=0;j<12;j++)if((i+j)%2)g.fillRect(i*50,j*50,50,50);
 const q=g.createLinearGradient(0,0,0,140);q.addColorStop(0,"#fbf5e6");q.addColorStop(1,"#e4d8bf");g.fillStyle=q;g.fillRect(0,0,1000,140);rr(0,128,1000,14,0,"#8b6b4a");
 rr(236,14,528,108,10,"#7a5230");rr(248,26,504,82,6,"#2f5d4a");tx(r.b,500,78,26,"#fff");rr(300,112,400,8,3,"#a97c50");
 g.fillStyle="#fff";g.beginPath();g.arc(110,64,30,0,7);g.fill();g.strokeStyle="#333";g.lineWidth=4;g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(110,64);g.lineTo(110,46);g.moveTo(110,64);g.lineTo(124,70);g.stroke();
 rr(826,20,118,92,8,"#fff");rr(834,28,102,76,5,"#9fd8ff");g.fillStyle="#fff";g.fillRect(883,28,4,76);g.fillRect(834,64,102,4);
 g.font="46px serif";g.fillText(r.e,50,122);g.fillText(r.e,950,170);g.font="34px serif";for(let i=0;i<6;i++)g.fillText("📚",20+i*0,180+i*0);
 const rug=g.createRadialGradient(500,450,20,500,450,260);rug.addColorStop(0,"rgba(255,255,255,.35)");rug.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=rug;g.fillRect(200,300,600,300);
 rr(420,555,160,45,8,"#7a4a2a");rr(432,562,60,38,4,"#9a6236");rr(508,562,60,38,4,"#9a6236");
 studs.forEach(s=>{if(s.on)chr(s.x,s.y,s.c,"",s.n,tt*2+s.x,null,0)});
 desks.forEach(d=>{g.fillStyle="rgba(0,0,0,.18)";g.beginPath();g.ellipse(d[0]+48,d[1]+54,52,8,0,0,7);g.fill();rg(d[0],d[1]+10,90,36,6,"#c68b4e");rr(d[0]+8,d[1]+46,6,10,2,"#7a5230");rr(d[0]+76,d[1]+46,6,10,2,"#7a5230");rr(d[0]+30,d[1]+16,28,16,3,"#fff")});
 rg(790,225,150,42,8,"#6c5ce7");tx("📝 BÀI THI",865,253,16,"#fff");rg(430,236,140,32,6,"#9c6b3f");g.font="22px serif";g.fillText("🍎",450,262);
 const near_=Math.hypot(me.x-500,me.y-225)<150;chr(500,226,r.c,"🎓",r.t,tt*2,near_?"Chào em!":null,0)}
