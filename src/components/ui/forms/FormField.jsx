
export function FormField({ field, value, onChange }) {
  const base = "w-full note-card px-3 py-2 mt-0.5 border-ink/10 focus:border-ticket text-sm";
  const disabled = field.disabled;
  if (field.type === "select") {
    return (
      <select value={value || ""} onChange={e => onChange(field.name, e.target.value)}
        disabled={disabled}
        className={`${base} bg-paper2 ${disabled ? "opacity-50" : ""}`}>
        {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }
  if (field.type === "color") {
    return (
      <div className="flex items-center gap-2 mt-0.5">
        <input type="color" value={value || "#000000"} onChange={e => onChange(field.name, e.target.value)}
          disabled={disabled} className="w-8 h-8 rounded-lg border border-ink/10 cursor-pointer" />
        <input value={value || ""} onChange={e => onChange(field.name, e.target.value)}
          disabled={disabled} className={`${base} ${disabled ? "opacity-50" : ""}`} autoComplete="off" />
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea value={value || ""} onChange={e => onChange(field.name, e.target.value)}
        disabled={disabled} placeholder={field.placeholder || ""}
        className={`${base} min-h-[90px] ${disabled ? "opacity-50" : ""}`} />
    );
  }
  if (field.type === "password") {
    return <PasswordInput value={value || ""} onChange={e => onChange(field.name, e.target.value)} fieldClass={base} />;
  }
  return (
    <input type={field.type || "text"} value={value || ""} onChange={e => onChange(field.name, e.target.value)}
      disabled={disabled} placeholder={field.placeholder || ""} autoComplete="off"
      className={`${base} ${disabled ? "opacity-50" : ""}`} />
  );
}
