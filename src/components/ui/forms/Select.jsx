export function Select({
  value,
  onChange,
  options = [],
  className = "",
  disabled = false,
  id,
  label,
  hint,
  full = false,
  ...rest
}) {
  const baseClass = "w-full rounded-xl border border-ink/15 px-3 py-2 bg-paper2 text-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition";
  const selectClass = `${baseClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const selectElement = (
    <select
      id={id}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={selectClass}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  if (label) {
    return (
      <div className={full ? "w-full" : ""}>
        {label && (
          <label htmlFor={id} className="text-[11px] font-mono uppercase text-[#8A7C63] leading-tight block mb-1">
            {label}
          </label>
        )}
        {selectElement}
        {hint && <p className="text-[10px] text-[#B7A987] mt-0.5">{hint}</p>}
      </div>
    );
  }

  return selectElement;
}
