/**
 * dressUpDragon.js — thân Rồng xanh cho hệ avatar mới (512×700).
 *
 * Bản vẽ lại theo đúng ngôn ngữ hình khối của các thân trong
 * dressUpAvatarData.js: cùng khung 512×700, viền 4–6px, bóng đổ mềm, mắt to,
 * bụng kem và mảng màu phẳng. Để khác hẳn Kaiju, rồng dùng màu ngọc lục bảo,
 * cánh dơi lớn, cổ dài, sừng/gai/đuôi màu cam, mõm thằn lằn và bàn chân 3 móng.
 *
 * Rồng đã khắc sẵn mặt/sừng/cánh nên KHÔNG nhận lớp mặt, tóc, mũ hay kính.
 */
(function (root) {
  'use strict';
  root.EG_DRAGON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="700" viewBox="0 0 512 700" fill="none">
  <defs>
    <linearGradient id="kidSkin" x1="180" y1="90" x2="340" y2="560">
      <stop offset="0%" stop-color="#72DCA2"/><stop offset="55%" stop-color="#46BE7A"/><stop offset="100%" stop-color="#2E9A63"/>
    </linearGradient>
    <filter id="kidBlur" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="kidShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000000" flood-opacity="0.12"/></filter>
  </defs>

  <ellipse cx="256" cy="665" rx="116" ry="22" fill="#000000" opacity="0.10" filter="url(#kidBlur)"/>

  <!-- cánh dơi lớn: điểm khác biệt chính so với Kaiju -->
  <g fill="#A9E7C6" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round">
    <path d="M198 372 C176 318 152 258 118 218 C96 192 72 178 42 172 C54 208 54 244 44 280 C68 268 92 276 110 296 C102 324 104 350 114 374 C136 360 158 368 174 388 Z"/>
    <g transform="translate(512 0) scale(-1 1)">
      <path d="M198 372 C176 318 152 258 118 218 C96 192 72 178 42 172 C54 208 54 244 44 280 C68 268 92 276 110 296 C102 324 104 350 114 374 C136 360 158 368 174 388 Z"/>
    </g>
  </g>
  <g stroke="#2E8B62" stroke-width="7" fill="none" opacity=".8" stroke-linecap="round">
    <path d="M194 368 C150 300 112 232 48 180 M194 368 C150 330 92 292 48 284 M194 368 C158 364 128 376 118 378"/>
    <g transform="translate(512 0) scale(-1 1)">
      <path d="M194 368 C150 300 112 232 48 180 M194 368 C150 330 92 292 48 284 M194 368 C158 364 128 376 118 378"/>
    </g>
  </g>

  <!-- đuôi dài + gai cam + đầu đuôi hình lá -->
  <g filter="url(#kidShadow)">
    <path d="M300 512 C360 520 412 550 426 596 C436 630 420 654 398 656 C380 658 368 644 378 630 C392 634 402 620 396 602 C384 568 348 544 296 536 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round"/>
    <path d="M388 652 L418 636 L430 662 L404 674 Z" fill="#F5A623" stroke="#C97712" stroke-width="4" stroke-linejoin="round"/>
    <path d="M350 542 L362 514 L374 548 Z" fill="#F5A623" stroke="#C97712" stroke-width="3" stroke-linejoin="round"/>
    <path d="M384 566 L402 542 L406 578 Z" fill="#F5A623" stroke="#C97712" stroke-width="3" stroke-linejoin="round"/>
    <path d="M408 600 L430 584 L424 618 Z" fill="#F5A623" stroke="#C97712" stroke-width="3" stroke-linejoin="round"/>
  </g>

  <!-- gai lưng hai bên -->
  <g fill="#F5A623" stroke="#C97712" stroke-width="3" stroke-linejoin="round">
    <path d="M196 374 L158 344 L194 416 Z"/><path d="M188 430 L150 410 L190 466 Z"/><path d="M192 476 L160 466 L198 512 Z"/>
    <path d="M316 374 L354 344 L318 416 Z"/><path d="M324 430 L362 410 L322 466 Z"/><path d="M320 476 L352 466 L314 512 Z"/>
  </g>

  <!-- chân sau to + bàn chân 3 móng -->
  <path d="M206 520 C192 552 192 598 204 628 C212 648 230 656 246 650 C258 646 260 632 252 622 L246 540 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <path d="M306 520 C320 552 320 598 308 628 C300 648 282 656 266 650 C254 646 252 632 260 622 L266 540 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <path d="M198 646 C206 636 228 636 244 646 C254 652 256 666 248 672 L190 672 C178 672 174 660 180 650 Z" fill="#2E9A63" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <path d="M314 646 C306 636 284 636 268 646 C258 652 256 666 264 672 L322 672 C334 672 338 660 332 650 Z" fill="#2E9A63" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <path d="M214 536 C210 570 212 600 220 620 M298 536 C302 570 300 600 292 620" stroke="#FFFFFF" stroke-width="8" opacity=".16" stroke-linecap="round" fill="none"/>
  <g fill="#FFD9A0" stroke="#C97712" stroke-width="3" stroke-linejoin="round">
    <path d="M180 660 L162 654 L178 676 Z"/><path d="M198 664 L188 650 L204 676 Z"/><path d="M218 666 L216 650 L232 676 Z"/>
    <path d="M332 660 L350 654 L334 676 Z"/><path d="M314 664 L324 650 L308 676 Z"/><path d="M294 666 L296 650 L280 676 Z"/>
  </g>

  <!-- tay nhỏ kiểu rồng + móng -->
  <path d="M196 420 C174 430 166 452 174 470 C180 484 196 488 206 478 L214 442 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <path d="M316 420 C338 430 346 452 338 470 C332 484 316 488 306 478 L298 442 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <g fill="#FFD9A0" stroke="#C97712" stroke-width="3" stroke-linejoin="round">
    <path d="M176 472 L168 490 L184 482 Z"/><path d="M190 478 L190 496 L200 484 Z"/><path d="M204 476 L210 494 L214 482 Z"/>
    <path d="M336 472 L344 490 L328 482 Z"/><path d="M322 478 L322 496 L312 484 Z"/><path d="M308 476 L302 494 L298 482 Z"/>
  </g>

  <!-- cổ dài + thân quả lê + vảy bụng -->
  <path d="M228 268 L228 386 C228 402 284 402 284 386 L284 268 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round"/>
  <path d="M240 280 L240 380 C248 388 264 388 272 380 L272 280" fill="#DDF3B0" opacity=".65"/>
  <path d="M212 372 C232 354 280 354 300 372 C334 390 344 440 334 500 C322 552 300 576 256 576 C212 576 190 552 178 500 C168 440 178 390 212 372 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" stroke-linejoin="round" filter="url(#kidShadow)"/>
  <path d="M224 394 C242 384 270 384 288 394 L280 532 C270 552 242 552 232 532 Z" fill="#DDF3B0"/>
  <path d="M230 426 L282 426 M230 458 L282 458 M232 490 L280 490" stroke="#9CCB67" stroke-width="5" stroke-linecap="round" opacity=".85"/>
  <path d="M196 400 C188 436 190 488 198 520" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity=".16" fill="none"/>
  <g fill="#2E9A63" opacity=".35"><circle cx="326" cy="410" r="8"/><circle cx="334" cy="454" r="5"/><circle cx="190" cy="430" r="5"/></g>

  <!-- đầu rồng: tai, sừng cam, mào, mõm thằn lằn -->
  <g fill="#5FCF94" stroke="#1F6E4A" stroke-width="4" stroke-linejoin="round">
    <path d="M190 190 C166 182 152 196 156 220 C168 208 182 208 194 218 Z"/>
    <g transform="translate(512 0) scale(-1 1)">
      <path d="M190 190 C166 182 152 196 156 220 C168 208 182 208 194 218 Z"/>
    </g>
  </g>
  <g fill="#F5A623" stroke="#C97712" stroke-width="4" stroke-linejoin="round">
    <path d="M210 104 C190 76 184 42 196 18 C204 48 220 74 238 92 Z"/>
    <g transform="translate(512 0) scale(-1 1)">
      <path d="M210 104 C190 76 184 42 196 18 C204 48 220 74 238 92 Z"/>
    </g>
  </g>
  <path d="M188 168 C188 110 218 84 256 84 C294 84 324 110 324 168 L324 198 C324 224 314 244 298 256 C294 276 278 290 256 290 C234 290 218 276 214 256 C198 244 188 224 188 198 Z" fill="url(#kidSkin)" stroke="#1F6E4A" stroke-width="5" filter="url(#kidShadow)"/>
  <path d="M238 90 L256 52 L274 90 Z" fill="#F5A623" stroke="#C97712" stroke-width="4" stroke-linejoin="round"/>
  <path d="M210 100 C198 80 196 56 202 38" stroke="#FFD9A0" stroke-width="4" opacity=".55" fill="none" stroke-linecap="round"/>
  <path d="M302 100 C314 80 316 56 310 38" stroke="#FFD9A0" stroke-width="4" opacity=".55" fill="none" stroke-linecap="round"/>
  <ellipse cx="222" cy="124" rx="38" ry="20" fill="#FFFFFF" opacity=".18"/>
  <g fill="#2E9A63" opacity=".35">
    <circle cx="316" cy="124" r="8"/><circle cx="330" cy="152" r="5"/>
    <circle cx="196" cy="166" r="5"/><circle cx="188" cy="196" r="4"/>
  </g>

  <ellipse cx="256" cy="246" rx="42" ry="30" fill="#DDF3B0" stroke="#1F6E4A" stroke-width="4"/>
  <ellipse cx="240" cy="236" rx="5" ry="4" fill="#1F5A3A"/>
  <ellipse cx="272" cy="236" rx="5" ry="4" fill="#1F5A3A"/>
  <path d="M230 258 Q256 276 282 258" stroke="#1F5A3A" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M238 262 L244 274 L250 262 M262 262 L268 274 L274 262" fill="#FFF4DE" stroke="#C9B98F" stroke-width="2" stroke-linejoin="round"/>
  <ellipse cx="200" cy="230" rx="18" ry="9" fill="#FF9DAE" opacity=".4"/>
  <ellipse cx="312" cy="230" rx="18" ry="9" fill="#FF9DAE" opacity=".4"/>

  <!-- mắt to, đồng tử xẻ dọc kiểu rồng -->
  <ellipse cx="224" cy="190" rx="24" ry="27" fill="#FFFFFF" stroke="#1F6E4A" stroke-width="4"/>
  <ellipse cx="288" cy="190" rx="24" ry="27" fill="#FFFFFF" stroke="#1F6E4A" stroke-width="4"/>
  <ellipse cx="228" cy="192" rx="8" ry="16" fill="#28203A"/>
  <ellipse cx="284" cy="192" rx="8" ry="16" fill="#28203A"/>
  <circle cx="222" cy="184" r="5" fill="#FFFFFF"/>
  <circle cx="278" cy="184" r="5" fill="#FFFFFF"/>
  <circle cx="232" cy="200" r="3" fill="#FFFFFF" opacity=".6"/>
  <circle cx="288" cy="200" r="3" fill="#FFFFFF" opacity=".6"/>
  <path d="M198 164 Q224 146 250 162" stroke="#1F6E4A" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M262 162 Q288 146 314 164" stroke="#1F6E4A" stroke-width="9" fill="none" stroke-linecap="round"/>
</svg>`;
})(typeof window !== 'undefined' ? window : globalThis);
