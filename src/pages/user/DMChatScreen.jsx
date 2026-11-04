import { useState, useEffect, useRef, useMemo } from "react";
import { chatApi } from "../../services/chatApi.js";
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

  useEffect(() => {
    if (!loading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [loading, messages.length]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending || !user) return;

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
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) =>
          m.id !== clientMessageId && m.clientMessageId !== clientMessageId
        );
        // Socket already delivered the saved message
        if (withoutOptimistic.some((m) => m.id === saved.id)) return withoutOptimistic;
        return [...withoutOptimistic, { ...saved, status: "sent" }];
      });
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

            return (
              <div key={msg.id || i} className={`flex flex-col ${isOwn ? "items-end" : "items-start"} ${showSender ? "mt-2" : "mt-0.5"}`}>
                {showSender && !isOwn && (
                  <span className="text-[10px] font-body mb-0.5 px-1 text-ink/40">
                    {msg.playerName || "Ẩn danh"}
                  </span>
                )}
                <div className={`max-w-[75%] px-3.5 py-2 text-sm font-body break-words ${
                  isOwn
                    ? `bg-ink text-paper ${isLastInGroup ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                    : `bg-white border border-ink/8 text-ink ${isLastInGroup ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                } ${msg.status === "sending" ? "opacity-50" : ""} ${msg.status === "failed" ? "border-red-300 opacity-70" : ""}`}>
                  {msg.content}
                </div>
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
      <form onSubmit={handleSend}
        className="flex items-end gap-2 p-2 bg-paper border-t border-ink/8 shrink-0 pb-[max(env(safe-area-inset-bottom),8px)]">
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
