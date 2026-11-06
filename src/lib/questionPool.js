import { questionService, questionBankService } from "../services/api.js";

/**
 * Nguồn câu hỏi cho luồng bài giao (tạo/sửa/làm bài).
 *
 * Ngân hàng câu hỏi (`GET /question-banks`) là nguồn chuẩn — trang Tạo bài
 * chỉ chọn từ bank. Câu hỏi theo game (`GET /questions`) chỉ còn là nguồn cũ:
 * các bài giao đã tạo trước đây mang id câu hỏi game nên khi SỬA bài và khi
 * học sinh LÀM BÀI vẫn phải tra được chúng. Helper này gộp hai pool, khử
 * trùng theo id (pool game trước, bank bổ sung phần còn thiếu).
 *
 * - `ids`: khi truyền vào, chỉ gọi bank nếu có id chưa thấy trong pool game
 *   (trang làm bài — tránh tải cả bank khi không cần).
 * - `stripBankAnswers`: bỏ `correctAnswer` khỏi câu hỏi bank trước khi trả
 *   (trang làm bài phía học sinh — đáp án đúng chỉ do server giữ để chấm,
 *   giống cách GET /questions đã lược bỏ cho học sinh).
 */
export async function loadMergedQuestionPool({ ids = null, stripBankAnswers = false } = {}) {
  const gameQs = await questionService.listAll().catch(() => []);
  const pool = new Map();
  for (const q of Array.isArray(gameQs) ? gameQs : []) {
    if (q && q.id && !pool.has(q.id)) pool.set(q.id, q);
  }

  const needBank = !ids || ids.some((id) => !pool.has(id));
  if (needBank) {
    const bankQs = await questionBankService.list({ limit: 5000 }).catch(() => []);
    for (const q of Array.isArray(bankQs) ? bankQs : []) {
      if (!q || !q.id || pool.has(q.id)) continue;
      if (stripBankAnswers) {
        const { correctAnswer, ...rest } = q;
        pool.set(q.id, rest);
      } else {
        pool.set(q.id, q);
      }
    }
  }
  return [...pool.values()];
}
