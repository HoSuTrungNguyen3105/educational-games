// ===== CONFIG: địa điểm sân trường, các lớp học, bàn ghế, NPC, cửa hàng, nhiệm vụ ngày =====
const P=[
{id:"shop",n:"🛍️ Cửa hàng",x:2600,y:220,w:320,h:260,c:"#f08fb0",r:"#c4437a",b:1},
{id:"can",n:"🍔 Nhà ăn",x:200,y:1240,w:420,h:330,c:"#f5d76e",r:"#d4a017",b:1},
{id:"garden",n:"🌸 Vườn trường",x:760,y:1240,w:520,h:400,c:"#9be07a",lv:1},
{id:"pet",n:"🐾 Vườn thú cưng",x:1820,y:1240,w:560,h:400,c:"#ffe082",lv:1},
{id:"gym",n:"🏃 Sân thể thao",x:2520,y:1240,w:480,h:400,c:"#a5d6a7",lv:2}];
const RM={math:{n:"Lớp Toán",f:"#eed9a8",b:"Hôm nay: Phép nhân ×",t:"Cô Hoa",c:"#ff6b9d",e:"🧮"},eng:{n:"Lớp Tiếng Anh",f:"#cfe6f7",b:"Good morning, class!",t:"Thầy Nam",c:"#4a90e2",e:"🔤"},sci:{n:"Phòng Khoa học",f:"#d6f0d9",b:"H₂O  •  CO₂  •  O₂",t:"Cô Lan",c:"#2fb583",e:"🧪"},van:{n:"Lớp Ngữ văn",f:"#f3d9e6",b:"Từ đồng nghĩa - trái nghĩa",t:"Thầy Minh",c:"#a55eea",e:"📖"},lib:{n:"Thư viện",f:"#f7ecd2",b:"📚 Đọc sách mỗi ngày!",t:"Chú Thủ thư",c:"#e67e22",e:"📚"}};
const KS=["math","eng","sci","van"],DX={math:300,eng:650,sci:1000,van:1350,lib:520};
const KS2=["lib"]; // các phòng ở tầng 2
// 10 bàn học (2 hàng × 5 bàn) — cả 10 chỗ đều có bạn ngồi
const desks=[];for(let j=0;j<2;j++)for(let i=0;i<5;i++)desks.push([110+i*170,320+j*100]);
const cols=["#ff6b9d","#6bcbff","#b28dff","#7be0a0","#ffd23f","#ff8a5b","#4ecdc4","#e84393","#f368e0","#00d2d3","#ff9f43","#54a0ff","#10ac84","#a55eea"];
const nm=["Mít","Bơ","Na","Su","Kem","Bin","Mun","Tôm","Đậu","Cà","Ớt","Xoài","Bí","Mía"];
const hs=["🎓","🎀","🧢","🌸","","👑","","🎓","🎀","🧢","","🌸","👑",""];
const studs=desks.map((d,i)=>({x:d[0]+45,y:d[1]+14,c:cols[i%cols.length],n:nm[i],on:i!=2&&i!=5&&i!=8}));
// 14 bạn học sinh chạy khắp sân + hành lang (sân mới rộng 3200 x 2000)
const npcs=nm.map((n,i)=>({
 n,sc:i<8?"out":i<12?"hall":"out",
 b:i<8?[240,640,2960,1180]:[150,215,1400,170],
 x:300+Math.random()*2600,y:i<8?680+Math.random()*480:260+Math.random()*100,
 tx:0,ty:0,c:cols[i],h:hs[i],say:0,t:Math.random()*5,mv:0
}));
const hatShop=[["",0],["🎓",30],["🎀",40],["🧢",30],["🌸",50],["👑",120]],colShop=[["#ff9f43",0],["#54a0ff",20],["#ee5a6f",20],["#10ac84",20],["#a55eea",20],["#2d3436",35]];
const QU=[{k:"math",t:"Đúng 5 bài Toán",n:5,c:40,g:1},{k:"eng",t:"Học 5 từ Tiếng Anh",n:5,c:40,g:1},{k:"sci",t:"Đúng 5 câu Khoa học",n:5,c:50,g:2},{k:"van",t:"Đúng 5 câu Ngữ văn",n:5,c:50,g:2},{k:"flower",t:"Thu hoạch 6 cây trồng",n:6,c:60,g:2},{k:"read",t:"Đọc 3 truyện Thư viện",n:3,c:40,g:1},{k:"exam",t:"Thi đạt ≥80%",n:1,c:60,g:2},{k:"chat",t:"Nói chuyện 3 bạn",n:3,c:30,g:1},{k:"pet",t:"Chăm sóc thú cưng 5 lần",n:5,c:50,g:2}];
