// Mã tuổi (age code) — server CHỈ lưu mã, không bao giờ lưu tuổi thật.
// Bảng giải mã mã → tuổi/lớp nằm phía client (`src/lib/ageCodes.js`), nên
// hồ sơ trên server không lộ thông tin độ tuổi của bé.
export const AGE_CODES = [
  "kid-sprout",
  "kid-blossom",
  "kid-breeze",
  "kid-river",
  "kid-summit",
];

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
