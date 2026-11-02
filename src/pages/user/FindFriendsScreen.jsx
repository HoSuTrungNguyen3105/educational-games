/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { Search, MessageCircle, Users, GraduationCap, History } from "lucide-react";
import { userService, classService } from "../../services/api.js";
import { conversationApi } from "../../services/conversationApi.js";
import { Loader, EmptyState, ErrorState, PrimaryButton } from "../../components/ui";
import { navigate } from "../../lib/router.js";
import DMChatScreen from "./DMChatScreen.jsx";

// Trang Tìm bạn.
// LƯU Ý: hệ thống CHƯA có API bạn bè ở backend (không có friends /
// friend-requests) nên trang này chưa có "danh sách bạn bè" hay "gửi lời mời
// kết bạn" thật. Trong lúc chờ backend (đợt 3), trang tận dụng dữ liệu hợp lệ
// sẵn có để gợi ý người quen và mở chat 1-1 (DMChatScreen) như trước:
//   - Bạn cùng lớp: classService.list() → classService.getStudents(classId)
//   - Đã trò chuyện gần đây: conversationApi.list() (DM) → userService.getById()
//   - Tìm theo tên: userService.search() (giữ nguyên hành vi cũ)
const MAX_CLASSES = 5; // tránh fan-out lớn với tài khoản quản trị thấy mọi lớp
const MAX_RECENT = 10;

function Avatar({ name }) {
  return (
    <div className="w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

function PersonRow({ user, subtitle, onChat }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
      <Avatar name={user.name} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#20283A] truncate">{user.name}</p>
        <p className="text-xs text-[#8A7C63] truncate">{subtitle || `@${user.username}`}</p>
      </div>
      <button
        onClick={() => onChat(user)}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1B998B] text-white text-xs font-bold rounded-full hover:bg-[#178a7d] transition-colors shrink-0"
      >
        <MessageCircle className="w-3.5 h-3.5" /> Chat
      </button>
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-base text-ink mt-6 mb-3">
      {icon} {children}
    </h2>
  );
}

export default function FindFriendsScreen({ userAuth }) {
  const me = userAuth?.user || null;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);

  const [classGroups, setClassGroups] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(true);
  const [suggestError, setSuggestError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // ── Gợi ý: bạn cùng lớp + người đã trò chuyện ──
  const loadSuggestions = useCallback(async () => {
    if (!me) return;
    setSuggestLoading(true);
    setSuggestError("");
    try {
      const [classes, conversations] = await Promise.all([
        classService.list().catch(() => []),
        conversationApi.list().catch(() => []),
      ]);

      // Bạn cùng lớp — mỗi lớp một nhóm, bỏ chính mình.
      const classList = (Array.isArray(classes) ? classes : []).slice(0, MAX_CLASSES);
      const groups = [];
      for (const cls of classList) {
        const students = await classService.getStudents(cls.id).catch(() => []);
        const members = (Array.isArray(students) ? students : []).filter((s) => s.id !== me.id);
        if (members.length) groups.push({ classId: cls.id, className: cls.name, members });
      }
      setClassGroups(groups);

      // Đã trò chuyện gần đây — chỉ hội thoại 1-1, lấy thông tin đối phương.
      const dms = (Array.isArray(conversations) ? conversations : [])
        .filter((c) => c.type === "dm" && Array.isArray(c.memberIds))
        .map((c) => ({ conv: c, partnerId: c.memberIds.find((id) => id !== me.id) }))
        .filter((x) => x.partnerId)
        .sort((a, b) => {
          const ta = new Date(a.conv.lastMessage?.createdAt || a.conv.updatedAt || 0).getTime();
          const tb = new Date(b.conv.lastMessage?.createdAt || b.conv.updatedAt || 0).getTime();
          return tb - ta;
        })
        .slice(0, MAX_RECENT);
      const recents = [];
      for (const { conv, partnerId } of dms) {
        const partner = await userService.getById(partnerId).catch(() => null);
        if (partner) recents.push({ user: partner, lastMessage: conv.lastMessage || null });
      }
      setRecentChats(recents);
    } catch {
      setSuggestError("Không tải được danh sách gợi ý. Vui lòng thử lại.");
    } finally {
      setSuggestLoading(false);
    }
  }, [me]);

  useEffect(() => { loadSuggestions(); }, [loadSuggestions, reloadKey]);

  // ── Tìm kiếm theo tên (hành vi cũ) ──
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await userService.search(query.trim());
        setResults(Array.isArray(data) ? data : []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  if (!me) {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center anim-pop">
          <div className="mb-4 flex justify-center text-purple-500"><Users className="w-14 h-14" /></div>
          <h2 className="font-display text-xl text-ink mb-2">Chưa đăng nhập</h2>
          <p className="text-sm text-[#8A7C63] mb-4">Bạn cần đăng nhập để tìm bạn và nhắn tin</p>
          <PrimaryButton onClick={() => navigate("/")}>← Về trang chủ</PrimaryButton>
        </div>
      </div>
    );
  }

  if (chatTarget) {
    return (
      <DMChatScreen
        targetUser={chatTarget}
        userAuth={userAuth}
        onBack={() => setChatTarget(null)}
      />
    );
  }

  const isSearching = query.trim().length > 0;
  const hasSuggestions = classGroups.length > 0 || recentChats.length > 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-5 w-full">
      <h1 className="font-display text-xl text-ink mb-1">Tìm bạn</h1>
      <p className="text-sm text-[#8A7C63] mb-4">Tìm kiếm bạn bè để trò chuyện</p>

      {/* Search */}
      <div className="relative mb-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8A7C63]" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Nhập tên bạn bè..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E7D9BE] bg-white text-sm outline-none focus:border-[#1B998B] transition-colors"
        />
      </div>

      {isSearching ? (
        <>
          {searching && (
            <div className="flex justify-center py-8"><Loader label="Đang tìm..." /></div>
          )}
          {!searching && results.length === 0 && (
            <EmptyState
              icon={<Users className="w-10 h-10 text-purple-400" />}
              title="Không tìm thấy ai"
              subtitle="Thử tìm bằng tên khác nhé."
            />
          )}
          <div className="space-y-2 mt-2">
            {results.map(u => (
              <PersonRow key={u.id} user={u} onChat={setChatTarget} />
            ))}
          </div>
        </>
      ) : (
        <>
          {suggestLoading && (
            <div className="flex justify-center py-8"><Loader label="Đang tải gợi ý..." /></div>
          )}

          {!suggestLoading && suggestError && (
            <ErrorState title="Không tải được gợi ý" subtitle={suggestError} onRetry={() => setReloadKey(k => k + 1)} />
          )}

          {!suggestLoading && !suggestError && !hasSuggestions && (
            <EmptyState
              icon={<Users className="w-10 h-10 text-purple-400" />}
              title="Chưa có gợi ý nào"
              subtitle="Bạn chưa có bạn cùng lớp hay cuộc trò chuyện nào. Hãy nhập tên ở trên để tìm bạn nhé."
            />
          )}

          {!suggestLoading && recentChats.length > 0 && (
            <>
              <SectionTitle icon={<History className="w-5 h-5 text-[#1B998B]" />}>
                Đã trò chuyện gần đây
              </SectionTitle>
              <div className="space-y-2">
                {recentChats.map(({ user, lastMessage }) => (
                  <PersonRow
                    key={user.id}
                    user={user}
                    subtitle={lastMessage?.content ? lastMessage.content : `@${user.username}`}
                    onChat={setChatTarget}
                  />
                ))}
              </div>
            </>
          )}

          {!suggestLoading && classGroups.map(group => (
            <div key={group.classId}>
              <SectionTitle icon={<GraduationCap className="w-5 h-5 text-[#1B998B]" />}>
                Bạn cùng lớp{group.className ? ` · ${group.className}` : ""}
              </SectionTitle>
              <div className="space-y-2">
                {group.members.map(u => (
                  <PersonRow key={u.id} user={u} onChat={setChatTarget} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
