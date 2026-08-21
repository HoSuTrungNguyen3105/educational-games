import { useEffect, useState, useRef } from "react";
import { conversationApi } from "../../services/conversationApi.js";
import { Loader, ErrorState, EmptyState } from "../../components/ui.jsx";
import { navigate } from "../../lib/router.js";

export default function ConversationListScreen({ userAuth, onSelectConversation, onLogout }) {
  const [state, setState] = useState({ conversations: null, error: null });
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!userAuth?.user) return;
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
  }, [userAuth]);

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

  return (
    <div className="flex-1 px-6 py-10">
      <div className="max-w-2xl mx-auto anim-pop">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-ink">💬 Tin nhắn</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/find-friends")}
              className="px-4 py-2 rounded-2xl bg-ink text-paper text-sm font-semibold hover:bg-ink2 transition"
            >
              🔍 Tìm bạn
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-sm text-red-500 font-semibold hover:text-red-600 transition"
              >
                🚪 Đăng xuất
              </button>
            )}
          </div>
        </div>

        {state.conversations === null ? (
          <Loader label="Đang tải danh sách..." />
        ) : state.error ? (
          <ErrorState title="Lỗi tải danh sách" subtitle={state.error} onRetry={() => setState({ conversations: null, error: null })} />
        ) : state.conversations.length === 0 ? (
          <EmptyState
            icon="📭"
            title="Chưa có tin nhắn"
            subtitle="Bạn chưa có cuộc trò chuyện nào. Hãy tham gia trò chơi để bắt đầu chat!"
          />
        ) : (
          <div className="space-y-2">
            {state.conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className="w-full note-card p-4 text-left flex items-center gap-3 hover:bg-ink/5 transition"
              >
                <div className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center text-lg shrink-0">
                  {conv.type === "game_room" ? "🎮" : "💬"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm text-ink truncate">
                    {conv.name || (conv.type === "game_room" ? "Phòng game" : "Tin nhắn trực tiếp")}
                  </h3>
                  <p className="text-xs text-[#8A7C63] font-mono">
                    {conv.type === "game_room" ? "Phòng game" : "Nhắn tin trực tiếp"}
                  </p>
                </div>
                <span className="text-ink/30">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
