/**
 * ageCodes.js — bảng GIẢI MÃ mã tuổi mà server trả về.
 *
 * Server chỉ giữ một mã opaque (`kid-sprout` … `kid-summit`), trong mã không
 * có số nào — nên muốn biết bé mấy tuổi thì client phải tra bảng này. Đây là
 * chỗ duy nhất dịch mã ↔ lớp/tuổi, các trang chỉ việc gọi helper.
 *
 *   ageCodeForGrade(3)        → "kid-breeze"
 *   gradeForAgeCode("kid-breeze") → 3
 *   ageForAgeCode("kid-breeze")   → 8
 *   syncKidFromAccount(user)  → điền lớp + giới tính từ hồ sơ vào kidSettings
 */

import { setKidSettings, ageForGrade } from "./kidSettings.js";

/** Mã → lớp; tuổi suy ra từ lớp qua `AGE_BY_GRADE` của kidSettings. */
export const GRADE_BY_AGE_CODE = {
  "kid-sprout": 1,
  "kid-blossom": 2,
  "kid-breeze": 3,
  "kid-river": 4,
  "kid-summit": 5,
};

export const AGE_CODES = Object.keys(GRADE_BY_AGE_CODE);

export function isAgeCode(value) {
  return Object.prototype.hasOwnProperty.call(GRADE_BY_AGE_CODE, String(value || ""));
}

export function gradeForAgeCode(code) {
  return GRADE_BY_AGE_CODE[String(code || "")] ?? null;
}

/** Tuổi thật của bé — chỉ tồn tại ở phía client. */
export function ageForAgeCode(code) {
  const grade = gradeForAgeCode(code);
  return grade == null ? null : ageForGrade(grade);
}

export function ageCodeForGrade(grade) {
  const n = Number(grade);
  if (!Number.isFinite(n)) return null;
  return AGE_CODES.find((c) => GRADE_BY_AGE_CODE[c] === n) || null;
}

/**
 * Hồ sơ tài khoản là nguồn thật về lớp + giới tính của bé: đăng nhập ở máy
 * khác thì mã tuổi trong `user` quyết định độ khó và avatar, không phải bản
 * localStorage cũ.
 */
export function syncKidFromAccount(user) {
  const patch = {};
  const grade = gradeForAgeCode(user?.ageCode);
  if (grade != null) patch.grade = grade;
  if (user?.gender === "boy" || user?.gender === "girl") patch.gender = user.gender;
  if (!Object.keys(patch).length) return;
  // Không đụng flag `onboarded`: khách chưa đi qua màn chào mà đăng nhập bằng
  // tài khoản lớn thì vẫn nên thấy màn chào.
  setKidSettings(patch);
}
