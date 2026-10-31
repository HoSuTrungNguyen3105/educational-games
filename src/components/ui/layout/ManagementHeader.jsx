export function ManagementHeader({ subtitle, title, children }) {
  return (
    <div className="edu-page-title">
      <div className="min-w-0">
        <h1>{title}</h1>
        {subtitle && <p className="edu-page-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap shrink-0">{children}</div>}
    </div>
  );
}
