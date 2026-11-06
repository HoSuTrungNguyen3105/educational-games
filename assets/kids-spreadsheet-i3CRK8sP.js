var e=`<!DOCTYPE html>\r
<html lang="vi">\r
<head>\r
<meta charset="utf-8">\r
<meta name="viewport" content="width=device-width,initial-scale=1">\r
<title>Book1 - Excel</title>\r
<style>\r
:root{--g:#217346;--gd:#185c37;--ga:#217346;--rb:#f3f3f3;--bd:#d4d4d4;--tx:#262626;--cbg:#fff;--cfg:#000;--grid:#d9d9d9;--hbg:#e6e6e6;--hfg:#444;--hsel:#d2d2d2;--hline:#ababab;--hline2:#c6c6c6;--pbg:#fff;--hov:#e1e1e1}\r
.dark{--rb:#2d2d2d;--bd:#444;--tx:#e6e6e6;--cbg:#1e1e1e;--cfg:#e8e8e8;--grid:#383838;--hbg:#2b2b2b;--hfg:#bbb;--hsel:#404040;--hline:#555;--hline2:#454545;--pbg:#383838;--hov:#444;--ga:#5bd19a}\r
*{box-sizing:border-box}\r
[hidden]{display:none!important}\r
html,body{height:100%;margin:0;overflow:hidden}\r
body{font:12px "Segoe UI",Calibri,Carlito,system-ui,-apple-system,sans-serif;color:var(--tx);background:var(--cbg);user-select:none;-webkit-user-select:none}\r
input,textarea{user-select:text;-webkit-user-select:text}\r
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:default}\r
svg{display:block}\r
#app{display:flex;flex-direction:column;height:100%}\r
\r
#title{height:30px;background:var(--g);color:#fff;display:flex;align-items:center;justify-content:space-between;flex:none}\r
.qat{display:flex;gap:2px;padding-left:8px;width:200px}\r
.qat button{width:26px;height:26px;display:grid;place-items:center;border-radius:2px}\r
.qat svg{width:16px;height:16px}\r
.qat button:hover,.wc button:hover{background:rgba(255,255,255,.18)}\r
.ttl{font-size:12px;text-align:center;white-space:nowrap}\r
.wc{display:flex;width:200px;justify-content:flex-end}\r
.wc button{width:46px;height:30px;font-size:13px}\r
.wc .x:hover{background:#e81123}\r
\r
#tabs{height:28px;background:var(--g);display:flex;align-items:flex-end;flex:none;color:#fff;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}
#tabs::-webkit-scrollbar{display:none}\r
.tab{height:28px;padding:0 12px;font-size:12px;color:#fff;white-space:nowrap;flex:none}\r
.tab.file{background:var(--gd);padding:0 20px;margin-right:4px}\r
.tab.file:hover{background:#134a2c}\r
.tab:hover:not(.on):not(.file){background:rgba(255,255,255,.15)}\r
.tab.on{background:var(--rb);color:var(--ga)}\r
.tell{margin-left:auto;display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;color:#fff;font-size:12px}\r
.tell input{background:transparent;border:0;outline:0;color:#fff;width:200px;font:inherit}\r
.tell input::placeholder{color:rgba(255,255,255,.85)}\r
.tell svg{width:14px;height:14px}\r
.share{height:22px;margin:0 10px 3px 4px;padding:0 12px;border:1px solid rgba(255,255,255,.7);border-radius:2px;color:#fff}\r
\r
#ribbon{background:var(--rb);border-bottom:1px solid var(--bd);height:94px;display:flex;padding:3px 4px 0;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;flex:none}\r
#ribbon.hide{display:none}\r
.grp{display:flex;flex-direction:column;padding:0 5px;border-right:1px solid var(--bd);flex:none}\r
.gc{flex:1;display:flex;gap:2px;align-items:flex-start;padding-top:2px}\r
.gl{height:18px;text-align:center;font-size:11px;color:var(--hfg);white-space:nowrap}\r
.col{display:flex;flex-direction:column;gap:2px}\r
.row{display:flex;gap:1px;align-items:center}\r
.bb{min-width:46px;height:68px;display:flex;flex-direction:column;align-items:center;padding:3px 5px;gap:3px;text-align:center;font-size:11px;line-height:1.15;border:1px solid transparent;border-radius:2px;max-width:92px}\r
.bb svg{width:32px;height:32px;flex:none}\r
.sb{height:22px;display:flex;align-items:center;gap:5px;padding:0 5px;font-size:11px;white-space:nowrap;border:1px solid transparent;border-radius:2px}\r
.sb svg{width:16px;height:16px;flex:none}\r
.ib{width:24px;height:22px;display:grid;place-items:center;border:1px solid transparent;border-radius:2px;font-size:13px}\r
.bb:hover,.sb:hover,.ib:hover{background:var(--hov);border-color:var(--hline2)}\r
.bb.on,.sb.on,.ib.on{background:#c6dccf;border-color:#8fb9a2}\r
.dark .bb.on,.dark .sb.on,.dark .ib.on{background:#245c40}\r
#ribbon select{height:22px;font-size:12px;border:1px solid var(--hline2);background:var(--pbg);color:var(--tx);border-radius:0}\r
.ckl{display:flex;align-items:center;gap:5px;font-size:11px;height:22px;white-space:nowrap}\r
.clr{position:relative;width:34px;height:22px;display:grid;place-items:center;border:1px solid transparent}\r
.clr:hover{background:var(--hov);border-color:var(--hline2)}\r
.clr span{font-weight:700;font-size:13px;line-height:13px}\r
.clr i{display:block;width:14px;height:3px;background:#c00}\r
.clr input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:default}\r
\r
#fbar{height:24px;display:flex;align-items:center;background:var(--cbg);border-bottom:1px solid var(--bd);flex:none}\r
#nb{width:92px;height:22px;border:1px solid var(--hline2);margin:0 4px;padding:0 4px;font:12px "Segoe UI",Calibri,sans-serif;background:var(--pbg);color:var(--tx);outline:0}\r
#nb:focus{border-color:var(--g)}\r
.fbtn{display:flex;align-items:center;gap:8px;padding:0 8px;color:#888;font-size:13px;border-left:1px solid var(--bd);height:100%}\r
.fbtn .fx{font-style:italic;font-family:Georgia,serif;color:var(--hfg)}\r
#fi{flex:1;height:22px;border:1px solid var(--hline2);border-left:0;padding:0 6px;font:13px Calibri,Carlito,"Segoe UI",sans-serif;background:var(--pbg);color:var(--tx);outline:0;min-width:0}\r
\r
#gw{position:relative;flex:1;min-height:0;background:var(--cbg);--hw:40px;--hh:20px;--hfs:13px;--rhpx:20px;--cw:64px;--pad:3px}\r
#corner{position:absolute;left:0;top:0;width:var(--hw);height:var(--hh);background:var(--hbg);border-right:1px solid var(--hline);border-bottom:1px solid var(--hline);z-index:3}\r
#corner:after{content:"";position:absolute;right:3px;bottom:3px;border:solid transparent;border-width:0 0 9px 9px;border-bottom-color:#b4b4b4}\r
#ch{position:absolute;left:var(--hw);top:0;right:0;height:var(--hh);overflow:hidden;background:var(--hbg);border-bottom:1px solid var(--hline)}\r
#colin{display:flex;height:100%;will-change:transform}\r
#colin div{flex:none;display:grid;place-items:center;border-right:1px solid var(--hline2);color:var(--hfg);font-size:var(--hfs);font-family:Calibri,Carlito,"Segoe UI",sans-serif}\r
#colin div.sel{background:var(--hsel);color:var(--ga);border-bottom:2px solid var(--g)}\r
#rh{position:absolute;left:0;top:var(--hh);bottom:0;width:var(--hw);overflow:hidden;background:var(--hbg);border-right:1px solid var(--hline)}\r
#rowin{position:relative;will-change:transform}\r
#rowin div{position:absolute;left:0;width:100%;height:var(--rhpx);display:grid;place-items:center;border-bottom:1px solid var(--hline2);color:var(--hfg);font-size:var(--hfs);font-family:Calibri,Carlito,"Segoe UI",sans-serif}\r
#rowin div.sel{background:var(--hsel);color:var(--ga);border-right:2px solid var(--g)}\r
#sc{position:absolute;left:var(--hw);top:var(--hh);right:0;bottom:0;overflow:scroll;background:var(--cbg)}\r
#sizer{position:relative}\r
#rows{position:absolute;inset:0;color:var(--cfg);overflow:hidden}\r
.r{position:absolute;left:0;width:100%;height:var(--rhpx);border-bottom:1px solid var(--grid);background:linear-gradient(to left,var(--grid) 1px,transparent 1px) 0 0/var(--cw) 100% repeat-x}\r
.nogrid .r{background:none;border-bottom-color:transparent}\r
.t{position:absolute;top:0;white-space:pre;padding:0 var(--pad);line-height:calc(var(--rhpx) - 1px)}\r
.t.clip{overflow:hidden}\r
.t.rt{text-align:right}\r
.fill{position:absolute;top:0;height:100%}\r
#sel{position:absolute;border:2px solid var(--g);pointer-events:none;z-index:2}\r
#sel:after{content:"";position:absolute;right:-5px;bottom:-5px;width:6px;height:6px;background:var(--g);border:1px solid var(--cbg)}\r
\r
#stabs{height:26px;background:var(--rb);border-top:1px solid var(--bd);display:flex;align-items:stretch;flex:none;overflow:hidden}\r
.nav{display:flex;align-items:center;padding:0 4px;gap:2px;flex:none}\r
.nav button{width:18px;height:18px;color:#777;font-size:9px;border-radius:2px}\r
.nav button:hover{background:var(--hov)}\r
#tlist{display:flex;overflow:hidden;max-width:calc(100% - 140px)}\r
.st{flex:none;max-width:150px;padding:0 14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;border-right:1px solid var(--bd);color:var(--tx)}\r
.st:hover:not(.on){background:var(--hov)}\r
.st.on{background:var(--cbg);color:var(--ga);font-weight:600;border-bottom:2px solid var(--g)}\r
.st input{width:100px;font:inherit;border:1px solid var(--g);outline:0;padding:0 2px;background:var(--pbg);color:var(--tx)}\r
#tadd{width:26px;display:grid;place-items:center;font-size:18px;color:#666;flex:none}\r
#tadd:hover{background:var(--hov)}\r
\r
#status{height:22px;background:var(--g);color:#fff;display:flex;align-items:center;padding:0 8px;gap:14px;font-size:12px;flex:none}\r
#status .sp{flex:1}\r
#prog{opacity:.85}\r
.vw{display:flex;gap:2px}\r
.vw span{width:22px;height:18px;display:grid;place-items:center}\r
.vw span:first-child{background:rgba(255,255,255,.28)}\r
.vw i{display:block;width:12px;height:10px;border:1px solid #fff}\r
.zm{display:flex;align-items:center;gap:6px}\r
.zm button{font-size:16px;line-height:14px;width:16px;color:#fff}\r
#zr{-webkit-appearance:none;appearance:none;width:100px;height:2px;background:rgba(255,255,255,.75);outline:0;margin:0}\r
#zr::-webkit-slider-thumb{-webkit-appearance:none;width:6px;height:14px;background:#fff;border:1px solid #777}\r
#zr::-moz-range-thumb{width:6px;height:14px;background:#fff;border:1px solid #777;border-radius:0}\r
#zp{width:36px;text-align:right}\r
\r
#ovl{position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center}\r
#ovl.ml{pointer-events:none;align-items:flex-start;justify-content:flex-end;padding:140px 30px}\r
.dlg{pointer-events:auto;background:var(--pbg);color:var(--tx);border:1px solid #6d6d6d;box-shadow:0 6px 24px rgba(0,0,0,.35);min-width:340px;max-width:92vw}\r
.dh{display:flex;justify-content:space-between;align-items:center;height:30px;padding-left:10px;background:var(--pbg);font-size:12px}\r
.dx{width:46px;height:30px;font-size:13px}\r
.dx:hover{background:#e81123;color:#fff}\r
.db{padding:6px 14px 12px;font-size:12px}\r
.db p{margin:0 0 8px}\r
.db textarea{width:100%;height:220px;resize:vertical;font:13px Calibri,Carlito,sans-serif;border:1px solid #999;padding:4px;background:var(--pbg);color:var(--tx)}\r
.db input[type=text]{width:100%;height:23px;border:1px solid #999;padding:0 4px;background:var(--pbg);color:var(--tx);font:12px "Segoe UI",sans-serif}\r
.db select{width:100%;border:1px solid #999;background:var(--pbg);color:var(--tx);font:13px Calibri,Carlito,sans-serif}\r
.db label{display:flex;align-items:center;gap:6px;margin-top:8px}\r
.df{display:flex;justify-content:flex-end;gap:8px;padding:0 14px 14px}\r
.df button{min-width:78px;height:24px;border:1px solid #adadad;background:#e1e1e1;color:#222}\r
.df button:hover{background:#e5f1fb;border-color:#0078d7}\r
.df button.pri{border:2px solid #0078d7}\r
.big{width:560px}\r
.fres{color:#a33;min-height:16px;margin-top:6px}\r
.ctx{position:fixed;z-index:60;background:var(--pbg);border:1px solid #c6c6c6;box-shadow:2px 3px 6px rgba(0,0,0,.3);padding:2px;min-width:160px}\r
.ctx div{padding:5px 26px}\r
.ctx div:hover{background:var(--hov)}\r
.ctx div.dis{color:#999;pointer-events:none}\r
\r
#bs{position:fixed;left:0;right:0;top:30px;bottom:0;z-index:30;display:flex;background:var(--cbg)}\r
#bs nav{width:230px;background:var(--gd);color:#fff;display:flex;flex-direction:column;padding-top:6px}\r
#bs nav button{text-align:left;padding:12px 28px;font-size:14px}\r
#bs nav button:hover{background:rgba(255,255,255,.14)}\r
#bs nav .back{font-size:20px;padding:6px 20px 14px}\r
#bs section{flex:1;padding:36px 50px;overflow:auto}\r
#bs h1{font-weight:300;font-size:30px;margin:0 0 20px}\r
#bs p{color:var(--hfg);max-width:520px;line-height:1.5}\r
.cards{display:flex;flex-wrap:wrap;gap:14px;margin-top:18px}\r
.card{width:190px;padding:16px;border:1px solid var(--bd);background:var(--rb);text-align:left;font-size:13px;line-height:1.4}\r
.card b{display:block;font-size:14px;margin-bottom:4px;color:var(--ga)}\r
.card:hover{border-color:var(--g);background:var(--hov)}\r
#drop{position:fixed;inset:0;z-index:70;border:3px dashed var(--g);background:rgba(33,115,70,.12);display:grid;place-items:center;font-size:20px;color:var(--g);pointer-events:none}\r
@media(max-width:820px){.tell,.share,.qat,.wc{display:none}#title{justify-content:center}.zm #zr{width:60px}#prog{display:none}}\r
</style>\r
</head>\r
<body>\r
<div id="app">\r
  <div id="title">\r
    <div class="qat">\r
      <button data-act="save" title="Lưu (Ctrl+S)"><svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="2" fill="#fff"/><rect x="9" y="4" width="14" height="9" fill="#217346"/><rect x="9" y="18" width="14" height="10" fill="#cfe3d8"/></svg></button>\r
      <button title="Hoàn tác"><svg viewBox="0 0 32 32"><path d="M6 14h14a7 7 0 010 14h-6M6 14l7-7M6 14l7 7" fill="none" stroke="#fff" stroke-width="3"/></svg></button>\r
      <button title="Làm lại"><svg viewBox="0 0 32 32"><path d="M26 14H12a7 7 0 000 14h6M26 14l-7-7M26 14l-7 7" fill="none" stroke="#fff" stroke-width="3"/></svg></button>\r
    </div>\r
    <div class="ttl">Book1 - Excel</div>\r
    <div class="wc"><button>&#8212;</button><button>&#9633;</button><button class="x">&#10005;</button></div>\r
  </div>\r
  <div id="tabs">\r
    <button class="tab file" data-tab="file">Tệp</button>\r
    <button class="tab on" data-tab="home">Trang đầu</button>\r
    <button class="tab" data-tab="insert">Chèn</button>\r
    <button class="tab" data-tab="layout">Bố trí Trang</button>\r
    <button class="tab" data-tab="formulas">Công thức</button>\r
    <button class="tab" data-tab="data">Dữ liệu</button>\r
    <button class="tab" data-tab="review">Xem lại</button>\r
    <button class="tab" data-tab="view">Xem</button>\r
    <div class="tell"><svg viewBox="0 0 32 32"><path d="M16 3a9 9 0 00-5 16.5V24h10v-4.5A9 9 0 0016 3zM12 27h8" fill="none" stroke="#fff" stroke-width="2.4"/></svg><input id="tellme" placeholder="Cho tôi biết bạn muốn làm gì..."></div>\r
    <button class="share">Chia sẻ</button>\r
  </div>\r
  <div id="ribbon"></div>\r
  <div id="fbar">\r
    <input id="nb" value="A1" spellcheck="false" autocomplete="off">\r
    <div class="fbtn"><span>&#10005;</span><span>&#10003;</span><span class="fx">fx</span></div>\r
    <input id="fi" readonly spellcheck="false">\r
  </div>\r
  <div id="gw">\r
    <div id="corner"></div>\r
    <div id="ch"><div id="colin"></div></div>\r
    <div id="rh"><div id="rowin"></div></div>\r
    <div id="sc"><div id="sizer"><div id="rows"></div><div id="sel"></div></div></div>\r
  </div>\r
  <div id="stabs">\r
    <div class="nav"><button id="tl" title="Cuộn trái (chuột phải: danh sách)">&#9664;</button><button id="tr" title="Cuộn phải (chuột phải: danh sách)">&#9654;</button></div>\r
    <div id="tlist"></div>\r
    <button id="tadd" title="Trang tính mới">+</button>\r
  </div>\r
  <div id="status">\r
    <span id="stmsg">Sẵn sàng</span>\r
    <span id="prog"></span>\r
    <span class="sp"></span>\r
    <div class="vw"><span><i></i></span><span><i style="border-style:dashed"></i></span><span><i style="border-width:1px 1px 1px 3px"></i></span></div>\r
    <div class="zm"><button id="zout">&#8722;</button><input id="zr" type="range" min="25" max="200" step="5" value="100"><button id="zin">+</button><span id="zp">100%</span></div>\r
  </div>\r
</div>\r
\r
<div id="bs" hidden>\r
  <nav>\r
    <button class="back" data-bs="close" title="Quay lại">&#10229;</button>\r
    <button data-bs="new">Mới</button>\r
    <button data-bs="open">Mở</button>\r
    <button data-bs="save">Lưu</button>\r
    <button data-bs="paste">Dán văn bản</button>\r
    <button data-bs="close">Đóng</button>\r
  </nav>\r
  <section>\r
    <h1>Mở</h1>\r
    <p>Chọn tệp truyện để thêm vào sổ làm việc. Mỗi tệp (hoặc mỗi chương nếu bật tự tách chương) sẽ thành một trang tính ở thanh tab phía dưới. Bạn cũng có thể kéo thả tệp vào cửa sổ.</p>\r
    <div class="cards">\r
      <button class="card" data-bs="open"><b>Duyệt tệp</b>.txt .docx .epub .html .xlsx .csv và thư viện .json</button>\r
      <button class="card" data-bs="paste"><b>Dán văn bản</b>Dán nội dung truyện từ clipboard</button>\r
      <button class="card" data-bs="save"><b>Lưu thư viện</b>Xuất toàn bộ truyện và vị trí đang đọc ra tệp .json</button>\r
    </div>\r
  </section>\r
</div>\r
<input type="file" id="fp" multiple hidden accept=".txt,.md,.log,.docx,.epub,.html,.htm,.xhtml,.xlsx,.xls,.csv,.tsv,.json">\r
\r
<script>\r
'use strict';\r
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];\r
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));\r
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));\r
const NCOLS=300,K=1024;\r
const S={sheets:[],active:0,zoom:1,fontPt:11,fam:'Calibri',bold:false,italic:false,color:'',grid:true,head:true,fbar:true,split:true,boss:-1,speed:3,tab:'home'};\r
let D={rh:20,cw:64,fs:14.7};\r
const sc=$('#sc'),sizer=$('#sizer'),rowsEl=$('#rows'),selEl=$('#sel'),colin=$('#colin'),rowin=$('#rowin'),gw=$('#gw');\r
const cx=document.createElement('canvas').getContext('2d');\r
const colName=i=>{let s='';for(i++;i>0;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s};\r
const FF=()=>\`"\${S.fam}", Carlito, "Segoe UI", Arial, sans-serif\`;\r
const cur=()=>S.sheets[S.active];\r
\r
/* favicon */\r
(()=>{const l=document.createElement('link');l.rel='icon';l.href='data:image/svg+xml,'+encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='#217346'/><path d='M9 8l14 16M23 8L9 24' stroke='white' stroke-width='3.6'/></svg>");document.head.appendChild(l)})();\r
\r
/* ---------- sheets ---------- */\r
const mkText=(name,paras)=>({type:'text',name,paras,lines:[],lineP:[],pf:[],key:'',selR:0,selC:0,topL:0,left:0,topP:0,selP:0});\r
const mkGrid=name=>({type:'grid',name,cells:new Map(),maxRow:0,selR:0,selC:0,topL:0,left:0});\r
const nRows=sh=>Math.max(1000,(sh.type==='text'?sh.lines.length:sh.maxRow)+300);\r
function cellObj(sh,r,c){return sh.type==='grid'?sh.cells.get(r*K+c):null}\r
function cellText(sh,r,c){if(sh.type==='text')return c===0?(sh.lines[r]||''):'';const o=cellObj(sh,r,c);return o?o.v:''}\r
function cellFormula(sh,r,c){const o=cellObj(sh,r,c);return o&&o.f?'='+o.f:cellText(sh,r,c)}\r
\r
function sanitize(n){return String(n||'').replace(/[\\[\\]:*?\\/\\\\]/g,' ').replace(/\\s+/g,' ').trim().slice(0,31)}\r
function uniq(name,ignore){\r
  let base=sanitize(name)||'Sheet',n=base,i=2;\r
  const has=x=>S.sheets.some(s=>s!==ignore&&s.name.toLowerCase()===x.toLowerCase());\r
  while(has(n)){const suf=' ('+i++ +')';n=base.slice(0,31-suf.length)+suf}\r
  return n;\r
}\r
function addSheet(sh){S.sheets.push(sh);return S.sheets.length-1}\r
\r
function fakeSheet(){\r
  const sh=mkGrid('Sheet1');sh.isFake=true;\r
  const put=(r,c,v,o)=>{sh.cells.set(r*K+c,Object.assign({v:String(v)},o));sh.maxRow=Math.max(sh.maxRow,r)};\r
  const fmt=n=>n.toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1});\r
  put(0,0,'BÁO CÁO DOANH THU QUÝ 3/2026',{b:1});\r
  put(1,0,'Đơn vị tính: triệu đồng',{i:1,color:'#777'});\r
  ['Mặt hàng','Tháng 7','Tháng 8','Tháng 9','Tổng','Mục tiêu','% KH'].forEach((h,c)=>put(3,c,h,{b:1,fill:'#217346',color:'#fff',num:c>0}));\r
  const items=['Laptop','Chuột','Bàn phím','Màn hình','Tai nghe','Ổ cứng','Webcam','Cáp sạc'];\r
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;\r
  const tot=[0,0,0,0,0];\r
  items.forEach((n,i)=>{\r
    const r=4+i;put(r,0,n);\r
    const v=[0,1,2].map(()=>Math.round((40+rnd()*360)*10)/10);\r
    const t=v[0]+v[1]+v[2],g=Math.round(t*(0.85+rnd()*0.3)*10)/10;\r
    v.forEach((x,k)=>{put(r,1+k,fmt(x),{num:1});tot[k]+=x});\r
    put(r,4,fmt(t),{num:1,f:\`SUM(B\${r+1}:D\${r+1})\`});\r
    put(r,5,fmt(g),{num:1});\r
    put(r,6,Math.round(t/g*100)+'%',{num:1,f:\`E\${r+1}/F\${r+1}\`});\r
    tot[3]+=t;tot[4]+=g;\r
  });\r
  const tr=4+items.length;\r
  put(tr,0,'Tổng cộng',{b:1});\r
  [0,1,2,3,4].forEach((k,i)=>{const L='BCDEF'[i];put(tr,1+i,fmt(tot[k]),{num:1,b:1,f:\`SUM(\${L}5:\${L}\${tr})\`})});\r
  put(tr,6,Math.round(tot[3]/tot[4]*100)+'%',{num:1,b:1,f:\`E\${tr+1}/F\${tr+1}\`});\r
  return sh;\r
}\r
function guideSheet(){\r
  const sh=mkText('Hướng dẫn',[\r
    'HƯỚNG DẪN SỬ DỤNG','',\r
    'Trang tính này trông như Excel nhưng thực chất là trình đọc truyện. Mỗi dòng truyện nằm ở cột A và tràn sang các ô bên cạnh, giống hệt khi gõ chữ vào ô.','',\r
    '1. Nhập truyện: Tệp > Mở, hoặc thẻ Dữ liệu > Từ Văn bản/CSV, hoặc kéo thả tệp vào cửa sổ. Hỗ trợ .txt, .docx, .epub, .html, .xlsx, .csv và thư viện .json.',\r
    '2. Tự tách chương: bật ở thẻ Dữ liệu. Mỗi chương thành một trang tính; chuyển chương bằng Ctrl+PageDown / Ctrl+PageUp.',\r
    '3. Phím Esc: tức thì chuyển về Sheet1 chứa báo cáo giả. Nhấn Esc lần nữa để quay lại đúng chỗ đang đọc.',\r
    '4. Cuộn bằng chuột, phím mũi tên, PageUp/PageDown hoặc phím Space. Thẻ Xem có cuộn tự động và chế độ tối.',\r
    '5. Ctrl+F để tìm trong trang tính (có tùy chọn bỏ qua dấu). Nhập vị trí như A500 vào ô Name Box rồi Enter để nhảy tới dòng đó.',\r
    '6. Thẻ Trang đầu: đổi phông chữ, cỡ chữ, màu chữ. Thu phóng ở góc phải dưới cùng.',\r
    '7. Tự lưu: nội dung và vị trí đang đọc được lưu ngay trên máy, thoát game rồi mở lại vẫn còn. Ctrl+S để xuất thư viện ra tệp .json phòng khi đổi máy.','',\r
    'TRUYỆN MẪU','',\r
    'Chiều cuối thu, ga nhỏ chỉ còn lại một chuyến tàu muộn. Bà bán nước đã dọn gần hết hàng, chỉ giữ lại ấm trà cho người nào lỡ chuyến. Minh ngồi ở băng ghế cuối sân ga, cặp sách đặt trên đùi, mắt nhìn đường ray kéo dài mãi vào sương.',\r
    'Anh đã hứa với mình sẽ không quay lại thành phố này nữa. Vậy mà lá thư ba dòng ấy lại đủ sức kéo anh đi hết một ngày đường.'\r
  ]);\r
  sh.isGuide=true;return sh;\r
}\r
\r
/* ---------- wrap ---------- */\r
function ensureWrap(sh){\r
  if(sh.type!=='text')return;\r
  const cw=sc.clientWidth||window.innerWidth-60;\r
  const maxW=Math.max(160,Math.floor(cw/S.zoom-16));\r
  const key=[S.fontPt,S.fam,S.bold,S.italic,maxW].join('|');\r
  if(sh.key===key)return;\r
  // anchors from old layout\r
  let tp=sh.topP,toff=0,sp=sh.selP,soff=0;\r
  if(sh.lines.length){\r
    const ti=clamp(Math.floor(sh.topL),0,sh.lines.length-1);tp=sh.lineP[ti];toff=ti-sh.pf[tp];\r
    if(sh.selR<sh.lines.length){sp=sh.lineP[sh.selR];soff=sh.selR-sh.pf[sp]}else{sp=sh.selP;soff=0}\r
  }\r
  cx.font=\`\${S.italic?'italic ':''}\${S.bold?'700 ':'400 '}\${S.fontPt*4/3}px \${FF()}\`;\r
  const cache=new Map(),mw=w=>{let v=cache.get(w);if(v===undefined){v=cx.measureText(w).width;cache.set(w,v)}return v};\r
  const sw=mw(' '),L=[],P=[],F=new Int32Array(sh.paras.length);\r
  sh.paras.forEach((p,pi)=>{\r
    F[pi]=L.length;\r
    if(!p){L.push('');P.push(pi);return}\r
    let line='',lw=0;\r
    const push=()=>{L.push(line);P.push(pi);line='';lw=0};\r
    for(const w of p.split(' ')){\r
      if(!w)continue;\r
      const ww=mw(w);\r
      if(line&&lw+sw+ww<=maxW){line+=' '+w;lw+=sw+ww;continue}\r
      if(line)push();\r
      if(ww<=maxW){line=w;lw=ww;continue}\r
      for(const ch of w){const c=mw(ch);if(line&&lw+c>maxW)push();line+=ch;lw+=c}\r
    }\r
    if(line)push();\r
  });\r
  sh.lines=L;sh.lineP=P;sh.pf=F;sh.key=key;\r
  const lim=p=>(p+1<F.length?F[p+1]:L.length)-1;\r
  if(F.length){\r
    tp=clamp(tp,0,F.length-1);sp=clamp(sp,0,F.length-1);\r
    sh.topL=Math.min(F[tp]+toff,lim(tp));\r
    sh.selR=Math.min(F[sp]+soff,lim(sp));\r
    sh.selP=sp;sh.topP=tp;\r
  }\r
}\r
\r
/* ---------- layout / render ---------- */\r
function dims(){const base=Math.max(20,Math.ceil(S.fontPt*4/3*1.3));return{rh:Math.round(base*S.zoom),cw:Math.round(64*S.zoom),fs:S.fontPt*4/3*S.zoom}}\r
function layout(){\r
  const sh=cur();D=dims();\r
  const hw=S.head?Math.max(30,Math.round(40*S.zoom)):0,hh=S.head?Math.max(16,Math.round(20*S.zoom)):0;\r
  gw.style.setProperty('--hw',hw+'px');gw.style.setProperty('--hh',hh+'px');\r
  gw.style.setProperty('--hfs',Math.max(9,Math.round(13*S.zoom))+'px');\r
  gw.style.setProperty('--rhpx',D.rh+'px');gw.style.setProperty('--cw',D.cw+'px');\r
  gw.style.setProperty('--pad',Math.max(2,Math.round(3*S.zoom))+'px');\r
  gw.classList.toggle('nogrid',!S.grid);\r
  $('#corner').style.display=$('#ch').style.display=$('#rh').style.display=S.head?'':'none';\r
  sizer.style.width=NCOLS*D.cw+'px';sizer.style.height=nRows(sh)*D.rh+'px';\r
  rowsEl.style.fontFamily=FF();rowsEl.style.fontSize=D.fs+'px';\r
  rowsEl.style.fontWeight=S.bold?700:400;rowsEl.style.fontStyle=S.italic?'italic':'normal';\r
  rowsEl.style.color=S.color||'';rowsEl.style.lineHeight=(D.rh-1)+'px';\r
  let h='';for(let i=0;i<NCOLS;i++)h+=\`<div style="width:\${D.cw}px">\${colName(i)}</div>\`;\r
  colin.innerHTML=h;\r
  markHeads();\r
}\r
function markHeads(){const o=$('.sel',colin);o&&o.classList.remove('sel');const n=colin.children[cur().selC];n&&n.classList.add('sel')}\r
function rowContent(sh,r,c0,c1){\r
  if(sh.type==='text'){const t=sh.lines[r];return t?\`<span class="t" style="left:0">\${esc(t)}</span>\`:''}\r
  let o='';\r
  for(let c=c0;c<=c1;c++){\r
    const cell=sh.cells.get(r*K+c);if(!cell)continue;\r
    const x=c*D.cw;\r
    if(cell.fill)o+=\`<i class="fill" style="left:\${x}px;width:\${D.cw}px;background:\${cell.fill}"></i>\`;\r
    const clip=cell.num||sh.cells.has(r*K+c+1);\r
    let st=\`left:\${x}px;\`;if(clip)st+=\`width:\${D.cw}px;\`;\r
    if(cell.b)st+='font-weight:700;';if(cell.i)st+='font-style:italic;';if(cell.color)st+=\`color:\${cell.color};\`;\r
    o+=\`<span class="t\${clip?' clip':''}\${cell.num?' rt':''}" style="\${st}">\${esc(cell.v)}</span>\`;\r
  }\r
  return o;\r
}\r
function render(){\r
  dirty=true;\r
  const sh=cur(),{rh,cw}=D,st=sc.scrollTop,sl=sc.scrollLeft;\r
  const r0=Math.max(0,Math.floor(st/rh)-1),r1=Math.min(nRows(sh)-1,Math.ceil((st+sc.clientHeight)/rh)+1);\r
  const c0=Math.max(0,Math.floor(sl/cw)-1),c1=Math.min(NCOLS-1,Math.ceil((sl+sc.clientWidth)/cw)+1);\r
  let h='',hr='';\r
  for(let r=r0;r<=r1;r++){\r
    h+=\`<div class="r" style="top:\${r*rh}px">\${rowContent(sh,r,c0,c1)}</div>\`;\r
    if(S.head)hr+=\`<div class="\${r===sh.selR?'sel':''}" style="top:\${r*rh}px">\${r+1}</div>\`;\r
  }\r
  rowsEl.innerHTML=h;rowin.innerHTML=hr;\r
  colin.style.transform=\`translateX(\${-sl}px)\`;rowin.style.transform=\`translateY(\${-st}px)\`;\r
  selEl.style.cssText=\`left:\${sh.selC*cw-1}px;top:\${sh.selR*rh-1}px;width:\${cw+1}px;height:\${rh+1}px\`;\r
  updateStatus();\r
}\r
function updateFbar(){const sh=cur();$('#nb').value=colName(sh.selC)+(sh.selR+1);$('#fi').value=cellFormula(sh,sh.selR,sh.selC)}\r
function updateStatus(){\r
  const sh=cur(),p=$('#prog');\r
  if(sh.type==='text'&&sh.lines.length){const t=sh.lines.length,b=Math.min(t,Math.ceil((sc.scrollTop+sc.clientHeight)/D.rh));p.textContent=\`Dòng \${b} / \${t}  ·  \${Math.round(b*100/t)}%\`}\r
  else p.textContent='';\r
}\r
let raf=0;\r
sc.addEventListener('scroll',()=>{\r
  const sh=cur();sh.topL=sc.scrollTop/D.rh;\r
  if(sh.type==='text'&&sh.lines.length)sh.topP=sh.lineP[clamp(Math.floor(sh.topL),0,sh.lines.length-1)];\r
  if(!raf)raf=requestAnimationFrame(()=>{raf=0;render()});\r
});\r
function relayout(){const sh=cur();ensureWrap(sh);layout();sc.scrollTop=sh.topL*D.rh;sc.scrollLeft=sh.left||0;render();updateFbar()}\r
function activate(i){\r
  if(S.sheets[S.active]&&D){cur().left=sc.scrollLeft}\r
  S.active=clamp(i,0,S.sheets.length-1);\r
  relayout();renderTabs();\r
}\r
\r
/* ---------- selection ---------- */\r
function ensureVisible(){\r
  const sh=cur(),top=sh.selR*D.rh,bot=top+D.rh,left=sh.selC*D.cw,right=left+D.cw;\r
  if(top<sc.scrollTop)sc.scrollTop=top;else if(bot>sc.scrollTop+sc.clientHeight)sc.scrollTop=bot-sc.clientHeight;\r
  if(left<sc.scrollLeft)sc.scrollLeft=left;else if(right>sc.scrollLeft+sc.clientWidth)sc.scrollLeft=right-sc.clientWidth;\r
}\r
function selectCell(r,c,scroll=true){\r
  const sh=cur();sh.selR=clamp(r,0,nRows(sh)-1);sh.selC=clamp(c,0,NCOLS-1);\r
  if(sh.type==='text'&&sh.selR<sh.lines.length)sh.selP=sh.lineP[sh.selR];\r
  if(scroll)ensureVisible();\r
  markHeads();render();updateFbar();\r
}\r
function jumpTo(r,c=0){selectCell(r,c,false);sc.scrollTop=Math.max(0,r*D.rh-sc.clientHeight/3);render()}\r
sc.addEventListener('mousedown',e=>{\r
  const b=sc.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;\r
  if(x>sc.clientWidth||y>sc.clientHeight)return;\r
  selectCell(Math.floor((y+sc.scrollTop)/D.rh),Math.floor((x+sc.scrollLeft)/D.cw),false);\r
});\r
$('#ch').addEventListener('mousedown',e=>{const b=$('#ch').getBoundingClientRect();selectCell(cur().selR,Math.floor((e.clientX-b.left+sc.scrollLeft)/D.cw),false)});\r
$('#rh').addEventListener('mousedown',e=>{const b=$('#rh').getBoundingClientRect();selectCell(Math.floor((e.clientY-b.top+sc.scrollTop)/D.rh),cur().selC,false)});\r
$('#nb').addEventListener('focus',e=>e.target.select());\r
$('#nb').addEventListener('keydown',e=>{\r
  if(e.key==='Enter'){\r
    const m=/^\\$?([A-Za-z]{1,3})\\$?(\\d+)$/.exec(e.target.value.trim());\r
    if(m){let c=0;for(const ch of m[1].toUpperCase())c=c*26+ch.charCodeAt(0)-64;jumpTo(+m[2]-1,c-1)}else updateFbar();\r
    e.target.blur();\r
  }else if(e.key==='Escape'){updateFbar();e.target.blur();e.stopPropagation()}\r
});\r
\r
/* ---------- tabs ---------- */\r
function renderTabs(){\r
  $('#tlist').innerHTML=S.sheets.map((s,i)=>\`<button class="st\${i===S.active?' on':''}" data-i="\${i}" title="\${esc(s.name)}">\${esc(s.name)}</button>\`).join('');\r
  const on=$('#tlist .on');on&&on.scrollIntoView({block:'nearest',inline:'nearest'});\r
}\r
$('#tlist').addEventListener('click',e=>{const b=e.target.closest('.st');if(b&&!e.target.matches('input'))activate(+b.dataset.i)});\r
$('#tlist').addEventListener('dblclick',e=>{const b=e.target.closest('.st');if(b)renameSheet(+b.dataset.i)});\r
$('#tlist').addEventListener('contextmenu',e=>{\r
  const b=e.target.closest('.st');if(!b)return;e.preventDefault();\r
  const i=+b.dataset.i,s=S.sheets[i];\r
  showCtx(e.clientX,e.clientY-110,[\r
    ['Đổi tên',()=>renameSheet(i)],\r
    ['Di chuyển sang trái',()=>moveSheet(i,-1),i===0],\r
    ['Di chuyển sang phải',()=>moveSheet(i,1),i===S.sheets.length-1],\r
    ['Xóa',()=>deleteSheet(i),s.isFake||S.sheets.length<2]\r
  ]);\r
});\r
function renameSheet(i){\r
  const b=$(\`.st[data-i="\${i}"]\`);if(!b)return;const s=S.sheets[i];\r
  b.innerHTML=\`<input value="\${esc(s.name)}" maxlength="31">\`;const inp=$('input',b);inp.focus();inp.select();\r
  const done=ok=>{if(!inp.isConnected)return;if(ok&&inp.value.trim())s.name=uniq(inp.value,s);renderTabs()};\r
  inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')done(true);if(e.key==='Escape')done(false)};\r
  inp.onblur=()=>done(true);\r
}\r
function moveSheet(i,d){\r
  const j=i+d;if(j<0||j>=S.sheets.length)return;const a=cur();\r
  [S.sheets[i],S.sheets[j]]=[S.sheets[j],S.sheets[i]];S.active=S.sheets.indexOf(a);renderTabs();\r
}\r
function deleteSheet(i){\r
  const s=S.sheets[i];\r
  dialog({title:'Microsoft Excel',body:\`<p>Microsoft Excel sẽ xóa vĩnh viễn trang tính "\${esc(s.name)}". Bạn có muốn tiếp tục?</p>\`,btns:[{t:'Xóa',p:1,fn:()=>{\r
    const a=cur();S.sheets.splice(i,1);S.boss=-1;\r
    S.active=Math.max(0,S.sheets.indexOf(a)<0?Math.min(i,S.sheets.length-1):S.sheets.indexOf(a));relayout();renderTabs();\r
  }},{t:'Hủy'}]});\r
}\r
$('#tl').onclick=()=>$('#tlist').scrollBy(-160,0);\r
$('#tr').onclick=()=>$('#tlist').scrollBy(160,0);\r
['#tl','#tr'].forEach(s=>$(s).addEventListener('contextmenu',e=>{e.preventDefault();dlgActivate()}));\r
$('#tadd').onclick=()=>{const i=addSheet(mkGrid(uniq('Sheet'+(S.sheets.length+1))));activate(i)};\r
\r
/* ---------- context menu ---------- */\r
function showCtx(x,y,items){\r
  closeCtx();const m=document.createElement('div');m.className='ctx';m.id='ctx';\r
  items.forEach(([t,fn,dis])=>{const d=document.createElement('div');d.textContent=t;if(dis)d.className='dis';else d.onclick=()=>{closeCtx();fn()};m.appendChild(d)});\r
  document.body.appendChild(m);\r
  m.style.left=Math.min(x,innerWidth-m.offsetWidth-4)+'px';m.style.top=Math.max(4,Math.min(y,innerHeight-m.offsetHeight-4))+'px';\r
}\r
function closeCtx(){const m=$('#ctx');m&&m.remove()}\r
document.addEventListener('mousedown',e=>{if(!e.target.closest('#ctx'))closeCtx()});\r
\r
/* ---------- dialogs ---------- */\r
let dlg=null;\r
function dialog({title,body,btns=[],cls='',modeless=false}){\r
  closeDialog();\r
  const o=document.createElement('div');o.id='ovl';if(modeless)o.className='ml';\r
  o.innerHTML=\`<div class="dlg \${cls}" role="dialog" aria-label="\${esc(title)}"><div class="dh"><span>\${esc(title)}</span><button class="dx" aria-label="Đóng">&#10005;</button></div><div class="db">\${body}</div><div class="df"></div></div>\`;\r
  document.body.appendChild(o);\r
  const f=$('.df',o);\r
  btns.forEach(b=>{const x=document.createElement('button');x.textContent=b.t;if(b.p)x.className='pri';x.onclick=()=>{if(b.fn&&b.fn(o)===false)return;if(!b.keep)closeDialog()};f.appendChild(x)});\r
  $('.dx',o).onclick=closeDialog;dlg=o;\r
  setTimeout(()=>{const t=o.querySelector('[autofocus]')||f.querySelector('.pri');t&&t.focus()});\r
  return o;\r
}\r
function closeDialog(){if(dlg){dlg.remove();dlg=null}}\r
const msg=t=>dialog({title:'Microsoft Excel',body:\`<p>\${esc(t)}</p>\`,btns:[{t:'OK',p:1}]});\r
\r
function dlgPaste(){\r
  dialog({title:'Dán văn bản truyện',cls:'big',body:\`<p>Dán nội dung truyện vào ô bên dưới:</p><textarea id="pt" autofocus></textarea><label style="margin-top:8px">Tên trang tính:&nbsp;<input type="text" id="pn" value="Truyện" style="flex:1"></label><label><input type="checkbox" id="ps" \${S.split?'checked':''}> Tự động tách chương</label>\`,\r
    btns:[{t:'OK',p:1,fn:o=>{const t=$('#pt',o).value;if(!t.trim())return false;const old=S.split;S.split=$('#ps',o).checked;try{finishImport(addText($('#pn',o).value||'Truyện',t))}catch(e){msg(e.message)}S.split=old;syncRibbon()}},{t:'Hủy'}]});\r
}\r
function dlgActivate(){\r
  const opts=S.sheets.map((s,i)=>\`<option value="\${i}" \${i===S.active?'selected':''}>\${esc(s.name)}</option>\`).join('');\r
  const o=dialog({title:'Kích hoạt',body:\`<p>Kích hoạt:</p><select size="12" id="al">\${opts}</select>\`,btns:[{t:'OK',p:1,fn:o=>{activate(+$('#al',o).value)}},{t:'Hủy'}]});\r
  const l=$('#al',o);l.ondblclick=()=>{activate(+l.value);closeDialog()};\r
  setTimeout(()=>{const s=$('option:checked',l);s&&s.scrollIntoView({block:'center'});l.focus()});\r
}\r
const stripAcc=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/đ/g,'d');\r
let lastQ='',lastNoAcc=true;\r
function dlgFind(){\r
  const o=dialog({title:'Tìm và Thay thế',modeless:true,body:\`<p>Tìm gì:</p><input type="text" id="fq" autofocus value="\${esc(lastQ)}"><label><input type="checkbox" id="fa" \${lastNoAcc?'checked':''}> Bỏ qua dấu tiếng Việt</label><div class="fres" id="fr"></div>\`,\r
    btns:[{t:'Tìm trước',keep:1,fn:()=>{findNext(-1);return false}},{t:'Tìm tiếp',p:1,keep:1,fn:()=>{findNext(1);return false}},{t:'Đóng'}]});\r
  const q=$('#fq',o);q.select();q.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){findNext(e.shiftKey?-1:1)}if(e.key==='Escape')closeDialog()};\r
}\r
function findNext(dir){\r
  const q0=$('#fq').value;lastQ=q0;lastNoAcc=$('#fa').checked;\r
  const res=$('#fr');if(!q0){res.textContent='';return}\r
  const norm=lastNoAcc?stripAcc:s=>s.toLowerCase(),q=norm(q0),sh=cur();let hit=-1;\r
  if(sh.type==='text'){\r
    const n=sh.paras.length,p0=sh.lineP[sh.selR]??sh.selP;\r
    for(let k=1;k<=n;k++){const p=((p0+dir*k)%n+n)%n;if(sh.paras[p]&&norm(sh.paras[p]).includes(q)){hit=sh.pf[p];break}}\r
    if(hit>=0)jumpTo(hit,0);\r
  }else{\r
    const keys=[...sh.cells.keys()].sort((a,b)=>a-b),here=sh.selR*K+sh.selC;\r
    const order=dir>0?[...keys.filter(k=>k>here),...keys.filter(k=>k<=here)]:[...keys.filter(k=>k<here).reverse(),...keys.filter(k=>k>=here).reverse()];\r
    const k=order.find(k=>norm(sh.cells.get(k).v).includes(q));\r
    if(k!==undefined){jumpTo(Math.floor(k/K),k%K);hit=1}\r
  }\r
  res.textContent=hit>=0?'':'Không tìm thấy dữ liệu bạn đang tìm kiếm.';\r
}\r
\r
/* ---------- import ---------- */\r
const LIBS={xlsx:'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',mammoth:'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',jszip:'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'};\r
const loaded={};\r
function lib(n){return loaded[n]||(loaded[n]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=LIBS[n];s.onload=res;s.onerror=()=>{delete loaded[n];rej(new Error('Không tải được thư viện đọc tệp (cần kết nối internet cho định dạng này).'))};document.head.appendChild(s)}))}\r
function decode(buf){\r
  const u=new Uint8Array(buf);\r
  if(u[0]===0xFF&&u[1]===0xFE)return new TextDecoder('utf-16le').decode(buf);\r
  if(u[0]===0xFE&&u[1]===0xFF)return new TextDecoder('utf-16be').decode(buf);\r
  try{return new TextDecoder('utf-8',{fatal:true}).decode(buf)}catch(e){try{return new TextDecoder('windows-1258').decode(buf)}catch(e2){return new TextDecoder('windows-1252').decode(buf)}}\r
}\r
function clean(text){\r
  const a=text.replace(/^\\uFEFF/,'').replace(/\\r\\n?/g,'\\n').replace(/[\\u00a0\\u3000]/g,' ').replace(/\\t/g,'    ').split('\\n').map(s=>s.trim());\r
  const out=[];for(const s of a){if(s===''){if(out.length&&out[out.length-1]!=='')out.push('')}else out.push(s)}\r
  while(out.length&&out[out.length-1]==='')out.pop();return out;\r
}\r
function htmlToText(html){\r
  const d=new DOMParser().parseFromString(html,'text/html');\r
  d.querySelectorAll('script,style').forEach(n=>n.remove());\r
  d.querySelectorAll('br').forEach(n=>n.replaceWith('\\n'));\r
  d.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,tr,section,blockquote').forEach(n=>n.append('\\n'));\r
  return (d.body||d).textContent;\r
}\r
const RE_CH=/^(chương|chuong|chapter)\\s+(\\d+|[ivxlcdm]+|nhất|một|hai|ba|bốn|tư|năm|sáu|bảy|tám|chín|mười|trăm)(?![\\p{L}\\p{N}])|^(tập|phần|quyển|hồi|volume|vol\\.?|book)\\s+(\\d+|[ivxlc]+)(?![\\p{L}\\p{N}])|^第.{1,9}[章回节節话話]|^(mở đầu|lời nói đầu|lời tựa|ngoại truyện|phiên ngoại|prologue|epilogue|番外)(?![\\p{L}\\p{N}])/iu;\r
const isCh=p=>p&&p.length<=100&&RE_CH.test(p);\r
function splitChapters(paras){\r
  const idx=[];paras.forEach((p,i)=>{if(isCh(p))idx.push(i)});\r
  if(idx.length<2)return null;\r
  const trim=a=>{let s=0,e=a.length;while(s<e&&!a[s])s++;while(e>s&&!a[e-1])e--;return a.slice(s,e)};\r
  const out=[],toc=[];let intro=paras.slice(0,idx[0]);\r
  const smallIntro=intro.filter(Boolean).length<6;\r
  if(!smallIntro)out.push({title:'Giới thiệu',paras:trim(intro)});\r
  idx.forEach((s,k)=>{\r
    let chunk=paras.slice(s,k+1<idx.length?idx[k+1]:paras.length);\r
    if(k===0&&smallIntro)chunk=intro.concat(chunk);\r
    chunk=trim(chunk);\r
    const body=chunk.filter(Boolean).length-1;\r
    if(body<1&&!(k===0&&smallIntro)){toc.push(paras[s]);return}\r
    out.push({title:paras[s],paras:chunk});\r
  });\r
  if(toc.length>=3)out.unshift({title:'Mục lục',paras:toc});\r
  return out;\r
}\r
function addText(base,text){\r
  const paras=clean(text);\r
  if(!paras.length)throw new Error('Tệp không có nội dung văn bản.');\r
  const ch=S.split?splitChapters(paras):null,made=[];\r
  if(ch&&ch.length>=2)ch.forEach(c=>made.push(addSheet(mkText(uniq(c.title||base),c.paras))));\r
  else made.push(addSheet(mkText(uniq(base),paras)));\r
  return made;\r
}\r
function finishImport(made){\r
  if(!made||!made.length)return;\r
  renderTabs();activate(made[0]);\r
  $('#stmsg').textContent='Sẵn sàng';\r
}\r
const baseName=n=>n.replace(/\\.[^.]+$/,'');\r
async function importFile(f){\r
  const ext=(f.name.split('.').pop()||'').toLowerCase(),base=baseName(f.name);\r
  if(['xlsx','xls','xlsm','ods'].includes(ext)){await lib('xlsx');return importGrid(XLSX.read(await f.arrayBuffer(),{type:'array'}))}\r
  if(['csv','tsv'].includes(ext)){await lib('xlsx');return importGrid(XLSX.read(decode(await f.arrayBuffer()),{type:'string'}))}\r
  if(ext==='docx'){await lib('mammoth');const r=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()});return addText(base,r.value)}\r
  if(ext==='epub')return importEpub(f,base);\r
  if(ext==='json')return importJSON(decode(await f.arrayBuffer()));\r
  const t=decode(await f.arrayBuffer());\r
  return addText(base,['html','htm','xhtml'].includes(ext)?htmlToText(t):t);\r
}\r
async function importFiles(files){\r
  const made=[];\r
  for(const f of files){\r
    $('#stmsg').textContent='Đang xử lý '+f.name+'...';\r
    try{made.push(...await importFile(f))}catch(e){msg(\`Không mở được "\${f.name}": \${e.message}\`)}\r
  }\r
  $('#stmsg').textContent='Sẵn sàng';finishImport(made);\r
}\r
function importGrid(wb){\r
  const made=[];\r
  wb.SheetNames.forEach(name=>{\r
    const ws=wb.Sheets[name],sh=mkGrid(uniq(name));\r
    for(const k in ws){\r
      if(k[0]==='!')continue;const a=XLSX.utils.decode_cell(k);\r
      if(a.c>=NCOLS||a.r>200000)continue;const c=ws[k];\r
      const v=c.w!==undefined?c.w:(c.v===undefined?'':String(c.v));if(v==='')continue;\r
      sh.cells.set(a.r*K+a.c,{v,num:c.t==='n'||undefined,f:c.f});sh.maxRow=Math.max(sh.maxRow,a.r);\r
    }\r
    made.push(addSheet(sh));\r
  });\r
  return made;\r
}\r
async function importEpub(f,base){\r
  await lib('jszip');const zip=await JSZip.loadAsync(await f.arrayBuffer());\r
  const P=s=>new DOMParser().parseFromString(s,'application/xml');\r
  const rf=P(await zip.file('META-INF/container.xml').async('string')).querySelector('rootfile').getAttribute('full-path');\r
  const opf=P(await zip.file(rf).async('string')),dir=rf.includes('/')?rf.replace(/[^/]*$/,''):'';\r
  const man={};opf.querySelectorAll('manifest > item').forEach(i=>man[i.getAttribute('id')]=i.getAttribute('href'));\r
  const made=[];let n=0;\r
  for(const ir of opf.querySelectorAll('spine > itemref')){\r
    const href=man[ir.getAttribute('idref')];if(!href)continue;\r
    const path=decodeURIComponent(new URL('http://x/'+dir+href).pathname.slice(1));\r
    const file=zip.file(path)||zip.file(href);if(!file)continue;\r
    const html=await file.async('string');\r
    const d=new DOMParser().parseFromString(html,'text/html');\r
    const h=d.querySelector('h1,h2,h3'),paras=clean(htmlToText(html));\r
    if(paras.join('').length<30)continue;\r
    n++;\r
    const title=(h&&h.textContent.trim())||paras[0].slice(0,40)||base+' '+n;\r
    if(paras[0]===title&&paras.length>1)paras.shift();\r
    paras.unshift(title);\r
    made.push(addSheet(mkText(uniq(title),paras)));\r
  }\r
  if(!made.length)throw new Error('Không tìm thấy nội dung trong tệp EPUB.');\r
  return made;\r
}\r
function importJSON(t){\r
  const d=JSON.parse(t);if(!d||!Array.isArray(d.sheets))throw new Error('Tệp .json không phải thư viện hợp lệ.');\r
  return d.sheets.map(s=>{\r
    let sh;\r
    if(s.type==='grid'){sh=mkGrid(uniq(s.name));(s.cells||[]).forEach(([r,c,o])=>{sh.cells.set(r*K+c,o);sh.maxRow=Math.max(sh.maxRow,r)})}\r
    else{sh=mkText(uniq(s.name),s.paras||[]);sh.topP=s.topP||0;sh.selP=s.selP||0}\r
    return addSheet(sh);\r
  });\r
}\r
function exportLib(){\r
  const data={app:'sheet-reader',v:1,sheets:S.sheets.filter(s=>!s.isFake).map(s=>s.type==='text'\r
    ?{name:s.name,type:'text',paras:s.paras,topP:s.lines.length?s.lineP[clamp(Math.floor(s.topL),0,s.lines.length-1)]:s.topP,selP:s.selP}\r
    :{name:s.name,type:'grid',cells:[...s.cells].map(([k,v])=>[Math.floor(k/K),k%K,v])})};\r
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));\r
  a.download='Book1.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);\r
}\r
const fp=$('#fp');\r
function pick(){fp.value='';fp.click()}\r
fp.onchange=()=>{if(fp.files.length)importFiles([...fp.files])};\r
let dragN=0;\r
addEventListener('dragenter',e=>{e.preventDefault();if(!$('#drop')&&e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){const d=document.createElement('div');d.id='drop';d.textContent='Thả tệp để mở';document.body.appendChild(d)}dragN++});\r
addEventListener('dragleave',()=>{if(--dragN<=0){const d=$('#drop');d&&d.remove();dragN=0}});\r
addEventListener('dragover',e=>e.preventDefault());\r
addEventListener('drop',e=>{e.preventDefault();dragN=0;const d=$('#drop');d&&d.remove();if(e.dataTransfer.files.length)importFiles([...e.dataTransfer.files])});\r
\r
/* ---------- ribbon ---------- */\r
const ICONS={\r
 clip:'<rect x="6" y="6" width="20" height="23" rx="2" fill="#d9a45b"/><rect x="11" y="3" width="10" height="7" rx="2" fill="#666"/><rect x="10" y="12" width="14" height="14" fill="#fff"/><path d="M12 16h10M12 20h10" stroke="#999"/>',\r
 grid:'<rect x="4" y="6" width="24" height="20" fill="#fff" stroke="#217346" stroke-width="2"/><path d="M4 13h24M4 19.5h24M12 6v20M20 6v20" stroke="#217346" stroke-width="1.5"/>',\r
 folder:'<path d="M3 8h10l3 4h13v15H3z" fill="#e8a935"/><path d="M3 14h26v13H3z" fill="#f6cc66"/>',\r
 save:'<rect x="5" y="5" width="22" height="22" rx="2" fill="#2b6cb0"/><rect x="9" y="5" width="14" height="8" fill="#fff"/><rect x="9" y="17" width="14" height="10" fill="#dbe7f5"/>',\r
 find:'<circle cx="13" cy="13" r="7" fill="none" stroke="#666" stroke-width="3"/><path d="M18 18l9 9" stroke="#666" stroke-width="4"/>',\r
 chart:'<path d="M5 27h22" stroke="#777" stroke-width="2"/><rect x="7" y="15" width="5" height="12" fill="#4472c4"/><rect x="14" y="8" width="5" height="19" fill="#ed7d31"/><rect x="21" y="12" width="5" height="15" fill="#70ad47"/>',\r
 sigma:'<text x="16" y="25" font-size="24" text-anchor="middle" fill="#217346" font-family="Arial">&#931;</text>',\r
 fx:'<text x="16" y="23" font-size="17" text-anchor="middle" fill="#217346" font-family="Georgia" font-style="italic">fx</text>',\r
 sort:'<text x="4" y="14" font-size="11" fill="#217346" font-family="Arial" font-weight="700">A</text><text x="4" y="27" font-size="11" fill="#c00" font-family="Arial" font-weight="700">Z</text><path d="M22 6v20M17 21l5 6 5-6" fill="none" stroke="#4472c4" stroke-width="2.5"/>',\r
 filter:'<path d="M5 7h22l-8 10v9l-6-3v-6z" fill="#4472c4"/>',\r
 page:'<path d="M8 3h12l6 6v20H8z" fill="#fff" stroke="#777" stroke-width="1.5"/><path d="M20 3v6h6" fill="#ddd" stroke="#777"/>',\r
 eye:'<path d="M2 16c4-7 9-10 14-10s10 3 14 10c-4 7-9 10-14 10S6 23 2 16z" fill="#fff" stroke="#555" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="#217346"/>',\r
 link:'<path d="M13 19l6-6M11 15l-3 3a5 5 0 007 7l3-3M21 17l3-3a5 5 0 00-7-7l-3 3" fill="none" stroke="#4472c4" stroke-width="3"/>',\r
 bubble:'<path d="M4 5h24v17H15l-6 6v-6H4z" fill="#ffd966" stroke="#b8860b" stroke-width="1.5"/>',\r
 shield:'<path d="M16 3l11 4v8c0 7-5 11-11 14C10 26 5 22 5 15V7z" fill="#a9c4eb" stroke="#4472c4" stroke-width="2"/>',\r
 play:'<path d="M9 5l17 11L9 27z" fill="#217346"/>',\r
 moon:'<path d="M22 4a12 12 0 1010 14A10 10 0 0122 4z" fill="#444" transform="translate(-4 2)"/>',\r
 zoom:'<circle cx="13" cy="13" r="8" fill="#fff" stroke="#4472c4" stroke-width="3"/><path d="M19 19l8 8" stroke="#4472c4" stroke-width="4"/><path d="M9 13h8M13 9v8" stroke="#4472c4" stroke-width="2"/>',\r
 split:'<rect x="5" y="4" width="22" height="24" fill="#fff" stroke="#217346" stroke-width="2"/><path d="M5 16h22" stroke="#c00" stroke-width="2" stroke-dasharray="3 2"/><path d="M9 9h14M9 22h14" stroke="#aaa" stroke-width="2"/>',\r
 image:'<rect x="4" y="6" width="24" height="20" fill="#cfe3f7" stroke="#4472c4" stroke-width="2"/><circle cx="11" cy="12" r="2.5" fill="#ffc000"/><path d="M5 25l8-8 5 5 4-4 5 5z" fill="#70ad47"/>',\r
 shape:'<circle cx="12" cy="12" r="7" fill="#ed7d31"/><rect x="14" y="14" width="13" height="13" fill="#4472c4"/>',\r
 table:'<rect x="4" y="6" width="24" height="20" fill="#fff" stroke="#4472c4" stroke-width="2"/><rect x="4" y="6" width="24" height="6" fill="#4472c4"/><path d="M4 19h24M13 12v14M21 12v14" stroke="#4472c4"/>',\r
 ins:'<rect x="4" y="9" width="24" height="16" fill="#fff" stroke="#777" stroke-width="1.5"/><path d="M4 17h24M16 9v16" stroke="#aaa"/><path d="M16 3v8M12 7h8" stroke="#217346" stroke-width="2.5"/>',\r
 del:'<rect x="4" y="9" width="24" height="16" fill="#fff" stroke="#777" stroke-width="1.5"/><path d="M4 17h24M16 9v16" stroke="#aaa"/><path d="M11 5l10 6M21 5l-10 6" stroke="#c00" stroke-width="2.5"/>',\r
 fmt:'<rect x="4" y="6" width="24" height="20" fill="#fff" stroke="#777" stroke-width="1.5"/><rect x="4" y="6" width="24" height="5" fill="#a9d18e"/><path d="M4 16h24M4 21h24M13 11v15" stroke="#bbb"/>',\r
 painter:'<rect x="6" y="4" width="14" height="9" rx="1" fill="#e8a935"/><path d="M20 8h5v8H15v4" fill="none" stroke="#777" stroke-width="2.5"/><rect x="12" y="20" width="6" height="9" rx="1" fill="#555"/>'\r
};\r
const ic=n=>ICONS[n]||ICONS.grid;\r
const bb=(a,l,i)=>\`<button class="bb" data-act="\${a}" title="\${l}"><svg viewBox="0 0 32 32">\${ic(i)}</svg><span>\${l}</span></button>\`;\r
const sb=(a,l,i)=>\`<button class="sb" data-act="\${a}" title="\${l}"><svg viewBox="0 0 32 32">\${ic(i)}</svg><span>\${l}</span></button>\`;\r
const ibn=(a,t,l,x='')=>\`<button class="ib" data-act="\${a}" title="\${l}" style="\${x}">\${t}</button>\`;\r
const grp=(l,i)=>\`<div class="grp"><div class="gc">\${i}</div><div class="gl">\${l}</div></div>\`;\r
const col=(...a)=>\`<div class="col">\${a.join('')}</div>\`;\r
const row=(...a)=>\`<div class="row">\${a.join('')}</div>\`;\r
const ck=(a,l)=>\`<label class="ckl"><input type="checkbox" data-act="\${a}">\${l}</label>\`;\r
const alg=t=>\`<svg viewBox="0 0 16 16" width="14" height="14"><path d="\${t}" stroke="#444" stroke-width="1.6"/></svg>\`;\r
const FONTS=['Calibri','Arial','Cambria','Consolas','Courier New','Georgia','Segoe UI','Tahoma','Times New Roman','Verdana'];\r
const SIZES=[8,9,10,11,12,13,14,16,18,20,22,24];\r
const RIB={\r
 home:()=>grp('Bảng nhớ tạm',bb('paste','Dán','clip')+col(sb('x','Cắt','painter'),sb('copy','Sao chép','page'),sb('x','Chép Định dạng','painter')))\r
  +grp('Phông chữ',col(row(\`<select data-act="family" style="width:112px">\${FONTS.map(f=>\`<option>\${f}</option>\`).join('')}</select>\`,\`<select data-act="size" style="width:48px;margin-left:2px">\${SIZES.map(s=>\`<option>\${s}</option>\`).join('')}</select>\`,ibn('x','A&#9652;','Tăng cỡ chữ','font-weight:700;margin-left:4px'),ibn('x','A&#9662;','Giảm cỡ chữ','font-size:11px')),\r
   row(ibn('bold','B','In đậm','font-weight:700'),ibn('italic','I','In nghiêng','font-style:italic;font-family:Georgia,serif'),ibn('x','U','Gạch chân','text-decoration:underline'),ibn('x','&#9633;','Đường viền'),\`<label class="clr" title="Màu tô"><span>&#9632;</span><i style="background:#ffff00"></i></label>\`,\`<label class="clr" title="Màu phông chữ"><span>A</span><i id="clri" style="background:#c00"></i><input type="color" data-act="color" value="#808080"></label>\`,ibn('colorreset','&#8634;','Màu chữ mặc định','font-size:14px'))))\r
  +grp('Căn chỉnh',col(row(ibn('x',alg('M2 3h12M2 8h8'),'Căn trên'),ibn('x',alg('M2 5h12M4 10h8'),'Căn giữa'),ibn('x',alg('M2 8h12M2 13h8'),'Căn dưới'),sb('x','Ngắt dòng','grid')),row(ibn('x',alg('M2 3h12M2 7h8M2 11h12'),'Căn trái'),ibn('x',alg('M2 3h12M4 7h8M2 11h12'),'Căn giữa'),ibn('x',alg('M2 3h12M6 7h8M2 11h12'),'Căn phải'),sb('x','Hợp nhất & Căn giữa','grid'))))\r
  +grp('Số',col(\`<select style="width:128px"><option>Chung</option><option>Số</option><option>Tiền tệ</option><option>Ngày</option></select>\`,row(ibn('x','$','Tiền tệ'),ibn('x','%','Phần trăm'),ibn('x','000','Dấu phân cách','font-size:10px'),ibn('x','.00','Tăng số thập phân','font-size:10px'))))\r
  +grp('Kiểu',bb('x','Định dạng Có Điều kiện','fmt')+bb('x','Định dạng như Bảng','table')+bb('x','Kiểu Ô','grid'))\r
  +grp('Ô',bb('x','Chèn','ins')+bb('x','Xóa','del')+bb('x','Định dạng','fmt'))\r
  +grp('Chỉnh sửa',col(sb('x','Tự Tính tổng','sigma'),sb('x','Điền','grid'),sb('x','Xóa','del'))+bb('x','Sắp xếp & Lọc','sort')+bb('find','Tìm & Chọn','find')),\r
 insert:()=>grp('Bảng',bb('x','PivotTable','table')+bb('x','Bảng','table'))+grp('Minh họa',bb('x','Hình ảnh','image')+bb('x','Hình dạng','shape'))+grp('Biểu đồ',bb('x','Cột','chart')+bb('x','Đường','chart')+bb('x','Hình tròn','chart')+bb('x','Biểu đồ Đề xuất','chart'))+grp('Liên kết',bb('x','Liên kết','link'))+grp('Văn bản',bb('x','Hộp Văn bản','page')+bb('x','Đầu trang & Chân trang','page')),\r
 layout:()=>grp('Chủ đề',bb('x','Chủ đề','shape')+col(sb('x','Màu','shape'),sb('x','Phông chữ','page'),sb('x','Hiệu ứng','shape')))+grp('Thiết lập Trang',bb('x','Lề','page')+bb('x','Hướng','page')+bb('x','Khổ giấy','page')+bb('x','Vùng in','page')+bb('x','Ngắt trang','split'))+grp('Chia tỷ lệ',col(sb('x','Chiều rộng: Tự động','grid'),sb('x','Chiều cao: Tự động','grid'),sb('x','Tỷ lệ: 100%','grid'))),\r
 formulas:()=>grp('Thư viện Hàm',bb('x','Chèn Hàm','fx')+bb('x','Tự Tính tổng','sigma')+bb('x','Dùng Gần đây','fx')+bb('x','Tài chính','fx')+bb('x','Lô-gic','fx')+bb('x','Văn bản','fx')+bb('x','Ngày & Giờ','fx'))+grp('Tên Xác định',bb('x','Trình quản lý Tên','grid'))+grp('Tính toán',bb('x','Tùy chọn Tính toán','fx')),\r
 data:()=>grp('Lấy & Chuyển đổi Dữ liệu',bb('import','Từ Văn bản/CSV','folder')+bb('x','Từ Web','link')+bb('x','Từ Bảng/Phạm vi','table'))+grp('Truyện',bb('paste','Dán văn bản','clip')+bb('save','Lưu thư viện','save')+col(ck('split','Tự động tách chương')))+grp('Sắp xếp & Lọc',bb('x','Sắp xếp','sort')+bb('x','Bộ lọc','filter'))+grp('Công cụ Dữ liệu',bb('x','Văn bản thành Cột','split')+bb('x','Loại bỏ Trùng lặp','grid')),\r
 review:()=>grp('Kiểm lỗi',bb('x','Chính tả','page')+bb('x','Từ điển Đồng nghĩa','page'))+grp('Ghi chú',bb('x','Ghi chú Mới','bubble')+bb('x','Xóa','del'))+grp('Bảo vệ',bb('x','Bảo vệ Trang tính','shield')+bb('x','Bảo vệ Sổ làm việc','shield')),\r
 view:()=>grp('Dạng xem Sổ làm việc',bb('x','Bình thường','grid')+bb('x','Xem Ngắt trang','split')+bb('x','Bố trí Trang','page'))+grp('Hiện',col(ck('headings','Tiêu đề'),ck('gridlines','Đường lưới'))+col(ck('fbar','Thanh Công thức')))+grp('Thu phóng',bb('x','Thu phóng','zoom')+bb('zoom100','100%','zoom'))+grp('Đọc truyện',bb('auto','Cuộn tự động','play')+col(\`<label class="ckl">Tốc độ&nbsp;<select data-act="speed" style="width:50px">\${[1,2,3,4,5,6,8,10].map(n=>\`<option>\${n}</option>\`).join('')}</select></label>\`)+bb('dark','Chế độ tối','moon'))\r
};\r
function setTab(t){\r
  S.tab=t;$$('#tabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));\r
  $('#ribbon').innerHTML=RIB[t]();syncRibbon();\r
}\r
function syncRibbon(){\r
  const r=$('#ribbon');\r
  const set=(a,fn)=>$$(\`[data-act="\${a}"]\`,r).forEach(fn);\r
  set('family',e=>e.value=S.fam);set('size',e=>e.value=S.fontPt);\r
  set('bold',e=>e.classList.toggle('on',S.bold));set('italic',e=>e.classList.toggle('on',S.italic));\r
  set('split',e=>e.checked=S.split);set('headings',e=>e.checked=S.head);set('gridlines',e=>e.checked=S.grid);set('fbar',e=>e.checked=S.fbar);\r
  set('speed',e=>e.value=S.speed);set('auto',e=>e.classList.toggle('on',!!auto));set('dark',e=>e.classList.toggle('on',document.body.classList.contains('dark')));\r
  const ci=$('#clri');if(ci)ci.style.background=S.color||'#c00';\r
}\r
$('#tabs').addEventListener('click',e=>{\r
  const b=e.target.closest('.tab');if(!b)return;\r
  if(b.dataset.tab==='file'){openBS();return}\r
  if(b.dataset.tab===S.tab&&e.detail>1){$('#ribbon').classList.toggle('hide');return}\r
  $('#ribbon').classList.remove('hide');setTab(b.dataset.tab);\r
});\r
const ACT={\r
  paste:dlgPaste,import:pick,save:exportLib,find:dlgFind,\r
  copy:()=>{const sh=cur();try{navigator.clipboard.writeText(cellText(sh,sh.selR,sh.selC)).catch(()=>{})}catch(e){}},\r
  bold:()=>{S.bold=!S.bold;syncRibbon();relayout()},italic:()=>{S.italic=!S.italic;syncRibbon();relayout()},\r
  colorreset:()=>{S.color='';syncRibbon();layout();render()},\r
  zoom100:()=>setZoom(1),auto:()=>toggleAuto(),dark:()=>{document.body.classList.toggle('dark');syncRibbon()}\r
};\r
const CHG={\r
  family:e=>{S.fam=e.value;relayout()},size:e=>{S.fontPt=+e.value;relayout()},\r
  color:e=>{S.color=e.value;syncRibbon();layout();render()},\r
  split:e=>S.split=e.checked,\r
  gridlines:e=>{S.grid=e.checked;layout();render()},headings:e=>{S.head=e.checked;relayout()},\r
  fbar:e=>{S.fbar=e.checked;$('#fbar').style.display=S.fbar?'':'none'},\r
  speed:e=>S.speed=+e.value\r
};\r
$('#ribbon').addEventListener('click',e=>{const a=e.target.closest('button[data-act]');if(a&&ACT[a.dataset.act])ACT[a.dataset.act](a)});\r
$('#ribbon').addEventListener('input',e=>{const a=e.target.dataset.act;if(a==='color')CHG.color(e.target)});\r
$('#ribbon').addEventListener('change',e=>{const a=e.target.dataset.act;if(a&&CHG[a]&&a!=='color'){CHG[a](e.target);if(e.target.tagName==='SELECT')e.target.blur()}});\r
document.addEventListener('mousedown',e=>{if(e.target.closest('button'))e.preventDefault()});\r
document.querySelectorAll('.qat [data-act]').forEach(b=>b.onclick=()=>ACT[b.dataset.act]&&ACT[b.dataset.act]());\r
$('#tellme').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.target.blur();dlgFind()}if(e.key==='Escape')e.target.blur()});\r
\r
/* ---------- backstage ---------- */\r
function openBS(){$('#bs').hidden=false}\r
function closeBS(){$('#bs').hidden=true}\r
$('#bs').addEventListener('click',e=>{\r
  const b=e.target.closest('[data-bs]');if(!b)return;const a=b.dataset.bs;\r
  if(a==='close')closeBS();\r
  else if(a==='open'){closeBS();pick()}\r
  else if(a==='paste'){closeBS();dlgPaste()}\r
  else if(a==='save'){exportLib()}\r
  else if(a==='new'){closeBS();$('#tadd').click()}\r
});\r
\r
/* ---------- zoom ---------- */\r
function setZoom(z){\r
  S.zoom=clamp(Math.round(z*20)/20,.25,2);\r
  $('#zr').value=Math.round(S.zoom*100);$('#zp').textContent=Math.round(S.zoom*100)+'%';\r
  relayout();\r
}\r
$('#zr').oninput=e=>setZoom(e.target.value/100);\r
$('#zin').onclick=()=>setZoom(S.zoom+.1);$('#zout').onclick=()=>setZoom(S.zoom-.1);\r
sc.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();setZoom(S.zoom+(e.deltaY<0?.1:-.1))}},{passive:false});\r
\r
/* ---------- auto scroll ---------- */\r
let auto=0;\r
function toggleAuto(on){\r
  if(on===undefined)on=!auto;\r
  if(!on){if(auto)cancelAnimationFrame(auto);auto=0;syncRibbon();return}\r
  let last=performance.now(),pos=sc.scrollTop;\r
  const step=t=>{\r
    const dt=Math.min(100,t-last);last=t;\r
    if(Math.abs(sc.scrollTop-Math.round(pos))>2)pos=sc.scrollTop;\r
    pos+=S.speed*15*dt/1000;sc.scrollTop=pos;\r
    if(sc.scrollTop<Math.floor(pos)-1){toggleAuto(false);return}\r
    auto=requestAnimationFrame(step);\r
  };\r
  auto=requestAnimationFrame(step);syncRibbon();\r
}\r
\r
/* ---------- boss key ---------- */\r
function panic(){\r
  toggleAuto(false);closeBS();closeDialog();closeCtx();\r
  const f=S.sheets.findIndex(s=>s.isFake);\r
  if(f<0)return;\r
  if(S.active!==f){\r
    S.boss=S.active;const fk=S.sheets[f];fk.selR=0;fk.selC=0;fk.topL=0;fk.left=0;\r
    if(S.tab!=='home'){setTab('home')}\r
    activate(f);\r
  }else if(S.boss>=0&&S.sheets[S.boss]){activate(S.boss);S.boss=-1}\r
}\r
\r
/* ---------- keyboard ---------- */\r
document.addEventListener('keydown',e=>{\r
  const inField=e.target.matches('input,textarea,select');\r
  const ctrl=e.ctrlKey||e.metaKey;\r
  if(e.key==='Escape'){\r
    if(inField){e.target.blur();return}\r
    if(!$('#bs').hidden){closeBS();return}\r
    if(dlg){closeDialog();return}\r
    panic();return;\r
  }\r
  if(ctrl&&e.key.toLowerCase()==='f'){e.preventDefault();dlgFind();return}\r
  if(ctrl&&e.key.toLowerCase()==='s'){e.preventDefault();exportLib();return}\r
  if(ctrl&&e.key.toLowerCase()==='o'){e.preventDefault();pick();return}\r
  if(inField||dlg||!$('#bs').hidden)return;\r
  const sh=cur(),pg=Math.max(1,Math.floor(sc.clientHeight/D.rh)-1);\r
  const page=d=>{sc.scrollTop+=d*pg*D.rh;selectCell(sh.selR+d*pg,sh.selC,false)};\r
  if(ctrl&&e.key==='PageDown'){e.preventDefault();if(S.active<S.sheets.length-1)activate(S.active+1);return}\r
  if(ctrl&&e.key==='PageUp'){e.preventDefault();if(S.active>0)activate(S.active-1);return}\r
  if(ctrl&&e.key==='Home'){e.preventDefault();selectCell(0,0);sc.scrollTop=0;sc.scrollLeft=0;return}\r
  if(ctrl&&e.key==='End'){e.preventDefault();const last=sh.type==='text'?sh.lines.length-1:sh.maxRow;jumpTo(Math.max(0,last),0);return}\r
  if(ctrl&&(e.key==='='||e.key==='+')){e.preventDefault();setZoom(S.zoom+.1);return}\r
  if(ctrl&&e.key==='-'){e.preventDefault();setZoom(S.zoom-.1);return}\r
  switch(e.key){\r
    case 'ArrowDown':case 'Enter':selectCell(sh.selR+(e.shiftKey&&e.key==='Enter'?-1:1),sh.selC);break;\r
    case 'ArrowUp':selectCell(sh.selR-1,sh.selC);break;\r
    case 'ArrowLeft':selectCell(sh.selR,sh.selC-1);break;\r
    case 'ArrowRight':selectCell(sh.selR,sh.selC+1);break;\r
    case 'Tab':selectCell(sh.selR,sh.selC+(e.shiftKey?-1:1));break;\r
    case 'PageDown':page(1);break;\r
    case 'PageUp':page(-1);break;\r
    case ' ':page(e.shiftKey?-1:1);break;\r
    case 'Home':selectCell(sh.selR,0);break;\r
    default:return;\r
  }\r
  e.preventDefault();\r
});\r
\r
/* ---------- resize ---------- */\r
let rt=0,lw=0;\r
new ResizeObserver(()=>{\r
  clearTimeout(rt);rt=setTimeout(()=>{if(sc.clientWidth!==lw){lw=sc.clientWidth;relayout()}else render()},120);\r
}).observe(sc);\r
\r
/* ---------- tự lưu tiến độ ----------\r
 * Trước đây truyện đã nhập chỉ sống trong bộ nhớ: tải lại trang hay thoát game\r
 * là mất sạch. App là SPA nên \`pagehide\` của game cũng không chạy khi rời trang\r
 * → đăng ký thêm __gqFlush / event "gq:flush" (FLUSH_BRIDGE trong\r
 * src/pages/OfflineGamePage.jsx) để ghi trước khi thoát.\r
 * Sheet1 báo cáo (isFake) và 'Hướng dẫn' (isGuide) không lưu vì luôn được dựng lại lúc khởi động. */\r
const RK='bang-tinh-lib-v1';\r
let dirty=false, saveBroken=false;\r
function serializeSheet(s){\r
  return s.type==='grid'\r
    ?{name:s.name,type:'grid',cells:[...s.cells].map(([k,v])=>[Math.floor(k/K),k%K,v]),selR:s.selR,selC:s.selC,topL:s.topL,left:s.left}\r
    :{name:s.name,type:'text',paras:s.paras,topP:s.topP,selP:s.selP,selR:s.selR,topL:s.topL,left:s.left};\r
}\r
function saveRun(){\r
  if(saveBroken)return;\r
  const user=S.sheets.filter(s=>!s.isFake&&!s.isGuide);\r
  try{\r
    localStorage.setItem(RK,JSON.stringify({v:1,at:Date.now(),active:cur().name,sheets:user.map(serializeSheet)}));\r
    dirty=false;\r
  }catch(e){saveBroken=true;} // hết dung lượng localStorage: ngừng tự lưu, không phá trải nghiệm\r
}\r
function loadRun(){\r
  try{const s=JSON.parse(localStorage.getItem(RK)||'null');return s&&s.v===1&&Array.isArray(s.sheets)&&s.sheets.length?s:null}catch(e){return null}\r
}\r
function restoreSheet(d){\r
  let sh;\r
  if(d.type==='grid'){\r
    sh=mkGrid(uniq(d.name));\r
    (d.cells||[]).forEach(([r,c,o])=>{sh.cells.set(r*K+c,o);sh.maxRow=Math.max(sh.maxRow,r)});\r
  }else{\r
    sh=mkText(uniq(d.name),d.paras||[]);\r
    sh.topP=d.topP||0;sh.selP=d.selP||0;\r
  }\r
  sh.selR=d.selR|0;sh.selC=d.selC|0;sh.topL=d.topL||0;sh.left=d.left||0;\r
  return sh;\r
}\r
window.__gqFlush=saveRun;\r
addEventListener('gq:flush',saveRun);\r
addEventListener('pagehide',saveRun);\r
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveRun()});\r
setInterval(()=>{if(dirty)saveRun()},4000);\r
\r
/* ---------- init ---------- */\r
const savedLib=loadRun();\r
S.sheets.push(fakeSheet(),guideSheet());\r
if(savedLib)savedLib.sheets.filter(d=>d.name!=='Hướng dẫn').forEach(d=>S.sheets.push(restoreSheet(d)));\r
setTab('home');renderTabs();\r
activate(Math.max(1,S.sheets.findIndex(s=>s.name===(savedLib&&savedLib.active))));lw=sc.clientWidth;\r
if(savedLib)$('#stmsg').textContent='Đã mở lại thư viện đã lưu';\r
<\/script>\r
</body>\r
</html>`;export{e as default};