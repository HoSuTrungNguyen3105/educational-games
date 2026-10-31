// Danh mục game offline. Đây là nguồn sự thật cho trang Home và route /offline/:id.
//
// ID = tên file HTML (bỏ .html) trong src/games/offline/ — route /offline/<id>
// và key save `offline:<id>` đều suy ra từ đây. Id và tên hiển thị dùng tiếng
// Anh, viết thường; OFFLINE_GAME_ALIASES giữ link cũ mở được sau khi đổi tên.
//
// 17 game đầu (engine: 'single') sinh từ scripts/build-offline-games.mjs nên
// nội dung nằm trong games-src/<id>.js; các game còn lại viết tay và giữ
// metadata ngay trong danh mục này — thêm/sửa tên là làm thủ công tại đây.

export const OFFLINE_GAME_MANIFEST = [
  // `thumbnail`: tên file ảnh nằm trong public/. Client tự ghép base URL
  // (xem src/lib/gameThumbnail.js) nên không hard-code /educational-games/.
  { id: 'math', name: 'fruit hunt', icon: '🍓', tag: 'Tính nhẩm', grad: 'from-orange-400 to-amber-500', engine: 'single', thumbnail: 'san-trai-cay.png', file: 'src/games/offline/math.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'memory', name: 'memory match', icon: '🃏', tag: 'Trí nhớ', grad: 'from-sky-400 to-blue-500', engine: 'single', thumbnail: 'ghep-cap-hinh.png', file: 'src/games/offline/memory.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'scramble', name: 'treasure hunt', icon: '🗺️', tag: 'Từ vựng', grad: 'from-rose-400 to-pink-500', engine: 'single', thumbnail: 'san-kho-bau.png', file: 'src/games/offline/scramble.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'quiz', name: 'fun quiz', icon: '🎉', tag: 'Giải trí', grad: 'from-violet-400 to-purple-600', engine: 'single', thumbnail: 'chon-mot-vui.png', file: 'src/games/offline/quiz.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'snake', name: 'snake', icon: '🐍', tag: 'Arcade', grad: 'from-emerald-400 to-teal-600', engine: 'single', thumbnail: 'ran-san-moi.png', file: 'src/games/offline/snake.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'flap', name: 'flap & fly', icon: '🐦', tag: 'Arcade', grad: 'from-amber-400 to-orange-500', engine: 'single', thumbnail: 'chim-bay-tu-do.png', file: 'src/games/offline/flap.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'g2048', name: 'fruit 2048', icon: '🍉', tag: 'Ghép ô', grad: 'from-violet-400 to-indigo-600', engine: 'single', thumbnail: 'vuon-trai-cay.png', file: 'src/games/offline/g2048.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'chem', name: 'light party', icon: '✨', tag: 'Trí nhớ', grad: 'from-lime-400 to-green-600', engine: 'single', thumbnail: 'tiec-anh-sang.png', file: 'src/games/offline/chem.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'clock', name: 'rhythm tap', icon: '🏁', tag: 'Phản xạ', grad: 'from-coral-400 to-rose-500', engine: 'single', thumbnail: 'cham-dung-nhip.png', file: 'src/games/offline/clock.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'pattern', name: 'pattern finder', icon: '⭐', tag: 'Logic', grad: 'from-sky-400 to-cyan-600', engine: 'single', file: 'src/games/offline/pattern.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'simon', name: 'color melody', icon: '🎵', tag: 'Ghi nhớ', grad: 'from-pink-400 to-fuchsia-500', engine: 'single', file: 'src/games/offline/simon.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'anagram', name: 'word maze', icon: '🧩', tag: 'Từ vựng', grad: 'from-amber-400 to-yellow-500', engine: 'single', file: 'src/games/offline/anagram.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'stroop', name: 'color rush', icon: '🎨', tag: 'Phản xạ', grad: 'from-violet-400 to-purple-500', engine: 'single', file: 'src/games/offline/stroop.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'sumseq', name: 'number sequence', icon: '🔢', tag: 'Logic', grad: 'from-sky-400 to-blue-500', engine: 'single', file: 'src/games/offline/sumseq.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'compare', name: 'rock paper scissors', icon: '✊', tag: 'Giải trí', grad: 'from-lime-400 to-emerald-500', engine: 'single', file: 'src/games/offline/compare.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'riddle', name: 'green light reflex', icon: '🚦', tag: 'Phản xạ', grad: 'from-coral-400 to-orange-500', engine: 'single', thumbnail: 'phan-xa-den-xanh.png', file: 'src/games/offline/riddle.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'shapecount', name: 'shape catcher', icon: '🎯', tag: 'Quan sát', grad: 'from-pink-400 to-rose-500', engine: 'single', thumbnail: 'bat-vat-the.png', file: 'src/games/offline/shapecount.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'plantvsanimal', name: 'garden guardians', icon: '🌻', tag: 'Chiến thuật', grad: 'from-green-400 to-lime-600', engine: 'standalone', thumbnail: 'vuon-thu-ho.png', file: 'src/games/offline/plantvsanimal.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'fruit-slash', name: 'fruit slash', icon: '🍉', tag: 'Phản xạ', grad: 'from-red-400 to-rose-600', engine: 'standalone', thumbnail: 'chem-trai-cay.png', file: 'src/games/offline/fruit-slash.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'fruit-jar', name: 'fruit jar', icon: '🫙', tag: 'Vui vẻ', grad: 'from-amber-400 to-orange-500', engine: 'standalone', thumbnail: 'hu-trai-cay.png', file: 'src/games/offline/fruit-jar.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'color-blocks', name: 'color blocks', icon: '🧊', tag: 'Logic', grad: 'from-cyan-400 to-sky-500', engine: 'standalone', thumbnail: 'xep-khoi-mau.png', file: 'src/games/offline/color-blocks.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'neon-brick-breaker', name: 'neon brick breaker', icon: '🧱', tag: 'Giải trí', grad: 'from-fuchsia-400 to-purple-600', engine: 'standalone', thumbnail: 'pha-gach-neon.png', file: 'src/games/offline/neon-brick-breaker.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'spin-jump', name: 'spin jump', icon: '🌀', tag: 'Game 3D', grad: 'from-indigo-400 to-blue-600', engine: 'standalone', thumbnail: 'nhay-xoay.png', file: 'src/games/offline/spin-jump.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'relax-corner', name: 'relax corner', icon: '🧘', tag: 'Thư giãn', grad: 'from-teal-400 to-emerald-600', engine: 'standalone', thumbnail: 'goc-thu-gian.png', file: 'src/games/offline/relax-corner.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'night-strike', name: 'night strike', icon: '🧟', tag: 'Phản xạ', grad: 'from-red-400 to-rose-600', engine: 'standalone', thumbnail: 'san-zombie.png', file: 'src/games/offline/night-strike.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  { id: 'bug-smash', name: 'bug smash', icon: '🪲', tag: 'Đập côn trùng', grad: 'from-teal-400 to-emerald-600', engine: 'standalone', thumbnail: 'dap-sau-bo.png', file: 'src/games/offline/bug-smash.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'garden-pairs', name: 'garden pairs', icon: '🧩', tag: 'Ghép đôi', grad: 'from-pink-400 to-rose-500', engine: 'standalone', thumbnail: 'ghep-cap-vuon.png', file: 'src/games/offline/garden-pairs.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'apple-worm', name: 'apple worm', icon: '🐛', tag: 'Bảo vệ vườn', grad: 'from-indigo-400 to-blue-600', engine: 'standalone', file: 'src/games/offline/apple-worm.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'happy-farm', name: 'happy farm', icon: '🚜', tag: 'Mô phỏng', grad: 'from-green-400 to-lime-500', engine: 'standalone', thumbnail: 'nong-trai-nang-cap.png', file: 'src/games/offline/happy-farm.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'fieldrunner', name: 'field defender', icon: '🌾', tag: 'Chiến thuật', grad: 'from-lime-400 to-green-600', engine: 'standalone', file: 'src/games/offline/fieldrunner.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'cargo', name: 'cargo market', icon: '🚚', tag: 'Phiêu lưu', grad: 'from-amber-400 to-orange-500', engine: 'standalone', file: 'src/games/offline/cargo.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'kids-spreadsheet', name: 'kids spreadsheet', icon: '📊', tag: 'Học tập', grad: 'from-emerald-400 to-green-600', engine: 'standalone', file: 'src/games/offline/kids-spreadsheet.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'windland', name: 'windland', icon: '🍃', tag: 'Thế giới mở', grad: 'from-teal-400 to-sky-600', engine: 'standalone', file: 'src/games/offline/windland.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'spirit-realm', name: 'spirit realm', icon: '🗡️', tag: 'Thế giới mở', grad: 'from-indigo-400 to-violet-600', engine: 'standalone', file: 'src/games/offline/spirit-realm.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/parkour-tri-thuc-3d/ParkourTriThuc3D.html — chạy `npm run games:build:parkour-fps` để cập nhật.
  { id: 'first-person-parkour', name: 'first-person parkour', icon: '🏃', tag: 'Parkour 3D', grad: 'from-cyan-400 to-blue-600', engine: 'standalone', file: 'src/games/offline/first-person-parkour.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/me-cung-thi.html — chạy `npm run games:build:parkour-offline` để cập nhật.
  { id: 'knowledge-maze', name: 'knowledge maze', icon: '🏰', tag: 'Mê cung', grad: 'from-amber-400 to-yellow-500', engine: 'standalone', file: 'src/games/offline/knowledge-maze.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/thap-may.html (three.js qua CDN, giống spin-jump).
  { id: 'cloud-tower-climb', name: 'cloud tower climb', icon: '☁️', tag: 'Leo tháp 3D', grad: 'from-sky-400 to-cyan-600', engine: 'standalone', file: 'src/games/offline/cloud-tower-climb.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // Nguồn: src/games/parkour/mecung-moi.html — mê cung đi tìm cổng câu hỏi, có hồ sơ
  // riêng cho từng bạn + bảng xếp hạng.
  { id: 'discovery-maze', name: 'discovery maze', icon: '🌀', tag: 'Mê cung 3D', grad: 'from-indigo-400 to-violet-600', engine: 'standalone', file: 'src/games/offline/discovery-maze.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  // Các game HTML có sẵn trong src/games/offline/ nhưng trước đây chưa khai báo.
  { id: 'find-the-number', name: 'find the number', icon: '🔍', tag: 'Logic', grad: 'from-sky-400 to-blue-500', engine: 'standalone', file: 'src/games/offline/find-the-number.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'labyrinth', name: 'labyrinth', icon: '🌀', tag: 'Mê cung', grad: 'from-indigo-400 to-violet-600', engine: 'standalone', file: 'src/games/offline/labyrinth.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'merge-and-blast', name: 'merge & blast', icon: '💥', tag: 'Ghép ô', grad: 'from-amber-400 to-orange-500', engine: 'standalone', file: 'src/games/offline/merge-and-blast.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'temple-run-2d', name: 'temple run 2d', icon: '🏃', tag: 'Chạy né', grad: 'from-cyan-400 to-blue-600', engine: 'standalone', file: 'src/games/offline/temple-run-2d.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'parkour-3d-pro', name: 'parkour 3d pro', icon: '🧱', tag: 'Parkour 3D', grad: 'from-cyan-400 to-indigo-600', engine: 'standalone', file: 'src/games/offline/parkour-3d-pro.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  // School_mission KHÔNG thuộc offline — xem route /school-mission và src/games/school_mission/
];

export const offlineGameIds = OFFLINE_GAME_MANIFEST.map((g) => g.id);

/**
 * id cũ → id hiện tại. Giữ link /offline/<id-cũ> và dữ liệu đã lưu mở được
 * sau khi đổi toàn bộ tên file game sang tiếng Anh viết thường.
 */
export const OFFLINE_GAME_ALIASES = {
  // Tên file gốc trước đây
  COIPhongLinh: 'spirit-realm',
  GenshinUIReplica: 'windland',
  Excel: 'kids-spreadsheet',
  FindNumber: 'find-the-number',
  Labyrinth: 'labyrinth',
  MergeBlast: 'merge-and-blast',
  TempleRun2D: 'temple-run-2d',
  // Tên tiếng Việt trước đây
  'bang-tinh': 'kids-spreadsheet',
  'chem-trai-cay': 'fruit-slash',
  'hu-trai-cay': 'fruit-jar',
  'xep-khoi': 'color-blocks',
  'pha-gach': 'neon-brick-breaker',
  'nhay-xoay': 'spin-jump',
  'goc-thu-gian': 'relax-corner',
  'dap-sau-bo': 'bug-smash',
  'ghep-cap-vuon': 'garden-pairs',
  'sau-an-la': 'apple-worm',
  'nong-trai-moi': 'happy-farm',
  'vung-dat-gio': 'windland',
  'coi-phong-linh': 'spirit-realm',
  'parkour-tri-thuc-3d': 'first-person-parkour',
  'me-cung-tri-thuc': 'knowledge-maze',
  'leo-thap-may': 'cloud-tower-climb',
  'me-cung-kham-pha': 'discovery-maze',
  'parkour-tri-thuc': 'parkour-3d-pro',
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
  const name = (title.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim() || titleCase(id)).toLowerCase();
  const idx = Math.abs(hash(id)) % FALLBACK_GRADS.length;
  return {
    id,
    name,
    icon,
    tag: 'offline',
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
