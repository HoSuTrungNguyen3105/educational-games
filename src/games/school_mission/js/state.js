// ===== STATE: tiến trình người chơi (lưu localStorage), cảnh hiện tại, nhân vật =====
let S={coins:100,gems:0,xp:0,lv:1,en:100,hat:"",col:"#ff9f43",own:["","#ff9f43"],q:{}};
try{const s=localStorage.getItem("tvv");if(s)S=Object.assign(S,JSON.parse(s))}catch(e){}
S.exam=S.exam||{};function save(){S._updated=Date.now();try{localStorage.setItem("tvv",JSON.stringify(S))}catch(e){}try{if(typeof scheduleSchoolSync==="function")scheduleSchoolSync()}catch(e){}}
const D={out:[1800,1100],hall:[1700,420],hall2:[1700,420],room:[1000,600]};
let sc="out",rk="math",fade=0,open_=false,tt=0,ft=[],flowers=[],ftime=0;
const me={x:900,y:560,mv:0,t:0};
