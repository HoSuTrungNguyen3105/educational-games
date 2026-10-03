(function (root) {
  "use strict";

  const SCHEMA_VERSION = 2;

  const GAME_DEFS = [
    // ── Học Mà Chơi (bản bridge) ───────────────────────────────────────
    // gameMode = "custom": game KHÔNG dùng collection `questions`, mọi nội
    // dung đến từ JSON config dưới đây (gồm cả câu hỏi của "Đố Vui").
    // Mở #/admin/game-config để sửa, hoặc #/admin/create để gán vào game.
    {
      key: "hocmachoi",
      name: "Học Mà Chơi",
      icon: "🎪",
      desc: "5 mini-game: Đua Toán, Lật Thẻ, Xếp Chữ, Đố Vui, Chọn Nhanh. Nội dung lấy từ JSON cấu hình.",
      file: "src/games/hocmachoi-bridge.html",
      templateNames: ["Học Mà Chơi", "Hoc Ma Choi", "hocmachoi", "hoc-ma-choi", "game1"],
      settings: [
        { key: "totalQ", label: "Số câu mỗi màn", type: "number", default: 10, min: 3, max: 30, step: 1 },
        { key: "timeLimit", label: "Thời gian mỗi câu (giây)", type: "number", default: 20, min: 5, max: 60, step: 1, format: "seconds" },
        { key: "lives", label: "Số mạng", type: "number", default: 3, min: 1, max: 5, step: 1 },
        { key: "levelStep", label: "Đúng N câu thì lên màn", type: "number", default: 3, min: 1, max: 10, step: 1, help: "Cũng là số câu đúng cần để vượt màn hiện tại. Đủ số này thì mức chơi tăng 1 và được lưu lên server." },
        { key: "mathMax", label: "Số lớn nhất (Đua Toán)", type: "number", default: 20, min: 5, max: 99, step: 1 }
      ],
      lists: [
        {
          key: "quiz", title: "🔬 Câu hỏi Đố Vui (JSON)", kind: "json", requiredType: "array", min: 1,
          help: 'Mỗi câu: { q, a: ["đáp án A", ...], c: chỉ số đáp án đúng, why }. Đây là nguồn câu hỏi DUY NHẤT — game không đọc collection `questions`.',
          rows: [
            { q: "Mặt Trời là ngôi sao nào?", a: ["Sao Thủy", "Sao Mặt Trời", "Sao Sao"], c: 1, why: "Mặt Trời là một ngôi sao vàng." },
            { q: "Nước sôi ở 100°C ở điều kiện khí quyển.", a: ["Đúng", "Sai"], c: 0, why: "Ở mực nước biển nước sôi ở 100°C." },
            { q: "Hành tinh lớn nhất hệ Mặt Trời?", a: ["Trái Đất", "Sao Thổ", "Sao Mộc"], c: 2, why: "Sao Mộc là hành tích lớn nhất." }
          ]
        },
        {
          key: "words", title: "📚 Từ vựng (Lật Thẻ + Xếp Chữ)", kind: "rows", itemType: "object", min: 2,
          help: "Mỗi dòng: { e: emoji, en: tiếng Anh, vi: nghĩa tiếng Việt }.",
          fields: [
            { key: "e", placeholder: "🍎", cls: "em" },
            { key: "en", placeholder: "apple", cls: "wide" },
            { key: "vi", placeholder: "quả táo", cls: "wide" }
          ],
          newItem: { e: "", en: "", vi: "" },
          rows: [
            { e: "🍎", en: "apple", vi: "quả táo" },
            { e: "🐶", en: "dog", vi: "con chó" },
            { e: "📚", en: "book", vi: "quyển sách" },
            { e: "☀️", en: "sun", vi: "mặt trời" },
            { e: "🎒", en: "bag", vi: "cái cặp" },
            { e: "🚗", en: "car", vi: "ô tô" },
            { e: "🌸", en: "flower", vi: "bông hoa" },
            { e: "🎵", en: "song", vi: "bài hát" }
          ]
        },
        {
          key: "praise", title: "🎉 Lời khen", kind: "rows", itemType: "string", min: 1,
          help: "Thông điệp khi bé làm đúng.", newItem: "", rows: ["Giỏi quá!", "Tuyệt vời!", "Chuẩn luôn!", "Bé thông minh quá!"] },
        {
          key: "retry", title: "💪 Lời động viên", kind: "rows", itemType: "string", min: 1,
          help: "Thông điệp khi bé làm sai.", newItem: "", rows: ["Thử lại nhé!", "Gần đúng rồi, cố lên!", "Ổ, thử cái khác nào!"] },
        {
          key: "mathOps", title: "➕ Phép tính (Đua Toán)", kind: "rows", itemType: "string", min: 1,
          help: "Nhập đúng ký hiệu: +   −   ×",
          newItem: "", rows: ["+", "−", "×"] },
      ]
    },

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
    },

    // ── Vườn Thủ Hộ (plantvsanimal) ────────────────────────────────
    // Icon KHÔNG nằm trong config: file plantvsanimal.html tự gắn icon theo id
    // (MON_ICON / PLANT_ICON). Config chỉ chứa id + số liệu chơi.
    {
      key: "plantvsanimal",
      name: "Vườn Thủ Hộ",
      icon: "🌻",
      desc: "Trồng cây, thu nắng, đuổi sâu bọ. Chỉnh quái, cây và các màn chơi.",
      file: "src/games/plantvsanimal.html",
      templateNames: ["Vườn Thủ Hộ", "Vuon Thu Ho", "plantvsanimal", "plant and animal", "PlantVsAnimal"],
      settings: [
        { key: "unlockAll", label: "Mở khoá sẵn tất cả màn", type: "toggle", default: true, help: "Tắt để học sinh phải thắng màn trước mới mở màn sau." }
      ],
      lists: [
        {
          key: "monsters", title: "🐛 Quái", kind: "entities", min: 1,
          idLabel: "id", idHint: "chữ không dấu, ví dụ: worm, boss",
          help: "id là khoá để màn chơi gọi tới — HTML tự gắn icon theo id, nên đổi id là game không nhận ra.",
          fields: [
            { key: "name", label: "Tên", type: "text", cls: "wide" },
            { key: "hp", label: "Máu", type: "number", min: 1 },
            { key: "speed", label: "Tốc độ", type: "number", min: 0.01, step: 0.01, help: "ô/giây" },
            { key: "dps", label: "Sát thương/giây", type: "number", min: 0 },
            { key: "size", label: "Cỡ", type: "number", min: 0.2, step: 0.05, optional: true, advanced: true },
            { key: "jump", label: "Nhảy", type: "toggle", optional: true, advanced: true }
          ],
          rows: {
            worm: { name: "Sâu Bò", hp: 100, speed: 0.2, dps: 20, size: 1 },
            beetle: { name: "Bọ Giáp", hp: 260, speed: 0.17, dps: 22, size: 1.05 },
            locust: { name: "Châu Chấu", hp: 90, speed: 0.42, dps: 16, size: 0.95 },
            rat: { name: "Chuột Nhảy", hp: 150, speed: 0.3, dps: 20, size: 1, jump: true },
            snail: { name: "Ốc Sên Khiên", hp: 520, speed: 0.09, dps: 25, size: 1.1 },
            boss: { name: "Bọ Cạp Chúa", hp: 3200, speed: 0.06, dps: 80, size: 1.7 }
          }
        },
        {
          key: "plants", title: "🌱 Cây", kind: "entities", min: 1,
          idLabel: "id", idHint: "chữ không dấu, ví dụ: sunflower, chili",
          help: "Các thuộc tính không nhập sẽ lấy theo “kind” (HTML có sẵn bảng mặc định).",
          fields: [
            { key: "name", label: "Tên", type: "text", cls: "wide" },
            {
              key: "kind", label: "Loại", type: "select",
              options: [
                { value: "producer", label: "producer · thu nắng" },
                { value: "shooter", label: "shooter · bắn" },
                { value: "wall", label: "wall · chắn" },
                { value: "bomb", label: "bomb · nổ" },
                { value: "lane", label: "lane · dọc hàng" },
                { value: "mine", label: "mine · bẫy" }
              ]
            },
            { key: "cost", label: "Giá", type: "number", min: 0 },
            { key: "hp", label: "Máu", type: "number", min: 1 },
            { key: "cooldown", label: "Hồi (giây)", type: "number", min: 0.5, step: 0.5, optional: true, advanced: true },
            { key: "damage", label: "Sát thương", type: "number", min: 0, optional: true, advanced: true },
            { key: "every", label: "Mỗi (giây)", type: "number", min: 0, step: 0.1, optional: true, advanced: true },
            { key: "shots", label: "Số phát", type: "number", min: 1, optional: true, advanced: true },
            { key: "amount", label: "Lượng thu", type: "number", min: 1, optional: true, advanced: true },
            { key: "first", label: "Chờ đầu (giây)", type: "number", min: 0, optional: true, advanced: true },
            { key: "slow", label: "Làm chậm", type: "number", min: 0, step: 0.05, optional: true, advanced: true },
            { key: "slowTime", label: "Thời gian chậm", type: "number", min: 0, optional: true, advanced: true },
            { key: "radius", label: "Bán kính nổ", type: "number", min: 0, step: 0.1, optional: true, advanced: true },
            { key: "fuse", label: "Độ trễ nổ (giây)", type: "number", min: 0, step: 0.1, optional: true, advanced: true },
            { key: "arm", label: "Thời gian vô hiệu (giây)", type: "number", min: 0, optional: true, advanced: true }
          ],
          rows: {
            sunflower: { name: "Hướng Dương", kind: "producer", cost: 50, hp: 80, cooldown: 5, amount: 25, every: 9, first: 5 },
            shooter: { name: "Súp Lơ Bắn Hạt", kind: "shooter", cost: 100, hp: 80, cooldown: 5, damage: 20, every: 1.5, shots: 1 },
            wall: { name: "Dừa Tường", kind: "wall", cost: 50, hp: 600, cooldown: 14 },
            bomb: { name: "Anh Đào Nổ", kind: "bomb", cost: 150, hp: 50, cooldown: 25, damage: 400, radius: 1.5, fuse: 1 },
            ice: { name: "Việt Quất Băng", kind: "shooter", cost: 175, hp: 80, cooldown: 6, damage: 20, every: 1.5, shots: 1, slow: 0.5, slowTime: 4 },
            mine: { name: "Khoai Bẫy", kind: "mine", cost: 25, hp: 50, cooldown: 18, damage: 500, arm: 8 },
            repeater: { name: "Xương Rồng Đôi", kind: "shooter", cost: 200, hp: 80, cooldown: 7, damage: 20, every: 1.5, shots: 2 },
            chili: { name: "Ớt Lửa", kind: "lane", cost: 125, hp: 50, cooldown: 25, damage: 400, fuse: 0.8 }
          }
        },
        {
          key: "levels", title: "🗺️ Màn chơi (timeline)", kind: "json", requiredType: "array", min: 1,
          help: "Mỗi màn: { name, theme: day|dusk|night, rows, startSun, plants:[id], skySun, timeline:[...] }. Ô “timeline” là danh sách sự kiện theo giây — xem hướng dẫn trong game (nút ⚙️ Cấu hình JSON).",
          rows: [
            {
              name: "Vườn Trước Nhà", theme: "day", rows: 5, startSun: 150,
              plants: ["sunflower", "shooter"],
              skySun: { first: 6, every: 9, amount: 25 },
              timeline: [
                { t: 20, monster: "worm", row: "random" },
                { t: 40, monster: "worm", row: "random" },
                { t: 58, monster: "worm", row: "random", count: 2, gap: 5 },
                {
                  t: 85, banner: "Một đợt quái lớn đang kéo tới!", flag: true,
                  spawn: [
                    { monster: "worm", row: "all" },
                    { monster: "worm", row: "random", count: 3, gap: 3, delay: 4 }
                  ]
                }
              ]
            },
            {
              name: "Vườn Sau Nhà", theme: "day", rows: 5, startSun: 150,
              plants: ["sunflower", "shooter", "wall", "bomb"],
              skySun: { first: 6, every: 9, amount: 25 },
              timeline: [
                { t: 15, monster: "worm", row: "random" },
                { t: 28, monster: "worm", row: "random", count: 2, gap: 4 },
                { t: 45, monster: "beetle", row: "random" },
                { t: 62, monster: "worm", row: "random", count: 3, gap: 3 },
                { t: 80, monster: "beetle", row: "random", count: 2, gap: 6 },
                {
                  t: 100, banner: "Một đợt quái lớn đang kéo tới!", flag: true,
                  spawn: [
                    { monster: "beetle", row: "all" },
                    { monster: "worm", row: "random", count: 4, gap: 2.5, delay: 3 }
                  ]
                }
              ]
            },
            {
              name: "Hoàng Hôn Bên Hàng Rào", theme: "dusk", rows: 5, startSun: 200,
              plants: ["sunflower", "shooter", "wall", "bomb", "ice", "mine"],
              skySun: { first: 8, every: 11, amount: 25 },
              timeline: [
                { t: 12, monster: "worm", row: "random" },
                { t: 22, monster: "locust", row: "random" },
                { t: 34, monster: "rat", row: "random" },
                { t: 46, monster: "worm", row: "random", count: 2, gap: 3 },
                { t: 60, monster: "locust", row: "random", count: 3, gap: 2 },
                { t: 76, monster: "beetle", row: "random", count: 2, gap: 5 },
                {
                  t: 92, banner: "Một đợt quái lớn đang kéo tới!", flag: true,
                  spawn: [
                    { monster: "rat", row: "all" },
                    { monster: "locust", row: "random", count: 4, gap: 1.5, delay: 3 },
                    { monster: "beetle", row: "random", count: 2, gap: 6, delay: 5 }
                  ]
                }
              ]
            },
            {
              name: "Đêm Sương Mù", theme: "night", rows: 5, startSun: 250,
              plants: ["sunflower", "shooter", "wall", "bomb", "ice", "mine", "repeater", "chili"],
              skySun: { first: 0, every: 0, amount: 25 },
              timeline: [
                { t: 20, monster: "worm", row: "random", count: 2, gap: 3 },
                { t: 35, monster: "snail", row: "random" },
                { t: 55, monster: "rat", row: "random", count: 2, gap: 4 },
                { t: 75, monster: "beetle", row: "random", count: 2, gap: 3 },
                {
                  t: 95, banner: "Quái đang kéo đến từ trong sương!", flag: true,
                  spawn: [
                    { monster: "snail", row: "random", count: 2, gap: 8 },
                    { monster: "locust", row: "all", delay: 2 }
                  ]
                },
                {
                  t: 125, banner: "Đợt cuối! Giữ vững hàng phòng thủ!", flag: true,
                  spawn: [
                    { monster: "worm", row: "all", count: 2, gap: 6 },
                    { monster: "beetle", row: "random", count: 4, gap: 3, delay: 3 },
                    { monster: "snail", row: "random", count: 2, gap: 10, delay: 5 }
                  ]
                }
              ]
            },
            {
              name: "Bọ Cạp Chúa", theme: "dusk", rows: 5, startSun: 300,
              plants: ["sunflower", "shooter", "wall", "bomb", "ice", "mine", "repeater", "chili"],
              skySun: { first: 8, every: 10, amount: 25 },
              timeline: [
                { t: 15, monster: "worm", row: "random", count: 3, gap: 3 },
                { t: 35, monster: "beetle", row: "random", count: 2, gap: 4 },
                { t: 55, monster: "rat", row: "random", count: 3, gap: 3 },
                {
                  t: 80, banner: "Một đợt quái lớn đang kéo tới!", flag: true,
                  spawn: [
                    { monster: "locust", row: "all", count: 2, gap: 4 },
                    { monster: "snail", row: "random", count: 2, gap: 6, delay: 4 }
                  ]
                },
                {
                  t: 115, banner: "BỌ CẠP CHÚA XUẤT HIỆN!", flag: true,
                  spawn: [
                    { monster: "boss", row: 3 },
                    { monster: "beetle", row: "all", delay: 6 },
                    { monster: "worm", row: "random", count: 6, gap: 2, delay: 10 }
                  ]
                }
              ]
            }
          ]
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