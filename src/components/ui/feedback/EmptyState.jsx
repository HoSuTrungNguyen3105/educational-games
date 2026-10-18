
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
