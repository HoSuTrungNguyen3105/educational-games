// ===== CORE: canvas, hàm tiện ích $ và sh (xáo trộn), tự co giãn màn hình =====
const cv=document.getElementById("c"),g=cv.getContext("2d");
const $=id=>document.getElementById(id);
let W=0,H=0,dpr=1;
function rs(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr}
addEventListener("resize",rs);rs();
const sh=a=>a.map(x=>x).sort(()=>Math.random()-.5);
