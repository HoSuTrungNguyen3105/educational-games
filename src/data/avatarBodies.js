// data/avatarBodies.js
//
// BODY GỐC của avatar — nằm trong MÃ FRONTEND, không phải trong database.
//
// Lý do: thân avatar là phần nền tĩnh, ai cũng dùng chung, không phải vật
// phẩm người chơi mua/sở hữu. Để nó trong `avatarItems` khiến admin phải sửa
// SVG thô qua API, dễ hỏng và phải deploy lại server mới có hiệu lực.
//
//   · Body gốc  → file này (mã, cần build để đổi)
//   · Phụ kiện  → collection `avatarItems` trên backend (admin sửa được, không
//                  cần deploy)
//
// `users.avatarLoadout.body` vẫn lưu `code` của body để không phá dữ liệu
// người dùng cũ, nhưng `code` đó chỉ dùng để tra registry ở đây.

/** Thân mặc định — dùng khi người chơi chưa chọn hoặc code không còn trong registry. */
export const DEFAULT_BODY_CODE = "body_boy_01";

/**
 * BODY CHUẨN — chép nguyên văn từ `body.html` ở thư mục gốc dự án.
 *
 * Đây là nguồn sự thật duy nhất cho hình thân. Mọi bản bodyBase() viết tay ở
 * đây hay ở `server/src/lib/avatarRenderer.js` trước đây đều bị loại bỏ.
 *
 * Khác biệt duy nhất so với file gốc: 4 màu da hardcode được thay bằng token
 * `{{skinLight}}` / `{{skinDark}}` / `{{skinShadow}}` / `{{skinEar}}` để người
 * chơi vẫn chọn được màu da. Hệ số bù bên dưới lấy từ chính giá trị trong
 * `body.html`, nên với màu mặc định `DEFAULT_SKIN` kết quả RA KHÍT file gốc.
 *
 * Toạ độ 512×700 — mọi phụ kiện được vẽ chồng lên hệ này.
 */

/** Màu da gốc của `body.html` — tức `skin_01` trong danh mục phụ kiện. */
export const DEFAULT_SKIN = "#FFDFC4";

// Offsets (R, G, B) của body.html so với DEFAULT_SKIN = #FFDFC4.
//   #FFE9D2 → (  0, +10, +14)   gradient sáng
//   #FFCDAA → (  0, -18, -26)   gradient tối
//   #E9AE8C → (-22, -49, -56)   bóng cổ
//   #FFD1B1 → (  0, -14, -19)   vành tai
const SKIN_OFFSETS = {
  light: [0, 10, 14],
  dark: [0, -18, -26],
  shadow: [-22, -49, -56],
  ear: [0, -14, -19],
};

function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) h = "FFDFC4";
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Cộng offset của body.html vào màu da, rồi kẹp về 0–255. Viết HOA để khớp file gốc. */
function tone(skin, offset) {
  const [r, g, b] = hexToRgb(skin);
  const to = (v, d) => Math.max(0, Math.min(255, v + d)).toString(16).toUpperCase().padStart(2, "0");
  return `#${to(r, offset[0])}${to(g, offset[1])}${to(b, offset[2])}`;
}

export function bodyBase(skin) {
  const s = skin || DEFAULT_SKIN;
  const vars = {
    skinLight: tone(s, SKIN_OFFSETS.light),
    skinDark: tone(s, SKIN_OFFSETS.dark),
    skinShadow: tone(s, SKIN_OFFSETS.shadow),
    skinEar: tone(s, SKIN_OFFSETS.ear),
  };
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="700" viewBox="0 0 512 700" fill="none">
  <defs>
    <linearGradient id="skinGradient" x1="180" y1="150" x2="330" y2="420">
      <stop offset="0%" stop-color="${vars.skinLight}"/><stop offset="100%" stop-color="${vars.skinDark}"/>
    </linearGradient>
    <linearGradient id="hairGradient" x1="180" y1="90" x2="330" y2="210">
      <stop offset="0%" stop-color="#6B4228"/><stop offset="100%" stop-color="#432716"/>
    </linearGradient>
    <linearGradient id="shirtGradient" x1="170" y1="330" x2="340" y2="500">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#E9ECF2"/>
    </linearGradient>
    <linearGradient id="pantsGradient" x1="190" y1="475" x2="330" y2="650">
      <stop offset="0%" stop-color="#4D6FB5"/><stop offset="100%" stop-color="#294B8D"/>
    </linearGradient>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
    <filter id="objectShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <g id="avatar">
    <g id="shadow"><ellipse cx="256" cy="665" rx="105" ry="22" fill="#000000" opacity="0.10" filter="url(#softShadow)"/></g>
    <g id="hair-back"><path d="M172 207 C145 180 151 124 184 99 C204 83 230 77 256 78 C291 77 322 91 340 116 C365 151 359 193 337 216 L310 234 L201 230 Z" fill="url(#hairGradient)"/></g>
    <g id="head" filter="url(#objectShadow)">
      <path d="M226 292 L226 329 C226 345 286 345 286 329 L286 292 Z" fill="url(#skinGradient)"/>
      <path d="M226 293 C238 307 272 309 286 293 L286 317 C268 326 242 326 226 316 Z" fill="${vars.skinShadow}" opacity="0.45"/>
      <path d="M179 164 C179 115 213 91 256 91 C299 91 333 115 333 164 L333 216 C333 263 299 301 256 301 C213 301 179 263 179 216 Z" fill="url(#skinGradient)"/>
      <ellipse cx="180" cy="213" rx="12" ry="23" fill="${vars.skinEar}"/>
      <ellipse cx="332" cy="213" rx="12" ry="23" fill="${vars.skinEar}"/>
      <ellipse cx="224" cy="143" rx="40" ry="25" fill="#FFFFFF" opacity="0.16"/>
    </g>
    <g id="face">
      <path d="M207 188 Q224 177 240 187" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>
      <path d="M272 187 Q288 177 305 188" stroke="#39271E" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="224" cy="210" rx="13" ry="17" fill="#28203A"/>
      <circle cx="229" cy="204" r="4" fill="#FFFFFF"/>
      <ellipse cx="288" cy="210" rx="13" ry="17" fill="#28203A"/>
      <circle cx="293" cy="204" r="4" fill="#FFFFFF"/>
      <ellipse cx="205" cy="244" rx="21" ry="11" fill="#FF8FA0" opacity="0.42"/>
      <ellipse cx="307" cy="244" rx="21" ry="11" fill="#FF8FA0" opacity="0.42"/>
      <path d="M256 218 Q249 239 257 241" stroke="#D99172" stroke-width="4" stroke-linecap="round"/>
      <path d="M235 258 Q256 278 277 258" stroke="#30213E" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g id="hair-front">
      <path d="M170 165 C165 127 186 94 220 83 C245 74 278 78 303 91 C332 106 347 136 342 168 L320 153 L303 176 L285 148 L262 173 L240 145 L214 175 L195 150 Z" fill="url(#hairGradient)"/>
      <path d="M195 124 C213 101 238 94 259 94" stroke="#96623F" stroke-width="9" stroke-linecap="round" opacity="0.55"/>
      <path d="M280 98 C300 105 316 117 326 136" stroke="#8A5635" stroke-width="7" stroke-linecap="round" opacity="0.45"/>
    </g>
    <g id="body">
      <path d="M190 354 C166 354 157 371 158 395 L162 465 C163 480 175 490 188 486 C201 482 205 470 204 456 L201 386 Z" fill="url(#skinGradient)"/>
      <path d="M322 354 C346 354 355 371 354 395 L350 465 C349 480 337 490 324 486 C311 482 307 470 308 456 L311 386 Z" fill="url(#skinGradient)"/>
      <path d="M209 326 C221 318 237 314 256 314 C275 314 291 318 303 326 C327 331 342 349 340 372 L334 470 C333 489 320 501 301 501 L211 501 C192 501 179 489 178 470 L172 372 C170 349 185 331 209 326 Z" fill="url(#shirtGradient)" filter="url(#objectShadow)"/>
      <path d="M225 324 C232 344 280 344 287 324" stroke="#D6D9DE" stroke-width="7" stroke-linecap="round"/>
      <path d="M201 361 C195 389 196 438 201 465" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.5"/>
    </g>
    <g id="pants">
      <path d="M194 492 L256 492 L256 632 C256 647 246 655 230 655 L203 655 C190 655 184 645 186 631 Z" fill="url(#pantsGradient)" filter="url(#objectShadow)"/>
      <path d="M256 492 L318 492 L326 631 C328 645 320 655 307 655 L280 655 C264 655 256 647 256 632 Z" fill="url(#pantsGradient)" filter="url(#objectShadow)"/>
      <path d="M256 500 L256 633" stroke="#203E78" stroke-width="5" opacity="0.7"/>
      <path d="M211 510 L208 620" stroke="#6C8DCC" stroke-width="8" stroke-linecap="round" opacity="0.35"/>
    </g>
    <g id="shoes">
      <path d="M188 642 C202 637 224 637 243 642 C254 645 260 654 255 663 C251 671 236 674 213 674 C193 674 180 669 180 660 C180 652 183 646 188 642 Z" fill="#FFFFFF" filter="url(#objectShadow)"/>
      <path d="M269 642 C288 637 310 637 324 642 C329 646 332 652 332 660 C332 669 319 674 299 674 C276 674 261 671 257 663 C252 654 258 645 269 642 Z" fill="#FFFFFF" filter="url(#objectShadow)"/>
      <path d="M190 664 Q220 674 251 664" stroke="#D8DDE5" stroke-width="5" stroke-linecap="round"/>
      <path d="M261 664 Q292 674 322 664" stroke="#D8DDE5" stroke-width="5" stroke-linecap="round"/>
    </g>
    <g id="glasses" opacity="0"><circle cx="224" cy="210" r="24" stroke="#333333" stroke-width="6" fill="none"/><circle cx="288" cy="210" r="24" stroke="#333333" stroke-width="6" fill="none"/><path d="M248 210 L264 210" stroke="#333333" stroke-width="6" stroke-linecap="round"/></g>
    <g id="hat" opacity="0"><path d="M180 145 L195 105 L222 115 L245 83 L267 112 L294 91 L319 117 L337 148 Z" fill="#D94F65"/><path d="M170 145 Q256 125 342 145 L335 165 Q256 148 177 165 Z" fill="#B93850"/></g>
  </g>
</svg>`;
}

/**
 * Body rồng — SVG tĩnh, không nhận màu da và KHÔNG nhận phụ kiện (đã khắc sẵn
 * mặt, sừng, cánh). Frontend vẽ nó nguyên trạng.
 */
const DRAGON_BODY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="700" viewBox="0 0 512 700" fill="none">
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
</svg>`;

/**
 * Registry body gốc.
 *
 * `overlays: false` = body tự khắc sẵn mọi chi tiết (rồng) → frontend vẽ
 * nguyên trạng, không ghép phụ kiện. Còn lại ghép như bình thường.
 */
export const AVATAR_BODIES = [
  { code: "body_boy_01", name: "Body bé trai", gender: "boy", default: true, render: (skin) => bodyBase(skin) },
  { code: "body_girl_01", name: "Body bé gái", gender: "girl", default: true, render: (skin) => bodyBase(skin) },
  { code: "body_custom_01", name: "Rồng xanh", gender: "any", default: false, overlays: false, render: () => DRAGON_BODY_SVG },
];

const BY_CODE = new Map(AVATAR_BODIES.map((b) => [b.code, b]));

/** Tra body theo `code` từ `avatarLoadout.body`. Không có → body mặc định. */
export function getAvatarBody(code) {
  return BY_CODE.get(code) || BY_CODE.get(DEFAULT_BODY_CODE) || AVATAR_BODIES[0];
}

/** Body đang được phép ghép phụ kiện (dragon thì không). */
export function acceptsOverlays(body) {
  return body?.overlays !== false;
}
