import { create } from "zustand";

export const GAME_STATUS = {
  WAITING: "waiting",
  PLAYING: "playing",
  FINISHED: "finished",
};

const initialState = {
  gameId: null,
  gameStatus: GAME_STATUS.WAITING,
  currentQuestion: null,
  currentQuestionIndex: 0,
  timeLeft: 0,
  players: [],
  leaderboard: [],
  score: 0,
  finishedAt: null,
};

export const useGameStore = create((set) => ({
  ...initialState,

  setGame: (gameId) => set({ ...initialState, gameId }),

  startGame: () => set({ gameStatus: GAME_STATUS.PLAYING }),

  setQuestion: (question, index, duration) =>
    set({
      currentQuestion: question,
      currentQuestionIndex: index,
      timeLeft: duration ?? question?.timeLimit ?? 0,
    }),

  setTimeLeft: (timeLeft) => set({ timeLeft }),

  setPlayers: (players) => set({ players }),

  setLeaderboard: (leaderboard) => set({ leaderboard }),

  setScore: (score) => set({ score }),

  finishGame: () => set({ gameStatus: GAME_STATUS.FINISHED, finishedAt: Date.now() }),

  resetGame: () => set(initialState),
}));