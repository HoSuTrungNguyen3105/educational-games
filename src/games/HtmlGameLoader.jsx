import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { API_BASE, apiFetch, coinService, userService, gameProgressService, classService, gamePlayService, uid } from "../services/api.js";
import { trackTaskEvent, taskService } from "../services/taskService.js";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";
import { renderAvatarFull } from "../lib/avatarRenderer.js";
import { addPetExp } from "../lib/petApi.js";
import CoopInvitePanel from "../components/CoopInvitePanel.jsx";
import GameHud from "./GameHud.jsx";
import { injectGameConfig } from "./injectGameConfig.js";
import { injectAnswerBridge } from "./injectAnswerBridge.js";

/**
 * HtmlGameLoader - Renders a self-contained HTML game in an iframe.
 * Includes CoopInvitePanel for multiplayer mode selection + invite flow.
 *
 * Communication via postMessage:
 *
 * React → iframe: { type: "init", data: { gameId, playerName, questions, apiBase, userCoins, authToken, playMode, gameMode, gameConfig, savedProgress, loggedIn } }
 * React → iframe: { type: "progress", data: { level, progress, state } | null }
 * React → iframe: { type: "progress-saved", data: { ok, level } }
 * React → iframe: { type: "opponent-move", data: { ... } }
 * React → iframe: { type: "invite-accepted", data: { acceptedBy, acceptedByName, sessionId } }
 * React → iframe: { type: "multiplayer-start", data: { opponent, sessionId } }
 * React → iframe: { type: "game-joined", data: { ok, gameId, sessionId } }
 *
 * iframe → React: { type: "ready" }
 * iframe → React: { type: "bridge-ready" }
 * iframe → React: { type: "show-coop-panel" }
 * iframe → React: { type: "answer-recorded", data: { questionId } }
 * iframe → React: { type: "save-progress", data: { level, progress, state } }   ← lưu màn chơi
 * iframe → React: { type: "get-progress" }                                    ← xin tiến độ
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
  coopSessionId, coopOpponent, onCoopReady, gameKey, gameConfig,
}) {
  const iframeRef = useRef(null);
  const [showCoopPanel, setShowCoopPanel] = useState(false);
  const [coopMode, setCoopMode] = useState(playMode || "solo");
  const [pendingOpponent, setPendingOpponent] = useState(coopOpponent || null);
  const [hudCoins, setHudCoins] = useState(0);
  const [petMessage, setPetMessage] = useState("Chúc bạn chơi vui vẻ!");
  // Game tự render header (stats/pet) thì tắt HUD nổi của app để không trùng lặp
  const [hudHidden, setHudHidden] = useState(false);
  // Câu trả lời game HTML báo lên (EG_ANSWER). Server sẽ chấm lại từ đây.
  const answersRef = useRef([]);
  // playId: khóa idempotency để double-submit không cộng XP hai lần.
  // Gán lại mỗi lần game nạp (xem handleInit).
  const playIdRef = useRef(null);

  const gameId = game?._id?.toString() || game?.id;
  const gameName = game?.name || "Trò chơi";
  const gameCode = game?.code || "";

  // Đáp án do EG_ANSWER trong iframe gửi lên. Game cũ không dùng bridge thì
  // mảng này rỗng → server chấm từ answers rỗng (không câu nào đúng).
  const recordAnswer = useCallback((questionId, value, timeSpent) => {
    if (questionId == null) return;
    const id = String(questionId);
    const list = answersRef.current;
    const idx = list.findIndex(a => a.questionId === id);
    const entry = { questionId: id, value: value ?? null, timeSpent: typeof timeSpent === "number" ? timeSpent : undefined };
    if (idx >= 0) list[idx] = entry;
    else list.push(entry);
  }, []);

  // Nhúng config của riêng game này vào HTML trước khi nạp vào iframe
  const injectedHtml = useMemo(() => {
    if (!htmlContent) return htmlContent;
    const withConfig = gameKey ? injectGameConfig(htmlContent, { key: gameKey, config: gameConfig }) : htmlContent;
    return injectAnswerBridge(withConfig);
  }, [htmlContent, gameKey, gameConfig]);

  useEffect(() => {
    if (!socket.connected && userAuth?.token) {
      socket.auth = { token: userAuth.token };
      socket.connect();
    }
  }, []);

  const handleInit = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    // Mỗi lần game nạp lại = 1 lượt chơi mới → reset đáp án và khóa idempotency.
    answersRef.current = [];
    playIdRef.current = uid("play");
    const playerNames = (players || []).map(p => (typeof p === "string" ? p : p?.name)).filter(Boolean);

    let userCoins = 0;
    let userStars = 0;
    let spinsLeft = 3;
    let authToken = null;
    let userId = null;
    let loadout = null;
    let avatarSvg = null;
    // Tiến độ đã lưu (màn chơi hiện tại + state tuỳ chọn) để game render đúng màn
    let savedProgress = null;

    try {
      if (gameId) {
        const progress = await gameProgressService.getGame(gameId);
        if (progress?.loadout) loadout = progress.loadout;
        if (progress && (progress.level > 1 || progress.gameState)) {
          savedProgress = {
            level: Number(progress.level) || 1,
            progress: Number(progress.progress) || 0,
            gamesPlayed: Number(progress.gamesPlayed) || 0,
            state: progress.gameState || null,
            lastPlayedAt: progress.lastPlayedAt || null,
          };
        }
      }
    } catch { /* ignore */ }

    if (userAuth?.token) {
      try {
        authToken = userAuth.token;
        userId = userAuth.user?.id;
        const coinData = await coinService.get();
        userCoins = coinData?.coins || 0;
        setHudCoins(userCoins);
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
      } catch { /* ignore */ }
    }

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
          gameKey: gameKey || null,
          gameConfig: gameConfig || null,
          // Game tự sinh nội dung từ config (gameMode = "custom") không dùng questions
          gameMode: game?.gameMode || "quiz",
          // Tiến độ đã lưu → game render đúng màn đang chơi dở
          savedProgress,
          loggedIn: !!userAuth?.token,
        }
      },
      "*"
    );
  }, [game, playerName, questions, players, playMode, userAuth, coopMode, coopSessionId, pendingOpponent, gameKey, gameConfig]);

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

  const handleInviteUser = useCallback(async (data) => {
    if (!data) return;
    const { toUserId, gameName: gName, gameCode: gCode } = data;
    const payload = {
      toUserId,
      gameId,
      gameName: gName || gameName,
      gameCode: gCode || gameCode,
    };
    // HTTP API trước để tạo notification + push (kể cả khi target offline / socket chưa connect)
    try {
      await apiFetch("/game-invites", { method: "POST", body: payload });
    } catch (e) {
      console.error("[HtmlGameLoader] game-invites API error:", e.message);
    }
    // Socket realtime cho target đang online
    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.GAME_INVITE_SEND, payload);
    } else {
      try { socket.connect(); } catch { /* ignore */ }
      setTimeout(() => {
        if (socket.connected) socket.emit(SOCKET_EVENTS.GAME_INVITE_SEND, payload);
      }, 500);
    }
    postToIframe({ type: "invite-sent", data: { ok: true, toUserId } });
  }, [gameId, gameName, gameCode, postToIframe]);

  const handleGameMove = useCallback((data) => {
    if (!data) return;
    socket.emit(SOCKET_EVENTS.GAME_MOVE, {
      gameId,
      ...data,
    });
  }, [gameId]);

  const handleXoMove = useCallback((data) => {
    if (!data) return;
    const sessionId = pendingOpponent?.sessionId || coopSessionId;
    if (!sessionId) return;
    socket.emit(SOCKET_EVENTS.XO_MOVE, { sessionId, row: data.row, col: data.col });
  }, [pendingOpponent, coopSessionId]);

  const handleXoRematch = useCallback(() => {
    const sessionId = pendingOpponent?.sessionId || coopSessionId;
    if (!sessionId) return;
    socket.emit(SOCKET_EVENTS.XO_REMATCH, { sessionId });
  }, [pendingOpponent, coopSessionId]);

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

  const handleRequestClasses = useCallback(async (requestId) => {
    try {
      const classes = await classService.list();
      postToIframe({ type: "classes-data", requestId, data: { classrooms: classes || [] } });
    } catch (e) {
      console.error("[HtmlGameLoader] request-classes error:", e);
      postToIframe({ type: "classes-data", requestId, data: { error: "Không thể tải danh sách lớp học", classrooms: [] } });
    }
  }, [postToIframe]);

  const handleRequestStudents = useCallback(async (classId, requestId) => {
    try {
      const students = await classService.getStudents(classId);
      postToIframe({ type: "students-data", requestId, data: { students: students || [] } });
    } catch (e) {
      console.error("[HtmlGameLoader] request-students error:", e);
      postToIframe({ type: "students-data", requestId, data: { error: "Không thể tải danh sách học sinh", students: [] } });
    }
  }, [postToIframe]);

  useEffect(() => {
    const onMessage = (e) => {
      // Chỉ tin message đến từ đúng iframe game này — chặn mọi script khác
      // trên trang (hoặc iframe khác) giả mạo "add-coins", "game-over"...
      if (e.source !== iframeRef.current?.contentWindow) return;

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
      } else if (msg.type === "answer" || msg.type === "answer-recorded") {
        // Game HTML báo đã trả lời 1 câu — giữ lại để server chấm lại.
        const d = msg.data || {};
        recordAnswer(d.questionId ?? d.id, d.value ?? d.answer, d.timeSpent);
      } else if (msg.type === "answers") {
        const list = Array.isArray(msg.data?.answers) ? msg.data.answers : [];
        for (const a of list) recordAnswer(a?.questionId, a?.value, a?.timeSpent);
      } else if (msg.type === "save-progress") {
        // Game báo "đang ở màn nào" → lưu để vào lại render đúng màn.
        // payload: { level, progress, state, experience?, gamesPlayedDelta? }
        const d = msg.data || {};
        if (!gameId || !userAuth?.token) {
          postToIframe({ type: "progress-saved", data: { ok: false, reason: "not-logged-in" } });
        } else {
          const patch = {};
          if (d.level != null) patch.level = Math.max(1, Math.floor(Number(d.level) || 1));
          if (d.progress != null) patch.progress = Math.max(0, Math.min(1, Number(d.progress) || 0));
          if (d.experience != null) patch.experience = Math.max(0, Math.floor(Number(d.experience) || 0));
          if (d.state !== undefined) patch.gameState = d.state;
          gameProgressService.upsertGame(gameId, patch)
            .then(() => postToIframe({ type: "progress-saved", data: { ok: true, level: patch.level } }))
            .catch((e) => {
              console.error("[HtmlGameLoader] Lưu tiến độ lỗi:", e);
              postToIframe({ type: "progress-saved", data: { ok: false, reason: e.message } });
            });
        }
      } else if (msg.type === "get-progress") {
        // Game chủ động hỏi lại tiến độ (dùng khi chuyển màn)
        if (!gameId || !userAuth?.token) {
          postToIframe({ type: "progress", data: null });
        } else {
          gameProgressService.getGame(gameId)
            .then((p) => postToIframe({
              type: "progress",
              data: p ? { level: Number(p.level) || 1, progress: Number(p.progress) || 0, state: p.gameState || null } : null
            }))
            .catch(() => postToIframe({ type: "progress", data: null }));
        }
      } else if (msg.type === "add-coins") {
        const amount = msg.data?.amount || 0;
        if (amount > 0 && userAuth?.token) {
          // Qua endpoint có trần/ngày — iframe không thể spam vô hạn.
          gamePlayService.rewardCoins(amount).then(res => {
            postToIframe({ type: "coins-added", data: { success: true, coins: res?.coins ?? 0 } });
            setHudCoins(res?.coins ?? 0);
            setPetMessage(`🎉 Tuyệt vời! +${amount} coin`);
            // Pet: cộng EXP qua API (petApi tự lưu cache + fallback offline)
            addPetExp(Math.min(10, amount), { correct: 1 });
            onStateUpdate?.({ coins: res?.coins ?? 0 });
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
        const data = msg.data || {};
        // Game có thể gửi kèm answers; nếu không thì lấy những gì EG_ANSWER đã ghi.
        const answers = Array.isArray(data.answers) && data.answers.length > 0
          ? data.answers
          : answersRef.current;
        const total = data.totalQuestions || answers.length || 0;
        const correct = data.correct ?? 0;
        setPetMessage(
          total > 0 && correct / total >= 0.8
            ? "🌟 Giỏi quá! Tui tự hào về bạn!"
            : "💪 Khéo lắm! Hẹn gặp lại nha~"
        );
        onFinish?.({
          score: data.score || 0,
          correct,
          totalQuestions: total,
          timeUsed: data.timeUsed || 0,
          coinReward: data.coinReward || 0,
          studentId: data.studentId || null,
          studentName: data.studentName || null,
          answers,
          playId: playIdRef.current,
          questionIds: (questions || []).map(q => q?.id).filter(Boolean),
        });
      } else if (msg.type === "state-update") {
        onStateUpdate?.(msg.data);
      } else if (msg.type === "quit") {
        onQuit?.();
      } else if (msg.type === "hide-hud") {
        setHudHidden(true);
      } else if (msg.type === "search-user") {
        handleSearchUser(msg.data?.query);
      } else if (msg.type === "invite-user") {
        handleInviteUser(msg.data);
      } else if (msg.type === "game-move") {
        handleGameMove(msg.data);
      } else if (msg.type === "xo-move") {
        handleXoMove(msg.data);
      } else if (msg.type === "xo-rematch") {
        handleXoRematch();
      } else if (msg.type === "join-by-code") {
        handleJoinByCode(msg.data);
      } else if (msg.type === "request-classes") {
        handleRequestClasses(msg.requestId);
      } else if (msg.type === "request-students") {
        handleRequestStudents(msg.data?.classId, msg.requestId);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [handleInit, onFinish, onQuit, onStateUpdate, handleSearchUser, handleInviteUser, handleGameMove, handleXoMove, handleXoRematch, handleJoinByCode, handleRequestClasses, handleRequestStudents, userAuth, postToIframe, gameId, recordAnswer, questions, postToIframe]);

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

    const onXoSync = (data) => postToIframe({ type: "xo-sync", data });
    const onXoMoveResult = (data) => postToIframe({ type: "xo-move-result", data });
    const onXoResult = (data) => postToIframe({ type: "xo-result", data });
    socket.on(SOCKET_EVENTS.XO_SYNC, onXoSync);
    socket.on(SOCKET_EVENTS.XO_MOVE_RESULT, onXoMoveResult);
    socket.on(SOCKET_EVENTS.XO_RESULT, onXoResult);

    return () => {
      socket.off(SOCKET_EVENTS.GAME_MOVE, onOpponentMove);
      socket.off(SOCKET_EVENTS.GAME_INVITE_ACCEPTED, onInviteAccepted);
      socket.off(SOCKET_EVENTS.GAME_JOINED, onGameJoined);
      socket.off(SOCKET_EVENTS.XO_SYNC, onXoSync);
      socket.off(SOCKET_EVENTS.XO_MOVE_RESULT, onXoMoveResult);
      socket.off(SOCKET_EVENTS.XO_RESULT, onXoResult);
    };
  }, [postToIframe, gameId, playerName, gameName, gameCode]);

  // Xin đồng bộ lại bàn cờ XO từ server khi vừa vào trận và mỗi khi socket
  // reconnect (mất mạng / tải lại) — tránh ván đấu bị "mất trắng" phía
  // client trong khi server vẫn còn giữ trạng thái chuẩn.
  useEffect(() => {
    const sessionId = pendingOpponent?.sessionId || coopSessionId;
    if (!sessionId) return;
    const requestSync = () => socket.emit(SOCKET_EVENTS.XO_SYNC_REQUEST, { sessionId });
    requestSync();
    socket.on("connect", requestSync);
    return () => socket.off("connect", requestSync);
  }, [pendingOpponent, coopSessionId]);

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

  if (!injectedHtml) {
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
        srcDoc={injectedHtml}
        /* PHẢI có allow-same-origin: nếu không, iframe chạy ở "opaque origin" và
           mọi thao tác localStorage bên trong game đều ném SecurityError. Điều đó
           làm hỏng 2 thứ cùng lúc:
             1. game-core.js gọi _loadState() lúc initCore() → lỗi ngay, không render card nào
             2. _saveState() không lưu được tiến độ
           Đánh đổi: game có cùng origin với trang cha nên script trong game về lý
           thuyết đọc được localStorage của app (chứa token). Chấp nhận được vì
           HTML game do admin tự soạn, cùng nguồn với app.
           allow-same-origin + allow-scripts là combo nguy hiểm với nội dung
           không tin cậy — không dùng 2 điều này cho template tải từ bên thứ ba. */
        sandbox="allow-scripts allow-same-origin allow-modals allow-pointer-lock"
        className="flex-1 w-full h-full border-0"
        title={game?.title || "Game"}
      />
      {!hudHidden && (
        <GameHud
          coins={hudCoins}
          gameName={gameName}
          petMessage={petMessage}
          onQuit={onQuit}
        />
      )}
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