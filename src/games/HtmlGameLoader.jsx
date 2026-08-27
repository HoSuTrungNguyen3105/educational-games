import { useEffect, useRef, useCallback } from "react";
import { API_BASE, coinService, userService } from "../services/api.js";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";

/**
 * HtmlGameLoader - Renders a self-contained HTML game in an iframe.
 * Communication via postMessage:
 *
 * React → iframe: { type: "init", data: { gameId, playerName, questions, apiBase, userCoins, authToken } }
 * React → iframe: { type: "opponent-move", data: { row, col, player } }
 * React → iframe: { type: "invite-accepted", data: { playerName } }
 * React → iframe: { type: "multiplayer-start", data: { opponent } }
 *
 * iframe → React: { type: "ready" }
 * iframe → React: { type: "bridge-ready" }
 * iframe → React: { type: "mode-selected", data: { mode } }
 * iframe → React: { type: "search-user", data: { query } }
 * iframe → React: { type: "invite-user", data: { toUserId, gameId, gameName, gameCode } }
 * iframe → React: { type: "game-move", data: { row, col, player } }
 * iframe → React: { type: "game-over", data: { score, timeUsed, coinReward } }
 * iframe → React: { type: "state-update", data: { coins, type, ... } }
 * iframe → React: { type: "quit" }
 */
export default function HtmlGameLoader({
  htmlContent, game, questions, players, playerName,
  playMode, onFinish, onQuit, onStateUpdate, userAuth
}) {
  const iframeRef = useRef(null);

  // Ensure socket is connected on mount
  useEffect(() => {
    if (!socket.connected && userAuth?.token) {
      socket.auth = { token: userAuth.token };
      socket.connect();
    }
  }, []);

  const handleInit = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const playerNames = (players || []).map(p => (typeof p === "string" ? p : p?.name)).filter(Boolean);

    let userCoins = 0;
    let authToken = null;
    let userId = null;
    try {
      if (userAuth?.token) {
        authToken = userAuth.token;
        userId = userAuth.user?.id;
        const coinData = await coinService.get();
        userCoins = coinData?.coins || 0;
      }
    } catch { /* ignore */ }

    iframe.contentWindow.postMessage(
      {
        type: "init",
        data: {
          gameId: game?.id || game?._id?.toString(),
          playerName: playerName || "Player",
          players: playerNames,
          questions: questions || [],
          apiBase: API_BASE,
          playMode: playMode || "solo",
          questionsTotal: questions?.length || 0,
          userCoins,
          authToken,
          userId,
          gameName: game?.name || "Trò chơi",
          gameCode: game?.code || "",
        }
      },
      "*"
    );
  }, [game, playerName, questions, players, playMode, userAuth]);

  // Send message to iframe
  const postToIframe = useCallback((msg) => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(msg, "*");
    }
  }, []);

  // Handle user search request from iframe
  const handleSearchUser = useCallback(async (query) => {
    try {
      const results = await userService.search(query);
      postToIframe({ type: "search-results", data: { users: results || [] } });
    } catch (e) {
      console.error("[HtmlGameLoader] Search error:", e);
      postToIframe({ type: "search-results", data: { users: [] } });
    }
  }, [postToIframe]);

  // Handle invite user request from iframe
  const handleInviteUser = useCallback((data) => {
    const { toUserId, gameId, gameName, gameCode } = data;
    socket.emit(SOCKET_EVENTS.GAME_INVITE_SEND, {
      toUserId,
      gameId: gameId || game?.id || game?._id?.toString(),
      gameName: gameName || game?.name,
      gameCode: gameCode || game?.code,
    });
    postToIframe({ type: "invite-sent", data: { ok: true, toUserId } });
  }, [game, postToIframe]);

  // Handle game move from iframe (forward to socket)
  const handleGameMove = useCallback((data) => {
    socket.emit(SOCKET_EVENTS.GAME_MOVE, {
      gameId: game?.id || game?._id?.toString(),
      row: data.row,
      col: data.col,
      player: data.player,
    });
  }, [game]);

  // Handle join by code from iframe
  const handleJoinByCode = useCallback((data) => {
    // Ensure socket is connected
    if (!socket.connected && userAuth?.token) {
      socket.auth = { token: userAuth.token };
      socket.connect();
    }
    // Socket.IO buffers emits when disconnected — try immediately
    socket.emit(SOCKET_EVENTS.GAME_JOIN_BY_CODE, { code: data.code });
    // Also retry after a short delay in case connection was just initiated
    setTimeout(() => {
      if (!socket.connected && userAuth?.token) {
        socket.emit(SOCKET_EVENTS.GAME_JOIN_BY_CODE, { code: data.code });
      }
    }, 1500);
  }, [userAuth]);

  useEffect(() => {
    const onMessage = (e) => {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "ready" || msg.type === "bridge-ready") {
        handleInit();
      } else if (msg.type === "game-over") {
        onFinish?.({
          score: msg.data?.score || 0,
          correct: msg.data?.correct ?? 0,
          totalQuestions: msg.data?.totalQuestions ?? 0,
          timeUsed: msg.data?.timeUsed || 0,
          coinReward: msg.data?.coinReward || 0,
        });
      } else if (msg.type === "state-update") {
        onStateUpdate?.(msg.data);
      } else if (msg.type === "quit") {
        onQuit?.();
      } else if (msg.type === "search-user") {
        handleSearchUser(msg.data?.query);
      } else if (msg.type === "invite-user") {
        handleInviteUser(msg.data);
      } else if (msg.type === "game-move") {
        handleGameMove(msg.data);
      } else if (msg.type === "join-by-code") {
        handleJoinByCode(msg.data);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [handleInit, onFinish, onQuit, onStateUpdate, handleSearchUser, handleInviteUser, handleGameMove, handleJoinByCode]);

  // Listen for opponent moves from socket and forward to iframe
  useEffect(() => {
    const onOpponentMove = (data) => {
      postToIframe({ type: "opponent-move", data });
    };

    const onInviteAccepted = (data) => {
      postToIframe({ type: "invite-accepted", data });
      postToIframe({ type: "multiplayer-start", data: { opponent: data } });
    };

    const onGameJoined = (data) => {
      postToIframe({ type: "game-joined", data });
    };

    socket.on(SOCKET_EVENTS.GAME_MOVE, onOpponentMove);
    socket.on(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
    socket.on(SOCKET_EVENTS.GAME_JOINED, onGameJoined);

    return () => {
      socket.off(SOCKET_EVENTS.GAME_MOVE, onOpponentMove);
      socket.off(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
      socket.off(SOCKET_EVENTS.GAME_JOINED, onGameJoined);
    };
  }, [postToIframe]);

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
