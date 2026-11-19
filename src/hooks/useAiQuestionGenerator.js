// hooks/useAiQuestionGenerator.js
//
// Lõi sinh câu hỏi bằng AI DÙNG CHUNG cho mọi nơi cần luồng:
//   nhập yêu cầu (prompt) + môn/lớp/độ khó/số câu → gọi endpoint THẬT
//   POST /api/ai/quizzes/generate qua services/aiApi.generateQuestions
//   → lọc câu hợp lệ → người dùng tích chọn từng câu.
//
// Trước đây logic này nằm trọn trong AiQuestionGenerateModal (tab Theo
// game); trang Ngân hàng câu hỏi (tab Câu hỏi + tab Bộ đề) cần đúng
// cùng một luồng nên tách ra hook này — modal game và modal ngân hàng
// chỉ khác nhau ở cách TRÌNH BÀY trường môn và việc GHI các câu đã chọn
// (vào game / vào bank / vào bộ đề), phần còn lại dùng chung một chỗ.
//
// KHÔNG có câu hỏi mẫu/giả lập: AI chưa sẵn sàng thì trạng thái lấy từ
// useAiAvailability dùng chung (AiNotReadyNotice hiện thay), lỗi 429/
// quá tải hiện nguyên thông báo thân thiện của aiApi qua aiErrorText.
// Câu AI trả về không hợp lệ (thiếu đáp án đúng, đáp án trùng nội dung,
// thiếu nội dung/đáp án — aiApi đã lọc một phần và đếm vào `skipped`)
// bị loại khỏi danh sách chọn và cộng vào `result.dropped` để UI báo số
// lượng rõ ràng.

import { useRef, useState } from "react";
import { generateQuestions } from "../services/aiApi.js";
import { markAiFailed, markAiReady, useAiAvailability } from "./useAiAvailability.js";
import { aiErrorText } from "../components/ai/aiErrorText.js";
import { isValidAiQuestion } from "../lib/gameQuestionShape.js";

export const AI_QUESTION_COUNTS = [3, 5, 10];

/**
 * @param {object} [init]
 * @param {string} [init.subject]        Giá trị môn ban đầu (theo ngữ cảnh nơi gọi:
 *                                       tên môn tự do ở game, KEY môn ở ngân hàng).
 * @param {(value:string)=>string} [init.subjectText] Đổi giá trị môn thành TÊN môn
 *                                       gửi cho endpoint AI (ngân hàng lưu key "viet"
 *                                       nhưng AI cần "Tiếng Việt"). Mặc định giữ nguyên.
 * @param {number} [init.grade]          Lớp ban đầu (1–5).
 * @param {string} [init.difficulty]     easy | medium | hard.
 * @param {number} [init.count]          Số câu mỗi lần sinh (3/5/10).
 */
export function useAiQuestionGenerator({ subject = "", subjectText, grade = 3, difficulty = "medium", count = 5 } = {}) {
  const ai = useAiAvailability();
  const [prompt, setPrompt] = useState("");
  const [subjectValue, setSubject] = useState(subject || "");
  const [gradeValue, setGrade] = useState([1, 2, 3, 4, 5].includes(Number(grade)) ? Number(grade) : 3);
  const [difficultyValue, setDifficulty] = useState(difficulty || "medium");
  const [countValue, setCount] = useState(AI_QUESTION_COUNTS.includes(Number(count)) ? Number(count) : 5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // { questions: câu HỢP LỆ (shape aiApi), dropped: tổng số câu bị loại, warnings }
  const [result, setResult] = useState(null);
  const [picked, setPicked] = useState(() => new Set());
  const abortRef = useRef(null);

  const chosen = result ? result.questions.filter((q) => picked.has(q.id)) : [];

  const togglePick = (id) => setPicked((s) => {
    const next = new Set(s);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const pickAll = () => setPicked(new Set((result?.questions || []).map((q) => q.id)));
  const pickNone = () => setPicked(new Set());
  const abort = () => abortRef.current?.abort();

  async function run() {
    if (busy || ai.showNotice) return;
    const subj = String(subjectText ? subjectText(subjectValue) : subjectValue).trim();
    const topic = prompt.trim();
    if (!subj) { setError("Hãy nhập môn học để AI sinh câu hỏi đúng chương trình."); return; }
    if (!topic) { setError("Hãy nhập yêu cầu cho AI (chủ đề cần sinh câu hỏi)."); return; }
    setError(""); setBusy(true); setResult(null);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await generateQuestions({ subject: subj, grade: gradeValue, topic, difficulty: difficultyValue, count: countValue, signal: ctrl.signal });
      markAiReady();
      const valid = [];
      let dropped = res.skipped || 0;
      for (const q of res.questions) {
        if (isValidAiQuestion(q)) valid.push(q);
        else dropped += 1;
      }
      setResult({ questions: valid, dropped, warnings: res.warnings || [] });
      setPicked(new Set(valid.map((q) => q.id)));
      if (!valid.length) {
        setError("AI không sinh được câu hỏi nào hợp lệ (câu trả về thiếu đáp án đúng hoặc đáp án trùng nhau). Hãy thử diễn đạt lại yêu cầu.");
      }
    } catch (e) {
      markAiFailed(e);
      // 503 "đang được cấu hình" đã có thẻ AiNotReadyNotice nói thay —
      // không lặp lại cùng một câu trong hộp lỗi bên dưới.
      const configuring = e?.status === 503 && /đang được cấu hình/i.test(e?.message || "");
      if (!ctrl.signal.aborted && !configuring) setError(aiErrorText(e));
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return {
    ai,
    prompt, setPrompt,
    subject: subjectValue, setSubject,
    grade: gradeValue, setGrade,
    difficulty: difficultyValue, setDifficulty,
    count: countValue, setCount,
    busy, error, result, picked, chosen,
    togglePick, pickAll, pickNone, run, abort,
  };
}
