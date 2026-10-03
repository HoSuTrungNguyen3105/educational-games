const fs = require('fs');
let c = fs.readFileSync('src/pages/HomeScreen.jsx', 'utf8');

const offlineGames = `
const OFFLINE_GAMES = [
  { key: "hmc-game1", path: "/hmc-game1", name: "Học Mà Chơi", description: "5 trò chơi ngắn", icon: "🎮", grad: "from-orange-400 to-amber-500" },
  { key: "hmc-game2", path: "/hmc-game2", name: "Học Mà Chơi LAB", description: "Toán, Hóa, Logic", icon: "🧪", grad: "from-indigo-400 to-violet-500" },
  { key: "hmc-game3", path: "/hmc-game3", name: "Học Mà Chơi LAB 2", description: "Toán, Hóa, Logic 2", icon: "🔬", grad: "from-cyan-400 to-blue-500" }
];
`;
// find FEATURED_GAME block and insert after it
c = c.replace(/(const FEATURED_GAME = \{[\s\S]*?\};\r?\n)/, `$1\n${offlineGames}\n`);

// find the rendering block and insert OFFLINE_GAMES mapping
c = c.replace(/(\{\/\* Game ghim \*\/\}\r?\n\s*<FeaturedGameCard \/>\r?\n)/, `$1                    {OFFLINE_GAMES.map(g => <OfflineGameCard key={g.key} game={g} />)}\n`);

fs.writeFileSync('src/pages/HomeScreen.jsx', c);
