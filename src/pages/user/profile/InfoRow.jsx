export default function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5 px-2.5 rounded-lg" style={{ background: "var(--bg)" }}>
      <span className="font-mono" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="font-semibold text-ink truncate ml-2 text-right">{value || "—"}</span>
    </div>
  );
}
