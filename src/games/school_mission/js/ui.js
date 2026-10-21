// ===== UI: thông báo, popup +xu, cộng thưởng, tiến độ nhiệm vụ, hộp thoại =====
function toast(t){const e=$("toast");e.textContent=t;e.style.display="block";clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display="none",2200)}
function pop(s){ft.push({x:me.x,y:me.y-90,s,t:1.4})}
function gain(c,x){S.coins+=c;S.xp+=x;pop("+"+c+"🪙 +"+x+"XP");const need=S.lv*50;if(S.xp>=need){S.xp-=need;S.lv++;S.gems+=2;toast("🎉 Lên cấp "+S.lv+"! "+(S.lv==2?"Mở Vườn trường 🌸":S.lv==3?"Mở Sân thể thao 🏃":"+2 💎"))}save()}
function prog(k,n=1){const q=QU.find(x=>x.k==k);S.q[k]=(S.q[k]||0)+n;if(S.q[k]>=q.n){S.q[k]=0;S.coins+=q.c;S.gems+=q.g;setTimeout(()=>toast("✅ Xong nhiệm vụ! +"+q.c+"🪙 +"+q.g+"💎"),600)}save()}
function modal(h){$("box").innerHTML=h;$("modal").style.display="flex";open_=true}
function close_(){$("modal").style.display="none";open_=false}
