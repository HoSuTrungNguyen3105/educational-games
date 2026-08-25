import { useCallback, useEffect, useState } from 'react'
import { gameProgressService, coinService } from '../../services/api.js'
import { getLevelProgress, getLevelTitle, getLevelEmoji } from '../../lib/utils.js'
import { PrimaryButton, Loader, ErrorState } from '../../components/ui.jsx'
import { navigate } from '../../lib/router.js'

/* eslint-disable react-hooks/set-state-in-effect */

const GAME_META = {
  "TOAN101": { name: "Ôn tập Toán lớp 3", icon: "\u{1F9EE}", color: "from-blue-400 to-indigo-500" },
  "VUTRU22": { name: "Khám phá vũ trụ", icon: "\u{1F30C}", color: "from-indigo-400 to-purple-600" },
  "TONGHOP9": { name: "Ôn tập kiến thức tổng hợp", icon: "\u{1F4DA}", color: "from-amber-400 to-orange-500" },
  "FAMILY07": { name: "Từ vựng tiếng Anh: Gia đình", icon: "\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}", color: "from-pink-400 to-rose-500" },
  "TRUNGTHU5": { name: "Trung Thu Vui Vẻ", icon: "\u{1F391}", color: "from-yellow-400 to-amber-500" },
  "DIALY88": { name: "Địa lý Việt Nam", icon: "\u{1F30D}", color: "from-green-400 to-emerald-500" },
  "CHUCAI3": { name: "Bảng chữ cái tiếng Việt", icon: "\u{1F4DD}", color: "from-cyan-400 to-blue-500" },
  "QUAYSO4": { name: "Vòng quay kiến thức lớp 4", icon: "\u{1F3B0}", color: "from-red-400 to-pink-500" },
  "ATGT202": { name: "Luật giao thông an toàn", icon: "\u{1F6A6}", color: "from-teal-400 to-cyan-500" },
  "DONGVAT6": { name: "Động vật hoang dã", icon: "\u{1F43E}", color: "from-lime-400 to-green-500" },
  "LICHSU19": { name: "Đua thuyền: Lịch sử Việt Nam", icon: "\u{1F6F6}", color: "from-blue-400 to-sky-500" },
  "MOITRUONG4": { name: "Phân loại rác thải", icon: "\u{267B}\uFE0F", color: "from-emerald-400 to-green-500" },
  "PHIEUL9": { name: "Đại Phiêu Lưu Toán Học", icon: "\u{1F9EE}", color: "from-purple-400 to-violet-500" },
  "HAMNGUC3": { name: "Hầm Ngục Kiến Thức", icon: "\u{1F3F0}", color: "from-slate-500 to-gray-700" },
  "NINJA77": { name: "Ninja Vượt Ải Từ Vựng", icon: "\u{1F977}", color: "from-gray-500 to-zinc-700" },
};

function getMeta(gameId) {
  return GAME_META[gameId] || { name: gameId, icon: "\u{1F3AE}", color: "from-gray-400 to-gray-500" };
}

export default function MyCoins({ userAuth, onBack }) {
  const [games, setGames] = useState(null);
  const [globalCoins, setGlobalCoins] = useState(0);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const load = useCallback(() => {
    setGames(null); setError(null);
    Promise.all([gameProgressService.listGames(), coinService.get()])
      .then(([g, c]) => { setGames(g); setGlobalCoins(c?.coins || 0); })
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
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">{"\u{1F4B0}"}</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem coin và tiến trình</p>
          <PrimaryButton onClick={onBack}>{"\u{2190}"} Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const lv = getLevelProgress(globalCoins);
  const totalPlays = (games || []).reduce((s, g) => s + (g.gamesPlayed || 0), 0);

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        {"\u{2190}"} Về trang chủ
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl text-ink">{"\u{1F4B0}"} Coin & Hạng</h1>
        <p className="text-sm text-[#8A7C63] mt-1">Tích lũy coin để thăng hạng và chơi game</p>
      </div>

      {/* Tổng quan */}
      <div className="note-card p-5 sm:p-6 mb-6 bg-gradient-to-r from-gold/10 to-yellow-50 border border-gold/20">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-5xl mb-1">{getLevelEmoji(lv.level)}</div>
            <div className="font-display text-3xl text-ink">{lv.level}</div>
            <div className="text-xs font-mono text-gold font-bold uppercase">{getLevelTitle(lv.level)}</div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-body text-ink font-semibold">{"\u{1F4B0}"} {globalCoins.toLocaleString()} Coin</span>
              <span className="text-xs font-mono text-[#8A7C63]">
                {lv.percent}% → Level {lv.level + 1}
              </span>
            </div>
            <div className="h-3 bg-ink/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold to-yellow-300 rounded-full transition-all duration-700"
                style={{ width: lv.percent + "%" }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-mono text-[#8A7C63]">{lv.current} coin</span>
              <span className="text-[10px] font-mono text-[#8A7C63]">{lv.next} coin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="note-card p-4 sm:p-5 text-center">
          <div className="text-3xl mb-2">{"\u{1F3AE}"}</div>
          <div className="font-display text-2xl sm:text-3xl text-teal">{totalPlays}</div>
          <div className="text-[10px] sm:text-xs text-[#8A7C63] font-mono uppercase mt-1">Tổng lượt chơi</div>
        </div>
        <div className="note-card p-4 sm:p-5 text-center">
          <div className="text-3xl mb-2">{"\u{1F4DA}"}</div>
          <div className="font-display text-2xl sm:text-3xl text-ink">{(games || []).length}</div>
          <div className="text-[10px] sm:text-xs text-[#8A7C63] font-mono uppercase mt-1">Game đã chơi</div>
        </div>
      </div>

      {error && <ErrorState subtitle={error} onRetry={load} />}
      {!error && games === null && <Loader label="Đang tải..." />}

      {!error && games && games.length === 0 && (
        <div className="note-card p-8 text-center">
          <div className="text-5xl mb-3">{"\u{1F3B2}"}</div>
          <h3 className="font-display text-lg text-ink mb-2">Chưa có game nào</h3>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn chưa chơi game nào. Hãy bắt đầu chơi để tích lũy coin!</p>
          <PrimaryButton onClick={() => navigate("/")}>{"\u{1F3AE}"} Chơi game ngay</PrimaryButton>
        </div>
      )}

      {!error && games && games.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg text-ink">Tiến trình từng game</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {games.map(g => {
              const meta = getMeta(g.gameId);
              const isActive = selectedGame === g.gameId;
              return (
                <button key={g.gameId} onClick={() => loadDetail(g.gameId)}
                  className={`note-card p-4 sm:p-5 text-left transition hover:-translate-y-0.5 ${isActive ? "ring-2 ring-ticket shadow-lg" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl text-white shadow-md shrink-0`}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base sm:text-lg text-ink truncate">{meta.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-[#8A7C63]">
                        <span>Lv.{g.level || 1}</span>
                        <span>{g.experience || 0} XP</span>
                        <span>{g.gamesPlayed || 0} lượt</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-ink/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: Math.min(100, g.progress || 0) + "%" }} />
                      </div>
                      <p className="text-[10px] text-[#8A7C63] font-mono mt-1">{g.progress || 0}% hoàn thành</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedGame && (
            <div className="note-card p-5 sm:p-6 anim-pop">
              {loadingDetail ? (
                <Loader label="Đang tải chi tiết..." />
              ) : detail ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getMeta(detail.gameId).color} flex items-center justify-center text-xl text-white`}>
                      {getMeta(detail.gameId).icon}
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-ink">{getMeta(detail.gameId).name}</h3>
                      <p className="text-xs text-[#8A7C63] font-mono">Chi tiết tiến trình</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Level", value: detail.level || 1, icon: "\u{2B50}", color: "text-ink" },
                      { label: "Experience", value: (detail.experience || 0).toLocaleString(), icon: "\u{2728}", color: "text-purple-500" },
                      { label: "Lượt chơi", value: detail.gamesPlayed || 0, icon: "\u{1F3AE}", color: "text-teal" },
                      { label: "Nhiệm vụ", value: detail.questsCompleted || 0, icon: "\u{1F4CB}", color: "text-ticket" },
                      { label: "Tiến trình", value: (detail.progress || 0) + "%", icon: "\u{1F4C8}", color: "text-blue-500" },
                    ].map(s => (
                      <div key={s.label} className="bg-paper2 rounded-xl p-3 text-center">
                        <div className="text-lg mb-0.5">{s.icon}</div>
                        <div className={`font-display text-lg ${s.color}`}>{s.value}</div>
                        <div className="text-[9px] font-mono text-[#8A7C63] uppercase">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {detail.inventory && detail.inventory.length > 0 && (
                    <div>
                      <h4 className="text-sm font-display text-ink mb-2">{"\u{1F392}"} Vật phẩm</h4>
                      <div className="flex flex-wrap gap-2">
                        {detail.inventory.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1 bg-paper2 rounded-lg px-3 py-1.5 text-xs font-mono text-ink">
                            {item.itemId} x {item.quantity}
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
