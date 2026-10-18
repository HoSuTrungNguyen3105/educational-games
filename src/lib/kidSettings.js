/**
 * kidSettings.js — thông tin bé + cài đặt dành cho phụ huynh.
 *
 * Lưu ở localStorage và báo cho mọi component đang mở qua
 * `useSyncExternalStore` → sửa ở trang profile thì trang chủ đổi ngay,
 * không cần tải lại.
 *
 * Nguồn sự thật là `grade` (Lớp 1 → Lớp 5); `age` được SUY RA từ lớp nên
 * hai chỗ không thể lệch nhau. Trong object trả về vẫn có `age` để các nơi
 * đang đọc `settings.age` không phải sửa.
 *
 *   useKidSettings()                → { name, grade, gender, bilingual, englishFirst, age }
 *   setKidSettings({ grade: 3 })    → sửa lớp (age tự đổi theo)
 *   setKidSettings({ age: 9 })      → sửa tuổi (lớp tự đổi theo)
 *   isOnboarded() / completeOnboarding()
 */

import { useSyncExternalStore } from "react";

const KEY = "gq_kid_settings_v1";

export const GRADE_MIN = 1;
export const GRADE_MAX = 5;

/** Lớp 1 = 6 tuổi … Lớp 5 = 10 tuổi. */
export const AGE_BY_GRADE = { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10 };
const GRADE_BY_AGE = { 6: 1, 7: 2, 8: 3, 9: 4, 10: 5 };

const DEFAULTS = {
  /** Họ tên bé do phụ huynh nhập ở màn chào đầu tiên. */
  name: "",
  /** Lớp đang học, 1–5. */
  grade: 2,
  /** "boy" | "girl" | null */
  gender: null,
  /** Bật hiện chữ tiếng Anh dưới chữ Việt. */
  bilingual: true,
  /** Thứ tự hiển thị: true = Anh trên, Việt dưới. */
  englishFirst: true,
  /** Bé đã đi qua màn chào đầu tiên chưa. */
  onboarded: false,
};

/** Kẹp lớp về 1–5. Giá trị không phải số thì lấy Lớp 2 (mặc định).
 *  Dùng `Number.isFinite` chứ không phải `||` — vì `0 || 2` sẽ ra 2. */
export const clampGrade = (g) => {
  const n = Number(g);
  if (!Number.isFinite(n)) return 2;
  return Math.min(GRADE_MAX, Math.max(GRADE_MIN, n));
};
export const ageForGrade = (g) => AGE_BY_GRADE[clampGrade(g)];
/** Tuổi ngoài 6–10 thì chọn lớp biên (thấp nhất / cao nhất), không nhảy về Lớp 2. */
export const gradeForAge = (a) => {
  const n = Number(a);
  if (!Number.isFinite(n)) return 2;
  return GRADE_BY_AGE[n] ?? (n < AGE_BY_GRADE[GRADE_MIN] ? GRADE_MIN : GRADE_MAX);
};
export const gradeLabel = (g) => `Lớp ${clampGrade(g)}`;
/** Nhãn lớp hiển thị cạnh tuổi — luôn lấy từ tuổi đang chọn. */
export const ageBandLabel = (age) => gradeLabel(gradeForAge(age));
/** Danh sách tuổi để dựng thanh trượt trong Cài đặt. */
export const AGE_MIN = AGE_BY_GRADE[GRADE_MIN];
export const AGE_MAX = AGE_BY_GRADE[GRADE_MAX];
export const AGE_RANGE = Object.values(AGE_BY_GRADE);

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    // Dữ liệu cũ từng lưu `age` (2–8) chứ không có `grade` → suy ra lớp.
    if (!raw.grade && raw.age) raw.grade = gradeForAge(raw.age);
    return { ...DEFAULTS, ...raw };
  } catch {
    return { ...DEFAULTS };
  }
}

let state = read();
const listeners = new Set();

const emit = () => { for (const fn of listeners) fn(); };
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

/** Object cài đặt kèm `age` tính sẵn từ `grade`. */
export function getKidSettings() {
  return { ...state, age: ageForGrade(state.grade) };
}

export function setKidSettings(patch) {
  const next = { ...patch };
  // Nhận `age` thì tự quy ra lớp để hai chiều không lệch nhau.
  if (next.age !== undefined && next.grade === undefined) next.grade = gradeForAge(next.age);
  state = { ...state, ...next, grade: next.grade !== undefined ? clampGrade(next.grade) : state.grade };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* localStorage bị chặn — vẫn dùng trong phiên này */ }
  emit();
}

/** Đọc cài đặt trong React; tự cập nhật khi có nơi khác sửa. */
export function useKidSettings() {
  return useSyncExternalStore(subscribe, getKidSettings, getKidSettings);
}

/** Đã đi qua màn chào chưa (dùng để chặn ở App). */
export function isOnboarded() {
  return !!state.onboarded;
}

/** Lưu lại kết quả màn chào và đóng gói theo shape của store. */
export function completeOnboarding({ name, grade, gender }) {
  setKidSettings({
    name: String(name || "").trim(),
    grade: clampGrade(grade),
    gender: gender || null,
    onboarded: true,
  });
}

/** Tên gọi tắt của bé (lấy chữ đầu của họ + tên). */
export function kidShortName(name = state.name) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Bé";
  return parts.length === 1 ? parts[0] : `${parts[parts.length - 2][0]}. ${parts[parts.length - 1]}`;
}

/** Mẫu câu đối với phần Song ngữ (tiếng Việt / tiếng Anh). */
export const BILINGUAL_SAMPLES = [
  { vi: "Con mèo", en: "cat" },
  { vi: "Chú chó", en: "dog" },
  { vi: "Quả bóng", en: "ball" },
];