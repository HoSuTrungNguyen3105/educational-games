import { useEffect, useState, useRef } from "react";
import { conversationApi } from "../../services/conversationApi.js";
import { userService } from "../../services/api.js";
import { Loader, ErrorState, EmptyState } from "../../components/ui.jsx";
import { navigate } from "../../lib/router.js";
import DMChatScreen from "./DMChatScreen.jsx";

export default function ConversationListScreen({ userAuth, onLogout }) {
  const [state, setState] = useState({ conversations: null, error: null });
  const [chatTarget, setChatTarget] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const loadingRef = useRef(false);
  const token = userAuth?.token;

  useEffect(() => {
    if (!userAuth?.user || !token) return;
    let cancelled = false;
    loadingRef.current = true;
    conversationApi.list().then((data) => {
      if (!cancelled) setState({ conversations: data, error: null });
    }).catch((e) => {
      if (!cancelled) setState({ conversations: null, error: e.message });
    }).finally(() => {
      loadingRef.current = false;
    });
    return () => { cancelled = true; };
  }, [userAuth, token]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="font-display text-xl text-ink mb-2">Đăng nhập để xem tin nhắn</h2>
          <p className="text-sm text-[#8A7C63]">Bạn cần đăng nhập để sử dụng tính năng chat</p>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (conv) => {
    const otherId = conv.memberIds?.find((id) => id !== userAuth.user.id);
    if (otherId && conv.type === "dm") {
      setActiveConvId(conv.id);
      userService.getById(otherId).then((found) => {
        if (found) setChatTarget(found);
      }).catch(() => {});
    }
  };

  return (
    <div className="flex-1 flex h-full min-h-0">
      {/* LEFT: Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-ink/10 flex flex-col bg-paper shrink-0 ${chatTarget ? "hidden md:flex" : "flex"}`}>
        <div className="px-4 py-4 border-b border-ink/10 flex items-center justify-between shrink-0">
          <h1 className="font-display text-lg text-ink">💬 Tin nhắn</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/find-friends")}
              className="px-3 py-1.5 rounded-xl bg-ink text-paper text-xs font-semibold hover:bg-ink2 transition"
            >
              🔍 Tìm bạn
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-xs text-red-500 font-semibold hover:text-red-600 transition"
              >
                🚪 Đăng xuất
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {state.conversations === null ? (
            <Loader label="Đang tải danh sách..." />
          ) : state.error ? (
            <ErrorState title="Lỗi tải danh sách" subtitle={state.error} onRetry={() => setState({ conversations: null, error: null })} />
          ) : state.conversations.length === 0 ? (
            <EmptyState
              icon="📭"
              title="Chưa có tin nhắn"
              subtitle="Bạn chưa có cuộc trò chuyện nào. Hãy tìm bạn để bắt đầu chat!"
            />
          ) : (
            <div className="p-2 space-y-1">
              {state.conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  currentUser={userAuth.user}
                  isActive={conv.id === activeConvId}
                  onClick={() => handleSelectConversation(conv)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className={`flex-1 flex flex-col min-h-0 min-w-0 ${chatTarget ? "flex" : "hidden md:flex"}`}>
        {chatTarget ? (
          <DMChatScreen
            targetUser={chatTarget}
            userAuth={userAuth}
            onBack={() => {
              setChatTarget(null);
              setActiveConvId(null);
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3 bg-paper/50">
            <div className="text-6xl float-slow">💬</div>
            <h2 className="font-display text-xl text-ink">Chọn một cuộc trò chuyện</h2>
            <p className="text-sm text-[#8A7C63] max-w-xs">
              Chọn cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({ conversation, currentUser, onClick, isActive }) {
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    if (conversation.type !== "dm" || !conversation.memberIds) return;
    const otherId = conversation.memberIds.find((id) => id !== currentUser.id);
    if (!otherId) return;
    userService.getById(otherId, "user").then((found) => {
      if (found) setOtherUser(found);
    }).catch(() => {});
  }, [conversation, currentUser]);

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 text-left flex items-center gap-3 rounded-xl transition ${
        isActive
          ? "bg-ink text-paper"
          : "hover:bg-ink/5 text-ink"
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 font-semibold ${
        isActive
          ? "bg-paper/20 text-paper"
          : "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
      }`}>
        {otherUser?.name?.charAt(0)?.toUpperCase() || (conversation.type === "game_room" ? "🎮" : "💬")}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-display text-sm truncate ${isActive ? "text-paper" : "text-ink"}`}>
          {otherUser?.name || conversation.name || (conversation.type === "game_room" ? "Phòng game" : "Tin nhắn trực tiếp")}
        </h3>
        <p className={`text-xs font-mono ${isActive ? "text-paper/60" : "text-[#8A7C63]"}`}>
          {conversation.type === "game_room" ? "Phòng game" : otherUser ? `@${otherUser.username}` : "Nhắn tin trực tiếp"}
        </p>
      </div>
    </button>
  );
}
