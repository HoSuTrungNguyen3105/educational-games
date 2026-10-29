/**
 * TaskIcon.jsx — icon SVG của nhiệm vụ, chọn theo `code` (VD: "PLAY_10" → tay cầm
 * game) rồi mới đến `type`; bảng tra nằm ở `taskIconMap.js`.
 *
 * Field `icon` (emoji) mà API trả về không còn được hiển thị ở đâu nữa — trang
 * nhiệm vụ, bảng quản trị và sheet trang chủ đều dùng component này, nên hình
 * luôn khớp nhau và tô theo màu `currentColor` của UI.
 *
 * Nét vẽ đều: fill none, stroke hiện tại, không nền, không gradient.
 */
import { ICON_PATHS, taskIconName } from "./taskIconMap.js";

export default function TaskIcon({ code, type, className = "w-4 h-4", strokeWidth = 1.6, ...rest }) {
  const name = taskIconName(code, type);
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {ICON_PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
