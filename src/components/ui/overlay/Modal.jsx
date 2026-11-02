import { useEffect, useRef } from "react";
import { useScrollLock } from "../../../hooks/useScrollLock.js";

/* Ngăn xếp các Modal đang mở: ESC chỉ đóng modal TRÊN CÙNG (ví dụ hộp xác
 * nhận xoá mở đè lên modal sửa) — không đóng tất cả cùng lúc. */
const modalStack = [];

export function Modal({
  children,
  onClose,
  wide,
  /**
   * - "center": modal dạng card (mặc định)
   * - "bottom": giống bottom-sheet (dùng cho mobile)
   */
  align = "center",
  overlayClassName = "",
  contentClassName = "",
  overlayStyle,
  contentStyle,
  contentRef,
  unstyled = false,
  closeOnBackdrop = true,
}) {
  // Chuẩn chung cho MỌI modal của app: khoá cuộn trang nền khi mở và ESC để
  // đóng (trước đây chỉ có bấm ra ngoài nền; từng modal tự lo nên chỗ có
  // khoá cuộn chỗ không). Modal chỉ mount khi đang mở nên hook chạy vô điều kiện.
  useScrollLock();
  const stackEntryRef = useRef(null);
  useEffect(() => {
    const entry = {};
    stackEntryRef.current = entry;
    modalStack.push(entry);
    return () => {
      const i = modalStack.indexOf(entry);
      if (i >= 0) modalStack.splice(i, 1);
    };
  }, []);
  useEffect(() => {
    if (!onClose) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && modalStack[modalStack.length - 1] === stackEntryRef.current) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // z-[70]: cao hơn các panel/modal khác trong app (z-40, z-50, z-[60]) để
  // luôn nổi lên trên, nhưng vẫn dưới Toast (z-[100]) để thông báo không bị che.
  const overlayBase =
    `fixed inset-0 z-[70] flex ${align === "bottom" ? "items-end justify-center" : "items-center justify-center"} ` +
    `${align === "center" ? "px-2 sm:px-4" : ""} bg-ink/40 backdrop-blur-sm`;

  const contentBase = unstyled
    ? "w-full"
    : `note-card w-full p-4 sm:p-6 anim-pop max-h-[90vh] overflow-y-auto ${wide ? "max-w-[95vw]" : "max-w-md"}`;

  return (
    <div
      className={`${overlayBase} ${overlayClassName}`}
      onClick={closeOnBackdrop ? onClose : undefined}
      style={{ marginTop: 0, ...(overlayStyle || {}) }}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={`${contentBase} ${contentClassName}`}
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
