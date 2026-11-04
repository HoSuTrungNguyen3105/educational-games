import { create } from "zustand";
import { socket } from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/socket.events.js";

// Store hiện diện online dùng chung: giữ tập userId đang online TRONG VÒNG
// của người dùng hiện tại (server chỉ gửi presence của bạn bè + đối tác DM
// 1-1, không phải toàn hệ thống). Các màn hình cần chấm xanh (Tìm bạn, Danh
// sách hội thoại, header DM) đều đọc từ đây qua useIsOnline/useOnlineIds —
// không màn hình nào tự nghe socket cho việc này.
//
// Server là nguồn sự thật: khi vừa kết nối, server gửi PRESENCE_SNAPSHOT
// (thay toàn bộ tập), sau đó PRESENCE_ONLINE/OFFLINE cập nhật từng người.
// Khi socket mất kết nối thì XÓA SẠCH — không khẳng định ai còn online nữa;
// snapshot mới sẽ đến khi kết nối lại.
export const usePresenceStore = create((set) => ({
  onlineIds: new Set(),
  setSnapshot: (ids) =>
    set({ onlineIds: new Set(Array.isArray(ids) ? ids : []) }),
  markOnline: (userId) =>
    set((s) => {
      if (!userId || s.onlineIds.has(userId)) return s;
      const next = new Set(s.onlineIds);
      next.add(userId);
      return { onlineIds: next };
    }),
  markOffline: (userId) =>
    set((s) => {
      if (!userId || !s.onlineIds.has(userId)) return s;
      const next = new Set(s.onlineIds);
      next.delete(userId);
      return { onlineIds: next };
    }),
  clear: () => set((s) => (s.onlineIds.size ? { onlineIds: new Set() } : s)),
}));

let bound = false;

/** Gắn listener presence vào socket dùng chung — gọi một lần ở tầng App. */
export function bindPresenceListeners() {
  if (bound) return;
  bound = true;
  const store = usePresenceStore;
  socket.on(SOCKET_EVENTS.PRESENCE_SNAPSHOT, (payload) =>
    store.getState().setSnapshot(payload?.userIds)
  );
  socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, (payload) =>
    store.getState().markOnline(payload?.userId)
  );
  socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, (payload) =>
    store.getState().markOffline(payload?.userId)
  );
  socket.on("disconnect", () => store.getState().clear());
}

/** Hook: một user cụ thể có đang online không (không dùng cho chính mình). */
export function useIsOnline(userId) {
  return usePresenceStore((s) => !!userId && s.onlineIds.has(userId));
}

/** Hook: cả tập userId đang online (cho màn hình hiển thị nhiều người). */
export function useOnlineIds() {
  return usePresenceStore((s) => s.onlineIds);
}
