// utils/id.js — ID ngẫu nhiên dùng chung cho mọi service/route.
// Trước đây mỗi file tự có bản sao local; giữ NGUYÊN format sinh ra.

/** ID ngẫu nhiên có tiền tố: `question-3f9k2ab1`. */
export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/** ID kèm timestamp dạng số (vẫn sắp xếp được theo thời gian): `conv-1730000000000-9ab1c2`. */
export function timeUid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** ID kèm timestamp base36: `log-mfn2xk9a-9ab1c2`. */
export function stampUid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
