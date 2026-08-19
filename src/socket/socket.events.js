// Event names cho Socket.IO.
// Backend hiện tại chưa có Socket.IO — dùng danh sách chuẩn theo spec frontend.
// Khi backend phát triển, event name phải khớp với backend.
export const SOCKET_EVENTS = {
  JOIN_CLASSROOM: "classroom:join",
  LEAVE_CLASSROOM: "classroom:leave",

  JOIN_GAME: "game:join",

  START_GAME: "game:start",
  GAME_STARTED: "game:started",

  QUESTION_STARTED: "question:started",
  QUESTION_ENDED: "question:ended",
  NEXT_QUESTION: "question:next",

  SUBMIT_ANSWER: "answer:submit",
  ANSWER_RESULT: "answer:result",

  SCORE_UPDATED: "score:updated",
  LEADERBOARD_UPDATED: "leaderboard:updated",

  GAME_FINISHED: "game:finished",

  PLAYER_JOINED: "player:joined",
  PLAYER_LEFT: "player:left",
};