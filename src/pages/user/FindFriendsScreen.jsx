/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, MessageCircle, Users, GraduationCap, History, UserPlus, UserCheck, Clock, Heart, X } from "lucide-react";
import { userService, classService } from "../../services/api.js";
import { conversationApi } from "../../services/conversationApi.js";
import { friendApi } from "../../services/friendApi.js";
import { Loader, EmptyState, ErrorState, PrimaryButton, ConfirmModal } from "../../components/ui";
import { useConfirm } from "../../hooks/useConfirm.js";
import { navigate } from "../../lib/router.js";
import DMChatScreen from "./DMChatScreen.jsx";

// Trang Tìm bạn (đợt 3 — đã nối API bạn bè thật ở /api/friends):
//   - Bạn bè: danh sách đã kết nối (friendApi.overview) — Chat / Hủy kết bạn.
//   - Lời mời: lời mời đến (Chấp nhận / Từ chối) + lời mời mình đã gửi (Hủy).
//   - Đã trò chuyện gần đây: conversationApi.list() (như đợt 2).
//   - Bạn cùng lớp: classService.list() → getStudents() (như đợt 2).
//   - Tìm theo tên: userService.search() (giữ nguyên hành vi cũ).
// Mọi hàng đều hiển thị nút theo TRẠNG THÁI QUAN HỆ (chưa quen / đã gửi /
// chờ mình duyệt / đã là bạn) lấy từ overview, để không phải gọi thêm API.
const MAX_CLASSES = 5; // tránh fan-out lớn với tài khoản quản trị thấy mọi lớp
const MAX_RECENT = 10;

function Avatar({ name }) {
  return (
    <div className="w-11 h-11 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
      {(name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

const btnTeal = "flex items-center gap-1.5 px-3.5 py-2 bg-[#1B998B] text-white text-xs font-bold rounded-full hover:bg-[#178a7d] transition-colors shrink-0 disabled:opacity-60";
const btnGhost = "flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E7D9BE] text-[#20283A] text-xs font-bold rounded-full hover:bg-[#FAF3E3] transition-colors shrink-0 disabled:opacity-60";
const btnMuted = "flex items-center gap-1.5 px-3.5 py-2 bg-[#F1EAD8] text-[#8A7C63] text-xs font-bold rounded-full shrink-0 cursor-default";

/**
 * Hàng người dùng với nút bấm theo ngữ cảnh:
 *  variant "incoming" → Chấp nhận / Từ chối lời mời
 *  variant "outgoing" → Hủy lời mời đã gửi
 *  variant "friend"   → Chat / Hủy kết bạn
 *  mặc định           → nút theo `relation` + Chat
 */
function PersonRow({ user, subtitle, relation, variant, busy, onChat, onAdd, onAccept, onDecline, onCancel, onUnfriend }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E7D9BE]">
      <Avatar name={user.name} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#20283A] truncate">{user.name}</p>
        <p className="text-xs text-[#8A7C63] truncate">{subtitle || `@${user.username}`}</p>
      </div>

      {variant === "incoming" && (
        <>
          <button onClick={() => onAccept(user)} disabled={busy} className={btnTeal}>
            <UserCheck className="w-3.5 h-3.5" /> Chấp nhận
          </button>
          <button onClick={() => onDecline(user)} disabled={busy} className={btnGhost} aria-label="Từ chối lời mời">
            <X className="w-3.5 h-3.5" /> Từ chối
          </button>
        </>
      )}

      {variant === "outgoing" && (
        <button onClick={() => onCancel(user)} disabled={busy} className={btnGhost}>
          <Clock className="w-3.5 h-3.5" /> Hủy lời mời
        </button>
      )}

      {variant === "friend" && (
        <>
          <button onClick={() => onChat(user)} className={btnTeal}>
            <MessageCircle className="w-3.5 h-3.5" /> Chat
          </button>
          <button onClick={() => onUnfriend(user)} disabled={busy} className={btnGhost} aria-label="Hủy kết bạn">
            Hủy kết bạn
          </button>
        </>
      )}

      {!variant && (
        <>
          {relation === "friends" && (
            <span className={btnMuted}><UserCheck className="w-3.5 h-3.5" /> Bạn bè</span>
          )}
          {relation === "pending_out" && (
            <span className={btnMuted}><Clock className="w-3.5 h-3.5" /> Đã gửi</span>
          )}
          {relation === "pending_in" && (
            <button onClick={() => onAccept(user)} disabled={busy} className={btnTeal}>
              <UserCheck className="w-3.5 h-3.5" /> Chấp nhận
            </button>
          )}
          {(!relation || relation === "none") && (
            <button onClick={() => onAdd(user)} disabled={busy} className={btnGhost}>
              <UserPlus className="w-3.5 h-3.5" /> Kết bạn
            </button>
          )}
          <button onClick={() => onChat(user)} className={btnTeal}>
            <MessageCircle className="w-3.5 h-3.5" /> Chat
          </button>
        </>
      )}
    </div>
  );
}

function SectionTitle({ icon, children, badge }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-base text-ink mt-6 mb-3">
      {icon} {children}
      {badge ? <span className="ml-1 px-2 py-0.5 rounded-full bg-[#E5533D] text-white text-[11px] font-bold">{badge}</span> : null}
    </h2>
  );
}

export default function FindFriendsScreen({ userAuth }) {
  const me = userAuth?.user || null;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);

  const [overview, setOverview] = useState({ friends: [], incoming: [], outgoing: [] });
  const [classGroups, setClassGroups] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(true);
  const [suggestError, setSuggestError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { askConfirm, confirmProps } = useConfirm();

  // userId → "friends" | "pending_out" | "pending_in" (không có = chưa quen)
  const relations = useMemo(() => {
    const map = new Map();
    for (const f of overview.friends || []) map.set(f.user.id, "friends");
    for (const f of overview.outgoing || []) map.set(f.user.id, "pending_out");
    for (const f of overview.incoming || []) map.set(f.user.id, "pending_in");
    return map;
  }, [overview]);

  // ── Tải: quan hệ bạn bè + gợi ý (bạn cùng lớp, đã trò chuyện) ──
  const loadAll = useCallback(async () => {
    if (!me) return;
    setSuggestLoading(true);
    setSuggestError("");
    try {
      const [ov, classes, conversations] = await Promise.all([
        friendApi.overview().catch(() => ({ friends: [], incoming: [], outgoing: [] })),
        classService.list().catch(() => []),
        conversationApi.list().catch(() => []),
      ]);
      setOverview(ov || { friends: [], incoming: [], outgoing: [] });

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
      setSuggestError("Không tải được danh sách. Vui lòng thử lại.");
    } finally {
      setSuggestLoading(false);
    }
  }, [me]);

  useEffect(() => { loadAll(); }, [loadAll, reloadKey]);

  // ── Thao tác bạn bè: chạy xong tải lại overview để nút bấm khớp trạng thái ──
  const runAction = useCallback(async (user, fn) => {
    setBusyId(user.id);
    setActionError("");
    try {
      await fn(user.id);
      const ov = await friendApi.overview().catch(() => null);
      if (ov) setOverview(ov);
    } catch (e) {
      setActionError(e.message || "Thao tác thất bại, vui lòng thử lại.");
    } finally {
      setBusyId(null);
    }
  }, []);

  const handleAdd = useCallback((user) => runAction(user, (id) => friendApi.sendRequest(id)), [runAction]);
  const handleAccept = useCallback((user) => runAction(user, (id) => friendApi.accept(id)), [runAction]);
  const handleDecline = useCallback((user) => runAction(user, (id) => friendApi.decline(id)), [runAction]);
  const handleCancel = useCallback((user) => runAction(user, (id) => friendApi.cancel(id)), [runAction]);
  const handleUnfriend = useCallback((user) => {
    askConfirm({
      title: "Hủy kết bạn",
      message: `Bạn chắc chắn muốn hủy kết bạn với ${user.name}?`,
      confirmText: "Hủy kết bạn",
      onConfirm: () => runAction(user, (id) => friendApi.unfriend(id)),
    });
  }, [askConfirm, runAction]);

  const rowHandlers = {
    onChat: setChatTarget,
    onAdd: handleAdd,
    onAccept: handleAccept,
    onDecline: handleDecline,
    onCancel: handleCancel,
    onUnfriend: handleUnfriend,
  };

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
  const friends = overview.friends || [];
  const incoming = overview.incoming || [];
  const outgoing = overview.outgoing || [];
  const hasSuggestions = classGroups.length > 0 || recentChats.length > 0 || friends.length > 0 || incoming.length > 0 || outgoing.length > 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-5 w-full">
      <ConfirmModal {...confirmProps} />
      <h1 className="font-display text-xl text-ink mb-1">Tìm bạn</h1>
      <p className="text-sm text-[#8A7C63] mb-4">Kết bạn và trò chuyện cùng bạn bè</p>

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

      {actionError && (
        <p className="mt-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">{actionError}</p>
      )}

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
            {results.filter(u => u.id !== me.id).map(u => (
              <PersonRow
                key={u.id}
                user={u}
                relation={relations.get(u.id)}
                busy={busyId === u.id}
                {...rowHandlers}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {suggestLoading && (
            <div className="flex justify-center py-8"><Loader label="Đang tải..." /></div>
          )}

          {!suggestLoading && suggestError && (
            <ErrorState title="Không tải được danh sách" subtitle={suggestError} onRetry={() => setReloadKey(k => k + 1)} />
          )}

          {!suggestLoading && !suggestError && !hasSuggestions && (
            <EmptyState
              icon={<Users className="w-10 h-10 text-purple-400" />}
              title="Chưa có bạn bè hay gợi ý nào"
              subtitle="Bạn chưa có bạn cùng lớp hay cuộc trò chuyện nào. Hãy nhập tên ở trên để tìm và kết bạn nhé."
            />
          )}

          {!suggestLoading && incoming.length > 0 && (
            <>
              <SectionTitle icon={<Heart className="w-5 h-5 text-[#E5533D]" />} badge={incoming.length}>
                Lời mời kết bạn
              </SectionTitle>
              <div className="space-y-2">
                {incoming.map(({ user }) => (
                  <PersonRow key={user.id} user={user} variant="incoming" busy={busyId === user.id} {...rowHandlers} />
                ))}
              </div>
            </>
          )}

          {!suggestLoading && outgoing.length > 0 && (
            <>
              <SectionTitle icon={<Clock className="w-5 h-5 text-[#8A7C63]" />}>
                Đang chờ phản hồi
              </SectionTitle>
              <div className="space-y-2">
                {outgoing.map(({ user }) => (
                  <PersonRow key={user.id} user={user} variant="outgoing" busy={busyId === user.id} {...rowHandlers} />
                ))}
              </div>
            </>
          )}

          {!suggestLoading && friends.length > 0 && (
            <>
              <SectionTitle icon={<UserCheck className="w-5 h-5 text-[#1B998B]" />}>
                Bạn bè · {friends.length}
              </SectionTitle>
              <div className="space-y-2">
                {friends.map(({ user }) => (
                  <PersonRow key={user.id} user={user} variant="friend" busy={busyId === user.id} {...rowHandlers} />
                ))}
              </div>
            </>
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
                    relation={relations.get(user.id)}
                    busy={busyId === user.id}
                    subtitle={lastMessage?.content ? lastMessage.content : `@${user.username}`}
                    {...rowHandlers}
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
                  <PersonRow
                    key={u.id}
                    user={u}
                    relation={relations.get(u.id)}
                    busy={busyId === u.id}
                    {...rowHandlers}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
