
export function Field({ label, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-[11px] font-mono uppercase text-[#8A7C63] leading-tight">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-[#B7A987] mt-0.5">{hint}</p>}
    </div>
  );
}
