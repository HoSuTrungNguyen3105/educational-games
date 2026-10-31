// Danh mục game offline. Đây là nguồn sự thật cho trang Home và route /offline/:id.
//
// ID = tên file HTML (bỏ .html) trong src/games/offline/ — route /offline/<id>
// và key save `offline:<id>` đều suy ra từ đây, nên đổi id là đổi luôn đường dẫn
// cũ + dữ liệu đã lưu. Vì vậy id phải khớp CHÍNH XÁC tên file (kể cả chữ hoa).
//
// 17 game đầu (engine: 'single') sinh từ scripts/build-offline-games.mjs nên
// tên tiếng Việt nằm trong games-src/<id>.js; các game còn lại viết tay và
// giữ metadata ngay trong danh mục này — thêm/sửa tên là làm thủ công tại đây.
// Tên hiển thị dùng tiếng Anh; id giữ nguyên để link và dữ liệu đã lưu không đổi.

export const OFFLINE_GAME_MANIFEST = [
  // `thumbnail`: tên file ảnh nằm trong public/. Client tự ghép base URL
  // (xem src/lib/gameThumbnail.js) nên không hard-code /educational-games/.
  { id: 'math', name: 'Fruit Hunt', icon: '🍓', tag: 'Tính nhẩm', grad: 'from-orange-400 to-amber-500', engine: 'single', thumbnail: 'san-trai-cay.png', file: 'src/games/offline/math.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'memory', name: 'Memory Match', icon: '🃏', tag: 'Trí nhớ', grad: 'from-sky-400 to-blue-500', engine: 'single', thumbnail: 'ghep-cap-hinh.png', file: 'src/games/offline/memory.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'scramble', name: 'Treasure Hunt', icon: '🗺️', tag: 'Từ vựng', grad: 'from-rose-400 to-pink-500', engine: 'single', thumbnail: 'san-kho-bau.png', file: 'src/games/offline/scramble.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'quiz', name: 'Fun Quiz', icon: '🎉', tag: 'Giải trí', grad: 'from-violet-400 to-purple-600', engine: 'single', thumbnail: 'chon-mot-vui.png', file: 'src/games/offline/quiz.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'snake', name: 'Snake', icon: '🐍', tag: 'Arcade', grad: 'from-emerald-400 to-teal-600', engine: 'single', thumbnail: 'ran-san-moi.png', file: 'src/games/offline/snake.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'flap', name: 'Flap & Fly', icon: '🐦', tag: 'Arcade', grad: 'from-amber-400 to-orange-500', engine: 'single', thumbnail: 'chim-bay-tu-do.png', file: 'src/games/offline/flap.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'g2048', name: 'Fruit 2048', icon: '🍉', tag: 'Ghép ô', grad: 'from-violet-400 to-indigo-600', engine: 'single', thumbnail: 'vuon-trai-cay.png', file: 'src/games/offline/g2048.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'chem', name: 'Light Party', icon: '✨', tag: 'Trí nhớ', grad: 'from-lime-400 to-green-600', engine: 'single', thumbnail: 'tiec-anh-sang.png', file: 'src/games/offline/chem.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'clock', name: 'Rhythm Tap', icon: '🏁', tag: 'Phản xạ', grad: 'from-coral-400 to-rose-500', engine: 'single', thumbnail: 'cham-dung-nhip.png', file: 'src/games/offline/clock.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'pattern', name: 'Pattern Finder', icon: '⭐', tag: 'Logic', grad: 'from-sky-400 to-cyan-600', engine: 'single', file: 'src/games/offline/pattern.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'simon', name: 'Color Melody', icon: '🎵', tag: 'Ghi nhớ', grad: 'from-pink-400 to-fuchsia-500', engine: 'single', file: 'src/games/offline/simon.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'anagram', name: 'Word Maze', icon: '🧩', tag: 'Từ vựng', grad: 'from-amber-400 to-yellow-500', engine: 'single', file: 'src/games/offline/anagram.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'stroop', name: 'Color Rush', icon: '🎨', tag: 'Phản xạ', grad: 'from-violet-400 to-purple-500', engine: 'single', file: 'src/games/offline/stroop.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'sumseq', name: 'Number Sequence', icon: '🔢', tag: 'Logic', grad: 'from-sky-400 to-blue-500', engine: 'single', file: 'src/games/offline/sumseq.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'compare', name: 'Rock Paper Scissors', icon: '✊', tag: 'Giải trí', grad: 'from-lime-400 to-emerald-500', engine: 'single', file: 'src/games/offline/compare.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'riddle', name: 'Green Light Reflex', icon: '🚦', tag: 'Phản xạ', grad: 'from-coral-400 to-orange-500', engine: 'single', thumbnail: 'phan-xa-den-xanh.png', file: 'src/games/offline/riddle.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'shapecount', name: 'Shape Catcher', icon: '🎯', tag: 'Quan sát', grad: 'from-pink-400 to-rose-500', engine: 'single', thumbnail: 'bat-vat-the.png', file: 'src/games/offline/shapecount.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'plantvsanimal', name: 'Garden Guardians', icon: '🌻', tag: 'Chiến thuật', grad: 'from-green-400 to-lime-600', engine: 'standalone', thumbnail: 'vuon-thu-ho.png', file: 'src/games/offline/plantvsanimal.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'chem-trai-cay', name: 'Fruit Slash', icon: '🍉', tag: 'Phản xạ', grad: 'from-red-400 to-rose-600', engine: 'standalone', thumbnail: 'chem-trai-cay.png', file: 'src/games/offline/chem-trai-cay.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'hu-trai-cay', name: 'Fruit Jar', icon: '🫙', tag: 'Vui vẻ', grad: 'from-amber-400 to-orange-500', engine: 'standalone', thumbnail: 'hu-trai-cay.png', file: 'src/games/offline/hu-trai-cay.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'xep-khoi', name: 'Color Blocks', icon: '🧊', tag: 'Logic', grad: 'from-cyan-400 to-sky-500', engine: 'standalone', thumbnail: 'xep-khoi-mau.png', file: 'src/games/offline/xep-khoi.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'pha-gach', name: 'Neon Brick Breaker', icon: '🧱', tag: 'Giải trí', grad: 'from-fuchsia-400 to-purple-600', engine: 'standalone', thumbnail: 'pha-gach-neon.png', file: 'src/games/offline/pha-gach.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'nhay-xoay', name: 'Spin Jump', icon: '🌀', tag: 'Game 3D', grad: 'from-indigo-400 to-blue-600', engine: 'standalone', thumbnail: 'nhay-xoay.png', file: 'src/games/offline/nhay-xoay.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'goc-thu-gian', name: 'Relax Corner', icon: '🧘', tag: 'Thư giãn', grad: 'from-teal-400 to-emerald-600', engine: 'standalone', thumbnail: 'goc-thu-gian.png', file: 'src/games/offline/goc-thu-gian.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'night-strike', name: 'Night Strike', icon: '🧟', tag: 'Phản xạ', grad: 'from-red-400 to-rose-600', engine: 'standalone', thumbnail: 'san-zombie.png', file: 'src/games/offline/night-strike.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  { id: 'dap-sau-bo', name: 'Bug Smash', icon: '🪲', tag: 'Đập côn trùng', grad: 'from-teal-400 to-emerald-600', engine: 'standalone', thumbnail: 'dap-sau-bo.png', file: 'src/games/offline/dap-sau-bo.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'ghep-cap-vuon', name: 'Garden Pairs', icon: '🧩', tag: 'Ghép đôi', grad: 'from-pink-400 to-rose-500', engine: 'standalone', thumbnail: 'ghep-cap-vuon.png', file: 'src/games/offline/ghep-cap-vuon.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'sau-an-la', name: 'Apple Worm', icon: '🐛', tag: 'Bảo vệ vườn', grad: 'from-indigo-400 to-blue-600', engine: 'standalone', file: 'src/games/offline/sau-an-la.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'nong-trai-moi', name: 'Happy Farm', icon: '🚜', tag: 'Mô phỏng', grad: 'from-green-400 to-lime-500', engine: 'standalone', thumbnail: 'nong-trai-nang-cap.png', file: 'src/games/offline/nong-trai-moi.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'fieldrunner', name: 'Field Defender', icon: '🌾', tag: 'Chiến thuật', grad: 'from-lime-400 to-green-600', engine: 'standalone', file: 'src/games/offline/fieldrunner.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'cargo', name: 'Cargo Market', icon: '🚚', tag: 'Phiêu lưu', grad: 'from-amber-400 to-orange-500', engine: 'standalone', file: 'src/games/offline/cargo.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'bang-tinh', name: 'Kids Spreadsheet', icon: '📊', tag: 'Học tập', grad: 'from-emerald-400 to-green-600', engine: 'standalone', file: 'src/games/offline/bang-tinh.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'vung-dat-gio', name: 'Windland', icon: '🍃', tag: 'Thế giới mở', grad: 'from-teal-400 to-sky-600', engine: 'standalone', file: 'src/games/offline/vung-dat-gio.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'coi-phong-linh', name: 'Spirit Realm', icon: '🗡️', tag: 'Thế giới mở', grad: 'from-indigo-400 to-violet-600', engine: 'standalone', file: 'src/games/offline/coi-phong-linh.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/parkour-tri-thuc-3d/ParkourTriThuc3D.html — chạy `npm run games:build:parkour-fps` để cập nhật.
  { id: 'parkour-tri-thuc-3d', name: 'First-Person Parkour', icon: '🏃', tag: 'Parkour 3D', grad: 'from-cyan-400 to-blue-600', engine: 'standalone', file: 'src/games/offline/parkour-tri-thuc-3d.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/me-cung-thi.html — chạy `npm run games:build:parkour-offline` để cập nhật.
  { id: 'me-cung-tri-thuc', name: 'Knowledge Maze', icon: '🏰', tag: 'Mê cung', grad: 'from-amber-400 to-yellow-500', engine: 'standalone', file: 'src/games/offline/me-cung-tri-thuc.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/thap-may.html (three.js qua CDN, giống nhay-xoay).
  { id: 'leo-thap-may', name: 'Cloud Tower Climb', icon: '☁️', tag: 'Leo tháp 3D', grad: 'from-sky-400 to-cyan-600', engine: 'standalone', file: 'src/games/offline/leo-thap-may.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/mecung-moi.html — mê cung đi tìm cổng câu hỏi, có hồ sơ
  // riêng cho từng bạn + bảng xếp hạng. Trong game vẫn ghi tiêu đề "Mê Cung Tri Thức"
  // nhưng để không trùng ô với me-cung-tri-thuc (bản có chiến đấu) nên đặt tên theo lối chơi.
  { id: 'me-cung-kham-pha', name: 'Discovery Maze', icon: '🌀', tag: 'Mê cung 3D', grad: 'from-indigo-400 to-violet-600', engine: 'standalone', file: 'src/games/offline/me-cung-kham-pha.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  // Các game HTML có sẵn trong src/games/offline/ nhưng trước đây chưa khai báo.
  { id: 'FindNumber', name: 'Find the Number', icon: '🔍', tag: 'Logic', grad: 'from-sky-400 to-blue-500', engine: 'standalone', file: 'src/games/offline/FindNumber.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'Labyrinth', name: 'Labyrinth', icon: '🌀', tag: 'Mê cung', grad: 'from-indigo-400 to-violet-600', engine: 'standalone', file: 'src/games/offline/Labyrinth.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'MergeBlast', name: 'Merge & Blast', icon: '💥', tag: 'Ghép ô', grad: 'from-amber-400 to-orange-500', engine: 'standalone', file: 'src/games/offline/MergeBlast.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'TempleRun2D', name: 'Temple Run 2D', icon: '🏃', tag: 'Chạy né', grad: 'from-cyan-400 to-blue-600', engine: 'standalone', file: 'src/games/offline/TempleRun2D.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'parkour-tri-thuc', name: 'Parkour 3D Pro', icon: '🧱', tag: 'Parkour 3D', grad: 'from-cyan-400 to-indigo-600', engine: 'standalone', file: 'src/games/offline/parkour-tri-thuc.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  // School_mission KHÔNG thuộc offline — xem route /school-mission và src/games/school_mission/
];

export const offlineGameIds = OFFLINE_GAME_MANIFEST.map((g) => g.id);

/**
 * id cũ → id hiện tại. Ba game viết tay đặt tên theo file gốc (ViếtHoa/KhôngDấu)
 * đã đổi thành id kebab-case; alias giữ cho link /offline/<id-cũ> còn mở được.
 * Save cũ không mất gì vì cả ba file trước đây đều không ghi localStorage.
 */
export const OFFLINE_GAME_ALIASES = {
  COIPhongLinh: 'coi-phong-linh',
  GenshinUIReplica: 'vung-dat-gio',
  Excel: 'bang-tinh',
};

export function resolveOfflineId(id) {
  return OFFLINE_GAME_ALIASES[id] || id;
}

export function findOfflineGame(id) {
  return OFFLINE_GAME_MANIFEST.find((g) => g.id === id) || null;
}

/** Bảng màu rèm dùng khi tự dựng metadata cho game mới. */
const FALLBACK_GRADS = [
  'from-red-400 to-rose-600', 'from-amber-400 to-orange-500', 'from-emerald-400 to-green-600',
  'from-sky-400 to-blue-500', 'from-violet-400 to-purple-600', 'from-teal-400 to-emerald-600',
  'from-pink-400 to-rose-500', 'from-indigo-400 to-blue-600',
];

/**
 * Giải mã entity HTML cơ bản.
 * <title> trong file game hay chứa "&amp;" "&mdash;" "&nbsp;"…
 * Không giải mã thì tên hiển thị lên UI sẽ lộ nguyên entity.
 */
function decodeEntities(s) {
  return String(s)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&mdash;|&ndash;/gi, "–")
    .replace(/&hellip;/gi, "…")
    .replace(/&times;/gi, "×")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

/** "night-strike" → "Night Strike" */
function titleCase(id) {
  return String(id)
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Tự dựng metadata cho game mới chưa có trong manifest.
 *
 * Vì vậy copy file .html vào src/games/offline/ là chơi được ngay, không cần
 * sửa code. Muốn tên/emoji/màu đẹp thì chạy `npm run games:sync` để đưa nó
 * vào manifest, hoặc tự thêm dòng vào OFFLINE_GAME_MANIFEST.
 *
 * @param {string} id   id game (tên file không đuôi)
 * @param {string} html nội dung file, dùng để lấy <title>
 */
export function makeFallbackMeta(id, html = '') {
  const rawTitle = decodeEntities(String(html).match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
  const title = rawTitle && rawTitle.length > 1 ? rawTitle : titleCase(id);
  // Lấy emoji đầu tiên trong title, nếu có
  const icon = title.match(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u)?.[0] || '🎮';
  const name = title.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim() || titleCase(id);
  const idx = Math.abs(hash(id)) % FALLBACK_GRADS.length;
  return {
    id,
    name,
    icon,
    tag: 'Offline',
    grad: FALLBACK_GRADS[idx],
    engine: 'single',
    file: `src/games/offline/${id}.html`,
    type: 'play-to-learn',
    playMode: 'offline',
    version: 1,
  };
}

/** Hash chuỗi → số nguyên, dùng để chọn màu ổn định theo id. */
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}
