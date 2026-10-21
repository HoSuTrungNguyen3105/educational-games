// ===== ACTIVITIES: bài học, bài thi, căng tin, cửa hàng, thể dục, thu hoa =====
function quiz(type,opts={}){const T=ST();
 if(!canStartLesson(type,opts))return;
 if(S.en<T.energyPerLesson){toast("⚡ Hết năng lượng! Ra Căng tin ăn nhé");return}
 S.en-=T.energyPerLesson;let n=0,ok=0;const d=DATA.subjects[type],N=T.questionsPerLesson;
 function nx(){if(n>=N){const c=ok*T.coinsPerCorrect,x=ok*T.xpPerCorrect;gain(c,x);modal(`<h2>${d.title}</h2><div class="q">Đúng ${ok}/${N} câu 🎯</div><p>+${c} 🪙 &nbsp; +${x} XP</p><button class="btn" id="a1">Học tiếp</button> <button class="btn" id="a2" style="background:#ddd;box-shadow:0 3px 0 #aaa">Xong</button>`);$("a1").onclick=()=>{close_();quiz(type,{force:true})};$("a2").onclick=close_;return}
  const q=mk(type);modal(`<h2>${d.title} (${n+1}/${N})</h2><div class="q">${q.q}</div><div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join("")}</div>`);
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;document.querySelectorAll(".opt").forEach(x=>x.onclick=null);if(i==q.a){b.classList.add("ok");ok++;prog(type)}else{b.classList.add("no");document.querySelectorAll(".opt")[q.a].classList.add("ok")}if(q.x)$("box").insertAdjacentHTML("beforeend",`<p>💡 ${q.x}</p>`);n++;setTimeout(nx,q.x?2200:900)})}
 nx()}
function examMenu(){const ex=(DATA.exams||[]).filter(e=>e.subject==rk);if(!ex.length){toast("Lớp này chưa có bài thi");return}
 const cur=findCurrentPeriod();
 modal(`<h2>📝 Bài thi - ${RM[rk].n}</h2>`+(cur&&cur.type==="exam"?`<p style="font-size:13px">⏰ Đang trong giờ: <b>${cur.title}</b></p>`:"")+ex.map((e,i)=>{const r=S.exam[e.id];const onTime=cur&&cur.type==="exam"&&(cur.examId===e.id||cur.subject===e.subject);return`<button class="btn" data-i="${i}" style="display:block;width:100%">${onTime?"🔔 ":""}${e.title}<br><small>${e.questions.length} câu • đạt từ ${e.passPercent||60}%${r?` • tốt nhất ${r.best}%${r.pass?" ✅":""}`:""}</small></button>`}).join("")+`<button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>`);
 document.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>runExam(ex[+b.dataset.i]));$("b3").onclick=close_}
function runExam(e,opts={}){if(!canStartExam(e,opts))return;const T=ST();if(S.en<T.energyPerExam){toast("⚡ Cần "+T.energyPerExam+" năng lượng để thi!");return}S.en-=T.energyPerExam;
 const qs=sh(e.questions).map(shq),pp=e.passPercent||60;let n=0,ok=0,tm;
 function end(){clearInterval(tm);const pc=Math.round(ok/qs.length*100),pass=pc>=pp,r=S.exam[e.id]||{best:0,pass:false};let msg="";
  if(pass&&!r.pass){const w=e.reward||{};S.gems+=w.gems||0;gain(w.coins||0,w.xp||0);msg=`🎁 Thưởng lần đầu đạt: +${w.coins||0}🪙 +${w.gems||0}💎 +${w.xp||0}XP`}
  r.best=Math.max(r.best,pc);r.pass=r.pass||pass;S.exam[e.id]=r;save();
  modal(`<h2>${e.title}</h2><div class="q">${ok}/${qs.length} câu • ${pc}% ${pass?"🎉 ĐẠT":"😢 Chưa đạt"}</div><p>${msg||(pass?"":"Cần đạt "+pp+"% — cố lên!")}</p><button class="btn" id="b1">Thi lại</button> <button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>`);$("b1").onclick=()=>{close_();runExam(e,{force:true})};$("b3").onclick=close_}
 function nx(){clearInterval(tm);if(n>=qs.length){end();return}const q=qs[n];let t=e.time||0,lock=0;
  modal(`<h2>📝 ${e.title} (${n+1}/${qs.length})</h2>${t?`<div id="tm" style="font-weight:800">⏱ ${t}s</div>`:""}<div class="q">${q.q}</div><div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join("")}</div>`);
  const fin=(b)=>{if(lock)return;lock=1;clearInterval(tm);document.querySelectorAll(".opt")[q.a].classList.add("ok");if(b){if(+b.dataset.i==q.a)ok++;else b.classList.add("no")}if(q.x)$("box").insertAdjacentHTML("beforeend",`<p>💡 ${q.x}</p>`);n++;setTimeout(nx,q.x?2000:800)};
  document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>fin(b));
  if(t)tm=setInterval(()=>{t--;const el=$("tm");if(el)el.textContent="⏱ "+t+"s";if(t<=0)fin(null)},1000)}
 nx()}
function canteen(){modal(`<h2>🍔 Căng tin</h2><p>Bạn có ${S.coins} 🪙 — ⚡ ${Math.floor(S.en)}/100</p><button class="btn" id="b1">🥪 Bánh mì (10🪙) +30⚡</button><br><button class="btn" id="b2">🍱 Cơm hộp (25🪙) +100⚡</button><br><button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>`);
 const buy=(c,e)=>{if(S.coins<c){toast("Không đủ xu!");return}S.coins-=c;S.en=Math.min(100,S.en+e);save();canteen()};$("b1").onclick=()=>buy(10,30);$("b2").onclick=()=>buy(25,100);$("b3").onclick=close_}
function shop(){const it=(a,t)=>a.map(([v,c])=>{const own=S.own.includes(v),eq=(t=="h"?S.hat:S.col)==v;return`<span class="item ${own?"own":""} ${eq?"eq":""}" data-t="${t}" data-v="${v}" data-c="${c}">${t=="h"?(v||"❌"):`<span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${v};vertical-align:middle"></span>`} ${own?"":c+"🪙"}</span>`}).join("");
 modal(`<h2>🛍️ Cửa hàng</h2><p>🪙 ${S.coins}</p><b>Phụ kiện</b><br>${it(hatShop,"h")}<br><b>Màu áo</b><br>${it(colShop,"c")}<br><button class="btn" id="b3">Đóng</button>`);
 document.querySelectorAll(".item").forEach(e=>e.onclick=()=>{const v=e.dataset.v,c=+e.dataset.c;if(!S.own.includes(v)){if(S.coins<c){toast("Không đủ xu!");return}S.coins-=c;S.own.push(v)}e.dataset.t=="h"?S.hat=v:S.col=v;save();shop()});$("b3").onclick=close_}
function gym(){let t=0,go_=0,tm;modal(`<h2>🏃 Chạy bộ thể dục</h2><p>Bấm thật nhanh trong 10 giây!</p><div class="q" id="cnt">0</div><button class="btn" id="run" style="font-size:24px;padding:18px 40px">CHẠY!</button>`);
 $("run").onclick=()=>{if(!go_){go_=1;let l=10;tm=setInterval(()=>{l--;if(l<=0){clearInterval(tm);const c=Math.floor(t/2),x=Math.floor(t/3);gain(c,x);modal(`<h2>Hoàn thành! 🏅</h2><div class="q">${t} bước</div><p>+${c} 🪙 +${x} XP</p><button class="btn" id="b3">Đóng</button>`);$("b3").onclick=close_}},1000)}t++;$("cnt").textContent=t}}
function garden(){if(flowers.length){toast("Đang thu hoa rồi!");return}if(S.en<10){toast("⚡ Hết năng lượng!");return}S.en-=10;const p=P[2];flowers=[];for(let i=0;i<8;i++)flowers.push({x:p.x+30+Math.random()*(p.w-60),y:p.y+40+Math.random()*(p.h-70)});ftime=30;toast("🌸 Thu 8 bông hoa trong 30 giây!")}
