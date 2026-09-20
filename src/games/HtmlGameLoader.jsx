import { useEffect, useRef, useCallback, useState } from "react";
import { API_BASE, coinService, userService, gameProgressService } from "../services/api.js";
import { trackTaskEvent, taskService } from "../services/taskService.js";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";
import { renderAvatarFull } from "../lib/avatarRenderer.js";
import CoopInvitePanel from "../components/CoopInvitePanel.jsx";

/**
 * HtmlGameLoader - Renders a self-contained HTML game in an iframe.
 * Includes CoopInvitePanel for multiplayer mode selection + invite flow.
 *
 * Communication via postMessage:
 *
 * React → iframe: { type: "init", data: { gameId, playerName, questions, apiBase, userCoins, authToken, playMode } }
 * React → iframe: { type: "opponent-move", data: { ... } }
 * React → iframe: { type: "invite-accepted", data: { acceptedBy, acceptedByName, sessionId } }
 * React → iframe: { type: "multiplayer-start", data: { opponent, sessionId } }
 * React → iframe: { type: "game-joined", data: { ok, gameId, sessionId } }
 *
 * iframe → React: { type: "ready" }
 * iframe → React: { type: "bridge-ready" }
 * iframe → React: { type: "show-coop-panel" }
 * iframe → React: { type: "search-user", data: { query } }
 * iframe → React: { type: "invite-user", data: { toUserId, gameId, gameName, gameCode } }
 * iframe → React: { type: "game-move", data: { ... } }
 * iframe → React: { type: "game-over", data: { score, timeUsed, coinReward } }
 * iframe → React: { type: "state-update", data: { ... } }
 * iframe → React: { type: "quit" }
 */
export default function HtmlGameLoader({
  htmlContent, game, questions, players, playerName,
  playMode, onFinish, onQuit, onStateUpdate, userAuth,
  coopSessionId, coopOpponent, onCoopReady,
}) {
  const iframeRef = useRef(null);
  const [showCoopPanel, setShowCoopPanel] = useState(false);
  const [coopMode, setCoopMode] = useState(playMode || "solo");
  const [pendingOpponent, setPendingOpponent] = useState(coopOpponent || null);

  const gameId = game?._id?.toString() || game?.id;
  const gameName = game?.name || "Trò chơi";
  const gameCode = game?.code || "";

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
    let userStars = 0;
    let spinsLeft = 3;
    let authToken = null;
    let userId = null;
    let loadout = null;
    let avatarSvg = null;
    try {
      if (userAuth?.token) {
        authToken = userAuth.token;
        userId = userAuth.user?.id;
        const coinData = await coinService.get();
        userCoins = coinData?.coins || 0;
        if (gameId) {
          const progress = await gameProgressService.getGame(gameId);
          if (progress?.loadout) loadout = progress.loadout;
        }
        try {
          const starsResp = await fetch(`${API_BASE}/api/auth/me/stars`, {
            headers: { Authorization: `Bearer ${userAuth.token}` },
          });
          const starsJson = await starsResp.json();
          userStars = starsJson?.data?.stars || starsJson?.stars || 0;
        } catch { /* ignore */ }
        try {
          const taskData = await taskService.getTasks("DAILY");
          const spinTask = (taskData?.tasks || []).find(t => t.code === "SPIN_WHEEL");
          if (spinTask) spinsLeft = taskData.spinsLeft ?? Math.max(0, spinTask.target - (spinTask.progress || 0));
        } catch { /* ignore */ }
        try {
          const [loadoutResp, itemsResp] = await Promise.all([
            fetch(`${API_BASE}/api/avatar/loadout`, {
              headers: { Authorization: `Bearer ${userAuth.token}` },
            }),
            fetch(`${API_BASE}/api/avatar/items`, {
              headers: { Authorization: `Bearer ${userAuth.token}` },
            }),
          ]);
          const loadoutJson = await loadoutResp.json();
          const itemsJson = await itemsResp.json();
          const rawLoadout = loadoutJson?.data?.loadout || {};
          const allItems = itemsJson?.data?.items || [];
          const itemMap = new Map(allItems.map(i => [i.code, i]));
          const state = {};
          let bodyHtml = null;
          for (const [layer, itemId] of Object.entries(rawLoadout)) {
            if (!itemId) continue;
            const item = typeof itemId === 'object' ? itemId : itemMap.get(itemId);
            if (!item) continue;
            if (layer === 'body') bodyHtml = item.html || null;
            else if (layer === 'skin') state.skin = item.params?.hex || '#FFDFC4';
            else if (layer === 'face') state.face = item.params?.style || 'gentle';
            else if (layer === 'hair') state.hair = { style: item.params?.style || 'spiky', color: item.params?.color || '#6B4226' };
            else if (layer === 'shirt') state.shirt = { style: item.params?.style || 'tee', color: item.params?.color || '#F5F5F5' };
            else if (layer === 'pants') state.pants = { style: item.params?.style || 'shorts', color: item.params?.color || '#241F1C' };
            else if (layer === 'shoes') state.shoes = { style: item.params?.style || 'sneaker', color: item.params?.color || '#3B5EA6' };
            else if (layer === 'hat') state.hat = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
            else if (layer === 'glasses') state.glasses = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
            else if (layer === 'accessory') state.accessory = { style: item.params?.style || 'none', color: item.params?.color || '#000' };
          }
          const svgContent = renderAvatarFull(state, bodyHtml);
          if (svgContent) avatarSvg = svgContent;
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }

    const effectivePlayMode = coopMode || playMode || "solo";

    iframe.contentWindow.postMessage(
      {
        type: "init",
        data: {
          gameId,
          playerName: playerName || "Player",
          players: playerNames,
          questions: questions || [],
          apiBase: API_BASE,
          playMode: effectivePlayMode,
          questionsTotal: questions?.length || 0,
          userCoins,
          coins: userCoins,
          userStars,
          stars: userStars,
          spinsLeft,
          authToken,
          userId,
          loadout,
          avatarSvg,
          gameName,
          gameCode,
          sessionId: coopSessionId || null,
          opponent: pendingOpponent || null,
        }
      },
      "*"
    );
  }, [game, playerName, questions, players, playMode, userAuth, coopMode, coopSessionId, pendingOpponent]);

  const postToIframe = useCallback((msg) => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(msg, "*");
    }
  }, []);

  const handleSearchUser = useCallback(async (query) => {
    try {
      const results = await userService.search(query);
      postToIframe({ type: "search-results", data: { users: results || [] } });
    } catch (e) {
      console.error("[HtmlGameLoader] Search error:", e);
      postToIframe({ type: "search-results", data: { users: [] } });
    }
  }, [postToIframe]);

  const handleInviteUser = useCallback((data) => {
    if (!data) return;
    const { toUserId, gameName: gName, gameCode: gCode } = data;
    socket.emit(SOCKET_EVENTS.GAME_INVITE_SEND, {
      toUserId,
      gameId,
      gameName: gName || gameName,
      gameCode: gCode || gameCode,
    });
    postToIframe({ type: "invite-sent", data: { ok: true, toUserId } });
  }, [gameId, gameName, gameCode, postToIframe]);

  const handleGameMove = useCallback((data) => {
    if (!data) return;
    socket.emit(SOCKET_EVENTS.GAME_MOVE, {
      gameId,
      ...data,
    });
  }, [gameId]);

  const handleJoinByCode = useCallback((data) => {
    if (!data) return;
    if (!socket.connected && userAuth?.token) {
      socket.auth = { token: userAuth.token };
      socket.connect();
    }
    socket.emit(SOCKET_EVENTS.GAME_JOIN_BY_CODE, { code: data.code });
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

      if (msg.source === "game" && msg.type) {
        const gId = gameId || msg.data?.gameId;
        trackTaskEvent(msg.type, { gameId: gId, ...msg.data }).catch(() => {});
        return;
      }

      if (msg.type === "ready" || msg.type === "bridge-ready") {
        handleInit();
      } else if (msg.type === "show-coop-panel") {
        setShowCoopPanel(true);
      } else if (msg.type === "add-coins") {
        const amount = msg.data?.amount || 0;
        if (amount > 0 && userAuth?.token) {
          coinService.add(amount).then(res => {
            postToIframe({ type: "coins-added", data: { success: true, coins: res?.coins || 0 } });
            onStateUpdate?.({ coins: res?.coins || 0 });
          }).catch(() => {
            postToIframe({ type: "coins-added", data: { success: false } });
          });
        }
      } else if (msg.type === "spin-wheel") {
        if (userAuth?.token) {
          trackTaskEvent("SPIN", {}).then(res => {
            const spinTask = res?.completedTasks?.find(t => t.code === "SPIN_WHEEL");
            const newSpinsLeft = spinTask ? Math.max(0, 3 - (spinTask.progress || 0)) : undefined;
            postToIframe({ type: "spin-tracked", data: { success: true, spinsLeft: newSpinsLeft } });
          }).catch(() => {
            postToIframe({ type: "spin-tracked", data: { success: false } });
          });
        }
      } else if (msg.type === "exchange-stars") {
        if (userAuth?.token) {
          fetch(`${API_BASE}/api/auth/me/stars/exchange`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${userAuth.token}` },
          })
            .then(r => r.json())
            .then(res => {
              const d = res?.data || res;
              postToIframe({ type: "exchange-stars-result", data: { success: true, coins: d.coins || 0, stars: d.stars || 0, exchanged: d.exchanged || 0 } });
              if (d.coins) onStateUpdate?.({ coins: d.coins });
            })
            .catch(() => {
              postToIframe({ type: "exchange-stars-result", data: { success: false } });
            });
        }
      } else if (msg.type === "save-loadout") {
        const loadoutData = msg.data?.loadout;
        if (loadoutData && gameId && userAuth?.token) {
          gameProgressService.upsertGame(gameId, { loadout: loadoutData }).catch(() => {});
        }
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
  }, [handleInit, onFinish, onQuit, onStateUpdate, handleSearchUser, handleInviteUser, handleGameMove, handleJoinByCode, userAuth, postToIframe, gameId]);

  useEffect(() => {
    const onOpponentMove = (data) => {
      postToIframe({ type: "opponent-move", data });
    };

    const onInviteAccepted = (data) => {
      setPendingOpponent(data);
      setCoopMode("multiplayer");
      postToIframe({ type: "invite-accepted", data });
      postToIframe({ type: "multiplayer-start", data: { opponent: data, sessionId: data.sessionId } });
      postToIframe({ type: "init", data: { gameId, playerName: playerName || "Player", playMode: "multiplayer", gameName, gameCode, sessionId: data.sessionId, opponent: data } });
    };

    const onGameJoined = (data) => {
      if (data.ok) {
        setPendingOpponent({ acceptedByName: data.hostUserId });
        setCoopMode("multiplayer");
        postToIframe({ type: "game-joined", data });
        postToIframe({ type: "init", data: { gameId: data.gameId || gameId, playerName: playerName || "Player", playMode: "multiplayer", gameName, gameCode, sessionId: data.sessionId, opponent: { acceptedBy: data.hostUserId } } });
      } else {
        postToIframe({ type: "game-joined", data });
      }
    };

    socket.on(SOCKET_EVENTS.GAME_MOVE, onOpponentMove);
    socket.on(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
    socket.on(SOCKET_EVENTS.GAME_JOINED, onGameJoined);

    return () => {
      socket.off(SOCKET_EVENTS.GAME_MOVE, onOpponentMove);
      socket.off(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
      socket.off(SOCKET_EVENTS.GAME_JOINED, onGameJoined);
    };
  }, [postToIframe, gameId, playerName, gameName, gameCode]);

  useEffect(() => {
    if (coopSessionId && coopOpponent) {
      setPendingOpponent(coopOpponent);
      setCoopMode("multiplayer");
      postToIframe({ type: "invite-accepted", data: coopOpponent });
      postToIframe({ type: "multiplayer-start", data: { opponent: coopOpponent, sessionId: coopSessionId } });
    }
  }, [coopSessionId, coopOpponent]);

  const handleCoopModeSelected = useCallback((mode) => {
    if (mode === "solo") {
      setShowCoopPanel(false);
      setCoopMode("solo");
      postToIframe({ type: "mode-selected", data: { mode: "solo" } });
    }
    setCoopMode(mode);
  }, [postToIframe]);

  const handleCoopInviteAccepted = useCallback((data) => {
    setShowCoopPanel(false);
    setPendingOpponent(data);
    setCoopMode("multiplayer");
    postToIframe({ type: "invite-accepted", data });
    postToIframe({ type: "multiplayer-start", data: { opponent: data, sessionId: data.sessionId } });
    onCoopReady?.(data);
  }, [postToIframe, onCoopReady]);

  const handleCoopGameJoined = useCallback((data) => {
    setShowCoopPanel(false);
    setCoopMode("multiplayer");
    postToIframe({ type: "game-joined", data });
    onCoopReady?.(data);
  }, [postToIframe, onCoopReady]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {};
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [htmlContent]);

  if (!htmlContent) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-paper">
        <p className="text-sm text-[#8A7C63]">Đang tải game...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col bg-paper">
      <iframe
        ref={iframeRef}
        srcDoc={htmlContent}
        sandbox="allow-scripts allow-same-origin"
        className="flex-1 w-full h-full border-0"
        title={game?.title || "Game"}
      />
      <CoopInvitePanel
        gameId={gameId}
        gameName={gameName}
        gameCode={gameCode}
        visible={showCoopPanel}
        mode={coopMode}
        onModeSelected={handleCoopModeSelected}
        onInviteAccepted={handleCoopInviteAccepted}
        onGameJoined={handleCoopGameJoined}
        onClose={() => setShowCoopPanel(false)}
      />
    </div>
  );
}
