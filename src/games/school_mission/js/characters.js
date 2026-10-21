// ===== CHARACTERS: hàm vẽ cơ bản và vẽ nhân vật =====
function rr(x,y,w,h,r,c){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill()}
function rg(x,y,w,h,r,c){rr(x,y,w,h,r,c);const l=g.createLinearGradient(0,y,0,y+h);l.addColorStop(0,"rgba(255,255,255,.18)");l.addColorStop(1,"rgba(0,0,0,.2)");rr(x,y,w,h,r,l)}
function tx(s,x,y,sz,c,st){g.font=`bold ${sz}px system-ui`;g.textAlign="center";if(st){g.strokeStyle=st;g.lineWidth=3;g.strokeText(s,x,y)}g.fillStyle=c;g.fillText(s,x,y)}
function chr(x,y,c,hat,name,t,say,mv){const sw=Math.sin(t)*mv,bn=Math.abs(Math.sin(t))*3*mv;
 g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.ellipse(x,y,17,6,0,0,7);g.fill();
 rg(x-9,y-12-Math.max(0,sw)*4,8,12,3,"#3b4a7a");rg(x+1,y-12-Math.max(0,-sw)*4,8,12,3,"#3b4a7a");
 rg(x-17,y-31-bn+sw*3,7,17,3,"#ffe0bd");rg(x+10,y-31-bn-sw*3,7,17,3,"#ffe0bd");
 rg(x-12,y-33-bn,24,26,9,c);g.fillStyle="rgba(255,255,255,.5)";g.fillRect(x-4,y-33-bn,8,5);
 g.fillStyle="#ffe0bd";g.strokeStyle="rgba(120,70,40,.5)";g.lineWidth=1.5;g.beginPath();g.arc(x,y-43-bn,16,0,7);g.fill();g.stroke();
 g.fillStyle="#4a3426";g.beginPath();g.arc(x,y-48-bn,16,Math.PI*1.02,Math.PI*1.98);g.lineTo(x+12,y-46-bn);g.quadraticCurveTo(x,y-54-bn,x-12,y-46-bn);g.fill();
 g.fillStyle="#222";g.beginPath();g.ellipse(x-6,y-42-bn,2.4,3.2,0,0,7);g.ellipse(x+6,y-42-bn,2.4,3.2,0,0,7);g.fill();g.fillStyle="#fff";g.beginPath();g.arc(x-5.3,y-43.3-bn,1,0,7);g.arc(x+6.7,y-43.3-bn,1,0,7);g.fill();
 g.fillStyle="rgba(255,100,120,.45)";g.beginPath();g.arc(x-10,y-37-bn,3.2,0,7);g.arc(x+10,y-37-bn,3.2,0,7);g.fill();
 g.strokeStyle="#c0504d";g.lineWidth=1.6;g.beginPath();g.arc(x,y-38-bn,3.5,.2,Math.PI-.2);g.stroke();
 if(hat){g.font="24px serif";g.textAlign="center";g.fillText(hat,x,y-56-bn)}
 tx(name,x,y-74-bn,12,"#fff","rgba(0,0,0,.6)");
 if(say){g.font="bold 12px system-ui";const w=g.measureText(say).width+18;rr(x-w/2,y-104-bn,w,24,12,"#fff");g.fillStyle="#fff";g.beginPath();g.moveTo(x-5,y-81-bn);g.lineTo(x+5,y-81-bn);g.lineTo(x,y-75-bn);g.fill();tx(say,x,y-87-bn,12,"#223")}}
// ---- trang trí sân ----
