import { useEffect, useRef, useCallback } from "react";
import { API_BASE, coinService } from "../services/api.js";

/**
 * HtmlGameLoader - Renders a self-contained HTML game in an iframe.
 * Communication via postMessage:
 *
 * React → iframe: { type: "init", data: { gameId, playerName, questions, apiBase, userCoins, authToken } }
 * iframe → React: { type: "game-over", data: { score, timeUsed } }
 * iframe → React: { type: "quit" }
 */
export default function HtmlGameLoader({ htmlContent, game, questions, players, playerName, playMode, onFinish, onQuit, onStateUpdate, userAuth }) {
  const iframeRef = useRef(null);

  const handleInit = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const playerNames = (players || []).map(p => (typeof p === "string" ? p : p?.name)).filter(Boolean);

    let userCoins = 0;
    let authToken = null;
    try {
      if (userAuth?.token) {
        authToken = userAuth.token;
        const coinData = await coinService.get();
        userCoins = coinData?.coins || 0;
      }
    } catch { /* ignore */ }

    iframe.contentWindow.postMessage(
      {
        type: "init",
        data: {
          gameId: game?.id,
          playerName: playerName || "Player",
          players: playerNames,
          questions: questions || [],
          apiBase: API_BASE,
          playMode: playMode || "solo",
          questionsTotal: questions?.length || 0,
          userCoins,
          authToken,
        }
      },
      "*"
    );
  }, [game?.id, playerName, questions, players, playMode, userAuth]);

  useEffect(() => {
    const onMessage = (e) => {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "ready") {
        handleInit();
      } else if (msg.type === "game-over") {
        onFinish?.({
          score: msg.data?.score || 0,
          correct: msg.data?.correct ?? 0,
          totalQuestions: msg.data?.totalQuestions ?? 0,
          timeUsed: msg.data?.timeUsed || 0,
        });
      } else if (msg.type === "state-update") {
        onStateUpdate?.(msg.data);
      } else if (msg.type === "quit") {
        onQuit?.();
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [handleInit, onFinish, onQuit, onStateUpdate]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {};
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [htmlContent]);

  if (!htmlContent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper">
        <p className="text-sm text-[#8A7C63]">Đang tải game...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-paper min-h-0">
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full border-0"
        title={game?.title || "Game"}
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
