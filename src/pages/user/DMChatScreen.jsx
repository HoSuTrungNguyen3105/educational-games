import { useState, useEffect, useRef, useMemo } from "react";
import { chatApi } from "../../services/chatApi.js";
import EmojiPicker from "../../components/chat/EmojiPicker.jsx";
import { emojiIconById } from "../../components/chat/emojiIcons.js";
import { friendApi } from "../../services/friendApi.js";
import { supportService } from "../../services/api.js";
import { IconBack, IconSmile, Loader, Modal, ConfirmModal } from '../../components/ui';
import { useConfirm } from "../../hooks/useConfirm.js";
import { socket } from "../../socket/socket.js";
import { SOCKET_EVENTS } from "../../socket/socket.events.js";
import { useIsOnline } from "../../stores/presence.store.js";
import { Check, Send, X, MoreVertical, Ban, Flag } from "lucide-react";

// Lý do báo cáo — phải khớp REPORT_REASONS ở server (reportService).
const REPORT_REASONS = [
  { value: "harassment", label: "Quấy rối" },
  { value: "bad_language", label: "Ngôn từ xấu" },
  { value: "scam", label: "Lừa đảo" },
  { value: "other", label: "Khác" },
];

function formatMessageTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("vi", { hour: "2-digit", minute: "2-digit" });
}

// Toggle reaction của một người trên một tin — bản phía client, khớp hệt
// ngữ nghĩa toggleReaction ở server: chưa có → thêm, trùng icon → gỡ,
// khác icon → thay thế (tối đa 1 reaction / người / tin).
function toggleReactionLocal(reactions, userId, icon) {
  const next = (Array.isArray(reactions) ? reactions : []).map((r) => ({ userId: r.userId, icon: r.icon }));
  const idx = next.findIndex((r) => r.userId === userId);
  if (idx >= 0 && next[idx].icon === icon) next.splice(idx, 1);
  else if (idx >= 0) next[idx] = { userId, icon };
  else next.push({ userId, icon });
  return next;
}

// Gom reactions theo icon để hiển thị chip "icon × số lượng".
function groupReactions(reactions) {
  const groups = [];
  for (const r of Array.isArray(reactions) ? reactions : []) {
    const g = groups.find((x) => x.icon === r.icon);
    if (g) g.count += 1;
    else groups.push({ icon: r.icon, count: 1 });
  }
  return groups;
}

// Same deterministic id as server: dm:[idA, idB] sorted
function getDmId(a, b) {
  if (!a || !b) return null;
  return `dm:${[a, b].sort().join(":")}`;
}

export default function DMChatScreen({ targetUser, userAuth, onBack }) {
  const user = userAuth?.user;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  // ── Cảm xúc (reaction) + sticker ──
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);
  const [reactionFor, setReactionFor] = useState(null); // id tin đang mở bảng chọn cảm xúc
  const pressTimerRef = useRef(null);
  // ── An toàn: chặn / báo cáo ──
  const [menuOpen, setMenuOpen] = useState(false);
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("harassment");
  const [reportNote, setReportNote] = useState("");
  const [reportBusy, setReportBusy] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const { askConfirm, confirmProps } = useConfirm();
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const targetUserId = targetUser?.id;
  // Hiện diện THẬT của đối tác (trước đây header luôn hiện chấm xanh +
  // "Đang hoạt động" vô điều kiện).
  const targetOnline = useIsOnline(targetUserId);
  const dmId = useMemo(() => getDmId(user?.id, targetUserId), [user?.id, targetUserId]);

  // Mình đã chặn người này chưa? (để hiện trạng thái + khoá ô nhập — server
  // cũng từ chối gửi ở cả hai chiều, đây chỉ là hiển thị phía client)
  useEffect(() => {
    if (!targetUserId) return;
    let cancelled = false;
    friendApi.blocks()
      .then((list) => {
        if (!cancelled) setBlockedByMe((list || []).some((b) => b.user?.id === targetUserId));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [targetUserId]);

  const handleBlock = () => {
    setMenuOpen(false);
    askConfirm({
      title: "Chặn người này",
      message: `Sau khi chặn, bạn và ${targetUser.name} sẽ không thể nhắn tin hay kết bạn với nhau nữa (nếu đang là bạn sẽ hủy kết bạn). ${targetUser.name} sẽ không nhận được thông báo về việc này.`,
      confirmLabel: "Chặn",
      onConfirm: async () => {
        try {
          await friendApi.block(targetUserId);
        } catch (e) {
          console.error("[dm] block error:", e);
        }
        // Dù API lỗi hay không, quay lại danh sách để trạng thái được tải lại.
        onBack();
      },
    });
  };

  const openReport = () => {
    setMenuOpen(false);
    setReportReason("harassment");
    setReportNote("");
    setReportError("");
    setReportDone(false);
    setReportOpen(true);
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setReportBusy(true);
    setReportError("");
    try {
      await supportService.createReport({
        reportedId: targetUserId,
        reason: reportReason,
        note: reportNote.trim() || undefined,
      });
      setReportDone(true);
    } catch (err) {
      setReportError(err.message || "Gửi báo cáo thất bại, vui lòng thử lại.");
    } finally {
      setReportBusy(false);
    }
  };

  useEffect(() => {
    if (!targetUserId) return;
    let cancelled = false;
    setLoading(true);
    chatApi.listDmMessages(targetUserId, { limit: 50 }).then((res) => {
      if (!cancelled) {
        setMessages(res || []);
        setLoading(false);
      }
    }).catch((e) => {
      console.error("[dm] load error:", e);
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [targetUserId]);

  // Realtime: append messages for this DM (dedupe by id / clientMessageId)
  useEffect(() => {
    if (!dmId) return;
    const onMessage = (msg) => {
      if (!msg || msg.error) return;
      if (msg.conversationId !== dmId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        // Replace optimistic sending message with saved one
        if (msg.clientMessageId) {
          const hasOptimistic = prev.some(
            (m) => m.status === "sending" && m.clientMessageId === msg.clientMessageId
          );
          if (hasOptimistic) {
            return prev.map((m) =>
              m.status === "sending" && m.clientMessageId === msg.clientMessageId
                ? { ...msg, status: "sent" }
                : m
            );
          }
        }
        return [...prev, msg];
      });
    };
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, onMessage);
    return () => socket.off(SOCKET_EVENTS.CHAT_MESSAGE, onMessage);
  }, [dmId]);

  // Realtime: cập nhật cảm xúc của một tin nhắn (từ phía còn lại thả/gỡ —
  // và khớp lại thao tác của chính mình vì server bắn cho cả hai phòng).
  useEffect(() => {
    if (!dmId) return;
    const onReaction = (payload) => {
      if (!payload || payload.conversationId !== dmId || !payload.messageId) return;
      setMessages((prev) => prev.map((m) =>
        m.id === payload.messageId ? { ...m, reactions: payload.reactions || [] } : m
      ));
    };
    socket.on(SOCKET_EVENTS.CHAT_REACTION, onReaction);
    return () => socket.off(SOCKET_EVENTS.CHAT_REACTION, onReaction);
  }, [dmId]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [loading, messages.length]);

  // Thay tin lạc quan bằng tin đã lưu (socket có thể đã giao nó trước đó).
  const settleSentMessage = (clientMessageId, saved) => {
    setMessages((prev) => {
      const withoutOptimistic = prev.filter((m) =>
        m.id !== clientMessageId && m.clientMessageId !== clientMessageId
      );
      if (withoutOptimistic.some((m) => m.id === saved.id)) return withoutOptimistic;
      return [...withoutOptimistic, { ...saved, status: "sent" }];
    });
  };

  // Thả / gỡ / đổi cảm xúc cho một tin: cập nhật lạc quan ngay, khớp lại
  // bằng phản hồi server (sự kiện socket "chat:reaction" cũng khớp cùng
  // giá trị); nếu lỗi thì hoàn tác về mảng reactions trước thao tác.
  const handleReact = async (msg, icon) => {
    setReactionFor(null);
    if (!user || msg.status === "sending" || msg.status === "failed") return;
    const prevReactions = msg.reactions || [];
    setMessages((prev) => prev.map((m) =>
      m.id === msg.id ? { ...m, reactions: toggleReactionLocal(prevReactions, user.id, icon) } : m
    ));
    try {
      const updated = await chatApi.toggleDmReaction(targetUser.id, msg.id, icon);
      if (updated && Array.isArray(updated.reactions)) {
        setMessages((prev) => prev.map((m) =>
          m.id === msg.id ? { ...m, reactions: updated.reactions } : m
        ));
      }
    } catch (e) {
      console.error("[dm] reaction error:", e);
      setMessages((prev) => prev.map((m) =>
        m.id === msg.id ? { ...m, reactions: prevReactions } : m
      ));
    }
  };

  // Chạm-giữ (cảm ứng) trên bong bóng tin cũng mở bảng chọn cảm xúc —
  // di chuyển tay (cuộn trang) thì huỷ để không mở nhầm.
  const cancelPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };
  const startPress = (messageId) => {
    cancelPress();
    pressTimerRef.current = setTimeout(() => setReactionFor(messageId), 450);
  };

  // Gửi sticker: chọn một biểu tượng trong bảng là GỬI NGAY một tin dạng
  // sticker (hiện lớn, không kèm chữ) qua cùng luồng gửi tin DM.
  const handleSendSticker = async (icon) => {
    setStickerPickerOpen(false);
    if (!user || sending) return;
    const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimistic = {
      id: clientMessageId,
      conversationId: dmId || getDmId(user.id, targetUser.id),
      senderId: user.id,
      playerName: user.name,
      type: "text",
      kind: "sticker",
      sticker: icon,
      reactions: [],
      content: "Đã gửi một biểu tượng cảm xúc",
      createdAt: new Date().toISOString(),
      status: "sending",
      clientMessageId,
    };
    setMessages((prev) => [...prev, optimistic]);
    setSending(true);
    try {
      const saved = await chatApi.sendDmSticker(targetUser.id, { sticker: icon, clientMessageId });
      settleSentMessage(clientMessageId, saved);
    } catch (e) {
      console.error("[dm] send sticker error:", e);
      setMessages((prev) => prev.map((m) =>
        m.id === clientMessageId ? { ...m, status: "failed" } : m
      ));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending || !user) return;
    setStickerPickerOpen(false);

    const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const optimistic = {
      id: clientMessageId,
      conversationId: dmId || getDmId(user.id, targetUser.id),
      senderId: user.id,
      playerName: user.name,
      type: "text",
      content: trimmed,
      createdAt: new Date().toISOString(),
      status: "sending",
      clientMessageId,
    };

    setMessages((prev) => [...prev, optimistic]);
    setText("");
    setSending(true);

    try {
      const saved = await chatApi.sendDmMessage(targetUser.id, {
        content: trimmed,
        clientMessageId,
      });
      settleSentMessage(clientMessageId, saved);
    } catch (e) {
      console.error("[dm] send error:", e);
      setMessages((prev) => prev.map((m) =>
        m.id === clientMessageId ? { ...m, status: "failed" } : m
      ));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Group messages by date
  const groupedMessages = [];
  let lastDate = "";
  for (const msg of messages) {
    const d = new Date(msg.createdAt).toLocaleDateString("vi");
    if (d !== lastDate) {
      groupedMessages.push({ type: "date", date: d, id: `date-${d}` });
      lastDate = d;
    }
    groupedMessages.push({ type: "message", ...msg });
  }

  return (
    <div className="h-full flex flex-col min-h-0 bg-paper/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2.5 bg-paper border-b border-ink/8 shrink-0 pb-[max(env(safe-area-inset-top),8px)]">
        <button onClick={onBack}
          className="p-1.5 rounded-xl hover:bg-ink/5 transition text-ink/60 hover:text-ink md:hidden">
          <IconBack className="w-5 h-5" />
        </button>
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm text-white font-bold">
            {targetUser.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-paper ${targetOnline ? "bg-green-400" : "bg-gray-300"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-sm text-ink truncate">{targetUser.name}</h2>
          <p className={`text-[10px] font-body ${targetOnline ? "text-green-500" : "text-ink/40"}`}>
            {targetOnline ? "Đang hoạt động" : "Không hoạt động"}
          </p>
        </div>
        {/* Menu an toàn: Báo cáo / Chặn người này */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-xl hover:bg-ink/5 transition text-ink/60 hover:text-ink"
            aria-label="Tuỳ chọn trò chuyện"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-52 bg-white rounded-2xl border border-ink/10 shadow-lg py-1.5 overflow-hidden">
                <button
                  onClick={openReport}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-body text-ink hover:bg-ink/5 transition text-left"
                >
                  <Flag className="w-4 h-4 text-ink/50" /> Báo cáo
                </button>
                {!blockedByMe && (
                  <button
                    onClick={handleBlock}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <Ban className="w-4 h-4" /> Chặn người này
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader label="Đang tải tin nhắn..." />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
            <IconSmile className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-body text-ink/60">Bắt đầu trò chuyện với</p>
            <p className="text-sm font-display text-ink">{targetUser.name}</p>
          </div>
        </div>
      ) : (
        <div ref={listRef} className="h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-1">
          {groupedMessages.map((item, i) => {
            if (item.type === "date") {
              return (
                <div key={item.id} className="flex items-center justify-center py-2">
                  <span className="px-3 py-1 bg-ink/5 rounded-full text-[10px] font-mono text-ink/40">
                    {item.date}
                  </span>
                </div>
              );
            }

            const msg = item;
            const isOwn = msg.senderId === user?.id;
            const prev = groupedMessages[i - 1];
            const next = groupedMessages[i + 1];
            const showSender = !prev || prev.type === "date" || prev.senderId !== msg.senderId;
            const isLastInGroup = !next || next.type === "date" || next.senderId !== msg.senderId;
            const isSticker = msg.kind === "sticker";
            const stickerIcon = isSticker ? emojiIconById(msg.sticker) : null;
            const reactionGroups = groupReactions(msg.reactions);
            // Chạm-giữ trên nội dung tin để mở bảng cảm xúc (cảm ứng);
            // trên desktop có thêm nút mặt cười hiện khi di chuột tới.
            const pressHandlers = {
              onPointerDown: () => startPress(msg.id),
              onPointerUp: cancelPress,
              onPointerLeave: cancelPress,
              onPointerMove: cancelPress,
              onContextMenu: (e) => e.preventDefault(),
            };

            return (
              <div key={msg.id || i} className={`group flex flex-col ${isOwn ? "items-end" : "items-start"} ${showSender ? "mt-2" : "mt-0.5"}`}>
                {showSender && !isOwn && (
                  <span className="text-[10px] font-body mb-0.5 px-1 text-ink/40">
                    {msg.playerName || "Ẩn danh"}
                  </span>
                )}
                <div className={`flex items-center gap-1 max-w-[85%] ${isOwn ? "flex-row-reverse" : ""}`}>
                  {isSticker && stickerIcon ? (
                    <img
                      src={stickerIcon.src}
                      alt={stickerIcon.label}
                      title={stickerIcon.label}
                      draggable={false}
                      style={{ WebkitTouchCallout: "none" }}
                      className={`w-20 h-20 object-contain select-none ${msg.status === "sending" ? "opacity-50" : ""} ${msg.status === "failed" ? "opacity-70" : ""}`}
                      {...pressHandlers}
                    />
                  ) : (
                    <div
                      style={{ WebkitTouchCallout: "none" }}
                      className={`min-w-0 px-3.5 py-2 text-sm font-body break-words ${
                        isOwn
                          ? `bg-ink text-paper ${isLastInGroup ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                          : `bg-white border border-ink/8 text-ink ${isLastInGroup ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                      } ${msg.status === "sending" ? "opacity-50" : ""} ${msg.status === "failed" ? "border-red-300 opacity-70" : ""}`}
                      {...pressHandlers}
                    >
                      {msg.content}
                    </div>
                  )}
                  <button
                    type="button"
                    aria-label="Thả cảm xúc"
                    title="Thả cảm xúc"
                    onClick={() => setReactionFor(reactionFor === msg.id ? null : msg.id)}
                    className="shrink-0 w-6 h-6 rounded-full bg-white border border-ink/10 text-ink/40 hover:text-ink flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition"
                  >
                    <IconSmile className="w-3.5 h-3.5" />
                  </button>
                </div>
                {reactionFor === msg.id && (
                  <div className="mt-1 bg-white border border-ink/10 shadow-lg rounded-full px-2 py-1 z-10">
                    <EmojiPicker onSelect={(icon) => handleReact(msg, icon)} />
                  </div>
                )}
                {reactionGroups.length > 0 && (
                  <div className={`flex flex-wrap gap-1 mt-1 px-0.5 ${isOwn ? "justify-end" : ""}`}>
                    {reactionGroups.map((g) => {
                      const e = emojiIconById(g.icon);
                      if (!e) return null;
                      const mine = (msg.reactions || []).some((r) => r.userId === user?.id && r.icon === g.icon);
                      return (
                        <button
                          key={g.icon}
                          type="button"
                          onClick={() => handleReact(msg, g.icon)}
                          aria-label={`${e.label}: ${g.count} người`}
                          title={e.label}
                          className={`flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full border text-[10px] font-body transition ${mine ? "bg-gold/20 border-gold/60 text-ink" : "bg-white border-ink/10 text-ink/60"}`}
                        >
                          <img src={e.src} alt="" className="w-3.5 h-3.5" draggable={false} />
                          {g.count}
                        </button>
                      );
                    })}
                  </div>
                )}
                {isLastInGroup && (
                  <span className={`text-[9px] font-mono mt-0.5 px-1 ${isOwn ? "text-ink/25" : "text-ink/25"}`}>
                    {formatMessageTime(msg.createdAt)}
                    {isOwn && msg.status === "sent" && <Check className="ml-0.5 inline h-2.5 w-2.5" />}
                    {isOwn && msg.status === "failed" && <X className="ml-0.5 inline h-2.5 w-2.5" />}
                  </span>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Composer */}
      {blockedByMe ? (
        <div className="px-4 py-3 bg-red-50 border-t border-red-100 shrink-0 pb-[max(env(safe-area-inset-bottom),12px)]">
          <p className="text-xs font-body text-red-600 text-center">
            Bạn đã chặn {targetUser.name} nên không nhắn tin được nữa. Bỏ chặn ở trang Tìm bạn để trò chuyện lại.
          </p>
        </div>
      ) : (
      <>
        {stickerPickerOpen && (
          <div className="bg-paper border-t border-ink/8 px-3 py-2 shrink-0">
            <EmojiPicker onSelect={handleSendSticker} />
          </div>
        )}
        <form onSubmit={handleSend}
          className={`flex items-end gap-2 p-2 bg-paper shrink-0 pb-[max(env(safe-area-inset-bottom),8px)] ${stickerPickerOpen ? "" : "border-t border-ink/8"}`}>
          <button
            type="button"
            aria-label="Gửi biểu tượng cảm xúc"
            title="Gửi biểu tượng cảm xúc"
            onClick={() => setStickerPickerOpen((o) => !o)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${stickerPickerOpen ? "bg-gold/20 text-ink" : "text-ink/50 hover:bg-ink/5"}`}
          >
            <IconSmile className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập tin nhắn..."
            maxLength={500}
            className="flex-1 bg-ink/5 rounded-2xl px-4 py-2.5 text-sm font-body text-ink placeholder:text-ink/30 outline-none focus:ring-2 focus:ring-gold/30 transition min-h-[40px]"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-gold/80 transition disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </>
      )}

      <ConfirmModal {...confirmProps} />

      {/* Modal báo cáo người dùng */}
      {reportOpen && (
        <Modal onClose={() => !reportBusy && setReportOpen(false)}>
          {reportDone ? (
            <div className="text-center py-2">
              <div className="mb-3 flex justify-center text-[#1B998B]"><Flag className="w-10 h-10" /></div>
              <h3 className="font-display text-lg text-ink mb-1">Đã gửi báo cáo</h3>
              <p className="text-sm text-[#8A7C63] mb-4">
                Cảm ơn bạn! Đội ngũ quản trị sẽ xem xét báo cáo về {targetUser.name}. Nếu người này làm phiền bạn, hãy dùng thêm nút "Chặn người này".
              </p>
              <button
                onClick={() => setReportOpen(false)}
                className="px-5 py-2.5 bg-[#1B998B] text-white text-sm font-bold rounded-full hover:bg-[#178a7d] transition-colors"
              >
                Đóng
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display text-lg text-ink mb-1">Báo cáo {targetUser.name}</h3>
              <p className="text-sm text-[#8A7C63] mb-4">Chọn lý do báo cáo. Quản trị viên sẽ xem xét và xử lý.</p>
              <form onSubmit={submitReport} className="space-y-3">
                <div className="space-y-2">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border cursor-pointer text-sm font-body transition-colors ${
                        reportReason === r.value ? "border-[#1B998B] bg-[#1B998B]/5 text-ink" : "border-ink/10 text-ink/70 hover:bg-ink/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={r.value}
                        checked={reportReason === r.value}
                        onChange={() => setReportReason(r.value)}
                        className="accent-[#1B998B]"
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="Ghi chú thêm (không bắt buộc)"
                  maxLength={1000}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-ink/10 bg-white text-sm font-body outline-none focus:border-[#1B998B] transition-colors resize-none"
                />
                {reportError && <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">{reportError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    disabled={reportBusy}
                    className="flex-1 px-4 py-2.5 bg-white border border-ink/10 text-ink text-sm font-bold rounded-full hover:bg-ink/5 transition-colors disabled:opacity-60"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    disabled={reportBusy}
                    className="flex-1 px-4 py-2.5 bg-[#E5533D] text-white text-sm font-bold rounded-full hover:bg-[#d1452f] transition-colors disabled:opacity-60"
                  >
                    {reportBusy ? "Đang gửi..." : "Gửi báo cáo"}
                  </button>
                </div>
              </form>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
