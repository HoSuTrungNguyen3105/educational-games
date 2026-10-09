window.PARKOUR_SFX = (function(){
  let ac=null;
  function audio(){
    if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
    if(ac&&ac.state==='suspended')ac.resume();
  }
  function tone(f,d,v,type,delay,slide){
    if(!ac||!window.PARKOUR_S.sfx)return;
    d=d||.15;v=v||.1;type=type||'sine';delay=delay||0;slide=slide||0;
    const t=ac.currentTime+delay,o=ac.createOscillator(),g=ac.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);
    if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);
    g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.05);
  }
  const sfx={
    jump:()=>tone(440,.14,.09,'triangle',0,300),
    djump:()=>{tone(660,.14,.09,'triangle',0,280);tone(990,.12,.07,'triangle',.04,200);},
    walljump:()=>{tone(520,.12,.09,'triangle',0,400);tone(780,.1,.07,'triangle',.03,300);},
    slide:()=>tone(300,.15,.06,'sawtooth',0,-100),
    coin:()=>{tone(988,.06,.07,'square');tone(1319,.1,.07,'square',.04);},
    gem:()=>[784,988,1318,1568].forEach((f,i)=>tone(f,.14,.09,'triangle',i*.05)),
    ok:()=>[523,659,784,1046].forEach((f,i)=>tone(f,.2,.1,'triangle',i*.06)),
    bad:()=>{tone(260,.2,.1,'sawtooth',0,-90);tone(180,.3,.09,'sawtooth',.15,-80);},
    tap:()=>tone(620,.06,.06,'triangle'),
    block:()=>tone(180,.1,.1,'triangle',0,60),
    fall:()=>{tone(440,.15,.08,'triangle',0,-300);tone(220,.25,.09,'sawtooth',.1,-120);},
    win:()=>[523,659,784,1046,1318].forEach((f,i)=>tone(f,.3,.11,'triangle',i*.1)),
    lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.4,.11,'sawtooth',i*.2)),
    bounce:()=>tone(200,.2,.1,'sine',0,600),
    crumble:()=>tone(150,.3,.08,'sawtooth',0,-50),
    wind:()=>tone(400,.4,.05,'sine',0,200)
  };
  function speak(t,l){
    if(!window.PARKOUR_S.voice||!('speechSynthesis' in window))return;
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=l||'vi-VN';u.rate=.92;speechSynthesis.speak(u);}catch(e){}
  }
  return{audio,tone,sfx,speak};
})();
