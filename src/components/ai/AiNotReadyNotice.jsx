// components/ai/AiNotReadyNotice.jsx
//
// Thông báo dùng chung khi một tính năng AI chưa dùng được.
//
// Có đúng HAI trạng thái để người dùng không hiểu nhầm:
//   configuring → quản trị chưa bật AI trong Cấu hình hệ thống: "đang được cấu hình,
//                 chưa sử dụng được" (đây là thông báo hiện tại của toàn hệ thống).
//   unavailable → đã bật nhưng AI Service/model chưa trả lời: báo không khả dụng tạm thời.
//
// Nội dung lấy từ server (h.notice) — component không tự bịa câu khác, để học sinh thấy
// cùng một thông báo ở trang chủ, trong game, kho câu hỏi và trang phân tích.
// Không hiển thị địa chỉ AI Service, tên máy chủ hay chi tiết kỹ thuật.

import { Bot, Loader2 } from "lucide-react";

export function AiNotReadyNotice({
  state = "configuring",
  notice,
  hint,
  variant = "card",
  className = "",
}) {
  const text =
    notice || (state === "unavailable"
      ? "Dịch vụ AI tạm thời không khả dụng. Bạn vẫn học và chơi game bình thường."
      : "Trợ lý AI đang được cấu hình, chưa sử dụng được.");

  const sub = hint || (state === "unavailable"
    ? "Thử lại sau một lát nhé."
    : "Quản trị viên sẽ bật khi máy chủ AI hoàn tất cấu hình.");

  const icon = state === "checking"
    ? <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
    : <Bot className="w-4 h-4 shrink-0" aria-hidden="true" />;

  if (variant === "inline") {
    return (
      <div className={`flex items-start gap-2 text-[12px] leading-snug text-[#8A7C63] ${className}`}>
        {icon}
        <span>
          <span className="block font-medium text-ink">{text}</span>
          <span className="block mt-0.5">{sub}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-3 flex items-start gap-2.5 ${className}`}>
      <span className="mt-0.5 text-[#8a6a10]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink leading-snug break-words">{text}</p>
        <p className="text-[11px] text-[#8A7C63] leading-snug mt-0.5 break-words">{sub}</p>
      </div>
    </div>
  );
}

export default AiNotReadyNotice;
