// ─── Metadata ngân hàng câu hỏi DÙNG CHUNG ────────────────────────────────
// Trước đây SK/GRADES/subjKey/subjLabel + logic lọc câu hỏi nằm riêng trong
// QuestionBankManagement.jsx; mục Bộ đề (QuestionSetsPanel) cần đúng các
// helper đó để bộ chọn câu hỏi lọc giống hệt trang ngân hàng — tách ra lib
// làm một nguồn sự thật duy nhất, tránh hai nơi lệch nhau.

export const SK = { viet: 'Tiếng Việt', eng: 'Tiếng Anh', sci: 'Khoa học', geo: 'Địa lí – Lịch sử', custom: 'Thầy cô ra đề' }
export const SK_KEYS = Object.keys(SK)
export const GRADES = [1, 2, 3, 4, 5]

/** Subject trong DB có thể là id ("viet") hoặc nhãn ("Tiếng Việt") — quy về id. */
export function subjKey(d) {
  const s = String(d?.subject || '').trim()
  if (!s) return 'custom'
  if (SK_KEYS.includes(s)) return s
  const hit = SK_KEYS.find((k) => SK[k] === s)
  return hit || s
}
export const subjLabel = (k) => SK[k] || k

/**
 * Một câu bank có khớp bộ lọc (môn/lớp/tìm kiếm) hay không — dùng chung cho
 * danh sách câu hỏi của trang Ngân hàng và bộ chọn câu hỏi của Bộ đề.
 * `grade` = 0 nghĩa là mọi lớp; câu chưa phân lớp được tính là lớp 1 như
 * cách trang ngân hàng vẫn hiển thị.
 */
export function bankQuestionMatches(d, s, { subj = 'all', grade = 0, search = '' } = {}) {
  const ql = String(search || '').trim().toLowerCase()
  return (subj === 'all' || s === subj)
    && (!grade || (d.grade || 1) === grade)
    && (!ql || `${d.content} ${(d.options || []).map((o) => o.content).join(' ')}`.toLowerCase().includes(ql))
}
