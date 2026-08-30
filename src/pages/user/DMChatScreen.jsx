import { useState, useEffect, useRef } from "react";
import { chatApi } from "../../services/chatApi.js";
import { Loader } from "../../components/ui.jsx";
import { ArrowLeft, Send, Smile } from "lucide-react";

function formatMessageTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("vi", { hour: "2-digit", minute: "2-digit" });
}

export default function DMChatScreen({ targetUser, userAuth, onBack }) {
  const user = userAuth?.user;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const targetUserId = targetUser?.id;

  useEffect(() => {
    if (!targetUserId) return;
    let cancelled = false;
    setLoading(true);
    chatApi.listDmMessages(targetUserId, { limit: 50 }).then((res) => {
      if (!cancelled) {
        setMessages(res || []);
        setLoading(false);
      }
    }).catch((e) => {
      console.error("[dm] load error:", e);
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [targetUserId]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [loading, messages.length]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending || !user) return;

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
      inputRef.current?.focus();
    }
  };

  // Group messages by date
  const groupedMessages = [];
  let lastDate = "";
  for (const msg of messages) {
    const d = new Date(msg.createdAt).toLocaleDateString("vi");
    if (d !== lastDate) {
      groupedMessages.push({ type: "date", date: d, id: `date-${d}` });
      lastDate = d;
    }
    groupedMessages.push({ type: "message", ...msg });
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-paper/30">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-paper border-b border-ink/8 shrink-0 pb-[max(env(safe-area-inset-top),8px)]">
        <button onClick={onBack}
          className="p-1.5 rounded-xl hover:bg-ink/5 transition text-ink/60 hover:text-ink md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm text-white font-bold">
            {targetUser.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-paper" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-sm text-ink truncate">{targetUser.name}</h2>
          <p className="text-[10px] text-green-500 font-body">Đang hoạt động</p>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader label="Đang tải tin nhắn..." />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
            <Smile className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-body text-ink/60">Bắt đầu trò chuyện với</p>
            <p className="text-sm font-display text-ink">{targetUser.name}</p>
          </div>
        </div>
      ) : (
        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {groupedMessages.map((item, i) => {
            if (item.type === "date") {
              return (
                <div key={item.id} className="flex items-center justify-center py-2">
                  <span className="px-3 py-1 bg-ink/5 rounded-full text-[10px] font-mono text-ink/40">
                    {item.date}
                  </span>
                </div>
              );
            }

            const msg = item;
            const isOwn = msg.senderId === user?.id;
            const prev = groupedMessages[i - 1];
            const next = groupedMessages[i + 1];
            const showSender = !prev || prev.type === "date" || prev.senderId !== msg.senderId;
            const isLastInGroup = !next || next.type === "date" || next.senderId !== msg.senderId;

            return (
              <div key={msg.id || i} className={`flex flex-col ${isOwn ? "items-end" : "items-start"} ${showSender ? "mt-2" : "mt-0.5"}`}>
                {showSender && !isOwn && (
                  <span className="text-[10px] font-body mb-0.5 px-1 text-ink/40">
                    {msg.playerName || "Ẩn danh"}
                  </span>
                )}
                <div className={`max-w-[75%] px-3.5 py-2 text-sm font-body break-words ${
                  isOwn
                    ? `bg-ink text-paper ${isLastInGroup ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                    : `bg-white border border-ink/8 text-ink ${isLastInGroup ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                } ${msg.status === "sending" ? "opacity-50" : ""} ${msg.status === "failed" ? "border-red-300 opacity-70" : ""}`}>
                  {msg.content}
                </div>
                {isLastInGroup && (
                  <span className={`text-[9px] font-mono mt-0.5 px-1 ${isOwn ? "text-ink/25" : "text-ink/25"}`}>
                    {formatMessageTime(msg.createdAt)}
                    {isOwn && msg.status === "sent" && " ✓"}
                    {isOwn && msg.status === "failed" && " ✗"}
                  </span>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSend}
        className="flex items-end gap-2 p-2 bg-paper border-t border-ink/8 shrink-0 pb-[max(env(safe-area-inset-bottom),8px)]">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          maxLength={500}
          className="flex-1 bg-ink/5 rounded-2xl px-4 py-2.5 text-sm font-body text-ink placeholder:text-ink/30 outline-none focus:ring-2 focus:ring-gold/30 transition min-h-[40px]"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-gold/80 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
