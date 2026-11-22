import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{t as r}from"./x-C9bgAm8K.js";import{t as i}from"./createLucideIcon-DMZCQHJW.js";import{t as a}from"./arrow-left-DwsZL7rA.js";import{t as o}from"./ban-DDLKAR4U.js";import{t as s}from"./dices-CRb824XT.js";import{t as c}from"./rotate-ccw-FH5M-rG9.js";import{t as l}from"./save-BhPneH_G.js";import{a as u,d,i as f,l as p,n as m,r as h,s as g}from"./dressUpAvatar-COpA7aKb.js";import{_,br as v,fr as y,vr as b,xr as x}from"./index-BFfUCki4.js";var S=i(`arrow-big-up`,[[`path`,{d:`M9 19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6a1 1 0 0 1 1-1h3.293a.707.707 0 0 0 .5-1.207l-7.086-7.086a1 1 0 0 0-1.414 0l-7.086 7.086a.707.707 0 0 0 .5 1.207H8a1 1 0 0 1 1 1z`,key:`106j91`}]]),C=i(`footprints`,[[`path`,{d:`M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z`,key:`1dudjm`}],[`path`,{d:`M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z`,key:`l2t8xc`}],[`path`,{d:`M16 17h4`,key:`1dejxt`}],[`path`,{d:`M4 13h4`,key:`1bwh8b`}]]),w=i(`rotate-3d`,[[`path`,{d:`m15.194 13.707 3.814 1.86-1.86 3.814`,key:`16shm9`}],[`path`,{d:`M16.47214 7.52786 A 5 10 0 1 0 13 21.79796`,key:`1245p8`}],[`path`,{d:`M21.79796 11 A 10 5 0 1 0 19 15.57071`,key:`1i40ks`}]]),T=e(t(),1),E=n(),D=26,O=560,k=700,A=620;function j({children:e,bounds:t,jumpSignal:n=0,className:r=``,controlsLabel:i=`Điều khiển nhân vật`}){let o=(0,T.useRef)(null),[s,c]=(0,T.useState)(90),l=t??s,[u,d]=(0,T.useState)(0),[f,p]=(0,T.useState)(1),[m,h]=(0,T.useState)(`idle`),[g,_]=(0,T.useState)(!1),v=(0,T.useRef)(null),y=(0,T.useRef)(1),x=(0,T.useRef)(0),w=(0,T.useRef)(1),j=(0,T.useRef)(!1),M=(0,T.useRef)(n);(0,T.useEffect)(()=>{if(t!=null)return;let e=o.current;if(!e||typeof ResizeObserver>`u`)return;let n=()=>{let t=e.clientWidth||0;c(Math.max(30,Math.floor(t/2-90)))};n();let r=new ResizeObserver(n);return r.observe(e),()=>r.disconnect()},[t]);let N=(0,T.useCallback)(e=>Math.max(-l,Math.min(l,e)),[l]),P=(0,T.useCallback)((e,t)=>{h(e),v.current&&window.clearTimeout(v.current),v.current=window.setTimeout(()=>h(j.current?`walk`:`idle`),t)},[]),F=(0,T.useCallback)(e=>{let t=N(e);return x.current=t,d(t),t},[N]),I=(0,T.useCallback)(e=>{_(!1),w.current!==e&&(w.current=e,p(e)),F(x.current+e*D),P(`walk`,O)},[F,P]),L=(0,T.useCallback)(()=>{P(`jump`,k)},[P]);(0,T.useEffect)(()=>{n!==M.current&&(M.current=n,L())},[n,L]),(0,T.useEffect)(()=>{if(j.current=g,!g)return;let e=window.setInterval(()=>{let e=y.current,t=x.current+e*D;(t>l||t<-l)&&(e=-e,y.current=e),w.current!==e&&(w.current=e,p(e)),F(x.current+e*D),h(`walk`)},A);return()=>window.clearInterval(e)},[g,l,F]),(0,T.useEffect)(()=>()=>{v.current&&window.clearTimeout(v.current)},[]);let R=e=>{e.key===`ArrowLeft`?(e.preventDefault(),I(-1)):e.key===`ArrowRight`?(e.preventDefault(),I(1)):(e.key===` `||e.key===`Spacebar`)&&(e.preventDefault(),L())},z=e=>e.stopPropagation();return(0,E.jsxs)(`div`,{ref:o,className:`mav relative outline-none ${r}`,tabIndex:0,role:`application`,"aria-label":`${i}. Dùng phím mũi tên trái phải để đi, phím cách để nhảy.`,onKeyDown:R,"data-motion":m,"data-pos-x":u,"data-facing":f,children:[(0,E.jsx)(`div`,{className:`mav__figure will-change-transform`,style:{transform:`translateX(${u}px) scaleX(${f})`,transition:`transform 240ms ease`},children:(0,E.jsx)(`div`,{className:`av-state-${m}`,children:e})}),(0,E.jsx)(`div`,{className:`mav__shadow pointer-events-none`,"aria-hidden":`true`,style:{transform:`translateX(calc(-50% + ${u}px)) scale(${m===`jump`?.58:1})`,opacity:m===`jump`?.45:1}}),(0,E.jsxs)(`div`,{className:`mav__controls`,onPointerDown:z,onClick:z,children:[(0,E.jsxs)(`button`,{type:`button`,className:`mav__btn`,onClick:()=>I(-1),"aria-label":`Đi sang trái`,children:[(0,E.jsx)(a,{size:15}),(0,E.jsx)(`span`,{children:`Trái`})]}),(0,E.jsxs)(`button`,{type:`button`,className:`mav__btn`,onClick:()=>I(1),"aria-label":`Đi sang phải`,children:[(0,E.jsx)(b,{size:15}),(0,E.jsx)(`span`,{children:`Phải`})]}),(0,E.jsxs)(`button`,{type:`button`,className:`mav__btn`,onClick:L,"aria-label":`Nhảy lên`,children:[(0,E.jsx)(S,{size:15}),(0,E.jsx)(`span`,{children:`Nhảy`})]}),(0,E.jsxs)(`button`,{type:`button`,className:`mav__btn${g?` mav__btn--on`:``}`,onClick:()=>_(e=>!e),"aria-pressed":g,"aria-label":`Tự đi dạo`,children:[(0,E.jsx)(C,{size:15}),(0,E.jsx)(`span`,{children:g?`Dừng dạo`:`Tự đi dạo`})]})]}),(0,E.jsx)(`style`,{children:`
        .mav__shadow {
          position: absolute;
          left: 50%;
          bottom: 34px;
          width: 46%;
          max-width: 190px;
          height: 16px;
          border-radius: 999px;
          background: radial-gradient(ellipse at center, rgba(30, 20, 10, 0.28), rgba(30, 20, 10, 0) 70%);
          transition: transform 240ms ease, opacity 200ms ease;
          z-index: 0;
        }
        /* Chuỗi chiều cao PHẢI liền mạch từ .mav xuống nhân vật:
         * CharacterStage (.character-stage) dùng height:100% và mọi con
         * của nó đều position:absolute — thiếu height ở .mav__figure /
         * lớp .av-state-* là sân khấu sập về 0px, nhân vật biến mất dù
         * nút điều khiển (absolute) vẫn hiện. Trang chủ không dính vì
         * .gq-hero__char có height cố định và CharacterStage là con trực
         * tiếp, không qua hai lớp bọc này. */
        .mav { height: 100%; }
        .mav__figure { position: relative; z-index: 1; height: 100%; }
        .mav__figure > div { height: 100%; }
        .mav__controls {
          position: absolute;
          right: 6px;
          bottom: 6px;
          z-index: 5;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 4px;
          max-width: 78%;
        }
        .mav__btn {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(60, 42, 20, 0.18);
          background: rgba(255, 255, 255, 0.88);
          color: #4a3826;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(60, 42, 20, 0.15);
          transition: transform 120ms ease, background 120ms ease;
        }
        .mav__btn:hover { transform: translateY(-1px); background: #ffffff; }
        .mav__btn--on { background: #ffe1ee; border-color: #f07ca8; color: #a1134f; }
        .mav:focus-visible { box-shadow: inset 0 0 0 2px rgba(240, 124, 168, 0.55); border-radius: 18px; }
      `})]})}var M={avatar:{title:`Tùy chỉnh Avatar`,defaultState:()=>u(),sanitize:e=>d(`avatar`,e),tabs:e=>h().kidTabs(e),cfg:(e,t)=>h().kidTabCfg(e,t)},pet:{title:`Tùy chỉnh Thú cưng`,defaultState:()=>h().pet.defaults,sanitize:e=>d(`pet`,e),tabs:()=>[{k:`animal`,l:`Loài`},...h().pet.tabs],cfg:e=>{if(e===`animal`){let e=h();return{kind:`svg`,ids:Object.keys(e.pet.animals),vb:`0 0 200 200`,nullable:!1,pv:t=>e.pet.preview({animal:t})}}let t=h().pet.opts[e];return{kind:t.colors?`dot`:`svg`,ids:t.ids,vb:t.vb,nullable:!0,dot:e=>e===`stripe`?`linear-gradient(#5aa9e6 50%,#fff 50%)`:t.map[e],pv:e=>t.map[e]||``}}}},N={avatar:[`body`,`skin`,`face`,`hair`,`hairColor`],pet:[`animal`]},P=e=>e[Math.floor(Math.random()*e.length)];function F({kind:e=`avatar`,initial:t,onClose:n,onSave:i}){let a=M[e],[u,d]=(0,T.useState)(()=>a.sanitize(t)||a.defaultState()),[b,S]=(0,T.useState)(()=>a.tabs(a.sanitize(t)||a.defaultState())[0]?.k),[C,D]=(0,T.useState)(!1),[O,k]=(0,T.useState)(null),[A,F]=(0,T.useState)(`wave`),[I,L]=(0,T.useState)(0),[R,z]=(0,T.useState)(0),[B,V]=(0,T.useState)(0),H=(0,T.useRef)(null);(0,T.useEffect)(()=>{if(e!==`avatar`)return;let t=setTimeout(()=>F(`idle`),1900);return()=>clearTimeout(t)},[e]);function U(e){H.current={x:e.clientX,turn:I},e.currentTarget.setPointerCapture?.(e.pointerId)}function W(e){let t=H.current;if(!t)return;let n=Math.max(-1,Math.min(1,t.turn+(e.clientX-t.x)/130));L(n)}function G(){H.current=null,L(0)}(0,T.useEffect)(()=>{m();let e=e=>{e.key===`Escape`&&n()};return document.addEventListener(`keydown`,e),()=>document.removeEventListener(`keydown`,e)},[n]);let K=(0,T.useMemo)(()=>a.tabs(u),[a,u]),q=K.find(e=>e.k===b)||K[0],J=q?.k,Y=J?a.cfg(J,u):null;function X(t){if(J){if(e===`avatar`&&J===`body`){d(h().applyBody(u,t)),z(e=>e+1);return}d(a.sanitize({...u,[J]:t||null})),e===`avatar`&&V(e=>e+1)}}function Z(){let t=N[e],n={...u};for(let e of a.tabs(u)){if(t.includes(e.k))continue;let r=a.cfg(e.k,u);n[e.k]=P(r.nullable?[null,...r.ids]:r.ids)}d(a.sanitize(n)),e===`avatar`&&V(e=>e+1)}function Q(){d(a.sanitize(a.defaultState()))}async function $(){D(!0),k(null);try{try{localStorage.setItem(g(e),JSON.stringify({v:1,value:u,updatedAt:new Date().toISOString()}))}catch{}await i(e,u),D(!1),e===`avatar`&&V(e=>e+1),k({ok:!0,text:`Đã lưu vào hồ sơ`}),setTimeout(n,650)}catch{D(!1),k({ok:!1,text:`Đã lưu trên máy, chưa lên được hồ sơ`})}}let ee=Y?.ids||[],te=(0,T.useMemo)(()=>p(e,u),[e,u]);return(0,E.jsx)(`div`,{className:`fixed inset-0 z-50 flex flex-col`,style:{background:`var(--stage)`,paddingTop:`var(--sat)`,paddingBottom:`var(--sab)`},children:(0,E.jsxs)(`div`,{className:`w-full flex-1 min-h-0 flex flex-col overflow-hidden`,style:{border:`1px solid var(--line)`},children:[(0,E.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-3 shrink-0`,style:{background:`var(--card)`,borderBottom:`1px solid var(--line)`},children:[(0,E.jsx)(`h3`,{className:`font-display text-base font-bold text-ink`,children:a.title}),(0,E.jsx)(`button`,{onClick:n,"aria-label":`Đóng`,className:`text-ink/40 hover:text-ink px-1`,children:(0,E.jsx)(r,{className:`w-5 h-5`})})]}),(0,E.jsxs)(`div`,{className:`flex-1 min-h-0 flex flex-col md:flex-row`,children:[e===`avatar`?(0,E.jsxs)(`div`,{className:`relative shrink-0 h-[30vh] sm:h-[36vh] md:h-auto md:w-[44%] md:max-w-md p-3 md:p-5 md:border-r md:border-black/10 select-none`,style:{background:`var(--bg)`,borderBottom:`1px solid var(--line)`,touchAction:`pan-y`},onPointerDown:U,onPointerMove:W,onPointerUp:G,onPointerCancel:G,children:[(0,E.jsx)(j,{className:`du-stage-movable h-full w-full`,jumpSignal:B,children:(0,E.jsx)(_,{bodyId:u.body,accessories:u,mood:A,turnX:I,celebrateKey:R,label:a.title})}),(0,E.jsx)(`button`,{type:`button`,onClick:()=>L(e=>e===0?.85:0),"aria-label":`Xoay nhân vật`,"aria-pressed":I!==0,title:`Xoay nhân vật (hoặc kéo ngang trên nhân vật)`,className:`absolute left-3 bottom-3 w-11 h-11 rounded-2xl grid place-items-center text-white shadow-lg transition active:scale-95`,style:{background:`rgba(29,43,82,0.85)`},children:(0,E.jsx)(w,{className:`w-5 h-5`})})]}):(0,E.jsx)(`div`,{className:`shrink-0 h-[30vh] sm:h-[36vh] md:h-auto md:w-[44%] md:max-w-md flex items-center justify-center p-3 md:p-5 md:border-r md:border-black/10`,style:{background:`var(--bg)`,borderBottom:`1px solid var(--line)`},children:(0,E.jsx)(`div`,{className:`eg-du w-full h-full`,role:`img`,"aria-label":a.title,dangerouslySetInnerHTML:{__html:te}})}),(0,E.jsxs)(`div`,{className:`flex-1 min-h-0 flex flex-col`,children:[(0,E.jsx)(`div`,{className:`flex gap-1.5 px-3 py-2 overflow-x-auto shrink-0`,style:{background:`var(--card)`,borderBottom:`1px solid var(--line)`},children:K.map(e=>(0,E.jsx)(`button`,{onClick:()=>S(e.k),className:`flex-none rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${e.k===q?.k?`text-white`:`text-ink/60 hover:text-ink`}`,style:e.k===q?.k?{background:`var(--accent)`}:{background:`var(--bg)`},children:e.l},e.k))}),(0,E.jsx)(`div`,{className:`flex-1 min-h-0 overflow-y-auto px-3 py-3`,style:{background:`var(--card)`},children:(0,E.jsxs)(`div`,{className:`grid grid-cols-3 min-[420px]:grid-cols-4 lg:grid-cols-5 gap-2`,children:[Y?.nullable&&(0,E.jsxs)(`button`,{onClick:()=>X(null),"aria-pressed":!u[J],className:`du-card`,style:{background:`var(--stage)`,borderColor:u[J]?`var(--line)`:`var(--accent)`,boxShadow:u[J]?`0 1px 2px rgba(30,20,10,.08)`:`0 0 0 2px var(--accent)`},title:`Không dùng`,children:[(0,E.jsx)(`span`,{className:`du-card__pv`,children:(0,E.jsx)(o,{className:`w-6 h-6 text-ink/35`})}),(0,E.jsx)(`span`,{className:`du-card__name`,children:`Không dùng`}),!u[J]&&(0,E.jsx)(`span`,{className:`du-card__badge`,children:(0,E.jsx)(y,{className:`w-3 h-3`})})]}),ee.map(t=>{let n=u[J]===t,r=Y.label?Y.label(t):f(e,J,t);return(0,E.jsxs)(`button`,{onClick:()=>X(t),"aria-pressed":n,title:r,className:`du-card`,style:{background:`var(--stage)`,borderColor:n?`var(--accent)`:`var(--line)`,boxShadow:n?`0 0 0 2px var(--accent)`:`0 1px 2px rgba(30,20,10,.08)`},children:[(0,E.jsx)(`span`,{className:`du-card__pv`,children:Y.kind===`dot`?(0,E.jsx)(`span`,{className:`w-[52%] aspect-square rounded-full border border-black/10`,style:{background:Y.dot(t)}}):(0,E.jsx)(`svg`,{viewBox:Y.vbFor?Y.vbFor(t):Y.vb,width:`100%`,height:`100%`,preserveAspectRatio:`xMidYMid meet`,children:(0,E.jsx)(`g`,{dangerouslySetInnerHTML:{__html:Y.pv(t)}})})}),(0,E.jsx)(`span`,{className:`du-card__name`,children:r}),n&&(0,E.jsx)(`span`,{className:`du-card__badge`,children:(0,E.jsx)(y,{className:`w-3 h-3`})})]},String(t))})]})}),(0,E.jsxs)(`div`,{className:`px-4 py-3 shrink-0 space-y-2`,style:{background:`var(--card)`,borderTop:`1px solid var(--line)`},children:[O&&(0,E.jsx)(`p`,{className:`text-center text-xs font-semibold ${O.ok?`text-green-600`:`text-red-500`}`,children:O.text}),(0,E.jsxs)(`div`,{className:`flex gap-2`,children:[(0,E.jsxs)(v,{onClick:Z,className:`flex-1 inline-flex items-center justify-center gap-1.5`,children:[(0,E.jsx)(s,{className:`w-4 h-4`}),` Ngẫu nhiên`]}),(0,E.jsxs)(v,{onClick:Q,className:`flex-1 inline-flex items-center justify-center gap-1.5`,children:[(0,E.jsx)(c,{className:`w-4 h-4`}),` Mặc lại`]})]}),(0,E.jsx)(x,{onClick:$,disabled:C,className:`w-full justify-center inline-flex items-center gap-1.5`,children:C?`Đang lưu...`:(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(l,{className:`w-4 h-4`}),` Lưu vào hồ sơ`]})}),(0,E.jsx)(`style`,{children:`
                .du-card {
                  position: relative;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 2px;
                  padding: 6px 4px 5px;
                  border: 2px solid var(--line);
                  border-radius: 16px;
                  cursor: pointer;
                  transition: transform 130ms ease, box-shadow 130ms ease, border-color 130ms ease;
                }
                .du-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(30,20,10,.14) !important; }
                .du-card__pv {
                  width: 100%;
                  aspect-ratio: 1 / 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  overflow: hidden;
                  border-radius: 10px;
                  pointer-events: none;
                }
                .du-card__name {
                  font-size: 11px;
                  font-weight: 600;
                  line-height: 1.15;
                  text-align: center;
                  color: var(--ink, #333);
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  pointer-events: none;
                }
                .du-card__badge {
                  position: absolute;
                  top: -7px;
                  right: -7px;
                  width: 20px;
                  height: 20px;
                  border-radius: 999px;
                  display: grid;
                  place-items: center;
                  background: var(--accent);
                  color: #fff;
                  box-shadow: 0 2px 6px rgba(30,20,10,.25);
                  pointer-events: none;
                }
              `})]})]})]})]})})}export{F as t};