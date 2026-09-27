// Trạng thái thú cưng — lưu ở localStorage để không cần API.
// Dùng chung cho: thẻ "Thú cưng" ở trang chủ, bong bóng pet trong game,
// và pet trong prototype Math Adventure (đọc qua window parent / localStorage).
import { useSyncExternalStore } from "react";

const KEY = "edu_pet_v1";

export const PET_DEFAULT = {
  name: "Bồng",
  emoji: "🐶",
  level: 3,
  exp: 120,
  expNeeded: 200,
  mood: "happy",          // happy | excited | sleepy | sad
  moodLabel: "Đang vui",
  bonded: 18,             // độ gắn kết (%) — chỉ để hiển thị
};

export const PET_MOODS = {
  happy: { label: "Đang vui", emoji: "💛" },
  excited: { label: "Rất hào hứng", emoji: "🎉" },
  hungry: { label: "Đói rồi", emoji: "🍽️" },
  sleepy: { label: "Muốn ngủ", emoji: "😴" },
  sad: { label: "Cô đơn", emoji: "💙" },
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...PET_DEFAULT, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...PET_DEFAULT };
}

let state = typeof localStorage !== "undefined" ? read() : { ...PET_DEFAULT };
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn(state);
}

function write() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  emit();
}

export function getPet() {
  return state;
}

export function subscribePet(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Thêm EXP cho pet — tự level-up khi đủ. Trả về { levelUp, pet }. */
export function addPetExp(amount = 10) {
  let levelUp = false;
  let exp = state.exp + amount;
  let level = state.level;
  let expNeeded = state.expNeeded;
  while (exp >= expNeeded) {
    exp -= expNeeded;
    level += 1;
    expNeeded = Math.round(expNeeded * 1.2);
    levelUp = true;
  }
  state = { ...state, exp, level, expNeeded, mood: "excited", moodLabel: PET_MOODS.excited.label };
  write();
  return { levelUp, pet: state };
}

export function setPetMood(mood) {
  const info = PET_MOODS[mood];
  if (!info) return state;
  state = { ...state, mood, moodLabel: info.label };
  write();
  return state;
}

/** Nhận pet hiện tại + level-up vào bộ nhớ tạm để HUD/quiz đọc. */
export function consumeLevelUpFlag() {
  const flag = state.__justLeveledUp;
  if (flag) {
    state = { ...state, __justLeveledUp: false };
    write();
  }
  return !!flag;
}

export const PET_TIPS = [
  "Cùng nhau khám phá thế giới tri thức!",
  "Trả lời đúng nhé, tui hâm mộ bạn lắm!",
  "Mỗi câu đúng là một ngọn lá mới~",
  "Bạn học chăm quá đi!",
  "Nghỉ giải lao chút đi mà 🐾",
];

/** Hook đọc pet state (re-render khi pet đổi). */
export function usePet() {
  return useSyncExternalStore(subscribePet, getPet, getPet);
}

/** Lời ngẫu nhiên của pet. */
export function randomPetTip() {
  return PET_TIPS[Math.floor(Math.random() * PET_TIPS.length)];
}
