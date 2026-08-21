import { useChatStore } from "../../stores/chat.store.js";

export default function ChatHeader({ userAuth, onUserLogin }) {
  const unreadCount = useChatStore((s) => s.unreadCount);
  const toggleOpen = useChatStore((s) => s.toggleOpen);
  const isOpen = useChatStore((s) => s.isOpen);

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-ink/10 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-lg">💬</span>
        <span className="font-display text-sm text-ink">Chat</span>
        {unreadCount > 0 && !isOpen && (
          <span className="w-5 h-5 rounded-full bg-ticket text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {userAuth?.user ? (
          <span className="text-[10px] text-[#8A7C63] font-mono mr-1">{userAuth.user.name}</span>
        ) : (
          <button
            onClick={onUserLogin}
            className="text-[10px] text-teal font-semibold hover:underline mr-1"
          >
            Đăng nhập
          </button>
        )}
        <button
          onClick={toggleOpen}
          className="w-8 h-8 rounded-full flex items-center justify-center text-ink/50 hover:text-ink hover:bg-ink/5 transition"
          title={isOpen ? "Đóng chat" : "Mở chat"}
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>
    </div>
  );
}
