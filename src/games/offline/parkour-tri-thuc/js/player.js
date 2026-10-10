window.PARKOUR_PLAYER=(function(){
  function newPlayer(){
    return{
      x:0,y:1,z:0,vx:0,vz:0,vy:0,onGround:true,jumpHeld:false,runPhase:0,
      sq:0,face:1,invuln:0,
      coyote:0,jumpBuf:0,jumpsUsed:0,prevY:1,lastSafeZ:0,
      wallDir:0,slide:0,slideT:0,wallSlide:false,
      padBoost:0,windT:0,deadT:0
    };
  }
  function update(p,G,keys,dt,ch,sfx){
    const ACC_F=52,ACC_S=40,MAX_F=9.5,MAX_S=7.2;
    if(keys.up)p.vz+=ACC_F*dt;
    if(keys.down)p.vz-=ACC_F*dt;
    if(keys.left)p.vx-=ACC_S*dt;
    if(keys.right)p.vx+=ACC_S*dt;
    if(keys.left&&p.vx>0)p.vx-=ACC_S*dt*1.8;
    if(keys.right&&p.vx<0)p.vx+=ACC_S*dt*1.8;
    if(keys.up&&p.vz<0)p.vz+=ACC_F*dt*1.8;
    if(keys.down&&p.vz>0)p.vz-=ACC_F*dt*1.8;
    const friction=p.onGround?Math.pow(1e-10,dt):Math.pow(.20,dt);
    p.vz*=friction;p.vx*=friction;
    p.vz=Math.max(-MAX_F*0.7,Math.min(MAX_F,p.vz));
    p.vx=Math.max(-MAX_S,Math.min(MAX_S,p.vx));
    p.x+=p.vx*dt;p.z+=p.vz*dt;
    p.x=Math.max(-24,Math.min(24,p.x));
    if(p.z<0){p.z=0;if(p.vz<0)p.vz=0;}
    G.dist=p.z;
    if(Math.abs(p.vx)>0.5)p.face=p.vx>0?1:-1;
    p.wallDir=0;
    if(!p.onGround){
      for(const b of G.blocks){
        if(b.gone)continue;
        const top=b.y+b.h;
        if(p.y<top&&p.y+1.5>b.y){
          const dxL=p.x-(b.x-b.w/2),dxR=(b.x+b.w/2)-p.x;
          if(p.z>b.z-b.d/2-0.3&&p.z<b.z+b.d/2+0.3){
            if(dxL<0.4&&dxL>0){p.wallDir=-1;break;}
            if(dxR<0.4&&dxR>0){p.wallDir=1;break;}
          }
        }
      }
    }
    p.wallSlide=p.wallDir!==0&&p.vy<0;
    if(p.onGround)p.coyote=.13;else p.coyote=Math.max(0,p.coyote-dt);
    if(keys.jump&&!p.jumpHeld)p.jumpBuf=.15;else p.jumpBuf=Math.max(0,p.jumpBuf-dt);
    const canFirst=(p.onGround||p.coyote>0);
    const canDouble=!canFirst&&p.jumpsUsed<2;
    const canWall=!canFirst&&!canDouble&&p.wallDir!==0;
    if(p.jumpBuf>0&&(canFirst||canDouble||canWall)){
      if(canFirst){p.vy=12.2;p.jumpsUsed=1;}
      else if(canDouble){p.vy=10.2;p.jumpsUsed=2;sfx.djump();G.burst3D(p.x,p.y,p.z,['#aaffee','#ffffff','#ffd43b'],12,2.5);}
      else{p.vy=11;p.vx=-p.wallDir*8;p.jumpsUsed=1;p.wallDir=0;G.wallJumps++;sfx.walljump();G.burst3D(p.x,p.y+0.5,p.z,['#7dd3fc','#fff'],10,2);G.floatTxt(p.x,p.y+2,p.z,'🧗 Wall Jump!',1);}
      p.onGround=false;p.coyote=0;p.jumpBuf=0;p.sq=-.35;
      if(canFirst)sfx.jump();
    }
    if(!keys.jump&&p.jumpHeld&&p.vy>0)p.vy*=.55;
    p.jumpHeld=keys.jump;
    if(keys.slide&&p.onGround&&p.slideT<=0){
      p.slideT=0.6;p.slide=1;G.slides++;sfx.slide();
      G.burst3D(p.x,p.y,p.z,['#7dd3fc','#bae6fd'],8,1.5);
    }
    if(p.slideT>0){p.slideT-=dt;p.vz*=1.02;if(p.slideT<=0)p.slide=0;}
    p.vy-=23*dt;
    if(p.vy<-24)p.vy=-24;
    if(p.wallSlide)p.vy=Math.max(p.vy,-3);
    p.prevY=p.y;
    p.y+=p.vy*dt;
    p.onGround=false;
    let bestTop=-1,bestBlock=null;
    for(const b of G.blocks){
      if(b.gone)continue;
      const top=b.y+b.h;
      if(p.x>b.x-b.w/2-0.5&&p.x<b.x+b.w/2+0.5&&p.z>b.z-b.d/2-0.5&&p.z<b.z+b.d/2+0.5){
        const crossedTop=p.vy<=0&&p.prevY>=top-0.05&&p.y<=top+0.05;
        const nearTop=p.vy<=0&&p.y>=top-0.85&&p.y<=top+0.05;
        if((crossedTop||nearTop)&&top>bestTop){bestTop=top;bestBlock=b;}
      }
    }
    if(bestBlock){
      const wasOnGround=p.onGround;
      p.y=bestTop;p.vy=0;p.onGround=true;
      if(!wasOnGround){p.sq=.2;p.jumpsUsed=0;}
      if(Math.abs(p.sq)<0.05)p.sq=0.12;
      p.lastSafeZ=p.z;
      if(bestBlock.crumble&&bestBlock.crumbleT<=0)bestBlock.crumbleT=1.0;
    }
    for(const pad of G.bouncePads){
      if(pad.used)continue;
      if(Math.abs(p.x-pad.x)<pad.r&&Math.abs(p.z-pad.z)<pad.r&&Math.abs(p.y-pad.y)<1){
        p.vy=18;p.onGround=false;pad.used=true;sfx.bounce();
        G.burst3D(pad.x,pad.y,pad.z,['#f472b6','#fbbf24','#fff'],16,3);
        G.floatTxt(pad.x,pad.y+1,pad.z,'🔄 BOUNCE!',1);
        setTimeout(()=>pad.used=false,2000);
      }
    }
    for(const wz of G.windZones){
      if(p.x>wz.x-wz.w/2&&p.x<wz.x+wz.w/2&&p.z>wz.z-wz.d/2&&p.z<wz.z+wz.d/2&&p.y>wz.y&&p.y<wz.y+wz.h){
        p.vx+=wz.dir*wz.str*dt;p.windT=0.5;
        if(Math.random()<0.1)sfx.wind();
      }
    }
    if(p.windT>0)p.windT-=dt;
    for(const o of G.rotatingObs){
      const dx=p.x-o.x,dz=p.z-o.z;
      const dist=Math.sqrt(dx*dx+dz*dz);
      if(dist<o.len/2+0.5&&Math.abs(p.y-o.y)<1.5){
        p.vx+=dx/dist*15;p.vz+=dz/dist*15;p.vy=Math.max(p.vy,5);
        G.shake=8;sfx.block();
      }
    }
    if(p.vy>0){
      for(const b of G.blocks){
        if(b.type!=='question'||b.used)continue;
        const btm=b.y+b.h;
        if(p.x>b.x-b.w/2&&p.x<b.x+b.w/2&&p.z>b.z-b.d/2&&p.z<b.z+b.d/2&&p.y+1.5>btm-0.15&&p.y+1.5<btm+0.65){
          b.used=true;p.vy=-3.5;sfx.block();
          G.burst3D(p.x,p.y+1.5,p.z,['#ffd43b','#fff','#ff922b'],16,3);
          G.showQuestion(b);return;
        }
      }
    }
    for(const b of G.blocks){
      if(b.type==='coin'&&!b.collected){
        const cy=b.y+b.h+1.2;
        if(Math.abs(p.x-b.x)<1.4&&Math.abs(p.z-b.z)<1.4&&Math.abs(p.y+0.7-cy)<1.6){
          b.collected=true;G.coins++;sfx.coin();
          G.floatTxt(b.x,cy,b.z,'+1 🪙');
          G.burst3D(b.x,cy,b.z,['#ffd43b','#fff'],10);
          G.updateHUD();
        }
      }
    }
    if(p.y<-15){
      G.falls++;
      if(ch.noFall){G.endGame(false,'💀 Rơi xuống!');return;}
      if(p.lastSafeZ>0){
        const safeZ=p.lastSafeZ;
        let safeBlock=null,bestDist=1e9;
        for(const b of G.blocks){
          if(b.gone)continue;
          const d=Math.abs(b.z-safeZ);
          if(d<bestDist&&b.z<safeZ+3){bestDist=d;safeBlock=b;}
        }
        if(safeBlock){p.x=safeBlock.x;p.y=safeBlock.y+safeBlock.h+1;p.z=safeBlock.z;p.vx=0;p.vy=0;p.vz=0;p.jumpsUsed=0;}
        else{p.y=5;p.vy=0;}
        G.shake=14;sfx.fall();G.say('🔄 Quay lại!');
      }else{G.endGame(false,'💀 Rơi rồi!');return;}
    }
  }
  return{newPlayer,update};
})();
