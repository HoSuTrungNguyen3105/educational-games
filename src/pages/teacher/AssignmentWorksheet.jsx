import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';
import './worksheet-print.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/** Khóa của một lựa chọn — cùng quy ước với AssignmentTake và server chấm bài. */
function optionKey(opt) {
  if (opt && typeof opt === 'object') return opt.id ?? opt.key ?? opt;
  return opt;
}

function optionText(opt) {
  if (opt && typeof opt === 'object') {
    return opt.content || opt.text || opt.label || opt.value || String(optionKey(opt));
  }
  return String(opt);
}

function questionType(q) {
  return q.questionType || q.type || 'multiple_choice';
}

function questionText(q) {
  return q.content || q.question || '';
}

function questionOptions(q) {
  return q.options || q.answers || [];
}

function isFillIn(q) {
  const t = questionType(q);
  return t === 'fill-in' || t === 'text';
}

/**
 * Đáp án đúng dạng hiển thị cho trang đáp án của giáo viên.
 * Trắc nghiệm: tra theo khóa lựa chọn (đúng cách server chấm — value === correctAnswer),
 * dự phòng khớp theo nội dung lựa chọn hoặc chỉ số số học ở dữ liệu cũ.
 * Điền từ/tự luận: đáp án là chính văn bản correctAnswer.
 */
function resolveCorrectAnswer(q) {
  const raw = q.correctAnswer ?? q.answer;
  if (raw == null || raw === '') return '—';
  if (isFillIn(q)) return String(raw);
  const options = questionOptions(q);
  if (typeof raw === 'number' && options[raw]) {
    return `${LETTERS[raw]}. ${optionText(options[raw])}`;
  }
  for (let i = 0; i < options.length; i++) {
    if (String(optionKey(options[i])).toLowerCase() === String(raw).toLowerCase()) {
      return `${LETTERS[i]}. ${optionText(options[i])}`;
    }
  }
  for (let i = 0; i < options.length; i++) {
    if (optionText(options[i]).trim().toLowerCase() === String(raw).trim().toLowerCase()) {
      return `${LETTERS[i]}. ${optionText(options[i])}`;
    }
  }
  return String(raw);
}

/**
 * Phiếu bài tập để in ra giấy (kèm trang đáp án riêng cho giáo viên).
 * Render qua portal ra body để CSS @media print ẩn toàn bộ app và chỉ in vùng phiếu.
 */
export default function AssignmentWorksheet({ assignment, questions, totalQuestions, loadError, onClose }) {
  const missing = (totalQuestions ?? questions.length) - questions.length;

  return createPortal(
    <div className="ws-overlay fixed inset-0 z-50 overflow-y-auto bg-black/60">
      {/* Thanh công cụ — chỉ hiện trên màn hình, không in */}
      <div className="ws-noprint sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur px-4 sm:px-6 py-3 shadow">
        <div className="min-w-0">
          <p className="font-display text-base text-ink truncate">Phiếu bài tập — {assignment.title}</p>
          <p className="text-xs font-body text-ink/50">
            Hiển thị 2 trang cạnh nhau: bên trái cho giáo viên (có đáp án), bên phải cho học sinh (không đáp án). Chọn máy in hoặc "Lưu thành PDF" trong hộp thoại in.
          </p>
          {missing > 0 && (
            <p className="text-xs font-body text-red-600 mt-0.5">
              Lưu ý: {missing}/{totalQuestions} câu hỏi không còn trong ngân hàng nên không in được.
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            disabled={loadError || questions.length === 0}
            className="px-4 py-2 bg-ink text-white rounded-xl text-sm font-body font-semibold hover:opacity-85 transition flex items-center gap-1.5 disabled:opacity-40"
          >
            <Printer className="w-4 h-4" /> In phiếu
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-2 bg-ink/5 text-ink/70 rounded-xl text-sm font-body hover:bg-ink/10 transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Đóng
          </button>
        </div>
      </div>

      {/* Vùng phiếu — hai trang cạnh nhau: giáo viên (có đáp án) | học sinh (không đáp án) */}
      <div className="ws-grid">
        {loadError ? (
          <p className="ws-empty">Không tải được câu hỏi của bài tập. Vui lòng thử lại.</p>
        ) : questions.length === 0 ? (
          <p className="ws-empty">Bài tập này chưa có câu hỏi nào để in.</p>
        ) : (
          <>
            {/* TRANG GIÁO VIÊN — có đáp án */}
            <WorksheetSheet
              variant="teacher"
              assignment={assignment}
              questions={questions}
            />

            {/* TRANG HỌC SINH — không có đáp án */}
            <WorksheetSheet
              variant="student"
              assignment={assignment}
              questions={questions}
            />
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}

function WorksheetSheet({ variant, assignment, questions }) {
  const showAnswers = variant === 'teacher';

  return (
    <section className={showAnswers ? 'ws-sheet ws-sheet-teacher' : 'ws-sheet ws-sheet-student'}>
      <div className="ws-ribbon">
        {showAnswers ? 'GIÁO VIÊN — CÓ ĐÁP ÁN' : 'HỌC SINH — KHÔNG ĐÁP ÁN'}
      </div>
      <header className="ws-head">
        <h1 className="ws-title">{assignment.title}</h1>
        <p className="ws-meta">
          Mã bài: {assignment.code || '—'} · {questions.length} câu
          {assignment.isExam && assignment.examDuration ? ` · Thời gian làm bài: ${assignment.examDuration} phút` : ''}
        </p>
        <div className="ws-info">
          <span className="ws-info-item ws-info-grow">Họ và tên: <i className="ws-blank" /></span>
          <span className="ws-info-item">Lớp: <i className="ws-blank ws-blank-sm" /></span>
          <span className="ws-info-item">Ngày: <i className="ws-blank ws-blank-sm" /></span>
        </div>
        <p className="ws-guide">
          Hướng dẫn: Em đọc kĩ từng câu hỏi. Câu trắc nghiệm: em tô hoặc khoanh tròn vào chữ cái của đáp án đúng nhất.
          Câu điền từ: em viết đáp án ngắn gọn vào dòng kẻ.
        </p>
      </header>

      <div className="ws-questions">
        {questions.map((q, i) => (
          <div key={q.id || i} className="ws-q">
            <p className="ws-q-text">
              <strong>Câu {i + 1}.</strong>{' '}
              {q.icon ? `${q.icon} ` : ''}{questionText(q)}
            </p>
            {isFillIn(q) ? (
              <div className="ws-write" aria-hidden="true">
                <span className="ws-write-line" />
                <span className="ws-write-line" />
              </div>
            ) : (
              <ul className="ws-opts">
                {questionOptions(q).map((opt, j) => (
                  <li key={j} className="ws-opt">
                    <span className="ws-circle" aria-hidden="true" />
                    <span><strong>{LETTERS[j] || j + 1}.</strong> {optionText(opt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Đáp án — chỉ hiện ở trang giáo viên */}
      {showAnswers && (
        <section className="ws-answer-key">
          <h2 className="ws-answer-title">ĐÁP ÁN</h2>
          <p className="ws-answer-note">
            Trang đáp án — chỉ dành cho giáo viên, không phát cho học sinh. Bài tập: {assignment.title}
            {assignment.code ? ` (mã ${assignment.code})` : ''}
          </p>
          <ol className="ws-answer-list">
            {questions.map((q, i) => (
              <li key={q.id || i} className="ws-answer-item">
                <strong>Câu {i + 1}:</strong> {resolveCorrectAnswer(q)}
                {q.explanation && (
                  <span className="ws-answer-explain"> — Giải thích: {q.explanation}</span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  );
}
