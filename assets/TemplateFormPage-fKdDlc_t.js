import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{D as r}from"./api-BLhdREU6.js";import{Mt as i,Tt as a,gt as o,vt as s,zt as c}from"./index-B6EoJC1H.js";var l=e(t(),1),u=/\bid=["']api_(\w+)["']/g,d=`data-api-bridge`,f={submit:{fnName:`apiSubmitAnswer`,params:`questionId, answerId`,body:`
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
      .then(function(r) { return r.json(); });`}};function p(e){if(!e||typeof e!=`string`)return[];let t=new Set,n;for(;(n=u.exec(e))!==null;)f[n[1]]&&t.add(n[1]);return[...t]}function m(e){if(!e||typeof e!=`string`)return e;let t=p(e);if(t.length===0)return e;let n=`(function(){
`;n+=`var apiBase="";
`,n+=`var gameId="";
`,n+=`window.addEventListener("message",function(e){
`,n+=`  var d=e&&e.data;
`,n+=`  if(d&&d.type==="init"&&d.data){
`,n+=`    apiBase=d.data.apiBase||"";
`,n+=`    gameId=d.data.gameId||"";
`,n+=`  }
`,n+=`});

`;for(let e of t){let t=f[e];n+=`window.${t.fnName}=function(${t.params}){\n`,n+=t.body+`
`,n+=`};

`}n+=`})();
`;let r=`<script ${d}>\n${n}<\/script>\n`,i=e.replace(RegExp(`<script ${d}>[\\s\\S]*?<\/script>`,`g`),``),a=i.lastIndexOf(`</body>`);return a===-1?i+r:i.slice(0,a)+r+i.slice(a)}var h=`1.0.0`,g=`
<!-- GAME_TASK_BRIDGE_START -->
<!-- GAME_TASK_BRIDGE_VERSION: ${h} -->
<script>
(function() {
  if (window.GameTaskBridge && window.GameTaskBridge.version === "${h}") return;
  window.GameTaskBridge = {
    version: "${h}",
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
`,_=`<!-- GAME_TASK_BRIDGE_START -->`,v=`<!-- GAME_TASK_BRIDGE_END -->`;function y(e){if(!e||typeof e!=`string`)return e;let t=e.indexOf(_),n=e.indexOf(v);if(t!==-1&&n!==-1){let r=n+29;return e.slice(0,t)+g.trim()+e.slice(r)}let r=e.lastIndexOf(`</body>`);return r===-1?e+`
`+g.trim():e.slice(0,r)+`
`+g.trim()+`
`+e.slice(r)}function b(e){return y(e)}var x=n(),S=[{value:`quiz`,label:`Trắc nghiệm`},{value:`reflex`,label:`Phản xạ`},{value:`science`,label:`Khoa học`},{value:`language`,label:`Ngôn ngữ`},{value:`math`,label:`Toán học`},{value:`geography`,label:`Địa lý`},{value:`history`,label:`Lịch sử`},{value:`puzzle`,label:`Puzzle`},{value:`strategy`,label:`Chiến thuật`},{value:`arcade`,label:`Arcade`},{value:`group`,label:`Theo nhóm`},{value:`seasonal`,label:`Lễ hội`},{value:`memory`,label:`Trí nhớ`},{value:`logic`,label:`Tư duy`},{value:`adventure`,label:`Phiêu lưu`}],C={name:``,description:``,type:`play-to-learn`,category:`quiz`,icon:`🎲`,ring:`#1D2E4A`,htmlTemplate:``,thumbnail:``,status:`draft`,playMode:`solo`};function w({showToast:e,route:t}){let n=t?.params?.templateId,u=!!n,[d,f]=(0,l.useState)({...C}),[h,g]=(0,l.useState)(u),[_,v]=(0,l.useState)(!1),[y,w]=(0,l.useState)(null),[T,E]=(0,l.useState)(`html`);(0,l.useEffect)(()=>{if(!u)return;let e=!0;return(async()=>{try{let t=(await r.list()).find(e=>e._id===n);if(!t){w(`Không tìm thấy template`);return}let a=await i(t,n);if(!e)return;f({name:t.name||``,description:t.description||``,type:t.type||`play-to-learn`,category:t.category||`quiz`,icon:t.icon||`🎲`,ring:t.ring||`#1D2E4A`,htmlTemplate:a,thumbnail:t.thumbnail||``,status:t.status||`draft`,playMode:t.playMode||`solo`})}catch(t){e&&w(t.message)}finally{e&&g(!1)}})(),()=>{e=!1}},[n,u]);let D=(e,t)=>{f(n=>({...n,[e]:t})),w(null)},O=async()=>{if(!d.name.trim()){w(`Tên template không được để trống`);return}v(!0),w(null);try{let t=p(d.htmlTemplate),i={...d,htmlTemplate:b(m(d.htmlTemplate))},a=(u?await r.update(n,i):await r.create(i))?.htmlTemplate,o=typeof a==`string`&&/^https?:\/\//i.test(a);e((t.length>0?`Auto-inject: ${t.join(`, `)} · `:``)+(o?`Đã lưu HTML lên Firebase Storage`:`Đã lưu (Firebase lỗi — HTML lưu trong DB)`)),c(`/admin/templates`)}catch(e){w(e.message||`Không thể lưu template`)}finally{v(!1)}},k=d.htmlTemplate?b(m(d.htmlTemplate)):``;return h?(0,x.jsx)(`div`,{className:`p-8 text-center text-ink/40`,children:`Đang tải...`}):(0,x.jsxs)(`div`,{className:`max-w-6xl mx-auto`,children:[(0,x.jsxs)(`div`,{className:`flex items-center justify-between mb-4`,children:[(0,x.jsx)(`h1`,{className:`font-display text-xl text-ink`,children:u?`✏️ Sửa Template`:`➕ Thêm Template`}),(0,x.jsx)(s,{onClick:()=>c(`/admin/templates`),children:`← Quay lại`})]}),(0,x.jsx)(`div`,{className:`flex gap-1 border-b border-ink/10 mb-4`,children:[{key:`info`,label:`Thông tin`},{key:`html`,label:`HTML`},{key:`preview`,label:`Preview`}].map(e=>(0,x.jsx)(`button`,{onClick:()=>E(e.key),className:`px-4 py-2 text-sm font-body transition-colors border-b-2 -mb-px ${T===e.key?`border-ticket text-ticket font-semibold`:`border-transparent text-ink/50 hover:text-ink`}`,children:e.label},e.key))}),T===`info`&&(0,x.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3`,children:[(0,x.jsx)(o,{label:`Tên template`,children:(0,x.jsx)(`input`,{value:d.name,onChange:e=>D(`name`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})}),(0,x.jsx)(o,{label:`Loại`,children:(0,x.jsxs)(`select`,{value:d.type,onChange:e=>D(`type`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:[(0,x.jsx)(`option`,{value:`play-to-learn`,children:`Play-to-Learn`}),(0,x.jsx)(`option`,{value:`play-to-win`,children:`Play-to-Win`})]})}),(0,x.jsx)(o,{label:`Thể loại`,children:(0,x.jsx)(`select`,{value:d.category,onChange:e=>D(`category`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:S.map(e=>(0,x.jsx)(`option`,{value:e.value,children:e.label},e.value))})}),(0,x.jsx)(o,{label:`Trạng thái`,children:(0,x.jsxs)(`select`,{value:d.status,onChange:e=>D(`status`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:[(0,x.jsx)(`option`,{value:`draft`,children:`Bản nháp`}),(0,x.jsx)(`option`,{value:`published`,children:`Xuất bản`}),(0,x.jsx)(`option`,{value:`inactive`,children:`Vô hiệu`})]})}),(0,x.jsx)(o,{label:`Chế độ chơi`,children:(0,x.jsxs)(`select`,{value:d.playMode,onChange:e=>D(`playMode`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket bg-paper2 text-sm`,children:[(0,x.jsx)(`option`,{value:`solo`,children:`Cá nhân (học sinh tự chơi)`}),(0,x.jsx)(`option`,{value:`coop`,children:`Co-op (chơi cùng bạn)`}),(0,x.jsx)(`option`,{value:`classroom`,children:`Lớp học (giáo viên điều khiển)`})]})}),(0,x.jsx)(o,{label:`Icon`,children:(0,x.jsx)(`input`,{value:d.icon,onChange:e=>D(`icon`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})}),(0,x.jsx)(o,{label:`Màu viền`,children:(0,x.jsxs)(`div`,{className:`flex items-center gap-1.5 mt-0.5`,children:[(0,x.jsx)(`input`,{type:`color`,value:d.ring,onChange:e=>D(`ring`,e.target.value),className:`w-7 h-7 rounded border border-ink/10 cursor-pointer flex-shrink-0`}),(0,x.jsx)(`input`,{value:d.ring,onChange:e=>D(`ring`,e.target.value),className:`w-full note-card px-2.5 py-1.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})]})}),(0,x.jsx)(o,{label:`Mô tả`,className:`sm:col-span-2 lg:col-span-3`,children:(0,x.jsx)(`textarea`,{value:d.description,onChange:e=>D(`description`,e.target.value),className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket min-h-[80px] text-sm`})}),(0,x.jsx)(o,{label:`Ảnh thumbnail`,className:`sm:col-span-2 lg:col-span-3`,children:(0,x.jsx)(`input`,{value:d.thumbnail,onChange:e=>D(`thumbnail`,e.target.value),placeholder:`/uploads/templates/example.png`,className:`w-full note-card px-3 py-1.5 mt-0.5 border-ink/10 focus:border-ticket text-sm`,autoComplete:`off`})})]}),T===`html`&&(0,x.jsxs)(`div`,{className:`flex flex-col h-[calc(100vh-220px)]`,children:[(0,x.jsx)(`textarea`,{value:d.htmlTemplate,onChange:e=>D(`htmlTemplate`,e.target.value),placeholder:`Dán HTML template vào đây...`,className:`flex-1 w-full note-card px-4 py-3 text-xs font-mono resize-none placeholder:text-ink/30 border-ink/10 focus:border-ticket`}),(0,x.jsxs)(`p`,{className:`text-xs text-ink/40 mt-1`,children:[`Sử dụng markers: `,(0,x.jsx)(`code`,{children:`GAME_API_INJECT`}),`, `,(0,x.jsx)(`code`,{children:`GAME_PROGRESS_INJECT`}),`, `,(0,x.jsx)(`code`,{children:`GAME_TASK_INJECT`}),` để tự inject bridge.`]})]}),T===`preview`&&(0,x.jsx)(`div`,{className:`border border-ink/10 rounded-lg overflow-hidden h-[calc(100vh-220px)]`,children:k?(0,x.jsx)(`iframe`,{srcDoc:k,className:`w-full h-full border-0`,title:`Preview`,sandbox:`allow-scripts allow-same-origin`}):(0,x.jsx)(`div`,{className:`flex items-center justify-center h-full text-ink/30 text-sm`,children:`Chưa có HTML để preview`})}),y&&(0,x.jsx)(`p`,{className:`text-ticket text-sm mt-3`,children:y}),(0,x.jsxs)(`div`,{className:`mt-4 flex items-center gap-2 justify-end border-t border-ink/10 pt-3`,children:[(0,x.jsx)(s,{onClick:()=>c(`/admin/templates`),children:`Hủy`}),(0,x.jsx)(a,{onClick:O,disabled:_,children:_?`Đang lưu...`:u?`Cập nhật`:`Thêm mới`})]})]})}export{w as default};