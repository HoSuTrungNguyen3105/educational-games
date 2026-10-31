import { StampToken } from "../layout/StampToken.jsx";

export function StatCard({ icon, value, label, ring, className = "" }) {
  return (
    <div className={`note-card edu-stat-card p-4 ${className}`}>
      {ring ? (
        <StampToken icon={icon} ring={ring} size={36} fontSize={16} />
      ) : (
        <div className="edu-stat-icon">{icon}</div>
      )}
      <div className="edu-stat-value">{value}</div>
      <div className="edu-stat-label">{label}</div>
    </div>
  );
}
