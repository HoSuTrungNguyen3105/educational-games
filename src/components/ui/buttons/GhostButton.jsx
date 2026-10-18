export function GhostButton({ children, onClick, className = "", disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`font-display font-semibold rounded-2xl px-5 py-3 border-2 border-ink/20 text-ink hover:bg-ink/5 active:scale-[0.98] transition disabled:opacity-40 ${className}`}>
      {children}
    </button>
  );
}
