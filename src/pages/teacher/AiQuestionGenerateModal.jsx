import { questionService } from '../../services/api.js'
import { AiGenerateQuestionsModal } from '../../components/ai/AiGenerateQuestionsModal.jsx'
import { toGameQuestion } from '../../lib/gameQuestionShape.js'

/*
 * Modal "Tạo câu hỏi bằng AI" cho tab Theo game (QuestionManagement):
 * sinh câu hỏi trắc nghiệm cho game đang chọn rồi thêm vào game.
 *
 * Phần luồng + trình bày (form yêu cầu, gọi endpoint THẬT
 * POST /api/ai/quizzes/generate qua hooks/useAiQuestionGenerator +
 * danh sách kết quả có checkbox chọn) nằm ở component DÙNG CHUNG
 * components/ai/AiGenerateQuestionsModal — cùng một bản với tab Câu
 * hỏi và tab Bộ đề của trang Ngân hàng câu hỏi. File này chỉ còn phần
 * riêng của game: câu mô tả theo game đang chọn và cách GHI các câu
 * đã chọn — questionService.save(gameId, [câu cũ…, câu mới đã chuẩn
 * hoá bằng lib/gameQuestionShape]) như trước, rồi trang tải lại.
 *
 * KHÔNG có câu hỏi mẫu/giả lập: AI chưa sẵn sàng thì component chung
 * hiện AiNotReadyNotice dùng chung; câu AI trả về không hợp lệ bị
 * loại khỏi danh sách chọn và báo số lượng (xem hook dùng chung).
 */

export default function AiQuestionGenerateModal({ gameId, gameName = '', gameSubject = '', existingQuestions = [], showToast, onClose, onAdded }) {
  async function addToGame(chosen) {
    if (!gameId) throw new Error('Chưa chọn game để thêm câu hỏi.')
    const normalized = chosen.map((q) => toGameQuestion(q)).filter(Boolean)
    if (!normalized.length) throw new Error('Không có câu hỏi hợp lệ nào để thêm vào game.')
    await questionService.save(gameId, [...(existingQuestions || []), ...normalized])
    showToast?.(`Đã thêm ${normalized.length} câu hỏi AI vào game`)
  }

  return (
    <AiGenerateQuestionsModal
      description={(
        <>
          AI sinh câu hỏi trắc nghiệm cho game <strong className="text-ink">{gameName}</strong>.
          Bạn duyệt từng câu rồi mới thêm vào game — AI không tự thêm hay sửa câu hỏi sẵn có.
        </>
      )}
      subjectField={{ kind: 'text', placeholder: 'VD: Toán' }}
      initialSubject={gameSubject || ''}
      addLabel={(n) => `Thêm ${n} câu đã chọn vào game`}
      onAdd={addToGame}
      onAdded={onAdded}
      onClose={onClose}
    />
  )
}
