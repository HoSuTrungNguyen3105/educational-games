import { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from "../../services/chatApi.js";
import { useUserAuthStore } from "../../stores/userAuth.store.js";
import { Loader } from "../../components/ui.jsx";

export default function DMChatScreen({ targetUser, onBack }) {
  const user = useUserAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const bottomRef = useRef(null);

  const loadMessages = useCallback(async () => {
    if (!targetUser?.id) return;
    setLoading(true);
    try {
      const res = await chatApi.listDmMessages(targetUser.id, { limit: 50 });
      setMessages(res.items || []);
    } catch (e) {
      console.error("[dm] load error:", e);
    } finally {
      setLoading(false);
    }
  }, [targetUser?.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [loading, messages.length]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimistic = {
      id: clientMessageId,
      conversationId: `dm:${user.id}:${targetUser.id}`,
      senderId: user.id,
      playerName: user.name,
      type: "text",
      content: trimmed,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setSending(true);

    try {
      const saved = await chatApi.sendDmMessage(targetUser.id, {
        content: trimmed,
        clientMessageId,
      });
      setMessages((prev) => prev.map((m) =>
        m.id === clientMessageId ? { ...saved, status: "sent" } : m
      ));
    } catch (e) {
      console.error("[dm] send error:", e);
      setMessages((prev) => prev.map((m) =>
        m.id === clientMessageId ? { ...m, status: "failed" } : m
      ));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-white border-b border-ink/10 shrink-0">
        <button onClick={onBack} className="text-sm text-[#8A7C63] hover:text-ink">←</button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm text-white font-semibold shrink-0">
          {targetUser.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-sm text-ink truncate">{targetUser.name}</h2>
          <p className="text-[10px] text-[#8A7C63] font-mono">@{targetUser.username}</p>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader label="Đang tải tin nhắn..." />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 gap-2">
          <span className="text-3xl">💬</span>
          <p className="text-sm text-[#8A7C63]">Bắt đầu trò chuyện với {targetUser.name}!</p>
        </div>
      ) : (
        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {messages.map((msg, i) => {
            const isOwn = msg.senderId === user?.id;
            const prev = messages[i - 1];
            const showSender = !prev || prev.senderId !== msg.senderId;
            return (
              <div key={msg.id || i} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                {showSender && (
                  <span className="text-[10px] font-mono mb-0.5 px-1 text-[#8A7C63]">
                    {msg.playerName || "Ẩn danh"}
                  </span>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body break-words ${
                  isOwn
                    ? "bg-ink text-paper rounded-br-md"
                    : "bg-white border border-ink/10 text-ink rounded-bl-md"
                } ${msg.status === "sending" ? "opacity-60" : ""} ${msg.status === "failed" ? "border-ticket/50 opacity-70" : ""}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSend} className="flex items-end gap-2 p-2 bg-white border-t border-ink/10 shrink-0 pb-[max(env(safe-area-inset-bottom),8px)]">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          maxLength={500}
          className="flex-1 bg-paper rounded-xl px-3 py-2 text-sm font-body text-ink placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10 min-h-[36px]"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-sm font-bold hover:bg-ink2 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          {sending ? "..." : "↑"}
        </button>
      </form>
    </div>
  );
}
