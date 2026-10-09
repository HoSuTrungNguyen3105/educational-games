window.PARKOUR_LEVEL=(function(){
  const COLORS=['#ec4899','#3b82f6','#fbbf24','#22c55e','#a855f7','#ef4444','#06b6d4','#f97316','#84cc16','#e879f9'];
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function rand(a,b){return a+Math.random()*(b-a);}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function genLevel(G){
    G.blocks=[];G.npcs=[];G.clouds=[];G.parts=[];G.floats=[];
    G.windZones=[];G.bouncePads=[];G.crumbling=[];G.movingPlats=[];G.rotatingObs=[];
    G.blocks.push({x:0,y:0,z:0,w:8,h:1,d:8,color:'#ec4899',stripe:false,type:'start'});
    let z=6,x=0,top=1;
    const N=80;
    for(let i=0;i<N;i++){
      const t=i/(N-1);
      const diff=t*t*(3-2*t);
      const w=rand(1.6+(1-diff)*1.0,2.3+(1-diff)*1.1);
      const d=w;
      let deltas;
      if(t<0.30)deltas=[-1,0,0,1];
      else if(t<0.65)deltas=[-1,0,1,1,2];
      else deltas=[0,1,1,2,2,-1];
      top=clamp(top+pick(deltas),1,9);
      const lateralRange=0.8+diff*2.8;
      x=clamp(x+rand(-lateralRange,lateralRange),-16,16);
      const y=top-1;
      const r=Math.random();
      let type='normal';
      if(r<0.06+diff*0.18)type='question';
      else if(r<0.42)type='coin';
      G.blocks.push({x,y,z:z+d/2,w,h:1,d,color:pick(COLORS),stripe:Math.random()<(0.35+diff*0.25),type});
      z+=d+rand(0.6+diff*0.7,1.5+diff*1.0);
    }
    G.totalDist=z+8;
    const npcColors=['#f472b6','#60a5fa','#a78bfa','#34d399','#fbbf24'];
    for(let i=0;i<6;i++){
      const b=pick(G.blocks.slice(3,Math.floor(G.blocks.length*0.7)));
      G.npcs.push({x:b.x+rand(-0.5,0.5),y:b.y+b.h,z:b.z+rand(-0.5,0.5),color:pick(npcColors),ph:rand(0,6)});
    }
    for(let i=0;i<20;i++)G.clouds.push({x:rand(-40,G.totalDist+40),y:rand(8,25),z:rand(-20,80),s:rand(.7,1.5),sp:rand(2,6)});
    for(let i=0;i<3;i++){
      const b=pick(G.blocks.slice(10,Math.floor(G.blocks.length*0.8)));
      G.windZones.push({x:b.x,y:b.y+b.h,z:b.z,w:b.w+2,h:4,d:b.d+2,dir:pick([-1,1]),str:rand(8,14)});
    }
    for(let i=0;i<4;i++){
      const b=pick(G.blocks.slice(5,Math.floor(G.blocks.length*0.85)));
      G.bouncePads.push({x:b.x,y:b.y+b.h,z:b.z,r:1.2,used:false});
    }
    for(let i=0;i<5;i++){
      const b=pick(G.blocks.slice(8,Math.floor(G.blocks.length*0.9)));
      if(b.type==='normal'){b.crumble=true;b.crumbleT=0;}
    }
    for(let i=0;i<4;i++){
      const b=pick(G.blocks.slice(10,Math.floor(G.blocks.length*0.85)));
      if(b.type==='normal'){b.moving=true;b.moveAxis=pick(['x','y']);b.moveRange=rand(2,4);b.moveSpeed=rand(1,2);b.movePh=rand(0,6);b.origX=b.x;b.origY=b.y;}
    }
    for(let i=0;i<4;i++){
      const b=pick(G.blocks.slice(10,Math.floor(G.blocks.length*0.85)));
      G.rotatingObs.push({x:b.x,y:b.y+b.h+1,z:b.z,len:rand(3,5),speed:rand(1,3),angle:rand(0,6)});
    }
  }
  return{genLevel};
})();
