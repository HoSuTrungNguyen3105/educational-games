import { forwardRef } from "react";

export const Input = forwardRef(({
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  disabled = false,
  maxLength,
  min,
  max,
  step,
  id,
  label,
  hint,
  full = false,
  variant = "default",
  rows,
  onKeyDown,
  ...rest
}, ref) => {
  const getBaseClass = () => {
    if (variant === "dark") {
      return "w-full rounded-xl border border-white/20 px-3 py-2 bg-white/8 text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition";
    }
    if (variant === "minimal") {
      return "w-full px-3 py-2 bg-transparent text-ink font-body text-sm focus:outline-none";
    }
    return "w-full rounded-xl border border-ink/15 px-3 py-2 bg-paper2 text-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition";
  };

  const baseClass = getBaseClass();
  const inputClass = `${baseClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  const handleChange = (e) => {
    if (type === "number") {
      onChange(e.target.value ? parseFloat(e.target.value) : "");
    } else {
      onChange(e.target.value);
    }
  };

  const inputElement = type === "textarea" ? (
    <textarea
      id={id}
      ref={ref}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      rows={rows || 3}
      className={inputClass}
      onKeyDown={onKeyDown}
      {...rest}
    />
  ) : (
    <input
      type={type}
      id={id}
      ref={ref}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      className={inputClass}
      onKeyDown={onKeyDown}
      {...rest}
    />
  );

  if (label) {
    return (
      <div className={full ? "w-full" : ""}>
        {label && (
          <label htmlFor={id} className="text-[11px] font-mono uppercase text-[#8A7C63] leading-tight block mb-1">
            {label}
          </label>
        )}
        {inputElement}
        {hint && <p className="text-[10px] text-[#B7A987] mt-0.5">{hint}</p>}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = "Input";
