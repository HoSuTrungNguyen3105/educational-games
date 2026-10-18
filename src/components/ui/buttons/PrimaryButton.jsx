export function PrimaryButton({ children, onClick, className = "", disabled, type = "button" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`font-display font-semibold rounded-2xl px-5 py-3 bg-ink text-paper hover:bg-ink2 active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_3px_0_rgba(0,0,0,0.18)] ${className}`}>
      {children}
    </button>
  );
}
