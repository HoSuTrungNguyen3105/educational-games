export function IconButton({ children, onClick, title, className = "" }) {
  return (
    <button onClick={onClick} title={title}
      className={`w-9 h-9 rounded-full flex items-center justify-center border border-ink/15 text-ink hover:bg-ink/5 transition ${className}`}>
      {children}
    </button>
  );
}
