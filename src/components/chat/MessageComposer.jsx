import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../stores/chat.store.js";
import { socket } from "../../socket/socket.js";
import { SOCKET_EVENTS } from "../../socket/socket.events.js";

export default function MessageComposer({ userAuth, onUserLogin }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const send = useChatStore((s) => s.send);
  const isSending = useChatStore((s) => s.isSending);
  const gameId = useChatStore((s) => s.gameId);
  const isOpen = useChatStore((s) => s.isOpen);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleTyping = () => {
    socket.emit(SOCKET_EVENTS.CHAT_TYPING, { gameId, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.CHAT_TYPING, { gameId, isTyping: false });
    }, 2000);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    send(trimmed);
    setText("");
    clearTimeout(typingTimeoutRef.current);
    socket.emit(SOCKET_EVENTS.CHAT_TYPING, { gameId, isTyping: false });
  };

  // Chưa đăng nhập → hiển thị nút đăng nhập
  if (!userAuth?.user) {
    return (
      <div className="flex items-center justify-center p-3 bg-white border-t border-ink/10 shrink-0">
        <button
          onClick={onUserLogin}
          className="text-sm text-teal font-semibold hover:underline"
        >
          Đăng nhập để chat →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-2 bg-white border-t border-ink/10 shrink-0 pb-[max(env(safe-area-inset-bottom),8px)]">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => { setText(e.target.value); handleTyping(); }}
        placeholder="Nhập tin nhắn..."
        maxLength={500}
        className="flex-1 bg-paper rounded-xl px-3 py-2 text-sm font-body text-ink placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10 min-h-[36px]"
      />
      <button
        type="submit"
        disabled={!text.trim() || isSending}
        className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center text-sm font-bold hover:bg-ink2 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        title="Gửi"
      >
        {isSending ? "..." : "↑"}
      </button>
    </form>
  );
}
