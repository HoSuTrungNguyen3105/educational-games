import { Server } from "socket.io";
import { config } from "./config.js";
import { verifyToken, addCoins } from "./services/authService.js";
import * as gameService from "./services/gameService.js";
import * as questionService from "./services/questionService.js";
import * as resultService from "./services/resultService.js";
import * as chatService from "./services/chatService.js";
import * as notificationService from "./services/notificationService.js";
import * as gameSessionService from "./services/gameSessionService.js";

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

  // Game invite events
  GAME_INVITE_SEND: "game:invite:send",
  GAME_INVITE_RECEIVED: "game:invite:received",
  GAME_INVITE_ACCEPTED: "game:invite:accepted",
  GAME_INVITE_DECLINED: "game:invite:declined",
  GAME_MOVE: "game:move",
  GAME_STATE_SYNC: "game:state:sync",
  GAME_JOIN_BY_CODE: "game:join-by-code",
  GAME_JOINED: "game:joined",

  // XO (Caro) — giao thức realtime có server xác thực nước đi/thắng thua
  XO_MOVE: "game:xo:move",
  XO_MOVE_RESULT: "game:xo:move-result",
  XO_SYNC: "game:xo:sync",
  XO_SYNC_REQUEST: "game:xo:sync:request",
  XO_RESULT: "game:xo:result",
  XO_REMATCH: "game:xo:rematch",

  // Notification events
  NOTIFICATION_NEW: "notification:new",
};

const roomName = (gameId) => `game:${gameId}`;

// Session game realtime (in-memory). Mỗi game một session.
const sessions = new Map(); // gameId -> session

// Code -> gameId mapping for co-op join by code
const gameCodes = new Map(); // code -> { gameId, hostUserId, createdAt }

// ===== Trạng thái chuẩn (authoritative) cho ván XO (Caro) =====
// Trước đây bàn cờ/lượt đi chỉ tồn tại trong bộ nhớ của mỗi trình duyệt,
// server chỉ "relay" nước đi mù — không xác thực đúng lượt, không xác
// thực người gửi có thuộc trận đó không, và cả 2 người chơi luôn bị gán
// cứng là "X" (bug). Giờ server giữ 1 bản ghi cho mỗi trận (theo sessionId
// — mã trận duy nhất của từng cặp người chơi, khác với gameId là ID
// của "trò chơi XO" dùng chung cho mọi người).
const xoMatches = new Map(); // sessionId -> { grid, turn, players:{X,O}, scores:{X,O}, over, lastActivityAt }
const xoRoomName = (sessionId) => `xo:${sessionId}`;
const xoCellKey = (row, col) => `${row},${col}`;

function checkXoWin(grid, row, col, player) {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (const [dr, dc] of directions) {
    let count = 1;
    for (let step = 1; step < 5; step++) {
      if (grid.get(xoCellKey(row + dr * step, col + dc * step)) === player) count++;
      else break;
    }
    for (let step = 1; step < 5; step++) {
      if (grid.get(xoCellKey(row - dr * step, col - dc * step)) === player) count++;
      else break;
    }
    if (count >= 5) return true;
  }
  return false;
}

function startXoMatch(sessionId, hostUserId, guestUserId) {
  const match = {
    grid: new Map(),
    turn: "X",
    players: { X: hostUserId, O: guestUserId },
    scores: { X: 0, O: 0 },
    over: false,
    lastActivityAt: Date.now(),
  };
  xoMatches.set(sessionId, match);
  return match;
}

function xoSyncPayload(sessionId, match, forUserId) {
  return {
    sessionId,
    youAre: match.players.X === forUserId ? "X" : match.players.O === forUserId ? "O" : null,
    cells: [...match.grid.entries()].map(([key, player]) => {
      const [row, col] = key.split(",").map(Number);
      return { row, col, player };
    }),
    turn: match.turn,
    scores: match.scores,
    over: match.over,
  };
}

// Dọn các trận XO không hoạt động quá lâu — tránh rò rỉ bộ nhớ vì có thể
// không bao giờ nhận được sự kiện "kết thúc" tường minh nếu người chơi chỉ
// đơn giản đóng tab thay vì bấm thoát game.
setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000; // 2 giờ không hoạt động
  for (const [sessionId, match] of xoMatches) {
    if (match.lastActivityAt < cutoff) xoMatches.delete(sessionId);
  }
}, 15 * 60 * 1000).unref();
function generateGameCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

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

    // Join user room for targeted notification emit (requires JWT on connect)
    const userId = socket.data.user?.sub;
    if (userId) socket.join(`user:${userId}`);

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
        // Broadcast tin nhắn: DM → user rooms; game → game room
        if (gameId.startsWith("dm:")) {
          const parts = gameId.split(":");
          if (parts.length === 3) {
            io.to(`user:${parts[1]}`).to(`user:${parts[2]}`).emit(EVENTS.CHAT_MESSAGE, msg);
          }
        } else {
          io.to(roomName(gameId)).emit(EVENTS.CHAT_MESSAGE, msg);
        }

        // NOTE: DM notification is already created by the HTTP POST route
        // (/chat/dm/:targetUserId/messages) to avoid duplicates.
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

    // --- GAME INVITE EVENTS ---

    // Player A sends invite to Player B
    socket.on(EVENTS.GAME_INVITE_SEND, async (data = {}) => {
      const { toUserId, gameId, gameName, gameCode } = data;
      const fromUserId = socket.data.user?.sub || socket.data.playerId;
      const fromUsername = socket.data.user?.username || "";
      const fromName = socket.data.user?.name || socket.data.playerId || "Ẩn danh";
      if (!toUserId || !gameId) return;

      // Create game session
      let session = null;
      try {
        session = await gameSessionService.createSession({
          gameId, gameName, gameCode,
          hostUserId: fromUserId,
          hostName: fromName,
        });
        console.log(`[socket] Created game session ${session.id} for game ${gameId}`);
      } catch (e) {
        console.error("[socket] Failed to create game session:", e.message);
      }

      const sessionId = session?.id || null;

      // Save notification to DB
      try {
        await notificationService.createNotification({
          fromUserId, fromUsername, fromName,
          toUserId, gameId, gameName, gameCode,
          type: "game_invite",
          title: `👥 ${fromName} mời chơi`,
          message: gameName || "Tham gia trò chơi",
          data: { sessionId },
        });
      } catch (e) {
        console.error("[socket] Failed to create invite notification:", e.message);
      }

      // Try to deliver via socket (if target is online)
      const targetSocket = findSocketByUserId(io, toUserId);
      if (targetSocket) {
        targetSocket.emit(EVENTS.GAME_INVITE_RECEIVED, {
          fromUserId, fromUsername, fromName,
          gameId, gameName, gameCode, sessionId,
        });
      }

      socket.emit(EVENTS.GAME_INVITE_SEND, { ok: true, toUserId, sessionId });

      // Register game code for join-by-code flow
      if (gameCode) {
        gameCodes.set(gameCode, { gameId, hostUserId: fromUserId, sessionId, createdAt: Date.now() });
      }
    });

    // Player B accepts invite
    socket.on(EVENTS.GAME_INVITE_ACCEPTED, async (data = {}) => {
      const { fromUserId, gameId, sessionId } = data;
      const acceptedBy = socket.data.user?.sub || socket.data.playerId;
      const acceptedByName = socket.data.user?.name || socket.data.playerId || "Ẩn danh";

      // Join game session in DB
      if (sessionId) {
        try {
          await gameSessionService.joinSession(sessionId, {
            guestUserId: acceptedBy,
            guestName: acceptedByName,
          });
        } catch (e) {
          console.error("[socket] Failed to join game session:", e.message);
        }
      }

      // Notify the inviter
      const inviterSocket = findSocketByUserId(io, fromUserId);
      if (inviterSocket) {
        inviterSocket.emit(EVENTS.GAME_INVITE_ACCEPTED, {
          acceptedBy, acceptedByName, gameId, sessionId,
        });
      }

      // Both join the game room
      socket.join(roomName(gameId));
      socket.data.gameId = gameId;
      if (inviterSocket) {
        inviterSocket.join(roomName(gameId));
        inviterSocket.data.gameId = gameId;
      }

      // Khởi tạo trận XO chuẩn (nếu game này dùng giao thức XO) — vô hại
      // với các game khác vì chỉ được tra cứu khi có sự kiện game:xo:*.
      if (sessionId) {
        socket.join(xoRoomName(sessionId));
        if (inviterSocket) inviterSocket.join(xoRoomName(sessionId));
        const match = startXoMatch(sessionId, fromUserId, acceptedBy);
        socket.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, acceptedBy));
        if (inviterSocket) inviterSocket.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, fromUserId));
      }
    });

    // Player B declines invite
    socket.on(EVENTS.GAME_INVITE_DECLINED, (data = {}) => {
      const { fromUserId } = data;
      const declinedBy = socket.data.user?.sub || socket.data.playerId;
      const declinedByName = socket.data.user?.name || socket.data.playerId || "Ẩn danh";

      const inviterSocket = findSocketByUserId(io, fromUserId);
      if (inviterSocket) {
        inviterSocket.emit(EVENTS.GAME_INVITE_DECLINED, {
          declinedBy, declinedByName,
        });
      }
    });

    // Player joins a game room by code
    socket.on(EVENTS.GAME_JOIN_BY_CODE, async (data = {}) => {
      const { code } = data;
      if (!code) return socket.emit(EVENTS.GAME_JOINED, { ok: false, error: "Thiếu mã phòng" });

      const entry = gameCodes.get(code);
      if (!entry) return socket.emit(EVENTS.GAME_JOINED, { ok: false, error: "Mã phòng không hợp lệ hoặc đã hết hạn" });

      const { gameId, hostUserId, sessionId } = entry;
      const joinerName = socket.data.user?.name || socket.data.playerId || "Ẩn danh";
      const joinerId = socket.data.user?.sub || socket.data.playerId;

      // Join game session in DB
      if (sessionId) {
        try {
          await gameSessionService.joinSession(sessionId, {
            guestUserId: joinerId,
            guestName: joinerName,
          });
        } catch (e) {
          console.error("[socket] Failed to join game session by code:", e.message);
        }
      }

      // Join the socket room
      socket.join(roomName(gameId));
      socket.data.gameId = gameId;

      // Notify the host
      const hostSocket = findSocketByUserId(io, hostUserId);
      if (hostSocket) {
        hostSocket.emit(EVENTS.GAME_INVITE_ACCEPTED, {
          acceptedBy: joinerId,
          acceptedByName: joinerName,
          gameId,
          sessionId,
        });
      }

      if (sessionId) {
        socket.join(xoRoomName(sessionId));
        if (hostSocket) hostSocket.join(xoRoomName(sessionId));
        const match = startXoMatch(sessionId, hostUserId, joinerId);
        socket.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, joinerId));
        if (hostSocket) hostSocket.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, hostUserId));
      }

      socket.emit(EVENTS.GAME_JOINED, { ok: true, gameId, hostUserId, sessionId });
    });

    // Multiplayer game move sync (for board games like XO)
    socket.on(EVENTS.GAME_MOVE, (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      if (!gameId) return;
      const playerName = socket.data.user?.name || socket.data.playerId || "Ẩn danh";
      socket.to(roomName(gameId)).emit(EVENTS.GAME_MOVE, {
        ...data,
        playerName,
        playerId: socket.data.playerId || socket.data.user?.sub,
      });
    });

    // Generic state sync for multiplayer games
    socket.on(EVENTS.GAME_STATE_SYNC, (data = {}) => {
      const gameId = data.gameId || socket.data.gameId;
      if (!gameId) return;
      socket.to(roomName(gameId)).emit(EVENTS.GAME_STATE_SYNC, data);
    });

    // ===== XO (Caro) — nước đi được server xác thực & tự tính thắng thua =====
    socket.on(EVENTS.XO_MOVE, (data = {}) => {
      const { sessionId, row, col } = data;
      if (!sessionId || typeof row !== "number" || typeof col !== "number") return;

      const match = xoMatches.get(sessionId);
      if (!match || match.over) return;

      const userId = socket.data.user?.sub || socket.data.playerId;
      const myLetter = match.players.X === userId ? "X" : match.players.O === userId ? "O" : null;
      if (!myLetter) return; // không thuộc trận này — bỏ qua, không cho chèn nước đi vào trận của người khác
      if (myLetter !== match.turn) return; // không đúng lượt

      const key = xoCellKey(row, col);
      if (match.grid.has(key)) return; // ô đã có quân

      match.grid.set(key, myLetter);
      match.lastActivityAt = Date.now();

      const won = checkXoWin(match.grid, row, col, myLetter);
      if (won) {
        match.over = true;
        match.scores[myLetter]++;
      } else {
        match.turn = myLetter === "X" ? "O" : "X";
      }

      // Người gửi đã tự vẽ nước đi của mình (optimistic) — chỉ cần báo cho đối thủ
      socket.to(xoRoomName(sessionId)).emit(EVENTS.XO_MOVE_RESULT, { sessionId, row, col, player: myLetter });

      if (won) {
        io.to(xoRoomName(sessionId)).emit(EVENTS.XO_RESULT, {
          sessionId, winner: myLetter, winnerUserId: userId, scores: match.scores,
        });
        // Server tự cộng xu dựa trên kết quả nó tự tính — không tin số xu
        // do client khai báo qua "add-coins" nữa.
        addCoins(userId, 50).catch((e) => console.error("[socket] xo addCoins failed:", e.message));
      }
    });

    // Client xin đồng bộ lại toàn bộ bàn cờ (mới kết nối / vừa reconnect
    // sau khi rớt mạng / tải lại trang) — trả về trạng thái hiện tại thay
    // vì để ván đấu coi như mất trắng.
    socket.on(EVENTS.XO_SYNC_REQUEST, (data = {}) => {
      const { sessionId } = data;
      if (!sessionId) return;
      const match = xoMatches.get(sessionId);
      if (!match) return;
      socket.join(xoRoomName(sessionId));
      const userId = socket.data.user?.sub || socket.data.playerId;
      socket.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, userId));
    });

    // Chơi lại trong cùng phòng — reset bàn cờ ở server (điểm số giữ
    // nguyên), chỉ người trong trận mới được yêu cầu.
    socket.on(EVENTS.XO_REMATCH, (data = {}) => {
      const { sessionId } = data;
      if (!sessionId) return;
      const match = xoMatches.get(sessionId);
      if (!match) return;
      const userId = socket.data.user?.sub || socket.data.playerId;
      if (match.players.X !== userId && match.players.O !== userId) return;

      match.grid = new Map();
      match.turn = "X";
      match.over = false;
      match.lastActivityAt = Date.now();

      const hostSock = findSocketByUserId(io, match.players.X);
      const guestSock = findSocketByUserId(io, match.players.O);
      if (hostSock) hostSock.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, match.players.X));
      if (guestSock) guestSock.emit(EVENTS.XO_SYNC, xoSyncPayload(sessionId, match, match.players.O));
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

function findSocketByUserId(io, userId) {
  for (const [, s] of io.sockets.sockets) {
    if (s.data.user?.sub === userId || s.data.playerId === userId) return s;
  }
  return null;
}

function startQuestion(io, gameId) {
  const session = sessions.get(gameId);
  if (!session || session.status !== "playing") return;
  const q = session.questions[session.index];
  if (!q) return advance(io, gameId);

  const duration = q.timeLimit || 20;
  session.answered = new Set();
  session.questionStart = Date.now();

  // Gửi câu hỏi KHÔNG kèm đáp án đúng và gameId cho học sinh
  const { correctAnswer, gameId: _gid, ...publicQuestion } = q;
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