import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Coins,
  Crown,
  Gamepad2,
  BookOpen,
  Trophy,
  Star,
  Zap,
  Swords,
  Package,
  BarChart3,
  ChevronRight,
  Medal,
  Gem,
  TrendingUp,
  Loader2,
  AlertCircle,
  Play,
  Layers,
  Target,
  Sparkles,
  Activity,
  ChevronLeft,
  Shield,
  Flame,
  Compass
} from 'lucide-react'
import { gameProgressService, coinService, starService } from '../../services/api.js'
import { getLevelProgress, getLevelTitle, getLevelEmoji } from '../../lib/utils.js'
import { PrimaryButton, Loader, ErrorState } from '../../components/ui.jsx'
import { navigate } from '../../lib/router.js'

/* eslint-disable react-hooks/set-state-in-effect */

const GAME_META = {
  "TOAN101": { name: "Ôn tập Toán lớp 3", icon: "🧮", color: "from-blue-400 to-indigo-500", bg: "bg-blue-500" },
  "VUTRU22": { name: "Khám phá vũ trụ", icon: "🌌", color: "from-indigo-400 to-purple-600", bg: "bg-indigo-500" },
  "TONGHOP9": { name: "Ôn tập kiến thức tổng hợp", icon: "📚", color: "from-amber-400 to-orange-500", bg: "bg-amber-500" },
  "FAMILY07": { name: "Từ vựng tiếng Anh: Gia đình", icon: "👨‍👩‍👧‍👦", color: "from-pink-400 to-rose-500", bg: "bg-pink-500" },
  "TRUNGTHU5": { name: "Trung Thu Vui Vẻ", icon: "🏮", color: "from-yellow-400 to-amber-500", bg: "bg-yellow-500" },
  "DIALY88": { name: "Địa lý Việt Nam", icon: "🌍", color: "from-green-400 to-emerald-500", bg: "bg-green-500" },
  "CHUCAI3": { name: "Bảng chữ cái tiếng Việt", icon: "📝", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-500" },
  "QUAYSO4": { name: "Vòng quay kiến thức lớp 4", icon: "🎰", color: "from-red-400 to-pink-500", bg: "bg-red-500" },
  "ATGT202": { name: "Luật giao thông an toàn", icon: "🚦", color: "from-teal-400 to-cyan-500", bg: "bg-teal-500" },
  "DONGVAT6": { name: "Động vật hoang dã", icon: "🐾", color: "from-lime-400 to-green-500", bg: "bg-lime-500" },
  "LICHSU19": { name: "Đua thuyền: Lịch sử Việt Nam", icon: "🛶", color: "from-blue-400 to-sky-500", bg: "bg-sky-500" },
  "MOITRUONG4": { name: "Phân loại rác thải", icon: "♻️", color: "from-emerald-400 to-green-500", bg: "bg-emerald-500" },
  "PHIEUL9": { name: "Đại Phiêu Lưu Toán Học", icon: "🧮", color: "from-purple-400 to-violet-500", bg: "bg-purple-500" },
  "HAMNGUC3": { name: "Hầm Ngục Kiến Thức", icon: "🏰", color: "from-slate-500 to-gray-700", bg: "bg-slate-600" },
  "NINJA77": { name: "Ninja Vượt Ải Từ Vựng", icon: "🥷", color: "from-gray-500 to-zinc-700", bg: "bg-gray-600" },
};

function getMeta(gameId) {
  return GAME_META[gameId] || { name: gameId, icon: "\u{1F3AE}", color: "from-gray-400 to-gray-500", bg: "bg-gray-500" };
}

export default function MyCoins({ userAuth, onBack }) {
  const [games, setGames] = useState(null);
  const [globalCoins, setGlobalCoins] = useState(0);
  const [globalStars, setGlobalStars] = useState(0);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const load = useCallback(() => {
    setGames(null); setError(null);
    Promise.all([gameProgressService.listGames(), coinService.get(), starService.get()])
      .then(([g, c, s]) => { setGames(g); setGlobalCoins(c?.coins || 0); setGlobalStars(s?.stars || 0); })
      .catch(e => setError(e.message || "Lỗi tải dữ liệu"));
  }, []);
  useEffect(() => { load(); }, [load]);

  const loadDetail = async (gameId) => {
    setSelectedGame(gameId);
    setDetail(null);
    setLoadingDetail(true);
    try {
      const d = await gameProgressService.getGame(gameId);
      setDetail(d);
    } catch {
      setDetail({ gameId, level: 1, experience: 0, progress: 0, gamesPlayed: 0, questsCompleted: 0, inventory: [] });
    } finally {
      setLoadingDetail(false);
    }
  };

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center mx-auto mb-5 ring-1 ring-amber-200 shadow-lg">
            <Coins className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-stone-500 mb-5">Bạn cần đăng nhập để xem coin và tiến trình</p>
          <PrimaryButton onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Về trang chủ
          </PrimaryButton>
        </div>
      </div>
    );
  }

  const lv = getLevelProgress(globalCoins);
  const totalPlays = (games || []).reduce((s, g) => s + (g.gamesPlayed || 0), 0);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto w-full">
      {/* Header */}
      <button
        onClick={onBack}
        className="group text-sm text-stone-500 hover:text-ink transition inline-flex items-center gap-2 mb-6 hover:bg-white/60 rounded-full px-3 py-1.5 -ml-3"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Về trang chủ
      </button>

      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-300 text-white shadow-md">
            <Coins className="w-5 h-5" />
          </span>
          Coin & Hạng
        </h1>
        <p className="text-sm text-stone-500 mt-2 ml-13">Tích lũy coin để thăng hạng và mở khóa nội dung mới</p>
      </div>

      {/* Hero Rank Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 text-white p-6 sm:p-8 mb-8 shadow-xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Level Circle */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <div className="text-center">
                <Crown className="w-6 h-6 text-amber-400 mx-auto mb-0.5" />
                <div className="font-display text-3xl leading-none">{lv.level}</div>
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              {getLevelTitle(lv.level)}
            </div>
          </div>

          {/* Progress */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-lg">{globalCoins.toLocaleString()}</span>
                <span className="text-white/50 text-sm">coin</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-white/70">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>{lv.percent}%</span>
                <span className="text-white/40">&rarr; Lv.{lv.level + 1}</span>
              </div>
            </div>
            <div className="h-3 bg-black/30 rounded-full overflow-hidden ring-1 ring-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 transition-all duration-1000 ease-out relative"
                style={{ width: lv.percent + "%" }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-white/40 font-mono">
              <span>{lv.current.toLocaleString()}</span>
              <span>{lv.next.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Tổng lượt chơi", value: totalPlays, icon: Gamepad2, color: "text-teal-600", bg: "bg-teal-50", ring: "ring-teal-200" },
          { label: "Game đã chơi", value: (games || []).length, icon: Layers, color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-200" },
          { label: "Sao tổng cộng", value: globalStars, icon: Star, color: "text-amber-500", bg: "bg-amber-50", ring: "ring-amber-200" },
          { label: "Tổng coin", value: globalCoins, icon: Coins, color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-4 text-center hover:-translate-y-0.5 transition-transform duration-200 shadow-sm hover:shadow-md">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mx-auto mb-2 ring-1 ${s.ring}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="font-display text-2xl text-stone-800">{s.value.toLocaleString()}</div>
            <div className="text-[10px] sm:text-xs text-stone-400 font-mono uppercase mt-1 tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      {error && <ErrorState subtitle={error} onRetry={load} />}
      {!error && games === null && (
        <div className="flex items-center justify-center py-16 text-stone-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      )}

      {!error && games && games.length === 0 && (
        <div className="bg-white rounded-3xl border border-stone-100 p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center mx-auto mb-4 ring-1 ring-purple-200">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="font-display text-lg text-stone-800 mb-2">Chưa có game nào</h3>
          <p className="text-sm text-stone-400 mb-5 max-w-xs mx-auto">Bạn chưa chơi game nào. Hãy bắt đầu chơi để tích lũy coin và nâng cấp nhân vật!</p>
          <PrimaryButton onClick={() => navigate("/")} className="gap-2">
            <Play className="w-4 h-4" /> Chơi game ngay
          </PrimaryButton>
        </div>
      )}

      {!error && games && games.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-stone-700" />
            <h2 className="font-display text-lg text-stone-800">Tiến trình từng game</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {games.map(g => {
              const meta = getMeta(g.gameId);
              const isActive = selectedGame === g.gameId;
              return (
                <button
                  key={g.gameId}
                  onClick={() => loadDetail(g.gameId)}
                  className={`group text-left rounded-2xl border transition-all duration-200 p-4 sm:p-5
                    ${isActive
                      ? "bg-white border-amber-300 shadow-lg ring-1 ring-amber-200"
                      : "bg-white/80 border-transparent hover:bg-white hover:shadow-md hover:border-amber-200/50"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl text-white shadow-lg shrink-0 ring-1 ring-black/5 group-hover:scale-105 transition-transform`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base sm:text-lg text-stone-800 truncate pr-2">{meta.name}</h3>
                      <div className="flex items-center gap-2 mt-2 text-xs font-mono text-stone-400">
                        <span className="inline-flex items-center gap-1 bg-stone-100 rounded-lg px-2 py-0.5">
                          <Medal className="w-3 h-3" /> Lv.{g.level || 1}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-stone-100 rounded-lg px-2 py-0.5">
                          <Sparkles className="w-3 h-3" /> {g.experience || 0} XP
                        </span>
                        <span className="inline-flex items-center gap-1 bg-stone-100 rounded-lg px-2 py-0.5">
                          <Gamepad2 className="w-3 h-3" /> {g.gamesPlayed || 0}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-violet-500 transition-all duration-700"
                            style={{ width: Math.min(100, g.progress || 0) + "%" }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0">{g.progress || 0}%</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-stone-300 shrink-0 transition-transform ${isActive ? "rotate-90 text-amber-500" : "group-hover:translate-x-0.5"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selectedGame && (
            <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-lg animate-in slide-in-from-bottom-4 duration-300">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-12 text-stone-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span className="text-sm">Đang tải chi tiết...</span>
                </div>
              ) : detail ? (
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Detail Header */}
                  <div className="flex items-center gap-4 pb-5 border-b border-stone-100">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getMeta(detail.gameId).color} flex items-center justify-center text-2xl text-white shadow-md`}>
                      {getMeta(detail.gameId).icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl text-stone-800">{getMeta(detail.gameId).name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-stone-400 bg-stone-100 rounded-lg px-2 py-0.5">
                          <Target className="w-3 h-3" /> {detail.progress || 0}% hoàn thành
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Level", value: detail.level || 1, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Kinh nghiệm", value: (detail.experience || 0).toLocaleString(), icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
                      { label: "Lượt chơi", value: detail.gamesPlayed || 0, icon: Gamepad2, color: "text-teal-600", bg: "bg-teal-50" },
                      { label: "Nhiệm vụ", value: detail.questsCompleted || 0, icon: Target, color: "text-rose-600", bg: "bg-rose-50" },
                      { label: "Tiến trình", value: (detail.progress || 0) + "%", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Thành tích", value: detail.level > 1 ? "Tốt" : "Mới", icon: Trophy, color: "text-amber-700", bg: "bg-amber-50" },
                    ].map((s, i) => (
                      <div key={i} className="rounded-xl bg-stone-50 p-3.5 flex items-center gap-3 hover:bg-stone-100 transition-colors">
                        <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-display text-lg text-stone-800 leading-tight">{s.value}</div>
                          <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wide">{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inventory */}
                  {detail.inventory && detail.inventory.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-stone-700" />
                        <h4 className="text-sm font-display text-stone-800">Vật phẩm đã sưu tầm</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {detail.inventory.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-700 shadow-sm hover:border-purple-300 transition-colors">
                            <Gem className="w-3.5 h-3.5 text-purple-500" />
                            {item.itemId}
                            <span className="bg-stone-100 rounded-md px-1.5 py-0.5 text-[10px]">x{item.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}