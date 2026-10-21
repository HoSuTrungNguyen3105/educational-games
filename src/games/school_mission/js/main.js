// ===== MAIN: khởi động và vòng lặp game =====
$("cfg").onclick=cfg;$("sched").onclick=showSchedule;loadData();
$("quit").onclick=function(){try{if(window.parent!==window)window.parent.postMessage({type:"quit"},"*");else history.back()}catch(e){}};
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;upd(dt);draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);setInterval(save,5000);setInterval(tickSchedule,1000);tickSchedule();
toast(CFG.demoMode?"🧪 DEMO TKB bật — tiết sắp bắt đầu!":"📅 Xem Thời khóa biểu · học đúng giờ thật nhé!");
