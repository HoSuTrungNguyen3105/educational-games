function pt(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function shade(hex, percent) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(ch => ch + ch).join('');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  const amt = percent / 100 * 255;
  r = Math.min(255, Math.max(0, Math.round(r + amt)));
  g = Math.min(255, Math.max(0, Math.round(g + amt)));
  b = Math.min(255, Math.max(0, Math.round(b + amt)));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function capPath(cx, cy, r, notches, depth, startDeg, endDeg, fringeDrop) {
  const steps = notches * 2;
  let d = '', sx = 0, sy = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const deg = startDeg + (endDeg - startDeg) * t;
    const rr = (i % 2 === 1) ? r + depth : r;
    const [x, y] = pt(cx, cy, rr, deg);
    if (i === 0) { d = `M ${x.toFixed(1)},${y.toFixed(1)} `; sx = x; sy = y; }
    else d += `L ${x.toFixed(1)},${y.toFixed(1)} `;
  }
  d += `Q ${cx},${(sy + fringeDrop).toFixed(1)} ${sx.toFixed(1)},${sy.toFixed(1)} Z`;
  return d;
}

function girlLongHair(cx, cy, r, dropY, waveCount) {
  const steps = waveCount * 2, startDeg = 185, endDeg = 355;
  let d = '', sx = 0, sy = 0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const deg = startDeg + (endDeg - startDeg) * t;
    const rr = (i % 2 === 1) ? r + 8 : r;
    const [x, y] = pt(cx, cy, rr, deg);
    if (i === 0) { d = `M ${x.toFixed(1)},${y.toFixed(1)} `; sx = x; sy = y; }
    else d += `L ${x.toFixed(1)},${y.toFixed(1)} `;
  }
  const [xr] = pt(cx, cy, r, endDeg);
  d += `L ${xr.toFixed(1)},${dropY} Q ${cx},${(dropY + 20).toFixed(1)} ${sx.toFixed(1)},${dropY} L ${sx.toFixed(1)},${sy.toFixed(1)} Z`;
  return d;
}

function starShape(cx, cy, rOuter, rInner, color) {
  let pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
  }
  return `<polygon points="${pts.join(' ')}" fill="${color}"/>`;
}

function heartShape(cx, cy, size, color) {
  const s = size / 16;
  return `<path transform="translate(${cx - 16 * s},${cy - 14 * s}) scale(${s})" d="M16,28 C4,20 0,12 0,7 C0,2 4,-2 8,-2 C12,-2 16,1 16,6 C16,1 20,-2 24,-2 C28,-2 32,2 32,7 C32,12 28,20 16,28 Z" fill="${color}" fill-opacity="0.9"/>`;
}

export function bodyBase(skin) {
  const sole = shade(skin, -20);
  return `
    <ellipse cx="150" cy="420" rx="72" ry="10" fill="rgba(36,25,52,0.08)"/>
    <rect x="132" y="118" width="36" height="24" rx="12" fill="${skin}"/>
    <rect x="79" y="158" width="27" height="100" rx="13" fill="${skin}"/>
    <rect x="194" y="158" width="27" height="100" rx="13" fill="${skin}"/>
    <circle cx="92" cy="262" r="14" fill="${skin}"/>
    <circle cx="208" cy="262" r="14" fill="${skin}"/>
    <rect x="112" y="255" width="38" height="148" rx="13" fill="${skin}"/>
    <rect x="150" y="255" width="38" height="148" rx="13" fill="${skin}"/>
    <ellipse cx="131" cy="402" rx="18" ry="9" fill="${sole}"/>
    <ellipse cx="169" cy="402" rx="18" ry="9" fill="${sole}"/>
    <circle cx="150" cy="95" r="56" fill="${skin}"/>
  `;
}

export function drawFace(style) {
  const ink = '#241934';
  let eyes = '', brows = '', mouth = '', blush = '';
  if (style !== 'fierce') {
    blush = `<circle cx="115" cy="103" r="9" fill="#FF8FAE" opacity="0.35"/><circle cx="185" cy="103" r="9" fill="#FF8FAE" opacity="0.35"/>`;
  }
  switch (style) {
    case 'gentle':
      eyes = `<circle cx="128" cy="90" r="8" fill="${ink}"/><circle cx="131" cy="87" r="2.4" fill="#fff"/><circle cx="172" cy="90" r="8" fill="${ink}"/><circle cx="175" cy="87" r="2.4" fill="#fff"/>`;
      brows = `<path d="M118,72 Q128,68 138,72" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M162,72 Q172,68 182,72" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M138,116 Q150,124 162,116" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      break;
    case 'happy':
      eyes = `<circle cx="128" cy="89" r="10" fill="${ink}"/><circle cx="131.5" cy="85.5" r="3" fill="#fff"/><circle cx="172" cy="89" r="10" fill="${ink}"/><circle cx="175.5" cy="85.5" r="3" fill="#fff"/>`;
      brows = `<path d="M116,68 Q128,63 140,69" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M160,69 Q172,63 184,68" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M133,114 Q150,136 167,114 Q150,124 133,114 Z" fill="${ink}"/>`;
      break;
    case 'wink':
      eyes = `<circle cx="128" cy="90" r="8" fill="${ink}"/><circle cx="131" cy="87" r="2.4" fill="#fff"/><path d="M163,90 Q172,80 183,90" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      brows = `<path d="M118,70 Q128,66 138,71" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M162,70 Q172,66 182,71" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M136,115 Q150,128 164,115" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      break;
    case 'laughing':
      eyes = `<path d="M117,89 Q128,77 139,89" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M161,89 Q172,77 183,89" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      brows = `<path d="M116,66 Q128,61 140,67" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M160,67 Q172,61 184,66" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M129,112 Q150,142 171,112 Q150,130 129,112 Z" fill="${ink}"/>`;
      break;
    case 'fierce':
      eyes = `<rect x="121" y="86" width="15" height="8" rx="3" fill="${ink}"/><rect x="164" y="86" width="15" height="8" rx="3" fill="${ink}"/>`;
      brows = `<path d="M116,74 L140,68" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M160,68 L184,74" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M136,120 L164,120" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      break;
  }
  return blush + brows + eyes + mouth;
}

export function hairMarkup(h) {
  const c = h.color;
  let back = '', front = '';
  switch (h.style) {
    case 'spiky': front = `<path d="${capPath(150, 95, 60, 6, 16, 185, 355, -8)}" fill="${c}"/>`; break;
    case 'messy': front = `<path d="${capPath(150, 95, 62, 5, 9, 185, 355, -2)}" fill="${c}"/>`; break;
    case 'side': front = `<path d="${capPath(150, 95, 58, 3, 4, 185, 355, 2)}" fill="${c}"/>`; break;
    case 'wild': front = `<path d="${capPath(150, 95, 64, 8, 20, 185, 355, -6)}" fill="${c}"/>`; break;
    case 'long':
      back = `<path d="${girlLongHair(150, 95, 60, 300, 4)}" fill="${c}"/>`;
      front = `<path d="${capPath(150, 95, 58, 4, 6, 185, 355, 2)}" fill="${c}"/>`;
      break;
    case 'twin':
      back = `<g transform="rotate(-10 88 175)"><ellipse cx="88" cy="175" rx="16" ry="82" fill="${c}"/></g><g transform="rotate(10 212 175)"><ellipse cx="212" cy="175" rx="16" ry="82" fill="${c}"/></g>`;
      front = `<path d="${capPath(150, 95, 58, 4, 6, 185, 355, 0)}" fill="${c}"/>`;
      break;
    case 'wavy':
      back = `<path d="${girlLongHair(150, 95, 52, 255, 7)}" fill="${c}"/>`;
      front = `<path d="${capPath(150, 95, 58, 5, 8, 185, 355, 1)}" fill="${c}"/>`;
      break;
    case 'braid':
      back = `<g transform="rotate(14 198 190)"><ellipse cx="198" cy="190" rx="14" ry="92" fill="${c}"/><rect x="190" y="150" width="16" height="6" rx="3" fill="${shade(c, -25)}"/><rect x="190" y="185" width="16" height="6" rx="3" fill="${shade(c, -25)}"/><rect x="190" y="220" width="16" height="6" rx="3" fill="${shade(c, -25)}"/></g>`;
      front = `<path d="${capPath(150, 95, 58, 4, 6, 185, 355, 0)}" fill="${c}"/>`;
      break;
  }
  return { back, front };
}

export function shirtMarkup(o) {
  const c = o.color, d = shade(c, -18);
  const sleeves = `<rect x="77" y="156" width="30" height="60" rx="14" fill="${c}"/><rect x="193" y="156" width="30" height="60" rx="14" fill="${c}"/>`;
  const torso = `<rect x="106" y="149" width="88" height="110" rx="26" fill="${c}"/>`;
  switch (o.style) {
    case 'tee':
      return torso + sleeves + `<path d="M132,149 Q150,164 168,149" stroke="${d}" stroke-width="3" fill="none"/>`;
    case 'hoodie':
      return `<path d="M124,152 Q150,110 176,152 Z" fill="${c}"/>` + torso +
        `<rect x="77" y="156" width="30" height="72" rx="14" fill="${c}"/><rect x="193" y="156" width="30" height="72" rx="14" fill="${c}"/>` +
        `<rect x="143" y="152" width="4" height="16" rx="2" fill="${d}"/><rect x="153" y="152" width="4" height="16" rx="2" fill="${d}"/>` +
        `<rect x="128" y="215" width="44" height="24" rx="8" fill="${d}"/>`;
    case 'jacket':
      return torso + sleeves +
        `<rect x="146" y="149" width="8" height="108" fill="${d}"/>` +
        `<path d="M120,149 L138,149 L132,168 Z" fill="${d}"/><path d="M180,149 L162,149 L168,168 Z" fill="${d}"/>` +
        `<rect x="140" y="149" width="20" height="14" fill="#F5F5F5"/>`;
    case 'polo':
      return torso + sleeves +
        `<path d="M128,149 L150,166 L172,149 L164,149 L150,159 L136,149 Z" fill="${d}"/>` +
        `<circle cx="150" cy="185" r="2.4" fill="${d}"/><circle cx="150" cy="200" r="2.4" fill="${d}"/>`;
    case 'sweater':
      return torso + sleeves +
        `<rect x="77" y="204" width="30" height="12" rx="4" fill="${d}"/><rect x="193" y="204" width="30" height="12" rx="4" fill="${d}"/>` +
        `<circle cx="150" cy="158" r="14" fill="none" stroke="${d}" stroke-width="4"/>`;
    case 'cardigan':
      return `<rect x="140" y="149" width="20" height="110" fill="#F5F5F5"/>` +
        `<rect x="104" y="149" width="42" height="110" rx="20" fill="${c}"/><rect x="154" y="149" width="42" height="110" rx="20" fill="${c}"/>` +
        sleeves +
        `<path d="M138,168 L150,180 L162,168 L156,188 L150,180 L144,188 Z" fill="${d}"/>`;
    case 'sailor':
      return torso + sleeves +
        `<path d="M112,150 L150,190 L188,150 L188,168 L150,205 L112,168 Z" fill="${d}"/>` +
        `<path d="M150,190 L138,222 L162,222 Z" fill="#C0392B"/>`;
  }
  return torso + sleeves;
}

export function pantsMarkup(o) {
  const c = o.color, d = shade(c, -20);
  switch (o.style) {
    case 'shorts':
      return `<rect x="112" y="255" width="76" height="72" rx="18" fill="${c}"/>`;
    case 'jeans':
      return `<rect x="112" y="255" width="76" height="148" rx="15" fill="${c}"/><line x1="150" y1="258" x2="150" y2="398" stroke="${d}" stroke-width="2" opacity="0.4"/>`;
    case 'cargo':
      return `<rect x="112" y="255" width="76" height="95" rx="16" fill="${c}"/><rect x="103" y="292" width="18" height="26" rx="4" fill="${d}"/><rect x="179" y="292" width="18" height="26" rx="4" fill="${d}"/>`;
    case 'joggers':
      return `<rect x="112" y="255" width="76" height="148" rx="15" fill="${c}"/><rect x="120" y="255" width="6" height="148" fill="${d}"/><rect x="174" y="255" width="6" height="148" fill="${d}"/><rect x="112" y="380" width="76" height="18" rx="9" fill="${d}"/>`;
    case 'skirt':
      return `<path d="M118,255 L182,255 L200,322 Q150,336 100,322 Z" fill="${c}"/><line x1="130" y1="258" x2="118" y2="320" stroke="${d}" stroke-width="2" opacity="0.5"/><line x1="150" y1="258" x2="150" y2="332" stroke="${d}" stroke-width="2" opacity="0.5"/><line x1="170" y1="258" x2="182" y2="320" stroke="${d}" stroke-width="2" opacity="0.5"/>`;
  }
  return `<rect x="112" y="255" width="76" height="90" rx="16" fill="${c}"/>`;
}

export function shoesMarkup(o) {
  const c = o.color, sole = shade(c, -30);
  if (o.style === 'boots') {
    return `<rect x="112" y="372" width="34" height="42" rx="10" fill="${c}"/><rect x="154" y="372" width="34" height="42" rx="10" fill="${c}"/><rect x="110" y="406" width="38" height="9" rx="4" fill="${sole}"/><rect x="152" y="406" width="38" height="9" rx="4" fill="${sole}"/>`;
  }
  return `<ellipse cx="131" cy="398" rx="23" ry="15" fill="${c}"/><ellipse cx="169" cy="398" rx="23" ry="15" fill="${c}"/><ellipse cx="131" cy="408" rx="23" ry="6" fill="#fff"/><ellipse cx="169" cy="408" rx="23" ry="6" fill="#fff"/><path d="M121,392 L141,392 M124,398 L138,398" stroke="${sole}" stroke-width="2"/><path d="M159,392 L179,392 M162,398 L176,398" stroke="${sole}" stroke-width="2"/>`;
}

export function hatMarkup(o) {
  if (o.style === 'none') return '';
  const c = o.color, d = shade(c, -18);
  switch (o.style) {
    case 'cap':
      return `<path d="M96,55 Q100,10 150,10 Q200,10 204,55 Z" fill="${c}"/><ellipse cx="150" cy="57" rx="48" ry="9" fill="${d}"/><circle cx="150" cy="13" r="4" fill="${d}"/>`;
    case 'beanie':
      return `<rect x="98" y="6" width="104" height="58" rx="38" fill="${c}"/><rect x="98" y="48" width="104" height="18" rx="9" fill="${d}"/><circle cx="150" cy="8" r="8" fill="#fff"/>`;
    case 'bucket':
      return `<ellipse cx="150" cy="66" rx="58" ry="12" fill="${c}"/><path d="M112,64 L120,16 Q150,4 180,16 L188,64 Z" fill="${c}"/>`;
    case 'tophat':
      return `<ellipse cx="150" cy="60" rx="50" ry="9" fill="${d}"/><rect x="122" y="6" width="56" height="56" rx="4" fill="${c}"/><rect x="122" y="48" width="56" height="10" fill="${d}"/>`;
    case 'sunhat':
      return `<ellipse cx="150" cy="60" rx="68" ry="14" fill="${c}"/><ellipse cx="150" cy="34" rx="38" ry="26" fill="${shade(c, 10)}"/><rect x="120" y="50" width="60" height="8" fill="${d}"/>`;
  }
  return '';
}

export function glassesMarkup(o) {
  if (o.style === 'none') return '';
  const c = o.color;
  switch (o.style) {
    case 'round':
      return `<circle cx="128" cy="90" r="16" fill="#fff" fill-opacity="0.3" stroke="${c}" stroke-width="4"/><circle cx="172" cy="90" r="16" fill="#fff" fill-opacity="0.3" stroke="${c}" stroke-width="4"/><line x1="144" y1="90" x2="156" y2="90" stroke="${c}" stroke-width="4"/>`;
    case 'sun':
      return `<rect x="112" y="78" width="32" height="24" rx="7" fill="${c}"/><rect x="156" y="78" width="32" height="24" rx="7" fill="${c}"/><rect x="144" y="86" width="12" height="6" fill="${c}"/>`;
    case 'heart':
      return heartShape(128, 88, 16, c) + heartShape(172, 88, 16, c) + `<line x1="144" y1="90" x2="156" y2="90" stroke="${c}" stroke-width="3"/>`;
    case 'cat':
      return `<path d="M108,86 L144,80 L144,98 L112,100 Z" fill="#fff" fill-opacity="0.25" stroke="${c}" stroke-width="4"/><path d="M192,86 L156,80 L156,98 L188,100 Z" fill="#fff" fill-opacity="0.25" stroke="${c}" stroke-width="4"/><line x1="144" y1="88" x2="156" y2="88" stroke="${c}" stroke-width="4"/>`;
    case 'star':
      return starShape(128, 88, 14, 6, c) + starShape(172, 88, 14, 6, c);
  }
  return '';
}

export function accessoryMarkup(o) {
  if (o.style === 'none') return { back: '', front: '' };
  const c = o.color, d = shade(c, -20);
  switch (o.style) {
    case 'headphones':
      return { back: '', front: `<path d="M100,70 Q150,18 200,70" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="100" cy="98" r="15" fill="${c}"/><circle cx="200" cy="98" r="15" fill="${c}"/><circle cx="100" cy="98" r="7" fill="#241934"/><circle cx="200" cy="98" r="7" fill="#241934"/>` };
    case 'scarf':
      return { back: '', front: `<rect x="118" y="130" width="64" height="24" rx="12" fill="${c}"/><rect x="146" y="148" width="20" height="52" rx="8" fill="${d}"/>` };
    case 'mask':
      return { back: '', front: `<rect x="121" y="100" width="58" height="26" rx="13" fill="${c}"/><line x1="121" y1="108" x2="90" y2="96" stroke="${c}" stroke-width="3"/><line x1="179" y1="108" x2="210" y2="96" stroke="${c}" stroke-width="3"/>` };
    case 'backpack':
      return { back: `<rect x="118" y="140" width="64" height="26" rx="10" fill="${c}"/>`, front: `<rect x="132" y="148" width="8" height="40" rx="4" fill="${d}"/><rect x="160" y="148" width="8" height="40" rx="4" fill="${d}"/>` };
    case 'ears':
      return { back: '', front: `<path d="M118,42 L128,4 L146,36 Z" fill="${c}"/><path d="M182,42 L172,4 L154,36 Z" fill="${c}"/><path d="M122,38 L129,14 L140,34 Z" fill="#F2A6C6"/><path d="M178,38 L171,14 L160,34 Z" fill="#F2A6C6"/>` };
    case 'wings':
      return { back: `<path d="M92,170 Q40,180 46,240 Q70,220 96,225 Q80,195 92,170 Z" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M208,170 Q260,180 254,240 Q230,220 204,225 Q220,195 208,170 Z" fill="${c}" stroke="${d}" stroke-width="2"/>`, front: '' };
  }
  return { back: '', front: '' };
}

function overlayTransform() {
  return 'translate(16,44) scale(1.6)';
}

export function renderAvatarFull(state, bodyHtml) {
  const skin = state.skin || '#FFDFC4';
  const faceStyle = state.face || 'gentle';
  const hairOpt = state.hair || { style: 'spiky', color: '#6B4226' };
  const shirtOpt = state.shirt || { style: 'tee', color: '#F5F5F5' };
  const pantsOpt = state.pants || { style: 'shorts', color: '#241F1C' };
  const shoesOpt = state.shoes || { style: 'sneaker', color: '#3B5EA6' };
  const hatOpt = state.hat || { style: 'none' };
  const glassesOpt = state.glasses || { style: 'none' };
  const accOpt = state.accessory || { style: 'none' };

  const bodySvg = bodyHtml || bodyBase(skin);
  const isFullSvg = bodySvg.includes('<svg') || (bodySvg.includes('id="head"') && bodySvg.includes('id="body"'));
  if (isFullSvg) {
    const t = overlayTransform();
    const hair = hairMarkup(hairOpt);
    const acc = accessoryMarkup(accOpt);
    return bodySvg +
      `<g transform="${t}">` + acc.back + hair.back + `</g>` +
      `<g transform="${t}">` +
      drawFace(faceStyle) + hair.front + hatMarkup(hatOpt) + glassesMarkup(glassesOpt) + acc.front +
      `</g>`;
  }

  const hair = hairMarkup(hairOpt);
  const acc = accessoryMarkup(accOpt);

  return acc.back + hair.back + bodySvg + pantsMarkup(pantsOpt) +
    shirtMarkup(shirtOpt) + shoesMarkup(shoesOpt) + drawFace(faceStyle) +
    hair.front + hatMarkup(hatOpt) + glassesMarkup(glassesOpt) + acc.front;
}

export function renderAvatarFullWithOverrides(state, overrides = {}) {
  const skin = state.skin || '#FFDFC4';
  const faceStyle = state.face || 'gentle';
  const hairOpt = state.hair || { style: 'spiky', color: '#6B4226' };
  const shirtOpt = state.shirt || { style: 'tee', color: '#F5F5F5' };
  const pantsOpt = state.pants || { style: 'shorts', color: '#241F1C' };
  const shoesOpt = state.shoes || { style: 'sneaker', color: '#3B5EA6' };
  const hatOpt = state.hat || { style: 'none' };
  const glassesOpt = state.glasses || { style: 'none' };
  const accOpt = state.accessory || { style: 'none' };

  const bodySvg = overrides.body || overrides.skin || bodyBase(skin);

  const isFullSvg = bodySvg.includes('<svg') || (bodySvg.includes('id="head"') && bodySvg.includes('id="body"'));

  if (isFullSvg) {
    const t = overlayTransform();
    let hairBack = '', hairFront = '';
    if (overrides.hair) {
      const sp = splitBackFront(overrides.hair);
      hairBack = sp.back; hairFront = sp.front;
    } else {
      const h = hairMarkup(hairOpt); hairBack = h.back; hairFront = h.front;
    }
    let accBack = '', accFront = '';
    if (overrides.accessory) {
      const sp = splitBackFront(overrides.accessory);
      accBack = sp.back; accFront = sp.front;
    } else {
      const a = accessoryMarkup(accOpt); accBack = a.back; accFront = a.front;
    }
    return bodySvg +
      `<g transform="${t}">` + accBack + hairBack + `</g>` +
      `<g transform="${t}">` +
      (overrides.face || drawFace(faceStyle)) + hairFront +
      (overrides.hat || hatMarkup(hatOpt)) +
      (overrides.glasses || glassesMarkup(glassesOpt)) +
      accFront +
      `</g>`;
  }

  let hairBack = '', hairFront = '';
  if (overrides.hair) {
    const sp = splitBackFront(overrides.hair);
    hairBack = sp.back; hairFront = sp.front;
  } else {
    const h = hairMarkup(hairOpt); hairBack = h.back; hairFront = h.front;
  }

  let accBack = '', accFront = '';
  if (overrides.accessory) {
    const sp = splitBackFront(overrides.accessory);
    accBack = sp.back; accFront = sp.front;
  } else {
    const a = accessoryMarkup(accOpt); accBack = a.back; accFront = a.front;
  }

  return accBack + hairBack + bodySvg +
    (overrides.pants || pantsMarkup(pantsOpt)) +
    (overrides.shirt || shirtMarkup(shirtOpt)) +
    (overrides.shoes || shoesMarkup(shoesOpt)) +
    (overrides.face || drawFace(faceStyle)) +
    hairFront +
    (overrides.hat || hatMarkup(hatOpt)) +
    (overrides.glasses || glassesMarkup(glassesOpt)) +
    accFront;
}

export const SKIN = [
  { name: 'Trắng hồng', hex: '#FFDFC4' },
  { name: 'Vàng sáng', hex: '#F0C299' },
  { name: 'Rám nắng', hex: '#D9A066' },
  { name: 'Nâu đồng', hex: '#A9714F' },
  { name: 'Nâu sẫm', hex: '#6B4226' },
];

export const FACE = [
  { name: 'Hiền dịu', style: 'gentle', emoji: '🙂' },
  { name: 'Vui tươi', style: 'happy', emoji: '😄' },
  { name: 'Tinh nghịch', style: 'wink', emoji: '😉' },
  { name: 'Cười to', style: 'laughing', emoji: '😆' },
  { name: 'Cá tính', style: 'fierce', emoji: '😠' },
];

export const HAIR = {
  boy: [
    { name: 'Bờm gai nâu', style: 'spiky', color: '#6B4226' },
    { name: 'Bờm gai đen', style: 'spiky', color: '#241F1C' },
    { name: 'Tóc rối navy', style: 'messy', color: '#2A3A6B' },
    { name: 'Tóc rối bạc', style: 'messy', color: '#D8D8D8' },
    { name: 'Bờm gai đỏ', style: 'wild', color: '#C0392B' },
    { name: 'Chải lệch hạt dẻ', style: 'side', color: '#4A2E1E' },
    { name: 'Chải lệch vàng', style: 'side', color: '#E8B94B' },
    { name: 'Bờm gai lục', style: 'wild', color: '#2F8F5B' },
    { name: 'Tóc rối tím', style: 'messy', color: '#7B4FA0' },
    { name: 'Bờm gai ngọc lam', style: 'spiky', color: '#2F9E9E' },
  ],
  girl: [
    { name: 'Tóc dài nâu', style: 'long', color: '#6B4226' },
    { name: 'Hai bím nâu', style: 'twin', color: '#6B4226' },
    { name: 'Tóc xoăn hồng', style: 'wavy', color: '#F2A6C6' },
    { name: 'Tóc dài vàng', style: 'long', color: '#E8B94B' },
    { name: 'Tóc dài đen', style: 'long', color: '#241F1C' },
    { name: 'Tóc xoăn navy', style: 'wavy', color: '#2A3A6B' },
    { name: 'Tóc xoăn tím', style: 'wavy', color: '#7B4FA0' },
    { name: 'Tóc tết hạt dẻ', style: 'braid', color: '#4A2E1E' },
    { name: 'Tóc dài nâu nhạt', style: 'long', color: '#8A5A34' },
    { name: 'Hai bím đen', style: 'twin', color: '#241F1C' },
  ],
};

export const SHIRT = {
  boy: [
    { name: 'Áo phông trắng', style: 'tee', color: '#F5F5F5' },
    { name: 'Áo hoodie đen', style: 'hoodie', color: '#241F1C' },
    { name: 'Áo hoodie đỏ', style: 'hoodie', color: '#C0392B' },
    { name: 'Áo khoác xanh', style: 'jacket', color: '#3FB6E8' },
    { name: 'Áo khoác đen', style: 'jacket', color: '#241F1C' },
    { name: 'Áo hoodie vàng', style: 'hoodie', color: '#F2B705' },
    { name: 'Áo hoodie lục', style: 'hoodie', color: '#2F8F5B' },
    { name: 'Áo polo trắng', style: 'polo', color: '#F5F5F5' },
    { name: 'Áo phông đen', style: 'tee', color: '#241F1C' },
    { name: 'Áo hoodie trắng', style: 'hoodie', color: '#F5F5F5' },
  ],
  girl: [
    { name: 'Áo phông nơ trắng', style: 'tee', color: '#F5F5F5' },
    { name: 'Áo len hồng', style: 'sweater', color: '#F2A6C6' },
    { name: 'Áo len xanh nơ', style: 'sweater', color: '#8FD3F4' },
    { name: 'Áo hoodie đen', style: 'hoodie', color: '#241F1C' },
    { name: 'Áo phông tim', style: 'tee', color: '#FDFDFD' },
    { name: 'Áo cardigan vàng', style: 'cardigan', color: '#F2B705' },
    { name: 'Áo khoác đen phối', style: 'jacket', color: '#241F1C' },
    { name: 'Áo hoodie hồng', style: 'hoodie', color: '#F2A6C6' },
    { name: 'Áo thủy thủ trắng', style: 'sailor', color: '#F5F5F5' },
    { name: 'Áo thủy thủ navy', style: 'sailor', color: '#2A3A6B' },
  ],
};

export const PANTS = {
  boy: [
    { name: 'Quần short đen', style: 'shorts', color: '#241F1C' },
    { name: 'Quần short xanh', style: 'shorts', color: '#3FB6E8' },
    { name: 'Quần cargo be', style: 'cargo', color: '#D2B48C' },
    { name: 'Quần short xám', style: 'shorts', color: '#9AA0A6' },
    { name: 'Quần jean xanh', style: 'jeans', color: '#3B5EA6' },
    { name: 'Quần jogger đen', style: 'joggers', color: '#241F1C' },
    { name: 'Quần cargo olive', style: 'cargo', color: '#6E7B3B' },
    { name: 'Quần kaki', style: 'jeans', color: '#C8B27A' },
    { name: 'Quần jean đen', style: 'jeans', color: '#2B2B2B' },
    { name: 'Quần short kem', style: 'shorts', color: '#E8DCC4' },
  ],
  girl: [
    { name: 'Váy xếp ly đen', style: 'skirt', color: '#241F1C' },
    { name: 'Váy xếp ly trắng', style: 'skirt', color: '#F5F5F5' },
    { name: 'Váy caro hồng', style: 'skirt', color: '#F2A6C6' },
    { name: 'Quần short đen', style: 'shorts', color: '#241F1C' },
    { name: 'Váy navy', style: 'skirt', color: '#2A3A6B' },
    { name: 'Quần short hồng', style: 'shorts', color: '#F2A6C6' },
    { name: 'Quần jean xanh nhạt', style: 'jeans', color: '#8FB8E6' },
    { name: 'Quần cargo hồng', style: 'cargo', color: '#E6A5C0' },
    { name: 'Quần jean đen', style: 'jeans', color: '#2B2B2B' },
    { name: 'Váy xếp ly xanh', style: 'skirt', color: '#3B5EA6' },
  ],
};

export const SHOES = {
  boy: [
    { name: 'Giày thể thao xanh', style: 'sneaker', color: '#3B5EA6' },
    { name: 'Giày thể thao đỏ', style: 'sneaker', color: '#C0392B' },
    { name: 'Giày thể thao trắng', style: 'sneaker', color: '#F5F5F5' },
    { name: 'Bốt đen', style: 'boots', color: '#241F1C' },
    { name: 'Giày thể thao vàng', style: 'sneaker', color: '#F2B705' },
    { name: 'Giày thể thao lục', style: 'sneaker', color: '#2F8F5B' },
    { name: 'Bốt nâu', style: 'boots', color: '#8A5A34' },
    { name: 'Giày đỏ đen', style: 'sneaker', color: '#8E2A2A' },
    { name: 'Bốt đen cao', style: 'boots', color: '#3A3A3A' },
    { name: 'Bốt trắng', style: 'boots', color: '#F0F0F0' },
  ],
  girl: [
    { name: 'Giày thể thao hồng', style: 'sneaker', color: '#F2A6C6' },
    { name: 'Giày thể thao trắng', style: 'sneaker', color: '#F5F5F5' },
    { name: 'Bốt đen', style: 'boots', color: '#241F1C' },
    { name: 'Bốt hồng', style: 'boots', color: '#E6A5C0' },
    { name: 'Giày thể thao xanh', style: 'sneaker', color: '#8FD3F4' },
    { name: 'Bốt trắng', style: 'boots', color: '#F0F0F0' },
    { name: 'Bốt hồng phấn', style: 'boots', color: '#F6C6DA' },
    { name: 'Giày thể thao đen', style: 'sneaker', color: '#2B2B2B' },
    { name: 'Bốt navy', style: 'boots', color: '#2A3A6B' },
    { name: 'Giày thể thao vàng', style: 'sneaker', color: '#F2B705' },
  ],
};

export const HAT = [
  { name: 'Không đội mũ', style: 'none' },
  { name: 'Mũ lưỡi trai xanh', style: 'cap', color: '#3FB6E8' },
  { name: 'Mũ lưỡi trai đen', style: 'cap', color: '#241F1C' },
  { name: 'Mũ lưỡi trai đỏ', style: 'cap', color: '#C0392B' },
  { name: 'Mũ len đen', style: 'beanie', color: '#241F1C' },
  { name: 'Mũ bucket vàng', style: 'bucket', color: '#F2B705' },
  { name: 'Mũ bucket lục', style: 'bucket', color: '#2F8F5B' },
  { name: 'Mũ nồi cao', style: 'tophat', color: '#241F1C' },
  { name: 'Mũ rơm', style: 'sunhat', color: '#E8B94B' },
];

export const GLASSES = [
  { name: 'Không đeo kính', style: 'none' },
  { name: 'Kính tròn đen', style: 'round', color: '#241F1C' },
  { name: 'Kính tròn vàng', style: 'round', color: '#C99A2E' },
  { name: 'Kính trái tim', style: 'heart', color: '#FF5DA2' },
  { name: 'Kính râm vuông', style: 'sun', color: '#1C1C1C' },
  { name: 'Kính mắt mèo hồng', style: 'cat', color: '#FF5DA2' },
  { name: 'Kính mắt mèo đen', style: 'cat', color: '#241F1C' },
  { name: 'Kính ngôi sao', style: 'star', color: '#F2B705' },
];

export const ACCESSORY = [
  { name: 'Không có', style: 'none' },
  { name: 'Tai nghe xanh', style: 'headphones', color: '#3FB6E8' },
  { name: 'Tai nghe hồng', style: 'headphones', color: '#FF5DA2' },
  { name: 'Khăn quàng đỏ', style: 'scarf', color: '#C0392B' },
  { name: 'Khăn quàng trắng', style: 'scarf', color: '#F5F5F5' },
  { name: 'Khẩu trang đen', style: 'mask', color: '#241F1C' },
  { name: 'Balo xanh', style: 'backpack', color: '#3FB6E8' },
  { name: 'Balo hồng', style: 'backpack', color: '#FF5DA2' },
  { name: 'Tai mèo đen', style: 'ears', color: '#241F1C' },
  { name: 'Cánh thiên thần', style: 'wings', color: '#FFFFFF' },
  { name: 'Cánh dơi đen', style: 'wings', color: '#241F1C' },
];

export const CATEGORY_LIST = [
  { key: 'body', label: 'Body' },
  { key: 'skin', label: 'Da' },
  { key: 'face', label: 'Khuôn mặt' },
  { key: 'hair', label: 'Tóc' },
  { key: 'shirt', label: 'Áo' },
  { key: 'pants', label: 'Quần' },
  { key: 'shoes', label: 'Giày' },
  { key: 'hat', label: 'Mũ' },
  { key: 'glasses', label: 'Kính' },
  { key: 'accessory', label: 'Phụ kiện' },
];

export function getOptions(key, gender = 'boy') {
  switch (key) {
    case 'skin': return SKIN;
    case 'face': return FACE;
    case 'hair': return HAIR[gender];
    case 'shirt': return SHIRT[gender];
    case 'pants': return PANTS[gender];
    case 'shoes': return SHOES[gender];
    case 'hat': return HAT;
    case 'glasses': return GLASSES;
    case 'accessory': return ACCESSORY;
  }
  return [];
}

export function renderItemHtml(category, params) {
  if (category === 'skin') return '';
  if (category === 'body') return bodyBase(params?.skin || '#FFDFC4');
  if (category === 'face') return drawFace(params.style || 'gentle');
  if (category === 'hair') { const h = hairMarkup({ style: params.style || 'spiky', color: params.color || '#6B4226' }); return h.back + h.front; }
  if (category === 'shirt') return shirtMarkup({ style: params.style || 'tee', color: params.color || '#F5F5F5' });
  if (category === 'pants') return pantsMarkup({ style: params.style || 'shorts', color: params.color || '#241F1C' });
  if (category === 'shoes') return shoesMarkup({ style: params.style || 'sneaker', color: params.color || '#3B5EA6' });
  if (category === 'hat') return hatMarkup({ style: params.style || 'none', color: params.color || '#000' });
  if (category === 'glasses') return glassesMarkup({ style: params.style || 'none', color: params.color || '#000' });
  if (category === 'accessory') { const a = accessoryMarkup({ style: params.style || 'none', color: params.color || '#000' }); return a.back + a.front; }
  return '';
}

function splitBackFront(html) {
  if (!html) return { back: '', front: '' };
  const gEnd = html.lastIndexOf('</g>');
  if (gEnd !== -1) {
    const splitAt = gEnd + 4;
    return { back: html.slice(0, splitAt), front: html.slice(splitAt) };
  }
  return { back: '', front: html };
}
