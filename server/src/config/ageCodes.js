// Mã tuổi (age code) — server CHỈ lưu mã, không bao giờ lưu tuổi thật.
// Bảng giải mã mã → TUỔI nằm phía client (`src/lib/ageCodes.js`), nên hồ
// sơ trên server không lộ tuổi thật của bé.
//
// Ngoại lệ có chủ đích (đặc tả update_features.md, Nguyên duyệt 2026-11-10):
// server ĐƯỢC suy ra KHỐI LỚP (1–5) từ mã — chỉ là số lớp để cá nhân hoá
// câu trả lời của AI Bạn Học theo vai trò/khối lớp, KHÔNG phải tuổi thật,
// và KHÔNG ghi thêm trường nào vào hồ sơ học sinh. Giá trị phải KHỚP HỆT
// bảng client `GRADE_BY_AGE_CODE` trong `src/lib/ageCodes.js` — sửa một
// phía thì phải sửa cả phía còn lại.
export const AGE_CODES = [
  "kid-sprout",
  "kid-blossom",
  "kid-breeze",
  "kid-river",
  "kid-summit",
];

/** Mã tuổi → khối lớp 1–5. Khớp hệt `GRADE_BY_AGE_CODE` phía client. */
export const GRADE_BY_AGE_CODE = {
  "kid-sprout": 1,
  "kid-blossom": 2,
  "kid-breeze": 3,
  "kid-river": 4,
  "kid-summit": 5,
};

/**
 * Khối lớp suy từ mã tuổi của hồ sơ. Trả null khi mã trống/lạ — caller
 * phải dùng chế độ TRUNG TÍNH (không đoán lớp) trong trường hợp đó.
 */
export function gradeForAgeCode(value) {
  const code = String(value || "").trim();
  return Object.prototype.hasOwnProperty.call(GRADE_BY_AGE_CODE, code)
    ? GRADE_BY_AGE_CODE[code]
    : null;
}

export const GENDERS = ["boy", "girl"];

/** Trả về mã hợp lệ, hoặc null khi client gửi giá trị lạ. */
export function normalizeAgeCode(value) {
  const code = String(value || "").trim();
  return AGE_CODES.includes(code) ? code : null;
}

export function normalizeGender(value) {
  const g = String(value || "").trim().toLowerCase();
  return GENDERS.includes(g) ? g : null;
}
