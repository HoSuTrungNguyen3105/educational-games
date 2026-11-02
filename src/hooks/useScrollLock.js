import { useEffect } from "react";

/* Khoá cuộn trang nền khi modal/sheet đang mở — dùng CHUNG cho mọi lớp phủ
 * (Modal dùng chung, sheet menu trang chủ, overlay đăng nhập/đăng ký…).
 *
 * Đếm số lớp phủ đang mở (refcount toàn cục): nhiều modal lồng nhau thì chỉ
 * khi lớp cuối cùng đóng mới trả lại cuộn, và trả đúng giá trị overflow cũ
 * của <html>/<body> chứ không ghi cứng "" — tránh phá style nơi khác đã đặt. */
let lockCount = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";

function acquire() {
  if (lockCount === 0) {
    savedHtmlOverflow = document.documentElement.style.overflow;
    savedBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  lockCount += 1;
}

function release() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.style.overflow = savedHtmlOverflow;
    document.body.style.overflow = savedBodyOverflow;
  }
}

/** useScrollLock() — khoá khi component mount; useScrollLock(active) — khoá theo điều kiện. */
export function useScrollLock(active = true) {
  useEffect(() => {
    if (!active) return undefined;
    acquire();
    return release;
  }, [active]);
}

export default useScrollLock;
