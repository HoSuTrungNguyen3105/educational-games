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
   *  PHẦN 2 — BÉ / QUÁI VẬT  (nguồn: Tiệm thời trang cho Bé.html)
   * ===================================================================== */

  var SKIN = { s1: ['#fdfaf2', '#ecc9a8'], s2: ['#f6d9bc', '#e5b88f'], s3: ['#dcab7c', '#c48f60'], s4: ['#a97048', '#8c5a37'] };

  var HAIR = {
    spikyBrown: ['spiky', '#6b4226'], spikyBlack: ['spiky', '#25252e'],
    shortBrown: ['short', '#8a5a2f'], shortBlack: ['short', '#25252e'],
    longBlack: ['long', '#25252e'], longBlonde: ['long', '#f0c14b'], longBrown: ['long', '#7a4a2a'],
    pigtail: ['pigtail', '#c2703a'], bun: ['bun', '#25252e'],
    bob: ['bob', '#f48fb1'], ponytail: ['pony', '#7a4a2a'], twinbun: ['twinbun', '#25252e']
  };
  var HAIR_BOY = ['spikyBrown', 'spikyBlack', 'shortBrown', 'shortBlack'];
  var HAIR_GIRL = ['longBlack', 'longBlonde', 'longBrown', 'pigtail', 'bun', 'bob', 'ponytail', 'twinbun'];

  var DRESS = { pink: '#f48fb1', red: '#ef5350', yellow: '#ffd54f', blue: '#4aa3df', purple: '#b48be0', stripe: 'url(#egStKid)' };

  var MONSTER_COLORS = { purple: '#9b6dd6', green: '#6fbf5f', blue: '#5aa9e6', orange: '#f59a4a', pink: '#f48fb1', teal: '#4fc3b0' };

  /** horns: { svg, usesColor } — `{{c}}` được thay bằng màu thân quái vật. */
  var HORNS = {
    none: { svg: '', usesColor: false },
    horns: { svg: '<path d="M62 54L50 12 86 42ZM138 54L150 12 114 42Z" fill="#fff3c4" stroke="#e0c46a" stroke-width="2" stroke-linejoin="round"/>', usesColor: false },
    antenna: { svg: '<path d="M80 46Q70 22 76 10M120 46Q130 22 124 10" stroke="#5a4a6a" stroke-width="3" fill="none"/><circle cx="76" cy="10" r="6" fill="#ffd54f"/><circle cx="124" cy="10" r="6" fill="#ffd54f"/>', usesColor: false },
    ears: { svg: '<g fill="{{c}}"><circle cx="48" cy="60" r="14"/><circle cx="152" cy="60" r="14"/></g><g fill="#0002"><circle cx="48" cy="60" r="7"/><circle cx="152" cy="60" r="7"/></g>', usesColor: true },
    spikes: { svg: '<path d="M58 56L64 22 80 42 92 14 106 42 120 20 130 44 142 56Z" fill="#ffcf5c" stroke="#e0a82e" stroke-width="2" stroke-linejoin="round"/>', usesColor: false }
  };

  var EYES = { one: [[100, 72, 16]], two: [[82, 72, 11], [118, 72, 11]], three: [[74, 78, 9], [126, 78, 9], [100, 56, 9]] };

  var MOUTH = {
    smile: '<path d="M84 100Q100 116 116 100" stroke="#3a2040" stroke-width="3" fill="none" stroke-linecap="round"/>',
    fangs: '<path d="M82 98Q100 120 118 98Z" fill="#4a1d3a"/><path d="M88 100L92 109 96 101ZM104 101L108 109 112 100Z" fill="#fff"/>',
    tongue: '<path d="M84 98Q100 118 116 98Z" fill="#4a1d3a"/><ellipse cx="100" cy="110" rx="8" ry="6" fill="#f06292"/>',
    teeth: '<path d="M78 98Q100 122 122 98Z" fill="#fff" stroke="#3a2040" stroke-width="2.5"/><path d="M89 103V111M100 105V116M111 103V111" stroke="#3a2040" stroke-width="1.8"/>'
  };

  var KID_SHIRT = { white: '#ffffff', red: '#ef5350', blue: '#4aa3df', yellow: '#ffd54f', green: '#66bb6a', pink: '#f48fb1', stripe: 'url(#egStKid)' };

  var PANTS = {
    jeans: ['long', '#4d71b8'], black: ['long', '#3a3a48'], khaki: ['short', '#d8b87a'],
    redshort: ['short', '#ef5350'], pinkskirt: ['skirt', '#f48fb1'], greenskirt: ['skirt', '#66bb6a']
  };

  var SHOES = { white: '#ffffff', red: '#ef5350', blue: '#4aa3df', black: '#3a3a48', yellow: '#ffd54f' };

  var KID_GLASSES = {
    round: '<g fill="#fff" fill-opacity=".3" stroke="#333" stroke-width="2.5"><circle cx="84" cy="71" r="10.5"/><circle cx="116" cy="71" r="10.5"/></g><path d="M94.5 69Q100 65 105.5 69" stroke="#333" stroke-width="2.5" fill="none"/>',
    square: '<g fill="#fff" fill-opacity=".3" stroke="#2f7fb5" stroke-width="3"><rect x="72" y="62" width="24" height="19" rx="4"/><rect x="104" y="62" width="24" height="19" rx="4"/></g><path d="M96 67H104" stroke="#2f7fb5" stroke-width="3"/>',
    sun: '<g fill="#222"><rect x="71" y="62" width="26" height="18" rx="8"/><rect x="103" cy="62" width="26" height="18" rx="8"/></g><path d="M97 66H103" stroke="#222" stroke-width="2.5"/><path d="M76 67l7-2.5M108 67l7-2.5" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>',
    heart: '<g fill="#ff5d8f" stroke="#c2185b" stroke-width="2"><path d="M84 82C72 73 75 62 84 67 93 62 96 73 84 82Z"/><path d="M116 82C104 73 107 62 116 67 125 62 128 73 116 82Z"/></g>'
  };

  var KID_HAT = {
    cap: '<path d="M56 64Q58 22 100 22T144 64Z" fill="#4aa3df"/><path d="M54 63Q100 72 146 63L144 58Q100 52 56 58Z" fill="#2f7fb5"/><circle cx="100" cy="23" r="4" fill="#2f7fb5"/>',
    beanie: '<path d="M54 62Q56 14 100 14T146 62Z" fill="#ef5350"/><rect x="52" y="52" width="96" height="13" rx="6.5" fill="#b8312e"/><circle cx="100" cy="13" r="8" fill="#fff"/>',
    party: '<path d="M78 62L100 4 122 62Z" fill="#ff7eb6"/><g fill="#fff"><circle cx="95" cy="38" r="3"/><circle cx="106" cy="28" r="3"/><circle cx="104" cy="48" r="3"/></g><circle cx="100" cy="4" r="6" fill="#ffd54f"/>',
    crown: '<path d="M70 66L74 32 88 48 100 26 112 48 126 32 130 66Z" fill="#ffc929" stroke="#d99a00" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="52" r="4" fill="#ef5350"/>',
    straw: '<ellipse cx="100" cy="58" rx="68" ry="8" fill="#f0cf7a" stroke="#c9a24a" stroke-width="2"/><path d="M68 56Q70 20 100 20T132 56Z" fill="#f0cf7a" stroke="#c9a24a" stroke-width="2"/><rect x="68" y="46" width="64" height="9" fill="#ef5350"/>',
    flower: '<g transform="translate(138 54)"><g fill="#ff8fb3"><circle cy="-8" r="6.5"/><circle cx="8" cy="-2.5" r="6.5"/><circle cx="5" cy="7" r="6.5"/><circle cx="-5" cy="7" r="6.5"/><circle cx="-8" cy="-2.5" r="6.5"/></g><circle r="4.5" fill="#ffd54f"/></g>'
  };

  var ACC = {
    bow: { f: '<path d="M100 131L84 121V141ZM100 131L116 121V141Z" fill="#e8453c"/><circle cx="100" cy="131" r="4.5" fill="#b8271f"/>' },
    scarf: { f: '<path d="M66 124Q100 142 134 124V137Q100 155 66 137Z" fill="#f5a623"/><path d="M110 145L118 172 104 174 98 149Z" fill="#e8921a"/>' },
    necklace: { f: '<path d="M80 125Q100 150 120 125" stroke="#d99a00" stroke-width="2.5" fill="none"/><path d="M100 160C93 153 95 147 100 151 105 147 107 153 100 160Z" fill="#ff5d8f"/>' },
    phones: { f: '<path d="M64 78Q58 26 100 26T136 78" stroke="#333" stroke-width="5" fill="none"/><rect x="57" y="68" width="14" height="24" rx="6" fill="#ef5350"/><rect x="129" y="68" width="14" height="24" rx="6" fill="#ef5350"/>' },
    bag: { b: '<rect x="58" y="134" width="84" height="58" rx="12" fill="#ef8a3c"/>', f: '<path d="M78 128V190M122 128V190" stroke="#c2651f" stroke-width="6"/>' },
    cape: { b: '<path d="M66 126H134L152 262H48Z" fill="#e8453c"/>', f: '<circle cx="100" cy="128" r="5" fill="#ffc929" stroke="#d99a00" stroke-width="2"/>' }
  };

  var KID_BASE = {
    skin: 's1', hair: 'spikyBrown', dress: null, shirt: 'white', pants: 'jeans',
    shoes: 'white', glasses: null, hat: null, acc: null,
    mcolor: 'purple', horns: 'horns', eyes: 'two', mouth: 'fangs'
  };

  var KID_DEFAULTS = {
    boy: assign({ type: 'boy' }, KID_BASE),
    girl: assign({ type: 'girl', hair: 'longBlack', dress: 'pink', shoes: 'red' }, KID_BASE),
    monster: assign({ type: 'monster', shirt: null, shoes: 'red' }, KID_BASE)
  };

  var KID_TYPES = [['boy', '👦 Bé trai'], ['girl', '👧 Bé gái'], ['monster', '👾 Quái vật']];

  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i] || {};
      for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) target[k] = src[k];
    }
    return target;
  }

  /* ---- các mảnh SVG của bé ---- */

  function dressSvg(id) {
    var f = DRESS[id];
    if (!f) return '';
    return '<g fill="' + f + '" stroke="#0001" stroke-width="1"><circle cx="62" cy="136" r="10"/><circle cx="138" cy="136" r="10"/><path d="M63 140Q63 125 80 125H120Q137 125 137 140L139 168 150 240Q100 252 50 240L61 168Z"/></g>'
      + '<path d="M61 168H139" stroke="#0002" stroke-width="3"/>'
      + '<path d="M84 126Q100 139 116 126" stroke="#fff" stroke-opacity=".7" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  }

  function mheadSvg(c) { return '<ellipse cx="100" cy="86" rx="54" ry="48" fill="' + c + '"/>'; }

  function hornSvg(id, c) {
    var h = HORNS[id];
    if (!h) return '';
    return h.usesColor ? h.svg.split('{{c}}').join(c) : h.svg;
  }

  function eyeSvg(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#fff" stroke="#0002"/>'
      + '<circle cx="' + x + '" cy="' + (y + r * 0.1) + '" r="' + (r * 0.5) + '" fill="#1f1a33"/>'
      + '<circle cx="' + (x + r * 0.2) + '" cy="' + (y - r * 0.2) + '" r="' + (r * 0.18) + '" fill="#fff"/>';
  }

  function eyesSvg(id) { return (EYES[id] || EYES.two).map(function (e) { return eyeSvg(e[0], e[1], e[2]); }).join(''); }

  function headSvg(sk, girl) {
    var f = SKIN[sk][0], e = SKIN[sk][1];
    return '<ellipse cx="66.5" cy="79" rx="5" ry="10.5" fill="' + e + '"/><ellipse cx="133.5" cy="79" rx="5" ry="10.5" fill="' + e + '"/>'
      + '<path d="M66 60V88Q68 118 100 118T134 88V60Z" fill="' + f + '"/>'
      + '<circle cx="73.5" cy="77" r="7" fill="#f7a8b8" opacity=".65"/><circle cx="126.5" cy="77" r="7" fill="#f7a8b8" opacity=".65"/>'
      + '<g fill="#1f1a33"><ellipse cx="84" cy="67" rx="5.8" ry="5.2"/><ellipse cx="116" cy="67" rx="5.8" ry="5.2"/></g>'
      + '<g fill="#fff"><circle cx="86" cy="64.5" r="1.7"/><circle cx="118" cy="64.5" r="1.7"/></g>'
      + '<path d="M91 85Q100 91 109 85" stroke="#1f1a33" stroke-width="2.4" stroke-linecap="round" fill="none"/>'
      + (girl
        ? '<path d="M78.5 69.5L74 67.5M121.5 69.5L126 67.5" stroke="#1f1a33" stroke-width="1.8" stroke-linecap="round"/>'
          + '<path d="M95.5 86Q100 89 104.5 86" stroke="#f06292" stroke-width="2" fill="none" stroke-linecap="round"/>'
        : '');
  }

  function legsSvg(sk) {
    var c = SKIN[sk][0];
    return '<g fill="' + c + '"><rect x="74" y="198" width="24" height="68" rx="8"/><rect x="102" y="198" width="24" height="68" rx="8"/></g>';
  }

  function pantsSvg(id) {
    var p = PANTS[id];
    if (!p) return '';
    var t = p[0], c = p[1];
    if (t === 'skirt') return '<path d="M68 198H132L140 236H60Z" fill="' + c + '"/>';
    var L = t === 'long', b = L ? 265 : 232;
    return '<path d="M72 198H100V' + b + 'H' + (L ? 69 : 71) + 'ZM100 198H128L' + (L ? 131 : 129) + ' ' + b + 'H100Z" fill="' + c + '"/>'
      + '<path d="M100 200V' + b + '" stroke="#0003" stroke-width="1.5"/>'
      + (L ? '<path d="M80 208V244" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".28"/>' : '');
  }

  function shoesSvg(id) {
    var c = SHOES[id];
    if (!c) return '';
    return '<g fill="' + c + '" stroke="#0002" stroke-width="1.5"><path d="M67 276Q66 264 76 264H100V276Q100 281 94 281H73Q67 281 67 276Z"/><path d="M133 276Q134 264 124 264H100V276Q100 281 106 281H127Q133 281 133 276Z"/></g>'
      + '<path d="M71 277H96M104 277H129" stroke="#0002" stroke-width="2" stroke-linecap="round"/>';
  }

  function shirtSvg(id) {
    var f = KID_SHIRT[id];
    if (!f) return '';
    return '<g fill="' + f + '" stroke="#0001" stroke-width="1"><rect x="57" y="130" width="14" height="28" rx="7"/><rect x="129" y="130" width="14" height="28" rx="7"/><path d="M63 140Q63 125 80 125H120Q137 125 137 140V196Q137 202 131 202H69Q63 202 63 196Z"/></g>'
      + '<path d="M84 126Q100 139 116 126" stroke="#c4c9d6" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  }

  function hairBackSvg(id) {
    var h = HAIR[id];
    if (!h) return '';
    var s = h[0], f = 'fill="' + h[1] + '"';
    if (s === 'long') return '<path d="M50 60Q42 130 56 150H144Q158 130 150 60Z" ' + f + '/>';
    if (s === 'bob') return '<path d="M52 62Q46 112 62 122H138Q154 112 148 62Z" ' + f + '/>';
    if (s === 'pigtail') return '<ellipse cx="50" cy="98" rx="9" ry="21" ' + f + ' transform="rotate(8 50 98)"/><ellipse cx="150" cy="98" rx="9" ry="21" ' + f + ' transform="rotate(-8 150 98)"/>';
    if (s === 'bun') return '<circle cx="100" cy="22" r="14" ' + f + '/>';
    if (s === 'pony') return '<path d="M138 58Q176 66 168 134Q156 104 134 92Z" ' + f + '/>';
    if (s === 'twinbun') return '<circle cx="60" cy="36" r="13" ' + f + '/><circle cx="140" cy="36" r="13" ' + f + '/>';
    return '';
  }

  function hairFrontSvg(id) {
    var h = HAIR[id];
    if (!h) return '';
    var s = h[0], c = h[1];
    if (s === 'spiky') return '<polygon points="47,53 63,32 79,34 86,20 100,29 113,20 121,34 137,32 137,53 153,53 145,66 57,66" fill="' + c + '"/>';
    var o = '<path d="M52 66Q50 28 100 26T148 66L136 62 124 67 110 62 100 67 88 62 76 67 64 62Z" fill="' + c + '"/>';
    if (s === 'pigtail') o += '<circle cx="54" cy="72" r="4.5" fill="#ef5350"/><circle cx="146" cy="72" r="4.5" fill="#ef5350"/>';
    if (s === 'pony') o += '<circle cx="139" cy="62" r="4.5" fill="#ef5350"/>';
    return o;
  }

  /* ---- defs dùng chung (màu sọc + blur) ---- */

  function kidDefs() {
    return '<defs>'
      + '<pattern id="egStKid" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff"/><rect width="12" height="6" fill="#4a72b8"/></pattern>'
      + '<filter id="egBlur" x="-40%" y="-100%" width="180%" height="300%"><feGaussianBlur stdDeviation="2.5"/></filter>'
      + '</defs>';
  }

  /* ---- render nhân vật ---- */

  function personSvg(s) {
    var f = SKIN[s.skin][0], e = SKIN[s.skin][1];
    var a = ACC[s.acc] || {}, girl = s.type === 'girl', dr = girl && s.dress;
    var o = '<svg viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nhân vật Bé">' + kidDefs();
    o += '<ellipse cx="100" cy="277" rx="48" ry="6" fill="#000" opacity=".12" filter="url(#egBlur)"/>'
      + (a.b || '') + hairBackSvg(s.hair) + legsSvg(s.skin) + (dr ? '' : pantsSvg(s.pants)) + shoesSvg(s.shoes);
    o += '<g fill="' + f + '"><rect x="57" y="140" width="12" height="58" rx="6"/><rect x="131" y="140" width="12" height="58" rx="6"/></g><rect x="86" y="108" width="28" height="20" fill="' + e + '"/>';
    o += (dr ? dressSvg(s.dress) : shirtSvg(s.shirt))
      + headSvg(s.skin, girl) + hairFrontSvg(s.hair) + (a.f || '')
      + (s.glasses ? KID_GLASSES[s.glasses] || '' : '')
      + (s.hat ? KID_HAT[s.hat] || '' : '');
    return o + '</svg>';
  }

  function monsterSvg(s) {
    var c = MONSTER_COLORS[s.mcolor], a = ACC[s.acc] || {};
    var o = '<svg viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quái vật">' + kidDefs();
    o += '<ellipse cx="100" cy="277" rx="50" ry="6" fill="#000" opacity=".12" filter="url(#egBlur)"/>'
      + (a.b || '') + hornSvg(s.horns, c);
    o += '<g fill="' + c + '"><rect x="70" y="236" width="24" height="34" rx="11"/><rect x="106" y="236" width="24" height="34" rx="11"/><ellipse cx="54" cy="188" rx="10" ry="24" transform="rotate(14 54 188)"/><ellipse cx="146" cy="188" rx="10" ry="24" transform="rotate(-14 146 188)"/><ellipse cx="100" cy="196" rx="44" ry="62"/></g>'
      + '<ellipse cx="100" cy="208" rx="28" ry="38" fill="#fff" opacity=".25"/>';
    o += shoesSvg(s.shoes) + shirtSvg(s.shirt) + mheadSvg(c)
      + '<circle cx="62" cy="98" r="7" fill="#f7a8b8" opacity=".55"/><circle cx="138" cy="98" r="7" fill="#f7a8b8" opacity=".55"/>'
      + eyesSvg(s.eyes) + (MOUTH[s.mouth] || '');
    return o + (a.f || '')
      + (s.glasses ? KID_GLASSES[s.glasses] || '' : '')
      + (s.hat ? KID_HAT[s.hat] || '' : '') + '</svg>';
  }

  function renderKid(src) {
    var s = sanitizeKid(src);
    return s.type === 'monster' ? monsterSvg(s) : personSvg(s);
  }

  /* ---- tab + state hợp lệ ---- */

  /** ty: ký tự đầu của loại nhân vật được phép mở tab (b/g/m). */
  var KID_TABS = [
    { k: 'hair', l: '💇 Tóc', ty: 'bg', map: function () { return { kind: 'list', ids: null }; } },
    { k: 'skin', l: '🧑 Da', ty: 'bg', map: function () { return { kind: 'dot', ids: Object.keys(SKIN), dot: function (id) { return SKIN[id][0]; } }; } },
    { k: 'dress', l: '👗 Váy', ty: 'g', map: function () { return { kind: 'svg', ids: Object.keys(DRESS), pv: dressSvg, vb: '46 118 108 136', none: true }; } },
    { k: 'mcolor', l: '🎨 Màu', ty: 'm', map: function () { return { kind: 'dot', ids: Object.keys(MONSTER_COLORS), dot: function (id) { return MONSTER_COLORS[id]; } }; } },
    { k: 'horns', l: '😈 Sừng', ty: 'm', map: function (st) { return { kind: 'svg', ids: Object.keys(HORNS), pv: function (id) { return hornSvg(id, MONSTER_COLORS[st.mcolor]) + mheadSvg(MONSTER_COLORS[st.mcolor]); }, vb: '40 6 120 92' }; } },
    { k: 'eyes', l: '👁 Mắt', ty: 'm', map: function (st) { return { kind: 'svg', ids: Object.keys(EYES), pv: function (id) { return mheadSvg(MONSTER_COLORS[st.mcolor]) + eyesSvg(id); }, vb: '46 40 108 76' }; } },
    { k: 'mouth', l: '👄 Miệng', ty: 'm', map: function (st) { return { kind: 'svg', ids: Object.keys(MOUTH), pv: function (id) { return mheadSvg(MONSTER_COLORS[st.mcolor]) + MOUTH[id]; }, vb: '60 76 80 50' }; } },
    { k: 'shirt', l: '👕 Áo', ty: 'bgm', map: function (st) { return { kind: 'svg', ids: Object.keys(KID_SHIRT), pv: shirtSvg, vb: '50 120 100 86', none: st.type === 'monster' }; } },
    { k: 'pants', l: '👖 Quần', ty: 'bg', map: function (st) { return { kind: 'svg', ids: Object.keys(PANTS), pv: function (id) { return legsSvg(st.skin) + pantsSvg(id); }, vb: '58 192 84 80' }; } },
    { k: 'shoes', l: '👟 Giày', ty: 'bgm', map: function () { return { kind: 'svg', ids: Object.keys(SHOES), pv: shoesSvg, vb: '60 258 80 28' }; } },
    { k: 'glasses', l: '👓 Kính', ty: 'bgm', map: function () { return { kind: 'svg', ids: Object.keys(KID_GLASSES), pv: function (id) { return KID_GLASSES[id]; }, vb: '66 56 68 32', none: true }; } },
    { k: 'hat', l: '🎩 Mũ', ty: 'bgm', map: function () { return { kind: 'svg', ids: Object.keys(KID_HAT), pv: function (id) { return KID_HAT[id]; }, vb: '44 2 112 76', none: true }; } },
    { k: 'acc', l: '🎒 Phụ kiện', ty: 'bgm', map: function () { return { kind: 'svg', ids: Object.keys(ACC), pv: accPreview, vb: '40 14 120 170', none: true }; } }
  ];

  /** Tóc khác nhau theo giới — preview cần state hiện tại nên nhận tham số. */
  KID_TABS[0].map = function (st) {
    return {
      kind: 'svg',
      ids: st.type === 'girl' ? HAIR_GIRL : HAIR_BOY,
      pv: function (id) { return hairBackSvg(id) + headSvg(st.skin, st.type === 'girl') + hairFrontSvg(id); },
      vb: '40 12 120 112'
    };
  };

  function accPreview(id, st) {
    var a = ACC[id] || {};
    return (a.b || '') + shirtSvg('white') + headSvg(st.skin, st.type === 'girl') + (a.f || '');
  }

  function kidTabs(st) {
    var type = sanitizeKid(st).type;
    return KID_TABS.filter(function (t) { return t.ty.indexOf(type.charAt(0)) >= 0; });
  }

  var KID_IDS = {
    hair: HAIR, skin: SKIN, dress: DRESS, mcolor: MONSTER_COLORS, horns: HORNS,
    eyes: EYES, mouth: MOUTH, shirt: KID_SHIRT, pants: PANTS, shoes: SHOES,
    glasses: KID_GLASSES, hat: KID_HAT, acc: ACC
  };

  function sanitizeKid(src) {
    var o = src && typeof src === 'object' ? src : {};
    var base = KID_DEFAULTS[Object.prototype.hasOwnProperty.call(KID_DEFAULTS, o.type) ? o.type : 'boy'];
    var out = { type: base.type };
    Object.keys(KID_IDS).forEach(function (k) {
      var v = o[k];
      var ok = v != null && Object.prototype.hasOwnProperty.call(KID_IDS[k], v);
      out[k] = ok ? v : base[k];
    });
    /* quái vật không mặc váy */
    if (out.type === 'monster') out.dress = null;
    return out;
  }

  /* ===================================================================== *
   *  XUẤT RA
   * ===================================================================== */

  root.EG_DRESSUP = {
    version: 1,
    renderPet: petSvg,
    renderKid: renderKid,
    sanitizePet: sanitizePet,
    sanitizeKid: sanitizeKid,
    kidTabs: kidTabs,

    pet: {
      animals: ANIMALS, tabs: PET_TABS, opts: PET_OPTS, defaults: PET_DEFAULTS,
      preview: function (state) { return petSvg(state.animal, null); }
    },

    kid: {
      base: KID_BASE, defaults: KID_DEFAULTS, types: KID_TYPES,
      tabs: KID_TABS, ids: KID_IDS,
      accPreview: accPreview
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);