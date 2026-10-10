// pages/user/AiLearningAnalysisPage.jsx
//
// Trang phân tích kết quả học tập CỦA CHÍNH MÌNH.
//
// `studentId` không được truyền — AI Service sẽ tự chốt người dùng từ Bearer token,
// nên kể cả sửa request trong DevTools cũng không xem được dữ liệu người khác.

import AiChatWidget from "../../components/ai/AiChatWidget.jsx";
import AiLearningAnalysisPanel from "../../components/ai/AiLearningAnalysisPanel.jsx";

export default function AiLearningAnalysisPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-10 max-w-4xl mx-auto w-full pb-24">
      <AiLearningAnalysisPanel />
      <AiChatWidget />
    </div>
  );
}