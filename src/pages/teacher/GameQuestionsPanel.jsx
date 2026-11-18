import { useState } from 'react'
import QuestionManagement from './QuestionManagement.jsx'
import AllQuestionsManagement from './AllQuestionsManagement.jsx'

/*
 * Panel "Theo game" trong trang Ngân hàng câu hỏi — thay cho trang
 * /dashboard/questions đã gỡ (trước đây là UnifiedQuestionManagement).
 *
 * Giữ nguyên hai góc nhìn của trang cũ, nhúng nguyên hai component cũ:
 *  · "Theo game": chọn một game → CRUD + import câu hỏi của game đó
 *    (QuestionManagement, API questionService theo gameId).
 *  · "Tất cả câu hỏi": mọi câu hỏi game, mỗi câu ghi rõ thuộc game nào,
 *    sửa/xoá tại chỗ (AllQuestionsManagement).
 * Đây là câu hỏi của collection `questions` (gắn game) — khác collection
 * `question_banks` ở tab "Câu hỏi" của trang này; hai hệ không trộn nhau.
 *
 * `initialView` ('byGame' | 'all') cho phép link cũ /dashboard/all-questions
 * (TeacherApp chuyển hướng kèm sessionStorage) mở thẳng góc nhìn "Tất cả".
 *
 * `bankDocs`/`bankSubjects` là danh sách câu hỏi ngân hàng của trang cha —
 * truyền xuống để góc nhìn Theo game có nút "Lấy từ ngân hàng câu hỏi"
 * (BankQuestionPickerModal) mà không phải nạp lại dữ liệu.
 */
export default function GameQuestionsPanel({ showToast, initialView = 'byGame', bankDocs = [], bankSubjects = [] }) {
  const [view, setView] = useState(initialView === 'all' ? 'all' : 'byGame')

  const pill = (active) => `px-4 py-2 rounded-lg text-sm font-semibold transition ${active ? 'bg-white shadow text-ink border border-ink/10' : 'text-ink/60 hover:text-ink'}`

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-ink/5 w-fit">
        <button onClick={() => setView('byGame')} className={pill(view === 'byGame')}>
          Theo game
        </button>
        <button onClick={() => setView('all')} className={pill(view === 'all')}>
          Tất cả câu hỏi
        </button>
      </div>
      {view === 'byGame' ? (
        <QuestionManagement showToast={showToast} bankDocs={bankDocs} bankSubjects={bankSubjects} />
      ) : (
        <AllQuestionsManagement showToast={showToast} />
      )}
    </div>
  )
}
