// ─── Thẻ câu hỏi + khu vực trả lời DÙNG CHUNG ────────────────────────────
// Tách nguyên văn từ AssignmentTake.jsx (trang làm bài tập được giao) để
// các luồng làm bài khác — trước mắt là trang tự luyện Bộ đề
// (QuestionSetPracticePage) — dùng cùng một giao diện câu hỏi thay vì
// copy-paste. AssignmentTake nay import lại từ đây, hành vi không đổi.

export function QuestionItem({ question, index, total }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-base font-bold text-amber-600">
          {index + 1}
        </span>
        <span className="text-sm text-gray-400 font-medium">Câu {index + 1} / {total}</span>
      </div>
      <p className="text-base lg:text-lg font-medium text-gray-800 leading-relaxed">{question.content || question.question}</p>
    </div>
  );
}

export function AnswerArea({ question, value, onChange }) {
  const type = question.questionType || question.type || 'multiple_choice';
  const options = question.options || [];

  if (type === 'fill-in' || type === 'text') {
    return (
      <input value={value || ''} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 bg-white text-base text-gray-800 font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
        placeholder="Nhập đáp án của bạn..." />
    );
  }

  return (
    <div className="space-y-3">
      {options.map((opt, optIdx) => {
        const optKey = opt.id || opt.key || opt;
        const optText = opt.content || opt.text || opt.label || optKey;
        const selected = value === optKey;
        const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
        return (
          <button key={optKey} onClick={() => onChange(optKey)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
              selected
                ? 'border-amber-400 bg-amber-50 shadow-sm ring-2 ring-amber-200'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}>
            <div className="flex items-center gap-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition ${
                selected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {labels[optIdx] || optIdx + 1}
              </span>
              <span className={`text-base font-medium ${selected ? 'text-amber-800' : 'text-gray-700'}`}>{optText}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
