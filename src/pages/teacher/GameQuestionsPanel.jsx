import QuestionManagement from './QuestionManagement.jsx'

/*
 * Panel "Theo game" trong trang Ngân hàng câu hỏi — thay cho trang
 * /dashboard/questions đã gỡ (trước đây là UnifiedQuestionManagement):
 * chọn một game → CRUD + import câu hỏi của game đó (QuestionManagement,
 * API questionService theo gameId), kèm "Lấy từ ngân hàng câu hỏi"
 * (BankQuestionPickerModal) và "Tạo câu hỏi bằng AI"
 * (AiQuestionGenerateModal).
 *
 * Góc nhìn "Tất cả câu hỏi" của trang cũ đã được gỡ theo yêu cầu của
 * Nguyên (2026-11-18) — chỉ còn góc nhìn theo từng game. Link cũ
 * /dashboard/all-questions vẫn chuyển hướng về trang Ngân hàng câu hỏi
 * (TeacherApp kèm sessionStorage 'edu_qb_open') và mở thẳng tab này.
 *
 * Đây là câu hỏi của collection `questions` (gắn game) — khác collection
 * `question_banks` ở tab "Câu hỏi" của trang này; hai hệ không trộn nhau.
 *
 * `bankDocs`/`bankSubjects` là danh sách câu hỏi ngân hàng của trang cha —
 * truyền xuống để QuestionManagement mở modal "Lấy từ ngân hàng câu hỏi"
 * mà không phải nạp lại dữ liệu.
 */
export default function GameQuestionsPanel({ showToast, bankDocs = [], bankSubjects = [] }) {
  return (
    <QuestionManagement showToast={showToast} bankDocs={bankDocs} bankSubjects={bankSubjects} />
  )
}
