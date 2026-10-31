import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{A as r,M as i,a,f as o,j as s,k as c,o as l,p as u,r as d,t as f}from"./api-gdU94oSS.js";import{t as p}from"./chevron-up-CDC78rLf.js";import{t as m}from"./users-Bpjf0cYn.js";import{t as h}from"./socket-BkSegrQD.js";import{l as g,m as _,p as v,u as y}from"./dressUpAvatar-Bd73RzMb.js";import{t as b}from"./petApi-COikkmFm.js";import{Ft as x,I as S,Jt as C,M as w,O as T,St as E,_t as D,dn as O,h as k,j as ee,m as A,on as j,wn as M,zt as N}from"./index-MEOP06eW.js";import{t as P}from"./AiExplainTrigger-BZK4pGPd.js";import{t as F}from"./injectGameConfig-T9xd22zp.js";import{t as te}from"./injectAnswerBridge-DjIAzOrD.js";var I=e(t(),1),L=n();function R(){let e=``;for(let t=0;t<6;t++)e+=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`[Math.floor(Math.random()*32)];return e}function z({gameId:e,gameName:t,gameCode:n,visible:r,mode:i,onModeSelected:a,onInviteAccepted:o,onGameJoined:c,onClose:l}){let[u,f]=(0,I.useState)(`mode`),[p,g]=(0,I.useState)(``),[_,v]=(0,I.useState)([]),[y,b]=(0,I.useState)(!1),[w,T]=(0,I.useState)(null),[E,O]=(0,I.useState)(null),[k,ee]=(0,I.useState)(n||``),[A,j]=(0,I.useState)(``),[P,F]=(0,I.useState)(``),[te,z]=(0,I.useState)(null),B=(0,I.useRef)(null),V=(0,I.useRef)(null);(0,I.useEffect)(()=>{r&&u===`mode`&&setTimeout(()=>{},100)},[r,u]),(0,I.useEffect)(()=>{r&&u===`search`&&setTimeout(()=>V.current?.focus(),100)},[r,u]),(0,I.useEffect)(()=>{r||(f(`mode`),g(``),v([]),T(null),O(null),F(``),z(null))},[r]),(0,I.useEffect)(()=>{if(!r)return;let e=t=>{z(t),T(`accepted`),e?.(t)},t=e=>{e.ok?(z({acceptedByName:e.hostUserId,gameId:e.gameId}),t?.(e)):F(e.error||`Mã phòng không hợp lệ`)};return h.on(S.GAME_INVITE_ACCEPTED,e),h.on(S.GAME_JOINED,t),()=>{h.off(S.GAME_INVITE_ACCEPTED,e),h.off(S.GAME_JOINED,t)}},[r,o,c]);let H=(0,I.useCallback)(async e=>{if(!e||e.length<2){v([]);return}b(!0);try{let t=await s.search(e);v(t||[])}catch{v([])}finally{b(!1)}},[]),U=e=>{let t=e.target.value;if(g(t),clearTimeout(B.current),t.length<2){v([]);return}B.current=setTimeout(()=>H(t),300)},W=async n=>{let r=k||R();k||ee(r),O(n),T(`waiting`);try{await d(`/game-invites`,{method:`POST`,body:{toUserId:n.id,gameId:e,gameName:t,gameCode:r}})}catch(e){console.error(`[CoopInvite] game-invites API error:`,e.message)}if(h.connected)h.emit(S.GAME_INVITE_SEND,{toUserId:n.id,gameId:e,gameName:t,gameCode:r});else{try{h.connect()}catch{}setTimeout(()=>{h.connected&&h.emit(S.GAME_INVITE_SEND,{toUserId:n.id,gameId:e,gameName:t,gameCode:r})},500)}},G=()=>{let e=A.trim().toUpperCase();if(!e||e.length<4){F(`Vui lòng nhập mã phòng hợp lệ`);return}F(``),h.emit(S.GAME_JOIN_BY_CODE,{code:e})};return r?(0,L.jsx)(`div`,{className:`fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center font-[Segoe_UI,sans-serif] text-white animate-[fadeIn_0.3s_ease]`,children:(0,L.jsxs)(`div`,{className:`bg-[#1e2a4a] rounded-[20px] p-8 max-w-[420px] w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease]`,children:[u===`mode`&&(0,L.jsxs)(L.Fragment,{children:[(0,L.jsxs)(`h2`,{className:`text-[1.5rem] font-bold mb-2 inline-flex items-center gap-2`,children:[(0,L.jsx)(N,{className:`w-6 h-6`}),` Chọn chế độ chơi`]}),(0,L.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-5`,children:t}),(0,L.jsxs)(`div`,{className:`flex gap-3 mb-5`,children:[(0,L.jsxs)(`button`,{onClick:()=>{a?.(`solo`)},className:`flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5`,children:[(0,L.jsx)(C,{className:`w-6 h-6 mx-auto mb-1.5`}),`Chơi với máy`]}),(0,L.jsxs)(`button`,{onClick:()=>f(`search`),className:`flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5`,children:[(0,L.jsx)(m,{className:`w-6 h-6 mx-auto mb-1.5`}),`Chơi với người`]})]}),(0,L.jsx)(`button`,{onClick:()=>f(`join-code`),className:`w-full py-2.5 rounded-[10px] border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:(0,L.jsxs)(`span`,{className:`inline-flex items-center gap-1.5`,children:[(0,L.jsx)(x,{className:`w-3.5 h-3.5`}),` Nhập mã phòng`]})})]}),u===`search`&&(0,L.jsxs)(L.Fragment,{children:[(0,L.jsxs)(`h2`,{className:`text-[1.5rem] font-bold mb-2 inline-flex items-center gap-2`,children:[(0,L.jsx)(m,{className:`w-6 h-6`}),` Tìm người chơi`]}),(0,L.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-4`,children:`Nhập tên để tìm và mời bạn cùng chơi`}),(0,L.jsx)(M,{ref:V,type:`text`,placeholder:`Tìm kiếm người chơi...`,value:p,onChange:U,variant:`dark`,className:`py-2.5 px-3.5 rounded-[10px] text-[0.9rem] mb-3 focus:border-[#4ecdc4]`}),(0,L.jsxs)(`div`,{className:`max-h-[200px] overflow-y-auto text-left mb-3`,children:[y&&(0,L.jsxs)(`div`,{className:`text-center py-3 opacity-50`,children:[(0,L.jsx)(`span`,{className:`inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5`}),`Đang tìm...`]}),!y&&_.length===0&&p.length>=2&&(0,L.jsx)(`div`,{className:`text-center py-3 opacity-50 text-[0.85rem]`,children:`Không tìm thấy`}),_.map(e=>(0,L.jsxs)(`div`,{className:`flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] cursor-pointer transition hover:bg-white/8 mb-1`,children:[(0,L.jsx)(`div`,{className:`w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center font-bold text-[0.85rem] shrink-0`,children:(e.name||e.username||`?`)[0].toUpperCase()}),(0,L.jsxs)(`div`,{className:`text-left flex-1 min-w-0`,children:[(0,L.jsx)(`div`,{className:`text-[0.9rem] font-semibold truncate`,children:e.name||e.username}),(0,L.jsxs)(`div`,{className:`text-[0.75rem] opacity-50`,children:[`@`,e.username||``]})]}),(0,L.jsx)(`button`,{onClick:t=>{t.stopPropagation(),W(e)},className:`py-1.5 px-3.5 rounded-lg border-none bg-[#4ecdc4] text-[#1a1a2e] font-bold text-[0.8rem] cursor-pointer shrink-0 hover:brightness-110`,children:`Mời chơi`})]},e.id))]}),(0,L.jsx)(`button`,{onClick:()=>{f(`mode`),g(``),v([])},className:`py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`← Quay lại`})]}),u===`join-code`&&(0,L.jsxs)(L.Fragment,{children:[(0,L.jsxs)(`h2`,{className:`text-[1.5rem] font-bold mb-2 inline-flex items-center gap-2`,children:[(0,L.jsx)(x,{className:`w-6 h-6`}),` Nhập mã phòng`]}),(0,L.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-4`,children:`Nhập mã 6 ký tự từ bạn bè để vào phòng`}),(0,L.jsx)(M,{type:`text`,maxLength:6,placeholder:`MÃ PHÒNG`,value:A,onChange:e=>j(e.target.value.toUpperCase()),onKeyDown:e=>e.key===`Enter`&&G(),variant:`dark`,className:`py-3.5 border-2 font-mono text-[1.5rem] font-bold text-center tracking-[8px] uppercase focus:border-[#4ecdc4]`}),P&&(0,L.jsx)(`div`,{className:`text-[#e94560] text-[0.85rem] mt-2 min-h-[1.2em]`,children:P}),(0,L.jsx)(`button`,{onClick:G,className:`w-full mt-4 py-3 rounded-[10px] font-bold text-[0.95rem] border-2 border-[#f4b942] bg-[#f4b942] text-white cursor-pointer transition hover:brightness-110 active:scale-95`,children:`Vào phòng`}),(0,L.jsx)(`button`,{onClick:()=>{f(`mode`),j(``),F(``)},className:`w-full mt-2 py-2 rounded-[10px] font-semibold text-[0.85rem] bg-transparent text-white/60 border-2 border-white/15 cursor-pointer transition hover:text-white hover:border-white/30`,children:`← Quay lại`})]}),w===`waiting`&&(0,L.jsxs)(`div`,{className:`mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#f4b942] text-[0.85rem]`,children:[(0,L.jsx)(`span`,{className:`inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5`}),`Đang chờ `,E?.name||E?.username,` chấp nhận...`,k&&(0,L.jsxs)(`div`,{className:`mt-2`,children:[`Mã phòng: `,(0,L.jsx)(`span`,{className:`font-mono font-bold tracking-wider`,children:k})]}),(0,L.jsx)(`button`,{onClick:()=>{T(null),O(null),f(`search`)},className:`mt-3 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`← Hủy và tìm người khác`})]}),w===`accepted`&&(0,L.jsx)(`div`,{className:`mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#4ecdc4] text-[0.85rem]`,children:(0,L.jsxs)(`span`,{className:`inline-flex items-center gap-1.5`,children:[(0,L.jsx)(N,{className:`w-4 h-4`}),` `,te?.acceptedByName||`Bạn`,` đã tham gia!`]})}),(0,L.jsx)(`button`,{onClick:l,className:`mt-4 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/50 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:(0,L.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,L.jsx)(D,{className:`w-3.5 h-3.5`}),` Đóng`]})})]})}):null}function B({coins:e=0,hearts:t=100,gameName:n=`Trò chơi`,petMessage:r,onQuit:i}){let[a,o]=(0,I.useState)(!0),s=T(e);return(0,L.jsxs)(`div`,{className:`pointer-events-none absolute inset-x-0 top-0 z-20 px-2.5 pt-2.5 flex items-start justify-between gap-2`,children:[(0,L.jsxs)(`div`,{className:`pointer-events-auto flex items-center gap-2`,children:[(0,L.jsxs)(`button`,{onClick:i,className:`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full pl-2 pr-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600 hover:text-rose-500 transition active:scale-95`,title:`Thoát game`,children:[(0,L.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center`,children:(0,L.jsx)(O,{className:`w-3.5 h-3.5`})}),(0,L.jsx)(`span`,{className:`text-[11px] font-extrabold max-w-[120px] truncate`,children:`Thoát`})]}),(0,L.jsxs)(`span`,{className:`hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600`,children:[(0,L.jsx)(N,{className:`w-4 h-4 text-sky-500`}),(0,L.jsx)(`span`,{className:`text-[11px] font-extrabold max-w-[160px] truncate`,children:n})]})]}),(0,L.jsxs)(`div`,{className:`pointer-events-auto flex flex-col items-end gap-2`,children:[(0,L.jsxs)(`div`,{className:`flex items-center gap-1.5 transition-all ${a?``:`opacity-0 scale-95 pointer-events-none`}`,children:[(0,L.jsxs)(V,{children:[(0,L.jsx)(`span`,{className:`w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm`,children:(0,L.jsx)(E,{className:`w-3 h-3`,fill:`currentColor`})}),(0,L.jsx)(`span`,{className:`font-extrabold text-slate-700 text-xs`,children:(e||0).toLocaleString()})]}),(0,L.jsxs)(V,{wide:!0,children:[(0,L.jsx)(`span`,{className:`w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center shadow-sm`,children:(0,L.jsx)(E,{className:`w-3 h-3`,fill:`currentColor`})}),(0,L.jsxs)(`span`,{className:`font-extrabold text-slate-700 text-xs whitespace-nowrap`,children:[`Lv `,s.level]}),(0,L.jsx)(`span`,{className:`w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden`,children:(0,L.jsx)(`span`,{className:`block h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500`,style:{width:`${s.percent??0}%`}})})]}),(0,L.jsxs)(V,{children:[(0,L.jsx)(`span`,{className:`text-xs leading-none`,children:`❤️`}),(0,L.jsx)(`span`,{className:`font-extrabold text-slate-700 text-xs`,children:t})]}),(0,L.jsx)(`button`,{onClick:()=>o(!1),className:`w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center`,"aria-label":`Ẩn thanh trạng thái`,children:(0,L.jsx)(p,{className:`w-4 h-4`})})]}),!a&&(0,L.jsx)(`button`,{onClick:()=>o(!0),className:`w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center`,"aria-label":`Hiện thanh trạng thái`,children:(0,L.jsx)(j,{className:`w-4 h-4`})}),(0,L.jsxs)(`div`,{className:`pointer-events-auto flex items-end gap-2`,children:[(0,L.jsx)(A,{message:r,compact:!0,className:`mb-6`}),(0,L.jsx)(`div`,{className:`w-14 h-14 rounded-full bg-white shadow-[0_6px_16px_rgba(15,60,120,.16)] flex items-center justify-center ring-2 ring-amber-300 shrink-0`,children:(0,L.jsx)(k,{size:42,bounce:!0})})]})]})]})}function V({children:e,wide:t=!1}){return(0,L.jsx)(`span`,{className:`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-2.5 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] `,children:e})}var H=`/* eslint-disable */
/**
 * dressUpBridge.js — lớp lưu trữ cho 2 game tạo avatar
 *
 * Nguyên tắc: CLIENT LÀ NGUỒN CHÍNH.
 *   1. Mọi thay đổi → ghi localStorage NGAY (chơi offline vẫn nhớ).
 *   2. Đồng thời bắn postMessage \`outfit-save\` lên frame cha để frame cha
 *      gọi PUT /api/auth/me với body { avatar, pet }.
 *   3. Frame cha trả \`outfit-saved\`; game cập nhật nhãn trạng thái.
 *
 * Không gọi /api/avatar/* ở đây — avatar của 2 game này độc lập với hệ
 * avatarLoadout (code + inventory) sẵn có của app.
 *
 * API:
 *   EG_OUTFIT.get(scope)          scope = 'pet' | 'avatar' → { value, updatedAt } | null
 *   EG_OUTFIT.set(scope, value)   sanitize → lưu local → hẹn giờ đồng bộ
 *   EG_OUTFIT.status(msg, kind)   cập nhật nhãn #egSync (kind: 'ok'|'err'|'wait')
 *   EG_OUTFIT.bind()              gắn listener init + outfit-saved (tự gọi 1 lần)
 *
 * Sự kiện DOM:
 *   window.addEventListener('eg-outfit', e => {
 *     // e.detail = { scope, value, source: 'local' | 'server' }
 *   });
 *
 * Hợp đồng với frame cha (/api/auth/me):
 *   gửi  { scope, value }                 value = object phẳng (đã sanitize)
 *   nhận { ok, scope, value, updatedAt }  value = object phẳng + updatedAt
 *   init  data.avatar / data.pet          object phẳng + updatedAt
 */
(function (root) {
  'use strict';

  var PREFIX = 'eg-outfit-';
  var VERSION = 'v1';
  var SYNC_DELAY = 700;

  var _timers = {};
  var _pending = {};

  /**
   * id tài khoản đang chơi (frame cha gửi trong message \`init\`), '' khi là khách.
   * Box nào mang owner khác thì coi như không tồn tại — đăng xuất rồi đăng nhập
   * bằng hồ sơ khác sẽ không thấy avatar của người dùng trước, và quan trọng hơn
   * là không đẩy ngược bộ đồ của người khác lên hồ sơ mới.
   */
  var _owner = '';

  function boxOwner(box) { return box && box.owner != null ? String(box.owner) : ''; }
  function ownedHere(box) { var o = boxOwner(box); return !o || o === _owner; }

  function storeKey(scope) { return PREFIX + scope + '-' + VERSION; }

  function sanitize(scope, value) {
    var D = root.EG_DRESSUP;
    if (!D) return null;
    try { return scope === 'pet' ? D.sanitizePet(value) : D.sanitizeKid(value); }
    catch (e) { return null; }
  }

  /* ── localStorage (mem fallback khi bị chặn) ───────────────────────── */

  var _mem = {};
  function lsRead(scope) {
    try {
      var raw = localStorage.getItem(storeKey(scope));
      if (raw) return raw;
    } catch (e) { /* bị chặn */ }
    return _mem[scope] || null;
  }
  function lsWrite(scope, value) {
    var raw = JSON.stringify(value);
    _mem[scope] = raw;
    try { localStorage.setItem(storeKey(scope), raw); } catch (e) { /* dùng mem */ }
  }

  /* ── đọc / ghi ─────────────────────────────────────────────────────── */

  function get(scope) {
    var raw = lsRead(scope);
    if (!raw) return null;
    try {
      var box = JSON.parse(raw);
      if (!ownedHere(box)) return null;
      var clean = sanitize(scope, box && box.value);
      if (!clean) return null;
      return { value: clean, updatedAt: (box && box.updatedAt) || null };
    } catch (e) { return null; }
  }

  function emit(scope, value, source) {
    try {
      root.dispatchEvent(new CustomEvent('eg-outfit', { detail: { scope: scope, value: value, source: source } }));
    } catch (e) { /* ignore */ }
  }

  /**
   * @param {string} scope  'pet' | 'avatar'
   * @param {object} value  state thô, tự sanitize
   * @param {{updatedAt?:string, fromServer?:boolean}} [opts]
   */
  function set(scope, value, opts) {
    var clean = sanitize(scope, value);
    if (!clean) return null;
    var fromServer = !!(opts && opts.fromServer);
    var stamp = (opts && opts.updatedAt) || new Date().toISOString();
    lsWrite(scope, { v: 1, value: clean, updatedAt: stamp, owner: _owner });
    /* Nội dung lấy từ hồ sơ thì không đẩy ngược lại, tránh ping-pong vô hạn. */
    if (!fromServer) scheduleSync(scope, stamp);
    emit(scope, clean, fromServer ? 'server' : 'local');
    return clean;
  }

  function clear(scope) {
    delete _mem[scope];
    try { localStorage.removeItem(storeKey(scope)); } catch (e) { /* ignore */ }
  }

  /* ── đồng bộ lên profile ───────────────────────────────────────────── */

  function post(type, data) {
    try {
      if (root.parent && root.parent !== root) root.parent.postMessage({ type: type, data: data }, '*');
    } catch (e) { /* ignore */ }
  }

  function scheduleSync(scope, updatedAt) {
    if (_timers[scope]) clearTimeout(_timers[scope]);
    _timers[scope] = setTimeout(function () { sync(scope, updatedAt); }, SYNC_DELAY);
  }

  function sync(scope, updatedAt) {
    var box = get(scope);
    if (!box) return;
    _pending[scope] = true;
    status('⏳ Đang lưu vào hồ sơ…', 'wait');
    post('outfit-save', { scope: scope, value: box.value, updatedAt: updatedAt || box.updatedAt });
  }

  /** Đẩy ngay, không chờ debounce (dùng khi game đóng / rời trang). */
  function syncNow(scope) {
    if (_timers[scope]) { clearTimeout(_timers[scope]); _timers[scope] = null; }
    var box = get(scope);
    if (box) sync(scope, box.updatedAt);
  }

  function syncAllNow() { syncNow('avatar'); syncNow('pet'); }

  /* ── nhãn trạng thái ───────────────────────────────────────────────── */

  function status(text, kind) {
    var el = document.getElementById('egSync');
    if (!el) return;
    el.textContent = text || '';
    el.dataset.kind = kind || '';
    el.hidden = !text;
  }

  /* ── nhận init + kết quả từ frame cha ──────────────────────────────── */

  /**
   * Gắn listener init + outfit-saved. Game bắt sự kiện \`eg-outfit\` để vẽ lại khi
   * hồ sơ trên server có bản mới hơn bản đang có trên máy.
   *   addEventListener('eg-outfit', e => { if (e.detail.scope === 'pet') redraw(); })
   */
  function bind() {
    root.addEventListener('message', function (e) {
      var msg = e.data;
      if (!msg || typeof msg !== 'object') return;

      if (msg.type === 'init') {
        var d = msg.data || {};
        _owner = d.userId == null ? '' : String(d.userId);
        /* d.pet / d.avatar là object phẳng + updatedAt, đúng như trả về của GET
           /api/auth/me. Hồ sơ trên server mới hơn bản local thì thắng. */
        ['pet', 'avatar'].forEach(function (scope) {
          var server = d[scope];
          if (!server || typeof server !== 'object') return;
          var mine = get(scope);
          var mineTs = mine && mine.updatedAt ? Date.parse(mine.updatedAt) : 0;
          var srvTs = server.updatedAt ? Date.parse(server.updatedAt) : 0;
          if (!mine || srvTs >= mineTs) set(scope, server, { updatedAt: server.updatedAt, fromServer: true });
        });
        return;
      }

      if (msg.type === 'outfit-saved') {
        var r = msg.data || {};
        if (r.ok) {
          if (r.value && r.scope) lsWrite(r.scope, { v: 1, value: sanitize(r.scope, r.value) || r.value, updatedAt: r.updatedAt || null, owner: _owner });
          status('✔ Đã lưu vào hồ sơ', 'ok');
        } else {
          status('⚠ Đã lưu trên máy, chưa lên được hồ sơ', 'err');
        }
      }
    });
  }

  root.EG_OUTFIT = {
    get: get,
    set: set,
    clear: clear,
    status: status,
    bind: bind,
    sync: syncNow,
    syncAll: syncAllNow
  };

  bind();
})(typeof window !== 'undefined' ? window : globalThis);`,U=`<!-- EG_DRESSUP_START -->`,W=`<!-- EG_DRESSUP_END -->`;function G(){return[U,`<script>`,`/* --- thân rồng (từ src/games/_shared/lib/dressUpDragon.js) --- */`,_.trim(),`/* --- dữ liệu SVG dùng chung (inject từ src/games/_shared/lib/dressUpAvatarData.js) --- */`,v.trim(),`/* --- lớp lưu trữ client + đồng bộ hồ sơ (inject từ src/games/_shared/lib/dressUpBridge.js) --- */`,H.trim(),`<\/script>`,W].join(`
`)}function ne(e){if(!e||typeof e!=`string`)return e;let t=e.indexOf(U),n=e.indexOf(W);return t===-1||n===-1||n<t?e:e.slice(0,t)+e.slice(n+23)}function re(e){if(!e||typeof e!=`string`||!e.includes(`EG_DRESSUP_HOST`))return e;let t=ne(e),n=G(),r=t.match(/<head[^>]*>/i);if(r){let e=r.index+r[0].length;return t.slice(0,e)+`
`+n+`
`+t.slice(e)}return n+`
`+t}function K({htmlContent:e,game:t,questions:n,players:p,playerName:m,playMode:_,onFinish:v,onQuit:x,onStateUpdate:C,userAuth:T,coopSessionId:E,coopOpponent:D,onCoopReady:O,gameKey:k,gameConfig:A}){let j=(0,I.useRef)(null),[M,N]=(0,I.useState)(!1),[R,V]=(0,I.useState)(_||`solo`),[H,U]=(0,I.useState)(D||null),[W,G]=(0,I.useState)(0),[ne,K]=(0,I.useState)(`Chúc bạn chơi vui vẻ!`),[ie,ae]=(0,I.useState)(!1),q=(0,I.useRef)([]),oe=(0,I.useRef)(null),J=t?._id?.toString()||t?.id,Y=t?.name||`Trò chơi`,X=t?.code||``,[Z,se]=(0,I.useState)(null),Q=(0,I.useCallback)((e,t,r)=>{if(e==null)return;let i=String(e),a=q.current,o=a.findIndex(e=>e.questionId===i),s={questionId:i,value:t??null,timeSpent:typeof r==`number`?r:void 0};o>=0?a[o]=s:a.push(s);let c=(n||[]).find(e=>String(e?.id)===i);se({questionId:i,value:s.value,content:c?.content||c?.question||null})},[n]),ce=(0,I.useMemo)(()=>{if(!e)return e;let t=k?F(e,{key:k,config:A}):e;return re(te(t))},[e,k,A]);(0,I.useEffect)(()=>{!h.connected&&T?.token&&(h.auth={token:T.token},h.connect())},[]);let le=(0,I.useCallback)(async()=>{let e=j.current;if(!e?.contentWindow)return;q.current=[],oe.current=r(`play`),se(null);let o=(p||[]).map(e=>typeof e==`string`?e:e?.name).filter(Boolean),s=0,c=0,l=3,d=null,h=null,v=null,b=null,x=null,S=null,C=null;try{if(J){let e=await u.getGame(J);e?.loadout&&(v=e.loadout),e&&(e.level>1||e.gameState)&&(C={level:Number(e.level)||1,progress:Number(e.progress)||0,gamesPlayed:Number(e.gamesPlayed)||0,state:e.gameState||null,lastPlayedAt:e.lastPlayedAt||null})}}catch{}if(T?.token)try{d=T.token,h=T.user?.id;let e=await i.get();s=e?.coins||0,G(s),c=e?.stars||0;try{let e=await ee.getTasks(`DAILY`),t=(e?.tasks||[]).find(e=>e.code===`SPIN_WHEEL`);t&&(l=e.spinsLeft??Math.max(0,t.target-(t.progress||0)))}catch{}try{let e=await a.me();x=e?.avatar||null,S=e?.pet||null}catch{}try{let e=y(x,S),t=g(`avatar`,e.avatar.value).replace(/^<svg[^>]*>/,``).replace(/<\/svg>$/,``);t&&(b=t)}catch{}}catch{}let w=R||_||`solo`;e.contentWindow.postMessage({type:`init`,data:{gameId:J,playerName:m||`Player`,players:o,questions:n||[],apiBase:f,playMode:w,questionsTotal:n?.length||0,userCoins:s,coins:s,userStars:c,stars:c,spinsLeft:l,authToken:d,userId:h,loadout:v,avatarSvg:b,avatar:x,pet:S,gameName:Y,gameCode:X,sessionId:E||null,opponent:H||null,gameKey:k||null,gameConfig:A||null,gameMode:t?.gameMode||`quiz`,savedProgress:C,loggedIn:!!T?.token}},`*`)},[t,m,n,p,_,T,R,E,H,k,A]),$=(0,I.useCallback)(e=>{let t=j.current;t?.contentWindow&&t.contentWindow.postMessage(e,`*`)},[]),ue=(0,I.useCallback)(async e=>{try{let t=await s.search(e);$({type:`search-results`,data:{users:t||[]}})}catch(e){console.error(`[HtmlGameLoader] Search error:`,e),$({type:`search-results`,data:{users:[]}})}},[$]),de=(0,I.useCallback)(async e=>{if(!e)return;let{toUserId:t,gameName:n,gameCode:r}=e,i={toUserId:t,gameId:J,gameName:n||Y,gameCode:r||X};try{await d(`/game-invites`,{method:`POST`,body:i})}catch(e){console.error(`[HtmlGameLoader] game-invites API error:`,e.message)}if(h.connected)h.emit(S.GAME_INVITE_SEND,i);else{try{h.connect()}catch{}setTimeout(()=>{h.connected&&h.emit(S.GAME_INVITE_SEND,i)},500)}$({type:`invite-sent`,data:{ok:!0,toUserId:t}})},[J,Y,X,$]),fe=(0,I.useCallback)(e=>{e&&h.emit(S.GAME_MOVE,{gameId:J,...e})},[J]),pe=(0,I.useCallback)(e=>{if(!e)return;let t=H?.sessionId||E;t&&h.emit(S.XO_MOVE,{sessionId:t,row:e.row,col:e.col})},[H,E]),me=(0,I.useCallback)(()=>{let e=H?.sessionId||E;e&&h.emit(S.XO_REMATCH,{sessionId:e})},[H,E]),he=(0,I.useCallback)(e=>{e&&(!h.connected&&T?.token&&(h.auth={token:T.token},h.connect()),h.emit(S.GAME_JOIN_BY_CODE,{code:e.code}),setTimeout(()=>{!h.connected&&T?.token&&h.emit(S.GAME_JOIN_BY_CODE,{code:e.code})},1500))},[T]),ge=(0,I.useCallback)(async e=>{try{let t=await l.list();$({type:`classes-data`,requestId:e,data:{classrooms:t||[]}})}catch(t){console.error(`[HtmlGameLoader] request-classes error:`,t),$({type:`classes-data`,requestId:e,data:{error:`Không thể tải danh sách lớp học`,classrooms:[]}})}},[$]),_e=(0,I.useCallback)(async(e,t)=>{try{let n=await l.getStudents(e);$({type:`students-data`,requestId:t,data:{students:n||[]}})}catch(e){console.error(`[HtmlGameLoader] request-students error:`,e),$({type:`students-data`,requestId:t,data:{error:`Không thể tải danh sách học sinh`,students:[]}})}},[$]);(0,I.useEffect)(()=>{let e=e=>{if(e.source!==j.current?.contentWindow)return;let t=e.data;if(!(!t||typeof t!=`object`)){if(t.source===`game`&&t.type){let e=J||t.data?.gameId;w(t.type,{gameId:e,...t.data}).catch(()=>{});return}if(t.type===`ready`||t.type===`bridge-ready`)le();else if(t.type===`show-coop-panel`)N(!0);else if(t.type===`answer`||t.type===`answer-recorded`){let e=t.data||{};Q(e.questionId??e.id,e.value??e.answer,e.timeSpent)}else if(t.type===`answers`){let e=Array.isArray(t.data?.answers)?t.data.answers:[];for(let t of e)Q(t?.questionId,t?.value,t?.timeSpent)}else if(t.type===`save-progress`){let e=t.data||{};if(!J||!T?.token)$({type:`progress-saved`,data:{ok:!1,reason:`not-logged-in`}});else{let t={};e.level!=null&&(t.level=Math.max(1,Math.floor(Number(e.level)||1))),e.progress!=null&&(t.progress=Math.max(0,Math.min(1,Number(e.progress)||0))),e.experience!=null&&(t.experience=Math.max(0,Math.floor(Number(e.experience)||0))),e.state!==void 0&&(t.gameState=e.state),u.upsertGame(J,t).then(()=>$({type:`progress-saved`,data:{ok:!0,level:t.level}})).catch(e=>{console.error(`[HtmlGameLoader] Lưu tiến độ lỗi:`,e),$({type:`progress-saved`,data:{ok:!1,reason:e.message}})})}}else if(t.type===`get-progress`)!J||!T?.token?$({type:`progress`,data:null}):u.getGame(J).then(e=>$({type:`progress`,data:e?{level:Number(e.level)||1,progress:Number(e.progress)||0,state:e.gameState||null}:null})).catch(()=>$({type:`progress`,data:null}));else if(t.type===`add-coins`){let e=t.data?.amount||0;e>0&&T?.token&&o.rewardCoins(e).then(t=>{$({type:`coins-added`,data:{success:!0,coins:t?.coins??0}}),G(t?.coins??0),K(`🎉 Tuyệt vời! +${e} coin`),b(Math.min(10,e),{correct:1}),C?.({coins:t?.coins??0})}).catch(()=>{$({type:`coins-added`,data:{success:!1}})})}else if(t.type===`spin-wheel`)T?.token&&w(`SPIN`,{}).then(e=>{let t=e?.completedTasks?.find(e=>e.code===`SPIN_WHEEL`),n=t?Math.max(0,3-(t.progress||0)):void 0;$({type:`spin-tracked`,data:{success:!0,spinsLeft:n}})}).catch(()=>{$({type:`spin-tracked`,data:{success:!1}})});else if(t.type===`exchange-stars`)T?.token&&i.exchange(`starToCoin`).then(e=>{$({type:`exchange-stars-result`,data:{success:!0,coins:e.coins||0,stars:e.stars||0,exchanged:e.gained||0}}),e.coins&&C?.({coins:e.coins})}).catch(()=>{$({type:`exchange-stars-result`,data:{success:!1}})});else if(t.type===`save-loadout`){let e=t.data?.loadout;e&&J&&T?.token&&u.upsertGame(J,{loadout:e}).catch(()=>{})}else if(t.type===`outfit-save`){let e=t.data||{};if(!T?.token)$({type:`outfit-saved`,data:{ok:!1,scope:e.scope,reason:`not-logged-in`}});else{let t=e.scope===`pet`?`pet`:`avatar`,n={[t]:e.value};d(`/auth/me`,{method:`PUT`,body:n}).then(n=>{let r=n?.[t];$({type:`outfit-saved`,data:{ok:!0,scope:t,value:r??e.value,updatedAt:r?.updatedAt??null}})}).catch(e=>{console.error(`[HtmlGameLoader] Lưu avatar lỗi:`,e),$({type:`outfit-saved`,data:{ok:!1,scope:t,reason:e.message}})})}}else if(t.type===`game-over`){let e=t.data||{},r=Array.isArray(e.answers)&&e.answers.length>0?e.answers:q.current,i=e.totalQuestions||r.length||0,a=e.correct??0,o=i>0?Math.round(a/i*100):0;K(i>0&&a/i>=.8?`🌟 Giỏi quá! Tui tự hào về bạn!`:`💪 Khéo lắm! Hẹn gặp lại nha~`),T?.token&&i>0&&o>=80&&c.add(1).catch(e=>console.error(`[Ticket] Failed to add ticket:`,e)),v?.({score:e.score||0,correct:a,totalQuestions:i,timeUsed:e.timeUsed||0,coinReward:e.coinReward||0,studentId:e.studentId||null,studentName:e.studentName||null,answers:r,playId:oe.current,questionIds:(n||[]).map(e=>e?.id).filter(Boolean)})}else t.type===`state-update`?C?.(t.data):t.type===`quit`?x?.():t.type===`hide-hud`?ae(!0):t.type===`search-user`?ue(t.data?.query):t.type===`invite-user`?de(t.data):t.type===`game-move`?fe(t.data):t.type===`xo-move`?pe(t.data):t.type===`xo-rematch`?me():t.type===`join-by-code`?he(t.data):t.type===`request-classes`?ge(t.requestId):t.type===`request-students`&&_e(t.data?.classId,t.requestId)}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[le,v,x,C,ue,de,fe,pe,me,he,ge,_e,T,$,J,Q,n,$]),(0,I.useEffect)(()=>{let e=e=>{$({type:`opponent-move`,data:e})},t=e=>{U(e),V(`multiplayer`),$({type:`invite-accepted`,data:e}),$({type:`multiplayer-start`,data:{opponent:e,sessionId:e.sessionId}}),$({type:`init`,data:{gameId:J,playerName:m||`Player`,playMode:`multiplayer`,gameName:Y,gameCode:X,sessionId:e.sessionId,opponent:e}})},n=e=>{e.ok?(U({acceptedByName:e.hostUserId}),V(`multiplayer`),$({type:`game-joined`,data:e}),$({type:`init`,data:{gameId:e.gameId||J,playerName:m||`Player`,playMode:`multiplayer`,gameName:Y,gameCode:X,sessionId:e.sessionId,opponent:{acceptedBy:e.hostUserId}}})):$({type:`game-joined`,data:e})};h.on(S.GAME_MOVE,e),h.on(S.GAME_INVITE_ACCEPTED,t),h.on(S.GAME_JOINED,n);let r=e=>$({type:`xo-sync`,data:e}),i=e=>$({type:`xo-move-result`,data:e}),a=e=>$({type:`xo-result`,data:e});return h.on(S.XO_SYNC,r),h.on(S.XO_MOVE_RESULT,i),h.on(S.XO_RESULT,a),()=>{h.off(S.GAME_MOVE,e),h.off(S.GAME_INVITE_ACCEPTED,t),h.off(S.GAME_JOINED,n),h.off(S.XO_SYNC,r),h.off(S.XO_MOVE_RESULT,i),h.off(S.XO_RESULT,a)}},[$,J,m,Y,X]),(0,I.useEffect)(()=>{let e=H?.sessionId||E;if(!e)return;let t=()=>h.emit(S.XO_SYNC_REQUEST,{sessionId:e});return t(),h.on(`connect`,t),()=>h.off(`connect`,t)},[H,E]),(0,I.useEffect)(()=>{E&&D&&(U(D),V(`multiplayer`),$({type:`invite-accepted`,data:D}),$({type:`multiplayer-start`,data:{opponent:D,sessionId:E}}))},[E,D]);let ve=(0,I.useCallback)(e=>{e===`solo`&&(N(!1),V(`solo`),$({type:`mode-selected`,data:{mode:`solo`}})),V(e)},[$]),ye=(0,I.useCallback)(e=>{N(!1),U(e),V(`multiplayer`),$({type:`invite-accepted`,data:e}),$({type:`multiplayer-start`,data:{opponent:e,sessionId:e.sessionId}}),O?.(e)},[$,O]),be=(0,I.useCallback)(e=>{N(!1),V(`multiplayer`),$({type:`game-joined`,data:e}),O?.(e)},[$,O]);return(0,I.useEffect)(()=>{let e=j.current;if(!e)return;let t=()=>{};return e.addEventListener(`load`,t),()=>e.removeEventListener(`load`,t)},[e]),ce?(0,L.jsxs)(`div`,{className:`absolute inset-0 flex flex-col bg-paper`,children:[(0,L.jsx)(`iframe`,{ref:j,srcDoc:ce,sandbox:`allow-scripts allow-same-origin allow-modals allow-pointer-lock`,className:`flex-1 w-full h-full border-0`,title:t?.title||`Game`}),!ie&&(0,L.jsx)(B,{coins:W,gameName:Y,petMessage:ne,onQuit:x}),(0,L.jsx)(z,{gameId:J,gameName:Y,gameCode:X,visible:M,mode:R,onModeSelected:ve,onInviteAccepted:ye,onGameJoined:be,onClose:()=>N(!1)}),Z&&!ie&&(0,L.jsx)(P,{gameId:J,questionId:Z.questionId,answer:Z.value,questionText:Z.content,label:`🤖`,className:`fixed bottom-24 right-4 z-40 w-12 h-12 p-0 rounded-full text-xl
                     bg-ink text-paper border-0 shadow-xl hover:bg-ink2`})]}):(0,L.jsx)(`div`,{className:`absolute inset-0 flex items-center justify-center bg-paper`,children:(0,L.jsx)(`p`,{className:`text-sm text-[#8A7C63]`,children:`Đang tải game...`})})}export{K as default};