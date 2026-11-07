import { useEffect, useRef, useState } from "react";

// SandboxFrame — iframe xem trước MÃ HTML CỦA GIÁO VIÊN, an toàn:
//   • sandbox KHÔNG có allow-scripts → JavaScript trong mã nguồn không
//     bao giờ chạy (đúng §7/§11 đặc tả). Chỉ có allow-same-origin để
//     trang cha đo được chiều cao nội dung mà tự co giãn khung (srcDoc
//     không chạy script nên việc này không tạo lối thoát sandbox).
//   • Nội dung luôn qua srcDoc (không nạp URL ngoài vào khung chính).
// Zoom bằng transform scale trên khung có kích thước logic cố định.
export default function SandboxFrame({ srcDoc, width = 794, minHeight = 600, zoom = 1 }) {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(minHeight);
  // Nội dung mới → đo lại từ chiều cao tối thiểu (chỉnh state trong
  // render theo pattern React khuyến nghị, không setState trong effect).
  const [lastSrcDoc, setLastSrcDoc] = useState(srcDoc);
  if (srcDoc !== lastSrcDoc) { setLastSrcDoc(srcDoc); setHeight(minHeight); }

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    let observer;
    let timer;
    const fit = () => {
      try {
        const doc = frame.contentDocument;
        if (doc?.documentElement) {
          const h = Math.max(minHeight, doc.documentElement.scrollHeight, doc.body?.scrollHeight || 0);
          setHeight(h);
        }
      } catch { /* sandbox chặn truy cập — giữ chiều cao tối thiểu */ }
    };
    const onLoad = () => {
      fit();
      try {
        const doc = frame.contentDocument;
        if (doc?.body && typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(fit);
          observer.observe(doc.body);
        }
      } catch { /* bỏ qua */ }
      timer = setTimeout(fit, 350);
    };
    frame.addEventListener("load", onLoad);
    return () => {
      frame.removeEventListener("load", onLoad);
      if (observer) observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [srcDoc, minHeight]);

  return (
    <div style={{ width: Math.round(width * zoom), height: Math.round(height * zoom) }} className="mx-auto shrink-0">
      <iframe
        ref={frameRef}
        title="Xem trước tài liệu"
        srcDoc={srcDoc}
        sandbox="allow-same-origin"
        style={{
          width, height, border: 0, display: "block",
          transform: `scale(${zoom})`, transformOrigin: "top left",
          background: "transparent",
        }}
      />
    </div>
  );
}
