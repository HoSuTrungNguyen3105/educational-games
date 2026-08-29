import { useEffect, useState, useRef, useCallback } from "react";
import { conversationApi } from "../../services/conversationApi.js";
import { userService } from "../../services/api.js";
import { Loader, ErrorState } from "../../components/ui.jsx";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const handleNewChat = useCallback(() => {
    setChatTarget(null);
    setActiveConvId(null);
    setShowSearch(true);
  }, []);

  return (
    <div className="h-[calc(100vh-16px)] flex rounded-2xl border border-ink/10 overflow-hidden bg-paper shadow-xl">
      {/* SIDEBAR */}
      <aside className={`w-72 lg:w-80 flex flex-col border-r border-ink/10 shrink-0 ${chatTarget ? "hidden md:flex" : "flex"}`}>
        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-ink/10 flex items-center justify-between shrink-0">
          <h1 className="font-display text-lg text-ink">Messages</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center text-ink/50 hover:bg-ink/5 hover:text-ink transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
          </button>
        </div>

        {/* New Chat + Search */}
        <div className="px-4 py-3 flex gap-2 shrink-0">
          <button onClick={handleNewChat} className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-ink/5 border border-ink/10 text-sm font-body text-ink hover:bg-ink/10 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            New Chat
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className={`w-9 h-9 rounded-xl border border-ink/10 flex items-center justify-center transition ${showSearch ? "bg-ink text-paper" : "bg-ink/5 text-ink/50 hover:bg-ink/10 hover:text-ink"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
          </button>
        </div>

        {/* Search Panel */}
        {showSearch && (
          <div className="px-4 py-3 border-b border-ink/10 shrink-0">
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm người dùng..."
              autoFocus
              className="w-full px-3 py-2 rounded-xl border border-ink/10 text-sm font-body text-ink placeholder:text-ink/30 outline-none focus:border-ticket bg-ink/5"
            />
            {searching && <p className="text-xs text-ink/40 mt-2">Đang tìm...</p>}
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {searchResults.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleStartChat(u)}
                    className="w-full p-2.5 text-left flex items-center gap-3 rounded-xl hover:bg-ink/5 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-ticket/20 text-ticket flex items-center justify-center text-sm font-semibold shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-body text-ink truncate">{u.name}</p>
                      <p className="text-[10px] font-mono text-ink/40">@{u.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
              <p className="text-xs text-ink/40 mt-2">Không tìm thấy</p>
            )}
          </div>
        )}

        {/* Recents Label */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-ink/40 uppercase tracking-wider shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          Recents
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {conversations === null ? (
            <Loader label="Đang tải..." />
          ) : error ? (
            <ErrorState title="Lỗi" subtitle={error} onRetry={loadConversations} />
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-xs text-ink/40">Chưa có tin nhắn</p>
            </div>
          ) : (
            <div className="space-y-0.5">
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

        {/* Sidebar Footer - User */}
        <div className="px-4 py-3 border-t border-ink/10 shrink-0">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink/5 transition cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-ticket/20 text-ticket flex items-center justify-center text-xs font-semibold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-xs text-ink/40 truncate">{user?.email || user?.name}</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 flex flex-col min-w-0 bg-paper/30 ${chatTarget ? "flex" : "hidden md:flex"}`}>
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
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3">
            <div className="text-6xl opacity-40">💬</div>
            <h2 className="font-display text-xl text-ink/60">Chọn một cuộc trò chuyện</h2>
            <p className="text-sm text-ink/30 max-w-xs">
              Chọn cuộc trò chuyện từ danh sách bên trái hoặc tìm người dùng để bắt đầu nhắn tin
            </p>
          </div>
        )}
      </main>
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
      className={`w-full p-2.5 text-left flex items-center gap-3 rounded-xl transition ${
        isActive
          ? "bg-ink/10 text-ink"
          : "hover:bg-ink/5 text-ink"
      }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 font-semibold ${
        isActive
          ? "bg-ticket/20 text-ticket"
          : "bg-ink/5 text-ink/50"
      }`}>
        {otherUser?.name?.charAt(0)?.toUpperCase() || "💬"}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-body truncate ${isActive ? "text-ink font-semibold" : "text-ink"}`}>
          {otherUser?.name || "Tin nhắn trực tiếp"}
        </h3>
        <p className="text-[11px] font-mono text-ink/40 truncate">
          {otherUser ? `@${otherUser.username}` : "Nhắn tin trực tiếp"}
        </p>
      </div>
    </button>
  );
}
