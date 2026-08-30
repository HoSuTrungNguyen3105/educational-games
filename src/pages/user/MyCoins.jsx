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
  "TOAN101": { name: "\u00D4n t\u1EADp To\u00E1n l\u1EDBp 3", icon: "\u{1F9EE}", color: "from-blue-400 to-indigo-500", bg: "bg-blue-500" },
  "VUTRU22": { name: "Kh\u00E1m ph\u00E1 v\u0169 tr\u1EE5", icon: "\u{1F30C}", color: "from-indigo-400 to-purple-600", bg: "bg-indigo-500" },
  "TONGHOP9": { name: "\u00D4n t\u1EADp ki\u1EBFn th\u1EE9c t\u1ED5ng h\u1EE3p", icon: "\u{1F4DA}", color: "from-amber-400 to-orange-500", bg: "bg-amber-500" },
  "FAMILY07": { name: "T\u1EEB v\u1EF1ng ti\u1EBFng Anh: Gia \u0111\u00ECnh", icon: "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}", color: "from-pink-400 to-rose-500", bg: "bg-pink-500" },
  "TRUNGTHU5": { name: "Trung Thu Vui V\u1EBB", icon: "\u{1F391}", color: "from-yellow-400 to-amber-500", bg: "bg-yellow-500" },
  "DIALY88": { name: "\u0110\u1ECBa l\u00FD Vi\u1EC7t Nam", icon: "\u{1F30D}", color: "from-green-400 to-emerald-500", bg: "bg-green-500" },
  "CHUCAI3": { name: "B\u1EA3ng ch\u1EEF c\u00E1i ti\u1EBFng Vi\u1EC7t", icon: "\u{1F4DD}", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-500" },
  "QUAYSO4": { name: "V\u00F2ng quay ki\u1EBFn th\u1EE9c l\u1EDBp 4", icon: "\u{1F3B0}", color: "from-red-400 to-pink-500", bg: "bg-red-500" },
  "ATGT202": { name: "Lu\u1EADt giao th\u00F4ng an to\u00E0n", icon: "\u{1F6A6}", color: "from-teal-400 to-cyan-500", bg: "bg-teal-500" },
  "DONGVAT6": { name: "\u0110\u1ED9ng v\u1EADt hoang d\u00E3", icon: "\u{1F43E}", color: "from-lime-400 to-green-500", bg: "bg-lime-500" },
  "LICHSU19": { name: "\u0110ua thuy\u1EC1n: L\u1ECBch s\u1EED Vi\u1EC7t Nam", icon: "\u{1F6F6}", color: "from-blue-400 to-sky-500", bg: "bg-sky-500" },
  "MOITRUONG4": { name: "Ph\u00E2n lo\u1EA1i r\u00E1c th\u1EA3i", icon: "\u{267B}\uFE0F", color: "from-emerald-400 to-green-500", bg: "bg-emerald-500" },
  "PHIEUL9": { name: "\u0110\u1EA1i Phi\u00EAu L\u01B0u To\u00E1n H\u1ECDc", icon: "\u{1F9EE}", color: "from-purple-400 to-violet-500", bg: "bg-purple-500" },
  "HAMNGUC3": { name: "H\u1EA7m Ng\u1EE5c Ki\u1EBFn Th\u1EE9c", icon: "\u{1F3F0}", color: "from-slate-500 to-gray-700", bg: "bg-slate-600" },
  "NINJA77": { name: "Ninja V\u01B0\u1EE3t \u1EA2i T\u1EEB V\u1EF1ng", icon: "\u{1F977}", color: "from-gray-500 to-zinc-700", bg: "bg-gray-600" },
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
      .catch(e => setError(e.message || "L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u"));
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
          <h2 className="font-display text-xl text-ink mb-2">Ch\u01B0a \u0111\u0103ng nh\u1EADp</h2>
          <p className="text-sm text-stone-500 mb-5">B\u1EA1n c\u1EA7n \u0111\u0103ng nh\u1EADp \u0111\u1EC3 xem coin v\u00E0 ti\u1EBFn tr\u00ECnh</p>
          <PrimaryButton onClick={onBack} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> V\u1EC1 trang ch\u1EE7
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
        V\u1EC1 trang ch\u1EE7
      </button>

      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-300 text-white shadow-md">
            <Coins className="w-5 h-5" />
          </span>
          Coin & H\u1EA1ng
        </h1>
        <p className="text-sm text-stone-500 mt-2 ml-13">T\u00EDch l\u0169y coin \u0111\u1EC3 th\u0103ng h\u1EA1ng v\u00E0 m\u1EDF kh\u00F3a n\u1ED9i dung m\u1EDBi</p>
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
          { label: "T\u1ED5ng l\u01B0\u1EE3t ch\u01A1i", value: totalPlays, icon: Gamepad2, color: "text-teal-600", bg: "bg-teal-50", ring: "ring-teal-200" },
          { label: "Game \u0111\u00E3 ch\u01A1i", value: (games || []).length, icon: Layers, color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-200" },
          { label: "Sao t\u1ED5ng c\u1ECDng", value: globalStars, icon: Star, color: "text-amber-500", bg: "bg-amber-50", ring: "ring-amber-200" },
          { label: "T\u1ED5ng coin", value: globalCoins, icon: Coins, color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200" },
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
          <span className="text-sm">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u...</span>
        </div>
      )}

      {!error && games && games.length === 0 && (
        <div className="bg-white rounded-3xl border border-stone-100 p-10 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center mx-auto mb-4 ring-1 ring-purple-200">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="font-display text-lg text-stone-800 mb-2">Ch\u01B0a c\u00F3 game n\u00E0o</h3>
          <p className="text-sm text-stone-400 mb-5 max-w-xs mx-auto">B\u1EA1n ch\u01B0a ch\u01A1i game n\u00E0o. H\u00E3y b\u1EAFt \u0111\u1EA7u ch\u01A1i \u0111\u1EC3 t\u00EDch l\u0169y coin v\u00E0 n\u00E2ng c\u1EA5p nh\u00E2n v\u1EADt!</p>
          <PrimaryButton onClick={() => navigate("/")} className="gap-2">
            <Play className="w-4 h-4" /> Ch\u01A1i game ngay
          </PrimaryButton>
        </div>
      )}

      {!error && games && games.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-stone-700" />
            <h2 className="font-display text-lg text-stone-800">Ti\u1EBFn tr\u00ECnh t\u1EEBng game</h2>
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
                  <span className="text-sm">\u0110ang t\u1EA3i chi ti\u1EBFt...</span>
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
                          <Target className="w-3 h-3" /> {detail.progress || 0}% ho\u00E0n th\u00E0nh
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Level", value: detail.level || 1, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Kinh nghi\u1EC7m", value: (detail.experience || 0).toLocaleString(), icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
                      { label: "L\u01B0\u1EE3t ch\u01A1i", value: detail.gamesPlayed || 0, icon: Gamepad2, color: "text-teal-600", bg: "bg-teal-50" },
                      { label: "Nhi\u1EC7m v\u1EE5", value: detail.questsCompleted || 0, icon: Target, color: "text-rose-600", bg: "bg-rose-50" },
                      { label: "Ti\u1EBFn tr\u00ECnh", value: (detail.progress || 0) + "%", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Th\u00E0nh t\u00EDch", value: detail.level > 1 ? "T\u1ED1t" : "M\u1EDBi", icon: Trophy, color: "text-amber-700", bg: "bg-amber-50" },
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
                        <h4 className="text-sm font-display text-stone-800">V\u1EADt ph\u1EA9m \u0111\u00E3 s\u01B0u t\u1EA7m</h4>
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
