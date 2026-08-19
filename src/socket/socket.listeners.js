import { useEffect, useState } from "react";
import { socket } from "./socket.js";
import { SOCKET_EVENTS } from "./socket.events.js";
import { useGameStore } from "../stores/game.store.js";

// Đăng ký listener một lần duy nhất trong toàn app.
// Trả về hàm cleanup để gọi khi logout / tháo app.
export function registerSocketListeners() {
  const game = () => useGameStore.getState();

  const onGameStarted = ({ gameId } = {}) => {
    if (gameId) game().setGame(gameId);
    game().startGame();
  };

  const onQuestionStarted = ({ question, index, duration } = {}) => {
    game().setQuestion(question, index, duration);
  };

  const onScoreUpdated = ({ score } = {}) => {
    game().setScore(score ?? 0);
  };

  const onLeaderboardUpdated = ({ players, leaderboard } = {}) => {
    if (Array.isArray(players)) game().setPlayers(players);
    if (Array.isArray(leaderboard)) {
      game().setLeaderboard(leaderboard);
      if (!Array.isArray(players)) game().setPlayers(leaderboard);
    }
  };

  const onPlayerJoined = ({ players } = {}) => {
    if (Array.isArray(players)) game().setPlayers(players);
  };

  const onPlayerLeft = ({ players } = {}) => {
    if (Array.isArray(players)) game().setPlayers(players);
  };

  const onFinished = () => game().finishGame();

  socket.on(SOCKET_EVENTS.GAME_STARTED, onGameStarted);
  socket.on(SOCKET_EVENTS.QUESTION_STARTED, onQuestionStarted);
  socket.on(SOCKET_EVENTS.SCORE_UPDATED, onScoreUpdated);
  socket.on(SOCKET_EVENTS.LEADERBOARD_UPDATED, onLeaderboardUpdated);
  socket.on(SOCKET_EVENTS.PLAYER_JOINED, onPlayerJoined);
  socket.on(SOCKET_EVENTS.PLAYER_LEFT, onPlayerLeft);
  socket.on(SOCKET_EVENTS.GAME_FINISHED, onFinished);

  return () => {
    socket.off(SOCKET_EVENTS.GAME_STARTED, onGameStarted);
    socket.off(SOCKET_EVENTS.QUESTION_STARTED, onQuestionStarted);
    socket.off(SOCKET_EVENTS.SCORE_UPDATED, onScoreUpdated);
    socket.off(SOCKET_EVENTS.LEADERBOARD_UPDATED, onLeaderboardUpdated);
    socket.off(SOCKET_EVENTS.PLAYER_JOINED, onPlayerJoined);
    socket.off(SOCKET_EVENTS.PLAYER_LEFT, onPlayerLeft);
    socket.off(SOCKET_EVENTS.GAME_FINISHED, onFinished);
  };
}

// Hook dùng trong component: subscribe một event, tự cleanup khi unmount.
// Chỉ dùng cho các listener cục bộ (không trùng với registerSocketListeners).
export function useSocketEvent(event, handler) {
  useEffect(() => {
    if (!handler) return;
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [event, handler]);
}

export function useSocketConnected() {
  const [connected, setConnected] = useState(socket.connected);
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  return connected;
}