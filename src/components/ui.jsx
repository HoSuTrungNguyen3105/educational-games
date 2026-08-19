export function StampToken({ icon, ring = "#F4B942", size = 56, fontSize = 24, className = "" }) {
  return (
    <div className={`stamp-token ${className}`} style={{ "--ring": ring, width: size, height: size, fontSize: fontSize }}>
      <span>{icon}</span>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    published: { label: "Đã xuất bản", cls: "bg-teal/15 text-teal border-teal/30" },
    draft: { label: "Bản nháp", cls: "bg-gold/15 text-[#8a6a10] border-gold/40" },
  };
  const s = map[status] || map.draft;
  return <span className={`badge-status text-[11px] uppercase px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
}

export function PrimaryButton({ children, onClick, className = "", disabled, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`font-display font-semibold rounded-2xl px-5 py-3 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_3px_0_rgba(0,0,0,0.18)] ${className}`}>
      {children}
    </button>
  );
}
export function GhostButton({ children, onClick, className = "", disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`font-display font-semibold rounded-2xl px-5 py-3 border-2 border-ink/20 text-ink hover:bg-ink/5 active:scale-[0.98] transition disabled:opacity-40 ${className}`}>
      {children}
    </button>
  );
}
export function IconButton({ children, onClick, title, className = "" }) {
  return (
    <button onClick={onClick} title={title}
      className={`w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:bg-ink/5 transition ${className}`}>
      {children}
    </button>
  );
}

export function Loader({ label = "Đang tải..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-ink/70">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-ink/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-ticket border-t-transparent animate-spin"></div>
      </div>
      <p className="font-body text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ icon = "🎟️", title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="text-5xl float-slow">{icon}</div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {subtitle && <p className="text-sm text-[#8A7C63] max-w-sm">{subtitle}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Đã có lỗi xảy ra", subtitle, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="text-5xl">🎪</div>
      <h3 className="font-display text-lg text-ticket">{title}</h3>
      {subtitle && <p className="text-sm text-[#8A7C63] max-w-sm">{subtitle}</p>}
      {onRetry && <PrimaryButton onClick={onRetry}>Thử lại</PrimaryButton>}
    </div>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const cls = toast.type === "error" ? "bg-ticket text-white" : toast.type === "success" ? "bg-teal text-white" : "bg-ink text-paper";
  return <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg font-body text-sm anim-pop ${cls}`}>{toast.message}</div>;
}

export function TicketStub({ icon, code, notchBg = "#FFF6E7" }) {
  return (
    <div className="ticket-stub" style={{ "--notch-bg": notchBg }}>
      <div className="ticket-stub-tab">{icon}</div>
      <div className="ticket-stub-body flex items-center justify-center">
        <span className="font-mono text-2xl sm:text-3xl tracking-[0.3em] text-ink font-bold">{code}</span>
      </div>
    </div>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div className="note-card max-w-md w-full p-6 anim-pop" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}