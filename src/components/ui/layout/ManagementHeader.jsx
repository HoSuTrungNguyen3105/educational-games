
export function ManagementHeader({ subtitle, title }) {
  return (
    <div>
      <p className="text-[#8A7C63] text-sm font-mono">{subtitle}</p>
      <h1 className="font-display text-3xl text-ink">{title}</h1>
    </div>
  );
}
