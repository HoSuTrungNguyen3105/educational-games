import { Server } from "socket.io";
import { config } from "./config.js";
import { verifyToken } from "./services/authService.js";
import * as gameService from "./services/gameService.js";
import * as questionService from "./services/questionService.js";
import * as resultService from "./services/resultService.js";
import * as chatService from "./services/chatService.js";

// Event names — PHẢI khớp với frontend src/socket/socket.events.js
export const EVENTS = {
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
};

const roomName = (gameId) => `game:${gameId}`;

// Session game realtime (in-memory). Mỗi game một session.
const sessions = new Map(); // gameId -> session

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: config.socketCorsOrigins.length > 0 ? config.socketCorsOrigins : true,
      methods: ["GET", "POST"],
    },
  });

  // Xác thực tùy chọn: có token (teacher/admin) thì gán user; học sinh không cần token.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    try {
      socket.data.user = verifyToken(token);
      next();
    } catch {
      next(new Error("Phiên đăng nhập hết hạn"));
    }
  });

  io.on("connection", (socket) => {
    const role = socket.data.user?.role || "student";
    socket.data.role = role;

    // Teacher mở lớp / tham gia vào phòng game
    socket.on(EVENTS.JOIN_CLASSROOM, (data = {}) => {
      const gameId = data.gameId;
      if (!gameId) return;
      socket.join(roomName(gameId));
      socket.data.gameId = gameId;
      socket.emit(EVENTS.JOIN_CLASSROOM, { ok: true, gameId });
    });

    socket.on(EVENTS.LEAVE_CLASSROOM, (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      if (gameId) removePlayer(io, socket, gameId);
    });

    // Học sinh tham gia trò chơi
    socket.on(EVENTS.JOIN_GAME, async (data = {}) => {
      const gameId = data.gameId;
      if (!gameId) return;
      let game;
      try {
        game = await gameService.get(gameId);
      } catch (_) { /* ignore */ }
      if (!game) {
        socket.emit(EVENTS.JOIN_GAME, { ok: false, message: "Không tìm thấy trò chơi" });
        return;
      }
      socket.join(roomName(gameId));
      socket.data.gameId = gameId;

      let session = sessions.get(gameId);
      if (!session) session = createSession(gameId);

      const playerId = socket.id;
      const playerName = String(data.playerName || "Học sinh").slice(0, 24);
      const existing = session.players.get(playerId);
      session.players.set(playerId, {
        id: playerId,
        name: existing ? existing.name : playerName,
        score: existing ? existing.score : 0,
        correctAnswers: existing ? existing.correctAnswers : 0,
      });
      socket.data.playerId = playerId;

      socket.emit(EVENTS.JOIN_GAME, { ok: true, gameId, playerId, players: playersList(session) });
      io.to(roomName(gameId)).emit(EVENTS.PLAYER_JOINED, { players: playersList(session) });
    });

    // Teacher bắt đầu trò chơi
    socket.on(EVENTS.START_GAME, async (data = {}) => {
      if (role !== "teacher" && role !== "admin") return;
      const gameId = data.gameId;
      if (!gameId) return;
      socket.join(roomName(gameId));
      socket.data.gameId = gameId;

      let session = sessions.get(gameId);
      if (!session) session = createSession(gameId);
      if (session.status === "playing") return;

      const questions = await questionService.listByGame(gameId);
      if (!questions.length) {
        socket.emit(EVENTS.START_GAME, { ok: false, message: "Trò chơi chưa có câu hỏi nào" });
        return;
      }
      session.status = "playing";
      session.questions = questions;
      session.index = 0;
      session.answered = new Set();

      io.to(roomName(gameId)).emit(EVENTS.GAME_STARTED, { gameId, totalQuestions: questions.length });
      startQuestion(io, gameId);
    });

    // Teacher bấm câu kế tiếp sớm hơn (optional)
    socket.on(EVENTS.NEXT_QUESTION, (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      const session = gameId && sessions.get(gameId);
      if (!session || session.status !== "playing") return;
      clearTimeout(session.timer);
      advance(io, gameId);
    });

    // Học sinh nộp đáp án — server tự validate + tính điểm
    socket.on(EVENTS.SUBMIT_ANSWER, (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      const session = gameId && sessions.get(gameId);
      const playerId = socket.data.playerId;
      if (!session || session.status !== "playing" || !playerId) return;

      const player = session.players.get(playerId);
      if (!player) return;
      if (session.answered.has(playerId)) return; // mỗi câu chỉ nộp 1 lần
      session.answered.add(playerId);

      const question = session.questions?.[session.index];
      if (!question || question.id !== data.questionId) return;

      const correct = data.answerId === question.correctAnswer;
      const duration = question.timeLimit || 20;
      const elapsed = session.questionStart ? (Date.now() - session.questionStart) / 1000 : 0;
      const remaining = Math.max(0, duration - elapsed);
      const bonus = correct ? Math.round((remaining / duration) * 40) : 0;
      const earned = correct ? (question.points || 100) + bonus : 0;

      player.score += earned;
      if (correct) player.correctAnswers += 1;

      socket.emit(EVENTS.ANSWER_RESULT, {
        correct,
        correctAnswerId: question.correctAnswer,
        explanation: question.explanation || null,
        earned,
        score: player.score,
      });
      io.to(roomName(gameId)).emit(EVENTS.SCORE_UPDATED, {
        playerId,
        name: player.name,
        score: player.score,
        correctAnswers: player.correctAnswers,
      });
      io.to(roomName(gameId)).emit(EVENTS.LEADERBOARD_UPDATED, {
        leaderboard: sortedPlayers(session),
      });
    });

    // --- CHAT EVENTS ---

    // Gửi tin nhắn qua socket (realtime)
    socket.on(EVENTS.CHAT_MESSAGE, async (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      if (!gameId) return;
      const senderId = socket.data.playerId || socket.data.user?.id || socket.id;
      const playerName = data.playerName || socket.data.playerId || "Ẩn danh";
      try {
        const msg = await chatService.sendMessage({
          conversationId: gameId,
          senderId,
          playerName,
          content: data.content,
          clientMessageId: data.clientMessageId,
          type: data.type || "text",
        });
        // Broadcast tin nhắn đến tất cả trong phòng game
        io.to(roomName(gameId)).emit(EVENTS.CHAT_MESSAGE, msg);
      } catch (e) {
        socket.emit(EVENTS.CHAT_MESSAGE, { error: e.message || "Không gửi được tin nhắn" });
      }
    });

    // Typing indicator
    socket.on(EVENTS.CHAT_TYPING, (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      if (!gameId) return;
      socket.to(roomName(gameId)).emit(EVENTS.CHAT_TYPING, {
        playerId: socket.data.playerId || socket.id,
        playerName: socket.data.playerName || "Ẩn danh",
        isTyping: !!data.isTyping,
      });
    });

    // Đánh dấu đã đọc
    socket.on(EVENTS.CHAT_READ, async (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      const playerId = socket.data.playerId || socket.id;
      if (!gameId || !data.messageId) return;
      try {
        await chatService.markRead(gameId, playerId, data.messageId);
      } catch (_) { /* ignore */ }
    });

    socket.on("disconnect", () => {
      const gameId = socket.data.gameId;
      if (gameId) removePlayer(io, socket, gameId);
    });
  });

  return io;
}

function createSession(gameId) {
  const session = {
    gameId,
    status: "waiting", // waiting | playing | finished
    questions: [],
    index: 0,
    players: new Map(), // playerId -> { id, name, score, correctAnswers }
    answered: new Set(),
    timer: null,
    questionStart: 0,
  };
  sessions.set(gameId, session);
  return session;
}

function removePlayer(io, socket, gameId) {
  const playerId = socket.data.playerId;
  const session = sessions.get(gameId);
  socket.data.gameId = null;
  socket.data.playerId = null;
  socket.leave(roomName(gameId));
  if (!session || !playerId) return;
  if (session.players.delete(playerId)) {
    io.to(roomName(gameId)).emit(EVENTS.PLAYER_LEFT, { players: playersList(session) });
  }
}

function playersList(session) {
  return [...session.players.values()].map(({ id, name, score, correctAnswers }) => ({ id, name, score, correctAnswers }));
}

function sortedPlayers(session) {
  return playersList(session).sort((a, b) => b.score - a.score);
}

function startQuestion(io, gameId) {
  const session = sessions.get(gameId);
  if (!session || session.status !== "playing") return;
  const q = session.questions[session.index];
  if (!q) return advance(io, gameId);

  const duration = q.timeLimit || 20;
  session.answered = new Set();
  session.questionStart = Date.now();

  // Gửi câu hỏi KHÔNG kèm đáp án đúng cho học sinh
  const { correctAnswer, ...publicQuestion } = q;
  io.to(roomName(gameId)).emit(EVENTS.QUESTION_STARTED, {
    question: publicQuestion,
    index: session.index,
    duration,
  });

  session.timer = setTimeout(() => {
    io.to(roomName(gameId)).emit(EVENTS.QUESTION_ENDED, { index: session.index });
    advance(io, gameId);
  }, (duration + 1) * 1000);
}

function advance(io, gameId) {
  const session = sessions.get(gameId);
  if (!session || session.status !== "playing") return;

  const nextIndex = session.index + 1;
  if (nextIndex >= session.questions.length) {
    session.status = "finished";
    const leaderboard = sortedPlayers(session);
    io.to(roomName(gameId)).emit(EVENTS.GAME_FINISHED, { gameId, leaderboard });
    persistResults(session);
    return;
  }
  session.index = nextIndex;
  io.to(roomName(gameId)).emit(EVENTS.NEXT_QUESTION, { index: nextIndex });
  startQuestion(io, gameId);
}

// Lưu kết quả của từng người chơi vào CSDL (không làm chậm realtime)
async function persistResults(session) {
  const total = session.questions.length;
  for (const p of session.players.values()) {
    try {
      await resultService.submit({
        gameId: session.gameId,
        playerId: p.id,
        playerName: p.name,
        score: p.score,
        correctAnswers: p.correctAnswers,
        totalQuestions: total,
        accuracy: total ? Math.round((p.correctAnswers / total) * 100) : 0,
        completionTime: 0,
      });
    } catch (e) {
      console.error("[socket] Lỗi lưu kết quả:", e.message);
    }
  }
}
