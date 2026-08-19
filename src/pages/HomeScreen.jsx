import { useEffect, useState } from 'react'
import { gameService } from '../services/api.js'
import { mockGameTemplates } from '../data/mockData.js'
import { PrimaryButton, TicketStub, Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'

export default function HomeScreen({ onSelectGame }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("list"); // "list" | "code"
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const floaters = [
    { icon: "🎡", cls: "top-16 left-6 text-5xl", delay: 0 },
    { icon: "🧠", cls: "top-24 right-8 text-4xl", delay: 0.6 },
    { icon: "🎈", cls: "bottom-24 left-12 text-5xl", delay: 1.1 },
    { icon: "⭐", cls: "bottom-16 right-14 text-4xl", delay: 0.3 },
    { icon: "🎟️", cls: "top-1/2 -left-10 text-6xl -rotate-12", delay: 0.9 },
    { icon: "🏆", cls: "top-1/2 -right-10 text-6xl rotate-12", delay: 0.15 },
    { icon: "🚀", cls: "top-40 left-1/4 text-3xl", delay: 1.4 },
    { icon: "⛵", cls: "bottom-40 right-1/4 text-3xl", delay: 0.5 },
  ];

  const loadGames = async () => {
    setGames(null); setError(null);
    try {
      setGames(await gameService.list({ status: "published" }));
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => { loadGames(); }, []);

  const submitCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true); setError(null);
    const game = await gameService.getByCode(code);
    setLoading(false);
    if (!game) { setError("Không tìm thấy trò chơi với mã này. Kiểm tra lại hoặc chọn trò chơi trong danh sách nhé!"); return; }
    onSelectGame(game);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* hero */}
      <div className="marquee-panel relative overflow-hidden">
        <div className="marquee-lights w-full absolute top-0 left-0"></div>
        {floaters.map((f, i) => (
          <span key={i} className={`absolute ${f.cls} opacity-15 float-slow select-none`} style={{ animationDelay: `${f.delay}s` }}>{f.icon}</span>
        ))}
        <div className="max-w-4xl w-full mx-auto px-6 py-12 text-center relative">
          <span className="inline-flex items-center gap-2 bg-gold text-ink font-mono text-xs uppercase tracking-wide px-4 py-1.5 rounded-full -rotate-2 mb-5 shadow-[0_2px_0_rgba(0,0,0,0.15)]">
            🎟️ Hội chợ trò chơi học tập
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-paper leading-tight mb-3 drop-shadow-[0_4px_24px_rgba(244,185,66,0.35)]">
            Lớp Học <span className="text-gold">Vui</span>
          </h1>
          <p className="font-body text-paper/70 text-base md:text-lg max-w-xl mx-auto mb-6">
            Chọn một trò chơi để bắt đầu, hoặc nhập mã vé giáo viên đưa nếu bạn quên trò chơi ở đâu 😉
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-paper/70">
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">🎮 {games ? `${games.length} trò chơi` : "..."}</span>
            <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">🏅 Bảng xếp hạng</span>
          </div>
        </div>
      </div>

      {/* body */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h2 className="font-display text-2xl text-ink">Chọn trò chơi</h2>
            <p className="text-sm text-[#8A7C63] mt-1">Bấm vào trò chơi để tham gia ngay.</p>
          </div>
          <button onClick={() => setMode(mode === "list" ? "code" : "list")}
            className="shrink-0 note-card px-4 py-2.5 text-sm font-semibold text-ink flex items-center gap-2 hover:bg-ink/5 transition">
            {mode === "list" ? "🔑 Nhập mã vé" : "← Về danh sách"}
          </button>
        </div>

        {mode === "code" ? (
          <form onSubmit={submitCode} className="max-w-md mx-auto text-center pb-10">
            <div className="text-6xl mb-4 float-slow">🎟️</div>
            <p className="text-sm text-[#8A7C63] mb-4">Nhập mã vé giáo viên đã cung cấp</p>
            <TicketStub icon="🔑" code={code || "______"} />
            <input value={code} onChange={e => { setCode(e.target.value.toUpperCase()); setError(null); }}
              placeholder="VD: TOAN101" maxLength={10}
              className="w-full text-center font-mono text-lg tracking-[0.2em] note-card px-4 py-3 mt-4 border-ink/10 focus:border-ticket uppercase" />
            {error && <p className="text-ticket text-sm mt-3">{error}</p>}
            <PrimaryButton type="submit" className="w-full mt-5" disabled={loading || !code.trim()}>{loading ? "Đang kiểm tra..." : "Tham gia →"}</PrimaryButton>
          </form>
        ) : games === null ? (
          <Loader label="Đang tải danh sách trò chơi..." />
        ) : error ? (
          <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
        ) : games.length === 0 ? (
          <EmptyState icon="🕹️" title="Chưa có trò chơi nào" subtitle="Giáo viên chưa xuất bản trò chơi nào. Hãy thử nhập mã vé hoặc quay lại sau nhé!" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map(g => {
              const tpl = mockGameTemplates.find(t => t.id === g.template);
              return (
                <button key={g.id} onClick={() => onSelectGame(g)}
                  className="note-card p-5 text-left flex flex-col gap-3 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(0,0,0,0.1)] transition shadow-[0_3px_0_rgba(0,0,0,0.09)] group anim-pop bg-paper2">
                  <div className="flex items-center justify-between">
                    <StampToken icon={tpl ? tpl.icon : "🎲"} ring={tpl ? tpl.ring : "#1D2E4A"} size={46} fontSize={22} />
                    <span className="font-mono text-[11px] text-[#8A7C63] bg-ink/5 rounded-full px-2.5 py-1">{g.code}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-ink leading-snug clamp-2">{g.title}</h3>
                    <p className="text-sm text-[#8A7C63] mt-1 clamp-2">{g.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8A7C63] font-mono flex-wrap">
                    <span>{g.subject}</span><span>·</span><span>{g.questionsCount} câu hỏi</span><span>·</span><span>{g.playersCount} lượt chơi</span>
                  </div>
                  <div className="mt-auto pt-2">
                    <span className="inline-block text-sm font-semibold text-teal group-hover:translate-x-1 transition">Chơi ngay →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-ink/10 py-5 text-center">
        <a href="#/admin" className="text-xs text-[#B7A987] font-mono hover:text-ticket transition">Giáo viên? Đăng nhập quản trị →</a>
      </footer>
    </div>
  );
}