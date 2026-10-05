// Danh mục game offline. Đây là nguồn sự thật cho trang Home và route /offline/:id.
// Sinh tự động bởi scripts/split-offline-games.mjs.

export const OFFLINE_GAME_MANIFEST = [
  { id: 'math', name: 'Săn Trái Cây', icon: '🍓', tag: 'Arcade', grad: 'from-orange-400 to-amber-500', engine: 'single', file: 'src/games/offline/math.html' },
  { id: 'memory', name: 'Ghép Cặp Hình', icon: '🃏', tag: 'Giải trí', grad: 'from-sky-400 to-blue-500', engine: 'single', file: 'src/games/offline/memory.html' },
  { id: 'scramble', name: 'Săn Kho Báu', icon: '🗺️', tag: 'Phiêu lưu', grad: 'from-rose-400 to-pink-500', engine: 'single', file: 'src/games/offline/scramble.html' },
  { id: 'quiz', name: 'Bắn Bong Bóng', icon: '🫧', tag: 'Arcade', grad: 'from-violet-400 to-purple-600', engine: 'single', file: 'src/games/offline/quiz.html' },
  { id: 'snake', name: 'Rắn Săn Mồi', icon: '🐍', tag: 'Arcade', grad: 'from-emerald-400 to-teal-600', engine: 'single', file: 'src/games/offline/snake.html' },
  { id: 'flap', name: 'Chim Bay Tự Do', icon: '🐦', tag: 'Arcade', grad: 'from-amber-400 to-orange-500', engine: 'single', file: 'src/games/offline/flap.html' },
  { id: 'g2048', name: 'Vườn Trái Cây', icon: '🍉', tag: 'Ghép ô', grad: 'from-violet-400 to-indigo-600', engine: 'single', file: 'src/games/offline/g2048.html' },
  { id: 'chem', name: 'Phòng Thí Nghiệm Vui', icon: '🧪', tag: 'Arcade', grad: 'from-lime-400 to-green-600', engine: 'single', file: 'src/games/offline/chem.html' },
  { id: 'clock', name: 'Chạy Trốn Đồng Hồ', icon: '⏳', tag: 'Arcade', grad: 'from-coral-400 to-rose-500', engine: 'single', file: 'src/games/offline/clock.html' },
  { id: 'pattern', name: 'Săn Sao', icon: '⭐', tag: 'Arcade', grad: 'from-sky-400 to-cyan-600', engine: 'single', file: 'src/games/offline/pattern.html' },
  { id: 'simon', name: 'Giai Điệu Sắc Màu', icon: '🎵', tag: 'Nhịp điệu', grad: 'from-pink-400 to-fuchsia-500', engine: 'single', file: 'src/games/offline/simon.html' },
  { id: 'anagram', name: 'Mê Cung Ký Tự', icon: '🧩', tag: 'Giải trí', grad: 'from-amber-400 to-yellow-500', engine: 'single', file: 'src/games/offline/anagram.html' },
  { id: 'stroop', name: 'Sắc Màu Tốc Độ', icon: '🎨', tag: 'Arcade', grad: 'from-violet-400 to-purple-500', engine: 'single', file: 'src/games/offline/stroop.html' },
  { id: 'sumseq', name: 'Nhịp Điệu Ánh Sáng', icon: '🎆', tag: 'Phản xạ', grad: 'from-sky-400 to-blue-500', engine: 'single', file: 'src/games/offline/sumseq.html' },
  { id: 'compare', name: 'Đấu Trường Bong Bóng', icon: '🫧', tag: 'Arcade', grad: 'from-lime-400 to-emerald-500', engine: 'single', file: 'src/games/offline/compare.html' },
  { id: 'riddle', name: 'Cuộc Đua Tốc Độ', icon: '🏁', tag: 'Arcade', grad: 'from-coral-400 to-orange-500', engine: 'single', file: 'src/games/offline/riddle.html' },
  { id: 'shapecount', name: 'Bắt Vật Thể', icon: '🎯', tag: 'Phản xạ', grad: 'from-pink-400 to-rose-500', engine: 'single', file: 'src/games/offline/shapecount.html' },
  { id: 'plantvsanimal', name: 'Vườn Thủ Hộ', icon: '🌻', tag: 'Chiến thuật', grad: 'from-green-400 to-lime-600', engine: 'standalone', file: 'src/games/offline/plantvsanimal.html' },
];

export const offlineGameIds = OFFLINE_GAME_MANIFEST.map((g) => g.id);

export function findOfflineGame(id) {
  return OFFLINE_GAME_MANIFEST.find((g) => g.id === id) || null;
}
