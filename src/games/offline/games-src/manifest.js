// Danh mục game offline. Đây là nguồn sự thật cho trang Home và route /offline/:id.
// Sinh tự động bởi scripts/split-offline-games.mjs.

export const OFFLINE_GAME_MANIFEST = [
  // `thumbnail`: tên file ảnh nằm trong public/. Client tự ghép base URL
  // (xem src/lib/gameThumbnail.js) nên không hard-code /educational-games/.
  { id: 'math', name: 'Săn Trái Cây', icon: '🍓', tag: 'Arcade', grad: 'from-orange-400 to-amber-500', engine: 'single', thumbnail: 'san-trai-cay.png', file: 'src/games/offline/math.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'memory', name: 'Ghép Cặp Hình', icon: '🃏', tag: 'Giải trí', grad: 'from-sky-400 to-blue-500', engine: 'single', thumbnail: 'ghep-cap-hinh.png', file: 'src/games/offline/memory.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'scramble', name: 'Săn Kho Báu', icon: '🗺️', tag: 'Phiêu lưu', grad: 'from-rose-400 to-pink-500', engine: 'single', thumbnail: 'san-kho-bau.png', file: 'src/games/offline/scramble.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'quiz', name: 'Chọn Một Vui', icon: '🎉', tag: 'Giải trí', grad: 'from-violet-400 to-purple-600', engine: 'single', thumbnail: 'chon-mot-vui.png', file: 'src/games/offline/quiz.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'snake', name: 'Rắn Săn Mồi', icon: '🐍', tag: 'Arcade', grad: 'from-emerald-400 to-teal-600', engine: 'single', thumbnail: 'ran-san-moi.png', file: 'src/games/offline/snake.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'flap', name: 'Chim Bay Tự Do', icon: '🐦', tag: 'Arcade', grad: 'from-amber-400 to-orange-500', engine: 'single', thumbnail: 'chim-bay-tu-do.png', file: 'src/games/offline/flap.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'g2048', name: 'Vườn Trái Cây', icon: '🍉', tag: 'Ghép ô', grad: 'from-violet-400 to-indigo-600', engine: 'single', thumbnail: 'vuon-trai-cay.png', file: 'src/games/offline/g2048.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'chem', name: 'Tiệc Ánh Sáng', icon: '✨', tag: 'Arcade', grad: 'from-lime-400 to-green-600', engine: 'single', thumbnail: 'tiec-anh-sang.png', file: 'src/games/offline/chem.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'clock', name: 'Chạm Đúng Nhịp', icon: '🚦', tag: 'Arcade', grad: 'from-coral-400 to-rose-500', engine: 'single', thumbnail: 'cham-dung-nhip.png', file: 'src/games/offline/clock.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'pattern', name: 'Săn Sao', icon: '⭐', tag: 'Arcade', grad: 'from-sky-400 to-cyan-600', engine: 'single', file: 'src/games/offline/pattern.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'simon', name: 'Giai Điệu Sắc Màu', icon: '🎵', tag: 'Nhịp điệu', grad: 'from-pink-400 to-fuchsia-500', engine: 'single', file: 'src/games/offline/simon.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'anagram', name: 'Mê Cung Ký Tự', icon: '🧩', tag: 'Giải trí', grad: 'from-amber-400 to-yellow-500', engine: 'single', file: 'src/games/offline/anagram.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'stroop', name: 'Sắc Màu Tốc Độ', icon: '🎨', tag: 'Arcade', grad: 'from-violet-400 to-purple-500', engine: 'single', file: 'src/games/offline/stroop.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'sumseq', name: 'Nhịp Điệu Ánh Sáng', icon: '🎆', tag: 'Phản xạ', grad: 'from-sky-400 to-blue-500', engine: 'single', file: 'src/games/offline/sumseq.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'compare', name: 'Oẳn Tù Tì', icon: '✊', tag: 'Giải trí', grad: 'from-lime-400 to-emerald-500', engine: 'single', file: 'src/games/offline/compare.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'riddle', name: 'Phản Xạ Đèn Xanh', icon: '🚦', tag: 'Arcade', grad: 'from-coral-400 to-orange-500', engine: 'single', thumbnail: 'phan-xa-den-xanh.png', file: 'src/games/offline/riddle.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'shapecount', name: 'Bắt Vật Thể', icon: '🎯', tag: 'Phản xạ', grad: 'from-pink-400 to-rose-500', engine: 'single', thumbnail: 'bat-vat-the.png', file: 'src/games/offline/shapecount.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'plantvsanimal', name: 'Vườn Thủ Hộ', icon: '🌻', tag: 'Chiến thuật', grad: 'from-green-400 to-lime-600', engine: 'standalone', thumbnail: 'vuon-thu-ho.png', file: 'src/games/offline/plantvsanimal.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'chem-trai-cay', name: 'Chém Trái Cây', icon: '🍉', tag: 'Phản xạ', grad: 'from-red-400 to-rose-600', engine: 'single', thumbnail: 'chem-trai-cay.png', file: 'src/games/offline/chem-trai-cay.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'hu-trai-cay', name: 'Hũ Trái Cây', icon: '🫙', tag: 'Vui vẻ', grad: 'from-amber-400 to-orange-500', engine: 'single', thumbnail: 'hu-trai-cay.png', file: 'src/games/offline/hu-trai-cay.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'xep-khoi', name: 'Xếp Khối Màu', icon: '🧊', tag: 'Logic', grad: 'from-cyan-400 to-sky-500', engine: 'single', thumbnail: 'xep-khoi-mau.png', file: 'src/games/offline/xep-khoi.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'pha-gach', name: 'Phá Gạch Neon', icon: '🧱', tag: 'Giải trí', grad: 'from-fuchsia-400 to-purple-600', engine: 'single', thumbnail: 'pha-gach-neon.png', file: 'src/games/offline/pha-gach.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'nhay-xoay', name: 'Nhảy Xoáy', icon: '🌀', tag: 'Game 3D', grad: 'from-indigo-400 to-blue-600', engine: 'single', thumbnail: 'nhay-xoay.png', file: 'src/games/offline/nhay-xoay.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'goc-thu-gian', name: 'Góc Thư Giãn', icon: '🧘', tag: 'Thư giãn', grad: 'from-teal-400 to-emerald-600', engine: 'single', thumbnail: 'goc-thu-gian.png', file: 'src/games/offline/goc-thu-gian.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  // { id: 'trung-tam-game', name: 'Trung Tâm Game', icon: '💾', tag: 'Sao lưu', grad: 'from-slate-400 to-slate-600', engine: 'single', file: 'src/games/offline/trung-tam-game.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'night-strike', name: 'Săn zombie', icon: '🧟', tag: 'Phản xạ', grad: 'from-red-400 to-rose-600', engine: 'single', thumbnail: 'san-zombie.png', file: 'src/games/offline/night-strike.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  { id: 'dap-sau-bo', name: 'Đập Sâu Bọ', icon: '🪲', tag: 'Đập côn trùng', grad: 'from-teal-400 to-emerald-600', engine: 'single', thumbnail: 'dap-sau-bo.png', file: 'src/games/offline/dap-sau-bo.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'ghep-cap-vuon', name: 'Ghép Cặp Vườn', icon: '🧩', tag: 'Ghép đôi', grad: 'from-pink-400 to-rose-500', engine: 'single', thumbnail: 'ghep-cap-vuon.png', file: 'src/games/offline/ghep-cap-vuon.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'sau-an-la', name: 'Sâu Ăn Táo', icon: '🐛', tag: 'Bảo vệ vườn', grad: 'from-indigo-400 to-blue-600', engine: 'single', file: 'src/games/offline/sau-an-la.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'parkour', name: 'Parkour Tri Thức 3D', icon: '🏃', tag: 'Parkour 3D', grad: 'from-pink-400 to-rose-500', engine: 'single', file: 'src/games/offline/parkour.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'parkour-tri-thuc', name: 'Parkour Tri Thức Pro', icon: '🧗', tag: 'Parkour 3D', grad: 'from-fuchsia-500 to-violet-700', engine: 'standalone', file: 'src/games/offline/parkour-tri-thuc.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'nong-trai-moi', name: 'Nông Trại Vui Vẻ', icon: '🚜', tag: 'Mô phỏng', grad: 'from-green-400 to-lime-500', engine: 'standalone', thumbnail: 'nong-trai-nang-cap.png', file: 'src/games/offline/nong-trai-moi.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'fieldrunner', name: 'Phòng thủ cánh đồng', icon: '🌾', tag: 'Phòng thủ', grad: 'from-lime-400 to-green-600', engine: 'standalone', file: 'src/games/offline/fieldrunner.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'cargo', name: 'Xe tải ra chợ', icon: '🚚', tag: 'Arcade', grad: 'from-amber-400 to-orange-500', engine: 'standalone', file: 'src/games/offline/cargo.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'Excel', name: 'Bảng Tính Bé', icon: '📊', tag: 'Học tập', grad: 'from-emerald-400 to-green-600', engine: 'standalone', file: 'src/games/offline/Excel.html', type: 'play-to-learn', playMode: 'offline', version: 1 },
  { id: 'GenshinUIReplica', name: 'Bảng Tính Bé', icon: '📊', tag: 'Học tập', grad: 'from-emerald-400 to-green-600', engine: 'standalone', file: 'src/games/offline/GenshinUIReplica.html', type: 'play-to-learn', playMode: 'offline', version: 1 },

  // School_mission KHÔNG thuộc offline — xem route /school-mission và src/games/school_mission/
];

export const offlineGameIds = OFFLINE_GAME_MANIFEST.map((g) => g.id);

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
