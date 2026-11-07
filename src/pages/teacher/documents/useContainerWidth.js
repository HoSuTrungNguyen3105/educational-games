import { useEffect, useState } from "react";

// useContainerWidth — đo bề rộng thật (clientWidth) của phần tử gắn ref,
// cập nhật theo ResizeObserver. Dùng cho cơ chế TỰ VỪA KHUNG của các
// preview Document Studio (Đợt 2): slide/trang A4 có bề rộng logic cố
// định (920px / 794px), khi khung xem trước hẹp hơn thì tự thu nhỏ theo
// tỷ lệ vừa khung thay vì tràn ngang; nút zoom +/- của giáo viên nhân
// thêm trên mức tự vừa đó. Trả 0 khi chưa đo được (chưa mount).
export function useContainerWidth(ref) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

/** Tỷ lệ tự vừa: không bao giờ phóng to quá 1, chỉ thu nhỏ khi khung hẹp. */
export function fitScale(containerWidth, contentWidth, horizontalPadding = 32) {
  if (!containerWidth) return 1;
  return Math.min(1, Math.max(0.1, (containerWidth - horizontalPadding) / contentWidth));
}
