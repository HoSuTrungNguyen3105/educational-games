import{l as e,t}from"./userAuth.store-CXNfd-M1.js";var n=`/* eslint-disable */
/**
 * dressUpDragon.js — thân Rồng xanh cho hệ avatar mới (512×700).
 *
 * SVG được lấy nguyên văn từ \`DRAGON_BODY_SVG\` trong \`src/data/avatarBodies.js\`
 * (hệ avatar cũ) để hai bên cùng một hình rồng. File này là script thuần vì
 * \`injectDressUpAvatar.js\` nạp bằng \`?raw\` rồi tiêm vào HTML game.
 *
 * Rồng đã khắc sẵn mặt/sừng/cánh nên KHÔNG nhận lớp mặt, tóc, mũ hay kính.
 */
(function (root) {
  'use strict';
  root.EG_DRAGON_SVG = \`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="700" viewBox="0 0 512 700" fill="none">
  <defs>
    <linearGradient id="dragonSkin" x1="100" y1="80" x2="420" y2="620">
      <stop offset="0" stop-color="#A8EC55"/><stop offset="0.35" stop-color="#78D63F"/><stop offset="0.7" stop-color="#4DB83A"/><stop offset="1" stop-color="#268633"/>
    </linearGradient>
    <linearGradient id="dragonSkinDark" x1="100" y1="300" x2="420" y2="600">
      <stop offset="0" stop-color="#55B83B"/><stop offset="1" stop-color="#247630"/>
    </linearGradient>
    <radialGradient id="dragonBelly" cx="40%" cy="30%" r="70%">
      <stop offset="0" stop-color="#D0F77B"/><stop offset="0.55" stop-color="#A4E653"/><stop offset="1" stop-color="#62B93B"/>
    </radialGradient>
    <linearGradient id="dragonHorn" x1="150" y1="40" x2="200" y2="180">
      <stop offset="0" stop-color="#58A93B"/><stop offset="0.5" stop-color="#286B2E"/><stop offset="1" stop-color="#164824"/>
    </linearGradient>
    <radialGradient id="dragonEyeWhite">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="0.8" stop-color="#F5FAF2"/><stop offset="1" stop-color="#D7E7D4"/>
    </radialGradient>
    <linearGradient id="dragonMouth" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#24272A"/><stop offset="1" stop-color="#07090B"/>
    </linearGradient>
    <filter id="dragonBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
    <filter id="dragonShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#174D24" flood-opacity="0.22"/>
    </filter>
  </defs>
  <ellipse cx="256" cy="665" rx="175" ry="22" fill="#4B553F" opacity="0.14" filter="url(#dragonBlur)"/>
  <ellipse cx="256" cy="660" rx="145" ry="14" fill="#4B553F" opacity="0.10"/>
  <g filter="url(#dragonShadow)">
    <path d="M185 470 C181 455 191 444 207 444 L236 444 C252 444 261 455 261 471 L261 604 C261 620 252 631 235 631 L207 631 C190 631 181 619 181 604 Z" fill="url(#dragonSkin)" stroke="#237832" stroke-width="5"/>
    <path d="M251 471 C251 455 260 444 276 444 L305 444 C321 444 331 455 327 471 L331 604 C331 619 322 631 305 631 L277 631 C260 631 251 620 251 604 Z" fill="url(#dragonSkin)" stroke="#237832" stroke-width="5"/>
    <path d="M202 480 L202 585" stroke="#D0FA83" stroke-width="12" stroke-linecap="round" opacity="0.25"/>
    <path d="M274 480 L274 575" stroke="#D0FA83" stroke-width="11" stroke-linecap="round" opacity="0.20"/>
    <path d="M178 596 C190 584 228 584 248 597 C263 607 267 626 254 638 C241 650 198 651 181 639 C168 630 167 608 178 596 Z" fill="url(#dragonSkinDark)" stroke="#23682D" stroke-width="5"/>
    <path d="M258 597 C278 584 316 584 333 597 C345 608 344 630 331 639 C314 651 271 650 258 638 C245 626 247 607 258 597 Z" fill="url(#dragonSkinDark)" stroke="#23682D" stroke-width="5"/>
    <ellipse cx="204" cy="607" rx="18" ry="7" fill="#D1F981" opacity="0.5" transform="rotate(-8 204 607)"/>
    <ellipse cx="289" cy="607" rx="18" ry="7" fill="#D1F981" opacity="0.45" transform="rotate(-8 289 607)"/>
    <path d="M154 280 C154 250 178 231 207 231 L305 231 C334 231 358 250 358 280 L358 403 C358 465 319 511 256 525 C193 511 154 465 154 403 Z" fill="url(#dragonSkin)" stroke="#237832" stroke-width="6"/>
    <path d="M160 383 C172 455 205 496 256 517 C307 496 340 455 352 383 C345 465 315 510 256 528 C197 510 167 465 160 383 Z" fill="#216D2D" opacity="0.16"/>
    <ellipse cx="256" cy="378" rx="69" ry="101" fill="url(#dragonBelly)" opacity="0.96"/>
    <ellipse cx="230" cy="337" rx="28" ry="43" fill="#E1FF99" opacity="0.24" transform="rotate(-12 230 337)"/>
    <circle cx="190" cy="292" r="13" fill="#399A38" opacity="0.55"/>
    <circle cx="207" cy="321" r="7" fill="#399A38" opacity="0.45"/>
    <circle cx="322" cy="303" r="13" fill="#398E35" opacity="0.5"/>
    <circle cx="330" cy="338" r="7" fill="#398E35" opacity="0.45"/>
    <circle cx="313" cy="431" r="9" fill="#398E35" opacity="0.4"/>
    <circle cx="194" cy="440" r="8" fill="#398E35" opacity="0.4"/>
    <path d="M169 272 C147 267 132 281 129 304 L113 446 C111 464 122 477 140 479 C158 481 171 468 173 450 L187 310 C190 290 185 276 169 272 Z" fill="url(#dragonSkin)" stroke="#237832" stroke-width="5"/>
    <path d="M343 272 C365 267 380 281 383 304 L399 446 C401 464 390 477 372 479 C354 481 341 468 339 450 L325 310 C322 290 327 276 343 272 Z" fill="url(#dragonSkin)" stroke="#237832" stroke-width="5"/>
    <path d="M151 301 L139 429" stroke="#D1FA83" stroke-width="11" stroke-linecap="round" opacity="0.25"/>
    <path d="M361 301 L373 429" stroke="#D1FA83" stroke-width="11" stroke-linecap="round" opacity="0.22"/>
    <circle cx="135" cy="461" r="29" fill="url(#dragonSkin)" stroke="#237832" stroke-width="5"/>
    <circle cx="377" cy="461" r="29" fill="url(#dragonSkin)" stroke="#237832" stroke-width="5"/>
    <path d="M115 464 L105 437 Q119 442 127 463 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M130 468 L129 436 Q143 445 143 467 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M144 464 L158 439 Q160 454 151 469 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M397 464 L407 437 Q393 442 385 463 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M382 468 L383 436 Q369 445 369 467 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <path d="M368 464 L354 439 Q352 454 361 469 Z" fill="#276E2F" stroke="#174D24" stroke-width="2"/>
    <rect x="221" y="213" width="70" height="66" rx="23" fill="url(#dragonSkinDark)" stroke="#237832" stroke-width="5"/>
    <path d="M230 238 Q256 257 282 238" stroke="#A8EB63" stroke-width="7" stroke-linecap="round" opacity="0.25"/>
    <circle cx="256" cy="145" r="119" fill="url(#dragonSkin)" stroke="#237832" stroke-width="6"/>
    <path d="M141 160 C150 229 193 260 256 264 C319 260 362 229 371 160 C363 227 319 267 256 269 C193 267 149 227 141 160 Z" fill="#216C2D" opacity="0.16"/>
    <ellipse cx="202" cy="92" rx="51" ry="27" fill="#E2FF9B" opacity="0.30" transform="rotate(-18 202 92)"/>
    <ellipse cx="170" cy="122" rx="12" ry="7" fill="#FFFFFF" opacity="0.30" transform="rotate(-20 170 122)"/>
    <circle cx="316" cy="83" r="15" fill="#3A9A36" opacity="0.55"/>
    <circle cx="338" cy="108" r="8" fill="#3A9A36" opacity="0.45"/>
    <circle cx="157" cy="155" r="9" fill="#3A9636" opacity="0.42"/>
    <circle cx="350" cy="174" r="10" fill="#398F36" opacity="0.42"/>
    <path d="M166 66 C139 48 123 25 119 8 C117 0 125 2 130 8 L194 67 Z" fill="url(#dragonHorn)" stroke="#174A25" stroke-width="6" stroke-linejoin="round"/>
    <path d="M346 66 C373 48 389 25 393 8 C395 0 387 2 382 8 L318 67 Z" fill="url(#dragonHorn)" stroke="#174A25" stroke-width="6" stroke-linejoin="round"/>
    <path d="M130 17 L165 54" stroke="#94E75C" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
    <path d="M382 17 L347 54" stroke="#94E75C" stroke-width="9" stroke-linecap="round" opacity="0.5"/>
    <path d="M128 34 Q151 39 173 51" stroke="#174526" stroke-width="5" opacity="0.65"/>
    <path d="M384 34 Q361 39 339 51" stroke="#174526" stroke-width="5" opacity="0.65"/>
    <path d="M177 111 Q207 89 234 108" stroke="#286B30" stroke-width="11" stroke-linecap="round"/>
    <path d="M278 108 Q305 89 335 111" stroke="#286B30" stroke-width="11" stroke-linecap="round"/>
    <ellipse cx="207" cy="137" rx="35" ry="42" fill="url(#dragonEyeWhite)" stroke="#277133" stroke-width="4"/>
    <ellipse cx="305" cy="137" rx="35" ry="42" fill="url(#dragonEyeWhite)" stroke="#277133" stroke-width="4"/>
    <circle cx="212" cy="143" r="19" fill="#10181A"/>
    <circle cx="310" cy="143" r="19" fill="#10181A"/>
    <circle cx="212" cy="143" r="13" fill="#174B39"/>
    <circle cx="310" cy="143" r="13" fill="#174B39"/>
    <circle cx="219" cy="136" r="7" fill="white"/>
    <circle cx="317" cy="136" r="7" fill="white"/>
    <circle cx="207" cy="150" r="3" fill="white" opacity="0.7"/>
    <circle cx="305" cy="150" r="3" fill="white" opacity="0.7"/>
    <ellipse cx="163" cy="184" rx="25" ry="13" fill="#FF9696" opacity="0.55"/>
    <ellipse cx="349" cy="184" rx="25" ry="13" fill="#FF9696" opacity="0.55"/>
    <ellipse cx="157" cy="180" rx="7" ry="4" fill="#FFFFFF" opacity="0.55"/>
    <ellipse cx="343" cy="180" rx="7" ry="4" fill="#FFFFFF" opacity="0.55"/>
    <path d="M181 184 Q256 246 331 184 Q326 245 256 249 Q186 245 181 184 Z" fill="url(#dragonMouth)" stroke="#101416" stroke-width="4"/>
    <path d="M184 187 Q256 238 328 187" stroke="#080A0B" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M217 211 L229 235 L241 211 Z" fill="#FFFFFF" stroke="#DDE8DD" stroke-width="2"/>
    <path d="M271 211 L283 235 L295 211 Z" fill="#FFFFFF" stroke="#DDE8DD" stroke-width="2"/>
    <ellipse cx="176" cy="88" rx="12" ry="6" fill="white" opacity="0.22" transform="rotate(-25 176 88)"/>
    <circle cx="126" cy="453" r="5" fill="white" opacity="0.25"/>
    <circle cx="386" cy="453" r="5" fill="white" opacity="0.22"/>
  </g>
</svg>\`;
})(typeof window !== 'undefined' ? window : globalThis);
`,r=`/* eslint-disable */
/**
 * dressUpAvatarData.js — NGUỒN SVG DUY NHẤT cho 2 game tạo avatar
 *
 *   • "Tiệm thời trang cho Bé"  → renderKid()  (bé trai / bé gái / quái vật)
 *   • "Tiệm thay đồ thú cưng"   → renderPet()  (chó, mèo, thỏ, hamster, gấu trúc, cáo)
 *
 * File này CỐ TÌNH không phải ES module. Nó được nạp bằng \`?raw\` trong
 * \`src/games/injectDressUpAvatar.js\` rồi tiêm nguyên văn vào <head> của HTML game,
 * nên game nằm trong iframe tự dựng được SVG mà không cần bundler.
 *
 * Dùng chung \`window.EG_DRESSUP\`:
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
   *  Toàn bộ lớp ở đây được vẽ trên đúng hệ 512×700 của \`body.html\`:
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
   *  THÂN — \`body_01\` là thân người lấy nguyên văn từ body.html.
   *  \`body_girl_01\` cùng khung đầu/tay nhưng có eo gọn + thân + chân trần
   *  (body_01 không vẽ thân/chân nên bé gái bị "thiếu body").
   *  \`body_rider_01\` / \`body_superman_01\` mặc bộ đồ anh hùng trên chính khung
   *  đó (HERO_SUITS) nên áo, quần, giày, mũ, kính... vẫn gắn đúng chỗ.
   *  \`body_dragon_01\` đã khắc sẵn mặt/sừng nên overlays = false.
   *
   *  \`slug\` = mã preset dùng ở modal + trang admin (kidPreset('rider')),
   *  \`hint\` = ghi chú cho trang "Thân Avatar" — thêm thân là admin tự có thẻ,
   *  không phải sửa giao diện.
   *
   *  \`slots\` = NHÓM LINH KIỆN thân đó nhận. Không phải body nào cũng mặc được
   *  mọi thứ: rồng/kaiju không có tóc để gắn, ma bay không có chân đi quần.
   *  Mọi thứ (tab, sanitize, render, trang admin) đều suy ra từ bảng này nên
   *  thêm thân chỉ cần khai báo slots, không phải sửa giao diện. Server giữ
   *  bản sao trong \`server/src/lib/outfitCatalog.js\` (AVATAR_BODY_SLOTS) và
   *  \`npm run avatars:test\` so hai bên mỗi lần chạy.
   * ===================================================================== */
  var HUMAN_SLOTS = ['skin', 'face', 'hair', 'hairColor',
    'shirt', 'dress', 'pants', 'shoes', 'glasses', 'hat', 'acc'];
  /* Da + mặt + tóc + kính + mũ + phụ kiện, KHÔNG áo/váy/quần/giày vì thân đã
   * tự vẽ bộ đồ (ngôi sao nhạc pop). */
  var HEAD_SLOTS = ['skin', 'face', 'hair', 'hairColor', 'glasses', 'hat', 'acc'];
  /* Chỉ giữ khung đầu để đội mũ + đeo kính: không tóc, không mặc gì (kaiju). */
  var CRITTER_SLOTS = ['glasses', 'hat', 'acc'];

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
    }
  };

  /** Nhóm linh kiện thân đó chấp nhận — \`body\` luôn có, không nằm trong danh sách. */
  function bodySlots(body) {
    var b = BODIES[body];
    return b && b.slots ? b.slots.slice() : [];
  }

  /* ===================================================================== *
   *  MẶT — bám đúng toạ độ \`#face\` của body.html:
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
   *  TÓC — \`back\` vẽ sau thân, \`front\` vẽ sau mặt.
   *  Màu đổi bằng \`fill="currentColor"\` nên một path cho mọi màu.
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
   *  PHỤ KIỆN — \`b\` vẽ sau thân (cờ đuôi, túi), \`f\` vẽ đè lên trên
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
   *  THÂN NGƯỜI — chép nguyên văn \`body.html\`, tách phần có thể thay thế
   *  Thành \`groundShadow / limbs / neck / head\` dùng chung cho mọi thân:
   *  chỉ đổi \`fill\` (da → màu vải) nên mặt, tóc, mũ, kính, áo, quần, giày
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
   *  THÂN BÉ GÁI — cùng khung đầu/tay/cổ với \`humanBody\` (nên mũ, kính, tóc
   *  và mặt vẫn khớp tọa độ), khác ở chỗ có thân eo gọn + hai chân trần,
   *  phần mà \`body_01\` không bao giờ vẽ.
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
   *  những lớp thân đó không có thì \`slots\` khai báo ở BODIES đã chặn từ
   *  trong \`sanitizeKid\` → không bao giờ tới lượt render.
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

  /** 3 móc vẽ bộ đồ, tra theo mã thân. \`null\` = thân người thường. */
  var HERO_SUITS = {
    body_rider_01: { body: riderBody, back: riderBack, top: riderTop },
    body_superman_01: { body: supermanBody, back: supermanBack, top: supermanTop },
    body_kaiju_01: { body: kaijuBody, back: kaijuBack, top: kaijuTop },
    body_ghost_01: { body: ghostBody, back: ghostBack, top: ghostTop },
    body_popstar_01: { body: popstarBody, back: popstarBack, top: popstarTop }
  };

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
  function renderKid(raw) {
    var s = sanitizeKid(raw);
    if (s.body === 'body_dragon_01') {
      return '<svg viewBox="0 0 ' + KID_W + ' ' + KID_H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rồng xanh" color="'
        + (HAIR_COLORS[s.hairColor] || HAIR_COLORS['nâu']) + '">'
        + (root.EG_DRAGON_SVG || '') + '</svg>';
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
   * \`sanitizeKid\` rơi về mặc định là bé trai (bé gái thành bé trai). */
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
    body_popstar_01: { hair: 'hair_01', hairColor: 'đen' }
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
   * KID_FIELD_IDS vì \`applyBody\` → \`sanitizeKid\` đọc bảng đó.
   * KID_DEFAULTS chỉ có một và là bé trai, nên bé gái phải suy ra từ nó — nếu
   * không, bé chọn "Bạn gái" ở màn chào vẫn bị vẽ thành bé trai. */
  var KID_DEFAULTS_GIRL = applyBody(KID_DEFAULTS, 'body_girl_01');

  /** Bộ đồ mở màn theo giới tính đã chọn ("boy" | "girl" | null). */
  function kidDefaultsFor(gender) {
    return gender === 'girl' ? KID_DEFAULTS_GIRL : KID_DEFAULTS;
  }

  /** Kiểu hiển thị của từng tab: dot = màu, svg = vẽ preview.
   *  \`nullable: true\` → hiện nút 🚫 và cho phép bỏ lớp đó. */
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
          return svg.replace(/^<svg[^>]*>/, '').replace(/<\\/svg>$/, '');
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

  /* Khung nhìn riêng cho từng phụ kiện: mũ tai nghe nằm trên đầu (y 58–260) còn
   * nơ/khăn/dây chuyền ở ngực → dùng chung một viewBox sẽ cắt mất đồ. Ô preview
   * vuông gọi \`cfg.vbFor(id)\` để lấy đúng vùng của món đang xem. */
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
   *  Danh sách tab lấy từ \`slots\` của thân đang chọn — thêm thân chỉ cần khai
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

  /* \`KID_FIELD_IDS\` đã chứa null cho các lớp tuỳ chọn → bé chọn 🚫 là bỏ thật.
   * Riêng \`shirt\`/\`pants\`/\`shoes\` của \`body_01\` bị ép lại bên dưới vì thân đó
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
      /** bộ đồ mở màn của bé gái (thân \`body_girl_01\` + váy) */
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
})(typeof window !== 'undefined' ? window : globalThis);`,i=`avatar`,a=`pet`,o=null;function s(){if(o)return o;if(typeof window<`u`&&window.EG_DRESSUP)return o=window.EG_DRESSUP,o;let e={};return o=Function(`window`,`globalThis`,`${n}\n${r}\n;return (typeof window !== "undefined" && window.EG_DRESSUP) || globalThis.EG_DRESSUP;`)(e,e),o}function c(e){return`eg-outfit-${e}-v1`}function l(){try{let e=t.getState?.()?.user?.id;return e==null?``:String(e)}catch{return``}}function u(e,t){let n=s();try{return e===a?n.sanitizePet(t):n.sanitizeKid(t)}catch{return null}}function d(t){let n=s();return t===a?n.pet.defaults:n.kid.defaultsFor(e().gender)}function f(){return{...d(i)}}function p(e,t=l()){try{let n=JSON.parse(localStorage.getItem(c(e))||`null`),r=u(e,n?.value);if(!r)return null;let i=n.owner==null?``:String(n.owner);return i&&i!==t?null:{value:r,updatedAt:n.updatedAt||null,owner:i}}catch{return null}}function m(e,t,n,r=l()){let i=u(e,t);if(!i)return null;try{localStorage.setItem(c(e),JSON.stringify({v:1,value:i,updatedAt:n||null,owner:r||``}))}catch{}return i}function h(e,t){try{let n=JSON.parse(localStorage.getItem(c(e))||`null`);if(!n||(n.owner==null?``:String(n.owner))!==``)return;localStorage.setItem(c(e),JSON.stringify({...n,owner:t}))}catch{}}var g=`eg-dressup-svg-css`;function _(){if(typeof document>`u`||document.getElementById(g))return;let e=document.createElement(`style`);e.id=g,e.textContent=`.eg-du svg{width:100%;height:100%;display:block}`,document.head.appendChild(e)}var v=700/512;function y(e,t){let n=s(),r=u(e,t)??u(e,d(e));return r?e===a?n.renderPet(r.animal,r):n.renderKid(r):``}function b(e){return e===a?1:v}var x={body:`bodies`,face:`faces`,hair:`hairs`,hat:`hats`,glasses:`glasses`,acc:`accs`,pants:`pants`,shoes:`shoes`,shirt:`shirtColors`,dress:`dressColors`,hairColor:`hairColors`,skin:`skinTones`};function S(e,t,n){if(!n)return`Không dùng`;let r=s();if(e===a){let e=r.pet.animals;return t===`animal`?e[n]?.n||n:n.charAt(0).toUpperCase()+n.slice(1)}let i=r.kid[x[t]]?.[n];return i?typeof i==`string`?i.charAt(0).toUpperCase()+i.slice(1):i.n||n:n}function C(e,t){let n=s(),r=u(e,t);return r?e===a?n.pet.animals[r.animal]?.n||``:n.kid.bodies[r.body]?.n||``:``}function w(e,t){let n=u(e,t);return n?e===a?[n.shirt&&`Áo`,n.glasses&&`Kính`,n.hat&&`Mũ`,n.neck&&`Khăn`].filter(Boolean):T(n)?[n.face&&S(e,`face`,n.face),n.hair&&S(e,`hair`,n.hair),n.dress?`Váy`:n.shirt&&S(e,`shirt`,n.shirt),!n.dress&&n.pants&&S(e,`pants`,n.pants),n.shoes&&S(e,`shoes`,n.shoes),n.glasses&&S(e,`glasses`,n.glasses),n.hat&&S(e,`hat`,n.hat),n.acc&&S(e,`acc`,n.acc)].filter(Boolean):[]:[]}function T(e){return s().kid.bodies[e.body]?.overlays!==!1}function E(e,t){return{avatar:D(i,e),pet:D(a,t)}}function D(e,t){let n=l(),r={value:u(e,d(e)),updatedAt:null},i=p(e,n),a=t&&typeof t==`object`?u(e,t):null,o=a?{value:a,updatedAt:t.updatedAt||null}:null;if(!i)return o||r;if(!i.owner&&n&&h(e,n),!o)return i;let s=Date.parse(i.updatedAt||``)||0;return(Date.parse(o.updatedAt||``)||0)>=s?o:i}export{f as a,C as c,u as d,m as f,S as i,y as l,n as m,_ as n,b as o,r as p,s as r,c as s,w as t,E as u};