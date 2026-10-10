window.PARKOUR_CONTROLS=(function(){
  const keys={up:false,down:false,left:false,right:false,jump:false,slide:false};
  function bind(id,key,sfx){
    const el=document.getElementById(id);
    const on=e=>{
      e.preventDefault();e.stopPropagation();
      sfx.audio();
      el.classList.add('press');
      keys[key]=true;
      if(el.setPointerCapture&&e.pointerId!==undefined){try{el.setPointerCapture(e.pointerId);}catch(er){}}
    };
    const off=e=>{
      if(e)e.preventDefault();
      el.classList.remove('press');
      keys[key]=false;
    };
    el.addEventListener('pointerdown',on);
    el.addEventListener('pointerup',off);
    el.addEventListener('pointercancel',off);
    el.addEventListener('pointerleave',off);
    el.addEventListener('contextmenu',e=>e.preventDefault());
    el.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
  }
  function init(sfx){
    bind('btnU','up',sfx);bind('btnD','down',sfx);bind('btnL','left',sfx);bind('btnR','right',sfx);bind('btnJ','jump',sfx);bind('btnS','slide',sfx);
    const keyMap={'arrowleft':'left','a':'left','arrowright':'right','d':'right','arrowup':'up','w':'up','arrowdown':'down','s':'down',' ':'jump','shift':'slide','c':'slide'};
    document.addEventListener('keydown',e=>{
      const k=keyMap[e.key.toLowerCase()]||(e.key===' '?'jump':null);
      if(k){e.preventDefault();sfx.audio();keys[k]=true;}
    });
    document.addEventListener('keyup',e=>{
      const k=keyMap[e.key.toLowerCase()]||(e.key===' '?'jump':null);
      if(k){e.preventDefault();keys[k]=false;}
    });
  }
  return{keys,init};
})();
