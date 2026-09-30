(function (root) {
  "use strict";

  const SCHEMA_VERSION = 2;

  const GAME_DEFS = [
    {
      key: "bongbay",
      name: "Bóng Bay Vui",
      icon: "🎈",
      desc: "Chạm bong bóng đúng: số, đếm, chữ cái, màu sắc.",
      file: "src/games/timed-games/Ballon.html",
      templateNames: ["Bóng Bay Vui", "Bóng bay vui", "Ballon", "ballon"],
      settings: [
        { key: "totalQ", label: "Số câu mỗi lượt", type: "number", default: 10, min: 5, max: 20, step: 1 },
        { key: "maxNum", label: "Số lớn nhất ở chủ đề “Số”", type: "number", default: 10, min: 4, max: 10, step: 1, help: "Ví dụ 5: bé chỉ học số từ 1 đến 5." },
        { key: "speed", label: "Tốc độ bong bóng bay", type: "number", default: 1, min: 0.5, max: 2, step: 0.1, format: "multiply" },
        { key: "hintAfter", label: "Gợi ý sau khi chạm sai … lần", type: "number", default: 2, min: 1, max: 4, step: 1 },
        { key: "hintSec", label: "Gợi ý nếu bé chưa chạm sau … giây", type: "number", default: 12, min: 5, max: 30, step: 1, format: "seconds" }
      ],
      lists: [
        {
          key: "letters", title: "🔤 Chữ cái", kind: "rows", itemType: "object", min: 4,
          help: "Chữ cái, từ ví dụ và hình. Cần ít nhất 4 chữ.",
          fields: [
            { key: "l", placeholder: "A", cls: "ltr" },
            { key: "w", placeholder: "Từ ví dụ", cls: "wide" },
            { key: "e", placeholder: "👕", cls: "em" }
          ],
          newItem: { l: "", w: "", e: "" },
          rows: [
            { l: "A", w: "Áo", e: "👕" },
            { l: "B", w: "Bóng", e: "⚽" },
            { l: "C", w: "Cá", e: "🐟" },
            { l: "D", w: "Dưa hấu", e: "🍉" },
            { l: "E", w: "Em bé", e: "👶" },
            { l: "G", w: "Gà", e: "🐔" },
            { l: "H", w: "Hoa", e: "🌸" },
            { l: "K", w: "Kem", e: "🍦" },
            { l: "L", w: "Lá", e: "🍃" },
            { l: "M", w: "Mèo", e: "🐱" },
            { l: "N", w: "Nón", e: "👒" },
            { l: "O", w: "Ong", e: "🐝" },
            { l: "S", w: "Sao", e: "⭐" },
            { l: "T", w: "Táo", e: "🍎" },
            { l: "V", w: "Voi", e: "🐘" },
            { l: "X", w: "Xe", e: "🚗" }
          ]
        },
        {
          key: "colors", title: "🌈 Màu sắc", kind: "rows", itemType: "object", min: 4,
          help: "Tên màu và màu hiển thị. Cần ít nhất 4 màu.",
          fields: [
            { key: "n", placeholder: "Tên màu", cls: "wide" },
            { key: "c", placeholder: "", type: "color", cls: "clr" }
          ],
          newItem: { n: "", c: "#FF5A5F" },
          rows: [
            { n: "đỏ", c: "#FF5A5F" },
            { n: "xanh dương", c: "#3B82F6" },
            { n: "xanh lá", c: "#22C55E" },
            { n: "vàng", c: "#FACC15" },
            { n: "cam", c: "#FB923C" },
            { n: "hồng", c: "#F472B6" },
            { n: "tím", c: "#A855F7" }
          ]
        },
        {
          key: "counters", title: "🍎 Hình để đếm", kind: "rows", itemType: "string", min: 1,
          help: "Mỗi ô một biểu tượng emoji.",
          fields: [{ placeholder: "😀", cls: "em" }],
          newItem: "",
          rows: ["🍎", "🐥", "⭐", "🐟", "🚗", "🌸", "🎈", "🍓"]
        },
        {
          key: "praise", title: "🎉 Lời khen", kind: "rows", itemType: "string", min: 1,
          help: "Gấu nói khi bé chọn đúng.",
          fields: [{ placeholder: "Giỏi quá!", cls: "wide" }],
          newItem: "",
          rows: ["Giỏi quá!", "Tuyệt vời!", "Đúng rồi!", "Hoan hô!", "Bé thật thông minh!", "Siêu quá!"]
        },
        {
          key: "retry", title: "💪 Lời động viên", kind: "rows", itemType: "string", min: 1,
          help: "Gấu nói khi bé chọn sai.",
          fields: [{ placeholder: "Thử lại nhé!", cls: "wide" }],
          newItem: "",
          rows: ["Ồ, thử lại nhé!", "Gần đúng rồi, cố lên!", "Bé thử bong bóng khác nào!"]
        }
      ]
    },

    {
      key: "bechon",
      name: "Bé Chọn Đúng",
      icon: "🐻",
      desc: "Game cực dễ cho bé nhỏ: con vật, trái cây, đếm, màu.",
      file: "src/games/timed-games/ChooseRight.html",
      templateNames: ["Bé Chọn Đúng", "Be chon dung", "ChooseRight", "chooseright"],
      settings: [
        { key: "totalQ", label: "Số câu mỗi lượt", type: "number", default: 8, min: 4, max: 16, step: 1 },
        { key: "easyQ", label: "Số câu đầu chỉ có 2 lựa chọn", type: "number", default: 4, min: 0, max: 8, step: 1, help: "Đặt 0 nếu muốn luôn có 3 lựa chọn." }
      ],
      lists: [
        {
          key: "animals", title: "🐶 Con vật", kind: "rows", itemType: "object", min: 3,
          help: "Emoji và tên (có “con”). Cần ít nhất 3.",
          fields: [
            { key: "e", placeholder: "🐶", cls: "em" },
            { key: "n", placeholder: "con chó", cls: "wide" }
          ],
          newItem: { e: "", n: "" },
          rows: [
            { e: "🐶", n: "con chó" },
            { e: "🐱", n: "con mèo" },
            { e: "🐔", n: "con gà" },
            { e: "🦆", n: "con vịt" },
            { e: "🐮", n: "con bò" },
            { e: "🐷", n: "con heo" },
            { e: "🐘", n: "con voi" },
            { e: "🐟", n: "con cá" },
            { e: "🐰", n: "con thỏ" },
            { e: "🐵", n: "con khỉ" },
            { e: "🐢", n: "con rùa" },
            { e: "🦁", n: "con sư tử" }
          ]
        },
        {
          key: "fruits", title: "🍎 Trái cây", kind: "rows", itemType: "object", min: 3,
          help: "Emoji và tên (có “quả”). Cần ít nhất 3.",
          fields: [
            { key: "e", placeholder: "🍎", cls: "em" },
            { key: "n", placeholder: "quả táo", cls: "wide" }
          ],
          newItem: { e: "", n: "" },
          rows: [
            { e: "🍎", n: "quả táo" },
            { e: "🍌", n: "quả chuối" },
            { e: "🍇", n: "chùm nho" },
            { e: "🍊", n: "quả cam" },
            { e: "🍉", n: "quả dưa hấu" },
            { e: "🍓", n: "quả dâu" },
            { e: "🍍", n: "quả dứa" },
            { e: "🥭", n: "quả xoài" }
          ]
        },
        {
          key: "colors", title: "🌈 Màu sắc", kind: "rows", itemType: "object", min: 3,
          help: "Tên màu và màu hiển thị. Cần ít nhất 3.",
          fields: [
            { key: "n", placeholder: "Tên màu", cls: "wide" },
            { key: "c", placeholder: "", type: "color", cls: "clr" }
          ],
          newItem: { n: "", c: "#FF5A5F" },
          rows: [
            { n: "đỏ", c: "#FF5A5F" },
            { n: "xanh dương", c: "#3B82F6" },
            { n: "xanh lá", c: "#22C55E" },
            { n: "vàng", c: "#FACC15" },
            { n: "cam", c: "#FB923C" },
            { n: "hồng", c: "#F472B6" },
            { n: "tím", c: "#A855F7" }
          ]
        },
        {
          key: "counters", title: "🔢 Hình để đếm", kind: "rows", itemType: "object", min: 1,
          help: "Emoji và tên vật (ví dụ “quả táo”).",
          fields: [
            { key: "e", placeholder: "🍎", cls: "em" },
            { key: "n", placeholder: "quả táo", cls: "wide" }
          ],
          newItem: { e: "", n: "" },
          rows: [
            { e: "🍎", n: "quả táo" },
            { e: "🐥", n: "chú gà con" },
            { e: "⭐", n: "ngôi sao" },
            { e: "🐟", n: "con cá" },
            { e: "🚗", n: "chiếc xe" },
            { e: "🌸", n: "bông hoa" },
            { e: "🎈", n: "quả bóng" }
          ]
        },
        {
          key: "praise", title: "🎉 Lời khen", kind: "rows", itemType: "string", min: 1,
          help: "Gấu nói trước tên vật, ví dụ “Giỏi quá! Đó là con mèo”.",
          fields: [{ placeholder: "Giỏi quá!", cls: "wide" }],
          newItem: "",
          rows: ["Giỏi quá!", "Đúng rồi!", "Tuyệt vời!", "Hoan hô!", "Bé thông minh quá!", "Siêu quá!"]
        },
        {
          key: "retry", title: "💪 Lời động viên", kind: "rows", itemType: "string", min: 1,
          help: "Gấu nói khi bé chọn sai.",
          fields: [{ placeholder: "Thử lại nhé!", cls: "wide" }],
          newItem: "",
          rows: ["Ồ, bé thử hình khác nhé!", "Gần đúng rồi, cố lên!", "Chưa phải rồi, thử lại nào!"]
        }
      ]
    },

    {
      key: "wordrush",
      name: "Word Rush",
      icon: "🦊",
      desc: "Chạy đua từ vựng tiếng Anh. Bạn tự thêm, sửa, xóa từ.",
      file: "src/games/timed-games/RushFox.html",
      templateNames: ["Word Rush", "word rush", "WordRush", "RushFox", "rushfox"],
      settings: [
        { key: "lives", label: "Số mạng (trái tim)", type: "number", default: 3, min: 1, max: 5, step: 1 },
        { key: "levelEvery", label: "Lên cấp sau mỗi … câu đúng", type: "number", default: 6, min: 3, max: 12, step: 1 },
        { key: "speed", label: "Tốc độ chạy", type: "number", default: 1, min: 0.5, max: 1.6, step: 0.1, format: "multiply", help: "Bé nhỏ nên để ×0.6–0.8." }
      ],
      lists: [
        {
          key: "words", title: "📚 Từ vựng theo chủ đề", kind: "grouped", min: 3,
          help: "Mỗi chủ đề là một danh sách riêng. Game tự gộp tất cả danh sách khi chơi.",
          groups: [
            { key: "fruit", title: "🍎 Trái cây", min: 3, open: true },
            { key: "animal", title: "🐘 Động vật", min: 3 },
            { key: "object", title: "🎒 Đồ vật", min: 3 }
          ],
          fields: [
            { key: "e", placeholder: "🍎", cls: "em" },
            { key: "en", placeholder: "English", cls: "wide" },
            { key: "vi", placeholder: "Nghĩa tiếng Việt", cls: "wide" }
          ],
          newItem: { e: "", en: "", vi: "" },
          rows: {
            fruit: [
              { e: "🍎", en: "apple", vi: "quả táo" },
              { e: "🍌", en: "banana", vi: "quả chuối" },
              { e: "🍇", en: "grape", vi: "quả nho" },
              { e: "🍓", en: "strawberry", vi: "dâu tây" },
              { e: "🍊", en: "orange", vi: "quả cam" },
              { e: "🍉", en: "watermelon", vi: "dưa hấu" },
              { e: "🍍", en: "pineapple", vi: "quả dứa" },
              { e: "🍒", en: "cherry", vi: "anh đào" },
              { e: "🥭", en: "mango", vi: "quả xoài" },
              { e: "🥥", en: "coconut", vi: "quả dừa" },
              { e: "🍋", en: "lemon", vi: "quả chanh" },
              { e: "🍑", en: "peach", vi: "quả đào" }
            ],
            animal: [
              { e: "🐶", en: "dog", vi: "con chó" },
              { e: "🐱", en: "cat", vi: "con mèo" },
              { e: "🐘", en: "elephant", vi: "con voi" },
              { e: "🦁", en: "lion", vi: "sư tử" },
              { e: "🐵", en: "monkey", vi: "con khỉ" },
              { e: "🐰", en: "rabbit", vi: "con thỏ" },
              { e: "🐟", en: "fish", vi: "con cá" },
              { e: "🐦", en: "bird", vi: "con chim" },
              { e: "🐮", en: "cow", vi: "con bò" },
              { e: "🐷", en: "pig", vi: "con lợn" },
              { e: "🐢", en: "turtle", vi: "con rùa" },
              { e: "🦒", en: "giraffe", vi: "hươu cao cổ" },
              { e: "🐯", en: "tiger", vi: "con hổ" },
              { e: "🐼", en: "panda", vi: "gấu trúc" }
            ],
            object: [
              { e: "📚", en: "book", vi: "quyển sách" },
              { e: "✏️", en: "pencil", vi: "bút chì" },
              { e: "🎒", en: "backpack", vi: "cái cặp" },
              { e: "⏰", en: "clock", vi: "đồng hồ" },
              { e: "🏠", en: "house", vi: "ngôi nhà" },
              { e: "🚗", en: "car", vi: "ô tô" },
              { e: "⚽", en: "ball", vi: "quả bóng" },
              { e: "🚲", en: "bicycle", vi: "xe đạp" },
              { e: "☂️", en: "umbrella", vi: "cái ô" },
              { e: "🌙", en: "moon", vi: "mặt trăng" },
              { e: "⭐", en: "star", vi: "ngôi sao" },
              { e: "🔑", en: "key", vi: "chìa khóa" },
              { e: "🎈", en: "balloon", vi: "bóng bay" },
              { e: "🎁", en: "gift", vi: "món quà" }
            ]
          }
        }
      ]
    }
  ];

  const clone = (value) => JSON.parse(JSON.stringify(value));

  function defaultsOfList(list) {
    if (list.kind === "grouped") {
      const out = {};
      (list.groups || []).forEach((g) => { out[g.key] = clone(list.rows?.[g.key] || []); });
      return out;
    }
    return clone(list.rows || []);
  }

  function defaultsOfGame(def) {
    const out = {};
    (def.settings || []).forEach((s) => { out[s.key] = s.default; });
    (def.lists || []).forEach((l) => { out[l.key] = defaultsOfList(l); });
    return out;
  }

  function buildConfig() {
    const cfg = {};
    GAME_DEFS.forEach((def) => { cfg[def.key] = defaultsOfGame(def); });
    return cfg;
  }

  root.EG_CONFIG_SCHEMA_VERSION = SCHEMA_VERSION;
  root.EG_GAMES = GAME_DEFS;
  root.EG_CONFIG = buildConfig();
  root.EG = root.EG_CONFIG;
})(typeof window !== "undefined" ? window : globalThis);