// ===== UI: thông báo, popup +xu, cộng thưởng, tiến độ nhiệm vụ, hộp thoại =====
function toast(t){const e=$("toast");e.textContent=t;e.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display="none",2200)}
function pop(s){ft.push({x:me.x,y:me.y-90,s,t:1.4})}
function gain(c,x){S.coins+=c;S.xp+=x;pop("+"+c+"🪙 +"+x+"XP");const need=S.lv*50;if(S.xp>=need){S.xp-=need;S.lv++;S.gems+=2;toast("🎉 Lên cấp "+S.lv+"! "+(S.lv==2?"Mở Vườn trường 🌸":S.lv==3?"Mở Sân thể thao 🏃":"+2 💎"))}save()}
function prog(k,n=1){const q=QU.find(x=>x.k==k);S.q[k]=(S.q[k]||0)+n;if(S.q[k]>=q.n){S.q[k]=0;S.coins+=q.c;S.gems+=q.g;realCoin(q.c,"quest:"+k);setTimeout(()=>toast("✅ Xong nhiệm vụ! +"+q.c+"🪙 +"+q.g+"💎"),600)}save()}

/* ── Phần thưởng đổi ra coin THẬT trong ví của tài khoản ──
   Game không tự cộng coin thật (không có token trong iframe) mà bắn sự kiện
   cho trang cha: src/pages/SchoolMissionPage.jsx kiểm tra trần mỗi ngày rồi gọi
   /auth/me/wallet. Kết quả gửi ngược lại qua "school-coin-result" (js/sync.js). */
function realCoin(n,reason){
    n=Math.round(Number(n)||0);
    if(!(n>0)||window.parent===window)return;
    try{window.parent.postMessage({type:"school-coin",data:{amount:n,reason}}, "*")}catch(e){}
}

/* Chỉ điểm cao mới thưởng: đúng ≥80% của một lần học → 10🪙, đúng hết → 15🪙.
   Trả về dòng chữ để hiển thị trong bảng kết quả (rỗng khi chưa tới mốc). */
function scoreBonus(ok,total,tag){
    if(!(total>0))return "";
    if(ok>=total)return realCoin(15,"perfect:"+tag),"+15 🪙 ví thật — đúng hết câu!";
    if(ok>=Math.ceil(total*0.8))return realCoin(10,"highscore:"+tag),"+10 🪙 ví thật — làm bài tốt!";
    return "";
}
function modal(h){$("box").innerHTML=h;$("modal").style.display="flex";open_=true}
function close_(){$("modal").style.display="none";open_=false}
