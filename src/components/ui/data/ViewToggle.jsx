import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

export function useViewMode(key, initial = "grid") {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(`edu_view_mode_${key}`);
      return saved === "list" || saved === "grid" ? saved : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(`edu_view_mode_${key}`, mode);
    } catch {
      /* ignore */
    }
  }, [key, mode]);
  return [mode, setMode];
}

// Mobile luôn hiện card; desktop ẩn card khi mode === "list".
export const cardGridClass = (mode) => `grid grid-cols-1 gap-2 ${mode === "grid" ? "" : "md:hidden"}`;

// Mobile luôn ẩn bảng; desktop chỉ hiện bảng khi mode === "list".
export const tableWrapClass = (mode) => `overflow-x-auto ${mode === "list" ? "hidden md:block" : "hidden"}`;

export function ViewToggle({ mode, onChange, className = "hidden md:inline-flex" }) {
  const btn = (active) =>
    `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition ${
      active
        ? "bg-ink text-paper font-semibold shadow-[0_1px_4px_rgba(29,46,74,0.3)]"
        : "text-ink/50 hover:text-ink"
    }`;
  return (
    <div className={`items-center rounded-full bg-ink/5 border border-ink/10 p-0.5 shrink-0 ${className}`}>
      <button type="button" onClick={() => onChange("grid")} title="Dạng thẻ" className={btn(mode === "grid")}>
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Lưới</span>
      </button>
      <button type="button" onClick={() => onChange("list")} title="Dạng bảng" className={btn(mode === "list")}>
        <List className="w-3.5 h-3.5" />
        <span>Bảng</span>
      </button>
    </div>
  );
}
