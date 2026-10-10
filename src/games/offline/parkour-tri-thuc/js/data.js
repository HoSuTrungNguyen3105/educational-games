window.PARKOUR_DATA=(function(){
  const BANK_DEF={
    challenges:[
      {id:"free",name:"Tự do",icon:"🎮",desc:"Chơi tự do, không giới hạn",reward:0},
      {id:"speedrun",name:"Nước rút",icon:"⚡",desc:"Về đích trong 60 giây",timeLimit:60,reward:100},
      {id:"sprint",name:"Siêu tốc",icon:"💨",desc:"Về đích trong 40 giây",timeLimit:40,reward:200},
      {id:"collector",name:"Sưu tập",icon:"🪙",desc:"Thu thập 20 xu để thắng",collectCoins:20,reward:80},
      {id:"treasure",name:"Kho báu",icon:"💰",desc:"Thu thập 40 xu để thắng",collectCoins:40,reward:180},
      {id:"scholar",name:"Học giả",icon:"🎓",desc:"Trả lời đúng 5 câu",correctAnswers:5,reward:120},
      {id:"professor",name:"Giáo sư",icon:"🧠",desc:"Trả lời đúng 10 câu",correctAnswers:10,reward:250},
      {id:"perfect",name:"Hoàn hảo",icon:"💎",desc:"Về đích không sai câu nào",noWrong:true,reward:150},
      {id:"flawless",name:"Vô khuyết",icon:"✨",desc:"Đúng 5 câu + không sai câu nào",noWrong:true,correctAnswers:5,reward:300},
      {id:"explorer",name:"Thám hiểm",icon:"🗺️",desc:"Đi được 100 mét",minDistance:100,reward:60},
      {id:"nomiss",name:"Không ngã",icon:"🎯",desc:"Không rơi + trả lời đúng 3 câu",noFall:true,minCorrect:3,reward:100},
      {id:"marathon",name:"Marathon",icon:"🏃",desc:"Đi 150m + đúng 5 câu + không rơi",minDistance:150,minCorrect:5,noFall:true,reward:250},
      {id:"godspeed",name:"Thần tốc",icon:"🌟",desc:"40s + không sai + không rơi",timeLimit:40,noWrong:true,noFall:true,reward:500},
      {id:"wallrunner",name:"Wall Runner",icon:"🧗",desc:"Dùng wall jump 5 lần + về đích",minWallJumps:5,reward:200},
      {id:"slidemaster",name:"Slide Master",icon:"🛝",desc:"Slide 10 lần + về đích",minSlides:10,reward:150},
      {id:"parkourpro",name:"Parkour Pro",icon:"🏅",desc:"Wall jump 3 + slide 5 + đúng 5 câu",minWallJumps:3,minSlides:5,minCorrect:5,reward:400}
    ],
    viet:[
      {q:"Từ nào chỉ con vật?",a:["mèo","bàn","sách","bút"],c:0,g:1,icon:"🐱"},
      {q:"Từ trái nghĩa với 'to' là:",a:["nhỏ","cao","dài","rộng"],c:0,g:1},
      {q:"Từ nào là từ láy?",a:["long lanh","bàn ghế","xe cộ","học hành"],c:0,g:3},
      {q:"Câu 'Trời mưa như trút nước' dùng biện pháp gì?",a:["So sánh","Nhân hóa","Điệp từ","Ẩn dụ"],c:0,g:4}
    ],
    eng:[
      {q:"Từ 'Apple' nghĩa là gì?",a:["Quả táo","Quả cam","Quả chuối","Quả nho"],c:0,g:1,icon:"🍎",lang:"en-US"},
      {q:"Con mèo trong tiếng Anh là gì?",a:["Cat","Dog","Bird","Fish"],c:0,g:1,icon:"🐱"},
      {q:"Điền vào chỗ trống: I ___ a student.",a:["am","is","are","be"],c:0,g:2,lang:"en-US"},
      {q:"Số nhiều của 'child' là gì?",a:["children","childs","childes","childrens"],c:0,g:4}
    ],
    sci:[
      {q:"Con vật nào sống dưới nước?",a:["Cá","Gà","Chó","Mèo"],c:0,g:1,icon:"🐟"},
      {q:"Nước đóng băng ở bao nhiêu độ C?",a:["0°C","10°C","50°C","100°C"],c:0,g:3,icon:"🧊"},
      {q:"Hành tinh nào gần Mặt Trời nhất?",a:["Sao Thủy","Sao Hỏa","Trái Đất","Sao Kim"],c:0,g:3,icon:"🪐"},
      {q:"Trái Đất quay quanh Mặt Trời hết khoảng bao lâu?",a:["365 ngày","30 ngày","24 giờ","7 ngày"],c:0,g:5,icon:"🌍"}
    ],
    geo:[
      {q:"Thủ đô của Việt Nam là gì?",a:["Hà Nội","TP.HCM","Đà Nẵng","Huế"],c:0,g:1,icon:"🏛️"},
      {q:"Vịnh Hạ Long thuộc tỉnh nào?",a:["Quảng Ninh","Hải Phòng","Thanh Hóa","Nghệ An"],c:0,g:3,icon:"⛵"},
      {q:"Đỉnh núi cao nhất Việt Nam là đỉnh nào?",a:["Phan-xi-păng","Bà Đen","Ngọc Linh","Lang Biang"],c:0,g:4,icon:"⛰️"}
    ],
    custom:[]
  };
  const SUBN={math:'Toán',viet:'Tiếng Việt',eng:'Tiếng Anh',sci:'Khoa học',geo:'Địa lí',custom:'Thầy cô',mix:'Tổng hợp'};
  const SUBJ_ICON={math:'🔢',viet:'📖',eng:'🔤',sci:'🔬',geo:'🗺️',mix:'🌈',custom:'🧑‍🏫'};
  function validateBank(b){
    const er=[];
    if(!b||typeof b!=='object')return['JSON phải là object'];
    if(b.challenges!==undefined){
      if(!Array.isArray(b.challenges))er.push('"challenges" phải là mảng');
      else b.challenges.forEach((c,i)=>{
        if(!c||typeof c.id!=='string')er.push(`challenges#${i+1}: thiếu id`);
        if(!c||typeof c.name!=='string')er.push(`challenges#${i+1}: thiếu name`);
      });
    }
    ['viet','eng','sci','geo','custom'].forEach(k=>{
      if(b[k]===undefined)return;
      if(!Array.isArray(b[k])){er.push(`"${k}" phải mảng`);return;}
      b[k].forEach((q,i)=>{
        const p=`${k}#${i+1}`;
        if(!q||typeof q.q!=='string')er.push(`${p}: thiếu q`);
        if(!Array.isArray(q.a)||q.a.length<2||q.a.length>4)er.push(`${p}: a cần 2-4 đáp án`);
        else if(!Number.isInteger(q.c)||q.c<0||q.c>=q.a.length)er.push(`${p}: c sai`);
      });
    });
    return er;
  }
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function pick(a){return a[Math.floor(Math.random()*a.length)];}
  function genMath(g){
    const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
    const lv=(Math.random()<.25&&g>1)?g-1:g;
    function opts(c,sp,fmt,min,st){
      fmt=fmt||String;min=min===undefined?-1e9:min;st=st||1;
      const set=new Set([+c.toFixed(2)]);let g2=0;
      while(set.size<4&&g2++<90){const v=+(c+ri(-sp,sp)*st).toFixed(2);if(v!==+c.toFixed(2)&&v>=min)set.add(v);}
      let k=1;while(set.size<4){set.add(+(c+k*st).toFixed(2));k++;}
      const arr=shuffle([...set]);return{a:arr.map(fmt),c:arr.indexOf(+c.toFixed(2))};
    }
    const mq=(q,a,c,e,ic)=>({q,a,c,e:e||'',icon:ic||'',lang:'vi-VN',subj:'math'});
    if(lv<=1){const a=ri(1,10),b=ri(1,10),r=a+b;const o=opts(r,3,String,0);return mq(`${a} + ${b} = ?`,o.a,o.c,`${a}+${b}=${r}`,'🧮');}
    if(lv===2){const a=ri(2,9),b=ri(2,9),r=a*b;const o=opts(r,6,String,0);return mq(`${a} × ${b} = ?`,o.a,o.c,`${a}×${b}=${r}`,'✖️');}
    if(lv===3){const a=ri(10,99),b=ri(10,99),r=a+b;const o=opts(r,8,String,0);return mq(`${a} + ${b} = ?`,o.a,o.c,`${a}+${b}=${r}`,'🧮');}
    if(lv===4){const a=ri(11,49),b=ri(2,9),r=a*b;const o=opts(r,12,String,1);return mq(`${a} × ${b} = ?`,o.a,o.c,`${a}×${b}=${r}`,'✖️');}
    const p=pick([10,20,25,50]),bb=pick([40,60,80,100]),r=p*bb/100;const o=opts(r,6,String,1);return mq(`${p}% của ${bb} = ?`,o.a,o.c,`${r}`,'％');
  }
  function pickQuestion(S,bank){
    let subj=S.subject;
    if(subj==='mix')subj=pick(['math','math','viet','eng','sci','geo'].concat((bank.custom||[]).length?['custom']:[]));
    if(subj==='math')return genMath(S.grade);
    const all=bank[subj]||[];if(!all.length)return genMath(S.grade);
    const q=pick(all);
    const idx=shuffle(q.a.map((_,i)=>i));
    return{q:q.q,a:idx.map(i=>q.a[i]),c:idx.indexOf(q.c),e:q.e||'',icon:q.icon||'',lang:q.lang||'vi-VN',subj};
  }
  return{BANK_DEF,SUBN,SUBJ_ICON,validateBank,pickQuestion,shuffle,pick,genMath};
})();
