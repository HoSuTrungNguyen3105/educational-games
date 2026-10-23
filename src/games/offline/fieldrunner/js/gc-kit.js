/* =====================================================
   GC KIT · logic dùng chung
   Chọn độ khó, kỷ lục theo độ khó, hộp kết quả
   ===================================================== */
(function () {
  'use strict';

  if (window.GC) return;

  var LV = [
    { i: 0, key: 'easy',   label: 'Dễ',         emoji: '🌱',  color: 'var(--gc-mint)' },
    { i: 1, key: 'normal', label: 'Trung bình', emoji: '🌤️', color: 'var(--gc-sun)' },
    { i: 2, key: 'hard',   label: 'Khó',        emoji: '🔥',  color: 'var(--gc-tomato)' },
    { i: 3, key: 'insane', label: 'Siêu khó',   emoji: '💀',  color: 'var(--gc-lilac)' }
  ];

  var DEFAULT_LEVEL_TEXT = [
    'Thong thả, ít áp lực',
    'Cân bằng, vừa sức',
    'Nhanh hơn, ít sai sót',
    'Thử thách cực đại'
  ];

  /* ---------- Tiện ích lưu trữ (an toàn khi bị chặn storage) ---------- */
  function ls(op, k, v) {
    try {
      return op === 'get' ? localStorage.getItem(k) : localStorage.setItem(k, v);
    } catch (e) {
      return null;
    }
  }

  function ss(op, k, v) {
    try {
      if (op === 'get') return sessionStorage.getItem(k);
      if (op === 'del') return sessionStorage.removeItem(k);
      return sessionStorage.setItem(k, v);
    } catch (e) {
      return null;
    }
  }

  function esc(s) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return map[c];
    });
  }

  var GC = window.GC = {
    levels: LV,
    id: 'game',
    diff: LV[1],

    /** Độ khó hiện tại: 0 dễ · 1 trung bình · 2 khó · 3 siêu khó */
    get i() {
      return GC.diff.i;
    },

    /** GC.by(a,b,c,d) hoặc GC.by([a,b,c,d]) → giá trị theo độ khó đang chọn */
    by: function (a, b, c, d) {
      var arr = Array.isArray(a) ? a : [a, b, c, d];
      return arr[GC.diff.i];
    },

    setDiff: function (i) {
      GC.diff = LV[Math.max(0, Math.min(3, i | 0))];
    },

    esc: esc,

    /* ---------- Kỷ lục theo độ khó ---------- */
    best: {
      key: function (id, i) {
        return 'gc:' + id + ':best:' + LV[i == null ? GC.diff.i : i].key;
      },

      get: function (id, i) {
        return +ls('get', GC.best.key(id || GC.id, i)) || 0;
      },

      /** Lưu nếu cao hơn. Trả về true nếu là kỷ lục mới. */
      set: function (id, score, i) {
        id = id || GC.id;
        score = +score || 0;

        if (score > GC.best.get(id, i)) {
          ls('set', GC.best.key(id, i), score);
          return true;
        }
        return false;
      },

      /** Với game tính theo "thấp hơn là tốt hơn" (thời gian, số bước). */
      setLow: function (id, score, i) {
        id = id || GC.id;
        score = +score || 0;

        var cur = GC.best.get(id, i);
        if (score > 0 && (!cur || score < cur)) {
          ls('set', GC.best.key(id, i), score);
          return true;
        }
        return false;
      }
    },

    /** HTML pill độ khó: "🔥 Khó" */
    chip: function () {
      return '<span class="gc-pill gc-d' + GC.diff.i + '" title="Độ khó">' +
        GC.diff.emoji + ' ' + GC.diff.label + '</span>';
    },

    /** Gắn chip độ khó nổi ở góc phải trên. */
    mountChip: function () {
      var el = document.querySelector('.gc-chip');
      if (!el) {
        el = document.createElement('div');
        el.className = 'gc-chip';
        document.body.appendChild(el);
      }
      el.innerHTML = GC.chip();
      return el;
    },

    /** Thoát về danh sách game (báo cho React host) hoặc về trang chủ nếu mở riêng. */
    quit: function () {
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'quit', data: {} }, '*');
          return;
        }
      } catch (e) { /* bỏ qua */ }

      try {
        window.location.href = '/';
      } catch (e) { /* bỏ qua */ }
    },

    /** Chơi lại CÙNG độ khó: nạp lại trang và tự bắt đầu, bỏ qua màn chọn. */
    again: function () {
      ss('set', 'gc:auto:' + GC.id, String(GC.diff.i));
      location.reload();
    },

    /** Quay lại màn chọn độ khó. */
    change: function () {
      ss('del', 'gc:auto:' + GC.id);
      location.reload();
    },

    /**
     * Hiện màn chọn độ khó. cfg:
     *   id, name, icon, desc,
     *   levels: [4 chuỗi mô tả riêng cho từng độ khó],
     *   resume: { i, text } (tuỳ chọn),
     *   onStart(diff), onResume(diff)
     */
    start: function (cfg) {
      GC.id = cfg.id || 'game';

      var texts = cfg.levels || DEFAULT_LEVEL_TEXT;
      var last = ls('get', 'gc:' + GC.id + ':diff');
      var sel = (last != null && last !== '' && +last >= 0 && +last <= 3) ? +last : 1;

      function launch(i, resumed) {
        GC.setDiff(i);
        ls('set', 'gc:' + GC.id + ':diff', String(i));

        var el = document.getElementById('gc-start');
        if (el) {
          el.classList.add('out');
          setTimeout(function () { el.remove(); }, 240);
        }

        document.removeEventListener('keydown', onKey, true);

        if (resumed && cfg.onResume) cfg.onResume(GC.diff);
        else if (cfg.onStart) cfg.onStart(GC.diff);
      }

      /* Chơi lại cùng độ khó: bỏ qua màn chọn */
      var auto = ss('get', 'gc:auto:' + GC.id);
      if (auto != null && auto !== '') {
        ss('del', 'gc:auto:' + GC.id);
        GC.setDiff(+auto);
        if (cfg.onStart) {
          cfg.onStart(GC.diff);
          return;
        }
      }

      var hasBack = !!document.getElementById('homeBackBtn');
      var root = document.createElement('div');

      root.className = 'gc-start';
      root.id = 'gc-start';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-label', 'Chọn độ khó — ' + (cfg.name || ''));

      var levelsHtml = LV.map(function (l) {
        var best = GC.best.get(GC.id, l.i);

        var pips = [0, 1, 2, 3].map(function (k) {
          return '<i' + (k <= l.i ? ' class="on"' : '') + '></i>';
        }).join('');

        return '' +
          '<button type="button" class="gc-lv" role="radio" data-i="' + l.i + '" style="--c:' + l.color + '">' +
            '<span class="e">' + l.emoji + '</span>' +
            '<span class="t">' +
              '<b>' + l.label + '<span class="pips">' + pips + '</span></b>' +
              '<small>' + esc(texts[l.i] || '') + '</small>' +
            '</span>' +
            (best ? '<span class="bst">🏆 ' + best + '</span>' : '') +
          '</button>';
      }).join('');

      root.innerHTML = '' +
        (hasBack ? '' : '<button class="gc-back" type="button" aria-label="Về sảnh">←</button>') +
        '<div class="gc-card">' +
          '<div class="gc-ico">' + esc(cfg.icon || '🎮') + '</div>' +
          '<h1 class="gc-title">' + esc(cfg.name || 'Trò chơi') + '</h1>' +
          (cfg.desc ? '<p class="gc-desc">' + esc(cfg.desc) + '</p>' : '') +
          '<div class="gc-h">Chọn độ khó</div>' +
          '<div class="gc-levels" role="radiogroup" aria-label="Độ khó">' + levelsHtml + '</div>' +
          '<div class="gc-actions">' +
            '<button type="button" class="gc-btn gc-go">▶ Bắt đầu</button>' +
            (cfg.resume
              ? '<button type="button" class="gc-btn alt gc-resume">⏯ Tiếp tục ván đang chơi · ' +
                LV[cfg.resume.i].emoji + ' ' + LV[cfg.resume.i].label + '</button>'
              : '') +
          '</div>' +
        '</div>';

      document.body.appendChild(root);

      var btns = [].slice.call(root.querySelectorAll('.gc-lv'));

      function paint() {
        btns.forEach(function (b) {
          b.setAttribute('aria-checked', String(+b.dataset.i === sel));
        });
      }
      paint();

      btns.forEach(function (b) {
        b.onclick = function () {
          sel = +b.dataset.i;
          paint();
        };
        b.ondblclick = function () {
          launch(sel, false);
        };
      });

      root.querySelector('.gc-go').onclick = function () {
        launch(sel, false);
      };

      var resumeBtn = root.querySelector('.gc-resume');
      if (resumeBtn) {
        resumeBtn.onclick = function () {
          launch(cfg.resume.i, true);
        };
      }

      var backBtn = root.querySelector('.gc-back');
      if (backBtn) backBtn.onclick = GC.quit;

      function onKey(e) {
        if (!document.getElementById('gc-start')) return;

        if (e.key >= '1' && e.key <= '4') {
          sel = +e.key - 1;
          paint();
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          sel = Math.max(0, sel - 1);
          paint();
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          sel = Math.min(3, sel + 1);
          paint();
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'Enter') {
          launch(sel, false);
          e.preventDefault();
          e.stopPropagation();
        } else if (e.key === 'Escape') {
          GC.quit();
        }
      }
      document.addEventListener('keydown', onKey, true);

      var go = root.querySelector('.gc-go');
      try {
        go.focus({ preventScroll: true });
      } catch (e) { /* bỏ qua */ }
    },

    /**
     * Hộp kết quả thống nhất. cfg:
     *   title, score, lines:[], win:boolean, low:boolean (thấp hơn = tốt hơn),
     *   onAgain, onChange, onHome
     */
    result: function (cfg) {
      var isBest = cfg.score != null &&
        (cfg.low ? GC.best.setLow(GC.id, cfg.score) : GC.best.set(GC.id, cfg.score));

      var prev = document.getElementById('gc-modal');
      if (prev) prev.remove();

      var modal = document.createElement('div');
      modal.className = 'gc-modal';
      modal.id = 'gc-modal';

      var lines = (cfg.lines || []).map(function (l) {
        return '<span>' + esc(l) + '</span>';
      }).join('');

      modal.innerHTML = '' +
        '<div class="gc-panel" role="dialog">' +
          '<h2>' + esc(cfg.title || (cfg.win ? 'Chiến thắng! 🎉' : 'Hoàn thành!')) + '</h2>' +
          '<div style="margin-top:8px">' + GC.chip() + '</div>' +
          (cfg.score != null ? '<div class="gc-big">' + esc(cfg.score) + '</div>' : '') +
          '<div class="gc-stats">' + (isBest ? '<span>🏆 Kỷ lục mới</span>' : '') + lines + '</div>' +
          '<div class="gc-row">' +
            '<button class="gc-btn" data-a="again">Chơi lại</button>' +
            '<button class="gc-btn alt" data-a="change">Đổi độ khó</button>' +
            '<button class="gc-btn alt" data-a="home">Về sảnh</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);

      modal.onclick = function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;

        var action = b.dataset.a;
        if (action === 'again') (cfg.onAgain || GC.again)();
        else if (action === 'change') (cfg.onChange || GC.change)();
        else (cfg.onHome || GC.quit)();
      };

      return modal;
    }
  };
})();
