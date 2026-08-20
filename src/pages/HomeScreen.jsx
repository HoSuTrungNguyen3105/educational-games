import { useEffect, useState } from 'react'
import { gameService } from '../services/api.js'
import { useTemplates } from '../lib/hooks.js'
import { navigate } from '../lib/router.js'
import { PrimaryButton, Loader, ErrorState, EmptyState, StampToken } from '../components/ui.jsx'
import { EnterCodeModal } from '../components/EnterCodeModal.jsx'

export default function HomeScreen({ onSelectGame }) {
  const [games, setGames] = useState(null);
  const [error, setError] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const templates = useTemplates();

  // Icons bay lượn vui nhộn
  const floaters = [
    { icon: "🎈", cls: "top-8 left-[8%] text-5xl", delay: 0, duration: 4 },
    { icon: "⭐", cls: "top-16 right-[12%] text-4xl", delay: 0.5, duration: 3.5 },
    { icon: "🎉", cls: "top-24 left-[20%] text-3xl", delay: 1, duration: 5 },
    { icon: "🌈", cls: "bottom-20 right-[15%] text-4xl", delay: 0.3, duration: 4.5 },
    { icon: "🚀", cls: "top-32 right-[25%] text-3xl", delay: 0.8, duration: 3 },
    { icon: "🦋", cls: "bottom-32 left-[10%] text-3xl", delay: 1.2, duration: 4 },
    { icon: "✨", cls: "top-12 left-[40%] text-2xl", delay: 0.6, duration: 3.2 },
    { icon: "🎪", cls: "bottom-16 right-[30%] text-4xl", delay: 0.2, duration: 4.8 },
    { icon: "🏆", cls: "top-20 left-[60%] text-3xl", delay: 0.9, duration: 3.8 },
    { icon: "🎨", cls: "bottom-24 left-[35%] text-3xl", delay: 1.1, duration: 4.2 },
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

  // Phân loại game
  const hotGames = games ? [...games].sort((a, b) => (b.playersCount || 0) - (a.playersCount || 0)).slice(0, 6) : [];
  const newGames = games ? [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 flex flex-col overflow-x-hidden">
      {/* Hero Banner - Animation rực rỡ */}
      <div className="relative overflow-hidden">
        {/* Background animated gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-10 -right-20 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating icons */}
        {floaters.map((f, i) => (
          <span
            key={i}
            className={`absolute ${f.cls} select-none animate-float drop-shadow-lg`}
            style={{ animationDelay: `${f.delay}s`, animationDuration: `${f.duration}s` }}
          >
            {f.icon}
          </span>
        ))}

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl w-full mx-auto px-6 py-16 md:py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm uppercase tracking-wide px-5 py-2 rounded-full shadow-lg animate-bounce-slow mb-6">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-white opacity-75"></span>
            <span className="relative">🎪 Hội chợ trò chơi học tập</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 leading-tight mb-4 animate-gradient drop-shadow-sm">
            Lớp Học Vui
          </h1>

          {/* Subtitle với animation */}
          <p className="font-body text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in-up">
            🎮 Học mà chơi, chơi mà học! Chọn trò chơi yêu thích hoặc nhập mã vé từ giáo viên nhé! 🎟️
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 animate-fade-in-up animation-delay-300">
            <PrimaryButton
              onClick={() => setShowCodeModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              🔑 Nhập mã vé
            </PrimaryButton>
            <PrimaryButton
              onClick={() => document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              🎮 Khám phá trò chơi
            </PrimaryButton>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm animate-fade-in-up animation-delay-500">
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

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
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

      {/* Main content */}
      <main id="games-section" className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 py-12">
        {/* Loading/Error/Empty states */}
        {games === null ? (
          <Loader label="Đang tải danh sách trò chơi..." />
        ) : error ? (
          <ErrorState title="Không tải được danh sách" subtitle={error} onRetry={loadGames} />
        ) : games.length === 0 ? (
          <EmptyState icon="🎪" title="Chưa có trò chơi nào" subtitle="Giáo viên chưa xuất bản trò chơi nào. Hãy thử nhập mã vé hoặc quay lại sau nhé!" />
        ) : (
          <>
            {/* Section: Trò chơi đang HOT */}
            {hotGames.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
                    <span className="text-2xl">🔥</span>
                    <h2 className="font-display text-xl font-bold">Trò chơi đang HOT</h2>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-300 to-transparent rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {hotGames.map((g, index) => (
                    <GameCard
                      key={g.id}
                      game={g}
                      template={templates.find(t => t.id === g.template)}
                      onSelect={onSelectGame}
                      index={index}
                      badge={index === 0 ? "🥇 TOP 1" : index === 1 ? "🥈 TOP 2" : index === 2 ? "🥉 TOP 3" : null}
                      badgeColor={index === 0 ? "from-yellow-400 to-amber-500" : index === 1 ? "from-gray-300 to-gray-400" : index === 2 ? "from-orange-400 to-orange-500" : null}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section: Trò chơi mới */}
            {newGames.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-2xl">✨</span>
                    <h2 className="font-display text-xl font-bold">Trò chơi mới</h2>
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-teal-300 to-transparent rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {newGames.map((g, index) => (
                    <GameCard
                      key={g.id}
                      game={g}
                      template={templates.find(t => t.id === g.template)}
                      onSelect={onSelectGame}
                      index={index}
                      isNew
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section: Tất cả trò chơi */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <span className="text-2xl">🎮</span>
                  <h2 className="font-display text-xl font-bold">Tất cả trò chơi</h2>
                </div>
                <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-300 to-transparent rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {games.map((g, index) => (
                  <GameCard
                    key={g.id}
                    game={g}
                    template={templates.find(t => t.id === g.template)}
                    onSelect={onSelectGame}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-100 via-pink-100 to-cyan-100 border-t border-purple-200 py-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600">Made with 💜 for students</p>
          <a
            onClick={() => navigate("/admin")}
            href="#/admin"
            className="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold hover:text-purple-700 transition"
          >
            👨‍🏫 Giáo viên? Đăng nhập quản trị →
          </a>
        </div>
      </footer>

      {/* Modal nhập mã vé */}
      <EnterCodeModal open={showCodeModal} onClose={() => setShowCodeModal(false)} onFound={onSelectGame} />
    </div>
  );
}

// Component card game với animation đẹp mắt
function GameCard({ game, template, onSelect, index, badge, badgeColor, isNew }) {
  return (
    <button
      onClick={() => onSelect(game)}
      className="group relative bg-white rounded-3xl p-5 text-left shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Badge */}
      {badge && (
        <div className={`absolute -top-1 -right-1 bg-gradient-to-r ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 animate-bounce-slow`}>
          {badge}
        </div>
      )}
      {isNew && !badge && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">
          MỚI
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            <StampToken icon={template ? template.icon : "🎲"} ring={template ? template.ring : "#A855F7"} size={56} fontSize={26} />
          </div>
          <span className="font-mono text-xs text-gray-500 bg-gray-100 group-hover:bg-purple-100 rounded-full px-3 py-1.5 transition-colors">
            {game.code}
          </span>
        </div>

        <h3 className="font-display text-xl text-gray-800 leading-snug mb-2 group-hover:text-purple-700 transition-colors">
          {game.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 group-hover:text-gray-600">
          {game.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono mb-4">
          <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">{game.subject}</span>
          <span>•</span>
          <span className="bg-pink-50 text-pink-600 px-2 py-1 rounded-lg">{game.questionsCount} câu hỏi</span>
          <span>•</span>
          <span className="bg-cyan-50 text-cyan-600 px-2 py-1 rounded-lg">{game.playersCount} lượt chơi</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 group-hover:text-purple-700 group-hover:gap-3 transition-all">
            Chơi ngay <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
          <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🎮</span>
        </div>
      </div>

      {/* Sparkle effect on hover */}
      <div className="absolute top-2 left-2 text-xl opacity-0 group-hover:opacity-100 animate-sparkle transition-opacity">✨</div>
    </button>
  );
}
