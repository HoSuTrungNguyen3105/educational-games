// src/games/src/anagram.js — Đảo Chữ Nhí (Tiếng Anh)
// Sinh tự động từ game4.html bởi scripts/split-offline-games.mjs.
// Sửa file này, KHÔNG sửa game4.html.

    const WORDS = [
      ['apple', 'quả táo'], ['dog', 'con chó'], ['book', 'quyển sách'], ['sun', 'mặt trời'],
      ['bag', 'cái cặp'], ['car', 'ô tô'], ['fish', 'con cá'], ['bird', 'con chim'],
      ['milk', 'sữa'], ['tree', 'cây'], ['star', 'ngôi sao'], ['rain', 'mưa'],
      ['snow', 'tuyết'], ['cake', 'bánh'], ['duck', 'vịt'], ['moon', 'mặt trăng'],
      ['ship', 'con thuyền'], ['frog', 'con ếch'], ['lion', 'sư tử'], ['leaf', 'chiếc lá'],
      ['clock', 'đồng hồ'], ['desk', 'bàn học'], ['hand', 'bàn tay'], ['king', 'vua'],
    ];

    function scramble(word) {
      if (word.length < 3) return word;
      for (let i = 0; i < 12; i++) {
        const a = shuffle(word.split('')).join('');
        if (a !== word) return a;
      }
      return word.split('').reverse().join('');
    }

    /** Chọn 1 phần tử ngẫu nhiên. Tên riêng để không đụng hàm tiện ích của game-core. */
    function pickOne(arr) { return arr[rnd(0, arr.length - 1)]; }

    /** Lấy n phần tử ngẫu nhiên không trùng nhau. */
    function sample(arr, n) { return shuffle([...arr]).slice(0, n); }

    /** Sinh 3 đáp án sai cho 1 đáp án đúng. */
    function distractors(pool, right, n = 3) {
      return sample([...new Set(pool.filter(x => x !== right))], n);
    }

    /* ══════════════════════════════════════════════════════════════════════════
       CÁC MINI-GAME — mỗi game có make(level) trả về 1 câu hỏi
       ══════════════════════════════════════════════════════════════════════ */


MC_MAKERS.anagram = function anagram(level) {
        const pool = WORDS.slice(0, Math.min(WORDS.length, 6 + level * 4));
        const [en, vi] = pickOne(pool);
        const all = WORDS.map(w => w[0]);
        const opts = shuffle([en, ...distractors(all, en)]);
        return {
          html: `<div style="font-size:11px;opacity:.7">XẾP LẠI TỪ</div>
                 <div style="font-size:34px;letter-spacing:8px;font-weight:800">${scramble(en)}</div>
                 <div style="font-size:14px;opacity:.85;margin-top:6px">Nghĩa: ${vi}</div>`,
          opts, ans: en,
          exp: `Từ đúng là <b>${en}</b> — ${vi}.`,
        };
      },
startMcGame('anagram', {
  name: 'Đảo Chữ Nhí',
  icon: '🧩',
  badges: [

  ],
});
