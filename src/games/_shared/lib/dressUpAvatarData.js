/* eslint-disable */
/**
 * dressUpAvatarData.js — NGUỒN SVG DUY NHẤT cho 2 game tạo avatar
 *
 *   • "Tiệm thời trang cho Bé"  → renderKid()  (bé trai / bé gái / quái vật)
 *   • "Tiệm thay đồ thú cưng"   → renderPet()  (chó, mèo, thỏ, hamster, gấu trúc, cáo)
 *
 * File này CỐ TÌNH không phải ES module. Nó được nạp bằng `?raw` trong
 * `src/games/injectDressUpAvatar.js` rồi tiêm nguyên văn vào <head> của HTML game,
 * nên game nằm trong iframe tự dựng được SVG mà không cần bundler.
 *
 * Dùng chung `window.EG_DRESSUP`:
 *   EG_DRESSUP.renderPet(state)      → chuỗi <svg> thú cưng
 *   EG_DRESSUP.renderKid(state)      → chuỗi <svg> bé / quái vật
 *   EG_DRESSUP.sanitizePet(obj)      → state hợp lệ (fallback về mặc định)
 *   EG_DRESSUP.sanitizeKid(obj)      → state hợp lệ (fallback về mặc định)
 *   EG_DRESSUP.kidTabs(state)        → danh sách tab đang mở theo loại nhân vật
 *
 * Thêm item mới / sửa SVG → sửa CHỈ file này, 2 game tự có.
 */
(function (root) {
  'use strict';

  var INK = '#5a3a2a'; /* màu mũi chung */
  var _seq = 0;
  function nextId(p) { return p + (++_seq); }

  /* ===================================================================== *
   *  PHẦN 1 — THÚ CƯNG  (nguồn: Tiệm thay đồ thú cưng.html)
   * ===================================================================== */

  var ANIMALS = {
    dog: { n: 'Cún con', c: '#f0c27a', b: '#fbeed6',
      ears: '<ellipse cx="60" cy="80" rx="13" ry="26" fill="#b8763a" transform="rotate(18 60 80)"/><ellipse cx="140" cy="80" rx="13" ry="26" fill="#b8763a" transform="rotate(-18 140 80)"/>',
      tail: '<path d="M136 170 Q160 160 156 142" stroke="#f0c27a" stroke-width="10" stroke-linecap="round" fill="none"/>',
      muz: 1, nose: '#3b2418' },
    cat: { n: 'Mèo con', c: '#f4a95a', b: '#fbeed6',
      ears: '<polygon points="60,64 64,24 96,46" fill="#f4a95a"/><polygon points="67,56 68,36 85,47" fill="#f59ab0"/><polygon points="140,64 136,24 104,46" fill="#f4a95a"/><polygon points="133,56 132,36 115,47" fill="#f59ab0"/>',
      tail: '<path d="M136 172 Q188 166 172 120" stroke="#f4a95a" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="172" cy="122" r="7" fill="#d9822b"/>',
      extra: '<g stroke="#d9822b" stroke-width="3" stroke-linecap="round"><path d="M92 50v10M100 48v12M108 50v10"/></g>', whisk: 1 },
    rabbit: { n: 'Thỏ con', c: '#ffffff', b: '#f3eef8',
      ears: '<g stroke="#e2dcea" stroke-width="2"><ellipse cx="78" cy="32" rx="12" ry="34" fill="#fff" transform="rotate(-6 78 32)"/><ellipse cx="122" cy="32" rx="12" ry="34" fill="#fff" transform="rotate(6 122 32)"/></g><ellipse cx="78" cy="34" rx="5.5" ry="24" fill="#f9b8cb" transform="rotate(-6 78 34)"/><ellipse cx="122" cy="34" rx="5.5" ry="24" fill="#f9b8cb" transform="rotate(6 122 34)"/>',
      tail: '<circle cx="142" cy="172" r="10" fill="#fff" stroke="#e2dcea" stroke-width="2"/>', whisk: 1, line: '#e2dcea' },
    hamster: { n: 'Chuột hamster', c: '#f2b862', b: '#fdf0d8',
      ears: '<circle cx="64" cy="52" r="14" fill="#f2b862"/><circle cx="64" cy="52" r="7" fill="#f59ab0"/><circle cx="136" cy="52" r="14" fill="#f2b862"/><circle cx="136" cy="52" r="7" fill="#f59ab0"/>',
      tail: '', muz: 1, nose: '#f08aa0' },
    panda: { n: 'Gấu trúc', c: '#ffffff', b: '#f3eef8', arm: '#3a3a48', foot: '#3a3a48', line: '#e2dcea',
      ears: '<circle cx="62" cy="52" r="15" fill="#33333f"/><circle cx="138" cy="52" r="15" fill="#33333f"/>',
      tail: '', extra: '<ellipse cx="80" cy="92" rx="12" ry="14" fill="#33333f" transform="rotate(-20 80 92)"/><ellipse cx="120" cy="92" rx="12" ry="14" fill="#33333f" transform="rotate(20 120 92)"/>' },
    fox: { n: 'Cáo con', c: '#f58634', b: '#fff3e0',
      ears: '<polygon points="60,64 62,22 98,46" fill="#f58634"/><polygon points="66,56 67,36 86,47" fill="#fff3e0"/><polygon points="140,64 138,22 102,46" fill="#f58634"/><polygon points="134,56 133,36 114,47" fill="#fff3e0"/>',
      tail: '<path d="M134 168 Q192 178 186 124 Q170 152 134 150Z" fill="#f58634"/><path d="M186 124 Q182 144 172 150 Q184 156 188 140Z" fill="#fff"/>',
      extra: '<path d="M56 100 Q76 120 100 114 Q124 120 144 100 Q132 126 100 130 Q68 126 56 100Z" fill="#fff3e0"/>', nose: '#3b2418', whisk: 1 }
  };

  var PET_SHIRT = {
    red: '#ef5350', blue: '#4aa3df', yellow: '#ffd54f', green: '#66bb6a',
    pink: '#f48fb1', stripe: 'url(#egStPet)'
  };

  var PET_GLASSES = {
    round: '<g fill="#fff" fill-opacity=".3" stroke="#333" stroke-width="3"><circle cx="80" cy="92" r="13"/><circle cx="120" cy="92" r="13"/></g><path d="M93 90Q100 85 107 90" stroke="#333" stroke-width="3" fill="none"/>',
    square: '<g fill="#fff" fill-opacity=".3" stroke="#2f7fb5" stroke-width="3.5"><rect x="66" y="80" width="28" height="22" rx="5"/><rect x="106" y="80" width="28" height="22" rx="5"/></g><path d="M94 88h12" stroke="#2f7fb5" stroke-width="3.5"/>',
    sun: '<g fill="#222"><rect x="65" y="81" width="30" height="21" rx="9"/><rect x="105" y="81" width="30" height="21" rx="9"/></g><path d="M95 86h10" stroke="#222" stroke-width="3"/><path d="M71 87l8-3M111 87l8-3" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>',
    heart: '<g fill="#ff5d8f" stroke="#c2185b" stroke-width="2.5"><path d="M80 104C64 92 68 79 80 86 92 79 96 92 80 104Z"/><path d="M120 104C104 92 108 79 120 86 132 79 136 92 120 104Z"/></g>'
  };

  var PET_HAT = {
    party: '<path d="M80 50L100 6 120 50Z" fill="#ff7eb6"/><g fill="#fff"><circle cx="96" cy="34" r="3"/><circle cx="106" cy="26" r="3"/><circle cx="104" cy="42" r="3"/></g><circle cx="100" cy="6" r="6" fill="#ffd54f"/>',
    crown: '<path d="M74 52L78 22 91 38 100 16 109 38 122 22 126 52Z" fill="#ffc929" stroke="#d99a00" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="40" r="4" fill="#ef5350"/>',
    beanie: '<path d="M66 58Q68 18 100 18T134 58Z" fill="#4aa3df"/><rect x="64" y="50" width="72" height="12" rx="6" fill="#2f7fb5"/><circle cx="100" cy="16" r="8" fill="#fff"/>',
    chef: '<path d="M72 56Q58 34 78 28 84 12 102 20 120 12 124 30 142 36 128 56Z" fill="#fff" stroke="#dcdce6" stroke-width="2.5"/><rect x="72" y="48" width="56" height="10" rx="4" fill="#fff" stroke="#dcdce6" stroke-width="2.5"/>',
    flower: '<g transform="translate(130 50)"><g fill="#ff8fb3"><circle cx="0" cy="-9" r="7"/><circle cx="9" cy="-3" r="7"/><circle cx="6" cy="8" r="7"/><circle cx="-6" cy="8" r="7"/><circle cx="-9" cy="-3" r="7"/></g><circle r="5" fill="#ffd54f"/></g>'
  };

  var PET_NECK = {
    bow: '<path d="M100 134L80 122V146ZM100 134L120 122V146Z" fill="#e8453c"/><circle cx="100" cy="134" r="5" fill="#b8271f"/>',
    scarf: '<path d="M66 128Q100 148 134 128V142Q100 162 66 142Z" fill="#f5a623"/><path d="M112 148L124 174 108 177 101 152Z" fill="#e8921a"/>',
    bell: '<path d="M68 128Q100 150 132 128" stroke="#e8453c" stroke-width="5" fill="none"/><circle cx="100" cy="146" r="8" fill="#ffc929" stroke="#d99a00" stroke-width="2"/><path d="M96 148h8" stroke="#d99a00" stroke-width="2"/>'
  };

  /** [key, label, map, viewBox] — key null nghĩa là dùng map trong options. */
  var PET_TABS = [
    { k: 'shirt', l: '👕 Áo', vb: '' },
    { k: 'glasses', l: '👓 Kính', vb: '56 70 88 44' },
    { k: 'hat', l: '🎩 Mũ', vb: '56 0 88 66' },
    { k: 'neck', l: '🎀 Cổ', vb: '60 112 80 70' }
  ];

  var PET_DEFAULTS = { animal: 'cat', shirt: null, glasses: null, hat: null, neck: null };

  var PET_OPTS = {
    shirt: { map: PET_SHIRT, ids: Object.keys(PET_SHIRT), colors: true, vb: '' },
    glasses: { map: PET_GLASSES, ids: Object.keys(PET_GLASSES), vb: '56 70 88 44' },
    hat: { map: PET_HAT, ids: Object.keys(PET_HAT), vb: '56 0 88 66' },
    neck: { map: PET_NECK, ids: Object.keys(PET_NECK), vb: '60 112 80 70' }
  };

  /* ---- render thú cưng ---- */

  function petSvg(animalKey, s) {
    var a = ANIMALS[animalKey];
    if (!a) a = ANIMALS[PET_DEFAULTS.animal];
    var arm = a.arm || a.c, foot = a.foot || a.b, ln = a.line || '#0000';
    var shirt = s && s.shirt ? PET_SHIRT[s.shirt] : null;
    var clip = nextId('egPetBody_');

    var o = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + a.n + '">';
    o += '<defs>'
      + '<pattern id="egStPet" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#fff"/><rect width="14" height="7" fill="#5aa9e6"/></pattern>'
      + '<clipPath id="' + clip + '"><ellipse cx="100" cy="156" rx="38" ry="34"/></clipPath>'
      + '</defs>';
    o += '<ellipse cx="100" cy="192" rx="52" ry="7" fill="#0002"/>' + (a.tail || '');
    o += '<g stroke="' + ln + '" stroke-width="2"><ellipse cx="64" cy="162" rx="11" ry="19" fill="' + arm + '" transform="rotate(10 64 162)"/><ellipse cx="136" cy="162" rx="11" ry="19" fill="' + arm + '" transform="rotate(-10 136 162)"/><ellipse cx="82" cy="190" rx="14" ry="8" fill="' + foot + '"/><ellipse cx="118" cy="190" rx="14" ry="8" fill="' + foot + '"/><ellipse cx="100" cy="156" rx="38" ry="34" fill="' + a.c + '"/></g><ellipse cx="100" cy="170" rx="22" ry="17" fill="' + a.b + '"/>';
    if (shirt) o += '<g clip-path="url(#' + clip + ')"><rect x="60" y="132" width="80" height="62" fill="' + shirt + '"/></g><ellipse cx="65" cy="148" rx="13" ry="11" fill="' + shirt + '" transform="rotate(10 65 148)"/><ellipse cx="135" cy="148" rx="13" ry="11" fill="' + shirt + '" transform="rotate(-10 135 148)"/><path d="M84 134Q100 146 116 134" stroke="#0002" stroke-width="3" fill="none"/>';
    o += a.ears || '';
    o += '<circle cx="100" cy="88" r="47" fill="' + a.c + '" stroke="' + ln + '" stroke-width="2"/>' + (a.extra || '');
    if (a.muz) o += '<ellipse cx="100" cy="106" rx="23" ry="16" fill="' + a.b + '"/>';
    o += '<ellipse cx="68" cy="106" rx="8" ry="5" fill="#f9a0b5" opacity=".8"/><ellipse cx="132" cy="106" rx="8" ry="5" fill="#f9a0b5" opacity=".8"/>';
    o += '<g fill="#3b2418"><circle cx="80" cy="92" r="7"/><circle cx="120" cy="92" r="7"/></g><g fill="#fff"><circle cx="78" cy="89.5" r="2.4"/><circle cx="118" cy="89.5" r="2.4"/></g>';
    o += '<ellipse cx="100" cy="100" rx="5.5" ry="4" fill="' + (a.nose || '#f08aa0') + '"/><path d="M92 107Q96 113 100 107Q104 113 108 107" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
    if (a.whisk) o += '<g stroke="#7a6a6a" stroke-width="1.5" stroke-linecap="round" opacity=".7"><path d="M62 104l-18-3M62 109l-18 3M138 104l18-3M138 109l18 3"/></g>';
    if (s) {
      if (s.neck && PET_NECK[s.neck]) o += PET_NECK[s.neck];
      if (s.glasses && PET_GLASSES[s.glasses]) o += PET_GLASSES[s.glasses];
      if (s.hat && PET_HAT[s.hat]) o += PET_HAT[s.hat];
    }
    return o + '</svg>';
  }

  function sanitizePet(src) {
    var o = src && typeof src === 'object' ? src : {};
    var out = { animal: Object.prototype.hasOwnProperty.call(ANIMALS, o.animal) ? o.animal : PET_DEFAULTS.animal };
    ['shirt', 'glasses', 'hat', 'neck'].forEach(function (k) {
      var v = o[k];
      out[k] = (v && Object.prototype.hasOwnProperty.call(PET_OPTS[k].map, v)) ? v : null;
    });
    return out;
  }

/* ===================================================================== *
   *  PHẦN 2 — NHÂN VẬT  (nguồn: body.html ở thư mục gốc, hệ toạ độ 512×700)
   *
   *  Toàn bộ lớp ở đây được vẽ trên đúng hệ 512×700 của `body.html`:
   *    đầu 179–333 × 91–301 · thân 172–340 × 314–501
   *    chân 186–326 × 492–655 · giày 180–332 × 637–674
   *  Không scale từ hệ 200×290 cũ — tỉ lệ đầu/thân khác hẳn nên đồ sẽ méo.
   * ===================================================================== */

  var KID_W = 512, KID_H = 700;

  /* ---- màu da: 4 tone, offset lấy nguyên từ body.html ---- */
  var SKIN_TONES = { s1: '#FFDFC4', s2: '#E8B98D', s3: '#C98C5E', s4: '#8D5A3B' };
  var SKIN_OFFSETS = {
    light: [0, 10, 14], dark: [0, -18, -26], shadow: [-22, -49, -56], ear: [0, -14, -19]
  };

  function hexToRgb(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) h = 'FFDFC4';
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function tone(hex, off) {
    var rgb = hexToRgb(hex);
    var to = function (v, d) { return Math.max(0, Math.min(255, v + d)).toString(16).toUpperCase().padStart(2, '0'); };
    return '#' + to(rgb[0], off[0]) + to(rgb[1], off[1]) + to(rgb[2], off[2]);
  }
  function skinVars(id) {
    var s = SKIN_TONES[id] || SKIN_TONES.s1;
    return {
      base: s,
      light: tone(s, SKIN_OFFSETS.light),
      dark: tone(s, SKIN_OFFSETS.dark),
      shadow: tone(s, SKIN_OFFSETS.shadow),
      ear: tone(s, SKIN_OFFSETS.ear)
    };
  }

  /* ---- màu tóc ---- */
  var HAIR_COLORS = {
    nâu: '#6B4228', đen: '#25252E', vàng: '#F0C14B', nâuSáng: '#8A5A2F', đỏ: '#C2452F', xanh: '#3E7BB6', tím: '#8B5CC7', bạc: '#B9BEC7'
  };

  /* ===================================================================== *
   *  THÂN — `body_01` là thân người lấy nguyên văn từ body.html.
   *  `body_girl_01` cùng khung đầu/tay nhưng có eo gọn + thân + chân trần
   *  (body_01 không vẽ thân/chân nên bé gái bị "thiếu body").
   *  `body_dragon_01` đã khắc sẵn mặt/sừng nên overlays = false.
   * ===================================================================== */
  var BODIES = {
    body_01: { n: 'Bé trai', overlays: true },
    body_girl_01: { n: 'Bé gái', overlays: true },
    body_dragon_01: { n: 'Rồng xanh', overlays: false }
  };

  /* ===================================================================== *
   *  MẶT — bám đúng toạ độ `#face` của body.html:
   *  mắt 224/288 × 210 · lông mày y≈186 · má 205/307 × 244
   *  mũi 256 × 218–241 · miệng y≈258–280
   * ===================================================================== */
  var FACES = {
    face_01: {
      n: 'Cười',
      svg: '<path d="M207 188 Q224 177 240 187" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M272 187 Q288 177 305 188" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<ellipse cx="224" cy="210" rx="13" ry="17" fill="#28203A"/><circle cx="229" cy="204" r="4" fill="#FFFFFF"/>'
        + '<ellipse cx="288" cy="210" rx="13" ry="17" fill="#28203A"/><circle cx="293" cy="204" r="4" fill="#FFFFFF"/>'
        + '<ellipse cx="205" cy="244" rx="21" ry="11" fill="#FF8FA0" opacity="0.42"/>'
        + '<ellipse cx="307" cy="244" rx="21" ry="11" fill="#FF8FA0" opacity="0.42"/>'
        + '<path d="M256 218 Q249 239 257 241" stroke="#D99172" stroke-width="4" stroke-linecap="round"/>'
        + '<path d="M235 258 Q256 278 277 258" stroke="#30213E" stroke-width="6" stroke-linecap="round"/>'
    },
    face_02: {
      n: 'Mắt to',
      svg: '<path d="M202 182 Q224 166 244 180" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M268 180 Q288 166 310 182" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<ellipse cx="224" cy="210" rx="18" ry="22" fill="#28203A"/><circle cx="231" cy="201" r="6" fill="#FFFFFF"/>'
        + '<circle cx="224" cy="218" r="3" fill="#FFFFFF" opacity="0.7"/>'
        + '<ellipse cx="288" cy="210" rx="18" ry="22" fill="#28203A"/><circle cx="295" cy="201" r="6" fill="#FFFFFF"/>'
        + '<circle cx="288" cy="218" r="3" fill="#FFFFFF" opacity="0.7"/>'
        + '<ellipse cx="203" cy="246" rx="24" ry="13" fill="#FF8FA0" opacity="0.5"/>'
        + '<ellipse cx="309" cy="246" rx="24" ry="13" fill="#FF8FA0" opacity="0.5"/>'
        + '<path d="M256 220 Q248 242 257 244" stroke="#D99172" stroke-width="4" stroke-linecap="round"/>'
        + '<path d="M238 260 Q256 276 274 260" stroke="#30213E" stroke-width="6" stroke-linecap="round"/>'
    },
    face_03: {
      n: 'Cười toe',
      svg: '<path d="M206 186 Q224 176 242 186" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M270 186 Q288 176 306 186" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M208 212 Q224 192 240 212" stroke="#28203A" stroke-width="8" stroke-linecap="round" fill="none"/>'
        + '<path d="M272 212 Q288 192 304 212" stroke="#28203A" stroke-width="8" stroke-linecap="round" fill="none"/>'
        + '<ellipse cx="203" cy="242" rx="23" ry="13" fill="#FF8FA0" opacity="0.5"/>'
        + '<ellipse cx="309" cy="242" rx="23" ry="13" fill="#FF8FA0" opacity="0.5"/>'
        + '<path d="M256 220 Q248 240 257 242" stroke="#D99172" stroke-width="4" stroke-linecap="round"/>'
        + '<path d="M228 258 Q256 292 284 258 Z" fill="#4A1D3A"/>'
        + '<path d="M236 262 Q256 280 276 262 Z" fill="#FF7B9C"/>'
    },
    face_04: {
      n: 'Ngơ ngác',
      svg: '<path d="M205 184 Q224 172 244 184" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M270 180 Q288 168 308 180" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<ellipse cx="222" cy="208" rx="11" ry="15" fill="#FFFFFF" stroke="#39271E" stroke-width="4"/>'
        + '<circle cx="223" cy="209" r="6" fill="#28203A"/>'
        + '<ellipse cx="290" cy="212" rx="17" ry="21" fill="#FFFFFF" stroke="#39271E" stroke-width="4"/>'
        + '<circle cx="291" cy="213" r="9" fill="#28203A"/><circle cx="295" cy="208" r="3.5" fill="#FFFFFF"/>'
        + '<path d="M256 222 Q249 241 257 243" stroke="#D99172" stroke-width="4" stroke-linecap="round"/>'
        + '<ellipse cx="256" cy="266" rx="11" ry="13" fill="#4A1D3A"/>'
        + '<ellipse cx="256" cy="262" rx="8" ry="7" fill="#FF7B9C"/>'
    },
    face_05: {
      n: 'Ngoắc',
      svg: '<path d="M204 184 Q224 170 244 184" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M268 184 Q288 170 308 184" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>'
        + '<ellipse cx="224" cy="210" rx="15" ry="19" fill="#28203A"/><circle cx="230" cy="202" r="5.5" fill="#FFFFFF"/>'
        + '<ellipse cx="288" cy="210" rx="15" ry="19" fill="#28203A"/><circle cx="294" cy="202" r="5.5" fill="#FFFFFF"/>'
        + '<ellipse cx="202" cy="246" rx="25" ry="14" fill="#FF8FA0" opacity="0.5"/>'
        + '<ellipse cx="310" cy="246" rx="25" ry="14" fill="#FF8FA0" opacity="0.5"/>'
        + '<path d="M256 220 Q248 241 257 243" stroke="#D99172" stroke-width="4" stroke-linecap="round"/>'
        + '<path d="M224 254 Q256 300 288 254 Z" fill="#4A1D3A"/>'
        + '<path d="M232 260 Q256 284 280 260 Z" fill="#FFFFFF"/>'
    }
  };

  /* ===================================================================== *
   *  TÓC — `back` vẽ sau thân, `front` vẽ sau mặt.
   *  Màu đổi bằng `fill="currentColor"` nên một path cho mọi màu.
   * ===================================================================== */
  var HAIRS = {
    hair_01: {
      n: 'Ngắn gọn',
      back: '<path d="M172 207 C145 180 151 124 184 99 C204 83 230 77 256 78 C291 77 322 91 340 116 C365 151 359 193 337 216 L310 234 L201 230 Z"/>',
      front: '<path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z"/>'
        + '<path d="M198 124 C214 103 238 95 258 95" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.22"/>'
        + '<path d="M282 100 C300 107 314 119 324 137" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" opacity="0.16"/>'
    },
    hair_02: {
      n: 'Dài',
      back: '<path d="M174 206 C142 178 150 118 186 96 C208 81 232 76 256 77 C292 76 324 92 342 118 C368 156 362 202 340 228 C352 300 358 386 352 456 C296 484 216 484 160 456 C154 386 160 300 172 228 Z"/>',
      front: '<path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z"/>'
        + '<path d="M198 124 C214 103 238 95 258 95" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.22"/>'
        + '<path d="M176 250 C168 320 166 392 172 448" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="0.14"/>'
        + '<path d="M336 250 C344 320 346 392 340 448" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="0.14"/>'
    },
    hair_03: {
      n: 'Đuôi ngựa',
      back: '<path d="M172 207 C145 180 151 124 184 99 C204 83 230 77 256 78 C291 77 322 91 340 116 C365 151 359 193 337 216 L310 234 L201 230 Z"/>'
        + '<path d="M334 150 C396 140 428 186 416 250 C408 290 384 310 362 300 C388 258 386 198 336 186 Z"/>'
        + '<ellipse cx="337" cy="169" rx="13" ry="10" transform="rotate(28 337 169)"/>',
      front: '<path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z"/>'
        + '<path d="M198 124 C214 103 238 95 258 95" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.22"/>'
    },
    hair_04: {
      n: 'Búi',
      back: '<path d="M172 207 C145 180 151 124 184 99 C204 83 230 77 256 78 C291 77 322 91 340 116 C365 151 359 193 337 216 L310 234 L201 230 Z"/>'
        + '<circle cx="256" cy="54" r="50"/><circle cx="232" cy="42" r="30" opacity="0.18" fill="#FFFFFF"/>',
      front: '<path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z"/>'
        + '<path d="M198 124 C214 103 238 95 258 95" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.22"/>'
    },
    hair_05: {
      n: 'Xoăn',
      back: '<path d="M160 208 C126 174 136 108 182 84 C206 68 232 64 256 66 C292 64 330 82 346 112 C378 152 366 206 340 232 L310 250 L200 250 Z"/>'
        + '<circle cx="164" cy="150" r="38"/><circle cx="348" cy="150" r="38"/>'
        + '<circle cx="182" cy="96" r="34"/><circle cx="330" cy="96" r="34"/><circle cx="256" cy="72" r="36"/>',
      front: '<path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z"/>'
        + '<circle cx="190" cy="140" r="26" opacity="0.92"/><circle cx="322" cy="140" r="26" opacity="0.92"/>'
        + '<circle cx="256" cy="92" r="30" opacity="0.92"/>'
        + '<path d="M198 124 C214 103 238 95 258 95" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.2"/>'
    },
    hair_06: {
      n: 'Hai bên',
      back: '<path d="M172 207 C145 180 151 124 184 99 C204 83 230 77 256 78 C291 77 322 91 340 116 C365 151 359 193 337 216 L310 234 L201 230 Z"/>'
        + '<ellipse cx="152" cy="300" rx="36" ry="80" transform="rotate(9 152 300)"/>'
        + '<ellipse cx="360" cy="300" rx="36" ry="80" transform="rotate(-9 360 300)"/>'
        + '<ellipse cx="176" cy="230" rx="14" ry="11" transform="rotate(-18 176 230)"/>'
        + '<ellipse cx="336" cy="230" rx="14" ry="11" transform="rotate(18 336 230)"/>',
      front: '<path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z"/>'
        + '<path d="M198 124 C214 103 238 95 258 95" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity="0.22"/>'
    }
  };

  /* ===================================================================== *
   *  ÁO — vẽ đè lên thân của body.html (172–340 × 314–501)
   * ===================================================================== */
  var TORSO = 'M209 326 C221 318 237 314 256 314 C275 314 291 318 303 326 C327 331 342 349 340 372 L334 470 C333 489 320 501 301 501 L211 501 C192 501 179 489 178 470 L172 372 C170 349 185 331 209 326 Z';

  function shirtSvg(color) {
    return '<path d="' + TORSO + '" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="M225 324 C232 344 280 344 287 324" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="7" stroke-linecap="round" fill="none"/>'
      + '<path d="M201 361 C195 389 196 438 201 465" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.35" fill="none"/>';
  }

  var SHIRT_COLORS = {
    white: '#F4F6FA', red: '#E8453C', blue: '#3D7BD1', yellow: '#F5C63C',
    green: '#4CAF50', pink: '#F07CA8', purple: '#8B5CC7', orange: '#F08A3C'
  };

  /* ===================================================================== *
   *  VÁY — phủ thân + quần
   * ===================================================================== */
  var DRESS_BODY = 'M203 322 C219 312 236 308 256 308 C276 308 293 312 309 322 C334 328 350 348 348 372 L342 452 C352 500 358 552 360 596 C304 622 208 622 152 596 C154 552 160 500 170 452 L164 372 C162 348 178 328 203 322 Z';

  function dressSvg(color) {
    return '<path d="' + DRESS_BODY + '" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="M228 318 C236 342 276 342 284 318" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="7" stroke-linecap="round" fill="none"/>'
      + '<path d="M172 452 L340 452" stroke="#000000" stroke-opacity=".12" stroke-width="6"/>'
      + '<path d="M188 500 Q256 528 324 500" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="9" fill="none" stroke-linecap="round"/>';
  }

  var DRESS_COLORS = {
    pink: '#F07CA8', red: '#E8453C', yellow: '#F5C63C', blue: '#3D7BD1', purple: '#8B5CC7', mint: '#4FC3A1'
  };

  /* ===================================================================== *
   *  QUẦN — 186–326 × 492–655
   * ===================================================================== */
  function pantsSvg(id) {
    if (id === 'skirt_pink') {
      return '<path d="M192 492 L320 492 L342 616 L170 616 Z" fill="#F07CA8" filter="url(#kidShadow)"/>'
        + '<path d="M196 512 L316 512" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="7" fill="none"/>';
    }
    if (id === 'skirt_mint') {
      return '<path d="M192 492 L320 492 L342 616 L170 616 Z" fill="#4FC3A1" filter="url(#kidShadow)"/>'
        + '<path d="M196 512 L316 512" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="7" fill="none"/>';
    }
    var c = id === 'jeans' ? '#3D63A8' : id === 'black' ? '#2E2E38' : id === 'khaki' ? '#D8B87A' : '#E8453C';
    if (id === 'khaki' || id === 'redshort') {
      return '<path d="M192 492 L256 492 L256 604 L204 604 C192 604 186 594 188 580 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
        + '<path d="M256 492 L320 492 L324 580 C326 594 320 604 308 604 L256 604 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
        + '<path d="M256 500 L256 600" stroke="#000000" stroke-opacity=".25" stroke-width="5"/>';
    }
    return '<path d="M194 492 L256 492 L256 632 C256 647 246 655 230 655 L203 655 C190 655 184 645 186 631 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
      + '<path d="M256 492 L318 492 L326 631 C328 645 320 655 307 655 L280 655 C264 655 256 647 256 632 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
      + '<path d="M256 500 L256 633" stroke="#000000" stroke-opacity=".22" stroke-width="5"/>'
      + '<path d="M211 510 L208 620" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="8" stroke-linecap="round" opacity="0.5"/>';
  }
  var PANT_OPTIONS = {
    jeans: { n: 'Quần jean' }, black: { n: 'Quần đen' }, khaki: { n: 'Quần kaki' },
    redshort: { n: 'Quần đỏ' }, skirt_pink: { n: 'Váy hồng' }, skirt_mint: { n: 'Váy mint' }
  };

  /* ===================================================================== *
   *  GIÀY — 180–332 × 637–674
   * ===================================================================== */
  function shoesSvg(color) {
    return '<path d="M188 642 C202 637 224 637 243 642 C254 645 260 654 255 663 C251 671 236 674 213 674 C193 674 180 669 180 660 C180 652 183 646 188 642 Z" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="M269 642 C288 637 310 637 324 642 C329 646 332 652 332 660 C332 669 319 674 299 674 C276 674 261 671 257 663 C252 654 258 645 269 642 Z" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="M190 664 Q220 674 251 664" stroke="#00000022" stroke-width="5" stroke-linecap="round" fill="none"/>'
      + '<path d="M261 664 Q292 674 322 664" stroke="#00000022" stroke-width="5" stroke-linecap="round" fill="none"/>';
  }
  var SHOE_OPTIONS = { white: { n: 'Trắng', c: '#FFFFFF' }, red: { n: 'Đỏ', c: '#E8453C' }, blue: { n: 'Xanh', c: '#3D7BD1' }, black: { n: 'Đen', c: '#2E2E38' }, pink: { n: 'Hồng', c: '#F07CA8' } };

  /* ===================================================================== *
   *  MŨ — ngồi trên đỉnh đầu, quanh 150–362 × 60–190
   * ===================================================================== */
  var HATS = {
    hat_01: {
      n: 'Mũ lưỡi trai',
      svg: '<path d="M158 176 C154 108 196 62 256 62 C316 62 358 108 354 176 Z" fill="#3D7BD1"/>'
        + '<path d="M154 172 C206 196 306 196 358 172 L350 200 C300 220 212 220 162 200 Z" fill="#2A5FA8"/>'
        + '<circle cx="256" cy="66" r="8" fill="#2A5FA8"/>'
        + '<path d="M188 116 C206 92 232 84 252 84" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="9" fill="none" stroke-linecap="round"/>'
    },
    hat_02: {
      n: 'Mũ len',
      svg: '<path d="M162 178 C154 100 198 56 256 56 C314 56 358 100 350 178 Z" fill="#E8453C"/>'
        + '<rect x="152" y="158" width="208" height="34" rx="17" fill="#B83029"/>'
        + '<circle cx="256" cy="52" r="26" fill="#FFFFFF"/>'
        + '<path d="M240 42 Q256 34 272 42" stroke="#E2E6EE" stroke-width="6" fill="none" stroke-linecap="round"/>'
    },
    hat_03: {
      n: 'Mũ sinh nhật',
      svg: '<path d="M170 180 L256 46 L342 180 Z" fill="#F07CA8"/>'
        + '<g fill="#FFFFFF"><circle cx="238" cy="118" r="8"/><circle cx="272" cy="98" r="7"/><circle cx="266" cy="146" r="7"/></g>'
        + '<circle cx="256" cy="40" r="14" fill="#F5C63C"/>'
        + '<path d="M256 14 L256 26" stroke="#E8453C" stroke-width="7" stroke-linecap="round"/>'
    },
    hat_04: {
      n: 'Vương miện',
      svg: '<path d="M164 184 L172 90 L212 136 L256 66 L300 136 L340 90 L348 184 Z" fill="#F5C63C" stroke="#C99A10" stroke-width="6" stroke-linejoin="round"/>'
        + '<circle cx="256" cy="140" r="12" fill="#E8453C"/><circle cx="206" cy="152" r="9" fill="#3D7BD1"/><circle cx="306" cy="152" r="9" fill="#4FC3A1"/>'
        + '<rect x="160" y="180" width="192" height="22" rx="11" fill="#E0AE14"/>'
    },
    hat_05: {
      n: 'Nón lá',
      svg: '<ellipse cx="256" cy="180" rx="152" ry="26" fill="#EFCF82" stroke="#C9A24A" stroke-width="6"/>'
        + '<path d="M182 176 C186 106 214 70 256 70 C298 70 326 106 330 176 Z" fill="#EFCF82" stroke="#C9A24A" stroke-width="6"/>'
        + '<path d="M186 150 L326 150" stroke="#E8453C" stroke-width="18"/>'
        + '<path d="M200 116 C214 94 234 84 252 84" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="8" fill="none" stroke-linecap="round"/>'
    },
    hat_06: {
      n: 'Hoa khoang trang',
      svg: '<g transform="translate(352 118)"><g fill="#F07CA8"><circle cy="-26" r="20"/><circle cx="24" cy="-8" r="20"/>'
        + '<circle cx="15" cy="23" r="20"/><circle cx="-15" cy="23" r="20"/><circle cx="-24" cy="-8" r="20"/></g>'
        + '<circle r="14" fill="#F5C63C"/></g>'
        + '<path d="M348 128 C330 106 306 96 282 96" stroke="#4FC3A1" stroke-width="9" fill="none" stroke-linecap="round"/>'
        + '<path d="M256 150 C276 152 296 166 308 186" stroke="#4FC3A1" stroke-width="9" fill="none" stroke-linecap="round"/>'
    }
  };

  /* ===================================================================== *
   *  KÍNH — quanh mắt 224/288 × 210
   * ===================================================================== */
  var GLASSES = {
    glasses_01: {
      n: 'Tròn',
      svg: '<circle cx="224" cy="212" r="38" fill="#FFFFFF" fill-opacity=".22" stroke="#2E2E38" stroke-width="9"/>'
        + '<circle cx="288" cy="212" r="38" fill="#FFFFFF" fill-opacity=".22" stroke="#2E2E38" stroke-width="9"/>'
        + '<path d="M262 212 L250 212" stroke="#2E2E38" stroke-width="9" stroke-linecap="round"/>'
    },
    glasses_02: {
      n: 'Vuông',
      svg: '<rect x="184" y="180" width="82" height="66" rx="18" fill="#FFFFFF" fill-opacity=".22" stroke="#2A5FA8" stroke-width="9"/>'
        + '<rect x="246" y="180" width="82" height="66" rx="18" fill="#FFFFFF" fill-opacity=".22" stroke="#2A5FA8" stroke-width="9"/>'
        + '<path d="M266 212 L246 212" stroke="#2A5FA8" stroke-width="9" stroke-linecap="round"/>'
    },
    glasses_03: {
      n: 'Kính râm',
      svg: '<rect x="182" y="184" width="84" height="56" rx="24" fill="#26262E"/>'
        + '<rect x="246" y="184" width="84" height="56" rx="24" fill="#26262E"/>'
        + '<path d="M266 212 L246 212" stroke="#26262E" stroke-width="9" stroke-linecap="round"/>'
        + '<path d="M196 196 L232 196" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/>'
    },
    glasses_04: {
      n: 'Tim',
      svg: '<path d="M224 254 C176 214 188 174 224 192 C260 174 272 214 224 254 Z" fill="#FF6E9C" stroke="#C2185B" stroke-width="7"/>'
        + '<path d="M288 254 C240 214 252 174 288 192 C324 174 336 214 288 254 Z" fill="#FF6E9C" stroke="#C2185B" stroke-width="7"/>'
        + '<path d="M252 206 L276 206" stroke="#C2185B" stroke-width="7" stroke-linecap="round"/>'
    }
  };

  /* ===================================================================== *
   *  PHỤ KIỆN — `b` vẽ sau thân (cờ đuôi, túi), `f` vẽ đè lên trên
   * ===================================================================== */
  var ACCS = {
    acc_01: {
      n: 'Nơ',
      f: '<g transform="translate(256 352)"><path d="M0 -6 L-56 -34 L-56 30 Z M0 -6 L56 -34 L56 30 Z" fill="#E8453C"/>'
        + '<circle r="14" fill="#B83029"/></g>'
    },
    acc_02: {
      n: 'Khăn quàng',
      f: '<path d="M192 336 C230 372 282 372 320 336 L320 368 C282 402 230 402 192 368 Z" fill="#F5A623"/>'
        + '<path d="M296 396 L318 470 L282 476 L266 408 Z" fill="#E8921A"/>'
    },
    acc_03: {
      n: 'Dây chuyền',
      f: '<path d="M212 338 C230 388 282 388 300 338" stroke="#D99A00" stroke-width="8" fill="none" stroke-linecap="round"/>'
        + '<path d="M256 404 C236 380 242 358 256 372 C270 358 276 380 256 404 Z" fill="#FF6E9C"/>'
    },
    acc_04: {
      n: 'Tai nghe',
      f: '<path d="M180 210 C168 108 218 60 256 60 C294 60 344 108 332 210" stroke="#2E2E38" stroke-width="14" fill="none" stroke-linecap="round"/>'
        + '<rect x="158" y="188" width="42" height="72" rx="21" fill="#E8453C"/>'
        + '<rect x="312" y="188" width="42" height="72" rx="21" fill="#E8453C"/>'
    },
    acc_05: {
      n: 'Túi',
      b: '<rect x="336" y="392" width="140" height="150" rx="30" fill="#F08A3C" filter="url(#kidShadow)"/>'
        + '<path d="M376 392 L376 542 M436 392 L436 542" stroke="#C2651F" stroke-width="12"/>'
        + '<rect x="352" y="440" width="108" height="52" rx="16" fill="#C2651F"/>',
      f: ''
    },
    acc_06: {
      n: 'Áo choàng',
      b: '<path d="M192 336 L320 336 L392 626 L120 626 Z" fill="#B83029" filter="url(#kidShadow)"/>'
        + '<path d="M198 348 L314 348" stroke="#E8453C" stroke-width="10"/>',
      f: '<circle cx="256" cy="340" r="16" fill="#F5C63C" stroke="#C99A10" stroke-width="6"/>'
    }
  };

  /* ===================================================================== *
   *  THÂN NGƯỜI — chép nguyên văn `body.html`, tách phần có thể thay thế
   * ===================================================================== */
  function humanBody(sv) {
    return '<ellipse cx="256" cy="665" rx="105" ry="22" fill="#000000" opacity="0.10" filter="url(#kidBlur)"/>'
      /* tay */
      + '<path d="M190 354 C166 354 157 371 158 395 L162 465 C163 480 175 490 188 486 C201 482 205 470 204 456 L201 386 Z" fill="url(#kidSkin)"/>'
      + '<path d="M322 354 C346 354 355 371 354 395 L350 465 C349 480 337 490 324 486 C311 482 307 470 308 456 L311 386 Z" fill="url(#kidSkin)"/>'
      /* cổ + đầu */
      + '<path d="M226 292 L226 329 C226 345 286 345 286 329 L286 292 Z" fill="url(#kidSkin)"/>'
      + '<path d="M226 293 C238 307 272 309 286 293 L286 317 C268 326 242 326 226 316 Z" fill="' + sv.shadow + '" opacity="0.45"/>'
      + '<g filter="url(#kidShadow)"><path d="M179 164 C179 115 213 91 256 91 C299 91 333 115 333 164 L333 216 C333 263 299 301 256 301 C213 301 179 263 179 216 Z" fill="url(#kidSkin)"/>'
      + '<ellipse cx="180" cy="213" rx="12" ry="23" fill="' + sv.ear + '"/>'
      + '<ellipse cx="332" cy="213" rx="12" ry="23" fill="' + sv.ear + '"/>'
      + '<ellipse cx="224" cy="143" rx="40" ry="25" fill="#FFFFFF" opacity="0.16"/></g>';
  }

  /* ---- hàng mi — chỉ vẽ cho thân bé gái ---- */
  function lashes() {
    return '<path d="M237 199 L249 193" stroke="#39271E" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M245 196 L253 190" stroke="#39271E" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M301 199 L289 193" stroke="#39271E" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M293 196 L285 190" stroke="#39271E" stroke-width="4" stroke-linecap="round"/>';
  }

  /* ===================================================================== *
   *  THÂN BÉ GÁI — cùng khung đầu/tay/cổ với `humanBody` (nên mũ, kính, tóc
   *  và mặt vẫn khớp tọa độ), khác ở chỗ có thân eo gọn + hai chân trần,
   *  phần mà `body_01` không bao giờ vẽ.
   * ===================================================================== */
  function femaleBody(sv) {
    return humanBody(sv)
      /* thân: eo gọn, hông nở */
      + '<path d="M209 326 C221 318 237 314 256 314 C275 314 291 318 303 326'
      + ' C321 343 328 361 322 381 C315 404 310 419 313 436 C323 460 331 480 331 497'
      + ' C331 505 325 509 316 509 L196 509 C187 509 181 505 181 497'
      + ' C181 480 189 460 199 436 C202 419 197 404 190 381'
      + ' C184 361 191 343 209 326 Z" fill="url(#kidSkin)"/>'
      /* chân trần — váy / quần / giày đè lên theo thứ tự render */
      + '<path d="M216 505 L248 505 L246 632 C246 646 238 654 228 654 C216 654 210 645 212 632 Z" fill="url(#kidSkin)"/>'
      + '<path d="M264 505 L296 505 L300 632 C302 645 296 654 284 654 C273 654 266 646 266 632 Z" fill="url(#kidSkin)"/>'
      + lashes();
  }

  /* ---- quần + giày mặc định (dùng khi người chơi bỏ chọn) ---- */
  var DEFAULT_PANTS = pantsSvg('jeans');
  var DEFAULT_SHOES = shoesSvg('#FFFFFF');

  function kidDefs(sv, hairColor, clothColor) {
    return '<defs>'
      + '<linearGradient id="kidSkin" x1="180" y1="150" x2="330" y2="420"><stop offset="0%" stop-color="' + sv.light + '"/><stop offset="100%" stop-color="' + sv.dark + '"/></linearGradient>'
      + '<linearGradient id="kidHair" x1="180" y1="90" x2="330" y2="210"><stop offset="0%" stop-color="' + hairColor + '" stop-opacity="0.82"/><stop offset="100%" stop-color="' + hairColor + '"/></linearGradient>'
      + '<filter id="kidBlur" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="7"/></filter>'
      + '<filter id="kidShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.12"/></filter>'
      + '</defs>';
  }

  /* ===================================================================== *
   *  RENDER
   * ===================================================================== */
  function renderKid(raw) {
    var s = sanitizeKid(raw);
    if (s.body === 'body_dragon_01') {
      return '<svg viewBox="0 0 ' + KID_W + ' ' + KID_H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rồng xanh" color="'
        + (HAIR_COLORS[s.hairColor] || HAIR_COLORS['nâu']) + '">'
        + (root.EG_DRAGON_SVG || '') + '</svg>';
    }

    var sv = skinVars(s.skin);
    var hairColor = HAIR_COLORS[s.hairColor] || HAIR_COLORS['nâu'];
    var hair = HAIRS[s.hair] || HAIRS.hair_01;
    var acc = ACCS[s.acc] || null;
    var bodyName = (BODIES[s.body] && BODIES[s.body].n) || 'Nhân vật Bé';
    var o = '<svg viewBox="0 0 ' + KID_W + ' ' + KID_H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'
      + bodyName + '" color="' + hairColor + '">';
    o += kidDefs(sv, hairColor);

    /* 1. phụ kiện nằm sau thân (áo choàng, túi) */
    if (acc && acc.b) o += acc.b;
    /* 2. tóc sau */
    o += '<g fill="url(#kidHair)">' + hair.back + '</g>';
    /* 3. thân: tay + cổ + đầu (+ thân & chân trần cho bé gái) */
    o += s.body === 'body_girl_01' ? femaleBody(sv) : humanBody(sv);
    /* 4. mặt */
    o += FACES[s.face] ? FACES[s.face].svg : FACES.face_01.svg;
    /* 5. tóc trước */
    o += '<g fill="url(#kidHair)">' + hair.front + '</g>';
    /* 6. áo hoặc váy phủ thân */
    if (s.dress) o += dressSvg(DRESS_COLORS[s.dress]);
    else if (s.shirt) o += shirtSvg(SHIRT_COLORS[s.shirt]);
    /* 7. quần — bé gái có chân trần nên bỏ trống được, thân kia bắt buộc có quần */
    if (!s.dress) {
      if (s.pants) o += pantsSvg(s.pants);
      else if (s.body !== 'body_girl_01') o += DEFAULT_PANTS;
    }
    /* 8. giày */
    if (s.shoes) o += shoesSvg(SHOE_OPTIONS[s.shoes].c);
    else if (s.body !== 'body_girl_01') o += DEFAULT_SHOES;
    /* 9. phụ kiện đè lên trên */
    if (acc && acc.f) o += acc.f;
    /* 10. kính + mũ */
    o += GLASSES[s.glasses] ? GLASSES[s.glasses].svg : '';
    o += HATS[s.hat] ? HATS[s.hat].svg : '';

    return o + '</svg>';
  }

  /* ===================================================================== *
   *  STATE + TAB
   * ===================================================================== */
  var KID_DEFAULTS = {
    body: 'body_01', skin: 's1', hairColor: 'nâu', face: 'face_01', hair: 'hair_01',
    shirt: 'white', dress: null, pants: 'jeans', shoes: 'white',
    glasses: null, hat: null, acc: null
  };

  /* Mã body của hệ avatar CŨ (src/data/avatarBodies.js + /api/avatar/categories)
   * khác tên với hệ mới — nếu hồ sơ còn mang mã cũ thì quy về mã mới, đừng để
   * `sanitizeKid` rơi về mặc định là bé trai (bé gái thành bé trai). */
  var BODY_ALIASES = {
    body_boy_01: 'body_01',
    body_custom_01: 'body_dragon_01'
  };

  /* "Diện" của từng thân: chọn thân là ra hình con trai/con gái rõ ràng, chứ
   * không chỉ đổi mỗi phần da thịt. Modal tuỳ chỉnh + tab Thân + preset admin
   * cùng dùng bảng này (một nguồn duy nhất). */
  var BODY_LOOKS = {
    body_01: { hair: 'hair_01', shirt: 'white', dress: null, pants: 'jeans', shoes: 'white' },
    body_girl_01: { hair: 'hair_02', shirt: null, dress: 'pink', pants: null, shoes: 'pink' },
    body_dragon_01: {}
  };

  /** Gán thân + "diện" của thân đó, giữ da/màu tóc/kính/mũ/phụ kiện đang chọn. */
  function applyBody(st, id) {
    var look = BODY_LOOKS[id] || {};
    return sanitizeKid(Object.assign({}, st, look, { body: id }));
  }

  var KID_FIELD_IDS = {
    body: Object.keys(BODIES),
    skin: Object.keys(SKIN_TONES),
    hairColor: Object.keys(HAIR_COLORS),
    face: Object.keys(FACES),
    hair: Object.keys(HAIRS),
    shirt: Object.keys(SHIRT_COLORS).concat([null]),
    dress: Object.keys(DRESS_COLORS).concat([null]),
    pants: Object.keys(PANT_OPTIONS).concat([null]),
    shoes: Object.keys(SHOE_OPTIONS).concat([null]),
    glasses: Object.keys(GLASSES).concat([null]),
    hat: Object.keys(HATS).concat([null]),
    acc: Object.keys(ACCS).concat([null])
  };

  /** Kiểu hiển thị của từng tab: dot = màu, svg = vẽ preview.
   *  `nullable: true` → hiện nút 🚫 và cho phép bỏ lớp đó. */
  function idsOf(k) {
    return KID_FIELD_IDS[k].filter(function (id) { return id !== null; });
  }

  function tabCfg(k, s) {
      switch (k) {
      case 'body': return {
        kind: 'svg',
        vb: '110 30 292 650',
        ids: idsOf('body'),
        nullable: false,
        /* Ô Thân = chính nhân vật với thân đang xem, không phải một path rời.
         * Ghép thêm "diện" của thân đó (BODY_LOOKS) để ô Bé gái ra tóc dài +
         * váy hồng, nhìn là biết con gái — nếu chỉ đổi mỗi body thì thumbnail
         * vẫn mang tóc ngắn + áo quần con trai. */
        pv: function (id) {
          var svg = renderKid(Object.assign({}, s, BODY_LOOKS[id] || {}, { body: id }));
          return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
        }
      };
      case 'skin': return { kind: 'dot', ids: idsOf('skin'), dot: function (id) { return SKIN_TONES[id]; } };
      case 'hairColor': return { kind: 'dot', ids: idsOf('hairColor'), dot: function (id) { return HAIR_COLORS[id]; } };
      case 'face': return { kind: 'svg', vb: '166 150 180 150', ids: idsOf('face'), nullable: false, pv: function (id) { return FACES[id] ? FACES[id].svg : ''; } };
      case 'hair': return { kind: 'svg', vb: '110 34 292 460', ids: idsOf('hair'), nullable: false, pv: function (id) { return hairPreview(id, s); } };
      case 'shirt': return { kind: 'dot', ids: idsOf('shirt'), nullable: true, dot: function (id) { return SHIRT_COLORS[id]; } };
      case 'dress': return { kind: 'dot', ids: idsOf('dress'), nullable: true, dot: function (id) { return DRESS_COLORS[id]; } };
      case 'pants': return { kind: 'svg', vb: '150 480 212 150', ids: idsOf('pants'), nullable: true, pv: function (id) { return pantsSvg(id); } };
      case 'shoes': return { kind: 'dot', ids: idsOf('shoes'), nullable: true, dot: function (id) { return SHOE_OPTIONS[id].c; } };
      case 'glasses': return { kind: 'svg', vb: '150 170 212 90', ids: idsOf('glasses'), nullable: true, pv: function (id) { return GLASSES[id] ? GLASSES[id].svg : ''; } };
      case 'hat': return { kind: 'svg', vb: '100 30 312 210', ids: idsOf('hat'), nullable: true, pv: function (id) { return HATS[id] ? HATS[id].svg : ''; } };
      case 'acc': return { kind: 'svg', vb: '100 300 312 340', ids: idsOf('acc'), nullable: true, pv: function (id) { return accPreview(id); } };
      default: return { kind: 'list', ids: [], nullable: false };
    }
  }

  function hairPreview(id, s) {
    var h = HAIRS[id];
    if (!h) return '';
    return '<g fill="url(#kidHair)" color="'
      + (HAIR_COLORS[(s && s.hairColor) || 'nâu'] || '#6B4228') + '">'
      + '<defs><linearGradient id="kidHairPV" x1="180" y1="90" x2="330" y2="210">'
      + '<stop offset="0%" stop-color="#6B4228" stop-opacity="0.82"/><stop offset="100%" stop-color="#6B4228"/></linearGradient></defs>'
      + h.back + h.front + '</g>';
  }

  function accPreview(id) {
    var a = ACCS[id];
    if (!a) return '';
    return (a.b || '') + (a.f || '');
  }

  var KID_TABS = [
    { k: 'body', l: '🧍 Thân' },
    { k: 'face', l: '😀 Mặt' },
    { k: 'hair', l: '💇 Tóc' },
    { k: 'hairColor', l: '🎨 Màu tóc' },
    { k: 'skin', l: '🧑 Da' },
    { k: 'shirt', l: '👕 Áo' },
    { k: 'dress', l: '👗 Váy' },
    { k: 'pants', l: '👖 Quần' },
    { k: 'shoes', l: '👟 Giày' },
    { k: 'glasses', l: '👓 Kính' },
    { k: 'hat', l: '🎩 Mũ' },
    { k: 'acc', l: '🎒 Phụ kiện' }
  ];

  /** Chỉ nhân vật người mới có mặt/tóc/da; váy thì ẩn quần. */
  function kidTabs(st) {
    var s = sanitizeKid(st);
    var human = BODIES[s.body].overlays !== false;
    return KID_TABS.filter(function (t) {
      if (!human && t.k !== 'body') return false;
      if (t.k === 'pants' && s.dress) return false;
      return true;
    });
  }

  /* `KID_FIELD_IDS` đã chứa null cho các lớp tuỳ chọn → bé chọn 🚫 là bỏ thật.
   * Riêng `shirt`/`pants`/`shoes` của `body_01` bị ép lại bên dưới vì thân đó
   * không vẽ eo/chân, bỏ trống là nhân vật mất nửa người. */
  function sanitizeKid(src) {
    var o = src && typeof src === 'object' ? src : {};
    if (BODY_ALIASES[o.body]) o = Object.assign({}, o, { body: BODY_ALIASES[o.body] });
    var out = {};
    Object.keys(KID_FIELD_IDS).forEach(function (k) {
      var v = o[k];
      var ok = KID_FIELD_IDS[k].indexOf(v) >= 0 && v !== undefined;
      out[k] = ok ? v : KID_DEFAULTS[k];
    });
    /* không có body người thì không có lớp mặt/tóc/da */
    if (BODIES[out.body].overlays === false) {
      out.skin = KID_DEFAULTS.skin;
      out.face = KID_DEFAULTS.face;
      out.hair = KID_DEFAULTS.hair;
    }
    /* mặc váy thì không có quần — giữ state sạch để profile và server khớp */
    if (out.dress) out.pants = null;
    /* body_01 không vẽ thân/chân bằng da → bắt buộc có giày, và áo/quần khi
     * không mặc váy, nếu không nhân vật sẽ khuyết nửa người. */
    if (out.body !== 'body_girl_01') {
      if (!SHOE_OPTIONS[out.shoes]) out.shoes = KID_DEFAULTS.shoes;
      if (!out.dress) {
        if (!SHIRT_COLORS[out.shirt]) out.shirt = KID_DEFAULTS.shirt;
        if (!PANT_OPTIONS[out.pants]) out.pants = KID_DEFAULTS.pants;
      }
    }
    return out;
  }

  root.EG_DRESSUP = {
    version: 3,
    renderPet: petSvg,
    renderKid: renderKid,
    sanitizePet: sanitizePet,
    sanitizeKid: sanitizeKid,
    kidTabs: kidTabs,
    kidTabCfg: tabCfg,
    applyBody: applyBody,

    pet: {
      animals: ANIMALS, tabs: PET_TABS, opts: PET_OPTS, defaults: PET_DEFAULTS,
      preview: function (state) { return petSvg(state.animal, null); }
    },

    kid: {
      size: { w: KID_W, h: KID_H },
      defaults: KID_DEFAULTS,
      tabCfg: tabCfg,
      bodies: BODIES, faces: FACES, hairs: HAIRS, hats: HATS,
      glasses: GLASSES, accs: ACCS, pants: PANT_OPTIONS, shoes: SHOE_OPTIONS,
      shirtColors: SHIRT_COLORS, dressColors: DRESS_COLORS,
      hairColors: HAIR_COLORS, skinTones: SKIN_TONES,
      /** "diện" chuẩn của từng thân — preset admin và modal cùng dùng bảng này */
      looks: BODY_LOOKS,
      /** mã body hệ cũ → mã hệ mới (body_boy_01 → body_01 …) */
      bodyAliases: BODY_ALIASES
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);