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
   *  `body_rider_01` / `body_superman_01` mặc bộ đồ anh hùng trên chính khung
   *  đó (HERO_SUITS) nên áo, quần, giày, mũ, kính... vẫn gắn đúng chỗ.
   *  `body_dragon_01` đã khắc sẵn mặt/sừng nên overlays = false.
   *
   *  `slug` = mã preset dùng ở modal + trang admin (kidPreset('rider')),
   *  `hint` = ghi chú cho trang "Thân Avatar" — thêm thân là admin tự có thẻ,
   *  không phải sửa giao diện.
   *
   *  `slots` = NHÓM LINH KIỆN thân đó nhận. Không phải body nào cũng mặc được
   *  mọi thứ: rồng/kaiju không có tóc để gắn, ma bay không có chân đi quần.
   *  Mọi thứ (tab, sanitize, render, trang admin) đều suy ra từ bảng này nên
   *  thêm thân chỉ cần khai báo slots, không phải sửa giao diện. Server giữ
   *  bản sao trong `server/src/lib/outfitCatalog.js` (AVATAR_BODY_SLOTS) và
   *  `npm run avatars:test` so hai bên mỗi lần chạy.
   * ===================================================================== */
  var HUMAN_SLOTS = ['skin', 'face', 'hair', 'hairColor',
    'shirt', 'dress', 'pants', 'shoes', 'glasses', 'hat', 'acc'];
  /* Da + mặt + tóc + kính + mũ + phụ kiện, KHÔNG áo/váy/quần/giày vì thân đã
   * tự vẽ bộ đồ (ngôi sao nhạc pop). */
  var HEAD_SLOTS = ['skin', 'face', 'hair', 'hairColor', 'glasses', 'hat', 'acc'];
  /* Chỉ giữ khung đầu để đội mũ + đeo kính: không tóc, không mặc gì (kaiju). */
  var CRITTER_SLOTS = ['glasses', 'hat', 'acc'];
  /* Robot tự vẽ mặt LED (mắt 224/288 × 210) nên KHÔNG nhận lớp Mặt người;
   * vẫn đeo kính, đội mũ và mang phụ kiện. */
  var ROBOT_SLOTS = ['glasses', 'hat', 'acc'];
  /* Bộ xương tự vẽ hốc mắt phát sáng nên KHÔNG nhận lớp Mặt; vẫn đội tóc,
   * đeo kính, mặc đồ được — áo/quần vẽ đè lên khung xương như người thường. */
  var SKELETON_SLOTS = ['hair', 'hairColor', 'glasses', 'hat', 'acc',
    'shirt', 'dress', 'pants', 'shoes'];

  var BODIES = {
    body_01: {
      n: 'Bé trai', overlays: true, slug: 'boy', slots: HUMAN_SLOTS,
      hint: 'Thân người + tóc ngắn, áo trắng, quần jean, giày trắng. Bắt buộc có áo/quần/giày vì thân không vẽ chân.'
    },
    body_girl_01: {
      n: 'Bé gái', overlays: true, slug: 'girl', slots: HUMAN_SLOTS,
      hint: 'Eo gọn + chân trần, tóc dài, váy hồng, giày hồng. Bỏ được áo/quần/giày.'
    },
    body_rider_01: {
      n: 'Kamen Rider', overlays: true, slug: 'rider', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Bộ đồ xanh + găng/bốt đen, thắt lưng Typhoon, mũ mắt compound và khăn bạc bay sau lưng. Mũ + áo quần thường mặc được vì bộ đồ vẽ đè lên sau giày.'
    },
    body_superman_01: {
      n: 'Superman', overlays: true, slug: 'superman', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Bộ đồ xanh + quần chip đỏ, bốt đỏ, phù hiệu S và áo choàng đỏ sau lưng. Áo choàng vẽ trước thân, phù hiệu vẽ sau đồ nên không bị che.'
    },
    body_kaiju_01: {
      n: 'Kaiju', overlays: false, slug: 'kaiju', selfClothed: true, slots: CRITTER_SLOTS,
      hint: 'Quái vật xanh có móng, vảy bụng và gai lưng. Mắt tự vẽ đúng chỗ 224/288 nên ĐEO KÍNH + ĐỘI MŨ + phụ kiện được, còn tóc/áo/quần thì không.'
    },
    body_ghost_01: {
      n: 'Bóng ma', overlays: false, slug: 'ghost', selfClothed: true, slots: ['hat', 'acc'],
      hint: 'Tấm vải trắng bay, không có chân nên không mặc quần/giày; không mặt mũi người nên không chọn mắt/tóc. Chỉ đội được mũ và mang phụ kiện.'
    },
    body_popstar_01: {
      n: 'Ngôi sao nhạc pop', overlays: true, slug: 'popstar', selfClothed: true, slots: HEAD_SLOTS,
      hint: 'Nhân vật sân khấu tự vẽ: áo khoác đỏ, quần tối màu, giày trắng tất cao, găng một tay. Mặc định tóc đen, chọn được mặt/tóc/da/mũ/kính/phụ kiện (đồ diễn đã là một phần của body).'
    },
    body_dragon_01: {
      n: 'Rồng xanh', overlays: false, slug: 'dragon', slots: [],
      hint: 'Body khắc sẵn mặt và chi tiết, không nhận phụ kiện.'
    },

    /* ---- 20 thân chủ đề: đặc biệt / nghề nghiệp / cổ tích / lễ hội ----
     *  Thêm vào CUỐI bảng để thứ tự tab Thân và danh sách admin của các thân
     *  cũ không đổi. Mọi thân dưới đây vẽ trên cùng khung 512×700 của
     *  `body.html`; thân tự mặc đồ dùng `selfClothed` để bỏ trống được
     *  áo/quần/giày mà vẫn đủ người. */
    body_astronaut_01: {
      n: 'Phi hành gia', overlays: true, slug: 'astronaut', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Đồ phi hành trắng, găng + bốt xám, bình khí hai bên lưng và mũ kính trong suốt. Mũ vẽ sau tóc nên tóc không xuyên kính; vẫn mặc thêm áo/quần/giày/mũ được.'
    },
    body_ninja_01: {
      n: 'Ninja', overlays: true, slug: 'ninja', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Đồ đen, thắt lưng đỏ, băng đô và khăn che mũi/miệng vẽ đè sau tóc. Mắt ở đúng 224/288 nên kính vẫn khớp.'
    },
    body_robot_01: {
      n: 'Robot thân thiện', overlays: true, slug: 'robot', selfClothed: true, slots: ROBOT_SLOTS,
      hint: 'Thân kim loại xanh bạc, ăng-ten đỏ, bảng điều khiển ngực, mặt kính LED tự vẽ. Chỉ nhận Kính + Mũ + Phụ kiện; không có da/tóc/mặt người/quần áo để thay.'
    },
    body_pirate_01: {
      n: 'Cướp biển', overlays: true, slug: 'pirate', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo choàng đỏ sẫm, áo sơ mi trắng, thắt lưng vàng, bốt da, mũ ba sừng + băng bịt mắt. Mũ vẽ đè sau tóc nên đội thêm mũ khác vẫn được.'
    },
    body_vampire_01: {
      n: 'Ma cà rồng', overlays: true, slug: 'vampire', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo đen, áo choàng tím sau lưng, cổ áo dựng đỏ, huân chương vàng và hai răng nanh. Áo choàng vẽ trước thân nên không che đồ.'
    },
    body_doctor_01: {
      n: 'Bác sĩ', overlays: true, slug: 'doctor', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo blouse trắng, áo trong xanh y tế, quần xám, ống nghe và thẻ tên. Ống nghe vẽ sau áo nên mặc áo ngoài vẫn thấy.'
    },
    body_firefighter_01: {
      n: 'Lính cứu hỏa', overlays: true, slug: 'firefighter', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Đồ chống cháy xanh đen, dải phản quang vàng, bốt đen, mũ đỏ có huy hiệu. Mũ vẽ trên cùng nên đội mũ khác là mũ đó nằm ngoài.'
    },
    body_teacher_01: {
      n: 'Giáo viên', overlays: true, slug: 'teacher', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo cardigan xanh ngọc, sơ mi trắng, quần nâu, dây đeo thẻ và bút cài túi. Tóc búi là "diện" mặc định nhưng đổi tóc thoải mái.'
    },
    body_police_01: {
      n: 'Cảnh sát', overlays: true, slug: 'police', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Đồng phục xanh navy, huy hiệu vàng, thắt lưng đai, bộ đàm vai và mũ kết vành. Kính + mũ chọn thêm vẫn vẽ đè đúng chỗ.'
    },
    body_chef_01: {
      n: 'Đầu bếp', overlays: true, slug: 'chef', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo trắng hai hàng khuy, khăn đỏ, quần tối và mũ đầu bếp cao. Mũ vẽ sau tóc nên tóc không đội ra ngoài mũ.'
    },
    body_pilot_01: {
      n: 'Phi công', overlays: true, slug: 'pilot', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Đồng phục navy, sơ mi trắng + cà vạt, sọc vàng tay áo, cầu vai và mũ phi công có cánh vàng.'
    },
    body_prince_01: {
      n: 'Hoàng tử', overlays: true, slug: 'prince', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo choàng xanh hoàng gia viền vàng, dải băng trắng, quần trắng, bốt đen và vương miện nhỏ.'
    },
    body_princess_01: {
      n: 'Công chúa', overlays: true, slug: 'princess', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Váy hồng dài viền vàng, tay phồng, quần tất sáng, vương miện và vòng cổ ngọc trai. Váy phủ thân nên chọn Váy khác sẽ đè lên.'
    },
    body_knight_01: {
      n: 'Hiệp sĩ', overlays: true, slug: 'knight', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Giáp bạc từng mảng, khiên đỏ sau lưng, mũ giáp hở mặt có lông đỏ. Mũ chừa đúng vùng mắt nên Mặt vẫn hiện rõ.'
    },
    body_witch_01: {
      n: 'Phù thủy', overlays: true, slug: 'witch', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Váy tím, thắt lưng vàng, tất sọc cam và mũ nhọn vành rộng có khoá vàng. Tóc mặc định màu tím, đổi được.'
    },
    body_fairy_01: {
      n: 'Tiên', overlays: true, slug: 'fairy', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Váy mint, cánh trong suốt sau lưng, vương miện hoa và đũa phép ngôi sao. Cánh vẽ trước thân nên không che đồ.'
    },
    body_skeleton_01: {
      n: 'Bộ xương', overlays: true, slug: 'skeleton', selfClothed: true, slots: SKELETON_SLOTS,
      hint: 'Hộp sọ có hốc mắt phát sáng, lồng ngực, xương chậu, tay chân hai xương viền rõ. Không nhận lớp Mặt vì mắt đã vẽ sẵn; vẫn đội tóc/mũ/kính, mang phụ kiện và mặc áo quần đè lên xương.'
    },
    body_snowman_01: {
      n: 'Người tuyết', overlays: false, slug: 'snowman', selfClothed: true, slots: CRITTER_SLOTS,
      hint: 'Ba quả cầu tuyết, mắt than + mũi cà rốt + khăn đỏ. Tự vẽ mặt nên chỉ nhận Kính, Mũ, Phụ kiện — mắt than đặt sát 224/288 để kính ôm đúng.'
    },
    body_santa_01: {
      n: 'Ông già Noel', overlays: true, slug: 'santa', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Đồ đỏ viền lông trắng, thắt lưng đen khoá vàng, bốt trắng, râu + mũ đỏ có bông. Râu vẽ sau mặt nên che miệng nhưng chừa mắt; đổi Mặt vẫn thấy mắt.'
    },
    body_ghost_halloween_01: {
      n: 'Ma Halloween', overlays: false, slug: 'halloween', selfClothed: true, slots: CRITTER_SLOTS,
      hint: 'Tấm vải tím bay, mắt phát sáng và miệng bí ngô, không có chân. Tự vẽ mặt nên chỉ nhận Kính, Mũ, Phụ kiện.'
    },

    /* ---- 12 thân bổ sung: đại dương / muôn thú / cổ tích / nghề nghiệp ----
     *  Tóc mặc định trong BODY_LOOKS tách nam–nữ: nữ để tóc dài, đuôi ngựa
     *  hoặc búi; nam để tóc ngắn/topknot. Thân đặc biệt tự vẽ mặt dùng slots hẹp. */
    body_mermaid_01: {
      n: 'Nàng tiên cá', overlays: true, slug: 'mermaid', selfClothed: true, slots: HEAD_SLOTS,
      hint: 'Đuôi cá xanh ngọc, vỏ sò làm áo, tóc dài đỏ và kẹp sao biển. Không có chân nên chỉ nhận da/mặt/tóc/kính/mũ/phụ kiện.'
    },
    body_werewolf_01: {
      n: 'Người sói', overlays: true, slug: 'werewolf', selfClothed: true, slots: SKELETON_SLOTS,
      hint: 'Lông nâu, mõm sói, mắt vàng, tai nhọn, đuôi xù và móng vuốt. Tự vẽ mặt nên không nhận lớp Mặt; vẫn đội tóc/mũ/kính và mặc áo quần được.'
    },
    body_elf_01: {
      n: 'Tiên rừng', overlays: true, slug: 'elf', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo lá xanh, tai nhọn, vòng nguyệt quế vàng, tóc dài và cung tên sau lưng. Tóc mặc định vàng, đổi được.'
    },
    body_genie_01: {
      n: 'Thần đèn', overlays: true, slug: 'genie', selfClothed: true,
      slots: ['face', 'hair', 'hairColor', 'glasses', 'hat', 'acc'],
      hint: 'Da xanh, khăn xếp vàng, vòng tay vàng và đuôi khói thay cho chân. Không có da người để đổi, nhưng chọn được mặt/tóc/kính/mũ/phụ kiện.'
    },
    body_dino_01: {
      n: 'Khủng long', overlays: false, slug: 'dino', selfClothed: true, slots: CRITTER_SLOTS,
      hint: 'Khủng long cam, bụng kem, gai đỏ, tay nhỏ và đuôi dài. Tự vẽ mặt nên chỉ nhận Kính, Mũ, Phụ kiện.'
    },
    body_alien_01: {
      n: 'Người ngoài hành tinh', overlays: false, slug: 'alien', selfClothed: true, slots: CRITTER_SLOTS,
      hint: 'Da tím, đầu to, mắt đen láy, râu ăng-ten và bộ đồ vũ trụ xanh ngọc. Tự vẽ mặt nên chỉ nhận Kính, Mũ, Phụ kiện.'
    },
    body_cyborg_01: {
      n: 'Cyborg', overlays: true, slug: 'cyborg', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Nửa người nửa máy: nửa mặt kim loại, mắt đỏ, tay/chân máy và lõi năng lượng. Vẫn đổi được da/mặt/tóc và mặc thêm đồ.'
    },
    body_samurai_01: {
      n: 'Samurai', overlays: true, slug: 'samurai', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Giáp đỏ đen viền vàng, băng đô, mào đầu và katana sau lưng. Tóc mặc định búi cao (topknot), đổi được.'
    },
    body_cowboy_01: {
      n: 'Cao bồi', overlays: true, slug: 'cowboy', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Mũ cao bồi, vest da, khăn quàng xanh, quần jean và bốt da. Tóc ngắn mặc định, đổi được.'
    },
    body_artist_01: {
      n: 'Họa sĩ', overlays: true, slug: 'artist', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Mũ nồi đỏ, tạp dề vẽ màu, cọ và bảng pha màu. Tóc dài mặc định cho nữ, đổi được.'
    },
    body_scientist_01: {
      n: 'Nhà khoa học', overlays: true, slug: 'scientist', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Áo blouse trắng, kính bảo hộ trên trán, bảng ghi chú và bút cài túi. Tóc đuôi ngựa mặc định cho nữ, đổi được.'
    },
    body_ballerina_01: {
      n: 'Vũ công ballet', overlays: true, slug: 'ballerina', selfClothed: true, slots: HUMAN_SLOTS,
      hint: 'Leotard hồng, váy tutu xếp lớp, tất và giày ballet có ruy băng. Tóc búi mặc định cho nữ, đổi được.'
    }
  };

  /** Nhóm linh kiện thân đó chấp nhận — `body` luôn có, không nằm trong danh sách. */
  function bodySlots(body) {
    var b = BODIES[body];
    return b && b.slots ? b.slots.slice() : [];
  }

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

  /* Thân bé gái có eo gọn + hông nở (xem femaleBody) nên áo phải bo theo đúng
   * đường thân đó. Dùng chung TORSO cũ sẽ rộng hơn thân ~30px mỗi bên. */
  var TORSO_GIRL = 'M204 325 C219 316 237 312 256 312 C275 312 293 316 308 325 C322 333 329 346 329 362 L326 384 C319 405 313 420 316 439 C325 462 333 483 333 499 C333 506 328 510 319 510 L193 510 C184 510 179 506 179 499 C179 483 187 462 196 439 C199 420 193 405 186 384 L183 362 C183 346 190 333 204 325 Z';

  function isGirlBody(body) {
    return body === 'body_girl_01';
  }

  /* ---- hình chân/giày "chuẩn bé trai" — MỘT nguồn toạ độ duy nhất ----
   *  Quần dài, giày và cả bộ đồ anh hùng đều vẽ theo 4 path này nên bất cứ
   *  thân nào dùng silhouette của body_01 đều được linh kiện khớp đúng. */
  var LEG_L = 'M194 492 L256 492 L256 632 C256 647 246 655 230 655 L203 655 C190 655 184 645 186 631 Z';
  var LEG_R = 'M256 492 L318 492 L326 631 C328 645 320 655 307 655 L280 655 C264 655 256 647 256 632 Z';
  var FOOT_L = 'M188 642 C202 637 224 637 243 642 C254 645 260 654 255 663 C251 671 236 674 213 674 C193 674 180 669 180 660 C180 652 183 646 188 642 Z';
  var FOOT_R = 'M269 642 C288 637 310 637 324 642 C329 646 332 652 332 660 C332 669 319 674 299 674 C276 674 261 671 257 663 C252 654 258 645 269 642 Z';

  /* ---- tay + khung đầu chung cho mọi thân người ---- */
  var ARM_L = 'M190 354 C166 354 157 371 158 395 L162 465 C163 480 175 490 188 486 C201 482 205 470 204 456 L201 386 Z';
  var ARM_R = 'M322 354 C346 354 355 371 354 395 L350 465 C349 480 337 490 324 486 C311 482 307 470 308 456 L311 386 Z';

  function shirtSvg(color, body) {
    var girl = isGirlBody(body);
    var torso = girl ? TORSO_GIRL : TORSO;
    var collar = girl
      ? 'M226 322 C234 342 278 342 286 322'
      : 'M225 324 C232 344 280 344 287 324';
    var shine = girl
      ? 'M199 360 C193 388 194 440 199 468'
      : 'M201 361 C195 389 196 438 201 465';
    return '<path d="' + torso + '" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="' + collar + '" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="7" stroke-linecap="round" fill="none"/>'
      + '<path d="' + shine + '" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.35" fill="none"/>';
  }


  var SHIRT_COLORS = {
    white: '#F4F6FA', red: '#E8453C', blue: '#3D7BD1', yellow: '#F5C63C',
    green: '#4CAF50', pink: '#F07CA8', purple: '#8B5CC7', orange: '#F08A3C'
  };

  /* ===================================================================== *
   *  VÁY — phủ thân + quần
   * ===================================================================== */
  var DRESS_BODY = 'M203 322 C219 312 236 308 256 308 C276 308 293 312 309 322 C334 328 350 348 348 372 L342 452 C352 500 358 552 360 596 C304 622 208 622 152 596 C154 552 160 500 170 452 L164 372 C162 348 178 328 203 322 Z';

  /* Váy bé gái: vai bo theo TORSO_GIRL, sườn ôm eo rồi mới xoè ra ở gấu. */
  var DRESS_BODY_GIRL = 'M204 321 C219 311 237 307 256 307 C275 307 293 311 308 321 C322 329 329 342 327 360 L321 386 C329 408 336 430 340 452 C348 500 352 552 354 596 C300 620 212 620 158 596 C160 552 164 500 172 452 C176 430 183 408 191 386 L185 360 C183 342 190 329 204 321 Z';

  function dressSvg(color, body) {
    var girl = isGirlBody(body);
    var skirt = girl ? DRESS_BODY_GIRL : DRESS_BODY;
    var collar = girl
      ? 'M226 320 C234 342 278 342 286 320'
      : 'M228 318 C236 342 276 342 284 318';
    var waistY = 452;
    return '<path d="' + skirt + '" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="' + collar + '" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="7" stroke-linecap="round" fill="none"/>'
      + '<path d="M172 ' + waistY + ' L340 ' + waistY + '" stroke="#000000" stroke-opacity=".12" stroke-width="6"/>'
      + '<path d="M188 500 Q256 528 324 500" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="9" fill="none" stroke-linecap="round"/>';
  }

  var DRESS_COLORS = {
    pink: '#F07CA8', red: '#E8453C', yellow: '#F5C63C', blue: '#3D7BD1', purple: '#8B5CC7', mint: '#4FC3A1'
  };

  /* ===================================================================== *
   *  QUẦN — 186–326 × 492–655
   * ===================================================================== */
  function pantsSvg(id, body) {
    var girl = isGirlBody(body);

    if (id === 'skirt_pink' || id === 'skirt_mint') {
      var skirtColor = id === 'skirt_pink' ? '#F07CA8' : '#4FC3A1';
      /* Bé gái có hông 216–296 nên cạp váy phải nằm đúng khoảng đó. */
      /* Bé gái có hông rộng hơn chân: cạp quần/váy phải phủ hết hông
       * (181–331 ở y≈500) rồi mới thu về hai ống chân 216–248 / 264–296. */
      if (girl) {
        return '<path d="M190 498 L324 498 L342 616 L170 616 Z" fill="' + skirtColor + '" filter="url(#kidShadow)"/>'
          + '<path d="M196 518 L318 518" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="7" fill="none"/>';
      }
      return '<path d="M192 492 L320 492 L342 616 L170 616 Z" fill="' + skirtColor + '" filter="url(#kidShadow)"/>'
        + '<path d="M196 512 L316 512" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="7" fill="none"/>';
    }

    var c = id === 'jeans' ? '#3D63A8' : id === 'black' ? '#2E2E38' : id === 'khaki' ? '#D8B87A' : '#E8453C';

    if (girl) {
      if (id === 'khaki' || id === 'redshort') {
        return '<path d="M190 498 L256 498 L256 600 L200 600 C193 600 189 596 190 589 L192 548 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
          + '<path d="M256 498 L322 498 L320 548 L322 589 C323 596 319 600 312 600 L256 600 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
          + '<path d="M256 506 L256 596" stroke="#000000" stroke-opacity=".25" stroke-width="5"/>';
      }
      return '<path d="M190 498 L256 498 L255 566 L254 630 C254 645 245 654 233 654 L220 654 C209 654 204 645 205 630 L201 566 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
        + '<path d="M256 498 L322 498 L321 566 L303 630 C304 645 298 654 287 654 L274 654 C263 654 258 645 257 630 L256 566 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
        + '<path d="M256 504 L256 634" stroke="#000000" stroke-opacity=".22" stroke-width="5"/>'
        + '<path d="M214 516 L211 620" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="7" stroke-linecap="round" opacity="0.5"/>';
    }

    if (id === 'khaki' || id === 'redshort') {
      return '<path d="M192 492 L256 492 L256 604 L204 604 C192 604 186 594 188 580 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
        + '<path d="M256 492 L320 492 L324 580 C326 594 320 604 308 604 L256 604 Z" fill="' + c + '" filter="url(#kidShadow)"/>'
        + '<path d="M256 500 L256 600" stroke="#000000" stroke-opacity=".25" stroke-width="5"/>';
    }
    return '<path d="' + LEG_L + '" fill="' + c + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + c + '" filter="url(#kidShadow)"/>'
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
  function shoesSvg(color, body) {
    if (isGirlBody(body)) {
      /* Bàn chân bé gái: 212–246 và 266–300 (y 632–654). */
      return '<path d="M206 636 C216 631 234 631 248 636 C255 640 256 649 250 655 C243 661 230 661 219 657 C209 653 202 644 206 636 Z" fill="' + color + '" filter="url(#kidShadow)"/>'
        + '<path d="M264 636 C276 631 292 631 306 636 C311 640 313 648 308 654 C301 661 288 661 277 657 C267 653 260 645 264 636 Z" fill="' + color + '" filter="url(#kidShadow)"/>'
        + '<path d="M208 650 Q226 658 250 650" stroke="#00000022" stroke-width="5" stroke-linecap="round" fill="none"/>'
        + '<path d="M262 650 Q282 658 306 650" stroke="#00000022" stroke-width="5" stroke-linecap="round" fill="none"/>';
    }
    return '<path d="' + FOOT_L + '" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + color + '" filter="url(#kidShadow)"/>'
      + '<path d="M190 664 Q220 674 251 664" stroke="#00000022" stroke-width="5" stroke-linecap="round" fill="none"/>'
      + '<path d="M261 664 Q292 674 322 664" stroke="#00000022" stroke-width="5" stroke-linecap="round" fill="none"/>';
  }
  var SHOE_OPTIONS = { white: { n: 'Trắng', c: '#FFFFFF' }, red: { n: 'Đỏ', c: '#E8453C' }, blue: { n: 'Xanh', c: '#3D7BD1' }, black: { n: 'Đen', c: '#2E2E38' }, pink: { n: 'Hồng', c: '#F07CA8' } };

  /* ===================================================================== *
   *  MŨ — ngồi trên đỉnh đầu (đầu 179–333 × 91–301, chân mày y≈186).
   *  Vành mũ giữ trên y≈195 để không che mắt 210; mũ nào cũng có viền/highlight
   *  phẳng giống body + áo quần, không dùng filter nên preview thu nhỏ vẫn hiện.
   * ===================================================================== */
  function flowerCrown(x, y, petal) {
    return '<g transform="translate(' + x + ' ' + y + ')">'
      + '<g fill="' + petal + '">'
      + '<circle cy="-11" r="9"/><circle cx="10" cy="-4" r="9"/>'
      + '<circle cx="7" cy="9" r="9"/><circle cx="-7" cy="9" r="9"/><circle cx="-10" cy="-4" r="9"/>'
      + '</g>'
      + '<circle r="6.5" fill="#F5C63C"/>'
      + '<circle cx="-2" cy="-2" r="2.2" fill="#FFFFFF" opacity=".65"/>'
      + '</g>';
  }

  var HATS = {
    hat_01: {
      n: 'Mũ lưỡi trai',
      svg: '<path d="M160 166 C156 104 198 62 256 62 C314 62 356 104 352 166 Z" fill="#3D7BD1"/>'
        + '<path d="M256 66 L214 160 M256 66 L298 160" stroke="#2A5FA8" stroke-width="5" opacity=".55" fill="none"/>'
        + '<path d="M188 112 C204 88 228 78 250 78" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="9" fill="none" stroke-linecap="round"/>'
        + '<circle cx="256" cy="66" r="9" fill="#2A5FA8"/>'
        + '<circle cx="253" cy="63" r="3" fill="#FFFFFF" opacity=".55"/>'
        + '<path d="M148 146 C206 164 306 164 364 146 L354 170 C300 188 212 188 158 170 Z" fill="#2A5FA8"/>'
        + '<path d="M164 160 C216 175 296 175 348 160" stroke="#1F4A88" stroke-width="4" fill="none" opacity=".5"/>'
        + '<path d="M158 150 C210 164 302 164 354 150" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="5" fill="none"/>'
    },
    hat_02: {
      n: 'Mũ len',
      svg: '<path d="M160 170 C154 100 198 54 256 54 C314 54 358 100 352 170 Z" fill="#E8453C"/>'
        + '<path d="M180 92 C200 70 228 60 252 60" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="10" fill="none" stroke-linecap="round"/>'
        + '<rect x="150" y="152" width="212" height="32" rx="16" fill="#B83029"/>'
        + '<path d="M162 158 L162 178 M182 156 L182 180 M202 156 L202 180 M222 156 L222 180 M242 156 L242 180 M262 156 L262 180 M282 156 L282 180 M302 156 L302 180 M322 156 L322 180 M342 156 L342 180" stroke="#8F211C" stroke-width="5" opacity=".55" stroke-linecap="round"/>'
        + '<circle cx="256" cy="54" r="21" fill="#FFFFFF"/>'
        + '<path d="M241 45 Q256 38 271 45" stroke="#E2E6EE" stroke-width="6" fill="none" stroke-linecap="round"/>'
        + '<circle cx="249" cy="48" r="5" fill="#FFFFFF" opacity=".8"/>'
    },
    hat_03: {
      n: 'Mũ sinh nhật',
      svg: '<path d="M170 172 L256 58 L342 172 Z" fill="#F07CA8"/>'
        + '<path d="M188 142 L256 58 L324 142 Z" fill="#F58FB4" opacity=".55"/>'
        + '<path d="M197 148 L315 148" stroke="#F5C63C" stroke-width="10" opacity=".9"/>'
        + '<path d="M182 164 L330 164" stroke="#FFFFFF" stroke-width="7" opacity=".55"/>'
        + '<g fill="#FFFFFF"><circle cx="232" cy="118" r="7"/><circle cx="286" cy="104" r="6"/><circle cx="264" cy="134" r="6"/></g>'
        + '<g fill="#F5C63C"><circle cx="214" cy="134" r="5"/><circle cx="302" cy="128" r="4.5"/></g>'
        + '<ellipse cx="256" cy="172" rx="86" ry="12" fill="#D6558A"/>'
        + '<circle cx="256" cy="44" r="13" fill="#F5C63C"/>'
        + '<circle cx="251" cy="39" r="4" fill="#FFFFFF" opacity=".6"/>'
    },
    hat_04: {
      n: 'Vương miện',
      svg: '<path d="M164 170 L170 88 L212 132 L256 66 L300 132 L342 88 L348 170 Z" fill="#F5C63C" stroke="#C99A10" stroke-width="6" stroke-linejoin="round"/>'
        + '<path d="M188 162 L192 112 L208 136 Z" fill="#FFE08A" opacity=".55"/>'
        + '<path d="M170 152 L348 152" stroke="#E0AE14" stroke-width="4" opacity=".5"/>'
        + '<circle cx="256" cy="128" r="11" fill="#E8453C" stroke="#C99A10" stroke-width="3"/>'
        + '<circle cx="210" cy="146" r="8" fill="#3D7BD1" stroke="#C99A10" stroke-width="3"/>'
        + '<circle cx="302" cy="146" r="8" fill="#4FC3A1" stroke="#C99A10" stroke-width="3"/>'
        + '<circle cx="170" cy="88" r="6" fill="#FFFFFF"/><circle cx="256" cy="66" r="6" fill="#FFFFFF"/><circle cx="342" cy="88" r="6" fill="#FFFFFF"/>'
        + '<rect x="160" y="168" width="192" height="18" rx="9" fill="#E0AE14"/>'
        + '<path d="M194 176 L244 176" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="4" stroke-linecap="round"/>'
    },
    hat_05: {
      n: 'Nón lá',
      svg: '<ellipse cx="256" cy="166" rx="148" ry="20" fill="#EFCF82" stroke="#C9A24A" stroke-width="6"/>'
        + '<path d="M184 162 C188 100 214 68 256 68 C298 68 324 100 328 162 Z" fill="#EFCF82" stroke="#C9A24A" stroke-width="6"/>'
        + '<path d="M192 148 L320 148" stroke="#E8453C" stroke-width="16"/>'
        + '<path d="M206 160 C226 116 242 92 256 76 M256 76 C270 92 286 116 306 160" stroke="#D8B66A" stroke-width="3" fill="none" opacity=".7"/>'
        + '<path d="M184 166 C212 176 300 176 328 166" stroke="#C9A24A" stroke-width="4" fill="none" opacity=".6"/>'
        + '<path d="M204 118 C216 96 234 82 250 78" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="8" fill="none" stroke-linecap="round"/>'
    },
    hat_06: {
      n: 'Hoa khoang trang',
      svg: '<path d="M172 142 Q256 84 340 142" stroke="#3F9E7F" stroke-width="7" fill="none" stroke-linecap="round"/>'
        + '<g fill="#4FC3A1"><ellipse cx="204" cy="130" rx="12" ry="7" transform="rotate(-32 204 130)"/>'
        + '<ellipse cx="308" cy="130" rx="12" ry="7" transform="rotate(32 308 130)"/>'
        + '<ellipse cx="240" cy="98" rx="12" ry="7" transform="rotate(-25 240 98)"/>'
        + '<ellipse cx="272" cy="98" rx="12" ry="7" transform="rotate(25 272 98)"/></g>'
        + flowerCrown(188, 126, '#F07CA8')
        + flowerCrown(222, 108, '#FFA3BE')
        + flowerCrown(256, 102, '#F07CA8')
        + flowerCrown(290, 108, '#FFA3BE')
        + flowerCrown(324, 126, '#F07CA8')
    }
  };

  /* ===================================================================== *
   *  KÍNH — quanh mắt 224/288 × 210
   * ===================================================================== */
  var GLASSES = {
    /* Gọng kính luôn ôm đúng 2 mắt 224/288 × 210: mỗi mắt kính cách tâm mắt
     * ~30px nên khe giữa chỉ 4–8px, không chồng lên nhau; gọng temple nối ra
     * sát vành tai 180/332 như kính thật. */
    glasses_01: {
      n: 'Tròn',
      svg: '<g stroke="#3E2C22" fill="none" stroke-linecap="round">'
        + '<circle cx="224" cy="210" r="30" fill="#CFE8FF" fill-opacity=".26" stroke-width="8"/>'
        + '<circle cx="288" cy="210" r="30" fill="#CFE8FF" fill-opacity=".26" stroke-width="8"/>'
        + '<path d="M254 207 Q256 201 258 207" stroke-width="8"/>'
        + '<path d="M194 203 L182 198 M318 203 L330 198" stroke-width="8"/>'
        + '</g>'
        + '<path d="M206 197 A20 20 0 0 1 220 190" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="6" fill="none" stroke-linecap="round"/>'
        + '<path d="M270 197 A20 20 0 0 1 284 190" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="6" fill="none" stroke-linecap="round"/>'
    },
    glasses_02: {
      n: 'Vuông',
      svg: '<g stroke="#2A5FA8" fill="none" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="195" y="185" width="58" height="48" rx="14" fill="#DDEBFF" fill-opacity=".3" stroke-width="8"/>'
        + '<rect x="261" y="185" width="58" height="48" rx="14" fill="#DDEBFF" fill-opacity=".3" stroke-width="8"/>'
        + '<path d="M253 208 L261 208" stroke-width="8"/>'
        + '<path d="M195 202 L183 197 M319 202 L331 197" stroke-width="8"/>'
        + '</g>'
        + '<path d="M206 198 L226 192" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="6" fill="none" stroke-linecap="round"/>'
        + '<path d="M272 198 L292 192" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="6" fill="none" stroke-linecap="round"/>'
    },
    glasses_03: {
      n: 'Kính râm',
      svg: '<g stroke="#26262E" fill="#26262E" stroke-linecap="round" stroke-linejoin="round">'
        + '<rect x="191" y="184" width="62" height="50" rx="18" stroke-width="8"/>'
        + '<rect x="259" y="184" width="62" height="50" rx="18" stroke-width="8"/>'
        + '<path d="M253 207 L259 207" fill="none" stroke-width="8"/>'
        + '<path d="M191 201 L181 196 M321 201 L331 196" fill="none" stroke-width="8"/>'
        + '</g>'
        + '<path d="M203 196 L228 196" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M271 196 L296 196" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="7" stroke-linecap="round"/>'
        + '<path d="M272 224 L300 218" stroke="#6EC1FF" stroke-opacity=".35" stroke-width="6" stroke-linecap="round"/>'
    },
    glasses_04: {
      n: 'Tim',
      svg: '<path d="M224 238 C208 224 197 211 197 201 C197 191 206 186 214 191 C218 193 222 197 224 202 C226 197 230 193 234 191 C242 186 251 191 251 201 C251 211 240 224 224 238 Z" fill="#FF6E9C" stroke="#C2185B" stroke-width="6" stroke-linejoin="round"/>'
        + '<path d="M288 238 C272 224 261 211 261 201 C261 191 270 186 278 191 C282 193 286 197 288 202 C290 197 294 193 298 191 C306 186 315 191 315 201 C315 211 304 224 288 238 Z" fill="#FF6E9C" stroke="#C2185B" stroke-width="6" stroke-linejoin="round"/>'
        + '<path d="M251 206 L261 206" stroke="#C2185B" stroke-width="6" stroke-linecap="round"/>'
        + '<path d="M197 200 L185 195 M315 200 L327 195" stroke="#C2185B" stroke-width="6" stroke-linecap="round"/>'
        + '<path d="M207 201 C209 195 214 193 218 194" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/>'
        + '<path d="M271 201 C273 195 278 193 282 194" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="4" fill="none" stroke-linecap="round"/>'
    }
  };

  /* ===================================================================== *
   *  PHỤ KIỆN — `b` vẽ sau thân (cờ đuôi, túi), `f` vẽ đè lên trên
   * ===================================================================== */
  var ACCS = {
    acc_01: {
      n: 'Nơ',
      f: '<g transform="translate(256 350)">'
        + '<path d="M-8 -4 C-34 -30 -58 -18 -52 6 C-48 24 -26 26 -8 10 Z" fill="#E8453C"/>'
        + '<path d="M8 -4 C34 -30 58 -18 52 6 C48 24 26 26 8 10 Z" fill="#E8453C"/>'
        + '<path d="M-6 8 L-16 34 L-2 28 L6 36 L12 10 Z" fill="#C93A31"/>'
        + '<ellipse cx="0" cy="2" rx="12" ry="11" fill="#B83029"/>'
        + '<path d="M-30 -6 C-22 -14 -12 -14 -6 -8" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="5" fill="none" stroke-linecap="round"/>'
        + '</g>'
    },
    acc_02: {
      n: 'Khăn quàng',
      f: '<path d="M190 332 C228 368 284 368 322 332 L322 362 C284 396 228 396 190 362 Z" fill="#F5A623"/>'
        + '<path d="M198 340 C234 366 278 366 314 340" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/>'
        + '<path d="M298 390 L320 466 L290 472 L272 402 Z" fill="#E8921A"/>'
        + '<path d="M272 402 L296 408 M290 464 L318 470" stroke="#C97A12" stroke-width="4" stroke-linecap="round" opacity=".7"/>'
    },
    acc_03: {
      n: 'Dây chuyền',
      f: '<path d="M210 336 C228 388 284 388 302 336" stroke="#D99A00" stroke-width="7" fill="none" stroke-linecap="round"/>'
        + '<g fill="#F5C63C" stroke="#B8890A" stroke-width="2">'
        + '<circle cx="215" cy="352" r="4"/><circle cx="223" cy="371" r="4"/><circle cx="237" cy="383" r="4"/>'
        + '<circle cx="256" cy="388" r="4"/><circle cx="275" cy="383" r="4"/><circle cx="289" cy="371" r="4"/><circle cx="297" cy="352" r="4"/>'
        + '</g>'
        + '<path d="M256 414 C234 392 240 368 256 382 C272 368 278 392 256 414 Z" fill="#FF6E9C" stroke="#C2185B" stroke-width="4" stroke-linejoin="round"/>'
        + '<circle cx="250" cy="386" r="4" fill="#FFFFFF" opacity=".6"/>'
    },
    acc_04: {
      n: 'Tai nghe',
      f: '<path d="M180 206 C168 108 216 58 256 58 C296 58 344 108 332 206" stroke="#2E2E38" stroke-width="13" fill="none" stroke-linecap="round"/>'
        + '<path d="M186 184 C180 116 214 74 250 70" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="7" fill="none" stroke-linecap="round"/>'
        + '<rect x="156" y="184" width="46" height="76" rx="23" fill="#E8453C"/>'
        + '<rect x="310" y="184" width="46" height="76" rx="23" fill="#E8453C"/>'
        + '<rect x="166" y="198" width="26" height="48" rx="13" fill="#B83029"/>'
        + '<rect x="320" y="198" width="26" height="48" rx="13" fill="#B83029"/>'
        + '<circle cx="178" cy="194" r="5" fill="#FFFFFF" opacity=".5"/><circle cx="332" cy="194" r="5" fill="#FFFFFF" opacity=".5"/>'
    },
    acc_05: {
      n: 'Túi',
      f: '<g>'
        + '<path d="M214 332 C230 400 300 430 352 462" stroke="#C2651F" stroke-width="9" fill="none" stroke-linecap="round"/>'
        + '<path d="M306 468 C306 458 316 450 330 450 L362 450 C376 450 386 460 386 474 L386 556 C386 570 376 580 362 580 L330 580 C316 580 306 570 306 556 Z" fill="#F08A3C"/>'
        + '<path d="M306 486 L386 486" stroke="#C2651F" stroke-width="7"/>'
        + '<rect x="332" y="476" width="30" height="20" rx="5" fill="#F5C63C" stroke="#C2651F" stroke-width="3"/>'
        + '<path d="M314 508 L378 508" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="5" stroke-linecap="round"/>'
        + '</g>'
    },
    acc_06: {
      n: 'Áo choàng',
      b: '<path d="M192 336 L320 336 L392 626 L120 626 Z" fill="#B83029" filter="url(#kidShadow)"/>'
        + '<path d="M256 352 L256 616 M214 360 L176 600 M298 360 L336 600" stroke="#8E1A14" stroke-width="7" fill="none" opacity=".4"/>'
        + '<path d="M124 622 C186 646 326 646 388 622" stroke="#8E1A14" stroke-width="8" fill="none" opacity=".4"/>'
        + '<path d="M198 344 L314 344" stroke="#E8453C" stroke-width="9"/>',
      f: '<circle cx="256" cy="340" r="16" fill="#F5C63C" stroke="#C99A10" stroke-width="6"/>'
        + '<circle cx="251" cy="335" r="4" fill="#FFFFFF" opacity=".6"/>'
    }
  };

  /* ===================================================================== *
   *  THÂN NGƯỜI — chép nguyên văn `body.html`, tách phần có thể thay thế
   *  Thành `groundShadow / limbs / neck / head` dùng chung cho mọi thân:
   *  chỉ đổi `fill` (da → màu vải) nên mặt, tóc, mũ, kính, áo, quần, giày
   *  của hệ linh kiện ghép vào thân nào cũng đúng toạ độ.
   * ===================================================================== */
  function groundShadow() {
    return '<ellipse cx="256" cy="665" rx="105" ry="22" fill="#000000" opacity="0.10" filter="url(#kidBlur)"/>';
  }

  function limbs(f) {
    return '<path d="' + ARM_L + '" fill="' + f + '"/>'
      + '<path d="' + ARM_R + '" fill="' + f + '"/>';
  }

  function neck(sv, f) {
    return '<path d="M226 292 L226 329 C226 345 286 345 286 329 L286 292 Z" fill="' + f + '"/>'
      + '<path d="M226 293 C238 307 272 309 286 293 L286 317 C268 326 242 326 226 316 Z" fill="' + sv.shadow + '" opacity="0.45"/>';
  }

  function head(sv, f) {
    return '<g filter="url(#kidShadow)"><path d="M179 164 C179 115 213 91 256 91 C299 91 333 115 333 164 L333 216 C333 263 299 301 256 301 C213 301 179 263 179 216 Z" fill="' + f + '"/>'
      + '<ellipse cx="180" cy="213" rx="12" ry="23" fill="' + sv.ear + '"/>'
      + '<ellipse cx="332" cy="213" rx="12" ry="23" fill="' + sv.ear + '"/>'
      + '<ellipse cx="224" cy="143" rx="40" ry="25" fill="#FFFFFF" opacity="0.16"/></g>';
  }

  function humanBody(sv) {
    return groundShadow()
      + limbs('url(#kidSkin)')
      + neck(sv, 'url(#kidSkin)')
      + head(sv, 'url(#kidSkin)');
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

  /* ===================================================================== *
   *  BỘ ĐỒ ANH HÙNG — Kamen Rider & Superman
   *
   *  Hai thân này vẫn là khung người 512×700 của body.html: cùng đầu/cổ/tay
   *  (limbs/neck/head) và cùng silhouette TORSO + LEG_L/R + FOOT_L/R với bé
   *  trai, nên MỌI linh kiện (mặt, tóc, mũ, kính, áo, váy, quần, giày, phụ
   *  kiện) gắn vào là đúng chỗ ngay — đó là chữ "đồng bộ" cần có.
   *
   *  Bộ đồ tự mặc 3 lớp, mỗi thân khai báo trong HERO_SUITS:
   *    body() → vẽ sau cùng, trước mặt      (bộ骨架: tay, thân, chân, găng)
   *    back() → vẽ sau áo choàng, trước tóc (thứ treo sau lưng: khăn, áo choàng)
   *    top()  → vẽ sau giày, trước phụ kiện (mũ bảo hiểm, thắt lưng, phù hiệu,
   *             quần chip, bốt — những chi tiết không được để áo quần che)
   * ===================================================================== */
  var RIDER = {
    suit: '#2F7D52', dark: '#1E5638', trim: '#C6CCD8', trimDark: '#8F98A9',
    eye: '#FFB03A', eyeLight: '#FFE9A8', leather: '#252530', accent: '#E8453C'
  };
  var SUP = {
    suit: '#2A5FC1', dark: '#1E4694', red: '#D6322E', cape: '#C2261F',
    capeDark: '#8E1A14', yellow: '#F5C63C', trim: '#E8EDF6'
  };

  function glovePair(leather, trim) {
    return '<rect x="156" y="440" width="52" height="52" rx="24" fill="' + leather + '"/>'
      + '<rect x="304" y="440" width="52" height="52" rx="24" fill="' + leather + '"/>'
      + '<path d="M162 448 L204 442" stroke="' + trim + '" stroke-width="7" stroke-linecap="round"/>'
      + '<path d="M308 442 L350 448" stroke="' + trim + '" stroke-width="7" stroke-linecap="round"/>';
  }

  /* ---- Kamen Rider ---- */
  function riderBody(sv) {
    return groundShadow()
      + limbs(RIDER.suit)
      /* đai tay + găng */
      + '<path d="M162 404 L202 398 M310 398 L350 404" stroke="' + RIDER.trim + '" stroke-width="7" stroke-linecap="round" opacity="0.6"/>'
      + glovePair(RIDER.leather, RIDER.trim)
      + neck(sv, RIDER.dark)
      + head(sv, 'url(#kidSkin)')
      /* bộ đồ: thân + giáp ngực + đai bụng */
      + '<path d="' + TORSO + '" fill="' + RIDER.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M222 320 C240 334 272 334 290 320 L286 310 L226 310 Z" fill="' + RIDER.dark + '"/>'
      + '<path d="M232 342 L256 382 L280 342" stroke="' + RIDER.trim + '" stroke-width="8" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'
      + '<path d="M226 404 C246 414 266 414 286 404 M228 432 C246 441 266 441 284 432" stroke="' + RIDER.dark + '" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.75"/>'
      /* chân + bọc gối */
      + '<path d="' + LEG_L + '" fill="' + RIDER.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + RIDER.suit + '" filter="url(#kidShadow)"/>'
      + '<ellipse cx="221" cy="558" rx="24" ry="17" fill="' + RIDER.dark + '"/>'
      + '<ellipse cx="291" cy="558" rx="24" ry="17" fill="' + RIDER.dark + '"/>'
      + '<path d="M204 552 C214 546 230 546 240 552 M274 552 C284 546 300 546 310 552" stroke="' + RIDER.trim + '" stroke-width="5" fill="none" opacity="0.5" stroke-linecap="round"/>';
  }

  function riderBack() {
    /* khăn quàng bạc đuôi chẽ — vẽ trước thân nên không che gì, chỉ lộ ra sau
     * vai như trong ảnh gốc. Đuối chẽ chữ V để đọc là vải bay, không phải cánh. */
    return '<path d="M292 326 C340 350 360 408 352 468 L346 514 L324 488 L304 516 L300 460 C298 410 286 366 266 344 Z" fill="' + RIDER.trim + '" filter="url(#kidShadow)"/>'
      + '<path d="M306 358 C330 396 338 440 332 480" stroke="' + RIDER.trimDark + '" stroke-width="7" fill="none" opacity="0.6"/>';
  }

  function riderTop() {
    return '<g>'
      /* bốt đen cổ bạc */
      + '<rect x="188" y="596" width="66" height="46" rx="12" fill="' + RIDER.leather + '"/>'
      + '<rect x="258" y="596" width="66" height="46" rx="12" fill="' + RIDER.leather + '"/>'
      + '<path d="' + FOOT_L + '" fill="' + RIDER.leather + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + RIDER.leather + '" filter="url(#kidShadow)"/>'
      + '<path d="M190 602 L252 602 M260 602 L322 602" stroke="' + RIDER.trim + '" stroke-width="8" stroke-linecap="round"/>'
      /* thắt lưng Typhoon */
      + '<path d="M180 476 C212 492 300 492 332 476 L332 500 C300 514 212 514 180 500 Z" fill="' + RIDER.leather + '" filter="url(#kidShadow)"/>'
      + '<circle cx="256" cy="498" r="24" fill="' + RIDER.trim + '" stroke="' + RIDER.trimDark + '" stroke-width="6"/>'
      + '<circle cx="256" cy="498" r="11" fill="#F5C63C"/>'
      + '<circle cx="216" cy="494" r="7" fill="' + RIDER.accent + '"/><circle cx="296" cy="494" r="7" fill="#4FC3A1"/>'
      /* cổ khăn */
      + '<path d="M220 316 C240 336 272 336 292 316 L296 340 C272 360 240 360 216 340 Z" fill="' + RIDER.trim + '"/>'
      + '<path d="M224 330 C244 344 268 344 288 330" stroke="' + RIDER.trimDark + '" stroke-width="6" fill="none"/>'
      /* mũ: vòm theo đúng silhouette đầu, để lộ mũi + miệng bên dưới */
      + '<path d="M179 164 C179 115 213 91 256 91 C299 91 333 115 333 164 L333 222 C333 240 300 250 256 250 C212 250 179 240 179 222 Z" fill="' + RIDER.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M186 176 C214 160 298 160 326 176" stroke="' + RIDER.trim + '" stroke-width="9" fill="none" stroke-linecap="round"/>'
      + '<path d="M256 94 L256 140" stroke="' + RIDER.trim + '" stroke-width="8" stroke-linecap="round"/>'
      + '<circle cx="256" cy="152" r="11" fill="' + RIDER.accent + '" stroke="' + RIDER.trim + '" stroke-width="5"/>'
      /* mắt compound */
      + '<ellipse cx="222" cy="206" rx="26" ry="20" fill="' + RIDER.eye + '" transform="rotate(-12 222 206)"/>'
      + '<ellipse cx="290" cy="206" rx="26" ry="20" fill="' + RIDER.eye + '" transform="rotate(12 290 206)"/>'
      + '<ellipse cx="212" cy="199" rx="9" ry="6" fill="' + RIDER.eyeLight + '" opacity="0.85" transform="rotate(-12 212 199)"/>'
      + '<ellipse cx="280" cy="199" rx="9" ry="6" fill="' + RIDER.eyeLight + '" opacity="0.85" transform="rotate(12 280 199)"/>'
      /* ăng-ten + lỗ thở */
      + '<path d="M232 108 C216 78 196 58 172 44" stroke="' + RIDER.trim + '" stroke-width="9" fill="none" stroke-linecap="round"/>'
      + '<path d="M280 108 C296 78 316 58 340 44" stroke="' + RIDER.trim + '" stroke-width="9" fill="none" stroke-linecap="round"/>'
      + '<circle cx="172" cy="44" r="8" fill="' + RIDER.accent + '"/><circle cx="340" cy="44" r="8" fill="' + RIDER.accent + '"/>'
      + '<path d="M232 244 C244 252 268 252 280 244" stroke="' + RIDER.trim + '" stroke-width="7" fill="none" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- Superman ---- */
  function supermanBody(sv) {
    return groundShadow()
      + limbs(SUP.suit)
      + '<path d="M164 374 C161 406 163 438 169 462 M348 374 C351 406 349 438 343 462" stroke="' + SUP.dark + '" stroke-width="7" fill="none" opacity="0.45" stroke-linecap="round"/>'
      + neck(sv, SUP.suit)
      + '<path d="M232 300 L256 322 L280 300" stroke="' + SUP.dark + '" stroke-width="7" fill="none" stroke-linejoin="round"/>'
      + head(sv, 'url(#kidSkin)')
      + '<path d="' + TORSO + '" fill="' + SUP.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M226 366 C244 378 268 378 286 366" stroke="' + SUP.dark + '" stroke-width="6" fill="none" opacity="0.4"/>'
      + '<path d="' + LEG_L + '" fill="' + SUP.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + SUP.suit + '" filter="url(#kidShadow)"/>';
  }

  function supermanBack() {
    return '<path d="M204 326 C232 348 280 348 308 326 L356 424 L390 604 C332 644 180 644 122 604 L156 424 Z" fill="' + SUP.cape + '" filter="url(#kidShadow)"/>'
      + '<path d="M256 344 L256 630" stroke="' + SUP.capeDark + '" stroke-width="10" opacity="0.5" fill="none"/>'
      + '<path d="M196 358 L160 610 M316 358 L352 610" stroke="' + SUP.capeDark + '" stroke-width="9" opacity="0.35" fill="none"/>'
      + '<path d="M122 604 C180 632 332 632 390 604" stroke="' + SUP.capeDark + '" stroke-width="9" fill="none" opacity="0.5"/>';
  }

  function supermanTop() {
    return '<g>'
      /* quần chip đỏ + thắt lưng vàng đè lên đồ xanh */
      + '<path d="M180 472 C212 490 300 490 332 472 L336 512 C336 542 320 558 296 558 L264 558 L256 530 L248 558 L216 558 C192 558 176 542 176 512 Z" fill="' + SUP.red + '" filter="url(#kidShadow)"/>'
      + '<path d="M182 478 C214 494 298 494 330 478" stroke="' + SUP.yellow + '" stroke-width="11" fill="none" stroke-linecap="round"/>'
      /* bốt đỏ: ống 588–640 rồi tới bàn chân chuẩn, cổ bốt viền sáng */
      + '<rect x="186" y="588" width="70" height="52" rx="12" fill="' + SUP.red + '"/>'
      + '<rect x="256" y="588" width="70" height="52" rx="12" fill="' + SUP.red + '"/>'
      + '<path d="M190 596 L252 596 M260 596 L322 596" stroke="' + SUP.capeDark + '" stroke-width="7" stroke-linecap="round" opacity="0.55"/>'
      + '<path d="' + FOOT_L + '" fill="' + SUP.red + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + SUP.red + '" filter="url(#kidShadow)"/>'
      /* phù hiệu S trong khiên vàng */
      + '<path d="M256 322 L318 352 L256 440 L194 352 Z" fill="' + SUP.yellow + '" stroke="' + SUP.red + '" stroke-width="9" stroke-linejoin="round" filter="url(#kidShadow)"/>'
      + '<path d="M278 362 C268 350 240 350 236 366 C232 380 252 384 262 388 C274 393 280 400 274 408 C268 416 248 416 240 408" stroke="' + SUP.red + '" stroke-width="13" fill="none" stroke-linecap="round"/>'
      /* khoá áo choàng */
      + '<circle cx="214" cy="332" r="9" fill="' + SUP.yellow + '" stroke="' + SUP.dark + '" stroke-width="4"/>'
      + '<circle cx="298" cy="332" r="9" fill="' + SUP.yellow + '" stroke="' + SUP.dark + '" stroke-width="4"/>'
      + '</g>';
  }

  /* ===================================================================== *
   *  THÂN MỚI — Kaiju / Bóng ma / Ngôi sao nhạc pop
   *
   *  Cả ba giữ nguyên khung đầu + cổ + tay của body.html (179–333 × 91–301,
   *  mắt 224/288 × 210) nên mũ, kính, phụ kiện gắn vào là đúng chỗ; riêng
   *  những lớp thân đó không có thì `slots` khai báo ở BODIES đã chặn từ
   *  trong `sanitizeKid` → không bao giờ tới lượt render.
   * ===================================================================== */
  var KAIJU = {
    skin: '#4FA35C', dark: '#2F6B3E', belly: '#DCEBA6', spike: '#C2E36B',
    spikeDark: '#88B14A', eye: '#FFD23F', pupil: '#241A12', mouth: '#3A2030'
  };

  function kaijuBack() {
    /* gai lưng mọc ra ngoài hai bên tay + đuôi quét sau chân — vẽ TRƯỚC thân
     * nên không che gì, chỉ lộ ra sau vai như khăn của Kamen Rider. */
    return '<g fill="' + KAIJU.spike + '" stroke="' + KAIJU.spikeDark + '" stroke-width="5" stroke-linejoin="round">'
      + '<path d="M168 330 L126 284 L184 368 Z"/><path d="M166 392 L118 356 L180 426 Z"/>'
      + '<path d="M170 452 L126 428 L184 482 Z"/>'
      + '<path d="M344 330 L386 284 L328 368 Z"/><path d="M346 392 L394 356 L332 426 Z"/>'
      + '<path d="M342 452 L386 428 L328 482 Z"/>'
      + '</g>'
      + '<path d="M300 516 C368 538 424 588 442 650 L404 630 L420 664 L370 650 L356 676 L330 624 C314 586 304 550 300 516 Z"'
      + ' fill="' + KAIJU.dark + '" filter="url(#kidShadow)"/>';
  }

  function kaijuBody(sv) {
    return groundShadow()
      + limbs(KAIJU.skin)
      + '<path d="M162 404 L202 398 M310 398 L350 404" stroke="' + KAIJU.dark + '" stroke-width="7" stroke-linecap="round" opacity="0.7"/>'
      + '<g fill="' + KAIJU.spike + '">'
      + '<path d="M166 474 L158 502 L178 484 Z"/><path d="M184 478 L182 508 L196 486 Z"/><path d="M202 474 L206 500 L212 480 Z"/>'
      + '<path d="M346 474 L354 502 L334 484 Z"/><path d="M328 478 L330 508 L316 486 Z"/><path d="M310 474 L306 500 L300 480 Z"/>'
      + '</g>'
      + neck(sv, KAIJU.dark)
      + head(sv, KAIJU.skin)
      + '<path d="' + TORSO + '" fill="' + KAIJU.skin + '" filter="url(#kidShadow)"/>'
      + '<path d="M220 352 C240 344 272 344 292 352 L288 468 C268 478 244 478 224 468 Z" fill="' + KAIJU.belly + '"/>'
      + '<path d="M224 382 L290 382 M226 412 L288 412 M228 442 L286 442" stroke="' + KAIJU.spikeDark + '" stroke-width="6" fill="none" opacity="0.5"/>'
      + '<path d="' + LEG_L + '" fill="' + KAIJU.skin + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + KAIJU.skin + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_L + '" fill="' + KAIJU.dark + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + KAIJU.dark + '" filter="url(#kidShadow)"/>'
      + '<g fill="' + KAIJU.spike + '"><path d="M192 646 L190 668 L204 652 Z"/><path d="M216 648 L216 672 L228 654 Z"/>'
      + '<path d="M240 648 L244 670 L252 652 Z"/><path d="M320 646 L322 668 L308 652 Z"/>'
      + '<path d="M296 648 L296 672 L284 654 Z"/><path d="M272 648 L268 670 L260 652 Z"/></g>'
      /* mắt tự vẽ nhưng đúng tọa độ 224/288 × 210 → kính râm đeo là khớp */
      + '<ellipse cx="224" cy="210" rx="21" ry="15" fill="' + KAIJU.eye + '" transform="rotate(-10 224 210)"/>'
      + '<ellipse cx="288" cy="210" rx="21" ry="15" fill="' + KAIJU.eye + '" transform="rotate(10 288 210)"/>'
      + '<rect x="220" y="198" width="8" height="24" rx="4" fill="' + KAIJU.pupil + '" transform="rotate(-10 224 210)"/>'
      + '<rect x="284" y="198" width="8" height="24" rx="4" fill="' + KAIJU.pupil + '" transform="rotate(10 288 210)"/>'
      + '<path d="M198 182 Q224 166 250 182" stroke="' + KAIJU.dark + '" stroke-width="11" fill="none" stroke-linecap="round"/>'
      + '<path d="M262 182 Q288 166 314 182" stroke="' + KAIJU.dark + '" stroke-width="11" fill="none" stroke-linecap="round"/>'
      + '<circle cx="246" cy="240" r="5" fill="' + KAIJU.dark + '"/><circle cx="266" cy="240" r="5" fill="' + KAIJU.dark + '"/>'
      + '<path d="M212 258 Q256 292 300 258" stroke="' + KAIJU.mouth + '" stroke-width="8" fill="none" stroke-linecap="round"/>'
      + '<g fill="#FFFFFF"><path d="M228 268 L236 282 L244 268 Z"/><path d="M248 272 L256 288 L264 272 Z"/><path d="M268 268 L276 282 L284 268 Z"/></g>';
  }

  /* Kaiju không mặc gì → không có chi tiết nào phải vẽ đè lên áo quần. */
  function kaijuTop() {
    return '';
  }

  var GHO = {
    sheet: '#F3F7FF', mid: '#DFE7F7', edge: '#BFCDEA',
    eye: '#333A55', mouth: '#3A4160', glow: '#C9D8FF'
  };

  function ghostBack() {
    return '<ellipse cx="256" cy="430" rx="126" ry="174" fill="' + GHO.glow + '" opacity="0.2" filter="url(#kidBlur)"/>';
  }

  function ghostBody() {
    /* đầu/tay vẫn là khung người nhưng "da" đổi thành vải trắng → mũ đội đúng
     * chỗ; thân là tấm vải bay, không có chân nên cũng không có quần/giày. */
    var gsv = { light: GHO.sheet, dark: GHO.mid, shadow: GHO.edge, ear: GHO.mid };
    return '<ellipse cx="256" cy="676" rx="76" ry="13" fill="#000000" opacity="0.08" filter="url(#kidBlur)"/>'
      + limbs(GHO.sheet)
      + neck(gsv, GHO.mid)
      + head(gsv, GHO.sheet)
      + '<path d="M212 322 C234 308 278 308 300 322 C330 340 344 380 342 424 L338 548'
      + ' C337 570 320 578 306 568 L292 556 L272 582 C262 592 250 592 240 582 L220 556 L206 568'
      + ' C192 578 175 570 174 548 L170 424 C168 380 182 340 212 322 Z" fill="' + GHO.sheet + '" filter="url(#kidShadow)"/>'
      + '<path d="M186 424 C184 376 196 344 218 328" stroke="#FFFFFF" stroke-width="10" opacity="0.6" fill="none" stroke-linecap="round"/>'
      + '<ellipse cx="224" cy="208" rx="15" ry="22" fill="' + GHO.eye + '"/>'
      + '<ellipse cx="288" cy="208" rx="15" ry="22" fill="' + GHO.eye + '"/>'
      + '<ellipse cx="256" cy="262" rx="13" ry="17" fill="' + GHO.mouth + '"/>';
  }

  function ghostTop() {
    return '<g fill="' + GHO.sheet + '" opacity="0.8">'
      + '<circle cx="148" cy="300" r="11"/><circle cx="376" cy="252" r="8"/><circle cx="392" cy="466" r="13"/></g>';
  }

  /* Nhân vật sân khấu tự vẽ (hình gốc, không mô tả một người thật nào): áo
   * khoác đỏ, quần tối màu, giày trắng tất cao và một chiếc găng xanh. */
  var POP = {
    jacket: '#C6222B', jacketDark: '#8E151C', shirt: '#F4F6FA',
    pants: '#2B2E44', pantsDark: '#1A1D2E', sock: '#F4F6FA',
    shoe: '#F4F6FA', shoeDark: '#C7CEDC', gold: '#E8C25A', glove: '#2A6BD8'
  };

  function popstarBack() {
    return '';
  }

  function popstarBody(sv) {
    return groundShadow()
      + limbs(POP.jacket)
      + '<path d="M164 372 C161 404 163 436 169 458 M348 372 C351 404 349 436 343 458" stroke="' + POP.jacketDark + '" stroke-width="6" fill="none" opacity="0.5" stroke-linecap="round"/>'
      + neck(sv, POP.shirt)
      + head(sv, 'url(#kidSkin)')
      + '<path d="' + TORSO + '" fill="' + POP.jacket + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_L + '" fill="' + POP.pants + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + POP.pants + '" filter="url(#kidShadow)"/>'
      + '<path d="M200 502 L198 630 M312 502 L316 630" stroke="' + POP.pantsDark + '" stroke-width="7" fill="none" opacity="0.6"/>'
      + '<rect x="196" y="610" width="56" height="32" rx="11" fill="' + POP.sock + '"/>'
      + '<rect x="260" y="610" width="56" height="32" rx="11" fill="' + POP.sock + '"/>'
      + '<path d="' + FOOT_L + '" fill="' + POP.shoe + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + POP.shoe + '" filter="url(#kidShadow)"/>'
      + '<path d="M190 664 Q220 674 251 664" stroke="' + POP.shoeDark + '" stroke-width="6" stroke-linecap="round" fill="none"/>'
      + '<path d="M261 664 Q292 674 322 664" stroke="' + POP.shoeDark + '" stroke-width="6" stroke-linecap="round" fill="none"/>';
  }

  function popstarTop() {
    return '<g>'
      + '<path d="M238 320 L256 352 L274 320 Z" fill="' + POP.shirt + '"/>'
      + '<path d="M232 316 L256 366 L216 352 Z" fill="' + POP.jacketDark + '"/>'
      + '<path d="M280 316 L256 366 L296 352 Z" fill="' + POP.jacketDark + '"/>'
      + '<path d="M180 476 C212 492 300 492 332 476 L332 498 C300 512 212 512 180 498 Z" fill="' + POP.pantsDark + '" filter="url(#kidShadow)"/>'
      + '<rect x="242" y="478" width="28" height="20" rx="6" fill="' + POP.gold + '" stroke="' + POP.jacketDark + '" stroke-width="4"/>'
      + '<path d="M162 462 L202 456" stroke="' + POP.jacketDark + '" stroke-width="9" stroke-linecap="round"/>'
      + '<rect x="304" y="440" width="52" height="52" rx="24" fill="' + POP.glove + '" filter="url(#kidShadow)"/>'
      + '<path d="M310 452 L348 448" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="7" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ===================================================================== *
   *  THÂN CHỦ ĐỀ — 20 nhân vật mới (đặc biệt / nghề nghiệp / cổ tích / lễ hội)
   *
   *  Tất cả dựng trên ĐÚNG khung của body.html: đầu 179–333 × 91–301, mắt
   *  224/288 × 210, thân TORSO, chân LEG_L/R, bàn chân FOOT_L/R. Nhờ vậy mặt,
   *  tóc, mũ, kính, áo, váy, quần, giày, phụ kiện dùng chung một hệ toạ độ —
   *  đổi linh kiện chỉ đổi nét vẽ, không lệch và không xuyên hình.
   *
   *  Mỗi nhân vật tự vẽ sẵn bộ đồ (selfClothed) nhưng vẫn khai báo đủ `slots`
   *  trong BODIES để người chơi mặc thêm áo/quần/giày/mũ đè lên được, đúng
   *  cách Kamen Rider / Superman đang làm. Nhân vật không có da–tóc–quần áo
   *  (Robot, Người tuyết, Ma Halloween) khai báo slots hẹp theo cơ chế hiện tại.
   * ===================================================================== */

  /** Thân mặc đồ kín: tay → tay áo → cổ → đầu → thân → chân → giày. */
  function costumeFrame(sv, o) {
    return groundShadow()
      + limbs(o.arm)
      + (o.armDetail || '')
      + neck(sv, o.neck || o.torso)
      + head(sv, o.head || 'url(#kidSkin)')
      + '<path d="' + TORSO + '" fill="' + o.torso + '" filter="url(#kidShadow)"/>'
      + (o.torsoDetail || '')
      + '<path d="' + LEG_L + '" fill="' + o.leg + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + o.leg + '" filter="url(#kidShadow)"/>'
      + (o.legDetail || '')
      + '<path d="' + FOOT_L + '" fill="' + o.foot + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + o.foot + '" filter="url(#kidShadow)"/>'
      + (o.footDetail || '');
  }

  /** Thân mặc váy dài: chân vẽ TRƯỚC váy để chỉ lộ phần dưới gấu. */
  function gownFrame(sv, o) {
    return groundShadow()
      + limbs(o.arm)
      + (o.armDetail || '')
      + neck(sv, o.neck || o.dress)
      + head(sv, o.head || 'url(#kidSkin)')
      + (o.leg ? '<path d="' + LEG_L + '" fill="' + o.leg + '"/>' + '<path d="' + LEG_R + '" fill="' + o.leg + '"/>' : '')
      + '<path d="' + DRESS_BODY + '" fill="' + o.dress + '" filter="url(#kidShadow)"/>'
      + (o.dressDetail || '')
      + '<path d="' + FOOT_L + '" fill="' + o.foot + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + o.foot + '" filter="url(#kidShadow)"/>';
  }

  function belt(band, buckle, edge) {
    return '<path d="M180 474 C212 490 300 490 332 474 L332 502 C300 516 212 516 180 502 Z" fill="' + band + '" filter="url(#kidShadow)"/>'
      + '<rect x="238" y="478" width="36" height="26" rx="6" fill="' + buckle + '" stroke="' + (edge || buckle) + '" stroke-width="4"/>';
  }

  function bootShafts(color, trim) {
    return '<rect x="184" y="590" width="72" height="54" rx="12" fill="' + color + '"/>'
      + '<rect x="256" y="590" width="72" height="54" rx="12" fill="' + color + '"/>'
      + '<path d="M190 598 L250 598 M262 598 L322 598" stroke="' + trim + '" stroke-width="7" stroke-linecap="round"/>';
  }

  /* ---- 1. Phi hành gia ------------------------------------------------ */
  var AST = {
    suit: '#F2F5FA', suitDark: '#DCE5F1', trim: '#8FA6C4', visor: '#8FD3FF',
    pack: '#C7D2E3', packDark: '#93A2BA', boot: '#5D6B80', gold: '#F5C63C', red: '#E8453C'
  };

  function astronautBack() {
    return '<g filter="url(#kidShadow)">'
      + '<rect x="128" y="348" width="48" height="164" rx="23" fill="' + AST.pack + '" stroke="' + AST.packDark + '" stroke-width="5"/>'
      + '<rect x="336" y="348" width="48" height="164" rx="23" fill="' + AST.pack + '" stroke="' + AST.packDark + '" stroke-width="5"/>'
      + '</g>'
      + '<path d="M140 380 L164 380 M348 380 L372 380" stroke="' + AST.trim + '" stroke-width="7" stroke-linecap="round"/>';
  }

  function astronautBody(sv) {
    return costumeFrame(sv, {
      torso: AST.suit, arm: AST.suit, neck: AST.suitDark, leg: AST.suit, foot: AST.boot,
      armDetail: '<path d="M160 402 L206 396 M306 396 L352 402" stroke="' + AST.trim + '" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="150" y="446" width="58" height="44" rx="21" fill="' + AST.suitDark + '" stroke="' + AST.trim + '" stroke-width="4"/>'
        + '<rect x="304" y="446" width="58" height="44" rx="21" fill="' + AST.suitDark + '" stroke="' + AST.trim + '" stroke-width="4"/>',
      torsoDetail: '<path d="M198 332 C206 350 306 350 314 332" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="7" fill="none"/>'
        + '<rect x="222" y="352" width="68" height="54" rx="13" fill="' + AST.suitDark + '" stroke="' + AST.trim + '" stroke-width="5"/>'
        + '<circle cx="241" cy="370" r="8" fill="' + AST.red + '"/><circle cx="271" cy="370" r="8" fill="' + AST.gold + '"/>'
        + '<rect x="234" y="386" width="44" height="8" rx="4" fill="' + AST.trim + '"/>'
        + '<path d="M204 428 L308 428" stroke="' + AST.trim + '" stroke-width="6" stroke-linecap="round" opacity=".75"/>'
        + '<path d="M212 470 L300 470" stroke="' + AST.trim + '" stroke-width="6" stroke-linecap="round" opacity=".55"/>',
      legDetail: '<path d="M210 512 L206 592 M302 512 L306 592" stroke="' + AST.trim + '" stroke-width="7" opacity=".7"/>',
      footDetail: bootShafts(AST.boot, AST.trim)
        + '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="#00000022" stroke-width="5" fill="none"/>'
    });
  }

  function astronautTop() {
    return '<g>'
      + '<path d="M214 300 C232 328 280 328 298 300 L304 334 C280 358 232 358 208 334 Z" fill="' + AST.suitDark + '" stroke="' + AST.trim + '" stroke-width="5"/>'
      + '<ellipse cx="256" cy="192" rx="104" ry="119" fill="' + AST.visor + '" fill-opacity=".18" stroke="' + AST.trim + '" stroke-width="7"/>'
      + '<ellipse cx="256" cy="192" rx="96" ry="111" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="3"/>'
      + '<path d="M184 142 C200 106 224 88 248 82" stroke="#FFFFFF" stroke-opacity=".72" stroke-width="11" fill="none" stroke-linecap="round"/>'
      + '<path d="M320 250 C332 232 336 214 336 196" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="9" fill="none" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- 2. Ninja ------------------------------------------------------- */
  var NIN = { suit: '#2B3147', dark: '#1C2132', band: '#C2352F', gold: '#F5C63C', trim: '#8E98B5' };

  function ninjaBack() {
    return '<path d="M296 330 C346 342 368 394 360 450 L344 492 L326 462 L308 496 L300 434 C296 392 282 356 264 342 Z" fill="' + NIN.band + '" filter="url(#kidShadow)"/>'
      + '<path d="M306 362 C330 396 338 434 334 470" stroke="#8E2A25" stroke-width="7" fill="none" opacity=".6"/>';
  }

  function ninjaBody(sv) {
    return costumeFrame(sv, {
      torso: NIN.suit, arm: NIN.suit, neck: NIN.dark, leg: NIN.suit, foot: NIN.dark,
      armDetail: '<path d="M160 438 L204 432 M308 432 L352 438" stroke="' + NIN.trim + '" stroke-width="7" stroke-linecap="round" opacity=".7"/>'
        + '<rect x="152" y="446" width="54" height="46" rx="22" fill="' + NIN.dark + '"/>'
        + '<rect x="306" y="446" width="54" height="46" rx="22" fill="' + NIN.dark + '"/>',
      torsoDetail: '<path d="M212 330 L256 372 L300 330 L304 352 L256 398 L208 352 Z" fill="' + NIN.dark + '"/>'
        + belt(NIN.dark, NIN.gold, '#C99A10')
        + '<path d="M206 350 L198 456 M306 350 L314 456" stroke="' + NIN.dark + '" stroke-width="7" opacity=".85"/>',
      legDetail: '<path d="M200 516 L196 604 M312 516 L316 604" stroke="' + NIN.dark + '" stroke-width="8" opacity=".8"/>',
      footDetail: '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="' + NIN.band + '" stroke-width="5" fill="none"/>'
    });
  }

  function ninjaTop() {
    return '<g>'
      /* mũ trùm: vòng ngoài trừ khuôn mặt (evenodd) để mắt/tóc vẫn lộ đúng chỗ */
      + '<path fill-rule="evenodd" fill="' + NIN.suit + '" filter="url(#kidShadow)" d="'
      + 'M173 168 C173 112 211 85 256 85 C301 85 339 112 339 168 L339 216 C339 268 301 307 256 307 C211 307 173 268 173 216 Z '
      + 'M191 198 C191 170 218 152 256 152 C294 152 321 170 321 198 L321 216 C321 252 294 272 256 272 C218 272 191 252 191 216 Z"/>'
      /* khăn bịt mũi/miệng */
      + '<path d="M183 240 C200 264 226 276 256 276 C286 276 312 264 329 240 L333 272 C329 296 296 307 256 307 C216 307 183 296 179 272 Z" fill="' + NIN.suit + '"/>'
      + '<path d="M196 264 C218 280 240 286 256 286 C272 286 294 280 316 264" stroke="' + NIN.trim + '" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>'
      /* băng đô đỏ */
      + '<path d="M175 150 C210 132 302 132 337 150 L337 172 C302 154 210 154 175 172 Z" fill="' + NIN.band + '"/>'
      + '<path d="M256 142 L244 166 L268 164 Z" fill="' + NIN.gold + '"/>'
      + '</g>';
  }

  /* ---- 3. Robot thân thiện -------------------------------------------- */
  var ROB = {
    metal: '#C2D2E6', metalLight: '#E8F1FB', metalDark: '#8DA2BE', joint: '#6C7F99',
    panel: '#33415C', screen: '#9BE8FF', gold: '#F5C63C', red: '#E8453C'
  };

  function robotBody() {
    var rsv = { light: ROB.metalLight, dark: ROB.metal, shadow: ROB.metalDark, ear: ROB.metalDark };
    return groundShadow()
      + limbs(ROB.metal)
      + '<path d="M164 430 L200 424 M312 424 L348 430" stroke="' + ROB.metalDark + '" stroke-width="8" stroke-linecap="round"/>'
      + '<circle cx="188" cy="466" r="13" fill="' + ROB.joint + '"/><circle cx="324" cy="466" r="13" fill="' + ROB.joint + '"/>'
      + '<rect x="150" y="446" width="56" height="44" rx="16" fill="' + ROB.metalLight + '" stroke="' + ROB.metalDark + '" stroke-width="5"/>'
      + '<rect x="306" y="446" width="56" height="44" rx="16" fill="' + ROB.metalLight + '" stroke="' + ROB.metalDark + '" stroke-width="5"/>'
      + neck(rsv, ROB.metalDark)
      + head(rsv, ROB.metal)
      /* mặt kính LED: một visor tối, hai mắt phát sáng và loa miệng */
      + '<rect x="184" y="174" width="144" height="78" rx="28" fill="' + ROB.panel + '" stroke="' + ROB.metalDark + '" stroke-width="5"/>'
      + '<rect x="202" y="190" width="44" height="32" rx="11" fill="' + ROB.screen + '"/>'
      + '<rect x="266" y="190" width="44" height="32" rx="11" fill="' + ROB.screen + '"/>'
      + '<rect x="210" y="197" width="11" height="18" rx="5" fill="#FFFFFF" opacity=".6"/>'
      + '<rect x="274" y="197" width="11" height="18" rx="5" fill="#FFFFFF" opacity=".6"/>'
      + '<rect x="214" y="268" width="84" height="24" rx="9" fill="' + ROB.panel + '" stroke="' + ROB.metalDark + '" stroke-width="4"/>'
      + '<path d="M224 275 L238 275 M246 275 L260 275 M268 275 L282 275" stroke="' + ROB.screen + '" stroke-width="5" stroke-linecap="round"/>'
      + '<circle cx="176" cy="213" r="15" fill="' + ROB.metalDark + '"/><circle cx="336" cy="213" r="15" fill="' + ROB.metalDark + '"/>'
      + '<circle cx="176" cy="213" r="6" fill="' + ROB.metalLight + '"/><circle cx="336" cy="213" r="6" fill="' + ROB.metalLight + '"/>'
      + '<circle cx="196" cy="176" r="6" fill="' + ROB.metalDark + '"/><circle cx="316" cy="176" r="6" fill="' + ROB.metalDark + '"/>'
      + '<path d="' + TORSO + '" fill="' + ROB.metal + '" filter="url(#kidShadow)"/>'
      + '<rect x="216" y="344" width="80" height="62" rx="14" fill="' + ROB.panel + '" stroke="' + ROB.metalDark + '" stroke-width="5"/>'
      + '<path d="M226 384 L236 370 L246 384 L256 366 L266 384 L276 370 L286 384" stroke="' + ROB.screen + '" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<circle cx="232" cy="358" r="5" fill="' + ROB.gold + '"/><circle cx="280" cy="358" r="5" fill="' + ROB.red + '"/>'
      + '<path d="M206 430 L306 430" stroke="' + ROB.metalDark + '" stroke-width="6" stroke-linecap="round" opacity=".6"/>'
      + '<rect x="238" y="446" width="36" height="26" rx="7" fill="' + ROB.gold + '" stroke="' + ROB.metalDark + '" stroke-width="4"/>'
      + '<path d="' + LEG_L + '" fill="' + ROB.metal + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + ROB.metal + '" filter="url(#kidShadow)"/>'
      + '<circle cx="221" cy="558" r="14" fill="' + ROB.joint + '"/><circle cx="291" cy="558" r="14" fill="' + ROB.joint + '"/>'
      + '<path d="M196 520 L194 604 M316 520 L318 604" stroke="' + ROB.metalDark + '" stroke-width="7" opacity=".7"/>'
      + '<path d="' + FOOT_L + '" fill="' + ROB.metalDark + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + ROB.metalDark + '" filter="url(#kidShadow)"/>'
      + '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="#00000022" stroke-width="5" fill="none"/>';
  }

  function robotTop() {
    return '<g>'
      + '<path d="M256 90 L256 42" stroke="' + ROB.metalDark + '" stroke-width="8" stroke-linecap="round"/>'
      + '<circle cx="256" cy="38" r="14" fill="' + ROB.red + '" stroke="' + ROB.metalDark + '" stroke-width="4"/>'
      + '<circle cx="251" cy="33" r="4" fill="#FFFFFF" opacity=".6"/>'
      + '<rect x="164" y="188" width="16" height="46" rx="8" fill="' + ROB.metalDark + '"/>'
      + '<rect x="332" y="188" width="16" height="46" rx="8" fill="' + ROB.metalDark + '"/>'
      + '</g>';
  }

  /* ---- 4. Cướp biển --------------------------------------------------- */
  var PIR = {
    coat: '#8A3A2C', coatDark: '#5F2418', shirt: '#F4F6FA', pants: '#2E2E38',
    boot: '#3A2A22', gold: '#F5C63C', hat: '#2B2A33'
  };

  function pirateBody(sv) {
    return costumeFrame(sv, {
      torso: PIR.coat, arm: PIR.coat, neck: PIR.shirt, leg: PIR.pants, foot: PIR.boot,
      armDetail: '<path d="M158 434 L204 428 M308 428 L354 434" stroke="' + PIR.coatDark + '" stroke-width="8" stroke-linecap="round"/>'
        + '<rect x="150" y="444" width="58" height="46" rx="20" fill="' + PIR.coatDark + '"/>'
        + '<rect x="304" y="444" width="58" height="46" rx="20" fill="' + PIR.coatDark + '"/>'
        + '<path d="M158 454 L200 448 M312 448 L354 454" stroke="' + PIR.gold + '" stroke-width="5" stroke-linecap="round"/>',
      torsoDetail: '<path d="M212 326 C232 352 280 352 300 326 L306 352 L256 396 L206 352 Z" fill="' + PIR.shirt + '"/>'
        + '<path d="M256 352 L256 470" stroke="' + PIR.coatDark + '" stroke-width="6" opacity=".7"/>'
        + '<g fill="' + PIR.gold + '"><circle cx="232" cy="382" r="6"/><circle cx="232" cy="416" r="6"/><circle cx="232" cy="450" r="6"/></g>'
        + belt(PIR.coatDark, PIR.gold, '#C99A10')
        + '<path d="M204 344 L196 460 M308 344 L316 460" stroke="' + PIR.coatDark + '" stroke-width="7" opacity=".55"/>',
      footDetail: bootShafts(PIR.boot, PIR.gold)
        + '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="' + PIR.gold + '" stroke-width="4" fill="none" opacity=".45"/>'
    });
  }

  function pirateTop() {
    return '<g>'
      /* mũ ba sừng */
      + '<path d="M126 158 C150 108 188 84 256 84 C324 84 362 108 386 158 C356 138 316 128 256 128 C196 128 156 138 126 158 Z" fill="' + PIR.hat + '" filter="url(#kidShadow)"/>'
      + '<path d="M126 158 C176 132 336 132 386 158 C382 170 372 176 356 176 C320 166 296 162 256 162 C216 162 192 166 156 176 C140 176 130 170 126 158 Z" fill="' + PIR.hat + '"/>'
      + '<path d="M140 152 C186 130 326 130 372 152" stroke="' + PIR.gold + '" stroke-width="6" fill="none" opacity=".9"/>'
      + '<circle cx="256" cy="116" r="13" fill="#F4F6FA"/>'
      + '<circle cx="251" cy="112" r="2.8" fill="' + PIR.hat + '"/><circle cx="261" cy="112" r="2.8" fill="' + PIR.hat + '"/>'
      + '<path d="M251 122 L261 122" stroke="' + PIR.hat + '" stroke-width="2.8" stroke-linecap="round"/>'
      /* băng bịt mắt + khuyên tai */
      + '<path d="M198 202 L340 180" stroke="' + PIR.hat + '" stroke-width="6"/>'
      + '<ellipse cx="224" cy="210" rx="27" ry="30" fill="' + PIR.hat + '"/>'
      + '<path d="M208 198 C214 192 226 190 236 195" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="4" fill="none" stroke-linecap="round"/>'
      + '<circle cx="338" cy="242" r="9" fill="none" stroke="' + PIR.gold + '" stroke-width="5"/>'
      + '</g>';
  }

  /* ---- 5. Ma cà rồng -------------------------------------------------- */
  var VAM = {
    cape: '#2A1B3D', capeIn: '#5B2140', suit: '#24202E', suitDark: '#171420',
    shirt: '#F4F6FA', red: '#B3243C', gold: '#F5C63C', boot: '#171420'
  };

  function vampireBack() {
    return '<path d="M206 322 C238 344 274 344 306 322 L366 430 L392 622 C332 656 180 656 120 622 L146 430 Z" fill="' + VAM.cape + '" filter="url(#kidShadow)"/>'
      + '<path d="M256 344 L256 640" stroke="' + VAM.capeIn + '" stroke-width="10" fill="none" opacity=".6"/>'
      + '<path d="M198 356 L164 614 M314 356 L348 614" stroke="' + VAM.capeIn + '" stroke-width="9" fill="none" opacity=".45"/>'
      + '<path d="M120 622 C180 650 332 650 392 622" stroke="' + VAM.capeIn + '" stroke-width="9" fill="none" opacity=".6"/>';
  }

  function vampireBody(sv) {
    return costumeFrame(sv, {
      torso: VAM.suit, arm: VAM.suit, neck: VAM.shirt, leg: VAM.suitDark, foot: VAM.boot,
      armDetail: '<path d="M160 430 L204 424 M308 424 L352 430" stroke="' + VAM.red + '" stroke-width="6" stroke-linecap="round" opacity=".8"/>'
        + '<rect x="152" y="446" width="54" height="44" rx="20" fill="' + VAM.shirt + '"/>'
        + '<rect x="306" y="446" width="54" height="44" rx="20" fill="' + VAM.shirt + '"/>',
      torsoDetail: '<path d="M214 328 L256 392 L298 328 L304 352 L256 424 L208 352 Z" fill="' + VAM.shirt + '"/>'
        + '<path d="M226 330 L256 380 L286 330" fill="' + VAM.red + '" opacity=".92"/>'
        + '<path d="M230 364 C244 380 268 380 282 364" stroke="' + VAM.suitDark + '" stroke-width="6" fill="none" opacity=".8"/>'
        + '<g fill="' + VAM.gold + '"><circle cx="256" cy="410" r="5"/><circle cx="256" cy="442" r="5"/><circle cx="256" cy="474" r="5"/></g>'
        + belt(VAM.suitDark, VAM.gold, '#C99A10'),
      legDetail: '<rect x="188" y="590" width="68" height="48" rx="11" fill="' + VAM.boot + '"/>'
        + '<rect x="256" y="590" width="68" height="48" rx="11" fill="' + VAM.boot + '"/>'
        + '<path d="M194 598 L250 598 M262 598 L318 598" stroke="' + VAM.red + '" stroke-width="6" stroke-linecap="round"/>'
    });
  }

  function vampireTop() {
    return '<g>'
      /* cổ áo dựng */
      + '<path d="M196 300 L214 356 L246 330 Z" fill="' + VAM.red + '"/>'
      + '<path d="M316 300 L298 356 L266 330 Z" fill="' + VAM.red + '"/>'
      + '<path d="M196 300 L214 356 L246 330 Z" fill="#000000" opacity=".18"/>'
      + '<path d="M316 300 L298 356 L266 330 Z" fill="#000000" opacity=".18"/>'
      /* huân chương */
      + '<circle cx="256" cy="352" r="14" fill="' + VAM.gold + '" stroke="' + VAM.red + '" stroke-width="5"/>'
      + '<circle cx="256" cy="352" r="5" fill="' + VAM.red + '"/>'
      /* nanh */
      + '<path d="M234 258 L240 278 L248 258 Z" fill="#FFFFFF"/>'
      + '<path d="M264 258 L272 278 L278 258 Z" fill="#FFFFFF"/>'
      + '</g>';
  }

  /* ---- 6. Bác sĩ ------------------------------------------------------ */
  var DOC = {
    coat: '#F7FAFE', coatDark: '#D9E4F2', scrub: '#7FC8DA', scrubDark: '#4FA3B8',
    pants: '#6C7A8C', shoe: '#FFFFFF', ink: '#3E4C63'
  };

  function doctorBody(sv) {
    return costumeFrame(sv, {
      torso: DOC.coat, arm: DOC.coat, neck: DOC.scrub, leg: DOC.pants, foot: DOC.shoe,
      armDetail: '<path d="M160 414 L204 408 M308 408 L352 414" stroke="' + DOC.coatDark + '" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="152" y="448" width="54" height="42" rx="19" fill="' + DOC.coat + '" stroke="' + DOC.coatDark + '" stroke-width="4"/>'
        + '<rect x="306" y="448" width="54" height="42" rx="19" fill="' + DOC.coat + '" stroke="' + DOC.coatDark + '" stroke-width="4"/>',
      torsoDetail: '<path d="M214 326 L256 404 L298 326 L304 348 L256 442 L208 348 Z" fill="' + DOC.scrub + '"/>'
        + '<path d="M232 328 L256 372 L280 328" fill="' + DOC.scrubDark + '" opacity=".55"/>'
        + '<path d="M206 340 L198 470 M306 340 L314 470" stroke="' + DOC.coatDark + '" stroke-width="6" fill="none" opacity=".8"/>'
        + '<path d="M218 470 C218 462 232 460 238 466 L238 500 L218 500 Z" fill="' + DOC.coatDark + '" opacity=".5"/>'
        + '<g fill="' + DOC.ink + '"><circle cx="238" cy="392" r="6"/><circle cx="238" cy="428" r="6"/><circle cx="238" cy="464" r="6"/></g>'
        + '<rect x="274" y="404" width="34" height="24" rx="5" fill="#FFFFFF" stroke="' + DOC.coatDark + '" stroke-width="3"/>'
        + '<path d="M280 412 L300 412 M280 420 L296 420" stroke="' + DOC.ink + '" stroke-width="3"/>'
    });
  }

  function doctorTop() {
    return '<g>'
      /* ống nghe */
      + '<path d="M210 326 C204 372 226 404 244 424 M302 326 C308 372 286 404 268 424" stroke="#4A5568" stroke-width="8" fill="none" stroke-linecap="round"/>'
      + '<path d="M210 326 C204 372 226 404 244 424" stroke="#8FA0B8" stroke-width="3" fill="none" stroke-linecap="round"/>'
      + '<circle cx="256" cy="440" r="17" fill="#C9D2DE" stroke="#4A5568" stroke-width="6"/>'
      + '<circle cx="256" cy="440" r="7" fill="#8FA0B8"/>'
      + '</g>';
  }

  /* ---- 7. Lính cứu hỏa ------------------------------------------------ */
  var FIRE = {
    coat: '#2E4057', coatDark: '#1E2C3E', stripe: '#F5D24A', silver: '#DCE3EE',
    boot: '#1B1E26', helmet: '#E8453C', helmetDark: '#B83029'
  };

  function firefighterBody(sv) {
    return costumeFrame(sv, {
      torso: FIRE.coat, arm: FIRE.coat, neck: FIRE.coatDark, leg: FIRE.coat, foot: FIRE.boot,
      armDetail: '<path d="M156 442 L204 436 M308 436 L356 442" stroke="' + FIRE.stripe + '" stroke-width="12" stroke-linecap="round"/>'
        + '<rect x="150" y="462" width="58" height="44" rx="19" fill="' + FIRE.coatDark + '"/>'
        + '<rect x="304" y="462" width="58" height="44" rx="19" fill="' + FIRE.coatDark + '"/>'
        + '<path d="M158 470 L200 466 M312 466 L354 470" stroke="' + FIRE.silver + '" stroke-width="5" stroke-linecap="round"/>',
      torsoDetail: '<path d="M256 326 L256 500" stroke="' + FIRE.coatDark + '" stroke-width="8" opacity=".85"/>'
        + '<path d="M196 392 L316 392" stroke="' + FIRE.stripe + '" stroke-width="14"/>'
        + '<path d="M196 418 L316 418" stroke="' + FIRE.silver + '" stroke-width="8"/>'
        + '<path d="M188 448 L324 448" stroke="' + FIRE.stripe + '" stroke-width="14"/>'
        + '<rect x="222" y="340" width="68" height="34" rx="8" fill="' + FIRE.coatDark + '" stroke="' + FIRE.silver + '" stroke-width="4"/>'
        + '<path d="M232 352 L250 352 M262 352 L280 352" stroke="' + FIRE.stripe + '" stroke-width="4"/>',
      legDetail: '<path d="M196 520 L192 618 M316 520 L320 618" stroke="' + FIRE.stripe + '" stroke-width="9" opacity=".9"/>'
        + '<rect x="184" y="592" width="72" height="50" rx="11" fill="' + FIRE.boot + '"/>'
        + '<rect x="256" y="592" width="72" height="50" rx="11" fill="' + FIRE.boot + '"/>'
        + '<path d="M190 600 L250 600 M262 600 L322 600" stroke="' + FIRE.silver + '" stroke-width="6" stroke-linecap="round"/>'
    });
  }

  function firefighterTop() {
    return '<g>'
      + '<path d="M170 158 C170 104 208 74 256 74 C304 74 342 104 342 158 Z" fill="' + FIRE.helmet + '" filter="url(#kidShadow)"/>'
      + '<path d="M186 112 C206 90 230 80 252 78" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="10" fill="none" stroke-linecap="round"/>'
      + '<path d="M146 152 C206 174 306 174 366 152 L356 178 C300 198 212 198 156 178 Z" fill="' + FIRE.helmetDark + '"/>'
      + '<path d="M160 162 C212 180 300 180 352 162" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="5" fill="none"/>'
      + '<rect x="236" y="110" width="40" height="40" rx="9" fill="' + FIRE.silver + '" stroke="' + FIRE.helmetDark + '" stroke-width="4"/>'
      + '<path d="M256 118 L256 142 M246 130 L266 130" stroke="' + FIRE.helmet + '" stroke-width="6" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- 8. Giáo viên ---------------------------------------------------- */
  var TEACH = {
    cardigan: '#4C8C7A', cardiganDark: '#33655A', blouse: '#F7FAFE',
    pants: '#6B4F3A', shoe: '#4A3428', ink: '#2E3B4A', lace: '#E8453C'
  };

  function teacherBody(sv) {
    return costumeFrame(sv, {
      torso: TEACH.cardigan, arm: TEACH.cardigan, neck: TEACH.blouse, leg: TEACH.pants, foot: TEACH.shoe,
      armDetail: '<path d="M158 424 L204 418 M308 418 L354 424" stroke="' + TEACH.cardiganDark + '" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="152" y="448" width="54" height="42" rx="19" fill="' + TEACH.cardigan + '" stroke="' + TEACH.cardiganDark + '" stroke-width="4"/>'
        + '<rect x="306" y="448" width="54" height="42" rx="19" fill="' + TEACH.cardigan + '" stroke="' + TEACH.cardiganDark + '" stroke-width="4"/>',
      torsoDetail: '<path d="M214 328 L256 400 L298 328 L302 350 L256 434 L210 350 Z" fill="' + TEACH.blouse + '"/>'
        + '<path d="M226 330 L256 376 L286 330" fill="' + TEACH.blouse + '" stroke="' + TEACH.cardiganDark + '" stroke-width="4"/>'
        + '<path d="M206 340 L198 470 M306 340 L314 470" stroke="' + TEACH.cardiganDark + '" stroke-width="6" fill="none" opacity=".85"/>'
        + '<rect x="268" y="420" width="38" height="30" rx="6" fill="#FFFFFF" stroke="' + TEACH.cardiganDark + '" stroke-width="4"/>'
        + '<path d="M274 430 L300 430 M274 440 L294 440" stroke="' + TEACH.ink + '" stroke-width="3"/>'
    });
  }

  function teacherTop() {
    return '<g>'
      + '<path d="M214 322 L246 402 M298 322 L266 402" stroke="' + TEACH.lace + '" stroke-width="7" fill="none" stroke-linecap="round"/>'
      + '<rect x="232" y="400" width="48" height="62" rx="7" fill="#FFFFFF" stroke="' + TEACH.cardiganDark + '" stroke-width="4"/>'
      + '<rect x="238" y="408" width="36" height="26" rx="4" fill="#DDEBFF"/>'
      + '<circle cx="256" cy="415" r="7" fill="' + TEACH.ink + '"/>'
      + '<path d="M246 429 C250 421 262 421 266 429 Z" fill="' + TEACH.ink + '"/>'
      + '<path d="M240 444 L272 444 M240 452 L262 452" stroke="' + TEACH.cardiganDark + '" stroke-width="3"/>'
      + '<path d="M300 414 L300 436" stroke="' + TEACH.lace + '" stroke-width="6" stroke-linecap="round"/>'
      + '<circle cx="300" cy="412" r="6" fill="' + TEACH.lace + '"/>'
      + '</g>';
  }

  /* ---- 9. Cảnh sát ---------------------------------------------------- */
  var POL = {
    jacket: '#2F3E63', jacketDark: '#1E2A45', shirt: '#9CC3E8', boot: '#171A22',
    gold: '#F5C63C', silver: '#D7DEE9'
  };

  function policeBody(sv) {
    return costumeFrame(sv, {
      torso: POL.jacket, arm: POL.jacket, neck: POL.shirt, leg: POL.jacket, foot: POL.boot,
      armDetail: '<path d="M160 424 L204 418 M308 418 L352 424" stroke="' + POL.jacketDark + '" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="150" y="446" width="58" height="44" rx="20" fill="' + POL.jacketDark + '"/>'
        + '<rect x="304" y="446" width="58" height="44" rx="20" fill="' + POL.jacketDark + '"/>',
      torsoDetail: '<path d="M214 328 L256 392 L298 328 L304 350 L256 426 L208 350 Z" fill="' + POL.shirt + '"/>'
        + '<path d="M252 330 L260 330 L266 470 L256 480 L246 470 Z" fill="' + POL.jacketDark + '" opacity=".85"/>'
        + '<circle cx="218" cy="360" r="13" fill="' + POL.gold + '" stroke="#C99A10" stroke-width="3"/>'
        + '<path d="M218 353 L221 361 L229 361 L223 366 L225 374 L218 369 L211 374 L213 366 L207 361 L215 361 Z" fill="#FFFFFF"/>'
        + '<rect x="286" y="352" width="34" height="24" rx="6" fill="' + POL.jacketDark + '" stroke="' + POL.silver + '" stroke-width="3"/>'
        + belt(POL.boot, POL.gold, '#C99A10')
        + '<rect x="196" y="484" width="26" height="30" rx="6" fill="' + POL.jacketDark + '" stroke="' + POL.silver + '" stroke-width="3"/>'
        + '<rect x="290" y="484" width="26" height="30" rx="6" fill="' + POL.jacketDark + '" stroke="' + POL.silver + '" stroke-width="3"/>',
      legDetail: '<path d="M198 520 L194 618 M314 520 L318 618" stroke="' + POL.shirt + '" stroke-width="7" opacity=".8"/>',
      footDetail: bootShafts(POL.boot, POL.silver)
    });
  }

  function policeTop() {
    return '<g>'
      + '<path d="M172 156 C172 106 208 78 256 78 C304 78 340 106 340 156 Z" fill="' + POL.jacket + '" filter="url(#kidShadow)"/>'
      + '<path d="M188 116 C208 94 232 84 254 82" stroke="#FFFFFF" stroke-opacity=".2" stroke-width="10" fill="none" stroke-linecap="round"/>'
      + '<path d="M166 148 C210 168 302 168 346 148 L338 170 C296 190 216 190 174 170 Z" fill="' + POL.boot + '"/>'
      + '<path d="M176 156 C216 172 296 172 336 156" stroke="' + POL.gold + '" stroke-width="7" fill="none"/>'
      + '<circle cx="256" cy="110" r="15" fill="' + POL.gold + '" stroke="#C99A10" stroke-width="4"/>'
      + '<path d="M256 101 L259 108 L267 108 L261 113 L263 121 L256 116 L249 121 L251 113 L245 108 L253 108 Z" fill="#FFFFFF"/>'
      + '<rect x="300" y="318" width="22" height="38" rx="6" fill="' + POL.boot + '" stroke="' + POL.silver + '" stroke-width="3"/>'
      + '<path d="M311 316 L311 302" stroke="' + POL.silver + '" stroke-width="5" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- 10. Đầu bếp ---------------------------------------------------- */
  var CHEF = {
    coat: '#F7FAFE', coatDark: '#DCE5F1', pants: '#33333F', shoe: '#1B1E26',
    scarf: '#E8453C', button: '#8FA0B8'
  };

  function chefBody(sv) {
    return costumeFrame(sv, {
      torso: CHEF.coat, arm: CHEF.coat, neck: CHEF.coatDark, leg: CHEF.pants, foot: CHEF.shoe,
      armDetail: '<path d="M160 416 L204 410 M308 410 L352 416" stroke="' + CHEF.coatDark + '" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="152" y="448" width="54" height="42" rx="19" fill="' + CHEF.coat + '" stroke="' + CHEF.coatDark + '" stroke-width="4"/>'
        + '<rect x="306" y="448" width="54" height="42" rx="19" fill="' + CHEF.coat + '" stroke="' + CHEF.coatDark + '" stroke-width="4"/>',
      torsoDetail: '<path d="M214 328 L256 366 L298 328 L302 350 L256 400 L210 350 Z" fill="' + CHEF.scarf + '"/>'
        + '<path d="M206 340 L198 472 M306 340 L314 472" stroke="' + CHEF.coatDark + '" stroke-width="6" fill="none"/>'
        + '<g fill="' + CHEF.button + '"><circle cx="230" cy="372" r="6"/><circle cx="282" cy="372" r="6"/>'
        + '<circle cx="230" cy="408" r="6"/><circle cx="282" cy="408" r="6"/>'
        + '<circle cx="230" cy="444" r="6"/><circle cx="282" cy="444" r="6"/></g>'
        + '<rect x="206" y="462" width="100" height="26" rx="8" fill="' + CHEF.coatDark + '" opacity=".45"/>'
    });
  }

  function chefTop() {
    return '<g>'
      + '<path d="M186 148 C164 138 162 108 182 96 C180 72 206 58 226 68 C236 46 276 46 286 68 C308 58 332 72 330 96 C350 108 348 138 326 148 Z" fill="#FFFFFF" stroke="' + CHEF.coatDark + '" stroke-width="5"/>'
      + '<path d="M196 128 C186 118 188 104 200 100" stroke="' + CHEF.coatDark + '" stroke-width="4" fill="none" opacity=".6"/>'
      + '<path d="M316 128 C326 118 324 104 312 100" stroke="' + CHEF.coatDark + '" stroke-width="4" fill="none" opacity=".6"/>'
      + '<rect x="182" y="140" width="148" height="30" rx="10" fill="#FFFFFF" stroke="' + CHEF.coatDark + '" stroke-width="5"/>'
      + '<path d="M196 152 L316 152" stroke="' + CHEF.coatDark + '" stroke-width="3" opacity=".5"/>'
      + '</g>';
  }

  /* ---- 11. Phi công --------------------------------------------------- */
  var PIL = {
    jacket: '#25324F', jacketDark: '#16203A', shirt: '#F4F6FA', tie: '#1B1E26',
    boot: '#1B1E26', gold: '#F5C63C', silver: '#D7DEE9'
  };

  function pilotBody(sv) {
    return costumeFrame(sv, {
      torso: PIL.jacket, arm: PIL.jacket, neck: PIL.shirt, leg: PIL.jacket, foot: PIL.boot,
      armDetail: '<g fill="' + PIL.gold + '"><rect x="158" y="416" width="46" height="7" rx="3"/><rect x="158" y="428" width="46" height="7" rx="3"/><rect x="158" y="440" width="46" height="7" rx="3"/><rect x="158" y="452" width="46" height="7" rx="3"/></g>'
        + '<g fill="' + PIL.gold + '"><rect x="308" y="416" width="46" height="7" rx="3"/><rect x="308" y="428" width="46" height="7" rx="3"/><rect x="308" y="440" width="46" height="7" rx="3"/><rect x="308" y="452" width="46" height="7" rx="3"/></g>',
      torsoDetail: '<path d="M214 328 L256 396 L298 328 L304 350 L256 430 L208 350 Z" fill="' + PIL.shirt + '"/>'
        + '<path d="M248 330 L256 344 L264 330 L268 348 L256 470 L244 348 Z" fill="' + PIL.tie + '"/>'
        + '<path d="M256 326 L256 500" stroke="' + PIL.jacketDark + '" stroke-width="7" opacity=".7"/>'
        + '<g fill="' + PIL.gold + '"><circle cx="256" cy="392" r="5"/><circle cx="256" cy="428" r="5"/><circle cx="256" cy="464" r="5"/></g>'
        + belt(PIL.boot, PIL.gold, '#C99A10'),
      footDetail: bootShafts(PIL.boot, PIL.silver)
    });
  }

  function pilotTop() {
    return '<g>'
      + '<rect x="182" y="320" width="52" height="20" rx="9" fill="' + PIL.gold + '" stroke="' + PIL.jacketDark + '" stroke-width="3"/>'
      + '<rect x="278" y="320" width="52" height="20" rx="9" fill="' + PIL.gold + '" stroke="' + PIL.jacketDark + '" stroke-width="3"/>'
      + '<path d="M192 330 L224 330 M288 330 L320 330" stroke="' + PIL.jacketDark + '" stroke-width="4"/>'
      + '<path d="M174 158 C174 106 210 78 256 78 C302 78 338 106 338 158 Z" fill="' + PIL.jacket + '" filter="url(#kidShadow)"/>'
      + '<path d="M188 118 C208 94 232 84 254 82" stroke="#FFFFFF" stroke-opacity=".18" stroke-width="9" fill="none" stroke-linecap="round"/>'
      + '<path d="M172 150 C214 170 298 170 340 150 L332 170 C294 190 218 190 180 170 Z" fill="' + PIL.boot + '"/>'
      + '<path d="M182 156 C220 172 292 172 330 156" stroke="' + PIL.gold + '" stroke-width="6" fill="none"/>'
      + '<path d="M256 100 C238 100 226 110 226 122 C226 132 236 140 256 140 C276 140 286 132 286 122 C286 110 274 100 256 100 Z" fill="' + PIL.gold + '"/>'
      + '<path d="M226 122 L196 112 L214 128 L196 138 L226 130 Z" fill="' + PIL.gold + '"/>'
      + '<path d="M286 122 L316 112 L298 128 L316 138 L286 130 Z" fill="' + PIL.gold + '"/>'
      + '</g>';
  }

  /* ---- 12. Hoàng tử --------------------------------------------------- */
  var PRIN = {
    coat: '#2A5FC1', coatDark: '#1E4694', trim: '#F5C63C', trimDark: '#C99A10',
    sash: '#F4F6FA', boot: '#1B1E26', red: '#D6322E'
  };

  function princeBody(sv) {
    return costumeFrame(sv, {
      torso: PRIN.coat, arm: PRIN.coat, neck: PRIN.sash, leg: PRIN.sash, foot: PRIN.boot,
      armDetail: '<path d="M158 428 L204 422 M308 422 L354 428" stroke="' + PRIN.trim + '" stroke-width="8" stroke-linecap="round"/>'
        + '<rect x="152" y="446" width="54" height="44" rx="20" fill="' + PRIN.coatDark + '"/>'
        + '<rect x="306" y="446" width="54" height="44" rx="20" fill="' + PRIN.coatDark + '"/>'
        + '<path d="M158 456 L200 450 M312 450 L354 456" stroke="' + PRIN.trim + '" stroke-width="5" stroke-linecap="round"/>',
      torsoDetail: '<path d="M256 326 L256 500" stroke="' + PRIN.coatDark + '" stroke-width="7" opacity=".8"/>'
        + '<path d="M212 330 L256 372 L300 330" stroke="' + PRIN.trim + '" stroke-width="8" fill="none" stroke-linejoin="round"/>'
        + '<path d="M198 332 L150 486 L194 500 L224 356 Z" fill="' + PRIN.sash + '" opacity=".95"/>'
        + '<path d="M198 332 L150 486" stroke="' + PRIN.trim + '" stroke-width="6" fill="none"/>'
        + '<g fill="' + PRIN.trim + '"><circle cx="234" cy="398" r="6"/><circle cx="234" cy="434" r="6"/><circle cx="234" cy="470" r="6"/></g>'
        + belt(PRIN.trim, PRIN.red, PRIN.trimDark)
        + '<circle cx="256" cy="490" r="16" fill="' + PRIN.trim + '" stroke="' + PRIN.trimDark + '" stroke-width="4"/>'
        + '<path d="M256 480 L259 487 L267 487 L261 492 L263 500 L256 495 L249 500 L251 492 L245 487 L253 487 Z" fill="' + PRIN.red + '"/>',
      legDetail: '<rect x="188" y="590" width="68" height="48" rx="11" fill="' + PRIN.boot + '"/>'
        + '<rect x="256" y="590" width="68" height="48" rx="11" fill="' + PRIN.boot + '"/>'
        + '<path d="M194 598 L250 598 M262 598 L318 598" stroke="' + PRIN.trim + '" stroke-width="6" stroke-linecap="round"/>'
    });
  }

  function princeTop() {
    return '<g>'
      + '<path d="M196 116 L202 66 L228 92 L256 50 L284 92 L310 66 L316 116 Z" fill="' + PRIN.trim + '" stroke="' + PRIN.trimDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<rect x="194" y="112" width="124" height="14" rx="7" fill="' + PRIN.trimDark + '"/>'
      + '<circle cx="256" cy="86" r="7" fill="' + PRIN.red + '"/>'
      + '<circle cx="220" cy="100" r="5" fill="#3D7BD1"/>'
      + '<circle cx="292" cy="100" r="5" fill="#3D7BD1"/>'
      + '<path d="M178 322 C196 318 212 326 216 340 C198 344 182 338 178 322 Z" fill="' + PRIN.trim + '"/>'
      + '<path d="M334 322 C316 318 300 326 296 340 C314 344 330 338 334 322 Z" fill="' + PRIN.trim + '"/>'
      + '</g>';
  }

  /* ---- 13. Công chúa -------------------------------------------------- */
  var PRINC = {
    gown: '#F07CA8', gownDark: '#D6558A', trim: '#F5C63C', trimDark: '#C99A10',
    pearl: '#FFFFFF', shoe: '#F07CA8', tight: '#FBE4EC'
  };

  function princessBody(sv) {
    return gownFrame(sv, {
      arm: 'url(#kidSkin)', dress: PRINC.gown, leg: PRINC.tight, foot: PRINC.shoe,
      armDetail: '<rect x="158" y="348" width="54" height="46" rx="22" fill="' + PRINC.gown + '" stroke="' + PRINC.gownDark + '" stroke-width="4"/>'
        + '<rect x="300" y="348" width="54" height="46" rx="22" fill="' + PRINC.gown + '" stroke="' + PRINC.gownDark + '" stroke-width="4"/>',
      dressDetail: '<path d="M172 452 C210 470 302 470 340 452" stroke="' + PRINC.trim + '" stroke-width="9" fill="none"/>'
        + '<path d="M163 540 C210 556 302 556 349 540" stroke="' + PRINC.gownDark + '" stroke-width="7" fill="none" opacity=".55"/>'
        + '<path d="M186 596 C220 612 292 612 326 596" stroke="' + PRINC.trim + '" stroke-width="7" fill="none" opacity=".8"/>'
        + '<path d="M226 320 C236 342 276 342 286 320" stroke="' + PRINC.trim + '" stroke-width="6" fill="none"/>'
        + '<g fill="' + PRINC.trim + '"><circle cx="214" cy="380" r="5"/><circle cx="214" cy="412" r="5"/></g>'
    });
  }

  function princessTop() {
    return '<g>'
      + '<path d="M206 108 L214 70 L232 92 L256 56 L280 92 L298 70 L306 108 Z" fill="' + PRINC.trim + '" stroke="' + PRINC.trimDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<circle cx="256" cy="86" r="6" fill="#FFFFFF"/>'
      + '<circle cx="222" cy="98" r="5" fill="#FFFFFF"/>'
      + '<circle cx="290" cy="98" r="5" fill="#FFFFFF"/>'
      + '<path d="M218 322 C234 344 278 344 294 322" stroke="' + PRINC.pearl + '" stroke-width="7" fill="none" stroke-linecap="round"/>'
      + '<g fill="' + PRINC.pearl + '"><circle cx="230" cy="332" r="5"/><circle cx="242" cy="338" r="5"/><circle cx="256" cy="340" r="6"/><circle cx="270" cy="338" r="5"/><circle cx="282" cy="332" r="5"/></g>'
      + '</g>';
  }

  /* ---- 14. Hiệp sĩ ---------------------------------------------------- */
  var KNI = {
    steel: '#C9D2DE', steelLight: '#E8EEF7', steelDark: '#8A97AB', steelDeep: '#5C687C',
    gold: '#F5C63C', cloth: '#B3243C', plume: '#D6322E'
  };

  function knightBack() {
    return '<g filter="url(#kidShadow)">'
      + '<path d="M136 356 C104 400 100 470 122 520 C150 538 186 538 206 526 C186 476 186 404 206 366 Z" fill="' + KNI.cloth + '" stroke="' + KNI.gold + '" stroke-width="6"/>'
      + '<path d="M152 392 C136 428 136 482 152 512" stroke="' + KNI.steelDark + '" stroke-width="6" fill="none" opacity=".7"/>'
      + '</g>';
  }

  function knightBody(sv) {
    return costumeFrame(sv, {
      torso: KNI.steel, arm: KNI.steel, neck: KNI.steelDark, leg: KNI.steel, foot: KNI.steelDeep,
      armDetail: '<circle cx="182" cy="366" r="26" fill="' + KNI.steelLight + '" stroke="' + KNI.steelDark + '" stroke-width="6"/>'
        + '<circle cx="330" cy="366" r="26" fill="' + KNI.steelLight + '" stroke="' + KNI.steelDark + '" stroke-width="6"/>'
        + '<rect x="150" y="444" width="58" height="48" rx="22" fill="' + KNI.steelDark + '"/>'
        + '<rect x="304" y="444" width="58" height="48" rx="22" fill="' + KNI.steelDark + '"/>'
        + '<path d="M160 452 L202 446 M310 446 L352 452" stroke="' + KNI.steelLight + '" stroke-width="5" stroke-linecap="round"/>',
      torsoDetail: '<path d="M256 326 L256 500" stroke="' + KNI.steelDark + '" stroke-width="7" opacity=".8"/>'
        + '<path d="M208 350 C220 396 292 396 304 350" stroke="' + KNI.steelDark + '" stroke-width="8" fill="none"/>'
        + '<path d="M204 430 C224 456 288 456 308 430" stroke="' + KNI.steelDark + '" stroke-width="8" fill="none"/>'
        + '<path d="M212 390 L300 390" stroke="' + KNI.steelLight + '" stroke-width="6" opacity=".8"/>'
        + '<circle cx="256" cy="404" r="18" fill="' + KNI.gold + '" stroke="' + KNI.steelDeep + '" stroke-width="5"/>'
        + '<path d="M256 392 L256 416 M244 404 L268 404" stroke="' + KNI.cloth + '" stroke-width="7" stroke-linecap="round"/>'
        + belt(KNI.steelDark, KNI.gold, KNI.steelDeep),
      legDetail: '<circle cx="221" cy="556" r="18" fill="' + KNI.steelLight + '" stroke="' + KNI.steelDark + '" stroke-width="5"/>'
        + '<circle cx="291" cy="556" r="18" fill="' + KNI.steelLight + '" stroke="' + KNI.steelDark + '" stroke-width="5"/>'
        + '<path d="M196 516 L192 606 M316 516 L320 606" stroke="' + KNI.steelDark + '" stroke-width="7" opacity=".7"/>'
        + '<rect x="184" y="592" width="72" height="50" rx="11" fill="' + KNI.steelDeep + '"/>'
        + '<rect x="256" y="592" width="72" height="50" rx="11" fill="' + KNI.steelDeep + '"/>'
        + '<path d="M190 600 L250 600 M262 600 L322 600" stroke="' + KNI.steelLight + '" stroke-width="6" stroke-linecap="round"/>'
    });
  }

  function knightTop() {
    return '<g>'
      /* mũ giáp hở mặt: chỏm + hai má, chừa đúng vùng mắt 224/288 × 210 */
      + '<path d="M177 176 C177 112 212 82 256 82 C300 82 335 112 335 176 Z" fill="' + KNI.steel + '" stroke="' + KNI.steelDark + '" stroke-width="5" filter="url(#kidShadow)"/>'
      + '<path d="M194 172 C206 160 232 154 256 154 C280 154 306 160 318 172" stroke="' + KNI.steelDark + '" stroke-width="5" fill="none" opacity=".8"/>'
      + '<path d="M170 172 L192 172 L192 242 C192 254 180 256 174 248 Z" fill="' + KNI.steel + '" stroke="' + KNI.steelDark + '" stroke-width="4"/>'
      + '<path d="M342 172 L320 172 L320 242 C320 254 332 256 338 248 Z" fill="' + KNI.steel + '" stroke="' + KNI.steelDark + '" stroke-width="4"/>'
      + '<path d="M256 82 L256 128" stroke="' + KNI.steelLight + '" stroke-width="7" stroke-linecap="round"/>'
      + '<path d="M256 84 C246 52 258 24 292 8 C288 30 294 46 314 56 C296 62 286 78 290 96 C278 84 266 82 256 84 Z" fill="' + KNI.plume + '" stroke="#9E1B16" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M268 56 C278 42 292 32 304 28" stroke="#FF8A80" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- 15. Phù thủy --------------------------------------------------- */
  var WIT = {
    gown: '#5B3A87', gownDark: '#402460', trim: '#8B5CC7', gold: '#F5C63C',
    buckle: '#C99A10', sock: '#2E2E38', stripe: '#F08A3C', shoe: '#1B1E26'
  };

  function witchBody(sv) {
    return gownFrame(sv, {
      arm: WIT.gown, dress: WIT.gown, leg: WIT.sock, foot: WIT.shoe,
      armDetail: '<path d="M158 424 L204 418 M308 418 L354 424" stroke="' + WIT.gownDark + '" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="152" y="448" width="54" height="44" rx="20" fill="' + WIT.gownDark + '"/>'
        + '<rect x="306" y="448" width="54" height="44" rx="20" fill="' + WIT.gownDark + '"/>',
      dressDetail: belt(WIT.gownDark, WIT.gold, WIT.buckle)
        + '<path d="M168 540 C210 560 302 560 344 540" stroke="' + WIT.trim + '" stroke-width="9" fill="none" opacity=".7"/>'
        + '<path d="M190 596 C222 610 290 610 322 596" stroke="' + WIT.gold + '" stroke-width="5" fill="none" opacity=".6"/>'
        + '<path d="M226 320 C236 342 276 342 286 320" stroke="' + WIT.gold + '" stroke-width="5" fill="none"/>',
      legDetail: '<g fill="' + WIT.stripe + '"><rect x="206" y="606" width="40" height="9" rx="4"/><rect x="266" y="606" width="40" height="9" rx="4"/>'
        + '<rect x="204" y="622" width="40" height="9" rx="4"/><rect x="268" y="622" width="40" height="9" rx="4"/></g>'
    });
  }

  function witchTop() {
    return '<g>'
      + '<path d="M150 158 C168 112 206 78 256 44 C306 78 344 112 362 158 Z" fill="' + WIT.gown + '" filter="url(#kidShadow)"/>'
      + '<path d="M256 44 C238 84 214 122 190 156 L214 160 C236 126 250 92 262 58 Z" fill="' + WIT.trim + '" opacity=".5"/>'
      + '<ellipse cx="256" cy="158" rx="112" ry="22" fill="' + WIT.gownDark + '"/>'
      + '<path d="M144 152 C198 172 314 172 368 152 L362 166 C306 186 206 186 150 166 Z" fill="' + WIT.gownDark + '"/>'
      + '<rect x="222" y="140" width="68" height="26" rx="7" fill="' + WIT.buckle + '" stroke="' + WIT.gold + '" stroke-width="4"/>'
      + '<rect x="244" y="146" width="24" height="14" rx="4" fill="' + WIT.gownDark + '"/>'
      + '<path d="M198 306 L214 356 L248 330 Z" fill="' + WIT.gownDark + '"/>'
      + '<path d="M314 306 L298 356 L264 330 Z" fill="' + WIT.gownDark + '"/>'
      + '</g>';
  }

  /* ---- 16. Tiên -------------------------------------------------------- */
  var FAIRY = {
    dress: '#4FC3A1', dressDark: '#2F9C7C', trim: '#BFF3E2', gold: '#F5C63C',
    wing: '#CFF3FF', shoe: '#4FC3A1', rose: '#F07CA8'
  };

  function fairyBack() {
    return '<g fill="' + FAIRY.wing + '" fill-opacity=".72" stroke="#FFFFFF" stroke-width="5" stroke-opacity=".85">'
      + '<path d="M204 340 C142 288 108 210 136 158 C168 178 200 244 214 316 Z"/>'
      + '<path d="M308 340 C370 288 404 210 376 158 C344 178 312 244 298 316 Z"/>'
      + '<path d="M200 400 C136 388 96 424 96 478 C142 480 192 452 208 424 Z"/>'
      + '<path d="M312 400 C376 388 416 424 416 478 C370 480 320 452 304 424 Z"/>'
      + '</g>';
  }

  function fairyBody(sv) {
    return gownFrame(sv, {
      arm: 'url(#kidSkin)', dress: FAIRY.dress, leg: 'url(#kidSkin)', foot: FAIRY.shoe,
      armDetail: '<rect x="158" y="350" width="52" height="42" rx="20" fill="' + FAIRY.dress + '" stroke="' + FAIRY.dressDark + '" stroke-width="4"/>'
        + '<rect x="302" y="350" width="52" height="42" rx="20" fill="' + FAIRY.dress + '" stroke="' + FAIRY.dressDark + '" stroke-width="4"/>',
      dressDetail: '<path d="M172 456 C210 476 302 476 340 456" stroke="' + FAIRY.gold + '" stroke-width="7" fill="none"/>'
        + '<path d="M166 536 C210 556 302 556 346 536" stroke="' + FAIRY.dressDark + '" stroke-width="7" fill="none" opacity=".6"/>'
        + '<g fill="' + FAIRY.trim + '">'
        + '<path d="M182 560 C196 546 214 552 214 570 C214 586 196 592 184 580 Z"/>'
        + '<path d="M330 560 C316 546 298 552 298 570 C298 586 316 592 328 580 Z"/>'
        + '</g>'
        + '<path d="M226 320 C236 344 276 344 286 320" stroke="' + FAIRY.gold + '" stroke-width="5" fill="none"/>',
      legDetail: '<path d="M198 600 L194 634 M314 600 L318 634" stroke="' + FAIRY.trim + '" stroke-width="8" opacity=".8"/>'
    });
  }

  function fairyTop() {
    return '<g>'
      + '<path d="M176 120 C210 96 302 96 336 120" stroke="#3F9E7F" stroke-width="6" fill="none" stroke-linecap="round"/>'
      + flowerCrown(206, 118, FAIRY.rose)
      + flowerCrown(240, 100, '#FFA3BE')
      + flowerCrown(274, 100, FAIRY.rose)
      + flowerCrown(308, 118, '#FFA3BE')
      + '<path d="M338 470 L392 396" stroke="#8A5A2F" stroke-width="8" stroke-linecap="round"/>'
      + '<path d="M392 396 L400 372 L408 396 L432 404 L408 412 L400 436 L392 412 L368 404 Z" fill="' + FAIRY.gold + '" stroke="#C99A10" stroke-width="4" stroke-linejoin="round"/>'
      + '<circle cx="400" cy="404" r="6" fill="#FFFFFF" opacity=".7"/>'
      + '</g>';
  }

  /* ---- 17. Bộ xương --------------------------------------------------- */
  var SKL = {
    bone: '#F4ECD8', dark: '#E0D2AE', shade: '#B9A87F', outline: '#8B7A55',
    socket: '#332B33', glow: '#8FE8FF', glowCore: '#F2FDFF'
  };

  /** Xương có viền: nét viền đậm bên dưới rồi nét xương mảnh đè lên. */
  function boneStroke(d, w) {
    return '<path d="' + d + '" fill="none" stroke="' + SKL.outline + '" stroke-width="' + (w + 6) + '" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="' + d + '" fill="none" stroke="' + SKL.bone + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function skeletonArms() {
    return '<circle cx="184" cy="362" r="17" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      + '<circle cx="328" cy="362" r="17" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      + boneStroke('M184 376 L174 418', 12)
      + boneStroke('M328 376 L338 418', 12)
      + '<circle cx="173" cy="426" r="14" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      + '<circle cx="339" cy="426" r="14" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      + boneStroke('M168 438 L176 466', 8)
      + boneStroke('M181 436 L187 464', 8)
      + boneStroke('M344 438 L336 466', 8)
      + boneStroke('M331 436 L325 464', 8)
      + '<circle cx="181" cy="476" r="10" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<circle cx="331" cy="476" r="10" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + boneStroke('M178 486 L175 496', 4)
      + boneStroke('M184 487 L184 498', 4)
      + boneStroke('M190 486 L193 495', 4)
      + boneStroke('M334 486 L337 496', 4)
      + boneStroke('M328 487 L328 498', 4)
      + boneStroke('M322 486 L319 495', 4);
  }

  function skeletonNeck() {
    return '<rect x="243" y="300" width="26" height="11" rx="5" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<rect x="243" y="314" width="26" height="11" rx="5" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<rect x="245" y="328" width="22" height="9" rx="4" fill="' + SKL.dark + '" stroke="' + SKL.outline + '" stroke-width="4"/>';
  }

  function skullHead() {
    return '<g filter="url(#kidShadow)">'
      + '<path d="M179 168 C179 112 212 88 256 88 C300 88 333 112 333 168 L333 210 C333 230 327 244 316 254 L307 270 C300 290 281 301 256 301 C231 301 212 290 205 270 L194 254 C183 244 179 230 179 210 Z" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      + '<ellipse cx="222" cy="130" rx="36" ry="19" fill="#FFFFFF" opacity=".35"/>'
      + '<path d="M294 112 L286 128 L296 142" stroke="' + SKL.shade + '" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>'
      + '<path d="M191 226 C198 246 208 256 220 262" stroke="' + SKL.shade + '" stroke-width="5" fill="none" opacity=".55"/>'
      + '<path d="M321 226 C314 246 304 256 292 262" stroke="' + SKL.shade + '" stroke-width="5" fill="none" opacity=".55"/>'
      /* hốc mắt to, hơi méo cho ra dáng sọ */
      + '<path d="M197 194 C204 178 224 172 240 180 C251 186 253 202 247 216 C241 230 222 236 208 228 C198 222 193 208 197 194 Z" fill="' + SKL.socket + '"/>'
      + '<path d="M315 194 C308 178 288 172 272 180 C261 186 259 202 265 216 C271 230 290 236 304 228 C314 222 319 208 315 194 Z" fill="' + SKL.socket + '"/>'
      /* mắt phát sáng đặt đúng 224/288 × 210 để kính vẫn khớp */
      + '<circle cx="224" cy="210" r="15" fill="' + SKL.glow + '" opacity=".32"/>'
      + '<circle cx="288" cy="210" r="15" fill="' + SKL.glow + '" opacity=".32"/>'
      + '<circle cx="224" cy="210" r="9" fill="' + SKL.glow + '"/><circle cx="288" cy="210" r="9" fill="' + SKL.glow + '"/>'
      + '<circle cx="224" cy="210" r="4.5" fill="' + SKL.glowCore + '"/><circle cx="288" cy="210" r="4.5" fill="' + SKL.glowCore + '"/>'
      /* gò má + hốc mũi */
      + '<path d="M194 242 C206 254 220 258 232 254" stroke="' + SKL.shade + '" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/>'
      + '<path d="M318 242 C306 254 292 258 280 254" stroke="' + SKL.shade + '" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/>'
      + '<path d="M256 234 C250 244 244 252 247 260 C250 267 255 268 256 262 C257 268 262 267 265 260 C268 252 262 244 256 234 Z" fill="' + SKL.socket + '"/>'
      /* hàm răng */
      + '<rect x="218" y="270" width="76" height="20" rx="8" fill="' + SKL.dark + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<path d="M237 271 L237 289 M256 270 L256 290 M275 271 L275 289" stroke="' + SKL.outline + '" stroke-width="4" opacity=".75"/>'
      + '<path d="M209 283 C226 297 286 297 303 283" stroke="' + SKL.shade + '" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>'
      + '</g>';
  }

  function skeletonTorso() {
    var s = '';
    /* xương đòn nối hai khớp vai vào lồng ngực */
    s += boneStroke('M190 356 C212 344 238 338 256 340', 8)
      + boneStroke('M322 356 C300 344 274 338 256 340', 8);
    /* cột sống: chuỗi đốt sống nhỏ */
    for (var y = 318; y <= 474; y += 17) {
      s += '<rect x="246" y="' + y + '" width="20" height="12" rx="6" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="3.5"/>';
    }
    /* 4 cặp xương sườn, viền đậm cho rõ trên nền sáng */
    var ribs = [
      ['M256 342 C230 334 208 342 200 362', 'M256 342 C282 334 304 342 312 362'],
      ['M256 376 C226 368 202 376 197 398', 'M256 376 C286 368 310 376 315 398'],
      ['M256 410 C226 402 206 410 202 432', 'M256 410 C286 402 306 410 310 432'],
      ['M256 444 C230 438 214 444 210 464', 'M256 444 C282 438 298 444 302 464']
    ];
    ribs.forEach(function (pair) {
      s += boneStroke(pair[0], 9) + boneStroke(pair[1], 9);
    });
    return s;
  }

  function skeletonPelvis() {
    return '<g filter="url(#kidShadow)">'
      + '<path d="M256 474 C242 474 228 478 218 486 C206 496 203 512 209 524 C215 537 233 543 247 539 L256 531 L265 539 C279 543 297 537 303 524 C309 512 306 496 294 486 C284 478 270 474 256 474 Z" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M256 480 L256 528" stroke="' + SKL.shade + '" stroke-width="4" opacity=".75"/>'
      + '<circle cx="226" cy="514" r="14" fill="' + SKL.dark + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<circle cx="286" cy="514" r="14" fill="' + SKL.dark + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<circle cx="226" cy="514" r="6" fill="' + SKL.socket + '"/><circle cx="286" cy="514" r="6" fill="' + SKL.socket + '"/>'
      + '</g>';
  }

  function skeletonLegs() {
    return '<circle cx="226" cy="524" r="12" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<circle cx="286" cy="524" r="12" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      /* xương đùi */
      + boneStroke('M226 534 L222 566', 13)
      + boneStroke('M286 534 L290 566', 13)
      + '<circle cx="222" cy="574" r="15" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      + '<circle cx="290" cy="574" r="15" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5"/>'
      /* cẳng chân hai xương: chày + mác */
      + boneStroke('M215 586 L210 634', 8)
      + boneStroke('M229 584 L225 632', 6)
      + boneStroke('M297 586 L302 634', 8)
      + boneStroke('M283 584 L287 632', 6)
      + '<circle cx="210" cy="640" r="10" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      + '<circle cx="302" cy="640" r="10" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="4"/>'
      /* bàn chân xương, mũi chân hướng ra ngoài */
      + '<path d="M206 642 C208 652 200 658 188 661 C178 663 177 671 187 672 L236 672 C244 672 246 664 238 658 L222 644 Z" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M306 642 C304 652 312 658 324 661 C334 663 335 671 325 672 L276 672 C268 672 266 664 274 658 L290 644 Z" fill="' + SKL.bone + '" stroke="' + SKL.outline + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<g stroke="' + SKL.outline + '" stroke-width="3" opacity=".65" stroke-linecap="round">'
      + '<path d="M196 662 L232 662 M210 655 L210 670 M222 655 L222 670"/>'
      + '<path d="M316 662 L280 662 M302 655 L302 670 M290 655 L290 670"/>'
      + '</g>';
  }

  function skeletonBody() {
    return groundShadow()
      + skeletonArms()
      + skeletonNeck()
      + skullHead()
      + skeletonTorso()
      + skeletonPelvis()
      + skeletonLegs();
  }

  function skeletonTop() {
    return '';
  }

  /* ---- 18. Người tuyết ------------------------------------------------- */
  var SNOW = {
    ball: '#F7FBFF', ballDark: '#DCE9F7', ballShade: '#C7DAEE', coal: '#33333F',
    carrot: '#F08A3C', carrotDark: '#C2651F', scarf: '#E8453C', twig: '#8A5A2F'
  };

  function snowmanBody() {
    return '<ellipse cx="256" cy="676" rx="118" ry="17" fill="#000000" opacity="0.10" filter="url(#kidBlur)"/>'
      /* cành tay */
      + '<path d="M186 388 L112 312 M150 348 L126 344 M138 328 L118 314" stroke="' + SNOW.twig + '" stroke-width="10" fill="none" stroke-linecap="round"/>'
      + '<path d="M326 388 L400 312 M362 348 L386 344 M374 328 L394 314" stroke="' + SNOW.twig + '" stroke-width="10" fill="none" stroke-linecap="round"/>'
      /* thân dưới + thân giữa: nâng thân giữa lên sát đầu, chỉ chừa vừa đủ khăn */
      + '<ellipse cx="256" cy="570" rx="112" ry="102" fill="' + SNOW.ball + '" stroke="' + SNOW.ballDark + '" stroke-width="6" filter="url(#kidShadow)"/>'
      + '<path d="M170 590 C200 630 250 650 300 646" stroke="' + SNOW.ballShade + '" stroke-width="12" fill="none" opacity=".5" stroke-linecap="round"/>'
      + '<ellipse cx="256" cy="408" rx="88" ry="98" fill="' + SNOW.ball + '" stroke="' + SNOW.ballDark + '" stroke-width="6" filter="url(#kidShadow)"/>'
      + '<g fill="' + SNOW.coal + '"><circle cx="256" cy="370" r="10"/><circle cx="256" cy="410" r="10"/><circle cx="256" cy="450" r="10"/></g>'
      /* đầu: mắt 224/288 × 204 để kính đeo vào vẫn khớp */
      + '<ellipse cx="256" cy="196" rx="82" ry="84" fill="' + SNOW.ball + '" stroke="' + SNOW.ballDark + '" stroke-width="6" filter="url(#kidShadow)"/>'
      + '<ellipse cx="226" cy="156" rx="34" ry="22" fill="#FFFFFF" opacity=".75"/>'
      + '<circle cx="224" cy="204" r="12" fill="' + SNOW.coal + '"/>'
      + '<circle cx="288" cy="204" r="12" fill="' + SNOW.coal + '"/>'
      + '<circle cx="220" cy="200" r="4" fill="#FFFFFF" opacity=".8"/>'
      + '<circle cx="284" cy="200" r="4" fill="#FFFFFF" opacity=".8"/>'
      + '<path d="M252 216 L302 230 L252 242 Z" fill="' + SNOW.carrot + '" stroke="' + SNOW.carrotDark + '" stroke-width="3"/>'
      + '<ellipse cx="204" cy="238" rx="18" ry="10" fill="#FF8FA0" opacity=".45"/>'
      + '<ellipse cx="308" cy="238" rx="18" ry="10" fill="#FF8FA0" opacity=".45"/>'
      + '<path d="M228 258 Q256 278 284 258" stroke="' + SNOW.coal + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
      + '<circle cx="256" cy="268" r="5" fill="' + SNOW.coal + '"/><circle cx="242" cy="264" r="4" fill="' + SNOW.coal + '"/><circle cx="270" cy="264" r="4" fill="' + SNOW.coal + '"/>';
  }

  function snowmanTop() {
    return '<g>'
      + '<path d="M186 282 C222 306 290 306 326 282 L326 306 C290 330 222 330 186 306 Z" fill="' + SNOW.scarf + '"/>'
      + '<path d="M196 292 C228 312 284 312 316 292" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="5" fill="none"/>'
      + '<path d="M296 314 L318 386 L292 394 L276 326 Z" fill="#C93A31"/>'
      + '<path d="M292 330 L310 336 M298 362 L316 368" stroke="#8E1A14" stroke-width="4" opacity=".6"/>'
      + '</g>';
  }

  /* ---- 19. Ông già Noel ------------------------------------------------ */
  var SANTA = {
    suit: '#D6322E', suitDark: '#A61F1C', fur: '#F7FAFE', furShade: '#DCE5F1',
    boot: '#2E2E38', gold: '#F5C63C'
  };

  function santaBody(sv) {
    return costumeFrame(sv, {
      torso: SANTA.suit, arm: SANTA.suit, neck: SANTA.suitDark, leg: SANTA.suit, foot: SANTA.boot,
      armDetail: '<rect x="150" y="446" width="58" height="44" rx="21" fill="' + SANTA.fur + '" stroke="' + SANTA.furShade + '" stroke-width="4"/>'
        + '<rect x="304" y="446" width="58" height="44" rx="21" fill="' + SANTA.fur + '" stroke="' + SANTA.furShade + '" stroke-width="4"/>',
      torsoDetail: '<path d="M256 326 L256 500" stroke="' + SANTA.suitDark + '" stroke-width="9" opacity=".55"/>'
        + '<path d="M238 328 L274 328 L278 476 L234 476 Z" fill="' + SANTA.fur + '" opacity=".95"/>'
        + belt(SANTA.boot, SANTA.gold, '#C99A10')
        + '<rect x="186" y="588" width="70" height="54" rx="12" fill="' + SANTA.fur + '"/>'
        + '<rect x="256" y="588" width="70" height="54" rx="12" fill="' + SANTA.fur + '"/>'
        + '<path d="M190 598 L250 598 M262 598 L322 598" stroke="' + SANTA.furShade + '" stroke-width="6" stroke-linecap="round"/>'
    });
  }

  function santaTop() {
    return '<g>'
      /* râu hạ thấp để chừa mũi; miệng cười vẽ đè lên râu */
      + '<path d="M186 224 C186 270 202 306 220 322 C232 334 242 346 256 346 C270 346 280 334 292 322 C310 306 326 270 326 224 C326 254 306 266 288 258 C274 252 266 246 256 246 C246 246 238 252 224 258 C206 266 186 254 186 224 Z" fill="' + SANTA.fur + '" filter="url(#kidShadow)"/>'
      + '<ellipse cx="236" cy="252" rx="26" ry="15" fill="' + SANTA.fur + '" transform="rotate(-12 236 252)"/>'
      + '<ellipse cx="276" cy="252" rx="26" ry="15" fill="' + SANTA.fur + '" transform="rotate(12 276 252)"/>'
      /* mũi đỏ + miệng cười nằm trên râu */
      + '<ellipse cx="256" cy="230" rx="17" ry="15" fill="#F08A80" stroke="#C96A62" stroke-width="4"/>'
      + '<ellipse cx="250" cy="225" rx="6" ry="4" fill="#FFFFFF" opacity=".55"/>'
      + '<path d="M232 274 Q256 292 280 274" stroke="#9E2B28" stroke-width="6" fill="none" stroke-linecap="round"/>'
      /* mũ đỏ + vành lông + bông */
      + '<path d="M186 140 C186 96 216 68 256 68 C296 68 326 96 326 140 Z" fill="' + SANTA.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M256 68 C252 52 262 34 282 26 C300 18 318 24 324 38 C310 40 300 52 296 68 Z" fill="' + SANTA.suit + '"/>'
      + '<circle cx="326" cy="30" r="18" fill="' + SANTA.fur + '"/>'
      + '<path d="M200 106 C214 86 234 76 252 74" stroke="#FFFFFF" stroke-opacity=".28" stroke-width="9" fill="none" stroke-linecap="round"/>'
      + '<rect x="176" y="128" width="160" height="34" rx="17" fill="' + SANTA.fur + '" stroke="' + SANTA.furShade + '" stroke-width="4"/>'
      + '<path d="M192 138 C214 130 298 130 320 138" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".6"/>'
      + '</g>';
  }

  /* ---- 20. Ma Halloween ------------------------------------------------ */
  var HALL = {
    sheet: '#E7DBFF', mid: '#CDB9F7', edge: '#A98BF0', eye: '#3A2B6B',
    mouth: '#5B2A6B', glow: '#B99CF2', teeth: '#FFF3C4'
  };

  function halloweenBack() {
    return '<ellipse cx="256" cy="430" rx="132" ry="184" fill="' + HALL.glow + '" opacity="0.18" filter="url(#kidBlur)"/>'
      + '<g fill="#FFFFFF" opacity=".7"><path d="M132 236 L138 254 L156 260 L138 266 L132 284 L126 266 L108 260 L126 254 Z"/>'
      + '<path d="M392 330 L397 344 L411 349 L397 354 L392 368 L387 354 L373 349 L387 344 Z"/></g>';
  }

  function halloweenBody() {
    var hsv = { light: HALL.sheet, dark: HALL.mid, shadow: HALL.edge, ear: HALL.mid };
    return '<ellipse cx="256" cy="676" rx="74" ry="13" fill="#000000" opacity="0.08" filter="url(#kidBlur)"/>'
      + limbs(HALL.sheet)
      + neck(hsv, HALL.mid)
      + head(hsv, HALL.sheet)
      + '<path d="M212 322 C234 308 278 308 300 322 C330 340 344 380 342 424 L338 548'
      + ' C337 570 320 578 306 568 L292 556 L272 582 C262 592 250 592 240 582 L220 556 L206 568'
      + ' C192 578 175 570 174 548 L170 424 C168 380 182 340 212 322 Z" fill="' + HALL.sheet + '" filter="url(#kidShadow)"/>'
      + '<path d="M186 424 C184 376 196 344 218 328" stroke="#FFFFFF" stroke-width="10" opacity=".55" fill="none" stroke-linecap="round"/>'
      /* mắt phát sáng đúng 224/288 × 210 để kính đeo khớp */
      + '<ellipse cx="224" cy="210" rx="17" ry="23" fill="' + HALL.eye + '"/>'
      + '<ellipse cx="288" cy="210" rx="17" ry="23" fill="' + HALL.eye + '"/>'
      + '<circle cx="230" cy="202" r="5" fill="' + HALL.teeth + '"/>'
      + '<circle cx="294" cy="202" r="5" fill="' + HALL.teeth + '"/>'
      /* miệng bí ngô */
      + '<path d="M208 262 L304 262 L292 286 L276 272 L262 290 L250 272 L232 288 Z" fill="' + HALL.mouth + '"/>';
  }

  function halloweenTop() {
    return '<g fill="' + HALL.edge + '" opacity=".65">'
      + '<circle cx="150" cy="308" r="10"/><circle cx="370" cy="262" r="7"/><circle cx="386" cy="470" r="12"/></g>';
  }

  /* ===================================================================== *
   *  THÂN CHỦ ĐỀ BỔ SUNG — 12 nhân vật nữa
   *
   *  Cùng khung 512×700, cùng bút pháp với 20 thân trước. Các thân người dùng
   *  costumeFrame/gownFrame để mặt–tóc–mũ–kính vẫn khớp; thân đặc biệt tự vẽ
   *  mặt và khai báo slots hẹp. Màu tóc mặc định trong BODY_LOOKS tách nam/nữ:
   *  nữ để tóc dài/đuôi ngựa/búi, nam để tóc ngắn/topknot.
   * ===================================================================== */

  /* ---- 21. Nàng tiên cá ---------------------------------------------- */
  var MER = {
    tail: '#2FB7A8', tailDark: '#1D7F78', tailLight: '#8AE3D6',
    shell: '#FF9DBB', shellDark: '#D9668C', pearl: '#FFF3D9', gold: '#F5C63C'
  };

  function mermaidBody(sv) {
    return groundShadow()
      /* đuôi cá vẽ sau thân: rộng ở hông rồi thuôn xuống, kết thúc bằng vây đuôi */
      + '<g filter="url(#kidShadow)">'
      + '<path d="M204 470 C188 510 194 550 218 578 C234 596 240 614 236 628 C232 642 250 648 262 638 C274 628 272 606 258 586 C246 570 246 546 260 526 C276 506 300 492 308 470 Z" fill="' + MER.tail + '" stroke="' + MER.tailDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M220 500 C238 528 236 560 248 586 M276 508 C288 532 286 556 272 574" stroke="' + MER.tailLight + '" stroke-width="7" fill="none" opacity=".4" stroke-linecap="round"/>'
      + '<path d="M218 540 Q228 548 238 540 M236 564 Q246 572 256 564 M248 588 Q258 596 268 588" stroke="' + MER.tailLight + '" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>'
      /* vây đuôi hai thuỳ, to và rõ như đuôi cá */
      + '<path d="M246 620 C216 606 176 616 154 646 C176 664 202 676 226 674 C244 672 252 656 252 638 Z" fill="' + MER.tailLight + '" stroke="' + MER.tailDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M266 620 C296 606 336 616 358 646 C336 664 310 676 286 674 C268 672 260 656 260 638 Z" fill="' + MER.tailLight + '" stroke="' + MER.tailDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M246 620 C252 636 252 652 248 664 M266 620 C260 636 260 652 264 664" stroke="' + MER.tailDark + '" stroke-width="4" fill="none" opacity=".55"/>'
      + '<path d="M226 624 C206 632 186 644 172 654 M286 624 C306 632 326 644 340 654" stroke="' + MER.tailDark + '" stroke-width="3" fill="none" opacity=".4" stroke-linecap="round"/>'
      + '</g>'
      + limbs('url(#kidSkin)')
      + neck(sv, 'url(#kidSkin)')
      + head(sv, 'url(#kidSkin)')
      + '<path d="' + TORSO_GIRL + '" fill="url(#kidSkin)" filter="url(#kidShadow)"/>'
      /* vảy bụng mờ + vành đuôi ôm eo */
      + '<path d="M214 452 C236 468 280 468 302 452 L298 486 C278 500 234 500 214 486 Z" fill="' + MER.tail + '" stroke="' + MER.tailDark + '" stroke-width="4"/>'
      + '<path d="M226 466 C242 476 272 476 288 466" stroke="' + MER.tailLight + '" stroke-width="5" fill="none" opacity=".7"/>'
      /* vỏ sò làm áo + dây ngọc */
      + '<g fill="' + MER.shell + '" stroke="' + MER.shellDark + '" stroke-width="4" stroke-linejoin="round">'
      + '<path d="M222 348 C206 336 194 350 198 370 C200 390 214 406 230 414 C238 402 242 382 238 362 Z"/>'
      + '<path d="M290 348 C306 336 318 350 314 370 C312 390 298 406 282 414 C274 402 270 382 274 362 Z"/>'
      + '</g>'
      + '<path d="M238 362 C244 378 244 400 230 414 M274 362 C268 378 268 400 282 414" fill="none" stroke="' + MER.shellDark + '" stroke-width="3" opacity=".55"/>'
      + '<path d="M256 344 L256 362" stroke="' + MER.gold + '" stroke-width="4"/>'
      + '<circle cx="256" cy="348" r="7" fill="' + MER.pearl + '" stroke="' + MER.gold + '" stroke-width="3"/>'
      + '<path d="M200 420 C220 434 292 434 312 420" stroke="' + MER.pearl + '" stroke-width="4" fill="none" opacity=".5"/>';
  }

  function mermaidTop() {
    return '<g>'
      /* kẹp sao biển trên tóc */
      + '<path d="M202 132 L206 146 L220 148 L208 158 L212 172 L198 162 L184 170 L188 156 L178 144 L192 144 Z" fill="#FFD166" stroke="#C98A1A" stroke-width="3" stroke-linejoin="round"/>'
      + '<circle cx="200" cy="150" r="4" fill="#FFFFFF" opacity=".6"/>'
      /* chuỗi ngọc nhỏ trên cổ */
      + '<g fill="' + MER.pearl + '" stroke="' + MER.gold + '" stroke-width="2">'
      + '<circle cx="216" cy="316" r="4"/><circle cx="232" cy="324" r="4"/><circle cx="256" cy="328" r="4"/>'
      + '<circle cx="280" cy="324" r="4"/><circle cx="296" cy="316" r="4"/>'
      + '</g>'
      + '</g>';
  }

  /* ---- 22. Người sói -------------------------------------------------- */
  var WOLF = {
    fur: '#8A6A4F', furDark: '#5D4430', furLight: '#C9B08F',
    belly: '#E6D8C2', claw: '#FFF4DE', eye: '#F5C63C', nose: '#2B2220'
  };

  function werewolfBack() {
    return '<g filter="url(#kidShadow)">'
      + '<path d="M300 468 C372 480 410 534 394 596 C386 624 362 636 342 624 C326 614 330 596 346 594 C364 592 372 574 362 552 C350 522 318 502 292 498 Z" fill="' + WOLF.fur + '" stroke="' + WOLF.furDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M330 510 C354 534 366 566 360 596 M344 520 C364 548 370 574 364 602" stroke="' + WOLF.furDark + '" stroke-width="5" opacity=".5" fill="none" stroke-linecap="round"/>'
      + '</g>';
  }

  function werewolfBody(sv) {
    var rsv = { light: WOLF.furLight, dark: WOLF.furDark, shadow: WOLF.furDark, ear: WOLF.furDark };
    return costumeFrame(rsv, {
      torso: WOLF.fur, arm: WOLF.fur, neck: WOLF.fur, leg: WOLF.furDark, foot: WOLF.furDark, head: WOLF.fur,
      armDetail: '<g fill="' + WOLF.claw + '" stroke="' + WOLF.furDark + '" stroke-width="3" stroke-linejoin="round">'
        + '<path d="M164 474 L156 496 L174 486 Z"/><path d="M178 480 L176 502 L190 488 Z"/><path d="M192 478 L198 498 L204 486 Z"/>'
        + '<path d="M348 474 L356 496 L338 486 Z"/><path d="M334 480 L336 502 L322 488 Z"/><path d="M320 478 L314 498 L308 486 Z"/>'
        + '</g>'
        + '<path d="M160 402 C168 394 180 394 188 402 M324 402 C332 394 344 394 352 402" stroke="' + WOLF.furDark + '" stroke-width="6" fill="none" opacity=".55" stroke-linecap="round"/>',
      torsoDetail: '<path d="M222 350 C240 340 272 340 290 352 L282 500 C270 516 242 516 230 500 Z" fill="' + WOLF.belly + '" opacity=".85"/>'
        + '<path d="M256 348 L256 504" stroke="' + WOLF.furDark + '" stroke-width="4" opacity=".25"/>'
        + '<path d="M202 330 C214 346 218 362 214 380 M310 330 C298 346 294 362 298 380" stroke="' + WOLF.furDark + '" stroke-width="6" fill="none" opacity=".5" stroke-linecap="round"/>',
      legDetail: '<path d="M194 544 C206 556 218 560 230 556 M318 544 C306 556 294 560 282 556" stroke="' + WOLF.furDark + '" stroke-width="5" fill="none" opacity=".45" stroke-linecap="round"/>',
      footDetail: '<g fill="' + WOLF.claw + '" stroke="' + WOLF.furDark + '" stroke-width="3" stroke-linejoin="round">'
        + '<path d="M180 660 L162 654 L178 676 Z"/><path d="M198 664 L188 650 L204 676 Z"/><path d="M218 666 L216 650 L232 676 Z"/>'
        + '<path d="M332 660 L350 654 L334 676 Z"/><path d="M314 664 L324 650 L308 676 Z"/><path d="M294 666 L296 650 L280 676 Z"/>'
        + '</g>'
    })
      /* mõm sói + mắt vàng + nanh, vẽ sau cùng để không bị tóc che */
      + '<ellipse cx="256" cy="248" rx="44" ry="31" fill="' + WOLF.belly + '" stroke="' + WOLF.furDark + '" stroke-width="4"/>'
      + '<ellipse cx="256" cy="228" rx="14" ry="10" fill="' + WOLF.nose + '"/>'
      + '<path d="M232 258 Q256 278 280 258" stroke="' + WOLF.nose + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
      + '<path d="M238 266 L244 280 L250 266 M262 266 L268 280 L274 266" fill="' + WOLF.claw + '" stroke="' + WOLF.furDark + '" stroke-width="2" stroke-linejoin="round"/>'
      + '<ellipse cx="224" cy="204" rx="20" ry="23" fill="' + WOLF.eye + '" stroke="' + WOLF.furDark + '" stroke-width="4"/>'
      + '<ellipse cx="288" cy="204" rx="20" ry="23" fill="' + WOLF.eye + '" stroke="' + WOLF.furDark + '" stroke-width="4"/>'
      + '<ellipse cx="226" cy="204" rx="7" ry="13" fill="' + WOLF.nose + '"/><ellipse cx="290" cy="204" rx="7" ry="13" fill="' + WOLF.nose + '"/>'
      + '<circle cx="221" cy="197" r="4" fill="#FFFFFF"/><circle cx="285" cy="197" r="4" fill="#FFFFFF"/>'
      + '<path d="M200 176 Q224 164 246 176 M266 176 Q288 164 312 176" stroke="' + WOLF.furDark + '" stroke-width="7" fill="none" stroke-linecap="round"/>';
  }

  function werewolfTop() {
    return '<g fill="' + WOLF.fur + '" stroke="' + WOLF.furDark + '" stroke-width="5" stroke-linejoin="round">'
      + '<path d="M188 146 L174 82 L230 118 Z"/><path d="M324 146 L338 82 L282 118 Z"/>'
      + '<path d="M194 134 L186 100 L218 122 Z" fill="#E8A0A8" stroke="none"/>'
      + '<path d="M318 134 L326 100 L294 122 Z" fill="#E8A0A8" stroke="none"/>'
      + '</g>';
  }

  /* ---- 23. Tiên rừng / Elf ------------------------------------------- */
  var ELF = {
    tunic: '#3E8E5A', tunicDark: '#276B42', leaf: '#7BC96F', leafDark: '#4C9E46',
    pants: '#5B4432', boot: '#3B2A22', gold: '#F5C63C'
  };

  function elfBack() {
    return '<g filter="url(#kidShadow)">'
      + '<path d="M176 362 C146 330 142 292 166 260 C180 242 198 232 214 230 L222 246 C202 252 188 266 180 286 C170 310 176 334 192 354 Z" fill="#8A5A2F" stroke="#5D3B1F" stroke-width="4"/>'
      + '<path d="M166 260 L214 230" stroke="#F7FAFE" stroke-width="3" opacity=".7"/>'
      + '<path d="M310 330 L354 342 L342 438 L300 424 Z" fill="#6B4228" stroke="#4A2C18" stroke-width="4"/>'
      + '<path d="M314 338 L306 424 M330 342 L322 430 M346 346 L338 436" stroke="#4A2C18" stroke-width="4" opacity=".55"/>'
      + '<path d="M318 326 L306 292 M334 330 L326 294 M350 334 L346 298" stroke="#F5C63C" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M306 292 L302 282 L312 288 Z M326 294 L324 282 L334 290 Z M346 298 L346 286 L354 296 Z" fill="#F5C63C"/>'
      + '</g>';
  }

  function elfBody(sv) {
    return groundShadow()
      /* tai nhọn vẽ trước đầu để chân tai nằm dưới tóc/đầu */
      + '<path d="M186 188 C160 174 148 148 154 124 C174 136 188 152 196 170 Z" fill="url(#kidSkin)" stroke="' + sv.ear + '" stroke-width="4" stroke-linejoin="round"/>'
      + '<path d="M326 188 C352 174 364 148 358 124 C338 136 324 152 316 170 Z" fill="url(#kidSkin)" stroke="' + sv.ear + '" stroke-width="4" stroke-linejoin="round"/>'
      + limbs('url(#kidSkin)')
      + neck(sv, 'url(#kidSkin)')
      + head(sv, 'url(#kidSkin)')
      + '<path d="' + TORSO + '" fill="' + ELF.tunic + '" filter="url(#kidShadow)"/>'
      + '<path d="M214 326 L256 368 L298 326 L306 350 L256 404 L206 350 Z" fill="' + ELF.tunicDark + '"/>'
      + '<path d="M256 326 L256 470" stroke="' + ELF.tunicDark + '" stroke-width="5" opacity=".55"/>'
      + '<path d="M206 346 C224 360 288 360 306 346" stroke="' + ELF.gold + '" stroke-width="5" fill="none"/>'
      + '<path d="M238 350 L248 330 L258 350 L248 366 Z" fill="' + ELF.leaf + '" stroke="' + ELF.leafDark + '" stroke-width="3"/>'
      + belt(ELF.pants, ELF.gold, '#C99A10')
      + '<path d="M194 342 C182 330 176 318 178 304 C192 312 202 322 208 334 Z" fill="' + ELF.leaf + '" stroke="' + ELF.leafDark + '" stroke-width="3"/>'
      + '<path d="M318 342 C330 330 336 318 334 304 C320 312 310 322 304 334 Z" fill="' + ELF.leaf + '" stroke="' + ELF.leafDark + '" stroke-width="3"/>'
      + '<path d="' + LEG_L + '" fill="' + ELF.pants + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + ELF.pants + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_L + '" fill="' + ELF.boot + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + ELF.boot + '" filter="url(#kidShadow)"/>'
      + bootShafts(ELF.boot, ELF.gold);
  }

  function elfTop() {
    return '<g>'
      + '<path d="M198 150 Q224 128 256 136 Q288 128 314 150 L310 164 Q284 146 256 152 Q228 146 202 164 Z" fill="' + ELF.gold + '" stroke="#C99A10" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M256 136 L256 164" stroke="#C99A10" stroke-width="3"/>'
      + '<path d="M256 136 L249 114 L263 114 Z" fill="' + ELF.leaf + '" stroke="' + ELF.leafDark + '" stroke-width="3"/>'
      + '<circle cx="256" cy="150" r="4" fill="#FFFFFF" opacity=".7"/>'
      + '</g>';
  }

  /* ---- 24. Thần đèn --------------------------------------------------- */
  var GEN = {
    skin: '#63B8E8', skinDark: '#3C86B8', suit: '#2A7F8E',
    gold: '#F5C63C', goldDark: '#C99A10', smoke: '#8FD8E8', jewel: '#E8453C'
  };

  function genieBody(sv) {
    var rsv = { light: GEN.skin, dark: GEN.skinDark, shadow: GEN.skinDark, ear: GEN.skinDark };
    return groundShadow()
      /* khói xoáy thay cho chân */
      + '<g filter="url(#kidShadow)">'
      + '<path d="M196 500 C176 540 178 586 210 612 C242 638 288 638 316 612 C336 592 334 562 316 548 C300 536 282 544 284 560 C286 576 302 580 308 592 C314 606 300 620 278 626 C246 634 214 618 210 590 C206 564 220 536 238 514 Z" fill="' + GEN.smoke + '" stroke="' + GEN.skinDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M216 570 C232 590 252 600 274 600" stroke="#FFFFFF" stroke-width="7" opacity=".28" fill="none" stroke-linecap="round"/>'
      + '</g>'
      + limbs(GEN.skin)
      + '<rect x="162" y="458" width="44" height="30" rx="14" fill="' + GEN.gold + '" stroke="' + GEN.goldDark + '" stroke-width="4"/>'
      + '<rect x="306" y="458" width="44" height="30" rx="14" fill="' + GEN.gold + '" stroke="' + GEN.goldDark + '" stroke-width="4"/>'
      + '<path d="M170 466 L198 462 M314 462 L342 466" stroke="#FFFFFF" stroke-width="4" opacity=".35" stroke-linecap="round"/>'
      + neck(rsv, GEN.skin)
      + head(rsv, GEN.skin)
      + '<path d="' + TORSO + '" fill="' + GEN.skin + '" filter="url(#kidShadow)"/>'
      + '<path d="M210 330 C226 344 286 344 302 330 L308 372 L256 414 L204 372 Z" fill="' + GEN.suit + '" stroke="' + GEN.goldDark + '" stroke-width="4"/>'
      + '<path d="M256 348 L256 446" stroke="' + GEN.gold + '" stroke-width="6" opacity=".8"/>'
      + '<path d="M202 448 C230 464 282 464 310 448 L306 480 C280 496 232 496 206 480 Z" fill="' + GEN.gold + '" stroke="' + GEN.goldDark + '" stroke-width="4"/>'
      + '<path d="M220 360 C240 374 272 374 292 360" stroke="' + GEN.gold + '" stroke-width="5" fill="none"/>'
      + '<circle cx="256" cy="382" r="8" fill="' + GEN.jewel + '" stroke="' + GEN.goldDark + '" stroke-width="3"/>'
      + '<path d="M204 416 C228 430 284 430 308 416" stroke="' + GEN.skinDark + '" stroke-width="4" fill="none" opacity=".5"/>';
  }

  function genieTop() {
    return '<g>'
      /* khăn xếp vàng + viên ngọc */
      + '<path d="M186 132 C186 92 216 66 256 66 C296 66 326 92 326 132 L326 146 C296 132 216 132 186 146 Z" fill="' + GEN.gold + '" stroke="' + GEN.goldDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M198 118 C222 100 290 100 314 118" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="6" fill="none" stroke-linecap="round"/>'
      + '<path d="M256 66 L256 42" stroke="' + GEN.goldDark + '" stroke-width="6"/>'
      + '<circle cx="256" cy="38" r="10" fill="' + GEN.jewel + '" stroke="' + GEN.goldDark + '" stroke-width="3"/>'
      + '<path d="M206 142 C224 156 288 156 306 142" stroke="' + GEN.suit + '" stroke-width="7" fill="none" opacity=".65"/>'
      /* râu dê nhỏ */
      + '<path d="M238 286 C242 304 250 314 256 322 C262 314 270 304 274 286 C266 294 246 294 238 286 Z" fill="#25252E" opacity=".85"/>'
      + '</g>';
  }

  /* ---- 25. Khủng long ------------------------------------------------- */
  var DINO = {
    body: '#F09A4A', bodyDark: '#C96B24', belly: '#FFE2B8',
    spike: '#E8453C', spikeDark: '#A82B26', claw: '#FFF4DE', eye: '#2B2220'
  };

  function dinoBody() {
    return groundShadow()
      /* đuôi + gai đuôi sau thân */
      + '<g filter="url(#kidShadow)">'
      + '<path d="M300 512 C360 520 412 548 426 592 C434 622 420 646 400 650 C384 654 372 640 382 628 C396 632 406 618 400 602 C388 570 352 546 296 538 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M350 542 L362 514 L374 548 Z" fill="' + DINO.spike + '" stroke="' + DINO.spikeDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M384 566 L402 542 L406 578 Z" fill="' + DINO.spike + '" stroke="' + DINO.spikeDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M408 600 L430 584 L424 618 Z" fill="' + DINO.spike + '" stroke="' + DINO.spikeDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '</g>'
      /* gai lưng hai bên */
      + '<g fill="' + DINO.spike + '" stroke="' + DINO.spikeDark + '" stroke-width="3" stroke-linejoin="round">'
      + '<path d="M198 382 L160 356 L196 418 Z"/><path d="M188 428 L152 412 L190 462 Z"/><path d="M194 474 L164 466 L200 510 Z"/>'
      + '<path d="M314 382 L352 356 L316 418 Z"/><path d="M324 428 L360 412 L322 462 Z"/><path d="M318 474 L348 466 L312 510 Z"/>'
      + '</g>'
      /* chân to + bàn chân 3 móng */
      + '<path d="M210 520 C198 552 200 598 210 628 C218 648 232 656 246 650 C258 646 260 632 252 622 L246 540 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>'
      + '<path d="M302 520 C314 552 312 598 302 628 C294 648 280 656 266 650 C254 646 252 632 260 622 L266 540 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>'
      + '<path d="M198 646 C206 636 228 636 244 646 C254 652 256 666 248 672 L190 672 C178 672 174 660 180 650 Z" fill="' + DINO.bodyDark + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>'
      + '<path d="M314 646 C306 636 284 636 268 646 C258 652 256 666 264 672 L322 672 C334 672 338 660 332 650 Z" fill="' + DINO.bodyDark + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>'
      + '<g fill="' + DINO.claw + '" stroke="' + DINO.bodyDark + '" stroke-width="3" stroke-linejoin="round">'
      + '<path d="M180 660 L162 654 L178 676 Z"/><path d="M198 664 L188 650 L204 676 Z"/><path d="M218 666 L216 650 L232 676 Z"/>'
      + '<path d="M332 660 L350 654 L334 676 Z"/><path d="M314 664 L324 650 L308 676 Z"/><path d="M294 666 L296 650 L280 676 Z"/>'
      + '</g>'
      /* tay nhỏ T-rex */
      + '<path d="M202 430 C182 438 174 456 180 470 C186 482 200 484 208 474 L214 446 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M310 430 C330 438 338 456 332 470 C326 482 312 484 304 474 L298 446 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<g fill="' + DINO.claw + '" stroke="' + DINO.bodyDark + '" stroke-width="2" stroke-linejoin="round">'
      + '<path d="M176 472 L168 486 L184 480 Z"/><path d="M190 478 L190 492 L200 482 Z"/>'
      + '<path d="M336 472 L344 486 L328 480 Z"/><path d="M322 478 L322 492 L312 482 Z"/>'
      + '</g>'
      /* thân + bụng + cổ */
      + '<path d="M212 376 C232 358 280 358 300 376 C334 394 344 440 334 500 C322 552 300 576 256 576 C212 576 190 552 178 500 C168 440 178 394 212 376 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>'
      + '<path d="M226 396 C244 386 268 386 286 396 L278 528 C268 550 244 550 234 528 Z" fill="' + DINO.belly + '"/>'
      + '<path d="M234 424 L278 424 M234 456 L278 456 M236 488 L276 488" stroke="#E4B476" stroke-width="5" stroke-linecap="round" opacity=".75"/>'
      + '<path d="M232 300 L232 386 C232 400 280 400 280 386 L280 300 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M240 306 L240 384 C248 392 264 392 272 384 L272 306" fill="' + DINO.belly + '" opacity=".55"/>'
      /* đầu khủng long */
      + '<path d="M190 166 C190 112 220 88 256 88 C292 88 322 112 322 166 L322 196 C322 220 314 238 300 250 C294 272 278 286 256 286 C234 286 218 272 212 250 C198 238 190 220 190 196 Z" fill="' + DINO.body + '" stroke="' + DINO.bodyDark + '" stroke-width="5" filter="url(#kidShadow)"/>'
      + '<path d="M238 90 L256 56 L274 90 Z" fill="' + DINO.spike + '" stroke="' + DINO.spikeDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M212 98 L198 68 L226 92 Z M300 98 L314 68 L286 92 Z" fill="' + DINO.spike + '" stroke="' + DINO.spikeDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<ellipse cx="256" cy="246" rx="42" ry="30" fill="' + DINO.belly + '" stroke="' + DINO.bodyDark + '" stroke-width="4"/>'
      + '<ellipse cx="240" cy="236" rx="5" ry="4" fill="' + DINO.eye + '"/><ellipse cx="272" cy="236" rx="5" ry="4" fill="' + DINO.eye + '"/>'
      + '<path d="M230 258 Q256 276 282 258" stroke="' + DINO.eye + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
      + '<path d="M238 262 L244 274 L250 262 M262 262 L268 274 L274 262" fill="' + DINO.claw + '" stroke="' + DINO.bodyDark + '" stroke-width="2" stroke-linejoin="round"/>'
      + '<ellipse cx="224" cy="190" rx="23" ry="26" fill="#FFFFFF" stroke="' + DINO.bodyDark + '" stroke-width="4"/>'
      + '<ellipse cx="288" cy="190" rx="23" ry="26" fill="#FFFFFF" stroke="' + DINO.bodyDark + '" stroke-width="4"/>'
      + '<ellipse cx="226" cy="193" rx="9" ry="14" fill="' + DINO.eye + '"/><ellipse cx="290" cy="193" rx="9" ry="14" fill="' + DINO.eye + '"/>'
      + '<circle cx="221" cy="186" r="4" fill="#FFFFFF"/><circle cx="285" cy="186" r="4" fill="#FFFFFF"/>'
      + '<path d="M200 166 Q224 154 246 166 M266 166 Q288 154 312 166" stroke="' + DINO.bodyDark + '" stroke-width="7" fill="none" stroke-linecap="round"/>';
  }

  /* ---- 26. Người ngoài hành tinh -------------------------------------- */
  var ALI = {
    skin: '#A87BE0', skinDark: '#7B54B8', suit: '#3FC6C0', suitDark: '#1F8E8A',
    glass: '#E8F7FF', eye: '#2B203A', boot: '#2E3A4E', gold: '#F5C63C'
  };

  function alienBody() {
    return groundShadow()
      + limbs(ALI.suit)
      + '<circle cx="188" cy="480" r="18" fill="' + ALI.skin + '" stroke="' + ALI.skinDark + '" stroke-width="4"/>'
      + '<circle cx="324" cy="480" r="18" fill="' + ALI.skin + '" stroke="' + ALI.skinDark + '" stroke-width="4"/>'
      + '<path d="M160 414 L204 408 M308 408 L352 414" stroke="' + ALI.suitDark + '" stroke-width="6" stroke-linecap="round" opacity=".7"/>'
      + '<path d="M226 292 L226 330 C226 346 286 346 286 330 L286 292 Z" fill="' + ALI.skin + '"/>'
      + '<path d="' + TORSO + '" fill="' + ALI.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M214 330 C230 344 282 344 298 330 L304 356 L256 390 L208 356 Z" fill="' + ALI.suitDark + '"/>'
      + '<circle cx="256" cy="404" r="20" fill="' + ALI.glass + '" stroke="' + ALI.suitDark + '" stroke-width="5"/>'
      + '<circle cx="256" cy="404" r="9" fill="' + ALI.gold + '"/>'
      + '<path d="M206 430 L306 430 M210 456 L302 456" stroke="' + ALI.glass + '" stroke-width="4" opacity=".55" stroke-linecap="round"/>'
      + '<path d="' + LEG_L + '" fill="' + ALI.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + ALI.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M200 520 L198 600 M312 520 L314 600" stroke="' + ALI.suitDark + '" stroke-width="5" opacity=".6"/>'
      + '<path d="' + FOOT_L + '" fill="' + ALI.boot + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + ALI.boot + '" filter="url(#kidShadow)"/>'
      /* đầu to, mắt đen láy, râu ăng-ten */
      + '<ellipse cx="256" cy="178" rx="84" ry="86" fill="' + ALI.skin + '" stroke="' + ALI.skinDark + '" stroke-width="5" filter="url(#kidShadow)"/>'
      + '<ellipse cx="224" cy="200" rx="24" ry="29" fill="' + ALI.glass + '" stroke="' + ALI.skinDark + '" stroke-width="4"/>'
      + '<ellipse cx="288" cy="200" rx="24" ry="29" fill="' + ALI.glass + '" stroke="' + ALI.skinDark + '" stroke-width="4"/>'
      + '<ellipse cx="228" cy="202" rx="11" ry="17" fill="' + ALI.eye + '"/><ellipse cx="284" cy="202" rx="11" ry="17" fill="' + ALI.eye + '"/>'
      + '<circle cx="223" cy="194" r="5" fill="#FFFFFF"/><circle cx="279" cy="194" r="5" fill="#FFFFFF"/>'
      + '<path d="M232 248 Q256 266 280 248" stroke="' + ALI.skinDark + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
      + '<ellipse cx="204" cy="236" rx="16" ry="8" fill="#FF9DBB" opacity=".35"/>'
      + '<ellipse cx="308" cy="236" rx="16" ry="8" fill="#FF9DBB" opacity=".35"/>'
      + '<path d="M220 100 C206 78 200 58 206 42 M292 100 C306 78 312 58 306 42" stroke="' + ALI.skinDark + '" stroke-width="6" fill="none" stroke-linecap="round"/>'
      + '<circle cx="206" cy="38" r="10" fill="' + ALI.gold + '" stroke="' + ALI.skinDark + '" stroke-width="3"/>'
      + '<circle cx="306" cy="38" r="10" fill="' + ALI.gold + '" stroke="' + ALI.skinDark + '" stroke-width="3"/>';
  }

  function alienTop() {
    return '<g fill="' + ALI.glass + '" opacity=".35">'
      + '<ellipse cx="214" cy="128" rx="24" ry="12" transform="rotate(-22 214 128)"/>'
      + '<ellipse cx="298" cy="128" rx="24" ry="12" transform="rotate(22 298 128)"/>'
      + '</g>';
  }

  /* ---- 27. Cyborg ----------------------------------------------------- */
  var CYB = {
    suit: '#2E3A4E', suitLight: '#42536B', metal: '#B8C6D8',
    metalDark: '#7C8CA3', red: '#FF5A4E', cyan: '#7BE8FF', gold: '#F5C63C'
  };

  function cyborgBody(sv) {
    return groundShadow()
      + '<path d="' + ARM_L + '" fill="' + CYB.metal + '" filter="url(#kidShadow)"/>'
      + '<path d="' + ARM_R + '" fill="' + CYB.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M160 430 L204 424" stroke="' + CYB.metalDark + '" stroke-width="8" stroke-linecap="round"/>'
      + '<path d="M162 454 L200 448" stroke="' + CYB.cyan + '" stroke-width="4" stroke-linecap="round" opacity=".8"/>'
      + '<circle cx="188" cy="466" r="12" fill="' + CYB.metalDark + '"/>'
      + '<path d="M310 430 L350 436" stroke="' + CYB.suitLight + '" stroke-width="8" stroke-linecap="round"/>'
      + neck(sv, 'url(#kidSkin)')
      + head(sv, 'url(#kidSkin)')
      + '<path d="' + TORSO + '" fill="' + CYB.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="M210 330 C230 344 282 344 302 330 L306 360 L256 392 L206 360 Z" fill="' + CYB.suitLight + '"/>'
      + '<circle cx="256" cy="404" r="18" fill="' + CYB.metal + '" stroke="' + CYB.metalDark + '" stroke-width="5"/>'
      + '<circle cx="256" cy="404" r="9" fill="' + CYB.cyan + '"/>'
      + '<path d="M204 428 L308 428 M206 454 L306 454" stroke="' + CYB.cyan + '" stroke-width="4" opacity=".6"/>'
      + '<path d="' + LEG_L + '" fill="' + CYB.suit + '" filter="url(#kidShadow)"/>'
      + '<path d="' + LEG_R + '" fill="' + CYB.metal + '" filter="url(#kidShadow)"/>'
      + '<circle cx="221" cy="558" r="14" fill="' + CYB.metalDark + '"/>'
      + '<circle cx="291" cy="558" r="14" fill="' + CYB.metalDark + '"/>'
      + '<path d="M200 514 L198 602 M312 514 L314 602" stroke="' + CYB.metalDark + '" stroke-width="6" opacity=".7"/>'
      + '<path d="' + FOOT_L + '" fill="' + CYB.suitLight + '" filter="url(#kidShadow)"/>'
      + '<path d="' + FOOT_R + '" fill="' + CYB.metalDark + '" filter="url(#kidShadow)"/>'
      + '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="#00000022" stroke-width="5" fill="none"/>';
  }

  function cyborgTop() {
    return '<g>'
      /* nửa mặt máy bên phải + mắt đỏ */
      + '<path d="M262 176 L324 184 L324 232 L268 228 Z" fill="' + CYB.metal + '" stroke="' + CYB.metalDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<rect x="276" y="190" width="34" height="26" rx="8" fill="' + CYB.suit + '" stroke="' + CYB.metalDark + '" stroke-width="3"/>'
      + '<rect x="284" y="196" width="18" height="14" rx="5" fill="' + CYB.red + '"/>'
      + '<path d="M270 228 L320 232 L316 252 L276 250 Z" fill="' + CYB.metalDark + '"/>'
      + '<circle cx="330" cy="210" r="10" fill="' + CYB.metal + '" stroke="' + CYB.metalDark + '" stroke-width="4"/>'
      + '<circle cx="330" cy="210" r="4" fill="' + CYB.cyan + '"/>'
      + '<path d="M204 338 C220 352 238 358 256 358" stroke="' + CYB.cyan + '" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- 28. Samurai ---------------------------------------------------- */
  var SAM = {
    armor: '#B83A3A', armorDark: '#7E2222', black: '#2B2A33', gold: '#F5C63C',
    cloth: '#3D5A80', handle: '#3B2A22'
  };

  function samuraiBack() {
    return '<g filter="url(#kidShadow)">'
      + '<path d="M150 470 L342 250" stroke="' + SAM.black + '" stroke-width="18" stroke-linecap="round"/>'
      + '<path d="M150 470 L342 250" stroke="' + SAM.gold + '" stroke-width="6" stroke-linecap="round" opacity=".5"/>'
      + '<path d="M326 266 L354 234" stroke="' + SAM.handle + '" stroke-width="16" stroke-linecap="round"/>'
      + '<path d="M330 262 L346 246" stroke="' + SAM.gold + '" stroke-width="4"/>'
      + '</g>';
  }

  function samuraiBody(sv) {
    return costumeFrame(sv, {
      torso: SAM.armor, arm: SAM.armor, neck: SAM.black, leg: SAM.black, foot: SAM.black,
      armDetail: '<path d="M158 386 L206 378 M306 378 L354 386" stroke="' + SAM.gold + '" stroke-width="6" stroke-linecap="round"/>'
        + '<path d="M154 398 C164 386 188 384 202 394 L204 424 C190 436 164 434 152 422 Z" fill="' + SAM.armorDark + '" stroke="' + SAM.gold + '" stroke-width="4"/>'
        + '<path d="M358 398 C348 386 324 384 310 394 L308 424 C322 436 348 434 360 422 Z" fill="' + SAM.armorDark + '" stroke="' + SAM.gold + '" stroke-width="4"/>'
        + '<path d="M160 446 L202 440 M310 440 L352 446" stroke="' + SAM.gold + '" stroke-width="5" opacity=".7"/>',
      torsoDetail: '<path d="M212 330 C232 344 280 344 300 330 L306 356 L256 392 L206 356 Z" fill="' + SAM.armorDark + '"/>'
        + '<path d="M220 360 L292 360 M220 386 L292 386 M222 412 L290 412 M224 438 L288 438" stroke="' + SAM.gold + '" stroke-width="4" opacity=".7"/>'
        + '<path d="M256 392 L256 474" stroke="' + SAM.black + '" stroke-width="7" opacity=".5"/>'
        + belt(SAM.black, SAM.gold, '#C99A10')
        + '<path d="M206 350 L198 472 M306 350 L314 472" stroke="' + SAM.gold + '" stroke-width="4" opacity=".55"/>',
      legDetail: '<path d="M200 530 L196 600 M312 530 L316 600" stroke="' + SAM.gold + '" stroke-width="5" opacity=".5"/>'
        + '<path d="M194 586 L252 586 M260 586 L318 586" stroke="' + SAM.armor + '" stroke-width="8" stroke-linecap="round"/>',
      footDetail: '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="' + SAM.gold + '" stroke-width="4" fill="none" opacity=".45"/>'
    });
  }

  function samuraiTop() {
    return '<g>'
      + '<path d="M178 170 C208 154 304 154 334 170 L330 190 C300 176 212 176 182 190 Z" fill="' + SAM.black + '" stroke="' + SAM.gold + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M334 176 L366 192 L338 204 Z" fill="' + SAM.armor + '" stroke="' + SAM.armorDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M256 154 L256 124" stroke="' + SAM.gold + '" stroke-width="5"/>'
      + '<path d="M238 134 L256 112 L274 134 Z" fill="' + SAM.gold + '" stroke="' + SAM.armorDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '</g>';
  }

  /* ---- 29. Cao bồi ---------------------------------------------------- */
  var COW = {
    hat: '#8A5A2F', hatDark: '#5D3B1F', vest: '#6B4228', shirt: '#D9534F',
    bandana: '#3E7BB6', jeans: '#3D5A80', boot: '#4A2C18', gold: '#F5C63C'
  };

  function cowboyBody(sv) {
    return costumeFrame(sv, {
      torso: COW.shirt, arm: COW.shirt, neck: 'url(#kidSkin)', leg: COW.jeans, foot: COW.boot,
      armDetail: '<path d="M158 430 L202 424 M310 424 L354 430" stroke="#B83A3A" stroke-width="7" stroke-linecap="round"/>'
        + '<rect x="150" y="444" width="58" height="46" rx="18" fill="' + COW.shirt + '" stroke="#B83A3A" stroke-width="4"/>'
        + '<rect x="304" y="444" width="58" height="46" rx="18" fill="' + COW.shirt + '" stroke="#B83A3A" stroke-width="4"/>'
        + '<path d="M158 454 L198 448 M314 448 L354 454" stroke="' + COW.gold + '" stroke-width="4" opacity=".6"/>',
      torsoDetail: '<path d="M208 330 C224 344 288 344 304 330 L310 480 L284 500 L256 456 L228 500 L202 480 Z" fill="' + COW.vest + '"/>'
        + '<path d="M228 330 L256 390 L242 430 L216 350 Z" fill="#8A5A2F"/>'
        + '<path d="M284 330 L256 390 L270 430 L296 350 Z" fill="#8A5A2F"/>'
        + '<g fill="' + COW.gold + '"><circle cx="236" cy="400" r="5"/><circle cx="236" cy="432" r="5"/><circle cx="236" cy="464" r="5"/></g>'
        + belt(COW.boot, COW.gold, '#C99A10')
        + '<path d="M208 470 L304 470" stroke="#3B2A22" stroke-width="4" opacity=".5"/>',
      legDetail: '<path d="M192 512 C180 544 182 586 192 612 M320 512 C332 544 330 586 320 612" stroke="#B8894A" stroke-width="6" fill="none" opacity=".55"/>'
        + '<path d="M198 560 L250 560 M262 560 L314 560" stroke="#B8894A" stroke-width="4" opacity=".5"/>',
      footDetail: bootShafts(COW.boot, COW.gold)
        + '<path d="M190 664 Q220 674 251 664 M261 664 Q292 674 322 664" stroke="#00000022" stroke-width="5" fill="none"/>'
    });
  }

  function cowboyTop() {
    return '<g>'
      /* mũ cao bồi */
      + '<ellipse cx="256" cy="150" rx="118" ry="26" fill="' + COW.hat + '" stroke="' + COW.hatDark + '" stroke-width="5"/>'
      + '<path d="M190 146 C190 94 214 70 256 70 C298 70 322 94 322 146 Z" fill="' + COW.hat + '" stroke="' + COW.hatDark + '" stroke-width="5"/>'
      + '<path d="M190 146 C230 158 282 158 322 146" stroke="' + COW.hatDark + '" stroke-width="4" fill="none"/>'
      + '<rect x="190" y="136" width="132" height="16" rx="8" fill="' + COW.hatDark + '"/>'
      + '<path d="M208 144 L304 144" stroke="' + COW.gold + '" stroke-width="4" opacity=".6"/>'
      /* khăn quàng cổ */
      + '<path d="M196 300 C222 322 290 322 316 300 L314 326 C288 346 224 346 198 326 Z" fill="' + COW.bandana + '"/>'
      + '<path d="M256 322 L274 360 L256 350 L238 360 Z" fill="' + COW.bandana + '"/>'
      + '<path d="M206 310 C232 326 280 326 306 310" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="5" fill="none"/>'
      + '</g>';
  }

  /* ---- 30. Họa sĩ ----------------------------------------------------- */
  var ART = {
    beret: '#D9534F', beretDark: '#A6322E', apron: '#E8DCC8', apronDark: '#C9B99A',
    shirt: '#5DA9E8', jeans: '#3D5A80', shoe: '#6B4228', paint: '#F5C63C'
  };

  function artistBody(sv) {
    return costumeFrame(sv, {
      torso: ART.shirt, arm: ART.shirt, neck: 'url(#kidSkin)', leg: ART.jeans, foot: ART.shoe,
      armDetail: '<path d="M158 428 L202 422 M310 422 L354 428" stroke="#2F6FA8" stroke-width="6" stroke-linecap="round"/>'
        + '<path d="M160 446 L198 440 M314 440 L352 446" stroke="#FFD166" stroke-width="5" stroke-linecap="round" opacity=".8"/>',
      torsoDetail: '<path d="M214 340 C230 352 282 352 298 340 L306 480 C284 496 228 496 206 480 Z" fill="' + ART.apron + '"/>'
        + '<path d="M226 340 L226 320 M286 340 L286 320" stroke="' + ART.apronDark + '" stroke-width="4"/>'
        + '<path d="M230 380 L282 380" stroke="' + ART.apronDark + '" stroke-width="5" opacity=".7"/>'
        + '<rect x="238" y="400" width="36" height="30" rx="6" fill="' + ART.apronDark + '" opacity=".55"/>'
        + '<path d="M242 410 L270 410 M242 420 L264 420" stroke="' + ART.apron + '" stroke-width="3"/>'
        + '<g opacity=".8"><circle cx="226" cy="454" r="6" fill="#F5C63C"/><circle cx="244" cy="466" r="5" fill="#3E8E5A"/><circle cx="270" cy="458" r="6" fill="#E8453C"/><circle cx="286" cy="474" r="5" fill="#8B5CC7"/></g>'
        + '<path d="M206 476 L306 476" stroke="' + ART.apronDark + '" stroke-width="4" opacity=".5"/>',
      legDetail: '<path d="M200 530 L196 600 M312 530 L316 600" stroke="#2F4A6B" stroke-width="5" opacity=".55"/>'
        + '<circle cx="302" cy="556" r="5" fill="#F5C63C" opacity=".7"/>',
      footDetail: '<path d="M190 650 L250 650 M262 650 L322 650" stroke="#8A5A2F" stroke-width="4" opacity=".6"/>'
    });
  }

  function artistTop() {
    return '<g>'
      /* mũ nồi */
      + '<path d="M180 140 C176 104 206 82 256 82 C300 82 332 104 334 136 C300 124 216 124 180 140 Z" fill="' + ART.beret + '" stroke="' + ART.beretDark + '" stroke-width="5" stroke-linejoin="round"/>'
      + '<path d="M256 82 L262 62" stroke="' + ART.beretDark + '" stroke-width="5" stroke-linecap="round"/>'
      + '<path d="M196 136 C226 124 286 124 320 136" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="5" fill="none"/>'
      /* bảng pha màu + cọ vẽ */
      + '<g transform="rotate(-12 154 472)">'
      + '<ellipse cx="154" cy="472" rx="36" ry="26" fill="#C9A26B" stroke="#8A5A2F" stroke-width="4"/>'
      + '<ellipse cx="168" cy="482" rx="7" ry="5" fill="' + ART.apron + '"/>'
      + '<circle cx="136" cy="462" r="6" fill="#F5C63C"/><circle cx="152" cy="454" r="6" fill="#E8453C"/>'
      + '<circle cx="170" cy="462" r="6" fill="#3E8E5A"/><circle cx="144" cy="480" r="6" fill="#8B5CC7"/>'
      + '</g>'
      + '<path d="M178 450 L214 414" stroke="#8A5A2F" stroke-width="7" stroke-linecap="round"/>'
      + '<path d="M214 414 L226 402" stroke="#C9A26B" stroke-width="9" stroke-linecap="round"/>'
      + '<path d="M226 402 L236 392" stroke="#2B2A33" stroke-width="8" stroke-linecap="round"/>'
      + '</g>';
  }

  /* ---- 31. Nhà khoa học ----------------------------------------------- */
  var SCI = {
    coat: '#F4F7FB', coatDark: '#D5DFEA', shirt: '#3EB8A8', pants: '#4A5A70',
    shoe: '#2E2E38', goggle: '#2E2E38', lens: '#9BE8FF', pen: '#E8453C', gold: '#F5C63C'
  };

  function scientistBody(sv) {
    return costumeFrame(sv, {
      torso: SCI.coat, arm: SCI.coat, neck: SCI.shirt, leg: SCI.pants, foot: SCI.shoe,
      armDetail: '<path d="M158 432 L202 426 M310 426 L354 432" stroke="' + SCI.coatDark + '" stroke-width="5" stroke-linecap="round"/>'
        + '<rect x="152" y="446" width="54" height="44" rx="18" fill="' + SCI.coat + '" stroke="' + SCI.coatDark + '" stroke-width="4"/>'
        + '<rect x="306" y="446" width="54" height="44" rx="18" fill="' + SCI.coat + '" stroke="' + SCI.coatDark + '" stroke-width="4"/>'
        + '<path d="M162 456 L198 450 M314 450 L350 456" stroke="' + SCI.shirt + '" stroke-width="4" opacity=".75"/>',
      torsoDetail: '<path d="M214 326 L256 390 L242 420 L206 346 Z" fill="' + SCI.coatDark + '"/>'
        + '<path d="M298 326 L256 390 L270 420 L306 346 Z" fill="' + SCI.coatDark + '"/>'
        + '<path d="M232 326 L256 370 L280 326 Z" fill="' + SCI.shirt + '"/>'
        + '<path d="M256 390 L256 500" stroke="' + SCI.coatDark + '" stroke-width="5" opacity=".7"/>'
        + '<rect x="214" y="430" width="34" height="40" rx="5" fill="' + SCI.coat + '" stroke="' + SCI.coatDark + '" stroke-width="3"/>'
        + '<rect x="264" y="430" width="34" height="40" rx="5" fill="' + SCI.coat + '" stroke="' + SCI.coatDark + '" stroke-width="3"/>'
        + '<path d="M220 438 L240 438 M220 448 L236 448 M270 438 L290 438 M270 448 L286 448" stroke="' + SCI.coatDark + '" stroke-width="3"/>'
        + '<path d="M282 356 L282 380" stroke="' + SCI.pen + '" stroke-width="5" stroke-linecap="round"/>'
        + '<path d="M292 352 L292 380" stroke="' + SCI.gold + '" stroke-width="5" stroke-linecap="round"/>'
        + '<rect x="210" y="360" width="26" height="18" rx="4" fill="' + SCI.gold + '" stroke="#C99A10" stroke-width="3"/>'
        + '<path d="M216 366 L230 366 M216 372 L226 372" stroke="#FFFFFF" stroke-width="2" opacity=".7"/>'
        + '<path d="M206 490 L306 490" stroke="' + SCI.coatDark + '" stroke-width="4" opacity=".6"/>',
      legDetail: '<path d="M200 530 L196 600 M312 530 L316 600" stroke="#34445A" stroke-width="5" opacity=".6"/>',
      footDetail: '<path d="M190 650 L250 650 M262 650 L322 650" stroke="#FFFFFF" stroke-width="4" opacity=".55"/>'
    });
  }

  function scientistTop() {
    return '<g>'
      /* kính bảo hộ đeo trên trán */
      + '<path d="M186 154 C212 162 300 162 326 154" stroke="' + SCI.goggle + '" stroke-width="10" fill="none" stroke-linecap="round"/>'
      + '<circle cx="224" cy="158" r="23" fill="' + SCI.lens + '" stroke="' + SCI.goggle + '" stroke-width="5"/>'
      + '<circle cx="288" cy="158" r="23" fill="' + SCI.lens + '" stroke="' + SCI.goggle + '" stroke-width="5"/>'
      + '<path d="M247 158 L265 158" stroke="' + SCI.goggle + '" stroke-width="7"/>'
      + '<path d="M210 148 A16 16 0 0 1 224 140" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="4" fill="none"/>'
      + '<path d="M274 148 A16 16 0 0 1 288 140" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="4" fill="none"/>'
      /* kẹp bảng ghi chú bên tay phải */
      + '<g transform="rotate(-8 360 470)">'
      + '<rect x="332" y="430" width="58" height="78" rx="8" fill="#C9A26B" stroke="#8A5A2F" stroke-width="4"/>'
      + '<rect x="340" y="424" width="42" height="14" rx="5" fill="#8A5A2F"/>'
      + '<path d="M342 452 L380 452 M342 464 L374 464 M342 476 L380 476" stroke="#F4F7FB" stroke-width="4" stroke-linecap="round"/>'
      + '</g>'
      + '</g>';
  }

  /* ---- 32. Vũ công ballet --------------------------------------------- */
  var BAL = {
    leotard: '#F28BB5', leotardDark: '#C75E8B', tutu: '#FFC2D8',
    tutuDark: '#E995B8', tight: '#F7D6E2', shoe: '#F28BB5', ribbon: '#FF6E9C', gold: '#F5C63C'
  };

  function ballerinaBody(sv) {
    return femaleBody(sv)
      + '<path d="' + TORSO_GIRL + '" fill="' + BAL.leotard + '" filter="url(#kidShadow)"/>'
      + '<path d="M214 330 C232 344 280 344 298 330 L292 470 C280 486 232 486 220 470 Z" fill="' + BAL.leotardDark + '" opacity=".35"/>'
      + '<path d="M216 505 L248 505 L246 632 C246 646 238 654 228 654 C216 654 210 645 212 632 Z" fill="' + BAL.tight + '"/>'
      + '<path d="M264 505 L296 505 L300 632 C302 645 296 654 284 654 C273 654 266 646 266 632 Z" fill="' + BAL.tight + '"/>'
      + '<path d="M190 488 C210 470 302 470 322 488 C340 506 344 530 336 548 C312 534 286 534 256 542 C226 534 200 534 176 548 C168 530 172 506 190 488 Z" fill="' + BAL.tutu + '" filter="url(#kidShadow)"/>'
      + '<path d="M184 504 C208 492 304 492 328 504 M180 524 C208 512 304 512 332 524" stroke="' + BAL.tutuDark + '" stroke-width="5" fill="none" opacity=".7"/>'
      + '<path d="M212 632 C220 624 240 624 248 632 L248 650 C238 658 220 658 212 650 Z" fill="' + BAL.shoe + '" stroke="' + BAL.leotardDark + '" stroke-width="4"/>'
      + '<path d="M300 632 C292 624 272 624 264 632 L264 650 C274 658 292 658 300 650 Z" fill="' + BAL.shoe + '" stroke="' + BAL.leotardDark + '" stroke-width="4"/>'
      + '<path d="M216 616 L224 600 M238 616 L232 600 M296 616 L288 600 M274 616 L280 600" stroke="' + BAL.ribbon + '" stroke-width="4" stroke-linecap="round"/>'
      + '<path d="M226 328 C242 340 270 340 286 328" stroke="' + BAL.leotardDark + '" stroke-width="4" fill="none" opacity=".6"/>';
  }

  function ballerinaTop() {
    return '<g>'
      + '<path d="M206 54 C218 40 238 40 250 54 L238 70 Z" fill="' + BAL.ribbon + '" stroke="' + BAL.leotardDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<path d="M306 54 C294 40 274 40 262 54 L274 70 Z" fill="' + BAL.ribbon + '" stroke="' + BAL.leotardDark + '" stroke-width="3" stroke-linejoin="round"/>'
      + '<circle cx="256" cy="54" r="9" fill="' + BAL.ribbon + '" stroke="' + BAL.leotardDark + '" stroke-width="3"/>'
      + '<path d="M198 150 Q256 122 314 150" stroke="' + BAL.gold + '" stroke-width="5" fill="none"/>'
      + '<path d="M256 126 L252 108 L260 108 Z" fill="' + BAL.gold + '" stroke="' + BAL.leotardDark + '" stroke-width="2" stroke-linejoin="round"/>'
      + '</g>';
  }

  /** 3 móc vẽ bộ đồ, tra theo mã thân. `null` = thân người thường. */
  var HERO_SUITS = {
    body_rider_01: { body: riderBody, back: riderBack, top: riderTop },
    body_superman_01: { body: supermanBody, back: supermanBack, top: supermanTop },
    body_kaiju_01: { body: kaijuBody, back: kaijuBack, top: kaijuTop },
    body_ghost_01: { body: ghostBody, back: ghostBack, top: ghostTop },
    body_popstar_01: { body: popstarBody, back: popstarBack, top: popstarTop },
    /* 20 thân chủ đề */
    body_astronaut_01: { body: astronautBody, back: astronautBack, top: astronautTop },
    body_ninja_01: { body: ninjaBody, back: ninjaBack, top: ninjaTop },
    body_robot_01: { body: robotBody, back: noBack, top: robotTop },
    body_pirate_01: { body: pirateBody, back: noBack, top: pirateTop },
    body_vampire_01: { body: vampireBody, back: vampireBack, top: vampireTop },
    body_doctor_01: { body: doctorBody, back: noBack, top: doctorTop },
    body_firefighter_01: { body: firefighterBody, back: noBack, top: firefighterTop },
    body_teacher_01: { body: teacherBody, back: noBack, top: teacherTop },
    body_police_01: { body: policeBody, back: noBack, top: policeTop },
    body_chef_01: { body: chefBody, back: noBack, top: chefTop },
    body_pilot_01: { body: pilotBody, back: noBack, top: pilotTop },
    body_prince_01: { body: princeBody, back: noBack, top: princeTop },
    body_princess_01: { body: princessBody, back: noBack, top: princessTop },
    body_knight_01: { body: knightBody, back: knightBack, top: knightTop },
    body_witch_01: { body: witchBody, back: noBack, top: witchTop },
    body_fairy_01: { body: fairyBody, back: fairyBack, top: fairyTop },
    body_skeleton_01: { body: skeletonBody, back: noBack, top: skeletonTop },
    body_snowman_01: { body: snowmanBody, back: noBack, top: snowmanTop },
    body_santa_01: { body: santaBody, back: noBack, top: santaTop },
    body_ghost_halloween_01: { body: halloweenBody, back: halloweenBack, top: halloweenTop },
    /* 12 thân bổ sung */
    body_mermaid_01: { body: mermaidBody, back: noBack, top: mermaidTop },
    body_werewolf_01: { body: werewolfBody, back: werewolfBack, top: werewolfTop },
    body_elf_01: { body: elfBody, back: elfBack, top: elfTop },
    body_genie_01: { body: genieBody, back: noBack, top: genieTop },
    body_dino_01: { body: dinoBody, back: noBack, top: noTop },
    body_alien_01: { body: alienBody, back: noBack, top: alienTop },
    body_cyborg_01: { body: cyborgBody, back: noBack, top: cyborgTop },
    body_samurai_01: { body: samuraiBody, back: samuraiBack, top: samuraiTop },
    body_cowboy_01: { body: cowboyBody, back: noBack, top: cowboyTop },
    body_artist_01: { body: artistBody, back: noBack, top: artistTop },
    body_scientist_01: { body: scientistBody, back: noBack, top: scientistTop },
    body_ballerina_01: { body: ballerinaBody, back: noBack, top: ballerinaTop }
  };

  /** Thân không có lớp vẽ sau lưng — giữ móc rỗng để renderKid không phải rẽ nhánh. */
  function noBack() {
    return '';
  }

  /** Thân không có chi tiết vẽ trên cùng. */
  function noTop() {
    return '';
  }


  /** Thân có bộ đồ vẽ sẵn → hồ sơ được phép bỏ áo/váy/quần/giày (một nguồn: BODIES). */
  function isSuitBody(body) {
    return !!(BODIES[body] && BODIES[body].selfClothed);
  }

  function bodySvg(sv, body) {
    var suit = HERO_SUITS[body];
    if (suit) return suit.body(sv);
    return body === 'body_girl_01' ? femaleBody(sv) : humanBody(sv);
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
  /* Mỗi lần render cấp id gradient/filter riêng: trang admin và trang "Thân
   * Avatar" vẽ NHIỀU nhân vật trong cùng một document. Nếu giữ id cố định thì
   * trình duyệt chỉ đọc phần tử đầu tiên trùng id → mọi thân lấy màu da/tóc của
   * thân đầu danh sách. Hậu tố tăng dần giữ nguyên hình, chỉ tách id. */
  function uniquifyKidIds(svg) {
    var n = ++_seq;
    return svg.replace(/kid(Skin|Hair|Shadow|Blur)/g, function (m, p) { return 'kid' + p + n; });
  }

  function renderKid(raw) {
    var s = sanitizeKid(raw);
    if (s.body === 'body_dragon_01') {
      /* Rồng là SVG khép kín có defs riêng; cũng cấp hậu tố id để nhiều rồng
       * trên cùng một trang (admin/preview) không tranh gradient & bóng đổ. */
      return uniquifyKidIds('<svg viewBox="0 0 ' + KID_W + ' ' + KID_H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rồng xanh" color="'
        + (HAIR_COLORS[s.hairColor] || HAIR_COLORS['nâu']) + '">'
        + (root.EG_DRAGON_SVG || '') + '</svg>');
    }

    var sv = skinVars(s.skin);
    var slots = bodySlots(s.body);
    var hairColor = HAIR_COLORS[s.hairColor] || HAIR_COLORS['nâu'];
    var hair = HAIRS[s.hair] || HAIRS.hair_01;
    var acc = ACCS[s.acc] || null;
    var bodyName = (BODIES[s.body] && BODIES[s.body].n) || 'Nhân vật Bé';
    var o = '<svg viewBox="0 0 ' + KID_W + ' ' + KID_H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'
      + bodyName + '" color="' + hairColor + '">';
    o += kidDefs(sv, hairColor);

    /* 1. phụ kiện nằm sau thân (áo choàng, túi) + thứ treo sau lưng bộ đồ */
    if (acc && acc.b) o += acc.b;
    var suit = HERO_SUITS[s.body];
    if (suit) o += suit.back();
    /* 2. tóc sau — thân không có tóc (kaiju, ma) thì không vẽ */
    if (slots.indexOf('hair') >= 0) o += '<g fill="url(#kidHair)">' + hair.back + '</g>';
    /* 3. thân: tay + cổ + đầu (+ thân & chân trần cho bé gái, + bộ đồ anh hùng) */
    o += bodySvg(sv, s.body);
    /* 4. mặt — kaiju/ma đã tự vẽ mắt miệng trong body() */
    if (slots.indexOf('face') >= 0) o += FACES[s.face] ? FACES[s.face].svg : FACES.face_01.svg;
    /* 5. tóc trước */
    if (slots.indexOf('hair') >= 0) o += '<g fill="url(#kidHair)">' + hair.front + '</g>';
    /* 6. áo hoặc váy phủ thân — mỗi body có đường may riêng */
    if (s.dress) o += dressSvg(DRESS_COLORS[s.dress], s.body);
    else if (s.shirt) o += shirtSvg(SHIRT_COLORS[s.shirt], s.body);
    /* 7. quần — bé gái có chân trần, bộ đồ anh hùng đã tự vẽ chân → bỏ trống được */
    var bare = !isGirlBody(s.body) && !suit;
    if (!s.dress) {
      if (s.pants) o += pantsSvg(s.pants, s.body);
      else if (bare) o += DEFAULT_PANTS;
    }
    /* 8. giày */
    if (s.shoes) o += shoesSvg(SHOE_OPTIONS[s.shoes].c, s.body);
    else if (bare) o += DEFAULT_SHOES;
    /* 8b. chi tiết bộ đồ đè lên áo quần: mũ, thắt lưng, phù hiệu, bốt */
    if (suit) o += suit.top();
    /* 9. phụ kiện đè lên trên */
    if (acc && acc.f) o += acc.f;
    /* 10. kính + mũ */
    o += GLASSES[s.glasses] ? GLASSES[s.glasses].svg : '';
    o += HATS[s.hat] ? HATS[s.hat].svg : '';

    return uniquifyKidIds(o + '</svg>');
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
    /* bộ đồ đã là "quần áo" rồi → mặc định bỏ áo/váy/quần/giày để hiện nguyên hình */
    body_rider_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_superman_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_dragon_01: {},
    /* kaiju/ghost không có áo quần trong slots → sanitize tự bỏ trống hết */
    body_kaiju_01: {},
    body_ghost_01: {},
    body_popstar_01: { hair: 'hair_01', hairColor: 'đen' },
    /* 20 thân chủ đề — "diện" mặc định: bộ đồ đã vẽ sẵn nên bỏ trống áo/váy/
     * quần/giày để thấy nguyên nhân vật; chỉ giữ tóc + màu tóc hợp nhân vật. */
    body_astronaut_01: { hair: 'hair_01', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_ninja_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_robot_01: {},
    body_pirate_01: { hair: 'hair_05', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_vampire_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_doctor_01: { hair: 'hair_01', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_firefighter_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_teacher_01: { hair: 'hair_04', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_police_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_chef_01: { hair: 'hair_01', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_pilot_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_prince_01: { hair: 'hair_01', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_princess_01: { hair: 'hair_02', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_knight_01: { hair: 'hair_01', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_witch_01: { hair: 'hair_02', hairColor: 'tím', shirt: null, dress: null, pants: null, shoes: null },
    body_fairy_01: { hair: 'hair_02', hairColor: 'vàng', shirt: null, dress: null, pants: null, shoes: null },
    body_skeleton_01: { hair: 'hair_01', hairColor: 'bạc', shirt: null, dress: null, pants: null, shoes: null },
    body_snowman_01: {},
    body_santa_01: { hair: 'hair_01', hairColor: 'bạc', shirt: null, dress: null, pants: null, shoes: null },
    body_ghost_halloween_01: {},
    /* 12 thân bổ sung — nữ: tóc dài/đuôi ngựa/búi; nam: tóc ngắn/topknot.
     * Thân không có tóc (dino/alien) để trống, sanitize tự bỏ hết đồ. */
    body_mermaid_01: { hair: 'hair_02', hairColor: 'đỏ', shirt: null, dress: null, pants: null, shoes: null },
    body_werewolf_01: { hair: 'hair_01', hairColor: 'xám', shirt: null, dress: null, pants: null, shoes: null },
    body_elf_01: { hair: 'hair_02', hairColor: 'vàng', shirt: null, dress: null, pants: null, shoes: null },
    body_genie_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_dino_01: {},
    body_alien_01: {},
    body_cyborg_01: { hair: 'hair_01', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_samurai_01: { hair: 'hair_04', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_cowboy_01: { hair: 'hair_01', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_artist_01: { hair: 'hair_02', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null },
    body_scientist_01: { hair: 'hair_03', hairColor: 'đen', shirt: null, dress: null, pants: null, shoes: null },
    body_ballerina_01: { hair: 'hair_04', hairColor: 'nâu', shirt: null, dress: null, pants: null, shoes: null }
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

  /* Bản "trống" của bé gái: thân + váy + tóc theo bảng BODY_LOOKS. Đặt SAU
   * KID_FIELD_IDS vì `applyBody` → `sanitizeKid` đọc bảng đó.
   * KID_DEFAULTS chỉ có một và là bé trai, nên bé gái phải suy ra từ nó — nếu
   * không, bé chọn "Bạn gái" ở màn chào vẫn bị vẽ thành bé trai. */
  var KID_DEFAULTS_GIRL = applyBody(KID_DEFAULTS, 'body_girl_01');

  /** Bộ đồ mở màn theo giới tính đã chọn ("boy" | "girl" | null). */
  function kidDefaultsFor(gender) {
    return gender === 'girl' ? KID_DEFAULTS_GIRL : KID_DEFAULTS;
  }

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
      case 'pants': return { kind: 'svg', vb: '150 480 212 150', ids: idsOf('pants'), nullable: true, pv: function (id) { return pantsSvg(id, s.body); } };
      case 'shoes': return { kind: 'dot', ids: idsOf('shoes'), nullable: true, dot: function (id) { return SHOE_OPTIONS[id].c; } };
      case 'glasses': return { kind: 'svg', vb: '150 170 212 90', ids: idsOf('glasses'), nullable: true, pv: function (id) { return GLASSES[id] ? GLASSES[id].svg : ''; } };
      case 'hat': return { kind: 'svg', vb: '100 30 312 210', ids: idsOf('hat'), nullable: true, pv: function (id) { return HATS[id] ? HATS[id].svg : ''; } };
      case 'acc': return { kind: 'svg', vb: '100 300 312 340', vbFor: accVb, ids: idsOf('acc'), nullable: true, pv: function (id) { return accPreview(id); } };
      default: return { kind: 'list', ids: [], nullable: false };
    }
  }

  function hairPreview(id, s) {
    var h = HAIRS[id];
    if (!h) return '';
    var c = HAIR_COLORS[(s && s.hairColor) || 'nâu'] || '#6B4228';
    return '<g fill="url(#kidHairPV)" color="' + c + '">'
      + '<defs><linearGradient id="kidHairPV" x1="180" y1="90" x2="330" y2="210">'
      + '<stop offset="0%" stop-color="' + c + '" stop-opacity="0.82"/><stop offset="100%" stop-color="' + c + '"/></linearGradient></defs>'
      + h.back + h.front + '</g>';
  }

  function accPreview(id) {
    var a = ACCS[id];
    if (!a) return '';
    return (a.b || '') + (a.f || '');
  }

  /* Khung nhìn riêng cho từng phụ kiện: mũ tai nghe nằm trên đầu (y 58–260) còn
   * nơ/khăn/dây chuyền ở ngực → dùng chung một viewBox sẽ cắt mất đồ. Ô preview
   * vuông gọi `cfg.vbFor(id)` để lấy đúng vùng của món đang xem. */
  var ACC_VB = {
    acc_01: '190 318 130 82',
    acc_02: '178 320 158 164',
    acc_03: '198 324 116 104',
    acc_04: '144 48 224 224',
    acc_05: '202 320 196 272',
    acc_06: '108 312 296 340'
  };

  function accVb(id) {
    return ACC_VB[id] || '100 300 312 340';
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

  /** Chỉ nhân vật người mới có mặt/tóc/da; váy thì ẩn quần.
   *  Danh sách tab lấy từ `slots` của thân đang chọn — thêm thân chỉ cần khai
   *  báo slots trong BODIES, tab + modal + trang admin tự theo đó. */
  function kidTabs(st) {
    var s = sanitizeKid(st);
    var slots = bodySlots(s.body);
    return KID_TABS.filter(function (t) {
      if (t.k === 'body') return true;
      if (slots.indexOf(t.k) < 0) return false;
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
    /* không nhận linh kiện nào thì bỏ lớp đó đi (kaiju/ma/rồng): lớp tuỳ chọn
     * về null, lớp bắt buộc (da/mặt/tóc) về mặc định để hồ sơ sạch */
    var slots = bodySlots(out.body);
    Object.keys(KID_FIELD_IDS).forEach(function (k) {
      if (k === 'body' || slots.indexOf(k) >= 0) return;
      out[k] = KID_FIELD_IDS[k].indexOf(null) >= 0 ? null : KID_DEFAULTS[k];
    });
    /* mặc váy thì không có quần — giữ state sạch để profile và server khớp */
    if (out.dress) out.pants = null;
    /* body_01 không vẽ thân/chân bằng da → bắt buộc có giày, và áo/quần khi
     * không mặc váy, nếu không nhân vật sẽ khuyết nửa người. Bé gái đã có chân
     * trần, bộ đồ anh hùng đã vẽ đủ thân/chân → bỏ trống được. */
    if (!isGirlBody(out.body) && !isSuitBody(out.body)) {
      if (slots.indexOf('shoes') >= 0 && !SHOE_OPTIONS[out.shoes]) out.shoes = KID_DEFAULTS.shoes;
      if (!out.dress) {
        if (slots.indexOf('shirt') >= 0 && !SHIRT_COLORS[out.shirt]) out.shirt = KID_DEFAULTS.shirt;
        if (slots.indexOf('pants') >= 0 && !PANT_OPTIONS[out.pants]) out.pants = KID_DEFAULTS.pants;
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
      /** bộ đồ mở màn của bé gái (thân `body_girl_01` + váy) */
      defaultsGirl: KID_DEFAULTS_GIRL,
      /** chọn bộ đồ mở màn theo giới tính: kid.defaultsFor('girl') */
      defaultsFor: kidDefaultsFor,
      tabCfg: tabCfg,
      bodies: BODIES, faces: FACES, hairs: HAIRS, hats: HATS,
      glasses: GLASSES, accs: ACCS, pants: PANT_OPTIONS, shoes: SHOE_OPTIONS,
      shirtColors: SHIRT_COLORS, dressColors: DRESS_COLORS,
      hairColors: HAIR_COLORS, skinTones: SKIN_TONES,
      /** "diện" chuẩn của từng thân — preset admin và modal cùng dùng bảng này */
      looks: BODY_LOOKS,
      /** mã body hệ cũ → mã hệ mới (body_boy_01 → body_01 …) */
      bodyAliases: BODY_ALIASES,
      /** mọi nhóm linh kiện (theo thứ tự tab) + nhóm mà từng thân nhận */
      allTabs: KID_TABS,
      slotKeys: HUMAN_SLOTS,
      bodySlots: bodySlots
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);