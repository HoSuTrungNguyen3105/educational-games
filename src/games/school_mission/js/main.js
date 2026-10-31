// ===== MAIN: khởi động và vòng lặp game =====
$("cfg").onclick=cfg;$("sched").onclick=showSchedule;loadData();
$("quit").onclick=function(){try{if(window.parent!==window)window.parent.postMessage({type:"quit"},"*");else history.back()}catch(e){}};
if($("btn-garden"))$("btn-garden").onclick=function(){if(window.garden)window.garden()};
if($("btn-pet"))$("btn-pet").onclick=function(){if(window.petGarden)window.petGarden()};
initSchoolSync();
// lớp 3D; thất bại (thiếu ba.js, máy chặn WebGL) thì chơi bằng vẽ 2D
try{W3=startW3()}catch(e){W3=null;console.warn("Không bật được 3D, chuyển sang vẽ 2D:",e)}
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;upd(dt);draw(dt);requestAnimationFrame(loop)}
requestAnimationFrame(loop);setInterval(save,5000);setInterval(tickSchedule,1000);tickSchedule();
toast(CFG.demoMode?"🧪 DEMO TKB bật — tiết sắp bắt đầu!":"📅 Xem Thời khóa biểu · học đúng giờ thật nhé!");
