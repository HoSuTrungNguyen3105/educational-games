// ===== WORLD: chuyển cảnh, vùng tương tác, va chạm, cập nhật game mỗi khung hình =====
function go(s,x,y,r){sc=s;me.x=x;me.y=y;if(r)rk=r;fade=1;if(s=="room")toast("Chào mừng đến "+RM[rk].n+"!")}
function ZN(){
 if(sc=="hall")return[{x:0,y:200,w:70,h:200,l:"🌳 Ra sân trường",f:()=>go("out",900,450)}].concat(KS.map(k=>({x:DX[k]-50,y:150,w:100,h:70,l:"🚪 Vào "+RM[k].n,f:()=>go("room",500,540,k)})));
 if(sc=="room")return[{x:380,y:140,w:240,h:130,l:"📖 Học bài với "+RM[rk].t,f:()=>quiz(rk)},{x:780,y:215,w:170,h:60,l:"📝 Làm bài thi",f:examMenu},{x:420,y:535,w:160,h:65,l:"🚪 Ra hành lang",f:()=>go("hall",DX[rk],240)}];
 const z=[{x:820,y:330,w:160,h:110,l:"🏫 Vào trường",f:()=>go("hall",110,300)}];
 P.forEach(p=>{const lock=p.lv&&S.lv<p.lv;z.push({x:p.x,y:p.b?p.y+p.h-10:p.y,w:p.w,h:p.b?60:p.h,l:lock?"":{shop:"🛍️ Mua sắm",can:"🍔 Ăn uống",garden:"🌸 Thu hoa",gym:"🏃 Tập chạy"}[p.id],f:{shop,can:canteen,garden,gym}[p.id],lock})});return z}
function near(){return ZN().find(z=>!z.lock&&me.x>z.x-30&&me.x<z.x+z.w+30&&me.y>z.y-30&&me.y<z.y+z.h+30)}
function act(){if(open_||fade>.5)return;const z=near();if(z)z.f()}
function blocked(x,y){
 if(sc=="hall")return y<195;
 if(sc=="room")return x<60||x>940||y<280||desks.some(d=>x>d[0]-8&&x<d[0]+98&&y>d[1]+8&&y<d[1]+52);
 return(x>520&&x<1280&&y>90&&y<352)||P.some(p=>p.b?x>p.x+5&&x<p.x+p.w-5&&y>p.y+60&&y<p.y+p.h-10:(p.lv&&S.lv<p.lv&&x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h))}
let last=performance.now();
function upd(dt){tt+=dt;if(fade>0)fade=Math.max(0,fade-dt*2.5);
 const[WW,WH]=D[sc];
 if(!open_&&fade<.6){let dx=jx+((keys.d||keys.arrowright)?1:0)-((keys.a||keys.arrowleft)?1:0),dy=jy+((keys.s||keys.arrowdown)?1:0)-((keys.w||keys.arrowup)?1:0);const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
 const sp=190*dt,nx=me.x+dx*sp,ny=me.y+dy*sp;if(!blocked(nx,me.y))me.x=Math.max(25,Math.min(WW-25,nx));if(!blocked(me.x,ny))me.y=Math.max(40,Math.min(WH-15,ny));me.mv=Math.min(1,m);if(m>.1)me.t+=dt*12}else me.mv=0;
 S.en=Math.min(100,S.en+dt/3);
 npcs.forEach(n=>{n.t-=dt;if(n.t<0){n.tx=n.b[0]+Math.random()*(n.b[2]-n.b[0]);n.ty=n.b[1]+Math.random()*(n.b[3]-n.b[1]);n.t=3+Math.random()*5}const d=Math.hypot(n.tx-n.x,n.ty-n.y);n.mv=d>6?1:0;if(d>6){n.x+=(n.tx-n.x)/d*60*dt;n.y+=(n.ty-n.y)/d*60*dt}if(n.say>0)n.say-=dt;else if(n.sc==sc&&Math.hypot(n.x-me.x,n.y-me.y)<110&&Math.random()<.01)n.say=2.5});
 ft=ft.filter(f=>(f.t-=dt)>0);
 if(ftime>0){ftime-=dt;if(sc=="out")flowers=flowers.filter(f=>{if(Math.hypot(f.x-me.x,f.y-me.y)<30){prog("flower");gain(4,3);return false}return true});if(!flowers.length){ftime=0;toast("🌸 Thu hoa xong! Giỏi lắm!")}else if(ftime<=0){flowers=[];toast("Hết giờ rồi!")}}
 const z=near(),b=$("act");if(z&&!open_){b.style.display="block";b.textContent=z.l}else b.style.display="none";
 $("loc").textContent=sc=="out"?"🌳 Sân trường":sc=="hall"?"🏫 Hành lang":"📍 "+RM[rk].n;
 $("lvt").textContent="⭐ Cấp "+S.lv;document.querySelector("#bar i").style.width=(S.xp/(S.lv*50)*100)+"%";
 $("coin").textContent="🪙 "+S.coins;$("gem").textContent="💎 "+S.gems;document.querySelector("#bar2 i").style.width=S.en+"%";
 $("qp").innerHTML="<b>📋 Nhiệm vụ</b><br>"+QU.map(q=>`• ${q.t}: ${S.q[q.k]||0}/${q.n}`).join("<br>");
 tickSchedule()}
