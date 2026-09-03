import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{x as r}from"./api-CvqPr9ko.js";import{$ as i,Z as a,_t as o,ot as s}from"./index-CqMDUCzs.js";var c=e(t(),1),l=/\bid=["']api_(\w+)["']/g,u=`data-api-bridge`,d={submit:{fnName:`apiSubmitAnswer`,params:`questionId, answerId`,body:`
    if (!apiBase) return Promise.reject(new Error("apiBase not ready"));
    return fetch(apiBase + "/games/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: questionId, answerId: answerId })
    }).then(function(r) { return r.json(); });`},questions:{fnName:`apiGetQuestions`,params:`gameId`,body:`
    if (!apiBase) return Promise.reject(new Error("apiBase not ready"));
    return fetch(apiBase + "/questions/game/" + encodeURIComponent(gameId))
      .then(function(r) { return r.json(); });`},players:{fnName:`apiGetPlayers`,params:`gameId`,body:`
    if (!apiBase) return Promise.reject(new Error("apiBase not ready"));
    return fetch(apiBase + "/games/" + encodeURIComponent(gameId) + "/players")
      .then(function(r) { return r.json(); });`}};function f(e){if(!e||typeof e!=`string`)return[];let t=new Set,n;for(;(n=l.exec(e))!==null;)d[n[1]]&&t.add(n[1]);return[...t]}function p(e){if(!e||typeof e!=`string`)return e;let t=f(e);if(t.length===0)return e;let n=`(function(){
`;n+=`var apiBase="";
`,n+=`var gameId="";
`,n+=`window.addEventListener("message",function(e){
`,n+=`  var d=e&&e.data;
`,n+=`  if(d&&d.type==="init"&&d.data){
`,n+=`    apiBase=d.data.apiBase||"";
`,n+=`    gameId=d.data.gameId||"";
`,n+=`  }
`,n+=`});

`;for(let e of t){let t=d[e];n+=`window.${t.fnName}=function(${t.params}){\n`,n+=t.body+`
`,n+=`};

`}n+=`})();
`;let r=`<script ${u}>\n${n}<\/script>\n`,i=e.replace(RegExp(`<script ${u}>[\\s\\S]*?<\/script>`,`g`),``),a=i.lastIndexOf(`</body>`);return a===-1?i+r:i.slice(0,a)+r+i.slice(a)}var m=`1.0.0`,h=`
<!-- GAME_TASK_BRIDGE_START -->
<!-- GAME_TASK_BRIDGE_VERSION: ${m} -->
<script>
(function() {
  if (window.GameTaskBridge && window.GameTaskBridge.version === "${m}") return;
  window.GameTaskBridge = {
    version: "${m}",
    emit: function(type, data) {
      try {
        window.parent.postMessage({
          source: "game",
          type: type,
          data: data || {}
        }, "*");
      } catch(e) { /* ignore */ }
    }
  };
})();
<\/script>
<!-- GAME_TASK_BRIDGE_END -->
`,g=`<!-- GAME_TASK_BRIDGE_START -->`,_=`<!-- GAME_TASK_BRIDGE_END -->`;function v(e){if(!e||typeof e!=`string`)return e;let t=e.indexOf(g),n=e.indexOf(_);if(t!==-1&&n!==-1){let r=n+29;return e.slice(0,t)+h.trim()+e.slice(r)}let r=e.lastIndexOf(`</body>`);return r===-1?e+`
`+h.trim():e.slice(0,r)+`
`+h.trim()+`
`+e.slice(r)}function y(e){return v(e)}var b=n(),x=[{value:`quiz`,label:`Trắc nghiệm`},{value:`reflex`,label:`Phản xạ`},{value:`science`,label:`Khoa học`},{value:`language`,label:`Ngôn ngữ`},{value:`math`,label:`Toán học`},{value:`geography`,label:`Địa lý`},{value:`history`,label:`Lịch sử`},{value:`puzzle`,label:`Puzzle`},{value:`strategy`,label:`Chiến thuật`},{value:`arcade`,label:`Arcade`},{value:`group`,label:`Theo nhóm`},{value:`seasonal`,label:`Lễ hội`},{value:`memory`,label:`Trí nhớ`},{value:`logic`,label:`Tư duy`},{value:`adventure`,label:`Phiêu lưu`}],S={name:``,description:``,type:`play-to-learn`,category:`quiz`,icon:`🎲`,ring:`#1D2E4A`,htmlTemplate:``,thumbnail:``,status:`draft`,playMode:`solo`};function C({showToast:e,route:t}){let n=t?.params?.templateId,l=!!n,[u,d]=(0,c.useState)({...S}),[m,h]=(0,c.useState)(l),[g,_]=(0,c.useState)(!1),[v,C]=(0,c.useState)(null),[w,T]=(0,c.useState)(`html`);(0,c.useEffect)(()=>{l&&r.list().then(e=>{let t=e.find(e=>e._id===n);t?d({name:t.name||``,description:t.description||``,type:t.type||`play-to-learn`,category:t.category||`quiz`,icon:t.icon||`🎲`,ring:t.ring||`#1D2E4A`,htmlTemplate:t.htmlTemplate||``,thumbnail:t.thumbnail||``,status:t.status||`draft`,playMode:t.playMode||`solo`}):C(`Không tìm thấy template`)}).catch(e=>C(e.message)).finally(()=>h(!1))},[n,l]);let E=(e,t)=>{d(n=>({...n,[e]:t})),C(null)},D=async()=>{if(!u.name.trim()){C(`Tên template không được để trống`);return}_(!0),C(null);try{let t=f(u.htmlTemplate),i={...u,htmlTemplate:y(p(u.htmlTemplate))};l?(await r.update(n,i),e(t.length>0?`Đã cập nhật (auto-inject: ${t.join(`, `)})`:`Đã cập nhật template`)):(await r.create(i),e(t.length>0?`Đã tạo mới (auto-inject: ${t.join(`, `)})`:`Đã tạo template mới`)),o(`/admin/templates`)}catch(e){C(e.message||`Không thể lưu template`)}finally{_(!1)}},O=u.htmlTemplate?y(p(u.htmlTemplate)):``;return m?(0,b.jsx)(`div`,{className:`p-8 text-center text-ink/40`,children:`Đang tải...`}):(0,b.jsxs)(`div`,{className:`max-w-6xl mx-auto`,children:[(0,b.jsxs)(`div`,{className:`flex items-center justify-between mb-4`,children:[(0,b.jsx)(`h1`,{className:`font-display text-xl text-ink`,children:l?`✏️ Sửa Template`:`➕ Thêm Template`}),(0,b.jsx)(i,{onClick:()=>o(`/admin/templates`),children:`← Quay lại`})]}),(0,b.jsx)(`div`,{className:`flex gap-1 border-b border-ink/10 mb-4`,children:[{key:`info`,label:`Thông tin`},{key:`html`,label:`HTML`},{key:`preview`,label:`Preview`}].map(e=>(0,b.jsx)(`button`,{onClick:()=>T(e.key),className:`px-4 py-2 text-sm font-body transition-colors border-b-2 -mb-px ${w===e.key?`border-ticket text-ticket font-semibold`:`border-transparent text-ink/50 hover:text-ink`}`,children:e.label},e.key))}),w===`info`&&(0,b.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3`,children:[(0,b.jsx)(a,{label:`Tên template`,children:(0,b.jsx)(`input`,{value:u.name,onChange:e=>E(`name`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})}),(0,b.jsx)(a,{label:`Loại`,children:(0,b.jsxs)(`select`,{value:u.type,onChange:e=>E(`type`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:[(0,b.jsx)(`option`,{value:`play-to-learn`,children:`Play-to-Learn`}),(0,b.jsx)(`option`,{value:`play-to-win`,children:`Play-to-Win`})]})}),(0,b.jsx)(a,{label:`Thể loại`,children:(0,b.jsx)(`select`,{value:u.category,onChange:e=>E(`category`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:x.map(e=>(0,b.jsx)(`option`,{value:e.value,children:e.label},e.value))})}),(0,b.jsx)(a,{label:`Trạng thái`,children:(0,b.jsxs)(`select`,{value:u.status,onChange:e=>E(`status`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:[(0,b.jsx)(`option`,{value:`draft`,children:`Bản nháp`}),(0,b.jsx)(`option`,{value:`published`,children:`Xuất bản`}),(0,b.jsx)(`option`,{value:`inactive`,children:`Vô hiệu`})]})}),(0,b.jsx)(a,{label:`Chế độ chơi`,children:(0,b.jsxs)(`select`,{value:u.playMode,onChange:e=>E(`playMode`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:[(0,b.jsx)(`option`,{value:`solo`,children:`Cá nhân (học sinh tự chơi)`}),(0,b.jsx)(`option`,{value:`classroom`,children:`Lớp học (giáo viên điều khiển)`})]})}),(0,b.jsx)(a,{label:`Icon`,children:(0,b.jsx)(`input`,{value:u.icon,onChange:e=>E(`icon`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})}),(0,b.jsx)(a,{label:`Màu viền`,children:(0,b.jsxs)(`div`,{className:`flex items-center gap-1.5 mt-0.5`,children:[(0,b.jsx)(`input`,{type:`color`,value:u.ring,onChange:e=>E(`ring`,e.target.value),className:`w-7 h-7 rounded border border-ink/10 cursor-pointer flex-shrink-0`}),(0,b.jsx)(`input`,{value:u.ring,onChange:e=>E(`ring`,e.target.value),className:`w-full note-card px-2.5 py-1.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})]})}),(0,b.jsx)(a,{label:`Mô tả`,className:`sm:col-span-2 lg:col-span-3`,children:(0,b.jsx)(`textarea`,{value:u.description,onChange:e=>E(`description`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket min-h-[80px] text-sm`})}),(0,b.jsx)(a,{label:`Ảnh thumbnail`,className:`sm:col-span-2 lg:col-span-3`,children:(0,b.jsx)(`input`,{value:u.thumbnail,onChange:e=>E(`thumbnail`,e.target.value),placeholder:`/uploads/templates/example.png`,className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})})]}),w===`html`&&(0,b.jsxs)(`div`,{className:`flex flex-col h-[calc(100vh-220px)]`,children:[(0,b.jsx)(`textarea`,{value:u.htmlTemplate,onChange:e=>E(`htmlTemplate`,e.target.value),placeholder:`Dán HTML template vào đây...`,className:`flex-1 w-full note-card px-4 py-3 text-xs font-mono resize-none placeholder:text-ink/30 border-ink/10 focus:border-ticket`}),(0,b.jsxs)(`p`,{className:`text-xs text-ink/40 mt-1`,children:[`Sử dụng markers: `,(0,b.jsx)(`code`,{children:`GAME_API_INJECT`}),`, `,(0,b.jsx)(`code`,{children:`GAME_PROGRESS_INJECT`}),`, `,(0,b.jsx)(`code`,{children:`GAME_TASK_INJECT`}),` để tự inject bridge.`]})]}),w===`preview`&&(0,b.jsx)(`div`,{className:`border border-ink/10 rounded-lg overflow-hidden h-[calc(100vh-220px)]`,children:O?(0,b.jsx)(`iframe`,{srcDoc:O,className:`w-full h-full border-0`,title:`Preview`,sandbox:`allow-scripts allow-same-origin`}):(0,b.jsx)(`div`,{className:`flex items-center justify-center h-full text-ink/30 text-sm`,children:`Chưa có HTML để preview`})}),v&&(0,b.jsx)(`p`,{className:`text-ticket text-sm mt-3`,children:v}),(0,b.jsxs)(`div`,{className:`mt-4 flex items-center gap-2 justify-end border-t border-ink/10 pt-3`,children:[(0,b.jsx)(i,{onClick:()=>o(`/admin/templates`),children:`Hủy`}),(0,b.jsx)(s,{onClick:D,disabled:g,children:g?`Đang lưu...`:l?`Cập nhật`:`Thêm mới`})]})]})}export{C as default};