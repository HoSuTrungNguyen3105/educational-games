import { useEffect, useMemo, useState } from 'react'
import { gameService } from '../services/api.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { PrimaryButton, Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'

// Bảng màu theo môn học — mỗi môn luôn ra cùng 1 màu, giúp trẻ nhận diện nhanh
const SUBJECT_PALETTE = [
  { grad: "from-purple-400 to-fuchsia-400", chip: "bg-purple-100 text-purple-700 border-purple-200", solid: "bg-purple-500" },
  { grad: "from-orange-400 to-amber-400", chip: "bg-amber-100 text-amber-700 border-amber-200", solid: "bg-amber-500" },
  { grad: "from-cyan-400 to-blue-400", chip: "bg-cyan-100 text-cyan-700 border-cyan-200", solid: "bg-cyan-500" },
  { grad: "from-emerald-400 to-teal-400", chip: "bg-emerald-100 text-emerald-700 border-emerald-200", solid: "bg-emerald-500" },
  { grad: "from-pink-400 to-rose-400", chip: "bg-pink-100 text-pink-700 border-pink-200", solid: "bg-pink-500" },
  { grad: "from-indigo-400 to-violet-400", chip: "bg-indigo-100 text-indigo-700 border-indigo-200", solid: "bg-indigo-500" },
];

function colorForSubject(subject = "") {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash = (subject.charCodeAt(i) + ((hash << 5) - hash)) | 0;
  return SUBJECT_PALETTE[Math.abs(hash) % SUBJECT_PALETTE.length];
}

export default function HomeScreen({ onSelectGame, userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeSubject, setActiveSubject] = useState("all");
  const templates = useTemplates();

  // Vài icon bay lượn nhẹ nhàng — bớt rối mắt hơn bản cũ
  const floaters = [
    { icon: "🎈", cls: "top-10 left-[8%] text-5xl", delay: 0, duration: 5 },
    { icon: "⭐", cls: "top-16 right-[10%] text-4xl", delay: 0.6, duration: 4.5 },
    { icon: "🌈", cls: "bottom-16 right-[14%] text-4xl", delay: 0.3, duration: 5.5 },
    { icon: "🦋", cls: "bottom-24 left-[10%] text-3xl", delay: 1, duration: 5 },
    { icon: "✨", cls: "top-14 left-[42%] text-2xl", delay: 0.8, duration: 4 },
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

  const hotGames = games ? [...games].sort((a, b) => (b.playersCount || 0) - (a.playersCount || 0)).slice(0, 3) : [];
  const newGames = games ? [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6) : [];

  const subjects = useMemo(() => {
    if (!games) return [];
    return [...new Set(games.map(g => g.subject).filter(Boolean))];
  }, [games]);

  const visibleGames = useMemo(() => {
    if (!games) return [];
    if (activeSubject === "all") return games;
    return games.filter(g => g.subject === activeSubject);
  }, [games, activeSubject]);

  const isFiltering = activeSubject !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-purple-50/60 to-pink-50 flex flex-col overflow-x-hidden">
      {/* Thanh điều hướng — luôn cố định trên cùng để trẻ/giáo viên thao tác nhanh */}
      <TopBar userAuth={userAuth} onUserLogin={onUserLogin} onUserRegister={onUserRegister} onUserLogout={onUserLogout} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-yellow-300/25 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-6 -right-24 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {floaters.map((f, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`absolute ${f.cls} select-none animate-float drop-shadow-lg pointer-events-none`}
            style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
          >
            {f.icon}
          </span>
        ))}

        <div className="relative z-10 max-w-5xl w-full mx-auto px-6 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm uppercase tracking-wide px-5 py-2 rounded-full shadow-lg mb-6">
            <span className="text-base">🎪</span> Hội chợ trò chơi học tập
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 leading-tight mb-4 animate-gradient drop-shadow-sm">
            Lớp Học Vui
          </h1>

          <p className="font-body text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Học mà chơi, chơi mà học! Chọn một trò chơi bên dưới hoặc nhập mã vé từ thầy cô nhé 🎟️
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <PrimaryButton
              onClick={() => setShowCodeModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300"
            >
              🔑 Nhập mã vé
            </PrimaryButton>
            <PrimaryButton
              onClick={() => document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
            >
              🎮 Khám phá trò chơi
            </PrimaryButton>
          </div>

          {/* Nhân vật dẫn dắt — điểm nhấn thân thiện, giúp bé đỡ bỡ ngỡ */}
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full pl-2 pr-5 py-2 shadow-md border-2 border-yellow-200 mb-8">
            <span className="text-3xl animate-bounce">🐣</span>
            <span className="text-sm font-semibold text-gray-600">Bé Vui đang chờ bạn chọn trò chơi đó!</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-5 py-2.5 shadow-md">
              <span className="text-2xl">🎮</span>
              <span className="font-semibold text-purple-700">{games ? `${games.length} trò chơi` : "..."}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-pink-200 rounded-full px-5 py-2.5 shadow-md">
              <span className="text-2xl">🏅</span>
              <span className="font-semibold text-pink-700">Bảng xếp hạng</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-full px-5 py-2.5 shadow-md">
              <span className="text-2xl">👥</span>
              <span className="font-semibold text-cyan-700">Học cùng bạn bè</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient-wave)" />
            <defs>
              <linearGradient id="gradient-wave" x1="0" y1="0" x2="1440" y2="0">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="50%" stopColor="#FCE7F3" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bộ lọc theo môn học — to, nhiều màu, dễ chạm cho trẻ nhỏ */}
      {subjects.length > 1 && (
        <div className="sticky top-16 z-10 bg-white/85 backdrop-blur-sm border-b border-purple-100 py-3">
          <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <SubjectChip
              label="🌟 Tất cả"
              active={activeSubject === "all"}
              onClick={() => setActiveSubject("all")}
              classes="bg-gray-100 text-gray-700 border-gray-200"
            />
            {subjects.map(subject => {
              const color = colorForSubject(subject);
              return (
                <SubjectChip
                  key={subject}
                  label={subject}
                  active={activeSubject === subject}
                  onClick={() => setActiveSubject(subject)}
                  classes={color.chip}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      <main id="games-section" className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-12">
        {games === null ? (
          <Loader label="Đang tải danh sách trò chơi..." />
        ) : error ? (
          <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
        ) : games.length === 0 ? (
          <EmptyState icon="🎪" title="Chưa có trò chơi nào" subtitle="Giáo viên chưa xuất bản trò chơi nào. Hãy thử nhập mã vé hoặc quay lại sau nhé!" />
        ) : isFiltering ? (
          <section>
            <SectionHeader
              icon="🔎"
              title={`Môn ${activeSubject}`}
              gradient="from-purple-500 to-indigo-500"
            />
            {visibleGames.length === 0 ? (
              <EmptyState icon="🧐" title="Chưa có trò chơi cho môn này" subtitle="Thử chọn môn khác hoặc bấm 'Tất cả' để xem hết trò chơi nhé!" />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-5">
                {visibleGames.map((g, index) => (
                  <GameCard key={g._id?.toString() || g.id} game={g} template={templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid))} onSelect={onSelectGame} index={index} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {hotGames.length > 0 && (
              <section className="mb-14">
                <SectionHeader icon="🔥" title="Trò chơi đang HOT" gradient="from-red-500 to-orange-500" pulse />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-5">
                  {hotGames.map((g, index) => (
                    <GameCard
                      key={g._id?.toString() || g.id}
                      game={g}
                      template={templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid))}
                      onSelect={onSelectGame}
                      index={index}
                      badge={index === 0 ? "🥇 TOP 1" : index === 1 ? "🥈 TOP 2" : index === 2 ? "🥉 TOP 3" : null}
                      badgeColor={index === 0 ? "from-yellow-400 to-amber-500" : index === 1 ? "from-gray-300 to-gray-400" : index === 2 ? "from-orange-400 to-orange-500" : null}
                    />
                  ))}
                </div>
              </section>
            )}

            {newGames.length > 0 && (
              <section className="mb-14">
                <SectionHeader icon="✨" title="Trò chơi mới" gradient="from-emerald-500 to-teal-500" />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-5">
                  {newGames.map((g, index) => (
                    <GameCard key={g._id?.toString() || g.id} game={g} template={templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid))} onSelect={onSelectGame} index={index} isNew />
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionHeader icon="🎮" title="Tất cả trò chơi" gradient="from-purple-500 to-indigo-500" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {games.map((g, index) => (
                  <GameCard key={g._id?.toString() || g.id} game={g} template={templates.find(t => t._id === (typeof g.templateId === "string" ? g.templateId : g.templateId?.$oid))} onSelect={onSelectGame} index={index} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer — nhẹ nhàng, chỉ để lời chào và lối tắt cho giáo viên */}
      {/* <footer className="bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100 border-t border-purple-200 py-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600 flex items-center gap-1.5">Làm với <span className="text-pink-500">💜</span> cho các bạn học sinh</p>
          <a
            onClick={() => navigate("/admin")}
            href="#/admin"
            className="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold hover:text-purple-700 transition"
          >
            👨‍🏫 Giáo viên? Đăng nhập quản trị →
          </a>
        </div>
      </footer> */}

      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onSelectGame} />
    </div>
  );
}

// Thanh điều hướng cố định — gom mọi thao tác quan trọng lên đầu trang
function TopBar({ userAuth, onUserLogin, onUserRegister, onUserLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
        <a href="#/" onClick={() => navigate("/")} className="flex items-center gap-2 font-display text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          🎪 Lớp Học Vui
        </a>

        <div className="flex items-center gap-2">
          {/* Từ tablet trở lên: hiện luôn Tin nhắn / Tìm bạn */}
          {userAuth?.user && (
            <a
              onClick={() => navigate("/chat")}
              href="#/chat"
              title="Tin nhắn"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:text-purple-700 transition px-3 py-2 rounded-full hover:bg-purple-50"
            >
              💬 <span className="hidden md:inline">Tin nhắn</span>
            </a>
          )}
          {userAuth?.user && (
            <a
              onClick={() => navigate("/find-friends")}
              href="#/find-friends"
              title="Tìm bạn"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:text-purple-700 transition px-3 py-2 rounded-full hover:bg-purple-50"
            >
              🔍 <span className="hidden md:inline">Tìm bạn</span>
            </a>
          )}
          <a
            onClick={() => navigate("/admin")}
            href="#/admin"
            className="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold hover:text-purple-700 transition"
          >
            👨‍🏫 Giáo viên? Vào quản trị →
          </a>
          {!userAuth?.user && (
            <button
              onClick={onUserRegister}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-4 py-2 rounded-full hover:from-cyan-600 hover:to-blue-600 transition shadow-sm"
            >
              ✨ Đăng ký
            </button>
          )}

          {userAuth?.user ? (
            <>
              <a
                onClick={() => navigate("/profile")}
                href="#/profile"
                className="inline-flex items-center gap-2 text-sm bg-purple-50 text-purple-700 font-semibold pl-2 pr-4 py-1.5 rounded-full hover:bg-purple-100 transition"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-xs">👤</span>
                <span className="hidden xs:inline">{userAuth.user.name}</span>
              </a>
              <button
                onClick={onUserLogout}
                title="Đăng xuất"
                className="hidden sm:inline-flex items-center text-sm text-red-500 font-semibold hover:text-red-600 transition px-2 py-2 rounded-full hover:bg-red-50"
              >
                🚪
              </button>
            </>
          ) : (
            <button
              onClick={onUserLogin}
              className="inline-flex items-center gap-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition shadow-sm"
            >
              🔑 Đăng nhập
            </button>
          )}

          {/* Chỉ trên mobile: nút gộp các lối tắt còn lại */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Thêm tuỳ chọn"
            aria-expanded={menuOpen}
            className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-600 text-lg hover:bg-purple-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
          >
            {menuOpen ? "✕" : "⋯"}
          </button>
        </div>
      </div>

      {/* Menu xổ xuống trên mobile */}
      {menuOpen && (
        <div className="sm:hidden absolute right-4 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-xl border border-purple-100 p-2 flex flex-col gap-1 animate-fade-in-up">
          {userAuth?.user ? (
            <>
              <button onClick={() => go("/chat")} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                💬 Tin nhắn
              </button>
              <button onClick={() => go("/find-friends")} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
                🔍 Tìm bạn
              </button>
              <div className="h-px bg-purple-100 my-1"></div>
              <button
                onClick={() => { onUserLogout(); setMenuOpen(false); }}
                className="flex items-center gap-3 text-sm font-semibold text-red-500 px-3 py-2.5 rounded-xl hover:bg-red-50 text-left"
              >
                🚪 Đăng xuất
              </button>
            </>
          ) : (
            <button
              onClick={() => { onUserRegister(); setMenuOpen(false); }}
              className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-cyan-50 text-left"
            >
              ✨ Đăng ký tài khoản
            </button>
          )}
          <button onClick={() => go("/admin")} className="flex items-center gap-3 text-sm font-semibold text-gray-700 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-left">
            👨‍🏫 Trang giáo viên
          </button>
        </div>
      )}

      {/* Lớp phủ để đóng menu khi chạm ra ngoài */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 z-[-1]" onClick={() => setMenuOpen(false)}></div>
      )}
    </header>
  );
}

function SectionHeader({ icon, title, gradient, pulse }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full shadow-lg ${pulse ? "animate-pulse-glow" : ""}`}>
        <span className="text-2xl">{icon}</span>
        <h2 className="font-display text-xl font-bold">{title}</h2>
      </div>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-200 to-transparent rounded-full"></div>
    </div>
  );
}

function SubjectChip({ label, active, onClick, classes }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap text-sm font-bold px-4 py-2 rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 ${active ? `${classes} shadow-md scale-105` : `${classes} opacity-60 hover:opacity-100`
        }`}
    >
      {label}
    </button>
  );
}

// Thẻ trò chơi — mobile: vuông gọn, desktop: kiểu backup có description + "Chơi ngay"
function GameCard({ game, template, onSelect, index, badge, badgeColor, isNew }) {
  const color = colorForSubject(game.subject);
  return (
    <button
      onClick={() => onSelect(game)}
      aria-label={`Chơi ${game.name}`}
      className="group relative bg-white rounded-lg lg:rounded-2xl p-3 text-left shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0 lg:hover:-translate-y-2 border-2 border-transparent hover:border-purple-200 overflow-hidden aspect-square lg:aspect-auto flex flex-col animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Dải màu theo môn học */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color.grad}`}></div>

      {(badge || isNew) && (
        <div className={`absolute top-2 right-2 lg:-top-1 lg:-right-1 text-white text-[9px] lg:text-xs font-bold px-2 lg:px-3 py-0.5 lg:py-1 rounded-full shadow-lg z-10 bg-gradient-to-r ${badge ? badgeColor : "from-emerald-400 to-teal-400"}`}>
          {badge || "MỚI"}
        </div>
      )}

      {/* ── Mobile: compact vuông ── */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0 lg:hidden">
        <div className="flex justify-center mb-2">
          <StampToken icon={template ? template.icon : "🎲"} ring={template ? template.ring : "#A855F7"} size={44} fontSize={20} />
        </div>
        <h3 className="font-display text-sm text-gray-800 leading-tight mb-1 group-hover:text-purple-700 transition-colors line-clamp-2 text-center">
          {game.name}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-1 text-[9px] font-mono mt-auto">
          <span className={`px-1.5 py-0.0.5 rounded ${color.chip}`}>{game.subject}</span>
          <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">❓{game.questionsCount}</span>
          <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">🎮{game.playersCount}</span>
        </div>
      </div>

      {/* ── Desktop: kiểu backup có description + Chơi ngay ── */}
      <div className="relative z-10 hidden lg:flex lg:flex-col lg:flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            <StampToken icon={template ? template.icon : "🎲"} ring={template ? template.ring : "#A855F7"} size={48} fontSize={22} />
          </div>
          <span className="font-mono text-[11px] text-gray-500 bg-gray-100 group-hover:bg-purple-100 rounded-full px-2.5 py-1 transition-colors">
            {game.code}
          </span>
        </div>

        <h3 className="font-display text-lg text-gray-800 leading-snug mb-1.5 group-hover:text-purple-700 transition-colors line-clamp-2">
          {game.name}
        </h3>
        <p className="text-[13px] text-gray-500 mb-2.5 line-clamp-2 group-hover:text-gray-600">
          {game.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mb-2.5">
          <span className={`px-2 py-1 rounded-lg ${color.chip}`}>{game.subject}</span>
          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{game.questionsCount} câu hỏi</span>
          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{game.playersCount} lượt chơi</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 group-hover:gap-3 transition-all">
            Chơi ngay <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
          <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🎮</span>
        </div>
      </div>
    </button>
  );
}