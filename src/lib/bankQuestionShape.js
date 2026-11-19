// lib/bankQuestionShape.js
//
// Chuẩn hoá câu hỏi AI (shape của services/aiApi.generateQuestions) về
// đúng shape câu hỏi NGÂN HÀNG (collection `question_banks`) mà form thêm
// tay ở QuestionBankManagement lưu qua questionBankService:
//   { id, content, options: [{ id, content }], correctAnswer, subject,
//     grade, difficulty, icon, explanation, lang, timeLimit, points }
// (correctAnswer là ID của option đúng — server chấm bộ đề bằng
//  isAnswerCorrect so khớp value với correctAnswer, map sai là chấm sai.)
//
// Tính hợp lệ dùng CHUNG isValidAiQuestion của lib/gameQuestionShape.js
// (một nguồn sự thật cho "câu AI có dùng được không": thiếu nội dung, ít
// hơn 2 đáp án, đáp án trùng nội dung, không xác định được đáp án đúng
// đều bị loại) — bản này chỉ khác ở shape đích và metadata của bank.

import { isValidAiQuestion } from "./gameQuestionShape.js";

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

/**
 * Chuẩn hoá 1 câu AI hợp lệ về shape ngân hàng với id MỚI cho câu và
 * từng đáp án (không bao giờ trùng id với câu đã có); correctAnswer
 * được map lại sang id đáp án mới tương ứng. `subject` là KEY môn của
 * bank (vd "viet"), `grade` lớp 1–5 (không hợp lệ → null = chưa phân
 * lớp như buildDoc phía server), `difficulty` easy|medium|hard.
 * Trả null khi câu không hợp lệ (xem isValidAiQuestion).
 */
export function toBankQuestion(q, { subject = "", grade = null, difficulty = "medium" } = {}, makeId = uid) {
  if (!isValidAiQuestion(q)) return null;
  const options = q.options.map((o) => ({ id: makeId("answer"), content: String(o.content).trim() }));
  const correctIdx = q.options.findIndex((o) => String(o.id) === String(q.correctAnswer));
  const g = Number(grade);
  return {
    id: makeId("qbank"),
    content: String(q.content).trim(),
    options,
    correctAnswer: options[correctIdx].id,
    subject: String(subject || ""),
    grade: [1, 2, 3, 4, 5].includes(g) ? g : null,
    difficulty: ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium",
    icon: "",
    explanation: String(q.explanation || "").trim(),
    lang: "vi-VN",
    timeLimit: 15,
    points: 100,
  };
}

/** Nội dung đáp án đúng của một câu bank (rỗng nếu không xác định được). */
export function bankCorrectText(doc) {
  return String(doc?.options?.find((o) => o.id === doc.correctAnswer)?.content || "").trim();
}

/**
 * Chữ ký trùng câu — GIỐNG hệt phía server (questionBankService.createMany
 * dùng `content|đáp án đúng` đã trim + thường hoá để bỏ câu trùng khi
 * nhập bulk). Dùng để khớp câu vừa gửi lên với document thật trong bank.
 */
export function bankSignature(doc) {
  return `${String(doc?.content || "").trim().toLowerCase()}|${bankCorrectText(doc).toLowerCase()}`;
}

/**
 * Sau khi thêm hàng loạt vào bank (createMany KHÔNG trả id các câu đã
 * tạo), khớp từng payload đã gửi với danh sách bank vừa tải lại để lấy
 * id THẬT: ưu tiên id client đã gửi kèm nếu document đó tồn tại (bulk
 * tôn trọng id gửi kèm), nếu không (câu bị bỏ qua vì trùng) thì khớp
 * theo chữ ký sang câu có sẵn trong bank — thêm chính câu đó vào bộ đề
 * là đúng ý người dùng. Trả mảng id theo thứ tự payload, đã khử trùng;
 * payload không khớp được câu nào thì bị bỏ qua.
 */
export function matchBankIds(freshDocs, payloads) {
  const docs = Array.isArray(freshDocs) ? freshDocs : [];
  const byId = new Map(docs.map((d) => [d.id, d]));
  const bySig = new Map();
  for (const d of docs) {
    const sig = bankSignature(d);
    if (sig && !bySig.has(sig)) bySig.set(sig, d.id);
  }
  const out = [];
  const seen = new Set();
  for (const p of Array.isArray(payloads) ? payloads : []) {
    const id = (p?.id && byId.has(p.id)) ? p.id : bySig.get(bankSignature(p));
    if (id && !seen.has(id)) { seen.add(id); out.push(id); }
  }
  return out;
}
