export function Checkbox({ checked, onChange, className = "", disabled = false, label, id }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`w-4 h-4 accent-violet-600 shrink-0 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      />
      {label && (
        <label htmlFor={id} className={`text-sm text-ink ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
          {label}
        </label>
      )}
    </div>
  );
}
