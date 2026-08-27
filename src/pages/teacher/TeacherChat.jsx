import { useEffect, useState, useRef, useCallback } from "react";
import { conversationApi } from "../../services/conversationApi.js";
import { userService } from "../../services/api.js";
import { Loader, ErrorState, EmptyState } from "../../components/ui.jsx";
import DMChatScreen from "../user/DMChatScreen.jsx";

export default function TeacherChat({ user, showToast }) {
  const [conversations, setConversations] = useState(null);
  const [error, setError] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = useRef(null);

  const loadConversations = useCallback(() => {
    conversationApi.list().then((data) => {
      setConversations(data);
      setError(null);
    }).catch((e) => {
      setError(e.message);
    });
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    clearTimeout(searchTimeout.current);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    searchTimeout.current = setTimeout(() => {
      userService.search(q).then((results) => {
        setSearchResults(results || []);
      }).catch(() => {
        setSearchResults([]);
      }).finally(() => setSearching(false));
    }, 300);
  }, []);

  const handleStartChat = useCallback(async (targetUser) => {
    try {
      const conv = await conversationApi.getDM(targetUser.id);
      setChatTarget(targetUser);
      setActiveConvId(conv?.id || null);
      setShowSearch(false);
      setSearchQuery("");
      setSearchResults([]);
      loadConversations();
    } catch {
      showToast?.("Không thể tạo cuộc trò chuyện", "error");
    }
  }, [loadConversations, showToast]);

  const handleSelectConversation = useCallback((conv) => {
    const otherId = conv.memberIds?.find((id) => id !== user.id);
    if (otherId && conv.type === "dm") {
      setActiveConvId(conv.id);
      userService.getById(otherId).then((found) => {
        if (found) setChatTarget(found);
      }).catch(() => {});
    }
  }, [user]);

  return (
    <div className="flex h-[calc(100vh-16px)]">
      {/* LEFT: Conversation List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-ink/10 flex flex-col bg-paper shrink-0 ${chatTarget ? "hidden md:flex" : "flex"}`}>
        <div className="px-4 py-4 border-b border-ink/10 flex items-center justify-between shrink-0">
          <h1 className="font-display text-lg text-ink">💬 Tin nhắn</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="px-3 py-1.5 rounded-xl bg-ink text-paper text-xs font-semibold hover:bg-ink2 transition"
          >
            {showSearch ? "✕ Đóng" : "🔍 Tìm người"}
          </button>
        </div>

        {/* User Search */}
        {showSearch && (
          <div className="px-4 py-3 border-b border-ink/10 shrink-0">
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm người dùng..."
              autoFocus
              className="w-full px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink placeholder:text-[#B7A987] outline-none focus:ring-2 focus:ring-ink/10"
            />
            {searching && <p className="text-xs text-[#8A7C63] mt-2">Đang tìm...</p>}
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleStartChat(u)}
                    className="w-full p-2.5 text-left flex items-center gap-3 rounded-xl hover:bg-ink/5 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm text-white font-semibold shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-body text-ink truncate">{u.name}</p>
                      <p className="text-[10px] font-mono text-[#8A7C63]">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <p className="text-xs text-[#8A7C63] mt-2">Không tìm thấy người dùng nào</p>
            )}
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations === null ? (
            <Loader label="Đang tải danh sách..." />
          ) : error ? (
            <ErrorState title="Lỗi tải danh sách" subtitle={error} onRetry={loadConversations} />
          ) : conversations.length === 0 ? (
            <EmptyState
              icon="📭"
              title="Chưa có tin nhắn"
              subtitle="Nhấn 'Tìm người' để bắt đầu cuộc trò chuyện"
            />
          ) : (
            <div className="p-2 space-y-1">
              {conversations.filter(c => c.type === "dm").map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  currentUser={user}
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
            userAuth={{ user }}
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
              Chọn cuộc trò chuyện từ danh sách bên trái hoặc tìm người dùng để bắt đầu nhắn tin
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
    userService.getById(otherId).then((found) => {
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
        {otherUser?.name?.charAt(0)?.toUpperCase() || "💬"}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`font-display text-sm truncate ${isActive ? "text-paper" : "text-ink"}`}>
          {otherUser?.name || "Tin nhắn trực tiếp"}
        </h3>
        <p className={`text-xs font-mono ${isActive ? "text-paper/60" : "text-[#8A7C63]"}`}>
          {otherUser ? `@${otherUser.username}` : "Nhắn tin trực tiếp"}
        </p>
      </div>
    </button>
  );
}
