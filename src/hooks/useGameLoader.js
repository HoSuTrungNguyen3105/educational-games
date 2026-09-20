import { useEffect, useRef, useState, useCallback } from "react";
import { gameService } from "../services/api.js";
import { navigate } from "../lib/router.js";

/**
 * Quản lý tải game cho màn hình chơi (/play/:gameId).
 * - pendingGameRef: game được chọn từ Home, không cần fetch lại
 * - coopSessionRef: coop session data (sessionId, opponent, gameCode)
 * - AbortController: hủy request khi route thay đổi
 */
export function useGameLoader(route) {
  const [playGame, setPlayGame] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const pendingGameRef = useRef(null);
  const coopSessionRef = useRef(null);
  const abortRef = useRef(null);

  // Chọn game từ Home → cache vào pendingGameRef, chuyển route
  const selectGame = useCallback((g, coopData) => {
    pendingGameRef.current = g;
    coopSessionRef.current = coopData || null;
    const gid = g._id?.toString() || g.id;
    navigate(`/play/${gid}`);
  }, []);

  // Load game khi route thay đổi
  useEffect(() => {
    if (route.name !== "student" || !route.params.gameId) {
      setPlayGame(null);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const gameId = route.params.gameId;
    const pending = pendingGameRef.current;

    if (pending && String(pending._id?.toString() || pending.id) === String(gameId)) {
      pendingGameRef.current = null;
      setPlayGame(pending);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoadingGame(true);
    gameService
      .get(gameId)
      .then((g) => {
        if (!controller.signal.aborted) setPlayGame(g);
      })
      .catch(() => {
        if (!controller.signal.aborted) setPlayGame(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingGame(false);
      });

    return () => {
      controller.abort();
    };
  }, [route.name, route.params.gameId]);

  const coopSession = coopSessionRef.current;
  coopSessionRef.current = null;

  return { playGame, loadingGame, selectGame, coopSession };
}
