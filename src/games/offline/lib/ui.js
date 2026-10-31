// lib/ui.js — khung mở đầu + chọn nhịp độ dùng chung cho game một màn.
//
// Trước đây mỗi game tự dựng một màn intro khác nhau (có game không có),
// còn thanh chọn độ khó thì bị nhúng rời vào file HTML sinh ra. File này
// thay cả hai bằng MỘT khung duy nhất:
//
//   gqIntro(root, { id, icon, name, desc, steps }, mode => { ... });
//
// Mỗi mức chỉ đổi 3 thứ: pace (nhịp nhanh/chậm), lives (số mạng) và mult
// (hệ số điểm). Game tự dùng các con số đó, KHÔNG vá setTimeout/Date.now
// toàn cục — nhờ vậy bộ test Node vẫn boot được và không có hiệu ứng phụ.

const GQ_MODES = [
  { k: 'easy', n: 'Easy', e: '🌱', pace: .8,  lives: 5, mult: 1,   d: 'Slow, extra lives' },
  { k: 'mid',  n: 'Normal', e: '🔥', pace: 1,   lives: 3, mult: 1.5, d: 'Balanced pace' },
  { k: 'hard', n: 'Hard', e: '⚡', pace: 1.3, lives: 2, mult: 2,   d: 'Fast, fewer lives' },
];

const GQ_MODE_KEY = 'gq_mode:';

function gqReadMode(id) {
  try {
    const v = Number(localStorage.getItem(GQ_MODE_KEY + id));
    return v >= 0 && v < GQ_MODES.length ? v : 1;
  } catch (e) {
    return 1;
  }
}

function gqWriteMode(id, i) {
  try { localStorage.setItem(GQ_MODE_KEY + id, String(i)); } catch (e) { /* ignore */ }
}

/** Nhân điểm gốc theo mức đã chọn. */
function gqScore(mode, score) {
  return Math.round((Number(score) || 0) * mode.mult);
}

/** Thời gian gốc (giây) co lại khi nhịp nhanh hơn. */
function gqSecs(base, mode) {
  return Math.max(8, Math.round(base / mode.pace));
}

/** Khoảng chờ gốc (ms) ngắn lại khi nhịp nhanh hơn. */
function gqMs(base, mode) {
  return Math.max(80, Math.round(base / mode.pace));
}

/**
 * Vẽ màn mở đầu chung rồi gọi go(mode) khi người chơi chọn nhịp.
 * @param {HTMLElement} root
 * @param {{ id:string, icon:string, name:string, desc?:string, steps?:string[] }} cfg
 * @param {(mode:object, index:number) => void} go
 */
function gqIntro(root, cfg, go) {
  const last = gqReadMode(cfg.id);
  const best = (S.best && S.best[cfg.id]) || 0;
  root.innerHTML = `<div class="panel intro">
    <div class="intro-ic">${cfg.icon || '🎮'}</div>
    <h2>${cfg.name || ''}</h2>
    ${cfg.desc ? `<p>${cfg.desc}</p>` : ''}
    ${cfg.steps && cfg.steps.length ? `<ul class="intro-steps">${cfg.steps.map((s) => `<li>${s}</li>`).join('')}</ul>` : ''}
    <p class="intro-best">${best ? `🏆 Your best: <b>${best}</b>` : 'Pick a pace to start'}</p>
    <div class="modes">${GQ_MODES.map((m, i) => `<button class="mode${i === last ? ' sel' : ''}" data-mode="${i}">
      <i>${m.e}</i><b>${m.n}</b><em>${m.d}</em></button>`).join('')}</div>
  </div>`;
  root.onclick = (e) => {
    const b = e.target.closest('[data-mode]');
    if (!b) return;
    const i = Number(b.dataset.mode);
    if (!(i >= 0 && i < GQ_MODES.length)) return;
    gqWriteMode(cfg.id, i);
    sfx.ok();
    go(GQ_MODES[i], i);
  };
}

/** Một dòng HUD thống nhất: điểm · mạng · tiến độ. */
function gqHud(score, lives, extra) {
  return `<div class="hud">
    <span>⭐ <b>${score}</b></span>
    <span class="hearts">${lives > 0 ? '❤️'.repeat(lives) : '💔'}</span>
    ${extra ? `<span>${extra}</span>` : ''}
  </div>`;
}

/** Hàng chấm tiến độ cho game theo lượt. */
function gqDots(total, done) {
  return `<div class="dots">${Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('')}</div>`;
}
