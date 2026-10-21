// ===== RENDER: camera, sắp xếp lớp vẽ, hiệu ứng viền tối, chuyển cảnh =====
function draw(){const z=Math.max(.8,Math.min(1.4,H/560)),[WW,WH]=D[sc];g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle="#1d2540";g.fillRect(0,0,W,H);
 const vw=W/z,vh=H/z,cl=(v,a,b)=>Math.max(a,Math.min(b,v));
 const cx=vw>=WW?-(vw-WW)/2:cl(me.x-vw/2,0,WW-vw),cy=vh>=WH?-(vh-WH)/2:cl(me.y-vh/2,0,WH-vh);
 g.save();g.scale(z,z);g.translate(-cx,-cy);
 if(sc=="out")drawOut();else if(sc=="hall")drawHall();else drawRoom();
 const L=npcs.filter(n=>n.sc==sc).map(n=>({y:n.y,f:()=>chr(n.x,n.y,n.c,n.h,n.n,tt*8+n.x,n.say>0?["Chào!","Rất vui được gặp bạn!","Học thôi nào!"][Math.floor(n.x)%3]:null,n.mv)}));
 L.push({y:me.y,f:()=>chr(me.x,me.y,S.col,S.hat,"Bạn",me.t,null,me.mv)});L.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 ft.forEach(f=>{g.globalAlpha=Math.min(1,f.t);tx(f.s,f.x,f.y-(1.4-f.t)*40,18,"#ffd23f","rgba(0,0,0,.7)");g.globalAlpha=1});
 g.restore();
 if(ftime>0){const t="⏱ "+Math.ceil(ftime)+"s  🌸 còn "+flowers.length;tx(t,W/2,90,20,"#fff","rgba(0,0,0,.6)")}
 const v=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.45,W/2,H/2,Math.max(W,H)*.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,30,.32)");g.fillStyle=v;g.fillRect(0,0,W,H);
 if(fade>0){g.fillStyle=`rgba(0,0,0,${fade})`;g.fillRect(0,0,W,H)}}
