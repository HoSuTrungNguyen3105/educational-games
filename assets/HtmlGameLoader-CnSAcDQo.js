import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{F as t,I as n,L as r,R as i,U as a,h as o,i as s,m as c,n as ee,o as te,s as l,t as u}from"./jsx-runtime-rDs-F3Xq.js";import{t as d}from"./x-CYkkXVnc.js";import{t as f}from"./chevron-up-BkZkVi9V.js";import{t as p}from"./socket-Dk6u26jp.js";import{l as m,m as h,p as g,u as _}from"./dressUpAvatar-Dlc0yIf9.js";import{t as v}from"./petApi-B446ow0m.js";import{G as y,Gn as b,H as x,K as S,Kt as C,Yn as w,Z as T,Zt as E,_ as D,cr as O,dn as k,mn as A,v as j,yn as M}from"./index-DvyDZ73G.js";import{t as N}from"./AiExplainTrigger-C9E0U2kb.js";import{t as P}from"./injectGameConfig-T9xd22zp.js";import{t as ne}from"./injectAnswerBridge-DjIAzOrD.js";var F=e(a(),1),I=u();function L(){let e=``;for(let t=0;t<6;t++)e+=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`[Math.floor(Math.random()*32)];return e}function R({gameId:e,gameName:t,gameCode:n,visible:i,mode:a,onModeSelected:o,onInviteAccepted:c,onGameJoined:ee,onClose:te}){let[l,u]=(0,F.useState)(`mode`),[f,m]=(0,F.useState)(``),[h,g]=(0,F.useState)([]),[_,v]=(0,F.useState)(!1),[y,x]=(0,F.useState)(null),[S,C]=(0,F.useState)(null),[E,D]=(0,F.useState)(n||``),[j,M]=(0,F.useState)(``),[N,P]=(0,F.useState)(``),[ne,R]=(0,F.useState)(null),z=(0,F.useRef)(null),B=(0,F.useRef)(null);(0,F.useEffect)(()=>{i&&l===`mode`&&setTimeout(()=>{},100)},[i,l]),(0,F.useEffect)(()=>{i&&l===`search`&&setTimeout(()=>B.current?.focus(),100)},[i,l]),(0,F.useEffect)(()=>{i||(u(`mode`),m(``),g([]),x(null),C(null),P(``),R(null))},[i]),(0,F.useEffect)(()=>{if(!i)return;let e=t=>{R(t),x(`accepted`),e?.(t)},t=e=>{e.ok?(R({acceptedByName:e.hostUserId,gameId:e.gameId}),t?.(e)):P(e.error||`Mã phòng không hợp lệ`)};return p.on(T.GAME_INVITE_ACCEPTED,e),p.on(T.GAME_JOINED,t),()=>{p.off(T.GAME_INVITE_ACCEPTED,e),p.off(T.GAME_JOINED,t)}},[i,c,ee]);let V=(0,F.useCallback)(async e=>{if(!e||e.length<2){g([]);return}v(!0);try{let t=await r.searchDirectory(e);g(t||[])}catch{g([])}finally{v(!1)}},[]),H=e=>{if(m(e),clearTimeout(z.current),e.length<2){g([]);return}z.current=setTimeout(()=>V(e),300)},U=async n=>{let r=E||L();E||D(r),C(n),x(`waiting`);try{await s(`/game-invites`,{method:`POST`,body:{toUserId:n.id,gameId:e,gameName:t,gameCode:r}})}catch(e){console.error(`[CoopInvite] game-invites API error:`,e.message)}if(p.connected)p.emit(T.GAME_INVITE_SEND,{toUserId:n.id,gameId:e,gameName:t,gameCode:r});else{try{p.connect()}catch{}setTimeout(()=>{p.connected&&p.emit(T.GAME_INVITE_SEND,{toUserId:n.id,gameId:e,gameName:t,gameCode:r})},500)}},W=()=>{let e=j.trim().toUpperCase();if(!e||e.length<4){P(`Vui lòng nhập mã phòng hợp lệ`);return}P(``),p.emit(T.GAME_JOIN_BY_CODE,{code:e})};return i?(0,I.jsx)(`div`,{className:`fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center font-[Segoe_UI,sans-serif] text-white animate-[fadeIn_0.3s_ease]`,children:(0,I.jsxs)(`div`,{className:`bg-[#1e2a4a] rounded-[20px] p-8 max-w-[420px] w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease]`,children:[l===`mode`&&(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(`h2`,{className:`text-[1.5rem] font-bold mb-2 inline-flex items-center gap-2`,children:[(0,I.jsx)(w,{className:`w-6 h-6`}),` Chọn chế độ chơi`]}),(0,I.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-5`,children:t}),(0,I.jsxs)(`div`,{className:`flex gap-3 mb-5`,children:[(0,I.jsxs)(`button`,{onClick:()=>{o?.(`solo`)},className:`flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5`,children:[(0,I.jsx)(O,{className:`w-6 h-6 mx-auto mb-1.5`}),`Chơi với máy`]}),(0,I.jsxs)(`button`,{onClick:()=>u(`search`),className:`flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5`,children:[(0,I.jsx)(A,{className:`w-6 h-6 mx-auto mb-1.5`}),`Chơi với người`]})]}),(0,I.jsx)(`button`,{onClick:()=>u(`join-code`),className:`w-full py-2.5 rounded-[10px] border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:(0,I.jsxs)(`span`,{className:`inline-flex items-center gap-1.5`,children:[(0,I.jsx)(b,{className:`w-3.5 h-3.5`}),` Nhập mã phòng`]})})]}),l===`search`&&(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(`h2`,{className:`text-[1.5rem] font-bold mb-2 inline-flex items-center gap-2`,children:[(0,I.jsx)(A,{className:`w-6 h-6`}),` Tìm người chơi`]}),(0,I.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-4`,children:`Nhập tên để tìm và mời bạn cùng chơi`}),(0,I.jsx)(k,{ref:B,type:`text`,placeholder:`Tìm kiếm người chơi...`,value:f,onChange:H,variant:`dark`,className:`py-2.5 px-3.5 rounded-[10px] text-[0.9rem] mb-3 focus:border-[#4ecdc4]`}),(0,I.jsxs)(`div`,{className:`max-h-[200px] overflow-y-auto text-left mb-3`,children:[_&&(0,I.jsxs)(`div`,{className:`text-center py-3 opacity-50`,children:[(0,I.jsx)(`span`,{className:`inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5`}),`Đang tìm...`]}),!_&&h.length===0&&f.length>=2&&(0,I.jsx)(`div`,{className:`text-center py-3 opacity-50 text-[0.85rem]`,children:`Không tìm thấy`}),h.map(e=>(0,I.jsxs)(`div`,{className:`flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] cursor-pointer transition hover:bg-white/8 mb-1`,children:[(0,I.jsx)(`div`,{className:`w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center font-bold text-[0.85rem] shrink-0`,children:(e.name||e.username||`?`)[0].toUpperCase()}),(0,I.jsxs)(`div`,{className:`text-left flex-1 min-w-0`,children:[(0,I.jsx)(`div`,{className:`text-[0.9rem] font-semibold truncate`,children:e.name||e.username}),(0,I.jsxs)(`div`,{className:`text-[0.75rem] opacity-50`,children:[`@`,e.username||``]})]}),(0,I.jsx)(`button`,{onClick:t=>{t.stopPropagation(),U(e)},className:`py-1.5 px-3.5 rounded-lg border-none bg-[#4ecdc4] text-[#1a1a2e] font-bold text-[0.8rem] cursor-pointer shrink-0 hover:brightness-110`,children:`Mời chơi`})]},e.id))]}),(0,I.jsx)(`button`,{onClick:()=>{u(`mode`),m(``),g([])},className:`py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`← Quay lại`})]}),l===`join-code`&&(0,I.jsxs)(I.Fragment,{children:[(0,I.jsxs)(`h2`,{className:`text-[1.5rem] font-bold mb-2 inline-flex items-center gap-2`,children:[(0,I.jsx)(b,{className:`w-6 h-6`}),` Nhập mã phòng`]}),(0,I.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-4`,children:`Nhập mã 6 ký tự từ bạn bè để vào phòng`}),(0,I.jsx)(k,{type:`text`,maxLength:6,placeholder:`MÃ PHÒNG`,value:j,onChange:e=>M(e.toUpperCase()),onKeyDown:e=>e.key===`Enter`&&W(),variant:`dark`,className:`py-3.5 border-2 font-mono text-[1.5rem] font-bold text-center tracking-[8px] uppercase focus:border-[#4ecdc4]`}),N&&(0,I.jsx)(`div`,{className:`text-[#e94560] text-[0.85rem] mt-2 min-h-[1.2em]`,children:N}),(0,I.jsx)(`button`,{onClick:W,className:`w-full mt-4 py-3 rounded-[10px] font-bold text-[0.95rem] border-2 border-[#f4b942] bg-[#f4b942] text-white cursor-pointer transition hover:brightness-110 active:scale-95`,children:`Vào phòng`}),(0,I.jsx)(`button`,{onClick:()=>{u(`mode`),M(``),P(``)},className:`w-full mt-2 py-2 rounded-[10px] font-semibold text-[0.85rem] bg-transparent text-white/60 border-2 border-white/15 cursor-pointer transition hover:text-white hover:border-white/30`,children:`← Quay lại`})]}),y===`waiting`&&(0,I.jsxs)(`div`,{className:`mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#f4b942] text-[0.85rem]`,children:[(0,I.jsx)(`span`,{className:`inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5`}),`Đang chờ `,S?.name||S?.username,` chấp nhận...`,E&&(0,I.jsxs)(`div`,{className:`mt-2`,children:[`Mã phòng: `,(0,I.jsx)(`span`,{className:`font-mono font-bold tracking-wider`,children:E})]}),(0,I.jsx)(`button`,{onClick:()=>{x(null),C(null),u(`search`)},className:`mt-3 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`← Hủy và tìm người khác`})]}),y===`accepted`&&(0,I.jsx)(`div`,{className:`mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#4ecdc4] text-[0.85rem]`,children:(0,I.jsxs)(`span`,{className:`inline-flex items-center gap-1.5`,children:[(0,I.jsx)(w,{className:`w-4 h-4`}),` `,ne?.acceptedByName||`Bạn`,` đã tham gia!`]})}),(0,I.jsx)(`button`,{onClick:te,className:`mt-4 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/50 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:(0,I.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,I.jsx)(d,{className:`w-3.5 h-3.5`}),` Đóng`]})})]})}):null}function z({coins:e=0,hearts:t=100,gameName:n=`Trò chơi`,petMessage:r,onQuit:i}){let[a,o]=(0,F.useState)(!0),s=x(e);return(0,I.jsxs)(`div`,{className:`pointer-events-none absolute inset-x-0 top-0 z-20 px-2.5 pt-2.5 flex items-start justify-between gap-2`,children:[(0,I.jsxs)(`div`,{className:`pointer-events-auto flex items-center gap-2`,children:[(0,I.jsxs)(`button`,{onClick:i,className:`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full pl-2 pr-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600 hover:text-rose-500 transition active:scale-95`,title:`Thoát game`,children:[(0,I.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center`,children:(0,I.jsx)(E,{className:`w-3.5 h-3.5`})}),(0,I.jsx)(`span`,{className:`text-[11px] font-extrabold max-w-[120px] truncate`,children:`Thoát`})]}),(0,I.jsxs)(`span`,{className:`hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600`,children:[(0,I.jsx)(w,{className:`w-4 h-4 text-sky-500`}),(0,I.jsx)(`span`,{className:`text-[11px] font-extrabold max-w-[160px] truncate`,children:n})]})]}),(0,I.jsxs)(`div`,{className:`pointer-events-auto flex flex-col items-end gap-2`,children:[(0,I.jsxs)(`div`,{className:`flex items-center gap-1.5 transition-all ${a?``:`opacity-0 scale-95 pointer-events-none`}`,children:[(0,I.jsxs)(B,{children:[(0,I.jsx)(`span`,{className:`w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm`,children:(0,I.jsx)(M,{className:`w-3 h-3`,fill:`currentColor`})}),(0,I.jsx)(`span`,{className:`font-extrabold text-slate-700 text-xs`,children:(e||0).toLocaleString()})]}),(0,I.jsxs)(B,{wide:!0,children:[(0,I.jsx)(`span`,{className:`w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center shadow-sm`,children:(0,I.jsx)(M,{className:`w-3 h-3`,fill:`currentColor`})}),(0,I.jsxs)(`span`,{className:`font-extrabold text-slate-700 text-xs whitespace-nowrap`,children:[`Lv `,s.level]}),(0,I.jsx)(`span`,{className:`w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden`,children:(0,I.jsx)(`span`,{className:`block h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500`,style:{width:`${s.percent??0}%`}})})]}),(0,I.jsxs)(B,{children:[(0,I.jsx)(`span`,{className:`text-xs leading-none`,children:`❤️`}),(0,I.jsx)(`span`,{className:`font-extrabold text-slate-700 text-xs`,children:t})]}),(0,I.jsx)(`button`,{onClick:()=>o(!1),className:`w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center`,"aria-label":`Ẩn thanh trạng thái`,children:(0,I.jsx)(f,{className:`w-4 h-4`})})]}),!a&&(0,I.jsx)(`button`,{onClick:()=>o(!0),className:`w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center`,"aria-label":`Hiện thanh trạng thái`,children:(0,I.jsx)(C,{className:`w-4 h-4`})}),(0,I.jsxs)(`div`,{className:`pointer-events-auto flex items-end gap-2`,children:[(0,I.jsx)(D,{message:r,compact:!0,className:`mb-6`}),(0,I.jsx)(`div`,{className:`w-14 h-14 rounded-full bg-white shadow-[0_6px_16px_rgba(15,60,120,.16)] flex items-center justify-center ring-2 ring-amber-300 shrink-0`,children:(0,I.jsx)(j,{size:42,bounce:!0})})]})]})]})}function B({children:e,wide:t=!1}){return(0,I.jsx)(`span`,{className:`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-2.5 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] `,children:e})}var V=`/* eslint-disable */
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
})(typeof window !== 'undefined' ? window : globalThis);`,H=`<!-- EG_DRESSUP_START -->`,U=`<!-- EG_DRESSUP_END -->`;function W(){return[H,`<script>`,`/* --- thân rồng (từ src/games/_shared/lib/dressUpDragon.js) --- */`,h.trim(),`/* --- dữ liệu SVG dùng chung (inject từ src/games/_shared/lib/dressUpAvatarData.js) --- */`,g.trim(),`/* --- lớp lưu trữ client + đồng bộ hồ sơ (inject từ src/games/_shared/lib/dressUpBridge.js) --- */`,V.trim(),`<\/script>`,U].join(`
`)}function re(e){if(!e||typeof e!=`string`)return e;let t=e.indexOf(H),n=e.indexOf(U);return t===-1||n===-1||n<t?e:e.slice(0,t)+e.slice(n+23)}function ie(e){if(!e||typeof e!=`string`||!e.includes(`EG_DRESSUP_HOST`))return e;let t=re(e),n=W(),r=t.match(/<head[^>]*>/i);if(r){let e=r.index+r[0].length;return t.slice(0,e)+`
`+n+`
`+t.slice(e)}return n+`
`+t}function G({htmlContent:e,game:a,questions:u,players:d,playerName:f,playMode:h,onFinish:g,onQuit:b,onStateUpdate:x,userAuth:C,coopSessionId:w,coopOpponent:E,onCoopReady:D,gameKey:O,gameConfig:k}){let A=(0,F.useRef)(null),[j,M]=(0,F.useState)(!1),[L,B]=(0,F.useState)(h||`solo`),[V,H]=(0,F.useState)(E||null),[U,W]=(0,F.useState)(0),[re,G]=(0,F.useState)(`Chúc bạn chơi vui vẻ!`),[ae,oe]=(0,F.useState)(!1),K=(0,F.useRef)([]),se=(0,F.useRef)(null),q=a?._id?.toString()||a?.id,J=a?.name||`Trò chơi`,Y=a?.code||``,[X,ce]=(0,F.useState)(null),Z=(0,F.useCallback)((e,t,n)=>{if(e==null)return;let r=String(e),i=K.current,a=i.findIndex(e=>e.questionId===r),o={questionId:r,value:t??null,timeSpent:typeof n==`number`?n:void 0};a>=0?i[a]=o:i.push(o);let s=(u||[]).find(e=>String(e?.id)===r);ce({questionId:r,value:o.value,content:s?.content||s?.question||null})},[u]),le=(0,F.useMemo)(()=>{if(!e)return e;let t=O?P(e,{key:O,config:k}):e;return ie(ne(t))},[e,O,k]);(0,F.useEffect)(()=>{!p.connected&&C?.token&&(p.auth={token:C.token},p.connect())},[]);let ue=(0,F.useCallback)(async()=>{let e=A.current;if(!e?.contentWindow)return;K.current=[],se.current=n(`play`),ce(null);let t=(d||[]).map(e=>typeof e==`string`?e:e?.name).filter(Boolean),r=0,s=0,c=3,l=null,p=null,g=null,v=null,b=null,x=null,S=null;try{if(q){let e=await o.getGame(q);e?.loadout&&(g=e.loadout),e&&(e.level>1||e.gameState)&&(S={level:Number(e.level)||1,progress:Number(e.progress)||0,gamesPlayed:Number(e.gamesPlayed)||0,state:e.gameState||null,lastPlayedAt:e.lastPlayedAt||null})}}catch{}if(C?.token)try{l=C.token,p=C.user?.id;let e=await i.get();r=e?.coins||0,W(r),s=e?.stars||0;try{let e=await y.getTasks(`DAILY`),t=(e?.tasks||[]).find(e=>e.code===`SPIN_WHEEL`);t&&(c=e.spinsLeft??Math.max(0,t.target-(t.progress||0)))}catch{}try{let e=await te.me();b=e?.avatar||null,x=e?.pet||null}catch{}try{let e=_(b,x),t=m(`avatar`,e.avatar.value).replace(/^<svg[^>]*>/,``).replace(/<\/svg>$/,``);t&&(v=t)}catch{}}catch{}let T=L||h||`solo`;e.contentWindow.postMessage({type:`init`,data:{gameId:q,playerName:f||`Player`,players:t,questions:u||[],apiBase:ee,playMode:T,questionsTotal:u?.length||0,userCoins:r,coins:r,userStars:s,stars:s,spinsLeft:c,authToken:l,userId:p,loadout:g,avatarSvg:v,avatar:b,pet:x,gameName:J,gameCode:Y,sessionId:w||null,opponent:V||null,gameKey:O||null,gameConfig:k||null,gameMode:a?.gameMode||`quiz`,savedProgress:S,loggedIn:!!C?.token}},`*`)},[a,f,u,d,h,C,L,w,V,O,k]),Q=(0,F.useCallback)(e=>{let t=A.current;t?.contentWindow&&t.contentWindow.postMessage(e,`*`)},[]),de=(0,F.useCallback)(async e=>{try{let t=await r.searchDirectory(e);Q({type:`search-results`,data:{users:t||[]}})}catch(e){console.error(`[HtmlGameLoader] Search error:`,e),Q({type:`search-results`,data:{users:[]}})}},[Q]),fe=(0,F.useCallback)(async e=>{if(!e)return;let{toUserId:t,gameName:n,gameCode:r}=e,i={toUserId:t,gameId:q,gameName:n||J,gameCode:r||Y};try{await s(`/game-invites`,{method:`POST`,body:i})}catch(e){console.error(`[HtmlGameLoader] game-invites API error:`,e.message)}if(p.connected)p.emit(T.GAME_INVITE_SEND,i);else{try{p.connect()}catch{}setTimeout(()=>{p.connected&&p.emit(T.GAME_INVITE_SEND,i)},500)}Q({type:`invite-sent`,data:{ok:!0,toUserId:t}})},[q,J,Y,Q]),$=(0,F.useCallback)(e=>{e&&p.emit(T.GAME_MOVE,{gameId:q,...e})},[q]),pe=(0,F.useCallback)(e=>{if(!e)return;let t=V?.sessionId||w;t&&p.emit(T.XO_MOVE,{sessionId:t,row:e.row,col:e.col})},[V,w]),me=(0,F.useCallback)(()=>{let e=V?.sessionId||w;e&&p.emit(T.XO_REMATCH,{sessionId:e})},[V,w]),he=(0,F.useCallback)(e=>{e&&(!p.connected&&C?.token&&(p.auth={token:C.token},p.connect()),p.emit(T.GAME_JOIN_BY_CODE,{code:e.code}),setTimeout(()=>{!p.connected&&C?.token&&p.emit(T.GAME_JOIN_BY_CODE,{code:e.code})},1500))},[C]),ge=(0,F.useCallback)(async e=>{try{let t=await l.list();Q({type:`classes-data`,requestId:e,data:{classrooms:t||[]}})}catch(t){console.error(`[HtmlGameLoader] request-classes error:`,t),Q({type:`classes-data`,requestId:e,data:{error:`Không thể tải danh sách lớp học`,classrooms:[]}})}},[Q]),_e=(0,F.useCallback)(async(e,t)=>{try{let n=await l.getStudents(e);Q({type:`students-data`,requestId:t,data:{students:n||[]}})}catch(e){console.error(`[HtmlGameLoader] request-students error:`,e),Q({type:`students-data`,requestId:t,data:{error:`Không thể tải danh sách học sinh`,students:[]}})}},[Q]);(0,F.useEffect)(()=>{let e=e=>{if(e.source!==A.current?.contentWindow)return;let n=e.data;if(!(!n||typeof n!=`object`)){if(n.source===`game`&&n.type){let e=q||n.data?.gameId;S(n.type,{gameId:e,...n.data}).catch(()=>{});return}if(n.type===`ready`||n.type===`bridge-ready`)ue();else if(n.type===`show-coop-panel`)M(!0);else if(n.type===`answer`||n.type===`answer-recorded`){let e=n.data||{};Z(e.questionId??e.id,e.value??e.answer,e.timeSpent)}else if(n.type===`answers`){let e=Array.isArray(n.data?.answers)?n.data.answers:[];for(let t of e)Z(t?.questionId,t?.value,t?.timeSpent)}else if(n.type===`save-progress`){let e=n.data||{};if(!q||!C?.token)Q({type:`progress-saved`,data:{ok:!1,reason:`not-logged-in`}});else{let t={};e.level!=null&&(t.level=Math.max(1,Math.floor(Number(e.level)||1))),e.progress!=null&&(t.progress=Math.max(0,Math.min(1,Number(e.progress)||0))),e.experience!=null&&(t.experience=Math.max(0,Math.floor(Number(e.experience)||0))),e.state!==void 0&&(t.gameState=e.state),o.upsertGame(q,t).then(()=>Q({type:`progress-saved`,data:{ok:!0,level:t.level}})).catch(e=>{console.error(`[HtmlGameLoader] Lưu tiến độ lỗi:`,e),Q({type:`progress-saved`,data:{ok:!1,reason:e.message}})})}}else if(n.type===`get-progress`)!q||!C?.token?Q({type:`progress`,data:null}):o.getGame(q).then(e=>Q({type:`progress`,data:e?{level:Number(e.level)||1,progress:Number(e.progress)||0,state:e.gameState||null}:null})).catch(()=>Q({type:`progress`,data:null}));else if(n.type===`add-coins`){let e=n.data?.amount||0;e>0&&C?.token&&c.rewardCoins(e).then(t=>{Q({type:`coins-added`,data:{success:!0,coins:t?.coins??0}}),W(t?.coins??0),G(`🎉 Tuyệt vời! +${e} coin`),v(Math.min(10,e),{correct:1}),x?.({coins:t?.coins??0})}).catch(()=>{Q({type:`coins-added`,data:{success:!1}})})}else if(n.type===`spin-wheel`)C?.token&&S(`SPIN`,{}).then(e=>{let t=e?.completedTasks?.find(e=>e.code===`SPIN_WHEEL`),n=t?Math.max(0,3-(t.progress||0)):void 0;Q({type:`spin-tracked`,data:{success:!0,spinsLeft:n}})}).catch(()=>{Q({type:`spin-tracked`,data:{success:!1}})});else if(n.type===`exchange-stars`)C?.token&&i.exchange(`starToCoin`).then(e=>{Q({type:`exchange-stars-result`,data:{success:!0,coins:e.coins||0,stars:e.stars||0,exchanged:e.gained||0}}),e.coins&&x?.({coins:e.coins})}).catch(()=>{Q({type:`exchange-stars-result`,data:{success:!1}})});else if(n.type===`save-loadout`){let e=n.data?.loadout;e&&q&&C?.token&&o.upsertGame(q,{loadout:e}).catch(()=>{})}else if(n.type===`outfit-save`){let e=n.data||{};if(!C?.token)Q({type:`outfit-saved`,data:{ok:!1,scope:e.scope,reason:`not-logged-in`}});else{let t=e.scope===`pet`?`pet`:`avatar`,n={[t]:e.value};s(`/auth/me`,{method:`PUT`,body:n}).then(n=>{let r=n?.[t];Q({type:`outfit-saved`,data:{ok:!0,scope:t,value:r??e.value,updatedAt:r?.updatedAt??null}})}).catch(e=>{console.error(`[HtmlGameLoader] Lưu avatar lỗi:`,e),Q({type:`outfit-saved`,data:{ok:!1,scope:t,reason:e.message}})})}}else if(n.type===`game-over`){let e=n.data||{},r=Array.isArray(e.answers)&&e.answers.length>0?e.answers:K.current,i=e.totalQuestions||r.length||0,a=e.correct??0,o=i>0?Math.round(a/i*100):0;G(i>0&&a/i>=.8?`🌟 Giỏi quá! Tui tự hào về bạn!`:`💪 Khéo lắm! Hẹn gặp lại nha~`),C?.token&&i>0&&o>=80&&t.add(1).catch(e=>console.error(`[Ticket] Failed to add ticket:`,e)),g?.({score:e.score||0,correct:a,totalQuestions:i,timeUsed:e.timeUsed||0,coinReward:e.coinReward||0,studentId:e.studentId||null,studentName:e.studentName||null,answers:r,playId:se.current,questionIds:(u||[]).map(e=>e?.id).filter(Boolean)})}else n.type===`state-update`?x?.(n.data):n.type===`quit`?b?.():n.type===`hide-hud`?oe(!0):n.type===`search-user`?de(n.data?.query):n.type===`invite-user`?fe(n.data):n.type===`game-move`?$(n.data):n.type===`xo-move`?pe(n.data):n.type===`xo-rematch`?me():n.type===`join-by-code`?he(n.data):n.type===`request-classes`?ge(n.requestId):n.type===`request-students`&&_e(n.data?.classId,n.requestId)}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[ue,g,b,x,de,fe,$,pe,me,he,ge,_e,C,Q,q,Z,u,Q]),(0,F.useEffect)(()=>{let e=e=>{Q({type:`opponent-move`,data:e})},t=e=>{H(e),B(`multiplayer`),Q({type:`invite-accepted`,data:e}),Q({type:`multiplayer-start`,data:{opponent:e,sessionId:e.sessionId}}),Q({type:`init`,data:{gameId:q,playerName:f||`Player`,playMode:`multiplayer`,gameName:J,gameCode:Y,sessionId:e.sessionId,opponent:e}})},n=e=>{e.ok?(H({acceptedByName:e.hostUserId}),B(`multiplayer`),Q({type:`game-joined`,data:e}),Q({type:`init`,data:{gameId:e.gameId||q,playerName:f||`Player`,playMode:`multiplayer`,gameName:J,gameCode:Y,sessionId:e.sessionId,opponent:{acceptedBy:e.hostUserId}}})):Q({type:`game-joined`,data:e})};p.on(T.GAME_MOVE,e),p.on(T.GAME_INVITE_ACCEPTED,t),p.on(T.GAME_JOINED,n);let r=e=>Q({type:`xo-sync`,data:e}),i=e=>Q({type:`xo-move-result`,data:e}),a=e=>Q({type:`xo-result`,data:e});return p.on(T.XO_SYNC,r),p.on(T.XO_MOVE_RESULT,i),p.on(T.XO_RESULT,a),()=>{p.off(T.GAME_MOVE,e),p.off(T.GAME_INVITE_ACCEPTED,t),p.off(T.GAME_JOINED,n),p.off(T.XO_SYNC,r),p.off(T.XO_MOVE_RESULT,i),p.off(T.XO_RESULT,a)}},[Q,q,f,J,Y]),(0,F.useEffect)(()=>{let e=V?.sessionId||w;if(!e)return;let t=()=>p.emit(T.XO_SYNC_REQUEST,{sessionId:e});return t(),p.on(`connect`,t),()=>p.off(`connect`,t)},[V,w]),(0,F.useEffect)(()=>{w&&E&&(H(E),B(`multiplayer`),Q({type:`invite-accepted`,data:E}),Q({type:`multiplayer-start`,data:{opponent:E,sessionId:w}}))},[w,E]);let ve=(0,F.useCallback)(e=>{e===`solo`&&(M(!1),B(`solo`),Q({type:`mode-selected`,data:{mode:`solo`}})),B(e)},[Q]),ye=(0,F.useCallback)(e=>{M(!1),H(e),B(`multiplayer`),Q({type:`invite-accepted`,data:e}),Q({type:`multiplayer-start`,data:{opponent:e,sessionId:e.sessionId}}),D?.(e)},[Q,D]),be=(0,F.useCallback)(e=>{M(!1),B(`multiplayer`),Q({type:`game-joined`,data:e}),D?.(e)},[Q,D]);return(0,F.useEffect)(()=>{let e=A.current;if(!e)return;let t=()=>{};return e.addEventListener(`load`,t),()=>e.removeEventListener(`load`,t)},[e]),le?(0,I.jsxs)(`div`,{className:`absolute inset-0 flex flex-col bg-paper`,children:[(0,I.jsx)(`iframe`,{ref:A,srcDoc:le,sandbox:`allow-scripts allow-same-origin allow-modals allow-pointer-lock`,className:`flex-1 w-full h-full border-0`,title:a?.title||`Game`}),!ae&&(0,I.jsx)(z,{coins:U,gameName:J,petMessage:re,onQuit:b}),(0,I.jsx)(R,{gameId:q,gameName:J,gameCode:Y,visible:j,mode:L,onModeSelected:ve,onInviteAccepted:ye,onGameJoined:be,onClose:()=>M(!1)}),X&&!ae&&(0,I.jsx)(N,{gameId:q,questionId:X.questionId,answer:X.value,questionText:X.content,label:`🤖`,className:`fixed bottom-24 right-4 z-40 w-12 h-12 p-0 rounded-full text-xl
                     bg-ink text-paper border-0 shadow-xl hover:bg-ink2`})]}):(0,I.jsx)(`div`,{className:`absolute inset-0 flex items-center justify-center bg-paper`,children:(0,I.jsx)(`p`,{className:`text-sm text-[#8A7C63]`,children:`Đang tải game...`})})}export{G as default};