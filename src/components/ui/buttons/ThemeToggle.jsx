import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../lib/hooks.js";

/**
 * ThemeToggle — nút chuyển chế độ Sáng/Tối dùng chung (trang chủ client +
 * thanh admin bar + trang Cài đặt). Trạng thái nằm ở useTheme()
 * (src/lib/hooks.js): lưu localStorage, áp qua data-theme trên <html>.
 * className do nơi dùng quyết định để khớp nút xung quanh
 * ("gq-iconbtn" ở trang chủ, "edu-bar-btn" ở dashboard).
 */
export function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
