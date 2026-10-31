// ===== WORLD: chuyển cảnh, vùng tương tác tự động, va chạm, chat, cập nhật mỗi khung hình =====

/* PEND  : tiết đang chờ bé ngồi vào bàn để học/thi (do js/schedule.js đặt)
   zin   : latch các vùng — phải rời vùng rồi mới kích hoạt lại
   climb : trạng thái leo cầu thang */
let PEND=null,_pendCd=0,_doneKeys={},zin={},climb=null;

function go(s,x,y,r){sc=s;me.x=x;me.y=y;if(r)rk=r;fade=1;zin={};npcClose();if(s=="room")toast("Chào mừng đến "+RM[rk].n+"!");if(W3)W3.enter()}

/* Vùng TỰ KÍCH HOẠT: đi vào vùng là chạy ngay — KHÔNG có nút bấm.
   Vào cửa trường/cửa lớp/cầu thang hay bước vào nhà đều tự mở. */
function ZN(){
 if(sc=="out"){
  const z=[{id:"school",x:1120,y:356,w:160,h:110,f:()=>go("hall",140,300)}];
  P.forEach(p=>{if(p.lv&&S.lv<p.lv)return;
   const f={shop,can:canteen,garden,pet:typeof petGarden==="function"?petGarden:garden,gym:typeof petGarden==="function"?petGarden:garden}[p.id];
   z.push(p.b?{id:p.id,x:p.x,y:p.y+p.h-10,w:p.w,h:60,f}:{id:p.id,x:p.x,y:p.y,w:p.w,h:p.h,f})});
  return z;
 }
 if(sc=="hall")return[
  {id:"out",x:0,y:195,w:70,h:210,f:()=>go("out",1200,560)},
  ...KS.map(k=>({id:"d_"+k,x:DX[k]-55,y:195,w:160,h:60,f:()=>go("room",500,505,k)})),
  {id:"stairs",x:1560,y:195,w:140,h:210,f:climbUp}];
 if(sc=="hall2")return[
  {id:"down",x:1560,y:195,w:140,h:210,f:climbDown},
  {id:"d_lib",x:DX.lib-55,y:195,w:160,h:60,f:()=>go("room",500,505,"lib")}];
 if(sc=="room")return rk=="lib"
  ?[{id:"teach",x:360,y:150,w:280,h:170,f:readBook}]
  :[{id:"teach",x:360,y:150,w:280,h:170,f:()=>quiz(rk)}];
 return[];
}

/* Ngồi vào bàn: đứng trong khoảng giữa hai hàng bàn, cạnh một bàn bất kỳ */
function seatAt(){return desks.find(d=>Math.abs(me.x-(d[0]+45))<58&&me.y>d[1]+50&&me.y<d[1]+108)||null}

/* ── CẦU THANG: khoá điều khiển, bé tự "bước" lên từng bậc rồi đổi tầng ── */
function climbUp(){if(climb)return;climb={dir:1,t:0};toast("🪜 Đi lên tầng 2…")}
function climbDown(){if(climb)return;climb={dir:-1,t:0};toast("🪜 Đi xuống tầng 1…")}

function blocked(x,y){
 if(sc=="hall"||sc=="hall2")return y<195;
 if(sc=="room")return x<60||x>940||y<280||desks.some(d=>x>d[0]-8&&x<d[0]+98&&y>d[1]+8&&y<d[1]+52);
 return(x>820&&x<1580&&y>90&&y<352)||P.some(p=>p.b?x>p.x+5&&x<p.x+p.w-5&&y>p.y+60&&y<p.y+p.h-10:(p.lv&&S.lv<p.lv&&x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h))}

let last=performance.now();
function upd(dt){tt+=dt;if(fade>0)fade=Math.max(0,fade-dt*2.5);
 if(_pendCd>0)_pendCd-=dt;

 /* Leo cầu thang: khoá điều khiển, di chuyển lên đến khi hết bậc thì đổi cảnh */
 if(climb){climb.t+=dt;me.y-=150*dt;me.mv=1;me.t+=dt*12;me.dx=0;me.dy=-1;
  if(climb.t>=1.05){const d=climb.dir;climb=null;if(d>0)go("hall2",120,320);else go("hall",DX.math,300)}
  tickSchedule();return}

 const[WW,WH]=D[sc];
 if(!open_&&fade<.6){let dx=jx+((keys.d||keys.arrowright)?1:0)-((keys.a||keys.arrowleft)?1:0),dy=jy+((keys.s||keys.arrowdown)?1:0)-((keys.w||keys.arrowup)?1:0);const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
  /* 3D: cần câu/phiếm tính theo màn hình, phải xoay theo hướng máy quay để
     "đẩy lên" luôn là đi ra phía trước nhân vật. */
  if(W3){const a=W3.yaw(),c=Math.cos(a),s=Math.sin(a),rx=dx*c+dy*s,ry=-dx*s+dy*c;dx=rx;dy=ry}
  me.dx=dx;me.dy=dy;
  const sp=190*dt,nx=me.x+dx*sp,ny=me.y+dy*sp;if(!blocked(nx,me.y))me.x=Math.max(25,Math.min(WW-25,nx));if(!blocked(me.x,ny))me.y=Math.max(40,Math.min(WH-15,ny));me.mv=Math.min(1,m);if(m>.1)me.t+=dt*12}else {me.mv=0;me.dx=me.dy=0}
 S.en=Math.min(100,S.en+dt/3);
 npcs.forEach(n=>{n.t-=dt;if(n.t<0){n.tx=n.b[0]+Math.random()*(n.b[2]-n.b[0]);n.ty=n.b[1]+Math.random()*(n.b[3]-n.b[1]);n.t=3+Math.random()*5}const d=Math.hypot(n.tx-n.x,n.ty-n.y);n.mv=d>6?1:0;if(d>6){n.x+=(n.tx-n.x)/d*60*dt;n.y+=(n.ty-n.y)/d*60*dt}if(n.say>0)n.say-=dt;else if(!chatN&&n.sc==sc&&Math.hypot(n.x-me.x,n.y-me.y)<110&&Math.random()<.01)n.say=2.5});
 ft=ft.filter(f=>(f.t-=dt)>0);
 if(ftime>0){ftime-=dt;if(sc=="out")flowers=flowers.filter(f=>{if(Math.hypot(f.x-me.x,f.y-me.y)<30){prog("flower");gain(4,3);return false}return true});if(!flowers.length){ftime=0;toast("🌸 Thu hoa xong! Giỏi lắm!")}else if(ftime<=0){flowers=[];toast("Hết giờ rồi!")}}

 /* Vùng tự kích hoạt: vừa đi vào vùng là chạy hành động ngay */
 if(!open_&&fade<.4){
  ZN().forEach(z=>{
   const hit=me.x>z.x-14&&me.x<z.x+z.w+14&&me.y>z.y-14&&me.y<z.y+z.h+14;
   if(hit&&!zin[z.id]){zin[z.id]=1;z.f()}else if(!hit)zin[z.id]=0;
  });
 }

 /* Tới giờ + ngồi vào bàn → học/thi bắt đầu luôn, không bấm gì cả */
 if(PEND&&!open_&&fade<=0&&_pendCd<=0&&sc=="room"&&rk==PEND.subject){
  const st=seatAt();
  if(st){
   _pendCd=2;
   if(PEND.type=="exam"){
    const ex=(DATA.exams||[]).find(e=>e.id==PEND.examId)||(DATA.exams||[]).find(e=>e.subject==PEND.subject);
    if(ex)runExam(ex,{force:true});else toast("Lớp này chưa có đề thi!");
   }else quiz(PEND.subject,{force:true});
   if(open_){_doneKeys[periodKey(PEND)]=1;PEND=null}
  }
 }

 updChat(dt);

 $("loc").textContent=sc=="out"?"🌳 Sân trường":sc=="hall2"?"🏫 Hành lang — Tầng 2":sc=="hall"?"🏫 Hành lang — Tầng 1":"📍 "+RM[rk].n;
 $("lvt").textContent="⭐ Cấp "+S.lv;document.querySelector("#bar i").style.width=(S.xp/(S.lv*50)*100)+"%";
 $("coin").textContent="🪙 "+S.coins;$("gem").textContent="💎 "+S.gems;document.querySelector("#bar2 i").style.width=S.en+"%";
 $("qp").innerHTML="<b>📋 Nhiệm vụ</b><br>"+QU.map(q=>`• ${q.t}: ${S.q[q.k]||0}/${q.n}`).join("<br>");
 tickSchedule()}

/* ═══ TRÒ CHUYỆN VỚI HỌC SINH KHÁC ═══
   Đứng gần một bạn (~90px) khoảng 0.7s là hộp chat tự mở. Chọn câu trả lời,
   bạn ấy đáp lại theo ngữ cảnh thời khóa biểu. Đi xa là tự đóng; mỗi bạn
   nghỉ 25 giây mới chat tiếp để không bị làm phiền liên tục. */
let chatN=null,chatT=0,chatCd={};
const CHAT_REPLIES=[
 {t:"Chào bạn! 👋",r:()=>["Chào cậu! Rất vui được gặp cậu 😄","Hi hi, chào cậu nha. Học chăm nhé!","Lâu quá không gặp, nhớ cậu quá! 🤗"]},
 {t:"Hôm nay học gì vậy?",r:()=>{
   const cur=findCurrentPeriod(),nxt=findNextPeriod();
   if(cur)return["Giờ này đang học "+cur.title+" ("+cur.start+"–"+cur.end+") đó! Vào lớp nhanh lên 📚","Tiết "+cur.title+" đang diễn ra nè, ngồi vào bàn là học được liền!"];
   if(nxt&&nxt.type=="exam")return["Sắp thi "+(SUB_LABEL[nxt.subject]||nxt.subject)+" lúc "+nxt.start+" rồi, ôn bài đi thôi! 📝"];
   if(nxt)return["Tiết tới là "+nxt.title+" lúc "+nxt.start+" đó! ⏰","Chuẩn bị hết giờ ra chơi, tiết "+nxt.title+" sắp đến rồi!"];
   return["Hôm nay hết tiết rồi! Đi chơi thui 🎉","Không có tiết nào nữa, muỗi hết bài rồi 🤭"]}},
 {t:"Kể mình nghe điều hay đi!",r:()=>[
   "Ở tầng 2 có Thư viện, đọc sách được thưởng luôn đó! Cầu thang ở cuối hành lang nha 📚",
   "Căng tin có bánh mì siêu ngon, ăn xong đầy ắp năng lượng! 🥪",
   "Vườn trường có nhiều hoa xinh, thu đủ 8 bông là có quà đó! 🌸",
   "Sân thể thao mở ở cấp 3, chạy bộ vui cực luôn! ⚽",
   "Bật 📅 Thời khóa biểu là biết giờ học mỗi ngày luôn á!"]},
];
function chatTargets(){
 const a=npcs.filter(n=>n.sc==sc);
 if(sc=="room")studs.forEach(s=>{if(s.on)a.push({n:s.n,c:s.c,x:s.x,y:s.y})});
 return a;
}
function updChat(dt){
 for(const k in chatCd)if(chatCd[k]>0)chatCd[k]-=dt;
 if(open_||fade>0||climb){if(chatN)npcClose();return}
 let best=null,bd=1e9;
 chatTargets().forEach(n=>{const d=Math.hypot(n.x-me.x,n.y-me.y);if(d<bd){bd=d;best=n}});
 if(chatN){
  if(!best||best.n!=chatN.n||bd>170||chatT>30)npcClose();
  return;
 }
 if(best&&bd<95&&!(chatCd[best.n]>0)){chatT+=dt;if(chatT>.7)npcOpen(best)}else chatT=0;
}
function npcOpen(n){
 chatN=n;chatT=0;chatCd[n.n]=25;n.say=0;prog("chat");
 $("npcav").textContent=n.h||"🙂";
 $("npcname").textContent=n.n;
 $("npcmsg").textContent="Chào mình là "+n.n+"! Cậu muốn nói gì nào? 😊";
 $("npcrep").innerHTML=CHAT_REPLIES.map((r,i)=>`<button data-i="${i}">${r.t}</button>`).join("");
 [...$("npcrep").children].forEach((b,i)=>b.onclick=()=>{
  const rep=CHAT_REPLIES[i].r();
  $("npcmsg").textContent=rep[Math.floor(Math.random()*rep.length)];
  $("npcrep").innerHTML=`<button id="bye">Kết thúc 💬</button>`;
  $("bye").onclick=npcClose;
 });
 $("npcchat").style.display="flex";
}
function npcClose(){if(!chatN)return;chatN=null;const e=$("npcchat");if(e)e.style.display="none"}
