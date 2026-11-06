const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/plantvsanimal-QwsR72DL.js","assets/rolldown-runtime-C0FnF6B9.js"])))=>i.map(i=>d[i]);
import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{p as r,t as i,v as a}from"./api-Ds8_HBCA.js";import{t as o}from"./circle-question-mark-BHa-6p7m.js";import{t as s}from"./wifi-off-CM8a05_M.js";import{t as c}from"./preload-helper-C7XEsXvV.js";import{a as l,c as u,d,f,ht as p,l as m,o as h,on as ee,p as g,s as _,sr as v,u as y}from"./index-DnQ4CzKJ.js";import{t as b}from"./gameCache-C6NU21_B.js";var x=e(t(),1);function S(e,t=0){let[n,r]=(0,x.useState)(t),[i,a]=(0,x.useState)(!1),[o,s]=(0,x.useState)(!1),[c,u]=(0,x.useState)(null),d=(0,x.useCallback)(async()=>{if(e){s(!0);try{let n=await h.getVersion(e);n&&(r(n.version),a(n.version>t),u(new Date().toISOString()))}catch(t){console.error(`[useGameVersion] Lỗi kiểm tra phiên bản ${e}:`,t)}finally{s(!1)}}},[e,t]);return(0,x.useEffect)(()=>{if(!e)return;let n=l.subscribe(e,n=>{console.log(`[useGameVersion] Nhận thông báo cập nhật cho ${e}:`,n),r(n.version),a(n.version>t),u(new Date().toISOString())});return d(),()=>{n()}},[e,t,d]),(0,x.useEffect)(()=>{t>0&&n>0&&a(n>t)},[t,n]),{latestVersion:n,hasUpdate:i,checking:o,lastChecked:c,checkForUpdate:d,markAsUpdated:(0,x.useCallback)(()=>{a(!1),r(t)},[t])}}var C=`edu_offgames_pending_v1`,w=`edu_offgame_stamps_v1`,T=`edu_offgame_keys_v1`,E=`offline:`,D=262144,O=2500,k=2500,A=15e3,j=[`edu_`,`gq_`,`pwa-`],M=null,N=!1,P=!1,F=null,I=!1;function L(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function R(e,t){try{t?localStorage.setItem(e,JSON.stringify(t)):localStorage.removeItem(e)}catch{}}function z(e){return`${E}${e}`}function B(e,t){M?.keys.add(t);let n=L(T,{}),r=n[e]||(n[e]=[]);r.includes(t)||(r.push(t),R(T,n))}function V(e){return L(T,{})[e]||[]}function H(e,t){return Promise.race([e,new Promise((e,n)=>setTimeout(()=>n(Error(`timeout`)),t))])}function U(){if(N)return;N=!0;let e=Storage.prototype.setItem,t=Storage.prototype.removeItem;Storage.prototype.setItem=function(t,n){e.call(this,t,n),W(String(t))},Storage.prototype.removeItem=function(e){t.call(this,e),W(String(e))}}function W(e){if(!M||M.restoring||j.some(t=>e.startsWith(t)))return;B(M.gameId,e);let t=L(w,{}),n=t[M.gameId]||(t[M.gameId]={});n[e]=Date.now(),R(w,t),G()}function G(){F&&clearTimeout(F),F=setTimeout(()=>{F=null,q(),J()},k)}function K(){if(!M)return null;let e=L(w,{})[M.gameId]||{},t=new Set([...V(M.gameId),...M.keys]),n={},r=0;for(let i of t){let t=localStorage.getItem(i);if(t!==null){if(t.length>D||r+t.length>2097152){console.warn(`[offlineGameSync] Bỏ qua key quá lớn: ${i}`);continue}r+=t.length,n[i]={at:e[i]||Date.now(),val:t}}}return Object.keys(n).length?{v:1,entries:n}:null}function q(){if(!M)return;let e=K();if(!e)return;let t=L(C,{});t[M.gameId]={gameState:e,gameName:M.name,queuedAt:Date.now()},R(C,t)}async function J(){if(P||!a()?.token||typeof navigator<`u`&&navigator.onLine===!1)return;let e=L(C,{}),t=Object.keys(e);if(t.length){P=!0;try{for(let n of t){let t=e[n];try{await r.upsertGame(z(n),{gameName:t.gameName||n,gameState:t.gameState});let e=L(C,{});(!e[n]||e[n].queuedAt===t.queuedAt)&&delete e[n],R(C,e)}catch{}}}finally{P=!1}}}async function Y(e,t){X(),U(),Z(),M={gameId:e,name:t||e,keys:new Set,restoring:!0};let n=null;if(a()?.token&&navigator.onLine!==!1)try{n=(await H(r.getGame(z(e)),O))?.gameState?.entries||null}catch{}if(M&&M.gameId===e&&n){let t=L(w,{}),r=t[e]||(t[e]={});for(let[t,i]of Object.entries(n)){if(typeof i?.val!=`string`||i.val.length>D)continue;B(e,t);let n=localStorage.getItem(t);if(n===i.val){r[t]===void 0&&(r[t]=i.at||Date.now());continue}let a=r[t];n!==null&&(a===void 0||a>=(i.at||0))?r[t]=Date.now():(localStorage.setItem(t,i.val),r[t]=i.at||Date.now())}R(w,t)}M&&M.gameId===e&&(M.restoring=!1),J()}function X(){M&&(F&&(clearTimeout(F),F=null),M.restoring||q(),M=null,J())}function Z(){I||typeof window>`u`||(I=!0,window.addEventListener(`online`,J),document.addEventListener(`visibilitychange`,()=>{document.hidden||J()}),window.addEventListener(`pagehide`,()=>{M&&!M.restoring&&q()}),setInterval(()=>J(),A))}var Q=`/* ============================================================================
   tokens.css — NGUỒN SỰ THẬT DUY NHẤT về màu + font của game offline.
   Được nạp 2 nơi:
     · scripts/build-offline-games.mjs chèn vào <style> của lib/shell.html
       → 17 game sinh tự động dùng đúng biến này.
     · OfflineGamePage.jsx đọc bằng ?raw rồi tiêm vào <head> của MỌI game
       (kể cả game viết tay) → chạy trong app là cùng một bộ màu/font.
   Vì vậy file này CHỈ được chứa: biến :root, class .gq-*, và #homeBackBtn.
   Không viết selector trần (body, h1, .btn…) — tiêm vào game viết tay sẽ đè
   lên nền/tông màu riêng của chúng và làm hỏng theme.
   ========================================================================== */

:root {
  /* Bảng màu lấy từ ứng dụng (index.html + src/index.css) để game không lệch
     khỏi phần còn lại của trang khi nằm trong khung iframe. */
  --ink: #1d2e4a;
  --ink2: #16233a;
  --paper: #fff6e7;
  --card: #fffbf2;
  --bg: #fff3de;
  --stage: #fff6e7;
  --line: #e6dcc4;
  --sun: #f4b942;
  --gold: #f4b942;
  --tomato: #e4572e;
  --ticket: #e4572e;
  --mint: #1b998b;
  --teal: #1b998b;
  --accent: #1b998b;
  --onaccent: #ffffff;
  --sky: #4b9dff;
  --lilac: #8b5cf6;
  --purple: #8b5cf6;
  --pink: #ff6f91;
  --lime: #9bd44a;
  --amber: #f4b942;
  --coral: #ff8a6a;
  --ok: #22b573;
  --bad: #f0483e;
  --shadow: 4px 4px 0 var(--ink);

  /* Font: Baloo 2 có weight 800 (shell + đa số game viết tay đang dùng),
     Be Vietnam Pro cho chữ thường — thống nhất toàn bộ thư mục offline. */
  --head: "Baloo 2", "Fredoka", "Nunito", "Segoe UI", system-ui, sans-serif;
  --body: "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif;
}

/* Nút "về trang chủ" mà mọi game tự đặt ở góc trên-trái. Trong app thì React
   đã vẽ nút riêng nên CSS .gq-embedded ẩn cái này đi (xem OfflineGamePage). */
.gq-home-btn,
#homeBackBtn {
  position: fixed;
  z-index: 2147483000;
  top: calc(env(safe-area-inset-top, 0px) + 10px);
  left: calc(env(safe-area-inset-left, 0px) + 10px);
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: var(--head);
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  color: var(--ink);
  background: var(--card);
  border: 3px solid var(--ink);
  box-shadow: 0 4px 0 var(--ink), 0 8px 14px rgba(0, 0, 0, .22);
  transition: transform .12s, box-shadow .12s;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}

.gq-home-btn:hover,
#homeBackBtn:hover {
  filter: brightness(1.06);
}

.gq-home-btn:active,
#homeBackBtn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 var(--ink), 0 3px 6px rgba(0, 0, 0, .22);
}

.gq-home-btn:focus-visible,
#homeBackBtn:focus-visible {
  outline: 3px solid var(--sky);
  outline-offset: 2px;
}

/* HUD / panel / toast dùng chung cho game viết tay chưa có style riêng. */
.gq-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--card);
  border: 2.5px solid var(--ink);
  border-radius: 999px;
  padding: 5px 12px;
  font-family: var(--body);
  font-weight: 700;
  font-size: 14px;
  color: var(--ink);
}

.gq-panel {
  background: var(--card);
  border: 3px solid var(--ink);
  border-radius: 22px;
  padding: 20px;
  box-shadow: var(--shadow);
  color: var(--ink);
  font-family: var(--body);
}

.gq-btn {
  font-family: var(--head);
  font-weight: 800;
  border: 3px solid var(--ink);
  border-radius: 14px;
  padding: 12px 20px;
  font-size: 16px;
  color: var(--ink);
  background: var(--sun);
  box-shadow: 3px 3px 0 var(--ink);
  cursor: pointer;
  transition: transform .1s, box-shadow .1s;
}

.gq-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 var(--ink);
}

.gq-btn.alt {
  background: var(--card);
}

/* Nút "chơi lại" của game nằm cùng góc với nút của app → game nào tự đặt
   #back thì dời xuống dưới --gq-topbar (56px) để không đè lên nhau. */
:root {
  --gq-topbar: 56px;
  --gq-home-offset: calc(var(--gq-topbar) + 8px);
}

@media (prefers-reduced-motion:reduce) {

  .gq-home-btn,
  #homeBackBtn,
  .gq-btn {
    transition: none;
  }
}
`,$=n(),te=Object.fromEntries(Object.entries(Object.assign({"../games/offline/anagram.html":()=>c(()=>import(`./anagram-CkpKJjQd.js`).then(e=>e.default),[]),"../games/offline/apple-worm.html":()=>c(()=>import(`./apple-worm-chjEYhch.js`).then(e=>e.default),[]),"../games/offline/bug-smash.html":()=>c(()=>import(`./bug-smash-CcO0dHK-.js`).then(e=>e.default),[]),"../games/offline/cargo.html":()=>c(()=>import(`./cargo-qmr15d4O.js`).then(e=>e.default),[]),"../games/offline/chem.html":()=>c(()=>import(`./chem-Cqi0Atup.js`).then(e=>e.default),[]),"../games/offline/clock.html":()=>c(()=>import(`./clock-CTad0iVx.js`).then(e=>e.default),[]),"../games/offline/cloud-tower-climb.html":()=>c(()=>import(`./cloud-tower-climb-D-Ks7HwT.js`).then(e=>e.default),[]),"../games/offline/color-blocks.html":()=>c(()=>import(`./color-blocks-D0KJ2YUv.js`).then(e=>e.default),[]),"../games/offline/compare.html":()=>c(()=>import(`./compare-DiOMu28f.js`).then(e=>e.default),[]),"../games/offline/discovery-maze.html":()=>c(()=>import(`./discovery-maze-Bn2P453L.js`).then(e=>e.default),[]),"../games/offline/fieldrunner.html":()=>c(()=>import(`./fieldrunner-zsuAyx6r.js`).then(e=>e.default),[]),"../games/offline/find-the-number.html":()=>c(()=>import(`./find-the-number-JTEyaw-l.js`).then(e=>e.default),[]),"../games/offline/first-person-parkour.html":()=>c(()=>import(`./first-person-parkour-B9hkCcGH.js`).then(e=>e.default),[]),"../games/offline/flap.html":()=>c(()=>import(`./flap-BPAD8QC8.js`).then(e=>e.default),[]),"../games/offline/fruit-jar.html":()=>c(()=>import(`./fruit-jar-BGY6P3yz.js`).then(e=>e.default),[]),"../games/offline/fruit-slash.html":()=>c(()=>import(`./fruit-slash-B1csc5Pf.js`).then(e=>e.default),[]),"../games/offline/g2048.html":()=>c(()=>import(`./g2048-BVYDl8I5.js`).then(e=>e.default),[]),"../games/offline/garden-pairs.html":()=>c(()=>import(`./garden-pairs-BfrLR0y4.js`).then(e=>e.default),[]),"../games/offline/happy-farm.html":()=>c(()=>import(`./happy-farm-BAyo8Qar.js`).then(e=>e.default),[]),"../games/offline/kids-spreadsheet.html":()=>c(()=>import(`./kids-spreadsheet-i3CRK8sP.js`).then(e=>e.default),[]),"../games/offline/knowledge-maze.html":()=>c(()=>import(`./knowledge-maze-DzWr7QXQ.js`).then(e=>e.default),[]),"../games/offline/labyrinth.html":()=>c(()=>import(`./labyrinth-CTudlLYN.js`).then(e=>e.default),[]),"../games/offline/math.html":()=>c(()=>import(`./math-DaUulj3p.js`).then(e=>e.default),[]),"../games/offline/memory.html":()=>c(()=>import(`./memory-DXFnNgMw.js`).then(e=>e.default),[]),"../games/offline/merge-and-blast.html":()=>c(()=>import(`./merge-and-blast-BwZV1V3l.js`).then(e=>e.default),[]),"../games/offline/neon-brick-breaker.html":()=>c(()=>import(`./neon-brick-breaker-DcWRZ50H.js`).then(e=>e.default),[]),"../games/offline/night-strike.html":()=>c(()=>import(`./night-strike-DhBjyi5V.js`).then(e=>e.default),[]),"../games/offline/parkour-3d-pro.html":()=>c(()=>import(`./parkour-3d-pro-BxVR5Gea.js`).then(e=>e.default),[]),"../games/offline/pattern.html":()=>c(()=>import(`./pattern-C1zbMjWJ.js`).then(e=>e.default),[]),"../games/offline/plantvsanimal.html":()=>c(()=>import(`./plantvsanimal-QwsR72DL.js`).then(e=>e.n).then(e=>e.default),__vite__mapDeps([0,1])),"../games/offline/quiz.html":()=>c(()=>import(`./quiz-B8zonJOA.js`).then(e=>e.default),[]),"../games/offline/relax-corner.html":()=>c(()=>import(`./relax-corner-Ca5rzzgh.js`).then(e=>e.default),[]),"../games/offline/riddle.html":()=>c(()=>import(`./riddle-DxXiUmVE.js`).then(e=>e.default),[]),"../games/offline/scramble.html":()=>c(()=>import(`./scramble-BleRb991.js`).then(e=>e.default),[]),"../games/offline/shapecount.html":()=>c(()=>import(`./shapecount-C_opw8rr.js`).then(e=>e.default),[]),"../games/offline/simon.html":()=>c(()=>import(`./simon-jv_9i7Ip.js`).then(e=>e.default),[]),"../games/offline/snake.html":()=>c(()=>import(`./snake-yNWpTqoO.js`).then(e=>e.default),[]),"../games/offline/spin-jump.html":()=>c(()=>import(`./spin-jump-C282oqFE.js`).then(e=>e.default),[]),"../games/offline/spirit-realm.html":()=>c(()=>import(`./spirit-realm-BdsdrSsU.js`).then(e=>e.default),[]),"../games/offline/stroop.html":()=>c(()=>import(`./stroop-BfMtcAl4.js`).then(e=>e.default),[]),"../games/offline/sumseq.html":()=>c(()=>import(`./sumseq-CsS5cUZ2.js`).then(e=>e.default),[]),"../games/offline/temple-run-2d.html":()=>c(()=>import(`./temple-run-2d-DcOp7Hcp.js`).then(e=>e.default),[]),"../games/offline/windland.html":()=>c(()=>import(`./windland-DSK032OK.js`).then(e=>e.default),[])})).map(([e,t])=>[e.split(`/`).pop().replace(/\.html$/,``).toLowerCase(),t])),ne=`<style>html.gq-embedded #homeBackBtn,html.gq-embedded .bar>.back{display:none!important}html.gq-embedded #app{padding-top:56px!important}html.gq-embedded .sq#back{top:64px!important}</style><script>try{if(window.parent&&window.parent!==window)document.documentElement.classList.add("gq-embedded")}catch(e){}<\/script>`,re=`<script>(function(){window.addEventListener("message",function(ev){var d=ev.data;if(!d||d.type!=="gq:flush")return;try{if(typeof window.__gqFlush==="function")window.__gqFlush();}catch(e){}try{window.dispatchEvent(new CustomEvent("gq:flush"));}catch(e){}try{document.dispatchEvent(new CustomEvent("gq:flush"));}catch(e){}try{ev.source&&ev.source.postMessage({type:"gq:flushed"},"*");}catch(e){}});})();<\/script>`,ie=`<script>window.EG_API_BASE=${JSON.stringify(i)};<\/script>`;function ae(e){let t=`<style id="gq-tokens">${Q}</style>`,n=`${ie}${ne}${re}`,r=/<head[^>]*>/i.test(e)?e.replace(/<head[^>]*>/i,e=>`${e}${t}`):`${t}${e}`;return/<\/body>/i.test(r)?r.replace(/<\/body>/i,()=>`${n}</body>`):r+n}function oe({gameId:e}){let t=(0,x.useRef)(null),n=g(e),r=n===`School_mission`||n===`school-mission`;(0,x.useEffect)(()=>{r&&v(`/school-mission`)},[r]);let i=r?void 0:te[String(n||``).toLowerCase()],[a,c]=(0,x.useState)({id:null,html:null,failed:!1});(0,x.useEffect)(()=>{if(!i)return;let e=!1;return i().then(t=>{if(e)return;let r=typeof t==`string`?t:t?.default;c(typeof r==`string`?{id:n,html:r,failed:!1}:{id:n,html:null,failed:!0})}).catch(()=>{e||c({id:n,html:null,failed:!0})}),()=>{e=!0}},[n,i]);let l=a.id===n&&a.html!=null,C=l?a.html:null,w=a.id===n&&a.failed,[T,E]=(0,x.useState)(!1),[D,O]=(0,x.useState)(void 0),[k,A]=(0,x.useState)(null),[j,M]=(0,x.useState)(null),N=(0,x.useRef)(null),P=(0,x.useRef)(null),F=e=>{let n=t.current?.contentWindow;n&&n.postMessage({type:`gq:wallet`,...e,online:navigator.onLine},`*`)},I=(0,x.useCallback)(()=>new Promise(e=>{let n=t.current?.contentWindow;if(!n)return e();let r=!1,i=()=>{r||(r=!0,window.removeEventListener(`message`,a),clearTimeout(o),e())};function a(e){e.source===n&&e.data?.type===`gq:flushed`&&i()}window.addEventListener(`message`,a);let o=setTimeout(i,250);try{n.postMessage({type:`gq:flush`},`*`)}catch{i()}}),[]),L=(0,x.useCallback)(()=>{I().then(()=>v(`/`))},[I]),R=(0,x.useMemo)(()=>C?d(n)||f(n,C):null,[n,C]);(0,x.useEffect)(()=>{if(!i)return;let e=!1;return Y(n,d(n)?.name).finally(()=>{e||M(n)}),()=>{e=!0,X()}},[n,i]);let z=j===n,B=z&&l,{hasUpdate:V,checkForUpdate:H,markAsUpdated:U}=S(R?.playMode===`offline`&&D!==void 0?n:null,D||0);return(0,x.useEffect)(()=>{if(!i)return;let e=!1,r=()=>{let e=t.current?.contentWindow;e&&N.current&&e.postMessage({type:`gq:gameData`,...N.current},`*`)};return P.current=r,(async()=>{let t=await b.getRecord(n).catch(()=>null);if(!e&&(O(t?.version||0),t&&(N.current={data:t.data,version:t.version},r(),navigator.onLine||A({version:t.version,cachedAt:t.cachedAt})),navigator.onLine))try{let[t,i]=await Promise.all([h.getData(n),h.getVersion(n)]);if(e)return;if(t){let e=i?.version||0;await b.save(n,t,e).catch(()=>{}),N.current={data:t,version:e},r(),O(e),A(null)}}catch{}})(),()=>{e=!0,P.current=null}},[n,i]),(0,x.useEffect)(()=>{let e=e=>{e.source===t.current?.contentWindow&&(e.data?.type===`quit`&&L(),e.data?.type===`gq:walletGet`&&(F(m()),u().then(F)),e.data?.type===`gq:walletDelta`&&F(_(Number(e.data.data?.amount)||0)))};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[L]),(0,x.useEffect)(()=>{let e=!1,t=()=>u().then(t=>{e||F(t)}),n=()=>F(m());t();let r=y(n);return window.addEventListener(`online`,t),window.addEventListener(`offline`,n),()=>{e=!0,r(),window.removeEventListener(`online`,t),window.removeEventListener(`offline`,n)}},[]),(0,x.useEffect)(()=>{V&&R?.playMode===`offline`&&E(!0)},[V,R]),r?(0,$.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,$.jsx)(p,{label:`Đang mở Trường Vui Vẻ...`})}):i?w?(0,$.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,$.jsxs)(`div`,{className:`text-center max-w-md px-5`,children:[(0,$.jsx)(`div`,{className:`flex justify-center text-ink/25`,children:(0,$.jsx)(o,{className:`w-12 h-12`})}),(0,$.jsx)(`p`,{className:`mt-3 font-display text-lg font-bold text-ink`,children:`Không tải được game`}),(0,$.jsxs)(`p`,{className:`mt-1 text-sm text-ink/60`,children:[`id: `,String(n||`(rỗng)`)]}),(0,$.jsx)(`p`,{className:`mt-3 text-xs text-ink/45`,children:`File game chưa tải về được (mạng chập chờn hoặc bản mới đang cập nhật). Hãy thử tải lại trang.`}),(0,$.jsxs)(`div`,{className:`mt-4 flex justify-center gap-2`,children:[(0,$.jsx)(`button`,{onClick:()=>window.location.reload(),className:`rounded-full border-2 border-ink bg-paper2 px-4 py-2 text-sm font-extrabold text-ink shadow-sm hover:bg-white`,children:`Tải lại trang`}),(0,$.jsx)(`button`,{onClick:()=>v(`/`),className:`rounded-full border-2 border-ink/10 bg-paper2 px-4 py-2 text-sm font-extrabold text-ink/70 shadow-sm hover:bg-ink/5`,children:`← Về trang chủ`})]})]})}):(0,$.jsxs)(`div`,{className:`fixed inset-0 bg-paper`,children:[(0,$.jsxs)(`div`,{className:`absolute top-3 left-3 z-20 flex items-center gap-2`,children:[(0,$.jsx)(`button`,{type:`button`,onClick:L,className:`rounded-full border-2 border-ink bg-paper2 px-3 py-1.5 text-sm font-extrabold text-ink shadow hover:bg-white`,"aria-label":`Về trang chủ`,children:`← Trang chủ`}),n===`fieldrunner`&&(0,$.jsx)(`span`,{className:`rounded-full border-2 border-ink bg-[#ffe9a8] px-3 py-1.5 text-xs font-extrabold text-ink shadow`,children:`💰 Dùng xu tài khoản`})]}),B?(0,$.jsx)(`iframe`,{ref:t,title:R.name,srcDoc:ae(C),onLoad:()=>{P.current?.(),F(m())},sandbox:`allow-scripts allow-same-origin`,className:`h-full w-full border-0`}):(0,$.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,$.jsx)(p,{label:z?`Đang tải game...`:`Đang tải dữ liệu đã lưu...`})}),k&&(0,$.jsxs)(`div`,{className:`fixed bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-lg`,children:[(0,$.jsx)(s,{className:`w-3.5 h-3.5`}),` Ngoại tuyến — đang dùng dữ liệu đã lưu (bản v`,k.version,`)`]}),T&&(0,$.jsx)(`div`,{className:`fixed top-4 right-4 z-50 max-w-sm`,children:(0,$.jsx)(`div`,{className:`rounded-xl border-2 border-teal bg-paper2 p-4 shadow-lg`,children:(0,$.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,$.jsx)(`div`,{className:`text-teal`,children:(0,$.jsx)(ee,{className:`w-6 h-6`})}),(0,$.jsxs)(`div`,{className:`flex-1`,children:[(0,$.jsx)(`h3`,{className:`font-display text-sm font-bold text-ink`,children:`Có phiên bản mới!`}),(0,$.jsxs)(`p`,{className:`mt-1 text-xs text-ink/60`,children:[`Game "`,R.name,`" đã có phiên bản mới. Cập nhật để trải nghiệm tốt hơn.`]}),(0,$.jsxs)(`div`,{className:`mt-3 flex gap-2`,children:[(0,$.jsx)(`button`,{onClick:async()=>{if(!(!R||R.playMode!==`offline`)){try{let[e,t]=await Promise.all([h.getData(n),h.getVersion(n)]);e&&await b.save(n,e,t?.version||0).catch(()=>{})}catch(e){console.error(`Lỗi cập nhật game:`,e)}U(),E(!1),window.location.reload()}},className:`flex-1 rounded-lg bg-teal px-3 py-2 text-xs font-bold text-white hover:bg-teal/90`,children:`Cập nhật ngay`}),(0,$.jsx)(`button`,{onClick:()=>E(!1),className:`flex-1 rounded-lg border-2 border-ink/10 bg-white px-3 py-2 text-xs font-bold text-ink/70 hover:bg-ink/5`,children:`Để sau`})]})]})]})})})]}):(0,$.jsx)(`div`,{className:`fixed inset-0 grid place-items-center bg-paper`,children:(0,$.jsxs)(`div`,{className:`text-center max-w-md px-5`,children:[(0,$.jsx)(`div`,{className:`flex justify-center text-ink/25`,children:(0,$.jsx)(o,{className:`w-12 h-12`})}),(0,$.jsx)(`p`,{className:`mt-3 font-display text-lg font-bold text-ink`,children:`Không tìm thấy game`}),(0,$.jsxs)(`p`,{className:`mt-1 text-sm text-ink/60`,children:[`id: `,String(n||`(rỗng)`)]}),(0,$.jsxs)(`p`,{className:`mt-3 text-xs text-ink/45`,children:[`Kiểm tra file `,(0,$.jsxs)(`code`,{className:`rounded bg-black/5 px-1.5 py-0.5`,children:[`src/games/offline/`,String(n),`.html`]}),` `,`có tồn tại không. Nếu vừa thêm file, hãy tải lại trang (F5).`]}),(0,$.jsx)(`button`,{onClick:()=>v(`/`),className:`mt-4 rounded-full border-2 border-ink/10 bg-paper2 px-4 py-2 text-sm font-extrabold text-ink/70 shadow-sm hover:bg-ink/5`,children:`← Về trang chủ`})]})})}export{oe as default};