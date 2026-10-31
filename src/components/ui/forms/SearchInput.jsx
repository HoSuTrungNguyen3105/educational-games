import { Search, X } from "lucide-react";

export function SearchInput({ value, onChange, placeholder = "Tìm kiếm...", className = "", ...rest }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 rounded-xl border border-ink/10 bg-paper2 text-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
        {...rest}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition"
          title="Xóa tìm kiếm"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
