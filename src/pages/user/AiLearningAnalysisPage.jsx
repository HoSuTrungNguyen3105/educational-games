// pages/user/AiLearningAnalysisPage.jsx
//
// Trang phân tích kết quả học tập CỦA CHÍNH MÌNH.
//
// `studentId` không được truyền — AI Service sẽ tự chốt người dùng từ Bearer token,
// nên kể cả sửa request trong DevTools cũng không xem được dữ liệu người khác.
//
// Mobile: RouteShell đã lo nút "← Về trang chủ"; ở đây chỉ lo phần nội dung và
// chừa chỗ cho nút nổi chat ở đáy màn hình.

import AiChatWidget from "../../components/ai/AiChatWidget.jsx";
import AiLearningAnalysisPanel from "../../components/ai/AiLearningAnalysisPanel.jsx";

export default function AiLearningAnalysisPage() {
  return (
    <div className="flex-1 w-full">
      <div className="px-4 sm:px-6 py-5 sm:py-8 max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="font-display text-2xl sm:text-3xl text-ink flex items-center gap-2">
            <span aria-hidden>📚</span>
            Tiến bộ của bạn
          </h1>
          <p className="text-sm text-[#8A7C63] mt-1">
            Xem điểm và gợi ý ôn tập được hệ thống tổng hợp từ các ván bạn đã chơi.
          </p>
        </div>

        <AiLearningAnalysisPanel />
      </div>

      {/* Chừa chỗ cho nút nổi chat ở góc phải trên mobile */}
      <div className="h-20 sm:h-4" aria-hidden />

      <AiChatWidget />
    </div>
  );
}