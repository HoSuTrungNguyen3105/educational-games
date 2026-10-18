
export function StampToken({ icon, ring = "#F4B942", size = 56, fontSize = 24, className = "" }) {
  return (
    <div className={`stamp-token ${className}`} style={{ "--ring": ring, width: size, height: size, fontSize: fontSize }}>
      <span>{icon}</span>
    </div>
  );
}
