// lib/gameQuestionShape.js
//
// Chuẩn hoá câu hỏi AI (shape của services/aiApi.generateQuestions) về
// đúng shape câu hỏi GAME mà form thêm tay ở QuestionManagement lưu qua
// questionService.save:
//   { id, content, options: [{ id, content }], correctAnswer,
//     timeLimit, points }
// (correctAnswer là ID của option đúng; timeLimit/points lấy mặc định
// 15 giây / 100 điểm như form thêm tay.)
//
// Đây là nguồn sự thật duy nhất cho việc "câu AI có đưa vào game được
// không": câu thiếu nội dung, ít hơn 2 đáp án, đáp án trùng nội dung
// nhau, hoặc không xác định được đáp án đúng đều KHÔNG hợp lệ — modal
// "Tạo câu hỏi bằng AI" loại các câu này khỏi danh sách chọn và báo số
// câu bị loại, không đưa câu rác vào game.

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

/** Câu AI có đủ chuẩn để đưa vào game không (chưa chuẩn hoá id). */
export function isValidAiQuestion(q) {
  if (!q || typeof q !== "object") return false;
  if (!String(q.content || "").trim()) return false;
  const options = Array.isArray(q.options) ? q.options : [];
  if (options.length < 2) return false;
  const seen = new Set();
  for (const o of options) {
    const text = String(o?.content || "").trim().toLowerCase();
    if (!text || seen.has(text)) return false;
    seen.add(text);
  }
  const correct = String(q.correctAnswer || "");
  return !!correct && options.some((o) => o && String(o.id) === correct);
}

/**
 * Chuẩn hoá 1 câu AI hợp lệ về shape câu hỏi game với id MỚI (cho câu
 * và từng đáp án) để không bao giờ trùng id với câu đã có trong game;
 * correctAnswer được map lại sang id đáp án mới tương ứng.
 * Trả null khi câu không hợp lệ (xem isValidAiQuestion).
 */
export function toGameQuestion(q, makeId = uid) {
  if (!isValidAiQuestion(q)) return null;
  const options = q.options.map((o) => ({ id: makeId("answer"), content: String(o.content).trim() }));
  const correctIdx = q.options.findIndex((o) => String(o.id) === String(q.correctAnswer));
  return {
    id: makeId("question"),
    content: String(q.content).trim(),
    options,
    correctAnswer: options[correctIdx].id,
    timeLimit: 15,
    points: 100,
  };
}
