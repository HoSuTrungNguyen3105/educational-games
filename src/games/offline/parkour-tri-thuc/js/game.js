window.PARKOUR_GAME=(function(){
  const $=id=>document.getElementById(id);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rand=(a,b)=>a+Math.random()*(b-a);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const KEY='parkour3d-v4';
  let mem=null;
  function loadS(){try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s);}catch(e){}return mem?JSON.parse(mem):{};}
  const S=Object.assign({wallet:0,grade:3,subject:'mix',challenge:'free',stats:{},streak:{last:'',n:0},sfx:true,voice:true,wrong:[],bank:null,best:0},loadS());
  function persist(){const s=JSON.stringify(S);try{localStorage.setItem(KEY,s);}catch(e){mem=s;}}
  window.PARKOUR_S=S;
  let bank=(S.bank&&!PARKOUR_DATA.validateBank(S.bank).length)?S.bank:PARKOUR_DATA.BANK_DEF;
  if(!bank.challenges)bank.challenges=PARKOUR_DATA.BANK_DEF.challenges;
  const G={
    blocks:[],npcs:[],player:null,level:0,coins:0,gems:0,
    asked:0,correct:0,wrong:0,over:false,paused:false,T:0,dist:0,totalDist:200,
    clouds:[],shake:0,parts:[],floats:[],challenge:null,timeLeft:0,challengeDone:false,
    falls:0,wallJumps:0,slides:0,windZones:[],bouncePads:[],crumbling:[],movingPlats:[],rotatingObs:[],
    burst3D, floatTxt, showQuestion, updateHUD, say, tip, endGame
  };
  function burst3D(x,y,z,cols,n,spd){
    if(G.parts.length>200)return;
    n=n||10;spd=spd||2;
    for(let i=0;i<n;i++){
      const a=rand(0,6.283),r=rand(.5,spd);
      G.parts.push({x:x+Math.cos(a)*0.5,y:y+rand(-0.5,0.5),z:z+Math.sin(a)*0.5,vx:Math.cos(a)*r,vy:rand(2,5),vz:Math.sin(a)*r,life:rand(.6,1.1),max:1,c:pick(cols),r:rand(3,7)});
    }
  }
  function floatTxt(x,y,z,t,life){
    if(G.floats.length<25)G.floats.push({x,y,z,t,life:life||1,max:life||1});
  }
  function say(t){const e=$('say');e.textContent=t;e.classList.remove('show');void e.offsetWidth;e.classList.add('show');}
  function tip(t,ms){const e=$('tip');e.textContent=t;e.classList.add('show');clearTimeout(tip.t);tip.t=setTimeout(()=>e.classList.remove('show'),ms||5000);}
  function updateHUD(){
    $('coinN').textContent=G.coins;
    $('gemN').textContent=G.gems;
    const ch=G.challenge;
    const pill=$('challengePill');
    if(!ch||ch.id==='free'||G.over){pill.style.display='none';return;}
    pill.style.display='flex';
    pill.classList.remove('ok','warn');
    let txt=ch.icon+' ';
    if(ch.timeLimit){
      txt+=`${Math.ceil(G.timeLeft)}s`;
      if(G.timeLeft<=10)pill.classList.add('warn');
      if(ch.noWrong||ch.noFall||ch.minCorrect)txt+=` · ${G.correct}✓${G.wrong?` ${G.wrong}✗`:''}`;
    }else if(ch.collectCoins){
      txt+=`${G.coins}/${ch.collectCoins} 🪙`;
      if(G.coins>=ch.collectCoins)pill.classList.add('ok');
    }else if(ch.correctAnswers){
      txt+=`${G.correct}/${ch.correctAnswers} 🎓`;
      if(G.correct>=ch.correctAnswers)pill.classList.add('ok');
    }else if(ch.minDistance){
      txt+=`${Math.floor(G.dist)}/${ch.minDistance}m`;
      if(ch.minCorrect)txt+=` · ${G.correct}✓`;
      if(G.dist>=ch.minDistance&&(!ch.minCorrect||G.correct>=ch.minCorrect))pill.classList.add('ok');
    }else if(ch.minWallJumps){
      txt+=`🧗 ${G.wallJumps}/${ch.minWallJumps}`;
      if(ch.minSlides)txt+=` · 🛝 ${G.slides}/${ch.minSlides}`;
      if(ch.minCorrect)txt+=` · ${G.correct}✓`;
      if(G.wallJumps>=ch.minWallJumps&&(!ch.minSlides||G.slides>=ch.minSlides)&&(!ch.minCorrect||G.correct>=ch.minCorrect))pill.classList.add('ok');
    }else if(ch.minSlides){
      txt+=`🛝 ${G.slides}/${ch.minSlides}`;
      if(G.slides>=ch.minSlides)pill.classList.add('ok');
    }else if(ch.noWrong){
      txt+=G.wrong>0?`${G.wrong} sai ❌`:`Hoàn hảo ✨`;
      if(G.wrong>0)pill.classList.add('warn');
    }else if(ch.noFall){
      txt+=`${G.correct}/${ch.minCorrect||0} ✓`;
    }else{txt+=ch.name;}
    pill.textContent=txt;
  }
  let QA=null;
  function closeModal(){$('qm').classList.remove('on');try{speechSynthesis.cancel();}catch(e){}}
  function showQuestion(block){
    const q=PARKOUR_DATA.pickQuestion(S,bank);
    G.paused=true;G.asked++;
    QA={q,block,done:false,hinted:false};
    $('qChip').textContent=`${PARKOUR_DATA.SUBN[q.subj]||''} · Lớp ${S.grade}`;
    $('qHero').textContent='🏃';$('qHero').className='qhero';
    $('qText').textContent=q.q;$('qIcon').textContent=q.icon||'';
    $('qIcon').style.display=q.icon?'':'none';
    $('qFb').textContent='';$('qFb').className='qfb';
    $('qHint').disabled=false;$('qHint').textContent='💡 Gợi ý (3⭐)';
    $('qSpeak').style.display=('speechSynthesis' in window)?'':'none';
    const box=$('qAns');box.innerHTML='';
    q.a.forEach((t,i)=>{
      const b=document.createElement('button');b.className='qa';b.dataset.i=i;
      b.innerHTML=`<i>${['A','B','C','D'][i]}</i><span></span>`;b.lastChild.textContent=t;
      box.appendChild(b);
    });
    $('qm').classList.add('on');
    if(S.voice)PARKOUR_SFX.speak(q.q,q.lang);
  }
  function onAnswer(ok){
    if(ok){G.coins+=10;floatTxt(G.player.x,G.player.y+2,G.player.z,'+10 🪙',1.4);updateHUD();}
    else{G.shake=12;}
    if(G.over)return;
    const ch=G.challenge;
    if(ok&&ch.correctAnswers&&G.correct>=ch.correctAnswers){endGame(true,'🎓 Đủ câu đúng!');return;}
    if(!ok&&ch.noWrong){endGame(false,'💔 Đã sai câu!');return;}
  }
  function endGame(won,reason){
    if(G.over)return;
    G.over=true;G.paused=true;
    $('ctrl').classList.remove('on');
    const ch=G.challenge;
    let rewardGiven=0;
    if(won){
      PARKOUR_SFX.sfx.win();say(reason||'🎉 Về đích!');
      if(ch&&ch.reward){rewardGiven=ch.reward;S.wallet+=ch.reward;}
      S.wallet+=Math.floor(G.coins/2+G.gems);
      persist();
    }else{
      PARKOUR_SFX.sfx.lose();say(reason||'💀 Thua!');
    }
    setTimeout(()=>{
      $('hud').classList.remove('on');
      $('rTitle').textContent=won?'🎉 Thắng!':'💪 Thử lại nhé!';
      $('rCoin').textContent=G.coins;
      $('rGem').textContent=G.gems;
      $('rAcc').textContent=Math.round((G.asked?G.correct/G.asked:1)*100)+'%';
      $('rDist').textContent=Math.floor(G.dist)+'m';
      const rw=$('rReward');
      if(rewardGiven>0){rw.style.display='flex';rw.innerHTML=`🏆 Thưởng challenge: +${rewardGiven} ⭐`;}
      else rw.style.display='none';
const score=G.coins*10+G.gems*50+(won?200:0);
    if(score>(S.best||0)){S.best=score;persist();}
    reportToHost(won);
    $('result').classList.add('on');
  },700);
  }
  function post(msg){try{if(window.parent&&window.parent!==window)window.parent.postMessage(msg,'*');}catch(e){}}
  function reportToHost(won){
    post({type:'hide-hud'});
    if(window.EG_ANSWER&&typeof window.EG_ANSWER.finish==='function'){
      window.EG_ANSWER.finish({
        score:G.coins*10+G.gems*50+(won?200:0),
        correct:G.correct,
        totalQuestions:G.asked,
        timeUsed:Math.round(G.T),
        coinReward:won?Math.floor(G.coins/2+G.gems):0
      });
    }
  }
  function startLevel(){
    PARKOUR_LEVEL.genLevel(G);
    G.player=PARKOUR_PLAYER.newPlayer();
    G.coins=0;G.gems=0;G.asked=0;G.correct=0;G.wrong=0;G.falls=0;
    G.wallJumps=0;G.slides=0;
    G.over=false;G.paused=false;G.dist=0;G.T=0;G.shake=0;G.level++;
    G.challengeDone=false;
    const ch=bank.challenges.find(c=>c.id===S.challenge)||{id:'free',name:'Tự do',icon:'🎮',reward:0};
    G.challenge=ch;
    G.timeLeft=ch.timeLimit||0;
    $('hud').classList.add('on');$('ctrl').classList.add('on');
    ['home','result','pause','report','editor','qm'].forEach(s=>$(s).classList.remove('on'));
    updateHUD();
    say('🏁 GO!');
    const tips=['▲▼ tiến/lùi · ◀▶ ngang · ⬆ nhảy (2x = nhảy đôi) · ⬇ slide'];
    if(ch.id!=='free')tips.push(`${ch.icon} ${ch.name} — ${ch.desc}`);
    else tips.push('🧗 Nhảy tường: đâm tường + nhảy · 🛝 Slide dưới chướng ngại!');
    tip(tips.join(' · '),7500);
    PARKOUR_SFX.sfx.tap();
  }
  function update(dt){
    G.T+=dt;
    if(G.shake>0)G.shake=Math.max(0,G.shake-dt*30);
    let pn=0;
    for(let i=0;i<G.parts.length;i++){
      const p=G.parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=900*dt;p.life-=dt;
      if(p.life>0)G.parts[pn++]=p;
    }
    G.parts.length=pn;
    let fn=0;
    for(let i=0;i<G.floats.length;i++){
      const f=G.floats[i];f.y-=40*dt;f.life-=dt;
      if(f.life>0)G.floats[fn++]=f;
    }
    G.floats.length=fn;
    for(const c of G.clouds)c.x+=c.sp*dt;
    for(const b of G.blocks){
      if(b.moving){
        b.movePh+=b.moveSpeed*dt;
        if(b.moveAxis==='x')b.x=b.origX+Math.sin(b.movePh)*b.moveRange;
        else b.y=b.origY+Math.sin(b.movePh)*b.moveRange;
      }
      if(b.crumble&&b.crumbleT>0){
        b.crumbleT-=dt;
        if(b.crumbleT<=0){b.gone=true;PARKOUR_SFX.sfx.crumble();burst3D(b.x,b.y+b.h,b.z,['#a8a29e','#78716c'],14,3);}
      }
    }
    for(const o of G.rotatingObs)o.angle+=o.speed*dt;
    if(!G.player||G.paused||G.over)return;
    const p=G.player;
    const ch=G.challenge;
    if(ch.timeLimit){
      G.timeLeft-=dt;
      if(G.timeLeft<=0){G.timeLeft=0;endGame(false,'⏰ Hết giờ!');return;}
    }
    PARKOUR_PLAYER.update(p,G,PARKOUR_CONTROLS.keys,dt,ch,PARKOUR_SFX.sfx);
    if(G.over)return;
    PARKOUR_RENDER.updateCam(G);
    const prog=clamp(p.z/G.totalDist*100,0,100);
    $('progressFill').style.width=prog+'%';
    $('progressIcon').style.left=prog+'%';
    if(ch.collectCoins&&G.coins>=ch.collectCoins){endGame(true,'🪙 Đủ xu rồi!');return;}
    if(ch.correctAnswers&&G.correct>=ch.correctAnswers){endGame(true,'🎓 Đủ câu đúng!');return;}
    if(ch.minDistance&&!ch.correctAnswers&&!ch.collectCoins&&!ch.minCorrect){
      if(G.dist>=ch.minDistance){endGame(true,'🗺️ Đủ khoảng cách!');return;}
    }
    if(ch.minDistance&&ch.minCorrect&&G.dist>=ch.minDistance&&G.correct>=ch.minCorrect&&!ch.noFall){
      endGame(true,'🏆 Hoàn thành!');return;
    }
    if(ch.minWallJumps&&G.wallJumps>=ch.minWallJumps&&!ch.minSlides&&!ch.minCorrect){
      endGame(true,'🧗 Đủ wall jump!');return;
    }
    if(ch.minSlides&&G.slides>=ch.minSlides&&!ch.minWallJumps&&!ch.minCorrect){
      endGame(true,'🛝 Đủ slide!');return;
    }
    if(ch.minWallJumps&&ch.minSlides&&ch.minCorrect&&G.wallJumps>=ch.minWallJumps&&G.slides>=ch.minSlides&&G.correct>=ch.minCorrect){
      endGame(true,'🏅 Parkour Pro!');return;
    }
    if(p.z>=G.totalDist-0.5){
      if(ch.noWrong&&G.wrong>0){endGame(false,'💔 Đã sai câu!');return;}
      if(ch.minCorrect&&G.correct<ch.minCorrect){endGame(false,`📚 Cần ${ch.minCorrect} câu đúng!`);return;}
      if(ch.minDistance&&G.dist<ch.minDistance){endGame(false,`🗺️ Cần ${ch.minDistance}m!`);return;}
      if(ch.minWallJumps&&G.wallJumps<ch.minWallJumps){endGame(false,`🧗 Cần ${ch.minWallJumps} wall jump!`);return;}
      if(ch.minSlides&&G.slides<ch.minSlides){endGame(false,`🛝 Cần ${ch.minSlides} slide!`);return;}
      endGame(true,'🎉 Về đích!');
    }
  }
  function renderHome(){
    $('hStreak').textContent=`🔥 ${S.streak.n||0} ngày`;
    $('hWallet').textContent=`⭐ ${S.wallet}`;
    $('hBest').textContent=`🏆 ${S.best||0}`;
    $('sndBtn').textContent='🔊 '+(S.sfx?'Bật':'Tắt');
    const chEl=$('challenges');chEl.innerHTML='';
    const chs=bank.challenges||PARKOUR_DATA.BANK_DEF.challenges;
    if(!chs.find(c=>c.id===S.challenge))S.challenge=chs[0]?chs[0].id:'free';
    chs.forEach(c=>{
      const b=document.createElement('button');
      b.className='card'+(S.challenge===c.id?' sel':'');
      b.innerHTML=`<span class="e">${c.icon||'⚔️'}</span><div>${c.name}</div><div class="desc">${c.desc||''}</div>`+(c.reward?`<div class="desc">+${c.reward}⭐</div>`:'');
      b.onclick=()=>{PARKOUR_SFX.audio();S.challenge=c.id;persist();PARKOUR_SFX.sfx.tap();renderHome();};
      chEl.appendChild(b);
    });
    const subEl=$('subjects');subEl.innerHTML='';
    const subs=['mix','math','viet','eng','sci','geo'].concat((bank.custom||[]).length?['custom']:[]);
    subs.forEach(s=>{
      const b=document.createElement('button');
      b.className='subj'+(S.subject===s?' sel':'');
      b.innerHTML=`<span class="e">${PARKOUR_DATA.SUBJ_ICON[s]}</span>${PARKOUR_DATA.SUBN[s]}`;
      b.onclick=()=>{PARKOUR_SFX.audio();S.subject=s;persist();PARKOUR_SFX.sfx.tap();renderHome();};
      subEl.appendChild(b);
    });
  }
  function renderReport(){
    const subs=['math','viet','eng','sci','geo','custom'];
    const cols=['#ff758c','#7ed957','#ffb347','#8e9bff','#ffd43b','#4cd6b3'];
    let h='';
    subs.forEach((k,i)=>{
      const s=S.stats[k];if(!s&&k==='custom')return;
      const a=s?s.a:0,p=a?Math.round(s.c/a*100):0;
      h+=`<div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:13px"><span style="flex:0 0 100px">${PARKOUR_DATA.SUBN[k]}</span><div style="flex:1;height:16px;border-radius:16px;background:rgba(0,0,0,.15);overflow:hidden"><i style="display:block;height:100%;width:${p}%;background:${cols[i]};border-radius:16px"></i></div><span style="flex:0 0 40px;text-align:right">${a?p+'%':'—'}</span></div>`;
    });
    $('repBars').innerHTML=h||'<div style="opacity:.6">Chưa có dữ liệu</div>';
    $('repWrong').innerHTML=S.wrong.length?S.wrong.slice(0,10).map(w=>`<div style="background:#f0eaff;border-radius:10px;padding:6px 10px;color:#2a1a5e">${esc(w.q)} → <b style="color:#2f9e44">${esc(w.a)}</b></div>`).join(''):'<div style="opacity:.6">Chưa có câu sai.</div>';
  }
  function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
  function init(){
    PARKOUR_RENDER.init();
    PARKOUR_CONTROLS.init(PARKOUR_SFX);
    $('qAns').addEventListener('click',e=>{
      const b=e.target.closest('.qa');if(!b||!QA||QA.done)return;
      PARKOUR_SFX.audio();QA.done=true;
      const i=+b.dataset.i,ok=i===QA.q.c,q=QA.q;
      const st=S.stats[q.subj]||(S.stats[q.subj]={a:0,c:0});st.a++;if(ok)st.c++;
      if(q.id!=null&&window.EG_ANSWER&&typeof window.EG_ANSWER.answer==='function'){
        window.EG_ANSWER.answer(q.id,i,Math.round(G.T));
      }
      document.querySelectorAll('.qa').forEach(x=>{x.classList.add('lock');if(+x.dataset.i===q.c)x.classList.add('ok');});
      const fb=$('qFb'),hero=$('qHero');
      if(ok){
        G.correct++;b.classList.add('ok');PARKOUR_SFX.sfx.ok();
        hero.className='qhero cheer';fb.className='qfb ok';
        fb.textContent=pick(['Chính xác! 🎉','Tuyệt vời! ⭐','Giỏi quá! 👏','Đúng rồi! 🌟'])+(q.e?' '+q.e:'');
        persist();
        setTimeout(()=>{if(!QA)return;closeModal();QA=null;G.paused=false;onAnswer(true);},1200);
      }else{
        G.wrong++;b.classList.add('bad');PARKOUR_SFX.sfx.bad();hero.className='qhero sad';fb.className='qfb bad';
        fb.textContent=`Chưa đúng. Đáp án: ${q.a[q.c]}.`+(q.e?' '+q.e:'');
        S.wrong.unshift({q:q.q,a:q.a[q.c]});S.wrong=S.wrong.slice(0,30);persist();
        setTimeout(()=>{if(!QA)return;closeModal();QA=null;G.paused=false;onAnswer(false);},1500);
      }
    });
    $('qSpeak').onclick=()=>{PARKOUR_SFX.audio();if(QA){const w=S.voice;S.voice=true;PARKOUR_SFX.speak(QA.q.q+'. '+QA.q.a.map((t,i)=>['A','B','C','D'][i]+', '+t).join('. '),QA.q.lang);S.voice=w;}};
    $('qHint').onclick=()=>{
      if(!QA||QA.done||QA.hinted)return;PARKOUR_SFX.audio();
      if(S.wallet<3){PARKOUR_SFX.sfx.bad();$('qHint').textContent='Chưa đủ ⭐';return;}
      S.wallet-=3;persist();QA.hinted=true;$('qHint').disabled=true;PARKOUR_SFX.sfx.gem();
      const wrong=shuffle(QA.q.a.map((_,i)=>i).filter(i=>i!==QA.q.c)).slice(0,Math.min(2,QA.q.a.length-2));
      document.querySelectorAll('.qa').forEach(x=>{if(wrong.includes(+x.dataset.i))x.classList.add('out');});
    };
    $('playBtn').onclick=()=>{
      PARKOUR_SFX.audio();
      const d=new Date(),today=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
      if(S.streak.last!==today){const y=new Date(d.getTime()-864e5),yest=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();S.streak.n=S.streak.last===yest?S.streak.n+1:1;S.streak.last=today;persist();}
      startLevel();
    };
    $('pauseBtn').onclick=()=>{if(!G.player||G.paused||G.over)return;G.paused=true;$('pause').classList.add('on');$('ctrl').classList.remove('on');};
    $('resumeBtn').onclick=()=>{if(G.player)G.paused=false;$('pause').classList.remove('on');$('ctrl').classList.add('on');};
    $('pRetry').onclick=()=>{PARKOUR_SFX.audio();startLevel();};
    $('pHome').onclick=()=>{PARKOUR_SFX.audio();$('pause').classList.remove('on');$('hud').classList.remove('on');$('ctrl').classList.remove('on');G.player=null;renderHome();$('home').classList.add('on');};
    $('rRetry').onclick=()=>{PARKOUR_SFX.audio();startLevel();};
    $('rHome').onclick=()=>{PARKOUR_SFX.audio();$('result').classList.remove('on');$('hud').classList.remove('on');$('ctrl').classList.remove('on');G.player=null;renderHome();$('home').classList.add('on');};
    $('repBtn').onclick=()=>{PARKOUR_SFX.audio();renderReport();$('report').classList.add('on');};
    $('repBack').onclick=()=>$('report').classList.remove('on');
    $('sndBtn').onclick=()=>{PARKOUR_SFX.audio();S.sfx=!S.sfx;persist();renderHome();};
    $('edBtn').onclick=()=>{
      PARKOUR_SFX.audio();
      const pretty=o=>{const one=v=>JSON.stringify(v).replace(/,"/g,', "').replace(/":/g,'": ');let s='{\n';const ks=Object.keys(o);ks.forEach((k,i)=>{s+=`  "${k}": [\n`+o[k].map(q=>'    '+one(q)).join(',\n')+`${o[k].length?'\n':''}  ]`+(i<ks.length-1?',\n':'\n');});return s+'}';};
      $('bankText').value=pretty(Object.assign({challenges:bank.challenges||[]},bank));
      $('bankErr').textContent='';$('editor').classList.add('on');
    };
    $('edBack').onclick=()=>$('editor').classList.remove('on');
    $('bkApply').onclick=()=>{
      let b;try{b=JSON.parse($('bankText').value);}catch(e){$('bankErr').textContent='JSON sai: '+e.message;return;}
      const er=PARKOUR_DATA.validateBank(b);
      if(er.length){$('bankErr').textContent=er.slice(0,6).join(' • ');return;}
      bank=b;S.bank=b;persist();$('bankErr').textContent='✅ Đã áp dụng!';renderHome();
    };
    $('bkReset').onclick=()=>{
      const pretty=o=>{const one=v=>JSON.stringify(v).replace(/,"/g,', "').replace(/":/g,'": ');let s='{\n';const ks=Object.keys(o);ks.forEach((k,i)=>{s+=`  "${k}": [\n`+o[k].map(q=>'    '+one(q)).join(',\n')+`${o[k].length?'\n':''}  ]`+(i<ks.length-1?',\n':'\n');});return s+'}';};
      $('bankText').value=pretty(PARKOUR_DATA.BANK_DEF);$('bankErr').textContent='Đã nạp mặc định.';
    };
    $('bkDown').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([$('bankText').value],{type:'application/json'}));a.download='bank.json';document.body.appendChild(a);a.click();a.remove();};
    $('bkLoad').onclick=()=>$('bkFile').click();
    $('bkFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('bankText').value=r.result;$('bankErr').textContent='Đã nạp file.';};r.readAsText(f);e.target.value='';};
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.player&&!G.paused&&!G.over){G.paused=true;$('pause').classList.add('on');$('ctrl').classList.remove('on');}});
    renderHome();
    let lastT=performance.now();
    function loop(t){
      const dt=Math.min(.033,(t-lastT)/1000);lastT=t;
      update(dt);
      PARKOUR_RENDER.draw(G);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
  return{init,G,S,get bank(){return bank},set bank(v){bank=v}};
})();
