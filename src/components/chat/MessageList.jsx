import { useRef, useEffect, useCallback } from "react";
import { useChatStore } from "../../stores/chat.store.js";
import MessageItem from "./MessageItem.jsx";

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const isLoadingMore = useChatStore((s) => s.isLoadingMore);
  const hasMore = useChatStore((s) => s.hasMore);
  const playerId = useChatStore((s) => s.playerId);
  const isAtBottom = useChatStore((s) => s.isAtBottom);
  const setAtBottom = useChatStore((s) => s.setAtBottom);
  const loadMore = useChatStore((s) => s.loadMore);
  const retry = useChatStore((s) => s.retry);

  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const prevCountRef = useRef(0);

  // Auto-scroll when new messages arrive and user is at bottom
  useEffect(() => {
    if (isAtBottom && messages.length > prevCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = messages.length;
  }, [messages.length, isAtBottom]);

  // Scroll to bottom on first load
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [isLoading]);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setAtBottom(atBottom);
    // Load more when near top
    if (el.scrollTop < 60 && hasMore && !isLoadingMore) {
      const prevHeight = el.scrollHeight;
      loadMore().then(() => {
        // Preserve scroll position after prepending
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - prevHeight;
        });
      });
    }
  }, [hasMore, isLoadingMore, loadMore, setAtBottom]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[#8A7C63]">
        Đang tải tin nhắn...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 gap-2">
        <span className="text-3xl">💬</span>
        <p className="text-sm text-[#8A7C63]">Chưa có tin nhắn nào</p>
        <p className="text-xs text-[#B7A987]">Gửi tin nhắn đầu tiên để bắt đầu trò chuyện!</p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-2 scroll-smooth"
    >
      {isLoadingMore && (
        <div className="text-center text-xs text-[#B7A987] py-2">Đang tải tin nhắn cũ...</div>
      )}
      {hasMore && !isLoadingMore && (
        <button onClick={loadMore} className="w-full text-center text-xs text-ink/40 hover:text-ink/60 py-1 transition">
          Tải tin nhắn cũ hơn ↑
        </button>
      )}
      {messages.map((msg, i) => {
        const prev = messages[i - 1];
        const showSender = !prev || prev.senderId !== msg.senderId;
        const isOwn = msg.senderId === playerId;
        return (
          <MessageItem
            key={msg.id || i}
            message={{ ...msg, _retry: retry }}
            isOwn={isOwn}
            showSender={showSender}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
