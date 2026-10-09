window.PARKOUR_RENDER=(function(){
  let cv,ctx,wrap,W=0,H=0,DPR=1;
  const cam={x:0,y:0,z:0,pitch:-0.42,focal:0,offsetY:6.2,offsetZ:-9.0};
  const EC=new Map();
  const EB=64,EP=10,ET=EB+EP*2;
  let dogImg=null;
  const DOG_SVG=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <defs><linearGradient id="fur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6B45C"/><stop offset="1" stop-color="#D98232"/></linearGradient></defs>
  <path d="M128 495 C55 465 50 570 125 590 C92 550 102 520 151 535 Z" fill="url(#fur)" stroke="#B96828" stroke-width="7" stroke-linejoin="round"/>
  <path d="M177 405 C135 455 135 600 205 635 C270 668 375 666 432 625 C475 594 463 467 418 410 C365 347 229 347 177 405 Z" fill="url(#fur)" stroke="#B96828" stroke-width="8"/>
  <path d="M270 423 C245 478 248 584 300 624 C350 582 354 478 326 423 Z" fill="#FFF1D7"/>
  <path d="M185 565 C151 574 150 629 188 645 C216 657 251 646 250 620 C249 587 220 557 185 565 Z" fill="#FFF1D7" stroke="#B96828" stroke-width="7"/>
  <path d="M373 565 C340 574 337 618 356 639 C381 660 428 650 432 619 C436 589 405 558 373 565 Z" fill="#FFF1D7" stroke="#B96828" stroke-width="7"/>
  <path d="M175 175 C95 155 76 235 107 302 C125 340 166 332 190 291 L217 208 Z" fill="#C8752E" stroke="#A95C24" stroke-width="8"/>
  <path d="M425 175 C505 155 524 235 493 302 C475 340 434 332 410 291 L383 208 Z" fill="#C8752E" stroke="#A95C24" stroke-width="8"/>
  <path d="M178 142 C224 89 376 89 422 142 C464 190 459 305 419 354 C382 399 218 399 181 354 C141 305 136 190 178 142 Z" fill="url(#fur)" stroke="#B96828" stroke-width="9"/>
  <path d="M218 282 C228 247 372 247 382 282 C395 327 354 361 300 361 C246 361 205 327 218 282 Z" fill="#FFF1D7"/>
  <path d="M280 121 C266 160 270 221 287 258 C294 270 306 270 313 258 C330 220 334 160 320 121 Z" fill="#FFF1D7"/>
  <ellipse cx="235" cy="232" rx="37" ry="44" fill="#FFF"/><ellipse cx="238" cy="238" rx="24" ry="30" fill="#51301F"/><ellipse cx="241" cy="240" rx="13" ry="18" fill="#17110E"/><circle cx="248" cy="225" r="7" fill="#FFF"/>
  <ellipse cx="365" cy="232" rx="37" ry="44" fill="#FFF"/><ellipse cx="362" cy="238" rx="24" ry="30" fill="#51301F"/><ellipse cx="359" cy="240" rx="13" ry="18" fill="#17110E"/><circle cx="352" cy="225" r="7" fill="#FFF"/>
  <path d="M207 184 Q235 164 260 183" fill="none" stroke="#914B20" stroke-width="10" stroke-linecap="round"/>
  <path d="M340 183 Q365 164 393 184" fill="none" stroke="#914B20" stroke-width="10" stroke-linecap="round"/>
  <path d="M276 278 Q300 259 324 278 Q329 293 300 305 Q271 293 276 278 Z" fill="#4A2A20"/>
  <path d="M300 302 L300 321 M300 321 Q275 346 248 326 M300 321 Q325 346 352 326" fill="none" stroke="#4A2A20" stroke-width="7" stroke-linecap="round"/>
  <path d="M282 337 Q300 323 318 337 Q320 367 300 374 Q280 367 282 337 Z" fill="#F06D72"/>
  <path d="M202 372 Q300 410 398 372 L388 407 Q300 442 212 407 Z" fill="#E33D3D" stroke="#B52D2D" stroke-width="7"/>
  <circle cx="300" cy="421" r="24" fill="#F5C84B" stroke="#B8871E" stroke-width="6"/>
</svg>`;
  function init(){
    cv=document.getElementById('c');
    ctx=cv.getContext('2d',{alpha:false});
    wrap=document.getElementById('wrap');
    resize();
    window.addEventListener('resize',resize);
    window.addEventListener('orientationchange',()=>setTimeout(resize,120));
  }
  function resize(){
    const vw=window.innerWidth,vh=window.innerHeight;
    const isPortrait=vh>vw;
    wrap.style.width=isPortrait?vh+'px':vw+'px';
    wrap.style.height=isPortrait?vw+'px':vh+'px';
    wrap.style.transform=isPortrait?`translateX(${vw}px) rotate(90deg)`:'none';
    W=isPortrait?vh:vw;
    H=isPortrait?vw:vh;
    DPR=Math.min(window.devicePixelRatio||1,1.5);
    cv.width=W*DPR;cv.height=H*DPR;
    cv.style.width=W+'px';cv.style.height=H+'px';
    cam.focal=Math.max(W,H)*1.1;
  }
  function spr(e){
    let s=EC.get(e);if(s)return s;
    const c=document.createElement('canvas');c.width=c.height=ET*2;
    const g=c.getContext('2d');g.scale(2,2);
    g.font=EB+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    g.textAlign='center';g.textBaseline='middle';
    g.fillText(e,ET/2,ET/2);
    s={c,t:ET,b:EB};EC.set(e,s);return s;
  }
  function emoji(e,x,y,size,a){
    const s=spr(e),w=s.t*(size/s.b);
    const old=ctx.globalAlpha;if(a!==undefined)ctx.globalAlpha=a;
    ctx.drawImage(s.c,x-w/2,y-w/2,w,w);
    ctx.globalAlpha=old;
  }
  function project(wx,wy,wz){
    const dx=wx-cam.x,dy=wy-cam.y,dz=wz-cam.z;
    const cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch);
    const fx=0,fy=sp,fz=cp;
    const ux=0,uy=cp,uz=-sp;
    const lz=dx*fx+dy*fy+dz*fz;
    if(lz<0.3)return null;
    const ly=dx*ux+dy*uy+dz*uz;
    return{x:W/2+dx*cam.focal/lz,y:H/2-ly*cam.focal/lz,z:lz};
  }
  function shade(hex,amt){
    if(hex.startsWith('rgb'))return hex;
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    const f=v=>Math.max(0,Math.min(255,Math.round(v+amt*255)));
    return`rgb(${f(r)},${f(g)},${f(b)})`;
  }
  function drawQuad(p1,p2,p3,p4,fill,stroke){
    ctx.fillStyle=fill;
    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.lineTo(p3.x,p3.y);ctx.lineTo(p4.x,p4.y);
    ctx.closePath();ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
  }
  function drawBox(b,G){
    if(b.gone)return;
    const hw=b.w/2,hd=b.d/2,bt=b.y+b.h;
    const c={fbl:project(b.x-hw,b.y,b.z-hd),fbr:project(b.x+hw,b.y,b.z-hd),ftl:project(b.x-hw,bt,b.z-hd),ftr:project(b.x+hw,bt,b.z-hd),bbl:project(b.x-hw,b.y,b.z+hd),bbr:project(b.x+hw,b.y,b.z+hd),btl:project(b.x-hw,bt,b.z+hd),btr:project(b.x+hw,bt,b.z+hd)};
    for(const k in c)if(!c[k])return;
    const base=b.used?'#9ca3af':b.color;
    const isQ=b.type==='question'&&!b.used;
    const showL=cam.x<b.x-hw,showR=cam.x>b.x+hw;
    if(showL)drawQuad(c.ftl,c.fbl,c.bbl,c.btl,shade(base,-0.18),'#fff');
    else if(showR)drawQuad(c.ftr,c.fbr,c.bbr,c.btr,shade(base,-0.22),'#fff');
    drawQuad(c.ftl,c.ftr,c.fbr,c.fbl,isQ?shade(base,0.15):shade(base,0.05),'#fff');
    drawQuad(c.ftl,c.ftr,c.btr,c.btl,isQ?shade(base,0.35):shade(base,0.22),'#fff');
    if(b.stripe&&!b.used){
      ctx.save();ctx.beginPath();ctx.moveTo(c.ftl.x,c.ftl.y);ctx.lineTo(c.ftr.x,c.ftr.y);ctx.lineTo(c.btr.x,c.btr.y);ctx.lineTo(c.btl.x,c.btl.y);ctx.closePath();ctx.clip();
      ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=Math.max(3,Math.min(10,200/c.ftl.z));
      for(let i=-60;i<60;i+=14){ctx.beginPath();ctx.moveTo(c.ftl.x+i*3,c.ftl.y-100);ctx.lineTo(c.ftl.x+i*3+80,c.ftl.y+200);ctx.stroke();}
      ctx.restore();
    }
    if(isQ){
      const cx=(c.ftl.x+c.ftr.x+c.btr.x+c.btl.x)/4,cy=(c.ftl.y+c.ftr.y+c.btr.y+c.btl.y)/4;
      const sz=Math.min(70,Math.max(20,cam.focal/8/c.ftl.z));
      const bob=Math.sin(G.T*3+b.z)*3;
      ctx.font=`800 ${sz}px "Baloo 2",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle='#fff';ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=3;
      ctx.strokeText('?',cx,cy+bob);ctx.fillText('?',cx,cy+bob);
    }
    if(b.type==='coin'&&!b.collected){
      const cp=project(b.x,b.y+b.h+1.2,b.z);
      if(cp){const sz=Math.min(70,Math.max(22,cam.focal/6/cp.z));emoji('🪙',cp.x,cp.y+Math.sin(G.T*4+b.z)*4,sz);}
    }
    if(b.crumble&&b.crumbleT>0){ctx.globalAlpha=0.5+Math.sin(G.T*20)*0.3;ctx.fillStyle='#fff';ctx.fillRect(c.ftl.x,c.ftl.y,c.ftr.x-c.ftl.x,c.fbl.y-c.ftl.y);ctx.globalAlpha=1;}
  }
  function drawSky(G){
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#5eb8ff');g.addColorStop(.55,'#a8dfff');g.addColorStop(1,'#dff2ff');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    const hy=H*0.42;
    const og=ctx.createLinearGradient(0,hy-30,0,H);
    og.addColorStop(0,'#4ea8de');og.addColorStop(1,'#7fcdff');
    ctx.fillStyle=og;ctx.fillRect(0,hy,W,H-hy);
    ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;
    for(let i=0;i<6;i++){
      const y=hy+30+i*38+Math.sin(G.T*.5+i)*4;
      ctx.beginPath();
      for(let x=0;x<W;x+=20)ctx.lineTo(x,y+Math.sin(x*.01+G.T+i)*3);
      ctx.stroke();
    }
    [{x:.15,s:.7},{x:.5,s:.9},{x:.85,s:.6}].forEach(isl=>{
      const cx=W*isl.x,base=hy+10,w=180*isl.s,h=60*isl.s;
      ctx.fillStyle='#6dbf67';
      ctx.beginPath();ctx.moveTo(cx-w/2,base);ctx.quadraticCurveTo(cx,base-h*1.6,cx+w/2,base);ctx.closePath();ctx.fill();
      ctx.fillStyle='#3a8f3a';
      ctx.beginPath();ctx.moveTo(cx-w/2,base);ctx.quadraticCurveTo(cx,base-h*1.6,cx+w/2,base);ctx.lineTo(cx+w/2,base+8);ctx.lineTo(cx-w/2,base+8);ctx.closePath();ctx.fill();
      emoji('🌴',cx,base-h*1.1,40*isl.s);
    });
  }
  function drawClouds(G){
    for(const c of G.clouds){
      const p=project(c.x,c.y,c.z);
      if(!p||p.x<-100||p.x>W+100)continue;
      const sz=Math.min(180,Math.max(40,cam.focal/(p.z+10)*1.6*c.s));
      emoji('☁️',p.x,p.y,sz,0.9);
    }
  }
  function drawNPC(npc,G){
    const p=project(npc.x,npc.y,npc.z);
    if(!p||p.x<-60||p.x>W+60)return;
    const sz=Math.min(120,Math.max(40,cam.focal/p.z*0.9));
    drawChar(p.x,p.y+Math.sin(G.T*2+npc.ph)*3,sz,npc.color,0,false,1);
  }
  function drawChar(cx,cy,sz,shirtColor,phase,isPlayer,face){
    ctx.save();ctx.translate(cx,cy);
    if(face<0)ctx.scale(-1,1);
    const headR=sz*0.16,bodyW=sz*0.32,bodyH=sz*0.42,legW=sz*0.11,legH=sz*0.35,armW=sz*0.09,armH=sz*0.3;
    const swing=Math.sin(phase)*0.5;
    ctx.save();ctx.translate(-bodyW*0.28,bodyH*0.5);ctx.rotate(swing*0.5);ctx.fillStyle='#1e3a8a';ctx.fillRect(-legW/2,0,legW,legH);ctx.fillStyle='#111';ctx.fillRect(-legW/2-1,legH-4,legW+2,5);ctx.restore();
    ctx.save();ctx.translate(bodyW*0.28,bodyH*0.5);ctx.rotate(-swing*0.5);ctx.fillStyle='#1e3a8a';ctx.fillRect(-legW/2,0,legW,legH);ctx.fillStyle='#111';ctx.fillRect(-legW/2-1,legH-4,legW+2,5);ctx.restore();
    const bodyTop=-bodyH*0.5;
    ctx.fillStyle=shirtColor;
    ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(-bodyW/2,bodyTop,bodyW,bodyH,sz*.06);
    else ctx.rect(-bodyW/2,bodyTop,bodyW,bodyH);
    ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.save();ctx.translate(-bodyW/2,bodyTop+bodyH*0.15);ctx.rotate(-swing*0.7);ctx.fillStyle='#fbbf24';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(-armW,0,armW,armH,armW/2);else ctx.rect(-armW,0,armW,armH);ctx.fill();ctx.restore();
    ctx.save();ctx.translate(bodyW/2,bodyTop+bodyH*0.15);ctx.rotate(swing*0.7);ctx.fillStyle='#fbbf24';ctx.beginPath();if(ctx.roundRect)ctx.roundRect(0,0,armW,armH,armW/2);else ctx.rect(0,0,armW,armH);ctx.fill();ctx.restore();
    const headCy=bodyTop-headR*0.85;
    ctx.fillStyle='#fbbf24';ctx.fillRect(-headR*0.4,headCy,headR*0.8,headR*0.6);
    ctx.beginPath();ctx.arc(0,headCy,headR,0,6.283);ctx.fill();
    ctx.fillStyle='#4a2810';ctx.beginPath();ctx.arc(0,headCy-headR*0.15,headR*1.02,Math.PI,0);ctx.lineTo(headR,headCy+headR*0.3);ctx.lineTo(-headR,headCy+headR*0.3);ctx.closePath();ctx.fill();
    if(isPlayer){ctx.fillStyle='#dc2626';ctx.beginPath();ctx.arc(0,headCy-headR*0.1,headR*1.1,Math.PI,0);ctx.lineTo(headR*1.1,headCy+headR*0.1);ctx.lineTo(-headR*1.1,headCy+headR*0.1);ctx.closePath();ctx.fill();}
    ctx.restore();
  }
  function drawDog(x,y,sz,phase,face){
    if(!dogImg){dogImg=new Image();dogImg.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(DOG_SVG);}
    if(!dogImg.complete||!dogImg.naturalWidth)return false;
    const w=sz*.78,h=w*(700/600);
    const bob=Math.abs(Math.sin(phase))*sz*.045;
    ctx.save();ctx.translate(x,y-bob);
    if(face<0)ctx.scale(-1,1);
    ctx.drawImage(dogImg,-w/2,-h,w,h);
    ctx.restore();return true;
  }
  function drawPlayer(pl,G){
    const p=project(pl.x,pl.y,pl.z);if(!p)return;
    const sz=Math.min(150,Math.max(50,cam.focal/p.z*1.0));
    const sp=project(pl.x,pl.y-0.01,pl.z);
    if(sp){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sp.x,sp.y+sz*.5,sz*.30,sz*.09,0,0,6.283);ctx.fill();}
    if(pl.invuln>0&&Math.floor(G.T*16)%2===0)return;
    const moving=Math.abs(pl.vx)>0.3||Math.abs(pl.vz)>0.3;
    if(pl.onGround&&moving)pl.runPhase+=0.3;else if(moving)pl.runPhase+=0.15;else pl.runPhase+=0.05;
    if(pl.slide>0){
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(pl.face*0.3);ctx.scale(1,0.6);ctx.translate(-p.x,-p.y);
      if(!drawDog(p.x,p.y,sz,pl.runPhase,pl.face))drawChar(p.x,p.y,sz,'#f59e0b',pl.runPhase,true,pl.face);
      ctx.restore();
    }else{
      if(!drawDog(p.x,p.y,sz,pl.runPhase,pl.face))drawChar(p.x,p.y,sz,'#f59e0b',pl.runPhase,true,pl.face);
    }
  }
  function drawParticles(G){
    const list=[];
    for(const p of G.parts){const pr=project(p.x,p.y,p.z);if(pr)list.push({pr,p});}
    list.sort((a,b)=>b.pr.z-a.pr.z);
    for(const it of list){
      const p=it.p,pr=it.pr;
      const sz=Math.max(2,Math.min(20,cam.focal/pr.z*0.05*p.r));
      ctx.globalAlpha=Math.max(0,Math.min(1,p.life/p.max));
      ctx.fillStyle=p.c;
      ctx.beginPath();ctx.arc(pr.x,pr.y,sz,0,6.283);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  function drawFloats(G){
    for(const f of G.floats){
      const p=project(f.x,f.y,f.z);if(!p)continue;
      const sz=Math.min(50,Math.max(14,cam.focal/p.z*0.07));
      ctx.globalAlpha=Math.max(0,Math.min(1,f.life*1.5));
      ctx.font=`800 ${sz}px "Baloo 2",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.7)';
      ctx.strokeText(f.t,p.x,p.y);ctx.fillStyle='#fff';ctx.fillText(f.t,p.x,p.y);
    }
    ctx.globalAlpha=1;
  }
  function drawWindZones(G){
    for(const wz of G.windZones){
      const p1=project(wz.x-wz.w/2,wz.y,wz.z-wz.d/2);
      const p2=project(wz.x+wz.w/2,wz.y+wz.h,wz.z+wz.d/2);
      if(!p1||!p2)continue;
      ctx.globalAlpha=0.15+Math.sin(G.T*3)*0.05;
      ctx.fillStyle=wz.dir>0?'#7dd3fc':'#f472b6';
      ctx.fillRect(p1.x,p2.y,p2.x-p1.x,p1.y-p2.y);
      ctx.globalAlpha=0.6;
      emoji('🌀',(p1.x+p2.x)/2,(p1.y+p2.y)/2,Math.min(40,Math.max(16,cam.focal/p1.z*0.06)));
      ctx.globalAlpha=1;
    }
  }
  function drawBouncePads(G){
    for(const pad of G.bouncePads){
      const p=project(pad.x,pad.y+0.3,pad.z);if(!p)continue;
      const sz=Math.min(60,Math.max(24,cam.focal/p.z*0.1));
      ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,pad.used?0.5:1+Math.sin(G.T*5)*0.1);
      emoji('🔄',0,0,sz);ctx.restore();
    }
  }
  function drawRotatingObs(G){
    for(const o of G.rotatingObs){
      const p=project(o.x,o.y,o.z);if(!p)continue;
      const sz=Math.min(80,Math.max(30,cam.focal/p.z*0.15));
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(o.angle);
      ctx.fillStyle='#ef4444';ctx.fillRect(-sz/2,-sz/8,sz,sz/4);
      ctx.fillStyle='#fbbf24';ctx.fillRect(-sz/4,-sz/6,sz/2,sz/3);
      ctx.restore();
    }
  }
  function updateCam(G){
    const p=G.player;if(!p)return;
    cam.x=p.x*0.9;cam.y=p.y+cam.offsetY;cam.z=p.z+cam.offsetZ;
  }
  function draw(G){
    ctx.setTransform(DPR,0,0,DPR,0,0);
    ctx.save();
    if(G.shake>0.3){const s=(Math.random()*2-1)*G.shake;ctx.translate(s,s);}
    drawSky(G);
    drawClouds(G);
    if(!G.player){ctx.restore();return;}
    const vis=[];
    for(const b of G.blocks){
      if(b.z>G.player.z+100)continue;
      if(b.z<G.player.z-25)continue;
      vis.push(b);
    }
    const items=[];
    for(const b of vis)items.push({z:b.z,t:'b',o:b});
    for(const n of G.npcs){if(n.z<G.player.z-25||n.z>G.player.z+100)continue;items.push({z:n.z,t:'n',o:n});}
    for(const wz of G.windZones){if(wz.z>G.player.z+100||wz.z<G.player.z-25)continue;items.push({z:wz.z,t:'w',o:wz});}
    for(const pad of G.bouncePads){if(pad.z>G.player.z+100||pad.z<G.player.z-25)continue;items.push({z:pad.z,t:'p',o:pad});}
    for(const o of G.rotatingObs){if(o.z>G.player.z+100||o.z<G.player.z-25)continue;items.push({z:o.z,t:'r',o:o});}
    items.push({z:G.player.z-0.01,t:'P'});
    items.sort((a,b)=>b.z-a.z);
    for(const it of items){
      if(it.t==='b')drawBox(it.o,G);
      else if(it.t==='n')drawNPC(it.o,G);
      else if(it.t==='w')drawWindZones(G);
      else if(it.t==='p')drawBouncePads(G);
      else if(it.t==='r')drawRotatingObs(G);
      else drawPlayer(G.player,G);
    }
    drawParticles(G);
    drawFloats(G);
    ctx.restore();
  }
  ['🪙','💎','🎁','❓','🏁','☁️','🏝️','🌴','🐚','⛵','🐬','🎮','⚡','🎓','🗺️','🎯','🏃','😎','💨','🧠','💰','✨','🌟','🌀','🔄','⬇️','🧗','🛝','🏅'].forEach(spr);
  return{init,resize,draw,project,emoji,updateCam,get W(){return W},get H(){return H},get ctx(){return ctx}};
})();
