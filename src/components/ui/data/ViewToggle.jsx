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
// Grid: 1 cột trên mobile, 2 cột desktop, 3 cột màn hình rất rộng.
export const cardGridClass = (mode) => `grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2 ${mode === "grid" ? "" : "md:hidden"}`;

// Mobile luôn ẩn bảng; desktop chỉ hiện bảng khi mode === "list".
export const tableWrapClass = (mode) => `edu-table-wrap ${mode === "list" ? "hidden md:block" : "hidden"}`;

export function ViewToggle({ mode, onChange, className = "hidden md:inline-flex" }) {
  return (
    <div className={`edu-view-toggle ${className}`}>
      <button type="button" onClick={() => onChange("grid")} title="Dạng thẻ"
        className={mode === "grid" ? "is-active" : ""}>
        <LayoutGrid />
        <span>Lưới</span>
      </button>
      <button type="button" onClick={() => onChange("list")} title="Dạng bảng"
        className={mode === "list" ? "is-active" : ""}>
        <List />
        <span>Bảng</span>
      </button>
    </div>
  );
}
