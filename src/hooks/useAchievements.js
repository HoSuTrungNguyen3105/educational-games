import { useEffect, useState, useCallback } from "react";
import {
  walletService,
  xpService,
  gameProgressService,
  dailyTaskService,
} from "../services/api.js";
import { ACHIEVEMENT_DEFS, evaluateAchievements } from "../data/achievements.js";

function asNumber(v) {
  if (typeof v === "number") return v;
  return Number(v?.xp ?? v?.totalXp ?? v?.total ?? v?.coins ?? 0) || 0;
}

/**
 * useAchievements — Tải và tính thành tựu thật của người dùng đang đăng nhập
 * từ 4 nguồn số liệu: ví (xu), XP, số trò chơi đã chơi, nhiệm vụ đã hoàn thành
 * trong ngày. Dùng chung cho trang Thành tựu và khối thành tựu ở trang chủ.
 * Trả { items, error, reload }:
 *   - items = null: chưa tải/đang tải; []: chưa đăng nhập hoặc lỗi tải.
 *   - options.enabled = false để hoãn tải (vd chỉ tải khi mở sheet hồ sơ).
 */
export default function useAchievements(userAuth, { enabled = true } = {}) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const hasUser = !!userAuth?.user;
  const fallbackCoins = userAuth?.user?.coins;

  const load = useCallback(async () => {
    if (!hasUser) {
      setItems([]);
      return;
    }
    setError(null);
    try {
      const [coinRes, xpRes, games, tasks] = await Promise.all([
        walletService.get().catch(() => null),
        xpService.get().catch(() => null),
        gameProgressService.listGames().catch(() => []),
        dailyTaskService.list().catch(() => []),
      ]);
      const stats = {
        coins: asNumber(coinRes) || Number(fallbackCoins) || 0,
        xp: asNumber(xpRes),
        games: Array.isArray(games) ? games.length : 0,
        tasks: Array.isArray(tasks) ? tasks.filter((t) => t.claimed).length : 0,
      };
      setItems(evaluateAchievements(ACHIEVEMENT_DEFS, stats));
    } catch (e) {
      setError(e?.message || "Không tải được thành tựu");
      setItems([]);
    }
  }, [hasUser, fallbackCoins]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { items, error, reload: load };
}
