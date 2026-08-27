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

  CHAT_MESSAGE: "chat:message",
  CHAT_TYPING: "chat:typing",
  CHAT_READ: "chat:read",

  // Game invite events
  GAME_INVITE_SEND: "game:invite:send",
  GAME_INVITE_RECEIVED: "game:invite:received",
  GAME_INVITE_ACCEPTED: "game:invite:accepted",
  GAME_INVITE_DECLINED: "game:invite:declined",
  GAME_MOVE: "game:move",
  GAME_STATE_SYNC: "game:state:sync",
  GAME_JOIN_BY_CODE: "game:join-by-code",
  GAME_JOINED: "game:joined",
};