// ===== INPUT: bàn phím WASD + joystick cảm ứng + nút tương tác =====
$("act").onclick=act;
const keys={};addEventListener("keydown",e=>{if(e.target.tagName=="TEXTAREA")return;keys[e.key.toLowerCase()]=1;if(e.key=="e"||e.key==" ")act()});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);
let jx=0,jy=0,jid=null;const joy=$("joy"),kn=$("knob");
function jm(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+60),dy=e.clientY-(r.top+60),d=Math.hypot(dx,dy)||1,m=Math.min(d,45);jx=dx/d*m/45;jy=dy/d*m/45;kn.style.transform=`translate(${jx*45}px,${jy*45}px)`}
joy.addEventListener("pointerdown",e=>{jid=e.pointerId;joy.setPointerCapture(jid);jm(e)});joy.addEventListener("pointermove",e=>{if(e.pointerId==jid)jm(e)});
const je=()=>{jid=null;jx=jy=0;kn.style.transform=""};joy.addEventListener("pointerup",je);joy.addEventListener("pointercancel",je);
