import { useChatStore } from "../../stores/chat.store.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageList from "./MessageList.jsx";
import MessageComposer from "./MessageComposer.jsx";

export default function ChatPanel({ className = "", userAuth, onUserLogin, onUserLogout }) {
  const isOpen = useChatStore((s) => s.isOpen);
  const toggleOpen = useChatStore((s) => s.toggleOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);

  return (
    <>
      {/* Desktop: sidebar panel - always show messages + input */}
      <div className={`hidden lg:flex flex-col w-72 bg-paper2 border-l border-ink/10 shrink-0 ${className}`}>
        <ChatHeader userAuth={userAuth} onUserLogin={onUserLogin} onUserLogout={onUserLogout} />
        <MessageList />
        <MessageComposer userAuth={userAuth} />
      </div>

      {/* Mobile: floating button + fullscreen overlay */}
      <div className="lg:hidden">
        {/* Floating chat button */}
        {!isOpen && (
          <button
            onClick={toggleOpen}
            className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-ink text-paper shadow-xl flex items-center justify-center text-xl hover:bg-ink2 transition active:scale-95"
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

        {/* Fullscreen overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-paper2 anim-fade">
            <ChatHeader userAuth={userAuth} onUserLogin={onUserLogin} onUserLogout={onUserLogout} />
            <MessageList />
            <MessageComposer userAuth={userAuth} />
          </div>
        )}
      </div>
    </>
  );
}
