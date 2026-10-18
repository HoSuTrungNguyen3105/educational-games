export function ToggleSwitch({ checked, onChange, className = "", disabled = false, label, id }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        id={id}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-violet-600" : "bg-ink/20"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      {label && (
        <label htmlFor={id} className={`text-sm text-ink ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
          {label}
        </label>
      )}
    </div>
  );
}
