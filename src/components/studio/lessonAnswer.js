// So đáp án câu hỏi bài học TẠI CLIENT — chỉ dùng cho chế độ XEM TRƯỚC
// của giáo viên (dữ liệu đang soạn còn correctAnswer tại chỗ). Phía học
// sinh thật KHÔNG dùng hàm này: DTO /lessons/published đã lọc sạch
// correctAnswer, việc chấm phải diễn ra phía server (đợt tích hợp player).
// Ngữ nghĩa bám đúng server/src/lib/gradeAnswer.js:
//   fill   → trim + không phân biệt hoa thường
//   single → so id của phương án (cho phép lệch kiểu string/number)
export function isLessonAnswerCorrect(el, value) {
  const p = el?.props || {};
  if (p.qtype === "fill") {
    return String(value ?? "").trim().toLowerCase() === String(p.correctAnswer ?? "").trim().toLowerCase();
  }
  if (value == null || p.correctAnswer == null || p.correctAnswer === "") return false;
  return value === p.correctAnswer || String(value) === String(p.correctAnswer);
}
