/**
 * ChartCard — khung biểu đồ khớp note-card của dashboard: tiêu đề, nút góc
 * phải, chú thích nguồn số liệu bên dưới và footer (thường là legend).
 */
export default function ChartCard({ title, icon, actions, caption, footer, children, className = "" }) {
  return (
    <section className={`note-card p-4 sm:p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="font-display text-base sm:text-lg text-ink leading-tight">
          {icon && <span className="inline mr-2 align-[-2px] text-ticket">{icon}</span>}
          {title}
        </h2>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="min-w-0">{children}</div>
      {footer}
      {caption && <p className="text-[10px] sm:text-[11px] font-mono text-[#B7A987] leading-relaxed mt-auto">{caption}</p>}
    </section>
  );
}
