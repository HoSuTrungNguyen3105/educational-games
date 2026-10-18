
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
        className={`${contentBase} ${contentClassName}`}
        style={contentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
