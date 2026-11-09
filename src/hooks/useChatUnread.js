import { useCallback, useEffect, useState } from "react";
import { conversationApi } from "../services/conversationApi.js";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";

/**
 * useChatUnread — tổng số tin nhắn chưa đọc của mọi cuộc trò chuyện, dùng
 * cho huy hiệu ở mục "Tin nhắn" của thanh điều hướng dưới cùng (BottomNav).
 *
 * Trước đây logic này nằm riêng trong HomeScreen; tách ra hook dùng chung
 * (2026-11-09) để trang Danh mục (/categories) — nơi thanh điều hướng nay
 * cũng hiện — dùng cùng một nguồn số liệu, không nhân bản.
 *
 * Hành vi giữ nguyên bản gốc: nạp khi đăng nhập/thay user; có tin mới qua
 * socket thì nạp lại ngay (debounce 300ms như ConversationListScreen);
 * resetChatUnread() đưa huy hiệu về 0 tức thì (trang chủ gọi khi người
 * dùng mở mục Tin nhắn).
 *
 * Trả về { chatUnread, resetChatUnread }.
 */
export default function useChatUnread(userAuth) {
  const [chatUnread, setChatUnread] = useState(0);

  const loadChatUnread = useCallback(async () => {
    if (!userAuth?.user) { setChatUnread(0); return; }
    try {
      const convs = await conversationApi.list();
      setChatUnread((convs || []).reduce((sum, c) => sum + (c.unread || 0), 0));
    } catch { /* giữ số cũ — huy hiệu là thông tin phụ */ }
  }, [userAuth?.user]);

  useEffect(() => { loadChatUnread(); }, [loadChatUnread]);

  useEffect(() => {
    if (!userAuth?.user) return;
    let timer;
    const onChatMessage = (msg) => {
      // Tin mình gửi đi (echo về room của mình) không tính là chưa đọc.
      if (!msg || msg.error || msg.senderId === userAuth.user.id) return;
      clearTimeout(timer);
      timer = setTimeout(loadChatUnread, 300);
    };
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, onChatMessage);
    return () => {
      clearTimeout(timer);
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE, onChatMessage);
    };
  }, [userAuth?.user, loadChatUnread]);

  const resetChatUnread = useCallback(() => setChatUnread(0), []);

  return { chatUnread, resetChatUnread };
}
