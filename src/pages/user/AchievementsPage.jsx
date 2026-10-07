import { useEffect, useState, useCallback } from "react";
import { Trophy } from "lucide-react";
import {
  coinService,
  xpService,
  gameProgressService,
  dailyTaskService,
} from "../../services/api.js";
import { ACHIEVEMENT_DEFS, evaluateAchievements } from "../../data/achievements.js";
import { PrimaryButton, Loader, ErrorState } from "../../components/ui.jsx";

function asNumber(v) {
  if (typeof v === "number") return v;
  return Number(v?.xp ?? v?.totalXp ?? v?.total ?? v?.coins ?? 0) || 0;
}

export default function AchievementsPage({ userAuth, onBack }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [coinRes, xpRes, games, tasks] = await Promise.all([
        coinService.get().catch(() => null),
        xpService.get().catch(() => null),
        gameProgressService.listGames().catch(() => []),
        dailyTaskService.list().catch(() => []),
      ]);
      const stats = {
        coins: asNumber(coinRes) || Number(userAuth?.user?.coins) || 0,
        xp: asNumber(xpRes),
        games: Array.isArray(games) ? games.length : 0,
        tasks: Array.isArray(tasks) ? tasks.filter((t) => t.claimed).length : 0,
      };
      setItems(evaluateAchievements(ACHIEVEMENT_DEFS, stats));
    } catch (e) {
      setError(e?.message || "Không tải được thành tựu");
      setItems([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để xem thành tựu</p>
          <PrimaryButton onClick={onBack}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  const unlockedCount = items ? items.filter((a) => a.unlocked).length : 0;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full">
      <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink transition inline-flex items-center gap-1 mb-6">
        ← Về trang chủ
      </button>

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" /> Thành tựu
          </h1>
          <p className="text-sm text-[#8A7C63] mt-1">
            {items === null ? "Đang tải..." : `Đã đạt ${unlockedCount}/${items.length} thành tựu`}
          </p>
        </div>
      </div>

      {items === null ? (
        <div className="flex justify-center py-10"><Loader label="Đang tải thành tựu..." /></div>
      ) : error ? (
        <ErrorState title="Không tải được thành tựu" subtitle={error} onRetry={load} />
      ) : (
        <>
          {unlockedCount > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span>Tiến trình chung</span>
                <span>{Math.round((unlockedCount / items.length) * 100)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                  style={{ width: `${(unlockedCount / items.length) * 100}%` }}
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((a) => (
              <div
                key={a.id}
                className={`nb-card p-4 flex items-start gap-3 ${a.unlocked ? "" : "opacity-90"}`}
              >
                <span
                  className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                    a.unlocked
                      ? "bg-gradient-to-br from-amber-300 to-orange-400"
                      : "bg-slate-100 grayscale"
                  }`}
                >
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-ink text-sm">{a.title}</p>
                    {a.unlocked ? (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                        ✓ Đã đạt
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold text-amber-700 whitespace-nowrap">
                        🪙 +{a.reward}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8A7C63] mt-0.5">{a.desc}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          a.unlocked
                            ? "bg-gradient-to-r from-amber-400 to-orange-500"
                            : "bg-gradient-to-r from-emerald-400 to-green-500"
                        }`}
                        style={{ width: `${Math.round((a.progress / a.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                      {a.progress.toLocaleString()}/{a.target.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#8A7C63] mt-6 text-center">
            Tiến trình thành tựu được tính từ dữ liệu thật: số xu, XP, số trò chơi đã chơi và nhiệm vụ đã hoàn thành.
          </p>
        </>
      )}
    </div>
  );
}
