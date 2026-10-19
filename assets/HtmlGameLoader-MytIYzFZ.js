import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{O as r,a as i,c as a,d as o,f as s,k as c,o as l,r as u,t as d}from"./api-ClWPTp-h.js";import{c as f,d as p,f as m,p as h,s as g,u as _}from"./dressUpAvatar-DAq_Kq6X.js";import{t as v}from"./star-C-CXczqK.js";import{t as y}from"./socket-B_z8xXZa.js";import{n as b}from"./petApi-_tDVW6On.js";import{Dt as x,T as S,_t as C,c as w,k as T,l as E,mt as D,w as O,x as k}from"./index-B5DMr8j2.js";import{t as A}from"./AiExplainTrigger-D_l4jNdw.js";import{t as j}from"./injectGameConfig-T9xd22zp.js";var M=e(t(),1),N=n();function P(){let e=``;for(let t=0;t<6;t++)e+=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`[Math.floor(Math.random()*32)];return e}function ee({gameId:e,gameName:t,gameCode:n,visible:r,mode:i,onModeSelected:a,onInviteAccepted:o,onGameJoined:s,onClose:l}){let[d,f]=(0,M.useState)(`mode`),[p,m]=(0,M.useState)(``),[h,g]=(0,M.useState)([]),[_,v]=(0,M.useState)(!1),[b,S]=(0,M.useState)(null),[C,w]=(0,M.useState)(null),[E,D]=(0,M.useState)(n||``),[O,k]=(0,M.useState)(``),[A,j]=(0,M.useState)(``),[ee,F]=(0,M.useState)(null),I=(0,M.useRef)(null),L=(0,M.useRef)(null);(0,M.useEffect)(()=>{r&&d===`mode`&&setTimeout(()=>{},100)},[r,d]),(0,M.useEffect)(()=>{r&&d===`search`&&setTimeout(()=>L.current?.focus(),100)},[r,d]),(0,M.useEffect)(()=>{r||(f(`mode`),m(``),g([]),S(null),w(null),j(``),F(null))},[r]),(0,M.useEffect)(()=>{if(!r)return;let e=t=>{F(t),S(`accepted`),e?.(t)},t=e=>{e.ok?(F({acceptedByName:e.hostUserId,gameId:e.gameId}),t?.(e)):j(e.error||`Mã phòng không hợp lệ`)};return y.on(T.GAME_INVITE_ACCEPTED,e),y.on(T.GAME_JOINED,t),()=>{y.off(T.GAME_INVITE_ACCEPTED,e),y.off(T.GAME_JOINED,t)}},[r,o,s]);let R=(0,M.useCallback)(async e=>{if(!e||e.length<2){g([]);return}v(!0);try{let t=await c.search(e);g(t||[])}catch{g([])}finally{v(!1)}},[]),z=e=>{let t=e.target.value;if(m(t),clearTimeout(I.current),t.length<2){g([]);return}I.current=setTimeout(()=>R(t),300)},B=async n=>{let r=E||P();E||D(r),w(n),S(`waiting`);try{await u(`/game-invites`,{method:`POST`,body:{toUserId:n.id,gameId:e,gameName:t,gameCode:r}})}catch(e){console.error(`[CoopInvite] game-invites API error:`,e.message)}if(y.connected)y.emit(T.GAME_INVITE_SEND,{toUserId:n.id,gameId:e,gameName:t,gameCode:r});else{try{y.connect()}catch{}setTimeout(()=>{y.connected&&y.emit(T.GAME_INVITE_SEND,{toUserId:n.id,gameId:e,gameName:t,gameCode:r})},500)}},V=()=>{let e=O.trim().toUpperCase();if(!e||e.length<4){j(`Vui lòng nhập mã phòng hợp lệ`);return}j(``),y.emit(T.GAME_JOIN_BY_CODE,{code:e})};return r?(0,N.jsx)(`div`,{className:`fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center font-[Segoe_UI,sans-serif] text-white animate-[fadeIn_0.3s_ease]`,children:(0,N.jsxs)(`div`,{className:`bg-[#1e2a4a] rounded-[20px] p-8 max-w-[420px] w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease]`,children:[d===`mode`&&(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`h2`,{className:`text-[1.5rem] font-bold mb-2`,children:`🎮 Chọn chế độ chơi`}),(0,N.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-5`,children:t}),(0,N.jsxs)(`div`,{className:`flex gap-3 mb-5`,children:[(0,N.jsxs)(`button`,{onClick:()=>{a?.(`solo`)},className:`flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5`,children:[(0,N.jsx)(`span`,{className:`text-2xl block mb-1.5`,children:`🤖`}),`Chơi với máy`]}),(0,N.jsxs)(`button`,{onClick:()=>f(`search`),className:`flex-1 py-3.5 px-3 rounded-[14px] border-2 border-white/15 bg-white/5 text-white cursor-pointer transition-all hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 hover:-translate-y-0.5`,children:[(0,N.jsx)(`span`,{className:`text-2xl block mb-1.5`,children:`👥`}),`Chơi với người`]})]}),(0,N.jsx)(`button`,{onClick:()=>f(`join-code`),className:`w-full py-2.5 rounded-[10px] border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`🔑 Nhập mã phòng`})]}),d===`search`&&(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`h2`,{className:`text-[1.5rem] font-bold mb-2`,children:`👥 Tìm người chơi`}),(0,N.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-4`,children:`Nhập tên để tìm và mời bạn cùng chơi`}),(0,N.jsx)(x,{ref:L,type:`text`,placeholder:`Tìm kiếm người chơi...`,value:p,onChange:z,variant:`dark`,className:`py-2.5 px-3.5 rounded-[10px] text-[0.9rem] mb-3 focus:border-[#4ecdc4]`}),(0,N.jsxs)(`div`,{className:`max-h-[200px] overflow-y-auto text-left mb-3`,children:[_&&(0,N.jsxs)(`div`,{className:`text-center py-3 opacity-50`,children:[(0,N.jsx)(`span`,{className:`inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5`}),`Đang tìm...`]}),!_&&h.length===0&&p.length>=2&&(0,N.jsx)(`div`,{className:`text-center py-3 opacity-50 text-[0.85rem]`,children:`Không tìm thấy`}),h.map(e=>(0,N.jsxs)(`div`,{className:`flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] cursor-pointer transition hover:bg-white/8 mb-1`,children:[(0,N.jsx)(`div`,{className:`w-9 h-9 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center font-bold text-[0.85rem] shrink-0`,children:(e.name||e.username||`?`)[0].toUpperCase()}),(0,N.jsxs)(`div`,{className:`text-left flex-1 min-w-0`,children:[(0,N.jsx)(`div`,{className:`text-[0.9rem] font-semibold truncate`,children:e.name||e.username}),(0,N.jsxs)(`div`,{className:`text-[0.75rem] opacity-50`,children:[`@`,e.username||``]})]}),(0,N.jsx)(`button`,{onClick:t=>{t.stopPropagation(),B(e)},className:`py-1.5 px-3.5 rounded-lg border-none bg-[#4ecdc4] text-[#1a1a2e] font-bold text-[0.8rem] cursor-pointer shrink-0 hover:brightness-110`,children:`Mời chơi`})]},e.id))]}),(0,N.jsx)(`button`,{onClick:()=>{f(`mode`),m(``),g([])},className:`py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`← Quay lại`})]}),d===`join-code`&&(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(`h2`,{className:`text-[1.5rem] font-bold mb-2`,children:`🔑 Nhập mã phòng`}),(0,N.jsx)(`p`,{className:`text-[0.9rem] opacity-70 mb-4`,children:`Nhập mã 6 ký tự từ bạn bè để vào phòng`}),(0,N.jsx)(x,{type:`text`,maxLength:6,placeholder:`MÃ PHÒNG`,value:O,onChange:e=>k(e.target.value.toUpperCase()),onKeyDown:e=>e.key===`Enter`&&V(),variant:`dark`,className:`py-3.5 border-2 font-mono text-[1.5rem] font-bold text-center tracking-[8px] uppercase focus:border-[#4ecdc4]`}),A&&(0,N.jsx)(`div`,{className:`text-[#e94560] text-[0.85rem] mt-2 min-h-[1.2em]`,children:A}),(0,N.jsx)(`button`,{onClick:V,className:`w-full mt-4 py-3 rounded-[10px] font-bold text-[0.95rem] border-2 border-[#f4b942] bg-[#f4b942] text-white cursor-pointer transition hover:brightness-110 active:scale-95`,children:`Vào phòng`}),(0,N.jsx)(`button`,{onClick:()=>{f(`mode`),k(``),j(``)},className:`w-full mt-2 py-2 rounded-[10px] font-semibold text-[0.85rem] bg-transparent text-white/60 border-2 border-white/15 cursor-pointer transition hover:text-white hover:border-white/30`,children:`← Quay lại`})]}),b===`waiting`&&(0,N.jsxs)(`div`,{className:`mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#f4b942] text-[0.85rem]`,children:[(0,N.jsx)(`span`,{className:`inline-block w-4 h-4 border-2 border-white/30 border-t-[#4ecdc4] rounded-full animate-spin mr-1.5`}),`Đang chờ `,C?.name||C?.username,` chấp nhận...`,E&&(0,N.jsxs)(`div`,{className:`mt-2`,children:[`Mã phòng: `,(0,N.jsx)(`span`,{className:`font-mono font-bold tracking-wider`,children:E})]}),(0,N.jsx)(`button`,{onClick:()=>{S(null),w(null),f(`search`)},className:`mt-3 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/70 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`← Hủy và tìm người khác`})]}),b===`accepted`&&(0,N.jsxs)(`div`,{className:`mt-4 p-3 rounded-[10px] bg-white/5 border-l-[3px] border-[#4ecdc4] text-[0.85rem]`,children:[`🎮 `,ee?.acceptedByName||`Bạn`,` đã tham gia!`]}),(0,N.jsx)(`button`,{onClick:l,className:`mt-4 py-2 px-4 rounded-lg border border-white/20 bg-transparent text-white/50 cursor-pointer text-[0.85rem] hover:text-white hover:border-white/40 transition`,children:`✕ Đóng`})]})}):null}function F({coins:e=0,hearts:t=100,gameName:n=`Trò chơi`,petMessage:r,onQuit:i}){let[a,o]=(0,M.useState)(!0),s=k(e);return(0,N.jsxs)(`div`,{className:`pointer-events-none absolute inset-x-0 top-0 z-20 px-2.5 pt-2.5 flex items-start justify-between gap-2`,children:[(0,N.jsxs)(`div`,{className:`pointer-events-auto flex items-center gap-2`,children:[(0,N.jsxs)(`button`,{onClick:i,className:`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full pl-2 pr-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600 hover:text-rose-500 transition active:scale-95`,title:`Thoát game`,children:[(0,N.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center`,children:(0,N.jsx)(D,{className:`w-3.5 h-3.5`})}),(0,N.jsx)(`span`,{className:`text-[11px] font-extrabold max-w-[120px] truncate`,children:`Thoát`})]}),(0,N.jsxs)(`span`,{className:`hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-600`,children:[(0,N.jsx)(C,{className:`w-4 h-4 text-sky-500`}),(0,N.jsx)(`span`,{className:`text-[11px] font-extrabold max-w-[160px] truncate`,children:n})]})]}),(0,N.jsxs)(`div`,{className:`pointer-events-auto flex flex-col items-end gap-2`,children:[(0,N.jsxs)(`div`,{className:`flex items-center gap-1.5 transition-all ${a?``:`opacity-0 scale-95 pointer-events-none`}`,children:[(0,N.jsxs)(I,{children:[(0,N.jsx)(`span`,{className:`w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm`,children:(0,N.jsx)(v,{className:`w-3 h-3`,fill:`currentColor`})}),(0,N.jsx)(`span`,{className:`font-extrabold text-slate-700 text-xs`,children:(e||0).toLocaleString()})]}),(0,N.jsxs)(I,{wide:!0,children:[(0,N.jsx)(`span`,{className:`w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center shadow-sm`,children:(0,N.jsx)(v,{className:`w-3 h-3`,fill:`currentColor`})}),(0,N.jsxs)(`span`,{className:`font-extrabold text-slate-700 text-xs whitespace-nowrap`,children:[`Lv `,s.level]}),(0,N.jsx)(`span`,{className:`w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden`,children:(0,N.jsx)(`span`,{className:`block h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500`,style:{width:`${s.percent??0}%`}})})]}),(0,N.jsxs)(I,{children:[(0,N.jsx)(`span`,{className:`text-xs leading-none`,children:`❤️`}),(0,N.jsx)(`span`,{className:`font-extrabold text-slate-700 text-xs`,children:t})]}),(0,N.jsx)(`button`,{onClick:()=>o(!1),className:`w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center`,"aria-label":`Ẩn thanh trạng thái`,children:(0,N.jsx)(m,{className:`w-4 h-4`})})]}),!a&&(0,N.jsx)(`button`,{onClick:()=>o(!0),className:`w-7 h-7 rounded-full bg-white/95 backdrop-blur shadow-[0_6px_16px_rgba(15,60,120,.16)] text-slate-400 hover:text-slate-600 flex items-center justify-center`,"aria-label":`Hiện thanh trạng thái`,children:(0,N.jsx)(h,{className:`w-4 h-4`})}),(0,N.jsxs)(`div`,{className:`pointer-events-auto flex items-end gap-2`,children:[(0,N.jsx)(w,{message:r,compact:!0,className:`mb-6`}),(0,N.jsx)(`div`,{className:`w-14 h-14 rounded-full bg-white shadow-[0_6px_16px_rgba(15,60,120,.16)] flex items-center justify-center ring-2 ring-amber-300 shrink-0`,children:(0,N.jsx)(E,{size:42,bounce:!0})})]})]})]})}function I({children:e,wide:t=!1}){return(0,N.jsx)(`span`,{className:`flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-2.5 py-1.5 shadow-[0_6px_16px_rgba(15,60,120,.16)] `,children:e})}var L=`1.0.0`,R=`
<!-- EG_ANSWER_BRIDGE_START -->
<script>
(function() {
  if (window.EG_ANSWER && window.EG_ANSWER.version === "${L}") return;

  var _answers = {};   // questionId -> { questionId, value, timeSpent }
  var _sentReady = false;

  function _post(type, data) {
    try { window.parent.postMessage({ type: type, data: data || {} }, "*"); } catch (e) {}
  }

  window.EG_ANSWER = {
    version: "${L}",

    /** Ghi 1 câu trả lời (ghi đè nếu câu đó đã trả lời). */
    answer: function(questionId, value, timeSpent) {
      if (questionId == null) return;
      _answers[String(questionId)] = {
        questionId: String(questionId),
        value: value == null ? null : value,
        timeSpent: typeof timeSpent === "number" ? timeSpent : undefined
      };
      _post("answer-recorded", { questionId: String(questionId) });
    },

    /** Ghi nhiều câu một lượt. */
    answerAll: function(list) {
      if (!Array.isArray(list)) return;
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        if (!a) continue;
        this.answer(a.questionId, a.value, a.timeSpent);
      }
    },

    /** Đáp án dạng mảng để gửi lên server. */
    getAnswers: function() {
      return Object.keys(_answers).map(function(k) { return _answers[k]; });
    },

    clear: function() { _answers = {}; },

    /** Báo frame cha đã sẵn sàng (frame cha sẽ gửi init với questions). */
    markReady: function() {
      if (_sentReady) return;
      _sentReady = true;
      _post("ready");
    },

    /**
     * Gửi kết quả ván chơi. Danh sách answers mặc định lấy từ getAnswers().
     * Frame cha sẽ chấm lại ở server.
     */
    finish: function(payload) {
      var p = payload || {};
      var answers = Array.isArray(p.answers) ? p.answers : this.getAnswers();
      _post("game-over", {
        score: p.score || 0,
        correct: p.correct || 0,
        totalQuestions: p.totalQuestions || 0,
        timeUsed: p.timeUsed || 0,
        coinReward: p.coinReward || 0,
        answers: answers
      });
    }
  };

  // Bridge tự báo ready khi DOM sẵn sàng — game không cần chỉnh gì.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { window.EG_ANSWER.markReady(); });
  } else {
    window.EG_ANSWER.markReady();
  }
})();
<\/script>
<!-- EG_ANSWER_BRIDGE_END -->
`,z=`<!-- EG_ANSWER_BRIDGE_START -->`,B=`<!-- EG_ANSWER_BRIDGE_END -->`;function V(e){if(!e||typeof e!=`string`)return e;let t=e.indexOf(z),n=e.indexOf(B);if(t!==-1&&n!==-1&&n>t)return e.slice(0,t)+R.trim()+e.slice(n+29);let r=e.lastIndexOf(`</body>`);return r===-1?e+`
`+R.trim():e.slice(0,r)+`
`+R.trim()+`
`+e.slice(r)}var H=`/* eslint-disable */
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
    lsWrite(scope, { v: 1, value: clean, updatedAt: stamp });
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
          if (r.value && r.scope) lsWrite(r.scope, { v: 1, value: sanitize(r.scope, r.value) || r.value, updatedAt: r.updatedAt || null });
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
})(typeof window !== 'undefined' ? window : globalThis);`,U=`<!-- EG_DRESSUP_START -->`,W=`<!-- EG_DRESSUP_END -->`;function G(){return[U,`<script>`,`/* --- thân rồng (từ src/games/_shared/lib/dressUpDragon.js) --- */`,p.trim(),`/* --- dữ liệu SVG dùng chung (inject từ src/games/_shared/lib/dressUpAvatarData.js) --- */`,_.trim(),`/* --- lớp lưu trữ client + đồng bộ hồ sơ (inject từ src/games/_shared/lib/dressUpBridge.js) --- */`,H.trim(),`<\/script>`,W].join(`
`)}function te(e){if(!e||typeof e!=`string`)return e;let t=e.indexOf(U),n=e.indexOf(W);return t===-1||n===-1||n<t?e:e.slice(0,t)+e.slice(n+23)}function ne(e){if(!e||typeof e!=`string`||!e.includes(`EG_DRESSUP_HOST`))return e;let t=te(e),n=G(),r=t.match(/<head[^>]*>/i);if(r){let e=r.index+r[0].length;return t.slice(0,e)+`
`+n+`
`+t.slice(e)}return n+`
`+t}function K({htmlContent:e,game:t,questions:n,players:p,playerName:m,playMode:h,onFinish:_,onQuit:v,onStateUpdate:x,userAuth:C,coopSessionId:w,coopOpponent:E,onCoopReady:D,gameKey:k,gameConfig:P}){let I=(0,M.useRef)(null),[L,R]=(0,M.useState)(!1),[z,B]=(0,M.useState)(h||`solo`),[H,U]=(0,M.useState)(E||null),[W,G]=(0,M.useState)(0),[te,K]=(0,M.useState)(`Chúc bạn chơi vui vẻ!`),[re,ie]=(0,M.useState)(!1),q=(0,M.useRef)([]),ae=(0,M.useRef)(null),J=t?._id?.toString()||t?.id,Y=t?.name||`Trò chơi`,X=t?.code||``,[Z,oe]=(0,M.useState)(null),Q=(0,M.useCallback)((e,t,r)=>{if(e==null)return;let i=String(e),a=q.current,o=a.findIndex(e=>e.questionId===i),s={questionId:i,value:t??null,timeSpent:typeof r==`number`?r:void 0};o>=0?a[o]=s:a.push(s);let c=(n||[]).find(e=>String(e?.id)===i);oe({questionId:i,value:s.value,content:c?.content||c?.question||null})},[n]),se=(0,M.useMemo)(()=>e&&ne(V(k?j(e,{key:k,config:P}):e)),[e,k,P]);(0,M.useEffect)(()=>{!y.connected&&C?.token&&(y.auth={token:C.token},y.connect())},[]);let ce=(0,M.useCallback)(async()=>{let e=I.current;if(!e?.contentWindow)return;q.current=[],ae.current=r(`play`),oe(null);let o=(p||[]).map(e=>typeof e==`string`?e:e?.name).filter(Boolean),c=0,l=0,u=3,_=null,v=null,y=null,b=null,x=null,S=null,T=null;try{if(J){let e=await s.getGame(J);e?.loadout&&(y=e.loadout),e&&(e.level>1||e.gameState)&&(T={level:Number(e.level)||1,progress:Number(e.progress)||0,gamesPlayed:Number(e.gamesPlayed)||0,state:e.gameState||null,lastPlayedAt:e.lastPlayedAt||null})}}catch{}if(C?.token)try{_=C.token,v=C.user?.id,c=(await a.get())?.coins||0,G(c);try{let e=await(await fetch(`${d}/api/auth/me/stars`,{headers:{Authorization:`Bearer ${C.token}`}})).json();l=e?.data?.stars||e?.stars||0}catch{}try{let e=await O.getTasks(`DAILY`),t=(e?.tasks||[]).find(e=>e.code===`SPIN_WHEEL`);t&&(u=e.spinsLeft??Math.max(0,t.target-(t.progress||0)))}catch{}try{let e=await i.me();x=e?.avatar||null,S=e?.pet||null}catch{}try{let e=f(x,S),t=g(`avatar`,e.avatar.value).replace(/^<svg[^>]*>/,``).replace(/<\/svg>$/,``);t&&(b=t)}catch{}}catch{}let E=z||h||`solo`;e.contentWindow.postMessage({type:`init`,data:{gameId:J,playerName:m||`Player`,players:o,questions:n||[],apiBase:d,playMode:E,questionsTotal:n?.length||0,userCoins:c,coins:c,userStars:l,stars:l,spinsLeft:u,authToken:_,userId:v,loadout:y,avatarSvg:b,avatar:x,pet:S,gameName:Y,gameCode:X,sessionId:w||null,opponent:H||null,gameKey:k||null,gameConfig:P||null,gameMode:t?.gameMode||`quiz`,savedProgress:T,loggedIn:!!C?.token}},`*`)},[t,m,n,p,h,C,z,w,H,k,P]),$=(0,M.useCallback)(e=>{let t=I.current;t?.contentWindow&&t.contentWindow.postMessage(e,`*`)},[]),le=(0,M.useCallback)(async e=>{try{let t=await c.search(e);$({type:`search-results`,data:{users:t||[]}})}catch(e){console.error(`[HtmlGameLoader] Search error:`,e),$({type:`search-results`,data:{users:[]}})}},[$]),ue=(0,M.useCallback)(async e=>{if(!e)return;let{toUserId:t,gameName:n,gameCode:r}=e,i={toUserId:t,gameId:J,gameName:n||Y,gameCode:r||X};try{await u(`/game-invites`,{method:`POST`,body:i})}catch(e){console.error(`[HtmlGameLoader] game-invites API error:`,e.message)}if(y.connected)y.emit(T.GAME_INVITE_SEND,i);else{try{y.connect()}catch{}setTimeout(()=>{y.connected&&y.emit(T.GAME_INVITE_SEND,i)},500)}$({type:`invite-sent`,data:{ok:!0,toUserId:t}})},[J,Y,X,$]),de=(0,M.useCallback)(e=>{e&&y.emit(T.GAME_MOVE,{gameId:J,...e})},[J]),fe=(0,M.useCallback)(e=>{if(!e)return;let t=H?.sessionId||w;t&&y.emit(T.XO_MOVE,{sessionId:t,row:e.row,col:e.col})},[H,w]),pe=(0,M.useCallback)(()=>{let e=H?.sessionId||w;e&&y.emit(T.XO_REMATCH,{sessionId:e})},[H,w]),me=(0,M.useCallback)(e=>{e&&(!y.connected&&C?.token&&(y.auth={token:C.token},y.connect()),y.emit(T.GAME_JOIN_BY_CODE,{code:e.code}),setTimeout(()=>{!y.connected&&C?.token&&y.emit(T.GAME_JOIN_BY_CODE,{code:e.code})},1500))},[C]),he=(0,M.useCallback)(async e=>{try{let t=await l.list();$({type:`classes-data`,requestId:e,data:{classrooms:t||[]}})}catch(t){console.error(`[HtmlGameLoader] request-classes error:`,t),$({type:`classes-data`,requestId:e,data:{error:`Không thể tải danh sách lớp học`,classrooms:[]}})}},[$]),ge=(0,M.useCallback)(async(e,t)=>{try{let n=await l.getStudents(e);$({type:`students-data`,requestId:t,data:{students:n||[]}})}catch(e){console.error(`[HtmlGameLoader] request-students error:`,e),$({type:`students-data`,requestId:t,data:{error:`Không thể tải danh sách học sinh`,students:[]}})}},[$]);(0,M.useEffect)(()=>{let e=e=>{if(e.source!==I.current?.contentWindow)return;let t=e.data;if(!(!t||typeof t!=`object`)){if(t.source===`game`&&t.type){let e=J||t.data?.gameId;S(t.type,{gameId:e,...t.data}).catch(()=>{});return}if(t.type===`ready`||t.type===`bridge-ready`)ce();else if(t.type===`show-coop-panel`)R(!0);else if(t.type===`answer`||t.type===`answer-recorded`){let e=t.data||{};Q(e.questionId??e.id,e.value??e.answer,e.timeSpent)}else if(t.type===`answers`){let e=Array.isArray(t.data?.answers)?t.data.answers:[];for(let t of e)Q(t?.questionId,t?.value,t?.timeSpent)}else if(t.type===`save-progress`){let e=t.data||{};if(!J||!C?.token)$({type:`progress-saved`,data:{ok:!1,reason:`not-logged-in`}});else{let t={};e.level!=null&&(t.level=Math.max(1,Math.floor(Number(e.level)||1))),e.progress!=null&&(t.progress=Math.max(0,Math.min(1,Number(e.progress)||0))),e.experience!=null&&(t.experience=Math.max(0,Math.floor(Number(e.experience)||0))),e.state!==void 0&&(t.gameState=e.state),s.upsertGame(J,t).then(()=>$({type:`progress-saved`,data:{ok:!0,level:t.level}})).catch(e=>{console.error(`[HtmlGameLoader] Lưu tiến độ lỗi:`,e),$({type:`progress-saved`,data:{ok:!1,reason:e.message}})})}}else if(t.type===`get-progress`)!J||!C?.token?$({type:`progress`,data:null}):s.getGame(J).then(e=>$({type:`progress`,data:e?{level:Number(e.level)||1,progress:Number(e.progress)||0,state:e.gameState||null}:null})).catch(()=>$({type:`progress`,data:null}));else if(t.type===`add-coins`){let e=t.data?.amount||0;e>0&&C?.token&&o.rewardCoins(e).then(t=>{$({type:`coins-added`,data:{success:!0,coins:t?.coins??0}}),G(t?.coins??0),K(`🎉 Tuyệt vời! +${e} coin`),b(Math.min(10,e),{correct:1}),x?.({coins:t?.coins??0})}).catch(()=>{$({type:`coins-added`,data:{success:!1}})})}else if(t.type===`spin-wheel`)C?.token&&S(`SPIN`,{}).then(e=>{let t=e?.completedTasks?.find(e=>e.code===`SPIN_WHEEL`),n=t?Math.max(0,3-(t.progress||0)):void 0;$({type:`spin-tracked`,data:{success:!0,spinsLeft:n}})}).catch(()=>{$({type:`spin-tracked`,data:{success:!1}})});else if(t.type===`exchange-stars`)C?.token&&fetch(`${d}/api/auth/me/stars/exchange`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${C.token}`}}).then(e=>e.json()).then(e=>{let t=e?.data||e;$({type:`exchange-stars-result`,data:{success:!0,coins:t.coins||0,stars:t.stars||0,exchanged:t.exchanged||0}}),t.coins&&x?.({coins:t.coins})}).catch(()=>{$({type:`exchange-stars-result`,data:{success:!1}})});else if(t.type===`save-loadout`){let e=t.data?.loadout;e&&J&&C?.token&&s.upsertGame(J,{loadout:e}).catch(()=>{})}else if(t.type===`outfit-save`){let e=t.data||{};if(!C?.token)$({type:`outfit-saved`,data:{ok:!1,scope:e.scope,reason:`not-logged-in`}});else{let t=e.scope===`pet`?`pet`:`avatar`,n={[t]:e.value};u(`/auth/me`,{method:`PUT`,body:n}).then(n=>{let r=n?.[t];$({type:`outfit-saved`,data:{ok:!0,scope:t,value:r??e.value,updatedAt:r?.updatedAt??null}})}).catch(e=>{console.error(`[HtmlGameLoader] Lưu avatar lỗi:`,e),$({type:`outfit-saved`,data:{ok:!1,scope:t,reason:e.message}})})}}else if(t.type===`game-over`){let e=t.data||{},r=Array.isArray(e.answers)&&e.answers.length>0?e.answers:q.current,i=e.totalQuestions||r.length||0,a=e.correct??0;K(i>0&&a/i>=.8?`🌟 Giỏi quá! Tui tự hào về bạn!`:`💪 Khéo lắm! Hẹn gặp lại nha~`),_?.({score:e.score||0,correct:a,totalQuestions:i,timeUsed:e.timeUsed||0,coinReward:e.coinReward||0,studentId:e.studentId||null,studentName:e.studentName||null,answers:r,playId:ae.current,questionIds:(n||[]).map(e=>e?.id).filter(Boolean)})}else t.type===`state-update`?x?.(t.data):t.type===`quit`?v?.():t.type===`hide-hud`?ie(!0):t.type===`search-user`?le(t.data?.query):t.type===`invite-user`?ue(t.data):t.type===`game-move`?de(t.data):t.type===`xo-move`?fe(t.data):t.type===`xo-rematch`?pe():t.type===`join-by-code`?me(t.data):t.type===`request-classes`?he(t.requestId):t.type===`request-students`&&ge(t.data?.classId,t.requestId)}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[ce,_,v,x,le,ue,de,fe,pe,me,he,ge,C,$,J,Q,n,$]),(0,M.useEffect)(()=>{let e=e=>{$({type:`opponent-move`,data:e})},t=e=>{U(e),B(`multiplayer`),$({type:`invite-accepted`,data:e}),$({type:`multiplayer-start`,data:{opponent:e,sessionId:e.sessionId}}),$({type:`init`,data:{gameId:J,playerName:m||`Player`,playMode:`multiplayer`,gameName:Y,gameCode:X,sessionId:e.sessionId,opponent:e}})},n=e=>{e.ok?(U({acceptedByName:e.hostUserId}),B(`multiplayer`),$({type:`game-joined`,data:e}),$({type:`init`,data:{gameId:e.gameId||J,playerName:m||`Player`,playMode:`multiplayer`,gameName:Y,gameCode:X,sessionId:e.sessionId,opponent:{acceptedBy:e.hostUserId}}})):$({type:`game-joined`,data:e})};y.on(T.GAME_MOVE,e),y.on(T.GAME_INVITE_ACCEPTED,t),y.on(T.GAME_JOINED,n);let r=e=>$({type:`xo-sync`,data:e}),i=e=>$({type:`xo-move-result`,data:e}),a=e=>$({type:`xo-result`,data:e});return y.on(T.XO_SYNC,r),y.on(T.XO_MOVE_RESULT,i),y.on(T.XO_RESULT,a),()=>{y.off(T.GAME_MOVE,e),y.off(T.GAME_INVITE_ACCEPTED,t),y.off(T.GAME_JOINED,n),y.off(T.XO_SYNC,r),y.off(T.XO_MOVE_RESULT,i),y.off(T.XO_RESULT,a)}},[$,J,m,Y,X]),(0,M.useEffect)(()=>{let e=H?.sessionId||w;if(!e)return;let t=()=>y.emit(T.XO_SYNC_REQUEST,{sessionId:e});return t(),y.on(`connect`,t),()=>y.off(`connect`,t)},[H,w]),(0,M.useEffect)(()=>{w&&E&&(U(E),B(`multiplayer`),$({type:`invite-accepted`,data:E}),$({type:`multiplayer-start`,data:{opponent:E,sessionId:w}}))},[w,E]);let _e=(0,M.useCallback)(e=>{e===`solo`&&(R(!1),B(`solo`),$({type:`mode-selected`,data:{mode:`solo`}})),B(e)},[$]),ve=(0,M.useCallback)(e=>{R(!1),U(e),B(`multiplayer`),$({type:`invite-accepted`,data:e}),$({type:`multiplayer-start`,data:{opponent:e,sessionId:e.sessionId}}),D?.(e)},[$,D]),ye=(0,M.useCallback)(e=>{R(!1),B(`multiplayer`),$({type:`game-joined`,data:e}),D?.(e)},[$,D]);return(0,M.useEffect)(()=>{let e=I.current;if(!e)return;let t=()=>{};return e.addEventListener(`load`,t),()=>e.removeEventListener(`load`,t)},[e]),se?(0,N.jsxs)(`div`,{className:`absolute inset-0 flex flex-col bg-paper`,children:[(0,N.jsx)(`iframe`,{ref:I,srcDoc:se,sandbox:`allow-scripts allow-same-origin allow-modals allow-pointer-lock`,className:`flex-1 w-full h-full border-0`,title:t?.title||`Game`}),!re&&(0,N.jsx)(F,{coins:W,gameName:Y,petMessage:te,onQuit:v}),(0,N.jsx)(ee,{gameId:J,gameName:Y,gameCode:X,visible:L,mode:z,onModeSelected:_e,onInviteAccepted:ve,onGameJoined:ye,onClose:()=>R(!1)}),Z&&!re&&(0,N.jsx)(A,{gameId:J,questionId:Z.questionId,answer:Z.value,questionText:Z.content,label:`🤖`,className:`fixed bottom-24 right-4 z-40 w-12 h-12 p-0 rounded-full text-xl
                     bg-ink text-paper border-0 shadow-xl hover:bg-ink2`})]}):(0,N.jsx)(`div`,{className:`absolute inset-0 flex items-center justify-center bg-paper`,children:(0,N.jsx)(`p`,{className:`text-sm text-[#8A7C63]`,children:`Đang tải game...`})})}export{K as default};