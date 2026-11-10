// hooks/useAiCreditStatus.js
//
// "Hôm nay còn khoảng bao nhiêu token AI?" — trạng thái credit cho khung
// chat AI Bạn Học (hiện tại chỉ AiChatWidget dùng; tính năng AI khác cần
// thì import chung hook này, đừng tự gọi endpoint lặp lại).
//
// Nguyên tắc (theo đúng triết lý của useAiAvailability):
//  - Hook KHÔNG tự gọi API khi mount, KHÔNG polling. Chỉ `refresh()` khi
//    người dùng MỞ khung chat và sau mỗi lượt gửi — đúng lúc số liệu có
//    thể vừa thay đổi và người dùng đang nhìn vào khung chat.
//  - Lỗi nạp / chưa đăng nhập / nhà cung cấp không hỗ trợ → status = null
//    → UI ẨN lặng lẽ. Credit là thông tin phụ: tuyệt đối không hiện lỗi
//    vào mặt học sinh, không chặn chat.
//  - Số liệu là ƯỚC TÍNH phía server (bộ đếm nội bộ theo ngày UTC) — văn
//    bản hiển thị ở component phải giữ chữ "khoảng"/"ước tính".

import { useCallback, useRef, useState } from "react";
import { getCreditStatus } from "../services/aiApi.js";

/** Định dạng số token kiểu Việt Nam (200000 → "200.000"). */
export function formatTokenCount(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "";
  return new Intl.NumberFormat("vi-VN").format(Math.max(0, Math.round(v)));
}

/**
 * @returns {{ status: object|null, refresh: () => Promise<void> }}
 *   status null = chưa nạp được/không hỗ trợ → ẩn hiển thị.
 */
export function useAiCreditStatus() {
  const [status, setStatus] = useState(null);
  const inFlightRef = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return; // đang nạp dở → bỏ qua, tránh chồng request
    inFlightRef.current = true;
    try {
      const s = await getCreditStatus();
      // supported: false (không phải đường Groq) hoặc thiếu số token → ẩn.
      setStatus(s && s.supported && typeof s.remainingTokensToday === "number" ? s : null);
    } catch {
      setStatus(null); // ẩn lặng lẽ — không log lỗi ra UI
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  return { status, refresh };
}
