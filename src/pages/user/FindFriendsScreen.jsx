import { useState, useEffect, useRef, useCallback } from "react";
import { userService } from "../../services/api.js";
import { Loader } from "../../components/ui.jsx";
import DMChatScreen from "./DMChatScreen.jsx";

export default function FindFriendsScreen({ userAuth }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState({ results: null, loading: false, error: null });
  const [chatTarget, setChatTarget] = useState(null);
  const debounceRef = useRef(null);

  const searchUsers = useCallback(async (q) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await userService.search(q);
      setState({ results: data, loading: false, error: null });
    } catch (e) {
      setState({ results: null, loading: false, error: e.message });
    }
  }, [userAuth]);

  useEffect(() => {
    if (query.trim().length < 2) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchUsers(query.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, searchUsers]);

  const handleStartChat = (targetUser) => {
    setChatTarget(targetUser);
  };

  // Nếu đang mở chat → hiện DMChatScreen
  if (chatTarget) {
    return (
      <DMChatScreen
        targetUser={chatTarget}
        userAuth={userAuth}
        onBack={() => setChatTarget(null)}
      />
    );
  }

  return (
    <div className="flex-1 px-6 py-10">
      <div className="max-w-2xl mx-auto anim-pop">
        <h1 className="font-display text-2xl text-ink mb-6">🔍 Tìm bạn</h1>

        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên hoặc tên đăng nhập..."
            autoFocus
            className="w-full note-card px-4 py-3 text-ink border-ink/10 focus:border-ticket"
          />
          <p className="text-xs text-[#8A7C63] mt-2 font-mono">Tìm kiếm người dùng để bắt đầu trò chuyện</p>
        </div>

        {/* Results */}
        {state.loading && <Loader label="Đang tìm kiếm..." />}

        {state.error && (
          <p className="text-ticket text-sm text-center py-4">{state.error}</p>
        )}

        {!state.loading && state.results && state.results.length === 0 && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-[#8A7C63]">Không tìm thấy người dùng nào</p>
          </div>
        )}

        {!state.loading && state.results && state.results.length > 0 && (
          <div className="space-y-2">
            {state.results.map((user) => (
              <div
                key={user.id}
                className="note-card p-4 flex items-center gap-3 hover:bg-ink/5 transition"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg text-white shrink-0 font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm text-ink truncate">{user.name}</h3>
                  <p className="text-xs text-[#8A7C63] font-mono">@{user.username}</p>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleStartChat(user)}
                  className="px-4 py-2 rounded-2xl bg-ink text-paper text-sm font-semibold hover:bg-ink2 transition shrink-0"
                >
                  💬 Chat
                </button>
              </div>
            ))}
          </div>
        )}

        {!state.loading && !state.results && query.length < 2 && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-[#8A7C63]">Gõ tên để tìm bạn bè</p>
          </div>
        )}
      </div>
    </div>
  );
}
