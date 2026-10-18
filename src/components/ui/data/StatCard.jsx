import StampToken from "../layout/StampToken.jsx";

export function StatCard({ icon, value, label, ring, className = "" }) {
  return (
    <div className={`note-card p-4 ${className}`}>
      {ring ? (
        <StampToken icon={icon} ring={ring} size={36} fontSize={16} />
      ) : (
        <div className="text-2xl mb-1">{icon}</div>
      )}
      <div className="font-display text-xl text-ink mt-1">{value}</div>
      <div className="text-[10px] text-[#8A7C63] font-mono uppercase">{label}</div>
    </div>
  );
}
