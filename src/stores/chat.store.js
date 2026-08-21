import { create } from "zustand";
import { chatApi } from "../services/chatApi.js";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";

const MAX_MESSAGES = 200;

export const useChatStore = create((set, get) => ({
  // State
  gameId: null,
  playerId: null,
  playerName: "",
  messages: [],
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  isSending: false,
  unreadCount: 0,
  isOpen: false,
  isAtBottom: true,
  typingUsers: [],

  // Actions
  init: (gameId, playerId, playerName) => {
    console.log("[chat] init:", { gameId, playerId, playerName });
    set({ gameId, playerId, playerName, messages: [], hasMore: true, unreadCount: 0 });
    get().loadInitial();
    get().listenSocket();
  },

  reset: () => {
    const { gameId } = get();
    if (gameId) {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE, get()._onMessage);
      socket.off(SOCKET_EVENTS.CHAT_TYPING, get()._onTyping);
    }
    set({
      gameId: null, playerId: null, playerName: "",
      messages: [], hasMore: true, isLoading: false, isLoadingMore: false,
      isSending: false, unreadCount: 0, isOpen: false, isAtBottom: true, typingUsers: [],
    });
  },

  setOpen: (open) => {
    set({ isOpen: open });
    if (open) {
      // Mark read with latest message
      const { messages, gameId, playerId } = get();
      if (messages.length > 0 && gameId && playerId) {
        const last = messages[messages.length - 1];
        chatApi.markRead(gameId, playerId, last.id).catch(() => {});
        set({ unreadCount: 0 });
      }
    }
  },

  toggleOpen: () => get().setOpen(!get().isOpen),

  setAtBottom: (atBottom) => set({ isAtBottom: atBottom }),

  loadInitial: async () => {
    const { gameId } = get();
    if (!gameId || get().isLoading) return;
    console.log("[chat] loadInitial for gameId:", gameId);
    set({ isLoading: true });
    try {
      const res = await chatApi.listMessages(gameId, { limit: 30 });
      console.log("[chat] loadInitial result:", res);
      set({ messages: res.items || [], hasMore: res.hasMore, isLoading: false });
    } catch (e) {
      console.error("[chat] loadInitial error:", e);
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { gameId, messages, hasMore, isLoadingMore } = get();
    if (!gameId || !hasMore || isLoadingMore) return;
    const oldest = messages[0];
    if (!oldest) return;
    set({ isLoadingMore: true });
    try {
      const res = await chatApi.listMessages(gameId, { before: oldest.id, limit: 30 });
      const older = res.items || [];
      set((s) => ({
        messages: [...older, ...s.messages].slice(-MAX_MESSAGES),
        hasMore: res.hasMore,
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },

  send: async (content) => {
    const { gameId, playerId, playerName } = get();
    if (!content?.trim() || !gameId || !playerId) {
      console.log("[chat] send blocked:", { gameId, playerId, content });
      return;
    }
    console.log("[chat] send:", { gameId, playerId, content: content.trim() });
    const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimistic = {
      id: clientMessageId,
      conversationId: gameId,
      senderId: playerId,
      playerName,
      type: "text",
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: "sending",
    };
    set((s) => ({
      messages: [...s.messages, optimistic],
      isSending: true,
    }));
    try {
      // Try REST first
      const saved = await chatApi.sendMessage(gameId, {
        content: content.trim(),
        senderId: playerId,
        playerName,
        clientMessageId,
      });
      // Replace optimistic with real
      set((s) => ({
        messages: s.messages.map((m) => m.id === clientMessageId ? { ...saved, status: "sent" } : m),
        isSending: false,
      }));
    } catch (e) {
      console.error("[chat] send REST error:", e);
      // Fallback: try via socket
      socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, {
        gameId, content: content.trim(), playerName, clientMessageId,
      });
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === clientMessageId ? { ...m, status: "sent" } : m
        ),
        isSending: false,
      }));
    }
  },

  retry: async (failedMessage) => {
    if (!failedMessage) return;
    // Remove old optimistic, re-send
    set((s) => ({ messages: s.messages.filter((m) => m.id !== failedMessage.id) }));
    await get().send(failedMessage.content);
  },

  // Internal: socket listener refs
  _onMessage: null,
  _onTyping: null,

  listenSocket: () => {
    const { gameId } = get();
    if (!gameId) return;

    const onMessage = (msg) => {
      if (msg.error) return;
      const { playerId, isOpen } = get();
      set((s) => {
        // Dedup
        if (s.messages.some((m) => m.id === msg.id)) return s;
        // Also check clientMessageId
        const replaced = s.messages.map((m) =>
          m.status === "sending" && m.clientMessageId === msg.clientMessageId ? { ...msg, status: "sent" } : m
        );
        const next = [...replaced, msg].slice(-MAX_MESSAGES);
        const isFromMe = msg.senderId === playerId;
        const newUnread = !isOpen && !isFromMe ? s.unreadCount + 1 : s.unreadCount;
        return { messages: next, unreadCount: newUnread };
      });
    };

    const onTyping = (data) => {
      if (data.playerId === get().playerId) return;
      set((s) => {
        const exists = s.typingUsers.find((u) => u.playerId === data.playerId);
        if (data.isTyping) {
          if (exists) return s;
          return { typingUsers: [...s.typingUsers, { playerId: data.playerId, playerName: data.playerName }] };
        }
        return { typingUsers: s.typingUsers.filter((u) => u.playerId !== data.playerId) };
      });
    };

    // Clean old listeners
    socket.off(SOCKET_EVENTS.CHAT_MESSAGE, get()._onMessage);
    socket.off(SOCKET_EVENTS.CHAT_TYPING, get()._onTyping);

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, onMessage);
    socket.on(SOCKET_EVENTS.CHAT_TYPING, onTyping);

    set({ _onMessage: onMessage, _onTyping: onTyping });
  },
}));
