const fs = require('fs');
let c = fs.readFileSync('src/pages/HomeScreen.jsx', 'utf8');

const offlineGameCard = `
function OfflineGameCard({ game }) {
  return (
    <button onClick={() => navigate(game.path)} className="group bg-white rounded-3xl p-2.5 shadow-[0_6px_18px_rgba(15,60,120,.08)] hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(15,60,120,.14)] transition-all text-left">
      <div className={\`relative aspect-[16/11] rounded-2xl overflow-hidden bg-gradient-to-br \${game.grad} flex items-center justify-center\`}>
        <span className="text-5xl lg:text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">{game.icon}</span>
        <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow">OFFLINE</span>
      </div>
      <div className="px-1 pt-2 pb-0.5">
        <p className="font-display font-bold text-[13px] text-ink truncate">{game.name}</p>
        <p className="text-[10.5px] text-slate-400 truncate">{game.description}</p>
        <span className="mt-2 w-full inline-flex items-center justify-center gap-1 bg-slate-100 text-slate-600 text-[11.5px] font-extrabold rounded-full py-1.5 shadow-sm group-hover:bg-slate-200 transition">
          Chơi ngay <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
}
`;

c = c.replace(/(function FeaturedGameCard\(\) \{[\s\S]*?\}\r?\n)/, `$1\n${offlineGameCard}\n`);
fs.writeFileSync('src/pages/HomeScreen.jsx', c);
