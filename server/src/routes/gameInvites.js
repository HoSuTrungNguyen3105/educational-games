import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as notificationService from "../services/notificationService.js";
import * as gameSessionService from "../services/gameSessionService.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Helper to generate code like socket.js
function generateGameCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// This will be injected from app.js after io is created — we store reference
let ioRef = null;
export function setGameInviteIO(io) { ioRef = io; }

const EVENTS = {
  GAME_INVITE_RECEIVED: "game:invite:received",
  GAME_INVITE_SEND: "game:invite:send",
};

function findSocketByUserId(io, userId) {
  if (!io) return null;
  for (const [, s] of io.sockets.sockets) {
    if (s.data?.user?.sub === userId || s.data?.playerId === userId) return s;
  }
  return null;
}

const router = Router();

// POST /api/game-invites — gửi lời mời chơi (HTTP, đảm bảo notification + push ngay cả khi socket chưa connect)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const { toUserId, gameId, gameName, gameCode: clientCode } = req.body || {};
    if (!toUserId || !gameId) return sendError(res, "toUserId và gameId là bắt buộc", 400);

    const fromUserId = req.user.sub;
    const fromUsername = req.user.username || "";
    const fromName = req.user.name || fromUsername || "Ẩn danh";

    const gameCode = clientCode || generateGameCode();

    // 1. Create game session (để join by code / sync sau)
    let session = null;
    try {
      session = await gameSessionService.createSession({
        gameId, gameName, gameCode,
        hostUserId: fromUserId,
        hostName: fromName,
      });
    } catch (e) {
      console.error("[game-invites] createSession error:", e.message);
    }
    const sessionId = session?.id || null;

    // 2. Save notification to DB + send FCM push (fire-and-forget inside createNotification)
    let notif = null;
    try {
      notif = await notificationService.createNotification({
        fromUserId, fromUsername, fromName,
        toUserId, gameId, gameName, gameCode,
        type: "game_invite",
        title: `👥 ${fromName} mời chơi`,
        message: gameName ? `${fromName} mời bạn chơi "${gameName}"` : `${fromName} mời bạn chơi cùng`,
        data: { sessionId, gameCode },
      });
    } catch (e) {
      console.error("[game-invites] createNotification error:", e.message);
    }

    // 2b. Also create a DM chat message so it appears in "Tin nhắn" (ConversationList)
    try {
      const { getDmConversationId, sendMessage } = await import("../services/chatService.js");
      const { getOrCreateDM } = await import("../services/conversationService.js");
      await getOrCreateDM(fromUserId, toUserId);
      const dmId = getDmConversationId(fromUserId, toUserId);
      await sendMessage({
        conversationId: dmId,
        senderId: fromUserId,
        playerName: fromName,
        content: `👥 ${fromName} mời bạn chơi "${gameName || 'XO'}" — Mã phòng: ${gameCode}. Vào mục "Tin nhắn" hoặc bấm "Chấp nhận" ở thông báo để tham gia!`,
      });
      // Ensure conversationMembers exists for listing
      const { addMember } = await import("../services/conversationService.js");
      await addMember(dmId, fromUserId, fromName);
      await addMember(dmId, toUserId, null);
    } catch (e) {
      console.error("[game-invites] DM message error:", e.message);
    }

    // 3. Try realtime delivery via socket nếu target đang online
    if (ioRef) {
      const targetSocket = findSocketByUserId(ioRef, toUserId);
      if (targetSocket) {
        targetSocket.emit(EVENTS.GAME_INVITE_RECEIVED, {
          fromUserId, fromUsername, fromName,
          gameId, gameName, gameCode, sessionId,
        });
      }
      // Register code for join-by-code on this io instance (mirror socket.js gameCodes)
      if (!ioRef._gameCodes) ioRef._gameCodes = new Map();
      if (gameCode) ioRef._gameCodes.set(gameCode, { gameId, hostUserId: fromUserId, sessionId, createdAt: Date.now() });
    }

    sendSuccess(res, { ok: true, sessionId, gameCode, notificationId: notif?.id }, "Đã gửi lời mời");
  } catch (e) {
    next(e);
  }
});

export default router;
