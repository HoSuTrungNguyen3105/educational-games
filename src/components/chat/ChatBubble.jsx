import { useChatStore } from "../../stores/chat.store.js";
import MessageList from "./MessageList.jsx";
import MessageComposer from "./MessageComposer.jsx";

export default function ChatBubble({ userAuth, onUserLogin }) {
  const isOpen = useChatStore((s) => s.isOpen);
  const toggleOpen = useChatStore((s) => s.toggleOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Bubble button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="w-12 h-12 rounded-full bg-ink text-paper shadow-xl flex items-center justify-center text-xl hover:bg-ink2 transition active:scale-95"
          title="Mở chat"
        >
          💬
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ticket text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat overlay */}
      {isOpen && (
        <div className="w-[320px] max-h-[400px] bg-white rounded-2xl shadow-2xl border border-ink/10 flex flex-col overflow-hidden anim-pop">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-ink/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span className="font-display text-sm text-ink">Chat</span>
              {unreadCount > 0 && (
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
                title="Đóng chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <MessageList />
          </div>

          {/* Composer */}
          <MessageComposer userAuth={userAuth} onUserLogin={onUserLogin} />
        </div>
      )}
    </div>
  );
}
