export function IconButton({ children, onClick, title, className = "", tone = "default" }) {
  return (
    <button type="button" onClick={onClick} title={title} aria-label={title}
      className={`edu-icon-btn w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:bg-ink/5 transition ${tone === "danger" ? "edu-icon-danger" : ""} ${className}`}>
      {children}
    </button>
  );
}
