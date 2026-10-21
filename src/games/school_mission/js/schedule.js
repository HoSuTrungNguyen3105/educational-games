// ===== SCHEDULE: thời khóa biểu, đồng hồ, báo chuông, vào lớp đúng giờ =====
const DAY_NAME={1:"Thứ 2",2:"Thứ 3",3:"Thứ 4",4:"Thứ 5",5:"Thứ 6",6:"Thứ 7",7:"CN"};
const SUB_LABEL={math:"Toán",eng:"Tiếng Anh",van:"Ngữ văn",sci:"Khoa học"};
const CFG=Object.assign({
  useRealTime:true,simulateTime:null,demoMode:false,
  earlyMinutes:5,graceMinutes:10,notifyBeforeMinutes:2,
  autoEnterClass:true,allowFreePractice:true,requireOnTimeForLesson:true,
  schoolName:"Trường Vui Vẻ",timetable:[]
}, window.__SCHOOL_CONFIG__||{});
try{const st=localStorage.getItem("tvv_sim_time");if(st)CFG.simulateTime=st}catch(e){}
try{if(localStorage.getItem("tvv_demo")==="1")CFG.demoMode=true}catch(e){}
function pad2(n){return String(n).padStart(2,"0")}
function parseHM(s){const[h,m]=String(s).split(":").map(Number);return(h||0)*60+(m||0)}
function fmtHM(mins){const m=((mins%1440)+1440)%1440;return pad2(Math.floor(m/60))+":"+pad2(m%60)}
function nowDate(){
  if(CFG.simulateTime){const d=new Date(),[h,m]=String(CFG.simulateTime).split(":").map(Number);d.setHours(h||0,m||0,0,0);return d}
  return new Date();
}
function todayDow(d=nowDate()){const x=d.getDay();return x===0?7:x}
function nowMins(d=nowDate()){return d.getHours()*60+d.getMinutes()}
function buildDemoTimetable(){
  const base=nowMins(),day=todayDow();
  return[
    {day,start:fmtHM(base+1),end:fmtHM(base+8),subject:"math",type:"lesson",title:"Toán (demo)"},
    {day,start:fmtHM(base+9),end:fmtHM(base+16),subject:"van",type:"lesson",title:"Ngữ văn (demo)"},
    {day,start:fmtHM(base+17),end:fmtHM(base+24),subject:"eng",type:"exam",examId:"thi_anh_1",title:"Thi Tiếng Anh (demo)"},
    {day,start:fmtHM(base+25),end:fmtHM(base+32),subject:"math",type:"exam",examId:"thi_toan_1",title:"Thi Toán (demo)"}
  ];
}
// Lịch DEMO dựng 1 lần/buổi chơi (không dựng lại mỗi giây — nếu không key tiết
// sẽ đổi liên tục và game báo chuông + dẫn bé về lớp mỗi phút).
let _demoTable=null;
function activeTimetable(){
  if(!CFG.demoMode)return CFG.timetable||[];
  if(!_demoTable)_demoTable=buildDemoTimetable();
  return _demoTable;
}
function periodKey(p){return[p.day,p.start,p.end,p.subject,p.type,p.examId||""].join("|")}
function periodsForDay(day){return activeTimetable().filter(p=>(p.days||[p.day]).includes(day)).sort((a,b)=>parseHM(a.start)-parseHM(b.start))}
function findCurrentPeriod(){
  const day=todayDow(),now=nowMins(),early=CFG.earlyMinutes||0,grace=CFG.graceMinutes||0;
  return periodsForDay(day).find(p=>{
    const s=parseHM(p.start)-early,e=parseHM(p.end)+grace;
    return now>=s&&now<e;
  })||null;
}
function findNextPeriod(){
  const day=todayDow(),now=nowMins();
  const today=periodsForDay(day).find(p=>parseHM(p.start)>now);
  if(today)return today;
  for(let i=1;i<=7;i++){const d=((day-1+i)%7)+1;const list=periodsForDay(d);if(list.length)return Object.assign({},list[0],{_futureDay:d})}
  return null;
}
function periodInSession(p){
  if(!p)return false;
  const day=todayDow(),now=nowMins();
  if(!(p.days||[p.day]).includes(day))return false;
  return now>=parseHM(p.start)-(CFG.earlyMinutes||0)&&now<parseHM(p.end)+(CFG.graceMinutes||0);
}
let _lastPeriodKey="",_notifiedKeys={};
function canStartLesson(type,{force}={}){
  if(force||!CFG.requireOnTimeForLesson)return true;
  const cur=findCurrentPeriod();
  if(cur&&cur.subject===type&&cur.type==="lesson"&&periodInSession(cur))return true;
  if(CFG.allowFreePractice)return true;
  toast("⏰ Chưa đến giờ học "+(SUB_LABEL[type]||type)+" theo TKB!");
  return false;
}
function canStartExam(ex,{force}={}){
  if(force||!CFG.requireOnTimeForLesson)return true;
  const cur=findCurrentPeriod();
  if(cur&&cur.type==="exam"&&(cur.examId===ex.id||cur.subject===ex.subject)&&periodInSession(cur))return true;
  if(CFG.allowFreePractice)return true;
  toast("⏰ Bài thi này chưa đến giờ theo thời khóa biểu!");
  return false;
}
/* Tới giờ: đưa tiết hiện tại vào PEND rồi tự dẫn bé về lớp.
   Bé ngồi vào bàn (world.js seatAt) là học/thi bắt đầu luôn — không bấm gì cả. */
function startPeriodActivity(p,{force}={}){
  if(!p)return;
  PEND=p;
  if(sc!="room"||rk!=p.subject)go("room",500,545,p.subject);
  toast(p.type==="exam"?"📝 Ngồi vào bàn là bài thi bắt đầu!":"📖 Ngồi vào bàn là học luôn nhé!");
}
function tickSchedule(){
  const d=nowDate(),hm=pad2(d.getHours())+":"+pad2(d.getMinutes())+":"+pad2(d.getSeconds());
  const cur=findCurrentPeriod(),nxt=findNextPeriod();
  let line="🕒 "+hm+" · "+DAY_NAME[todayDow(d)];
  if(CFG.demoMode)line+=" · DEMO";
  if(CFG.simulateTime)line+=" · giả lập";
  if(cur)line+=" · 🔔 "+cur.title+" ("+cur.start+"–"+cur.end+")";
  else if(nxt)line+=" · tiếp: "+nxt.title+" "+nxt.start+(nxt._futureDay?" "+DAY_NAME[nxt._futureDay]:"");
  $("clk").textContent=line;
  const bel=$("bell");
  if(cur){bel.style.display="block";bel.textContent=(cur.type==="exam"?"📝 ":"📖 ")+"Đang giờ: "+cur.title+" · vào lớp "+(SUB_LABEL[cur.subject]||"")+"!"}
  else bel.style.display="none";
  const key=cur?periodKey(cur):"";
  if(key&&key!==_lastPeriodKey){
    _lastPeriodKey=key;
    if(!_notifiedKeys[key]){
      _notifiedKeys[key]=1;
      toast((cur.type==="exam"?"📝 Đến giờ thi: ":"🔔 Đến giờ học: ")+cur.title);
      if(CFG.autoEnterClass&&!open_&&!climb){
        PEND=cur;
        if(sc!="room"||rk!=cur.subject)go("room",500,545,cur.subject);
        toast("🪑 Ngồi vào bàn là bắt đầu ngay!");
      }
    }
  }
  if(!cur){_lastPeriodKey="";PEND=null}
  // Vào lớp giữa giờ: vẫn còn thời gian thì chờ bé ngồi vào bàn
  else if(!PEND&&!_doneKeys[key]&&!open_&&!climb&&sc=="room"&&rk==cur.subject&&periodInSession(cur))PEND=cur;
  // báo trước
  if(!cur&&nxt&&!nxt._futureDay){
    const left=parseHM(nxt.start)-nowMins();
    const nk="pre:"+periodKey(nxt);
    if(left>0&&left<=(CFG.notifyBeforeMinutes||2)&&!_notifiedKeys[nk]){
      _notifiedKeys[nk]=1;
      toast("⏳ Sắp đến giờ "+nxt.title+" ("+nxt.start+")");
    }
  }
}
function showSchedule(){
  if(open_)return;
  const day=todayDow(),list=periodsForDay(day),cur=findCurrentPeriod(),nxt=findNextPeriod();
  const rows=list.length?list.map(p=>{
    const cls=cur&&periodKey(cur)===periodKey(p)?"now":(nxt&&periodKey(nxt)===periodKey(p)?"next":"");
    return`<tr class="${cls}"><td>${p.start}–${p.end}</td><td>${p.title}</td><td><span class="tag ${p.type==="exam"?"exam":""}">${p.type==="exam"?"Thi":"Học"}</span></td></tr>`;
  }).join(""):`<tr><td colspan="3">Hôm nay không có tiết (xem các ngày khác bên dưới)</td></tr>`;
  const week=[1,2,3,4,5].map(d=>{
    const ps=periodsForDay(d);
    return`<p style="text-align:left;margin:6px 0 2px;font-weight:800">${DAY_NAME[d]}${d===day?" ← hôm nay":""}</p>`+
      (ps.length?`<table class="ttab"><tbody>${ps.map(p=>`<tr><td>${p.start}</td><td>${p.title}</td><td>${p.type==="exam"?"📝":"📖"}</td></tr>`).join("")}</tbody></table>`:"<p style='font-size:12px;color:#666'>Nghỉ</p>");
  }).join("");
  modal(`<h2>📅 Thời khóa biểu</h2>
<p style="font-size:13px">Giờ máy: <b>${pad2(nowDate().getHours())}:${pad2(nowDate().getMinutes())}</b> · ${DAY_NAME[day]}${CFG.demoMode?" · <b>DEMO</b>":""}${CFG.simulateTime?" · giả lập "+CFG.simulateTime:""}</p>
${cur?`<p style="background:#fff3c4;padding:8px;border-radius:12px;font-weight:800">🔔 Đang học: ${cur.title} (${cur.start}–${cur.end})</p><button class="btn" id="joinNow">Vào học ngay</button>`:nxt?`<p>Tiết tiếp: <b>${nxt.title}</b> lúc ${nxt.start}${nxt._futureDay?" ("+DAY_NAME[nxt._futureDay]+")":""}</p>`:""}
<h3 style="margin:10px 0 4px;font-size:16px">Hôm nay</h3>
<table class="ttab"><thead><tr><th>Giờ</th><th>Môn</th><th>Loại</th></tr></thead><tbody>${rows}</tbody></table>
<details style="text-align:left;margin-top:8px"><summary style="font-weight:800;cursor:pointer">Cả tuần</summary>${week}</details>
<p style="font-size:11px;color:#666;margin-top:8px">Sửa lịch trong <code>data/schedule.js</code>. Bật demo: localStorage <code>tvv_demo=1</code>. Giả lập giờ: <code>tvv_sim_time="08:00"</code>.</p>
<button class="btn" id="togDemo" style="background:#bfe6ff;box-shadow:0 3px 0 #8ab">${CFG.demoMode?"Tắt DEMO":"Bật DEMO thử lịch"}</button>
<button class="btn" id="b3" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>`);
  if($("joinNow"))$("joinNow").onclick=()=>{close_();startPeriodActivity(cur,{force:true})};
  $("togDemo").onclick=()=>{
    CFG.demoMode=!CFG.demoMode;
    _demoTable=null;
    try{localStorage.setItem("tvv_demo",CFG.demoMode?"1":"0")}catch(e){}
    _notifiedKeys={};_lastPeriodKey="";
    close_();showSchedule();
    toast(CFG.demoMode?"🧪 DEMO: tiết sẽ bắt đầu sau ~1 phút":"Đã dùng thời khóa biểu thật");
  };
  $("b3").onclick=close_;
}
