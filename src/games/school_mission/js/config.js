// ===== CONFIG: địa điểm sân trường, các lớp học, bàn ghế, NPC, cửa hàng, nhiệm vụ ngày =====
const P=[
{id:"shop",n:"🛍️ Cửa hàng",x:1400,y:130,w:220,h:200,c:"#f08fb0",r:"#c4437a",b:1},
{id:"can",n:"🍔 Căng tin",x:120,y:700,w:260,h:200,c:"#f5d76e",r:"#d4a017",b:1},
{id:"garden",n:"🌸 Vườn trường",x:480,y:680,w:340,h:300,c:"#9be07a",lv:2},
{id:"gym",n:"🏃 Sân thể thao",x:1000,y:680,w:400,h:300,c:"#f4a261",lv:3}];
const RM={math:{n:"Lớp Toán",f:"#eed9a8",b:"Hôm nay: Phép nhân ×",t:"Cô Hoa",c:"#ff6b9d",e:"🧮"},eng:{n:"Lớp Tiếng Anh",f:"#cfe6f7",b:"Good morning, class!",t:"Thầy Nam",c:"#4a90e2",e:"🔤"},sci:{n:"Phòng Khoa học",f:"#d6f0d9",b:"H₂O  •  CO₂  •  O₂",t:"Cô Lan",c:"#2fb583",e:"🧪"},van:{n:"Lớp Ngữ văn",f:"#f3d9e6",b:"Từ đồng nghĩa - trái nghĩa",t:"Thầy Minh",c:"#a55eea",e:"📖"}};
const KS=["math","eng","sci","van"],DX={math:300,eng:650,sci:1000,van:1350};
const desks=[];for(let j=0;j<2;j++)for(let i=0;i<4;i++)desks.push([190+i*180,320+j*100]);
const studs=desks.map((d,i)=>({x:d[0]+45,y:d[1]+14,c:["#ff6b9d","#6bcbff","#b28dff","#7be0a0","#ffd23f","#ff8a5b","#4ecdc4","#e84393"][i],n:["Mít","Bơ","Na","Su","Kem","Bin","Mun","Tôm"][i],on:i!=2&&i!=5}));
const cols=["#ff6b9d","#6bcbff","#b28dff","#7be0a0","#ffd23f","#ff8a5b","#4ecdc4","#e84393"],nm=["Mít","Bơ","Na","Su","Kem","Bin","Mun","Tôm"],hs=["🎓","🎀","🧢","🌸","","👑",""];
const npcs=nm.map((n,i)=>({n,sc:i<5?"out":"hall",b:i<5?[300,470,1500,670]:[150,230,1550,380],x:400+Math.random()*900,y:i<5?520:300,tx:0,ty:0,c:cols[i],h:hs[i],say:0,t:Math.random()*5,mv:0}));
const hatShop=[["",0],["🎓",30],["🎀",40],["🧢",30],["🌸",50],["👑",120]],colShop=[["#ff9f43",0],["#54a0ff",20],["#ee5a6f",20],["#10ac84",20],["#a55eea",20],["#2d3436",35]];
const QU=[{k:"math",t:"Đúng 5 bài Toán",n:5,c:40,g:1},{k:"eng",t:"Học 5 từ Tiếng Anh",n:5,c:40,g:1},{k:"sci",t:"Đúng 5 câu Khoa học",n:5,c:50,g:2},{k:"van",t:"Đúng 5 câu Ngữ văn",n:5,c:50,g:2},{k:"flower",t:"Thu 8 hoa (Lv2)",n:8,c:60,g:2}];
