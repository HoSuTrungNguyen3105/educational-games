
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
