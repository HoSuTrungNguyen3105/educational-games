// Danh mục 17 game offline. Đây là nguồn sự thật cho trang Home và route /offline/:id.
// Sinh tự động bởi scripts/split-offline-games.mjs.

export const OFFLINE_GAME_MANIFEST = [
  { id: 'math', name: 'Đua Toán', icon: '➕', tag: 'Toán', grad: 'from-orange-400 to-amber-500', engine: 'single', file: 'src/games/offline/math.html' },
  { id: 'memory', name: 'Lật Thẻ Anh – Việt', icon: '🃏', tag: 'Tiếng Anh', grad: 'from-sky-400 to-blue-500', engine: 'single', file: 'src/games/offline/memory.html' },
  { id: 'scramble', name: 'Xếp Chữ', icon: '🔤', tag: 'Tiếng Anh', grad: 'from-rose-400 to-pink-500', engine: 'single', file: 'src/games/offline/scramble.html' },
  { id: 'quiz', name: 'Đố Vui Khoa Học', icon: '🔬', tag: 'Khoa học', grad: 'from-violet-400 to-purple-600', engine: 'single', file: 'src/games/offline/quiz.html' },
  { id: 'snake', name: 'Rắn Săn Đáp Án', icon: '🐍', tag: 'Toán · Phản xạ', grad: 'from-emerald-400 to-teal-600', engine: 'single', file: 'src/games/offline/snake.html' },
  { id: 'flap', name: 'Chim Bay Qua Cổng', icon: '🐦', tag: 'Toán · Phản xạ', grad: 'from-amber-400 to-orange-500', engine: 'single', file: 'src/games/offline/flap.html' },
  { id: 'g2048', name: '2048 Lũy Thừa', icon: '🔢', tag: 'Logic', grad: 'from-violet-400 to-indigo-600', engine: 'single', file: 'src/games/offline/g2048.html' },
  { id: 'chem', name: 'Nhà Hóa Học Nhí', icon: '⚗️', tag: 'Hóa học', grad: 'from-lime-400 to-green-600', engine: 'single', file: 'src/games/offline/chem.html' },
  { id: 'clock', name: 'Đồng Hồ Thời Gian', icon: '🕒', tag: 'Toán · Xem giờ', grad: 'from-coral-400 to-rose-500', engine: 'single', file: 'src/games/offline/clock.html' },
  { id: 'pattern', name: 'Thám Tử Quy Luật', icon: '🕵️', tag: 'Toán · Tư duy', grad: 'from-sky-400 to-cyan-600', engine: 'single', file: 'src/games/offline/pattern.html' },
  { id: 'simon', name: 'Nhớ Dãy Màu', icon: '🎵', tag: 'Trí nhớ', grad: 'from-pink-400 to-fuchsia-500', engine: 'single', file: 'src/games/offline/simon.html' },
  { id: 'anagram', name: 'Đảo Chữ Nhí', icon: '🧩', tag: 'Tiếng Anh', grad: 'from-amber-400 to-yellow-500', engine: 'mc', maker: 'anagram', file: 'src/games/offline/anagram.html' },
  { id: 'stroop', name: 'Đuổi Màu', icon: '🎨', tag: 'Tập trung', grad: 'from-violet-400 to-purple-500', engine: 'mc', maker: 'stroop', file: 'src/games/offline/stroop.html' },
  { id: 'sumseq', name: 'Chuỗi Số', icon: '➕', tag: 'Toán', grad: 'from-sky-400 to-blue-500', engine: 'mc', maker: 'sumseq', file: 'src/games/offline/sumseq.html' },
  { id: 'compare', name: 'Ai Nhiều Hơn?', icon: '⚖️', tag: 'So sánh', grad: 'from-lime-400 to-emerald-500', engine: 'mc', maker: 'compare', file: 'src/games/offline/compare.html' },
  { id: 'riddle', name: 'Đố Vui Nhanh', icon: '💡', tag: 'Kiến thức', grad: 'from-coral-400 to-orange-500', engine: 'mc', maker: 'riddle', file: 'src/games/offline/riddle.html' },
  { id: 'shapecount', name: 'Đếm Nhanh', icon: '🔷', tag: 'Tập trung', grad: 'from-pink-400 to-rose-500', engine: 'mc', maker: 'shapecount', file: 'src/games/offline/shapecount.html' },
];

export const offlineGameIds = OFFLINE_GAME_MANIFEST.map((g) => g.id);

export function findOfflineGame(id) {
  return OFFLINE_GAME_MANIFEST.find((g) => g.id === id) || null;
}
