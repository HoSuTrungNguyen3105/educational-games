import { useState, useRef, useEffect } from "react";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return d.toLocaleDateString("vi-VN");
}

const TYPE_ICONS = {
  GAME_MISSION: "🎮",
  GAME_REWARD: "🎁",
  DAILY_MISSION: "📋",
  NEW_LESSON: "📚",
  TEACHER_ASSIGNMENT: "📝",
  ASSIGNMENT: "📝",
  MESSAGE: "💬",
  LEVEL_UP: "🏆",
  ITEM_REWARD: "🎁",
  COOP_INVITATION: "👥",
  SYSTEM: "🔔",
};

export default function NotificationBell({ notifications, unreadCount, loading, onMarkRead, onMarkAllRead, onRefresh }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) onRefresh?.(); }}
        className="relative p-2 rounded-xl transition hover:opacity-80"
        style={{ background: "var(--bg, #f5f0e8)" }}
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
            style={{ background: "#ef4444" }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-2xl z-50 flex flex-col"
          style={{
            background: "var(--card, #fff)",
            border: "1px solid var(--line, #e5e7eb)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--line, #e5e7eb)" }}>
            <h3 className="font-display text-sm font-bold text-ink">🔔 Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[11px] font-semibold transition hover:opacity-70"
                style={{ color: "var(--accent, #6C3BF5)" }}
              >
                Đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-sm" style={{ color: "var(--muted, #8A7C63)" }}>
                Đang tải...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm" style={{ color: "var(--muted, #8A7C63)" }}>Chưa có thông báo</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read) onMarkRead(n.id);
                  }}
                  className="w-full text-left px-4 py-3 flex items-start gap-3 transition hover:opacity-80"
                  style={{
                    background: n.read ? "transparent" : "var(--accent-bg, rgba(108,59,245,0.04))",
                    borderBottom: "1px solid var(--line, #e5e7eb)",
                  }}
                >
                  <span className="text-xl shrink-0 mt-0.5">{TYPE_ICONS[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-ink truncate">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#ef4444" }} />}
                    </div>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "var(--muted, #8A7C63)" }}>{n.message}</p>
                    <span className="text-[10px] font-mono mt-1 block" style={{ color: "var(--muted, #8A7C63)" }}>
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
