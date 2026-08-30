import { useEffect, useState, useRef, useCallback } from "react";
import { conversationApi } from "../../services/conversationApi.js";
import { userService } from "../../services/api.js";
import { Loader, ErrorState, EmptyState } from "../../components/ui.jsx";
import { navigate } from "../../lib/router.js";
import DMChatScreen from "./DMChatScreen.jsx";
import { Search, ArrowLeft, MessageCircle, Users, UserPlus, RefreshCw } from "lucide-react";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút`;
  if (diffHr < 24) return `${diffHr} giờ`;
  if (diffDay < 7) return `${diffDay} ngày`;

  return d.toLocaleDateString("vi", { day: "2-digit", month: "2-digit" });
}

function truncate(str, len = 45) {
  if (!str) return "";
  return str.length > len ? str.slice(0, len) + "..." : str;
}

export default function ConversationListScreen({ userAuth, onLogout }) {
  const [conversations, setConversations] = useState(null);
  const [error, setError] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const [activeConvId, setActiveConvId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCache, setUserCache] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const loadingRef = useRef(false);
  const token = userAuth?.token;

  const loadConversations = useCallback(async () => {
    if (!userAuth?.user || !token) return;
    if (loadingRef.current) return;
    loadingRef.current = true;
    setRefreshing(true);
    try {
      const data = await conversationApi.list();
      setConversations(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      loadingRef.current = false;
      setRefreshing(false);
    }
  }, [userAuth, token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Fetch other user info for each conversation
  useEffect(() => {
    if (!conversations || !userAuth?.user) return;
    const ids = new Set();
    for (const conv of conversations) {
      if (conv.type !== "dm" || !conv.memberIds) continue;
      const otherId = conv.memberIds.find(id => id !== userAuth.user.id);
      if (otherId && !userCache[otherId]) ids.add(otherId);
    }
    if (ids.size === 0) return;

    for (const uid of ids) {
      userService.getById(uid, "user").then(found => {
        if (found) setUserCache(prev => ({ ...prev, [uid]: found }));
      }).catch(() => {});
    }
  }, [conversations, userAuth?.user]);

  const handleSelectConversation = useCallback((conv) => {
    const otherId = conv.memberIds?.find(id => id !== userAuth.user.id);
    if (otherId && conv.type === "dm") {
      setActiveConvId(conv.id);
      // Mark as read
      conversationApi.markRead(conv.id).catch(() => {});
      // Update unread to 0 locally
      setConversations(prev => prev?.map(c =>
        c.id === conv.id ? { ...c, unread: 0 } : c
      )) || [];
      const target = userCache[otherId];
      if (target) {
        setChatTarget(target);
      } else {
        userService.getById(otherId, "user").then(found => {
          if (found) setChatTarget(found);
        }).catch(() => {});
      }
    }
  }, [userAuth?.user, userCache]);

  const handleBack = useCallback(() => {
    setChatTarget(null);
    setActiveConvId(null);
    loadConversations();
  }, [loadConversations]);

  if (!userAuth?.user) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">Đăng nhập để xem tin nhắn</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để sử dụng tính năng chat</p>
          <button onClick={() => navigate("/")}
            className="px-5 py-2 bg-gold text-white rounded-xl font-body font-semibold hover:bg-gold/80 transition">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const filtered = (conversations || []).filter(conv => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const otherId = conv.memberIds?.find(id => id !== userAuth.user.id);
    const other = otherId ? userCache[otherId] : null;
    const name = (other?.name || conv.name || "").toLowerCase();
    const username = (other?.username || "").toLowerCase();
    return name.includes(q) || username.includes(q);
  });

  const totalUnread = (conversations || []).reduce((sum, c) => sum + (c.unread || 0), 0);

  return (
    <div className="h-full flex flex-col md:flex-row min-h-0 bg-paper overflow-hidden">
      {/* LEFT: Conversation List */}
      <div className={`w-full md:w-80 lg:w-[360px] border-r border-ink/8 flex flex-col shrink-0 h-full min-h-0 ${chatTarget ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-ink/8 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg text-ink">Tin nhắn</h1>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full font-mono">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={loadConversations}
                className="p-2 rounded-xl hover:bg-ink/5 transition text-ink/40 hover:text-ink"
                title="Làm mới">
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button onClick={() => navigate("/find-friends")}
                className="p-2 rounded-xl hover:bg-ink/5 transition text-ink/40 hover:text-ink"
                title="Tìm bạn">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-ink/5 border border-ink/8 text-sm font-body text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40 transition"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {conversations === null ? (
            <div className="flex items-center justify-center h-40">
              <Loader label="Đang tải..." />
            </div>
          ) : error ? (
            <div className="p-4">
              <ErrorState title="Lỗi tải danh sách" subtitle={error}
                onRetry={loadConversations} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mb-3">
                <MessageCircle className="w-7 h-7 text-ink/20" />
              </div>
              <p className="text-sm font-body text-ink/40">
                {searchQuery ? "Không tìm thấy kết quả" : "Chưa có tin nhắn nào"}
              </p>
              {!searchQuery && (
                <button onClick={() => navigate("/find-friends")}
                  className="mt-2 text-xs font-body text-gold hover:text-gold/80 transition">
                  Tìm bạn để bắt đầu chat →
                </button>
              )}
            </div>
          ) : (
            <div className="py-1">
              {filtered.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  currentUser={userAuth.user}
                  otherUser={conv.memberIds?.find(id => id !== userAuth.user.id) ? userCache[conv.memberIds.find(id => id !== userAuth.user.id)] : null}
                  isActive={conv.id === activeConvId}
                  onClick={() => handleSelectConversation(conv)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className={`h-full flex flex-col min-h-0 min-w-0 overflow-hidden flex-1 ${chatTarget ? "flex" : "hidden md:flex"}`}>
        {chatTarget ? (
          <DMChatScreen
            targetUser={chatTarget}
            userAuth={userAuth}
            onBack={handleBack}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center mb-2">
              <MessageCircle className="w-10 h-10 text-purple-300" />
            </div>
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

function ConversationItem({ conversation, currentUser, otherUser, onClick, isActive }) {
  const name = otherUser?.name || conversation.name || (conversation.type === "game_room" ? "Phòng game" : "Tin nhắn");
  const username = otherUser?.username;
  const lastMsg = conversation.lastMessage;
  const unread = conversation.unread || 0;
  const isFromMe = lastMsg?.senderId === currentUser.id;

  let preview = "";
  if (lastMsg) {
    const prefix = isFromMe ? "Bạn: " : "";
    preview = prefix + truncate(lastMsg.content, 40);
  } else if (conversation.type === "game_room") {
    preview = "Phòng game";
  } else {
    preview = "Nhắn tin trực tiếp";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-150 border-l-3 ${
        isActive
          ? "bg-gold/8 border-l-gold"
          : "border-l-transparent hover:bg-ink/3"
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
          isActive
            ? "bg-gold text-white"
            : "bg-gradient-to-br from-purple-400 to-pink-400 text-white"
        }`}>
          {otherUser?.name?.charAt(0)?.toUpperCase() || (conversation.type === "game_room" ? "🎮" : "💬")}
        </div>
        {/* Online indicator */}
        {otherUser && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-paper" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-display text-sm truncate ${isActive ? "text-ink" : "text-ink"}`}>
            {name}
          </h3>
          {lastMsg?.createdAt && (
            <span className={`text-[10px] font-mono shrink-0 ${unread > 0 ? "text-gold font-semibold" : "text-ink/30"}`}>
              {formatTime(lastMsg.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={`text-xs truncate ${unread > 0 ? "text-ink font-medium" : "text-ink/40"}`}>
            {preview}
          </p>
          {unread > 0 && (
            <span className="shrink-0 px-1.5 py-0.5 bg-gold text-white text-[9px] font-bold rounded-full font-mono min-w-[18px] text-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
