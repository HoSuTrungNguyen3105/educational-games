
export function StatusBadge({ status }) {
  const map = {
    published: { label: "Đã xuất bản", cls: "bg-teal/15 text-teal border-teal/30" },
    draft: { label: "Bản nháp", cls: "bg-gold/15 text-[#8a6a10] border-gold/40" },
  };
  const s = map[status] || map.draft;
  return <span className={`badge-status text-[11px] uppercase px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
}
