import { useCallback, useEffect, useRef, useState } from "react";
import { checkinService } from "../services/checkinService.js";

/**
 * Trạng thái "Điểm danh mỗi ngày" của học sinh đang đăng nhập.
 *
 * - `enabled=false` (chưa đăng nhập / không phải học sinh) → không gọi API,
 *   status trả ra luôn null.
 * - Lỗi tải → status giữ null để thẻ điểm danh ẨN LẶNG LẼ, trang chủ không
 *   vỡ vì một tính năng phụ.
 * - `checkIn()` trả kết quả POST (gồm reward + coins mới) để nơi gọi hiện
 *   toast và cập nhật ví; status được hợp nhất luôn từ kết quả đó.
 */
export function useCheckin(enabled) {
  const [fetched, setFetched] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    if (!enabled) return () => { aliveRef.current = false; };
    checkinService
      .getStatus()
      .then((s) => { if (aliveRef.current) setFetched(s || null); })
      .catch(() => { if (aliveRef.current) setFetched(null); });
    return () => { aliveRef.current = false; };
  }, [enabled]);

  const checkIn = useCallback(async () => {
    setCheckingIn(true);
    try {
      const result = await checkinService.checkIn();
      if (result) setFetched((prev) => ({ ...(prev || {}), ...result }));
      return result;
    } finally {
      setCheckingIn(false);
    }
  }, []);

  return { status: enabled ? fetched : null, checkingIn, checkIn };
}
